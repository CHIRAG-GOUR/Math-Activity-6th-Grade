// ============================================================
// EQUATION MISSION CONTROL — Challenge & Mission Engine
// Grade 6: Expressions, Formulae & Equations (Kid-Friendly Pool)
//
// 5 LAUNCH PREPARATION STAGES:
//   Stage 1: AVIONICS & FLIGHT COMPUTER (Algebraic Expressions)
//   Stage 2: CRYOGENIC PROPELLANT LOADING (Variable Substitution)
//   Stage 3: ENGINE THRUST BALANCING (One-Step Linear Equations)
//   Stage 4: ORBITAL GUIDANCE & NAVIGATION (Speed & Distance Formulae)
//   Stage 5: LAUNCH INTERLOCK ARMING & COUNTDOWN (Two-Step Equations)
// ============================================================

import { MissionChallenge, MissionCampaign } from '../types';

// ============================================================
// ── STAGE 1: AVIONICS & FLIGHT COMPUTER (Algebraic Expressions) ──
// Target: Form algebraic expressions from friendly word phrases.
// ============================================================

export const STAGE_1_QUESTIONS: Omit<MissionChallenge, 'stageId' | 'stageIndex'>[] = [
  {
    id: 's1-01',
    stageTitle: 'STAGE 1: AVIONICS CONFIGURATION',
    stageSubtitle: 'Flight Computer Expression',
    missionCode: 'AVN-EXP-01',
    bloomLevel: 'understand',
    points: 100,
    timeLimit: 35,
    briefingPrompt: 'Which expression means "5 more than x"?',
    options: [
      { value: 'x + 5', label: 'x + 5' },
      { value: '5x', label: '5x' },
      { value: 'x - 5', label: 'x - 5' },
      { value: '5 - x', label: '5 - x' },
    ],
    correctAnswer: 'x + 5',
    hint: '"More than" means we add: start with x and add 5.',
    educationalTakeaway: '"5 more than x" is written algebraically as x + 5.',
  },
  {
    id: 's1-02',
    stageTitle: 'STAGE 1: AVIONICS CONFIGURATION',
    stageSubtitle: 'Booster Telemetry Channel',
    missionCode: 'AVN-EXP-02',
    bloomLevel: 'understand',
    points: 100,
    timeLimit: 35,
    briefingPrompt: 'Which expression means "twice a number n"?',
    options: [
      { value: '2n', label: '2n' },
      { value: 'n + 2', label: 'n + 2' },
      { value: 'n - 2', label: 'n - 2' },
      { value: 'n / 2', label: 'n ÷ 2' },
    ],
    correctAnswer: '2n',
    hint: '"Twice" means 2 times n (written as 2n).',
    educationalTakeaway: '"Twice a number n" means 2 multiplied by n, written as 2n.',
  },
  {
    id: 's1-03',
    stageTitle: 'STAGE 1: AVIONICS CONFIGURATION',
    stageSubtitle: 'Cabin Pressure Channel',
    missionCode: 'AVN-EXP-03',
    bloomLevel: 'understand',
    points: 100,
    timeLimit: 35,
    briefingPrompt: 'Which expression means "4 less than y"?',
    options: [
      { value: 'y - 4', label: 'y - 4' },
      { value: '4 - y', label: '4 - y' },
      { value: '4y', label: '4y' },
      { value: 'y + 4', label: 'y + 4' },
    ],
    correctAnswer: 'y - 4',
    hint: '"4 less than y" means you start with y and subtract 4.',
    educationalTakeaway: '"4 less than y" means y minus 4, which is y - 4.',
  },
  {
    id: 's1-04',
    stageTitle: 'STAGE 1: AVIONICS CONFIGURATION',
    stageSubtitle: 'RCS Thruster Signal',
    missionCode: 'AVN-EXP-04',
    bloomLevel: 'apply',
    points: 110,
    timeLimit: 35,
    briefingPrompt: 'Which expression means "3 times x, plus 2"?',
    options: [
      { value: '3x + 2', label: '3x + 2' },
      { value: '2x + 3', label: '2x + 3' },
      { value: '3x - 2', label: '3x - 2' },
      { value: '3 + x', label: '3 + x' },
    ],
    correctAnswer: '3x + 2',
    hint: 'First multiply 3 by x (3x), then add 2 (+ 2).',
    educationalTakeaway: '"3 times x plus 2" is assembled as 3x + 2.',
  },
  {
    id: 's1-05',
    stageTitle: 'STAGE 1: AVIONICS CONFIGURATION',
    stageSubtitle: 'Solar Array Voltage Bus',
    missionCode: 'AVN-EXP-05',
    bloomLevel: 'apply',
    points: 110,
    timeLimit: 35,
    briefingPrompt: 'Which expression means "half of a number k"?',
    options: [
      { value: 'k / 2', label: 'k ÷ 2' },
      { value: '2k', label: '2k' },
      { value: 'k - 2', label: 'k - 2' },
      { value: 'k + 2', label: 'k + 2' },
    ],
    correctAnswer: 'k / 2',
    hint: 'Taking half of a number means dividing it by 2 (k ÷ 2 or k/2).',
    educationalTakeaway: 'Half of k is written as k ÷ 2 or k/2.',
  },
  {
    id: 's1-06',
    stageTitle: 'STAGE 1: AVIONICS CONFIGURATION',
    stageSubtitle: 'Guidance Bus Allocation',
    missionCode: 'AVN-EXP-06',
    bloomLevel: 'apply',
    points: 110,
    timeLimit: 35,
    briefingPrompt: 'Which expression means "7 added to 4 times p"?',
    options: [
      { value: '4p + 7', label: '4p + 7' },
      { value: '7p + 4', label: '7p + 4' },
      { value: '4p - 7', label: '4p - 7' },
      { value: '11p', label: '11p' },
    ],
    correctAnswer: '4p + 7',
    hint: '"4 times p" is 4p. Adding 7 gives 4p + 7.',
    educationalTakeaway: '"7 added to 4 times p" gives the expression 4p + 7.',
  },
  {
    id: 's1-07',
    stageTitle: 'STAGE 1: AVIONICS CONFIGURATION',
    stageSubtitle: 'Heat Shield Telemetry',
    missionCode: 'AVN-EXP-07',
    bloomLevel: 'understand',
    points: 100,
    timeLimit: 35,
    briefingPrompt: 'Which expression means "6 subtracted from x"?',
    options: [
      { value: 'x - 6', label: 'x - 6' },
      { value: '6 - x', label: '6 - x' },
      { value: '6x', label: '6x' },
      { value: 'x + 6', label: 'x + 6' },
    ],
    correctAnswer: 'x - 6',
    hint: 'Subtract 6 from x: start with x and take away 6.',
    educationalTakeaway: '"6 subtracted from x" is written as x - 6.',
  },
];

// ============================================================
// ── STAGE 2: CRYOGENIC PROPELLANT LOADING (Substitution) ──
// Target: Evaluate algebraic expressions by substituting numbers.
// ============================================================

export const STAGE_2_QUESTIONS: Omit<MissionChallenge, 'stageId' | 'stageIndex'>[] = [
  {
    id: 's2-01',
    stageTitle: 'STAGE 2: FUEL SYSTEM ACTIVATION',
    stageSubtitle: 'Liquid Oxygen Flow',
    missionCode: 'FUEL-SUB-01',
    bloomLevel: 'apply',
    points: 120,
    timeLimit: 35,
    briefingPrompt: 'If x = 4, what is the fuel level: x + 5 = ?',
    options: [
      { value: 9, label: '9 Liters' },
      { value: 20, label: '20 Liters' },
      { value: 1, label: '1 Liter' },
      { value: 8, label: '8 Liters' },
    ],
    correctAnswer: 9,
    hint: 'Replace x with 4: 4 + 5 = 9.',
    educationalTakeaway: 'Substituting x = 4 gives 4 + 5 = 9 Liters.',
  },
  {
    id: 's2-02',
    stageTitle: 'STAGE 2: FUEL SYSTEM ACTIVATION',
    stageSubtitle: 'Oxidizer Tank Volume',
    missionCode: 'FUEL-SUB-02',
    bloomLevel: 'apply',
    points: 120,
    timeLimit: 35,
    briefingPrompt: 'If n = 6, what is the oxidizer value: 2n = ?',
    options: [
      { value: 12, label: '12 Bar' },
      { value: 8, label: '8 Bar' },
      { value: 16, label: '16 Bar' },
      { value: 62, label: '62 Bar' },
    ],
    correctAnswer: 12,
    hint: '2n means 2 × n. Since n = 6, calculate 2 × 6.',
    educationalTakeaway: '2n = 2 × 6 = 12 Bar.',
  },
  {
    id: 's2-03',
    stageTitle: 'STAGE 2: FUEL SYSTEM ACTIVATION',
    stageSubtitle: 'Coolant Flow Rate',
    missionCode: 'FUEL-SUB-03',
    bloomLevel: 'apply',
    points: 125,
    timeLimit: 35,
    briefingPrompt: 'If y = 3, calculate the coolant formula: 2y + 4 = ?',
    options: [
      { value: 10, label: '10 Units' },
      { value: 14, label: '14 Units' },
      { value: 9, label: '9 Units' },
      { value: 12, label: '12 Units' },
    ],
    correctAnswer: 10,
    hint: 'Multiply first: 2 × 3 = 6. Then add 4: 6 + 4 = 10.',
    educationalTakeaway: '2(3) + 4 = 6 + 4 = 10 Units.',
  },
  {
    id: 's2-04',
    stageTitle: 'STAGE 2: FUEL SYSTEM ACTIVATION',
    stageSubtitle: 'Main Boost Injector',
    missionCode: 'FUEL-SUB-04',
    bloomLevel: 'apply',
    points: 125,
    timeLimit: 35,
    briefingPrompt: 'If x = 5, calculate injector pressure: 3x - 2 = ?',
    options: [
      { value: 13, label: '13 PSI' },
      { value: 15, label: '15 PSI' },
      { value: 17, label: '17 PSI' },
      { value: 9, label: '9 PSI' },
    ],
    correctAnswer: 13,
    hint: 'First multiply 3 × 5 = 15, then subtract 2: 15 - 2 = 13.',
    educationalTakeaway: '3(5) - 2 = 15 - 2 = 13 PSI.',
  },
  {
    id: 's2-05',
    stageTitle: 'STAGE 2: FUEL SYSTEM ACTIVATION',
    stageSubtitle: 'Propellant Tank Pressure',
    missionCode: 'FUEL-SUB-05',
    bloomLevel: 'apply',
    points: 130,
    timeLimit: 35,
    briefingPrompt: 'If a = 10, calculate the tank volume: a ÷ 2 + 3 = ?',
    options: [
      { value: 8, label: '8 kL' },
      { value: 5, label: '5 kL' },
      { value: 13, label: '13 kL' },
      { value: 10, label: '10 kL' },
    ],
    correctAnswer: 8,
    hint: 'Divide 10 by 2 (gives 5), then add 3: 5 + 3 = 8.',
    educationalTakeaway: '10 ÷ 2 + 3 = 5 + 3 = 8 kL.',
  },
  {
    id: 's2-06',
    stageTitle: 'STAGE 2: FUEL SYSTEM ACTIVATION',
    stageSubtitle: 'Booster Pump Flow',
    missionCode: 'FUEL-SUB-06',
    bloomLevel: 'apply',
    points: 130,
    timeLimit: 35,
    briefingPrompt: 'If p = 7, calculate power: 4p + 2 = ?',
    options: [
      { value: 30, label: '30 MW' },
      { value: 28, label: '28 MW' },
      { value: 32, label: '32 MW' },
      { value: 26, label: '26 MW' },
    ],
    correctAnswer: 30,
    hint: '4 × 7 = 28. Then 28 + 2 = 30.',
    educationalTakeaway: '4(7) + 2 = 28 + 2 = 30 MW.',
  },
];

// ============================================================
// ── STAGE 3: ENGINE THRUST BALANCING (One-Step Equations) ──
// Target: Solve simple one-step linear equations.
// ============================================================

export const STAGE_3_QUESTIONS: Omit<MissionChallenge, 'stageId' | 'stageIndex'>[] = [
  {
    id: 's3-01',
    stageTitle: 'STAGE 3: ENGINE POWER BALANCING',
    stageSubtitle: 'Combustion Chamber Balance',
    missionCode: 'ENG-BAL-01',
    bloomLevel: 'apply',
    points: 140,
    timeLimit: 40,
    briefingPrompt: 'Balance the engine: Solve x + 4 = 10',
    options: [
      { value: 'x = 6', label: 'x = 6' },
      { value: 'x = 14', label: 'x = 14' },
      { value: 'x = 4', label: 'x = 4' },
      { value: 'x = 40', label: 'x = 40' },
    ],
    correctAnswer: 'x = 6',
    hint: 'Subtract 4 from both sides: 10 - 4 = 6.',
    educationalTakeaway: 'x + 4 = 10  ⟹  x = 10 - 4  ⟹  x = 6.',
  },
  {
    id: 's3-02',
    stageTitle: 'STAGE 3: ENGINE POWER BALANCING',
    stageSubtitle: 'Thrust Chamber Equilibrium',
    missionCode: 'ENG-BAL-02',
    bloomLevel: 'apply',
    points: 140,
    timeLimit: 40,
    briefingPrompt: 'Balance the engine: Solve y - 3 = 8',
    options: [
      { value: 'y = 11', label: 'y = 11' },
      { value: 'y = 5', label: 'y = 5' },
      { value: 'y = 24', label: 'y = 24' },
      { value: 'y = 8', label: 'y = 8' },
    ],
    correctAnswer: 'y = 11',
    hint: 'Add 3 to both sides: 8 + 3 = 11.',
    educationalTakeaway: 'y - 3 = 8  ⟹  y = 8 + 3  ⟹  y = 11.',
  },
  {
    id: 's3-03',
    stageTitle: 'STAGE 3: ENGINE POWER BALANCING',
    stageSubtitle: 'Turbopump Flow Equalizer',
    missionCode: 'ENG-BAL-03',
    bloomLevel: 'apply',
    points: 140,
    timeLimit: 40,
    briefingPrompt: 'Balance the engine: Solve 3n = 15',
    options: [
      { value: 'n = 5', label: 'n = 5' },
      { value: 'n = 12', label: 'n = 12' },
      { value: 'n = 18', label: 'n = 18' },
      { value: 'n = 45', label: 'n = 45' },
    ],
    correctAnswer: 'n = 5',
    hint: 'Divide both sides by 3: 15 ÷ 3 = 5.',
    educationalTakeaway: '3n = 15  ⟹  n = 15 ÷ 3  ⟹  n = 5.',
  },
  {
    id: 's3-04',
    stageTitle: 'STAGE 3: ENGINE POWER BALANCING',
    stageSubtitle: 'Ignition Core Resistance',
    missionCode: 'ENG-BAL-04',
    bloomLevel: 'apply',
    points: 150,
    timeLimit: 40,
    briefingPrompt: 'Balance the engine: Solve x + 7 = 16',
    options: [
      { value: 'x = 9', label: 'x = 9' },
      { value: 'x = 23', label: 'x = 23' },
      { value: 'x = 7', label: 'x = 7' },
      { value: 'x = 11', label: 'x = 11' },
    ],
    correctAnswer: 'x = 9',
    hint: 'Subtract 7 from both sides: 16 - 7 = 9.',
    educationalTakeaway: 'x + 7 = 16  ⟹  x = 16 - 7  ⟹  x = 9.',
  },
  {
    id: 's3-05',
    stageTitle: 'STAGE 3: ENGINE POWER BALANCING',
    stageSubtitle: 'Gimbal Vector Power',
    missionCode: 'ENG-BAL-05',
    bloomLevel: 'apply',
    points: 150,
    timeLimit: 40,
    briefingPrompt: 'Balance the engine: Solve 2x = 18',
    options: [
      { value: 'x = 9', label: 'x = 9' },
      { value: 'x = 36', label: 'x = 36' },
      { value: 'x = 20', label: 'x = 20' },
      { value: 'x = 16', label: 'x = 16' },
    ],
    correctAnswer: 'x = 9',
    hint: 'Divide both sides by 2: 18 ÷ 2 = 9.',
    educationalTakeaway: '2x = 18  ⟹  x = 18 ÷ 2  ⟹  x = 9.',
  },
  {
    id: 's3-06',
    stageTitle: 'STAGE 3: ENGINE POWER BALANCING',
    stageSubtitle: 'Plasma Ignition Core',
    missionCode: 'ENG-BAL-06',
    bloomLevel: 'apply',
    points: 150,
    timeLimit: 40,
    briefingPrompt: 'Balance the engine: Solve p - 6 = 7',
    options: [
      { value: 'p = 13', label: 'p = 13' },
      { value: 'p = 1', label: 'p = 1' },
      { value: 'p = 42', label: 'p = 42' },
      { value: 'p = 12', label: 'p = 12' },
    ],
    correctAnswer: 'p = 13',
    hint: 'Add 6 to both sides: 7 + 6 = 13.',
    educationalTakeaway: 'p - 6 = 7  ⟹  p = 7 + 6  ⟹  p = 13.',
  },
];

// ============================================================
// ── STAGE 4: ORBITAL GUIDANCE (Distance = Speed × Time) ──
// Target: Apply scientific formula D = S × T.
// ============================================================

export const STAGE_4_QUESTIONS: Omit<MissionChallenge, 'stageId' | 'stageIndex'>[] = [
  {
    id: 's4-01',
    stageTitle: 'STAGE 4: NAVIGATION CALIBRATION',
    stageSubtitle: 'Orbital Distance Vector',
    missionCode: 'NAV-CAL-01',
    bloomLevel: 'apply',
    points: 160,
    timeLimit: 40,
    briefingPrompt: 'Formula: Distance = Speed × Time. If Speed = 4 km/s and Time = 3 s, find Distance:',
    options: [
      { value: '12 km', label: '12 km' },
      { value: '7 km', label: '7 km' },
      { value: '1 km', label: '1 km' },
      { value: '14 km', label: '14 km' },
    ],
    correctAnswer: '12 km',
    hint: 'Multiply Speed by Time: 4 × 3 = 12.',
    educationalTakeaway: 'Distance = Speed × Time = 4 km/s × 3 s = 12 km.',
  },
  {
    id: 's4-02',
    stageTitle: 'STAGE 4: NAVIGATION CALIBRATION',
    stageSubtitle: 'Escape Velocity Arc',
    missionCode: 'NAV-CAL-02',
    bloomLevel: 'apply',
    points: 160,
    timeLimit: 40,
    briefingPrompt: 'Formula: Distance = Speed × Time. If Speed = 6 km/s and Time = 5 s, find Distance:',
    options: [
      { value: '30 km', label: '30 km' },
      { value: '11 km', label: '11 km' },
      { value: '1 km', label: '1 km' },
      { value: '35 km', label: '35 km' },
    ],
    correctAnswer: '30 km',
    hint: 'Multiply Speed by Time: 6 × 5 = 30.',
    educationalTakeaway: 'Distance = Speed × Time = 6 km/s × 5 s = 30 km.',
  },
  {
    id: 's4-03',
    stageTitle: 'STAGE 4: NAVIGATION CALIBRATION',
    stageSubtitle: 'Low Earth Orbit Vector',
    missionCode: 'NAV-CAL-03',
    bloomLevel: 'apply',
    points: 160,
    timeLimit: 40,
    briefingPrompt: 'Formula: Distance = Speed × Time. If Speed = 10 km/s and Time = 4 s, find Distance:',
    options: [
      { value: '40 km', label: '40 km' },
      { value: '14 km', label: '14 km' },
      { value: '6 km', label: '6 km' },
      { value: '44 km', label: '44 km' },
    ],
    correctAnswer: '40 km',
    hint: 'Multiply Speed by Time: 10 × 4 = 40.',
    educationalTakeaway: 'Distance = Speed × Time = 10 km/s × 4 s = 40 km.',
  },
  {
    id: 's4-04',
    stageTitle: 'STAGE 4: NAVIGATION CALIBRATION',
    stageSubtitle: 'Atmospheric Exit Arc',
    missionCode: 'NAV-CAL-04',
    bloomLevel: 'apply',
    points: 165,
    timeLimit: 40,
    briefingPrompt: 'Formula: Distance = Speed × Time. If Speed = 8 km/s and Time = 2 s, find Distance:',
    options: [
      { value: '16 km', label: '16 km' },
      { value: '10 km', label: '10 km' },
      { value: '6 km', label: '6 km' },
      { value: '18 km', label: '18 km' },
    ],
    correctAnswer: '16 km',
    hint: 'Multiply Speed by Time: 8 × 2 = 16.',
    educationalTakeaway: 'Distance = Speed × Time = 8 km/s × 2 s = 16 km.',
  },
  {
    id: 's4-05',
    stageTitle: 'STAGE 4: NAVIGATION CALIBRATION',
    stageSubtitle: 'Orbital Rendezvous Vector',
    missionCode: 'NAV-CAL-05',
    bloomLevel: 'apply',
    points: 165,
    timeLimit: 40,
    briefingPrompt: 'Formula: Distance = Speed × Time. If Speed = 7 km/s and Time = 3 s, find Distance:',
    options: [
      { value: '21 km', label: '21 km' },
      { value: '10 km', label: '10 km' },
      { value: '4 km', label: '4 km' },
      { value: '24 km', label: '24 km' },
    ],
    correctAnswer: '21 km',
    hint: 'Multiply Speed by Time: 7 × 3 = 21.',
    educationalTakeaway: 'Distance = Speed × Time = 7 km/s × 3 s = 21 km.',
  },
  {
    id: 's4-06',
    stageTitle: 'STAGE 4: NAVIGATION CALIBRATION',
    stageSubtitle: 'Deep Space Arc',
    missionCode: 'NAV-CAL-06',
    bloomLevel: 'apply',
    points: 170,
    timeLimit: 40,
    briefingPrompt: 'Formula: Distance = Speed × Time. If Speed = 9 km/s and Time = 3 s, find Distance:',
    options: [
      { value: '27 km', label: '27 km' },
      { value: '12 km', label: '12 km' },
      { value: '6 km', label: '6 km' },
      { value: '30 km', label: '30 km' },
    ],
    correctAnswer: '27 km',
    hint: 'Multiply Speed by Time: 9 × 3 = 27.',
    educationalTakeaway: 'Distance = Speed × Time = 9 km/s × 3 s = 27 km.',
  },
];

// ============================================================
// ── STAGE 5: LAUNCH INTERLOCK ARMING (Two-Step Equations) ──
// Target: Solve friendly 2-step linear equations to unlock launch.
// ============================================================

export const STAGE_5_QUESTIONS: Omit<MissionChallenge, 'stageId' | 'stageIndex'>[] = [
  {
    id: 's5-01',
    stageTitle: 'STAGE 5: FINAL LAUNCH EQUATION',
    stageSubtitle: 'Arm Master Ignition Sequence',
    missionCode: 'LCH-ARM-01',
    bloomLevel: 'evaluate',
    points: 200,
    timeLimit: 45,
    briefingPrompt: 'Master Launch Key: Solve 2x + 2 = 10 for x:',
    options: [
      { value: 'x = 4', label: 'x = 4' },
      { value: 'x = 6', label: 'x = 6' },
      { value: 'x = 8', label: 'x = 8' },
      { value: 'x = 5', label: 'x = 5' },
    ],
    correctAnswer: 'x = 4',
    hint: 'Step 1: Subtract 2 from 10 (gives 8). Step 2: Divide by 2 (8 ÷ 2 = 4).',
    educationalTakeaway: '2x + 2 = 10  ⟹  2x = 8  ⟹  x = 4. Master launch key authorized!',
  },
  {
    id: 's5-02',
    stageTitle: 'STAGE 5: FINAL LAUNCH EQUATION',
    stageSubtitle: 'Stage Separation Interlock Key',
    missionCode: 'LCH-ARM-02',
    bloomLevel: 'evaluate',
    points: 200,
    timeLimit: 45,
    briefingPrompt: 'Master Launch Key: Solve 3x + 1 = 16 for x:',
    options: [
      { value: 'x = 5', label: 'x = 5' },
      { value: 'x = 4', label: 'x = 4' },
      { value: 'x = 6', label: 'x = 6' },
      { value: 'x = 3', label: 'x = 3' },
    ],
    correctAnswer: 'x = 5',
    hint: 'Step 1: Subtract 1 from 16 (gives 15). Step 2: Divide by 3 (15 ÷ 3 = 5).',
    educationalTakeaway: '3x + 1 = 16  ⟹  3x = 15  ⟹  x = 5. Stage clamps unlocked!',
  },
  {
    id: 's5-03',
    stageTitle: 'STAGE 5: FINAL LAUNCH EQUATION',
    stageSubtitle: 'Booster Thermal Bypass Key',
    missionCode: 'LCH-ARM-03',
    bloomLevel: 'evaluate',
    points: 210,
    timeLimit: 45,
    briefingPrompt: 'Master Launch Key: Solve 2x - 4 = 10 for x:',
    options: [
      { value: 'x = 7', label: 'x = 7' },
      { value: 'x = 3', label: 'x = 3' },
      { value: 'x = 6', label: 'x = 6' },
      { value: 'x = 14', label: 'x = 14' },
    ],
    correctAnswer: 'x = 7',
    hint: 'Step 1: Add 4 to 10 (gives 14). Step 2: Divide by 2 (14 ÷ 2 = 7).',
    educationalTakeaway: '2x - 4 = 10  ⟹  2x = 14  ⟹  x = 7. Booster bypass primed!',
  },
  {
    id: 's5-04',
    stageTitle: 'STAGE 5: FINAL LAUNCH EQUATION',
    stageSubtitle: 'Guidance Uplink Authorization',
    missionCode: 'LCH-ARM-04',
    bloomLevel: 'evaluate',
    points: 210,
    timeLimit: 45,
    briefingPrompt: 'Master Launch Key: Solve 4x + 2 = 18 for x:',
    options: [
      { value: 'x = 4', label: 'x = 4' },
      { value: 'x = 5', label: 'x = 5' },
      { value: 'x = 3', label: 'x = 3' },
      { value: 'x = 16', label: 'x = 16' },
    ],
    correctAnswer: 'x = 4',
    hint: 'Step 1: Subtract 2 from 18 (gives 16). Step 2: Divide by 4 (16 ÷ 4 = 4).',
    educationalTakeaway: '4x + 2 = 18  ⟹  4x = 16  ⟹  x = 4. All systems armed for liftoff!',
  },
  {
    id: 's5-05',
    stageTitle: 'STAGE 5: FINAL LAUNCH EQUATION',
    stageSubtitle: 'Main Ignition Countdown Key',
    missionCode: 'LCH-ARM-05',
    bloomLevel: 'evaluate',
    points: 220,
    timeLimit: 45,
    briefingPrompt: 'Master Launch Key: Solve 5x - 5 = 20 for x:',
    options: [
      { value: 'x = 5', label: 'x = 5' },
      { value: 'x = 3', label: 'x = 3' },
      { value: 'x = 4', label: 'x = 4' },
      { value: 'x = 25', label: 'x = 25' },
    ],
    correctAnswer: 'x = 5',
    hint: 'Step 1: Add 5 to 20 (gives 25). Step 2: Divide by 5 (25 ÷ 5 = 5).',
    educationalTakeaway: '5x - 5 = 20  ⟹  5x = 25  ⟹  x = 5. Ignition countdown enabled!',
  },
];

// Helper to construct a complete 5-stage campaign
export function assembleCampaign(campaignIndex: number = 0): MissionCampaign {
  const c1 = STAGE_1_QUESTIONS[campaignIndex % STAGE_1_QUESTIONS.length];
  const c2 = STAGE_2_QUESTIONS[campaignIndex % STAGE_2_QUESTIONS.length];
  const c3 = STAGE_3_QUESTIONS[campaignIndex % STAGE_3_QUESTIONS.length];
  const c4 = STAGE_4_QUESTIONS[campaignIndex % STAGE_4_QUESTIONS.length];
  const c5 = STAGE_5_QUESTIONS[campaignIndex % STAGE_5_QUESTIONS.length];

  const stage1: MissionChallenge = { ...c1, stageId: 'config', stageIndex: 0 };
  const stage2: MissionChallenge = { ...c2, stageId: 'fuel', stageIndex: 1 };
  const stage3: MissionChallenge = { ...c3, stageId: 'engine', stageIndex: 2 };
  const stage4: MissionChallenge = { ...c4, stageId: 'navigation', stageIndex: 3 };
  const stage5: MissionChallenge = { ...c5, stageId: 'launch', stageIndex: 4 };

  const DESTINATIONS = [
    'International Space Station Low Earth Orbit (400 km)',
    'Lunar Gateway Transfer Orbit (384,400 km)',
    'Mars Science Outpost Trajectory (54.6M km)',
    'Europa Deep Space Exploration Halting Point',
  ];

  return {
    index: campaignIndex,
    id: `campaign-${campaignIndex + 1}`,
    title: `PROJECT ARES MISSION ${campaignIndex + 1}`,
    destinationOrbit: DESTINATIONS[campaignIndex % DESTINATIONS.length],
    challenges: [stage1, stage2, stage3, stage4, stage5],
  };
}
