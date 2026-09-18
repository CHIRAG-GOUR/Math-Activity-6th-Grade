// ============================================================
// PARK PLANNER — Shared Three.js Materials & Palettes
// Curated, harmonious visual palette for high aesthetic standards
// ALL materials are singletons — never recreate per-render-cycle
// ============================================================

import * as THREE from 'three';

export const PARK_COLORS = {
  grass: '#5da444',
  grassAccent: '#4e8c39',
  pathStone: '#e2dcc8',
  pathBorder: '#c4bc9f',
  plazaStone: '#f0ece1',
  axisPromenade: '#dfd7c2',
  axisMarker: '#334155',
  axisHighlightX: '#3b82f6',
  axisHighlightY: '#ef4444',
  woodDark: '#8B5A2B',
  woodLight: '#c19a6b',
  steelCyan: '#06b6d4',
  steelYellow: '#f59e0b',
  steelRed: '#f43f5e',
  courtAcrylic: '#2563eb',
  courtGreen: '#059669',
  waterBlue: '#38bdf8',
  waterDeep: '#0284c7',
  fountainMarble: '#f8fafc',
  flowerRed: '#ef4444',
  flowerYellow: '#eab308',
  flowerPurple: '#a855f7',
  foliageDark: '#2d6a4f',
  foliageLight: '#52b788',
  vestOrange: '#fb923c',
  hardHatYellow: '#facc15',
  skinTone: '#fcd34d',
};

// Create optimized, reusable Three.js materials
export const Materials = {
  grass: new THREE.MeshStandardMaterial({
    color: PARK_COLORS.grass,
    roughness: 0.85,
    metalness: 0.05,
  }),
  grassAccent: new THREE.MeshStandardMaterial({
    color: PARK_COLORS.grassAccent,
    roughness: 0.9,
  }),
  pathStone: new THREE.MeshStandardMaterial({
    color: PARK_COLORS.pathStone,
    roughness: 0.6,
    metalness: 0.1,
  }),
  pathBorder: new THREE.MeshStandardMaterial({
    color: PARK_COLORS.pathBorder,
    roughness: 0.7,
  }),
  plazaStone: new THREE.MeshStandardMaterial({
    color: PARK_COLORS.plazaStone,
    roughness: 0.5,
  }),
  axisMarker: new THREE.MeshStandardMaterial({
    color: PARK_COLORS.axisMarker,
    roughness: 0.4,
  }),
  woodTimber: new THREE.MeshStandardMaterial({
    color: PARK_COLORS.woodDark,
    roughness: 0.75,
  }),
  woodPlanks: new THREE.MeshStandardMaterial({
    color: PARK_COLORS.woodLight,
    roughness: 0.7,
  }),
  metalCyan: new THREE.MeshStandardMaterial({
    color: PARK_COLORS.steelCyan,
    roughness: 0.3,
    metalness: 0.6,
  }),
  metalYellow: new THREE.MeshStandardMaterial({
    color: PARK_COLORS.steelYellow,
    roughness: 0.3,
    metalness: 0.5,
  }),
  metalRed: new THREE.MeshStandardMaterial({
    color: PARK_COLORS.steelRed,
    roughness: 0.3,
    metalness: 0.5,
  }),
  courtTartan: new THREE.MeshStandardMaterial({
    color: PARK_COLORS.courtAcrylic,
    roughness: 0.65,
  }),
  courtSoccer: new THREE.MeshStandardMaterial({
    color: PARK_COLORS.courtGreen,
    roughness: 0.75,
  }),
  waterSurface: new THREE.MeshStandardMaterial({
    color: PARK_COLORS.waterBlue,
    roughness: 0.1,
    metalness: 0.2,
    transparent: true,
    opacity: 0.85,
  }),
  fountainMarble: new THREE.MeshStandardMaterial({
    color: PARK_COLORS.fountainMarble,
    roughness: 0.2,
    metalness: 0.1,
  }),
  flowerRed: new THREE.MeshStandardMaterial({
    color: PARK_COLORS.flowerRed,
    roughness: 0.6,
  }),
  flowerYellow: new THREE.MeshStandardMaterial({
    color: PARK_COLORS.flowerYellow,
    roughness: 0.6,
  }),
  flowerPurple: new THREE.MeshStandardMaterial({
    color: PARK_COLORS.flowerPurple,
    roughness: 0.6,
  }),
  leavesDark: new THREE.MeshStandardMaterial({
    color: PARK_COLORS.foliageDark,
    roughness: 0.8,
  }),
  leavesLight: new THREE.MeshStandardMaterial({
    color: PARK_COLORS.foliageLight,
    roughness: 0.8,
  }),
  workerVest: new THREE.MeshStandardMaterial({
    color: PARK_COLORS.vestOrange,
    roughness: 0.5,
  }),
  workerHelmet: new THREE.MeshStandardMaterial({
    color: PARK_COLORS.hardHatYellow,
    roughness: 0.3,
    metalness: 0.2,
  }),
  workerSkin: new THREE.MeshStandardMaterial({
    color: PARK_COLORS.skinTone,
    roughness: 0.6,
  }),
  workerJeans: new THREE.MeshStandardMaterial({
    color: '#1e3a8a',
    roughness: 0.8,
  }),
};

// ============================================================
// SHARED MATERIAL CACHE — Used by Characters, Vehicles, City, etc.
// Eliminates per-frame material re-creation that kills FPS.
// ============================================================
const _matCache = new Map<string, THREE.MeshStandardMaterial>();
const _basicMatCache = new Map<string, THREE.MeshBasicMaterial>();

/**
 * Returns a cached MeshStandardMaterial for the given color + roughness + metalness.
 * Same parameters always return the exact same object instance.
 */
export function getCachedMaterial(
  color: string,
  roughness = 0.7,
  metalness = 0,
  opts?: { transparent?: boolean; opacity?: number; emissive?: string; emissiveIntensity?: number; wireframe?: boolean; side?: THREE.Side }
): THREE.MeshStandardMaterial {
  const key = `${color}_${roughness}_${metalness}_${opts?.transparent || false}_${opts?.opacity ?? 1}_${opts?.emissive || ''}_${opts?.emissiveIntensity ?? 0}_${opts?.wireframe || false}_${opts?.side ?? ''}`;
  let mat = _matCache.get(key);
  if (!mat) {
    mat = new THREE.MeshStandardMaterial({
      color,
      roughness,
      metalness,
      transparent: opts?.transparent,
      opacity: opts?.opacity,
      emissive: opts?.emissive ? new THREE.Color(opts.emissive) : undefined,
      emissiveIntensity: opts?.emissiveIntensity,
      wireframe: opts?.wireframe,
      side: opts?.side,
    });
    _matCache.set(key, mat);
  }
  return mat;
}

/**
 * Returns a cached MeshBasicMaterial for the given color.
 */
export function getCachedBasicMaterial(
  color: string,
  opts?: { transparent?: boolean; opacity?: number; side?: THREE.Side }
): THREE.MeshBasicMaterial {
  const key = `${color}_${opts?.transparent || false}_${opts?.opacity ?? 1}_${opts?.side ?? ''}`;
  let mat = _basicMatCache.get(key);
  if (!mat) {
    mat = new THREE.MeshBasicMaterial({
      color,
      transparent: opts?.transparent,
      opacity: opts?.opacity,
      side: opts?.side,
    });
    _basicMatCache.set(key, mat);
  }
  return mat;
}

// ============================================================
// SHARED GEOMETRY CACHE — Prevents re-creating identical geometries
// ============================================================
const _geoCache = new Map<string, THREE.BufferGeometry>();

export function getCachedBoxGeo(w: number, h: number, d: number): THREE.BoxGeometry {
  const key = `box_${w}_${h}_${d}`;
  let g = _geoCache.get(key);
  if (!g) {
    g = new THREE.BoxGeometry(w, h, d);
    _geoCache.set(key, g);
  }
  return g as THREE.BoxGeometry;
}

export function getCachedCylinderGeo(rTop: number, rBot: number, h: number, seg: number): THREE.CylinderGeometry {
  const key = `cyl_${rTop}_${rBot}_${h}_${seg}`;
  let g = _geoCache.get(key);
  if (!g) {
    g = new THREE.CylinderGeometry(rTop, rBot, h, seg);
    _geoCache.set(key, g);
  }
  return g as THREE.CylinderGeometry;
}

export function getCachedSphereGeo(r: number, wSeg: number, hSeg: number): THREE.SphereGeometry {
  const key = `sph_${r}_${wSeg}_${hSeg}`;
  let g = _geoCache.get(key);
  if (!g) {
    g = new THREE.SphereGeometry(r, wSeg, hSeg);
    _geoCache.set(key, g);
  }
  return g as THREE.SphereGeometry;
}
