// ============================================================
// THE GREAT CARNIVAL OF CHANCE — Dynamic Question Generation Engine
// 100% Grade 6 Probability Curriculum:
// - Small in length, concise, crisp, and direct (15-25 words max)
// - Simple Event Probabilities, Complementary (NOT) Events, Spinners & Ratios
// - 100+ Procedurally Generated Challenges per Attraction
// ============================================================

import {
  ActivityId,
  AttractionMeta,
  BloomLevel,
  ChestSetup,
  MathFraction,
  ProbabilityChallenge,
} from '../types';

// ── Color Utilities & Palette ──
export const COLOR_PALETTE = [
  { name: 'Red', hex: '#EF4444' },
  { name: 'Blue', hex: '#3B82F6' },
  { name: 'Green', hex: '#10B981' },
  { name: 'Yellow', hex: '#F59E0B' },
  { name: 'Purple', hex: '#8B5CF6' },
  { name: 'Orange', hex: '#F97316' },
  { name: 'Gold', hex: '#EAB308' },
];

export const BLOOM_LEVELS: BloomLevel[] = [
  'remember',
  'understand',
  'apply',
  'analyze',
  'evaluate',
];

// Helper: Greatest Common Divisor for Simplest Fractions
export function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

// Helper: Build standard MathFraction object
export function makeFraction(num: number, den: number): MathFraction {
  const g = gcd(Math.abs(num), Math.abs(den)) || 1;
  const simplifiedNum = num / g;
  const simplifiedDen = den / g;
  const decimal = den !== 0 ? num / den : 0;
  const percentage = `${(decimal * 100).toFixed(1)}%`;

  return {
    numerator: num,
    denominator: den,
    simplifiedNumerator: simplifiedNum,
    simplifiedDenominator: simplifiedDen,
    decimal,
    percentage,
  };
}

// ── Attraction Metadata ──
export const ATTRACTIONS_META: Record<ActivityId, AttractionMeta> = {
  hub: {
    id: 'hub',
    name: 'CARNIVAL ISLAND',
    subtitle: 'Central Plaza & Ticket Pavilion',
    tagline: 'Step Right Up to the World of Chance!',
    description: 'Explore 5 probability pavilions, earn Gold Tickets, and master Grade 6 probability.',
    accentColor: '#FED500',
    islandPosition: [0, 0, 0],
    unlocked: true,
    completed: false,
  },
  'mystery-bag': {
    id: 'mystery-bag',
    name: 'THE MYSTERY CHESTS',
    subtitle: 'Minecraft Chests & Ball Draws',
    tagline: 'Pick the Chest & Draw the Ball',
    description: 'Calculate single-event and complementary probabilities from authentic Minecraft-style treasure chests.',
    accentColor: '#92400E',
    islandPosition: [-6, 0.4, 3],
    unlocked: true,
    completed: false,
  },
  'odds-wheel': {
    id: 'odds-wheel',
    name: 'THE ODDS WHEEL',
    subtitle: 'Prize Spinner Wheel',
    tagline: 'Spin the Radial Sectors & Predict Odds',
    description: 'Predict probability on numbered and color-coded spinning wheels.',
    accentColor: '#FF2A6D',
    islandPosition: [6, 0.4, 3],
    unlocked: true,
    completed: false,
  },
  'ball-drop': {
    id: 'ball-drop',
    name: 'THE HIGH STRIKER',
    subtitle: 'Hammer & Bell Tower',
    tagline: 'Slam the Sledgehammer & Ring the Bell',
    description: 'Swing the carnival sledgehammer, launch the puck up the tower, and calculate winning slot odds.',
    accentColor: '#2463EB',
    islandPosition: [-4, 0.4, -4],
    unlocked: true,
    completed: false,
  },
  'probability-lab': {
    id: 'probability-lab',
    name: 'PROBABILITY LAB',
    subtitle: 'Steampunk Reaction Vessel',
    tagline: 'Centrifuge & Crystal Token Mixer',
    description: 'Synthesize plasma reactions by predicting probabilities of crystal tokens and color vials.',
    accentColor: '#10B981',
    islandPosition: [4, 0.4, -4],
    unlocked: true,
    completed: false,
  },
  'game-builder': {
    id: 'game-builder',
    name: 'CARNIVAL BUILDER',
    subtitle: 'Booth Token Calibrator',
    tagline: 'Test Probability & Fair Payoffs',
    description: 'Calculate fair and winning probabilities for carnival booth games.',
    accentColor: '#8B5CF6',
    islandPosition: [0, 0.4, -6],
    unlocked: true,
    completed: false,
  },
  'grand-carnival': {
    id: 'grand-carnival',
    name: 'CHAMPIONSHIP VAULT',
    subtitle: 'Grand Finale Prize Vault',
    tagline: 'Crack the Dial & Win the Grand Jackpot',
    description: 'Compete in the championship arena, crack the combination vault, and claim ultimate victory.',
    accentColor: '#F59E0B',
    islandPosition: [0, 0.8, 0],
    unlocked: true,
    completed: false,
  },
};

// ═══════════════════════════════════════════════════════════════
// 1. DYNAMIC GENERATOR: MYSTERY CHESTS (100+ CONCISE QUESTIONS)
// ═══════════════════════════════════════════════════════════════
function generateMysteryBagChallenges(count = 110): ProbabilityChallenge[] {
  const list: ProbabilityChallenge[] = [];

  for (let i = 0; i < count; i++) {
    const numChests = (i % 3) + 3; // 3, 4, or 5 chests
    const targetChestNum = (i % numChests) + 1;
    const c1 = COLOR_PALETTE[i % COLOR_PALETTE.length];
    const c2 = COLOR_PALETTE[(i + 2) % COLOR_PALETTE.length];

    const chests: ChestSetup[] = [];
    let targetBalls = 0;
    let totalInChest = 0;

    for (let c = 0; c < numChests; c++) {
      const count1 = ((i + c * 2) % 4) + 1; // 1-4 balls
      const count2 = ((i + c + 1) % 3) + 2; // 2-4 balls
      const isTarget = c === (i % numChests);

      chests.push({
        id: `chest-${c + 1}`,
        label: `CHEST ${c + 1}`,
        color: c === 0 ? '#92400e' : c === 1 ? '#b45309' : c === 2 ? '#78350f' : c === 3 ? '#a16207' : '#854d0e',
        isTarget,
        items: [
          { color: c1.hex, colorName: c1.name, count: count1 },
          { color: c2.hex, colorName: c2.name, count: count2 },
        ],
      });

      if (isTarget) {
        targetBalls = count1;
        totalInChest = count1 + count2;
      }
    }

    const qType = i % 4;
    let prompt = '';
    let targetNum = targetBalls;
    let targetDen = totalInChest;
    let targetColor = c1.hex;
    let explanation = '';
    let missionTitle = '';

    if (qType === 0) {
      // Direct Single Event
      missionTitle = `CHEST ${targetChestNum}: P(${c1.name.toUpperCase()})`;
      prompt = `Chest ${targetChestNum} holds ${targetBalls} ${c1.name} and ${totalInChest - targetBalls} ${c2.name} balls (${totalInChest} total). What is P(${c1.name})?`;
      targetNum = targetBalls;
      targetDen = totalInChest;
      targetColor = c1.hex;
      explanation = `P(${c1.name}) = ${targetNum}/${targetDen}.`;
    } else if (qType === 1) {
      // Complementary NOT event
      missionTitle = `CHEST ${targetChestNum}: P(NOT ${c1.name.toUpperCase()})`;
      const notCount = totalInChest - targetBalls;
      prompt = `Chest ${targetChestNum} holds ${targetBalls} ${c1.name} and ${notCount} ${c2.name} balls (${totalInChest} total). What is P(NOT ${c1.name})?`;
      targetNum = notCount;
      targetDen = totalInChest;
      targetColor = c2.hex;
      explanation = `P(NOT ${c1.name}) = ${targetNum}/${targetDen}.`;
    } else if (qType === 2) {
      // Choosing a chest
      missionTitle = `SELECTING FROM ${numChests} CHESTS`;
      prompt = `There are ${numChests} closed chests on the table. What is the probability of picking Chest ${targetChestNum}?`;
      targetNum = 1;
      targetDen = numChests;
      targetColor = '#f59e0b';
      explanation = `P(Chest ${targetChestNum}) = 1/${numChests}.`;
    } else {
      // Two-ball either/or
      missionTitle = `CHEST ${targetChestNum}: P(${c1.name.toUpperCase()} OR ${c2.name.toUpperCase()})`;
      const otherColorCount = 1;
      const totalPlusOne = totalInChest + otherColorCount;
      prompt = `Chest ${targetChestNum} has ${targetBalls} ${c1.name}, ${totalInChest - targetBalls} ${c2.name}, and 1 Gold ball (${totalPlusOne} total). What is P(${c1.name} or ${c2.name})?`;
      targetNum = totalInChest;
      targetDen = totalPlusOne;
      targetColor = c1.hex;
      explanation = `P(${c1.name} or ${c2.name}) = ${targetNum}/${targetDen}.`;
    }

    const correctFrac = makeFraction(targetNum, targetDen);
    const correctId = `mc-${i}-opt-0`;

    const d1 = makeFraction(Math.max(1, targetDen - targetNum), targetDen);
    const d2 = makeFraction(Math.min(targetNum + 1, targetDen), targetDen + 1);
    const d3 = makeFraction(1, targetDen);

    const choices = [
      {
        id: correctId,
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
        feedbackText: `Incorrect. Favorable outcomes over total outcomes.`,
      },
      {
        id: `mc-${i}-opt-2`,
        fraction: d2,
        label: `${d2.numerator}/${d2.denominator} (${d2.percentage})`,
        isCorrect: false,
        feedbackText: `Incorrect. Check the total number of balls.`,
      },
      {
        id: `mc-${i}-opt-3`,
        fraction: d3,
        label: `${d3.numerator}/${d3.denominator} (${d3.percentage})`,
        isCorrect: false,
        feedbackText: `Incorrect. Multiple balls match the target.`,
      },
    ];

    const shuffledChoices = [choices[0], choices[1], choices[2], choices[3]].sort(
      (a, b) => ((a.fraction.numerator * 7 + i) % 5) - ((b.fraction.numerator * 7 + i) % 5)
    );

    list.push({
      id: `mystery-chest-${i + 1}`,
      activityId: 'mystery-bag',
      bloomLevel: BLOOM_LEVELS[i % BLOOM_LEVELS.length],
      missionTitle,
      prompt,
      helperNote: `P(Event) = Favorable / Total`,
      setup: {
        totalItems: targetDen,
        items: chests[i % numChests].items,
        chests,
        targetColor,
        theoreticalFraction: correctFrac,
      },
      choices: shuffledChoices,
      correctAnswerId: correctId,
      explanation,
      points: 100 + (i % 5) * 10,
      goldTickets: 1,
    });
  }

  return list;
}

// ═══════════════════════════════════════════════════════════════
// 2. DYNAMIC GENERATOR: ODDS WHEEL (100+ CONCISE QUESTIONS)
// ═══════════════════════════════════════════════════════════════
function generateOddsWheelChallenges(count = 110): ProbabilityChallenge[] {
  const list: ProbabilityChallenge[] = [];

  for (let i = 0; i < count; i++) {
    const totalSectors = i % 4 === 0 ? 8 : i % 4 === 1 ? 10 : i % 4 === 2 ? 12 : 6;
    const qType = i % 4;
    let targetCount = 2;
    let prompt = '';
    let missionTitle = '';
    let explanation = '';
    const color = COLOR_PALETTE[i % COLOR_PALETTE.length];

    if (qType === 0) {
      targetCount = totalSectors / 2;
      missionTitle = `${totalSectors}-SECTOR WHEEL: EVEN NUMBERS`;
      prompt = `A wheel has ${totalSectors} equal sectors numbered 1 to ${totalSectors}. What is P(Even Number)?`;
      explanation = `Half of the sectors are even (${targetCount}/${totalSectors} = 1/2).`;
    } else if (qType === 1) {
      targetCount = (i % 3) + 2;
      missionTitle = `${totalSectors}-SECTOR WHEEL: P(${color.name.toUpperCase()})`;
      prompt = `A ${totalSectors}-sector wheel has ${targetCount} ${color.name} sectors. What is P(${color.name})?`;
      explanation = `P(${color.name}) = ${targetCount}/${totalSectors}.`;
    } else if (qType === 2) {
      targetCount = totalSectors - 2;
      missionTitle = `${totalSectors}-SECTOR WHEEL: NUMBER > 2`;
      prompt = `On a wheel numbered 1 to ${totalSectors}, what is the probability of spinning a number GREATER than 2?`;
      explanation = `Numbers 3 through ${totalSectors} give ${targetCount} out of ${totalSectors} sectors.`;
    } else {
      targetCount = 1;
      missionTitle = `${totalSectors}-SECTOR WHEEL: JACKPOT`;
      prompt = `A ${totalSectors}-sector wheel has 1 Gold Jackpot slot. What is P(Jackpot) on 1 spin?`;
      explanation = `1 jackpot out of ${totalSectors} sectors = 1/${totalSectors}.`;
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
        feedbackText: `Incorrect. There are ${targetCount} favorable sectors.`,
      },
      {
        id: `ow-${i}-opt-3`,
        fraction: makeFraction(Math.min(targetCount + 1, totalSectors), totalSectors),
        label: `${targetCount + 1}/${totalSectors}`,
        isCorrect: false,
        feedbackText: `Incorrect. Double check your count.`,
      },
    ];

    list.push({
      id: `odds-wheel-${i + 1}`,
      activityId: 'odds-wheel',
      bloomLevel: BLOOM_LEVELS[i % BLOOM_LEVELS.length],
      missionTitle,
      prompt,
      helperNote: `P(Sector) = Favorable / Total (${totalSectors})`,
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
// 3. DYNAMIC GENERATOR: THE HIGH STRIKER (100+ CONCISE QUESTIONS)
// ═══════════════════════════════════════════════════════════════
function generateBallDropChallenges(count = 110): ProbabilityChallenge[] {
  const list: ProbabilityChallenge[] = [];

  for (let i = 0; i < count; i++) {
    const totalSlots = ((i % 4) + 3) * 2; // 6, 8, 10, 12 slots
    const winBellSlots = ((i * 2) % (totalSlots - 2)) + 2;
    const missSlots = totalSlots - winBellSlots;

    const correctFrac = makeFraction(winBellSlots, totalSlots);
    const correctId = `hs-${i}-opt-0`;

    const qType = i % 3;
    let prompt = '';
    let explanation = '';
    let missionTitle = `STRIKER TOWER #${i + 1}`;

    if (qType === 0) {
      prompt = `A High Striker tower has ${totalSlots} slots (${winBellSlots} Bell slots, ${missSlots} Miss slots). What is P(Ring Bell)?`;
      explanation = `P(Bell) = ${winBellSlots}/${totalSlots} = ${correctFrac.numerator}/${correctFrac.denominator}.`;
    } else if (qType === 1) {
      prompt = `The tower has ${totalSlots} notches numbered 1 to ${totalSlots}. ${winBellSlots} notches ring the bell. What is the win probability?`;
      explanation = `P(Win) = ${winBellSlots}/${totalSlots} = ${correctFrac.numerator}/${correctFrac.denominator}.`;
    } else {
      prompt = `A player hits the strike pad. Out of ${totalSlots} power zones, ${winBellSlots} hit the top bell. What is P(Top Bell)?`;
      explanation = `P(Top Bell) = ${winBellSlots}/${totalSlots} = ${correctFrac.numerator}/${correctFrac.denominator}.`;
    }

    const choices = [
      {
        id: correctId,
        fraction: correctFrac,
        label: `${correctFrac.numerator}/${correctFrac.denominator} (${correctFrac.percentage})`,
        isCorrect: true,
        feedbackText: `Correct! ${explanation}`,
      },
      {
        id: `hs-${i}-opt-1`,
        fraction: makeFraction(missSlots, totalSlots),
        label: `${missSlots}/${totalSlots}`,
        isCorrect: false,
        feedbackText: `Incorrect. This is the probability of missing.`,
      },
      {
        id: `hs-${i}-opt-2`,
        fraction: makeFraction(1, totalSlots),
        label: `1/${totalSlots}`,
        isCorrect: false,
        feedbackText: `Incorrect. There are ${winBellSlots} winning slots.`,
      },
      {
        id: `hs-${i}-opt-3`,
        fraction: makeFraction(winBellSlots, winBellSlots + 1),
        label: `${winBellSlots}/${winBellSlots + 1}`,
        isCorrect: false,
        feedbackText: `Incorrect. Use total tower slots in denominator.`,
      },
    ];

    list.push({
      id: `ball-drop-${i + 1}`,
      activityId: 'ball-drop',
      bloomLevel: BLOOM_LEVELS[i % BLOOM_LEVELS.length],
      missionTitle,
      prompt,
      helperNote: `P(Bell) = Winning Slots / Total Slots (${totalSlots})`,
      setup: {
        totalItems: totalSlots,
        items: [
          { color: '#10b981', colorName: 'Winning Slots', count: winBellSlots },
          { color: '#ef4444', colorName: 'Miss Slots', count: missSlots },
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
// 4. DYNAMIC GENERATOR: PROBABILITY LAB (100+ CONCISE QUESTIONS)
// ═══════════════════════════════════════════════════════════════
function generateProbabilityLabChallenges(count = 110): ProbabilityChallenge[] {
  const list: ProbabilityChallenge[] = [];

  for (let i = 0; i < count; i++) {
    const totalVials = (i % 4) + 6; // 6, 7, 8, 9 vials
    const goldVials = (i % 3) + 2; // 2, 3, 4 gold vials
    const otherVials = totalVials - goldVials;

    const correctFrac = makeFraction(goldVials, totalVials);
    const correctId = `pl-${i}-opt-0`;

    const qType = i % 2;
    let prompt = '';
    let explanation = '';

    if (qType === 0) {
      prompt = `A test tube rack holds ${goldVials} Gold serums and ${otherVials} Blue serums (${totalVials} total). What is P(Gold Serum)?`;
      explanation = `P(Gold Serum) = ${goldVials}/${totalVials} = ${correctFrac.numerator}/${correctFrac.denominator}.`;
    } else {
      const notFrac = makeFraction(otherVials, totalVials);
      prompt = `A centrifuge has ${goldVials} Gold crystals and ${otherVials} Emerald crystals (${totalVials} total). What is P(NOT Gold)?`;
      explanation = `P(NOT Gold) = ${otherVials}/${totalVials} = ${notFrac.numerator}/${notFrac.denominator}.`;
    }

    const targetFrac = qType === 0 ? correctFrac : makeFraction(otherVials, totalVials);

    const choices = [
      {
        id: correctId,
        fraction: targetFrac,
        label: `${targetFrac.numerator}/${targetFrac.denominator} (${targetFrac.percentage})`,
        isCorrect: true,
        feedbackText: `Correct! ${explanation}`,
      },
      {
        id: `pl-${i}-opt-1`,
        fraction: makeFraction(1, totalVials),
        label: `1/${totalVials}`,
        isCorrect: false,
        feedbackText: `Incorrect. Multiple items match.`,
      },
      {
        id: `pl-${i}-opt-2`,
        fraction: makeFraction(qType === 0 ? otherVials : goldVials, totalVials),
        label: `${qType === 0 ? otherVials : goldVials}/${totalVials}`,
        isCorrect: false,
        feedbackText: `Incorrect.`,
      },
      {
        id: `pl-${i}-opt-3`,
        fraction: makeFraction(2, totalVials),
        label: `2/${totalVials}`,
        isCorrect: false,
        feedbackText: `Incorrect.`,
      },
    ];

    list.push({
      id: `probability-lab-${i + 1}`,
      activityId: 'probability-lab',
      bloomLevel: BLOOM_LEVELS[i % BLOOM_LEVELS.length],
      missionTitle: `LAB REACTOR #${i + 1}`,
      prompt,
      helperNote: `P(Event) = Favorable / Total (${totalVials})`,
      setup: {
        totalItems: totalVials,
        items: [
          { color: '#eab308', colorName: 'Gold', count: goldVials },
          { color: '#38bdf8', colorName: 'Blue', count: otherVials },
        ],
        targetColor: '#eab308',
        theoreticalFraction: targetFrac,
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
// 5. DYNAMIC GENERATOR: CARNIVAL BUILDER (100+ CONCISE QUESTIONS)
// ═══════════════════════════════════════════════════════════════
function generateGameBuilderChallenges(count = 110): ProbabilityChallenge[] {
  const list: ProbabilityChallenge[] = [];

  for (let i = 0; i < count; i++) {
    const totalSlots = (i % 4) + 6; // 6 to 9 slots
    const winSlots = Math.floor(totalSlots / 2);

    const correctFrac = makeFraction(winSlots, totalSlots);
    const correctId = `gb-${i}-opt-0`;

    const prompt = `A booth game has ${totalSlots} slots: ${winSlots} WIN slots and ${totalSlots - winSlots} LOSE slots. What is P(Win)?`;
    const explanation = `P(Win) = ${winSlots}/${totalSlots} = ${correctFrac.numerator}/${correctFrac.denominator}.`;

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
        feedbackText: `Incorrect. This is losing probability.`,
      },
      {
        id: `gb-${i}-opt-2`,
        fraction: makeFraction(1, totalSlots),
        label: `1/${totalSlots}`,
        isCorrect: false,
        feedbackText: `Incorrect.`,
      },
      {
        id: `gb-${i}-opt-3`,
        fraction: makeFraction(winSlots + 1, totalSlots),
        label: `${winSlots + 1}/${totalSlots}`,
        isCorrect: false,
        feedbackText: `Incorrect.`,
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
          { color: '#ef4444', colorName: 'Lose', count: totalSlots - winSlots },
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
// 6. DYNAMIC GENERATOR: GRAND CARNIVAL ARENA (100+ CONCISE QUESTIONS)
// ═══════════════════════════════════════════════════════════════
function generateGrandCarnivalChallenges(count = 110): ProbabilityChallenge[] {
  const list: ProbabilityChallenge[] = [];

  for (let i = 0; i < count; i++) {
    const totalTokens = (i % 4) + 8; // 8, 9, 10, 11 tokens
    const goldCount = (i % 3) + 2;
    const diamondCount = 2;
    const silverCount = totalTokens - goldCount - diamondCount;

    const targetSum = goldCount + diamondCount;
    const correctFrac = makeFraction(targetSum, totalTokens);
    const correctId = `gc-${i}-opt-0`;

    const prompt = `A prize vault has ${goldCount} Gold, ${diamondCount} Diamond, and ${silverCount} Silver tokens (${totalTokens} total). What is P(Gold or Diamond)?`;
    const explanation = `P(Gold or Diamond) = (${goldCount} + ${diamondCount})/${totalTokens} = ${targetSum}/${totalTokens} = ${correctFrac.numerator}/${correctFrac.denominator}.`;

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
        fraction: makeFraction(silverCount, totalTokens),
        label: `${silverCount}/${totalTokens}`,
        isCorrect: false,
        feedbackText: `Incorrect. This is Silver tokens.`,
      },
      {
        id: `gc-${i}-opt-2`,
        fraction: makeFraction(goldCount, totalTokens),
        label: `${goldCount}/${totalTokens}`,
        isCorrect: false,
        feedbackText: `Incorrect. Don't forget Diamond tokens.`,
      },
      {
        id: `gc-${i}-opt-3`,
        fraction: makeFraction(1, totalTokens),
        label: `1/${totalTokens}`,
        isCorrect: false,
        feedbackText: `Incorrect.`,
      },
    ];

    list.push({
      id: `grand-carnival-${i + 1}`,
      activityId: 'grand-carnival',
      bloomLevel: BLOOM_LEVELS[i % BLOOM_LEVELS.length],
      missionTitle: `VAULT SHOWDOWN #${i + 1}`,
      prompt,
      helperNote: `P(A or B) = (Count A + Count B) / Total (${totalTokens})`,
      setup: {
        totalItems: totalTokens,
        items: [
          { color: '#eab308', colorName: 'Gold', count: goldCount },
          { color: '#38bdf8', colorName: 'Diamond', count: diamondCount },
          { color: '#94a3b8', colorName: 'Silver', count: silverCount },
        ],
        targetColor: '#eab308',
        theoreticalFraction: correctFrac,
      },
      choices: choices.sort((a, b) => a.fraction.numerator - b.fraction.numerator),
      correctAnswerId: correctId,
      explanation,
      points: 120 + (i % 4) * 15,
      goldTickets: 1,
    });
  }

  return list;
}

// ── Master Challenge Dictionary (100+ questions per attraction) ──
export const CARNIVAL_CHALLENGES: Record<ActivityId, ProbabilityChallenge[]> = {
  hub: [],
  'mystery-bag': generateMysteryBagChallenges(110),
  'odds-wheel': generateOddsWheelChallenges(110),
  'ball-drop': generateBallDropChallenges(110),
  'probability-lab': generateProbabilityLabChallenges(110),
  'game-builder': generateGameBuilderChallenges(110),
  'grand-carnival': generateGrandCarnivalChallenges(110),
};
