// ============================================================
// SKILLIZEE ARCADE — CENTRAL QUESTION MANAGEMENT SYSTEM TYPES
// Universal question types, teacher/built-in sources, Excel schemas,
// activity/topic registry, and 5/10/15 question session interfaces.
// Core principle: ONE QUESTION -> ONE SPECIFIC ACTIVITY -> ONE SPECIFIC TOPIC
// ============================================================

export type QuestionSource = 'teacher' | 'built-in';
export type QuestionDifficulty = 'easy' | 'medium' | 'hard';
export type AnswerOptionKey = 'A' | 'B' | 'C' | 'D';
export type GameQuestionCount = 5 | 10 | 15;

export interface ActivityDefinition {
  id: string; // Stable slug e.g. 'graphworks', 'ratio-rush'
  number: string; // '01' to '13'
  name: string; // Canonical arcade game name
  topicId: string; // Stable topic slug e.g. 'graphs', 'ratios-proportions'
  topic: string; // Full human topic name
  shortTopic: string; // Compact topic label
  grade: string;
  route: string;
  badgeBg: string;
  badgeText: string;
  accentColor: string;
  aliases: string[];
  topicAliases: string[];
}

export interface UniversalQuestion {
  id: string;
  source: QuestionSource;
  activityId: string; // STRICT 1-to-1 binding
  activityName: string;
  topicId: string; // STRICT 1-to-1 math topic binding
  topicName: string;
  question: string;
  options: [string, string, string, string]; // [Option A, Option B, Option C, Option D]
  correctAnswer: AnswerOptionKey; // 'A' | 'B' | 'C' | 'D'
  explanation?: string;
  difficulty: QuestionDifficulty;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export interface ExcelParsedRow {
  rowNumber: number;
  rawActivity: string;
  rawTopic?: string;
  rawQuestion: string;
  rawOptionA: string;
  rawOptionB: string;
  rawOptionC: string;
  rawOptionD: string;
  rawCorrectAnswer: string;
  rawExplanation?: string;
  rawDifficulty?: string;
  rawTags?: string;
  status: 'ready' | 'invalid' | 'mismatch' | 'duplicate';
  errors: string[];
  warning?: string;
  matchedActivity?: ActivityDefinition | null;
  expectedTopic?: string;
  validatedQuestion?: UniversalQuestion;
  existingDuplicate?: UniversalQuestion;
}

export interface ExcelValidationResult {
  fileName: string;
  sheetName: string;
  totalDetected: number;
  validCount: number;
  invalidCount: number;
  mismatchCount: number;
  duplicateCount: number;
  ignoredColumns: string[];
  rows: ExcelParsedRow[];
  validQuestions: UniversalQuestion[];
  invalidRows: ExcelParsedRow[];
  duplicateRows: ExcelParsedRow[];
}

export interface GameSessionSetup {
  activityId: string;
  activityName: string;
  topicId: string;
  topicName: string;
  questionCount: GameQuestionCount;
  selectedQuestionIds: string[];
  questions: UniversalQuestion[];
  teacherCount: number;
  builtInCount: number;
  orderMode: 'selected' | 'randomized';
  randomizeAnswers: boolean;
  timestamp: number;
}

export interface QuestionBankFilterState {
  activityId: string; // 'all' | activityId
  topicId: string; // 'all' | topicId
  source: 'all' | 'teacher' | 'built-in';
  difficulty: 'all' | 'easy' | 'medium' | 'hard';
  searchQuery: string;
  tag: string;
  groupByActivity: boolean;
}
