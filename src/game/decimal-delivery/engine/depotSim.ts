// ============================================================
// THE DECIMAL DELIVERY NETWORK — DEPOT SIMULATION
//
// The physical half of the game. Mutable state outside React, stepped once per
// frame, read directly by the 3D components. Nothing here writes to the
// zustand store on a per-frame basis: driving a React store at 60 Hz would
// re-render both consoles every frame.
//
// THE CHAIN THIS FILE EXISTS TO IMPLEMENT — the heart of the game:
//
//   forklift brings pallet -> parcel lands on the scale -> player answers
//   -> scale confirms -> conveyor starts -> parcel moves -> scanner fires
//   -> sort gate opens -> worker carries it -> truck loads -> money awarded
//
// Each team runs its own completely independent copy, so Blue processing an
// order can never stall Red.
// ============================================================

import type { TeamId, ParcelStage, PackageShape } from '../types';
import {
  sideOf, parcelJourney, lerpVec, headingTo, forkliftRoute, sampleRoute,
  truckDepartureRoute, routeLength, type Vec3,
} from './depotLayout';

// ── WORKER ──────────────────────────────────────────────────────────────────
// A deliberately small state machine. Workers walk between fixed posts, face
// what they are doing, and carry parcels — they are never decorative statues,
// but nor are they a full navmesh crowd. Two per side keeps the depot alive
// without spending the frame budget on pathfinding.

export type WorkerTask =
  | 'idle'
  | 'walk_to_pickup'
  | 'pick_up'
  | 'carry_to_truck'
  | 'load_truck'
  | 'return';

export interface Worker {
  pos: Vec3;
  heading: number;
  task: WorkerTask;
  /** 0..1 through the current task. */
  t: number;
  /** Where this worker rests between jobs. */
  home: Vec3;
  /** Small bob/lean animation phase. */
  phase: number;
  /** True while a parcel is in this worker's hands. */
  carrying: boolean;
}

// ── FORKLIFT ────────────────────────────────────────────────────────────────

export interface Forklift {
  /** Distance travelled along its looping lane, metres. */
  distance: number;
  pos: Vec3;
  heading: number;
  /** Fork height, animated as it picks up and sets down. */
  forkY: number;
  /** True while a pallet is on the forks. */
  laden: boolean;
  speed: number;
}

// ── PARCEL ──────────────────────────────────────────────────────────────────

export interface SimParcel {
  id: string;
  team: TeamId;
  shape: PackageShape;
  stage: ParcelStage;
  pos: Vec3;
  heading: number;
  /** 0..1 along the current leg. */
  t: number;
  spin: number;
  colorIndex: number;
  weightKg: number;
}

// ── PER-SIDE STATE ──────────────────────────────────────────────────────────

export interface SideSim {
  team: TeamId;

  /** The parcel currently being handled, if any. */
  parcel: SimParcel | null;
  /** Parcels already stowed in the truck, for the visible load. */
  loadedCount: number;

  workers: Worker[];
  forklift: Forklift;

  /** Belt runs only while a parcel is on it — visible cause and effect. */
  beltRunning: boolean;
  beltPhase: number;

  /** Weighing platform: dips slightly under load, display reads the weight. */
  scaleDepress: number;
  scaleDisplay: number;
  scaleLight: 'idle' | 'ready' | 'ok' | 'error';

  /** Scanner arch flashes as a parcel passes through. */
  scannerFlash: number;
  /** Sorting gate angle, 0 closed .. 1 open. */
  gateOpen: number;

  /** Truck state. */
  truckPos: Vec3;
  truckHeading: number;
  truckDoorsOpen: number;
  truckLights: boolean;
  truckDeparting: boolean;
  truckRouteDistance: number;

  /** Set for one frame when an event needs a sound. Drained by the audio hook. */
  events: SimEvent[];
}

export type SimEvent =
  | 'parcel_arrive'
  | 'scale_ok'
  | 'scale_error'
  | 'belt_start'
  | 'scanner'
  | 'gate'
  | 'worker_pickup'
  | 'truck_load'
  | 'truck_engine'
  | 'gate_open';

function makeWorker(home: Vec3, phase: number): Worker {
  return {
    pos: { ...home }, heading: 0, task: 'idle', t: 0,
    home: { ...home }, phase, carrying: false,
  };
}

function makeSide(team: TeamId): SideSim {
  const s = sideOf(team);
  return {
    team,
    parcel: null,
    loadedCount: 0,
    workers: [makeWorker(s.workerHome, 0), makeWorker(s.workerBelt, 1.7)],
    forklift: {
      distance: 0,
      pos: { ...s.forkliftHome },
      heading: 0,
      forkY: 0.25,
      laden: false,
      speed: 3.4,
    },
    beltRunning: false,
    beltPhase: 0,
    scaleDepress: 0,
    scaleDisplay: 0,
    scaleLight: 'idle',
    scannerFlash: 0,
    gateOpen: 0,
    truckPos: { ...s.truck },
    truckHeading: s.truckHeading,
    truckDoorsOpen: 1,
    truckLights: false,
    truckDeparting: false,
    truckRouteDistance: 0,
    events: [],
  };
}

export interface DepotSim {
  blue: SideSim;
  red: SideSim;
  /** Central hub machinery animation phase. */
  hubPhase: number;
  /** Dispatch gate, 0 closed .. 1 open. */
  dispatchGate: number;
  elapsed: number;
}

export const sim: DepotSim = {
  blue: makeSide('blue'),
  red: makeSide('red'),
  hubPhase: 0,
  dispatchGate: 0,
  elapsed: 0,
};

export function sideSim(team: TeamId): SideSim {
  return team === 'blue' ? sim.blue : sim.red;
}

function emit(side: SideSim, e: SimEvent) {
  side.events.push(e);
}

/** Drain queued sound events. Called once per frame by the audio bridge. */
export function drainEvents(): { team: TeamId; event: SimEvent }[] {
  const out: { team: TeamId; event: SimEvent }[] = [];
  for (const side of [sim.blue, sim.red]) {
    for (const e of side.events) out.push({ team: side.team, event: e });
    side.events.length = 0;
  }
  return out;
}

// ── PUBLIC TRANSITIONS ──────────────────────────────────────────────────────
// Called by the store when the game state changes. These start physical
// processes; they never place anything by hand mid-flight.

let parcelSeq = 0;

/** A new order has arrived: the forklift brings the parcel to the scale. */
export function spawnParcel(team: TeamId, shape: PackageShape, weightKg: number, colorIndex: number) {
  const side = sideSim(team);
  const s = sideOf(team);
  side.parcel = {
    id: `p${++parcelSeq}`,
    team,
    shape,
    stage: 'arriving',
    pos: { ...s.palletStack, y: 1.0 },
    heading: headingTo(s.palletStack, s.scale),
    t: 0,
    spin: 0,
    colorIndex,
    weightKg,
  };
  side.forklift.laden = true;
  side.scaleLight = 'idle';
  side.scaleDisplay = 0;
  emit(side, 'parcel_arrive');
}

/** Correct answer accepted: run the whole downstream chain. */
export function acceptAnswer(team: TeamId) {
  const side = sideSim(team);
  if (!side.parcel) return;
  side.scaleLight = 'ok';
  side.beltRunning = true;
  side.parcel.stage = 'conveyor';
  side.parcel.t = 0;
  emit(side, 'scale_ok');
  emit(side, 'belt_start');
}

/** Wrong answer: the machine simply refuses to run. Nothing is lost. */
export function rejectAnswer(team: TeamId) {
  const side = sideSim(team);
  side.scaleLight = 'error';
  emit(side, 'scale_error');
  // Clear back to ready shortly; the parcel stays exactly where it is.
  setTimeout(() => {
    const sd = sideSim(team);
    if (sd.scaleLight === 'error') sd.scaleLight = 'ready';
  }, 900);
}

/** Begin the winning truck's departure. */
export function departTruck(team: TeamId) {
  const side = sideSim(team);
  side.truckDoorsOpen = 0;
  side.truckLights = true;
  side.truckDeparting = true;
  side.truckRouteDistance = 0;
  emit(side, 'truck_engine');
  emit(side, 'gate_open');
}

/** Full reset for a replay — no stale parcels, tasks or truck positions. */
export function resetSim() {
  sim.blue = makeSide('blue');
  sim.red = makeSide('red');
  sim.hubPhase = 0;
  sim.dispatchGate = 0;
  sim.elapsed = 0;
  parcelSeq = 0;
}

// ── CALLBACKS INTO THE GAME LAYER ───────────────────────────────────────────
// The simulation tells the store when a parcel has physically reached the
// truck, so money is awarded at the moment the box lands — not when the
// answer was typed.

type LoadedHandler = (team: TeamId) => void;
let onParcelLoaded: LoadedHandler | null = null;
export function setParcelLoadedHandler(fn: LoadedHandler | null) {
  onParcelLoaded = fn;
}

// ── STEP ────────────────────────────────────────────────────────────────────

const TWO_PI = Math.PI * 2;

export function stepSim(rawDt: number) {
  const dt = Math.min(0.05, Math.max(0.0005, rawDt));
  sim.elapsed += dt;
  sim.hubPhase = (sim.hubPhase + dt * 0.8) % TWO_PI;

  stepSide(sim.blue, dt);
  stepSide(sim.red, dt);

  // Dispatch gate opens when either truck is leaving.
  const wantGate = sim.blue.truckDeparting || sim.red.truckDeparting;
  sim.dispatchGate += ((wantGate ? 1 : 0) - sim.dispatchGate) * (1 - Math.exp(-2.2 * dt));
}

function stepSide(side: SideSim, dt: number) {
  const s = sideOf(side.team);
  const legs = parcelJourney(side.team);

  // ── FORKLIFT ──
  // Drives its lane continuously in the background. Laden while a parcel is
  // inbound, empty otherwise, forks rising and falling at the pallet stack.
  const fl = side.forklift;
  const route = forkliftRoute(side.team);
  fl.distance += fl.speed * dt;
  const sampled = sampleRoute(route, fl.distance);
  fl.pos = sampled.pos;
  fl.heading = sampled.heading;
  const loopT = (fl.distance % routeLength(route)) / routeLength(route);
  // Forks lift over the middle of the run, drop at the ends.
  const targetFork = loopT > 0.25 && loopT < 0.7 ? 1.25 : 0.25;
  fl.forkY += (targetFork - fl.forkY) * (1 - Math.exp(-4 * dt));

  // ── BELT ──
  if (side.beltRunning) side.beltPhase = (side.beltPhase + dt * 2.4) % 1;

  // ── SCANNER / GATE decay ──
  side.scannerFlash = Math.max(0, side.scannerFlash - dt * 2.5);
  const wantGateOpen = side.parcel?.stage === 'scanner' || side.parcel?.stage === 'conveyor' ? 1 : 0;
  side.gateOpen += (wantGateOpen - side.gateOpen) * (1 - Math.exp(-5 * dt));

  // ── TRUCK DEPARTURE ──
  if (side.truckDeparting) {
    const troute = truckDepartureRoute(side.team);
    side.truckRouteDistance += 9 * dt;
    const t = sampleRoute(troute, side.truckRouteDistance);
    // Open route, not a loop: stop at the end rather than wrapping round.
    const total = routeLength(troute);
    if (side.truckRouteDistance < total * 0.92) {
      side.truckPos = t.pos;
      side.truckHeading = t.heading;
    }
  }

  // ── PARCEL ──
  const p = side.parcel;
  if (p) {
    switch (p.stage) {
      case 'arriving': {
        const leg = legs.arriving;
        p.t = Math.min(1, p.t + dt / leg.duration);
        p.pos = lerpVec(leg.from, leg.to, easeInOut(p.t), leg.y);
        p.heading = headingTo(leg.from, leg.to);
        if (p.t >= 1) {
          p.stage = 'on_scale';
          side.forklift.laden = false;
          side.scaleLight = 'ready';
        }
        break;
      }

      case 'on_scale': {
        // Platform dips under the weight and the display settles on it.
        side.scaleDepress += (0.09 - side.scaleDepress) * (1 - Math.exp(-6 * dt));
        side.scaleDisplay += (p.weightKg - side.scaleDisplay) * (1 - Math.exp(-4 * dt));
        p.pos = { ...s.scale, y: 1.05 - side.scaleDepress };
        break;
      }

      case 'conveyor': {
        // Scale releases, belt carries the parcel to the scanner.
        side.scaleDepress += (0 - side.scaleDepress) * (1 - Math.exp(-6 * dt));
        const leg = legs.toScanner;
        p.t = Math.min(1, p.t + dt / leg.duration);
        p.pos = lerpVec(leg.from, leg.to, p.t, leg.y);
        p.heading = headingTo(leg.from, leg.to);
        p.spin += dt * 0.6;
        if (p.t >= 1) {
          p.stage = 'scanner';
          p.t = 0;
          side.scannerFlash = 1;
          emit(side, 'scanner');
        }
        break;
      }

      case 'scanner': {
        const leg = legs.toGate;
        p.t = Math.min(1, p.t + dt / leg.duration);
        p.pos = lerpVec(leg.from, leg.to, p.t, leg.y);
        p.heading = headingTo(leg.from, leg.to);
        if (p.t >= 1) {
          p.stage = 'to_truck';
          p.t = 0;
          emit(side, 'gate');
          // The loading worker is dispatched to collect it.
          const w = side.workers[0];
          w.task = 'walk_to_pickup';
          w.t = 0;
        }
        break;
      }

      case 'to_truck': {
        // The parcel rides the last stretch of belt, then the worker carries
        // it. Position is driven by the worker once they have it in hand.
        const w = side.workers[0];
        if (w.carrying) {
          p.pos = { x: w.pos.x, y: 1.35, z: w.pos.z };
          p.heading = w.heading;
        } else {
          const leg = legs.toDrop;
          p.t = Math.min(1, p.t + dt / leg.duration);
          p.pos = lerpVec(leg.from, leg.to, p.t, leg.y);
          p.heading = headingTo(leg.from, leg.to);
        }
        break;
      }

      case 'loaded':
        break;
    }
  } else {
    // No parcel: release the platform and idle the belt.
    side.scaleDepress += (0 - side.scaleDepress) * (1 - Math.exp(-6 * dt));
    side.scaleDisplay += (0 - side.scaleDisplay) * (1 - Math.exp(-3 * dt));
    if (side.beltRunning && !side.parcel) side.beltRunning = false;
  }

  // ── WORKERS ──
  for (const w of side.workers) stepWorker(side, w, dt);
}

function stepWorker(side: SideSim, w: Worker, dt: number) {
  const s = sideOf(side.team);
  w.phase += dt * (w.task === 'idle' ? 1.2 : 5.5);

  switch (w.task) {
    case 'idle': {
      // Drift back to post and face the working area.
      w.pos = approach(w.pos, w.home, 2.0 * dt);
      w.heading = headingTo(w.pos, s.scale);
      break;
    }

    case 'walk_to_pickup': {
      const target = s.loadPoint;
      w.pos = approach(w.pos, target, 3.4 * dt);
      w.heading = headingTo(w.pos, target);
      if (dist2(w.pos, target) < 1.2) {
        w.task = 'pick_up';
        w.t = 0;
      }
      break;
    }

    case 'pick_up': {
      w.t += dt / 0.45;
      if (w.t >= 1) {
        w.carrying = true;
        w.task = 'carry_to_truck';
        w.t = 0;
        emit(side, 'worker_pickup');
      }
      break;
    }

    case 'carry_to_truck': {
      const target = { x: s.truck.x, y: 0, z: s.truck.z - 3.2 };
      w.pos = approach(w.pos, target, 3.0 * dt);
      w.heading = headingTo(w.pos, target);
      if (dist2(w.pos, target) < 1.2) {
        w.task = 'load_truck';
        w.t = 0;
      }
      break;
    }

    case 'load_truck': {
      w.t += dt / 0.6;
      if (w.t >= 1) {
        w.carrying = false;
        w.task = 'return';
        // The parcel is physically in the truck now: this is the moment the
        // order counts as complete and the money is awarded.
        if (side.parcel) {
          side.parcel.stage = 'loaded';
          side.parcel = null;
          side.loadedCount += 1;
          side.beltRunning = false;
          side.scaleLight = 'idle';
          emit(side, 'truck_load');
          onParcelLoaded?.(side.team);
        }
      }
      break;
    }

    case 'return': {
      w.pos = approach(w.pos, w.home, 3.0 * dt);
      w.heading = headingTo(w.pos, w.home);
      if (dist2(w.pos, w.home) < 0.8) w.task = 'idle';
      break;
    }
  }
}

// ── SMALL HELPERS ───────────────────────────────────────────────────────────

function approach(from: Vec3, to: Vec3, maxStep: number): Vec3 {
  const dx = to.x - from.x;
  const dz = to.z - from.z;
  const d = Math.hypot(dx, dz);
  if (d <= maxStep || d < 1e-6) return { x: to.x, y: from.y, z: to.z };
  return { x: from.x + (dx / d) * maxStep, y: from.y, z: from.z + (dz / d) * maxStep };
}

function dist2(a: Vec3, b: Vec3): number {
  return Math.hypot(a.x - b.x, a.z - b.z);
}

function easeInOut(t: number): number {
  return t * t * (3 - 2 * t);
}
