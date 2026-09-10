// ============================================================
// EQUATION MISSION CONTROL — Dynamic 100+ Question Queue
// ============================================================

import {
  STAGE_1_QUESTIONS,
  STAGE_2_QUESTIONS,
  STAGE_3_QUESTIONS,
  STAGE_4_QUESTIONS,
  STAGE_5_QUESTIONS,
} from './challenges';
import { MissionChallenge, MissionCampaign, StageIndex, MissionStageId } from '../types';

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

  const stageDefs: { id: MissionStageId; idx: StageIndex; pool: typeof STAGE_1_QUESTIONS }[] = [
    { id: 'config', idx: 0, pool: s1Pool },
    { id: 'fuel', idx: 1, pool: s2Pool },
    { id: 'engine', idx: 2, pool: s3Pool },
    { id: 'navigation', idx: 3, pool: s4Pool },
    { id: 'launch', idx: 4, pool: s5Pool },
  ];

  const challenges: MissionChallenge[] = [];
  const maxRounds = 20; // 20 rounds of 5 stages = 100 challenges

  for (let r = 0; r < maxRounds; r++) {
    for (let s = 0; s < 5; s++) {
      const def = stageDefs[s];
      const template = def.pool[r % def.pool.length];
      challenges.push({
        ...template,
        id: `${template.id}-r${r}`,
        stageId: def.id,
        stageIndex: def.idx,
      });
    }
  }

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
    challenges,
  };
}
