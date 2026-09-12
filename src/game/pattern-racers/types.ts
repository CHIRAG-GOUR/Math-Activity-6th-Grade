// ============================================================
// PATTERN RACERS — THE SEQUENCE & FUNCTION GRAND PRIX
// Complete TypeScript Types Definition
// Grade 6 Curriculum: Sequences, Linear Patterns & Function Machines
// ============================================================

import { TeamPowerUps } from '@/types/powerUps';

export type TeamId = 'blue' | 'red';

export type RoundNumber = 1 | 2 | 3 | 4 | 5;

export type GamePhase =
  | 'intro'             // Pre-match briefing & facility tour
  | 'pacing_select'     // Question count selection (5/10/15/20)
  | 'round_active'      // Live dual-team problem solving & machine manipulation
  | 'machine_operating' // Physical 3D world animation (track building / capsule processing)
  | 'round_success'     // Round celebration & vehicle advancement
  | 'grand_prix_race'   // Final 3D race simulation with starting lights and track navigation
  | 'tie_break'         // 15-second Sudden Death Speed Duel (if tie occurs)
  | 'podium_ceremony';  // Final victory podium, scoreboard & championship certificate

export type ChallengeSkill =
  | 'sequence_step'           // Round 1: Find step / common difference (e.g. +3)
  | 'sequence_builder'        // Round 2: Build complete sequence (Start + Step + Dir)
  | 'function_machine'        // Round 3: Input -> [Rule] -> Output computation
  | 'function_repair'         // Round 4: Find missing operator & operand (e.g. [× 3])
  | 'grand_prix_hybrid';      // Round 5: Sequence circuit + Multi-step function gate

export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export interface SequenceChallenge {
  id: string;
  round: RoundNumber;
  skill: ChallengeSkill;
  difficulty: QuestionDifficulty;
  title: string;
  instruction: string;
  
  // Sequence data (Rounds 1, 2, 5)
  sequence?: number[];
  missingIndex?: number;       // Index of '?' in sequence (usually last or middle)
  commonDifference?: number;   // e.g. +3, -4, +7
  ruleDescription?: string;    // "Add 3 each time", "Subtract 4"
  startValue?: number;
  
  // Function machine data (Rounds 3, 4, 5)
  functionInput?: number;
  functionOutput?: number;
  operators?: ('+' | '-' | '×' | '÷')[];
  operands?: number[];
  twoStep?: boolean;
  operator1?: '+' | '-' | '×' | '÷';
  operand1?: number;
  operator2?: '+' | '-' | '×' | '÷';
  operand2?: number;

  // Expected solutions
  expectedStep?: number;
  expectedNextTerm?: number;
  expectedOperator?: '+' | '-' | '×' | '÷';
  expectedOperand?: number;
  expectedOutput?: number;

  // Misconception coaching tip
  misconceptionTip: string;
  mathExplanation: string;
}

export interface TeamConsoleState {
  id: TeamId;
  name: string;
  score: number;
  roundProgress: number;     // 0 to 5 completed rounds
  streak: number;
  attemptsLeft: number;      // 2 chances per challenge
  isLocked: boolean;
  hasSubmitted: boolean;
  isCorrect: boolean | null;
  lastFeedback: string | null;
  activeMisconception: string | null;

  // Round 1 Controls: Step dial
  selectedStep: number;

  // Round 2 Controls: Start + Step + Direction
  builderStart: number;
  builderStep: number;
  builderDirection: 'increasing' | 'decreasing';

  // Round 3 Controls: Output dial/slider
  computedOutput: number;

  // Round 4 Controls: Operator & Operand wheels
  selectedOperator: '+' | '-' | '×' | '÷';
  selectedOperand: number;

  // Round 5 Controls: Step + Output
  hybridStep: number;
  hybridOutput: number;

  // Tactical Power-Ups & Comeback Surge
  powerUps: TeamPowerUps;
  multiplierActive: boolean;
  surgeActive: boolean;
  eliminatedOptions: string[]; // For 50:50 assistance
}

export interface VehiclePhysicsState {
  teamId: TeamId;
  progress: number;       // 0 to 1 along current round track segment
  currentSector: number;  // 0 to 5
  worldPosition: [number, number, number];
  rotationY: number;
  speed: number;
  boostActive: boolean;
  isRacing: boolean;
  lapTime: number;
  finishedRace: boolean;
}

export interface FacilityWorker {
  id: string;
  name: string;
  role: 'engineer' | 'mechanic' | 'marshal' | 'inspector' | 'telemetry';
  position: [number, number, number];
  rotationY: number;
  animationState: 'idle' | 'working' | 'typing' | 'waving' | 'celebrating';
  targetRound: RoundNumber;
}
