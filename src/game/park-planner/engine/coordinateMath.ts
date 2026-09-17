// ============================================================
// PARK PLANNER — Cartesian Coordinate Mathematics & Transformations
// Grade 6: Position, Reflections, Translations, Rotations
// ============================================================

import { Coordinate2D, QuadrantId } from '../types';

export const UNIT_SIZE = 2.4; // 1 coordinate grid unit = 2.4 meters in 3D Three.js world
export const GRID_EXTENT = 5; // -5 to +5 on both X and Y axes

/**
 * Maps Cartesian 2D coordinate (x, y) to 3D Three.js coordinate [X, Y, Z].
 * In standard Cartesian: +X is East (Right), +Y is North (Up).
 * In Three.js: +X is Right, +Y is Vertical Altitude, -Z is North (Forward).
 */
export function coordToWorld(coord: Coordinate2D, altitude = 0): [number, number, number] {
  return [coord.x * UNIT_SIZE, altitude, -coord.y * UNIT_SIZE];
}

/**
 * Maps 3D world position back to Cartesian coordinate (x, y) rounded to nearest integer.
 */
export function worldToCoord(pos: [number, number, number] | { x: number; z: number }): Coordinate2D {
  const x = Array.isArray(pos) ? pos[0] : pos.x;
  const z = Array.isArray(pos) ? pos[2] : pos.z;
  return {
    x: Math.round(x / UNIT_SIZE),
    y: Math.round(-z / UNIT_SIZE),
  };
}

/**
 * Returns which quadrant or axis a coordinate belongs to.
 */
export function getQuadrant(coord: Coordinate2D): QuadrantId {
  if (coord.x === 0 && coord.y === 0) return 'origin';
  if (coord.x === 0) return 'axis_y';
  if (coord.y === 0) return 'axis_x';
  if (coord.x > 0 && coord.y > 0) return 'QI';
  if (coord.x < 0 && coord.y > 0) return 'QII';
  if (coord.x < 0 && coord.y < 0) return 'QIII';
  return 'QIV';
}

export function getQuadrantLabel(quadrant: QuadrantId): string {
  switch (quadrant) {
    case 'QI':
      return 'Quadrant I (+x, +y) — Active Playground';
    case 'QII':
      return 'Quadrant II (-x, +y) — Botanical Gardens';
    case 'QIII':
      return 'Quadrant III (-x, -y) — Sports Complex';
    case 'QIV':
      return 'Quadrant IV (+x, -y) — Picnic Grove';
    case 'origin':
      return 'Origin (0,0) — Central Park Plaza';
    case 'axis_x':
      return 'X-Axis (y=0) — East-West Promenade';
    case 'axis_y':
      return 'Y-Axis (x=0) — North-South Promenade';
  }
}

/**
 * Translation: (x, y) -> (x + dx, y + dy)
 */
export function translateCoord(coord: Coordinate2D, dx: number, dy: number): Coordinate2D {
  return {
    x: Math.max(-GRID_EXTENT, Math.min(GRID_EXTENT, coord.x + dx)),
    y: Math.max(-GRID_EXTENT, Math.min(GRID_EXTENT, coord.y + dy)),
  };
}

/**
 * Reflection across the X-axis: (x, y) -> (x, -y)
 */
export function reflectX(coord: Coordinate2D): Coordinate2D {
  return {
    x: coord.x,
    y: -coord.y,
  };
}

/**
 * Reflection across the Y-axis: (x, y) -> (-x, y)
 */
export function reflectY(coord: Coordinate2D): Coordinate2D {
  return {
    x: -coord.x,
    y: coord.y,
  };
}

/**
 * Reflection across the Origin (0,0): (x, y) -> (-x, -y)
 */
export function reflectOrigin(coord: Coordinate2D): Coordinate2D {
  return {
    x: -coord.x,
    y: -coord.y,
  };
}

/**
 * Rotation around Origin (0,0) in 90° increments:
 * Clockwise:
 *  90° CW:  (x, y) -> (y, -x)
 * 180° CW:  (x, y) -> (-x, -y)
 * 270° CW:  (x, y) -> (-y, x)
 * Counter-Clockwise:
 *  90° CCW: (x, y) -> (-y, x)
 * 180° CCW: (x, y) -> (-x, -y)
 * 270° CCW: (x, y) -> (y, -x)
 */
export function rotateAroundOrigin(
  coord: Coordinate2D,
  degrees: 90 | 180 | 270,
  clockwise = true
): Coordinate2D {
  const normDeg = ((degrees % 360) + 360) % 360;
  if (normDeg === 180) {
    return { x: -coord.x, y: -coord.y };
  }

  if (clockwise) {
    if (normDeg === 90) return { x: coord.y, y: -coord.x };
    if (normDeg === 270) return { x: -coord.y, y: coord.x };
  } else {
    if (normDeg === 90) return { x: -coord.y, y: coord.x };
    if (normDeg === 270) return { x: -coord.y, y: coord.x };
  }

  return { ...coord };
}

export function formatCoord(coord: Coordinate2D): string {
  return `(${coord.x}, ${coord.y})`;
}

export function isEqualCoord(a: Coordinate2D | null | undefined, b: Coordinate2D | null | undefined): boolean {
  if (!a || !b) return false;
  return a.x === b.x && a.y === b.y;
}

export function arePointListsEqual(listA: Coordinate2D[], listB: Coordinate2D[]): boolean {
  if (listA.length !== listB.length) return false;
  return listA.every((ptA, i) => isEqualCoord(ptA, listB[i]));
}

/**
 * Smooth 3D Interpolation
 */
export function lerp3D(
  a: [number, number, number],
  b: [number, number, number],
  t: number
): [number, number, number] {
  const clampT = Math.max(0, Math.min(1, t));
  return [
    a[0] + (b[0] - a[0]) * clampT,
    a[1] + (b[1] - a[1]) * clampT,
    a[2] + (b[2] - a[2]) * clampT,
  ];
}

/**
 * Cubic smoothstep easing
 */
export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
