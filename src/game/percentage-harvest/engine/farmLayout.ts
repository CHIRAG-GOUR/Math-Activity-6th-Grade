// ============================================================
// PERCENTAGE HARVEST — 3D FARM SPATIAL LAYOUT & ROAD NETWORKS
// Side Country Roads beside Farmhouses -> Front Highway -> Central Market
// Trucks park beside houses and only the winning/delivering truck drives out
// ============================================================

import { TeamId } from '../types';

export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export interface WaypointPath {
  name: string;
  points: Point3D[];
}

export const FARM_WORLD_BOUNDS = {
  minX: -26,
  maxX: 26,
  minZ: -20,
  maxZ: 22,
};

export const FARM_LOCATIONS = {
  // ── BLUE FARM (LEFT INNER SECTOR) ──
  blue: {
    farmhouse: { x: -11.5, y: 0, z: -5.5 },
    barn: { x: -8.8, y: 0, z: -6.0 },
    silo: { x: -6.4, y: 0, z: -7.5 },
    field1Center: { x: -6.8, y: 0, z: 2.2 },
    field1Size: { width: 6.6, depth: 6.6 },
    truckDriveway: { x: -12.0, y: 0, z: -3.0 },
    pasture: { x: -8.5, y: 0, z: -14.0 },
    signpost: { x: -4.5, y: 0, z: 0 },
    irrigationCenter: { x: -6.8, y: 0, z: 2.2 },
  },

  // ── RED FARM (RIGHT INNER SECTOR) ──
  red: {
    farmhouse: { x: 11.5, y: 0, z: -5.5 },
    barn: { x: 8.8, y: 0, z: -6.0 },
    silo: { x: 6.4, y: 0, z: -7.5 },
    field1Center: { x: 6.8, y: 0, z: 2.2 },
    field1Size: { width: 6.6, depth: 6.6 },
    truckDriveway: { x: 12.0, y: 0, z: -3.0 },
    pasture: { x: 8.5, y: 0, z: -14.0 },
    signpost: { x: 4.5, y: 0, z: 0 },
    irrigationCenter: { x: 6.8, y: 0, z: 2.2 },
  },

  // ── CENTRAL AGRICULTURAL HUB, GARDEN & HIGHWAY ──
  central: {
    gardenCenter: { x: 0, y: 0, z: 1.2 },
    poultryFarm: { x: 0, y: 0, z: -14.5 },
    windmill: { x: 0, y: 0, z: -18 },
    weighingStation: { x: 0, y: 0, z: 14.5 },
    weighingScalePad: { x: 0, y: 0.04, z: 14.5 },
    marketDepot: { x: 0, y: 0, z: 16.5 },
    truckBay: { x: 0, y: 0, z: 15.0 },
  },
};

// Road Waypoint Paths for Planting, Harvesting, Spraying, and Side-Road-to-Market Delivery
export const VEHICLE_ROUTES: Record<TeamId, {
  planting: Point3D[];
  harvesting: Point3D[];
  weighingToMarket: Point3D[];
  returnToBarn: Point3D[];
  fullLoop: Point3D[];
  farmerSow: Point3D[];
  farmerFertilize: Point3D[];
  farmerSpray: Point3D[];
  farmerLoadCrate: Point3D[];
  truckDeliver: Point3D[];
  truckReturn: Point3D[];
}> = {
  blue: {
    planting: [
      { x: -8.8, y: 0, z: -4.5 },
      { x: -8.0, y: 0, z: -1.0 },
      { x: -8.8, y: 0, z: 1.0 },
      { x: -5.0, y: 0, z: 2.0 },
      { x: -8.8, y: 0, z: 3.0 },
      { x: -5.0, y: 0, z: 4.0 },
      { x: -8.0, y: 0, z: -1.0 },
      { x: -8.8, y: 0, z: -4.5 },
    ],
    harvesting: [
      { x: -8.8, y: 0, z: -4.5 },
      { x: -8.0, y: 0, z: 0 },
      { x: -8.8, y: 0, z: 1.0 },
      { x: -5.0, y: 0, z: 2.0 },
      { x: -8.8, y: 0, z: 3.0 },
      { x: -5.0, y: 0, z: 4.0 },
      { x: -3.8, y: 0, z: 5.0 },
    ],
    weighingToMarket: [
      { x: -1.8, y: 0, z: 6.8 },
      { x: -1.8, y: 0, z: 7.5 },
      { x: 0, y: 0, z: 7.5 },
      { x: 0, y: 0, z: 14.5 },
    ],
    returnToBarn: [
      { x: 0, y: 0, z: 14.5 },
      { x: 0, y: 0, z: 7.5 },
      { x: -12.0, y: 0, z: 7.5 },
      { x: -12.0, y: 0, z: -3.0 },
    ],
    fullLoop: [
      { x: -8.8, y: 0, z: -4.5 },
      { x: -6.8, y: 0, z: 2.0 },
      { x: 0, y: 0, z: 7.5 },
      { x: -8.8, y: 0, z: -4.5 },
    ],
    farmerSow: [
      { x: -7.8, y: 0, z: -1.8 },
      { x: -6.8, y: 0, z: 0 },
      { x: -8.8, y: 0, z: 1.0 },
      { x: -5.0, y: 0, z: 2.0 },
      { x: -8.8, y: 0, z: 3.0 },
      { x: -5.0, y: 0, z: 4.0 },
      { x: -6.8, y: 0, z: 0 },
      { x: -7.8, y: 0, z: -1.8 },
    ],
    farmerFertilize: [
      { x: -6.4, y: 0, z: -7.0 },
      { x: -6.8, y: 0, z: 0 },
      { x: -8.8, y: 0, z: 1.0 },
      { x: -5.0, y: 0, z: 2.0 },
      { x: -8.8, y: 0, z: 3.0 },
      { x: -5.0, y: 0, z: 4.0 },
      { x: -6.8, y: 0, z: 0 },
      { x: -7.8, y: 0, z: -1.8 },
    ],
    farmerSpray: [
      { x: -8.8, y: 0, z: -5.5 },
      { x: -6.8, y: 0, z: 0 },
      { x: -8.5, y: 0, z: 1.2 },
      { x: -5.2, y: 0, z: 2.2 },
      { x: -8.5, y: 0, z: 3.2 },
      { x: -5.2, y: 0, z: 4.2 },
      { x: -6.8, y: 0, z: 0 },
      { x: -7.8, y: 0, z: -1.8 },
    ],
    farmerLoadCrate: [
      { x: -3.8, y: 0, z: 3.2 },
      { x: -2.8, y: 0, z: 4.6 },
      { x: -1.8, y: 0, z: 6.0 },
      { x: -2.8, y: 0, z: 4.6 },
      { x: -3.8, y: 0, z: 3.2 },
    ],
    // Central Road -> Highway -> Bridge -> Market Delivery
    truckDeliver: [
      { x: -1.8, y: 0, z: 6.8 },
      { x: -1.8, y: 0, z: 7.5 },
      { x: 0, y: 0, z: 7.5 },
      { x: 0, y: 0, z: 11.2 },
      { x: 0, y: 0, z: 15.0 },
    ],
    truckReturn: [
      { x: 0, y: 0, z: 15.0 },
      { x: 0, y: 0, z: 11.2 },
      { x: 0, y: 0, z: 7.5 },
      { x: -6.0, y: 0, z: 7.5 },
      { x: -12.0, y: 0, z: 7.5 },
      { x: -12.0, y: 0, z: 2.0 },
      { x: -12.0, y: 0, z: -3.0 },
    ],
  },

  red: {
    planting: [
      { x: 8.8, y: 0, z: -4.5 },
      { x: 8.0, y: 0, z: -1.0 },
      { x: 8.8, y: 0, z: 1.0 },
      { x: 5.0, y: 0, z: 2.0 },
      { x: 8.8, y: 0, z: 3.0 },
      { x: 5.0, y: 0, z: 4.0 },
      { x: 8.0, y: 0, z: -1.0 },
      { x: 8.8, y: 0, z: -4.5 },
    ],
    harvesting: [
      { x: 8.8, y: 0, z: -4.5 },
      { x: 8.0, y: 0, z: 0 },
      { x: 8.8, y: 0, z: 1.0 },
      { x: 5.0, y: 0, z: 2.0 },
      { x: 8.8, y: 0, z: 3.0 },
      { x: 5.0, y: 0, z: 4.0 },
      { x: 3.8, y: 0, z: 5.0 },
    ],
    weighingToMarket: [
      { x: 1.8, y: 0, z: 6.8 },
      { x: 1.8, y: 0, z: 7.5 },
      { x: 0, y: 0, z: 7.5 },
      { x: 0, y: 0, z: 14.5 },
    ],
    returnToBarn: [
      { x: 0, y: 0, z: 14.5 },
      { x: 0, y: 0, z: 7.5 },
      { x: 12.0, y: 0, z: 7.5 },
      { x: 12.0, y: 0, z: -3.0 },
    ],
    fullLoop: [
      { x: 8.8, y: 0, z: -4.5 },
      { x: 6.8, y: 0, z: 2.0 },
      { x: 0, y: 0, z: 7.5 },
      { x: 8.8, y: 0, z: -4.5 },
    ],
    farmerSow: [
      { x: 7.8, y: 0, z: -1.8 },
      { x: 6.8, y: 0, z: 0 },
      { x: 8.8, y: 0, z: 1.0 },
      { x: 5.0, y: 0, z: 2.0 },
      { x: 8.8, y: 0, z: 3.0 },
      { x: 5.0, y: 0, z: 4.0 },
      { x: 6.8, y: 0, z: 0 },
      { x: 7.8, y: 0, z: -1.8 },
    ],
    farmerFertilize: [
      { x: 6.4, y: 0, z: -7.0 },
      { x: 6.8, y: 0, z: 0 },
      { x: 8.8, y: 0, z: 1.0 },
      { x: 5.0, y: 0, z: 2.0 },
      { x: 8.8, y: 0, z: 3.0 },
      { x: 5.0, y: 0, z: 4.0 },
      { x: 6.8, y: 0, z: 0 },
      { x: 7.8, y: 0, z: -1.8 },
    ],
    farmerSpray: [
      { x: 8.8, y: 0, z: -5.5 },
      { x: 6.8, y: 0, z: 0 },
      { x: 8.5, y: 0, z: 1.2 },
      { x: 5.2, y: 0, z: 2.2 },
      { x: 8.5, y: 0, z: 3.2 },
      { x: 5.2, y: 0, z: 4.2 },
      { x: 6.8, y: 0, z: 0 },
      { x: 7.8, y: 0, z: -1.8 },
    ],
    farmerLoadCrate: [
      { x: 3.8, y: 0, z: 3.2 },
      { x: 2.8, y: 0, z: 4.6 },
      { x: 1.8, y: 0, z: 6.0 },
      { x: 2.8, y: 0, z: 4.6 },
      { x: 3.8, y: 0, z: 3.2 },
    ],
    // Central Road -> Highway -> Bridge -> Market Delivery
    truckDeliver: [
      { x: 1.8, y: 0, z: 6.8 },
      { x: 1.8, y: 0, z: 7.5 },
      { x: 0, y: 0, z: 7.5 },
      { x: 0, y: 0, z: 11.2 },
      { x: 0, y: 0, z: 15.0 },
    ],
    truckReturn: [
      { x: 0, y: 0, z: 15.0 },
      { x: 0, y: 0, z: 11.2 },
      { x: 0, y: 0, z: 7.5 },
      { x: 6.0, y: 0, z: 7.5 },
      { x: 12.0, y: 0, z: 7.5 },
      { x: 12.0, y: 0, z: 2.0 },
      { x: 12.0, y: 0, z: -3.0 },
    ],
  },
};

/** Interpolates smoothly along an array of 3D waypoints using a parametric t (0 to 1) */
export function getInterpolatedWaypoint(
  points: Point3D[],
  t: number
): { position: [number, number, number]; rotationY: number } {
  if (!points || points.length === 0) {
    return { position: [0, 0, 0], rotationY: 0 };
  }
  if (points.length === 1) {
    return { position: [points[0].x, points[0].y, points[0].z], rotationY: 0 };
  }

  const clampedT = Math.max(0, Math.min(0.9999, t));
  const segmentCount = points.length - 1;
  const rawIdx = clampedT * segmentCount;
  const idx = Math.floor(rawIdx);
  const localT = rawIdx - idx;

  const p0 = points[idx];
  const p1 = points[Math.min(idx + 1, points.length - 1)];

  // Smooth linear interpolation
  const x = p0.x + (p1.x - p0.x) * localT;
  const y = p0.y + (p1.y - p0.y) * localT;
  const z = p0.z + (p1.z - p0.z) * localT;

  const dx = p1.x - p0.x;
  const dz = p1.z - p0.z;
  const rotationY = Math.atan2(dx, dz);

  return { position: [x, y, z], rotationY };
}
