// ============================================================
// BLUEPRINT BLITZ — Scanner Diagnostic & Learning Card
// Signature mathematical post-scan evaluation modal:
// - Direct side-by-side diagnostic cards for Blue and Red
// - Formula explanation & learning tip
// - Transparent Score Breakdown: Base + Speed + Precision
// - Second Chance "MODIFY BUILD" Recovery Action
// ============================================================

import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Award,
  Zap,
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

  const renderTeamResult = (teamId: TeamId) => {
    const team = teamId === 'blue' ? blueTeam : redTeam;
    const res = team.scanResult;
    if (!res) return null;

    const isBlue = teamId === 'blue';
    const isCorrect = res.isCorrect;

    return (
      <div
        className={`flex-1 flex flex-col gap-3 p-5 rounded-2xl border-4 ${
          isCorrect
            ? 'bg-slate-900 border-emerald-500 shadow-emerald-500/20 shadow-2xl'
            : 'bg-slate-900 border-amber-500 shadow-amber-500/20 shadow-2xl'
        } text-slate-100`}
      >
        {/* Team & Approval Header */}
        <div className="flex items-center justify-between border-b border-slate-700 pb-3">
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-lg text-xs font-black uppercase ${
                isBlue ? 'bg-blue-600 text-white' : 'bg-red-600 text-white'
              }`}
            >
              {team.name}
            </span>
            <span
              className={`font-black text-sm ${
                isCorrect ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {res.statusMessage}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-amber-300 font-black text-base">
            <Award className="w-5 h-5" />
            <span>+{res.scoreBreakdown.total} PTS</span>
          </div>
        </div>

        {/* Measured Specs Grid */}
        <div className="grid grid-cols-2 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-slate-400 uppercase">
              YOUR BUILD
            </span>
            <span className="text-xl font-black text-white">
              {activeChallenge.category === 'volume'
                ? `${res.measuredVolume} m³`
                : `${res.measuredArea} m²`}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {res.measuredLength} × {res.measuredWidth}
              {activeChallenge.category === 'volume' ? ` × ${res.measuredHeight}` : ''}
            </span>
          </div>

          <div className="flex flex-col border-l border-slate-800 pl-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase">
              TARGET REQUIREMENT
            </span>
            <span className="text-sm font-black text-amber-300">
              {res.targetDescription}
            </span>
          </div>
        </div>

        {/* Formula & Diagnostic Message */}
        <div
          className={`p-3 rounded-xl border ${
            isCorrect
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
              : 'bg-amber-950/40 border-amber-500/40 text-amber-200'
          }`}
        >
          <div className="text-xs font-mono font-bold mb-1">
            📐 {res.formula}
          </div>
          <div className="text-xs font-medium">
            {isCorrect ? '✓ Exact specification match!' : res.diffMessage}
          </div>
        </div>

        {/* Score Breakdown (if correct) */}
        {isCorrect ? (
          <div className="grid grid-cols-3 gap-1 bg-slate-950/60 p-2 rounded-lg text-center text-[11px] text-slate-300 font-bold">
            <div>Base: +{res.scoreBreakdown.base}</div>
            <div>Speed: +{res.scoreBreakdown.speed}</div>
            <div>Precision: +{res.scoreBreakdown.precision}</div>
          </div>
        ) : (
          /* Second Chance Retry Button */
          <button
            onClick={() => allowSecondChance(teamId)}
            className="mt-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>MODIFY & RE-SCAN (+25s)</span>
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-4xl bg-slate-900 border-4 border-amber-400 rounded-3xl p-6 shadow-2xl flex flex-col gap-5">
        {/* Header Title */}
        <div className="flex items-center justify-between border-b-2 border-slate-700 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center text-slate-950 font-black text-xl">
              📐
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-wide">
                MEASUREMENT SCANNER REPORT
              </h2>
              <p className="text-xs text-slate-400">
                Round {currentRound} of {maxRounds} • {activeChallenge.title}
              </p>
            </div>
          </div>

          {/* Next Challenge Action */}
          <button
            onClick={nextRound}
            className="py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-white font-black text-sm uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all"
          >
            <span>{currentRound >= maxRounds ? 'VIEW PODIUM' : 'NEXT ROUND'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Side-by-Side Dual Team Scans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderTeamResult('blue')}
          {renderTeamResult('red')}
        </div>

        {/* Mathematical Learning Note Box */}
        <div className="flex items-start gap-3 p-3.5 bg-blue-950/40 border-2 border-blue-500/40 rounded-2xl text-blue-200">
          <BookOpen className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed">
            <span className="font-bold text-blue-300 uppercase tracking-wide">
              MATH REASONING TIP:{' '}
            </span>
            <span>{activeChallenge.learningTip}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
