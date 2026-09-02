import { MathChallenge, PlaceValueKey, PLACE_VALUE_SLOTS } from '../types';

export function createDigitHuntChallenge(seedIndex: number): MathChallenge {
  const sampleNumbers = [
    583742,
    749126,
    382504,
    914837,
    625981,
    430752,
    1845920,
    3928174,
  ];
  
  const num = sampleNumbers[seedIndex % sampleNumbers.length];
  const numStr = num.toString();
  const places: PlaceValueKey[] = num > 999999
    ? ['millions', 'hundredThousands', 'tenThousands', 'thousands', 'hundreds', 'tens', 'ones']
    : ['hundredThousands', 'tenThousands', 'thousands', 'hundreds', 'tens', 'ones'];
  
  const targetPlace = places[seedIndex % places.length];
  const slotInfo = PLACE_VALUE_SLOTS.find(s => s.key === targetPlace)!;
  
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
    question: `Look at the forged number ${num.toLocaleString()}. Which digit is in the ${slotInfo.label} place, and what is its full value?`,
    promptText: `Select the ${slotInfo.label} digit and identify its full value!`,
    targetNumber: num,
    numberString: num.toLocaleString(),
    difficulty: num > 999999 ? 'challenge' : 'foundation',
    points: 100,
    timeLimit: 25,
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

  return {
    id: `pv-builder-${seedIndex}-${Date.now()}`,
    type: 'place-value-builder',
    bloomLevel: 'understand',
    zone: 'tower',
    title: 'PLACE VALUE TOWER BUILDER',
    question: `Construct the complete forged number using the place value slots:\n${cfg.hTh} Hundred Thousands + ${cfg.tTh} Ten Thousands + ${cfg.th} Thousands + ${cfg.h} Hundreds + ${cfg.t} Tens + ${cfg.o} Ones`,
    promptText: `Snap physical number blocks into each place value slot to forge ${targetNum.toLocaleString()}!`,
    targetNumber: targetNum,
    numberString: targetNum.toLocaleString(),
    difficulty: 'core',
    points: 150,
    timeLimit: 30,
    data: {
      slotsRequired,
      expectedValue: targetNum,
    },
    explanation: `Combining ${cfg.hTh}00,000 + ${cfg.tTh}0,000 + ${cfg.th},000 + ${cfg.h}00 + ${cfg.t}0 + ${cfg.o} creates ${targetNum.toLocaleString()}. Notice how zeroes act as crucial place holders!`,
    learningTip: `Always fill empty slots with 0 to preserve the correct place values.`,
  };
}

export function createExpandedFormChallenge(seedIndex: number): MathChallenge {
  const samples = [
    { num: 472306, parts: [400000, 70000, 2000, 300, 6] },
    { num: 850492, parts: [800000, 50000, 400, 90, 2] },
    { num: 609280, parts: [600000, 9000, 200, 80] },
    { num: 345019, parts: [300000, 40000, 5000, 10, 9] },
  ];

  const item = samples[seedIndex % samples.length];

  return {
    id: `expanded-form-${seedIndex}-${Date.now()}`,
    type: 'expanded-form',
    bloomLevel: 'understand',
    zone: 'workshop',
    title: 'EXPANDED FORM DECOMPOSER',
    question: `Decompose ${item.num.toLocaleString()} into its expanded mathematical form.`,
    promptText: `Select the complete sum of place values for ${item.num.toLocaleString()}:`,
    targetNumber: item.num,
    numberString: item.num.toLocaleString(),
    difficulty: 'core',
    points: 120,
    timeLimit: 25,
    data: {
      expandedParts: item.parts,
      expectedValue: item.num,
    },
    explanation: `${item.num.toLocaleString()} in expanded form is ${item.parts.map(p => p.toLocaleString()).join(' + ')}. Zero values in places are omitted from the sum!`,
    learningTip: `Expanded form shows the individual value of each non-zero digit added together.`,
  };
}

export function createCompareChallenge(seedIndex: number): MathChallenge {
  const pairs: [number, number][] = [
    [483219, 438921],
    [759402, 759042],
    [921085, 921805],
    [640912, 649012],
    [1580240, 1580420],
  ];

  const [a, b] = pairs[seedIndex % pairs.length];
  const greater = a > b ? a : b;

  return {
    id: `compare-${seedIndex}-${Date.now()}`,
    type: 'compare-numbers',
    bloomLevel: 'apply',
    zone: 'tower',
    title: 'PLACE VALUE COMPARATOR',
    question: `Which forged number is GREATER: ${a.toLocaleString()} or ${b.toLocaleString()}?`,
    promptText: `Inspect digits starting from the highest place value to compare:`,
    difficulty: 'core',
    points: 100,
    timeLimit: 20,
    data: {
      comparePair: [a, b],
      expectedValue: greater,
    },
    explanation: `Comparing from left to right: starting at the highest differing place value shows ${greater.toLocaleString()} is greater than ${(a === greater ? b : a).toLocaleString()}.`,
    learningTip: `Always compare numbers starting from the largest place value on the far left.`,
  };
}
