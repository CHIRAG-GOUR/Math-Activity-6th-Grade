import React, { useState, useEffect, useMemo } from 'react';
import {
  UniversalQuestion,
  GameQuestionCount,
  GameSessionSetup,
} from '@/types/questionBank';
import { getActivityById } from '@/services/activityRegistry';
import {
  getQuestionsForActivity,
  autoSelectQuestions,
} from '@/services/questionBankService';
import { setActiveGameSession } from '@/services/gameSessionService';
import { QuestionPreviewModal } from './QuestionPreviewModal';
import { QuestionFormModal } from './QuestionFormModal';

interface GameQuestionSetupModalProps {
  isOpen: boolean;
  activityId: string;
  onClose: () => void;
  onLaunchGame: (sessionSetup: GameSessionSetup) => void;
  onOpenQuestionManager?: () => void;
}

export const GameQuestionSetupModal: React.FC<GameQuestionSetupModalProps> = ({
  isOpen,
  activityId,
  onClose,
  onLaunchGame,
  onOpenQuestionManager,
}) => {
  const activity = getActivityById(activityId);

  // 1. Question Count Mode: 5, 10, or 15 ONLY
  const [questionCount, setQuestionCount] = useState<GameQuestionCount>(5);

  // Available questions for this activity
  const [teacherQuestions, setTeacherQuestions] = useState<UniversalQuestion[]>([]);
  const [builtInQuestions, setBuiltInQuestions] = useState<UniversalQuestion[]>([]);

  // Selected Question IDs (ordered)
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Order & Answer randomization settings
  const [orderMode, setOrderMode] = useState<'selected' | 'randomized'>('selected');
  const [randomizeAnswers, setRandomizeAnswers] = useState<boolean>(true);

  // Preview & Subform modals
  const [previewQuestion, setPreviewQuestion] = useState<UniversalQuestion | null>(null);
  const [isAddQuestionOpen, setIsAddQuestionOpen] = useState<boolean>(false);

  // Load questions when opened or activity changes
  const loadQuestions = () => {
    const { teacher, builtIn } = getQuestionsForActivity(activityId);
    setTeacherQuestions(teacher);
    setBuiltInQuestions(builtIn);

    // Run auto-select by default with teacher priority!
    const auto = autoSelectQuestions(activityId, questionCount);
    setSelectedIds(auto.selectedQuestions.map((q) => q.id));
  };

  useEffect(() => {
    if (isOpen && activityId) {
      loadQuestions();
    }
  }, [isOpen, activityId]);

  // When question count mode changes (5 -> 10 -> 15), re-run auto-select
  const handleCountModeChange = (count: GameQuestionCount) => {
    setQuestionCount(count);
    const auto = autoSelectQuestions(activityId, count);
    setSelectedIds(auto.selectedQuestions.map((q) => q.id));
  };

  const handleAutoSelect = () => {
    const auto = autoSelectQuestions(activityId, questionCount);
    setSelectedIds(auto.selectedQuestions.map((q) => q.id));
  };

  // Toggle selection for a question
  const toggleQuestionSelection = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      // Add to list
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Move question up in selected order
  const moveQuestionUp = (index: number) => {
    if (index <= 0) return;
    const updated = [...selectedIds];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    setSelectedIds(updated);
  };

  // Move question down in selected order
  const moveQuestionDown = (index: number) => {
    if (index >= selectedIds.length - 1) return;
    const updated = [...selectedIds];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    setSelectedIds(updated);
  };

  // Build selected objects map
  const allMap = useMemo(() => {
    const map = new Map<string, UniversalQuestion>();
    [...teacherQuestions, ...builtInQuestions].forEach((q) => map.set(q.id, q));
    return map;
  }, [teacherQuestions, builtInQuestions]);

  const selectedQuestions = useMemo(() => {
    return selectedIds.map((id) => allMap.get(id)).filter(Boolean) as UniversalQuestion[];
  }, [selectedIds, allMap]);

  const teacherSelectedCount = useMemo(
    () => selectedQuestions.filter((q) => q.source === 'teacher').length,
    [selectedQuestions]
  );
  const builtInSelectedCount = useMemo(
    () => selectedQuestions.filter((q) => q.source === 'built-in').length,
    [selectedQuestions]
  );

  const isExactCount = selectedIds.length === questionCount;
  const countDiff = questionCount - selectedIds.length;

  if (!isOpen) return null;

  const handleStartGame = () => {
    if (!isExactCount) return;

    const setup: GameSessionSetup = {
      activityId,
      activityName: activity ? activity.name : activityId,
      questionCount,
      selectedQuestionIds: selectedIds,
      questions: selectedQuestions,
      teacherCount: teacherSelectedCount,
      builtInCount: builtInSelectedCount,
      orderMode,
      randomizeAnswers,
      timestamp: Date.now(),
    };

    setActiveGameSession(setup);
    onLaunchGame(setup);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl h-[92vh] bg-slate-50 rounded-3xl shadow-2xl border-2 border-slate-800 overflow-hidden flex flex-col font-sans">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 text-white border-b-2 border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-3.5">
            <span
              className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shadow-md"
              style={{
                backgroundColor: activity?.badgeBg || '#3b82f6',
                color: activity?.badgeText || '#ffffff',
              }}
            >
              {activity ? activity.number : '🎮'}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white uppercase">
                  Question Setup: {activity?.name || 'Arcade Game'}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  {activity?.topic || 'Curriculum Match'}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Choose question volume, prioritize custom teacher questions, and launch the match
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenQuestionManager && (
              <button
                onClick={() => {
                  onClose();
                  onOpenQuestionManager();
                }}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors border border-slate-700 hidden sm:flex items-center gap-1.5"
              >
                📚 Question Manager
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition-colors border border-slate-700 font-black"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Setup Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* STEP 1: Question Count Mode Selector (5, 10, or 15 ONLY) */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700">
                1. Select Question Count (Strictly 5, 10, or 15 Questions)
              </label>
              <span className="text-[11px] font-bold text-slate-500">
                Determines game match length
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {(
                [
                  { count: 5 as const, title: '5 Questions', subtitle: 'Quick Match (~3-5 mins)', icon: '⚡' },
                  { count: 10 as const, title: '10 Questions', subtitle: 'Standard Tournament (~8-10 mins)', icon: '🏆' },
                  { count: 15 as const, title: '15 Questions', subtitle: 'Mastery Gauntlet (~15 mins)', icon: '👑' },
                ] as const
              ).map((mode) => {
                const isSelected = questionCount === mode.count;
                return (
                  <button
                    key={mode.count}
                    type="button"
                    onClick={() => handleCountModeChange(mode.count)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                      isSelected
                        ? 'bg-blue-50/90 border-blue-600 ring-2 ring-blue-500/30 shadow-md scale-[1.02]'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-2xl">{mode.icon}</span>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center">
                            ✓
                          </span>
                        )}
                      </div>
                      <div className="text-sm sm:text-base font-black text-slate-900">
                        {mode.title}
                      </div>
                      <div className="text-[11px] font-bold text-slate-500 mt-0.5">
                        {mode.subtitle}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: Teacher Priority Banner & Status */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-amber-600 text-base">⭐</span>
                <span className="text-xs font-black text-amber-950 uppercase tracking-wider">
                  Teacher Priority Active
                </span>
              </div>
              <p className="text-xs font-bold text-slate-700">
                {teacherSelectedCount > 0 ? (
                  <>
                    Using <span className="text-amber-700 font-black">{teacherSelectedCount} teacher questions</span>
                    {builtInSelectedCount > 0 && (
                      <> + <span className="text-blue-700 font-black">{builtInSelectedCount} built-in questions</span></>
                    )}
                  </>
                ) : (
                  <>Using <span className="text-blue-700 font-black">{builtInSelectedCount} built-in questions</span> (No custom teacher questions selected)</>
                )}
              </p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              <button
                type="button"
                onClick={handleAutoSelect}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5"
              >
                <span>✨</span> Auto Select ({questionCount})
              </button>

              <button
                type="button"
                onClick={() => setIsAddQuestionOpen(true)}
                className="px-3.5 py-2 bg-white hover:bg-slate-50 text-blue-700 border border-blue-300 font-black text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5"
              >
                <span>➕</span> Add Question
              </button>
            </div>
          </div>

          {/* Selection Validation Alert */}
          {!isExactCount && (
            <div
              className={`p-3.5 rounded-xl border-2 text-xs font-black flex items-center justify-between ${
                countDiff > 0
                  ? 'bg-amber-50 border-amber-400 text-amber-900'
                  : 'bg-rose-50 border-rose-400 text-rose-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>⚠️</span>
                <span>
                  {countDiff > 0
                    ? `Please select ${countDiff} more question${countDiff > 1 ? 's' : ''} (${selectedIds.length} / ${questionCount} selected)`
                    : `Please uncheck ${Math.abs(countDiff)} question${Math.abs(countDiff) > 1 ? 's' : ''} (${selectedIds.length} / ${questionCount} selected)`}
                </span>
              </div>
              <button
                onClick={handleAutoSelect}
                className="underline uppercase font-bold text-xs"
              >
                Auto-Fix to {questionCount}
              </button>
            </div>
          )}

          {/* STEP 3: Two Question Banks (MY QUESTIONS vs OTHER QUESTIONS) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* List 1: MY / TEACHER QUESTIONS */}
            <div className="bg-white border-2 border-amber-300 rounded-2xl p-4 shadow-xs flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-amber-200 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center text-xs font-black">
                    ⭐
                  </span>
                  <span className="text-xs font-black uppercase text-amber-950 tracking-wider">
                    My Teacher Questions ({teacherQuestions.length})
                  </span>
                </div>
                <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                  Priority 1
                </span>
              </div>

              {teacherQuestions.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs font-medium space-y-2">
                  <p>You haven't added custom questions for this activity yet.</p>
                  <button
                    onClick={() => setIsAddQuestionOpen(true)}
                    className="text-xs font-black text-blue-600 hover:text-blue-800 underline uppercase"
                  >
                    + Add First Question
                  </button>
                </div>
              ) : (
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {teacherQuestions.map((q) => {
                    const isChecked = selectedIds.includes(q.id);
                    return (
                      <div
                        key={q.id}
                        className={`p-3 rounded-xl border-2 transition-all flex items-start gap-2.5 ${
                          isChecked
                            ? 'bg-amber-50/70 border-amber-400 shadow-xs'
                            : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleQuestionSelection(q.id)}
                          className="w-4 h-4 rounded text-amber-600 accent-amber-500 cursor-pointer mt-0.5"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-900 line-clamp-2">
                            {q.question}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-black text-emerald-700">
                              Ans: {q.correctAnswer}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400">
                              • Level: {q.difficulty}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setPreviewQuestion(q)}
                          className="text-[11px] font-bold text-blue-600 hover:text-blue-800 p-1"
                        >
                          👁️
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* List 2: OTHER QUESTIONS (Built-in) */}
            <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-black">
                    🕹️
                  </span>
                  <span className="text-xs font-black uppercase text-slate-800 tracking-wider">
                    Other Questions / Built-in ({builtInQuestions.length})
                  </span>
                </div>
                <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  Fallback
                </span>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {builtInQuestions.map((q) => {
                  const isChecked = selectedIds.includes(q.id);
                  return (
                    <div
                      key={q.id}
                      className={`p-3 rounded-xl border-2 transition-all flex items-start gap-2.5 ${
                        isChecked
                          ? 'bg-blue-50/70 border-blue-400 shadow-xs'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleQuestionSelection(q.id)}
                        className="w-4 h-4 rounded text-blue-600 accent-blue-600 cursor-pointer mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 line-clamp-2">
                          {q.question}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-black text-emerald-700">
                            Ans: {q.correctAnswer}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400">
                            • Level: {q.difficulty}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPreviewQuestion(q)}
                        className="text-[11px] font-bold text-blue-600 hover:text-blue-800 p-1"
                      >
                        👁️
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* STEP 4: Selected Questions Sequence & Reorder Section */}
          {selectedQuestions.length > 0 && (
            <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase text-slate-800 tracking-wider">
                    Selected Match Sequence ({selectedQuestions.length} Questions)
                  </span>
                  <span className="text-[11px] font-bold text-slate-500">
                    (Use arrows to reorder progression)
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold text-slate-700">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="orderMode"
                      checked={orderMode === 'selected'}
                      onChange={() => setOrderMode('selected')}
                      className="accent-blue-600"
                    />
                    <span>My sequence</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="orderMode"
                      checked={orderMode === 'randomized'}
                      onChange={() => setOrderMode('randomized')}
                      className="accent-blue-600"
                    />
                    <span>Randomize question order</span>
                  </label>
                </div>
              </div>

              <div className="space-y-1.5 max-h-56 overflow-y-auto">
                {selectedQuestions.map((q, idx) => {
                  const isTeacher = q.source === 'teacher';
                  return (
                    <div
                      key={q.id}
                      className="flex items-center justify-between gap-3 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="w-5 h-5 rounded bg-slate-200 font-black text-[10px] text-slate-700 flex items-center justify-center flex-shrink-0">
                          {idx + 1}
                        </span>
                        <span
                          className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded flex-shrink-0 ${
                            isTeacher ? 'bg-amber-200 text-amber-900' : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {isTeacher ? 'Teacher' : 'Built-in'}
                        </span>
                        <span className="font-bold text-slate-800 truncate">
                          {q.question}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => moveQuestionUp(idx)}
                          className="px-1.5 py-0.5 bg-white hover:bg-slate-200 disabled:opacity-30 border border-slate-300 rounded text-[10px] font-bold"
                          title="Move up"
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          disabled={idx === selectedQuestions.length - 1}
                          onClick={() => moveQuestionDown(idx)}
                          className="px-1.5 py-0.5 bg-white hover:bg-slate-200 disabled:opacity-30 border border-slate-300 rounded text-[10px] font-bold"
                          title="Move down"
                        >
                          ▼
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleQuestionSelection(q.id)}
                          className="text-rose-600 hover:text-rose-800 font-bold px-1"
                          title="Remove from selection"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Randomize Answer Choices Checkbox */}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={randomizeAnswers}
                    onChange={(e) => setRandomizeAnswers(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 accent-blue-600"
                  />
                  <span>
                    Randomize answer positions (A, B, C, D) during gameplay (Preserves correct answer)
                  </span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Footer: Live Count & START GAME button */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 bg-slate-100 border-t-2 border-slate-200 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Selected:</span>
              <span
                className={`text-sm font-black px-2.5 py-1 rounded-lg border ${
                  isExactCount
                    ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
                    : 'bg-rose-100 text-rose-950 border-rose-300'
                }`}
              >
                {selectedIds.length} / {questionCount} Questions
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-600">
              <span className="text-amber-600 font-black">★ {teacherSelectedCount} Teacher</span>
              <span>+</span>
              <span className="text-blue-600 font-black">🕹️ {builtInSelectedCount} Built-in</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-sm rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleStartGame}
              disabled={!isExactCount}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-sm rounded-xl transition-all shadow-lg hover:shadow-blue-500/30 flex items-center gap-2"
            >
              <span>🚀</span> START GAME ({questionCount} Qs)
            </button>
          </div>
        </div>

        {/* Sub-modals */}
        <QuestionPreviewModal
          question={previewQuestion}
          onClose={() => setPreviewQuestion(null)}
        />

        <QuestionFormModal
          isOpen={isAddQuestionOpen}
          defaultActivityId={activityId}
          onClose={() => setIsAddQuestionOpen(false)}
          onSaved={(newQ) => {
            loadQuestions();
            // Automatically select the newly created question
            setSelectedIds((prev) => [newQ.id, ...prev.slice(0, questionCount - 1)]);
          }}
        />
      </div>
    </div>
  );
};
