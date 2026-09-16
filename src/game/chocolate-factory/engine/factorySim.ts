// ============================================================
// THE CHOCOLATE FACTORY — PRODUCTION SIMULATION
//
// ONE QUESTION = ONE STEP OF THE PRODUCTION CHAIN. A cycle is five steps,
// and each correct fraction physically advances the factory one stage:
//
//   1 INGREDIENTS  handlers carry sacks and tip cocoa into the tank
//   2 MIXING       the mixer turns and the chocolate comes together
//   3 MOLDING      chocolate pours into that many molds
//   4 COOLING      bars run the tunnel and the cutter slices them
//   5 PACKAGING    bars are wrapped and boxed onto a pallet
//
//   then the forklift carries the pallet of boxes to the truck and the
//   truck drives the order out to its customer.
//
// The fraction the team taps sets the QUANTITY at that step — the tank
// level, the amount mixed, how many molds fill, how many bars are cut, how
// many boxes are packed. A wrong fraction makes the wrong amount; it is
// never faked. Both teams run their own chain and never wait for each other.
// ============================================================

import type {
  CustomerOrder, CustomerRelationship, CustomerType, FactoryEvent, TeamId,
} from '../types';
import { toDecimal } from './fractionMath';
import {
  CARGO_SLOTS, forkliftPalletRoute, forkliftToTruck, handlerToPallet, handlerToTank,
  sideOf, sideSign, truckLocalToWorld, truckReturnRoute, truckRoute,
} from './factoryLayout';
import { angleDelta, polylineLength, samplePolyline, smooth, type Vec3 } from '../world/geom';

// ── THE FIVE STEPS ───────────────────────────────────────────────────────

export type StepId = 'ingredients' | 'mixing' | 'molding' | 'cooling' | 'packaging';
export const STEPS: StepId[] = ['ingredients', 'mixing', 'molding', 'cooling', 'packaging'];
export const STEPS_PER_CYCLE = STEPS.length;

export const STEP_LABEL: Record<StepId, string> = {
  ingredients: 'LOAD THE COCOA',
  mixing: 'MIX THE BATCH',
  molding: 'FILL THE MOLDS',
  cooling: 'COOL & CUT THE BARS',
  packaging: 'WRAP & BOX THE ORDER',
};

export const STEP_ACTION: Record<StepId, string> = {
  ingredients: 'Sets how full the cocoa tank is filled.',
  mixing: 'Sets how much chocolate the mixer makes.',
  molding: 'Sets how many molds are filled.',
  cooling: 'Sets how many bars come off the cutter.',
  packaging: 'Sets how many boxes go on the pallet.',
};

const STEP_TIME: Record<StepId, number> = {
  ingredients: 7.2,
  mixing: 3.4,
  molding: 2.8,
  cooling: 4.2,
  packaging: 3.4,
};

export const MAX_MOLDS = 12;
export const MAX_BARS = 20;
export const MAX_BOXES = 5;

const REWORK_FLASH = 1.5;
const TRUCK_SPEED = 9.5;
const WALK_SPEED = 3.1;
const FORK_SPEED = 4.4;
const UNLOAD_PAUSE = 1.4;

// ── STATE ────────────────────────────────────────────────────────────────

export type StepPhase = 'awaiting' | 'running';
export type Logistics =
  | 'idle' | 'fork_to_pallet' | 'fork_lift' | 'fork_to_truck' | 'fork_unload'
  | 'fork_return' | 'truck_out' | 'at_customer' | 'truck_back';

interface Mover {
  pos: Vec3; heading: number; task: string; path: Vec3[]; travel: number;
  carrying: boolean; phase: number;
  /** How much of this sack has already gone into the tank. */
  poured: number;
}

export interface SideSim {
  team: TeamId;

  // ── cycle / step ──
  cycle: number;
  stepIndex: number;
  phase: StepPhase;
  stepT: number;
  stepStartAt: number;
  order: CustomerOrder | null;
  attemptUsed: 1 | 2;
  lastCorrect: boolean;
  wrongFlashT: number;

  // ── quantities, each one set by the fraction answered at that step ──
  cocoaFill: number;
  mixAmount: number;
  moldCount: number;
  barCount: number;
  boxCount: number;

  // ── machine animation ──
  tankFill: number;
  mixerSpin: number;
  moldFill: number;
  coolT: number;
  cutT: number;
  packT: number;
  tipPour: number;

  // ── quality / waste ──
  stepQuality: number[];
  quality: number;
  wasteUnits: number;
  reworkCount: number;

  // ── logistics ──
  logistics: Logistics;
  boxesOnPallet: number;
  boxesInTruck: number;
  forkLift: number;
  truck: Mover & { customer: CustomerType | null; pauseT: number };
  forklift: Mover;
  handlers: Mover[];
  operator: Mover;
  inspector: Mover;
  packer: Mover;

  // ── results ──
  cyclesDone: number;
  ordersCompleted: number;
  deliveries: number;
  onTimeDeliveries: number;
  customerSatisfaction: number;
  relationships: Partial<Record<CustomerType, CustomerRelationship>>;
  reaction: 'happy' | 'meh' | 'unhappy' | null;
  reactionUntil: number;
  celebrating: boolean;

  events: FactoryEvent[];
}

export interface FactoryHandlers {
  /** A step finished — the team can be given the question for the next one. */
  onStepReady?: (team: TeamId) => void;
  /** A full five-step cycle was delivered to its customer. */
  onCycleDelivered?: (team: TeamId, order: CustomerOrder, satisfaction: number) => void;
}
let handlers: FactoryHandlers = {};
export function setFactoryHandlers(h: FactoryHandlers) { handlers = h; }

function mover(home: Vec3): Mover {
  return { pos: { ...home }, heading: 0, task: 'idle', path: [], travel: 0, carrying: false, phase: Math.random() * 6, poured: 0 };
}

function makeSide(team: TeamId): SideSim {
  const s = sideOf(team);
  return {
    team,
    cycle: 0, stepIndex: 0, phase: 'awaiting', stepT: 0, stepStartAt: 0,
    order: null, attemptUsed: 1, lastCorrect: true, wrongFlashT: 0,
    cocoaFill: 0, mixAmount: 0, moldCount: 0, barCount: 0, boxCount: 0,
    tankFill: 0, mixerSpin: 0, moldFill: 0, coolT: 0, cutT: 0, packT: 0, tipPour: 0,
    stepQuality: [], quality: 92, wasteUnits: 0, reworkCount: 0,
    logistics: 'idle', boxesOnPallet: 0, boxesInTruck: 0, forkLift: 0.2,
    truck: { ...mover(s.truckHome), customer: null, pauseT: 0 },
    forklift: mover(s.forkliftHome),
    handlers: [mover(s.handlerHome[0]), mover(s.handlerHome[1])],
    operator: mover(s.operatorHome),
    inspector: mover(s.inspectorHome),
    packer: mover(s.packerHome),
    cyclesDone: 0, ordersCompleted: 0, deliveries: 0, onTimeDeliveries: 0,
    customerSatisfaction: 88, relationships: {},
    reaction: null, reactionUntil: 0, celebrating: false,
    events: [],
  };
}

export const sim = { blue: makeSide('blue'), red: makeSide('red'), elapsed: 0 };
export const sideSim = (team: TeamId): SideSim => sim[team];
export function resetSim() { sim.blue = makeSide('blue'); sim.red = makeSide('red'); sim.elapsed = 0; }

function emit(side: SideSim, kind: FactoryEvent['kind']) { side.events.push({ team: side.team, kind }); }

export const currentStep = (team: TeamId): StepId => STEPS[Math.min(STEPS.length - 1, sim[team].stepIndex)];
export const stepIsOpen = (team: TeamId): boolean => sim[team].phase === 'awaiting';

/** The step actually running right now, or null while the team is answering. */
export function runningStep(team: TeamId): StepId | null {
  const s = sim[team];
  return s.phase === 'running' ? STEPS[Math.min(STEPS.length - 1, s.stepIndex)] : null;
}

/** True while anything at all is moving for this team. */
export function isBusy(team: TeamId): boolean {
  const s = sim[team];
  return s.phase === 'running' || s.logistics !== 'idle';
}

// ── APPLYING AN ANSWER ───────────────────────────────────────────────────

/**
 * The team taps an answer for the CURRENT step. The tapped fraction sets that
 * step's quantity — right or wrong. A first miss costs a rework flash and a
 * retry; a second miss runs the step at the wrong amount.
 */
export function submitAnswer(
  team: TeamId, order: CustomerOrder, selectedIndex: number, attempt: 1 | 2
): 'retry' | 'applied' | 'ignored' {
  const side = sim[team];
  if (side.phase !== 'awaiting') return 'ignored';
  const q = order.question;
  const correct = selectedIndex === q.correctIndex;

  if (!correct && attempt === 1) {
    side.wrongFlashT = REWORK_FLASH;
    side.reworkCount++;
    emit(side, 'wrong');
    emit(side, 'rework');
    return 'retry';
  }

  const value = Math.max(0.08, Math.min(1.6, toDecimal(q.optionValues[selectedIndex] ?? q.optionValues[q.correctIndex])));
  side.order = order;
  side.attemptUsed = attempt;
  side.lastCorrect = correct;

  const step = STEPS[side.stepIndex];
  switch (step) {
    case 'ingredients':
      side.cocoaFill = Math.min(1, value);
      side.tankFill = 0;
      side.tipPour = 0;
      dispatchHandlers(side);
      emit(side, 'valve_open');
      break;
    case 'mixing':
      side.mixAmount = Math.min(1, value);
      side.mixerSpin = 0;
      emit(side, 'mixer_start');
      break;
    case 'molding':
      side.moldCount = Math.max(1, Math.round(value * MAX_MOLDS));
      side.moldFill = 0;
      emit(side, 'mold_fill');
      break;
    case 'cooling':
      side.barCount = Math.max(1, Math.round(value * MAX_BARS));
      side.coolT = 0; side.cutT = 0;
      emit(side, 'cooling_enter');
      break;
    case 'packaging':
      side.boxCount = Math.max(1, Math.min(MAX_BOXES, Math.round(value * MAX_BOXES)));
      side.packT = 0;
      side.boxesOnPallet = 0;
      emit(side, 'box_seal');
      break;
  }

  // Quality for this step: clean first-time work runs best.
  const quality = correct
    ? (attempt === 1 ? 90 + Math.round(Math.random() * 9) : 72 + Math.round(Math.random() * 13))
    : 35 + Math.round(Math.random() * 20);
  side.stepQuality.push(quality);
  if (!correct) { side.wasteUnits++; emit(side, 'rework'); }
  side.quality = Math.round(side.stepQuality.reduce((a, b) => a + b, 0) / side.stepQuality.length);

  side.phase = 'running';
  side.stepT = 0;
  side.stepStartAt = sim.elapsed;
  emit(side, correct ? 'correct' : 'wrong');
  return 'applied';
}

// ── STEP ────────────────────────────────────────────────────────────────

export function stepSim(rawDt: number) {
  const dt = Math.min(0.05, Math.max(0.0005, rawDt));
  sim.elapsed += dt;
  stepSide(sim.blue, dt);
  stepSide(sim.red, dt);
}

function stepSide(side: SideSim, dt: number) {
  if (side.wrongFlashT > 0) side.wrongFlashT = Math.max(0, side.wrongFlashT - dt);
  if (side.reactionUntil > 0 && sim.elapsed > side.reactionUntil) { side.reaction = null; side.reactionUntil = 0; }

  if (side.phase === 'running') runStep(side, dt);
  stepHandlers(side, dt);
  stepStationCrew(side, dt);
  stepLogistics(side, dt);
}

function runStep(side: SideSim, dt: number) {
  const step = STEPS[side.stepIndex];
  const dur = STEP_TIME[step];
  let t = Math.min(1, (sim.elapsed - side.stepStartAt) / dur);

  switch (step) {
    case 'ingredients': {
      // This step is finished by the WORK, not by a stopwatch: it ends when
      // the handlers have actually tipped the answered amount into the tank.
      const filled = side.cocoaFill > 0 ? side.tankFill / side.cocoaFill : 1;
      t = Math.min(1, filled);
      // Safety valve, so a stuck carrier can never freeze a team's console.
      if (sim.elapsed - side.stepStartAt > dur * 4) t = 1;
      break;
    }
    case 'mixing':
      side.mixerSpin += dt * 4.2;
      side.tankFill = side.cocoaFill * (1 - smooth(Math.max(0, t - 0.2) / 0.8));
      break;
    case 'molding':
      side.moldFill = smooth(t);
      break;
    case 'cooling':
      side.coolT = Math.min(1, t / 0.62);
      side.cutT = t > 0.62 ? Math.min(1, (t - 0.62) / 0.38) : 0;
      if (side.cutT > 0 && side.cutT < 0.06) emit(side, 'cut');
      break;
    case 'packaging':
      side.packT = t;
      side.boxesOnPallet = Math.min(side.boxCount, Math.floor(t * side.boxCount * 1.02));
      break;
  }

  side.stepT = t;
  if (t < 1) return;

  // Step complete.
  if (step === 'cooling') emit(side, 'quality_stamp');
  if (step === 'packaging') {
    side.boxesOnPallet = side.boxCount;
    emit(side, 'box_seal');
    // The pallet is ready: the forklift comes for it.
    side.logistics = 'fork_to_pallet';
    side.forklift.task = 'to_pallet';
    side.forklift.path = forkliftPalletRoute(side.team, side.forklift.pos);
    side.forklift.travel = 0;
    side.phase = 'awaiting';
    return;
  }

  side.stepIndex++;
  side.phase = 'awaiting';
  handlers.onStepReady?.(side.team);
}

// ── INGREDIENT HANDLERS: carry sacks, tip cocoa into the tank ───────────

function dispatchHandlers(side: SideSim) {
  side.handlers.forEach((h, i) => {
    h.task = 'to_pallet';
    h.carrying = false;
    h.path = handlerToPallet(side.team, h.pos, i);
    h.travel = 0;
  });
}

function follow(mv: Mover, speed: number, dt: number): boolean {
  const next = mv.travel + speed * dt;
  const r = samplePolyline(mv.path, next, 0);
  mv.travel = Math.min(next, polylineLength(mv.path));
  mv.pos = r.pos;
  mv.heading += angleDelta(mv.heading, r.heading) * (1 - Math.exp(-7 * dt));
  return r.done;
}

function stepHandlers(side: SideSim, dt: number) {
  const active = side.phase === 'running' && STEPS[side.stepIndex] === 'ingredients';
  // One trip each: two handlers, two sacks, and the tank holds the answer.
  const trips = 1;

  side.handlers.forEach((h, i) => {
    h.phase += dt * (h.task.startsWith('to_') ? 7 : 1.6);

    switch (h.task) {
      case 'idle':
      case 'ambient': {
        // Nobody stands idle: between batches they tidy the ingredient store.
        ambientPatrol(side, h, i, dt);
        break;
      }
      case 'to_pallet': {
        if (follow(h, WALK_SPEED, dt)) {
          h.carrying = true;
          h.task = 'to_tank';
          h.path = handlerToTank(side.team, h.pos);
          h.travel = 0;
        }
        break;
      }
      case 'to_tank': {
        if (follow(h, WALK_SPEED * 0.9, dt)) { h.task = 'tipping'; h.travel = 0; h.phase = 0; h.poured = 0; }
        break;
      }
      case 'tipping': {
        // The sack empties into the tank at a steady rate, and the tip only
        // ends when the whole share is actually in — not on a timer.
        side.tipPour = 1;
        const share = side.cocoaFill / side.handlers.length;
        const rate = share / 1.15;
        const give = Math.min(rate * dt, share - h.poured);
        h.poured += give;
        side.tankFill = Math.min(side.cocoaFill, side.tankFill + give);
        if (h.poured >= share - 1e-4) {
          h.carrying = false;
          h.poured = 0;
          side.tipPour = 0;
          h.task = 'back';
          h.path = handlerToPallet(side.team, h.pos, i);
          h.travel = 0;
          emit(side, 'mold_fill');
        }
        break;
      }

      case 'back': {
        if (follow(h, WALK_SPEED, dt)) {
          const stillNeeded = active && side.tankFill < side.cocoaFill - 0.02;
          if (stillNeeded) { h.task = 'to_pallet'; h.path = handlerToPallet(side.team, h.pos, i); h.travel = 0; }
          else { h.task = 'ambient'; h.travel = 0; h.path = []; }
        }
        break;
      }
    }
  });

}

/** Slow work-loop so no member of staff is ever just standing about. */
function ambientPatrol(side: SideSim, m: Mover, index: number, dt: number) {
  const s = sideOf(side.team);
  const home = s.handlerHome[index % 2];
  const away = { x: home.x + sideSign(side.team) * 2.6, y: 0, z: home.z + 2.4 };
  if (!m.path.length || m.travel >= polylineLength(m.path) - 0.01) {
    const atHome = Math.hypot(m.pos.x - home.x, m.pos.z - home.z) < 1.2;
    m.path = atHome ? [m.pos, away] : [m.pos, home];
    m.travel = 0;
  }
  follow(m, WALK_SPEED * 0.45, dt);
}

// ── STATION CREW: operator, inspector, packer ───────────────────────────

function stepStationCrew(side: SideSim, dt: number) {
  const step = STEPS[side.stepIndex];
  const running = side.phase === 'running';
  side.operator.phase += dt;
  side.inspector.phase += dt;
  side.packer.phase += dt;

  // Each of them shifts a little around their station so the floor looks worked.
  const bob = (m: Mover, base: Vec3, amount: number, rate: number) => {
    m.pos = {
      x: base.x + Math.sin(m.phase * rate) * amount,
      y: 0,
      z: base.z + Math.cos(m.phase * rate * 0.7) * amount * 0.6,
    };
  };
  const s = sideOf(side.team);
  bob(side.operator, s.operatorHome, running && (step === 'mixing' || step === 'molding') ? 0.5 : 0.25, 0.9);
  bob(side.inspector, s.inspectorHome, running && step === 'cooling' ? 0.55 : 0.2, 0.8);
  bob(side.packer, s.packerHome, running && step === 'packaging' ? 0.5 : 0.22, 1.1);
}

// ── LOGISTICS: forklift pallet run, then the truck ──────────────────────

function stepLogistics(side: SideSim, dt: number) {
  const f = side.forklift;
  const t = side.truck;
  f.phase += dt;

  switch (side.logistics) {
    case 'idle': {
      // The forklift keeps the yard tidy rather than parking up dead.
      if (f.task === 'idle' && side.phase === 'running' && STEPS[side.stepIndex] === 'ingredients') {
        f.task = 'yard';
        f.path = [f.pos, { x: sideOf(side.team).palletStack.x, y: 0, z: sideOf(side.team).palletStack.z + 3.4 }];
        f.travel = 0;
      } else if (f.task === 'yard') {
        if (follow(f, FORK_SPEED * 0.7, dt)) {
          f.task = 'idle';
          f.path = [f.pos, sideOf(side.team).forkliftHome];
          f.travel = 0;
        }
      }
      break;
    }

    case 'fork_to_pallet': {
      if (follow(f, FORK_SPEED, dt)) {
        side.logistics = 'fork_lift';
        f.task = 'lifting';
        f.travel = 0;
        emit(side, 'forklift_beep');
      }
      break;
    }

    case 'fork_lift': {
      side.forkLift = Math.min(1.1, side.forkLift + dt * 1.2);
      if (side.forkLift >= 1.05) {
        f.carrying = true;
        side.logistics = 'fork_to_truck';
        f.task = 'hauling';
        f.path = forkliftToTruck(side.team, f.pos);
        f.travel = 0;
      }
      break;
    }

    case 'fork_to_truck': {
      if (follow(f, FORK_SPEED * 0.8, dt)) {
        side.logistics = 'fork_unload';
        t.pauseT = 0;
      }
      break;
    }

    case 'fork_unload': {
      // Boxes go into the bed one at a time.
      t.pauseT += dt;
      const want = Math.min(side.boxCount, Math.floor(t.pauseT / 0.34));
      if (want > side.boxesInTruck) {
        side.boxesInTruck = Math.min(CARGO_SLOTS.length, want);
        side.boxesOnPallet = Math.max(0, side.boxCount - want);
        emit(side, 'box_seal');
      }
      if (t.pauseT > side.boxCount * 0.34 + 0.5) {
        f.carrying = false;
        side.boxesOnPallet = 0;
        side.forkLift = 0.2;
        side.logistics = 'fork_return';
        f.task = 'returning';
        f.path = [f.pos, sideOf(side.team).forkliftHome];
        f.travel = 0;
      }
      break;
    }

    case 'fork_return': {
      if (follow(f, FORK_SPEED, dt)) {
        f.task = 'idle';
        startDelivery(side);
      }
      break;
    }

    case 'truck_out': {
      if (follow(t, TRUCK_SPEED, dt)) {
        t.pauseT = 0;
        side.logistics = 'at_customer';
        emit(side, 'truck_arrive');
        resolveDelivery(side);
      }
      break;
    }

    case 'at_customer': {
      t.pauseT += dt;
      if (t.pauseT > UNLOAD_PAUSE) {
        side.boxesInTruck = 0;
        t.path = truckReturnRoute(side.team, t.customer ?? 'shop');
        t.travel = 0;
        side.logistics = 'truck_back';
      }
      break;
    }

    case 'truck_back': {
      if (follow(t, TRUCK_SPEED, dt)) {
        t.customer = null;
        side.logistics = 'idle';
        // Ready for the next cycle's first question.
        side.cycle++;
        side.stepIndex = 0;
        side.phase = 'awaiting';
        side.stepQuality = [];
        side.cocoaFill = 0; side.mixAmount = 0; side.moldCount = 0;
        side.barCount = 0; side.boxCount = 0;
        side.tankFill = 0; side.moldFill = 0; side.coolT = 0; side.cutT = 0; side.packT = 0;
        handlers.onStepReady?.(side.team);
      }
      break;
    }
  }
}

function startDelivery(side: SideSim) {
  const order = side.order;
  const customer: CustomerType = order?.customer ?? 'shop';
  side.truck.customer = customer;
  side.truck.path = truckRoute(side.team, customer);
  side.truck.travel = 0;
  side.logistics = 'truck_out';
  side.cyclesDone++;
  emit(side, 'truck_depart');
}

function resolveDelivery(side: SideSim) {
  const order = side.order;
  const quality = side.quality;
  const accuracy = Math.round(
    (side.stepQuality.filter((q) => q >= 70).length / Math.max(1, side.stepQuality.length)) * 100
  );
  const satisfaction = Math.round(accuracy * 0.45 + quality * 0.4 + 15);
  side.customerSatisfaction = Math.round(side.customerSatisfaction * 0.65 + satisfaction * 0.35);
  side.reaction = satisfaction >= 80 ? 'happy' : satisfaction >= 58 ? 'meh' : 'unhappy';
  side.reactionUntil = sim.elapsed + 2.6;
  emit(side, side.reaction === 'happy' ? 'customer_happy' : side.reaction === 'meh' ? 'customer_meh' : 'customer_unhappy');

  if (order) {
    const type = order.customer;
    const rel = side.relationships[type] ?? { type, ordersServed: 0, goodStreak: 0, returning: false };
    rel.ordersServed++;
    if (side.reaction !== 'unhappy') { rel.goodStreak++; if (rel.goodStreak >= 2) rel.returning = true; }
    else rel.goodStreak = 0;
    side.relationships[type] = rel;
  }

  side.ordersCompleted++;
  side.deliveries++;
  if (accuracy >= 80) side.onTimeDeliveries++;
  if (order) handlers.onCycleDelivered?.(side.team, order, satisfaction);
}

// ── FINALE: the winning factory sends its truck out ─────────────────────

export function setCelebrating(team: TeamId, on: boolean) { sim[team].celebrating = on; }

/** Sends the winner's truck out on a victory delivery, loaded with its boxes. */
export function victoryRun(team: TeamId) {
  const side = sim[team];
  side.celebrating = true;
  if (side.logistics !== 'idle') return;
  side.boxesInTruck = Math.min(CARGO_SLOTS.length, Math.max(4, side.boxCount || 4));
  side.truck.customer = side.order?.customer ?? 'festival';
  side.truck.path = truckRoute(team, side.truck.customer);
  side.truck.travel = 0;
  side.logistics = 'truck_out';
  emit(side, 'truck_depart');
}

// ── QUERIES ──────────────────────────────────────────────────────────────

export function drainEvents(): FactoryEvent[] {
  const all = [...sim.blue.events, ...sim.red.events];
  sim.blue.events = [];
  sim.red.events = [];
  return all;
}

export function cargoWorldPos(team: TeamId, index: number): Vec3 {
  const t = sim[team].truck;
  return truckLocalToWorld(t.pos, t.heading, CARGO_SLOTS[index % CARGO_SLOTS.length]);
}

export function isTeamQuiet(team: TeamId): boolean {
  const s = sim[team];
  return s.phase === 'awaiting' && s.logistics === 'idle';
}

export { sideOf, sideSign };
