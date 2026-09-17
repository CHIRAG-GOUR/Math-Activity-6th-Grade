// ============================================================
// PERCENTAGE HARVEST — ZUSTAND STATE MANAGEMENT STORE
// Simultaneous 2-player independent gameplay, 5-round match progression,
// 100-cell grid workspace state, farm economics & victory evaluation
// ============================================================

import { create } from 'zustand';
import { FarmTeamState, PercentageQuestion, TeamId, WeatherType, WeighTicket } from '../types';
import { getMatchQuestions } from '../data/questions';
import { CROP_CATALOG } from '../engine/percentageMath';
import { farmSim } from '../engine/farmSim';
import { farmAudio } from '../engine/farmAudio';

interface FarmStoreState {
  blue: FarmTeamState;
  red: FarmTeamState;
  blueQuestions: PercentageQuestion[];
  redQuestions: PercentageQuestion[];
  matchQuestionCount: 5 | 10 | 15;
  weather: WeatherType;
  matchCompleted: boolean;
  winner: 'blue' | 'red' | 'tie' | null;
  winnerSummary: {
    blueScore: number;
    redScore: number;
    reason: string;
  } | null;
  muted: boolean;
  showBriefing: boolean;
  showVictory: boolean;

  // Actions
  setMatchQuestionCount: (count: 5 | 10 | 15) => void;
  toggleMute: () => void;
  setShowBriefing: (show: boolean) => void;
  setShowVictory: (show: boolean) => void;
  selectAnswer: (teamId: TeamId, answer: number | string) => void;
  toggleGridCell: (teamId: TeamId, cellIndex: number) => void;
  setGridCellState: (teamId: TeamId, cellIndex: number, value: boolean) => void;
  setQuickGridPercentage: (teamId: TeamId, percent: number) => void;
  clearGrid: (teamId: TeamId) => void;
  submitAnswer: (teamId: TeamId) => void;
  nextQuestion: (teamId: TeamId) => void;
  resetMatch: () => void;
}

const createInitialTeamState = (teamId: TeamId, firstQuestion: PercentageQuestion): FarmTeamState => ({
  teamId,
  teamName: teamId === 'blue' ? 'BLUE FARM' : 'RED FARM',
  currentRound: 1,
  isMatchComplete: false,
  currentQuestion: firstQuestion,
  selectedCells: new Array(100).fill(false),
  selectedAnswer: null,
  hasAnsweredCurrent: false,
  isCurrentCorrect: null,
  feedbackMessage: null,
  attemptsCount: 0,
  farmEvolutionStage: 1,
  allocatedHectares: firstQuestion.baseQuantity || 100,
  currentCrop: firstQuestion.cropType || 'wheat',
  fieldGrowthStage: 0,
  farmerTask: 'idle',
  farmerProgress: 0,
  vehicleTask: 'idle',
  vehicleProgress: 0,
  trailerFillPercent: 0,
  trailerLoadKg: 0,
  truckCargoCount: 0,
  lastTicket: null,
  accuracy: 100,
  totalAnswered: 0,
  correctAnswersCount: 0,
  totalHarvestKg: 0,
  wasteKg: 0,
  deliveriesCount: 0,
  totalRevenue: 0,
  totalProfit: 0,
});

const initialBlueQuestions = getMatchQuestions(5, 0);
const initialRedQuestions = getMatchQuestions(5, 1);

export const useFarmStore = create<FarmStoreState>((set, get) => ({
  blue: createInitialTeamState('blue', initialBlueQuestions[0]),
  red: createInitialTeamState('red', initialRedQuestions[0]),
  blueQuestions: initialBlueQuestions,
  redQuestions: initialRedQuestions,
  matchQuestionCount: 5,
  weather: 'sunny_morning',
  matchCompleted: false,
  winner: null,
  winnerSummary: null,
  muted: false,
  showBriefing: false,
  showVictory: false,

  setMatchQuestionCount: (count: 5 | 10 | 15) => {
    const newBlue = getMatchQuestions(count, 0);
    const newRed = getMatchQuestions(count, 1);
    farmSim.reset();
    set({
      matchQuestionCount: count,
      blue: createInitialTeamState('blue', newBlue[0]),
      red: createInitialTeamState('red', newRed[0]),
      blueQuestions: newBlue,
      redQuestions: newRed,
      matchCompleted: false,
      winner: null,
      winnerSummary: null,
      showVictory: false,
    });
  },

  toggleMute: () => {
    const nextMuted = !get().muted;
    farmAudio.setMuted(nextMuted);
    set({ muted: nextMuted });
  },

  setShowBriefing: (show: boolean) => set({ showBriefing: show }),
  setShowVictory: (show: boolean) => set({ showVictory: show }),

  selectAnswer: (teamId: TeamId, answer: number | string) => {
    set((state) => {
      const team = state[teamId];
      if (team.hasAnsweredCurrent) return state;
      return {
        [teamId]: {
          ...team,
          selectedAnswer: answer,
        },
      };
    });
  },

  toggleGridCell: (teamId: TeamId, cellIndex: number) => {
    set((state) => {
      const team = state[teamId];
      if (team.hasAnsweredCurrent || cellIndex < 0 || cellIndex >= 100) return state;
      const newCells = [...team.selectedCells];
      newCells[cellIndex] = !newCells[cellIndex];
      const count = newCells.filter(Boolean).length;
      return {
        [teamId]: {
          ...team,
          selectedCells: newCells,
          selectedAnswer: count, // Grid count directly maps to percentage
        },
      };
    });
  },

  setGridCellState: (teamId: TeamId, cellIndex: number, value: boolean) => {
    set((state) => {
      const team = state[teamId];
      if (team.hasAnsweredCurrent || cellIndex < 0 || cellIndex >= 100) return state;
      if (team.selectedCells[cellIndex] === value) return state;
      const newCells = [...team.selectedCells];
      newCells[cellIndex] = value;
      const count = newCells.filter(Boolean).length;
      return {
        [teamId]: {
          ...team,
          selectedCells: newCells,
          selectedAnswer: count,
        },
      };
    });
  },

  setQuickGridPercentage: (teamId: TeamId, percent: number) => {
    set((state) => {
      const team = state[teamId];
      if (team.hasAnsweredCurrent) return state;
      const clamped = Math.max(0, Math.min(100, Math.round(percent)));
      const newCells = new Array(100).fill(false).map((_, i) => i < clamped);
      return {
        [teamId]: {
          ...team,
          selectedCells: newCells,
          selectedAnswer: clamped,
        },
      };
    });
  },

  clearGrid: (teamId: TeamId) => {
    set((state) => {
      const team = state[teamId];
      if (team.hasAnsweredCurrent) return state;
      return {
        [teamId]: {
          ...team,
          selectedCells: new Array(100).fill(false),
          selectedAnswer: 0,
        },
      };
    });
  },

  submitAnswer: (teamId: TeamId) => {
    const state = get();
    const team = state[teamId];
    const q = team.currentQuestion;
    if (!q || team.hasAnsweredCurrent) return;

    const userAnswer = team.selectedAnswer;
    if (userAnswer === null || userAnswer === undefined) return;

    const isCorrect = String(userAnswer).trim() === String(q.correctAnswer).trim();
    const cropCfg = CROP_CATALOG[q.cropType];
    const totalQ = state.matchQuestionCount;
    const stageIndex = Math.min(5, Math.floor(((team.currentRound - 1) / totalQ) * 5) + 1);

    let newHarvestKg = team.totalHarvestKg;
    let newWasteKg = team.wasteKg;
    let newDeliveries = team.deliveriesCount;
    let newRevenue = team.totalRevenue;
    let newProfit = team.totalProfit;
    let newEvolutionStage = Math.min(5, stageIndex);

    let ticket: WeighTicket | null = null;

    if (isCorrect) {
      farmAudio.playCorrect();
      const harvestKg = q.physicalOutcome.harvestKg || 420;
      const multiplier = q.physicalOutcome.priceMultiplier || 1.0;
      const rev = Math.round(harvestKg * cropCfg.basePricePerKg * multiplier);
      const operatingCost = Math.round(rev * 0.22); // 22% farm inputs cost
      const profitGain = rev - operatingCost;

      newHarvestKg += harvestKg;
      newDeliveries += 1;
      newRevenue += rev;
      newProfit += profitGain;

      ticket = {
        ticketId: `TK-${teamId.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
        cropName: cropCfg.name,
        cropType: q.cropType,
        grossWeightKg: harvestKg + 120, // include trailer tare
        tareWeightKg: 120,
        netWeightKg: harvestKg,
        pricePerKg: cropCfg.basePricePerKg * multiplier,
        totalRevenue: rev,
        timestamp: Date.now(),
      };

      // ── TRIGGER PHYSICAL AGRICULTURAL STAGE (1 to 5) ──
      if (stageIndex === 1) {
        // Stage 1: Sowing empty furrow rows
        farmSim.startSowingSequence(teamId, q.cropType);
      } else if (stageIndex === 2) {
        // Stage 2: Manure / Fertilizer Application
        farmSim.startFertilizerSequence(teamId);
      } else if (stageIndex === 3) {
        // Stage 3: Growth & Time Passes under Sunshine
        farmSim.advanceTime(
          team.currentRound + 3,
          14,
          0,
          'SUNSHINE & IRRIGATION — CROPS GROWING TALL'
        );
      } else if (stageIndex === 4) {
        // Stage 4: Backpack Machine Pesticide Spraying (Wand mist)
        farmSim.startPesticideSequence(teamId);
      } else {
        // Stage 5: Combine Harvesting -> Crate Truck Loading -> Road Delivery -> Market Scale & Sale
        farmSim.startHarvestAndDeliverySequence(teamId, q.cropType, harvestKg, rev);
      }
    } else {
      farmAudio.playIncorrect();
      newWasteKg += 60; // 60 kg crop loss due to miscalculation
    }

    const totalAns = team.totalAnswered + 1;
    const correctAns = team.correctAnswersCount + (isCorrect ? 1 : 0);
    const newAccuracy = Math.round((correctAns / totalAns) * 100);

    const feedback = isCorrect
      ? `✓ Correct! ${q.physicalOutcome.description}`
      : `✕ Incorrect. The correct answer was ${q.correctAnswer} ${q.unit}. ${q.stepExplanation[0]}`;

    set({
      [teamId]: {
        ...team,
        hasAnsweredCurrent: true,
        isCurrentCorrect: isCorrect,
        feedbackMessage: feedback,
        totalAnswered: totalAns,
        correctAnswersCount: correctAns,
        accuracy: newAccuracy,
        totalHarvestKg: newHarvestKg,
        wasteKg: newWasteKg,
        deliveriesCount: newDeliveries,
        totalRevenue: newRevenue,
        totalProfit: newProfit,
        farmEvolutionStage: newEvolutionStage,
        lastTicket: ticket || team.lastTicket,
      },
    });

    // Check if both teams have finished all questions
    setTimeout(() => {
      const updated = get();
      if (updated.blue.isMatchComplete && updated.red.isMatchComplete && !updated.matchCompleted) {
        const blueScore = updated.blue.totalProfit + updated.blue.totalHarvestKg * 10 + updated.blue.accuracy * 20 - updated.blue.wasteKg * 15;
        const redScore = updated.red.totalProfit + updated.red.totalHarvestKg * 10 + updated.red.accuracy * 20 - updated.red.wasteKg * 15;

        let winner: 'blue' | 'red' | 'tie' = 'tie';
        let reason = 'Both farms achieved exceptional sustainable yields!';
        if (blueScore > redScore) {
          winner = 'blue';
          reason = `Blue Farm generated ₹${updated.blue.totalRevenue.toLocaleString()} with ${updated.blue.accuracy}% accuracy!`;
        } else if (redScore > blueScore) {
          winner = 'red';
          reason = `Red Farm generated ₹${updated.red.totalRevenue.toLocaleString()} with ${updated.red.accuracy}% accuracy!`;
        }

        farmAudio.playVictoryFanfare();
        set({
          matchCompleted: true,
          winner,
          winnerSummary: { blueScore, redScore, reason },
          showVictory: true,
        });
      }
    }, 500);
  },

  nextQuestion: (teamId: TeamId) => {
    const state = get();
    const team = state[teamId];
    const totalQ = state.matchQuestionCount;
    const questions = teamId === 'blue' ? state.blueQuestions : state.redQuestions;
    const nextRoundNum = team.currentRound + 1;

    if (nextRoundNum > totalQ) {
      // Team finished all questions
      set({
        [teamId]: {
          ...team,
          isMatchComplete: true,
        },
      });

      // Check if both are complete
      const checkState = get();
      if (checkState.blue.isMatchComplete && checkState.red.isMatchComplete && !checkState.matchCompleted) {
        const blueScore = checkState.blue.totalProfit + checkState.blue.totalHarvestKg * 10 + checkState.blue.accuracy * 20 - checkState.blue.wasteKg * 15;
        const redScore = checkState.red.totalProfit + checkState.red.totalHarvestKg * 10 + checkState.red.accuracy * 20 - checkState.red.wasteKg * 15;

        let winner: 'blue' | 'red' | 'tie' = 'tie';
        let reason = 'Both farms operated with outstanding agricultural efficiency!';
        if (blueScore > redScore) {
          winner = 'blue';
          reason = `Blue Farm generated ₹${checkState.blue.totalRevenue.toLocaleString()} with ${checkState.blue.accuracy}% accuracy!`;
        } else if (redScore > blueScore) {
          winner = 'red';
          reason = `Red Farm generated ₹${checkState.red.totalRevenue.toLocaleString()} with ${checkState.red.accuracy}% accuracy!`;
        }

        farmAudio.playVictoryFanfare();
        set({
          matchCompleted: true,
          winner,
          winnerSummary: { blueScore, redScore, reason },
          showVictory: true,
        });
      }
      return;
    }

    const nextQ = questions[nextRoundNum - 1];
    const weatherMap: Record<number, WeatherType> = {
      1: 'sunny_morning',
      2: 'cloudy',
      3: 'rain',
      4: 'afternoon_sun',
      5: 'golden_sunset',
    };

    const stageIdx = Math.min(5, Math.floor(((nextRoundNum - 1) / totalQ) * 5) + 1);

    set({
      weather: weatherMap[stageIdx] || 'sunny_morning',
      [teamId]: {
        ...team,
        currentRound: nextRoundNum,
        currentQuestion: nextQ,
        selectedCells: new Array(100).fill(false),
        selectedAnswer: null,
        hasAnsweredCurrent: false,
        isCurrentCorrect: null,
        feedbackMessage: null,
        currentCrop: nextQ.cropType,
      },
    });
  },

  resetMatch: () => {
    const totalQ = get().matchQuestionCount;
    const newBlueQ = getMatchQuestions(totalQ, Math.floor(Math.random() * 5));
    const newRedQ = getMatchQuestions(totalQ, Math.floor(Math.random() * 5) + 5);
    farmSim.reset();
    set({
      blue: createInitialTeamState('blue', newBlueQ[0]),
      red: createInitialTeamState('red', newRedQ[0]),
      blueQuestions: newBlueQ,
      redQuestions: newRedQ,
      weather: 'sunny_morning',
      matchCompleted: false,
      winner: null,
      winnerSummary: null,
      showVictory: false,
    });
  },
}));
