// ============================================================
// SKILLIZEE ARCADE — 13 ACTIVITIES & MATHEMATICS TOPICS REGISTRY
// Canonical activity metadata, math curriculum topics, and aliases
// for Excel import mapping, topic validation, and unified arcade orchestration.
// Core principle: 1 ACTIVITY <===> 1 SPECIFIC MATHEMATICS TOPIC
// ============================================================

import { ActivityDefinition } from '@/types/questionBank';

export const ACTIVITIES_REGISTRY: ActivityDefinition[] = [
  {
    id: 'math-escape-vault',
    number: '01',
    name: 'Math Escape Vault',
    topicId: 'place-value-decimals',
    topic: 'Place Value & Decimals',
    shortTopic: 'Place Value & Decimals',
    grade: 'Grade 6',
    route: '/math-vault',
    badgeBg: '#fef3c7',
    badgeText: '#92400e',
    accentColor: '#1d4ed8',
    aliases: [
      'math escape vault',
      'math vault',
      'place value & decimals',
      'place value',
      'decimals & place value',
      'mental math heist',
      'vault',
      'cab 01',
      'cab #01',
      'activity 1',
      'activity 01',
      '1',
    ],
    topicAliases: ['place value', 'place value & decimals', 'decimals & place value', 'whole numbers and decimals', 'number systems'],
  },
  {
    id: 'number-railway',
    number: '02',
    name: 'The Great Number Railway',
    topicId: 'operations-rounding',
    topic: 'Operations & Rounding',
    shortTopic: 'Operations & Rounding',
    grade: 'Grade 6',
    route: '/number-railway',
    badgeBg: '#e0f2fe',
    badgeText: '#0369a1',
    accentColor: '#0284c7',
    aliases: [
      'the great number railway',
      'number railway',
      'railway',
      'operations & rounding',
      'operations',
      'rounding',
      'place value & operations',
      'cab 02',
      'cab #02',
      'activity 2',
      'activity 02',
      '2',
    ],
    topicAliases: ['operations & rounding', 'operations', 'rounding', 'estimation', 'order of operations'],
  },
  {
    id: 'carnival-of-chance',
    number: '03',
    name: 'Carnival of Chance',
    topicId: 'probability',
    topic: 'Probability',
    shortTopic: 'Probability',
    grade: 'Grade 6',
    route: '/carnival-of-chance',
    badgeBg: '#fee2e2',
    badgeText: '#991b1b',
    accentColor: '#dc2626',
    aliases: [
      'carnival of chance',
      'carnival',
      'probability',
      'chance',
      'probability arena',
      'the great carnival of chance',
      'cab 03',
      'cab #03',
      'activity 3',
      'activity 03',
      '3',
    ],
    topicAliases: ['probability', 'chance', 'theoretical probability', 'experimental probability', 'outcomes'],
  },
  {
    id: 'blueprint-blitz',
    number: '04',
    name: 'Blueprint Blitz',
    topicId: 'shapes-area-volume',
    topic: 'Shapes, Area & Volume',
    shortTopic: 'Shapes, Area & Volume',
    grade: 'Grade 6',
    route: '/blueprint-blitz',
    badgeBg: '#e0f2fe',
    badgeText: '#0369a1',
    accentColor: '#0369a1',
    aliases: [
      'blueprint blitz',
      'blueprint',
      'shapes, area & volume',
      'shapes area & volume',
      'area and volume',
      'area & volume',
      'geometry',
      '3d construction',
      'cab 04',
      'cab #04',
      'activity 4',
      'activity 04',
      '4',
    ],
    topicAliases: ['shapes, area & volume', 'shapes', 'area', 'volume', 'surface area', '2d shapes', '3d shapes', 'geometry'],
  },
  {
    id: 'equation-mission-control',
    number: '05',
    name: 'Equation Mission Control',
    topicId: 'expressions-equations',
    topic: 'Expressions & Equations',
    shortTopic: 'Expressions & Equations',
    grade: 'Grade 6',
    route: '/equation-mission-control',
    badgeBg: '#dbeafe',
    badgeText: '#1e40af',
    accentColor: '#1e3a8a',
    aliases: [
      'equation mission control',
      'equations',
      'expressions & equations',
      'expressions and equations',
      'algebra',
      'formulae',
      'mission control',
      'space launch',
      'cab 05',
      'cab #05',
      'activity 5',
      'activity 05',
      '5',
    ],
    topicAliases: ['expressions & equations', 'algebra', 'equations', 'linear equations', 'algebraic expressions', 'variables'],
  },
  {
    id: 'pattern-racers',
    number: '06',
    name: 'Pattern Racers',
    topicId: 'sequences-functions',
    topic: 'Sequences & Functions',
    shortTopic: 'Sequences & Functions',
    grade: 'Grade 6',
    route: '/pattern-racers',
    badgeBg: '#ffedd5',
    badgeText: '#9a3412',
    accentColor: '#ea580c',
    aliases: [
      'pattern racers',
      'patterns',
      'sequences & functions',
      'sequences and functions',
      'sequences',
      'functions',
      'grand prix',
      'cab 06',
      'cab #06',
      'activity 6',
      'activity 06',
      '6',
    ],
    topicAliases: ['sequences & functions', 'sequences', 'patterns', 'linear sequences', 'nth term', 'function machines'],
  },
  {
    id: 'decimal-delivery',
    number: '07',
    name: 'Decimal Delivery Network',
    topicId: 'decimals',
    topic: 'Decimals',
    shortTopic: 'Decimals',
    grade: 'Grade 6',
    route: '/decimal-delivery',
    badgeBg: '#e0e7ff',
    badgeText: '#312e81',
    accentColor: '#4f46e5',
    aliases: [
      'decimal delivery',
      'decimal delivery network',
      'decimals',
      'decimal operations',
      'logistics',
      'cab 07',
      'cab #07',
      'activity 7',
      'activity 07',
      '7',
    ],
    topicAliases: ['decimals', 'decimal operations', 'multiplying decimals', 'dividing decimals', 'decimal word problems'],
  },
  {
    id: 'solar-forge',
    number: '08',
    name: 'The Solar Forge',
    topicId: 'angles-constructions',
    topic: 'Angles, Protractor & Constructions',
    shortTopic: 'Angles & Constructions',
    grade: 'Grade 6',
    route: '/solar-forge',
    badgeBg: '#fef3c7',
    badgeText: '#78350f',
    accentColor: '#d97706',
    aliases: [
      'the solar forge',
      'solar forge',
      'angles, protractor & constructions',
      'angles & constructions',
      'angles and constructions',
      'angles',
      'protractor',
      'constructions',
      'cab 08',
      'cab #08',
      'activity 8',
      'activity 08',
      '8',
    ],
    topicAliases: ['angles', 'protractor', 'constructions', 'angles & constructions', 'angle properties', 'measuring angles'],
  },
  {
    id: 'chocolate-factory',
    number: '09',
    name: 'The Chocolate Factory',
    topicId: 'fractions',
    topic: 'Fractions',
    shortTopic: 'Fractions',
    grade: 'Grade 6',
    route: '/chocolate-factory',
    badgeBg: '#fdf0d5',
    badgeText: '#7c3f12',
    accentColor: '#7c3f12',
    aliases: [
      'the chocolate factory',
      'chocolate factory',
      'fractions',
      'fraction operations',
      'mixed numbers',
      'chocolate production',
      'cab 09',
      'cab #09',
      'activity 9',
      'activity 09',
      '9',
    ],
    topicAliases: ['fractions', 'fraction operations', 'mixed numbers', 'improper fractions', 'multiplying fractions', 'dividing fractions'],
  },
  {
    id: 'graphworks',
    number: '10',
    name: 'Graphworks',
    topicId: 'graphs',
    topic: 'Data Handling & Graphs',
    shortTopic: 'Graphs',
    grade: 'Grade 6',
    route: '/graphworks',
    badgeBg: '#e0f2fe',
    badgeText: '#0369a1',
    accentColor: '#0284c7',
    aliases: [
      'graphworks',
      'graph works',
      'data handling & graphs',
      'data handling and graphs',
      'data handling',
      'graphs',
      'bar charts',
      'line graphs',
      'pie charts',
      'data city',
      'cab 10',
      'cab #10',
      'activity 10',
      '10',
    ],
    topicAliases: ['graphs', 'data handling', 'data handling & graphs', 'line graphs', 'bar charts', 'pie charts', 'frequency tables', 'statistics'],
  },
  {
    id: 'percentage-harvest',
    number: '11',
    name: 'Percentage Harvest',
    topicId: 'percentages',
    topic: 'Percentages',
    shortTopic: 'Percentages',
    grade: 'Grade 6',
    route: '/percentage-harvest',
    badgeBg: '#dcfce7',
    badgeText: '#14532d',
    accentColor: '#15803d',
    aliases: [
      'percentage harvest',
      'percentages',
      'percent',
      'percentage duel',
      'smart farm',
      'cab 11',
      'cab #11',
      'activity 11',
      '11',
    ],
    topicAliases: ['percentages', 'percent', 'percentage of amount', 'percentage increase', 'percentage decrease', 'discounts'],
  },
  {
    id: 'park-planner',
    number: '12',
    name: 'Park Planner',
    topicId: 'position-transformation',
    topic: 'Position & Transformation',
    shortTopic: 'Position & Transformation',
    grade: 'Grade 6',
    route: '/park-planner',
    badgeBg: '#d1fae5',
    badgeText: '#065f46',
    accentColor: '#047857',
    aliases: [
      'park planner',
      'position & transformation',
      'position and transformation',
      'coordinates',
      'cartesian coordinates',
      'four-quadrant',
      'transformations',
      'cab 12',
      'cab #12',
      'activity 12',
      '12',
    ],
    topicAliases: ['position & transformation', 'coordinates', 'transformations', 'reflection', 'rotation', 'translation', 'four quadrants'],
  },
  {
    id: 'ratio-rush',
    number: '13',
    name: 'Ratio Rush',
    topicId: 'ratios-proportions',
    topic: 'Ratios, Rates & Proportions',
    shortTopic: 'Ratio & Proportion',
    grade: 'Grade 6',
    route: '/ratio-rush',
    badgeBg: '#fee2e2',
    badgeText: '#991b1b',
    accentColor: '#b91c1c',
    aliases: [
      'ratio rush',
      'ratio rush / movie production',
      'ratio and proportion',
      'ratio & proportion',
      'ratios, rates & proportions',
      'ratios and proportions',
      'ratios',
      'rates',
      'proportions',
      'unit rates',
      'movie production',
      'cab 13',
      'cab #13',
      'activity 13',
      '13',
    ],
    topicAliases: ['ratio', 'ratios', 'rates', 'proportions', 'ratio & proportion', 'ratios, rates & proportions', 'unit rates', 'scaling'],
  },
];

/**
 * Resolve any freeform string (activity name, topic, number, slug, or alias)
 * to a canonical ActivityDefinition object.
 */
export function resolveActivity(input: string): ActivityDefinition | null {
  if (!input || typeof input !== 'string') return null;
  const clean = input.trim().toLowerCase().replace(/['"]/g, '');

  for (const act of ACTIVITIES_REGISTRY) {
    if (act.id.toLowerCase() === clean) return act;
    if (act.name.toLowerCase() === clean) return act;
    if (act.topicId.toLowerCase() === clean) return act;
    if (act.number === clean || `#${act.number}` === clean) return act;
    if (act.topic.toLowerCase() === clean) return act;
    if (act.shortTopic.toLowerCase() === clean) return act;
    if (act.aliases.some((alias) => alias.toLowerCase() === clean)) return act;
  }

  // Fuzzy partial match
  for (const act of ACTIVITIES_REGISTRY) {
    if (clean.includes(act.name.toLowerCase()) || act.name.toLowerCase().includes(clean)) return act;
    if (clean.includes(act.topic.toLowerCase()) || act.topic.toLowerCase().includes(clean)) return act;
    if (clean.includes(act.shortTopic.toLowerCase()) || act.shortTopic.toLowerCase().includes(clean)) return act;
    for (const alias of act.aliases) {
      if (clean.includes(alias) || alias.includes(clean)) return act;
    }
  }

  return null;
}

export function getActivityById(activityId: string): ActivityDefinition | null {
  return ACTIVITIES_REGISTRY.find((a) => a.id === activityId) || null;
}

export function getActivityByTopicId(topicId: string): ActivityDefinition | null {
  return ACTIVITIES_REGISTRY.find((a) => a.topicId === topicId) || null;
}

/**
 * Get all unique math curriculum topics for dedicated topic filter dropdowns
 */
export function getAllMathTopics(): { topicId: string; topicName: string; shortTopic: string; activityId: string; activityName: string }[] {
  return ACTIVITIES_REGISTRY.map((act) => ({
    topicId: act.topicId,
    topicName: act.topic,
    shortTopic: act.shortTopic,
    activityId: act.id,
    activityName: act.name,
  }));
}

/**
 * Validates if an activity and topic match according to canonical curriculum mappings.
 */
export function validateActivityTopicPair(
  activityInput: string,
  topicInput?: string
): { isValid: boolean; matchedActivity: ActivityDefinition | null; isMismatch: boolean; expectedTopic?: string } {
  const matched = resolveActivity(activityInput);
  if (!matched) {
    return { isValid: false, matchedActivity: null, isMismatch: false };
  }

  if (!topicInput || !topicInput.trim()) {
    // If no topic is provided, default to the canonical topic of the activity
    return { isValid: true, matchedActivity: matched, isMismatch: false };
  }

  const cleanTopic = topicInput.trim().toLowerCase();
  const canonicalTopic = matched.topic.toLowerCase();
  const shortTopic = matched.shortTopic.toLowerCase();
  const topicId = matched.topicId.toLowerCase();

  const isMatch =
    cleanTopic === canonicalTopic ||
    cleanTopic === shortTopic ||
    cleanTopic === topicId ||
    matched.topicAliases.some((alias) => cleanTopic.includes(alias) || alias.includes(cleanTopic));

  if (!isMatch) {
    return {
      isValid: false,
      matchedActivity: matched,
      isMismatch: true,
      expectedTopic: matched.topic,
    };
  }

  return { isValid: true, matchedActivity: matched, isMismatch: false };
}
