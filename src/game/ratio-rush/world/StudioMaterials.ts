// ============================================================
// RATIO RUSH — STUDIO MATERIALS & GEOMETRY POOL (LIGHT THEME)
// Shared singletons for Three.js geometries and materials:
// High-FPS, bright light-mode studio materials matching real film stages.
// ============================================================

import * as THREE from 'three';

// ── Shared Geometries ──
export const geoBox = new THREE.BoxGeometry(1, 1, 1);
export const geoCylinder8 = new THREE.CylinderGeometry(1, 1, 1, 8);
export const geoCylinder12 = new THREE.CylinderGeometry(1, 1, 1, 12);
export const geoCylinder16 = new THREE.CylinderGeometry(1, 1, 1, 16);
export const geoSphere12 = new THREE.SphereGeometry(1, 12, 8);
export const geoSphere16 = new THREE.SphereGeometry(1, 16, 12);
export const geoPlane = new THREE.PlaneGeometry(1, 1);

// ── Material Cache Pool ──
const standardMatCache = new Map<string, THREE.MeshStandardMaterial>();
const basicMatCache = new Map<string, THREE.MeshBasicMaterial>();

export function getStudioMaterial(
  color: string,
  roughness: number = 0.5,
  metalness: number = 0.1,
  emissive?: string,
  emissiveIntensity: number = 1
): THREE.MeshStandardMaterial {
  const key = `${color}_${roughness}_${metalness}_${emissive || 'none'}_${emissiveIntensity}`;
  let mat = standardMatCache.get(key);
  if (!mat) {
    mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      roughness,
      metalness,
      emissive: emissive ? new THREE.Color(emissive) : undefined,
      emissiveIntensity: emissive ? emissiveIntensity : 0,
    });
    standardMatCache.set(key, mat);
  }
  return mat;
}

export function getStudioBasicMaterial(color: string, transparent = false, opacity = 1): THREE.MeshBasicMaterial {
  const key = `${color}_${transparent}_${opacity}`;
  let mat = basicMatCache.get(key);
  if (!mat) {
    mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(color),
      transparent,
      opacity,
    });
    basicMatCache.set(key, mat);
  }
  return mat;
}

// ── Core Pre-Cached Materials (Bright Light Studio Theme & Human Characters) ──
export const MAT_FLOOR_CONCRETE = getStudioMaterial('#e2e8f0', 0.6, 0.05); // Smooth Light Concrete Studio Floor
export const MAT_FLOOR_STAGE = getStudioMaterial('#cbd5e1', 0.5, 0.1);    // Light Stage Deck
export const MAT_STAGE_TAPE_YELLOW = getStudioMaterial('#eab308', 0.3, 0.0, '#ca8a04', 0.5);
export const MAT_STAGE_TAPE_BLUE = getStudioMaterial('#3b82f6', 0.3, 0.0, '#2563eb', 0.5);
export const MAT_STAGE_TAPE_RED = getStudioMaterial('#ef4444', 0.3, 0.0, '#dc2626', 0.5);
export const MAT_WALL_STUDIO = getStudioMaterial('#f8fafc', 0.8, 0.02);   // Bright White Studio Walls
export const MAT_WALL_ACOUSTIC = getStudioMaterial('#e2e8f0', 0.9, 0.0);  // Clean Off-White Acoustic Panels
export const MAT_WALL_ACOUSTIC_ACCENT = getStudioMaterial('#d97706', 0.6, 0.0); // Warm Natural Wood Slats
export const MAT_CEILING_TRUSS = getStudioMaterial('#64748b', 0.4, 0.7); // Silver/Dark Steel Truss Grid
export const MAT_STEEL_DARK = getStudioMaterial('#1e293b', 0.4, 0.8);
export const MAT_STEEL_BRIGHT = getStudioMaterial('#cbd5e1', 0.2, 0.9);
export const MAT_CHROMA_GREEN = getStudioMaterial('#16a34a', 0.4, 0.0, '#22c55e', 0.8); // Vibrant Chroma Cyclorama
export const MAT_CHROMA_CYAN = getStudioMaterial('#0284c7', 0.4, 0.0, '#38bdf8', 0.8);
export const MAT_ROAD_CASE_BLACK = getStudioMaterial('#0f172a', 0.6, 0.2);
export const MAT_ROAD_CASE_CORNER = getStudioMaterial('#94a3b8', 0.2, 0.9);
export const MAT_CABLE_BLACK = getStudioMaterial('#0f172a', 0.8, 0.05);
export const MAT_CABLE_YELLOW = getStudioMaterial('#eab308', 0.5, 0.05);
export const MAT_CABLE_RAMP = getStudioMaterial('#eab308', 0.4, 0.1);
export const MAT_DIRECTOR_WOOD = getStudioMaterial('#b45309', 0.6, 0.05);
export const MAT_DIRECTOR_CANVAS = getStudioMaterial('#0284c7', 0.7, 0.0);
export const MAT_SCREEN_GLOW = getStudioMaterial('#0284c7', 0.2, 0.0, '#38bdf8', 1.4);
export const MAT_SCREEN_RECORDING = getStudioMaterial('#dc2626', 0.2, 0.0, '#ef4444', 1.6);
export const MAT_WARM_BULB = getStudioMaterial('#fef08a', 0.1, 0.0, '#fde047', 2.0);
export const MAT_STUDIO_LIGHT_WHITE = getStudioMaterial('#ffffff', 0.1, 0.0, '#ffffff', 2.2);
export const MAT_GLASS_TINT = getStudioBasicMaterial('#38bdf8', true, 0.25);
export const MAT_RED_CARPET = getStudioMaterial('#b91c1c', 0.8, 0.0);
export const MAT_GOLD_BRASS = getStudioMaterial('#f59e0b', 0.2, 0.8, '#d97706', 0.4);

// ── Human Character Materials ──
export const MAT_SKIN_PEACH = getStudioMaterial('#ffedd5', 0.6, 0.0);
export const MAT_SKIN_WARM = getStudioMaterial('#fed7aa', 0.6, 0.0);
export const MAT_SKIN_BRONZE = getStudioMaterial('#d97706', 0.6, 0.0);
export const MAT_SKIN_DEEP = getStudioMaterial('#78350f', 0.6, 0.0);
export const MAT_EYE_WHITE = getStudioMaterial('#ffffff', 0.2, 0.0);
export const MAT_EYE_PUPIL = getStudioMaterial('#0f172a', 0.1, 0.0);
export const MAT_LIPS_ROSE = getStudioMaterial('#f43f5e', 0.5, 0.0);
export const MAT_HAIR_BRUNETTE = getStudioMaterial('#451a03', 0.7, 0.05);
export const MAT_HAIR_BLACK = getStudioMaterial('#0f172a', 0.6, 0.1);
export const MAT_HAIR_BLONDE = getStudioMaterial('#fde047', 0.6, 0.05);
export const MAT_HAIR_AUBURN = getStudioMaterial('#9a3412', 0.7, 0.05);
export const MAT_DIRECTOR_CAP = getStudioMaterial('#1e293b', 0.5, 0.1);
export const MAT_DIRECTOR_CAP_BRIM = getStudioMaterial('#0f172a', 0.4, 0.1);
export const MAT_GOWN_EMERALD = getStudioMaterial('#059669', 0.4, 0.2, '#10b981', 0.3);
export const MAT_GOWN_GOLD = getStudioMaterial('#eab308', 0.3, 0.6, '#facc15', 0.3);
export const MAT_JACKET_HERO = getStudioMaterial('#1e40af', 0.5, 0.1);
export const MAT_JACKET_LEATHER = getStudioMaterial('#78350f', 0.4, 0.2);

