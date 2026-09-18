// ============================================================
// SKILLIZEE ARCADE — CENTRAL QUESTION MANAGEMENT SYSTEM TYPES
// Universal question types, teacher/built-in sources, Excel schemas,
// and 5/10/15 question game session interfaces for all 13 activities.
// ============================================================

export type QuestionSource = 'teacher' | 'built-in';
export type QuestionDifficulty = 'easy' | 'medium' | 'hard';
export type AnswerOptionKey = 'A' | 'B' | 'C' | 'D';
export type GameQuestionCount = 5 | 10 | 15;

export interface ActivityDefinition {
  id: string;
  number: string;
  name: string;
  topic: string;
  grade: string;
  route: string;
  badgeBg: string;
  badgeText: string;
  accentColor: string;
  aliases: string[];
}

export interface UniversalQuestion {
  id: string;
  source: QuestionSource;
  activityId: string;
  activityName: string;
  question: string;
  options: [string, string, string, string]; // [Option A, Option B, Option C, Option D]
  correctAnswer: AnswerOptionKey; // 'A' | 'B' | 'C' | 'D'
  explanation?: string;
  difficulty: QuestionDifficulty;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export interface ExcelImportRow {
  rowNumber: number;
  rawActivity: string;
  rawQuestion: string;
  rawOptionA: string;
  rawOptionB: string;
  rawOptionC: string;
  rawOptionD: string;
  rawCorrectAnswer: string;
  rawExplanation?: string;
  rawDifficulty?: string;
  rawTags?: string;
}

export interface ExcelInvalidRow {
  rowNumber: number;
  data: Partial<ExcelImportRow>;
  errors: string[];
}

export interface ExcelDuplicateRow {
  rowNumber: number;
  question: UniversalQuestion;
  existingQuestion: UniversalQuestion;
}

export interface ExcelValidationResult {
  totalDetected: number;
  validCount: number;
  invalidCount: number;
  duplicateCount: number;
  validQuestions: UniversalQuestion[];
  invalidRows: ExcelInvalidRow[];
  duplicateRows: ExcelDuplicateRow[];
}

export interface GameSessionSetup {
  activityId: string;
  activityName: string;
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
  source: 'all' | 'teacher' | 'built-in';
  difficulty: 'all' | 'easy' | 'medium' | 'hard';
  searchQuery: string;
  tag: string;
}
