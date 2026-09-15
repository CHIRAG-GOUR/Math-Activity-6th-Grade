// ============================================================
// THE SOLAR FORGE: 3D Material Library
// Bright Earth daylight materials: high-albedo solar white ceramic,
// gleaming brushed aluminum, golden brass, reflective glass,
// warm desert sand, and vibrant squadron enamels.
// NO muddy black or dark plastic materials!
// ============================================================

import * as THREE from 'three';

export const SOLAR_MATERIALS = {
  // Earth Desert terrain & geology
  desertSand: new THREE.MeshStandardMaterial({
    color: '#e7c27d',
    roughness: 0.85,
    metalness: 0.04,
    flatShading: true,
  }),
  desertRock: new THREE.MeshStandardMaterial({
    color: '#c98a58',
    roughness: 0.88,
    metalness: 0.06,
    flatShading: true,
  }),
  distantMountain: new THREE.MeshStandardMaterial({
    color: '#b5835a',
    roughness: 0.9,
    metalness: 0.02,
    flatShading: true,
  }),
  roadAsphalt: new THREE.MeshStandardMaterial({
    color: '#64748b',
    roughness: 0.65,
    metalness: 0.2,
  }),
  concretePlinth: new THREE.MeshStandardMaterial({
    color: '#f1f5f9',
    roughness: 0.5,
    metalness: 0.08,
  }),

  // Modern High-Tech Solar Engineering Metals (White & Silver)
  solarWhiteCeramic: new THREE.MeshStandardMaterial({
    color: '#ffffff',
    roughness: 0.2,
    metalness: 0.15,
  }),
  brushedAluminum: new THREE.MeshStandardMaterial({
    color: '#e2e8f0',
    roughness: 0.3,
    metalness: 0.8,
  }),
  machinerySteel: new THREE.MeshStandardMaterial({
    color: '#cbd5e1',
    roughness: 0.35,
    metalness: 0.75,
  }),
  darkTitanium: new THREE.MeshStandardMaterial({
    color: '#94a3b8',
    roughness: 0.3,
    metalness: 0.85,
  }),
  chromePlate: new THREE.MeshStandardMaterial({
    color: '#f8fafc',
    roughness: 0.08,
    metalness: 0.95,
  }),
  brassGnomon: new THREE.MeshStandardMaterial({
    color: '#f59e0b',
    roughness: 0.22,
    metalness: 0.85,
  }),

  // Heliostat mirror surface (high specular reflectivity)
  mirrorSurface: new THREE.MeshStandardMaterial({
    color: '#ffffff',
    roughness: 0.02,
    metalness: 0.98,
  }),
  mirrorFrame: new THREE.MeshStandardMaterial({
    color: '#94a3b8',
    roughness: 0.35,
    metalness: 0.65,
  }),

  // Team Enamel Paints
  blueTeamHull: new THREE.MeshStandardMaterial({
    color: '#0284c7',
    roughness: 0.25,
    metalness: 0.5,
  }),
  blueTeamAccent: new THREE.MeshStandardMaterial({
    color: '#38bdf8',
    roughness: 0.15,
    metalness: 0.7,
  }),
  redTeamHull: new THREE.MeshStandardMaterial({
    color: '#dc2626',
    roughness: 0.25,
    metalness: 0.5,
  }),
  redTeamAccent: new THREE.MeshStandardMaterial({
    color: '#f87171',
    roughness: 0.15,
    metalness: 0.7,
  }),

  // Solar & Energy FX
  solarSiliconNavy: new THREE.MeshStandardMaterial({
    color: '#1e3a8a',
    roughness: 0.12,
    metalness: 0.85,
  }),
  moltenCoreGlow: new THREE.MeshStandardMaterial({
    color: '#fbbf24',
    emissive: '#f59e0b',
    emissiveIntensity: 2.8,
    roughness: 0.15,
  }),
  receiverCeramic: new THREE.MeshStandardMaterial({
    color: '#312e81',
    roughness: 0.3,
    metalness: 0.4,
  }),
  safetyYellow: new THREE.MeshStandardMaterial({
    color: '#facc15',
    roughness: 0.35,
    metalness: 0.2,
  }),
  desertFoliage: new THREE.MeshStandardMaterial({
    color: '#4d7c0f',
    roughness: 0.9,
    metalness: 0.02,
    flatShading: true,
  }),
};
