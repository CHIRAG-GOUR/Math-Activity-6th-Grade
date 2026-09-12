// ============================================================
// PATTERN RACERS — THE SEQUENCE & FUNCTION GRAND PRIX
// Complete TypeScript Types Definition
// 5-Stage Physical Progression & Live Racing Duel System:
// - Stage 1: Factory Telemetry & Diagnostics (Sparks, umbilical cables, laptops)
// - Stage 2: Hydraulic Lift & Rapid Tire Change (Pneumatic jacks, new slicks)
// - Stage 3: Factory Rollout (Garage doors open, engine revs, pit exit)
// - Stage 4: Starting Grid Staging (Long stadium view towards distant finish arch)
// - Stage 5: Live Interactive Grand Prix Racing Duel (Throttle, Steering, Nitro, Crowds)
// ============================================================

import { TeamPowerUps } from '@/types/powerUps';

export type TeamId = 'blue' | 'red';

export type RoundNumber = 1 | 2 | 3 | 4 | 5;

export type GamePhase =
  | 'intro'             // Pre-match briefing & stadium tour
  | 'pacing_select'     // Question count selection
  | 'round_active'      // Live dual-team problem solving & physical station actions
  | 'stage_transition'  // Cinematic transition between facility stations
  | 'grand_prix_race'   // Stage 5 Live interactive race duel with throttle & steering controls
  | 'tie_break'         // 15-second Sudden Death Speed Duel
  | 'podium_ceremony';  // Final victory podium, scoreboard & championship certificate

export type ChallengeSkill =
  | 'sequence_step'           // Round 1: Telemetry Step Difference (e.g. +3)
  | 'sequence_builder'        // Round 2: Suspension Builder (Start + Step)
  | 'function_machine'        // Round 3: Turbo Function Machine (Input -> Machine -> Output)
  | 'function_repair'         // Round 4: Transmission Repair (Find Operator [× 3])
  | 'grand_prix_hybrid';      // Round 5: Grid Launch Hybrid & Super Turbo Release

export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export interface SequenceChallenge {
  id: string;
  round: RoundNumber;
  skill: ChallengeSkill;
  difficulty: QuestionDifficulty;
  title: string;
  stageName?: string;          // e.g. "STAGE 1: ENGINE TELEMETRY CHECK"
  instruction: string;
  
  // Sequence data (Rounds 1, 2, 5)
  sequence?: number[];
  missingIndex?: number;
  commonDifference?: number;
  ruleDescription?: string;
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

export interface LiveRaceControls {
  throttle: number;         // 0 to 100%
  speedKmh: number;         // 0 to 350 km/h
  nitroRemaining: number;   // 0 to 100%
  nitroActive: boolean;
  lane: 'left' | 'center' | 'right';
  distanceCovered: number;  // 0 to 600m
  rpm: number;              // 2000 to 12000 RPM
  gear: number;             // 1 to 8
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

  // Live Stage 5 Racing Cockpit State
  raceControls: LiveRaceControls;

  // Tactical Power-Ups & Comeback Surge
  powerUps: TeamPowerUps;
  multiplierActive: boolean;
  surgeActive: boolean;
  eliminatedOptions: string[];
}

export interface VehiclePhysicsState {
  teamId: TeamId;
  stage: 'garage_diagnostics' | 'pit_tire_change' | 'factory_rollout' | 'grid_staging' | 'live_racing';
  worldPosition: [number, number, number];
  rotationY: number;
  liftY: number;            // For hydraulic jack elevation in Stage 2
  wheelsDetached: boolean;  // For Stage 2 tire change animation
  speed: number;
  boostActive: boolean;
  isRacing: boolean;
  distanceTraveled: number; // 0 to 600m
  finishedRace: boolean;
}

export interface FacilityWorker {
  id: string;
  name: string;
  role: 'engineer' | 'mechanic' | 'marshal' | 'inspector' | 'telemetry';
  position: [number, number, number];
  rotationY: number;
  animationState: 'idle' | 'working' | 'typing' | 'waving' | 'celebrating' | 'tire_change';
  targetRound: RoundNumber;
}
