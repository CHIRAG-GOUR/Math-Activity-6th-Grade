// ============================================================
// PERCENTAGE HARVEST — INTERACTIVE PERCENTAGE & HECTARE WORKSPACE
// Continuous Drag-to-Paint & Drag-to-Erase Hectare Grid (Touch/Mouse/Stylus),
// Live Target / Selected / Remaining Counter & Real-Time Mathematical Conversions
// ============================================================

import React, { useRef, useCallback } from 'react';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
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

  // ─────────────────────────────────────────────────────────────
  // CONTINUOUS DRAG-TO-PAINT & DRAG-TO-ERASE HANDLERS
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

  return (
    <div className="flex flex-col gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 select-none">
      {/* ── WORKSPACE HEADER & LIVE STATUS BADGE ── */}
      <div className="flex items-center justify-between pb-1 border-b border-slate-200">
        <div className="flex items-center gap-1">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-700">
            Hectare Planner
          </span>
          <span className="text-[9px] text-slate-400 font-bold">
            (Drag to Paint)
          </span>
        </div>

        {/* Live Target Status Pill */}
        {isExactTarget ? (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300 text-[9px] font-black uppercase shadow-xs">
            <CheckCircle2 className="w-2.5 h-2.5" />
            <span>Target ({selectedQty} {q.unit})</span>
          </span>
        ) : isOverTarget ? (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-[9px] font-black uppercase">
            <AlertTriangle className="w-2.5 h-2.5 text-amber-600" />
            <span>{selectedQty - targetQty} {q.unit} Over</span>
          </span>
        ) : (
          <span className="px-1.5 py-0.5 rounded-full bg-white text-slate-600 border border-slate-300 text-[9px] font-bold">
            Need {remainingQty} {q.unit}
          </span>
        )}
      </div>

      {/* ── SIDE-BY-SIDE: 10x10 DRAG-TO-FILL GRID & LIVE MATH ── */}
      <div className="grid grid-cols-2 gap-2 items-center">
        {/* Left: 10x10 Interactive Hectare Grid Container */}
        <div className="flex flex-col gap-1">
          <div
            ref={gridContainerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="grid grid-cols-10 gap-0.5 p-1 rounded-lg bg-white border border-slate-300 aspect-square cursor-crosshair relative shadow-inner"
            style={{ touchAction: 'none' }}
          >
            {team.selectedCells.map((isSelected, idx) => (
              <div
                key={`hcell-${teamId}-${idx}`}
                data-index={idx}
                className={`rounded-[1px] transition-colors pointer-events-none ${
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
            <div className="flex items-center justify-between gap-0.5 pt-0.5">
              <button
                type="button"
                onClick={() => setQuickGridPercentage(teamId, targetPct)}
                className="px-1 py-0.5 rounded bg-amber-100 hover:bg-amber-200 text-amber-900 text-[8px] font-black tracking-tight"
              >
                Target {targetPct}%
              </button>
              <button
                type="button"
                onClick={() => setQuickGridPercentage(teamId, 50)}
                className="px-1 py-0.5 rounded bg-slate-200 hover:bg-slate-300 text-slate-800 text-[8px] font-bold"
              >
                50%
              </button>
              <button
                type="button"
                onClick={() => setQuickGridPercentage(teamId, 75)}
                className="px-1 py-0.5 rounded bg-slate-200 hover:bg-slate-300 text-slate-800 text-[8px] font-bold"
              >
                75%
              </button>
              <button
                type="button"
                onClick={() => clearGrid(teamId)}
                className="px-1 py-0.5 rounded bg-rose-100 hover:bg-rose-200 text-rose-700 text-[8px] font-bold"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Right: Live Hectare & Percentage Mathematical Readout */}
        <div className="flex flex-col gap-1 font-mono text-[11px]">
          <div className="flex items-center justify-between pb-0.5 border-b border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 font-sans">Target</span>
            <span className="font-black text-amber-700">
              {targetQty} {q.unit} ({targetPct}%)
            </span>
          </div>

          <div className="flex items-center justify-between pb-0.5 border-b border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 font-sans">Selected</span>
            <span className="font-black text-slate-900">
              {selectedQty} / {totalBaseQty} {q.unit}
            </span>
          </div>

          <div className="flex items-center justify-between pb-0.5 border-b border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 font-sans">Percentage</span>
            <span className={`font-black ${isExactTarget ? 'text-emerald-600' : 'text-slate-900'}`}>
              {selectedCellCount}%
            </span>
          </div>

          <div className="flex items-center justify-between pb-0.5 border-b border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 font-sans">Fraction</span>
            <span className="font-bold text-slate-700">
              {selectedCellCount}/100
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 font-sans">Decimal</span>
            <span className="font-bold text-slate-700">
              {percentToDecimalStr(selectedCellCount)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
