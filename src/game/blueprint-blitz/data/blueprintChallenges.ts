// ============================================================
// BLUEPRINT BLITZ — 20 CURRICULUM QUESTIONS (SHAPES, AREA & VOLUME)
// Organized across 5 Stages:
// Stage 1: 2D & 3D Shapes Identification (Triangle, Square, Cube, Cone)
// Stage 2: Shape Properties, Faces, Vertices & Regular Polygons
// Stage 3: Perimeter & Rectangle Area Formulas
// Stage 4: Distance/Area Concepts & Triangle Area Calculation
// Stage 5: 3D Space Volume, Unit Cubes & Cubic Units
// ============================================================

import { BloomLevel, BlueprintChallenge, TeamBuild } from '../types';

export const BLUEPRINT_CHALLENGES: BlueprintChallenge[] = [
  // ==========================================================
  // STAGE 1: 2D & 3D SHAPES (QUESTIONS 1–4)
  // ==========================================================
  {
    id: 'stage1-01',
    code: 'SHP-01',
    title: '3-SIDED POLYGON',
    category: 'shape',
    bloomLevel: 'remember',
    difficulty: 1,
    mechanic: 'shape',
    prompt: 'A shape with three sides and three angles is called a:',
    missionBrief: '💡 Hint: Count the sides — 3 sides and 3 interior angles.',
    options: ['Quadrilateral', 'Triangle', 'Pentagon', 'Hexagon'],
    correctAnswer: 'Triangle',
    target: {
      description: '3 sides & 3 angles',
      shapeSides: 3,
      shapeVertices: 3,
    },
    timeLimit: 50,
    basePoints: 100,
    explanationFormula: '3 sides + 3 angles = Triangle (Polygon with 3 vertices)',
    learningTip: 'Triangles are 3-sided polygons with interior angles summing to 180°.',
  },
  {
    id: 'stage1-02',
    code: 'SHP-02',
    title: 'EQUAL 4-SIDED POLYGON',
    category: 'shape',
    bloomLevel: 'understand',
    difficulty: 1,
    mechanic: 'shape',
    prompt: 'A polygon with 4 equal sides and 4 right angles is called a:',
    missionBrief: '💡 Hint: 4 equal sides AND 4 right angles (90°).',
    options: ['Rectangle', 'Rhombus', 'Square', 'Trapezium'],
    correctAnswer: 'Square',
    target: {
      description: '4 equal sides + 4 right angles',
      shapeSides: 4,
      shapeVertices: 4,
    },
    timeLimit: 50,
    basePoints: 100,
    explanationFormula: '4 equal sides + 4 right angles (90°) = Square',
    learningTip: 'A rectangle has 4 right angles, but only a square has all 4 sides equal.',
  },
  {
    id: 'stage1-03',
    code: 'SHP-03',
    title: '6 SQUARE FACED SOLID',
    category: 'shape',
    bloomLevel: 'remember',
    difficulty: 1,
    mechanic: 'shape',
    prompt: 'A solid shape with 6 flat square faces is called a:',
    missionBrief: '💡 Hint: A 3D solid where all 6 faces are identical flat squares.',
    options: ['Cuboid', 'Cube', 'Cylinder', 'Cone'],
    correctAnswer: 'Cube',
    target: {
      description: '6 congruent square faces',
    },
    timeLimit: 50,
    basePoints: 100,
    explanationFormula: '6 identical flat square faces = Cube',
    learningTip: 'A cuboid has rectangular faces; a cube specifically has 6 square faces.',
  },
  {
    id: 'stage1-04',
    code: 'SHP-04',
    title: 'CIRCULAR TAPERING SOLID',
    category: 'shape',
    bloomLevel: 'understand',
    difficulty: 1,
    mechanic: 'shape',
    prompt: 'A solid shape with a circular base and a curved surface tapering to a point is called a:',
    missionBrief: '💡 Hint: Circular flat base tapering to a single point (apex).',
    options: ['Cylinder', 'Sphere', 'Cone', 'Cube'],
    correctAnswer: 'Cone',
    target: {
      description: 'Circular base tapering to an apex',
    },
    timeLimit: 50,
    basePoints: 100,
    explanationFormula: 'Circular base + curved surface tapering to apex = Cone',
    learningTip: 'A cylinder has 2 circular faces; a cone has 1 circular face tapering to an apex point.',
  },

  // ==========================================================
  // STAGE 2: SHAPE PROPERTIES, FACES & VERTICES (QUESTIONS 5–8)
  // ==========================================================
  {
    id: 'stage2-01',
    code: 'SHP-05',
    title: 'CUBOID FACES COUNT',
    category: 'shape',
    bloomLevel: 'remember',
    difficulty: 2,
    mechanic: 'shape',
    prompt: 'How many faces does a cuboid have?',
    missionBrief: '💡 Hint: Count top, bottom, front, back, left, and right flat surfaces.',
    options: ['4', '6', '8', '12'],
    correctAnswer: '6',
    target: {
      description: 'Number of faces on a cuboid',
    },
    timeLimit: 50,
    basePoints: 100,
    explanationFormula: 'Top + Bottom + Left + Right + Front + Back = 6 faces',
    learningTip: 'Every cuboid and cube has exactly 6 flat rectangular/square faces.',
  },
  {
    id: 'stage2-02',
    code: 'SHP-06',
    title: 'BALL 3D GEOMETRY',
    category: 'shape',
    bloomLevel: 'remember',
    difficulty: 2,
    mechanic: 'shape',
    prompt: 'A ball is an example of which 3D shape?',
    missionBrief: '💡 Hint: Perfectly round 3D solid without edges or vertices.',
    options: ['Cube', 'Cylinder', 'Sphere', 'Cone'],
    correctAnswer: 'Sphere',
    target: {
      description: '3D shape of a round ball',
    },
    timeLimit: 50,
    basePoints: 100,
    explanationFormula: '3D round ball = Sphere',
    learningTip: 'A circle is 2D, while a sphere is the 3D solid shape.',
  },
  {
    id: 'stage2-03',
    code: 'SHP-07',
    title: 'CUBE VERTICES COUNT',
    category: 'shape',
    bloomLevel: 'remember',
    difficulty: 2,
    mechanic: 'shape',
    prompt: 'How many vertices (corners) does a cube have?',
    missionBrief: '💡 Hint: Count 4 corners at the top + 4 corners at the bottom.',
    options: ['4', '6', '8', '12'],
    correctAnswer: '8',
    target: {
      description: 'Number of corners on a cube',
    },
    timeLimit: 50,
    basePoints: 100,
    explanationFormula: '4 top vertices + 4 bottom vertices = 8 vertices (corners)',
    learningTip: 'A cube has 8 vertices (corners), 12 edges (lines), and 6 faces (surfaces).',
  },
  {
    id: 'stage2-04',
    code: 'SHP-08',
    title: 'REGULAR POLYGONS',
    category: 'shape',
    bloomLevel: 'understand',
    difficulty: 2,
    mechanic: 'shape',
    prompt: 'A shape with all sides and angles equal is called a:',
    missionBrief: '💡 Hint: Equilateral (equal sides) + Equiangular (equal angles).',
    options: ['Irregular polygon', 'Regular polygon', 'Concave polygon', 'Curved shape'],
    correctAnswer: 'Regular polygon',
    target: {
      description: 'Equal sides and equal angles',
    },
    timeLimit: 50,
    basePoints: 100,
    explanationFormula: 'Equal sides + Equal angles = Regular polygon',
    learningTip: 'An equilateral triangle and a square are examples of regular polygons.',
  },

  // ==========================================================
  // STAGE 3: PERIMETER & AREA FORMULAS (QUESTIONS 9–12)
  // ==========================================================
  {
    id: 'stage3-01',
    code: 'PRM-01',
    title: 'RECTANGLE PERIMETER FORMULA',
    category: 'area',
    bloomLevel: 'remember',
    difficulty: 3,
    mechanic: 'floor',
    prompt: 'Perimeter of a rectangle is calculated using the formula:',
    missionBrief: '💡 Hint: Add all 4 sides: length + breadth + length + breadth.',
    options: ['length × breadth', '2 × (length + breadth)', 'length + breadth', '4 × side'],
    correctAnswer: '2 × (length + breadth)',
    target: {
      description: 'Formula for perimeter of rectangle',
    },
    timeLimit: 50,
    basePoints: 100,
    explanationFormula: 'Perimeter = 2 × (length + breadth)',
    learningTip: 'Perimeter is the total boundary distance around the rectangle.',
  },
  {
    id: 'stage3-02',
    code: 'PRM-02',
    title: 'SQUARE PERIMETER CALCULATION',
    category: 'area',
    bloomLevel: 'apply',
    difficulty: 3,
    mechanic: 'floor',
    prompt: 'The perimeter of a square with side 7 cm is:',
    missionBrief: '💡 Hint: Perimeter of square = 4 × side = 4 × 7 cm.',
    options: ['14 cm', '21 cm', '28 cm', '49 cm'],
    correctAnswer: '28 cm',
    target: {
      description: 'Perimeter of 7 cm square',
    },
    timeLimit: 50,
    basePoints: 100,
    explanationFormula: 'Perimeter = 4 × side = 4 × 7 cm = 28 cm',
    learningTip: 'Since all 4 sides of a square are equal, multiply side length by 4.',
  },
  {
    id: 'stage3-03',
    code: 'ARA-01',
    title: 'RECTANGLE AREA FORMULA',
    category: 'area',
    bloomLevel: 'remember',
    difficulty: 3,
    mechanic: 'floor',
    prompt: 'Area of a rectangle is calculated using the formula:',
    missionBrief: '💡 Hint: Multiply length by breadth.',
    options: ['2 × (length + breadth)', 'length × breadth', 'side × side', 'length + breadth'],
    correctAnswer: 'length × breadth',
    target: {
      description: 'Formula for area of rectangle',
    },
    timeLimit: 50,
    basePoints: 100,
    explanationFormula: 'Area = length × breadth',
    learningTip: 'Area measures the 2D surface enclosed by the rectangle in square units.',
  },
  {
    id: 'stage3-04',
    code: 'ARA-02',
    title: 'SQUARE AREA CALCULATION',
    category: 'area',
    bloomLevel: 'apply',
    difficulty: 3,
    mechanic: 'floor',
    prompt: 'The area of a square with side 6 cm is:',
    missionBrief: '💡 Hint: Area of square = side × side = 6 × 6 cm².',
    options: ['12 cm²', '24 cm²', '36 cm²', '42 cm²'],
    correctAnswer: '36 cm²',
    target: {
      description: 'Area of 6 cm square',
    },
    timeLimit: 50,
    basePoints: 100,
    explanationFormula: 'Area = side × side = 6 cm × 6 cm = 36 cm²',
    learningTip: 'Square area is side squared (s²), measured in square units (cm²).',
  },

  // ==========================================================
  // STAGE 4: AREA CALCULATIONS & DEFINITIONS (QUESTIONS 13–16)
  // ==========================================================
  {
    id: 'stage4-01',
    code: 'ARA-03',
    title: 'RECTANGLE AREA (8cm × 5cm)',
    category: 'area',
    bloomLevel: 'apply',
    difficulty: 4,
    mechanic: 'floor',
    prompt: 'The area of a rectangle with length 8 cm and breadth 5 cm is:',
    missionBrief: '💡 Hint: Area = length × breadth = 8 × 5 cm².',
    options: ['13 cm²', '26 cm²', '40 cm²', '45 cm²'],
    correctAnswer: '40 cm²',
    target: {
      description: 'Area of 8 cm by 5 cm rectangle',
    },
    timeLimit: 50,
    basePoints: 100,
    explanationFormula: 'Area = length × breadth = 8 cm × 5 cm = 40 cm²',
    learningTip: 'Multiply length by breadth to get the surface area in square units.',
  },
  {
    id: 'stage4-02',
    code: 'PRM-03',
    title: 'DISTANCE AROUND A FIGURE',
    category: 'area',
    bloomLevel: 'remember',
    difficulty: 4,
    mechanic: 'floor',
    prompt: 'The distance around a closed figure is called its:',
    missionBrief: '💡 Hint: Total outer boundary distance.',
    options: ['Area', 'Volume', 'Perimeter', 'Diameter'],
    correctAnswer: 'Perimeter',
    target: {
      description: 'Term for boundary distance',
    },
    timeLimit: 50,
    basePoints: 100,
    explanationFormula: 'Total boundary path around a 2D closed figure = Perimeter',
    learningTip: 'Perimeter is measured in linear units (cm, m), not square units.',
  },
  {
    id: 'stage4-03',
    code: 'ARA-04',
    title: 'SURFACE ENCLOSED DEFINITION',
    category: 'area',
    bloomLevel: 'remember',
    difficulty: 4,
    mechanic: 'floor',
    prompt: 'The amount of surface enclosed by a closed figure is called its:',
    missionBrief: '💡 Hint: Measure of the region enclosed inside the boundary.',
    options: ['Perimeter', 'Area', 'Volume', 'Length'],
    correctAnswer: 'Area',
    target: {
      description: 'Term for enclosed 2D surface',
    },
    timeLimit: 50,
    basePoints: 100,
    explanationFormula: '2D enclosed surface region = Area (measured in square units)',
    learningTip: 'Area represents the number of unit squares needed to cover the surface.',
  },
  {
    id: 'stage4-04',
    code: 'ARA-05',
    title: 'TRIANGLE AREA CALCULATION',
    category: 'area',
    bloomLevel: 'apply',
    difficulty: 4,
    mechanic: 'floor',
    prompt: 'The area of a triangle with base 10 cm and height 6 cm is:',
    missionBrief: '💡 Hint: Area of triangle = ½ × base × height = ½ × 10 × 6.',
    options: ['30 cm²', '60 cm²', '16 cm²', '20 cm²'],
    correctAnswer: '30 cm²',
    target: {
      description: 'Area of triangle (base 10cm, height 6cm)',
    },
    timeLimit: 50,
    basePoints: 100,
    explanationFormula: 'Area = ½ × base × height = ½ × 10 cm × 6 cm = 30 cm²',
    learningTip: 'A triangle is exactly half the area of a rectangle with the same base and height.',
  },

  // ==========================================================
  // STAGE 5: 3D SPACE VOLUME & UNITS (QUESTIONS 17–20)
  // ==========================================================
  {
    id: 'stage5-01',
    code: 'VOL-01',
    title: 'SPACE OCCUPIED BY SOLID',
    category: 'volume',
    bloomLevel: 'remember',
    difficulty: 5,
    mechanic: 'cubes',
    prompt: 'The space occupied by a solid object is called its:',
    missionBrief: '💡 Hint: 3-dimensional space contained inside a solid body.',
    options: ['Area', 'Perimeter', 'Volume', 'Length'],
    correctAnswer: 'Volume',
    target: {
      description: 'Term for 3D space occupied by a solid',
    },
    timeLimit: 50,
    basePoints: 100,
    explanationFormula: '3D space capacity inside a solid = Volume',
    learningTip: 'Area is 2D surface (flat), while Volume is 3D space (solid).',
  },
  {
    id: 'stage5-02',
    code: 'VOL-02',
    title: 'MEASURING VOLUME BY COUNTING',
    category: 'volume',
    bloomLevel: 'understand',
    difficulty: 5,
    mechanic: 'cubes',
    prompt: 'Volume is generally measured by counting the number of:',
    missionBrief: '💡 Hint: Count 1×1×1 unit blocks filling the solid.',
    options: ['Squares', 'Unit cubes', 'Triangles', 'Circles'],
    correctAnswer: 'Unit cubes',
    target: {
      description: 'Basic counting unit for volume',
    },
    timeLimit: 50,
    basePoints: 100,
    explanationFormula: 'Volume = Count of 1×1×1 Unit Cubes filling the solid',
    learningTip: 'Just like area is counted in unit squares, volume is counted in unit cubes.',
  },
  {
    id: 'stage5-03',
    code: 'VOL-03',
    title: 'STANDARD UNIT FOR VOLUME',
    category: 'volume',
    bloomLevel: 'remember',
    difficulty: 5,
    mechanic: 'cubes',
    prompt: 'The standard unit used to measure volume is:',
    missionBrief: '💡 Hint: 3D cubic units with exponent 3: cm³ or cubic centimetres.',
    options: ['cm² (square cm)', 'cm³ (cubic cm)', 'cm (centimetre)', 'm² (square metre)'],
    correctAnswer: 'cm³ (cubic cm)',
    target: {
      description: 'Standard unit of 3D volume',
    },
    timeLimit: 50,
    basePoints: 100,
    explanationFormula: 'Unit of Volume = cm³ (cubic centimetres) or m³',
    learningTip: 'Length is cm (1D), Area is cm² (2D), Volume is cm³ (3D).',
  },
  {
    id: 'stage5-04',
    code: 'VOL-04',
    title: 'CUBE VS STRETCHED CUBOID VOLUME',
    category: 'volume',
    bloomLevel: 'analyze',
    difficulty: 5,
    mechanic: 'cubes',
    prompt: 'Which of these solids will have the greater volume if both have the same edge length: a cube or a cuboid stretched in one direction?',
    missionBrief: '💡 Hint: Stretching one edge increases the third dimension: l × w × h > l × w × l.',
    options: ['Cube', 'Cuboid', 'Both equal', 'Cannot be determined'],
    correctAnswer: 'Cuboid',
    target: {
      description: 'Comparison of cube vs stretched cuboid volume',
    },
    timeLimit: 50,
    basePoints: 100,
    explanationFormula: 'Stretched Cuboid (l × w × H where H > l) > Cube (l × w × l)',
    learningTip: 'Increasing any dimension of a solid increases its total volume.',
  },
];

/**
 * Validates the student's selected multiple-choice answer against the challenge's correctAnswer
 */
export function validateChallengeSolution(
  challenge: BlueprintChallenge,
  selectedAnswer: string | number | null
): {
  isValid: boolean;
  isCorrect: boolean;
  statusMessage: string;
  diffMessage: string;
  formula: string;
} {
  if (selectedAnswer === null || selectedAnswer === undefined) {
    return {
      isValid: false,
      isCorrect: false,
      statusMessage: 'NO OPTION SELECTED',
      diffMessage: 'Please select an option before submitting.',
      formula: challenge.explanationFormula,
    };
  }

  const cleanSelected = String(selectedAnswer).trim().toLowerCase();
  const cleanCorrect = String(challenge.correctAnswer).trim().toLowerCase();

  const isCorrect = cleanSelected === cleanCorrect;

  return {
    isValid: isCorrect,
    isCorrect,
    statusMessage: isCorrect ? '✓ OPTION APPROVED!' : '✕ INCORRECT OPTION',
    diffMessage: isCorrect
      ? `Correct: ${challenge.correctAnswer}`
      : `Selected: ${selectedAnswer} (Correct: ${challenge.correctAnswer})`,
    formula: challenge.explanationFormula,
  };
}

/**
 * Helper to get a random non-repeating challenge for a specific stage (1 to 5)
 */
export function getStageChallenge(
  stageNumber: number,
  usedIds: string[] = []
): BlueprintChallenge {
  const prefix = `stage${stageNumber}-`;
  const stagePool = BLUEPRINT_CHALLENGES.filter(
    (c) => c.id.startsWith(prefix) && !usedIds.includes(c.id)
  );

  const fallbackPool = BLUEPRINT_CHALLENGES.filter((c) => c.id.startsWith(prefix));
  const pool = stagePool.length > 0 ? stagePool : fallbackPool.length > 0 ? fallbackPool : BLUEPRINT_CHALLENGES;

  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}

/**
 * Helper to select non-repeating random challenge
 */
export function getRandomChallenge(
  usedIds: string[] = [],
  stageNumber: number = 1
): BlueprintChallenge {
  return getStageChallenge(stageNumber, usedIds);
}
