import { MathChallenge } from '../types';

export function createRoundingTrackChallenge(seedIndex: number): MathChallenge {
  const cases = [
    { num: 583742, roundBase: 1000, baseName: 'nearest 1,000 (thousand)', lower: 583000, mid: 583500, upper: 584000, answer: 584000 },
    { num: 476281, roundBase: 10000, baseName: 'nearest 10,000 (ten thousand)', lower: 470000, mid: 475000, upper: 480000, answer: 480000 },
    { num: 624890, roundBase: 10000, baseName: 'nearest 10,000 (ten thousand)', lower: 620000, mid: 625000, upper: 630000, answer: 620000 },
    { num: 839450, roundBase: 100000, baseName: 'nearest 100,000 (hundred thousand)', lower: 800000, mid: 850000, upper: 900000, answer: 800000 },
    { num: 295610, roundBase: 10000, baseName: 'nearest 10,000 (ten thousand)', lower: 290000, mid: 295000, upper: 300000, answer: 300000 },
  ];

  const item = cases[seedIndex % cases.length];

  return {
    id: `rounding-track-${seedIndex}-${Date.now()}`,
    type: 'rounding-track',
    bloomLevel: 'apply',
    zone: 'rounding-track',
    title: 'ROUNDING TRACK MECHANISM',
    question: `Round ${item.num.toLocaleString()} to the ${item.baseName}.\nObserve the benchmark track: ${item.lower.toLocaleString()} ⟵ [Midpoint: ${item.mid.toLocaleString()}] ⟶ ${item.upper.toLocaleString()}`,
    promptText: `Move the magnetic number along the calibrated track toward its nearest benchmark!`,
    targetNumber: item.num,
    numberString: item.num.toLocaleString(),
    difficulty: 'core',
    points: 150,
    timeLimit: 25,
    data: {
      roundingBase: item.roundBase,
      benchmarkPegs: [item.lower, item.mid, item.upper],
      nearestBenchmark: item.answer,
      expectedValue: item.answer,
    },
    explanation: `Since ${item.num.toLocaleString()} is ${item.num >= item.mid ? 'greater than or equal to' : 'less than'} the midpoint ${item.mid.toLocaleString()}, it rounds ${item.num >= item.mid ? 'UP' : 'DOWN'} to ${item.answer.toLocaleString()}.`,
    learningTip: `Look at the decision digit immediately to the right of the rounding place. 5 or more rounds UP, 4 or less rounds DOWN!`,
  };
}

export function createRoundingDetectiveChallenge(seedIndex: number): MathChallenge {
  const cases = [
    { original: 583742, rounded: 580000, correctPlaceName: 'nearest 10,000', placeValueNum: 10000 },
    { original: 472851, rounded: 473000, correctPlaceName: 'nearest 1,000', placeValueNum: 1000 },
    { original: 894120, rounded: 900000, correctPlaceName: 'nearest 100,000', placeValueNum: 100000 },
    { original: 638420, rounded: 638400, correctPlaceName: 'nearest 100', placeValueNum: 100 },
    { original: 719650, rounded: 720000, correctPlaceName: 'nearest 10,000', placeValueNum: 10000 },
  ];

  const item = cases[seedIndex % cases.length];

  return {
    id: `detective-${seedIndex}-${Date.now()}`,
    type: 'rounding-detective',
    bloomLevel: 'analyze',
    zone: 'detection-lab',
    title: 'ROUNDING DETECTIVE LAB',
    question: `An apprentice forged ${item.original.toLocaleString()} and rounded it to ${item.rounded.toLocaleString()}.\nTo what place value was this number rounded?`,
    promptText: `Identify the place value benchmark used by analyzing the trailing zeroes!`,
    targetNumber: item.original,
    numberString: `${item.original.toLocaleString()} ➔ ${item.rounded.toLocaleString()}`,
    difficulty: 'core',
    points: 180,
    timeLimit: 25,
    data: {
      expectedValue: item.placeValueNum,
      roundingOptions: [100, 1000, 10000, 100000],
    },
    explanation: `Because ${item.rounded.toLocaleString()} has all zeroes from the thousands place rightward and the ten-thousands digit (8) was maintained, the number was rounded to the ${item.correctPlaceName}.`,
    learningTip: `Count the zeroes and check which digit changed or determined the cutoff point.`,
  };
}

export function createFindMistakeChallenge(seedIndex: number): MathChallenge {
  const cases = [
    {
      num: 72649,
      baseText: 'nearest thousand',
      incorrect: 72000,
      correct: 73000,
      mistakenDigit: 6,
      reason: 'The hundreds digit is 6 (which is ≥ 5), so the thousands digit must round UP to 73,000, not down to 72,000.',
    },
    {
      num: 485120,
      baseText: 'nearest ten thousand',
      incorrect: 480000,
      correct: 490000,
      mistakenDigit: 5,
      reason: 'The thousands digit is 5 (which is ≥ 5), so the ten thousands digit rounds UP to 490,000.',
    },
    {
      num: 319482,
      baseText: 'nearest hundred thousand',
      incorrect: 400000,
      correct: 300000,
      mistakenDigit: 1,
      reason: 'The ten thousands digit is 1 (which is < 5), so the hundred thousands digit stays at 300,000.',
    },
  ];

  const item = cases[seedIndex % cases.length];

  return {
    id: `find-mistake-${seedIndex}-${Date.now()}`,
    type: 'find-the-mistake',
    bloomLevel: 'analyze',
    zone: 'detection-lab',
    title: 'ERROR ANALYSIS // SPOT THE FLAW',
    question: `A forge machine printed this claim:\n"${item.num.toLocaleString()} rounded to the ${item.baseText} is ${item.incorrect.toLocaleString()}."\nSpot the mistake and calibrate the machine to the correct rounded value!`,
    promptText: `Find the flaw in the decision digit and submit the verified value:`,
    targetNumber: item.num,
    numberString: item.num.toLocaleString(),
    difficulty: 'challenge',
    points: 200,
    timeLimit: 30,
    data: {
      mistakeContext: {
        givenNumber: item.num,
        incorrectRound: item.incorrect,
        correctRound: item.correct,
        mistakenDigit: item.mistakenDigit,
        reason: item.reason,
      },
      expectedValue: item.correct,
    },
    explanation: item.reason,
    learningTip: `Remember: 0, 1, 2, 3, 4 stay down. 5, 6, 7, 8, 9 round UP!`,
  };
}
