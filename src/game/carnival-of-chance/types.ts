// ============================================================
// THE GREAT CARNIVAL OF CHANCE — Core Types & Architecture
// Grade 6 Mathematics: Probability & Physical Experimentation
// ============================================================

export type ActivityId =
  | 'hub'
  | 'mystery-bag'
  | 'odds-wheel'
  | 'ball-drop'
  | 'probability-lab'
  | 'game-builder'
  | 'grand-carnival';

export type BloomLevel =
  | 'remember'
  | 'understand'
  | 'apply'
  | 'analyze'
  | 'evaluate'
  | 'create';

export type TeamId = 'blue' | 'red';

export type ActivityPhase =
  | 'intro'            // Challenge presentation & physical machine reveal
  | 'predicting'       // Both teams selecting/configuring predictions simultaneously
  | 'operating'        // 3D physical machine animation (spinning, bag opening, ball dropping)
  | 'observation'      // Showing theoretical vs actual random outcome & reasoning
  | 'batch-trials'     // Optional 10 or 50 trials experimental distribution
  | 'completed';       // Attraction finished, points & stars awarded

export interface ProbabilityBall {
  id: string;
  color: string;
  colorName: string;
}

export interface MathFraction {
  numerator: number;
  denominator: number;
  percentage?: string;
  decimal?: number;
}

export interface AnswerChoice {
  id: string;
  fraction: MathFraction;
  label: string;
  isCorrect: boolean;
  feedbackText: string;
}

export interface ProbabilityChallenge {
  id: string;
  activityId: ActivityId;
  bloomLevel: BloomLevel;
  missionTitle: string;
  prompt: string;
  helperNote?: string;
  
  // Physical machine setup
  setup: {
    totalItems: number;
    items: { color: string; colorName: string; count: number }[];
    targetColor: string;
    theoreticalFraction: MathFraction;
  };
  
  // Answer choices
  choices: AnswerChoice[];
  correctAnswerId: string;
  explanation: string;
  reflectionPrompt?: string;
  points: number;
  goldTickets: number;
}

export interface TeamState {
  id: TeamId;
  name: string;
  score: number;
  activityScore: number;
  goldTickets: number;
  selectedChoiceId: string | null;
  isConfirmed: boolean;
  isLocked: boolean;
  isCorrect: boolean | null;
  lastResult: 'correct' | 'wrong' | null;
  scoreGained: number;
  streak: number;
  correctAnswersCount: number;
}

export interface TrialOutcome {
  trialIndex: number;
  outcomeColor: string;
  outcomeName: string;
}

export interface AttractionMeta {
  id: ActivityId;
  name: string;
  subtitle: string;
  tagline: string;
  description: string;
  accentColor: string;
  islandPosition: [number, number, number];
  islandScale?: [number, number, number];
  completed: boolean;
  unlocked: boolean;
}
