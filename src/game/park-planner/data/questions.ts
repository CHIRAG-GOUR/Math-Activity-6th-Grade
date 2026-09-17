// ============================================================
// PARK PLANNER — Grade 6 Math Questions Dataset
// Comprehensive pool covering Plotting, Translation, Reflection, Rotation & Polygons
// ============================================================

import { ParkQuestion, Coordinate2D } from '../types';

export const PARK_QUESTIONS_POOL: ParkQuestion[] = [
  // ------------------------------------------------------------
  // 1. PLOTTING & INITIAL INSTALLATION (Quadrant I, II, III, IV, Axes, Origin)
  // ------------------------------------------------------------
  {
    id: 'plot_fountain_q2',
    category: 'plot_point',
    roundNumber: 1,
    scenario: 'The landscape architect wants a tranquil marble fountain in the Botanical Gardens (Quadrant II).',
    prompt: 'Plot the coordinates (-2, 4) on the grid to install the Central Tiered Fountain.',
    objectType: 'fountain',
    objectName: 'Tiered Marble Fountain',
    targetQuadrant: 'QII',
    targetPoint: { x: -2, y: 4 },
    correctAnswer: { x: -2, y: 4 },
    options: ['(-2, 4)', '(2, 4)', '(-4, 2)', '(-2, -4)'],
    stepExplanation: [
      'Start at the Origin (0, 0).',
      'Move left 2 units on the X-axis to x = -2.',
      'Move up 4 units on the Y-axis to y = 4.',
      'Mark the point (-2, 4) in Quadrant II.',
    ],
    mode: 'point_plot',
    physicalOutcome: {
      objectType: 'fountain',
      description: 'Workers arrive with marble basins and install flowing water jets.',
      happinessGain: 15,
      quadrantEffect: 'QII',
    },
  },
  {
    id: 'plot_swings_q1',
    category: 'plot_point',
    roundNumber: 1,
    scenario: 'Children have requested a heavy-duty twin swing set in the Active Playground area.',
    prompt: 'Position the Swing Set at coordinate (3, 3) in Quadrant I.',
    objectType: 'swings',
    objectName: 'Dual Timber Swing Set',
    targetQuadrant: 'QI',
    targetPoint: { x: 3, y: 3 },
    correctAnswer: { x: 3, y: 3 },
    options: ['(3, 3)', '(-3, 3)', '(3, -3)', '(0, 3)'],
    stepExplanation: [
      'Quadrant I contains all coordinates where x > 0 and y > 0.',
      'Move right 3 units on the X-axis (x = 3).',
      'Move up 3 units on the Y-axis (y = 3).',
      'Lock in (3, 3) to construct the timber swing set.',
    ],
    mode: 'point_plot',
    physicalOutcome: {
      objectType: 'swings',
      description: 'Timber A-frames bolted down and swing seats attached.',
      happinessGain: 20,
      quadrantEffect: 'QI',
    },
  },
  {
    id: 'plot_basketball_q3',
    category: 'plot_point',
    roundNumber: 1,
    scenario: 'The sports recreation committee wants an all-weather basketball court in the Sports Complex.',
    prompt: 'Plot coordinate (-3, -3) to lay the foundation for the Basketball Court.',
    objectType: 'basketball_court',
    objectName: 'All-Weather Basketball Court',
    targetQuadrant: 'QIII',
    targetPoint: { x: -3, y: -3 },
    correctAnswer: { x: -3, y: -3 },
    options: ['(-3, -3)', '(3, -3)', '(-3, 3)', '(-3, 0)'],
    stepExplanation: [
      'Quadrant III is where both X and Y values are negative.',
      'Move left 3 units (x = -3).',
      'Move down 3 units (y = -3).',
      'Install the acrylic court surface at (-3, -3).',
    ],
    mode: 'point_plot',
    physicalOutcome: {
      objectType: 'basketball_court',
      description: 'Acrylic court laid and regulation hoops installed.',
      happinessGain: 20,
      quadrantEffect: 'QIII',
    },
  },
  {
    id: 'plot_picnic_q4',
    category: 'plot_point',
    roundNumber: 1,
    scenario: 'Families love dining outdoors in the shade. Place cedar picnic tables in the Picnic Grove.',
    prompt: 'Plot the coordinate (4, -2) in Quadrant IV to assemble the Picnic Tables.',
    objectType: 'picnic_table',
    objectName: 'Cedar Picnic Grove',
    targetQuadrant: 'QIV',
    targetPoint: { x: 4, y: -2 },
    correctAnswer: { x: 4, y: -2 },
    options: ['(4, -2)', '(-4, -2)', '(4, 2)', '(2, -4)'],
    stepExplanation: [
      'In Quadrant IV, X is positive and Y is negative.',
      'Move right 4 units on the X-axis (x = 4).',
      'Move down 2 units on the Y-axis (y = -2).',
      'Place the picnic set at (4, -2).',
    ],
    mode: 'point_plot',
    physicalOutcome: {
      objectType: 'picnic_table',
      description: 'Handcrafted cedar picnic tables and bench sets assembled.',
      happinessGain: 15,
      quadrantEffect: 'QIV',
    },
  },
  {
    id: 'plot_origin_plaza',
    category: 'plot_point',
    roundNumber: 1,
    scenario: 'The park needs a majestic central hub where the East-West and North-South promenades meet.',
    prompt: 'Plot the Origin (0, 0) to establish the Central Park Plaza.',
    objectType: 'sculpture',
    objectName: 'Central Plaza Bronze Sundial',
    targetQuadrant: 'origin',
    targetPoint: { x: 0, y: 0 },
    correctAnswer: { x: 0, y: 0 },
    options: ['(0, 0)', '(1, 1)', '(0, 1)', '(1, 0)'],
    stepExplanation: [
      'The Origin is the exact intersection of the X-axis and Y-axis.',
      'Its coordinate is uniquely (0, 0).',
      'Establish the bronze sundial and circular plaza pavers.',
    ],
    mode: 'point_plot',
    physicalOutcome: {
      objectType: 'sculpture',
      description: 'Circular cobblestone plaza and bronze sundial installed.',
      happinessGain: 25,
      quadrantEffect: 'origin',
    },
  },

  // ------------------------------------------------------------
  // 2. TRANSLATIONS (x ± dx, y ± dy)
  // ------------------------------------------------------------
  {
    id: 'trans_slide_south',
    category: 'translate',
    roundNumber: 2,
    scenario: 'The giant tube slide currently at (2, 4) is too close to the boundary trees.',
    prompt: 'Translate the Slide 4 units South (downward). Where is its new coordinate P\'?',
    objectType: 'slide',
    objectName: 'Spiral Adventure Slide',
    startPoint: { x: 2, y: 4 },
    targetPoint: { x: 2, y: 0 },
    translationDelta: { dx: 0, dy: -4, directionLabel: '4 units South' },
    correctAnswer: { x: 2, y: 0 },
    options: ['(2, 0)', '(2, 8)', '(-2, 4)', '(6, 4)'],
    stepExplanation: [
      'Original position: P(2, 4).',
      'Moving South means decreasing Y by 4: y\' = 4 - 4 = 0.',
      'X-coordinate remains unchanged: x\' = 2.',
      'New coordinate: P\'(2, 0) on the X-axis promenade.',
    ],
    mode: 'translate',
    physicalOutcome: {
      objectType: 'slide',
      description: 'Workers slide the tower southwards along the paved track.',
      happinessGain: 18,
      quadrantEffect: 'axis_x',
    },
  },
  {
    id: 'trans_flower_east',
    category: 'translate',
    roundNumber: 2,
    scenario: 'The tulip flower bed at (-4, 2) needs more morning sunlight.',
    prompt: 'Translate the Tulip Bed 3 units East (right). What is the new coordinate?',
    objectType: 'flower_bed',
    objectName: 'Radiant Tulip Bed',
    startPoint: { x: -4, y: 2 },
    targetPoint: { x: -1, y: 2 },
    translationDelta: { dx: 3, dy: 0, directionLabel: '3 units East' },
    correctAnswer: { x: -1, y: 2 },
    options: ['(-1, 2)', '(-7, 2)', '(-4, 5)', '(-4, -1)'],
    stepExplanation: [
      'Original position: (-4, 2).',
      'Moving East means adding 3 to the X-coordinate: x\' = -4 + 3 = -1.',
      'Y-coordinate remains unchanged: y\' = 2.',
      'New location: (-1, 2) in Quadrant II.',
    ],
    mode: 'translate',
    physicalOutcome: {
      objectType: 'flower_bed',
      description: 'Landscaping cart transfers soil and blooming tulips eastwards.',
      happinessGain: 15,
      quadrantEffect: 'QII',
    },
  },
  {
    id: 'trans_bench_north_east',
    category: 'translate',
    roundNumber: 2,
    scenario: 'Move the park bench at (1, -4) closer to the fountain and shady trees.',
    prompt: 'Translate the Bench 2 units East and 5 units North. What is its new location?',
    objectType: 'park_bench',
    objectName: 'Cast Iron Park Bench',
    startPoint: { x: 1, y: -4 },
    targetPoint: { x: 3, y: 1 },
    translationDelta: { dx: 2, dy: 5, directionLabel: '2 East, 5 North' },
    correctAnswer: { x: 3, y: 1 },
    options: ['(3, 1)', '(-1, 1)', '(3, -9)', '(1, 1)'],
    stepExplanation: [
      'Original coordinate: (1, -4).',
      'New X = 1 + 2 = 3.',
      'New Y = -4 + 5 = 1.',
      'The bench transitions from Quadrant IV to Quadrant I at (3, 1).',
    ],
    mode: 'translate',
    physicalOutcome: {
      objectType: 'park_bench',
      description: 'Park attendants carry and bolt the bench into sunny Quadrant I.',
      happinessGain: 16,
      quadrantEffect: 'QI',
    },
  },

  // ------------------------------------------------------------
  // 3. REFLECTIONS (Across X-Axis, Y-Axis, and Origin)
  // ------------------------------------------------------------
  {
    id: 'reflect_garden_x_axis',
    category: 'reflect_x',
    roundNumber: 3,
    scenario: 'To create symmetrical landscaping, reflect the Rose Garden across the X-axis.',
    prompt: 'The Rose Garden is at A(-2, 3). Reflect it across the X-axis to find A\'.',
    objectType: 'rose_garden',
    objectName: 'Symmetrical Rose Garden',
    startPoint: { x: -2, y: 3 },
    targetPoint: { x: -2, y: -3 },
    reflectionAxis: 'x-axis',
    correctAnswer: { x: -2, y: -3 },
    options: ['(-2, -3)', '(2, 3)', '(2, -3)', '(-3, 2)'],
    stepExplanation: [
      'Reflecting across the X-axis keeps X the same and changes the sign of Y: (x, y) -> (x, -y).',
      'Start point: A(-2, 3).',
      'Reflected point: A\'(-2, -3).',
      'The garden moves from Quadrant II to Quadrant III.',
    ],
    mode: 'reflect',
    physicalOutcome: {
      objectType: 'rose_garden',
      description: 'Gardeners mirror the ornate rose hedge across the central promenade.',
      happinessGain: 22,
      quadrantEffect: 'QIII',
    },
  },
  {
    id: 'reflect_playground_y_axis',
    category: 'reflect_y',
    roundNumber: 3,
    scenario: 'The park director wants a matching climbing frame on the West side of the park.',
    prompt: 'The Climbing Frame is at (4, 2) in Quadrant I. Reflect it across the Y-axis.',
    objectType: 'climbing_frame',
    objectName: 'Geodesic Climbing Dome',
    startPoint: { x: 4, y: 2 },
    targetPoint: { x: -4, y: 2 },
    reflectionAxis: 'y-axis',
    correctAnswer: { x: -4, y: 2 },
    options: ['(-4, 2)', '(4, -2)', '(-4, -2)', '(2, 4)'],
    stepExplanation: [
      'Reflecting across the Y-axis changes the sign of X and keeps Y the same: (x, y) -> (-x, y).',
      'Start point: (4, 2).',
      'Reflected point: (-4, 2).',
      'The climbing frame mirrors directly across into Quadrant II.',
    ],
    mode: 'reflect',
    physicalOutcome: {
      objectType: 'climbing_frame',
      description: 'Climbing dome mirrored to the opposite quadrant with soft safety turf.',
      happinessGain: 20,
      quadrantEffect: 'QII',
    },
  },
  {
    id: 'reflect_gazebo_origin',
    category: 'reflect_origin',
    roundNumber: 3,
    scenario: 'Construct a twin Victorian Gazebo reflected through the Origin (0,0).',
    prompt: 'The North-West Gazebo is at (-3, 3). Reflect it through the Origin (0,0).',
    objectType: 'gazebo',
    objectName: 'Victorian Octagonal Gazebo',
    startPoint: { x: -3, y: 3 },
    targetPoint: { x: 3, y: -3 },
    reflectionAxis: 'origin',
    correctAnswer: { x: 3, y: -3 },
    options: ['(3, -3)', '(-3, -3)', '(3, 3)', '(0, 0)'],
    stepExplanation: [
      'Reflecting through the Origin negates both coordinates: (x, y) -> (-x, -y).',
      'Start point: (-3, 3) in Quadrant II.',
      'Reflected point: (3, -3) in Quadrant IV.',
      'The gazebo appears diagonally across in the Picnic Grove.',
    ],
    mode: 'reflect',
    physicalOutcome: {
      objectType: 'gazebo',
      description: 'Carpenters erect an ornate octagonal gazebo with cedar shingles.',
      happinessGain: 25,
      quadrantEffect: 'QIV',
    },
  },

  // ------------------------------------------------------------
  // 4. ROTATIONS (90° CW, 90° CCW, 180° around Origin)
  // ------------------------------------------------------------
  {
    id: 'rotate_fitness_90_cw',
    category: 'rotate_90_cw',
    roundNumber: 4,
    scenario: 'Rotate the outdoor fitness gym 90° Clockwise around the Origin (0,0).',
    prompt: 'The Outdoor Gym is at (1, 4). Rotate it 90° Clockwise around (0,0).',
    objectType: 'fitness_station',
    objectName: 'Calisthenics Fitness Station',
    startPoint: { x: 1, y: 4 },
    targetPoint: { x: 4, y: -1 },
    rotationParams: { degrees: 90, direction: 'clockwise', center: { x: 0, y: 0 } },
    correctAnswer: { x: 4, y: -1 },
    options: ['(4, -1)', '(-4, 1)', '(-1, -4)', '(1, -4)'],
    stepExplanation: [
      'Rule for 90° clockwise rotation around origin: (x, y) -> (y, -x).',
      'Start point: (1, 4).',
      'New X = original Y = 4.',
      'New Y = -original X = -1.',
      'New position: (4, -1) in Quadrant IV.',
    ],
    mode: 'rotate',
    physicalOutcome: {
      objectType: 'fitness_station',
      description: 'Fitness bars and pull-up frames rotate around the central plaza.',
      happinessGain: 22,
      quadrantEffect: 'QIV',
    },
  },
  {
    id: 'rotate_soccer_180',
    category: 'rotate_180',
    roundNumber: 4,
    scenario: 'The soccer penalty goal area at (-4, -2) is rotating 180° around the Origin.',
    prompt: 'Rotate coordinate (-4, -2) by 180° around the Origin (0,0). What is the new point?',
    objectType: 'soccer_goal',
    objectName: 'Mini Soccer Training Pitch',
    startPoint: { x: -4, y: -2 },
    targetPoint: { x: 4, y: 2 },
    rotationParams: { degrees: 180, direction: 'clockwise', center: { x: 0, y: 0 } },
    correctAnswer: { x: 4, y: 2 },
    options: ['(4, 2)', '(-4, 2)', '(2, 4)', '(-2, -4)'],
    stepExplanation: [
      'A 180° rotation around the origin transforms (x, y) -> (-x, -y).',
      'Start point: (-4, -2) in Quadrant III.',
      'New X = -(-4) = 4.',
      'New Y = -(-2) = 2.',
      'New position: (4, 2) in Quadrant I.',
    ],
    mode: 'rotate',
    physicalOutcome: {
      objectType: 'soccer_goal',
      description: 'Soccer pitch markings and steel goal nets swing 180° across the park.',
      happinessGain: 24,
      quadrantEffect: 'QI',
    },
  },
  {
    id: 'rotate_pond_90_ccw',
    category: 'rotate_90_ccw',
    roundNumber: 4,
    scenario: 'Rotate the Koi Pond 90° Counter-Clockwise around the Origin (0,0).',
    prompt: 'The Koi Pond is at (-3, 2). Rotate it 90° Counter-Clockwise around (0,0).',
    objectType: 'pond',
    objectName: 'Lotus & Koi Fish Pond',
    startPoint: { x: -3, y: 2 },
    targetPoint: { x: -2, y: -3 },
    rotationParams: { degrees: 90, direction: 'counterclockwise', center: { x: 0, y: 0 } },
    correctAnswer: { x: -2, y: -3 },
    options: ['(-2, -3)', '(2, 3)', '(3, -2)', '(-3, -2)'],
    stepExplanation: [
      'Rule for 90° counter-clockwise rotation around origin: (x, y) -> (-y, x).',
      'Start point: (-3, 2).',
      'New X = -2.',
      'New Y = -3.',
      'New position: (-2, -3) in Quadrant III.',
    ],
    mode: 'rotate',
    physicalOutcome: {
      objectType: 'pond',
      description: 'Landscaping crew excavates pond basin with water lilies and stone rim.',
      happinessGain: 26,
      quadrantEffect: 'QIII',
    },
  },

  // ------------------------------------------------------------
  // 5. MULTI-POINT POLYGONS & ADVANCED BOUNDARIES
  // ------------------------------------------------------------
  {
    id: 'poly_playground_zone',
    category: 'polygon_boundary',
    roundNumber: 5,
    scenario: 'Define the rectangular safety boundary for the entire Active Playground in Quadrant I.',
    prompt: 'Plot the 4 boundary vertices: A(1, 1), B(4, 1), C(4, 4), and D(1, 4).',
    objectType: 'sandbox',
    objectName: 'Enclosed Safety Playground Zone',
    targetQuadrant: 'QI',
    targetPoints: [
      { x: 1, y: 1 },
      { x: 4, y: 1 },
      { x: 4, y: 4 },
      { x: 1, y: 4 },
    ],
    correctAnswer: [
      { x: 1, y: 1 },
      { x: 4, y: 1 },
      { x: 4, y: 4 },
      { x: 1, y: 4 },
    ],
    options: [
      'A(1,1), B(4,1), C(4,4), D(1,4)',
      'A(0,0), B(3,0), C(3,3), D(0,3)',
      'A(-1,1), B(-4,1), C(-4,4), D(-1,4)',
      'A(1,-1), B(4,-1), C(4,-4), D(1,-4)',
    ],
    stepExplanation: [
      'Plot A at (1, 1).',
      'Plot B at (4, 1) - horizontal base length = 3 units.',
      'Plot C at (4, 4) - vertical height = 3 units.',
      'Plot D at (1, 4) - completing the 3x3 square zone.',
    ],
    mode: 'polygon',
    physicalOutcome: {
      objectType: 'sandbox',
      description: 'Perimeter fencing, rubberized safety flooring, and seesaws installed.',
      happinessGain: 30,
      quadrantEffect: 'QI',
    },
  },
  {
    id: 'path_nature_trail',
    category: 'path_design',
    roundNumber: 5,
    scenario: 'Pave a scenic pedestrian trail connecting Quadrant III to Quadrant I.',
    prompt: 'Plot the trail waypoints: A(-4, -2), B(-1, 0), C(2, 1), D(4, 4).',
    objectType: 'walking_path',
    objectName: 'Cross-Park Scenic Promenade',
    targetPoints: [
      { x: -4, y: -2 },
      { x: -1, y: 0 },
      { x: 2, y: 1 },
      { x: 4, y: 4 },
    ],
    correctAnswer: [
      { x: -4, y: -2 },
      { x: -1, y: 0 },
      { x: 2, y: 1 },
      { x: 4, y: 4 },
    ],
    options: [
      '(-4,-2) -> (-1,0) -> (2,1) -> (4,4)',
      '(-4,2) -> (-1,0) -> (2,-1) -> (4,-4)',
      '(0,0) -> (1,1) -> (2,2) -> (3,3)',
      '(-5,-5) -> (-3,-3) -> (0,0) -> (3,3)',
    ],
    stepExplanation: [
      'A(-4, -2) starts in the Sports Complex (QIII).',
      'B(-1, 0) crosses the X-axis promenade.',
      'C(2, 1) enters Quadrant I near the flower beds.',
      'D(4, 4) reaches the park observation summit.',
    ],
    mode: 'path',
    physicalOutcome: {
      objectType: 'walking_path',
      description: 'Steamroller and paving crew lay smooth granite flagstones along the trail.',
      happinessGain: 28,
      quadrantEffect: 'QI',
    },
  },
];

/**
 * Generates a randomized match question set for 5, 10, or 15 rounds
 */
export function generateParkQuestions(count: 5 | 10 | 15): ParkQuestion[] {
  // Shuffle categories to provide a diverse progression:
  // Round 1: Plotting
  // Round 2: Translation
  // Round 3: Reflection
  // Round 4: Rotation
  // Round 5: Multi-point Polygon or Path Design
  const pool = [...PARK_QUESTIONS_POOL];
  
  // Sort or pick for standard progression
  const q1 = pool.filter(q => q.category === 'plot_point');
  const q2 = pool.filter(q => q.category === 'translate');
  const q3 = pool.filter(q => q.category.startsWith('reflect'));
  const q4 = pool.filter(q => q.category.startsWith('rotate'));
  const q5 = pool.filter(q => q.category === 'polygon_boundary' || q.category === 'path_design');

  const selected: ParkQuestion[] = [];
  
  // Ensure non-repeats
  const pickRandom = (arr: ParkQuestion[]) => arr[Math.floor(Math.random() * arr.length)];

  selected.push({ ...pickRandom(q1), roundNumber: 1 });
  selected.push({ ...pickRandom(q2), roundNumber: 2 });
  selected.push({ ...pickRandom(q3), roundNumber: 3 });
  selected.push({ ...pickRandom(q4), roundNumber: 4 });
  selected.push({ ...pickRandom(q5), roundNumber: 5 });

  if (count > 5) {
    // Add additional randomized questions from pool
    const remaining = pool.filter(q => !selected.some(s => s.id === q.id));
    for (let i = 6; i <= count; i++) {
      const q = remaining[(i - 6) % remaining.length] || pool[i % pool.length];
      selected.push({ ...q, id: `${q.id}_r${i}`, roundNumber: i });
    }
  }

  return selected.slice(0, count);
}
