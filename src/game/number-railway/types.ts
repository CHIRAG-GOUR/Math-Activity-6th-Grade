// ============================================================
// THE GREAT NUMBER RAILWAY — Core Types
// Grade 6 Mathematics: Place Value & Rounding
//
// GAME LOOP:
//   5 challenges per ROUND  →  RAILWAY SHOWDOWN  →  next ROUND
//   Q1–Q4 build the team's advantage.
//   Q5 is the ROUTE AUTHORIZATION question (the climax).
//   After Q5 the railway itself decides the winner:
//     both signals RED → switch throws → winner signal R→Y→G →
//     winner's train departs from its side → travels → destination → reward.
// Blue Team = LEFT side.  Red Team = RIGHT side.
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

// Signals now support the full three-aspect sequence RED → YELLOW → GREEN.
export type SignalState = 'red' | 'yellow' | 'green';

// The central junction switch can route toward either team, or sit neutral.
export type SwitchTarget = 'neutral' | 'blue' | 'red';

// Sub-steps of the cinematic Railway Showdown sequence.
export type ShowdownStep =
  | 'idle'
  | 'quiet'          // both signals red, world goes quiet, ROUTE DECISION board
  | 'switching'      // the mechanical switch lever throws toward the winner
  | 'signal-yellow'  // winner signal RED → YELLOW
  | 'signal-green'   // winner signal YELLOW → GREEN
  | 'departing'      // winner train accelerates and travels the route
  | 'arrived';       // winner train reaches the destination station

export type GamePhase =
  | 'title'
  | 'round-intro'     // brief round title card
  | 'challenge'       // the 5 questions
  | 'question-reveal' // short, quiet per-question solution
  | 'showdown'        // the railway showdown cinematic
  | 'tie-break'       // draw → reasoning tie-break question
  | 'winner-reveal'   // railway plaque + round points
  | 'round-complete'  // pause before the next round begins
  | 'network-complete'; // all rounds done — grand network restored

export type TrainMotionState =
  | 'idle'
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
  // Which round activates (unlocks) this station on the network.
  roundIndex: number;
}

export interface RailwayChallenge {
  id: string;
  bloomLevel: BloomLevel;
  challengeType: ChallengeType;
  difficulty: 'foundation' | 'core' | 'challenge';
  points: number;
  timeLimit: number;

  // Q5 of every round is the "route authorization" climax question.
  isRouteAuthorization?: boolean;

  missionTitle: string;
  prompt: string;
  number?: number;
  numberString?: string;
  highlightDigitIndex?: number;
  options: Array<{ value: number | string; label: string }>;

  correctAnswer: number | string;
  validation: (answer: number | string) => boolean;
  hints: string[];
  explanation: string;

  // Short flavour describing the railway consequence of a correct answer.
  railwayEffect: string;
}

export interface RailwayRound {
  index: number;         // 0-based
  id: string;
  name: string;          // e.g. "THE MOUNTAIN EXPRESS"
  subtitle: string;
  destinationStationId: string;
  questions: RailwayChallenge[]; // exactly 5
}

export interface TeamState {
  id: TeamId;
  name: string;
  score: number;              // cumulative across all rounds
  roundScore: number;         // points earned in the current round
  streak: number;
  correctAnswersCount: number;
  roundCorrect: number;       // correct answers this round
  roundsWon: number;
  selectedAnswer: number | string | null;
  isLocked: boolean;
  lastResult: 'correct' | 'wrong' | null;
  lastScoreGained: number;
  lastFeedback: {
    message: string;
    isCorrect: boolean;
    pointsEarned: number;
  } | null;
}

export interface TrainAnimState {
  progress: number;             // 0..1 along the team route curve
  speed: number;                // 0..1 normalized speed (drives wheels/steam)
  state: TrainMotionState;
  smokeActive: boolean;
  whistleActive: boolean;
  headlampOn: boolean;
}

export type RoundWinner = TeamId | 'draw' | null;

export interface RailwayGameState {
  phase: GamePhase;

  rounds: RailwayRound[];
  currentRoundIndex: number;
  questionIndexInRound: number;   // 0..4
  activeChallenge: RailwayChallenge | null;
  isTieBreak: boolean;

  blueTeam: TeamState;
  redTeam: TeamState;

  roundWinner: RoundWinner;
  matchWinner: RoundWinner;       // overall winner at network-complete

  // Railway hardware state
  signalBlue: SignalState;
  signalRed: SignalState;
  switchTarget: SwitchTarget;
  showdownStep: ShowdownStep;
  activeRoute: TeamId | null;     // which team's route the camera/train follows

  blueTrain: TrainAnimState;
  redTrain: TrainAnimState;

  stations: StationInfo[];
  unlockedStationIds: string[];

  isMuted: boolean;
  timeRemaining: number;
  timerActive: boolean;
  toastMessage: string | null;
}
