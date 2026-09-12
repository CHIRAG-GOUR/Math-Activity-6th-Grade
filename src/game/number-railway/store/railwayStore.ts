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
import { initialBoostManager } from '@/utils/initialBoost';
import { TeamPowerUps, initialTeamPowerUps } from '@/types/powerUps';
import { getMisconceptionHint } from '@/utils/misconceptions';

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
  progress: 0.04,
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
  setQuestionCountConfig: (count: 5 | 10 | 15 | 20) => void;
  setTotalRounds: (n: number) => void;
  startGame: () => void;
  startRound: (index: number) => void;
  beginChallenge: () => void;

  setTeamAnswer: (team: TeamId, answer: number | string) => void;
  lockInTeam: (team: TeamId) => void;
  handleTimerExpired: () => void;
  advanceQuestion: () => void;

  // Tactical Power-up Actions (1 per match per team)
  usePowerUp5050: (team: TeamId) => void;
  usePowerUpTimeFreeze: (team: TeamId) => void;
  usePowerUp2x: (team: TeamId) => void;

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

const computeTeamStepProgressAndSignals = (correctCount: number, totalQuestions: number = 5) => {
  let progress = 0.04;
  let signal1: SignalState = 'red';
  let signal2: SignalState = 'red';
  let milestone: 1 | 2 | 3 | 4 | 5 = 1;
  let isMoving = false;

  // ── Team-Specific 5-Step Progression (Moves to next step ONLY with right answers) ──
  // Correct 0: Staging yard (progress 0.04) — parked in clear view on spur
  // Correct 1: Enters station approach forward in frame (progress 0.095)
  // Correct 2: At station platform center (progress 0.145) + Signal 1 turns GREEN
  // Correct 3: Advances past station toward junction (progress 0.180) + Signal 2 turns YELLOW
  // Correct 4: At switch approach before junction (progress 0.205) + Signal 2 turns GREEN
  // Correct 5+: At switch line ready for route authorization (progress 0.220)
  if (correctCount <= 0) {
    milestone = 1;
    progress = 0.04;
    signal1 = 'red';
    signal2 = 'red';
    isMoving = false;
  } else if (correctCount === 1) {
    milestone = 1;
    progress = 0.095;
    signal1 = 'red';
    signal2 = 'red';
    isMoving = true;
  } else if (correctCount === 2) {
    milestone = 2;
    progress = 0.145;
    signal1 = 'green';
    signal2 = 'red';
    isMoving = true;
  } else if (correctCount === 3) {
    milestone = 3;
    progress = 0.180;
    signal1 = 'green';
    signal2 = 'yellow';
    isMoving = true;
  } else if (correctCount === 4) {
    milestone = 4;
    progress = 0.205;
    signal1 = 'green';
    signal2 = 'green';
    isMoving = true;
  } else {
    milestone = 5;
    signal1 = 'green';
    signal2 = 'green';
    progress = 0.220;
    isMoving = true;
  }

  return { progress, signal1, signal2, milestone, isMoving };
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

  // Tactical Power-ups & Misconceptions (1 per match per team)
  bluePowerUps: initialTeamPowerUps(),
  redPowerUps: initialTeamPowerUps(),
  blueMisconception: null,
  redMisconception: null,
  blueEliminatedOptions: [],
  redEliminatedOptions: [],

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
    set((s) => ({ [key]: { ...s[key], name } }));
  },

  setQuestionCountConfig: (cnt) => {
    soundManager.playClick();
    set({ questionCountConfig: cnt });
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
    const roundsNeeded = count === 20 ? 4 : count === 15 ? 3 : count === 10 ? 2 : 1;
    const freshRounds = buildRounds(roundsNeeded);
    const firstRound = freshRounds[0];
    soundManager.startRailwayBgm(0.40);
    soundManager.playTrainHorn();
    setTimeout(() => {
      soundManager.playTrainBells(3000);
    }, 600);

    // Initial Boost Check
    const boost = initialBoostManager.getBoost();
    const isBlueBoosted = boost?.winnerId === 'blue';
    const isRedBoosted = boost?.winnerId === 'red';

    const bluePassengers: OnboardPassenger[] = isBlueBoosted ? [{ id: 'boost-blue-p1', team: 'blue', seatIndex: 0 }] : [];
    const redPassengers: OnboardPassenger[] = isRedBoosted ? [{ id: 'boost-red-p1', team: 'red', seatIndex: 0 }] : [];
    const initialPassengers = [...bluePassengers, ...redPassengers];

    let toastText: string | null = null;
    if (boost) {
      const winnerTeamName = boost.winnerId === 'blue' ? get().blueTeam.name : get().redTeam.name;
      toastText = `⚡ INITIAL BOOST: ${winnerTeamName} starts +1 Correct Answer & 1 Step Ahead from winning ${boost.gameTitle}!`;
    }

    set((s) => ({
      phase: 'round-intro',
      totalRounds: roundsNeeded,
      rounds: freshRounds,
      currentRoundIndex: 0,
      questionIndexInRound: 0,
      activeChallenge: firstRound.questions[0],
      isTieBreak: false,
      bluePowerUps: initialTeamPowerUps(),
      redPowerUps: initialTeamPowerUps(),
      blueMisconception: null,
      redMisconception: null,
      blueEliminatedOptions: [],
      redEliminatedOptions: [],
      blueTeam: {
        ...s.blueTeam,
        score: isBlueBoosted ? 100 : 0,
        roundScore: isBlueBoosted ? 100 : 0,
        streak: isBlueBoosted ? 1 : 0,
        correctAnswersCount: isBlueBoosted ? 1 : 0,
        roundCorrect: isBlueBoosted ? 1 : 0,
        roundsWon: 0,
        selectedAnswer: null,
        isLocked: false,
        lastResult: null,
        lastFeedback: null,
        attemptsLeft: 2,
      },
      redTeam: {
        ...s.redTeam,
        score: isRedBoosted ? 100 : 0,
        roundScore: isRedBoosted ? 100 : 0,
        streak: isRedBoosted ? 1 : 0,
        correctAnswersCount: isRedBoosted ? 1 : 0,
        roundCorrect: isRedBoosted ? 1 : 0,
        roundsWon: 0,
        selectedAnswer: null,
        isLocked: false,
        lastResult: null,
        lastFeedback: null,
        attemptsLeft: 2,
      },
      roundWinner: null,
      matchWinner: null,
      signalsGreenCount: (isBlueBoosted || isRedBoosted) ? 1 : 0,
      onboardPassengers: initialPassengers,
      signalBlue: 'red',
      signalRed: 'red',
      signal1Blue: 'red',
      signal2Blue: 'red',
      signal1Red: 'red',
      signal2Red: 'red',
      switchTarget: 'neutral',
      showdownStep: 'idle',
      activeRoute: null,
      blueTrain: isBlueBoosted ? { ...idleTrain(), progress: 0.095, state: 'moving' } : idleTrain(),
      redTrain: isRedBoosted ? { ...idleTrain(), progress: 0.095, state: 'moving' } : idleTrain(),
      unlockedStationIds: [NETWORK_STATIONS[0].id],
      timeRemaining: firstRound.questions[0].timeLimit,
      timerActive: false,
      toastMessage: toastText,
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
      bluePowerUps: { ...s.bluePowerUps, active2x: false },
      redPowerUps: { ...s.redPowerUps, active2x: false },
      blueMisconception: null,
      redMisconception: null,
      blueEliminatedOptions: [],
      redEliminatedOptions: [],
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
      bluePowerUps: { ...s.bluePowerUps, active2x: false },
      redPowerUps: { ...s.redPowerUps, active2x: false },
      blueMisconception: null,
      redMisconception: null,
      blueEliminatedOptions: [],
      redEliminatedOptions: [],
    }));
  },

  setTeamAnswer: (team, answer) => {
    const key = team === 'blue' ? 'blueTeam' : 'redTeam';
    soundManager.playClick();
    set((s) => ({
      [key]: { ...s[key], selectedAnswer: answer },
    }));
  },

  // ── First-Answerer & Rebound Engine (Independent Train Advancement on Correct Answer) ──
  lockInTeam: (team) => {
    const state = get();
    const ch = state.activeChallenge;
    if (!ch || (state.phase !== 'challenge' && state.phase !== 'tie-break')) return;

    const isBlue = team === 'blue';
    const key = isBlue ? 'blueTeam' : 'redTeam';
    const otherKey = isBlue ? 'redTeam' : 'blueTeam';
    const teamState = state[key];
    const otherTeamState = state[otherKey];

    if (teamState.isLocked || teamState.selectedAnswer === null) return;

    soundManager.playClick();
    const isCorrect = ch.validation(teamState.selectedAnswer);

    if (isCorrect) {
      // ── WINNING ANSWER: ONLY THIS TEAM'S TRAIN ADVANCES ──
      soundManager.playCorrect();
      const speedBonus = Math.max(0, Math.floor(state.timeRemaining * 1.5));
      let pointsGained = ch.points + speedBonus;

      // Apply Comeback Surge (+25%) if trailing by 2+ correct answers or behind by 150+ pts
      const isComeback = isBlue
        ? (otherTeamState.roundCorrect - teamState.roundCorrect >= 2 || otherTeamState.score - teamState.score >= 150)
        : (otherTeamState.roundCorrect - teamState.roundCorrect >= 2 || otherTeamState.score - teamState.score >= 150);
      if (isComeback) {
        pointsGained = Math.round(pointsGained * 1.25);
      }

      // Apply 2x Multiplier Power-up if armed
      const teamPower = isBlue ? state.bluePowerUps : state.redPowerUps;
      if (teamPower.active2x) {
        pointsGained = pointsGained * 2;
      }

      const newStreak = teamState.streak + 1;
      const newTeamCorrect = teamState.roundCorrect + 1;

      // Add a passenger in this team's color inside the coach!
      const nextSeat = state.onboardPassengers.length;
      const newPassenger: OnboardPassenger = {
        id: `pass-${team}-${nextSeat}`,
        team,
        seatIndex: nextSeat,
      };

      const totalQInRound = state.rounds[state.currentRoundIndex]?.questions.length || 5;
      const teamStep = computeTeamStepProgressAndSignals(newTeamCorrect, totalQInRound);
      const nextGreenCount = Math.min(totalQInRound, state.signalsGreenCount + 1);

      // Trigger Milestone Audio for the advancing team
      if (teamStep.milestone === 1) {
        soundManager.playTrainHorn();
      } else if (teamStep.milestone === 2) {
        soundManager.playTrainBells(2500);
        soundManager.playTrainHorn();
      } else if (teamStep.milestone === 3) {
        soundManager.playSteamRelease();
        soundManager.playTrainHorn();
      } else if (teamStep.milestone >= 4) {
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
          roundCorrect: newTeamCorrect,
          lastScoreGained: pointsGained,
          lastFeedback: {
            message: `✅ CORRECT! +${pointsGained} PTS${isComeback ? ' 🔥 COMEBACK SURGE!' : ''}${teamPower.active2x ? ' 💥 2X MULTIPLIER!' : ''}`,
            isCorrect: true,
            pointsEarned: pointsGained,
          },
        },
        [otherKey]: {
          ...s[otherKey],
          isLocked: true, // Question claimed by first correct answerer!
        },
        signalsGreenCount: nextGreenCount,
        // Update ONLY the winning team's train and signals! The other team's train stays in place!
        ...(isBlue
          ? {
              signal1Blue: teamStep.signal1,
              signal2Blue: teamStep.signal2,
              signalBlue: teamStep.signal2,
              blueTrain: {
                ...s.blueTrain,
                progress: teamStep.progress,
                speed: teamStep.isMoving ? 0.85 : 0,
                smokeActive: true,
                whistleActive: teamStep.milestone === 1 || teamStep.milestone === 3,
              },
              redTrain: {
                ...s.redTrain,
                speed: 0,
                whistleActive: false,
              },
            }
          : {
              signal1Red: teamStep.signal1,
              signal2Red: teamStep.signal2,
              signalRed: teamStep.signal2,
              redTrain: {
                ...s.redTrain,
                progress: teamStep.progress,
                speed: teamStep.isMoving ? 0.85 : 0,
                smokeActive: true,
                whistleActive: teamStep.milestone === 1 || teamStep.milestone === 3,
              },
              blueTrain: {
                ...s.blueTrain,
                speed: 0,
                whistleActive: false,
              },
            }),
        onboardPassengers: [...s.onboardPassengers, newPassenger],
        toastMessage:
          teamStep.milestone === 1
            ? `🚂 ${s[key].name} EXPRESS ADVANCES FORWARD INTO VIEW!`
            : teamStep.milestone === 2
              ? `🚉 ${s[key].name} ADVANCES TO STATION PLATFORM! SIGNAL 1 GREEN!`
              : teamStep.milestone === 3
                ? `💨 ${s[key].name} ADVANCES PAST STATION! SIGNAL 2 PRE-CLEARED!`
                : teamStep.milestone === 4
                  ? `🟢 ${s[key].name} ADVANCES TO JUNCTION SWITCH! SIGNAL 2 GREEN!`
                  : `🏁 ${s[key].name} POISED AT JUNCTION SWITCH FOR DEPARTURE!`,
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
        // 1st Mistake: Allow 2nd Attempt Retry with targeted misconception hint!
        const hint = getMisconceptionHint('numbers', ch.prompt);
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
          [isBlue ? 'blueMisconception' : 'redMisconception']: hint,
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

        // If the other team was ALREADY locked out (both exhausted turns), end question! Neither train moves!
        if (otherTeamState.isLocked) {
          const totalQInRound = state.rounds[state.currentRoundIndex]?.questions.length || 5;
          const nextGreen = Math.min(totalQInRound, state.signalsGreenCount + 1);

          set((s) => ({
            timerActive: false,
            signalsGreenCount: nextGreen,
            blueTrain: {
              ...s.blueTrain,
              speed: 0,
              whistleActive: false,
            },
            redTrain: {
              ...s.redTrain,
              speed: 0,
              whistleActive: false,
            },
            toastMessage: `❌ BOTH TEAMS LOCKED OUT! TRAINS REMAIN PARKED.`,
          }));
          setTimeout(() => {
            set({ phase: 'question-reveal', timerActive: false });
          }, 600);
        }
      }
    }
  },

  // ── Tactical Power-up Actions (1 per match per team) ──
  usePowerUp5050: (team) => {
    const state = get();
    const ch = state.activeChallenge;
    if (!ch || (state.phase !== 'challenge' && state.phase !== 'tie-break')) return;
    const isBlue = team === 'blue';
    const powerUps = isBlue ? state.bluePowerUps : state.redPowerUps;
    if (!powerUps.fiftyFifty) return;

    // Eliminate up to 2 wrong options
    const wrongOpts = ch.options
      .filter((o) => !ch.validation(o.value) && String(o.value) !== String(ch.correctAnswer))
      .map((o) => o.value);
    const toEliminate = wrongOpts.slice(0, 2);

    soundManager.play('powerup');
    set((s) => ({
      [isBlue ? 'bluePowerUps' : 'redPowerUps']: {
        ...powerUps,
        fiftyFifty: false,
      },
      [isBlue ? 'blueEliminatedOptions' : 'redEliminatedOptions']: toEliminate,
      toastMessage: `🔍 50:50 ELIMINATOR ACTIVATED FOR ${s[isBlue ? 'blueTeam' : 'redTeam'].name}! 2 OPTIONS ELIMINATED!`,
    }));
  },

  usePowerUpTimeFreeze: (team) => {
    const state = get();
    if (state.phase !== 'challenge' && state.phase !== 'tie-break') return;
    const isBlue = team === 'blue';
    const powerUps = isBlue ? state.bluePowerUps : state.redPowerUps;
    if (!powerUps.timeFreeze) return;

    soundManager.play('powerup');
    set((s) => ({
      [isBlue ? 'bluePowerUps' : 'redPowerUps']: {
        ...powerUps,
        timeFreeze: false,
      },
      timeRemaining: s.timeRemaining + 10,
      toastMessage: `⏳ TIME FREEZE ACTIVATED! +10 SECONDS ADDED!`,
    }));
  },

  usePowerUp2x: (team) => {
    const state = get();
    if (state.phase !== 'challenge' && state.phase !== 'tie-break') return;
    const isBlue = team === 'blue';
    const powerUps = isBlue ? state.bluePowerUps : state.redPowerUps;
    if (!powerUps.doublePoints) return;

    soundManager.play('powerup');
    set((s) => ({
      [isBlue ? 'bluePowerUps' : 'redPowerUps']: {
        ...powerUps,
        doublePoints: false,
        active2x: true,
      },
      toastMessage: `💥 2X MULTIPLIER ARMED FOR ${s[isBlue ? 'blueTeam' : 'redTeam'].name}! DOUBLE POINTS ON NEXT WIN!`,
    }));
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

    // Normal round timer expired → lock both out & reveal
    const totalQInRound = state.rounds[state.currentRoundIndex]?.questions.length || 5;
    const nextGreen = Math.min(totalQInRound, state.signalsGreenCount + 1);

    set((s) => ({
      timerActive: false,
      signalsGreenCount: nextGreen,
      blueTeam: {
        ...s.blueTeam,
        isLocked: true,
        lastResult: 'wrong',
        lastFeedback: {
          message: '⌛ TIME EXPIRED — NO ANSWER',
          isCorrect: false,
          pointsEarned: 0,
        },
      },
      redTeam: {
        ...s.redTeam,
        isLocked: true,
        lastResult: 'wrong',
        lastFeedback: {
          message: '⌛ TIME EXPIRED — NO ANSWER',
          isCorrect: false,
          pointsEarned: 0,
        },
      },
      toastMessage: '⌛ TIME EXPIRED! NO TEAM AUTHORIZED.',
    }));

    setTimeout(() => {
      set({ phase: 'question-reveal', timerActive: false });
    }, 600);
  },

  advanceQuestion: () => {
    const state = get();
    const curRound = state.rounds[state.currentRoundIndex];
    if (!curRound) return;

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
      bluePowerUps: { ...s.bluePowerUps, active2x: false },
      redPowerUps: { ...s.redPowerUps, active2x: false },
      blueMisconception: null,
      redMisconception: null,
      blueEliminatedOptions: [],
      redEliminatedOptions: [],
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
      timeRemaining: 15, // 15-second rapid Sudden Death Speed Duel
      timerActive: true,
      toastMessage: '⚡ SUDDEN-DEATH SPEED DUEL (15s)! FIRST CORRECT WINS ROUTE!',
      blueTeam: clearTeamForQuestion(s.blueTeam),
      redTeam: clearTeamForQuestion(s.redTeam),
      bluePowerUps: { ...s.bluePowerUps, active2x: false },
      redPowerUps: { ...s.redPowerUps, active2x: false },
      blueMisconception: null,
      redMisconception: null,
      blueEliminatedOptions: [],
      redEliminatedOptions: [],
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
      toastMessage: `🚩 TICKET EXAMINER (TT) DECIDING DEPARTURE — BOTH TRAINS AT SWITCH...`,
    });

    // 1. Throw switch lever toward winner & TT waves Green flag (after 1.2s)
    setTimeout(() => {
      soundManager.playSwitchMechanism();
      set({
        showdownStep: 'switching',
        switchTarget: winner,
        toastMessage: `🚩 TT WAVES GREEN FLAG TOWARDS ${winnerName}! SWITCH THROWN!`,
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

    // 4. Train departs from junction switch and travels down the scenic line (after 5.0s)
    setTimeout(() => {
      soundManager.playTrainRunningAudio();

      const startProg = Math.max(0.20, get()[isBlue ? 'blueTrain' : 'redTrain'].progress);

      set((s) => ({
        showdownStep: 'departing',
        toastMessage: `🚂 ${winnerName} EXPRESS ROARING DOWN THE LINE!`,
        [isBlue ? 'blueTrain' : 'redTrain']: {
          ...s[isBlue ? 'blueTrain' : 'redTrain'],
          progress: startProg,
          speed: 1,
          state: 'departing',
          smokeActive: true,
          whistleActive: true,
          headlampOn: true,
        },
      }));

      let prog = startProg;
      let tick = 0;
      travelInterval = setInterval(() => {
        tick++;
        prog += (1.0 - startProg) / 160; // Smooth 8-second cinematic ride

        // Loud whistle blasts 2 times spaced at intervals during train movement!
        if (tick === 50 || tick === 105) {
          soundManager.playLoudWhistle();
        }

        const normT = Math.min(1.0, Math.max(0, (prog - startProg) / (1.0 - startProg)));
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

      if (matchWinner === 'blue') {
        initialBoostManager.recordWinner('blue', get().blueTeam.name, 'The Great Number Railway');
      } else if (matchWinner === 'red') {
        initialBoostManager.recordWinner('red', get().redTeam.name, 'The Great Number Railway');
      }

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
