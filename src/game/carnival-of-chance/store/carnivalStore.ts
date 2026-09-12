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
import { initialBoostManager } from '@/utils/initialBoost';
import { TeamPowerUps, initialTeamPowerUps } from '@/types/powerUps';
import { getMisconceptionHint } from '@/utils/misconceptions';

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

  // Tactical Power-ups & Misconceptions (1 per match per team)
  bluePowerUps: TeamPowerUps;
  redPowerUps: TeamPowerUps;
  blueMisconception: string | null;
  redMisconception: string | null;
  blueEliminatedChoices: string[];
  redEliminatedChoices: string[];
  isTieBreak: boolean;

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

  // Question Configuration (5, 10, 15, 20)
  questionCountConfig: 5 | 10 | 15 | 20;
  setQuestionCount: (count: 5 | 10 | 15 | 20) => void;

  // Actions
  openActivity: (id: ActivityId) => void;
  returnToHub: () => void;
  startPredicting: () => void;
  selectChoice: (team: TeamId, choiceId: string) => void;
  confirmPrediction: (team: TeamId) => void;
  triggerMachineOperate: () => void;
  runBatchTrials: (count: number) => void;
  nextChallengeOrComplete: () => void;
  startTieBreak: () => void;
  restartCurrentActivity: () => void;
  toggleMute: () => void;
  tickTimer: () => void;

  // Tactical Power-up Actions
  usePowerUp5050: (team: TeamId) => void;
  usePowerUpTimeFreeze: (team: TeamId) => void;
  usePowerUp2x: (team: TeamId) => void;
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

  bluePowerUps: initialTeamPowerUps(),
  redPowerUps: initialTeamPowerUps(),
  blueMisconception: null,
  redMisconception: null,
  blueEliminatedChoices: [],
  redEliminatedChoices: [],
  isTieBreak: false,

  activityWinner: null,
  toastMessage: null,

  drawnOutcome: null,
  batchTrialResults: [],
  isMuted: false,

  timeRemaining: 50,
  timerActive: false,

  questionCountConfig: 5,
  setQuestionCount: (count: 5 | 10 | 15 | 20) => set({ questionCountConfig: count }),

  openActivity: (id: ActivityId) => {
    if (id === 'hub') {
      get().returnToHub();
      return;
    }

    const allChallenges = CARNIVAL_CHALLENGES[id] || [];
    const count = get().questionCountConfig;
    const challenges = allChallenges.slice(0, count);
    const firstChallenge = challenges[0] || null;

    carnivalAudio.startBGM();
    carnivalAudio.playBagOpen();

    // Check Initial Boost from previous game winner
    const boost = initialBoostManager.getBoost();
    const isBlueBoosted = boost?.winnerId === 'blue';
    const isRedBoosted = boost?.winnerId === 'red';

    let boostToast: string | null = null;
    if (boost) {
      const winnerName = boost.winnerId === 'blue' ? get().blueTeam.name : get().redTeam.name;
      boostToast = `⚡ INITIAL BOOST: ${winnerName} starts with +1 Correct Answer & 1 Gold Ticket in the bag from winning ${boost.gameTitle}!`;
    }

    set((state) => ({
      activeActivity: id,
      phase: 'predicting',
      activeChallenge: firstChallenge,
      challengeIndex: 0,
      totalChallengesInActivity: challenges.length,
      activityWinner: null,
      toastMessage: boostToast,
      drawnOutcome: null,
      batchTrialResults: [],
      timeRemaining: 50,
      timerActive: true,
      bluePowerUps: initialTeamPowerUps(),
      redPowerUps: initialTeamPowerUps(),
      blueMisconception: null,
      redMisconception: null,
      blueEliminatedChoices: [],
      redEliminatedChoices: [],
      isTieBreak: false,
      blueTeam: {
        ...state.blueTeam,
        activityScore: isBlueBoosted ? 100 : 0,
        goldTickets: isBlueBoosted ? state.blueTeam.goldTickets + 1 : state.blueTeam.goldTickets,
        selectedChoiceId: null,
        isConfirmed: false,
        isLocked: false,
        isCorrect: null,
        lastResult: null,
        scoreGained: isBlueBoosted ? 100 : 0,
        correctAnswersCount: isBlueBoosted ? 1 : 0,
        attemptsLeft: 2,
      },
      redTeam: {
        ...state.redTeam,
        activityScore: isRedBoosted ? 100 : 0,
        goldTickets: isRedBoosted ? state.redTeam.goldTickets + 1 : state.redTeam.goldTickets,
        selectedChoiceId: null,
        isConfirmed: false,
        isLocked: false,
        isCorrect: null,
        lastResult: null,
        scoreGained: isRedBoosted ? 100 : 0,
        correctAnswersCount: isRedBoosted ? 1 : 0,
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
      isTieBreak: false,
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
    const { phase, blueTeam, redTeam, blueEliminatedChoices, redEliminatedChoices } = get();
    if (phase !== 'predicting') return;

    const teamState = team === 'blue' ? blueTeam : redTeam;
    const eliminated = team === 'blue' ? blueEliminatedChoices : redEliminatedChoices;
    if (teamState.isLocked || eliminated.includes(choiceId)) return;

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
    const { activeChallenge, phase, blueTeam, redTeam, timeRemaining, isTieBreak, bluePowerUps, redPowerUps } = get();
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
      let pointsToAdd = (isTieBreak ? 200 : activeChallenge.points) + timeBonus;

      // Apply Comeback Surge (+25%) if trailing by 2+ tickets or 150+ pts
      const isBlue = team === 'blue';
      const isComeback = isBlue
        ? (otherTeamState.goldTickets - teamState.goldTickets >= 2 || otherTeamState.activityScore - teamState.activityScore >= 150)
        : (otherTeamState.goldTickets - teamState.goldTickets >= 2 || otherTeamState.activityScore - teamState.activityScore >= 150);
      if (isComeback) {
        pointsToAdd = Math.round(pointsToAdd * 1.25);
      }

      // Apply 2x Multiplier power-up if armed
      const teamPower = isBlue ? bluePowerUps : redPowerUps;
      if (teamPower.active2x) {
        pointsToAdd = pointsToAdd * 2;
      }

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
        toastMessage: `🎉 ${s[key].name} ANSWERED FIRST & CORRECT! (+${pointsToAdd} PTS)${isComeback ? ' 🔥 COMEBACK SURGE!' : ''}${teamPower.active2x ? ' 💥 2X MULTIPLIER!' : ''}`,
        timerActive: false,
      }));

      if (isTieBreak) {
        // Sudden death resolved instantly!
        setTimeout(() => {
          let updatedBlue = { ...get().blueTeam };
          let updatedRed = { ...get().redTeam };
          if (team === 'blue') {
            updatedBlue.goldTickets += 2;
            initialBoostManager.recordWinner('blue', updatedBlue.name, 'Carnival of Chance');
          } else {
            updatedRed.goldTickets += 2;
            initialBoostManager.recordWinner('red', updatedRed.name, 'Carnival of Chance');
          }
          set({
            phase: 'completed',
            activityWinner: team,
            blueTeam: updatedBlue,
            redTeam: updatedRed,
            timerActive: false,
            isTieBreak: false,
          });
        }, 1200);
        return;
      }

      setTimeout(() => {
        get().triggerMachineOperate();
      }, 700);

    } else {
      // ── WRONG ANSWER: CHECK ATTEMPTS REMAINING (2 ATTEMPTS PER TEAM) ──
      carnivalAudio.playIncorrect();

      const isBlue = team === 'blue';
      if (teamState.attemptsLeft > 1) {
        // 1st Mistake: Give 2nd Chance Retry with targeted misconception hint!
        const hint = getMisconceptionHint('probability', activeChallenge.prompt);
        set((s) => ({
          [key]: {
            ...s[key],
            attemptsLeft: 1,
            selectedChoiceId: null,
            isConfirmed: false,
            isLocked: false,
          },
          [isBlue ? 'blueMisconception' : 'redMisconception']: hint,
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

  // ── Tactical Power-ups ──
  usePowerUp5050: (team) => {
    const state = get();
    const ch = state.activeChallenge;
    if (!ch || state.phase !== 'predicting') return;
    const isBlue = team === 'blue';
    const powerUps = isBlue ? state.bluePowerUps : state.redPowerUps;
    if (!powerUps.fiftyFifty) return;

    // Eliminate up to 2 incorrect choices
    const wrongChoices = ch.choices
      .filter((c) => c.id !== ch.correctAnswerId)
      .map((c) => c.id);
    const toEliminate = wrongChoices.slice(0, 2);

    carnivalAudio.playScoreTick();
    set((s) => ({
      [isBlue ? 'bluePowerUps' : 'redPowerUps']: {
        ...powerUps,
        fiftyFifty: false,
      },
      [isBlue ? 'blueEliminatedChoices' : 'redEliminatedChoices']: toEliminate,
      toastMessage: `🔍 50:50 ELIMINATOR ACTIVATED FOR ${s[isBlue ? 'blueTeam' : 'redTeam'].name}! 2 OPTIONS REMOVED!`,
    }));
  },

  usePowerUpTimeFreeze: (team) => {
    const state = get();
    if (state.phase !== 'predicting') return;
    const isBlue = team === 'blue';
    const powerUps = isBlue ? state.bluePowerUps : state.redPowerUps;
    if (!powerUps.timeFreeze) return;

    carnivalAudio.playScoreTick();
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
    if (state.phase !== 'predicting') return;
    const isBlue = team === 'blue';
    const powerUps = isBlue ? state.bluePowerUps : state.redPowerUps;
    if (!powerUps.doublePoints) return;

    carnivalAudio.playScoreTick();
    set((s) => ({
      [isBlue ? 'bluePowerUps' : 'redPowerUps']: {
        ...powerUps,
        doublePoints: false,
        active2x: true,
      },
      toastMessage: `💥 2X MULTIPLIER ARMED FOR ${s[isBlue ? 'blueTeam' : 'redTeam'].name}! DOUBLE POINTS ON NEXT WIN!`,
    }));
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

    // Play activity specific sound sequence for static activities
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

  startTieBreak: () => {
    const { activeActivity } = get();
    const allChallenges = CARNIVAL_CHALLENGES[activeActivity] || CARNIVAL_CHALLENGES['odds-wheel'] || [];
    const tb = allChallenges[allChallenges.length - 1] || allChallenges[0];

    carnivalAudio.playBellChime();
    set((s) => ({
      phase: 'predicting',
      isTieBreak: true,
      activeChallenge: {
        ...tb,
        missionTitle: '⚡ SUDDEN DEATH SPEED DUEL',
        prompt: `⚡ [TIE-BREAKER 15s] ` + tb.prompt,
      },
      timeRemaining: 15, // 15-second rapid speed duel
      timerActive: true,
      toastMessage: '⚡ SCORES TIED! 15s SUDDEN-DEATH SPEED DUEL! FIRST CORRECT PREDICTION WINS!',
      bluePowerUps: { ...s.bluePowerUps, active2x: false },
      redPowerUps: { ...s.redPowerUps, active2x: false },
      blueMisconception: null,
      redMisconception: null,
      blueEliminatedChoices: [],
      redEliminatedChoices: [],
      blueTeam: {
        ...s.blueTeam,
        selectedChoiceId: null,
        isConfirmed: false,
        isLocked: false,
        isCorrect: null,
        lastResult: null,
        attemptsLeft: 2,
      },
      redTeam: {
        ...s.redTeam,
        selectedChoiceId: null,
        isConfirmed: false,
        isLocked: false,
        isCorrect: null,
        lastResult: null,
        attemptsLeft: 2,
      },
    }));
  },

  nextChallengeOrComplete: () => {
    const { activeActivity, challengeIndex, attractions, blueTeam, redTeam, questionCountConfig } = get();
    const allChallenges = CARNIVAL_CHALLENGES[activeActivity] || [];
    const challenges = allChallenges.slice(0, questionCountConfig);
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
        bluePowerUps: { ...s.bluePowerUps, active2x: false },
        redPowerUps: { ...s.redPowerUps, active2x: false },
        blueMisconception: null,
        redMisconception: null,
        blueEliminatedChoices: [],
        redEliminatedChoices: [],
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
      // Check if scores are tied → trigger sudden death tiebreaker!
      if (blueTeam.activityScore === redTeam.activityScore) {
        get().startTieBreak();
        return;
      }

      // ═══════════════════════════════════════════════════════════════
      // ATTRACTION COMPLETED: DECIDE WINNER & RECORD INITIAL BOOST
      // ═══════════════════════════════════════════════════════════════
      let winner: TeamId | 'tie' = 'tie';
      let updatedBlue = { ...blueTeam };
      let updatedRed = { ...redTeam };

      if (blueTeam.activityScore > redTeam.activityScore) {
        winner = 'blue';
        updatedBlue.goldTickets += 2;
        initialBoostManager.recordWinner('blue', blueTeam.name, 'Carnival of Chance');
      } else if (redTeam.activityScore > blueTeam.activityScore) {
        winner = 'red';
        updatedRed.goldTickets += 2;
        initialBoostManager.recordWinner('red', redTeam.name, 'Carnival of Chance');
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
        isTieBreak: false,
      });
    }
  },

  toggleMute: () => {
    const next = !get().isMuted;
    carnivalAudio.setMuted(next);
    set({ isMuted: next });
  },
}));
