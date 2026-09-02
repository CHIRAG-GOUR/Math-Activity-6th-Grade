export type BloomLevel =
  | 'remember'
  | 'understand'
  | 'apply'
  | 'analyze'
  | 'evaluate'
  | 'create';

export type ChallengeType =
  | 'digit-hunt'
  | 'place-value-builder'
  | 'expanded-form'
  | 'number-assembly'
  | 'compare-numbers'
  | 'number-sorting'
  | 'rounding-track'
  | 'rounding-detective'
  | 'find-the-mistake'
  | 'truth-or-trap'
  | 'which-student-is-right'
  | 'estimation-shop'
  | 'perfect-number'
  | 'master-blueprint';

export type ForgeZone =
  | 'workshop'
  | 'tower'
  | 'rounding-track'
  | 'detection-lab'
  | 'blueprint-chamber';

export type CharacterAction =
  | 'idle'
  | 'walk'
  | 'point'
  | 'think'
  | 'carry'
  | 'operate'
  | 'celebrate'
  | 'curious'
  | 'success'
  | 'failure';

export type PlaceValueKey =
  | 'millions'
  | 'hundredThousands'
  | 'tenThousands'
  | 'thousands'
  | 'hundreds'
  | 'tens'
  | 'ones';

export interface PlaceValueSlotInfo {
  key: PlaceValueKey;
  label: string;
  line1: string;
  line2?: string;
  shortLabel: string;
  multiplier: number;
  color: string;
  accent: string;
}

export const GRADE_6_PLACE_SLOTS: PlaceValueSlotInfo[] = [
  { key: 'hundredThousands', label: 'Hundred Thousands', line1: 'Hundred', line2: 'Thousands', shortLabel: 'HTh', multiplier: 100000, color: '#2563eb', accent: '#1d4ed8' },
  { key: 'tenThousands', label: 'Ten Thousands', line1: 'Ten', line2: 'Thousands', shortLabel: 'TTh', multiplier: 10000, color: '#0284c7', accent: '#0369a1' },
  { key: 'thousands', label: 'Thousands', line1: 'Thousands', shortLabel: 'Th', multiplier: 1000, color: '#0d9488', accent: '#0f766e' },
  { key: 'hundreds', label: 'Hundreds', line1: 'Hundreds', shortLabel: 'H', multiplier: 100, color: '#d97706', accent: '#b45309' },
  { key: 'tens', label: 'Tens', line1: 'Tens', shortLabel: 'T', multiplier: 10, color: '#ea580c', accent: '#c2410c' },
  { key: 'ones', label: 'Ones', line1: 'Ones', shortLabel: 'O', multiplier: 1, color: '#e11d48', accent: '#be123c' },
];

export const PLACE_VALUE_SLOTS = GRADE_6_PLACE_SLOTS;

export interface MathChallenge {
  id: string;
  type: ChallengeType;
  bloomLevel: BloomLevel;
  zone: ForgeZone;
  title: string;
  question: string;
  promptText: string;
  targetNumber?: number;
  numberString?: string;
  difficulty: 'foundation' | 'core' | 'challenge';
  points: number;
  timeLimit: number;
  
  // Clean structured breakdown for instant student comprehension
  structuredDecomposition?: {
    placeParts: Array<{ quantity: number; placeLabel: string }>;
    additionParts: string[];
    targetDisplay: string;
  };

  data: {
    targetPlace?: PlaceValueKey;
    targetDigit?: number;
    expectedValue?: number;
    slotsRequired?: Partial<Record<PlaceValueKey, number>>;
    expandedParts?: number[];
    comparePair?: [number, number];
    sortList?: number[];
    roundingBase?: number;
    roundingOptions?: number[];
    nearestBenchmark?: number;
    benchmarkPegs?: [number, number, number];
    claimStatement?: string;
    isClaimTrue?: boolean;
    studentStatements?: {
      studentA: { name: string; statement: string; isCorrect: boolean };
      studentB: { name: string; statement: string; isCorrect: boolean };
    };
    mistakeContext?: {
      givenNumber: number;
      incorrectRound: number;
      correctRound: number;
      mistakenDigit: number;
      reason: string;
    };
    estimationItems?: Array<{ label: string; quantity: number }>;
    blueprintConstraints?: Array<{
      id: string;
      description: string;
      check: (numStr: string) => boolean;
    }>;
  };

  explanation: string;
  learningTip: string;
}

export interface TeamForgeState {
  name: string;
  score: number;
  streak: number;
  accuracy: number;
  completedCount: number;
  mistakes: string[];
  characterAction: CharacterAction;
  selectedNumberBlocks: number[];
  placedSlots: Partial<Record<PlaceValueKey, number>>;
  incorrectSlots?: PlaceValueKey[];
  isLockedIn: boolean;
  hasAnsweredCurrent: boolean;
  lastFeedback?: {
    isCorrect: boolean;
    pointsEarned: number;
    message: string;
  };
}

export type GameStage = 'intro' | 'active-challenge' | 'round-summary' | 'master-complete';
