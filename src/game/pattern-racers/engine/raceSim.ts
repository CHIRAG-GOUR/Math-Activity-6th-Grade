// ============================================================
// PATTERN RACERS — RACE SIMULATION: THE SINGLE AUTHORITY
//
// Exactly one system moves a car, ever. `sim.mode` selects which controller is
// producing input, but in every mode the motion itself goes through
// stepVehicle() — so cinematic transitions obey the same collision and the
// same steering model as the player does.
//
// Why this file exists at all: the previous build had three systems writing to
// the same transform (a 60 Hz zustand physics loop, two wall-clock setInterval
// lerps, and a useFrame in the car component). Nothing could be reasoned about
// because any of them might win on a given frame.
//
// State here is deliberately MUTABLE and outside React. Writing car positions
// into a store at 60 Hz re-rendered both car components every frame; instead
// the renderer reads these objects directly in useFrame, and the HUD gets a
// throttled snapshot ten times a second.
// ============================================================

import * as THREE from 'three';
import {
  CIRCUIT, PIT_LANE, TRACK, START_FINISH_S, RACE_LAP_DISTANCE,
  GRID_SLOTS, GARAGE_SLOTS, TYRE_BAY_SLOTS, PIT_STATIONS, PIT, PIT_MERGE_S,
  CHECKPOINT_COUNT, checkpointS, wrapAngle, type Slot,
} from './circuit';
import { COLLIDER_GRID } from './worldLayout';
import {
  type VehicleBody, type VehicleInput, NEUTRAL_INPUT,
  createBody, placeBody, stepVehicle, grantBoost, holdBody, kmh,
} from './vehiclePhysics';

export type TeamId = 'blue' | 'red';
export type SimMode = 'idle' | 'cinematic' | 'player';

// ── PER-CAR RUNTIME ─────────────────────────────────────────────────────────

export interface CarRuntime {
  team: TeamId;
  body: VehicleBody;
  input: VehicleInput;

  /** Latest projection onto the racing line. */
  trackS: number;
  lateral: number;
  /** Cumulative forward progress, metres. The race ends at RACE_LAP_DISTANCE. */
  distance: number;
  finished: boolean;
  finishTime: number | null;

  /** Recovery bookkeeping. */
  wrongWay: boolean;
  offTrack: boolean;
  stuckTimer: number;
  lastCheckpoint: number;
  respawnFlash: number;

  /** Boost charges remaining; consumed by requestBoost(). */
  boostCharges: number;

  /** Cinematic script currently driving this car, if any. */
  script: CinematicScript | null;
}

interface CinematicScript {
  waypoints: { x: number; z: number }[];
  index: number;
  cruiseSpeed: number;
  final: Slot;
  done: boolean;
  onArrive?: (team: TeamId) => void;
}

function createCar(team: TeamId): CarRuntime {
  const slot = GARAGE_SLOTS[team];
  const body = createBody(slot.x, slot.z, slot.heading);
  return {
    team,
    body,
    input: { ...NEUTRAL_INPUT },
    trackS: 0,
    lateral: 0,
    distance: 0,
    finished: false,
    finishTime: null,
    wrongWay: false,
    offTrack: false,
    stuckTimer: 0,
    lastCheckpoint: 0,
    respawnFlash: 0,
    boostCharges: 2,
    script: null,
  };
}

// ── SIM SINGLETON ───────────────────────────────────────────────────────────

export interface RaceSim {
  mode: SimMode;
  /** Seconds since the green light. */
  raceTime: number;
  /** True once the lights go out; gates lap accumulation. */
  racing: boolean;
  blue: CarRuntime;
  red: CarRuntime;
  winner: TeamId | null;
}

export const sim: RaceSim = {
  mode: 'idle',
  raceTime: 0,
  racing: false,
  blue: createCar('blue'),
  red: createCar('red'),
  winner: null,
};

export function carOf(team: TeamId): CarRuntime {
  return team === 'blue' ? sim.blue : sim.red;
}

// ── RENDER BINDING ──────────────────────────────────────────────────────────
// The car components register their root Object3D here; the sim writes the
// transform directly, so no React state changes during driving.

const renderTargets: Partial<Record<TeamId, THREE.Object3D>> = {};

export function registerVehicleObject(team: TeamId, obj: THREE.Object3D | null) {
  if (obj) renderTargets[team] = obj;
  else delete renderTargets[team];
}

const CAR_RIDE_HEIGHT = 0.32;

function syncRenderTransform(car: CarRuntime) {
  const obj = renderTargets[car.team];
  if (!obj) return;
  obj.position.set(car.body.x, CAR_RIDE_HEIGHT, car.body.z);
  obj.rotation.y = car.body.heading;
}

// ── INPUT ───────────────────────────────────────────────────────────────────
// Set from the keyboard handler and the on-screen pads. Held as plain flags so
// a stuck pointer or a lost key-up cannot leave a steering value pinned.

export interface InputFlags {
  accel: boolean;
  brake: boolean;
  left: boolean;
  right: boolean;
}

const inputFlags: Record<TeamId, InputFlags> = {
  blue: { accel: false, brake: false, left: false, right: false },
  red: { accel: false, brake: false, left: false, right: false },
};

export function setInputFlag(team: TeamId, flag: keyof InputFlags, value: boolean) {
  inputFlags[team][flag] = value;
}

/** Drop every held input — used when control is taken away or the tab blurs. */
export function clearInputs(team?: TeamId) {
  const teams: TeamId[] = team ? [team] : ['blue', 'red'];
  for (const t of teams) {
    const f = inputFlags[t];
    f.accel = false; f.brake = false; f.left = false; f.right = false;
  }
}

export function requestBoost(team: TeamId) {
  const car = carOf(team);
  if (sim.mode !== 'player') return;
  if (car.boostCharges <= 0 || car.body.boostRemaining > 0) return;
  if (car.body.holdRemaining > 0) return;
  car.boostCharges -= 1;
  grantBoost(car.body);
  audio?.onBoost(team);
}

// ── AUDIO HOOKS ─────────────────────────────────────────────────────────────
// Kept as an interface so the sim never imports the audio engine directly and
// stays testable in isolation.

export interface SimAudioSink {
  onEngine(team: TeamId, rpm: number, load: number): void;
  onSlip(team: TeamId, slipping: boolean): void;
  onImpact(team: TeamId, force: number): void;
  onBoost(team: TeamId): void;
  onGearShift(team: TeamId, gear: number): void;
}

let audio: SimAudioSink | null = null;
export function setSimAudioSink(sink: SimAudioSink | null) {
  audio = sink;
}

// ── HUD SNAPSHOT ────────────────────────────────────────────────────────────

export interface CarHudState {
  speedKmh: number;
  rpm: number;
  gear: number;
  lapProgress: number;   // 0..1
  boostActive: boolean;
  boostCharges: number;
  wrongWay: boolean;
  held: boolean;
  finished: boolean;
}

export interface HudSnapshot {
  blue: CarHudState;
  red: CarHudState;
  winner: TeamId | null;
  raceTime: number;
}

type HudListener = (snap: HudSnapshot) => void;
let hudListener: HudListener | null = null;
export function setHudListener(fn: HudListener | null) { hudListener = fn; }

const HUD_INTERVAL = 0.1; // 10 Hz is plenty for numbers a human reads
let hudAccumulator = 0;

function carHud(car: CarRuntime): CarHudState {
  return {
    speedKmh: kmh(car.body.speed),
    rpm: car.body.rpm,
    gear: car.body.gear,
    lapProgress: Math.min(1, car.distance / RACE_LAP_DISTANCE),
    boostActive: car.body.boostRemaining > 0,
    boostCharges: car.boostCharges,
    wrongWay: car.wrongWay,
    held: car.body.holdRemaining > 0,
    finished: car.finished,
  };
}

// ── CINEMATIC SCRIPTS ───────────────────────────────────────────────────────
// A cinematic is an AI DRIVER, not a transform writer: it produces throttle,
// brake and steer, and the result goes through the same vehicle model. That is
// why the cars follow the actual pit road, face the direction they travel, and
// still collide with things during transitions.

const WAYPOINT_RADIUS = 5.5;
const CINEMATIC_ARRIVE_DIST = 1.2;

function makeScript(
  waypoints: { x: number; z: number }[],
  final: Slot,
  cruiseSpeed: number,
  onArrive?: (team: TeamId) => void
): CinematicScript {
  return { waypoints, index: 0, cruiseSpeed, final, done: false, onArrive };
}

/** Points down the pit lane between two stations, at the lane centre. */
function pitLaneWaypoints(fromS: number, toS: number, step = 12): { x: number; z: number }[] {
  const out: { x: number; z: number }[] = [];
  const dir = toS >= fromS ? 1 : -1;
  for (let s = fromS; dir > 0 ? s <= toS : s >= toS; s += step * dir) {
    const w = PIT_LANE.toWorld(s, 0);
    out.push({ x: w.x, z: w.z });
  }
  const end = PIT_LANE.toWorld(toS, 0);
  out.push({ x: end.x, z: end.z });
  return out;
}

/** Round 1 -> 2: out of the garage, down the pit lane, into the tyre bay. */
export function startGarageToTyreBay(onArrive?: (team: TeamId) => void) {
  for (const team of ['blue', 'red'] as const) {
    const car = carOf(team);
    const garageS = PIT_STATIONS.garages + (team === 'blue' ? 9 : -9);

    // First point is directly ahead of the garage door, on the lane centre,
    // so the car drives out through the opening rather than through a wall.
    const exit = PIT_LANE.toWorld(garageS, 0);
    const bayS = PIT_STATIONS.tyreBay + (team === 'blue' ? 8 : -8);

    const waypoints = [
      { x: exit.x, z: exit.z },
      ...pitLaneWaypoints(garageS + 10, bayS - 6),
    ];

    car.script = makeScript(waypoints, TYRE_BAY_SLOTS[team], 11, onArrive);
  }
  sim.mode = 'cinematic';
  clearInputs();
}

/** Round 2 -> 3: out of the tyre bay, down the pit lane, out of the pit exit, onto the grid. */
export function startTyreBayToGrid(onArrive?: (team: TeamId) => void) {
  for (const team of ['blue', 'red'] as const) {
    const car = carOf(team);
    const bayS = PIT_STATIONS.tyreBay + (team === 'blue' ? 8 : -8);

    const laneBack = PIT_LANE.toWorld(bayS, 0);
    const waypoints: { x: number; z: number }[] = [{ x: laneBack.x, z: laneBack.z }];

    // Down the remaining pit lane and out through the exit slip road.
    waypoints.push(...pitLaneWaypoints(bayS + 8, PIT_LANE.length, 14));

    // Then along the main straight to the grid box.
    const gridS = team === 'blue' ? PIT_MERGE_S + 12 : PIT_MERGE_S + 4;
    for (let s = PIT_MERGE_S + 2; s <= gridS; s += 8) {
      const w = CIRCUIT.toWorld(s, team === 'blue' ? -3.0 : 3.0);
      waypoints.push({ x: w.x, z: w.z });
    }

    car.script = makeScript(waypoints, GRID_SLOTS[team], 13, onArrive);
  }
  sim.mode = 'cinematic';
  clearInputs();
}

/**
 * Steer-toward-target controller. Produces the same VehicleInput shape a human
 * produces, so it is impossible for it to bypass collision or the steering
 * model.
 */
function driveScript(car: CarRuntime): VehicleInput {
  const sc = car.script;
  if (!sc || sc.done) return NEUTRAL_INPUT;

  const b = car.body;

  // Advance through waypoints that have been reached.
  while (sc.index < sc.waypoints.length) {
    const wp = sc.waypoints[sc.index];
    if (Math.hypot(wp.x - b.x, wp.z - b.z) < WAYPOINT_RADIUS) sc.index++;
    else break;
  }

  const onFinalLeg = sc.index >= sc.waypoints.length;
  const target = onFinalLeg ? sc.final : sc.waypoints[sc.index];
  const dx = target.x - b.x;
  const dz = target.z - b.z;
  const distance = Math.hypot(dx, dz);

  // Arrival: settle exactly onto the slot so the grid boxes are pixel-accurate
  // and identical every round.
  if (onFinalLeg && distance < CINEMATIC_ARRIVE_DIST && Math.abs(b.speed) < 2.5) {
    placeBody(b, sc.final.x, sc.final.z, sc.final.heading);
    sc.done = true;
    car.script = null;
    sc.onArrive?.(car.team);
    return NEUTRAL_INPUT;
  }

  // Heading toward the target, in the project's convention.
  const desiredHeading = Math.atan2(-dx, -dz);
  const error = wrapAngle(desiredHeading - b.heading);

  // A right turn decreases heading, so a negative error wants steer = +1.
  const steer = Math.max(-1, Math.min(1, -error * 2.2));

  // Ease off as the final slot approaches so the car stops on its mark.
  const targetSpeed = onFinalLeg
    ? Math.min(sc.cruiseSpeed, Math.max(1.5, distance * 0.9))
    : sc.cruiseSpeed;

  const throttle = b.speed < targetSpeed ? 1 : 0;
  const brake = b.speed > targetSpeed + 2 ? 1 : 0;

  return { throttle, brake, steer };
}

// ── RECOVERY ────────────────────────────────────────────────────────────────

const OFFTRACK_LIMIT = TRACK.halfWidth + 7;   // beyond curb and into the runoff
const WRONG_WAY_ANGLE = (120 * Math.PI) / 180;
const STUCK_SECONDS = 4;

function updateTrackState(car: CarRuntime, input: VehicleInput, dt: number) {
  const b = car.body;
  const near = CIRCUIT.nearestSHinted(b.x, b.z, car.trackS);

  // Forward progress, wrap-aware. Driving backwards subtracts, which is what
  // makes going the wrong way genuinely cost you.
  let ds = near.s - car.trackS;
  if (ds > CIRCUIT.length * 0.5) ds -= CIRCUIT.length;
  if (ds < -CIRCUIT.length * 0.5) ds += CIRCUIT.length;

  car.trackS = near.s;
  car.lateral = near.lateral;

  if (sim.racing && !car.finished) {
    car.distance += ds;
    if (car.distance >= RACE_LAP_DISTANCE) {
      car.finished = true;
      car.finishTime = sim.raceTime;
      if (!sim.winner) sim.winner = car.team;
    }
  }

  // Wrong way.
  const frame = CIRCUIT.sampleAt(near.s);
  const headingError = Math.abs(wrapAngle(b.heading - frame.heading));
  car.wrongWay = sim.mode === 'player' && headingError > WRONG_WAY_ANGLE;

  car.offTrack = Math.abs(near.lateral) > OFFTRACK_LIMIT;

  // Checkpoint tracking, so a respawn puts the car back where it was going.
  const cpIndex = Math.floor((near.s / CIRCUIT.length) * CHECKPOINT_COUNT);
  if (!car.offTrack && !car.wrongWay) car.lastCheckpoint = cpIndex;

  // Stuck detection. Only in player mode — a cinematic is allowed to sit still,
  // and so is a student who simply has not pressed anything yet. Recovery only
  // fires when the player is actively trying to drive and the car is not
  // responding, or when they are lost off the racing surface.
  if (sim.mode === 'player' && b.holdRemaining <= 0 && !car.finished) {
    const beached = input.throttle > 0 && Math.abs(b.speed) < 2;
    if (car.offTrack || car.wrongWay || beached) car.stuckTimer += dt;
    else car.stuckTimer = 0;

    if (car.stuckTimer > STUCK_SECONDS) respawn(car);
  } else {
    car.stuckTimer = 0;
  }

  if (car.respawnFlash > 0) car.respawnFlash = Math.max(0, car.respawnFlash - dt);
}

export function respawn(car: CarRuntime) {
  const s = checkpointS(car.lastCheckpoint);
  const lane = car.team === 'blue' ? -2.5 : 2.5;
  const w = CIRCUIT.toWorld(s, lane);
  placeBody(car.body, w.x, w.z, w.heading);
  car.trackS = s;
  car.stuckTimer = 0;
  car.wrongWay = false;
  car.offTrack = false;
  car.respawnFlash = 1.2;
  syncRenderTransform(car);
}

export function requestRespawn(team: TeamId) {
  if (sim.mode !== 'player') return;
  respawn(carOf(team));
}

// ── STAGING ─────────────────────────────────────────────────────────────────

export function stageAtGarages() {
  sim.mode = 'idle';
  sim.racing = false;
  sim.raceTime = 0;
  sim.winner = null;
  clearInputs();
  for (const team of ['blue', 'red'] as const) {
    const car = carOf(team);
    const slot = GARAGE_SLOTS[team];
    placeBody(car.body, slot.x, slot.z, slot.heading);
    car.script = null;
    car.distance = 0;
    car.finished = false;
    car.finishTime = null;
    car.boostCharges = 2;
    car.body.boostRemaining = 0;
    car.body.holdRemaining = 0;
    const near = CIRCUIT.nearestS(slot.x, slot.z);
    car.trackS = near.s;
    car.lastCheckpoint = 0;
    syncRenderTransform(car);
  }
}

/** Park both cars exactly on their grid boxes. Idempotent — rounds 3, 4 and 5
 *  can call it freely and the cars will not shift by a millimetre. */
export function stageAtGrid() {
  sim.mode = 'idle';
  sim.racing = false;
  clearInputs();
  for (const team of ['blue', 'red'] as const) {
    const car = carOf(team);
    const slot = GRID_SLOTS[team];
    placeBody(car.body, slot.x, slot.z, slot.heading);
    car.script = null;
    car.distance = 0;
    car.finished = false;
    car.finishTime = null;
    const near = CIRCUIT.nearestS(slot.x, slot.z);
    car.trackS = near.s;
    car.lastCheckpoint = Math.floor((near.s / CIRCUIT.length) * CHECKPOINT_COUNT);
    syncRenderTransform(car);
  }
}

/** Lights out. `heldTeam` is restrained for `holdSeconds` — a TIME penalty. */
export function startRace(heldTeam: TeamId | null, holdSeconds: number) {
  sim.mode = 'player';
  sim.racing = true;
  sim.raceTime = 0;
  sim.winner = null;
  clearInputs();
  for (const team of ['blue', 'red'] as const) {
    const car = carOf(team);
    car.distance = 0;
    car.finished = false;
    car.finishTime = null;
    car.stuckTimer = 0;
  }
  if (heldTeam) holdBody(carOf(heldTeam).body, holdSeconds);
}

export function endRaceControl() {
  sim.mode = 'idle';
  sim.racing = false;
  clearInputs();
}

// ── MAIN STEP ───────────────────────────────────────────────────────────────

const prevGear: Record<TeamId, number> = { blue: 1, red: 1 };
const prevSlip: Record<TeamId, boolean> = { blue: false, red: false };

export function stepSimulation(rawDt: number) {
  // Clamp so an alt-tab or a long frame cannot teleport anything.
  const dt = Math.min(0.05, Math.max(0.0005, rawDt));

  if (sim.racing) sim.raceTime += dt;

  for (const team of ['blue', 'red'] as const) {
    const car = carOf(team);
    const b = car.body;

    // ── EXACTLY ONE CONTROLLER PRODUCES INPUT ──
    let input: VehicleInput;
    switch (sim.mode) {
      case 'cinematic':
        input = driveScript(car);
        break;
      case 'player': {
        if (car.finished) {
          // Coast down after the flag rather than freezing mid-track.
          input = { throttle: 0, brake: 1, steer: 0 };
        } else {
          const f = inputFlags[team];
          input = {
            throttle: f.accel ? 1 : 0,
            brake: f.brake ? 1 : 0,
            steer: (f.left ? -1 : 0) + (f.right ? 1 : 0),
          };
        }
        break;
      }
      default:
        input = NEUTRAL_INPUT;
    }
    car.input = input;

    stepVehicle(b, input, dt, COLLIDER_GRID);
    updateTrackState(car, input, dt);
    syncRenderTransform(car);

    // ── AUDIO ──
    if (audio) {
      const load = input.throttle > 0 ? 1 : Math.abs(b.speed) / 60;
      audio.onEngine(team, b.rpm, load);

      if (b.slipping !== prevSlip[team]) {
        audio.onSlip(team, b.slipping);
        prevSlip[team] = b.slipping;
      }
      if (b.gear !== prevGear[team]) {
        audio.onGearShift(team, b.gear);
        prevGear[team] = b.gear;
      }
      if (b.lastImpact > 2.5) audio.onImpact(team, b.lastImpact);
    }
  }

  // Cinematic completion: when neither car still has a script, hand control back.
  if (sim.mode === 'cinematic' && !sim.blue.script && !sim.red.script) {
    sim.mode = 'idle';
  }

  // ── THROTTLED HUD SYNC ──
  hudAccumulator += dt;
  if (hudAccumulator >= HUD_INTERVAL && hudListener) {
    hudAccumulator = 0;
    hudListener({
      blue: carHud(sim.blue),
      red: carHud(sim.red),
      winner: sim.winner,
      raceTime: sim.raceTime,
    });
  }
}

export { RACE_LAP_DISTANCE, START_FINISH_S, PIT };
