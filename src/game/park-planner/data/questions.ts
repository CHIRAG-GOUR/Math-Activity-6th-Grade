// ============================================================
// PARK PLANNER — Grade 6 Math Questions Dataset (150+ Easy Questions)
// Hand-solvable Cartesian Coordinate, Translation, Reflection & Rotation questions
// ============================================================

import { ParkQuestion, Coordinate2D, ParkObjectType, QuadrantId, TransformationType } from '../types';
import { formatCoord, translateCoord, reflectX, reflectY, reflectOrigin, rotateAroundOrigin } from '../engine/coordinateMath';

// Object templates for varied scenarios
const OBJECT_TEMPLATES: { type: ParkObjectType; name: string; defaultQuad: QuadrantId }[] = [
  { type: 'swings', name: 'Dual Timber Swing Set', defaultQuad: 'QI' },
  { type: 'slide', name: 'Spiral Adventure Slide', defaultQuad: 'QI' },
  { type: 'climbing_frame', name: 'Geodesic Climbing Dome', defaultQuad: 'QI' },
  { type: 'seesaw', name: 'Balanced Teeter-Totter', defaultQuad: 'QI' },
  { type: 'fountain', name: 'Tiered Marble Fountain', defaultQuad: 'QII' },
  { type: 'flower_bed', name: 'Radiant Tulip Bed', defaultQuad: 'QII' },
  { type: 'rose_garden', name: 'Symmetrical Rose Garden', defaultQuad: 'QII' },
  { type: 'gazebo', name: 'Victorian Octagonal Gazebo', defaultQuad: 'QII' },
  { type: 'pond', name: 'Lotus & Koi Fish Pond', defaultQuad: 'QII' },
  { type: 'basketball_court', name: 'All-Weather Basketball Court', defaultQuad: 'QIII' },
  { type: 'soccer_goal', name: 'Mini Soccer Training Pitch', defaultQuad: 'QIII' },
  { type: 'fitness_station', name: 'Calisthenics Fitness Station', defaultQuad: 'QIII' },
  { type: 'picnic_table', name: 'Cedar Picnic Tables', defaultQuad: 'QIV' },
  { type: 'park_bench', name: 'Cast Iron Park Bench', defaultQuad: 'QIV' },
  { type: 'tree_grove', name: 'Shady Oak Tree Grove', defaultQuad: 'QIV' },
  { type: 'sculpture', name: 'Central Plaza Bronze Sundial', defaultQuad: 'origin' },
];

function generateDistractors(correct: Coordinate2D): string[] {
  const distractors = new Set<string>();
  const correctStr = formatCoord(correct);
  distractors.add(correctStr);

  // Common Grade 6 distractor misconceptions
  const candidates: Coordinate2D[] = [
    { x: -correct.x, y: correct.y },    // flipped X
    { x: correct.x, y: -correct.y },    // flipped Y
    { x: -correct.x, y: -correct.y },  // flipped both
    { x: correct.y, y: correct.x },    // swapped X and Y
    { x: -correct.y, y: correct.x },   // swapped & flipped
    { x: correct.x + (correct.x >= 0 ? 1 : -1), y: correct.y },
    { x: correct.x, y: correct.y + (correct.y >= 0 ? 1 : -1) },
    { x: 0, y: correct.y },
    { x: correct.x, y: 0 },
  ];

  for (const c of candidates) {
    if (distractors.size >= 4) break;
    const s = formatCoord(c);
    if (s !== correctStr) {
      distractors.add(s);
    }
  }

  // Shuffle
  const arr = Array.from(distractors);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ------------------------------------------------------------
// BUILD 150+ DEDICATED QUESTIONS
// ------------------------------------------------------------
function build150Questions(): ParkQuestion[] {
  const list: ParkQuestion[] = [];
  let idCounter = 1;

  // 1. PLOTTING IN QUADRANT I (+x, +y) — 20 questions
  const q1Points: Coordinate2D[] = [
    { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 1, y: 3 }, { x: 1, y: 4 }, { x: 1, y: 5 },
    { x: 2, y: 1 }, { x: 2, y: 2 }, { x: 2, y: 3 }, { x: 2, y: 4 }, { x: 2, y: 5 },
    { x: 3, y: 1 }, { x: 3, y: 2 }, { x: 3, y: 3 }, { x: 3, y: 4 }, { x: 3, y: 5 },
    { x: 4, y: 1 }, { x: 4, y: 2 }, { x: 4, y: 3 }, { x: 4, y: 4 }, { x: 5, y: 2 },
  ];
  q1Points.forEach((pt) => {
    const tmpl = OBJECT_TEMPLATES[(idCounter) % 4]; // playground items
    list.push({
      id: `q_plot_q1_${idCounter++}`,
      category: 'plot_point',
      roundNumber: 1,
      scenario: `The park architect wants to install ${tmpl.name} in Quadrant I (Active Playground).`,
      prompt: `Plot the coordinate (${pt.x}, ${pt.y}) in Quadrant I to install the ${tmpl.name}.`,
      objectType: tmpl.type,
      objectName: tmpl.name,
      targetQuadrant: 'QI',
      targetPoint: pt,
      correctAnswer: pt,
      options: generateDistractors(pt),
      stepExplanation: [
        'Start at Origin (0,0).',
        `Move right ${pt.x} unit${pt.x > 1 ? 's' : ''} on the X-axis (x = ${pt.x}).`,
        `Move up ${pt.y} unit${pt.y > 1 ? 's' : ''} on the Y-axis (y = ${pt.y}).`,
        `Confirm point (${pt.x}, ${pt.y}) in Quadrant I (+, +).`,
      ],
      mode: 'point_plot',
      physicalOutcome: {
        objectType: tmpl.type,
        description: `Construction crew bolts the ${tmpl.name} into the sunny playground turf.`,
        happinessGain: 15,
        quadrantEffect: 'QI',
      },
    });
  });

  // 2. PLOTTING IN QUADRANT II (-x, +y) — 20 questions
  const q2Points: Coordinate2D[] = [
    { x: -1, y: 1 }, { x: -1, y: 2 }, { x: -1, y: 3 }, { x: -1, y: 4 }, { x: -1, y: 5 },
    { x: -2, y: 1 }, { x: -2, y: 2 }, { x: -2, y: 3 }, { x: -2, y: 4 }, { x: -2, y: 5 },
    { x: -3, y: 1 }, { x: -3, y: 2 }, { x: -3, y: 3 }, { x: -3, y: 4 }, { x: -3, y: 5 },
    { x: -4, y: 1 }, { x: -4, y: 2 }, { x: -4, y: 3 }, { x: -4, y: 4 }, { x: -5, y: 3 },
  ];
  q2Points.forEach((pt) => {
    const tmpl = OBJECT_TEMPLATES[4 + ((idCounter) % 5)]; // botanical items
    list.push({
      id: `q_plot_q2_${idCounter++}`,
      category: 'plot_point',
      roundNumber: 1,
      scenario: `The botanical designer wants to landscape a ${tmpl.name} in Quadrant II.`,
      prompt: `Plot the coordinate (${pt.x}, ${pt.y}) in Quadrant II to place the ${tmpl.name}.`,
      objectType: tmpl.type,
      objectName: tmpl.name,
      targetQuadrant: 'QII',
      targetPoint: pt,
      correctAnswer: pt,
      options: generateDistractors(pt),
      stepExplanation: [
        'Start at Origin (0,0).',
        `Move left ${Math.abs(pt.x)} units on the X-axis (x = ${pt.x}).`,
        `Move up ${pt.y} units on the Y-axis (y = ${pt.y}).`,
        `Confirm point (${pt.x}, ${pt.y}) in Quadrant II (-, +).`,
      ],
      mode: 'point_plot',
      physicalOutcome: {
        objectType: tmpl.type,
        description: `Landscape gardeners install the ${tmpl.name} with stone borders.`,
        happinessGain: 15,
        quadrantEffect: 'QII',
      },
    });
  });

  // 3. PLOTTING IN QUADRANT III (-x, -y) & QUADRANT IV (+x, -y) — 25 questions
  const q3q4Points: { pt: Coordinate2D; quad: QuadrantId }[] = [
    { pt: { x: -1, y: -2 }, quad: 'QIII' }, { pt: { x: -2, y: -2 }, quad: 'QIII' },
    { pt: { x: -3, y: -1 }, quad: 'QIII' }, { pt: { x: -3, y: -3 }, quad: 'QIII' },
    { pt: { x: -4, y: -2 }, quad: 'QIII' }, { pt: { x: -4, y: -4 }, quad: 'QIII' },
    { pt: { x: -2, y: -4 }, quad: 'QIII' }, { pt: { x: -5, y: -2 }, quad: 'QIII' },
    { pt: { x: -1, y: -5 }, quad: 'QIII' }, { pt: { x: -3, y: -4 }, quad: 'QIII' },
    { pt: { x: 1, y: -2 }, quad: 'QIV' }, { pt: { x: 2, y: -2 }, quad: 'QIV' },
    { pt: { x: 3, y: -1 }, quad: 'QIV' }, { pt: { x: 3, y: -3 }, quad: 'QIV' },
    { pt: { x: 4, y: -2 }, quad: 'QIV' }, { pt: { x: 4, y: -4 }, quad: 'QIV' },
    { pt: { x: 2, y: -4 }, quad: 'QIV' }, { pt: { x: 5, y: -2 }, quad: 'QIV' },
    { pt: { x: 1, y: -4 }, quad: 'QIV' }, { pt: { x: 4, y: -3 }, quad: 'QIV' },
    { pt: { x: 0, y: 0 }, quad: 'origin' }, { pt: { x: 3, y: 0 }, quad: 'axis_x' },
    { pt: { x: -4, y: 0 }, quad: 'axis_x' }, { pt: { x: 0, y: 4 }, quad: 'axis_y' },
    { pt: { x: 0, y: -3 }, quad: 'axis_y' },
  ];
  q3q4Points.forEach(({ pt, quad }) => {
    const tmpl = quad === 'QIII' ? OBJECT_TEMPLATES[9] : quad === 'QIV' ? OBJECT_TEMPLATES[12] : OBJECT_TEMPLATES[15];
    list.push({
      id: `q_plot_q3q4_${idCounter++}`,
      category: 'plot_point',
      roundNumber: 1,
      scenario: `Install the ${tmpl.name} at location (${pt.x}, ${pt.y}).`,
      prompt: `Plot the coordinate (${pt.x}, ${pt.y}) on the Cartesian plane.`,
      objectType: tmpl.type,
      objectName: tmpl.name,
      targetQuadrant: quad,
      targetPoint: pt,
      correctAnswer: pt,
      options: generateDistractors(pt),
      stepExplanation: [
        `Locate x = ${pt.x} horizontally on the X-axis.`,
        `Locate y = ${pt.y} vertically on the Y-axis.`,
        `Intersection marks (${pt.x}, ${pt.y}).`,
      ],
      mode: 'point_plot',
      physicalOutcome: {
        objectType: tmpl.type,
        description: `Structure assembled at (${pt.x}, ${pt.y}).`,
        happinessGain: 15,
        quadrantEffect: quad,
      },
    });
  });

  // 4. TRANSLATIONS (x ± a, y ± b) — 30 questions
  const translations = [
    { start: { x: 1, y: 2 }, dx: 2, dy: 0, dir: '2 units East (Right)' },
    { start: { x: 3, y: 4 }, dx: 0, dy: -3, dir: '3 units South (Down)' },
    { start: { x: -2, y: 3 }, dx: 4, dy: 0, dir: '4 units East (Right)' },
    { start: { x: 2, y: -3 }, dx: 0, dy: 5, dir: '5 units North (Up)' },
    { start: { x: -4, y: -2 }, dx: 3, dy: 0, dir: '3 units East (Right)' },
    { start: { x: 0, y: 2 }, dx: 3, dy: -2, dir: '3 East, 2 South' },
    { start: { x: 2, y: 2 }, dx: -4, dy: 0, dir: '4 units West (Left)' },
    { start: { x: -1, y: 4 }, dx: 0, dy: -4, dir: '4 units South (Down)' },
    { start: { x: 3, y: 1 }, dx: -2, dy: 3, dir: '2 West, 3 North' },
    { start: { x: -3, y: -3 }, dx: 5, dy: 2, dir: '5 East, 2 North' },
    { start: { x: 4, y: -1 }, dx: -3, dy: 0, dir: '3 units West (Left)' },
    { start: { x: -2, y: -1 }, dx: 0, dy: 4, dir: '4 units North (Up)' },
    { start: { x: 1, y: 3 }, dx: 2, dy: -2, dir: '2 East, 2 South' },
    { start: { x: -4, y: 3 }, dx: 3, dy: 1, dir: '3 East, 1 North' },
    { start: { x: 2, y: 4 }, dx: 0, dy: -4, dir: '4 units South (Down)' },
    { start: { x: -1, y: -2 }, dx: 3, dy: 3, dir: '3 East, 3 North' },
    { start: { x: 3, y: 3 }, dx: -4, dy: 0, dir: '4 units West (Left)' },
    { start: { x: -3, y: 2 }, dx: 2, dy: -3, dir: '2 East, 3 South' },
    { start: { x: 4, y: 2 }, dx: -3, dy: -2, dir: '3 West, 2 South' },
    { start: { x: -2, y: 4 }, dx: 4, dy: -4, dir: '4 East, 4 South' },
    { start: { x: 1, y: -4 }, dx: 2, dy: 5, dir: '2 East, 5 North' },
    { start: { x: -4, y: 1 }, dx: 3, dy: 0, dir: '3 units East (Right)' },
    { start: { x: 2, y: 0 }, dx: 0, dy: 3, dir: '3 units North (Up)' },
    { start: { x: 0, y: -2 }, dx: 4, dy: 2, dir: '4 East, 2 North' },
    { start: { x: -3, y: -1 }, dx: 2, dy: 3, dir: '2 East, 3 North' },
    { start: { x: 3, y: -2 }, dx: -2, dy: 4, dir: '2 West, 4 North' },
    { start: { x: -1, y: 1 }, dx: 4, dy: 0, dir: '4 units East (Right)' },
    { start: { x: 2, y: 3 }, dx: -3, dy: -2, dir: '3 West, 2 South' },
    { start: { x: -2, y: -3 }, dx: 4, dy: 4, dir: '4 East, 4 North' },
    { start: { x: 4, y: 1 }, dx: -2, dy: -3, dir: '2 West, 3 South' },
  ];
  translations.forEach((tr) => {
    const target = translateCoord(tr.start, tr.dx, tr.dy);
    const tmpl = OBJECT_TEMPLATES[(idCounter) % OBJECT_TEMPLATES.length];
    list.push({
      id: `q_trans_${idCounter++}`,
      category: 'translate',
      roundNumber: 2,
      scenario: `Relocate the ${tmpl.name} at (${tr.start.x}, ${tr.start.y}) to improve park traffic flow.`,
      prompt: `Translate the ${tmpl.name} at (${tr.start.x}, ${tr.start.y}) by ${tr.dir}. Where does it land?`,
      objectType: tmpl.type,
      objectName: tmpl.name,
      startPoint: tr.start,
      targetPoint: target,
      translationDelta: { dx: tr.dx, dy: tr.dy, directionLabel: tr.dir },
      correctAnswer: target,
      options: generateDistractors(target),
      stepExplanation: [
        `Original X = ${tr.start.x}, New X = ${tr.start.x} ${tr.dx >= 0 ? '+' : ''}${tr.dx} = ${target.x}.`,
        `Original Y = ${tr.start.y}, New Y = ${tr.start.y} ${tr.dy >= 0 ? '+' : ''}${tr.dy} = ${target.y}.`,
        `New coordinate: (${target.x}, ${target.y}).`,
      ],
      mode: 'translate',
      physicalOutcome: {
        objectType: tmpl.type,
        description: `Workers roll the ${tmpl.name} smoothly to (${target.x}, ${target.y}).`,
        happinessGain: 18,
        quadrantEffect: target.x >= 0 && target.y >= 0 ? 'QI' : target.x < 0 && target.y >= 0 ? 'QII' : target.x < 0 ? 'QIII' : 'QIV',
      },
    });
  });

  // 5. REFLECTIONS (Across X-axis, Y-axis, Origin) — 30 questions
  const reflectionSeeds: { pt: Coordinate2D; axis: 'x-axis' | 'y-axis' | 'origin' }[] = [
    { pt: { x: 2, y: 3 }, axis: 'x-axis' }, { pt: { x: -3, y: 4 }, axis: 'x-axis' },
    { pt: { x: 4, y: -2 }, axis: 'x-axis' }, { pt: { x: -2, y: -3 }, axis: 'x-axis' },
    { pt: { x: 1, y: 5 }, axis: 'x-axis' }, { pt: { x: -4, y: 1 }, axis: 'x-axis' },
    { pt: { x: 3, y: -4 }, axis: 'x-axis' }, { pt: { x: -5, y: -2 }, axis: 'x-axis' },
    { pt: { x: 2, y: 1 }, axis: 'x-axis' }, { pt: { x: -1, y: 3 }, axis: 'x-axis' },

    { pt: { x: 3, y: 2 }, axis: 'y-axis' }, { pt: { x: -4, y: 3 }, axis: 'y-axis' },
    { pt: { x: 2, y: -4 }, axis: 'y-axis' }, { pt: { x: -3, y: -2 }, axis: 'y-axis' },
    { pt: { x: 5, y: 1 }, axis: 'y-axis' }, { pt: { x: -2, y: 4 }, axis: 'y-axis' },
    { pt: { x: 4, y: -3 }, axis: 'y-axis' }, { pt: { x: -1, y: -5 }, axis: 'y-axis' },
    { pt: { x: 1, y: 4 }, axis: 'y-axis' }, { pt: { x: -5, y: 2 }, axis: 'y-axis' },

    { pt: { x: 2, y: 2 }, axis: 'origin' }, { pt: { x: -3, y: 3 }, axis: 'origin' },
    { pt: { x: 4, y: -3 }, axis: 'origin' }, { pt: { x: -2, y: -4 }, axis: 'origin' },
    { pt: { x: 1, y: 4 }, axis: 'origin' }, { pt: { x: -4, y: 2 }, axis: 'origin' },
    { pt: { x: 3, y: -1 }, axis: 'origin' }, { pt: { x: -5, y: -3 }, axis: 'origin' },
    { pt: { x: 2, y: 5 }, axis: 'origin' }, { pt: { x: -1, y: 2 }, axis: 'origin' },
  ];
  reflectionSeeds.forEach((ref) => {
    let target: Coordinate2D;
    let rule = '';
    if (ref.axis === 'x-axis') {
      target = reflectX(ref.pt);
      rule = 'Reflecting across X-axis keeps X same, flips Y sign: (x, y) -> (x, -y).';
    } else if (ref.axis === 'y-axis') {
      target = reflectY(ref.pt);
      rule = 'Reflecting across Y-axis flips X sign, keeps Y same: (x, y) -> (-x, y).';
    } else {
      target = reflectOrigin(ref.pt);
      rule = 'Reflecting through Origin flips both signs: (x, y) -> (-x, -y).';
    }

    const tmpl = OBJECT_TEMPLATES[(idCounter) % OBJECT_TEMPLATES.length];
    const cat: TransformationType = ref.axis === 'x-axis' ? 'reflect_x' : ref.axis === 'y-axis' ? 'reflect_y' : 'reflect_origin';

    list.push({
      id: `q_reflect_${idCounter++}`,
      category: cat,
      roundNumber: 3,
      scenario: `Create symmetrical park landscaping by reflecting the ${tmpl.name}.`,
      prompt: `The ${tmpl.name} is at (${ref.pt.x}, ${ref.pt.y}). Reflect it across the ${ref.axis.toUpperCase()}. Find the new coordinate.`,
      objectType: tmpl.type,
      objectName: tmpl.name,
      startPoint: ref.pt,
      targetPoint: target,
      reflectionAxis: ref.axis,
      correctAnswer: target,
      options: generateDistractors(target),
      stepExplanation: [
        rule,
        `Start Point: (${ref.pt.x}, ${ref.pt.y}).`,
        `Reflected Point: (${target.x}, ${target.y}).`,
      ],
      mode: 'reflect',
      physicalOutcome: {
        objectType: tmpl.type,
        description: `Structure mirrored across the ${ref.axis} to (${target.x}, ${target.y}).`,
        happinessGain: 20,
        quadrantEffect: target.x >= 0 && target.y >= 0 ? 'QI' : target.x < 0 && target.y >= 0 ? 'QII' : target.x < 0 ? 'QIII' : 'QIV',
      },
    });
  });

  // 6. ROTATIONS AROUND ORIGIN (90° CW, 90° CCW, 180°) — 30 questions
  const rotationSeeds: { pt: Coordinate2D; deg: 90 | 180 | 270; cw: boolean; label: string }[] = [
    { pt: { x: 1, y: 3 }, deg: 90, cw: true, label: '90° Clockwise' },
    { pt: { x: 2, y: 4 }, deg: 90, cw: true, label: '90° Clockwise' },
    { pt: { x: -2, y: 3 }, deg: 90, cw: true, label: '90° Clockwise' },
    { pt: { x: 3, y: -2 }, deg: 90, cw: true, label: '90° Clockwise' },
    { pt: { x: -4, y: -1 }, deg: 90, cw: true, label: '90° Clockwise' },
    { pt: { x: 1, y: 4 }, deg: 90, cw: true, label: '90° Clockwise' },
    { pt: { x: -3, y: 2 }, deg: 90, cw: true, label: '90° Clockwise' },
    { pt: { x: 4, y: -3 }, deg: 90, cw: true, label: '90° Clockwise' },
    { pt: { x: 2, y: 1 }, deg: 90, cw: true, label: '90° Clockwise' },
    { pt: { x: -1, y: 4 }, deg: 90, cw: true, label: '90° Clockwise' },

    { pt: { x: 3, y: 1 }, deg: 90, cw: false, label: '90° Counter-Clockwise' },
    { pt: { x: 4, y: 2 }, deg: 90, cw: false, label: '90° Counter-Clockwise' },
    { pt: { x: -3, y: 2 }, deg: 90, cw: false, label: '90° Counter-Clockwise' },
    { pt: { x: 2, y: -3 }, deg: 90, cw: false, label: '90° Counter-Clockwise' },
    { pt: { x: -2, y: -4 }, deg: 90, cw: false, label: '90° Counter-Clockwise' },
    { pt: { x: 1, y: 5 }, deg: 90, cw: false, label: '90° Counter-Clockwise' },
    { pt: { x: -4, y: 1 }, deg: 90, cw: false, label: '90° Counter-Clockwise' },
    { pt: { x: 3, y: -4 }, deg: 90, cw: false, label: '90° Counter-Clockwise' },
    { pt: { x: 2, y: 3 }, deg: 90, cw: false, label: '90° Counter-Clockwise' },
    { pt: { x: -1, y: 3 }, deg: 90, cw: false, label: '90° Counter-Clockwise' },

    { pt: { x: 2, y: 3 }, deg: 180, cw: true, label: '180° around Origin' },
    { pt: { x: -3, y: 2 }, deg: 180, cw: true, label: '180° around Origin' },
    { pt: { x: 4, y: -2 }, deg: 180, cw: true, label: '180° around Origin' },
    { pt: { x: -2, y: -4 }, deg: 180, cw: true, label: '180° around Origin' },
    { pt: { x: 1, y: 4 }, deg: 180, cw: true, label: '180° around Origin' },
    { pt: { x: -4, y: 3 }, deg: 180, cw: true, label: '180° around Origin' },
    { pt: { x: 3, y: -3 }, deg: 180, cw: true, label: '180° around Origin' },
    { pt: { x: -5, y: -1 }, deg: 180, cw: true, label: '180° around Origin' },
    { pt: { x: 2, y: 2 }, deg: 180, cw: true, label: '180° around Origin' },
    { pt: { x: -1, y: 5 }, deg: 180, cw: true, label: '180° around Origin' },
  ];
  rotationSeeds.forEach((rot) => {
    const target = rotateAroundOrigin(rot.pt, rot.deg, rot.cw);
    const tmpl = OBJECT_TEMPLATES[(idCounter) % OBJECT_TEMPLATES.length];
    const cat: TransformationType = rot.deg === 180 ? 'rotate_180' : rot.cw ? 'rotate_90_cw' : 'rotate_90_ccw';

    list.push({
      id: `q_rotate_${idCounter++}`,
      category: cat,
      roundNumber: 4,
      scenario: `Rotate the ${tmpl.name} around the Central Origin Plaza (0,0).`,
      prompt: `The ${tmpl.name} is at (${rot.pt.x}, ${rot.pt.y}). Rotate it ${rot.label} around (0,0). What is the new coordinate?`,
      objectType: tmpl.type,
      objectName: tmpl.name,
      startPoint: rot.pt,
      targetPoint: target,
      rotationParams: { degrees: rot.deg, direction: rot.cw ? 'clockwise' : 'counterclockwise', center: { x: 0, y: 0 } },
      correctAnswer: target,
      options: generateDistractors(target),
      stepExplanation: [
        rot.deg === 180
          ? '180° rotation negates both coordinates: (x, y) -> (-x, -y).'
          : rot.cw
          ? '90° clockwise rotation rule: (x, y) -> (y, -x).'
          : '90° counter-clockwise rotation rule: (x, y) -> (-y, x).',
        `Start Point: (${rot.pt.x}, ${rot.pt.y}).`,
        `Rotated Point: (${target.x}, ${target.y}).`,
      ],
      mode: 'rotate',
      physicalOutcome: {
        objectType: tmpl.type,
        description: `Structure rotates around the central plaza to (${target.x}, ${target.y}).`,
        happinessGain: 22,
        quadrantEffect: target.x >= 0 && target.y >= 0 ? 'QI' : target.x < 0 && target.y >= 0 ? 'QII' : target.x < 0 ? 'QIII' : 'QIV',
      },
    });
  });

  // 7. MULTI-POINT POLYGONS & WALKING TRAILS — 15 questions
  const polySeeds = [
    { pts: [{ x: 1, y: 1 }, { x: 3, y: 1 }, { x: 3, y: 3 }, { x: 1, y: 3 }], quad: 'QI' as QuadrantId, name: 'Playground Safety Sandbox' },
    { pts: [{ x: 2, y: 1 }, { x: 5, y: 1 }, { x: 5, y: 4 }, { x: 2, y: 4 }], quad: 'QI' as QuadrantId, name: 'Adventure Play Zone' },
    { pts: [{ x: -4, y: 1 }, { x: -1, y: 1 }, { x: -1, y: 4 }, { x: -4, y: 4 }], quad: 'QII' as QuadrantId, name: 'Formal Botanical Parterre' },
    { pts: [{ x: -4, y: -4 }, { x: -1, y: -4 }, { x: -1, y: -1 }, { x: -4, y: -1 }], quad: 'QIII' as QuadrantId, name: 'Sports Court Fencing' },
    { pts: [{ x: 1, y: -4 }, { x: 4, y: -4 }, { x: 4, y: -1 }, { x: 1, y: -1 }], quad: 'QIV' as QuadrantId, name: 'Picnic Lawn Perimeter' },
    { pts: [{ x: -4, y: -2 }, { x: -1, y: 0 }, { x: 2, y: 1 }, { x: 4, y: 4 }], quad: 'QI' as QuadrantId, name: 'Scenic Cross-Park Trail' },
    { pts: [{ x: -3, y: 3 }, { x: 0, y: 1 }, { x: 3, y: -1 }, { x: 4, y: -4 }], quad: 'QIV' as QuadrantId, name: 'Botanical to Picnic Promenade' },
    { pts: [{ x: 1, y: 2 }, { x: 4, y: 2 }, { x: 4, y: 5 }, { x: 1, y: 5 }], quad: 'QI' as QuadrantId, name: 'Toddler Play Area' },
    { pts: [{ x: -3, y: 1 }, { x: -1, y: 1 }, { x: -1, y: 3 }, { x: -3, y: 3 }], quad: 'QII' as QuadrantId, name: 'Orchid Flower Enclosure' },
    { pts: [{ x: -5, y: -3 }, { x: -2, y: -3 }, { x: -2, y: -1 }, { x: -5, y: -1 }], quad: 'QIII' as QuadrantId, name: 'Fitness Gym Floor' },
  ];
  polySeeds.forEach((poly) => {
    const ptsStr = poly.pts.map(formatCoord).join(', ');
    list.push({
      id: `q_poly_${idCounter++}`,
      category: 'polygon_boundary',
      roundNumber: 5,
      scenario: `Construct the perimeter for ${poly.name}.`,
      prompt: `Plot the boundary vertices: ${ptsStr}.`,
      objectType: 'sandbox',
      objectName: poly.name,
      targetQuadrant: poly.quad,
      targetPoints: poly.pts,
      correctAnswer: poly.pts,
      options: [
        ptsStr,
        poly.pts.map(p => formatCoord({ x: -p.x, y: p.y })).join(', '),
        poly.pts.map(p => formatCoord({ x: p.x, y: -p.y })).join(', '),
        poly.pts.map(p => formatCoord({ x: p.y, y: p.x })).join(', '),
      ],
      stepExplanation: [
        `Plot each of the ${poly.pts.length} coordinate points in order: ${ptsStr}.`,
        'Connecting these points creates the exact geometric boundary.',
      ],
      mode: 'polygon',
      physicalOutcome: {
        objectType: 'sandbox',
        description: `Construction crew paves the boundary and installs equipment inside.`,
        happinessGain: 25,
        quadrantEffect: poly.quad,
      },
    });
  });

  return list;
}

export const PARK_QUESTIONS_POOL: ParkQuestion[] = build150Questions();

/**
 * Generates a randomized match question set for 5, 10, or 15 rounds
 */
export function generateParkQuestions(count: 5 | 10 | 15): ParkQuestion[] {
  const pool = [...PARK_QUESTIONS_POOL];
  
  // Categorized pools for balanced round progression
  const qPlot = pool.filter(q => q.category === 'plot_point');
  const qTrans = pool.filter(q => q.category === 'translate');
  const qReflect = pool.filter(q => q.category.startsWith('reflect'));
  const qRotate = pool.filter(q => q.category.startsWith('rotate'));
  const qPoly = pool.filter(q => q.category === 'polygon_boundary' || q.category === 'path_design');

  const shuffle = <T>(arr: T[]): T[] => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const sPlot = shuffle(qPlot);
  const sTrans = shuffle(qTrans);
  const sReflect = shuffle(qReflect);
  const sRotate = shuffle(qRotate);
  const sPoly = shuffle(qPoly);

  const selected: ParkQuestion[] = [];
  
  // Standard 5-round core curriculum
  selected.push({ ...sPlot[0], roundNumber: 1 });
  selected.push({ ...sTrans[0], roundNumber: 2 });
  selected.push({ ...sReflect[0], roundNumber: 3 });
  selected.push({ ...sRotate[0], roundNumber: 4 });
  selected.push({ ...sPoly[0], roundNumber: 5 });

  if (count > 5) {
    const mixed = shuffle([
      ...sPlot.slice(1),
      ...sTrans.slice(1),
      ...sReflect.slice(1),
      ...sRotate.slice(1),
      ...sPoly.slice(1),
    ]);

    for (let i = 6; i <= count; i++) {
      const q = mixed[(i - 6) % mixed.length];
      selected.push({ ...q, id: `${q.id}_r${i}`, roundNumber: i });
    }
  }

  return selected.slice(0, count);
}
