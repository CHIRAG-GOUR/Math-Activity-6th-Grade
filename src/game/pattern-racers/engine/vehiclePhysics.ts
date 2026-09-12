// ============================================================
// PATTERN RACERS — DETERMINISTIC VEHICLE MODEL
//
// The single hard rule this module exists to enforce:
//
//   HEADING CHANGES ONLY BECAUSE OF `input.steer`.
//
// There is no term anywhere below in which throttle, speed, track curvature or
// elapsed time can rotate the car. The previous implementation derived heading
// from a spline whose parameter was advanced by the throttle, which is why
// holding W made the car turn on its own.
//
// Two further consequences of the model, both deliberate:
//   - Yaw rate is proportional to SPEED, so a stationary car cannot rotate on
//     the spot no matter how long you hold a steering key.
//   - Zero input means zero engine force, so the car coasts to a genuine stop
//     instead of idling itself up to 100 km/h.
//
// No Math.random() appears in this file, and none may be added: the same
// inputs must always produce the same lap.
// ============================================================

import { ColliderGrid, Collider, circleVsBox } from './collision';

export interface VehicleInput {
  /** 0 or 1. Accelerate. Never affects heading. */
  throttle: number;
  /** 0 or 1. Brake, then reverse once stopped. */
  brake: number;
  /** -1 left, 0 straight, +1 right. The ONLY source of yaw. */
  steer: number;
}

export const NEUTRAL_INPUT: VehicleInput = { throttle: 0, brake: 0, steer: 0 };

export interface VehicleBody {
  x: number;
  z: number;
  /** Radians, matches Three.js rotation.y for a mesh whose nose is at -Z. */
  heading: number;
  /** Signed m/s along `heading`. Negative while reversing. */
  speed: number;
  /** Current front-wheel angle, radians. Smoothed toward the input. */
  steerAngle: number;

  /** True while the lateral grip limiter is active — drives tyre squeal. */
  slipping: boolean;
  /** Seconds of boost remaining. */
  boostRemaining: number;
  /** While > 0 the car is physically restrained (head start). */
  holdRemaining: number;

  /** Derived, for HUD and audio only. */
  gear: number;
  rpm: number;
  /** Normal-direction impact speed from the most recent frame, m/s. 0 if none. */
  lastImpact: number;
  /** Distance travelled this session, metres. */
  odometer: number;
}

export function createBody(x = 0, z = 0, heading = 0): VehicleBody {
  return {
    x, z, heading,
    speed: 0,
    steerAngle: 0,
    slipping: false,
    boostRemaining: 0,
    holdRemaining: 0,
    gear: 1,
    rpm: IDLE_RPM,
    lastImpact: 0,
    odometer: 0,
  };
}

/** Place a body exactly, cancelling all motion. Used by grid staging and respawn. */
export function placeBody(b: VehicleBody, x: number, z: number, heading: number) {
  b.x = x; b.z = z; b.heading = heading;
  b.speed = 0;
  b.steerAngle = 0;
  b.slipping = false;
  b.lastImpact = 0;
}

/** Start a boost. Charge accounting belongs to the caller. */
export function grantBoost(b: VehicleBody) {
  b.boostRemaining = BOOST_DURATION;
}

/** Restrain a car on its grid box for `seconds` — the head-start penalty. */
export function holdBody(b: VehicleBody, seconds: number) {
  b.holdRemaining = seconds;
  b.speed = 0;
}

// ── TUNING ──────────────────────────────────────────────────────────────────
// Chosen so the car "slowly gets fast" and stays controllable:
//   a(0) = F_MAX / MASS = 8.75 m/s^2  ->  0-100 km/h in about 4.3 s
//   Engine force falls off linearly with speed, so top speed is approached
//   asymptotically rather than snapping to a cap. ~16 s to reach 90% of it.
// Over the 1204 m lap this produces roughly a 30-second flying lap.

const MASS = 800;
const F_MAX = 7000;
/** Speed at which engine force reaches zero: the natural top speed. */
const V_MAX = 60;          // m/s, ~216 km/h
const V_MAX_BOOST = 72;
const F_BOOST = 4500;
const BOOST_DURATION = 2.8;

const BRAKE_FORCE = 14000;
const REVERSE_FORCE = 3400;
const REVERSE_MAX = 8;     // m/s

/** Quadratic drag + constant rolling resistance, active even off-throttle. */
const K_DRAG = 0.9;
const ROLLING = 260;

const WHEEL_BASE = 2.9;
const MAX_STEER = 0.55;    // rad at rest
/** How much of the steering lock is removed at V_REF and above. */
const STEER_SPEED_FALLOFF = 0.72;
const V_REF = 60;
const TURN_RATE = 5.0;     // rad/s toward the target angle
const RETURN_RATE = 7.0;   // faster self-centring when the key is released

/** Lateral acceleration the tyres can sustain. Sets the real cornering radius. */
const A_LAT_MAX = 12;

const IDLE_RPM = 1100;
const MAX_RPM = 12000;
/** Upper speed bound of each gear, m/s. */
const GEAR_BANDS = [12, 22, 32, 42, 51, 60];

/** Fraction of speed removed on a fully head-on impact. */
const WALL_SCRUB = 0.9;

/** Collision circles along the car's spine: offsets from centre, in metres. */
const BODY_CIRCLES = [
  { along: -1.5, radius: 1.05 },
  { along: 0.0, radius: 1.05 },
  { along: 1.6, radius: 1.0 },
];

/** Longest position change permitted in one substep. Prevents tunnelling. */
const MAX_STEP_DISTANCE = 1.0;

function clamp(v: number, lo: number, hi: number) {
  return v < lo ? lo : v > hi ? hi : v;
}

/** Frame-rate independent exponential approach. */
function damp(current: number, target: number, rate: number, dt: number) {
  return target + (current - target) * Math.exp(-rate * dt);
}

// Scratch buffers — module scope so the hot loop allocates nothing.
const scratchColliders: Collider[] = [];

/**
 * Advance one vehicle. Substeps internally so that a fast car cannot pass
 * through a thin wall between frames.
 */
export function stepVehicle(
  b: VehicleBody,
  input: VehicleInput,
  dt: number,
  grid: ColliderGrid | null
): void {
  b.lastImpact = 0;
  b.slipping = false;

  // ── HEAD START RESTRAINT ──
  // The car is physically held on its grid box. Note we do NOT move it — the
  // advantage comes from lost time, never from a position change.
  if (b.holdRemaining > 0) {
    b.holdRemaining -= dt;
    b.speed = 0;
    b.steerAngle = damp(b.steerAngle, 0, RETURN_RATE, dt);
    // Engine still revs against the restraint, for sound and visuals.
    b.rpm = 7200;
    b.gear = 1;
    return;
  }

  // Boost is granted by the caller via grantBoost(), which owns charge
  // accounting. The body only ever counts it down, so holding the key cannot
  // re-trigger it the instant it expires.
  if (b.boostRemaining > 0) b.boostRemaining = Math.max(0, b.boostRemaining - dt);
  const boosting = b.boostRemaining > 0;

  const substeps = Math.max(
    1,
    Math.min(4, Math.ceil((Math.abs(b.speed) * dt) / MAX_STEP_DISTANCE))
  );
  const h = dt / substeps;

  for (let i = 0; i < substeps; i++) {
    integrate(b, input, h, boosting);
    if (grid) resolveCollisions(b, grid);
  }

  updateDrivetrainReadouts(b);
}

function integrate(b: VehicleBody, input: VehicleInput, dt: number, boosting: boolean) {
  // ── STEERING ──────────────────────────────────────────────────────────────
  // Steering lock tightens at low speed and relaxes at high speed, which is
  // what stops the car from being twitchy on the straights.
  const speedFrac = clamp(Math.abs(b.speed) / V_REF, 0, 1);
  const maxSteer = MAX_STEER * (1 - STEER_SPEED_FALLOFF * speedFrac);
  const targetSteer = clamp(input.steer, -1, 1) * maxSteer;
  const rate = input.steer === 0 ? RETURN_RATE : TURN_RATE;
  b.steerAngle = damp(b.steerAngle, targetSteer, rate, dt);

  // ── YAW ───────────────────────────────────────────────────────────────────
  // Kinematic bicycle model. Proportional to speed: at a standstill this is
  // exactly zero, so the car cannot pivot in place.
  //
  // Sign: positive steerAngle means steering RIGHT, and a right turn DECREASES
  // heading under this project's convention (see circuit.ts).
  let yawRate = (b.speed / WHEEL_BASE) * Math.tan(b.steerAngle);

  // Grip limit. Without this the geometric turn radius at speed would be far
  // tighter than any tyre could hold, and the car would spin on every corner.
  const absSpeed = Math.abs(b.speed);
  if (absSpeed > 1) {
    const maxYaw = A_LAT_MAX / absSpeed;
    if (Math.abs(yawRate) > maxYaw) {
      yawRate = Math.sign(yawRate) * maxYaw;
      b.slipping = true;
      // Scrubbing off speed while sliding is what makes overdriving a corner
      // genuinely slower, rather than free.
      b.speed -= Math.sign(b.speed) * 6 * dt;
    }
  }
  b.heading -= yawRate * dt;

  // ── LONGITUDINAL ──────────────────────────────────────────────────────────
  let force = 0;

  if (input.throttle > 0) {
    const vMax = boosting ? V_MAX_BOOST : V_MAX;
    // Linear falloff: strong off the line, tapering as speed builds.
    force += input.throttle * F_MAX * Math.max(0, 1 - b.speed / vMax);
    if (boosting) force += F_BOOST;
  }

  if (input.brake > 0) {
    if (b.speed > 0.5) {
      force -= BRAKE_FORCE * input.brake;
    } else {
      // Stopped or already rolling backwards: brake becomes reverse.
      if (b.speed > -REVERSE_MAX) force -= REVERSE_FORCE * input.brake;
    }
  }

  // Resistance always opposes motion.
  if (absSpeed > 0.01) {
    const resist = K_DRAG * b.speed * b.speed + ROLLING;
    force -= Math.sign(b.speed) * resist;
  }

  const prevSpeed = b.speed;
  b.speed += (force / MASS) * dt;

  // Coasting must settle at zero rather than oscillating around it as the
  // resistance term flips sign each step.
  if (input.throttle === 0 && input.brake === 0 &&
      Math.sign(b.speed) !== Math.sign(prevSpeed) && Math.abs(prevSpeed) < 2) {
    b.speed = 0;
  }
  b.speed = clamp(b.speed, -REVERSE_MAX, V_MAX_BOOST);

  // ── TRANSLATE ─────────────────────────────────────────────────────────────
  const fx = -Math.sin(b.heading);
  const fz = -Math.cos(b.heading);
  const step = b.speed * dt;
  b.x += fx * step;
  b.z += fz * step;
  b.odometer += Math.abs(step);
}

/**
 * Push the body out of anything it overlaps and scrub speed according to how
 * head-on the contact was.
 *
 * The slide falls out naturally: the car keeps its heading and keeps moving
 * forward, while the depenetration pushes it laterally out of the wall each
 * substep — so it glides along the barrier instead of stopping dead or
 * passing through.
 */
function resolveCollisions(b: VehicleBody, grid: ColliderGrid) {
  const fx = -Math.sin(b.heading);
  const fz = -Math.cos(b.heading);

  let pushX = 0;
  let pushZ = 0;
  let worstNormalSpeed = 0;

  for (const circle of BODY_CIRCLES) {
    const px = b.x + fx * circle.along;
    const pz = b.z + fz * circle.along;

    grid.query(px, pz, scratchColliders);
    for (let i = 0; i < scratchColliders.length; i++) {
      const contact = circleVsBox(px, pz, circle.radius, scratchColliders[i]);
      if (!contact) continue;

      pushX += contact.nx * contact.depth;
      pushZ += contact.nz * contact.depth;

      // Velocity is purely along heading in this model.
      const vn = (fx * b.speed) * contact.nx + (fz * b.speed) * contact.nz;
      if (vn < 0 && -vn > worstNormalSpeed) worstNormalSpeed = -vn;
    }
  }

  if (pushX === 0 && pushZ === 0) return;

  b.x += pushX;
  b.z += pushZ;

  if (worstNormalSpeed > 0) {
    const absSpeed = Math.max(Math.abs(b.speed), 1);
    // Squared so a glancing scrape barely costs anything while a head-on hit
    // nearly stops the car.
    const frac = clamp(worstNormalSpeed / absSpeed, 0, 1);
    b.speed *= 1 - WALL_SCRUB * frac * frac;
    b.lastImpact = worstNormalSpeed;
  }
}

function updateDrivetrainReadouts(b: VehicleBody) {
  const v = Math.abs(b.speed);

  let gear = 1;
  let low = 0;
  let high = GEAR_BANDS[0];
  for (let i = 0; i < GEAR_BANDS.length; i++) {
    if (v <= GEAR_BANDS[i]) {
      gear = i + 1;
      low = i === 0 ? 0 : GEAR_BANDS[i - 1];
      high = GEAR_BANDS[i];
      break;
    }
    gear = GEAR_BANDS.length;
    low = GEAR_BANDS[GEAR_BANDS.length - 2];
    high = GEAR_BANDS[GEAR_BANDS.length - 1];
  }

  const within = high > low ? (v - low) / (high - low) : 0;
  b.gear = gear;
  b.rpm = Math.round(IDLE_RPM + clamp(within, 0, 1) * (MAX_RPM - IDLE_RPM));
}

export const VEHICLE_TUNING = {
  MASS, F_MAX, V_MAX, V_MAX_BOOST, F_BOOST, BOOST_DURATION,
  BRAKE_FORCE, A_LAT_MAX, MAX_RPM, IDLE_RPM, REVERSE_MAX,
} as const;

export function kmh(speedMs: number): number {
  return Math.round(Math.abs(speedMs) * 3.6);
}
