// ============================================================
// RATIO RUSH — GRADE 6 RATIO & PROPORTION QUESTIONS (21 CURRICULUM QUESTIONS)
// Comprehensive curriculum-aligned ratio scenarios with intuitive scaling.
// On every session reload, 5 questions are sampled across stages 1-5.
// ============================================================

import { RatioQuestion } from '../types';

export const RATIO_QUESTIONS: RatioQuestion[] = [
  // ── STAGE 1: RATIO BASICS, SIMPLIFICATION & EQUIVALENCE ──
  {
    id: 'q1_simplest_form_40_60',
    stage: 1,
    title: 'Stage 1: Simplest Form Ratio',
    scenario: 'Simplifying ratios on set.',
    mathPrompt: 'The ratio of 40 to 60 in simplest form is:',
    correctAnswer: '2 : 3',
    correctUnit: '',
    options: ['4 : 6', '2 : 3', '3 : 2', '1 : 2'],
    unitRateExplanation: 'Dividing both 40 and 60 by their GCD 20 gives 2 : 3.',
    studioActionText: 'Director calls Action as the hero enters the set!',
    misconceptions: [
      { wrongAnswer: '4 : 6', reason: 'Not fully simplified; divide further by 2.' },
      { wrongAnswer: '3 : 2', reason: 'Inverted the antecedent and consequent terms.' },
    ],
  },
  {
    id: 'q3_inverse_ratio_ab',
    stage: 1,
    title: 'Stage 1: Inverting Ratio',
    scenario: 'Inverting ratio terms.',
    mathPrompt: 'If a : b = 3 : 5, then b : a is:',
    correctAnswer: '5 : 3',
    correctUnit: '',
    options: ['3 : 5', '5 : 3', '3 : 3', '5 : 5'],
    unitRateExplanation: 'Inverting the ratio a : b (3 : 5) swaps the terms to give b : a = 5 : 3.',
    studioActionText: 'Camera Operator pans gracefully across the stage floor.',
    misconceptions: [
      { wrongAnswer: '3 : 5', reason: 'Kept original ratio without reversing the order.' },
    ],
  },
  {
    id: 'q6_equivalent_ratio_12_18',
    stage: 1,
    title: 'Stage 1: Equivalent Ratio',
    scenario: 'Equivalent ratio test.',
    mathPrompt: 'The ratio 12 : 18 is equivalent to:',
    correctAnswer: '2 : 3',
    correctUnit: '',
    options: ['2 : 3', '3 : 2', '4 : 3', '1 : 3'],
    unitRateExplanation: 'Dividing 12 and 18 by their greatest common divisor 6 gives 2 : 3.',
    studioActionText: 'Gaffer adjusts the overhead key lights for the shot.',
    misconceptions: [
      { wrongAnswer: '3 : 2', reason: 'Terms reversed.' },
      { wrongAnswer: '4 : 3', reason: 'Divided terms by different numbers.' },
    ],
  },
  {
    id: 'q9_not_a_ratio_expression',
    stage: 1,
    title: 'Stage 1: Expressing Ratios',
    scenario: 'Ratio notation recognition.',
    mathPrompt: 'Which of the following is NOT a way to express a ratio?',
    correctAnswer: '3 + 4',
    correctUnit: '',
    options: ['3 : 4', '3 to 4', '3/4', '3 + 4'],
    unitRateExplanation: 'Ratios can be written as 3 : 4, 3 to 4, or 3/4. 3 + 4 is addition, not a ratio.',
    studioActionText: 'Script supervisor notes the scene details on the slate.',
    misconceptions: [
      { wrongAnswer: '3/4', reason: 'A fraction is a valid representation of a ratio.' },
    ],
  },
  {
    id: 'q19_not_equivalent_ratio',
    stage: 1,
    title: 'Stage 1: Non-Equivalent Ratio',
    scenario: 'Spotting non-equivalent ratios.',
    mathPrompt: 'Which of these ratios is NOT equivalent to 3 : 5?',
    correctAnswer: '15 : 20',
    correctUnit: '',
    options: ['6 : 10', '9 : 15', '12 : 20', '15 : 20'],
    unitRateExplanation: '6:10 = 3:5, 9:15 = 3:5, and 12:20 = 3:5. But 15:20 simplifies to 3:4.',
    studioActionText: 'Camera crew captures the high-speed chase cutaway.',
    misconceptions: [
      { wrongAnswer: '12 : 20', reason: '12:20 divided by 4 equals 3:5 (equivalent).' },
    ],
  },

  // ── STAGE 2: UNIT CONVERSIONS, RATES & UNITARY METHOD ──
  {
    id: 'q5_sugar_cost_unitary',
    stage: 2,
    title: 'Stage 2: Unitary Method - Sugar Cost',
    scenario: 'Cost calculation using unitary method.',
    mathPrompt: 'If 2 kg of sugar costs ₹80, the cost of 5 kg of sugar is:',
    correctAnswer: '₹200',
    correctUnit: '',
    options: ['₹160', '₹200', '₹240', '₹400'],
    unitRateExplanation: 'Cost of 1 kg = ₹80 ÷ 2 = ₹40. Cost of 5 kg = 5 × ₹40 = ₹200.',
    studioActionText: 'Maya inspects the film script with keen focus.',
    misconceptions: [
      { wrongAnswer: '₹160', reason: 'Calculated 2 × ₹80 instead of 5 kg.' },
      { wrongAnswer: '₹400', reason: 'Multiplied ₹80 × 5 without dividing by 2 kg first.' },
    ],
  },
  {
    id: 'q7_ratio_hour_to_minutes',
    stage: 2,
    title: 'Stage 2: Unit Conversion - Hour to Minutes',
    scenario: 'Time unit ratio.',
    mathPrompt: 'The ratio of 1 hour to 40 minutes is:',
    correctAnswer: '3 : 2',
    correctUnit: '',
    options: ['2 : 3', '3 : 2', '1 : 40', '40 : 1'],
    unitRateExplanation: 'Convert 1 hour = 60 minutes. Ratio = 60 min : 40 min = 3 : 2.',
    studioActionText: 'Dolly grip smoothly glides the camera track forward.',
    misconceptions: [
      { wrongAnswer: '1 : 40', reason: 'Did not convert 1 hour to minutes first.' },
      { wrongAnswer: '2 : 3', reason: 'Reversed 40 : 60 instead of 60 : 40.' },
    ],
  },
  {
    id: 'q10_rupees_to_paise_ratio',
    stage: 2,
    title: 'Stage 2: Currency Units - ₹5 to 50 Paise',
    scenario: 'Currency ratio.',
    mathPrompt: 'The ratio of ₹5 to 50 paise is:',
    correctAnswer: '10 : 1',
    correctUnit: '',
    options: ['1 : 10', '10 : 1', '5 : 50', '1 : 1'],
    unitRateExplanation: 'Convert ₹5 = 500 paise. Ratio = 500 paise : 50 paise = 10 : 1.',
    studioActionText: 'Lead actress delivers a powerful dramatic dialogue.',
    misconceptions: [
      { wrongAnswer: '1 : 10', reason: 'Inverted the ratio terms.' },
      { wrongAnswer: '5 : 50', reason: 'Did not convert rupees to paise.' },
    ],
  },
  {
    id: 'q21_orange_cost_unitary',
    stage: 2,
    title: 'Stage 2: Unitary Method - Oranges Cost',
    scenario: 'Fruit market rate.',
    mathPrompt: 'The cost of 12 oranges is ₹96. The cost of 7 oranges (by unitary method) is:',
    correctAnswer: '₹56',
    correctUnit: '',
    options: ['₹49', '₹56', '₹64', '₹72'],
    unitRateExplanation: 'Cost of 1 orange = ₹96 ÷ 12 = ₹8. Cost of 7 oranges = 7 × ₹8 = ₹56.',
    studioActionText: 'Cast and crew celebrate a picture-perfect take!',
    misconceptions: [
      { wrongAnswer: '₹64', reason: 'Used ₹8 × 8 instead of 7 oranges.' },
      { wrongAnswer: '₹49', reason: 'Calculated 7 × 7 instead of 7 × 8.' },
    ],
  },

  // ── STAGE 3: PROPORTIONS, MEANS & EXTREMES ──
  {
    id: 'q2_proportion_rule_abcd',
    stage: 3,
    title: 'Stage 3: Proportion Condition',
    scenario: 'Proportion relationship rule.',
    mathPrompt: 'Four numbers a, b, c, d are said to be in proportion if:',
    correctAnswer: 'a × d = b × c',
    correctUnit: '',
    options: ['a + d = b + c', 'a × d = b × c', 'a − d = b − c', 'a ÷ b = c − d'],
    unitRateExplanation: 'In proportion a : b :: c : d, product of extremes equals product of means (a × d = b × c).',
    studioActionText: 'Dev the Rival steps into the spotlight with dramatic tension!',
    misconceptions: [
      { wrongAnswer: 'a + d = b + c', reason: 'Proportion is multiplicative, not additive.' },
    ],
  },
  {
    id: 'q4_proportion_symbol',
    stage: 3,
    title: 'Stage 3: Symbol of Proportion',
    scenario: 'Mathematical symbol.',
    mathPrompt: 'The symbol used to represent proportion is:',
    correctAnswer: '::',
    correctUnit: '',
    options: [':', '::', '=', '÷'],
    unitRateExplanation: 'The symbol :: is used to represent a proportion between two ratios (read as "as is to").',
    studioActionText: 'Sound Engineer balances the studio audio levels.',
    misconceptions: [
      { wrongAnswer: ':', reason: ': is used for ratio, while :: is used for proportion.' },
    ],
  },
  {
    id: 'q11_proportion_find_x',
    stage: 3,
    title: 'Stage 3: Solving for Unknown in Proportion',
    scenario: 'Finding missing term.',
    mathPrompt: 'In the proportion 6 : 9 :: 10 : x, the value of x is:',
    correctAnswer: '15',
    correctUnit: '',
    options: ['12', '15', '18', '20'],
    unitRateExplanation: 'Product of extremes = Product of means: 6 × x = 9 × 10 → 6x = 90 → x = 15.',
    studioActionText: 'Villain issues a bold ultimatum on set.',
    misconceptions: [
      { wrongAnswer: '18', reason: 'Added numbers rather than using cross multiplication.' },
      { wrongAnswer: '12', reason: 'Calculation error.' },
    ],
  },
  {
    id: 'q14_means_in_proportion',
    stage: 3,
    title: 'Stage 3: Means in a Proportion',
    scenario: 'Proportion terminology.',
    mathPrompt: "The terms 'means' in a proportion a : b :: c : d refer to:",
    correctAnswer: 'b and c',
    correctUnit: '',
    options: ['a and d', 'b and c', 'a and c', 'b and d'],
    unitRateExplanation: 'In proportion a : b :: c : d, the inner middle terms b and c are called the means.',
    studioActionText: 'Director observes the monitor closely.',
    misconceptions: [
      { wrongAnswer: 'a and d', reason: 'a and d are the extremes (outer terms).' },
    ],
  },
  {
    id: 'q15_extremes_in_proportion',
    stage: 3,
    title: 'Stage 3: Extremes in a Proportion',
    scenario: 'Proportion terminology.',
    mathPrompt: "The terms 'extremes' in a proportion a : b :: c : d refer to:",
    correctAnswer: 'a and d',
    correctUnit: '',
    options: ['a and d', 'b and c', 'a and b', 'c and d'],
    unitRateExplanation: 'In proportion a : b :: c : d, the outer terms a and d are called the extremes.',
    studioActionText: 'Stunt coordinator preps the combat mats for the duel.',
    misconceptions: [
      { wrongAnswer: 'b and c', reason: 'b and c are the means (inner terms).' },
    ],
  },

  // ── STAGE 4: GEOMETRY, MAPS & SCALING ──
  {
    id: 'q8_sum_ratio_numbers',
    stage: 4,
    title: 'Stage 4: Ratio & Sum of Numbers',
    scenario: 'Dividing a sum in ratio.',
    mathPrompt: 'If the ratio of two numbers is 5 : 7 and their sum is 60, the numbers are:',
    correctAnswer: '25 and 35',
    correctUnit: '',
    options: ['20 and 40', '25 and 35', '30 and 30', '15 and 45'],
    unitRateExplanation: 'Total parts = 5 + 7 = 12. One part = 60 ÷ 12 = 5. Numbers are 5×5 = 25 and 7×5 = 35.',
    studioActionText: 'Hero delivers an impassioned, cinematic monologue.',
    misconceptions: [
      { wrongAnswer: '20 and 40', reason: 'Ratio of 20:40 is 1:2, not 5:7.' },
      { wrongAnswer: '30 and 30', reason: 'Equal halves is ratio 1:1, not 5:7.' },
    ],
  },
  {
    id: 'q12_map_scale_distance',
    stage: 4,
    title: 'Stage 4: Map Scale Calculation',
    scenario: 'Map scaling ratio.',
    mathPrompt: 'A map has a scale of 1 cm : 50 km. A distance of 4 cm on the map represents:',
    correctAnswer: '200 km',
    correctUnit: '',
    options: ['100 km', '150 km', '200 km', '250 km'],
    unitRateExplanation: '1 cm represents 50 km, so 4 cm represents 4 × 50 km = 200 km.',
    studioActionText: 'Cinematographer locks in the wide telephoto shot.',
    misconceptions: [
      { wrongAnswer: '100 km', reason: 'Multiplied by 2 instead of 4 cm.' },
    ],
  },
  {
    id: 'q16_rectangle_ratio_breadth',
    stage: 4,
    title: 'Stage 4: Rectangle Dimensions from Ratio',
    scenario: 'Rectangle ratio scaling.',
    mathPrompt: 'If the ratio of length to breadth of a rectangle is 4 : 3 and the length is 20 cm, the breadth is:',
    correctAnswer: '15 cm',
    correctUnit: '',
    options: ['12 cm', '15 cm', '18 cm', '16 cm'],
    unitRateExplanation: 'Multiplier = 20 ÷ 4 = 5. Breadth = 3 × 5 = 15 cm.',
    studioActionText: 'Hero slips under a punch and counters cleanly.',
    misconceptions: [
      { wrongAnswer: '12 cm', reason: 'Used multiplier 4 × 3 = 12 instead of 5 × 3.' },
    ],
  },
  {
    id: 'q20_photo_enlargement_ratio',
    stage: 4,
    title: 'Stage 4: Photograph Enlargement Ratio',
    scenario: 'Scale factor enlargement.',
    mathPrompt: 'If a photograph is enlarged in the ratio 2 : 5 and the original height is 6 cm, the new height is:',
    correctAnswer: '15 cm',
    correctUnit: '',
    options: ['10 cm', '12 cm', '15 cm', '18 cm'],
    unitRateExplanation: 'Original 2 parts = 6 cm → 1 part = 3 cm. New height = 5 × 3 = 15 cm.',
    studioActionText: 'Director frames the final cinematic freeze-frame.',
    misconceptions: [
      { wrongAnswer: '12 cm', reason: 'Multiplied 6 by 2 instead of scaling 2:5.' },
    ],
  },

  // ── STAGE 5: WORK RATES, LCM & RECIPES ──
  {
    id: 'q13_workers_days_inverse',
    stage: 5,
    title: 'Stage 5: Worker-Days Work Rate',
    scenario: 'Inverse rate problem.',
    mathPrompt: 'If 8 workers can build a wall in 6 days, how many days will 4 workers take (assuming same work rate)?',
    correctAnswer: '12 days',
    correctUnit: '',
    options: ['3 days', '6 days', '12 days', '24 days'],
    unitRateExplanation: 'Total work = 8 × 6 = 48 worker-days. 4 workers will take 48 ÷ 4 = 12 days.',
    studioActionText: 'Hero and Villain clash in the intense 1v1 fight scene!',
    misconceptions: [
      { wrongAnswer: '3 days', reason: 'Fewer workers take more days, not fewer days (inverse proportion).' },
      { wrongAnswer: '24 days', reason: 'Overestimated days.' },
    ],
  },
  {
    id: 'q17_ratio_and_lcm',
    stage: 5,
    title: 'Stage 5: Numbers from Ratio & LCM',
    scenario: 'LCM and ratio problem.',
    mathPrompt: 'Two numbers are in the ratio 3 : 4. If their LCM is 84, the numbers are:',
    correctAnswer: '21 and 28',
    correctUnit: '',
    options: ['21 and 28', '18 and 24', '24 and 32', '15 and 20'],
    unitRateExplanation: 'Let numbers be 3x and 4x. LCM = 3 × 4 × x = 12x. 12x = 84 → x = 7. Numbers are 21 and 28.',
    studioActionText: 'Hero lands the thunderous knockout strike!',
    misconceptions: [
      { wrongAnswer: '18 and 24', reason: 'LCM of 18 and 24 is 72, not 84.' },
    ],
  },
  {
    id: 'q18_recipe_ratio_sugar',
    stage: 5,
    title: 'Stage 5: Recipe Proportions',
    scenario: 'Cooking ingredients proportion.',
    mathPrompt: 'A recipe requires flour and sugar in the ratio 5 : 2. If 10 kg of flour is used, how much sugar is needed?',
    correctAnswer: '4 kg',
    correctUnit: '',
    options: ['2 kg', '4 kg', '5 kg', '6 kg'],
    unitRateExplanation: 'Multiplier = 10 ÷ 5 = 2. Amount of sugar needed = 2 × 2 = 4 kg.',
    studioActionText: 'Maya cheers enthusiastically as the hero prevails!',
    misconceptions: [
      { wrongAnswer: '2 kg', reason: 'Did not scale with the 10 kg flour multiplier 2.' },
      { wrongAnswer: '5 kg', reason: 'Used the flour ratio number directly.' },
    ],
  },
];

/** Sample 5 balanced questions (one per stage 1..5) from the master 21 question pool */
export function sampleRandomRatioQuestions(pool: RatioQuestion[] = RATIO_QUESTIONS): RatioQuestion[] {
  const stages = [1, 2, 3, 4, 5];
  const selected: RatioQuestion[] = [];
  
  stages.forEach((stageNum) => {
    const candidates = pool.filter((q) => q.stage === stageNum);
    if (candidates.length > 0) {
      const picked = candidates[Math.floor(Math.random() * candidates.length)];
      selected.push(picked);
    } else {
      const randomQ = pool[Math.floor(Math.random() * pool.length)] || pool[0];
      selected.push({ ...randomQ, stage: stageNum, title: `Stage ${stageNum}: ${randomQ.title.replace(/^Stage \d+:\s*/, '')}` });
    }
  });

  return selected;
}
