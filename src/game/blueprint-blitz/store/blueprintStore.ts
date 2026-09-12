// ============================================================
// BLUEPRINT BLITZ — Zustand Store & Mathematical Engine
// Supports:
// - Simultaneous Dual-Team State (Blue LEFT, Red RIGHT)
// - Non-Repeating 100 Challenge Deck Selection with Bloom Progression
// - Independent 3D Physical Floor, Cube & Crane Manipulations
// - Multi-Solution Mathematical Validation
// - Diagnostic Second-Chance Learning Logic
// ============================================================

import { create } from 'zustand';
import {
  BlueprintChallenge,
  GamePhase,
  GameSettings,
  ScoreBreakdown,
  ScanResult,
  TeamBuild,
  TeamGameState,
  TeamId,
} from '../types';
import {
  BLUEPRINT_CHALLENGES,
  validateChallengeSolution,
  getRandomChallenge,
} from '../data/blueprintChallenges';
import { blueprintAudio } from '../audio/blueprintAudio';
import { initialBoostManager } from '@/utils/initialBoost';
import { TeamPowerUps, initialTeamPowerUps } from '@/types/powerUps';
import { getMisconceptionHint } from '@/utils/misconceptions';
import { soundManager } from '@/utils/audio';


interface BlueprintBlitzStore {
  // Game lifecycle
  phase: GamePhase;
  currentRound: number;
  maxRounds: 5 | 10 | 15 | 20;
  setMaxRounds: (rounds: 5 | 10 | 15 | 20) => void;
  activeChallenge: BlueprintChallenge | null;
  usedChallengeIds: string[];
  cameraFocus: 'overview' | 'blue' | 'red' | 'scanner' | 'podium';
  toastMessage: string | null;
  clearToast: () => void;

  // Shared Countdown Timer
  timeRemaining: number;
  isTimerRunning: boolean;

  // Dual Team States
  blueTeam: TeamGameState;
  redTeam: TeamGameState;

  // Power-Ups & Misconception State
  bluePowerUps: TeamPowerUps;
  redPowerUps: TeamPowerUps;
  blueMisconception: string | null;
  redMisconception: string | null;
  isTieBreak: boolean;

  // Final Outcome
  winner: TeamId | 'tie' | null;
  settings: GameSettings;

  // Actions
  initGame: () => void;
  startBriefing: () => void;
  startBuilding: () => void;
  tickTimer: () => void;
  setCameraFocus: (focus: 'overview' | 'blue' | 'red' | 'scanner' | 'podium') => void;

  // Team Building Controls
  adjustDimension: (team: TeamId, dim: 'length' | 'width' | 'height', delta: number) => void;
  setDimension: (team: TeamId, dim: 'length' | 'width' | 'height', val: number) => void;
  adjustBlocks: (team: TeamId, delta: number) => void;
  setShapeType: (team: TeamId, shape: string) => void;
  selectTool: (team: TeamId, tool: 'tile' | 'cube' | 'crane' | 'demolish') => void;
  operateCrane: (
    team: TeamId,
    action: 'rotate_left' | 'rotate_right' | 'move_forward' | 'move_back' | 'up' | 'down' | 'grab_release'
  ) => void;

  // Tactical Power-ups & Tiebreaker
  usePowerUp5050: (team: TeamId) => void;
  usePowerUpTimeFreeze: (team: TeamId) => void;
  usePowerUp2x: (team: TeamId) => void;
  startTieBreak: () => void;

  // Scanning & Submission
  submitBuild: (team: TeamId) => void;
  triggerScanAndEvaluate: () => void;
  allowSecondChance: (team: TeamId) => void;
  nextRound: () => void;
  restartGame: () => void;
  toggleMute: () => void;
}


const DEFAULT_BUILD: TeamBuild = {
  length: 4,
  width: 3,
  height: 1,
  blocks: 12,
  shapeType: 'rectangle',
  selectedTool: 'tile',
  cranePosition: [0, 2, 0],
  craneAngle: 0,
  craneHeight: 2,
  craneHolding: false,
  placedPiecesCount: 12,
  isConfirmed: false,
  isLocked: false,
};

const createInitialTeam = (id: TeamId, name: string): TeamGameState => ({
  id,
  name,
  score: 0,
  roundScore: 0,
  completedChallengesCount: 0,
  attemptsLeft: 2,
  attemptCount: 0,
  build: { ...DEFAULT_BUILD },
  scanResult: null,
  hasSecondChance: false,
});

export const useBlueprintStore = create<BlueprintBlitzStore>((set, get) => ({
  phase: 'intro',
  currentRound: 1,
  maxRounds: 5,
  activeChallenge: null,
  usedChallengeIds: [],
  cameraFocus: 'overview',

  timeRemaining: 50,
  isTimerRunning: false,

  blueTeam: createInitialTeam('blue', 'BLUE SQUAD'),
  redTeam: createInitialTeam('red', 'RED SQUAD'),

  bluePowerUps: initialTeamPowerUps(),
  redPowerUps: initialTeamPowerUps(),
  blueMisconception: null,
  redMisconception: null,
  isTieBreak: false,

  winner: null,
  toastMessage: null,
  clearToast: () => set({ toastMessage: null }),
  setMaxRounds: (rounds: 5 | 10 | 15 | 20) => set({ maxRounds: rounds }),
  settings: {
    roundDuration: 50,
    isMuted: false,
    soundVolume: 0.8,
    maxRounds: 5,
  },

  initGame: () => {
    // Pick the first challenge
    const firstChallenge = getRandomChallenge([], 1);
    const initialBlueBuild: TeamBuild = {
      ...DEFAULT_BUILD,
      length: firstChallenge.initialBuild.length,
      width: firstChallenge.initialBuild.width,
      height: firstChallenge.initialBuild.height,
      blocks: firstChallenge.initialBuild.blocks || (firstChallenge.initialBuild.length * firstChallenge.initialBuild.width * firstChallenge.initialBuild.height),
      shapeType: firstChallenge.initialBuild.shapeType || 'rectangle',
      selectedTool: firstChallenge.mechanic === 'cubes' ? 'cube' : firstChallenge.mechanic === 'crane' ? 'crane' : 'tile',
    };
    const initialRedBuild: TeamBuild = { ...initialBlueBuild };

    // Check Initial Boost from previous game winner
    const boost = initialBoostManager.getBoost();
    const isBlueBoosted = boost?.winnerId === 'blue';
    const isRedBoosted = boost?.winnerId === 'red';

    let boostToast: string | null = null;
    if (boost) {
      const winnerName = boost.winnerId === 'blue' ? 'BLUE SQUAD' : 'RED SQUAD';
      boostToast = `⚡ INITIAL BOOST: ${winnerName} starts with +1 Completed Build in the bag from winning ${boost.gameTitle}!`;
    }

    set({
      phase: 'intro',
      currentRound: 1,
      activeChallenge: firstChallenge,
      usedChallengeIds: [firstChallenge.id],
      timeRemaining: firstChallenge.timeLimit || 50,
      isTimerRunning: false,
      cameraFocus: 'overview',
      toastMessage: boostToast,
      bluePowerUps: initialTeamPowerUps(),
      redPowerUps: initialTeamPowerUps(),
      blueMisconception: null,
      redMisconception: null,
      isTieBreak: false,
      blueTeam: {
        ...createInitialTeam('blue', 'BLUE SQUAD'),
        score: isBlueBoosted ? 100 : 0,
        completedChallengesCount: isBlueBoosted ? 1 : 0,
        build: initialBlueBuild,
      },
      redTeam: {
        ...createInitialTeam('red', 'RED SQUAD'),
        score: isRedBoosted ? 100 : 0,
        completedChallengesCount: isRedBoosted ? 1 : 0,
        build: initialRedBuild,
      },
      winner: null,
    });

    blueprintAudio.startBgm();
  },


  startBriefing: () => {
    blueprintAudio.playButtonTap();
    set({ phase: 'briefing', cameraFocus: 'overview' });
  },

  startBuilding: () => {
    const { activeChallenge } = get();
    blueprintAudio.playRoundStart();
    set({
      phase: 'building',
      isTimerRunning: true,
      timeRemaining: activeChallenge?.timeLimit || 50,
      cameraFocus: 'overview',
    });
  },

  tickTimer: () => {
    const { timeRemaining, isTimerRunning, phase } = get();
    if (!isTimerRunning || phase !== 'building') return;

    if (timeRemaining <= 1) {
      // Time is up - automatically evaluate remaining builds
      set({ timeRemaining: 0, isTimerRunning: false });
      get().triggerScanAndEvaluate();
    } else {
      set({ timeRemaining: timeRemaining - 1 });
    }
  },

  setCameraFocus: (focus) => {
    // Keep camera on balanced overview so both sides have a fair view
    set({ cameraFocus: 'overview' });
  },

  adjustDimension: (teamId, dim, delta) => {
    const state = get();
    if (state.phase !== 'building' && state.phase !== 'mega-build') return;
    const team = teamId === 'blue' ? state.blueTeam : state.redTeam;
    if (team.build.isLocked) return;

    const currentVal = team.build[dim];
    const nextVal = Math.max(1, Math.min(12, currentVal + delta));
    if (currentVal === nextVal) return;

    if (delta > 0) {
      if (team.build.shapeType === 'wood') {
        blueprintAudio.playWoodPlace();
      } else {
        blueprintAudio.playStonePlace();
      }
    } else {
      blueprintAudio.playBlockRemove();
    }

    const nextBuild = {
      ...team.build,
      [dim]: nextVal,
      blocks: dim === 'height' 
        ? team.build.length * team.build.width * nextVal 
        : dim === 'length' 
          ? nextVal * team.build.width * team.build.height 
          : team.build.length * nextVal * team.build.height,
    };

    if (teamId === 'blue') {
      set({ blueTeam: { ...team, build: nextBuild } });
    } else {
      set({ redTeam: { ...team, build: nextBuild } });
    }
  },

  setDimension: (teamId, dim, val) => {
    const state = get();
    if (state.phase !== 'building' && state.phase !== 'mega-build') return;
    const team = teamId === 'blue' ? state.blueTeam : state.redTeam;
    if (team.build.isLocked) return;

    const clampedVal = Math.max(1, Math.min(12, val));
    blueprintAudio.playButtonTap();

    const nextBuild = {
      ...team.build,
      [dim]: clampedVal,
      blocks: dim === 'height'
        ? team.build.length * team.build.width * clampedVal
        : dim === 'length'
          ? clampedVal * team.build.width * team.build.height
          : team.build.length * clampedVal * team.build.height,
    };

    if (teamId === 'blue') {
      set({ blueTeam: { ...team, build: nextBuild } });
    } else {
      set({ redTeam: { ...team, build: nextBuild } });
    }
  },

  adjustBlocks: (teamId, delta) => {
    const state = get();
    if (state.phase !== 'building' && state.phase !== 'mega-build') return;
    const team = teamId === 'blue' ? state.blueTeam : state.redTeam;
    if (team.build.isLocked) return;

    const currentBlocks = team.build.blocks;
    const nextBlocks = Math.max(1, Math.min(64, currentBlocks + delta));
    if (currentBlocks === nextBlocks) return;

    if (delta > 0) {
      if (team.build.shapeType === 'wood') {
        blueprintAudio.playWoodPlace();
      } else {
        blueprintAudio.playStonePlace();
      }
    } else {
      blueprintAudio.playBlockRemove();
    }

    const nextBuild = { ...team.build, blocks: nextBlocks };
    if (teamId === 'blue') {
      set({ blueTeam: { ...team, build: nextBuild } });
    } else {
      set({ redTeam: { ...team, build: nextBuild } });
    }
  },

  setShapeType: (teamId, shape) => {
    const state = get();
    const team = teamId === 'blue' ? state.blueTeam : state.redTeam;
    blueprintAudio.playButtonTap();
    const nextBuild = { ...team.build, shapeType: shape };
    if (teamId === 'blue') {
      set({ blueTeam: { ...team, build: nextBuild } });
    } else {
      set({ redTeam: { ...team, build: nextBuild } });
    }
  },

  selectTool: (teamId, tool) => {
    const state = get();
    const team = teamId === 'blue' ? state.blueTeam : state.redTeam;
    blueprintAudio.playButtonTap();
    const nextBuild = { ...team.build, selectedTool: tool };
    if (teamId === 'blue') {
      set({ blueTeam: { ...team, build: nextBuild } });
    } else {
      set({ redTeam: { ...team, build: nextBuild } });
    }
  },

  operateCrane: (teamId, action) => {
    const state = get();
    if (state.phase !== 'building' && state.phase !== 'mega-build') return;
    const team = teamId === 'blue' ? state.blueTeam : state.redTeam;

    let { craneAngle, craneHeight, craneHolding, cranePosition } = team.build;
    blueprintAudio.playCraneMove();

    switch (action) {
      case 'rotate_left':
        craneAngle = (craneAngle - Math.PI / 8) % (Math.PI * 2);
        break;
      case 'rotate_right':
        craneAngle = (craneAngle + Math.PI / 8) % (Math.PI * 2);
        break;
      case 'up':
        craneHeight = Math.min(5, craneHeight + 0.5);
        break;
      case 'down':
        craneHeight = Math.max(1, craneHeight - 0.5);
        break;
      case 'move_forward':
        cranePosition = [cranePosition[0], cranePosition[1], cranePosition[2] + 0.5];
        break;
      case 'move_back':
        cranePosition = [cranePosition[0], cranePosition[1], cranePosition[2] - 0.5];
        break;
      case 'grab_release':
        craneHolding = !craneHolding;
        if (!craneHolding) {
          blueprintAudio.playBlockPlace();
        }
        break;
    }

    const nextBuild: TeamBuild = {
      ...team.build,
      craneAngle,
      craneHeight,
      craneHolding,
      cranePosition,
    };

    if (teamId === 'blue') {
      set({ blueTeam: { ...team, build: nextBuild } });
    } else {
      set({ redTeam: { ...team, build: nextBuild } });
    }
  },

  // ── Tactical Power-ups (1 per match per team) ──
  usePowerUp5050: (team) => {
    const state = get();
    const ch = state.activeChallenge;
    if (!ch || (state.phase !== 'building' && state.phase !== 'tie-break' && state.phase !== 'mega-build')) return;
    const isBlue = team === 'blue';
    const powerUps = isBlue ? state.bluePowerUps : state.redPowerUps;
    if (!powerUps.fiftyFifty) return;

    const currentBuild = isBlue ? state.blueTeam.build : state.redTeam.build;
    let nextBuild = { ...currentBuild };

    // Auto-assist with one correct target dimension
    if (ch.target.length) {
      nextBuild.length = ch.target.length;
    } else if (ch.target.width) {
      nextBuild.width = ch.target.width;
    } else if (ch.target.height) {
      nextBuild.height = ch.target.height;
    } else if (ch.target.area) {
      const targetL = Math.max(1, Math.min(12, Math.round(ch.target.area / currentBuild.width)));
      nextBuild.length = targetL;
    } else if (ch.target.volume) {
      const targetH = Math.max(1, Math.min(10, Math.round(ch.target.volume / (currentBuild.length * currentBuild.width))));
      nextBuild.height = targetH;
    }

    nextBuild.blocks = nextBuild.length * nextBuild.width * nextBuild.height;

    soundManager.play('powerup');
    set((s) => ({
      [isBlue ? 'bluePowerUps' : 'redPowerUps']: {
        ...powerUps,
        fiftyFifty: false,
      },
      [isBlue ? 'blueTeam' : 'redTeam']: {
        ...(isBlue ? s.blueTeam : s.redTeam),
        build: nextBuild,
      },
      toastMessage: `🔍 50:50 ASSIST ACTIVATED FOR ${isBlue ? s.blueTeam.name : s.redTeam.name}! OPTIMAL DIMENSION SET!`,
    }));
  },

  usePowerUpTimeFreeze: (team) => {
    const state = get();
    if (state.phase !== 'building' && state.phase !== 'tie-break' && state.phase !== 'mega-build') return;
    const isBlue = team === 'blue';
    const powerUps = isBlue ? state.bluePowerUps : state.redPowerUps;
    if (!powerUps.timeFreeze) return;

    soundManager.play('powerup');
    set((s) => ({
      [isBlue ? 'bluePowerUps' : 'redPowerUps']: {
        ...powerUps,
        timeFreeze: false,
      },
      timeRemaining: s.timeRemaining + 10,
      toastMessage: `⏳ TIME FREEZE ACTIVATED! +10 SECONDS ADDED!`,
    }));
  },

  usePowerUp2x: (team) => {
    const state = get();
    if (state.phase !== 'building' && state.phase !== 'tie-break' && state.phase !== 'mega-build') return;
    const isBlue = team === 'blue';
    const powerUps = isBlue ? state.bluePowerUps : state.redPowerUps;
    if (!powerUps.doublePoints) return;

    soundManager.play('powerup');
    set((s) => ({
      [isBlue ? 'bluePowerUps' : 'redPowerUps']: {
        ...powerUps,
        doublePoints: false,
        active2x: true,
      },
      toastMessage: `⚡ 2X SCORE MULTIPLIER ACTIVATED FOR ${isBlue ? s.blueTeam.name : s.redTeam.name}!`,
    }));
  },

  // ── Sudden Death "Speed Duel" Tiebreaker (15-second rapid question) ──
  startTieBreak: () => {
    const rapidChallenge = getRandomChallenge([], 2);
    const initialBlueBuild: TeamBuild = {
      ...DEFAULT_BUILD,
      length: rapidChallenge.initialBuild.length,
      width: rapidChallenge.initialBuild.width,
      height: rapidChallenge.initialBuild.height,
      blocks: rapidChallenge.initialBuild.blocks || (rapidChallenge.initialBuild.length * rapidChallenge.initialBuild.width * rapidChallenge.initialBuild.height),
      shapeType: rapidChallenge.initialBuild.shapeType || 'rectangle',
      selectedTool: rapidChallenge.mechanic === 'cubes' ? 'cube' : rapidChallenge.mechanic === 'crane' ? 'crane' : 'tile',
      isConfirmed: false,
      isLocked: false,
    };
    const initialRedBuild: TeamBuild = { ...initialBlueBuild };

    blueprintAudio.playRoundStart();
    set((prev) => ({
      phase: 'tie-break',
      isTieBreak: true,
      activeChallenge: rapidChallenge,
      timeRemaining: 15,
      isTimerRunning: true,
      cameraFocus: 'overview',
      toastMessage: `🚨 SUDDEN DEATH SPEED DUEL! 15 SECONDS! FIRST CORRECT BUILD WINS!`,
      blueMisconception: null,
      redMisconception: null,
      blueTeam: {
        ...prev.blueTeam,
        roundScore: 0,
        attemptsLeft: 1,
        attemptCount: 0,
        build: initialBlueBuild,
        scanResult: null,
        hasSecondChance: false,
      },
      redTeam: {
        ...prev.redTeam,
        roundScore: 0,
        attemptsLeft: 1,
        attemptCount: 0,
        build: initialRedBuild,
        scanResult: null,
        hasSecondChance: false,
      },
    }));
  },

  // ── INDEPENDENT SUBMIT WITH 2 CHANCES PER TEAM ──
  submitBuild: (teamId) => {
    const state = get();
    const { activeChallenge, bluePowerUps, redPowerUps, phase, isTieBreak } = state;
    if (!activeChallenge) return;

    const team = teamId === 'blue' ? state.blueTeam : state.redTeam;
    if (team.attemptsLeft <= 0 || (team.scanResult && team.scanResult.isCorrect)) return;

    const isBlue = teamId === 'blue';
    const otherTeam = isBlue ? state.redTeam : state.blueTeam;
    const powerUps = isBlue ? bluePowerUps : redPowerUps;

    // Check Comeback Surge: +25% bonus points when trailing by 2+ structures or 150+ pts
    const isTrailingByChallenges = otherTeam.completedChallengesCount - team.completedChallengesCount >= 2;
    const isTrailingByPoints = otherTeam.score - team.score >= 150;
    const isComebackSurge = isTrailingByChallenges || isTrailingByPoints;

    const nextAttemptCount = team.attemptCount + 1;
    const nextAttemptsLeft = Math.max(0, team.attemptsLeft - 1);
    const evalResult = validateChallengeSolution(activeChallenge, team.build);

    const isFirstAttempt = nextAttemptCount === 1;
    const speedBonus = isFirstAttempt ? 25 : 10;
    const basePts = evalResult.isValid ? activeChallenge.basePoints : 0;
    const rawTotal = evalResult.isValid ? basePts + speedBonus : 0;
    const surgeBonus = isComebackSurge && evalResult.isValid ? Math.round(rawTotal * 0.25) : 0;
    const multiplier = powerUps.active2x ? 2 : 1;
    const totalAward = (rawTotal + surgeBonus) * multiplier;

    const scoreBreakdown: ScoreBreakdown = {
      base: basePts,
      speed: evalResult.isValid ? speedBonus : 0,
      precision: evalResult.isValid ? 30 : 0,
      efficiency: evalResult.isValid ? 20 : 0,
      total: totalAward,
    };

    const scanResult: ScanResult = {
      teamId,
      measuredLength: team.build.length,
      measuredWidth: team.build.width,
      measuredHeight: team.build.height,
      measuredArea: team.build.length * team.build.width,
      measuredVolume: team.build.length * team.build.width * team.build.height,
      targetDescription: activeChallenge.target.description,
      isCorrect: evalResult.isValid,
      statusMessage: evalResult.isValid
        ? '✓ BUILD APPROVED!'
        : nextAttemptsLeft > 0
          ? '✕ CHANCE 1 WRONG — 1 CHANCE LEFT!'
          : '✕ OUT OF CHANCES',
      diffMessage: evalResult.diffMessage,
      formula: evalResult.formula,
      scoreBreakdown,
      timestamp: Date.now(),
    };

    // Play appropriate sound feedback
    if (evalResult.isValid) {
      blueprintAudio.playBuildApproved();
    } else {
      blueprintAudio.playBuildMismatch();
    }

    // Targeted Misconception Hints on 1st error
    let hint: string | null = null;
    if (!evalResult.isValid && nextAttemptsLeft > 0) {
      hint = getMisconceptionHint('geometry', activeChallenge.prompt + ' ' + (activeChallenge.target.description || ''));
    }

    const isNowLocked = evalResult.isValid || nextAttemptsLeft <= 0;
    const updatedTeam: TeamGameState = {
      ...team,
      score: team.score + totalAward,
      roundScore: totalAward,
      completedChallengesCount: team.completedChallengesCount + (evalResult.isValid ? 1 : 0),
      attemptsLeft: nextAttemptsLeft,
      attemptCount: nextAttemptCount,
      scanResult,
      build: {
        ...team.build,
        isConfirmed: evalResult.isValid,
        isLocked: isNowLocked,
      },
    };

    // Sudden Death Instant Win Handling
    if ((phase === 'tie-break' || isTieBreak) && evalResult.isValid) {
      blueprintAudio.playChampionshipVictory();
      initialBoostManager.recordWinner(teamId, updatedTeam.name, 'Blueprint Blitz');
      set({
        phase: 'game-over',
        winner: teamId,
        cameraFocus: 'podium',
        isTimerRunning: false,
        [isBlue ? 'blueTeam' : 'redTeam']: updatedTeam,
      });
      return;
    }

    // Reset 2x Multiplier on team if used
    const updatedPowerUps = powerUps.active2x ? { ...powerUps, active2x: false } : powerUps;

    if (teamId === 'blue') {
      set({
        blueTeam: updatedTeam,
        bluePowerUps: updatedPowerUps,
        blueMisconception: hint !== null ? hint : state.blueMisconception,
      });
    } else {
      set({
        redTeam: updatedTeam,
        redPowerUps: updatedPowerUps,
        redMisconception: hint !== null ? hint : state.redMisconception,
      });
    }

    // Check if both teams are done
    const otherDone = (otherTeam.scanResult && otherTeam.scanResult.isCorrect) || otherTeam.attemptsLeft <= 0;
    const thisDone = isNowLocked;

    if (thisDone && otherDone) {
      setTimeout(() => {
        set({ phase: 'round-result', cameraFocus: 'overview' });
      }, 1500);
    }
  },

  triggerScanAndEvaluate: () => {
    const { activeChallenge, blueTeam, redTeam } = get();
    if (!activeChallenge) return;

    // Evaluate remaining teams if timer ran out
    if (!blueTeam.scanResult) get().submitBuild('blue');
    if (!redTeam.scanResult) get().submitBuild('red');

    set({ phase: 'round-result', cameraFocus: 'overview' });
  },

  allowSecondChance: (teamId) => {
    blueprintAudio.playButtonTap();
    set((prev) => {
      const team = teamId === 'blue' ? prev.blueTeam : prev.redTeam;
      const updatedTeam = {
        ...team,
        build: { ...team.build, isLocked: false, isConfirmed: false },
        hasSecondChance: false,
      };
      return {
        phase: 'building',
        isTimerRunning: true,
        timeRemaining: 25, // 25 bonus seconds to refine & fix build
        cameraFocus: 'overview',
        [teamId === 'blue' ? 'blueTeam' : 'redTeam']: updatedTeam,
      };
    });
  },

  nextRound: () => {
    const { currentRound, maxRounds, usedChallengeIds, blueTeam, redTeam } = get();

    if (currentRound >= maxRounds || blueTeam.completedChallengesCount >= maxRounds || redTeam.completedChallengesCount >= maxRounds) {
      // Sudden Death Check: If scores or completed challenges are tied
      if (blueTeam.completedChallengesCount === redTeam.completedChallengesCount && blueTeam.score === redTeam.score) {
        get().startTieBreak();
        return;
      }

      // Game Over / Podium Phase - Winner Close-up on Completed Dream House
      blueprintAudio.playChampionshipVictory();
      const finalWinner: TeamId | 'tie' =
        blueTeam.completedChallengesCount > redTeam.completedChallengesCount
          ? 'blue'
          : redTeam.completedChallengesCount > blueTeam.completedChallengesCount
            ? 'red'
            : blueTeam.score > redTeam.score
              ? 'blue'
              : redTeam.score > blueTeam.score
                ? 'red'
                : 'tie';

      if (finalWinner !== 'tie') {
        const winnerName = finalWinner === 'blue' ? blueTeam.name : redTeam.name;
        initialBoostManager.recordWinner(finalWinner, winnerName, 'Blueprint Blitz');
      }

      set({
        phase: 'game-over',
        winner: finalWinner,
        cameraFocus: 'podium',
      });
      return;
    }

    const nextRoundNumber = currentRound + 1;
    const isMegaRound = nextRoundNumber === maxRounds;
    
    // Pick next challenge progressing in difficulty / mechanics
    const nextChallenge = getRandomChallenge(
      usedChallengeIds,
      isMegaRound ? 5 : (nextRoundNumber as 1 | 2 | 3 | 4)
    );

    const initialBlueBuild: TeamBuild = {
      ...DEFAULT_BUILD,
      length: nextChallenge.initialBuild.length,
      width: nextChallenge.initialBuild.width,
      height: nextChallenge.initialBuild.height,
      blocks: nextChallenge.initialBuild.blocks || (nextChallenge.initialBuild.length * nextChallenge.initialBuild.width * nextChallenge.initialBuild.height),
      shapeType: nextChallenge.initialBuild.shapeType || 'rectangle',
      selectedTool: nextChallenge.mechanic === 'cubes' ? 'cube' : nextChallenge.mechanic === 'crane' ? 'crane' : 'tile',
      isConfirmed: false,
      isLocked: false,
    };
    const initialRedBuild: TeamBuild = { ...initialBlueBuild };

    blueprintAudio.playButtonTap();
    set({
      currentRound: nextRoundNumber,
      phase: isMegaRound ? 'mega-build' : 'briefing',
      activeChallenge: nextChallenge,
      usedChallengeIds: [...usedChallengeIds, nextChallenge.id],
      timeRemaining: nextChallenge.timeLimit,
      isTimerRunning: false,
      cameraFocus: 'overview',
      blueMisconception: null,
      redMisconception: null,
      bluePowerUps: { ...get().bluePowerUps, active2x: false },
      redPowerUps: { ...get().redPowerUps, active2x: false },
      blueTeam: {
        ...blueTeam,
        roundScore: 0,
        attemptsLeft: 2,
        attemptCount: 0,
        build: initialBlueBuild,
        scanResult: null,
        hasSecondChance: false,
      },
      redTeam: {
        ...redTeam,
        roundScore: 0,
        attemptsLeft: 2,
        attemptCount: 0,
        build: initialRedBuild,
        scanResult: null,
        hasSecondChance: false,
      },
    });
  },

  restartGame: () => {
    get().initGame();
  },

  toggleMute: () => {
    const muted = blueprintAudio.toggleMute();
    set((prev) => ({
      settings: { ...prev.settings, isMuted: muted },
    }));
  },
}));

