// ============================================================
// RATIO RUSH — ZUSTAND STATE MANAGEMENT
// Central state store for movie studio production, question progression,
// camera modes, audio synchronization, and duel competitions
// ============================================================

import { create } from 'zustand';
import { RatioGameState, StudioCameraView, StudioTeam, ProductionStage } from '../types';
import { RATIO_QUESTIONS } from '../data/questions';
import { ratioAudio } from '../engine/ratioAudio';

const INITIAL_TEAM_STATE = (team: StudioTeam) => ({
  team,
  currentQuestionIndex: 0,
  score: 0,
  streak: 0,
  isComplete: false,
  selectedOption: null,
  inputAnswer: '',
  feedbackStatus: 'idle' as const,
  feedbackMessage: '',
  solvedStages: [],
  productionLevel: 0,
});

interface RatioStoreActions {
  setGameMode: (mode: 'duel' | 'solo') => void;
  setActiveCameraView: (view: StudioCameraView) => void;
  selectOption: (team: StudioTeam, option: number) => void;
  setInputAnswer: (team: StudioTeam, val: string) => void;
  submitAnswer: (team: StudioTeam) => boolean;
  nextQuestion: (team: StudioTeam) => void;
  triggerFlash: () => void;
  triggerClapper: () => void;
  startFilmingSequence: () => void;
  openPremiere: () => void;
  toggleMute: () => void;
  toggleFullscreen: () => void;
  setShowBriefingModal: (show: boolean) => void;
  setTapeMultiplier: (mult: number) => void;
  resetGame: () => void;
  decrementTimer: () => void;
}

export const useRatioStore = create<RatioGameState & RatioStoreActions>((set, get) => ({
  gameMode: 'duel',
  activeCameraView: 'overview',
  isTimerRunning: true,
  timeRemaining: 300, // 5 minutes
  globalProductionStage: 'prep',
  isFilmingActive: false,
  isPremiereActive: false,
  clapperVisible: false,
  clapperTake: 1,
  flashActive: false,
  blueTeam: INITIAL_TEAM_STATE('blue'),
  redTeam: INITIAL_TEAM_STATE('red'),
  activeSoloTeam: 'blue',
  selectedTapeMultiplier: 1,
  winningTeam: null,
  showBriefingModal: false,
  isMuted: false,
  isFullscreen: false,

  setGameMode: (gameMode) => {
    set({ gameMode });
  },

  setActiveCameraView: (activeCameraView) => {
    set({ activeCameraView });
  },

  selectOption: (team, option) => {
    const key = team === 'blue' ? 'blueTeam' : 'redTeam';
    const current = get()[key];
    set({
      [key]: {
        ...current,
        selectedOption: option,
        inputAnswer: option.toString(),
        feedbackStatus: 'idle',
      },
    });
  },

  setInputAnswer: (team, val) => {
    const key = team === 'blue' ? 'blueTeam' : 'redTeam';
    const current = get()[key];
    set({
      [key]: {
        ...current,
        inputAnswer: val,
        selectedOption: null,
        feedbackStatus: 'idle',
      },
    });
  },

  submitAnswer: (team) => {
    const state = get();
    const key = team === 'blue' ? 'blueTeam' : 'redTeam';
    const teamState = state[key];
    const currentQ = RATIO_QUESTIONS[teamState.currentQuestionIndex];
    if (!currentQ) return false;

    const numVal = parseFloat(teamState.inputAnswer);
    const isCorrect = !isNaN(numVal) && Math.abs(numVal - currentQ.correctAnswer) < 0.001;

    if (isCorrect) {
      ratioAudio.playCorrectChime();
      const nextScore = teamState.score + 100 + teamState.streak * 25;
      const nextStreak = teamState.streak + 1;
      const nextSolved = [...teamState.solvedStages, currentQ.stage];
      const nextLevel = Math.min(5, teamState.productionLevel + 1);
      const isFinished = teamState.currentQuestionIndex >= RATIO_QUESTIONS.length - 1;

      // Update global stage according to highest team progress
      let newGlobalStage: ProductionStage = 'prep';
      const highestLevel = Math.max(
        nextLevel,
        team === 'blue' ? state.redTeam.productionLevel : state.blueTeam.productionLevel
      );

      if (highestLevel === 1) newGlobalStage = 'set_building';
      else if (highestLevel === 2) newGlobalStage = 'lights_camera';
      else if (highestLevel === 3) newGlobalStage = 'props_placed';
      else if (highestLevel === 4) newGlobalStage = 'sound_ready';
      else if (highestLevel >= 5) newGlobalStage = 'action_filming';

      set({
        [key]: {
          ...teamState,
          score: nextScore,
          streak: nextStreak,
          solvedStages: nextSolved,
          productionLevel: nextLevel,
          feedbackStatus: 'correct',
          feedbackMessage: `EXCELLENT! ${currentQ.studioActionText}`,
          isComplete: isFinished,
        },
        globalProductionStage: newGlobalStage,
      });

      // If finished, check victory
      if (isFinished) {
        if (state.gameMode === 'solo') {
          set({ winningTeam: team });
          get().startFilmingSequence();
        } else {
          const otherTeamKey = team === 'blue' ? 'redTeam' : 'blueTeam';
          if (state[otherTeamKey].isComplete) {
            const winner =
              nextScore > state[otherTeamKey].score
                ? team
                : state[otherTeamKey].score > nextScore
                ? team === 'blue'
                  ? 'red'
                  : 'blue'
                : 'tie';
            set({ winningTeam: winner });
            get().startFilmingSequence();
          }
        }
      }

      return true;
    } else {
      ratioAudio.playIncorrectBuzz();
      const miscon = currentQ.misconceptions.find((m) => m.wrongAnswer === numVal);
      const msg = miscon
        ? miscon.reason
        : `Incorrect. Try scaling the ratio ${currentQ.ratioA} : ${currentQ.ratioB} using unit rates.`;

      set({
        [key]: {
          ...teamState,
          streak: 0,
          feedbackStatus: 'incorrect',
          feedbackMessage: msg,
        },
      });
      return false;
    }
  },

  nextQuestion: (team) => {
    const key = team === 'blue' ? 'blueTeam' : 'redTeam';
    const teamState = get()[key];
    const nextIdx = teamState.currentQuestionIndex + 1;
    if (nextIdx < RATIO_QUESTIONS.length) {
      set({
        [key]: {
          ...teamState,
          currentQuestionIndex: nextIdx,
          selectedOption: null,
          inputAnswer: '',
          feedbackStatus: 'idle',
          feedbackMessage: '',
        },
      });
    }
  },

  triggerFlash: () => {
    ratioAudio.playCameraFlash();
    set({ flashActive: true });
    setTimeout(() => {
      set({ flashActive: false });
    }, 180);
  },

  triggerClapper: () => {
    ratioAudio.playClapperSnap();
    set((s) => ({ clapperVisible: true, clapperTake: s.clapperTake + 1 }));
    setTimeout(() => {
      set({ clapperVisible: false });
    }, 900);
  },

  startFilmingSequence: () => {
    ratioAudio.playDirectorCall();
    set({
      isFilmingActive: true,
      activeCameraView: 'camera1',
      globalProductionStage: 'action_filming',
    });
    get().triggerClapper();

    // After 6 seconds of filming action, transition to premiere
    setTimeout(() => {
      get().openPremiere();
    }, 6000);
  },

  openPremiere: () => {
    ratioAudio.playVictoryFanfare();
    set({
      isPremiereActive: true,
      activeCameraView: 'premiere',
      globalProductionStage: 'premiere',
    });
  },

  toggleMute: () => {
    const isMuted = ratioAudio.toggleMute();
    set({ isMuted });
  },

  toggleFullscreen: () => {
    if (typeof document === 'undefined') return;
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      set({ isFullscreen: true });
    } else {
      document.exitFullscreen().catch(() => {});
      set({ isFullscreen: false });
    }
  },

  setShowBriefingModal: (showBriefingModal) => {
    set({ showBriefingModal });
  },

  setTapeMultiplier: (selectedTapeMultiplier) => {
    set({ selectedTapeMultiplier });
  },

  resetGame: () => {
    set({
      activeCameraView: 'overview',
      isTimerRunning: true,
      timeRemaining: 300,
      globalProductionStage: 'prep',
      isFilmingActive: false,
      isPremiereActive: false,
      clapperVisible: false,
      clapperTake: 1,
      flashActive: false,
      blueTeam: INITIAL_TEAM_STATE('blue'),
      redTeam: INITIAL_TEAM_STATE('red'),
      winningTeam: null,
      selectedTapeMultiplier: 1,
    });
  },

  decrementTimer: () => {
    const { timeRemaining, isTimerRunning } = get();
    if (!isTimerRunning) return;
    if (timeRemaining > 0) {
      set({ timeRemaining: timeRemaining - 1 });
    } else {
      set({ isTimerRunning: false });
      const { blueTeam, redTeam, gameMode } = get();
      if (gameMode === 'duel') {
        const winner =
          blueTeam.score > redTeam.score ? 'blue' : redTeam.score > blueTeam.score ? 'red' : 'tie';
        set({ winningTeam: winner });
      } else {
        set({ winningTeam: 'blue' });
      }
      get().startFilmingSequence();
    }
  },
}));
