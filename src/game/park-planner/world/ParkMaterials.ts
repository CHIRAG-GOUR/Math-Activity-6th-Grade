// ============================================================
// PARK PLANNER — Shared Three.js Materials & Palettes
// Curated, harmonious visual palette for high aesthetic standards
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
