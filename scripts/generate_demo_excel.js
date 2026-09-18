const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

// 1. Define all 13 canonical activities
const activities = [
  { name: 'Math Escape Vault', topic: 'Place Value & Decimals', num: '01' },
  { name: 'The Great Number Railway', topic: 'Operations & Rounding', num: '02' },
  { name: 'Carnival of Chance', topic: 'Probability', num: '03' },
  { name: 'Blueprint Blitz', topic: 'Shapes, Area & Volume', num: '04' },
  { name: 'Equation Mission Control', topic: 'Expressions & Equations', num: '05' },
  { name: 'Pattern Racers', topic: 'Sequences & Functions', num: '06' },
  { name: 'Decimal Delivery Network', topic: 'Decimals', num: '07' },
  { name: 'The Solar Forge', topic: 'Angles, Protractor & Constructions', num: '08' },
  { name: 'The Chocolate Factory', topic: 'Fractions', num: '09' },
  { name: 'Graphworks', topic: 'Data Handling & Graphs', num: '10' },
  { name: 'Percentage Harvest', topic: 'Percentages', num: '11' },
  { name: 'Park Planner', topic: 'Position & Transformation', num: '12' },
  { name: 'Ratio Rush', topic: 'Ratios, Rates & Proportions', num: '13' },
];

const demoQuestions = [
  {
    Activity: 'Graphworks',
    Topic: 'Data Handling & Graphs',
    Question: 'Which ordered pair represents 3 units right on the x-axis and 4 units up on the y-axis?',
    'Option A': '(4, 3)',
    'Option B': '(3, 4)',
    'Option C': '(3, 0)',
    'Option D': '(0, 4)',
    'Correct Answer': 'B',
    Explanation: 'Coordinates are written as (x, y). Moving 3 units right gives x = 3, and 4 units up gives y = 4, resulting in (3, 4).',
    Difficulty: 'Easy',
    Tags: 'Coordinates, Grid, Plotting',
  },
  {
    Activity: 'The Chocolate Factory',
    Topic: 'Fractions',
    Question: 'A chocolate batch uses 3/4 cup of melted cocoa. How much cocoa is needed for 3 full batches?',
    'Option A': '2 1/4 cups',
    'Option B': '1 1/2 cups',
    'Option C': '3 cups',
    'Option D': '9/4 cups',
    'Correct Answer': 'A',
    Explanation: '3 × 3/4 = 9/4 = 2 1/4 cups of cocoa.',
    Difficulty: 'Medium',
    Tags: 'Fractions, Multiplication, Mixed Numbers',
  },
  {
    Activity: 'Percentage Harvest',
    Topic: 'Percentages',
    Question: 'What is 20% of 80 kg of harvest apples?',
    'Option A': '12 kg',
    'Option B': '16 kg',
    'Option C': '18 kg',
    'Option D': '20 kg',
    'Correct Answer': 'B',
    Explanation: '20% of 80 = 0.2 × 80 = 16 kg.',
    Difficulty: 'Easy',
    Tags: 'Percentages, Harvest, Calculations',
  },
  {
    Activity: 'Park Planner',
    Topic: 'Position & Transformation',
    Question: 'When the point (2, 5) is reflected over the y-axis, what are its new coordinates?',
    'Option A': '(-2, 5)',
    'Option B': '(2, -5)',
    'Option C': '(-2, -5)',
    'Option D': '(5, 2)',
    'Correct Answer': 'A',
    Explanation: 'Reflecting over the y-axis negates the x-coordinate while y remains unchanged: (-2, 5).',
    Difficulty: 'Medium',
    Tags: 'Transformations, Reflection, Coordinates',
  },
  {
    Activity: 'Ratio Rush',
    Topic: 'Ratios, Rates & Proportions',
    Question: 'A film studio uses 2 cameras for every 3 actors. If there are 12 actors, how many cameras are needed?',
    'Option A': '6',
    'Option B': '8',
    'Option C': '9',
    'Option D': '10',
    'Correct Answer': 'B',
    Explanation: 'Scale factor is 12 ÷ 3 = 4. Cameras = 2 × 4 = 8.',
    Difficulty: 'Easy',
    Tags: 'Ratio, Scaling, Unit Rate',
  },
  {
    Activity: 'Math Escape Vault',
    Topic: 'Place Value & Decimals',
    Question: 'In the number 458.293, what is the place value of the digit 9?',
    'Option A': 'Tenths',
    'Option B': 'Hundredths',
    'Option C': 'Thousandths',
    'Option D': 'Tens',
    'Correct Answer': 'B',
    Explanation: 'The first digit after decimal is tenths (2), the second digit is hundredths (9).',
    Difficulty: 'Easy',
    Tags: 'Place Value, Decimals',
  },
  {
    Activity: 'The Great Number Railway',
    Topic: 'Operations & Rounding',
    Question: 'Round 48,672 to the nearest thousand.',
    'Option A': '48,000',
    'Option B': '48,700',
    'Option C': '49,000',
    'Option D': '50,000',
    'Correct Answer': 'C',
    Explanation: 'The hundreds digit is 6 (>= 5), so we round up to 49,000.',
    Difficulty: 'Easy',
    Tags: 'Rounding, Operations',
  },
  {
    Activity: 'Carnival of Chance',
    Topic: 'Probability',
    Question: 'A carnival spinner has 8 equal sections numbered 1 to 8. What is the probability of landing on a prime number?',
    'Option A': '1/4',
    'Option B': '3/8',
    'Option C': '1/2',
    'Option D': '5/8',
    'Correct Answer': 'C',
    Explanation: 'The prime numbers between 1 and 8 are 2, 3, 5, 7 (4 numbers). Probability = 4/8 = 1/2.',
    Difficulty: 'Medium',
    Tags: 'Probability, Primes, Spinner',
  },
  {
    Activity: 'Blueprint Blitz',
    Topic: 'Shapes, Area & Volume',
    Question: 'A rectangular prism has a length of 6 cm, width of 4 cm, and height of 5 cm. What is its volume?',
    'Option A': '60 cm³',
    'Option B': '120 cm³',
    'Option C': '148 cm³',
    'Option D': '150 cm³',
    'Correct Answer': 'B',
    Explanation: 'Volume = length × width × height = 6 × 4 × 5 = 120 cm³.',
    Difficulty: 'Medium',
    Tags: 'Volume, 3D Shapes, Geometry',
  },
  {
    Activity: 'Equation Mission Control',
    Topic: 'Expressions & Equations',
    Question: 'Solve for x: 3x + 7 = 22',
    'Option A': 'x = 4',
    'Option B': 'x = 5',
    'Option C': 'x = 6',
    'Option D': 'x = 7',
    'Correct Answer': 'B',
    Explanation: 'Subtract 7 from both sides: 3x = 15. Divide by 3: x = 5.',
    Difficulty: 'Medium',
    Tags: 'Algebra, Linear Equations',
  },
  {
    Activity: 'Pattern Racers',
    Topic: 'Sequences & Functions',
    Question: 'What is the 10th term in the sequence: 4, 7, 10, 13, ... ?',
    'Option A': '28',
    'Option B': '31',
    'Option C': '34',
    'Option D': '37',
    'Correct Answer': 'B',
    Explanation: 'The rule is 3n + 1. For n = 10, 3(10) + 1 = 31.',
    Difficulty: 'Medium',
    Tags: 'Sequences, nth term, Patterns',
  },
  {
    Activity: 'Decimal Delivery Network',
    Topic: 'Decimals',
    Question: 'Calculate: 14.75 × 0.4',
    'Option A': '5.8',
    'Option B': '5.9',
    'Option C': '6.1',
    'Option D': '59.0',
    'Correct Answer': 'B',
    Explanation: '14.75 × 0.4 = 5.9.',
    Difficulty: 'Medium',
    Tags: 'Decimals, Multiplication',
  },
  {
    Activity: 'The Solar Forge',
    Topic: 'Angles, Protractor & Constructions',
    Question: 'Two angles are complementary. If one angle measures 38°, what is the measure of the second angle?',
    'Option A': '42°',
    'Option B': '52°',
    'Option C': '62°',
    'Option D': '142°',
    'Correct Answer': 'B',
    Explanation: 'Complementary angles add up to 90°. 90° - 38° = 52°.',
    Difficulty: 'Easy',
    Tags: 'Angles, Complementary, Geometry',
  },
  {
    Activity: 'The Chocolate Factory',
    Topic: 'Fractions',
    Question: 'What is 5/6 ÷ 2/3 in simplest form?',
    'Option A': '1 1/4',
    'Option B': '5/9',
    'Option C': '1 1/2',
    'Option D': '10/18',
    'Correct Answer': 'A',
    Explanation: '5/6 ÷ 2/3 = 5/6 × 3/2 = 15/12 = 5/4 = 1 1/4.',
    Difficulty: 'Hard',
    Tags: 'Fractions, Division, Mixed Numbers',
  },
  {
    Activity: 'Ratio Rush',
    Topic: 'Ratios, Rates & Proportions',
    Question: 'A recipe uses 3 cups of flour to 2 cups of sugar. To make a larger batch using 15 cups of flour, how much sugar is needed?',
    'Option A': '8 cups',
    'Option B': '10 cups',
    'Option C': '12 cups',
    'Option D': '14 cups',
    'Correct Answer': 'B',
    Explanation: '15 ÷ 3 = 5 (scaling factor). Sugar = 2 × 5 = 10 cups.',
    Difficulty: 'Easy',
    Tags: 'Ratio, Proportions, Scaling',
  }
];

const workbook = XLSX.utils.book_new();

// Sheet 1: Questions
const wsQuestions = XLSX.utils.json_to_sheet(demoQuestions);
wsQuestions['!cols'] = [
  { wch: 30 },
  { wch: 32 },
  { wch: 65 },
  { wch: 22 },
  { wch: 22 },
  { wch: 22 },
  { wch: 22 },
  { wch: 16 },
  { wch: 50 },
  { wch: 14 },
  { wch: 32 },
];
wsQuestions['!views'] = [{ state: 'frozen', ySplit: 1 }];
XLSX.utils.book_append_sheet(workbook, wsQuestions, 'Questions');

// Sheet 2: Instructions
const instructionsAOA = [
  ['SKILLIZEE ARCADE — TEACHER QUESTION IMPORT INSTRUCTIONS'],
  ['Follow these simple 8 steps to import custom questions for your students.'],
  [],
  ['Step', 'Action', 'Details & Rules'],
  ['Step 1', 'Choose the Activity', 'Select from the 13 official arcade games (e.g. "GraphWorks" or "The Chocolate Factory").'],
  ['Step 2', 'Verify the Math Topic', 'The topic must match the activity\'s curriculum subject (refer to the "Activity List" sheet).'],
  ['Step 3', 'Enter Your Question', 'Write the complete question prompt. Mathematical symbols (+, -, ×, ÷, ², √, etc.) are fully supported.'],
  ['Step 4', 'Enter Four Options', 'You must provide all 4 distinct answer choices: Option A, Option B, Option C, and Option D.'],
  ['Step 5', 'Select Correct Answer', 'Enter "A", "B", "C", or "D" under the Correct Answer column.'],
  ['Step 6', 'Add Feedback & Difficulty', 'Optionally add an explanation (displayed as learning feedback) and set Difficulty to Easy, Medium, or Hard.'],
  ['Step 7', 'Save the Workbook', 'Save your file as .xlsx or .csv.'],
  ['Step 8', 'Upload into Arcade', 'Open the Question Manager in Skillizee Arcade, click "Import Excel", preview verified questions, and click Import!'],
];
const wsInstructions = XLSX.utils.aoa_to_sheet(instructionsAOA);
wsInstructions['!cols'] = [{ wch: 12 }, { wch: 28 }, { wch: 75 }];
XLSX.utils.book_append_sheet(workbook, wsInstructions, 'Instructions');

// Sheet 3: Examples
const wsExamples = XLSX.utils.json_to_sheet(demoQuestions.slice(0, 5));
wsExamples['!cols'] = [
  { wch: 26 },
  { wch: 28 },
  { wch: 60 },
  { wch: 20 },
  { wch: 20 },
  { wch: 20 },
  { wch: 20 },
  { wch: 16 },
  { wch: 45 },
  { wch: 14 },
  { wch: 30 },
];
XLSX.utils.book_append_sheet(workbook, wsExamples, 'Examples');

// Sheet 4: Activity List
const activityListData = activities.map((act) => ({
  'Cabinet #': `Cab #${act.num}`,
  'Activity Name': act.name,
  'Mathematics Topic': act.topic,
  'Dropdown Value': `${act.name} — ${act.topic}`,
}));
const wsActivityList = XLSX.utils.json_to_sheet(activityListData);
wsActivityList['!cols'] = [{ wch: 12 }, { wch: 30 }, { wch: 35 }, { wch: 40 }];
XLSX.utils.book_append_sheet(workbook, wsActivityList, 'Activity List');

// Write to public/templates and templates/
const publicDir = path.join(__dirname, '..', 'public', 'templates');
const rootDir = path.join(__dirname, '..', 'templates');

if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
if (!fs.existsSync(rootDir)) fs.mkdirSync(rootDir, { recursive: true });

const targetFile1 = path.join(publicDir, 'Skillizee_Grade6_Math_Questions_Demo.xlsx');
const targetFile2 = path.join(rootDir, 'Skillizee_Grade6_Math_Questions_Demo.xlsx');

XLSX.writeFile(workbook, targetFile1);
XLSX.writeFile(workbook, targetFile2);

console.log('Generated demo Excel file at:', targetFile1);
console.log('Generated demo Excel file at:', targetFile2);
