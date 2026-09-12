// ============================================================
// PATTERN RACERS — THE SEQUENCE & FUNCTION GRAND PRIX
// Complete TypeScript Types Definition
// 5-Round Continuous Physical Journey & Live Racing Duel System:
// - Round 1: Garage Departure (Cars start inside Left/Right Garages, drive to Pit Lane)
// - Round 2: Pit Inspection (Mechanics inspect tires & car, signal ready, roll to Grid)
// - Round 3: Grid Staging & Rev 1 (Stationary on Grid, revving, Signal 1 turns Green)
// - Round 4: Pre-Grid Rev & Signal 2 (Stationary on Grid, higher RPM, Signal 2 turns Green)
// - Round 5: Final Challenge + 3-2-1 Countdown + Live Race (Signal 3 Green, 3-4s Head Start)
// ============================================================

import { TeamPowerUps } from '@/types/powerUps';

export type TeamId = 'blue' | 'red';

export type RoundNumber = 1 | 2 | 3 | 4 | 5;

export type GamePhase =
  | 'intro'             // Pre-match briefing & stadium tour
  | 'round_active'      // Active question solving (Cars stationary in their phase location)
  | 'phase_transition'  // Physical driving transition between Garage -> Pit -> Grid
  | 'pre_race_countdown'// 3 -> 2 -> 1 -> GO Countdown (Controls appear at 3)
  | 'grand_prix_race'   // Stage 5 Live interactive race duel with throttle & steering controls
  | 'podium_ceremony';  // Final victory podium, scoreboard & championship certificate

export type VehicleFlowState =
  | 'garage_idle'          // Q1: Inside garages (Blue [-8.5, 0.25, 22], Red [8.5, 0.25, 22])
  | 'garage_to_pit'        // Q1 solved: driving from garage to pit lane
  | 'pit_inspection'       // Q2: Stationary in pit lane (Blue [-4.5, 0.25, 14], Red [4.5, 0.25, 14]) with mechanics
  | 'pit_to_grid'          // Q2 solved: driving from pit lane to starting grid boxes
  | 'grid_rev_stage_1'     // Q3: Stationary on grid (Blue [-2.0, 0.25, 6], Red [2.0, 0.25, 6]), revving, [🟢 🔴 🔴]
  | 'grid_rev_stage_2'     // Q4: Stationary on grid, higher RPM revving, [🟢 🟢 🔴]
  | 'grid_countdown'       // Q5: [🟢 🟢 🟢], 3-2-1 Countdown (Controls appear at 3)
  | 'racing'               // Live Race: Car launched (with head-start delay for trailing car)
  | 'race_finished';       // Crossed finish line

export type ChallengeSkill =
  | 'sequence_step'           // Round 1: Garage Departure Step Difference (e.g. +3)
  | 'sequence_builder'        // Round 2: Pit Inspection Sequence Builder (Start + Step)
  | 'function_machine'        // Round 3: Grid Staging Function Machine (Input -> Machine -> Output)
  | 'function_repair'         // Round 4: Pre-Grid Operator Repair (Find Operator [× 3])
  | 'grand_prix_hybrid';      // Round 5: Final Grid Launch Challenge

export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export interface SequenceChallenge {
  id: string;
  round: RoundNumber;
  skill: ChallengeSkill;
  difficulty: QuestionDifficulty;
  title: string;
  stageName?: string;
  instruction: string;
  
  // Sequence data
  sequence?: number[];
  missingIndex?: number;
  commonDifference?: number;
  ruleDescription?: string;
  startValue?: number;
  
  // Function machine data
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

export interface LiveRaceControls {
  throttle: number;         // 0 to 100%
  steer: number;            // -1 (full left) to +1 (full right)
  speedKmh: number;         // 0 to 360 km/h
  nitroRemaining: number;   // 0 to 100%
  nitroCharges: number;     // Remaining bottles
  maxNitroCharges: number;  // Total bottles
  nitroActive: boolean;
  laneOffset: number;       // Lateral position on track (-3.6 to +3.6 meters)
  distanceCovered: number;  // 0 to 750m
  trackProgress: number;    // 0.0 to 1.0 along spline
  rpm: number;              // 2000 to 12500 RPM
  gear: number;             // 1 to 8
  isHeldByHeadStart: boolean; // True during 3-4s head-start restraint
  hasAdvantage: boolean;
  advantageDescription: string;
}

export interface TeamConsoleState {
  id: TeamId;
  name: string;
  score: number;
  roundProgress: number;     // 0 to 5 completed stages
  streak: number;
  attemptsLeft: number;      // 2 chances per challenge
  isLocked: boolean;
  hasSubmitted: boolean;
  isCorrect: boolean | null;
  lastFeedback: string | null;
  activeMisconception: string | null;

  // Question Option Selection
  selectedOption: 'A' | 'B' | 'C' | 'D' | null;
  selectedOptionValue: number | string | null;

  // Round 1 Controls: Step dial
  selectedStep: number;

  // Round 2 Controls: Start + Step
  builderStart: number;
  builderStep: number;

  // Round 3 Controls: Output dial
  computedOutput: number;

  // Round 4 Controls: Operator & Operand wheels
  selectedOperator: '+' | '-' | '×' | '÷';
  selectedOperand: number;

  // Round 5 Controls: Step + Output
  hybridStep: number;
  hybridOutput: number;

  // Live Stage 5 Racing Cockpit State
  raceControls: LiveRaceControls;

  // Tactical Power-Ups
  powerUps: TeamPowerUps;
  multiplierActive: boolean;
  surgeActive: boolean;
  eliminatedOptions: string[];
}

export interface VehiclePhysicsState {
  teamId: TeamId;
  flowState: VehicleFlowState;
  worldPosition: [number, number, number];
  rotationY: number;
  speed: number;
  rpm: number;
  boostActive: boolean;
  isRacing: boolean;
  distanceTraveled: number;
  finishedRace: boolean;
}

export interface FacilityWorker {
  id: string;
  name: string;
  role: 'engineer' | 'mechanic' | 'marshal' | 'inspector' | 'telemetry';
  position: [number, number, number];
  rotationY: number;
  animationState: 'idle' | 'working' | 'typing' | 'waving' | 'inspecting_wheel' | 'thumbs_up';
  targetRound: RoundNumber;
}
