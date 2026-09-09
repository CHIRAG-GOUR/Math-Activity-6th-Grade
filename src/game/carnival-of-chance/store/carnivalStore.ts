// ============================================================
// THE GREAT CARNIVAL OF CHANCE — Modular Zustand Game Store
// Dynamic Competitive Rules:
// - 2 Attempts per Team per Question (1st mistake allows a 2nd chance retry!)
// - Rebound & Steal Opportunities
// - Integrated Countdown Timer (30s per Question)
// - Synchronized Multi-Stage Machine Operations & Audio
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

  // Round Countdown Timer
  timeRemaining: number;
  timerActive: boolean;

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
  tickTimer: () => void;
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
  attemptsLeft: 2,
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

  timeRemaining: 50,
  timerActive: false,

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
      timeRemaining: 50,
      timerActive: true,
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
        attemptsLeft: 2,
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
        attemptsLeft: 2,
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
      timerActive: false,
    });
  },

  restartCurrentActivity: () => {
    const { activeActivity } = get();
    if (activeActivity === 'hub') return;
    get().openActivity(activeActivity);
  },

  startPredicting: () => {
    set({ phase: 'predicting', timeRemaining: 50, timerActive: true });
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

  // ── Dual-Turn & Rebound Engine (2 Attempts per Team) ──
  confirmPrediction: (team: TeamId) => {
    const { activeChallenge, phase, blueTeam, redTeam, timeRemaining } = get();
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

      const timeBonus = Math.floor(timeRemaining * 1.5);
      const pointsToAdd = activeChallenge.points + timeBonus;
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
        timerActive: false,
      }));

      setTimeout(() => {
        get().triggerMachineOperate();
      }, 700);

    } else {
      // ── WRONG ANSWER: CHECK ATTEMPTS REMAINING (2 ATTEMPTS PER TEAM) ──
      carnivalAudio.playIncorrect();

      if (teamState.attemptsLeft > 1) {
        // 1st Mistake: Give 2nd Chance Retry!
        set((s) => ({
          [key]: {
            ...s[key],
            attemptsLeft: 1,
            selectedChoiceId: null,
            isConfirmed: false,
            isLocked: false,
          },
          toastMessage: `⚠️ ${s[key].name} INCORRECT — 1 CHANCE REMAINING!`,
        }));
      } else {
        // 2nd Mistake: Full Lockout & Rebound Opportunity for other team!
        set((s) => ({
          [key]: {
            ...s[key],
            attemptsLeft: 0,
            isConfirmed: true,
            isLocked: true,
            isCorrect: false,
            lastResult: 'wrong',
            scoreGained: 0,
            streak: 0,
          },
          toastMessage: `❌ ${s[key].name} LOCKED OUT! ${s[otherKey].name} CAN REBOUND!`,
        }));

        // If the other team was ALREADY locked out (both exhausted turns), end question!
        if (otherTeamState.isLocked) {
          set({ timerActive: false });
          setTimeout(() => {
            get().triggerMachineOperate();
          }, 700);
        }
      }
    }
  },

  triggerMachineOperate: () => {
    const { activeChallenge, activeActivity } = get();
    if (!activeChallenge) return;

    set({ phase: 'operating', timerActive: false });

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

    // Play activity specific sound sequence for static activities (3D machines handle frame-synced audio)
    if (activeActivity === 'mystery-bag') {
      carnivalAudio.playBagOpen();
      setTimeout(() => carnivalAudio.playBallRoll(), 700);
      setTimeout(() => carnivalAudio.playTrayImpact(), 1600);
    } else if (activeActivity === 'odds-wheel') {
      carnivalAudio.playWheelTick(2.2);
      setTimeout(() => carnivalAudio.playWheelTick(1.4), 700);
      setTimeout(() => carnivalAudio.playWheelTick(0.8), 1400);
      setTimeout(() => carnivalAudio.playBellChime(), 2100);
    } else if (activeActivity === 'probability-lab') {
      carnivalAudio.playLabReaction();
      setTimeout(() => carnivalAudio.playScoreTick(), 1200);
    }

    setTimeout(() => {
      set({
        drawnOutcome: ball,
        phase: 'observation',
      });
    }, 2600);
  },

  tickTimer: () => {
    const { phase, timeRemaining, timerActive } = get();
    if (phase !== 'predicting' || !timerActive) return;

    if (timeRemaining <= 1) {
      carnivalAudio.playIncorrect();
      set({ timeRemaining: 0, timerActive: false });
      get().triggerMachineOperate();
    } else {
      set({ timeRemaining: timeRemaining - 1 });
    }
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
        timeRemaining: 50,
        timerActive: true,
        blueTeam: {
          ...s.blueTeam,
          selectedChoiceId: null,
          isConfirmed: false,
          isLocked: false,
          isCorrect: null,
          lastResult: null,
          scoreGained: 0,
          attemptsLeft: 2,
        },
        redTeam: {
          ...s.redTeam,
          selectedChoiceId: null,
          isConfirmed: false,
          isLocked: false,
          isCorrect: null,
          lastResult: null,
          scoreGained: 0,
          attemptsLeft: 2,
        },
      }));
    } else {
      // ═══════════════════════════════════════════════════════════════
      // ATTRACTION COMPLETED: DECIDE WINNER
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

      carnivalAudio.playBellChime();
      set({
        phase: 'completed',
        activityWinner: winner,
        blueTeam: updatedBlue,
        redTeam: updatedRed,
        attractions: updatedAttractions,
        timerActive: false,
      });
    }
  },

  toggleMute: () => {
    const next = !get().isMuted;
    carnivalAudio.setMuted(next);
    set({ isMuted: next });
  },
}));
