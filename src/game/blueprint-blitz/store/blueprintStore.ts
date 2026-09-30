// ============================================================
// BLUEPRINT BLITZ — Zustand Store & Mathematical Engine
// Supports:
// - Simultaneous Dual-Team Multiple Choice State (Blue LEFT, Red RIGHT)
// - 20 Shapes, Area & Volume Questions with Bloom Progression (Stages 1-5)
// - Instant Option Selection & Direct Evaluation
// - 2-Chance System with Diagnostic Coach Tips & Second Chances
// - 3D House Stage Progression per Correct Build
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

  // Direct Option Selection
  selectOption: (team: TeamId, option: string | number) => void;

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
  selectedOption: null,
  inputAnswer: '',
  eliminatedOptions: [],
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
    const firstChallenge = getRandomChallenge([], 1);

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
      },
      redTeam: {
        ...createInitialTeam('red', 'RED SQUAD'),
        score: isRedBoosted ? 100 : 0,
        completedChallengesCount: isRedBoosted ? 1 : 0,
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
      set({ timeRemaining: 0, isTimerRunning: false });
      get().triggerScanAndEvaluate();
    } else {
      set({ timeRemaining: timeRemaining - 1 });
    }
  },

  setCameraFocus: (_focus) => {
    set({ cameraFocus: 'overview' });
  },

  // ── DIRECT MULTIPLE CHOICE OPTION SELECTION ──
  selectOption: (teamId, option) => {
    const state = get();
    if (state.phase !== 'building' && state.phase !== 'tie-break' && state.phase !== 'mega-build') return;
    const isBlue = teamId === 'blue';
    const team = isBlue ? state.blueTeam : state.redTeam;
    if (team.build.isLocked || team.build.isConfirmed || team.attemptsLeft <= 0) return;

    blueprintAudio.playButtonTap();

    const updatedTeam: TeamGameState = {
      ...team,
      selectedOption: option,
      inputAnswer: String(option),
    };

    if (isBlue) {
      set({ blueTeam: updatedTeam });
    } else {
      set({ redTeam: updatedTeam });
    }
  },

  // ── Tactical Power-ups (1 per match per team) ──
  usePowerUp5050: (teamId) => {
    const state = get();
    const ch = state.activeChallenge;
    if (!ch || (state.phase !== 'building' && state.phase !== 'tie-break' && state.phase !== 'mega-build')) return;
    const isBlue = teamId === 'blue';
    const powerUps = isBlue ? state.bluePowerUps : state.redPowerUps;
    const team = isBlue ? state.blueTeam : state.redTeam;
    if (!powerUps.fiftyFifty) return;

    // Pick 2 incorrect options to eliminate
    const wrongOptions = ch.options.filter(
      (opt) => String(opt).trim().toLowerCase() !== String(ch.correctAnswer).trim().toLowerCase()
    );
    const shuffledWrong = [...wrongOptions].sort(() => Math.random() - 0.5);
    const eliminated = shuffledWrong.slice(0, 2);

    soundManager.play('powerup');
    set((s) => ({
      [isBlue ? 'bluePowerUps' : 'redPowerUps']: {
        ...powerUps,
        fiftyFifty: false,
      },
      [isBlue ? 'blueTeam' : 'redTeam']: {
        ...(isBlue ? s.blueTeam : s.redTeam),
        eliminatedOptions: eliminated,
      },
      toastMessage: `🔍 50:50 ASSIST ACTIVATED FOR ${team.name}! 2 INCORRECT CHOICES ELIMINATED!`,
    }));
  },

  usePowerUpTimeFreeze: (teamId) => {
    const state = get();
    if (state.phase !== 'building' && state.phase !== 'tie-break' && state.phase !== 'mega-build') return;
    const isBlue = teamId === 'blue';
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

  usePowerUp2x: (teamId) => {
    const state = get();
    if (state.phase !== 'building' && state.phase !== 'tie-break' && state.phase !== 'mega-build') return;
    const isBlue = teamId === 'blue';
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
    blueprintAudio.playRoundStart();
    set((prev) => ({
      phase: 'tie-break',
      isTieBreak: true,
      activeChallenge: rapidChallenge,
      timeRemaining: 15,
      isTimerRunning: true,
      cameraFocus: 'overview',
      toastMessage: `🚨 SUDDEN DEATH SPEED DUEL! 15 SECONDS! FIRST CORRECT ANSWER WINS!`,
      blueMisconception: null,
      redMisconception: null,
      blueTeam: {
        ...prev.blueTeam,
        roundScore: 0,
        attemptsLeft: 1,
        attemptCount: 0,
        selectedOption: null,
        inputAnswer: '',
        eliminatedOptions: [],
        scanResult: null,
        hasSecondChance: false,
        build: { ...DEFAULT_BUILD, isConfirmed: false, isLocked: false },
      },
      redTeam: {
        ...prev.redTeam,
        roundScore: 0,
        attemptsLeft: 1,
        attemptCount: 0,
        selectedOption: null,
        inputAnswer: '',
        eliminatedOptions: [],
        scanResult: null,
        hasSecondChance: false,
        build: { ...DEFAULT_BUILD, isConfirmed: false, isLocked: false },
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
    const chosenAnswer = team.selectedOption !== null ? team.selectedOption : team.inputAnswer;
    const evalResult = validateChallengeSolution(activeChallenge, chosenAnswer);

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
      selectedOption: chosenAnswer,
      correctAnswer: activeChallenge.correctAnswer,
      isCorrect: evalResult.isValid,
      statusMessage: evalResult.isValid
        ? '✓ ANSWER APPROVED!'
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

    if (!blueTeam.scanResult) get().submitBuild('blue');
    if (!redTeam.scanResult) get().submitBuild('red');

    set({ phase: 'round-result', cameraFocus: 'overview' });
  },

  allowSecondChance: (teamId) => {
    blueprintAudio.playButtonTap();
    set((prev) => {
      const team = teamId === 'blue' ? prev.blueTeam : prev.redTeam;
      const updatedTeam: TeamGameState = {
        ...team,
        build: { ...team.build, isLocked: false, isConfirmed: false },
        hasSecondChance: false,
      };
      return {
        phase: 'building',
        isTimerRunning: true,
        timeRemaining: 25,
        cameraFocus: 'overview',
        [teamId === 'blue' ? 'blueTeam' : 'redTeam']: updatedTeam,
      };
    });
  },

  nextRound: () => {
    const { currentRound, maxRounds, usedChallengeIds, blueTeam, redTeam } = get();

    if (currentRound >= maxRounds || blueTeam.completedChallengesCount >= maxRounds || redTeam.completedChallengesCount >= maxRounds) {
      if (blueTeam.completedChallengesCount === redTeam.completedChallengesCount && blueTeam.score === redTeam.score) {
        get().startTieBreak();
        return;
      }

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
    
    const nextChallenge = getRandomChallenge(
      usedChallengeIds,
      isMegaRound ? 5 : (nextRoundNumber as 1 | 2 | 3 | 4)
    );

    blueprintAudio.playButtonTap();
    set({
      currentRound: nextRoundNumber,
      phase: 'briefing',
      activeChallenge: nextChallenge,
      usedChallengeIds: [...usedChallengeIds, nextChallenge.id],
      timeRemaining: nextChallenge.timeLimit || 50,
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
        selectedOption: null,
        inputAnswer: '',
        eliminatedOptions: [],
        build: { ...DEFAULT_BUILD, isConfirmed: false, isLocked: false },
        scanResult: null,
        hasSecondChance: false,
      },
      redTeam: {
        ...redTeam,
        roundScore: 0,
        attemptsLeft: 2,
        attemptCount: 0,
        selectedOption: null,
        inputAnswer: '',
        eliminatedOptions: [],
        build: { ...DEFAULT_BUILD, isConfirmed: false, isLocked: false },
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
