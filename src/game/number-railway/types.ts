// ============================================================
// THE GREAT NUMBER RAILWAY — Core Types
// Grade 6 Mathematics: Place Value & Rounding
//
// GAME LOOP:
//   5 challenges per ROUND  →  RAILWAY SHOWDOWN  →  next ROUND
//   First-Answerer Rebound Rule:
//     - Team who submits first with correct answer wins the question!
//     - If wrong, 2nd team gets a rebound chance to answer!
//     - If both fail, 0 points and train doesn't move.
//   Visual Progression:
//     - Correct answer seats a passenger in the team's uniform (Blue/Red) INSIDE the train!
//     - Semaphore signals turn GREEN one-by-one with each correct answer!
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

export type SwitchTarget = 'neutral' | 'blue' | 'red';

export type ShowdownStep =
  | 'idle'
  | 'quiet'          // both signals red, ROUTE DECISION board
  | 'switching'      // mechanical switch lever throws toward winner
  | 'signal-yellow'  // winner signal RED → YELLOW
  | 'signal-green'   // winner signal YELLOW → GREEN
  | 'departing'      // winner train accelerates & travels
  | 'arrived';       // reaches destination station

export type GamePhase =
  | 'title'
  | 'round-intro'     // brief round title card
  | 'challenge'       // the 5 questions
  | 'question-reveal' // per-question solution reveal
  | 'showdown'        // railway showdown cinematic
  | 'tie-break'       // draw → sudden-death tie-break
  | 'winner-reveal'   // victory plaque
  | 'round-complete'  // pause before next round
  | 'network-complete';

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
  roundIndex: number;
}

export interface RailwayChallenge {
  id: string;
  bloomLevel: BloomLevel;
  challengeType: ChallengeType;
  difficulty: 'foundation' | 'core' | 'challenge';
  points: number;
  timeLimit: number;
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
  railwayEffect: string;
}

export interface RailwayRound {
  index: number;
  id: string;
  name: string;
  subtitle: string;
  destinationStationId: string;
  questions: RailwayChallenge[];
}

export interface TeamState {
  id: TeamId;
  name: string;
  score: number;
  roundScore: number;
  streak: number;
  correctAnswersCount: number;
  roundCorrect: number;
  roundsWon: number;
  selectedAnswer: number | string | null;
  isLocked: boolean; // Locked out for this question
  lastResult: 'correct' | 'wrong' | null;
  lastScoreGained: number;
  lastFeedback: {
    message: string;
    isCorrect: boolean;
    pointsEarned: number;
  } | null;
}

export interface TrainAnimState {
  progress: number;
  speed: number;
  state: TrainMotionState;
  smokeActive: boolean;
  whistleActive: boolean;
  headlampOn: boolean;
}

export interface OnboardPassenger {
  id: string;
  team: TeamId;
  seatIndex: number; // 0..5
}

export type RoundWinner = TeamId | 'draw' | null;

export interface RailwayGameState {
  phase: GamePhase;

  rounds: RailwayRound[];
  currentRoundIndex: number;
  questionIndexInRound: number; // 0..4
  activeChallenge: RailwayChallenge | null;
  isTieBreak: boolean;

  blueTeam: TeamState;
  redTeam: TeamState;

  roundWinner: RoundWinner;
  matchWinner: RoundWinner;

  // Visual Progression
  signalsGreenCount: number; // 0..5 signals turned green
  onboardPassengers: OnboardPassenger[]; // Passengers seated INSIDE the train

  // Hardware State
  signalBlue: SignalState;
  signalRed: SignalState;
  switchTarget: SwitchTarget;
  showdownStep: ShowdownStep;
  activeRoute: TeamId | null;

  blueTrain: TrainAnimState;
  redTrain: TrainAnimState;

  stations: StationInfo[];
  unlockedStationIds: string[];
  totalRounds: number;
  questionCountConfig: 5 | 10 | 15;
  zoomLevel: number; // 0.7 .. 1.5

  isMuted: boolean;
  timeRemaining: number;
  timerActive: boolean;
  toastMessage: string | null;
}
