// ============================================================
// BLUEPRINT BLITZ — Physical Construction Workstation Console
// Heavy-duty industrial control console for Blue (LEFT) and Red (RIGHT):
// - Solid Cream (#FFF8E7) casing with safety hazard trim & metallic bolts
// - Bright, high-contrast daytime gauges for Area & Volume (Zero dark slate!)
// - Material Selection Station (Brick 🧱, Concrete 🔲, Wood 🪵, Tile ◻️, Cube 📦)
// - Chunky mechanical steppers (70-90px touch targets) with bold black numbers
// - Heavy industrial "LOCK & TEST BUILD" actuator switch
// ============================================================

import React from 'react';
import {
  Plus,
  Minus,
  CheckCircle2,
  RotateCw,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  Hammer,
  Boxes,
  Gauge,
} from 'lucide-react';
import { MechanicType, TeamBuild, TeamId } from '../types';
import { useBlueprintStore } from '../store/blueprintStore';
import { blueprintAudio } from '../audio/blueprintAudio';

interface TeamControlPanelProps {
  teamId: TeamId;
  teamName: string;
  score: number;
  build: TeamBuild;
  mechanic: MechanicType;
  isLocked: boolean;
  isConfirmed: boolean;
}

const MATERIALS = [
  { id: 'brick', name: 'BRICK', icon: '🧱', sound: 'brick' },
  { id: 'concrete', name: 'CONCRETE', icon: '🔲', sound: 'concrete' },
  { id: 'wood', name: 'WOOD BEAM', icon: '🪵', sound: 'wood' },
  { id: 'tile', name: 'FLOOR TILE', icon: '◻️', sound: 'tile' },
  { id: 'cube', name: 'UNIT CUBE', icon: '📦', sound: 'cube' },
] as const;

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
    setShapeType,
    blueTeam,
    redTeam,
    phase,
    activeChallenge,
  } = useBlueprintStore();

  const teamState = teamId === 'blue' ? blueTeam : redTeam;
  const scanResult = teamState.scanResult;
  const isBlue = teamId === 'blue';

  const isCorrect = scanResult?.isCorrect === true;
  const isWrong = scanResult !== null && scanResult?.isCorrect === false;

  const headerBgClass = isCorrect
    ? 'bg-emerald-600 text-white shadow-emerald-200'
    : isWrong
      ? 'bg-red-600 text-white shadow-red-200'
      : isBlue
        ? 'bg-blue-600 text-white'
        : 'bg-red-600 text-white';

  const workstationClass = isCorrect
    ? 'bb-workstation-correct ring-4 ring-emerald-500'
    : isWrong
      ? 'bb-workstation-wrong ring-4 ring-red-500'
      : isBlue
        ? 'bb-workstation-blue'
        : 'bb-workstation-red';

  const testSwitchClass = isBlue ? 'bb-test-switch-blue' : 'bb-test-switch-red';

  const showHeight = mechanic !== 'floor';
  const showCrane = mechanic === 'crane' || mechanic === 'mega-build';
  const showBlocks = mechanic === 'modify';

  const handleMaterialTouch = (mat: typeof MATERIALS[number]) => {
    if (isLocked) return;
    setShapeType(teamId, mat.id);
    switch (mat.sound) {
      case 'brick':
        blueprintAudio.playBrickClunk();
        break;
      case 'concrete':
        blueprintAudio.playConcreteThud();
        break;
      case 'wood':
        blueprintAudio.playWoodKnock();
        break;
      default:
        blueprintAudio.playBlockPlace();
        break;
    }
  };

  return (
    <div
      className={`w-full max-w-[340px] flex flex-col gap-2.5 p-3 rounded-2xl ${workstationClass} select-none z-20 text-slate-950`}
    >
      {/* ── TOP BOLTS & HAZARD SAFETY STRIPING ── */}
      <div className="flex items-center justify-between px-1">
        <div className="bb-bolt" />
        <div className="h-2 flex-1 mx-3 rounded-full bb-hazard-stripe border border-slate-950" />
        <div className="bb-bolt" />
      </div>

      {/* ── CONSOLE WORKSTATION TEAM BANNER & 2-CHANCE BADGE ── */}
      <div
        className={`flex flex-col gap-1.5 p-2.5 rounded-xl font-black ${headerBgClass} shadow-md border-3 border-slate-950`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hammer className="w-5 h-5 stroke-[2.5]" />
            <span className="text-sm tracking-wider uppercase drop-shadow">{teamName}</span>
          </div>
          <div className="bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-lg text-xs font-black flex items-center gap-1 shadow border border-slate-950">
            <span>★</span>
            <span>{score} PTS</span>
          </div>
        </div>

        {/* 2-Chance Indicator Strip */}
        <div className="flex items-center justify-between text-[10px] font-black tracking-wide bg-slate-950/20 px-2 py-0.5 rounded-lg">
          <span className="text-white/80">ATTEMPT STATUS:</span>
          {isCorrect ? (
            <span className="bg-emerald-400 text-slate-950 px-2 py-0.5 rounded font-black">
              ✓ APPROVED
            </span>
          ) : teamState.attemptsLeft === 2 ? (
            <span className="bg-amber-300 text-slate-950 px-2 py-0.5 rounded font-black">
              CHANCE 1 OF 2
            </span>
          ) : teamState.attemptsLeft === 1 ? (
            <span className="bg-orange-400 text-slate-950 px-2 py-0.5 rounded font-black animate-pulse">
              CHANCE 2 OF 2 (FINAL)
            </span>
          ) : (
            <span className="bg-red-300 text-slate-950 px-2 py-0.5 rounded font-black">
              0 CHANCES LEFT
            </span>
          )}
        </div>
      </div>

      {/* ── ACTIVE MISSION OBJECTIVE / QUESTION STRIP ── */}
      {activeChallenge && (
        <div className="bg-amber-100/95 border-2 border-amber-400 px-2.5 py-1.5 rounded-xl text-slate-950 flex flex-col gap-0.5 shadow-sm">
          <div className="flex items-center justify-between text-[9px] font-black text-amber-900 uppercase">
            <span className="flex items-center gap-1">
              <span>🎯</span>
              <span>MISSION QUESTION</span>
            </span>
            <span className="bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded font-black text-[9px] border border-slate-950">
              {activeChallenge.target.description}
            </span>
          </div>
          <p className="text-[11px] font-black text-slate-950 leading-tight">
            {activeChallenge.prompt}
          </p>
        </div>
      )}

      {/* ── BRIGHT INDUSTRIAL GAUGES (AREA & VOLUME) ── */}
      <div className="grid grid-cols-2 gap-2 bg-amber-50 p-2 rounded-xl border-2 border-amber-300 shadow-sm">
        {/* Area Gauge */}
        <div className="flex flex-col items-center justify-center p-2 bg-white rounded-lg border-2 border-amber-400 shadow-sm">
          <span className="text-[10px] font-black text-amber-800 uppercase tracking-widest flex items-center gap-1">
            <Gauge className="w-3.5 h-3.5 text-amber-600" />
            AREA METER
          </span>
          <span className="text-2xl font-black text-slate-950 font-mono mt-0.5">
            {build.length * build.width} m²
          </span>
          <span className="text-xs text-amber-900 font-mono font-black">
            {build.length} × {build.width}
          </span>
        </div>

        {/* Volume Gauge */}
        <div className="flex flex-col items-center justify-center p-2 bg-white rounded-lg border-2 border-cyan-400 shadow-sm">
          <span className="text-[10px] font-black text-cyan-800 uppercase tracking-widest flex items-center gap-1">
            <Boxes className="w-3.5 h-3.5 text-cyan-600" />
            VOLUME METER
          </span>
          <span className="text-2xl font-black text-slate-950 font-mono mt-0.5">
            {build.length * build.width * build.height} m³
          </span>
          <span className="text-xs text-cyan-900 font-mono font-black">
            {build.length * build.width} × {build.height}
          </span>
        </div>
      </div>

      {/* ── MATERIAL PALLET STATION (Daytime Palette) ── */}
      <div className="bg-white p-2 rounded-xl border-2 border-amber-300 shadow-sm flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-[10px] font-black text-slate-700 uppercase tracking-wider px-1">
          <span>MATERIAL PALLET</span>
          <span className="text-amber-700 font-black">ACTIVE: {build.shapeType.toUpperCase()}</span>
        </div>
        <div className="grid grid-cols-5 gap-1">
          {MATERIALS.map((mat) => {
            const isActive = build.shapeType === mat.id;
            return (
              <button
                key={mat.id}
                onClick={() => handleMaterialTouch(mat)}
                disabled={isLocked}
                className={`flex flex-col items-center justify-center p-1 rounded-lg border-2 transition-all active:scale-95 disabled:opacity-50 ${
                  isActive
                    ? 'bg-amber-400 border-slate-950 text-slate-950 shadow-md font-black ring-2 ring-amber-300'
                    : 'bg-slate-50 border-slate-300 text-slate-800 hover:bg-amber-50 hover:border-amber-400'
                }`}
                title={mat.name}
              >
                <span className="text-base">{mat.icon}</span>
                <span className="text-[8px] font-black tracking-tight mt-0.5 truncate w-full text-center">
                  {mat.name.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── MECHANICAL STEPPER CONTROLS (70-90PX TOUCH TARGETS) ── */}
      <div className="flex flex-col gap-2">
        {/* LENGTH DIAL */}
        <div className="bg-white p-2 rounded-xl border-2 border-slate-300 shadow-sm flex items-center justify-between">
          <div className="flex flex-col pl-1">
            <span className="text-xs font-black text-slate-900 uppercase tracking-wide">
              LENGTH (L)
            </span>
            <span className="text-[10px] font-bold text-slate-500">Columns</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => adjustDimension(teamId, 'length', -1)}
              disabled={isLocked || build.length <= 1}
              className="w-12 h-12 bb-stepper-btn flex items-center justify-center text-lg"
              title="Decrease Length"
            >
              <Minus className="w-5 h-5 stroke-[3]" />
            </button>
            <div className="w-14 h-12 bg-amber-50 rounded-xl border-2 border-amber-400 flex items-center justify-center shadow-inner">
              <span className="text-2xl font-black text-slate-950 font-mono">{build.length}m</span>
            </div>
            <button
              onClick={() => adjustDimension(teamId, 'length', 1)}
              disabled={isLocked || build.length >= 12}
              className="w-12 h-12 bb-stepper-btn flex items-center justify-center text-lg"
              title="Increase Length"
            >
              <Plus className="w-5 h-5 stroke-[3]" />
            </button>
          </div>
        </div>

        {/* WIDTH DIAL */}
        <div className="bg-white p-2 rounded-xl border-2 border-slate-300 shadow-sm flex items-center justify-between">
          <div className="flex flex-col pl-1">
            <span className="text-xs font-black text-slate-900 uppercase tracking-wide">
              WIDTH (W)
            </span>
            <span className="text-[10px] font-bold text-slate-500">Rows</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => adjustDimension(teamId, 'width', -1)}
              disabled={isLocked || build.width <= 1}
              className="w-12 h-12 bb-stepper-btn flex items-center justify-center text-lg"
              title="Decrease Width"
            >
              <Minus className="w-5 h-5 stroke-[3]" />
            </button>
            <div className="w-14 h-12 bg-amber-50 rounded-xl border-2 border-amber-400 flex items-center justify-center shadow-inner">
              <span className="text-2xl font-black text-slate-950 font-mono">{build.width}m</span>
            </div>
            <button
              onClick={() => adjustDimension(teamId, 'width', 1)}
              disabled={isLocked || build.width >= 12}
              className="w-12 h-12 bb-stepper-btn flex items-center justify-center text-lg"
              title="Increase Width"
            >
              <Plus className="w-5 h-5 stroke-[3]" />
            </button>
          </div>
        </div>

        {/* HEIGHT LEVER */}
        {showHeight && (
          <div className="bg-white p-2 rounded-xl border-2 border-slate-300 shadow-sm flex items-center justify-between">
            <div className="flex flex-col pl-1">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wide">
                HEIGHT (H)
              </span>
              <span className="text-[10px] font-bold text-slate-500">Layers</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => adjustDimension(teamId, 'height', -1)}
                disabled={isLocked || build.height <= 1}
                className="w-12 h-12 bb-stepper-btn flex items-center justify-center text-lg"
                title="Decrease Height"
              >
                <Minus className="w-5 h-5 stroke-[3]" />
              </button>
              <div className="w-14 h-12 bg-cyan-50 rounded-xl border-2 border-cyan-400 flex items-center justify-center shadow-inner">
                <span className="text-2xl font-black text-slate-950 font-mono">{build.height}m</span>
              </div>
              <button
                onClick={() => adjustDimension(teamId, 'height', 1)}
                disabled={isLocked || build.height >= 10}
                className="w-12 h-12 bb-stepper-btn flex items-center justify-center text-lg"
                title="Increase Height"
              >
                <Plus className="w-5 h-5 stroke-[3]" />
              </button>
            </div>
          </div>
        )}

        {/* MODIFY BLOCKS STEPPER */}
        {showBlocks && (
          <div className="bg-white p-2 rounded-xl border-2 border-slate-300 shadow-sm flex items-center justify-between">
            <div className="flex flex-col pl-1">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wide">
                BLOCKS
              </span>
              <span className="text-[10px] font-bold text-slate-500">Add / Del</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => adjustBlocks(teamId, -1)}
                disabled={isLocked || build.blocks <= 1}
                className="w-12 h-12 bb-stepper-btn flex items-center justify-center text-lg"
              >
                <Minus className="w-5 h-5 stroke-[3]" />
              </button>
              <div className="w-14 h-12 bg-emerald-50 rounded-xl border-2 border-emerald-400 flex items-center justify-center shadow-inner">
                <span className="text-2xl font-black text-slate-950 font-mono">{build.blocks}</span>
              </div>
              <button
                onClick={() => adjustBlocks(teamId, 1)}
                disabled={isLocked || build.blocks >= 64}
                className="w-12 h-12 bb-stepper-btn flex items-center justify-center text-lg"
              >
                <Plus className="w-5 h-5 stroke-[3]" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── CRANE D-PAD & WINCH CONTROLS (When active) ── */}
      {showCrane && (
        <div className="bg-amber-50 p-2 rounded-xl border-2 border-amber-400 shadow-sm flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[10px] font-black text-amber-900">
            <span>🏗️ TOWER CRANE RIG</span>
          </div>
          <div className="grid grid-cols-3 gap-1">
            <button
              onClick={() => operateCrane(teamId, 'rotate_left')}
              className="py-1.5 bg-white hover:bg-amber-100 active:scale-95 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 border-2 border-slate-800 text-slate-900"
            >
              <RotateCcw className="w-3 h-3" /> ROT L
            </button>
            <button
              onClick={() => operateCrane(teamId, 'up')}
              className="py-1.5 bg-white hover:bg-amber-100 active:scale-95 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 border-2 border-slate-800 text-slate-900"
            >
              <ArrowUp className="w-3 h-3" /> HOIST
            </button>
            <button
              onClick={() => operateCrane(teamId, 'rotate_right')}
              className="py-1.5 bg-white hover:bg-amber-100 active:scale-95 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 border-2 border-slate-800 text-slate-900"
            >
              <RotateCw className="w-3 h-3" /> ROT R
            </button>
            <button
              onClick={() => operateCrane(teamId, 'move_back')}
              className="py-1.5 bg-white hover:bg-amber-100 active:scale-95 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 border-2 border-slate-800 text-slate-900"
            >
              ← BACK
            </button>
            <button
              onClick={() => operateCrane(teamId, 'down')}
              className="py-1.5 bg-white hover:bg-amber-100 active:scale-95 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 border-2 border-slate-800 text-slate-900"
            >
              <ArrowDown className="w-3 h-3" /> LOWER
            </button>
            <button
              onClick={() => operateCrane(teamId, 'grab_release')}
              className={`py-1.5 rounded-lg text-[10px] font-black flex items-center justify-center gap-1 border-2 border-slate-950 shadow-md ${
                build.craneHolding
                  ? 'bg-amber-400 text-slate-950 font-black'
                  : 'bg-emerald-500 text-white font-black'
              }`}
            >
              {build.craneHolding ? 'RELEASE' : 'GRAB'}
            </button>
          </div>
        </div>
      )}

      {/* ── ANSWER STATUS BANNER (GREEN IF RIGHT, RED/AMBER IF WRONG) ── */}
      {scanResult && (
        <div
          className={`p-2.5 rounded-xl border-2 flex items-start gap-2 shadow-md ${
            isCorrect
              ? 'bg-emerald-600 border-emerald-800 text-white animate-pulse'
              : teamState.attemptsLeft === 1
                ? 'bg-red-600 border-red-800 text-white'
                : 'bg-red-700 border-red-900 text-white'
          }`}
        >
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
            {isCorrect ? (
              <CheckCircle2 className="w-4 h-4 text-white stroke-[3]" />
            ) : (
              <span className="text-white text-xs font-black">✕</span>
            )}
          </div>
          <div className="flex flex-col text-left leading-tight">
            <span className="text-xs font-black uppercase tracking-wider">
              {isCorrect
                ? '✓ CORRECT! APPROVED'
                : teamState.attemptsLeft === 1
                  ? '✕ CHANCE 1 MISMATCH (1 TRY LEFT)'
                  : '✕ 2 CHANCES EXHAUSTED'}
            </span>
            <span className="text-[10px] text-white/95 font-medium mt-0.5">
              {isCorrect
                ? `+${scanResult.scoreBreakdown.total} PTS AWARDED!`
                : `${scanResult.diffMessage} (Adjust and retry below)`}
            </span>
          </div>
        </div>
      )}

      {/* ── 2-CHANCE SUBMIT BUTTON ── */}
      <button
        onClick={() => submitBuild(teamId)}
        disabled={isLocked || isConfirmed}
        className={`w-full py-3.5 rounded-xl font-black text-sm sm:text-base tracking-wider uppercase flex items-center justify-center gap-2 ${
          isCorrect
            ? 'bg-emerald-600 hover:bg-emerald-500 text-white ring-2 ring-emerald-300'
            : isWrong && teamState.attemptsLeft === 1
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 ring-2 ring-amber-300 shadow-lg'
              : isWrong
                ? 'bg-red-600 hover:bg-red-500 text-white ring-2 ring-red-300'
                : testSwitchClass
        } disabled:opacity-50 disabled:cursor-not-allowed transition-all`}
      >
        {isConfirmed ? (
          <>
            <CheckCircle2 className="w-5 h-5 text-emerald-300" />
            <span>✓ BUILD CONFIRMED</span>
          </>
        ) : teamState.attemptsLeft === 1 && !isCorrect ? (
          <>
            <RotateCcw className="w-5 h-5 stroke-[2.5]" />
            <span>REVISE & TEST (FINAL CHANCE #2)</span>
          </>
        ) : teamState.attemptsLeft === 0 && !isCorrect ? (
          <>
            <span>✕ 2 CHANCES EXHAUSTED</span>
          </>
        ) : (
          <>
            <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
            <span>LOCK & TEST (CHANCE 1 OF 2)</span>
          </>
        )}
      </button>

      {/* ── BOTTOM BOLTS ── */}
      <div className="flex items-center justify-between px-1">
        <div className="bb-bolt" />
        <div className="bb-bolt" />
      </div>
    </div>
  );
};
