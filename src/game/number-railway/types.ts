// ============================================================
// THE GREAT NUMBER RAILWAY — Core Types
// Grade 6 Mathematics: Place Value & Rounding
// 5-Stage Station Journey System:
// Step 1: 👥 Passengers Board from Skillizee Junction Platform
// Step 2: 🚗 Vehicles (Realistic Sedan & Pickup) Loaded onto Flatbed
// Step 3: 🪜 Materials (Ladders, Planks, Steel & Bricks) Loaded onto Cargo
// Step 4: ⚙️ Locomotive Driver Charges Steam & Disengages Brakes
// Step 5: 🚦 Green Signal & 15-Second Scenic Journey to CCIS Junction!
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
  | 'passengers'   // Step 1: Passengers board
  | 'vehicles'     // Step 2: Vehicles loaded
  | 'materials'    // Step 3: Materials (ladders, planks) loaded
  | 'brakes'       // Step 4: Driver releases brakes & steam
  | 'departure'    // Step 5: Green signal & 15s journey
  | 'tie-breaker'; // Super Tie-Breaker

export type GamePhase =
  | 'title'
  | 'train-approaching' // Train arriving at Skillizee Junction before Q1
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
  | 'arriving-start'
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
  stepIndex: number; // 1 to 5 (or 6 for tie breaker)
  stepType: LoadingStepType;
  stepTitle: string;
  stepDescription: string;
  stepIcon: string;
  
  missionTitle: string;
  bloomLevel: BloomLevel;
  challengeType: ChallengeType;
  difficulty: 'foundation' | 'core' | 'challenge';
  points: number;
  timeLimit: number;

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
  passengers: boolean;    // Step 1: Passengers in coach
  vehicles: boolean;      // Step 2: Cars on flatbed
  materials: boolean;     // Step 3: Ladders/planks on cargo
  brakesLifted: boolean;  // Step 4: Brakes released
  signalGreen: boolean;   // Step 5: Signal green
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
  progress: number;
  speed: number;
  state: TrainState;
  wheelRotation: number;
  smokeActive: boolean;
  whistleActive: boolean;
}

export type TotalQuestionsOption = 5 | 10 | 15;

export interface RailwayGameState {
  phase: GamePhase;
  totalQuestionsCount: TotalQuestionsOption;
  questionsPerStep: number; // 1 for 5Q, 2 for 10Q, 3 for 15Q
  stepQuestionsCompleted: number; // Counter within current step

  currentStationIndex: number;
  currentStepIndex: number; // 1..5
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

  fromStationName: string;
  toStationName: string;
  totalJourneysCompleted: number;

  isMuted: boolean;
  timeRemaining: number;
  timerActive: boolean;
  stepAnimationMessage: string | null;
}
