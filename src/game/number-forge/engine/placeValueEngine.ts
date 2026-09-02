import { MathChallenge, PlaceValueKey, GRADE_6_PLACE_SLOTS } from '../types';

export function createDigitHuntChallenge(seedIndex: number): MathChallenge {
  const sampleNumbers = [
    583742,
    749126,
    382504,
    914837,
    625981,
    430752,
  ];
  
  const num = sampleNumbers[seedIndex % sampleNumbers.length];
  const places: PlaceValueKey[] = ['hundredThousands', 'tenThousands', 'thousands', 'hundreds', 'tens', 'ones'];
  
  const targetPlace = places[seedIndex % places.length];
  const slotInfo = GRADE_6_PLACE_SLOTS.find(s => s.key === targetPlace)!;
  
  // Calculate digit value
  const placeMultiplier = slotInfo.multiplier;
  const digitValue = Math.floor((num / placeMultiplier) % 10);
  const fullValue = digitValue * placeMultiplier;

  return {
    id: `digit-hunt-${seedIndex}-${Date.now()}`,
    type: 'digit-hunt',
    bloomLevel: 'remember',
    zone: 'workshop',
    title: 'DIGIT VALUE HUNT',
    question: `Find the value of the digit in the ${slotInfo.label} place in ${num.toLocaleString()}`,
    promptText: `Select the ${slotInfo.label} digit and identify its full value!`,
    targetNumber: num,
    numberString: num.toLocaleString(),
    difficulty: 'foundation',
    points: 100,
    timeLimit: 25,
    structuredDecomposition: {
      placeParts: [{ quantity: digitValue, placeLabel: slotInfo.label }],
      additionParts: [fullValue.toLocaleString()],
      targetDisplay: num.toLocaleString(),
    },
    data: {
      targetPlace,
      targetDigit: digitValue,
      expectedValue: fullValue,
    },
    explanation: `In ${num.toLocaleString()}, the digit in the ${slotInfo.label} place is ${digitValue}, which represents a value of ${fullValue.toLocaleString()} (${digitValue} × ${placeMultiplier.toLocaleString()}).`,
    learningTip: `Each place value to the left is 10 times greater than the place to its right!`,
  };
}

export function createPlaceValueBuilderChallenge(seedIndex: number): MathChallenge {
  const configs = [
    { hTh: 6, tTh: 3, th: 8, h: 4, t: 2, o: 7 },
    { hTh: 9, tTh: 0, th: 5, h: 3, t: 8, o: 1 },
    { hTh: 4, tTh: 7, th: 2, h: 9, t: 0, o: 5 },
    { hTh: 8, tTh: 5, th: 0, h: 6, t: 4, o: 3 },
    { hTh: 5, tTh: 9, th: 4, h: 1, t: 3, o: 8 },
  ];

  const cfg = configs[seedIndex % configs.length];
  const targetNum =
    cfg.hTh * 100000 +
    cfg.tTh * 10000 +
    cfg.th * 1000 +
    cfg.h * 100 +
    cfg.t * 10 +
    cfg.o;

  const slotsRequired: Partial<Record<PlaceValueKey, number>> = {
    hundredThousands: cfg.hTh,
    tenThousands: cfg.tTh,
    thousands: cfg.th,
    hundreds: cfg.h,
    tens: cfg.t,
    ones: cfg.o,
  };

  const placeParts = [
    { quantity: cfg.hTh, placeLabel: 'Hundred Thousands' },
    { quantity: cfg.tTh, placeLabel: 'Ten Thousands' },
    { quantity: cfg.th, placeLabel: 'Thousands' },
    { quantity: cfg.h, placeLabel: 'Hundreds' },
    { quantity: cfg.t, placeLabel: 'Tens' },
    { quantity: cfg.o, placeLabel: 'Ones' },
  ];

  const additionParts = [
    (cfg.hTh * 100000).toLocaleString(),
    `+ ${(cfg.tTh * 10000).toLocaleString()}`,
    `+ ${(cfg.th * 1000).toLocaleString()}`,
    `+ ${(cfg.h * 100).toLocaleString()}`,
    `+ ${(cfg.t * 10).toLocaleString()}`,
    `+ ${cfg.o}`,
  ];

  return {
    id: `pv-builder-${seedIndex}-${Date.now()}`,
    type: 'place-value-builder',
    bloomLevel: 'understand',
    zone: 'tower',
    title: 'PLACE VALUE TOWER BUILDER',
    question: `BUILD THE NUMBER`,
    promptText: `Snap physical number blocks into each place value slot to forge ${targetNum.toLocaleString()}!`,
    targetNumber: targetNum,
    numberString: targetNum.toLocaleString(),
    difficulty: 'core',
    points: 150,
    timeLimit: 35,
    structuredDecomposition: {
      placeParts,
      additionParts,
      targetDisplay: targetNum.toLocaleString(),
    },
    data: {
      slotsRequired,
      expectedValue: targetNum,
    },
    explanation: `Combining ${cfg.hTh * 100000} + ${cfg.tTh * 10000} + ${cfg.th * 1000} + ${cfg.h * 100} + ${cfg.t * 10} + ${cfg.o} creates ${targetNum.toLocaleString()}. Notice how zeroes act as crucial place holders!`,
    learningTip: `Always fill empty slots with 0 to preserve the correct place values.`,
  };
}

export function createExpandedFormChallenge(seedIndex: number): MathChallenge {
  const samples = [
    { num: 472306, parts: [400000, 70000, 2000, 300, 6], breakdown: [{ q: 4, l: 'Hundred Thousands' }, { q: 7, l: 'Ten Thousands' }, { q: 2, l: 'Thousands' }, { q: 3, l: 'Hundreds' }, { q: 0, l: 'Tens' }, { q: 6, l: 'Ones' }] },
    { num: 850492, parts: [800000, 50000, 400, 90, 2], breakdown: [{ q: 8, l: 'Hundred Thousands' }, { q: 5, l: 'Ten Thousands' }, { q: 0, l: 'Thousands' }, { q: 4, l: 'Hundreds' }, { q: 9, l: 'Tens' }, { q: 2, l: 'Ones' }] },
  ];

  const item = samples[seedIndex % samples.length];

  return {
    id: `expanded-form-${seedIndex}-${Date.now()}`,
    type: 'expanded-form',
    bloomLevel: 'understand',
    zone: 'tower',
    title: 'EXPANDED FORM DECOMPOSITION',
    question: `BUILD THE EXPANDED NUMBER`,
    promptText: `Decompose the number into place values!`,
    targetNumber: item.num,
    numberString: item.num.toLocaleString(),
    difficulty: 'core',
    points: 150,
    timeLimit: 30,
    structuredDecomposition: {
      placeParts: item.breakdown.map(b => ({ quantity: b.q, placeLabel: b.l })),
      additionParts: item.parts.map((p, i) => (i === 0 ? p.toLocaleString() : `+ ${p.toLocaleString()}`)),
      targetDisplay: item.num.toLocaleString(),
    },
    data: {
      expectedValue: item.num,
      expandedParts: item.parts,
    },
    explanation: `The expanded form of ${item.num.toLocaleString()} is ${item.parts.join(' + ')}.`,
    learningTip: `Zero place values can be omitted in expanded form, but never in standard form!`,
  };
}

export function createCompareChallenge(seedIndex: number): MathChallenge {
  const pairs: Array<[number, number]> = [
    [584920, 584290],
    [729104, 729140],
    [340892, 340982],
  ];
  const pair = pairs[seedIndex % pairs.length];
  const larger = Math.max(pair[0], pair[1]);

  return {
    id: `compare-${seedIndex}-${Date.now()}`,
    type: 'compare-numbers',
    bloomLevel: 'apply',
    zone: 'workshop',
    title: 'COMPARE NUMBER FORGE',
    question: `BUILD THE GREATER NUMBER`,
    promptText: `Which number is greater?`,
    targetNumber: larger,
    numberString: larger.toLocaleString(),
    difficulty: 'core',
    points: 120,
    timeLimit: 25,
    data: {
      comparePair: pair,
      expectedValue: larger,
    },
    explanation: `Comparing from the highest place value to the right, ${larger.toLocaleString()} is greater.`,
    learningTip: `Compare digits starting from the highest place value on the left!`,
  };
}
