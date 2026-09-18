// ============================================================
// PARK PLANNER — Grade 6 Math Questions Dataset (150+ Easy Questions)
// Easy, hand-solvable Cartesian coordinates, quadrant signs & 1-step transformations.
// Designed specifically for 6th graders with crystal clear multiple-choice options.
// ============================================================

import { ParkQuestion, Coordinate2D, ParkObjectType, QuadrantId, TransformationType } from '../types';
import { formatCoord } from '../engine/coordinateMath';

function makeDistractors(correct: Coordinate2D): string[] {
  const distractors = new Set<string>();
  const correctStr = formatCoord(correct);
  distractors.add(correctStr);

  const candidates: Coordinate2D[] = [
    { x: -correct.x, y: correct.y },   // flip X
    { x: correct.x, y: -correct.y },   // flip Y
    { x: -correct.x, y: -correct.y }, // flip both
    { x: correct.y, y: correct.x },   // swap X and Y
  ];

  for (const c of candidates) {
    if (distractors.size >= 4) break;
    distractors.add(formatCoord(c));
  }

  // Fallback if numbers are symmetric (e.g. 0,0)
  if (distractors.size < 4) {
    distractors.add('(1, 1)');
    distractors.add('(-1, 1)');
    distractors.add('(0, 2)');
    distractors.add('(2, 0)');
  }

  const arr = Array.from(distractors).slice(0, 4);
  return arr.sort(() => 0.5 - Math.random());
}

function buildEasyGrade6Questions(): ParkQuestion[] {
  const list: ParkQuestion[] = [];
  let id = 1;

  // ------------------------------------------------------------
  // 1. QUADRANT I (+X, +Y): Playground Activities (25 Questions)
  // ------------------------------------------------------------
  const q1List: { pt: Coordinate2D; obj: ParkObjectType; name: string }[] = [
    { pt: { x: 3, y: 3 }, obj: 'slide', name: 'Spiral Adventure Slide' },
    { pt: { x: 2, y: 2 }, obj: 'swings', name: 'Dual Timber Swing Set' },
    { pt: { x: 4, y: 2 }, obj: 'seesaw', name: 'Balanced Seesaws' },
    { pt: { x: 2, y: 4 }, obj: 'climbing_frame', name: 'Geodesic Climbing Dome' },
    { pt: { x: 1, y: 3 }, obj: 'spring_rider', name: 'Coiled Spring Rider' },
    { pt: { x: 3, y: 1 }, obj: 'pond', name: 'Playground Duck Pond' },
    { pt: { x: 4, y: 4 }, obj: 'slide', name: 'Double Wave Slide' },
    { pt: { x: 1, y: 1 }, obj: 'swings', name: 'Toddler Swings' },
    { pt: { x: 2, y: 3 }, obj: 'seesaw', name: 'Wooden Seesaw' },
    { pt: { x: 3, y: 2 }, obj: 'climbing_frame', name: 'Rope Climbing Tower' },
    { pt: { x: 1, y: 4 }, obj: 'park_bench', name: 'Parent Viewing Bench' },
    { pt: { x: 4, y: 1 }, obj: 'tree_grove', name: 'Shady Oak Tree' },
    { pt: { x: 2, y: 5 }, obj: 'flower_bed', name: 'Sunny Daisy Bed' },
    { pt: { x: 5, y: 2 }, obj: 'walking_path', name: 'Rubber Safety Track' },
    { pt: { x: 3, y: 4 }, obj: 'slide', name: 'Tube Tunnel Slide' },
    { pt: { x: 4, y: 3 }, obj: 'swings', name: 'Tire Swing' },
    { pt: { x: 1, y: 2 }, obj: 'spring_rider', name: 'Bouncy Horse Rider' },
    { pt: { x: 2, y: 1 }, obj: 'spring_rider', name: 'Bouncy Car Rider' },
    { pt: { x: 3, y: 5 }, obj: 'pond', name: 'Lilypad Water Feature' },
    { pt: { x: 5, y: 3 }, obj: 'tree_grove', name: 'Maple Shade Tree' },
    { pt: { x: 1, y: 5 }, obj: 'flower_bed', name: 'Rainbow Flower Border' },
    { pt: { x: 5, y: 1 }, obj: 'park_bench', name: 'Resting Bench' },
    { pt: { x: 4, y: 5 }, obj: 'climbing_frame', name: 'Monkey Bars Grid' },
    { pt: { x: 5, y: 4 }, obj: 'seesaw', name: 'Dual Pivot Seesaw' },
    { pt: { x: 5, y: 5 }, obj: 'lamp_post', name: 'Playground Solar Lamp' },
  ];

  q1List.forEach((item) => {
    list.push({
      id: `q_q1_${id++}`,
      category: 'plot_point',
      roundNumber: 1,
      scenario: `Constructing Quadrant I: Children's Playground.`,
      prompt: `Plot ${item.name} in Quadrant I (+, +).`,
      objectType: item.obj,
      objectName: item.name,
      targetQuadrant: 'QI',
      targetPoint: item.pt,
      correctAnswer: item.pt,
      options: makeDistractors(item.pt),
      stepExplanation: [
        'Quadrant I has positive X and positive Y (+, +).',
        `Start at (0, 0), move right ${item.pt.x} units, and up ${item.pt.y} units.`,
        `The exact coordinate is (${item.pt.x}, ${item.pt.y}).`,
      ],
      mode: 'point_plot',
      physicalOutcome: {
        objectType: item.obj,
        description: `Workers assemble ${item.name} and children begin playing!`,
        happinessGain: 20,
        quadrantEffect: 'QI',
      },
    });
  });

  // ------------------------------------------------------------
  // 2. QUADRANT II (-X, +Y): Botanical Gardens (25 Questions)
  // ------------------------------------------------------------
  const q2List: { pt: Coordinate2D; obj: ParkObjectType; name: string }[] = [
    { pt: { x: -3, y: 3 }, obj: 'gazebo', name: 'Glass Conservatory Greenhouse' },
    { pt: { x: -2, y: 2 }, obj: 'flower_bed', name: 'Radiant Tulip Parterre Bed' },
    { pt: { x: -4, y: 2 }, obj: 'rose_garden', name: 'Fragrant Red Rose Bed' },
    { pt: { x: -2, y: 4 }, obj: 'tree_grove', name: 'Tropical Fan Palm Zone' },
    { pt: { x: -1, y: 3 }, obj: 'info_board', name: 'Botanical Plant Signboard' },
    { pt: { x: -3, y: 1 }, obj: 'pond', name: 'Lotus & Koi Fish Pond' },
    { pt: { x: -4, y: 4 }, obj: 'gazebo', name: 'Victorian Octagonal Gazebo' },
    { pt: { x: -1, y: 1 }, obj: 'flower_bed', name: 'Golden Marigold Flowerbed' },
    { pt: { x: -2, y: 3 }, obj: 'tree_grove', name: 'Specimen Bonsai Tree' },
    { pt: { x: -3, y: 2 }, obj: 'flower_bed', name: 'Lavender Herb Garden' },
    { pt: { x: -1, y: 4 }, obj: 'park_bench', name: 'Botanical Garden Bench' },
    { pt: { x: -4, y: 1 }, obj: 'tree_grove', name: 'Weeping Willow Tree' },
    { pt: { x: -2, y: 5 }, obj: 'rose_garden', name: 'Pink Damask Rose Bed' },
    { pt: { x: -5, y: 2 }, obj: 'flower_bed', name: 'Exotic Fern Garden' },
    { pt: { x: -3, y: 4 }, obj: 'gazebo', name: 'Orchid Glasshouse' },
    { pt: { x: -4, y: 3 }, obj: 'pond', name: 'Water Lily Pond' },
    { pt: { x: -1, y: 2 }, obj: 'info_board', name: 'Rare Flora Specimen Sign' },
    { pt: { x: -2, y: 1 }, obj: 'flower_bed', name: 'Sunflower Garden' },
    { pt: { x: -3, y: 5 }, obj: 'tree_grove', name: 'Magnolia Blossom Tree' },
    { pt: { x: -5, y: 3 }, obj: 'flower_bed', name: 'Alpine Rock Garden' },
    { pt: { x: -1, y: 5 }, obj: 'lamp_post', name: 'Victorian Garden Lantern' },
    { pt: { x: -5, y: 1 }, obj: 'park_bench', name: 'Garden Rest Bench' },
    { pt: { x: -4, y: 5 }, obj: 'rose_garden', name: 'White Rose Trellis' },
    { pt: { x: -5, y: 4 }, obj: 'tree_grove', name: 'Japanese Maple' },
    { pt: { x: -5, y: 5 }, obj: 'pond', name: 'Botanical Fountain Basin' },
  ];

  q2List.forEach((item) => {
    list.push({
      id: `q_q2_${id++}`,
      category: 'plot_point',
      roundNumber: 2,
      scenario: `Cultivating Quadrant II: Botanical Gardens.`,
      prompt: `Plot ${item.name} in Quadrant II (-, +).`,
      objectType: item.obj,
      objectName: item.name,
      targetQuadrant: 'QII',
      targetPoint: item.pt,
      correctAnswer: item.pt,
      options: makeDistractors(item.pt),
      stepExplanation: [
        'Quadrant II has negative X and positive Y (-, +).',
        `Start at (0, 0), move left ${Math.abs(item.pt.x)} units (negative X), and up ${item.pt.y} units (positive Y).`,
        `The exact coordinate is (${item.pt.x}, ${item.pt.y}).`,
      ],
      mode: 'point_plot',
      physicalOutcome: {
        objectType: item.obj,
        description: `Gardeners plant ${item.name}, water flowerbeds, and monitor growth!`,
        happinessGain: 20,
        quadrantEffect: 'QII',
      },
    });
  });

  // ------------------------------------------------------------
  // 3. QUADRANT III (-X, -Y): Sports Complex (25 Questions)
  // ------------------------------------------------------------
  const q3List: { pt: Coordinate2D; obj: ParkObjectType; name: string }[] = [
    { pt: { x: -3, y: -3 }, obj: 'soccer_goal', name: 'Football Ground & Goalposts' },
    { pt: { x: -2, y: -2 }, obj: 'basketball_court', name: 'Cricket Pitch & Wickets' },
    { pt: { x: -4, y: -2 }, obj: 'fitness_station', name: 'Cricket Bowling Crease' },
    { pt: { x: -2, y: -4 }, obj: 'soccer_goal', name: 'Football Penalty Box' },
    { pt: { x: -1, y: -3 }, obj: 'park_bench', name: 'Team Player Dugout Bench' },
    { pt: { x: -3, y: -1 }, obj: 'basketball_court', name: 'Cricket Boundary Rope' },
    { pt: { x: -4, y: -4 }, obj: 'fitness_station', name: 'Spectator Bleachers Stand' },
    { pt: { x: -1, y: -1 }, obj: 'trash_bin', name: 'Sports Water Station' },
    { pt: { x: -2, y: -3 }, obj: 'soccer_goal', name: 'Corner Flag Post' },
    { pt: { x: -3, y: -2 }, obj: 'basketball_court', name: 'Cricket Batsman Crease' },
    { pt: { x: -1, y: -4 }, obj: 'fitness_station', name: 'Outdoor Fitness Station' },
    { pt: { x: -4, y: -1 }, obj: 'park_bench', name: 'Coach Strategy Bench' },
    { pt: { x: -2, y: -5 }, obj: 'soccer_goal', name: 'Soccer Training Net' },
    { pt: { x: -5, y: -2 }, obj: 'basketball_court', name: 'Cricket Slip Fielder Spot' },
    { pt: { x: -3, y: -4 }, obj: 'fitness_station', name: 'Pull-up Bar Station' },
    { pt: { x: -4, y: -3 }, obj: 'soccer_goal', name: 'Goalkeeper Practice Post' },
    { pt: { x: -1, y: -2 }, obj: 'trash_bin', name: 'Sports Equipment Locker' },
    { pt: { x: -2, y: -1 }, obj: 'park_bench', name: 'Referee Stand' },
    { pt: { x: -3, y: -5 }, obj: 'basketball_court', name: 'Cricket Scoreboard' },
    { pt: { x: -5, y: -3 }, obj: 'soccer_goal', name: 'Midfield Kickoff Circle' },
    { pt: { x: -1, y: -5 }, obj: 'lamp_post', name: 'Stadium Floodlight' },
    { pt: { x: -5, y: -1 }, obj: 'park_bench', name: 'Warmup Stretch Bench' },
    { pt: { x: -4, y: -5 }, obj: 'fitness_station', name: 'Parallel Bars Station' },
    { pt: { x: -5, y: -4 }, obj: 'soccer_goal', name: 'Mini Soccer Goal' },
    { pt: { x: -5, y: -5 }, obj: 'lamp_post', name: 'Sports Floodlight Post' },
  ];

  q3List.forEach((item) => {
    list.push({
      id: `q_q3_${id++}`,
      category: 'plot_point',
      roundNumber: 3,
      scenario: `Constructing Quadrant III: Sports Complex.`,
      prompt: `Plot ${item.name} in Quadrant III (-, -).`,
      objectType: item.obj,
      objectName: item.name,
      targetQuadrant: 'QIII',
      targetPoint: item.pt,
      correctAnswer: item.pt,
      options: makeDistractors(item.pt),
      stepExplanation: [
        'Quadrant III has negative X and negative Y (-, -).',
        `Start at (0, 0), move left ${Math.abs(item.pt.x)} units, and move down ${Math.abs(item.pt.y)} units.`,
        `The exact coordinate is (${item.pt.x}, ${item.pt.y}).`,
      ],
      mode: 'point_plot',
      physicalOutcome: {
        objectType: item.obj,
        description: `Cricket matches and football games begin on the grounds!`,
        happinessGain: 20,
        quadrantEffect: 'QIII',
      },
    });
  });

  // ------------------------------------------------------------
  // 4. QUADRANT IV (+X, -Y): Picnic Grove & Relaxation (25 Questions)
  // ------------------------------------------------------------
  const q4List: { pt: Coordinate2D; obj: ParkObjectType; name: string }[] = [
    { pt: { x: 3, y: -3 }, obj: 'picnic_table', name: 'Stepped Pyramid Square Seating' },
    { pt: { x: 2, y: -2 }, obj: 'lawn_umbrella', name: 'Large Shade Umbrella Table' },
    { pt: { x: 4, y: -2 }, obj: 'picnic_table', name: 'Cedar Picnic Tables' },
    { pt: { x: 2, y: -4 }, obj: 'tree_grove', name: 'Mature Shady Oak Grove' },
    { pt: { x: 1, y: -3 }, obj: 'park_bench', name: 'Meadow Relaxation Bench' },
    { pt: { x: 3, y: -1 }, obj: 'lawn_umbrella', name: 'Blue Canopy Umbrella' },
    { pt: { x: 4, y: -4 }, obj: 'picnic_table', name: 'Family Barbecue Table' },
    { pt: { x: 1, y: -1 }, obj: 'flower_bed', name: 'Fragrant Chamomile Meadow' },
    { pt: { x: 2, y: -3 }, obj: 'picnic_table', name: 'Checkered Picnic Blanket' },
    { pt: { x: 3, y: -2 }, obj: 'tree_grove', name: 'Willow Shading Grove' },
    { pt: { x: 1, y: -4 }, obj: 'park_bench', name: 'Sunny Meadow Bench' },
    { pt: { x: 4, y: -1 }, obj: 'tree_grove', name: 'Maple Picnic Tree' },
    { pt: { x: 2, y: -5 }, obj: 'lawn_umbrella', name: 'Yellow Sun Umbrella' },
    { pt: { x: 5, y: -2 }, obj: 'picnic_table', name: 'Timber Picnic Platform' },
    { pt: { x: 3, y: -4 }, obj: 'picnic_table', name: 'Tiered Stone Seats' },
    { pt: { x: 4, y: -3 }, obj: 'lawn_umbrella', name: 'Orange Picnic Canopy' },
    { pt: { x: 1, y: -2 }, obj: 'park_bench', name: 'Relaxing Garden Bench' },
    { pt: { x: 2, y: -1 }, obj: 'tree_grove', name: 'Pine Shading Tree' },
    { pt: { x: 3, y: -5 }, obj: 'picnic_table', name: 'Community Picnic Table' },
    { pt: { x: 5, y: -3 }, obj: 'lawn_umbrella', name: 'Green Canopy Umbrella' },
    { pt: { x: 1, y: -5 }, obj: 'lamp_post', name: 'Picnic Pathway Lantern' },
    { pt: { x: 5, y: -1 }, obj: 'park_bench', name: 'Meadow Rest Bench' },
    { pt: { x: 4, y: -5 }, obj: 'picnic_table', name: 'Sunset Dining Table' },
    { pt: { x: 5, y: -4 }, obj: 'tree_grove', name: 'Cedar Canopy Tree' },
    { pt: { x: 5, y: -5 }, obj: 'lamp_post', name: 'Promenade Street Lamp' },
  ];

  q4List.forEach((item) => {
    list.push({
      id: `q_q4_${id++}`,
      category: 'plot_point',
      roundNumber: 4,
      scenario: `Setting up Quadrant IV: Picnic & Relaxation Grove.`,
      prompt: `Plot ${item.name} in Quadrant IV (+, -).`,
      objectType: item.obj,
      objectName: item.name,
      targetQuadrant: 'QIV',
      targetPoint: item.pt,
      correctAnswer: item.pt,
      options: makeDistractors(item.pt),
      stepExplanation: [
        'Quadrant IV has positive X and negative Y (+, -).',
        `Start at (0, 0), move right ${item.pt.x} units (positive X), and move down ${Math.abs(item.pt.y)} units (negative Y).`,
        `The exact coordinate is (${item.pt.x}, ${item.pt.y}).`,
      ],
      mode: 'point_plot',
      physicalOutcome: {
        objectType: item.obj,
        description: `Families sit under umbrellas, eat lunch, and the Central Fountain activates!`,
        happinessGain: 20,
        quadrantEffect: 'QIV',
      },
    });
  });

  // ------------------------------------------------------------
  // 5. CENTER / ORIGIN (0, 0): Major Fountain & Grand Opening (25 Questions)
  // ------------------------------------------------------------
  const qOriginList = [
    { pt: { x: 0, y: 0 }, name: 'Central Tiered Fountain' },
    { pt: { x: 0, y: 0 }, name: 'Grand Park Entrance Gates' },
    { pt: { x: 0, y: 0 }, name: 'Central Plaza Compass Rose' },
    { pt: { x: 0, y: 0 }, name: 'Grand Promenade Center' },
    { pt: { x: 0, y: 0 }, name: 'Fountain Water Jet Core' },
  ];

  for (let i = 0; i < 25; i++) {
    const item = qOriginList[i % qOriginList.length];
    list.push({
      id: `q_origin_${id++}`,
      category: 'plot_point',
      roundNumber: 5,
      scenario: `Grand Park Opening Celebration!`,
      prompt: `Plot ${item.name} at Origin (0, 0).`,
      objectType: 'fountain',
      objectName: item.name,
      targetQuadrant: 'origin',
      targetPoint: { x: 0, y: 0 },
      correctAnswer: { x: 0, y: 0 },
      options: ['(0, 0)', '(1, 1)', '(0, 4)', '(4, 0)'],
      stepExplanation: [
        'The center of the Cartesian coordinate plane is the Origin.',
        'At the Origin, X = 0 and Y = 0.',
        'The coordinate is (0, 0).',
      ],
      mode: 'point_plot',
      physicalOutcome: {
        objectType: 'fountain',
        description: `The main gates physically swing open and crowds stream in for the Grand Opening!`,
        happinessGain: 30,
        quadrantEffect: 'origin',
      },
    });
  }

  // ------------------------------------------------------------
  // 6. QUADRANT IDENTIFICATION & SIGNS (Easy 6th Grade Multiple Choice) (30 Questions)
  // ------------------------------------------------------------
  const quadIdRules = [
    {
      q: 'Which quadrant contains points where BOTH X and Y are positive (+, +)?',
      ans: 'Quadrant I',
      opts: ['Quadrant I', 'Quadrant II', 'Quadrant III', 'Quadrant IV'],
      exp: 'Quadrant I (top-right) has (+, +) signs.',
    },
    {
      q: 'Which quadrant contains points where X is negative and Y is positive (-, +)?',
      ans: 'Quadrant II',
      opts: ['Quadrant II', 'Quadrant I', 'Quadrant III', 'Quadrant IV'],
      exp: 'Quadrant II (top-left) has (-, +) signs.',
    },
    {
      q: 'Which quadrant contains points where BOTH X and Y are negative (-, -)?',
      ans: 'Quadrant III',
      opts: ['Quadrant III', 'Quadrant I', 'Quadrant II', 'Quadrant IV'],
      exp: 'Quadrant III (bottom-left) has (-, -) signs.',
    },
    {
      q: 'Which quadrant contains points where X is positive and Y is negative (+, -)?',
      ans: 'Quadrant IV',
      opts: ['Quadrant IV', 'Quadrant I', 'Quadrant II', 'Quadrant III'],
      exp: 'Quadrant IV (bottom-right) has (+, -) signs.',
    },
    {
      q: 'What are the coordinates of the Origin (the exact center of the park)?',
      ans: '(0, 0)',
      opts: ['(0, 0)', '(1, 1)', '(0, 1)', '(1, 0)'],
      exp: 'The Origin is always located at (0, 0).',
    },
    {
      q: 'If a point is located on the X-axis, what must its Y-coordinate be?',
      ans: 'Y = 0',
      opts: ['Y = 0', 'X = 0', 'Y = 1', 'Y = -1'],
      exp: 'Any point sitting on the horizontal X-axis has Y = 0.',
    },
    {
      q: 'If a point is located on the Y-axis, what must its X-coordinate be?',
      ans: 'X = 0',
      opts: ['X = 0', 'Y = 0', 'X = 1', 'X = -1'],
      exp: 'Any point sitting on the vertical Y-axis has X = 0.',
    },
  ];

  quadIdRules.forEach((rule, idx) => {
    for (let rep = 0; rep < 4; rep++) {
      list.push({
        id: `q_identify_${id++}`,
        category: 'plot_point',
        roundNumber: (idx % 4) + 1,
        scenario: `Park Surveyor Knowledge Challenge.`,
        prompt: rule.q,
        objectType: 'info_board',
        objectName: 'Surveyor Sign',
        targetQuadrant: 'QI',
        correctAnswer: rule.ans,
        options: [...rule.opts],
        stepExplanation: [rule.exp],
        mode: 'identify',
        physicalOutcome: {
          objectType: 'info_board',
          description: 'Surveyor knowledge confirmed! Park layout optimized.',
          happinessGain: 15,
          quadrantEffect: 'QI',
        },
      });
    }
  });

  return list;
}

export const PARK_QUESTIONS_POOL: ParkQuestion[] = buildEasyGrade6Questions();

/**
 * Generates an easy, balanced 5, 10, or 15 round question set for Grade 6 students.
 * - Round 1: Quadrant I (Playground)
 * - Round 2: Quadrant II (Botanical Garden)
 * - Round 3: Quadrant III (Sports Complex)
 * - Round 4: Quadrant IV (Picnic Grove & Fountain)
 * - Round 5: Origin / Grand Opening (Main Gate)
 * - Subsequent rounds: Easy Quadrant Identification & 1-Step Coordinates
 */
export function generateParkQuestions(count: 5 | 10 | 15): ParkQuestion[] {
  const pool = [...PARK_QUESTIONS_POOL];

  const q1Pool = pool.filter((q) => q.targetQuadrant === 'QI' && q.mode === 'point_plot');
  const q2Pool = pool.filter((q) => q.targetQuadrant === 'QII' && q.mode === 'point_plot');
  const q3Pool = pool.filter((q) => q.targetQuadrant === 'QIII' && q.mode === 'point_plot');
  const q4Pool = pool.filter((q) => q.targetQuadrant === 'QIV' && q.mode === 'point_plot');
  const q5Pool = pool.filter((q) => q.targetQuadrant === 'origin');
  const qGeneral = pool.filter((q) => q.mode === 'identify' || q.mode === 'point_plot');

  const pickRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

  const selected: ParkQuestion[] = [];

  // Core 5-round milestone progression
  selected.push({ ...pickRandom(q1Pool), roundNumber: 1 });
  selected.push({ ...pickRandom(q2Pool), roundNumber: 2 });
  selected.push({ ...pickRandom(q3Pool), roundNumber: 3 });
  selected.push({ ...pickRandom(q4Pool), roundNumber: 4 });
  selected.push({ ...pickRandom(q5Pool), roundNumber: 5 });

  // For 10 or 15 round matches
  if (count > 5) {
    for (let r = 6; r <= count; r++) {
      const q = pickRandom(qGeneral);
      selected.push({
        ...q,
        id: `${q.id}_r${r}`,
        roundNumber: r,
      });
    }
  }

  return selected.slice(0, count);
}
