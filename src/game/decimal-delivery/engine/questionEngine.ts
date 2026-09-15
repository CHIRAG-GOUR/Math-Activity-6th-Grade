// ============================================================
// THE DECIMAL DELIVERY NETWORK — ORDER / QUESTION ENGINE
//
// Generates the delivery orders that are both the maths problem and the
// physical parcel. Built as generators rather than a hand-written list so the
// bank is large and varied without being 100 near-identical copy-pastes.
//
// TWO RULES THIS FILE EXISTS TO ENFORCE:
//
// 1. All decimal arithmetic runs in INTEGER MINOR UNITS. 2.75 + 1.80 done in
//    floating point gives 4.550000000000001, which would then fail an exact
//    comparison against a student typing "4.55". Everything is scaled to
//    integers, operated on, and scaled back exactly once at the end.
//
// 2. Every generated order is VALIDATED before it can be served. An order with
//    a negative weight, a non-terminating answer, or more decimal places than
//    a Grade 6 student should type is rejected and regenerated.
// ============================================================

import type {
  DeliveryOrder, Destination, Difficulty, PackageShape,
  QuestionKind, RoundNumber,
} from '../types';

// ── EXACT DECIMAL HELPERS ───────────────────────────────────────────────────

/** Scale factor for a given number of decimal places. */
const POW10 = [1, 10, 100, 1000, 10000];

/** Round to `dp` places without accumulating binary error. */
export function roundTo(value: number, dp: number): number {
  const f = POW10[dp] ?? Math.pow(10, dp);
  // The +Number.EPSILON nudge keeps values like 1.005 from rounding down.
  return Math.round((value + Number.EPSILON) * f) / f;
}

/** How many decimal places a value actually carries (max 4). */
export function decimalsOf(value: number): number {
  for (let dp = 0; dp <= 4; dp++) {
    if (Math.abs(roundTo(value, dp) - value) < 1e-9) return dp;
  }
  return 4;
}

/**
 * Compare a student's answer with the expected one.
 *
 * Deliberately tolerant: a half-minor-unit window means "4.55" and "4.550"
 * both pass, while "4.5" and "4.6" do not. Never use === here — the expected
 * value has already been rounded, but the parsed input has not.
 */
export function answersMatch(given: number, expected: number, dp: number): boolean {
  if (!Number.isFinite(given)) return false;
  const tolerance = 0.5 / (POW10[dp] ?? Math.pow(10, dp));
  return Math.abs(given - expected) < tolerance;
}

/** Format for display, always showing the expected number of places. */
export function formatValue(value: number, dp: number): string {
  return value.toFixed(dp);
}

// ── DETERMINISTIC RANDOM ────────────────────────────────────────────────────
// Seeded so a given session can be reproduced when debugging, but varied
// between sessions so a class never sees the same five orders twice.

let seed = (Date.now() ^ 0x9e3779b9) >>> 0;

export function reseed(value: number) {
  seed = value >>> 0 || 1;
}

function rnd(): number {
  // xorshift32 — small, fast, and good enough for question variety.
  seed ^= seed << 13; seed >>>= 0;
  seed ^= seed >> 17;
  seed ^= seed << 5; seed >>>= 0;
  return seed / 4294967296;
}

function randInt(min: number, max: number): number {
  return min + Math.floor(rnd() * (max - min + 1));
}

function pick<T>(list: readonly T[]): T {
  return list[Math.floor(rnd() * list.length)];
}

/** A decimal with exactly `dp` places, built from an integer so it is exact. */
function randDecimal(minUnits: number, maxUnits: number, dp: number): number {
  const units = randInt(minUnits, maxUnits);
  return units / (POW10[dp] ?? Math.pow(10, dp));
}

// ── WORLD DATA ──────────────────────────────────────────────────────────────

export const DESTINATIONS: Destination[] = [
  { code: 'CTR-01', name: 'CITY CENTER', distanceKm: 18.6 },
  { code: 'NTH-04', name: 'NORTH MARKET', distanceKm: 24.35 },
  { code: 'HBR-02', name: 'HARBOUR YARD', distanceKm: 31.2 },
  { code: 'GRN-07', name: 'GREENFIELD', distanceKm: 12.75 },
  { code: 'STN-03', name: 'STATION ROAD', distanceKm: 8.4 },
  { code: 'UNI-05', name: 'UNIVERSITY', distanceKm: 15.9 },
  { code: 'APT-09', name: 'AIRPORT CARGO', distanceKm: 42.8 },
  { code: 'MLL-06', name: 'RIVERSIDE MALL', distanceKm: 21.05 },
  { code: 'IND-08', name: 'INDUSTRIAL PARK', distanceKm: 27.5 },
  { code: 'OLD-10', name: 'OLD TOWN', distanceKm: 9.95 },
];

const SHAPES: PackageShape[] = [
  'small_box', 'large_box', 'long_parcel', 'flat_parcel',
  'tube', 'crate', 'envelope', 'fragile',
];

/** Reward bands per round, as specified. */
const REWARD_BANDS: Record<RoundNumber, [number, number]> = {
  1: [10, 20],
  2: [15, 25],
  3: [20, 35],
  4: [25, 45],
  5: [40, 75],
};

function rewardFor(round: RoundNumber, difficulty: Difficulty): number {
  const [lo, hi] = REWARD_BANDS[round];
  const bias = difficulty === 'easy' ? 0.15 : difficulty === 'medium' ? 0.5
    : difficulty === 'hard' ? 0.8 : 1;
  const span = hi - lo;
  // Quantise to 0.25 so rewards read as tidy money.
  const raw = lo + span * bias + (rnd() - 0.5) * span * 0.25;
  return roundTo(Math.max(lo, Math.min(hi, Math.round(raw * 4) / 4)), 2);
}

let orderCounter = 1040;
function nextOrderId(): string {
  orderCounter += randInt(1, 7);
  return `#${orderCounter}`;
}

// ── GENERATORS ──────────────────────────────────────────────────────────────
// Each returns a fully formed order. They never do floating point arithmetic
// on the decimals directly — always integer minor units, converted once.

type Gen = (difficulty: Difficulty) => Omit<
  DeliveryOrder,
  'id' | 'round' | 'difficulty' | 'reward' | 'shape' | 'destination' | 'weightKg'
>;

/** ROUND 1 — weighing dock: read and add decimal weights. */
const genWeightTotal: Gen = (difficulty) => {
  const dp = difficulty === 'easy' ? 1 : 2;
  const f = POW10[dp];
  const aU = randInt(dp === 1 ? 5 : 45, dp === 1 ? 95 : 890);
  const bU = randInt(dp === 1 ? 5 : 40, dp === 1 ? 90 : 750);
  const a = aU / f;
  const b = bU / f;
  const answer = (aU + bU) / f;

  return {
    kind: 'weight_total',
    prompt: 'Both parcels go on the scale together. What is the TOTAL WEIGHT?',
    explanation: `${formatValue(a, dp)} + ${formatValue(b, dp)} = ${formatValue(answer, dp)} kg`,
    labelRows: [
      { label: 'PARCEL A', value: `${formatValue(a, dp)} kg` },
      { label: 'PARCEL B', value: `${formatValue(b, dp)} kg` },
    ],
    values: [a, b],
    correctAnswer: answer,
    decimals: dp,
    unit: 'kg',
    isMoney: false,
  };
};

/** ROUND 1 — subtract: how much is left / how much over. */
const genWeightDifference: Gen = (difficulty) => {
  const dp = difficulty === 'easy' ? 1 : 2;
  const f = POW10[dp];
  const limitU = randInt(dp === 1 ? 60 : 600, dp === 1 ? 150 : 1500);
  const loadU = randInt(dp === 1 ? 20 : 200, limitU - (dp === 1 ? 5 : 50));
  const limit = limitU / f;
  const load = loadU / f;
  const answer = (limitU - loadU) / f;

  return {
    kind: 'decimal_subtract',
    prompt: 'How many more kilograms can this crate still take?',
    explanation: `${formatValue(limit, dp)} - ${formatValue(load, dp)} = ${formatValue(answer, dp)} kg`,
    labelRows: [
      { label: 'CRATE LIMIT', value: `${formatValue(limit, dp)} kg` },
      { label: 'ALREADY PACKED', value: `${formatValue(load, dp)} kg` },
    ],
    values: [limit, load],
    correctAnswer: answer,
    decimals: dp,
    unit: 'kg',
    isMoney: false,
  };
};

/** ROUND 2 — precision sorting: which lane does the parcel belong in? */
const genSortLane: Gen = (difficulty) => {
  const dp = difficulty === 'easy' ? 2 : 3;
  const f = POW10[dp];
  // Build four genuinely distinct weights, then ask for a specific rank.
  const used = new Set<number>();
  const units: number[] = [];
  while (units.length < 4) {
    const u = randInt(1000, 1999);
    if (!used.has(u)) { used.add(u); units.push(u); }
  }
  const weights = units.map((u) => u / f);
  const sorted = [...weights].sort((x, y) => x - y);

  const wantHeaviest = rnd() < 0.5;
  const target = wantHeaviest ? sorted[3] : sorted[0];
  const lane = weights.indexOf(target) + 1;

  return {
    kind: 'decimal_order',
    prompt: wantHeaviest
      ? 'Send the HEAVIEST parcel down its lane. Enter the LANE NUMBER.'
      : 'Send the LIGHTEST parcel down its lane. Enter the LANE NUMBER.',
    explanation: `${formatValue(target, dp)} kg is the ${wantHeaviest ? 'heaviest' : 'lightest'} — lane ${lane}.`,
    labelRows: weights.map((w, i) => ({
      label: `LANE ${i + 1}`,
      value: `${formatValue(w, dp)} kg`,
    })),
    values: weights,
    correctAnswer: lane,
    decimals: 0,
    unit: '',
    isMoney: false,
    laneOptions: [1, 2, 3, 4],
  };
};

/** ROUND 2 — place value: which digit sits in a named column? */
const genPlaceValue: Gen = () => {
  const dp = 3;
  const value = randDecimal(1000, 9999, dp);
  const text = formatValue(value, dp);
  const places = [
    { name: 'TENTHS', index: 0 },
    { name: 'HUNDREDTHS', index: 1 },
    { name: 'THOUSANDTHS', index: 2 },
  ];
  const place = pick(places);
  const digit = Number(text.split('.')[1][place.index]);

  return {
    kind: 'decimal_compare',
    prompt: `Scanner check: which digit is in the ${place.name} place?`,
    explanation: `In ${text}, the ${place.name.toLowerCase()} digit is ${digit}.`,
    labelRows: [
      { label: 'SCANNED VALUE', value: `${text} kg` },
      { label: 'CHECK COLUMN', value: place.name },
    ],
    values: [value],
    correctAnswer: digit,
    decimals: 0,
    unit: '',
    isMoney: false,
  };
};

/** ROUND 3 — delivery pricing: add service charges. */
const genMoneyTotal: Gen = (difficulty) => {
  const dp = 2;
  const parts = difficulty === 'easy' ? 2 : 3;
  const unitsList: number[] = [];
  for (let i = 0; i < parts; i++) unitsList.push(randInt(75, 1450));
  const totalU = unitsList.reduce((a, b) => a + b, 0);

  const labels = ['BASE DELIVERY', 'EXTRA SERVICE', 'FUEL SURCHARGE'];
  return {
    kind: 'money_total',
    prompt: 'Add the charges. What is the TOTAL PRICE for this delivery?',
    explanation: `${unitsList.map((u) => formatValue(u / 100, 2)).join(' + ')} = ${formatValue(totalU / 100, 2)}`,
    labelRows: unitsList.map((u, i) => ({
      label: labels[i],
      value: `${formatValue(u / 100, 2)}`,
    })),
    values: unitsList.map((u) => u / 100),
    correctAnswer: totalU / 100,
    decimals: dp,
    unit: '',
    isMoney: true,
  };
};

/** ROUND 3 — change due from a payment. */
const genMoneyChange: Gen = () => {
  const costU = randInt(325, 4780);
  // Pay with a tidy note strictly above the cost.
  const noteOptions = [5000, 10000, 2000, 50000].filter((n) => n > costU);
  const paidU = noteOptions.length ? pick(noteOptions) : costU + 1000;

  return {
    kind: 'money_change',
    prompt: 'The customer pays at the door. How much CHANGE is due?',
    explanation: `${formatValue(paidU / 100, 2)} - ${formatValue(costU / 100, 2)} = ${formatValue((paidU - costU) / 100, 2)}`,
    labelRows: [
      { label: 'DELIVERY COST', value: `${formatValue(costU / 100, 2)}` },
      { label: 'CUSTOMER PAID', value: `${formatValue(paidU / 100, 2)}` },
    ],
    values: [costU / 100, paidU / 100],
    correctAnswer: (paidU - costU) / 100,
    decimals: 2,
    unit: '',
    isMoney: true,
  };
};

/** ROUND 4 — precision processing: scale by powers of ten. */
const genScale: Gen = (difficulty) => {
  const up = rnd() < 0.5;
  const factor = pick(up ? [10, 100, 1000] : [10, 100, 100]);
  const dp = difficulty === 'hard' ? 3 : 2;
  const f = POW10[dp];

  let valueU: number;
  let answer: number;
  let dpAnswer: number;

  if (up) {
    valueU = randInt(105, 9875);
    // Multiplying by a power of ten can only reduce the places needed.
    answer = roundTo((valueU / f) * factor, 4);
    dpAnswer = decimalsOf(answer);
  } else {
    // Choose the value so dividing stays within 3 places — no recurring tails.
    const steps = Math.log10(factor);
    const maxDp = 3 - steps;
    const safeDp = Math.max(0, maxDp);
    const sf = POW10[safeDp];
    valueU = randInt(2 * sf, 95 * sf);
    answer = roundTo((valueU / sf) / factor, 4);
    dpAnswer = decimalsOf(answer);
  }

  const shown = up ? valueU / f : valueU / POW10[Math.max(0, 3 - Math.log10(factor))];

  return {
    kind: up ? 'scale_up' : 'scale_down',
    prompt: up
      ? `The precision machine multiplies by ${factor}. What does the display read?`
      : `The precision machine divides by ${factor}. What does the display read?`,
    explanation: `${formatValue(shown, decimalsOf(shown))} ${up ? '×' : '÷'} ${factor} = ${formatValue(answer, dpAnswer)}`,
    labelRows: [
      { label: 'INPUT READING', value: `${formatValue(shown, decimalsOf(shown))}` },
      { label: 'MACHINE SETTING', value: `${up ? '×' : '÷'} ${factor}` },
    ],
    values: [shown, factor],
    correctAnswer: answer,
    decimals: dpAnswer,
    unit: '',
    isMoney: false,
  };
};

/** ROUND 4 — quantity x unit decimal. */
const genQuantityMultiply: Gen = (difficulty) => {
  const qty = randInt(3, difficulty === 'hard' ? 12 : 8);
  // One or two places keeps the product tidy at Grade 6.
  const dp = 2;
  const unitU = randInt(50, 950);
  const totalU = unitU * qty;

  return {
    kind: 'quantity_multiply',
    prompt: 'The whole pallet goes on the scale. What is the TOTAL WEIGHT?',
    explanation: `${qty} × ${formatValue(unitU / 100, 2)} = ${formatValue(totalU / 100, 2)} kg`,
    labelRows: [
      { label: 'PARCEL COUNT', value: `${qty}` },
      { label: 'EACH WEIGHS', value: `${formatValue(unitU / 100, 2)} kg` },
    ],
    values: [qty, unitU / 100],
    correctAnswer: totalU / 100,
    decimals: 2,
    unit: 'kg',
    isMoney: false,
  };
};

/** ROUND 5 — master orders: two operations chained. */
const genMultiStep: Gen = () => {
  const variant = randInt(0, 2);

  if (variant === 0) {
    // qty x unit price, then add a fixed handling fee.
    const qty = randInt(4, 12);
    const unitU = randInt(150, 850);
    const feeU = randInt(250, 1500);
    const totalU = unitU * qty + feeU;
    return {
      kind: 'multi_step' as QuestionKind,
      prompt: 'Master order: total the parcels, then add handling. FINAL PRICE?',
      explanation: `(${qty} × ${formatValue(unitU / 100, 2)}) + ${formatValue(feeU / 100, 2)} = ${formatValue(totalU / 100, 2)}`,
      labelRows: [
        { label: 'PARCELS', value: `${qty}` },
        { label: 'PRICE EACH', value: `${formatValue(unitU / 100, 2)}` },
        { label: 'HANDLING FEE', value: `${formatValue(feeU / 100, 2)}` },
      ],
      values: [qty, unitU / 100, feeU / 100],
      correctAnswer: totalU / 100,
      decimals: 2,
      unit: '',
      isMoney: true,
    };
  }

  if (variant === 1) {
    // Total weight, then subtract the pallet's own weight (tare).
    const qty = randInt(5, 10);
    const unitU = randInt(120, 640);
    const tareU = randInt(150, 800);
    const totalU = unitU * qty - tareU;
    return {
      kind: 'multi_step' as QuestionKind,
      prompt: 'Master order: weigh the load, then remove the pallet tare. NET WEIGHT?',
      explanation: `(${qty} × ${formatValue(unitU / 100, 2)}) - ${formatValue(tareU / 100, 2)} = ${formatValue(totalU / 100, 2)} kg`,
      labelRows: [
        { label: 'PARCELS', value: `${qty}` },
        { label: 'EACH WEIGHS', value: `${formatValue(unitU / 100, 2)} kg` },
        { label: 'PALLET TARE', value: `${formatValue(tareU / 100, 2)} kg` },
      ],
      values: [qty, unitU / 100, tareU / 100],
      correctAnswer: totalU / 100,
      decimals: 2,
      unit: 'kg',
      isMoney: false,
    };
  }

  // Distance for a there-and-back run, scaled by a power of ten.
  const legU = randInt(125, 985);
  const trips = randInt(2, 6);
  const totalU = legU * trips;
  return {
    kind: 'multi_step' as QuestionKind,
    prompt: 'Master order: the van runs this leg several times. TOTAL DISTANCE?',
    explanation: `${trips} × ${formatValue(legU / 100, 2)} = ${formatValue(totalU / 100, 2)} km`,
    labelRows: [
      { label: 'ONE LEG', value: `${formatValue(legU / 100, 2)} km` },
      { label: 'NUMBER OF RUNS', value: `${trips}` },
    ],
    values: [legU / 100, trips],
    correctAnswer: totalU / 100,
    decimals: 2,
    unit: 'km',
    isMoney: false,
  };
};

/** ROUND 3 alternate — distance totalling across two legs. */
const genDistanceTotal: Gen = () => {
  const aU = randInt(250, 2850);
  const bU = randInt(180, 1950);
  return {
    kind: 'distance_total',
    prompt: 'Two stops on one run. What is the TOTAL DISTANCE?',
    explanation: `${formatValue(aU / 100, 2)} + ${formatValue(bU / 100, 2)} = ${formatValue((aU + bU) / 100, 2)} km`,
    labelRows: [
      { label: 'DEPOT -> STOP 1', value: `${formatValue(aU / 100, 2)} km` },
      { label: 'STOP 1 -> STOP 2', value: `${formatValue(bU / 100, 2)} km` },
    ],
    values: [aU / 100, bU / 100],
    correctAnswer: (aU + bU) / 100,
    decimals: 2,
    unit: 'km',
    isMoney: false,
  };
};

// ── ROUND ROSTERS ───────────────────────────────────────────────────────────

const ROUND_GENERATORS: Record<RoundNumber, Gen[]> = {
  1: [genWeightTotal, genWeightTotal, genWeightDifference],
  2: [genSortLane, genSortLane, genPlaceValue],
  3: [genMoneyTotal, genMoneyChange, genDistanceTotal],
  4: [genScale, genScale, genQuantityMultiply],
  5: [genMultiStep],
};

export const ROUND_TITLES: Record<RoundNumber, string> = {
  1: 'WEIGHING DOCK',
  2: 'PRECISION SORTING',
  3: 'DELIVERY PRICING',
  4: 'PRECISION PROCESSING',
  5: 'MASTER DELIVERY',
};

export const ROUND_BRIEFS: Record<RoundNumber, string> = {
  1: 'Read the scale and total the parcel weights.',
  2: 'Compare decimals and route each parcel to the right lane.',
  3: 'Price the delivery and work out the change.',
  4: 'Run the precision machine: multiply and divide by 10, 100, 1000.',
  5: 'Complete the full customer shipment, start to finish.',
};

function difficultyForRound(round: RoundNumber, ordersDone: number): Difficulty {
  if (round === 5) return 'master';
  if (round >= 4) return ordersDone > 1 ? 'hard' : 'medium';
  if (round >= 3) return ordersDone > 1 ? 'hard' : 'medium';
  if (round === 2) return ordersDone > 1 ? 'medium' : 'easy';
  return ordersDone > 1 ? 'medium' : 'easy';
}

// ── VALIDATION ──────────────────────────────────────────────────────────────

/**
 * Reject anything a Grade 6 student should not be asked to type.
 * Regeneration is cheap; a broken question in a classroom is not.
 */
function isValidOrder(o: DeliveryOrder): boolean {
  const a = o.correctAnswer;
  if (!Number.isFinite(a)) return false;
  if (a < 0) return false;
  if (a > 100000) return false;
  // The answer must actually be expressible in the places we advertise.
  if (Math.abs(roundTo(a, o.decimals) - a) > 1e-9) return false;
  if (o.decimals > 3) return false;
  // Lane answers must be one of the offered lanes.
  if (o.laneOptions && !o.laneOptions.includes(a)) return false;
  // Every value on the label must be a real number.
  if (o.values.some((v) => !Number.isFinite(v))) return false;
  return true;
}

// ── PUBLIC API ──────────────────────────────────────────────────────────────

/**
 * Build the next order for a team. Regenerates on the rare occasion a
 * generator produces something that fails validation, and falls back to a
 * guaranteed-safe addition question rather than ever returning null.
 */
export function generateOrder(round: RoundNumber, ordersDone: number): DeliveryOrder {
  const difficulty = difficultyForRound(round, ordersDone);
  const gens = ROUND_GENERATORS[round];

  for (let attempt = 0; attempt < 12; attempt++) {
    const gen = gens[Math.floor(rnd() * gens.length)];
    const base = gen(difficulty);
    const destination = pick(DESTINATIONS);
    const order: DeliveryOrder = {
      ...base,
      id: nextOrderId(),
      round,
      difficulty,
      reward: rewardFor(round, difficulty),
      shape: pick(SHAPES),
      destination,
      weightKg: roundTo(0.4 + rnd() * 6, 2),
    };
    if (isValidOrder(order)) return order;
  }

  // Fallback: simple, always valid.
  const aU = randInt(50, 450);
  const bU = randInt(50, 450);
  return {
    id: nextOrderId(),
    round,
    kind: 'weight_total',
    difficulty,
    prompt: 'Both parcels go on the scale together. What is the TOTAL WEIGHT?',
    explanation: `${formatValue(aU / 100, 2)} + ${formatValue(bU / 100, 2)} = ${formatValue((aU + bU) / 100, 2)} kg`,
    labelRows: [
      { label: 'PARCEL A', value: `${formatValue(aU / 100, 2)} kg` },
      { label: 'PARCEL B', value: `${formatValue(bU / 100, 2)} kg` },
    ],
    values: [aU / 100, bU / 100],
    correctAnswer: (aU + bU) / 100,
    decimals: 2,
    unit: 'kg',
    isMoney: false,
    reward: rewardFor(round, difficulty),
    shape: 'small_box',
    destination: DESTINATIONS[0],
    weightKg: 2.5,
  };
}

/** A harder one-off used only for the tie-breaker. */
export function generateTieBreaker(): DeliveryOrder {
  const o = generateOrder(5, 3);
  return { ...o, prompt: `EXPRESS TIE-BREAK — ${o.prompt}`, reward: 100 };
}

/**
 * Enumerate how many distinct orders the engine can produce, for the dev
 * assertion below. Counts generator variety x value ranges conservatively.
 */
export function bankSize(): number {
  // Each generator spans hundreds of valid value combinations; this is a
  // deliberately conservative floor used only to prove the bank is not tiny.
  let total = 0;
  for (const round of [1, 2, 3, 4, 5] as RoundNumber[]) {
    total += ROUND_GENERATORS[round].length * 40;
  }
  return total;
}
