// ============================================================
// PATTERN RACERS — CIRCUIT GEOMETRY: THE SINGLE SOURCE OF TRUTH
//
// Every physical thing in the world is derived from this module: the road
// mesh, the barrier colliders, curbs, grid boxes, checkpoints, camera rails
// and audience orientation. Nothing is hand-placed against the track, so
// nothing can drift out of sync with it.
//
// Construction: a circuit is a chain of straights and circular arcs. Each
// segment declares only its SHAPE; the builder walks the chain and integrates
// position + heading. Two properties fall out of this for free:
//   1. Exact arc-length parameterisation — `s` is in METRES, so constant
//      speed in m/s is constant progress. (The old Hermite spline used
//      spline-`t`, where a fixed dt covered different distances per segment.)
//   2. C1 continuity — every segment starts at the previous one's exit
//      position and heading by construction, so there are no kinks or gaps.
//
// Heading convention: `heading` IS Three.js `rotation.y` in radians, for a mesh
// whose nose points down its local -Z (which is how RaceVehicle3D is built).
//   heading 0     -> facing -Z
//   heading +PI/2 -> facing -X   (increasing heading turns LEFT)
//   forward = (-sin h, -cos h)
//   right   = ( cos h, -sin h)
// A RIGHT turn therefore DECREASES heading. Rotating a vector about +Y by t:
//   x' = x*cos t + z*sin t,  z' = -x*sin t + z*cos t
// ============================================================

export type SegmentSpec =
  | { kind: 'straight'; name: string; length: number }
  | { kind: 'arc'; name: string; radius: number; angleDeg: number; dir: 'left' | 'right' };

/** A resolved segment with its absolute entry state baked in. */
interface BuiltSegment {
  spec: SegmentSpec;
  name: string;
  /** Arc length distance along the circuit at which this segment starts. */
  sStart: number;
  length: number;
  /** Entry position + heading. */
  x: number;
  z: number;
  heading: number;
  /** Arc-only: centre of curvature. */
  cx: number;
  cz: number;
  /** +1 turning right, -1 turning left, 0 straight. */
  side: number;
  /** Signed curvature 1/r (positive = right), 0 for straights. */
  curvature: number;
}

/** A sampled frame on the centerline. */
export interface TrackFrame {
  x: number;
  z: number;
  /** Heading in radians (0 = -Z, clockwise positive). Use directly as rotation.y. */
  heading: number;
  /** Unit forward vector. */
  fx: number;
  fz: number;
  /** Unit right vector (points to the driver's right). */
  rx: number;
  rz: number;
  /** Signed curvature, 1/metres. Positive = turning right. */
  curvature: number;
  segmentName: string;
  /** Distance along the circuit, metres. */
  s: number;
}

export interface NearestResult {
  /** Distance along the centerline of the closest point, metres. */
  s: number;
  /** Signed lateral offset: positive = right of the centerline. */
  lateral: number;
  /** Absolute perpendicular distance to the centerline. */
  dist: number;
}

// ── FORWARD / RIGHT BASIS ───────────────────────────────────────────────────
// Kept as free functions so every consumer uses the same convention.

export function forwardX(heading: number): number { return -Math.sin(heading); }
export function forwardZ(heading: number): number { return -Math.cos(heading); }
export function rightX(heading: number): number { return Math.cos(heading); }
export function rightZ(heading: number): number { return -Math.sin(heading); }

/** Rotate an (x, z) vector about +Y by `t` radians. */
function rotXZ(x: number, z: number, t: number): { x: number; z: number } {
  const c = Math.cos(t);
  const s = Math.sin(t);
  return { x: x * c + z * s, z: -x * s + z * c };
}

/** Wrap an angle into (-PI, PI]. */
export function wrapAngle(a: number): number {
  let r = a;
  while (r > Math.PI) r -= Math.PI * 2;
  while (r <= -Math.PI) r += Math.PI * 2;
  return r;
}

export class Circuit {
  readonly segments: BuiltSegment[] = [];
  readonly length: number;
  readonly closed: boolean;
  /** Distance between the chain's end point and its start point. ~0 for a valid loop. */
  readonly closureError: number;
  /** Axis-aligned bounds of the centerline, useful for sizing the broadphase grid. */
  readonly bounds: { minX: number; maxX: number; minZ: number; maxZ: number };

  constructor(
    specs: SegmentSpec[],
    start: { x: number; z: number; heading: number },
    closed: boolean
  ) {
    this.closed = closed;

    let x = start.x;
    let z = start.z;
    let heading = start.heading;
    let s = 0;

    for (const spec of specs) {
      if (spec.kind === 'straight') {
        this.segments.push({
          spec, name: spec.name, sStart: s, length: spec.length,
          x, z, heading, cx: 0, cz: 0, side: 0, curvature: 0,
        });
        x += forwardX(heading) * spec.length;
        z += forwardZ(heading) * spec.length;
        s += spec.length;
      } else {
        const side = spec.dir === 'right' ? 1 : -1;
        // Centre of curvature is perpendicular to heading, on the turn side.
        const cx = x + rightX(heading) * spec.radius * side;
        const cz = z + rightZ(heading) * spec.radius * side;
        const arcAngle = (spec.angleDeg * Math.PI) / 180;
        const len = spec.radius * arcAngle;

        this.segments.push({
          spec, name: spec.name, sStart: s, length: len,
          x, z, heading, cx, cz, side,
          curvature: side / spec.radius,
        });

        // A right turn decreases heading; the entry point sweeps about the
        // centre by exactly the same signed angle.
        const dHeading = -arcAngle * side;
        const p = rotXZ(x - cx, z - cz, dHeading);
        x = cx + p.x;
        z = cz + p.z;
        heading += dHeading;
        s += len;
      }
    }

    this.length = s;

    const ex = x - start.x;
    const ez = z - start.z;
    this.closureError = closed ? Math.hypot(ex, ez) : 0;

    // Bounds from a dense sweep — segment endpoints alone miss arc extremes.
    let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
    for (let d = 0; d <= this.length; d += 4) {
      const f = this.sampleAt(d);
      if (f.x < minX) minX = f.x;
      if (f.x > maxX) maxX = f.x;
      if (f.z < minZ) minZ = f.z;
      if (f.z > maxZ) maxZ = f.z;
    }
    this.bounds = { minX, maxX, minZ, maxZ };
  }

  /** Normalise a distance into [0, length). Open paths clamp instead of wrapping. */
  normaliseS(s: number): number {
    if (!this.closed) return Math.max(0, Math.min(this.length, s));
    let r = s % this.length;
    if (r < 0) r += this.length;
    return r;
  }

  private segmentAt(s: number): BuiltSegment {
    // Linear scan: 13 segments, called a few times per frame. A binary search
    // would be measurably slower here due to branch overhead.
    const segs = this.segments;
    for (let i = segs.length - 1; i >= 0; i--) {
      if (s >= segs[i].sStart) return segs[i];
    }
    return segs[0];
  }

  /** Sample the centerline at distance `s` metres. */
  sampleAt(s: number): TrackFrame {
    const ns = this.normaliseS(s);
    const seg = this.segmentAt(ns);
    const local = ns - seg.sStart;

    let x: number, z: number, heading: number;

    if (seg.side === 0) {
      x = seg.x + forwardX(seg.heading) * local;
      z = seg.z + forwardZ(seg.heading) * local;
      heading = seg.heading;
    } else {
      const radius = (seg.spec as Extract<SegmentSpec, { kind: 'arc' }>).radius;
      const dHeading = -(local / radius) * seg.side;
      const p = rotXZ(seg.x - seg.cx, seg.z - seg.cz, dHeading);
      x = seg.cx + p.x;
      z = seg.cz + p.z;
      heading = seg.heading + dHeading;
    }

    return {
      x, z, heading,
      fx: forwardX(heading), fz: forwardZ(heading),
      rx: rightX(heading), rz: rightZ(heading),
      curvature: seg.curvature,
      segmentName: seg.name,
      s: ns,
    };
  }

  /**
   * Convert a track-space coordinate (distance along, lateral offset) into world
   * space. Positive `lateral` is to the driver's right.
   */
  toWorld(s: number, lateral: number): { x: number; z: number; heading: number } {
    const f = this.sampleAt(s);
    return {
      x: f.x + f.rx * lateral,
      z: f.z + f.rz * lateral,
      heading: f.heading,
    };
  }

  /**
   * Closest point on the centerline to a world position. Used for the wrong-way
   * check, the off-track test and respawn.
   *
   * Two-stage: a coarse sweep at `coarseStep` metres to find the best bracket,
   * then a few refinement passes. Exact enough for gameplay logic and far
   * cheaper than a per-segment analytic solve.
   */
  nearestS(x: number, z: number, coarseStep = 8): NearestResult {
    let bestS = 0;
    let bestD2 = Infinity;

    for (let s = 0; s < this.length; s += coarseStep) {
      const f = this.sampleAt(s);
      const dx = x - f.x;
      const dz = z - f.z;
      const d2 = dx * dx + dz * dz;
      if (d2 < bestD2) { bestD2 = d2; bestS = s; }
    }

    // Golden-section-ish refinement around the coarse winner.
    let window = coarseStep;
    for (let pass = 0; pass < 5; pass++) {
      window *= 0.5;
      for (const cand of [bestS - window, bestS + window]) {
        const f = this.sampleAt(cand);
        const dx = x - f.x;
        const dz = z - f.z;
        const d2 = dx * dx + dz * dz;
        if (d2 < bestD2) { bestD2 = d2; bestS = cand; }
      }
    }

    const f = this.sampleAt(bestS);
    // Signed lateral: project the offset vector onto the right vector.
    const lateral = (x - f.x) * f.rx + (z - f.z) * f.rz;

    return { s: this.normaliseS(bestS), lateral, dist: Math.sqrt(bestD2) };
  }

  /**
   * Nearest point search seeded with a hint — the value returned last frame.
   * A car moves at most ~1 m per frame, so searching a small window around the
   * previous result is both exact enough and far cheaper than sweeping the
   * whole circuit 60 times a second.
   *
   * Falls back to a full sweep when the hint turns out to be bad (for example
   * straight after a respawn or a teleport to the grid).
   */
  nearestSHinted(x: number, z: number, hintS: number, window = 45): NearestResult {
    let bestS = hintS;
    let bestD2 = Infinity;

    const step = 3;
    for (let d = -window; d <= window; d += step) {
      const cand = hintS + d;
      const f = this.sampleAt(cand);
      const dx = x - f.x;
      const dz = z - f.z;
      const d2 = dx * dx + dz * dz;
      if (d2 < bestD2) { bestD2 = d2; bestS = cand; }
    }

    // If the closest point sits on the window edge the hint was stale.
    if (Math.abs(bestS - hintS) >= window - step) {
      return this.nearestS(x, z);
    }

    let w = step;
    for (let pass = 0; pass < 5; pass++) {
      w *= 0.5;
      for (const cand of [bestS - w, bestS + w]) {
        const f = this.sampleAt(cand);
        const dx = x - f.x;
        const dz = z - f.z;
        const d2 = dx * dx + dz * dz;
        if (d2 < bestD2) { bestD2 = d2; bestS = cand; }
      }
    }

    const f = this.sampleAt(bestS);
    const lateral = (x - f.x) * f.rx + (z - f.z) * f.rz;
    return { s: this.normaliseS(bestS), lateral, dist: Math.sqrt(bestD2) };
  }

  /** Even samples along the whole circuit — used to generate road and walls. */
  sampleEvery(step: number): TrackFrame[] {
    const out: TrackFrame[] = [];
    const count = Math.ceil(this.length / step);
    const actual = this.length / count; // adjust so the last sample lands on the seam
    for (let i = 0; i < count; i++) out.push(this.sampleAt(i * actual));
    return out;
  }
}

// ── TRACK DIMENSIONS ────────────────────────────────────────────────────────
// One place. The road mesh, the curbs, the walls and the collider generator
// all read these, so the racing corridor can never disagree with its barriers.

export const TRACK = {
  /** Road is 14 m wide — two cars side by side with real racing room. */
  halfWidth: 7.0,
  curbWidth: 1.2,        // 7.0 -> 8.2
  runoffOuter: 16.0,     // 8.2 -> 16.0 grass/gravel runoff
  /** Barrier wall sits at the edge of the runoff, NOT beside the racing line. */
  wallOffset: 16.0,
  wallHeight: 1.15,
  wallThickness: 0.45,
  /** Grandstands start well back from the wall (spec: clear racing corridor). */
  grandstandOffset: 26.0,
  roadThickness: 0.28,
} as const;

// ── THE CIRCUIT ─────────────────────────────────────────────────────────────
//
//                 ┌──────── NORTH LINK 120 ────────┐
//            T2  /                                  \  T1
//               |                                    |
//        BACK STRAIGHT (A+chicane+B)          START/FINISH STRAIGHT 280
//               |                                    |
//            T3  \                                  /  T4
//                 └──────── SOUTH LINK 120 ────────┘
//
// Four 90-degree right arcs sum to 360 degrees, so heading closes exactly.
// The chicane is a symmetric out-and-back (left/right/right/left with equal
// radii and angles), which restores BOTH heading and lateral line — so it can
// be dropped into the back straight without breaking closure.

// Closure requires opposite straights to have equal FORWARD extent. The two
// links are both 96 m. The chicane contributes 80.0 m of forward extent, so
// the back straight's plain sections must sum to 300 - 80 = 220 m.
const CIRCUIT_SPEC: SegmentSpec[] = [
  { kind: 'straight', name: 'Main Straight', length: 300 },
  { kind: 'arc', name: 'T1 Numerator', radius: 65, angleDeg: 90, dir: 'right' },
  { kind: 'straight', name: 'North Link', length: 96 },
  { kind: 'arc', name: 'T2 Divisor', radius: 65, angleDeg: 90, dir: 'right' },
  { kind: 'straight', name: 'Back Straight A', length: 110 },
  // "Sequence" chicane — out and back, net zero heading and net zero offset.
  { kind: 'arc', name: 'Chicane Entry', radius: 40, angleDeg: 30, dir: 'left' },
  { kind: 'arc', name: 'Chicane Apex 1', radius: 40, angleDeg: 30, dir: 'right' },
  { kind: 'arc', name: 'Chicane Apex 2', radius: 40, angleDeg: 30, dir: 'right' },
  { kind: 'arc', name: 'Chicane Exit', radius: 40, angleDeg: 30, dir: 'left' },
  { kind: 'straight', name: 'Back Straight B', length: 110 },
  { kind: 'arc', name: 'T3 Parabolica', radius: 65, angleDeg: 90, dir: 'right' },
  { kind: 'straight', name: 'South Link', length: 96 },
  { kind: 'arc', name: 'T4 Remainder', radius: 65, angleDeg: 90, dir: 'right' },
];

/**
 * Builder origin (0, 0) heading 0 is the start of the MAIN STRAIGHT, which runs
 * down -Z. All four corners turn right, so the enclosed infield is on +X.
 *
 * The start/finish line is NOT the builder origin — it sits further down the
 * straight at START_FINISH_S, just after the grid, which in turn sits just
 * after the pit exit merge. That ordering is what makes the Round 2 -> 3
 * transition (tyre bay -> pit exit -> grid) a short continuous drive instead
 * of a full lap.
 */
export const CIRCUIT = new Circuit(CIRCUIT_SPEC, { x: 0, z: 0, heading: 0 }, true);

// ── PIT LANE ────────────────────────────────────────────────────────────────
//
// A separate open path, not part of the racing loop. Standard F1 topology:
// it leaves the circuit before the start/finish line, runs parallel to the
// main straight on the infield side, passes the garages and the tyre/service
// bay, and merges back onto the main straight further down.
//
// Because all four circuit corners turn RIGHT, the enclosed infield is on the
// +X side of the main straight. The pit lane lives there.

export const PIT = {
  /** Lateral offset of the working pit lane from the main straight centerline. */
  laneOffset: 26,
  laneHalfWidth: 6.0,
  /** Garage frontage sits a further 13 m infield, doors facing the lane. */
  garageOffset: 39,
  speedLimitKmh: 80,
  /** Where the entry slip road leaves the main straight. */
  entryS: 8,
} as const;

// The slip roads are a pair of equal, opposite arcs. To shift laterally by D
// using radius R, each arc must sweep `acos(1 - D / (2R))`; the pair then
// advances `2R*sin(theta)` along the original direction.
const SLIP_RADIUS = 55;
const SLIP_SHIFT = PIT.laneOffset - TRACK.halfWidth; // 26 - 7 = 19 m
const SLIP_ANGLE_DEG =
  (Math.acos(1 - SLIP_SHIFT / (2 * SLIP_RADIUS)) * 180) / Math.PI;

const PIT_SPEC: SegmentSpec[] = [
  // Entry slip: peel off the racing surface and swing into the infield (+X is
  // to the driver's right on the main straight, so that's a right then left).
  { kind: 'arc', name: 'Pit Entry Curve', radius: SLIP_RADIUS, angleDeg: SLIP_ANGLE_DEG, dir: 'right' },
  { kind: 'arc', name: 'Pit Entry Straighten', radius: SLIP_RADIUS, angleDeg: SLIP_ANGLE_DEG, dir: 'left' },
  // The working pit lane: garages, then the tyre/service bay.
  { kind: 'straight', name: 'Pit Lane', length: 110 },
  // Exit slip: swing back out toward the track and straighten onto it.
  { kind: 'arc', name: 'Pit Exit Curve', radius: SLIP_RADIUS, angleDeg: SLIP_ANGLE_DEG, dir: 'left' },
  { kind: 'arc', name: 'Pit Exit Straighten', radius: SLIP_RADIUS, angleDeg: SLIP_ANGLE_DEG, dir: 'right' },
];

/**
 * The pit lane branches off the MAIN STRAIGHT at its right-hand edge, so the
 * two road surfaces physically meet rather than the lane floating beside them.
 */
const pitEntryFrame = CIRCUIT.sampleAt(PIT.entryS);

export const PIT_LANE = new Circuit(
  PIT_SPEC,
  {
    x: pitEntryFrame.x + pitEntryFrame.rx * TRACK.halfWidth,
    z: pitEntryFrame.z + pitEntryFrame.rz * TRACK.halfWidth,
    heading: pitEntryFrame.heading,
  },
  false
);

/** Distance along the MAIN STRAIGHT at which the pit exit rejoins the circuit. */
export const PIT_MERGE_S =
  PIT.entryS + 2 * (2 * SLIP_RADIUS * Math.sin((SLIP_ANGLE_DEG * Math.PI) / 180)) + 110;

// ── NAMED WORLD LOCATIONS ───────────────────────────────────────────────────
// Every gameplay waypoint is expressed in PIT-LANE or CIRCUIT track space and
// converted to world coordinates here, so moving the circuit moves everything.

export interface Slot { x: number; z: number; heading: number }

/** Distances along the PIT LANE at which each feature sits. */
const PIT_WORK_START = 2 * SLIP_RADIUS * ((SLIP_ANGLE_DEG * Math.PI) / 180); // end of entry slip
export const PIT_STATIONS = {
  garages: PIT_WORK_START + 32,
  tyreBay: PIT_WORK_START + 86,
} as const;

function pitSlot(s: number, lateral: number): Slot {
  const w = PIT_LANE.toWorld(s, lateral);
  return { x: w.x, z: w.z, heading: w.heading };
}
function trackSlot(s: number, lateral: number): Slot {
  const w = CIRCUIT.toWorld(s, lateral);
  return { x: w.x, z: w.z, heading: w.heading };
}

/**
 * Garage bays, set back from the lane so the cars genuinely start INSIDE the
 * garage with their noses pointing at the opening.
 *
 * Blue takes the bay further down the lane. The garage camera looks across the
 * lane toward the doors (i.e. roughly along +X), and with the main straight
 * running down -Z that puts the further-down-lane bay on screen-left — which
 * is where the spec wants blue. Worth a visual confirmation once it renders.
 */
export const GARAGE_SLOTS: Record<'blue' | 'red', Slot> = {
  blue: pitSlot(PIT_STATIONS.garages + 9, 11.0),
  red: pitSlot(PIT_STATIONS.garages - 9, 11.0),
};

/** Where the cars park for the tyre/service inspection in Round 2. */
export const TYRE_BAY_SLOTS: Record<'blue' | 'red', Slot> = {
  blue: pitSlot(PIT_STATIONS.tyreBay + 8, 3.4),
  red: pitSlot(PIT_STATIONS.tyreBay - 8, 3.4),
};

/**
 * Starting grid — just past the pit exit merge, staggered like a real grid.
 * Cars roll out of the pit lane and onto their boxes in one short drive.
 */
export const GRID_S = PIT_MERGE_S + 12;
export const GRID_SLOTS: Record<'blue' | 'red', Slot> = {
  blue: trackSlot(GRID_S, -3.0),
  red: trackSlot(GRID_S - 8, 3.0),
};

/**
 * Start/finish line, 25 m ahead of the grid and ~50 m before T1 — enough of a
 * launch run that the first corner arrives at roughly the grip limit.
 */
export const START_FINISH_S = GRID_S + 25;
export const RACE_LAP_DISTANCE = CIRCUIT.length;

/** Respawn checkpoints roughly every 100 m, used by the stuck/off-track recovery. */
export const CHECKPOINT_SPACING = 100;
export const CHECKPOINT_COUNT = Math.max(1, Math.round(CIRCUIT.length / CHECKPOINT_SPACING));

export function checkpointS(index: number): number {
  return CIRCUIT.normaliseS(index * (CIRCUIT.length / CHECKPOINT_COUNT));
}

/**
 * Spans of the main straight's RIGHT-hand barrier that must be left open for
 * the pit entry and pit exit — otherwise the generated wall would run straight
 * across both slip roads. A pit wall is placed alongside the lane instead.
 */
export const WALL_GAPS: { from: number; to: number; side: 1 | -1 }[] = [
  { from: PIT.entryS - 6, to: PIT.entryS + 62, side: 1 },
  { from: PIT_MERGE_S - 62, to: PIT_MERGE_S + 6, side: 1 },
];

// ── DEV ASSERTION ───────────────────────────────────────────────────────────
// A circuit that does not close produces a visible seam in the road and a gap
// in the barrier wall. Fail loudly in development rather than shipping it.
if (process.env.NODE_ENV !== 'production') {
  if (CIRCUIT.closureError > 0.01) {
    // eslint-disable-next-line no-console
    console.error(
      `[circuit] Loop does not close: error ${CIRCUIT.closureError.toFixed(3)} m. ` +
      `Adjust straight lengths or arc radii in CIRCUIT_SPEC.`
    );
  }
}
