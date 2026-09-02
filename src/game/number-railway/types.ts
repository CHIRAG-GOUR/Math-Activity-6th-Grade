// ============================================================
// THE GREAT NUMBER RAILWAY — Core Types
// Grade 6 Mathematics: Place Value & Rounding
// 5-Stage Station Journey & Competitive Battle System
// ============================================================

export type BloomLevel =
  | 'remember'
  | 'understand'
  | 'apply'
  | 'analyze'
  | 'evaluate'
  | 'create';

export type ChallengeType =
  | 'round-to-nearest'
  | 'digit-value'
  | 'number-construction'
  | 'expanded-form'
  | 'compare-numbers'
  | 'error-analysis'
  | 'estimation'
  | 'constraint-construction';

export type TeamId = 'blue' | 'red';

export type SignalState = 'red' | 'yellow' | 'green';

export type LoadingStepType =
  | 'vehicles'     // Q1: Load Vehicles onto flatbed
  | 'materials'    // Q2: Load Building materials (logs, steel, bricks)
  | 'passengers'   // Q3: Board passengers into passenger car
  | 'brakes'       // Q4: Release brakes & build boiler steam
  | 'departure'    // Q5: Green signal & high-graphics journey to next station
  | 'tie-breaker'; // Super Tie-Breaker Question

export type GamePhase =
  | 'title'
  | 'briefing'
  | 'challenge'
  | 'round-reveal'
  | 'super-tie-breaker'
  | 'item-loaded'
  | 'train-journey'
  | 'station-arrived'
  | 'game-over'
  | 'network-complete';

export type TrainState =
  | 'idle'
  | 'loading'
  | 'departing'
  | 'moving'
  | 'approaching'
  | 'arrived';

export interface StationInfo {
  id: string;
  name: string;
  subtitle: string;
  position: [number, number, number];
  color: string;
}

export interface RailwayChallenge {
  id: string;
  stationIndex: number;
  stepIndex: number; // 1 to 5, or 6 for super tie breaker
  stepType: LoadingStepType;
  stepTitle: string;
  stepDescription: string;
  stepIcon: string;
  
  missionTitle: string;
  bloomLevel: BloomLevel;
  challengeType: ChallengeType;
  difficulty: 'foundation' | 'core' | 'challenge';
  points: number;
  timeLimit: number; // seconds

  context: {
    originStation: string;
    destinationStation: string;
    narrative: string;
  };

  prompt: string;
  number?: number;
  numberString?: string;
  highlightDigitIndex?: number;
  options: Array<{ value: number | string; label: string }>;

  correctAnswer: number | string;
  validation: (answer: number | string) => boolean;
  hints: string[];
  explanation: string;
}

export interface LoadedTrainItems {
  vehicles: boolean;      // Step 1
  materials: boolean;     // Step 2
  passengers: boolean;    // Step 3
  brakesLifted: boolean;  // Step 4
  signalGreen: boolean;   // Step 5
}

export interface TeamState {
  id: TeamId;
  name: string;
  score: number;
  streak: number;
  correctAnswersCount: number;
  selectedAnswer: number | string | null;
  isLocked: boolean;
  lastResult: 'correct' | 'wrong' | null;
  lastScoreGained: number;
  lastFeedback: {
    message: string;
    isCorrect: boolean;
    pointsEarned: number;
  } | null;
  attemptsOnCurrent: number;
}

export interface TrainAnimState {
  position: [number, number, number];
  rotation: [number, number, number];
  progress: number; // 0..1 along journey track
  speed: number;
  state: TrainState;
  wheelRotation: number;
  smokeActive: boolean;
  whistleActive: boolean;
}

export interface RailwayGameState {
  phase: GamePhase;
  currentStationIndex: number; // 0, 1, 2...
  currentStepIndex: number;    // 1..5
  activeChallengeIndex: number;
  challenges: RailwayChallenge[];
  activeChallenge: RailwayChallenge | null;
  isSuperTieBreaker: boolean;
  winner: TeamId | 'draw' | 'busted' | null;
  
  blueTeam: TeamState;
  redTeam: TeamState;

  stations: StationInfo[];
  loadedItems: LoadedTrainItems;
  signalState: SignalState;
  train: TrainAnimState;

  // Journey tracking
  fromStationName: string;
  toStationName: string;
  totalJourneysCompleted: number;

  isMuted: boolean;
  timeRemaining: number;
  timerActive: boolean;
  stepAnimationMessage: string | null;
}
