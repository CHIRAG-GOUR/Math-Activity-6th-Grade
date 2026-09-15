// ============================================================
// THE DECIMAL DELIVERY NETWORK — DEPOT SIMULATION
//
// The physical half of the game. Mutable state outside React, stepped once per
// frame, read directly by the 3D components. Nothing here writes to the
// zustand store per frame.
//
// FOUR INDEPENDENT CONVEYOR LANES — Blue A, Blue B, Red A, Red B — each with
// its own parcel lifecycle, so all four can be busy at once and nothing a
// player does on one belt ever freezes another.
//
// Every parcel is always in exactly one lifecycle stage (section 78):
//
//   intake    waiting on the pallet by the warehouse door / on the rack
//   arriving  being walked, carted or fork-lifted to the belt head
//   on_belt   riding toward the scale, or queued behind the parcel on it
//   at_station  stopped on the scale; the question is live
//   approved_run -> awaiting_pickup -> carried -> placing -> delivered  (reward)
//   reject_run   -> awaiting_pickup -> carried -> placing -> discarded  (none)
//
// A parcel is NEVER teleported (section 79): its position always comes from a
// belt polyline, a carrier's hands or forks, or an arc into its final slot.
//
// Handling depends on weight and is visible (section 51):
//   LIGHT  < 5 kg     one worker (carried in the arms)
//   MEDIUM 5-15 kg    brought in on a cart; two workers carry it out
//   HEAVY  > 15 kg    a forklift, every time — never lifted by hand. The yard
//                     forklift feeds the belts; the dispatch forklift, parked
//                     beside the hub, clears the belt exits.
// ============================================================

import type { TeamId, PackageShape } from '../types';
import {
  sideOf, laneOf, LANES, type LaneId, type Vec3,
  headingTo, dist, forwardOf, rightOf,
  polylineLength, samplePolyline, runAfterStation,
  CARGO_SLOTS, truckLocalToWorld, loadingStand, rejectSlot,
  collectPoint, routeHomeToCollect, routeCollectToTruck, routeCollectToReject,
  routeReturnHome, yardToRack, yardRackToStaging, yardReturn,
  dispatchToExit, dispatchExitToTruck, dispatchExitToReject, dispatchReturn,
  FORK_REACH, type Waypoint,
  intakeSlot, intakeToPile, intakePileToStaging, intakeStagingToHome,
  truckDepartureRoute, BELT_Y, CARRY_Y,
} from './depotLayout';

// ── WEIGHT ──────────────────────────────────────────────────────────────────

export type WeightClass = 'light' | 'medium' | 'heavy';

export function weightClassOf(kg: number): WeightClass {
  if (kg < 5) return 'light';
  if (kg <= 15) return 'medium';
  return 'heavy';
}

// ── TYPES ───────────────────────────────────────────────────────────────────

export type ParcelStage =
  | 'intake' | 'arriving' | 'on_belt' | 'at_station'
  | 'approved_run' | 'reject_run' | 'awaiting_pickup'
  | 'carried' | 'placing' | 'delivered' | 'discarded';

export interface ParcelLabel {
  orderId: string;
  destination: string;
  rows: { label: string; value: string }[];
}

export interface SimParcel {
  id: string;
  team: TeamId;
  lane: LaneId;
  shape: PackageShape;
  weightKg: number;
  weightClass: WeightClass;
  /** Set at the scale, never changed afterwards. */
  approved: boolean | null;
  /** Withhold the weight on the scale while the question asks for it. */
  hideScale: boolean;
  stage: ParcelStage;
  pos: Vec3;
  heading: number;
  travel: number;
  /** Cargo / reject / intake slot, depending on stage. */
  slot: number;
  colorIndex: number;
  label: ParcelLabel;
  arc: { from: Vec3; t: number; height: number; spin: number; target: Vec3 } | null;
  /** Arrival order on the lane, for queue ordering. */
  seq: number;
}

export type WorkerTask = 'idle' | 'to_collect' | 'lift' | 'carry' | 'place' | 'return';

export interface Worker {
  id: string;
  pos: Vec3;
  heading: number;
  task: WorkerTask;
  t: number;
  home: Vec3;
  phase: number;
  carrying: boolean;
  parcelId: string | null;
  role: 0 | 1;
  path: Vec3[];
  travel: number;
}

export type IntakeTask = 'idle' | 'to_pile' | 'lift' | 'to_belt' | 'set_down' | 'return';

export interface IntakeWorker {
  /** The belt this worker feeds. */
  lane: LaneId;
  pos: Vec3;
  heading: number;
  task: IntakeTask;
  t: number;
  phase: number;
  parcelId: string | null;
  /** Medium parcels come in on a hand cart pushed ahead of the worker. */
  withCart: boolean;
  path: Vec3[];
  travel: number;
}

export type ForkliftTask = 'parked' | 'to_pick' | 'lift' | 'haul' | 'lower' | 'return';

export type ForkliftRole = 'yard' | 'dispatch';

export interface Forklift {
  role: ForkliftRole;
  pos: Vec3;
  heading: number;
  forkY: number;
  task: ForkliftTask;
  t: number;
  parcelId: string | null;
  path: Waypoint[];
  /** True while backing along the current segment. */
  reversing: boolean;
  travel: number;
  purpose: 'to_belt' | 'to_truck' | 'to_reject' | null;
  slot: number;
  /** Where the parcel sat when the lift began, and the fork height then. */
  liftFrom: Vec3 | null;
  liftBase: number;
}

export type LaneStatusWord = 'WAITING' | 'PROCESSING' | 'APPROVED' | 'IN TRANSIT' | 'DELIVERED' | 'REJECTED';

export interface LaneSim {
  id: LaneId;
  parcels: SimParcel[];
  beltRunning: boolean;
  beltPhase: number;
  scaleDepress: number;
  /** Reading on the scale display. NaN renders as dashes (withheld). */
  scaleDisplay: number;
  lamp: 'idle' | 'working' | 'ok' | 'error';
  scannerFlash: number;
  /** Diverter flap: 0 routes to the truck, 1 into the reject chute. */
  diverter: number;
  status: LaneStatusWord;
}

export type PlayerMood = 'idle' | 'watching' | 'success' | 'reject' | 'celebrate' | 'shrug';

export interface SideSim {
  team: TeamId;
  lanes: Record<LaneId, LaneSim>;
  workers: Worker[];
  intake: IntakeWorker[];
  forklifts: Record<ForkliftRole, Forklift>;
  cargo: SimParcel[];
  rejected: SimParcel[];
  reservedCargo: number;
  reservedReject: number;

  truckPos: Vec3;
  truckHeading: number;
  /** 1 = tarp rolled back for loading, 0 = tarp drawn over the load. */
  truckTarp: number;
  truckLights: boolean;
  truckDeparting: boolean;
  truckRouteDistance: number;
  wheelSpin: number;

  playerPos: Vec3;
  playerHeading: number;
  playerMood: PlayerMood;
  playerMoodUntil: number;

  events: SimEvent[];
}

export type SimEvent =
  | 'parcel_arrive' | 'belt_start' | 'scale_settle' | 'scale_ok' | 'scale_error'
  | 'scanner' | 'divert' | 'pickup' | 'truck_load' | 'reject_drop'
  | 'forklift_beep' | 'truck_engine' | 'gate_open';

// ── CONSTRUCTION ────────────────────────────────────────────────────────────

function makeLane(id: LaneId): LaneSim {
  return {
    id, parcels: [], beltRunning: false, beltPhase: 0,
    scaleDepress: 0, scaleDisplay: 0, lamp: 'idle',
    scannerFlash: 0, diverter: 0, status: 'WAITING',
  };
}

const sideSignOf = (team: TeamId): number => (team === 'blue' ? -1 : 1);

function makeForklift(role: ForkliftRole, home: Vec3, heading: number): Forklift {
  return {
    role, pos: { ...home }, heading, forkY: 0.2, task: 'parked', t: 0,
    parcelId: null, path: [], reversing: false, travel: 0, purpose: null, slot: -1,
    liftFrom: null, liftBase: 0.2,
  };
}

function makeSide(team: TeamId): SideSim {
  const s = sideOf(team);
  return {
    team,
    lanes: { A: makeLane('A'), B: makeLane('B') },
    workers: s.workerHome.map((h, i) => ({
      id: `${team}-w${i}`, pos: { ...h }, heading: 0, task: 'idle' as WorkerTask, t: 0,
      home: { ...h }, phase: i * 1.7, carrying: false, parcelId: null,
      role: 0 as 0 | 1, path: [], travel: 0,
    })),
    intake: LANES.map((lane, i) => ({
      lane, pos: { ...s.intakeHomes[lane] }, heading: 0, task: 'idle' as IntakeTask, t: 0,
      phase: 0.6 + i * 1.3, parcelId: null, withCart: false, path: [], travel: 0,
    })),
    forklifts: {
      // Parked facing the way their first job leaves (they back out).
      yard: makeForklift('yard', s.forkliftHome, Math.PI / 2 * -sideSignOf(team)),
      dispatch: makeForklift('dispatch', s.dispatchForkHome,
        headingTo(s.nav.forkBay, s.dispatchForkHome)),
    },
    cargo: [],
    rejected: [],
    reservedCargo: 0,
    reservedReject: 0,
    truckPos: { ...s.truck },
    truckHeading: s.truckHeading,
    truckTarp: 1,
    truckLights: false,
    truckDeparting: false,
    truckRouteDistance: 0,
    wheelSpin: 0,
    playerPos: { ...s.player },
    playerHeading: 0,
    playerMood: 'idle',
    playerMoodUntil: 0,
    events: [],
  };
}

export interface DepotSim {
  blue: SideSim;
  red: SideSim;
  hubPhase: number;
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

export const sideSim = (team: TeamId): SideSim => (team === 'blue' ? sim.blue : sim.red);
export const laneSim = (team: TeamId, lane: LaneId): LaneSim => sideSim(team).lanes[lane];

function emit(side: SideSim, e: SimEvent) { side.events.push(e); }

export function drainEvents(): { team: TeamId; event: SimEvent }[] {
  const out: { team: TeamId; event: SimEvent }[] = [];
  for (const side of [sim.blue, sim.red]) {
    for (const e of side.events) out.push({ team: side.team, event: e });
    side.events.length = 0;
  }
  return out;
}

// ── CALLBACKS ───────────────────────────────────────────────────────────────

type ParcelHandler = (team: TeamId, lane: LaneId, parcelId: string) => void;
let onStationReady: ParcelHandler | null = null;
let onDelivered: ParcelHandler | null = null;
let onDiscarded: ParcelHandler | null = null;

export function setDepotHandlers(h: {
  onStationReady?: ParcelHandler; onDelivered?: ParcelHandler; onDiscarded?: ParcelHandler;
}) {
  onStationReady = h.onStationReady ?? null;
  onDelivered = h.onDelivered ?? null;
  onDiscarded = h.onDiscarded ?? null;
}

// ── PUBLIC TRANSITIONS ──────────────────────────────────────────────────────

let parcelSeq = 0;

export interface SpawnOptions {
  team: TeamId;
  lane: LaneId;
  shape: PackageShape;
  weightKg: number;
  colorIndex: number;
  hideScale: boolean;
  label: ParcelLabel;
}

/**
 * A new order's parcel enters the depot. It waits by the warehouse door (or
 * on the pallet rack, if heavy) until the intake crew or the forklift
 * physically brings it to the belt head. It never appears beside the player.
 */
export function spawnParcel(o: SpawnOptions): string {
  const side = sideSim(o.team);
  const wc = weightClassOf(o.weightKg);
  const s = sideOf(o.team);

  const waiting = allParcels(side).filter((p) => p.stage === 'intake').length;
  const pos = wc === 'heavy'
    ? { ...s.heavyPickup, y: 0.55 }
    : intakeSlot(o.team, waiting);

  const parcel: SimParcel = {
    id: `p${++parcelSeq}`,
    team: o.team, lane: o.lane, shape: o.shape,
    weightKg: o.weightKg, weightClass: wc,
    approved: null, hideScale: o.hideScale,
    stage: 'intake',
    pos, heading: 0, travel: 0, slot: waiting,
    colorIndex: o.colorIndex, label: o.label, arc: null,
    seq: parcelSeq,
  };
  side.lanes[o.lane].parcels.push(parcel);
  emit(side, 'parcel_arrive');
  return parcel.id;
}

/** Correct answer: release the parcel down the approved route. */
export function approveParcel(team: TeamId, lane: LaneId): string | null {
  const side = sideSim(team);
  const ls = side.lanes[lane];
  const p = ls.parcels.find((x) => x.stage === 'at_station');
  if (!p) return null;
  p.approved = true;
  // Confirmation: a withheld weight is revealed now it has been worked out.
  p.hideScale = false;
  ls.scaleDisplay = p.weightKg;
  p.stage = 'approved_run';
  p.travel = 0;
  ls.lamp = 'ok';
  ls.diverter = 0;
  ls.status = 'APPROVED';
  side.playerMood = 'success';
  side.playerMoodUntil = sim.elapsed + 1.8;
  emit(side, 'scale_ok');
  emit(side, 'belt_start');
  return p.id;
}

/** Out of attempts: the diverter sends the parcel into the reject chute. */
export function rejectParcel(team: TeamId, lane: LaneId): string | null {
  const side = sideSim(team);
  const ls = side.lanes[lane];
  const p = ls.parcels.find((x) => x.stage === 'at_station');
  if (!p) return null;
  p.approved = false;
  p.stage = 'reject_run';
  p.travel = 0;
  ls.lamp = 'error';
  ls.diverter = 1;
  ls.status = 'REJECTED';
  side.playerMood = 'reject';
  side.playerMoodUntil = sim.elapsed + 1.8;
  emit(side, 'scale_error');
  emit(side, 'divert');
  return p.id;
}

const lampResets: { team: TeamId; lane: LaneId; at: number }[] = [];

/** A wrong attempt with a retry left: the machine refuses and the parcel stays. */
export function refuseAnswer(team: TeamId, lane: LaneId) {
  const side = sideSim(team);
  side.lanes[lane].lamp = 'error';
  emit(side, 'scale_error');
  lampResets.push({ team, lane, at: sim.elapsed + 0.85 });
}

export function departTruck(team: TeamId) {
  const side = sideSim(team);
  side.truckLights = true;
  side.truckDeparting = true;
  side.truckRouteDistance = 0;
  side.playerMood = 'celebrate';
  side.playerMoodUntil = sim.elapsed + 90;
  emit(side, 'truck_engine');
  emit(side, 'gate_open');
  const other = team === 'blue' ? sim.red : sim.blue;
  other.playerMood = 'shrug';
  other.playerMoodUntil = sim.elapsed + 90;
}

/** Draw the tarp over a truck's load (called just before dispatch). */
export function closeTruck(team: TeamId) {
  sideSim(team).truckTarp = 0;
}

export function resetSim() {
  sim.blue = makeSide('blue');
  sim.red = makeSide('red');
  sim.hubPhase = 0;
  sim.dispatchGate = 0;
  sim.elapsed = 0;
  parcelSeq = 0;
  lampResets.length = 0;
}

export function stationParcel(team: TeamId, lane: LaneId): SimParcel | null {
  return laneSim(team, lane).parcels.find((p) => p.stage === 'at_station') ?? null;
}

/** What a team's station camera should be looking at right now. */
export function focusParcel(team: TeamId): { parcel: SimParcel; lane: LaneId } | null {
  const side = sideSim(team);
  const pick = (stages: ParcelStage[]) => {
    for (const lane of LANES) {
      const p = side.lanes[lane].parcels.find((x) => stages.includes(x.stage));
      if (p) return { parcel: p, lane };
    }
    return null;
  };
  return pick(['at_station'])
    ?? pick(['approved_run', 'reject_run', 'awaiting_pickup', 'carried', 'placing'])
    ?? pick(['on_belt', 'arriving']);
}

// ── STEP ────────────────────────────────────────────────────────────────────

const TWO_PI = Math.PI * 2;
const BELT_SPEED = 2.6;
const WALK_SPEED = 3.0;
const CARRY_SPEED = 2.5;
const FORK_SPEED = 5.2;
/** Forklifts back up more carefully than they drive forward. */
const FORK_REVERSE = 0.6;
/** Gap between parcels queued on a belt. */
const QUEUE_SPACING = 2.4;

export function stepSim(rawDt: number) {
  const dt = Math.min(0.05, Math.max(0.0005, rawDt));
  sim.elapsed += dt;
  sim.hubPhase = (sim.hubPhase + dt * 0.8) % TWO_PI;

  for (let i = lampResets.length - 1; i >= 0; i--) {
    const r = lampResets[i];
    if (sim.elapsed < r.at) continue;
    const ls = laneSim(r.team, r.lane);
    if (ls.lamp === 'error' && ls.parcels.some((p) => p.stage === 'at_station')) ls.lamp = 'working';
    lampResets.splice(i, 1);
  }

  stepSide(sim.blue, dt);
  stepSide(sim.red, dt);

  const want = sim.blue.truckDeparting || sim.red.truckDeparting ? 1 : 0;
  sim.dispatchGate += (want - sim.dispatchGate) * (1 - Math.exp(-2.2 * dt));
}

function stepSide(side: SideSim, dt: number) {
  stepTruck(side, dt);
  for (const lane of LANES) stepLane(side, side.lanes[lane], dt);
  dispatchIntake(side);
  dispatchCarriers(side);
  for (const iw of side.intake) stepIntake(side, iw, dt);
  for (const w of side.workers) stepWorker(side, w, dt);
  stepForklift(side, side.forklifts.yard, dt);
  stepForklift(side, side.forklifts.dispatch, dt);
  stepPlacing(side, dt);
  stepPlayer(side, dt);
  for (const lane of LANES) {
    side.lanes[lane].parcels = side.lanes[lane].parcels.filter(
      (p) => p.stage !== 'delivered' && p.stage !== 'discarded'
    );
  }
}

// ── TRUCK ───────────────────────────────────────────────────────────────────

function stepTruck(side: SideSim, dt: number) {
  if (!side.truckDeparting) return;
  const route = truckDepartureRoute(side.team);
  const total = polylineLength(route);
  // Pull away gently, then cruise.
  const speed = 2.5 + Math.min(1, side.truckRouteDistance / 10) * 7;
  side.truckRouteDistance = Math.min(total, side.truckRouteDistance + speed * dt);
  const r = samplePolyline(route, side.truckRouteDistance, 0);
  side.truckPos = r.pos;
  side.truckHeading += angleDelta(side.truckHeading, r.heading) * (1 - Math.exp(-2.6 * dt));
  side.wheelSpin += (speed / 0.6) * dt;
}

// ── LANES ───────────────────────────────────────────────────────────────────

function stepLane(side: SideSim, ls: LaneSim, dt: number) {
  const l = laneOf(side.team, ls.id);
  ls.scannerFlash = Math.max(0, ls.scannerFlash - dt * 2.4);
  let moving = false;

  // Parcels between the belt head and the scale, oldest first. Their order
  // decides who gets the scale and who queues behind.
  const onBelt = ls.parcels
    .filter((p) => p.stage === 'on_belt' || p.stage === 'at_station')
    .sort((a, b) => a.seq - b.seq);
  const feedLen = polylineLength([l.staging, l.entry, l.station]);

  for (const p of ls.parcels) {
    switch (p.stage) {
      case 'on_belt': {
        // Stop distance: the scale if nothing is ahead, otherwise one spacing
        // behind whatever is in front.
        const rank = onBelt.indexOf(p);
        const stopAt = feedLen - rank * QUEUE_SPACING;
        const remaining = stopAt - p.travel;
        if (remaining > 0.001) {
          moving = true;
          // Belt slows as the parcel reaches its stop point.
          const speed = BELT_SPEED * Math.max(0.25, Math.min(1, remaining / 2.2));
          p.travel = Math.min(stopAt, p.travel + speed * dt);
        }
        const r = samplePolyline([l.staging, l.entry, l.station], p.travel, BELT_Y);
        const vib = remaining > 0.001 ? Math.sin(sim.elapsed * 30 + p.travel * 3) * 0.008 : 0;
        p.pos = { ...r.pos, y: BELT_Y + vib };
        p.heading = r.heading;

        if (rank === 0 && p.travel >= feedLen - 0.001) {
          p.stage = 'at_station';
          ls.lamp = 'working';
          ls.status = 'PROCESSING';
          ls.scaleDisplay = p.hideScale ? NaN : 0;
          emit(side, 'scale_settle');
          onStationReady?.(side.team, ls.id, p.id);
        }
        break;
      }

      case 'at_station': {
        // Platform dips under the load; the display settles on the reading.
        ls.scaleDepress += (0.085 - ls.scaleDepress) * (1 - Math.exp(-6 * dt));
        if (p.hideScale) {
          ls.scaleDisplay = NaN;
        } else {
          const cur = Number.isNaN(ls.scaleDisplay) ? 0 : ls.scaleDisplay;
          ls.scaleDisplay = cur + (p.weightKg - cur) * (1 - Math.exp(-4 * dt));
        }
        p.pos = { ...l.station, y: BELT_Y - ls.scaleDepress };
        break;
      }

      case 'approved_run':
      case 'reject_run': {
        moving = true;
        const approved = p.stage === 'approved_run';
        const path = runAfterStation(side.team, ls.id, approved);
        const before = p.travel;
        p.travel += BELT_SPEED * dt;
        const r = samplePolyline(path, p.travel, BELT_Y);
        p.pos = { ...r.pos, y: BELT_Y + Math.sin(sim.elapsed * 30 + p.travel * 3) * 0.008 };
        p.heading = r.heading;

        const toScanner = dist(l.station, l.scanner);
        if (before < toScanner && p.travel >= toScanner) {
          ls.scannerFlash = 1;
          emit(side, 'scanner');
          if (approved) ls.status = 'IN TRANSIT';
        }
        if (r.done) {
          p.stage = 'awaiting_pickup';
          p.pos = { ...(approved ? l.approvedExit : l.rejectExit), y: BELT_Y };
        }
        break;
      }

      default:
        break;
    }
  }

  ls.beltRunning = moving;
  if (moving) ls.beltPhase = (ls.beltPhase + dt * 1.6) % 1;

  if (!ls.parcels.some((p) => p.stage === 'at_station')) {
    ls.scaleDepress += (0 - ls.scaleDepress) * (1 - Math.exp(-6 * dt));
    const cur = Number.isNaN(ls.scaleDisplay) ? 0 : ls.scaleDisplay;
    ls.scaleDisplay = cur + (0 - cur) * (1 - Math.exp(-3 * dt));
    if (ls.lamp === 'working') ls.lamp = 'idle';
    if (!ls.parcels.length && ls.status !== 'DELIVERED' && ls.status !== 'REJECTED') ls.status = 'WAITING';
  }
}

// ── INTAKE (section 50) ─────────────────────────────────────────────────────

function allParcels(side: SideSim): SimParcel[] {
  return [...side.lanes.A.parcels, ...side.lanes.B.parcels];
}

function findParcel(side: SideSim, id: string | null): SimParcel | null {
  if (!id) return null;
  return allParcels(side).find((p) => p.id === id) ?? null;
}

function dispatchIntake(side: SideSim) {
  const waiting = allParcels(side)
    .filter((p) => p.stage === 'intake')
    .sort((a, b) => a.seq - b.seq);

  for (const p of waiting) {
    // Strict first-in-first-out per belt. The store expects each lane's
    // parcels to reach the scale in the order the orders were issued; letting
    // a quick light parcel overtake a slow forklift delivery would put the
    // wrong box on the scale and stall that lane's keypad.
    const earlierStillComing = side.lanes[p.lane].parcels.some(
      (o) => o.seq < p.seq && (o.stage === 'intake' || o.stage === 'arriving')
    );
    if (earlierStillComing) continue;

    if (p.weightClass === 'heavy') {
      const fl = side.forklifts.yard;
      if (fl.task !== 'parked' || fl.parcelId) continue;
      assignForklift(side, fl, p, 'to_belt', yardToRack(side.team, fl.pos));
      continue;
    }

    const iw = side.intake.find((w) => w.lane === p.lane);
    if (!iw || iw.task !== 'idle' || iw.parcelId) continue;
    iw.parcelId = p.id;
    iw.withCart = p.weightClass === 'medium';
    iw.task = 'to_pile';
    iw.travel = 0;
    iw.path = intakeToPile(side.team, p.lane, iw.pos);
  }
}

function stepIntake(side: SideSim, iw: IntakeWorker, dt: number) {
  const moving = iw.task === 'to_pile' || iw.task === 'to_belt' || iw.task === 'return';
  iw.phase += dt * (moving ? 5.8 : 1.2);
  const parcel = findParcel(side, iw.parcelId);

  switch (iw.task) {
    case 'idle': {
      const s = sideOf(side.team);
      iw.pos = approach(iw.pos, s.intakeHomes[iw.lane], 1.5 * dt);
      iw.heading += angleDelta(iw.heading, headingTo(iw.pos, s.intakePile)) * (1 - Math.exp(-2 * dt));
      break;
    }

    case 'to_pile': {
      if (!parcel) { releaseIntake(iw); break; }
      const r = follow(iw.path, iw.travel, WALK_SPEED, dt);
      iw.travel = r.travel; iw.pos = r.pos;
      iw.heading = r.done ? headingTo(iw.pos, parcel.pos) : r.heading;
      if (r.done) { iw.task = 'lift'; iw.t = 0; }
      break;
    }

    case 'lift': {
      iw.t += dt / 0.55;
      if (parcel) {
        // Draw the parcel off the pile into the arms (or onto the cart) while
        // bending to lift, so it is already in hand when the walk begins.
        const f = forwardOf(iw.heading);
        const hold = iw.withCart
          ? { x: iw.pos.x + f.x * 1.25, y: 0.72, z: iw.pos.z + f.z * 1.25 }
          : { x: iw.pos.x + f.x * 0.5, y: CARRY_Y, z: iw.pos.z + f.z * 0.5 };
        const dx = hold.x - parcel.pos.x, dy = hold.y - parcel.pos.y, dz = hold.z - parcel.pos.z;
        const gap = Math.hypot(dx, dy, dz);
        const step = Math.min(gap, 4.5 * dt);
        if (gap > 1e-6) parcel.pos = { x: parcel.pos.x + dx / gap * step, y: parcel.pos.y + dy / gap * step, z: parcel.pos.z + dz / gap * step };
      }
      if (iw.t >= 1 && parcel) {
        parcel.stage = 'arriving';
        iw.task = 'to_belt';
        iw.travel = 0;
        iw.path = intakePileToStaging(side.team, parcel.lane, iw.pos);
        emit(side, 'pickup');
      }
      break;
    }

    case 'to_belt': {
      if (!parcel) { releaseIntake(iw); break; }
      const r = follow(iw.path, iw.travel, CARRY_SPEED, dt);
      iw.travel = r.travel; iw.pos = r.pos;
      // Turn onto the route rather than spinning on the spot in one frame.
      iw.heading += angleDelta(iw.heading, r.heading) * (1 - Math.exp(-9 * dt));
      const f = forwardOf(iw.heading);
      // Light: held in the arms. Medium: riding on the cart pushed ahead.
      const hold = iw.withCart
        ? { x: iw.pos.x + f.x * 1.25, y: 0.72, z: iw.pos.z + f.z * 1.25 }
        : { x: iw.pos.x + f.x * 0.5, y: CARRY_Y, z: iw.pos.z + f.z * 0.5 };
      parcel.pos = easeToward(parcel.pos, hold, 14, dt);
      parcel.heading = iw.heading;
      if (r.done) {
        const l = laneOf(side.team, parcel.lane);
        iw.heading = headingTo(iw.pos, l.staging);
        iw.task = 'set_down';
        iw.t = 0;
        parcel.arc = {
          from: { ...parcel.pos }, t: 0, height: 0.25, spin: 0,
          target: { ...l.staging, y: BELT_Y },
        };
      }
      break;
    }

    case 'set_down': {
      iw.t += dt / 0.6;
      if (parcel && parcel.arc) {
        const a = parcel.arc;
        const e = smooth(Math.min(1, iw.t));
        parcel.pos = {
          x: a.from.x + (a.target.x - a.from.x) * e,
          y: a.from.y + (a.target.y - a.from.y) * e + Math.sin(Math.PI * e) * a.height,
          z: a.from.z + (a.target.z - a.from.z) * e,
        };
      }
      if (iw.t >= 1) {
        if (parcel) {
          parcel.arc = null;
          parcel.stage = 'on_belt';
          parcel.travel = 0;
          parcel.pos = { ...laneOf(side.team, parcel.lane).staging, y: BELT_Y };
          emit(side, 'belt_start');
          iw.path = intakeStagingToHome(side.team, parcel.lane, iw.pos);
        } else {
          iw.path = [iw.pos, sideOf(side.team).intakeHomes[iw.lane]];
        }
        iw.parcelId = null;
        iw.task = 'return';
        iw.travel = 0;
      }
      break;
    }

    case 'return': {
      const r = follow(iw.path, iw.travel, WALK_SPEED, dt);
      iw.travel = r.travel; iw.pos = r.pos; iw.heading = r.heading;
      if (r.done) releaseIntake(iw);
      break;
    }
  }
}

function releaseIntake(iw: IntakeWorker) {
  iw.task = 'idle';
  iw.parcelId = null;
  iw.withCart = false;
  iw.path = [];
  iw.travel = 0;
  iw.t = 0;
}

// ── LOADING / REJECT CREW ───────────────────────────────────────────────────

function claimed(side: SideSim, id: string): boolean {
  return side.forklifts.yard.parcelId === id || side.forklifts.dispatch.parcelId === id
    || side.workers.some((w) => w.parcelId === id);
}

function dispatchCarriers(side: SideSim) {
  const waiting = allParcels(side)
    .filter((p) => p.stage === 'awaiting_pickup' && !claimed(side, p.id))
    .sort((a, b) => a.seq - b.seq);

  // Crew jobs are first come, first served: a medium parcel waiting for BOTH
  // crew members must not be starved by later light parcels that keep taking
  // whichever one frees up first.
  let crewQueueBlocked = false;

  for (const p of waiting) {
    const approved = p.approved === true;

    if (p.weightClass === 'heavy') {
      const fl = side.forklifts.dispatch;
      if (fl.task !== 'parked' || fl.parcelId) continue;
      assignForklift(side, fl, p, approved ? 'to_truck' : 'to_reject',
        dispatchToExit(side.team, p.lane, approved, fl.pos));
      continue;
    }

    if (crewQueueBlocked) continue;
    const need = p.weightClass === 'medium' ? 2 : 1;
    const free = side.workers.filter((w) => w.task === 'idle' && !w.parcelId);
    if (free.length < need) { crewQueueBlocked = true; continue; }

    free.slice(0, need).forEach((w, i) => {
      const role = i as 0 | 1;
      w.parcelId = p.id;
      w.role = role;
      w.task = 'to_collect';
      w.path = routeHomeToCollect(side.team, w.pos, collectPoint(side.team, p.lane, approved, role, need === 2));
      w.travel = 0;
      w.t = 0;
    });
  }
}

function stepWorker(side: SideSim, w: Worker, dt: number) {
  const moving = w.task === 'to_collect' || w.task === 'carry' || w.task === 'return';
  w.phase += dt * (moving ? 5.8 : 1.3);
  const parcel = findParcel(side, w.parcelId);

  switch (w.task) {
    case 'idle': {
      w.pos = approach(w.pos, w.home, 1.6 * dt);
      const s = sideOf(side.team);
      w.heading += angleDelta(w.heading, headingTo(w.pos, s.lanes.A.diverter)) * (1 - Math.exp(-2 * dt));
      break;
    }

    case 'to_collect': {
      if (!parcel) { releaseWorker(w); break; }
      const len = polylineLength(w.path);
      if (w.travel < len) {
        const r = follow(w.path, w.travel, WALK_SPEED, dt);
        w.travel = r.travel; w.pos = r.pos; w.heading = r.heading;
      } else {
        w.heading = headingTo(w.pos, parcel.pos);
      }
      // A two-person lift only starts once BOTH carriers are in position, so
      // the parcel genuinely leaves the belt in both pairs of hands.
      const crew = side.workers.filter((o) => o.parcelId === w.parcelId);
      const need = parcel.weightClass === 'medium' ? 2 : 1;
      const ready = crew.length === need &&
        crew.every((o) => o.task === 'to_collect' && o.travel >= polylineLength(o.path) - 1e-3);
      if (ready) crew.forEach((o) => { o.task = 'lift'; o.t = 0; });
      break;
    }

    case 'lift': {
      w.t += dt / 0.55;
      if (parcel) w.heading = headingTo(w.pos, parcel.pos);
      if (w.t >= 1 && w.role === 0 && parcel) {
        const crew = side.workers.filter((o) => o.parcelId === w.parcelId);
        const approved = parcel.approved === true;
        parcel.stage = 'carried';
        parcel.slot = approved ? reserveCargo(side) : reserveReject(side);
        const dest = approved
          ? loadingStand(side.team, side.truckPos, side.truckHeading, parcel.slot)
          : rejectSlot(side.team, parcel.slot);
        const path = approved
          ? routeCollectToTruck(side.team, parcel.lane, w.pos, dest)
          : routeCollectToReject(side.team, w.pos, dest);
        crew.forEach((o) => { o.task = 'carry'; o.carrying = true; o.t = 0; o.travel = 0; o.path = path; });
        emit(side, 'pickup');
      }
      break;
    }

    case 'carry': {
      if (!parcel) { releaseWorker(w); break; }
      // Only the lead walks the route; the partner holds a fixed offset beside
      // them, which keeps a two-person carry perfectly in step.
      if (w.role !== 0) break;
      const r = follow(w.path, w.travel, CARRY_SPEED, dt);
      w.travel = r.travel; w.pos = r.pos;
      w.heading += angleDelta(w.heading, r.heading) * (1 - Math.exp(-9 * dt));
      const f = forwardOf(w.heading);
      const right = rightOf(w.heading);
      const partner = side.workers.find((o) => o.parcelId === w.parcelId && o.role === 1);
      let hold: Vec3;
      if (partner) {
        // The partner stays locked beside the lead so the pair moves as one.
        partner.pos = easeToward(partner.pos,
          { x: w.pos.x + right.x * 1.24, y: 0, z: w.pos.z + right.z * 1.24 }, 16, dt);
        partner.heading = w.heading;
        partner.phase = w.phase;
        hold = { x: w.pos.x + right.x * 0.62 + f.x * 0.3, y: CARRY_Y, z: w.pos.z + right.z * 0.62 + f.z * 0.3 };
      } else {
        hold = { x: w.pos.x + f.x * 0.55, y: CARRY_Y, z: w.pos.z + f.z * 0.55 };
      }
      parcel.pos = easeToward(parcel.pos, hold, 14, dt);
      parcel.heading = w.heading;

      if (r.done) {
        side.workers.filter((o) => o.parcelId === w.parcelId).forEach((o) => { o.task = 'place'; o.t = 0; });
        beginPlacement(side, parcel);
      }
      break;
    }

    case 'place': {
      w.t += dt / 0.7;
      if (w.t >= 1 && w.role === 0) {
        const approved = parcel?.approved === true;
        side.workers.filter((o) => o.parcelId === w.parcelId).forEach((o) => {
          o.carrying = false;
          o.task = 'return';
          o.travel = 0;
          o.path = routeReturnHome(side.team, o.pos, o.home, approved);
          o.parcelId = null;
        });
      }
      break;
    }

    case 'return': {
      const r = follow(w.path, w.travel, WALK_SPEED, dt);
      w.travel = r.travel; w.pos = r.pos; w.heading = r.heading;
      if (r.done) releaseWorker(w);
      break;
    }
  }

  if (!(w.task === 'carry' && w.role === 1)) separate(side, w);
}

/** Soft separation, so nobody walks through the player or a colleague. */
function separate(side: SideSim, w: Worker) {
  const obstacles: { pos: Vec3; r: number }[] = [{ pos: side.playerPos, r: 1.1 }];
  for (const o of side.workers) {
    if (o === w || (o.parcelId && o.parcelId === w.parcelId)) continue;
    obstacles.push({ pos: o.pos, r: 0.9 });
  }
  for (const o of obstacles) {
    const dx = w.pos.x - o.pos.x;
    const dz = w.pos.z - o.pos.z;
    const d = Math.hypot(dx, dz);
    if (d > 1e-4 && d < o.r) {
      const push = (o.r - d) * 0.5;
      w.pos = { x: w.pos.x + (dx / d) * push, y: 0, z: w.pos.z + (dz / d) * push };
    }
  }
}

function releaseWorker(w: Worker) {
  w.task = 'idle';
  w.carrying = false;
  w.parcelId = null;
  w.path = [];
  w.travel = 0;
  w.t = 0;
}

// ── FORKLIFT ────────────────────────────────────────────────────────────────

function forkPoint(fl: Forklift): Vec3 {
  const f = forwardOf(fl.heading);
  return { x: fl.pos.x + f.x * FORK_REACH, y: fl.forkY + 0.5, z: fl.pos.z + f.z * FORK_REACH };
}

function assignForklift(
  side: SideSim, fl: Forklift, p: SimParcel, purpose: NonNullable<Forklift['purpose']>, path: Waypoint[]
) {
  fl.parcelId = p.id;
  fl.purpose = purpose;
  fl.task = 'to_pick';
  fl.travel = 0;
  fl.path = path;
  emit(side, 'forklift_beep');
}

/** Distance either side of a corner over which a forklift swings round. */
const FORK_CORNER = 1.8;

/** Heading a forklift wants on segment i: along it, or reversed for a `rev` segment. */
function segmentHeading(path: Waypoint[], i: number): number {
  const h = headingTo(path[i], path[i + 1]);
  return path[i + 1].rev ? h + Math.PI : h;
}

/**
 * Drive a forklift along its path. Segments flagged `rev` are driven backwards
 * at reduced speed with the nose pointing away from the direction of travel.
 * The nose starts swinging toward the next segment shortly before each corner
 * and finishes shortly after it, so every change of direction is spread over a
 * few metres of travel instead of happening as a spin on the spot.
 */
function driveForklift(fl: Forklift, speed: number, dt: number) {
  const path = fl.path;
  const segs = path.length - 1;
  const lens: number[] = [];
  for (let i = 0; i < segs; i++) lens.push(dist(path[i], path[i + 1]));
  const corner = (k: number) => Math.min(FORK_CORNER, lens[k - 1] / 2, lens[k] / 2);

  const locate = (travel: number) => {
    let acc = 0;
    for (let i = 0; i < segs; i++) {
      if (travel <= acc + lens[i] || i === segs - 1) return { i, into: travel - acc, rem: acc + lens[i] - travel };
      acc += lens[i];
    }
    return { i: 0, into: 0, rem: 0 };
  };

  if (segs < 1) return { travel: fl.travel, pos: fl.pos, heading: fl.heading, done: true };
  const before = locate(fl.travel);
  const rev = !!path[before.i + 1].rev;
  const r = follow(path, fl.travel, rev ? speed * FORK_REVERSE : speed, dt);
  fl.travel = r.travel;
  fl.pos = r.pos;
  fl.reversing = rev && !r.done;

  const at = locate(r.travel);
  let want = segmentHeading(path, at.i);
  if (at.i < segs - 1 && at.rem < corner(at.i + 1)) {
    const f = 0.5 * (1 - at.rem / corner(at.i + 1));
    want += angleDelta(want, segmentHeading(path, at.i + 1)) * f;
  } else if (at.i > 0 && at.into < corner(at.i)) {
    const f = 0.5 * (1 - at.into / corner(at.i));
    want += angleDelta(want, segmentHeading(path, at.i - 1)) * f;
  }
  fl.heading += angleDelta(fl.heading, want) * (1 - Math.exp(-8 * dt));
  return r;
}

function stepForklift(side: SideSim, fl: Forklift, dt: number) {
  const parcel = findParcel(side, fl.parcelId);

  switch (fl.task) {
    case 'parked': {
      fl.reversing = false;
      fl.forkY += (0.2 - fl.forkY) * (1 - Math.exp(-4 * dt));
      break;
    }

    case 'to_pick': {
      if (!parcel) { forkliftHome(side, fl, 'abort'); break; }
      const r = driveForklift(fl, FORK_SPEED, dt);
      // Set the forks to the parcel's own height (belt or pallet) on approach.
      const meet = Math.max(0.05, parcel.pos.y - 0.5);
      fl.forkY += (meet - fl.forkY) * (1 - Math.exp(-5 * dt));
      if (r.done) {
        fl.task = 'lift';
        fl.t = 0;
        fl.liftFrom = { ...parcel.pos };
        fl.liftBase = fl.forkY;
      }
      break;
    }

    case 'lift': {
      if (!parcel) { forkliftHome(side, fl, 'abort'); break; }
      fl.t += dt / 0.8;
      const k = Math.min(1, fl.t);
      fl.forkY = fl.liftBase + k * 0.65;
      parcel.stage = fl.purpose === 'to_belt' ? 'arriving' : 'carried';
      const fp = forkPoint(fl);
      const from = fl.liftFrom ?? fp;
      const e = smooth(Math.min(1, k * 1.8));
      parcel.pos = { x: from.x + (fp.x - from.x) * e, y: from.y + (fp.y - from.y) * e, z: from.z + (fp.z - from.z) * e };
      parcel.heading = fl.heading;
      if (fl.t >= 1) {
        fl.task = 'haul';
        fl.travel = 0;
        if (fl.purpose === 'to_belt') {
          fl.path = yardRackToStaging(side.team, parcel.lane, fl.pos);
        } else if (fl.purpose === 'to_truck') {
          fl.slot = reserveCargo(side);
          parcel.slot = fl.slot;
          fl.path = dispatchExitToTruck(side.team, parcel.lane, fl.pos, side.truckPos, side.truckHeading, fl.slot);
          side.lanes[parcel.lane].status = 'IN TRANSIT';
        } else {
          fl.slot = reserveReject(side);
          parcel.slot = fl.slot;
          fl.path = dispatchExitToReject(side.team, parcel.lane, fl.pos, rejectSlot(side.team, fl.slot));
        }
        emit(side, 'pickup');
      }
      break;
    }

    case 'haul': {
      if (!parcel) { forkliftHome(side, fl, 'abort'); break; }
      const r = driveForklift(fl, FORK_SPEED * 0.8, dt);
      parcel.pos = forkPoint(fl);
      parcel.heading = fl.heading;
      if (r.done) { fl.task = 'lower'; fl.t = 0; }
      break;
    }

    case 'lower': {
      if (!parcel) { forkliftHome(side, fl, 'abort'); break; }
      fl.t += dt / 0.7;
      fl.forkY = (fl.liftBase + 0.65) - Math.min(1, fl.t) * 0.45;
      parcel.pos = forkPoint(fl);
      if (fl.purpose === 'to_belt') {
        // Settle it squarely onto the belt head as the forks come down.
        const target = { ...laneOf(side.team, parcel.lane).staging, y: BELT_Y };
        const e = smooth(Math.min(1, fl.t));
        parcel.pos = {
          x: parcel.pos.x + (target.x - parcel.pos.x) * e,
          y: parcel.pos.y + (target.y - parcel.pos.y) * e,
          z: parcel.pos.z + (target.z - parcel.pos.z) * e,
        };
      }
      if (fl.t < 1) break;

      if (fl.purpose === 'to_belt') {
        const l = laneOf(side.team, parcel.lane);
        parcel.stage = 'on_belt';
        parcel.travel = 0;
        parcel.pos = { ...l.staging, y: BELT_Y };
        emit(side, 'belt_start');
        forkliftHome(side, fl, 'belt');
      } else {
        const after = fl.purpose === 'to_truck' ? 'truck' : 'reject';
        beginPlacement(side, parcel);
        forkliftHome(side, fl, after);
      }
      break;
    }

    case 'return': {
      const r = driveForklift(fl, FORK_SPEED, dt);
      fl.forkY += (0.2 - fl.forkY) * (1 - Math.exp(-4 * dt));
      if (r.done) { fl.task = 'parked'; fl.reversing = false; }
      break;
    }
  }
}

function forkliftHome(side: SideSim, fl: Forklift, after: 'belt' | 'truck' | 'reject' | 'abort') {
  fl.parcelId = null;
  fl.purpose = null;
  fl.task = 'return';
  fl.travel = 0;
  fl.path = fl.role === 'yard'
    ? yardReturn(side.team, fl.pos, after === 'belt')
    : dispatchReturn(side.team, fl.pos, after === 'belt' ? 'abort' : after);
}

// ── PLACEMENT ───────────────────────────────────────────────────────────────

function reserveCargo(side: SideSim): number {
  return (side.cargo.length + side.reservedCargo++) % CARGO_SLOTS.length;
}
function reserveReject(side: SideSim): number {
  return side.rejected.length + side.reservedReject++;
}

function slotTarget(side: SideSim, p: SimParcel): Vec3 {
  return p.approved
    ? truckLocalToWorld(side.truckPos, side.truckHeading, CARGO_SLOTS[p.slot % CARGO_SLOTS.length])
    : rejectSlot(side.team, p.slot);
}

function beginPlacement(side: SideSim, p: SimParcel) {
  // A light rejected parcel is tossed into the pile in a playful arc (section
  // 61). Anything loaded into the truck, or carried by two people or a
  // forklift, is set down carefully.
  const toss = p.approved === false && p.weightClass === 'light';
  p.stage = 'placing';
  p.arc = { from: { ...p.pos }, t: 0, height: toss ? 1.7 : 0.3, spin: toss ? 6 : 0, target: slotTarget(side, p) };
}

function stepPlacing(side: SideSim, dt: number) {
  for (const p of allParcels(side)) {
    if (p.stage !== 'placing' || !p.arc) continue;
    const a = p.arc;
    a.t = Math.min(1, a.t + dt / (a.spin > 0 ? 0.7 : 0.55));
    const e = smooth(a.t);
    // Truck slots move with the truck, so re-read the target every frame.
    const to = slotTarget(side, p);
    p.pos = {
      x: a.from.x + (to.x - a.from.x) * e,
      y: a.from.y + (to.y - a.from.y) * e + Math.sin(Math.PI * a.t) * a.height,
      z: a.from.z + (to.z - a.from.z) * e,
    };
    p.heading += a.spin * dt;
    if (a.t < 1) continue;

    p.arc = null;
    if (p.approved) {
      p.stage = 'delivered';
      p.heading = side.truckHeading;
      side.reservedCargo = Math.max(0, side.reservedCargo - 1);
      side.cargo.push(p);
      side.lanes[p.lane].status = 'DELIVERED';
      emit(side, 'truck_load');
      onDelivered?.(side.team, p.lane, p.id);
    } else {
      p.stage = 'discarded';
      side.reservedReject = Math.max(0, side.reservedReject - 1);
      side.rejected.push(p);
      emit(side, 'reject_drop');
      onDiscarded?.(side.team, p.lane, p.id);
    }
  }
}

// ── PLAYER CHARACTER ────────────────────────────────────────────────────────

function stepPlayer(side: SideSim, dt: number) {
  const transient = side.playerMood === 'success' || side.playerMood === 'reject' ||
    side.playerMood === 'celebrate' || side.playerMood === 'shrug';
  if (transient && sim.elapsed > side.playerMoodUntil) side.playerMood = 'idle';

  const focus = focusParcel(side.team);
  if (!transient) side.playerMood = focus ? 'watching' : 'idle';

  const target = focus ? focus.parcel.pos : sideOf(side.team).lanes.A.station;
  side.playerHeading += angleDelta(side.playerHeading, headingTo(side.playerPos, target)) * (1 - Math.exp(-3 * dt));
}

// ── HELPERS ─────────────────────────────────────────────────────────────────

function follow(path: Vec3[], travel: number, speed: number, dt: number) {
  const next = travel + speed * dt;
  const r = samplePolyline(path, next, 0);
  return { travel: Math.min(next, polylineLength(path)), pos: r.pos, heading: r.heading, done: r.done };
}

/** Frame-rate independent exponential approach for a whole point. */
function easeToward(from: Vec3, to: Vec3, rate: number, dt: number): Vec3 {
  const k = 1 - Math.exp(-rate * dt);
  return { x: from.x + (to.x - from.x) * k, y: from.y + (to.y - from.y) * k, z: from.z + (to.z - from.z) * k };
}

function smooth(t: number): number {
  return t * t * (3 - 2 * t);
}

function angleDelta(from: number, to: number): number {
  let d = to - from;
  while (d > Math.PI) d -= TWO_PI;
  while (d < -Math.PI) d += TWO_PI;
  return d;
}

function approach(from: Vec3, to: Vec3, maxStep: number): Vec3 {
  const dx = to.x - from.x;
  const dz = to.z - from.z;
  const d = Math.hypot(dx, dz);
  if (d <= maxStep || d < 1e-6) return { x: to.x, y: from.y, z: to.z };
  return { x: from.x + (dx / d) * maxStep, y: from.y, z: from.z + (dz / d) * maxStep };
}

