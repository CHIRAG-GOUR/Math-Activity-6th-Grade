// ============================================================
// THE DECIMAL DELIVERY NETWORK — DEPOT LAYOUT
//
// One source of truth for where everything physically is. The 3D components
// draw from these coordinates and the simulation moves parcels, workers,
// forklifts and trucks along the same paths, so a package can never appear to
// travel somewhere the machinery isn't.
//
// Orientation, fixed by the brief:
//   BLUE = LEFT (-X)      RED = RIGHT (+X)      shared hub in the CENTRE
// Neither team is ever above the other. Both face the central facility.
//
// The two sides are exact mirrors through X = 0, produced by `mirror()` rather
// than a second hand-typed set of numbers, so they cannot drift apart.
// ============================================================

import type { TeamId } from '../types';

export interface Vec3 { x: number; y: number; z: number }

const v = (x: number, y: number, z: number): Vec3 => ({ x, y, z });

/** Reflect a point to the opposite side of the facility. */
function mirror(p: Vec3): Vec3 {
  return { x: -p.x, y: p.y, z: p.z };
}

// ── FACILITY DIMENSIONS ─────────────────────────────────────────────────────

export const DEPOT = {
  /** Ground plane half-extent. */
  groundSize: 320,
  /** Where the two depots end and the shared hub begins. */
  hubHalfWidth: 13,
  /** Front edge of the building line. */
  buildingZ: -26,
  /** The dispatch road runs out this way. */
  roadExitZ: 46,
  laneWidth: 7,
} as const;

// ── BLUE (LEFT) SIDE — the canonical set ────────────────────────────────────
// Everything downstream mirrors these.

const BLUE = {
  /** Warehouse shell. */
  warehouse: v(-36, 0, -26),
  warehouseSize: { w: 34, h: 13, d: 18 },

  /** Where pallets wait to be collected. */
  palletStack: v(-45, 0, -9),
  /** Forklift's parking spot between jobs. */
  forkliftHome: v(-45, 0, -19),

  /** The weighing platform — the machine the player actually operates. */
  scale: v(-31, 0, -2),
  /** Start of the belt leaving the scale. */
  conveyorStart: v(-29.5, 0, 1),
  /** Scanner arch part-way along the belt. */
  scanner: v(-26, 0, 7),
  /** Diverter gate at the end of the belt. */
  sortGate: v(-23, 0, 13),
  /** Where the belt drops the parcel for the loading crew. */
  loadPoint: v(-20, 0, 18),

  /** Truck parked at the loading bay. */
  truck: v(-16.5, 0, 24),
  truckHeading: 0,

  /** Loading crew idle position. */
  workerHome: v(-24.5, 0, 19),
  /** Second worker, working the belt. */
  workerBelt: v(-27.5, 0, 4),

  /** Team's dispatch terminal (money/order readout in-world). */
  terminal: v(-13.5, 0, 6),
} as const;

export interface SideLayout {
  warehouse: Vec3;
  warehouseSize: { w: number; h: number; d: number };
  palletStack: Vec3;
  forkliftHome: Vec3;
  scale: Vec3;
  conveyorStart: Vec3;
  scanner: Vec3;
  sortGate: Vec3;
  loadPoint: Vec3;
  truck: Vec3;
  truckHeading: number;
  workerHome: Vec3;
  workerBelt: Vec3;
  terminal: Vec3;
}

function mirrorSide(s: SideLayout): SideLayout {
  return {
    warehouse: mirror(s.warehouse),
    warehouseSize: s.warehouseSize,
    palletStack: mirror(s.palletStack),
    forkliftHome: mirror(s.forkliftHome),
    scale: mirror(s.scale),
    conveyorStart: mirror(s.conveyorStart),
    scanner: mirror(s.scanner),
    sortGate: mirror(s.sortGate),
    loadPoint: mirror(s.loadPoint),
    truck: mirror(s.truck),
    truckHeading: s.truckHeading,
    workerHome: mirror(s.workerHome),
    workerBelt: mirror(s.workerBelt),
    terminal: mirror(s.terminal),
  };
}

export const SIDES: Record<TeamId, SideLayout> = {
  blue: BLUE as SideLayout,
  red: mirrorSide(BLUE as SideLayout),
};

export function sideOf(team: TeamId): SideLayout {
  return SIDES[team];
}

/** +1 for red (right), -1 for blue (left). Handy for facing and offsets. */
export function sideSign(team: TeamId): number {
  return team === 'blue' ? -1 : 1;
}

// ── CENTRAL LOGISTICS HUB ───────────────────────────────────────────────────

export const HUB = {
  centre: v(0, 0, 2),
  /** Main sorting machine footprint. */
  machineSize: { w: 20, h: 9, d: 16 },
  /** Cross conveyor running between the two depots. */
  crossBeltZ: 10,
  crossBeltHalfWidth: 11,
  /** Big overhead destination board. */
  boardHeight: 12.5,
  /** Dispatch gate the winning truck drives through. */
  gate: v(0, 0, 40),
  gateWidth: 22,
} as const;

// ── PARCEL JOURNEY ──────────────────────────────────────────────────────────
// The physical chain the brief asks for, in order:
//   forklift brings it -> scale -> (correct answer) -> belt -> scanner
//   -> sort gate -> worker carries -> truck
//
// Each leg is a named waypoint list. The simulation walks these; it never
// invents positions of its own.

export interface JourneyLeg {
  from: Vec3;
  to: Vec3;
  /** Seconds the leg should take at normal speed. */
  duration: number;
  /** Height the parcel rides at along this leg. */
  y: number;
}

const BELT_Y = 1.15;
const CARRY_Y = 1.35;

export function parcelJourney(team: TeamId): Record<string, JourneyLeg> {
  const s = sideOf(team);
  return {
    // Forklift delivering the pallet to the weighing platform.
    arriving: { from: s.palletStack, to: s.scale, duration: 2.6, y: 1.0 },
    // Belt run after a correct answer.
    toScanner: { from: s.conveyorStart, to: s.scanner, duration: 1.5, y: BELT_Y },
    toGate: { from: s.scanner, to: s.sortGate, duration: 1.4, y: BELT_Y },
    toDrop: { from: s.sortGate, to: s.loadPoint, duration: 1.2, y: BELT_Y },
    // Worker carrying it into the truck.
    toTruck: { from: s.loadPoint, to: s.truck, duration: 1.8, y: CARRY_Y },
  };
}

/** Straight-line lerp between two points. */
export function lerpVec(a: Vec3, b: Vec3, t: number, y?: number): Vec3 {
  return {
    x: a.x + (b.x - a.x) * t,
    y: y !== undefined ? y : a.y + (b.y - a.y) * t,
    z: a.z + (b.z - a.z) * t,
  };
}

/** Heading (rotation.y) that faces from `a` toward `b`. */
export function headingTo(a: Vec3, b: Vec3): number {
  return Math.atan2(-(b.x - a.x), -(b.z - a.z));
}

// ── FORKLIFT ROUTE ──────────────────────────────────────────────────────────
// A closed lane the forklift drives continuously, on marked warehouse floor —
// never cutting across the belt or through a wall.

export function forkliftRoute(team: TeamId): Vec3[] {
  const s = sideOf(team);
  const sign = sideSign(team);
  return [
    s.forkliftHome,
    v(s.forkliftHome.x + sign * 0, 0, -13),
    s.palletStack,
    v(s.palletStack.x - sign * 6, 0, -6),
    v(s.scale.x - sign * 4.5, 0, -3),
    v(s.scale.x - sign * 4.5, 0, -12),
    v(s.forkliftHome.x, 0, -16),
  ];
}

/** Total route length, used to convert speed into progress. */
export function routeLength(points: Vec3[]): number {
  let total = 0;
  for (let i = 0; i < points.length; i++) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    total += Math.hypot(b.x - a.x, b.z - a.z);
  }
  return total;
}

/** Sample a looping route at distance `d` metres. */
export function sampleRoute(points: Vec3[], d: number): { pos: Vec3; heading: number } {
  const total = routeLength(points);
  let dist = ((d % total) + total) % total;
  for (let i = 0; i < points.length; i++) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    const seg = Math.hypot(b.x - a.x, b.z - a.z);
    if (dist <= seg) {
      const t = seg < 1e-6 ? 0 : dist / seg;
      return { pos: lerpVec(a, b, t, 0), heading: headingTo(a, b) };
    }
    dist -= seg;
  }
  return { pos: points[0], heading: 0 };
}

// ── TRUCK DEPARTURE ─────────────────────────────────────────────────────────
// The winning truck pulls out of its bay, joins the depot road, passes through
// the dispatch gate and heads for the city. Every metre is on real road.

export function truckDepartureRoute(team: TeamId): Vec3[] {
  const s = sideOf(team);
  const sign = sideSign(team);
  return [
    s.truck,
    v(s.truck.x - sign * 2, 0, 30),
    v(s.truck.x - sign * 6, 0, 35),
    v(HUB.gate.x, 0, 39),
    v(HUB.gate.x, 0, 58),
    v(HUB.gate.x, 0, 110),
  ];
}

/** Where the loser's truck sits while it waits. Unchanged from its bay. */
export function waitingTruckPose(team: TeamId): { pos: Vec3; heading: number } {
  const s = sideOf(team);
  return { pos: s.truck, heading: s.truckHeading };
}

// ── CAMERA FRAMING ──────────────────────────────────────────────────────────

export const CAMERAS = {
  /** Wide shot showing both depots and the hub. The default. */
  operating: {
    pos: v(0, 34, 62),
    look: v(0, 3, 2),
    fov: 42,
  },
  /** Slightly closer for round intros. */
  roundIntro: {
    pos: v(0, 26, 50),
    look: v(0, 4, 0),
    fov: 44,
  },
  /** Opening fly-through beats. */
  introA: { pos: v(-54, 40, 70), look: v(0, 4, -4), fov: 46 },
  introB: { pos: v(46, 14, 34), look: v(-6, 3, 4), fov: 40 },
  introC: { pos: v(0, 12, 44), look: v(0, 3, 6), fov: 38 },
  /** Follows the departing truck. */
  dispatch: { pos: v(26, 12, 54), look: v(0, 2, 44), fov: 44 },
} as const;
