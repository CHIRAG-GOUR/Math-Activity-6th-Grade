// ============================================================
// PATTERN RACERS — Global Game State & Deterministic Physics Store
// Strict 5-Round Continuous Physical Journey:
// - Round 1: Garage Departure (Cars parked in Left/Right Garages -> Drive to Pit Lane)
// - Round 2: Pit Inspection (Cars parked in Pit Lane, Mechanics inspect tires -> Roll to Grid)
// - Round 3: Grid Staging & Rev 1 (Stationary on Grid boxes, Revving, Signal 1 turns Green)
// - Round 4: Pre-Grid Rev & Signal 2 (Stationary on Grid boxes, High RPM, Signal 2 turns Green)
// - Round 5: Final Launch Challenge + 3-2-1 Countdown + Live Race (Signal 3 Green, 3-4s Head Start)
// ============================================================

import { create } from 'zustand';
import {
  TeamId,
  RoundNumber,
  GamePhase,
  SequenceChallenge,
  TeamConsoleState,
  VehiclePhysicsState,
  FacilityWorker,
  VehicleFlowState,
} from '../types';
import { initialTeamPowerUps } from '@/types/powerUps';
import { getTrackPointAt, TRACK_FINISH_PROGRESS } from '../engine/trackPath';
import { PatternQuestion, getQuestionForRound } from '../engine/questionBank';

// ── 1. DETERMINISTIC VEHICLE COORDINATE MILESTONES ──
export const VEHICLE_COORDINATES = {
  // Round 1: Parked inside Garages (Left & Right)
  garageStart: {
    blue: [-8.5, 0.25, 22] as [number, number, number],
    red: [8.5, 0.25, 22] as [number, number, number],
  },
  // Round 2: Pit Lane / Service Bays
  pitInspection: {
    blue: [-4.5, 0.25, 14] as [number, number, number],
    red: [4.5, 0.25, 14] as [number, number, number],
  },
  // Round 3-5: Starting Grid Boxes
  startingGrid: {
    blue: [-2.0, 0.25, 6] as [number, number, number],
    red: [2.0, 0.25, 6] as [number, number, number],
  },
};

// ── 2. PIT CREW & MARSHAL CREW ──
const INITIAL_WORKERS: FacilityWorker[] = [
  { id: 'w1', name: 'Marco', role: 'telemetry', position: [-9.8, 0, 20], rotationY: 0.3, animationState: 'typing', targetRound: 1 },
  { id: 'w2', name: 'Leo', role: 'mechanic', position: [-7.2, 0, 21], rotationY: -0.4, animationState: 'working', targetRound: 1 },
  { id: 'w3', name: 'Sofia', role: 'telemetry', position: [9.8, 0, 20], rotationY: -0.3, animationState: 'typing', targetRound: 1 },
  { id: 'w4', name: 'Lucas', role: 'mechanic', position: [7.2, 0, 21], rotationY: 0.4, animationState: 'working', targetRound: 1 },
  { id: 'w5', name: 'Carlos', role: 'inspector', position: [-5.8, 0, 14], rotationY: 0.5, animationState: 'inspecting_wheel', targetRound: 2 },
  { id: 'w6', name: 'Elena', role: 'inspector', position: [5.8, 0, 14], rotationY: -0.5, animationState: 'inspecting_wheel', targetRound: 2 },
  { id: 'w7', name: 'David', role: 'marshal', position: [-4.2, 0, 6], rotationY: 0.6, animationState: 'waving', targetRound: 3 },
  { id: 'w8', name: 'Alex', role: 'marshal', position: [4.2, 0, 6], rotationY: -0.6, animationState: 'waving', targetRound: 3 },
];

const createInitialTeam = (id: TeamId, name: string): TeamConsoleState => ({
  id,
  name,
  score: 0,
  roundProgress: 0,
  streak: 0,
  attemptsLeft: 2,
  isLocked: false,
  hasSubmitted: false,
  isCorrect: null,
  lastFeedback: null,
  activeMisconception: null,
  selectedOption: null,
  selectedOptionValue: null,
  selectedStep: 3,
  builderStart: 4,
  builderStep: 3,
  computedOutput: 10,
  selectedOperator: '+',
  selectedOperand: 3,
  hybridStep: 3,
  hybridOutput: 20,
  raceControls: {
    throttle: 0,
    steer: 0,
    speedKmh: 0,
    nitroRemaining: 100,
    nitroCharges: 2,
    maxNitroCharges: 2,
    nitroActive: false,
    laneOffset: id === 'blue' ? -2.0 : 2.0,
    distanceCovered: 0,
    trackProgress: 0,
    rpm: 2500,
    gear: 1,
    isHeldByHeadStart: false,
    hasAdvantage: false,
    advantageDescription: '',
  },
  powerUps: initialTeamPowerUps(),
  multiplierActive: false,
  surgeActive: false,
  eliminatedOptions: [],
});

interface PatternRacersState {
  phase: GamePhase;
  currentRound: RoundNumber;
  currentQuestion: PatternQuestion;
  questionIndex: number;
  activeChallenge: SequenceChallenge; // kept for legacy 3D machines
  timeRemaining: number;
  isTimerRunning: boolean;

  // Signal Lights: 3 Starting Lamps [Lamp1, Lamp2, Lamp3] (true = Green, false = Red)
  signalLights: [boolean, boolean, boolean];

  // 3-2-1 Countdown state
  countdownValue: number | 'GO' | null;

  // Head Start state
  headStartTeam: TeamId | null;
  headStartSeconds: number;
  headStartRestraintActive: boolean;

  // Physical Vehicles
  blueVehicle: VehiclePhysicsState;
  redVehicle: VehiclePhysicsState;
  workers: FacilityWorker[];

  // Game Results & View
  raceWinner: TeamId | 'tie' | null;
  activeCameraView: 1 | 2 | 3;
  splitViewMode: boolean;
  roughWorkOpen: boolean;

  // Dual Team Consoles
  blueTeam: TeamConsoleState;
  redTeam: TeamConsoleState;

  // Actions
  setGamePhase: (phase: GamePhase) => void;
  advanceRound: (hasPhysicalMovement?: boolean) => void;
  submitAnswer: (teamId: TeamId) => void;
  selectOption: (teamId: TeamId, optionId: 'A' | 'B' | 'C' | 'D', value: number | string) => void;
  resetRoundSubmission: (teamId: TeamId) => void;

  // Team input setters
  setSelectedStep: (teamId: TeamId, step: number) => void;
  setBuilderStart: (teamId: TeamId, val: number) => void;
  setBuilderStep: (teamId: TeamId, val: number) => void;
  setComputedOutput: (teamId: TeamId, output: number) => void;
  setSelectedOperator: (teamId: TeamId, op: '+' | '-' | '×' | '÷') => void;
  setSelectedOperand: (teamId: TeamId, val: number) => void;
  setHybridStep: (teamId: TeamId, val: number) => void;
  setHybridOutput: (teamId: TeamId, val: number) => void;

  // Live Stage 5 Race Controls
  pressThrottle: (teamId: TeamId) => void;
  releaseThrottle: (teamId: TeamId) => void;
  pressBrake: (teamId: TeamId) => void;
  releaseBrake: (teamId: TeamId) => void;
  startSteering: (teamId: TeamId, direction: 'left' | 'right') => void;
  stopSteering: (teamId: TeamId) => void;
  triggerNitro: (teamId: TeamId) => void;
  updateRacePhysics: (delta: number) => void;

  // Power-Ups
  use5050: (teamId: TeamId) => void;
  useTimeFreeze: (teamId: TeamId) => void;
  use2x: (teamId: TeamId) => void;

  // Utilities
  setActiveCameraView: (view: 1 | 2 | 3) => void;
  setSplitViewMode: (split: boolean) => void;
  toggleRoughWork: () => void;
  resetGame: () => void;
}

export const usePatternStore = create<PatternRacersState>((set, get) => ({
  phase: 'intro',
  currentRound: 1,
  questionIndex: 0,
  currentQuestion: getQuestionForRound(1, 0),
  activeChallenge: {
    id: 'pr_legacy_01',
    round: 1,
    skill: 'sequence_step',
    difficulty: 'easy',
    title: 'GARAGE TELEMETRY & IGNITION',
    stageName: 'STAGE 1: GARAGE DEPARTURE',
    instruction: 'Select the correct option to energize ignition and advance to the next stage.',
    sequence: [2, 4, 6, 8, 10],
    commonDifference: 2,
    expectedStep: 2,
    misconceptionTip: 'Look at the step between numbers: 4 - 2 = 2.',
    mathExplanation: 'Constant step added is 2.',
  },
  timeRemaining: 45,
  isTimerRunning: false,

  // Start with 3 RED lights: [false, false, false]
  signalLights: [false, false, false],
  countdownValue: null,
  headStartTeam: null,
  headStartSeconds: 3.5,
  headStartRestraintActive: false,

  blueVehicle: {
    teamId: 'blue',
    flowState: 'garage_idle',
    worldPosition: VEHICLE_COORDINATES.garageStart.blue,
    rotationY: 0,
    speed: 0,
    rpm: 2500,
    boostActive: false,
    isRacing: false,
    distanceTraveled: 0,
    finishedRace: false,
  },

  redVehicle: {
    teamId: 'red',
    flowState: 'garage_idle',
    worldPosition: VEHICLE_COORDINATES.garageStart.red,
    rotationY: 0,
    speed: 0,
    rpm: 2500,
    boostActive: false,
    isRacing: false,
    distanceTraveled: 0,
    finishedRace: false,
  },

  workers: INITIAL_WORKERS,
  raceWinner: null,
  activeCameraView: 1,
  splitViewMode: true,
  roughWorkOpen: false,

  blueTeam: createInitialTeam('blue', 'Blue Velocity'),
  redTeam: createInitialTeam('red', 'Red Turbo'),

  setGamePhase: (phase) => set({ phase }),

  // ── OPTION SELECTION (A, B, C, D) ──
  selectOption: (teamId, optionId, value) => {
    set((s) => {
      const targetTeam = teamId === 'blue' ? s.blueTeam : s.redTeam;
      if (targetTeam.isLocked) return {};
      const updated: TeamConsoleState = {
        ...targetTeam,
        selectedOption: optionId,
        selectedOptionValue: value,
      };
      return teamId === 'blue' ? { blueTeam: updated } : { redTeam: updated };
    });
  },

  // ── SUBMIT ANSWER (Evaluates math & updates physical state) ──
  submitAnswer: (teamId) => {
    const state = get();
    const q = state.currentQuestion;
    const team = teamId === 'blue' ? state.blueTeam : state.redTeam;
    if (team.isLocked) return;

    // Check if an option was selected
    const selectedVal = team.selectedOptionValue !== null ? team.selectedOptionValue : team.selectedOption;
    const isCorrect = String(selectedVal) === String(q.correctAnswer);
    const points = isCorrect ? (team.multiplierActive ? 200 : 100) : 0;
    const feedback = isCorrect ? '✓ CORRECT! +100 PTS' : '✗ INCORRECT';

    set((s) => {
      const updatedTeam: TeamConsoleState = {
        ...(teamId === 'blue' ? s.blueTeam : s.redTeam),
        score: (teamId === 'blue' ? s.blueTeam.score : s.redTeam.score) + points,
        isCorrect,
        hasSubmitted: true,
        isLocked: true,
        lastFeedback: feedback,
        activeMisconception: isCorrect ? null : q.misconceptionTip,
      };

      return teamId === 'blue' ? { blueTeam: updatedTeam } : { redTeam: updatedTeam };
    });

    const nextState = get();
    const blueDone = nextState.blueTeam.hasSubmitted;
    const redDone = nextState.redTeam.hasSubmitted;
    const anyCorrect = nextState.blueTeam.isCorrect || nextState.redTeam.isCorrect;

    // If at least one team was correct -> advance with physical movement after 1.4s
    if (anyCorrect) {
      setTimeout(() => {
        get().advanceRound(true);
      }, 1400);
    } else if (blueDone && redDone) {
      // If BOTH are submitted and BOTH are wrong -> move onto next question but cars remain in same place!
      setTimeout(() => {
        get().advanceRound(false);
      }, 1800);
    }
  },

  resetRoundSubmission: (teamId) => {
    set((s) => {
      const targetTeam = teamId === 'blue' ? s.blueTeam : s.redTeam;
      const updated = {
        ...targetTeam,
        hasSubmitted: false,
        isCorrect: null,
        isLocked: false,
        selectedOption: null,
        selectedOptionValue: null,
        lastFeedback: null,
      };
      return teamId === 'blue' ? { blueTeam: updated } : { redTeam: updated };
    });
  },

  // ── ADVANCE ROUND (5-Round Continuous Physical Journey) ──
  advanceRound: (hasPhysicalMovement: boolean = true) => {
    const { currentRound, blueTeam, redTeam, questionIndex } = get();
    const nextQIdx = questionIndex + 1;

    // ─────────────────────────────────────────────────────────────
    // TRANSITION 1 -> 2: GARAGE DEPARTURE (Garage -> Pit Lane)
    // ─────────────────────────────────────────────────────────────
    if (currentRound === 1) {
      if (hasPhysicalMovement) {
        set({
          phase: 'phase_transition',
          activeCameraView: 1,
          blueVehicle: { ...get().blueVehicle, flowState: 'garage_to_pit', speed: 30, rpm: 4000 },
          redVehicle: { ...get().redVehicle, flowState: 'garage_to_pit', speed: 30, rpm: 4000 },
        });

        const startTime = Date.now();
        const durationMs = 3000;

        const anim = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(1.0, elapsed / durationMs);
          const ease = progress * progress * (3 - 2 * progress);

          // Blue drives from [-8.5, 0.25, 22] -> [-4.5, 0.25, 14]
          const bx = -8.5 + ease * 4.0;
          const bz = 22 - ease * 8.0;

          // Red drives from [8.5, 0.25, 22] -> [4.5, 0.25, 14]
          const rx = 8.5 - ease * 4.0;
          const rz = 22 - ease * 8.0;

          set((s) => ({
            blueVehicle: {
              ...s.blueVehicle,
              worldPosition: [bx, 0.25, bz],
              speed: progress < 0.9 ? 25 : 0,
            },
            redVehicle: {
              ...s.redVehicle,
              worldPosition: [rx, 0.25, rz],
              speed: progress < 0.9 ? 25 : 0,
            },
          }));

          if (progress >= 1.0) {
            clearInterval(anim);
            set({
              phase: 'round_active',
              currentRound: 2,
              questionIndex: nextQIdx,
              currentQuestion: getQuestionForRound(2, nextQIdx),
              activeCameraView: 2,
              signalLights: [false, false, false], // [🔴 🔴 🔴]
              blueVehicle: {
                ...get().blueVehicle,
                flowState: 'pit_inspection',
                worldPosition: VEHICLE_COORDINATES.pitInspection.blue,
                speed: 0,
                rpm: 2800,
              },
              redVehicle: {
                ...get().redVehicle,
                flowState: 'pit_inspection',
                worldPosition: VEHICLE_COORDINATES.pitInspection.red,
                speed: 0,
                rpm: 2800,
              },
              blueTeam: { ...get().blueTeam, isLocked: false, hasSubmitted: false, isCorrect: null, selectedOption: null, selectedOptionValue: null, lastFeedback: null },
              redTeam: { ...get().redTeam, isLocked: false, hasSubmitted: false, isCorrect: null, selectedOption: null, selectedOptionValue: null, lastFeedback: null },
            });
          }
        }, 30);
      } else {
        // Both wrong: Move to Q2 without moving cars
        set({
          phase: 'round_active',
          currentRound: 2,
          questionIndex: nextQIdx,
          currentQuestion: getQuestionForRound(2, nextQIdx),
          activeCameraView: 1,
          signalLights: [false, false, false],
          blueTeam: { ...get().blueTeam, isLocked: false, hasSubmitted: false, isCorrect: null, selectedOption: null, selectedOptionValue: null, lastFeedback: null },
          redTeam: { ...get().redTeam, isLocked: false, hasSubmitted: false, isCorrect: null, selectedOption: null, selectedOptionValue: null, lastFeedback: null },
        });
      }
      return;
    }

    // ─────────────────────────────────────────────────────────────
    // TRANSITION 2 -> 3: PIT INSPECTION -> STARTING GRID
    // ─────────────────────────────────────────────────────────────
    if (currentRound === 2) {
      if (hasPhysicalMovement) {
        set({
          phase: 'phase_transition',
          activeCameraView: 2,
          blueVehicle: { ...get().blueVehicle, flowState: 'pit_to_grid', speed: 30, rpm: 4500 },
          redVehicle: { ...get().redVehicle, flowState: 'pit_to_grid', speed: 30, rpm: 4500 },
        });

        const startTime = Date.now();
        const durationMs = 3000;

        const anim = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(1.0, elapsed / durationMs);
          const ease = progress * progress * (3 - 2 * progress);

          // Blue drives from [-4.5, 0.25, 14] -> [-2.0, 0.25, 6] (Grid Box 1)
          const bx = -4.5 + ease * 2.5;
          const bz = 14 - ease * 8.0;

          // Red drives from [4.5, 0.25, 14] -> [2.0, 0.25, 6] (Grid Box 2)
          const rx = 4.5 - ease * 2.5;
          const rz = 14 - ease * 8.0;

          set((s) => ({
            blueVehicle: {
              ...s.blueVehicle,
              worldPosition: [bx, 0.25, bz],
              speed: progress < 0.9 ? 25 : 0,
            },
            redVehicle: {
              ...s.redVehicle,
              worldPosition: [rx, 0.25, rz],
              speed: progress < 0.9 ? 25 : 0,
            },
          }));

          if (progress >= 1.0) {
            clearInterval(anim);
            set({
              phase: 'round_active',
              currentRound: 3,
              questionIndex: nextQIdx,
              currentQuestion: getQuestionForRound(3, nextQIdx),
              activeCameraView: 2,
              // 1st Green Signal turns ON: [🟢 🔴 🔴]
              signalLights: [true, false, false],
              blueVehicle: {
                ...get().blueVehicle,
                flowState: 'grid_rev_stage_1',
                worldPosition: VEHICLE_COORDINATES.startingGrid.blue,
                speed: 0,
                rpm: 4500,
              },
              redVehicle: {
                ...get().redVehicle,
                flowState: 'grid_rev_stage_1',
                worldPosition: VEHICLE_COORDINATES.startingGrid.red,
                speed: 0,
                rpm: 4500,
              },
              blueTeam: { ...get().blueTeam, isLocked: false, hasSubmitted: false, isCorrect: null, selectedOption: null, selectedOptionValue: null, lastFeedback: null },
              redTeam: { ...get().redTeam, isLocked: false, hasSubmitted: false, isCorrect: null, selectedOption: null, selectedOptionValue: null, lastFeedback: null },
            });
          }
        }, 30);
      } else {
        // Both wrong: Move to Q3, 1st light turns green, cars stay in place
        set({
          phase: 'round_active',
          currentRound: 3,
          questionIndex: nextQIdx,
          currentQuestion: getQuestionForRound(3, nextQIdx),
          activeCameraView: 2,
          signalLights: [true, false, false],
          blueTeam: { ...get().blueTeam, isLocked: false, hasSubmitted: false, isCorrect: null, selectedOption: null, selectedOptionValue: null, lastFeedback: null },
          redTeam: { ...get().redTeam, isLocked: false, hasSubmitted: false, isCorrect: null, selectedOption: null, selectedOptionValue: null, lastFeedback: null },
        });
      }
      return;
    }

    // ─────────────────────────────────────────────────────────────
    // TRANSITION 3 -> 4: GRID REVVING + 2ND GREEN SIGNAL
    // ─────────────────────────────────────────────────────────────
    if (currentRound === 3) {
      set({
        currentRound: 4,
        questionIndex: nextQIdx,
        currentQuestion: getQuestionForRound(4, nextQIdx),
        activeCameraView: 2,
        // 2nd Green Signal turns ON: [🟢 🟢 🔴]
        signalLights: [true, true, false],
        blueVehicle: {
          ...get().blueVehicle,
          flowState: 'grid_rev_stage_2',
          worldPosition: VEHICLE_COORDINATES.startingGrid.blue,
          rpm: 6500,
        },
        redVehicle: {
          ...get().redVehicle,
          flowState: 'grid_rev_stage_2',
          worldPosition: VEHICLE_COORDINATES.startingGrid.red,
          rpm: 6500,
        },
        blueTeam: { ...get().blueTeam, isLocked: false, hasSubmitted: false, isCorrect: null, selectedOption: null, selectedOptionValue: null, lastFeedback: null },
        redTeam: { ...get().redTeam, isLocked: false, hasSubmitted: false, isCorrect: null, selectedOption: null, selectedOptionValue: null, lastFeedback: null },
      });
      return;
    }

    // ─────────────────────────────────────────────────────────────
    // TRANSITION 4 -> 5: FINAL LAUNCH CHALLENGE
    // ─────────────────────────────────────────────────────────────
    if (currentRound === 4) {
      set({
        currentRound: 5,
        questionIndex: nextQIdx,
        currentQuestion: getQuestionForRound(5, nextQIdx),
        activeCameraView: 2,
        signalLights: [true, true, false], // Pre-countdown: [🟢 🟢 🔴]
        blueVehicle: {
          ...get().blueVehicle,
          flowState: 'grid_countdown',
          worldPosition: VEHICLE_COORDINATES.startingGrid.blue,
          rpm: 8500,
        },
        redVehicle: {
          ...get().redVehicle,
          flowState: 'grid_countdown',
          worldPosition: VEHICLE_COORDINATES.startingGrid.red,
          rpm: 8500,
        },
        blueTeam: { ...get().blueTeam, isLocked: false, hasSubmitted: false, isCorrect: null, selectedOption: null, selectedOptionValue: null, lastFeedback: null },
        redTeam: { ...get().redTeam, isLocked: false, hasSubmitted: false, isCorrect: null, selectedOption: null, selectedOptionValue: null, lastFeedback: null },
      });
      return;
    }

    // ─────────────────────────────────────────────────────────────
    // ROUND 5 COMPLETE: 3-2-1 COUNTDOWN & LIVE GRAND PRIX RACE LAUNCH
    // ─────────────────────────────────────────────────────────────
    if (currentRound === 5) {
      // 1. All 3 Signals Turn GREEN: [🟢 🟢 🟢]
      set({
        phase: 'pre_race_countdown',
        signalLights: [true, true, true],
        countdownValue: 3, // CONTROLS HUD APPEARS AT 3!
      });

      // Calculate Advantage for Head Start (3.5 Seconds)
      const bluePts = blueTeam.score;
      const redPts = redTeam.score;
      const blueWonAdvantage = bluePts > redPts;
      const redWonAdvantage = redPts > bluePts;

      const headStartWinner: TeamId | null = blueWonAdvantage ? 'blue' : redWonAdvantage ? 'red' : null;

      set({
        headStartTeam: headStartWinner,
        headStartSeconds: 3.5,
        headStartRestraintActive: headStartWinner !== null,
        blueTeam: {
          ...get().blueTeam,
          raceControls: {
            ...get().blueTeam.raceControls,
            isHeldByHeadStart: headStartWinner === 'red',
            hasAdvantage: blueWonAdvantage,
            nitroCharges: blueWonAdvantage ? 3 : 1,
            advantageDescription: blueWonAdvantage ? '3.5s HEAD START + 3x NITRO BOOST' : '',
          },
        },
        redTeam: {
          ...get().redTeam,
          raceControls: {
            ...get().redTeam.raceControls,
            isHeldByHeadStart: headStartWinner === 'blue',
            hasAdvantage: redWonAdvantage,
            nitroCharges: redWonAdvantage ? 3 : 1,
            advantageDescription: redWonAdvantage ? '3.5s HEAD START + 3x NITRO BOOST' : '',
          },
        },
      });

      // Countdown Step: 3 -> 2
      setTimeout(() => {
        set({ countdownValue: 2 });
        // Countdown Step: 2 -> 1
        setTimeout(() => {
          set({ countdownValue: 1 });
          // Countdown Step: 1 -> GO!
          setTimeout(() => {
            set({
              countdownValue: 'GO',
              phase: 'grand_prix_race',
              activeCameraView: 3,
              blueVehicle: {
                ...get().blueVehicle,
                flowState: 'racing',
                isRacing: true,
                speed: headStartWinner === 'red' ? 0 : 90,
              },
              redVehicle: {
                ...get().redVehicle,
                flowState: 'racing',
                isRacing: true,
                speed: headStartWinner === 'blue' ? 0 : 90,
              },
            });

            // If head start is active, release trailing team after 3.5 seconds!
            if (headStartWinner !== null) {
              setTimeout(() => {
                set((s) => ({
                  headStartRestraintActive: false,
                  blueTeam: {
                    ...s.blueTeam,
                    raceControls: { ...s.blueTeam.raceControls, isHeldByHeadStart: false },
                  },
                  redTeam: {
                    ...s.redTeam,
                    raceControls: { ...s.redTeam.raceControls, isHeldByHeadStart: false },
                  },
                }));
              }, 3500);
            }

            // Hide GO text after 1.2s
            setTimeout(() => set({ countdownValue: null }), 1200);
          }, 1000);
        }, 1000);
      }, 1000);
    }
  },

  // ── LIVE RACE CONTROLS & PHYSICS ──
  pressThrottle: (teamId) => {
    set((s) => {
      const targetTeam = teamId === 'blue' ? s.blueTeam : s.redTeam;
      if (targetTeam.raceControls.isHeldByHeadStart) return {}; // Held by head start

      const updated = {
        ...targetTeam,
        raceControls: { ...targetTeam.raceControls, throttle: 1.0 },
      };
      return teamId === 'blue' ? { blueTeam: updated } : { redTeam: updated };
    });
  },

  releaseThrottle: (teamId) => {
    set((s) => {
      const targetTeam = teamId === 'blue' ? s.blueTeam : s.redTeam;
      const updated = {
        ...targetTeam,
        raceControls: { ...targetTeam.raceControls, throttle: 0 },
      };
      return teamId === 'blue' ? { blueTeam: updated } : { redTeam: updated };
    });
  },

  pressBrake: (teamId) => {
    set((s) => {
      const targetTeam = teamId === 'blue' ? s.blueTeam : s.redTeam;
      const updated = {
        ...targetTeam,
        raceControls: { ...targetTeam.raceControls, throttle: -0.8 },
      };
      return teamId === 'blue' ? { blueTeam: updated } : { redTeam: updated };
    });
  },

  releaseBrake: (teamId) => {
    set((s) => {
      const targetTeam = teamId === 'blue' ? s.blueTeam : s.redTeam;
      const updated = {
        ...targetTeam,
        raceControls: { ...targetTeam.raceControls, throttle: 0 },
      };
      return teamId === 'blue' ? { blueTeam: updated } : { redTeam: updated };
    });
  },

  startSteering: (teamId, direction) => {
    set((s) => {
      const targetTeam = teamId === 'blue' ? s.blueTeam : s.redTeam;
      const steerVal = direction === 'left' ? -1.0 : 1.0;
      const updated = {
        ...targetTeam,
        raceControls: { ...targetTeam.raceControls, steer: steerVal },
      };
      return teamId === 'blue' ? { blueTeam: updated } : { redTeam: updated };
    });
  },

  stopSteering: (teamId) => {
    set((s) => {
      const targetTeam = teamId === 'blue' ? s.blueTeam : s.redTeam;
      const updated = {
        ...targetTeam,
        raceControls: { ...targetTeam.raceControls, steer: 0 },
      };
      return teamId === 'blue' ? { blueTeam: updated } : { redTeam: updated };
    });
  },

  triggerNitro: (teamId) => {
    const state = get();
    const team = teamId === 'blue' ? state.blueTeam : state.redTeam;
    if (team.raceControls.nitroCharges <= 0 || team.raceControls.nitroActive) return;

    set((s) => {
      const targetTeam = teamId === 'blue' ? s.blueTeam : s.redTeam;
      const updated = {
        ...targetTeam,
        raceControls: {
          ...targetTeam.raceControls,
          nitroActive: true,
          nitroCharges: targetTeam.raceControls.nitroCharges - 1,
        },
      };
      return teamId === 'blue'
        ? { blueTeam: updated, blueVehicle: { ...s.blueVehicle, boostActive: true } }
        : { redTeam: updated, redVehicle: { ...s.redVehicle, boostActive: true } };
    });

    setTimeout(() => {
      set((s) => {
        const targetTeam = teamId === 'blue' ? s.blueTeam : s.redTeam;
        const updated = {
          ...targetTeam,
          raceControls: { ...targetTeam.raceControls, nitroActive: false },
        };
        return teamId === 'blue'
          ? { blueTeam: updated, blueVehicle: { ...s.blueVehicle, boostActive: false } }
          : { redTeam: updated, redVehicle: { ...s.redVehicle, boostActive: false } };
      });
    }, 2800);
  },

  // ── UPDATE 60 FPS RACE KINEMATICS ──
  updateRacePhysics: (delta) => {
    const state = get();
    if (state.phase !== 'grand_prix_race') return;

    // Constrain delta to prevent huge physics jumps on frame drop
    const dt = Math.min(0.05, Math.max(0.001, delta));

    let bProgress = state.blueTeam.raceControls.trackProgress;
    let rProgress = state.redTeam.raceControls.trackProgress;
    let bSpeed = state.blueTeam.raceControls.speedKmh;
    let rSpeed = state.redTeam.raceControls.speedKmh;
    let bLane = state.blueTeam.raceControls.laneOffset ?? -1.8;
    let rLane = state.redTeam.raceControls.laneOffset ?? 1.8;

    const bSteer = state.blueTeam.raceControls.steer || 0;
    const rSteer = state.redTeam.raceControls.steer || 0;

    // ── 1. BLUE VEHICLE ACCELERATION & STEERING ──
    if (!state.blueTeam.raceControls.isHeldByHeadStart) {
      // Base engine idle gives forward momentum, GAS roars up to 330, BRAKE slows down
      let bAccel = 0;
      if (state.blueTeam.raceControls.throttle > 0) {
        bAccel = 150;
      } else if (state.blueTeam.raceControls.throttle < 0) {
        bAccel = -200;
      } else {
        // Natural idle rolling / wind drag
        bAccel = bSpeed < 100 ? 50 : -25;
      }

      if (state.blueTeam.raceControls.nitroActive) {
        bAccel += 240;
      }

      bSpeed = Math.max(20, Math.min(360, bSpeed + bAccel * dt));
      bProgress += (bSpeed / 3600) * dt * 2.8;

      // Steering lateral shift
      bLane += bSteer * 5.2 * dt;
    }

    // ── 2. RED VEHICLE ACCELERATION & STEERING ──
    if (!state.redTeam.raceControls.isHeldByHeadStart) {
      let rAccel = 0;
      if (state.redTeam.raceControls.throttle > 0) {
        rAccel = 150;
      } else if (state.redTeam.raceControls.throttle < 0) {
        rAccel = -200;
      } else {
        rAccel = rSpeed < 100 ? 50 : -25;
      }

      if (state.redTeam.raceControls.nitroActive) {
        rAccel += 240;
      }

      rSpeed = Math.max(20, Math.min(360, rSpeed + rAccel * dt));
      rProgress += (rSpeed / 3600) * dt * 2.8;

      // Steering lateral shift
      rLane += rSteer * 5.2 * dt;
    }

    // ── 3. TRACK BARRIER BOUNDARY CLAMPING (Cannot pass buildings/fences) ──
    const ROAD_BOUNDARY_LIMIT = 3.8; // +/- 3.8 meters track edge
    if (bLane < -ROAD_BOUNDARY_LIMIT) {
      bLane = -ROAD_BOUNDARY_LIMIT;
      bSpeed = Math.max(20, bSpeed - 30 * dt); // Barrier scrape friction
    } else if (bLane > ROAD_BOUNDARY_LIMIT) {
      bLane = ROAD_BOUNDARY_LIMIT;
      bSpeed = Math.max(20, bSpeed - 30 * dt);
    }

    if (rLane < -ROAD_BOUNDARY_LIMIT) {
      rLane = -ROAD_BOUNDARY_LIMIT;
      rSpeed = Math.max(20, rSpeed - 30 * dt);
    } else if (rLane > ROAD_BOUNDARY_LIMIT) {
      rLane = ROAD_BOUNDARY_LIMIT;
      rSpeed = Math.max(20, rSpeed - 30 * dt);
    }

    // ── 4. CAR-TO-CAR PHYSICAL COLLISION REBOUND ──
    const progressDiff = Math.abs(bProgress - rProgress);
    const lateralDiff = Math.abs(bLane - rLane);
    const COLLISION_LENGTH = 0.016; // ~12m spline proximity
    const COLLISION_WIDTH = 1.75;   // ~1.75m lateral vehicle width

    if (progressDiff < COLLISION_LENGTH && lateralDiff < COLLISION_WIDTH) {
      // Elastic rebound impulse - push apart laterally
      const pushForce = 3.8 * dt;
      if (bLane < rLane) {
        bLane = Math.max(-ROAD_BOUNDARY_LIMIT, bLane - pushForce);
        rLane = Math.min(ROAD_BOUNDARY_LIMIT, rLane + pushForce);
      } else {
        bLane = Math.min(ROAD_BOUNDARY_LIMIT, bLane + pushForce);
        rLane = Math.max(-ROAD_BOUNDARY_LIMIT, rLane - pushForce);
      }

      // Mutual collision impact deceleration
      bSpeed = Math.max(25, bSpeed * 0.94 - 15 * dt);
      rSpeed = Math.max(25, rSpeed * 0.94 - 15 * dt);
    }

    // ── 5. CALCULATE 3D SPLINE POSITION & ROTATION ──
    const bPt = getTrackPointAt(Math.min(1.0, bProgress));
    const rPt = getTrackPointAt(Math.min(1.0, rProgress));

    const bPos: [number, number, number] = [
      bPt.x + bPt.normalX * bLane,
      0.25,
      bPt.z + bPt.normalZ * bLane,
    ];
    const rPos: [number, number, number] = [
      rPt.x + rPt.normalX * rLane,
      0.25,
      rPt.z + rPt.normalZ * rLane,
    ];

    // Check Finish Line
    let winner = state.raceWinner;
    if (!winner) {
      if (bProgress >= TRACK_FINISH_PROGRESS && rProgress >= TRACK_FINISH_PROGRESS) {
        winner = bProgress >= rProgress ? 'blue' : 'red';
      } else if (bProgress >= TRACK_FINISH_PROGRESS) {
        winner = 'blue';
      } else if (rProgress >= TRACK_FINISH_PROGRESS) {
        winner = 'red';
      }
    }

    set((s) => ({
      raceWinner: winner,
      blueVehicle: {
        ...s.blueVehicle,
        worldPosition: bPos,
        rotationY: bPt.angle + bSteer * 0.1,
        speed: bSpeed,
        finishedRace: bProgress >= TRACK_FINISH_PROGRESS,
      },
      redVehicle: {
        ...s.redVehicle,
        worldPosition: rPos,
        rotationY: rPt.angle + rSteer * 0.1,
        speed: rSpeed,
        finishedRace: rProgress >= TRACK_FINISH_PROGRESS,
      },
      blueTeam: {
        ...s.blueTeam,
        raceControls: {
          ...s.blueTeam.raceControls,
          trackProgress: bProgress,
          laneOffset: bLane,
          speedKmh: Math.round(bSpeed),
          rpm: Math.round(3200 + (bSpeed / 360) * 8800),
        },
      },
      redTeam: {
        ...s.redTeam,
        raceControls: {
          ...s.redTeam.raceControls,
          trackProgress: rProgress,
          laneOffset: rLane,
          speedKmh: Math.round(rSpeed),
          rpm: Math.round(3200 + (rSpeed / 360) * 8800),
        },
      },
    }));
  },

  // Input Setters
  setSelectedStep: (teamId, step) =>
    set((s) => (teamId === 'blue' ? { blueTeam: { ...s.blueTeam, selectedStep: step } } : { redTeam: { ...s.redTeam, selectedStep: step } })),
  setBuilderStart: (teamId, val) =>
    set((s) => (teamId === 'blue' ? { blueTeam: { ...s.blueTeam, builderStart: val } } : { redTeam: { ...s.redTeam, builderStart: val } })),
  setBuilderStep: (teamId, val) =>
    set((s) => (teamId === 'blue' ? { blueTeam: { ...s.blueTeam, builderStep: val } } : { redTeam: { ...s.redTeam, builderStep: val } })),
  setComputedOutput: (teamId, output) =>
    set((s) => (teamId === 'blue' ? { blueTeam: { ...s.blueTeam, computedOutput: output } } : { redTeam: { ...s.redTeam, computedOutput: output } })),
  setSelectedOperator: (teamId, op) =>
    set((s) => (teamId === 'blue' ? { blueTeam: { ...s.blueTeam, selectedOperator: op } } : { redTeam: { ...s.redTeam, selectedOperator: op } })),
  setSelectedOperand: (teamId, val) =>
    set((s) => (teamId === 'blue' ? { blueTeam: { ...s.blueTeam, selectedOperand: val } } : { redTeam: { ...s.redTeam, selectedOperand: val } })),
  setHybridStep: (teamId, val) =>
    set((s) => (teamId === 'blue' ? { blueTeam: { ...s.blueTeam, hybridStep: val } } : { redTeam: { ...s.redTeam, hybridStep: val } })),
  setHybridOutput: (teamId, val) =>
    set((s) => (teamId === 'blue' ? { blueTeam: { ...s.blueTeam, hybridOutput: val } } : { redTeam: { ...s.redTeam, hybridOutput: val } })),

  // Power-Ups
  use5050: (teamId) => {
    set((s) => {
      const q = s.currentQuestion;
      const targetTeam = teamId === 'blue' ? s.blueTeam : s.redTeam;
      if (!targetTeam.powerUps.fiftyFifty) return {};

      // Find wrong options to eliminate (up to 2)
      const wrongOptions = q.options
        .filter((o) => String(o.value) !== String(q.correctAnswer))
        .slice(0, 2)
        .map((o) => o.id);

      const updated: TeamConsoleState = {
        ...targetTeam,
        powerUps: { ...targetTeam.powerUps, fiftyFifty: false },
        eliminatedOptions: wrongOptions,
      };

      return teamId === 'blue' ? { blueTeam: updated } : { redTeam: updated };
    });
  },

  useTimeFreeze: (teamId) => {
    set((s) => {
      const targetTeam = teamId === 'blue' ? s.blueTeam : s.redTeam;
      if (!targetTeam.powerUps.timeFreeze) return {};

      const updated: TeamConsoleState = {
        ...targetTeam,
        powerUps: { ...targetTeam.powerUps, timeFreeze: false },
      };

      return {
        timeRemaining: s.timeRemaining + 10,
        ...(teamId === 'blue' ? { blueTeam: updated } : { redTeam: updated }),
      };
    });
  },

  use2x: (teamId) => {
    set((s) => {
      const targetTeam = teamId === 'blue' ? s.blueTeam : s.redTeam;
      if (!targetTeam.powerUps.doublePoints) return {};

      const updated: TeamConsoleState = {
        ...targetTeam,
        multiplierActive: true,
        powerUps: { ...targetTeam.powerUps, doublePoints: false },
      };

      return teamId === 'blue' ? { blueTeam: updated } : { redTeam: updated };
    });
  },

  setActiveCameraView: (view) => set({ activeCameraView: view }),
  setSplitViewMode: (split) => set({ splitViewMode: split }),
  toggleRoughWork: () => set((s) => ({ roughWorkOpen: !s.roughWorkOpen })),

  resetGame: () => {
    set({
      phase: 'round_active',
      currentRound: 1,
      questionIndex: 0,
      currentQuestion: getQuestionForRound(1, 0),
      signalLights: [false, false, false],
      countdownValue: null,
      headStartTeam: null,
      headStartRestraintActive: false,
      raceWinner: null,
      activeCameraView: 1,
      blueVehicle: {
        teamId: 'blue',
        flowState: 'garage_idle',
        worldPosition: VEHICLE_COORDINATES.garageStart.blue,
        rotationY: 0,
        speed: 0,
        rpm: 2500,
        boostActive: false,
        isRacing: false,
        distanceTraveled: 0,
        finishedRace: false,
      },
      redVehicle: {
        teamId: 'red',
        flowState: 'garage_idle',
        worldPosition: VEHICLE_COORDINATES.garageStart.red,
        rotationY: 0,
        speed: 0,
        rpm: 2500,
        boostActive: false,
        isRacing: false,
        distanceTraveled: 0,
        finishedRace: false,
      },
      blueTeam: createInitialTeam('blue', 'Blue Velocity'),
      redTeam: createInitialTeam('red', 'Red Turbo'),
    });
  },
}));
