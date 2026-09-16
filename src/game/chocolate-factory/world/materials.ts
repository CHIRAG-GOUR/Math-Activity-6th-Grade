// ============================================================
// THE CHOCOLATE FACTORY — SHARED MATERIALS AND GEOMETRY
//
// One instance of every material and primitive, shared by the whole scene.
// The factory is drawn more than once per frame (overview plus both team
// focus insets), so shared materials keep the state changes down and let
// three.js batch far more aggressively.
//
// Palette: warm cream architecture, stainless steel machinery, glossy
// chocolate, wood and copper accents. Nothing dark, nothing neon.
// ============================================================

import * as THREE from 'three';
import type { TeamId } from '../types';

const std = (
  color: string,
  opts: Partial<THREE.MeshStandardMaterialParameters> = {}
) => new THREE.MeshStandardMaterial({ color, roughness: 0.62, metalness: 0.05, ...opts });

export const MAT = {
  // Architecture
  floor: std('#e8e3dc', { roughness: 0.85 }),
  floorLine: std('#c9a227', { roughness: 0.7 }),
  wall: std('#f6f1e7', { roughness: 0.82 }),
  wallTrim: std('#e0d6c4', { roughness: 0.8 }),
  roof: std('#cfd6dd', { roughness: 0.6, metalness: 0.25 }),
  glass: new THREE.MeshPhysicalMaterial({
    color: '#cfe6f2', roughness: 0.08, metalness: 0, transmission: 0.82,
    thickness: 0.4, transparent: true, opacity: 0.55,
  }),

  // Machinery
  steel: std('#c6ced6', { roughness: 0.34, metalness: 0.72 }),
  steelDark: std('#8e99a4', { roughness: 0.42, metalness: 0.68 }),
  steelLight: std('#e2e8ee', { roughness: 0.28, metalness: 0.6 }),
  copper: std('#c67c3e', { roughness: 0.34, metalness: 0.75 }),
  brass: std('#d7a24c', { roughness: 0.3, metalness: 0.8 }),
  rubber: std('#4c4a49', { roughness: 0.92 }),
  belt: std('#3f3b39', { roughness: 0.88 }),
  guard: std('#f0b429', { roughness: 0.6 }),
  wood: std('#a9763f', { roughness: 0.78 }),
  woodDark: std('#84562b', { roughness: 0.8 }),

  // Chocolate
  chocolate: std('#4a2410', { roughness: 0.18, metalness: 0.08 }),
  chocolateMilk: std('#7a4423', { roughness: 0.2, metalness: 0.06 }),
  chocolateWhite: std('#e8d3ae', { roughness: 0.26 }),
  chocolateLiquid: new THREE.MeshPhysicalMaterial({
    color: '#5b2d12', roughness: 0.12, metalness: 0.05, clearcoat: 0.9, clearcoatRoughness: 0.15,
  }),

  // Product / packaging
  boxBlue: std('#2f6fd0', { roughness: 0.7 }),
  boxRed: std('#d23b3b', { roughness: 0.7 }),
  boxCard: std('#c99a63', { roughness: 0.85 }),
  wrapperGold: std('#e8b84b', { roughness: 0.42, metalness: 0.35 }),

  // Team accents
  blue: std('#2563eb', { roughness: 0.5 }),
  blueLight: std('#93c5fd', { roughness: 0.55 }),
  red: std('#dc2626', { roughness: 0.5 }),
  redLight: std('#fca5a5', { roughness: 0.55 }),

  // Lamps / indicators
  lampOff: std('#94a3b8', { roughness: 0.5 }),
  lampGreen: std('#22c55e', { emissive: '#16a34a', emissiveIntensity: 1.5, roughness: 0.4 }),
  lampAmber: std('#f59e0b', { emissive: '#d97706', emissiveIntensity: 1.6, roughness: 0.4 }),
  lampRed: std('#ef4444', { emissive: '#dc2626', emissiveIntensity: 1.6, roughness: 0.4 }),
  screen: std('#0f172a', { emissive: '#1e293b', emissiveIntensity: 0.4, roughness: 0.4 }),

  // People
  skin: std('#e8b98f', { roughness: 0.75 }),
  skinDark: std('#a9724a', { roughness: 0.75 }),
  hair: std('#3b2b21', { roughness: 0.85 }),
  hairLight: std('#8a6237', { roughness: 0.85 }),
  coatWhite: std('#f8fafc', { roughness: 0.72 }),
  vestBlue: std('#1d4ed8', { roughness: 0.7 }),
  vestRed: std('#b91c1c', { roughness: 0.7 }),
  vestHi: std('#facc15', { roughness: 0.65 }),
  trousers: std('#37455a', { roughness: 0.8 }),
  shoe: std('#22262b', { roughness: 0.85 }),
  hardHat: std('#f8b500', { roughness: 0.55 }),

  // Environment
  grass: std('#7fae5a', { roughness: 0.92 }),
  road: std('#5b5f66', { roughness: 0.9 }),
  roadLine: std('#f1f5f9', { roughness: 0.8 }),
  brickWarm: std('#c98b6b', { roughness: 0.85 }),
  awning: std('#d98a5f', { roughness: 0.75 }),
} as const;

export const GEO = {
  box: new THREE.BoxGeometry(1, 1, 1),
  cyl: new THREE.CylinderGeometry(0.5, 0.5, 1, 20),
  cylLow: new THREE.CylinderGeometry(0.5, 0.5, 1, 10),
  cone: new THREE.ConeGeometry(0.5, 1, 16),
  sphere: new THREE.SphereGeometry(0.5, 16, 12),
  sphereLow: new THREE.SphereGeometry(0.5, 10, 8),
  torus: new THREE.TorusGeometry(0.5, 0.12, 8, 24),
  plane: new THREE.PlaneGeometry(1, 1),
} as const;

export const teamMat = (team: TeamId) => (team === 'blue' ? MAT.blue : MAT.red);
export const teamLightMat = (team: TeamId) => (team === 'blue' ? MAT.blueLight : MAT.redLight);
export const teamVestMat = (team: TeamId) => (team === 'blue' ? MAT.vestBlue : MAT.vestRed);
export const teamBoxMat = (team: TeamId) => (team === 'blue' ? MAT.boxBlue : MAT.boxRed);
export const TEAM_HEX: Record<TeamId, string> = { blue: '#2563eb', red: '#dc2626' };
