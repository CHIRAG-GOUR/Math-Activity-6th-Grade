// ============================================================
// RATIO RUSH — GRADE 6 RATIO & PROPORTION QUESTIONS
// Standard-aligned mathematical scenarios mapped to movie studio production
// ============================================================

import { RatioQuestion } from '../types';

export const RATIO_QUESTIONS: RatioQuestion[] = [
  {
    id: 'q1_aspect_ratio',
    stage: 1,
    title: 'Stage 1: Camera Aspect Ratio & Framing',
    scenario: 'Director framing a cinematic widescreen sequence with 16:9 ratio.',
    mathPrompt:
      'The cinema camera sensor uses an aspect ratio of 16 : 9 (Width to Height). If the height is set to 450 mm, what is the required sensor width in mm?',
    ratioA: 16,
    ratioB: 9,
    labelA: 'Sensor Width (mm)',
    labelB: 'Sensor Height (mm)',
    targetQuantityName: 'Sensor Width',
    givenQuantityName: 'Sensor Height',
    givenQuantityValue: 450,
    correctAnswer: 800,
    correctUnit: 'mm',
    options: [720, 800, 850, 900],
    unitRateExplanation:
      'Divide given height 450 mm by 9 parts = 50 mm per part. Multiply 16 parts × 50 mm = 800 mm width (16 : 9 = 800 : 450).',
    studioActionText: 'Camera Operator aligns the cinema lens & Dolly Grip locks track alignment!',
    diagram: {
      blocksA: 16,
      blocksB: 9,
      multiplier: 50,
      totalUnits: 25,
    },
    misconceptions: [
      {
        wrongAnswer: 720,
        reason: 'Added 450 + (16 × 9) instead of finding the scaling factor multiplier.',
      },
      {
        wrongAnswer: 850,
        reason: 'Estimated width without multiplying by the exact unit scale factor (50).',
      },
      {
        wrongAnswer: 900,
        reason: 'Doubled the 450 height directly without applying the 16 : 9 ratio.',
      },
    ],
  },
  {
    id: 'q2_chroma_paint',
    stage: 2,
    title: 'Stage 2: Chroma-Key Studio Paint Mix',
    scenario: 'Art Department mixing special soundstage backdrop paint.',
    mathPrompt:
      'The studio backdrop formula requires mixing Blue Base paint to Green Pigment in the ratio 3 : 5. If the crew uses 25 liters of Green Pigment, how many liters of Blue Base are required?',
    ratioA: 3,
    ratioB: 5,
    labelA: 'Blue Base (L)',
    labelB: 'Green Pigment (L)',
    targetQuantityName: 'Blue Base',
    givenQuantityName: 'Green Pigment',
    givenQuantityValue: 25,
    correctAnswer: 15,
    correctUnit: 'liters',
    options: [12, 15, 18, 20],
    unitRateExplanation:
      'Green has 5 parts for 25 L, so 1 part = 25 ÷ 5 = 5 L. Blue Base has 3 parts × 5 L = 15 liters (3 : 5 = 15 : 25).',
    studioActionText: 'Stagehands finish painting & illuminate the massive Chroma-Key Soundstage Wall!',
    diagram: {
      blocksA: 3,
      blocksB: 5,
      multiplier: 5,
      totalUnits: 8,
    },
    misconceptions: [
      {
        wrongAnswer: 12,
        reason: 'Multiplied 3 parts by 4 instead of calculating 25 ÷ 5 = 5 L per part.',
      },
      {
        wrongAnswer: 18,
        reason: 'Subtracted 25 - (3+5) instead of setting up equal ratio fractions.',
      },
      {
        wrongAnswer: 20,
        reason: 'Subtracted 5 from 25 instead of using multiplicative scaling.',
      },
    ],
  },
  {
    id: 'q3_slowmo_framerate',
    stage: 3,
    title: 'Stage 3: High-Speed Stunt Frame Rate',
    scenario: 'Stunt Coordinator calculating slow-motion playback timing.',
    mathPrompt:
      'A normal camera shoots at 24 fps, while the stunt camera shoots at 120 fps, creating a time expansion ratio of 1 : 5 (Real Time to Slow-Mo Playback Time). If a stunt lasts 4 seconds in real time, how long will it play in slow-mo?',
    ratioA: 1,
    ratioB: 5,
    labelA: 'Real Seconds (s)',
    labelB: 'Slow-Mo Seconds (s)',
    targetQuantityName: 'Slow-Mo Duration',
    givenQuantityName: 'Real Time Duration',
    givenQuantityValue: 4,
    correctAnswer: 20,
    correctUnit: 'seconds',
    options: [16, 20, 24, 30],
    unitRateExplanation:
      'Each 1 second of real action expands into 5 seconds of footage. 4 seconds × 5 = 20 seconds playback duration.',
    studioActionText: 'Lighting Technicians aim overhead Fresnel Spotlights onto the Hero stunt mark!',
    diagram: {
      blocksA: 1,
      blocksB: 5,
      multiplier: 4,
      totalUnits: 6,
    },
    misconceptions: [
      {
        wrongAnswer: 16,
        reason: 'Multiplied 4 × 4 instead of using the 1 : 5 frame rate multiplier.',
      },
      {
        wrongAnswer: 24,
        reason: 'Confused the 24 fps base rate with the total duration in seconds.',
      },
      {
        wrongAnswer: 30,
        reason: 'Added 24 + 4 instead of multiplying real time by the slow-mo factor 5.',
      },
    ],
  },
  {
    id: 'q4_scale_model_prop',
    stage: 4,
    title: 'Stage 4: Architectural Miniature Prop Scale',
    scenario: 'Prop master building a sci-fi tower model for the cinematic backdrop.',
    mathPrompt:
      'The studio model maker builds a miniature sci-fi generator at a scale ratio of 1 : 30 (Miniature Prop to Real-Life Structure). If the real structure is 60 meters tall, how tall is the studio miniature prop in meters?',
    ratioA: 1,
    ratioB: 30,
    labelA: 'Miniature Height (m)',
    labelB: 'Real Structure Height (m)',
    targetQuantityName: 'Miniature Height',
    givenQuantityName: 'Real Structure Height',
    givenQuantityValue: 60,
    correctAnswer: 2,
    correctUnit: 'meters',
    options: [2, 3, 4, 6],
    unitRateExplanation:
      'Scale 1 : 30 means 1 meter of model equals 30 meters in reality. For 60 meters, model height = 60 ÷ 30 = 2 meters.',
    studioActionText: 'Prop Master carries the glowing Sci-Fi Energy Generator Prop onto the main set!',
    diagram: {
      blocksA: 1,
      blocksB: 30,
      multiplier: 2,
      totalUnits: 31,
    },
    misconceptions: [
      {
        wrongAnswer: 3,
        reason: 'Divided 60 by 20 instead of the exact scale ratio factor 30.',
      },
      {
        wrongAnswer: 4,
        reason: 'Subtracted 30 from 60 and divided by 10 instead of ratio reduction.',
      },
      {
        wrongAnswer: 6,
        reason: 'Divided 60 by 10 instead of 30.',
      },
    ],
  },
  {
    id: 'q5_budget_division',
    stage: 5,
    title: 'Stage 5: Studio Production Budget Sharing',
    scenario: 'Studio Executive Board distributing the climactic finale budget.',
    mathPrompt:
      'The studio divides its $70,000 finale budget between Visual Effects (VFX) and Sound Engineering in the ratio 4 : 3. What is the dollar amount allocated to Visual Effects?',
    ratioA: 4,
    ratioB: 3,
    labelA: 'VFX Share (parts)',
    labelB: 'Sound Share (parts)',
    targetQuantityName: 'VFX Budget Share',
    givenQuantityName: 'Total Budget ($)',
    givenQuantityValue: 70000,
    correctAnswer: 40000,
    correctUnit: '$',
    options: [30000, 35000, 40000, 45000],
    unitRateExplanation:
      'Total parts = 4 + 3 = 7 parts. 1 part = $70,000 ÷ 7 = $10,000. VFX receives 4 parts × $10,000 = $40,000.',
    studioActionText:
      'Director raises hand: "PICTURE READY! Sound rolling, camera speed... ACTION!"',
    diagram: {
      blocksA: 4,
      blocksB: 3,
      multiplier: 10000,
      totalUnits: 7,
    },
    misconceptions: [
      {
        wrongAnswer: 30000,
        reason: 'Calculated the Sound Engineering share (3 parts) instead of the VFX share (4 parts).',
      },
      {
        wrongAnswer: 35000,
        reason: 'Split the $70,000 equally in half (1:1) instead of using the 4:3 ratio.',
      },
      {
        wrongAnswer: 45000,
        reason: 'Estimated without calculating the exact unit part value ($10,000).',
      },
    ],
  },
];
