// ============================================================
// EQUATION MISSION CONTROL 2.0 — Zustand Store Orchestrator
// Full State Management for Dual 3D Spacecraft Launch Facility
// Independent Blue & Red Rocket Preparation & Liftoff
// ============================================================

import { create } from 'zustand';
import {
  GamePhase,
  TeamId,
  StageIndex,
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
  name: name || (id === 'blue' ? 'BLUE TEAM' : 'RED TEAM'),
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

const createDefaultSpacecraftState = (team: TeamId): Spacecraft3DState => ({
  team,
  stage1StructureDone: false,
  stage2FuelDone: false,
  stage3EngineDone: false,
  stage4NavDone: false,
  stage5Armed: false,

  cockpitGlowIntensity: 0.2,
  fuelTankPercent: 0,
  fuelArmConnected: false,
  ventingVapor: false,
  engineGlowIntensity: 0,
  gimbalPitchAngle: 0,
  antennaDeployed: false,
  serviceArmsAngle: 0,
  clampsReleased: false,

  launchStage: 'idle',
  altitude: 0,
  ascentVelocity: 0,
  exhaustFlameScale: 0,
  smokeVolume: 0,
  flagWaveSpeed: 1,
  flagProminence: 1,
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

  // Stage 1: Structure & Expression Assembly
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

  // Stage 4: Flight Path Calibration
  setSpeedDial: (team: TeamId, val: number) => void;
  setTimeDial: (team: TeamId, val: number) => void;
  submitNavigationCalibration: (team: TeamId) => void;

  // Stage 5: Final Launch Equation Lock & Arming
  setLockDigits: (team: TeamId, d1: number, d2: number) => void;
  armLaunch: (team: TeamId) => void;

  handleTimerExpired: () => void;
  advanceToNextStage: () => void;
  run12StepCinematicLaunch: (winner: TeamId | 'draw') => void;

  setParallax: (x: number, y: number) => void;
  setCameraTarget: (target: 'overview' | 'blue-pad' | 'red-pad' | 'hero-launch') => void;

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
  blueSpacecraft: Spacecraft3DState;
  redSpacecraft: Spacecraft3DState;

  winnerTeam: TeamId | 'draw' | null;
  timeRemaining: number;
  timerActive: boolean;
  toastMessage: string | null;
  cameraTarget: 'overview' | 'blue-pad' | 'red-pad' | 'hero-launch';
  parallaxX: number;
  parallaxY: number;
  isMuted: boolean;
} & MissionControlActions;

const initialCampaign = generateDynamicCampaign(0);

export const useMissionControlStore = create<MissionControlStore>((set, get) => ({
  phase: 'title',
  campaign: initialCampaign,
  currentStageIndex: 0,
  activeChallenge: initialCampaign.challenges[0],

  blueTeam: createDefaultTeamState('blue', 'BLUE TEAM'),
  redTeam: createDefaultTeamState('red', 'RED TEAM'),
  blueSpacecraft: createDefaultSpacecraftState('blue'),
  redSpacecraft: createDefaultSpacecraftState('red'),

  winnerTeam: null,
  timeRemaining: 60,
  timerActive: false,
  toastMessage: null,
  cameraTarget: 'overview',
  parallaxX: 0,
  parallaxY: 0,
  isMuted: false,

  setPhase: (phase) => set({ phase }),

  setTeamName: (team, name) =>
    set((s) => ({
      [team === 'blue' ? 'blueTeam' : 'redTeam']: {
        ...(team === 'blue' ? s.blueTeam : s.redTeam),
        name: name.trim().slice(0, 24) || (team === 'blue' ? 'BLUE TEAM' : 'RED TEAM'),
      },
    })),

  startGame: () => {
    clearLaunchInterval();
    const camp = generateDynamicCampaign(Math.floor(Math.random() * 100));
    set({
      campaign: camp,
      currentStageIndex: 0,
      activeChallenge: camp.challenges[0],
      winnerTeam: null,
      phase: 'stage-intro',
      timeRemaining: camp.challenges[0].timeLimit,
      timerActive: false,
      toastMessage: null,
      cameraTarget: 'overview',
      blueTeam: createDefaultTeamState('blue', get().blueTeam.name),
      redTeam: createDefaultTeamState('red', get().redTeam.name),
      blueSpacecraft: createDefaultSpacecraftState('blue'),
      redSpacecraft: createDefaultSpacecraftState('red'),
    });
  },

  startStage: (stageIndex) => {
    const { campaign } = get();
    const challenge = campaign.challenges[stageIndex];
    set({
      currentStageIndex: stageIndex,
      activeChallenge: challenge,
      phase: 'stage-intro',
      timeRemaining: challenge.timeLimit,
      timerActive: false,
      cameraTarget: 'overview',
    });
  },

  beginActiveMission: () => {
    set((s) => ({
      phase: 'active-mission',
      timerActive: true,
      timeRemaining: s.activeChallenge.timeLimit,
      blueTeam: { ...s.blueTeam, isLocked: false, lastResult: null, lastFeedback: null },
      redTeam: { ...s.redTeam, isLocked: false, lastResult: null, lastFeedback: null },
    }));
  },

  setParallax: (x, y) => set({ parallaxX: x, parallaxY: y }),
  setCameraTarget: (target) => set({ cameraTarget: target }),

  // --------------------------------------------------------------------------
  // STAGE 1: Structure & Expression Assembly
  // --------------------------------------------------------------------------
  addToken: (team, token) => {
    const key = team === 'blue' ? 'blueTeam' : 'redTeam';
    const cur = get()[key];
    if (cur.isLocked) return;
    set({ [key]: { ...cur, placedTokens: [...cur.placedTokens, token] } });
  },

  removeToken: (team, index) => {
    const key = team === 'blue' ? 'blueTeam' : 'redTeam';
    const cur = get()[key];
    if (cur.isLocked) return;
    const next = [...cur.placedTokens];
    next.splice(index, 1);
    set({ [key]: { ...cur, placedTokens: next } });
  },

  clearTokens: (team) => {
    const key = team === 'blue' ? 'blueTeam' : 'redTeam';
    const cur = get()[key];
    if (cur.isLocked) return;
    set({ [key]: { ...cur, placedTokens: [] } });
  },

  submitExpression: (team) => {
    const { activeChallenge, currentStageIndex } = get();
    const stage1 = activeChallenge.stage1;
    if (!stage1) return;

    const teamKey = team === 'blue' ? 'blueTeam' : 'redTeam';
    const shipKey = team === 'blue' ? 'blueSpacecraft' : 'redSpacecraft';
    const t = get()[teamKey];
    const ship = get()[shipKey];
    if (t.isLocked) return;

    const userExpr = t.placedTokens.join('').replace(/\s+/g, '').toLowerCase();
    const correctExpr = stage1.correctTokens.join('').replace(/\s+/g, '').toLowerCase();
    const targetExpr = stage1.targetExpression.replace(/\s+/g, '').toLowerCase();

    const isCorrect = userExpr === correctExpr || userExpr === targetExpr;

    if (isCorrect) {
      soundManager.play('powerup');
      const pts = activeChallenge.points + (t.streak > 0 ? 25 : 0);

      set({
        [teamKey]: {
          ...t,
          score: t.score + pts,
          stageScore: pts,
          streak: t.streak + 1,
          stagesCleared: Math.max(t.stagesCleared, 1),
          isLocked: true,
          lastResult: 'correct',
          lastFeedback: {
            message: 'STRUCTURE ASSEMBLED! AVIONICS LOCKED ✓',
            isCorrect: true,
            pointsEarned: pts,
          },
        },
        [shipKey]: {
          ...ship,
          stage1StructureDone: true,
          cockpitGlowIntensity: 1.0,
          serviceArmsAngle: 0.1,
        },
        toastMessage: `${t.name} SECURED STAGE 1 STRUCTURE!`,
      });

      // If both teams completed, reveal solution after short delay
      setTimeout(() => {
        const state = get();
        if (state.blueTeam.isLocked && state.redTeam.isLocked) {
          set({ phase: 'solution-reveal', timerActive: false });
        }
      }, 1400);
    } else {
      soundManager.play('wrong');
      set({
        [teamKey]: {
          ...t,
          streak: 0,
          lastResult: 'wrong',
          lastFeedback: {
            message: 'MISCONFIGURED: Check operational order (e.g. 3x + 5)',
            isCorrect: false,
            pointsEarned: 0,
          },
        },
      });
    }
  },

  // --------------------------------------------------------------------------
  // STAGE 2: Cryogenic Fuel Variable Loading
  // --------------------------------------------------------------------------
  setDialValue: (team, val) => {
    const key = team === 'blue' ? 'blueTeam' : 'redTeam';
    const shipKey = team === 'blue' ? 'blueSpacecraft' : 'redSpacecraft';
    const cur = get()[key];
    const ship = get()[shipKey];
    if (cur.isLocked) return;

    set({
      [key]: { ...cur, dialValue: val },
      [shipKey]: {
        ...ship,
        fuelTankPercent: Math.min(100, Math.max(10, (val / 12) * 100)),
        ventingVapor: true,
      },
    });
  },

  submitVariableLoading: (team) => {
    const { activeChallenge } = get();
    const stage2 = activeChallenge.stage2;
    if (!stage2) return;

    const teamKey = team === 'blue' ? 'blueTeam' : 'redTeam';
    const shipKey = team === 'blue' ? 'blueSpacecraft' : 'redSpacecraft';
    const t = get()[teamKey];
    const ship = get()[shipKey];
    if (t.isLocked) return;

    const isCorrect = t.dialValue === stage2.variableValue;

    if (isCorrect) {
      soundManager.play('powerup');
      const pts = activeChallenge.points + (t.streak > 0 ? 25 : 0);

      set({
        [teamKey]: {
          ...t,
          score: t.score + pts,
          stageScore: pts,
          streak: t.streak + 1,
          stagesCleared: Math.max(t.stagesCleared, 2),
          isLocked: true,
          lastResult: 'correct',
          lastFeedback: {
            message: `CRYOGENIC FUEL LOADED (${stage2.targetResult} L) ✓`,
            isCorrect: true,
            pointsEarned: pts,
          },
        },
        [shipKey]: {
          ...ship,
          stage2FuelDone: true,
          fuelTankPercent: 100,
          fuelArmConnected: true,
          ventingVapor: false,
        },
        toastMessage: `${t.name} LOADED CRYOGENIC FUEL!`,
      });

      setTimeout(() => {
        const state = get();
        if (state.blueTeam.isLocked && state.redTeam.isLocked) {
          set({ phase: 'solution-reveal', timerActive: false });
        }
      }, 1400);
    } else {
      soundManager.play('wrong');
      set({
        [teamKey]: {
          ...t,
          streak: 0,
          lastResult: 'wrong',
          lastFeedback: {
            message: `PRESSURE MISMATCH: Set ${stage2.variableName} = ${stage2.variableValue}`,
            isCorrect: false,
            pointsEarned: 0,
          },
        },
      });
    }
  },

  // --------------------------------------------------------------------------
  // STAGE 3: Rocket Engine Equation Balance
  // --------------------------------------------------------------------------
  setBalanceOperation: (team, op, val) => {
    const key = team === 'blue' ? 'blueTeam' : 'redTeam';
    const cur = get()[key];
    if (cur.isLocked) return;

    set({
      [key]: {
        ...cur,
        selectedBalanceOp: op,
        selectedBalanceVal: val,
      },
    });
  },

  submitEquationBalance: (team) => {
    const { activeChallenge } = get();
    const stage3 = activeChallenge.stage3;
    if (!stage3) return;

    const teamKey = team === 'blue' ? 'blueTeam' : 'redTeam';
    const shipKey = team === 'blue' ? 'blueSpacecraft' : 'redSpacecraft';
    const t = get()[teamKey];
    const ship = get()[shipKey];
    if (t.isLocked) return;

    const isCorrect =
      t.selectedBalanceOp === stage3.requiredOp &&
      t.selectedBalanceVal === stage3.requiredVal;

    if (isCorrect) {
      soundManager.play('powerup');
      const pts = activeChallenge.points + (t.streak > 0 ? 25 : 0);

      set({
        [teamKey]: {
          ...t,
          score: t.score + pts,
          stageScore: pts,
          streak: t.streak + 1,
          stagesCleared: Math.max(t.stagesCleared, 3),
          isLocked: true,
          balanceTiltedSide: 'balanced',
          lastResult: 'correct',
          lastFeedback: {
            message: `BALANCED! x = ${stage3.solutionX} ✓ ENGINES READY`,
            isCorrect: true,
            pointsEarned: pts,
          },
        },
        [shipKey]: {
          ...ship,
          stage3EngineDone: true,
          engineGlowIntensity: 1.0,
        },
        toastMessage: `${t.name} BALANCED ROCKET ENGINES!`,
      });

      setTimeout(() => {
        const state = get();
        if (state.blueTeam.isLocked && state.redTeam.isLocked) {
          set({ phase: 'solution-reveal', timerActive: false });
        }
      }, 1400);
    } else {
      soundManager.play('wrong');
      set({
        [teamKey]: {
          ...t,
          streak: 0,
          lastResult: 'wrong',
          lastFeedback: {
            message: `UNBALANCED: Apply inverse (${stage3.requiredOp}${stage3.requiredVal}) to both sides`,
            isCorrect: false,
            pointsEarned: 0,
          },
        },
      });
    }
  },

  // --------------------------------------------------------------------------
  // STAGE 4: Flight Path Formula Calibration
  // --------------------------------------------------------------------------
  setSpeedDial: (team, val) => {
    const key = team === 'blue' ? 'blueTeam' : 'redTeam';
    const cur = get()[key];
    if (cur.isLocked) return;
    set({ [key]: { ...cur, speedDial: val } });
  },

  setTimeDial: (team, val) => {
    const key = team === 'blue' ? 'blueTeam' : 'redTeam';
    const cur = get()[key];
    if (cur.isLocked) return;
    set({ [key]: { ...cur, timeDial: val } });
  },

  submitNavigationCalibration: (team) => {
    const { activeChallenge } = get();
    const stage4 = activeChallenge.stage4;
    if (!stage4) return;

    const teamKey = team === 'blue' ? 'blueTeam' : 'redTeam';
    const shipKey = team === 'blue' ? 'blueSpacecraft' : 'redSpacecraft';
    const t = get()[teamKey];
    const ship = get()[shipKey];
    if (t.isLocked) return;

    const computed = t.speedDial * t.timeDial;
    const isCorrect =
      computed === stage4.targetDistance &&
      t.speedDial === stage4.speedGiven &&
      t.timeDial === stage4.timeGiven;

    if (isCorrect) {
      soundManager.play('powerup');
      const pts = activeChallenge.points + (t.streak > 0 ? 25 : 0);

      set({
        [teamKey]: {
          ...t,
          score: t.score + pts,
          stageScore: pts,
          streak: t.streak + 1,
          stagesCleared: Math.max(t.stagesCleared, 4),
          isLocked: true,
          lastResult: 'correct',
          lastFeedback: {
            message: `FLIGHT PATH LOCKED (${stage4.targetDistance} ${stage4.distanceUnit}) ✓`,
            isCorrect: true,
            pointsEarned: pts,
          },
        },
        [shipKey]: {
          ...ship,
          stage4NavDone: true,
          antennaDeployed: true,
          gimbalPitchAngle: 0.08,
        },
        toastMessage: `${t.name} LOCKED ORBITAL TRAJECTORY!`,
      });

      setTimeout(() => {
        const state = get();
        if (state.blueTeam.isLocked && state.redTeam.isLocked) {
          set({ phase: 'solution-reveal', timerActive: false });
        }
      }, 1400);
    } else {
      soundManager.play('wrong');
      set({
        [teamKey]: {
          ...t,
          streak: 0,
          lastResult: 'wrong',
          lastFeedback: {
            message: `TRAJECTORY DRIFT: Match S = ${stage4.speedGiven}, T = ${stage4.timeGiven}`,
            isCorrect: false,
            pointsEarned: 0,
          },
        },
      });
    }
  },

  // --------------------------------------------------------------------------
  // STAGE 5: Final Launch Equation Lock & Arming
  // --------------------------------------------------------------------------
  setLockDigits: (team, d1, d2) => {
    const key = team === 'blue' ? 'blueTeam' : 'redTeam';
    const cur = get()[key];
    if (cur.isLocked) return;
    set({ [key]: { ...cur, lockDigit1: d1, lockDigit2: d2 } });
  },

  armLaunch: (team) => {
    const { activeChallenge } = get();
    const stage5 = activeChallenge.stage5;
    if (!stage5) return;

    const teamKey = team === 'blue' ? 'blueTeam' : 'redTeam';
    const shipKey = team === 'blue' ? 'blueSpacecraft' : 'redSpacecraft';
    const t = get()[teamKey];
    const ship = get()[shipKey];
    if (t.isLocked) return;

    const userX = t.lockDigit1 * 10 + t.lockDigit2;
    const isCorrect = userX === stage5.correctX;

    if (isCorrect) {
      soundManager.play('countdown');
      const pts = activeChallenge.points + (t.streak > 0 ? 50 : 0);

      set({
        [teamKey]: {
          ...t,
          score: t.score + pts,
          stageScore: pts,
          streak: t.streak + 1,
          stagesCleared: 5,
          isLocked: true,
          isArmed: true,
          lastResult: 'correct',
          lastFeedback: {
            message: 'LAUNCH INTERLOCK OPENED! ENGINES ARMED ✓',
            isCorrect: true,
            pointsEarned: pts,
          },
        },
        [shipKey]: {
          ...ship,
          stage5Armed: true,
          serviceArmsAngle: 1.0,
          clampsReleased: true,
        },
        toastMessage: `${t.name} COMPLETED FINAL LAUNCH INTERLOCK!`,
      });

      setTimeout(() => {
        const state = get();
        if (state.blueTeam.isLocked && state.redTeam.isLocked) {
          // Determine champion
          const blueScore = state.blueTeam.score;
          const redScore = state.redTeam.score;
          const winner: TeamId | 'draw' =
            blueScore > redScore ? 'blue' : redScore > blueScore ? 'red' : 'draw';
          set({ winnerTeam: winner });
          get().run12StepCinematicLaunch(winner);
        }
      }, 1500);
    } else {
      soundManager.play('wrong');
      set({
        [teamKey]: {
          ...t,
          streak: 0,
          lastResult: 'wrong',
          lastFeedback: {
            message: `INTERLOCK ERROR: Solve ${stage5.equationDisplay} for x`,
            isCorrect: false,
            pointsEarned: 0,
          },
        },
      });
    }
  },

  handleTimerExpired: () => {
    soundManager.play('alarm');
    set({
      timerActive: false,
      toastMessage: 'STAGE TIME EXPIRED — TELEMETRY REVEALED',
      phase: 'solution-reveal',
    });
  },

  advanceToNextStage: () => {
    const { currentStageIndex, campaign } = get();
    if (currentStageIndex >= 4) {
      const state = get();
      const blueScore = state.blueTeam.score;
      const redScore = state.redTeam.score;
      const winner: TeamId | 'draw' =
        blueScore > redScore ? 'blue' : redScore > blueScore ? 'red' : 'draw';
      set({ winnerTeam: winner });
      get().run12StepCinematicLaunch(winner);
    } else {
      const nextIdx = (currentStageIndex + 1) as StageIndex;
      const nextChallenge = campaign.challenges[nextIdx];
      set({
        currentStageIndex: nextIdx,
        activeChallenge: nextChallenge,
        phase: 'stage-intro',
        timeRemaining: nextChallenge.timeLimit,
        timerActive: false,
        cameraTarget: 'overview',
        blueTeam: {
          ...get().blueTeam,
          placedTokens: [],
          isLocked: false,
          lastResult: null,
          lastFeedback: null,
        },
        redTeam: {
          ...get().redTeam,
          placedTokens: [],
          isLocked: false,
          lastResult: null,
          lastFeedback: null,
        },
      });
    }
  },

  // --------------------------------------------------------------------------
  // 12-STEP DUAL-ROCKET CINEMATIC LIFTOFF SEQUENCER
  // --------------------------------------------------------------------------
  run12StepCinematicLaunch: (winner) => {
    clearLaunchInterval();
    set({
      phase: 'launch-cinematic',
      cameraTarget: 'hero-launch',
      timerActive: false,
      toastMessage: 'ALL SYSTEMS GO — FINAL LAUNCH SEQUENCE ENGAGED!',
    });

    const steps: LaunchStep[] = [
      'arming',
      'hazard-lights',
      'umbilical-retract',
      'fuel-decouple',
      'clamp-release',
      'ignition',
      'thrust-ramp',
      'liftoff',
      'tower-clear',
      'sky-ascent',
      'cloud-entry',
      'orbital-insertion',
      'complete',
    ];

    let stepIdx = 0;

    launchInterval = setInterval(() => {
      if (stepIdx >= steps.length) {
        clearLaunchInterval();
        set({
          phase: 'mission-report',
          cameraTarget: 'overview',
          toastMessage: 'MISSION SUCCESSFUL!',
        });
        soundManager.play('powerup');
        return;
      }

      const currentStep = steps[stepIdx];
      stepIdx++;

      // Trigger audio per step
      if (currentStep === 'hazard-lights') soundManager.play('alarm');
      if (currentStep === 'ignition') soundManager.play('countdown');
      if (currentStep === 'liftoff') soundManager.play('laser');

      set((s) => {
        const isBlueWinner = winner === 'blue' || winner === 'draw';
        const isRedWinner = winner === 'red' || winner === 'draw';

        const updateShip = (ship: Spacecraft3DState, isHero: boolean) => {
          let alt = ship.altitude;
          let flame = ship.exhaustFlameScale;
          let smoke = ship.smokeVolume;
          let arms = ship.serviceArmsAngle;
          let flags = ship.flagProminence;

          if (currentStep === 'umbilical-retract') arms = 0.5;
          if (currentStep === 'clamp-release') arms = 1.0;
          if (currentStep === 'ignition') {
            flame = 0.6;
            smoke = 0.7;
          }
          if (currentStep === 'thrust-ramp') {
            flame = 1.2;
            smoke = 1.5;
          }
          if (currentStep === 'liftoff') {
            alt = 3;
            flame = 1.8;
            smoke = 2.0;
            if (isHero) flags = 2.0;
          }
          if (currentStep === 'tower-clear') {
            alt = 12;
            flame = 2.0;
          }
          if (currentStep === 'sky-ascent') {
            alt = 35;
            flame = 2.2;
          }
          if (currentStep === 'cloud-entry') {
            alt = 75;
            flame = 2.4;
          }
          if (currentStep === 'orbital-insertion') {
            alt = 130;
            flame = 1.5;
          }

          return {
            ...ship,
            launchStage: currentStep,
            altitude: alt,
            exhaustFlameScale: flame,
            smokeVolume: smoke,
            serviceArmsAngle: arms,
            flagProminence: flags,
            clampsReleased: true,
          };
        };

        return {
          blueSpacecraft: updateShip(s.blueSpacecraft, isBlueWinner),
          redSpacecraft: updateShip(s.redSpacecraft, isRedWinner),
        };
      });
    }, 1400);
  },

  setTimeRemaining: (t) => set({ timeRemaining: t }),

  toggleMute: () => {
    const muted = soundManager.toggleMute();
    set({ isMuted: muted });
  },

  clearToast: () => set({ toastMessage: null }),
}));
