// ============================================================
// THE GREAT NUMBER RAILWAY — Zustand Game Store
// Robust Competitive Progression Logic (Activity #1 Model):
// - Symmetrical team evaluation with speed bonuses & streaks
// - 5-Stage Station Loading & High-Graphics Journey
// - Round Reveal feedback phase
// - Super Tie-Breaker Challenge for tied scores
// - Winner / Loser / Draw Game Over state
// ============================================================

import { create } from 'zustand';
import {
  RailwayGameState,
  TeamState,
  TeamId,
  TrainAnimState,
  GamePhase,
  LoadedTrainItems,
} from '../types';
import {
  RAILWAY_CHALLENGES,
  STATIONS_LIST,
  SUPER_TIE_BREAKER_CHALLENGE,
} from '../engine/challenges';
import { soundManager } from '@/utils/audio';

const createTeamState = (id: TeamId): TeamState => ({
  id,
  name: id === 'blue' ? 'BLUE ENGINEERS' : 'RED ENGINEERS',
  score: 0,
  streak: 0,
  correctAnswersCount: 0,
  selectedAnswer: null,
  isLocked: false,
  lastResult: null,
  lastScoreGained: 0,
  lastFeedback: null,
  attemptsOnCurrent: 0,
});

const DEFAULT_LOADED_ITEMS: LoadedTrainItems = {
  vehicles: false,
  materials: false,
  passengers: false,
  brakesLifted: false,
  signalGreen: false,
};

const DEFAULT_TRAIN_STATE: TrainAnimState = {
  position: [0, 0, 0],
  rotation: [0, 0, 0],
  progress: 0,
  speed: 0,
  state: 'idle',
  wheelRotation: 0,
  smokeActive: false,
  whistleActive: false,
};

interface RailwayStoreActions {
  setPhase: (phase: GamePhase) => void;
  startGame: () => void;

  setTeamAnswer: (team: TeamId, answer: number | string) => void;
  lockInTeam: (team: TeamId) => void;
  checkAndAdvanceRound: () => void;
  advanceToNextQuestion: () => void;

  startTrainJourneyToNextStation: () => void;
  setTrainProgress: (progress: number) => void;
  completeStationArrival: () => void;

  toggleMute: () => void;
  setTimeRemaining: (t: number) => void;
  setTimerActive: (active: boolean) => void;
  clearAnimationMessage: () => void;
  handleTimerExpired: () => void;
}

export type RailwayStore = RailwayGameState & RailwayStoreActions;

export const useRailwayStore = create<RailwayStore>((set, get) => ({
  phase: 'title',
  currentStationIndex: 0,
  currentStepIndex: 1,
  activeChallengeIndex: 0,
  challenges: RAILWAY_CHALLENGES,
  activeChallenge: RAILWAY_CHALLENGES[0] || null,
  isSuperTieBreaker: false,
  winner: null,

  blueTeam: createTeamState('blue'),
  redTeam: createTeamState('red'),

  stations: STATIONS_LIST,
  loadedItems: { ...DEFAULT_LOADED_ITEMS },
  signalState: 'red',
  train: { ...DEFAULT_TRAIN_STATE },

  fromStationName: STATIONS_LIST[0]?.name || 'Sunny Valley Central',
  toStationName: STATIONS_LIST[1]?.name || 'Pine Ridge Terminal',
  totalJourneysCompleted: 0,

  isMuted: false,
  timeRemaining: 35,
  timerActive: false,
  stepAnimationMessage: null,

  setPhase: (phase) => set({ phase }),

  startGame: () => {
    const firstChallenge = RAILWAY_CHALLENGES[0];
    set({
      phase: 'briefing',
      currentStationIndex: 0,
      currentStepIndex: 1,
      activeChallengeIndex: 0,
      activeChallenge: firstChallenge,
      isSuperTieBreaker: false,
      winner: null,
      blueTeam: createTeamState('blue'),
      redTeam: createTeamState('red'),
      loadedItems: { ...DEFAULT_LOADED_ITEMS },
      signalState: 'red',
      train: { ...DEFAULT_TRAIN_STATE, state: 'idle' },
      fromStationName: STATIONS_LIST[0].name,
      toStationName: STATIONS_LIST[1].name,
      totalJourneysCompleted: 0,
      timeRemaining: firstChallenge?.timeLimit || 35,
      timerActive: false,
      stepAnimationMessage: null,
    });
  },

  setTeamAnswer: (team, answer) => {
    const key = team === 'blue' ? 'blueTeam' : 'redTeam';
    soundManager.playClick();
    set((s) => ({
      [key]: { ...s[key], selectedAnswer: answer },
    }));
  },

  lockInTeam: (team) => {
    const state = get();
    const challenge = state.activeChallenge;
    if (!challenge || state.phase !== 'challenge' && state.phase !== 'super-tie-breaker') return;

    const key = team === 'blue' ? 'blueTeam' : 'redTeam';
    const teamState = state[key];
    const answer = teamState.selectedAnswer;
    if (answer === null) return;

    soundManager.playClick();
    const isCorrect = challenge.validation(answer);

    // Speed bonus calculation (e.g. +10 to +30 pts if answered fast)
    const speedBonus = isCorrect ? Math.max(0, Math.floor(state.timeRemaining * 1.5)) : 0;
    const pointsGained = isCorrect ? challenge.points + speedBonus : 0;
    const newStreak = isCorrect ? teamState.streak + 1 : 0;

    if (isCorrect) {
      soundManager.playCorrect();
    } else {
      soundManager.playWrong();
    }

    // Apply physical loading step consequence if correct!
    const step = challenge.stepIndex;
    const updatedLoaded = { ...state.loadedItems };
    let toastMsg = '';

    if (isCorrect && !state.isSuperTieBreaker) {
      if (step === 1) {
        updatedLoaded.vehicles = true;
        toastMsg = '🚗 STEP 1/5: VEHICLES LOADED!';
      } else if (step === 2) {
        updatedLoaded.materials = true;
        toastMsg = '🧱 STEP 2/5: BUILDING MATERIALS SECURED!';
      } else if (step === 3) {
        updatedLoaded.passengers = true;
        toastMsg = '👥 STEP 3/5: PASSENGERS ONBOARDED!';
      } else if (step === 4) {
        updatedLoaded.brakesLifted = true;
        toastMsg = '⚙️ STEP 4/5: BRAKES LIFTED & STEAM CHARGED!';
      } else if (step === 5) {
        updatedLoaded.signalGreen = true;
        toastMsg = '🚦 STEP 5/5: SIGNAL GREEN! DEPARTING!';
      }
    }

    set((s) => ({
      [key]: {
        ...s[key],
        isLocked: true,
        lastResult: isCorrect ? 'correct' : 'wrong',
        score: s[key].score + pointsGained,
        streak: newStreak,
        correctAnswersCount: isCorrect ? s[key].correctAnswersCount + 1 : s[key].correctAnswersCount,
        lastScoreGained: pointsGained,
        lastFeedback: {
          message: isCorrect
            ? `✅ CORRECT! +${pointsGained} PTS`
            : `❌ WRONG ANSWER`,
          isCorrect,
          pointsEarned: pointsGained,
        },
      },
      loadedItems: updatedLoaded,
      stepAnimationMessage: toastMsg ? toastMsg : s.stepAnimationMessage,
      signalState: (step === 5 && isCorrect) ? 'green' : s.signalState,
    }));

    // If super tie-breaker solved by this team, trigger instant victory!
    if (state.isSuperTieBreaker && isCorrect) {
      soundManager.playRailwayVictory();
      set({
        phase: 'game-over',
        winner: team,
      });
      return;
    }

    // Check if both teams have locked in
    setTimeout(() => {
      const curState = get();
      if (curState.blueTeam.isLocked && curState.redTeam.isLocked) {
        curState.checkAndAdvanceRound();
      }
    }, 300);
  },

  handleTimerExpired: () => {
    const state = get();
    if (state.phase !== 'challenge' && state.phase !== 'super-tie-breaker') return;

    soundManager.playWrong();

    if (state.isSuperTieBreaker) {
      // Tie breaker expired without answer: check score or declare draw
      const winner =
        state.blueTeam.score > state.redTeam.score
          ? 'blue'
          : state.redTeam.score > state.blueTeam.score
            ? 'red'
            : 'draw';

      set({
        phase: 'game-over',
        winner,
        timerActive: false,
      });
      return;
    }

    // Lock in both teams and advance
    set((s) => ({
      blueTeam: { ...s.blueTeam, isLocked: true },
      redTeam: { ...s.redTeam, isLocked: true },
      timerActive: false,
    }));

    get().checkAndAdvanceRound();
  },

  checkAndAdvanceRound: () => {
    set({ phase: 'round-reveal', timerActive: false });

    setTimeout(() => {
      get().advanceToNextQuestion();
    }, 2200);
  },

  advanceToNextQuestion: () => {
    const state = get();
    const curIdx = state.activeChallengeIndex;
    const challenge = state.activeChallenge;

    // If this was Step 5 (or last question in journey), trigger Train Departure!
    if (challenge && challenge.stepIndex === 5) {
      get().startTrainJourneyToNextStation();
      return;
    }

    const nextIdx = curIdx + 1;
    if (nextIdx >= state.challenges.length) {
      // Check for tie-breaker or victory
      if (state.blueTeam.score === state.redTeam.score) {
        // TRIGGER SUPER TIE-BREAKER!
        set({
          phase: 'super-tie-breaker',
          isSuperTieBreaker: true,
          activeChallenge: SUPER_TIE_BREAKER_CHALLENGE,
          timeRemaining: SUPER_TIE_BREAKER_CHALLENGE.timeLimit,
          timerActive: true,
          blueTeam: { ...state.blueTeam, selectedAnswer: null, isLocked: false, lastResult: null, lastFeedback: null },
          redTeam: { ...state.redTeam, selectedAnswer: null, isLocked: false, lastResult: null, lastFeedback: null },
        });
        soundManager.playTrainWhistle();
      } else {
        const winner = state.blueTeam.score > state.redTeam.score ? 'blue' : 'red';
        set({
          phase: 'game-over',
          winner,
        });
        soundManager.playRailwayVictory();
      }
      return;
    }

    const nextChallenge = state.challenges[nextIdx];
    set({
      activeChallengeIndex: nextIdx,
      activeChallenge: nextChallenge,
      currentStepIndex: nextChallenge.stepIndex,
      timeRemaining: nextChallenge.timeLimit,
      timerActive: true,
      phase: 'challenge',
      stepAnimationMessage: null,
      blueTeam: { ...state.blueTeam, selectedAnswer: null, isLocked: false, lastResult: null, lastFeedback: null },
      redTeam: { ...state.redTeam, selectedAnswer: null, isLocked: false, lastResult: null, lastFeedback: null },
    });
  },

  startTrainJourneyToNextStation: () => {
    soundManager.playTrainWhistle();
    set({
      phase: 'train-journey',
      timerActive: false,
      train: {
        ...get().train,
        state: 'departing',
        progress: 0,
        speed: 0,
        smokeActive: true,
        whistleActive: true,
      },
    });

    let prog = 0;
    const interval = setInterval(() => {
      prog += 0.009;
      const currentSpeed = prog < 0.2 ? prog * 5 : prog > 0.8 ? (1 - prog) * 5 : 1;

      set((s) => ({
        train: {
          ...s.train,
          progress: Math.min(1, prog),
          speed: currentSpeed,
          state: prog >= 0.9 ? 'approaching' : 'moving',
        },
      }));

      if (prog >= 1) {
        clearInterval(interval);
        get().completeStationArrival();
      }
    }, 50);
  },

  setTrainProgress: (progress) => {
    set((s) => ({
      train: {
        ...s.train,
        progress: Math.min(1, progress),
      },
    }));
  },

  completeStationArrival: () => {
    const state = get();
    const nextStationIdx = (state.currentStationIndex + 1) % state.stations.length;
    const fromName = state.stations[state.currentStationIndex].name;
    const toName = state.stations[nextStationIdx].name;

    soundManager.playTrainArrive();

    // Check if scores are tied after arrival
    if (state.blueTeam.score === state.redTeam.score) {
      set({
        phase: 'station-arrived',
        currentStationIndex: nextStationIdx,
        fromStationName: fromName,
        toStationName: toName,
        totalJourneysCompleted: state.totalJourneysCompleted + 1,
        train: { ...state.train, state: 'arrived', progress: 0, speed: 0, smokeActive: false, whistleActive: false },
        loadedItems: { ...DEFAULT_LOADED_ITEMS },
        signalState: 'red',
      });
    } else {
      const winner = state.blueTeam.score > state.redTeam.score ? 'blue' : 'red';
      set({
        phase: 'game-over',
        winner,
        currentStationIndex: nextStationIdx,
        fromStationName: fromName,
        toStationName: toName,
        totalJourneysCompleted: state.totalJourneysCompleted + 1,
        train: { ...state.train, state: 'arrived', progress: 0, speed: 0, smokeActive: false, whistleActive: false },
        loadedItems: { ...DEFAULT_LOADED_ITEMS },
        signalState: 'red',
      });
      soundManager.playRailwayVictory();
    }
  },

  toggleMute: () => {
    const current = get().isMuted;
    const newMuted = !current;
    soundManager.setMuted(newMuted);
    set({ isMuted: newMuted });
  },

  setTimeRemaining: (t) => set({ timeRemaining: Math.max(0, t) }),
  setTimerActive: (active) => set({ timerActive: active }),
  clearAnimationMessage: () => set({ stepAnimationMessage: null }),
}));
