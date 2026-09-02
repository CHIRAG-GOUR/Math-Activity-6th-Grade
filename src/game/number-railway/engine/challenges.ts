// ============================================================
// THE GREAT NUMBER RAILWAY — Challenge Engine
// Grade 6 Place Value & Rounding (Bloom's Taxonomy)
// 5-Stage Station Journey System + Super Tie-Breaker
// Q1: 🚗 Load Vehicles
// Q2: 🧱 Load Building Materials
// Q3: 👥 Board Passengers
// Q4: ⚙️ Release Brakes & Build Pressure
// Q5: 🚦 Green Signal & High-Graphics Train Journey to Next Station!
// Super: 🏆 Golden Master Clearance Tie-Breaker Question!
// ============================================================

import { RailwayChallenge, StationInfo } from '../types';

export const STATIONS_LIST: StationInfo[] = [
  {
    id: 'sunny-valley',
    name: 'Sunny Valley Central',
    subtitle: 'Main Terminal & Locomotive Sheds',
    position: [0, 0, 0],
    color: '#3b82f6',
  },
  {
    id: 'pine-ridge',
    name: 'Pine Ridge Terminal',
    subtitle: 'Timber Highlands & Forest Junction',
    position: [0, 0, -32],
    color: '#10b981',
  },
  {
    id: 'alpine-summit',
    name: 'Alpine Summit Station',
    subtitle: 'Mountain Pass & Grand Observatory',
    position: [28, 0, -16],
    color: '#f59e0b',
  },
  {
    id: 'crystal-harbor',
    name: 'Crystal Harbor Port',
    subtitle: 'Grand Ocean Terminus & Victory Plaza',
    position: [-24, 0, -18],
    color: '#8b5cf6',
  },
];

export const SUPER_TIE_BREAKER_CHALLENGE: RailwayChallenge = {
  id: 'super-tie-breaker-question',
  stationIndex: 0,
  stepIndex: 6,
  stepType: 'tie-breaker',
  stepTitle: '⚡ SUPER TIE-BREAKER QUESTION!',
  stepDescription: 'First team to correctly solve claims the Grand Championship & Golden Train Master Key!',
  stepIcon: '🏆',
  missionTitle: 'GOLDEN MASTER CLEARANCE',
  bloomLevel: 'evaluate',
  challengeType: 'round-to-nearest',
  difficulty: 'challenge',
  points: 250,
  timeLimit: 30,
  context: {
    originStation: 'Sunny Valley Central',
    destinationStation: 'Pine Ridge Terminal',
    narrative: 'TIE-BREAKER! Both engineering teams have equal scores. The Golden Master Dispatcher Key will be awarded to whoever solves this super clearance question FIRST!',
  },
  prompt: 'Round 1,489,520 to the nearest hundred thousand.',
  number: 1489520,
  numberString: '1,489,520',
  highlightDigitIndex: 2, // digit 8
  options: [
    { value: 1400000, label: '1,400,000' },
    { value: 1500000, label: '1,500,000' },
    { value: 1490000, label: '1,490,000' },
  ],
  correctAnswer: 1500000,
  validation: (a) => Number(a) === 1500000,
  hints: [
    'The hundred-thousands digit is 4. Look at the ten-thousands digit (8).',
    'Since 8 ≥ 5, round the 4 UP to 5 → 1,500,000.',
  ],
  explanation: 'In 1,489,520, the ten-thousands digit is 8 (≥ 5), which rounds the hundred-thousands digit 4 UP to 5 → 1,500,000. TIE-BREAKER VICTORY!',
};

export const RAILWAY_CHALLENGES: RailwayChallenge[] = [
  // =========================================================================
  // ── JOURNEY 1: SUNNY VALLEY CENTRAL ➔ PINE RIDGE TERMINAL ──
  // =========================================================================

  // ── STEP 1: LOAD VEHICLES ──
  {
    id: 'j1-step-1-vehicles',
    stationIndex: 0,
    stepIndex: 1,
    stepType: 'vehicles',
    stepTitle: 'STEP 1: LOAD VEHICLES',
    stepDescription: 'Verify the vehicle fleet distance code to operate the cargo crane and load the cars.',
    stepIcon: '🚗',
    missionTitle: 'VEHICLE FLEET DISPATCH',
    bloomLevel: 'apply',
    challengeType: 'round-to-nearest',
    difficulty: 'foundation',
    points: 100,
    timeLimit: 35,
    context: {
      originStation: 'Sunny Valley Central',
      destinationStation: 'Pine Ridge Terminal',
      narrative: 'The cargo crane operator needs to verify the total fleet transport distance of 482,750 km. Round this distance to the nearest thousand to load the vehicles.',
    },
    prompt: 'Round 482,750 to the nearest thousand.',
    number: 482750,
    numberString: '482,750',
    highlightDigitIndex: 3, // digit 7
    options: [
      { value: 482000, label: '482,000' },
      { value: 483000, label: '483,000' },
    ],
    correctAnswer: 483000,
    validation: (a) => Number(a) === 483000,
    hints: [
      'Look at the hundreds digit in 482,750. The hundreds digit is 7.',
      'Since 7 is 5 or greater, round the thousands digit 2 UP to 3 → 483,000.',
    ],
    explanation: 'In 482,750, the thousands place has digit 2. The decider digit in the hundreds place is 7. Since 7 ≥ 5, we round UP to 483,000. Crane loads the vehicles!',
  },

  // ── STEP 2: LOAD BUILDING MATERIALS ──
  {
    id: 'j1-step-2-materials',
    stationIndex: 0,
    stepIndex: 2,
    stepType: 'materials',
    stepTitle: 'STEP 2: SECURE MATERIALS',
    stepDescription: 'Determine the exact place value of the structural steel shipment.',
    stepIcon: '🧱',
    missionTitle: 'CONSTRUCTION MATERIALS MANIFEST',
    bloomLevel: 'remember',
    challengeType: 'digit-value',
    difficulty: 'foundation',
    points: 100,
    timeLimit: 35,
    context: {
      originStation: 'Sunny Valley Central',
      destinationStation: 'Pine Ridge Terminal',
      narrative: 'A heavy shipment of 745,210 kg of timber beams and steel pipes is ready at the freight depot. What is the value of the digit 7?',
    },
    prompt: 'What is the value of the digit 7 in 745,210?',
    number: 745210,
    numberString: '745,210',
    highlightDigitIndex: 0,
    options: [
      { value: 70000, label: '70,000' },
      { value: 700000, label: '700,000' },
      { value: 7000, label: '7,000' },
      { value: 7000000, label: '7,000,000' },
    ],
    correctAnswer: 700000,
    validation: (a) => Number(a) === 700000,
    hints: [
      'Count place values from the right: Ones, Tens, Hundreds, Thousands, Ten Thousands, Hundred Thousands.',
      'The 7 is in the hundred thousands place: 7 × 100,000 = 700,000.',
    ],
    explanation: 'In 745,210, the digit 7 occupies the Hundred Thousands place. Its value is 7 × 100,000 = 700,000. Heavy construction materials loaded!',
  },

  // ── STEP 3: BOARD PASSENGERS ──
  {
    id: 'j1-step-3-passengers',
    stationIndex: 0,
    stepIndex: 3,
    stepType: 'passengers',
    stepTitle: 'STEP 3: BOARD PASSENGERS',
    stepDescription: 'Round the passenger boarding tickets to open the carriage doors.',
    stepIcon: '👥',
    missionTitle: 'PASSENGER BOARDING CALL',
    bloomLevel: 'apply',
    challengeType: 'round-to-nearest',
    difficulty: 'core',
    points: 120,
    timeLimit: 35,
    context: {
      originStation: 'Sunny Valley Central',
      destinationStation: 'Pine Ridge Terminal',
      narrative: 'A bustling group of 38,492 passengers and students are waiting on the platform. Round the count to the nearest hundred to open coach doors.',
    },
    prompt: 'Round 38,492 to the nearest hundred.',
    number: 38492,
    numberString: '38,492',
    highlightDigitIndex: 3,
    options: [
      { value: 38400, label: '38,400' },
      { value: 38500, label: '38,500' },
    ],
    correctAnswer: 38500,
    validation: (a) => Number(a) === 38500,
    hints: [
      'Look at the tens digit in 38,492. The tens digit is 9.',
      'Since 9 ≥ 5, we round the hundreds digit 4 UP to 5 → 38,500.',
    ],
    explanation: 'In 38,492, the hundreds digit is 4 and the next digit is 9. Since 9 ≥ 5, 38,492 rounds UP to 38,500. "All aboard!" Passengers enter the coach!',
  },

  // ── STEP 4: RELEASE BRAKES & CHARGE BOILER ──
  {
    id: 'j1-step-4-brakes',
    stationIndex: 0,
    stepIndex: 4,
    stepType: 'brakes',
    stepTitle: 'STEP 4: DISENGAGE BRAKES',
    stepDescription: 'Round the boiler steam pressure readout to lift the mechanical brake calipers.',
    stepIcon: '⚙️',
    missionTitle: 'PNEUMATIC BRAKE RELEASE',
    bloomLevel: 'apply',
    challengeType: 'round-to-nearest',
    difficulty: 'core',
    points: 120,
    timeLimit: 35,
    context: {
      originStation: 'Sunny Valley Central',
      destinationStation: 'Pine Ridge Terminal',
      narrative: 'The locomotive engineer needs to calibrate the pneumatic braking system at 596,240 PSI. Round this reading to the nearest ten thousand to disengage wheels.',
    },
    prompt: 'Round 596,240 to the nearest ten thousand.',
    number: 596240,
    numberString: '596,240',
    highlightDigitIndex: 2,
    options: [
      { value: 590000, label: '590,000' },
      { value: 600000, label: '600,000' },
    ],
    correctAnswer: 600000,
    validation: (a) => Number(a) === 600000,
    hints: [
      'The ten-thousands digit is 9. Look at the thousands digit 6.',
      'Since 6 ≥ 5, round 59 ten-thousands UP by 1 to 60 ten-thousands → 600,000.',
    ],
    explanation: 'In 596,240, rounding to the nearest ten thousand gives 600,000 because 6 ≥ 5 rolls 59 to 60. Mechanical brakes lift with a hiss of steam!',
  },

  // ── STEP 5: GREEN SIGNAL & DEPARTURE TO NEXT STATION! ──
  {
    id: 'j1-step-5-departure',
    stationIndex: 0,
    stepIndex: 5,
    stepType: 'departure',
    stepTitle: 'STEP 5: GREEN SIGNAL & DEPART!',
    stepDescription: 'Validate the master clearance code to turn the signal emerald GREEN and start the train journey!',
    stepIcon: '🚦',
    missionTitle: 'EXPRESS ROUTE CLEARANCE',
    bloomLevel: 'apply',
    challengeType: 'round-to-nearest',
    difficulty: 'challenge',
    points: 150,
    timeLimit: 40,
    context: {
      originStation: 'Sunny Valley Central',
      destinationStation: 'Pine Ridge Terminal',
      narrative: 'The departure semaphore signal is locked RED. Round 849,631 km to the nearest hundred thousand to turn signal GREEN and cruise across the valley!',
    },
    prompt: 'Round 849,631 to the nearest hundred thousand.',
    number: 849631,
    numberString: '849,631',
    highlightDigitIndex: 1,
    options: [
      { value: 800000, label: '800,000' },
      { value: 900000, label: '900,000' },
    ],
    correctAnswer: 800000,
    validation: (a) => Number(a) === 800000,
    hints: [
      'The hundred-thousands digit is 8. The ten-thousands digit is 4.',
      'Since 4 < 5, we round DOWN: keep the 8 → 800,000.',
    ],
    explanation: 'In 849,631, the ten-thousands digit is 4 (< 5), so it rounds DOWN to 800,000. SIGNAL TURNS GREEN! Whistle blows and train departs to Pine Ridge Terminal!',
  },
];
