import { create } from 'zustand';
import {
  MathChallenge,
  ForgeZone,
  TeamForgeState,
  GameStage,
  PlaceValueKey,
} from '../types';
import { generateChallengeSequence } from '../engine/challengeEngine';
import { validateMasterBlueprintSubmission } from '../engine/masterBlueprintEngine';
import { soundManager } from '@/utils/audio';

interface NumberForgeStore {
  gameStage: GameStage;
  currentRound: number;
  totalRounds: number;
  currentChallenge: MathChallenge | null;
  challenges: MathChallenge[];
  activeZone: ForgeZone;
  timeLeft: number;
  isTimerRunning: boolean;

  teamBlue: TeamForgeState;
  teamRed: TeamForgeState;

  // Actions
  initializeGame: (blueName?: string, redName?: string, rounds?: number) => void;
  submitAnswer: (team: 'blue' | 'red', answerValue: any) => boolean;
  placeBlockInSlot: (team: 'blue' | 'red', slot: PlaceValueKey, digit: number) => void;
  clearTeamSlots: (team: 'blue' | 'red') => void;
  nextRound: () => void;
  tickTimer: () => void;
  setTimer: (seconds: number) => void;
  restartGame: () => void;
}

const initialTeamState = (name: string): TeamForgeState => ({
  name,
  score: 0,
  streak: 0,
  accuracy: 100,
  completedCount: 0,
  mistakes: [],
  characterAction: 'idle',
  selectedNumberBlocks: [],
  placedSlots: {},
  isLockedIn: false,
  hasAnsweredCurrent: false,
});

export const useNumberForgeStore = create<NumberForgeStore>((set, get) => ({
  gameStage: 'intro',
  currentRound: 1,
  totalRounds: 6,
  currentChallenge: null,
  challenges: [],
  activeZone: 'workshop',
  timeLeft: 30,
  isTimerRunning: false,

  teamBlue: initialTeamState('Team Inventors (Blue)'),
  teamRed: initialTeamState('Team Crafters (Red)'),

  initializeGame: (blueName = 'Team Blue', redName = 'Team Red', rounds = 6) => {
    const sequence = generateChallengeSequence(rounds);
    const firstChallenge = sequence[0];

    set({
      gameStage: 'active-challenge',
      currentRound: 1,
      totalRounds: rounds,
      challenges: sequence,
      currentChallenge: firstChallenge,
      activeZone: firstChallenge.zone,
      timeLeft: firstChallenge.timeLimit,
      isTimerRunning: true,
      teamBlue: initialTeamState(blueName),
      teamRed: initialTeamState(redName),
    });

    soundManager.playCorrect();
  },

  placeBlockInSlot: (team: 'blue' | 'red', slot: PlaceValueKey, digit: number) => {
    const teamKey = team === 'blue' ? 'teamBlue' : 'teamRed';
    const currentTeam = get()[teamKey];

    const updatedSlots = {
      ...currentTeam.placedSlots,
      [slot]: digit,
    };

    set({
      [teamKey]: {
        ...currentTeam,
        placedSlots: updatedSlots,
        characterAction: 'operate',
      },
    });

    soundManager.playKeypadBeep();
  },

  clearTeamSlots: (team: 'blue' | 'red') => {
    const teamKey = team === 'blue' ? 'teamBlue' : 'teamRed';
    const currentTeam = get()[teamKey];

    set({
      [teamKey]: {
        ...currentTeam,
        placedSlots: {},
        characterAction: 'think',
      },
    });
    soundManager.playClick();
  },

  submitAnswer: (team: 'blue' | 'red', answerValue: any): boolean => {
    const { currentChallenge, currentRound, totalRounds } = get();
    if (!currentChallenge) return false;

    const teamKey = team === 'blue' ? 'teamBlue' : 'teamRed';
    const currentTeam = get()[teamKey];
    if (currentTeam.hasAnsweredCurrent) return false;

    let isCorrect = false;
    let earnedPoints = 0;
    let feedbackMessage = '';

    // Mathematical verification by challenge type
    if (currentChallenge.type === 'master-blueprint') {
      const constraints = currentChallenge.data.blueprintConstraints || [];
      const validation = validateMasterBlueprintSubmission(String(answerValue), constraints);
      isCorrect = validation.isValid;
      earnedPoints = isCorrect ? currentChallenge.points : validation.passedCount * 50;
      feedbackMessage = isCorrect
        ? '🌟 MASTER BLUEPRINT FORGED PERFECTLY!'
        : `⚠️ Missed constraints: ${validation.failedRules.join(', ')}`;
    } else if (currentChallenge.type === 'digit-hunt') {
      isCorrect =
        Number(answerValue) === currentChallenge.data.targetDigit ||
        Number(answerValue) === currentChallenge.data.expectedValue;
      earnedPoints = isCorrect ? currentChallenge.points : 0;
      feedbackMessage = isCorrect
        ? `✅ Correct! Digit is ${currentChallenge.data.targetDigit} with value ${currentChallenge.data.expectedValue?.toLocaleString()}!`
        : `❌ Not quite. In this place value, the digit is ${currentChallenge.data.targetDigit}.`;
    } else {
      isCorrect = Number(answerValue) === Number(currentChallenge.data.expectedValue);
      earnedPoints = isCorrect ? currentChallenge.points : 0;
      feedbackMessage = isCorrect
        ? `✅ Correct Calibration! +${currentChallenge.points} PTS`
        : `❌ Incorrect value. Correct answer: ${currentChallenge.data.expectedValue?.toLocaleString()}`;
    }

    if (isCorrect) {
      soundManager.playCorrect();
    } else {
      soundManager.playLockout();
    }

    const updatedTeam: TeamForgeState = {
      ...currentTeam,
      score: currentTeam.score + earnedPoints,
      streak: isCorrect ? currentTeam.streak + 1 : 0,
      completedCount: isCorrect ? currentTeam.completedCount + 1 : currentTeam.completedCount,
      hasAnsweredCurrent: true,
      characterAction: isCorrect ? 'celebrate' : 'think',
      lastFeedback: {
        isCorrect,
        pointsEarned: earnedPoints,
        message: feedbackMessage,
      },
    };

    set({ [teamKey]: updatedTeam });

    // Check if both teams have answered or round is ready to summarize
    const otherTeamKey = team === 'blue' ? 'teamRed' : 'teamBlue';
    const otherTeam = get()[otherTeamKey];

    if (otherTeam.hasAnsweredCurrent) {
      // Both teams finished current challenge
      setTimeout(() => {
        if (currentRound >= totalRounds) {
          set({ gameStage: 'master-complete', isTimerRunning: false });
          soundManager.playVictory();
        } else {
          set({ gameStage: 'round-summary', isTimerRunning: false });
        }
      }, 1500);
    }

    return isCorrect;
  },

  nextRound: () => {
    const { currentRound, totalRounds, challenges } = get();
    const nextIdx = currentRound; // next index (0-based)

    if (nextIdx >= totalRounds || nextIdx >= challenges.length) {
      set({ gameStage: 'master-complete', isTimerRunning: false });
      soundManager.playVictory();
      return;
    }

    const nextChallenge = challenges[nextIdx];

    set((state) => ({
      gameStage: 'active-challenge',
      currentRound: state.currentRound + 1,
      currentChallenge: nextChallenge,
      activeZone: nextChallenge.zone,
      timeLeft: nextChallenge.timeLimit,
      isTimerRunning: true,
      teamBlue: {
        ...state.teamBlue,
        hasAnsweredCurrent: false,
        placedSlots: {},
        characterAction: 'idle',
        lastFeedback: undefined,
      },
      teamRed: {
        ...state.teamRed,
        hasAnsweredCurrent: false,
        placedSlots: {},
        characterAction: 'idle',
        lastFeedback: undefined,
      },
    }));

    soundManager.playClick();
  },

  tickTimer: () => {
    const { timeLeft, isTimerRunning, gameStage } = get();
    if (!isTimerRunning || gameStage !== 'active-challenge') return;

    if (timeLeft <= 1) {
      // Timer Expired: Auto reveal round summary
      set({ timeLeft: 0, isTimerRunning: false, gameStage: 'round-summary' });
      soundManager.playLockout();
    } else {
      set({ timeLeft: timeLeft - 1 });
      if (timeLeft <= 6) {
        soundManager.playTimerWarning();
      }
    }
  },

  setTimer: (seconds: number) => set({ timeLeft: seconds }),

  restartGame: () => {
    set({
      gameStage: 'intro',
      currentRound: 1,
      currentChallenge: null,
      isTimerRunning: false,
      teamBlue: initialTeamState('Team Blue'),
      teamRed: initialTeamState('Team Red'),
    });
    soundManager.playClick();
  },
}));
