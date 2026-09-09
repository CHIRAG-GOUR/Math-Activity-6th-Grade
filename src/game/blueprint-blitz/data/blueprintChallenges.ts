// ============================================================
// BLUEPRINT BLITZ — 100 Unique Grade 6 Architectural Challenges
// Curriculum: Shapes, Area, Volume, Unit Cubes & Dimensional Reasoning
// ============================================================

import { BloomLevel, BlueprintChallenge, TeamBuild } from '../types';

export const BLUEPRINT_CHALLENGES: BlueprintChallenge[] = [
  // ==========================================================
  // SECTION 1: SHAPE & GEOMETRY CHALLENGES (20 CHALLENGES)
  // ==========================================================
  {
    id: 'shape-01',
    code: 'SHP-01',
    title: 'THE 4-SIDED FOUNDATION',
    category: 'shape',
    bloomLevel: 'remember',
    difficulty: 1,
    mechanic: 'shape',
    prompt: 'Construct a rectangular foundation with exactly 4 straight sides and 4 right angles.',
    missionBrief: 'Surveyors need a standard 4-sided quadrilateral plot for the warehouse base.',
    initialBuild: { length: 2, width: 2, height: 1, shapeType: 'rectangle' },
    target: {
      shapeSides: 4,
      shapeVertices: 4,
      shapeType: 'rectangle',
      minArea: 12,
      description: 'Quadrilateral with 4 vertices and Area ≥ 12 m²',
    },
    allowedSolutionsDescription: 'Any rectangular dimensions with area at least 12 square units (e.g. 4×3, 6×2, 5×3).',
    timeLimit: 45,
    basePoints: 100,
    explanationFormula: 'Quadrilateral = 4 Sides + 4 Vertices. Area = Length × Width.',
    learningTip: 'Rectangles have opposite equal sides and 4 perpendicular 90° corners.',
  },
  {
    id: 'shape-02',
    code: 'SHP-02',
    title: 'THE SQUARE WORKSHOP',
    category: 'shape',
    bloomLevel: 'understand',
    difficulty: 1,
    mechanic: 'floor',
    prompt: 'Build a square workshop floor where Length equals Width, with Area ≥ 16 m².',
    missionBrief: 'The generator workshop must be a perfect equilateral square.',
    initialBuild: { length: 2, width: 4, height: 1 },
    target: {
      minArea: 16,
      description: 'Square floor: Length = Width and Area ≥ 16 m²',
    },
    allowedSolutionsDescription: '4×4 (16 m²), 5×5 (25 m²), 6×6 (36 m²), 7×7 (49 m²), 8×8 (64 m²).',
    timeLimit: 45,
    basePoints: 100,
    explanationFormula: 'Square Area = Side × Side (s²)',
    learningTip: 'A square is an equilateral rectangle with 4 identical side lengths.',
  },
  {
    id: 'shape-03',
    code: 'SHP-03',
    title: 'GOLDEN RECTANGLE CORRIDOR',
    category: 'shape',
    bloomLevel: 'understand',
    difficulty: 2,
    mechanic: 'floor',
    prompt: 'Build a rectangular corridor where the Length is exactly double the Width (L = 2W).',
    missionBrief: 'The logistics train corridor must maintain a 2:1 length-to-width proportion.',
    initialBuild: { length: 4, width: 3, height: 1 },
    target: {
      description: 'Rectangle with Length = 2 × Width (e.g., 6×3, 8×4, 10×5, 12×6)',
    },
    allowedSolutionsDescription: 'Any rectangle where L = 2W (e.g., 4×2, 6×3, 8×4, 10×5, 12×6).',
    timeLimit: 45,
    basePoints: 110,
    explanationFormula: 'Ratio 2:1 -> Length = 2 × Width',
    learningTip: 'Check your proportions: multiplying width by 2 must match your length.',
  },
  {
    id: 'shape-04',
    code: 'SHP-04',
    title: 'TRIPLE-SPAN HANGAR',
    category: 'shape',
    bloomLevel: 'apply',
    difficulty: 2,
    mechanic: 'floor',
    prompt: 'Build a rectangular aircraft hangar where Length is exactly 3 times the Width (L = 3W).',
    missionBrief: 'The cargo drone hangar needs a 3:1 aspect ratio floor.',
    initialBuild: { length: 5, width: 2, height: 1 },
    target: {
      description: 'Rectangle with Length = 3 × Width (e.g., 6×2, 9×3, 12×4)',
    },
    allowedSolutionsDescription: '3×1, 6×2, 9×3, 12×4, 15×5.',
    timeLimit: 45,
    basePoints: 115,
    explanationFormula: 'Length = 3 × Width | Area = 3W × W',
    learningTip: 'If width is 3, length must be 3 × 3 = 9.',
  },
  {
    id: 'shape-05',
    code: 'SHP-05',
    title: 'PARALLELOGRAM SUBDIVISION',
    category: 'shape',
    bloomLevel: 'analyze',
    difficulty: 3,
    mechanic: 'floor',
    prompt: 'Build a base rectangle that has the exact same area as a base 8m × height 5m parallelogram.',
    missionBrief: 'Convert the surveyor\'s slanted plot into a rectilinear construction footprint.',
    initialBuild: { length: 4, width: 4, height: 1 },
    target: {
      area: 40,
      description: 'Area = 40 m² (Base 8 × Height 5 = 40)',
    },
    allowedSolutionsDescription: '8×5, 5×8, 10×4, 4×10, 20×2, 2×20.',
    timeLimit: 50,
    basePoints: 120,
    explanationFormula: 'Parallelogram Area = Base × Height = 8 × 5 = 40 m²',
    learningTip: 'A parallelogram with base b and height h has the exact same area as a b × h rectangle.',
  },
  {
    id: 'shape-06',
    code: 'SHP-06',
    title: 'TRIANGLE DECOMPOSITION BASE',
    category: 'shape',
    bloomLevel: 'analyze',
    difficulty: 3,
    mechanic: 'floor',
    prompt: 'A roof truss covers a triangle with base 12m and height 6m. Build a rectangular floor with equal area.',
    missionBrief: 'Match the ground floor area to the triangular roof canopy.',
    initialBuild: { length: 6, width: 4, height: 1 },
    target: {
      area: 36,
      description: 'Area = 36 m² (Triangle: 1/2 × 12 × 6 = 36)',
    },
    allowedSolutionsDescription: '6×6, 9×4, 4×9, 12×3, 3×12, 18×2.',
    timeLimit: 50,
    basePoints: 125,
    explanationFormula: 'Triangle Area = 1/2 × Base × Height = 1/2 × 12 × 6 = 36 m²',
    learningTip: 'Two congruent triangles combine to form one rectangle of area Base × Height.',
  },
  {
    id: 'shape-07',
    code: 'SHP-07',
    title: 'TRAPEZOID PLATFORM MATCH',
    category: 'shape',
    bloomLevel: 'evaluate',
    difficulty: 4,
    mechanic: 'floor',
    prompt: 'A trapezoid loading ramp has bases 6m & 10m and height 4m. Build a rectangle with equal area.',
    missionBrief: 'Construct a rectangular staging pad matching the trapezoid area.',
    initialBuild: { length: 5, width: 4, height: 1 },
    target: {
      area: 32,
      description: 'Area = 32 m² (Trapezoid: (6+10)/2 × 4 = 32)',
    },
    allowedSolutionsDescription: '8×4, 4×8, 16×2, 2×16.',
    timeLimit: 55,
    basePoints: 130,
    explanationFormula: 'Trapezoid Area = ((b1 + b2) / 2) × h = ((6 + 10)/2) × 4 = 8 × 4 = 32 m²',
    learningTip: 'Average the parallel bases (8m) and multiply by height (4m).',
  },
  {
    id: 'shape-08',
    code: 'SHP-08',
    title: 'COMPOSITE L-SHAPE EQUIVALENT',
    category: 'shape',
    bloomLevel: 'evaluate',
    difficulty: 4,
    mechanic: 'floor',
    prompt: 'An L-shaped foundation is made of two sections: 6m × 4m plus 4m × 3m. Build a single rectangle of equal area.',
    missionBrief: 'Calculate total composite area and build a unified rectangle.',
    initialBuild: { length: 6, width: 5, height: 1 },
    target: {
      area: 36,
      description: 'Area = 36 m² (24 + 12 = 36 m²)',
    },
    allowedSolutionsDescription: '6×6, 9×4, 4×9, 12×3, 3×12.',
    timeLimit: 55,
    basePoints: 135,
    explanationFormula: 'Total Area = Section A (6×4=24) + Section B (4×3=12) = 36 m²',
    learningTip: 'Deconstruct complex shapes into rectangles and sum their areas.',
  },
  {
    id: 'shape-09',
    code: 'SHP-09',
    title: 'COMPOSITE T-SHAPE EQUIVALENT',
    category: 'shape',
    bloomLevel: 'evaluate',
    difficulty: 4,
    mechanic: 'floor',
    prompt: 'A T-shaped deck has a top bar of 10m × 3m and a central stem of 4m × 5m. Build a single rectangle of equal area.',
    missionBrief: 'Decompose the T-deck to find the target building area.',
    initialBuild: { length: 8, width: 5, height: 1 },
    target: {
      area: 50,
      description: 'Area = 50 m² (Top 30 + Stem 20 = 50 m²)',
    },
    allowedSolutionsDescription: '10×5, 5×10, 25×2, 2×25.',
    timeLimit: 55,
    basePoints: 135,
    explanationFormula: 'Area = (10 × 3) + (4 × 5) = 30 + 20 = 50 m²',
    learningTip: 'Add the two sub-rectangles: 30 + 20 = 50.',
  },
  {
    id: 'shape-10',
    code: 'SHP-10',
    title: 'OCTAGONAL PLAZA BOUNDS',
    category: 'shape',
    bloomLevel: 'analyze',
    difficulty: 3,
    mechanic: 'target-build',
    prompt: 'A regular octagon courtyard has an area between 55 m² and 65 m². Build a rectangular floor in this range.',
    missionBrief: 'Construct a rectangular foundation within the courtyard area tolerance.',
    initialBuild: { length: 7, width: 7, height: 1 },
    target: {
      minArea: 55,
      maxArea: 65,
      description: 'Area between 55 m² and 65 m²',
    },
    allowedSolutionsDescription: '8×7 (56), 7×8 (56), 10×6 (60), 6×10 (60), 12×5 (60), 5×12 (60), 8×8 (64).',
    timeLimit: 50,
    basePoints: 120,
    explanationFormula: 'Target Range: 55 m² ≤ Length × Width ≤ 65 m²',
    learningTip: '8 × 7 = 56 m² or 10 × 6 = 60 m² are both perfect fits!',
  },
  // Additional Shape Challenges (11-20)
  ...Array.from({ length: 10 }).map((_, i) => {
    const idx = 11 + i;
    const baseW = 4 + (i % 5);
    const baseL = 6 + ((i * 2) % 6);
    const area = baseW * baseL;
    return {
      id: `shape-${idx}`,
      code: `SHP-${idx}`,
      title: `STRUCTURAL POLYGON #${idx}`,
      category: 'shape' as const,
      bloomLevel: (i % 2 === 0 ? 'apply' : 'analyze') as BloomLevel,
      difficulty: (2 + (i % 3)) as 1 | 2 | 3 | 4 | 5,
      mechanic: 'floor' as const,
      prompt: `Build a 4-sided geometric foundation with an exact total surface area of ${area} m².`,
      missionBrief: `The architect requires a quadrilateral slab of precisely ${area} square meters.`,
      initialBuild: { length: 3, width: 3, height: 1 },
      target: {
        area,
        description: `Area = ${area} m²`,
      },
      allowedSolutionsDescription: `Any dimensions where L × W = ${area} (such as ${baseL}×${baseW} or ${baseW}×${baseL}).`,
      timeLimit: 45 + (i % 3) * 5,
      basePoints: 110 + i * 2,
      explanationFormula: `Length × Width = ${area} m²`,
      learningTip: `Find two factors of ${area} and set them as your length and width.`,
    };
  }),

  // ==========================================================
  // SECTION 2: AREA CHALLENGES (35 CHALLENGES)
  // ==========================================================
  {
    id: 'area-01',
    code: 'AREA-01',
    title: 'THE 24-GRID WAREHOUSE',
    category: 'area',
    bloomLevel: 'understand',
    difficulty: 1,
    mechanic: 'floor',
    prompt: 'Construct a rectangular floor with an exact area of 24 square units.',
    missionBrief: 'The inventory warehouse must cover exactly 24 unit tiles.',
    initialBuild: { length: 3, width: 4, height: 1 },
    target: {
      area: 24,
      description: 'Area = 24 square units',
    },
    allowedSolutionsDescription: '6×4, 4×6, 8×3, 3×8, 12×2, 2×12, 24×1.',
    timeLimit: 45,
    basePoints: 100,
    explanationFormula: 'Area = Length × Width = 24 m²',
    learningTip: 'Count your grid columns and rows: 6 × 4 = 24 tiles.',
  },
  {
    id: 'area-02',
    code: 'AREA-02',
    title: 'THE 36-GRID WORKSHOP',
    category: 'area',
    bloomLevel: 'understand',
    difficulty: 1,
    mechanic: 'floor',
    prompt: 'Build a rectangular floor with an exact area of 36 square units.',
    missionBrief: 'The machine shop floor requires 36 floor tiles.',
    initialBuild: { length: 5, width: 5, height: 1 },
    target: {
      area: 36,
      description: 'Area = 36 square units',
    },
    allowedSolutionsDescription: '6×6, 9×4, 4×9, 12×3, 3×12, 18×2, 2×18.',
    timeLimit: 45,
    basePoints: 100,
    explanationFormula: 'Area = Length × Width = 36 m²',
    learningTip: 'Both a 6×6 square and a 9×4 rectangle have an area of 36.',
  },
  {
    id: 'area-03',
    code: 'AREA-03',
    title: 'THE 48-GRID STORAGE DEPOT',
    category: 'area',
    bloomLevel: 'apply',
    difficulty: 2,
    mechanic: 'floor',
    prompt: 'Construct a rectangular floor with an area of 48 square units.',
    missionBrief: 'The main storage depot must cover exactly 48 m².',
    initialBuild: { length: 6, width: 6, height: 1 },
    target: {
      area: 48,
      description: 'Area = 48 square units',
    },
    allowedSolutionsDescription: '8×6, 6×8, 12×4, 4×12, 16×3, 3×16, 24×2.',
    timeLimit: 50,
    basePoints: 110,
    explanationFormula: 'Area = Length × Width = 48 m²',
    learningTip: '8 rows of 6 tiles = 48 tiles total.',
  },
  {
    id: 'area-04',
    code: 'AREA-04',
    title: 'MISSING LENGTH: WIDTH 6m',
    category: 'area',
    bloomLevel: 'apply',
    difficulty: 2,
    mechanic: 'blueprint',
    prompt: 'A blueprint requires Area = 54 m² with a fixed Width of 6m. Build the correct Length.',
    missionBrief: 'The foundation boundary is fixed at 6m width. Extend length to hit 54 m².',
    initialBuild: { length: 5, width: 6, height: 1 },
    target: {
      width: 6,
      area: 54,
      description: 'Width = 6m and Area = 54 m² (Length = 9m)',
    },
    allowedSolutionsDescription: 'Length = 9m, Width = 6m.',
    timeLimit: 45,
    basePoints: 115,
    explanationFormula: 'Length = Area ÷ Width = 54 ÷ 6 = 9 m',
    learningTip: 'Divide the total area (54) by the given width (6) to find length (9).',
  },
  {
    id: 'area-05',
    code: 'AREA-05',
    title: 'MISSING WIDTH: LENGTH 8m',
    category: 'area',
    bloomLevel: 'apply',
    difficulty: 2,
    mechanic: 'blueprint',
    prompt: 'A hangar is 8m long with a target area of 56 m². Set the correct Width.',
    missionBrief: 'Lock length at 8m and adjust width to achieve 56 m².',
    initialBuild: { length: 8, width: 4, height: 1 },
    target: {
      length: 8,
      area: 56,
      description: 'Length = 8m and Area = 56 m² (Width = 7m)',
    },
    allowedSolutionsDescription: 'Length = 8m, Width = 7m.',
    timeLimit: 45,
    basePoints: 115,
    explanationFormula: 'Width = Area ÷ Length = 56 ÷ 8 = 7 m',
    learningTip: '56 ÷ 8 = 7 meters.',
  },
  {
    id: 'area-06',
    code: 'AREA-06',
    title: 'DEMOLISH: REDUCE AREA BY 12 m²',
    category: 'area',
    bloomLevel: 'analyze',
    difficulty: 3,
    mechanic: 'modify',
    prompt: 'The current floor is 7m × 6m (42 m²). Reduce its area by exactly 12 m² to reach 30 m².',
    missionBrief: 'Excavators need to shave 12 square meters off the existing foundation.',
    initialBuild: { length: 7, width: 6, height: 1 },
    target: {
      area: 30,
      description: 'Area = 30 m² (Original 42 - 12 = 30 m²)',
    },
    allowedSolutionsDescription: '6×5, 5×6, 10×3, 3×10, 15×2.',
    timeLimit: 50,
    basePoints: 125,
    explanationFormula: 'New Area = 42 - 12 = 30 m²',
    learningTip: '42 minus 12 equals 30. Build any 30 m² rectangle like 6×5.',
  },
  {
    id: 'area-07',
    code: 'AREA-07',
    title: 'EXPAND: INCREASE AREA BY 18 m²',
    category: 'area',
    bloomLevel: 'analyze',
    difficulty: 3,
    mechanic: 'modify',
    prompt: 'The current base is 6m × 5m (30 m²). Expand its area by exactly 18 m² to reach 48 m².',
    missionBrief: 'Pour additional concrete to expand the floor by 18 square meters.',
    initialBuild: { length: 6, width: 5, height: 1 },
    target: {
      area: 48,
      description: 'Area = 48 m² (Original 30 + 18 = 48 m²)',
    },
    allowedSolutionsDescription: '8×6, 6×8, 12×4, 4×12, 16×3.',
    timeLimit: 50,
    basePoints: 125,
    explanationFormula: 'New Area = 30 + 18 = 48 m²',
    learningTip: '30 + 18 = 48. Expand dimensions to 8×6 or 12×4.',
  },
  {
    id: 'area-08',
    code: 'AREA-08',
    title: 'TARGET RANGE: 40 m² TO 50 m²',
    category: 'area',
    bloomLevel: 'evaluate',
    difficulty: 3,
    mechanic: 'target-build',
    prompt: 'Build any rectangular foundation with an area between 40 m² and 50 m² inclusive.',
    missionBrief: 'The building permit grants freedom between 40 and 50 square meters.',
    initialBuild: { length: 4, width: 4, height: 1 },
    target: {
      minArea: 40,
      maxArea: 50,
      description: '40 m² ≤ Area ≤ 50 m²',
    },
    allowedSolutionsDescription: '5×8 (40), 6×7 (42), 7×6 (42), 5×9 (45), 6×8 (48), 8×6 (48), 5×10 (50), 7×7 (49).',
    timeLimit: 50,
    basePoints: 120,
    explanationFormula: '40 ≤ (Length × Width) ≤ 50',
    learningTip: '6 × 7 = 42 m² or 6 × 8 = 48 m² are both valid solutions!',
  },
  {
    id: 'area-09',
    code: 'AREA-09',
    title: 'TARGET RANGE: 60 m² TO 70 m²',
    category: 'area',
    bloomLevel: 'evaluate',
    difficulty: 3,
    mechanic: 'target-build',
    prompt: 'Construct a rectangular solar farm base with an area between 60 m² and 70 m².',
    missionBrief: 'The solar panel array requires between 60 and 70 square meters.',
    initialBuild: { length: 5, width: 5, height: 1 },
    target: {
      minArea: 60,
      maxArea: 70,
      description: '60 m² ≤ Area ≤ 70 m²',
    },
    allowedSolutionsDescription: '10×6 (60), 6×10 (60), 9×7 (63), 7×9 (63), 8×8 (64), 11×6 (66), 6×11 (66), 10×7 (70).',
    timeLimit: 50,
    basePoints: 125,
    explanationFormula: '60 ≤ (Length × Width) ≤ 70',
    learningTip: '8 × 8 = 64 m² or 9 × 7 = 63 m² are both perfect fits!',
  },
  {
    id: 'area-10',
    code: 'AREA-10',
    title: 'MAXIMUM AREA PERIMETER 24m',
    category: 'area',
    bloomLevel: 'create',
    difficulty: 4,
    mechanic: 'blueprint',
    prompt: 'You have 24m of perimeter security fence (2L + 2W = 24). Build the rectangle that maximizes Area.',
    missionBrief: 'Find the dimensional configuration that encloses the greatest possible floor area.',
    initialBuild: { length: 10, width: 2, height: 1 },
    target: {
      area: 36,
      description: 'Perimeter = 24m, Maximum Area = 36 m² (6m × 6m square)',
    },
    allowedSolutionsDescription: '6×6 (Area = 36, Perimeter = 24).',
    timeLimit: 60,
    basePoints: 140,
    explanationFormula: 'For a fixed perimeter, a square (6×6) maximizes area: 36 m².',
    learningTip: 'A square always produces greater area than an elongated rectangle of the same perimeter!',
  },
  // Auto-generated varied Area Challenges (11 to 35)
  ...Array.from({ length: 25 }).map((_, i) => {
    const idx = 11 + i;
    const l = 5 + (i % 7);
    const w = 4 + ((i * 3) % 6);
    const targetArea = l * w;
    return {
      id: `area-${idx}`,
      code: `AREA-${idx}`,
      title: `FOUNDATION PLOT #${idx}`,
      category: 'area' as const,
      bloomLevel: (i % 3 === 0 ? 'apply' : i % 3 === 1 ? 'analyze' : 'evaluate') as BloomLevel,
      difficulty: (2 + (i % 4)) as 1 | 2 | 3 | 4 | 5,
      mechanic: 'floor' as const,
      prompt: `Construct a structural floor with an exact surface area of ${targetArea} square meters.`,
      missionBrief: `Surveyor mandate: The concrete platform must measure exactly ${targetArea} m².`,
      initialBuild: { length: 3, width: 3, height: 1 },
      target: {
        area: targetArea,
        description: `Area = ${targetArea} m²`,
      },
      allowedSolutionsDescription: `Any dimensions where L × W = ${targetArea} (such as ${l}×${w} or ${w}×${l}).`,
      timeLimit: 45 + (i % 4) * 5,
      basePoints: 110 + i,
      explanationFormula: `Length × Width = ${targetArea} m²`,
      learningTip: `${l} × ${w} = ${targetArea}. You can also use other factor pairs of ${targetArea}!`,
    };
  }),

  // ==========================================================
  // SECTION 3: VOLUME CHALLENGES (35 CHALLENGES)
  // ==========================================================
  {
    id: 'vol-01',
    code: 'VOL-01',
    title: 'THE 24-CUBE CARGO CRATE',
    category: 'volume',
    bloomLevel: 'understand',
    difficulty: 1,
    mechanic: 'cubes',
    prompt: 'Construct a 3D rectangular cuboid with a volume of exactly 24 cubic units.',
    missionBrief: 'Pack the freight container using exactly 24 unit cubes.',
    initialBuild: { length: 2, width: 2, height: 2 },
    target: {
      volume: 24,
      description: 'Volume = 24 cubic units (Length × Width × Height = 24)',
    },
    allowedSolutionsDescription: '4×3×2, 3×4×2, 6×2×2, 2×6×2, 4×2×3, 6×4×1, 12×2×1, 8×3×1.',
    timeLimit: 50,
    basePoints: 110,
    explanationFormula: 'Volume = Length × Width × Height = 24 m³',
    learningTip: 'Layer method: Base of 4×3 = 12 cubes, stacked 2 layers high = 24 cubes.',
  },
  {
    id: 'vol-02',
    code: 'VOL-02',
    title: 'THE 36-CUBE MODULAR VAULT',
    category: 'volume',
    bloomLevel: 'understand',
    difficulty: 2,
    mechanic: 'cubes',
    prompt: 'Stack unit cubes to build a solid structure with a volume of 36 cubic units.',
    missionBrief: 'The bank vault requires 36 cubic meters of solid reinforced masonry.',
    initialBuild: { length: 3, width: 2, height: 2 },
    target: {
      volume: 36,
      description: 'Volume = 36 cubic units',
    },
    allowedSolutionsDescription: '4×3×3, 3×4×3, 6×3×2, 3×6×2, 6×2×3, 9×2×2, 6×6×1, 18×2×1.',
    timeLimit: 50,
    basePoints: 115,
    explanationFormula: 'Volume = Length × Width × Height = 36 m³',
    learningTip: 'Base area 4×3 = 12. Multiply by height 3 = 36 cubic units.',
  },
  {
    id: 'vol-03',
    code: 'VOL-03',
    title: 'THE 48-CUBE POWER TOWER',
    category: 'volume',
    bloomLevel: 'apply',
    difficulty: 2,
    mechanic: 'cubes',
    prompt: 'Build a cuboid structure with a volume of 48 cubic units.',
    missionBrief: 'The generator tower must enclose 48 m³ of machinery space.',
    initialBuild: { length: 4, width: 2, height: 2 },
    target: {
      volume: 48,
      description: 'Volume = 48 cubic units',
    },
    allowedSolutionsDescription: '4×4×3, 6×4×2, 4×6×2, 6×2×4, 8×3×2, 3×8×2, 12×2×2, 8×2×3.',
    timeLimit: 50,
    basePoints: 120,
    explanationFormula: 'Volume = Length × Width × Height = 48 m³',
    learningTip: 'Try 4 × 4 base (16) with 3 layers of height = 48 m³.',
  },
  {
    id: 'vol-04',
    code: 'VOL-04',
    title: 'THE 60-CUBE COOLING TOWER',
    category: 'volume',
    bloomLevel: 'apply',
    difficulty: 2,
    mechanic: 'cubes',
    prompt: 'Construct a 3D block with an exact volume of 60 cubic units.',
    missionBrief: 'Stack unit cubes to fill exactly 60 cubic meters.',
    initialBuild: { length: 3, width: 3, height: 3 },
    target: {
      volume: 60,
      description: 'Volume = 60 cubic units',
    },
    allowedSolutionsDescription: '5×4×3, 4×5×3, 6×5×2, 5×6×2, 6×2×5, 10×3×2, 10×2×3, 15×2×2.',
    timeLimit: 55,
    basePoints: 120,
    explanationFormula: 'Volume = Length × Width × Height = 60 m³',
    learningTip: '5 × 4 base = 20. Stacking 3 layers gives 20 × 3 = 60 m³.',
  },
  {
    id: 'vol-05',
    code: 'VOL-05',
    title: 'MISSING HEIGHT: BASE 6m × 4m',
    category: 'volume',
    bloomLevel: 'apply',
    difficulty: 3,
    mechanic: 'blueprint',
    prompt: 'The floor base is 6m × 4m (24 m²). Build the structure to have a Volume of 72 m³.',
    missionBrief: 'Determine how many vertical floors are needed to reach 72 m³.',
    initialBuild: { length: 6, width: 4, height: 1 },
    target: {
      length: 6,
      width: 4,
      volume: 72,
      description: 'Base = 6m × 4m, Volume = 72 m³ (Height = 3m)',
    },
    allowedSolutionsDescription: 'Length = 6m, Width = 4m, Height = 3m.',
    timeLimit: 50,
    basePoints: 125,
    explanationFormula: 'Height = Volume ÷ Base Area = 72 ÷ (6 × 4) = 72 ÷ 24 = 3 m',
    learningTip: 'Base Area = 24. 72 ÷ 24 = 3 layers of height.',
  },
  {
    id: 'vol-06',
    code: 'VOL-06',
    title: 'MISSING LENGTH: WIDTH 3m, HEIGHT 4m',
    category: 'volume',
    bloomLevel: 'apply',
    difficulty: 3,
    mechanic: 'blueprint',
    prompt: 'A building has Width = 3m and Height = 4m. Build Length so the Volume is 84 m³.',
    missionBrief: 'Solve for the missing length to achieve 84 m³.',
    initialBuild: { length: 4, width: 3, height: 4 },
    target: {
      width: 3,
      height: 4,
      volume: 84,
      description: 'Width = 3m, Height = 4m, Volume = 84 m³ (Length = 7m)',
    },
    allowedSolutionsDescription: 'Length = 7m, Width = 3m, Height = 4m.',
    timeLimit: 50,
    basePoints: 125,
    explanationFormula: 'Length = Volume ÷ (Width × Height) = 84 ÷ (3 × 4) = 84 ÷ 12 = 7 m',
    learningTip: '3 × 4 = 12. 84 ÷ 12 = 7 meters length.',
  },
  {
    id: 'vol-07',
    code: 'VOL-07',
    title: 'ADD LAYERS: EXPAND FROM 36 TO 72 m³',
    category: 'volume',
    bloomLevel: 'analyze',
    difficulty: 3,
    mechanic: 'modify',
    prompt: 'The current building is 6m × 3m × 2m (36 m³). Double its volume to 72 m³ by adding height.',
    missionBrief: 'Add vertical stories to double the building capacity.',
    initialBuild: { length: 6, width: 3, height: 2 },
    target: {
      volume: 72,
      description: 'Volume = 72 m³ (Doubled from 36 m³)',
    },
    allowedSolutionsDescription: '6×3×4 (72 m³), 6×4×3, 8×3×3, 9×4×2.',
    timeLimit: 55,
    basePoints: 130,
    explanationFormula: 'New Volume = 36 × 2 = 72 m³ (Height increases from 2m to 4m)',
    learningTip: 'Doubling the height from 2 to 4 doubles the volume: 18 × 4 = 72.',
  },
  {
    id: 'vol-08',
    code: 'VOL-08',
    title: 'REDUCE VOLUME: SHAVE 24 m³',
    category: 'volume',
    bloomLevel: 'analyze',
    difficulty: 3,
    mechanic: 'modify',
    prompt: 'The building is 4m × 4m × 4m (64 m³). Reduce its volume by 24 m³ to reach exactly 40 m³.',
    missionBrief: 'Deconstruct surplus cubic meters to hit the 40 m³ quota.',
    initialBuild: { length: 4, width: 4, height: 4 },
    target: {
      volume: 40,
      description: 'Volume = 40 m³ (64 - 24 = 40 m³)',
    },
    allowedSolutionsDescription: '5×4×2, 4×5×2, 10×2×2, 4×2×5, 8×5×1, 5×8×1.',
    timeLimit: 55,
    basePoints: 130,
    explanationFormula: 'New Volume = 64 - 24 = 40 m³',
    learningTip: '64 - 24 = 40. Build 5 × 4 × 2 = 40 m³.',
  },
  {
    id: 'vol-09',
    code: 'VOL-09',
    title: 'TARGET VOLUME RANGE: 80 TO 100 m³',
    category: 'volume',
    bloomLevel: 'evaluate',
    difficulty: 4,
    mechanic: 'target-build',
    prompt: 'Construct a multi-story warehouse with a volume between 80 m³ and 100 m³.',
    missionBrief: 'City regulations permit any building volume from 80 to 100 cubic meters.',
    initialBuild: { length: 4, width: 3, height: 3 },
    target: {
      minVolume: 80,
      maxVolume: 100,
      description: '80 m³ ≤ Volume ≤ 100 m³',
    },
    allowedSolutionsDescription: '5×4×4 (80), 6×4×4 (96), 5×5×4 (100), 6×5×3 (90), 8×4×3 (96), 7×4×3 (84).',
    timeLimit: 60,
    basePoints: 135,
    explanationFormula: '80 ≤ (Length × Width × Height) ≤ 100',
    learningTip: '6 × 5 × 3 = 90 m³ or 8 × 4 × 3 = 96 m³ both sit comfortably in the range!',
  },
  {
    id: 'vol-10',
    code: 'VOL-10',
    title: 'PERFECT CUBE CHALLENGE: 64 m³',
    category: 'volume',
    bloomLevel: 'create',
    difficulty: 4,
    mechanic: 'cubes',
    prompt: 'Build an equilateral 3D cube where Length = Width = Height, with Volume = 64 m³.',
    missionBrief: 'Construct a perfect geometric cube container.',
    initialBuild: { length: 2, width: 2, height: 2 },
    target: {
      volume: 64,
      length: 4,
      width: 4,
      height: 4,
      description: 'Cube: 4m × 4m × 4m = 64 m³',
    },
    allowedSolutionsDescription: 'Length = 4m, Width = 4m, Height = 4m.',
    timeLimit: 50,
    basePoints: 135,
    explanationFormula: 'Cube Volume = s³ = 4 × 4 × 4 = 64 m³',
    learningTip: 'Find the cube root of 64: 4 × 4 × 4 = 64.',
  },
  // Auto-generated varied Volume Challenges (11 to 35)
  ...Array.from({ length: 25 }).map((_, i) => {
    const idx = 11 + i;
    const l = 3 + (i % 5);
    const w = 3 + ((i * 2) % 4);
    const h = 2 + (i % 4);
    const targetVol = l * w * h;
    return {
      id: `vol-${idx}`,
      code: `VOL-${idx}`,
      title: `STORAGE SILO #${idx}`,
      category: 'volume' as const,
      bloomLevel: (i % 3 === 0 ? 'apply' : i % 3 === 1 ? 'analyze' : 'evaluate') as BloomLevel,
      difficulty: (2 + (i % 4)) as 1 | 2 | 3 | 4 | 5,
      mechanic: 'cubes' as const,
      prompt: `Construct a 3D structural enclosure with an exact capacity of ${targetVol} cubic meters.`,
      missionBrief: `Architectural mandate: Construct a 3D volume of precisely ${targetVol} m³.`,
      initialBuild: { length: 2, width: 2, height: 2 },
      target: {
        volume: targetVol,
        description: `Volume = ${targetVol} m³`,
      },
      allowedSolutionsDescription: `Any dimensions where L × W × H = ${targetVol} (e.g. ${l}×${w}×${h}).`,
      timeLimit: 50 + (i % 4) * 5,
      basePoints: 115 + i,
      explanationFormula: `Length × Width × Height = ${targetVol} m³`,
      learningTip: `Multiply your base (${l} × ${w} = ${l*w}) by height ${h} = ${targetVol} m³.`,
    };
  }),

  // ==========================================================
  // SECTION 4: MIXED & MEGA BUILD CHALLENGES (10 CHALLENGES)
  // ==========================================================
  {
    id: 'mega-01',
    code: 'MEGA-01',
    title: 'THE DUAL-CONSTRAINT SKYSCRAPER',
    category: 'mixed',
    bloomLevel: 'create',
    difficulty: 5,
    mechanic: 'mega-build',
    prompt: 'Construct a high-rise with Floor Area = 48 m² AND Total Volume = 144 m³.',
    missionBrief: 'Satisfy both footprint and volume specs simultaneously.',
    initialBuild: { length: 6, width: 4, height: 2 },
    target: {
      area: 48,
      volume: 144,
      height: 3,
      description: 'Floor Area = 48 m² and Volume = 144 m³ (Height = 3m)',
    },
    allowedSolutionsDescription: '8×6×3, 6×8×3, 12×4×3, 4×12×3.',
    timeLimit: 75,
    basePoints: 160,
    explanationFormula: 'Floor Area = 48 m², Height = 144 ÷ 48 = 3m. Volume = 48 × 3 = 144 m³.',
    learningTip: 'First set your length and width to make Area 48 (e.g. 8×6), then set Height to 3.',
  },
  {
    id: 'mega-02',
    code: 'MEGA-02',
    title: 'THE LOGISTICS TERMINAL',
    category: 'mixed',
    bloomLevel: 'create',
    difficulty: 5,
    mechanic: 'mega-build',
    prompt: 'Build a facility with Floor Area between 45–55 m² AND Volume between 180–220 m³.',
    missionBrief: 'Grand project: Coordinate a major cargo distribution center within dual tolerances.',
    initialBuild: { length: 5, width: 5, height: 3 },
    target: {
      minArea: 45,
      maxArea: 55,
      minVolume: 180,
      maxVolume: 220,
      description: '45 ≤ Area ≤ 55 m² AND 180 ≤ Volume ≤ 220 m³',
    },
    allowedSolutionsDescription: '10×5×4 (Area 50, Vol 200), 7×7×4 (Area 49, Vol 196), 6×8×4 (Area 48, Vol 192).',
    timeLimit: 80,
    basePoints: 170,
    explanationFormula: 'Area = 10 × 5 = 50 m² | Volume = 50 × 4 = 200 m³',
    learningTip: 'Build 10 × 5 (Area 50) with 4 stories (Volume 200 m³) for a perfect score!',
  },
  {
    id: 'mega-03',
    code: 'MEGA-03',
    title: 'THE CIVIC STADIUM ARENA',
    category: 'mixed',
    bloomLevel: 'create',
    difficulty: 5,
    mechanic: 'mega-build',
    prompt: 'Build a stadium pavilion with Floor Area = 60 m² AND Volume = 240 m³.',
    missionBrief: 'Construct the civic indoor arena meeting both structural constraints.',
    initialBuild: { length: 6, width: 6, height: 2 },
    target: {
      area: 60,
      volume: 240,
      height: 4,
      description: 'Floor Area = 60 m² and Volume = 240 m³ (Height = 4m)',
    },
    allowedSolutionsDescription: '10×6×4, 6×10×4, 12×5×4, 5×12×4.',
    timeLimit: 80,
    basePoints: 175,
    explanationFormula: 'Floor Area = 10 × 6 = 60 m² | Volume = 60 × 4 = 240 m³',
    learningTip: 'Set base to 10 × 6 (Area 60), then raise height to 4 (Volume 240).',
  },
  {
    id: 'mega-04',
    code: 'MEGA-04',
    title: 'THE ENERGY REACTOR ENCLOSURE',
    category: 'mixed',
    bloomLevel: 'create',
    difficulty: 5,
    mechanic: 'mega-build',
    prompt: 'Construct a reactor housing with Floor Area = 36 m² and Volume = 216 m³ (Cube s=6).',
    missionBrief: 'Build the containment block to exact specifications.',
    initialBuild: { length: 4, width: 4, height: 4 },
    target: {
      area: 36,
      volume: 216,
      height: 6,
      description: 'Floor Area = 36 m² (6×6) and Height = 6m (Volume = 216 m³)',
    },
    allowedSolutionsDescription: '6×6×6 (Floor 36, Vol 216), 9×4×6 (Floor 36, Vol 216).',
    timeLimit: 85,
    basePoints: 180,
    explanationFormula: 'Floor Area = 6 × 6 = 36 m² | Volume = 36 × 6 = 216 m³',
    learningTip: 'Base 6 × 6 = 36. Stack 6 stories high = 216 m³.',
  },
  {
    id: 'mega-05',
    code: 'MEGA-05',
    title: 'THE AEROSPACE HANGAR GRAND PRIX',
    category: 'mixed',
    bloomLevel: 'create',
    difficulty: 5,
    mechanic: 'mega-build',
    prompt: 'Build a double-span hangar with Floor Area between 64–72 m² AND Height ≥ 4m, Volume ≤ 300 m³.',
    missionBrief: 'Finals challenge: Maximum floor span with bounded vertical clearance.',
    initialBuild: { length: 8, width: 4, height: 3 },
    target: {
      minArea: 64,
      maxArea: 72,
      minVolume: 256,
      maxVolume: 300,
      description: '64 ≤ Area ≤ 72 m² AND Height ≥ 4m AND Volume ≤ 300 m³',
    },
    allowedSolutionsDescription: '8×8×4 (Area 64, Vol 256), 9×8×4 (Area 72, Vol 288), 10×7×4 (Area 70, Vol 280).',
    timeLimit: 90,
    basePoints: 200,
    explanationFormula: 'Floor Area = 8 × 8 = 64 m² | Height = 4m | Volume = 256 m³',
    learningTip: '8 × 8 base gives Area 64. 4m height gives Volume 256. All rules satisfied!',
  },
  // Additional mixed challenges (6 to 10)
  ...Array.from({ length: 5 }).map((_, i) => {
    const idx = 6 + i;
    const l = 6 + i;
    const w = 5 + (i % 3);
    const h = 3 + (i % 3);
    const area = l * w;
    const vol = area * h;
    return {
      id: `mega-${idx}`,
      code: `MEGA-${idx}`,
      title: `CHAMPIONSHIP MEGA BUILD #${idx}`,
      category: 'mixed' as const,
      bloomLevel: 'create' as BloomLevel,
      difficulty: 5 as const,
      mechanic: 'mega-build' as const,
      prompt: `Construct a grand structure with Floor Area = ${area} m² AND Volume = ${vol} m³.`,
      missionBrief: `Architectural Grand Prix: Build the structure to satisfy Area ${area} m² and Volume ${vol} m³.`,
      initialBuild: { length: 4, width: 4, height: 2 },
      target: {
        area,
        volume: vol,
        height: h,
        description: `Area = ${area} m² and Volume = ${vol} m³ (Height = ${h}m)`,
      },
      allowedSolutionsDescription: `Any dimensions where L × W = ${area} and Height = ${h} (such as ${l}×${w}×${h}).`,
      timeLimit: 80 + i * 2,
      basePoints: 175 + i * 5,
      explanationFormula: `Floor Area = ${l} × ${w} = ${area} m² | Volume = ${area} × ${h} = ${vol} m³`,
      learningTip: `Build the base to reach Area ${area}, then set height to ${h} for Volume ${vol}.`,
    };
  }),
];

// ============================================================
// MATHEMATICAL VALIDATOR FUNCTION (Accepts ANY valid solution)
// ============================================================
export function validateChallengeSolution(
  challenge: BlueprintChallenge,
  build: TeamBuild
): {
  isValid: boolean;
  isCorrect: boolean;
  measuredLength: number;
  measuredWidth: number;
  measuredHeight: number;
  measuredArea: number;
  measuredVolume: number;
  statusMessage: string;
  diffMessage: string;
  formula: string;
} {
  const { length, width, height } = build;
  const measuredArea = length * width;
  const measuredVolume = length * width * height;
  const target = challenge.target;

  let isCorrect = true;
  let statusMessage = 'BUILD APPROVED';
  let diffMessage = 'Target satisfied perfectly!';
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
      statusMessage = 'OUT OF AREA TOLERANCE';
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
      statusMessage = 'OUT OF VOLUME TOLERANCE';
      diffMessage = measuredVolume < target.minVolume
        ? `Below minimum (${target.minVolume} m³)`
        : `Above maximum (${target.maxVolume} m³)`;
    }
  }

  // 5. Fixed Dimension Constraints (if required by blueprint)
  if (target.length !== undefined && length !== target.length) {
    isCorrect = false;
    statusMessage = 'LENGTH SPEC MISMATCH';
    diffMessage = `Blueprint requires Length = ${target.length}m (Currently: ${length}m)`;
  }
  if (target.width !== undefined && width !== target.width) {
    isCorrect = false;
    statusMessage = 'WIDTH SPEC MISMATCH';
    diffMessage = `Blueprint requires Width = ${target.width}m (Currently: ${width}m)`;
  }
  if (target.height !== undefined && height !== target.height) {
    isCorrect = false;
    statusMessage = 'HEIGHT SPEC MISMATCH';
    diffMessage = `Blueprint requires Height = ${target.height}m (Currently: ${height}m)`;
  }

  // 6. Shape Proportions (e.g. L = 2W, L = 3W, Square)
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
 * Deterministically & non-repeating helper to select a challenge from the 100-challenge deck.
 */
export function getRandomChallenge(
  usedIds: string[] = [],
  targetDifficulty?: 1 | 2 | 3 | 4 | 5
): BlueprintChallenge {
  // Filter out already used challenges
  let pool = BLUEPRINT_CHALLENGES.filter((c) => !usedIds.includes(c.id));

  // If pool is exhausted, reset and reuse all
  if (pool.length === 0) {
    pool = [...BLUEPRINT_CHALLENGES];
  }

  // Filter by difficulty if provided
  if (targetDifficulty !== undefined) {
    const diffPool = pool.filter((c) => c.difficulty === targetDifficulty);
    if (diffPool.length > 0) {
      pool = diffPool;
    }
  }

  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}

