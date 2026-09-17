// ============================================================
// PARK PLANNER — Master Citizen & Traffic Simulation Engine
// Updates NPC positions strictly along the waypoint network with realistic heading kinematics
// ============================================================

import { PARK_NAV_NODES, findPath, getHeadingAngle, lerpAngle } from './parkNavigation';

export interface SimCitizen {
  id: string;
  name: string;
  type: 'child' | 'parent' | 'elderly' | 'jogger' | 'cyclist' | 'worker';
  pos: [number, number, number];
  rotationY: number;
  speed: number;
  currentPath: string[]; // List of NavNode IDs
  pathIndex: number;
  segmentProgress: number; // 0 to 1 between currentPath[pathIndex] and currentPath[pathIndex+1]
  state: 'walking' | 'jogging' | 'cycling' | 'resting' | 'playing' | 'constructing';
  restTimer: number;
  shirtColor: string;
  pantsColor: string;
  hairColor: string;
  skinColor: string;
}

export class ParkSimulationEngine {
  private citizens: SimCitizen[] = [];

  constructor() {
    this.initCitizens();
  }

  private initCitizens() {
    // 1. Dedicated Cyclist on outer cycle ring
    const cycleLoop = [
      'cycle_north_mid',
      'cycle_ne',
      'cycle_east_mid',
      'cycle_se',
      'cycle_south_mid',
      'cycle_sw',
      'cycle_west_mid',
      'cycle_nw',
      'cycle_north_mid',
    ];
    this.citizens.push({
      id: 'cyclist_1',
      name: 'Alex (Cyclist)',
      type: 'cyclist',
      pos: [...PARK_NAV_NODES['cycle_north_mid'].pos],
      rotationY: Math.PI / 2,
      speed: 3.2,
      currentPath: [...cycleLoop],
      pathIndex: 0,
      segmentProgress: 0,
      state: 'cycling',
      restTimer: 0,
      shirtColor: '#0284c7',
      pantsColor: '#0f172a',
      hairColor: '#1e293b',
      skinColor: '#fcd34d',
    });

    // 2. Jogger on outer promenade loop
    const joggerPath = [
      'fp_north_mid',
      'fp_ne_corner',
      'fp_east_mid',
      'fp_se_corner',
      'fp_south_mid',
      'fp_sw_corner',
      'fp_west_mid',
      'fp_nw_corner',
      'fp_north_mid',
    ];
    this.citizens.push({
      id: 'jogger_1',
      name: 'Maya (Jogger)',
      type: 'jogger',
      pos: [...PARK_NAV_NODES['fp_north_mid'].pos],
      rotationY: Math.PI / 2,
      speed: 2.4,
      currentPath: [...joggerPath],
      pathIndex: 0,
      segmentProgress: 0,
      state: 'jogging',
      restTimer: 0,
      shirtColor: '#ec4899',
      pantsColor: '#1e3a8a',
      hairColor: '#78350f',
      skinColor: '#fcd34d',
    });

    // 3. Parent & Child visiting Quadrant I Playground
    const playgroundPath = [
      'gate_north',
      'axis_y_n2',
      'axis_y_n1',
      'qi_play_mid',
      'qi_play_swings',
      'qi_play_mid',
      'plaza_n',
      'plaza_center',
    ];
    this.citizens.push({
      id: 'parent_1',
      name: 'Elena (Parent)',
      type: 'parent',
      pos: [...PARK_NAV_NODES['gate_north'].pos],
      rotationY: Math.PI,
      speed: 1.1,
      currentPath: [...playgroundPath],
      pathIndex: 0,
      segmentProgress: 0,
      state: 'walking',
      restTimer: 0,
      shirtColor: '#059669',
      pantsColor: '#334155',
      hairColor: '#b45309',
      skinColor: '#fde047',
    });

    this.citizens.push({
      id: 'child_1',
      name: 'Leo (Child)',
      type: 'child',
      pos: [
        PARK_NAV_NODES['gate_north'].pos[0] + 0.4,
        0.02,
        PARK_NAV_NODES['gate_north'].pos[2] + 0.2,
      ],
      rotationY: Math.PI,
      speed: 1.2,
      currentPath: [...playgroundPath],
      pathIndex: 0,
      segmentProgress: 0,
      state: 'walking',
      restTimer: 0,
      shirtColor: '#f59e0b',
      pantsColor: '#1d4ed8',
      hairColor: '#451a03',
      skinColor: '#fde047',
    });

    // 4. Elderly visitor walking through Quadrant II Botanical Garden to Central Plaza
    const gardenWalkPath = [
      'gate_west',
      'axis_x_w2',
      'axis_x_w1',
      'qii_garden_mid',
      'qii_fountain',
      'qii_garden_mid',
      'plaza_w',
      'plaza_center',
    ];
    this.citizens.push({
      id: 'elder_1',
      name: 'Arthur (Elderly Visitor)',
      type: 'elderly',
      pos: [...PARK_NAV_NODES['gate_west'].pos],
      rotationY: 0,
      speed: 0.75,
      currentPath: [...gardenWalkPath],
      pathIndex: 0,
      segmentProgress: 0,
      state: 'walking',
      restTimer: 0,
      shirtColor: '#475569',
      pantsColor: '#1e293b',
      hairColor: '#94a3b8',
      skinColor: '#fed7aa',
    });
  }

  public getCitizens(): SimCitizen[] {
    return this.citizens;
  }

  public update(delta: number) {
    const clampedDelta = Math.min(0.1, delta);

    for (const citizen of this.citizens) {
      if (citizen.state === 'resting') {
        citizen.restTimer -= clampedDelta;
        if (citizen.restTimer <= 0) {
          citizen.state = citizen.type === 'jogger' ? 'jogging' : 'walking';
        }
        continue;
      }

      const path = citizen.currentPath;
      if (path.length < 2) continue;

      const fromNodeId = path[citizen.pathIndex];
      const toNodeId = path[(citizen.pathIndex + 1) % path.length];
      const fromNode = PARK_NAV_NODES[fromNodeId];
      const toNode = PARK_NAV_NODES[toNodeId];

      if (!fromNode || !toNode) continue;

      const dx = toNode.pos[0] - fromNode.pos[0];
      const dz = toNode.pos[2] - fromNode.pos[2];
      const segmentDist = Math.sqrt(dx * dx + dz * dz) || 1;

      // Target heading angle (always facing movement vector forward)
      const targetAngle = getHeadingAngle(fromNode.pos, toNode.pos);
      citizen.rotationY = lerpAngle(citizen.rotationY, targetAngle, clampedDelta * 6);

      // Advance along path segment
      const progressInc = (citizen.speed * clampedDelta) / segmentDist;
      citizen.segmentProgress += progressInc;

      if (citizen.segmentProgress >= 1) {
        citizen.segmentProgress = 0;
        citizen.pathIndex = (citizen.pathIndex + 1) % (path.length - 1);

        // Pause briefly at activity spots (e.g. playground, fountain, plaza)
        if (toNode.type === 'activity_spot' && citizen.type !== 'cyclist') {
          citizen.state = 'resting';
          citizen.restTimer = 4.0;
        }
      }

      // Smooth interpolation of position along segment
      const t = citizen.segmentProgress;
      citizen.pos[0] = fromNode.pos[0] + dx * t;
      citizen.pos[1] = fromNode.pos[1];
      citizen.pos[2] = fromNode.pos[2] + dz * t;
    }
  }
}

export const globalParkSim = new ParkSimulationEngine();
