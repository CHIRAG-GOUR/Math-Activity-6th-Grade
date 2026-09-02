// ============================================================
// THE GREAT NUMBER RAILWAY — Challenge Data
// Grade 6 Place Value & Rounding challenges
// ============================================================

import { RailwayChallenge } from '../types';

export const RAILWAY_CHALLENGES: RailwayChallenge[] = [
  // ── MISSION 1: THE EXPRESS ROUTE (Remember/Apply) ──
  {
    id: 'mission-01',
    missionTitle: 'THE EXPRESS ROUTE',
    bloomLevel: 'apply',
    challengeType: 'round-to-nearest',
    difficulty: 'foundation',
    points: 100,
    timeLimit: 45,
    context: {
      cargoType: 'passengers',
      originStation: 'central',
      destinationOptions: ['north-terminal', 'east-depot'],
      narrative: 'A passenger train is waiting at Central Station. The distance to North Terminal has been reported as 384,726 km. The railway routing system requires all distances rounded to the nearest thousand.',
    },
    prompt: 'Round 384,726 to the nearest thousand.',
    number: 384726,
    numberString: '384,726',
    options: [
      { value: 384000, label: '384,000' },
      { value: 385000, label: '385,000' },
    ],
    correctAnswer: 385000,
    validation: (a) => Number(a) === 385000,
    hints: [
      'Look at the hundreds digit. What is it?',
      'The hundreds digit is 7. Since 7 ≥ 5, we round up.',
    ],
    highlightDigitIndex: 3, // the '7' in 384,726
    railwayAction: {
      switchId: 'junction-1',
      routeChoice: 'A',
      signalId: 'signal-north',
      destinationStation: 'north-terminal',
      trackSegmentId: 'track-central-north',
    },
    explanation: 'In 384,726, the thousands digit is 4. The hundreds digit is 7. Since 7 ≥ 5, we round the thousands digit up from 4 to 5, giving 385,000.',
  },

  // ── MISSION 2: CARGO DISPATCH (Remember) ──
  {
    id: 'mission-02',
    missionTitle: 'CARGO DISPATCH',
    bloomLevel: 'remember',
    challengeType: 'digit-value',
    difficulty: 'foundation',
    points: 80,
    timeLimit: 40,
    context: {
      cargoType: 'cargo',
      originStation: 'central',
      destinationOptions: ['east-depot', 'south-yard'],
      narrative: 'A cargo shipment of 638,427 units needs to be sorted. The depot system requires the value of the digit 8 to route the cargo correctly.',
    },
    prompt: 'What is the value of the digit 8 in 638,427?',
    number: 638427,
    numberString: '638,427',
    options: [
      { value: 80, label: '80' },
      { value: 800, label: '800' },
      { value: 8000, label: '8,000' },
      { value: 80000, label: '80,000' },
    ],
    correctAnswer: 8000,
    validation: (a) => Number(a) === 8000,
    hints: [
      'Count the place positions from the right: ones, tens, hundreds, thousands...',
      'The 8 is in the thousands place. 8 × 1,000 = 8,000.',
    ],
    highlightDigitIndex: 2, // the '8' in 638,427
    railwayAction: {
      switchId: 'junction-1',
      routeChoice: 'B',
      signalId: 'signal-east',
      destinationStation: 'east-depot',
      trackSegmentId: 'track-central-east',
    },
    explanation: 'In 638,427, the 8 is in the thousands position. Its value is 8 × 1,000 = 8,000.',
  },

  // ── MISSION 3: PASSENGER COUNT (Apply) ──
  {
    id: 'mission-03',
    missionTitle: 'PASSENGER COUNT',
    bloomLevel: 'apply',
    challengeType: 'round-to-nearest',
    difficulty: 'core',
    points: 120,
    timeLimit: 45,
    context: {
      cargoType: 'passengers',
      originStation: 'north-terminal',
      destinationOptions: ['central', 'south-yard'],
      narrative: 'The railway has transported 48,721 passengers this month. The annual report requires this figure rounded to the nearest hundred.',
    },
    prompt: 'Round 48,721 to the nearest hundred.',
    number: 48721,
    numberString: '48,721',
    options: [
      { value: 48700, label: '48,700' },
      { value: 48800, label: '48,800' },
    ],
    correctAnswer: 48700,
    validation: (a) => Number(a) === 48700,
    hints: [
      'Look at the tens digit. What is it?',
      'The tens digit is 2. Since 2 < 5, we round down.',
    ],
    highlightDigitIndex: 3,
    railwayAction: {
      switchId: 'junction-1',
      routeChoice: 'A',
      signalId: 'signal-south',
      destinationStation: 'south-yard',
      trackSegmentId: 'track-north-south',
    },
    explanation: 'In 48,721, the hundreds digit is 7. The tens digit is 2. Since 2 < 5, we keep the hundreds digit as 7, giving 48,700.',
  },

  // ── MISSION 4: CONSTRUCTION SUPPLY (Apply) ──
  {
    id: 'mission-04',
    missionTitle: 'CONSTRUCTION SUPPLY',
    bloomLevel: 'apply',
    challengeType: 'round-to-nearest',
    difficulty: 'core',
    points: 120,
    timeLimit: 45,
    context: {
      cargoType: 'construction',
      originStation: 'east-depot',
      destinationOptions: ['central', 'north-terminal'],
      narrative: 'A construction train is carrying 583,219 units of building material. The supply manifest needs the quantity rounded to the nearest ten thousand.',
    },
    prompt: 'Round 583,219 to the nearest ten thousand.',
    number: 583219,
    numberString: '583,219',
    options: [
      { value: 580000, label: '580,000' },
      { value: 590000, label: '590,000' },
    ],
    correctAnswer: 580000,
    validation: (a) => Number(a) === 580000,
    hints: [
      'Identify the ten-thousands digit. Then look at the digit to its right.',
      'The ten-thousands digit is 8, and the thousands digit is 3. Since 3 < 5, round down.',
    ],
    railwayAction: {
      switchId: 'junction-1',
      routeChoice: 'B',
      signalId: 'signal-north',
      destinationStation: 'north-terminal',
      trackSegmentId: 'track-east-north',
    },
    explanation: 'In 583,219, the ten-thousands digit is 8. The thousands digit is 3. Since 3 < 5, we round down to 580,000.',
  },

  // ── MISSION 5: ERROR ON THE LINE (Analyze) ──
  {
    id: 'mission-05',
    missionTitle: 'ERROR ON THE LINE',
    bloomLevel: 'analyze',
    challengeType: 'error-analysis',
    difficulty: 'challenge',
    points: 150,
    timeLimit: 60,
    context: {
      cargoType: 'messages',
      originStation: 'central',
      destinationOptions: ['south-yard', 'east-depot'],
      narrative: 'A trainee operator rounded 467,382 to the nearest thousand and got 467,000. The signal system detected a potential error. Verify the routing code.',
    },
    prompt: 'A trainee says 467,382 rounded to the nearest thousand is 467,000. Is this correct?',
    number: 467382,
    numberString: '467,382',
    options: [
      { value: 'correct', label: 'Correct — 467,000' },
      { value: 'incorrect', label: 'Incorrect — should be 467,000' },
    ],
    correctAnswer: 'correct',
    validation: (a) => String(a) === 'correct',
    hints: [
      'Look at the hundreds digit in 467,382.',
      'The hundreds digit is 3. Since 3 < 5, we round down. The trainee was correct!',
    ],
    railwayAction: {
      switchId: 'junction-1',
      routeChoice: 'A',
      signalId: 'signal-south',
      destinationStation: 'south-yard',
      trackSegmentId: 'track-central-south',
    },
    explanation: 'In 467,382, the thousands digit is 7. The hundreds digit is 3. Since 3 < 5, we round down. 467,000 is correct. The trainee got it right!',
  },

  // ── MISSION 6: THE MOUNTAIN EXPRESS (Apply) ──
  {
    id: 'mission-06',
    missionTitle: 'THE MOUNTAIN EXPRESS',
    bloomLevel: 'apply',
    challengeType: 'round-to-nearest',
    difficulty: 'core',
    points: 120,
    timeLimit: 45,
    context: {
      cargoType: 'passengers',
      originStation: 'south-yard',
      destinationOptions: ['north-terminal', 'central'],
      narrative: 'The mountain express route covers 725,450 metres through the highlands. The scheduling system requires this distance rounded to the nearest ten thousand.',
    },
    prompt: 'Round 725,450 to the nearest ten thousand.',
    number: 725450,
    numberString: '725,450',
    options: [
      { value: 720000, label: '720,000' },
      { value: 730000, label: '730,000' },
    ],
    correctAnswer: 730000,
    validation: (a) => Number(a) === 730000,
    hints: [
      'The ten-thousands digit is 2. Look at the thousands digit.',
      'The thousands digit is 5. Since 5 ≥ 5, we round up from 2 to 3.',
    ],
    railwayAction: {
      switchId: 'junction-1',
      routeChoice: 'A',
      signalId: 'signal-north',
      destinationStation: 'north-terminal',
      trackSegmentId: 'track-south-north',
    },
    explanation: 'In 725,450, the ten-thousands digit is 2. The thousands digit is 5. Since 5 ≥ 5, we round up to 730,000.',
  },

  // ── MISSION 7: GRAND FINALE — RESTORE THE NETWORK (Evaluate) ──
  {
    id: 'mission-07',
    missionTitle: 'THE GRAND EXPRESS',
    bloomLevel: 'evaluate',
    challengeType: 'round-to-nearest',
    difficulty: 'challenge',
    points: 200,
    timeLimit: 60,
    context: {
      cargoType: 'passengers',
      originStation: 'central',
      destinationOptions: ['north-terminal', 'east-depot', 'south-yard'],
      narrative: 'The Grand Express is ready for its inaugural journey! The total railway network spans 892,561 km. The historical records need this distance rounded to the nearest hundred thousand for the commemorative plaque.',
    },
    prompt: 'Round 892,561 to the nearest hundred thousand.',
    number: 892561,
    numberString: '892,561',
    options: [
      { value: 800000, label: '800,000' },
      { value: 900000, label: '900,000' },
    ],
    correctAnswer: 900000,
    validation: (a) => Number(a) === 900000,
    hints: [
      'The hundred-thousands digit is 8. Look at the ten-thousands digit.',
      'The ten-thousands digit is 9. Since 9 ≥ 5, we round up from 8 to 9.',
    ],
    railwayAction: {
      switchId: 'junction-1',
      routeChoice: 'A',
      signalId: 'signal-north',
      destinationStation: 'north-terminal',
      trackSegmentId: 'track-grand-express',
    },
    explanation: 'In 892,561, the hundred-thousands digit is 8. The ten-thousands digit is 9. Since 9 ≥ 5, we round up to 900,000.',
  },
];
