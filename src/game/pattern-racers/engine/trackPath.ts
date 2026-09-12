// ============================================================
// PATTERN RACERS — 3D Grand Prix Track Path & Curvature Engine
// Continuous Parametric Spline for NFS-Style Racing Circuit:
// - Sector 1: Starting Grid Straight (z: 4 -> -20, x: 0)
// - Sector 2: Sweeping High-Speed Right Banked Sweeper (z: -20 -> -65, x: 0 -> 18)
// - Sector 3: Mountain Cutting S-Chicane (z: -65 -> -125, x: 18 -> -14)
// - Sector 4: Sweeping Left Return Bank (z: -125 -> -160, x: -14 -> 0)
// - Sector 5: Stadium Final Straight towards Checkered Finish Arch (z: -160 -> -200, x: 0)
// ============================================================

export interface TrackPoint {
  x: number;
  y: number;
  z: number;
  angle: number;       // Road heading angle in radians (Y-rotation)
  normalX: number;     // Left/Right perpendicular vector
  normalZ: number;
  bankAngle: number;   // Roll banking on high-speed turns
}

// 6 Key Track Spline Control Nodes
const TRACK_NODES = [
  { t: 0.0,  x: 0,   y: 0, z: 4,    bank: 0 },
  { t: 0.12, x: 0,   y: 0, z: -20,  bank: 0 },
  { t: 0.25, x: 10,  y: 0, z: -42,  bank: 0.08 },
  { t: 0.38, x: 18,  y: 0, z: -68,  bank: 0.12 },
  { t: 0.52, x: 6,   y: 0, z: -98,  bank: -0.06 },
  { t: 0.65, x: -14, y: 0, z: -128, bank: -0.12 },
  { t: 0.78, x: -8,  y: 0, z: -152, bank: -0.06 },
  { t: 0.88, x: 0,   y: 0, z: -172, bank: 0 },
  { t: 1.0,  x: 0,   y: 0, z: -205, bank: 0 },
];

// Smooth Catmull-Rom / Hermite spline interpolation
function interpolateSpline(p0: number, p1: number, p2: number, p3: number, u: number): number {
  const u2 = u * u;
  const u3 = u2 * u;
  return (
    0.5 *
    (2 * p1 +
      (-p0 + p2) * u +
      (2 * p0 - 5 * p1 + 4 * p2 - p3) * u2 +
      (-p0 + 3 * p1 - 3 * p2 + p3) * u3)
  );
}

export function getTrackPointAt(progress: number): TrackPoint {
  const clampedT = Math.max(0, Math.min(1, progress));
  const numSegments = TRACK_NODES.length - 1;
  const scaledT = clampedT * numSegments;
  const idx = Math.min(Math.floor(scaledT), numSegments - 1);
  const u = scaledT - idx;

  const n0 = TRACK_NODES[Math.max(0, idx - 1)];
  const n1 = TRACK_NODES[idx];
  const n2 = TRACK_NODES[Math.min(numSegments, idx + 1)];
  const n3 = TRACK_NODES[Math.min(numSegments, idx + 2)];

  const x = interpolateSpline(n0.x, n1.x, n2.x, n3.x, u);
  const y = interpolateSpline(n0.y, n1.y, n2.y, n3.y, u);
  const z = interpolateSpline(n0.z, n1.z, n2.z, n3.z, u);
  const bankAngle = n1.bank + (n2.bank - n1.bank) * u;

  // Tangent gradient for forward direction
  const deltaU = 0.005;
  const nextX = interpolateSpline(n0.x, n1.x, n2.x, n3.x, Math.min(1, u + deltaU));
  const nextZ = interpolateSpline(n0.z, n1.z, n2.z, n3.z, Math.min(1, u + deltaU));

  const dirX = nextX - x;
  const dirZ = nextZ - z;
  const len = Math.sqrt(dirX * dirX + dirZ * dirZ) || 1;
  const unitDirX = dirX / len;
  const unitDirZ = dirZ / len;

  // Heading angle
  const angle = Math.atan2(unitDirX, unitDirZ);

  // Perpendicular normal (pointing right of track)
  const normalX = -unitDirZ;
  const normalZ = unitDirX;

  return {
    x,
    y,
    z,
    angle,
    normalX,
    normalZ,
    bankAngle,
  };
}

// Total track length in meters
export const TRACK_TOTAL_LENGTH_METERS = 750;
export const TRACK_FINISH_PROGRESS = 0.95; // 95% is the checkered line at z = -195
