// ============================================================
// GRAPHWORKS — 100+ QUESTION ENGINE
// Grade 6 graph questions across all districts & graph types
// ============================================================

import type { MissionQuestion, CityDistrict, GraphType, RoundPhase, DataPoint, GraphAxis } from '../store/graphworksStore';

// ── QUESTION TEMPLATES ──
// Each template generates a family of questions with randomizable data

interface QuestionTemplate {
  district: CityDistrict;
  graphType: GraphType;
  phase: RoundPhase;
  difficulty: number;
  titleTemplate: string;
  instructionTemplate: string;
  unit: string;
  xLabels: string[];
  xTitle: string;
  yTitle: string;
  yRange: [number, number];
  yStep: number;
  generateValues: () => number[];
  interpretationQ?: string;
  interpretationAFn?: (values: number[]) => string;
  createConditions?: string[];
}

// ── UTILITY FUNCTIONS ──
function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function maxIndex(values: number[]): number {
  return values.indexOf(Math.max(...values));
}

function minIndex(values: number[]): number {
  return values.indexOf(Math.min(...values));
}

// ── WEATHER STATION QUESTIONS ──
const weatherQuestions: QuestionTemplate[] = [
  // ROUND 1: READ
  {
    district: 'weather', graphType: 'line', phase: 'read', difficulty: 1,
    titleTemplate: 'Read the Temperature Chart',
    instructionTemplate: 'The weather station recorded temperatures throughout the day. Read the graph and identify all values.',
    unit: '°C',
    xLabels: ['6 AM', '9 AM', '12 PM', '3 PM', '6 PM'],
    xTitle: 'Time of Day', yTitle: 'Temperature (°C)',
    yRange: [0, 40], yStep: 5,
    generateValues: () => [randInt(8, 14), randInt(15, 22), randInt(24, 32), randInt(26, 34), randInt(18, 25)],
    interpretationQ: 'What was the highest temperature recorded?',
    interpretationAFn: (v) => `${Math.max(...v)}°C`,
  },
  {
    district: 'weather', graphType: 'line', phase: 'read', difficulty: 1,
    titleTemplate: 'Morning Temperature Rise',
    instructionTemplate: 'Plot the temperature readings from early morning to noon.',
    unit: '°C',
    xLabels: ['5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM'],
    xTitle: 'Time', yTitle: 'Temperature (°C)',
    yRange: [0, 30], yStep: 5,
    generateValues: () => {
      let t = randInt(5, 10);
      return Array.from({ length: 6 }, () => { t += randInt(1, 4); return t; });
    },
    interpretationQ: 'By how many degrees did the temperature rise from 5 AM to 10 AM?',
    interpretationAFn: (v) => `${v[5] - v[0]}°C`,
  },
  {
    district: 'weather', graphType: 'bar', phase: 'read', difficulty: 1,
    titleTemplate: 'Weekly Rainfall',
    instructionTemplate: 'The rain gauge measured rainfall each day this week. Build the bar graph.',
    unit: 'mm',
    xLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    xTitle: 'Day', yTitle: 'Rainfall (mm)',
    yRange: [0, 50], yStep: 10,
    generateValues: () => [randInt(5, 45), randInt(0, 30), randInt(10, 50), randInt(0, 25), randInt(5, 40)],
    interpretationQ: 'Which day had the most rainfall?',
    interpretationAFn: (v) => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'][maxIndex(v)],
  },
  {
    district: 'weather', graphType: 'bar', phase: 'read', difficulty: 2,
    titleTemplate: 'Wind Speed Records',
    instructionTemplate: 'Record the wind speeds measured at the weather station.',
    unit: 'km/h',
    xLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    xTitle: 'Day', yTitle: 'Wind Speed (km/h)',
    yRange: [0, 60], yStep: 10,
    generateValues: () => Array.from({ length: 6 }, () => randInt(5, 55)),
    interpretationQ: 'What is the difference between the highest and lowest wind speed?',
    interpretationAFn: (v) => `${Math.max(...v) - Math.min(...v)} km/h`,
  },

  // ROUND 2: COMPLETE
  {
    district: 'weather', graphType: 'line', phase: 'complete', difficulty: 2,
    titleTemplate: 'Complete the Temperature Graph',
    instructionTemplate: 'Some temperature readings are missing. Complete the graph using the data table.',
    unit: '°C',
    xLabels: ['8 AM', '10 AM', '12 PM', '2 PM', '4 PM'],
    xTitle: 'Time', yTitle: 'Temperature (°C)',
    yRange: [0, 40], yStep: 5,
    generateValues: () => [randInt(12, 18), randInt(18, 24), randInt(25, 32), randInt(28, 35), randInt(22, 28)],
  },
  {
    district: 'weather', graphType: 'bar', phase: 'complete', difficulty: 2,
    titleTemplate: 'Complete the Rainfall Chart',
    instructionTemplate: 'Two bars are missing from the rainfall chart. Add them using the data provided.',
    unit: 'mm',
    xLabels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    xTitle: 'Week', yTitle: 'Rainfall (mm)',
    yRange: [0, 80], yStep: 10,
    generateValues: () => [randInt(15, 70), randInt(10, 60), randInt(20, 75), randInt(5, 55)],
  },

  // ROUND 3: BUILD
  {
    district: 'weather', graphType: 'line', phase: 'build', difficulty: 3,
    titleTemplate: 'Build a Temperature Graph',
    instructionTemplate: 'The weather station has collected temperature data. Build the complete line graph from scratch.',
    unit: '°C',
    xLabels: ['7 AM', '9 AM', '11 AM', '1 PM', '3 PM', '5 PM'],
    xTitle: 'Time of Day', yTitle: 'Temperature (°C)',
    yRange: [0, 40], yStep: 5,
    generateValues: () => {
      const noon = randInt(28, 36);
      return [
        randInt(10, 16), randInt(16, 22), randInt(22, noon),
        noon, randInt(noon - 5, noon), randInt(18, 26),
      ];
    },
  },
  {
    district: 'weather', graphType: 'bar', phase: 'build', difficulty: 3,
    titleTemplate: 'Monthly Rainfall Bar Graph',
    instructionTemplate: 'Create a bar graph showing monthly rainfall for the last 6 months.',
    unit: 'mm',
    xLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    xTitle: 'Month', yTitle: 'Rainfall (mm)',
    yRange: [0, 100], yStep: 10,
    generateValues: () => Array.from({ length: 6 }, () => randInt(10, 90)),
  },

  // ROUND 4: INTERPRET
  {
    district: 'weather', graphType: 'line', phase: 'interpret', difficulty: 4,
    titleTemplate: 'Interpret the Heat Wave',
    instructionTemplate: 'Build the temperature graph, then answer: Between which two time slots did the temperature increase the most?',
    unit: '°C',
    xLabels: ['6 AM', '8 AM', '10 AM', '12 PM', '2 PM', '4 PM'],
    xTitle: 'Time', yTitle: 'Temperature (°C)',
    yRange: [0, 45], yStep: 5,
    generateValues: () => {
      const vals = [randInt(10, 15), randInt(14, 20), randInt(20, 28), randInt(30, 38), randInt(32, 40), randInt(25, 32)];
      return vals;
    },
    interpretationQ: 'Between which two consecutive readings did the temperature increase the most?',
    interpretationAFn: (v) => {
      let maxDiff = 0, maxIdx = 0;
      for (let i = 1; i < v.length; i++) {
        const diff = v[i] - v[i - 1];
        if (diff > maxDiff) { maxDiff = diff; maxIdx = i - 1; }
      }
      const labels = ['6 AM', '8 AM', '10 AM', '12 PM', '2 PM', '4 PM'];
      return `${labels[maxIdx]} to ${labels[maxIdx + 1]}`;
    },
  },

  // ROUND 5: CREATE
  {
    district: 'weather', graphType: 'line', phase: 'create', difficulty: 5,
    titleTemplate: 'Design a Summer Day',
    instructionTemplate: 'Create a temperature graph where: temperature starts at 12°C, increases for 3 readings, reaches at least 30°C, then decreases.',
    unit: '°C',
    xLabels: ['6 AM', '9 AM', '12 PM', '3 PM', '6 PM'],
    xTitle: 'Time', yTitle: 'Temperature (°C)',
    yRange: [0, 45], yStep: 5,
    generateValues: () => [12, 20, 28, 32, 24],
    createConditions: [
      'Starts at 12°C',
      'Increases for 3 consecutive readings',
      'Reaches at least 30°C',
      'Decreases in the final reading',
    ],
  },
];

// ── TRAFFIC JUNCTION QUESTIONS ──
const trafficQuestions: QuestionTemplate[] = [
  {
    district: 'traffic', graphType: 'bar', phase: 'read', difficulty: 1,
    titleTemplate: 'Vehicles at the Junction',
    instructionTemplate: 'Count the vehicles passing through the traffic junction each hour.',
    unit: ' vehicles',
    xLabels: ['8 AM', '9 AM', '10 AM', '11 AM', '12 PM'],
    xTitle: 'Hour', yTitle: 'Number of Vehicles',
    yRange: [0, 100], yStep: 10,
    generateValues: () => [randInt(20, 50), randInt(60, 90), randInt(40, 70), randInt(30, 55), randInt(45, 80)],
    interpretationQ: 'Which hour had the fewest vehicles?',
    interpretationAFn: (v) => ['8 AM', '9 AM', '10 AM', '11 AM', '12 PM'][minIndex(v)],
  },
  {
    district: 'traffic', graphType: 'bar', phase: 'read', difficulty: 1,
    titleTemplate: 'Pedestrian Crossing Counts',
    instructionTemplate: 'The traffic officer counted pedestrians crossing the road.',
    unit: ' people',
    xLabels: ['Morning', 'Midday', 'Afternoon', 'Evening'],
    xTitle: 'Time Period', yTitle: 'Pedestrians',
    yRange: [0, 120], yStep: 20,
    generateValues: () => [randInt(30, 60), randInt(50, 100), randInt(40, 80), randInt(60, 110)],
    interpretationQ: 'How many more pedestrians crossed in the evening compared to the morning?',
    interpretationAFn: (v) => `${v[3] - v[0]}`,
  },
  {
    district: 'traffic', graphType: 'line', phase: 'build', difficulty: 3,
    titleTemplate: 'Rush Hour Traffic',
    instructionTemplate: 'Plot the number of vehicles per hour during rush hour.',
    unit: ' vehicles',
    xLabels: ['7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM'],
    xTitle: 'Hour', yTitle: 'Number of Vehicles',
    yRange: [0, 120], yStep: 20,
    generateValues: () => [randInt(20, 40), randInt(60, 90), randInt(80, 110), randInt(50, 75), randInt(30, 55), randInt(40, 65)],
  },
  {
    district: 'traffic', graphType: 'bar', phase: 'build', difficulty: 3,
    titleTemplate: 'Bus Routes Comparison',
    instructionTemplate: 'Create a bar graph comparing the number of passengers on different bus routes.',
    unit: ' passengers',
    xLabels: ['Route A', 'Route B', 'Route C', 'Route D', 'Route E'],
    xTitle: 'Bus Route', yTitle: 'Passengers',
    yRange: [0, 80], yStep: 10,
    generateValues: () => Array.from({ length: 5 }, () => randInt(15, 75)),
  },
  {
    district: 'traffic', graphType: 'line', phase: 'interpret', difficulty: 4,
    titleTemplate: 'Accident Analysis',
    instructionTemplate: 'Plot the traffic volume data, then identify the most dangerous hour (highest traffic).',
    unit: ' vehicles',
    xLabels: ['6 AM', '8 AM', '10 AM', '12 PM', '2 PM', '4 PM', '6 PM'],
    xTitle: 'Time', yTitle: 'Vehicles',
    yRange: [0, 150], yStep: 25,
    generateValues: () => [randInt(10, 30), randInt(80, 120), randInt(40, 70), randInt(50, 80), randInt(60, 90), randInt(90, 140), randInt(70, 100)],
    interpretationQ: 'At which time was traffic volume highest?',
    interpretationAFn: (v) => ['6 AM', '8 AM', '10 AM', '12 PM', '2 PM', '4 PM', '6 PM'][maxIndex(v)],
  },
  {
    district: 'traffic', graphType: 'bar', phase: 'complete', difficulty: 2,
    titleTemplate: 'Complete the Traffic Survey',
    instructionTemplate: 'Some vehicle counts are missing. Fill in the missing bars.',
    unit: ' vehicles',
    xLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    xTitle: 'Day', yTitle: 'Vehicles',
    yRange: [0, 100], yStep: 10,
    generateValues: () => Array.from({ length: 5 }, () => randInt(20, 90)),
  },
  {
    district: 'traffic', graphType: 'bar', phase: 'create', difficulty: 5,
    titleTemplate: 'Design a Safe Traffic Plan',
    instructionTemplate: 'Create a traffic volume graph where: rush hour (8-9 AM) has the most vehicles, midday drops below 40, and evening rush returns above 70.',
    unit: ' vehicles',
    xLabels: ['7 AM', '8 AM', '9 AM', '12 PM', '3 PM', '5 PM'],
    xTitle: 'Hour', yTitle: 'Vehicles',
    yRange: [0, 120], yStep: 20,
    generateValues: () => [35, 90, 85, 30, 50, 80],
    createConditions: [
      '8 AM and 9 AM have the most vehicles (above 70)',
      'Midday (12 PM) drops below 40',
      'Evening (5 PM) returns above 70',
    ],
  },
];

// ── WATER PLANT QUESTIONS ──
const waterQuestions: QuestionTemplate[] = [
  {
    district: 'water', graphType: 'bar', phase: 'read', difficulty: 1,
    titleTemplate: 'Daily Water Usage',
    instructionTemplate: 'The water plant measured water usage across the city each day.',
    unit: ' kL',
    xLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    xTitle: 'Day', yTitle: 'Water Usage (kL)',
    yRange: [0, 100], yStep: 10,
    generateValues: () => Array.from({ length: 7 }, () => randInt(30, 90)),
    interpretationQ: 'On which day was water usage the lowest?',
    interpretationAFn: (v) => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][minIndex(v)],
  },
  {
    district: 'water', graphType: 'line', phase: 'read', difficulty: 1,
    titleTemplate: 'Reservoir Water Level',
    instructionTemplate: 'Track the water level in the city reservoir throughout the day.',
    unit: '%',
    xLabels: ['6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM'],
    xTitle: 'Time', yTitle: 'Water Level (%)',
    yRange: [0, 100], yStep: 10,
    generateValues: () => {
      let level = randInt(80, 95);
      return Array.from({ length: 6 }, () => { level -= randInt(3, 12); return Math.max(20, level); });
    },
  },
  {
    district: 'water', graphType: 'line', phase: 'build', difficulty: 3,
    titleTemplate: 'Build the Flow Rate Graph',
    instructionTemplate: 'The water treatment plant recorded flow rates. Build the complete graph.',
    unit: ' L/s',
    xLabels: ['Hour 1', 'Hour 2', 'Hour 3', 'Hour 4', 'Hour 5', 'Hour 6'],
    xTitle: 'Hour', yTitle: 'Flow Rate (L/s)',
    yRange: [0, 60], yStep: 10,
    generateValues: () => Array.from({ length: 6 }, () => randInt(10, 55)),
  },
  {
    district: 'water', graphType: 'bar', phase: 'build', difficulty: 3,
    titleTemplate: 'Neighborhood Water Consumption',
    instructionTemplate: 'Create a bar graph showing water consumption by neighborhood.',
    unit: ' kL',
    xLabels: ['North', 'South', 'East', 'West', 'Central'],
    xTitle: 'Neighborhood', yTitle: 'Water (kL)',
    yRange: [0, 80], yStep: 10,
    generateValues: () => Array.from({ length: 5 }, () => randInt(20, 75)),
  },
  {
    district: 'water', graphType: 'line', phase: 'interpret', difficulty: 4,
    titleTemplate: 'Water Crisis Analysis',
    instructionTemplate: 'Plot the reservoir levels and identify when the city needs emergency water supply (below 25%).',
    unit: '%',
    xLabels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6'],
    xTitle: 'Day', yTitle: 'Reservoir (%)',
    yRange: [0, 100], yStep: 10,
    generateValues: () => [randInt(75, 90), randInt(60, 75), randInt(45, 60), randInt(30, 45), randInt(15, 30), randInt(10, 25)],
    interpretationQ: 'On which day does the reservoir first drop below 30%?',
    interpretationAFn: (v) => {
      const idx = v.findIndex((val) => val < 30);
      return idx >= 0 ? `Day ${idx + 1}` : 'Never';
    },
  },
  {
    district: 'water', graphType: 'bar', phase: 'complete', difficulty: 2,
    titleTemplate: 'Complete the Water Usage Chart',
    instructionTemplate: 'Some readings are missing from the water usage chart. Complete it.',
    unit: ' kL',
    xLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    xTitle: 'Month', yTitle: 'Usage (kL)',
    yRange: [0, 120], yStep: 20,
    generateValues: () => Array.from({ length: 6 }, () => randInt(30, 110)),
  },
  {
    district: 'water', graphType: 'line', phase: 'create', difficulty: 5,
    titleTemplate: 'Design Water Conservation',
    instructionTemplate: 'Create a water level graph where: it starts at 90%, decreases steadily, but never drops below 40% thanks to conservation.',
    unit: '%',
    xLabels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
    xTitle: 'Week', yTitle: 'Water Level (%)',
    yRange: [0, 100], yStep: 10,
    generateValues: () => [90, 78, 65, 52, 42],
    createConditions: [
      'Starts at 90%',
      'Decreases each week',
      'Never drops below 40%',
      'Decrease gets smaller each week (conservation effect)',
    ],
  },
];

// ── POWER STATION QUESTIONS ──
const powerQuestions: QuestionTemplate[] = [
  {
    district: 'power', graphType: 'line', phase: 'read', difficulty: 1,
    titleTemplate: 'City Power Consumption',
    instructionTemplate: 'The power station tracks electricity usage throughout the day.',
    unit: ' MW',
    xLabels: ['6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM'],
    xTitle: 'Time', yTitle: 'Power (MW)',
    yRange: [0, 80], yStep: 10,
    generateValues: () => [randInt(15, 25), randInt(30, 45), randInt(50, 65), randInt(55, 70), randInt(60, 75), randInt(35, 50)],
    interpretationQ: 'At what time is electricity usage highest?',
    interpretationAFn: (v) => ['6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM'][maxIndex(v)],
  },
  {
    district: 'power', graphType: 'bar', phase: 'read', difficulty: 1,
    titleTemplate: 'Energy Sources Comparison',
    instructionTemplate: 'Compare the amount of electricity generated by different sources.',
    unit: ' MW',
    xLabels: ['Solar', 'Wind', 'Hydro', 'Gas', 'Nuclear'],
    xTitle: 'Energy Source', yTitle: 'Power (MW)',
    yRange: [0, 60], yStep: 10,
    generateValues: () => Array.from({ length: 5 }, () => randInt(10, 55)),
    interpretationQ: 'Which energy source generates the most power?',
    interpretationAFn: (v) => ['Solar', 'Wind', 'Hydro', 'Gas', 'Nuclear'][maxIndex(v)],
  },
  {
    district: 'power', graphType: 'line', phase: 'build', difficulty: 3,
    titleTemplate: 'Build the Power Generation Graph',
    instructionTemplate: 'The turbines recorded power output each hour. Build the complete line graph.',
    unit: ' MW',
    xLabels: ['8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM'],
    xTitle: 'Hour', yTitle: 'Generation (MW)',
    yRange: [0, 70], yStep: 10,
    generateValues: () => Array.from({ length: 6 }, () => randInt(15, 65)),
  },
  {
    district: 'power', graphType: 'bar', phase: 'build', difficulty: 3,
    titleTemplate: 'District Power Usage',
    instructionTemplate: 'Create a bar graph comparing power usage across city districts.',
    unit: ' MW',
    xLabels: ['Residential', 'Commercial', 'Industrial', 'Public', 'Transport'],
    xTitle: 'District', yTitle: 'Usage (MW)',
    yRange: [0, 50], yStep: 5,
    generateValues: () => Array.from({ length: 5 }, () => randInt(8, 45)),
  },
  {
    district: 'power', graphType: 'line', phase: 'interpret', difficulty: 4,
    titleTemplate: 'Power Grid Overload Warning',
    instructionTemplate: 'Plot the power data and identify if the grid exceeds safe capacity (60 MW).',
    unit: ' MW',
    xLabels: ['10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM'],
    xTitle: 'Hour', yTitle: 'Power (MW)',
    yRange: [0, 80], yStep: 10,
    generateValues: () => [randInt(35, 50), randInt(45, 58), randInt(55, 70), randInt(60, 75), randInt(50, 65), randInt(40, 55)],
    interpretationQ: 'At how many time slots does power exceed 60 MW?',
    interpretationAFn: (v) => `${v.filter((val) => val > 60).length}`,
  },
  {
    district: 'power', graphType: 'bar', phase: 'complete', difficulty: 2,
    titleTemplate: 'Complete the Energy Report',
    instructionTemplate: 'The monthly energy report has missing data. Fill in the blanks.',
    unit: ' MW',
    xLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    xTitle: 'Month', yTitle: 'Average Power (MW)',
    yRange: [0, 70], yStep: 10,
    generateValues: () => Array.from({ length: 5 }, () => randInt(20, 65)),
  },
  {
    district: 'power', graphType: 'line', phase: 'create', difficulty: 5,
    titleTemplate: 'Design a Green Energy Day',
    instructionTemplate: 'Create a power generation graph that peaks at midday (solar power), stays above 30 MW, and drops in the evening.',
    unit: ' MW',
    xLabels: ['7 AM', '9 AM', '11 AM', '1 PM', '3 PM', '5 PM'],
    xTitle: 'Time', yTitle: 'Solar Power (MW)',
    yRange: [0, 80], yStep: 10,
    generateValues: () => [32, 45, 60, 65, 50, 35],
    createConditions: [
      'Power stays above 30 MW at all times',
      'Peak is between 11 AM and 1 PM',
      'Power increases in the morning',
      'Power decreases in the afternoon',
    ],
  },
];

// ── TRAIN STATION QUESTIONS ──
const trainQuestions: QuestionTemplate[] = [
  {
    district: 'train', graphType: 'line', phase: 'read', difficulty: 1,
    titleTemplate: 'Train Journey Distance',
    instructionTemplate: 'Track the distance a train has traveled over time.',
    unit: ' km',
    xLabels: ['0 min', '10 min', '20 min', '30 min', '40 min', '50 min'],
    xTitle: 'Time', yTitle: 'Distance (km)',
    yRange: [0, 60], yStep: 10,
    generateValues: () => {
      let d = 0;
      return Array.from({ length: 6 }, () => { d += randInt(5, 14); return d; });
    },
    interpretationQ: 'What was the total distance traveled?',
    interpretationAFn: (v) => `${v[v.length - 1]} km`,
  },
  {
    district: 'train', graphType: 'bar', phase: 'read', difficulty: 1,
    titleTemplate: 'Passengers at Each Station',
    instructionTemplate: 'Record the number of passengers boarding at each station.',
    unit: ' passengers',
    xLabels: ['Central', 'Park', 'Market', 'University', 'Airport'],
    xTitle: 'Station', yTitle: 'Passengers',
    yRange: [0, 100], yStep: 10,
    generateValues: () => Array.from({ length: 5 }, () => randInt(15, 90)),
    interpretationQ: 'Which station has the fewest passengers?',
    interpretationAFn: (v) => ['Central', 'Park', 'Market', 'University', 'Airport'][minIndex(v)],
  },
  {
    district: 'train', graphType: 'line', phase: 'build', difficulty: 3,
    titleTemplate: 'Build the Speed Profile',
    instructionTemplate: 'Plot the train speed at different points during its journey.',
    unit: ' km/h',
    xLabels: ['Start', '2 min', '5 min', '10 min', '15 min', '20 min'],
    xTitle: 'Time', yTitle: 'Speed (km/h)',
    yRange: [0, 100], yStep: 10,
    generateValues: () => [0, randInt(30, 50), randInt(60, 80), randInt(70, 90), randInt(40, 60), 0],
  },
  {
    district: 'train', graphType: 'bar', phase: 'build', difficulty: 3,
    titleTemplate: 'Train Frequency by Line',
    instructionTemplate: 'Create a bar graph showing how many trains run on each line per day.',
    unit: ' trains',
    xLabels: ['Red Line', 'Blue Line', 'Green Line', 'Yellow Line'],
    xTitle: 'Line', yTitle: 'Trains per Day',
    yRange: [0, 40], yStep: 5,
    generateValues: () => Array.from({ length: 4 }, () => randInt(8, 35)),
  },
  {
    district: 'train', graphType: 'line', phase: 'interpret', difficulty: 4,
    titleTemplate: 'Analyze the Train Journey',
    instructionTemplate: 'Plot the distance-time graph, then determine when the train stopped.',
    unit: ' km',
    xLabels: ['0 min', '5 min', '10 min', '15 min', '20 min', '25 min'],
    xTitle: 'Time', yTitle: 'Distance (km)',
    yRange: [0, 50], yStep: 5,
    generateValues: () => {
      const d1 = randInt(5, 12);
      const d2 = d1 + randInt(5, 10);
      const d3 = d2; // stopped
      const d4 = d3 + randInt(5, 12);
      const d5 = d4 + randInt(5, 10);
      return [0, d1, d2, d3, d4, d5];
    },
    interpretationQ: 'During which time interval did the train stop?',
    interpretationAFn: () => '10 min to 15 min',
  },
  {
    district: 'train', graphType: 'line', phase: 'complete', difficulty: 2,
    titleTemplate: 'Complete the Journey Log',
    instructionTemplate: 'Some distance readings are missing. Fill them in.',
    unit: ' km',
    xLabels: ['0 min', '10 min', '20 min', '30 min', '40 min'],
    xTitle: 'Time', yTitle: 'Distance (km)',
    yRange: [0, 50], yStep: 5,
    generateValues: () => {
      let d = 0;
      return Array.from({ length: 5 }, () => { d += randInt(5, 12); return d; });
    },
  },
  {
    district: 'train', graphType: 'line', phase: 'create', difficulty: 5,
    titleTemplate: 'Design a Train Route',
    instructionTemplate: 'Create a distance-time graph for a train that: accelerates, maintains speed, stops at a station, then continues.',
    unit: ' km',
    xLabels: ['0 min', '5 min', '10 min', '15 min', '20 min', '25 min'],
    xTitle: 'Time', yTitle: 'Distance (km)',
    yRange: [0, 50], yStep: 5,
    generateValues: () => [0, 8, 18, 28, 28, 40],
    createConditions: [
      'Starts at 0 km',
      'Distance increases (train accelerates)',
      'Flat section for at least one interval (station stop)',
      'Resumes increasing after the stop',
    ],
  },
];

// ── CITY PARK QUESTIONS ──
const parkQuestions: QuestionTemplate[] = [
  {
    district: 'park', graphType: 'bar', phase: 'read', difficulty: 1,
    titleTemplate: 'Park Visitors Count',
    instructionTemplate: 'Count the visitors at the city park each day of the week.',
    unit: ' visitors',
    xLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    xTitle: 'Day', yTitle: 'Visitors',
    yRange: [0, 120], yStep: 20,
    generateValues: () => [randInt(15, 40), randInt(20, 45), randInt(15, 35), randInt(25, 50), randInt(30, 55), randInt(70, 110), randInt(60, 100)],
    interpretationQ: 'On which day does the park have the most visitors?',
    interpretationAFn: (v) => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][maxIndex(v)],
  },
  {
    district: 'park', graphType: 'line', phase: 'read', difficulty: 1,
    titleTemplate: 'Hourly Visitor Trend',
    instructionTemplate: 'Track how many people visit the park each hour.',
    unit: ' visitors',
    xLabels: ['8 AM', '10 AM', '12 PM', '2 PM', '4 PM', '6 PM'],
    xTitle: 'Time', yTitle: 'Visitors',
    yRange: [0, 80], yStep: 10,
    generateValues: () => [randInt(5, 15), randInt(15, 30), randInt(35, 55), randInt(50, 70), randInt(40, 60), randInt(20, 35)],
  },
  {
    district: 'park', graphType: 'bar', phase: 'build', difficulty: 3,
    titleTemplate: 'Park Activities Survey',
    instructionTemplate: 'Create a bar graph showing the number of people doing each activity.',
    unit: ' people',
    xLabels: ['Jogging', 'Cycling', 'Playing', 'Reading', 'Eating'],
    xTitle: 'Activity', yTitle: 'People',
    yRange: [0, 50], yStep: 5,
    generateValues: () => Array.from({ length: 5 }, () => randInt(5, 45)),
  },
  {
    district: 'park', graphType: 'line', phase: 'build', difficulty: 3,
    titleTemplate: 'Plant Growth Tracking',
    instructionTemplate: 'Plot the height of a plant measured each week in the park garden.',
    unit: ' cm',
    xLabels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    xTitle: 'Week', yTitle: 'Height (cm)',
    yRange: [0, 30], yStep: 5,
    generateValues: () => {
      let h = randInt(2, 5);
      return Array.from({ length: 6 }, () => { h += randInt(2, 5); return h; });
    },
  },
  {
    district: 'park', graphType: 'bar', phase: 'interpret', difficulty: 4,
    titleTemplate: 'Seasonal Park Visitors',
    instructionTemplate: 'Build the visitor graph and determine which season attracts the most families.',
    unit: ' families',
    xLabels: ['Spring', 'Summer', 'Autumn', 'Winter'],
    xTitle: 'Season', yTitle: 'Families',
    yRange: [0, 100], yStep: 10,
    generateValues: () => [randInt(40, 65), randInt(70, 95), randInt(35, 55), randInt(10, 30)],
    interpretationQ: 'How many more families visit in summer than winter?',
    interpretationAFn: (v) => `${v[1] - v[3]}`,
  },
  {
    district: 'park', graphType: 'bar', phase: 'complete', difficulty: 2,
    titleTemplate: 'Complete the Activity Chart',
    instructionTemplate: 'Some activity counts are missing. Complete the chart.',
    unit: ' people',
    xLabels: ['Swings', 'Slides', 'Sandbox', 'Fountain', 'Gardens'],
    xTitle: 'Area', yTitle: 'Visitors',
    yRange: [0, 60], yStep: 10,
    generateValues: () => Array.from({ length: 5 }, () => randInt(10, 55)),
  },
  {
    district: 'park', graphType: 'bar', phase: 'create', difficulty: 5,
    titleTemplate: 'Design the Perfect Park Day',
    instructionTemplate: 'Create a visitor graph where: morning starts slow, peaks at midday, stays busy in afternoon, drops by evening.',
    unit: ' visitors',
    xLabels: ['8 AM', '10 AM', '12 PM', '2 PM', '4 PM', '6 PM'],
    xTitle: 'Time', yTitle: 'Visitors',
    yRange: [0, 100], yStep: 10,
    generateValues: () => [15, 35, 80, 70, 55, 20],
    createConditions: [
      'Morning (8 AM) has fewer than 25 visitors',
      'Peak is at 12 PM (at least 60 visitors)',
      'Afternoon stays above 40',
      'Evening (6 PM) drops below 30',
    ],
  },
];

// ── EXTRA MIXED QUESTIONS (to reach 100+) ──
const mixedQuestions: QuestionTemplate[] = [
  // Comparison questions
  {
    district: 'weather', graphType: 'bar', phase: 'interpret', difficulty: 4,
    titleTemplate: 'Compare Two Weeks of Rain',
    instructionTemplate: 'Build the rainfall graph for Week 2 and compare it with Week 1 data shown.',
    unit: 'mm',
    xLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    xTitle: 'Day', yTitle: 'Rainfall (mm)',
    yRange: [0, 50], yStep: 5,
    generateValues: () => Array.from({ length: 5 }, () => randInt(5, 45)),
    interpretationQ: 'Which day has the biggest difference in rainfall between the two weeks?',
    interpretationAFn: () => randChoice(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']),
  },
  {
    district: 'traffic', graphType: 'line', phase: 'read', difficulty: 2,
    titleTemplate: 'Bicycle Count at the Bridge',
    instructionTemplate: 'Plot the number of cyclists crossing the bridge each hour.',
    unit: ' cyclists',
    xLabels: ['7 AM', '8 AM', '9 AM', '10 AM', '11 AM'],
    xTitle: 'Hour', yTitle: 'Cyclists',
    yRange: [0, 40], yStep: 5,
    generateValues: () => Array.from({ length: 5 }, () => randInt(3, 35)),
  },
  {
    district: 'water', graphType: 'line', phase: 'read', difficulty: 2,
    titleTemplate: 'Swimming Pool Water Temperature',
    instructionTemplate: 'Track the water temperature in the city swimming pool.',
    unit: '°C',
    xLabels: ['8 AM', '10 AM', '12 PM', '2 PM', '4 PM'],
    xTitle: 'Time', yTitle: 'Temperature (°C)',
    yRange: [15, 35], yStep: 5,
    generateValues: () => [randInt(18, 22), randInt(22, 26), randInt(26, 30), randInt(28, 32), randInt(25, 29)],
  },
  {
    district: 'power', graphType: 'bar', phase: 'interpret', difficulty: 4,
    titleTemplate: 'School Energy Audit',
    instructionTemplate: 'Build a bar graph of energy use by room, then find which room wastes the most.',
    unit: ' kWh',
    xLabels: ['Classroom', 'Lab', 'Library', 'Gym', 'Canteen'],
    xTitle: 'Room', yTitle: 'Energy (kWh)',
    yRange: [0, 40], yStep: 5,
    generateValues: () => Array.from({ length: 5 }, () => randInt(8, 35)),
    interpretationQ: 'Which room uses the most energy?',
    interpretationAFn: (v) => ['Classroom', 'Lab', 'Library', 'Gym', 'Canteen'][maxIndex(v)],
  },
  {
    district: 'train', graphType: 'bar', phase: 'interpret', difficulty: 4,
    titleTemplate: 'Ticket Sales Analysis',
    instructionTemplate: 'Plot ticket sales data and determine the busiest travel day.',
    unit: ' tickets',
    xLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    xTitle: 'Day', yTitle: 'Tickets Sold',
    yRange: [0, 200], yStep: 25,
    generateValues: () => Array.from({ length: 7 }, () => randInt(40, 180)),
    interpretationQ: 'What is the total number of tickets sold on weekdays (Mon-Fri)?',
    interpretationAFn: (v) => `${v.slice(0, 5).reduce((a, b) => a + b, 0)}`,
  },
  {
    district: 'park', graphType: 'line', phase: 'interpret', difficulty: 4,
    titleTemplate: 'Temperature vs. Park Visitors',
    instructionTemplate: 'Plot temperature data and observe the relationship with visitor counts.',
    unit: '°C',
    xLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    xTitle: 'Day', yTitle: 'Temperature (°C)',
    yRange: [10, 35], yStep: 5,
    generateValues: () => Array.from({ length: 5 }, () => randInt(12, 33)),
    interpretationQ: 'On which day was it warmest?',
    interpretationAFn: (v) => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'][maxIndex(v)],
  },
  // Additional read/build questions for variety
  {
    district: 'weather', graphType: 'line', phase: 'build', difficulty: 3,
    titleTemplate: 'Humidity Throughout the Day',
    instructionTemplate: 'Plot the humidity percentage readings from the weather instruments.',
    unit: '%',
    xLabels: ['6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM'],
    xTitle: 'Time', yTitle: 'Humidity (%)',
    yRange: [0, 100], yStep: 10,
    generateValues: () => [randInt(60, 85), randInt(50, 70), randInt(35, 55), randInt(30, 50), randInt(40, 60), randInt(55, 75)],
  },
  {
    district: 'traffic', graphType: 'bar', phase: 'read', difficulty: 2,
    titleTemplate: 'Parking Lot Occupancy',
    instructionTemplate: 'Track how many cars are parked in each city parking lot.',
    unit: ' cars',
    xLabels: ['Lot A', 'Lot B', 'Lot C', 'Lot D'],
    xTitle: 'Parking Lot', yTitle: 'Cars Parked',
    yRange: [0, 80], yStep: 10,
    generateValues: () => Array.from({ length: 4 }, () => randInt(10, 75)),
  },
  {
    district: 'water', graphType: 'bar', phase: 'build', difficulty: 3,
    titleTemplate: 'Bottled Water Sales',
    instructionTemplate: 'Create a bar graph of bottled water sold at the park over 5 days.',
    unit: ' bottles',
    xLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    xTitle: 'Day', yTitle: 'Bottles Sold',
    yRange: [0, 60], yStep: 10,
    generateValues: () => Array.from({ length: 5 }, () => randInt(10, 55)),
  },
  {
    district: 'power', graphType: 'line', phase: 'read', difficulty: 2,
    titleTemplate: 'Solar Panel Output',
    instructionTemplate: 'Read the solar panel power output throughout a sunny day.',
    unit: ' kW',
    xLabels: ['7 AM', '9 AM', '11 AM', '1 PM', '3 PM', '5 PM'],
    xTitle: 'Time', yTitle: 'Solar Output (kW)',
    yRange: [0, 50], yStep: 5,
    generateValues: () => [randInt(3, 10), randInt(15, 25), randInt(30, 42), randInt(35, 48), randInt(25, 35), randInt(8, 18)],
  },
  {
    district: 'train', graphType: 'line', phase: 'read', difficulty: 2,
    titleTemplate: 'Express vs. Local Train',
    instructionTemplate: 'Plot the distance traveled by the express train.',
    unit: ' km',
    xLabels: ['0 min', '5 min', '10 min', '15 min', '20 min'],
    xTitle: 'Time', yTitle: 'Distance (km)',
    yRange: [0, 40], yStep: 5,
    generateValues: () => {
      let d = 0;
      return Array.from({ length: 5 }, () => { d += randInt(5, 10); return d; });
    },
  },
  {
    district: 'park', graphType: 'bar', phase: 'read', difficulty: 2,
    titleTemplate: 'Food Stall Customers',
    instructionTemplate: 'Count customers at each food stall in the park.',
    unit: ' customers',
    xLabels: ['Ice Cream', 'Popcorn', 'Juice', 'Sandwiches', 'Fruit'],
    xTitle: 'Food Stall', yTitle: 'Customers',
    yRange: [0, 50], yStep: 5,
    generateValues: () => Array.from({ length: 5 }, () => randInt(8, 45)),
  },
  // More create-mode questions
  {
    district: 'traffic', graphType: 'line', phase: 'create', difficulty: 5,
    titleTemplate: 'Design Rush Hour',
    instructionTemplate: 'Create a traffic volume graph with morning rush, quiet midday, and evening rush.',
    unit: ' vehicles',
    xLabels: ['6 AM', '8 AM', '10 AM', '12 PM', '4 PM', '6 PM'],
    xTitle: 'Time', yTitle: 'Vehicles',
    yRange: [0, 100], yStep: 10,
    generateValues: () => [20, 85, 40, 25, 35, 80],
    createConditions: [
      'Morning rush (8 AM) above 70 vehicles',
      'Midday (12 PM) below 30 vehicles',
      'Evening rush (6 PM) above 70 vehicles',
      'At least 3 intervals where traffic changes significantly',
    ],
  },
  {
    district: 'water', graphType: 'bar', phase: 'create', difficulty: 5,
    titleTemplate: 'Design Water Distribution',
    instructionTemplate: 'Create a water usage bar chart where industrial areas use the most, and residential areas use more than parks.',
    unit: ' kL',
    xLabels: ['Residential', 'Industrial', 'Commercial', 'Parks', 'Schools'],
    xTitle: 'Area', yTitle: 'Water Usage (kL)',
    yRange: [0, 80], yStep: 10,
    generateValues: () => [45, 70, 35, 20, 25],
    createConditions: [
      'Industrial has the highest usage',
      'Residential uses more than Parks',
      'All areas use at least 15 kL',
      'Total usage is between 150–250 kL',
    ],
  },
  {
    district: 'power', graphType: 'bar', phase: 'create', difficulty: 5,
    titleTemplate: 'Design an Eco-City Power Mix',
    instructionTemplate: 'Create a power generation chart where renewable sources (Solar, Wind, Hydro) together exceed fossil fuels.',
    unit: ' MW',
    xLabels: ['Solar', 'Wind', 'Hydro', 'Gas', 'Coal'],
    xTitle: 'Source', yTitle: 'Power (MW)',
    yRange: [0, 50], yStep: 5,
    generateValues: () => [25, 20, 15, 12, 8],
    createConditions: [
      'Solar + Wind + Hydro > Gas + Coal',
      'Solar generates the most power',
      'No source generates less than 5 MW',
      'Total generation is between 60–100 MW',
    ],
  },
  {
    district: 'park', graphType: 'line', phase: 'create', difficulty: 5,
    titleTemplate: 'Design a Festival Day',
    instructionTemplate: 'Create a visitor graph where numbers increase sharply for the festival (12-2 PM), then gradually decrease.',
    unit: ' visitors',
    xLabels: ['9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM'],
    xTitle: 'Time', yTitle: 'Visitors',
    yRange: [0, 100], yStep: 10,
    generateValues: () => [10, 15, 25, 70, 85, 90, 55],
    createConditions: [
      'Morning (9-11 AM) stays below 30 visitors',
      'Sharp increase starting at 12 PM',
      'Peak between 1-2 PM (above 80)',
      'Decrease after 2 PM',
    ],
  },
];

// ── COMBINE ALL TEMPLATES ──
const ALL_TEMPLATES: QuestionTemplate[] = [
  ...weatherQuestions,
  ...trafficQuestions,
  ...waterQuestions,
  ...powerQuestions,
  ...trainQuestions,
  ...parkQuestions,
  ...mixedQuestions,
];

// ── QUESTION GENERATOR ──
let questionCounter = 0;

export function generateQuestion(template: QuestionTemplate): MissionQuestion {
  questionCounter++;
  const values = template.generateValues();
  const dataTable: DataPoint[] = template.xLabels.map((label, i) => ({
    label,
    value: values[i] ?? 0,
  }));

  const xAxis: GraphAxis = {
    title: template.xTitle,
    min: 0,
    max: template.xLabels.length - 1,
    step: 1,
    labels: template.xLabels,
  };

  const yAxis: GraphAxis = {
    title: template.yTitle,
    min: template.yRange[0],
    max: template.yRange[1],
    step: template.yStep,
    labels: [],
  };

  // Generate y-axis labels
  for (let v = yAxis.min; v <= yAxis.max; v += yAxis.step) {
    yAxis.labels.push(`${v}`);
  }

  return {
    id: `GW-${questionCounter}-${Date.now()}`,
    round: template.difficulty,
    phase: template.phase,
    district: template.district,
    graphType: template.graphType,
    title: template.titleTemplate,
    instruction: template.instructionTemplate,
    dataTable,
    xAxis,
    yAxis,
    expectedValues: values,
    unit: template.unit,
    interpretationQ: template.interpretationQ,
    interpretationA: template.interpretationAFn?.(values),
    createConditions: template.createConditions,
    partialGraphData: template.phase === 'complete'
      ? values.map((v, i) => (i % 2 === 0 ? v : -1))  // every other value missing
      : undefined,
    difficulty: template.difficulty,
  };
}

// ── GET QUESTIONS BY CRITERIA ──
export function getQuestionsForRound(round: number): MissionQuestion[] {
  const phases: RoundPhase[] = ['read', 'complete', 'build', 'interpret', 'create'];
  const phase = phases[round - 1] ?? 'build';

  const matching = ALL_TEMPLATES.filter((t) => t.phase === phase);

  // Shuffle and generate
  const shuffled = [...matching].sort(() => Math.random() - 0.5);
  return shuffled.map((t) => generateQuestion(t));
}

export function getQuestionsForDistrict(district: CityDistrict): MissionQuestion[] {
  const matching = ALL_TEMPLATES.filter((t) => t.district === district);
  const shuffled = [...matching].sort(() => Math.random() - 0.5);
  return shuffled.map((t) => generateQuestion(t));
}

export function getMissionForTeam(round: number, district: CityDistrict): MissionQuestion {
  const phases: RoundPhase[] = ['read', 'complete', 'build', 'interpret', 'create'];
  const phase = phases[round - 1] ?? 'build';

  // Find a matching template, fallback to any in that phase
  let templates = ALL_TEMPLATES.filter((t) => t.phase === phase && t.district === district);
  if (templates.length === 0) {
    templates = ALL_TEMPLATES.filter((t) => t.phase === phase);
  }

  const template = randChoice(templates);
  return generateQuestion(template);
}

export function getTotalQuestionCount(): number {
  return ALL_TEMPLATES.length;
}

// ── FINAL CHALLENGE GENERATOR ──
export function generateFinalChallenge(): MissionQuestion {
  const scenarios = [
    {
      title: 'Heat Wave Emergency',
      instruction: 'A heat wave is approaching. The water department needs to prepare for expected demand over 6 hours. Create a water demand graph showing increasing usage that peaks at 3 PM.',
      district: 'water' as CityDistrict,
      xLabels: ['10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM'],
      yRange: [0, 100] as [number, number],
      values: [25, 35, 50, 65, 80, 95],
      conditions: ['Water demand increases each hour', 'Peaks at 3 PM (above 90 kL)', 'Starting demand is below 30 kL'],
    },
    {
      title: 'Festival Traffic Plan',
      instruction: 'A city festival is happening this weekend. Create a traffic plan showing expected vehicle counts peaking at noon.',
      district: 'traffic' as CityDistrict,
      xLabels: ['8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM'],
      yRange: [0, 120] as [number, number],
      values: [20, 40, 65, 85, 110, 90],
      conditions: ['Traffic builds through morning', 'Peak at noon (above 100 vehicles)', 'Starts below 30 vehicles'],
    },
    {
      title: 'Blackout Prevention',
      instruction: 'The city expects high power usage. Create a power demand graph showing critical evening peak requiring backup generators.',
      district: 'power' as CityDistrict,
      xLabels: ['12 PM', '2 PM', '4 PM', '6 PM', '8 PM', '10 PM'],
      yRange: [0, 80] as [number, number],
      values: [30, 35, 45, 65, 70, 50],
      conditions: ['Power usage increases toward evening', 'Peak between 6-8 PM (above 60 MW)', 'Drops after 8 PM'],
    },
  ];

  const scenario = randChoice(scenarios);

  const dataTable: DataPoint[] = scenario.xLabels.map((label, i) => ({
    label,
    value: scenario.values[i],
  }));

  return {
    id: `FINAL-${Date.now()}`,
    round: 5,
    phase: 'create',
    district: scenario.district,
    graphType: 'line',
    title: `THE DATA CRISIS: ${scenario.title}`,
    instruction: scenario.instruction,
    dataTable,
    xAxis: {
      title: 'Time',
      min: 0,
      max: scenario.xLabels.length - 1,
      step: 1,
      labels: scenario.xLabels,
    },
    yAxis: {
      title: 'Value',
      min: scenario.yRange[0],
      max: scenario.yRange[1],
      step: 10,
      labels: Array.from(
        { length: Math.ceil((scenario.yRange[1] - scenario.yRange[0]) / 10) + 1 },
        (_, i) => `${scenario.yRange[0] + i * 10}`
      ),
    },
    expectedValues: scenario.values,
    unit: '',
    createConditions: scenario.conditions,
    difficulty: 5,
  };
}
