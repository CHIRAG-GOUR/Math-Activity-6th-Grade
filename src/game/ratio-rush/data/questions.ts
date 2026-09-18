// ============================================================
// RATIO RUSH — GRADE 6 RATIO & PROPORTION QUESTIONS (SIMPLIFIED)
// Clear, engaging 6th-grade math scenarios with intuitive scaling
// ============================================================

import { RatioQuestion } from '../types';

export const RATIO_QUESTIONS: RatioQuestion[] = [
  {
    id: 'q1_camera_shots',
    stage: 1,
    title: 'Stage 1: Camera Shot Ratio',
    scenario: 'Director framing Close-up shots and Wide shots.',
    mathPrompt:
      'For every 2 Close-up shots, the camera team shoots 3 Wide shots (Ratio 2 : 3). If they shoot 6 Close-up shots, how many Wide shots are needed?',
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
      '6 Close-ups is 3 times the original 2 parts (2 × 3 = 6). Multiply 3 Wide parts × 3 = 9 Wide shots (2 : 3 = 6 : 9).',
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
        reason: 'Added 2 + 6 instead of multiplying the 3 parts by 3.',
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
    title: 'Stage 2: Green Screen Paint Mix',
    scenario: 'Art Department mixing paint for the green screen backdrop.',
    mathPrompt:
      'To mix green screen backdrop paint, the painter uses 1 cup of Blue dye for every 3 cups of Green paint (Ratio 1 : 3). If they use 12 cups of Green paint, how many cups of Blue dye are needed?',
    ratioA: 1,
    ratioB: 3,
    labelA: 'Blue Dye (cups)',
    labelB: 'Green Paint (cups)',
    targetQuantityName: 'Blue Dye',
    givenQuantityName: 'Green Paint',
    givenQuantityValue: 12,
    correctAnswer: 4,
    correctUnit: 'cups',
    options: [3, 4, 6, 9],
    unitRateExplanation:
      '12 cups of Green paint is 4 times 3 parts (12 ÷ 3 = 4). So 1 cup of Blue dye × 4 = 4 cups (1 : 3 = 4 : 12).',
    studioActionText: 'Stagehands finish painting the bright green cyclorama wall!',
    diagram: {
      blocksA: 1,
      blocksB: 3,
      multiplier: 4,
      totalUnits: 4,
    },
    misconceptions: [
      {
        wrongAnswer: 3,
        reason: 'Guessed 3 instead of dividing 12 by 3 to find the scale factor 4.',
      },
      {
        wrongAnswer: 6,
        reason: 'Divided 12 by 2 instead of 3.',
      },
      {
        wrongAnswer: 9,
        reason: 'Subtracted 12 - 3 instead of dividing 12 ÷ 3.',
      },
    ],
  },
  {
    id: 'q3_slowmo_action',
    stage: 3,
    title: 'Stage 3: Slow-Motion Action Stunt',
    scenario: 'Stunt Coordinator calculating slow-motion replay time.',
    mathPrompt:
      'The slow-motion camera expands time in a ratio of 1 : 4 (1 second of real stunt = 4 seconds of slow-mo). If an actor jumps for 3 seconds in real time, how many seconds will it play in slow motion?',
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
      'A miniature spaceship prop is built at a scale ratio of 1 : 10 (1 cm on model = 10 cm in movie size). If the miniature prop is 5 cm long, what is its movie size in cm?',
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
    scenario: 'Director sharing $30 snack budget between Actors and Crew.',
    mathPrompt:
      'The director shares a $30 snack budget between Actors and Crew in a ratio of 2 : 1 (2 parts for Actors, 1 part for Crew). How many dollars do the Actors receive?',
    ratioA: 2,
    ratioB: 1,
    labelA: 'Actor Share ($)',
    labelB: 'Crew Share ($)',
    targetQuantityName: 'Actor Budget Share',
    givenQuantityName: 'Total Budget ($)',
    givenQuantityValue: 30,
    correctAnswer: 20,
    correctUnit: '$',
    options: [10, 15, 20, 25],
    unitRateExplanation:
      'Total parts = 2 + 1 = 3 parts. 1 part = $30 ÷ 3 = $10. Actors get 2 parts × $10 = $20 (2 : 1 = $20 : $10).',
    studioActionText:
      'Director shouts: "PICTURE READY! Camera speed, sound rolling... ACTION!"',
    diagram: {
      blocksA: 2,
      blocksB: 1,
      multiplier: 10,
      totalUnits: 3,
    },
    misconceptions: [
      {
        wrongAnswer: 10,
        reason: 'Calculated the Crew share (1 part = $10) instead of the Actor share (2 parts = $20).',
      },
      {
        wrongAnswer: 15,
        reason: 'Split $30 equally in half (1 : 1) instead of using the 2 : 1 ratio.',
      },
      {
        wrongAnswer: 25,
        reason: 'Estimated without calculating the exact $10 value per part.',
      },
    ],
  },
];
