// ============================================================
// THE CHOCOLATE FACTORY — PRODUCTION SIMULATION
//
// ONE QUESTION = ONE STEP OF THE PRODUCTION CHAIN. A level is one customer
// order made in five steps, and each correct fraction becomes REAL WORK:
//
//   correct fraction
//     -> production task created
//     -> a worker receives it, walks to the station, turns to the machine
//     -> the machine starts only once the worker is there operating it
//     -> chocolate moves on to the next station
//
//   1 COCOA      loaders carry sacks from the store and tip them into the tank
//                (a heavy load comes over on the forklift instead)
//   2 MIX        the operator walks to the mixer desk and runs the mixer
//   3 MOLD       the operator walks to the molder and pours the molds
//   4 COOL & CUT the inspector starts the tunnel, then checks the cutter
//   5 BOX        the packer runs the packing machine; boxes stack up
//   LOADING      the hauler pushes the cart to the stack, loads the boxes,
//                pushes them to the truck and loads them into the bed
//                (a big load goes on the forklift, the hauler unloads it)
//   DELIVERY     the truck drives the order to the customer — level complete
//
// The educational state and the visual simulation are separate: every stage
// that waits on a worker has a timeout fallback, so a navigation problem can
// slow the factory down but can never stop a team finishing its level.
// ============================================================

import type {
  CustomerOrder, CustomerRelationship, CustomerType, FactoryEvent, TeamId,
} from '../types';
import { toDecimal } from './fractionMath';
import {
  CARGO_SLOTS, forkliftCocoaRoute, forkliftCocoaToTank, forkliftHomeRoute,
  forkliftPalletRoute, forkliftToTruck,
  sideOf, sideSign, truckLocalToWorld, truckReturnRoute, truckRoute,
} from './factoryLayout';
import {
  assignTasks, hasTask, isOnProduction, makeTask, makeWorker, stepWorker,
  type CrewHooks, type CrewTask, type Worker,
} from './crew';
import { stationPos } from './crewNav';
import { angleDelta, headingTo, polylineLength, samplePolyline, smooth, type Vec3 } from '../world/geom';

export type { Worker } from './crew';

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

/** How long each machine runs once its worker has started it. */
const STEP_TIME: Record<StepId, number> = {
  ingredients: 3.5,
  mixing: 4.0,
  molding: 3.6,
  cooling: 5.0,
  packaging: 4.2,
};

export const MAX_MOLDS = 12;
export const MAX_BARS = 20;
export const MAX_BOXES = 5;

/** Anything above this much of a tank is too heavy to carry by hand. */
export const FORKLIFT_LOAD_THRESHOLD = 0.5;

const REWORK_FLASH = 1.5;
const TRUCK_SPEED = 18.0;
const FORK_SPEED = 6.5;
const UNLOAD_PAUSE = 0.8;

/** A machine waits this long for its worker before starting on its own. */
const MACHINE_GATE_TIMEOUT = 16;
/** Hand-carried cocoa: if the sacks are not in by now the feed valve finishes the job. */
const COCOA_TIMEOUT = 32;
/** Cart loading: if the boxes are not aboard by now they are loaded directly. */
const LOADING_TIMEOUT = 50;
/** The forklift waits this long at the truck for the hauler before unloading itself. */
const FORK_UNLOAD_WAIT = 12;

const SACK_POUR_TIME = 1.3;
const BOX_HANDLE_TIME = 0.55;

// ── STATE ────────────────────────────────────────────────────────────────

export type StepPhase = 'awaiting' | 'running';
export type Logistics =
  | 'idle' | 'fork_to_pallet' | 'fork_lift' | 'fork_to_truck' | 'fork_unload'
  | 'fork_return' | 'truck_out' | 'at_customer' | 'truck_back'
  // A big cocoa load is brought over on the forklift instead of by hand.
  | 'cocoa_to_stack' | 'cocoa_lift' | 'cocoa_to_tank' | 'cocoa_pour' | 'cocoa_return'
  // A small load of boxes goes out on the hauler's cart.
  | 'cart_to_stack' | 'cart_loading' | 'cart_to_truck' | 'truck_loading';

interface Mover {
  pos: Vec3; heading: number; task: string; path: Vec3[]; travel: number;
  carrying: boolean; phase: number; moving: boolean;
}

export interface Cart {
  pos: Vec3;
  heading: number;
  boxes: number;
}

export interface SideSim {
  team: TeamId;

  // ── cycle / step ──
  cycle: number;
  stepIndex: number;
  phase: StepPhase;
  stepT: number;
  stepStartAt: number;
  /** When the current step's fraction was accepted. */
  answeredAt: number;
  /** True once the step's worker has reached their machine and started it. */
  machineOn: boolean;
  order: CustomerOrder | null;
  attemptUsed: 1 | 2;
  lastCorrect: boolean;
  wrongFlashT: number;

  // ── quantities, each one set by the fraction answered at that step ──
  cocoaFill: number;
  cocoaByForklift: boolean;
  forkliftLoad: 'none' | 'cocoa' | 'boxes';
  mixAmount: number;
  moldCount: number;
  barCount: number;
  boxCount: number;

  // ── hand-carried cocoa ──
  sacksPlanned: number;
  sacksTaken: number;
  sacksPoured: number;
  sackSize: number;

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
  logisticsSince: number;
  boxesOnPallet: number;
  boxesInTruck: number;
  forkLift: number;
  truck: Mover & { customer: CustomerType | null; pauseT: number };
  forklift: Mover;
  cart: Cart;

  // ── the crew ──
  crew: Worker[];
  handlers: Worker[];
  operator: Worker;
  inspector: Worker;
  packer: Worker;
  hauler: Worker;
  /** How many times a fallback had to keep production moving (debug). */
  fallbacks: number;
  lastFallback: string;

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
  /** A full five-step order was delivered to its customer. */
  onCycleDelivered?: (team: TeamId, order: CustomerOrder, satisfaction: number) => void;
}
let handlers: FactoryHandlers = {};
export function setFactoryHandlers(h: FactoryHandlers) { handlers = h; }

function mover(home: Vec3): Mover {
  return { pos: { ...home }, heading: 0, task: 'idle', path: [], travel: 0, carrying: false, phase: Math.random() * 6, moving: false };
}

function makeSide(team: TeamId): SideSim {
  const s = sideOf(team);
  const loaderA = makeWorker(team, `${team}-1`, 'INGREDIENT WORKER A', 'loader', 'STORE_A');
  const loaderB = makeWorker(team, `${team}-2`, 'INGREDIENT WORKER B', 'loader', 'W_DOOR');
  const operator = makeWorker(team, `${team}-3`, 'PRODUCTION WORKER', 'operator', 'OP_LOG');
  const inspector = makeWorker(team, `${team}-4`, 'QUALITY WORKER', 'inspector', 'QC_W');
  const packer = makeWorker(team, `${team}-5`, 'PACKAGING WORKER', 'packer', 'BOX_SUPPLY');
  const hauler = makeWorker(team, `${team}-6`, 'LOADING WORKER', 'hauler', 'CART_BAY');
  loaderB.routine = 1;
  const bay = stationPos(team, 'CART_BAY');
  return {
    team,
    cycle: 0, stepIndex: 0, phase: 'awaiting', stepT: 0, stepStartAt: 0, answeredAt: 0, machineOn: false,
    order: null, attemptUsed: 1, lastCorrect: true, wrongFlashT: 0,
    cocoaFill: 0, cocoaByForklift: false, forkliftLoad: 'none', mixAmount: 0, moldCount: 0, barCount: 0, boxCount: 0,
    sacksPlanned: 0, sacksTaken: 0, sacksPoured: 0, sackSize: 0,
    tankFill: 0, mixerSpin: 0, moldFill: 0, coolT: 0, cutT: 0, packT: 0, tipPour: 0,
    stepQuality: [], quality: 92, wasteUnits: 0, reworkCount: 0,
    logistics: 'idle', logisticsSince: 0, boxesOnPallet: 0, boxesInTruck: 0, forkLift: 0.2,
    truck: { ...mover(s.truckHome), customer: null, pauseT: 0 },
    forklift: mover(s.forkliftHome),
    cart: { pos: { x: bay.x, y: 0, z: bay.z + 1.2 }, heading: Math.PI, boxes: 0 },
    crew: [loaderA, loaderB, operator, inspector, packer, hauler],
    handlers: [loaderA, loaderB], operator, inspector, packer, hauler,
    fallbacks: 0, lastFallback: '',
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

function setLogistics(side: SideSim, l: Logistics) {
  if (side.logistics !== l) { side.logistics = l; side.logisticsSince = sim.elapsed; }
}

function fallback(side: SideSim, what: string) {
  side.fallbacks++;
  side.lastFallback = what;
}

export const currentStep = (team: TeamId): StepId => STEPS[Math.min(STEPS.length - 1, sim[team].stepIndex)];
export const stepIsOpen = (team: TeamId): boolean => sim[team].phase === 'awaiting';

/** The step whose machine is actually running right now (worker has started it). */
export function runningStep(team: TeamId): StepId | null {
  const s = sim[team];
  return s.phase === 'running' && s.machineOn ? STEPS[Math.min(STEPS.length - 1, s.stepIndex)] : null;
}

/** The step a team has answered and is being worked on (machine may still be waiting for its worker). */
export function activeStep(team: TeamId): StepId | null {
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
 * The team taps an answer for the CURRENT step. A wrong answer holds the line
 * (rework flash, retry). A correct one sets that step's quantity and hands the
 * job to the worker who does it.
 */
export function submitAnswer(
  team: TeamId, order: CustomerOrder, selectedIndex: number, attempt: 1 | 2
): 'retry' | 'applied' | 'ignored' {
  const side = sim[team];
  if (side.phase !== 'awaiting') return 'ignored';
  const q = order.question;
  const correct = selectedIndex === q.correctIndex;

  if (!correct) {
    side.wrongFlashT = REWORK_FLASH;
    side.reworkCount++;
    emit(side, 'wrong');
    emit(side, 'rework');
    return 'retry';
  }

  const value = Math.max(0.08, Math.min(1.6, toDecimal(q.optionValues[selectedIndex] ?? q.optionValues[q.correctIndex])));
  side.order = order;
  side.attemptUsed = attempt;
  side.lastCorrect = true;
  side.machineOn = false;
  side.answeredAt = sim.elapsed;

  const step = STEPS[side.stepIndex];
  switch (step) {
    case 'ingredients': {
      side.cocoaFill = Math.min(1, value);
      side.tankFill = 0;
      side.tipPour = 0;
      side.cocoaByForklift = side.cocoaFill >= FORKLIFT_LOAD_THRESHOLD;
      if (side.cocoaByForklift) {
        setLogistics(side, 'cocoa_to_stack');
        side.forklift.task = 'to_cocoa';
        side.forklift.path = forkliftCocoaRoute(side.team, side.forklift.pos);
        side.forklift.travel = 0;
        emit(side, 'forklift_beep');
        // Loader A opens the tank hopper and guides the forklift in.
        assignTasks(side.handlers[0], [makeTask('GUIDE_FORKLIFT', 'TIP_B', { anim: 'operate', production: true })]);
      } else {
        // Roughly a fifth of a tank per sack, at least one sack per loader.
        side.sacksPlanned = Math.max(2, Math.ceil(side.cocoaFill / 0.2));
        side.sackSize = side.cocoaFill / side.sacksPlanned;
        side.sacksTaken = 0;
        side.sacksPoured = 0;
      }
      // The tank itself is the machine for this step.
      side.machineOn = true;
      emit(side, 'valve_open');
      break;
    }
    case 'mixing':
      side.mixAmount = Math.min(1, value);
      side.mixerSpin = 0;
      assignTasks(side.operator, [makeTask('OPERATE_MIXER', 'MIX_W', { anim: 'operate', production: true })]);
      break;
    case 'molding':
      side.moldCount = Math.max(1, Math.round(value * MAX_MOLDS));
      side.moldFill = 0;
      assignTasks(side.operator, [makeTask('OPERATE_MOLDER', 'MOLD_W', { anim: 'operate', production: true })]);
      break;
    case 'cooling':
      side.barCount = Math.max(1, Math.round(value * MAX_BARS));
      side.coolT = 0; side.cutT = 0;
      assignTasks(side.inspector, [
        makeTask('START_COOLING', 'COOL_W', { anim: 'operate', production: true }),
        makeTask('CHECK_CUT', 'CUT_W', { anim: 'inspect', production: true }),
        makeTask('CHECK_BATCH', 'QC_W', { anim: 'inspect', duration: 2.5 }),
      ]);
      break;
    case 'packaging':
      side.boxCount = Math.max(1, Math.min(MAX_BOXES, Math.round(value * MAX_BOXES)));
      side.packT = 0;
      side.boxesOnPallet = 0;
      assignTasks(side.packer, [makeTask('PACKAGE_PRODUCT', 'PACK_W', { anim: 'pack', production: true })]);
      break;
  }

  // Quality for this step: clean first-time work runs best.
  const quality = attempt === 1 ? 90 + Math.round(Math.random() * 9) : 75 + Math.round(Math.random() * 10);
  side.stepQuality.push(quality);
  side.quality = Math.round(side.stepQuality.reduce((a, b) => a + b, 0) / side.stepQuality.length);

  side.phase = 'running';
  side.stepT = 0;
  side.stepStartAt = sim.elapsed;
  emit(side, 'correct');
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

  foreman(side);
  const hooks = hooksFor(side);
  for (const w of side.crew) {
    w.phase += dt * (w.moving ? 9 : 1.5);
    stepWorker(w, side.crew, hooks, dt);
  }
  stepCart(side, dt);
  if (side.phase === 'running') runStep(side, dt);
  stepLogistics(side, dt);
}

/** Starts the machine for the current step (called when its worker arrives). */
function startMachine(side: SideSim) {
  if (side.machineOn || side.phase !== 'running') return;
  side.machineOn = true;
  side.stepStartAt = sim.elapsed;
  switch (STEPS[side.stepIndex]) {
    case 'mixing': emit(side, 'mixer_start'); break;
    case 'molding': emit(side, 'mold_fill'); break;
    case 'cooling': emit(side, 'cooling_enter'); break;
    case 'packaging': emit(side, 'box_seal'); break;
  }
}

function runStep(side: SideSim, dt: number) {
  const step = STEPS[side.stepIndex];

  if (!side.machineOn) {
    // Waiting for the worker to reach the machine — never forever.
    if (sim.elapsed - side.answeredAt > MACHINE_GATE_TIMEOUT) {
      fallback(side, `${step}: machine started without its worker`);
      startMachine(side);
    }
    return;
  }

  const dur = STEP_TIME[step];
  let t = Math.min(1, (sim.elapsed - side.stepStartAt) / dur);

  switch (step) {
    case 'ingredients': {
      // Finished by the WORK, not a stopwatch: it ends when the answered amount
      // is physically in the tank.
      const late = sim.elapsed - side.answeredAt > COCOA_TIMEOUT;
      if (late && side.tankFill < side.cocoaFill) {
        if (side.tipPour === 0) fallback(side, 'cocoa: feed valve topped up the tank');
        side.tipPour = 1;
        side.tankFill = Math.min(side.cocoaFill, side.tankFill + 0.35 * dt);
      }
      const filled = side.cocoaFill > 0 ? side.tankFill / side.cocoaFill : 1;
      t = filled >= 0.999 ? 1 : Math.min(0.99, filled);
      if (t >= 1) { side.tankFill = side.cocoaFill; side.tipPour = 0; }
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
    side.phase = 'awaiting';
    side.machineOn = false;
    beginLoading(side);
    return;
  }

  side.stepIndex++;
  side.phase = 'awaiting';
  side.machineOn = false;
  handlers.onStepReady?.(side.team);
}

// ── THE FOREMAN: turns production state into worker tasks ───────────────

function foreman(side: SideSim) {
  const step = STEPS[side.stepIndex];

  // Hand-carried cocoa: keep both loaders on sack runs until enough sacks are out.
  if (side.phase === 'running' && step === 'ingredients' && !side.cocoaByForklift) {
    side.handlers.forEach((l, i) => {
      if (side.sacksTaken >= side.sacksPlanned) return;
      if (isOnProduction(l)) return;
      side.sacksTaken++;
      const store = i === 0 ? 'STORE_A' : 'STORE_B';
      const tip = i === 0 ? 'TIP_A' : 'TIP_B';
      const tasks: CrewTask[] = [];
      // Already walking a sack in from the warehouse? Take that one straight to the tank.
      if (l.carry !== 'sack') tasks.push(makeTask('FETCH_INGREDIENT', store, { anim: 'pickup', production: true }));
      tasks.push(makeTask('TRANSFER_INGREDIENT', tip, { anim: 'pour', pace: 'carry', production: true }));
      assignTasks(l, tasks);
    });
  }
}

/** After boxing: the cart for a small load, the forklift for a big one. */
function beginLoading(side: SideSim) {
  if (side.boxCount <= 2) {
    setLogistics(side, 'cart_to_stack');
    const tasks: CrewTask[] = [];
    if (!side.hauler.pushingCart) tasks.push(makeTask('FETCH_CART', 'CART_BAY', { anim: 'pickup', production: true }));
    tasks.push(
      makeTask('LOAD_CART', 'STACK_W', { anim: 'load', pace: 'push', production: true }),
      makeTask('MOVE_PACKAGE', 'TRUCK_W', { anim: 'idle', pace: 'push', production: true, duration: 0.2 }),
      makeTask('LOAD_TRUCK', 'TRUCK_W', { anim: 'load', pace: 'push', production: true }),
      makeTask('RETURN_CART', 'CART_BAY', { anim: 'idle', pace: 'push', duration: 0.6 }),
    );
    assignTasks(side.hauler, tasks);
  } else {
    setLogistics(side, 'fork_to_pallet');
    side.forklift.task = 'to_pallet';
    side.forklift.path = forkliftPalletRoute(side.team, side.forklift.pos);
    side.forklift.travel = 0;
    // The hauler goes to meet the forklift at the truck and unloads its pallet.
    assignTasks(side.hauler, [makeTask('UNLOAD_FORKLIFT', 'LIFT_W', { anim: 'load', production: true })]);
  }
}

function hooksFor(side: SideSim): CrewHooks {
  return {
    onStart: (_w, task) => {
      switch (task.type) {
        case 'OPERATE_MIXER':
          if (STEPS[side.stepIndex] === 'mixing') startMachine(side);
          break;
        case 'OPERATE_MOLDER':
          if (STEPS[side.stepIndex] === 'molding') startMachine(side);
          break;
        case 'START_COOLING':
          if (STEPS[side.stepIndex] === 'cooling') startMachine(side);
          break;
        case 'PACKAGE_PRODUCT':
          if (STEPS[side.stepIndex] === 'packaging') startMachine(side);
          break;
        case 'LOAD_CART':
          setLogistics(side, 'cart_loading');
          break;
        case 'LOAD_TRUCK':
          setLogistics(side, 'truck_loading');
          break;
      }
    },

    work: (w, task, dt) => {
      const step = STEPS[side.stepIndex];
      const running = side.phase === 'running';
      switch (task.type) {
        // ── STEP 1 ──
        case 'FETCH_INGREDIENT':
          if (w.workT >= 0.9) { w.carry = 'sack'; return true; }
          return false;

        case 'TRANSFER_INGREDIENT': {
          if (w.carry !== 'sack') return true;
          // The feed valve already finished this batch (fallback): take the sack back.
          if (step !== 'ingredients' || !running) return true;
          side.tipPour = 1;
          const give = Math.min(side.sackSize * (dt / SACK_POUR_TIME), side.sackSize - task.progress * side.sackSize);
          task.progress = Math.min(1, task.progress + give / Math.max(1e-6, side.sackSize));
          side.tankFill = Math.min(side.cocoaFill, side.tankFill + give);
          if (task.progress >= 0.999) {
            w.carry = 'none';
            side.sacksPoured++;
            if (!side.crew.some((o) => o !== w && o.task?.type === 'TRANSFER_INGREDIENT' && o.state === 'PERFORM_TASK')) side.tipPour = 0;
            if (side.sacksPoured >= side.sacksPlanned) side.tankFill = side.cocoaFill;
            emit(side, 'mold_fill');
            return true;
          }
          return false;
        }

        case 'GUIDE_FORKLIFT':
          return !(running && step === 'ingredients');

        // ── STEPS 2-5: stay at the machine for as long as it runs ──
        case 'OPERATE_MIXER':
          if (running && step === 'mixing' && !side.machineOn) startMachine(side);
          return !(running && step === 'mixing');
        case 'OPERATE_MOLDER':
          if (running && step === 'molding' && !side.machineOn) startMachine(side);
          return !(running && step === 'molding');
        case 'START_COOLING':
          if (running && step === 'cooling' && !side.machineOn) startMachine(side);
          // Hand over to the cutter once the bars leave the tunnel.
          return !(running && step === 'cooling') || side.coolT >= 0.85;
        case 'CHECK_CUT':
          return !(running && step === 'cooling');
        case 'PACKAGE_PRODUCT':
          if (running && step === 'packaging' && !side.machineOn) startMachine(side);
          return !(running && step === 'packaging');

        // ── LOADING BY CART ──
        case 'FETCH_CART':
          if (w.workT >= 0.6) { w.pushingCart = true; return true; }
          return false;

        case 'LOAD_CART': {
          if (side.boxesOnPallet <= 0) return side.cart.boxes > 0 || side.logistics !== 'cart_loading';
          if (w.workT >= BOX_HANDLE_TIME) {
            w.workT = 0;
            side.boxesOnPallet--;
            side.cart.boxes++;
            emit(side, 'box_seal');
          }
          w.carry = w.workT > BOX_HANDLE_TIME * 0.4 ? 'box' : 'none';
          if (side.boxesOnPallet <= 0) { w.carry = 'none'; setLogistics(side, 'cart_to_truck'); return true; }
          return false;
        }

        case 'LOAD_TRUCK': {
          if (side.cart.boxes <= 0) {
            w.carry = 'none';
            if (side.logistics === 'truck_loading') startDelivery(side);
            return true;
          }
          w.carry = w.workT > BOX_HANDLE_TIME * 0.5 ? 'none' : 'box';
          if (w.workT >= BOX_HANDLE_TIME) {
            w.workT = 0;
            side.cart.boxes--;
            side.boxesInTruck = Math.min(CARGO_SLOTS.length, side.boxesInTruck + 1);
            emit(side, 'box_seal');
          }
          return false;
        }

        case 'RETURN_CART':
          if (w.workT >= task.duration) { w.pushingCart = false; return true; }
          return false;

        // ── LOADING BY FORKLIFT ──
        case 'UNLOAD_FORKLIFT': {
          if (side.logistics === 'fork_to_pallet' || side.logistics === 'fork_lift' || side.logistics === 'fork_to_truck') {
            w.anim = 'idle';
            return false;
          }
          if (side.logistics !== 'fork_unload') { w.carry = 'none'; return true; }
          w.carry = w.workT > BOX_HANDLE_TIME * 0.5 ? 'none' : 'box';
          if (w.workT >= BOX_HANDLE_TIME) {
            w.workT = 0;
            if (side.boxesOnPallet > 0) {
              side.boxesOnPallet--;
              side.boxesInTruck = Math.min(CARGO_SLOTS.length, side.boxesInTruck + 1);
              emit(side, 'box_seal');
            }
          }
          if (side.boxesOnPallet <= 0) { w.carry = 'none'; forkliftDone(side); return true; }
          return false;
        }

        // ── ROUTINE ──
        case 'RESTOCK_PICKUP':
          if (w.workT >= task.duration) { w.carry = 'sack'; return true; }
          return false;
        case 'RESTOCK_DROP':
          if (w.workT >= task.duration) { w.carry = 'none'; return true; }
          return false;

        default:
          return w.workT >= task.duration;
      }
    },

    routine: (w) => routineFor(side, w),
  };
}

/**
 * What each worker does between production jobs. Every stop is a real station
 * with real work — restocking sacks, checking machines, preparing boxes — so
 * the factory is busy while the students think, never a loop of pacing.
 */
function routineFor(side: SideSim, w: Worker): CrewTask | null {
  const r = w.routine++;
  switch (w.role) {
    case 'loader': {
      const store = w === side.handlers[0] ? 'STORE_A' : 'STORE_B';
      if (w.carry === 'sack') return makeTask('RESTOCK_DROP', store, { anim: 'pickup', pace: 'carry', duration: 1.0 });
      return r % 2 === 0
        ? makeTask('RESTOCK_PICKUP', 'W_DOOR', { anim: 'pickup', duration: 1.1 })
        : makeTask('STAND_BY', store, { anim: 'inspect', duration: 2.6 + (w === side.handlers[0] ? 0 : 1.2) });
    }
    case 'operator':
      // Logs readings at the lectern and checks the tank gauge between batches.
      return r % 2 === 0
        ? makeTask('MACHINE_ROUNDS', 'OP_LOG', { anim: 'operate', duration: 4.5 })
        : makeTask('MACHINE_ROUNDS', 'OP_TANK', { anim: 'inspect', duration: 3.5 });
    case 'inspector':
      // Samples bars at the QC table and tests them at the lab bench.
      return r % 2 === 0
        ? makeTask('CHECK_BATCH', 'QC_W', { anim: 'inspect', duration: 3.6 })
        : makeTask('CHECK_BATCH', 'QC_LAB', { anim: 'pack', duration: 3.4 });
    case 'packer': {
      // Folds flat boxes at the supply shelf and squares up the box stack —
      // keeping off the stack while a forklift or cart is working it.
      const stackBusy = side.logistics !== 'idle' && !side.logistics.startsWith('truck') && !side.logistics.startsWith('at_');
      if (r % 2 === 1 && !stackBusy) return makeTask('PREP_BOXES', 'STACK_W', { anim: 'pickup', duration: 2.6 });
      return makeTask('PREP_BOXES', 'BOX_SUPPLY', { anim: 'pack', duration: 4.2 });
    }
    case 'hauler': {
      if (w.pushingCart) return makeTask('RETURN_CART', 'CART_BAY', { anim: 'idle', pace: 'push', duration: 0.6 });
      const truckHome = side.logistics === 'idle';
      if (r % 2 === 1 && truckHome) return makeTask('TRUCK_CHECK', 'TRUCK_W', { anim: 'inspect', duration: 3.0 });
      return makeTask('STAND_BY', 'CART_BAY', { anim: 'inspect', duration: 3.2 });
    }
  }
  return null;
}

// ── THE CART ────────────────────────────────────────────────────────────

function stepCart(side: SideSim, dt: number) {
  const h = side.hauler;
  const c = side.cart;
  if (h.pushingCart) {
    // Held in front of the hauler's hands, never floating behind.
    const fx = -Math.sin(h.heading);
    const fz = -Math.cos(h.heading);
    c.pos = { x: h.pos.x + fx * 1.05, y: 0, z: h.pos.z + fz * 1.05 };
    c.heading += angleDelta(c.heading, h.heading) * Math.min(1, 12 * dt);
  }
}

// ── LOGISTICS: forklift runs, then the truck ─────────────────────────────

function follow(mv: Mover, speed: number, dt: number): boolean {
  if (mv.path.length < 2) { mv.moving = false; return true; }
  const next = mv.travel + speed * dt;
  const r = samplePolyline(mv.path, next, 0);
  mv.travel = Math.min(next, polylineLength(mv.path));
  const moved = Math.hypot(r.pos.x - mv.pos.x, r.pos.z - mv.pos.z);
  mv.moving = moved > 1e-4;
  mv.pos = r.pos;
  mv.heading += angleDelta(mv.heading, r.heading) * (1 - Math.exp(-7 * dt));
  return r.done;
}

function forkliftDone(side: SideSim) {
  const f = side.forklift;
  f.carrying = false;
  side.forkliftLoad = 'none';
  side.boxesOnPallet = 0;
  side.forkLift = 0.2;
  setLogistics(side, 'fork_return');
  f.task = 'returning';
  f.path = forkliftHomeRoute(side.team, f.pos);
  f.travel = 0;
}

function stepLogistics(side: SideSim, dt: number) {
  const f = side.forklift;
  const t = side.truck;
  f.phase += dt;

  switch (side.logistics) {
    case 'idle':
      break;

    // ── heavy cocoa by forklift ──
    case 'cocoa_to_stack': {
      if (follow(f, FORK_SPEED, dt)) {
        setLogistics(side, 'cocoa_lift');
        f.task = 'lifting';
        side.forkLift = 0.2;
      }
      break;
    }
    case 'cocoa_lift': {
      side.forkLift = Math.min(1.0, side.forkLift + dt * 1.3);
      if (side.forkLift >= 0.95) {
        f.carrying = true;
        side.forkliftLoad = 'cocoa';
        setLogistics(side, 'cocoa_to_tank');
        f.task = 'hauling';
        f.path = forkliftCocoaToTank(side.team, f.pos);
        f.travel = 0;
      }
      break;
    }
    case 'cocoa_to_tank': {
      if (follow(f, FORK_SPEED * 0.85, dt)) {
        setLogistics(side, 'cocoa_pour');
        f.task = 'pouring';
      }
      break;
    }
    case 'cocoa_pour': {
      side.forkLift = Math.min(1.9, side.forkLift + dt * 0.7);
      side.tipPour = 1;
      side.tankFill = Math.min(side.cocoaFill, side.tankFill + (side.cocoaFill / 2.4) * dt);
      if (side.cocoaFill - side.tankFill < 1e-4) side.tankFill = side.cocoaFill;
      if (side.tankFill >= side.cocoaFill - 1e-4) {
        side.tipPour = 0;
        f.carrying = false;
        side.forkliftLoad = 'none';
        side.forkLift = 0.2;
        setLogistics(side, 'cocoa_return');
        f.task = 'returning';
        f.path = forkliftHomeRoute(side.team, f.pos);
        f.travel = 0;
      }
      break;
    }
    case 'cocoa_return': {
      if (follow(f, FORK_SPEED, dt)) { f.task = 'idle'; setLogistics(side, 'idle'); }
      break;
    }

    // ── boxes by forklift ──
    case 'fork_to_pallet': {
      if (follow(f, FORK_SPEED, dt)) {
        setLogistics(side, 'fork_lift');
        f.task = 'lifting';
        f.travel = 0;
        emit(side, 'forklift_beep');
      }
      break;
    }
    case 'fork_lift': {
      side.forkLift = Math.min(1.1, side.forkLift + dt * 2.4);
      if (side.forkLift >= 1.05) {
        f.carrying = true;
        side.forkliftLoad = 'boxes';
        setLogistics(side, 'fork_to_truck');
        f.task = 'hauling';
        f.path = forkliftToTruck(side.team, f.pos);
        f.travel = 0;
      }
      break;
    }
    case 'fork_to_truck': {
      if (follow(f, FORK_SPEED, dt)) {
        setLogistics(side, 'fork_unload');
        t.pauseT = 0;
      }
      break;
    }
    case 'fork_unload': {
      // The hauler lifts the boxes off the forks into the bed (see UNLOAD_FORKLIFT).
      t.pauseT += dt;
      const haulerUnloading = side.hauler.task?.type === 'UNLOAD_FORKLIFT' && side.hauler.state === 'PERFORM_TASK';
      if (!haulerUnloading && t.pauseT > FORK_UNLOAD_WAIT) {
        if (Math.floor((t.pauseT - FORK_UNLOAD_WAIT) / 0.3) > Math.floor((t.pauseT - FORK_UNLOAD_WAIT - dt) / 0.3) && side.boxesOnPallet > 0) {
          if (side.boxesOnPallet === side.boxCount) fallback(side, 'forklift unloaded without the hauler');
          side.boxesOnPallet--;
          side.boxesInTruck = Math.min(CARGO_SLOTS.length, side.boxesInTruck + 1);
          emit(side, 'box_seal');
        }
        if (side.boxesOnPallet <= 0) forkliftDone(side);
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

    // ── boxes by cart: the hauler's tasks drive these; this is only the safety net ──
    case 'cart_to_stack':
    case 'cart_loading':
    case 'cart_to_truck':
    case 'truck_loading': {
      if (sim.elapsed - side.answeredAt > LOADING_TIMEOUT) {
        fallback(side, 'boxes loaded without the cart');
        side.boxesInTruck = Math.min(CARGO_SLOTS.length, side.boxesInTruck + side.boxesOnPallet + side.cart.boxes);
        side.boxesOnPallet = 0;
        side.cart.boxes = 0;
        startDelivery(side);
      }
      break;
    }

    // ── the truck ──
    case 'truck_out': {
      if (follow(t, TRUCK_SPEED, dt)) {
        t.pauseT = 0;
        setLogistics(side, 'at_customer');
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
        setLogistics(side, 'truck_back');
      }
      break;
    }
    case 'truck_back': {
      if (follow(t, TRUCK_SPEED, dt)) {
        t.customer = null;
        setLogistics(side, 'idle');
        // Ready for the next level's first question.
        side.cycle++;
        side.stepIndex = 0;
        side.phase = 'awaiting';
        side.machineOn = false;
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
  if (side.logistics === 'truck_out') return;
  // Any cart work still queued for this load is finished.
  side.hauler.queue = side.hauler.queue.filter((q) => q.type === 'RETURN_CART');
  const order = side.order;
  const customer: CustomerType = order?.customer ?? 'shop';
  side.truck.customer = customer;
  side.truck.path = truckRoute(side.team, customer);
  side.truck.travel = 0;
  setLogistics(side, 'truck_out');
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
  setLogistics(side, 'truck_out');
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

export { hasTask, headingTo, sideOf, sideSign };
