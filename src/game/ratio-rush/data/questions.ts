// ============================================================
// RATIO RUSH — GRADE 6 RATIO & PROPORTION QUESTIONS (SIMPLIFIED)
// Engaging, 6th-grade friendly math scenarios with intuitive scaling
// ============================================================

import { RatioQuestion } from '../types';

export const RATIO_QUESTIONS: RatioQuestion[] = [
  {
    id: 'q1_camera_shots',
    stage: 1,
    title: 'Stage 1: Camera Shot Ratio',
    scenario: 'Director framing Close-up shots and Wide shots.',
    mathPrompt:
      'The director plans camera shots in a ratio of 2 : 3 (Close-up shots to Wide shots). If the crew films 6 Close-up shots, how many Wide shots are needed?',
    ratioA: 2,
    ratioB: 3,
    labelA: 'Close-Up Shots',
    labelB: 'Wide Shots',
    targetQuantityName: 'Wide Shots',
    givenQuantityName: 'Close-Up Shots',
    givenQuantityValue: 6,
    correctAnswer: 9,
    correctUnit: 'shots',
    options: [6, 8, 9, 12],
    unitRateExplanation:
      '6 Close-ups is 3 times 2 parts (2 × 3 = 6). Multiply 3 Wide parts × 3 = 9 Wide shots (2 : 3 = 6 : 9).',
    studioActionText: 'Camera Operator lines up the perfect 16:9 cinematic shot!',
    diagram: {
      blocksA: 2,
      blocksB: 3,
      multiplier: 3,
      totalUnits: 5,
    },
    misconceptions: [
      {
        wrongAnswer: 6,
        reason: 'Kept the numbers equal instead of multiplying by the scale factor 3.',
      },
      {
        wrongAnswer: 8,
        reason: 'Added 2+6 instead of multiplying the 3 parts by 3.',
      },
      {
        wrongAnswer: 12,
        reason: 'Multiplied by 4 instead of 3.',
      },
    ],
  },
  {
    id: 'q2_chroma_paint',
    stage: 2,
    title: 'Stage 2: Chroma Green Paint Mix',
    scenario: 'Art Department mixing paint for the green screen.',
    mathPrompt:
      'To mix green screen backdrop paint, the ratio of Blue dye to Green paint is 3 : 5. If the painter uses 20 liters of Green paint, how many liters of Blue dye are needed?',
    ratioA: 3,
    ratioB: 5,
    labelA: 'Blue Dye (L)',
    labelB: 'Green Paint (L)',
    targetQuantityName: 'Blue Dye',
    givenQuantityName: 'Green Paint',
    givenQuantityValue: 20,
    correctAnswer: 12,
    correctUnit: 'liters',
    options: [8, 10, 12, 15],
    unitRateExplanation:
      'Green paint has 5 parts for 20 L, so 1 part = 20 ÷ 5 = 4 L. Blue dye is 3 parts × 4 L = 12 liters (3 : 5 = 12 : 20).',
    studioActionText: 'Stagehands finish painting the bright green cyclorama wall!',
    diagram: {
      blocksA: 3,
      blocksB: 5,
      multiplier: 4,
      totalUnits: 8,
    },
    misconceptions: [
      {
        wrongAnswer: 8,
        reason: 'Multiplied by 2.6 instead of the 4× scale factor.',
      },
      {
        wrongAnswer: 10,
        reason: 'Estimated half of 20 instead of setting up the ratio 3 : 5.',
      },
      {
        wrongAnswer: 15,
        reason: 'Subtracted 5 from 20 instead of multiplying 3 × 4.',
      },
    ],
  },
  {
    id: 'q3_slowmo_action',
    stage: 3,
    title: 'Stage 3: Slow-Motion Action Stunt',
    scenario: 'Stunt Coordinator calculating slow-motion replay time.',
    mathPrompt:
      'The slow-motion camera expands time in a ratio of 1 : 4 (1 real second = 4 slow-mo seconds). If a jump stunt takes 3 seconds in real time, how many seconds will it play in slow motion?',
    ratioA: 1,
    ratioB: 4,
    labelA: 'Real Seconds (s)',
    labelB: 'Slow-Mo Seconds (s)',
    targetQuantityName: 'Slow-Mo Duration',
    givenQuantityName: 'Real Time Duration',
    givenQuantityValue: 3,
    correctAnswer: 12,
    correctUnit: 'seconds',
    options: [7, 10, 12, 16],
    unitRateExplanation:
      'Every 1 second of action becomes 4 seconds on screen. 3 seconds × 4 = 12 seconds in slow motion (1 : 4 = 3 : 12).',
    studioActionText: 'Lighting Technicians illuminate the stage for the big stunt take!',
    diagram: {
      blocksA: 1,
      blocksB: 4,
      multiplier: 3,
      totalUnits: 5,
    },
    misconceptions: [
      {
        wrongAnswer: 7,
        reason: 'Added 3 + 4 instead of multiplying 3 × 4.',
      },
      {
        wrongAnswer: 10,
        reason: 'Estimated duration without multiplying by the scale factor 4.',
      },
      {
        wrongAnswer: 16,
        reason: 'Multiplied 4 × 4 instead of 3 × 4.',
      },
    ],
  },
  {
    id: 'q4_miniature_prop',
    stage: 4,
    title: 'Stage 4: Miniature Spaceship Prop',
    scenario: 'Prop master scaling a spaceship model for the set.',
    mathPrompt:
      'A mini spaceship prop is built at a scale of 1 : 10 (1 cm model = 10 cm movie scale). If the miniature prop is 5 cm long, what is its movie scale length in cm?',
    ratioA: 1,
    ratioB: 10,
    labelA: 'Mini Model (cm)',
    labelB: 'Movie Scale (cm)',
    targetQuantityName: 'Movie Scale Length',
    givenQuantityName: 'Mini Model Length',
    givenQuantityValue: 5,
    correctAnswer: 50,
    correctUnit: 'cm',
    options: [30, 40, 50, 60],
    unitRateExplanation:
      'Scale 1 : 10 means multiply by 10. 5 cm × 10 = 50 cm in movie scale (1 : 10 = 5 : 50).',
    studioActionText: 'Prop Master places the glowing Spaceship Prop onto the set!',
    diagram: {
      blocksA: 1,
      blocksB: 10,
      multiplier: 5,
      totalUnits: 11,
    },
    misconceptions: [
      {
        wrongAnswer: 30,
        reason: 'Multiplied by 6 instead of 10.',
      },
      {
        wrongAnswer: 40,
        reason: 'Multiplied by 8 instead of 10.',
      },
      {
        wrongAnswer: 60,
        reason: 'Added 10 + 50 instead of multiplying 5 × 10.',
      },
    ],
  },
  {
    id: 'q5_budget_split',
    stage: 5,
    title: 'Stage 5: Finale Budget Division',
    scenario: 'Director sharing $50 between Actors and Crew.',
    mathPrompt:
      'The director shares a $50 snack budget between Actors and Crew in a ratio of 3 : 2 (3 parts for Actors, 2 parts for Crew). How many dollars do the Actors receive?',
    ratioA: 3,
    ratioB: 2,
    labelA: 'Actor Share ($)',
    labelB: 'Crew Share ($)',
    targetQuantityName: 'Actor Budget Share',
    givenQuantityName: 'Total Budget ($)',
    givenQuantityValue: 50,
    correctAnswer: 30,
    correctUnit: '$',
    options: [20, 25, 30, 35],
    unitRateExplanation:
      'Total parts = 3 + 2 = 5 parts. 1 part = $50 ÷ 5 = $10. Actors get 3 parts × $10 = $30 (3 : 2 = $30 : $20).',
    studioActionText:
      'Director shouts: "PICTURE READY! Camera speed, sound rolling... ACTION!"',
    diagram: {
      blocksA: 3,
      blocksB: 2,
      multiplier: 10,
      totalUnits: 5,
    },
    misconceptions: [
      {
        wrongAnswer: 20,
        reason: 'Calculated the Crew share (2 parts = $20) instead of the Actor share (3 parts = $30).',
      },
      {
        wrongAnswer: 25,
        reason: 'Split the $50 equally in half (1:1) instead of the 3:2 ratio.',
      },
      {
        wrongAnswer: 35,
        reason: 'Estimated without calculating the exact $10 per part value.',
      },
    ],
  },
];
