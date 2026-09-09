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

interface BlueprintBlitzStore {
  // Game lifecycle
  phase: GamePhase;
  currentRound: number;
  maxRounds: number;
  activeChallenge: BlueprintChallenge | null;
  usedChallengeIds: string[];
  cameraFocus: 'overview' | 'blue' | 'red' | 'scanner' | 'podium';

  // Shared Countdown Timer
  timeRemaining: number;
  isTimerRunning: boolean;

  // Dual Team States
  blueTeam: TeamGameState;
  redTeam: TeamGameState;

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

  timeRemaining: 45,
  isTimerRunning: false,

  blueTeam: createInitialTeam('blue', 'BLUE SQUAD'),
  redTeam: createInitialTeam('red', 'RED SQUAD'),

  winner: null,
  settings: {
    roundDuration: 45,
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

    set({
      phase: 'intro',
      currentRound: 1,
      activeChallenge: firstChallenge,
      usedChallengeIds: [firstChallenge.id],
      timeRemaining: firstChallenge.timeLimit,
      isTimerRunning: false,
      cameraFocus: 'overview',
      blueTeam: {
        ...createInitialTeam('blue', 'BLUE SQUAD'),
        build: initialBlueBuild,
      },
      redTeam: {
        ...createInitialTeam('red', 'RED SQUAD'),
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
      timeRemaining: activeChallenge?.timeLimit || 45,
      cameraFocus: 'overview',
    });
  },

  tickTimer: () => {
    const { timeRemaining, isTimerRunning, phase } = get();
    if (!isTimerRunning || phase !== 'building') return;

    if (timeRemaining <= 1) {
      // Time is up - automatically trigger measurement scan
      set({ timeRemaining: 0, isTimerRunning: false });
      get().triggerScanAndEvaluate();
    } else {
      set({ timeRemaining: timeRemaining - 1 });
    }
  },

  setCameraFocus: (focus) => {
    set({ cameraFocus: focus });
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
      blueprintAudio.playBlockPlace();
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
      blueprintAudio.playBlockPlace();
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

  submitBuild: (teamId) => {
    const state = get();
    const team = teamId === 'blue' ? state.blueTeam : state.redTeam;
    blueprintAudio.playButtonTap();

    const nextBuild = { ...team.build, isConfirmed: true, isLocked: true };
    if (teamId === 'blue') {
      set({ blueTeam: { ...team, build: nextBuild } });
    } else {
      set({ redTeam: { ...team, build: nextBuild } });
    }

    // Check if both teams have submitted
    const otherTeam = teamId === 'blue' ? state.redTeam : state.blueTeam;
    if (otherTeam.build.isConfirmed || state.timeRemaining <= 0) {
      get().triggerScanAndEvaluate();
    }
  },

  triggerScanAndEvaluate: () => {
    const { activeChallenge, blueTeam, redTeam, timeRemaining } = get();
    if (!activeChallenge) return;

    set({ phase: 'scanning', isTimerRunning: false, cameraFocus: 'scanner' });
    blueprintAudio.playScannerSweep();

    // Perform scanner evaluation after cinematic scan sweep (1.8s)
    setTimeout(() => {
      const timeElapsed = activeChallenge.timeLimit - Math.max(0, timeRemaining);
      const speedBonus = Math.max(0, Math.round(((activeChallenge.timeLimit - timeElapsed) / activeChallenge.timeLimit) * 20));

      // Evaluate Blue Team
      const blueEval = validateChallengeSolution(activeChallenge, blueTeam.build);
      const blueBreakdown: ScoreBreakdown = {
        base: blueEval.isValid ? activeChallenge.basePoints : 0,
        speed: blueEval.isValid ? speedBonus : 0,
        precision: blueEval.isValid ? 30 : 0,
        efficiency: blueEval.isValid ? 20 : 0,
        total: blueEval.isValid ? activeChallenge.basePoints + speedBonus + 30 + 20 : 0,
      };

      const blueScanResult: ScanResult = {
        teamId: 'blue',
        measuredLength: blueTeam.build.length,
        measuredWidth: blueTeam.build.width,
        measuredHeight: blueTeam.build.height,
        measuredArea: blueTeam.build.length * blueTeam.build.width,
        measuredVolume: blueTeam.build.length * blueTeam.build.width * blueTeam.build.height,
        targetDescription: activeChallenge.target.description,
        isCorrect: blueEval.isValid,
        statusMessage: blueEval.isValid ? 'BUILD APPROVED' : 'NOT THERE YET',
        diffMessage: blueEval.diffMessage,
        formula: blueEval.formula,
        scoreBreakdown: blueBreakdown,
        timestamp: Date.now(),
      };

      // Evaluate Red Team
      const redEval = validateChallengeSolution(activeChallenge, redTeam.build);
      const redBreakdown: ScoreBreakdown = {
        base: redEval.isValid ? activeChallenge.basePoints : 0,
        speed: redEval.isValid ? speedBonus : 0,
        precision: redEval.isValid ? 30 : 0,
        efficiency: redEval.isValid ? 20 : 0,
        total: redEval.isValid ? activeChallenge.basePoints + speedBonus + 30 + 20 : 0,
      };

      const redScanResult: ScanResult = {
        teamId: 'red',
        measuredLength: redTeam.build.length,
        measuredWidth: redTeam.build.width,
        measuredHeight: redTeam.build.height,
        measuredArea: redTeam.build.length * redTeam.build.width,
        measuredVolume: redTeam.build.length * redTeam.build.width * redTeam.build.height,
        targetDescription: activeChallenge.target.description,
        isCorrect: redEval.isValid,
        statusMessage: redEval.isValid ? 'BUILD APPROVED' : 'NOT THERE YET',
        diffMessage: redEval.diffMessage,
        formula: redEval.formula,
        scoreBreakdown: redBreakdown,
        timestamp: Date.now(),
      };

      // Play audio feedback
      if (blueEval.isValid || redEval.isValid) {
        blueprintAudio.playBuildApproved();
      } else {
        blueprintAudio.playBuildMismatch();
      }

      set((prev) => ({
        phase: 'round-result',
        cameraFocus: 'overview',
        blueTeam: {
          ...prev.blueTeam,
          score: prev.blueTeam.score + blueBreakdown.total,
          roundScore: blueBreakdown.total,
          completedChallengesCount: prev.blueTeam.completedChallengesCount + (blueEval.isValid ? 1 : 0),
          scanResult: blueScanResult,
          hasSecondChance: !blueEval.isValid,
        },
        redTeam: {
          ...prev.redTeam,
          score: prev.redTeam.score + redBreakdown.total,
          roundScore: redBreakdown.total,
          completedChallengesCount: prev.redTeam.completedChallengesCount + (redEval.isValid ? 1 : 0),
          scanResult: redScanResult,
          hasSecondChance: !redEval.isValid,
        },
      }));
    }, 1800);
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
        cameraFocus: teamId === 'blue' ? 'blue' : 'red',
        [teamId === 'blue' ? 'blueTeam' : 'redTeam']: updatedTeam,
      };
    });
  },

  nextRound: () => {
    const { currentRound, maxRounds, usedChallengeIds, blueTeam, redTeam } = get();

    if (currentRound >= maxRounds) {
      // Game Over / Podium Phase
      blueprintAudio.playChampionshipVictory();
      const finalWinner: TeamId | 'tie' =
        blueTeam.score > redTeam.score
          ? 'blue'
          : redTeam.score > blueTeam.score
            ? 'red'
            : 'tie';

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
      blueTeam: {
        ...blueTeam,
        roundScore: 0,
        build: initialBlueBuild,
        scanResult: null,
        hasSecondChance: false,
      },
      redTeam: {
        ...redTeam,
        roundScore: 0,
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
