// ============================================================
// PATTERN RACERS — Central Zustand Store
// Dual-Team Simultaneous Interaction & 3D World Physical Simulation
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
  submitAnswer: (teamId: TeamId) => void;
  usePowerUp5050: (teamId: TeamId) => void;
  usePowerUpTimeFreeze: (teamId: TeamId) => void;
  usePowerUp2x: (teamId: TeamId) => void;
  advanceRound: () => void;
  startFinalRace: () => void;
  startTieBreak: () => void;
  restartGame: () => void;
}

const INITIAL_WORKERS: FacilityWorker[] = [
  { id: 'w1', name: 'Dr. Elena (Telemetry)', role: 'telemetry', position: [-4.5, 0, -2], rotationY: 0.4, animationState: 'typing', targetRound: 1 },
  { id: 'w2', name: 'Marcus (Mechanic)', role: 'mechanic', position: [-3, 0, 1.5], rotationY: -0.8, animationState: 'working', targetRound: 1 },
  { id: 'w3', name: 'Sarah (Hydraulics)', role: 'engineer', position: [0, 0, -3.5], rotationY: 0, animationState: 'working', targetRound: 2 },
  { id: 'w4', name: 'Alex (Marshal)', role: 'marshal', position: [4.2, 0, 0.5], rotationY: -1.2, animationState: 'idle', targetRound: 3 },
  { id: 'w5', name: 'Kenji (Power Unit)', role: 'mechanic', position: [3, 0, 2.8], rotationY: 1.5, animationState: 'working', targetRound: 4 },
  { id: 'w6', name: 'Zack (Inspector)', role: 'inspector', position: [-1.2, 0, 4.5], rotationY: 3.14, animationState: 'waving', targetRound: 5 },
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
    patternAudio.playEngineRev();
    patternAudio.startBgm();
    const firstChallenge = getChallengesForRound(1)[0] || generateDynamicChallenge(1, 101);
    set({
      phase: 'round_active',
      currentRound: 1,
      questionIndex: 0,
      activeChallenge: firstChallenge,
      trackCompletion: 0,
      blueTeam: createInitialTeam('blue', 'Blue Velocity'),
      redTeam: createInitialTeam('red', 'Red Turbo'),
      blueVehicle: createInitialVehicle('blue'),
      redVehicle: createInitialVehicle('red'),
    });
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

      // Advance vehicle in 3D world
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
        set({
          raceWinner: teamId,
          phase: 'podium_ceremony',
        });
        return;
      }

      // Check if round should advance
      setTimeout(() => {
        const currentPhase = get().phase;
        if (currentPhase === 'round_active') {
          get().advanceRound();
        }
      }, 2200);

    } else {
      // 1st Wrong Attempt: Targeted Misconception Guidance
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
        // 2nd Wrong: Lock team for this question
        set((state) => ({
          [teamId === 'blue' ? 'blueTeam' : 'redTeam']: {
            ...team,
            attemptsLeft: 0,
            isLocked: true,
            hasSubmitted: true,
            isCorrect: false,
            lastFeedback: activeChallenge.mathExplanation,
          },
        }));
      }
    }
  },

  // ── POWER-UPS ──
  usePowerUp5050: (teamId) => {
    patternAudio.playDialClick();
    set((state) => {
      const team = teamId === 'blue' ? state.blueTeam : state.redTeam;
      if (!team.powerUps.fiftyFifty) return state;

      return {
        [teamId === 'blue' ? 'blueTeam' : 'redTeam']: {
          ...team,
          powerUps: { ...team.powerUps, fiftyFifty: false },
          eliminatedOptions: ['-5', '+8', '×6', '÷4'],
        },
      };
    });
  },

  usePowerUpTimeFreeze: (teamId) => {
    patternAudio.playDialClick();
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
    patternAudio.playDialClick();
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
      },
      redTeam: {
        ...state.redTeam,
        attemptsLeft: 2,
        isLocked: false,
        hasSubmitted: false,
        isCorrect: null,
        lastFeedback: null,
        activeMisconception: null,
      },
    }));
  },

  // ── FINAL GRAND PRIX 3D RACE SIMULATION ──
  startFinalRace: () => {
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

      // Race finish after 6 seconds of dynamic camera tracking
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
    const tieChallenge = generateDynamicChallenge(1, 999);
    set({
      phase: 'tie_break',
      isTieBreak: true,
      tieBreakTimer: 15,
      activeChallenge: tieChallenge,
      blueTeam: { ...get().blueTeam, isLocked: false, hasSubmitted: false },
      redTeam: { ...get().redTeam, isLocked: false, hasSubmitted: false },
    });
  },

  restartGame: () => {
    get().startMatch();
  },
}));
