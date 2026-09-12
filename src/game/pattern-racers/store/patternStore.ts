// ============================================================
// PATTERN RACERS — Central Zustand Store
// Dual-Team Simultaneous Interaction & 3D World Physical Simulation
// Features:
// - Both-Wrong Handshake: Auto-advance with 0 car movement when both teams fail
// - Timer Countdown & Expiration Handling
// - Tactical Power-Ups (50:50, Time Freeze, 2x Boost)
// - 3D Physical Simulation (Hydraulic track elevation, Function machine, Formula racers)
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
} from '../types';
import { initialTeamPowerUps } from '@/types/powerUps';
import { getChallengesForRound, generateDynamicChallenge } from '../engine/sequenceData';
import { patternAudio } from '../engine/patternAudio';
import { getMisconceptionHint } from '@/utils/misconceptions';

let timerInterval: ReturnType<typeof setInterval> | null = null;
let autoAdvanceTimer: ReturnType<typeof setTimeout> | null = null;

const clearTimers = () => {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  if (autoAdvanceTimer) {
    clearTimeout(autoAdvanceTimer);
    autoAdvanceTimer = null;
  }
};

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
  trackCompletion: number; // 0 to 5 completed sectors
  functionMachineActive: boolean;
  activeCapsuleValue: number | null;
  trackBuilderDeploying: boolean;
  raceLights: [boolean, boolean, boolean, boolean, boolean]; // 3 Red, 1 Yellow, 1 Green
  raceWinner: TeamId | 'tie' | null;

  // Sudden death tie breaker
  isTieBreak: boolean;
  tieBreakTimer: number;

  // Facility Workers (Properly Grounded at Designated Stations)
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
  submitAnswer: (teamId: TeamId) => void;
  handleTimerExpired: () => void;
  usePowerUp5050: (teamId: TeamId) => void;
  usePowerUpTimeFreeze: (teamId: TeamId) => void;
  usePowerUp2x: (teamId: TeamId) => void;
  advanceRound: () => void;
  startFinalRace: () => void;
  startTieBreak: () => void;
  restartGame: () => void;
}

const INITIAL_WORKERS: FacilityWorker[] = [
  { id: 'w1', name: 'Blue Lead Engineer', role: 'mechanic', position: [-4.2, 0, 4.8], rotationY: -0.5, animationState: 'typing', targetRound: 1 },
  { id: 'w2', name: 'Blue Pit Technician', role: 'telemetry', position: [-7.2, 0, 2.2], rotationY: 0.8, animationState: 'working', targetRound: 1 },
  { id: 'w3', name: 'Red Lead Engineer', role: 'mechanic', position: [4.2, 0, 4.8], rotationY: 0.5, animationState: 'typing', targetRound: 1 },
  { id: 'w4', name: 'Red Pit Technician', role: 'telemetry', position: [7.2, 0, 2.2], rotationY: -0.8, animationState: 'working', targetRound: 1 },
  { id: 'w5', name: 'Hydraulics Specialist', role: 'engineer', position: [-4.6, 0, -1.2], rotationY: 1.2, animationState: 'working', targetRound: 2 },
  { id: 'w6', name: 'Telemetry Scientist', role: 'telemetry', position: [3.6, 0, -6.5], rotationY: -1.4, animationState: 'typing', targetRound: 3 },
  { id: 'w7', name: 'Chief Track Marshal', role: 'marshal', position: [5.2, 0, -18.5], rotationY: -1.6, animationState: 'waving', targetRound: 5 },
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
  powerUps: initialTeamPowerUps(),
  multiplierActive: false,
  surgeActive: false,
  eliminatedOptions: [],
});

const createInitialVehicle = (teamId: TeamId): VehiclePhysicsState => ({
  teamId,
  progress: 0,
  currentSector: 0,
  worldPosition: teamId === 'blue' ? [-2.2, 0.25, 6] : [2.2, 0.25, 6],
  rotationY: 0,
  speed: 0,
  boostActive: false,
  isRacing: false,
  lapTime: 0,
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

    // Start 1-second interval timer
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

  // ── SUBMIT ANSWER (Simultaneous Dual Interaction) ──
  submitAnswer: (teamId) => {
    const { activeChallenge, currentRound, blueTeam, redTeam, isTieBreak } = get();
    const team = teamId === 'blue' ? blueTeam : redTeam;
    const opponent = teamId === 'blue' ? redTeam : blueTeam;

    if (team.isLocked || team.hasSubmitted) return;

    let isCorrect = false;

    if (currentRound === 1) {
      // Step dial check
      isCorrect = team.selectedStep === activeChallenge.expectedStep;
    } else if (currentRound === 2) {
      // Sequence builder check (Start & Step)
      const correctStart = (activeChallenge.sequence && activeChallenge.sequence[0]) || activeChallenge.startValue || 20;
      isCorrect =
        team.builderStart === correctStart &&
        team.builderStep === activeChallenge.expectedStep;
    } else if (currentRound === 3) {
      // Function output check
      isCorrect = team.computedOutput === activeChallenge.expectedOutput;
    } else if (currentRound === 4) {
      // Function operator + operand check
      isCorrect =
        team.selectedOperator === activeChallenge.expectedOperator &&
        team.selectedOperand === activeChallenge.expectedOperand;
    } else if (currentRound === 5) {
      // Hybrid sequence step + output check
      isCorrect =
        team.hybridStep === activeChallenge.expectedStep &&
        team.hybridOutput === activeChallenge.expectedOutput;
    }

    if (isCorrect) {
      patternAudio.playCorrect();
      patternAudio.playHydraulicLock();

      // Check Comeback Surge (+25% bonus)
      const isSurging = opponent.score - team.score >= 150 || team.surgeActive;
      const basePoints = 100;
      const surgeBonus = isSurging ? 25 : 0;
      const multiplier = team.multiplierActive ? 2 : 1;
      const pointsEarned = (basePoints + surgeBonus) * multiplier;

      // Physical 3D Machine activation trigger
      set((state) => {
        const updatedTeam = teamId === 'blue' ? state.blueTeam : state.redTeam;
        const newScore = updatedTeam.score + pointsEarned;
        const newProgress = Math.min(updatedTeam.roundProgress + 1, 5);

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
          trackCompletion: Math.max(state.trackCompletion, newProgress),
          functionMachineActive: currentRound >= 3,
          activeCapsuleValue: activeChallenge.functionInput || activeChallenge.expectedOutput || null,
          trackBuilderDeploying: currentRound === 2,
        };
      });

      // Advance ONLY the winning vehicle in 3D world
      const vehicleKey = teamId === 'blue' ? 'blueVehicle' : 'redVehicle';
      set((state) => ({
        [vehicleKey]: {
          ...state[vehicleKey],
          currentSector: state[vehicleKey].currentSector + 1,
          boostActive: true,
          worldPosition: [
            state[vehicleKey].worldPosition[0],
            state[vehicleKey].worldPosition[1],
            state[vehicleKey].worldPosition[2] - 2.5,
          ],
        },
      }));

      // Check if sudden death tie-break instant win
      if (isTieBreak) {
        clearTimers();
        set({
          raceWinner: teamId,
          phase: 'podium_ceremony',
        });
        return;
      }

      // Automatically advance round after celebration delay
      clearTimers();
      autoAdvanceTimer = setTimeout(() => {
        const currentPhase = get().phase;
        if (currentPhase === 'round_active') {
          get().advanceRound();
        }
      }, 2200);

    } else {
      // ── WRONG ANSWER ──
      patternAudio.playWrong();

      if (team.attemptsLeft > 1) {
        // 1st Mistake: Targeted Misconception Guidance
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
        // 2nd Mistake: Lock team for this question
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

        // ── CHECK BOTH WRONG HANDSHAKE ──
        // If BOTH teams have now exhausted attempts / locked out without answering correctly:
        // DO NOT MOVE THE CARS ANYWHERE. Keep them as is. Advance smoothly to next question.
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
            // Keep blueVehicle & redVehicle positions strictly intact (0 movement)
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

  // ── TIMER EXPIRED HANDLER ──
  handleTimerExpired: () => {
    const { phase, activeChallenge, blueTeam, redTeam } = get();
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
      // DO NOT MOVE CARS
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

  // ── POWER-UPS ──
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

      // Tactical 50:50 assistance per round type
      if (currentRound === 1) {
        // Narrow down step options
        updatedTeam.eliminatedOptions = ['-5', '+8', '+12', '-4'];
      } else if (currentRound === 2) {
        // Snap start value directly to correct starting term!
        const correctStart = (activeChallenge.sequence && activeChallenge.sequence[0]) || activeChallenge.startValue || 20;
        updatedTeam.builderStart = correctStart;
      } else if (currentRound === 3) {
        // Set computed output within ±1 of target
        const correctOut = activeChallenge.expectedOutput || 13;
        updatedTeam.computedOutput = correctOut - 1;
      } else if (currentRound === 4) {
        // Lock the correct operator wheel!
        if (activeChallenge.expectedOperator) {
          updatedTeam.selectedOperator = activeChallenge.expectedOperator;
        }
      } else if (currentRound === 5) {
        // Lock sequence step
        if (activeChallenge.expectedStep) {
          updatedTeam.hybridStep = activeChallenge.expectedStep;
        }
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
      // Trigger Final Race Phase!
      get().startFinalRace();
      return;
    }

    const nextRound = Math.min(currentRound + 1, 5) as RoundNumber;
    const challengePool = getChallengesForRound(nextRound);
    const nextChallenge = challengePool[nextQIndex % challengePool.length] || generateDynamicChallenge(nextRound, nextQIndex * 37 + 11);

    set((state) => ({
      phase: 'round_active',
      currentRound: nextRound,
      questionIndex: nextQIndex,
      activeChallenge: nextChallenge,
      timeRemaining: 45,
      functionMachineActive: nextRound >= 3,
      trackBuilderDeploying: nextRound === 2,
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
    }));

    // Restart timer interval for new question
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

  // ── FINAL GRAND PRIX 3D RACE SIMULATION ──
  startFinalRace: () => {
    clearTimers();
    set({
      phase: 'grand_prix_race',
      raceLights: [true, true, true, false, false], // 3 Red Lights
    });

    patternAudio.playStartLightBeep(false);

    // Light sequence: 3 Red -> Yellow -> GREEN
    setTimeout(() => {
      set({ raceLights: [true, true, true, true, false] });
      patternAudio.playStartLightBeep(false);
    }, 1200);

    setTimeout(() => {
      set({ raceLights: [false, false, false, false, true] }); // GREEN!
      patternAudio.playStartLightBeep(true);
      patternAudio.playEngineRev();

      // Launch Vehicles along track with speed weighted by score
      const blueScore = get().blueTeam.score;
      const redScore = get().redTeam.score;

      set((state) => ({
        blueVehicle: {
          ...state.blueVehicle,
          isRacing: true,
          speed: 12 + (blueScore > redScore ? 3 : 0),
        },
        redVehicle: {
          ...state.redVehicle,
          isRacing: true,
          speed: 12 + (redScore > blueScore ? 3 : 0),
        },
      }));

      // Race finish after 5.5 seconds of dynamic camera tracking
      setTimeout(() => {
        const finalBlue = get().blueTeam.score;
        const finalRed = get().redTeam.score;
        const winner = finalBlue > finalRed ? 'blue' : finalRed > finalBlue ? 'red' : 'tie';

        if (winner === 'tie') {
          get().startTieBreak();
        } else {
          set({
            raceWinner: winner,
            phase: 'podium_ceremony',
          });
        }
      }, 5500);
    }, 2400);
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
