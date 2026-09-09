// ============================================================
// BLUEPRINT BLITZ — Physical Construction Workstation Console
// Heavy-duty industrial control console for Blue (LEFT) and Red (RIGHT):
// - Bolted steel casing with hazard safety striping
// - Large mechanical steppers (70-90px touch targets) for L, W, H
// - Material Selection Station (Brick, Concrete, Wood, Tile, Cube)
// - Industrial Area/Volume gauges & Heavy "TEST BUILD" switch
// ============================================================

import React from 'react';
import {
  Plus,
  Minus,
  CheckCircle2,
  Layers,
  RotateCw,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  Hammer,
  Boxes,
  Compass,
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
  } = useBlueprintStore();

  const isBlue = teamId === 'blue';
  const headerBgClass = isBlue ? 'bg-blue-600 text-white' : 'bg-red-600 text-white';
  const workstationClass = isBlue ? 'bb-workstation-blue' : 'bb-workstation-red';
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
      className={`w-full max-w-[340px] flex flex-col gap-2.5 p-3 rounded-2xl ${workstationClass} select-none text-slate-100 z-20`}
    >
      {/* ── TOP BOLTS & HAZARD TRIM ── */}
      <div className="flex items-center justify-between px-1">
        <div className="bb-bolt" />
        <div className="h-1.5 flex-1 mx-3 rounded-full bb-hazard-stripe" />
        <div className="bb-bolt" />
      </div>

      {/* ── CONSOLE WORKSTATION HEADER ── */}
      <div
        className={`flex items-center justify-between px-3 py-2 rounded-xl font-black ${headerBgClass} shadow-md border-2 border-slate-950`}
      >
        <div className="flex items-center gap-2">
          <Hammer className="w-5 h-5 stroke-[2.5]" />
          <span className="text-sm tracking-wider uppercase">{teamName}</span>
        </div>
        <div className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded-lg text-xs font-black flex items-center gap-1 shadow-inner border border-slate-950">
          <span>★</span>
          <span>{score} PTS</span>
        </div>
      </div>

      {/* ── PHYSICAL INDUSTRIAL GAUGES (AREA & VOLUME) ── */}
      <div className="grid grid-cols-2 gap-2 bg-slate-950 p-2 rounded-xl border-2 border-slate-800 shadow-inner">
        <div className="flex flex-col items-center justify-center p-1 bg-slate-900 rounded-lg border border-slate-800">
          <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest flex items-center gap-1">
            <Gauge className="w-3 h-3 text-amber-400" />
            AREA METER
          </span>
          <span className="text-lg font-black text-white">
            {build.length * build.width} m²
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            {build.length} × {build.width}
          </span>
        </div>

        <div className="flex flex-col items-center justify-center p-1 bg-slate-900 rounded-lg border border-slate-800">
          <span className="text-[9px] font-black text-cyan-400 uppercase tracking-widest flex items-center gap-1">
            <Boxes className="w-3 h-3 text-cyan-400" />
            VOLUME METER
          </span>
          <span className="text-lg font-black text-white">
            {build.length * build.width * build.height} m³
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            {build.length * build.width} × {build.height}
          </span>
        </div>
      </div>

      {/* ── MATERIAL PALLET STATION (Touch to Select & Spawn) ── */}
      <div className="bg-slate-950 p-2 rounded-xl border-2 border-slate-800 flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-wider px-1">
          <span>MATERIAL PALLET</span>
          <span className="text-amber-400">ACTIVE: {build.shapeType.toUpperCase()}</span>
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
                    ? 'bg-amber-400/20 border-amber-400 text-amber-300 shadow-md'
                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                }`}
                title={mat.name}
              >
                <span className="text-sm">{mat.icon}</span>
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
        <div className="bg-slate-950 p-1.5 rounded-xl border-2 border-slate-800 flex items-center justify-between">
          <div className="flex flex-col pl-1.5">
            <span className="text-[11px] font-black text-amber-300 uppercase tracking-wide">
              LENGTH (L)
            </span>
            <span className="text-[10px] text-slate-400">Columns</span>
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
            <div className="w-12 h-12 bg-slate-900 rounded-xl border-2 border-amber-400/50 flex items-center justify-center shadow-inner">
              <span className="text-xl font-black text-amber-300">{build.length}m</span>
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
        <div className="bg-slate-950 p-1.5 rounded-xl border-2 border-slate-800 flex items-center justify-between">
          <div className="flex flex-col pl-1.5">
            <span className="text-[11px] font-black text-amber-300 uppercase tracking-wide">
              WIDTH (W)
            </span>
            <span className="text-[10px] text-slate-400">Rows</span>
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
            <div className="w-12 h-12 bg-slate-900 rounded-xl border-2 border-amber-400/50 flex items-center justify-center shadow-inner">
              <span className="text-xl font-black text-amber-300">{build.width}m</span>
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
          <div className="bg-slate-950 p-1.5 rounded-xl border-2 border-slate-800 flex items-center justify-between">
            <div className="flex flex-col pl-1.5">
              <span className="text-[11px] font-black text-cyan-300 uppercase tracking-wide">
                HEIGHT (H)
              </span>
              <span className="text-[10px] text-slate-400">Layers</span>
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
              <div className="w-12 h-12 bg-slate-900 rounded-xl border-2 border-cyan-400/50 flex items-center justify-center shadow-inner">
                <span className="text-xl font-black text-cyan-300">{build.height}m</span>
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
          <div className="bg-slate-950 p-1.5 rounded-xl border-2 border-slate-800 flex items-center justify-between">
            <div className="flex flex-col pl-1.5">
              <span className="text-[11px] font-black text-emerald-300 uppercase tracking-wide">
                BLOCKS
              </span>
              <span className="text-[10px] text-slate-400">Add / Del</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => adjustBlocks(teamId, -1)}
                disabled={isLocked || build.blocks <= 1}
                className="w-12 h-12 bb-stepper-btn flex items-center justify-center text-lg"
              >
                <Minus className="w-5 h-5 stroke-[3]" />
              </button>
              <div className="w-12 h-12 bg-slate-900 rounded-xl border-2 border-emerald-400/50 flex items-center justify-center shadow-inner">
                <span className="text-xl font-black text-emerald-300">{build.blocks}</span>
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
        <div className="bg-slate-950 p-2 rounded-xl border-2 border-amber-500/50 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[10px] font-black text-amber-400">
            <span>🏗️ TOWER CRANE RIG</span>
            <button
              onClick={() => setCameraFocus(isBlue ? 'blue' : 'red')}
              className="text-[9px] underline text-slate-300 hover:text-white"
            >
              Focus Site
            </button>
          </div>
          <div className="grid grid-cols-3 gap-1">
            <button
              onClick={() => operateCrane(teamId, 'rotate_left')}
              className="py-1.5 bg-slate-800 hover:bg-slate-700 active:scale-95 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 border border-slate-700 text-white"
            >
              <RotateCcw className="w-3 h-3" /> ROT L
            </button>
            <button
              onClick={() => operateCrane(teamId, 'up')}
              className="py-1.5 bg-slate-800 hover:bg-slate-700 active:scale-95 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 border border-slate-700 text-white"
            >
              <ArrowUp className="w-3 h-3" /> HOIST
            </button>
            <button
              onClick={() => operateCrane(teamId, 'rotate_right')}
              className="py-1.5 bg-slate-800 hover:bg-slate-700 active:scale-95 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 border border-slate-700 text-white"
            >
              <RotateCw className="w-3 h-3" /> ROT R
            </button>
            <button
              onClick={() => operateCrane(teamId, 'move_back')}
              className="py-1.5 bg-slate-800 hover:bg-slate-700 active:scale-95 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 border border-slate-700 text-white"
            >
              ← BACK
            </button>
            <button
              onClick={() => operateCrane(teamId, 'down')}
              className="py-1.5 bg-slate-800 hover:bg-slate-700 active:scale-95 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 border border-slate-700 text-white"
            >
              <ArrowDown className="w-3 h-3" /> LOWER
            </button>
            <button
              onClick={() => operateCrane(teamId, 'grab_release')}
              className={`py-1.5 rounded-lg text-[10px] font-black flex items-center justify-center gap-1 shadow-md ${
                build.craneHolding
                  ? 'bg-amber-400 text-slate-950 font-black'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              {build.craneHolding ? 'RELEASE' : 'GRAB'}
            </button>
          </div>
        </div>
      )}

      {/* ── HEAVY INDUSTRIAL "TEST BUILD" SWITCH BUTTON ── */}
      <button
        onClick={() => submitBuild(teamId)}
        disabled={isLocked || isConfirmed}
        className={`w-full py-3.5 rounded-xl font-black text-base tracking-wider uppercase flex items-center justify-center gap-2 ${testSwitchClass} disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isConfirmed ? (
          <>
            <CheckCircle2 className="w-5 h-5 text-emerald-300" />
            <span>BUILD CONFIRMED</span>
          </>
        ) : (
          <>
            <CheckCircle2 className="w-5 h-5" />
            <span>LOCK & TEST BUILD</span>
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
