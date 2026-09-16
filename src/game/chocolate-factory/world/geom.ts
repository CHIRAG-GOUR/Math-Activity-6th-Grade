// ============================================================
// THE CHOCOLATE FACTORY — GENERIC 3D / PATH GEOMETRY
//
// Pure math, no game state. Every carrier path, mirror and camera shot in
// this game is built from these few primitives, exactly like the equivalent
// module in the Decimal Delivery game — proven correct there, reused here.
// ============================================================

export interface Vec3 { x: number; y: number; z: number; }
export const v = (x: number, y: number, z: number): Vec3 => ({ x, y, z });

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

/** Frame-rate independent exponential approach for a whole point. */
export function easeToward(from: Vec3, to: Vec3, rate: number, dt: number): Vec3 {
  const k = 1 - Math.exp(-rate * dt);
  return { x: from.x + (to.x - from.x) * k, y: from.y + (to.y - from.y) * k, z: from.z + (to.z - from.z) * k };
}

export function smooth(t: number): number {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
}

const TWO_PI = Math.PI * 2;
export function angleDelta(from: number, to: number): number {
  let d = to - from;
  while (d > Math.PI) d -= TWO_PI;
  while (d < -Math.PI) d += TWO_PI;
  return d;
}

export function approach(from: Vec3, to: Vec3, maxStep: number): Vec3 {
  const dx = to.x - from.x;
  const dz = to.z - from.z;
  const d = Math.hypot(dx, dz);
  if (d <= maxStep || d < 1e-6) return { x: to.x, y: from.y, z: to.z };
  return { x: from.x + (dx / d) * maxStep, y: from.y, z: from.z + (dz / d) * maxStep };
}

/** Simple deterministic PRNG so question order can be reproduced from a seed. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
