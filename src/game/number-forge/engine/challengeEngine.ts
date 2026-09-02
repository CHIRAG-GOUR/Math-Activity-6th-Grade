import { MathChallenge } from '../types';
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

export function generateSequenceForRounds(roundCount: number = 6): MathChallenge[] {
  return [
    createPlaceValueBuilderChallenge(0),  // Stage 1: Build 638,427
    createExpandedFormChallenge(0),       // Stage 2: 472,306 expanded
    createDigitHuntChallenge(0),          // Stage 3: Digit value hunt
    createRoundingTrackChallenge(0),      // Stage 4: Rounding track
    createTruthOrTrapChallenge(0),        // Stage 5: Truth or trap
    createMasterBlueprintChallenge(0),    // Stage 6: Master Blueprint
  ].slice(0, roundCount);
}

export const generateChallengeSequence = generateSequenceForRounds;
