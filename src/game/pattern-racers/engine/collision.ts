// ============================================================
// PATTERN RACERS — STATIC COLLISION
//
// Design constraints that shaped this:
//   - Two dynamic bodies (the hero cars) against a world of ~1000 static
//     boxes. Anything resembling a general rigid-body solver is wasted work.
//   - Collision must NEVER be resolved by making geometry transparent or by
//     teleporting the car. Walls depenetrate and the car slides along them.
//   - Fully deterministic: no randomness, no iteration-order dependence on
//     floating point noise.
//
// Representation: every static obstacle is an oriented box (OBB) in the XZ
// plane with a height for rendering/debug only — the solve is 2D, because the
// track is flat and cars never leave the ground.
//
// The car is approximated by three circles along its spine (rear axle, centre,
// nose). Circle-vs-OBB is a closed-form clamp, far cheaper than OBB-vs-OBB
// separating-axis work, and three circles track the car's rotation closely
// enough that you cannot notice the difference at gameplay speeds.
// ============================================================

import { CIRCUIT, PIT_LANE, TRACK, PIT, WALL_GAPS, forwardX, forwardZ, rightX, rightZ } from './circuit';

export type ColliderKind =
  | 'trackWall'
  | 'pitWall'
  | 'building'
  | 'tyreStack'
  | 'gantryPost'
  | 'grandstand';

export interface Collider {
  /** Centre in world XZ. */
  cx: number;
  cz: number;
  /** Half-extents along the box's own local X (lateral) and Z (longitudinal). */
  halfX: number;
  halfZ: number;
  /** Rotation about +Y, radians. */
  rotY: number;
  /** Visual height — used by the debug view and for camera occlusion only. */
  height: number;
  kind: ColliderKind;
  /** Cached basis so the hot loop never calls sin/cos. */
  _cos: number;
  _sin: number;
  /** Visit stamp, used to dedupe a box that straddles several grid cells. */
  _stamp: number;
}

export function makeCollider(
  cx: number, cz: number, halfX: number, halfZ: number,
  rotY: number, height: number, kind: ColliderKind
): Collider {
  return {
    cx, cz, halfX, halfZ, rotY, height, kind,
    _cos: Math.cos(rotY), _sin: Math.sin(rotY),
    _stamp: 0,
  };
}

// ── BROADPHASE ──────────────────────────────────────────────────────────────
// Uniform grid. The circuit footprint is roughly 260 x 400 m; at 40 m cells
// that is a ~7 x 11 grid, and each car tests only the 3x3 neighbourhood.

const CELL = 40;

export class ColliderGrid {
  private cells = new Map<number, Collider[]>();
  private minX = 0;
  private minZ = 0;
  readonly all: Collider[] = [];

  constructor(colliders: Collider[], bounds: { minX: number; maxX: number; minZ: number; maxZ: number }) {
    this.minX = bounds.minX - 120;
    this.minZ = bounds.minZ - 120;
    for (const c of colliders) this.insert(c);
  }

  private key(ix: number, iz: number): number {
    // Pack two 16-bit cell indices. Ample for any circuit we will build.
    return ((ix & 0xffff) << 16) | (iz & 0xffff);
  }

  private insert(c: Collider) {
    this.all.push(c);
    // Conservative AABB of the rotated box.
    const ex = Math.abs(c._cos) * c.halfX + Math.abs(c._sin) * c.halfZ;
    const ez = Math.abs(c._sin) * c.halfX + Math.abs(c._cos) * c.halfZ;

    const ix0 = Math.floor((c.cx - ex - this.minX) / CELL);
    const ix1 = Math.floor((c.cx + ex - this.minX) / CELL);
    const iz0 = Math.floor((c.cz - ez - this.minZ) / CELL);
    const iz1 = Math.floor((c.cz + ez - this.minZ) / CELL);

    for (let ix = ix0; ix <= ix1; ix++) {
      for (let iz = iz0; iz <= iz1; iz++) {
        const k = this.key(ix, iz);
        let bucket = this.cells.get(k);
        if (!bucket) { bucket = []; this.cells.set(k, bucket); }
        bucket.push(c);
      }
    }
  }

  /**
   * Gather colliders near a world point into `out`. Reuses `out` to avoid
   * garbage, and dedupes via a monotonically increasing visit stamp rather
   * than an `includes` scan — this runs three times per car per substep.
   */
  query(x: number, z: number, out: Collider[]): Collider[] {
    out.length = 0;
    const stamp = ++ColliderGrid.visitStamp;
    const ix = Math.floor((x - this.minX) / CELL);
    const iz = Math.floor((z - this.minZ) / CELL);
    for (let dx = -1; dx <= 1; dx++) {
      for (let dz = -1; dz <= 1; dz++) {
        const bucket = this.cells.get(this.key(ix + dx, iz + dz));
        if (!bucket) continue;
        for (let i = 0; i < bucket.length; i++) {
          const c = bucket[i];
          if (c._stamp === stamp) continue;
          c._stamp = stamp;
          out.push(c);
        }
      }
    }
    return out;
  }

  private static visitStamp = 0;
}

// ── NARROWPHASE ─────────────────────────────────────────────────────────────

export interface Contact {
  /** Outward unit normal, pointing from the box toward the circle. */
  nx: number;
  nz: number;
  /** Penetration depth along the normal. */
  depth: number;
  collider: Collider;
}

/**
 * Circle vs oriented box. Returns null when separated.
 *
 * The circle centre is transformed into the box's local frame, clamped to the
 * box to find the closest point, and the separation measured there. The
 * degenerate case (centre strictly inside the box) is handled by pushing out
 * through the nearest face, which keeps a car that somehow ends up inside a
 * wall from being trapped.
 */
export function circleVsBox(
  px: number, pz: number, radius: number, b: Collider
): Contact | null {
  // World -> box local (inverse rotation).
  const dx = px - b.cx;
  const dz = pz - b.cz;
  const lx = dx * b._cos - dz * b._sin;
  const lz = dx * b._sin + dz * b._cos;

  const clampedX = lx < -b.halfX ? -b.halfX : lx > b.halfX ? b.halfX : lx;
  const clampedZ = lz < -b.halfZ ? -b.halfZ : lz > b.halfZ ? b.halfZ : lz;

  let localNx: number, localNz: number, depth: number;

  const inside = clampedX === lx && clampedZ === lz;
  if (inside) {
    // Push out through whichever face is nearest.
    const distX = b.halfX - Math.abs(lx);
    const distZ = b.halfZ - Math.abs(lz);
    if (distX < distZ) {
      localNx = lx >= 0 ? 1 : -1; localNz = 0; depth = distX + radius;
    } else {
      localNx = 0; localNz = lz >= 0 ? 1 : -1; depth = distZ + radius;
    }
  } else {
    const ox = lx - clampedX;
    const oz = lz - clampedZ;
    const d = Math.hypot(ox, oz);
    if (d >= radius) return null;
    if (d < 1e-9) { localNx = 1; localNz = 0; depth = radius; }
    else { localNx = ox / d; localNz = oz / d; depth = radius - d; }
  }

  // Box local -> world (forward rotation).
  return {
    nx: localNx * b._cos + localNz * b._sin,
    nz: -localNx * b._sin + localNz * b._cos,
    depth,
    collider: b,
  };
}

/**
 * A short segment cast used by the camera to avoid clipping into buildings.
 * Returns the fraction (0..1) along the segment at which it is first blocked,
 * or 1 when the whole segment is clear. Coarse by design — it walks the
 * segment rather than solving analytically, which is plenty for a camera.
 */
export function segmentClearFraction(
  x0: number, z0: number, x1: number, z1: number,
  grid: ColliderGrid, radius: number, scratch: Collider[]
): number {
  const dx = x1 - x0;
  const dz = z1 - z0;
  const len = Math.hypot(dx, dz);
  if (len < 1e-4) return 1;

  const steps = Math.max(3, Math.min(12, Math.ceil(len / 2)));
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const px = x0 + dx * t;
    const pz = z0 + dz * t;
    grid.query(px, pz, scratch);
    for (const c of scratch) {
      if (circleVsBox(px, pz, radius, c)) {
        // Back off to the previous clear sample.
        return Math.max(0, (i - 1) / steps);
      }
    }
  }
  return 1;
}

// ── WORLD COLLIDER GENERATION ───────────────────────────────────────────────
// Barriers are generated FROM the circuit, so the racing corridor and its walls
// can never disagree. Everything else is hand-authored in worldLayout.ts.

/** Is this point on the circuit inside a deliberate gap (pit entry / exit)? */
function inWallGap(s: number, side: 1 | -1): boolean {
  for (const g of WALL_GAPS) {
    if (g.side !== side) continue;
    if (s >= g.from && s <= g.to) return true;
  }
  return false;
}

const WALL_STEP = 4.0;
/** Slight overlap so curved runs have no gaps between consecutive boxes. */
const WALL_HALF_Z = WALL_STEP * 0.55;

export function generateTrackBarriers(): Collider[] {
  const out: Collider[] = [];
  const count = Math.round(CIRCUIT.length / WALL_STEP);
  const step = CIRCUIT.length / count;

  for (let i = 0; i < count; i++) {
    const s = i * step;
    const f = CIRCUIT.sampleAt(s);
    for (const side of [1, -1] as const) {
      if (inWallGap(s, side)) continue;
      const off = TRACK.wallOffset * side;
      out.push(makeCollider(
        f.x + f.rx * off,
        f.z + f.rz * off,
        TRACK.wallThickness * 0.5,
        WALL_HALF_Z,
        f.heading,
        TRACK.wallHeight,
        'trackWall'
      ));
    }
  }
  return out;
}

export function generatePitBarriers(): Collider[] {
  const out: Collider[] = [];
  const count = Math.round(PIT_LANE.length / WALL_STEP);
  const step = PIT_LANE.length / count;

  for (let i = 0; i < count; i++) {
    const s = i * step;
    const f = PIT_LANE.sampleAt(s);
    // Only wall the working section — the slip roads must stay open at both
    // ends or the cars could not get in or out.
    const inWorkingSection = s > 60 && s < PIT_LANE.length - 60;
    if (!inWorkingSection) continue;

    // Inner side (toward the racing surface): the classic pit wall.
    out.push(makeCollider(
      f.x - f.rx * PIT.laneHalfWidth,
      f.z - f.rz * PIT.laneHalfWidth,
      0.25, WALL_HALF_Z, f.heading, 1.05, 'pitWall'
    ));

    // Outer side, set back beyond the garage apron so a car cannot drive off
    // into the open infield between the garage buildings.
    out.push(makeCollider(
      f.x + f.rx * 18,
      f.z + f.rz * 18,
      0.3, WALL_HALF_Z, f.heading, 2.4, 'pitWall'
    ));
  }
  return out;
}

// Re-exported so worldLayout can build on the same primitives.
export { forwardX, forwardZ, rightX, rightZ };
