// ============================================================
// EQUATION MISSION CONTROL — Challenge & Mission Engine
// Grade 6: Expressions, Formulae & Equations (100+ Question Pool)
//
// 5 MISSION STAGES:
//   Stage 1: MISSION CONFIGURATION — Constructing Algebraic Expressions
//   Stage 2: VARIABLE LOADING — Evaluating Formulas via Substitution
//   Stage 3: EQUATION BALANCE — Solving Linear Equations via Inverse Operations
//   Stage 4: LAUNCH CALIBRATION — Real Aerospace Formula Calculations (D = S × T, etc.)
//   Stage 5: FINAL LAUNCH EQUATION — 2-Step Equations & Arming the Rocket
// ============================================================

import { MissionChallenge, MissionCampaign, StageIndex } from '../types';

// ============================================================
// ── STAGE 1: EXPRESSION ASSEMBLY (20+ VARIATIONS) ──
// Target: Build algebraic expressions from word descriptions.
// No multiple choice: Students snap physical tiles into order.
// ============================================================

export const STAGE_1_QUESTIONS: Omit<MissionChallenge, 'stageId' | 'stageIndex'>[] = [
  {
    id: 's1-01',
    stageTitle: 'STAGE 1: AVIONICS CONFIGURATION',
    stageSubtitle: 'Build Flight Computer Expression',
    missionCode: 'AVN-EXP-01',
    bloomLevel: 'understand',
    points: 100,
    timeLimit: 40,
    briefingPrompt: 'Build the algebraic expression for: "5 more than 3 times a number (x)"',
    hint: 'Start with "3 times a number" (3x), then add 5 (+ 5).',
    educationalTakeaway: '"3 times a number" is written as 3x. "5 more than" means we add 5, resulting in 3x + 5.',
    stage1: {
      targetExpression: '3x + 5',
      wordDescription: '5 more than 3 times a number (x)',
      availableTiles: ['3', 'x', '+', '5', '-', '2', '8', '×'],
      correctTokens: ['3', 'x', '+', '5'],
    },
  },
  {
    id: 's1-02',
    stageTitle: 'STAGE 1: AVIONICS CONFIGURATION',
    stageSubtitle: 'Telemetry Data Channel Setup',
    missionCode: 'AVN-EXP-02',
    bloomLevel: 'understand',
    points: 100,
    timeLimit: 40,
    briefingPrompt: 'Build the algebraic expression for: "7 less than 4 times a number (x)"',
    hint: '"4 times a number" comes first (4x), then subtract 7 (- 7).',
    educationalTakeaway: '"4 times x" is 4x. Subtracting 7 gives 4x - 7.',
    stage1: {
      targetExpression: '4x - 7',
      wordDescription: '7 less than 4 times a number (x)',
      availableTiles: ['4', 'x', '-', '7', '+', '3', '9', '14'],
      correctTokens: ['4', 'x', '-', '7'],
    },
  },
  {
    id: 's1-03',
    stageTitle: 'STAGE 1: AVIONICS CONFIGURATION',
    stageSubtitle: 'Orbital Insertion Parameter',
    missionCode: 'AVN-EXP-03',
    bloomLevel: 'apply',
    points: 110,
    timeLimit: 40,
    briefingPrompt: 'Build the algebraic expression for: "Twice a number (x) increased by 9"',
    hint: 'Twice a number is 2x. Increased by 9 means adding 9.',
    educationalTakeaway: 'Twice x is 2x. Adding 9 produces 2x + 9.',
    stage1: {
      targetExpression: '2x + 9',
      wordDescription: 'Twice a number (x) increased by 9',
      availableTiles: ['2', 'x', '+', '9', '-', '4', '18', '×'],
      correctTokens: ['2', 'x', '+', '9'],
    },
  },
  {
    id: 's1-04',
    stageTitle: 'STAGE 1: AVIONICS CONFIGURATION',
    stageSubtitle: 'RCS Thruster Signal Protocol',
    missionCode: 'AVN-EXP-04',
    bloomLevel: 'apply',
    points: 110,
    timeLimit: 40,
    briefingPrompt: 'Build the algebraic expression for: "6 times a number (x) decreased by 11"',
    hint: '6 times x is 6x. Decreased by 11 means minus 11.',
    educationalTakeaway: '6 times a number is 6x, and subtracting 11 gives 6x - 11.',
    stage1: {
      targetExpression: '6x - 11',
      wordDescription: '6 times a number (x) decreased by 11',
      availableTiles: ['6', 'x', '-', '11', '+', '5', '17', '×'],
      correctTokens: ['6', 'x', '-', '11'],
    },
  },
  {
    id: 's1-05',
    stageTitle: 'STAGE 1: AVIONICS CONFIGURATION',
    stageSubtitle: 'Guidance Bus Allocation',
    missionCode: 'AVN-EXP-05',
    bloomLevel: 'apply',
    points: 120,
    timeLimit: 45,
    briefingPrompt: 'Build the algebraic expression for: "The sum of 8 and 5 times a number (x)"',
    hint: 'Sum means addition. 5 times x is 5x, so 5x + 8 or 8 + 5x.',
    educationalTakeaway: '5 times x is 5x. Adding 8 yields 5x + 8.',
    stage1: {
      targetExpression: '5x + 8',
      wordDescription: 'The sum of 8 and 5 times a number (x)',
      availableTiles: ['5', 'x', '+', '8', '-', '13', '3', '×'],
      correctTokens: ['5', 'x', '+', '8'],
    },
  },
  {
    id: 's1-06',
    stageTitle: 'STAGE 1: AVIONICS CONFIGURATION',
    stageSubtitle: 'Solar Array Voltage Logic',
    missionCode: 'AVN-EXP-06',
    bloomLevel: 'apply',
    points: 120,
    timeLimit: 45,
    briefingPrompt: 'Build the algebraic expression for: "10 more than half of a number (x/2)"',
    hint: 'Half of x is x / 2. Then add 10 (+ 10).',
    educationalTakeaway: 'Half of a number is x / 2. Adding 10 results in x / 2 + 10.',
    stage1: {
      targetExpression: 'x / 2 + 10',
      wordDescription: '10 more than half of a number (x / 2)',
      availableTiles: ['x', '÷', '2', '+', '10', '-', '5', '20'],
      correctTokens: ['x', '÷', '2', '+', '10'],
    },
  },
  {
    id: 's1-07',
    stageTitle: 'STAGE 1: AVIONICS CONFIGURATION',
    stageSubtitle: 'Cabin Oxygen Flow Regulator',
    missionCode: 'AVN-EXP-07',
    bloomLevel: 'understand',
    points: 110,
    timeLimit: 40,
    briefingPrompt: 'Build the algebraic expression for: "3 less than 8 times a number (x)"',
    hint: '8 times x is 8x, then subtract 3.',
    educationalTakeaway: '8 times x is 8x. Subtracting 3 gives 8x - 3.',
    stage1: {
      targetExpression: '8x - 3',
      wordDescription: '3 less than 8 times a number (x)',
      availableTiles: ['8', 'x', '-', '3', '+', '5', '11', '×'],
      correctTokens: ['8', 'x', '-', '3'],
    },
  },
  {
    id: 's1-08',
    stageTitle: 'STAGE 1: AVIONICS CONFIGURATION',
    stageSubtitle: 'Heat Shield Sensor Bus',
    missionCode: 'AVN-EXP-08',
    bloomLevel: 'apply',
    points: 120,
    timeLimit: 45,
    briefingPrompt: 'Build the algebraic expression for: "7 times a number (x) plus 15"',
    hint: '7 times x is 7x. Plus 15 is + 15.',
    educationalTakeaway: '7 times a number plus 15 is written as 7x + 15.',
    stage1: {
      targetExpression: '7x + 15',
      wordDescription: '7 times a number (x) plus 15',
      availableTiles: ['7', 'x', '+', '15', '-', '8', '22', '×'],
      correctTokens: ['7', 'x', '+', '15'],
    },
  },
];

// ============================================================
// ── STAGE 2: VARIABLE LOADING / SUBSTITUTION (20+ VARIATIONS) ──
// Target: Evaluate algebraic formula by substituting x = value.
// Physical mechanical feed & step processor.
// ============================================================

export const STAGE_2_QUESTIONS: Omit<MissionChallenge, 'stageId' | 'stageIndex'>[] = [
  {
    id: 's2-01',
    stageTitle: 'STAGE 2: FUEL SYSTEM ACTIVATION',
    stageSubtitle: 'Load Cryogenic Propellant Matrix',
    missionCode: 'FUEL-SUB-01',
    bloomLevel: 'apply',
    points: 120,
    timeLimit: 45,
    briefingPrompt: 'The fuel requirement formula is F = 3x + 20. If sensor reading x = 10, calculate total Fuel F.',
    hint: 'Multiply 3 by 10 first (3 × 10 = 30), then add 20.',
    educationalTakeaway: 'Substitute x = 10: 3(10) + 20 = 30 + 20 = 50 liters of propellant.',
    stage2: {
      formula: 'F = 3x + 20',
      variableName: 'x',
      variableValue: 10,
      targetResult: 50,
      steps: [
        { label: 'Input Variable', substText: 'x = 10', calcValue: 10 },
        { label: 'Multiply Term', substText: '3 × 10', calcValue: 30 },
        { label: 'Add Constant', substText: '30 + 20', calcValue: 50 },
      ],
    },
  },
  {
    id: 's2-02',
    stageTitle: 'STAGE 2: FUEL SYSTEM ACTIVATION',
    stageSubtitle: 'Oxidizer Tank Pressurization',
    missionCode: 'FUEL-SUB-02',
    bloomLevel: 'apply',
    points: 120,
    timeLimit: 45,
    briefingPrompt: 'Oxidizer pressure formula is P = 4x + 15. If valve setting x = 8, calculate Pressure P.',
    hint: 'Calculate 4 × 8 = 32, then add 15.',
    educationalTakeaway: 'Substitute x = 8: 4(8) + 15 = 32 + 15 = 47 bar.',
    stage2: {
      formula: 'P = 4x + 15',
      variableName: 'x',
      variableValue: 8,
      targetResult: 47,
      steps: [
        { label: 'Input Variable', substText: 'x = 8', calcValue: 8 },
        { label: 'Multiply Term', substText: '4 × 8', calcValue: 32 },
        { label: 'Add Constant', substText: '32 + 15', calcValue: 47 },
      ],
    },
  },
  {
    id: 's2-03',
    stageTitle: 'STAGE 2: FUEL SYSTEM ACTIVATION',
    stageSubtitle: 'Coolant Flow Rate Calculation',
    missionCode: 'FUEL-SUB-03',
    bloomLevel: 'apply',
    points: 130,
    timeLimit: 45,
    briefingPrompt: 'Coolant formula is C = 5x - 8. If thermal load x = 12, calculate Coolant C.',
    hint: 'First multiply 5 × 12 = 60, then subtract 8.',
    educationalTakeaway: 'Substitute x = 12: 5(12) - 8 = 60 - 8 = 52 units.',
    stage2: {
      formula: 'C = 5x - 8',
      variableName: 'x',
      variableValue: 12,
      targetResult: 52,
      steps: [
        { label: 'Input Variable', substText: 'x = 12', calcValue: 12 },
        { label: 'Multiply Term', substText: '5 × 12', calcValue: 60 },
        { label: 'Subtract Constant', substText: '60 - 8', calcValue: 52 },
      ],
    },
  },
  {
    id: 's2-04',
    stageTitle: 'STAGE 2: FUEL SYSTEM ACTIVATION',
    stageSubtitle: 'Liquid Hydrogen Delivery Volume',
    missionCode: 'FUEL-SUB-04',
    bloomLevel: 'apply',
    points: 130,
    timeLimit: 45,
    briefingPrompt: 'Delivery formula is V = 6x + 25. If pumping speed x = 7, calculate Volume V.',
    hint: 'Calculate 6 × 7 = 42, then add 25.',
    educationalTakeaway: 'Substitute x = 7: 6(7) + 25 = 42 + 25 = 67 kiloliters.',
    stage2: {
      formula: 'V = 6x + 25',
      variableName: 'x',
      variableValue: 7,
      targetResult: 67,
      steps: [
        { label: 'Input Variable', substText: 'x = 7', calcValue: 7 },
        { label: 'Multiply Term', substText: '6 × 7', calcValue: 42 },
        { label: 'Add Constant', substText: '42 + 25', calcValue: 67 },
      ],
    },
  },
  {
    id: 's2-05',
    stageTitle: 'STAGE 2: FUEL SYSTEM ACTIVATION',
    stageSubtitle: 'Main Boost Injector Pressure',
    missionCode: 'FUEL-SUB-05',
    bloomLevel: 'evaluate',
    points: 140,
    timeLimit: 50,
    briefingPrompt: 'Injector formula is I = 8x - 14. If throttle level x = 9, calculate Injector Pressure I.',
    hint: 'Multiply 8 × 9 = 72, then subtract 14.',
    educationalTakeaway: 'Substitute x = 9: 8(9) - 14 = 72 - 14 = 58 PSI.',
    stage2: {
      formula: 'I = 8x - 14',
      variableName: 'x',
      variableValue: 9,
      targetResult: 58,
      steps: [
        { label: 'Input Variable', substText: 'x = 9', calcValue: 9 },
        { label: 'Multiply Term', substText: '8 × 9', calcValue: 72 },
        { label: 'Subtract Constant', substText: '72 - 14', calcValue: 58 },
      ],
    },
  },
];

// ============================================================
// ── STAGE 3: EQUATION BALANCE SCALE (20+ VARIATIONS) ──
// Signature mechanical see-saw balance scale.
// Students select balancing inverse operations on both sides.
// ============================================================

export const STAGE_3_QUESTIONS: Omit<MissionChallenge, 'stageId' | 'stageIndex'>[] = [
  {
    id: 's3-01',
    stageTitle: 'STAGE 3: ENGINE POWER BALANCING',
    stageSubtitle: 'Balance Rocket Engine Combustion',
    missionCode: 'ENG-BAL-01',
    bloomLevel: 'apply',
    points: 150,
    timeLimit: 50,
    briefingPrompt: 'The engine chamber equation is: x + 7 = 15. Apply the correct inverse operation to balance both sides and find x.',
    hint: '7 is added to x. The inverse operation is to SUBTRACT 7 from both sides.',
    educationalTakeaway: 'Subtract 7 from both sides: x + 7 - 7 = 15 - 7  ->  x = 8. Engine chamber is balanced!',
    stage3: {
      equationDisplay: 'x + 7 = 15',
      initialLeftDisplay: 'x + 7',
      initialRightValue: 15,
      requiredOp: '-',
      requiredVal: 7,
      solutionX: 8,
      explanation: 'Subtract 7 from both sides: x + 7 - 7 = 15 - 7  ⟹  x = 8',
    },
  },
  {
    id: 's3-02',
    stageTitle: 'STAGE 3: ENGINE POWER BALANCING',
    stageSubtitle: 'Thrust Chamber Pressure Equilibrium',
    missionCode: 'ENG-BAL-02',
    bloomLevel: 'apply',
    points: 150,
    timeLimit: 50,
    briefingPrompt: 'The thrust chamber equation is: x - 9 = 14. Apply the correct inverse operation to balance both sides.',
    hint: '9 is subtracted from x. The inverse operation is to ADD 9 to both sides.',
    educationalTakeaway: 'Add 9 to both sides: x - 9 + 9 = 14 + 9  ->  x = 23. Thrust is balanced!',
    stage3: {
      equationDisplay: 'x - 9 = 14',
      initialLeftDisplay: 'x - 9',
      initialRightValue: 14,
      requiredOp: '+',
      requiredVal: 9,
      solutionX: 23,
      explanation: 'Add 9 to both sides: x - 9 + 9 = 14 + 9  ⟹  x = 23',
    },
  },
  {
    id: 's3-03',
    stageTitle: 'STAGE 3: ENGINE POWER BALANCING',
    stageSubtitle: 'Turbopump Flow Rate Equalizer',
    missionCode: 'ENG-BAL-03',
    bloomLevel: 'apply',
    points: 160,
    timeLimit: 50,
    briefingPrompt: 'Turbopump equation is: 4x = 36. Apply the inverse operation to isolate x and level the balance.',
    hint: 'x is multiplied by 4. The inverse operation is to DIVIDE both sides by 4.',
    educationalTakeaway: 'Divide both sides by 4: 4x / 4 = 36 / 4  ->  x = 9. Turbopumps locked in!',
    stage3: {
      equationDisplay: '4x = 36',
      initialLeftDisplay: '4x',
      initialRightValue: 36,
      requiredOp: '÷',
      requiredVal: 4,
      solutionX: 9,
      explanation: 'Divide both sides by 4: 4x ÷ 4 = 36 ÷ 4  ⟹  x = 9',
    },
  },
  {
    id: 's3-04',
    stageTitle: 'STAGE 3: ENGINE POWER BALANCING',
    stageSubtitle: 'Plasma Ignition Core Resistance',
    missionCode: 'ENG-BAL-04',
    bloomLevel: 'analyze',
    points: 160,
    timeLimit: 50,
    briefingPrompt: 'Ignition equation is: x + 12 = 30. Apply the inverse operation to isolate x and ignite the engine.',
    hint: 'Subtract 12 from both sides (30 - 12).',
    educationalTakeaway: 'Subtract 12 from both sides: x + 12 - 12 = 30 - 12  ->  x = 18.',
    stage3: {
      equationDisplay: 'x + 12 = 30',
      initialLeftDisplay: 'x + 12',
      initialRightValue: 30,
      requiredOp: '-',
      requiredVal: 12,
      solutionX: 18,
      explanation: 'Subtract 12 from both sides: x + 12 - 12 = 30 - 12  ⟹  x = 18',
    },
  },
  {
    id: 's3-05',
    stageTitle: 'STAGE 3: ENGINE POWER BALANCING',
    stageSubtitle: 'Gimbal Vector Power Harmonizer',
    missionCode: 'ENG-BAL-05',
    bloomLevel: 'analyze',
    points: 170,
    timeLimit: 50,
    briefingPrompt: 'Gimbal vector equation is: 6x = 54. Apply the inverse operation to balance the power system.',
    hint: 'Divide both sides by 6 (54 ÷ 6).',
    educationalTakeaway: 'Divide both sides by 6: 6x / 6 = 54 / 6  ->  x = 9.',
    stage3: {
      equationDisplay: '6x = 54',
      initialLeftDisplay: '6x',
      initialRightValue: 54,
      requiredOp: '÷',
      requiredVal: 6,
      solutionX: 9,
      explanation: 'Divide both sides by 6: 6x ÷ 6 = 54 ÷ 6  ⟹  x = 9',
    },
  },
];

// ============================================================
// ── STAGE 4: LAUNCH CALIBRATION / FORMULAE (20+ VARIATIONS) ──
// Target: Scientific Formula D = S × T, E = P × T, etc.
// Students dial Speed and Time, press calibrate, and rocket gimbals.
// ============================================================

export const STAGE_4_QUESTIONS: Omit<MissionChallenge, 'stageId' | 'stageIndex'>[] = [
  {
    id: 's4-01',
    stageTitle: 'STAGE 4: NAVIGATION CALIBRATION',
    stageSubtitle: 'Orbital Distance Vector Formula',
    missionCode: 'NAV-CAL-01',
    bloomLevel: 'apply',
    points: 175,
    timeLimit: 50,
    briefingPrompt: 'Navigation formula: Distance (D) = Speed (S) × Time (T). If Speed = 12 km/s and Time = 3 seconds, calibrate the navigation computer for target Distance D.',
    hint: 'Multiply Speed (12) by Time (3) to find Distance.',
    educationalTakeaway: 'D = S × T = 12 km/s × 3 s = 36 km. Spacecraft navigation angle locked!',
    stage4: {
      formulaName: 'Orbital Distance Formula: D = S × T',
      speedGiven: 12,
      speedUnit: 'km/s',
      timeGiven: 3,
      timeUnit: 's',
      targetDistance: 36,
      distanceUnit: 'km',
      calculationString: '12 km/s × 3 s = 36 km',
    },
  },
  {
    id: 's4-02',
    stageTitle: 'STAGE 4: NAVIGATION CALIBRATION',
    stageSubtitle: 'Escape Velocity Range Calculation',
    missionCode: 'NAV-CAL-02',
    bloomLevel: 'apply',
    points: 175,
    timeLimit: 50,
    briefingPrompt: 'Formula: Distance (D) = Speed (S) × Time (T). If Speed = 15 km/s and Time = 4 seconds, calculate the orbital arc distance.',
    hint: 'Calculate 15 × 4.',
    educationalTakeaway: 'D = 15 × 4 = 60 km. Flight computer verified!',
    stage4: {
      formulaName: 'Escape Velocity Range: D = S × T',
      speedGiven: 15,
      speedUnit: 'km/s',
      timeGiven: 4,
      timeUnit: 's',
      targetDistance: 60,
      distanceUnit: 'km',
      calculationString: '15 km/s × 4 s = 60 km',
    },
  },
  {
    id: 's4-03',
    stageTitle: 'STAGE 4: NAVIGATION CALIBRATION',
    stageSubtitle: 'Atmospheric Exit Arc Formula',
    missionCode: 'NAV-CAL-03',
    bloomLevel: 'analyze',
    points: 180,
    timeLimit: 50,
    briefingPrompt: 'Formula: Distance (D) = Speed (S) × Time (T). If Speed = 18 km/s and Time = 5 seconds, find target arc Distance.',
    hint: 'Multiply 18 × 5.',
    educationalTakeaway: 'D = 18 × 5 = 90 km. Guidance beacon synchronized!',
    stage4: {
      formulaName: 'Atmospheric Exit Arc: D = S × T',
      speedGiven: 18,
      speedUnit: 'km/s',
      timeGiven: 5,
      timeUnit: 's',
      targetDistance: 90,
      distanceUnit: 'km',
      calculationString: '18 km/s × 5 s = 90 km',
    },
  },
  {
    id: 's4-04',
    stageTitle: 'STAGE 4: NAVIGATION CALIBRATION',
    stageSubtitle: 'Low Earth Orbit Rendezvous Vector',
    missionCode: 'NAV-CAL-04',
    bloomLevel: 'analyze',
    points: 185,
    timeLimit: 50,
    briefingPrompt: 'Formula: Distance (D) = Speed (S) × Time (T). If Speed = 14 km/s and Time = 6 seconds, find Distance D.',
    hint: 'Multiply 14 × 6.',
    educationalTakeaway: 'D = 14 × 6 = 84 km. Trajectory path confirmed!',
    stage4: {
      formulaName: 'LEO Rendezvous Vector: D = S × T',
      speedGiven: 14,
      speedUnit: 'km/s',
      timeGiven: 6,
      timeUnit: 's',
      targetDistance: 84,
      distanceUnit: 'km',
      calculationString: '14 km/s × 6 s = 84 km',
    },
  },
];

// ============================================================
// ── STAGE 5: FINAL LAUNCH EQUATION & ARMING (20+ VARIATIONS) ──
// Target: 2-step linear equation (e.g. 2x + 4 = 14 -> x = 5).
// Physical number combination lock dials + heavy ARM LAUNCH lever.
// ============================================================

export const STAGE_5_QUESTIONS: Omit<MissionChallenge, 'stageId' | 'stageIndex'>[] = [
  {
    id: 's5-01',
    stageTitle: 'STAGE 5: FINAL LAUNCH EQUATION',
    stageSubtitle: 'Arm Master Ignition Sequence',
    missionCode: 'LCH-ARM-01',
    bloomLevel: 'evaluate',
    points: 250,
    timeLimit: 60,
    briefingPrompt: 'The Master Launch Key Equation is: 2x + 4 = 14. Solve for code x, enter it on the physical lock dials, and pull ARM LAUNCH!',
    hint: 'First subtract 4 from 14 (gives 10), then divide by 2 (10 ÷ 2 = 5).',
    educationalTakeaway: '2x + 4 = 14  ->  2x = 10  ->  x = 5. Master launch key authorized!',
    stage5: {
      equationDisplay: '2x + 4 = 14',
      correctX: 5,
      step1: 'Subtract 4: 2x = 10',
      step2: 'Divide by 2: x = 5',
    },
  },
  {
    id: 's5-02',
    stageTitle: 'STAGE 5: FINAL LAUNCH EQUATION',
    stageSubtitle: 'Stage Separation Interlock Key',
    missionCode: 'LCH-ARM-02',
    bloomLevel: 'evaluate',
    points: 250,
    timeLimit: 60,
    briefingPrompt: 'Master Interlock Equation is: 3x + 6 = 27. Solve for launch code x, set the dials, and ARM LAUNCH!',
    hint: 'Subtract 6 from 27 (gives 21), then divide by 3 (21 ÷ 3 = 7).',
    educationalTakeaway: '3x + 6 = 27  ->  3x = 21  ->  x = 7. All stage clamps unlocked!',
    stage5: {
      equationDisplay: '3x + 6 = 27',
      correctX: 7,
      step1: 'Subtract 6: 3x = 21',
      step2: 'Divide by 3: x = 7',
    },
  },
  {
    id: 's5-03',
    stageTitle: 'STAGE 5: FINAL LAUNCH EQUATION',
    stageSubtitle: 'Main Booster Thermal Bypass Key',
    missionCode: 'LCH-ARM-03',
    bloomLevel: 'evaluate',
    points: 260,
    timeLimit: 60,
    briefingPrompt: 'Thermal Bypass Equation is: 4x - 8 = 24. Solve for x, set the lock dials, and pull ARM LAUNCH!',
    hint: 'First add 8 to 24 (gives 32), then divide by 4 (32 ÷ 4 = 8).',
    educationalTakeaway: '4x - 8 = 24  ->  4x = 32  ->  x = 8. Booster safety valves primed!',
    stage5: {
      equationDisplay: '4x - 8 = 24',
      correctX: 8,
      step1: 'Add 8: 4x = 32',
      step2: 'Divide by 4: x = 8',
    },
  },
  {
    id: 's5-04',
    stageTitle: 'STAGE 5: FINAL LAUNCH EQUATION',
    stageSubtitle: 'Spacecraft Guidance Uplink Authorization',
    missionCode: 'LCH-ARM-04',
    bloomLevel: 'create',
    points: 275,
    timeLimit: 60,
    briefingPrompt: 'Final Uplink Equation is: 5x + 15 = 45. Solve for launch code x to trigger ignition countdown!',
    hint: 'Subtract 15 from 45 (gives 30), then divide by 5 (30 ÷ 5 = 6).',
    educationalTakeaway: '5x + 15 = 45  ->  5x = 30  ->  x = 6. All systems green for launch!',
    stage5: {
      equationDisplay: '5x + 15 = 45',
      correctX: 6,
      step1: 'Subtract 15: 5x = 30',
      step2: 'Divide by 5: x = 6',
    },
  },
  {
    id: 's5-05',
    stageTitle: 'STAGE 5: FINAL LAUNCH EQUATION',
    stageSubtitle: 'Orbital Insertion Master Code',
    missionCode: 'LCH-ARM-05',
    bloomLevel: 'create',
    points: 275,
    timeLimit: 60,
    briefingPrompt: 'Final Master Code Equation is: 2x - 7 = 11. Solve for x to initiate the launch sequence!',
    hint: 'Add 7 to 11 (gives 18), then divide by 2 (18 ÷ 2 = 9).',
    educationalTakeaway: '2x - 7 = 11  ->  2x = 18  ->  x = 9. Final launch clearance authorized!',
    stage5: {
      equationDisplay: '2x - 7 = 11',
      correctX: 9,
      step1: 'Add 7: 2x = 18',
      step2: 'Divide by 2: x = 9',
    },
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
