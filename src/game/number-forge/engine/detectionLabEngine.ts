import { MathChallenge } from '../types';

export function createTruthOrTrapChallenge(seedIndex: number): MathChallenge {
  const claims = [
    {
      statement: '385,721 rounded to the nearest thousand is 385,000.',
      isTrue: false,
      correctReason: 'FALSE: The hundreds digit is 7 (≥ 5), so it rounds up to 386,000, not 385,000.',
    },
    {
      statement: '498,204 rounded to the nearest hundred thousand is 500,000.',
      isTrue: true,
      correctReason: 'TRUE: The ten-thousands digit is 9 (≥ 5), which causes 4 to round up to 5, resulting in 500,000.',
    },
    {
      statement: 'Rounding 649,999 to the nearest thousand gives 650,000.',
      isTrue: true,
      correctReason: 'TRUE: The hundreds digit is 9 (≥ 5), so 649 thousands rounds up to 650 thousands (650,000).',
    },
    {
      statement: 'Rounding 820,450 to the nearest ten thousand gives 830,000.',
      isTrue: false,
      correctReason: 'FALSE: The thousands digit is 0 (< 5), so the ten-thousands digit stays at 820,000.',
    },
  ];

  const item = claims[seedIndex % claims.length];

  return {
    id: `truth-trap-${seedIndex}-${Date.now()}`,
    type: 'truth-or-trap',
    bloomLevel: 'evaluate',
    zone: 'detection-lab',
    title: 'TRUTH OR TRAP // EVALUATION',
    question: `Evaluate the mathematical claim:\n"${item.statement}"\nIs this statement TRUTH or a TRAP?`,
    promptText: `Inspect the rounding decision rule and choose TRUTH or TRAP:`,
    difficulty: 'challenge',
    points: 180,
    timeLimit: 25,
    data: {
      claimStatement: item.statement,
      isClaimTrue: item.isTrue,
      expectedValue: item.isTrue ? 1 : 0,
    },
    explanation: item.correctReason,
    learningTip: `Be careful of chain rounding! Only look at the single digit immediately to the right of your target place.`,
  };
}

export function createWhichStudentIsRightChallenge(seedIndex: number): MathChallenge {
  const disputes = [
    {
      title: 'Rounding 462,781 to nearest thousand',
      studentA: {
        name: 'Inventor Leo',
        statement: '462,781 rounds to 463,000 because the hundreds digit is 7 (which is ≥ 5).',
        isCorrect: true,
      },
      studentB: {
        name: 'Inventor Sam',
        statement: '462,781 rounds to 462,000 because the thousands digit is 2 (which is < 5).',
        isCorrect: false,
      },
      correctName: 'Inventor Leo',
      explanation: 'Leo is correct. When rounding to the nearest thousand, we inspect the HUNDREDS digit (7), not the thousands digit itself.',
    },
    {
      title: 'Comparing 758,200 and 758,090',
      studentA: {
        name: 'Inventor Maya',
        statement: '758,200 is greater because at the hundreds place, 2 is greater than 0.',
        isCorrect: true,
      },
      studentB: {
        name: 'Inventor Zoe',
        statement: '758,090 is greater because 90 is a larger number than 00 at the end.',
        isCorrect: false,
      },
      correctName: 'Inventor Maya',
      explanation: 'Maya is correct. Place value comparison starts from the highest place on the left. The hundreds place takes precedence over the tens place.',
    },
  ];

  const item = disputes[seedIndex % disputes.length];

  return {
    id: `student-dispute-${seedIndex}-${Date.now()}`,
    type: 'which-student-is-right',
    bloomLevel: 'evaluate',
    zone: 'detection-lab',
    title: 'WHICH INVENTOR IS RIGHT?',
    question: `Two inventors in the forge disagree about:\n"${item.title}"\nWho has the mathematically sound reasoning?`,
    promptText: `Select the inventor with the correct mathematical proof:`,
    difficulty: 'challenge',
    points: 200,
    timeLimit: 30,
    data: {
      studentStatements: {
        studentA: item.studentA,
        studentB: item.studentB,
      },
      expectedValue: item.studentA.isCorrect ? 1 : 2,
    },
    explanation: item.explanation,
    learningTip: `In mathematical arguments, valid definitions and place value hierarchy are the keys to proof!`,
  };
}

export function createEstimationShopChallenge(seedIndex: number): MathChallenge {
  const shopOrders = [
    {
      items: [
        { label: 'Brass Screws', quantity: 18742 },
        { label: 'Gear Wheels', quantity: 29631 },
        { label: 'Copper Rivets', quantity: 41286 },
      ],
      roundToText: 'nearest 10,000',
      roundBase: 10000,
      estimates: [20000, 30000, 40000],
      totalEstimate: 90000,
    },
    {
      items: [
        { label: 'Wooden Planks', quantity: 34810 },
        { label: 'Steel Hinges', quantity: 12450 },
        { label: 'Iron Nails', quantity: 51920 },
      ],
      roundToText: 'nearest 10,000',
      roundBase: 10000,
      estimates: [30000, 10000, 50000],
      totalEstimate: 90000,
    },
  ];

  const item = shopOrders[seedIndex % shopOrders.length];

  return {
    id: `estimation-shop-${seedIndex}-${Date.now()}`,
    type: 'estimation-shop',
    bloomLevel: 'apply',
    zone: 'workshop',
    title: 'FORGE INVENTORY ESTIMATION',
    question: `Estimate the total stock of components by rounding each inventory batch to the ${item.roundToText}:\n${item.items.map(i => `• ${i.label}: ${i.quantity.toLocaleString()}`).join('\n')}`,
    promptText: `Round each item and calculate the total estimated inventory sum:`,
    difficulty: 'core',
    points: 150,
    timeLimit: 30,
    data: {
      estimationItems: item.items,
      expectedValue: item.totalEstimate,
    },
    explanation: `Rounding each item to the ${item.roundToText}:\n${item.items.map((it, idx) => `• ${it.label}: ${it.quantity.toLocaleString()} ➔ ${item.estimates[idx].toLocaleString()}`).join('\n')}\nSum: ${item.estimates.map(e => e.toLocaleString()).join(' + ')} = ${item.totalEstimate.toLocaleString()}.`,
    learningTip: `Estimation by rounding allows rapid mental calculations for real-world manufacturing and shopping!`,
  };
}
