// ============================================================
// EQUATION MISSION CONTROL 2.0 — Type Definitions
// Grade 6: Expressions, Formulae & Equations
// 2-Team Interactive 3D Dual-Rocket Space Launch Facility
// ============================================================

export type TeamId = 'blue' | 'red';

export type MissionStageId =
  | 'config'       // Stage 1: Avionics & Flight Computer (Expressions)
  | 'fuel'         // Stage 2: Cryogenic Fuel Variable Loading (Substitution)
  | 'engine'       // Stage 3: Rocket Engine Equation Balance (One-Step Equations)
  | 'navigation'   // Stage 4: Flight Path Formula Calibration (Speed & Distance Formulae)
  | 'launch';      // Stage 5: Final Launch Equation Lock & Liftoff (Two-Step Equation)

export type StageIndex = 0 | 1 | 2 | 3 | 4;

export type GamePhase =
  | 'title'              // Title & Team Customization
  | 'active-mission'     // Simultaneous Dual-Team Engineering Challenge
  | 'countdown'          // Final 5-4-3-2-1 Ignition Countdown
  | 'launch-cinematic'   // 12-Step Cinematic Dual-Rocket Liftoff into Bright Blue Sky
  | 'mission-report';    // Final Aerospace Mission Certification & Champion Plaque

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

export interface MissionOption {
  value: number | string;
  label: string;
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
  options: MissionOption[];
  correctAnswer: number | string;
  hint: string;
  educationalTakeaway: string;
}

export interface MissionCampaign {
  index: number;
  id: string;
  title: string;
  destinationOrbit: string;
  challenges: [
    MissionChallenge,
    MissionChallenge,
    MissionChallenge,
    MissionChallenge,
    MissionChallenge
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
  selectedAnswer: number | string | null;
  attemptsLeft: number;
  isLocked: boolean;
  lastResult: 'correct' | 'wrong' | null;
  lastScoreGained: number;
  lastFeedback: TeamFeedback | null;
}

export interface Spacecraft3DState {
  team: TeamId;
  
  // 5 Physical Preparation Stages
  stage1StructureDone: boolean; // Structural panels & avionics HUD active
  stage2FuelDone: boolean;      // Fuel umbilicals locked & liquid fuel at 100%
  stage3EngineDone: boolean;    // Triple engine bells glowing amber
  stage4NavDone: boolean;       // Radar dish deployed & gimbals aligned
  stage5Armed: boolean;         // Hold-down clamps released & armed for liftoff

  // Subsystem Metrics
  cockpitGlowIntensity: number;
  fuelTankPercent: number;      // 0..100
  fuelArmConnected: boolean;
  ventingVapor: boolean;
  engineGlowIntensity: number;
  gimbalPitchAngle: number;
  antennaDeployed: boolean;
  serviceArmsAngle: number;     // 0 (clamped) to 1 (retracted 80deg)
  clampsReleased: boolean;

  // Liftoff Physics & Flight Telemetry
  launchStage: LaunchStep;
  altitude: number;             // 0 at pad up to 150+ in bright blue sky
  ascentVelocity: number;
  exhaustFlameScale: number;
  smokeVolume: number;
  flagWaveSpeed: number;
  flagProminence: number;       // Expands and waves prominently upon victory
}

