import React, { useState, useEffect, useRef } from 'react';
import { UniversalQuestion, AnswerOptionKey, QuestionDifficulty } from '@/types/questionBank';
import { ACTIVITIES_REGISTRY, getActivityById } from '@/services/activityRegistry';
import { createTeacherQuestion, updateTeacherQuestion } from '@/services/questionBankService';

interface QuestionFormModalProps {
  isOpen: boolean;
  initialQuestion?: UniversalQuestion | null;
  defaultActivityId?: string;
  onClose: () => void;
  onSaved: (savedQuestion: UniversalQuestion, message: string) => void;
}

const MATH_SYMBOLS = ['×', '÷', '±', '√', 'π', '²', '³', '½', '¼', '¾', '≤', '≥', '≠', '°', ':'];

export const QuestionFormModal: React.FC<QuestionFormModalProps> = ({
  isOpen,
  initialQuestion,
  defaultActivityId,
  onClose,
  onSaved,
}) => {
  const [activityId, setActivityId] = useState<string>(
    initialQuestion?.activityId || defaultActivityId || ACTIVITIES_REGISTRY[0].id
  );
  const [questionText, setQuestionText] = useState<string>(initialQuestion?.question || '');
  const [optionA, setOptionA] = useState<string>(initialQuestion?.options[0] || '');
  const [optionB, setOptionB] = useState<string>(initialQuestion?.options[1] || '');
  const [optionC, setOptionC] = useState<string>(initialQuestion?.options[2] || '');
  const [optionD, setOptionD] = useState<string>(initialQuestion?.options[3] || '');
  const [correctAnswer, setCorrectAnswer] = useState<AnswerOptionKey>(
    initialQuestion?.correctAnswer || 'A'
  );
  const [explanation, setExplanation] = useState<string>(initialQuestion?.explanation || '');
  const [difficulty, setDifficulty] = useState<QuestionDifficulty>(
    initialQuestion?.difficulty || 'easy'
  );
  const [tagsInput, setTagsInput] = useState<string>(
    initialQuestion?.tags ? initialQuestion.tags.join(', ') : ''
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const activeInputRef = useRef<HTMLTextAreaElement | HTMLInputElement | null>(null);

  useEffect(() => {
    if (initialQuestion) {
      setActivityId(initialQuestion.activityId);
      setQuestionText(initialQuestion.question);
      setOptionA(initialQuestion.options[0]);
      setOptionB(initialQuestion.options[1]);
      setOptionC(initialQuestion.options[2]);
      setOptionD(initialQuestion.options[3]);
      setCorrectAnswer(initialQuestion.correctAnswer);
      setExplanation(initialQuestion.explanation || '');
      setDifficulty(initialQuestion.difficulty);
      setTagsInput(initialQuestion.tags ? initialQuestion.tags.join(', ') : '');
    } else {
      setActivityId(defaultActivityId || ACTIVITIES_REGISTRY[0].id);
      setQuestionText('');
      setOptionA('');
      setOptionB('');
      setOptionC('');
      setOptionD('');
      setCorrectAnswer('A');
      setExplanation('');
      setDifficulty('easy');
      setTagsInput('');
    }
    setErrorMessage(null);
  }, [initialQuestion, defaultActivityId, isOpen]);

  if (!isOpen) return null;

  const insertSymbol = (sym: string) => {
    if (activeInputRef.current) {
      const input = activeInputRef.current;
      const start = input.selectionStart || 0;
      const end = input.selectionEnd || 0;
      const val = input.value;
      const updated = val.substring(0, start) + sym + val.substring(end);
      
      if (input.name === 'question') setQuestionText(updated);
      else if (input.name === 'optionA') setOptionA(updated);
      else if (input.name === 'optionB') setOptionB(updated);
      else if (input.name === 'optionC') setOptionC(updated);
      else if (input.name === 'optionD') setOptionD(updated);
      else if (input.name === 'explanation') setExplanation(updated);

      setTimeout(() => {
        input.focus();
        input.setSelectionRange(start + sym.length, start + sym.length);
      }, 10);
    } else {
      setQuestionText((prev) => prev + sym);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!questionText.trim()) {
      setErrorMessage('Please enter the question text.');
      return;
    }
    if (!optionA.trim() || !optionB.trim() || !optionC.trim() || !optionD.trim()) {
      setErrorMessage('All four answer options (A, B, C, D) are required.');
      return;
    }
    if (!['A', 'B', 'C', 'D'].includes(correctAnswer)) {
      setErrorMessage('Please select a valid correct answer choice.');
      return;
    }

    setIsSubmitting(true);
    try {
      const parsedTags = tagsInput
        .split(/[,;|]/)
        .map((t) => t.trim())
        .filter(Boolean);

      let saved: UniversalQuestion;
      const activity = getActivityById(activityId);
      const activityLabel = activity ? activity.name : 'Selected Activity';

      if (initialQuestion && initialQuestion.source === 'teacher') {
        saved = updateTeacherQuestion(initialQuestion.id, {
          activityId,
          question: questionText,
          options: [optionA, optionB, optionC, optionD],
          correctAnswer,
          explanation,
          difficulty,
          tags: parsedTags,
        });
        onSaved(saved, `✓ Question updated for ${activityLabel}`);
      } else {
        saved = createTeacherQuestion({
          activityId,
          question: questionText,
          options: [optionA, optionB, optionC, optionD],
          correctAnswer,
          explanation,
          difficulty,
          tags: parsedTags,
        });
        onSaved(saved, `✓ Question added to ${activityLabel}`);
      }
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save question.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedActivity = getActivityById(activityId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border-2 border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b-2 border-slate-800">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-lg font-black text-white shadow-inner">
              ✏️
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                {initialQuestion ? 'Edit Teacher Question' : 'Create Teacher Question'}
              </h2>
              <p className="text-xs text-slate-300 font-medium">
                Add custom curriculum questions for Grade 6 Mathematics Arcade
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border-2 border-rose-400 rounded-xl text-xs font-black text-rose-800 flex items-center gap-2 animate-shake">
              <span>⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Activity Dropdown */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
              Target Arcade Activity <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                value={activityId}
                onChange={(e) => setActivityId(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-300 rounded-xl font-bold text-slate-900 text-sm focus:bg-white focus:border-blue-600 focus:outline-none transition-all cursor-pointer"
              >
                {ACTIVITIES_REGISTRY.map((act) => (
                  <option key={act.id} value={act.id}>
                    Cab {act.number} • {act.name} ({act.topic})
                  </option>
                ))}
              </select>
            </div>
            {selectedActivity && (
              <div className="mt-1.5 flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-500">Topic:</span>
                <span
                  className="text-[11px] font-black px-2 py-0.5 rounded-md"
                  style={{ backgroundColor: selectedActivity.badgeBg, color: selectedActivity.badgeText }}
                >
                  {selectedActivity.topic}
                </span>
              </div>
            )}
          </div>

          {/* Math Symbol Toolbar */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                Question Text <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-1 overflow-x-auto py-0.5 max-w-[65%]">
                <span className="text-[10px] font-bold text-slate-400 mr-1 hidden sm:inline">Symbols:</span>
                {MATH_SYMBOLS.map((sym) => (
                  <button
                    key={sym}
                    type="button"
                    onClick={() => insertSymbol(sym)}
                    className="px-2 py-1 bg-slate-100 hover:bg-blue-100 hover:text-blue-700 text-slate-800 text-xs font-bold rounded border border-slate-300 transition-colors"
                  >
                    {sym}
                  </button>
                ))}
              </div>
            </div>
            <textarea
              name="question"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              onFocus={(e) => (activeInputRef.current = e.target)}
              placeholder="e.g. A movie studio uses 2 cameras for every 3 actors. If there are 12 actors, how many cameras are needed?"
              rows={3}
              className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-300 rounded-xl font-medium text-slate-900 text-sm focus:bg-white focus:border-blue-600 focus:outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Answer Options (A, B, C, D) & Correct Answer Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                Answer Choices & Correct Answer <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] font-bold text-slate-500">
                Click the circular badge to mark as Correct Answer
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {(
                [
                  { key: 'A' as AnswerOptionKey, value: optionA, setter: setOptionA, name: 'optionA' },
                  { key: 'B' as AnswerOptionKey, value: optionB, setter: setOptionB, name: 'optionB' },
                  { key: 'C' as AnswerOptionKey, value: optionC, setter: setOptionC, name: 'optionC' },
                  { key: 'D' as AnswerOptionKey, value: optionD, setter: setOptionD, name: 'optionD' },
                ] as const
              ).map(({ key, value, setter, name }) => {
                const isCorrect = correctAnswer === key;
                return (
                  <div
                    key={key}
                    className={`flex items-center gap-2.5 p-2 rounded-xl border-2 transition-all ${
                      isCorrect
                        ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-400/30'
                        : 'bg-white border-slate-300 focus-within:border-blue-500'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setCorrectAnswer(key)}
                      title={`Mark Option ${key} as correct answer`}
                      className={`w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-lg font-black text-xs transition-all ${
                        isCorrect
                          ? 'bg-emerald-600 text-white shadow-md scale-105'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
                      }`}
                    >
                      {isCorrect ? '✓ ' + key : key}
                    </button>
                    <input
                      type="text"
                      name={name}
                      value={value}
                      onChange={(e) => setter(e.target.value)}
                      onFocus={(e) => (activeInputRef.current = e.target)}
                      placeholder={`Option ${key}`}
                      className="flex-1 bg-transparent text-sm font-bold text-slate-900 focus:outline-none placeholder:text-slate-400"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Explanation / Learning Feedback */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
              <span>💡</span> Explanation / Learning Feedback (Optional)
            </label>
            <textarea
              name="explanation"
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              onFocus={(e) => (activeInputRef.current = e.target)}
              placeholder="e.g. Scale factor is 4 (12 ÷ 3 = 4). Multiply 2 cameras × 4 = 8 cameras."
              rows={2}
              className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-300 rounded-xl font-medium text-slate-900 text-sm focus:bg-white focus:border-blue-600 focus:outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Difficulty & Tags Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Difficulty */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { id: 'easy', label: 'Easy', color: 'emerald' },
                    { id: 'medium', label: 'Medium', color: 'amber' },
                    { id: 'hard', label: 'Hard', color: 'rose' },
                  ] as const
                ).map((lvl) => {
                  const isSelected = difficulty === lvl.id;
                  return (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setDifficulty(lvl.id)}
                      className={`py-2 px-3 rounded-xl text-xs font-black uppercase transition-all border-2 ${
                        isSelected
                          ? lvl.id === 'easy'
                            ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                            : lvl.id === 'medium'
                            ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-sm'
                            : 'bg-rose-600 text-white border-rose-700 shadow-sm'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300'
                      }`}
                    >
                      {lvl.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                Question Tags (Comma Separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. Ratio, Scaling, Word Problem"
                className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-300 rounded-xl font-medium text-slate-900 text-sm focus:bg-white focus:border-blue-600 focus:outline-none transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t-2 border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-7 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-black text-sm rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2"
            >
              {isSubmitting ? 'Saving...' : initialQuestion ? '✓ Update Question' : '✓ Save Question'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
