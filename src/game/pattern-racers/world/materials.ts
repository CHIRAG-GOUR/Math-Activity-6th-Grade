// ============================================================
// PATTERN RACERS — Centralized High-Performance PBR Material Library
// Zero-allocation singleton materials shared across all 3D components:
// - Eliminates hundreds of duplicate material instances in WebGL memory
// - Reduces shader switching overhead and WebGL state churn
// - Preserves ultra-high PBR visual fidelity (roughness, metalness, clearcoat)
// ============================================================

import * as THREE from 'three';

class MaterialLibrary {
  // Environment & Track Materials
  readonly asphalt: THREE.MeshStandardMaterial;
  readonly asphaltRunoff: THREE.MeshStandardMaterial;
  readonly grass: THREE.MeshStandardMaterial;
  readonly concrete: THREE.MeshStandardMaterial;
  readonly darkWall: THREE.MeshStandardMaterial;
  readonly metalTruss: THREE.MeshStandardMaterial;
  readonly curbRed: THREE.MeshStandardMaterial;
  readonly curbWhite: THREE.MeshStandardMaterial;
  readonly roadLineYellow: THREE.MeshBasicMaterial;
  readonly roadLineWhite: THREE.MeshBasicMaterial;
  readonly tireRubber: THREE.MeshStandardMaterial;
  readonly tireWhiteWrap: THREE.MeshStandardMaterial;
  readonly tireRedWrap: THREE.MeshStandardMaterial;
  readonly tireBlueWrap: THREE.MeshStandardMaterial;
  readonly fenceWire: THREE.MeshStandardMaterial;
  readonly floodlightBulb: THREE.MeshBasicMaterial;

  // Stadium & Seating Materials
  readonly seatBlue: THREE.MeshStandardMaterial;
  readonly seatRed: THREE.MeshStandardMaterial;
  readonly seatYellow: THREE.MeshStandardMaterial;
  readonly fenceMetal: THREE.MeshStandardMaterial;

  // Audience & Spectator Materials
  readonly spectatorSkin: THREE.MeshStandardMaterial;
  readonly spectatorBlue: THREE.MeshStandardMaterial;
  readonly spectatorRed: THREE.MeshStandardMaterial;
  readonly spectatorYellow: THREE.MeshStandardMaterial;
  readonly spectatorGreen: THREE.MeshStandardMaterial;
  readonly spectatorWhite: THREE.MeshStandardMaterial;

  // Vehicle & Machine Materials
  readonly vehicleBodyBlue: THREE.MeshStandardMaterial;
  readonly vehicleBodyRed: THREE.MeshStandardMaterial;
  readonly vehicleCarbon: THREE.MeshStandardMaterial;
  readonly vehicleRubber: THREE.MeshStandardMaterial;
  readonly vehicleRimChrome: THREE.MeshStandardMaterial;
  readonly vehicleGlass: THREE.MeshStandardMaterial;
  readonly vehicleGlowCyan: THREE.MeshStandardMaterial;
  readonly vehicleGlowOrange: THREE.MeshStandardMaterial;
  readonly nitroFlame: THREE.MeshBasicMaterial;

  // Digital LED Screen & Sponsor Materials
  readonly ledScreenBlue: THREE.MeshStandardMaterial;
  readonly ledScreenRed: THREE.MeshStandardMaterial;
  readonly ledScreenGreen: THREE.MeshStandardMaterial;
  readonly ledScreenYellow: THREE.MeshStandardMaterial;
  readonly ledScreenPink: THREE.MeshStandardMaterial;
  readonly ledScreenPurple: THREE.MeshStandardMaterial;

  // Worker Materials
  readonly workerSuitBlue: THREE.MeshStandardMaterial;
  readonly workerSuitRed: THREE.MeshStandardMaterial;
  readonly workerVestOrange: THREE.MeshStandardMaterial;
  readonly workerVestYellow: THREE.MeshStandardMaterial;
  readonly workerVestCyan: THREE.MeshStandardMaterial;
  readonly workerHardhat: THREE.MeshStandardMaterial;
  readonly workerSkin: THREE.MeshStandardMaterial;
  readonly workerBoots: THREE.MeshStandardMaterial;

  constructor() {
    // 1. Environment & Track
    this.asphalt = new THREE.MeshStandardMaterial({
      color: '#1e293b',
      roughness: 0.82,
      metalness: 0.18,
    });
    this.asphaltRunoff = new THREE.MeshStandardMaterial({
      color: '#334155',
      roughness: 0.88,
      metalness: 0.1,
    });
    this.grass = new THREE.MeshStandardMaterial({
      color: '#4ade80',
      roughness: 0.85,
      metalness: 0.05,
    });
    this.concrete = new THREE.MeshStandardMaterial({
      color: '#f8fafc',
      roughness: 0.45,
      metalness: 0.15,
    });
    this.darkWall = new THREE.MeshStandardMaterial({
      color: '#0f172a',
      roughness: 0.35,
      metalness: 0.85,
    });
    this.metalTruss = new THREE.MeshStandardMaterial({
      color: '#cbd5e1',
      roughness: 0.22,
      metalness: 0.92,
    });
    this.curbRed = new THREE.MeshStandardMaterial({
      color: '#ef4444',
      roughness: 0.45,
      metalness: 0.1,
    });
    this.curbWhite = new THREE.MeshStandardMaterial({
      color: '#f8fafc',
      roughness: 0.45,
      metalness: 0.1,
    });
    this.roadLineYellow = new THREE.MeshBasicMaterial({ color: '#fbbf24' });
    this.roadLineWhite = new THREE.MeshBasicMaterial({ color: '#ffffff' });
    this.tireRubber = new THREE.MeshStandardMaterial({
      color: '#111827',
      roughness: 0.95,
      metalness: 0.05,
    });
    this.tireWhiteWrap = new THREE.MeshStandardMaterial({
      color: '#ffffff',
      roughness: 0.5,
      metalness: 0.1,
    });
    this.tireRedWrap = new THREE.MeshStandardMaterial({
      color: '#dc2626',
      roughness: 0.5,
      metalness: 0.1,
    });
    this.tireBlueWrap = new THREE.MeshStandardMaterial({
      color: '#2563eb',
      roughness: 0.5,
      metalness: 0.1,
    });
    this.fenceWire = new THREE.MeshStandardMaterial({
      color: '#94a3b8',
      roughness: 0.3,
      metalness: 0.85,
      wireframe: true,
    });
    this.floodlightBulb = new THREE.MeshBasicMaterial({
      color: '#fffbeb',
    });

    // 2. Stadium Seating
    this.seatBlue = new THREE.MeshStandardMaterial({ color: '#38bdf8', roughness: 0.4 });
    this.seatRed = new THREE.MeshStandardMaterial({ color: '#f87171', roughness: 0.4 });
    this.seatYellow = new THREE.MeshStandardMaterial({ color: '#facc15', roughness: 0.4 });
    this.fenceMetal = new THREE.MeshStandardMaterial({ color: '#64748b', roughness: 0.3, metalness: 0.8 });

    // 3. Audience Spectators
    this.spectatorSkin = new THREE.MeshStandardMaterial({ color: '#fed7aa', roughness: 0.45 });
    this.spectatorBlue = new THREE.MeshStandardMaterial({ color: '#2563eb', roughness: 0.5 });
    this.spectatorRed = new THREE.MeshStandardMaterial({ color: '#dc2626', roughness: 0.5 });
    this.spectatorYellow = new THREE.MeshStandardMaterial({ color: '#fbbf24', roughness: 0.5 });
    this.spectatorGreen = new THREE.MeshStandardMaterial({ color: '#16a34a', roughness: 0.5 });
    this.spectatorWhite = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.5 });

    // 4. Vehicles
    this.vehicleBodyBlue = new THREE.MeshStandardMaterial({
      color: '#2563eb',
      roughness: 0.2,
      metalness: 0.85,
    });
    this.vehicleBodyRed = new THREE.MeshStandardMaterial({
      color: '#dc2626',
      roughness: 0.2,
      metalness: 0.85,
    });
    this.vehicleCarbon = new THREE.MeshStandardMaterial({
      color: '#090d16',
      roughness: 0.4,
      metalness: 0.8,
    });
    this.vehicleRubber = new THREE.MeshStandardMaterial({
      color: '#111827',
      roughness: 0.85,
      metalness: 0.1,
    });
    this.vehicleRimChrome = new THREE.MeshStandardMaterial({
      color: '#f1f5f9',
      roughness: 0.1,
      metalness: 0.95,
    });
    this.vehicleGlass = new THREE.MeshStandardMaterial({
      color: '#38bdf8',
      roughness: 0.05,
      metalness: 0.9,
      transparent: true,
      opacity: 0.65,
    });
    this.vehicleGlowCyan = new THREE.MeshStandardMaterial({
      color: '#00ffff',
      emissive: '#00ffff',
      emissiveIntensity: 0.8,
    });
    this.vehicleGlowOrange = new THREE.MeshStandardMaterial({
      color: '#ff6600',
      emissive: '#ff6600',
      emissiveIntensity: 0.8,
    });
    this.nitroFlame = new THREE.MeshBasicMaterial({
      color: '#38bdf8',
      transparent: true,
      opacity: 0.9,
    });

    // 5. LED Screens & Sponsors
    this.ledScreenBlue = new THREE.MeshStandardMaterial({
      color: '#0284c7',
      emissive: '#0284c7',
      emissiveIntensity: 0.85,
      roughness: 0.3,
    });
    this.ledScreenRed = new THREE.MeshStandardMaterial({
      color: '#dc2626',
      emissive: '#dc2626',
      emissiveIntensity: 0.85,
      roughness: 0.3,
    });
    this.ledScreenGreen = new THREE.MeshStandardMaterial({
      color: '#10b981',
      emissive: '#10b981',
      emissiveIntensity: 0.85,
      roughness: 0.3,
    });
    this.ledScreenYellow = new THREE.MeshStandardMaterial({
      color: '#d97706',
      emissive: '#d97706',
      emissiveIntensity: 0.85,
      roughness: 0.3,
    });
    this.ledScreenPink = new THREE.MeshStandardMaterial({
      color: '#ec4899',
      emissive: '#ec4899',
      emissiveIntensity: 0.85,
      roughness: 0.3,
    });
    this.ledScreenPurple = new THREE.MeshStandardMaterial({
      color: '#8b5cf6',
      emissive: '#8b5cf6',
      emissiveIntensity: 0.85,
      roughness: 0.3,
    });

    // 6. Workers
    this.workerSuitBlue = new THREE.MeshStandardMaterial({ color: '#1d4ed8', roughness: 0.5 });
    this.workerSuitRed = new THREE.MeshStandardMaterial({ color: '#b91c1c', roughness: 0.5 });
    this.workerVestOrange = new THREE.MeshStandardMaterial({ color: '#f97316', roughness: 0.4 });
    this.workerVestYellow = new THREE.MeshStandardMaterial({ color: '#eab308', roughness: 0.4 });
    this.workerVestCyan = new THREE.MeshStandardMaterial({ color: '#06b6d4', roughness: 0.4 });
    this.workerHardhat = new THREE.MeshStandardMaterial({ color: '#facc15', roughness: 0.3, metalness: 0.2 });
    this.workerSkin = new THREE.MeshStandardMaterial({ color: '#fed7aa', roughness: 0.4 });
    this.workerBoots = new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.8 });
  }
}

// Global Singleton Instance
export const PBR_MATERIALS = new MaterialLibrary();
