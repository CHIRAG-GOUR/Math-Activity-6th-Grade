// ============================================================
// SKILLIZEE ARCADE — CENTRAL QUESTION BANK SERVICE
// Persistent LocalStorage store for teacher questions, built-in questions,
// recent play history, Excel import validation, template generator,
// auto-selection with Teacher Priority, and full CRUD.
// Core principle: 1 QUESTION -> 1 SPECIFIC ACTIVITY -> 1 SPECIFIC TOPIC
// ============================================================

import * as XLSX from 'xlsx';
import {
  UniversalQuestion,
  QuestionDifficulty,
  AnswerOptionKey,
  GameQuestionCount,
  ExcelValidationResult,
  ExcelParsedRow,
  QuestionBankFilterState,
} from '@/types/questionBank';
import { BUILT_IN_QUESTIONS_SEED } from './builtInQuestionsSeed';
import {
  ACTIVITIES_REGISTRY,
  getActivityById,
  getActivityByTopicId,
  resolveActivity,
  validateActivityTopicPair,
} from './activityRegistry';

const TEACHER_STORAGE_KEY = 'skillizee_teacher_questions_v1';
const RECENT_HISTORY_KEY = 'skillizee_recent_questions_history_v1';

// In-memory cache synced with localStorage
let teacherQuestionsCache: UniversalQuestion[] | null = null;
let recentHistoryCache: Record<string, string[]> | null = null;

function sanitizeQuestionTopic(q: UniversalQuestion): UniversalQuestion {
  const act = getActivityById(q.activityId);
  if (act) {
    return {
      ...q,
      activityName: act.name,
      topicId: act.topicId,
      topicName: act.topic,
    };
  }
  return q;
}

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
      // Auto-migrate to guarantee activity & topic synchronization
      const sanitized = parsed.map(sanitizeQuestionTopic);
      teacherQuestionsCache = sanitized;
      return sanitized;
    }
  } catch (err) {
    console.error('Failed to load teacher questions from localStorage:', err);
  }
  teacherQuestionsCache = [];
  return [];
}

function saveTeacherQuestions(questions: UniversalQuestion[]): void {
  teacherQuestionsCache = questions.map(sanitizeQuestionTopic);
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TEACHER_STORAGE_KEY, JSON.stringify(teacherQuestionsCache));
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

/**
 * STRICT QUESTION ISOLATION:
 * Returns questions strictly assigned to this activity.
 * Under no circumstances are questions from other activities returned.
 */
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

export function getQuestionsForTopic(topicId: string): {
  teacher: UniversalQuestion[];
  builtIn: UniversalQuestion[];
  total: UniversalQuestion[];
} {
  const teacher = getTeacherQuestions().filter((q) => q.topicId === topicId);
  const builtIn = getBuiltInQuestions().filter((q) => q.topicId === topicId);
  return {
    teacher,
    builtIn,
    total: [...teacher, ...builtIn],
  };
}

export function getQuestionCountsByActivity(): Record<
  string,
  { teacher: number; builtIn: number; total: number; topic: string; activityName: string }
> {
  const result: Record<
    string,
    { teacher: number; builtIn: number; total: number; topic: string; activityName: string }
  > = {};
  for (const act of ACTIVITIES_REGISTRY) {
    const { teacher, builtIn, total } = getQuestionsForActivity(act.id);
    result[act.id] = {
      teacher: teacher.length,
      builtIn: builtIn.length,
      total: total.length,
      topic: act.topic,
      activityName: act.name,
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
    throw new Error(`Invalid activity ID: ${payload.activityId}. A question must be assigned to an official activity.`);
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
    topicId: activity.topicId,
    topicName: activity.topic,
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
    topicId: activity.topicId,
    topicName: activity.topic,
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
// (STRICT: ONLY questions matching activityId are used)
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
// Excel & CSV Import Validation & Execution (Production Engine)
// ------------------------------------------------------------

export interface HeaderMapping {
  activityCol?: string;
  topicCol?: string;
  questionCol?: string;
  optionACol?: string;
  optionBCol?: string;
  optionCCol?: string;
  optionDCol?: string;
  correctCol?: string;
  explanationCol?: string;
  difficultyCol?: string;
  tagsCol?: string;
  ignoredCols: string[];
}

function normalizeHeaderKey(key: string): string {
  return key
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

function detectColumnMapping(headers: string[]): HeaderMapping {
  const mapping: HeaderMapping = { ignoredCols: [] };

  const recognizedAliases: Record<keyof Omit<HeaderMapping, 'ignoredCols'>, string[]> = {
    activityCol: [
      'activity',
      'activityname',
      'game',
      'gamename',
      'cabinet',
      'cab',
      'activitytopic',
      'targetactivity',
      'arcadeactivity',
      'activitycurriculum',
    ],
    topicCol: [
      'topic',
      'mathtopic',
      'curriculumtopic',
      'mathematicstopic',
      'topicname',
      'subjecttopic',
      'mathconcept',
      'concept',
    ],
    questionCol: [
      'question',
      'questiontext',
      'mathquestion',
      'prompt',
      'questionprompt',
      'problem',
      'mathproblem',
      'qtext',
    ],
    optionACol: ['optiona', 'a', 'choicea', 'choice1', 'option1', 'opt1', 'ansa', 'answera'],
    optionBCol: ['optionb', 'b', 'choiceb', 'choice2', 'option2', 'opt2', 'ansb', 'answerb'],
    optionCCol: ['optionc', 'c', 'choicec', 'choice3', 'option3', 'opt3', 'ansc', 'answerc'],
    optionDCol: ['optiond', 'd', 'choiced', 'choice4', 'option4', 'opt4', 'ansd', 'answerd'],
    correctCol: [
      'correctanswer',
      'correct',
      'answer',
      'key',
      'correctoption',
      'correctchoice',
      'answerkey',
      'ans',
    ],
    explanationCol: [
      'explanation',
      'learningfeedback',
      'feedback',
      'hint',
      'reasoning',
      'solution',
      'stepbystep',
      'solutionnotes',
    ],
    difficultyCol: ['difficulty', 'level', 'difficultylevel', 'gradelevel', 'challenge'],
    tagsCol: ['tags', 'tag', 'keywords', 'categories', 'taglist', 'topicstags'],
  };

  for (const rawHeader of headers) {
    const clean = normalizeHeaderKey(rawHeader);
    if (!clean) continue;

    let matched = false;
    for (const [fieldKey, aliases] of Object.entries(recognizedAliases)) {
      if (aliases.includes(clean) || aliases.some((a) => clean === a || clean.startsWith(a))) {
        mapping[fieldKey as keyof Omit<HeaderMapping, 'ignoredCols'>] = rawHeader;
        matched = true;
        break;
      }
    }

    if (!matched) {
      mapping.ignoredCols.push(rawHeader);
    }
  }

  return mapping;
}

export async function parseAndValidateExcel(file: File): Promise<ExcelValidationResult> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });

  if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
    throw new Error('The uploaded file does not contain any readable sheets.');
  }

  // 1. Intelligent Sheet Selection: Prefer 'Questions' / 'Sheet1' and avoid 'Instructions' / 'Examples' / 'Activity List'
  let targetSheetName = workbook.SheetNames[0];
  const questionSheetCandidates = ['questions', 'teacher questions', 'question bank', 'questions sheet', 'sheet1', 'data'];
  const skipSheets = ['instructions', 'instruction', 'examples', 'example', 'activity list', 'activities', 'reference'];

  for (const name of workbook.SheetNames) {
    const cleanName = name.trim().toLowerCase();
    if (questionSheetCandidates.includes(cleanName)) {
      targetSheetName = name;
      break;
    }
  }

  // If candidate is a skip sheet and there are other sheets, look for one that has headers
  if (skipSheets.includes(targetSheetName.toLowerCase()) && workbook.SheetNames.length > 1) {
    const alternate = workbook.SheetNames.find((n) => !skipSheets.includes(n.toLowerCase()));
    if (alternate) targetSheetName = alternate;
  }

  const worksheet = workbook.Sheets[targetSheetName];
  if (!worksheet) {
    throw new Error(`Could not access sheet "${targetSheetName}".`);
  }

  // Convert to Array-of-Arrays first to locate the header row (in case title banner spans rows 1-3)
  const rawMatrix: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

  if (!rawMatrix || rawMatrix.length === 0) {
    throw new Error('The selected sheet is completely empty.');
  }

  // Find header row: Look for row containing "question" or "activity" or "option a"
  let headerRowIndex = 0;
  for (let r = 0; r < Math.min(rawMatrix.length, 10); r++) {
    const rowValues = (rawMatrix[r] || []).map((c) => String(c).toLowerCase());
    const hasQuestion = rowValues.some((v) => v.includes('question') || v.includes('prompt'));
    const hasActivity = rowValues.some((v) => v.includes('activity') || v.includes('game'));
    const hasOption = rowValues.some((v) => v.includes('option') || v.includes('choice') || v === 'a');

    if ((hasQuestion && hasActivity) || (hasQuestion && hasOption) || (hasActivity && hasOption)) {
      headerRowIndex = r;
      break;
    }
  }

  const rawHeaders = (rawMatrix[headerRowIndex] || []).map((h) => String(h).trim()).filter(Boolean);
  const columnMapping = detectColumnMapping(rawHeaders);

  // If question column wasn't identified, fallback to standard column names
  if (!columnMapping.questionCol && rawHeaders.length > 2) {
    columnMapping.activityCol = rawHeaders[0];
    columnMapping.topicCol = rawHeaders[1];
    columnMapping.questionCol = rawHeaders[2];
    columnMapping.optionACol = rawHeaders[3];
    columnMapping.optionBCol = rawHeaders[4];
    columnMapping.optionCCol = rawHeaders[5];
    columnMapping.optionDCol = rawHeaders[6];
    columnMapping.correctCol = rawHeaders[7];
  }

  const dataRows = rawMatrix.slice(headerRowIndex + 1);

  const existingAll = getAllQuestions();
  const existingMap = new Map<string, UniversalQuestion>();
  for (const q of existingAll) {
    const key = `${q.activityId}:::${q.question.trim().toLowerCase()}`;
    existingMap.set(key, q);
  }

  const parsedRows: ExcelParsedRow[] = [];
  const validQuestions: UniversalQuestion[] = [];
  const internalDuplicateTracker = new Map<string, number>();

  dataRows.forEach((rowArray, rIdx) => {
    const excelRowNumber = headerRowIndex + 2 + rIdx;

    // Check if entire row is empty
    const nonBlankCells = rowArray.filter((c) => c !== null && c !== undefined && String(c).trim() !== '');
    if (nonBlankCells.length === 0) return; // Ignore blank rows

    // Map cell by column index or column mapping
    const getVal = (colHeaderName?: string, defaultIdx: number = -1): string => {
      if (colHeaderName) {
        const idx = rawHeaders.indexOf(colHeaderName);
        if (idx !== -1 && rowArray[idx] !== undefined) {
          return String(rowArray[idx]).trim();
        }
      }
      if (defaultIdx !== -1 && defaultIdx < rowArray.length) {
        return String(rowArray[defaultIdx] || '').trim();
      }
      return '';
    };

    const rawActivity = getVal(columnMapping.activityCol, 0);
    const rawTopic = getVal(columnMapping.topicCol, 1);
    const rawQuestion = getVal(columnMapping.questionCol, 2);
    const rawOptionA = getVal(columnMapping.optionACol, 3);
    const rawOptionB = getVal(columnMapping.optionBCol, 4);
    const rawOptionC = getVal(columnMapping.optionCCol, 5);
    const rawOptionD = getVal(columnMapping.optionDCol, 6);
    const rawCorrectAnswer = getVal(columnMapping.correctCol, 7);
    const rawExplanation = getVal(columnMapping.explanationCol, 8);
    const rawDifficulty = getVal(columnMapping.difficultyCol, 9);
    const rawTags = getVal(columnMapping.tagsCol, 10);

    // Filter out explicit example rows if teacher left template example notes
    const combinedRowStr = `${rawActivity} ${rawTopic} ${rawQuestion}`.toLowerCase();
    if (
      combinedRowStr.includes('example — delete') ||
      combinedRowStr.includes('example - delete') ||
      combinedRowStr.includes('reference only') ||
      combinedRowStr.includes('delete these rows')
    ) {
      return; // Skip example guidance rows cleanly
    }

    const errors: string[] = [];
    let warning: string | undefined = undefined;
    let expectedTopic: string | undefined = undefined;

    // 1. Resolve activity & Validate Topic
    const pairResult = validateActivityTopicPair(rawActivity || rawTopic, rawTopic);
    const activity = pairResult.matchedActivity;

    if (!activity) {
      errors.push(
        rawActivity
          ? `Activity not recognized: "${rawActivity}". Must match one of the 13 arcade games.`
          : 'Activity is missing. Please select an activity.'
      );
    } else if (pairResult.isMismatch && pairResult.expectedTopic) {
      expectedTopic = pairResult.expectedTopic;
      warning = `Activity/Topic mismatch: "${activity.name}" belongs to topic "${activity.topic}", but sheet says "${rawTopic}".`;
      errors.push(`Activity/topic mismatch. Expected topic: "${expectedTopic}".`);
    }

    // 2. Validate Question Text
    if (!rawQuestion) {
      errors.push('Question text is missing.');
    }

    // 3. Validate 4 Options
    const missingOpts: string[] = [];
    if (!rawOptionA) missingOpts.push('Option A');
    if (!rawOptionB) missingOpts.push('Option B');
    if (!rawOptionC) missingOpts.push('Option C');
    if (!rawOptionD) missingOpts.push('Option D');
    if (missingOpts.length > 0) {
      errors.push(`Missing answer choices: ${missingOpts.join(', ')} (Must have 4 options).`);
    }

    // 4. Validate and Normalize Correct Answer
    let cleanCorrect: AnswerOptionKey | null = null;
    const normCorrect = rawCorrectAnswer.trim().toUpperCase();

    if (normCorrect === 'A' || normCorrect === 'OPTION A' || normCorrect === '1' || normCorrect === 'CHOICE A') cleanCorrect = 'A';
    else if (normCorrect === 'B' || normCorrect === 'OPTION B' || normCorrect === '2' || normCorrect === 'CHOICE B') cleanCorrect = 'B';
    else if (normCorrect === 'C' || normCorrect === 'OPTION C' || normCorrect === '3' || normCorrect === 'CHOICE C') cleanCorrect = 'C';
    else if (normCorrect === 'D' || normCorrect === 'OPTION D' || normCorrect === '4' || normCorrect === 'CHOICE D') cleanCorrect = 'D';
    else if (rawCorrectAnswer && rawOptionA && rawCorrectAnswer.toLowerCase() === rawOptionA.toLowerCase()) cleanCorrect = 'A';
    else if (rawCorrectAnswer && rawOptionB && rawCorrectAnswer.toLowerCase() === rawOptionB.toLowerCase()) cleanCorrect = 'B';
    else if (rawCorrectAnswer && rawOptionC && rawCorrectAnswer.toLowerCase() === rawOptionC.toLowerCase()) cleanCorrect = 'C';
    else if (rawCorrectAnswer && rawOptionD && rawCorrectAnswer.toLowerCase() === rawOptionD.toLowerCase()) cleanCorrect = 'D';

    if (!cleanCorrect) {
      errors.push(
        rawCorrectAnswer
          ? `Invalid Correct Answer: "${rawCorrectAnswer}". Must be A, B, C, or D.`
          : 'Correct Answer is missing. Must specify A, B, C, or D.'
      );
    }

    // 5. Normalize Difficulty
    let difficulty: QuestionDifficulty = 'easy';
    const cleanDiff = rawDifficulty.toLowerCase();
    if (cleanDiff.includes('hard') || cleanDiff.includes('3') || cleanDiff.includes('adv')) difficulty = 'hard';
    else if (cleanDiff.includes('med') || cleanDiff.includes('2') || cleanDiff.includes('mod')) difficulty = 'medium';
    else difficulty = 'easy';

    // 6. Parse Tags
    const tags = rawTags
      ? rawTags
          .split(/[,;|]/)
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

    // Check Duplicates
    let status: 'ready' | 'invalid' | 'mismatch' | 'duplicate' = 'ready';
    let existingDuplicate: UniversalQuestion | undefined = undefined;

    if (errors.length > 0 || !activity || !cleanCorrect || !rawQuestion) {
      status = pairResult.isMismatch ? 'mismatch' : 'invalid';
    } else {
      const dupKey = `${activity.id}:::${rawQuestion.toLowerCase()}`;
      if (existingMap.has(dupKey)) {
        status = 'duplicate';
        existingDuplicate = existingMap.get(dupKey);
        warning = `Duplicate question already exists in your Question Bank.`;
      } else if (internalDuplicateTracker.has(dupKey)) {
        status = 'duplicate';
        warning = `Duplicate of row #${internalDuplicateTracker.get(dupKey)} in this spreadsheet.`;
      } else {
        internalDuplicateTracker.set(dupKey, excelRowNumber);
      }
    }

    let validatedQuestion: UniversalQuestion | undefined = undefined;
    if (activity && cleanCorrect && rawQuestion) {
      validatedQuestion = {
        id: `tq-import-${Date.now()}-${rIdx}-${Math.random().toString(36).substring(2, 6)}`,
        source: 'teacher',
        activityId: activity.id,
        activityName: activity.name,
        topicId: activity.topicId,
        topicName: activity.topic,
        question: rawQuestion,
        options: [rawOptionA, rawOptionB, rawOptionC, rawOptionD],
        correctAnswer: cleanCorrect,
        explanation: rawExplanation || undefined,
        difficulty,
        tags,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      if (status === 'ready' || status === 'duplicate') {
        validQuestions.push(validatedQuestion);
      }
    }

    parsedRows.push({
      rowNumber: excelRowNumber,
      rawActivity,
      rawTopic,
      rawQuestion,
      rawOptionA,
      rawOptionB,
      rawOptionC,
      rawOptionD,
      rawCorrectAnswer,
      rawExplanation,
      rawDifficulty,
      rawTags,
      status,
      errors,
      warning,
      matchedActivity: activity,
      expectedTopic,
      validatedQuestion,
      existingDuplicate,
    });
  });

  const validRows = parsedRows.filter((r) => r.status === 'ready');
  const invalidRows = parsedRows.filter((r) => r.status === 'invalid' || r.status === 'mismatch');
  const duplicateRows = parsedRows.filter((r) => r.status === 'duplicate');
  const mismatchCount = parsedRows.filter((r) => r.status === 'mismatch').length;

  return {
    fileName: file.name,
    sheetName: targetSheetName,
    totalDetected: parsedRows.length,
    validCount: validRows.length,
    invalidCount: invalidRows.length,
    mismatchCount,
    duplicateCount: duplicateRows.length,
    ignoredColumns: columnMapping.ignoredCols,
    rows: parsedRows,
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
// Multi-Sheet Professional Template Generator
// ------------------------------------------------------------

export function generateExcelTemplateBlob(): Blob {
  const workbook = XLSX.utils.book_new();

  // ── SHEET 1: QUESTIONS (Clean Entry Sheet) ──
  const questionsAOA: any[][] = [
    ['SKILLIZEE ARCADE — TEACHER QUESTION IMPORT'],
    ['Enter one question per row. Select the activity using the dropdown or exact name. Fill all 4 options and mark the correct answer with A, B, C, or D.'],
    [], // Blank separator
    [
      'Activity',
      'Topic',
      'Question',
      'Option A',
      'Option B',
      'Option C',
      'Option D',
      'Correct Answer',
      'Explanation',
      'Difficulty',
      'Tags',
    ],
  ];

  // Provide 20 pre-formatted clean entry rows with default 'Easy' difficulty
  for (let i = 0; i < 20; i++) {
    questionsAOA.push(['', '', '', '', '', '', '', '', '', 'Easy', '']);
  }

  const wsQuestions = XLSX.utils.aoa_to_sheet(questionsAOA);

  wsQuestions['!cols'] = [
    { wch: 32 }, // Activity
    { wch: 28 }, // Topic
    { wch: 55 }, // Question
    { wch: 22 }, // Option A
    { wch: 22 }, // Option B
    { wch: 22 }, // Option C
    { wch: 22 }, // Option D
    { wch: 16 }, // Correct Answer
    { wch: 45 }, // Explanation
    { wch: 14 }, // Difficulty
    { wch: 28 }, // Tags
  ];

  // Freeze top 4 header rows so titles & column headers stay fixed while scrolling
  wsQuestions['!views'] = [{ state: 'frozen', ySplit: 4 }];

  XLSX.utils.book_append_sheet(workbook, wsQuestions, 'Questions');

  // ── SHEET 2: INSTRUCTIONS ──
  const instructionsAOA: any[][] = [
    ['SKILLIZEE ARCADE — TEACHER QUESTION IMPORT INSTRUCTIONS'],
    ['Follow these simple 8 steps to import custom questions for your students.'],
    [],
    ['Step', 'Action', 'Details & Rules'],
    ['Step 1', 'Choose the Activity', 'Select from the 13 official arcade games (e.g. "GraphWorks — Graphs" or "The Chocolate Factory — Fractions").'],
    ['Step 2', 'Verify the Math Topic', 'The topic must match the activity\'s curriculum subject (refer to the "Activity List" sheet).'],
    ['Step 3', 'Enter Your Question', 'Write the complete question prompt. Mathematical symbols (+, -, ×, ÷, ², √, etc.) are fully supported.'],
    ['Step 4', 'Enter Four Options', 'You must provide all 4 distinct answer choices: Option A, Option B, Option C, and Option D.'],
    ['Step 5', 'Select Correct Answer', 'Enter "A", "B", "C", or "D" under the Correct Answer column.'],
    ['Step 6', 'Add Feedback & Difficulty', 'Optionally add an explanation (displayed as learning feedback) and set Difficulty to Easy, Medium, or Hard.'],
    ['Step 7', 'Save the Workbook', 'Save your file as .xlsx or .csv.'],
    ['Step 8', 'Upload into Arcade', 'Open the Question Manager in Skillizee Arcade, click "Import Excel", preview verified questions, and click Import!'],
    [],
    ['KEY SYSTEM RULES:'],
    ['1. One Question = One Activity: Questions strictly belong to the activity you assign them to.'],
    ['2. Teacher Priority: When you start a 5, 10, or 15 question game, your teacher questions are automatically prioritized.'],
    ['3. Excel Tolerance: The importer ignores empty rows and automatically identifies columns by their header names.'],
  ];

  const wsInstructions = XLSX.utils.aoa_to_sheet(instructionsAOA);
  wsInstructions['!cols'] = [{ wch: 12 }, { wch: 28 }, { wch: 75 }];
  XLSX.utils.book_append_sheet(workbook, wsInstructions, 'Instructions');

  // ── SHEET 3: EXAMPLES (Reference Questions) ──
  const examplesData = [
    {
      Activity: 'Graphworks',
      Topic: 'Data Handling & Graphs',
      Question: 'Which ordered pair represents 3 units right on the x-axis and 4 units up on the y-axis?',
      'Option A': '(4, 3)',
      'Option B': '(3, 4)',
      'Option C': '(3, 0)',
      'Option D': '(0, 4)',
      'Correct Answer': 'B',
      Explanation: 'Coordinates are written as (x, y). 3 units right is x = 3 and 4 units up is y = 4.',
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
  ];

  const wsExamples = XLSX.utils.json_to_sheet(examplesData);
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

  // ── SHEET 4: ACTIVITY LIST (Source of Truth) ──
  const activityListData = ACTIVITIES_REGISTRY.map((act) => ({
    'Cabinet #': `Cab #${act.number}`,
    'Activity Name': act.name,
    'Mathematics Topic': act.topic,
    'Dropdown Value (Activity — Topic)': `${act.name} — ${act.shortTopic}`,
    'Activity ID': act.id,
    'Topic ID': act.topicId,
  }));

  const wsActivityList = XLSX.utils.json_to_sheet(activityListData);
  wsActivityList['!cols'] = [
    { wch: 12 },
    { wch: 30 },
    { wch: 32 },
    { wch: 36 },
    { wch: 22 },
    { wch: 22 },
  ];
  XLSX.utils.book_append_sheet(workbook, wsActivityList, 'Activity List');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  return new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
}

// ------------------------------------------------------------
// Error Report Generator (.xlsx)
// ------------------------------------------------------------

export function generateErrorReportBlob(invalidRows: ExcelParsedRow[]): Blob {
  const reportRows = invalidRows.map((inv) => ({
    'Row #': inv.rowNumber,
    Status: inv.status === 'mismatch' ? 'Topic Mismatch' : 'Invalid Data',
    'Errors / Issues Flagged': inv.errors.join('; '),
    'Suggested Fix': inv.expectedTopic
      ? `Change topic to "${inv.expectedTopic}" for ${inv.matchedActivity?.name || 'this activity'}`
      : 'Provide all required fields (Activity, Question, Options A-D, and Correct Answer A/B/C/D)',
    'Activity (Submitted)': inv.rawActivity || 'None',
    'Topic (Submitted)': inv.rawTopic || 'None',
    'Question Prompt': inv.rawQuestion || 'Missing',
    'Option A': inv.rawOptionA || 'Missing',
    'Option B': inv.rawOptionB || 'Missing',
    'Option C': inv.rawOptionC || 'Missing',
    'Option D': inv.rawOptionD || 'Missing',
    'Correct Answer': inv.rawCorrectAnswer || 'Missing',
    Explanation: inv.rawExplanation || '',
    Difficulty: inv.rawDifficulty || 'Easy',
  }));

  const worksheet = XLSX.utils.json_to_sheet(reportRows);
  worksheet['!cols'] = [
    { wch: 10 },
    { wch: 16 },
    { wch: 45 },
    { wch: 45 },
    { wch: 25 },
    { wch: 25 },
    { wch: 50 },
    { wch: 18 },
    { wch: 18 },
    { wch: 18 },
    { wch: 18 },
    { wch: 15 },
    { wch: 35 },
    { wch: 12 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Import_Errors_Report');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  return new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
}

// ------------------------------------------------------------
// Export Questions to Excel
// ------------------------------------------------------------

export function exportQuestionsToExcel(filter?: QuestionBankFilterState): Blob {
  let list = getAllQuestions();

  if (filter) {
    if (filter.activityId && filter.activityId !== 'all') {
      list = list.filter((q) => q.activityId === filter.activityId);
    }
    if (filter.topicId && filter.topicId !== 'all') {
      list = list.filter((q) => q.topicId === filter.topicId);
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
          q.activityName.toLowerCase().includes(qLower) ||
          q.topicName.toLowerCase().includes(qLower) ||
          q.options.some((o) => o.toLowerCase().includes(qLower)) ||
          q.tags.some((t) => t.toLowerCase().includes(qLower))
      );
    }
  }

  const exportRows = list.map((q) => ({
    Source: q.source === 'teacher' ? 'My Questions (Teacher)' : 'Built-in Arcade',
    Activity: q.activityName,
    Topic: q.topicName,
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
    { wch: 28 },
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
  return new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
}

