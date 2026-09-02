// ============================================================
// THE GREAT NUMBER RAILWAY — Core Types
// Grade 6 Mathematics: Place Value & Rounding
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

export type GamePhase =
  | 'title'
  | 'briefing'
  | 'challenge'
  | 'route-animation'
  | 'train-journey'
  | 'delivery'
  | 'steal-opportunity'
  | 'mission-summary'
  | 'network-complete';

export type TrainState =
  | 'idle'
  | 'departing'
  | 'moving'
  | 'approaching'
  | 'arrived'
  | 'unloading';

// Railway topology
export interface StationDef {
  id: string;
  name: string;
  position: [number, number, number];
  type: 'central' | 'passenger' | 'cargo' | 'maintenance';
  active: boolean;
}

export interface TrackSegment {
  id: string;
  from: string; // station id
  to: string;   // station id
  controlPoints: [number, number, number][]; // spline control points
  hasBridge?: boolean;
  hasTunnel?: boolean;
  active: boolean;
}

export interface JunctionDef {
  id: string;
  position: [number, number, number];
  trackA: string; // track segment id
  trackB: string; // track segment id
  currentRoute: 'A' | 'B';
}

export interface RailwayChallenge {
  id: string;
  missionTitle: string;
  bloomLevel: BloomLevel;
  challengeType: ChallengeType;
  difficulty: 'foundation' | 'core' | 'challenge';
  points: number;
  timeLimit: number; // seconds

  // The railway context
  context: {
    cargoType: 'passengers' | 'cargo' | 'construction' | 'messages';
    originStation: string;
    destinationOptions: string[];
    narrative: string; // "A passenger train needs to reach North Terminal..."
  };

  // The math problem
  prompt: string;
  number?: number;
  numberString?: string;
  options?: Array<{ value: number | string; label: string }>;

  // Validation
  correctAnswer: number | string;
  validation: (answer: number | string) => boolean;

  // Hints for wrong answers
  hints: string[];
  highlightDigitIndex?: number; // index of digit to emphasise on wrong answer

  // Railway consequence
  railwayAction: {
    switchId?: string;
    routeChoice?: 'A' | 'B';
    signalId?: string;
    destinationStation: string;
    trackSegmentId: string;
  };

  explanation: string;
}

export interface TeamState {
  id: TeamId;
  name: string;
  score: number;
  streak: number;
  routesCompleted: number;
  deliveriesCount: number;
  currentAnswer: number | string | null;
  isLockedIn: boolean;
  hasAnswered: boolean;
  isCorrect: boolean | null;
  lastFeedback: {
    message: string;
    isCorrect: boolean;
    pointsEarned: number;
  } | null;
  attemptsOnCurrent: number;
  canSteal: boolean;
}

export interface TrainAnimState {
  position: [number, number, number];
  rotation: [number, number, number];
  progress: number; // 0..1 along current spline
  speed: number;
  state: TrainState;
  currentTrackId: string | null;
  wheelRotation: number;
  smokeActive: boolean;
}

export interface RailwayGameState {
  phase: GamePhase;
  currentMission: number;
  totalMissions: number;
  challenges: RailwayChallenge[];
  activeChallenge: RailwayChallenge | null;
  
  blueTeam: TeamState;
  redTeam: TeamState;

  // Railway world state
  stations: Record<string, StationDef>;
  tracks: Record<string, TrackSegment>;
  junctions: Record<string, JunctionDef>;
  signals: Record<string, SignalState>;

  // Train
  blueTrain: TrainAnimState;
  redTrain: TrainAnimState;

  // Network progression
  networkProgress: number; // 0..100
  unlockedRoutes: string[];

  // Audio
  isMuted: boolean;

  // Timer
  timeRemaining: number;
  timerActive: boolean;
}
