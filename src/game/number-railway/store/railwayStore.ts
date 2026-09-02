// ============================================================
// THE GREAT NUMBER RAILWAY — Zustand Game Store
// - Skillizee Junction ➔ CCIS Junction
// - Support for 5, 10, or 15 Question Rounds (1, 2, or 3 questions per step)
// - Initial train approach to Skillizee Junction before Q1
// - Reordered 5-Stage Physical Progression:
//   Step 1: 👥 Passengers Board from Platform
//   Step 2: 🚗 Vehicles (Sedan & Pickup) Loaded onto Flatbed
//   Step 3: 🪜 Materials (Ladders, Planks, Steel, Bricks) Loaded
//   Step 4: ⚙️ Locomotive Driver Releases Brakes & Builds Steam
//   Step 5: 🚦 Master Green Signal & 15-Second Scenic Journey
// ============================================================

import { create } from 'zustand';
import {
  RailwayGameState,
  TeamState,
  TeamId,
  TrainAnimState,
  GamePhase,
  LoadedTrainItems,
  TotalQuestionsOption,
} from '../types';
import {
  STATIONS_LIST,
  SUPER_TIE_BREAKER_CHALLENGE,
  getChallengeSet,
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
  passengers: false,
  vehicles: false,
  materials: false,
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
  setTotalQuestionsCount: (count: TotalQuestionsOption) => void;
  startGame: (totalQ?: TotalQuestionsOption) => void;

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
  totalQuestionsCount: 5,
  questionsPerStep: 1,
  stepQuestionsCompleted: 0,

  currentStationIndex: 0,
  currentStepIndex: 1,
  activeChallengeIndex: 0,
  challenges: getChallengeSet(5),
  activeChallenge: getChallengeSet(5)[0] || null,
  isSuperTieBreaker: false,
  winner: null,

  blueTeam: createTeamState('blue'),
  redTeam: createTeamState('red'),

  stations: STATIONS_LIST,
  loadedItems: { ...DEFAULT_LOADED_ITEMS },
  signalState: 'red',
  train: { ...DEFAULT_TRAIN_STATE },

  fromStationName: STATIONS_LIST[0].name,
  toStationName: STATIONS_LIST[1].name,
  totalJourneysCompleted: 0,

  isMuted: false,
  timeRemaining: 35,
  timerActive: false,
  stepAnimationMessage: null,

  setPhase: (phase) => set({ phase }),

  setTotalQuestionsCount: (count) => {
    const qList = getChallengeSet(count);
    const qPerStep = count === 5 ? 1 : count === 10 ? 2 : 3;
    set({
      totalQuestionsCount: count,
      questionsPerStep: qPerStep,
      challenges: qList,
      activeChallenge: qList[0],
    });
  },

  startGame: (totalQ) => {
    const qCount = totalQ || get().totalQuestionsCount || 5;
    const qPerStep = qCount === 5 ? 1 : qCount === 10 ? 2 : 3;
    const qList = getChallengeSet(qCount);
    const firstChallenge = qList[0];

    // Play whistle and show train arriving into Skillizee Junction platform
    soundManager.playTrainWhistle();

    set({
      phase: 'train-approaching',
      totalQuestionsCount: qCount,
      questionsPerStep: qPerStep,
      stepQuestionsCompleted: 0,
      currentStationIndex: 0,
      currentStepIndex: 1,
      activeChallengeIndex: 0,
      challenges: qList,
      activeChallenge: firstChallenge,
      isSuperTieBreaker: false,
      winner: null,
      blueTeam: createTeamState('blue'),
      redTeam: createTeamState('red'),
      loadedItems: { ...DEFAULT_LOADED_ITEMS },
      signalState: 'red',
      train: { ...DEFAULT_TRAIN_STATE, state: 'arriving-start', progress: 0, speed: 1, smokeActive: true },
      fromStationName: STATIONS_LIST[0].name,
      toStationName: STATIONS_LIST[1].name,
      totalJourneysCompleted: 0,
      timeRemaining: firstChallenge?.timeLimit || 35,
      timerActive: false,
      stepAnimationMessage: '🚂 LOCOMOTIVE ARRIVING AT SKILLIZEE JUNCTION...',
    });

    // After 2.5s train arrival animation, open briefing
    setTimeout(() => {
      set((s) => ({
        phase: 'briefing',
        train: { ...s.train, state: 'idle', speed: 0, smokeActive: false },
        stepAnimationMessage: null,
      }));
    }, 2500);
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
    if (!challenge || (state.phase !== 'challenge' && state.phase !== 'super-tie-breaker')) return;

    const key = team === 'blue' ? 'blueTeam' : 'redTeam';
    const teamState = state[key];
    const answer = teamState.selectedAnswer;
    if (answer === null) return;

    soundManager.playClick();
    const isCorrect = challenge.validation(answer);

    const speedBonus = isCorrect ? Math.max(0, Math.floor(state.timeRemaining * 1.5)) : 0;
    const pointsGained = isCorrect ? challenge.points + speedBonus : 0;
    const newStreak = isCorrect ? teamState.streak + 1 : 0;

    if (isCorrect) {
      soundManager.playCorrect();
    } else {
      soundManager.playWrong();
    }

    // Physical loading consequence
    const step = challenge.stepIndex;
    const updatedLoaded = { ...state.loadedItems };
    let toastMsg = '';

    if (isCorrect && !state.isSuperTieBreaker) {
      if (step === 1) {
        updatedLoaded.passengers = true;
        toastMsg = '👥 STEP 1/5: PASSENGERS ONBOARDED INTO COACH!';
      } else if (step === 2) {
        updatedLoaded.vehicles = true;
        toastMsg = '🚗 STEP 2/5: VEHICLES SECURED ONTO FLATBED!';
      } else if (step === 3) {
        updatedLoaded.materials = true;
        toastMsg = '🪜 STEP 3/5: LADDERS, PLANKS & STEEL LOADED!';
      } else if (step === 4) {
        updatedLoaded.brakesLifted = true;
        toastMsg = '⚙️ STEP 4/5: DRIVER DISENGAGES BRAKES & BUILDS STEAM!';
      } else if (step === 5) {
        updatedLoaded.signalGreen = true;
        toastMsg = '🚦 STEP 5/5: SIGNAL TURNS GREEN! ALL ABOARD!';
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
          message: isCorrect ? `✅ CORRECT! +${pointsGained} PTS` : `❌ WRONG ANSWER`,
          isCorrect,
          pointsEarned: pointsGained,
        },
      },
      loadedItems: updatedLoaded,
      stepAnimationMessage: toastMsg ? toastMsg : s.stepAnimationMessage,
      signalState: step === 5 && isCorrect ? 'green' : s.signalState,
    }));

    if (state.isSuperTieBreaker && isCorrect) {
      soundManager.playRailwayVictory();
      set({
        phase: 'game-over',
        winner: team,
      });
      return;
    }

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

    // Check if step 5 questions completed
    const nextIdx = curIdx + 1;
    if (nextIdx >= state.challenges.length) {
      // Journey departure!
      get().startTrainJourneyToNextStation();
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
    let tickCount = 0;

    // 300 ticks * 50ms = 15.0 SECONDS JOURNEY!
    const interval = setInterval(() => {
      tickCount++;
      prog += 1 / 300; // Exact 15.0 seconds!

      // Rhythmic steam chuffing every ~350ms
      if (tickCount % 7 === 0 && prog < 0.94) {
        soundManager.playTrainChug();
      }

      // Mid-journey scenic bridge whistle blast at ~7.5 seconds
      if (tickCount === 150) {
        soundManager.playTrainWhistle();
      }

      const currentSpeed = prog < 0.15 ? prog * 6.6 : prog > 0.85 ? (1 - prog) * 6.6 : 1;

      set((s) => ({
        train: {
          ...s.train,
          progress: Math.min(1, prog),
          speed: currentSpeed,
          state: prog >= 0.88 ? 'approaching' : 'moving',
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
    soundManager.playTrainArrive();

    if (state.blueTeam.score === state.redTeam.score) {
      // Tie breaker
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
        totalJourneysCompleted: state.totalJourneysCompleted + 1,
        train: { ...state.train, state: 'arrived', progress: 1, speed: 0, smokeActive: false, whistleActive: false },
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
