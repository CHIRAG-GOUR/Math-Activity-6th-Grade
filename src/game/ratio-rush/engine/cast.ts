// ============================================================
// RATIO RUSH — THE CAST
//
// A small, fixed company of actors. Each one's appearance is declared once
// here, so the hero in question 1 is recognisably the same person as the
// hero in question 8 — nobody is generated per scene.
//
// ActorState is the live, mutable record the stage runtime writes each
// frame and the character component reads. It never goes through React.
// ============================================================

import * as THREE from 'three';
import { ActorMotion, createMotion } from './actorLocomotion';
import {
  BodyPose,
  Expression,
  FaceTargets,
  EXPRESSIONS,
  Gesture,
  newPose,
} from './actorRig';

export type ActorId = 'hero' | 'lead' | 'rival';

export type HairStyle = 'short_swept' | 'long_wavy' | 'tight_curls';

export interface CastMember {
  id: ActorId;
  /** Shown on the slate and in the credits. */
  name: string;
  role: string;
  skin: string;
  /** Slightly darker than `skin`, for the underside of the jaw and hands. */
  skinShade: string;
  hair: string;
  hairStyle: HairStyle;
  top: string;
  topTrim: string;
  trousers: string;
  shoes: string;
  /** Overall height multiplier — nobody is a clone of anybody else. */
  build: number;
  /** Shoulder breadth multiplier. */
  frame: number;
  /** Eye colour. */
  iris: string;
}

/**
 * Three principals. Distinct silhouette, colour and build, so they read
 * apart instantly even in a wide shot.
 */
export const CAST: Record<ActorId, CastMember> = {
  hero: {
    id: 'hero',
    name: 'RAVI',
    role: 'Lead',
    skin: '#e8b48a',
    skinShade: '#c9926a',
    hair: '#1c1512',
    hairStyle: 'short_swept',
    top: '#1d4ed8',
    topTrim: '#fbbf24',
    trousers: '#1e293b',
    shoes: '#0f172a',
    build: 1.04,
    frame: 1.08,
    iris: '#3b2417',
  },
  lead: {
    id: 'lead',
    name: 'MAYA',
    role: 'Lead',
    skin: '#f0c9a4',
    skinShade: '#d3a57e',
    hair: '#4a2317',
    hairStyle: 'long_wavy',
    top: '#0d9488',
    topTrim: '#f0fdfa',
    trousers: '#134e4a',
    shoes: '#292524',
    build: 0.96,
    frame: 0.94,
    iris: '#5b3a1f',
  },
  rival: {
    id: 'rival',
    name: 'DEV',
    role: 'Supporting',
    skin: '#a9714b',
    skinShade: '#8a5a39',
    hair: '#0f0d0c',
    hairStyle: 'tight_curls',
    top: '#7c2d12',
    topTrim: '#fed7aa',
    trousers: '#3f3f46',
    shoes: '#1c1917',
    build: 1.0,
    frame: 1.02,
    iris: '#2b1b12',
  },
};

export const CAST_ORDER: ActorId[] = ['hero', 'lead', 'rival'];

/** What an actor is currently holding, if anything. */
export interface CarriedProp {
  /** Index into the stage's prop list. */
  propIndex: number;
  /** Which hand. */
  hand: 'left' | 'right';
}

export interface ActorState {
  member: CastMember;
  motion: ActorMotion;

  /** The gesture the screenplay has asked for. */
  gesture: Gesture;
  /** Eased pose actually being rendered. */
  pose: BodyPose;
  /** Target pose for this frame, recomputed each tick. */
  target: BodyPose;

  /** True while this actor has the line. */
  speaking: boolean;

  expression: Expression;
  /** Eased facial state. */
  face: FaceTargets;

  /** World point the eyes and head should track, or null to look ahead. */
  gaze: THREE.Vector3 | null;
  /** Eased head aim, in the actor's own space. */
  headYaw: number;
  headPitch: number;
  /** Eased eye aim, which leads the head slightly. */
  eyeYaw: number;
  eyePitch: number;

  /**
   * World point a hand is reaching for, or null. While set, that arm is
   * driven by IK instead of the gesture pose.
   */
  reach: THREE.Vector3 | null;
  reachHand: 'left' | 'right';
  /** 0..1 blend between the gesture pose and the IK reach. */
  reachWeight: number;

  carrying: CarriedProp | null;

  /** Scratch: world position of each wrist, written by the rig each frame. */
  wristL: THREE.Vector3;
  wristR: THREE.Vector3;
}

export function createActor(
  id: ActorId,
  x: number,
  z: number,
  heading: number
): ActorState {
  const member = CAST[id];
  return {
    member,
    motion: createMotion(x, z, heading, 1.15 * member.build),
    gesture: 'idle',
    pose: newPose(),
    target: newPose(),
    speaking: false,
    expression: 'neutral',
    face: { ...EXPRESSIONS.neutral },
    gaze: null,
    headYaw: 0,
    headPitch: 0,
    eyeYaw: 0,
    eyePitch: 0,
    reach: null,
    reachHand: 'right',
    reachWeight: 0,
    carrying: null,
    wristL: new THREE.Vector3(),
    wristR: new THREE.Vector3(),
  };
}

/** Ease the facial state toward whatever expression is current. */
export function stepFace(a: ActorState, dt: number) {
  const want = EXPRESSIONS[a.expression];
  const k = Math.min(1, dt * 6);
  const f = a.face;
  (Object.keys(want) as (keyof FaceTargets)[]).forEach((key) => {
    f[key] += (want[key] - f[key]) * k;
  });
}
