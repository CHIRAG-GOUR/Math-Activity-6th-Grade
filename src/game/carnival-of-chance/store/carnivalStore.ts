// ============================================================
// THE GREAT CARNIVAL OF CHANCE — Modular Zustand Game Store
// First-Answerer & Rebound Competitive Rule:
// - Whoever answers first wins the round if correct (in GREEN)
// - If wrong (in RED), the 2nd team gets a Rebound chance to answer and steal!
// - 5 Questions per Attraction -> Decide Attraction Winner!
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
  totalChallengesInActivity: number;
  attractions: Record<ActivityId, AttractionMeta>;

  // Dual-Team Independent State (Simultaneous Touch)
  blueTeam: TeamState;
  redTeam: TeamState;

  // Rebound & Activity Winner State
  activityWinner: TeamId | 'tie' | null;
  toastMessage: string | null;

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
  restartCurrentActivity: () => void;
  toggleMute: () => void;
}

const initialTeam = (id: TeamId, name: string): TeamState => ({
  id,
  name,
  score: 0,
  activityScore: 0,
  goldTickets: 0,
  selectedChoiceId: null,
  isConfirmed: false,
  isLocked: false,
  isCorrect: null,
  lastResult: null,
  scoreGained: 0,
  streak: 0,
  correctAnswersCount: 0,
});

export const useCarnivalStore = create<CarnivalState>((set, get) => ({
  activeActivity: 'hub',
  phase: 'intro',
  activeChallenge: null,
  challengeIndex: 0,
  totalChallengesInActivity: 5,
  attractions: ATTRACTIONS_META,

  blueTeam: initialTeam('blue', 'TEAM BLUE'),
  redTeam: initialTeam('red', 'TEAM RED'),

  activityWinner: null,
  toastMessage: null,

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
      phase: 'predicting',
      activeChallenge: firstChallenge,
      challengeIndex: 0,
      totalChallengesInActivity: challenges.length,
      activityWinner: null,
      toastMessage: null,
      drawnOutcome: null,
      batchTrialResults: [],
      blueTeam: {
        ...state.blueTeam,
        activityScore: 0,
        selectedChoiceId: null,
        isConfirmed: false,
        isLocked: false,
        isCorrect: null,
        lastResult: null,
        scoreGained: 0,
        correctAnswersCount: 0,
      },
      redTeam: {
        ...state.redTeam,
        activityScore: 0,
        selectedChoiceId: null,
        isConfirmed: false,
        isLocked: false,
        isCorrect: null,
        lastResult: null,
        scoreGained: 0,
        correctAnswersCount: 0,
      },
    }));
  },

  returnToHub: () => {
    carnivalAudio.playBellChime();
    set({
      activeActivity: 'hub',
      phase: 'intro',
      activeChallenge: null,
      activityWinner: null,
      drawnOutcome: null,
      batchTrialResults: [],
    });
  },

  restartCurrentActivity: () => {
    const { activeActivity } = get();
    if (activeActivity === 'hub') return;
    get().openActivity(activeActivity);
  },

  startPredicting: () => {
    set({ phase: 'predicting' });
  },

  selectChoice: (team: TeamId, choiceId: string) => {
    const { phase, blueTeam, redTeam } = get();
    if (phase !== 'predicting') return;

    const teamState = team === 'blue' ? blueTeam : redTeam;
    if (teamState.isLocked) return;

    carnivalAudio.playWheelTick(1.2);

    set((s) => ({
      [team === 'blue' ? 'blueTeam' : 'redTeam']: {
        ...(team === 'blue' ? s.blueTeam : s.redTeam),
        selectedChoiceId: choiceId,
      },
    }));
  },

  // ── First-Answerer & Rebound Engine ──
  confirmPrediction: (team: TeamId) => {
    const { activeChallenge, phase, blueTeam, redTeam } = get();
    if (phase !== 'predicting' || !activeChallenge) return;

    const key = team === 'blue' ? 'blueTeam' : 'redTeam';
    const otherKey = team === 'blue' ? 'redTeam' : 'blueTeam';
    const teamState = get()[key];
    const otherTeamState = get()[otherKey];

    if (teamState.isLocked || !teamState.selectedChoiceId) return;

    const isCorrect = teamState.selectedChoiceId === activeChallenge.correctAnswerId;

    if (isCorrect) {
      // ── WINNING FIRST ANSWER: LOCK IN POINTS & RUN MACHINE ──
      carnivalAudio.playCorrect();
      carnivalAudio.playScoreTick();

      const pointsToAdd = activeChallenge.points;
      const ticketsToAdd = activeChallenge.goldTickets;
      const newStreak = teamState.streak + 1;

      set((s) => ({
        [key]: {
          ...s[key],
          isConfirmed: true,
          isLocked: true,
          isCorrect: true,
          lastResult: 'correct',
          score: s[key].score + pointsToAdd,
          activityScore: s[key].activityScore + pointsToAdd,
          goldTickets: s[key].goldTickets + ticketsToAdd,
          scoreGained: pointsToAdd,
          streak: newStreak,
          correctAnswersCount: s[key].correctAnswersCount + 1,
        },
        [otherKey]: {
          ...s[otherKey],
          isLocked: true, // Question claimed by the first correct answerer!
        },
        toastMessage: `🎉 ${s[key].name} ANSWERED FIRST & CORRECT! (+${pointsToAdd} PTS)`,
      }));

      setTimeout(() => {
        get().triggerMachineOperate();
      }, 700);

    } else {
      // ── WRONG ANSWER: LOCK OUT THIS TEAM & GIVE 2ND TEAM REBOUND ──
      carnivalAudio.playIncorrect();

      set((s) => ({
        [key]: {
          ...s[key],
          isConfirmed: true,
          isLocked: true,
          isCorrect: false,
          lastResult: 'wrong',
          scoreGained: 0,
          streak: 0,
        },
        toastMessage: `❌ ${s[key].name} INCORRECT! ${s[otherKey].name} CAN REBOUND!`,
      }));

      // If the other team was ALREADY locked out (both answered wrongly), end question!
      if (otherTeamState.isLocked) {
        setTimeout(() => {
          get().triggerMachineOperate();
        }, 700);
      }
    }
  },

  triggerMachineOperate: () => {
    const { activeChallenge, activeActivity } = get();
    if (!activeChallenge) return;

    set({ phase: 'operating' });

    // Generate genuinely random outcome from the challenge setup items
    const { items } = activeChallenge.setup;
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
    }, 2000);
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
    const { activeActivity, challengeIndex, attractions, blueTeam, redTeam } = get();
    const challenges = CARNIVAL_CHALLENGES[activeActivity] || [];
    const nextIdx = challengeIndex + 1;

    if (nextIdx < challenges.length) {
      set((s) => ({
        challengeIndex: nextIdx,
        activeChallenge: challenges[nextIdx],
        phase: 'predicting',
        toastMessage: null,
        drawnOutcome: null,
        batchTrialResults: [],
        blueTeam: {
          ...s.blueTeam,
          selectedChoiceId: null,
          isConfirmed: false,
          isLocked: false,
          isCorrect: null,
          lastResult: null,
          scoreGained: 0,
        },
        redTeam: {
          ...s.redTeam,
          selectedChoiceId: null,
          isConfirmed: false,
          isLocked: false,
          isCorrect: null,
          lastResult: null,
          scoreGained: 0,
        },
      }));
    } else {
      // ═══════════════════════════════════════════════════════════════
      // 5 QUESTIONS FINISHED: DECIDE ATTRACTION WINNER!
      // ═══════════════════════════════════════════════════════════════
      let winner: TeamId | 'tie' = 'tie';
      let updatedBlue = { ...blueTeam };
      let updatedRed = { ...redTeam };

      if (blueTeam.activityScore > redTeam.activityScore) {
        winner = 'blue';
        updatedBlue.goldTickets += 2;
      } else if (redTeam.activityScore > blueTeam.activityScore) {
        winner = 'red';
        updatedRed.goldTickets += 2;
      } else {
        winner = 'tie';
        updatedBlue.goldTickets += 1;
        updatedRed.goldTickets += 1;
      }

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

      carnivalAudio.playBellChime();
      set({
        phase: 'completed',
        activityWinner: winner,
        blueTeam: updatedBlue,
        redTeam: updatedRed,
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
