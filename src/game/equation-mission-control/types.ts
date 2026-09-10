// ============================================================
// EQUATION MISSION CONTROL — Type Definitions
// Grade 6: Expressions, Formulae & Equations
// 2-Team Interactive 3D Daytime Space Launch Facility
// ============================================================

export type TeamId = 'blue' | 'red';

export type MissionStageId =
  | 'config'       // Stage 1: Expression Assembly
  | 'fuel'         // Stage 2: Variable Loading
  | 'engine'       // Stage 3: Equation Balance
  | 'navigation'   // Stage 4: Launch Calibration
  | 'launch';      // Stage 5: Final Launch Equation & Arming

export type StageIndex = 0 | 1 | 2 | 3 | 4;

export type GamePhase =
  | 'title'              // Title & Team Name Customization Screen
  | 'stage-intro'        // Stage Directive Modal
  | 'active-mission'     // Active Simultaneous Dual-Console Math Operations
  | 'solution-reveal'    // Step-by-Step Telemetry Reveal & Mathematical Proof
  | 'countdown'          // Final 5-4-3-2-1 Ignition Countdown
  | 'launch-cinematic'   // 12-Step Full Cinematic Spacecraft Liftoff into Bright Blue Sky
  | 'mission-report';    // Final Aerospace Mission Success Certificate & Scores

export type LaunchStep =
  | 'idle'
  | 'arming'
  | 'hazard-lights'
  | 'umbilical-retract'
  | 'fuel-decouple'
  | 'clamp-release'
  | 'ignition'
  | 'thrust-ramp'
  | 'liftoff'
  | 'tower-clear'
  | 'sky-ascent'
  | 'cloud-entry'
  | 'orbital-insertion'
  | 'complete';

export interface Stage1Data {
  targetExpression: string; // e.g. "3x + 5"
  wordDescription: string;  // e.g. "5 more than 3 times a number"
  availableTiles: string[]; // e.g. ["3", "x", "+", "5", "-", "2", "×"]
  correctTokens: string[];  // e.g. ["3", "x", "+", "5"] or alternative valid forms
}

export interface Stage2Data {
  formula: string;          // e.g. "F = 3x + 20"
  variableName: string;     // e.g. "x"
  variableValue: number;    // e.g. 10
  targetResult: number;     // e.g. 50
  steps: {
    label: string;
    substText: string;
    calcValue: number;
  }[];
}

export interface Stage3Data {
  equationDisplay: string;  // e.g. "x + 7 = 15"
  initialLeftDisplay: string; // e.g. "x + 7"
  initialRightValue: number;  // e.g. 15
  requiredOp: '+' | '-' | '×' | '÷';
  requiredVal: number;      // e.g. 7
  solutionX: number;        // e.g. 8
  explanation: string;      // e.g. "Subtract 7 from both sides: x + 7 - 7 = 15 - 7  ->  x = 8"
}

export interface Stage4Data {
  formulaName: string;      // e.g. "Orbital Velocity Formula (D = S × T)"
  speedGiven: number;       // e.g. 12
  speedUnit: string;        // e.g. "km/s"
  timeGiven: number;        // e.g. 3
  timeUnit: string;         // e.g. "seconds"
  targetDistance: number;   // e.g. 36
  distanceUnit: string;     // e.g. "km"
  calculationString: string; // e.g. "12 km/s × 3 s = 36 km"
}

export interface Stage5Data {
  equationDisplay: string;  // e.g. "2x + 4 = 14"
  correctX: number;         // e.g. 5
  step1: string;            // e.g. "Subtract 4: 2x = 10"
  step2: string;            // e.g. "Divide by 2: x = 5"
}

export interface MissionChallenge {
  id: string;
  stageId: MissionStageId;
  stageIndex: StageIndex;
  stageTitle: string;
  stageSubtitle: string;
  missionCode: string;
  bloomLevel: 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create';
  points: number;
  timeLimit: number;
  briefingPrompt: string;
  hint: string;
  educationalTakeaway: string;

  // Polymorphic stage specific payloads
  stage1?: Stage1Data;
  stage2?: Stage2Data;
  stage3?: Stage3Data;
  stage4?: Stage4Data;
  stage5?: Stage5Data;
}

export interface MissionCampaign {
  index: number;
  id: string;
  title: string;
  destinationOrbit: string;
  challenges: [
    MissionChallenge, // Stage 1
    MissionChallenge, // Stage 2
    MissionChallenge, // Stage 3
    MissionChallenge, // Stage 4
    MissionChallenge  // Stage 5
  ];
}

export interface TeamFeedback {
  message: string;
  isCorrect: boolean;
  pointsEarned: number;
}

export interface TeamControlState {
  id: TeamId;
  name: string;
  score: number;
  stageScore: number;
  streak: number;
  stagesCleared: number;
  attemptsLeft: number;
  isLocked: boolean;
  lastResult: 'correct' | 'wrong' | null;
  lastFeedback: TeamFeedback | null;

  // Stage 1 interactive state
  placedTokens: string[];

  // Stage 2 interactive state
  dialValue: number;
  currentStepProgress: number;

  // Stage 3 interactive state
  selectedBalanceOp: '+' | '-' | '×' | '÷';
  selectedBalanceVal: number;
  balanceTiltedSide: 'left-heavy' | 'right-heavy' | 'balanced';

  // Stage 4 interactive state
  speedDial: number;
  timeDial: number;

  // Stage 5 interactive state
  lockDigit1: number; // 0..9
  lockDigit2: number; // 0..9
  isArmed: boolean;
}

export interface Spacecraft3DState {
  // Stage 1: Avionics & Navigation Computer
  avionicsPower: boolean;
  cockpitGlowIntensity: number;
  hudSystemsActive: boolean;

  // Stage 2: Cryogenic Fuel System
  fuelTankPercent: number; // 0..100
  fuelPipesConnected: boolean;
  ventingVapor: boolean;

  // Stage 3: Rocket Engines
  enginePowerGrid: boolean;
  engineGlowIntensity: number;
  turbineSpinSpeed: number;

  // Stage 4: Navigation Gimbal & Trajectory
  navAlignmentLocked: boolean;
  gimbalPitchAngle: number;
  targetVectorLocked: boolean;

  // Stage 5 & Launch: Liftoff Physics
  launchStage: LaunchStep;
  serviceArmsAngle: number; // 0 (clamped) to 1 (retracted 80deg)
  clampsReleased: boolean;
  altitude: number; // 0 at pad, up to 120+ in sky
  ascentVelocity: number;
  exhaustFlameScale: number;
  smokeVolume: number;
  cameraTrackOffset: number;
}
