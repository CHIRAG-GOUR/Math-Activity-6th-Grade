// ============================================================
// PERCENTAGE HARVEST — INTERACTIVE PERCENTAGE & HECTARE WORKSPACE
// Compact 10x10 Drag-to-Paint Grid for Grid Questions
// + Sleek Visual Percentage & Benchmark Helper for Standard Quiz Questions
// ============================================================

import React, { useRef, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, Sparkles, BarChart2 } from 'lucide-react';
import { useFarmStore } from '../store/farmStore';
import { TeamId } from '../types';
import { percentToDecimalStr } from '../engine/percentageMath';
import { farmAudio } from '../engine/farmAudio';

interface PercentageWorkspaceProps {
  teamId: TeamId;
}

export const PercentageWorkspace: React.FC<PercentageWorkspaceProps> = ({ teamId }) => {
  const team = useFarmStore((s) => s[teamId]);
  const setGridCellState = useFarmStore((s) => s.setGridCellState);
  const setQuickGridPercentage = useFarmStore((s) => s.setQuickGridPercentage);
  const clearGrid = useFarmStore((s) => s.clearGrid);
  const selectAnswer = useFarmStore((s) => s.selectAnswer);

  const gridContainerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const paintModeRef = useRef<boolean>(true); // true = fill, false = erase
  const visitedRef = useRef<Set<number>>(new Set());

  const q = team.currentQuestion;
  if (!q) return null;

  const totalBaseQty = q.baseQuantity || 100;
  const targetPct = q.targetPercentage || 0;
  const targetQty = typeof q.correctAnswer === 'number' ? q.correctAnswer : Math.round((targetPct / 100) * totalBaseQty);

  const selectedCellCount = team.selectedCells.filter(Boolean).length;
  const selectedQty = Math.round((selectedCellCount / 100) * totalBaseQty);
  const remainingQty = targetQty - selectedQty;
  const isExactTarget = selectedQty === targetQty && selectedCellCount > 0;
  const isOverTarget = selectedQty > targetQty;

  const isBlue = teamId === 'blue';
  const isGridMode = q.mode === 'grid100' || q.category === 'grid100';

  // ─────────────────────────────────────────────────────────────
  // CONTINUOUS DRAG-TO-PAINT & DRAG-TO-ERASE HANDLERS (Grid Mode)
  // ─────────────────────────────────────────────────────────────
  const getCellIndexFromPointer = useCallback((clientX: number, clientY: number): number | null => {
    if (!gridContainerRef.current) return null;
    const rect = gridContainerRef.current.getBoundingClientRect();
    if (
      clientX < rect.left ||
      clientX > rect.right ||
      clientY < rect.top ||
      clientY > rect.bottom
    ) {
      return null;
    }
    const col = Math.floor(((clientX - rect.left) / rect.width) * 10);
    const row = Math.floor(((clientY - rect.top) / rect.height) * 10);
    if (col < 0 || col >= 10 || row < 0 || row >= 10) return null;
    return row * 10 + col;
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (team.hasAnsweredCurrent) return;
    farmAudio.unlock();
    const cellIdx = getCellIndexFromPointer(e.clientX, e.clientY);
    if (cellIdx === null) return;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {}

    isDraggingRef.current = true;
    const isCurrentlyFilled = team.selectedCells[cellIdx];
    const newMode = !isCurrentlyFilled;
    paintModeRef.current = newMode;
    visitedRef.current = new Set([cellIdx]);

    farmAudio.playGridPop();
    setGridCellState(teamId, cellIdx, newMode);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || team.hasAnsweredCurrent) return;
    const cellIdx = getCellIndexFromPointer(e.clientX, e.clientY);
    if (cellIdx === null) return;

    if (!visitedRef.current.has(cellIdx)) {
      visitedRef.current.add(cellIdx);
      farmAudio.playGridPop();
      setGridCellState(teamId, cellIdx, paintModeRef.current);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      visitedRef.current.clear();
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (_) {}
    }
  };

  // ─────────────────────────────────────────────────────────────
  // 1. STANDARD 6TH GRADE QUIZ MODE (Compact Visual Helper)
  // ─────────────────────────────────────────────────────────────
  if (!isGridMode) {
    return (
      <div className="flex flex-col gap-2 p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 select-none">
        {/* Visual Benchmark Bar Header */}
        <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
          <div className="flex items-center gap-1.5 text-slate-600">
            <BarChart2 className="w-4 h-4 text-sky-500 shrink-0" />
            <span className="uppercase tracking-wider font-black">Percentage Helper</span>
          </div>
          <span className="font-mono font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
            Target: {targetPct > 0 ? `${targetPct}%` : `${q.correctAnswer}`}
          </span>
        </div>

        {/* Visual 0 - 100% Progress Strip */}
        <div className="relative w-full h-4 sm:h-5 rounded-full bg-slate-200 overflow-hidden border border-slate-300">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isBlue ? 'bg-gradient-to-r from-blue-500 to-sky-400' : 'bg-gradient-to-r from-red-500 to-amber-400'
            }`}
            style={{ width: `${Math.min(100, targetPct || 50)}%` }}
          />
          {/* 25%, 50%, 75% tick marks */}
          <div className="absolute inset-0 flex justify-between px-2 items-center pointer-events-none text-[8.5px] sm:text-[10px] font-mono font-black text-slate-700">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
        </div>

        {/* 4 Quick Grade 6 Benchmark Badges */}
        <div className="grid grid-cols-4 gap-1.5 pt-0.5 text-[10px] sm:text-xs md:text-sm font-bold">
          <div className="p-1 sm:p-1.5 text-center rounded-lg bg-white border border-slate-200 shadow-2xs">
            <span className="text-slate-500">1/4 = </span>
            <span className="font-mono font-black text-slate-800">25%</span>
          </div>
          <div className="p-1 sm:p-1.5 text-center rounded-lg bg-white border border-slate-200 shadow-2xs">
            <span className="text-slate-500">1/2 = </span>
            <span className="font-mono font-black text-slate-800">50%</span>
          </div>
          <div className="p-1 sm:p-1.5 text-center rounded-lg bg-white border border-slate-200 shadow-2xs">
            <span className="text-slate-500">3/4 = </span>
            <span className="font-mono font-black text-slate-800">75%</span>
          </div>
          <div className="p-1 sm:p-1.5 text-center rounded-lg bg-white border border-slate-200 shadow-2xs">
            <span className="text-slate-500">1/10 = </span>
            <span className="font-mono font-black text-slate-800">10%</span>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 2. 100-CELL HECTARE GRID WORKSPACE (When Question Asks for Grid Modeling)
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-2 p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 select-none">
      {/* ── WORKSPACE HEADER & LIVE STATUS BADGE ── */}
      <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
        <div className="flex items-center gap-1.5">
          <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-700">
            100-Cell Hectare Grid
          </span>
          <span className="text-[10px] sm:text-xs text-slate-400 font-bold">
            (Drag to Paint)
          </span>
        </div>

        {/* Live Target Status Pill */}
        {isExactTarget ? (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300 text-[10px] sm:text-xs font-black uppercase shadow-xs">
            <CheckCircle2 className="w-3 h-3" />
            <span>Target ({selectedQty} {q.unit})</span>
          </span>
        ) : isOverTarget ? (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-[10px] sm:text-xs font-black uppercase">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            <span>{selectedQty - targetQty} Over</span>
          </span>
        ) : (
          <span className="px-2 py-0.5 rounded-full bg-white text-slate-600 border border-slate-300 text-[10px] sm:text-xs font-bold">
            Need {remainingQty} {q.unit}
          </span>
        )}
      </div>

      {/* ── SIDE-BY-SIDE: 10x10 DRAG-TO-FILL GRID & LIVE MATH ── */}
      <div className="grid grid-cols-2 gap-2.5 items-center">
        {/* Left: 10x10 Interactive Hectare Grid Container */}
        <div className="flex flex-col gap-1.5">
          <div
            ref={gridContainerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="grid grid-cols-10 gap-0.5 p-1 sm:p-1.5 rounded-xl bg-white border border-slate-300 aspect-square cursor-crosshair relative shadow-inner"
            style={{ touchAction: 'none' }}
          >
            {team.selectedCells.map((isSelected, idx) => (
              <div
                key={`hcell-${teamId}-${idx}`}
                data-index={idx}
                className={`rounded-[2px] transition-colors pointer-events-none ${
                  isSelected
                    ? isBlue
                      ? 'bg-blue-600 shadow-xs'
                      : 'bg-red-600 shadow-xs'
                    : 'bg-slate-100 border border-slate-200'
                }`}
              />
            ))}
          </div>

          {/* Quick Shortcuts */}
          {!team.hasAnsweredCurrent && (
            <div className="flex items-center justify-between gap-1 pt-0.5">
              <button
                type="button"
                onClick={() => setQuickGridPercentage(teamId, targetPct)}
                className="px-1.5 py-0.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-[9px] sm:text-[11px] font-black tracking-tight cursor-pointer"
              >
                Target {targetPct}%
              </button>
              <button
                type="button"
                onClick={() => setQuickGridPercentage(teamId, 50)}
                className="px-1.5 py-0.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-[9px] sm:text-[11px] font-bold cursor-pointer"
              >
                50%
              </button>
              <button
                type="button"
                onClick={() => setQuickGridPercentage(teamId, 75)}
                className="px-1.5 py-0.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-[9px] sm:text-[11px] font-bold cursor-pointer"
              >
                75%
              </button>
              <button
                type="button"
                onClick={() => clearGrid(teamId)}
                className="px-1.5 py-0.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-700 text-[9px] sm:text-[11px] font-bold cursor-pointer"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Right: Live Hectare & Percentage Mathematical Readout */}
        <div className="flex flex-col gap-1.5 font-mono text-xs sm:text-sm">
          <div className="flex items-center justify-between pb-1 border-b border-slate-200">
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 font-sans">Target</span>
            <span className="font-black text-amber-700">
              {targetQty} {q.unit} ({targetPct}%)
            </span>
          </div>

          <div className="flex items-center justify-between pb-1 border-b border-slate-200">
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 font-sans">Selected</span>
            <span className="font-black text-slate-900">
              {selectedQty} / {totalBaseQty} {q.unit}
            </span>
          </div>

          <div className="flex items-center justify-between pb-1 border-b border-slate-200">
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 font-sans">Percentage</span>
            <span className={`font-black ${isExactTarget ? 'text-emerald-600' : 'text-slate-900'}`}>
              {selectedCellCount}%
            </span>
          </div>

          <div className="flex items-center justify-between pb-1 border-b border-slate-200">
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 font-sans">Fraction</span>
            <span className="font-bold text-slate-700">
              {selectedCellCount}/100
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 font-sans">Decimal</span>
            <span className="font-bold text-slate-700">
              {percentToDecimalStr(selectedCellCount)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
