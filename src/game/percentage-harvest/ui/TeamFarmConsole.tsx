// ============================================================
// PERCENTAGE HARVEST — TEAM FARM CONTROL STATIONS (LEFT & RIGHT)
// Light Clean Aesthetic, No Scrollbars, Compact Viewport Ergonomics
// ============================================================

import React from 'react';
import {
  Wheat,
  Coins,
  TrendingUp,
  Grid3X3,
  Truck,
  Check,
  Sprout,
  CheckCircle2,
  XCircle,
  ArrowRight,
} from 'lucide-react';
import { useFarmStore } from '../store/farmStore';
import { TeamId } from '../types';
import { PercentageWorkspace } from './PercentageWorkspace';
import { formatCurrency, formatWeight, CROP_CATALOG } from '../engine/percentageMath';
import { farmAudio } from '../engine/farmAudio';

interface TeamFarmConsoleProps {
  teamId: TeamId;
}

export const TeamFarmConsole: React.FC<TeamFarmConsoleProps> = ({ teamId }) => {
  const team = useFarmStore((s) => s[teamId]);
  const submitAnswer = useFarmStore((s) => s.submitAnswer);
  const nextQuestion = useFarmStore((s) => s.nextQuestion);
  const selectAnswer = useFarmStore((s) => s.selectAnswer);

  const matchQuestionCount = useFarmStore((s) => s.matchQuestionCount);
  const q = team.currentQuestion;
  if (!q) return null;

  const isBlue = teamId === 'blue';
  const cropCfg = CROP_CATALOG[q.cropType];
  const stageIdx = Math.min(5, Math.floor(((team.currentRound - 1) / matchQuestionCount) * 5) + 1);

  return (
    <aside className="w-[330px] sm:w-[370px] md:w-[420px] lg:w-[460px] xl:w-[500px] 2xl:w-[540px] max-w-full max-h-[calc(100vh-130px)] overflow-y-auto flex flex-col gap-2.5 sm:gap-3 select-none pointer-events-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {/* ─────────────────────────────────────────────────────────────
          1. TOP MINI CARD: LIGHT-COLORED FARM STATUS
          ───────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl p-3 sm:p-3.5 md:p-4 bg-white/95 dark:bg-white/95 shadow-md backdrop-blur-md border-2 border-slate-200 text-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 sm:pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2 min-w-0">
            <div className={`p-1.5 sm:p-2 rounded-xl shrink-0 ${isBlue ? 'bg-blue-600 text-white' : 'bg-red-600 text-white'}`}>
              <Sprout className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className={`text-xs sm:text-sm md:text-base font-black uppercase tracking-wider truncate ${isBlue ? 'text-blue-700' : 'text-red-700'}`}>
              {isBlue ? 'BLUE FARM' : 'RED FARM'}
            </span>
          </div>
          <span className="text-[11px] sm:text-xs md:text-sm font-bold uppercase tracking-wider text-slate-400 shrink-0">
            Farm Status
          </span>
        </div>

        {/* 6 Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 sm:gap-2.5 pt-2 sm:pt-2.5 text-xs sm:text-sm">
          {/* Crops Harvested */}
          <div className="flex items-center justify-between gap-1 p-2 sm:p-2.5 md:p-3 rounded-xl bg-slate-50 border border-slate-200/80 min-w-0 overflow-hidden shadow-2xs">
            <div className="flex items-center gap-1.5 min-w-0 truncate">
              <Wheat className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0 text-amber-500" />
              <span className="truncate text-slate-600 font-bold text-xs sm:text-[13px]">Harvested</span>
            </div>
            <span className="font-mono font-black text-slate-800 shrink-0 whitespace-nowrap pl-1 text-xs sm:text-sm md:text-base">
              {formatWeight(team.totalHarvestKg)}
            </span>
          </div>

          {/* Revenue */}
          <div className="flex items-center justify-between gap-1 p-2 sm:p-2.5 md:p-3 rounded-xl bg-slate-50 border border-slate-200/80 min-w-0 overflow-hidden shadow-2xs">
            <div className="flex items-center gap-1.5 min-w-0 truncate">
              <Coins className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0 text-amber-500" />
              <span className="truncate text-slate-600 font-bold text-xs sm:text-[13px]">Revenue</span>
            </div>
            <span className="font-mono font-black text-amber-600 shrink-0 whitespace-nowrap pl-1 text-xs sm:text-sm md:text-base">
              {formatCurrency(team.totalRevenue)}
            </span>
          </div>

          {/* Profit */}
          <div className="flex items-center justify-between gap-1 p-2 sm:p-2.5 md:p-3 rounded-xl bg-slate-50 border border-slate-200/80 min-w-0 overflow-hidden shadow-2xs">
            <div className="flex items-center gap-1.5 min-w-0 truncate">
              <TrendingUp className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0 text-emerald-500" />
              <span className="truncate text-slate-600 font-bold text-xs sm:text-[13px]">Profit</span>
            </div>
            <span className="font-mono font-black text-emerald-600 shrink-0 whitespace-nowrap pl-1 text-xs sm:text-sm md:text-base">
              {formatCurrency(team.totalProfit)}
            </span>
          </div>

          {/* Fields Planted */}
          <div className="flex items-center justify-between gap-1 p-2 sm:p-2.5 md:p-3 rounded-xl bg-slate-50 border border-slate-200/80 min-w-0 overflow-hidden shadow-2xs">
            <div className="flex items-center gap-1.5 min-w-0 truncate">
              <Grid3X3 className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0 text-sky-500" />
              <span className="truncate text-slate-600 font-bold text-xs sm:text-[13px]">Planted</span>
            </div>
            <span className="font-mono font-black text-sky-600 shrink-0 whitespace-nowrap pl-1 text-xs sm:text-sm md:text-base">
              {stageIdx * 20}%
            </span>
          </div>

          {/* Tractors */}
          <div className="flex items-center justify-between gap-1 p-2 sm:p-2.5 md:p-3 rounded-xl bg-slate-50 border border-slate-200/80 min-w-0 overflow-hidden shadow-2xs">
            <div className="flex items-center gap-1.5 min-w-0 truncate">
              <span className="shrink-0 text-sm sm:text-base">🚜</span>
              <span className="truncate text-slate-600 font-bold text-xs sm:text-[13px]">Tractors</span>
            </div>
            <span className="font-mono font-black text-slate-800 shrink-0 whitespace-nowrap pl-1 text-xs sm:text-sm md:text-base">1 / 2</span>
          </div>

          {/* Deliveries */}
          <div className="flex items-center justify-between gap-1 p-2 sm:p-2.5 md:p-3 rounded-xl bg-slate-50 border border-slate-200/80 min-w-0 overflow-hidden shadow-2xs">
            <div className="flex items-center gap-1.5 min-w-0 truncate">
              <Truck className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0 text-purple-500" />
              <span className="truncate text-slate-600 font-bold text-xs sm:text-[13px]">Deliveries</span>
            </div>
            <span className="font-mono font-black text-purple-600 shrink-0 whitespace-nowrap pl-1 text-xs sm:text-sm md:text-base">
              {team.deliveriesCount}/{matchQuestionCount}
            </span>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. BOTTOM MAJOR CARD: LIGHT QUESTION & PERCENTAGE WORKSPACE
          ───────────────────────────────────────────────────────────── */}
      <div className={`rounded-2xl p-3 sm:p-4 md:p-4.5 bg-white/95 dark:bg-white/95 shadow-lg backdrop-blur-md border-2 flex flex-col gap-2.5 sm:gap-3 ${
        isBlue ? 'border-blue-300' : 'border-red-300'
      }`}>
        {/* Banner Header */}
        <div
          className={`flex items-center justify-between px-3.5 py-2 rounded-xl text-white font-black text-xs sm:text-sm md:text-base uppercase tracking-wider ${
            isBlue ? 'bg-blue-600' : 'bg-red-600'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0 truncate">
            <Wheat className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            <span className="truncate">{isBlue ? 'BLUE FARM' : 'RED FARM'} — Question {team.currentRound}/{matchQuestionCount}</span>
          </div>
        </div>

        {/* ── QUESTION PROMPT & SCENARIO CARD ── */}
        <div className="p-3 sm:p-3.5 md:p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 shadow-2xs">
          <div className="text-xs sm:text-sm md:text-[14px] font-bold text-slate-500 leading-snug">
            {q.scenario}
          </div>
          <div className="text-base sm:text-lg md:text-xl 2xl:text-[22px] font-black text-slate-900 leading-snug tracking-tight mt-1.5">
            {q.prompt}
          </div>
        </div>

        {/* ── 100-CELL PERCENTAGE WORKSPACE (COMPACT & LIGHT) ── */}
        <PercentageWorkspace teamId={teamId} />

        {/* ── ANSWER & ACTION BUTTON ── */}
        <div className="flex flex-col gap-2.5">
          {/* Multiple choice options selector (always available for easy clicking) */}
          {q.options && q.options.length > 0 && (
            <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
              {q.options.map((opt, idx) => {
                const isSelected = String(team.selectedAnswer) === String(opt);
                return (
                  <button
                    key={`opt-btn-${idx}`}
                    type="button"
                    disabled={team.hasAnsweredCurrent}
                    onClick={() => {
                      farmAudio.unlock();
                      farmAudio.playGridPop();
                      selectAnswer(teamId, opt);
                    }}
                    className={`py-2 sm:py-2.5 md:py-3 rounded-xl text-sm sm:text-base md:text-lg font-black transition-all cursor-pointer ${
                      isSelected
                        ? isBlue
                          ? 'bg-blue-600 text-white shadow-md scale-102 ring-2 ring-blue-300'
                          : 'bg-red-600 text-white shadow-md scale-102 ring-2 ring-red-300'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 shadow-2xs'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          )}

          {/* Large Input Display + Action Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 rounded-xl bg-slate-100 border border-slate-300 text-center font-mono font-black text-lg sm:text-xl md:text-2xl text-slate-900 shadow-inner">
              {team.selectedAnswer !== null && team.selectedAnswer !== undefined
                ? `${team.selectedAnswer} ${q.unit && q.mode !== 'grid100' ? q.unit : ''}`
                : '—'}
            </div>

            {!team.hasAnsweredCurrent ? (
              <button
                type="button"
                disabled={team.selectedAnswer === null && team.selectedCells.filter(Boolean).length === 0}
                onClick={() => {
                  farmAudio.unlock();
                  submitAnswer(teamId);
                }}
                className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-black text-xs sm:text-sm md:text-base uppercase tracking-wider shadow-md active:scale-95 transition cursor-pointer ${
                  team.selectedAnswer !== null || team.selectedCells.filter(Boolean).length > 0
                    ? 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-white shadow-emerald-500/30'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" />
                <span>
                  {stageIdx === 1
                    ? 'SOW ROWS'
                    : stageIdx === 2
                    ? 'SPREAD MANURE'
                    : stageIdx === 3
                    ? 'INSPECT GROWTH'
                    : stageIdx === 4
                    ? 'SPRAY PESTICIDE'
                    : 'HARVEST & SELL'}
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  farmAudio.unlock();
                  farmAudio.playGridPop();
                  nextQuestion(teamId);
                }}
                className={`flex items-center justify-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3 rounded-xl font-black text-xs sm:text-sm md:text-base uppercase tracking-wider text-white shadow-md active:scale-95 transition cursor-pointer ${
                  isBlue ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/30' : 'bg-red-600 hover:bg-red-500 shadow-red-500/30'
                }`}
              >
                <span>NEXT</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}
          </div>

          {/* Feedback Message */}
          {team.hasAnsweredCurrent && (
            <div
              className={`p-2.5 sm:p-3 rounded-xl text-xs sm:text-sm md:text-base font-bold flex items-center gap-2.5 ${
                team.isCurrentCorrect
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {team.isCurrentCorrect ? (
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
              ) : (
                <XCircle className="w-5 h-5 shrink-0 text-rose-600" />
              )}
              <span className="leading-snug">{team.feedbackMessage}</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
