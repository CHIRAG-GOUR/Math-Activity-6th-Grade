// ============================================================
// RATIO RUSH — THE SCENE THE CAST ACTUALLY PERFORMS
//
// A 26-second scripted scene, broken into beats. Each beat says who is
// speaking, where every actor stands, who they are looking at and what
// they are doing with their hands. The rig in StudioCharacters3D reads
// this every frame and eases toward it, so the cast genuinely turn to
// each other, take their turns talking, react, and move on their marks
// instead of standing in a line with their arms in the air.
// ============================================================

export type ActorRole = 'lead_actor' | 'lead_actress' | 'co_star' | 'villain';

/**
 * Mutable scene clock. One driver inside the Canvas writes `time` each frame
 * and every rig reads it there, so the whole cast stays on the same beat
 * without a React render per frame.
 */
export const sceneClock: { time: number | null } = { time: null };

export type Gesture =
  | 'rest'          // arms down, easy stance
  | 'talk_open'     // open-palm explaining
  | 'talk_point'    // emphatic point at whoever they're addressing
  | 'listen'        // arms low, weight on one hip, nodding
  | 'hand_to_heart' // one hand to chest, pleading
  | 'plead'         // both hands out, imploring
  | 'menace'        // slow accusing point, other hand behind back
  | 'recoil'        // hands up defensively, leaning away
  | 'cheer'         // arms raised in relief
  | 'triumph';      // final hero tableau

export interface Beat {
  start: number;
  end: number;
  label: string;
  speaker: ActorRole | null;
  /** The line being delivered, shown over the speaker's head. */
  line?: string;
  /** Stage mark [x, z] for anyone who moves this beat. */
  marks: Partial<Record<ActorRole, [number, number]>>;
  /** Who each actor is looking at ('camera' means out to the lens). */
  focus: Partial<Record<ActorRole, ActorRole | 'camera'>>;
  gesture: Partial<Record<ActorRole, Gesture>>;
}

/** Opening marks — a loose semicircle, already turned in toward each other. */
export const OPENING_MARKS: Record<ActorRole, [number, number]> = {
  lead_actor: [-1.9, -1.9],
  lead_actress: [-0.55, -2.5],
  co_star: [0.85, -2.45],
  villain: [2.15, -1.7],
};

export const SCENE_LENGTH = 26;

export const SCENE: Beat[] = [
  {
    start: 0, end: 3.4,
    label: 'SC 12 — THE MEETING',
    speaker: null,
    marks: OPENING_MARKS,
    focus: { lead_actor: 'lead_actress', lead_actress: 'lead_actor', co_star: 'lead_actress', villain: 'lead_actor' },
    gesture: { lead_actor: 'rest', lead_actress: 'rest', co_star: 'rest', villain: 'rest' },
  },
  {
    start: 3.4, end: 8.2,
    label: 'SC 12 — HERO: "WE SPLIT IT THREE TO ONE."',
    speaker: 'lead_actor',
    line: 'We split the reel three to one — that was the deal.',
    marks: { lead_actor: [-1.5, -2.1] },
    focus: { lead_actor: 'lead_actress', lead_actress: 'lead_actor', co_star: 'lead_actor', villain: 'lead_actor' },
    gesture: { lead_actor: 'talk_open', lead_actress: 'listen', co_star: 'listen', villain: 'rest' },
  },
  {
    start: 8.2, end: 12.4,
    label: 'SC 12 — SHE ANSWERS',
    speaker: 'lead_actress',
    line: 'Three to one? I carried two of every four scenes.',
    marks: { lead_actress: [-0.75, -2.2] },
    focus: { lead_actress: 'lead_actor', lead_actor: 'lead_actress', co_star: 'lead_actress', villain: 'lead_actress' },
    gesture: { lead_actress: 'hand_to_heart', lead_actor: 'listen', co_star: 'listen', villain: 'rest' },
  },
  {
    start: 12.4, end: 16.6,
    label: 'SC 12 — THE VILLAIN CUTS IN',
    speaker: 'villain',
    line: 'Then neither of you gets a single frame of it.',
    marks: { villain: [1.5, -2.0], co_star: [1.25, -2.8] },
    focus: { villain: 'lead_actor', lead_actor: 'villain', lead_actress: 'villain', co_star: 'villain' },
    gesture: { villain: 'menace', lead_actor: 'listen', lead_actress: 'recoil', co_star: 'recoil' },
  },
  {
    start: 16.6, end: 20.6,
    label: 'SC 12 — HERO STANDS HIS GROUND',
    speaker: 'lead_actor',
    line: 'You do not get to rewrite our ratio. Not today.',
    marks: { lead_actor: [-0.9, -1.85] },
    focus: { lead_actor: 'villain', villain: 'lead_actor', lead_actress: 'lead_actor', co_star: 'lead_actor' },
    gesture: { lead_actor: 'talk_point', villain: 'recoil', lead_actress: 'plead', co_star: 'listen' },
  },
  {
    start: 20.6, end: 23.6,
    label: 'SC 12 — THE TURN',
    speaker: 'lead_actress',
    line: 'Make it one to one. We finish this picture together.',
    marks: { lead_actress: [-1.25, -2.05], villain: [2.3, -1.6] },
    focus: { lead_actress: 'lead_actor', lead_actor: 'lead_actress', co_star: 'lead_actress', villain: 'lead_actor' },
    gesture: { lead_actress: 'talk_open', lead_actor: 'listen', co_star: 'cheer', villain: 'rest' },
  },
  {
    start: 23.6, end: SCENE_LENGTH,
    label: 'SC 12 — FINAL TABLEAU',
    speaker: null,
    marks: OPENING_MARKS,
    focus: { lead_actor: 'camera', lead_actress: 'camera', co_star: 'camera', villain: 'camera' },
    gesture: { lead_actor: 'triumph', lead_actress: 'triumph', co_star: 'cheer', villain: 'menace' },
  },
];

export function beatAt(time: number): Beat {
  const t = ((time % SCENE_LENGTH) + SCENE_LENGTH) % SCENE_LENGTH;
  for (const b of SCENE) if (t >= b.start && t < b.end) return b;
  return SCENE[0];
}

/** The mark an actor should be standing on at this point in the scene. */
export function markAt(role: ActorRole, time: number): [number, number] {
  const t = ((time % SCENE_LENGTH) + SCENE_LENGTH) % SCENE_LENGTH;
  let mark = OPENING_MARKS[role];
  for (const b of SCENE) {
    if (b.start > t) break;
    if (b.marks[role]) mark = b.marks[role]!;
  }
  return mark;
}

export interface PoseTargets {
  /** Shoulder swing: negative lifts the arm forward. */
  lShoulderX: number; lShoulderZ: number;
  rShoulderX: number; rShoulderZ: number;
  /** Positive values bend the forearm forward. */
  lElbow: number; rElbow: number;
  headPitch: number; headYaw: number; headRoll: number;
  torsoLean: number; torsoTwist: number;
}

const REST: PoseTargets = {
  lShoulderX: -0.06, lShoulderZ: 0.11,
  rShoulderX: -0.06, rShoulderZ: -0.11,
  lElbow: 0.22, rElbow: 0.22,
  headPitch: 0, headYaw: 0, headRoll: 0,
  torsoLean: 0, torsoTwist: 0,
};

/**
 * The pose for a gesture. `energy` is the speech/emphasis envelope (0..1),
 * so a talking actor's hands move with the line rather than on a loop that
 * has nothing to do with what they're saying.
 */
export function poseFor(gesture: Gesture, energy: number, t: number): PoseTargets {
  const p: PoseTargets = { ...REST };
  switch (gesture) {
    case 'talk_open':
      p.rShoulderX = -0.55 - energy * 0.45;
      p.rShoulderZ = -0.42;
      p.rElbow = 1.15 - energy * 0.35;
      p.lShoulderX = -0.32 - energy * 0.2;
      p.lShoulderZ = 0.4;
      p.lElbow = 1.0 - energy * 0.25;
      p.headPitch = -0.04 + energy * 0.05;
      p.torsoLean = 0.05 + energy * 0.04;
      break;
    case 'talk_point':
      p.rShoulderX = -0.95 - energy * 0.5;
      p.rShoulderZ = -0.22;
      p.rElbow = 0.5 - energy * 0.35;
      p.lShoulderX = -0.2;
      p.lShoulderZ = 0.34;
      p.lElbow = 0.75;
      p.headPitch = 0.02 + energy * 0.04;
      p.torsoLean = 0.09 + energy * 0.05;
      break;
    case 'listen':
      p.lShoulderX = -0.18;
      p.lShoulderZ = 0.2;
      p.lElbow = 0.85;
      p.rShoulderX = -0.1;
      p.rShoulderZ = -0.16;
      p.rElbow = 0.45;
      // small, slow agreement nod
      p.headPitch = Math.sin(t * 1.9) * 0.07;
      p.torsoLean = 0.02;
      break;
    case 'hand_to_heart':
      p.lShoulderX = -0.95;
      p.lShoulderZ = 0.52;
      p.lElbow = 1.75;
      p.rShoulderX = -0.45 - energy * 0.35;
      p.rShoulderZ = -0.38;
      p.rElbow = 0.95 - energy * 0.3;
      p.headPitch = -0.06;
      p.headRoll = 0.07;
      p.torsoLean = 0.04;
      break;
    case 'plead':
      p.lShoulderX = -0.8 - energy * 0.2;
      p.lShoulderZ = 0.5;
      p.lElbow = 0.9;
      p.rShoulderX = -0.8 - energy * 0.2;
      p.rShoulderZ = -0.5;
      p.rElbow = 0.9;
      p.headPitch = -0.1;
      p.torsoLean = 0.08;
      break;
    case 'menace':
      p.rShoulderX = -1.05 - energy * 0.35;
      p.rShoulderZ = -0.2;
      p.rElbow = 0.3;
      p.lShoulderX = 0.25;      // other hand tucked behind the back
      p.lShoulderZ = 0.16;
      p.lElbow = 1.5;
      p.headPitch = 0.1;
      p.headRoll = -0.06;
      p.torsoLean = 0.11;
      break;
    case 'recoil':
      p.lShoulderX = -1.25;
      p.lShoulderZ = 0.62;
      p.lElbow = 1.5;
      p.rShoulderX = -1.25;
      p.rShoulderZ = -0.62;
      p.rElbow = 1.5;
      p.headPitch = -0.14;
      p.torsoLean = -0.14;      // leaning away
      break;
    case 'cheer':
      p.lShoulderX = -2.25;
      p.lShoulderZ = 0.35;
      p.lElbow = 0.35;
      p.rShoulderX = -2.25;
      p.rShoulderZ = -0.35;
      p.rElbow = 0.35;
      p.headPitch = -0.16;
      break;
    case 'triumph':
      p.rShoulderX = -1.9;
      p.rShoulderZ = -0.3;
      p.rElbow = 0.25;
      p.lShoulderX = -0.15;
      p.lShoulderZ = 0.3;
      p.lElbow = 0.6;
      p.headPitch = -0.1;
      p.torsoLean = 0.03;
      break;
    case 'rest':
    default:
      break;
  }
  return p;
}

/** Speech envelope — syllable-rate emphasis while a character has the line. */
export function speechEnergy(t: number): number {
  const syllable = Math.abs(Math.sin(t * 5.2));
  const phrase = 0.55 + 0.45 * Math.sin(t * 0.9);
  return Math.max(0, Math.min(1, syllable * phrase));
}

/** The line being spoken right now, or null between lines. */
export function lineAt(time: number): { speaker: ActorRole; line: string } | null {
  const b = beatAt(time);
  if (!b.speaker || !b.line) return null;
  return { speaker: b.speaker, line: b.line };
}
