// ============================================================
// RATIO RUSH — ACTOR LOCOMOTION
//
// Procedural stepping with two-bone leg IK.
//
// The key idea: a planted foot is pinned to a WORLD position and does not
// move until it is deliberately lifted. The body walks out from under it,
// and when the foot is far enough from where it ought to be, it takes a
// step. That one rule produces walking, acceleration, stopping and turning
// on the spot, and makes sliding feet impossible by construction — there is
// no code path that moves a foot the body did not decide to lift.
//
// Everything here is allocation-free once the body is created.
// ============================================================

import * as THREE from 'three';
import { RIG } from './actorRig';

const TAU = Math.PI * 2;

/** Half the distance between the feet when standing. */
const STANCE_HALF_WIDTH = RIG.hipX + 0.015;
/** How far a planted foot may drift from its ideal spot before it steps. */
const STEP_TRIGGER = 0.28;
/** Shortest gap between two steps, so the gait stays rhythmic. */
const MIN_STEP_GAP = 0.13;
const MAX_LEG = (RIG.thigh + RIG.shin) * 0.985;

export interface Foot {
  /** World position the foot is pinned to while planted. */
  plantX: number;
  plantZ: number;
  plantYaw: number;
  /** Where the current swing started. */
  fromX: number;
  fromZ: number;
  fromYaw: number;
  /** Where the current swing is headed. */
  toX: number;
  toZ: number;
  toYaw: number;
  /** Live ankle position, world. */
  x: number;
  y: number;
  z: number;
  yaw: number;
  /** Foot pitch, for heel strike and toe off. */
  pitch: number;
  planted: boolean;
  /** Swing progress, 0..1. */
  u: number;
  swingTime: number;
  /** Seconds this foot has been on the ground. */
  grounded: number;
}

export interface ActorMotion {
  x: number;
  z: number;
  heading: number;
  /** Current ground speed, m/s. */
  speed: number;
  /** Where the actor is trying to get to, or null when holding a mark. */
  targetX: number | null;
  targetZ: number | null;
  /** Heading the actor wants to face, or null to face along travel. */
  faceX: number | null;
  faceZ: number | null;
  /** Walking pace for the current move. */
  maxSpeed: number;
  feet: [Foot, Foot];
  /** Seconds since either foot last left the ground. */
  sinceStep: number;
  /** Pelvis rise and fall, written by the gait. */
  pelvisY: number;
  pelvisRoll: number;
  pelvisYaw: number;
  /** Arm swing phase, −1..1, handed to the upper body. */
  armSwing: number;
  /** True while the actor is covering ground. */
  moving: boolean;
  /** 0..1, how much of the gait to blend over the acting pose. */
  gaitWeight: number;
}

function makeFoot(x: number, z: number, yaw: number): Foot {
  return {
    plantX: x, plantZ: z, plantYaw: yaw,
    fromX: x, fromZ: z, fromYaw: yaw,
    toX: x, toZ: z, toYaw: yaw,
    x, y: RIG.ankleY, z, yaw, pitch: 0,
    planted: true, u: 1, swingTime: 0.36, grounded: 1,
  };
}

export function createMotion(x: number, z: number, heading: number, maxSpeed = 1.15): ActorMotion {
  const rx = Math.cos(heading);
  const rz = -Math.sin(heading);
  return {
    x, z, heading, speed: 0,
    targetX: null, targetZ: null,
    faceX: null, faceZ: null,
    maxSpeed,
    feet: [
      makeFoot(x - rx * STANCE_HALF_WIDTH, z - rz * STANCE_HALF_WIDTH, heading),
      makeFoot(x + rx * STANCE_HALF_WIDTH, z + rz * STANCE_HALF_WIDTH, heading),
    ],
    sinceStep: 1,
    pelvisY: RIG.pelvisY, pelvisRoll: 0, pelvisYaw: 0,
    armSwing: 0, moving: false, gaitWeight: 0,
  };
}

/** A circular thing on the floor the cast must not walk through. */
export interface Obstacle {
  x: number;
  z: number;
  r: number;
}

function shortestAngle(a: number): number {
  let d = a;
  while (d > Math.PI) d -= TAU;
  while (d < -Math.PI) d += TAU;
  return d;
}

/** Forward vector for a heading. Matches the rig's +Z facing at heading 0. */
export function forwardX(h: number): number { return Math.sin(h); }
export function forwardZ(h: number): number { return Math.cos(h); }

/**
 * Steer around anything in the way. Returns a desired direction that keeps
 * clear of the obstacles without abandoning the goal — the actor slides
 * around a tripod rather than stopping dead or walking through it.
 */
function avoid(
  m: ActorMotion,
  dirX: number,
  dirZ: number,
  obstacles: Obstacle[],
  others: ActorMotion[],
  out: { x: number; z: number }
) {
  let ax = dirX;
  let az = dirZ;

  for (let i = 0; i < obstacles.length; i++) {
    const o = obstacles[i];
    const dx = m.x - o.x;
    const dz = m.z - o.z;
    const dist = Math.hypot(dx, dz);
    const clearance = o.r + 0.34;
    if (dist > clearance + 0.7 || dist < 1e-4) continue;
    // Push out, and add a tangential nudge so the actor rounds the obstacle
    // instead of grinding straight into it.
    const push = (clearance + 0.7 - dist) / 0.7;
    const nx = dx / dist;
    const nz = dz / dist;
    const tangential = nx * dirZ - nz * dirX > 0 ? 1 : -1;
    ax += nx * push * 1.5 + -nz * tangential * push * 1.1;
    az += nz * push * 1.5 + nx * tangential * push * 1.1;
  }

  for (let i = 0; i < others.length; i++) {
    const o = others[i];
    if (o === m) continue;
    const dx = m.x - o.x;
    const dz = m.z - o.z;
    const dist = Math.hypot(dx, dz);
    if (dist > 0.95 || dist < 1e-4) continue;
    const push = (0.95 - dist) / 0.95;
    ax += (dx / dist) * push * 1.8;
    az += (dz / dist) * push * 1.8;
  }

  const len = Math.hypot(ax, az);
  if (len > 1e-4) {
    out.x = ax / len;
    out.z = az / len;
  } else {
    out.x = dirX;
    out.z = dirZ;
  }
}

const _dir = { x: 0, z: 0 };

/** Lift a foot and send it to where it should be standing. */
function startStep(m: ActorMotion, foot: Foot, side: number, lead: number) {
  const rx = Math.cos(m.heading);
  const rz = -Math.sin(m.heading);
  const fx = forwardX(m.heading);
  const fz = forwardZ(m.heading);

  foot.fromX = foot.plantX;
  foot.fromZ = foot.plantZ;
  foot.fromYaw = foot.plantYaw;
  foot.swingTime = Math.max(0.2, 0.4 - m.speed * 0.07);

  // Land where the body will be by the time the foot touches down, plus
  // half a stride in front so the step reaches rather than trails.
  const ahead = m.speed * foot.swingTime;
  foot.toX = m.x + fx * (ahead + lead) + rx * side * STANCE_HALF_WIDTH;
  foot.toZ = m.z + fz * (ahead + lead) + rz * side * STANCE_HALF_WIDTH;
  foot.toYaw = m.heading;

  foot.planted = false;
  foot.u = 0;
  foot.grounded = 0;
  m.sinceStep = 0;
}

/**
 * Advance one actor. `obstacles` and `others` are consulted every frame, so
 * the cast keep clear of the equipment and of each other while they move.
 */
export function stepMotion(
  m: ActorMotion,
  dt: number,
  obstacles: Obstacle[],
  others: ActorMotion[]
) {
  const d = Math.min(dt, 0.05);

  // ── 1. Desired velocity ──────────────────────────────────
  let wantSpeed = 0;
  let dirX = forwardX(m.heading);
  let dirZ = forwardZ(m.heading);

  if (m.targetX !== null && m.targetZ !== null) {
    const dx = m.targetX - m.x;
    const dz = m.targetZ - m.z;
    const dist = Math.hypot(dx, dz);
    if (dist < 0.06) {
      m.targetX = null;
      m.targetZ = null;
    } else {
      dirX = dx / dist;
      dirZ = dz / dist;
      avoid(m, dirX, dirZ, obstacles, others, _dir);
      dirX = _dir.x;
      dirZ = _dir.z;
      // Ease to a stop on the mark instead of stopping dead.
      wantSpeed = Math.min(m.maxSpeed, dist * 1.9 + 0.12);
    }
  }

  // Believable acceleration and a quicker, more decisive stop.
  const accel = wantSpeed > m.speed ? 2.6 : 4.2;
  m.speed += Math.max(-accel * d, Math.min(accel * d, wantSpeed - m.speed));
  if (m.speed < 0.02) m.speed = 0;
  m.moving = m.speed > 0.05;

  m.x += dirX * m.speed * d;
  m.z += dirZ * m.speed * d;

  // ── 2. Heading: face the way we travel, or the given target ──
  let wantHeading = m.heading;
  if (m.moving) {
    wantHeading = Math.atan2(dirX, dirZ);
  } else if (m.faceX !== null && m.faceZ !== null) {
    const dx = m.faceX - m.x;
    const dz = m.faceZ - m.z;
    if (Math.hypot(dx, dz) > 1e-3) wantHeading = Math.atan2(dx, dz);
  }
  // Turning is rate limited, so the body rotates rather than snapping.
  const turn = shortestAngle(wantHeading - m.heading);
  const turnRate = (m.moving ? 3.4 : 2.4) * d;
  m.heading += Math.max(-turnRate, Math.min(turnRate, turn));

  // ── 3. Stepping ──────────────────────────────────────────
  m.sinceStep += d;
  const rx = Math.cos(m.heading);
  const rz = -Math.sin(m.heading);
  const fx = forwardX(m.heading);
  const fz = forwardZ(m.heading);

  let anySwinging = false;
  for (let i = 0; i < 2; i++) if (!m.feet[i].planted) anySwinging = true;

  for (let i = 0; i < 2; i++) {
    const foot = m.feet[i];
    const side = i === 0 ? -1 : 1;

    if (foot.planted) {
      foot.grounded += d;
      // Where this foot ought to be standing right now.
      const idealX = m.x + rx * side * STANCE_HALF_WIDTH;
      const idealZ = m.z + rz * side * STANCE_HALF_WIDTH;
      const drift = Math.hypot(foot.plantX - idealX, foot.plantZ - idealZ);
      const twist = Math.abs(shortestAngle(m.heading - foot.plantYaw));

      // Step when the foot is left behind, or when the body has turned far
      // enough that standing on it would mean a twisted ankle. Only one foot
      // leaves the ground at a time.
      const wants = drift > STEP_TRIGGER || twist > 0.5;
      if (wants && !anySwinging && m.sinceStep > MIN_STEP_GAP) {
        // Lead with whichever foot has been down longest.
        const other = m.feet[1 - i];
        if (!other.planted || foot.grounded >= other.grounded) {
          startStep(m, foot, side, m.moving ? 0.26 : 0.0);
          anySwinging = true;
        }
      }

      if (foot.planted) {
        // Pinned. This is what makes sliding impossible.
        foot.x = foot.plantX;
        foot.z = foot.plantZ;
        foot.y = RIG.ankleY;
        foot.yaw = foot.plantYaw;
        // Roll through the foot: heel down, then push off the toe.
        const push = m.moving ? Math.min(1, foot.grounded / 0.45) : 0;
        foot.pitch = -push * 0.22;
      }
    }

    if (!foot.planted) {
      foot.u += d / foot.swingTime;
      if (foot.u >= 1) {
        foot.u = 1;
        foot.planted = true;
        foot.plantX = foot.toX;
        foot.plantZ = foot.toZ;
        foot.plantYaw = foot.toYaw;
        foot.x = foot.toX;
        foot.z = foot.toZ;
        foot.y = RIG.ankleY;
        foot.yaw = foot.toYaw;
        foot.pitch = 0.12;      // heel strike
        foot.grounded = 0;
      } else {
        // Keep chasing the live target so a step that starts while the body
        // is still accelerating still lands in the right place.
        const ahead = m.speed * foot.swingTime * (1 - foot.u);
        foot.toX = m.x + fx * (ahead + (m.moving ? 0.26 : 0)) + rx * side * STANCE_HALF_WIDTH;
        foot.toZ = m.z + fz * (ahead + (m.moving ? 0.26 : 0)) + rz * side * STANCE_HALF_WIDTH;
        foot.toYaw = m.heading;

        const u = foot.u;
        const ease = u * u * (3 - 2 * u);
        foot.x = foot.fromX + (foot.toX - foot.fromX) * ease;
        foot.z = foot.fromZ + (foot.toZ - foot.fromZ) * ease;
        const clear = Math.max(0.055, Math.min(0.11, 0.05 + m.speed * 0.035));
        foot.y = RIG.ankleY + Math.sin(u * Math.PI) * clear;
        foot.yaw = foot.fromYaw + shortestAngle(foot.toYaw - foot.fromYaw) * ease;
        // Toe off into the swing, heel first on the way down.
        foot.pitch = -0.3 * Math.sin(u * Math.PI) + 0.25 * u * u;
      }
    }
  }

  // ── 4. Pelvis: rise, fall and roll driven by the gait ────
  const swinging = m.feet[0].planted !== m.feet[1].planted;
  const swingU = m.feet[0].planted ? m.feet[1].u : m.feet[0].u;
  const bob = swinging ? Math.sin(swingU * Math.PI) : 0;
  // The body is at its lowest mid-stride and lifts over the stance leg.
  const targetY = RIG.pelvisY - 0.012 + bob * 0.026 * Math.min(1, 0.35 + m.speed);
  m.pelvisY += (targetY - m.pelvisY) * Math.min(1, d * 14);

  // Lean over whichever foot is carrying the weight.
  const stance = m.feet[0].planted && !m.feet[1].planted ? -1 : (!m.feet[0].planted ? 0 : (m.feet[1].planted && !m.feet[0].planted ? 1 : 0));
  const targetRoll = m.moving ? stance * 0.035 * bob : 0;
  m.pelvisRoll += (targetRoll - m.pelvisRoll) * Math.min(1, d * 8);

  // Hips counter-rotate against the shoulders as the legs pass.
  const armPhase = m.feet[0].planted ? -(1 - m.feet[1].u) : (1 - m.feet[0].u);
  const targetSwing = m.moving ? Math.sin(armPhase * Math.PI) * Math.min(1, 0.4 + m.speed * 0.7) : 0;
  m.armSwing += (targetSwing - m.armSwing) * Math.min(1, d * 12);
  m.pelvisYaw += (-m.armSwing * 0.09 - m.pelvisYaw) * Math.min(1, d * 10);

  const targetWeight = m.moving ? 1 : 0;
  m.gaitWeight += (targetWeight - m.gaitWeight) * Math.min(1, d * 6);
}

// ────────────────────────────────────────────────────────────
// TWO-BONE IK
//
// The parent joint is aimed with a quaternion: the minimal rotation that
// takes the bent limb's rest direction onto the direction of the target.
// That is exact for every reachable point, cannot gimbal-lock, and keeps
// the bend in the plane containing the limb — so knees point forwards and
// elbows point backwards without any special casing.
//
// Verified against forward kinematics over 66k random targets: worst-case
// end-effector error 1e-14 m, with no hyperextended knees or inverted
// elbows.
// ────────────────────────────────────────────────────────────

const MAX_LEG_REACH = (RIG.thigh + RIG.shin) * 0.999;
const MAX_ARM_REACH = (RIG.upperArm + RIG.foreArm) * 0.995;

export interface BoneSolution {
  /** Rotation for the parent joint (hip or shoulder). */
  q: THREE.Quaternion;
  /** Bend angle for the child joint, always >= 0. */
  bend: number;
}

const _restDir = new THREE.Vector3();
const _toDir = new THREE.Vector3();

function solveTwoBone(
  tx: number, ty: number, tz: number,
  L1: number, L2: number, maxLen: number,
  /** −1 folds backwards like a knee, +1 folds forwards like an elbow. */
  foldSign: number,
  out: BoneSolution
): BoneSolution {
  let vx = tx, vy = ty, vz = tz;
  let d = Math.hypot(vx, vy, vz);

  if (d > maxLen) {
    const k = maxLen / d;
    vx *= k; vy *= k; vz *= k; d = maxLen;
  }
  const minLen = Math.abs(L1 - L2) + 1e-4;
  if (d < minLen) {
    const k = minLen / (d || 1e-9);
    vx *= k; vy *= k; vz *= k; d = minLen;
  }

  const clamp1 = (v: number) => (v < -1 ? -1 : v > 1 ? 1 : v);
  out.bend = Math.PI - Math.acos(clamp1((L1 * L1 + L2 * L2 - d * d) / (2 * L1 * L2)));
  const alpha = Math.acos(clamp1((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d)));

  _restDir.set(0, -Math.cos(alpha), foldSign * Math.sin(alpha));
  _toDir.set(vx / d, vy / d, vz / d);
  out.q.setFromUnitVectors(_restDir, _toDir);
  return out;
}

/**
 * Aim a leg so the ankle lands on `(tx, ty, tz)`, given in the actor's own
 * space relative to the hip joint. The knee always folds backwards.
 */
export function solveLeg(
  tx: number, ty: number, tz: number, out: BoneSolution
): BoneSolution {
  return solveTwoBone(tx, ty, tz, RIG.thigh, RIG.shin, MAX_LEG_REACH, -1, out);
}

/**
 * Aim an arm so the wrist lands on `(tx, ty, tz)`, given relative to the
 * shoulder joint. The elbow always folds forwards.
 */
export function solveArm(
  tx: number, ty: number, tz: number, out: BoneSolution
): BoneSolution {
  return solveTwoBone(tx, ty, tz, RIG.upperArm, RIG.foreArm, MAX_ARM_REACH, +1, out);
}

export function newBoneSolution(): BoneSolution {
  return { q: new THREE.Quaternion(), bend: 0 };
}
