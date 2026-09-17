// ============================================================
// PARK PLANNER — Waypoint Graph & Pedestrian/Cyclist Navigation
// Comprehensive path network preventing off-road walking, sideways sliding, and clipping.
// ============================================================

import { UNIT_SIZE } from './coordinateMath';

export interface NavNode {
  id: string;
  pos: [number, number, number]; // 3D world coords [x, y, z]
  type: 'entrance' | 'promenade' | 'cycle_lane' | 'outer_footpath' | 'quadrant_path' | 'plaza' | 'activity_spot';
  neighbors: string[];
}

// Outer dimensions
// Grid extent is -5 to +5 -> 24m park interior.
// Outer footpath: ~14.5m radius box.
// Outer street: ~16.5m radius box.
const R_INNER = UNIT_SIZE * 5.0; // 12.0m (Perimeter fence line)
const R_FOOTPATH = UNIT_SIZE * 5.8; // 13.92m (Outer sidewalk)
const R_CYCLE = UNIT_SIZE * 5.4; // 12.96m (Dedicated cycle lane)
const R_PLAZA = UNIT_SIZE * 1.0; // 2.4m (Central Origin Plaza)

export const PARK_NAV_NODES: Record<string, NavNode> = {
  // ------------------------------------------------------------
  // 1. ORIGIN & CENTRAL PLAZA NODES (0, 0)
  // ------------------------------------------------------------
  'plaza_center': { id: 'plaza_center', pos: [0, 0.02, 0], type: 'plaza', neighbors: ['plaza_n', 'plaza_s', 'plaza_e', 'plaza_w'] },
  'plaza_n': { id: 'plaza_n', pos: [0, 0.02, -R_PLAZA], type: 'plaza', neighbors: ['plaza_center', 'axis_y_n1', 'qi_entrance', 'qii_entrance'] },
  'plaza_s': { id: 'plaza_s', pos: [0, 0.02, R_PLAZA], type: 'plaza', neighbors: ['plaza_center', 'axis_y_s1', 'qiii_entrance', 'qiv_entrance'] },
  'plaza_e': { id: 'plaza_e', pos: [R_PLAZA, 0.02, 0], type: 'plaza', neighbors: ['plaza_center', 'axis_x_e1', 'qi_entrance', 'qiv_entrance'] },
  'plaza_w': { id: 'plaza_w', pos: [-R_PLAZA, 0.02, 0], type: 'plaza', neighbors: ['plaza_center', 'axis_x_w1', 'qii_entrance', 'qiii_entrance'] },

  // ------------------------------------------------------------
  // 2. MAIN PROMENADES (X-Axis and Y-Axis)
  // ------------------------------------------------------------
  // North Promenade (Y-Axis North)
  'axis_y_n1': { id: 'axis_y_n1', pos: [0, 0.02, -UNIT_SIZE * 2.5], type: 'promenade', neighbors: ['plaza_n', 'axis_y_n2', 'qii_garden_mid', 'qi_play_mid'] },
  'axis_y_n2': { id: 'axis_y_n2', pos: [0, 0.02, -UNIT_SIZE * 4.2], type: 'promenade', neighbors: ['axis_y_n1', 'gate_north'] },

  // South Promenade (Y-Axis South)
  'axis_y_s1': { id: 'axis_y_s1', pos: [0, 0.02, UNIT_SIZE * 2.5], type: 'promenade', neighbors: ['plaza_s', 'axis_y_s2', 'qiii_sports_mid', 'qiv_picnic_mid'] },
  'axis_y_s2': { id: 'axis_y_s2', pos: [0, 0.02, UNIT_SIZE * 4.2], type: 'promenade', neighbors: ['axis_y_s1', 'gate_south'] },

  // East Promenade (X-Axis East)
  'axis_x_e1': { id: 'axis_x_e1', pos: [UNIT_SIZE * 2.5, 0.02, 0], type: 'promenade', neighbors: ['plaza_e', 'axis_x_e2', 'qi_play_south', 'qiv_picnic_north'] },
  'axis_x_e2': { id: 'axis_x_e2', pos: [UNIT_SIZE * 4.2, 0.02, 0], type: 'promenade', neighbors: ['axis_x_e1', 'gate_east'] },

  // West Promenade (X-Axis West)
  'axis_x_w1': { id: 'axis_x_w1', pos: [-UNIT_SIZE * 2.5, 0.02, 0], type: 'promenade', neighbors: ['plaza_w', 'axis_x_w2', 'qii_garden_south', 'qiii_sports_north'] },
  'axis_x_w2': { id: 'axis_x_w2', pos: [-UNIT_SIZE * 4.2, 0.02, 0], type: 'promenade', neighbors: ['axis_x_w1', 'gate_west'] },

  // ------------------------------------------------------------
  // 3. PARK ENTRANCE GATES
  // ------------------------------------------------------------
  'gate_north': { id: 'gate_north', pos: [0, 0.02, -R_INNER], type: 'entrance', neighbors: ['axis_y_n2', 'fp_north_mid', 'cycle_north_mid'] },
  'gate_south': { id: 'gate_south', pos: [0, 0.02, R_INNER], type: 'entrance', neighbors: ['axis_y_s2', 'fp_south_mid', 'cycle_south_mid'] },
  'gate_east': { id: 'gate_east', pos: [R_INNER, 0.02, 0], type: 'entrance', neighbors: ['axis_x_e2', 'fp_east_mid', 'cycle_east_mid'] },
  'gate_west': { id: 'gate_west', pos: [-R_INNER, 0.02, 0], type: 'entrance', neighbors: ['axis_x_w2', 'fp_west_mid', 'cycle_west_mid'] },

  // ------------------------------------------------------------
  // 4. OUTER PEDESTRIAN FOOTPATH (Surrounding the entire park)
  // ------------------------------------------------------------
  'fp_north_mid': { id: 'fp_north_mid', pos: [0, 0.02, -R_FOOTPATH], type: 'outer_footpath', neighbors: ['gate_north', 'fp_ne_corner', 'fp_nw_corner'] },
  'fp_ne_corner': { id: 'fp_ne_corner', pos: [R_FOOTPATH, 0.02, -R_FOOTPATH], type: 'outer_footpath', neighbors: ['fp_north_mid', 'fp_east_mid'] },
  'fp_east_mid': { id: 'fp_east_mid', pos: [R_FOOTPATH, 0.02, 0], type: 'outer_footpath', neighbors: ['gate_east', 'fp_ne_corner', 'fp_se_corner'] },
  'fp_se_corner': { id: 'fp_se_corner', pos: [R_FOOTPATH, 0.02, R_FOOTPATH], type: 'outer_footpath', neighbors: ['fp_east_mid', 'fp_south_mid'] },
  'fp_south_mid': { id: 'fp_south_mid', pos: [0, 0.02, R_FOOTPATH], type: 'outer_footpath', neighbors: ['gate_south', 'fp_se_corner', 'fp_sw_corner'] },
  'fp_sw_corner': { id: 'fp_sw_corner', pos: [-R_FOOTPATH, 0.02, R_FOOTPATH], type: 'outer_footpath', neighbors: ['fp_south_mid', 'fp_west_mid'] },
  'fp_west_mid': { id: 'fp_west_mid', pos: [-R_FOOTPATH, 0.02, 0], type: 'outer_footpath', neighbors: ['gate_west', 'fp_sw_corner', 'fp_nw_corner'] },
  'fp_nw_corner': { id: 'fp_nw_corner', pos: [-R_FOOTPATH, 0.02, -R_FOOTPATH], type: 'outer_footpath', neighbors: ['fp_west_mid', 'fp_north_mid'] },

  // ------------------------------------------------------------
  // 5. DEDICATED CYCLING TRACK (Smooth continuous ring outside perimeter fence)
  // ------------------------------------------------------------
  'cycle_north_mid': { id: 'cycle_north_mid', pos: [0, 0.02, -13.2], type: 'cycle_lane', neighbors: ['cycle_ne_1', 'cycle_nw_2'] },
  'cycle_ne_1': { id: 'cycle_ne_1', pos: [12.0, 0.02, -13.2], type: 'cycle_lane', neighbors: ['cycle_north_mid', 'cycle_ne_2'] },
  'cycle_ne_2': { id: 'cycle_ne_2', pos: [13.2, 0.02, -12.0], type: 'cycle_lane', neighbors: ['cycle_ne_1', 'cycle_east_mid'] },
  'cycle_east_mid': { id: 'cycle_east_mid', pos: [13.2, 0.02, 0], type: 'cycle_lane', neighbors: ['cycle_ne_2', 'cycle_se_1'] },
  'cycle_se_1': { id: 'cycle_se_1', pos: [13.2, 0.02, 12.0], type: 'cycle_lane', neighbors: ['cycle_east_mid', 'cycle_se_2'] },
  'cycle_se_2': { id: 'cycle_se_2', pos: [12.0, 0.02, 13.2], type: 'cycle_lane', neighbors: ['cycle_se_1', 'cycle_south_mid'] },
  'cycle_south_mid': { id: 'cycle_south_mid', pos: [0, 0.02, 13.2], type: 'cycle_lane', neighbors: ['cycle_se_2', 'cycle_sw_1'] },
  'cycle_sw_1': { id: 'cycle_sw_1', pos: [-12.0, 0.02, 13.2], type: 'cycle_lane', neighbors: ['cycle_south_mid', 'cycle_sw_2'] },
  'cycle_sw_2': { id: 'cycle_sw_2', pos: [-13.2, 0.02, 12.0], type: 'cycle_lane', neighbors: ['cycle_sw_1', 'cycle_west_mid'] },
  'cycle_west_mid': { id: 'cycle_west_mid', pos: [-13.2, 0.02, 0], type: 'cycle_lane', neighbors: ['cycle_sw_2', 'cycle_nw_1'] },
  'cycle_nw_1': { id: 'cycle_nw_1', pos: [-13.2, 0.02, -12.0], type: 'cycle_lane', neighbors: ['cycle_west_mid', 'cycle_nw_2'] },
  'cycle_nw_2': { id: 'cycle_nw_2', pos: [-12.0, 0.02, -13.2], type: 'cycle_lane', neighbors: ['cycle_nw_1', 'cycle_north_mid'] },

  // ------------------------------------------------------------
  // 6. QUADRANT I: ACTIVE PLAYGROUND INTERNAL PATHS
  // ------------------------------------------------------------
  'qi_entrance': { id: 'qi_entrance', pos: [UNIT_SIZE * 1.5, 0.02, -UNIT_SIZE * 1.5], type: 'quadrant_path', neighbors: ['plaza_n', 'plaza_e', 'qi_play_mid'] },
  'qi_play_mid': { id: 'qi_play_mid', pos: [UNIT_SIZE * 3.0, 0.02, -UNIT_SIZE * 3.0], type: 'activity_spot', neighbors: ['qi_entrance', 'qi_play_swings', 'qi_play_slide', 'axis_y_n1'] },
  'qi_play_south': { id: 'qi_play_south', pos: [UNIT_SIZE * 3.2, 0.02, -UNIT_SIZE * 1.2], type: 'quadrant_path', neighbors: ['qi_play_mid', 'axis_x_e1'] },
  'qi_play_swings': { id: 'qi_play_swings', pos: [UNIT_SIZE * 3.2, 0.02, -UNIT_SIZE * 3.2], type: 'activity_spot', neighbors: ['qi_play_mid'] },
  'qi_play_slide': { id: 'qi_play_slide', pos: [UNIT_SIZE * 2.2, 0.02, -UNIT_SIZE * 3.8], type: 'activity_spot', neighbors: ['qi_play_mid'] },

  // ------------------------------------------------------------
  // 7. QUADRANT II: BOTANICAL GARDENS INTERNAL PATHS
  // ------------------------------------------------------------
  'qii_entrance': { id: 'qii_entrance', pos: [-UNIT_SIZE * 1.5, 0.02, -UNIT_SIZE * 1.5], type: 'quadrant_path', neighbors: ['plaza_n', 'plaza_w', 'qii_garden_mid'] },
  'qii_garden_mid': { id: 'qii_garden_mid', pos: [-UNIT_SIZE * 3.0, 0.02, -UNIT_SIZE * 3.0], type: 'activity_spot', neighbors: ['qii_entrance', 'qii_fountain', 'qii_gazebo', 'axis_y_n1'] },
  'qii_garden_south': { id: 'qii_garden_south', pos: [-UNIT_SIZE * 3.2, 0.02, -UNIT_SIZE * 1.2], type: 'quadrant_path', neighbors: ['qii_garden_mid', 'axis_x_w1'] },
  'qii_fountain': { id: 'qii_fountain', pos: [-UNIT_SIZE * 2.0, 0.02, -UNIT_SIZE * 3.8], type: 'activity_spot', neighbors: ['qii_garden_mid'] },
  'qii_gazebo': { id: 'qii_gazebo', pos: [-UNIT_SIZE * 3.6, 0.02, -UNIT_SIZE * 3.2], type: 'activity_spot', neighbors: ['qii_garden_mid'] },

  // ------------------------------------------------------------
  // 8. QUADRANT III: SPORTS COMPLEX INTERNAL PATHS
  // ------------------------------------------------------------
  'qiii_entrance': { id: 'qiii_entrance', pos: [-UNIT_SIZE * 1.5, 0.02, UNIT_SIZE * 1.5], type: 'quadrant_path', neighbors: ['plaza_s', 'plaza_w', 'qiii_sports_mid'] },
  'qiii_sports_mid': { id: 'qiii_sports_mid', pos: [-UNIT_SIZE * 3.0, 0.02, UNIT_SIZE * 3.0], type: 'activity_spot', neighbors: ['qiii_entrance', 'qiii_court', 'qiii_pitch', 'axis_y_s1'] },
  'qiii_sports_north': { id: 'qiii_sports_north', pos: [-UNIT_SIZE * 3.2, 0.02, UNIT_SIZE * 1.2], type: 'quadrant_path', neighbors: ['qiii_sports_mid', 'axis_x_w1'] },
  'qiii_court': { id: 'qiii_court', pos: [-UNIT_SIZE * 3.2, 0.02, UNIT_SIZE * 3.2], type: 'activity_spot', neighbors: ['qiii_sports_mid'] },
  'qiii_pitch': { id: 'qiii_pitch', pos: [-UNIT_SIZE * 2.2, 0.02, UNIT_SIZE * 3.8], type: 'activity_spot', neighbors: ['qiii_sports_mid'] },

  // ------------------------------------------------------------
  // 9. QUADRANT IV: PICNIC GROVE & RELAXATION INTERNAL PATHS
  // ------------------------------------------------------------
  'qiv_entrance': { id: 'qiv_entrance', pos: [UNIT_SIZE * 1.5, 0.02, UNIT_SIZE * 1.5], type: 'quadrant_path', neighbors: ['plaza_s', 'plaza_e', 'qiv_picnic_mid'] },
  'qiv_picnic_mid': { id: 'qiv_picnic_mid', pos: [UNIT_SIZE * 3.0, 0.02, UNIT_SIZE * 3.0], type: 'activity_spot', neighbors: ['qiv_entrance', 'qiv_tables', 'qiv_pond', 'axis_y_s1'] },
  'qiv_picnic_north': { id: 'qiv_picnic_north', pos: [UNIT_SIZE * 3.2, 0.02, UNIT_SIZE * 1.2], type: 'quadrant_path', neighbors: ['qiv_picnic_mid', 'axis_x_e1'] },
  'qiv_tables': { id: 'qiv_tables', pos: [UNIT_SIZE * 3.6, 0.02, UNIT_SIZE * 2.4], type: 'activity_spot', neighbors: ['qiv_picnic_mid'] },
  'qiv_pond': { id: 'qiv_pond', pos: [UNIT_SIZE * 2.2, 0.02, UNIT_SIZE * 3.8], type: 'activity_spot', neighbors: ['qiv_picnic_mid'] },
};

/**
 * Finds shortest route on the navigation graph using Breadth-First Search (BFS)
 */
export function findPath(startNodeId: string, targetNodeId: string): string[] {
  if (startNodeId === targetNodeId) return [startNodeId];
  if (!PARK_NAV_NODES[startNodeId] || !PARK_NAV_NODES[targetNodeId]) return [startNodeId];

  const queue: string[][] = [[startNodeId]];
  const visited = new Set<string>([startNodeId]);

  while (queue.length > 0) {
    const path = queue.shift()!;
    const current = path[path.length - 1];

    if (current === targetNodeId) {
      return path;
    }

    const neighbors = PARK_NAV_NODES[current]?.neighbors || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor) && PARK_NAV_NODES[neighbor]) {
        visited.add(neighbor);
        queue.push([...path, neighbor]);
      }
    }
  }

  return [startNodeId];
}

/**
 * Finds closest navigation node to a given 3D position
 */
export function getClosestNavNode(pos: [number, number, number], filterType?: NavNode['type']): string {
  let closestId = 'plaza_center';
  let minDist = Infinity;

  for (const [id, node] of Object.entries(PARK_NAV_NODES)) {
    if (filterType && node.type !== filterType) continue;
    const dx = node.pos[0] - pos[0];
    const dz = node.pos[2] - pos[2];
    const dist = dx * dx + dz * dz;
    if (dist < minDist) {
      minDist = dist;
      closestId = id;
    }
  }

  return closestId;
}

/**
 * Calculates smooth rotational heading towards target (facing forward)
 */
export function getHeadingAngle(fromPos: [number, number, number], toPos: [number, number, number]): number {
  const dx = toPos[0] - fromPos[0];
  const dz = toPos[2] - fromPos[2];
  if (Math.abs(dx) < 0.001 && Math.abs(dz) < 0.001) return 0;
  return Math.atan2(dx, dz);
}

/**
 * Smooth angle interpolation taking modular wrap into account
 */
export function lerpAngle(current: number, target: number, speed: number): number {
  let diff = target - current;
  while (diff < -Math.PI) diff += Math.PI * 2;
  while (diff > Math.PI) diff -= Math.PI * 2;
  return current + diff * Math.min(1, speed);
}
