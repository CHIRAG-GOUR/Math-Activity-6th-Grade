// ============================================================
// PATTERN RACERS — 125+ Grade 6 Sequence & Function Question Bank
// Very Easy, Intuitive, and Fun Mathematical Challenges:
// - Round 1: Next Term in Arithmetic Sequences (+2, +3, +4, +5, +10, -2, -5, -10)
// - Round 2: Common Step Difference (+2, +3, +4, +5, +6, +7, +8, +10, -2, -5)
// - Round 3: Missing Middle Term in Sequence
// - Round 4: 1-Step & 2-Step Function Machine Output
// - Round 5: Final Launch & 3-2-1 Countdown Challenges
// ============================================================

export interface PatternQuestion {
  id: string;
  stageType: 'sequence_next' | 'sequence_missing' | 'step_difference' | 'function_output' | 'rule_operator';
  roundCategory: 1 | 2 | 3 | 4 | 5;
  difficulty: 'easy' | 'medium';
  title: string;
  stageName: string;
  prompt: string;
  sequenceDisplay?: string;
  functionDisplay?: {
    input: number;
    rule: string;
    output?: number;
  };
  options: {
    id: 'A' | 'B' | 'C' | 'D';
    label: string;
    value: number | string;
  }[];
  correctAnswer: number | string;
  explanation: string;
  misconceptionTip: string;
}

// Helper to shuffle options and assign A, B, C, D IDs
function createQuestion(
  id: string,
  roundCategory: 1 | 2 | 3 | 4 | 5,
  stageType: PatternQuestion['stageType'],
  title: string,
  stageName: string,
  prompt: string,
  sequenceDisplay: string | undefined,
  functionDisplay: PatternQuestion['functionDisplay'] | undefined,
  correctAnswer: number | string,
  distractors: (number | string)[],
  explanation: string,
  misconceptionTip: string
): PatternQuestion {
  const allChoices = [correctAnswer, ...distractors.slice(0, 3)];
  // Deterministic pseudorandom placement based on ID hash
  const seed = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const shuffled = [...allChoices].sort((a, b) => {
    const ha = ((String(a).length * 17 + seed) % 7) - 3;
    const hb = ((String(b).length * 17 + seed) % 7) - 3;
    return ha - hb;
  });

  // Ensure 4 unique choices
  const uniqueChoices = Array.from(new Set(shuffled));
  while (uniqueChoices.length < 4) {
    if (typeof correctAnswer === 'number') {
      uniqueChoices.push(correctAnswer + uniqueChoices.length * 2);
    } else {
      uniqueChoices.push(`+${uniqueChoices.length + 10}`);
    }
  }

  const optionLetters: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];
  const options = uniqueChoices.slice(0, 4).map((val, idx) => ({
    id: optionLetters[idx],
    label: String(val),
    value: val,
  }));

  // Make sure correct answer is in options
  if (!options.some((o) => String(o.value) === String(correctAnswer))) {
    options[0] = { id: 'A', label: String(correctAnswer), value: correctAnswer };
  }

  return {
    id,
    stageType,
    roundCategory,
    difficulty: 'easy',
    title,
    stageName,
    prompt,
    sequenceDisplay,
    functionDisplay,
    options,
    correctAnswer,
    explanation,
    misconceptionTip,
  };
}

// ── 1. GENERATE 25 QUESTIONS FOR ROUND 1 (Next Term in Sequence) ──
const round1Questions: PatternQuestion[] = [
  { start: 2, step: 2 }, { start: 5, step: 5 }, { start: 3, step: 3 }, { start: 10, step: 10 },
  { start: 4, step: 4 }, { start: 1, step: 3 }, { start: 2, step: 5 }, { start: 50, step: -5 },
  { start: 100, step: -10 }, { start: 6, step: 6 }, { start: 7, step: 7 }, { start: 8, step: 8 },
  { start: 9, step: 9 }, { start: 12, step: 2 }, { start: 15, step: 5 }, { start: 20, step: 10 },
  { start: 0, step: 4 }, { start: 1, step: 2 }, { start: 3, step: 4 }, { start: 5, step: 3 },
  { start: 10, step: 5 }, { start: 40, step: -4 }, { start: 30, step: -3 }, { start: 25, step: 5 },
  { start: 60, step: -10 },
].map((cfg, i) => {
  const t1 = cfg.start;
  const t2 = t1 + cfg.step;
  const t3 = t2 + cfg.step;
  const t4 = t3 + cfg.step;
  const t5 = t4 + cfg.step;
  return createQuestion(
    `r1_q_${i + 1}`,
    1,
    'sequence_next',
    'TELEMETRY SEQUENCE STEP',
    'STAGE 1: GARAGE DEPARTURE',
    'Find the next number in this sequence:',
    `${t1} → ${t2} → ${t3} → ${t4} → ?`,
    undefined,
    t5,
    [t5 + cfg.step, t5 - 1, t5 + 2],
    `The pattern ${cfg.step >= 0 ? 'adds' : 'subtracts'} ${Math.abs(cfg.step)} each step. ${t4} ${cfg.step >= 0 ? '+' : '-'} ${Math.abs(cfg.step)} = ${t5}.`,
    `Notice the difference between consecutive numbers: ${t2} - ${t1} = ${cfg.step}.`
  );
});

// ── 2. GENERATE 25 QUESTIONS FOR ROUND 2 (Common Step Difference) ──
const round2Questions: PatternQuestion[] = [
  { start: 3, step: 4 }, { start: 8, step: 5 }, { start: 20, step: -2 }, { start: 10, step: 7 },
  { start: 40, step: -10 }, { start: 2, step: 3 }, { start: 5, step: 6 }, { start: 14, step: -3 },
  { start: 1, step: 5 }, { start: 12, step: 4 }, { start: 35, step: -5 }, { start: 7, step: 8 },
  { start: 100, step: -20 }, { start: 4, step: 2 }, { start: 9, step: 3 }, { start: 15, step: 10 },
  { start: 21, step: 7 }, { start: 30, step: -5 }, { start: 6, step: 4 }, { start: 18, step: -2 },
  { start: 50, step: 25 }, { start: 2, step: 9 }, { start: 11, step: 11 }, { start: 80, step: -10 },
  { start: 13, step: 6 },
].map((cfg, i) => {
  const t1 = cfg.start;
  const t2 = t1 + cfg.step;
  const t3 = t2 + cfg.step;
  const t4 = t3 + cfg.step;
  const sign = cfg.step >= 0 ? `+${cfg.step}` : `${cfg.step}`;
  const d1 = cfg.step >= 0 ? `+${cfg.step + 1}` : `${cfg.step - 1}`;
  const d2 = cfg.step >= 0 ? `+${cfg.step + 2}` : `${cfg.step + 2}`;
  const d3 = cfg.step >= 0 ? `+${Math.max(1, cfg.step - 1)}` : `${cfg.step - 2}`;

  return createQuestion(
    `r2_q_${i + 1}`,
    2,
    'step_difference',
    'COMMON STEP DIFFERENCE',
    'STAGE 2: PIT INSPECTION & TYRE CHECK',
    'What is the step difference / rule for this sequence?',
    `${t1} → ${t2} → ${t3} → ${t4}`,
    undefined,
    sign,
    [d1, d2, d3],
    `Subtract consecutive terms: ${t2} - ${t1} = ${sign}.`,
    `Take any term and subtract the previous one: ${t3} - ${t2} = ${sign}.`
  );
});

// ── 3. GENERATE 25 QUESTIONS FOR ROUND 3 (Missing Middle Term) ──
const round3Questions: PatternQuestion[] = [
  { start: 4, step: 4, missingPos: 3 }, { start: 5, step: 5, missingPos: 2 }, { start: 10, step: 10, missingPos: 4 },
  { start: 7, step: 7, missingPos: 3 }, { start: 30, step: -5, missingPos: 2 }, { start: 2, step: 3, missingPos: 3 },
  { start: 6, step: 6, missingPos: 4 }, { start: 15, step: 5, missingPos: 3 }, { start: 50, step: -10, missingPos: 3 },
  { start: 1, step: 4, missingPos: 2 }, { start: 3, step: 5, missingPos: 3 }, { start: 8, step: 8, missingPos: 4 },
  { start: 20, step: -2, missingPos: 3 }, { start: 12, step: 3, missingPos: 2 }, { start: 100, step: -25, missingPos: 3 },
  { start: 9, step: 9, missingPos: 3 }, { start: 11, step: 2, missingPos: 4 }, { start: 14, step: 4, missingPos: 2 },
  { start: 25, step: 10, missingPos: 3 }, { start: 40, step: -5, missingPos: 4 }, { start: 18, step: 6, missingPos: 2 },
  { start: 5, step: 8, missingPos: 3 }, { start: 70, step: -10, missingPos: 3 }, { start: 16, step: 4, missingPos: 3 },
  { start: 33, step: 3, missingPos: 2 },
].map((cfg, i) => {
  const terms = [
    cfg.start,
    cfg.start + cfg.step,
    cfg.start + cfg.step * 2,
    cfg.start + cfg.step * 3,
    cfg.start + cfg.step * 4,
  ];
  const missingVal = terms[cfg.missingPos - 1];
  const seqStr = terms
    .map((t, idx) => (idx === cfg.missingPos - 1 ? '[ ? ]' : String(t)))
    .join(' → ');

  return createQuestion(
    `r3_q_${i + 1}`,
    3,
    'sequence_missing',
    'GRID STAGING MISSING TERM',
    'STAGE 3: STARTING GRID STAGING',
    'Find the missing number in the sequence:',
    seqStr,
    undefined,
    missingVal,
    [missingVal + cfg.step, missingVal - 1, missingVal + 2],
    `The step is ${cfg.step >= 0 ? '+' : ''}${cfg.step}. Therefore the missing term is ${missingVal}.`,
    `Check the numbers before and after the box to determine the step.`
  );
});

// ── 4. GENERATE 25 QUESTIONS FOR ROUND 4 (Function Machine Output) ──
const round4Questions: PatternQuestion[] = [
  { input: 6, rule: '× 3', ans: 18 }, { input: 8, rule: '+ 7', ans: 15 }, { input: 5, rule: '× 4 + 2', ans: 22 },
  { input: 14, rule: '÷ 2', ans: 7 }, { input: 4, rule: '× 5 - 3', ans: 17 }, { input: 7, rule: '× 2', ans: 14 },
  { input: 9, rule: '+ 6', ans: 15 }, { input: 3, rule: '× 6', ans: 18 }, { input: 12, rule: '- 5', ans: 7 },
  { input: 5, rule: '× 3 + 1', ans: 16 }, { input: 8, rule: '× 2 - 2', ans: 14 }, { input: 20, rule: '÷ 4', ans: 5 },
  { input: 6, rule: '× 4', ans: 24 }, { input: 10, rule: '+ 12', ans: 22 }, { input: 7, rule: '× 3 - 1', ans: 20 },
  { input: 4, rule: '× 8', ans: 32 }, { input: 15, rule: '- 7', ans: 8 }, { input: 6, rule: '× 2 + 5', ans: 17 },
  { input: 18, rule: '÷ 3', ans: 6 }, { input: 5, rule: '× 5', ans: 25 }, { input: 9, rule: '× 2 + 2', ans: 20 },
  { input: 11, rule: '+ 9', ans: 20 }, { input: 8, rule: '× 3 + 4', ans: 28 }, { input: 30, rule: '÷ 5', ans: 6 },
  { input: 7, rule: '× 4 - 3', ans: 25 },
].map((cfg, i) => {
  return createQuestion(
    `r4_q_${i + 1}`,
    4,
    'function_output',
    'FUNCTION MACHINE OUTPUT',
    'STAGE 4: PRE-GRID ENGINE REV',
    'Calculate the output from the Function Machine:',
    undefined,
    { input: cfg.input, rule: cfg.rule },
    cfg.ans,
    [cfg.ans + 2, cfg.ans - 3, cfg.ans + 4],
    `Input ${cfg.input} with rule [${cfg.rule}] results in ${cfg.ans}.`,
    `Apply the rule to the input value ${cfg.input}.`
  );
});

// ── 5. GENERATE 25 QUESTIONS FOR ROUND 5 (Final Launch & 3-2-1 Countdown Duel) ──
const round5Questions: PatternQuestion[] = [
  { input: 7, rule: '× 2 + 5', ans: 19 }, { input: 6, rule: '× 3 + 2', ans: 20 }, { input: 10, rule: '× 2 - 4', ans: 16 },
  { input: 9, rule: '× 2 + 3', ans: 21 }, { input: 8, rule: '× 3 - 4', ans: 20 }, { input: 5, rule: '× 4 + 3', ans: 23 },
  { input: 4, rule: '× 6 + 1', ans: 25 }, { input: 12, rule: '× 2 - 5', ans: 19 }, { input: 7, rule: '× 3 + 1', ans: 22 },
  { input: 8, rule: '× 2 + 6', ans: 22 }, { input: 6, rule: '× 5 - 2', ans: 28 }, { input: 11, rule: '× 2 + 1', ans: 23 },
  { input: 5, rule: '× 6 - 5', ans: 25 }, { input: 9, rule: '× 3 - 2', ans: 25 }, { input: 4, rule: '× 7 + 2', ans: 30 },
  { input: 10, rule: '× 3 + 5', ans: 35 }, { input: 7, rule: '× 4 + 2', ans: 30 }, { input: 8, rule: '× 4 - 4', ans: 28 },
  { input: 6, rule: '× 4 + 6', ans: 30 }, { input: 12, rule: '× 3 - 6', ans: 30 }, { input: 5, rule: '× 7 + 1', ans: 36 },
  { input: 9, rule: '× 4 - 6', ans: 30 }, { input: 8, rule: '× 5 + 2', ans: 42 }, { input: 10, rule: '× 4 - 8', ans: 32 },
  { input: 7, rule: '× 5 + 3', ans: 38 },
].map((cfg, i) => {
  return createQuestion(
    `r5_q_${i + 1}`,
    5,
    'function_output',
    'FINAL HYBRID LAUNCH DUEL',
    'STAGE 5: FINAL LAUNCH & 3-2-1 COUNTDOWN',
    'Solve the launch formula to activate Green Signal GO & Head Start:',
    undefined,
    { input: cfg.input, rule: cfg.rule },
    cfg.ans,
    [cfg.ans + 2, cfg.ans - 2, cfg.ans + 5],
    `Applying [${cfg.rule}] to input ${cfg.input} gives ${cfg.ans}.`,
    `Multiply first, then add or subtract.`
  );
});

export const ALL_PATTERN_QUESTIONS: PatternQuestion[] = [
  ...round1Questions,
  ...round2Questions,
  ...round3Questions,
  ...round4Questions,
  ...round5Questions,
];

export function getQuestionForRound(roundNum: number, questionIndex: number = 0): PatternQuestion {
  const filtered = ALL_PATTERN_QUESTIONS.filter((q) => q.roundCategory === roundNum);
  if (filtered.length === 0) return ALL_PATTERN_QUESTIONS[0];
  return filtered[questionIndex % filtered.length];
}
