// ============================================================
// PARK PLANNER — Master Citizen & Traffic Simulation Engine
// Updates NPC positions strictly along the waypoint network with realistic heading kinematics.
// Handles progressive crowd build-up outside gates during rounds 1-4,
// and Grand Opening entrance flood into playgrounds, botanical gardens, sports pitches, and picnic spots at Round 5.
// ============================================================

import { PARK_NAV_NODES, getHeadingAngle, lerpAngle } from './parkNavigation';

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
  shoesColor?: string;
  hairColor: string;
  skinColor: string;
  hasHelmet?: boolean;
  hasHeadband?: boolean;
  hasGuardUniform?: boolean;
  hasGuardCap?: boolean;
  waitingOriginPos?: [number, number, number];
  waitingRotationY?: number;
  targetActivity?: string;
}

// Master pool of citizens that progressively gather outside the park as questions are answered
const MASTER_CROWD_DEFINITIONS: Array<{
  id: string;
  name: string;
  type: SimCitizen['type'];
  spawnRound: number; // 1, 2, 3, or 4
  waitingPos: [number, number, number];
  waitingRotY: number;
  shirtColor: string;
  pantsColor: string;
  hairColor: string;
  skinColor: string;
  hasHeadband?: boolean;
  enterPath: string[];
  targetActivity: string;
  speed: number;
}> = [
  // ------------------------------------------------------------
  // ROUND 1 COHORT (Initial early birds waiting outside North Gate & Shops)
  // ------------------------------------------------------------
  {
    id: 'crowd_n_parent1',
    name: 'Elena (Parent)',
    type: 'parent',
    spawnRound: 1,
    waitingPos: [-0.6, 0.02, -15.5],
    waitingRotY: 0,
    shirtColor: '#059669',
    pantsColor: '#334155',
    hairColor: '#b45309',
    skinColor: '#fde047',
    enterPath: ['gate_north', 'axis_y_n2', 'axis_y_n1', 'qi_play_mid', 'qi_play_swings'],
    targetActivity: 'Watching kids on swings',
    speed: 1.15,
  },
  {
    id: 'crowd_n_kid1',
    name: 'Leo (Child)',
    type: 'child',
    spawnRound: 1,
    waitingPos: [-0.2, 0.02, -15.2],
    waitingRotY: 0,
    shirtColor: '#f59e0b',
    pantsColor: '#1d4ed8',
    hairColor: '#451a03',
    skinColor: '#fde047',
    enterPath: ['gate_north', 'axis_y_n2', 'axis_y_n1', 'qi_play_mid', 'qi_play_swings'],
    targetActivity: 'Playing on Swings',
    speed: 1.45,
  },
  {
    id: 'crowd_w_kid_balloon',
    name: 'Mia (Child)',
    type: 'child',
    spawnRound: 1,
    waitingPos: [-18.5, 0.02, -2.5],
    waitingRotY: Math.PI / 2,
    shirtColor: '#ec4899',
    pantsColor: '#475569',
    hairColor: '#eab308',
    skinColor: '#fcd34d',
    enterPath: ['fp_west_mid', 'gate_west', 'axis_x_w2', 'axis_x_w1', 'qii_garden_mid', 'qii_fountain'],
    targetActivity: 'Admiring Botanical Fountain',
    speed: 1.35,
  },
  {
    id: 'crowd_n_coffee',
    name: 'Dave (Citizen)',
    type: 'parent',
    spawnRound: 1,
    waitingPos: [-4.5, 0.02, -18.5],
    waitingRotY: 0.3,
    shirtColor: '#0284c7',
    pantsColor: '#1e293b',
    hairColor: '#1e293b',
    skinColor: '#fed7aa',
    enterPath: ['fp_north_mid', 'gate_north', 'axis_y_n2', 'axis_y_n1', 'plaza_n', 'plaza_center'],
    targetActivity: 'Enjoying Central Plaza',
    speed: 1.1,
  },

  // ------------------------------------------------------------
  // ROUND 2 COHORT (Botanical Garden Enthusiasts & Ice Cream Eaters)
  // ------------------------------------------------------------
  {
    id: 'crowd_w_botanist',
    name: 'Prof. Arthur (Botanist)',
    type: 'elderly',
    spawnRound: 2,
    waitingPos: [-15.5, 0.02, -0.4],
    waitingRotY: Math.PI / 2,
    shirtColor: '#475569',
    pantsColor: '#1e293b',
    hairColor: '#94a3b8',
    skinColor: '#fed7aa',
    enterPath: ['gate_west', 'axis_x_w2', 'axis_x_w1', 'qii_garden_mid', 'qii_gazebo'],
    targetActivity: 'Studying Botanical Garden',
    speed: 0.85,
  },
  {
    id: 'crowd_w_kid_gelato1',
    name: 'Lucas (Child)',
    type: 'child',
    spawnRound: 2,
    waitingPos: [-18.0, 0.02, 4.0],
    waitingRotY: -Math.PI / 2,
    shirtColor: '#10b981',
    pantsColor: '#1e3a8a',
    hairColor: '#78350f',
    skinColor: '#fcd34d',
    enterPath: ['fp_west_mid', 'gate_west', 'axis_x_w2', 'qii_garden_mid', 'qii_garden_south'],
    targetActivity: 'Exploring Flower Beds',
    speed: 1.4,
  },
  {
    id: 'crowd_w_kid_gelato2',
    name: 'Chloe (Child)',
    type: 'child',
    spawnRound: 2,
    waitingPos: [-18.0, 0.02, 4.6],
    waitingRotY: -Math.PI / 2,
    shirtColor: '#8b5cf6',
    pantsColor: '#334155',
    hairColor: '#ca8a04',
    skinColor: '#fed7aa',
    enterPath: ['fp_west_mid', 'gate_west', 'axis_x_w2', 'qii_garden_mid', 'qii_fountain'],
    targetActivity: 'Visiting Botanical Greenhouse',
    speed: 1.35,
  },
  {
    id: 'crowd_e_florist_shopper',
    name: 'Emma (Florist Fan)',
    type: 'parent',
    spawnRound: 2,
    waitingPos: [18.0, 0.02, -3.5],
    waitingRotY: -Math.PI / 2,
    shirtColor: '#f43f5e',
    pantsColor: '#0f172a',
    hairColor: '#172554',
    skinColor: '#fcd34d',
    enterPath: ['fp_east_mid', 'gate_east', 'axis_x_e2', 'axis_x_e1', 'qiv_picnic_mid', 'qiv_pond'],
    targetActivity: 'Strolling by Duck Pond',
    speed: 1.05,
  },

  // ------------------------------------------------------------
  // ROUND 3 COHORT (Sports Kids with Cricket & Football Gear + Families)
  // ------------------------------------------------------------
  {
    id: 'crowd_s_cricket_kid',
    name: 'Rahul (Cricket Batsman)',
    type: 'child',
    spawnRound: 3,
    waitingPos: [-0.6, 0.02, 15.5],
    waitingRotY: Math.PI,
    shirtColor: '#f8fafc',
    pantsColor: '#f8fafc',
    hairColor: '#0f172a',
    skinColor: '#d97706',
    enterPath: ['gate_south', 'axis_y_s2', 'axis_y_s1', 'qiii_sports_mid', 'qiii_pitch'],
    targetActivity: 'Batting in Cricket Ground',
    speed: 1.6,
  },
  {
    id: 'crowd_s_football_kid',
    name: 'Samir (Football Striker)',
    type: 'child',
    spawnRound: 3,
    waitingPos: [0.6, 0.02, 15.5],
    waitingRotY: Math.PI,
    shirtColor: '#ef4444',
    pantsColor: '#1e3a8a',
    hairColor: '#1c1917',
    skinColor: '#fcd34d',
    enterPath: ['gate_south', 'axis_y_s2', 'axis_y_s1', 'qiii_sports_mid', 'qiii_court'],
    targetActivity: 'Shooting in Football Pitch',
    speed: 1.65,
  },
  {
    id: 'crowd_e_parent',
    name: 'Nora (Picnic Mom)',
    type: 'parent',
    spawnRound: 3,
    waitingPos: [15.5, 0.02, 0.4],
    waitingRotY: -Math.PI / 2,
    shirtColor: '#0284c7',
    pantsColor: '#475569',
    hairColor: '#78350f',
    skinColor: '#fde047',
    enterPath: ['gate_east', 'axis_x_e2', 'axis_x_e1', 'qiv_picnic_mid', 'qiv_tables'],
    targetActivity: 'Setting up Picnic Table',
    speed: 1.1,
  },
  {
    id: 'crowd_e_kid',
    name: 'Ben (Child)',
    type: 'child',
    spawnRound: 3,
    waitingPos: [15.2, 0.02, 0.8],
    waitingRotY: -Math.PI / 2,
    shirtColor: '#f97316',
    pantsColor: '#1d4ed8',
    hairColor: '#451a03',
    skinColor: '#fde047',
    enterPath: ['gate_east', 'axis_x_e2', 'qiv_picnic_mid', 'qiv_tables'],
    targetActivity: 'Eating at Picnic Bench',
    speed: 1.3,
  },
  {
    id: 'crowd_s_fruit_citizen',
    name: 'Marcus (Sports Fan)',
    type: 'jogger',
    spawnRound: 3,
    waitingPos: [-5.0, 0.02, 18.0],
    waitingRotY: -Math.PI / 4,
    shirtColor: '#ea580c',
    pantsColor: '#0f172a',
    hairColor: '#000000',
    skinColor: '#fcd34d',
    hasHeadband: true,
    enterPath: ['fp_south_mid', 'gate_south', 'axis_y_s2', 'axis_y_s1', 'plaza_s', 'plaza_center'],
    targetActivity: 'Watching Sports Matches',
    speed: 1.7,
  },

  // ------------------------------------------------------------
  // ROUND 4 COHORT (Full Grand Opening Crowd Gathering at Gates)
  // ------------------------------------------------------------
  {
    id: 'crowd_n_kid2',
    name: 'Zoe (Slide Fan)',
    type: 'child',
    spawnRound: 4,
    waitingPos: [0.5, 0.02, -15.0],
    waitingRotY: 0,
    shirtColor: '#a855f7',
    pantsColor: '#1e3a8a',
    hairColor: '#ca8a04',
    skinColor: '#fed7aa',
    enterPath: ['gate_north', 'axis_y_n2', 'qi_play_mid', 'qi_play_slide'],
    targetActivity: 'Riding Spiral Slide',
    speed: 1.5,
  },
  {
    id: 'crowd_n_family_dad',
    name: 'Daniel (Dad)',
    type: 'parent',
    spawnRound: 4,
    waitingPos: [1.2, 0.02, -16.0],
    waitingRotY: -0.1,
    shirtColor: '#0d9488',
    pantsColor: '#1e293b',
    hairColor: '#1c1917',
    skinColor: '#fcd34d',
    enterPath: ['gate_north', 'axis_y_n2', 'qi_play_mid', 'qi_play_south'],
    targetActivity: 'Relaxing at Playground Bench',
    speed: 1.1,
  },
  {
    id: 'crowd_n_family_mom',
    name: 'Anna (Mom)',
    type: 'parent',
    spawnRound: 4,
    waitingPos: [1.6, 0.02, -16.0],
    waitingRotY: -0.1,
    shirtColor: '#db2777',
    pantsColor: '#334155',
    hairColor: '#92400e',
    skinColor: '#fde047',
    enterPath: ['gate_north', 'axis_y_n2', 'qi_play_mid', 'qi_play_south'],
    targetActivity: 'Cheering for children',
    speed: 1.1,
  },
  {
    id: 'crowd_n_family_kid',
    name: 'Lily (Child)',
    type: 'child',
    spawnRound: 4,
    waitingPos: [1.4, 0.02, -15.5],
    waitingRotY: 0,
    shirtColor: '#38bdf8',
    pantsColor: '#0f172a',
    hairColor: '#b45309',
    skinColor: '#fcd34d',
    enterPath: ['gate_north', 'axis_y_n2', 'qi_play_mid', 'qi_play_swings'],
    targetActivity: 'Riding Playground Swings',
    speed: 1.45,
  },
  {
    id: 'crowd_w_fountain_fan',
    name: 'Victor (Visitor)',
    type: 'elderly',
    spawnRound: 4,
    waitingPos: [-15.0, 0.02, 0.5],
    waitingRotY: Math.PI / 2,
    shirtColor: '#16a34a',
    pantsColor: '#334155',
    hairColor: '#e2e8f0',
    skinColor: '#fde047',
    enterPath: ['gate_west', 'axis_x_w2', 'axis_x_w1', 'plaza_w', 'plaza_center'],
    targetActivity: 'Viewing Grand Tiered Fountain',
    speed: 0.9,
  },
  {
    id: 'crowd_s_cricket_bowler',
    name: 'Dev (Cricket Bowler)',
    type: 'child',
    spawnRound: 4,
    waitingPos: [-1.2, 0.02, 16.0],
    waitingRotY: Math.PI,
    shirtColor: '#f8fafc',
    pantsColor: '#f8fafc',
    hairColor: '#1e293b',
    skinColor: '#d97706',
    enterPath: ['gate_south', 'axis_y_s2', 'qiii_sports_mid', 'qiii_pitch'],
    targetActivity: 'Bowling in Cricket Match',
    speed: 1.6,
  },
  {
    id: 'crowd_s_football_mid',
    name: 'Aarav (Football Midfielder)',
    type: 'child',
    spawnRound: 4,
    waitingPos: [1.2, 0.02, 16.0],
    waitingRotY: Math.PI,
    shirtColor: '#3b82f6',
    pantsColor: '#1e293b',
    hairColor: '#0f172a',
    skinColor: '#fcd34d',
    enterPath: ['gate_south', 'axis_y_s2', 'qiii_sports_mid', 'qiii_court'],
    targetActivity: 'Passing in Football Pitch',
    speed: 1.6,
  },
  {
    id: 'crowd_e_couple1',
    name: 'Oliver (Picnicker)',
    type: 'parent',
    spawnRound: 4,
    waitingPos: [16.0, 0.02, -0.6],
    waitingRotY: -Math.PI / 2,
    shirtColor: '#e11d48',
    pantsColor: '#1e293b',
    hairColor: '#451a03',
    skinColor: '#fde047',
    enterPath: ['gate_east', 'axis_x_e2', 'axis_x_e1', 'qiv_picnic_mid', 'qiv_tables'],
    targetActivity: 'Picnicking under Shady Tree',
    speed: 1.1,
  },
  {
    id: 'crowd_e_couple2',
    name: 'Sophie (Picnicker)',
    type: 'parent',
    spawnRound: 4,
    waitingPos: [16.0, 0.02, -1.0],
    waitingRotY: -Math.PI / 2,
    shirtColor: '#ca8a04',
    pantsColor: '#334155',
    hairColor: '#78350f',
    skinColor: '#fed7aa',
    enterPath: ['gate_east', 'axis_x_e2', 'axis_x_e1', 'qiv_picnic_mid', 'qiv_pond'],
    targetActivity: 'Lakeside Walking & Relaxing',
    speed: 1.05,
  },
];

export class ParkSimulationEngine {
  private citizens: SimCitizen[] = [];
  private currentSpawnedRound: number = 0;
  private grandOpeningTriggered: boolean = false;

  constructor() {
    this.initPersistentCirculation();
  }

  /**
   * Initializes continuous outer traffic (Cyclist strictly on outer R=13.2m cycle lane, Jogger on sidewalk)
   */
  private initPersistentCirculation() {
    // 1. Dedicated Cyclist on outer cycle ring (continuous clockwise circulation at R=13.2m outside perimeter fence)
    const cycleLoop = [
      'cycle_north_mid',
      'cycle_ne_1',
      'cycle_ne_2',
      'cycle_east_mid',
      'cycle_se_1',
      'cycle_se_2',
      'cycle_south_mid',
      'cycle_sw_1',
      'cycle_sw_2',
      'cycle_west_mid',
      'cycle_nw_1',
      'cycle_nw_2',
      'cycle_north_mid',
    ];

    this.citizens.push({
      id: 'cyclist_1',
      name: 'Alex (Cyclist)',
      type: 'cyclist',
      pos: [...PARK_NAV_NODES['cycle_north_mid'].pos],
      rotationY: Math.PI / 2,
      speed: 1.8,
      currentPath: [...cycleLoop],
      pathIndex: 0,
      segmentProgress: 0,
      state: 'cycling',
      restTimer: 0,
      shirtColor: '#0284c7',
      pantsColor: '#0f172a',
      hairColor: '#1e293b',
      skinColor: '#fcd34d',
      hasHelmet: true,
    });

    // 2. Jogger on outer promenade loop (continuous counter-clockwise circulation at R=13.92m outside perimeter fence)
    const joggerPath = [
      'fp_north_mid',
      'fp_nw_corner',
      'fp_west_mid',
      'fp_sw_corner',
      'fp_south_mid',
      'fp_se_corner',
      'fp_east_mid',
      'fp_ne_corner',
      'fp_north_mid',
    ];

    this.citizens.push({
      id: 'jogger_1',
      name: 'Maya (Jogger)',
      type: 'jogger',
      pos: [...PARK_NAV_NODES['fp_north_mid'].pos],
      rotationY: -Math.PI / 2,
      speed: 2.0,
      currentPath: [...joggerPath],
      pathIndex: 0,
      segmentProgress: 0,
      state: 'jogging',
      restTimer: 0,
      shirtColor: '#ec4899',
      pantsColor: '#1e3a8a',
      hairColor: '#78350f',
      skinColor: '#fcd34d',
      hasHeadband: true,
    });

    // 3. Dedicated Park Ranger / Security Guard taking care of all quadrants & Origin Plaza
    const guardPatrolRoute = [
      'gate_north',
      'axis_y_n2',
      'axis_y_n1',
      'qi_play_mid',
      'axis_y_n1',
      'plaza_n',
      'plaza_center',
      'plaza_e',
      'axis_x_e1',
      'qiv_picnic_mid',
      'axis_x_e1',
      'plaza_e',
      'plaza_center',
      'plaza_s',
      'axis_y_s1',
      'qiii_sports_mid',
      'axis_y_s1',
      'plaza_s',
      'plaza_center',
      'plaza_w',
      'axis_x_w1',
      'qii_garden_mid',
      'axis_x_w1',
      'plaza_w',
      'plaza_center',
      'plaza_n',
      'axis_y_n1',
      'axis_y_n2',
      'gate_north',
    ];

    this.citizens.push({
      id: 'park_guard_1',
      name: 'Officer Davis (Park Ranger)',
      type: 'worker',
      pos: [...PARK_NAV_NODES['gate_north'].pos],
      rotationY: Math.PI,
      speed: 1.1,
      currentPath: [...guardPatrolRoute],
      pathIndex: 0,
      segmentProgress: 0,
      state: 'walking',
      restTimer: 0,
      shirtColor: '#166534',
      pantsColor: '#1e293b',
      shoesColor: '#0f172a',
      hairColor: '#1e293b',
      skinColor: '#fed7aa',
      hasGuardUniform: true,
      hasGuardCap: true,
    });
  }

  /**
   * Dynamically spawns outside waiting crowd matching current question round (1 to 4)
   * and opens park gates at Round 5 (Grand Opening) streaming everyone inside!
   */
  public updateRoundCrowd(round: number, isGrandOpening: boolean) {
    // 1. Check for Grand Opening trigger (Round 5 or isGrandOpening flag)
    if ((round >= 5 || isGrandOpening) && !this.grandOpeningTriggered) {
      this.triggerGrandOpening();
      return;
    }

    // 2. Progressively spawn waiting crowd for rounds 1..4 if not yet spawned
    if (round > this.currentSpawnedRound && !this.grandOpeningTriggered) {
      for (let r = this.currentSpawnedRound + 1; r <= Math.min(4, round); r++) {
        const cohort = MASTER_CROWD_DEFINITIONS.filter((def) => def.spawnRound === r);
        for (const def of cohort) {
          if (!this.citizens.some((c) => c.id === def.id)) {
            this.citizens.push({
              id: def.id,
              name: def.name,
              type: def.type,
              pos: [...def.waitingPos],
              rotationY: def.waitingRotY,
              speed: def.speed,
              currentPath: [], // Not moving yet, waiting outside closed gates
              pathIndex: 0,
              segmentProgress: 0,
              state: 'resting',
              restTimer: 999999, // Waiting outside until Grand Opening
              shirtColor: def.shirtColor,
              pantsColor: def.pantsColor,
              hairColor: def.hairColor,
              skinColor: def.skinColor,
              hasHeadband: def.hasHeadband,
              waitingOriginPos: [...def.waitingPos],
              waitingRotationY: def.waitingRotY,
              targetActivity: def.targetActivity,
            });
          }
        }
      }
      this.currentSpawnedRound = Math.min(4, round);
    }
  }

  /**
   * Triggers the Grand Park Opening: Gates open and all waiting citizens stream inside
   * to play cricket, football, swings, slide, explore botanical conservatory, picnic, and gather at fountain!
   */
  public triggerGrandOpening() {
    this.grandOpeningTriggered = true;

    // Ensure all 20 citizens exist in the simulation
    for (const def of MASTER_CROWD_DEFINITIONS) {
      let citizen = this.citizens.find((c) => c.id === def.id);
      if (!citizen) {
        citizen = {
          id: def.id,
          name: def.name,
          type: def.type,
          pos: [...def.waitingPos],
          rotationY: def.waitingRotY,
          speed: def.speed,
          currentPath: [],
          pathIndex: 0,
          segmentProgress: 0,
          state: 'resting',
          restTimer: 0,
          shirtColor: def.shirtColor,
          pantsColor: def.pantsColor,
          hairColor: def.hairColor,
          skinColor: def.skinColor,
          hasHeadband: def.hasHeadband,
          waitingOriginPos: [...def.waitingPos],
          waitingRotationY: def.waitingRotY,
          targetActivity: def.targetActivity,
        };
        this.citizens.push(citizen);
      }

      // Transition from waiting outside to streaming inside through open gates
      citizen.currentPath = [...def.enterPath];
      citizen.pathIndex = 0;
      citizen.segmentProgress = 0;
      citizen.state = def.type === 'child' ? 'jogging' : 'walking';
      citizen.restTimer = 0;
    }
  }

  public getCitizens(): SimCitizen[] {
    return this.citizens;
  }

  public resetSimulation() {
    this.citizens = [];
    this.currentSpawnedRound = 0;
    this.grandOpeningTriggered = false;
    this.initPersistentCirculation();
  }

  public update(delta: number) {
    const clampedDelta = Math.min(0.08, delta);

    for (const citizen of this.citizens) {
      // Resting / Waiting state handling
      if (citizen.state === 'resting') {
        if (citizen.restTimer > 1000) {
          // Waiting outside closed gate: keep position on sidewalk
          continue;
        }

        citizen.restTimer -= clampedDelta;
        if (citizen.restTimer <= 0) {
          citizen.state = citizen.type === 'child' ? 'jogging' : 'walking';
          // Reverse route to stroll back through the park or loop
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
      const maxIndex = path.length - 1;

      if (citizen.pathIndex >= maxIndex) {
        if (isLoop) {
          citizen.pathIndex = 0;
          citizen.segmentProgress = 0;
        } else {
          // Reached attraction destination (swings, slides, cricket pitch, football pitch, gazebo, picnic table)
          citizen.state = 'resting';
          citizen.restTimer = 15.0; // Enjoy the activity!
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
      citizen.rotationY = lerpAngle(citizen.rotationY, targetAngle, clampedDelta * 7);

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
            // Arrived at destination in park
            citizen.state = 'resting';
            citizen.restTimer = 20.0;
          }
        } else if (toNode.type === 'activity_spot' && citizen.type !== 'cyclist') {
          // Brief pause at attraction spot before continuing
          citizen.state = 'resting';
          citizen.restTimer = 4.0;
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
