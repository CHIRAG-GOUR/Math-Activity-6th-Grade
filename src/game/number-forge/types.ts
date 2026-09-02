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
  shortLabel: string;
  multiplier: number;
  color: string;
  accent: string;
}

export const PLACE_VALUE_SLOTS: PlaceValueSlotInfo[] = [
  { key: 'millions', label: 'MILLIONS', shortLabel: 'M', multiplier: 1000000, color: '#8b5cf6', accent: '#7c3aed' },
  { key: 'hundredThousands', label: 'HUNDRED THOUSANDS', shortLabel: 'HTh', multiplier: 100000, color: '#3b82f6', accent: '#2563eb' },
  { key: 'tenThousands', label: 'TEN THOUSANDS', shortLabel: 'TTh', multiplier: 10000, color: '#06b6d4', accent: '#0891b2' },
  { key: 'thousands', label: 'THOUSANDS', shortLabel: 'Th', multiplier: 1000, color: '#10b981', accent: '#059669' },
  { key: 'hundreds', label: 'HUNDREDS', shortLabel: 'H', multiplier: 100, color: '#f59e0b', accent: '#d97706' },
  { key: 'tens', label: 'TENS', shortLabel: 'T', multiplier: 10, color: '#f97316', accent: '#ea580c' },
  { key: 'ones', label: 'ONES', shortLabel: 'O', multiplier: 1, color: '#ef4444', accent: '#dc2626' },
];

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
  
  // Custom Data Payload depending on challenge type
  data: {
    targetPlace?: PlaceValueKey;
    targetDigit?: number;
    expectedValue?: number;
    slotsRequired?: Partial<Record<PlaceValueKey, number>>;
    expandedParts?: number[];
    comparePair?: [number, number];
    sortList?: number[];
    roundingBase?: number; // e.g. 1000, 10000
    roundingOptions?: number[];
    nearestBenchmark?: number;
    benchmarkPegs?: [number, number, number]; // e.g. [470000, 475000, 480000]
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
  isLockedIn: boolean;
  hasAnsweredCurrent: boolean;
  lastFeedback?: {
    isCorrect: boolean;
    pointsEarned: number;
    message: string;
  };
}

export type GameStage = 'intro' | 'active-challenge' | 'round-summary' | 'master-complete';
