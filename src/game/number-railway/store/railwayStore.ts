// ============================================================
// THE GREAT NUMBER RAILWAY — Zustand Game Store
// - Configurable Team Names & Question Lengths (5, 10, 15)
// - Smooth In-Game Camera Zoom Controls (+ & -)
// - First-Answerer & Rebound Competitive Rule
// - Integrated Real Train Audio & Loud Whistle Blasts
// ============================================================

import { create } from 'zustand';
import {
  RailwayGameState,
  TeamState,
  TeamId,
  TrainAnimState,
  GamePhase,
  RoundWinner,
  OnboardPassenger,
} from '../types';
import { ROUNDS, NETWORK_STATIONS, getTieBreaker, buildRounds } from '../engine/challenges';
import { soundManager } from '@/utils/audio';

const createTeamState = (id: TeamId, customName?: string): TeamState => ({
  id,
  name: customName || (id === 'blue' ? 'TEAM BLUE' : 'TEAM RED'),
  score: 0,
  roundScore: 0,
  streak: 0,
  correctAnswersCount: 0,
  roundCorrect: 0,
  roundsWon: 0,
  selectedAnswer: null,
  isLocked: false,
  lastResult: null,
  lastScoreGained: 0,
  lastFeedback: null,
});

const idleTrain = (): TrainAnimState => ({
  progress: 0,
  speed: 0,
  state: 'idle',
  smokeActive: false,
  whistleActive: false,
  headlampOn: false,
});

const resetTeamForRound = (t: TeamState): TeamState => ({
  ...t,
  roundScore: 0,
  roundCorrect: 0,
  streak: 0,
  selectedAnswer: null,
  isLocked: false,
  lastResult: null,
  lastScoreGained: 0,
  lastFeedback: null,
});

const clearTeamForQuestion = (t: TeamState): TeamState => ({
  ...t,
  selectedAnswer: null,
  isLocked: false,
  lastResult: null,
  lastFeedback: null,
});

let travelInterval: ReturnType<typeof setInterval> | null = null;
const clearTravel = () => {
  if (travelInterval) {
    clearInterval(travelInterval);
    travelInterval = null;
  }
};

interface RailwayActions {
  setPhase: (phase: GamePhase) => void;
  setTeamName: (team: TeamId, name: string) => void;
  setQuestionCountConfig: (count: 5 | 10 | 15) => void;
  setTotalRounds: (n: number) => void;
  startGame: () => void;
  startRound: (index: number) => void;
  beginChallenge: () => void;

  setTeamAnswer: (team: TeamId, answer: number | string) => void;
  lockInTeam: (team: TeamId) => void;
  handleTimerExpired: () => void;
  advanceQuestion: () => void;

  beginShowdown: () => void;
  startTieBreak: () => void;
  runWinnerSequence: (winner: TeamId) => void;
  proceedToNextRound: () => void;

  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;

  toggleMute: () => void;
  setTimeRemaining: (t: number) => void;
  setTimerActive: (active: boolean) => void;
  clearToast: () => void;
}

export type RailwayStore = RailwayGameState & RailwayActions;

export const useRailwayStore = create<RailwayStore>((set, get) => ({
  phase: 'title',

  rounds: ROUNDS,
  currentRoundIndex: 0,
  questionIndexInRound: 0,
  activeChallenge: ROUNDS[0].questions[0],
  isTieBreak: false,

  blueTeam: createTeamState('blue', 'TEAM BLUE'),
  redTeam: createTeamState('red', 'TEAM RED'),

  roundWinner: null,
  matchWinner: null,

  signalsGreenCount: 0,
  onboardPassengers: [],

  signalBlue: 'red',
  signalRed: 'red',
  switchTarget: 'neutral',
  showdownStep: 'idle',
  activeRoute: null,

  blueTrain: idleTrain(),
  redTrain: idleTrain(),

  stations: NETWORK_STATIONS,
  unlockedStationIds: [NETWORK_STATIONS[0].id],
  totalRounds: 1,
  questionCountConfig: 5,
  zoomLevel: 1.0,

  isMuted: false,
  timeRemaining: 35,
  timerActive: false,
  toastMessage: null,

  setPhase: (phase) => set({ phase }),

  setTeamName: (team, name) => {
    const key = team === 'blue' ? 'blueTeam' : 'redTeam';
    set((s) => ({
      [key]: { ...s[key], name: name.trim() || (team === 'blue' ? 'TEAM BLUE' : 'TEAM RED') },
    }));
  },

  setQuestionCountConfig: (count) => {
    const roundsNeeded = count === 15 ? 3 : count === 10 ? 2 : 1;
    const newRounds = buildRounds(roundsNeeded);
    set({
      questionCountConfig: count,
      totalRounds: roundsNeeded,
      rounds: newRounds,
      activeChallenge: newRounds[0].questions[0],
    });
  },

  setTotalRounds: (n) => {
    const clamped = Math.max(1, Math.min(n, 5));
    const newRounds = buildRounds(clamped);
    set({
      totalRounds: clamped,
      rounds: newRounds,
      activeChallenge: newRounds[0].questions[0],
    });
  },

  zoomIn: () => {
    soundManager.playClick();
    set((s) => ({ zoomLevel: Math.min(1.45, Number((s.zoomLevel + 0.12).toFixed(2))) }));
  },

  zoomOut: () => {
    soundManager.playClick();
    set((s) => ({ zoomLevel: Math.max(0.65, Number((s.zoomLevel - 0.12).toFixed(2))) }));
  },

  resetZoom: () => {
    soundManager.playClick();
    set({ zoomLevel: 1.0 });
  },

  startGame: () => {
    clearTravel();
    const firstRound = get().rounds[0];
    soundManager.startRailwayBgm(0.3);
    soundManager.playTrainHorn();
    setTimeout(() => {
      soundManager.playTrainBells(3000);
    }, 600);

    set((s) => ({
      phase: 'round-intro',
      currentRoundIndex: 0,
      questionIndexInRound: 0,
      activeChallenge: firstRound.questions[0],
      isTieBreak: false,
      blueTeam: { ...s.blueTeam, score: 0, roundScore: 0, streak: 0, correctAnswersCount: 0, roundCorrect: 0, roundsWon: 0, selectedAnswer: null, isLocked: false, lastResult: null, lastFeedback: null },
      redTeam: { ...s.redTeam, score: 0, roundScore: 0, streak: 0, correctAnswersCount: 0, roundCorrect: 0, roundsWon: 0, selectedAnswer: null, isLocked: false, lastResult: null, lastFeedback: null },
      roundWinner: null,
      matchWinner: null,
      signalsGreenCount: 0,
      onboardPassengers: [],
      signalBlue: 'red',
      signalRed: 'red',
      switchTarget: 'neutral',
      showdownStep: 'idle',
      activeRoute: null,
      blueTrain: idleTrain(),
      redTrain: idleTrain(),
      unlockedStationIds: [NETWORK_STATIONS[0].id],
      timeRemaining: firstRound.questions[0].timeLimit,
      timerActive: false,
      toastMessage: null,
    }));
  },

  startRound: (index) => {
    clearTravel();
    const r = get().rounds[index] || get().rounds[0];
    set((s) => ({
      phase: 'round-intro',
      currentRoundIndex: index,
      questionIndexInRound: 0,
      activeChallenge: r.questions[0],
      isTieBreak: false,
      blueTeam: resetTeamForRound(s.blueTeam),
      redTeam: resetTeamForRound(s.redTeam),
      roundWinner: null,
      signalsGreenCount: 0,
      onboardPassengers: [],
      signalBlue: 'red',
      signalRed: 'red',
      switchTarget: 'neutral',
      showdownStep: 'idle',
      activeRoute: null,
      blueTrain: idleTrain(),
      redTrain: idleTrain(),
      timeRemaining: r.questions[0].timeLimit,
      timerActive: false,
      toastMessage: null,
    }));
  },

  beginChallenge: () => {
    const ch = get().activeChallenge;
    set((s) => ({
      phase: 'challenge',
      timeRemaining: ch?.timeLimit ?? 35,
      timerActive: true,
      blueTeam: clearTeamForQuestion(s.blueTeam),
      redTeam: clearTeamForQuestion(s.redTeam),
    }));
  },

  setTeamAnswer: (team, answer) => {
    const key = team === 'blue' ? 'blueTeam' : 'redTeam';
    soundManager.playClick();
    set((s) => ({
      [key]: { ...s[key], selectedAnswer: answer },
    }));
  },

  // ── First-Answerer & Rebound Engine ──
  lockInTeam: (team) => {
    const state = get();
    const ch = state.activeChallenge;
    if (!ch || (state.phase !== 'challenge' && state.phase !== 'tie-break')) return;

    const key = team === 'blue' ? 'blueTeam' : 'redTeam';
    const otherKey = team === 'blue' ? 'redTeam' : 'blueTeam';
    const teamState = state[key];
    const otherTeamState = state[otherKey];

    if (teamState.isLocked || teamState.selectedAnswer === null) return;

    soundManager.playClick();
    const isCorrect = ch.validation(teamState.selectedAnswer);

    if (isCorrect) {
      // ── WINNING ANSWER ──
      soundManager.playCorrect();
      const speedBonus = Math.max(0, Math.floor(state.timeRemaining * 1.5));
      const pointsGained = ch.points + speedBonus;
      const newStreak = teamState.streak + 1;

      // Add a passenger in this team's color inside the coach!
      const nextSeat = state.onboardPassengers.length;
      const newPassenger: OnboardPassenger = {
        id: `pass-${team}-${nextSeat}`,
        team,
        seatIndex: nextSeat,
      };

      set((s) => ({
        [key]: {
          ...s[key],
          isLocked: true,
          lastResult: 'correct',
          score: s[key].score + pointsGained,
          roundScore: s[key].roundScore + pointsGained,
          streak: newStreak,
          correctAnswersCount: s[key].correctAnswersCount + 1,
          roundCorrect: s[key].roundCorrect + 1,
          lastScoreGained: pointsGained,
          lastFeedback: {
            message: `✅ CORRECT! +${pointsGained} PTS`,
            isCorrect: true,
            pointsEarned: pointsGained,
          },
        },
        [otherKey]: {
          ...s[otherKey],
          isLocked: true, // Question claimed by first correct answerer!
        },
        signalsGreenCount: Math.min(5, s.signalsGreenCount + 1),
        onboardPassengers: [...s.onboardPassengers, newPassenger],
        toastMessage: `👥 ${s[key].name} PASSENGER BOARDED! SIGNAL GREEN!`,
        timerActive: false,
      }));

      // If tie-break, instant victory
      if (state.isTieBreak) {
        soundManager.playLoudWhistle();
        get().runWinnerSequence(team);
        return;
      }

      // Enter question reveal
      setTimeout(() => {
        set({ phase: 'question-reveal', timerActive: false });
      }, 500);

    } else {
      // ── WRONG ANSWER: LOCK OUT THIS TEAM & GIVE 2ND TEAM REBOUND ──
      soundManager.playWrong();

      set((s) => ({
        [key]: {
          ...s[key],
          isLocked: true,
          lastResult: 'wrong',
          lastFeedback: {
            message: `❌ WRONG ANSWER`,
            isCorrect: false,
            pointsEarned: 0,
          },
        },
        toastMessage: `${s[key].name} INCORRECT! ${s[otherKey].name} CAN REBOUND!`,
      }));

      // If the other team was ALREADY locked out (both answered wrong), end question!
      if (otherTeamState.isLocked) {
        set({ timerActive: false });
        setTimeout(() => {
          set({ phase: 'question-reveal', timerActive: false });
        }, 600);
      }
    }
  },

  handleTimerExpired: () => {
    const state = get();
    if (state.phase !== 'challenge' && state.phase !== 'tie-break') return;

    soundManager.playWrong();

    if (state.isTieBreak) {
      // Tie-break expired without winner → higher round score or draw
      const winner =
        state.blueTeam.roundScore > state.redTeam.roundScore
          ? 'blue'
          : state.redTeam.roundScore > state.blueTeam.roundScore
            ? 'red'
            : 'draw';

      if (winner === 'draw') {
        set({ phase: 'winner-reveal', roundWinner: 'draw', timerActive: false });
      } else {
        get().runWinnerSequence(winner);
      }
      return;
    }

    // 0 points for both when timer expires with no correct answer
    set((s) => ({
      blueTeam: { ...s.blueTeam, isLocked: true },
      redTeam: { ...s.redTeam, isLocked: true },
      timerActive: false,
      phase: 'question-reveal',
    }));
  },

  advanceQuestion: () => {
    const state = get();
    const curRound = state.rounds[state.currentRoundIndex];
    const totalQ = curRound.questions.length;
    const nextQIndex = state.questionIndexInRound + 1;

    if (nextQIndex >= totalQ) {
      // Round questions completed → Start Showdown!
      get().beginShowdown();
      return;
    }

    const nextChallenge = curRound.questions[nextQIndex];
    set((s) => ({
      questionIndexInRound: nextQIndex,
      activeChallenge: nextChallenge,
      timeRemaining: nextChallenge.timeLimit,
      timerActive: true,
      phase: 'challenge',
      toastMessage: null,
      blueTeam: clearTeamForQuestion(s.blueTeam),
      redTeam: clearTeamForQuestion(s.redTeam),
    }));
  },

  beginShowdown: () => {
    const state = get();
    const blue = state.blueTeam.roundScore;
    const red = state.redTeam.roundScore;

    if (blue === red) {
      // Tied scores → Sudden Death Tie-Breaker
      get().startTieBreak();
      return;
    }

    const winner: TeamId = blue > red ? 'blue' : 'red';
    get().runWinnerSequence(winner);
  },

  startTieBreak: () => {
    const rIdx = get().currentRoundIndex;
    const tb = getTieBreaker(rIdx);
    soundManager.playLoudWhistle();

    set((s) => ({
      phase: 'tie-break',
      isTieBreak: true,
      activeChallenge: tb,
      timeRemaining: tb.timeLimit,
      timerActive: true,
      toastMessage: '⚡ SUDDEN-DEATH TIE-BREAKER! FIRST CORRECT WINS ROUTE!',
      blueTeam: clearTeamForQuestion(s.blueTeam),
      redTeam: clearTeamForQuestion(s.redTeam),
    }));
  },

  runWinnerSequence: (winner) => {
    clearTravel();
    const isBlue = winner === 'blue';
    const winnerName = isBlue ? get().blueTeam.name : get().redTeam.name;

    set({
      phase: 'showdown',
      roundWinner: winner,
      isTieBreak: false,
      timerActive: false,
      showdownStep: 'quiet',
      activeRoute: winner,
      signalBlue: 'red',
      signalRed: 'red',
      switchTarget: 'neutral',
      toastMessage: '🛑 ALL SIGNALS RED — ROUTE CLEARANCE IN PROGRESS',
    });

    // 1. Throw switch lever toward winner (after 1.2s)
    setTimeout(() => {
      soundManager.playSwitchMechanism();
      set({
        showdownStep: 'switching',
        switchTarget: winner,
        toastMessage: `⚙️ JUNCTION SWITCH THROWING ➔ ${winnerName} EXPRESS LINE`,
      });
    }, 1200);

    // 2. Winner signal turns YELLOW (after 2.5s)
    setTimeout(() => {
      soundManager.playSignalChange();
      set({
        showdownStep: 'signal-yellow',
        [isBlue ? 'signalBlue' : 'signalRed']: 'yellow',
        toastMessage: `🟡 SIGNAL YELLOW — ROUTE PRE-CLEARED FOR ${winnerName}`,
      });
    }, 2500);

    // 3. Winner signal turns GREEN & Loud Whistle blows when about to start (after 3.8s)
    setTimeout(() => {
      soundManager.playSignalChange();
      soundManager.playLoudWhistle();
      set({
        showdownStep: 'signal-green',
        [isBlue ? 'signalBlue' : 'signalRed']: 'green',
        toastMessage: `🟢 SIGNAL GREEN! ${winnerName} AUTHORIZED TO DEPART!`,
      });
    }, 3800);

    // 4. Train departs & travels down the scenic line (after 5.0s)
    setTimeout(() => {
      soundManager.playTrainRunningAudio();

      set({
        showdownStep: 'departing',
        toastMessage: `🚂 ${winnerName} STEAM TRAIN EN ROUTE!`,
        [isBlue ? 'blueTrain' : 'redTrain']: {
          progress: 0,
          speed: 1,
          state: 'departing',
          smokeActive: true,
          whistleActive: true,
          headlampOn: true,
        },
      });

      let prog = 0;
      let tick = 0;
      travelInterval = setInterval(() => {
        tick++;
        prog += 1 / 180; // ~9 second cinematic ride

        // Loud whistle blasts 2 times spaced at 3-second intervals during train movement!
        if (tick === 60 || tick === 120) {
          soundManager.playLoudWhistle();
        }

        const spd = prog < 0.15 ? prog * 6.6 : prog > 0.85 ? (1 - prog) * 6.6 : 1;

        set((s) => ({
          [isBlue ? 'blueTrain' : 'redTrain']: {
            ...s[isBlue ? 'blueTrain' : 'redTrain'],
            progress: Math.min(1, prog),
            speed: spd,
            state: prog >= 0.88 ? 'approaching' : 'moving',
          },
        }));

        if (prog >= 1) {
          clearTravel();
          soundManager.stopTrainRunningAudio();
          soundManager.playTrainArrive();

          // 5. Arrived at destination station!
          const r = get().rounds[get().currentRoundIndex];
          const destId = r?.destinationStationId;

          set((s) => ({
            showdownStep: 'arrived',
            phase: 'winner-reveal',
            unlockedStationIds: destId && !s.unlockedStationIds.includes(destId)
              ? [...s.unlockedStationIds, destId]
              : s.unlockedStationIds,
            [isBlue ? 'blueTeam' : 'redTeam']: {
              ...s[isBlue ? 'blueTeam' : 'redTeam'],
              roundsWon: s[isBlue ? 'blueTeam' : 'redTeam'].roundsWon + 1,
            },
            [isBlue ? 'blueTrain' : 'redTrain']: {
              ...s[isBlue ? 'blueTrain' : 'redTrain'],
              state: 'arrived',
              speed: 0,
              smokeActive: false,
              whistleActive: false,
            },
            toastMessage: `🏁 ARRIVED AT ${r?.subtitle.toUpperCase()}!`,
          }));
        }
      }, 50);
    }, 5000);
  },

  proceedToNextRound: () => {
    clearTravel();
    const nextIdx = get().currentRoundIndex + 1;
    if (nextIdx >= get().totalRounds) {
      // Grand Network Complete!
      const blueWins = get().blueTeam.roundsWon;
      const redWins = get().redTeam.roundsWon;
      const matchWinner: RoundWinner =
        blueWins > redWins
          ? 'blue'
          : redWins > blueWins
            ? 'red'
            : get().blueTeam.score > get().redTeam.score
              ? 'blue'
              : get().redTeam.score > get().blueTeam.score
                ? 'red'
                : 'draw';

      set({
        phase: 'network-complete',
        matchWinner,
        timerActive: false,
      });
      soundManager.playRailwayVictory();
    } else {
      get().startRound(nextIdx);
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
  clearToast: () => set({ toastMessage: null }),
}));
