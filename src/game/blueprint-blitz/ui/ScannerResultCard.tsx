// ============================================================
// BLUEPRINT BLITZ — Physical Site Inspection Board Component
// Authentic heavy-duty metal inspection clipboard featuring:
// - Physical casing with bolts, status indicator lamps & rivets
// - Stamped "APPROVED" (Green) or "REVISION REQUIRED" (Amber) metal plates
// - Exact diagnostic readout: Length, Width, Height, Area, Volume
// - Required adjustment delta calculation and recovery action
// ============================================================

import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Award,
  HardHat,
  Ruler,
  Stamp,
} from 'lucide-react';
import { useBlueprintStore } from '../store/blueprintStore';
import { TeamId } from '../types';

export const ScannerResultCard: React.FC = () => {
  const {
    activeChallenge,
    blueTeam,
    redTeam,
    allowSecondChance,
    nextRound,
    currentRound,
    maxRounds,
  } = useBlueprintStore();

  if (!activeChallenge || (!blueTeam.scanResult && !redTeam.scanResult)) {
    return null;
  }

  const renderTeamInspection = (teamId: TeamId) => {
    const team = teamId === 'blue' ? blueTeam : redTeam;
    const res = team.scanResult;
    if (!res) return null;

    const isBlue = teamId === 'blue';
    const isCorrect = res.isCorrect;

    return (
      <div
        className={`flex-1 flex flex-col gap-3 p-4 rounded-2xl border-4 ${
          isCorrect
            ? 'bg-slate-900 border-emerald-500 shadow-emerald-500/20 shadow-2xl'
            : 'bg-slate-900 border-amber-500 shadow-amber-500/20 shadow-2xl'
        } text-slate-100 select-none relative`}
      >
        {/* Top Rivets & Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase border border-slate-950 ${
                isBlue ? 'bg-blue-600 text-white' : 'bg-red-600 text-white'
              }`}
            >
              {team.name}
            </span>
            <div className="flex items-center gap-1.5">
              <span
                className={`w-3 h-3 rounded-full border border-slate-950 ${
                  isCorrect ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              <span
                className={`font-black text-xs sm:text-sm uppercase tracking-wider ${
                  isCorrect ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {isCorrect ? 'INSPECTION PASSED' : 'BUILD NEEDS ADJUSTMENT'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-amber-300 font-black text-sm">
            <Award className="w-4 h-4" />
            <span>+{res.scoreBreakdown.total} PTS</span>
          </div>
        </div>

        {/* Physical Inspection Grid Data */}
        <div className="bg-slate-950 p-3 rounded-xl border-2 border-slate-800 flex flex-col gap-2">
          <div className="grid grid-cols-3 gap-2 text-center border-b border-slate-800 pb-2">
            <div>
              <span className="text-[9px] font-black text-slate-400 uppercase block">LENGTH</span>
              <span className="text-base font-black text-white font-mono">{res.measuredLength} m</span>
            </div>
            <div>
              <span className="text-[9px] font-black text-slate-400 uppercase block">WIDTH</span>
              <span className="text-base font-black text-white font-mono">{res.measuredWidth} m</span>
            </div>
            <div>
              <span className="text-[9px] font-black text-slate-400 uppercase block">HEIGHT</span>
              <span className="text-base font-black text-white font-mono">{res.measuredHeight} m</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-0.5">
            <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 text-center">
              <span className="text-[9px] font-black text-amber-400 uppercase block">CURRENT AREA</span>
              <span className="text-lg font-black text-amber-300 font-mono">{res.measuredArea} m²</span>
            </div>
            <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 text-center">
              <span className="text-[9px] font-black text-cyan-400 uppercase block">CURRENT VOLUME</span>
              <span className="text-lg font-black text-cyan-300 font-mono">{res.measuredVolume} m³</span>
            </div>
          </div>
        </div>

        {/* Stamped Status & Adjustment Required Banner */}
        <div
          className={`p-2.5 rounded-xl border-2 flex items-start gap-2 ${
            isCorrect
              ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200'
              : 'bg-amber-950/60 border-amber-500/60 text-amber-200'
          }`}
        >
          {isCorrect ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          )}
          <div className="flex flex-col text-xs leading-tight">
            <span className="font-black uppercase tracking-wider">
              {isCorrect ? 'STAMP: APPROVED ✓' : 'STAMP: REVISION REQUIRED ⚠️'}
            </span>
            <span className="text-[11px] mt-0.5">
              {isCorrect ? 'Satisfies all architectural blueprint specifications.' : res.diffMessage}
            </span>
          </div>
        </div>

        {/* Score Breakdown or Second Chance Recovery */}
        {isCorrect ? (
          <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1.5 rounded-lg text-center text-[10px] text-slate-300 font-bold border border-slate-800">
            <div>Base: +{res.scoreBreakdown.base}</div>
            <div>Speed: +{res.scoreBreakdown.speed}</div>
            <div>Precision: +{res.scoreBreakdown.precision}</div>
          </div>
        ) : (
          <button
            onClick={() => allowSecondChance(teamId)}
            className="py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all border-2 border-slate-950"
          >
            <RotateCcw className="w-4 h-4 stroke-[3]" />
            <span>MODIFY STRUCTURE (+25s BONUS TIME)</span>
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-4xl bg-slate-900 border-4 border-amber-400 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col gap-4">
        {/* Header Title */}
        <div className="flex items-center justify-between border-b-2 border-slate-700 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center text-slate-950 font-black text-xl border-2 border-slate-950">
              <Ruler className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-wide flex items-center gap-2">
                <span>SITE INSPECTION REPORT</span>
                <span className="text-xs px-2 py-0.5 rounded bg-blue-900 text-blue-200 border border-blue-600 font-mono">
                  {activeChallenge.code}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Project {currentRound} of {maxRounds} • {activeChallenge.title}
              </p>
            </div>
          </div>

          {/* Next Project Action Button */}
          <button
            onClick={nextRound}
            className="py-2.5 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-white font-black text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all border-2 border-slate-950"
          >
            <span>{currentRound >= maxRounds ? 'FINAL PODIUM' : 'NEXT PROJECT'}</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* Side-by-Side Dual Team Inspection Boards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderTeamInspection('blue')}
          {renderTeamInspection('red')}
        </div>

        {/* Mathematical Reasoning & Learning Tip Footer */}
        <div className="flex items-start gap-3 p-3 bg-slate-950 border-2 border-amber-400/50 rounded-xl text-slate-200">
          <BookOpen className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed">
            <span className="font-black text-amber-300 uppercase tracking-wide">
              MATHEMATICAL REASONING:{' '}
            </span>
            <span>{activeChallenge.learningTip}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
