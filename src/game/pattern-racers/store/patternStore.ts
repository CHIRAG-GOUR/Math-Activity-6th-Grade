// ============================================================
// PATTERN RACERS — Central Zustand Store
// Dual-Team Simultaneous Interaction & 5-Stage Physical Grand Prix System:
// - Stage 1: Factory Telemetry & Diagnostics (Engine Checks)
// - Stage 2: Rapid Pit Stop Tire Change (Hydraulic Lifts)
// - Stage 3: Factory Rollout onto Pit Lane
// - Stage 4: Starting Grid Staging & Stadium Alignment
// - Stage 5: Live Interactive Grand Prix Racing Duel with Cockpit Controls!
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
  LiveRaceControls,
} from '../types';
import { initialTeamPowerUps } from '@/types/powerUps';
import { getChallengesForRound, generateDynamicChallenge } from '../engine/sequenceData';
import { patternAudio } from '../engine/patternAudio';
import { getMisconceptionHint } from '@/utils/misconceptions';

let timerInterval: ReturnType<typeof setInterval> | null = null;
let raceInterval: ReturnType<typeof setInterval> | null = null;
let autoAdvanceTimer: ReturnType<typeof setTimeout> | null = null;

const clearTimers = () => {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  if (raceInterval) {
    clearInterval(raceInterval);
    raceInterval = null;
  }
  if (autoAdvanceTimer) {
    clearTimeout(autoAdvanceTimer);
    autoAdvanceTimer = null;
  }
};

import { getTrackPointAt, TRACK_FINISH_PROGRESS, TRACK_TOTAL_LENGTH_METERS } from '../engine/trackPath';

const defaultRaceControls = (
  initialLane: 'left' | 'right',
  hasAdvantage: boolean = false,
  advantageDescription: string = ''
): LiveRaceControls => ({
  throttle: 0,
  steer: 0,
  speedKmh: 120,
  nitroRemaining: 100,
  nitroCharges: hasAdvantage ? 3 : 1,
  maxNitroCharges: hasAdvantage ? 3 : 1,
  nitroActive: false,
  laneOffset: initialLane === 'left' ? -1.8 : 1.8,
  lane: initialLane === 'left' ? 'left' : 'right',
  distanceCovered: 0,
  trackProgress: 0,
  rpm: 4500,
  gear: 3,
  topSpeedMax: hasAdvantage ? 360 : 290,
  hasAdvantage,
  advantageDescription,
});

interface PatternState {
  phase: GamePhase;
  currentRound: RoundNumber;
  activeChallenge: SequenceChallenge;
  questionCountConfig: 5 | 10 | 15 | 20;
  questionIndex: number;
  totalQuestions: number;
  timeRemaining: number;

  // Dual Team States
  blueTeam: TeamConsoleState;
  redTeam: TeamConsoleState;

  // 3D Physical World Simulation
  blueVehicle: VehiclePhysicsState;
  redVehicle: VehiclePhysicsState;
  trackCompletion: number;
  functionMachineActive: boolean;
  activeCapsuleValue: number | null;
  trackBuilderDeploying: boolean;
  raceLights: [boolean, boolean, boolean, boolean, boolean]; // 3 Red, 1 Yellow, 1 Green
  raceWinner: TeamId | 'tie' | null;

  // Sudden death tie breaker
  isTieBreak: boolean;
  tieBreakTimer: number;

  // Facility Workers
  workers: FacilityWorker[];

  // Actions
  setQuestionCount: (count: 5 | 10 | 15 | 20) => void;
  startMatch: () => void;
  updateBlueStep: (step: number) => void;
  updateRedStep: (step: number) => void;
  updateBlueBuilder: (start: number, step: number, dir: 'increasing' | 'decreasing') => void;
  updateRedBuilder: (start: number, step: number, dir: 'increasing' | 'decreasing') => void;
  updateBlueOutput: (val: number) => void;
  updateRedOutput: (val: number) => void;
  updateBlueOperator: (op: '+' | '-' | '×' | '÷', val: number) => void;
  updateRedOperator: (op: '+' | '-' | '×' | '÷', val: number) => void;
  updateBlueHybrid: (step: number, output: number) => void;
  updateRedHybrid: (step: number, output: number) => void;

  // Live Stage 5 Racing Cockpit Actions
  pressThrottle: (teamId: TeamId) => void;
  releaseThrottle: (teamId: TeamId) => void;
  pressBrake: (teamId: TeamId) => void;
  releaseBrake: (teamId: TeamId) => void;
  setSteerInput: (teamId: TeamId, steerVal: number) => void;
  triggerNitro: (teamId: TeamId) => void;
  switchLane: (teamId: TeamId, direction: 'left' | 'right') => void;
  applyVirtualJoystick: (teamId: TeamId, joy: { x: number; y: number }) => void;

  submitAnswer: (teamId: TeamId) => void;
  handleTimerExpired: () => void;
  usePowerUp5050: (teamId: TeamId) => void;
  usePowerUpTimeFreeze: (teamId: TeamId) => void;
  usePowerUp2x: (teamId: TeamId) => void;
  advanceRound: () => void;
  startLiveGrandPrixRace: () => void;
  startTieBreak: () => void;
  restartGame: () => void;
}

const INITIAL_WORKERS: FacilityWorker[] = [
  { id: 'w1', name: 'Blue Lead Engineer', role: 'mechanic', position: [-3.8, 0, 5.2], rotationY: -0.5, animationState: 'typing', targetRound: 1 },
  { id: 'w2', name: 'Blue Pit Technician', role: 'telemetry', position: [-6.8, 0, 3.2], rotationY: 0.8, animationState: 'working', targetRound: 1 },
  { id: 'w3', name: 'Red Lead Engineer', role: 'mechanic', position: [3.8, 0, 5.2], rotationY: 0.5, animationState: 'typing', targetRound: 1 },
  { id: 'w4', name: 'Red Pit Technician', role: 'telemetry', position: [6.8, 0, 3.2], rotationY: -0.8, animationState: 'working', targetRound: 1 },
  { id: 'w5', name: 'Hydraulics Specialist', role: 'engineer', position: [-4.2, 0, 1.2], rotationY: 1.2, animationState: 'working', targetRound: 2 },
  { id: 'w6', name: 'Telemetry Scientist', role: 'telemetry', position: [3.6, 0, -4.5], rotationY: -1.4, animationState: 'typing', targetRound: 3 },
  { id: 'w7', name: 'Chief Track Marshal', role: 'marshal', position: [5.2, 0, 4.2], rotationY: -1.6, animationState: 'waving', targetRound: 4 },
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
  selectedStep: 3,
  builderStart: 20,
  builderStep: -3,
  builderDirection: 'decreasing',
  computedOutput: 10,
  selectedOperator: '×',
  selectedOperand: 3,
  hybridStep: 3,
  hybridOutput: 15,
  raceControls: defaultRaceControls(id === 'blue' ? 'left' : 'right'),
  powerUps: initialTeamPowerUps(),
  multiplierActive: false,
  surgeActive: false,
  eliminatedOptions: [],
});

const createInitialVehicle = (teamId: TeamId): VehiclePhysicsState => ({
  teamId,
  stage: 'garage_diagnostics',
  worldPosition: teamId === 'blue' ? [-2.2, 0.25, 6] : [2.2, 0.25, 6],
  rotationY: 0,
  liftY: 0,
  wheelsDetached: false,
  speed: 0,
  boostActive: false,
  isRacing: false,
  distanceTraveled: 0,
  finishedRace: false,
});

export const usePatternStore = create<PatternState>((set, get) => ({
  phase: 'intro',
  currentRound: 1,
  activeChallenge: getChallengesForRound(1)[0] || generateDynamicChallenge(1, 1),
  questionCountConfig: 5,
  questionIndex: 0,
  totalQuestions: 5,
  timeRemaining: 45,

  blueTeam: createInitialTeam('blue', 'Blue Velocity'),
  redTeam: createInitialTeam('red', 'Red Turbo'),

  blueVehicle: createInitialVehicle('blue'),
  redVehicle: createInitialVehicle('red'),

  trackCompletion: 0,
  functionMachineActive: false,
  activeCapsuleValue: null,
  trackBuilderDeploying: false,
  raceLights: [false, false, false, false, false],
  raceWinner: null,

  isTieBreak: false,
  tieBreakTimer: 15,
  workers: INITIAL_WORKERS,

  setQuestionCount: (count) => {
    set({
      questionCountConfig: count,
      totalQuestions: count,
    });
  },

  startMatch: () => {
    clearTimers();
    patternAudio.playEngineRev();
    patternAudio.startBgm();

    const firstChallenge = getChallengesForRound(1)[0] || generateDynamicChallenge(1, 101);
    set({
      phase: 'round_active',
      currentRound: 1,
      questionIndex: 0,
      activeChallenge: firstChallenge,
      trackCompletion: 0,
      timeRemaining: 45,
      blueTeam: createInitialTeam('blue', 'Blue Velocity'),
      redTeam: createInitialTeam('red', 'Red Turbo'),
      blueVehicle: createInitialVehicle('blue'),
      redVehicle: createInitialVehicle('red'),
    });

    // 1-Second Timer Interval
    timerInterval = setInterval(() => {
      const state = get();
      if (state.phase !== 'round_active' && state.phase !== 'tie_break') return;

      if (state.timeRemaining > 1) {
        set({ timeRemaining: state.timeRemaining - 1 });
      } else {
        set({ timeRemaining: 0 });
        get().handleTimerExpired();
      }
    }, 1000);
  },

  updateBlueStep: (step) => {
    patternAudio.playDialClick();
    set((state) => ({
      blueTeam: { ...state.blueTeam, selectedStep: step },
    }));
  },

  updateRedStep: (step) => {
    patternAudio.playDialClick();
    set((state) => ({
      redTeam: { ...state.redTeam, selectedStep: step },
    }));
  },

  updateBlueBuilder: (start, step, dir) => {
    patternAudio.playDialClick();
    set((state) => ({
      blueTeam: {
        ...state.blueTeam,
        builderStart: start,
        builderStep: step,
        builderDirection: dir,
      },
    }));
  },

  updateRedBuilder: (start, step, dir) => {
    patternAudio.playDialClick();
    set((state) => ({
      redTeam: {
        ...state.redTeam,
        builderStart: start,
        builderStep: step,
        builderDirection: dir,
      },
    }));
  },

  updateBlueOutput: (val) => {
    patternAudio.playDialClick();
    set((state) => ({
      blueTeam: { ...state.blueTeam, computedOutput: val },
    }));
  },

  updateRedOutput: (val) => {
    patternAudio.playDialClick();
    set((state) => ({
      redTeam: { ...state.redTeam, computedOutput: val },
    }));
  },

  updateBlueOperator: (op, val) => {
    patternAudio.playDialClick();
    set((state) => ({
      blueTeam: { ...state.blueTeam, selectedOperator: op, selectedOperand: val },
    }));
  },

  updateRedOperator: (op, val) => {
    patternAudio.playDialClick();
    set((state) => ({
      redTeam: { ...state.redTeam, selectedOperator: op, selectedOperand: val },
    }));
  },

  updateBlueHybrid: (step, output) => {
    patternAudio.playDialClick();
    set((state) => ({
      blueTeam: { ...state.blueTeam, hybridStep: step, hybridOutput: output },
    }));
  },

  updateRedHybrid: (step, output) => {
    patternAudio.playDialClick();
    set((state) => ({
      redTeam: { ...state.redTeam, hybridStep: step, hybridOutput: output },
    }));
  },

  // ── LIVE STAGE 5 COCKPIT CONTROLS ──
  pressThrottle: (teamId) => {
    patternAudio.playEngineRev();
    set((state) => {
      const teamKey = teamId === 'blue' ? 'blueTeam' : 'redTeam';
      const team = state[teamKey];
      const curControls = team.raceControls;
      const newThrottle = Math.min(100, curControls.throttle + 30);
      const targetSpeed = Math.min(curControls.topSpeedMax, curControls.speedKmh + 22);

      return {
        [teamKey]: {
          ...team,
          raceControls: {
            ...curControls,
            throttle: newThrottle,
            speedKmh: targetSpeed,
            rpm: Math.min(12000, 4500 + newThrottle * 65),
            gear: Math.min(8, Math.floor(targetSpeed / 42) + 1),
          },
        },
      };
    });
  },

  releaseThrottle: (teamId) => {
    set((state) => {
      const teamKey = teamId === 'blue' ? 'blueTeam' : 'redTeam';
      const team = state[teamKey];
      return {
        [teamKey]: {
          ...team,
          raceControls: {
            ...team.raceControls,
            throttle: Math.max(0, team.raceControls.throttle - 25),
          },
        },
      };
    });
  },

  pressBrake: (teamId) => {
    patternAudio.playPneumaticDepressurize();
    set((state) => {
      const teamKey = teamId === 'blue' ? 'blueTeam' : 'redTeam';
      const team = state[teamKey];
      const curControls = team.raceControls;
      const newSpeed = Math.max(50, curControls.speedKmh - 35);
      return {
        [teamKey]: {
          ...team,
          raceControls: {
            ...curControls,
            throttle: 0,
            speedKmh: newSpeed,
            rpm: Math.max(2500, curControls.rpm - 2000),
            gear: Math.max(1, Math.floor(newSpeed / 45) + 1),
          },
        },
      };
    });
  },

  releaseBrake: (teamId) => {
    // Return to neutral deceleration
  },

  setSteerInput: (teamId, steerVal) => {
    set((state) => {
      const teamKey = teamId === 'blue' ? 'blueTeam' : 'redTeam';
      const team = state[teamKey];
      const clampedSteer = Math.max(-1, Math.min(1, steerVal));
      const newLaneOffset = Math.max(-3.5, Math.min(3.5, team.raceControls.laneOffset + clampedSteer * 0.45));
      const lane = newLaneOffset < -1.2 ? 'left' : newLaneOffset > 1.2 ? 'right' : 'center';

      return {
        [teamKey]: {
          ...team,
          raceControls: {
            ...team.raceControls,
            steer: clampedSteer,
            laneOffset: newLaneOffset,
            lane,
          },
        },
      };
    });
  },

  triggerNitro: (teamId) => {
    patternAudio.playPowerUp2x();
    set((state) => {
      const teamKey = teamId === 'blue' ? 'blueTeam' : 'redTeam';
      const vehicleKey = teamId === 'blue' ? 'blueVehicle' : 'redVehicle';
      const team = state[teamKey];
      if (team.raceControls.nitroCharges <= 0 && team.raceControls.nitroRemaining <= 0) return state;

      return {
        [teamKey]: {
          ...team,
          raceControls: {
            ...team.raceControls,
            nitroActive: true,
            speedKmh: team.raceControls.topSpeedMax,
            rpm: 12200,
          },
        },
        [vehicleKey]: {
          ...state[vehicleKey],
          boostActive: true,
        },
      };
    });
  },

  switchLane: (teamId, direction) => {
    patternAudio.playDialClick();
    set((state) => {
      const teamKey = teamId === 'blue' ? 'blueTeam' : 'redTeam';
      const team = state[teamKey];
      const delta = direction === 'left' ? -1.4 : 1.4;
      const newOffset = Math.max(-3.5, Math.min(3.5, team.raceControls.laneOffset + delta));
      const lane = newOffset < -1.2 ? 'left' : newOffset > 1.2 ? 'right' : 'center';

      return {
        [teamKey]: {
          ...team,
          raceControls: {
            ...team.raceControls,
            laneOffset: newOffset,
            lane,
            steer: direction === 'left' ? -0.5 : 0.5,
          },
        },
      };
    });
  },

  applyVirtualJoystick: (teamId, joy) => {
    // joy.x in [-1, 1], joy.y in [-1, 1] (y > 0 = up / accelerate, y < 0 = down / brake)
    set((state) => {
      const teamKey = teamId === 'blue' ? 'blueTeam' : 'redTeam';
      const team = state[teamKey];
      const cur = team.raceControls;

      let newThrottle = cur.throttle;
      let newSpeed = cur.speedKmh;

      if (joy.y > 0.1) {
        newThrottle = Math.min(100, Math.round(joy.y * 100));
        newSpeed = Math.min(cur.topSpeedMax, cur.speedKmh + joy.y * 15);
      } else if (joy.y < -0.2) {
        newThrottle = 0;
        newSpeed = Math.max(50, cur.speedKmh - Math.abs(joy.y) * 20);
      }

      const steerDelta = joy.x * 0.35;
      const newOffset = Math.max(-3.5, Math.min(3.5, cur.laneOffset + steerDelta));
      const lane = newOffset < -1.2 ? 'left' : newOffset > 1.2 ? 'right' : 'center';

      return {
        [teamKey]: {
          ...team,
          raceControls: {
            ...cur,
            throttle: newThrottle,
            speedKmh: Math.round(newSpeed),
            steer: joy.x,
            laneOffset: newOffset,
            lane,
            rpm: Math.min(12000, 3500 + newThrottle * 70),
            gear: Math.min(8, Math.floor(newSpeed / 42) + 1),
          },
        },
      };
    });
  },

  // ── SUBMIT ANSWER (Dual Simultaneous Interaction) ──
  submitAnswer: (teamId) => {
    const { activeChallenge, currentRound, blueTeam, redTeam, isTieBreak } = get();
    const team = teamId === 'blue' ? blueTeam : redTeam;
    const opponent = teamId === 'blue' ? redTeam : blueTeam;

    if (team.isLocked || team.hasSubmitted) return;

    let isCorrect = false;

    if (currentRound === 1) {
      isCorrect = team.selectedStep === activeChallenge.expectedStep;
    } else if (currentRound === 2) {
      const correctStart = (activeChallenge.sequence && activeChallenge.sequence[0]) || activeChallenge.startValue || 20;
      isCorrect =
        team.builderStart === correctStart &&
        team.builderStep === activeChallenge.expectedStep;
    } else if (currentRound === 3) {
      isCorrect = team.computedOutput === activeChallenge.expectedOutput;
    } else if (currentRound === 4) {
      isCorrect =
        team.selectedOperator === activeChallenge.expectedOperator &&
        team.selectedOperand === activeChallenge.expectedOperand;
    } else if (currentRound === 5) {
      isCorrect =
        team.hybridStep === activeChallenge.expectedStep &&
        team.hybridOutput === activeChallenge.expectedOutput;
    }

    if (isCorrect) {
      patternAudio.playCorrect();
      patternAudio.playHydraulicLock();

      const isSurging = opponent.score - team.score >= 150 || team.surgeActive;
      const basePoints = 100;
      const surgeBonus = isSurging ? 25 : 0;
      const multiplier = team.multiplierActive ? 2 : 1;
      const pointsEarned = (basePoints + surgeBonus) * multiplier;

      // 5-STAGE PHYSICAL WORLD TRANSITION:
      set((state) => {
        const updatedTeam = teamId === 'blue' ? state.blueTeam : state.redTeam;
        const vehicleKey = teamId === 'blue' ? 'blueVehicle' : 'redVehicle';
        const curVehicle = state[vehicleKey];
        const newScore = updatedTeam.score + pointsEarned;
        const newProgress = Math.min(updatedTeam.roundProgress + 1, 5);

        let nextStage = curVehicle.stage;
        let nextPos = [...curVehicle.worldPosition] as [number, number, number];

        if (currentRound === 1) {
          // Stage 1 Solved: Diagnostics complete!
          nextStage = 'pit_tire_change';
        } else if (currentRound === 2) {
          // Stage 2 Solved: Tires swapped! Rollout to pit lane!
          nextStage = 'factory_rollout';
          nextPos = [teamId === 'blue' ? -2.2 : 2.2, 0.25, 4.5];
        } else if (currentRound === 3) {
          // Stage 3 Solved: Function machine charged! Move to Starting Grid!
          nextStage = 'grid_staging';
          nextPos = [teamId === 'blue' ? -2.2 : 0.25, 0.25, 3.5];
        } else if (currentRound === 4) {
          // Stage 4 Solved: Transmission locked on Grid!
          nextStage = 'grid_staging';
          nextPos = [teamId === 'blue' ? -2.2 : 2.2, 0.25, 3.5];
        } else if (currentRound === 5) {
          // Stage 5 Solved: SUPER NITRO SPRINT!
          nextStage = 'live_racing';
        }

        return {
          [teamId === 'blue' ? 'blueTeam' : 'redTeam']: {
            ...updatedTeam,
            score: newScore,
            roundProgress: newProgress,
            streak: updatedTeam.streak + 1,
            isCorrect: true,
            hasSubmitted: true,
            isLocked: true,
            multiplierActive: false,
            lastFeedback: `+${pointsEarned} PTS! ${activeChallenge.mathExplanation}`,
            activeMisconception: null,
          },
          [vehicleKey]: {
            ...curVehicle,
            stage: nextStage,
            boostActive: true,
            worldPosition: nextPos,
          },
          trackCompletion: Math.max(state.trackCompletion, newProgress),
          functionMachineActive: currentRound >= 3,
          activeCapsuleValue: activeChallenge.functionInput || activeChallenge.expectedOutput || null,
          trackBuilderDeploying: currentRound === 2,
        };
      });

      // If in Stage 5, solve gives instant massive nitro burst in race
      if (currentRound === 5) {
        get().triggerNitro(teamId);
      }

      if (isTieBreak) {
        clearTimers();
        set({ raceWinner: teamId, phase: 'podium_ceremony' });
        return;
      }

      // Check if should advance round
      clearTimers();
      autoAdvanceTimer = setTimeout(() => {
        const currentPhase = get().phase;
        if (currentPhase === 'round_active') {
          get().advanceRound();
        }
      }, 2200);

    } else {
      patternAudio.playWrong();

      if (team.attemptsLeft > 1) {
        const hint = activeChallenge.misconceptionTip || getMisconceptionHint('numbers', activeChallenge.title);
        set((state) => ({
          [teamId === 'blue' ? 'blueTeam' : 'redTeam']: {
            ...team,
            attemptsLeft: 1,
            activeMisconception: hint,
            lastFeedback: 'Re-calibrate and try once more!',
          },
        }));
      } else {
        const isBlue = teamId === 'blue';
        const otherTeam = isBlue ? redTeam : blueTeam;

        set((state) => ({
          [isBlue ? 'blueTeam' : 'redTeam']: {
            ...team,
            attemptsLeft: 0,
            isLocked: true,
            hasSubmitted: true,
            isCorrect: false,
            lastFeedback: `❌ MISSED: ${activeChallenge.mathExplanation}`,
          },
        }));

        // ── BOTH WRONG CHECK ──
        if (otherTeam.attemptsLeft <= 0 || otherTeam.isLocked) {
          patternAudio.playPneumaticDepressurize();

          set((state) => ({
            blueTeam: {
              ...state.blueTeam,
              isLocked: true,
              lastFeedback: `❌ BOTH TEAMS MISSED! ${activeChallenge.mathExplanation}`,
            },
            redTeam: {
              ...state.redTeam,
              isLocked: true,
              lastFeedback: `❌ BOTH TEAMS MISSED! ${activeChallenge.mathExplanation}`,
            },
            // Keep cars in exact current position (0 movement)
            blueVehicle: { ...state.blueVehicle, boostActive: false },
            redVehicle: { ...state.redVehicle, boostActive: false },
          }));

          clearTimers();
          autoAdvanceTimer = setTimeout(() => {
            if (get().phase === 'round_active') {
              get().advanceRound();
            }
          }, 2500);
        }
      }
    }
  },

  handleTimerExpired: () => {
    const { phase, activeChallenge } = get();
    if (phase !== 'round_active' && phase !== 'tie_break') return;

    patternAudio.playPneumaticDepressurize();

    set((state) => ({
      blueTeam: {
        ...state.blueTeam,
        attemptsLeft: 0,
        isLocked: true,
        isCorrect: false,
        lastFeedback: `⏱️ TIME'S UP! ${activeChallenge.mathExplanation}`,
      },
      redTeam: {
        ...state.redTeam,
        attemptsLeft: 0,
        isLocked: true,
        isCorrect: false,
        lastFeedback: `⏱️ TIME'S UP! ${activeChallenge.mathExplanation}`,
      },
      blueVehicle: { ...state.blueVehicle, boostActive: false },
      redVehicle: { ...state.redVehicle, boostActive: false },
    }));

    clearTimers();
    autoAdvanceTimer = setTimeout(() => {
      if (get().phase === 'round_active') {
        get().advanceRound();
      }
    }, 2500);
  },

  usePowerUp5050: (teamId) => {
    const { currentRound, activeChallenge } = get();
    patternAudio.playPowerUp5050();

    set((state) => {
      const team = teamId === 'blue' ? state.blueTeam : state.redTeam;
      if (!team.powerUps.fiftyFifty) return state;

      let updatedTeam = {
        ...team,
        powerUps: { ...team.powerUps, fiftyFifty: false },
      };

      if (currentRound === 1) {
        updatedTeam.eliminatedOptions = ['-5', '+8', '+12', '-4'];
      } else if (currentRound === 2) {
        const correctStart = (activeChallenge.sequence && activeChallenge.sequence[0]) || activeChallenge.startValue || 20;
        updatedTeam.builderStart = correctStart;
      } else if (currentRound === 3) {
        const correctOut = activeChallenge.expectedOutput || 13;
        updatedTeam.computedOutput = correctOut - 1;
      } else if (currentRound === 4) {
        if (activeChallenge.expectedOperator) updatedTeam.selectedOperator = activeChallenge.expectedOperator;
      } else if (currentRound === 5) {
        if (activeChallenge.expectedStep) updatedTeam.hybridStep = activeChallenge.expectedStep;
      }

      return {
        [teamId === 'blue' ? 'blueTeam' : 'redTeam']: updatedTeam,
      };
    });
  },

  usePowerUpTimeFreeze: (teamId) => {
    patternAudio.playPowerUpFreeze();
    set((state) => {
      const team = teamId === 'blue' ? state.blueTeam : state.redTeam;
      if (!team.powerUps.timeFreeze) return state;

      return {
        timeRemaining: state.timeRemaining + 10,
        [teamId === 'blue' ? 'blueTeam' : 'redTeam']: {
          ...team,
          powerUps: { ...team.powerUps, timeFreeze: false },
        },
      };
    });
  },

  usePowerUp2x: (teamId) => {
    patternAudio.playPowerUp2x();
    set((state) => {
      const team = teamId === 'blue' ? state.blueTeam : state.redTeam;
      if (!team.powerUps.doublePoints) return state;

      return {
        [teamId === 'blue' ? 'blueTeam' : 'redTeam']: {
          ...team,
          multiplierActive: true,
          powerUps: { ...team.powerUps, doublePoints: false, active2x: true },
        },
      };
    });
  },

  advanceRound: () => {
    clearTimers();
    const { currentRound, questionIndex, totalQuestions } = get();
    const nextQIndex = questionIndex + 1;

    if (nextQIndex >= totalQuestions || currentRound >= 5) {
      // Trigger Stage 5 Live Grand Prix Race!
      get().startLiveGrandPrixRace();
      return;
    }

    const nextRound = Math.min(currentRound + 1, 5) as RoundNumber;
    const challengePool = getChallengesForRound(nextRound);
    const nextChallenge = challengePool[nextQIndex % challengePool.length] || generateDynamicChallenge(nextRound, nextQIndex * 37 + 11);

    set((state) => {
      // Update vehicle positions based on new stage
      const bluePos: [number, number, number] =
        nextRound === 2 ? [-2.2, 0.25, 6] :
        nextRound === 3 ? [-2.2, 0.25, 4.5] :
        nextRound === 4 ? [-2.2, 0.25, 3.5] :
        [-2.2, 0.25, 3.5];

      const redPos: [number, number, number] =
        nextRound === 2 ? [2.2, 0.25, 6] :
        nextRound === 3 ? [2.2, 0.25, 4.5] :
        nextRound === 4 ? [2.2, 0.25, 3.5] :
        [2.2, 0.25, 3.5];

      return {
        phase: 'round_active',
        currentRound: nextRound,
        questionIndex: nextQIndex,
        activeChallenge: nextChallenge,
        timeRemaining: 45,
        functionMachineActive: nextRound >= 3,
        trackBuilderDeploying: nextRound === 2,
        blueVehicle: {
          ...state.blueVehicle,
          worldPosition: bluePos,
          stage: nextRound === 2 ? 'pit_tire_change' : nextRound === 3 ? 'factory_rollout' : 'grid_staging',
        },
        redVehicle: {
          ...state.redVehicle,
          worldPosition: redPos,
          stage: nextRound === 2 ? 'pit_tire_change' : nextRound === 3 ? 'factory_rollout' : 'grid_staging',
        },
        blueTeam: {
          ...state.blueTeam,
          attemptsLeft: 2,
          isLocked: false,
          hasSubmitted: false,
          isCorrect: null,
          lastFeedback: null,
          activeMisconception: null,
          eliminatedOptions: [],
        },
        redTeam: {
          ...state.redTeam,
          attemptsLeft: 2,
          isLocked: false,
          hasSubmitted: false,
          isCorrect: null,
          lastFeedback: null,
          activeMisconception: null,
          eliminatedOptions: [],
        },
      };
    });

    // Start timer interval for new stage
    timerInterval = setInterval(() => {
      const state = get();
      if (state.phase !== 'round_active' && state.phase !== 'tie_break') return;

      if (state.timeRemaining > 1) {
        set({ timeRemaining: state.timeRemaining - 1 });
      } else {
        set({ timeRemaining: 0 });
        get().handleTimerExpired();
      }
    }, 1000);
  },

  // ── STAGE 5: LIVE INTERACTIVE GRAND PRIX RACING DUEL ──
  startLiveGrandPrixRace: () => {
    clearTimers();

    const curBlueScore = get().blueTeam.score;
    const curRedScore = get().redTeam.score;
    const blueHasAdvantage = curBlueScore > curRedScore;
    const redHasAdvantage = curRedScore > curBlueScore;
    const isTiedScores = curBlueScore === curRedScore;

    const blueStartProgress = blueHasAdvantage ? 0.025 : 0.0;
    const redStartProgress = redHasAdvantage ? 0.025 : 0.0;

    const bluePt = getTrackPointAt(blueStartProgress);
    const redPt = getTrackPointAt(redStartProgress);

    const blueControls = defaultRaceControls(
      'left',
      blueHasAdvantage,
      blueHasAdvantage
        ? 'POLE POSITION + 3X NITROUS CHARGES (MATH LEADER!)'
        : isTiedScores
        ? 'DEADLOCK GRID DUEL (2X NITROUS)'
        : 'PURSUIT CONTENDER (1X NITROUS)'
    );
    const redControls = defaultRaceControls(
      'right',
      redHasAdvantage,
      redHasAdvantage
        ? 'POLE POSITION + 3X NITROUS CHARGES (MATH LEADER!)'
        : isTiedScores
        ? 'DEADLOCK GRID DUEL (2X NITROUS)'
        : 'PURSUIT CONTENDER (1X NITROUS)'
    );

    if (isTiedScores) {
      blueControls.nitroCharges = 2;
      blueControls.maxNitroCharges = 2;
      redControls.nitroCharges = 2;
      redControls.maxNitroCharges = 2;
    }

    blueControls.trackProgress = blueStartProgress;
    redControls.trackProgress = redStartProgress;

    const initialBluePos: [number, number, number] = [
      bluePt.x + blueControls.laneOffset * bluePt.normalX,
      0.25,
      bluePt.z + blueControls.laneOffset * bluePt.normalZ,
    ];
    const initialRedPos: [number, number, number] = [
      redPt.x + redControls.laneOffset * redPt.normalX,
      0.25,
      redPt.z + redControls.laneOffset * redPt.normalZ,
    ];

    set({
      phase: 'grand_prix_race',
      currentRound: 5,
      raceLights: [true, true, true, false, false], // 3 Red Lights
      blueTeam: { ...get().blueTeam, raceControls: blueControls },
      redTeam: { ...get().redTeam, raceControls: redControls },
      blueVehicle: {
        ...get().blueVehicle,
        worldPosition: initialBluePos,
        rotationY: bluePt.angle,
        isRacing: true,
        speed: 120,
        boostActive: false,
      },
      redVehicle: {
        ...get().redVehicle,
        worldPosition: initialRedPos,
        rotationY: redPt.angle,
        isRacing: true,
        speed: 120,
        boostActive: false,
      },
    });

    patternAudio.playStartLightBeep(false);

    // Light sequence: 3 Red -> Yellow -> GREEN
    setTimeout(() => {
      set({ raceLights: [true, true, true, true, false] });
      patternAudio.playStartLightBeep(false);
    }, 1000);

    setTimeout(() => {
      set({ raceLights: [false, false, false, false, true] }); // GREEN!
      patternAudio.playStartLightBeep(true);
      patternAudio.playEngineRev();

      // High-Frequency Real-time Racing Physics Loop (40 FPS, 25ms tick)
      raceInterval = setInterval(() => {
        const state = get();
        if (state.phase !== 'grand_prix_race') return;

        let bControls = { ...state.blueTeam.raceControls };
        let rControls = { ...state.redTeam.raceControls };

        // ── BLUE CAR SPEED & NITRO SIMULATION ──
        if (bControls.nitroActive) {
          bControls.nitroRemaining = Math.max(0, bControls.nitroRemaining - 0.7);
          bControls.speedKmh = Math.min(bControls.topSpeedMax, bControls.speedKmh + 6);
          if (bControls.nitroRemaining <= 0) {
            if (bControls.nitroCharges > 1) {
              bControls.nitroCharges -= 1;
              bControls.nitroRemaining = 100;
            } else {
              bControls.nitroCharges = 0;
              bControls.nitroActive = false;
            }
          }
        } else if (bControls.throttle > 0) {
          const accelRate = bControls.hasAdvantage ? 3.5 : 2.5;
          bControls.speedKmh = Math.min(bControls.topSpeedMax, bControls.speedKmh + accelRate);
        } else {
          bControls.speedKmh = Math.max(110, bControls.speedKmh - 1.2);
        }

        // ── RED CAR SPEED & NITRO SIMULATION ──
        if (rControls.nitroActive) {
          rControls.nitroRemaining = Math.max(0, rControls.nitroRemaining - 0.7);
          rControls.speedKmh = Math.min(rControls.topSpeedMax, rControls.speedKmh + 6);
          if (rControls.nitroRemaining <= 0) {
            if (rControls.nitroCharges > 1) {
              rControls.nitroCharges -= 1;
              rControls.nitroRemaining = 100;
            } else {
              rControls.nitroCharges = 0;
              rControls.nitroActive = false;
            }
          }
        } else if (rControls.throttle > 0) {
          const accelRate = rControls.hasAdvantage ? 3.5 : 2.5;
          rControls.speedKmh = Math.min(rControls.topSpeedMax, rControls.speedKmh + accelRate);
        } else {
          rControls.speedKmh = Math.max(110, rControls.speedKmh - 1.2);
        }

        // Distance & Progress along Track Spline
        const bMetersPerTick = (bControls.speedKmh * 1000 / 3600) * 0.025;
        const rMetersPerTick = (rControls.speedKmh * 1000 / 3600) * 0.025;

        const newBlueProgress = Math.min(1.0, bControls.trackProgress + bMetersPerTick / TRACK_TOTAL_LENGTH_METERS);
        const newRedProgress = Math.min(1.0, rControls.trackProgress + rMetersPerTick / TRACK_TOTAL_LENGTH_METERS);

        const newBlueDist = Math.min(TRACK_TOTAL_LENGTH_METERS, Math.round(newBlueProgress * TRACK_TOTAL_LENGTH_METERS));
        const newRedDist = Math.min(TRACK_TOTAL_LENGTH_METERS, Math.round(newRedProgress * TRACK_TOTAL_LENGTH_METERS));

        bControls.trackProgress = newBlueProgress;
        bControls.distanceCovered = newBlueDist;
        bControls.rpm = Math.min(12500, Math.round(2500 + (bControls.speedKmh / bControls.topSpeedMax) * 9000 + (bControls.nitroActive ? 1000 : 0)));
        bControls.gear = Math.min(8, Math.max(1, Math.floor(bControls.speedKmh / 42) + 1));

        rControls.trackProgress = newRedProgress;
        rControls.distanceCovered = newRedDist;
        rControls.rpm = Math.min(12500, Math.round(2500 + (rControls.speedKmh / rControls.topSpeedMax) * 9000 + (rControls.nitroActive ? 1000 : 0)));
        rControls.gear = Math.min(8, Math.max(1, Math.floor(rControls.speedKmh / 42) + 1));

        // World 3D Positions computed directly from Track Spline
        const bPt = getTrackPointAt(newBlueProgress);
        const rPt = getTrackPointAt(newRedProgress);

        const bWorldPos: [number, number, number] = [
          bPt.x + bControls.laneOffset * bPt.normalX,
          bPt.y + 0.25,
          bPt.z + bControls.laneOffset * bPt.normalZ,
        ];
        const rWorldPos: [number, number, number] = [
          rPt.x + rControls.laneOffset * rPt.normalX,
          rPt.y + 0.25,
          rPt.z + rControls.laneOffset * rPt.normalZ,
        ];

        set({
          blueTeam: { ...state.blueTeam, raceControls: bControls },
          redTeam: { ...state.redTeam, raceControls: rControls },
          blueVehicle: {
            ...state.blueVehicle,
            worldPosition: bWorldPos,
            rotationY: bPt.angle + bControls.steer * 0.25,
            speed: bControls.speedKmh,
            distanceTraveled: newBlueDist,
            boostActive: bControls.nitroActive,
          },
          redVehicle: {
            ...state.redVehicle,
            worldPosition: rWorldPos,
            rotationY: rPt.angle + rControls.steer * 0.25,
            speed: rControls.speedKmh,
            distanceTraveled: newRedDist,
            boostActive: rControls.nitroActive,
          },
        });

        // Check if either vehicle crosses the Checkered Finish Line (progress >= TRACK_FINISH_PROGRESS)
        if (newBlueProgress >= TRACK_FINISH_PROGRESS || newRedProgress >= TRACK_FINISH_PROGRESS) {
          clearTimers();
          const winner: TeamId | 'tie' =
            newBlueProgress > newRedProgress ? 'blue' : newRedProgress > newBlueProgress ? 'red' : 'tie';

          patternAudio.playCorrect();

          setTimeout(() => {
            if (winner === 'tie') {
              get().startTieBreak();
            } else {
              set({
                raceWinner: winner,
                phase: 'podium_ceremony',
              });
            }
          }, 1500);
        }
      }, 25);
    }, 2000);
  },

  startTieBreak: () => {
    clearTimers();
    const tieChallenge = generateDynamicChallenge(1, 999);
    set({
      phase: 'tie_break',
      isTieBreak: true,
      timeRemaining: 15,
      activeChallenge: tieChallenge,
      blueTeam: { ...get().blueTeam, isLocked: false, hasSubmitted: false, attemptsLeft: 1 },
      redTeam: { ...get().redTeam, isLocked: false, hasSubmitted: false, attemptsLeft: 1 },
    });

    timerInterval = setInterval(() => {
      const state = get();
      if (state.phase !== 'tie_break') return;

      if (state.timeRemaining > 1) {
        set({ timeRemaining: state.timeRemaining - 1 });
      } else {
        set({ timeRemaining: 0 });
        get().handleTimerExpired();
      }
    }, 1000);
  },

  restartGame: () => {
    get().startMatch();
  },
}));
