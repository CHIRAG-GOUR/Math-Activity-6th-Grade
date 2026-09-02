// ============================================================
// THE GREAT NUMBER RAILWAY — Zustand Game Store
// Round-based loop with the cinematic RAILWAY SHOWDOWN:
//   5 challenges → showdown (quiet → switch → signal → depart → arrive)
//   → winner reveal → next round → network complete.
// Blue Team = LEFT.  Red Team = RIGHT.
// ============================================================

import { create } from 'zustand';
import {
  RailwayGameState,
  TeamState,
  TeamId,
  TrainAnimState,
  GamePhase,
  RoundWinner,
} from '../types';
import { ROUNDS, NETWORK_STATIONS, getTieBreaker, buildRounds } from '../engine/challenges';
import { soundManager } from '@/utils/audio';

const createTeamState = (id: TeamId): TeamState => ({
  id,
  name: id === 'blue' ? 'BLUE ENGINEERS' : 'RED ENGINEERS',
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

// Reset the per-round competitive fields but keep cumulative totals.
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

// Module-level timer handle for the winning-train travel loop.
let travelInterval: ReturnType<typeof setInterval> | null = null;
const clearTravel = () => {
  if (travelInterval) {
    clearInterval(travelInterval);
    travelInterval = null;
  }
};

interface RailwayActions {
  setPhase: (phase: GamePhase) => void;
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

  blueTeam: createTeamState('blue'),
  redTeam: createTeamState('red'),

  roundWinner: null,
  matchWinner: null,

  signalBlue: 'red',
  signalRed: 'red',
  switchTarget: 'neutral',
  showdownStep: 'idle',
  activeRoute: null,

  blueTrain: idleTrain(),
  redTrain: idleTrain(),

  stations: NETWORK_STATIONS,
  unlockedStationIds: [],
  totalRounds: 5,

  isMuted: false,
  timeRemaining: 35,
  timerActive: false,
  toastMessage: null,

  // ── Basic setters ──
  setPhase: (phase) => set({ phase }),
  setTotalRounds: (n) => set({ totalRounds: n }),
  toggleMute: () => {
    const next = !get().isMuted;
    soundManager.setMuted(next);
    set({ isMuted: next });
  },
  setTimeRemaining: (t) => set({ timeRemaining: Math.max(0, t) }),
  setTimerActive: (active) => set({ timerActive: active }),
  clearToast: () => set({ toastMessage: null }),

  // ── Match / round lifecycle ──
  startGame: () => {
    clearTravel();
    const total = get().totalRounds;
    const rounds = buildRounds(total);
    set({
      rounds,
      unlockedStationIds: [],
      matchWinner: null,
      blueTeam: createTeamState('blue'),
      redTeam: createTeamState('red'),
    });
    get().startRound(0);
  },

  startRound: (index) => {
    clearTravel();
    const round = get().rounds[index];
    const firstQ = round.questions[0];
    soundManager.playTrainWhistle();
    set((s) => ({
      phase: 'round-intro',
      currentRoundIndex: index,
      questionIndexInRound: 0,
      activeChallenge: firstQ,
      isTieBreak: false,
      roundWinner: null,
      signalBlue: 'red',
      signalRed: 'red',
      switchTarget: 'neutral',
      showdownStep: 'idle',
      activeRoute: null,
      blueTrain: idleTrain(),
      redTrain: idleTrain(),
      blueTeam: resetTeamForRound(s.blueTeam),
      redTeam: resetTeamForRound(s.redTeam),
      timeRemaining: firstQ.timeLimit,
      timerActive: false,
      toastMessage: `ROUND ${index + 1}: ${round.name}`,
    }));
    setTimeout(() => {
      if (get().phase !== 'round-intro') return;
      get().clearToast();
      get().beginChallenge();
    }, 2300);
  },

  beginChallenge: () => {
    const ch = get().activeChallenge;
    set({ phase: 'challenge', timeRemaining: ch?.timeLimit ?? 35, timerActive: true });
  },

  setTeamAnswer: (team, answer) => {
    const st = get();
    if (st.phase !== 'challenge' && st.phase !== 'tie-break') return;
    const key = team === 'blue' ? 'blueTeam' : 'redTeam';
    if (st[key].isLocked) return;
    soundManager.playClick();
    set((s) => ({ [key]: { ...s[key], selectedAnswer: answer } }));
  },

  lockInTeam: (team) => {
    const st = get();
    const ch = st.activeChallenge;
    if (!ch) return;
    if (st.phase !== 'challenge' && st.phase !== 'tie-break') return;
    const key = team === 'blue' ? 'blueTeam' : 'redTeam';
    const ts = st[key];
    if (ts.isLocked || ts.selectedAnswer === null) return;

    const isCorrect = ch.validation(ts.selectedAnswer);

    // TIE-BREAK: first correct wins the route; a wrong answer lets you retry.
    if (st.phase === 'tie-break') {
      if (isCorrect) {
        soundManager.playCorrect(true);
        set((s) => ({
          timerActive: false,
          [key]: { ...s[key], isLocked: true, lastResult: 'correct', lastFeedback: { message: 'FIRST! ROUTE WON!', isCorrect: true, pointsEarned: 0 } },
        }));
        get().runWinnerSequence(team);
      } else {
        soundManager.playWrong();
        set((s) => ({
          [key]: { ...s[key], selectedAnswer: null, lastResult: 'wrong', lastFeedback: { message: 'Not quite — try again!', isCorrect: false, pointsEarned: 0 } },
        }));
      }
      return;
    }

    // NORMAL question scoring
    soundManager.playClick();
    const speedBonus = isCorrect ? Math.max(0, Math.floor(st.timeRemaining * 1.2)) : 0;
    const gained = isCorrect ? ch.points + speedBonus : 0;
    if (isCorrect) soundManager.playCorrect(); else soundManager.playWrong();
    set((s) => {
      const t = s[key];
      return {
        [key]: {
          ...t,
          isLocked: true,
          lastResult: isCorrect ? 'correct' : 'wrong',
          score: t.score + gained,
          roundScore: t.roundScore + gained,
          streak: isCorrect ? t.streak + 1 : 0,
          correctAnswersCount: isCorrect ? t.correctAnswersCount + 1 : t.correctAnswersCount,
          roundCorrect: isCorrect ? t.roundCorrect + 1 : t.roundCorrect,
          lastScoreGained: gained,
          lastFeedback: { message: isCorrect ? `CORRECT  +${gained}` : 'WRONG', isCorrect, pointsEarned: gained },
        },
      };
    });

    const after = get();
    if (after.blueTeam.isLocked && after.redTeam.isLocked) {
      set({ timerActive: false, phase: 'question-reveal', toastMessage: ch.railwayEffect });
      setTimeout(() => { get().clearToast(); get().advanceQuestion(); }, 1900);
    }
  },

  handleTimerExpired: () => {
    const st = get();
    if (st.phase === 'challenge') {
      soundManager.playWrong();
      set((s) => ({
        timerActive: false,
        phase: 'question-reveal',
        toastMessage: s.activeChallenge?.railwayEffect ?? null,
        blueTeam: { ...s.blueTeam, isLocked: true, lastResult: s.blueTeam.lastResult ?? 'wrong' },
        redTeam: { ...s.redTeam, isLocked: true, lastResult: s.redTeam.lastResult ?? 'wrong' },
      }));
      setTimeout(() => { get().clearToast(); get().advanceQuestion(); }, 1900);
    } else if (st.phase === 'tie-break') {
      const w: TeamId = st.blueTeam.score >= st.redTeam.score ? 'blue' : 'red';
      get().runWinnerSequence(w);
    }
  },

  advanceQuestion: () => {
    const st = get();
    const round = st.rounds[st.currentRoundIndex];
    const nextQ = st.questionIndexInRound + 1;
    if (nextQ >= round.questions.length) {
      get().beginShowdown();
      return;
    }
    const nextCh = round.questions[nextQ];
    set((s) => ({
      questionIndexInRound: nextQ,
      activeChallenge: nextCh,
      phase: 'challenge',
      timeRemaining: nextCh.timeLimit,
      timerActive: true,
      blueTeam: clearTeamForQuestion(s.blueTeam),
      redTeam: clearTeamForQuestion(s.redTeam),
    }));
  },

  // ── The RAILWAY SHOWDOWN ──
  beginShowdown: () => {
    clearTravel();
    const st = get();
    const bs = st.blueTeam.roundScore;
    const rs = st.redTeam.roundScore;
    const winner: RoundWinner = bs > rs ? 'blue' : rs > bs ? 'red' : 'draw';
    set((s) => ({
      phase: 'showdown',
      showdownStep: 'quiet',
      roundWinner: winner,
      signalBlue: 'red',
      signalRed: 'red',
      switchTarget: 'neutral',
      activeRoute: null,
      timerActive: false,
      blueTeam: { ...s.blueTeam, isLocked: true },
      redTeam: { ...s.redTeam, isLocked: true },
      toastMessage: 'ROUTE DECISION',
    }));
    soundManager.playSignalChange();
    setTimeout(() => {
      const cur = get();
      if (cur.phase !== 'showdown') return;
      if (winner === 'draw') get().startTieBreak();
      else get().runWinnerSequence(winner);
    }, 1900);
  },

  startTieBreak: () => {
    const st = get();
    const tb = getTieBreaker(st.currentRoundIndex);
    soundManager.playTrainWhistle();
    set((s) => ({
      phase: 'tie-break',
      isTieBreak: true,
      activeChallenge: tb,
      showdownStep: 'quiet',
      timeRemaining: tb.timeLimit,
      timerActive: true,
      blueTeam: clearTeamForQuestion(s.blueTeam),
      redTeam: clearTeamForQuestion(s.redTeam),
      toastMessage: 'RAILWAY TIE — TIE-BREAK!',
    }));
    setTimeout(() => get().clearToast(), 1700);
  },

  runWinnerSequence: (winner) => {
    clearTravel();
    // STEP: throw the mechanical switch toward the winner
    set((s) => ({
      phase: 'showdown',
      roundWinner: winner,
      activeRoute: winner,
      isTieBreak: false,
      showdownStep: 'switching',
      switchTarget: winner,
      timerActive: false,
      toastMessage: winner === 'blue' ? 'SWITCHING TO BLUE ROUTE' : 'SWITCHING TO RED ROUTE',
    }));
    soundManager.playSwitchMechanism();

    setTimeout(() => {
      if (get().roundWinner !== winner) return;
      // STEP: signal RED → YELLOW
      if (winner === 'blue') set({ showdownStep: 'signal-yellow', signalBlue: 'yellow', toastMessage: null });
      else set({ showdownStep: 'signal-yellow', signalRed: 'yellow', toastMessage: null });
      soundManager.playSignalChange();

      setTimeout(() => {
        // STEP: signal YELLOW → GREEN
        if (winner === 'blue') set({ showdownStep: 'signal-green', signalBlue: 'green' });
        else set({ showdownStep: 'signal-green', signalRed: 'green' });
        soundManager.playSignalChange();

        setTimeout(() => {
          // STEP: winning train departs
          const trainKey = winner === 'blue' ? 'blueTrain' : 'redTrain';
          set((s) => ({
            showdownStep: 'departing',
            [trainKey]: { ...s[trainKey], state: 'departing' as const, smokeActive: true, whistleActive: true, headlampOn: true, speed: 0.2, progress: 0 },
            toastMessage: null,
          }));
          soundManager.playTrainWhistle();

          // Travel loop (~9s) along the winner's route curve
          let prog = 0;
          let ticks = 0;
          travelInterval = setInterval(() => {
            ticks++;
            prog += 1 / 180;
            if (ticks % 8 === 0 && prog < 0.9) soundManager.playTrainChug();
            if (ticks === 90) soundManager.playTrainWhistle();
            const speed = prog < 0.15 ? prog * 6 : prog > 0.85 ? Math.max(0.1, (1 - prog) * 6) : 1;
            const w = winner === 'blue' ? 'blueTrain' : 'redTrain';
            set((s) => ({
              [w]: { ...s[w], progress: Math.min(1, prog), speed, state: (prog >= 0.85 ? 'approaching' : 'moving') as 'approaching' | 'moving' },
            }));
            if (prog >= 1) {
              clearTravel();
              const st2 = get();
              const round = st2.rounds[st2.currentRoundIndex];
              const destId = round.destinationStationId;
              const winKey = winner === 'blue' ? 'blueTeam' : 'redTeam';
              soundManager.playTrainArrive();
              soundManager.playRailwayVictory();
              set((s) => ({
                phase: 'winner-reveal',
                showdownStep: 'arrived',
                unlockedStationIds: s.unlockedStationIds.includes(destId) ? s.unlockedStationIds : [...s.unlockedStationIds, destId],
                [winKey]: { ...s[winKey], roundsWon: s[winKey].roundsWon + 1 },
                [w]: { ...s[w], state: 'arrived' as const, progress: 1, speed: 0, whistleActive: false, smokeActive: false },
              }));
            }
          }, 50);
        }, 700);
      }, 850);
    }, 1500);
  },

  proceedToNextRound: () => {
    clearTravel();
    const st = get();
    const next = st.currentRoundIndex + 1;
    if (next >= st.totalRounds) {
      const b = st.blueTeam;
      const r = st.redTeam;
      const mw: RoundWinner =
        b.roundsWon > r.roundsWon ? 'blue'
          : r.roundsWon > b.roundsWon ? 'red'
            : b.score > r.score ? 'blue'
              : r.score > b.score ? 'red'
                : 'draw';
      soundManager.playRailwayVictory();
      set({ phase: 'network-complete', matchWinner: mw, showdownStep: 'idle' });
    } else {
      get().startRound(next);
    }
  },
}));
