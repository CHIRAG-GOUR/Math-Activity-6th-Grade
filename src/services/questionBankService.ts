// ============================================================
// SKILLIZEE ARCADE — CENTRAL QUESTION BANK SERVICE
// Persistent LocalStorage store for teacher questions, built-in questions,
// recent play history, Excel import validation, template generator,
// auto-selection with Teacher Priority, and full CRUD.
// ============================================================

import * as XLSX from 'xlsx';
import {
  UniversalQuestion,
  QuestionDifficulty,
  AnswerOptionKey,
  GameQuestionCount,
  ExcelValidationResult,
  ExcelInvalidRow,
  ExcelDuplicateRow,
  QuestionBankFilterState,
} from '@/types/questionBank';
import { BUILT_IN_QUESTIONS_SEED } from './builtInQuestionsSeed';
import { ACTIVITIES_REGISTRY, getActivityById, resolveActivity } from './activityRegistry';


const TEACHER_STORAGE_KEY = 'skillizee_teacher_questions_v1';
const RECENT_HISTORY_KEY = 'skillizee_recent_questions_history_v1';

// In-memory cache synced with localStorage
let teacherQuestionsCache: UniversalQuestion[] | null = null;
let recentHistoryCache: Record<string, string[]> | null = null;

function loadTeacherQuestions(): UniversalQuestion[] {
  if (typeof window === 'undefined') return [];
  if (teacherQuestionsCache !== null) return teacherQuestionsCache;

  try {
    const raw = localStorage.getItem(TEACHER_STORAGE_KEY);
    if (!raw) {
      teacherQuestionsCache = [];
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      teacherQuestionsCache = parsed;
      return parsed;
    }
  } catch (err) {
    console.error('Failed to load teacher questions from localStorage:', err);
  }
  teacherQuestionsCache = [];
  return [];
}

function saveTeacherQuestions(questions: UniversalQuestion[]): void {
  teacherQuestionsCache = questions;
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TEACHER_STORAGE_KEY, JSON.stringify(questions));
  } catch (err) {
    console.error('Failed to save teacher questions to localStorage:', err);
  }
}

function loadRecentHistory(): Record<string, string[]> {
  if (typeof window === 'undefined') return {};
  if (recentHistoryCache !== null) return recentHistoryCache;

  try {
    const raw = localStorage.getItem(RECENT_HISTORY_KEY);
    if (!raw) {
      recentHistoryCache = {};
      return {};
    }
    recentHistoryCache = JSON.parse(raw) || {};
    return recentHistoryCache!;
  } catch (err) {
    console.error('Failed to load recent question history:', err);
  }
  recentHistoryCache = {};
  return {};
}

function saveRecentHistory(history: Record<string, string[]>): void {
  recentHistoryCache = history;
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(RECENT_HISTORY_KEY, JSON.stringify(history));
  } catch (err) {
    console.error('Failed to save recent question history:', err);
  }
}

// ------------------------------------------------------------
// Core Read APIs
// ------------------------------------------------------------

export function getTeacherQuestions(): UniversalQuestion[] {
  return [...loadTeacherQuestions()];
}

export function getBuiltInQuestions(): UniversalQuestion[] {
  return [...BUILT_IN_QUESTIONS_SEED];
}


export function getAllQuestions(): UniversalQuestion[] {
  return [...getTeacherQuestions(), ...getBuiltInQuestions()];
}

export function getQuestionById(id: string): UniversalQuestion | null {
  const all = getAllQuestions();
  return all.find((q) => q.id === id) || null;
}

export function getQuestionsForActivity(activityId: string): {
  teacher: UniversalQuestion[];
  builtIn: UniversalQuestion[];
  total: UniversalQuestion[];
} {
  const teacher = getTeacherQuestions().filter((q) => q.activityId === activityId);
  const builtIn = getBuiltInQuestions().filter((q) => q.activityId === activityId);
  return {
    teacher,
    builtIn,
    total: [...teacher, ...builtIn],
  };
}

export function getQuestionCountsByActivity(): Record<string, { teacher: number; builtIn: number; total: number }> {
  const result: Record<string, { teacher: number; builtIn: number; total: number }> = {};
  for (const act of ACTIVITIES_REGISTRY) {
    const { teacher, builtIn, total } = getQuestionsForActivity(act.id);
    result[act.id] = {
      teacher: teacher.length,
      builtIn: builtIn.length,
      total: total.length,
    };
  }
  return result;
}

// ------------------------------------------------------------
// Question Management CRUD (Teacher Questions)
// ------------------------------------------------------------

export interface CreateQuestionPayload {
  activityId: string;
  question: string;
  options: [string, string, string, string];
  correctAnswer: AnswerOptionKey;
  explanation?: string;
  difficulty?: QuestionDifficulty;
  tags?: string[];
}

export function createTeacherQuestion(payload: CreateQuestionPayload): UniversalQuestion {
  const activity = getActivityById(payload.activityId);
  if (!activity) {
    throw new Error(`Invalid activity ID: ${payload.activityId}`);
  }

  // Validation
  const questionText = payload.question?.trim();
  if (!questionText) {
    throw new Error('Question text is required.');
  }

  const cleanOptions = payload.options.map((opt) => opt?.trim());
  if (cleanOptions.length !== 4 || cleanOptions.some((opt) => !opt)) {
    throw new Error('All 4 answer options (Option A, B, C, D) are required.');
  }

  if (!['A', 'B', 'C', 'D'].includes(payload.correctAnswer)) {
    throw new Error('Please select a valid correct answer (A, B, C, or D).');
  }

  const newQuestion: UniversalQuestion = {
    id: `tq-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    source: 'teacher',
    activityId: activity.id,
    activityName: activity.name,
    question: questionText,
    options: [cleanOptions[0], cleanOptions[1], cleanOptions[2], cleanOptions[3]],
    correctAnswer: payload.correctAnswer,
    explanation: payload.explanation?.trim() || undefined,
    difficulty: payload.difficulty || 'easy',
    tags: (payload.tags || []).map((t) => t.trim()).filter(Boolean),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const current = loadTeacherQuestions();
  const updated = [newQuestion, ...current];
  saveTeacherQuestions(updated);
  return newQuestion;
}

export function updateTeacherQuestion(
  id: string,
  payload: Partial<CreateQuestionPayload>
): UniversalQuestion {
  const current = loadTeacherQuestions();
  const index = current.findIndex((q) => q.id === id);
  if (index === -1) {
    throw new Error(`Teacher question with ID ${id} not found or is a built-in question.`);
  }

  const existing = current[index];
  const targetActivityId = payload.activityId || existing.activityId;
  const activity = getActivityById(targetActivityId);
  if (!activity) {
    throw new Error(`Invalid activity ID: ${targetActivityId}`);
  }

  const questionText = payload.question !== undefined ? payload.question.trim() : existing.question;
  if (!questionText) throw new Error('Question text cannot be empty.');

  const options = payload.options !== undefined ? payload.options.map((o) => o.trim()) : existing.options;
  if (options.length !== 4 || options.some((opt) => !opt)) {
    throw new Error('All 4 answer choices are required.');
  }

  const correctAnswer = payload.correctAnswer || existing.correctAnswer;
  if (!['A', 'B', 'C', 'D'].includes(correctAnswer)) {
    throw new Error('Invalid correct answer.');
  }

  const updatedQuestion: UniversalQuestion = {
    ...existing,
    activityId: activity.id,
    activityName: activity.name,
    question: questionText,
    options: [options[0], options[1], options[2], options[3]],
    correctAnswer,
    explanation: payload.explanation !== undefined ? payload.explanation.trim() : existing.explanation,
    difficulty: payload.difficulty || existing.difficulty,
    tags: payload.tags !== undefined ? payload.tags.map((t) => t.trim()).filter(Boolean) : existing.tags,
    updatedAt: Date.now(),
  };

  current[index] = updatedQuestion;
  saveTeacherQuestions(current);
  return updatedQuestion;
}

export function duplicateTeacherQuestion(id: string): UniversalQuestion {
  const q = getQuestionById(id);
  if (!q) throw new Error('Question not found.');

  const newQuestion: UniversalQuestion = {
    ...q,
    id: `tq-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    source: 'teacher',
    question: `${q.question} (Copy)`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const current = loadTeacherQuestions();
  const updated = [newQuestion, ...current];
  saveTeacherQuestions(updated);
  return newQuestion;
}

export function deleteTeacherQuestion(id: string): boolean {
  const current = loadTeacherQuestions();
  const filtered = current.filter((q) => q.id !== id);
  if (filtered.length === current.length) return false;
  saveTeacherQuestions(filtered);
  return true;
}

export function deleteMultipleTeacherQuestions(ids: string[]): number {
  const idSet = new Set(ids);
  const current = loadTeacherQuestions();
  const filtered = current.filter((q) => !idSet.has(q.id));
  const deletedCount = current.length - filtered.length;
  saveTeacherQuestions(filtered);
  return deletedCount;
}

// ------------------------------------------------------------
// Question Auto-Selection with Strict Teacher Priority
// ------------------------------------------------------------

export function autoSelectQuestions(
  activityId: string,
  count: GameQuestionCount,
  options: { avoidRecentlyPlayed?: boolean } = { avoidRecentlyPlayed: true }
): {
  selectedQuestions: UniversalQuestion[];
  teacherCount: number;
  builtInCount: number;
  message: string;
} {
  const { teacher, builtIn } = getQuestionsForActivity(activityId);
  const history = loadRecentHistory();
  const recentIds = new Set(history[activityId] || []);

  // Split teacher questions into unused vs recently used
  let availableTeacher = options.avoidRecentlyPlayed && teacher.length > count
    ? teacher.filter((q) => !recentIds.has(q.id))
    : [...teacher];

  if (availableTeacher.length === 0 && teacher.length > 0) {
    // If all were used recently, reset pool
    availableTeacher = [...teacher];
  }

  // Shuffle pool of teacher questions to add variety if teacher has plenty
  const shuffledTeacher = [...availableTeacher].sort(() => Math.random() - 0.5);

  // Take as many teacher questions as possible up to `count`
  const selectedTeacher = shuffledTeacher.slice(0, count);
  const neededFromBuiltIn = count - selectedTeacher.length;

  let selectedBuiltIn: UniversalQuestion[] = [];
  if (neededFromBuiltIn > 0) {
    let availableBuiltIn = options.avoidRecentlyPlayed && builtIn.length > neededFromBuiltIn
      ? builtIn.filter((q) => !recentIds.has(q.id))
      : [...builtIn];

    if (availableBuiltIn.length < neededFromBuiltIn) {
      availableBuiltIn = [...builtIn];
    }

    const shuffledBuiltIn = [...availableBuiltIn].sort(() => Math.random() - 0.5);
    selectedBuiltIn = shuffledBuiltIn.slice(0, neededFromBuiltIn);
  }

  const selectedQuestions = [...selectedTeacher, ...selectedBuiltIn];

  const teacherCount = selectedTeacher.length;
  const builtInCount = selectedBuiltIn.length;

  let message = '';
  if (teacherCount === count) {
    message = `Using ${teacherCount} teacher-created questions (100% Teacher Priority)`;
  } else if (teacherCount > 0) {
    message = `Using ${teacherCount} teacher questions + ${builtInCount} built-in questions`;
  } else {
    message = `Using ${builtInCount} built-in arcade questions`;
  }

  return {
    selectedQuestions,
    teacherCount,
    builtInCount,
    message,
  };
}

export function recordPlayedQuestions(activityId: string, questionIds: string[]): void {
  const history = loadRecentHistory();
  const current = history[activityId] || [];
  // Keep the most recent 30 questions per activity to prevent immediate repeats
  const updated = Array.from(new Set([...questionIds, ...current])).slice(0, 30);
  history[activityId] = updated;
  saveRecentHistory(history);
}

// ------------------------------------------------------------
// Excel & CSV Import Validation & Execution
// ------------------------------------------------------------

export async function parseAndValidateExcel(file: File): Promise<ExcelValidationResult> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    throw new Error('The uploaded file does not contain any sheets.');
  }

  const worksheet = workbook.Sheets[sheetName];
  const rawRows: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

  if (!rawRows || rawRows.length === 0) {
    throw new Error('No data rows found in the sheet. Please make sure the file is not empty.');
  }

  const existingAll = getAllQuestions();
  const existingMap = new Map<string, UniversalQuestion>();
  for (const q of existingAll) {
    // Key by activityId + normalized question text
    const key = `${q.activityId}:::${q.question.trim().toLowerCase()}`;
    existingMap.set(key, q);
  }

  const validQuestions: UniversalQuestion[] = [];
  const invalidRows: ExcelInvalidRow[] = [];
  const duplicateRows: ExcelDuplicateRow[] = [];

  rawRows.forEach((row, index) => {
    const rowNumber = index + 2; // Excel row index assuming row 1 is header
    const errors: string[] = [];

    // Extract fields with flexible column naming
    const rawActivity = String(row['Activity'] || row['Activity Name'] || row['Topic'] || row['Game'] || row['Cabinet'] || '').trim();
    const rawQuestion = String(row['Question'] || row['Question Text'] || row['Math Question'] || '').trim();
    const rawOptionA = String(row['Option A'] || row['OptionA'] || row['A'] || row['Choice A'] || '').trim();
    const rawOptionB = String(row['Option B'] || row['OptionB'] || row['B'] || row['Choice B'] || '').trim();
    const rawOptionC = String(row['Option C'] || row['OptionC'] || row['C'] || row['Choice C'] || '').trim();
    const rawOptionD = String(row['Option D'] || row['OptionD'] || row['D'] || row['Choice D'] || '').trim();
    const rawCorrectAnswer = String(row['Correct Answer'] || row['Correct'] || row['Answer'] || row['Key'] || '').trim().toUpperCase();
    const rawExplanation = String(row['Explanation'] || row['Learning Feedback'] || row['Hint'] || '').trim();
    const rawDifficulty = String(row['Difficulty'] || row['Level'] || 'Easy').trim().toLowerCase();
    const rawTags = String(row['Tags'] || row['Tag'] || row['Keywords'] || '').trim();

    // 1. Resolve activity
    const activity = resolveActivity(rawActivity);
    if (!activity) {
      errors.push(`Activity not recognized: "${rawActivity}". Supported: Ratio Rush, Decimals, Fractions, etc.`);
    }

    // 2. Validate question text
    if (!rawQuestion) {
      errors.push('Question text is missing.');
    }

    // 3. Validate options
    const missingOptions: string[] = [];
    if (!rawOptionA) missingOptions.push('Option A');
    if (!rawOptionB) missingOptions.push('Option B');
    if (!rawOptionC) missingOptions.push('Option C');
    if (!rawOptionD) missingOptions.push('Option D');
    if (missingOptions.length > 0) {
      errors.push(`Missing answer choices: ${missingOptions.join(', ')} (Must have 4 options).`);
    }

    // 4. Validate correct answer
    let cleanCorrect: AnswerOptionKey | null = null;
    if (rawCorrectAnswer === 'A' || rawCorrectAnswer === 'OPTION A' || rawCorrectAnswer === '1') cleanCorrect = 'A';
    else if (rawCorrectAnswer === 'B' || rawCorrectAnswer === 'OPTION B' || rawCorrectAnswer === '2') cleanCorrect = 'B';
    else if (rawCorrectAnswer === 'C' || rawCorrectAnswer === 'OPTION C' || rawCorrectAnswer === '3') cleanCorrect = 'C';
    else if (rawCorrectAnswer === 'D' || rawCorrectAnswer === 'OPTION D' || rawCorrectAnswer === '4') cleanCorrect = 'D';
    else if (rawCorrectAnswer === rawOptionA && rawOptionA) cleanCorrect = 'A';
    else if (rawCorrectAnswer === rawOptionB && rawOptionB) cleanCorrect = 'B';
    else if (rawCorrectAnswer === rawOptionC && rawOptionC) cleanCorrect = 'C';
    else if (rawCorrectAnswer === rawOptionD && rawOptionD) cleanCorrect = 'D';

    if (!cleanCorrect) {
      errors.push(`Invalid Correct Answer: "${rawCorrectAnswer}". Must be A, B, C, or D.`);
    }

    // 5. Validate difficulty
    let difficulty: QuestionDifficulty = 'easy';
    if (rawDifficulty.includes('hard') || rawDifficulty.includes('3')) difficulty = 'hard';
    else if (rawDifficulty.includes('med') || rawDifficulty.includes('2')) difficulty = 'medium';
    else difficulty = 'easy';

    // Parse tags
    const tags = rawTags
      ? rawTags.split(/[,;|]/).map((t) => t.trim()).filter(Boolean)
      : [];

    if (errors.length > 0 || !activity || !cleanCorrect || !rawQuestion) {
      invalidRows.push({
        rowNumber,
        data: {
          rawActivity,
          rawQuestion,
          rawOptionA,
          rawOptionB,
          rawOptionC,
          rawOptionD,
          rawCorrectAnswer,
          rawExplanation,
          rawDifficulty,
          rawTags,
        },
        errors,
      });
      return;
    }

    const newQ: UniversalQuestion = {
      id: `tq-import-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 6)}`,
      source: 'teacher',
      activityId: activity.id,
      activityName: activity.name,
      question: rawQuestion,
      options: [rawOptionA, rawOptionB, rawOptionC, rawOptionD],
      correctAnswer: cleanCorrect,
      explanation: rawExplanation || undefined,
      difficulty,
      tags,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    // Check duplicate
    const dupKey = `${activity.id}:::${rawQuestion.toLowerCase()}`;
    if (existingMap.has(dupKey)) {
      duplicateRows.push({
        rowNumber,
        question: newQ,
        existingQuestion: existingMap.get(dupKey)!,
      });
    }

    validQuestions.push(newQ);
  });

  return {
    totalDetected: rawRows.length,
    validCount: validQuestions.length,
    invalidCount: invalidRows.length,
    duplicateCount: duplicateRows.length,
    validQuestions,
    invalidRows,
    duplicateRows,
  };
}

export function commitExcelImport(
  validQuestions: UniversalQuestion[],
  duplicateAction: 'skip' | 'import-anyway' | 'replace' = 'skip'
): { importedCount: number; replacedCount: number; skippedCount: number } {
  const current = loadTeacherQuestions();
  const existingMap = new Map<string, number>();
  current.forEach((q, idx) => {
    existingMap.set(`${q.activityId}:::${q.question.trim().toLowerCase()}`, idx);
  });

  let importedCount = 0;
  let replacedCount = 0;
  let skippedCount = 0;

  const toAdd: UniversalQuestion[] = [];

  for (const q of validQuestions) {
    const key = `${q.activityId}:::${q.question.trim().toLowerCase()}`;
    if (existingMap.has(key)) {
      if (duplicateAction === 'skip') {
        skippedCount++;
        continue;
      } else if (duplicateAction === 'replace') {
        const idx = existingMap.get(key)!;
        current[idx] = { ...q, id: current[idx].id, updatedAt: Date.now() };
        replacedCount++;
        continue;
      }
    }
    toAdd.push(q);
    importedCount++;
  }

  const finalQuestions = [...toAdd, ...current];
  saveTeacherQuestions(finalQuestions);

  return { importedCount, replacedCount, skippedCount };
}

// ------------------------------------------------------------
// Template Generation & Export
// ------------------------------------------------------------

export function generateExcelTemplateBlob(): Blob {
  const templateRows = [
    {
      Activity: 'Ratio Rush',
      Question: 'A movie studio uses 2 cameras for every 3 actors. If there are 12 actors, how many cameras are needed?',
      'Option A': '6',
      'Option B': '8',
      'Option C': '9',
      'Option D': '10',
      'Correct Answer': 'B',
      Explanation: 'Both terms scale by 4: (2 × 4) = 8 cameras.',
      Difficulty: 'Easy',
      Tags: 'Ratio, Scaling, Word Problem',
    },
    {
      Activity: 'The Chocolate Factory',
      Question: 'A chocolate batch uses 3/4 cup of cocoa powder. How much is needed for 3 full batches?',
      'Option A': '2 1/4 cups',
      'Option B': '1 1/2 cups',
      'Option C': '3 cups',
      'Option D': '9/4 cups',
      'Correct Answer': 'A',
      Explanation: '3 × 3/4 = 9/4 = 2 1/4 cups.',
      Difficulty: 'Medium',
      Tags: 'Fractions, Multiplication, Mixed Numbers',
    },
    {
      Activity: 'Decimal Delivery',
      Question: 'A delivery truck carries three parcels weighing 4.25 kg, 8.5 kg, and 12.05 kg. What is the total cargo weight?',
      'Option A': '24.8 kg',
      'Option B': '25.0 kg',
      'Option C': '24.75 kg',
      'Option D': '25.2 kg',
      'Correct Answer': 'A',
      Explanation: '4.25 + 8.50 + 12.05 = 24.80 kg.',
      Difficulty: 'Easy',
      Tags: 'Decimals, Addition, Real World',
    },
    {
      Activity: 'Math Escape Vault',
      Question: 'In the number 847,239.51, what is the place value of the digit 7?',
      'Option A': 'Thousands (7,000)',
      'Option B': 'Ten Thousands (70,000)',
      'Option C': 'Hundreds (700)',
      'Option D': 'Tenths (0.7)',
      'Correct Answer': 'A',
      Explanation: 'The 7 is in the thousands column (7 × 1,000 = 7,000).',
      Difficulty: 'Easy',
      Tags: 'Place Value, Whole Numbers',
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(templateRows);
  
  // Set column widths for comfortable reading
  worksheet['!cols'] = [
    { wch: 24 }, // Activity
    { wch: 60 }, // Question
    { wch: 20 }, // Option A
    { wch: 20 }, // Option B
    { wch: 20 }, // Option C
    { wch: 20 }, // Option D
    { wch: 16 }, // Correct Answer
    { wch: 45 }, // Explanation
    { wch: 14 }, // Difficulty
    { wch: 30 }, // Tags
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Math_Questions_Template');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}

export function exportQuestionsToExcel(filter?: QuestionBankFilterState): Blob {
  let list = getAllQuestions();

  if (filter) {
    if (filter.activityId && filter.activityId !== 'all') {
      list = list.filter((q) => q.activityId === filter.activityId);
    }
    if (filter.source && filter.source !== 'all') {
      list = list.filter((q) => q.source === filter.source);
    }
    if (filter.difficulty && filter.difficulty !== 'all') {
      list = list.filter((q) => q.difficulty === filter.difficulty);
    }
    if (filter.searchQuery) {
      const qLower = filter.searchQuery.toLowerCase();
      list = list.filter(
        (q) =>
          q.question.toLowerCase().includes(qLower) ||
          q.options.some((o) => o.toLowerCase().includes(qLower)) ||
          q.tags.some((t) => t.toLowerCase().includes(qLower))
      );
    }
  }

  const exportRows = list.map((q) => ({
    Source: q.source === 'teacher' ? 'My Questions (Teacher)' : 'Built-in Arcade',
    Activity: q.activityName,
    Question: q.question,
    'Option A': q.options[0],
    'Option B': q.options[1],
    'Option C': q.options[2],
    'Option D': q.options[3],
    'Correct Answer': q.correctAnswer,
    Explanation: q.explanation || '',
    Difficulty: q.difficulty.toUpperCase(),
    Tags: q.tags.join(', '),
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportRows);
  worksheet['!cols'] = [
    { wch: 22 },
    { wch: 26 },
    { wch: 55 },
    { wch: 20 },
    { wch: 20 },
    { wch: 20 },
    { wch: 20 },
    { wch: 16 },
    { wch: 40 },
    { wch: 14 },
    { wch: 25 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Questions_Bank');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}
