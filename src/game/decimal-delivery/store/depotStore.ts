// ============================================================
// THE DECIMAL DELIVERY NETWORK — GAME STATE
//
// Zustand, matching the rest of the Arcade. The defining constraint here is
// that BLUE AND RED ARE COMPLETELY INDEPENDENT: separate orders, separate
// keypad buffers, separate balances, separate phases. There is no shared
// "current answer" anywhere, so one player submitting can never interrupt or
// block the other mid-entry.
//
// Physical movement lives in engine/depotSim.ts and is stepped per frame; this
// store only holds game state and is written at human speed.
// ============================================================

'use client';

import { create } from 'zustand';
import type {
  DeliveryOrder, GamePhase, MatchResult, RoundNumber, TeamId, TeamState,
} from '../types';
import {
  generateOrder, generateTieBreaker, answersMatch, roundTo, ROUND_TITLES,
} from '../engine/questionEngine';
import {
  spawnParcel, acceptAnswer, rejectAnswer, resetSim, departTruck,
  setParcelLoadedHandler,
} from '../engine/depotSim';

/** Orders each team must complete before the round advances. */
const ORDERS_PER_ROUND = 3;
/** Maximum digits a student can type, so the field can never overflow. */
const MAX_INPUT_LENGTH = 8;

function makeTeam(id: TeamId, name: string): TeamState {
  return {
    id, name,
    phase: 'idle',
    currentOrder: null,
    input: '',
    lastWrong: false,
    attempts: 0,
    balance: 0,
    ordersCompleted: 0,
    truckLoad: 0,
    loadedWeight: 0,
    rewardFlash: null,
  };
}

interface DepotState {
  phase: GamePhase;
  round: RoundNumber;
  blue: TeamState;
  red: TeamState;
  result: MatchResult | null;
  /** Set during the tie-break so both consoles show the same express order. */
  tieBreakWinner: TeamId | null;
  muted: boolean;

  // ── actions ──
  startGame: () => void;
  beginRound: (round: RoundNumber) => void;
  requestOrder: (team: TeamId) => void;

  pressKey: (team: TeamId, key: string) => void;
  clearInput: (team: TeamId) => void;
  backspace: (team: TeamId) => void;
  submit: (team: TeamId) => void;

  /** Called by the simulation the moment a parcel is physically in the truck. */
  completeLoad: (team: TeamId) => void;

  finishMatch: () => void;
  runDispatch: () => void;
  toggleMute: () => void;
  resetGame: () => void;
}

export const useDepotStore = create<DepotState>((set, get) => ({
  phase: 'intro',
  round: 1,
  blue: makeTeam('blue', 'BLUE LOGISTICS'),
  red: makeTeam('red', 'RED LOGISTICS'),
  result: null,
  tieBreakWinner: null,
  muted: false,

  startGame: () => {
    set({ phase: 'round_intro', round: 1 });
    // Short beat on the round card, then both depots open for business.
    setTimeout(() => get().beginRound(1), 2600);
  },

  beginRound: (round) => {
    set({ phase: 'operating', round });
    // Both sides receive their first order of the round immediately and
    // independently — neither waits on the other.
    get().requestOrder('blue');
    get().requestOrder('red');
  },

  requestOrder: (team) => {
    const st = get();
    if (st.phase !== 'operating' && st.phase !== 'tie_breaker') return;

    const teamState = team === 'blue' ? st.blue : st.red;
    const order = st.phase === 'tie_breaker'
      ? generateTieBreaker()
      : generateOrder(st.round, teamState.ordersCompleted % ORDERS_PER_ROUND);

    set((s) => ({
      [team]: {
        ...(team === 'blue' ? s.blue : s.red),
        currentOrder: order,
        input: '',
        lastWrong: false,
        attempts: 0,
        phase: 'incoming',
      },
    } as unknown as Partial<DepotState>));

    // The forklift physically brings the parcel in. The console only becomes
    // live once it has actually landed on the scale.
    spawnParcel(team, order.shape, order.weightKg, hashColor(order.destination.code));
    setTimeout(() => {
      set((s) => {
        const t = team === 'blue' ? s.blue : s.red;
        if (t.phase !== 'incoming') return {};
        return { [team]: { ...t, phase: 'answering' } } as unknown as Partial<DepotState>;
      });
    }, 2700);
  },

  // ── KEYPAD ────────────────────────────────────────────────────────────────
  // Every guard here exists so rapid taps on a classroom touchscreen cannot
  // produce malformed input like "..5" or a 20-digit number.

  pressKey: (team, key) => {
    set((s) => {
      const t = team === 'blue' ? s.blue : s.red;
      if (t.phase !== 'answering') return {};

      let next = t.input;
      if (key === '.') {
        if (next.includes('.')) return {};        // only one decimal point
        next = next === '' ? '0.' : next + '.';   // leading "." becomes "0."
      } else {
        if (next.replace('.', '').length >= MAX_INPUT_LENGTH) return {};
        // Avoid "007" while still allowing "0.5".
        if (next === '0') next = key;
        else next = next + key;
      }
      return { [team]: { ...t, input: next, lastWrong: false } } as unknown as Partial<DepotState>;
    });
  },

  clearInput: (team) => set((s) => {
    const t = team === 'blue' ? s.blue : s.red;
    if (t.phase !== 'answering') return {};
    return { [team]: { ...t, input: '', lastWrong: false } } as unknown as Partial<DepotState>;
  }),

  backspace: (team) => set((s) => {
    const t = team === 'blue' ? s.blue : s.red;
    if (t.phase !== 'answering') return {};
    return { [team]: { ...t, input: t.input.slice(0, -1), lastWrong: false } } as unknown as Partial<DepotState>;
  }),

  submit: (team) => {
    const st = get();
    const t = team === 'blue' ? st.blue : st.red;
    const order = t.currentOrder;

    // Guards: nothing to submit, not this team's turn to answer, or the field
    // holds something that is not a usable number ("", ".", "3.").
    if (!order || t.phase !== 'answering') return;
    const trimmed = t.input.endsWith('.') ? t.input.slice(0, -1) : t.input;
    if (trimmed === '' || trimmed === '-') return;
    const value = Number(trimmed);
    if (!Number.isFinite(value)) return;

    if (answersMatch(value, order.correctAnswer, order.decimals)) {
      // CORRECT — hand off to the physical chain. Money is NOT awarded here;
      // it is awarded when the parcel actually reaches the truck, so the
      // number on screen and the box in the world stay in step.
      set((s) => {
        const cur = team === 'blue' ? s.blue : s.red;
        return { [team]: { ...cur, phase: 'processing', lastWrong: false } } as unknown as Partial<DepotState>;
      });
      acceptAnswer(team);
    } else {
      // INCORRECT — the machine simply refuses to run. No money lost, no round
      // reset, and the student can correct the field and try again.
      set((s) => {
        const cur = team === 'blue' ? s.blue : s.red;
        return {
          [team]: { ...cur, lastWrong: true, attempts: cur.attempts + 1 },
        } as unknown as Partial<DepotState>;
      });
      rejectAnswer(team);
    }
  },

  // ── ORDER COMPLETION ──────────────────────────────────────────────────────

  completeLoad: (team) => {
    const st = get();
    const t = team === 'blue' ? st.blue : st.red;
    const order = t.currentOrder;
    if (!order) return;

    const reward = order.reward;
    const completed = t.ordersCompleted + 1;

    set((s) => {
      const cur = team === 'blue' ? s.blue : s.red;
      return {
        [team]: {
          ...cur,
          phase: 'idle',
          currentOrder: null,
          input: '',
          balance: roundTo(cur.balance + reward, 2),
          ordersCompleted: completed,
          loadedWeight: roundTo(cur.loadedWeight + order.weightKg, 2),
          truckLoad: Math.min(1, completed / (ORDERS_PER_ROUND * 5)),
          rewardFlash: { amount: reward, at: Date.now() },
        },
      } as unknown as Partial<DepotState>;
    });

    // Tie-break: the first team to land a correct express parcel takes it.
    if (st.phase === 'tie_breaker') {
      if (!get().tieBreakWinner) {
        set({ tieBreakWinner: team });
        setTimeout(() => get().runDispatch(), 1200);
      }
      return;
    }

    // Advance the round only when BOTH teams have finished their quota, so
    // neither side is cut off mid-order.
    const after = get();
    const blueDone = after.blue.ordersCompleted >= ORDERS_PER_ROUND * after.round;
    const redDone = after.red.ordersCompleted >= ORDERS_PER_ROUND * after.round;

    if (blueDone && redDone) {
      if (after.round >= 5) {
        setTimeout(() => get().finishMatch(), 1400);
      } else {
        const next = (after.round + 1) as RoundNumber;
        set({ phase: 'round_complete' });
        setTimeout(() => {
          set({ phase: 'round_intro', round: next });
          setTimeout(() => get().beginRound(next), 2400);
        }, 1600);
      }
      return;
    }

    // Otherwise this team simply takes its next order — independently.
    setTimeout(() => {
      if (get().phase === 'operating') get().requestOrder(team);
    }, 900);
  },

  // ── ENDGAME ───────────────────────────────────────────────────────────────

  finishMatch: () => {
    const { blue, red } = get();
    const b = roundTo(blue.balance, 2);
    const r = roundTo(red.balance, 2);

    if (Math.abs(b - r) < 0.005) {
      // Genuine tie: settle it with one express order rather than picking a
      // winner arbitrarily.
      set({ phase: 'tie_breaker', tieBreakWinner: null });
      get().requestOrder('blue');
      get().requestOrder('red');
      return;
    }

    set({
      phase: 'final_results',
      result: { winner: b > r ? 'blue' : 'red', blueBalance: b, redBalance: r },
    });
    setTimeout(() => get().runDispatch(), 4200);
  },

  runDispatch: () => {
    const st = get();
    const winner: TeamId =
      st.tieBreakWinner ??
      (st.result?.winner === 'red' ? 'red' : 'blue');

    set({
      phase: 'dispatch_showdown',
      result: st.result ?? {
        winner,
        blueBalance: roundTo(st.blue.balance, 2),
        redBalance: roundTo(st.red.balance, 2),
      },
    });

    // The winning truck physically drives out. The loser stays in its bay.
    departTruck(winner);
    setTimeout(() => set({ phase: 'game_complete' }), 11000);
  },

  toggleMute: () => set((s) => ({ muted: !s.muted })),

  resetGame: () => {
    // Full restart: no stale parcels, worker tasks, truck positions or money.
    resetSim();
    set({
      phase: 'intro',
      round: 1,
      blue: makeTeam('blue', 'BLUE LOGISTICS'),
      red: makeTeam('red', 'RED LOGISTICS'),
      result: null,
      tieBreakWinner: null,
    });
  },
}));

/** Stable colour index per destination so lanes read consistently. */
function hashColor(code: string): number {
  let h = 0;
  for (let i = 0; i < code.length; i++) h = (h * 31 + code.charCodeAt(i)) >>> 0;
  return h % 6;
}

export { ORDERS_PER_ROUND, ROUND_TITLES };

// The simulation awards the order at the instant the parcel lands in the
// truck. Wired once at module load.
setParcelLoadedHandler((team) => {
  useDepotStore.getState().completeLoad(team);
});
