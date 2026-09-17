// ============================================================
// THE CHOCOLATE FACTORY — CREW NAVIGATION GRAPH
//
// Workers never walk in a straight line through a machine. Every walkable
// route in a factory is an explicit node in this graph, placed from the
// machines' real footprints (see Machines3D / Buildings3D):
//
//   warehouse door ─ sack store ─ round the tank ─ tip points
//                                         │
//   inner aisle: mixer desk ─ molder ─ cooling tunnel ─ cutter ─ QC table
//                                         │
//   packing machine ─ box stack ─ front aisle ─ cart bay ─ truck side
//
// One canonical BLUE graph, mirrored through X = 0 for RED, exactly like the
// rest of the layout. Paths are found with Dijkstra once, when a task is
// handed out — never per frame.
// ============================================================

import type { TeamId } from '../types';
import { dist, v, type Vec3 } from '../world/geom';

export type StationId =
  | 'W_DOOR' | 'STORE_A' | 'STORE_B' | 'BACK_MID' | 'TANK_L' | 'TANK_R'
  | 'TIP_A' | 'TIP_B' | 'IN_A' | 'MIX_W' | 'IN_C' | 'MOLD_W' | 'IN_D' | 'COOL_W'
  | 'IN_E' | 'CUT_W' | 'IN_F' | 'QC_W' | 'IN_G' | 'PACK_W' | 'STACK_W' | 'FRONT'
  | 'CART_BAY' | 'TRUCK_W' | 'LIFT_W'
  // routine-only spots, away from the production stations
  | 'OP_LOG' | 'OP_TANK' | 'QC_LAB' | 'BOX_SUPPLY';

interface NodeDef {
  pos: Vec3;
  /** What a worker standing here for a job turns to face. Aisle nodes have none. */
  face?: Vec3;
}

// Blue side. Machines sit on x = -19.5; the inner aisle runs at x ≈ -14.5,
// clear of the mixer's control desk (to x -14.85) and every machine body.
const BLUE_NODES: Record<StationId, NodeDef> = {
  W_DOOR: { pos: v(-21, 0, -21.6), face: v(-21, 0, -25) },
  STORE_A: { pos: v(-23.4, 0, -19.2), face: v(-26.2, 0, -19.2) },
  STORE_B: { pos: v(-23.4, 0, -16.6), face: v(-26.2, 0, -16.6) },
  BACK_MID: { pos: v(-21.5, 0, -17.6) },
  TANK_L: { pos: v(-23.2, 0, -13) },
  TANK_R: { pos: v(-15.8, 0, -15.4) },
  TIP_A: { pos: v(-20.7, 0, -9.9), face: v(-19.5, 0, -13) },
  TIP_B: { pos: v(-18.3, 0, -9.9), face: v(-19.5, 0, -13) },
  IN_A: { pos: v(-14.2, 0, -9.6) },
  MIX_W: { pos: v(-13.5, 0, -5), face: v(-15.6, 0, -5) },
  IN_C: { pos: v(-14.4, 0, 2) },
  MOLD_W: { pos: v(-15.9, 0, 2), face: v(-19.5, 0, 2) },
  IN_D: { pos: v(-14.6, 0, 9.2) },
  COOL_W: { pos: v(-16.3, 0, 9.2), face: v(-19.5, 0, 9.2) },
  IN_E: { pos: v(-14.6, 0, 17) },
  CUT_W: { pos: v(-16.4, 0, 17), face: v(-19.5, 0, 17) },
  IN_F: { pos: v(-14.6, 0, 22) },
  QC_W: { pos: v(-15.6, 0, 22), face: v(-16.9, 0, 22) },
  IN_G: { pos: v(-14.8, 0, 25.6) },
  PACK_W: { pos: v(-16.4, 0, 25.6), face: v(-19.5, 0, 25.6) },
  STACK_W: { pos: v(-16.2, 0, 28.6), face: v(-14, 0, 28) },
  FRONT: { pos: v(-16.8, 0, 30.8) },
  CART_BAY: { pos: v(-19.5, 0, 31.4), face: v(-19.5, 0, 34) },
  TRUCK_W: { pos: v(-16.2, 0, 37.6), face: v(-13.5, 0, 37.6) },
  LIFT_W: { pos: v(-15.6, 0, 36.6), face: v(-14.2, 0, 35.6) },
  // Routine duties happen here, so a worker called to a machine always walks to it.
  OP_LOG: { pos: v(-11.6, 0, -3.2), face: v(-9.5, 0, -3.2) },
  OP_TANK: { pos: v(-15.2, 0, -12.6), face: v(-19.5, 0, -13) },
  QC_LAB: { pos: v(-11.8, 0, 19.4), face: v(-9.6, 0, 19.4) },
  BOX_SUPPLY: { pos: v(-11.8, 0, 24.2), face: v(-9.6, 0, 24.2) },
};

const EDGES: [StationId, StationId][] = [
  ['W_DOOR', 'BACK_MID'], ['W_DOOR', 'STORE_A'],
  ['STORE_A', 'STORE_B'], ['STORE_A', 'BACK_MID'], ['STORE_B', 'BACK_MID'],
  ['STORE_B', 'TANK_L'], ['BACK_MID', 'TANK_L'], ['BACK_MID', 'TANK_R'],
  ['TANK_L', 'TIP_A'], ['TIP_A', 'TIP_B'], ['TANK_R', 'TIP_B'], ['TANK_R', 'IN_A'],
  ['TIP_B', 'IN_A'],
  ['IN_A', 'MIX_W'], ['MIX_W', 'IN_C'], ['IN_C', 'MOLD_W'],
  ['IN_C', 'IN_D'], ['IN_D', 'COOL_W'],
  ['IN_D', 'IN_E'], ['IN_E', 'CUT_W'],
  ['IN_E', 'IN_F'], ['IN_F', 'QC_W'],
  ['IN_F', 'IN_G'], ['IN_G', 'PACK_W'], ['IN_G', 'STACK_W'], ['IN_G', 'FRONT'],
  ['STACK_W', 'FRONT'], ['FRONT', 'CART_BAY'], ['FRONT', 'TRUCK_W'], ['FRONT', 'LIFT_W'],
  ['TRUCK_W', 'LIFT_W'],
  ['OP_LOG', 'MIX_W'], ['OP_LOG', 'IN_C'], ['OP_TANK', 'TANK_R'], ['OP_TANK', 'IN_A'],
  ['QC_LAB', 'IN_E'], ['QC_LAB', 'IN_F'], ['BOX_SUPPLY', 'IN_F'], ['BOX_SUPPLY', 'IN_G'],
];

export const STATION_IDS = Object.keys(BLUE_NODES) as StationId[];

interface Graph {
  nodes: Record<StationId, NodeDef>;
  adj: Record<StationId, StationId[]>;
}

function build(team: TeamId): Graph {
  const flip = team === 'red';
  const nodes = {} as Record<StationId, NodeDef>;
  for (const id of STATION_IDS) {
    const n = BLUE_NODES[id];
    const m = (p: Vec3): Vec3 => (flip ? v(-p.x, p.y, p.z) : v(p.x, p.y, p.z));
    nodes[id] = { pos: m(n.pos), face: n.face ? m(n.face) : undefined };
  }
  const adj = Object.fromEntries(STATION_IDS.map((id) => [id, [] as StationId[]])) as Record<StationId, StationId[]>;
  for (const [a, b] of EDGES) { adj[a].push(b); adj[b].push(a); }
  return { nodes, adj };
}

const GRAPHS: Record<TeamId, Graph> = { blue: build('blue'), red: build('red') };

export const stationPos = (team: TeamId, id: StationId): Vec3 => GRAPHS[team].nodes[id].pos;
export const stationFace = (team: TeamId, id: StationId): Vec3 | undefined => GRAPHS[team].nodes[id].face;

/** The graph node closest to a point, for starting a route from wherever someone stands. */
export function nearestStation(team: TeamId, p: Vec3): StationId {
  let best: StationId = 'IN_C';
  let bestD = Infinity;
  for (const id of STATION_IDS) {
    const d = dist(GRAPHS[team].nodes[id].pos, p);
    if (d < bestD) { bestD = d; best = id; }
  }
  return best;
}

/** Shortest node sequence between two stations (Dijkstra on a ~25 node graph). */
export function stationRoute(team: TeamId, from: StationId, to: StationId, avoid?: StationId): StationId[] | null {
  const g = GRAPHS[team];
  const distTo = new Map<StationId, number>([[from, 0]]);
  const prev = new Map<StationId, StationId>();
  const open = new Set<StationId>([from]);
  const closed = new Set<StationId>();
  while (open.size) {
    let cur: StationId | null = null;
    let curD = Infinity;
    for (const id of open) { const d = distTo.get(id)!; if (d < curD) { curD = d; cur = id; } }
    if (!cur) break;
    if (cur === to) break;
    open.delete(cur);
    closed.add(cur);
    for (const nb of g.adj[cur]) {
      if (closed.has(nb) || (nb === avoid && nb !== to)) continue;
      const nd = curD + dist(g.nodes[cur].pos, g.nodes[nb].pos);
      if (nd < (distTo.get(nb) ?? Infinity)) { distTo.set(nb, nd); prev.set(nb, cur); open.add(nb); }
    }
  }
  if (!distTo.has(to)) return null;
  const out: StationId[] = [to];
  while (out[0] !== from) { const p = prev.get(out[0]); if (!p) return null; out.unshift(p); }
  return out;
}

/**
 * A walkable polyline from where a worker stands to a station. `avoid` gives an
 * alternate route around one node when the first route kept them stuck.
 */
export function walkPath(team: TeamId, from: Vec3, to: StationId, avoid?: StationId): { points: Vec3[]; nodes: StationId[] } | null {
  const start = nearestStation(team, from);
  const route = stationRoute(team, start, to, avoid);
  if (!route) return null;
  const points: Vec3[] = [{ x: from.x, y: 0, z: from.z }];
  for (const id of route) {
    const p = stationPos(team, id);
    // Skip the start node if we are already standing on it.
    if (dist(points[points.length - 1], p) < 0.05) continue;
    points.push({ x: p.x, y: 0, z: p.z });
  }
  return { points, nodes: route };
}

/** Every edge as a segment, for the debug overlay. */
export function graphSegments(team: TeamId): [Vec3, Vec3][] {
  const g = GRAPHS[team];
  return EDGES.map(([a, b]) => [g.nodes[a].pos, g.nodes[b].pos]);
}
