import { MathChallenge, BloomLevel } from '../types';
import {
  createDigitHuntChallenge,
  createPlaceValueBuilderChallenge,
  createExpandedFormChallenge,
  createCompareChallenge,
} from './placeValueEngine';
import {
  createRoundingTrackChallenge,
  createRoundingDetectiveChallenge,
  createFindMistakeChallenge,
} from './roundingTrackEngine';
import {
  createTruthOrTrapChallenge,
  createWhichStudentIsRightChallenge,
  createEstimationShopChallenge,
} from './detectionLabEngine';
import { createMasterBlueprintChallenge } from './masterBlueprintEngine';

export function generateChallengeSequence(roundCount: number = 6): MathChallenge[] {
  const fullProgression = [
    // 1. REMEMBER
    (idx: number) => createDigitHuntChallenge(idx),
    // 2. UNDERSTAND
    (idx: number) => createPlaceValueBuilderChallenge(idx),
    (idx: number) => createExpandedFormChallenge(idx),
    // 3. APPLY
    (idx: number) => createCompareChallenge(idx),
    (idx: number) => createRoundingTrackChallenge(idx),
    (idx: number) => createEstimationShopChallenge(idx),
    // 4. ANALYZE
    (idx: number) => createRoundingDetectiveChallenge(idx),
    (idx: number) => createFindMistakeChallenge(idx),
    // 5. EVALUATE
    (idx: number) => createTruthOrTrapChallenge(idx),
    (idx: number) => createWhichStudentIsRightChallenge(idx),
    // 6. CREATE
    (idx: number) => createMasterBlueprintChallenge(idx),
  ];

  if (roundCount <= 6) {
    // Curated 6-round Bloom's journey
    return [
      createDigitHuntChallenge(0),          // Remember
      createPlaceValueBuilderChallenge(0),  // Understand
      createRoundingTrackChallenge(0),      // Apply
      createRoundingDetectiveChallenge(0),  // Analyze
      createTruthOrTrapChallenge(0),        // Evaluate
      createMasterBlueprintChallenge(0),    // Create
    ];
  }

  // Extended journey
  const challenges: MathChallenge[] = [];
  for (let i = 0; i < roundCount; i++) {
    const generator = fullProgression[i % fullProgression.length];
    challenges.push(generator(i));
  }
  return challenges;
}
