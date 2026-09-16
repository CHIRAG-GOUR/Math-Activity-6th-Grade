// ============================================================
// THE CHOCOLATE FACTORY — PRODUCTION SIMULATION
//
// Mutable state stepped outside React, like the Decimal Delivery game's
// depotSim. This is where a fraction answer becomes a PHYSICAL event: the
// tank actually fills to that value, the mixer actually turns, the mold
// actually fills, the truck actually drives to the customer.
//
// The team's tapped answer — right OR wrong — is what the tank fills to.
// Correctness only drives quality, rework and waste; it never fakes the
// physical amount produced.
//
// TWO INDEPENDENT CHAINS PER TEAM, so neither team ever waits:
//
//   LINE       tank -> mixer -> mold -> cooling -> cutter -> QC -> packaging
//   LOGISTICS  loader -> truck -> customer -> truck home
//
// Packaging hands a finished SHIPMENT to the logistics queue and the line
// goes idle immediately, so a team can start its next batch while its last
// truck is still out on the road. The two teams share nothing at all.
// ============================================================

import type {
  CustomerOrder, CustomerRelationship, CustomerType, FactoryEvent, TeamId,
} from '../types';
import { toDecimal } from './fractionMath';
import {
  CARGO_SLOTS, forkliftIngredientRoute, forkliftReturnRoute, loaderCarryRoute, loaderReturnRoute,
  sideOf, sideSign, truckLocalToWorld, truckReturnRoute, truckRoute,
} from './factoryLayout';
import { angleDelta, polylineLength, samplePolyline, smooth, type Vec3 } from '../world/geom';

// Stage durations, in seconds. The whole line runs in about nine seconds, so
// a team is never left watching an animation with nothing to do.
const FILL_TIME = 1.7;
const MIX_TIME = 1.9;
const MOLD_TIME = 1.2;
const COOL_TIME = 1.3;
const CUT_TIME = 0.9;
const QC_TIME = 1.0;
const QC_REWORK_EXTRA = 1.3;
const PACK_TIME = 1.4;
const REWORK_FLASH = 1.4;

const TRUCK_SPEED = 9.0;
const CARRY_SPEED = 2.6;
const FORK_SPEED = 4.2;
const UNLOAD_PAUSE = 1.2;

export const MOLDS_PER_BATCH = 8;
export const MOLD_GRID_MAX = 16;
export const BARS_PER_BOX = 4;

export type LineStage =
  | 'idle' | 'filling' | 'mixing' | 'molding' | 'cooling' | 'cutting' | 'quality_check' | 'packaging';
export type LogisticsStage = 'idle' | 'loading' | 'outbound' | 'unloading' | 'returning';

export interface Shipment {
  order: CustomerOrder;
  boxes: number;
  quality: number;
  wasCorrect: boolean;
  attempt: 1 | 2;
}

interface Mover { pos: Vec3; heading: number; task: string; path: Vec3[]; travel: number; }

export interface SideSim {
  team: TeamId;

  // ── LINE ──
  line: LineStage;
  lineStartAt: number;
  batchOrder: CustomerOrder | null;
  batchAttempt: 1 | 2;
  batchCorrect: boolean;
  decimalValue: number;
  tankFill: number;
  tankTarget: number;
  mixerSpin: number;
  moldFill: number;
  moldCount: number;
  coolT: number;
  cutT: number;
  qcT: number;
  qcRework: boolean;
  packT: number;
  wrongFlashT: number;
  lastBatchQuality: number;
  quality: number;
  wasteUnits: number;
  reworkCount: number;

  // ── LOGISTICS ──
  logistics: LogisticsStage;
  shipments: Shipment[];
  activeShipment: Shipment | null;
  boxesAtDock: number;
  boxesInTruck: number;
  truck: Mover & { customer: CustomerType | null; pauseT: number };
  loader: Mover & { carrying: boolean };
  forklift: Mover;

  // ── PEOPLE / FEEDBACK ──
  operatorPhase: number;
  inspectorPhase: number;
  reaction: 'happy' | 'meh' | 'unhappy' | null;
  reactionUntil: number;
  celebrating: boolean;

  // ── RESULTS ──
  batchesProduced: number;
  ordersCompleted: number;
  deliveries: number;
  onTimeDeliveries: number;
  customerSatisfaction: number;
  relationships: Partial<Record<CustomerType, CustomerRelationship>>;

  events: FactoryEvent[];
}

export interface FactoryHandlers {
  /** The line finished a batch and is free — the team may be given its next question. */
  onLineIdle?: (team: TeamId) => void;
  onDelivered?: (team: TeamId, order: CustomerOrder, satisfaction: number) => void;
}
let handlers: FactoryHandlers = {};
export function setFactoryHandlers(h: FactoryHandlers) { handlers = h; }

function mover(home: Vec3): Mover { return { pos: { ...home }, heading: 0, task: 'idle', path: [], travel: 0 }; }

function makeSide(team: TeamId): SideSim {
  const s = sideOf(team);
  return {
    team,
    line: 'idle', lineStartAt: 0, batchOrder: null, batchAttempt: 1, batchCorrect: true,
    decimalValue: 0, tankFill: 0, tankTarget: 0, mixerSpin: 0, moldFill: 0, moldCount: 0,
    coolT: 0, cutT: 0, qcT: 0, qcRework: false, packT: 0, wrongFlashT: 0,
    lastBatchQuality: 92, quality: 92, wasteUnits: 0, reworkCount: 0,
    logistics: 'idle', shipments: [], activeShipment: null, boxesAtDock: 0, boxesInTruck: 0,
    truck: { ...mover(s.truckHome), customer: null, pauseT: 0 },
    loader: { ...mover(s.loaderHome), carrying: false },
    forklift: mover(s.forkliftHome),
    operatorPhase: team === 'blue' ? 0 : 1.6,
    inspectorPhase: team === 'blue' ? 0.7 : 2.1,
    reaction: null, reactionUntil: 0, celebrating: false,
    batchesProduced: 0, ordersCompleted: 0, deliveries: 0, onTimeDeliveries: 0,
    customerSatisfaction: 88, relationships: {},
    events: [],
  };
}

export const sim = { blue: makeSide('blue'), red: makeSide('red'), elapsed: 0 };
export const sideSim = (team: TeamId): SideSim => sim[team];

export function resetSim() {
  sim.blue = makeSide('blue');
  sim.red = makeSide('red');
  sim.elapsed = 0;
}

function emit(side: SideSim, kind: FactoryEvent['kind']) { side.events.push({ team: side.team, kind }); }

/** True while the team's machines are free to start another batch. */
export function lineIsFree(team: TeamId): boolean { return sim[team].line === 'idle'; }

/**
 * The team taps an answer. `selectedIndex` drives the PHYSICAL outcome whether
 * it is right or wrong. A first miss costs a rework flash and a retry; a
 * second miss actually produces that wrong quantity.
 */
export function submitAnswer(
  team: TeamId, order: CustomerOrder, selectedIndex: number, attempt: 1 | 2
): 'retry' | 'produced' | 'ignored' {
  const side = sim[team];
  if (side.line !== 'idle') return 'ignored';
  const q = order.question;
  const correct = selectedIndex === q.correctIndex;

  if (!correct && attempt === 1) {
    side.wrongFlashT = REWORK_FLASH;
    side.reworkCount++;
    emit(side, 'wrong');
    emit(side, 'rework');
    return 'retry';
  }

  const value = q.optionValues[selectedIndex] ?? q.optionValues[q.correctIndex];
  side.batchOrder = order;
  side.batchAttempt = attempt;
  side.batchCorrect = correct;
  side.decimalValue = Math.max(0.05, toDecimal(value));
  side.tankTarget = Math.min(1, side.decimalValue);
  side.tankFill = 0;
  side.mixerSpin = 0;
  side.moldFill = 0;
  side.moldCount = Math.max(1, Math.round(side.decimalValue * MOLDS_PER_BATCH));
  side.coolT = 0; side.cutT = 0; side.qcT = 0; side.packT = 0; side.qcRework = false;
  side.line = 'filling';
  side.lineStartAt = sim.elapsed;
  emit(side, correct ? 'correct' : 'wrong');
  emit(side, 'valve_open');
  return 'produced';
}

export function stepSim(rawDt: number) {
  const dt = Math.min(0.05, Math.max(0.0005, rawDt));
  sim.elapsed += dt;
  stepSide(sim.blue, dt);
  stepSide(sim.red, dt);
}

function rollQuality(side: SideSim): number {
  const range: [number, number] = side.batchCorrect
    ? (side.batchAttempt === 1 ? [90, 99] : [72, 85])
    : [35, 55];
  return Math.round(range[0] + Math.random() * (range[1] - range[0]));
}

function stepSide(side: SideSim, dt: number) {
  if (side.wrongFlashT > 0) side.wrongFlashT = Math.max(0, side.wrongFlashT - dt);
  side.operatorPhase += dt;
  side.inspectorPhase += dt;
  if (side.reactionUntil > 0 && sim.elapsed > side.reactionUntil) { side.reaction = null; side.reactionUntil = 0; }

  stepLine(side, dt);
  stepLogistics(side, dt);
  stepForklift(side, dt);
}

// ── THE PRODUCTION LINE ─────────────────────────────────────────────────

function lineElapsed(side: SideSim): number { return sim.elapsed - side.lineStartAt; }
function advance(side: SideSim, to: LineStage) { side.line = to; side.lineStartAt = sim.elapsed; }

function stepLine(side: SideSim, dt: number) {
  switch (side.line) {
    case 'idle':
      // Chocolate drains back out of the measuring tank between batches.
      side.tankFill = Math.max(0, side.tankFill - dt * 0.6);
      break;

    case 'filling': {
      const t = Math.min(1, lineElapsed(side) / FILL_TIME);
      side.tankFill = side.tankTarget * smooth(t);
      if (t >= 1) { side.tankFill = side.tankTarget; emit(side, 'mixer_start'); advance(side, 'mixing'); }
      break;
    }

    case 'mixing': {
      side.mixerSpin += dt * 3.6;
      if (lineElapsed(side) >= MIX_TIME) { emit(side, 'mold_fill'); advance(side, 'molding'); }
      break;
    }

    case 'molding': {
      const t = Math.min(1, lineElapsed(side) / MOLD_TIME);
      side.moldFill = smooth(t);
      // The measuring tank empties into the molds as they fill.
      side.tankFill = side.tankTarget * (1 - smooth(t));
      if (t >= 1) { emit(side, 'cooling_enter'); advance(side, 'cooling'); }
      break;
    }

    case 'cooling': {
      side.coolT = Math.min(1, lineElapsed(side) / COOL_TIME);
      if (side.coolT >= 1) advance(side, 'cutting');
      break;
    }

    case 'cutting': {
      side.cutT = Math.min(1, lineElapsed(side) / CUT_TIME);
      if (side.cutT >= 1) {
        emit(side, 'cut');
        side.lastBatchQuality = rollQuality(side);
        side.quality = Math.round(side.quality * 0.65 + side.lastBatchQuality * 0.35);
        side.qcRework = side.lastBatchQuality < 55;
        if (side.qcRework) { side.reworkCount++; emit(side, 'rework'); }
        advance(side, 'quality_check');
      }
      break;
    }

    case 'quality_check': {
      const dur = QC_TIME + (side.qcRework ? QC_REWORK_EXTRA : 0);
      side.qcT = Math.min(1, lineElapsed(side) / dur);
      if (side.qcT >= 1) { emit(side, 'quality_stamp'); advance(side, 'packaging'); }
      break;
    }

    case 'packaging': {
      side.packT = Math.min(1, lineElapsed(side) / PACK_TIME);
      if (side.packT < 1) break;

      // A rejected batch loses a unit to the rework bin before boxing.
      const waste = side.qcRework ? 1 : 0;
      side.wasteUnits += waste;
      const bars = Math.max(1, side.moldCount - waste);
      const boxes = Math.max(1, Math.ceil(bars / BARS_PER_BOX));
      if (side.batchOrder) {
        side.shipments.push({
          order: side.batchOrder, boxes,
          quality: side.lastBatchQuality, wasCorrect: side.batchCorrect, attempt: side.batchAttempt,
        });
      }
      side.batchesProduced++;
      side.boxesAtDock += boxes;
      side.moldFill = 0;
      side.packT = 0;
      emit(side, 'box_seal');
      advance(side, 'idle');
      // The machines are free: the team may take its next question right now,
      // while this shipment is still being loaded and driven out.
      handlers.onLineIdle?.(side.team);
      break;
    }
  }
}

// ── LOGISTICS: LOADER + TRUCK ───────────────────────────────────────────

function follow(mv: Mover, speed: number, dt: number): boolean {
  const next = mv.travel + speed * dt;
  const r = samplePolyline(mv.path, next, 0);
  mv.travel = Math.min(next, polylineLength(mv.path));
  mv.pos = r.pos;
  mv.heading += angleDelta(mv.heading, r.heading) * (1 - Math.exp(-6 * dt));
  return r.done;
}

function stepLogistics(side: SideSim, dt: number) {
  const truck = side.truck;
  const loader = side.loader;

  switch (side.logistics) {
    case 'idle': {
      const next = side.shipments.shift();
      if (!next) break;
      side.activeShipment = next;
      side.logistics = 'loading';
      loader.task = 'to_truck';
      loader.carrying = true;
      loader.path = loaderCarryRoute(side.team);
      loader.travel = 0;
      break;
    }

    case 'loading': {
      if (loader.task === 'to_truck') {
        if (follow(loader, CARRY_SPEED, dt)) {
          // Boxes physically arrive in the bed, one cargo slot each.
          const boxes = side.activeShipment?.boxes ?? 1;
          side.boxesInTruck = Math.min(CARGO_SLOTS.length, side.boxesInTruck + boxes);
          side.boxesAtDock = Math.max(0, side.boxesAtDock - boxes);
          loader.carrying = false;
          loader.task = 'return';
          loader.path = loaderReturnRoute(side.team, loader.pos);
          loader.travel = 0;
        }
      } else if (loader.task === 'return') {
        if (follow(loader, CARRY_SPEED, dt)) {
          loader.task = 'idle';
          const ship = side.activeShipment;
          if (ship) {
            truck.customer = ship.order.customer;
            truck.path = truckRoute(side.team, ship.order.customer);
            truck.travel = 0;
            side.logistics = 'outbound';
            emit(side, 'truck_depart');
          } else {
            side.logistics = 'idle';
          }
        }
      }
      break;
    }

    case 'outbound': {
      if (follow(truck, TRUCK_SPEED, dt)) {
        truck.pauseT = 0;
        side.logistics = 'unloading';
        emit(side, 'truck_arrive');
        resolveDelivery(side);
      }
      break;
    }

    case 'unloading': {
      truck.pauseT += dt;
      if (truck.pauseT > UNLOAD_PAUSE) {
        side.boxesInTruck = 0;
        truck.path = truckReturnRoute(side.team, truck.customer ?? 'shop');
        truck.travel = 0;
        side.logistics = 'returning';
      }
      break;
    }

    case 'returning': {
      if (follow(truck, TRUCK_SPEED, dt)) {
        truck.customer = null;
        side.activeShipment = null;
        side.logistics = 'idle';
      }
      break;
    }
  }
}

function resolveDelivery(side: SideSim) {
  const ship = side.activeShipment;
  if (!ship) return;

  const accuracy = ship.wasCorrect ? (ship.attempt === 1 ? 100 : 82) : 40;
  const speed = ship.attempt === 1 ? 94 : 76;
  const satisfaction = Math.round(accuracy * 0.4 + ship.quality * 0.35 + speed * 0.25);
  side.customerSatisfaction = Math.round(side.customerSatisfaction * 0.7 + satisfaction * 0.3);
  side.reaction = satisfaction >= 80 ? 'happy' : satisfaction >= 55 ? 'meh' : 'unhappy';
  side.reactionUntil = sim.elapsed + 2.4;
  emit(side, side.reaction === 'happy' ? 'customer_happy' : side.reaction === 'meh' ? 'customer_meh' : 'customer_unhappy');

  const type = ship.order.customer;
  const rel = side.relationships[type] ?? { type, ordersServed: 0, goodStreak: 0, returning: false };
  rel.ordersServed++;
  if (side.reaction !== 'unhappy') {
    rel.goodStreak++;
    if (rel.goodStreak >= 2) rel.returning = true;
  } else rel.goodStreak = 0;
  side.relationships[type] = rel;

  side.ordersCompleted++;
  side.deliveries++;
  if (ship.wasCorrect && ship.attempt === 1) side.onTimeDeliveries++;
  handlers.onDelivered?.(side.team, ship.order, satisfaction);
}

// ── FORKLIFT: ingredients out of the warehouse while a batch is mixing ──

function stepForklift(side: SideSim, dt: number) {
  const f = side.forklift;
  const wantActive = side.line === 'filling' || side.line === 'mixing';

  if (wantActive && f.task === 'idle') {
    f.task = 'to_tank';
    f.path = forkliftIngredientRoute(side.team);
    f.travel = 0;
  } else if (!wantActive && f.task === 'at_tank') {
    f.task = 'return';
    f.path = forkliftReturnRoute(side.team, f.pos);
    f.travel = 0;
  }

  if (f.task === 'to_tank') { if (follow(f, FORK_SPEED, dt)) f.task = 'at_tank'; }
  else if (f.task === 'return') { if (follow(f, FORK_SPEED, dt)) f.task = 'idle'; }
}

// ── QUERIES FOR THE RENDERER / UI ───────────────────────────────────────

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

/** Nothing left in flight — used to decide when the match can be scored. */
export function isTeamQuiet(team: TeamId): boolean {
  const s = sim[team];
  return s.line === 'idle' && s.logistics === 'idle' && s.shipments.length === 0;
}

export function setCelebrating(team: TeamId, on: boolean) { sim[team].celebrating = on; }

export { sideOf, sideSign };
