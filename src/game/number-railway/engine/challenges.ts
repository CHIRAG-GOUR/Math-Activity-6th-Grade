// ============================================================
// THE GREAT NUMBER RAILWAY — Challenge Engine
// Grade 6 Place Value & Rounding (Bloom's Taxonomy)
// 5-Stage Station Journey System:
// Q1: 🚗 Load Vehicles
// Q2: 🧱 Load Building Materials
// Q3: 👥 Board Passengers
// Q4: ⚙️ Release Brakes & Build Pressure
// Q5: 🚦 Green Signal & High-Graphics Train Journey to Next Station!
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
    stepTitle: 'STEP 1: LOAD VEHICLES ONTO FLATBED',
    stepDescription: 'Verify the vehicle fleet distance code to operate the cargo crane and load the cars.',
    stepIcon: '🚗',
    missionTitle: 'VEHICLE FLEET DISPATCH',
    bloomLevel: 'apply',
    challengeType: 'round-to-nearest',
    difficulty: 'foundation',
    points: 100,
    timeLimit: 45,
    context: {
      originStation: 'Sunny Valley Central',
      destinationStation: 'Pine Ridge Terminal',
      narrative: 'The cargo crane operator needs to verify the total fleet transport distance of 482,750 km. The railway manifest requires this distance rounded to the nearest thousand before loading vehicles.',
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
    stepTitle: 'STEP 2: SECURE BUILDING MATERIALS',
    stepDescription: 'Determine the exact place value of the structural steel shipment.',
    stepIcon: '🧱',
    missionTitle: 'CONSTRUCTION MATERIALS MANIFEST',
    bloomLevel: 'remember',
    challengeType: 'digit-value',
    difficulty: 'foundation',
    points: 100,
    timeLimit: 45,
    context: {
      originStation: 'Sunny Valley Central',
      destinationStation: 'Pine Ridge Terminal',
      narrative: 'A heavy shipment of 745,210 kg of timber beams and steel pipes is ready at the freight depot. The loading winch requires the exact value of the leading digit 7.',
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
    stepTitle: 'STEP 3: BOARD PASSENGERS ONTO COACH',
    stepDescription: 'Round the passenger boarding tickets to open the carriage doors.',
    stepIcon: '👥',
    missionTitle: 'PASSENGER BOARDING CALL',
    bloomLevel: 'apply',
    challengeType: 'round-to-nearest',
    difficulty: 'core',
    points: 120,
    timeLimit: 45,
    context: {
      originStation: 'Sunny Valley Central',
      destinationStation: 'Pine Ridge Terminal',
      narrative: 'A bustling group of 38,492 passengers and students are waiting on the platform with golden tickets. Round the total count to the nearest hundred to open the coach doors.',
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
    stepTitle: 'STEP 4: DISENGAGE BRAKES & BUILD PRESSURE',
    stepDescription: 'Round the boiler steam pressure readout to lift the mechanical brake calipers.',
    stepIcon: '⚙️',
    missionTitle: 'PNEUMATIC BRAKE RELEASE',
    bloomLevel: 'apply',
    challengeType: 'round-to-nearest',
    difficulty: 'core',
    points: 120,
    timeLimit: 45,
    context: {
      originStation: 'Sunny Valley Central',
      destinationStation: 'Pine Ridge Terminal',
      narrative: 'The locomotive engineer needs to calibrate the pneumatic braking system at 596,240 PSI. Round this pressure reading to the nearest ten thousand to disengage the wheels.',
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
    stepTitle: 'STEP 5: TURN SIGNAL GREEN & DEPART!',
    stepDescription: 'Validate the master clearance code to turn the signal emerald GREEN and start the train journey!',
    stepIcon: '🚦',
    missionTitle: 'EXPRESS ROUTE CLEARANCE',
    bloomLevel: 'apply',
    challengeType: 'round-to-nearest',
    difficulty: 'challenge',
    points: 150,
    timeLimit: 50,
    context: {
      originStation: 'Sunny Valley Central',
      destinationStation: 'Pine Ridge Terminal',
      narrative: 'The departure semaphore signal is currently locked RED. To authorize the express train to travel across the valley to Pine Ridge Terminal, round the master track distance of 849,631 km to the nearest hundred thousand.',
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
    explanation: 'In 849,631, the ten-thousands digit is 4 (< 5), so it rounds DOWN to 800,000. SIGNAL TURNS GREEN! Whistle blows and the train departs to Pine Ridge Terminal!',
  },

  // =========================================================================
  // ── JOURNEY 2: PINE RIDGE TERMINAL ➔ ALPINE SUMMIT ──
  // =========================================================================

  // ── STEP 1: LOAD VEHICLES (Journey 2) ──
  {
    id: 'j2-step-1-vehicles',
    stationIndex: 1,
    stepIndex: 1,
    stepType: 'vehicles',
    stepTitle: 'STEP 1: LOAD EXPLORATION VEHICLES',
    stepDescription: 'Construct the mountain rover registration number from its expanded form.',
    stepIcon: '🚙',
    missionTitle: 'MOUNTAIN EXPEDITION ROVERS',
    bloomLevel: 'understand',
    challengeType: 'expanded-form',
    difficulty: 'core',
    points: 120,
    timeLimit: 45,
    context: {
      originStation: 'Pine Ridge Terminal',
      destinationStation: 'Alpine Summit Station',
      narrative: 'High-altitude 4x4 rovers are waiting at Pine Ridge. Combine the expanded form code to authorize the loading dock.',
    },
    prompt: 'What number is: 600,000 + 40,000 + 8,000 + 300 + 20 + 5?',
    number: 648325,
    numberString: '600,000 + 40,000 + 8,000 + 300 + 20 + 5',
    options: [
      { value: 648325, label: '648,325' },
      { value: 648352, label: '648,352' },
      { value: 684325, label: '684,325' },
    ],
    correctAnswer: 648325,
    validation: (a) => Number(a) === 648325,
    hints: [
      'Add each place value: 6 Hundred Thousands, 4 Ten Thousands, 8 Thousands, 3 Hundreds, 2 Tens, 5 Ones.',
      'Combine: 648,325.',
    ],
    explanation: 'Combining 600,000 + 40,000 + 8,000 + 300 + 20 + 5 creates 648,325. Mountain exploration rovers loaded onto flatbeds!',
  },

  // ── STEP 2: LOAD BUILDING MATERIALS (Journey 2) ──
  {
    id: 'j2-step-2-materials',
    stationIndex: 1,
    stepIndex: 2,
    stepType: 'materials',
    stepTitle: 'STEP 2: LOAD ALPINE BRIDGE STEEL',
    stepDescription: 'Compare heavy bridge cargo weights to balance the cargo wagon.',
    stepIcon: '🏗️',
    missionTitle: 'VIADUCT STEEL WEIGHT COMPARISON',
    bloomLevel: 'analyze',
    challengeType: 'compare-numbers',
    difficulty: 'core',
    points: 120,
    timeLimit: 45,
    context: {
      originStation: 'Pine Ridge Terminal',
      destinationStation: 'Alpine Summit Station',
      narrative: 'The high viaduct bridge requires the heavier of two steel cargo crates. Which crate has the larger mass?',
    },
    prompt: 'Which number is GREATER: 628,490 or 628,940?',
    number: 628940,
    numberString: '628,490 vs 628,940',
    options: [
      { value: 628490, label: '628,490' },
      { value: 628940, label: '628,940' },
    ],
    correctAnswer: 628940,
    validation: (a) => Number(a) === 628940,
    hints: [
      'Compare digits from left to right: 6=6, 2=2, 8=8. Look at the hundreds digit: 4 vs 9.',
      '9 hundreds (900) is greater than 4 hundreds (400) → 628,940 is greater.',
    ],
    explanation: 'Comparing place by place: the hundreds digit 9 in 628,940 is larger than 4 in 628,490. Heavy viaduct bridge steel secured!',
  },

  // ── STEP 3: BOARD PASSENGERS (Journey 2) ──
  {
    id: 'j2-step-3-passengers',
    stationIndex: 1,
    stepIndex: 3,
    stepType: 'passengers',
    stepTitle: 'STEP 3: BOARD ALPINE HIKERS',
    stepDescription: 'Diagnose the station master\'s passenger rounding error.',
    stepIcon: '👥',
    missionTitle: 'PASSENGER MANIFEST AUDIT',
    bloomLevel: 'analyze',
    challengeType: 'error-analysis',
    difficulty: 'challenge',
    points: 140,
    timeLimit: 50,
    context: {
      originStation: 'Pine Ridge Terminal',
      destinationStation: 'Alpine Summit Station',
      narrative: 'A trainee ticket conductor claims that 429,512 passengers rounded to the nearest thousand is 429,000. Is this statement correct?',
    },
    prompt: 'Trainee says 429,512 rounded to the nearest thousand is 429,000. Is this correct?',
    number: 429512,
    numberString: '429,512',
    options: [
      { value: 'false', label: 'INCORRECT (Should be 430,000)' },
      { value: 'true', label: 'CORRECT (It is 429,000)' },
    ],
    correctAnswer: 'false',
    validation: (a) => String(a) === 'false',
    hints: [
      'In 429,512, look at the hundreds digit (5).',
      'Since 5 ≥ 5, we round UP! 429 thousands becomes 430 thousands (430,000).',
    ],
    explanation: 'The trainee is incorrect because the hundreds digit is 5, which triggers a round UP from 429,000 to 430,000. Error caught! Alpine hikers board happily!',
  },

  // ── STEP 4: RELEASE BRAKES & CHARGE BOILER (Journey 2) ──
  {
    id: 'j2-step-4-brakes',
    stationIndex: 1,
    stepIndex: 4,
    stepType: 'brakes',
    stepTitle: 'STEP 4: CHARGE HIGH-ALTITUDE STEAM',
    stepDescription: 'Identify the digit place value in the mountain supercharger.',
    stepIcon: '⚙️',
    missionTitle: 'SUPERCHARGER PRESSURE CALIBRATION',
    bloomLevel: 'understand',
    challengeType: 'digit-value',
    difficulty: 'core',
    points: 120,
    timeLimit: 45,
    context: {
      originStation: 'Pine Ridge Terminal',
      destinationStation: 'Alpine Summit Station',
      narrative: 'The alpine steam turbine requires setting the frequency to the exact value of the 9 in 192,854.',
    },
    prompt: 'What is the value of the digit 9 in 192,854?',
    number: 192854,
    numberString: '192,854',
    highlightDigitIndex: 1,
    options: [
      { value: 900, label: '900' },
      { value: 9000, label: '9,000' },
      { value: 90000, label: '90,000' },
      { value: 900000, label: '900,000' },
    ],
    correctAnswer: 90000,
    validation: (a) => Number(a) === 90000,
    hints: [
      'The 9 is in the Ten Thousands place.',
      '9 × 10,000 = 90,000.',
    ],
    explanation: 'In 192,854, the digit 9 is in the Ten Thousands place, giving it a value of 90,000. Steam builds rapidly and mountain brakes disengage!',
  },

  // ── STEP 5: GREEN SIGNAL & DEPARTURE TO ALPINE SUMMIT! ──
  {
    id: 'j2-step-5-departure',
    stationIndex: 1,
    stepIndex: 5,
    stepType: 'departure',
    stepTitle: 'STEP 5: GREEN SIGNAL & ALPINE CRUISE!',
    stepDescription: 'Round the mountain summit elevation distance to trigger the green departure signal!',
    stepIcon: '🚦',
    missionTitle: 'GRAND ALPINE SIGNAL CLEARANCE',
    bloomLevel: 'apply',
    challengeType: 'round-to-nearest',
    difficulty: 'challenge',
    points: 160,
    timeLimit: 50,
    context: {
      originStation: 'Pine Ridge Terminal',
      destinationStation: 'Alpine Summit Station',
      narrative: 'The high-mountain signal gate is locked. Round 975,410 metres to the nearest ten thousand to turn the signal emerald GREEN and launch the train across the scenic mountain viaduct!',
    },
    prompt: 'Round 975,410 to the nearest ten thousand.',
    number: 975410,
    numberString: '975,410',
    highlightDigitIndex: 2,
    options: [
      { value: 970000, label: '970,000' },
      { value: 980000, label: '980,000' },
    ],
    correctAnswer: 980000,
    validation: (a) => Number(a) === 980000,
    hints: [
      'The ten-thousands digit is 7. The thousands digit is 5.',
      'Since 5 ≥ 5, round the 7 UP to 8 → 980,000.',
    ],
    explanation: 'In 975,410, the thousands digit 5 forces 97 ten-thousands to round UP to 980,000. SIGNAL TURNS GREEN! High-graphics mountain journey starts!',
  },
];
