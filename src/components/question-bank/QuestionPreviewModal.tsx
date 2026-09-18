import React from 'react';
import { UniversalQuestion } from '@/types/questionBank';
import { getActivityById } from '@/services/activityRegistry';

interface QuestionPreviewModalProps {
  question: UniversalQuestion | null;
  onClose: () => void;
  onEdit?: (question: UniversalQuestion) => void;
  onDuplicate?: (question: UniversalQuestion) => void;
  onDelete?: (question: UniversalQuestion) => void;
}

export const QuestionPreviewModal: React.FC<QuestionPreviewModalProps> = ({
  question,
  onClose,
  onEdit,
  onDuplicate,
  onDelete,
}) => {
  if (!question) return null;

  const activity = getActivityById(question.activityId);
  const isTeacher = question.source === 'teacher';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border-2 border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b-2 border-slate-800">
          <div className="flex items-center gap-3">
            <span
              className={`px-2.5 py-1 text-xs font-black uppercase tracking-wider rounded-lg ${
                isTeacher ? 'bg-amber-400 text-slate-950' : 'bg-blue-500 text-white'
              }`}
            >
              {isTeacher ? '⭐ My Question (Teacher)' : '🕹️ Other Question (Built-in)'}
            </span>
            <span className="text-xs text-slate-300 font-bold">
              {activity ? `${activity.number} • ${activity.name}` : question.activityName}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Metadata badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                question.difficulty === 'easy'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : question.difficulty === 'medium'
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-rose-100 text-rose-800 border border-rose-300'
              }`}
            >
              Level: {question.difficulty}
            </span>
            {question.tags && question.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Question Text */}
          <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-5">
            <div className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
              Question Prompt
            </div>
            <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
              {question.question}
            </p>
          </div>

          {/* 4 Options */}
          <div>
            <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-3">
              Answer Options
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(['A', 'B', 'C', 'D'] as const).map((key, idx) => {
                const isCorrect = question.correctAnswer === key;
                return (
                  <div
                    key={key}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border-2 transition-all ${
                      isCorrect
                        ? 'bg-emerald-50 border-emerald-500 shadow-sm'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <span
                      className={`w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-lg font-black text-xs ${
                        isCorrect
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {key}
                    </span>
                    <div className="flex-1">
                      <span
                        className={`text-sm font-bold ${
                          isCorrect ? 'text-emerald-950' : 'text-slate-800'
                        }`}
                      >
                        {question.options[idx]}
                      </span>
                      {isCorrect && (
                        <span className="block text-[11px] font-black text-emerald-700 mt-0.5">
                          ✓ Correct Answer
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Explanation */}
          {question.explanation && (
            <div className="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-4">
              <div className="text-xs font-black text-indigo-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <span>💡</span> Learning Feedback / Explanation
              </div>
              <p className="text-sm font-medium text-indigo-950 leading-relaxed">
                {question.explanation}
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-100 border-t-2 border-slate-200">
          <div className="flex items-center gap-2">
            {isTeacher && onEdit && (
              <button
                onClick={() => {
                  onClose();
                  onEdit(question);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
              >
                ✏️ Edit
              </button>
            )}
            {isTeacher && onDuplicate && (
              <button
                onClick={() => {
                  onClose();
                  onDuplicate(question);
                }}
                className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-black rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
              >
                📋 Duplicate
              </button>
            )}
            {isTeacher && onDelete && (
              <button
                onClick={() => {
                  onClose();
                  onDelete(question);
                }}
                className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 text-xs font-black rounded-lg transition-colors flex items-center gap-1.5"
              >
                🗑️ Delete
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
