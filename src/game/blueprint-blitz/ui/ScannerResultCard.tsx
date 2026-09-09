// ============================================================
// BLUEPRINT BLITZ — Physical Site Inspection Board Component
// Authentic heavy-duty inspection clipboard featuring:
// - Physical casing with bolts, status indicator lamps & rivets
// - Stamped "APPROVED" (Green) or "REVISION REQUIRED" (Amber) metal plates
// - Exact diagnostic readout: Length, Width, Height, Area, Volume
// - Required adjustment delta calculation and recovery action
// - 100% Sunny Daytime palette — Zero Dark Slate
// ============================================================

import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  Award,
  HardHat,
  Ruler,
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
            ? 'bg-emerald-50 border-emerald-500 shadow-xl'
            : 'bg-amber-50 border-amber-500 shadow-xl'
        } text-slate-950 select-none relative`}
      >
        {/* Top Rivets & Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-300 pb-2">
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase border-2 border-slate-950 ${
                isBlue ? 'bg-blue-600 text-white' : 'bg-red-600 text-white'
              }`}
            >
              {team.name}
            </span>
            <div className="flex items-center gap-1.5">
              <span
                className={`w-3 h-3 rounded-full border border-slate-950 ${
                  isCorrect ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`}
              />
              <span
                className={`font-black text-xs sm:text-sm uppercase tracking-wider ${
                  isCorrect ? 'text-emerald-700' : 'text-amber-800'
                }`}
              >
                {isCorrect ? 'INSPECTION PASSED' : 'BUILD NEEDS ADJUSTMENT'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-amber-700 font-black text-sm">
            <Award className="w-4 h-4" />
            <span>+{res.scoreBreakdown.total} PTS</span>
          </div>
        </div>

        {/* Physical Inspection Grid Data */}
        <div className="bg-white p-3 rounded-xl border-2 border-slate-300 flex flex-col gap-2 shadow-sm">
          <div className="grid grid-cols-3 gap-2 text-center border-b border-slate-200 pb-2">
            <div>
              <span className="text-[9px] font-black text-slate-500 uppercase block">LENGTH</span>
              <span className="text-base font-black text-slate-950 font-mono">{res.measuredLength} m</span>
            </div>
            <div>
              <span className="text-[9px] font-black text-slate-500 uppercase block">WIDTH</span>
              <span className="text-base font-black text-slate-950 font-mono">{res.measuredWidth} m</span>
            </div>
            <div>
              <span className="text-[9px] font-black text-slate-500 uppercase block">HEIGHT</span>
              <span className="text-base font-black text-slate-950 font-mono">{res.measuredHeight} m</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-0.5">
            <div className="bg-amber-50 p-2 rounded-lg border border-amber-300 text-center">
              <span className="text-[9px] font-black text-amber-700 uppercase block">CURRENT AREA</span>
              <span className="text-lg font-black text-slate-950 font-mono">{res.measuredArea} m²</span>
            </div>
            <div className="bg-cyan-50 p-2 rounded-lg border border-cyan-300 text-center">
              <span className="text-[9px] font-black text-cyan-700 uppercase block">CURRENT VOLUME</span>
              <span className="text-lg font-black text-slate-950 font-mono">{res.measuredVolume} m³</span>
            </div>
          </div>
        </div>

        {/* Stamped Status & Adjustment Required Banner */}
        <div
          className={`p-2.5 rounded-xl border-2 flex items-start gap-2 ${
            isCorrect
              ? 'bg-emerald-100 border-emerald-400 text-emerald-900'
              : 'bg-amber-100 border-amber-400 text-amber-950'
          }`}
        >
          {isCorrect ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          )}
          <div className="flex flex-col text-xs leading-tight">
            <span className="font-black uppercase tracking-wider">
              {isCorrect ? 'STAMP: APPROVED ✓' : 'STAMP: REVISION REQUIRED ⚠️'}
            </span>
            <span className="text-[11px] mt-0.5 font-medium">
              {isCorrect ? 'Satisfies all architectural blueprint specifications.' : res.diffMessage}
            </span>
          </div>
        </div>

        {/* Second Chance Recovery Action */}
        {!isCorrect && (
          <button
            onClick={() => allowSecondChance(teamId)}
            className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow border-2 border-slate-950 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>MODIFY & RESUBMIT (RECOVERY)</span>
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm pointer-events-auto select-none">
      <div className="w-full max-w-4xl bg-[#fff8e7] border-4 border-slate-950 rounded-3xl p-6 shadow-2xl flex flex-col gap-5 text-slate-950">
        {/* Inspection Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-300 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center border-2 border-slate-950 shadow">
              <HardHat className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-700 block">
                SITE INSPECTION REPORT
              </span>
              <h2 className="text-xl font-black text-slate-950 tracking-tight">
                PROJECT {currentRound}/{maxRounds}: {activeChallenge.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border-2 border-slate-300 text-xs">
            <Ruler className="w-4 h-4 text-amber-600" />
            <span className="font-bold text-slate-700">TARGET: {activeChallenge.target.description}</span>
          </div>
        </div>

        {/* Dual Team Inspection Panels */}
        <div className="flex flex-col sm:flex-row gap-4">
          {renderTeamInspection('blue')}
          {renderTeamInspection('red')}
        </div>

        {/* Footer Next Project Proceed Button */}
        <div className="flex justify-end pt-2 border-t-2 border-slate-300">
          <button
            onClick={nextRound}
            className="py-3.5 px-8 rounded-2xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black text-base uppercase tracking-wider flex items-center gap-2 shadow-xl transition-all border-3 border-slate-950"
          >
            <span>PROCEED TO NEXT BLUEPRINT</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
