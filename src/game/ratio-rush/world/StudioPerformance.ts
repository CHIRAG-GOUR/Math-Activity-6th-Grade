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

import * as THREE from 'three';
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
  | 'triumph'       // final hero tableau
  | 'high_five_right'
  | 'high_five_left'
  | 'combat_stance'   // UFC boxing guard protecting chin
  | 'fight_jab'       // fast straight left jab
  | 'fight_cross'     // powerful right cross
  | 'fight_slip_dodge'// weaving under the strike
  | 'fight_block'     // forearm guard blocking strike
  | 'fight_uppercut'  // climax right uppercut knockout
  | 'fight_knockdown' // staggered back falling to canvas
  | 'knocked_out';    // defeated on stage floor

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

/** Opening marks — spacious, professional cinematic staging (no crowding!) */
export const OPENING_MARKS: Record<ActorRole, [number, number]> = {
  lead_actor: [-1.6, -2.2],
  lead_actress: [1.1, -2.2],
  co_star: [2.5, -2.4],
  villain: [3.6, -1.5],
};

/**
 * Live position of each actor on stage, shared with follow-spotlights and camera rig.
 */
export const ACTOR_STAGE_POS: Record<ActorRole, THREE.Vector2> = {
  lead_actor: new THREE.Vector2(...OPENING_MARKS.lead_actor),
  lead_actress: new THREE.Vector2(...OPENING_MARKS.lead_actress),
  co_star: new THREE.Vector2(...OPENING_MARKS.co_star),
  villain: new THREE.Vector2(...OPENING_MARKS.villain),
};

export const SCENE_LENGTH = 30;
export const QUESTION_CYCLE_LENGTH = 16;

/** Master scripted scene: Full cinematic story & 10-second UFC 1v1 fight sequence */
export const SCENE: Beat[] = [
  // ── 1. THE RENDEZVOUS (0.0s – 4.5s) ──
  {
    start: 0, end: 4.5,
    label: 'SC 12 — THE RENDEZVOUS',
    speaker: 'lead_actor',
    line: 'Maya, the master reel is secure. Tonight we finish what we started.',
    marks: { lead_actor: [-1.6, -2.2], lead_actress: [1.1, -2.2], co_star: [2.5, -2.4], villain: [3.6, -1.5] },
    focus: { lead_actor: 'lead_actress', lead_actress: 'lead_actor', co_star: 'lead_actor', villain: 'lead_actor' },
    gesture: { lead_actor: 'talk_open', lead_actress: 'listen', co_star: 'listen', villain: 'rest' },
  },

  // ── 2. HEROINE WARNING (4.5s – 8.5s) ──
  {
    start: 4.5, end: 8.5,
    label: 'SC 12 — THE WARNING',
    speaker: 'lead_actress',
    line: 'Careful Ravi... Dev tracked us to the soundstage. We are not alone!',
    marks: { lead_actress: [0.95, -2.2], lead_actor: [-1.5, -2.2] },
    focus: { lead_actress: 'lead_actor', lead_actor: 'lead_actress', co_star: 'lead_actress', villain: 'lead_actor' },
    gesture: { lead_actress: 'hand_to_heart', lead_actor: 'listen', co_star: 'listen', villain: 'rest' },
  },

  // ── 3. VILLAIN STORMS IN (8.5s – 12.5s) ──
  {
    start: 8.5, end: 12.5,
    label: 'SC 12 — VILLAIN STORMS IN',
    speaker: 'villain',
    line: 'Too late! I will destroy both of you today! No one walks off this set alive!',
    marks: { villain: [0.35, -1.6], lead_actress: [1.4, -2.3], co_star: [2.6, -2.5] },
    focus: { villain: 'lead_actor', lead_actor: 'villain', lead_actress: 'villain', co_star: 'villain' },
    gesture: { villain: 'menace', lead_actor: 'listen', lead_actress: 'recoil', co_star: 'recoil' },
  },

  // ── 4. HERO STEPS IN FRONT TO PROTECT HER (12.5s – 16.0s) ──
  {
    start: 12.5, end: 16.0,
    label: 'SC 12 — HERO PROTECTS MAYA',
    speaker: 'lead_actor',
    line: 'Step back Maya! If you want her Dev, you have to go through me first!',
    marks: { lead_actor: [-0.35, -1.6], lead_actress: [1.5, -2.3], villain: [0.35, -1.6] },
    focus: { lead_actor: 'villain', villain: 'lead_actor', lead_actress: 'lead_actor', co_star: 'villain' },
    gesture: { lead_actor: 'combat_stance', villain: 'combat_stance', lead_actress: 'plead', co_star: 'recoil' },
  },

  // ── 5. UFC FIGHT ROUND 1: JAB & WEAVE (16.0s – 18.5s) ──
  {
    start: 16.0, end: 18.5,
    label: 'SC 12 — 1v1 UFC FIGHT: JAB & WEAVE',
    speaker: 'lead_actor',
    line: 'Take your best shot!',
    marks: { lead_actor: [-0.28, -1.6], villain: [0.28, -1.6] },
    focus: { lead_actor: 'villain', villain: 'lead_actor', lead_actress: 'lead_actor', co_star: 'villain' },
    gesture: { lead_actor: 'fight_slip_dodge', villain: 'fight_cross', lead_actress: 'plead', co_star: 'recoil' },
  },

  // ── 6. UFC FIGHT ROUND 2: BODY HOOK & COUNTER (18.5s – 21.0s) ──
  {
    start: 18.5, end: 21.0,
    label: 'SC 12 — 1v1 UFC FIGHT: COUNTER HOOK',
    speaker: 'villain',
    line: 'Ugh! Is that all you got?!',
    marks: { lead_actor: [-0.22, -1.6], villain: [0.35, -1.6] },
    focus: { lead_actor: 'villain', villain: 'lead_actor', lead_actress: 'lead_actor', co_star: 'villain' },
    gesture: { lead_actor: 'fight_jab', villain: 'fight_block', lead_actress: 'cheer', co_star: 'recoil' },
  },

  // ── 7. UFC FIGHT ROUND 3: CLIMAX UPPERCUT KNOCKOUT (21.0s – 24.0s) ──
  {
    start: 21.0, end: 24.0,
    label: 'SC 12 — 1v1 UFC FIGHT: KNOCKOUT UPPERCUT',
    speaker: 'lead_actor',
    line: 'DOWN YOU GO!',
    marks: { lead_actor: [-0.1, -1.6], villain: [0.75, -1.6] },
    focus: { lead_actor: 'villain', villain: 'lead_actor', lead_actress: 'lead_actor', co_star: 'villain' },
    gesture: { lead_actor: 'fight_uppercut', villain: 'fight_knockdown', lead_actress: 'cheer', co_star: 'cheer' },
  },

  // ── 8. VILLAIN DEFEATED & HERO TRIUMPH (24.0s – 27.0s) ──
  {
    start: 24.0, end: 27.0,
    label: 'SC 12 — VICTORY & SCENE WRAP',
    speaker: 'lead_actor',
    line: "It's over Dev. Scene wrapped!",
    marks: { lead_actor: [-0.5, -1.8], lead_actress: [0.65, -1.8], villain: [1.3, -1.6] },
    focus: { lead_actor: 'lead_actress', lead_actress: 'lead_actor', co_star: 'lead_actor', villain: 'lead_actor' },
    gesture: { lead_actor: 'triumph', lead_actress: 'cheer', villain: 'knocked_out', co_star: 'cheer' },
  },

  // ── 9. FINAL TABLEAU & CAMERA WRAP (27.0s – 30.0s) ──
  {
    start: 27.0, end: SCENE_LENGTH,
    label: 'SC 12 — FINAL TABLEAU & WRAP',
    speaker: 'lead_actress',
    line: "Direct hit! We got the ultimate take!",
    marks: { lead_actor: [-0.65, -1.9], lead_actress: [0.65, -1.9], villain: [1.5, -1.6], co_star: [2.2, -2.1] },
    focus: { lead_actor: 'camera', lead_actress: 'camera', co_star: 'camera', villain: 'lead_actor' },
    gesture: { lead_actor: 'triumph', lead_actress: 'triumph', co_star: 'cheer', villain: 'knocked_out' },
  },
];

/** Real movie dialogue & stunt rehearsal banter for each question */
export function questionBeatsFor(
  q: RatioQuestion | null,
  feedback: 'idle' | 'correct' | 'incorrect'
): Beat[] {
  if (feedback === 'correct') {
    return [
      {
        start: 0,
        end: 2.0,
        label: 'TAKE APPROVED — HIGH FIVE',
        speaker: 'lead_actor',
        line: 'BOOM! Perfect stunt timing! Ready for the camera take!',
        marks: { lead_actor: [-0.75, -2.1], lead_actress: [0.75, -2.1], co_star: [2.2, -2.3], villain: [3.4, -1.6] },
        focus: { lead_actor: 'lead_actress', lead_actress: 'lead_actor', co_star: 'lead_actor', villain: 'lead_actor' },
        gesture: { lead_actor: 'high_five_right', lead_actress: 'high_five_left', co_star: 'cheer', villain: 'recoil' },
      },
      {
        start: 2.0,
        end: 4.0,
        label: 'TAKE APPROVED — CELEBRATION',
        speaker: 'lead_actress',
        line: 'Scene approved! Advancing to the next stunt cue!',
        marks: { lead_actor: [-0.75, -2.1], lead_actress: [0.75, -2.1], co_star: [2.2, -2.3], villain: [3.4, -1.6] },
        focus: { lead_actor: 'camera', lead_actress: 'camera', co_star: 'camera', villain: 'lead_actor' },
        gesture: { lead_actor: 'triumph', lead_actress: 'triumph', co_star: 'cheer', villain: 'recoil' },
      },
    ];
  }

  if (feedback === 'incorrect') {
    return [
      {
        start: 0,
        end: 4.0,
        label: 'SCENE RETAKE — RESET MARKS',
        speaker: 'lead_actress',
        line: 'Hold the roll! Check the stunt cues and reset to opening marks!',
        marks: { lead_actress: [1.1, -2.2], lead_actor: [-1.6, -2.2], villain: [3.2, -1.8] },
        focus: { lead_actress: 'lead_actor', lead_actor: 'lead_actress', co_star: 'lead_actress', villain: 'lead_actor' },
        gesture: { lead_actress: 'talk_open', lead_actor: 'plead', villain: 'menace', co_star: 'recoil' },
      },
    ];
  }

  return [
    {
      start: 0,
      end: 4.0,
      label: 'REHEARSAL — HERO REVIEWS MARKS',
      speaker: 'lead_actor',
      line: 'Camera 1 is rolling — Maya, check your marks for the fight cue!',
      marks: { lead_actor: [-1.6, -2.2], lead_actress: [1.1, -2.2], co_star: [2.5, -2.4], villain: [3.5, -1.8] },
      focus: { lead_actor: 'lead_actress', lead_actress: 'lead_actor', co_star: 'lead_actor', villain: 'lead_actor' },
      gesture: { lead_actor: 'talk_open', lead_actress: 'listen', co_star: 'listen', villain: 'rest' },
    },
    {
      start: 4.0,
      end: 8.0,
      label: 'REHEARSAL — ACTRESS CONFIRMS PACING',
      speaker: 'lead_actress',
      line: 'Stage lights are locked! Let us verify our pacing before action!',
      marks: { lead_actress: [0.95, -2.2], lead_actor: [-1.5, -2.2] },
      focus: { lead_actress: 'lead_actor', lead_actor: 'lead_actress', co_star: 'lead_actress', villain: 'lead_actress' },
      gesture: { lead_actress: 'hand_to_heart', lead_actor: 'listen', co_star: 'listen', villain: 'rest' },
    },
    {
      start: 8.0,
      end: 12.0,
      label: 'REHEARSAL — VILLAIN CHALLENGE',
      speaker: 'villain',
      line: 'You have 10 seconds before I charge the stage! Make your move!',
      marks: { villain: [2.8, -1.8], co_star: [2.3, -2.6] },
      focus: { villain: 'lead_actor', lead_actor: 'villain', lead_actress: 'villain', co_star: 'villain' },
      gesture: { villain: 'menace', lead_actor: 'listen', lead_actress: 'recoil', co_star: 'recoil' },
    },
    {
      start: 12.0,
      end: 16.0,
      label: 'REHEARSAL — HERO READY',
      speaker: 'lead_actor',
      line: 'Lock in the ratio and execute the cue on my mark!',
      marks: { lead_actor: [-0.9, -1.8], lead_actress: [1.2, -2.1] },
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
      p.rShoulderX = -0.85 - energy * 0.3;
      p.rShoulderZ = -0.24;
      p.rElbow = 0.55 - energy * 0.2;
      p.lShoulderX = -0.75;
      p.lShoulderZ = 0.22;
      p.lElbow = 1.38;
      p.headPitch = 0.22;
      p.headRoll = -0.06;
      p.torsoLean = 0.08;
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
    case 'high_five_right':
      p.rShoulderX = -2.15;
      p.rShoulderZ = -0.32;
      p.rElbow = 0.22;
      p.lShoulderX = -0.2;
      p.lShoulderZ = 0.2;
      p.torsoLean = 0.08;
      p.headPitch = -0.15;
      break;
    case 'high_five_left':
      p.lShoulderX = -2.15;
      p.lShoulderZ = 0.32;
      p.lElbow = 0.22;
      p.rShoulderX = -0.2;
      p.rShoulderZ = -0.2;
      p.torsoLean = 0.08;
      p.headPitch = -0.15;
      break;
    case 'combat_stance':
      p.lShoulderX = -1.15;
      p.lShoulderZ = 0.35;
      p.lElbow = 1.65;
      p.rShoulderX = -1.05;
      p.rShoulderZ = -0.3;
      p.rElbow = 1.7;
      p.torsoLean = 0.08;
      p.torsoTwist = 0.15;
      p.headPitch = 0.05;
      break;
    case 'fight_jab':
      p.lShoulderX = -1.58;
      p.lShoulderZ = 0.05;
      p.lElbow = 0.15;
      p.rShoulderX = -1.05;
      p.rShoulderZ = -0.3;
      p.rElbow = 1.75;
      p.torsoLean = 0.15;
      p.torsoTwist = 0.22;
      p.headPitch = 0.04;
      break;
    case 'fight_cross':
      p.rShoulderX = -1.62;
      p.rShoulderZ = -0.05;
      p.rElbow = 0.18;
      p.lShoulderX = -1.05;
      p.lShoulderZ = 0.32;
      p.lElbow = 1.65;
      p.torsoLean = 0.18;
      p.torsoTwist = -0.25;
      p.headPitch = 0.04;
      break;
    case 'fight_slip_dodge':
      p.lShoulderX = -0.95;
      p.lShoulderZ = 0.38;
      p.lElbow = 1.6;
      p.rShoulderX = -0.95;
      p.rShoulderZ = -0.38;
      p.rElbow = 1.6;
      p.torsoLean = -0.22;
      p.torsoTwist = 0.28;
      p.headPitch = 0.18;
      break;
    case 'fight_block':
      p.lShoulderX = -1.25;
      p.lShoulderZ = 0.18;
      p.lElbow = 1.85;
      p.rShoulderX = -1.25;
      p.rShoulderZ = -0.18;
      p.rElbow = 1.85;
      p.torsoLean = -0.12;
      p.headPitch = 0.15;
      break;
    case 'fight_uppercut':
      p.rShoulderX = -1.85;
      p.rShoulderZ = -0.12;
      p.rElbow = 1.15;
      p.lShoulderX = -0.85;
      p.lShoulderZ = 0.35;
      p.lElbow = 1.5;
      p.torsoLean = 0.2;
      p.torsoTwist = -0.2;
      p.headPitch = -0.12;
      break;
    case 'fight_knockdown':
      p.lShoulderX = -0.35;
      p.lShoulderZ = 0.65;
      p.lElbow = 0.55;
      p.rShoulderX = -0.35;
      p.rShoulderZ = -0.65;
      p.rElbow = 0.55;
      p.torsoLean = -0.75;
      p.headPitch = -0.45;
      break;
    case 'knocked_out':
      p.lShoulderX = 0.2;
      p.lShoulderZ = 0.55;
      p.lElbow = 0.2;
      p.rShoulderX = 0.2;
      p.rShoulderZ = -0.55;
      p.rElbow = 0.2;
      p.torsoLean = -1.55;
      p.headPitch = -0.4;
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
