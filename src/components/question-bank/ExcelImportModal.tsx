import React, { useState, useRef } from 'react';
import { ExcelValidationResult, UniversalQuestion } from '@/types/questionBank';
import {
  parseAndValidateExcel,
  commitExcelImport,
  generateExcelTemplateBlob,
} from '@/services/questionBankService';

interface ExcelImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: (message: string) => void;
}

export const ExcelImportModal: React.FC<ExcelImportModalProps> = ({
  isOpen,
  onClose,
  onImportComplete,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [validationResult, setValidationResult] = useState<ExcelValidationResult | null>(null);
  const [duplicateAction, setDuplicateAction] = useState<'skip' | 'import-anyway' | 'replace'>('skip');
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
      a.download = 'Grade6_Math_Arcade_Questions_Template.xlsx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setErrorMessage('Failed to generate template: ' + err.message);
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
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to read spreadsheet.');
    } finally {
      setIsParsing(false);
    }
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

      onImportComplete(msg);
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border-2 border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b-2 border-slate-800">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-lg font-black text-white shadow-inner">
              📥
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                Import Questions from Excel / CSV
              </h2>
              <p className="text-xs text-slate-300 font-medium">
                Bulk upload teacher questions for all 13 Grade 6 math arcade activities
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border-2 border-rose-400 rounded-xl text-xs font-black text-rose-800 flex items-center gap-2">
              <span>⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Step 1: Template Download Banner */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-black text-blue-900 uppercase tracking-wider mb-0.5">
                Standard Excel Template
              </div>
              <p className="text-xs text-blue-700">
                Format columns: Activity, Question, Option A, Option B, Option C, Option D, Correct Answer, Explanation, Difficulty.
              </p>
            </div>
            <button
              onClick={handleDownloadTemplate}
              type="button"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-sm whitespace-nowrap"
            >
              <span>📄</span> Download .xlsx Template
            </button>
          </div>

          {/* Upload Drop Zone */}
          {!validationResult && (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/50 rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                📊
              </div>
              <div>
                <span className="text-sm font-black text-slate-800 group-hover:text-blue-600 transition-colors">
                  {isParsing ? 'Parsing spreadsheet...' : 'Click to browse or drag & drop Excel/CSV file here'}
                </span>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  Supports .xlsx, .xls, and .csv files from Microsoft Excel or Google Sheets
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Validation Preview */}
          {validationResult && (
            <div className="space-y-5 animate-fadeIn">
              {/* Summary Stats */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                    Import Preview & Validation
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    File: <span className="font-bold text-slate-700">{selectedFile?.name}</span> ({validationResult.totalDetected} rows detected)
                  </p>
                </div>
                <button
                  onClick={handleReset}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors"
                >
                  Choose Another File
                </button>
              </div>

              {/* Status Chips */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-emerald-50 border-2 border-emerald-300 rounded-xl p-3.5 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-sm">
                    ✓
                  </span>
                  <div>
                    <div className="text-lg font-black text-emerald-950">
                      {validationResult.validCount}
                    </div>
                    <div className="text-[11px] font-bold text-emerald-800 uppercase">
                      Ready to Import
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-3.5 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black text-sm">
                    ⚠
                  </span>
                  <div>
                    <div className="text-lg font-black text-amber-950">
                      {validationResult.duplicateCount}
                    </div>
                    <div className="text-[11px] font-bold text-amber-800 uppercase">
                      Possible Duplicates
                    </div>
                  </div>
                </div>

                <div className="bg-rose-50 border-2 border-rose-300 rounded-xl p-3.5 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center font-black text-sm">
                    ✕
                  </span>
                  <div>
                    <div className="text-lg font-black text-rose-950">
                      {validationResult.invalidCount}
                    </div>
                    <div className="text-[11px] font-bold text-rose-800 uppercase">
                      Invalid Rows
                    </div>
                  </div>
                </div>
              </div>

              {/* Duplicate Handling Options */}
              {validationResult.duplicateCount > 0 && (
                <div className="bg-amber-50/70 border-2 border-amber-300 rounded-xl p-4 space-y-2">
                  <div className="text-xs font-black text-amber-900 uppercase tracking-wider">
                    Duplicate Handling Action
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    {[
                      { id: 'skip' as const, label: 'Skip duplicates (Recommended)' },
                      { id: 'import-anyway' as const, label: 'Import Anyway' },
                      { id: 'replace' as const, label: 'Replace Existing Questions' },
                    ].map((opt) => (
                      <label
                        key={opt.id}
                        className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800 bg-white px-3 py-1.5 rounded-lg border border-amber-300 shadow-sm"
                      >
                        <input
                          type="radio"
                          name="duplicateAction"
                          value={opt.id}
                          checked={duplicateAction === opt.id}
                          onChange={() => setDuplicateAction(opt.id)}
                          className="accent-amber-600"
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Invalid Rows Inspector (if any) */}
              {validationResult.invalidRows.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-black text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
                    <span>⚠️</span> Attention Required ({validationResult.invalidRows.length} invalid rows will be skipped)
                  </div>
                  <div className="max-h-44 overflow-y-auto space-y-2 border-2 border-rose-200 rounded-xl p-3 bg-rose-50/50">
                    {validationResult.invalidRows.map((inv, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 bg-white border border-rose-300 rounded-lg text-xs space-y-1 shadow-xs"
                      >
                        <div className="flex items-center justify-between font-bold text-slate-800">
                          <span>Row #{inv.rowNumber}</span>
                          <span className="text-rose-600 font-black">
                            {inv.errors.join(' • ')}
                          </span>
                        </div>
                        <p className="text-slate-600 truncate">
                          "{inv.data.rawQuestion || 'No question text'}" (Activity: {inv.data.rawActivity || 'None'})
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Valid Rows Preview */}
              {validationResult.validQuestions.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-black text-slate-700 uppercase tracking-wider">
                    Sample Valid Questions Preview
                  </div>
                  <div className="max-h-48 overflow-y-auto space-y-2 border-2 border-slate-200 rounded-xl p-3 bg-slate-50">
                    {validationResult.validQuestions.slice(0, 5).map((q, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 bg-white border border-slate-200 rounded-lg text-xs space-y-1 shadow-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-blue-700">{q.activityName}</span>
                          <span className="font-black text-emerald-700">Correct: Option {q.correctAnswer}</span>
                        </div>
                        <p className="font-bold text-slate-900 line-clamp-1">{q.question}</p>
                      </div>
                    ))}
                    {validationResult.validQuestions.length > 5 && (
                      <div className="text-center text-[11px] font-bold text-slate-500 py-1">
                        + {validationResult.validQuestions.length - 5} more valid questions ready to import
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-100 border-t-2 border-slate-200">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-sm rounded-xl transition-colors"
          >
            Cancel
          </button>
          {validationResult && validationResult.validCount > 0 && (
            <button
              onClick={handleExecuteImport}
              disabled={isImporting}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black text-sm rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2"
            >
              {isImporting ? 'Importing...' : `✓ Import ${validationResult.validCount} Valid Questions`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
