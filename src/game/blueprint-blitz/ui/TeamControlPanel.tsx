// ============================================================
// BLUEPRINT BLITZ — Dual-Team Touch Control Panel
// Sits on LEFT (Blue) and RIGHT (Red) of screen:
// - Opaque high-contrast card styling with thick comic borders
// - Large touch steppers (70-90px) for Length, Width, Height, Blocks
// - Crane control d-pad and Grab/Release action
// - Big physical "TEST BUILD" submission trigger
// ============================================================

import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  CheckCircle2,
  Wrench,
  Layers,
  RotateCw,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  Hammer,
} from 'lucide-react';
import { MechanicType, TeamBuild, TeamId } from '../types';
import { useBlueprintStore } from '../store/blueprintStore';

interface TeamControlPanelProps {
  teamId: TeamId;
  teamName: string;
  score: number;
  build: TeamBuild;
  mechanic: MechanicType;
  isLocked: boolean;
  isConfirmed: boolean;
}

export const TeamControlPanel: React.FC<TeamControlPanelProps> = ({
  teamId,
  teamName,
  score,
  build,
  mechanic,
  isLocked,
  isConfirmed,
}) => {
  const {
    adjustDimension,
    adjustBlocks,
    operateCrane,
    submitBuild,
    setCameraFocus,
  } = useBlueprintStore();

  const isBlue = teamId === 'blue';
  const cardBorderClass = isBlue ? 'bb-team-card-blue' : 'bb-team-card-red';
  const headerBgClass = isBlue ? 'bg-blue-600 text-white' : 'bg-red-600 text-white';
  const accentColor = isBlue ? 'text-blue-600' : 'text-red-600';
  const btnClass = isBlue ? 'bb-btn-blue' : 'bb-btn-red';

  const showHeight = mechanic !== 'floor';
  const showCrane = mechanic === 'crane' || mechanic === 'mega-build';
  const showBlocks = mechanic === 'modify';

  return (
    <div
      className={`w-full max-w-[340px] flex flex-col gap-3 p-3.5 bg-slate-900/95 rounded-2xl border-4 ${
        isBlue ? 'border-blue-500' : 'border-red-500'
      } shadow-2xl z-20 select-none text-slate-100 backdrop-blur-sm`}
    >
      {/* ── TEAM HEADER & LIVE SCORE ── */}
      <div
        className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-black ${headerBgClass} shadow-md`}
      >
        <div className="flex items-center gap-2">
          <Hammer className="w-5 h-5" />
          <span className="text-base tracking-wider uppercase">{teamName}</span>
        </div>
        <div className="bg-amber-400 text-slate-950 px-2.5 py-1 rounded-lg text-sm font-black flex items-center gap-1 shadow-inner">
          <span>★</span>
          <span>{score} PTS</span>
        </div>
      </div>

      {/* ── LIVE PHYSICAL SPECIFICATIONS ── */}
      <div className="grid grid-cols-2 gap-2 bg-slate-950/80 p-2.5 rounded-xl border border-slate-700/80">
        <div className="flex flex-col items-center justify-center p-1.5 bg-slate-800/60 rounded-lg">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            AREA
          </span>
          <span className="text-lg font-black text-amber-300">
            {build.length * build.width} m²
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            {build.length} × {build.width}
          </span>
        </div>

        <div className="flex flex-col items-center justify-center p-1.5 bg-slate-800/60 rounded-lg">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            VOLUME
          </span>
          <span className="text-lg font-black text-cyan-300">
            {build.length * build.width * build.height} m³
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            {build.length * build.width} × {build.height}
          </span>
        </div>
      </div>

      {/* ── DIMENSION TOUCH STEPPERS (MIN 70PX) ── */}
      <div className="flex flex-col gap-2.5">
        {/* LENGTH STEPPER */}
        <div className="bg-slate-800/90 p-2 rounded-xl border border-slate-700 flex items-center justify-between">
          <div className="flex flex-col pl-1">
            <span className="text-xs font-black text-slate-300 uppercase tracking-wide">
              LENGTH (L)
            </span>
            <span className="text-xs text-slate-400">Columns</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => adjustDimension(teamId, 'length', -1)}
              disabled={isLocked || build.length <= 1}
              className="w-12 h-12 rounded-xl bg-slate-700 hover:bg-slate-600 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center font-black text-xl text-white shadow-md border-2 border-slate-600"
              title="Decrease Length"
            >
              <Minus className="w-5 h-5" />
            </button>
            <div className="w-12 h-12 bg-slate-950 rounded-xl border-2 border-amber-400/50 flex items-center justify-center">
              <span className="text-xl font-black text-amber-300">{build.length}</span>
            </div>
            <button
              onClick={() => adjustDimension(teamId, 'length', 1)}
              disabled={isLocked || build.length >= 12}
              className="w-12 h-12 rounded-xl bg-slate-700 hover:bg-slate-600 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center font-black text-xl text-white shadow-md border-2 border-slate-600"
              title="Increase Length"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* WIDTH STEPPER */}
        <div className="bg-slate-800/90 p-2 rounded-xl border border-slate-700 flex items-center justify-between">
          <div className="flex flex-col pl-1">
            <span className="text-xs font-black text-slate-300 uppercase tracking-wide">
              WIDTH (W)
            </span>
            <span className="text-xs text-slate-400">Rows</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => adjustDimension(teamId, 'width', -1)}
              disabled={isLocked || build.width <= 1}
              className="w-12 h-12 rounded-xl bg-slate-700 hover:bg-slate-600 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center font-black text-xl text-white shadow-md border-2 border-slate-600"
              title="Decrease Width"
            >
              <Minus className="w-5 h-5" />
            </button>
            <div className="w-12 h-12 bg-slate-950 rounded-xl border-2 border-amber-400/50 flex items-center justify-center">
              <span className="text-xl font-black text-amber-300">{build.width}</span>
            </div>
            <button
              onClick={() => adjustDimension(teamId, 'width', 1)}
              disabled={isLocked || build.width >= 12}
              className="w-12 h-12 rounded-xl bg-slate-700 hover:bg-slate-600 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center font-black text-xl text-white shadow-md border-2 border-slate-600"
              title="Increase Width"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* HEIGHT STEPPER (When Volume / 3D active) */}
        {showHeight && (
          <div className="bg-slate-800/90 p-2 rounded-xl border border-slate-700 flex items-center justify-between">
            <div className="flex flex-col pl-1">
              <span className="text-xs font-black text-cyan-300 uppercase tracking-wide">
                HEIGHT (H)
              </span>
              <span className="text-xs text-slate-400">Layers</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => adjustDimension(teamId, 'height', -1)}
                disabled={isLocked || build.height <= 1}
                className="w-12 h-12 rounded-xl bg-slate-700 hover:bg-slate-600 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center font-black text-xl text-white shadow-md border-2 border-slate-600"
                title="Decrease Height"
              >
                <Minus className="w-5 h-5" />
              </button>
              <div className="w-12 h-12 bg-slate-950 rounded-xl border-2 border-cyan-400/50 flex items-center justify-center">
                <span className="text-xl font-black text-cyan-300">{build.height}</span>
              </div>
              <button
                onClick={() => adjustDimension(teamId, 'height', 1)}
                disabled={isLocked || build.height >= 10}
                className="w-12 h-12 rounded-xl bg-slate-700 hover:bg-slate-600 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center font-black text-xl text-white shadow-md border-2 border-slate-600"
                title="Increase Height"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* MODIFY BLOCKS STEPPER (For irregular composite modify challenges) */}
        {showBlocks && (
          <div className="bg-slate-800/90 p-2 rounded-xl border border-slate-700 flex items-center justify-between">
            <div className="flex flex-col pl-1">
              <span className="text-xs font-black text-emerald-300 uppercase tracking-wide">
                TOTAL BLOCKS
              </span>
              <span className="text-xs text-slate-400">Add / Remove</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => adjustBlocks(teamId, -1)}
                disabled={isLocked || build.blocks <= 1}
                className="w-12 h-12 rounded-xl bg-slate-700 hover:bg-slate-600 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center font-black text-xl text-white shadow-md border-2 border-slate-600"
              >
                <Minus className="w-5 h-5" />
              </button>
              <div className="w-12 h-12 bg-slate-950 rounded-xl border-2 border-emerald-400/50 flex items-center justify-center">
                <span className="text-xl font-black text-emerald-300">{build.blocks}</span>
              </div>
              <button
                onClick={() => adjustBlocks(teamId, 1)}
                disabled={isLocked || build.blocks >= 64}
                className="w-12 h-12 rounded-xl bg-slate-700 hover:bg-slate-600 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center font-black text-xl text-white shadow-md border-2 border-slate-600"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── CRANE CONTROLS (When active) ── */}
      {showCrane && (
        <div className="bg-slate-950/80 p-2.5 rounded-xl border border-amber-500/40 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-bold text-amber-400">
            <span>🏗️ CRANE RIG CONTROLS</span>
            <button
              onClick={() => setCameraFocus(isBlue ? 'blue' : 'red')}
              className="text-[10px] underline text-slate-300 hover:text-white"
            >
              Focus Site
            </button>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={() => operateCrane(teamId, 'rotate_left')}
              className="py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 rounded-lg text-xs font-bold flex items-center justify-center gap-1 border border-slate-600"
            >
              <RotateCcw className="w-3.5 h-3.5" /> ROT L
            </button>
            <button
              onClick={() => operateCrane(teamId, 'up')}
              className="py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 rounded-lg text-xs font-bold flex items-center justify-center gap-1 border border-slate-600"
            >
              <ArrowUp className="w-3.5 h-3.5" /> HOIST
            </button>
            <button
              onClick={() => operateCrane(teamId, 'rotate_right')}
              className="py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 rounded-lg text-xs font-bold flex items-center justify-center gap-1 border border-slate-600"
            >
              <RotateCw className="w-3.5 h-3.5" /> ROT R
            </button>
            <button
              onClick={() => operateCrane(teamId, 'move_back')}
              className="py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 rounded-lg text-xs font-bold flex items-center justify-center gap-1 border border-slate-600"
            >
              ← BACK
            </button>
            <button
              onClick={() => operateCrane(teamId, 'down')}
              className="py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 rounded-lg text-xs font-bold flex items-center justify-center gap-1 border border-slate-600"
            >
              <ArrowDown className="w-3.5 h-3.5" /> LOWER
            </button>
            <button
              onClick={() => operateCrane(teamId, 'grab_release')}
              className={`py-2 rounded-lg text-xs font-black flex items-center justify-center gap-1 shadow-md ${
                build.craneHolding ? 'bg-amber-500 text-slate-950' : 'bg-emerald-600 text-white'
              }`}
            >
              {build.craneHolding ? 'RELEASE' : 'GRAB'}
            </button>
          </div>
        </div>
      )}

      {/* ── BIG PHYSICAL "TEST BUILD" BUTTON ── */}
      <button
        onClick={() => submitBuild(teamId)}
        disabled={isLocked || isConfirmed}
        className={`w-full py-4 rounded-xl font-black text-lg tracking-wider uppercase transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 border-b-4 ${
          isConfirmed
            ? 'bg-emerald-600 text-white border-emerald-800 cursor-default'
            : isBlue
              ? 'bg-blue-500 hover:bg-blue-400 text-white border-blue-700 active:border-b-0 active:translate-y-1'
              : 'bg-red-500 hover:bg-red-400 text-white border-red-700 active:border-b-0 active:translate-y-1'
        }`}
      >
        {isConfirmed ? (
          <>
            <CheckCircle2 className="w-6 h-6" />
            <span>BUILD SUBMITTED</span>
          </>
        ) : (
          <>
            <CheckCircle2 className="w-6 h-6" />
            <span>CONFIRM & SCAN</span>
          </>
        )}
      </button>
    </div>
  );
};
