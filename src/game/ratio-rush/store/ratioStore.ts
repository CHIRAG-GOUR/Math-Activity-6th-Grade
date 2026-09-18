// ============================================================
// RATIO RUSH — ZUSTAND STATE MANAGEMENT
// Central state store for movie studio production, question progression,
// camera modes, audio synchronization, and duel competitions
// ============================================================

import { create } from 'zustand';
import { RatioGameState, StudioCameraView, StudioTeam, ProductionStage } from '../types';
import { RATIO_QUESTIONS } from '../data/questions';
import { ratioAudio } from '../engine/ratioAudio';
import { SCENE_LENGTH } from '../world/StudioPerformance';

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

interface RatioRuntimeState {
  /** performance.now() when 'ACTION' was called, so the 3D stage can drive the scene. */
  filmStartedAt: number | null;
}

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

export const useRatioStore = create<RatioGameState & RatioRuntimeState & RatioStoreActions>((set, get) => ({
  filmStartedAt: null,
  gameMode: 'duel',
  activeCameraView: 'overview',
  isTimerRunning: true,
  timeRemaining: 300, // 5 minutes
  currentMovieStage: 0,
  stageWinners: [null, null, null, null, null],
  blueScenesWon: 0,
  redScenesWon: 0,
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
    const otherKey = team === 'blue' ? 'redTeam' : 'blueTeam';
    const teamState = state[key];
    const otherTeamState = state[otherKey];
    const stageIdx = state.currentMovieStage;
    const currentQ = RATIO_QUESTIONS[stageIdx];
    if (!currentQ) return false;

    const numVal = parseFloat(teamState.inputAnswer);
    const isCorrect = !isNaN(numVal) && Math.abs(numVal - currentQ.correctAnswer) < 0.001;

    if (isCorrect) {
      ratioAudio.playCorrectChime();
      const nextScore = teamState.score + 100 + teamState.streak * 25;
      const nextStreak = teamState.streak + 1;
      const nextSolved = Array.from(new Set([...teamState.solvedStages, currentQ.stage]));
      const nextLevel = Math.min(5, stageIdx + 1);

      const newStageWinners = [...state.stageWinners];
      let newBlueWon = state.blueScenesWon;
      let newRedWon = state.redScenesWon;

      // Award scene credit if not already awarded
      if (newStageWinners[stageIdx] === null) {
        newStageWinners[stageIdx] = team;
        if (team === 'blue') newBlueWon += 1;
        else newRedWon += 1;
      }

      // Update global stage according to progress
      let newGlobalStage: ProductionStage = 'prep';
      if (nextLevel === 1) newGlobalStage = 'set_building';
      else if (nextLevel === 2) newGlobalStage = 'lights_camera';
      else if (nextLevel === 3) newGlobalStage = 'props_placed';
      else if (nextLevel === 4) newGlobalStage = 'sound_ready';
      else if (nextLevel >= 5) newGlobalStage = 'action_filming';

      const isFinished = stageIdx >= RATIO_QUESTIONS.length - 1;

      set({
        [key]: {
          ...teamState,
          score: nextScore,
          streak: nextStreak,
          solvedStages: nextSolved,
          productionLevel: nextLevel,
          feedbackStatus: 'correct',
          feedbackMessage: `EXCELLENT! +1 SCENE DIRECTED (${currentQ.correctAnswer} ${currentQ.correctUnit})`,
          isComplete: isFinished,
        },
        [otherKey]: {
          ...otherTeamState,
          productionLevel: nextLevel,
          solvedStages: nextSolved,
          feedbackStatus: otherTeamState.feedbackStatus === 'correct' ? 'correct' : otherTeamState.feedbackStatus,
          feedbackMessage:
            otherTeamState.feedbackStatus === 'correct'
              ? otherTeamState.feedbackMessage
              : `Scene ${currentQ.stage} directed by ${team === 'blue' ? 'Blue' : 'Red'} Studio!`,
        },
        stageWinners: newStageWinners,
        blueScenesWon: newBlueWon,
        redScenesWon: newRedWon,
        globalProductionStage: newGlobalStage,
      });

      // Trigger clapper snap celebration
      get().triggerClapper();

      // If all 5 stages finished, calculate winner by scene contributions
      if (isFinished) {
        const winner =
          newBlueWon > newRedWon
            ? 'blue'
            : newRedWon > newBlueWon
            ? 'red'
            : 'tie';
        set({ winningTeam: winner });
        get().startFilmingSequence();
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
    const state = get();
    const nextIdx = state.currentMovieStage + 1;
    if (nextIdx < RATIO_QUESTIONS.length) {
      set({
        currentMovieStage: nextIdx,
        blueTeam: {
          ...state.blueTeam,
          currentQuestionIndex: nextIdx,
          selectedOption: null,
          inputAnswer: '',
          feedbackStatus: 'idle',
          feedbackMessage: '',
        },
        redTeam: {
          ...state.redTeam,
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
    if (get().isFilmingActive) return;
    ratioAudio.playDirectorCall();
    set({
      isFilmingActive: true,
      activeCameraView: 'camera1',
      globalProductionStage: 'action_filming',
      // The clapper board plays first; the cast start acting once it snaps.
      filmStartedAt: (typeof performance !== 'undefined' ? performance.now() : Date.now()) + 1000,
    });
    get().triggerClapper();

    // Let the cast play the whole scene through before the premiere.
    setTimeout(() => {
      get().openPremiere();
    }, (SCENE_LENGTH + 1.4) * 1000);
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
      currentMovieStage: 0,
      stageWinners: [null, null, null, null, null],
      blueScenesWon: 0,
      redScenesWon: 0,
      globalProductionStage: 'prep',
      isFilmingActive: false,
      isPremiereActive: false,
      clapperVisible: false,
      clapperTake: 1,
      flashActive: false,
      filmStartedAt: null,
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
