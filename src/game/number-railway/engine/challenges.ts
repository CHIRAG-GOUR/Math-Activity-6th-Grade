// ============================================================
// THE GREAT NUMBER RAILWAY — Challenge Engine
// Grade 6 Curriculum: Place Value & Rounding (Bloom's Taxonomy)
//
// Stations:
// 1. Skillizee Junction (Main Departure Hub)
// 2. CCIS Junction (Highlands Terminus)
//
// 5-Stage Physical Progression:
// Step 1: 👥 Board Passengers from Skillizee Platform
// Step 2: 🚗 Load Realistic Vehicles onto Flatbed Wagon
// Step 3: 🪜 Secure Materials (Ladders, Timber Planks, Steel & Bricks)
// Step 4: ⚙️ Train Driver Disengages Brakes & Builds Steam
// Step 5: 🚦 Green Signal & 15-Second High-Graphics Cruise to CCIS Junction!
// ============================================================

import { RailwayChallenge, StationInfo } from '../types';

export const STATIONS_LIST: StationInfo[] = [
  {
    id: 'skillizee-junction',
    name: 'Skillizee Junction',
    subtitle: 'Main Central Platform & Locomotive Depot',
    position: [0, 0, 0],
    color: '#3b82f6',
  },
  {
    id: 'ccis-junction',
    name: 'CCIS Junction',
    subtitle: 'Highland Grand Express Terminus',
    position: [0, 0, -35],
    color: '#10b981',
  },
];

export const SUPER_TIE_BREAKER_CHALLENGE: RailwayChallenge = {
  id: 'super-tie-breaker-question',
  stationIndex: 0,
  stepIndex: 6,
  stepType: 'tie-breaker',
  stepTitle: '⚡ SUPER TIE-BREAKER QUESTION!',
  stepDescription: 'First team to solve correctly wins the Grand Railway Championship & Golden Train Master Cup!',
  stepIcon: '🏆',
  missionTitle: 'GOLDEN MASTER CLEARANCE',
  bloomLevel: 'evaluate',
  challengeType: 'round-to-nearest',
  difficulty: 'challenge',
  points: 250,
  timeLimit: 30,
  context: {
    originStation: 'Skillizee Junction',
    destinationStation: 'CCIS Junction',
    narrative: 'TIE-BREAKER! Both engineering teams have equal points. Solve this super place value clearance question first to win!',
  },
  prompt: 'Round 1,489,520 to the nearest hundred thousand.',
  number: 1489520,
  numberString: '1,489,520',
  highlightDigitIndex: 2,
  options: [
    { value: 1400000, label: '1,400,000' },
    { value: 1500000, label: '1,500,000' },
    { value: 1490000, label: '1,490,000' },
  ],
  correctAnswer: 1500000,
  validation: (a) => Number(a) === 1500000,
  hints: [
    'The hundred-thousands digit is 4. The ten-thousands digit is 8.',
    'Since 8 ≥ 5, round 4 UP to 5 → 1,500,000.',
  ],
  explanation: 'In 1,489,520, the ten-thousands digit 8 is 5 or greater, rounding 4 UP to 5 → 1,500,000. TIE-BREAKER VICTORY!',
};

// 15 Comprehensive Questions covering both Place Value & Rounding
export const ALL_RAILWAY_CHALLENGES: RailwayChallenge[] = [
  // ── STEP 1: 👥 BOARD PASSENGERS (Q1..Q3) ──
  {
    id: 'q1-passengers-1',
    stationIndex: 0,
    stepIndex: 1,
    stepType: 'passengers',
    stepTitle: 'STEP 1: BOARD PASSENGERS',
    stepDescription: 'Validate the platform passenger boarding count to open the carriage doors.',
    stepIcon: '👥',
    missionTitle: 'PLATFORM BOARDING CALL',
    bloomLevel: 'apply',
    challengeType: 'round-to-nearest',
    difficulty: 'foundation',
    points: 100,
    timeLimit: 35,
    context: {
      originStation: 'Skillizee Junction',
      destinationStation: 'CCIS Junction',
      narrative: 'A large group of 38,492 students and passengers are waiting on the platform at Skillizee Junction. Round the count to the nearest hundred to open coach doors.',
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
      'Since 9 ≥ 5, round the hundreds digit 4 UP to 5 → 38,500.',
    ],
    explanation: 'In 38,492, the tens digit is 9 (≥ 5), rounding hundreds digit 4 UP to 5 → 38,500. Passengers board the coach!',
  },
  {
    id: 'q2-passengers-2',
    stationIndex: 0,
    stepIndex: 1,
    stepType: 'passengers',
    stepTitle: 'STEP 1: BOARD PASSENGERS',
    stepDescription: 'Determine the exact place value of the express ticket counter.',
    stepIcon: '👥',
    missionTitle: 'TICKET VALUE MANIFEST',
    bloomLevel: 'remember',
    challengeType: 'digit-value',
    difficulty: 'foundation',
    points: 100,
    timeLimit: 35,
    context: {
      originStation: 'Skillizee Junction',
      destinationStation: 'CCIS Junction',
      narrative: 'The automated gate registered 582,319 electronic tickets. What is the value of the digit 8?',
    },
    prompt: 'What is the value of the digit 8 in 582,319?',
    number: 582319,
    numberString: '582,319',
    highlightDigitIndex: 1,
    options: [
      { value: 8000, label: '8,000' },
      { value: 80000, label: '80,000' },
      { value: 800000, label: '800,000' },
    ],
    correctAnswer: 80000,
    validation: (a) => Number(a) === 80000,
    hints: [
      'The 8 is in the Ten Thousands place.',
      '8 × 10,000 = 80,000.',
    ],
    explanation: 'In 582,319, digit 8 occupies the Ten Thousands place. Value = 80,000. Second passenger group enters!',
  },
  {
    id: 'q3-passengers-3',
    stationIndex: 0,
    stepIndex: 1,
    stepType: 'passengers',
    stepTitle: 'STEP 1: BOARD PASSENGERS',
    stepDescription: 'Round the commuter passenger index to the nearest thousand.',
    stepIcon: '👥',
    missionTitle: 'COMMUTER COUNT CLEARANCE',
    bloomLevel: 'apply',
    challengeType: 'round-to-nearest',
    difficulty: 'core',
    points: 110,
    timeLimit: 35,
    context: {
      originStation: 'Skillizee Junction',
      destinationStation: 'CCIS Junction',
      narrative: 'A total of 127,640 passengers have booked trips to CCIS Junction today. Round to the nearest thousand.',
    },
    prompt: 'Round 127,640 to the nearest thousand.',
    number: 127640,
    numberString: '127,640',
    highlightDigitIndex: 3,
    options: [
      { value: 127000, label: '127,000' },
      { value: 128000, label: '128,000' },
    ],
    correctAnswer: 128000,
    validation: (a) => Number(a) === 128000,
    hints: [
      'The hundreds digit is 6. Since 6 ≥ 5, round the 7 thousands UP to 8.',
    ],
    explanation: 'In 127,640, hundreds digit 6 ≥ 5 rounds thousands UP to 128,000. All passengers seated!',
  },

  // ── STEP 2: 🚗 LOAD VEHICLES ONTO FLATBED (Q4..Q6) ──
  {
    id: 'q4-vehicles-1',
    stationIndex: 0,
    stepIndex: 2,
    stepType: 'vehicles',
    stepTitle: 'STEP 2: LOAD VEHICLES',
    stepDescription: 'Verify the vehicle fleet distance code to lower the crane and load the cars.',
    stepIcon: '🚗',
    missionTitle: 'VEHICLE FLEET DISPATCH',
    bloomLevel: 'apply',
    challengeType: 'round-to-nearest',
    difficulty: 'foundation',
    points: 100,
    timeLimit: 35,
    context: {
      originStation: 'Skillizee Junction',
      destinationStation: 'CCIS Junction',
      narrative: 'The freight crane operator needs to verify the vehicle transport distance of 482,750 km. Round this distance to the nearest thousand.',
    },
    prompt: 'Round 482,750 to the nearest thousand.',
    number: 482750,
    numberString: '482,750',
    highlightDigitIndex: 3,
    options: [
      { value: 482000, label: '482,000' },
      { value: 483000, label: '483,000' },
    ],
    correctAnswer: 483000,
    validation: (a) => Number(a) === 483000,
    hints: [
      'The hundreds digit is 7. Since 7 ≥ 5, round thousands digit 2 UP to 3 → 483,000.',
    ],
    explanation: 'In 482,750, the hundreds digit 7 rounds 482 thousands UP to 483,000. Crane loads the cyan sedan & yellow pickup!',
  },
  {
    id: 'q5-vehicles-2',
    stationIndex: 0,
    stepIndex: 2,
    stepType: 'vehicles',
    stepTitle: 'STEP 2: LOAD VEHICLES',
    stepDescription: 'Identify the digit place value in the automobile transport weight.',
    stepIcon: '🚗',
    missionTitle: 'VEHICLE WEIGHT MANIFEST',
    bloomLevel: 'remember',
    challengeType: 'digit-value',
    difficulty: 'core',
    points: 110,
    timeLimit: 35,
    context: {
      originStation: 'Skillizee Junction',
      destinationStation: 'CCIS Junction',
      narrative: 'The fleet flatbed wagon has a combined vehicle mass of 694,520 kg. What is the value of digit 9?',
    },
    prompt: 'What is the value of the digit 9 in 694,520?',
    number: 694520,
    numberString: '694,520',
    highlightDigitIndex: 1,
    options: [
      { value: 9000, label: '9,000' },
      { value: 90000, label: '90,000' },
      { value: 900000, label: '900,000' },
    ],
    correctAnswer: 90000,
    validation: (a) => Number(a) === 90000,
    hints: [
      '9 is in the Ten Thousands place: 9 × 10,000 = 90,000.',
    ],
    explanation: 'In 694,520, digit 9 is in the Ten Thousands place (90,000). Vehicles locked onto flatbed!',
  },
  {
    id: 'q6-vehicles-3',
    stationIndex: 0,
    stepIndex: 2,
    stepType: 'vehicles',
    stepTitle: 'STEP 2: LOAD VEHICLES',
    stepDescription: 'Round the transport odometer distance to the nearest hundred.',
    stepIcon: '🚗',
    missionTitle: 'ODOMETER CALIBRATION',
    bloomLevel: 'apply',
    challengeType: 'round-to-nearest',
    difficulty: 'core',
    points: 120,
    timeLimit: 35,
    context: {
      originStation: 'Skillizee Junction',
      destinationStation: 'CCIS Junction',
      narrative: 'Round 45,673 km to the nearest hundred to secure the vehicle wheel clamps.',
    },
    prompt: 'Round 45,673 to the nearest hundred.',
    number: 45673,
    numberString: '45,673',
    highlightDigitIndex: 3,
    options: [
      { value: 45600, label: '45,600' },
      { value: 45700, label: '45,700' },
    ],
    correctAnswer: 45700,
    validation: (a) => Number(a) === 45700,
    hints: [
      'The tens digit is 7 (≥ 5), rounding 6 hundreds UP to 7 → 45,700.',
    ],
    explanation: '45,673 rounded to the nearest hundred is 45,700. Vehicle flatbed secured!',
  },

  // ── STEP 3: 🪜 LOAD BUILDING MATERIALS (Ladders, Planks, Steel & Bricks) (Q7..Q9) ──
  {
    id: 'q7-materials-1',
    stationIndex: 0,
    stepIndex: 3,
    stepType: 'materials',
    stepTitle: 'STEP 3: SECURE MATERIALS',
    stepDescription: 'Determine the place value of the structural timber planks and ladders shipment.',
    stepIcon: '🪜',
    missionTitle: 'CONSTRUCTION MATERIALS MANIFEST',
    bloomLevel: 'remember',
    challengeType: 'digit-value',
    difficulty: 'foundation',
    points: 100,
    timeLimit: 35,
    context: {
      originStation: 'Skillizee Junction',
      destinationStation: 'CCIS Junction',
      narrative: 'A heavy shipment of 745,210 kg containing ladders, timber planks, steel beams, and bricks is ready at Skillizee Junction depot. What is the value of digit 7?',
    },
    prompt: 'What is the value of the digit 7 in 745,210?',
    number: 745210,
    numberString: '745,210',
    highlightDigitIndex: 0,
    options: [
      { value: 70000, label: '70,000' },
      { value: 700000, label: '700,000' },
      { value: 7000, label: '7,000' },
    ],
    correctAnswer: 700000,
    validation: (a) => Number(a) === 700000,
    hints: [
      'The 7 is in the Hundred Thousands place: 7 × 100,000 = 700,000.',
    ],
    explanation: 'In 745,210, digit 7 is in the Hundred Thousands place. Value = 700,000. Ladders and planks loaded!',
  },
  {
    id: 'q8-materials-2',
    stationIndex: 0,
    stepIndex: 3,
    stepType: 'materials',
    stepTitle: 'STEP 3: SECURE MATERIALS',
    stepDescription: 'Round the structural steel and brick weight to the nearest ten thousand.',
    stepIcon: '🪜',
    missionTitle: 'CARGO STRAP TENSION CODE',
    bloomLevel: 'apply',
    challengeType: 'round-to-nearest',
    difficulty: 'core',
    points: 120,
    timeLimit: 35,
    context: {
      originStation: 'Skillizee Junction',
      destinationStation: 'CCIS Junction',
      narrative: 'The freight scale shows 384,912 kg of bricks and scaffolding. Round to the nearest ten thousand to engage cargo straps.',
    },
    prompt: 'Round 384,912 to the nearest ten thousand.',
    number: 384912,
    numberString: '384,912',
    highlightDigitIndex: 2,
    options: [
      { value: 380000, label: '380,000' },
      { value: 390000, label: '390,000' },
    ],
    correctAnswer: 380000,
    validation: (a) => Number(a) === 380000,
    hints: [
      'The thousands digit is 4 (< 5). Keep the 8 ten-thousands → 380,000.',
    ],
    explanation: 'In 384,912, thousands digit 4 < 5 rounds DOWN to 380,000. Cargo straps locked!',
  },
  {
    id: 'q9-materials-3',
    stationIndex: 0,
    stepIndex: 3,
    stepType: 'materials',
    stepTitle: 'STEP 3: SECURE MATERIALS',
    stepDescription: 'Identify the digit place value in the heavy construction tally.',
    stepIcon: '🪜',
    missionTitle: 'TIMBER PLANK BATCH TALLY',
    bloomLevel: 'remember',
    challengeType: 'digit-value',
    difficulty: 'core',
    points: 120,
    timeLimit: 35,
    context: {
      originStation: 'Skillizee Junction',
      destinationStation: 'CCIS Junction',
      narrative: 'A shipment of 904,615 timber planks is secured on the wagon. What is the value of digit 4?',
    },
    prompt: 'What is the value of the digit 4 in 904,615?',
    number: 904615,
    numberString: '904,615',
    highlightDigitIndex: 2,
    options: [
      { value: 400, label: '400' },
      { value: 4000, label: '4,000' },
      { value: 40000, label: '40,000' },
    ],
    correctAnswer: 4000,
    validation: (a) => Number(a) === 4000,
    hints: [
      'Digit 4 is in the Thousands place: 4 × 1,000 = 4,000.',
    ],
    explanation: 'In 904,615, digit 4 has a value of 4,000. All construction materials secured!',
  },

  // ── STEP 4: ⚙️ DRIVER RELEASES BRAKES & BUILDS STEAM (Q10..Q12) ──
  {
    id: 'q10-brakes-1',
    stationIndex: 0,
    stepIndex: 4,
    stepType: 'brakes',
    stepTitle: 'STEP 4: DISENGAGE BRAKES',
    stepDescription: 'Round the boiler steam pressure reading to release the mechanical wheel brakes.',
    stepIcon: '⚙️',
    missionTitle: 'PNEUMATIC BRAKE DISENGAGE',
    bloomLevel: 'apply',
    challengeType: 'round-to-nearest',
    difficulty: 'core',
    points: 120,
    timeLimit: 35,
    context: {
      originStation: 'Skillizee Junction',
      destinationStation: 'CCIS Junction',
      narrative: 'The locomotive driver in the cabin is monitoring boiler steam at 596,240 PSI. Round to the nearest ten thousand to disengage wheel calipers.',
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
      'Thousands digit is 6 (≥ 5), which rolls 59 ten-thousands UP to 60 → 600,000.',
    ],
    explanation: '596,240 rounded to the nearest ten thousand is 600,000. Driver disengages the brakes with a hiss of steam!',
  },
  {
    id: 'q11-brakes-2',
    stationIndex: 0,
    stepIndex: 4,
    stepType: 'brakes',
    stepTitle: 'STEP 4: DISENGAGE BRAKES',
    stepDescription: 'Identify the place value of the throttle control readout.',
    stepIcon: '⚙️',
    missionTitle: 'THROTTLE PRESSURE CALIBRATION',
    bloomLevel: 'remember',
    challengeType: 'digit-value',
    difficulty: 'core',
    points: 120,
    timeLimit: 35,
    context: {
      originStation: 'Skillizee Junction',
      destinationStation: 'CCIS Junction',
      narrative: 'The locomotive driver sets the steam throttle sensor at 192,854 Pa. What is the value of digit 9?',
    },
    prompt: 'What is the value of the digit 9 in 192,854?',
    number: 192854,
    numberString: '192,854',
    highlightDigitIndex: 1,
    options: [
      { value: 9000, label: '9,000' },
      { value: 90000, label: '90,000' },
      { value: 900000, label: '900,000' },
    ],
    correctAnswer: 90000,
    validation: (a) => Number(a) === 90000,
    hints: [
      'Digit 9 is in the Ten Thousands place: 9 × 10,000 = 90,000.',
    ],
    explanation: 'In 192,854, digit 9 has a value of 90,000. Boiler reaches peak pressure!',
  },
  {
    id: 'q12-brakes-3',
    stationIndex: 0,
    stepIndex: 4,
    stepType: 'brakes',
    stepTitle: 'STEP 4: DISENGAGE BRAKES',
    stepDescription: 'Round the wheel temperature reading to the nearest thousand.',
    stepIcon: '⚙️',
    missionTitle: 'WHEEL BEARING CLEARANCE',
    bloomLevel: 'apply',
    challengeType: 'round-to-nearest',
    difficulty: 'core',
    points: 130,
    timeLimit: 35,
    context: {
      originStation: 'Skillizee Junction',
      destinationStation: 'CCIS Junction',
      narrative: 'Round 314,780 to the nearest thousand to lubricate the locomotive driving rods.',
    },
    prompt: 'Round 314,780 to the nearest thousand.',
    number: 314780,
    numberString: '314,780',
    highlightDigitIndex: 3,
    options: [
      { value: 314000, label: '314,000' },
      { value: 315000, label: '315,000' },
    ],
    correctAnswer: 315000,
    validation: (a) => Number(a) === 315000,
    hints: [
      'Hundreds digit 7 (≥ 5) rounds 4 thousands UP to 5 → 315,000.',
    ],
    explanation: '314,780 rounds UP to 315,000. Driving rods lubricated and ready for full speed!',
  },

  // ── STEP 5: 🚦 GREEN SIGNAL & 15-SECOND CRUISE TO CCIS JUNCTION (Q13..Q15) ──
  {
    id: 'q13-departure-1',
    stationIndex: 0,
    stepIndex: 5,
    stepType: 'departure',
    stepTitle: 'STEP 5: GREEN SIGNAL & DEPART!',
    stepDescription: 'Validate the master clearance code to turn the signal emerald GREEN and start the 15s cruise!',
    stepIcon: '🚦',
    missionTitle: 'EXPRESS ROUTE CLEARANCE',
    bloomLevel: 'apply',
    challengeType: 'round-to-nearest',
    difficulty: 'challenge',
    points: 150,
    timeLimit: 40,
    context: {
      originStation: 'Skillizee Junction',
      destinationStation: 'CCIS Junction',
      narrative: 'The main departure semaphore signal at Skillizee Junction is locked RED. Round 849,631 km to the nearest hundred thousand to turn the signal emerald GREEN and launch the 15-second journey to CCIS Junction!',
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
      'The ten-thousands digit is 4 (< 5), so round DOWN: keep the 8 → 800,000.',
    ],
    explanation: 'In 849,631, ten-thousands digit 4 < 5 rounds DOWN to 800,000. SIGNAL TURNS GREEN! Whistle blows and train departs for CCIS Junction!',
  },
  {
    id: 'q14-departure-2',
    stationIndex: 0,
    stepIndex: 5,
    stepType: 'departure',
    stepTitle: 'STEP 5: GREEN SIGNAL & DEPART!',
    stepDescription: 'Identify the millions place value in the express journey navigation code.',
    stepIcon: '🚦',
    missionTitle: 'NAVIGATION SYSTEM AUTHORIZATION',
    bloomLevel: 'understand',
    challengeType: 'digit-value',
    difficulty: 'challenge',
    points: 160,
    timeLimit: 40,
    context: {
      originStation: 'Skillizee Junction',
      destinationStation: 'CCIS Junction',
      narrative: 'The track switch computer requires verifying the value of the leading digit in 3,580,240.',
    },
    prompt: 'What is the value of the digit 3 in 3,580,240?',
    number: 3580240,
    numberString: '3,580,240',
    highlightDigitIndex: 0,
    options: [
      { value: 300000, label: '300,000' },
      { value: 3000000, label: '3,000,000' },
      { value: 30000, label: '30,000' },
    ],
    correctAnswer: 3000000,
    validation: (a) => Number(a) === 3000000,
    hints: [
      'Digit 3 is in the Millions place: 3 × 1,000,000 = 3,000,000.',
    ],
    explanation: 'In 3,580,240, digit 3 is in the Millions place (3,000,000). SIGNAL TURNS GREEN!',
  },
  {
    id: 'q15-departure-3',
    stationIndex: 0,
    stepIndex: 5,
    stepType: 'departure',
    stepTitle: 'STEP 5: GREEN SIGNAL & DEPART!',
    stepDescription: 'Round the summit approach distance to turn the semaphore green.',
    stepIcon: '🚦',
    missionTitle: 'CCIS HIGHLAND CLEARANCE',
    bloomLevel: 'apply',
    challengeType: 'round-to-nearest',
    difficulty: 'challenge',
    points: 160,
    timeLimit: 40,
    context: {
      originStation: 'Skillizee Junction',
      destinationStation: 'CCIS Junction',
      narrative: 'Round 975,410 to the nearest ten thousand to clear the final interlocking signal and begin the 15-second scenic ride!',
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
      'Thousands digit 5 (≥ 5) rounds 97 ten-thousands UP to 98 → 980,000.',
    ],
    explanation: '975,410 rounds UP to 980,000. SIGNAL TURNS GREEN! High-graphics 15s train journey to CCIS Junction commences!',
  },
];

// Helper to construct questions list for 5, 10, or 15 questions
export function getChallengeSet(totalQuestions: 5 | 10 | 15): RailwayChallenge[] {
  if (totalQuestions === 5) {
    // 1 question per step
    return [
      ALL_RAILWAY_CHALLENGES[0],  // Step 1: Passengers
      ALL_RAILWAY_CHALLENGES[3],  // Step 2: Vehicles
      ALL_RAILWAY_CHALLENGES[6],  // Step 3: Materials
      ALL_RAILWAY_CHALLENGES[9],  // Step 4: Brakes
      ALL_RAILWAY_CHALLENGES[12], // Step 5: Departure
    ];
  } else if (totalQuestions === 10) {
    // 2 questions per step
    return [
      ALL_RAILWAY_CHALLENGES[0], ALL_RAILWAY_CHALLENGES[1],   // Step 1
      ALL_RAILWAY_CHALLENGES[3], ALL_RAILWAY_CHALLENGES[4],   // Step 2
      ALL_RAILWAY_CHALLENGES[6], ALL_RAILWAY_CHALLENGES[7],   // Step 3
      ALL_RAILWAY_CHALLENGES[9], ALL_RAILWAY_CHALLENGES[10],  // Step 4
      ALL_RAILWAY_CHALLENGES[12], ALL_RAILWAY_CHALLENGES[13], // Step 5
    ];
  } else {
    // 15 questions (3 questions per step)
    return ALL_RAILWAY_CHALLENGES;
  }
}
