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

// ── CIRCLE GRAPH / PIE CHART QUESTIONS (ROUND ONE & BEYOND) ──
const circleGraphQuestions: QuestionTemplate[] = [
  // ROUND 1: READ
  {
    district: 'power', graphType: 'pie', phase: 'read', difficulty: 1,
    titleTemplate: 'Clean Energy Grid Share',
    instructionTemplate: 'The energy grid uses multiple renewable sources. Construct the circle graph showing their percentage shares.',
    unit: '%',
    xLabels: ['Solar', 'Wind', 'Hydro', 'Storage'],
    xTitle: 'Energy Source', yTitle: 'Percentage Share (%)',
    yRange: [0, 100], yStep: 5,
    generateValues: () => [35, 25, 25, 15],
  },
  {
    district: 'water', graphType: 'pie', phase: 'read', difficulty: 1,
    titleTemplate: 'Reservoir Water Allocation',
    instructionTemplate: 'City engineers allocate water from the reservoir. Construct the circle graph to balance distribution.',
    unit: '%',
    xLabels: ['Homes', 'Industry', 'Parks', 'Schools'],
    xTitle: 'Sector', yTitle: 'Allocation (%)',
    yRange: [0, 100], yStep: 5,
    generateValues: () => [40, 30, 20, 10],
  },
  // ROUND 2: COMPLETE
  {
    district: 'traffic', graphType: 'pie', phase: 'complete', difficulty: 2,
    titleTemplate: 'Daily Commute Mode Split',
    instructionTemplate: 'Complete the circle graph showing how citizens commute across the data city.',
    unit: '%',
    xLabels: ['Metro Train', 'Electric Bus', 'Bicycle', 'Walking'],
    xTitle: 'Commute Mode', yTitle: 'Commuter Share (%)',
    yRange: [0, 100], yStep: 5,
    generateValues: () => [45, 25, 20, 10],
  },
  {
    district: 'park', graphType: 'pie', phase: 'complete', difficulty: 2,
    titleTemplate: 'Botanical Park Land Division',
    instructionTemplate: 'Complete the circle graph dividing the botanical park into recreational zones.',
    unit: '%',
    xLabels: ['Forest Grove', 'Flower Gardens', 'Walking Lawns', 'Lotus Pond'],
    xTitle: 'Zone', yTitle: 'Land Area (%)',
    yRange: [0, 100], yStep: 5,
    generateValues: () => [30, 35, 25, 10],
  },
  // ROUND 3: BUILD
  {
    district: 'power', graphType: 'pie', phase: 'build', difficulty: 3,
    titleTemplate: 'Eco-District Power Budget',
    instructionTemplate: 'Build the circle graph allocating clean energy funds across smart grid sectors.',
    unit: '%',
    xLabels: ['Solar Panels', 'Wind Turbines', 'Grid Batteries', 'Smart Meters'],
    xTitle: 'Grid Sector', yTitle: 'Budget Share (%)',
    yRange: [0, 100], yStep: 5,
    generateValues: () => [35, 30, 20, 15],
  },
  {
    district: 'weather', graphType: 'pie', phase: 'build', difficulty: 3,
    titleTemplate: 'Sky Condition Breakdown',
    instructionTemplate: 'The observatory tracked cloud conditions this month. Build the circle graph.',
    unit: '%',
    xLabels: ['Clear Sky', 'Scattered Clouds', 'Overcast', 'Rainy'],
    xTitle: 'Sky Type', yTitle: 'Monthly Days (%)',
    yRange: [0, 100], yStep: 5,
    generateValues: () => [40, 30, 15, 15],
  },
  // ROUND 4: INTERPRET
  {
    district: 'water', graphType: 'pie', phase: 'interpret', difficulty: 4,
    titleTemplate: 'City Waste Sorting Distribution',
    instructionTemplate: 'Analyze and plot the circle graph for city recyclable waste recovery.',
    unit: '%',
    xLabels: ['Compost', 'Plastics', 'Paper & Card', 'Metals'],
    xTitle: 'Recyclable Type', yTitle: 'Weight Ratio (%)',
    yRange: [0, 100], yStep: 5,
    generateValues: () => [40, 25, 20, 15],
  },
  {
    district: 'train', graphType: 'pie', phase: 'interpret', difficulty: 4,
    titleTemplate: 'Central Station Passenger Demographics',
    instructionTemplate: 'Plot the circle graph for passenger categories departing Central Terminal.',
    unit: '%',
    xLabels: ['Commuters', 'Students', 'Tourists', 'Business'],
    xTitle: 'Traveler Category', yTitle: 'Traveler Share (%)',
    yRange: [0, 100], yStep: 5,
    generateValues: () => [50, 20, 15, 15],
  },
  // ROUND 5: CREATE
  {
    district: 'park', graphType: 'pie', phase: 'create', difficulty: 5,
    titleTemplate: 'Sustainable City Master Plan',
    instructionTemplate: 'Create a circle graph dividing city greenery where residential and solar together exceed 60%.',
    unit: '%',
    xLabels: ['Residential Green', 'Solar Parks', 'Transit Corridors', 'Wetlands'],
    xTitle: 'Land Sector', yTitle: 'Master Plan Share (%)',
    yRange: [0, 100], yStep: 5,
    generateValues: () => [35, 25, 20, 20],
    createConditions: [
      'Residential Green + Solar Parks >= 60%',
      'All sectors have at least 15%',
      'Total percentage equals 100%',
    ],
  },
];

// ── PICTOGRAPH QUESTIONS (PICTURE GRAPHS) ──
const pictographQuestions: QuestionTemplate[] = [
  // ROUND 1: READ
  {
    district: 'traffic', graphType: 'pictograph', phase: 'read', difficulty: 1,
    titleTemplate: 'Morning Cyclists on River Bridge',
    instructionTemplate: 'Count the bicycle symbols (Key: 1 🚲 = 5 Cyclists) and plot the pictograph.',
    unit: ' cyclists',
    xLabels: ['6 AM', '7 AM', '8 AM', '9 AM'],
    xTitle: 'Morning Hour', yTitle: 'Cyclists (1 🚲 = 5)',
    yRange: [0, 40], yStep: 5,
    generateValues: () => [randInt(2, 4) * 5, randInt(4, 7) * 5, randInt(5, 8) * 5, randInt(3, 6) * 5],
  },
  {
    district: 'power', graphType: 'pictograph', phase: 'read', difficulty: 1,
    titleTemplate: 'Solar Farm Energy Harvest',
    instructionTemplate: 'Plot the energy output for each solar array (Key: 1 ⚡ = 10 kWh).',
    unit: ' kWh',
    xLabels: ['North Array', 'South Array', 'East Array', 'West Array'],
    xTitle: 'Array Sector', yTitle: 'Energy (1 ⚡ = 10 kWh)',
    yRange: [0, 60], yStep: 10,
    generateValues: () => [randInt(2, 5) * 10, randInt(3, 6) * 10, randInt(3, 6) * 10, randInt(1, 4) * 10],
  },
  // ROUND 2: COMPLETE
  {
    district: 'park', graphType: 'pictograph', phase: 'complete', difficulty: 2,
    titleTemplate: 'Urban Forest Tree Census',
    instructionTemplate: 'Complete the pictograph showing trees planted in the city park (Key: 1 🌲 = 5 Trees).',
    unit: ' trees',
    xLabels: ['Oak', 'Maple', 'Pine', 'Cedar'],
    xTitle: 'Tree Species', yTitle: 'Trees Planted (1 🌲 = 5)',
    yRange: [0, 35], yStep: 5,
    generateValues: () => [randInt(2, 6) * 5, randInt(3, 7) * 5, randInt(2, 5) * 5, randInt(2, 6) * 5],
  },
  {
    district: 'water', graphType: 'pictograph', phase: 'complete', difficulty: 2,
    titleTemplate: 'Water Station Purification',
    instructionTemplate: 'Complete the pictograph for clean water supplied by each plant (Key: 1 💧 = 20 kL).',
    unit: ' kL',
    xLabels: ['Plant Alpha', 'Plant Beta', 'Plant Gamma', 'Plant Delta'],
    xTitle: 'Plant Station', yTitle: 'Water Output (1 💧 = 20 kL)',
    yRange: [0, 100], yStep: 20,
    generateValues: () => [randInt(2, 5) * 20, randInt(1, 4) * 20, randInt(3, 5) * 20, randInt(2, 4) * 20],
  },
  // ROUND 3: BUILD
  {
    district: 'train', graphType: 'pictograph', phase: 'build', difficulty: 3,
    titleTemplate: 'High-Speed Rail Departures',
    instructionTemplate: 'Build the pictograph for morning express trains from each platform (Key: 1 🚆 = 5 Trains).',
    unit: ' trains',
    xLabels: ['Track 1', 'Track 2', 'Track 3', 'Track 4'],
    xTitle: 'Track Line', yTitle: 'Departures (1 🚆 = 5)',
    yRange: [0, 30], yStep: 5,
    generateValues: () => [randInt(2, 5) * 5, randInt(3, 6) * 5, randInt(1, 4) * 5, randInt(2, 5) * 5],
  },
  {
    district: 'weather', graphType: 'pictograph', phase: 'build', difficulty: 3,
    titleTemplate: 'Seasonal Rainy Days',
    instructionTemplate: 'Build the weather pictograph for rainy days recorded per season (Key: 1 🌧️ = 4 Days).',
    unit: ' days',
    xLabels: ['Spring', 'Summer', 'Autumn', 'Winter'],
    xTitle: 'Season', yTitle: 'Rainy Days (1 🌧️ = 4)',
    yRange: [0, 24], yStep: 4,
    generateValues: () => [randInt(2, 5) * 4, randInt(1, 3) * 4, randInt(3, 6) * 4, randInt(2, 4) * 4],
  },
  // ROUND 4: INTERPRET
  {
    district: 'traffic', graphType: 'pictograph', phase: 'interpret', difficulty: 4,
    titleTemplate: 'EV Fast-Charging Hub Usage',
    instructionTemplate: 'Plot the pictograph for electric vehicles charged at city hubs (Key: 1 🚗 = 10 Cars).',
    unit: ' cars',
    xLabels: ['Central', 'Uptown', 'Harbor', 'Airport'],
    xTitle: 'Hub Station', yTitle: 'Vehicles (1 🚗 = 10)',
    yRange: [0, 60], yStep: 10,
    generateValues: () => [randInt(2, 5) * 10, randInt(1, 4) * 10, randInt(3, 6) * 10, randInt(2, 5) * 10],
  },
  // ROUND 5: CREATE
  {
    district: 'park', graphType: 'pictograph', phase: 'create', difficulty: 5,
    titleTemplate: 'Nature Sanctuary Bird Census',
    instructionTemplate: 'Create a bird census pictograph where Sparrows is the largest flock (Key: 1 🕊️ = 5 Birds).',
    unit: ' birds',
    xLabels: ['Sparrows', 'Robins', 'Herons', 'Doves'],
    xTitle: 'Bird Species', yTitle: 'Flock Size (1 🕊️ = 5)',
    yRange: [0, 35], yStep: 5,
    generateValues: () => [25, 20, 15, 10],
    createConditions: [
      'Sparrows has the largest flock',
      'All species have at least 10 birds',
      'Total count is between 60 and 80 birds',
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
  ...circleGraphQuestions,
  ...pictographQuestions,
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

// ============================================================
// 50-QUESTION CITY EVENT SYSTEM (10 DISTINCT EVENTS × 5 QUESTIONS)
// ============================================================
// Every 5 questions operates a distinct 3D city event that
// progressively unfolds in the background while students plot data.
// 1. Event 1 (Q1-5):   MORNING CITY COMES ALIVE
// 2. Event 2 (Q6-10):  WEATHER DAY
// 3. Event 3 (Q11-15): CITY TRAFFIC RUSH
// 4. Event 4 (Q16-20): WATER CITY OPERATION
// 5. Event 5 (Q21-25): CITY POWER SURGE
// 6. Event 6 (Q26-30): TRAIN NETWORK DAY
// 7. Event 7 (Q31-35): CITY PARK FESTIVAL
// 8. Event 8 (Q36-40): CITY DEVELOPMENT / CONSTRUCTION
// 9. Event 9 (Q41-45): GRAND DATA FESTIVAL
// 10. Event 10 (Q46-50): THE DATA CRISIS RESOLUTION

export interface CityEventDefinition {
  id: number;
  code: string;
  title: string;
  activeDistrict: CityDistrict | 'city' | 'construction';
  questionRange: [number, number];
  phases: [string, string, string, string, string];
  completionMessage: string;
}

export const CITY_EVENT_DEFINITIONS: CityEventDefinition[] = [
  {
    id: 1,
    code: 'MORNING_ALIVE',
    title: 'MORNING CITY COMES ALIVE',
    activeDistrict: 'city',
    questionRange: [1, 5],
    phases: [
      'Dawn breaks · Early city systems powering up',
      'Commuters arriving · City streets becoming active',
      'Morning train departs station · Park gates open',
      'Morning rush hour · Transit network in full swing',
      'Central Data Tower operational · Daytime city fully awake!',
    ],
    completionMessage: 'MORNING DATA COMPLETE',
  },
  {
    id: 2,
    code: 'WEATHER_DAY',
    title: 'WEATHER STATION OPERATION',
    activeDistrict: 'weather',
    questionRange: [6, 10],
    phases: [
      'Atmospheric shift · Cloud formations drifting over bay',
      'Wind speed rising · Weather turbines rotating',
      'Rainfall detected · Gauges and collectors activating',
      'Graph-controlled precipitation · Dynamic rain simulation',
      'Weather system calibrated · Clear skies and sunlight return!',
    ],
    completionMessage: 'WEATHER DATA COMPLETE',
  },
  {
    id: 3,
    code: 'TRAFFIC_RUSH',
    title: 'CITY TRAFFIC RUSH',
    activeDistrict: 'traffic',
    questionRange: [11, 15],
    phases: [
      'Arterial road monitors online · Early vehicles entering',
      'Traffic flow building · Signal coordination begins',
      'Peak commute · Highway and crosswalks in heavy motion',
      'Graph-driven traffic volume · Density scales with data',
      'Traffic optimized · Smooth synchronized vehicular flow!',
    ],
    completionMessage: 'TRAFFIC DATA COMPLETE',
  },
  {
    id: 4,
    code: 'WATER_OPERATION',
    title: 'WATER CITY OPERATION',
    activeDistrict: 'water',
    questionRange: [16, 20],
    phases: [
      'Hydro conduits opening · Water begins flow through pipes',
      'Primary pump station activating · Pressure gauges rise',
      'Main reservoir filling · Treatment skimmers engaged',
      'Flow rate modulated by graph data · Surge tanks active',
      'Reservoir target reached · Grand plaza fountains surge!',
    ],
    completionMessage: 'WATER OPERATION COMPLETE',
  },
  {
    id: 5,
    code: 'POWER_SURGE',
    title: 'CITY POWER SURGE',
    activeDistrict: 'power',
    questionRange: [21, 25],
    phases: [
      'Grid balancing begins · Power turbines initiating',
      'Energy generation climbing · Transmission lines humming',
      'Substation corona rings glowing · Peak grid distribution',
      'Power output dynamically matching student graph curve',
      'Full electrical stability · City illuminated with clean energy!',
    ],
    completionMessage: 'POWER GRID STABILIZED',
  },
  {
    id: 6,
    code: 'TRAIN_DAY',
    title: 'TRAIN NETWORK EXPEDITION',
    activeDistrict: 'train',
    questionRange: [26, 30],
    phases: [
      'Bullet train at platform · Passengers boarding at station',
      'Signals change to green · Doors lock, departure chime',
      'High-speed viaduct transit · Cruising past city districts',
      'Speed and station stop strictly governed by line graph',
      'Arrival at terminal · Passengers disembark safely!',
    ],
    completionMessage: 'TRAIN NETWORK COMPLETE',
  },
  {
    id: 7,
    code: 'PARK_FESTIVAL',
    title: 'CITY PARK FESTIVAL',
    activeDistrict: 'park',
    questionRange: [31, 35],
    phases: [
      'Park pavilions opening · Early visitors strolling paths',
      'Food stalls and festival tents active · Crowd gathering',
      'Festival peak · Center fountain jets dancing high',
      'Visitor crowd density accurately reflects plotted values',
      'Festival grand finale · Happy citizens in lush green park!',
    ],
    completionMessage: 'PARK FESTIVAL COMPLETE',
  },
  {
    id: 8,
    code: 'CITY_DEVELOPMENT',
    title: 'CITY DISTRICT DEVELOPMENT',
    activeDistrict: 'construction',
    questionRange: [36, 40],
    phases: [
      'Groundbreaking on Innovation Block · Scaffolding & cones placed',
      'Tower crane swinging · Hoisting steel structural beams',
      'Modular building stories assembling floor-by-floor',
      'Roadway paved, sidewalk streetlights connected',
      'Ribbon cutting! New modern tower open · Citizens move in!',
    ],
    completionMessage: 'DISTRICT EXPANSION COMPLETE',
  },
  {
    id: 9,
    code: 'DATA_FESTIVAL',
    title: 'GRAND DATA FESTIVAL',
    activeDistrict: 'city',
    questionRange: [41, 45],
    phases: [
      'Festival banners unfurl · Central plaza lighting up',
      'Synchronized dual bullet trains passing on viaducts',
      'Fountains dancing in concert with power substation glows',
      'Full metropolitan data harmony across all 6 districts',
      'Data fireworks & celebratory pulses light up the skyline!',
    ],
    completionMessage: 'DATA FESTIVAL COMPLETE',
  },
  {
    id: 10,
    code: 'DATA_CRISIS',
    title: 'THE DATA CRISIS RESOLUTION',
    activeDistrict: 'city',
    questionRange: [46, 50],
    phases: [
      'Red Alert · City systems facing simultaneous overload',
      'Students deploy emergency data graphs to stabilize grid',
      'Water and power backup routing successfully engaged',
      'Crisis metrics dropping in real-time as graphs validate',
      'City saved! 100% green operational status · Master Engineers crowned!',
    ],
    completionMessage: 'DATA CITY RESCUED',
  },
];

export function getEventForQuestion(questionNum: number): CityEventDefinition {
  const eventIndex = Math.floor((Math.max(1, questionNum) - 1) / 5) % CITY_EVENT_DEFINITIONS.length;
  return CITY_EVENT_DEFINITIONS[eventIndex];
}

export function getEventPhaseForQuestion(questionNum: number): number {
  return ((Math.max(1, questionNum) - 1) % 5) + 1;
}

// ── 50 CURATED EVENT QUESTIONS (10 EVENTS × 5 QUESTIONS) ──
export const FIFTY_EVENT_QUESTIONS: MissionQuestion[] = [
  // ── EVENT 1: MORNING CITY COMES ALIVE (Q1–5) ──
  {
    id: 'EV1-Q1-PIE',
    round: 1,
    phase: 'build',
    district: 'power',
    graphType: 'pie',
    title: 'EVENT 1 (1/5): Clean Energy Morning Mix',
    instruction: 'Dawn breaks over the city! Plot the clean power generation mix: Solar 35%, Wind 25%, Hydro 20%, Biomass 20% (Total: 100%). First team to check wins!',
    dataTable: [
      { label: 'Solar', value: 35 },
      { label: 'Wind', value: 25 },
      { label: 'Hydro', value: 20 },
      { label: 'Biomass', value: 20 },
    ],
    xAxis: { title: 'Source', min: 0, max: 3, step: 1, labels: ['Solar', 'Wind', 'Hydro', 'Biomass'] },
    yAxis: { title: 'Share (%)', min: 0, max: 100, step: 5, labels: ['0%', '20%', '40%', '60%', '80%', '100%'] },
    expectedValues: [35, 25, 20, 20],
    unit: '%',
    difficulty: 1,
  },
  {
    id: 'EV1-Q2-BAR',
    round: 2,
    phase: 'build',
    district: 'traffic',
    graphType: 'bar',
    title: 'EVENT 1 (2/5): Early Commuter Arrivals',
    instruction: 'City streets are waking up! Plot hourly commuter influx: 6 AM: 15, 7 AM: 35, 8 AM: 60, 9 AM: 80. First team to check wins!',
    dataTable: [
      { label: '6 AM', value: 15 },
      { label: '7 AM', value: 35 },
      { label: '8 AM', value: 60 },
      { label: '9 AM', value: 80 },
    ],
    xAxis: { title: 'Morning Hour', min: 0, max: 3, step: 1, labels: ['6 AM', '7 AM', '8 AM', '9 AM'] },
    yAxis: { title: 'Commuters', min: 0, max: 100, step: 10, labels: ['0', '25', '50', '75', '100'] },
    expectedValues: [15, 35, 60, 80],
    unit: 'commuters',
    difficulty: 2,
  },
  {
    id: 'EV1-Q3-LINE',
    round: 3,
    phase: 'build',
    district: 'weather',
    graphType: 'line',
    title: 'EVENT 1 (3/5): Sunrise Temperature Rise',
    instruction: 'The sun rises over the coastal bay. Plot the temperature climb: 6 AM: 12°C, 7 AM: 15°C, 8 AM: 18°C, 9 AM: 22°C, 10 AM: 25°C. First team to check wins!',
    dataTable: [
      { label: '6 AM', value: 12 },
      { label: '7 AM', value: 15 },
      { label: '8 AM', value: 18 },
      { label: '9 AM', value: 22 },
      { label: '10 AM', value: 25 },
    ],
    xAxis: { title: 'Time', min: 0, max: 4, step: 1, labels: ['6 AM', '7 AM', '8 AM', '9 AM', '10 AM'] },
    yAxis: { title: 'Temperature (°C)', min: 0, max: 30, step: 5, labels: ['0°', '10°', '20°', '30°'] },
    expectedValues: [12, 15, 18, 22, 25],
    unit: '°C',
    difficulty: 2,
  },
  {
    id: 'EV1-Q4-PICTO',
    round: 4,
    phase: 'build',
    district: 'traffic',
    graphType: 'pictograph',
    title: 'EVENT 1 (4/5): Morning Eco-Cyclists',
    instruction: 'Morning cyclists fill the bike lanes! Key: 1 🚲 = 5 Cyclists. Plot: North Ave 20, East Blvd 35, Central Way 50, South Lane 25.',
    dataTable: [
      { label: 'North Ave', value: 20 },
      { label: 'East Blvd', value: 35 },
      { label: 'Central Way', value: 50 },
      { label: 'South Lane', value: 25 },
    ],
    xAxis: { title: 'Avenue', min: 0, max: 3, step: 1, labels: ['North Ave', 'East Blvd', 'Central Way', 'South Lane'] },
    yAxis: { title: 'Cyclists', min: 0, max: 60, step: 5, labels: ['0', '15', '30', '45', '60'] },
    expectedValues: [20, 35, 50, 25],
    unit: 'bikes',
    difficulty: 3,
  },
  {
    id: 'EV1-Q5-LINE',
    round: 5,
    phase: 'build',
    district: 'city',
    graphType: 'line',
    title: 'EVENT 1 (5/5): Data Tower Activation Curve',
    instruction: 'FINALE: Bring the central Data Tower online! Plot the morning grid activation curve: 6 AM: 20%, 7 AM: 55%, 8 AM: 90%, 9 AM: 85%, 10 AM: 45%.',
    dataTable: [
      { label: '6 AM', value: 20 },
      { label: '7 AM', value: 55 },
      { label: '8 AM', value: 90 },
      { label: '9 AM', value: 85 },
      { label: '10 AM', value: 45 },
    ],
    xAxis: { title: 'Time', min: 0, max: 4, step: 1, labels: ['6 AM', '7 AM', '8 AM', '9 AM', '10 AM'] },
    yAxis: { title: 'Grid Load (%)', min: 0, max: 100, step: 10, labels: ['0%', '25%', '50%', '75%', '100%'] },
    expectedValues: [20, 55, 90, 85, 45],
    unit: '%',
    difficulty: 3,
  },

  // ── EVENT 2: WEATHER DAY (Q6–10) ──
  {
    id: 'EV2-Q6-BAR',
    round: 6,
    phase: 'build',
    district: 'weather',
    graphType: 'bar',
    title: 'EVENT 2 (1/5): Cloud Formation Density',
    instruction: 'Clouds begin gathering over the meteorological district. Plot hourly cloud coverage: 8 AM: 20%, 10 AM: 40%, 12 PM: 70%, 2 PM: 90%, 4 PM: 30%.',
    dataTable: [
      { label: '8 AM', value: 20 },
      { label: '10 AM', value: 40 },
      { label: '12 PM', value: 70 },
      { label: '2 PM', value: 90 },
      { label: '4 PM', value: 30 },
    ],
    xAxis: { title: 'Hour', min: 0, max: 4, step: 1, labels: ['8 AM', '10 AM', '12 PM', '2 PM', '4 PM'] },
    yAxis: { title: 'Cloud Cover (%)', min: 0, max: 100, step: 10, labels: ['0%', '25%', '50%', '75%', '100%'] },
    expectedValues: [20, 40, 70, 90, 30],
    unit: '%',
    difficulty: 2,
  },
  {
    id: 'EV2-Q7-LINE',
    round: 7,
    phase: 'build',
    district: 'weather',
    graphType: 'line',
    title: 'EVENT 2 (2/5): Rising Wind Gust Speed',
    instruction: 'Wind turbines begin rotating as the front arrives! Plot wind speed: 8 AM: 10 km/h, 10 AM: 25 km/h, 12 PM: 45 km/h, 2 PM: 35 km/h, 4 PM: 15 km/h.',
    dataTable: [
      { label: '8 AM', value: 10 },
      { label: '10 AM', value: 25 },
      { label: '12 PM', value: 45 },
      { label: '2 PM', value: 35 },
      { label: '4 PM', value: 15 },
    ],
    xAxis: { title: 'Time', min: 0, max: 4, step: 1, labels: ['8 AM', '10 AM', '12 PM', '2 PM', '4 PM'] },
    yAxis: { title: 'Wind Speed (km/h)', min: 0, max: 60, step: 5, labels: ['0', '15', '30', '45', '60'] },
    expectedValues: [10, 25, 45, 35, 15],
    unit: 'km/h',
    difficulty: 2,
  },
  {
    id: 'EV2-Q8-BAR',
    round: 8,
    phase: 'build',
    district: 'weather',
    graphType: 'bar',
    title: 'EVENT 2 (3/5): Rain Gauge Inflow Levels',
    instruction: 'Rain begins falling across city catchments! Plot rainfall at stations: Stn A: 15mm, Stn B: 30mm, Stn C: 45mm, Stn D: 20mm, Stn E: 35mm.',
    dataTable: [
      { label: 'Stn A', value: 15 },
      { label: 'Stn B', value: 30 },
      { label: 'Stn C', value: 45 },
      { label: 'Stn D', value: 20 },
      { label: 'Stn E', value: 35 },
    ],
    xAxis: { title: 'Station', min: 0, max: 4, step: 1, labels: ['Stn A', 'Stn B', 'Stn C', 'Stn D', 'Stn E'] },
    yAxis: { title: 'Rainfall (mm)', min: 0, max: 50, step: 5, labels: ['0', '10', '20', '30', '40', '50'] },
    expectedValues: [15, 30, 45, 20, 35],
    unit: 'mm',
    difficulty: 2,
  },
  {
    id: 'EV2-Q9-LINE',
    round: 9,
    phase: 'build',
    district: 'weather',
    graphType: 'line',
    title: 'EVENT 2 (4/5): Graph-Driven Rain Intensity',
    instruction: 'The 3D rain simulation directly matches this curve! Plot intensity: 1 PM: 5mm/h, 2 PM: 20mm/h, 3 PM: 40mm/h, 4 PM: 25mm/h, 5 PM: 10mm/h.',
    dataTable: [
      { label: '1 PM', value: 5 },
      { label: '2 PM', value: 20 },
      { label: '3 PM', value: 40 },
      { label: '4 PM', value: 25 },
      { label: '5 PM', value: 10 },
    ],
    xAxis: { title: 'Afternoon', min: 0, max: 4, step: 1, labels: ['1 PM', '2 PM', '3 PM', '4 PM', '5 PM'] },
    yAxis: { title: 'Intensity (mm/h)', min: 0, max: 50, step: 5, labels: ['0', '10', '20', '30', '40', '50'] },
    expectedValues: [5, 20, 40, 25, 10],
    unit: 'mm/h',
    difficulty: 3,
  },
  {
    id: 'EV2-Q10-PIE',
    round: 10,
    phase: 'build',
    district: 'weather',
    graphType: 'pie',
    title: 'EVENT 2 (5/5): Weekly Sky Condition Summary',
    instruction: 'FINALE: Skies clear, revealing brilliant sunlight! Plot weekly weather share: Sunny 40%, Cloudy 30%, Rainy 20%, Stormy 10%.',
    dataTable: [
      { label: 'Sunny', value: 40 },
      { label: 'Cloudy', value: 30 },
      { label: 'Rainy', value: 20 },
      { label: 'Stormy', value: 10 },
    ],
    xAxis: { title: 'Weather', min: 0, max: 3, step: 1, labels: ['Sunny', 'Cloudy', 'Rainy', 'Stormy'] },
    yAxis: { title: 'Share (%)', min: 0, max: 100, step: 5, labels: ['0%', '25%', '50%', '75%', '100%'] },
    expectedValues: [40, 30, 20, 10],
    unit: '%',
    difficulty: 3,
  },

  // ── EVENT 3: CITY TRAFFIC RUSH (Q11–15) ──
  {
    id: 'EV3-Q11-BAR',
    round: 11,
    phase: 'build',
    district: 'traffic',
    graphType: 'bar',
    title: 'EVENT 3 (1/5): Arterial Corridor Traffic',
    instruction: 'Traffic begins entering city arteries! Plot vehicle volumes: Corridor 1: 20, Corridor 2: 40, Corridor 3: 60, Corridor 4: 30, Corridor 5: 50.',
    dataTable: [
      { label: 'Corridor 1', value: 20 },
      { label: 'Corridor 2', value: 40 },
      { label: 'Corridor 3', value: 60 },
      { label: 'Corridor 4', value: 30 },
      { label: 'Corridor 5', value: 50 },
    ],
    xAxis: { title: 'Corridor', min: 0, max: 4, step: 1, labels: ['Corridor 1', 'Corridor 2', 'Corridor 3', 'Corridor 4', 'Corridor 5'] },
    yAxis: { title: 'Vehicles/min', min: 0, max: 80, step: 10, labels: ['0', '20', '40', '60', '80'] },
    expectedValues: [20, 40, 60, 30, 50],
    unit: 'veh/min',
    difficulty: 2,
  },
  {
    id: 'EV3-Q12-PICTO',
    round: 12,
    phase: 'build',
    district: 'traffic',
    graphType: 'pictograph',
    title: 'EVENT 3 (2/5): City Bus Commuter Counts',
    instruction: 'Metro buses arrive at junctions. Key: 1 🚌 = 5 Commuters. Plot passenger loads: Line 1: 30, Line 2: 45, Line 3: 60, Line 4: 25.',
    dataTable: [
      { label: 'Line 1', value: 30 },
      { label: 'Line 2', value: 45 },
      { label: 'Line 3', value: 60 },
      { label: 'Line 4', value: 25 },
    ],
    xAxis: { title: 'Bus Line', min: 0, max: 3, step: 1, labels: ['Line 1', 'Line 2', 'Line 3', 'Line 4'] },
    yAxis: { title: 'Passengers', min: 0, max: 70, step: 5, labels: ['0', '20', '40', '60'] },
    expectedValues: [30, 45, 60, 25],
    unit: 'passengers',
    difficulty: 2,
  },
  {
    id: 'EV3-Q13-LINE',
    round: 13,
    phase: 'build',
    district: 'traffic',
    graphType: 'line',
    title: 'EVENT 3 (3/5): Intersection Queue Length',
    instruction: 'Watch 3D cars queue at the smart traffic lights! Plot queue length: 8 AM: 10m, 8:15 AM: 35m, 8:30 AM: 75m, 8:45 AM: 50m, 9 AM: 20m.',
    dataTable: [
      { label: '8:00 AM', value: 10 },
      { label: '8:15 AM', value: 35 },
      { label: '8:30 AM', value: 75 },
      { label: '8:45 AM', value: 50 },
      { label: '9:00 AM', value: 20 },
    ],
    xAxis: { title: 'Time', min: 0, max: 4, step: 1, labels: ['8:00 AM', '8:15 AM', '8:30 AM', '8:45 AM', '9:00 AM'] },
    yAxis: { title: 'Queue (m)', min: 0, max: 90, step: 10, labels: ['0', '20', '40', '60', '80'] },
    expectedValues: [10, 35, 75, 50, 20],
    unit: 'm',
    difficulty: 3,
  },
  {
    id: 'EV3-Q14-BAR',
    round: 14,
    phase: 'build',
    district: 'traffic',
    graphType: 'bar',
    title: 'EVENT 3 (4/5): Crosswalk Pedestrian Activity',
    instruction: 'Pedestrians use the zebra crosswalks. Plot counts: Crosswalk 1: 25, Crosswalk 2: 50, Crosswalk 3: 80, Crosswalk 4: 65, Crosswalk 5: 35.',
    dataTable: [
      { label: 'CW 1', value: 25 },
      { label: 'CW 2', value: 50 },
      { label: 'CW 3', value: 80 },
      { label: 'CW 4', value: 65 },
      { label: 'CW 5', value: 35 },
    ],
    xAxis: { title: 'Crosswalk', min: 0, max: 4, step: 1, labels: ['CW 1', 'CW 2', 'CW 3', 'CW 4', 'CW 5'] },
    yAxis: { title: 'Pedestrians', min: 0, max: 100, step: 10, labels: ['0', '25', '50', '75', '100'] },
    expectedValues: [25, 50, 80, 65, 35],
    unit: 'pedestrians',
    difficulty: 3,
  },
  {
    id: 'EV3-Q15-LINE',
    round: 15,
    phase: 'build',
    district: 'traffic',
    graphType: 'line',
    title: 'EVENT 3 (5/5): Traffic Flow Optimization',
    instruction: 'FINALE: The smart traffic grid optimizes and clears smoothly! Plot clearance: 9 AM: 85, 9:30 AM: 60, 10 AM: 40, 10:30 AM: 25, 11 AM: 15.',
    dataTable: [
      { label: '9:00 AM', value: 85 },
      { label: '9:30 AM', value: 60 },
      { label: '10:00 AM', value: 40 },
      { label: '10:30 AM', value: 25 },
      { label: '11:00 AM', value: 15 },
    ],
    xAxis: { title: 'Time', min: 0, max: 4, step: 1, labels: ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM'] },
    yAxis: { title: 'Flow Delay', min: 0, max: 100, step: 10, labels: ['0', '25', '50', '75', '100'] },
    expectedValues: [85, 60, 40, 25, 15],
    unit: 'index',
    difficulty: 3,
  },

  // ── EVENT 4: WATER CITY OPERATION (Q16–20) ──
  {
    id: 'EV4-Q16-LINE',
    round: 16,
    phase: 'build',
    district: 'water',
    graphType: 'line',
    title: 'EVENT 4 (1/5): Aqueduct Pipeline Inflow',
    instruction: 'Water begins flowing through city conduits! Plot pipeline flow: 6 AM: 20 kL/h, 8 AM: 45 kL/h, 10 AM: 70 kL/h, 12 PM: 65 kL/h, 2 PM: 50 kL/h.',
    dataTable: [
      { label: '6 AM', value: 20 },
      { label: '8 AM', value: 45 },
      { label: '10 AM', value: 70 },
      { label: '12 PM', value: 65 },
      { label: '2 PM', value: 50 },
    ],
    xAxis: { title: 'Time', min: 0, max: 4, step: 1, labels: ['6 AM', '8 AM', '10 AM', '12 PM', '2 PM'] },
    yAxis: { title: 'Flow Rate (kL/h)', min: 0, max: 80, step: 10, labels: ['0', '20', '40', '60', '80'] },
    expectedValues: [20, 45, 70, 65, 50],
    unit: 'kL/h',
    difficulty: 2,
  },
  {
    id: 'EV4-Q17-BAR',
    round: 17,
    phase: 'build',
    district: 'water',
    graphType: 'bar',
    title: 'EVENT 4 (2/5): Primary Pump Station Output',
    instruction: 'The water plant primary pumps activate! Plot power draw: Pump 1: 25 kW, Pump 2: 50 kW, Pump 3: 75 kW, Pump 4: 60 kW.',
    dataTable: [
      { label: 'Pump 1', value: 25 },
      { label: 'Pump 2', value: 50 },
      { label: 'Pump 3', value: 75 },
      { label: 'Pump 4', value: 60 },
    ],
    xAxis: { title: 'Pumps', min: 0, max: 3, step: 1, labels: ['Pump 1', 'Pump 2', 'Pump 3', 'Pump 4'] },
    yAxis: { title: 'Output (kW)', min: 0, max: 100, step: 10, labels: ['0', '25', '50', '75', '100'] },
    expectedValues: [25, 50, 75, 60],
    unit: 'kW',
    difficulty: 2,
  },
  {
    id: 'EV4-Q18-LINE',
    round: 18,
    phase: 'build',
    district: 'water',
    graphType: 'line',
    title: 'EVENT 4 (3/5): Main Reservoir Filling Depth',
    instruction: 'The 3D transparent reservoir tank fills in real-time! Plot water level: Hr 1: 20%, Hr 2: 40%, Hr 3: 65%, Hr 4: 85%, Hr 5: 95%.',
    dataTable: [
      { label: 'Hr 1', value: 20 },
      { label: 'Hr 2', value: 40 },
      { label: 'Hr 3', value: 65 },
      { label: 'Hr 4', value: 85 },
      { label: 'Hr 5', value: 95 },
    ],
    xAxis: { title: 'Cycle Hour', min: 0, max: 4, step: 1, labels: ['Hr 1', 'Hr 2', 'Hr 3', 'Hr 4', 'Hr 5'] },
    yAxis: { title: 'Level (%)', min: 0, max: 100, step: 10, labels: ['0%', '25%', '50%', '75%', '100%'] },
    expectedValues: [20, 40, 65, 85, 95],
    unit: '%',
    difficulty: 3,
  },
  {
    id: 'EV4-Q19-PIE',
    round: 19,
    phase: 'build',
    district: 'water',
    graphType: 'pie',
    title: 'EVENT 4 (4/5): City Water Distribution Quota',
    instruction: 'Allocate city water supply across sectors: Residential 40%, Commercial 25%, Industrial 20%, Parks & Fountains 15%.',
    dataTable: [
      { label: 'Residential', value: 40 },
      { label: 'Commercial', value: 25 },
      { label: 'Industrial', value: 20 },
      { label: 'Parks/Jets', value: 15 },
    ],
    xAxis: { title: 'Sector', min: 0, max: 3, step: 1, labels: ['Residential', 'Commercial', 'Industrial', 'Parks/Jets'] },
    yAxis: { title: 'Share (%)', min: 0, max: 100, step: 5, labels: ['0%', '25%', '50%', '75%', '100%'] },
    expectedValues: [40, 25, 20, 15],
    unit: '%',
    difficulty: 3,
  },
  {
    id: 'EV4-Q20-BAR',
    round: 20,
    phase: 'build',
    district: 'water',
    graphType: 'bar',
    title: 'EVENT 4 (5/5): Grand Plaza Fountain Jet Surge',
    instruction: 'FINALE: Complete the water operation and watch the grand fountains surge! Plot pressures: Jet 1: 30, Jet 2: 55, Jet 3: 85, Jet 4: 70, Jet 5: 45.',
    dataTable: [
      { label: 'Jet 1', value: 30 },
      { label: 'Jet 2', value: 55 },
      { label: 'Jet 3', value: 85 },
      { label: 'Jet 4', value: 70 },
      { label: 'Jet 5', value: 45 },
    ],
    xAxis: { title: 'Fountain Jet', min: 0, max: 4, step: 1, labels: ['Jet 1', 'Jet 2', 'Jet 3', 'Jet 4', 'Jet 5'] },
    yAxis: { title: 'Height (kPa)', min: 0, max: 100, step: 10, labels: ['0', '25', '50', '75', '100'] },
    expectedValues: [30, 55, 85, 70, 45],
    unit: 'kPa',
    difficulty: 3,
  },

  // ── EVENT 5: CITY POWER SURGE (Q21–25) ──
  {
    id: 'EV5-Q21-LINE',
    round: 21,
    phase: 'build',
    district: 'power',
    graphType: 'line',
    title: 'EVENT 5 (1/5): Power Turbine Spool-Up',
    instruction: 'Turbines begin spinning at the power plant! Plot RPM curve: 0s: 1000, 10s: 2500, 20s: 4000, 30s: 5000, 40s: 5000.',
    dataTable: [
      { label: '0s', value: 1000 },
      { label: '10s', value: 2500 },
      { label: '20s', value: 4000 },
      { label: '30s', value: 5000 },
      { label: '40s', value: 5000 },
    ],
    xAxis: { title: 'Time', min: 0, max: 4, step: 1, labels: ['0s', '10s', '20s', '30s', '40s'] },
    yAxis: { title: 'Turbine (RPM)', min: 0, max: 6000, step: 1000, labels: ['0', '2k', '4k', '6k'] },
    expectedValues: [1000, 2500, 4000, 5000, 5000],
    unit: 'RPM',
    difficulty: 2,
  },
  {
    id: 'EV5-Q22-BAR',
    round: 22,
    phase: 'build',
    district: 'power',
    graphType: 'bar',
    title: 'EVENT 5 (2/5): Substation Megawatt Output',
    instruction: 'Transmission lines begin humming with energy! Plot substation output: Sub A: 30 MW, Sub B: 55 MW, Sub C: 85 MW, Sub D: 60 MW.',
    dataTable: [
      { label: 'Sub A', value: 30 },
      { label: 'Sub B', value: 55 },
      { label: 'Sub C', value: 85 },
      { label: 'Sub D', value: 60 },
    ],
    xAxis: { title: 'Substation', min: 0, max: 3, step: 1, labels: ['Sub A', 'Sub B', 'Sub C', 'Sub D'] },
    yAxis: { title: 'Power (MW)', min: 0, max: 100, step: 10, labels: ['0', '25', '50', '75', '100'] },
    expectedValues: [30, 55, 85, 60],
    unit: 'MW',
    difficulty: 2,
  },
  {
    id: 'EV5-Q23-LINE',
    round: 23,
    phase: 'build',
    district: 'power',
    graphType: 'line',
    title: 'EVENT 5 (3/5): Evening Power Demand Peak',
    instruction: 'Substation corona rings illuminate! Plot evening demand: 4 PM: 35 MW, 6 PM: 65 MW, 8 PM: 95 MW, 10 PM: 75 MW, 12 AM: 40 MW.',
    dataTable: [
      { label: '4 PM', value: 35 },
      { label: '6 PM', value: 65 },
      { label: '8 PM', value: 95 },
      { label: '10 PM', value: 75 },
      { label: '12 AM', value: 40 },
    ],
    xAxis: { title: 'Time', min: 0, max: 4, step: 1, labels: ['4 PM', '6 PM', '8 PM', '10 PM', '12 AM'] },
    yAxis: { title: 'Demand (MW)', min: 0, max: 100, step: 10, labels: ['0', '25', '50', '75', '100'] },
    expectedValues: [35, 65, 95, 75, 40],
    unit: 'MW',
    difficulty: 3,
  },
  {
    id: 'EV5-Q24-PIE',
    round: 24,
    phase: 'build',
    district: 'power',
    graphType: 'pie',
    title: 'EVENT 5 (4/5): Clean Grid Balance Mix',
    instruction: 'Balance the electrical generation share: Solar 35%, Wind 30%, Hydro 25%, Battery Storage 10% (Total: 100%).',
    dataTable: [
      { label: 'Solar', value: 35 },
      { label: 'Wind', value: 30 },
      { label: 'Hydro', value: 25 },
      { label: 'Battery', value: 10 },
    ],
    xAxis: { title: 'Resource', min: 0, max: 3, step: 1, labels: ['Solar', 'Wind', 'Hydro', 'Battery'] },
    yAxis: { title: 'Share (%)', min: 0, max: 100, step: 5, labels: ['0%', '25%', '50%', '75%', '100%'] },
    expectedValues: [35, 30, 25, 10],
    unit: '%',
    difficulty: 3,
  },
  {
    id: 'EV5-Q25-BAR',
    round: 25,
    phase: 'build',
    district: 'power',
    graphType: 'bar',
    title: 'EVENT 5 (5/5): Full Grid Energy Stability',
    instruction: 'FINALE: Stabilize the entire metropolitan electrical grid! Plot efficiency: Dist 1: 75%, Dist 2: 85%, Dist 3: 95%, Dist 4: 90%, Dist 5: 80%.',
    dataTable: [
      { label: 'Dist 1', value: 75 },
      { label: 'Dist 2', value: 85 },
      { label: 'Dist 3', value: 95 },
      { label: 'Dist 4', value: 90 },
      { label: 'Dist 5', value: 80 },
    ],
    xAxis: { title: 'District', min: 0, max: 4, step: 1, labels: ['Dist 1', 'Dist 2', 'Dist 3', 'Dist 4', 'Dist 5'] },
    yAxis: { title: 'Efficiency (%)', min: 0, max: 100, step: 10, labels: ['0%', '25%', '50%', '75%', '100%'] },
    expectedValues: [75, 85, 95, 90, 80],
    unit: '%',
    difficulty: 3,
  },

  // ── EVENT 6: TRAIN NETWORK DAY (Q26–30) ──
  {
    id: 'EV6-Q26-PICTO',
    round: 26,
    phase: 'build',
    district: 'train',
    graphType: 'pictograph',
    title: 'EVENT 6 (1/5): Platform Boarding Crowds',
    instruction: 'Bullet train awaits at platform! Key: 1 👤 = 5 Passengers. Plot waiting crowds: Stn A: 20, Stn B: 35, Stn C: 50, Stn D: 30.',
    dataTable: [
      { label: 'Stn A', value: 20 },
      { label: 'Stn B', value: 35 },
      { label: 'Stn C', value: 50 },
      { label: 'Stn D', value: 30 },
    ],
    xAxis: { title: 'Station', min: 0, max: 3, step: 1, labels: ['Stn A', 'Stn B', 'Stn C', 'Stn D'] },
    yAxis: { title: 'Passengers', min: 0, max: 60, step: 5, labels: ['0', '15', '30', '45', '60'] },
    expectedValues: [20, 35, 50, 30],
    unit: 'passengers',
    difficulty: 2,
  },
  {
    id: 'EV6-Q27-LINE',
    round: 27,
    phase: 'build',
    district: 'train',
    graphType: 'line',
    title: 'EVENT 6 (2/5): Bullet Train Acceleration',
    instruction: 'Doors lock and signals change to green! Plot acceleration: 0s: 0 km/h, 10s: 30 km/h, 20s: 60 km/h, 30s: 90 km/h, 40s: 120 km/h.',
    dataTable: [
      { label: '0s', value: 0 },
      { label: '10s', value: 30 },
      { label: '20s', value: 60 },
      { label: '30s', value: 90 },
      { label: '40s', value: 120 },
    ],
    xAxis: { title: 'Time', min: 0, max: 4, step: 1, labels: ['0s', '10s', '20s', '30s', '40s'] },
    yAxis: { title: 'Speed (km/h)', min: 0, max: 140, step: 20, labels: ['0', '35', '70', '105', '140'] },
    expectedValues: [0, 30, 60, 90, 120],
    unit: 'km/h',
    difficulty: 2,
  },
  {
    id: 'EV6-Q28-LINE',
    round: 28,
    phase: 'build',
    district: 'train',
    graphType: 'line',
    title: 'EVENT 6 (3/5): Metro Distance & Station Halt',
    instruction: 'The 3D bullet train moves along the viaduct and stops at 4–6 min! Plot: 0min: 0m, 2min: 25m, 4min: 50m, 6min: 50m (Halt!), 8min: 80m, 10min: 100m.',
    dataTable: [
      { label: '0 min', value: 0 },
      { label: '2 min', value: 25 },
      { label: '4 min', value: 50 },
      { label: '6 min', value: 50 },
      { label: '8 min', value: 80 },
      { label: '10 min', value: 100 },
    ],
    xAxis: { title: 'Journey Time', min: 0, max: 5, step: 1, labels: ['0 min', '2 min', '4 min', '6 min', '8 min', '10 min'] },
    yAxis: { title: 'Distance (m)', min: 0, max: 100, step: 10, labels: ['0', '20', '40', '60', '80', '100'] },
    expectedValues: [0, 25, 50, 50, 80, 100],
    unit: 'm',
    difficulty: 3,
  },
  {
    id: 'EV6-Q29-BAR',
    round: 29,
    phase: 'build',
    district: 'train',
    graphType: 'bar',
    title: 'EVENT 6 (4/5): Inter-Station Travel Times',
    instruction: 'Compare travel durations across railway legs: Leg 1: 4 min, Leg 2: 7 min, Leg 3: 10 min, Leg 4: 5 min.',
    dataTable: [
      { label: 'Leg 1', value: 4 },
      { label: 'Leg 2', value: 7 },
      { label: 'Leg 3', value: 10 },
      { label: 'Leg 4', value: 5 },
    ],
    xAxis: { title: 'Leg', min: 0, max: 3, step: 1, labels: ['Leg 1', 'Leg 2', 'Leg 3', 'Leg 4'] },
    yAxis: { title: 'Time (min)', min: 0, max: 12, step: 2, labels: ['0', '3', '6', '9', '12'] },
    expectedValues: [4, 7, 10, 5],
    unit: 'min',
    difficulty: 3,
  },
  {
    id: 'EV6-Q30-PIE',
    round: 30,
    phase: 'build',
    district: 'train',
    graphType: 'pie',
    title: 'EVENT 6 (5/5): Commuter Journey Purposes',
    instruction: 'FINALE: Train reaches its final destination! Plot trip breakdown: Office Work 50%, School 25%, Shopping 15%, Tourism 10%.',
    dataTable: [
      { label: 'Work', value: 50 },
      { label: 'School', value: 25 },
      { label: 'Shopping', value: 15 },
      { label: 'Tourism', value: 10 },
    ],
    xAxis: { title: 'Purpose', min: 0, max: 3, step: 1, labels: ['Work', 'School', 'Shopping', 'Tourism'] },
    yAxis: { title: 'Share (%)', min: 0, max: 100, step: 5, labels: ['0%', '25%', '50%', '75%', '100%'] },
    expectedValues: [50, 25, 15, 10],
    unit: '%',
    difficulty: 3,
  },

  // ── EVENT 7: CITY PARK FESTIVAL (Q31–35) ──
  {
    id: 'EV7-Q31-PICTO',
    round: 31,
    phase: 'build',
    district: 'park',
    graphType: 'pictograph',
    title: 'EVENT 7 (1/5): Park Gazebo Morning Strollers',
    instruction: 'The botanical park festival opens! Key: 1 🌸 = 5 Visitors. Plot visitors: Gazebo 1: 15, Gazebo 2: 25, Gazebo 3: 40, Gazebo 4: 20.',
    dataTable: [
      { label: 'Gazebo 1', value: 15 },
      { label: 'Gazebo 2', value: 25 },
      { label: 'Gazebo 3', value: 40 },
      { label: 'Gazebo 4', value: 20 },
    ],
    xAxis: { title: 'Gazebo', min: 0, max: 3, step: 1, labels: ['Gazebo 1', 'Gazebo 2', 'Gazebo 3', 'Gazebo 4'] },
    yAxis: { title: 'Visitors', min: 0, max: 50, step: 5, labels: ['0', '15', '30', '45'] },
    expectedValues: [15, 25, 40, 20],
    unit: 'visitors',
    difficulty: 2,
  },
  {
    id: 'EV7-Q32-BAR',
    round: 32,
    phase: 'build',
    district: 'park',
    graphType: 'bar',
    title: 'EVENT 7 (2/5): Festival Food Kiosk Sales',
    instruction: 'Festival food stalls open in the park! Plot items sold: Gelato: 30, Pretzels: 50, Lemonade: 75, Pastries: 45.',
    dataTable: [
      { label: 'Gelato', value: 30 },
      { label: 'Pretzels', value: 50 },
      { label: 'Lemonade', value: 75 },
      { label: 'Pastries', value: 45 },
    ],
    xAxis: { title: 'Item', min: 0, max: 3, step: 1, labels: ['Gelato', 'Pretzels', 'Lemonade', 'Pastries'] },
    yAxis: { title: 'Units Sold', min: 0, max: 90, step: 10, labels: ['0', '25', '50', '75', '90'] },
    expectedValues: [30, 50, 75, 45],
    unit: 'units',
    difficulty: 2,
  },
  {
    id: 'EV7-Q33-LINE',
    round: 33,
    phase: 'build',
    district: 'park',
    graphType: 'line',
    title: 'EVENT 7 (3/5): Park Festival Attendance Curve',
    instruction: 'Crowds fill the park and center fountain jets rise! Plot attendance: 10 AM: 20, 12 PM: 55, 2 PM: 90, 4 PM: 85, 6 PM: 50.',
    dataTable: [
      { label: '10 AM', value: 20 },
      { label: '12 PM', value: 55 },
      { label: '2 PM', value: 90 },
      { label: '4 PM', value: 85 },
      { label: '6 PM', value: 50 },
    ],
    xAxis: { title: 'Time', min: 0, max: 4, step: 1, labels: ['10 AM', '12 PM', '2 PM', '4 PM', '6 PM'] },
    yAxis: { title: 'Crowd (people)', min: 0, max: 100, step: 10, labels: ['0', '25', '50', '75', '100'] },
    expectedValues: [20, 55, 90, 85, 50],
    unit: 'people',
    difficulty: 3,
  },
  {
    id: 'EV7-Q34-BAR',
    round: 34,
    phase: 'build',
    district: 'park',
    graphType: 'bar',
    title: 'EVENT 7 (4/5): Botanical Garden Flora Display',
    instruction: 'Plot the botanical display flora: Roses: 35, Tulips: 55, Lilies: 80, Ferns: 40, Orchids: 65.',
    dataTable: [
      { label: 'Roses', value: 35 },
      { label: 'Tulips', value: 55 },
      { label: 'Lilies', value: 80 },
      { label: 'Ferns', value: 40 },
      { label: 'Orchids', value: 65 },
    ],
    xAxis: { title: 'Species', min: 0, max: 4, step: 1, labels: ['Roses', 'Tulips', 'Lilies', 'Ferns', 'Orchids'] },
    yAxis: { title: 'Plants', min: 0, max: 100, step: 10, labels: ['0', '25', '50', '75', '100'] },
    expectedValues: [35, 55, 80, 40, 65],
    unit: 'plants',
    difficulty: 3,
  },
  {
    id: 'EV7-Q35-PIE',
    round: 35,
    phase: 'build',
    district: 'park',
    graphType: 'pie',
    title: 'EVENT 7 (5/5): Festival Activity Popularity',
    instruction: 'FINALE: Park festival reaches grand conclusion! Plot preferences: Live Music 40%, Games 25%, Food Market 20%, Art Walk 15%.',
    dataTable: [
      { label: 'Live Music', value: 40 },
      { label: 'Games', value: 25 },
      { label: 'Food Market', value: 20 },
      { label: 'Art Walk', value: 15 },
    ],
    xAxis: { title: 'Activity', min: 0, max: 3, step: 1, labels: ['Live Music', 'Games', 'Food Market', 'Art Walk'] },
    yAxis: { title: 'Share (%)', min: 0, max: 100, step: 5, labels: ['0%', '25%', '50%', '75%', '100%'] },
    expectedValues: [40, 25, 20, 15],
    unit: '%',
    difficulty: 3,
  },

  // ── EVENT 8: CITY DEVELOPMENT / CONSTRUCTION (Q36–40) ──
  {
    id: 'EV8-Q36-BAR',
    round: 36,
    phase: 'build',
    district: 'construction' as any,
    graphType: 'bar',
    title: 'EVENT 8 (1/5): Innovation Block Groundbreaking',
    instruction: 'Scaffolding & safety cones appear at the construction site! Plot excavation volumes: Sector A: 20 m³, Sector B: 40 m³, Sector C: 65 m³, Sector D: 35 m³.',
    dataTable: [
      { label: 'Sector A', value: 20 },
      { label: 'Sector B', value: 40 },
      { label: 'Sector C', value: 65 },
      { label: 'Sector D', value: 35 },
    ],
    xAxis: { title: 'Sector', min: 0, max: 3, step: 1, labels: ['Sector A', 'Sector B', 'Sector C', 'Sector D'] },
    yAxis: { title: 'Volume (m³)', min: 0, max: 80, step: 10, labels: ['0', '20', '40', '60', '80'] },
    expectedValues: [20, 40, 65, 35],
    unit: 'm³',
    difficulty: 2,
  },
  {
    id: 'EV8-Q37-LINE',
    round: 37,
    phase: 'build',
    district: 'construction' as any,
    graphType: 'line',
    title: 'EVENT 8 (2/5): Tower Crane Hoisting Weight',
    instruction: 'Watch the yellow 3D tower crane swing and hoist beams! Plot crane load: Lift 1: 15t, Lift 2: 30t, Lift 3: 45t, Lift 4: 25t, Lift 5: 10t.',
    dataTable: [
      { label: 'Lift 1', value: 15 },
      { label: 'Lift 2', value: 30 },
      { label: 'Lift 3', value: 45 },
      { label: 'Lift 4', value: 25 },
      { label: 'Lift 5', value: 10 },
    ],
    xAxis: { title: 'Lift Sequence', min: 0, max: 4, step: 1, labels: ['Lift 1', 'Lift 2', 'Lift 3', 'Lift 4', 'Lift 5'] },
    yAxis: { title: 'Weight (tons)', min: 0, max: 60, step: 5, labels: ['0', '15', '30', '45', '60'] },
    expectedValues: [15, 30, 45, 25, 10],
    unit: 'tons',
    difficulty: 2,
  },
  {
    id: 'EV8-Q38-BAR',
    round: 38,
    phase: 'build',
    district: 'construction' as any,
    graphType: 'bar',
    title: 'EVENT 8 (3/5): Modular Building Story Assembly',
    instruction: 'Stories are added to the rising building! Plot structural steel beams: Floor 1: 25, Floor 2: 40, Floor 3: 55, Floor 4: 35.',
    dataTable: [
      { label: 'Floor 1', value: 25 },
      { label: 'Floor 2', value: 40 },
      { label: 'Floor 3', value: 55 },
      { label: 'Floor 4', value: 35 },
    ],
    xAxis: { title: 'Story', min: 0, max: 3, step: 1, labels: ['Floor 1', 'Floor 2', 'Floor 3', 'Floor 4'] },
    yAxis: { title: 'Beams', min: 0, max: 70, step: 10, labels: ['0', '20', '40', '60'] },
    expectedValues: [25, 40, 55, 35],
    unit: 'beams',
    difficulty: 3,
  },
  {
    id: 'EV8-Q39-LINE',
    round: 39,
    phase: 'build',
    district: 'construction' as any,
    graphType: 'line',
    title: 'EVENT 8 (4/5): Structural Completion Timeline',
    instruction: 'Road connection paved and streetlights connected! Plot completion: Week 1: 20%, Week 2: 45%, Week 3: 70%, Week 4: 90%, Week 5: 100%.',
    dataTable: [
      { label: 'Wk 1', value: 20 },
      { label: 'Wk 2', value: 45 },
      { label: 'Wk 3', value: 70 },
      { label: 'Wk 4', value: 90 },
      { label: 'Wk 5', value: 100 },
    ],
    xAxis: { title: 'Timeline', min: 0, max: 4, step: 1, labels: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Wk 5'] },
    yAxis: { title: 'Progress (%)', min: 0, max: 100, step: 10, labels: ['0%', '25%', '50%', '75%', '100%'] },
    expectedValues: [20, 45, 70, 90, 100],
    unit: '%',
    difficulty: 3,
  },
  {
    id: 'EV8-Q40-PIE',
    round: 40,
    phase: 'build',
    district: 'construction' as any,
    graphType: 'pie',
    title: 'EVENT 8 (5/5): Innovation Tower Floor Allocation',
    instruction: 'FINALE: Ribbon cutting! The new modern tower is complete and permanently open! Plot space allocation: Tech Labs 40%, Green Atrium 25%, Startups 20%, Sky Garden 15%.',
    dataTable: [
      { label: 'Tech Labs', value: 40 },
      { label: 'Atrium', value: 25 },
      { label: 'Startups', value: 20 },
      { label: 'Sky Garden', value: 15 },
    ],
    xAxis: { title: 'Facility', min: 0, max: 3, step: 1, labels: ['Tech Labs', 'Atrium', 'Startups', 'Sky Garden'] },
    yAxis: { title: 'Share (%)', min: 0, max: 100, step: 5, labels: ['0%', '25%', '50%', '75%', '100%'] },
    expectedValues: [40, 25, 20, 15],
    unit: '%',
    difficulty: 3,
  },

  // ── EVENT 9: GRAND DATA FESTIVAL (Q41–45) ──
  {
    id: 'EV9-Q41-BAR',
    round: 41,
    phase: 'build',
    district: 'city',
    graphType: 'bar',
    title: 'EVENT 9 (1/5): Central Plaza Festive Banners',
    instruction: 'The entire city prepares to celebrate! Plot banner heights across the plaza: Pylon 1: 15m, Pylon 2: 25m, Pylon 3: 40m, Pylon 4: 30m, Pylon 5: 20m.',
    dataTable: [
      { label: 'Pylon 1', value: 15 },
      { label: 'Pylon 2', value: 25 },
      { label: 'Pylon 3', value: 40 },
      { label: 'Pylon 4', value: 30 },
      { label: 'Pylon 5', value: 20 },
    ],
    xAxis: { title: 'Pylon', min: 0, max: 4, step: 1, labels: ['Pylon 1', 'Pylon 2', 'Pylon 3', 'Pylon 4', 'Pylon 5'] },
    yAxis: { title: 'Height (m)', min: 0, max: 50, step: 5, labels: ['0', '10', '20', '30', '40', '50'] },
    expectedValues: [15, 25, 40, 30, 20],
    unit: 'm',
    difficulty: 2,
  },
  {
    id: 'EV9-Q42-LINE',
    round: 42,
    phase: 'build',
    district: 'city',
    graphType: 'line',
    title: 'EVENT 9 (2/5): Plaza Concert Audio Decibels',
    instruction: 'Synchronized bullet trains glide past cheering crowds! Plot evening acoustic levels: 6 PM: 50 dB, 7 PM: 70 dB, 8 PM: 90 dB, 9 PM: 85 dB, 10 PM: 60 dB.',
    dataTable: [
      { label: '6 PM', value: 50 },
      { label: '7 PM', value: 70 },
      { label: '8 PM', value: 90 },
      { label: '9 PM', value: 85 },
      { label: '10 PM', value: 60 },
    ],
    xAxis: { title: 'Time', min: 0, max: 4, step: 1, labels: ['6 PM', '7 PM', '8 PM', '9 PM', '10 PM'] },
    yAxis: { title: 'Sound (dB)', min: 0, max: 100, step: 10, labels: ['0', '25', '50', '75', '100'] },
    expectedValues: [50, 70, 90, 85, 60],
    unit: 'dB',
    difficulty: 2,
  },
  {
    id: 'EV9-Q43-PICTO',
    round: 43,
    phase: 'build',
    district: 'city',
    graphType: 'pictograph',
    title: 'EVENT 9 (3/5): Citizen Happiness Ratings',
    instruction: 'Key: 1 ⭐ = 5 Points. Plot civic satisfaction ratings: Ward 1: 30, Ward 2: 45, Ward 3: 60, Ward 4: 40.',
    dataTable: [
      { label: 'Ward 1', value: 30 },
      { label: 'Ward 2', value: 45 },
      { label: 'Ward 3', value: 60 },
      { label: 'Ward 4', value: 40 },
    ],
    xAxis: { title: 'City Ward', min: 0, max: 3, step: 1, labels: ['Ward 1', 'Ward 2', 'Ward 3', 'Ward 4'] },
    yAxis: { title: 'Score', min: 0, max: 70, step: 5, labels: ['0', '20', '40', '60'] },
    expectedValues: [30, 45, 60, 40],
    unit: 'pts',
    difficulty: 3,
  },
  {
    id: 'EV9-Q44-PIE',
    round: 44,
    phase: 'build',
    district: 'city',
    graphType: 'pie',
    title: 'EVENT 9 (4/5): Metropolitan Energy Harvest',
    instruction: 'All districts operate in peak harmony! Plot energy breakdown: Solar 35%, Hydro 30%, Wind 25%, Biomass 10%.',
    dataTable: [
      { label: 'Solar', value: 35 },
      { label: 'Hydro', value: 30 },
      { label: 'Wind', value: 25 },
      { label: 'Biomass', value: 10 },
    ],
    xAxis: { title: 'Generation', min: 0, max: 3, step: 1, labels: ['Solar', 'Hydro', 'Wind', 'Biomass'] },
    yAxis: { title: 'Share (%)', min: 0, max: 100, step: 5, labels: ['0%', '25%', '50%', '75%', '100%'] },
    expectedValues: [35, 30, 25, 10],
    unit: '%',
    difficulty: 3,
  },
  {
    id: 'EV9-Q45-LINE',
    round: 45,
    phase: 'build',
    district: 'city',
    graphType: 'line',
    title: 'EVENT 9 (5/5): Data City Efficiency Finale',
    instruction: 'FINALE: Celebratory light rings illuminate the Data Tower! Plot multi-year efficiency: Year 1: 50%, Year 2: 65%, Year 3: 80%, Year 4: 92%, Year 5: 99%.',
    dataTable: [
      { label: 'Year 1', value: 50 },
      { label: 'Year 2', value: 65 },
      { label: 'Year 3', value: 80 },
      { label: 'Year 4', value: 92 },
      { label: 'Year 5', value: 99 },
    ],
    xAxis: { title: 'Timeline', min: 0, max: 4, step: 1, labels: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'] },
    yAxis: { title: 'Efficiency (%)', min: 0, max: 100, step: 10, labels: ['0%', '25%', '50%', '75%', '100%'] },
    expectedValues: [50, 65, 80, 92, 99],
    unit: '%',
    difficulty: 3,
  },

  // ── EVENT 10: THE DATA CRISIS RESOLUTION (Q46–50) ──
  {
    id: 'EV10-Q46-BAR',
    round: 46,
    phase: 'build',
    district: 'power',
    graphType: 'bar',
    title: 'EVENT 10 (1/5): Emergency Power Grid Deficit',
    instruction: 'RED ALERT: Sudden surge overload! Plot the deficit needing emergency rerouting: Sector 1: 30 MW, Sector 2: 55 MW, Sector 3: 80 MW, Sector 4: 45 MW.',
    dataTable: [
      { label: 'Sector 1', value: 30 },
      { label: 'Sector 2', value: 55 },
      { label: 'Sector 3', value: 80 },
      { label: 'Sector 4', value: 45 },
    ],
    xAxis: { title: 'Sector', min: 0, max: 3, step: 1, labels: ['Sector 1', 'Sector 2', 'Sector 3', 'Sector 4'] },
    yAxis: { title: 'Deficit (MW)', min: 0, max: 100, step: 10, labels: ['0', '25', '50', '75', '100'] },
    expectedValues: [30, 55, 80, 45],
    unit: 'MW',
    difficulty: 3,
  },
  {
    id: 'EV10-Q47-LINE',
    round: 47,
    phase: 'build',
    district: 'water',
    graphType: 'line',
    title: 'EVENT 10 (2/5): Hydro Surge Containment Curve',
    instruction: 'Deploy reservoir backup valves to contain hydro pressure! Plot pressure surge: 12 PM: 30, 1 PM: 55, 2 PM: 85, 3 PM: 95, 4 PM: 70, 5 PM: 50.',
    dataTable: [
      { label: '12 PM', value: 30 },
      { label: '1 PM', value: 55 },
      { label: '2 PM', value: 85 },
      { label: '3 PM', value: 95 },
      { label: '4 PM', value: 70 },
      { label: '5 PM', value: 50 },
    ],
    xAxis: { title: 'Peak Hour', min: 0, max: 5, step: 1, labels: ['12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM'] },
    yAxis: { title: 'Surge (kPa)', min: 0, max: 100, step: 10, labels: ['0', '25', '50', '75', '100'] },
    expectedValues: [30, 55, 85, 95, 70, 50],
    unit: 'kPa',
    difficulty: 3,
  },
  {
    id: 'EV10-Q48-PIE',
    round: 48,
    phase: 'build',
    district: 'city',
    graphType: 'pie',
    title: 'EVENT 10 (3/5): Emergency Power Priority Route',
    instruction: 'Reroute critical power reserves: Hospitals 40%, Transit Network 25%, Residential Wards 20%, Industrial 15%.',
    dataTable: [
      { label: 'Hospitals', value: 40 },
      { label: 'Transit', value: 25 },
      { label: 'Residential', value: 20 },
      { label: 'Industrial', value: 15 },
    ],
    xAxis: { title: 'Priority', min: 0, max: 3, step: 1, labels: ['Hospitals', 'Transit', 'Residential', 'Industrial'] },
    yAxis: { title: 'Share (%)', min: 0, max: 100, step: 5, labels: ['0%', '25%', '50%', '75%', '100%'] },
    expectedValues: [40, 25, 20, 15],
    unit: '%',
    difficulty: 4,
  },
  {
    id: 'EV10-Q49-LINE',
    round: 49,
    phase: 'build',
    district: 'city',
    graphType: 'line',
    title: 'EVENT 10 (4/5): Citywide Hazard Metric Drop',
    instruction: 'Hazard alarms dropping into safety zone as data stabilizes! Plot: Min 0: 95, Min 10: 75, Min 20: 50, Min 30: 25, Min 40: 5.',
    dataTable: [
      { label: '0m', value: 95 },
      { label: '10m', value: 75 },
      { label: '20m', value: 50 },
      { label: '30m', value: 25 },
      { label: '40m', value: 5 },
    ],
    xAxis: { title: 'Elapsed Time', min: 0, max: 4, step: 1, labels: ['0m', '10m', '20m', '30m', '40m'] },
    yAxis: { title: 'Hazard Index', min: 0, max: 100, step: 10, labels: ['0', '25', '50', '75', '100'] },
    expectedValues: [95, 75, 50, 25, 5],
    unit: 'pts',
    difficulty: 4,
  },
  {
    id: 'EV10-Q50-BAR',
    round: 50,
    phase: 'build',
    district: 'city',
    graphType: 'bar',
    title: 'EVENT 10 (5/5): Full Operational Restoration',
    instruction: 'CHAMPIONSHIP FINALE: The Data City is saved! Plot 100% restored capacity: Power: 100%, Water: 100%, Transit: 100%, Network: 100%, Safety: 100%!',
    dataTable: [
      { label: 'Power', value: 100 },
      { label: 'Water', value: 100 },
      { label: 'Transit', value: 100 },
      { label: 'Network', value: 100 },
      { label: 'Safety', value: 100 },
    ],
    xAxis: { title: 'System', min: 0, max: 4, step: 1, labels: ['Power', 'Water', 'Transit', 'Network', 'Safety'] },
    yAxis: { title: 'Capacity (%)', min: 0, max: 100, step: 10, labels: ['0%', '25%', '50%', '75%', '100%'] },
    expectedValues: [100, 100, 100, 100, 100],
    unit: '%',
    difficulty: 5,
  },
];

export interface CanonicalCityQuestion extends MissionQuestion {
  milestoneTitle: string;
  physicalConsequence: string;
  cityStageUnlock: number; // 1 to 5
}

export const FIVE_CANONICAL_QUESTIONS: CanonicalCityQuestion[] = [
  {
    id: 'CANONICAL-Q1-WEATHER',
    round: 1,
    phase: 'build',
    district: 'weather',
    graphType: 'line',
    title: 'Q1: Morning Temperature Rise',
    instruction: 'The weather station records temperature at sunrise. Plot: 6 AM = 10°C, 9 AM = 20°C, 12 PM = 30°C.',
    dataTable: [
      { label: '6 AM', value: 10 },
      { label: '9 AM', value: 20 },
      { label: '12 PM', value: 30 },
    ],
    xAxis: {
      title: 'Time of Day',
      min: 0,
      max: 2,
      step: 1,
      labels: ['6 AM', '9 AM', '12 PM'],
    },
    yAxis: {
      title: 'Temperature (°C)',
      min: 0,
      max: 40,
      step: 5,
      labels: ['0°C', '10°C', '20°C', '30°C', '40°C'],
    },
    expectedValues: [10, 20, 30],
    unit: '°C',
    difficulty: 1,
    milestoneTitle: 'FIRST CITY SYSTEM: TIME / WEATHER',
    physicalConsequence: 'Sunrise temperature curve physically transitions the city from cool 10°C dawn to radiant 30°C sunlight!',
    cityStageUnlock: 1,
  },
  {
    id: 'CANONICAL-Q2-MARKET',
    round: 2,
    phase: 'build',
    district: 'construction',
    graphType: 'bar',
    title: 'Q2: City Market Stalls Development',
    instruction: 'Plot visitor capacity for new market stalls: Produce: 25, Bakery: 35, Cafe: 40, Florist: 20.',
    dataTable: [
      { label: 'Produce', value: 25 },
      { label: 'Bakery', value: 35 },
      { label: 'Cafe', value: 40 },
      { label: 'Florist', value: 20 },
    ],
    xAxis: {
      title: 'Market Stalls',
      min: 0,
      max: 3,
      step: 1,
      labels: ['Produce', 'Bakery', 'Cafe', 'Florist'],
    },
    yAxis: {
      title: 'Visitor Capacity',
      min: 0,
      max: 50,
      step: 10,
      labels: ['0', '10', '20', '30', '40', '50'],
    },
    expectedValues: [25, 35, 40, 20],
    unit: 'visitors',
    difficulty: 2,
    milestoneTitle: 'NEW BUILDING: MARKET DISTRICT',
    physicalConsequence: 'Market building physically completes with foundation, framework, walls, roof, awnings, and open stalls!',
    cityStageUnlock: 2,
  },
  {
    id: 'CANONICAL-Q3-PARK',
    round: 3,
    phase: 'build',
    district: 'park',
    graphType: 'pictograph',
    title: 'Q3: Botanical Park Visitors',
    instruction: 'Plot visitors across park zones: Pavilion: 20, Rose Garden: 35, Fountain: 45, Meadow: 25 (Key: 1 🌸 = 5 visitors).',
    dataTable: [
      { label: 'Pavilion', value: 20 },
      { label: 'Rose Garden', value: 35 },
      { label: 'Fountain', value: 45 },
      { label: 'Meadow', value: 25 },
    ],
    xAxis: {
      title: 'Park Zone',
      min: 0,
      max: 3,
      step: 1,
      labels: ['Pavilion', 'Rose Garden', 'Fountain', 'Meadow'],
    },
    yAxis: {
      title: 'Visitors (1 🌸 = 5)',
      min: 0,
      max: 50,
      step: 5,
      labels: ['0', '10', '20', '30', '40', '50'],
    },
    expectedValues: [20, 35, 45, 25],
    unit: 'visitors',
    difficulty: 2,
    milestoneTitle: 'PEOPLE ENTER THE CITY',
    physicalConsequence: 'Park fountain shoots dancing water jets, and stylized citizen pedestrians physically enter and stroll the city!',
    cityStageUnlock: 3,
  },
  {
    id: 'CANONICAL-Q4-TRAFFIC',
    round: 4,
    phase: 'build',
    district: 'traffic',
    graphType: 'bar',
    title: 'Q4: Boulevard Traffic Flow',
    instruction: 'Plot vehicle volume passing the junction: North Ave: 15, East Blvd: 30, Central Way: 45, South Way: 20.',
    dataTable: [
      { label: 'North Ave', value: 15 },
      { label: 'East Blvd', value: 30 },
      { label: 'Central Way', value: 45 },
      { label: 'South Way', value: 20 },
    ],
    xAxis: {
      title: 'Boulevard Corridor',
      min: 0,
      max: 3,
      step: 1,
      labels: ['North Ave', 'East Blvd', 'Central Way', 'South Way'],
    },
    yAxis: {
      title: 'Vehicle Count',
      min: 0,
      max: 50,
      step: 10,
      labels: ['0', '10', '20', '30', '40', '50'],
    },
    expectedValues: [15, 30, 45, 20],
    unit: 'cars',
    difficulty: 3,
    milestoneTitle: 'VEHICLES & TRANSPORT ACTIVE',
    physicalConsequence: 'Traffic signals operate, road lamps glow, and sedans, buses, and vans cruise with proper lane & braking physics!',
    cityStageUnlock: 4,
  },
  {
    id: 'CANONICAL-Q5-POWER',
    round: 5,
    phase: 'build',
    district: 'power',
    graphType: 'pie',
    title: 'Q5: Clean Energy Grid Mix (Final System)',
    instruction: 'Balance the 100% clean energy grid: Solar: 35%, Wind: 25%, Hydro: 20%, Biomass: 20%.',
    dataTable: [
      { label: 'Solar', value: 35 },
      { label: 'Wind', value: 25 },
      { label: 'Hydro', value: 20 },
      { label: 'Biomass', value: 20 },
    ],
    xAxis: {
      title: 'Energy Source',
      min: 0,
      max: 3,
      step: 1,
      labels: ['Solar', 'Wind', 'Hydro', 'Biomass'],
    },
    yAxis: {
      title: 'Energy Share (%)',
      min: 0,
      max: 100,
      step: 5,
      labels: ['0%', '25%', '50%', '75%', '100%'],
    },
    expectedValues: [35, 25, 20, 20],
    unit: '%',
    difficulty: 4,
    milestoneTitle: 'FINAL CITY SYSTEM: DATA TOWER COMPLETE',
    physicalConsequence: 'The clean energy grid surges, Central Data Tower superstructure locks into place, and the city reaches 100% completion!',
    cityStageUnlock: 5,
  },
];

export function getCompetitiveQuestion(round: number): CanonicalCityQuestion {
  const qNum = Math.min(5, Math.max(1, round));
  const base = FIVE_CANONICAL_QUESTIONS[qNum - 1];
  return {
    ...base,
    round: qNum,
    id: `${base.id}-${qNum}`,
    dataTable: base.dataTable.map((d) => ({ ...d })),
    xAxis: { ...base.xAxis, labels: [...base.xAxis.labels] },
    yAxis: { ...base.yAxis, labels: [...base.yAxis.labels] },
    expectedValues: [...base.expectedValues],
  };
}

