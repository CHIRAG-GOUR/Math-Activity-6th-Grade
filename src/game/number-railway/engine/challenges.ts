// ============================================================
// THE GREAT NUMBER RAILWAY — Challenge Engine (Rounds)
// Grade 6: Place Value & Rounding, mapped to Bloom's Taxonomy.
//
// 5 ROUNDS x 5 QUESTIONS. Every round follows the progression:
//   Q1  Remember / Understand  - identify the place a digit occupies
//   Q2  Understand             - interpret a digit's value
//   Q3  Apply                  - construct / interpret a number
//   Q4  Apply / Analyze        - rounding in a realistic railway context
//   Q5  Analyze / Evaluate     - ROUTE AUTHORIZATION reasoning (the climax)
//
// Each round restores one more part of the network:
//   R1 Central Station . R2 Cargo Depot . R3 Mountain Station
//   R4 Bridge Route . R5 Grand Express Terminus
// ============================================================

import { RailwayChallenge, RailwayRound, StationInfo } from '../types';

// Network stations that light up, one per completed round.
export const NETWORK_STATIONS: StationInfo[] = [
  { id: 'central-station', name: 'Central Station', subtitle: 'The heart of the network', position: [3.0, 0, -9], color: '#0ea5e9', roundIndex: 0 },
  { id: 'cargo-depot', name: 'Cargo Depot', subtitle: 'Freight & materials yard', position: [-4.2, 0, -15], color: '#f59e0b', roundIndex: 1 },
  { id: 'mountain-station', name: 'Mountain Station', subtitle: 'The high pass halt', position: [4.6, 0, -24], color: '#10b981', roundIndex: 2 },
  { id: 'bridge-route', name: 'Bridge Route', subtitle: 'The great trestle crossing', position: [-3.6, 0, -30], color: '#8b5cf6', roundIndex: 3 },
  { id: 'grand-express', name: 'Grand Express Terminus', subtitle: 'CCIS Junction highlands', position: [0, 0, -40], color: '#e11d48', roundIndex: 4 },
];

type Opt = { value: number | string; label: string };

interface Build {
  id: string;
  bloomLevel: RailwayChallenge['bloomLevel'];
  challengeType: RailwayChallenge['challengeType'];
  difficulty: RailwayChallenge['difficulty'];
  points: number;
  timeLimit?: number;
  routeAuth?: boolean;
  missionTitle: string;
  prompt: string;
  numberString?: string;
  number?: number;
  highlightDigitIndex?: number;
  options: Opt[];
  correct: number | string;
  hints: string[];
  explanation: string;
  railwayEffect: string;
}

const c = (b: Build): RailwayChallenge => ({
  id: b.id,
  bloomLevel: b.bloomLevel,
  challengeType: b.challengeType,
  difficulty: b.difficulty,
  points: b.points,
  timeLimit: b.timeLimit ?? 35,
  isRouteAuthorization: b.routeAuth ?? false,
  missionTitle: b.missionTitle,
  prompt: b.prompt,
  number: b.number,
  numberString: b.numberString,
  highlightDigitIndex: b.highlightDigitIndex,
  options: b.options,
  correctAnswer: b.correct,
  validation: (a) => String(a) === String(b.correct),
  hints: b.hints,
  explanation: b.explanation,
  railwayEffect: b.railwayEffect,
});

export const ROUNDS: RailwayRound[] = [];

// ───────────────────────── ROUND 1 ─────────────────────────
ROUNDS.push({
  index: 0,
  id: 'round-central',
  name: 'CENTRAL STATION EXPRESS',
  subtitle: 'Open the heart of the network',
  destinationStationId: 'central-station',
  questions: [
    c({
      id: 'r1q1', bloomLevel: 'understand', challengeType: 'digit-value', difficulty: 'foundation', points: 100,
      missionTitle: 'PLACE IDENTIFICATION',
      prompt: 'In 384,726, which place does the digit 8 occupy?',
      numberString: '384,726', number: 384726, highlightDigitIndex: 1,
      options: [
        { value: 'thousands', label: 'Thousands' },
        { value: 'ten-thousands', label: 'Ten Thousands' },
        { value: 'hundred-thousands', label: 'Hundred Thousands' },
      ],
      correct: 'ten-thousands',
      hints: ['Count places from the right: ones, tens, hundreds, thousands, ten-thousands.', 'The 8 sits just left of the comma with 4 after it — the Ten Thousands place.'],
      explanation: 'In 384,726 the digit 8 is in the Ten Thousands place.',
      railwayEffect: 'Cargo system comes online.',
    }),
    c({
      id: 'r1q2', bloomLevel: 'understand', challengeType: 'digit-value', difficulty: 'foundation', points: 100,
      missionTitle: 'DIGIT VALUE MANIFEST',
      prompt: 'What is the value of the digit 8 in 384,726?',
      numberString: '384,726', number: 384726, highlightDigitIndex: 1,
      options: [
        { value: 8000, label: '8,000' },
        { value: 80000, label: '80,000' },
        { value: 800000, label: '800,000' },
      ],
      correct: 80000,
      hints: ['The 8 is in the Ten Thousands place.', '8 x 10,000 = 80,000.'],
      explanation: 'The 8 is in the Ten Thousands place, so its value is 8 x 10,000 = 80,000.',
      railwayEffect: 'Train manifest validated.',
    }),
    c({
      id: 'r1q3', bloomLevel: 'apply', challengeType: 'number-construction', difficulty: 'core', points: 120,
      missionTitle: 'ROUTE CODE ASSEMBLY',
      prompt: 'Build the number: 300,000 + 80,000 + 4,000 + 700 + 20 + 6',
      options: [
        { value: 380426, label: '380,426' },
        { value: 384726, label: '384,726' },
        { value: 384276, label: '384,276' },
      ],
      correct: 384726,
      hints: ['Line up each part by place value.', '3 hundred-thousands, 8 ten-thousands, 4 thousands, 7 hundreds, 2 tens, 6 ones.'],
      explanation: '300,000 + 80,000 + 4,000 + 700 + 20 + 6 = 384,726.',
      railwayEffect: 'Train receives its route code.',
    }),
    c({
      id: 'r1q4', bloomLevel: 'apply', challengeType: 'round-to-nearest', difficulty: 'core', points: 130,
      missionTitle: 'DISTANCE BOARD',
      prompt: 'The route is 384,726 km. Round it to the nearest thousand for the distance board.',
      numberString: '384,726', number: 384726, highlightDigitIndex: 3,
      options: [
        { value: 384000, label: '384,000 km' },
        { value: 385000, label: '385,000 km' },
        { value: 390000, label: '390,000 km' },
      ],
      correct: 385000,
      hints: ['Look at the hundreds digit: 7.', 'Since 7 >= 5, round the thousands 4 UP to 5 → 385,000.'],
      explanation: 'The hundreds digit 7 is >= 5, so 384,726 rounds UP to 385,000.',
      railwayEffect: 'Central route becomes available.',
    }),
    c({
      id: 'r1q5', bloomLevel: 'evaluate', challengeType: 'estimation', difficulty: 'challenge', points: 160, timeLimit: 45, routeAuth: true,
      missionTitle: 'ROUTE AUTHORIZATION',
      prompt: 'The board shows the route as about 385,000 km (rounded to the nearest thousand). Which real distance could it have been?',
      options: [
        { value: 384509, label: '384,509 km' },
        { value: 385640, label: '385,640 km' },
        { value: 386200, label: '386,200 km' },
      ],
      correct: 384509,
      hints: ['A number rounds to 385,000 (nearest thousand) only if it is from 384,500 to 385,499.', 'Check each: 385,640 → 386,000, 386,200 → 386,000. Only 384,509 fits.'],
      explanation: 'To round to 385,000 at the nearest thousand, the real value must be 384,500–385,499. Only 384,509 qualifies.',
      railwayEffect: 'Final route to Central Station is authorized.',
    }),
  ],
});

// ───────────────────────── ROUND 2 ─────────────────────────
ROUNDS.push({
  index: 1,
  id: 'round-cargo',
  name: 'THE CARGO DEPOT RUN',
  subtitle: 'Restore the freight yard',
  destinationStationId: 'cargo-depot',
  questions: [
    c({
      id: 'r2q1', bloomLevel: 'understand', challengeType: 'digit-value', difficulty: 'foundation', points: 100,
      missionTitle: 'PLACE IDENTIFICATION',
      prompt: 'In 692,140, which place does the digit 6 occupy?',
      numberString: '692,140', number: 692140, highlightDigitIndex: 0,
      options: [
        { value: 'ten-thousands', label: 'Ten Thousands' },
        { value: 'hundred-thousands', label: 'Hundred Thousands' },
        { value: 'millions', label: 'Millions' },
      ],
      correct: 'hundred-thousands',
      hints: ['It is the leading digit of a six-digit number.', 'The largest place in a six-digit number is Hundred Thousands.'],
      explanation: 'In 692,140 the leading digit 6 is in the Hundred Thousands place.',
      railwayEffect: 'Depot gate unlocks.',
    }),
    c({
      id: 'r2q2', bloomLevel: 'understand', challengeType: 'digit-value', difficulty: 'core', points: 110,
      missionTitle: 'DIGIT VALUE MANIFEST',
      prompt: 'What is the value of the digit 6 in 274,610?',
      numberString: '274,610', number: 274610, highlightDigitIndex: 3,
      options: [
        { value: 60, label: '60' },
        { value: 600, label: '600' },
        { value: 6000, label: '6,000' },
      ],
      correct: 600,
      hints: ['The 6 sits in the Hundreds place (three digits from the right).', '6 x 100 = 600.'],
      explanation: 'The 6 is in the Hundreds place, so its value is 6 x 100 = 600.',
      railwayEffect: 'Freight manifest checked.',
    }),
    c({
      id: 'r2q3', bloomLevel: 'apply', challengeType: 'number-construction', difficulty: 'core', points: 120,
      missionTitle: 'MANIFEST ASSEMBLY',
      prompt: 'Build the number: 600,000 + 90,000 + 2,000 + 100 + 40',
      options: [
        { value: 692140, label: '692,140' },
        { value: 692410, label: '692,410' },
        { value: 690240, label: '690,240' },
      ],
      correct: 692140,
      hints: ['There are no ones, so the units digit is 0.', '6 HTh, 9 TTh, 2 Th, 1 H, 4 T, 0 ones.'],
      explanation: '600,000 + 90,000 + 2,000 + 100 + 40 = 692,140.',
      railwayEffect: 'Cargo car receives its code.',
    }),
    c({
      id: 'r2q4', bloomLevel: 'apply', challengeType: 'round-to-nearest', difficulty: 'core', points: 130,
      missionTitle: 'WEIGH-BRIDGE READING',
      prompt: 'A cargo load weighs 47,681 kg. Round it to the nearest hundred for the weigh-bridge board.',
      numberString: '47,681', number: 47681, highlightDigitIndex: 3,
      options: [
        { value: 47600, label: '47,600 kg' },
        { value: 47700, label: '47,700 kg' },
        { value: 48000, label: '48,000 kg' },
      ],
      correct: 47700,
      hints: ['Look at the tens digit: 8.', 'Since 8 >= 5, round the hundreds 6 UP to 7 → 47,700.'],
      explanation: 'The tens digit 8 is >= 5, so 47,681 rounds UP to 47,700.',
      railwayEffect: 'Cargo Depot route becomes available.',
    }),
    c({
      id: 'r2q5', bloomLevel: 'evaluate', challengeType: 'estimation', difficulty: 'challenge', points: 160, timeLimit: 45, routeAuth: true,
      missionTitle: 'ROUTE AUTHORIZATION',
      prompt: 'The depot lists a load as about 50,000 kg (rounded to the nearest ten thousand). Which real weight is possible?',
      options: [
        { value: 44300, label: '44,300 kg' },
        { value: 48900, label: '48,900 kg' },
        { value: 55600, label: '55,600 kg' },
      ],
      correct: 48900,
      hints: ['A load rounds to 50,000 (nearest ten thousand) only if it is 45,000–54,999.', '44,300 → 40,000, 55,600 → 60,000. Only 48,900 fits.'],
      explanation: 'To round to 50,000 at the nearest ten thousand, the real weight must be 45,000–54,999. Only 48,900 qualifies.',
      railwayEffect: 'Freight route to Cargo Depot is authorized.',
    }),
  ],
});

// ───────────────────────── ROUND 3 ─────────────────────────
ROUNDS.push({
  index: 2,
  id: 'round-mountain',
  name: 'THE MOUNTAIN EXPRESS',
  subtitle: 'Climb to the high pass',
  destinationStationId: 'mountain-station',
  questions: [
    c({
      id: 'r3q1', bloomLevel: 'understand', challengeType: 'digit-value', difficulty: 'foundation', points: 100,
      missionTitle: 'PLACE IDENTIFICATION',
      prompt: 'In 852,309, which place does the digit 5 occupy?',
      numberString: '852,309', number: 852309, highlightDigitIndex: 1,
      options: [
        { value: 'thousands', label: 'Thousands' },
        { value: 'ten-thousands', label: 'Ten Thousands' },
        { value: 'hundred-thousands', label: 'Hundred Thousands' },
      ],
      correct: 'ten-thousands',
      hints: ['8 is hundred-thousands; the next digit right is ten-thousands.', 'The 5 is in the Ten Thousands place.'],
      explanation: 'In 852,309 the digit 5 is in the Ten Thousands place.',
      railwayEffect: 'Mountain signal box wakes up.',
    }),
    c({
      id: 'r3q2', bloomLevel: 'understand', challengeType: 'digit-value', difficulty: 'core', points: 110,
      missionTitle: 'DIGIT VALUE MANIFEST',
      prompt: 'What is the value of the digit 5 in 852,309?',
      numberString: '852,309', number: 852309, highlightDigitIndex: 1,
      options: [
        { value: 5000, label: '5,000' },
        { value: 50000, label: '50,000' },
        { value: 500000, label: '500,000' },
      ],
      correct: 50000,
      hints: ['The 5 is in the Ten Thousands place.', '5 x 10,000 = 50,000.'],
      explanation: 'The 5 is in the Ten Thousands place, so its value is 50,000.',
      railwayEffect: 'Summit manifest validated.',
    }),
    c({
      id: 'r3q3', bloomLevel: 'apply', challengeType: 'number-construction', difficulty: 'core', points: 120,
      missionTitle: 'SUMMIT CODE ASSEMBLY',
      prompt: 'Build the number: 800,000 + 50,000 + 2,000 + 300 + 9',
      options: [
        { value: 852309, label: '852,309' },
        { value: 852039, label: '852,039' },
        { value: 850239, label: '850,239' },
      ],
      correct: 852309,
      hints: ['No tens part, so the tens digit is 0.', '8 HTh, 5 TTh, 2 Th, 3 H, 0 T, 9 ones.'],
      explanation: '800,000 + 50,000 + 2,000 + 300 + 9 = 852,309.',
      railwayEffect: 'Express receives its summit code.',
    }),
    c({
      id: 'r3q4', bloomLevel: 'analyze', challengeType: 'round-to-nearest', difficulty: 'challenge', points: 140,
      missionTitle: 'ALTITUDE BOARD',
      prompt: 'The summit route is 852,309 m. Round it to the nearest ten thousand for the altitude board.',
      numberString: '852,309', number: 852309, highlightDigitIndex: 1,
      options: [
        { value: 850000, label: '850,000 m' },
        { value: 852000, label: '852,000 m' },
        { value: 860000, label: '860,000 m' },
      ],
      correct: 850000,
      hints: ['Look at the thousands digit: 2.', 'Since 2 < 5, round DOWN — keep 85 ten-thousands → 850,000.'],
      explanation: 'The thousands digit 2 is < 5, so 852,309 rounds DOWN to 850,000.',
      railwayEffect: 'Mountain route becomes available.',
    }),
    c({
      id: 'r3q5', bloomLevel: 'evaluate', challengeType: 'estimation', difficulty: 'challenge', points: 170, timeLimit: 45, routeAuth: true,
      missionTitle: 'ROUTE AUTHORIZATION',
      prompt: 'Two boards round the real distance to the nearest ten thousand. The real distance is 854,120 m. Which board is correct?',
      options: [
        { value: 850000, label: 'Route A — 850,000 m' },
        { value: 900000, label: 'Route B — 900,000 m' },
        { value: 855000, label: 'Route C — 855,000 m' },
      ],
      correct: 850000,
      hints: ['Round 854,120 to the nearest ten thousand: thousands digit is 4.', '4 < 5, so it rounds DOWN to 850,000 — Route A.'],
      explanation: '854,120 has thousands digit 4 (< 5), so it rounds to 850,000. Route A is authorized.',
      railwayEffect: 'Final climb to Mountain Station is authorized.',
    }),
  ],
});

// ───────────────────────── ROUND 4 ─────────────────────────
ROUNDS.push({
  index: 3,
  id: 'round-bridge',
  name: 'THE GREAT BRIDGE CROSSING',
  subtitle: 'Open the great trestle',
  destinationStationId: 'bridge-route',
  questions: [
    c({
      id: 'r4q1', bloomLevel: 'understand', challengeType: 'digit-value', difficulty: 'core', points: 110,
      missionTitle: 'PLACE IDENTIFICATION',
      prompt: 'In 3,275,600, which place does the digit 3 occupy?',
      numberString: '3,275,600', number: 3275600, highlightDigitIndex: 0,
      options: [
        { value: 'hundred-thousands', label: 'Hundred Thousands' },
        { value: 'millions', label: 'Millions' },
        { value: 'ten-thousands', label: 'Ten Thousands' },
      ],
      correct: 'millions',
      hints: ['This is a seven-digit number.', 'The leading digit of a seven-digit number is in the Millions place.'],
      explanation: 'In 3,275,600 the leading digit 3 is in the Millions place.',
      railwayEffect: 'Bridge control tower activates.',
    }),
    c({
      id: 'r4q2', bloomLevel: 'understand', challengeType: 'digit-value', difficulty: 'core', points: 120,
      missionTitle: 'DIGIT VALUE MANIFEST',
      prompt: 'What is the value of the digit 3 in 3,275,600?',
      numberString: '3,275,600', number: 3275600, highlightDigitIndex: 0,
      options: [
        { value: 300000, label: '300,000' },
        { value: 3000000, label: '3,000,000' },
        { value: 30000, label: '30,000' },
      ],
      correct: 3000000,
      hints: ['The 3 is in the Millions place.', '3 x 1,000,000 = 3,000,000.'],
      explanation: 'The 3 is in the Millions place, so its value is 3,000,000.',
      railwayEffect: 'Bridge manifest validated.',
    }),
    c({
      id: 'r4q3', bloomLevel: 'apply', challengeType: 'number-construction', difficulty: 'challenge', points: 130,
      missionTitle: 'CROSSING CODE ASSEMBLY',
      prompt: 'Build the number: 3,000,000 + 200,000 + 70,000 + 5,000 + 600',
      options: [
        { value: 3275600, label: '3,275,600' },
        { value: 3257600, label: '3,257,600' },
        { value: 3275060, label: '3,275,060' },
      ],
      correct: 3275600,
      hints: ['No tens or ones, so both are 0.', '3 M, 2 HTh, 7 TTh, 5 Th, 6 H, 0 T, 0 ones.'],
      explanation: '3,000,000 + 200,000 + 70,000 + 5,000 + 600 = 3,275,600.',
      railwayEffect: 'Bridge span receives its code.',
    }),
    c({
      id: 'r4q4', bloomLevel: 'analyze', challengeType: 'round-to-nearest', difficulty: 'challenge', points: 150,
      missionTitle: 'LOAD-LIMIT BOARD',
      prompt: 'The bridge load board shows 3,275,600 kg. Round it to the nearest hundred thousand.',
      numberString: '3,275,600', number: 3275600, highlightDigitIndex: 1,
      options: [
        { value: 3200000, label: '3,200,000 kg' },
        { value: 3300000, label: '3,300,000 kg' },
        { value: 3280000, label: '3,280,000 kg' },
      ],
      correct: 3300000,
      hints: ['Look at the ten-thousands digit: 7.', 'Since 7 >= 5, round the hundred-thousands 2 UP to 3 → 3,300,000.'],
      explanation: 'The ten-thousands digit 7 is >= 5, so 3,275,600 rounds UP to 3,300,000.',
      railwayEffect: 'Bridge route becomes available.',
    }),
    c({
      id: 'r4q5', bloomLevel: 'evaluate', challengeType: 'estimation', difficulty: 'challenge', points: 180, timeLimit: 50, routeAuth: true,
      missionTitle: 'ROUTE AUTHORIZATION',
      prompt: 'The bridge limit board reads about 3,300,000 kg (nearest hundred thousand). Which train weight is SAFE — i.e. actually rounds to 3,300,000?',
      options: [
        { value: 3248000, label: '3,248,000 kg' },
        { value: 3312500, label: '3,312,500 kg' },
        { value: 3355000, label: '3,355,000 kg' },
      ],
      correct: 3312500,
      hints: ['A weight rounds to 3,300,000 only if it is 3,250,000–3,349,999.', '3,248,000 → 3,200,000, 3,355,000 → 3,400,000. Only 3,312,500 fits.'],
      explanation: 'To round to 3,300,000 at the nearest hundred thousand, the weight must be 3,250,000–3,349,999. Only 3,312,500 qualifies.',
      railwayEffect: 'Crossing over the great bridge is authorized.',
    }),
  ],
});

// ───────────────────────── ROUND 5 ─────────────────────────
ROUNDS.push({
  index: 4,
  id: 'round-grand',
  name: 'THE GRAND EXPRESS FINALE',
  subtitle: 'Complete the network',
  destinationStationId: 'grand-express',
  questions: [
    c({
      id: 'r5q1', bloomLevel: 'understand', challengeType: 'digit-value', difficulty: 'core', points: 110,
      missionTitle: 'PLACE IDENTIFICATION',
      prompt: 'In 7,904,300, which place does the digit 7 occupy?',
      numberString: '7,904,300', number: 7904300, highlightDigitIndex: 0,
      options: [
        { value: 'hundred-thousands', label: 'Hundred Thousands' },
        { value: 'millions', label: 'Millions' },
        { value: 'ten-thousands', label: 'Ten Thousands' },
      ],
      correct: 'millions',
      hints: ['Seven digits means the leading digit is in the Millions place.'],
      explanation: 'In 7,904,300 the leading digit 7 is in the Millions place.',
      railwayEffect: 'Grand Express control online.',
    }),
    c({
      id: 'r5q2', bloomLevel: 'understand', challengeType: 'digit-value', difficulty: 'core', points: 120,
      missionTitle: 'DIGIT VALUE MANIFEST',
      prompt: 'What is the value of the digit 9 in 7,904,300?',
      numberString: '7,904,300', number: 7904300, highlightDigitIndex: 1,
      options: [
        { value: 90000, label: '90,000' },
        { value: 900000, label: '900,000' },
        { value: 9000000, label: '9,000,000' },
      ],
      correct: 900000,
      hints: ['After the millions digit, the next place is Hundred Thousands.', '9 x 100,000 = 900,000.'],
      explanation: 'The 9 is in the Hundred Thousands place, so its value is 900,000.',
      railwayEffect: 'Flagship manifest validated.',
    }),
    c({
      id: 'r5q3', bloomLevel: 'apply', challengeType: 'number-construction', difficulty: 'challenge', points: 140,
      missionTitle: 'FLAGSHIP CODE ASSEMBLY',
      prompt: 'Build the number: 7,000,000 + 900,000 + 4,000 + 300',
      options: [
        { value: 7904300, label: '7,904,300' },
        { value: 7940300, label: '7,940,300' },
        { value: 7904030, label: '7,904,030' },
      ],
      correct: 7904300,
      hints: ['There are no ten-thousands, tens or ones — each is 0.', '7 M, 9 HTh, 0 TTh, 4 Th, 3 H, 0 T, 0 ones.'],
      explanation: '7,000,000 + 900,000 + 4,000 + 300 = 7,904,300.',
      railwayEffect: 'Grand Express receives its code.',
    }),
    c({
      id: 'r5q4', bloomLevel: 'analyze', challengeType: 'round-to-nearest', difficulty: 'challenge', points: 160,
      missionTitle: 'FLAGSHIP DISTANCE BOARD',
      prompt: 'The flagship distance is 7,904,300 km. Round it to the nearest hundred thousand.',
      numberString: '7,904,300', number: 7904300, highlightDigitIndex: 1,
      options: [
        { value: 7900000, label: '7,900,000 km' },
        { value: 8000000, label: '8,000,000 km' },
        { value: 7910000, label: '7,910,000 km' },
      ],
      correct: 7900000,
      hints: ['Look at the ten-thousands digit: 0.', 'Since 0 < 5, round DOWN — keep 9 hundred-thousands → 7,900,000.'],
      explanation: 'The ten-thousands digit 0 is < 5, so 7,904,300 rounds DOWN to 7,900,000.',
      railwayEffect: 'Grand Express route becomes available.',
    }),
    c({
      id: 'r5q5', bloomLevel: 'create', challengeType: 'estimation', difficulty: 'challenge', points: 200, timeLimit: 55, routeAuth: true,
      missionTitle: 'ROUTE AUTHORIZATION',
      prompt: 'The Grand Express board reads about 7,900,000 km (nearest hundred thousand). Which real distance matches the board?',
      options: [
        { value: 7848000, label: '7,848,000 km' },
        { value: 7902450, label: '7,902,450 km' },
        { value: 7961000, label: '7,961,000 km' },
      ],
      correct: 7902450,
      hints: ['A distance rounds to 7,900,000 only if it is 7,850,000–7,949,999.', '7,848,000 → 7,800,000, 7,961,000 → 8,000,000. Only 7,902,450 fits.'],
      explanation: 'To round to 7,900,000 at the nearest hundred thousand, the distance must be 7,850,000–7,949,999. Only 7,902,450 qualifies.',
      railwayEffect: 'The Grand Express to CCIS Junction is authorized — network complete!',
    }),
  ],
});

// ── Reasoning-based tie-break questions (one per round, first-correct wins) ──
export const TIE_BREAKERS: RailwayChallenge[] = [
  c({
    id: 'tb1', bloomLevel: 'evaluate', challengeType: 'estimation', difficulty: 'challenge', points: 150, timeLimit: 40, routeAuth: true,
    missionTitle: 'GOLDEN CLEARANCE TIE-BREAK',
    prompt: 'Which number could round to 450,000 when rounded to the nearest 10,000?',
    options: [
      { value: 443500, label: '443,500' },
      { value: 451200, label: '451,200' },
      { value: 456000, label: '456,000' },
    ],
    correct: 451200,
    hints: ['It must land in 445,000–454,999.'],
    explanation: 'Only 451,200 lies in 445,000–454,999, so only it rounds to 450,000. First team to answer wins the route!',
    railwayEffect: 'Tie broken — the route is won!',
  }),
  c({
    id: 'tb2', bloomLevel: 'evaluate', challengeType: 'estimation', difficulty: 'challenge', points: 150, timeLimit: 40, routeAuth: true,
    missionTitle: 'GOLDEN CLEARANCE TIE-BREAK',
    prompt: 'Which number rounds to 600,000 when rounded to the nearest 100,000?',
    options: [
      { value: 549000, label: '549,000' },
      { value: 641000, label: '641,000' },
      { value: 662000, label: '662,000' },
    ],
    correct: 641000,
    hints: ['It must land in 550,000–649,999.'],
    explanation: 'Only 641,000 lies in 550,000–649,999, so only it rounds to 600,000. First correct team wins!',
    railwayEffect: 'Tie broken — the route is won!',
  }),
  c({
    id: 'tb3', bloomLevel: 'evaluate', challengeType: 'estimation', difficulty: 'challenge', points: 150, timeLimit: 40, routeAuth: true,
    missionTitle: 'GOLDEN CLEARANCE TIE-BREAK',
    prompt: 'Which number rounds to 80,000 when rounded to the nearest 1,000?',
    options: [
      { value: 78900, label: '78,900' },
      { value: 79650, label: '79,650' },
      { value: 80540, label: '80,540' },
    ],
    correct: 79650,
    hints: ['It must land in 79,500–80,499.'],
    explanation: '78,900 → 79,000 and 80,540 → 81,000. Only 79,650 lies in 79,500–80,499, so it rounds to 80,000. First correct team wins!',
    railwayEffect: 'Tie broken — the route is won!',
  }),
  c({
    id: 'tb4', bloomLevel: 'evaluate', challengeType: 'estimation', difficulty: 'challenge', points: 150, timeLimit: 40, routeAuth: true,
    missionTitle: 'GOLDEN CLEARANCE TIE-BREAK',
    prompt: 'Which number rounds to 1,200,000 when rounded to the nearest 100,000?',
    options: [
      { value: 1148000, label: '1,148,000' },
      { value: 1234000, label: '1,234,000' },
      { value: 1261000, label: '1,261,000' },
    ],
    correct: 1234000,
    hints: ['It must land in 1,150,000–1,249,999.'],
    explanation: 'Only 1,234,000 lies in 1,150,000–1,249,999, so only it rounds to 1,200,000. First correct team wins!',
    railwayEffect: 'Tie broken — the route is won!',
  }),
  c({
    id: 'tb5', bloomLevel: 'evaluate', challengeType: 'estimation', difficulty: 'challenge', points: 150, timeLimit: 40, routeAuth: true,
    missionTitle: 'GOLDEN CLEARANCE TIE-BREAK',
    prompt: 'Which number rounds to 5,000,000 when rounded to the nearest 1,000,000?',
    options: [
      { value: 4380000, label: '4,380,000' },
      { value: 5420000, label: '5,420,000' },
      { value: 5610000, label: '5,610,000' },
    ],
    correct: 5420000,
    hints: ['It must land in 4,500,000–5,499,999.'],
    explanation: 'Only 5,420,000 lies in 4,500,000–5,499,999, so only it rounds to 5,000,000. First correct team wins!',
    railwayEffect: 'Tie broken — the route is won!',
  }),
];

export function getTieBreaker(roundIndex: number): RailwayChallenge {
  return TIE_BREAKERS[roundIndex % TIE_BREAKERS.length];
}

// ============================================================
// PROCEDURAL ROUND GENERATOR
// Produces valid, correctly-scored Q1–Q5 rounds so a match can run
// 5, 10, 15 or more rounds. Curated rounds are used first; any beyond
// that are generated deterministically from the round index.
// ============================================================

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const PLACE_KEYS = ['ones', 'tens', 'hundreds', 'thousands', 'ten-thousands', 'hundred-thousands', 'millions'];
const PLACE_LABELS: Record<string, string> = {
  ones: 'Ones', tens: 'Tens', hundreds: 'Hundreds', thousands: 'Thousands',
  'ten-thousands': 'Ten Thousands', 'hundred-thousands': 'Hundred Thousands', millions: 'Millions',
};
const fmt = (n: number) => n.toLocaleString('en-US');
const roundToPlace = (n: number, placeIdx: number) => {
  const unit = Math.pow(10, placeIdx);
  return Math.floor(n / unit + 0.5) * unit;
};
const GEN_ROUND_NAMES = [
  'THE VALLEY LIMITED', 'THE COASTAL RUNNER', 'THE HIGHLAND FLYER', 'THE IRON RIDGE LINE',
  'THE SUNRISE EXPRESS', 'THE COPPER CANYON RUN', 'THE NORTHERN STAR', 'THE RIVERSIDE LOCAL',
  'THE GOLDEN ARROW', 'THE FRONTIER SPECIAL',
];

function generateRound(index: number): RailwayRound {
  const rng = mulberry32((index + 7) * 2654435761);
  const digitCount = index % 3 === 2 ? 7 : 6; // 6 or 7 digit numbers
  const digits: number[] = [];
  for (let i = 0; i < digitCount; i++) {
    digits.push(i === 0 ? 1 + Math.floor(rng() * 9) : Math.floor(rng() * 10));
  }
  const N = Number(digits.join(''));
  const highPlace = digitCount - 1; // place index of leading digit

  // Q1 — identify the place of a chosen (non-zero) digit
  let p1 = highPlace - 1 - Math.floor(rng() * Math.max(1, digitCount - 3));
  if (p1 < 2) p1 = highPlace;
  const p1Key = PLACE_KEYS[p1];
  const q1Wrong = PLACE_KEYS.filter((k) => k !== p1Key && PLACE_KEYS.indexOf(k) <= highPlace + 1 && PLACE_KEYS.indexOf(k) >= 1);
  const q1Opts = [p1Key, q1Wrong[0], q1Wrong[q1Wrong.length - 1]];

  // Q2 — value of a (different, non-zero) digit
  let p2 = highPlace;
  for (let tries = 0; tries < 8; tries++) {
    const cand = 1 + Math.floor(rng() * highPlace);
    if (digits[digitCount - 1 - cand] !== 0) { p2 = cand; break; }
  }
  const d2 = digits[digitCount - 1 - p2];
  const val2 = d2 * Math.pow(10, p2);
  const q2Opts = [val2, val2 * 10, Math.max(1, Math.floor(val2 / 10))];

  // Q3 — expanded form
  const parts = digits.map((d, i) => d * Math.pow(10, digitCount - 1 - i)).filter((v) => v > 0);
  const expanded = parts.map(fmt).join(' + ');
  const swap = (a: number, b: number) => { const arr = [...digits]; const t = arr[a]; arr[a] = arr[b]; arr[b] = t; return Number(arr.join('')); };
  let wrongA = swap(digitCount - 2, digitCount - 3);
  let wrongB = swap(1, 2);
  if (wrongA === N) wrongA = N + Math.pow(10, 2);
  if (wrongB === N || wrongB === wrongA) wrongB = N - Math.pow(10, 1);

  // Q4 — round to a nearest place
  const r = Math.min(highPlace - 1, 3 + Math.floor(rng() * 2)); // thousands..hundred-thousands
  const unit = Math.pow(10, r);
  const rounded = roundToPlace(N, r);
  const q4Opts = [rounded, rounded + unit, Math.max(0, rounded - unit)];

  // Q5 — route authorization: which candidate rounds to `rounded` at unit `r`
  const jitter = () => Math.floor(rng() * unit * 0.35);
  const correct5 = Math.max(1, rounded + jitter() - Math.floor(unit * 0.15));
  const low5 = Math.max(1, rounded - unit + jitter());
  const high5 = rounded + unit + jitter() - Math.floor(unit * 0.15);

  const shuffle = <T,>(arr: T[]): T[] => arr.map((v) => [rng(), v] as [number, T]).sort((a, b) => a[0] - b[0]).map((x) => x[1]);
  const q1Options = shuffle(q1Opts).map((k) => ({ value: k, label: PLACE_LABELS[k] }));
  const q2Options = shuffle(q2Opts).map((v) => ({ value: v, label: fmt(v) }));
  const q3Options = shuffle([N, wrongA, wrongB]).map((v) => ({ value: v, label: fmt(v) }));
  const q4Options = shuffle(q4Opts).map((v) => ({ value: v, label: fmt(v) }));
  const q5Options = shuffle([correct5, low5, high5]).map((v) => ({ value: v, label: fmt(v) }));

  const nStr = fmt(N);
  const stationIdx = index % NETWORK_STATIONS.length;
  return {
    index,
    id: `gen-round-${index}`,
    name: GEN_ROUND_NAMES[index % GEN_ROUND_NAMES.length],
    subtitle: 'Route the express to its terminal',
    destinationStationId: NETWORK_STATIONS[stationIdx].id,
    questions: [
      c({ id: `g${index}q1`, bloomLevel: 'understand', challengeType: 'digit-value', difficulty: 'foundation', points: 100,
        missionTitle: 'PLACE IDENTIFICATION',
        prompt: `In ${nStr}, which place does the digit ${digits[digitCount - 1 - p1]} occupy?`,
        numberString: nStr, number: N, highlightDigitIndex: digitCount - 1 - p1,
        options: q1Options, correct: p1Key,
        hints: [`Count places from the right up to the digit ${digits[digitCount - 1 - p1]}.`],
        explanation: `In ${nStr} that digit is in the ${PLACE_LABELS[p1Key]} place.`,
        railwayEffect: 'Route board comes online.' }),
      c({ id: `g${index}q2`, bloomLevel: 'understand', challengeType: 'digit-value', difficulty: 'core', points: 110,
        missionTitle: 'DIGIT VALUE MANIFEST',
        prompt: `What is the value of the digit ${d2} in ${nStr}?`,
        numberString: nStr, number: N, highlightDigitIndex: digitCount - 1 - p2,
        options: q2Options, correct: val2,
        hints: [`The ${d2} is in the ${PLACE_LABELS[PLACE_KEYS[p2]]} place.`, `${d2} x ${fmt(Math.pow(10, p2))} = ${fmt(val2)}.`],
        explanation: `The ${d2} is in the ${PLACE_LABELS[PLACE_KEYS[p2]]} place, so its value is ${fmt(val2)}.`,
        railwayEffect: 'Manifest validated.' }),
      c({ id: `g${index}q3`, bloomLevel: 'apply', challengeType: 'number-construction', difficulty: 'core', points: 120,
        missionTitle: 'ROUTE CODE ASSEMBLY',
        prompt: `Build the number: ${expanded}`,
        options: q3Options, correct: N,
        hints: ['Line up each part by place value.'],
        explanation: `${expanded} = ${nStr}.`,
        railwayEffect: 'Train receives its route code.' }),
      c({ id: `g${index}q4`, bloomLevel: 'apply', challengeType: 'round-to-nearest', difficulty: 'core', points: 130,
        missionTitle: 'DISTANCE BOARD',
        prompt: `Round ${nStr} to the nearest ${PLACE_LABELS[PLACE_KEYS[r]].toLowerCase()}.`,
        numberString: nStr, number: N, highlightDigitIndex: digitCount - 1 - r,
        options: q4Options, correct: rounded,
        hints: [`Look at the digit just to the right of the ${PLACE_LABELS[PLACE_KEYS[r]].toLowerCase()} place.`, 'If it is 5 or more, round up; otherwise round down.'],
        explanation: `${nStr} rounded to the nearest ${PLACE_LABELS[PLACE_KEYS[r]].toLowerCase()} is ${fmt(rounded)}.`,
        railwayEffect: 'Route becomes available.' }),
      c({ id: `g${index}q5`, bloomLevel: 'evaluate', challengeType: 'estimation', difficulty: 'challenge', points: 160, timeLimit: 45, routeAuth: true,
        missionTitle: 'ROUTE AUTHORIZATION',
        prompt: `The board reads about ${fmt(rounded)} (rounded to the nearest ${PLACE_LABELS[PLACE_KEYS[r]].toLowerCase()}). Which real distance matches the board?`,
        options: q5Options, correct: correct5,
        hints: [`It must round to ${fmt(rounded)} at the nearest ${PLACE_LABELS[PLACE_KEYS[r]].toLowerCase()}.`],
        explanation: `Only ${fmt(correct5)} rounds to ${fmt(rounded)} at the nearest ${PLACE_LABELS[PLACE_KEYS[r]].toLowerCase()}.`,
        railwayEffect: 'Final route is authorized.' }),
    ],
  };
}

export function buildRounds(total: number): RailwayRound[] {
  const out: RailwayRound[] = [];
  for (let i = 0; i < total; i++) {
    if (i < ROUNDS.length) out.push({ ...ROUNDS[i], index: i });
    else out.push(generateRound(i));
  }
  return out;
}
