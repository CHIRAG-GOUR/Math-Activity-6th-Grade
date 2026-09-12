// ============================================================
// PATTERN RACERS — WORLD LAYOUT
//
// Describes every large structure ONCE. The renderer draws from these arrays
// and the physics builds its colliders from the same arrays, so a building can
// never be visually somewhere its collider is not.
//
// Only large structures get colliders. Cones, flags, spectators, tool carts
// and signage are decorative and deliberately non-solid — giving every prop a
// physics body is how you lose 60 FPS for no gameplay benefit.
// ============================================================

import {
  CIRCUIT, PIT_LANE, TRACK, PIT,
  GARAGE_SLOTS, TYRE_BAY_SLOTS, START_FINISH_S, PIT_STATIONS,
  type Slot,
} from './circuit';
import {
  type Collider, makeCollider,
  generateTrackBarriers, generatePitBarriers,
  ColliderGrid,
} from './collision';

// ── GARAGES ─────────────────────────────────────────────────────────────────
// Each garage is a real shell: floor, back wall, two side walls, roof and a
// header beam over the opening. Only the door opening is open, and it faces
// directly onto the pit lane so the car drives straight out onto asphalt.

export interface GarageBay {
  team: 'blue' | 'red';
  /** Centre of the garage floor. */
  x: number;
  z: number;
  /** Heading of the bay's depth axis: the opening faces -right of this. */
  heading: number;
  width: number;   // across the opening
  depth: number;   // back wall to opening
  height: number;
}

const GARAGE_W = 13;
const GARAGE_D = 12;
const GARAGE_H = 6.2;

function garageBay(team: 'blue' | 'red', slot: Slot): GarageBay {
  return { team, x: slot.x, z: slot.z, heading: slot.heading, width: GARAGE_W, depth: GARAGE_D, height: GARAGE_H };
}

export const GARAGES: GarageBay[] = [
  garageBay('blue', GARAGE_SLOTS.blue),
  garageBay('red', GARAGE_SLOTS.red),
];

/**
 * A garage's local frame: +right points deeper into the bay (away from the
 * lane), +forward runs along the lane. The opening is therefore on the -right
 * face, and we wall the other three.
 */
function garageColliders(g: GarageBay): Collider[] {
  const c = Math.cos(g.heading), s = Math.sin(g.heading);
  const rx = c, rz = -s;          // right vector
  const fx = -s, fz = -c;         // forward vector
  const t = 0.45;                 // wall thickness

  const out: Collider[] = [];

  // Back wall, at the far (deep) end of the bay.
  out.push(makeCollider(
    g.x + rx * (g.depth * 0.5), g.z + rz * (g.depth * 0.5),
    t, g.width * 0.5, g.heading, g.height, 'building'
  ));

  // Two side walls, running the depth of the bay.
  for (const sign of [1, -1]) {
    out.push(makeCollider(
      g.x + fx * (g.width * 0.5) * sign,
      g.z + fz * (g.width * 0.5) * sign,
      g.depth * 0.5, t, g.heading, g.height, 'building'
    ));
  }

  return out;
}

// ── PIT BUILDING ────────────────────────────────────────────────────────────
// A continuous block behind the garages: team offices, timing tower, hospitality.

export interface PitBuilding {
  x: number; z: number; heading: number;
  length: number; depth: number; height: number;
}

const pitBuildingCentre = PIT_LANE.toWorld(PIT_STATIONS.garages, 22);
export const PIT_BUILDING: PitBuilding = {
  x: pitBuildingCentre.x, z: pitBuildingCentre.z, heading: pitBuildingCentre.heading,
  length: 92, depth: 9, height: 11.5,
};

// ── TYRE / SERVICE BAY ──────────────────────────────────────────────────────

export const TYRE_BAY = {
  blue: TYRE_BAY_SLOTS.blue,
  red: TYRE_BAY_SLOTS.red,
  /** Centre of the service apron, used to place racks, jacks and mechanics. */
  centre: PIT_LANE.toWorld(PIT_STATIONS.tyreBay, 8.5),
  heading: PIT_LANE.sampleAt(PIT_STATIONS.tyreBay).heading,
};

/** Radius around the tyre bay that counts as "arrived", for the one-shot event. */
export const TYRE_BAY_TRIGGER_RADIUS = 18;

// ── GRANDSTANDS ─────────────────────────────────────────────────────────────
// Placed by track distance and side, so they follow the circuit automatically.
// `faceHeading` points the seating (and every spectator) at the racing surface.

export interface GrandstandBlock {
  id: string;
  x: number; z: number;
  /** Heading along the track at this block. */
  heading: number;
  /** Direction the crowd looks — always toward the road. */
  faceHeading: number;
  side: 1 | -1;
  length: number;
  tiers: number;
  /** Accent colour, alternating team liveries. */
  accent: 'blue' | 'red' | 'neutral';
}

interface StandRange { from: number; to: number; side: 1 | -1; accent: GrandstandBlock['accent'] }

// The main straight's RIGHT side is occupied by the pit complex, so the big
// main grandstand goes on the left, opposite the pits — as at a real circuit.
const STAND_RANGES: StandRange[] = [
  { from: 40, to: 290, side: -1, accent: 'neutral' },   // main grandstand
  { from: 320, to: 395, side: -1, accent: 'blue' },     // T1 outside
  { from: 430, to: 520, side: -1, accent: 'red' },      // north link
  { from: 700, to: 790, side: -1, accent: 'blue' },     // back straight outside
  { from: 900, to: 980, side: -1, accent: 'red' },      // T3 outside
  { from: 1020, to: 1100, side: -1, accent: 'neutral' },// south link
];

const STAND_LENGTH = 42;

export const GRANDSTANDS: GrandstandBlock[] = (() => {
  const out: GrandstandBlock[] = [];
  for (const r of STAND_RANGES) {
    const span = r.to - r.from;
    const n = Math.max(1, Math.round(span / STAND_LENGTH));
    const step = span / n;
    for (let i = 0; i < n; i++) {
      const s = r.from + step * (i + 0.5);
      const f = CIRCUIT.sampleAt(s);
      const off = TRACK.grandstandOffset * r.side;
      out.push({
        id: `gs-${r.from}-${i}`,
        x: f.x + f.rx * off,
        z: f.z + f.rz * off,
        heading: f.heading,
        // Crowd looks back across the barrier toward the road.
        faceHeading: f.heading + r.side * (Math.PI / 2),
        side: r.side,
        length: step,
        tiers: 6,
        accent: r.accent,
      });
    }
  }
  return out;
})();

/**
 * A grandstand is solid from its front face backwards. One collider per block
 * is enough — the crowd never needs to be hit, only the structure.
 */
function grandstandCollider(g: GrandstandBlock): Collider {
  const depth = 14;
  // Shift the collider centre back so its FRONT face sits at the stand's front.
  const rx = Math.cos(g.heading), rz = -Math.sin(g.heading);
  const back = g.side * (depth * 0.5);
  return makeCollider(
    g.x + rx * back, g.z + rz * back,
    depth * 0.5, g.length * 0.5, g.heading, 12, 'grandstand'
  );
}

// ── TYRE STACKS ─────────────────────────────────────────────────────────────
// On the outside of the corners, just inside the barrier line, where a car
// running wide would actually reach them.

export interface TyreStack { x: number; z: number; heading: number }

const TYRE_STACK_SPOTS: { from: number; to: number; side: 1 | -1 }[] = [
  { from: 305, to: 400, side: -1 },   // T1 outside
  { from: 530, to: 620, side: -1 },   // T2 outside
  { from: 830, to: 920, side: -1 },   // T3 outside
  { from: 1110, to: 1200, side: -1 }, // T4 outside
];

export const TYRE_STACKS: TyreStack[] = (() => {
  const out: TyreStack[] = [];
  for (const r of TYRE_STACK_SPOTS) {
    for (let s = r.from; s <= r.to; s += 6) {
      const f = CIRCUIT.sampleAt(s);
      const off = (TRACK.wallOffset - 1.4) * r.side;
      out.push({ x: f.x + f.rx * off, z: f.z + f.rz * off, heading: f.heading });
    }
  }
  return out;
})();

// ── START GANTRY & FINISH LINE ──────────────────────────────────────────────

export const START_GANTRY = (() => {
  const f = CIRCUIT.sampleAt(START_FINISH_S);
  return {
    x: f.x, z: f.z, heading: f.heading,
    span: TRACK.halfWidth * 2 + 4,
    postOffset: TRACK.halfWidth + 1.6,
    height: 8.4,
  };
})();

function gantryColliders(): Collider[] {
  const g = START_GANTRY;
  const rx = Math.cos(g.heading), rz = -Math.sin(g.heading);
  return [1, -1].map((sign) =>
    makeCollider(
      g.x + rx * g.postOffset * sign,
      g.z + rz * g.postOffset * sign,
      0.5, 0.5, g.heading, g.height, 'gantryPost'
    )
  );
}

// ── ASSEMBLED COLLIDER WORLD ────────────────────────────────────────────────

export const WORLD_COLLIDERS: Collider[] = (() => {
  const out: Collider[] = [];

  out.push(...generateTrackBarriers());
  out.push(...generatePitBarriers());

  for (const g of GARAGES) out.push(...garageColliders(g));

  // Pit building block.
  out.push(makeCollider(
    PIT_BUILDING.x, PIT_BUILDING.z,
    PIT_BUILDING.depth * 0.5, PIT_BUILDING.length * 0.5,
    PIT_BUILDING.heading, PIT_BUILDING.height, 'building'
  ));

  for (const g of GRANDSTANDS) out.push(grandstandCollider(g));
  out.push(...gantryColliders());

  for (const t of TYRE_STACKS) {
    out.push(makeCollider(t.x, t.z, 1.0, 1.0, t.heading, 1.0, 'tyreStack'));
  }

  return out;
})();

/** Broadphase grid, built once. Bounds are padded inside ColliderGrid. */
export const COLLIDER_GRID = new ColliderGrid(WORLD_COLLIDERS, CIRCUIT.bounds);

/** Ground plane extent, sized to comfortably contain the venue. */
export const GROUND = (() => {
  const b = CIRCUIT.bounds;
  return {
    cx: (b.minX + b.maxX) / 2,
    cz: (b.minZ + b.maxZ) / 2,
    size: Math.max(b.maxX - b.minX, b.maxZ - b.minZ) + 900,
  };
})();

export { PIT, TRACK };
