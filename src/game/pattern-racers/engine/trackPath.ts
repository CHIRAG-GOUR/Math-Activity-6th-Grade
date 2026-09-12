// ============================================================
// PATTERN RACERS — 3D Grand Prix Track Path & Curvature Engine
// Continuous Parametric Hermite Spline for 820-Meter Grand Prix Racing Circuit:
// - Sector 1 (t: 0.00 -> 0.38): Main Stadium Straightaway (z: 16 -> -260, x: 0) — 100% Dead Straight!
// - Sector 2 (t: 0.38 -> 0.58): Turn 1 "Ascari" High-Speed Right Sweeper (z: -260 -> -440, x: 0 -> 24)
// - Sector 3 (t: 0.58 -> 0.76): Turn 2 "Senna" S-Chicane Transition (z: -440 -> -580, x: 24 -> -10)
// - Sector 4 (t: 0.76 -> 0.88): Turn 3 "Parabolica" Return Sweeper (z: -580 -> -680, x: -10 -> 0)
// - Sector 5 (t: 0.88 -> 1.00): Checkered Finish Line Stadium Straight (z: -680 -> -820, x: 0) — 100% Dead Straight!
// ============================================================

export interface TrackPoint {
  x: number;
  y: number;
  z: number;
  angle: number;       // Three.js Box / Barrier orientation angle in radians (atan2(Tx, Tz))
  carAngle: number;    // Vehicle forward heading angle in radians (atan2(-Tx, -Tz))
  normalX: number;     // Right-pointing unit normal vector X
  normalZ: number;     // Right-pointing unit normal vector Z
  tangentX: number;    // Forward unit tangent vector X
  tangentZ: number;    // Forward unit tangent vector Z
  bankAngle: number;   // Roll banking on high-speed turns
}

interface HermiteNode {
  t: number;
  x: number;
  y: number;
  z: number;
  tx: number; // Tangent dx/dt
  ty: number; // Tangent dy/dt
  tz: number; // Tangent dz/dt
  bank: number;
}

// 7 Smooth Precision Hermite Spline Nodes spanning 820 meters
const SPLINE_NODES: HermiteNode[] = [
  { t: 0.00, x: 0,   y: 0, z: 16,   tx: 0,   ty: 0, tz: -750, bank: 0 },
  { t: 0.38, x: 0,   y: 0, z: -260, tx: 0,   ty: 0, tz: -750, bank: 0 },
  { t: 0.58, x: 24,  y: 0, z: -440, tx: 70,  ty: 0, tz: -720, bank: 0.05 },
  { t: 0.76, x: -10, y: 0, z: -580, tx: -60, ty: 0, tz: -740, bank: -0.04 },
  { t: 0.88, x: 0,   y: 0, z: -680, tx: 0,   ty: 0, tz: -760, bank: 0 },
  { t: 1.00, x: 0,   y: 0, z: -820, tx: 0,   ty: 0, tz: -760, bank: 0 },
];

export function getTrackPointAt(progress: number): TrackPoint {
  const clampedT = Math.max(0, Math.min(1, progress));

  // Find the active segment
  let idx = 0;
  for (let i = 0; i < SPLINE_NODES.length - 1; i++) {
    if (clampedT >= SPLINE_NODES[i].t && clampedT <= SPLINE_NODES[i + 1].t) {
      idx = i;
      break;
    }
  }

  const n0 = SPLINE_NODES[idx];
  const n1 = SPLINE_NODES[idx + 1];

  const dt = n1.t - n0.t || 1;
  const u = Math.max(0, Math.min(1, (clampedT - n0.t) / dt));
  const u2 = u * u;
  const u3 = u2 * u;

  // Hermite basis functions
  const h0 = 2 * u3 - 3 * u2 + 1;
  const h1 = u3 - 2 * u2 + u;
  const h2 = -2 * u3 + 3 * u2;
  const h3 = u3 - u2;

  // Scaled tangents for local interval
  const m0x = n0.tx * dt;
  const m0y = n0.ty * dt;
  const m0z = n0.tz * dt;
  const m1x = n1.tx * dt;
  const m1y = n1.ty * dt;
  const m1z = n1.tz * dt;

  const x = h0 * n0.x + h1 * m0x + h2 * n1.x + h3 * m1x;
  const y = h0 * n0.y + h1 * m0y + h2 * n1.y + h3 * m1y;
  const z = h0 * n0.z + h1 * m0z + h2 * n1.z + h3 * m1z;

  // First derivative with respect to u
  const dh0 = 6 * u2 - 6 * u;
  const dh1 = 3 * u2 - 4 * u + 1;
  const dh2 = -6 * u2 + 6 * u;
  const dh3 = 3 * u2 - 2 * u;

  const dx = (dh0 * n0.x + dh1 * m0x + dh2 * n1.x + dh3 * m1x) / dt;
  const dz = (dh0 * n0.z + dh1 * m0z + dh2 * n1.z + dh3 * m1z) / dt;

  const len = Math.sqrt(dx * dx + dz * dz) || 1;
  const unitTx = dx / len;
  const unitTz = dz / len;

  // Box geometry alignment angle (along local Z)
  const angle = Math.atan2(unitTx, unitTz);

  // Vehicle forward heading angle in Three.js (mesh front points to -Z)
  const carAngle = Math.atan2(-unitTx, -unitTz);

  // Perpendicular unit normal pointing to the right of the track
  const normalX = -unitTz;
  const normalZ = unitTx;

  const bankAngle = n0.bank + (n1.bank - n0.bank) * u;

  return {
    x,
    y,
    z,
    angle,
    carAngle,
    normalX,
    normalZ,
    tangentX: unitTx,
    tangentZ: unitTz,
    bankAngle,
  };
}

// Total track length in meters
export const TRACK_TOTAL_LENGTH_METERS = 820;
export const TRACK_FINISH_PROGRESS = 0.94; // 94% is the checkered line at z ≈ -765

