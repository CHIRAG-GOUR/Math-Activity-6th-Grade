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
    // 1. Dedicated Cyclist on outer cycle ring (continuous clockwise circulation)
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
      speed: 3.4,
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

    // 2. Jogger on outer promenade loop (continuous counter-clockwise circulation)
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
      speed: 2.2,
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
  }

  public triggerGrandOpening() {
    // Check if grand opening cohort is already spawned
    if (this.citizens.some((c) => c.id.startsWith('go_'))) return;

    // Grand Opening Influx: Diverse citizens streaming in through open North, South, East, West gates
    const goPathPlayground1 = [
      'gate_north',
      'axis_y_n2',
      'axis_y_n1',
      'qi_play_mid',
      'qi_play_swings',
      'qi_play_mid',
      'plaza_n',
      'plaza_center',
    ];
    const goPathPlayground2 = [
      'gate_north',
      'axis_y_n2',
      'qi_play_mid',
      'qi_play_slide',
      'qi_play_mid',
      'qi_entrance',
      'plaza_n',
    ];
    const goPathBotanical = [
      'gate_west',
      'axis_x_w2',
      'axis_x_w1',
      'qii_garden_mid',
      'qii_fountain',
      'qii_gazebo',
      'qii_garden_mid',
      'plaza_w',
      'plaza_center',
    ];
    const goPathSports = [
      'gate_south',
      'axis_y_s2',
      'axis_y_s1',
      'qiii_sports_mid',
      'qiii_court',
      'qiii_pitch',
      'qiii_sports_mid',
      'plaza_s',
      'plaza_center',
    ];
    const goPathPicnic = [
      'gate_east',
      'axis_x_e2',
      'axis_x_e1',
      'qiv_picnic_mid',
      'qiv_tables',
      'qiv_pond',
      'qiv_picnic_mid',
      'plaza_e',
      'plaza_center',
    ];
    const goPathPlazaFountain = [
      'gate_south',
      'axis_y_s2',
      'axis_y_s1',
      'plaza_s',
      'plaza_center',
    ];

    this.citizens.push(
      // Parent & Child visiting Playground
      {
        id: 'go_parent_1',
        name: 'Elena (Parent)',
        type: 'parent',
        pos: [...PARK_NAV_NODES['gate_north'].pos],
        rotationY: Math.PI,
        speed: 1.1,
        currentPath: [...goPathPlayground1],
        pathIndex: 0,
        segmentProgress: 0,
        state: 'walking',
        restTimer: 0,
        shirtColor: '#059669',
        pantsColor: '#334155',
        hairColor: '#b45309',
        skinColor: '#fde047',
      },
      {
        id: 'go_child_1',
        name: 'Leo (Child)',
        type: 'child',
        pos: [
          PARK_NAV_NODES['gate_north'].pos[0] + 0.4,
          0.02,
          PARK_NAV_NODES['gate_north'].pos[2] + 0.2,
        ],
        rotationY: Math.PI,
        speed: 1.25,
        currentPath: [...goPathPlayground1],
        pathIndex: 0,
        segmentProgress: 0,
        state: 'walking',
        restTimer: 0,
        shirtColor: '#f59e0b',
        pantsColor: '#1d4ed8',
        hairColor: '#451a03',
        skinColor: '#fde047',
      },
      // Second child rushing to the slide
      {
        id: 'go_child_2',
        name: 'Zoe (Child)',
        type: 'child',
        pos: [
          PARK_NAV_NODES['gate_north'].pos[0] - 0.4,
          0.02,
          PARK_NAV_NODES['gate_north'].pos[2] + 0.5,
        ],
        rotationY: Math.PI,
        speed: 1.45,
        currentPath: [...goPathPlayground2],
        pathIndex: 0,
        segmentProgress: 0,
        state: 'jogging',
        restTimer: 0,
        shirtColor: '#a855f7',
        pantsColor: '#1e3a8a',
        hairColor: '#ca8a04',
        skinColor: '#fed7aa',
      },
      // Elderly visitor exploring Botanical Garden
      {
        id: 'go_elder_1',
        name: 'Arthur (Botanist)',
        type: 'elderly',
        pos: [...PARK_NAV_NODES['gate_west'].pos],
        rotationY: 0,
        speed: 0.8,
        currentPath: [...goPathBotanical],
        pathIndex: 0,
        segmentProgress: 0,
        state: 'walking',
        restTimer: 0,
        shirtColor: '#475569',
        pantsColor: '#1e293b',
        hairColor: '#94a3b8',
        skinColor: '#fed7aa',
      },
      // Teenager heading to Sports grounds
      {
        id: 'go_teen_1',
        name: 'Jordan (Sports Enthusiast)',
        type: 'jogger',
        pos: [...PARK_NAV_NODES['gate_south'].pos],
        rotationY: 0,
        speed: 1.8,
        currentPath: [...goPathSports],
        pathIndex: 0,
        segmentProgress: 0,
        state: 'jogging',
        restTimer: 0,
        shirtColor: '#f97316',
        pantsColor: '#0f172a',
        hairColor: '#000000',
        skinColor: '#fcd34d',
      },
      // Family heading to Picnic Grove
      {
        id: 'go_parent_2',
        name: 'Carlos (Picnicker)',
        type: 'parent',
        pos: [...PARK_NAV_NODES['gate_east'].pos],
        rotationY: -Math.PI / 2,
        speed: 1.05,
        currentPath: [...goPathPicnic],
        pathIndex: 0,
        segmentProgress: 0,
        state: 'walking',
        restTimer: 0,
        shirtColor: '#0284c7',
        pantsColor: '#334155',
        hairColor: '#451a03',
        skinColor: '#d97706',
      },
      // Senior visiting Central Fountain
      {
        id: 'go_elder_2',
        name: 'Grace (Visitor)',
        type: 'elderly',
        pos: [
          PARK_NAV_NODES['gate_south'].pos[0] + 0.35,
          0.02,
          PARK_NAV_NODES['gate_south'].pos[2] - 0.2,
        ],
        rotationY: 0,
        speed: 0.85,
        currentPath: [...goPathPlazaFountain],
        pathIndex: 0,
        segmentProgress: 0,
        state: 'walking',
        restTimer: 0,
        shirtColor: '#10b981',
        pantsColor: '#475569',
        hairColor: '#e2e8f0',
        skinColor: '#fde047',
      }
    );
  }

  public getCitizens(): SimCitizen[] {
    return this.citizens;
  }

  public update(delta: number) {
    const clampedDelta = Math.min(0.08, delta);

    for (const citizen of this.citizens) {
      if (citizen.state === 'resting') {
        citizen.restTimer -= clampedDelta;
        if (citizen.restTimer <= 0) {
          citizen.state = citizen.type === 'jogger' ? 'jogging' : 'walking';
          // Reverse route to stroll back through the park
          if (citizen.currentPath.length > 2) {
            citizen.currentPath.reverse();
            citizen.pathIndex = 0;
            citizen.segmentProgress = 0;
          }
        }
        continue;
      }

      const path = citizen.currentPath;
      if (path.length < 2) continue;

      const isLoop = path[0] === path[path.length - 1];
      const maxIndex = isLoop ? path.length - 1 : path.length - 1;

      if (citizen.pathIndex >= maxIndex) {
        if (isLoop) {
          citizen.pathIndex = 0;
          citizen.segmentProgress = 0;
        } else {
          // Reached destination: pause and enjoy
          citizen.state = 'resting';
          citizen.restTimer = 8.0;
          continue;
        }
      }

      const fromNodeId = path[citizen.pathIndex];
      const nextIndex = (citizen.pathIndex + 1) % path.length;
      const toNodeId = path[nextIndex];

      const fromNode = PARK_NAV_NODES[fromNodeId];
      const toNode = PARK_NAV_NODES[toNodeId];

      if (!fromNode || !toNode) continue;

      const dx = toNode.pos[0] - fromNode.pos[0];
      const dz = toNode.pos[2] - fromNode.pos[2];
      const segmentDist = Math.sqrt(dx * dx + dz * dz) || 1;

      // Target heading angle (facing forward along movement vector)
      const targetAngle = getHeadingAngle(fromNode.pos, toNode.pos);
      citizen.rotationY = lerpAngle(citizen.rotationY, targetAngle, clampedDelta * 6);

      // Advance along current segment
      const progressInc = (citizen.speed * clampedDelta) / segmentDist;
      citizen.segmentProgress += progressInc;

      if (citizen.segmentProgress >= 1) {
        citizen.segmentProgress = 0;
        citizen.pathIndex += 1;

        if (citizen.pathIndex >= maxIndex) {
          if (isLoop) {
            citizen.pathIndex = 0;
          } else {
            // Arrived at destination
            citizen.state = 'resting';
            citizen.restTimer = 6.0;
          }
        } else if (toNode.type === 'activity_spot' && citizen.type !== 'cyclist') {
          // Brief pause at attraction spot before continuing
          citizen.state = 'resting';
          citizen.restTimer = 3.5;
        }
      }

      // Smooth interpolation of position along segment
      const t = Math.min(1, Math.max(0, citizen.segmentProgress));
      citizen.pos[0] = fromNode.pos[0] + dx * t;
      citizen.pos[1] = fromNode.pos[1];
      citizen.pos[2] = fromNode.pos[2] + dz * t;
    }
  }
}

export const globalParkSim = new ParkSimulationEngine();
