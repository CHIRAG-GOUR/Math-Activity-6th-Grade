// ============================================================
// BLUEPRINT BLITZ — Grade 6 Architectural Math Challenges
// Curriculum: Shapes, Rectangular Area, 3D Cubic Volume & Spatial Reasoning
// Designed specifically for Grade 6 students:
// - Simple, clear language with friendly hints
// - Direct formulas (Area = L × W, Volume = L × W × H)
// - Multiple valid factor solutions (e.g., 6×4 or 8×3 for 24)
// ============================================================

import { BloomLevel, BlueprintChallenge, TeamBuild } from '../types';

export const BLUEPRINT_CHALLENGES: BlueprintChallenge[] = [
  // ==========================================================
  // SECTION 1: SHAPES & RECTANGLES (10 CORE CHALLENGES)
  // ==========================================================
  {
    id: 'shape-01',
    code: 'SHP-01',
    title: '4-SIDED FLOOR (AREA ≥ 12 m²)',
    category: 'shape',
    bloomLevel: 'remember',
    difficulty: 1,
    mechanic: 'shape',
    prompt: 'Build any rectangle floor with Area at least 12 m².',
    missionBrief: '💡 Hint: Try Length = 4m and Width = 3m (4 × 3 = 12 m²)!',
    initialBuild: { length: 2, width: 2, height: 1, shapeType: 'rectangle' },
    target: {
      shapeSides: 4,
      shapeVertices: 4,
      shapeType: 'rectangle',
      minArea: 12,
      description: 'Area ≥ 12 m²',
    },
    allowedSolutionsDescription: 'Any rectangle with area ≥ 12 m² (e.g. 4×3, 6×2, 5×3).',
    timeLimit: 45,
    basePoints: 100,
    explanationFormula: 'Rectangle Area = Length × Width.',
    learningTip: 'Rectangles have 4 sides and opposite equal lengths.',
  },
  {
    id: 'shape-02',
    code: 'SHP-02',
    title: 'SQUARE WORKSHOP (4×4)',
    category: 'shape',
    bloomLevel: 'understand',
    difficulty: 1,
    mechanic: 'floor',
    prompt: 'Build a Square floor where Length equals Width, with Area ≥ 16 m².',
    missionBrief: '💡 Hint: For a square, make Length equal Width (e.g. 4m × 4m = 16 m²)!',
    initialBuild: { length: 2, width: 4, height: 1 },
    target: {
      minArea: 16,
      description: 'Square: Length = Width (Area ≥ 16 m²)',
    },
    allowedSolutionsDescription: '4×4 (16 m²), 5×5 (25 m²), 6×6 (36 m²), 7×7 (49 m²), 8×8 (64 m²).',
    timeLimit: 45,
    basePoints: 100,
    explanationFormula: 'Square Area = Side × Side (s²)',
    learningTip: 'A square has 4 identical side lengths.',
  },
  {
    id: 'shape-03',
    code: 'SHP-03',
    title: 'DOUBLE LENGTH CORRIDOR',
    category: 'shape',
    bloomLevel: 'understand',
    difficulty: 2,
    mechanic: 'floor',
    prompt: 'Build a rectangle where Length is 2 times Width (L = 2 × W).',
    missionBrief: '💡 Hint: If Width is 3m, make Length = 6m (6 is double 3)!',
    initialBuild: { length: 4, width: 3, height: 1 },
    target: {
      description: 'Length = 2 × Width (e.g., 6×3 or 8×4)',
    },
    allowedSolutionsDescription: 'Any rectangle where L = 2W (e.g., 4×2, 6×3, 8×4, 10×5, 12×6).',
    timeLimit: 45,
    basePoints: 110,
    explanationFormula: 'Ratio 2:1 -> Length = 2 × Width',
    learningTip: 'Multiplying width by 2 must match your length.',
  },
  {
    id: 'shape-04',
    code: 'SHP-04',
    title: 'TRIPLE LENGTH HANGAR',
    category: 'shape',
    bloomLevel: 'apply',
    difficulty: 2,
    mechanic: 'floor',
    prompt: 'Build a rectangle where Length is 3 times Width (L = 3 × W).',
    missionBrief: '💡 Hint: If Width is 2m, make Length = 6m (6 is 3 times 2)!',
    initialBuild: { length: 5, width: 2, height: 1 },
    target: {
      description: 'Length = 3 × Width (e.g., 6×2 or 9×3)',
    },
    allowedSolutionsDescription: '3×1, 6×2, 9×3, 12×4, 15×5.',
    timeLimit: 45,
    basePoints: 115,
    explanationFormula: 'Length = 3 × Width',
    learningTip: 'If width is 3, length must be 3 × 3 = 9.',
  },
  {
    id: 'shape-05',
    code: 'SHP-05',
    title: 'BASE × HEIGHT (40 m²)',
    category: 'shape',
    bloomLevel: 'analyze',
    difficulty: 3,
    mechanic: 'floor',
    prompt: 'A foundation has Base 8m and Height 5m. Build a floor with Area = 40 m².',
    missionBrief: '💡 Hint: 8m × 5m = 40 m². You can use 8m × 5m or 10m × 4m!',
    initialBuild: { length: 4, width: 4, height: 1 },
    target: {
      area: 40,
      description: 'Area = 40 m² (8 × 5 = 40)',
    },
    allowedSolutionsDescription: '8×5, 5×8, 10×4, 4×10, 20×2, 2×20.',
    timeLimit: 50,
    basePoints: 120,
    explanationFormula: 'Area = Base × Height = 8 × 5 = 40 m²',
    learningTip: 'Base × Height gives the same area as Length × Width.',
  },
  {
    id: 'shape-06',
    code: 'SHP-06',
    title: 'TRIANGLE AREA (36 m²)',
    category: 'shape',
    bloomLevel: 'analyze',
    difficulty: 3,
    mechanic: 'floor',
    prompt: 'A triangle roof has Base 12m and Height 6m (Area = 36 m²). Build a floor with Area = 36 m².',
    missionBrief: '💡 Hint: Triangle Area = 1/2 × 12 × 6 = 36 m². Try 6m × 6m or 9m × 4m!',
    initialBuild: { length: 6, width: 4, height: 1 },
    target: {
      area: 36,
      description: 'Area = 36 m² (6 × 6 = 36)',
    },
    allowedSolutionsDescription: '6×6, 9×4, 4×9, 12×3, 3×12, 18×2.',
    timeLimit: 50,
    basePoints: 125,
    explanationFormula: 'Triangle Area = 1/2 × Base × Height = 1/2 × 12 × 6 = 36 m²',
    learningTip: 'Two triangles of 36 combine into 72, so floor area is 36.',
  },
  {
    id: 'shape-07',
    code: 'SHP-07',
    title: 'LOADING RAMP (32 m²)',
    category: 'shape',
    bloomLevel: 'evaluate',
    difficulty: 4,
    mechanic: 'floor',
    prompt: 'Build a rectangle floor with an exact Area of 32 m².',
    missionBrief: '💡 Hint: Try Length = 8m and Width = 4m (8 × 4 = 32 m²)!',
    initialBuild: { length: 5, width: 4, height: 1 },
    target: {
      area: 32,
      description: 'Area = 32 m² (8 × 4 = 32)',
    },
    allowedSolutionsDescription: '8×4, 4×8, 16×2, 2×16.',
    timeLimit: 55,
    basePoints: 130,
    explanationFormula: 'Area = 8 × 4 = 32 m²',
    learningTip: '8 × 4 = 32.',
  },
  {
    id: 'shape-08',
    code: 'SHP-08',
    title: 'DOUBLE ROOM (36 m²)',
    category: 'shape',
    bloomLevel: 'evaluate',
    difficulty: 4,
    mechanic: 'floor',
    prompt: 'Two rooms (24 m² + 12 m²) combine to 36 m². Build a floor with Area = 36 m².',
    missionBrief: '💡 Hint: 24 + 12 = 36 m². Try Length = 6m and Width = 6m!',
    initialBuild: { length: 6, width: 5, height: 1 },
    target: {
      area: 36,
      description: 'Area = 36 m² (24 + 12 = 36)',
    },
    allowedSolutionsDescription: '6×6, 9×4, 4×9, 12×3, 3×12.',
    timeLimit: 55,
    basePoints: 135,
    explanationFormula: 'Total Area = 24 + 12 = 36 m²',
    learningTip: 'Combine both rooms to find total area: 36.',
  },
  {
    id: 'shape-09',
    code: 'SHP-09',
    title: 'COURTYARD PLAZA (50 m²)',
    category: 'shape',
    bloomLevel: 'evaluate',
    difficulty: 4,
    mechanic: 'floor',
    prompt: 'Two plaza areas (30 m² + 20 m²) combine to 50 m². Build a floor with Area = 50 m².',
    missionBrief: '💡 Hint: 30 + 20 = 50 m². Try Length = 10m and Width = 5m!',
    initialBuild: { length: 8, width: 5, height: 1 },
    target: {
      area: 50,
      description: 'Area = 50 m² (10 × 5 = 50)',
    },
    allowedSolutionsDescription: '10×5, 5×10, 25×2, 2×25.',
    timeLimit: 55,
    basePoints: 135,
    explanationFormula: 'Area = 30 + 20 = 50 m²',
    learningTip: '10 × 5 = 50.',
  },
  {
    id: 'shape-10',
    code: 'SHP-10',
    title: 'PARKING LOT (55 TO 65 m²)',
    category: 'shape',
    bloomLevel: 'analyze',
    difficulty: 3,
    mechanic: 'target-build',
    prompt: 'Build any rectangle floor with Area between 55 m² and 65 m².',
    missionBrief: '💡 Hint: Try 10m × 6m = 60 m² or 8m × 7m = 56 m²!',
    initialBuild: { length: 7, width: 7, height: 1 },
    target: {
      minArea: 55,
      maxArea: 65,
      description: 'Area between 55 m² and 65 m²',
    },
    allowedSolutionsDescription: '8×7 (56), 7×8 (56), 10×6 (60), 6×10 (60), 12×5 (60), 5×12 (60), 8×8 (64).',
    timeLimit: 50,
    basePoints: 120,
    explanationFormula: '55 ≤ Length × Width ≤ 65',
    learningTip: '10 × 6 = 60 m² is right in the middle!',
  },

  // ==========================================================
  // SECTION 2: AREA CHALLENGES (15 CORE CHALLENGES)
  // ==========================================================
  {
    id: 'area-01',
    code: 'AREA-01',
    title: '24 m² WAREHOUSE FLOOR',
    category: 'area',
    bloomLevel: 'understand',
    difficulty: 1,
    mechanic: 'floor',
    prompt: 'Build a floor with an exact Area of 24 m².',
    missionBrief: '💡 Hint: Try 6m × 4m = 24 m² or 8m × 3m = 24 m²!',
    initialBuild: { length: 3, width: 4, height: 1 },
    target: {
      area: 24,
      description: 'Area = 24 m² (Length × Width = 24)',
    },
    allowedSolutionsDescription: '6×4, 4×6, 8×3, 3×8, 12×2, 2×12.',
    timeLimit: 45,
    basePoints: 100,
    explanationFormula: 'Area = Length × Width = 24 m²',
    learningTip: 'Count your grid columns and rows: 6 × 4 = 24 tiles.',
  },
  {
    id: 'area-02',
    code: 'AREA-02',
    title: '36 m² WORKSHOP FLOOR',
    category: 'area',
    bloomLevel: 'understand',
    difficulty: 1,
    mechanic: 'floor',
    prompt: 'Build a floor with an exact Area of 36 m².',
    missionBrief: '💡 Hint: Try 6m × 6m = 36 m² or 9m × 4m = 36 m²!',
    initialBuild: { length: 5, width: 5, height: 1 },
    target: {
      area: 36,
      description: 'Area = 36 m² (Length × Width = 36)',
    },
    allowedSolutionsDescription: '6×6, 9×4, 4×9, 12×3, 3×12, 18×2.',
    timeLimit: 45,
    basePoints: 100,
    explanationFormula: 'Area = Length × Width = 36 m²',
    learningTip: 'Both a 6×6 square and 9×4 rectangle give 36 m².',
  },
  {
    id: 'area-03',
    code: 'AREA-03',
    title: '48 m² STORAGE DEPOT',
    category: 'area',
    bloomLevel: 'apply',
    difficulty: 2,
    mechanic: 'floor',
    prompt: 'Build a floor with an exact Area of 48 m².',
    missionBrief: '💡 Hint: Try 8m × 6m = 48 m² or 12m × 4m = 48 m²!',
    initialBuild: { length: 6, width: 6, height: 1 },
    target: {
      area: 48,
      description: 'Area = 48 m²',
    },
    allowedSolutionsDescription: '8×6, 6×8, 12×4, 4×12, 16×3.',
    timeLimit: 50,
    basePoints: 110,
    explanationFormula: 'Area = Length × Width = 48 m²',
    learningTip: '8 rows of 6 tiles = 48 tiles total.',
  },
  {
    id: 'area-04',
    code: 'AREA-04',
    title: 'MISSING LENGTH (WIDTH = 6m)',
    category: 'area',
    bloomLevel: 'apply',
    difficulty: 2,
    mechanic: 'blueprint',
    prompt: 'Width is 6m and target Area is 54 m². Set the correct Length.',
    missionBrief: '💡 Hint: Area ÷ Width = 54 ÷ 6 = 9m! Set Length to 9m.',
    initialBuild: { length: 5, width: 6, height: 1 },
    target: {
      width: 6,
      area: 54,
      description: 'Width = 6m, Area = 54 m² (Length = 9m)',
    },
    allowedSolutionsDescription: 'Length = 9m, Width = 6m.',
    timeLimit: 45,
    basePoints: 115,
    explanationFormula: 'Length = 54 ÷ 6 = 9 m',
    learningTip: 'Divide total area by width to find length.',
  },
  {
    id: 'area-05',
    code: 'AREA-05',
    title: 'MISSING WIDTH (LENGTH = 8m)',
    category: 'area',
    bloomLevel: 'apply',
    difficulty: 2,
    mechanic: 'blueprint',
    prompt: 'Length is 8m and target Area is 56 m². Set the correct Width.',
    missionBrief: '💡 Hint: Area ÷ Length = 56 ÷ 8 = 7m! Set Width to 7m.',
    initialBuild: { length: 8, width: 4, height: 1 },
    target: {
      length: 8,
      area: 56,
      description: 'Length = 8m, Area = 56 m² (Width = 7m)',
    },
    allowedSolutionsDescription: 'Length = 8m, Width = 7m.',
    timeLimit: 45,
    basePoints: 115,
    explanationFormula: 'Width = 56 ÷ 8 = 7 m',
    learningTip: '56 divided by 8 equals 7.',
  },
  {
    id: 'area-06',
    code: 'AREA-06',
    title: 'TARGET AREA (40 TO 50 m²)',
    category: 'area',
    bloomLevel: 'evaluate',
    difficulty: 3,
    mechanic: 'target-build',
    prompt: 'Build any rectangle floor with Area between 40 m² and 50 m².',
    missionBrief: '💡 Hint: Try 6m × 7m = 42 m² or 8m × 6m = 48 m²!',
    initialBuild: { length: 4, width: 4, height: 1 },
    target: {
      minArea: 40,
      maxArea: 50,
      description: '40 m² ≤ Area ≤ 50 m²',
    },
    allowedSolutionsDescription: '6×7 (42), 7×6 (42), 5×9 (45), 6×8 (48), 8×6 (48), 5×10 (50), 7×7 (49).',
    timeLimit: 50,
    basePoints: 120,
    explanationFormula: '40 ≤ (Length × Width) ≤ 50',
    learningTip: '6 × 7 = 42 m² or 6 × 8 = 48 m² are both great answers!',
  },

  // ==========================================================
  // SECTION 3: 3D VOLUME & CUBES (15 CORE CHALLENGES)
  // ==========================================================
  {
    id: 'vol-01',
    code: 'VOL-01',
    title: '24 m³ 3D CARGO BOX',
    category: 'volume',
    bloomLevel: 'understand',
    difficulty: 1,
    mechanic: 'cubes',
    prompt: 'Build a 3D box with a Volume of 24 m³ (L × W × H = 24).',
    missionBrief: '💡 Hint: Try Length = 4m, Width = 3m, Height = 2m (4 × 3 × 2 = 24 m³)!',
    initialBuild: { length: 2, width: 2, height: 2 },
    target: {
      volume: 24,
      description: 'Volume = 24 m³ (L × W × H = 24)',
    },
    allowedSolutionsDescription: '4×3×2, 3×4×2, 6×2×2, 2×6×2, 4×2×3, 6×4×1, 8×3×1.',
    timeLimit: 50,
    basePoints: 110,
    explanationFormula: 'Volume = Length × Width × Height = 24 m³',
    learningTip: 'Floor area is 4×3 = 12. 2 layers high = 12 × 2 = 24 m³.',
  },
  {
    id: 'vol-02',
    code: 'VOL-02',
    title: '36 m³ 3D MASONRY VAULT',
    category: 'volume',
    bloomLevel: 'understand',
    difficulty: 2,
    mechanic: 'cubes',
    prompt: 'Build a 3D building with a Volume of 36 m³ (L × W × H = 36).',
    missionBrief: '💡 Hint: Try 4m × 3m × 3m = 36 m³ or 6m × 3m × 2m = 36 m³!',
    initialBuild: { length: 3, width: 2, height: 2 },
    target: {
      volume: 36,
      description: 'Volume = 36 m³ (L × W × H = 36)',
    },
    allowedSolutionsDescription: '4×3×3, 3×4×3, 6×3×2, 3×6×2, 6×2×3, 9×2×2.',
    timeLimit: 50,
    basePoints: 115,
    explanationFormula: 'Volume = Length × Width × Height = 36 m³',
    learningTip: 'Base area 4×3 = 12. Multiply by height 3 = 36 m³.',
  },
  {
    id: 'vol-03',
    code: 'VOL-03',
    title: '48 m³ POWER TOWER',
    category: 'volume',
    bloomLevel: 'apply',
    difficulty: 2,
    mechanic: 'cubes',
    prompt: 'Build a 3D tower with a Volume of 48 m³.',
    missionBrief: '💡 Hint: Try Length = 4m, Width = 4m, Height = 3m (4 × 4 × 3 = 48 m³)!',
    initialBuild: { length: 4, width: 2, height: 2 },
    target: {
      volume: 48,
      description: 'Volume = 48 m³ (L × W × H = 48)',
    },
    allowedSolutionsDescription: '4×4×3, 6×4×2, 4×6×2, 6×2×4, 8×3×2, 3×8×2.',
    timeLimit: 50,
    basePoints: 120,
    explanationFormula: 'Volume = 4 × 4 × 3 = 48 m³',
    learningTip: '4 × 4 = 16 base. 16 × 3 layers = 48 m³.',
  },
  {
    id: 'vol-04',
    code: 'VOL-04',
    title: '60 m³ COOLING TOWER',
    category: 'volume',
    bloomLevel: 'apply',
    difficulty: 2,
    mechanic: 'cubes',
    prompt: 'Build a 3D structure with a Volume of 60 m³.',
    missionBrief: '💡 Hint: Try Length = 5m, Width = 4m, Height = 3m (5 × 4 × 3 = 60 m³)!',
    initialBuild: { length: 3, width: 3, height: 3 },
    target: {
      volume: 60,
      description: 'Volume = 60 m³',
    },
    allowedSolutionsDescription: '5×4×3, 4×5×3, 6×5×2, 5×6×2, 6×2×5, 10×3×2.',
    timeLimit: 55,
    basePoints: 120,
    explanationFormula: 'Volume = 5 × 4 × 3 = 60 m³',
    learningTip: '5 × 4 = 20. Stacking 3 layers gives 20 × 3 = 60 m³.',
  },
  {
    id: 'vol-05',
    code: 'VOL-05',
    title: 'MISSING HEIGHT (BASE = 6m × 4m)',
    category: 'volume',
    bloomLevel: 'apply',
    difficulty: 3,
    mechanic: 'blueprint',
    prompt: 'Base is 6m × 4m (24 m²). Build Height so total Volume = 72 m³.',
    missionBrief: '💡 Hint: 72 ÷ 24 = 3m! Set Height to 3m.',
    initialBuild: { length: 6, width: 4, height: 1 },
    target: {
      length: 6,
      width: 4,
      volume: 72,
      description: 'Base = 6×4, Volume = 72 m³ (Height = 3m)',
    },
    allowedSolutionsDescription: 'Length = 6m, Width = 4m, Height = 3m.',
    timeLimit: 50,
    basePoints: 125,
    explanationFormula: 'Height = Volume ÷ Base Area = 72 ÷ 24 = 3 m',
    learningTip: 'Divide total volume (72) by base area (24) to find height (3).',
  },
  {
    id: 'vol-06',
    code: 'VOL-06',
    title: 'CUBE TOWER (3 × 3 × 3 = 27 m³)',
    category: 'volume',
    bloomLevel: 'understand',
    difficulty: 2,
    mechanic: 'cubes',
    prompt: 'Build a perfect 3D Cube where Length = Width = Height = 3m.',
    missionBrief: '💡 Hint: Make all 3 dimensions equal to 3m (3 × 3 × 3 = 27 m³)!',
    initialBuild: { length: 2, width: 2, height: 2 },
    target: {
      length: 3,
      width: 3,
      height: 3,
      volume: 27,
      description: 'Cube: L=3m, W=3m, H=3m (Volume = 27 m³)',
    },
    allowedSolutionsDescription: 'Length = 3m, Width = 3m, Height = 3m.',
    timeLimit: 45,
    basePoints: 110,
    explanationFormula: 'Cube Volume = s³ = 3 × 3 × 3 = 27 m³',
    learningTip: 'A cube has equal length, width, and height.',
  },
];

/**
 * Multi-Solution Validation Engine
 */
export function validateChallengeSolution(
  challenge: BlueprintChallenge,
  build: TeamBuild
) {
  const { length, width, height, blocks } = build;
  const target = challenge.target;

  const measuredArea = length * width;
  const measuredVolume = challenge.mechanic === 'modify' ? blocks : length * width * height;

  let isCorrect = true;
  let statusMessage = 'STRUCTURE APPROVED';
  let diffMessage = 'Meets all blueprint specifications!';
  let formula = `${length}m × ${width}m = ${measuredArea} m²`;

  if (challenge.category === 'volume' || challenge.mechanic === 'cubes') {
    formula = `${length}m × ${width}m × ${height}m = ${measuredVolume} m³`;
  }

  // 1. Exact Area Check
  if (target.area !== undefined) {
    if (measuredArea !== target.area) {
      isCorrect = false;
      const diff = target.area - measuredArea;
      statusMessage = 'AREA MISMATCH';
      diffMessage = diff > 0 ? `Needs ${diff} m² more area` : `Exceeds target by ${Math.abs(diff)} m²`;
    }
  }

  // 2. Exact Volume Check
  if (target.volume !== undefined) {
    if (measuredVolume !== target.volume) {
      isCorrect = false;
      const diff = target.volume - measuredVolume;
      statusMessage = 'VOLUME MISMATCH';
      diffMessage = diff > 0 ? `Needs ${diff} m³ more volume` : `Exceeds target by ${Math.abs(diff)} m³`;
    }
  }

  // 3. Area Range Check
  if (target.minArea !== undefined && target.maxArea !== undefined) {
    if (measuredArea < target.minArea || measuredArea > target.maxArea) {
      isCorrect = false;
      statusMessage = 'OUT OF AREA RANGE';
      diffMessage = measuredArea < target.minArea
        ? `Below minimum (${target.minArea} m²)`
        : `Above maximum (${target.maxArea} m²)`;
    }
  } else if (target.minArea !== undefined && measuredArea < target.minArea) {
    isCorrect = false;
    statusMessage = 'AREA TOO SMALL';
    diffMessage = `Requires at least ${target.minArea} m²`;
  }

  // 4. Volume Range Check
  if (target.minVolume !== undefined && target.maxVolume !== undefined) {
    if (measuredVolume < target.minVolume || measuredVolume > target.maxVolume) {
      isCorrect = false;
      statusMessage = 'OUT OF VOLUME RANGE';
      diffMessage = measuredVolume < target.minVolume
        ? `Below minimum (${target.minVolume} m³)`
        : `Above maximum (${target.maxVolume} m³)`;
    }
  }

  // 5. Fixed Dimension Constraints
  if (target.length !== undefined && length !== target.length) {
    isCorrect = false;
    statusMessage = 'LENGTH MISMATCH';
    diffMessage = `Requires Length = ${target.length}m (Currently: ${length}m)`;
  }
  if (target.width !== undefined && width !== target.width) {
    isCorrect = false;
    statusMessage = 'WIDTH MISMATCH';
    diffMessage = `Requires Width = ${target.width}m (Currently: ${width}m)`;
  }
  if (target.height !== undefined && height !== target.height) {
    isCorrect = false;
    statusMessage = 'HEIGHT MISMATCH';
    diffMessage = `Requires Height = ${target.height}m (Currently: ${height}m)`;
  }

  // 6. Proportions Check
  if (challenge.id === 'shape-02' && length !== width) {
    isCorrect = false;
    statusMessage = 'NOT A SQUARE';
    diffMessage = `Length (${length}m) must equal Width (${width}m) for a square!`;
  } else if (challenge.id === 'shape-03' && length !== 2 * width) {
    isCorrect = false;
    statusMessage = 'PROPORTION MISMATCH';
    diffMessage = `Length (${length}m) must be 2× Width (${width}m, expected ${width * 2}m)`;
  } else if (challenge.id === 'shape-04' && length !== 3 * width) {
    isCorrect = false;
    statusMessage = 'PROPORTION MISMATCH';
    diffMessage = `Length (${length}m) must be 3× Width (${width}m, expected ${width * 3}m)`;
  }

  return {
    isValid: isCorrect,
    isCorrect,
    measuredLength: length,
    measuredWidth: width,
    measuredHeight: height,
    measuredArea,
    measuredVolume,
    statusMessage,
    diffMessage,
    formula,
  };
}

/**
 * Helper to select non-repeating random challenge
 */
export function getRandomChallenge(
  usedIds: string[] = [],
  targetDifficulty?: 1 | 2 | 3 | 4 | 5
): BlueprintChallenge {
  let pool = BLUEPRINT_CHALLENGES.filter((c) => !usedIds.includes(c.id));

  if (pool.length === 0) {
    pool = [...BLUEPRINT_CHALLENGES];
  }

  if (targetDifficulty !== undefined) {
    const diffPool = pool.filter((c) => c.difficulty === targetDifficulty);
    if (diffPool.length > 0) {
      pool = diffPool;
    }
  }

  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}
