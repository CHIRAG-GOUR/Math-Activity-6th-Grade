// ============================================================
// THE DECIMAL DELIVERY NETWORK — DEPOT LAYOUT
//
// One source of truth for where everything physically is. Renderers draw from
// these coordinates and the simulation moves parcels, workers, forklifts and
// trucks along the same points, so a parcel can never appear to travel
// somewhere the machinery isn't.
//
// Orientation (fixed by the brief):
//   BLUE = LEFT (-X)      RED = RIGHT (+X)      shared hub in the CENTRE
//
// Each side has TWO INDEPENDENT CONVEYOR LANES. Parcels flow west -> east
// (from the warehouse side toward the hub):
//
//   staging -> entry -> STATION (scale, parcel stops) -> scanner -> DIVERTER
//                                                          |          |
//                                            approved spur v          v reject chute
//                                            (to the truck)     (to the reject zone)
//
// The reject zone sits BETWEEN the two lanes' diverters, so a rejected parcel
// is carried a few metres into the bin and never has to cross a belt. The
// player character stands in the gap between the two scales. Every carry route
// is a list of named waypoints (section 74) checked against the belt
// footprints, rather than a straight line that happens to clip a conveyor.
//
// Blue is the canonical set. Red is produced by mirroring through X = 0, so the
// two sides can never drift apart.
// ============================================================

import type { TeamId } from '../types';

export interface Vec3 { x: number; y: number; z: number }

const v = (x: number, y: number, z: number): Vec3 => ({ x, y, z });
const mx = (p: Vec3): Vec3 => ({ x: -p.x, y: p.y, z: p.z });

export type LaneId = 'A' | 'B';
export const LANES: LaneId[] = ['A', 'B'];

export const DEPOT = { groundSize: 340 } as const;

/** Belt surface height — anything riding a belt sits here. */
export const BELT_Y = 1.12;
/** Height a parcel is held at while carried by hand. */
export const CARRY_Y = 1.25;
/** Truck bed surface height. */
export const BED_Y = 1.25;

// ── LANE ────────────────────────────────────────────────────────────────────

export interface LaneLayout {
  id: LaneId;
  staging: Vec3;
  entry: Vec3;
  station: Vec3;
  scanner: Vec3;
  diverter: Vec3;
  approvedExit: Vec3;
  rejectExit: Vec3;
  /** Queue spots behind the station, nearest first. */
  queue: Vec3[];
}

// ── BLUE (LEFT) — canonical ─────────────────────────────────────────────────

const BLUE_A: LaneLayout = {
  id: 'A',
  staging: v(-47, 0, -12),
  entry: v(-43, 0, -12),
  station: v(-34, 0, -9),
  scanner: v(-28.5, 0, -7),
  diverter: v(-24, 0, -5.5),
  approvedExit: v(-18.5, 0, -2),
  rejectExit: v(-23.2, 0, 0.8),
  queue: [v(-39.5, 0, -10.9), v(-42.5, 0, -11.9)],
};

// Lane B deliberately does not mirror Lane A about the gap: it sits further
// forward on a slightly different angle, so the two belts read as distinct
// routes rather than a copy-paste.
const BLUE_B: LaneLayout = {
  id: 'B',
  staging: v(-47, 0, 14),
  entry: v(-43, 0, 14),
  station: v(-34, 0, 12.5),
  scanner: v(-28.5, 0, 12),
  diverter: v(-24, 0, 12),
  approvedExit: v(-18.5, 0, 15.5),
  rejectExit: v(-23.2, 0, 7.4),
  queue: [v(-39.5, 0, 13.2), v(-42.5, 0, 13.9)],
};

interface SideCanon {
  warehouse: Vec3;
  warehouseSize: { w: number; h: number; d: number };
  palletStack: Vec3;
  /** Yard forklift parking spot: it brings heavy parcels from the rack to the belt heads. */
  forkliftHome: Vec3;
  /** Dispatch forklift parking spot, beside the hub: it takes heavy parcels off the belt exits. */
  dispatchForkHome: Vec3;
  truck: Vec3;
  truckHeading: number;
  reject: Vec3;
  player: Vec3;
  workerHome: Vec3[];
  terminal: Vec3;
  dispatchSign: Vec3;
  /** Parcels wait on a pallet by the warehouse door until the intake crew fetches them. */
  intakePile: Vec3;
  /** One intake worker per belt, so both belts are fed in parallel. */
  intakeHomes: Record<LaneId, Vec3>;
  /** Heavy parcels wait on the pallet rack for the forklift. */
  heavyPickup: Vec3;
  nav: Record<NavName, Vec3>;
  lanes: Record<LaneId, LaneLayout>;
}

/**
 * Named navigation points (section 74). Every carrier movement is assembled
 * from these, never from a straight line between two arbitrary spots.
 */
export type NavName =
  | 'westCorridorSouth'   // behind lane A, in front of the warehouse doors
  | 'westCorridorNorth'   // west of lane B's staging point
  | 'westGate'            // west end of the south service road
  | 'southRoadEast'       // east end of the south service road
  | 'eastAisleSouth'      // aisle between the diverters and the hub
  | 'eastAisleNorth'
  | 'truckAisle'          // approach to the truck bed
  | 'intakeCorridor'      // west of both belt heads, used by the intake crew
  | 'forkBay'             // entrance to the dispatch forklift's parking bay
  | 'forkAisleMid'        // dispatch forklift aisle, clear of the hub plinth
  | 'forkAisleNorth';     // same aisle, past the hub cross belt

const BLUE: SideCanon = {
  warehouse: v(-38, 0, -31),
  warehouseSize: { w: 30, h: 13, d: 14 },
  palletStack: v(-52, 0, -18),
  forkliftHome: v(-56, 0, -16),
  dispatchForkHome: v(-13.4, 0, -6.2),

  // The truck stands lengthwise, facing the hub (+X), with its open bed toward
  // the depot and in full view of the camera. heading = -PI/2 faces +X.
  truck: v(-17, 0, 26),
  truckHeading: -Math.PI / 2,

  // Reject zone in the gap between the two diverters.
  reject: v(-21.5, 0, 4.1),
  // Player character in the gap between the two scales, facing the belts.
  player: v(-34.5, 0, 1.8),

  workerHome: [v(-14.5, 0, 2), v(-14.5, 0, 8.5)],
  terminal: v(-11.5, 0, 21),
  dispatchSign: v(-24.5, 0, 22),

  intakePile: v(-40, 0, -21.3),
  intakeHomes: { A: v(-43.5, 0, -19.6), B: v(-45.6, 0, -18.4) },
  heavyPickup: v(-49, 0, -21.2),

  nav: {
    westCorridorSouth: v(-51, 0, -17),
    westCorridorNorth: v(-51, 0, 14),
    westGate: v(-51, 0, -18.5),
    southRoadEast: v(-14, 0, -18.5),
    eastAisleSouth: v(-13.5, 0, -1),
    eastAisleNorth: v(-13.5, 0, 12),
    truckAisle: v(-19.5, 0, 21.5),
    intakeCorridor: v(-49.6, 0, -16.5),
    forkBay: v(-11.4, 0, -5.2),
    forkAisleMid: v(-11.8, 0, 2.4),
    forkAisleNorth: v(-11.8, 0, 17),
  },

  lanes: { A: BLUE_A, B: BLUE_B },
};

// ── PUBLIC LAYOUT ───────────────────────────────────────────────────────────

export interface SideLayout extends SideCanon {}

function mirrorLane(l: LaneLayout): LaneLayout {
  return {
    id: l.id,
    staging: mx(l.staging), entry: mx(l.entry), station: mx(l.station),
    scanner: mx(l.scanner), diverter: mx(l.diverter),
    approvedExit: mx(l.approvedExit), rejectExit: mx(l.rejectExit),
    queue: l.queue.map(mx),
  };
}

function mirrorSide(s: SideCanon): SideLayout {
  const nav = {} as Record<NavName, Vec3>;
  (Object.keys(s.nav) as NavName[]).forEach((k) => { nav[k] = mx(s.nav[k]); });
  return {
    warehouse: mx(s.warehouse),
    warehouseSize: s.warehouseSize,
    palletStack: mx(s.palletStack),
    forkliftHome: mx(s.forkliftHome),
    dispatchForkHome: mx(s.dispatchForkHome),
    truck: mx(s.truck),
    // Mirroring through X flips the sign of a heading.
    truckHeading: -s.truckHeading,
    reject: mx(s.reject),
    player: mx(s.player),
    workerHome: s.workerHome.map(mx),
    terminal: mx(s.terminal),
    dispatchSign: mx(s.dispatchSign),
    intakePile: mx(s.intakePile),
    intakeHomes: { A: mx(s.intakeHomes.A), B: mx(s.intakeHomes.B) },
    heavyPickup: mx(s.heavyPickup),
    nav,
    lanes: { A: mirrorLane(s.lanes.A), B: mirrorLane(s.lanes.B) },
  };
}

export const SIDES: Record<TeamId, SideLayout> = {
  blue: BLUE,
  red: mirrorSide(BLUE),
};

export const sideOf = (team: TeamId): SideLayout => SIDES[team];
export const laneOf = (team: TeamId, lane: LaneId): LaneLayout => SIDES[team].lanes[lane];
export const sideSign = (team: TeamId): number => (team === 'blue' ? -1 : 1);

// ── HUB ─────────────────────────────────────────────────────────────────────

export const HUB = {
  centre: v(0, 0, 1),
  machineSize: { w: 18, h: 9, d: 15 },
  crossBeltZ: 12,
  crossBeltHalfWidth: 10,
  boardHeight: 12.5,
  gate: v(0, 0, 44),
  gateWidth: 22,
} as const;

// ── GEOMETRY HELPERS ────────────────────────────────────────────────────────

export function lerpVec(a: Vec3, b: Vec3, t: number, y?: number): Vec3 {
  return { x: a.x + (b.x - a.x) * t, y: y ?? a.y + (b.y - a.y) * t, z: a.z + (b.z - a.z) * t };
}

/** Heading (rotation.y) that faces from `a` toward `b`. */
export function headingTo(a: Vec3, b: Vec3): number {
  return Math.atan2(-(b.x - a.x), -(b.z - a.z));
}

export const dist = (a: Vec3, b: Vec3): number => Math.hypot(a.x - b.x, a.z - b.z);

export function forwardOf(h: number): { x: number; z: number } {
  return { x: -Math.sin(h), z: -Math.cos(h) };
}
export function rightOf(h: number): { x: number; z: number } {
  return { x: Math.cos(h), z: -Math.sin(h) };
}

function unit(a: Vec3, b: Vec3): { x: number; z: number } {
  const d = Math.hypot(b.x - a.x, b.z - a.z) || 1;
  return { x: (b.x - a.x) / d, z: (b.z - a.z) / d };
}

export function polylineLength(points: Vec3[]): number {
  let total = 0;
  for (let i = 0; i < points.length - 1; i++) total += dist(points[i], points[i + 1]);
  return total;
}

/** Walk an OPEN polyline. `done` becomes true once past the end. */
export function samplePolyline(points: Vec3[], d: number, y?: number) {
  let rem = Math.max(0, d);
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    const seg = dist(a, b);
    if (rem <= seg) {
      const t = seg < 1e-6 ? 0 : rem / seg;
      return { pos: lerpVec(a, b, t, y), heading: headingTo(a, b), done: false, seg: i };
    }
    rem -= seg;
  }
  const last = points[points.length - 1];
  const prev = points[points.length - 2] ?? last;
  return {
    pos: { x: last.x, y: y ?? last.y, z: last.z }, heading: headingTo(prev, last), done: true,
    seg: Math.max(0, points.length - 2),
  };
}

export function sampleLoop(points: Vec3[], d: number) {
  const closed = [...points, points[0]];
  const total = polylineLength(closed);
  return samplePolyline(closed, ((d % total) + total) % total, 0);
}

// ── BELTS ───────────────────────────────────────────────────────────────────

/** Full approved conveyor run, drawn as belt frame. */
export function mainBelt(team: TeamId, lane: LaneId): Vec3[] {
  const l = laneOf(team, lane);
  return [l.entry, l.station, l.scanner, l.diverter, l.approvedExit];
}

/** Reject chute off the diverter. */
export function rejectChute(team: TeamId, lane: LaneId): Vec3[] {
  const l = laneOf(team, lane);
  return [l.diverter, l.rejectExit];
}

/** The path a parcel rides after the station, for each outcome. */
export function runAfterStation(team: TeamId, lane: LaneId, approved: boolean): Vec3[] {
  const l = laneOf(team, lane);
  return approved
    ? [l.station, l.scanner, l.diverter, l.approvedExit]
    : [l.station, l.scanner, l.diverter, l.rejectExit];
}

/** Direction a parcel is travelling as it reaches an exit. */
export function exitDirection(team: TeamId, lane: LaneId, approved: boolean) {
  const l = laneOf(team, lane);
  return unit(l.diverter, approved ? l.approvedExit : l.rejectExit);
}

// ── TRUCK ───────────────────────────────────────────────────────────────────
// The truck is a flatbed with dropside rails, so its load is visible from the
// playing camera. Cargo positions are in TRUCK-LOCAL space: +X across the bed,
// +Z toward the rear.
//
// Every parcel position in this file is the parcel's BASE (the surface it sits
// on). The renderer lifts each parcel by half its own height, so a flat
// envelope and a tall crate both sit correctly on the same slot. They are converted to world space every frame, so the
// cargo stays on the truck when it drives away.

export const CARGO_SLOTS: Vec3[] = (() => {
  const out: Vec3[] = [];
  // 2 levels x 4 rows along the bed x 3 across = 24 slots. Filled front row
  // first, bottom level first, so the load visibly builds up the bed.
  for (let level = 0; level < 2; level++) {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 3; col++) {
        out.push(v(-0.82 + col * 0.82, BED_Y + level * 1.15, 0.55 + row * 1.0));
      }
    }
  }
  return out;
})();

export function truckLocalToWorld(truckPos: Vec3, heading: number, local: Vec3): Vec3 {
  const c = Math.cos(heading);
  const s = Math.sin(heading);
  return {
    x: truckPos.x + local.x * c + local.z * s,
    y: local.y,
    z: truckPos.z - local.x * s + local.z * c,
  };
}

/** Where a carrier stands to load: the bed side facing the depot. */
export function loadingStand(team: TeamId, truckPos: Vec3, heading: number, slot: number): Vec3 {
  const local = CARGO_SLOTS[slot % CARGO_SLOTS.length];
  // Bed side facing the depot is truck-local -X for blue (heading -PI/2 maps
  // local -X to world -Z) and +X for red after mirroring.
  const sideX = team === 'blue' ? -2.35 : 2.35;
  return { ...truckLocalToWorld(truckPos, heading, { x: sideX, y: 0, z: local.z }), y: 0 };
}

/** Reject pile slots, in world space around the reject zone. */
export function rejectSlot(team: TeamId, index: number): Vec3 {
  const r = sideOf(team).reject;
  const i = index % 15;
  const col = i % 5;
  const row = Math.floor(i / 5);
  return v(r.x - 1.7 + col * 0.85, 0.34 + row * 0.62, r.z - 0.7 + row * 0.7);
}

// ── CARRIER ROUTES ──────────────────────────────────────────────────────────
// Each function returns the waypoint list for one purpose. Segments were laid
// out against the belt footprints above so none of them crosses a conveyor.

/** Where a carrier waits to collect a parcel from an exit. */
export function collectPoint(team: TeamId, lane: LaneId, approved: boolean, role: 0 | 1, pair: boolean): Vec3 {
  const l = laneOf(team, lane);
  const exit = approved ? l.approvedExit : l.rejectExit;
  const d = exitDirection(team, lane, approved);
  const r = { x: d.z, z: -d.x };
  const lateral = pair ? (role === 0 ? -0.62 : 0.62) : 0;
  return v(exit.x + d.x * 0.95 + r.x * lateral, 0, exit.z + d.z * 0.95 + r.z * lateral);
}

export function routeHomeToCollect(team: TeamId, from: Vec3, to: Vec3): Vec3[] {
  return [from, to];
}

export function routeCollectToTruck(team: TeamId, lane: LaneId, from: Vec3, stand: Vec3): Vec3[] {
  const n = sideOf(team).nav;
  // Lane A's exit sits south of lane B's belt, so go round its east end.
  return lane === 'A'
    ? [from, n.eastAisleSouth, n.eastAisleNorth, n.truckAisle, stand]
    : [from, n.truckAisle, stand];
}

export function routeCollectToReject(team: TeamId, from: Vec3, drop: Vec3): Vec3[] {
  return [from, { ...drop, y: 0, z: drop.z + (from.z < drop.z ? -1.4 : 1.4) }];
}

export function routeReturnHome(team: TeamId, from: Vec3, home: Vec3, viaTruck: boolean): Vec3[] {
  const n = sideOf(team).nav;
  return viaTruck ? [from, n.truckAisle, n.eastAisleNorth, home] : [from, home];
}

// ── INTAKE (section 50) ──
// Light and medium parcels are walked out of the warehouse by the intake crew
// and set on the belt head. Heavy parcels come from the pallet rack by forklift.

/** Parcels waiting at the warehouse door, stacked on a pallet. */
export function intakeSlot(team: TeamId, index: number): Vec3 {
  const p = sideOf(team).intakePile;
  const i = index % 6;
  return v(p.x - 1.0 + (i % 3) * 1.0, 0.3 + Math.floor(i / 3) * 1.15, p.z);
}

/** Where the intake worker stands to set a parcel on a lane's belt head. */
export function intakeStand(team: TeamId, lane: LaneId): Vec3 {
  const l = laneOf(team, lane);
  const sign = sideSign(team);
  // Beside the belt head on the outer (warehouse) side.
  return lane === 'A'
    ? v(l.staging.x, 0, l.staging.z - 1.25)
    : v(l.staging.x + sign * 1.25, 0, l.staging.z);
}

export function intakeToPile(team: TeamId, lane: LaneId, from: Vec3): Vec3[] {
  const s = sideOf(team);
  // Each belt's intake worker takes its own side of the pile.
  const off = (lane === 'A' ? 0.9 : -0.9) * -sideSign(team);
  return [from, v(s.intakePile.x + off, 0, s.intakePile.z + 1.3)];
}

export function intakePileToStaging(team: TeamId, lane: LaneId, from: Vec3): Vec3[] {
  const s = sideOf(team);
  const c = s.nav.intakeCorridor;
  const stand = intakeStand(team, lane);
  return lane === 'A'
    ? [from, v(stand.x, 0, c.z), stand]
    : [from, c, v(c.x, 0, stand.z - 1.5), stand];
}

export function intakeStagingToHome(team: TeamId, lane: LaneId, from: Vec3): Vec3[] {
  const s = sideOf(team);
  const c = s.nav.intakeCorridor;
  const home = s.intakeHomes[lane];
  return lane === 'A'
    ? [from, v(from.x, 0, c.z), home]
    : [from, v(c.x, 0, from.z - 1.5), c, home];
}

// ── FORKLIFT ROUTES ──
// Two forklifts per depot, one each side of the belts, so neither has to cross
// the whole site and neither can be tied up by the other's work:
//
//   YARD      rack -> belt heads, parked by the warehouse
//   DISPATCH  belt exits -> truck bed or reject zone, parked beside the hub
//
// A waypoint marked `rev` is driven in REVERSE: the forklift keeps its nose
// where it is and backs away, the way a real one leaves a pallet. Every pick-up
// and drop-off is approached along a straight final run, so a forklift never
// has to turn on the spot.

export type Waypoint = Vec3 & { rev?: boolean };

const back = (p: Vec3): Waypoint => ({ ...p, rev: true });

/** Distance from forklift centre to the point where a lifted parcel sits. */
export const FORK_REACH = 1.55;

/** Forklift centre such that the forks put a parcel exactly at `target`. */
function forkStandFor(target: Vec3, heading: number): Vec3 {
  const f = forwardOf(heading);
  return v(target.x - f.x * FORK_REACH, 0, target.z - f.z * FORK_REACH);
}

// YARD FORKLIFT

export function yardToRack(team: TeamId, from: Vec3): Waypoint[] {
  const s = sideOf(team);
  // Face the rack (toward -Z) so the forks slide under the pallet.
  const stand = forkStandFor(s.heavyPickup, 0);
  return [from, back(v(stand.x, 0, s.forkliftHome.z)), stand];
}

export function yardRackToStaging(team: TeamId, lane: LaneId, from: Vec3): Waypoint[] {
  const s = sideOf(team);
  const l = s.lanes[lane];
  const cx = s.nav.westCorridorSouth.x;
  // Face along the feed (toward the hub) and set the parcel on the belt head.
  const stand = forkStandFor(l.staging, headingTo(l.staging, l.entry));
  return [from, back(v(from.x, 0, s.forkliftHome.z - 0.2)), v(cx, 0, -14.5), v(cx, 0, stand.z), stand];
}

export function yardReturn(team: TeamId, from: Vec3, afterDrop: boolean): Waypoint[] {
  const s = sideOf(team);
  const cx = s.nav.westCorridorSouth.x;
  const home = s.forkliftHome;
  return afterDrop
    ? [from, back(v(cx, 0, from.z)), v(cx, 0, home.z), home]
    : [from, v(cx, 0, from.z), v(cx, 0, home.z), home];
}

// DISPATCH FORKLIFT

/** Where the dispatch forklift stands to lift a parcel off a belt exit, and its run-in point. */
export function exitPickup(team: TeamId, lane: LaneId, approved: boolean) {
  const l = laneOf(team, lane);
  if (approved) {
    // Drive up the belt's own line, facing back along it.
    const d = exitDirection(team, lane, true);
    const e = l.approvedExit;
    return {
      stand: v(e.x + d.x * FORK_REACH, 0, e.z + d.z * FORK_REACH),
      pre: v(e.x + d.x * 5.5, 0, e.z + d.z * 5.5),
    };
  }
  // The reject chute points into the reject zone, so come in side-on from the
  // hub side rather than driving through the zone.
  const sign = sideSign(team);
  const e = l.rejectExit;
  return {
    stand: v(e.x - sign * FORK_REACH, 0, e.z),
    pre: v(e.x - sign * 4.6, 0, e.z),
  };
}

export function dispatchToExit(team: TeamId, lane: LaneId, approved: boolean, from: Vec3): Waypoint[] {
  const n = sideOf(team).nav;
  const sign = sideSign(team);
  const { stand, pre } = exitPickup(team, lane, approved);
  // Back out of the parking bay first.
  const out = back(n.forkBay);
  if (approved) {
    return lane === 'A' ? [from, out, pre, stand] : [from, out, n.forkAisleMid, pre, stand];
  }
  const via = lane === 'A'
    ? v(n.eastAisleSouth.x - sign * 0.7, 0, pre.z)
    : v(n.forkAisleMid.x + sign * 0.8, 0, 2.0);
  return [from, out, via, pre, stand];
}

export function dispatchExitToTruck(
  team: TeamId, lane: LaneId, from: Vec3, truckPos: Vec3, heading: number, slot: number
): Waypoint[] {
  const n = sideOf(team).nav;
  const stand = loadingStand(team, truckPos, heading, slot);
  const pre = v(stand.x, 0, stand.z - 3.2);
  if (lane === 'A') {
    // Back straight down the belt line until level with the hub aisle.
    const d = exitDirection(team, lane, true);
    const t = Math.abs((n.forkAisleMid.x - from.x) / (d.x || 1));
    return [from, back(v(from.x + d.x * t, 0, from.z + d.z * t)), n.forkAisleNorth, pre, stand];
  }
  return [from, back(exitPickup(team, lane, true).pre), pre, stand];
}

export function dispatchExitToReject(team: TeamId, lane: LaneId, from: Vec3, drop: Vec3): Waypoint[] {
  const sign = sideSign(team);
  // Tip it in over the zone's hub-side edge, forks toward the pile.
  const stand = v(drop.x - sign * 2.8, 0, drop.z);
  const pre = v(stand.x - sign * 2.6, 0, drop.z);
  return [from, back(exitPickup(team, lane, false).pre), back(pre), stand];
}

export function dispatchReturn(team: TeamId, from: Vec3, after: 'truck' | 'reject' | 'abort'): Waypoint[] {
  const s = sideOf(team);
  const n = s.nav;
  const sign = sideSign(team);
  const home = s.dispatchForkHome;
  if (after === 'truck') {
    // Reverse away from the bed so the nose swings round toward the aisle.
    return [from, back(v(from.x + sign * 2.2, 0, from.z - 2.65)), n.forkAisleNorth, n.forkAisleMid, n.forkBay, home];
  }
  if (after === 'reject') {
    return [from, back(v(from.x - sign * 3, 0, from.z + 1.5)), n.forkAisleMid, n.forkBay, home];
  }
  return [from, n.forkBay, home];
}

// ── TRUCK DEPARTURE ─────────────────────────────────────────────────────────

export function truckDepartureRoute(team: TeamId): Vec3[] {
  const s = sideOf(team);
  const sign = sideSign(team);
  return [
    s.truck,
    v(s.truck.x - sign * 8, 0, s.truck.z + 0.5),
    v(-sign * 4, 0, 31),
    v(0, 0, 36.5),
    v(0, 0, 44),
    v(0, 0, 70),
    v(0, 0, 125),
  ];
}

// ── CAMERA SHOTS ────────────────────────────────────────────────────────────

export interface Shot { pos: Vec3; look: Vec3; fov: number }

export const CAMERAS: Record<string, Shot> = {
  overview: { pos: v(0, 44, 80), look: v(0, 2, 4), fov: 42 },
  roundIntro: { pos: v(0, 34, 66), look: v(0, 3, 4), fov: 42 },
  introA: { pos: v(-78, 50, 78), look: v(0, 4, -4), fov: 46 },
  introB: { pos: v(66, 18, 34), look: v(-8, 3, 4), fov: 42 },
  introC: { pos: v(0, 20, 60), look: v(0, 3, 8), fov: 40 },
};

/**
 * Main operating view. Both teams must stay playable at once, so the main
 * camera never cuts to one team's station — it holds both depots, and each
 * team additionally gets its own close-up "station camera" window.
 */
export const OPERATING_SHOT: Shot = { pos: v(0, 36, 64), look: v(0, 1.5, 5), fov: 44 };

/**
 * Close-up framing for a team's station window: the parcel on the scale, the
 * digital display and the player character all in one medium shot
 * (section 88).
 *
 * The camera stands at the hub end of the gap between the two belts, low, and
 * frames the midpoint between the scale and the player. Lane A is filmed
 * looking toward the warehouse, Lane B looking toward the road — see
 * `labelYawFor`, which turns each lane's labels to read upright for its view.
 */
export function stationShot(team: TeamId, focus: Vec3, lane: LaneId): Shot {
  const sign = sideSign(team);
  const p = sideOf(team).player;
  const mid = v((focus.x + p.x) / 2, 0, (focus.z + p.z) / 2);
  return {
    pos: v(mid.x - sign * 8.5, 5.4, mid.z + (lane === 'A' ? 3.6 : -3.6)),
    look: v(mid.x, 1.25, mid.z),
    fov: 44,
  };
}

/**
 * World yaw a parcel's shipping label should hold so its print reads upright
 * in that lane's station window: Lane A's camera looks toward -Z, Lane B's
 * toward +Z.
 */
export function labelYawFor(lane: LaneId): number {
  return lane === 'A' ? 0 : Math.PI;
}

/** Framing that follows a parcel as it is carried to the truck or the bin. */
export function followShot(team: TeamId, focus: Vec3): Shot {
  const sign = sideSign(team);
  // Low and close, slightly toward the hub and the road, so the carriers and
  // the parcel in their hands fill the window rather than the belts around them.
  return {
    pos: v(focus.x - sign * 4.5, 5.2, focus.z + 8),
    look: v(focus.x, 1.1, focus.z - 0.5),
    fov: 44,
  };
}
