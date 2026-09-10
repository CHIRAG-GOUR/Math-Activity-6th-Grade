// ============================================================
// EQUATION MISSION CONTROL — Zustand Store Orchestrator
// Full State Management for Dual-Team 3D Spacecraft Launch
// ============================================================

import { create } from 'zustand';
import {
  GamePhase,
  TeamId,
  StageIndex,
  MissionStageId,
  TeamControlState,
  Spacecraft3DState,
  MissionChallenge,
  MissionCampaign,
  LaunchStep,
} from '../types';
import { generateDynamicCampaign } from '../engine/questionPool';
import { soundManager } from '@/utils/audio';

const createDefaultTeamState = (id: TeamId, name?: string): TeamControlState => ({
  id,
  name: name || (id === 'blue' ? 'BLUE MISSION CONTROL' : 'RED MISSION CONTROL'),
  score: 0,
  stageScore: 0,
  streak: 0,
  stagesCleared: 0,
  attemptsLeft: 2,
  isLocked: false,
  lastResult: null,
  lastFeedback: null,

  // Stage 1
  placedTokens: [],

  // Stage 2
  dialValue: 5,
  currentStepProgress: 0,

  // Stage 3
  selectedBalanceOp: '-',
  selectedBalanceVal: 5,
  balanceTiltedSide: 'left-heavy',

  // Stage 4
  speedDial: 10,
  timeDial: 2,

  // Stage 5
  lockDigit1: 0,
  lockDigit2: 5,
  isArmed: false,
});

const defaultSpacecraftState = (): Spacecraft3DState => ({
  avionicsPower: false,
  cockpitGlowIntensity: 0,
  hudSystemsActive: false,

  fuelTankPercent: 0,
  fuelPipesConnected: true,
  ventingVapor: false,

  enginePowerGrid: false,
  engineGlowIntensity: 0,
  turbineSpinSpeed: 0,

  navAlignmentLocked: false,
  gimbalPitchAngle: 0,
  targetVectorLocked: false,

  launchStage: 'idle',
  serviceArmsAngle: 0,
  clampsReleased: false,
  altitude: 0,
  ascentVelocity: 0,
  exhaustFlameScale: 0,
  smokeVolume: 0,
  cameraTrackOffset: 0,
});

let launchInterval: ReturnType<typeof setInterval> | null = null;
const clearLaunchInterval = () => {
  if (launchInterval) {
    clearInterval(launchInterval);
    launchInterval = null;
  }
};

interface MissionControlActions {
  setPhase: (phase: GamePhase) => void;
  setTeamName: (team: TeamId, name: string) => void;
  startGame: () => void;
  startStage: (stageIndex: StageIndex) => void;
  beginActiveMission: () => void;

  // Stage 1: Expression Assembly
  addToken: (team: TeamId, token: string) => void;
  removeToken: (team: TeamId, index: number) => void;
  clearTokens: (team: TeamId) => void;
  submitExpression: (team: TeamId) => void;

  // Stage 2: Variable Loading
  setDialValue: (team: TeamId, val: number) => void;
  submitVariableLoading: (team: TeamId) => void;

  // Stage 3: Equation Balance Scale
  setBalanceOperation: (team: TeamId, op: '+' | '-' | '×' | '÷', val: number) => void;
  submitEquationBalance: (team: TeamId) => void;

  // Stage 4: Navigation Calibration
  setSpeedDial: (team: TeamId, val: number) => void;
  setTimeDial: (team: TeamId, val: number) => void;
  submitNavigationCalibration: (team: TeamId) => void;

  // Stage 5: Final Launch Equation Lock & Arming
  setLockDigits: (team: TeamId, d1: number, d2: number) => void;
  armLaunch: (team: TeamId) => void;

  handleTimerExpired: () => void;
  advanceToNextStage: () => void;
  run12StepCinematicLaunch: (winner: TeamId | 'draw') => void;

  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;

  setTimeRemaining: (t: number) => void;
  toggleMute: () => void;
  clearToast: () => void;
}

export type MissionControlStore = {
  phase: GamePhase;
  campaign: MissionCampaign;
  currentStageIndex: StageIndex;
  activeChallenge: MissionChallenge;

  blueTeam: TeamControlState;
  redTeam: TeamControlState;
  spacecraft: Spacecraft3DState;

  winnerTeam: TeamId | 'draw' | null;
  timeRemaining: number;
  timerActive: boolean;
  toastMessage: string | null;
  zoomLevel: number;
  isMuted: boolean;
} & MissionControlActions;

const initialCampaign = generateDynamicCampaign(0);

export const useMissionControlStore = create<MissionControlStore>((set, get) => ({
  phase: 'title',
  campaign: initialCampaign,
  currentStageIndex: 0,
  activeChallenge: initialCampaign.challenges[0],

  blueTeam: createDefaultTeamState('blue', 'BLUE MISSION CONTROL'),
  redTeam: createDefaultTeamState('red', 'RED MISSION CONTROL'),
  spacecraft: defaultSpacecraftState(),

  winnerTeam: null,
  timeRemaining: 45,
  timerActive: false,
  toastMessage: null,
  zoomLevel: 1.0,
  isMuted: false,

  setPhase: (phase) => set({ phase }),

  setTeamName: (team, name) => {
    const key = team === 'blue' ? 'blueTeam' : 'redTeam';
    set((s) => ({ [key]: { ...s[key], name } }));
  },

  zoomIn: () => {
    soundManager.playClick();
    set((s) => ({ zoomLevel: Math.min(1.4, Number((s.zoomLevel + 0.1).toFixed(2))) }));
  },

  zoomOut: () => {
    soundManager.playClick();
    set((s) => ({ zoomLevel: Math.max(0.7, Number((s.zoomLevel - 0.1).toFixed(2))) }));
  },

  resetZoom: () => {
    soundManager.playClick();
    set({ zoomLevel: 1.0 });
  },

  setTimeRemaining: (t) => set({ timeRemaining: t }),

  toggleMute: () => {
    const nextMuted = !get().isMuted;
    soundManager.setMuted(nextMuted);
    set({ isMuted: nextMuted });
  },

  clearToast: () => set({ toastMessage: null }),

  startGame: () => {
    clearLaunchInterval();
    const freshCampaign = generateDynamicCampaign(0);
    const firstChallenge = freshCampaign.challenges[0];

    soundManager.playArcadeGameStart();

    set((s) => ({
      phase: 'stage-intro',
      campaign: freshCampaign,
      currentStageIndex: 0,
      activeChallenge: firstChallenge,
      winnerTeam: null,
      timeRemaining: firstChallenge.timeLimit,
      timerActive: false,
      toastMessage: null,
      blueTeam: createDefaultTeamState('blue', s.blueTeam.name),
      redTeam: createDefaultTeamState('red', s.redTeam.name),
      spacecraft: defaultSpacecraftState(),
    }));
  },

  startStage: (stageIndex) => {
    clearLaunchInterval();
    const ch = get().campaign.challenges[stageIndex];
    set((s) => ({
      phase: 'stage-intro',
      currentStageIndex: stageIndex,
      activeChallenge: ch,
      timeRemaining: ch.timeLimit,
      timerActive: false,
      toastMessage: null,
      blueTeam: {
        ...s.blueTeam,
        stageScore: 0,
        attemptsLeft: 2,
        isLocked: false,
        lastResult: null,
        lastFeedback: null,
        placedTokens: [],
        dialValue: ch.stage2 ? ch.stage2.variableValue - 2 : 5,
        speedDial: ch.stage4 ? ch.stage4.speedGiven - 2 : 10,
        timeDial: ch.stage4 ? ch.stage4.timeGiven : 2,
        lockDigit1: 0,
        lockDigit2: ch.stage5 ? (ch.stage5.correctX > 0 ? ch.stage5.correctX - 1 : 1) : 5,
        isArmed: false,
      },
      redTeam: {
        ...s.redTeam,
        stageScore: 0,
        attemptsLeft: 2,
        isLocked: false,
        lastResult: null,
        lastFeedback: null,
        placedTokens: [],
        dialValue: ch.stage2 ? ch.stage2.variableValue - 2 : 5,
        speedDial: ch.stage4 ? ch.stage4.speedGiven - 2 : 10,
        timeDial: ch.stage4 ? ch.stage4.timeGiven : 2,
        lockDigit1: 0,
        lockDigit2: ch.stage5 ? (ch.stage5.correctX > 0 ? ch.stage5.correctX - 1 : 1) : 5,
        isArmed: false,
      },
    }));
  },

  beginActiveMission: () => {
    const ch = get().activeChallenge;
    soundManager.playClick();
    set({
      phase: 'active-mission',
      timeRemaining: ch.timeLimit,
      timerActive: true,
    });
  },

  // ── STAGE 1: EXPRESSION ASSEMBLY ──
  addToken: (team, token) => {
    const key = team === 'blue' ? 'blueTeam' : 'redTeam';
    const current = get()[key].placedTokens;
    if (current.length >= 8 || get()[key].isLocked) return;
    soundManager.playClick();
    set((s) => ({
      [key]: {
        ...s[key],
        placedTokens: [...current, token],
      },
    }));
  },

  removeToken: (team, index) => {
    const key = team === 'blue' ? 'blueTeam' : 'redTeam';
    if (get()[key].isLocked) return;
    soundManager.playClick();
    set((s) => ({
      [key]: {
        ...s[key],
        placedTokens: s[key].placedTokens.filter((_, i) => i !== index),
      },
    }));
  },

  clearTokens: (team) => {
    const key = team === 'blue' ? 'blueTeam' : 'redTeam';
    if (get()[key].isLocked) return;
    soundManager.playClick();
    set((s) => ({
      [key]: {
        ...s[key],
        placedTokens: [],
      },
    }));
  },

  submitExpression: (team) => {
    const state = get();
    const ch = state.activeChallenge;
    if (!ch.stage1 || state.phase !== 'active-mission') return;

    const isBlue = team === 'blue';
    const key = isBlue ? 'blueTeam' : 'redTeam';
    const otherKey = isBlue ? 'redTeam' : 'blueTeam';
    const teamState = state[key];
    const otherTeamState = state[otherKey];

    if (teamState.isLocked) return;

    const userExpr = teamState.placedTokens.join('').replace(/\s+/g, '');
    const correctExpr = ch.stage1.correctTokens.join('').replace(/\s+/g, '');

    const isCorrect = userExpr === correctExpr;

    if (isCorrect) {
      soundManager.playCorrect(true);
      const speedBonus = Math.max(0, Math.floor(state.timeRemaining * 1.5));
      const points = ch.points + speedBonus;

      set((s) => ({
        [key]: {
          ...s[key],
          isLocked: true,
          lastResult: 'correct',
          score: s[key].score + points,
          stageScore: points,
          streak: s[key].streak + 1,
          stagesCleared: s[key].stagesCleared + 1,
          lastFeedback: {
            message: `✅ EXPRESSION VERIFIED! +${points} PTS`,
            isCorrect: true,
            pointsEarned: points,
          },
        },
        [otherKey]: { ...s[otherKey], isLocked: true },
        spacecraft: {
          ...s.spacecraft,
          avionicsPower: true,
          cockpitGlowIntensity: 1.0,
          hudSystemsActive: true,
        },
        toastMessage: `🛰️ ${s[key].name} POWERS ON SPACECRAFT AVIONICS & COCKPIT HUD!`,
        timerActive: false,
      }));

      setTimeout(() => {
        set({ phase: 'solution-reveal' });
      }, 700);
    } else {
      soundManager.playWrong();
      if (teamState.attemptsLeft > 1) {
        set((s) => ({
          [key]: {
            ...s[key],
            attemptsLeft: 1,
            lastFeedback: {
              message: `⚠️ INCORRECT SEQUENCE — 1 TRY LEFT!`,
              isCorrect: false,
              pointsEarned: 0,
            },
          },
          toastMessage: `⚠️ ${s[key].name} EXPRESSION MISMATCH — 1 ATTEMPT LEFT!`,
        }));
      } else {
        set((s) => ({
          [key]: {
            ...s[key],
            attemptsLeft: 0,
            isLocked: true,
            lastResult: 'wrong',
            lastFeedback: {
              message: `❌ LOCKOUT — TURN EXHAUSTED`,
              isCorrect: false,
              pointsEarned: 0,
            },
          },
          toastMessage: `❌ ${s[key].name} LOCKED OUT! ${s[otherKey].name} CAN REBOUND!`,
        }));

        if (otherTeamState.isLocked) {
          set({ timerActive: false, toastMessage: '❌ BOTH TEAMS LOCKED OUT!' });
          setTimeout(() => set({ phase: 'solution-reveal' }), 700);
        }
      }
    }
  },

  // ── STAGE 2: VARIABLE LOADING ──
  setDialValue: (team, val) => {
    const key = team === 'blue' ? 'blueTeam' : 'redTeam';
    if (get()[key].isLocked) return;
    soundManager.playClick();
    set((s) => ({
      [key]: {
        ...s[key],
        dialValue: Math.max(0, Math.min(30, val)),
      },
    }));
  },

  submitVariableLoading: (team) => {
    const state = get();
    const ch = state.activeChallenge;
    if (!ch.stage2 || state.phase !== 'active-mission') return;

    const isBlue = team === 'blue';
    const key = isBlue ? 'blueTeam' : 'redTeam';
    const otherKey = isBlue ? 'redTeam' : 'blueTeam';
    const teamState = state[key];
    const otherTeamState = state[otherKey];

    if (teamState.isLocked) return;

    const isCorrect = teamState.dialValue === ch.stage2.variableValue;

    if (isCorrect) {
      soundManager.playCorrect(true);
      const speedBonus = Math.max(0, Math.floor(state.timeRemaining * 1.5));
      const points = ch.points + speedBonus;

      set((s) => ({
        [key]: {
          ...s[key],
          isLocked: true,
          lastResult: 'correct',
          score: s[key].score + points,
          stageScore: points,
          streak: s[key].streak + 1,
          stagesCleared: s[key].stagesCleared + 1,
          lastFeedback: {
            message: `✅ FUEL FORMULA LOADED! +${points} PTS`,
            isCorrect: true,
            pointsEarned: points,
          },
        },
        [otherKey]: { ...s[otherKey], isLocked: true },
        spacecraft: {
          ...s.spacecraft,
          fuelTankPercent: 100,
          ventingVapor: true,
        },
        toastMessage: `⛽ ${s[key].name} CONNECTS FUEL LINES & PRESSURIZES TANKS!`,
        timerActive: false,
      }));

      setTimeout(() => {
        set({ phase: 'solution-reveal' });
      }, 700);
    } else {
      soundManager.playWrong();
      if (teamState.attemptsLeft > 1) {
        set((s) => ({
          [key]: {
            ...s[key],
            attemptsLeft: 1,
            lastFeedback: {
              message: `⚠️ INCORRECT VARIABLE VALUE — 1 TRY LEFT!`,
              isCorrect: false,
              pointsEarned: 0,
            },
          },
          toastMessage: `⚠️ ${s[key].name} VALUE INCORRECT — 1 TRY LEFT!`,
        }));
      } else {
        set((s) => ({
          [key]: {
            ...s[key],
            attemptsLeft: 0,
            isLocked: true,
            lastResult: 'wrong',
            lastFeedback: {
              message: `❌ LOCKOUT — TURN EXHAUSTED`,
              isCorrect: false,
              pointsEarned: 0,
            },
          },
          toastMessage: `❌ ${s[key].name} LOCKED OUT! ${s[otherKey].name} CAN REBOUND!`,
        }));

        if (otherTeamState.isLocked) {
          set({ timerActive: false, toastMessage: '❌ BOTH TEAMS LOCKED OUT!' });
          setTimeout(() => set({ phase: 'solution-reveal' }), 700);
        }
      }
    }
  },

  // ── STAGE 3: EQUATION BALANCE SCALE ──
  setBalanceOperation: (team, op, val) => {
    const key = team === 'blue' ? 'blueTeam' : 'redTeam';
    if (get()[key].isLocked) return;
    soundManager.playClick();
    set((s) => ({
      [key]: {
        ...s[key],
        selectedBalanceOp: op,
        selectedBalanceVal: Math.max(1, Math.min(50, val)),
      },
    }));
  },

  submitEquationBalance: (team) => {
    const state = get();
    const ch = state.activeChallenge;
    if (!ch.stage3 || state.phase !== 'active-mission') return;

    const isBlue = team === 'blue';
    const key = isBlue ? 'blueTeam' : 'redTeam';
    const otherKey = isBlue ? 'redTeam' : 'blueTeam';
    const teamState = state[key];
    const otherTeamState = state[otherKey];

    if (teamState.isLocked) return;

    const isCorrect =
      teamState.selectedBalanceOp === ch.stage3.requiredOp &&
      teamState.selectedBalanceVal === ch.stage3.requiredVal;

    if (isCorrect) {
      soundManager.playCorrect(true);
      const speedBonus = Math.max(0, Math.floor(state.timeRemaining * 1.5));
      const points = ch.points + speedBonus;

      set((s) => ({
        [key]: {
          ...s[key],
          isLocked: true,
          lastResult: 'correct',
          score: s[key].score + points,
          stageScore: points,
          streak: s[key].streak + 1,
          stagesCleared: s[key].stagesCleared + 1,
          balanceTiltedSide: 'balanced',
          lastFeedback: {
            message: `⚖️ EQUATION BALANCED! x = ${ch.stage3?.solutionX} (+${points} PTS)`,
            isCorrect: true,
            pointsEarned: points,
          },
        },
        [otherKey]: { ...s[otherKey], isLocked: true },
        spacecraft: {
          ...s.spacecraft,
          enginePowerGrid: true,
          engineGlowIntensity: 1.0,
          turbineSpinSpeed: 1.0,
        },
        toastMessage: `🔥 ${s[key].name} BALANCES ENGINE EQUATION! ENGINES ONLINE!`,
        timerActive: false,
      }));

      setTimeout(() => {
        set({ phase: 'solution-reveal' });
      }, 700);
    } else {
      soundManager.playWrong();
      if (teamState.attemptsLeft > 1) {
        set((s) => ({
          [key]: {
            ...s[key],
            attemptsLeft: 1,
            lastFeedback: {
              message: `⚠️ NOT BALANCED — APPLY INVERSE OPERATION!`,
              isCorrect: false,
              pointsEarned: 0,
            },
          },
          toastMessage: `⚠️ ${s[key].name} BALANCE UNLEVEL — 1 TRY LEFT!`,
        }));
      } else {
        set((s) => ({
          [key]: {
            ...s[key],
            attemptsLeft: 0,
            isLocked: true,
            lastResult: 'wrong',
            lastFeedback: {
              message: `❌ LOCKOUT — TURN EXHAUSTED`,
              isCorrect: false,
              pointsEarned: 0,
            },
          },
          toastMessage: `❌ ${s[key].name} LOCKED OUT! ${s[otherKey].name} CAN REBOUND!`,
        }));

        if (otherTeamState.isLocked) {
          set({ timerActive: false, toastMessage: '❌ BOTH TEAMS LOCKED OUT!' });
          setTimeout(() => set({ phase: 'solution-reveal' }), 700);
        }
      }
    }
  },

  // ── STAGE 4: NAVIGATION CALIBRATION ──
  setSpeedDial: (team, val) => {
    const key = team === 'blue' ? 'blueTeam' : 'redTeam';
    if (get()[key].isLocked) return;
    soundManager.playClick();
    set((s) => ({
      [key]: {
        ...s[key],
        speedDial: Math.max(1, Math.min(30, val)),
      },
    }));
  },

  setTimeDial: (team, val) => {
    const key = team === 'blue' ? 'blueTeam' : 'redTeam';
    if (get()[key].isLocked) return;
    soundManager.playClick();
    set((s) => ({
      [key]: {
        ...s[key],
        timeDial: Math.max(1, Math.min(10, val)),
      },
    }));
  },

  submitNavigationCalibration: (team) => {
    const state = get();
    const ch = state.activeChallenge;
    if (!ch.stage4 || state.phase !== 'active-mission') return;

    const isBlue = team === 'blue';
    const key = isBlue ? 'blueTeam' : 'redTeam';
    const otherKey = isBlue ? 'redTeam' : 'blueTeam';
    const teamState = state[key];
    const otherTeamState = state[otherKey];

    if (teamState.isLocked) return;

    const isCorrect =
      teamState.speedDial === ch.stage4.speedGiven &&
      teamState.timeDial === ch.stage4.timeGiven;

    if (isCorrect) {
      soundManager.playCorrect(true);
      const speedBonus = Math.max(0, Math.floor(state.timeRemaining * 1.5));
      const points = ch.points + speedBonus;

      set((s) => ({
        [key]: {
          ...s[key],
          isLocked: true,
          lastResult: 'correct',
          score: s[key].score + points,
          stageScore: points,
          streak: s[key].streak + 1,
          stagesCleared: s[key].stagesCleared + 1,
          lastFeedback: {
            message: `🧭 FLIGHT PATH CALIBRATED! D = ${ch.stage4?.targetDistance} km (+${points} PTS)`,
            isCorrect: true,
            pointsEarned: points,
          },
        },
        [otherKey]: { ...s[otherKey], isLocked: true },
        spacecraft: {
          ...s.spacecraft,
          navAlignmentLocked: true,
          gimbalPitchAngle: 0.15,
          targetVectorLocked: true,
        },
        toastMessage: `🧭 ${s[key].name} CALIBRATES TRAJECTORY! FLIGHT PATH LOCKED!`,
        timerActive: false,
      }));

      setTimeout(() => {
        set({ phase: 'solution-reveal' });
      }, 700);
    } else {
      soundManager.playWrong();
      if (teamState.attemptsLeft > 1) {
        set((s) => ({
          [key]: {
            ...s[key],
            attemptsLeft: 1,
            lastFeedback: {
              message: `⚠️ CALIBRATION DRIFT — MATCH GIVEN VALUES!`,
              isCorrect: false,
              pointsEarned: 0,
            },
          },
          toastMessage: `⚠️ ${s[key].name} CALIBRATION MISALIGNED — 1 TRY LEFT!`,
        }));
      } else {
        set((s) => ({
          [key]: {
            ...s[key],
            attemptsLeft: 0,
            isLocked: true,
            lastResult: 'wrong',
            lastFeedback: {
              message: `❌ LOCKOUT — TURN EXHAUSTED`,
              isCorrect: false,
              pointsEarned: 0,
            },
          },
          toastMessage: `❌ ${s[key].name} LOCKED OUT! ${s[otherKey].name} CAN REBOUND!`,
        }));

        if (otherTeamState.isLocked) {
          set({ timerActive: false, toastMessage: '❌ BOTH TEAMS LOCKED OUT!' });
          setTimeout(() => set({ phase: 'solution-reveal' }), 700);
        }
      }
    }
  },

  // ── STAGE 5: FINAL LAUNCH EQUATION & ARMING ──
  setLockDigits: (team, d1, d2) => {
    const key = team === 'blue' ? 'blueTeam' : 'redTeam';
    if (get()[key].isLocked) return;
    soundManager.playClick();
    set((s) => ({
      [key]: {
        ...s[key],
        lockDigit1: Math.max(0, Math.min(9, d1)),
        lockDigit2: Math.max(0, Math.min(9, d2)),
      },
    }));
  },

  armLaunch: (team) => {
    const state = get();
    const ch = state.activeChallenge;
    if (!ch.stage5 || state.phase !== 'active-mission') return;

    const isBlue = team === 'blue';
    const key = isBlue ? 'blueTeam' : 'redTeam';
    const otherKey = isBlue ? 'redTeam' : 'blueTeam';
    const teamState = state[key];
    const otherTeamState = state[otherKey];

    if (teamState.isLocked) return;

    const enteredX = teamState.lockDigit1 * 10 + teamState.lockDigit2;
    const isCorrect = enteredX === ch.stage5.correctX;

    if (isCorrect) {
      soundManager.playCorrect(true);
      const speedBonus = Math.max(0, Math.floor(state.timeRemaining * 1.5));
      const points = ch.points + speedBonus;

      set((s) => ({
        [key]: {
          ...s[key],
          isLocked: true,
          lastResult: 'correct',
          score: s[key].score + points,
          stageScore: points,
          streak: s[key].streak + 1,
          stagesCleared: s[key].stagesCleared + 1,
          isArmed: true,
          lastFeedback: {
            message: `🚀 LAUNCH ARMED! x = ${ch.stage5?.correctX} (+${points} PTS)`,
            isCorrect: true,
            pointsEarned: points,
          },
        },
        [otherKey]: { ...s[otherKey], isLocked: true },
        toastMessage: `🚀 ${s[key].name} UNLOCKS MASTER KEY! COMMENCING LAUNCH SEQUENCE!`,
        timerActive: false,
      }));

      // Trigger the 12-Step Cinematic Launch
      get().run12StepCinematicLaunch(team);
    } else {
      soundManager.playWrong();
      if (teamState.attemptsLeft > 1) {
        set((s) => ({
          [key]: {
            ...s[key],
            attemptsLeft: 1,
            lastFeedback: {
              message: `⚠️ EQUATION KEY REJECTED — SOLVE FOR x!`,
              isCorrect: false,
              pointsEarned: 0,
            },
          },
          toastMessage: `⚠️ ${s[key].name} INCORRECT KEY — 1 TRY LEFT!`,
        }));
      } else {
        set((s) => ({
          [key]: {
            ...s[key],
            attemptsLeft: 0,
            isLocked: true,
            lastResult: 'wrong',
            lastFeedback: {
              message: `❌ LOCKOUT — TURN EXHAUSTED`,
              isCorrect: false,
              pointsEarned: 0,
            },
          },
          toastMessage: `❌ ${s[key].name} LOCKED OUT! ${s[otherKey].name} CAN REBOUND!`,
        }));

        if (otherTeamState.isLocked) {
          // If both failed final equation, launch in emergency recovery mode
          set({ timerActive: false });
          get().run12StepCinematicLaunch('draw');
        }
      }
    }
  },

  handleTimerExpired: () => {
    const state = get();
    if (state.phase !== 'active-mission') return;

    soundManager.playWrong();
    set((s) => ({
      blueTeam: { ...s.blueTeam, isLocked: true },
      redTeam: { ...s.redTeam, isLocked: true },
      timerActive: false,
      toastMessage: '⏰ MISSION CLOCK EXPIRED!',
    }));

    if (state.currentStageIndex === 4) {
      // Stage 5 timeout -> trigger launch
      get().run12StepCinematicLaunch('draw');
    } else {
      set({ phase: 'solution-reveal' });
    }
  },

  advanceToNextStage: () => {
    const current = get().currentStageIndex;
    if (current < 4) {
      get().startStage((current + 1) as StageIndex);
    } else {
      // Completed all 5 stages
      const blueScore = get().blueTeam.score;
      const redScore = get().redTeam.score;
      const winner = blueScore > redScore ? 'blue' : redScore > blueScore ? 'red' : 'draw';
      set({ phase: 'mission-report', winnerTeam: winner });
    }
  },

  // ============================================================
  // ── 12-STEP FULL CINEMATIC SPACECRAFT LAUNCH SEQUENCE ──
  // ============================================================
  run12StepCinematicLaunch: (winner) => {
    clearLaunchInterval();
    const isBlue = winner === 'blue';
    const isRed = winner === 'red';
    const winnerName = isBlue
      ? get().blueTeam.name
      : isRed
        ? get().redTeam.name
        : 'JOINT AEROSPACE TEAMS';

    set({
      phase: 'launch-cinematic',
      winnerTeam: winner,
      timerActive: false,
      toastMessage: `🚨 T-MINUS 10 SECONDS! FINAL LAUNCH CLEARANCE CONFIRMED FOR ${winnerName}!`,
      spacecraft: {
        ...get().spacecraft,
        launchStage: 'arming',
      },
    });

    // Step 1: Warning Sirens & Hazard lights (0.8s)
    setTimeout(() => {
      soundManager.playSecurityAlarm();
      set((s) => ({
        spacecraft: { ...s.spacecraft, launchStage: 'hazard-lights' },
        toastMessage: '🟡 HAZARD FLASHERS ACTIVE — PAD CLEARED!',
      }));
    }, 800);

    // Step 2: Service Umbilical Arms Retract (2.2s)
    setTimeout(() => {
      soundManager.playVaultWheelTurn();
      set((s) => ({
        spacecraft: {
          ...s.spacecraft,
          launchStage: 'umbilical-retract',
          serviceArmsAngle: 0.85,
        },
        toastMessage: '🏗️ UMBILICAL SERVICE ARMS RETRACTING...',
      }));
    }, 2200);

    // Step 3: Cryogenic Fuel Lines Decouple with Vapor Puff (3.6s)
    setTimeout(() => {
      soundManager.playLoudWhistle();
      set((s) => ({
        spacecraft: {
          ...s.spacecraft,
          launchStage: 'fuel-decouple',
          fuelPipesConnected: false,
          ventingVapor: true,
        },
        toastMessage: '💨 CRYOGENIC FUEL LINES DECOUPLED!',
      }));
    }, 3600);

    // Step 4: Base Launch Clamps Release (4.8s)
    setTimeout(() => {
      soundManager.playClick();
      set((s) => ({
        spacecraft: {
          ...s.spacecraft,
          launchStage: 'clamp-release',
          clampsReleased: true,
        },
        toastMessage: '🔓 LAUNCH PAD RETENTION CLAMPS RELEASED!',
      }));
    }, 4800);

    // Step 5: Main Engine Ignition & Smoke Plume (6.0s)
    setTimeout(() => {
      soundManager.playTrainRunningAudio();
      set((s) => ({
        spacecraft: {
          ...s.spacecraft,
          launchStage: 'ignition',
          exhaustFlameScale: 1.0,
          smokeVolume: 1.0,
        },
        toastMessage: '🔥 MAIN ROCKET ENGINES IGNITION! THRUST AT 100%!',
      }));
    }, 6000);

    // Step 6: Liftoff & Ascent Physics Engine (7.4s)
    setTimeout(() => {
      soundManager.playVaultCracked();

      set((s) => ({
        spacecraft: {
          ...s.spacecraft,
          launchStage: 'liftoff',
        },
        toastMessage: `🚀 LIFTOFF! ${winnerName} SPACECRAFT ASCENDING INTO SUNLIT SKY!`,
      }));

      let currentAlt = 0;
      let currentVel = 0;
      let frame = 0;

      launchInterval = setInterval(() => {
        frame++;
        currentVel += 0.08;
        currentAlt += currentVel;

        const stageName: LaunchStep =
          currentAlt < 8
            ? 'liftoff'
            : currentAlt < 25
              ? 'tower-clear'
              : currentAlt < 75
                ? 'sky-ascent'
                : currentAlt < 140
                  ? 'cloud-entry'
                  : 'orbital-insertion';

        set((s) => ({
          spacecraft: {
            ...s.spacecraft,
            launchStage: stageName,
            altitude: currentAlt,
            ascentVelocity: currentVel,
            exhaustFlameScale: Math.min(2.5, 1.0 + currentVel * 0.15),
            smokeVolume: Math.min(2.5, 1.0 + currentVel * 0.1),
            cameraTrackOffset: Math.min(45, currentAlt * 0.4),
          },
        }));

        if (currentAlt >= 180) {
          clearLaunchInterval();
          soundManager.stopTrainRunningAudio();

          // Step 12: Mission Report Screen
          const blueScore = get().blueTeam.score;
          const redScore = get().redTeam.score;
          const finalWinner =
            blueScore > redScore ? 'blue' : redScore > blueScore ? 'red' : 'draw';

          set({
            phase: 'mission-report',
            winnerTeam: finalWinner,
            toastMessage: '🏁 ORBITAL INSERTION CONFIRMED — MISSION SUCCESSFUL!',
            spacecraft: {
              ...get().spacecraft,
              launchStage: 'complete',
            },
          });
        }
      }, 50);
    }, 7400);
  },
}));
