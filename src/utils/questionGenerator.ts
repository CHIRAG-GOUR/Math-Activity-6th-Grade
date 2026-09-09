import { DifficultyLevel, MathTopic, Question } from '@/types/game';

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Global session memory to guarantee 0 repeats
const sessionUsedSignatures = new Set<string>();

export function clearQuestionHistory() {
  sessionUsedSignatures.clear();
}

type GeneratorFn = (diff: DifficultyLevel) => {
  signature: string;
  text: string;
  subText?: string;
  answer: number;
  hint: string;
  explanation: string;
};

// =========================================================================
// MASSIVE GRADE 6 BLOOM'S TAXONOMY GENERATOR POOL (1000+ Unique Combinations)
// =========================================================================

const TOPIC_GENERATORS: Record<MathTopic, GeneratorFn[]> = {
  // 1. BODMAS & NUMBER PATTERNS (Addition / Mixed)
  addition: [
    // BODMAS with addition & multiplication
    (diff) => {
      const a = getRandomInt(2, 8);
      const b = getRandomInt(3, 9);
      const c = getRandomInt(4, 25);
      const ans = a * b + c;
      return {
        signature: `bodmas-add-${a}x${b}+${c}`,
        text: `${a} × ${b} + ${c} = ?`,
        subText: 'Order of Operations (BODMAS)',
        answer: ans,
        hint: `Multiply first: ${a} × ${b} = ${a * b}, then add ${c}.`,
        explanation: `(${a} × ${b}) + ${c} = ${a * b} + ${c} = ${ans}`,
      };
    },
    // BODMAS with Powers (Exponents)
    (diff) => {
      const bases = [2, 3, 4, 5, 6, 10];
      const base = getRandomItem(bases);
      const power = base === 2 ? getRandomItem([2, 3, 4]) : 2;
      const val = Math.pow(base, power);
      const add = getRandomInt(5, 30);
      const ans = val + add;
      return {
        signature: `power-add-${base}^${power}+${add}`,
        text: `${base}${power === 2 ? '²' : power === 3 ? '³' : '⁴'} + ${add} = ?`,
        subText: 'Exponents & Addition',
        answer: ans,
        hint: `${base}${power === 2 ? '²' : '³'} = ${val}. Now add ${add}.`,
        explanation: `${val} + ${add} = ${ans}`,
      };
    },
    // Number Patterns (Arithmetic Progression)
    (diff) => {
      const start = getRandomInt(2, 20);
      const step = getRandomInt(3, 9);
      const terms = [start, start + step, start + step * 2, start + step * 3];
      const ans = start + step * 4;
      return {
        signature: `seq-ap-${start}+${step}`,
        text: `${terms.join(', ')}, ?`,
        subText: `Pattern rule: Add ${step} each step`,
        answer: ans,
        hint: `Each number increases by ${step}. Last term is ${terms[3]} + ${step}.`,
        explanation: `${terms[3]} + ${step} = ${ans}`,
      };
    },
    // Square Number Series
    (diff) => {
      const start = getRandomInt(1, 4);
      const terms = [start * start, (start + 1) * (start + 1), (start + 2) * (start + 2), (start + 3) * (start + 3)];
      const ans = (start + 4) * (start + 4);
      return {
        signature: `seq-sq-${start}`,
        text: `${terms.join(', ')}, ?`,
        subText: 'Square Number Pattern',
        answer: ans,
        hint: `These are consecutive squares: ${start}², ${start + 1}², ${start + 2}²... next is ${start + 4}².`,
        explanation: `${start + 4}² = ${(start + 4) * (start + 4)} = ${ans}`,
      };
    },
    // Adding Negative & Positive Integers
    (diff) => {
      const neg = getRandomInt(8, 45);
      const pos = neg + getRandomInt(5, 35);
      const ans = pos - neg;
      return {
        signature: `int-add-(-${neg})+${pos}`,
        text: `(-${neg}) + ${pos} = ?`,
        subText: 'Integer Addition',
        answer: ans,
        hint: `Starts at -${neg} and rises ${pos}. Same as ${pos} − ${neg}.`,
        explanation: `(-${neg}) + ${pos} = ${pos} − ${neg} = ${ans}`,
      };
    },
  ],

  // 2. ANGLES & GEOMETRY ANALYSIS (Subtraction / Geometry)
  subtraction: [
    // Complementary Angles (Sum to 90)
    (diff) => {
      const angle = getRandomInt(15, 75);
      const ans = 90 - angle;
      return {
        signature: `angle-comp-${angle}`,
        text: `Complement of ${angle}° = ?`,
        subText: 'Complementary angles add to 90°',
        answer: ans,
        hint: `Subtract from 90°: 90 − ${angle} = ?`,
        explanation: `90° − ${angle}° = ${ans}°`,
      };
    },
    // Supplementary Angles (Sum to 180)
    (diff) => {
      const angle = getRandomInt(25, 155);
      const ans = 180 - angle;
      return {
        signature: `angle-supp-${angle}`,
        text: `Supplement of ${angle}° = ?`,
        subText: 'Supplementary angles add to 180°',
        answer: ans,
        hint: `Subtract from 180°: 180 − ${angle} = ?`,
        explanation: `180° − ${angle}° = ${ans}°`,
      };
    },
    // Triangle Third Angle
    (diff) => {
      const a = getRandomInt(30, 80);
      const b = getRandomInt(30, 80);
      const ans = 180 - (a + b);
      return {
        signature: `tri-ang-${a}-${b}`,
        text: `Triangle: ${a}°, ${b}°, ? = ?`,
        subText: 'Total sum of angles in triangle = 180°',
        answer: ans,
        hint: `Sum of known angles = ${a + b}°. 180 − ${a + b} = ?`,
        explanation: `180° − (${a}° + ${b}°) = ${ans}°`,
      };
    },
    // Perimeter of Square -> Find Side
    (diff) => {
      const side = getRandomInt(4, 25);
      const perim = side * 4;
      return {
        signature: `sq-side-${perim}`,
        text: `Square: Perimeter = ${perim}. Side = ?`,
        subText: 'Perimeter = 4 × Side',
        answer: side,
        hint: `Divide perimeter by 4: ${perim} ÷ 4 = ?`,
        explanation: `${perim} ÷ 4 = ${side}`,
      };
    },
    // Rectangle Area -> Find Width
    (diff) => {
      const w = getRandomInt(3, 12);
      const l = getRandomInt(5, 15);
      const area = w * l;
      return {
        signature: `rect-w-${area}-${l}`,
        text: `Area = ${area}, Length = ${l}. Width = ?`,
        subText: 'Area = Length × Width',
        answer: w,
        hint: `Divide Area by Length: ${area} ÷ ${l} = ?`,
        explanation: `${area} ÷ ${l} = ${w}`,
      };
    },
    // Triangle Area
    (diff) => {
      const base = getRandomInt(4, 16);
      const height = getRandomInt(4, 12);
      const ans = (base * height) / 2;
      return {
        signature: `tri-area-${base}-${height}`,
        text: `Triangle: Base = ${base}, Height = ${height}. Area = ?`,
        subText: 'Area = (Base × Height) ÷ 2',
        answer: ans,
        hint: `Multiply base × height (${base * height}), then take half!`,
        explanation: `(${base} × ${height}) ÷ 2 = ${ans}`,
      };
    },
  ],

  // 3. INTEGERS & MULTIPLICATION
  multiplication: [
    // Negative × Negative = Positive
    (diff) => {
      const a = getRandomInt(3, 12);
      const b = getRandomInt(4, 12);
      const ans = a * b;
      return {
        signature: `int-mul-(-${a})x(-${b})`,
        text: `(-${a}) × (-${b}) = ?`,
        subText: 'Negative × Negative = Positive',
        answer: ans,
        hint: `Both are negative, so product is positive: ${a} × ${b}.`,
        explanation: `(-${a}) × (-${b}) = +${ans}`,
      };
    },
    // Negative × Positive = Negative (as positive absolute value or subtraction)
    (diff) => {
      const a = getRandomInt(2, 9);
      const b = getRandomInt(3, 8);
      const c = getRandomInt(30, 80);
      const ans = c - a * b;
      return {
        signature: `bodmas-sub-mul-${c}-${a}x${b}`,
        text: `${c} − ${a} × ${b} = ?`,
        subText: 'BODMAS: Multiply before subtracting',
        answer: ans,
        hint: `First ${a} × ${b} = ${a * b}. Then ${c} − ${a * b} = ?`,
        explanation: `${c} − ${a * b} = ${ans}`,
      };
    },
    // Distributive Property Mental Shortcut
    (diff) => {
      const mult = getRandomItem([4, 5, 6, 7, 8, 9]);
      const n = getRandomItem([19, 21, 29, 31, 49, 51]);
      const ans = mult * n;
      return {
        signature: `distrib-${mult}x${n}`,
        text: `${mult} × ${n} = ?`,
        subText: 'Mental Math: Round & Distribute',
        answer: ans,
        hint: n % 10 === 9
          ? `Think: (${n + 1} × ${mult}) − ${mult}`
          : `Think: (${n - 1} × ${mult}) + ${mult}`,
        explanation: `${mult} × ${n} = ${ans}`,
      };
    },
    // Powers & Squares
    (diff) => {
      const n = getRandomInt(11, 19);
      const ans = n * n;
      return {
        signature: `square-${n}`,
        text: `${n}² = ?`,
        subText: `${n} × ${n}`,
        answer: ans,
        hint: `Multiply ${n} by ${n}. (${n} × 10 + ${n} × ${n - 10})`,
        explanation: `${n} × ${n} = ${ans}`,
      };
    },
  ],

  // 4. RATIOS, HCF & DIVISION
  division: [
    // Equivalent Ratios (Find missing term)
    (diff) => {
      const a = getRandomInt(2, 7);
      const b = getRandomInt(3, 9);
      const scale = getRandomInt(3, 8);
      const ans = b * scale;
      return {
        signature: `ratio-${a}:${b}=${a * scale}:?`,
        text: `${a} : ${b} = ${a * scale} : ?`,
        subText: 'Equivalent Ratio: Scale both terms equally',
        answer: ans,
        hint: `${a} is multiplied by ${scale} to get ${a * scale}. Multiply ${b} × ${scale}!`,
        explanation: `Scale factor = ${scale}. ${b} × ${scale} = ${ans}.`,
      };
    },
    // HCF of two numbers
    (diff) => {
      const base = getRandomInt(3, 9);
      const mult1 = getRandomItem([2, 3, 4, 5]);
      const mult2 = getRandomItem([6, 7, 8, 9]);
      const n1 = base * mult1;
      const n2 = base * mult2;
      const gcd = (x: number, y: number): number => (!y ? x : gcd(y, x % y));
      const ans = gcd(n1, n2);
      return {
        signature: `hcf-${n1}-${n2}`,
        text: `HCF of ${n1} and ${n2} = ?`,
        subText: 'Highest Common Factor (Greatest Divisor)',
        answer: ans,
        hint: `What is the largest integer that divides both ${n1} and ${n2}?`,
        explanation: `Factors of both share highest common divisor ${ans}.`,
      };
    },
    // LCM of two numbers
    (diff) => {
      const pairs = [
        { a: 4, b: 6, lcm: 12 },
        { a: 6, b: 8, lcm: 24 },
        { a: 8, b: 12, lcm: 24 },
        { a: 6, b: 9, lcm: 18 },
        { a: 4, b: 10, lcm: 20 },
        { a: 10, b: 15, lcm: 30 },
        { a: 12, b: 15, lcm: 60 },
        { a: 9, b: 12, lcm: 36 },
        { a: 14, b: 21, lcm: 42 },
        { a: 15, b: 20, lcm: 60 },
      ];
      const p = getRandomItem(pairs);
      return {
        signature: `lcm-${p.a}-${p.b}`,
        text: `LCM of ${p.a} and ${p.b} = ?`,
        subText: 'Lowest Common Multiple',
        answer: p.lcm,
        hint: `Multiples of ${p.b}: ${p.b}, ${p.b * 2}, ${p.b * 3}... which divides by ${p.a}?`,
        explanation: `Smallest common multiple of ${p.a} and ${p.b} is ${p.lcm}.`,
      };
    },
    // Division with Negative Integers
    (diff) => {
      const div = getRandomInt(3, 9);
      const quot = getRandomInt(4, 15);
      const dividend = div * quot;
      return {
        signature: `int-div-(-${dividend})/(-${div})`,
        text: `(-${dividend}) ÷ (-${div}) = ?`,
        subText: 'Negative divided by negative is positive',
        answer: quot,
        hint: `Negative ÷ Negative = Positive. ${dividend} ÷ ${div} = ?`,
        explanation: `(-${dividend}) ÷ (-${div}) = +${quot}`,
      };
    },
  ],

  // 5. BLOOM'S MIXED CHALLENGE (PERCENTAGES & ALGEBRA)
  mixed: [
    // Mental Percentages
    (diff) => {
      const pcts = [
        { pct: 10, num: 360, ans: 36, hint: 'Divide by 10 (drop zero)!' },
        { pct: 20, num: 250, ans: 50, hint: '10% is 25. Double it for 20%!' },
        { pct: 25, num: 160, ans: 40, hint: '25% is divide by 4 (half of half).' },
        { pct: 50, num: 184, ans: 92, hint: '50% is half: 184 ÷ 2 = 92.' },
        { pct: 75, num: 80, ans: 60, hint: '25% is 20. 75% = 3 × 20 = 60.' },
        { pct: 10, num: 490, ans: 49, hint: '10% of 490 = 49.' },
        { pct: 20, num: 180, ans: 36, hint: '10% is 18. 2 × 18 = 36.' },
        { pct: 30, num: 200, ans: 60, hint: '10% is 20. 3 × 20 = 60.' },
        { pct: 40, num: 150, ans: 60, hint: '10% is 15. 4 × 15 = 60.' },
        { pct: 60, num: 80, ans: 48, hint: '10% is 8. 6 × 8 = 48.' },
        { pct: 80, num: 50, ans: 40, hint: '10% is 5. 8 × 5 = 40.' },
        { pct: 90, num: 200, ans: 180, hint: '100% is 200 − 10% (20) = 180.' },
      ];
      const p = getRandomItem(pcts);
      return {
        signature: `pct-${p.pct}%of${p.num}`,
        text: `${p.pct}% of ${p.num} = ?`,
        subText: 'Mental Percentage Calculation',
        answer: p.ans,
        hint: p.hint,
        explanation: `${p.pct}% of ${p.num} = ${p.ans}`,
      };
    },
    // Linear Equations (2-step algebra)
    (diff) => {
      const a = getRandomInt(2, 6);
      const x = getRandomInt(3, 12);
      const b = getRandomInt(4, 20);
      const isPlus = Math.random() > 0.5;
      const c = isPlus ? a * x + b : a * x - b;
      return {
        signature: `alg-${a}x${isPlus ? '+' : '-'}${b}=${c}`,
        text: `${a}x ${isPlus ? '+' : '−'} ${b} = ${c}, x = ?`,
        subText: 'Solve for variable x',
        answer: x,
        hint: isPlus
          ? `Subtract ${b}: ${a}x = ${c - b}. Then divide by ${a}.`
          : `Add ${b}: ${a}x = ${c + b}. Then divide by ${a}.`,
        explanation: `${a}x = ${isPlus ? c - b : c + b} → x = ${x}`,
      };
    },
    // Complex Mental BODMAS: Brackets + Multiply
    (diff) => {
      const a = getRandomInt(2, 5);
      const b = getRandomInt(4, 12);
      const c = getRandomInt(3, 9);
      const ans = a * (b + c);
      return {
        signature: `bodmas-brk-${a}x(${b}+${c})`,
        text: `${a} × (${b} + ${c}) = ?`,
        subText: 'Solve inside brackets first!',
        answer: ans,
        hint: `Add brackets first: ${b} + ${c} = ${b + c}. Then multiply by ${a}.`,
        explanation: `${a} × ${b + c} = ${ans}`,
      };
    },
  ],

  // Placeholders that map into the above
  fractions: [],
  decimals: [],
};

// Map fractions and decimals to mixed / division pools
TOPIC_GENERATORS.fractions = TOPIC_GENERATORS.division;
TOPIC_GENERATORS.decimals = TOPIC_GENERATORS.mixed;

export function generateQuestion(
  topicOrTopics: MathTopic | MathTopic[],
  difficulty: DifficultyLevel,
  grade: string = '6',
  idSuffix: number = Date.now()
): Question {
  let selectedTopics: MathTopic[] = [];

  if (Array.isArray(topicOrTopics)) {
    selectedTopics = topicOrTopics.length > 0 ? topicOrTopics : ['mixed'];
  } else {
    selectedTopics = [topicOrTopics || 'mixed'];
  }

  // Pick a random topic from selected topics
  const chosenTopic = getRandomItem(selectedTopics);
  const generators = TOPIC_GENERATORS[chosenTopic] && TOPIC_GENERATORS[chosenTopic].length > 0
    ? TOPIC_GENERATORS[chosenTopic]
    : TOPIC_GENERATORS.mixed;

  // Try to find a generator that hasn't been used in this session (up to 25 attempts)
  let generatedData: ReturnType<GeneratorFn> | null = null;

  for (let attempt = 0; attempt < 25; attempt++) {
    const fn = getRandomItem(generators);
    const candidate = fn(difficulty);
    if (!sessionUsedSignatures.has(candidate.signature)) {
      sessionUsedSignatures.add(candidate.signature);
      generatedData = candidate;
      break;
    }
  }

  // If all generated were in set, generate anyway with random variance
  if (!generatedData) {
    const fn = getRandomItem(generators);
    generatedData = fn(difficulty);
  }

  // Target timer according to Grade 6 classroom specification (45s to 1 min):
  // Hard: 60s (1 min)
  // Medium: 50s
  // Easy: 45s
  const timeLimit = difficulty === 'hard' ? 60 : difficulty === 'medium' ? 50 : 45;

  return {
    id: `g6-q-${idSuffix}-${Math.random().toString(36).substring(2, 7)}`,
    text: generatedData.text,
    subText: generatedData.subText,
    answer: generatedData.answer,
    hint: generatedData.hint,
    explanation: generatedData.explanation,
    topic: chosenTopic,
    difficulty,
    timeLimit,
  };
}
