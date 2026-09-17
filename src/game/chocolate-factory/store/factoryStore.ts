// ============================================================
// THE CHOCOLATE FACTORY — GAME STATE
//
// Two completely independent teams. There is NO global "current team": Blue
// and Red each hold their own cycle, step, question, selection and results,
// and each advances the moment THEIR OWN machines finish a step.
//
// A CYCLE is one customer order fulfilled in FIVE steps, one question each:
//   cocoa -> mixing -> molds -> cooling & cutting -> packaging
// then the forklift loads the truck and the truck makes the delivery.
// Five cycles per team, one per curriculum round: 25 questions each.
// ============================================================

'use client';

import { create } from 'zustand';
import type { CustomerOrder, FractionQuestion, GamePhase, RoundNumber, TeamId } from '../types';
import { customerFor, generateQuestion, PRODUCTS, pick } from '../engine/fractionEngine';
import {
  isTeamQuiet, resetSim, setFactoryHandlers, sim, submitAnswer, victoryRun,
  STEPS, STEPS_PER_CYCLE, STEP_LABEL, STEP_ACTION, type StepId,
} from '../engine/factorySim';

export const TOTAL_CYCLES = 1;
export const TOTAL_QUESTIONS = 5;

export type TeamStatus = 'answering' | 'retry' | 'working' | 'delivering' | 'complete';

export interface TeamState {
  cycle: number;
  step: number;
  round: RoundNumber;
  stepId: StepId;
  stepLabel: string;
  stepAction: string;
  order: CustomerOrder | null;
  selected: number | null;
  attempt: 1 | 2;
  status: TeamStatus;
  feedback: string | null;
  lastCorrect: boolean | null;
  questionsAnswered: number;

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

function makeTeam(team: TeamId = 'blue'): TeamState {
  const order = makeStepOrder(team, 0, 0);
  return {
    cycle: 0, step: 0, round: 1, stepId: STEPS[0],
    stepLabel: STEP_LABEL[STEPS[0]], stepAction: STEP_ACTION[STEPS[0]],
    order, selected: null, attempt: 1, status: 'answering',
    feedback: null, lastCorrect: null, questionsAnswered: 0,
    ordersCompleted: 0, deliveries: 0, onTime: 0,
    quality: 92, satisfaction: 88, waste: 0, rework: 0, score: 0,
  };
}

/** Factory performance, not "who tapped fastest" — the brief's win condition. */
export function scoreOf(t: TeamState): number {
  return Math.round(
    t.ordersCompleted * 120 +
    t.questionsAnswered * 20 +
    t.quality * 2 +
    t.satisfaction * 2 +
    t.onTime * 30 -
    t.waste * 18 -
    t.rework * 10
  );
}

/** The customer this whole five-step cycle is being made for. */
function cycleCustomer(team: TeamId, cycle: number) {
  const i = cycle * 2 + (team === 'blue' ? 0 : 1);
  const c = customerFor(i);
  return {
    type: c.type,
    name: c.name,
    product: pick(PRODUCTS, i),
    units: 40 + ((cycle * 3 + (team === 'blue' ? 0 : 1)) % 8) * 20,
  };
}

/** One step's question, drawn from the round matching this step (1 to 5). */
function makeStepOrder(team: TeamId, cycle: number, step: number): CustomerOrder {
  const round = (Math.min(5, step + 1)) as RoundNumber;
  const cust = cycleCustomer(team, cycle);
  const bankIndex = Math.floor(Math.random() * 20) * 5 + step * 2 + (team === 'blue' ? 0 : 1);
  const seed = (team === 'blue' ? 2311 : 8677) + cycle * 419 + step * 53 + Math.floor(Math.random() * 1000);
  const question: FractionQuestion = generateQuestion(round, bankIndex, seed);
  return {
    id: `${team}-c${cycle + 1}-s${step + 1}`,
    round,
    customer: cust.type,
    customerName: cust.name,
    productName: cust.product,
    units: cust.units,
    question,
  };
}

let handlersBound = false;

export const useFactoryStore = create<FactoryStore>((set, get) => {
  /** Hands the team the question for whatever step its factory is now on. */
  const issueQuestion = (team: TeamId) => {
    const side = sim[team];
    if (side.cycle >= TOTAL_CYCLES) {
      set((s) => ({
        [team]: { ...s[team], status: 'complete', order: null, feedback: 'ALL FIVE ORDERS COMPLETE' },
      } as Partial<FactoryStore>));
      maybeFinish();
      return;
    }
    const stepId = STEPS[side.stepIndex];
    const order = makeStepOrder(team, side.cycle, side.stepIndex);
    set((s) => ({
      [team]: {
        ...s[team],
        cycle: side.cycle,
        step: side.stepIndex,
        round: order.round,
        stepId,
        stepLabel: STEP_LABEL[stepId],
        stepAction: STEP_ACTION[stepId],
        order,
        selected: null,
        attempt: 1,
        status: 'answering',
        feedback: null,
        lastCorrect: null,
      },
    } as Partial<FactoryStore>));
  };

  const maybeFinish = () => {
    const s = get();
    if (s.phase === 'final_results') return;
    const done = (team: TeamId) => sim[team].cycle >= TOTAL_CYCLES;
    if (!done('blue') || !done('red')) return;
    if (!isTeamQuiet('blue') || !isTeamQuiet('red')) {
      set({ phase: 'grand_finale' });
      setTimeout(maybeFinish, 900);
      return;
    }
    const blueScore = scoreOf(s.blue);
    const redScore = scoreOf(s.red);
    const winner: TeamId | 'tie' = blueScore === redScore ? 'tie' : blueScore > redScore ? 'blue' : 'red';
    // The factory that ran best sends its truck out on the victory delivery.
    if (winner !== 'tie') victoryRun(winner);
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
      onStepReady: (team) => issueQuestion(team),
      onCycleDelivered: (team) => {
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

  // Bind handlers automatically so listeners are active from the very start
  bindHandlers();

  return {
    phase: 'intro',
    muted: false,
    winner: null,
    blue: makeTeam('blue'),
    red: makeTeam('red'),

    startGame: () => {
      resetSim();
      bindHandlers();
      set({ phase: 'operating', winner: null, blue: makeTeam('blue'), red: makeTeam('red') });
      issueQuestion('blue');
      issueQuestion('red');
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
            feedback: 'INCORRECT FRACTION — LINE IS HOLDING. PLEASE SELECT THE CORRECT ANSWER TO PROCEED.',
            // The simulation owns the rework tally; mirror it rather than
            // counting the same miss twice.
            rework: sim[team].reworkCount,
          },
        } as Partial<FactoryStore>));
        return;
      }

      const correct = t.selected === t.order.question.correctIndex;
      const side = sim[team];
      const lastStep = side.stepIndex >= STEPS_PER_CYCLE - 1;
      set((s) => ({
        [team]: {
          ...s[team],
          status: lastStep ? 'delivering' : 'working',
          lastCorrect: true,
          questionsAnswered: s[team].questionsAnswered + 1,
          quality: side.quality,
          waste: side.wasteUnits,
          feedback: `${STEP_LABEL[STEPS[side.stepIndex]]} — RUNNING NOW`,
        },
      } as Partial<FactoryStore>));
    },

    toggleMute: () => set((s) => ({ muted: !s.muted })),

    resetGame: () => {
      resetSim();
      bindHandlers();
      set({ phase: 'intro', winner: null, blue: makeTeam('blue'), red: makeTeam('red') });
      issueQuestion('blue');
      issueQuestion('red');
    },
  };
});
