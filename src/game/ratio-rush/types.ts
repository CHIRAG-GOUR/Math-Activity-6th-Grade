// ============================================================
// RATIO RUSH — MOVIE PRODUCTION HOUSE
// Grade 6 Mathematics: Ratios, Rates, Proportions & Unit Rates
// ============================================================

export type StudioTeam = 'blue' | 'red';

export type StudioCameraView = 'overview' | 'director' | 'camera1' | 'wardrobe' | 'premiere';

export type ProductionStage = 
  | 'prep'            // Pre-production: crew checking gear, actors rehearsing
  | 'set_building'    // After Q1: stagehands move first set piece
  | 'lights_camera'   // After Q2: spotlights powered, camera dolly locked
  | 'props_placed'    // After Q3: props delivered to set
  | 'sound_ready'     // After Q4: boom mic & sound console rolling
  | 'action_filming'  // Q5 Complete: Director calls action, clapper snaps
  | 'premiere';       // Final Cinema Premiere showcase

export interface RatioQuestion {
  id: string;
  stage: number;
  title: string;
  scenario: string;
  mathPrompt: string;
  ratioA: number;
  ratioB: number;
  labelA: string;
  labelB: string;
  targetQuantityName: string;
  givenQuantityName: string;
  givenQuantityValue: number;
  correctAnswer: number;
  correctUnit: string;
  options: number[];
  unitRateExplanation: string;
  studioActionText: string;
  diagram: {
    blocksA: number;
    blocksB: number;
    multiplier: number;
    totalUnits: number;
  };
  misconceptions: {
    wrongAnswer: number;
    reason: string;
  }[];
}

export interface TeamStudioState {
  team: StudioTeam;
  currentQuestionIndex: number;
  score: number;
  streak: number;
  isComplete: boolean;
  selectedOption: number | null;
  inputAnswer: string;
  feedbackStatus: 'idle' | 'correct' | 'incorrect';
  feedbackMessage: string;
  solvedStages: number[];
  productionLevel: number; // 0 to 5
}

export interface StudioActorState {
  id: string;
  name: string;
  role: 'hero' | 'friend' | 'inventor' | 'villain' | 'director' | 'camera_op' | 'dolly_grip' | 'boom_op' | 'sound_eng' | 'photographer' | 'videographer' | 'stagehand' | 'lighting_tech';
  position: [number, number, number];
  targetPosition: [number, number, number];
  rotationY: number;
  isWalking: boolean;
  actionState: 'idle' | 'walking' | 'carrying_prop' | 'filming' | 'posing' | 'gesturing' | 'directing' | 'taking_photo' | 'boom_holding';
  carriedProp?: string;
}

export interface RatioGameState {
  gameMode: 'duel' | 'solo';
  activeCameraView: StudioCameraView;
  isTimerRunning: boolean;
  timeRemaining: number;
  currentMovieStage: number; // 0 to 4 (5 stages total)
  stageWinners: (StudioTeam | null)[]; // Array of 5 elements recording which team won each scene
  blueScenesWon: number; // Number of scenes directed by Blue (0 to 5)
  redScenesWon: number; // Number of scenes directed by Red (0 to 5)
  globalProductionStage: ProductionStage;
  isFilmingActive: boolean;
  isPremiereActive: boolean;
  clapperVisible: boolean;
  clapperTake: number;
  flashActive: boolean;
  blueTeam: TeamStudioState;
  redTeam: TeamStudioState;
  activeSoloTeam: StudioTeam;
  selectedTapeMultiplier: number;
  winningTeam: StudioTeam | 'tie' | null;
  showBriefingModal: boolean;
  isMuted: boolean;
  isFullscreen: boolean;
}
