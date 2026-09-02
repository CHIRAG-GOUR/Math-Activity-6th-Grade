import { create } from 'zustand';
import {
  MathChallenge,
  TeamForgeState,
  GameStage,
  ForgeZone,
  PlaceValueKey,
  GRADE_6_PLACE_SLOTS,
} from '../types';
import { generateSequenceForRounds } from '../engine/challengeEngine';
import { soundManager } from '@/utils/audio';

interface NumberForgeStore {
  gameStage: GameStage;
  activeZone: ForgeZone;
  currentRound: number;
  totalRounds: number;
  challenges: MathChallenge[];
  currentChallenge: MathChallenge | null;
  timeLeft: number;
  isTimerActive: boolean;

  teamBlue: TeamForgeState;
  teamRed: TeamForgeState;

  // Actions
  initializeGame: (blueName: string, redName: string, roundCount?: number) => void;
  submitAnswer: (
    team: 'blue' | 'red',
    slots: Record<PlaceValueKey, number>,
    totalValue: number
  ) => boolean;
  nextRound: () => void;
  tickTimer: () => void;
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
  incorrectSlots: [],
  isLockedIn: false,
  hasAnsweredCurrent: false,
});

export const useNumberForgeStore = create<NumberForgeStore>((set, get) => ({
  gameStage: 'intro',
  activeZone: 'tower',
  currentRound: 1,
  totalRounds: 5,
  challenges: [],
  currentChallenge: null,
  timeLeft: 35,
  isTimerActive: false,

  teamBlue: initialTeamState('Team Blue'),
  teamRed: initialTeamState('Team Red'),

  initializeGame: (blueName = 'Team Blue', redName = 'Team Red', roundCount = 5) => {
    const sequence = generateSequenceForRounds(roundCount);
    const firstChallenge = sequence[0];

    set({
      gameStage: 'active-challenge',
      activeZone: firstChallenge.zone,
      currentRound: 1,
      totalRounds: roundCount,
      challenges: sequence,
      currentChallenge: firstChallenge,
      timeLeft: firstChallenge.timeLimit || 35,
      isTimerActive: true,
      teamBlue: initialTeamState(blueName),
      teamRed: initialTeamState(redName),
    });

    soundManager.startBgm(0.35);
  },

  submitAnswer: (
    team: 'blue' | 'red',
    slots: Record<PlaceValueKey, number>,
    totalValue: number
  ): boolean => {
    const { currentChallenge } = get();
    if (!currentChallenge) return false;

    const teamKey = team === 'blue' ? 'teamBlue' : 'teamRed';
    const currentTeam = get()[teamKey];
    if (currentTeam.hasAnsweredCurrent) return false;

    const targetNum = currentChallenge.targetNumber || currentChallenge.data.expectedValue || 0;
    const isExactMatch = totalValue === targetNum;

    // Evaluate each slot individually
    const incorrectSlots: PlaceValueKey[] = [];
    GRADE_6_PLACE_SLOTS.forEach((slot) => {
      const expectedDigit = Math.floor((targetNum / slot.multiplier) % 10);
      const actualDigit = slots[slot.key] || 0;
      if (expectedDigit !== actualDigit) {
        incorrectSlots.push(slot.key);
      }
    });

    const isCorrect = isExactMatch && incorrectSlots.length === 0;
    const earnedPoints = isCorrect ? currentChallenge.points : 0;

    let feedbackMessage = '';
    if (isCorrect) {
      soundManager.playCorrect();
      feedbackMessage = `🌟 FORGED CORRECTLY! +${earnedPoints} PTS`;
    } else {
      soundManager.playLockout();
      if (incorrectSlots.length > 0) {
        const firstBadSlot = GRADE_6_PLACE_SLOTS.find((s) => s.key === incorrectSlots[0]);
        feedbackMessage = `⚠️ Check the ${firstBadSlot?.label} place!`;
      } else {
        feedbackMessage = `⚠️ Incorrect number calibration.`;
      }
    }

    const updatedTeam: TeamForgeState = {
      ...currentTeam,
      score: currentTeam.score + earnedPoints,
      streak: isCorrect ? currentTeam.streak + 1 : 0,
      completedCount: isCorrect ? currentTeam.completedCount + 1 : currentTeam.completedCount,
      hasAnsweredCurrent: true,
      incorrectSlots,
      characterAction: isCorrect ? 'celebrate' : 'think',
      lastFeedback: {
        isCorrect,
        pointsEarned: earnedPoints,
        message: feedbackMessage,
      },
    };

    set({ [teamKey]: updatedTeam });

    // Check if both teams have locked in
    const otherTeamKey = team === 'blue' ? 'teamRed' : 'teamBlue';
    const otherTeam = get()[otherTeamKey];

    if (otherTeam.hasAnsweredCurrent) {
      setTimeout(() => {
        set({
          gameStage: 'round-summary',
          isTimerActive: false,
        });
      }, 1500);
    }

    return isCorrect;
  },

  nextRound: () => {
    const { currentRound, totalRounds, challenges } = get();

    if (currentRound >= totalRounds) {
      set({
        gameStage: 'master-complete',
        isTimerActive: false,
      });
      soundManager.playVictory();
      return;
    }

    const nextIndex = currentRound; // next zero-based index
    const nextChallenge = challenges[nextIndex] || challenges[0];

    // Reset round state for both teams
    const resetTeam = (t: TeamForgeState): TeamForgeState => ({
      ...t,
      placedSlots: {},
      incorrectSlots: [],
      hasAnsweredCurrent: false,
      isLockedIn: false,
      characterAction: 'idle',
      lastFeedback: undefined,
    });

    set({
      gameStage: 'active-challenge',
      activeZone: nextChallenge.zone,
      currentRound: currentRound + 1,
      currentChallenge: nextChallenge,
      timeLeft: nextChallenge.timeLimit || 35,
      isTimerActive: true,
      teamBlue: resetTeam(get().teamBlue),
      teamRed: resetTeam(get().teamRed),
    });

    soundManager.playClick();
  },

  tickTimer: () => {
    const { isTimerActive, timeLeft, gameStage } = get();
    if (!isTimerActive || gameStage !== 'active-challenge') return;

    if (timeLeft > 1) {
      set({ timeLeft: timeLeft - 1 });
      if (timeLeft <= 5) {
        soundManager.playTimerWarning();
      }
    } else {
      // Time Expired
      set({
        timeLeft: 0,
        isTimerActive: false,
        gameStage: 'round-summary',
      });
      soundManager.playLockout();
    }
  },

  restartGame: () => {
    const { teamBlue, teamRed, totalRounds } = get();
    get().initializeGame(teamBlue.name, teamRed.name, totalRounds);
  },
}));
