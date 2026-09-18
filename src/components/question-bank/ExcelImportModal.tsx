import React, { useState, useRef, useMemo } from 'react';
import { ExcelValidationResult, ExcelParsedRow, UniversalQuestion } from '@/types/questionBank';
import {
  parseAndValidateExcel,
  commitExcelImport,
  generateExcelTemplateBlob,
  generateErrorReportBlob,
} from '@/services/questionBankService';
import { ACTIVITIES_REGISTRY, getActivityById, validateActivityTopicPair } from '@/services/activityRegistry';
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Copy,
  Download,
  Sparkles,
  Info,
  Layers,
  Check,
  RefreshCw,
} from 'lucide-react';

interface ExcelImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: (message: string, importedIds?: string[], primaryActivityId?: string) => void;
}

type TabFilter = 'all' | 'ready' | 'needs-fix' | 'duplicates';

export const ExcelImportModal: React.FC<ExcelImportModalProps> = ({
  isOpen,
  onClose,
  onImportComplete,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [validationResult, setValidationResult] = useState<ExcelValidationResult | null>(null);
  const [duplicateAction, setDuplicateAction] = useState<'skip' | 'import-anyway' | 'replace'>('skip');
  const [activeTab, setActiveTab] = useState<TabFilter>('all');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleDownloadTemplate = () => {
    try {
      const blob = generateExcelTemplateBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Skillizee_Grade6_Math_Questions_Template.xlsx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setErrorMessage('Failed to generate template: ' + err.message);
    }
  };

  const handleDownloadErrorReport = () => {
    if (!validationResult || validationResult.invalidRows.length === 0) return;
    try {
      const blob = generateErrorReportBlob(validationResult.invalidRows);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Import_Errors_Report_${Date.now()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setErrorMessage('Failed to generate error report: ' + err.message);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const processFile = async (file: File) => {
    setSelectedFile(file);
    setIsParsing(true);
    setErrorMessage(null);
    setValidationResult(null);

    try {
      const result = await parseAndValidateExcel(file);
      setValidationResult(result);
      if (result.invalidCount > 0) {
        setActiveTab('needs-fix');
      } else {
        setActiveTab('all');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to read spreadsheet.');
    } finally {
      setIsParsing(false);
    }
  };

  // Inline Fix: Fix Topic Mismatch
  const handleFixTopicInline = (rowNumber: number) => {
    if (!validationResult) return;

    const updatedRows = validationResult.rows.map((row) => {
      if (row.rowNumber !== rowNumber || !row.matchedActivity) return row;

      const act = row.matchedActivity;
      const fixedTopic = act.topic;

      // Re-validate row
      const newErrors = row.errors.filter((e) => !e.toLowerCase().includes('mismatch'));
      const isNowReady = newErrors.length === 0;

      const updatedQuestion: UniversalQuestion | undefined = isNowReady
        ? {
            id: row.validatedQuestion?.id || `tq-import-${Date.now()}-${rowNumber}-${Math.random().toString(36).substring(2, 6)}`,
            source: 'teacher',
            activityId: act.id,
            activityName: act.name,
            topicId: act.topicId,
            topicName: act.topic,
            question: row.rawQuestion,
            options: [row.rawOptionA, row.rawOptionB, row.rawOptionC, row.rawOptionD],
            correctAnswer: (row.rawCorrectAnswer.toUpperCase().trim() as any) || 'A',
            explanation: row.rawExplanation || undefined,
            difficulty: (row.rawDifficulty?.toLowerCase() as any) || 'easy',
            tags: row.rawTags ? row.rawTags.split(/[,;|]/).map((t) => t.trim()).filter(Boolean) : [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
          }
        : undefined;

      return {
        ...row,
        rawTopic: fixedTopic,
        status: isNowReady ? ('ready' as const) : ('invalid' as const),
        errors: newErrors,
        warning: undefined,
        expectedTopic: undefined,
        validatedQuestion: updatedQuestion,
      };
    });

    const validRows = updatedRows.filter((r) => r.status === 'ready');
    const invalidRows = updatedRows.filter((r) => r.status === 'invalid' || r.status === 'mismatch');
    const duplicateRows = updatedRows.filter((r) => r.status === 'duplicate');
    const validQuestions = updatedRows
      .map((r) => r.validatedQuestion)
      .filter(Boolean) as UniversalQuestion[];

    setValidationResult({
      ...validationResult,
      rows: updatedRows,
      validCount: validRows.length,
      invalidCount: invalidRows.length,
      mismatchCount: updatedRows.filter((r) => r.status === 'mismatch').length,
      validQuestions,
      invalidRows,
      duplicateRows,
    });
  };

  // Inline Fix: Select Activity from Dropdown
  const handleAssignActivityInline = (rowNumber: number, activityId: string) => {
    if (!validationResult) return;
    const act = getActivityById(activityId);
    if (!act) return;

    const updatedRows = validationResult.rows.map((row) => {
      if (row.rowNumber !== rowNumber) return row;

      const newErrors = row.errors.filter(
        (e) => !e.toLowerCase().includes('activity') && !e.toLowerCase().includes('mismatch')
      );
      const isNowReady = newErrors.length === 0;

      const updatedQuestion: UniversalQuestion | undefined = isNowReady
        ? {
            id: row.validatedQuestion?.id || `tq-import-${Date.now()}-${rowNumber}-${Math.random().toString(36).substring(2, 6)}`,
            source: 'teacher',
            activityId: act.id,
            activityName: act.name,
            topicId: act.topicId,
            topicName: act.topic,
            question: row.rawQuestion,
            options: [row.rawOptionA, row.rawOptionB, row.rawOptionC, row.rawOptionD],
            correctAnswer: (row.rawCorrectAnswer.toUpperCase().trim() as any) || 'A',
            explanation: row.rawExplanation || undefined,
            difficulty: (row.rawDifficulty?.toLowerCase() as any) || 'easy',
            tags: row.rawTags ? row.rawTags.split(/[,;|]/).map((t) => t.trim()).filter(Boolean) : [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
          }
        : undefined;

      return {
        ...row,
        rawActivity: act.name,
        rawTopic: act.topic,
        matchedActivity: act,
        expectedTopic: undefined,
        status: isNowReady ? ('ready' as const) : ('invalid' as const),
        errors: newErrors,
        warning: undefined,
        validatedQuestion: updatedQuestion,
      };
    });

    const validRows = updatedRows.filter((r) => r.status === 'ready');
    const invalidRows = updatedRows.filter((r) => r.status === 'invalid' || r.status === 'mismatch');
    const duplicateRows = updatedRows.filter((r) => r.status === 'duplicate');
    const validQuestions = updatedRows
      .map((r) => r.validatedQuestion)
      .filter(Boolean) as UniversalQuestion[];

    setValidationResult({
      ...validationResult,
      rows: updatedRows,
      validCount: validRows.length,
      invalidCount: invalidRows.length,
      mismatchCount: updatedRows.filter((r) => r.status === 'mismatch').length,
      validQuestions,
      invalidRows,
      duplicateRows,
    });
  };

  const handleExecuteImport = () => {
    if (!validationResult || validationResult.validQuestions.length === 0) return;

    setIsImporting(true);
    try {
      const { importedCount, replacedCount, skippedCount } = commitExcelImport(
        validationResult.validQuestions,
        duplicateAction
      );

      let msg = `✓ Successfully imported ${importedCount} teacher questions!`;
      if (replacedCount > 0) msg += ` (${replacedCount} existing updated)`;
      if (skippedCount > 0) msg += ` (${skippedCount} duplicates skipped)`;

      const importedIds = validationResult.validQuestions.map((q) => q.id);
      const primaryActId = validationResult.validQuestions[0]?.activityId;

      onImportComplete(msg, importedIds, primaryActId);
      handleReset();
      onClose();
    } catch (err: any) {
      setErrorMessage('Import failed: ' + err.message);
    } finally {
      setIsImporting(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setValidationResult(null);
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const displayedRows = useMemo(() => {
    if (!validationResult) return [];
    if (activeTab === 'ready') return validationResult.rows.filter((r) => r.status === 'ready');
    if (activeTab === 'needs-fix') return validationResult.rows.filter((r) => r.status === 'invalid' || r.status === 'mismatch');
    if (activeTab === 'duplicates') return validationResult.rows.filter((r) => r.status === 'duplicate');
    return validationResult.rows;
  }, [validationResult, activeTab]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl h-[92vh] bg-slate-50 rounded-3xl shadow-2xl border-3 border-slate-900 overflow-hidden flex flex-col font-sans">
        
        {/* ── TOP HEADER ── */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 text-white border-b-2 border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-3.5">
            <span className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-xl font-black text-white shadow-lg border border-emerald-400/30">
              📊
            </span>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white uppercase">
                  Excel Question Importer
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Universal Multi-Activity Parser
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Upload, validate, inspect, and import Grade 6 math questions directly to their assigned arcade activities
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadTemplate}
              title="Download standard 4-sheet Excel template"
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors border border-slate-700 hidden sm:flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Template
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition-colors border border-slate-700 font-black text-sm"
            >
              ✕
            </button>
          </div>
        </div>

        {/* ── CONTENT BODY ── */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {errorMessage && (
            <div className="p-4 bg-rose-50 border-2 border-rose-400 rounded-2xl text-xs font-black text-rose-800 flex items-center justify-between gap-2 shadow-xs">
              <div className="flex items-center gap-2">
                <span>⚠️</span>
                <span>{errorMessage}</span>
              </div>
              <button
                onClick={() => setErrorMessage(null)}
                className="text-rose-900 font-bold hover:underline"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* ── STEP 1: INITIAL UPLOAD DROPZONE ── */}
          {!validationResult && (
            <div className="space-y-5">
              {/* Template Download Hero Banner */}
              <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-amber-50 border-2 border-blue-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-black text-blue-950 uppercase tracking-wider">
                      Need the standard spreadsheet format?
                    </span>
                    <span className="bg-blue-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded">
                      4 Sheets Included
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    Download our multi-sheet template with step-by-step instructions, clean entry rows, reference examples, and activity dropdowns.
                  </p>
                </div>
                <button
                  onClick={handleDownloadTemplate}
                  type="button"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl transition-all shadow-md flex items-center gap-2 whitespace-nowrap"
                >
                  <Download className="w-4 h-4" /> Download .xlsx Template
                </button>
              </div>

              {/* Upload Dropzone */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-3 border-dashed border-slate-300 hover:border-emerald-500 bg-white hover:bg-emerald-50/40 rounded-3xl p-12 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-4 group shadow-sm"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 border-2 border-emerald-200 text-emerald-600 flex items-center justify-center text-3xl group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                  <Upload className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {isParsing ? 'Reading and Validating Spreadsheet...' : 'Choose or Drag & Drop Excel / CSV File'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 font-medium max-w-md">
                    Supports <strong>.xlsx</strong>, <strong>.xls</strong>, and <strong>.csv</strong> spreadsheets. Columns are recognized automatically by header names.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2: VALIDATION DASHBOARD & INTERACTIVE PREVIEW ── */}
          {validationResult && (
            <div className="space-y-5 animate-fadeIn">
              {/* Ignored Extra Columns Notification */}
              {validationResult.ignoredColumns.length > 0 && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs font-bold text-blue-900 flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>
                    <strong>{validationResult.ignoredColumns.length}</strong> additional column(s) ({validationResult.ignoredColumns.join(', ')}) were ignored safely without errors.
                  </span>
                </div>
              )}

              {/* Top Summary Metrics Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white border-2 border-slate-200 rounded-2xl p-3.5 shadow-xs flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-700 text-base">
                    📑
                  </div>
                  <div>
                    <div className="text-xl font-black text-slate-950">
                      {validationResult.totalDetected}
                    </div>
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                      Detected Rows
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-3.5 shadow-xs flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-base shadow-sm">
                    ✓
                  </div>
                  <div>
                    <div className="text-xl font-black text-emerald-950">
                      {validationResult.validCount}
                    </div>
                    <div className="text-[10px] font-black text-emerald-800 uppercase tracking-wider">
                      Ready to Import
                    </div>
                  </div>
                </div>

                <div
                  className={`rounded-2xl p-3.5 shadow-xs flex items-center gap-3 border-2 ${
                    validationResult.invalidCount > 0
                      ? 'bg-rose-50 border-rose-300'
                      : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-base ${
                      validationResult.invalidCount > 0
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    ✕
                  </div>
                  <div>
                    <div
                      className={`text-xl font-black ${
                        validationResult.invalidCount > 0 ? 'text-rose-950' : 'text-slate-500'
                      }`}
                    >
                      {validationResult.invalidCount}
                    </div>
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                      Flagged / Invalid
                    </div>
                  </div>
                </div>

                <div
                  className={`rounded-2xl p-3.5 shadow-xs flex items-center gap-3 border-2 ${
                    validationResult.duplicateCount > 0
                      ? 'bg-amber-50 border-amber-300'
                      : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-base ${
                      validationResult.duplicateCount > 0
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    ⚠
                  </div>
                  <div>
                    <div
                      className={`text-xl font-black ${
                        validationResult.duplicateCount > 0 ? 'text-amber-950' : 'text-slate-500'
                      }`}
                    >
                      {validationResult.duplicateCount}
                    </div>
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                      Duplicates
                    </div>
                  </div>
                </div>
              </div>

              {/* Duplicate Action Handling Section */}
              {validationResult.duplicateCount > 0 && (
                <div className="bg-amber-50/80 border-2 border-amber-300 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                  <div>
                    <div className="text-xs font-black text-amber-950 uppercase tracking-wider mb-0.5 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      Duplicate Resolution
                    </div>
                    <p className="text-xs text-slate-600 font-medium">
                      {validationResult.duplicateCount} question(s) already exist. How should they be handled?
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {[
                      { id: 'skip' as const, label: 'Skip Duplicates' },
                      { id: 'import-anyway' as const, label: 'Import as New' },
                      { id: 'replace' as const, label: 'Update Existing' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setDuplicateAction(opt.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all border-2 ${
                          duplicateAction === opt.id
                            ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-300 hover:border-amber-400'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Filter Tabs & Error Report Button */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setActiveTab('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                      activeTab === 'all'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    All Rows ({validationResult.totalDetected})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('ready')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                      activeTab === 'ready'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-emerald-700 hover:text-emerald-900'
                    }`}
                  >
                    Ready ({validationResult.validCount})
                  </button>
                  {validationResult.invalidCount > 0 && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('needs-fix')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                        activeTab === 'needs-fix'
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'text-rose-700 hover:text-rose-900'
                      }`}
                    >
                      Needs Fix ({validationResult.invalidCount})
                    </button>
                  )}
                  {validationResult.duplicateCount > 0 && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('duplicates')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                        activeTab === 'duplicates'
                          ? 'bg-amber-500 text-slate-950 shadow-xs'
                          : 'text-amber-800 hover:text-amber-950'
                      }`}
                    >
                      Duplicates ({validationResult.duplicateCount})
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {validationResult.invalidCount > 0 && (
                    <button
                      type="button"
                      onClick={handleDownloadErrorReport}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 text-xs font-black rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" /> Download Error Report (.xlsx)
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold rounded-xl transition-colors"
                  >
                    Upload Another File
                  </button>
                </div>
              </div>

              {/* Rows List / Table */}
              <div className="space-y-3 max-h-[46vh] overflow-y-auto pr-1">
                {displayedRows.map((row) => {
                  const isReady = row.status === 'ready';
                  const isMismatch = row.status === 'mismatch';
                  const isDuplicate = row.status === 'duplicate';
                  const isInvalid = row.status === 'invalid';

                  return (
                    <div
                      key={row.rowNumber}
                      className={`p-4 rounded-2xl border-2 transition-all flex flex-col gap-2.5 ${
                        isReady
                          ? 'bg-white border-slate-200 hover:border-emerald-300 shadow-xs'
                          : isMismatch
                          ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-400/20 shadow-xs'
                          : isDuplicate
                          ? 'bg-amber-50/40 border-amber-300 shadow-xs'
                          : 'bg-rose-50/70 border-rose-400 shadow-xs'
                      }`}
                    >
                      {/* Row Top Status Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-slate-900 text-amber-300 rounded font-black text-[10px]">
                            Row #{row.rowNumber}
                          </span>

                          {row.matchedActivity ? (
                            <span className="px-2 py-0.5 bg-slate-100 border border-slate-300 rounded text-[10px] font-black text-slate-800">
                              🎮 Cab #{row.matchedActivity.number} • {row.matchedActivity.name}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-rose-100 border border-rose-300 rounded text-[10px] font-black text-rose-800">
                              ❓ Activity: "{row.rawActivity || 'Missing'}"
                            </span>
                          )}

                          <span
                            className="px-2 py-0.5 rounded text-[10px] font-black border"
                            style={{
                              backgroundColor: row.matchedActivity?.badgeBg || '#e0f2fe',
                              color: row.matchedActivity?.badgeText || '#0369a1',
                              borderColor: (row.matchedActivity?.badgeText || '#0369a1') + '30',
                            }}
                          >
                            📐 {row.rawTopic || row.matchedActivity?.topic || 'Topic'}
                          </span>
                        </div>

                        {/* Status Badge */}
                        <div>
                          {isReady && (
                            <span className="px-2.5 py-0.5 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-lg text-[10px] font-black flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Ready to Import
                            </span>
                          )}
                          {isMismatch && (
                            <span className="px-2.5 py-0.5 bg-amber-100 border border-amber-400 text-amber-950 rounded-lg text-[10px] font-black flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 text-amber-600" /> Topic Mismatch
                            </span>
                          )}
                          {isDuplicate && (
                            <span className="px-2.5 py-0.5 bg-amber-100 border border-amber-300 text-amber-900 rounded-lg text-[10px] font-black flex items-center gap-1">
                              <Copy className="w-3 h-3 text-amber-600" /> Duplicate Question
                            </span>
                          )}
                          {isInvalid && (
                            <span className="px-2.5 py-0.5 bg-rose-100 border border-rose-400 text-rose-950 rounded-lg text-[10px] font-black flex items-center gap-1">
                              <XCircle className="w-3 h-3 text-rose-600" /> Missing / Invalid Fields
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Question Text */}
                      <p className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                        {row.rawQuestion || <span className="text-rose-600 italic">No question prompt provided</span>}
                      </p>

                      {/* Options & Correct Answer Preview */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        {[
                          { key: 'A', val: row.rawOptionA },
                          { key: 'B', val: row.rawOptionB },
                          { key: 'C', val: row.rawOptionC },
                          { key: 'D', val: row.rawOptionD },
                        ].map((opt) => {
                          const isCorrect = (row.rawCorrectAnswer || '').toUpperCase().trim() === opt.key;
                          return (
                            <div
                              key={opt.key}
                              className={`p-1.5 rounded-lg border flex items-center gap-1.5 truncate ${
                                isCorrect
                                  ? 'bg-emerald-100/90 border-emerald-400 text-emerald-950 font-black'
                                  : opt.val
                                  ? 'bg-slate-50 border-slate-200 text-slate-700'
                                  : 'bg-rose-50 border-rose-300 text-rose-700 italic'
                              }`}
                            >
                              <span className="w-4 h-4 rounded text-[10px] font-black flex items-center justify-center bg-white border border-slate-300 shrink-0">
                                {opt.key}
                              </span>
                              <span className="truncate">{opt.val || 'Missing'}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Error & Warning Callouts with 1-Click Fixes */}
                      {row.errors.length > 0 && (
                        <div className="p-2.5 bg-white/90 border border-rose-300 rounded-xl space-y-2">
                          <div className="text-[11px] font-black text-rose-800 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                            <span>{row.errors.join(' • ')}</span>
                          </div>

                          {/* Inline Fix: Topic Mismatch */}
                          {row.expectedTopic && (
                            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-rose-100">
                              <span className="text-[11px] text-slate-600 font-bold">
                                Expected topic for <strong>{row.matchedActivity?.name}</strong> is{' '}
                                <strong className="text-blue-700">{row.expectedTopic}</strong>.
                              </span>
                              <button
                                type="button"
                                onClick={() => handleFixTopicInline(row.rowNumber)}
                                className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-lg transition-all shadow-xs flex items-center gap-1"
                              >
                                <Sparkles className="w-3.5 h-3.5" /> Fix Topic to "{row.expectedTopic}"
                              </button>
                            </div>
                          )}

                          {/* Inline Fix: Unassigned Activity */}
                          {!row.matchedActivity && (
                            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-rose-100">
                              <span className="text-[11px] text-slate-600 font-bold">
                                Select matching arcade game:
                              </span>
                              <select
                                onChange={(e) => handleAssignActivityInline(row.rowNumber, e.target.value)}
                                defaultValue=""
                                className="px-3 py-1 bg-white border border-blue-400 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="" disabled>
                                  Choose one of 13 arcade games...
                                </option>
                                {ACTIVITIES_REGISTRY.map((act) => (
                                  <option key={act.id} value={act.id}>
                                    Cab #{act.number} • {act.name} ({act.topic})
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ── FOOTER ACTIONS ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-slate-100 border-t-2 border-slate-200 flex-shrink-0">
          <div className="flex items-center gap-2">
            {validationResult && (
              <span className="text-xs font-bold text-slate-600">
                File: <strong className="text-slate-900">{validationResult.fileName}</strong> • Sheet:{' '}
                <strong className="text-slate-900">{validationResult.sheetName}</strong>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              type="button"
              className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-sm rounded-xl transition-colors"
            >
              Cancel
            </button>
            {validationResult && validationResult.validCount > 0 && (
              <button
                onClick={handleExecuteImport}
                disabled={isImporting}
                type="button"
                className="px-7 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-black text-sm rounded-xl transition-all shadow-lg hover:shadow-emerald-500/30 flex items-center gap-2"
              >
                {isImporting ? (
                  <>Importing...</>
                ) : (
                  <>
                    <Check className="w-4 h-4" /> Import {validationResult.validCount} Valid Question
                    {validationResult.validCount > 1 ? 's' : ''}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
