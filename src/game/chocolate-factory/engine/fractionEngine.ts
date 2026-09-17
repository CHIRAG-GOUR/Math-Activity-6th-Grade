// ============================================================
// THE CHOCOLATE FACTORY — QUESTION ENGINE
//
// Data-driven and validated: every question comes from a table of numeric
// SEEDS (never hand-typed prose with a hidden answer baked in), and the
// correct option is always computed from the seed by the fraction-arithmetic
// module, then checked against the other three options for uniqueness.
//
// The critical design point (section 44 of the brief): the four ON-SCREEN
// OPTIONS are not just multiple choice — `optionValues` gives EVERY option's
// own Fraction, and the simulation applies whichever one the team taps to the
// physical factory. Picking the wrong fraction does not just mark a mistake;
// it makes a different, generally wrong, amount of chocolate. Correctness is
// tracked separately (`correctIndex`) purely for quality and scoring.
// ============================================================

import type { CustomerType, Fraction, FractionQuestion, QuestionKind, RoundNumber } from '../types';
import { add, batchesOf, compare, formatFraction, frac, multiply, simplify, subtract, toDecimal } from './fractionMath';
import { mulberry32 } from '../world/geom';

// ── FLAVOUR TEXT ─────────────────────────────────────────────────────────
// Rotated by index so the same underlying maths never reads the same way
// twice in a sitting.

export const PRODUCTS = [
  'milk chocolate bars', 'dark chocolate squares', 'hazelnut pralines', 'caramel bars',
  'chocolate coins', 'gift chocolates', 'chocolate chip bars', 'white chocolate bars',
  'crunch bars', 'truffle boxes',
];

const CUSTOMERS: { type: CustomerType; names: string[] }[] = [
  { type: 'school', names: ['Maple Ridge School', 'Lincoln Elementary', 'Riverside Academy'] },
  { type: 'cafe', names: ['Bean & Bar Cafe', 'The Cocoa Cup', 'Morningside Cafe'] },
  { type: 'hotel', names: ['Grand Regent Hotel', 'The Harbourview Hotel', 'Aster Suites'] },
  { type: 'supermarket', names: ['FreshMart', 'ValueSave Supermarket', 'Corner Grocers'] },
  { type: 'shop', names: ['The Chocolate Box', 'Sweet Nothings', 'Cocoa & Co.'] },
  { type: 'festival', names: ['Riverside Festival', 'Founders Day Fair', 'Winter Market'] },
];

export function pick<T>(arr: T[], i: number): T { return arr[((i % arr.length) + arr.length) % arr.length]; }

export function customerFor(i: number) {
  const group = pick(CUSTOMERS, i);
  return { type: group.type, name: pick(group.names, Math.floor(i / CUSTOMERS.length)) };
}

// ── OPTION ASSEMBLY ─────────────────────────────────────────────────────

interface Candidate { label: string; value: Fraction; }

/** Builds four shuffled, de-duplicated options from a correct candidate and distractors. */
function assemble(
  rng: () => number,
  correct: Candidate,
  distractors: Candidate[],
  properOnly = false,
  labelFor: (f: Fraction) => string = formatFraction,
) {
  const valueKey = (f: Fraction) => { const v = simplify(f); return `${v.num}/${v.den}`; };
  const seenValues = new Set<string>([valueKey(correct.value)]);
  const seenLabels = new Set<string>([correct.label]);
  const pool: Candidate[] = [];
  for (const d of distractors) {
    const key = valueKey(d.value);
    if (seenValues.has(key) || seenLabels.has(d.label)) continue;
    seenValues.add(key); seenLabels.add(d.label);
    pool.push(d);
  }
  // Pad out with small perturbations of the correct value if a template ran short.
  let guard = 0;
  while (pool.length < 3 && guard < 20) {
    guard++;
    const bump = 1 + Math.floor(rng() * 3);
    let cand = rng() < 0.5
      ? frac(correct.value.num + bump, correct.value.den)
      : frac(correct.value.num, correct.value.den + bump);
    const key = valueKey(cand);
    const label = labelFor(cand);
    if (seenValues.has(key) || seenLabels.has(label) || cand.num <= 0) continue;
    // A padded option must mean what it says: if the label is a plain count,
    // the value has to be that count out of the same whole.
    if (labelFor !== formatFraction && /^\d+$/.test(label)) {
      const shown = Number(label);
      if (!Number.isFinite(shown) || shown <= 0) continue;
      cand = frac(shown, correct.value.den);
      if (seenValues.has(valueKey(cand))) continue;
    }
    if (properOnly && cand.num >= cand.den) continue;
    seenValues.add(key); seenLabels.add(label);
    pool.push({ label, value: cand });
  }

  const four = [correct, ...pool.slice(0, 3)];
  // Fisher-Yates with the seeded RNG so a replay with the same seed repeats.
  for (let i = four.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [four[i], four[j]] = [four[j], four[i]];
  }
  return {
    options: four.map((c) => c.label),
    optionValues: four.map((c) => simplify(c.value)),
    correctIndex: four.indexOf(correct),
  };
}

/** Label that does NOT simplify — an equivalent fraction has to be shown as written. */
const rawLabel = (f: Fraction): string => (f.den === 1 ? `${f.num}` : `${f.num}/${f.den}`);

let uid = 0;
const nextId = () => `cfq-${++uid}`;

// ── ROUND 1 — FRACTION RECOGNITION ──────────────────────────────────────

const ID_SEEDS: [number, number][] = [
  [1, 2], [1, 3], [2, 3], [1, 4], [2, 4], [3, 4],
  [1, 5], [2, 5], [3, 5], [4, 5],
  [1, 6], [2, 6], [3, 6], [4, 6], [5, 6],
  [1, 8], [2, 8], [3, 8], [4, 8], [5, 8], [6, 8], [7, 8],
  [1, 10], [2, 10], [3, 10], [4, 10], [5, 10], [6, 10], [7, 10], [8, 10], [9, 10],
  [1, 12], [5, 12], [7, 12], [11, 12],
  [2, 7], [3, 7], [4, 7], [5, 7],
];

function questionIdentify(round: RoundNumber, i: number, rng: () => number): FractionQuestion {
  const [num, den] = pick(ID_SEEDS, i);
  const cust = customerFor(i);
  const correctVal = frac(num, den);
  // Classic slips: counting the plain squares instead, miscounting by one,
  // or reading the total as the numerator.
  const candidates: [number, number][] = [
    [den - num, den],
    [num + 1, den],
    [num - 1, den],
    [num, den + 2],
  ];
  const distractors: Candidate[] = candidates
    .filter(([n, d]) => n > 0 && d > 0 && n < d)
    .map(([n, d]) => ({ label: formatFraction(frac(n, d)), value: frac(n, d) }));
  const { options, optionValues, correctIndex } =
    assemble(rng, { label: formatFraction(correctVal), value: correctVal }, distractors, true);
  const plain = den - num;
  return {
    id: nextId(), round, kind: 'identify',
    context: `${cust.name} order · dark chocolate tray`,
    prompt: `This production tray has ${den} equal squares: ${num} ${num === 1 ? 'is' : 'are'} dark chocolate and ${plain} ${plain === 1 ? 'is' : 'are'} milk chocolate. What fraction of the tray is dark chocolate?`,
    options, optionValues, correctIndex,
    customerType: cust.type, customerName: cust.name,
  };
}

// ── ROUND 2 — EQUIVALENT FRACTIONS ──────────────────────────────────────

const EQ_SEEDS: { base: [number, number]; scale: number }[] = [
  { base: [1, 2], scale: 2 }, { base: [1, 2], scale: 3 }, { base: [1, 2], scale: 4 }, { base: [1, 2], scale: 5 }, { base: [1, 2], scale: 6 },
  { base: [1, 3], scale: 2 }, { base: [1, 3], scale: 3 }, { base: [1, 3], scale: 4 },
  { base: [2, 3], scale: 2 }, { base: [2, 3], scale: 3 }, { base: [2, 3], scale: 4 },
  { base: [1, 4], scale: 2 }, { base: [1, 4], scale: 3 },
  { base: [3, 4], scale: 2 }, { base: [3, 4], scale: 3 },
  { base: [1, 5], scale: 2 }, { base: [1, 5], scale: 3 }, { base: [1, 5], scale: 4 },
  { base: [2, 5], scale: 2 }, { base: [2, 5], scale: 3 },
  { base: [3, 5], scale: 2 }, { base: [3, 5], scale: 3 },
  { base: [4, 5], scale: 2 }, { base: [4, 5], scale: 3 },
  { base: [1, 6], scale: 2 }, { base: [1, 6], scale: 3 },
  { base: [5, 6], scale: 2 },
  { base: [1, 8], scale: 2 }, { base: [3, 8], scale: 2 }, { base: [5, 8], scale: 2 }, { base: [7, 8], scale: 2 },
  { base: [1, 10], scale: 2 }, { base: [3, 10], scale: 2 }, { base: [7, 10], scale: 2 }, { base: [9, 10], scale: 2 },
  { base: [2, 7], scale: 2 }, { base: [3, 7], scale: 2 },
];

function questionEquivalent(round: RoundNumber, i: number, rng: () => number): FractionQuestion {
  const seed = pick(EQ_SEEDS, i);
  const cust = customerFor(i);
  const base = frac(seed.base[0], seed.base[1]);
  const correctVal = frac(base.num * seed.scale, base.den * seed.scale);
  const wrongScale = seed.scale === 2 ? 3 : 2;
  const distractors: Candidate[] = [
    { label: rawLabel(frac(base.num * wrongScale, base.den * seed.scale)), value: frac(base.num * wrongScale, base.den * seed.scale) },
    { label: rawLabel(frac(base.num * seed.scale, base.den * wrongScale)), value: frac(base.num * seed.scale, base.den * wrongScale) },
    { label: rawLabel(frac(base.num + seed.scale, base.den + seed.scale)), value: frac(base.num + seed.scale, base.den + seed.scale) },
    { label: rawLabel(frac(base.num * seed.scale + 1, base.den * seed.scale)), value: frac(base.num * seed.scale + 1, base.den * seed.scale) },
  ];
  // The answer keeps its scaled form (2/4, not 1/2) — that IS the question.
  const { options, optionValues, correctIndex } = assemble(rng, { label: rawLabel(correctVal), value: correctVal }, distractors);
  return {
    id: nextId(), round, kind: 'equivalent',
    context: `${cust.name} order · mixing recipe`,
    prompt: `The mixing recipe for this batch calls for ${formatFraction(base)} of the tank. Which quantity is equivalent to ${formatFraction(base)}?`,
    options, optionValues, correctIndex,
    customerType: cust.type, customerName: cust.name,
  };
}

// ── ROUND 3 — COMPARING / ORDERING FRACTIONS ────────────────────────────

const CMP_SEEDS: [[number, number], [number, number]][] = [
  [[1, 2], [1, 4]], [[3, 4], [1, 2]], [[2, 3], [1, 3]], [[3, 5], [4, 5]],
  [[5, 8], [3, 8]], [[7, 10], [3, 10]], [[1, 3], [1, 2]], [[2, 5], [1, 2]],
  [[3, 4], [5, 8]], [[2, 3], [3, 4]], [[5, 6], [2, 3]], [[7, 8], [3, 4]],
  [[1, 4], [3, 8]], [[4, 5], [7, 10]], [[3, 10], [2, 5]], [[5, 8], [1, 2]],
  [[3, 5], [2, 3]], [[1, 2], [2, 5]], [[3, 4], [5, 6]], [[2, 3], [3, 5]],
  [[5, 8], [3, 4]], [[1, 3], [1, 4]], [[4, 5], [7, 8]], [[2, 5], [3, 8]],
  [[5, 6], [7, 8]], [[3, 8], [2, 5]], [[1, 2], [4, 9]], [[7, 10], [2, 3]],
  [[3, 7], [1, 2]], [[5, 9], [1, 2]], [[4, 7], [3, 5]], [[9, 10], [5, 6]],
  [[2, 9], [1, 4]], [[7, 12], [1, 2]], [[5, 12], [1, 3]], [[11, 12], [7, 8]],
  [[3, 10], [1, 4]], [[7, 9], [3, 4]], [[5, 7], [2, 3]], [[8, 9], [11, 12]],
];

function questionCompare(round: RoundNumber, i: number, rng: () => number): FractionQuestion {
  const [a, b] = pick(CMP_SEEDS, i);
  const fa = frac(a[0], a[1]);
  const fb = frac(b[0], b[1]);
  const cust = customerFor(i);
  const cmp = compare(fa, fb);
  const greater = cmp >= 0 ? fa : fb;
  const lesser = cmp >= 0 ? fb : fa;
  const filler1 = frac(1, 6);
  const filler2 = frac(5, 6);
  const correctCand: Candidate = { label: formatFraction(greater), value: greater };
  const distractors: Candidate[] = [
    { label: formatFraction(lesser), value: lesser },
    { label: formatFraction(filler1), value: filler1 },
    { label: formatFraction(filler2), value: filler2 },
  ];
  const { options, optionValues, correctIndex } = assemble(rng, correctCand, distractors);
  return {
    id: nextId(), round, kind: 'compare',
    context: `${cust.name} order · ingredient tanks`,
    prompt: `Tank A holds ${formatFraction(fa)} of a batch. Tank B holds ${formatFraction(fb)} of a batch. Which tank should be used — the GREATER amount?`,
    options, optionValues, correctIndex,
    customerType: cust.type, customerName: cust.name,
  };
}

// ── ROUND 4 — ADDING / SUBTRACTING FRACTIONS ────────────────────────────

const ADD_SEEDS: { a: [number, number]; b: [number, number]; op: 'add' | 'subtract' }[] = [
  { a: [1, 4], b: [2, 4], op: 'add' }, { a: [1, 8], b: [3, 8], op: 'add' },
  { a: [2, 6], b: [1, 6], op: 'add' }, { a: [1, 3], b: [1, 3], op: 'add' },
  { a: [1, 5], b: [2, 5], op: 'add' }, { a: [3, 10], b: [4, 10], op: 'add' },
  { a: [1, 2], b: [1, 4], op: 'add' }, { a: [1, 3], b: [1, 6], op: 'add' },
  { a: [1, 4], b: [1, 8], op: 'add' }, { a: [2, 5], b: [1, 10], op: 'add' },
  { a: [3, 8], b: [1, 8], op: 'add' }, { a: [1, 6], b: [2, 6], op: 'add' },
  { a: [2, 5], b: [2, 5], op: 'add' }, { a: [1, 10], b: [6, 10], op: 'add' },
  { a: [1, 2], b: [3, 8], op: 'add' }, { a: [1, 4], b: [3, 8], op: 'add' },
  { a: [1, 3], b: [2, 6], op: 'add' }, { a: [3, 10], b: [2, 5], op: 'add' },
  { a: [7, 8], b: [3, 8], op: 'subtract' }, { a: [5, 6], b: [1, 6], op: 'subtract' },
  { a: [3, 4], b: [1, 4], op: 'subtract' }, { a: [4, 5], b: [2, 5], op: 'subtract' },
  { a: [9, 10], b: [3, 10], op: 'subtract' }, { a: [7, 8], b: [1, 4], op: 'subtract' },
  { a: [5, 6], b: [1, 3], op: 'subtract' }, { a: [1, 2], b: [1, 8], op: 'subtract' },
  { a: [3, 4], b: [1, 8], op: 'subtract' }, { a: [7, 10], b: [1, 5], op: 'subtract' },
  { a: [1, 6], b: [1, 3], op: 'add' }, { a: [2, 8], b: [3, 8], op: 'add' },
  { a: [5, 12], b: [3, 12], op: 'add' }, { a: [11, 12], b: [5, 12], op: 'subtract' },
  { a: [5, 8], b: [1, 8], op: 'subtract' }, { a: [4, 6], b: [1, 6], op: 'subtract' },
  { a: [3, 5], b: [1, 5], op: 'subtract' }, { a: [8, 10], b: [5, 10], op: 'subtract' },
  { a: [1, 2], b: [1, 4], op: 'subtract' }, { a: [3, 4], b: [1, 2], op: 'subtract' },
];

function questionAddSubtract(round: RoundNumber, i: number, rng: () => number): FractionQuestion {
  const seed = pick(ADD_SEEDS, i);
  const fa = frac(seed.a[0], seed.a[1]);
  const fb = frac(seed.b[0], seed.b[1]);
  const cust = customerFor(i);
  const correctVal = seed.op === 'add' ? add(fa, fb) : subtract(fa, fb);
  // Classic Grade 6 slip: adding/subtracting numerators AND denominators straight across.
  const slip = seed.op === 'add'
    ? frac(fa.num + fb.num, fa.den + fb.den)
    : frac(Math.max(1, fa.num - fb.num), fa.den);
  const swapped = seed.op === 'subtract' ? subtract(fb, fa) : add(fa, frac(fb.num + 1, fb.den));
  const distractors: Candidate[] = [
    { label: formatFraction(slip), value: slip },
    { label: formatFraction(swapped), value: swapped.num > 0 ? swapped : frac(1, fa.den) },
  ];
  const correctCand: Candidate = { label: formatFraction(correctVal), value: correctVal };
  const { options, optionValues, correctIndex } = assemble(rng, correctCand, distractors);
  const verb = seed.op === 'add'
    ? `The mixer already has ${formatFraction(fa)} of a batch, and the team adds ${formatFraction(fb)} more`
    : `The tank holds ${formatFraction(fa)} of a batch, and this order uses ${formatFraction(fb)} of it`;
  return {
    id: nextId(), round, kind: seed.op,
    context: `${cust.name} order · ${seed.op === 'add' ? 'combining ingredients' : 'remaining stock'}`,
    prompt: `${verb}. ${seed.op === 'add' ? 'How much is in the tank now' : 'How much is left'}?`,
    options, optionValues, correctIndex,
    customerType: cust.type, customerName: cust.name,
  };
}

// ── ROUND 5 — ADVANCED PRODUCTION ───────────────────────────────────────

const MIXED_SEEDS: { whole: number; num: number; den: number }[] = [
  { whole: 1, num: 1, den: 2 }, { whole: 2, num: 1, den: 4 }, { whole: 1, num: 3, den: 4 },
  { whole: 2, num: 1, den: 2 }, { whole: 1, num: 2, den: 3 }, { whole: 3, num: 1, den: 4 },
  { whole: 1, num: 1, den: 3 }, { whole: 2, num: 3, den: 8 }, { whole: 1, num: 5, den: 8 },
  { whole: 3, num: 1, den: 2 }, { whole: 2, num: 2, den: 5 }, { whole: 1, num: 4, den: 5 },
  { whole: 2, num: 1, den: 6 }, { whole: 1, num: 5, den: 6 }, { whole: 3, num: 3, den: 4 },
  { whole: 2, num: 5, den: 8 },
];

function questionMixed(round: RoundNumber, i: number, rng: () => number): FractionQuestion {
  const seed = pick(MIXED_SEEDS, i);
  const cust = customerFor(i);
  const correctVal = frac(seed.whole * seed.den + seed.num, seed.den);
  const distractors: Candidate[] = [
    { label: formatFraction(frac((seed.whole + 1) * seed.den + seed.num, seed.den)), value: frac((seed.whole + 1) * seed.den + seed.num, seed.den) },
    { label: formatFraction(frac(seed.whole * seed.den + seed.num, seed.den + 1)), value: frac(seed.whole * seed.den + seed.num, seed.den + 1) },
    { label: formatFraction(frac(seed.num, seed.den)), value: frac(seed.num, seed.den) },
  ];
  const correctCand: Candidate = { label: formatFraction(correctVal), value: correctVal };
  const { options, optionValues, correctIndex } = assemble(rng, correctCand, distractors);
  return {
    id: nextId(), round, kind: 'mixed_number',
    context: `${cust.name} order · large batch run`,
    prompt: `This order needs ${seed.whole} whole batches plus ${seed.num}/${seed.den} of another batch. Which mixed number is that?`,
    options, optionValues, correctIndex,
    customerType: cust.type, customerName: cust.name,
  };
}

const IMPROPER_SEEDS: [number, number][] = [
  [3, 2], [5, 2], [7, 2], [5, 4], [7, 4], [9, 4], [11, 4],
  [4, 3], [5, 3], [7, 3], [8, 3], [6, 5], [7, 5], [8, 5], [9, 5],
  [9, 8], [11, 8], [13, 8], [7, 6], [11, 6],
];

function questionImproper(round: RoundNumber, i: number, rng: () => number): FractionQuestion {
  const [num, den] = pick(IMPROPER_SEEDS, i);
  const cust = customerFor(i);
  const correctVal = frac(num, den);
  const whole = Math.trunc(num / den);
  const rem = num - whole * den;
  const distractors: Candidate[] = [
    { label: formatFraction(frac((whole + 1) * den + rem, den)), value: frac((whole + 1) * den + rem, den) },
    { label: formatFraction(frac(whole * den + rem, den + 1)), value: frac(whole * den + rem, den + 1) },
    { label: formatFraction(frac(num - den, den)), value: frac(Math.max(1, num - den), den) },
  ];
  const correctCand: Candidate = { label: formatFraction(correctVal), value: correctVal };
  const { options, optionValues, correctIndex } = assemble(rng, correctCand, distractors);
  return {
    id: nextId(), round, kind: 'improper',
    context: `${cust.name} order · batch conversion`,
    prompt: `The pipe has moved ${num}/${den} of a single batch through so far. Which mixed number equals ${num}/${den}?`,
    options, optionValues, correctIndex,
    customerType: cust.type, customerName: cust.name,
  };
}

const OFQ_SEEDS: { frac: [number, number]; qty: number }[] = [
  { frac: [1, 2], qty: 60 }, { frac: [1, 2], qty: 80 }, { frac: [3, 4], qty: 40 },
  { frac: [3, 4], qty: 120 }, { frac: [1, 4], qty: 100 }, { frac: [1, 4], qty: 200 },
  { frac: [1, 3], qty: 60 }, { frac: [1, 3], qty: 90 }, { frac: [2, 3], qty: 30 },
  { frac: [2, 3], qty: 72 }, { frac: [1, 5], qty: 50 }, { frac: [2, 5], qty: 50 },
  { frac: [2, 5], qty: 100 }, { frac: [3, 5], qty: 60 }, { frac: [4, 5], qty: 50 },
  { frac: [1, 6], qty: 60 }, { frac: [5, 6], qty: 48 }, { frac: [3, 8], qty: 64 },
  { frac: [5, 8], qty: 96 }, { frac: [7, 10], qty: 150 }, { frac: [9, 10], qty: 40 },
];

function questionOfQuantity(round: RoundNumber, i: number, rng: () => number): FractionQuestion {
  const seed = pick(OFQ_SEEDS, i);
  const cust = customerFor(i);
  const f = frac(seed.frac[0], seed.frac[1]);
  const part = seed.qty / f.den;
  const correctCount = part * f.num;

  // Plausible miscounts: one part too many or too few, the leftover instead of
  // the share, a single part, and half the order. Anything that lands on the
  // right answer is dropped, so the four choices are always distinct counts.
  const candidates = [
    part * (f.num + 1),          // one part too many
    seed.qty - correctCount,     // the leftover instead of the share
    part * (f.num - 1),          // one part too few
    part,                        // a single part
    part * (f.num + 2),
    part * f.den,                // the whole order
    Math.round(seed.qty / 2),
  ];
  const distractors: Candidate[] = [];
  const used = new Set<number>([correctCount]);
  for (const c of candidates) {
    const n = Math.round(c);
    if (n <= 0 || n > seed.qty || used.has(n)) continue;
    used.add(n);
    distractors.push({ label: `${n}`, value: frac(n, seed.qty) });
  }

  const correctCand: Candidate = { label: `${correctCount}`, value: frac(correctCount, seed.qty) };
  const asCount = (x: Fraction) => `${Math.max(1, Math.round((x.num / x.den) * seed.qty))}`;
  const { options, optionValues, correctIndex } = assemble(rng, correctCand, distractors, false, asCount);
  return {
    id: nextId(), round, kind: 'of_quantity',
    context: `${cust.name} order · production count`,
    prompt: `${cust.name} ordered ${seed.qty} chocolate bars, and ${formatFraction(f)} of them must be ready today. How many bars is that?`,
    options, optionValues, correctIndex,
    customerType: cust.type, customerName: cust.name,
  };
}

const MUL_SEEDS: [[number, number], [number, number]][] = [
  [[1, 2], [1, 2]], [[1, 2], [2, 3]], [[2, 3], [3, 4]], [[3, 4], [2, 3]],
  [[4, 5], [1, 2]], [[2, 3], [3, 5]], [[3, 4], [1, 3]], [[5, 6], [3, 5]],
  [[1, 3], [3, 4]], [[2, 5], [5, 6]], [[3, 8], [2, 3]], [[5, 8], [2, 5]],
  [[7, 8], [2, 7]], [[1, 4], [2, 3]], [[2, 5], [1, 2]], [[3, 5], [1, 2]],
];

function questionMultiply(round: RoundNumber, i: number, rng: () => number): FractionQuestion {
  const [a, b] = pick(MUL_SEEDS, i);
  const fa = frac(a[0], a[1]);
  const fb = frac(b[0], b[1]);
  const cust = customerFor(i);
  const correctVal = multiply(fa, fb);
  const addInstead = add(fa, fb);
  const numeratorsOnly = frac(fa.num * fb.num, fa.den);
  const distractors: Candidate[] = [
    { label: formatFraction(addInstead), value: addInstead },
    { label: formatFraction(numeratorsOnly), value: numeratorsOnly.num > 0 ? numeratorsOnly : frac(1, fa.den) },
    { label: formatFraction(fa), value: fa },
  ];
  const correctCand: Candidate = { label: formatFraction(correctVal), value: correctVal };
  const { options, optionValues, correctIndex } = assemble(rng, correctCand, distractors);
  return {
    id: nextId(), round, kind: 'multiply',
    context: `${cust.name} order · partial batch`,
    prompt: `The factory has ${formatFraction(fa)} of a batch ready, and this order only needs ${formatFraction(fb)} of that amount. How much chocolate is required?`,
    options, optionValues, correctIndex,
    customerType: cust.type, customerName: cust.name,
  };
}

const WORD_SEEDS: { qty: number; frac: [number, number]; theme: 'recipe' | 'inventory' | 'delivery' }[] = [
  { qty: 40, frac: [3, 4], theme: 'recipe' }, { qty: 96, frac: [5, 8], theme: 'inventory' },
  { qty: 60, frac: [2, 3], theme: 'delivery' }, { qty: 80, frac: [3, 5], theme: 'recipe' },
  { qty: 50, frac: [1, 2], theme: 'inventory' }, { qty: 72, frac: [5, 6], theme: 'delivery' },
  { qty: 120, frac: [7, 12], theme: 'recipe' }, { qty: 90, frac: [4, 9], theme: 'inventory' },
  { qty: 30, frac: [2, 3], theme: 'recipe' }, { qty: 100, frac: [4, 5], theme: 'delivery' },
  { qty: 45, frac: [2, 5], theme: 'inventory' }, { qty: 64, frac: [3, 8], theme: 'recipe' },
  { qty: 80, frac: [1, 4], theme: 'delivery' }, { qty: 50, frac: [3, 5], theme: 'inventory' },
];

function questionWordProblem(round: RoundNumber, i: number, rng: () => number): FractionQuestion {
  const seed = pick(WORD_SEEDS, i);
  const cust = customerFor(i);
  const f = frac(seed.frac[0], seed.frac[1]);
  const part = seed.qty / f.den;
  const correctCount = Math.round(part * f.num);

  const candidates = [
    Math.round(seed.qty - correctCount),
    Math.round(part * (f.num + 1)),
    Math.round(part * (f.num - 1)),
    Math.round(part),
    Math.round(part * (f.num + 2)),
    seed.qty,
    Math.round(correctCount / 2),
  ];
  const distractors: Candidate[] = [];
  const used = new Set<number>([correctCount]);
  for (const c of candidates) {
    if (c <= 0 || c > seed.qty || used.has(c)) continue;
    used.add(c);
    distractors.push({ label: `${c}`, value: frac(c, seed.qty) });
  }

  const correctCand: Candidate = { label: `${correctCount}`, value: frac(correctCount, seed.qty) };
  const asCount = (x: Fraction) => `${Math.max(1, Math.round((x.num / x.den) * seed.qty))}`;
  const { options, optionValues, correctIndex } = assemble(rng, correctCand, distractors, false, asCount);
  const line = seed.theme === 'recipe'
    ? `The recipe book lists ${seed.qty} cocoa units in storage, and this batch needs ${formatFraction(f)} of it`
    : seed.theme === 'inventory'
      ? `The warehouse is holding ${seed.qty} finished bars, and ${formatFraction(f)} of them are reserved for ${cust.name}`
      : `${cust.name} will receive ${formatFraction(f)} of the ${seed.qty} bars produced this morning`;
  return {
    id: nextId(), round, kind: 'word_problem',
    context: `${cust.name} order · ${seed.theme}`,
    prompt: `${line}. How many bars does that come to?`,
    options, optionValues, correctIndex,
    customerType: cust.type, customerName: cust.name,
  };
}

// ── PUBLIC API ───────────────────────────────────────────────────────────

const ROUND5_KINDS: Array<(r: RoundNumber, i: number, rng: () => number) => FractionQuestion> = [
  questionMixed, questionImproper, questionOfQuantity, questionMultiply, questionWordProblem,
];

/** Generates one question for a round. `index` should increase every call so the bank cycles without early repeats. */
export function generateQuestion(round: RoundNumber, index: number, seed: number): FractionQuestion {
  const rng = mulberry32(seed);
  switch (round) {
    case 1: return questionIdentify(round, index, rng);
    case 2: return questionEquivalent(round, index, rng);
    case 3: return questionCompare(round, index, rng);
    case 4: return questionAddSubtract(round, index, rng);
    case 5: {
      const fn = ROUND5_KINDS[index % ROUND5_KINDS.length];
      return fn(round, Math.floor(index / ROUND5_KINDS.length), rng);
    }
  }
}

/** True count of distinct authored seeds across every round — kept well over 100. */
export const SEED_BANK_SIZE =
  ID_SEEDS.length + EQ_SEEDS.length + CMP_SEEDS.length + ADD_SEEDS.length +
  MIXED_SEEDS.length + IMPROPER_SEEDS.length + OFQ_SEEDS.length + MUL_SEEDS.length + WORD_SEEDS.length;

export const ROUND_TITLES: Record<RoundNumber, string> = {
  1: 'FRACTION RECOGNITION',
  2: 'EQUIVALENT BATCHES',
  3: 'COMPARING TANKS',
  4: 'COMBINING BATCHES',
  5: 'ADVANCED PRODUCTION',
};

export const ROUND_BRIEFS: Record<RoundNumber, string> = {
  1: 'Identify the fraction of chocolate in each production tray.',
  2: 'Find the equivalent fraction the recipe accepts.',
  3: 'Compare ingredient tanks and pick the correct amount.',
  4: 'Combine or use up batches with addition and subtraction.',
  5: 'Mixed numbers, improper fractions and multi-step orders.',
};

export function optionValueToBatches(f: Fraction) {
  return batchesOf(f);
}
export { toDecimal };
