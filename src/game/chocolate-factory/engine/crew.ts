// ============================================================
// THE CHOCOLATE FACTORY — WORKER STATE MACHINE
//
// Every factory worker is driven by the same loop:
//
//   IDLE ─ receive task ─ WALK_TO_TARGET ─ arrive ─ TURN_TO_WORK ─ PERFORM_TASK
//     ▲                                                               │
//     └──────────────── next queued task, or back to routine ─────────┘
//
// Workers physically travel every metre: a path through the navigation graph,
// speeding up, slowing into corners, braking to a stop at the station, then
// turning to face the machine before any work begins. Nothing teleports.
//
// WHAT a task does to the factory (pour cocoa, start a machine, load a box)
// is not decided here — the foreman in factorySim supplies that through the
// `work` hook. This file only makes the person get there and do it.
//
// Stuck detection: a walking worker who barely moves for a couple of seconds
// re-plans their route, then tries a route around the blocked node, then a
// direct line, and finally reports a navigation failure so the foreman's
// fallbacks can keep the production chain (and the maths) moving.
// ============================================================

import type { TeamId } from '../types';
import { angleDelta, dist, headingTo, polylineLength, samplePolyline, type Vec3 } from '../world/geom';
import { stationFace, stationPos, walkPath, type StationId } from './crewNav';

export type WorkerRole = 'loader' | 'operator' | 'inspector' | 'packer' | 'hauler';
export type WorkerState = 'IDLE' | 'WALK_TO_TARGET' | 'TURN_TO_WORK' | 'PERFORM_TASK';

export type TaskType =
  // production — created by a correct fraction
  | 'FETCH_INGREDIENT' | 'TRANSFER_INGREDIENT' | 'GUIDE_FORKLIFT'
  | 'OPERATE_MIXER' | 'OPERATE_MOLDER' | 'START_COOLING' | 'CHECK_CUT'
  | 'PACKAGE_PRODUCT' | 'FETCH_CART' | 'LOAD_CART' | 'MOVE_PACKAGE' | 'LOAD_TRUCK'
  | 'RETURN_CART' | 'UNLOAD_FORKLIFT'
  // routine — what the crew do between orders
  | 'RESTOCK_PICKUP' | 'RESTOCK_DROP' | 'CHECK_BATCH' | 'MACHINE_ROUNDS' | 'PREP_BOXES' | 'TRUCK_CHECK' | 'STAND_BY';

/** Body animation the renderer plays for the current moment. */
export type WorkAnim = 'idle' | 'pour' | 'operate' | 'inspect' | 'pack' | 'pickup' | 'load' | 'push';
export type CarryItem = 'none' | 'sack' | 'box';
export type Pace = 'walk' | 'carry' | 'push';

export interface CrewTask {
  id: number;
  type: TaskType;
  station: StationId;
  /** Animation while working at the station. */
  anim: WorkAnim;
  pace: Pace;
  /** Production tasks are never pre-empted by routine work. */
  production: boolean;
  /** Seconds of work for simple routine tasks; production tasks end via the hook. */
  duration: number;
  status: 'queued' | 'walking' | 'turning' | 'working' | 'done';
  progress: number;
  productId?: string;
}

export interface Worker {
  id: string;
  label: string;
  role: WorkerRole;
  team: TeamId;

  pos: Vec3;
  heading: number;
  speed: number;

  state: WorkerState;
  task: CrewTask | null;
  queue: CrewTask[];

  path: Vec3[];
  pathNodes: StationId[];
  travel: number;

  anim: WorkAnim;
  carry: CarryItem;
  /** Pushing the team's cart in front of them. */
  pushingCart: boolean;
  workT: number;

  // stuck detection
  checkPos: Vec3;
  checkT: number;
  stuckT: number;
  recoveries: number;
  navFailures: number;
  /** Routine rotation index — which routine stop comes next. */
  routine: number;

  // renderer compatibility
  moving: boolean;
  carrying: boolean;
  phase: number;
}

export const WALK_SPEED = 3.3;
export const CARRY_SPEED = 2.7;
export const PUSH_SPEED = 2.4;
const ACCEL = 5.5;
const DECEL = 7.5;
const TURN_RATE = 6.5;
const ARRIVE_EPS = 0.03;
const STUCK_WINDOW = 1.0;
const STUCK_MIN_MOVE = 0.12;

let taskSeq = 0;

export function makeTask(
  type: TaskType, station: StationId,
  opts: { anim?: WorkAnim; pace?: Pace; production?: boolean; duration?: number; productId?: string } = {}
): CrewTask {
  return {
    id: ++taskSeq, type, station,
    anim: opts.anim ?? 'idle',
    pace: opts.pace ?? 'walk',
    production: opts.production ?? false,
    duration: opts.duration ?? 0,
    status: 'queued', progress: 0, productId: opts.productId,
  };
}

export function makeWorker(team: TeamId, id: string, label: string, role: WorkerRole, at: StationId): Worker {
  const p = stationPos(team, at);
  const face = stationFace(team, at);
  return {
    id, label, role, team,
    pos: { x: p.x, y: 0, z: p.z },
    heading: face ? headingTo(p, face) : 0,
    speed: 0,
    state: 'IDLE', task: null, queue: [],
    path: [], pathNodes: [], travel: 0,
    anim: 'idle', carry: 'none', pushingCart: false, workT: 0,
    checkPos: { x: p.x, y: 0, z: p.z }, checkT: 0, stuckT: 0, recoveries: 0, navFailures: 0,
    routine: 0,
    moving: false, carrying: false, phase: Math.random() * 6,
  };
}

export const isOnProduction = (w: Worker): boolean =>
  (w.task?.production ?? false) || w.queue.some((t) => t.production);

export const hasTask = (w: Worker, type: TaskType): boolean =>
  w.task?.type === type || w.queue.some((t) => t.type === type);

/**
 * Hands a worker a list of tasks. Production work replaces any routine work in
 * progress (the worker simply turns and heads for the new job from where they
 * stand); routine work never interrupts production.
 */
export function assignTasks(w: Worker, tasks: CrewTask[], preempt = true) {
  if (preempt && w.task && !w.task.production) {
    w.task = null;
    w.state = 'IDLE';
    w.path = [];
  }
  w.queue.push(...tasks);
}

function beginTask(w: Worker, task: CrewTask) {
  w.task = task;
  w.workT = 0;
  const target = stationPos(w.team, task.station);
  if (dist(w.pos, target) < 0.08) {
    w.path = [];
    w.pathNodes = [task.station];
    task.status = 'turning';
    w.state = 'TURN_TO_WORK';
    return;
  }
  planRoute(w);
  task.status = 'walking';
  w.state = 'WALK_TO_TARGET';
}

function planRoute(w: Worker, avoid?: StationId) {
  const task = w.task!;
  const plan = walkPath(w.team, w.pos, task.station, avoid);
  if (plan && plan.points.length >= 2) {
    w.path = plan.points;
    w.pathNodes = plan.nodes;
  } else {
    // No graph route: a direct line is still a real walk, and is flagged.
    w.navFailures++;
    w.path = [{ ...w.pos }, stationPos(w.team, task.station)];
    w.pathNodes = [task.station];
  }
  w.travel = 0;
  w.checkPos = { ...w.pos };
  w.checkT = 0;
}

export interface CrewHooks {
  /** Called every frame a worker is working at their station; return true when the task is finished. */
  work: (w: Worker, task: CrewTask, dt: number) => boolean;
  /** Called once when a worker arrives and begins work. */
  onStart?: (w: Worker, task: CrewTask) => void;
  /** Called once a task completes. */
  onDone?: (w: Worker, task: CrewTask) => void;
  /** Supplies routine work when a worker's queue is empty. */
  routine: (w: Worker) => CrewTask | null;
}

export function stepWorker(w: Worker, others: Worker[], hooks: CrewHooks, dt: number) {
  w.carrying = w.carry !== 'none';

  if (!w.task) {
    const next = w.queue.shift() ?? hooks.routine(w);
    if (next) beginTask(w, next);
    else { w.state = 'IDLE'; w.anim = 'idle'; }
  }

  const task = w.task;
  if (!task) { settle(w, dt); return; }

  switch (w.state) {
    case 'WALK_TO_TARGET': {
      w.anim = w.pushingCart ? 'push' : 'idle';
      if (walk(w, others, task, dt)) {
        w.speed = 0;
        task.status = 'turning';
        w.state = 'TURN_TO_WORK';
      }
      break;
    }

    case 'TURN_TO_WORK': {
      settle(w, dt);
      const face = stationFace(w.team, task.station);
      if (face) {
        const want = headingTo(w.pos, face);
        const d = angleDelta(w.heading, want);
        const stepMax = TURN_RATE * dt;
        w.heading += Math.max(-stepMax, Math.min(stepMax, d));
        if (Math.abs(d) > 0.06) break;
        w.heading = want;
      }
      task.status = 'working';
      w.state = 'PERFORM_TASK';
      w.workT = 0;
      hooks.onStart?.(w, task);
      break;
    }

    case 'PERFORM_TASK': {
      settle(w, dt);
      w.workT += dt;
      w.anim = task.anim;
      const finished = hooks.work(w, task, dt);
      if (finished) {
        task.status = 'done';
        task.progress = 1;
        hooks.onDone?.(w, task);
        w.task = null;
        w.state = 'IDLE';
        w.anim = w.pushingCart ? 'push' : 'idle';
      }
      break;
    }

    default:
      beginTask(w, task);
  }
}

/** Standing still: speed bleeds off, no drifting. */
function settle(w: Worker, dt: number) {
  w.speed = Math.max(0, w.speed - DECEL * dt);
  w.moving = false;
}

/** Moves along the planned path. Returns true on arrival. */
function walk(w: Worker, others: Worker[], task: CrewTask, dt: number): boolean {
  if (w.path.length < 2) planRoute(w);
  const total = polylineLength(w.path);
  const remaining = total - w.travel;
  if (remaining <= ARRIVE_EPS) return true;

  const maxSpeed = task.pace === 'push' || w.pushingCart ? PUSH_SPEED : task.pace === 'carry' ? CARRY_SPEED : WALK_SPEED;

  // Brake so we stop ON the station rather than overshooting it.
  let target = Math.min(maxSpeed, Math.sqrt(2 * DECEL * remaining) + 0.15);

  // Slow for the corner we are turning through.
  const ahead = samplePolyline(w.path, Math.min(total, w.travel + 0.6), 0);
  const turnErr = Math.abs(angleDelta(w.heading, ahead.heading));
  if (turnErr > 0.5) target = Math.min(target, maxSpeed * Math.max(0.3, 1 - turnErr / 2.4));

  // Give way to a colleague right in front — slow down, never freeze.
  const fx = -Math.sin(w.heading);
  const fz = -Math.cos(w.heading);
  for (const o of others) {
    if (o === w) continue;
    const dx = o.pos.x - w.pos.x;
    const dz = o.pos.z - w.pos.z;
    const d = Math.hypot(dx, dz);
    if (d < 1.2 && d > 1e-3 && (dx * fx + dz * fz) / d > 0.55) {
      // The lower id yields so two workers never both wait for each other.
      if (w.id > o.id || o.speed < 0.2) target = Math.min(target, 0.9);
    }
  }

  const rate = target > w.speed ? ACCEL : DECEL;
  w.speed += Math.max(-rate * dt, Math.min(rate * dt, target - w.speed));
  w.travel = Math.min(total, w.travel + w.speed * dt);

  const s = samplePolyline(w.path, w.travel, 0);
  w.pos = { x: s.pos.x, y: 0, z: s.pos.z };
  // Body faces where it is walking, turning smoothly (rate limited).
  const d = angleDelta(w.heading, s.heading);
  const turnMax = TURN_RATE * dt;
  w.heading += Math.max(-turnMax, Math.min(turnMax, d * Math.min(1, 10 * dt)));
  w.moving = w.speed > 0.12;
  task.progress = total > 0 ? w.travel / total : 1;

  detectStuck(w, dt);
  return total - w.travel <= ARRIVE_EPS;
}

function detectStuck(w: Worker, dt: number) {
  w.checkT += dt;
  if (w.checkT < STUCK_WINDOW) return;
  const moved = dist(w.pos, w.checkPos);
  w.checkT = 0;
  w.checkPos = { ...w.pos };
  if (moved >= STUCK_MIN_MOVE) { w.stuckT = 0; return; }

  w.stuckT += STUCK_WINDOW;
  if (w.stuckT < 2) return;

  w.recoveries++;
  w.stuckT = 0;
  const attempt = w.recoveries % 4;
  if (attempt === 1) {
    planRoute(w);                                   // 1. re-plan from here
  } else if (attempt === 2) {
    planRoute(w, w.pathNodes[1] ?? undefined);      // 2. route around the next node
  } else if (attempt === 3) {
    w.path = [{ ...w.pos }, stationPos(w.team, w.task!.station)];   // 3. direct line
    w.travel = 0;
  } else {
    w.navFailures++;                                // 4. give up on this route
    w.path = [{ ...w.pos }, stationPos(w.team, w.task!.station)];
    w.travel = 0;
    w.speed = WALK_SPEED * 0.6;
  }
}
