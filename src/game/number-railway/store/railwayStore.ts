// ============================================================
// THE GREAT NUMBER RAILWAY — Zustand Store
// 5-Stage Station Journey State & Multi-Touch Team Architecture
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
import { RAILWAY_CHALLENGES, STATIONS_LIST } from '../engine/challenges';
import { soundManager } from '@/utils/audio';

const createTeamState = (id: TeamId): TeamState => ({
  id,
  name: id === 'blue' ? 'BLUE ENGINEERS' : 'RED ENGINEERS',
  score: 0,
  streak: 0,
  correctAnswersCount: 0,
  currentAnswer: null,
  isLockedIn: false,
  hasAnswered: false,
  isCorrect: null,
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
  evaluateTeam: (team: TeamId) => void;
  resetTeamInputs: () => void;

  nextStepOrDepart: () => void;
  startTrainJourneyToNextStation: () => void;
  setTrainProgress: (progress: number) => void;
  completeStationArrival: () => void;

  toggleMute: () => void;
  setTimeRemaining: (t: number) => void;
  setTimerActive: (active: boolean) => void;
  clearAnimationMessage: () => void;
}

export type RailwayStore = RailwayGameState & RailwayStoreActions;

export const useRailwayStore = create<RailwayStore>((set, get) => ({
  phase: 'title',
  currentStationIndex: 0,
  currentStepIndex: 1,
  activeChallengeIndex: 0,
  challenges: RAILWAY_CHALLENGES,
  activeChallenge: RAILWAY_CHALLENGES[0] || null,

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
  timeRemaining: 45,
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
      blueTeam: createTeamState('blue'),
      redTeam: createTeamState('red'),
      loadedItems: { ...DEFAULT_LOADED_ITEMS },
      signalState: 'red',
      train: { ...DEFAULT_TRAIN_STATE, state: 'idle' },
      fromStationName: STATIONS_LIST[0].name,
      toStationName: STATIONS_LIST[1].name,
      totalJourneysCompleted: 0,
      timeRemaining: firstChallenge?.timeLimit || 45,
      timerActive: false,
      stepAnimationMessage: null,
    });
  },

  setTeamAnswer: (team, answer) => {
    const key = team === 'blue' ? 'blueTeam' : 'redTeam';
    soundManager.playClick();
    set((s) => ({
      [key]: { ...s[key], currentAnswer: answer },
    }));
  },

  lockInTeam: (team) => {
    const key = team === 'blue' ? 'blueTeam' : 'redTeam';
    soundManager.playClick();
    set((s) => ({
      [key]: { ...s[key], isLockedIn: true, hasAnswered: true },
    }));
  },

  evaluateTeam: (team) => {
    const state = get();
    const challenge = state.activeChallenge;
    if (!challenge) return;

    const key = team === 'blue' ? 'blueTeam' : 'redTeam';
    const teamState = state[key];
    const answer = teamState.currentAnswer;
    const isCorrect = answer !== null && challenge.validation(answer);

    const points = isCorrect ? challenge.points : 0;
    const newStreak = isCorrect ? teamState.streak + 1 : 0;

    if (isCorrect) {
      soundManager.playCorrect();
    } else {
      soundManager.playWrong();
    }

    set((s) => ({
      [key]: {
        ...s[key],
        isCorrect,
        score: s[key].score + points,
        streak: newStreak,
        correctAnswersCount: isCorrect ? s[key].correctAnswersCount + 1 : s[key].correctAnswersCount,
        attemptsOnCurrent: s[key].attemptsOnCurrent + 1,
        lastFeedback: {
          message: isCorrect
            ? `✅ CORRECT! +${points} PTS — ${challenge.stepTitle}!`
            : `🔍 ${challenge.hints[Math.min(s[key].attemptsOnCurrent, challenge.hints.length - 1)]}`,
          isCorrect,
          pointsEarned: points,
        },
      },
    }));

    // If at least one team got it right, apply the physical loading consequence!
    if (isCorrect) {
      const step = challenge.stepIndex;
      const updatedLoaded = { ...get().loadedItems };
      let msg = '';

      if (step === 1) {
        updatedLoaded.vehicles = true;
        msg = '🚗 STEP 1/5: VEHICLES LOADED ONTO FLATBED!';
        soundManager.playKeypadBeep();
      } else if (step === 2) {
        updatedLoaded.materials = true;
        msg = '🧱 STEP 2/5: BUILDING MATERIALS & TIMBER SECURED!';
        soundManager.playKeypadBeep();
      } else if (step === 3) {
        updatedLoaded.passengers = true;
        msg = '👥 STEP 3/5: ALL ABOARD! PASSENGERS ENTER COACH!';
        soundManager.playTrainWhistle();
      } else if (step === 4) {
        updatedLoaded.brakesLifted = true;
        msg = '⚙️ STEP 4/5: PNEUMATIC BRAKES LIFTED & STEAM FULLY CHARGED!';
        soundManager.playKeypadBeep();
      } else if (step === 5) {
        updatedLoaded.signalGreen = true;
        msg = '🚦 STEP 5/5: SIGNAL TURNS GREEN! TRAIN DEPARTS TO NEXT STATION!';
        soundManager.playSignalChange();
      }

      set({
        loadedItems: updatedLoaded,
        stepAnimationMessage: msg,
        signalState: step === 5 ? 'green' : 'red',
      });

      // If Step 5 is solved, start train journey! Otherwise advance to next step
      if (step === 5) {
        setTimeout(() => {
          get().startTrainJourneyToNextStation();
        }, 1200);
      } else {
        setTimeout(() => {
          get().nextStepOrDepart();
        }, 1800);
      }
    }
  },

  resetTeamInputs: () => {
    set((s) => ({
      blueTeam: {
        ...s.blueTeam,
        currentAnswer: null,
        isLockedIn: false,
        hasAnswered: false,
        isCorrect: null,
        lastFeedback: null,
        attemptsOnCurrent: 0,
      },
      redTeam: {
        ...s.redTeam,
        currentAnswer: null,
        isLockedIn: false,
        hasAnswered: false,
        isCorrect: null,
        lastFeedback: null,
        attemptsOnCurrent: 0,
      },
    }));
  },

  nextStepOrDepart: () => {
    const state = get();
    const nextIdx = state.activeChallengeIndex + 1;

    if (nextIdx >= state.challenges.length) {
      set({ phase: 'network-complete' });
      soundManager.playRailwayVictory();
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
    });
    get().resetTeamInputs();
  },

  startTrainJourneyToNextStation: () => {
    soundManager.playTrainWhistle();
    set({
      phase: 'train-journey',
      train: {
        ...get().train,
        state: 'departing',
        progress: 0,
        speed: 0,
        smokeActive: true,
        whistleActive: true,
      },
    });

    // Run journey progression animation
    let prog = 0;
    const interval = setInterval(() => {
      prog += 0.008; // Smooth journey (~6 seconds)
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

    set({
      phase: 'station-arrived',
      currentStationIndex: nextStationIdx,
      fromStationName: fromName,
      toStationName: toName,
      totalJourneysCompleted: state.totalJourneysCompleted + 1,
      train: {
        ...state.train,
        state: 'arrived',
        progress: 0,
        speed: 0,
        smokeActive: false,
        whistleActive: false,
      },
      loadedItems: { ...DEFAULT_LOADED_ITEMS }, // Reset loading for next station run!
      signalState: 'red',
    });
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
