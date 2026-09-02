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
