// ============================================================
// THE DECIMAL DELIVERY NETWORK — SHARED MATERIALS & GEOMETRY
//
// One module-level set, shared by every component in the depot. Sharing
// materials and geometry is the single cheapest performance win available in
// a scene like this: it keeps the shader program count low and lets three.js
// batch far more aggressively.
//
// Art direction: bright, clean, modern industrial. Warm daylight on painted
// steel and concrete. Nothing dark, nothing neon, and nothing transparent
// standing in for something solid.
// ============================================================

import * as THREE from 'three';

const std = (
  color: string,
  roughness = 0.75,
  metalness = 0.05,
  extra: THREE.MeshStandardMaterialParameters = {}
) => new THREE.MeshStandardMaterial({ color, roughness, metalness, ...extra });

export const MAT = {
  // ── structure ──
  concrete: std('#c9ccd1', 0.92),
  concreteDark: std('#a8adb5', 0.94),
  asphalt: std('#6e737b', 0.95),
  lineWhite: std('#f4f6f8', 0.6),
  lineYellow: std('#f2c033', 0.6),
  grass: std('#7cb342', 0.96),

  // ── buildings ──
  wallBlue: std('#2f6fd0', 0.7),
  wallRed: std('#cf3b34', 0.7),
  wallNeutral: std('#e8ebef', 0.8),
  roof: std('#8d949e', 0.6, 0.35),
  trim: std('#39414d', 0.55, 0.3),
  // Opaque dark glazing — real windows, never alpha.
  glass: std('#2b4a63', 0.15, 0.7),

  // ── machinery ──
  steel: std('#aeb6c0', 0.35, 0.8),
  steelDark: std('#7b838f', 0.4, 0.75),
  beltRubber: std('#3a3f47', 0.9),
  roller: std('#c6cbd2', 0.3, 0.85),
  guardYellow: std('#f0b429', 0.55, 0.2),
  guardOrange: std('#e8792b', 0.6, 0.15),

  // ── parcels ──
  cardboard: std('#c89A63', 0.9),
  cardboardDark: std('#a87f4d', 0.9),
  tape: std('#e4d7bd', 0.8),
  labelWhite: std('#fbfcfd', 0.65),

  // ── vehicles ──
  truckBlue: std('#1e63c8', 0.45, 0.35),
  truckRed: std('#c62f28', 0.45, 0.35),
  truckBox: std('#f2f4f7', 0.6, 0.1),
  tyre: std('#25282d', 0.95),
  chrome: std('#d5dae1', 0.2, 0.9),
  glassLight: std('#fff6d8', 0.3, 0.1, { emissive: '#ffe9a8', emissiveIntensity: 0.6 }),

  // ── people ──
  vest: std('#f2a03d', 0.8),
  vestRed: std('#e0564c', 0.8),
  overall: std('#41628f', 0.85),
  skin: std('#d9a17c', 0.9),
  helmet: std('#f2d03d', 0.55, 0.1),
  boot: std('#3b3f46', 0.9),

  // ── indicators ──
  lampOff: std('#5c6470', 0.5),
  lampGreen: std('#3ddc84', 0.4, 0.1, { emissive: '#12a150', emissiveIntensity: 1.6 }),
  lampAmber: std('#ffc043', 0.4, 0.1, { emissive: '#d98200', emissiveIntensity: 1.5 }),
  lampRed: std('#ff6b5e', 0.4, 0.1, { emissive: '#c0342b', emissiveIntensity: 1.5 }),
  screen: std('#16324a', 0.25, 0.4, { emissive: '#0d2436', emissiveIntensity: 0.8 }),
} as const;

/** Destination tints for parcels, so lanes and labels read consistently. */
export const PARCEL_TINTS = [
  '#c89a63', '#b8764a', '#d2a978', '#a9834f', '#c9b089', '#bd8b58',
].map((c) => new THREE.Color(c));

// ── SHARED GEOMETRY ─────────────────────────────────────────────────────────
// Reused everywhere instead of allocating per component.

export const GEO = {
  unitBox: new THREE.BoxGeometry(1, 1, 1),
  unitCyl: new THREE.CylinderGeometry(0.5, 0.5, 1, 14),
  unitCylLow: new THREE.CylinderGeometry(0.5, 0.5, 1, 8),
  unitSphere: new THREE.SphereGeometry(0.5, 12, 10),
  unitCone: new THREE.ConeGeometry(0.5, 1, 10),
  plane: new THREE.PlaneGeometry(1, 1),
} as const;

/** Parcel silhouettes — deliberately not one cube for everything. */
export function parcelDimensions(shape: string): [number, number, number] {
  switch (shape) {
    case 'small_box': return [0.7, 0.6, 0.7];
    case 'large_box': return [1.25, 1.1, 1.15];
    case 'long_parcel': return [1.9, 0.5, 0.55];
    case 'flat_parcel': return [1.3, 0.22, 1.0];
    case 'tube': return [0.4, 0.4, 1.7];
    case 'crate': return [1.2, 0.95, 1.2];
    case 'envelope': return [0.95, 0.1, 0.7];
    case 'fragile': return [0.95, 0.9, 0.85];
    default: return [0.8, 0.7, 0.8];
  }
}
