// ============================================================
// THE DECIMAL DELIVERY NETWORK — GAME STATE
//
// Zustand, matching the rest of the Arcade.
//
// FOUR INDEPENDENT LANES: Blue A, Blue B, Red A, Red B. Each lane has its own
// ACTIVE order (the parcel on or heading for its scale) and a NEXT order
// queued on the belt behind it (section 66). Keypad buffers, attempts and
// status live per lane, so nothing one player does can interrupt the other —
// or even their own second belt.
//
// Two attempts per order, like the railway game. A first miss keeps the parcel
// on the scale for a retry; a second miss sends it down the reject chute.
//
// Money is only ever awarded when a parcel physically lands in the truck
// (sections 69, 103). Orders that have left the scale are tracked by parcel id
// in `inFlight`, so the reward always belongs to the exact box that arrived.
// ============================================================

'use client';

import { create } from 'zustand';
import type { DeliveryOrder, GamePhase, MatchResult, RoundNumber, TeamId } from '../types';
import { LANES, type LaneId } from '../engine/depotLayout';
import {
  generateOrder, generateTieBreaker, answersMatch, roundTo, formatValue, ROUND_TITLES,
} from '../engine/questionEngine';
import {
  spawnParcel, approveParcel, rejectParcel, refuseAnswer, resetSim,
  departTruck, closeTruck, setDepotHandlers,
} from '../engine/depotSim';
import { type TeamPowerUps, initialTeamPowerUps } from '@/types/powerUps';

/** Parcels each team processes per round (2 per belt). */
export const PARCELS_PER_ROUND = 4;
export const ATTEMPTS_PER_ORDER = 2;
const MAX_INPUT_LENGTH = 8;
/** A truck counts as full at this many deliveries (5 rounds x 4 parcels). */
export const TRUCK_CAPACITY = PARCELS_PER_ROUND * 5;

export type LaneStatus = 'empty' | 'incoming' | 'ready';

export interface LaneOrder {
  order: DeliveryOrder;
  parcelId: string;
}

export interface LaneState {
  lane: LaneId;
  /** Order whose parcel is on (or travelling to) this lane's scale. */
  active: LaneOrder | null;
  /** Order queued behind it on the belt. */
  next: LaneOrder | null;
  status: LaneStatus;
  input: string;
  attemptsLeft: number;
  lastWrong: boolean;
  hintShown: boolean;
  doubleArmed: boolean;
}

interface InFlight {
  order: DeliveryOrder;
  lane: LaneId;
  approved: boolean;
  doubleArmed: boolean;
}

export interface TeamState {
  id: TeamId;
  name: string;
  lanes: Record<LaneId, LaneState>;
  inFlight: Record<string, InFlight>;
  balance: number;
  ordersCompleted: number;
  ordersRejected: number;
  loadedWeight: number;
  truckLoad: number;
  powerUps: TeamPowerUps;
  spawnedThisRound: number;
  resolvedThisRound: number;
  /** Last completion, for the reward / order-lost toast. */
  lastResult: { kind: 'delivered' | 'rejected'; amount: number; orderId: string; at: number } | null;
}

function makeLane(lane: LaneId): LaneState {
  return {
    lane, active: null, next: null, status: 'empty', input: '',
    attemptsLeft: ATTEMPTS_PER_ORDER, lastWrong: false, hintShown: false, doubleArmed: false,
  };
}

function makeTeam(id: TeamId, name: string): TeamState {
  return {
    id, name,
    lanes: { A: makeLane('A'), B: makeLane('B') },
    inFlight: {},
    balance: 0,
    ordersCompleted: 0,
    ordersRejected: 0,
    loadedWeight: 0,
    truckLoad: 0,
    powerUps: initialTeamPowerUps(),
    spawnedThisRound: 0,
    resolvedThisRound: 0,
    lastResult: null,
  };
}

interface DepotState {
  phase: GamePhase;
  round: RoundNumber;
  blue: TeamState;
  red: TeamState;
  result: MatchResult | null;
  tieBreakWinner: TeamId | null;
  muted: boolean;

  startGame: () => void;
  beginRound: (round: RoundNumber) => void;
  topUpLane: (team: TeamId, lane: LaneId) => void;

  pressKey: (team: TeamId, lane: LaneId, key: string) => void;
  clearInput: (team: TeamId, lane: LaneId) => void;
  backspace: (team: TeamId, lane: LaneId) => void;
  submit: (team: TeamId, lane: LaneId) => void;

  useHint: (team: TeamId, lane: LaneId) => void;
  useExtraTry: (team: TeamId, lane: LaneId) => void;
  useDoublePay: (team: TeamId, lane: LaneId) => void;

  stationReady: (team: TeamId, lane: LaneId, parcelId: string) => void;
  parcelDelivered: (team: TeamId, parcelId: string) => void;
  parcelDiscarded: (team: TeamId, parcelId: string) => void;
  checkRoundProgress: () => void;

  finishMatch: () => void;
  runDispatch: () => void;
  toggleMute: () => void;
  resetGame: () => void;
}

const teamOf = (s: DepotState, team: TeamId) => (team === 'blue' ? s.blue : s.red);
const put = (team: TeamId, t: TeamState): Partial<DepotState> => (team === 'blue' ? { blue: t } : { red: t });

function patchLane(s: DepotState, team: TeamId, lane: LaneId, patch: Partial<LaneState>): Partial<DepotState> {
  const t = teamOf(s, team);
  return put(team, { ...t, lanes: { ...t.lanes, [lane]: { ...t.lanes[lane], ...patch } } });
}

/** Guards every round transition so a late timer from a previous game is ignored. */
let generation = 0;

function later(fn: () => void, ms: number) {
  const g = generation;
  setTimeout(() => { if (g === generation) fn(); }, ms);
}

function hashColor(code: string): number {
  let h = 0;
  for (let i = 0; i < code.length; i++) h = (h * 31 + code.charCodeAt(i)) >>> 0;
  return h % 6;
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
    if (get().phase !== 'intro') return;
    set({ phase: 'round_intro', round: 1 });
    later(() => get().beginRound(1), 3000);
  },

  beginRound: (round) => {
    set((s) => ({
      phase: s.phase === 'tie_breaker' ? 'tie_breaker' : 'operating',
      round,
      blue: { ...s.blue, spawnedThisRound: 0, resolvedThisRound: 0 },
      red: { ...s.red, spawnedThisRound: 0, resolvedThisRound: 0 },
    }));
    // Stagger the first parcels so the depot does not spawn four on one frame.
    (['blue', 'red'] as TeamId[]).forEach((team, ti) => {
      LANES.forEach((lane, li) => later(() => get().topUpLane(team, lane), 300 + ti * 350 + li * 1600));
    });
  },

  /**
   * Keep a lane stocked: an active order, plus one queued behind it while the
   * round quota allows. Called whenever a lane frees up.
   */
  topUpLane: (team, lane) => {
    const st = get();
    const operating = st.phase === 'operating' || st.phase === 'tie_breaker';
    if (!operating) return;

    const t = teamOf(st, team);
    const l = t.lanes[lane];
    const quota = st.phase === 'tie_breaker' ? 1 : PARCELS_PER_ROUND;
    const room = (l.active ? 0 : 1) + (l.next ? 0 : 1);
    if (room === 0) return;
    // Tie-break parcels only go on belt A.
    if (st.phase === 'tie_breaker' && lane !== 'A') return;
    if (t.spawnedThisRound >= quota) return;

    const order = st.phase === 'tie_breaker'
      ? generateTieBreaker()
      : generateOrder(st.round, t.spawnedThisRound);

    const parcelId = spawnParcel({
      team, lane,
      shape: order.shape,
      weightKg: order.weightKg,
      colorIndex: hashColor(order.destination.code),
      hideScale: order.hideScale,
      label: {
        orderId: order.id,
        destination: order.destination.name,
        rows: order.labelRows.slice(0, 3).map((r) => ({
          label: r.label,
          value: order.isMoney && /^[\d.]+$/.test(r.value) ? `₹${r.value}` : r.value,
        })),
      },
    });

    const entry: LaneOrder = { order, parcelId };
    set((s) => {
      const cur = teamOf(s, team);
      const cl = cur.lanes[lane];
      const nextLane: LaneState = cl.active
        ? { ...cl, next: entry }
        : { ...cl, active: entry, status: 'incoming', input: '', attemptsLeft: ATTEMPTS_PER_ORDER,
            lastWrong: false, hintShown: false, doubleArmed: false };
      return put(team, {
        ...cur,
        spawnedThisRound: cur.spawnedThisRound + 1,
        lanes: { ...cur.lanes, [lane]: nextLane },
      });
    });

    // Fill the queue slot too, a little later, so the belt visibly has a
    // parcel waiting behind the one being solved.
    if (room === 2) later(() => get().topUpLane(team, lane), 5200);
  },

  // ── KEYPAD ────────────────────────────────────────────────────────────────

  pressKey: (team, lane, key) => set((s) => {
    const l = teamOf(s, team).lanes[lane];
    if (l.status !== 'ready') return {};
    let next = l.input;
    if (key === '.') {
      if (next.includes('.')) return {};
      next = next === '' ? '0.' : next + '.';
    } else {
      if (!/^\d$/.test(key)) return {};
      if (next.replace('.', '').length >= MAX_INPUT_LENGTH) return {};
      next = next === '0' ? key : next + key;
    }
    return patchLane(s, team, lane, { input: next, lastWrong: false });
  }),

  clearInput: (team, lane) => set((s) =>
    teamOf(s, team).lanes[lane].status === 'ready'
      ? patchLane(s, team, lane, { input: '', lastWrong: false }) : {}),

  backspace: (team, lane) => set((s) => {
    const l = teamOf(s, team).lanes[lane];
    return l.status === 'ready' ? patchLane(s, team, lane, { input: l.input.slice(0, -1), lastWrong: false }) : {};
  }),

  submit: (team, lane) => {
    const st = get();
    const t = teamOf(st, team);
    const l = t.lanes[lane];
    if (!l.active || l.status !== 'ready') return;

    // Guard malformed entries ("", ".", "3.") so a rapid tap can never crash.
    const trimmed = l.input.endsWith('.') ? l.input.slice(0, -1) : l.input;
    if (trimmed === '') return;
    const value = Number(trimmed);
    if (!Number.isFinite(value)) return;

    const { order, parcelId } = l.active;
    const correct = answersMatch(value, order.correctAnswer, order.decimals);

    if (!correct && l.attemptsLeft > 1) {
      // First miss: the machine refuses; the parcel stays on the scale.
      set((s) => patchLane(s, team, lane, { attemptsLeft: l.attemptsLeft - 1, lastWrong: true, input: '' }));
      refuseAnswer(team, lane);
      return;
    }

    // Final outcome for this parcel: it leaves the scale either way.
    const moved = correct ? approveParcel(team, lane) : rejectParcel(team, lane);
    if (!moved) return;

    set((s) => {
      const cur = teamOf(s, team);
      const cl = cur.lanes[lane];
      // Promote the queued order to active; its parcel is already on the belt.
      const promoted: LaneState = {
        ...makeLane(lane),
        active: cl.next,
        status: cl.next ? 'incoming' : 'empty',
      };
      return put(team, {
        ...cur,
        inFlight: {
          ...cur.inFlight,
          [parcelId]: { order, lane, approved: correct, doubleArmed: cl.doubleArmed },
        },
        powerUps: { ...cur.powerUps, active2x: false },
        lanes: { ...cur.lanes, [lane]: promoted },
      });
    });

    // Restock behind the promoted parcel.
    later(() => get().topUpLane(team, lane), 1400);
  },

  // ── POWER-UPS ─────────────────────────────────────────────────────────────
  // One of each per team per match. The railway game's 50:50 removes wrong
  // options, which means nothing when students type the answer, so the same
  // three slots are adapted: HINT shows the working, +1 TRY adds an attempt,
  // 2x PAY doubles the reward if that parcel is delivered.

  useHint: (team, lane) => set((s) => {
    const t = teamOf(s, team);
    const l = t.lanes[lane];
    if (!t.powerUps.fiftyFifty || l.status !== 'ready' || l.hintShown) return {};
    return put(team, {
      ...t,
      powerUps: { ...t.powerUps, fiftyFifty: false },
      lanes: { ...t.lanes, [lane]: { ...l, hintShown: true } },
    });
  }),

  useExtraTry: (team, lane) => set((s) => {
    const t = teamOf(s, team);
    const l = t.lanes[lane];
    if (!t.powerUps.timeFreeze || l.status !== 'ready') return {};
    return put(team, {
      ...t,
      powerUps: { ...t.powerUps, timeFreeze: false },
      lanes: { ...t.lanes, [lane]: { ...l, attemptsLeft: l.attemptsLeft + 1 } },
    });
  }),

  useDoublePay: (team, lane) => set((s) => {
    const t = teamOf(s, team);
    const l = t.lanes[lane];
    if (!t.powerUps.doublePoints || l.status !== 'ready' || l.doubleArmed) return {};
    return put(team, {
      ...t,
      powerUps: { ...t.powerUps, doublePoints: false, active2x: true },
      lanes: { ...t.lanes, [lane]: { ...l, doubleArmed: true } },
    });
  }),

  // ── SIMULATION CALLBACKS ──────────────────────────────────────────────────

  stationReady: (team, lane, parcelId) => set((s) => {
    const l = teamOf(s, team).lanes[lane];
    // Only go live for the order that owns this parcel.
    if (!l.active || l.active.parcelId !== parcelId || l.status !== 'incoming') return {};
    return patchLane(s, team, lane, { status: 'ready' });
  }),

  parcelDelivered: (team, parcelId) => {
    const t = teamOf(get(), team);
    const f = t.inFlight[parcelId];
    if (!f) return;
    const reward = roundTo(f.doubleArmed ? f.order.reward * 2 : f.order.reward, 2);

    set((s) => {
      const cur = teamOf(s, team);
      const rest = { ...cur.inFlight };
      delete rest[parcelId];
      const done = cur.ordersCompleted + 1;
      return put(team, {
        ...cur,
        inFlight: rest,
        balance: roundTo(cur.balance + reward, 2),
        ordersCompleted: done,
        loadedWeight: roundTo(cur.loadedWeight + f.order.weightKg, 2),
        truckLoad: Math.min(1, done / TRUCK_CAPACITY),
        resolvedThisRound: cur.resolvedThisRound + 1,
        lastResult: { kind: 'delivered', amount: reward, orderId: f.order.id, at: Date.now() },
      });
    });

    if (get().phase === 'tie_breaker' && !get().tieBreakWinner) {
      set({ tieBreakWinner: team });
      later(() => get().runDispatch(), 1500);
      return;
    }
    get().checkRoundProgress();
  },

  parcelDiscarded: (team, parcelId) => {
    const t = teamOf(get(), team);
    const f = t.inFlight[parcelId];
    if (!f) return;

    set((s) => {
      const cur = teamOf(s, team);
      const rest = { ...cur.inFlight };
      delete rest[parcelId];
      return put(team, {
        ...cur,
        inFlight: rest,
        ordersRejected: cur.ordersRejected + 1,
        resolvedThisRound: cur.resolvedThisRound + 1,
        lastResult: { kind: 'rejected', amount: 0, orderId: f.order.id, at: Date.now() },
      });
    });
    get().checkRoundProgress();
  },

  checkRoundProgress: () => {
    const st = get();

    if (st.phase === 'tie_breaker') {
      // Both express parcels rejected: issue another pair rather than guess.
      const bothDone = st.blue.resolvedThisRound >= 1 && st.red.resolvedThisRound >= 1;
      if (bothDone && !st.tieBreakWinner) {
        later(() => {
          set((s) => ({
            blue: { ...s.blue, spawnedThisRound: 0, resolvedThisRound: 0 },
            red: { ...s.red, spawnedThisRound: 0, resolvedThisRound: 0 },
          }));
          get().topUpLane('blue', 'A');
          get().topUpLane('red', 'A');
        }, 1500);
      }
      return;
    }
    if (st.phase !== 'operating') return;

    // A round ends only when every parcel of BOTH teams has physically come to
    // rest, so nothing is ever cut off mid-carry.
    const done = (t: TeamState) =>
      t.spawnedThisRound >= PARCELS_PER_ROUND && t.resolvedThisRound >= PARCELS_PER_ROUND;
    if (!done(st.blue) || !done(st.red)) return;

    if (st.round >= 5) {
      set({ phase: 'round_complete' });
      later(() => get().finishMatch(), 1800);
      return;
    }
    const next = (st.round + 1) as RoundNumber;
    set({ phase: 'round_complete' });
    later(() => {
      set({ phase: 'round_intro', round: next });
      later(() => get().beginRound(next), 2600);
    }, 1800);
  },

  // ── ENDGAME ───────────────────────────────────────────────────────────────

  finishMatch: () => {
    const { blue, red } = get();
    const b = roundTo(blue.balance, 2);
    const r = roundTo(red.balance, 2);

    if (Math.abs(b - r) < 0.005) {
      // Exact tie: settle it with an express order, never an arbitrary pick.
      set((s) => ({
        phase: 'tie_breaker',
        tieBreakWinner: null,
        blue: { ...s.blue, spawnedThisRound: 0, resolvedThisRound: 0 },
        red: { ...s.red, spawnedThisRound: 0, resolvedThisRound: 0 },
      }));
      get().topUpLane('blue', 'A');
      get().topUpLane('red', 'A');
      return;
    }

    set({ phase: 'final_results', result: { winner: b > r ? 'blue' : 'red', blueBalance: b, redBalance: r } });
    later(() => get().runDispatch(), 5000);
  },

  runDispatch: () => {
    const st = get();
    const winner: TeamId = st.tieBreakWinner ?? (st.result?.winner === 'red' ? 'red' : 'blue');
    set({
      phase: 'dispatch_showdown',
      result: st.result ?? {
        winner,
        blueBalance: roundTo(st.blue.balance, 2),
        redBalance: roundTo(st.red.balance, 2),
      },
    });
    // Tarp over the load, then the winner pulls out. The loser stays in its bay.
    closeTruck(winner);
    later(() => departTruck(winner), 1600);
    later(() => set({ phase: 'game_complete' }), 14000);
  },

  toggleMute: () => set((s) => ({ muted: !s.muted })),

  resetGame: () => {
    // Invalidate every pending timer from the previous game, then rebuild.
    generation++;
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

export { ROUND_TITLES, formatValue };

// ── SIMULATION BRIDGE ───────────────────────────────────────────────────────
// The simulation decides WHEN an order completes: the instant its parcel comes
// to rest in the truck or the reject pile.

setDepotHandlers({
  onStationReady: (team, lane, parcelId) => useDepotStore.getState().stationReady(team, lane, parcelId),
  onDelivered: (team, _lane, parcelId) => useDepotStore.getState().parcelDelivered(team, parcelId),
  onDiscarded: (team, _lane, parcelId) => useDepotStore.getState().parcelDiscarded(team, parcelId),
});
