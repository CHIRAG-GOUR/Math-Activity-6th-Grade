// ============================================================
// GRAPHWORKS — THE DATA CITY: 3D Geometry & Material System
// Premium stylized materials, shared geometries, and color tokens
// ============================================================
import * as THREE from 'three';

// ── SHARED GEOMETRIES (Reused across instances for 60 FPS performance) ──
export const CITY_GEO = {
  box: new THREE.BoxGeometry(1, 1, 1),
  plane: new THREE.PlaneGeometry(1, 1),
  cylinder: new THREE.CylinderGeometry(1, 1, 1, 16),
  cylinder8: new THREE.CylinderGeometry(1, 1, 1, 8),
  cylinder6: new THREE.CylinderGeometry(1, 1, 1, 6),
  sphere: new THREE.SphereGeometry(1, 16, 16),
  sphereHigh: new THREE.SphereGeometry(1, 24, 24),
  cone: new THREE.ConeGeometry(1, 1, 8),
  torus: new THREE.TorusGeometry(1, 0.15, 12, 24),
};

// ── COLOR TOKENS ──
export const CITY_COLORS = {
  skyZenith: '#0284c7',
  skyHorizon: '#bae6fd',
  sunlight: '#fffdf0',
  ambient: '#e0f2fe',
  grass: '#4ade80',
  grassLush: '#22c55e',
  grassDark: '#15803d',
  parkPath: '#fef3c7',
  asphalt: '#334155',
  roadLine: '#facc15',
  roadStripe: '#f8fafc',
  concrete: '#e2e8f0',
  curb: '#cbd5e1',
  sidewalk: '#e2e8f0',
  waterShallow: '#38bdf8',
  waterDeep: '#0284c7',
  bldgWhite: '#ffffff',
  bldgOffWhite: '#f8fafc',
  bldgCream: '#fef9c3',
  bldgSlate: '#64748b',
  bldgSteel: '#475569',
  glassBlue: '#67e8f9',
  glassTeal: '#5eead4',
  roofTerracotta: '#e11d48',
  roofNavy: '#1e3a8a',
  roofCharcoal: '#1e293b',
  metalSilver: '#94a3b8',
  metalDark: '#475569',
  metalGold: '#f59e0b',
  blueTeam: '#2563eb',
  redTeam: '#dc2626',
  yellowAccent: '#fbbf24',
  greenAccent: '#10b981',
};

// ── SHARED MATERIALS ──
export const CITY_MAT = {
  // Terrain & Ground
  grassGround: new THREE.MeshStandardMaterial({
    color: '#4ade80',
    roughness: 0.85,
    metalness: 0.05,
    flatShading: true,
  }),
  parkLush: new THREE.MeshStandardMaterial({
    color: '#22c55e',
    roughness: 0.8,
  }),
  sandBeach: new THREE.MeshStandardMaterial({
    color: '#fde68a',
    roughness: 0.9,
  }),
  waterSurface: new THREE.MeshStandardMaterial({
    color: '#0ea5e9',
    roughness: 0.15,
    metalness: 0.25,
    transparent: true,
    opacity: 0.88,
  }),

  // Roads & Pavements
  asphalt: new THREE.MeshStandardMaterial({
    color: '#334155',
    roughness: 0.9,
    metalness: 0.1,
  }),
  curb: new THREE.MeshStandardMaterial({
    color: '#cbd5e1',
    roughness: 0.8,
  }),
  roadMarkingYellow: new THREE.MeshStandardMaterial({
    color: '#facc15',
    roughness: 0.6,
  }),
  roadMarkingWhite: new THREE.MeshStandardMaterial({
    color: '#f8fafc',
    roughness: 0.6,
  }),
  sidewalk: new THREE.MeshStandardMaterial({
    color: '#e2e8f0',
    roughness: 0.85,
  }),
  concrete: new THREE.MeshStandardMaterial({
    color: '#e2e8f0',
    roughness: 0.75,
    metalness: 0.1,
  }),

  // Architecture & Buildings
  wallWhite: new THREE.MeshStandardMaterial({
    color: '#ffffff',
    roughness: 0.4,
    metalness: 0.1,
  }),
  wallModern1: new THREE.MeshStandardMaterial({
    color: '#f1f5f9',
    roughness: 0.45,
  }),
  wallModern2: new THREE.MeshStandardMaterial({
    color: '#e2e8f0',
    roughness: 0.5,
  }),
  wallWarmCream: new THREE.MeshStandardMaterial({
    color: '#fef3c7',
    roughness: 0.6,
  }),
  wallCharcoal: new THREE.MeshStandardMaterial({
    color: '#1e293b',
    roughness: 0.4,
    metalness: 0.3,
  }),
  glassCurtain: new THREE.MeshStandardMaterial({
    color: '#67e8f9',
    roughness: 0.1,
    metalness: 0.6,
    transparent: true,
    opacity: 0.82,
    emissive: '#0284c7',
    emissiveIntensity: 0.25,
  }),
  glassWarm: new THREE.MeshStandardMaterial({
    color: '#fef08a',
    roughness: 0.2,
    emissive: '#fef08a',
    emissiveIntensity: 0.5,
  }),
  roofNavy: new THREE.MeshStandardMaterial({
    color: '#1e3a8a',
    roughness: 0.5,
  }),
  roofTerracotta: new THREE.MeshStandardMaterial({
    color: '#e11d48',
    roughness: 0.6,
  }),

  // Metals & Infrastructure
  metalSilver: new THREE.MeshStandardMaterial({
    color: '#94a3b8',
    roughness: 0.3,
    metalness: 0.8,
  }),
  metalDark: new THREE.MeshStandardMaterial({
    color: '#334155',
    roughness: 0.4,
    metalness: 0.7,
  }),
  metalChrome: new THREE.MeshStandardMaterial({
    color: '#ffffff',
    roughness: 0.1,
    metalness: 0.95,
  }),

  // Team & Accents
  blueTeam: new THREE.MeshStandardMaterial({
    color: '#2563eb',
    roughness: 0.35,
    metalness: 0.2,
  }),
  blueTeamGlow: new THREE.MeshStandardMaterial({
    color: '#38bdf8',
    emissive: '#0284c7',
    emissiveIntensity: 0.8,
    roughness: 0.2,
  }),
  redTeam: new THREE.MeshStandardMaterial({
    color: '#dc2626',
    roughness: 0.35,
    metalness: 0.2,
  }),
  redTeamGlow: new THREE.MeshStandardMaterial({
    color: '#f87171',
    emissive: '#dc2626',
    emissiveIntensity: 0.8,
    roughness: 0.2,
  }),
  greenGlow: new THREE.MeshStandardMaterial({
    color: '#22c55e',
    emissive: '#16a34a',
    emissiveIntensity: 0.8,
  }),
  yellowGlow: new THREE.MeshStandardMaterial({
    color: '#fbbf24',
    emissive: '#d97706',
    emissiveIntensity: 0.8,
  }),
};
