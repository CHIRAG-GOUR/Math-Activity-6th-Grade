// ============================================================
// EQUATION MISSION CONTROL — Dynamic Non-Repeating Question Selector
// ============================================================

import {
  STAGE_1_QUESTIONS,
  STAGE_2_QUESTIONS,
  STAGE_3_QUESTIONS,
  STAGE_4_QUESTIONS,
  STAGE_5_QUESTIONS,
} from './challenges';
import { MissionChallenge, MissionCampaign } from '../types';

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function generateDynamicCampaign(campaignIndex: number = 0): MissionCampaign {
  const s1Pool = shuffle(STAGE_1_QUESTIONS);
  const s2Pool = shuffle(STAGE_2_QUESTIONS);
  const s3Pool = shuffle(STAGE_3_QUESTIONS);
  const s4Pool = shuffle(STAGE_4_QUESTIONS);
  const s5Pool = shuffle(STAGE_5_QUESTIONS);

  const q1: MissionChallenge = { ...s1Pool[0], stageId: 'config', stageIndex: 0 };
  const q2: MissionChallenge = { ...s2Pool[0], stageId: 'fuel', stageIndex: 1 };
  const q3: MissionChallenge = { ...s3Pool[0], stageId: 'engine', stageIndex: 2 };
  const q4: MissionChallenge = { ...s4Pool[0], stageId: 'navigation', stageIndex: 3 };
  const q5: MissionChallenge = { ...s5Pool[0], stageId: 'launch', stageIndex: 4 };

  const DESTINATIONS = [
    'International Space Station LEO Orbit (400 km)',
    'Lunar Gateway Artemis Orbit (384,400 km)',
    'Mars Orbital Insertion Arc (54.6M km)',
    'Jupiter Europa Deep Space Probe Orbit',
  ];

  return {
    index: campaignIndex,
    id: `dyn-campaign-${Date.now()}`,
    title: `PROJECT ARES MISSION ${campaignIndex + 1}`,
    destinationOrbit: DESTINATIONS[campaignIndex % DESTINATIONS.length],
    challenges: [q1, q2, q3, q4, q5],
  };
}
