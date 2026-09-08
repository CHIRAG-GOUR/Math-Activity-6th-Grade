// ============================================================
// THE GREAT CARNIVAL OF CHANCE — Modular Zustand Game Store
// Enforces Strict Activity Isolation (Zero Cross-Activity Contamination),
// Independent Dual-Team Touch Handling, and Physical Machine Simulation
// ============================================================

import { create } from 'zustand';
import {
  ActivityId,
  ActivityPhase,
  AttractionMeta,
  ProbabilityBall,
  ProbabilityChallenge,
  TeamId,
  TeamState,
  TrialOutcome,
} from '../types';
import { ATTRACTIONS_META, CARNIVAL_CHALLENGES } from '../engine/probabilityData';
import { carnivalAudio } from '../audio/CarnivalAudioManager';

interface CarnivalState {
  // Activity Lifecycle & Isolation
  activeActivity: ActivityId;
  phase: ActivityPhase;
  activeChallenge: ProbabilityChallenge | null;
  challengeIndex: number;
  attractions: Record<ActivityId, AttractionMeta>;

  // Dual-Team Independent State (Simultaneous Touch)
  blueTeam: TeamState;
  redTeam: TeamState;

  // Active Physical Machine & Experiment State
  drawnOutcome: ProbabilityBall | null;
  batchTrialResults: TrialOutcome[];
  isMuted: boolean;

  // Actions
  openActivity: (id: ActivityId) => void;
  returnToHub: () => void;
  startPredicting: () => void;
  selectChoice: (team: TeamId, choiceId: string) => void;
  confirmPrediction: (team: TeamId) => void;
  triggerMachineOperate: () => void;
  runBatchTrials: (count: number) => void;
  nextChallengeOrComplete: () => void;
  toggleMute: () => void;
}

const initialTeam = (id: TeamId, name: string): TeamState => ({
  id,
  name,
  score: 0,
  goldTickets: 0,
  selectedChoiceId: null,
  isConfirmed: false,
  isCorrect: null,
  scoreGained: 0,
  streak: 0,
});

export const useCarnivalStore = create<CarnivalState>((set, get) => ({
  activeActivity: 'hub',
  phase: 'intro',
  activeChallenge: null,
  challengeIndex: 0,
  attractions: ATTRACTIONS_META,

  blueTeam: initialTeam('blue', 'TEAM BLUE'),
  redTeam: initialTeam('red', 'TEAM RED'),

  drawnOutcome: null,
  batchTrialResults: [],
  isMuted: false,

  openActivity: (id: ActivityId) => {
    if (id === 'hub') {
      get().returnToHub();
      return;
    }

    const challenges = CARNIVAL_CHALLENGES[id] || [];
    const firstChallenge = challenges[0] || null;

    carnivalAudio.startBGM();
    carnivalAudio.playBagOpen();

    set((state) => ({
      activeActivity: id,
      phase: 'intro',
      activeChallenge: firstChallenge,
      challengeIndex: 0,
      drawnOutcome: null,
      batchTrialResults: [],
      blueTeam: {
        ...state.blueTeam,
        selectedChoiceId: null,
        isConfirmed: false,
        isCorrect: null,
        scoreGained: 0,
      },
      redTeam: {
        ...state.redTeam,
        selectedChoiceId: null,
        isConfirmed: false,
        isCorrect: null,
        scoreGained: 0,
      },
    }));
  },

  returnToHub: () => {
    carnivalAudio.playBellChime();
    set({
      activeActivity: 'hub',
      phase: 'intro',
      activeChallenge: null,
      drawnOutcome: null,
      batchTrialResults: [],
    });
  },

  startPredicting: () => {
    set({ phase: 'predicting' });
  },

  selectChoice: (team: TeamId, choiceId: string) => {
    const { phase } = get();
    if (phase !== 'predicting') return;

    carnivalAudio.playWheelTick(1.2);

    set((s) => ({
      [team === 'blue' ? 'blueTeam' : 'redTeam']: {
        ...(team === 'blue' ? s.blueTeam : s.redTeam),
        selectedChoiceId: choiceId,
      },
    }));
  },

  confirmPrediction: (team: TeamId) => {
    const { activeChallenge, phase } = get();
    if (phase !== 'predicting' || !activeChallenge) return;

    const currentTeamState = team === 'blue' ? get().blueTeam : get().redTeam;
    if (!currentTeamState.selectedChoiceId) return;

    const isCorrect = currentTeamState.selectedChoiceId === activeChallenge.correctAnswerId;
    const pointsToAdd = isCorrect ? activeChallenge.points : 0;
    const ticketsToAdd = isCorrect ? activeChallenge.goldTickets : 0;

    if (isCorrect) {
      carnivalAudio.playCorrect();
      carnivalAudio.playScoreTick();
    } else {
      carnivalAudio.playIncorrect();
    }

    set((s) => ({
      [team === 'blue' ? 'blueTeam' : 'redTeam']: {
        ...(team === 'blue' ? s.blueTeam : s.redTeam),
        isConfirmed: true,
        isCorrect,
        score: (team === 'blue' ? s.blueTeam.score : s.redTeam.score) + pointsToAdd,
        goldTickets: (team === 'blue' ? s.blueTeam.goldTickets : s.redTeam.goldTickets) + ticketsToAdd,
        scoreGained: pointsToAdd,
        streak: isCorrect ? (team === 'blue' ? s.blueTeam.streak : s.redTeam.streak) + 1 : 0,
      },
    }));

    // Check if at least one team has confirmed, automatically advance to physical machine operation
    setTimeout(() => {
      get().triggerMachineOperate();
    }, 600);
  },

  triggerMachineOperate: () => {
    const { activeChallenge, activeActivity } = get();
    if (!activeChallenge) return;

    set({ phase: 'operating' });

    // Generate genuinely random outcome from the challenge setup items
    const { items, totalItems } = activeChallenge.setup;
    const pool: { color: string; colorName: string }[] = [];
    items.forEach((it) => {
      for (let i = 0; i < it.count; i++) {
        pool.push({ color: it.color, colorName: it.colorName });
      }
    });

    const chosen = pool[Math.floor(Math.random() * pool.length)] || {
      color: items[0]?.color || '#dc2626',
      colorName: items[0]?.colorName || 'Red',
    };

    const ball: ProbabilityBall = {
      id: `ball-${Date.now()}`,
      color: chosen.color,
      colorName: chosen.colorName,
    };

    // Play activity specific sound sequence
    if (activeActivity === 'mystery-bag') {
      carnivalAudio.playBagOpen();
      setTimeout(() => carnivalAudio.playBallRoll(), 800);
      setTimeout(() => carnivalAudio.playTrayImpact(), 1800);
    } else if (activeActivity === 'odds-wheel') {
      carnivalAudio.playWheelTick(2.0);
      setTimeout(() => carnivalAudio.playWheelTick(1.0), 1000);
      setTimeout(() => carnivalAudio.playBellChime(), 2200);
    } else if (activeActivity === 'ball-drop') {
      carnivalAudio.playBallDropPing(1.2);
      setTimeout(() => carnivalAudio.playBallDropPing(0.9), 600);
      setTimeout(() => carnivalAudio.playTrayImpact(), 1600);
    }

    setTimeout(() => {
      set({
        drawnOutcome: ball,
        phase: 'observation',
      });
    }, 2200);
  },

  runBatchTrials: (count: number) => {
    const { activeChallenge } = get();
    if (!activeChallenge) return;

    carnivalAudio.playScoreTick();

    const { items } = activeChallenge.setup;
    const pool: { color: string; colorName: string }[] = [];
    items.forEach((it) => {
      for (let i = 0; i < it.count; i++) {
        pool.push({ color: it.color, colorName: it.colorName });
      }
    });

    const results: TrialOutcome[] = [];
    for (let i = 0; i < count; i++) {
      const chosen = pool[Math.floor(Math.random() * pool.length)];
      results.push({
        trialIndex: i + 1,
        outcomeColor: chosen.color,
        outcomeName: chosen.colorName,
      });
    }

    set({
      batchTrialResults: results,
      phase: 'batch-trials',
    });
  },

  nextChallengeOrComplete: () => {
    const { activeActivity, challengeIndex, attractions } = get();
    const challenges = CARNIVAL_CHALLENGES[activeActivity] || [];
    const nextIdx = challengeIndex + 1;

    if (nextIdx < challenges.length) {
      set((s) => ({
        challengeIndex: nextIdx,
        activeChallenge: challenges[nextIdx],
        phase: 'predicting',
        drawnOutcome: null,
        batchTrialResults: [],
        blueTeam: {
          ...s.blueTeam,
          selectedChoiceId: null,
          isConfirmed: false,
          isCorrect: null,
          scoreGained: 0,
        },
        redTeam: {
          ...s.redTeam,
          selectedChoiceId: null,
          isConfirmed: false,
          isCorrect: null,
          scoreGained: 0,
        },
      }));
    } else {
      // Activity completed! Mark attraction as completed and check Grand Carnival unlock
      const updatedAttractions = { ...attractions };
      if (updatedAttractions[activeActivity]) {
        updatedAttractions[activeActivity] = {
          ...updatedAttractions[activeActivity],
          completed: true,
        };
      }

      // Check if all core 5 activities are completed
      const allCoreDone = [
        'mystery-bag',
        'odds-wheel',
        'ball-drop',
        'probability-lab',
        'game-builder',
      ].every((act) => updatedAttractions[act as ActivityId]?.completed);

      if (allCoreDone && updatedAttractions['grand-carnival']) {
        updatedAttractions['grand-carnival'] = {
          ...updatedAttractions['grand-carnival'],
          unlocked: true,
        };
      }

      carnivalAudio.playCorrect();
      set({
        phase: 'completed',
        attractions: updatedAttractions,
      });
    }
  },

  toggleMute: () => {
    const next = !get().isMuted;
    carnivalAudio.setMuted(next);
    set({ isMuted: next });
  },
}));
