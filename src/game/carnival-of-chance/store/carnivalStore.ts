// ============================================================
// THE GREAT CARNIVAL OF CHANCE — Zustand Game Store
// Modular State Orchestration for Dual-Team Touchscreen Play
// ============================================================

import { create } from 'zustand';
import {
  AttractionId,
  AttractionInfo,
  CameraViewMode,
  CarnivalGamePhase,
  MachineAnimationState,
  ProbabilityChallenge,
  TeamId,
  TeamScoreState,
  TrialSimulationResult,
} from '../types';
import { ATTRACTIONS, CARNIVAL_CHALLENGES } from '../engine/probabilityData';
import { soundManager } from '@/utils/audio';

interface CarnivalStoreState {
  // Phase & Progression
  phase: CarnivalGamePhase;
  activeAttractionId: AttractionId | null;
  currentChallengeIndex: number;
  activeChallenge: ProbabilityChallenge | null;
  attractions: AttractionInfo[];

  // Two-Team Independent State (Simultaneous Touch)
  blueTeam: TeamScoreState;
  redTeam: TeamScoreState;

  // 3D Scene Controls
  cameraMode: CameraViewMode;
  machineAnimState: MachineAnimationState;
  zoomLevel: number;
  isMuted: boolean;

  // Physical Outcome & Real-time Experiment State
  latestRandomOutcome: string | null;
  trialResults: TrialSimulationResult | null;
  firstCorrectTeam: TeamId | null;

  // Actions
  setPhase: (phase: CarnivalGamePhase) => void;
  setTeamName: (team: TeamId, name: string) => void;
  startGame: () => void;
  selectAttraction: (id: AttractionId) => void;
  returnToIsland: () => void;
  startPredicting: () => void;
  submitTeamAnswer: (team: TeamId, answer: string | number) => void;
  runPhysicalExperiment: () => void;
  runBatchTrials: (trialCount: number) => void;
  nextChallenge: () => void;
  toggleMute: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
}

const initialTeam = (id: TeamId, defaultName: string): TeamScoreState => ({
  id,
  name: defaultName,
  score: 0,
  selectedAnswer: null,
  isLocked: false,
  lastResult: null,
  lastFeedback: null,
  correctCount: 0,
  streak: 0,
});

export const useCarnivalStore = create<CarnivalStoreState>((set, get) => ({
  phase: 'title',
  activeAttractionId: null,
  currentChallengeIndex: 0,
  activeChallenge: null,
  attractions: ATTRACTIONS,

  blueTeam: initialTeam('blue', 'TEAM BLUE'),
  redTeam: initialTeam('red', 'TEAM RED'),

  cameraMode: 'island-overview',
  machineAnimState: 'idle',
  zoomLevel: 1.0,
  isMuted: false,

  latestRandomOutcome: null,
  trialResults: null,
  firstCorrectTeam: null,

  setPhase: (phase) => set({ phase }),

  setTeamName: (team, name) =>
    set((s) => ({
      [team === 'blue' ? 'blueTeam' : 'redTeam']: {
        ...(team === 'blue' ? s.blueTeam : s.redTeam),
        name,
      },
    })),

  startGame: () => {
    soundManager.playClick();
    set({
      phase: 'island-explore',
      cameraMode: 'island-overview',
      machineAnimState: 'idle',
      activeAttractionId: null,
      activeChallenge: null,
      latestRandomOutcome: null,
      trialResults: null,
      blueTeam: initialTeam('blue', get().blueTeam.name),
      redTeam: initialTeam('red', get().redTeam.name),
    });
  },

  selectAttraction: (id) => {
    soundManager.playClick();
    const challenges = CARNIVAL_CHALLENGES[id] || [];
    const firstChallenge = challenges[0] || null;

    set((s) => ({
      activeAttractionId: id,
      currentChallengeIndex: 0,
      activeChallenge: firstChallenge,
      phase: 'attraction-intro',
      cameraMode: 'attraction-focus',
      machineAnimState: 'idle',
      latestRandomOutcome: null,
      trialResults: null,
      firstCorrectTeam: null,
      blueTeam: { ...s.blueTeam, selectedAnswer: null, isLocked: false, lastResult: null, lastFeedback: null },
      redTeam: { ...s.redTeam, selectedAnswer: null, isLocked: false, lastResult: null, lastFeedback: null },
    }));
  },

  returnToIsland: () => {
    soundManager.playClick();
    set({
      phase: 'island-explore',
      cameraMode: 'island-overview',
      machineAnimState: 'idle',
      activeAttractionId: null,
      activeChallenge: null,
      latestRandomOutcome: null,
      trialResults: null,
    });
  },

  startPredicting: () => {
    soundManager.playClick();
    set((s) => ({
      phase: 'predicting',
      blueTeam: { ...s.blueTeam, selectedAnswer: null, isLocked: false, lastResult: null, lastFeedback: null },
      redTeam: { ...s.redTeam, selectedAnswer: null, isLocked: false, lastResult: null, lastFeedback: null },
    }));
  },

  submitTeamAnswer: (team, answer) => {
    const { activeChallenge, blueTeam, redTeam, firstCorrectTeam } = get();
    if (!activeChallenge) return;

    soundManager.playClick();
    const isCorrect = String(answer) === String(activeChallenge.correctAnswer);
    const targetTeam = team === 'blue' ? blueTeam : redTeam;
    const otherTeam = team === 'blue' ? redTeam : blueTeam;

    if (targetTeam.isLocked) return;

    const pointsEarned = isCorrect
      ? activeChallenge.points + (targetTeam.streak * 10) + (!firstCorrectTeam ? 25 : 0)
      : 0;

    const updatedTarget: TeamScoreState = {
      ...targetTeam,
      selectedAnswer: answer,
      isLocked: true,
      lastResult: isCorrect ? 'correct' : 'wrong',
      lastFeedback: isCorrect ? `+${pointsEarned} PTS! Correct prediction.` : 'Not quite. Check the ratios!',
      score: targetTeam.score + pointsEarned,
      correctCount: targetTeam.correctCount + (isCorrect ? 1 : 0),
      streak: isCorrect ? targetTeam.streak + 1 : 0,
    };

    const newFirstCorrect = (!firstCorrectTeam && isCorrect) ? team : firstCorrectTeam;

    if (team === 'blue') {
      set({ blueTeam: updatedTarget, firstCorrectTeam: newFirstCorrect });
    } else {
      set({ redTeam: updatedTarget, firstCorrectTeam: newFirstCorrect });
    }

    if (isCorrect) {
      soundManager.playCorrect();
    } else {
      soundManager.playWrong();
    }

    // If both teams have locked in their answers, trigger physical experiment automatically after a short suspense
    setTimeout(() => {
      const current = get();
      if (current.blueTeam.isLocked && current.redTeam.isLocked && current.phase === 'predicting') {
        get().runPhysicalExperiment();
      }
    }, 450);
  },

  runPhysicalExperiment: () => {
    const { activeChallenge } = get();
    if (!activeChallenge) return;

    set({ phase: 'machine-running', machineAnimState: 'mixing', cameraMode: 'machine-run' });

    // Actual random outcome selection based on the challenge's physical item distribution
    const items = activeChallenge.probabilityData.items;
    const pool: string[] = [];
    items.forEach((item) => {
      for (let i = 0; i < item.count; i++) {
        pool.push(item.label);
      }
    });

    const chosenOutcome = pool.length > 0
      ? pool[Math.floor(Math.random() * pool.length)]
      : 'Outcome';

    // Simulate physical machine sequence
    setTimeout(() => {
      set({ machineAnimState: 'dropping' });
    }, 1200);

    setTimeout(() => {
      soundManager.playVaultCracked();
      set({
        machineAnimState: 'settled',
        latestRandomOutcome: chosenOutcome,
        phase: 'observation-reasoning',
      });
    }, 2800);
  },

  runBatchTrials: (trialCount) => {
    const { activeChallenge } = get();
    if (!activeChallenge) return;

    soundManager.playClick();
    set({ machineAnimState: 'batch-simulating' });

    const items = activeChallenge.probabilityData.items;
    const pool: string[] = [];
    items.forEach((item) => {
      for (let i = 0; i < item.count; i++) pool.push(item.label);
    });

    const tally: Record<string, number> = {};
    items.forEach((item) => {
      tally[item.label] = 0;
    });

    const history: string[] = [];
    for (let i = 0; i < trialCount; i++) {
      const pick = pool[Math.floor(Math.random() * pool.length)];
      tally[pick] = (tally[pick] || 0) + 1;
      history.push(pick);
    }

    setTimeout(() => {
      soundManager.playSignalChange();
      set({
        machineAnimState: 'settled',
        trialResults: {
          totalTrials: trialCount,
          tally,
          history,
          lastOutcome: history[history.length - 1],
        },
        phase: 'experiment-trials',
      });
    }, 800);
  },

  nextChallenge: () => {
    soundManager.playClick();
    const { activeAttractionId, currentChallengeIndex, attractions } = get();
    if (!activeAttractionId) return;

    const challenges = CARNIVAL_CHALLENGES[activeAttractionId] || [];
    const nextIdx = currentChallengeIndex + 1;

    if (nextIdx < challenges.length) {
      set((s) => ({
        currentChallengeIndex: nextIdx,
        activeChallenge: challenges[nextIdx],
        phase: 'predicting',
        machineAnimState: 'idle',
        latestRandomOutcome: null,
        trialResults: null,
        firstCorrectTeam: null,
        blueTeam: { ...s.blueTeam, selectedAnswer: null, isLocked: false, lastResult: null, lastFeedback: null },
        redTeam: { ...s.redTeam, selectedAnswer: null, isLocked: false, lastResult: null, lastFeedback: null },
      }));
    } else {
      // Completed all challenges in this attraction!
      const updatedAttractions = attractions.map((attr) =>
        attr.id === activeAttractionId
          ? { ...attr, completed: true, completedChallenges: challenges.length }
          : attr
      );

      // Check if all primary attractions are completed to unlock Grand Carnival
      const completedCount = updatedAttractions.filter((a) => a.id !== 'grand-carnival' && a.id !== 'central-plaza' && a.completed).length;
      const shouldUnlockGrand = completedCount >= 4;

      const finalAttractions = updatedAttractions.map((attr) =>
        attr.id === 'grand-carnival' ? { ...attr, unlocked: shouldUnlockGrand } : attr
      );

      soundManager.playRailwayVictory();

      if (activeAttractionId === 'grand-carnival') {
        set({
          attractions: finalAttractions,
          phase: 'grand-celebration',
          cameraMode: 'grand-celebration',
        });
      } else {
        set({
          attractions: finalAttractions,
          phase: 'attraction-summary',
          cameraMode: 'attraction-focus',
        });
      }
    }
  },

  toggleMute: () => {
    const isMuted = soundManager.toggleMute();
    set({ isMuted });
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
}));
