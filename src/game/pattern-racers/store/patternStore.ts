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
import {
  setInputFlag, clearInputs, requestBoost,
  stageAtGarages, stageAtGrid, startRace,
  startGarageToTyreBay, startTyreBayToGrid,
  type HudSnapshot,
} from '../engine/raceSim';
import { PatternQuestion, getQuestionForRound, rollSessionQuestions } from '../engine/questionBank';
import { patternAudio } from '../engine/patternAudio';

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
  /** Absorbs the sim's throttled 10 Hz snapshot. Never called per frame. */
  syncRaceHud: (snap: HudSnapshot) => void;

  // Power-Ups
  use5050: (teamId: TeamId) => void;
  useTimeFreeze: (teamId: TeamId) => void;
  use2x: (teamId: TeamId) => void;

  // Utilities
  setSplitViewMode: (split: boolean) => void;
  toggleRoughWork: () => void;
  resetGame: () => void;
}


/** Seconds the trailing car is physically restrained on its grid box. */
const HEAD_START_SECONDS = 3.5;

/**
 * Clear a team's per-question answer state so the next round starts clean.
 * Score, streak and power-ups deliberately carry over.
 */
function resetTeamForRound(team: TeamConsoleState): TeamConsoleState {
  return {
    ...team,
    hasSubmitted: false,
    isCorrect: null,
    isLocked: false,
    attemptsLeft: 2,
    selectedOption: null,
    selectedOptionValue: null,
    lastFeedback: null,
    activeMisconception: null,
    eliminatedOptions: [],
  };
}

/**
 * Stamp the race advantage onto a team. The winning team gets an extra nitro
 * charge; the losing team is the one HELD at the start. Note that nothing here
 * touches a position -- the advantage is time, not geometry.
 */
function withAdvantage(
  team: TeamConsoleState,
  hasAdvantage: boolean,
  isHeld: boolean
): TeamConsoleState {
  return {
    ...team,
    raceControls: {
      ...team.raceControls,
      hasAdvantage,
      isHeldByHeadStart: isHeld,
      nitroCharges: hasAdvantage ? 3 : 2,
      advantageDescription: hasAdvantage
        ? `${HEAD_START_SECONDS}s HEAD START + 3x NITRO BOOST`
        : '',
    },
  };
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

    // ---------------------------------------------------------------
    // 1 -> 2: GARAGE DEPARTURE. Out of the bay, down the pit lane,
    // into the tyre/service area.
    //
    // This is a CINEMATIC, but the sim drives it with the same
    // throttle/brake/steer a player uses, so the cars follow the real
    // pit road, face the way they travel, and still collide with
    // things. The old wall-clock setInterval lerp is gone.
    // ---------------------------------------------------------------
    if (currentRound === 1) {
      if (hasPhysicalMovement) {
        set({ phase: 'phase_transition' });

        let arrived = 0;
        startGarageToTyreBay(() => {
          arrived += 1;
          if (arrived < 2) return;

          set({
            phase: 'round_active',
            currentRound: 2,
            questionIndex: nextQIdx,
            currentQuestion: getQuestionForRound(2, nextQIdx),
            signalLights: [false, false, false],
            blueTeam: resetTeamForRound(get().blueTeam),
            redTeam: resetTeamForRound(get().redTeam),
          });
        });
      } else {
        set({
          currentRound: 2,
          questionIndex: nextQIdx,
          currentQuestion: getQuestionForRound(2, nextQIdx),
          blueTeam: resetTeamForRound(blueTeam),
          redTeam: resetTeamForRound(redTeam),
        });
      }
      return;
    }

    // ---------------------------------------------------------------
    // 2 -> 3: TYRE BAY -> PIT EXIT -> STARTING GRID
    // ---------------------------------------------------------------
    if (currentRound === 2) {
      if (hasPhysicalMovement) {
        set({ phase: 'phase_transition' });

        let arrived = 0;
        startTyreBayToGrid(() => {
          arrived += 1;
          if (arrived < 2) return;

          // Lock both cars to their exact grid transforms. Rounds 3, 4 and 5
          // re-assert this, so the cars cannot drift between questions.
          stageAtGrid();
          patternAudio.playStartLightBeep(true);
          // Cars are on their marks now: hold the revs under the question.
          patternAudio.startRev();

          set({
            phase: 'round_active',
            currentRound: 3,
            questionIndex: nextQIdx,
            currentQuestion: getQuestionForRound(3, nextQIdx),
            signalLights: [true, false, false],
            blueTeam: resetTeamForRound(get().blueTeam),
            redTeam: resetTeamForRound(get().redTeam),
          });
        });
      } else {
        stageAtGrid();
        set({
          currentRound: 3,
          questionIndex: nextQIdx,
          currentQuestion: getQuestionForRound(3, nextQIdx),
          signalLights: [true, false, false],
          blueTeam: resetTeamForRound(blueTeam),
          redTeam: resetTeamForRound(redTeam),
        });
      }
      return;
    }

    // ---------------------------------------------------------------
    // 3 -> 4: stationary on the grid, second lamp goes green.
    // ---------------------------------------------------------------
    if (currentRound === 3) {
      stageAtGrid();
      patternAudio.playStartLightBeep(true);
      set({
        currentRound: 4,
        questionIndex: nextQIdx,
        currentQuestion: getQuestionForRound(4, nextQIdx),
        signalLights: [true, true, false],
        blueTeam: resetTeamForRound(blueTeam),
        redTeam: resetTeamForRound(redTeam),
      });
      return;
    }

    // ---------------------------------------------------------------
    // 4 -> 5: final launch question. Still stationary.
    // ---------------------------------------------------------------
    if (currentRound === 4) {
      stageAtGrid();
      set({
        currentRound: 5,
        questionIndex: nextQIdx,
        currentQuestion: getQuestionForRound(5, nextQIdx),
        signalLights: [true, true, false],
        blueTeam: resetTeamForRound(blueTeam),
        redTeam: resetTeamForRound(redTeam),
      });
      return;
    }

    // ---------------------------------------------------------------
    // 5: LIGHTS OUT. 3 -> 2 -> 1 -> GO, then live driving.
    // ---------------------------------------------------------------
    if (currentRound === 5) {
      stageAtGrid();
      // Lights-out sequence takes over from the holding revs.
      patternAudio.stopRev();

      const blueWon = blueTeam.score > redTeam.score;
      const redWon = redTeam.score > blueTeam.score;
      // The better-performing team gets the advantage; the OTHER car is
      // restrained. The advantage is purely TIME -- no car is ever moved
      // forwards or backwards to create it.
      const advantageTeam: TeamId | null = blueWon ? 'blue' : redWon ? 'red' : null;
      const heldTeam: TeamId | null = blueWon ? 'red' : redWon ? 'blue' : null;

      set({
        phase: 'pre_race_countdown',
        signalLights: [true, true, true],
        countdownValue: 3, // controls HUD appears here
        headStartTeam: advantageTeam,
        headStartSeconds: HEAD_START_SECONDS,
        headStartRestraintActive: heldTeam !== null,
        blueTeam: withAdvantage(get().blueTeam, blueWon, heldTeam === 'blue'),
        redTeam: withAdvantage(get().redTeam, redWon, heldTeam === 'red'),
      });

      patternAudio.playStartLightBeep(false);

      setTimeout(() => {
        set({ countdownValue: 2 });
        patternAudio.playStartLightBeep(false);

        setTimeout(() => {
          set({ countdownValue: 1 });
          patternAudio.playStartLightBeep(false);

          setTimeout(() => {
            set({ countdownValue: 'GO', phase: 'grand_prix_race' });
            patternAudio.playStartLightBeep(true);

            // Hand the world to the player. From this instant the only thing
            // that moves a car is player input through the vehicle model.
            startRace(heldTeam, HEAD_START_SECONDS);

            if (heldTeam) {
              setTimeout(() => {
                set((st) => ({
                  headStartRestraintActive: false,
                  blueTeam: {
                    ...st.blueTeam,
                    raceControls: { ...st.blueTeam.raceControls, isHeldByHeadStart: false },
                  },
                  redTeam: {
                    ...st.redTeam,
                    raceControls: { ...st.redTeam.raceControls, isHeldByHeadStart: false },
                  },
                }));
              }, HEAD_START_SECONDS * 1000);
            }

            setTimeout(() => set({ countdownValue: null }), 1200);
          }, 1000);
        }, 1000);
      }, 1000);
    }
  },

  // ---- LIVE RACE CONTROLS ----
  // These only set input FLAGS. No action in this store ever writes a car's
  // position, heading or speed -- engine/raceSim.ts is the sole authority.

  pressThrottle: (teamId) => setInputFlag(teamId, 'accel', true),
  releaseThrottle: (teamId) => setInputFlag(teamId, 'accel', false),
  pressBrake: (teamId) => setInputFlag(teamId, 'brake', true),
  releaseBrake: (teamId) => setInputFlag(teamId, 'brake', false),

  startSteering: (teamId, direction) => {
    // Set one direction and explicitly clear the other, so a held key cannot
    // leave both pinned.
    setInputFlag(teamId, 'left', direction === 'left');
    setInputFlag(teamId, 'right', direction === 'right');
  },
  stopSteering: (teamId) => {
    setInputFlag(teamId, 'left', false);
    setInputFlag(teamId, 'right', false);
  },

  triggerNitro: (teamId) => {
    requestBoost(teamId);
    patternAudio.playPowerUp2x();
  },

  // ---- HUD SYNC ----
  // Called ten times a second from the sim, never per frame. This is what
  // keeps 60 Hz driving from re-rendering the whole React tree.
  syncRaceHud: (snap) => {
    set((st) => {
      const winner = snap.winner ?? st.raceWinner;
      return {
        raceWinner: winner,
        blueVehicle: {
          ...st.blueVehicle,
          speed: snap.blue.speedKmh,
          rpm: snap.blue.rpm,
          boostActive: snap.blue.boostActive,
          isRacing: st.phase === 'grand_prix_race',
          finishedRace: snap.blue.finished,
        },
        redVehicle: {
          ...st.redVehicle,
          speed: snap.red.speedKmh,
          rpm: snap.red.rpm,
          boostActive: snap.red.boostActive,
          isRacing: st.phase === 'grand_prix_race',
          finishedRace: snap.red.finished,
        },
        blueTeam: {
          ...st.blueTeam,
          raceControls: {
            ...st.blueTeam.raceControls,
            speedKmh: snap.blue.speedKmh,
            rpm: snap.blue.rpm,
            gear: snap.blue.gear,
            trackProgress: snap.blue.lapProgress,
            nitroActive: snap.blue.boostActive,
            nitroCharges: snap.blue.boostCharges,
            isHeldByHeadStart: snap.blue.held,
          },
        },
        redTeam: {
          ...st.redTeam,
          raceControls: {
            ...st.redTeam.raceControls,
            speedKmh: snap.red.speedKmh,
            rpm: snap.red.rpm,
            gear: snap.red.gear,
            trackProgress: snap.red.lapProgress,
            nitroActive: snap.red.boostActive,
            nitroCharges: snap.red.boostCharges,
            isHeldByHeadStart: snap.red.held,
          },
        },
      };
    });
  },

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

  setSplitViewMode: (split) => set({ splitViewMode: split }),
  toggleRoughWork: () => set((s) => ({ roughWorkOpen: !s.roughWorkOpen })),

  resetGame: () => {
    // A restart is a COMPLETE restart. Previously the round counter reset but
    // the cars stayed wherever they had finished, so the next garage-departure
    // cinematic started from the middle of the circuit and could never reach
    // its mark. Now the physical world is rewound too: fresh questions, cars
    // back inside their garages, and the whole garage -> pit -> grid journey
    // replayed from the top.
    rollSessionQuestions();
    stageAtGarages();
    clearInputs();
    patternAudio.stopAllEngines();

    set({
      phase: 'intro',
      currentRound: 1,
      questionIndex: 0,
      currentQuestion: getQuestionForRound(1, 0),
      signalLights: [false, false, false],
      countdownValue: null,
      headStartTeam: null,
      headStartRestraintActive: false,
      raceWinner: null,
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
