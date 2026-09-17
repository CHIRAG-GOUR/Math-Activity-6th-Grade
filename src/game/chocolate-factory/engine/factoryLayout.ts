// ============================================================
// THE CHOCOLATE FACTORY — WORLD LAYOUT
//
// One canonical BLUE layout, mirrored through X = 0 for RED — exactly the
// approach used in the Decimal Delivery game. Blue runs down the -X side,
// Red down the +X side, both facing the shared central atrium and, further
// out, the same set of customer buildings.
//
// Z runs from the warehouse at the back (-Z) through the production line to
// the loading dock and delivery road at the front (+Z).
// ============================================================

import type { CustomerType, TeamId } from '../types';
import { headingTo, v, type Vec3 } from '../world/geom';

export const sideSign = (team: TeamId): number => (team === 'blue' ? -1 : 1);
const mx = (p: Vec3): Vec3 => ({ x: -p.x, y: p.y, z: p.z });

export interface SideLayout {
  warehouse: Vec3; warehouseSize: { w: number; h: number; d: number };
  palletStack: Vec3;
  forkliftHome: Vec3;
  measuringTank: Vec3;
  mixer: Vec3;
  moldingMachine: Vec3;
  coolingEntry: Vec3; coolingExit: Vec3;
  cutter: Vec3;
  qcStation: Vec3;
  packagingMachine: Vec3;
  packagingExit: Vec3;
  loadingDock: Vec3;
  truckHome: Vec3;
  truckExitGate: Vec3;
  operatorHome: Vec3;
  inspectorHome: Vec3;
  loaderHome: Vec3;
  /** Where a sack of cocoa is tipped into the measuring tank. */
  tipPoint: Vec3;
  /** Where the two ingredient handlers wait between trips. */
  handlerHome: Vec3[];
  /** Where the packer stands at the boxing machine. */
  packerHome: Vec3;
  /** Where the finished pallet of boxes waits for the forklift. */
  palletOut: Vec3;
  orderBoard: Vec3;
  signPos: Vec3;
}

const BLUE: SideLayout = {
  warehouse: v(-19.5, 0, -29), warehouseSize: { w: 19, h: 11, d: 12 },
  palletStack: v(-27.5, 0, -19),
  forkliftHome: v(-31, 0, -15),
  measuringTank: v(-19.5, 0, -13),
  mixer: v(-19.5, 0, -5),
  moldingMachine: v(-19.5, 0, 2),
  coolingEntry: v(-19.5, 0, 6), coolingExit: v(-19.5, 0, 12.5),
  cutter: v(-19.5, 0, 17),
  qcStation: v(-19.5, 0, 21.5),
  packagingMachine: v(-19.5, 0, 26),
  packagingExit: v(-14, 0, 28),
  loadingDock: v(-13.5, 0, 31.5),
  truckHome: v(-13.5, 0, 34.5),
  truckExitGate: v(-9, 0, 39),
  operatorHome: v(-24.5, 0, -7.5),
  inspectorHome: v(-24.5, 0, 21.5),
  loaderHome: v(-10.5, 0, 28),
  // In FRONT of the tank (nearer the camera) so the pour is never hidden
  // behind the tank body from the playing view.
  tipPoint: v(-19.5, 0, -10.2),
  handlerHome: [v(-25.5, 0, -18), v(-23, 0, -20.5)],
  packerHome: v(-23.5, 0, 26.5),
  palletOut: v(-14.5, 0, 29.5),
  orderBoard: v(-25.5, 0, -1),
  signPos: v(-19.5, 9, -29),
};

function mirror(s: SideLayout): SideLayout {
  return {
    warehouse: mx(s.warehouse), warehouseSize: s.warehouseSize,
    palletStack: mx(s.palletStack),
    forkliftHome: mx(s.forkliftHome),
    measuringTank: mx(s.measuringTank),
    mixer: mx(s.mixer),
    moldingMachine: mx(s.moldingMachine),
    coolingEntry: mx(s.coolingEntry), coolingExit: mx(s.coolingExit),
    cutter: mx(s.cutter),
    qcStation: mx(s.qcStation),
    packagingMachine: mx(s.packagingMachine),
    packagingExit: mx(s.packagingExit),
    loadingDock: mx(s.loadingDock),
    truckHome: mx(s.truckHome),
    truckExitGate: mx(s.truckExitGate),
    operatorHome: mx(s.operatorHome),
    inspectorHome: mx(s.inspectorHome),
    loaderHome: mx(s.loaderHome),
    tipPoint: mx(s.tipPoint),
    handlerHome: s.handlerHome.map(mx),
    packerHome: mx(s.packerHome),
    palletOut: mx(s.palletOut),
    orderBoard: mx(s.orderBoard),
    signPos: mx(s.signPos),
  };
}

export const SIDES: Record<TeamId, SideLayout> = { blue: BLUE, red: mirror(BLUE) };
export const sideOf = (team: TeamId): SideLayout => SIDES[team];

// ── SHARED CENTRAL ATRIUM ───────────────────────────────────────────────
// The visual centrepiece both factories face — satisfies the brief's "large
// central shared chocolate-production environment" without either team's
// simulation depending on it.

export const ATRIUM = {
  centre: v(0, 0, -24),
  towerSize: { w: 13, h: 18, d: 11 },
  signPos: v(0, 22.5, -8),
};

// ── CUSTOMER ZONES ───────────────────────────────────────────────────────
// Shared, absolute world positions: both teams' trucks drive to the same
// buildings, arriving from their own side of the delivery road.

// Pushed out to the edges of the shot: the middle of the delivery road stays
// clear so the camera always looks straight into the two production lines.
export const CUSTOMER_ZONES: Record<CustomerType, { pos: Vec3; label: string }> = {
  school: { pos: v(-58, 0, 54), label: 'SCHOOL' },
  cafe: { pos: v(-38, 0, 60), label: 'CAFE' },
  shop: { pos: v(-18, 0, 66), label: 'CHOCOLATE SHOP' },
  hotel: { pos: v(18, 0, 66), label: 'HOTEL' },
  supermarket: { pos: v(38, 0, 60), label: 'SUPERMARKET' },
  festival: { pos: v(58, 0, 54), label: 'FESTIVAL' },
};

/** The delivery boulevard runs across the front of both factories. */
export const BOULEVARD_Z = 44;

/**
 * Dock -> gate -> out onto the boulevard -> along it -> turn in at the
 * customer. Every leg is a real drive; nothing is teleported.
 */
export function truckRoute(team: TeamId, customer: CustomerType): Vec3[] {
  const s = sideOf(team);
  const dest = CUSTOMER_ZONES[customer].pos;
  const approach = v(dest.x, 0, dest.z - 7);
  return [
    s.truckHome,
    s.loadingDock,
    s.truckExitGate,
    v(s.truckExitGate.x, 0, BOULEVARD_Z),
    v(dest.x, 0, BOULEVARD_Z),
    approach,
  ];
}

export function truckReturnRoute(team: TeamId, customer: CustomerType): Vec3[] {
  const s = sideOf(team);
  const dest = CUSTOMER_ZONES[customer].pos;
  return [
    v(dest.x, 0, dest.z - 7),
    v(dest.x, 0, BOULEVARD_Z),
    v(s.truckExitGate.x, 0, BOULEVARD_Z),
    s.truckExitGate,
    s.loadingDock,
    s.truckHome,
  ];
}

// ── CARRIER ROUTES ───────────────────────────────────────────────────────

/** Forklift: warehouse pallet stack -> beside the measuring tank -> back. */
export function forkliftIngredientRoute(team: TeamId): Vec3[] {
  const s = sideOf(team);
  const stand = v(s.measuringTank.x + sideSign(team) * -4.2, 0, s.measuringTank.z);
  return [s.forkliftHome, v(s.forkliftHome.x, 0, stand.z - 2), stand];
}
export function forkliftReturnRoute(team: TeamId, from: Vec3): Vec3[] {
  const s = sideOf(team);
  return [from, v(from.x, 0, s.forkliftHome.z - 2), s.forkliftHome];
}

/** Ingredient handler: home/current pos -> pallet stack to pick up cocoa sacks. */
export function handlerToPallet(team: TeamId, from: Vec3, index: number): Vec3[] {
  const s = sideOf(team);
  const sign = sideSign(team);
  const target = v(s.palletStack.x + sign * (index === 0 ? 1.4 : -1.4), 0, s.palletStack.z + (index === 0 ? 0.8 : -0.8));
  return [from, v(s.palletStack.x + sign * 2.2, 0, (from.z + target.z) / 2), target];
}

/** Ingredient handler: pallet stack with sack -> tip point at the measuring tank. */
export function handlerToTank(team: TeamId, from: Vec3): Vec3[] {
  const s = sideOf(team);
  const sign = sideSign(team);
  return [from, v(s.palletStack.x + sign * 2.2, 0, s.tipPoint.z - 1.2), s.tipPoint];
}

/** Ingredient handler: tank tip point -> return to home workstation. */
export function handlerToHome(team: TeamId, from: Vec3, index: number): Vec3[] {
  const s = sideOf(team);
  const sign = sideSign(team);
  const home = s.handlerHome[index % 2];
  return [from, v(s.palletStack.x + sign * 2.2, 0, (from.z + home.z) / 2), home];
}

/** Forklift: home -> the cocoa pallet stack (for a big ingredient load). */
export function forkliftCocoaRoute(team: TeamId, from: Vec3): Vec3[] {
  const s = sideOf(team);
  const sign = sideSign(team);
  const stand = v(s.palletStack.x + sign * 2.6, 0, s.palletStack.z + 1.2);
  return [from, v(stand.x, 0, stand.z - 3), stand];
}

/** Forklift: the loaded pallet -> alongside the measuring tank to tip it in. */
export function forkliftCocoaToTank(team: TeamId, from: Vec3): Vec3[] {
  const s = sideOf(team);
  const sign = sideSign(team);
  const stand = v(s.measuringTank.x + sign * 3.6, 0, s.tipPoint.z + 0.6);
  return [from, v(stand.x + sign * 1.5, 0, (from.z + stand.z) / 2), stand];
}

/**
 * Forklifts use the OUTER lane (beyond the crew's inner aisle and clear of
 * every machine) and the front lane in front of the packing machine, so they
 * never drive through the production line.
 */
const FORK_OUTER_X = 27;
const FORK_FRONT_Z = 29.6;

/** Forklift: wherever it is -> outer lane -> front lane -> the packed pallet. */
export function forkliftPalletRoute(team: TeamId, from: Vec3): Vec3[] {
  const s = sideOf(team);
  const sign = sideSign(team);
  const outer = sign * FORK_OUTER_X;
  return [from, v(outer, 0, from.z), v(outer, 0, FORK_FRONT_Z), v(s.palletOut.x + sign * 3.7, 0, FORK_FRONT_Z), s.palletOut];
}

/** Forklift: the pallet -> round to the truck's side, forks facing the bed. */
export function forkliftToTruck(team: TeamId, from: Vec3): Vec3[] {
  const s = sideOf(team);
  const sign = sideSign(team);
  return [
    from,
    v(s.palletOut.x + sign * 4, 0, 31.8),
    v(s.truckHome.x + sign * 7, 0, s.truckHome.z + 0.1),
    v(s.truckHome.x + sign * 3.4, 0, s.truckHome.z + 0.1),
  ];
}

/** Forklift: anywhere -> outer lane -> parked at home. */
export function forkliftHomeRoute(team: TeamId, from: Vec3): Vec3[] {
  const s = sideOf(team);
  const sign = sideSign(team);
  const outer = sign * FORK_OUTER_X;
  return [from, v(outer, 0, from.z), v(outer, 0, s.forkliftHome.z), s.forkliftHome];
}

/** Loader worker: packaging exit -> beside the truck bed -> back. */
export function loaderCarryRoute(team: TeamId): Vec3[] {
  const s = sideOf(team);
  const stand = v(s.truckHome.x, 0, s.truckHome.z - 2.6);
  return [s.packagingExit, v(s.packagingExit.x, 0, (s.packagingExit.z + stand.z) / 2), stand];
}
export function loaderReturnRoute(team: TeamId, from: Vec3): Vec3[] {
  const s = sideOf(team);
  return [from, v(s.packagingExit.x, 0, (s.packagingExit.z + from.z) / 2), s.loaderHome];
}

/** Truck cargo bed slots, in truck-local space (+X across, +Z toward rear). */
export const CARGO_SLOTS: Vec3[] = (() => {
  const out: Vec3[] = [];
  for (let row = 0; row < 4; row++) for (let col = 0; col < 2; col++) {
    out.push(v(-0.55 + col * 1.1, 0.62, 0.6 + row * 1.05));
  }
  return out;
})();

export function truckLocalToWorld(truckPos: Vec3, heading: number, local: Vec3): Vec3 {
  const c = Math.cos(heading), sn = Math.sin(heading);
  return { x: truckPos.x + local.x * c + local.z * sn, y: local.y, z: truckPos.z - local.x * sn + local.z * c };
}

export { headingTo };
