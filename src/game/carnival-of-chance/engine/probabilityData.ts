// ============================================================
// THE GREAT CARNIVAL OF CHANCE — Dynamic Probability Challenge Bank
// 100+ Grade 6 Bloom's Taxonomy Mapped Challenges Per Mini-Game (600+ Total)
// Fully dynamic with 3, 4, & 5 Chests, Odds Wheels, Pachinko, Lab, & Builder
// ============================================================

import {
  ActivityId,
  AttractionMeta,
  BloomLevel,
  ChestSetup,
  MathFraction,
  ProbabilityChallenge,
} from '../types';

export const ATTRACTIONS_META: Record<ActivityId, AttractionMeta> = {
  hub: {
    id: 'hub',
    name: 'CARNIVAL ISLAND',
    subtitle: 'The Heart of the Festival',
    tagline: 'Explore • Predict • Discover',
    description: 'Explore the 3D carnival island and operate physical probability machines with your team.',
    accentColor: '#f59e0b',
    islandPosition: [0, 0, 0],
    completed: false,
    unlocked: true,
  },
  'mystery-bag': {
    id: 'mystery-bag',
    name: 'MYSTERY CHESTS',
    subtitle: '3D Treasure Chests Draw Chamber',
    tagline: 'Draw Probability Spheres from Mystery Chests',
    description: 'Genuine 3D treasure chests holding colorful spheres. Calculate exact single & multi-chest probabilities, then watch the winning chest reveal the drawn ball!',
    accentColor: '#b45309',
    islandPosition: [-6.5, 0, -5.5],
    islandScale: [1.2, 1.2, 1.2],
    completed: false,
    unlocked: true,
  },
  'odds-wheel': {
    id: 'odds-wheel',
    name: 'THE ODDS WHEEL',
    subtitle: 'Likelihood & Ratio Spinner',
    tagline: 'Spin the Mechanical Segmented Wheel',
    description: 'Spin the physical segmented wheel to explore certain, likely, unlikely, and impossible outcomes with tactile ratchet clicks.',
    accentColor: '#2563eb',
    islandPosition: [-8.5, 0, 1.5],
    islandScale: [1.1, 1.1, 1.1],
    completed: false,
    unlocked: true,
  },
  'ball-drop': {
    id: 'ball-drop',
    name: 'GIANT BALL DROP',
    subtitle: '2-Container Pachinko Tower',
    tagline: 'Arcade Ricochets & 2 Collector Containers',
    description: 'Drop physical balls down pegboard chutes with arcade ricochets into left and right collector containers.',
    accentColor: '#10b981',
    islandPosition: [6.5, 0, -5.5],
    islandScale: [1.1, 1.1, 1.1],
    completed: false,
    unlocked: true,
  },
  'probability-lab': {
    id: 'probability-lab',
    name: 'THE PROBABILITY LAB',
    subtitle: 'Compound Events Machine',
    tagline: 'Dual-Chamber Multi-Stage Experiments',
    description: 'Analyze multi-stage compound experiments and calculate compound probabilities of independent events.',
    accentColor: '#8b5cf6',
    islandPosition: [8.5, 0, 1.5],
    islandScale: [1.1, 1.1, 1.1],
    completed: false,
    unlocked: true,
  },
  'game-builder': {
    id: 'game-builder',
    name: 'CARNIVAL GAME BUILDER',
    subtitle: 'Fair Game & Expected Value Workshop',
    tagline: 'Design Fair Carnival Booth Games',
    description: 'Evaluate fair vs unfair game mechanics, token payouts, and expected value ratios.',
    accentColor: '#ec4899',
    islandPosition: [-4.0, 0, 7.5],
    islandScale: [1.1, 1.1, 1.1],
    completed: false,
    unlocked: true,
  },
  'grand-carnival': {
    id: 'grand-carnival',
    name: 'GRAND SHOWDOWN',
    subtitle: 'Championship Tournament',
    tagline: 'The Ultimate Probability Grand Finale',
    description: 'Test all probability skills in a high-stakes championship showdown across the carnival.',
    accentColor: '#f59e0b',
    islandPosition: [4.0, 0, 7.5],
    islandScale: [1.3, 1.3, 1.3],
    completed: false,
    unlocked: false,
  },
};

// Helper: Greatest Common Divisor to simplify fractions
const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

const makeFraction = (num: number, den: number): MathFraction => {
  const g = gcd(num, den);
  const sNum = num / g;
  const sDen = den / g;
  const pct = ((num / den) * 100).toFixed(1) + '%';
  const dec = parseFloat((num / den).toFixed(3));
  return {
    numerator: sNum,
    denominator: sDen,
    percentage: pct,
    decimal: dec,
  };
};

const COLOR_PALETTE = [
  { name: 'Red', hex: '#dc2626' },
  { name: 'Blue', hex: '#2563eb' },
  { name: 'Gold', hex: '#f59e0b' },
  { name: 'Green', hex: '#16a34a' },
  { name: 'Purple', hex: '#9333ea' },
  { name: 'Orange', hex: '#ea580c' },
  { name: 'Teal', hex: '#0d9488' },
];

const BLOOM_LEVELS: BloomLevel[] = [
  'remember',
  'understand',
  'apply',
  'analyze',
  'evaluate',
  'create',
];

// ═══════════════════════════════════════════════════════════════
// 1. DYNAMIC GENERATOR: MYSTERY CHESTS (100+ QUESTIONS)
// Supports 3, 4, and 5 Chests dynamically
// ═══════════════════════════════════════════════════════════════
function generateMysteryChestChallenges(count = 110): ProbabilityChallenge[] {
  const list: ProbabilityChallenge[] = [];

  for (let i = 0; i < count; i++) {
    const numChests = i % 3 === 0 ? 3 : i % 3 === 1 ? 4 : 5; // Rotate 3, 4, 5 chests
    const c1 = COLOR_PALETTE[i % COLOR_PALETTE.length];
    const c2 = COLOR_PALETTE[(i + 1) % COLOR_PALETTE.length];
    const c3 = COLOR_PALETTE[(i + 2) % COLOR_PALETTE.length];

    // Generate dynamic chest configs
    const chests: ChestSetup[] = [];
    let totalTargetBalls = 0;
    let totalAllBalls = 0;

    for (let c = 0; c < numChests; c++) {
      const count1 = ((i + c * 2) % 4) + 1; // 1-4 balls
      const count2 = ((i + c + 1) % 3) + 2; // 2-4 balls
      const isTargetChest = c === (i % numChests);

      chests.push({
        id: `chest-${c + 1}`,
        label: `CHEST ${c + 1}`,
        color: c === 0 ? '#92400e' : c === 1 ? '#b45309' : c === 2 ? '#78350f' : c === 3 ? '#a16207' : '#854d0e',
        isTarget: isTargetChest,
        items: [
          { color: c1.hex, colorName: c1.name, count: count1 },
          { color: c2.hex, colorName: c2.name, count: count2 },
        ],
      });

      if (isTargetChest) {
        totalTargetBalls = count1;
        totalAllBalls = count1 + count2;
      }
    }

    const questionType = i % 4;
    let prompt = '';
    let targetNum = totalTargetBalls;
    let targetDen = totalAllBalls;
    let targetColor = c1.hex;
    let explanation = '';
    let missionTitle = '';

    if (questionType === 0) {
      // Single Chest Direct Probability
      missionTitle = `${numChests} CHESTS: SINGLE DRAW`;
      prompt = `There are ${numChests} Mystery Chests on the table. In CHEST ${(i % numChests) + 1}, there are ${totalTargetBalls} ${c1.name.toUpperCase()} balls and ${totalAllBalls - totalTargetBalls} ${c2.name.toUpperCase()} balls (${totalAllBalls} total). What is the probability of drawing a ${c1.name.toUpperCase()} ball from this chest?`;
      targetNum = totalTargetBalls;
      targetDen = totalAllBalls;
      targetColor = c1.hex;
      explanation = `Probability = (Favorable Outcomes) / (Total Outcomes) = ${targetNum}/${targetDen}.`;
    } else if (questionType === 1) {
      // Complementary Event (NOT Event)
      missionTitle = `${numChests} CHESTS: COMPLEMENTARY NOT EVENT`;
      const notCount = totalAllBalls - totalTargetBalls;
      prompt = `In CHEST ${(i % numChests) + 1}, there are ${totalTargetBalls} ${c1.name.toUpperCase()} balls and ${notCount} ${c2.name.toUpperCase()} balls (${totalAllBalls} total). What is the probability of drawing a ball that is NOT ${c1.name.toUpperCase()}?`;
      targetNum = notCount;
      targetDen = totalAllBalls;
      targetColor = c2.hex;
      explanation = `P(NOT ${c1.name}) = 1 - P(${c1.name}) = 1 - ${totalTargetBalls}/${totalAllBalls} = ${targetNum}/${targetDen}.`;
    } else if (questionType === 2) {
      // Chest Selection Probability (1 in N chests)
      missionTitle = `SELECTING FROM ${numChests} CHESTS`;
      prompt = `A player randomly chooses 1 of the ${numChests} distinct Mystery Chests shown on the table. What is the theoretical probability of picking CHEST ${(i % numChests) + 1}?`;
      targetNum = 1;
      targetDen = numChests;
      targetColor = '#f59e0b';
      explanation = `Since each of the ${numChests} chests is equally likely, P(Chest ${(i % numChests) + 1}) = 1/${numChests}.`;
    } else {
      // Two-color sum probability
      missionTitle = `${numChests} CHESTS: COMBINED PROBABILITY`;
      prompt = `CHEST ${(i % numChests) + 1} contains ${totalTargetBalls} ${c1.name.toUpperCase()} balls, ${totalAllBalls - totalTargetBalls} ${c2.name.toUpperCase()} balls, and 1 ${c3.name.toUpperCase()} ball (${totalAllBalls + 1} total). What is the probability of drawing either a ${c1.name.toUpperCase()} OR a ${c2.name.toUpperCase()} ball?`;
      targetNum = totalAllBalls;
      targetDen = totalAllBalls + 1;
      targetColor = c1.hex;
      explanation = `P(${c1.name} OR ${c2.name}) = (${totalTargetBalls} + ${totalAllBalls - totalTargetBalls}) / ${totalAllBalls + 1} = ${targetNum}/${targetDen}.`;
    }

    const correctFrac = makeFraction(targetNum, targetDen);
    const correctChoiceId = `mc-${i}-opt-0`;

    // Distractor fractions
    const d1 = makeFraction(Math.max(1, targetDen - targetNum), targetDen);
    const d2 = makeFraction(Math.min(targetNum + 1, targetDen), targetDen + 1);
    const d3 = makeFraction(1, targetDen);

    const choices = [
      {
        id: correctChoiceId,
        fraction: correctFrac,
        label: `${correctFrac.numerator}/${correctFrac.denominator} (${correctFrac.percentage})`,
        isCorrect: true,
        feedbackText: `Correct! ${explanation}`,
      },
      {
        id: `mc-${i}-opt-1`,
        fraction: d1,
        label: `${d1.numerator}/${d1.denominator} (${d1.percentage})`,
        isCorrect: false,
        feedbackText: `Incorrect. Remember to place favorable outcomes over total outcomes.`,
      },
      {
        id: `mc-${i}-opt-2`,
        fraction: d2,
        label: `${d2.numerator}/${d2.denominator} (${d2.percentage})`,
        isCorrect: false,
        feedbackText: `Incorrect. Make sure not to add extra balls to the denominator.`,
      },
      {
        id: `mc-${i}-opt-3`,
        fraction: d3,
        label: `${d3.numerator}/${d3.denominator} (${d3.percentage})`,
        isCorrect: false,
        feedbackText: `Incorrect. This only accounts for a single item.`,
      },
    ];

    // Shuffle choices deterministically
    const shuffledChoices = [choices[0], choices[1], choices[2], choices[3]].sort(
      (a, b) => ((a.fraction.numerator * 7 + i) % 5) - ((b.fraction.numerator * 7 + i) % 5)
    );

    list.push({
      id: `mystery-chest-${i + 1}`,
      activityId: 'mystery-bag',
      bloomLevel: BLOOM_LEVELS[i % BLOOM_LEVELS.length],
      missionTitle,
      prompt,
      helperNote: `P(Event) = Number of Favorable Outcomes / Total Possible Outcomes`,
      setup: {
        totalItems: targetDen,
        items: chests[i % numChests].items,
        chests,
        targetColor,
        theoreticalFraction: correctFrac,
      },
      choices: shuffledChoices,
      correctAnswerId: correctChoiceId,
      explanation,
      points: 100 + (i % 5) * 10,
      goldTickets: 1,
    });
  }

  return list;
}

// ═══════════════════════════════════════════════════════════════
// 2. DYNAMIC GENERATOR: ODDS WHEEL (100+ QUESTIONS)
// ═══════════════════════════════════════════════════════════════
function generateOddsWheelChallenges(count = 110): ProbabilityChallenge[] {
  const list: ProbabilityChallenge[] = [];

  for (let i = 0; i < count; i++) {
    const totalSectors = i % 4 === 0 ? 8 : i % 4 === 1 ? 10 : i % 4 === 2 ? 12 : 6;
    const qType = i % 5;
    let targetCount = 2;
    let prompt = '';
    let missionTitle = '';
    let explanation = '';
    const color = COLOR_PALETTE[i % COLOR_PALETTE.length];

    if (qType === 0) {
      targetCount = totalSectors / 2; // Even / Odd
      missionTitle = `${totalSectors}-SECTOR WHEEL: EVEN NUMBERS`;
      prompt = `A mechanical carnival wheel is numbered 1 through ${totalSectors}. What is the probability that the pointer lands on an EVEN number?`;
      explanation = `Even numbers from 1 to ${totalSectors} account for exactly half (${targetCount}/${totalSectors} = 1/2) of the sectors.`;
    } else if (qType === 1) {
      targetCount = (i % 3) + 2; // Prime / Multiples
      missionTitle = `${totalSectors}-SECTOR WHEEL: COLOR SECTORS`;
      prompt = `A carnival wheel has ${totalSectors} equal sectors, with exactly ${targetCount} painted ${color.name.toUpperCase()} and the rest WHITE. What is P(${color.name.toUpperCase()})?`;
      explanation = `P(${color.name}) = ${targetCount} / ${totalSectors}.`;
    } else if (qType === 2) {
      targetCount = Math.floor(totalSectors / 3); // Multiples of 3
      missionTitle = `${totalSectors}-SECTOR WHEEL: MULTIPLES OF 3`;
      prompt = `On a wheel numbered 1 to ${totalSectors}, what is the probability of spinning a MULTIPLE OF 3?`;
      explanation = `Multiples of 3 up to ${totalSectors} give ${targetCount} favorable sectors out of ${totalSectors}.`;
    } else if (qType === 3) {
      targetCount = totalSectors - 2; // Probability > X
      missionTitle = `${totalSectors}-SECTOR WHEEL: NUMBER GREATER THAN 2`;
      prompt = `A wheel has ${totalSectors} numbered sectors (1 to ${totalSectors}). What is the probability of landing on a number GREATER THAN 2?`;
      explanation = `Numbers 3 through ${totalSectors} represent ${targetCount} out of ${totalSectors} sectors.`;
    } else {
      targetCount = 1; // Single sector jackpot
      missionTitle = `${totalSectors}-SECTOR WHEEL: GOLDEN JACKPOT`;
      prompt = `A wheel has ${totalSectors} sectors, with exactly 1 GOLDEN JACKPOT sector. What is the theoretical probability of winning the jackpot in 1 spin?`;
      explanation = `1 jackpot sector out of ${totalSectors} equal sectors = 1/${totalSectors}.`;
    }

    const correctFrac = makeFraction(targetCount, totalSectors);
    const correctId = `ow-${i}-opt-0`;

    const choices = [
      {
        id: correctId,
        fraction: correctFrac,
        label: `${correctFrac.numerator}/${correctFrac.denominator} (${correctFrac.percentage})`,
        isCorrect: true,
        feedbackText: `Correct! ${explanation}`,
      },
      {
        id: `ow-${i}-opt-1`,
        fraction: makeFraction(Math.max(1, totalSectors - targetCount), totalSectors),
        label: `${totalSectors - targetCount}/${totalSectors}`,
        isCorrect: false,
        feedbackText: `Incorrect. This is the complementary probability.`,
      },
      {
        id: `ow-${i}-opt-2`,
        fraction: makeFraction(1, totalSectors),
        label: `1/${totalSectors}`,
        isCorrect: false,
        feedbackText: `Incorrect. Multiple sectors satisfy this condition.`,
      },
      {
        id: `ow-${i}-opt-3`,
        fraction: makeFraction(Math.min(targetCount + 1, totalSectors), totalSectors),
        label: `${targetCount + 1}/${totalSectors}`,
        isCorrect: false,
        feedbackText: `Incorrect. Double-check your count of matching sectors.`,
      },
    ];

    list.push({
      id: `odds-wheel-${i + 1}`,
      activityId: 'odds-wheel',
      bloomLevel: BLOOM_LEVELS[i % BLOOM_LEVELS.length],
      missionTitle,
      prompt,
      helperNote: `P(Sector) = Favorable Sectors / Total Sectors (${totalSectors})`,
      setup: {
        totalItems: totalSectors,
        items: [
          { color: color.hex, colorName: color.name, count: targetCount },
          { color: '#ffffff', colorName: 'White', count: totalSectors - targetCount },
        ],
        targetColor: color.hex,
        theoreticalFraction: correctFrac,
      },
      choices: choices.sort((a, b) => a.fraction.numerator - b.fraction.numerator),
      correctAnswerId: correctId,
      explanation,
      points: 100 + (i % 4) * 15,
      goldTickets: 1,
    });
  }

  return list;
}

// ═══════════════════════════════════════════════════════════════
// 3. DYNAMIC GENERATOR: GIANT BALL DROP (100+ QUESTIONS)
// ═══════════════════════════════════════════════════════════════
function generateBallDropChallenges(count = 110): ProbabilityChallenge[] {
  const list: ProbabilityChallenge[] = [];

  for (let i = 0; i < count; i++) {
    const totalBalls = ((i % 5) + 3) * 2; // 6, 8, 10, 12, 14 balls
    const greenCount = ((i * 2) % (totalBalls - 2)) + 2;
    const redCount = totalBalls - greenCount;

    const correctFrac = makeFraction(greenCount, totalBalls);
    const correctId = `bd-${i}-opt-0`;

    const prompt = `The Pachinko Hopper contains ${greenCount} GREEN balls and ${redCount} RED balls (${totalBalls} total). If 1 ball drops through the pegboard, what is the probability it lands in the RIGHT CONTAINER (Green)?`;
    const explanation = `P(Right Container / Green) = ${greenCount}/${totalBalls} = ${correctFrac.numerator}/${correctFrac.denominator} (${correctFrac.percentage}).`;

    const choices = [
      {
        id: correctId,
        fraction: correctFrac,
        label: `${correctFrac.numerator}/${correctFrac.denominator} (${correctFrac.percentage})`,
        isCorrect: true,
        feedbackText: `Correct! ${explanation}`,
      },
      {
        id: `bd-${i}-opt-1`,
        fraction: makeFraction(redCount, totalBalls),
        label: `${redCount}/${totalBalls}`,
        isCorrect: false,
        feedbackText: `Incorrect. This is the probability of the Left Container (Red).`,
      },
      {
        id: `bd-${i}-opt-2`,
        fraction: makeFraction(1, totalBalls),
        label: `1/${totalBalls}`,
        isCorrect: false,
        feedbackText: `Incorrect. There are multiple green balls in the hopper.`,
      },
      {
        id: `bd-${i}-opt-3`,
        fraction: makeFraction(greenCount, greenCount + 1),
        label: `${greenCount}/${greenCount + 1}`,
        isCorrect: false,
        feedbackText: `Incorrect. Total outcomes must equal total balls in the hopper.`,
      },
    ];

    list.push({
      id: `ball-drop-${i + 1}`,
      activityId: 'ball-drop',
      bloomLevel: BLOOM_LEVELS[i % BLOOM_LEVELS.length],
      missionTitle: `PACHINKO DROP #${i + 1}`,
      prompt,
      helperNote: `P(Right Bucket) = Green Balls / Total Balls in Hopper`,
      setup: {
        totalItems: totalBalls,
        items: [
          { color: '#10b981', colorName: 'Green', count: greenCount },
          { color: '#ef4444', colorName: 'Red', count: redCount },
        ],
        targetColor: '#10b981',
        theoreticalFraction: correctFrac,
      },
      choices: choices.sort((a, b) => a.fraction.numerator - b.fraction.numerator),
      correctAnswerId: correctId,
      explanation,
      points: 100 + (i % 4) * 15,
      goldTickets: 1,
    });
  }

  return list;
}

// ═══════════════════════════════════════════════════════════════
// 4. DYNAMIC GENERATOR: PROBABILITY LAB (100+ QUESTIONS)
// ═══════════════════════════════════════════════════════════════
function generateProbabilityLabChallenges(count = 110): ProbabilityChallenge[] {
  const list: ProbabilityChallenge[] = [];

  for (let i = 0; i < count; i++) {
    const den1 = (i % 3) + 2; // 2, 3, 4
    const den2 = ((i + 1) % 3) + 2; // 2, 3, 4
    const totalOutcomes = den1 * den2; // Compound outcomes

    const correctFrac = makeFraction(1, totalOutcomes);
    const correctId = `pl-${i}-opt-0`;

    const prompt = `In the science chamber, Flask A has a 1/${den1} chance of success and Flask B has a 1/${den2} chance of success. What is the probability that BOTH independent chambers succeed simultaneously (P(A and B))?`;
    const explanation = `For independent compound events: P(A and B) = P(A) × P(B) = (1/${den1}) × (1/${den2}) = 1/${totalOutcomes} (${correctFrac.percentage}).`;

    const choices = [
      {
        id: correctId,
        fraction: correctFrac,
        label: `1/${totalOutcomes} (${correctFrac.percentage})`,
        isCorrect: true,
        feedbackText: `Correct! ${explanation}`,
      },
      {
        id: `pl-${i}-opt-1`,
        fraction: makeFraction(1, den1 + den2),
        label: `1/${den1 + den2}`,
        isCorrect: false,
        feedbackText: `Incorrect. Compound probabilities multiply denominators, not add them.`,
      },
      {
        id: `pl-${i}-opt-2`,
        fraction: makeFraction(2, totalOutcomes),
        label: `2/${totalOutcomes}`,
        isCorrect: false,
        feedbackText: `Incorrect.`,
      },
      {
        id: `pl-${i}-opt-3`,
        fraction: makeFraction(1, den1),
        label: `1/${den1}`,
        isCorrect: false,
        feedbackText: `Incorrect. You must account for both flasks.`,
      },
    ];

    list.push({
      id: `probability-lab-${i + 1}`,
      activityId: 'probability-lab',
      bloomLevel: BLOOM_LEVELS[i % BLOOM_LEVELS.length],
      missionTitle: `COMPOUND CHAMBER #${i + 1}`,
      prompt,
      helperNote: `P(A and B) = P(A) × P(B)`,
      setup: {
        totalItems: totalOutcomes,
        items: [
          { color: '#8b5cf6', colorName: 'Purple', count: 1 },
          { color: '#38bdf8', colorName: 'Blue', count: totalOutcomes - 1 },
        ],
        targetColor: '#8b5cf6',
        theoreticalFraction: correctFrac,
      },
      choices: choices.sort((a, b) => a.fraction.denominator - b.fraction.denominator),
      correctAnswerId: correctId,
      explanation,
      points: 120 + (i % 5) * 10,
      goldTickets: 1,
    });
  }

  return list;
}

// ═══════════════════════════════════════════════════════════════
// 5. DYNAMIC GENERATOR: GAME BUILDER (100+ QUESTIONS)
// ═══════════════════════════════════════════════════════════════
function generateGameBuilderChallenges(count = 110): ProbabilityChallenge[] {
  const list: ProbabilityChallenge[] = [];

  for (let i = 0; i < count; i++) {
    const totalSlots = (i % 4) + 6; // 6 to 9 slots
    const winSlots = Math.floor(totalSlots / 2);
    const isFair = totalSlots % 2 === 0 && winSlots * 2 === totalSlots;

    const correctFrac = makeFraction(winSlots, totalSlots);
    const correctId = `gb-${i}-opt-0`;

    const prompt = `A carnival booth designer builds a game with ${totalSlots} equal token slots: ${winSlots} WIN slots and ${totalSlots - winSlots} LOSE slots. What is the exact winning probability?`;
    const explanation = `P(Win) = ${winSlots} / ${totalSlots} = ${correctFrac.numerator}/${correctFrac.denominator} (${correctFrac.percentage}).`;

    const choices = [
      {
        id: correctId,
        fraction: correctFrac,
        label: `${correctFrac.numerator}/${correctFrac.denominator} (${correctFrac.percentage})`,
        isCorrect: true,
        feedbackText: `Correct! ${explanation}`,
      },
      {
        id: `gb-${i}-opt-1`,
        fraction: makeFraction(totalSlots - winSlots, totalSlots),
        label: `${totalSlots - winSlots}/${totalSlots}`,
        isCorrect: false,
        feedbackText: `Incorrect. This is the losing probability.`,
      },
      {
        id: `gb-${i}-opt-2`,
        fraction: makeFraction(1, totalSlots),
        label: `1/${totalSlots}`,
        isCorrect: false,
        feedbackText: `Incorrect. There are ${winSlots} winning slots.`,
      },
      {
        id: `gb-${i}-opt-3`,
        fraction: makeFraction(1, 2),
        label: `1/2 (50.0%)`,
        isCorrect: isFair,
        feedbackText: isFair ? `Correct!` : `Incorrect. Total slots is not an even 50/50 split.`,
      },
    ];

    list.push({
      id: `game-builder-${i + 1}`,
      activityId: 'game-builder',
      bloomLevel: BLOOM_LEVELS[i % BLOOM_LEVELS.length],
      missionTitle: `BOOTH DESIGN #${i + 1}`,
      prompt,
      helperNote: `P(Win) = Win Slots / Total Slots (${totalSlots})`,
      setup: {
        totalItems: totalSlots,
        items: [
          { color: '#10b981', colorName: 'Win', count: winSlots },
          { color: '#ef4444', colorName: 'Loss', count: totalSlots - winSlots },
        ],
        targetColor: '#10b981',
        theoreticalFraction: correctFrac,
      },
      choices: choices.sort((a, b) => a.fraction.numerator - b.fraction.numerator),
      correctAnswerId: correctId,
      explanation,
      points: 110 + (i % 4) * 15,
      goldTickets: 1,
    });
  }

  return list;
}

// ═══════════════════════════════════════════════════════════════
// 6. DYNAMIC GENERATOR: GRAND CARNIVAL SHOWDOWN (100+ QUESTIONS)
// ═══════════════════════════════════════════════════════════════
function generateGrandCarnivalChallenges(count = 110): ProbabilityChallenge[] {
  const list: ProbabilityChallenge[] = [];

  for (let i = 0; i < count; i++) {
    const totalOutcomes = (i % 6) + 10; // 10 to 15 outcomes
    const targetA = (i % 4) + 3;
    const targetB = (i % 3) + 2;
    const totalTarget = targetA + targetB;

    const correctFrac = makeFraction(totalTarget, totalOutcomes);
    const correctId = `gc-${i}-opt-0`;

    const prompt = `CHAMPIONSHIP ROUND #${i + 1}: A tournament prize vault holds ${targetA} Gold Tokens, ${targetB} Diamond Tokens, and ${totalOutcomes - totalTarget} Silver Tokens (${totalOutcomes} total). What is the probability of drawing either a GOLD OR DIAMOND token?`;
    const explanation = `P(Gold OR Diamond) = (${targetA} + ${targetB}) / ${totalOutcomes} = ${totalTarget}/${totalOutcomes} = ${correctFrac.numerator}/${correctFrac.denominator} (${correctFrac.percentage}).`;

    const choices = [
      {
        id: correctId,
        fraction: correctFrac,
        label: `${correctFrac.numerator}/${correctFrac.denominator} (${correctFrac.percentage})`,
        isCorrect: true,
        feedbackText: `Correct! ${explanation}`,
      },
      {
        id: `gc-${i}-opt-1`,
        fraction: makeFraction(targetA, totalOutcomes),
        label: `${targetA}/${totalOutcomes}`,
        isCorrect: false,
        feedbackText: `Incorrect. You must also include the diamond tokens.`,
      },
      {
        id: `gc-${i}-opt-2`,
        fraction: makeFraction(totalOutcomes - totalTarget, totalOutcomes),
        label: `${totalOutcomes - totalTarget}/${totalOutcomes}`,
        isCorrect: false,
        feedbackText: `Incorrect. This is the silver token probability.`,
      },
      {
        id: `gc-${i}-opt-3`,
        fraction: makeFraction(1, totalOutcomes),
        label: `1/${totalOutcomes}`,
        isCorrect: false,
        feedbackText: `Incorrect. Multiple prize tokens qualify.`,
      },
    ];

    list.push({
      id: `grand-carnival-${i + 1}`,
      activityId: 'grand-carnival',
      bloomLevel: BLOOM_LEVELS[i % BLOOM_LEVELS.length],
      missionTitle: `GRAND TOURNAMENT #${i + 1}`,
      prompt,
      helperNote: `P(A or B) = (Count A + Count B) / Total`,
      setup: {
        totalItems: totalOutcomes,
        items: [
          { color: '#f59e0b', colorName: 'Gold', count: targetA },
          { color: '#38bdf8', colorName: 'Diamond', count: targetB },
          { color: '#94a3b8', colorName: 'Silver', count: totalOutcomes - totalTarget },
        ],
        targetColor: '#f59e0b',
        theoreticalFraction: correctFrac,
      },
      choices: choices.sort((a, b) => a.fraction.numerator - b.fraction.numerator),
      correctAnswerId: correctId,
      explanation,
      points: 150 + (i % 5) * 10,
      goldTickets: 2,
    });
  }

  return list;
}

// ═══════════════════════════════════════════════════════════════
// EXPORTED COMPREHENSIVE CHALLENGE BANK (100+ QUESTIONS PER GAME)
// ═══════════════════════════════════════════════════════════════
export const CARNIVAL_CHALLENGES: Record<ActivityId, ProbabilityChallenge[]> = {
  hub: [],
  'mystery-bag': generateMysteryChestChallenges(110),
  'odds-wheel': generateOddsWheelChallenges(110),
  'ball-drop': generateBallDropChallenges(110),
  'probability-lab': generateProbabilityLabChallenges(110),
  'game-builder': generateGameBuilderChallenges(110),
  'grand-carnival': generateGrandCarnivalChallenges(110),
};
