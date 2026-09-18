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
import {
  ACTIVITIES_REGISTRY,
  getActivityById,
  getAllMathTopics,
} from '@/services/activityRegistry';
import { QuestionFormModal } from './QuestionFormModal';
import { ExcelImportModal } from './ExcelImportModal';
import { QuestionPreviewModal } from './QuestionPreviewModal';
import { Gamepad2, BookOpen, Layers, LayoutGrid, Sparkles, Filter, Trash2, Edit3, Eye, Copy } from 'lucide-react';

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
    topicId: 'all',
    source: 'all',
    difficulty: 'all',
    searchQuery: '',
    tag: '',
    groupByActivity: true,
  });

  // Selected for Bulk Delete
  const [selectedTeacherIds, setSelectedTeacherIds] = useState<string[]>([]);

  // Sub-Modals
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingQuestion, setEditingQuestion] = useState<UniversalQuestion | null>(null);
  const [formDefaultActivityId, setFormDefaultActivityId] = useState<string | undefined>(defaultActivityId);
  const [isExcelImportOpen, setIsExcelImportOpen] = useState<boolean>(false);
  const [previewQuestion, setPreviewQuestion] = useState<UniversalQuestion | null>(null);

  // Toast / Status banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const mathTopicsList = useMemo(() => getAllMathTopics(), []);

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
        setFormDefaultActivityId(defaultActivityId);
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
      // Topic filter
      if (filterState.topicId !== 'all' && q.topicId !== filterState.topicId) {
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
        const inTopic = q.topicName.toLowerCase().includes(query);
        const inTags = q.tags.some((t) => t.toLowerCase().includes(query));
        if (!inQuestion && !inOptions && !inActivity && !inTopic && !inTags) {
          return false;
        }
      }
      return true;
    });
  }, [allQuestions, filterState]);

  // Grouping by Activity
  const groupedQuestions = useMemo(() => {
    const groups: {
      activity: typeof ACTIVITIES_REGISTRY[0];
      questions: UniversalQuestion[];
      teacherCount: number;
      builtInCount: number;
    }[] = [];

    for (const act of ACTIVITIES_REGISTRY) {
      const qList = filteredQuestions.filter((q) => q.activityId === act.id);
      if (qList.length > 0 || (filterState.activityId === act.id)) {
        groups.push({
          activity: act,
          questions: qList,
          teacherCount: qList.filter((q) => q.source === 'teacher').length,
          builtInCount: qList.filter((q) => q.source === 'built-in').length,
        });
      }
    }
    return groups;
  }, [filteredQuestions, filterState.activityId]);

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
  const handleOpenAddForm = (actId?: string) => {
    setEditingQuestion(null);
    setFormDefaultActivityId(actId || (filterState.activityId !== 'all' ? filterState.activityId : ACTIVITIES_REGISTRY[0].id));
    setIsFormOpen(true);
  };

  const handleEdit = (q: UniversalQuestion) => {
    setEditingQuestion(q);
    setFormDefaultActivityId(q.activityId);
    setIsFormOpen(true);
  };

  const handleDuplicate = (q: UniversalQuestion) => {
    try {
      duplicateTeacherQuestion(q.id);
      reloadQuestions();
      showToast(`✓ Question duplicated for ${q.activityName} (${q.topicName})`);
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

  const renderQuestionCard = (q: UniversalQuestion) => {
    const isTeacher = q.source === 'teacher';
    const isSelected = selectedTeacherIds.includes(q.id);
    const activity = getActivityById(q.activityId);

    return (
      <div
        key={q.id}
        className={`bg-white rounded-2xl border-2 p-4 sm:p-5 transition-all shadow-xs hover:shadow-md flex flex-col justify-between ${
          isSelected
            ? 'border-blue-600 ring-2 ring-blue-400/20 bg-blue-50/20'
            : isTeacher
            ? 'border-amber-300 hover:border-amber-400'
            : 'border-slate-200 hover:border-blue-300'
        }`}
      >
        <div>
          {/* Card Top: Activity Name + Mathematics Topic Badges */}
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

              {/* Game Badge */}
              <span className="px-2 py-0.5 rounded-lg text-[10px] font-black bg-slate-900 text-amber-300">
                🎮 {activity ? `Cab #${activity.number} • ${activity.name}` : q.activityName}
              </span>

              {/* Explicit Topic Badge */}
              <span
                className="px-2 py-0.5 rounded-lg text-[10px] font-black border"
                style={{
                  backgroundColor: activity?.badgeBg || '#e0f2fe',
                  color: activity?.badgeText || '#0369a1',
                  borderColor: (activity?.badgeText || '#0369a1') + '30',
                }}
              >
                📐 {q.topicName || activity?.topic}
              </span>

              {/* Difficulty */}
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
                title={`Launch Question Setup for ${q.activityName}`}
                className="text-[11px] font-black text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-lg border border-blue-200 transition-colors whitespace-nowrap"
              >
                ▶ Play Duel
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
            <div className="flex flex-wrap gap-1 mb-2">
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
            <Eye className="w-3.5 h-3.5" /> Preview
          </button>

          <div className="flex items-center gap-1.5">
            {isTeacher ? (
              <>
                <button
                  onClick={() => handleEdit(q)}
                  className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-lg border border-blue-200 transition-colors flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" /> Edit
                </button>
                <button
                  onClick={() => handleDuplicate(q)}
                  title="Duplicate question"
                  className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-lg border border-slate-200 transition-colors flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" /> Copy
                </button>
                <button
                  onClick={() => handleDelete(q)}
                  className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-lg border border-rose-200 transition-colors"
                  title="Delete question"
                >
                  <Trash2 className="w-3.5 h-3.5" />
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
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-6xl h-[94vh] bg-slate-50 rounded-3xl shadow-2xl border-3 border-slate-900 overflow-hidden flex flex-col font-sans">
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
                  Grade 6 Mathematics
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Assign and manage questions strictly bound to specific arcade activities and math topics
              </p>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <button
              onClick={() => handleOpenAddForm()}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-xl transition-all shadow-md hover:shadow-blue-500/30 flex items-center gap-1.5"
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
              onClick={handleDownloadTemplate}
              title="Download professional 4-sheet Excel template (.xlsx)"
              className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 border border-slate-900"
            >
              <span>📄</span> Download Excel Template
            </button>

            <button
              onClick={handleExportExcel}
              title="Export filtered questions to .xlsx"
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-colors hidden lg:flex items-center gap-1.5 border border-slate-700"
            >
              <span>📤</span> Export
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

          {/* Grouping Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setFilterState((prev) => ({ ...prev, groupByActivity: !prev.groupByActivity }))
              }
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 border-2 ${
                filterState.groupByActivity
                  ? 'bg-slate-950 text-amber-300 border-slate-950 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-300 hover:border-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{filterState.groupByActivity ? 'Grouped by Activity & Topic' : 'Flat Grid View'}</span>
            </button>
          </div>
        </div>

        {/* Filter Bar with Activity & Topic Selectors */}
        <div className="bg-slate-100 border-b border-slate-300 px-6 py-3 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
          <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
            {/* Search Box */}
            <div className="relative flex-1 min-w-[180px] max-w-xs">
              <span className="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
              <input
                type="text"
                value={filterState.searchQuery}
                onChange={(e) =>
                  setFilterState((prev) => ({ ...prev, searchQuery: e.target.value }))
                }
                placeholder="Search question, game, topic..."
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

            {/* 1. Activity Filter (With Topic underneath in dropdown) */}
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
                  Cab {act.number} • {act.name} ({act.topic})
                </option>
              ))}
            </select>

            {/* 2. Separate Topic Filter */}
            <select
              value={filterState.topicId}
              onChange={(e) =>
                setFilterState((prev) => ({ ...prev, topicId: e.target.value }))
              }
              className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 shadow-xs cursor-pointer"
            >
              <option value="all">All Math Topics</option>
              {mathTopicsList.map((t) => (
                <option key={t.topicId} value={t.topicId}>
                  📐 {t.topicName} ({t.activityName})
                </option>
              ))}
            </select>

            {/* 3. Difficulty Filter */}
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
          {selectedTeacherIds.length > 0 && (
            <div className="flex items-center gap-2 animate-fadeIn">
              <span className="text-xs font-black text-slate-700 bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-lg">
                {selectedTeacherIds.length} Selected
              </span>
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl transition-colors flex items-center gap-1 shadow-sm"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Selected
              </button>
              <button
                onClick={() => setSelectedTeacherIds([])}
                className="px-2.5 py-1.5 bg-white hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 transition-colors"
              >
                Clear
              </button>
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
              <p className="text-xs text-slate-500 max-w-md mt-1 mb-5">
                No questions match your current activity/topic filters. Add questions manually or bulk-import via Excel!
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                <button
                  onClick={() => handleOpenAddForm()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                >
                  <span>➕</span> Add Question
                </button>
                <button
                  onClick={() => setIsExcelImportOpen(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                >
                  <span>📥</span> Import Excel
                </button>
                <button
                  onClick={handleDownloadTemplate}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5 border border-slate-900"
                >
                  <span>📄</span> Download Template
                </button>
              </div>
            </div>
          ) : filterState.groupByActivity ? (
            /* ── GROUPED VIEW BY ACTIVITY & TOPIC ── */
            <div className="space-y-8">
              {groupedQuestions.map((group) => {
                const act = group.activity;
                return (
                  <div key={act.id} className="space-y-3">
                    {/* Group Header */}
                    <div className="bg-white border-2 border-slate-900 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-sm">
                      <div className="flex items-center gap-3">
                        <span className="w-9 h-9 rounded-xl bg-slate-950 text-amber-300 flex items-center justify-center text-xs font-black shadow-inner">
                          #{act.number}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-black text-slate-950 uppercase tracking-tight">
                              {act.name}
                            </h3>
                            <span
                              className="text-[11px] font-black px-2.5 py-0.5 rounded-md border"
                              style={{
                                backgroundColor: act.badgeBg,
                                color: act.badgeText,
                                borderColor: act.badgeText + '30',
                              }}
                            >
                              Topic: {act.topic}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 font-bold mt-0.5">
                            {group.teacherCount} Teacher Questions • {group.builtInCount} Built-in Arcade Questions
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenAddForm(act.id)}
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-300 text-xs font-black rounded-xl transition-colors flex items-center gap-1"
                        >
                          ➕ Add to {act.shortTopic}
                        </button>

                        {onStartActivitySetup && (
                          <button
                            onClick={() => {
                              onClose();
                              onStartActivitySetup(act.id);
                            }}
                            className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl transition-all shadow-xs border border-slate-900 flex items-center gap-1"
                          >
                            ▶ Launch Match
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Questions in this Activity */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {group.questions.map(renderQuestionCard)}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* ── FLAT GRID VIEW ── */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredQuestions.map(renderQuestionCard)}
            </div>
          )}
        </div>

        {/* Modals */}
        <QuestionFormModal
          isOpen={isFormOpen}
          initialQuestion={editingQuestion}
          defaultActivityId={formDefaultActivityId}
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
          onImportComplete={(msg, _ids, primaryActId) => {
            reloadQuestions();
            if (primaryActId) {
              setFilterState((prev) => ({
                ...prev,
                activityId: primaryActId,
                source: 'teacher',
              }));
            } else {
              setFilterState((prev) => ({
                ...prev,
                source: 'teacher',
              }));
            }
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
