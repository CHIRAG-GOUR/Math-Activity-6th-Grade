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
  SignalState,
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
  attemptsLeft: 2,
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
  attemptsLeft: 2,
  lastFeedback: null,
});

const clearTeamForQuestion = (t: TeamState): TeamState => ({
  ...t,
  selectedAnswer: null,
  isLocked: false,
  lastResult: null,
  attemptsLeft: 2,
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

const computeStepProgressAndSignals = (step: number) => {
  // Step 0 (0 Q answered): Far background staging yard (progress 0.0), all signals red
  // Step 1 (Q1 answered): Move forward from far staging to station platform (progress 0.10)
  // Step 2 (Q2 answered): DO NOT MOVE (progress 0.10) -> Blow horn & whistle at station platform
  // Step 3 (Q3 answered): DO NOT MOVE (progress 0.10) -> Blow horn & loud whistle -> Signal 1 turns GREEN
  // Step 4 (Q4 answered): Move forward to switch approach (progress 0.18) -> Signal 2 turns GREEN (zero collision)
  // Step 5 (Q5 answered / Showdown): Winner departs through junction to destination station (progress 0.18 -> 1.00)
  const progress =
    step === 1 ? 0.10 : step === 2 ? 0.10 : step === 3 ? 0.10 : step >= 4 ? 0.18 : 0;
  const signal1: SignalState = step >= 3 ? 'green' : 'red';
  const signal2: SignalState = step >= 4 ? 'green' : 'red';

  return { progress, signal1, signal2 };
};

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
  signal1Blue: 'red',
  signal2Blue: 'red',
  signal1Red: 'red',
  signal2Red: 'red',
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
  timeRemaining: 50,
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
    const count = get().questionCountConfig;
    const roundsNeeded = count === 15 ? 3 : count === 10 ? 2 : 1;
    const freshRounds = buildRounds(roundsNeeded);
    const firstRound = freshRounds[0];
    soundManager.startRailwayBgm(0.18);
    soundManager.playTrainHorn();
    setTimeout(() => {
      soundManager.playTrainBells(3000);
    }, 600);

    set((s) => ({
      phase: 'round-intro',
      totalRounds: roundsNeeded,
      rounds: freshRounds,
      currentRoundIndex: 0,
      questionIndexInRound: 0,
      activeChallenge: firstRound.questions[0],
      isTieBreak: false,
      blueTeam: { ...s.blueTeam, score: 0, roundScore: 0, streak: 0, correctAnswersCount: 0, roundCorrect: 0, roundsWon: 0, selectedAnswer: null, isLocked: false, lastResult: null, lastFeedback: null, attemptsLeft: 2 },
      redTeam: { ...s.redTeam, score: 0, roundScore: 0, streak: 0, correctAnswersCount: 0, roundCorrect: 0, roundsWon: 0, selectedAnswer: null, isLocked: false, lastResult: null, lastFeedback: null, attemptsLeft: 2 },
      roundWinner: null,
      matchWinner: null,
      signalsGreenCount: 0,
      onboardPassengers: [],
      signalBlue: 'red',
      signalRed: 'red',
      signal1Blue: 'red',
      signal2Blue: 'red',
      signal1Red: 'red',
      signal2Red: 'red',
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
      signal1Blue: 'red',
      signal2Blue: 'red',
      signal1Red: 'red',
      signal2Red: 'red',
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

  // ── First-Answerer & Rebound Engine (5-Step Incremental Train Advancement) ──
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

      const nextGreen = Math.min(5, state.signalsGreenCount + 1);
      const { progress, signal1, signal2 } = computeStepProgressAndSignals(nextGreen);

      // Atmospheric Audio Schedule:
      // Q1: Move to station (bell)
      // Q2: Horn & Whistle blast (staying at station)
      // Q3: Horn & Loud Whistle blast + Signal 1 Green (staying at station)
      // Q4: Move to junction approach + Signal 2 Green
      if (nextGreen === 1) {
        soundManager.playTrainBells(2200);
      } else if (nextGreen === 2) {
        soundManager.playTrainHorn();
        setTimeout(() => soundManager.playTrainWhistle(), 500);
      } else if (nextGreen === 3) {
        soundManager.playSignalChange();
        soundManager.playTrainHorn();
        setTimeout(() => soundManager.playLoudWhistle(), 400);
      } else if (nextGreen === 4) {
        soundManager.playSignalChange();
        soundManager.playTrainHorn();
      }

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
        signalsGreenCount: nextGreen,
        signal1Blue: signal1,
        signal2Blue: signal2,
        signal1Red: signal1,
        signal2Red: signal2,
        signalBlue: signal2,
        signalRed: signal2,
        blueTrain: {
          ...s.blueTrain,
          progress,
          speed: nextGreen === 1 || nextGreen >= 4 ? 0.85 : 0,
          smokeActive: true,
          whistleActive: nextGreen === 2 || nextGreen === 3,
        },
        redTrain: {
          ...s.redTrain,
          progress,
          speed: nextGreen === 1 || nextGreen >= 4 ? 0.85 : 0,
          smokeActive: true,
          whistleActive: nextGreen === 2 || nextGreen === 3,
        },
        onboardPassengers: [...s.onboardPassengers, newPassenger],
        toastMessage:
          nextGreen === 1
            ? `🚂 ${s[key].name} ANSWERED! TRAIN ARRIVING AT STATION PLATFORM!`
            : nextGreen === 2
              ? `📢 ${s[key].name} PASSENGER BOARDED — BLOWING STEAM HORN AT STATION!`
              : nextGreen === 3
                ? `🟢 SIGNAL 1 GREEN! STEAM WHISTLE ECHOES THROUGH THE VALLEY!`
                : nextGreen === 4
                  ? `🟢 SIGNAL 2 GREEN! TRAINS MOVE UP TO SWITCH APPROACH!`
                  : `👥 ${s[key].name} PASSENGER BOARDED! ROUTE READY!`,
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
      // ── WRONG ANSWER: CHECK ATTEMPTS REMAINING (2 ATTEMPTS PER TEAM) ──
      soundManager.playWrong();

      if (teamState.attemptsLeft > 1) {
        // 1st Mistake: Allow 2nd Attempt Retry!
        set((s) => ({
          [key]: {
            ...s[key],
            attemptsLeft: 1,
            selectedAnswer: null,
            isLocked: false,
            lastFeedback: {
              message: `⚠️ INCORRECT — 1 TRY REMAINING!`,
              isCorrect: false,
              pointsEarned: 0,
            },
          },
          toastMessage: `⚠️ ${s[key].name} INCORRECT — 1 ATTEMPT REMAINING!`,
        }));
      } else {
        // 2nd Mistake: Full Lockout & Rebound Opportunity for 2nd Team!
        set((s) => ({
          [key]: {
            ...s[key],
            attemptsLeft: 0,
            isLocked: true,
            lastResult: 'wrong',
            lastFeedback: {
              message: `❌ WRONG ANSWER — LOCKED OUT`,
              isCorrect: false,
              pointsEarned: 0,
            },
          },
          toastMessage: `❌ ${s[key].name} OUT OF ATTEMPTS! ${s[otherKey].name} CAN REBOUND!`,
        }));

        // If the other team was ALREADY locked out (both exhausted turns), end question!
        if (otherTeamState.isLocked) {
          const nextGreen = Math.min(5, state.signalsGreenCount + 1);
          const { progress, signal1, signal2 } = computeStepProgressAndSignals(nextGreen);

          if (nextGreen === 1) {
            soundManager.playTrainBells(2200);
          } else if (nextGreen === 2) {
            soundManager.playTrainHorn();
            setTimeout(() => soundManager.playTrainWhistle(), 500);
          } else if (nextGreen === 3) {
            soundManager.playSignalChange();
            soundManager.playTrainHorn();
            setTimeout(() => soundManager.playLoudWhistle(), 400);
          } else if (nextGreen === 4) {
            soundManager.playSignalChange();
            soundManager.playTrainHorn();
          }

          set({
            timerActive: false,
            signalsGreenCount: nextGreen,
            signal1Blue: signal1,
            signal2Blue: signal2,
            signal1Red: signal1,
            signal2Red: signal2,
            signalBlue: signal2,
            signalRed: signal2,
            blueTrain: {
              ...state.blueTrain,
              progress,
              speed: nextGreen === 1 || nextGreen >= 4 ? 0.85 : 0,
              smokeActive: true,
              whistleActive: nextGreen === 2 || nextGreen === 3,
            },
            redTrain: {
              ...state.redTrain,
              progress,
              speed: nextGreen === 1 || nextGreen >= 4 ? 0.85 : 0,
              smokeActive: true,
              whistleActive: nextGreen === 2 || nextGreen === 3,
            },
          });
          setTimeout(() => {
            set({ phase: 'question-reveal', timerActive: false });
          }, 600);
        }
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

    const nextGreen = Math.min(5, state.signalsGreenCount + 1);
    const { progress, signal1, signal2 } = computeStepProgressAndSignals(nextGreen);

    if (nextGreen === 1) {
      soundManager.playTrainBells(2200);
    } else if (nextGreen === 2) {
      soundManager.playTrainHorn();
      setTimeout(() => soundManager.playTrainWhistle(), 500);
    } else if (nextGreen === 3) {
      soundManager.playSignalChange();
      soundManager.playTrainHorn();
      setTimeout(() => soundManager.playLoudWhistle(), 400);
    } else if (nextGreen === 4) {
      soundManager.playSignalChange();
      soundManager.playTrainHorn();
    }

    // 0 points for both when timer expires with no correct answer, but step advances
    set((s) => ({
      blueTeam: { ...s.blueTeam, isLocked: true },
      redTeam: { ...s.redTeam, isLocked: true },
      signalsGreenCount: nextGreen,
      signal1Blue: signal1,
      signal2Blue: signal2,
      signal1Red: signal1,
      signal2Red: signal2,
      signalBlue: signal2,
      signalRed: signal2,
      blueTrain: {
        ...s.blueTrain,
        progress,
        speed: nextGreen === 1 || nextGreen >= 4 ? 0.85 : 0,
        smokeActive: true,
        whistleActive: nextGreen === 2 || nextGreen === 3,
      },
      redTrain: {
        ...s.redTrain,
        progress,
        speed: nextGreen === 1 || nextGreen >= 4 ? 0.85 : 0,
        smokeActive: true,
        whistleActive: nextGreen === 2 || nextGreen === 3,
      },
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
      blueTrain: {
        ...s.blueTrain,
        whistleActive: false,
      },
      redTrain: {
        ...s.redTrain,
        whistleActive: false,
      },
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
      signal1Blue: 'green',
      signal2Blue: isBlue ? 'yellow' : 'red',
      signal1Red: 'green',
      signal2Red: !isBlue ? 'yellow' : 'red',
      signalBlue: isBlue ? 'yellow' : 'red',
      signalRed: !isBlue ? 'yellow' : 'red',
      switchTarget: 'neutral',
      toastMessage: `🛑 BOTH TRAINS AT JUNCTION — CLEARING ROUTE FOR ${winnerName}`,
    });

    // 1. Throw switch lever toward winner (after 1.2s)
    setTimeout(() => {
      soundManager.playSwitchMechanism();
      set({
        showdownStep: 'switching',
        switchTarget: winner,
        toastMessage: `⚙️ JUNCTION SWITCH THROWN ➔ ${winnerName} EXPRESS LINE`,
      });
    }, 1200);

    // 2. Winner signal turns YELLOW (after 2.5s)
    setTimeout(() => {
      soundManager.playSignalChange();
      set((s) => ({
        showdownStep: 'signal-yellow',
        [isBlue ? 'signal2Blue' : 'signal2Red']: 'yellow',
        [isBlue ? 'signalBlue' : 'signalRed']: 'yellow',
        toastMessage: `🟡 SIGNAL 2 YELLOW — PRE-CLEARED FOR ${winnerName}`,
      }));
    }, 2500);

    // 3. Winner signal turns GREEN & Loud Whistle blows (after 3.8s)
    setTimeout(() => {
      soundManager.playSignalChange();
      soundManager.playLoudWhistle();
      set((s) => ({
        showdownStep: 'signal-green',
        [isBlue ? 'signal2Blue' : 'signal2Red']: 'green',
        [isBlue ? 'signalBlue' : 'signalRed']: 'green',
        toastMessage: `🟢 SIGNAL GREEN! ${winnerName} AUTHORIZED TO DEPART!`,
      }));
    }, 3800);

    // 4. Train departs from junction switch (0.18) and travels down the scenic line (after 5.0s)
    setTimeout(() => {
      soundManager.playTrainRunningAudio();

      set((s) => ({
        showdownStep: 'departing',
        toastMessage: `🚂 ${winnerName} EXPRESS ROARING DOWN THE LINE!`,
        [isBlue ? 'blueTrain' : 'redTrain']: {
          ...s[isBlue ? 'blueTrain' : 'redTrain'],
          progress: 0.18,
          speed: 1,
          state: 'departing',
          smokeActive: true,
          whistleActive: true,
          headlampOn: true,
        },
      }));

      let prog = 0.18;
      let tick = 0;
      travelInterval = setInterval(() => {
        tick++;
        prog += (1.0 - 0.18) / 160; // Smooth 8-second cinematic ride

        // Loud whistle blasts 2 times spaced at intervals during train movement!
        if (tick === 50 || tick === 105) {
          soundManager.playLoudWhistle();
        }

        const normT = (prog - 0.18) / (1.0 - 0.18);
        const spd = normT < 0.15 ? normT * 6.6 : normT > 0.85 ? (1 - normT) * 6.6 : 1;

        set((s) => ({
          [isBlue ? 'blueTrain' : 'redTrain']: {
            ...s[isBlue ? 'blueTrain' : 'redTrain'],
            progress: Math.min(1, prog),
            speed: Math.max(0.5, spd),
            state: prog >= 0.92 ? 'approaching' : 'moving',
          },
        }));

        if (prog >= 1.0) {
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
              progress: 1.0,
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
