// ============================================================
// RATIO RUSH — ACTOR RIG
//
// Proportions, joint layout, facial states and the upper-body gesture
// library for the cast. Everything here is plain data and maths: the React
// component in world/ActorCharacter3D.tsx builds the geometry, and the
// runtime in world/ActorStage3D.tsx drives it.
//
// The figure is a 7.5-head stylised human, 1.75 m tall, standing with its
// feet on y = 0. Every offset below is measured from the joint above it, so
// the chain can be rebuilt or re-proportioned in one place.
// ============================================================

/** Body measurements, in metres. */
export const RIG = {
  height: 1.75,

  // Spine chain, measured from the ground.
  pelvisY: 0.94,
  spineLen: 0.17,   // pelvis  → lower spine
  chestLen: 0.19,   // spine   → chest
  neckLen: 0.12,    // chest   → neck base
  headLen: 0.13,    // neck    → head centre

  headRadius: 0.115,
  eyeForward: 0.095,
  eyeSpacing: 0.045,
  eyeHeight: 0.022,

  // Arms. Shoulder sits at the top of the chest, offset sideways.
  clavicleX: 0.075,
  shoulderX: 0.115,
  shoulderY: 0.055,
  upperArm: 0.30,
  foreArm: 0.26,
  hand: 0.095,
  fingerLen: 0.055,

  // Legs.
  hipX: 0.095,
  thigh: 0.46,
  shin: 0.41,
  ankleY: 0.07,
  footLen: 0.25,
  footWidth: 0.10,

  // Silhouette.
  shoulderWidth: 0.38,
  chestDepth: 0.20,
  waistWidth: 0.26,
  limbRadius: 0.052,
} as const;

/** Shoulder height off the ground, used for gaze and prop maths. */
export const SHOULDER_HEIGHT =
  RIG.pelvisY + RIG.spineLen + RIG.chestLen + RIG.shoulderY;
/** Eye height off the ground. */
export const EYE_HEIGHT =
  RIG.pelvisY + RIG.spineLen + RIG.chestLen + RIG.neckLen + RIG.headLen + RIG.eyeHeight;

// ────────────────────────────────────────────────────────────
// FACIAL STATE
// ────────────────────────────────────────────────────────────

export type Expression =
  | 'neutral'
  | 'happy'
  | 'surprised'
  | 'confused'
  | 'excited'
  | 'concerned'
  | 'laughing'
  | 'celebrating'
  | 'stern';

export interface FaceTargets {
  /** Inner brow lift (+) / lower (−). */
  browInner: number;
  /** Outer brow lift. */
  browOuter: number;
  /** Brow tilt: + is angry/inward, − is worried/outward. */
  browAngle: number;
  /** 1 = wide open, 0 = closed. */
  eyeOpen: number;
  /** Jaw drop, 0..1. */
  mouthOpen: number;
  /** Corner pull: + smile, − frown. */
  mouthCurve: number;
  /** Horizontal stretch of the mouth. */
  mouthWidth: number;
  /** Cheek raise, which also narrows the eyes a little. */
  cheek: number;
}

const FACE_NEUTRAL: FaceTargets = {
  browInner: 0, browOuter: 0, browAngle: 0,
  eyeOpen: 1, mouthOpen: 0.04, mouthCurve: 0.06, mouthWidth: 1, cheek: 0,
};

/**
 * Deliberately restrained: these read as an expression at a distance
 * without tipping into cartoon mugging.
 */
export const EXPRESSIONS: Record<Expression, FaceTargets> = {
  neutral: FACE_NEUTRAL,
  happy: { ...FACE_NEUTRAL, browOuter: 0.1, mouthCurve: 0.55, mouthWidth: 1.1, cheek: 0.4, eyeOpen: 0.88 },
  surprised: { ...FACE_NEUTRAL, browInner: 0.55, browOuter: 0.6, eyeOpen: 1.25, mouthOpen: 0.45, mouthWidth: 0.85 },
  confused: { ...FACE_NEUTRAL, browInner: 0.3, browOuter: -0.15, browAngle: -0.22, mouthCurve: -0.15, mouthWidth: 0.88 },
  excited: { ...FACE_NEUTRAL, browInner: 0.4, browOuter: 0.45, eyeOpen: 1.15, mouthOpen: 0.3, mouthCurve: 0.5, mouthWidth: 1.12, cheek: 0.3 },
  concerned: { ...FACE_NEUTRAL, browInner: 0.35, browOuter: -0.1, browAngle: -0.3, mouthCurve: -0.3, eyeOpen: 0.92 },
  laughing: { ...FACE_NEUTRAL, browOuter: 0.25, eyeOpen: 0.45, mouthOpen: 0.55, mouthCurve: 0.6, mouthWidth: 1.15, cheek: 0.7 },
  celebrating: { ...FACE_NEUTRAL, browInner: 0.45, browOuter: 0.5, eyeOpen: 1.1, mouthOpen: 0.5, mouthCurve: 0.65, mouthWidth: 1.2, cheek: 0.55 },
  stern: { ...FACE_NEUTRAL, browInner: -0.3, browOuter: -0.2, browAngle: 0.3, eyeOpen: 0.85, mouthCurve: -0.2, mouthWidth: 0.92 },
};

// ────────────────────────────────────────────────────────────
// UPPER-BODY GESTURES
//
// Locomotion owns the legs and the pelvis; these own everything above the
// waist. Angles are local Euler radians. A negative shoulder X lifts the
// arm forward; a positive elbow value bends the forearm forward.
// ────────────────────────────────────────────────────────────

export type Gesture =
  | 'idle'
  | 'walk'          // arms swing; locomotion supplies the phase
  | 'talk_open'     // open-palm explaining
  | 'talk_point'    // emphatic point at whoever is being addressed
  | 'talk_count'    // counting items off on the fingers
  | 'listen'        // weight on one hip, small nods
  | 'listen_arms_crossed'
  | 'hand_to_heart'
  | 'present'       // both hands offering something forward
  | 'reach'         // reaching for a prop; locomotion overrides the arm
  | 'carry'         // holding a prop at chest height
  | 'point_at_prop'
  | 'shrug'
  | 'recoil'
  | 'cheer'
  | 'applaud'
  | 'thumbs_up';

export interface ArmPose {
  /** Shoulder swing. Negative lifts the arm forward. */
  shoulderX: number;
  /** Shoulder abduction. Positive lifts the arm away from the body. */
  shoulderZ: number;
  /** Shoulder rotation about the limb axis. */
  shoulderY: number;
  /** Elbow bend. Positive folds the forearm forward. */
  elbow: number;
  /** Wrist pitch. */
  wristX: number;
  /** Finger curl, 0 = flat, 1 = fist. */
  curl: number;
  /** Thumb spread. */
  thumb: number;
}

export interface BodyPose {
  left: ArmPose;
  right: ArmPose;
  /** Forward/back lean at the waist. */
  spineLean: number;
  /** Twist at the waist. */
  spineTwist: number;
  /** Side bend at the waist. */
  spineSide: number;
  /** Chest lift, which reads as confidence or deflation. */
  chestLift: number;
  headPitch: number;
  headYaw: number;
  headRoll: number;
  /** Which hip the weight sits over, −1..1. */
  weightShift: number;
}

const ARM_REST: ArmPose = {
  shoulderX: -0.04, shoulderZ: 0.06, shoulderY: 0.05,
  elbow: 0.18, wristX: 0.04, curl: 0.22, thumb: 0.2,
};

function mirror(a: ArmPose): ArmPose {
  return { ...a, shoulderZ: -a.shoulderZ, shoulderY: -a.shoulderY };
}

export const BODY_REST: BodyPose = {
  left: ARM_REST,
  right: mirror(ARM_REST),
  spineLean: 0, spineTwist: 0, spineSide: 0, chestLift: 0,
  headPitch: 0, headYaw: 0, headRoll: 0, weightShift: 0,
};

/** Small helper so the gesture table below stays readable. */
function arm(p: Partial<ArmPose>): ArmPose {
  return { ...ARM_REST, ...p };
}

/**
 * The pose for a gesture. `energy` is the speech emphasis envelope (0..1)
 * so a talking actor's hands move with the line rather than on a loop that
 * has nothing to do with what they are saying. `t` is wall time, used only
 * for slow idle drift.
 */
export function poseFor(gesture: Gesture, energy: number, t: number): BodyPose {
  const p: BodyPose = {
    ...BODY_REST,
    left: { ...ARM_REST },
    right: { ...mirror(ARM_REST) },
  };

  switch (gesture) {
    case 'talk_open':
      p.right = arm({ shoulderX: -0.62 - energy * 0.4, shoulderZ: -0.34, shoulderY: -0.4, elbow: 1.15 - energy * 0.3, wristX: -0.25, curl: 0.06, thumb: 0.5 });
      p.left = arm({ shoulderX: -0.38 - energy * 0.18, shoulderZ: 0.3, shoulderY: 0.36, elbow: 1.0 - energy * 0.2, wristX: -0.2, curl: 0.08, thumb: 0.5 });
      p.spineLean = 0.05 + energy * 0.04;
      p.headPitch = -0.03 + energy * 0.04;
      p.chestLift = 0.04;
      break;

    case 'talk_point':
      p.right = arm({ shoulderX: -1.0 - energy * 0.45, shoulderZ: -0.18, shoulderY: -0.1, elbow: 0.45 - energy * 0.3, wristX: -0.1, curl: 0.75, thumb: 0.15 });
      p.left = arm({ shoulderX: -0.22, shoulderZ: 0.26, elbow: 0.7, curl: 0.35 });
      p.spineLean = 0.09 + energy * 0.05;
      p.spineTwist = -0.12;
      p.headPitch = 0.02;
      break;

    case 'talk_count':
      // Counting off on the fingers — the hand is held up and open.
      p.left = arm({ shoulderX: -0.85, shoulderZ: 0.3, shoulderY: 0.5, elbow: 1.55, wristX: -0.35, curl: 0.05, thumb: 0.7 });
      p.right = arm({ shoulderX: -0.78 - energy * 0.2, shoulderZ: -0.26, shoulderY: -0.45, elbow: 1.35, wristX: -0.3, curl: 0.55, thumb: 0.3 });
      p.spineLean = 0.05;
      p.spineTwist = 0.1;
      p.headPitch = 0.12;   // glancing at their own hands
      break;

    case 'listen':
      p.left = arm({ shoulderX: -0.16, shoulderZ: 0.14, elbow: 0.8, curl: 0.3 });
      p.right = arm({ shoulderX: -0.08, shoulderZ: -0.12, elbow: 0.42, curl: 0.28 });
      p.weightShift = 0.35 + Math.sin(t * 0.45) * 0.12;
      p.spineSide = -0.03;
      break;

    case 'listen_arms_crossed':
      p.left = arm({ shoulderX: -0.5, shoulderZ: 0.16, shoulderY: 0.55, elbow: 1.85, wristX: -0.2, curl: 0.3 });
      p.right = arm({ shoulderX: -0.46, shoulderZ: -0.16, shoulderY: -0.55, elbow: 1.9, wristX: -0.2, curl: 0.3 });
      p.weightShift = -0.3 + Math.sin(t * 0.4) * 0.1;
      p.chestLift = -0.03;
      break;

    case 'hand_to_heart':
      p.left = arm({ shoulderX: -0.72, shoulderZ: 0.2, shoulderY: 0.7, elbow: 1.5, wristX: -0.3, curl: 0.15, thumb: 0.4 });
      p.right = arm({ shoulderX: -0.5 - energy * 0.3, shoulderZ: -0.32, shoulderY: -0.35, elbow: 0.95 - energy * 0.25, curl: 0.1, thumb: 0.5 });
      p.spineLean = 0.04;
      p.headRoll = 0.06;
      p.headPitch = -0.05;
      break;

    case 'present':
      p.left = arm({ shoulderX: -0.85 - energy * 0.15, shoulderZ: 0.24, shoulderY: 0.45, elbow: 0.85, wristX: -0.45, curl: 0.02, thumb: 0.6 });
      p.right = arm({ shoulderX: -0.85 - energy * 0.15, shoulderZ: -0.24, shoulderY: -0.45, elbow: 0.85, wristX: -0.45, curl: 0.02, thumb: 0.6 });
      p.spineLean = 0.06;
      p.chestLift = 0.05;
      p.headPitch = -0.04;
      break;

    case 'carry':
      p.left = arm({ shoulderX: -0.95, shoulderZ: 0.2, shoulderY: 0.3, elbow: 1.5, wristX: -0.15, curl: 0.45, thumb: 0.35 });
      p.right = arm({ shoulderX: -0.95, shoulderZ: -0.2, shoulderY: -0.3, elbow: 1.5, wristX: -0.15, curl: 0.45, thumb: 0.35 });
      p.spineLean = -0.04;   // counterbalancing the load
      p.chestLift = 0.03;
      break;

    case 'point_at_prop':
      p.right = arm({ shoulderX: -0.72, shoulderZ: -0.2, shoulderY: -0.15, elbow: 0.32, wristX: 0.1, curl: 0.8, thumb: 0.1 });
      p.left = arm({ shoulderX: -0.14, shoulderZ: 0.2, elbow: 0.6, curl: 0.3 });
      p.spineLean = 0.1;
      p.headPitch = 0.18;    // looking down at what they are pointing to
      break;

    case 'shrug':
      p.left = arm({ shoulderX: -0.3, shoulderZ: 0.62, shoulderY: 0.5, elbow: 1.25, wristX: -0.5, curl: 0.05, thumb: 0.6 });
      p.right = arm({ shoulderX: -0.3, shoulderZ: -0.62, shoulderY: -0.5, elbow: 1.25, wristX: -0.5, curl: 0.05, thumb: 0.6 });
      p.chestLift = 0.07;
      p.headRoll = 0.08;
      p.headPitch = -0.06;
      break;

    case 'recoil':
      p.left = arm({ shoulderX: -0.82, shoulderZ: 0.5, shoulderY: 0.35, elbow: 1.1, wristX: -0.55, curl: 0.05, thumb: 0.6 });
      p.right = arm({ shoulderX: -0.82, shoulderZ: -0.5, shoulderY: -0.35, elbow: 1.1, wristX: -0.55, curl: 0.05, thumb: 0.6 });
      p.spineLean = -0.22;
      p.headPitch = -0.1;
      p.headYaw = 0.14;
      break;

    case 'cheer':
      p.left = arm({ shoulderX: -2.35, shoulderZ: 0.3, shoulderY: 0.2, elbow: 0.3, curl: 0.85, thumb: 0.1 });
      p.right = arm({ shoulderX: -2.35, shoulderZ: -0.3, shoulderY: -0.2, elbow: 0.3, curl: 0.85, thumb: 0.1 });
      p.spineLean = -0.1;
      p.chestLift = 0.1;
      p.headPitch = -0.2;
      break;

    case 'applaud': {
      // Hands meet on the beat rather than hovering near each other.
      const clap = Math.abs(Math.sin(t * 6.5));
      p.left = arm({ shoulderX: -1.15, shoulderZ: 0.1 + clap * 0.16, shoulderY: 0.62, elbow: 1.5, wristX: -0.2, curl: 0.05, thumb: 0.5 });
      p.right = arm({ shoulderX: -1.15, shoulderZ: -0.1 - clap * 0.16, shoulderY: -0.62, elbow: 1.5, wristX: -0.2, curl: 0.05, thumb: 0.5 });
      p.chestLift = 0.05;
      p.headPitch = -0.05;
      break;
    }

    case 'thumbs_up':
      p.right = arm({ shoulderX: -0.95, shoulderZ: -0.22, shoulderY: -0.5, elbow: 1.35, wristX: -0.1, curl: 0.95, thumb: -0.9 });
      p.left = arm({ shoulderX: -0.12, shoulderZ: 0.18, elbow: 0.5, curl: 0.3 });
      p.chestLift = 0.06;
      p.headRoll = -0.05;
      break;

    case 'reach':
    case 'walk':
    case 'idle':
    default:
      p.weightShift = Math.sin(t * 0.38) * 0.18;
      p.left.shoulderX = -0.04 + Math.sin(t * 0.5) * 0.02;
      p.right.shoulderX = -0.04 - Math.sin(t * 0.5) * 0.02;
      break;
  }

  return p;
}

/** Blend two poses. `k` of 0 returns `a`, 1 returns `b`. */
export function blendPose(a: BodyPose, b: BodyPose, k: number, out: BodyPose): BodyPose {
  const lerp = (x: number, y: number) => x + (y - x) * k;
  const blendArm = (x: ArmPose, y: ArmPose, o: ArmPose) => {
    o.shoulderX = lerp(x.shoulderX, y.shoulderX);
    o.shoulderZ = lerp(x.shoulderZ, y.shoulderZ);
    o.shoulderY = lerp(x.shoulderY, y.shoulderY);
    o.elbow = lerp(x.elbow, y.elbow);
    o.wristX = lerp(x.wristX, y.wristX);
    o.curl = lerp(x.curl, y.curl);
    o.thumb = lerp(x.thumb, y.thumb);
  };
  blendArm(a.left, b.left, out.left);
  blendArm(a.right, b.right, out.right);
  out.spineLean = lerp(a.spineLean, b.spineLean);
  out.spineTwist = lerp(a.spineTwist, b.spineTwist);
  out.spineSide = lerp(a.spineSide, b.spineSide);
  out.chestLift = lerp(a.chestLift, b.chestLift);
  out.headPitch = lerp(a.headPitch, b.headPitch);
  out.headYaw = lerp(a.headYaw, b.headYaw);
  out.headRoll = lerp(a.headRoll, b.headRoll);
  out.weightShift = lerp(a.weightShift, b.weightShift);
  return out;
}

/** A fresh mutable pose, for holding eased state. */
export function newPose(): BodyPose {
  return {
    ...BODY_REST,
    left: { ...ARM_REST },
    right: { ...mirror(ARM_REST) },
  };
}

/** Speech envelope — syllable-rate emphasis while a character has the line. */
export function speechEnergy(t: number): number {
  const syllable = Math.abs(Math.sin(t * 5.4));
  const phrase = 0.55 + 0.45 * Math.sin(t * 0.9);
  return Math.max(0, Math.min(1, syllable * phrase));
}
