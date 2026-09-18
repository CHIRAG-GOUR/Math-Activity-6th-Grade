// ============================================================
// SKILLIZEE ARCADE — ACTIVE GAME SESSION SERVICE
// Coordinates question handoff between Question Setup Modal
// and individual activity game engines.
// Supports 5, 10, or 15 questions, answer choice randomization,
// order preservation, and fallback defaults with Teacher Priority.
// ============================================================

import { GameSessionSetup, UniversalQuestion, GameQuestionCount, AnswerOptionKey } from '@/types/questionBank';
import { autoSelectQuestions, recordPlayedQuestions } from './questionBankService';
import { getActivityById } from './activityRegistry';
import { RatioQuestion } from '@/game/ratio-rush/types';
import { Question } from '@/types/game';

const SESSION_STORAGE_KEY_PREFIX = 'skillizee_game_session_';

/**
 * Save an active game session for an activity to sessionStorage.
 */
export function setActiveGameSession(setup: GameSessionSetup): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(
      `${SESSION_STORAGE_KEY_PREFIX}${setup.activityId}`,
      JSON.stringify(setup)
    );
    // Also record played questions in history
    recordPlayedQuestions(setup.activityId, setup.selectedQuestionIds);
  } catch (err) {
    console.error('Failed to save active game session to sessionStorage:', err);
  }
}

/**
 * Retrieve active session setup for an activity.
 * If none exists, creates a default 5-question session with Teacher Priority!
 */
export function getActiveGameSession(activityId: string): GameSessionSetup {
  if (typeof window !== 'undefined') {
    try {
      const raw = sessionStorage.getItem(`${SESSION_STORAGE_KEY_PREFIX}${activityId}`);
      if (raw) {
        const parsed: GameSessionSetup = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Failed to parse active game session from sessionStorage, falling back to auto-select:', err);
    }
  }

  // Fallback: auto-select 5 questions prioritizing teacher questions
  const auto = autoSelectQuestions(activityId, 5);
  const act = getActivityById(activityId);
  const fallbackSetup: GameSessionSetup = {
    activityId,
    activityName: act ? act.name : activityId,
    questionCount: 5,
    selectedQuestionIds: auto.selectedQuestions.map((q) => q.id),
    questions: auto.selectedQuestions,
    teacherCount: auto.teacherCount,
    builtInCount: auto.builtInCount,
    orderMode: 'selected',
    randomizeAnswers: false,
    timestamp: Date.now(),
  };

  return fallbackSetup;
}

/**
 * Prepare and finalize question array for the game:
 * Applies question ordering (if randomized) and answer choices shuffling (if enabled).
 */
export function finalizeGameQuestions(setup: GameSessionSetup): UniversalQuestion[] {
  let list = [...setup.questions];

  // 1. Order mode
  if (setup.orderMode === 'randomized') {
    list = list.sort(() => Math.random() - 0.5);
  }

  // 2. Randomize answer option choices if requested
  if (setup.randomizeAnswers) {
    list = list.map((q) => {
      // Map original options: 0->A, 1->B, 2->C, 3->D
      const correctText = q.options[['A', 'B', 'C', 'D'].indexOf(q.correctAnswer)];
      const shuffledOptions = [...q.options].sort(() => Math.random() - 0.5) as [string, string, string, string];
      const newCorrectIndex = shuffledOptions.indexOf(correctText);
      const newCorrectKey = (['A', 'B', 'C', 'D'][newCorrectIndex] || 'A') as AnswerOptionKey;

      return {
        ...q,
        options: shuffledOptions,
        correctAnswer: newCorrectKey,
      };
    });
  }

  return list;
}

/**
 * Adapt universal questions to Ratio Rush game engine format
 */
export function adaptUniversalToRatioQuestions(universalQuestions: UniversalQuestion[]): RatioQuestion[] {
  return universalQuestions.map((uq, idx) => {
    // Check if correct answer option is numeric or string
    const correctIdx = ['A', 'B', 'C', 'D'].indexOf(uq.correctAnswer);
    const correctText = uq.options[correctIdx >= 0 ? correctIdx : 0];
    
    // Parse numeric value if possible
    const parsedNum = parseFloat(correctText.replace(/[^0-9.-]/g, ''));
    const safeCorrectAnswer = !isNaN(parsedNum) ? parsedNum : idx + 1;

    const numericOptions = uq.options.map((opt, oIdx) => {
      const num = parseFloat(opt.replace(/[^0-9.-]/g, ''));
      return !isNaN(num) ? num : oIdx + 1;
    });

    return {
      id: uq.id,
      stage: idx + 1,
      title: `Stage ${idx + 1}: ${uq.activityName}`,
      scenario: uq.tags.length > 0 ? `Topic: ${uq.tags.join(', ')}` : 'Studio Mathematics Challenge',
      mathPrompt: uq.question,
      ratioA: 1,
      ratioB: 2,
      labelA: 'Quantity A',
      labelB: 'Quantity B',
      targetQuantityName: 'Solution',
      givenQuantityName: 'Scale',
      givenQuantityValue: 1,
      correctAnswer: safeCorrectAnswer,
      correctUnit: '',
      options: numericOptions,
      unitRateExplanation: uq.explanation || `Correct Answer: Option ${uq.correctAnswer} (${correctText})`,
      studioActionText: `Stage ${idx + 1} Action: Mathematics challenge in progress!`,
      diagram: {
        blocksA: 2,
        blocksB: 3,
        multiplier: 2,
        totalUnits: 5,
      },
      misconceptions: [
        {
          wrongAnswer: numericOptions[(correctIdx + 1) % 4] || 0,
          reason: 'Review the question and ratio calculation.',
        },
      ],
    };
  });
}


/**
 * Adapt universal questions to Math Escape Vault question format
 */
export function adaptUniversalToVaultQuestions(universalQuestions: UniversalQuestion[]): Question[] {
  return universalQuestions.map((uq) => {
    const correctIdx = ['A', 'B', 'C', 'D'].indexOf(uq.correctAnswer);
    const correctText = uq.options[correctIdx >= 0 ? correctIdx : 0];
    const parsedNum = parseFloat(correctText.replace(/[^0-9.-]/g, ''));
    const isNum = !isNaN(parsedNum) && parsedNum.toString() === correctText.trim();

    return {
      id: uq.id,
      text: uq.question,
      subText: uq.tags.length > 0 ? uq.tags.join(', ') : undefined,
      answer: isNum ? parsedNum : correctText,
      options: uq.options.map((opt) => {
        const num = parseFloat(opt.replace(/[^0-9.-]/g, ''));
        return !isNaN(num) && num.toString() === opt.trim() ? num : opt;
      }),
      hint: uq.explanation || 'Look closely at the place values and numbers.',
      explanation: uq.explanation || `Correct Answer: Option ${uq.correctAnswer} (${correctText})`,
      topic: 'mixed',
      difficulty: uq.difficulty,
      timeLimit: 30,
    };
  });
}
