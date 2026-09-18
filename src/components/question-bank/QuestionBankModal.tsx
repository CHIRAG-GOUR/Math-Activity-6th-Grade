import React, { useState, useMemo, useEffect } from 'react';
import {
  UniversalQuestion,
  QuestionBankFilterState,
  QuestionDifficulty,
} from '@/types/questionBank';
import {
  getAllQuestions,
  getTeacherQuestions,
  getBuiltInQuestions,
  deleteTeacherQuestion,
  deleteMultipleTeacherQuestions,
  duplicateTeacherQuestion,
  exportQuestionsToExcel,
  generateExcelTemplateBlob,
} from '@/services/questionBankService';
import { ACTIVITIES_REGISTRY, getActivityById } from '@/services/activityRegistry';
import { QuestionFormModal } from './QuestionFormModal';
import { ExcelImportModal } from './ExcelImportModal';
import { QuestionPreviewModal } from './QuestionPreviewModal';

interface QuestionBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultActivityId?: string;
  onStartActivitySetup?: (activityId: string) => void;
}

export const QuestionBankModal: React.FC<QuestionBankModalProps> = ({
  isOpen,
  onClose,
  defaultActivityId,
  onStartActivitySetup,
}) => {
  // Questions State
  const [allQuestions, setAllQuestions] = useState<UniversalQuestion[]>([]);
  const [filterState, setFilterState] = useState<QuestionBankFilterState>({
    activityId: defaultActivityId || 'all',
    source: 'all',
    difficulty: 'all',
    searchQuery: '',
    tag: '',
  });

  // Selected for Bulk Delete
  const [selectedTeacherIds, setSelectedTeacherIds] = useState<string[]>([]);

  // Sub-Modals
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingQuestion, setEditingQuestion] = useState<UniversalQuestion | null>(null);
  const [isExcelImportOpen, setIsExcelImportOpen] = useState<boolean>(false);
  const [previewQuestion, setPreviewQuestion] = useState<UniversalQuestion | null>(null);

  // Toast / Status banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load questions on open
  const reloadQuestions = () => {
    const list = getAllQuestions();
    setAllQuestions(list);
    setSelectedTeacherIds([]);
  };

  useEffect(() => {
    if (isOpen) {
      reloadQuestions();
      if (defaultActivityId) {
        setFilterState((prev) => ({ ...prev, activityId: defaultActivityId }));
      }
    }
  }, [isOpen, defaultActivityId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Filtered list
  const filteredQuestions = useMemo(() => {
    return allQuestions.filter((q) => {
      // Activity filter
      if (filterState.activityId !== 'all' && q.activityId !== filterState.activityId) {
        return false;
      }
      // Source filter
      if (filterState.source !== 'all' && q.source !== filterState.source) {
        return false;
      }
      // Difficulty filter
      if (filterState.difficulty !== 'all' && q.difficulty !== filterState.difficulty) {
        return false;
      }
      // Search query
      if (filterState.searchQuery.trim()) {
        const query = filterState.searchQuery.toLowerCase();
        const inQuestion = q.question.toLowerCase().includes(query);
        const inOptions = q.options.some((opt) => opt.toLowerCase().includes(query));
        const inActivity = q.activityName.toLowerCase().includes(query);
        const inTags = q.tags.some((t) => t.toLowerCase().includes(query));
        if (!inQuestion && !inOptions && !inActivity && !inTags) {
          return false;
        }
      }
      return true;
    });
  }, [allQuestions, filterState]);

  // Question counts
  const teacherCount = useMemo(
    () => allQuestions.filter((q) => q.source === 'teacher').length,
    [allQuestions]
  );
  const builtInCount = useMemo(
    () => allQuestions.filter((q) => q.source === 'built-in').length,
    [allQuestions]
  );

  if (!isOpen) return null;

  // Handlers
  const handleEdit = (q: UniversalQuestion) => {
    setEditingQuestion(q);
    setIsFormOpen(true);
  };

  const handleDuplicate = (q: UniversalQuestion) => {
    try {
      const duplicated = duplicateTeacherQuestion(q.id);
      reloadQuestions();
      showToast(`✓ Question duplicated as copy`);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = (q: UniversalQuestion) => {
    if (q.source === 'built-in') {
      alert('Built-in arcade questions cannot be deleted.');
      return;
    }
    if (confirm(`Are you sure you want to delete this question?\n\n"${q.question.substring(0, 80)}..."`)) {
      deleteTeacherQuestion(q.id);
      reloadQuestions();
      showToast('✓ Teacher question deleted.');
    }
  };

  const handleBulkDelete = () => {
    if (selectedTeacherIds.length === 0) return;
    if (
      confirm(
        `Are you sure you want to delete ${selectedTeacherIds.length} selected teacher questions? This action cannot be undone.`
      )
    ) {
      const count = deleteMultipleTeacherQuestions(selectedTeacherIds);
      reloadQuestions();
      showToast(`✓ Deleted ${count} teacher questions.`);
    }
  };

  const handleExportExcel = () => {
    try {
      const blob = exportQuestionsToExcel(filterState);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Skillizee_Math_Questions_Export_${Date.now()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('✓ Questions exported to Excel successfully!');
    } catch (err: any) {
      alert('Export failed: ' + err.message);
    }
  };

  const handleDownloadTemplate = () => {
    try {
      const blob = generateExcelTemplateBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Grade6_Math_Arcade_Questions_Template.xlsx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert('Template download failed: ' + err.message);
    }
  };

  const toggleTeacherSelect = (id: string) => {
    setSelectedTeacherIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAllTeacherVisible = () => {
    const visibleTeacherIds = filteredQuestions
      .filter((q) => q.source === 'teacher')
      .map((q) => q.id);
    setSelectedTeacherIds(visibleTeacherIds);
  };

  const clearSelection = () => {
    setSelectedTeacherIds([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-6xl h-[94vh] bg-slate-50 rounded-3xl shadow-2xl border-2 border-slate-800 overflow-hidden flex flex-col font-sans">
        {/* Top Header Bar */}
        <div className="flex flex-wrap items-center justify-between px-6 py-4 bg-slate-950 text-white border-b-2 border-slate-800 gap-4 flex-shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-xl font-black text-white shadow-lg border border-blue-400/30">
              📚
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-lg sm:text-xl font-black tracking-tight text-white uppercase">
                  Central Question Manager
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  Grade 6 Arcade
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Create, import from Excel, and prioritize teacher questions across all 13 math activities
              </p>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => {
                setEditingQuestion(null);
                setIsFormOpen(true);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-xl transition-all shadow-md hover:shadow-blue-500/30 flex items-center gap-1.5"
            >
              <span>➕</span> Add Question
            </button>

            <button
              onClick={() => setIsExcelImportOpen(true)}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl transition-all shadow-md hover:shadow-emerald-500/30 flex items-center gap-1.5"
            >
              <span>📥</span> Import Excel
            </button>

            <button
              onClick={handleExportExcel}
              title="Export filtered questions to .xlsx"
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-colors hidden md:flex items-center gap-1.5 border border-slate-700"
            >
              <span>📤</span> Export
            </button>

            <button
              onClick={handleDownloadTemplate}
              title="Download empty Excel template"
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-colors hidden sm:flex items-center gap-1.5 border border-slate-700"
            >
              <span>📄</span> Template
            </button>

            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition-colors border border-slate-700 font-black text-sm"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Toast Notification Banner */}
        {toastMessage && (
          <div className="px-6 py-2.5 bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-between border-b border-emerald-600 shadow-md animate-slideDown flex-shrink-0">
            <div className="flex items-center gap-2">
              <span>🎉</span>
              <span>{toastMessage}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-slate-900 font-bold hover:text-black"
            >
              ✕
            </button>
          </div>
        )}

        {/* Top Summary Banner: MY QUESTIONS vs OTHER QUESTIONS */}
        <div className="bg-white border-b-2 border-slate-200 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 flex-shrink-0">
          {/* Two primary source badges */}
          <div className="flex items-center gap-3 sm:gap-6">
            <button
              onClick={() => setFilterState((prev) => ({ ...prev, source: 'teacher' }))}
              className={`flex items-center gap-3 p-2.5 sm:px-4 sm:py-2.5 rounded-2xl border-2 transition-all ${
                filterState.source === 'teacher'
                  ? 'bg-amber-50/90 border-amber-500 shadow-md ring-2 ring-amber-400/30'
                  : 'bg-slate-50 border-slate-200 hover:border-amber-400'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-base shadow-sm">
                ⭐
              </div>
              <div className="text-left">
                <div className="text-[11px] font-black text-amber-900 uppercase tracking-wider">
                  MY / TEACHER QUESTIONS
                </div>
                <div className="text-sm sm:text-base font-black text-slate-900">
                  {teacherCount} <span className="text-xs font-bold text-slate-500">Created by you</span>
                </div>
              </div>
            </button>

            <button
              onClick={() => setFilterState((prev) => ({ ...prev, source: 'built-in' }))}
              className={`flex items-center gap-3 p-2.5 sm:px-4 sm:py-2.5 rounded-2xl border-2 transition-all ${
                filterState.source === 'built-in'
                  ? 'bg-blue-50/90 border-blue-500 shadow-md ring-2 ring-blue-400/30'
                  : 'bg-slate-50 border-slate-200 hover:border-blue-400'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-base shadow-sm">
                🕹️
              </div>
              <div className="text-left">
                <div className="text-[11px] font-black text-blue-900 uppercase tracking-wider">
                  OTHER QUESTIONS
                </div>
                <div className="text-sm sm:text-base font-black text-slate-900">
                  {builtInCount} <span className="text-xs font-bold text-slate-500">Built-in Arcade</span>
                </div>
              </div>
            </button>

            {filterState.source !== 'all' && (
              <button
                onClick={() => setFilterState((prev) => ({ ...prev, source: 'all' }))}
                className="text-xs font-black text-blue-600 hover:text-blue-800 underline uppercase"
              >
                View All ({allQuestions.length})
              </button>
            )}
          </div>

          {/* Quick Info & Priority Note */}
          <div className="hidden lg:flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
            <span className="text-amber-500 font-black">⭐ Teacher Priority:</span>
            <span>Your questions are always automatically prioritized in game setups</span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-slate-100 border-b border-slate-300 px-6 py-3 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
          <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
            {/* Search Box */}
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <span className="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
              <input
                type="text"
                value={filterState.searchQuery}
                onChange={(e) =>
                  setFilterState((prev) => ({ ...prev, searchQuery: e.target.value }))
                }
                placeholder="Search questions, options, tags..."
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 shadow-xs"
              />
              {filterState.searchQuery && (
                <button
                  onClick={() => setFilterState((prev) => ({ ...prev, searchQuery: '' }))}
                  className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-slate-700"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Activity Filter */}
            <select
              value={filterState.activityId}
              onChange={(e) =>
                setFilterState((prev) => ({ ...prev, activityId: e.target.value }))
              }
              className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 shadow-xs cursor-pointer"
            >
              <option value="all">All 13 Activities</option>
              {ACTIVITIES_REGISTRY.map((act) => (
                <option key={act.id} value={act.id}>
                  Cab {act.number} • {act.name}
                </option>
              ))}
            </select>

            {/* Difficulty Filter */}
            <select
              value={filterState.difficulty}
              onChange={(e) =>
                setFilterState((prev) => ({
                  ...prev,
                  difficulty: e.target.value as any,
                }))
              }
              className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 shadow-xs cursor-pointer"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {/* Bulk Action Controls */}
          {selectedTeacherIds.length > 0 ? (
            <div className="flex items-center gap-2 animate-fadeIn">
              <span className="text-xs font-black text-slate-700 bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-lg">
                {selectedTeacherIds.length} Selected
              </span>
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl transition-colors flex items-center gap-1 shadow-sm"
              >
                🗑️ Delete Selected
              </button>
              <button
                onClick={clearSelection}
                className="px-2.5 py-1.5 bg-white hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 transition-colors"
              >
                Clear
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">
                Showing {filteredQuestions.length} of {allQuestions.length} questions
              </span>
              {filteredQuestions.some((q) => q.source === 'teacher') && (
                <button
                  onClick={selectAllTeacherVisible}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 underline"
                >
                  Select All Visible Teacher Questions
                </button>
              )}
            </div>
          )}
        </div>

        {/* Question Cards Grid */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-100/60">
          {filteredQuestions.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-white border-2 border-slate-200 shadow-sm flex items-center justify-center text-3xl mb-3">
                🔍
              </div>
              <h3 className="text-base font-black text-slate-800 uppercase tracking-wide">
                No Questions Found
              </h3>
              <p className="text-xs text-slate-500 max-w-md mt-1 mb-4">
                No questions match your current filters. Try changing your search query or create a new question for this activity!
              </p>
              <button
                onClick={() => {
                  setEditingQuestion(null);
                  setIsFormOpen(true);
                }}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl transition-all shadow-md"
              >
                ➕ Add Question Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredQuestions.map((q) => {
                const isTeacher = q.source === 'teacher';
                const isSelected = selectedTeacherIds.includes(q.id);
                const activity = getActivityById(q.activityId);

                return (
                  <div
                    key={q.id}
                    className={`bg-white rounded-2xl border-2 p-5 transition-all shadow-xs hover:shadow-md flex flex-col justify-between ${
                      isSelected
                        ? 'border-blue-600 ring-2 ring-blue-400/20 bg-blue-50/20'
                        : isTeacher
                        ? 'border-amber-300 hover:border-amber-400'
                        : 'border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <div>
                      {/* Card Top Header */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {isTeacher && (
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleTeacherSelect(q.id)}
                              className="w-4 h-4 rounded text-blue-600 accent-blue-600 cursor-pointer mr-1"
                              title="Select for bulk delete"
                            />
                          )}
                          <span
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                              isTeacher
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-slate-100 text-slate-700 border border-slate-300'
                            }`}
                          >
                            {isTeacher ? '⭐ My Question' : '🕹️ Built-in'}
                          </span>
                          <span
                            className="px-2 py-0.5 rounded-lg text-[10px] font-black"
                            style={{
                              backgroundColor: activity?.badgeBg || '#f1f5f9',
                              color: activity?.badgeText || '#334155',
                            }}
                          >
                            {activity ? `Cab ${activity.number} • ${activity.name}` : q.activityName}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${
                              q.difficulty === 'easy'
                                ? 'text-emerald-700 bg-emerald-50'
                                : q.difficulty === 'medium'
                                ? 'text-amber-700 bg-amber-50'
                                : 'text-rose-700 bg-rose-50'
                            }`}
                          >
                            {q.difficulty}
                          </span>
                        </div>

                        {/* Direct Play Activity Setup Button */}
                        {onStartActivitySetup && (
                          <button
                            onClick={() => {
                              onClose();
                              onStartActivitySetup(q.activityId);
                            }}
                            title={`Start setup for ${q.activityName}`}
                            className="text-[11px] font-black text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-lg border border-blue-200 transition-colors whitespace-nowrap"
                          >
                            ▶ Launch Game
                          </button>
                        )}
                      </div>

                      {/* Question Text */}
                      <p className="text-sm font-bold text-slate-900 mb-3 line-clamp-3 leading-snug">
                        {q.question}
                      </p>

                      {/* 4 Options Grid */}
                      <div className="grid grid-cols-2 gap-1.5 mb-3">
                        {(['A', 'B', 'C', 'D'] as const).map((key, optIdx) => {
                          const isCorrect = q.correctAnswer === key;
                          return (
                            <div
                              key={key}
                              className={`px-2 py-1 rounded-lg text-xs flex items-center gap-1.5 border truncate ${
                                isCorrect
                                  ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-black'
                                  : 'bg-slate-50 border-slate-200 text-slate-600 font-medium'
                              }`}
                            >
                              <span
                                className={`w-4 h-4 rounded text-[10px] flex items-center justify-center font-bold ${
                                  isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                                }`}
                              >
                                {key}
                              </span>
                              <span className="truncate">{q.options[optIdx]}</span>
                              {isCorrect && <span className="text-[10px] text-emerald-700">✓</span>}
                            </div>
                          );
                        })}
                      </div>

                      {/* Tags */}
                      {q.tags && q.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {q.tags.map((t, tIdx) => (
                            <span
                              key={tIdx}
                              className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Card Actions Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-2">
                      <button
                        onClick={() => setPreviewQuestion(q)}
                        className="text-xs font-bold text-slate-600 hover:text-blue-600 flex items-center gap-1 transition-colors"
                      >
                        👁️ Preview
                      </button>

                      <div className="flex items-center gap-1.5">
                        {isTeacher ? (
                          <>
                            <button
                              onClick={() => handleEdit(q)}
                              className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-lg border border-blue-200 transition-colors"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => handleDuplicate(q)}
                              title="Duplicate question"
                              className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-lg border border-slate-200 transition-colors"
                            >
                              📋 Copy
                            </button>
                            <button
                              onClick={() => handleDelete(q)}
                              className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-lg border border-rose-200 transition-colors"
                            >
                              🗑️
                            </button>
                          </>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                            🔒 Built-in Question
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modals */}
        <QuestionFormModal
          isOpen={isFormOpen}
          initialQuestion={editingQuestion}
          defaultActivityId={filterState.activityId !== 'all' ? filterState.activityId : undefined}
          onClose={() => {
            setIsFormOpen(false);
            setEditingQuestion(null);
          }}
          onSaved={(_, msg) => {
            reloadQuestions();
            showToast(msg);
          }}
        />

        <ExcelImportModal
          isOpen={isExcelImportOpen}
          onClose={() => setIsExcelImportOpen(false)}
          onImportComplete={(msg) => {
            reloadQuestions();
            showToast(msg);
          }}
        />

        <QuestionPreviewModal
          question={previewQuestion}
          onClose={() => setPreviewQuestion(null)}
          onEdit={(q) => handleEdit(q)}
          onDuplicate={(q) => handleDuplicate(q)}
          onDelete={(q) => handleDelete(q)}
        />
      </div>
    </div>
  );
};
