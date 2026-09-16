// ============================================================
// THE CHOCOLATE FACTORY — GAME STATE
//
// Two completely independent teams. There is NO global "current team": Blue
// and Red each hold their own mission index, question, selection, attempt
// count and results, and each advances the moment THEIR OWN machines are
// free. Neither team can ever be blocked by the other.
//
// The store owns the mission/question flow; the simulation owns the physical
// factory. They meet in exactly two places: `applyAnswer` hands a tapped
// answer to the line, and the simulation calls back when a line goes idle
// (issue the next mission) or a truck reaches a customer (record results).
// ============================================================

'use client';

import { create } from 'zustand';
import type { CustomerOrder, FractionQuestion, GamePhase, RoundNumber, TeamId } from '../types';
import { generateQuestion, PRODUCTS, pick } from '../engine/fractionEngine';
import {
  isTeamQuiet, lineIsFree, resetSim, setFactoryHandlers, sim, submitAnswer, setCelebrating,
} from '../engine/factorySim';

export const MISSIONS_PER_ROUND = 2;
export const TOTAL_ROUNDS = 5;
export const TOTAL_MISSIONS = MISSIONS_PER_ROUND * TOTAL_ROUNDS;

export type TeamStatus = 'answering' | 'retry' | 'producing' | 'complete';

export interface TeamState {
  /** How many missions have been handed to this team so far (0-based cursor). */
  missionIndex: number;
  round: RoundNumber;
  order: CustomerOrder | null;
  selected: number | null;
  attempt: 1 | 2;
  status: TeamStatus;
  /** Short feedback line shown in the console after a tap. */
  feedback: string | null;
  lastCorrect: boolean | null;

  // Results, updated when a truck actually reaches a customer.
  ordersCompleted: number;
  deliveries: number;
  onTime: number;
  quality: number;
  satisfaction: number;
  waste: number;
  rework: number;
  score: number;
}

interface FactoryStore {
  phase: GamePhase;
  muted: boolean;
  winner: TeamId | 'tie' | null;
  blue: TeamState;
  red: TeamState;

  startGame: () => void;
  selectAnswer: (team: TeamId, index: number) => void;
  applyAnswer: (team: TeamId) => void;
  toggleMute: () => void;
  resetGame: () => void;
}

function roundOf(missionIndex: number): RoundNumber {
  return (Math.min(TOTAL_ROUNDS, Math.floor(missionIndex / MISSIONS_PER_ROUND) + 1)) as RoundNumber;
}

function makeTeam(): TeamState {
  return {
    missionIndex: 0, round: 1, order: null, selected: null, attempt: 1,
    status: 'answering', feedback: null, lastCorrect: null,
    ordersCompleted: 0, deliveries: 0, onTime: 0,
    quality: 92, satisfaction: 88, waste: 0, rework: 0, score: 0,
  };
}

/** Factory performance, not "who tapped fastest" — the brief's win condition. */
export function scoreOf(t: TeamState): number {
  return Math.round(
    t.ordersCompleted * 100 +
    t.quality * 2 +
    t.satisfaction * 2 +
    t.onTime * 30 -
    t.waste * 15 -
    t.rework * 10
  );
}

/** Builds the customer order (and its fraction question) for one mission slot. */
function makeOrder(team: TeamId, missionIndex: number): CustomerOrder {
  const round = roundOf(missionIndex);
  // Blue and Red draw from the same bank at different offsets, so the two
  // teams get comparable-but-different questions every mission.
  const bankIndex = missionIndex * 2 + (team === 'blue' ? 0 : 1);
  const seed = (team === 'blue' ? 1013 : 7717) + missionIndex * 131 + round * 17;
  const question: FractionQuestion = generateQuestion(round, bankIndex, seed);
  const units = 40 + ((missionIndex * 3 + (team === 'blue' ? 0 : 1)) % 8) * 20;
  return {
    id: `${team}-order-${missionIndex + 1}`,
    round,
    customer: question.customerType,
    customerName: question.customerName,
    productName: pick(PRODUCTS, bankIndex),
    units,
    question,
  };
}

let handlersBound = false;

export const useFactoryStore = create<FactoryStore>((set, get) => {
  /** Hands a team its next mission, or marks it finished. */
  const issueMission = (team: TeamId) => {
    const t = get()[team];
    if (t.missionIndex >= TOTAL_MISSIONS) {
      set((s) => ({ [team]: { ...s[team], status: 'complete', order: null, feedback: 'ALL MISSIONS COMPLETE' } } as Partial<FactoryStore>));
      maybeFinish();
      return;
    }
    const order = makeOrder(team, t.missionIndex);
    set((s) => ({
      [team]: {
        ...s[team],
        order,
        round: order.round,
        selected: null,
        attempt: 1,
        status: 'answering',
        feedback: null,
        lastCorrect: null,
      },
    } as Partial<FactoryStore>));
  };

  /** Ends the match once both teams are out of missions AND their factories are quiet. */
  const maybeFinish = () => {
    const s = get();
    if (s.phase === 'final_results' || s.phase === 'game_complete') return;
    const done = (t: TeamState) => t.missionIndex >= TOTAL_MISSIONS;
    if (!done(s.blue) || !done(s.red)) return;
    if (!isTeamQuiet('blue') || !isTeamQuiet('red')) {
      // Let the last trucks finish their run, then score.
      set({ phase: 'grand_finale' });
      setTimeout(maybeFinish, 900);
      return;
    }
    const blueScore = scoreOf(s.blue);
    const redScore = scoreOf(s.red);
    const winner: TeamId | 'tie' =
      blueScore === redScore ? 'tie' : blueScore > redScore ? 'blue' : 'red';
    if (winner !== 'tie') setCelebrating(winner, true);
    set((st) => ({
      phase: 'final_results',
      winner,
      blue: { ...st.blue, score: blueScore },
      red: { ...st.red, score: redScore },
    }));
  };

  const bindHandlers = () => {
    if (handlersBound) return;
    handlersBound = true;
    setFactoryHandlers({
      // The machines are free again: give that team its next mission at once.
      onLineIdle: (team) => issueMission(team),
      // A truck reached a customer: bank the real results.
      onDelivered: (team) => {
        const side = sim[team];
        set((s) => {
          const next: TeamState = {
            ...s[team],
            ordersCompleted: side.ordersCompleted,
            deliveries: side.deliveries,
            onTime: side.onTimeDeliveries,
            quality: side.quality,
            satisfaction: side.customerSatisfaction,
            waste: side.wasteUnits,
            rework: side.reworkCount,
          };
          next.score = scoreOf(next);
          return { [team]: next } as Partial<FactoryStore>;
        });
        maybeFinish();
      },
    });
  };

  return {
    phase: 'intro',
    muted: false,
    winner: null,
    blue: makeTeam(),
    red: makeTeam(),

    startGame: () => {
      resetSim();
      bindHandlers();
      set({ phase: 'operating', winner: null, blue: makeTeam(), red: makeTeam() });
      issueMission('blue');
      issueMission('red');
    },

    selectAnswer: (team, index) => {
      const t = get()[team];
      if (t.status !== 'answering' && t.status !== 'retry') return;
      set((s) => ({ [team]: { ...s[team], selected: index } } as Partial<FactoryStore>));
    },

    applyAnswer: (team) => {
      const t = get()[team];
      if (!t.order || t.selected === null) return;
      if (t.status !== 'answering' && t.status !== 'retry') return;
      if (!lineIsFree(team)) return;

      const result = submitAnswer(team, t.order, t.selected, t.attempt);
      if (result === 'ignored') return;

      if (result === 'retry') {
        set((s) => ({
          [team]: {
            ...s[team],
            attempt: 2,
            selected: null,
            status: 'retry',
            lastCorrect: false,
            feedback: 'BATCH SENT TO REWORK — CHECK THE FRACTION AND TRY AGAIN',
            rework: s[team].rework + 1,
          },
        } as Partial<FactoryStore>));
        return;
      }

      const correct = t.selected === t.order.question.correctIndex;
      set((s) => ({
        [team]: {
          ...s[team],
          missionIndex: s[team].missionIndex + 1,
          status: 'producing',
          lastCorrect: correct,
          feedback: correct
            ? 'CORRECT — MIXER AUTHORISED, PRODUCTION RUNNING'
            : 'WRONG QUANTITY APPLIED — THE LINE IS MAKING THAT AMOUNT',
        },
      } as Partial<FactoryStore>));
    },

    toggleMute: () => set((s) => ({ muted: !s.muted })),

    resetGame: () => {
      resetSim();
      set({ phase: 'intro', winner: null, blue: makeTeam(), red: makeTeam() });
    },
  };
});
