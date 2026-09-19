// ============================================================
// RATIO RUSH — THE SCENE & QUESTION REHEARSAL THE CAST PERFORMS
//
// Continuous, purposeful acting in EVERY question and scene:
// 1. Question Phase: Actors actively rehearse and discuss the current
//    question, walk between stage marks, gesture expressively, react to
//    answers (celebrating on correct, recalculating on incorrect), and display
//    comic dialogue balloons.
// 2. Filming Take Phase: The complete scripted 26-second movie scene.
// ============================================================

import { RatioQuestion } from '../types';

export type ActorRole = 'lead_actor' | 'lead_actress' | 'co_star' | 'villain';

/**
 * Mutable scene clock. One driver inside the Canvas writes `time` each frame
 * and every rig reads it there, so the whole cast stays on the same beat
 * without a React render per frame.
 */
export const sceneClock: { time: number | null } = { time: null };

/** Active question context updated dynamically per question */
export const activeQuestionContext: {
  question: RatioQuestion | null;
  feedbackStatus: 'idle' | 'correct' | 'incorrect';
  feedbackMessage: string;
} = {
  question: null,
  feedbackStatus: 'idle',
  feedbackMessage: '',
};

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
export const QUESTION_CYCLE_LENGTH = 16;

/** Master scripted scene performed during the final filming take */
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
    marks: { lead_actress: [-0.5, -2.35] },
    focus: { lead_actress: 'lead_actor', lead_actor: 'lead_actress', co_star: 'lead_actress', villain: 'lead_actress' },
    gesture: { lead_actress: 'hand_to_heart', lead_actor: 'listen', co_star: 'listen', villain: 'rest' },
  },
  {
    start: 12.4, end: 16.6,
    label: 'SC 12 — THE VILLAIN CUTS IN',
    speaker: 'villain',
    line: 'Then neither of you gets a single frame of it.',
    marks: { villain: [1.5, -2.0], co_star: [0.8, -2.95] },
    focus: { villain: 'lead_actor', lead_actor: 'villain', lead_actress: 'villain', co_star: 'villain' },
    gesture: { villain: 'menace', lead_actor: 'listen', lead_actress: 'recoil', co_star: 'recoil' },
  },
  {
    start: 16.6, end: 20.6,
    label: 'SC 12 — HERO STANDS HIS GROUND',
    speaker: 'lead_actor',
    line: 'You do not get to rewrite our ratio. Not today.',
    marks: { lead_actor: [0.0, -1.55] },
    focus: { lead_actor: 'villain', villain: 'lead_actor', lead_actress: 'lead_actor', co_star: 'lead_actor' },
    gesture: { lead_actor: 'talk_point', villain: 'recoil', lead_actress: 'plead', co_star: 'listen' },
  },
  {
    start: 20.6, end: 23.6,
    label: 'SC 12 — THE TURN',
    speaker: 'lead_actress',
    line: 'Make it one to one. We finish this picture together.',
    marks: { lead_actress: [-0.9, -1.95], villain: [2.3, -1.6] },
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

/** Dynamic question rehearsal beats generated on the fly for each question */
export function questionBeatsFor(
  q: RatioQuestion | null,
  feedback: 'idle' | 'correct' | 'incorrect'
): Beat[] {
  const rA = q ? q.ratioA : 3;
  const rB = q ? q.ratioB : 2;
  const lA = q?.labelA || 'Item A';
  const lB = q?.labelB || 'Item B';

  if (feedback === 'correct') {
    return [
      {
        start: 0,
        end: 4.0,
        label: 'TAKE APPROVED — CELEBRATION',
        speaker: 'lead_actor',
        line: `PERFECT! The ${rA}:${rB} ratio is completely locked in!`,
        marks: { lead_actor: [-1.2, -1.9], lead_actress: [-0.4, -2.1], co_star: [0.6, -2.3], villain: [2.2, -1.6] },
        focus: { lead_actor: 'lead_actress', lead_actress: 'lead_actor', co_star: 'lead_actor', villain: 'lead_actor' },
        gesture: { lead_actor: 'triumph', lead_actress: 'cheer', co_star: 'cheer', villain: 'recoil' },
      },
    ];
  }

  if (feedback === 'incorrect') {
    return [
      {
        start: 0,
        end: 4.0,
        label: 'SCENE RETAKE — RECALCULATING',
        speaker: 'lead_actress',
        line: `Hold on! Check the ${rA}:${rB} ratio and unit rate multiplier!`,
        marks: { lead_actress: [-0.6, -2.2], lead_actor: [-1.4, -2.0], villain: [1.8, -1.8] },
        focus: { lead_actress: 'lead_actor', lead_actor: 'lead_actress', co_star: 'lead_actress', villain: 'lead_actor' },
        gesture: { lead_actress: 'talk_open', lead_actor: 'plead', villain: 'menace', co_star: 'recoil' },
      },
    ];
  }

  const actionText = q?.studioActionText || `For our scene, ratio is ${rA} ${lA} for every ${rB} ${lB}!`;
  const promptText = q?.mathPrompt
    ? (q.mathPrompt.length > 55 ? q.mathPrompt.slice(0, 52) + '...' : q.mathPrompt)
    : `How many ${lB} match with ${q?.givenQuantityValue || rA * 2} ${lA}?`;

  return [
    {
      start: 0,
      end: 4.0,
      label: 'REHEARSAL — HERO INTRODUCES RATIO',
      speaker: 'lead_actor',
      line: actionText.length > 55 ? actionText.slice(0, 52) + '...' : actionText,
      marks: { lead_actor: [-1.4, -2.0], lead_actress: [-0.5, -2.4], co_star: [0.85, -2.45], villain: [2.0, -1.8] },
      focus: { lead_actor: 'lead_actress', lead_actress: 'lead_actor', co_star: 'lead_actor', villain: 'lead_actor' },
      gesture: { lead_actor: 'talk_open', lead_actress: 'listen', co_star: 'listen', villain: 'rest' },
    },
    {
      start: 4.0,
      end: 8.0,
      label: 'REHEARSAL — ACTRESS DISCUSSES QUESTION',
      speaker: 'lead_actress',
      line: promptText,
      marks: { lead_actress: [-0.4, -2.2], lead_actor: [-1.3, -2.0] },
      focus: { lead_actress: 'lead_actor', lead_actor: 'lead_actress', co_star: 'lead_actress', villain: 'lead_actress' },
      gesture: { lead_actress: 'hand_to_heart', lead_actor: 'listen', co_star: 'listen', villain: 'rest' },
    },
    {
      start: 8.0,
      end: 12.0,
      label: 'REHEARSAL — VILLAIN CHALLENGES MULTIPLIER',
      speaker: 'villain',
      line: `Find the ratio multiplier for ${rA}:${rB} before action is called!`,
      marks: { villain: [1.3, -1.9], co_star: [0.7, -2.6] },
      focus: { villain: 'lead_actor', lead_actor: 'villain', lead_actress: 'villain', co_star: 'villain' },
      gesture: { villain: 'menace', lead_actor: 'listen', lead_actress: 'recoil', co_star: 'recoil' },
    },
    {
      start: 12.0,
      end: 16.0,
      label: 'REHEARSAL — CAST POINTS TO OPTIONS',
      speaker: 'lead_actor',
      line: `Select the correct answer to complete this stage take!`,
      marks: { lead_actor: [-0.2, -1.6], lead_actress: [-0.7, -2.0] },
      focus: { lead_actor: 'camera', lead_actress: 'lead_actor', co_star: 'camera', villain: 'lead_actor' },
      gesture: { lead_actor: 'talk_point', lead_actress: 'plead', co_star: 'cheer', villain: 'rest' },
    },
  ];
}

export function beatAt(time: number, isFilming = false): Beat {
  if (isFilming) {
    const t = ((time % SCENE_LENGTH) + SCENE_LENGTH) % SCENE_LENGTH;
    for (const b of SCENE) if (t >= b.start && t < b.end) return b;
    return SCENE[0];
  }

  const beats = questionBeatsFor(
    activeQuestionContext.question,
    activeQuestionContext.feedbackStatus
  );
  const cycleLen = activeQuestionContext.feedbackStatus !== 'idle' ? 4.0 : QUESTION_CYCLE_LENGTH;
  const t = ((time % cycleLen) + cycleLen) % cycleLen;
  for (const b of beats) if (t >= b.start && t < b.end) return b;
  return beats[0] || SCENE[0];
}

/** The mark an actor should be standing on at this point in the scene. */
export function markAt(role: ActorRole, time: number, isFilming = false): [number, number] {
  if (isFilming) {
    const t = ((time % SCENE_LENGTH) + SCENE_LENGTH) % SCENE_LENGTH;
    let mark = OPENING_MARKS[role];
    for (const b of SCENE) {
      if (b.start > t) break;
      if (b.marks[role]) mark = b.marks[role]!;
    }
    return mark;
  }

  const beats = questionBeatsFor(
    activeQuestionContext.question,
    activeQuestionContext.feedbackStatus
  );
  const cycleLen = activeQuestionContext.feedbackStatus !== 'idle' ? 4.0 : QUESTION_CYCLE_LENGTH;
  const t = ((time % cycleLen) + cycleLen) % cycleLen;
  let mark = OPENING_MARKS[role];
  for (const b of beats) {
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
      p.headPitch = Math.sin(t * 1.9) * 0.07;
      p.torsoLean = 0.02;
      break;
    case 'hand_to_heart':
      p.lShoulderX = -0.88;
      p.lShoulderZ = 0.3;
      p.lElbow = 1.42;
      p.rShoulderX = -0.45 - energy * 0.35;
      p.rShoulderZ = -0.38;
      p.rElbow = 0.95 - energy * 0.3;
      p.headPitch = -0.06;
      p.headRoll = 0.07;
      p.torsoLean = 0.04;
      p.torsoTwist = -0.1;
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
      p.rShoulderX = -0.95 - energy * 0.3;
      p.rShoulderZ = -0.24;
      p.rElbow = 0.55 - energy * 0.2;
      p.lShoulderX = 0.25;
      p.lShoulderZ = 0.16;
      p.lElbow = 1.5;
      p.headPitch = 0.1;
      p.headRoll = -0.06;
      p.torsoLean = 0.11;
      break;
    case 'recoil':
      p.lShoulderX = -0.78;
      p.lShoulderZ = 0.58;
      p.lElbow = 1.05;
      p.rShoulderX = -0.78;
      p.rShoulderZ = -0.58;
      p.rElbow = 1.05;
      p.headPitch = -0.1;
      p.headYaw = 0.12;
      p.torsoLean = -0.2;
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
export function lineAt(time: number, isFilming = false): { speaker: ActorRole; line: string } | null {
  const b = beatAt(time, isFilming);
  if (!b.speaker || !b.line) return null;
  return { speaker: b.speaker, line: b.line };
}
