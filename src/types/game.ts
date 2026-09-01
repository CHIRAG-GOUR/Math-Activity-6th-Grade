export type TeamId = 'blue' | 'red';

export type GradeLevel = '1-2' | '3-4' | '5-6' | '7-8' | '9-10';

export type MathTopic =
  | 'addition'
  | 'subtraction'
  | 'multiplication'
  | 'division'
  | 'fractions'
  | 'decimals'
  | 'mixed';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export type GameLength = 5 | 10 | 20;

export type GamePhase =
  | 'start'
  | 'countdown'
  | 'playing'
  | 'round_reveal'
  | 'key_awarded'
  | 'game_over';

export interface Question {
  id: string;
  text: string;
  subText?: string;
  answer: number | string;
  options?: (number | string)[];
  hint: string;
  explanation: string;
  topic: MathTopic;
  difficulty: DifficultyLevel;
}

export interface TeamState {
  id: TeamId;
  name: string;
  score: number;
  streak: number;
  keys: number; // 0 to 3
  multiplier: 1 | 2 | 3;
  currentInput: string;
  selectedAnswer: number | string | null;
  isLocked: boolean;
  lastResult: 'correct' | 'wrong' | null;
  lastScoreGained: number;
  comboTitle?: string | null;
}

export interface GameSettings {
  grade: GradeLevel;
  topic: MathTopic;
  topics?: MathTopic[]; // Multi-select topics support
  difficulty: DifficultyLevel;
  totalRounds: GameLength;
  timePerRound: number;
  soundEnabled: boolean;
  teamBlueName: string;
  teamRedName: string;
}

export interface RoundResult {
  roundNumber: number;
  question: Question;
  blueAnswer: number | string | null;
  redAnswer: number | string | null;
  correctAnswer: number | string;
  blueCorrect: boolean;
  redCorrect: boolean;
  bluePoints: number;
  redPoints: number;
}
