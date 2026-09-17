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
    <aside className="w-[290px] sm:w-[320px] md:w-[340px] xl:w-[355px] max-w-full flex flex-col gap-2 overflow-hidden select-none pointer-events-auto">
      {/* ─────────────────────────────────────────────────────────────
          1. TOP MINI CARD: LIGHT-COLORED FARM STATUS
          ───────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl p-2.5 bg-white/95 dark:bg-white/95 shadow-md backdrop-blur-md border-2 border-slate-200 text-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className={`p-1 rounded-lg shrink-0 ${isBlue ? 'bg-blue-600 text-white' : 'bg-red-600 text-white'}`}>
              <Sprout className="w-3.5 h-3.5" />
            </div>
            <span className={`text-xs font-black uppercase tracking-wider truncate ${isBlue ? 'text-blue-700' : 'text-red-700'}`}>
              {isBlue ? 'BLUE FARM' : 'RED FARM'}
            </span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
            Farm Status
          </span>
        </div>

        {/* 6 Metrics Grid */}
        <div className="grid grid-cols-2 gap-1.5 pt-1.5 text-[10.5px]">
          {/* Crops Harvested */}
          <div className="flex items-center justify-between gap-1 p-1.5 rounded-xl bg-slate-50 border border-slate-200/80 min-w-0 overflow-hidden shadow-2xs">
            <div className="flex items-center gap-1 min-w-0 truncate">
              <Wheat className="w-3.5 h-3.5 shrink-0 text-amber-500" />
              <span className="truncate text-slate-600 font-semibold">Harvested</span>
            </div>
            <span className="font-mono font-black text-slate-800 shrink-0 whitespace-nowrap pl-1">
              {formatWeight(team.totalHarvestKg)}
            </span>
          </div>

          {/* Revenue */}
          <div className="flex items-center justify-between gap-1 p-1.5 rounded-xl bg-slate-50 border border-slate-200/80 min-w-0 overflow-hidden shadow-2xs">
            <div className="flex items-center gap-1 min-w-0 truncate">
              <Coins className="w-3.5 h-3.5 shrink-0 text-amber-500" />
              <span className="truncate text-slate-600 font-semibold">Revenue</span>
            </div>
            <span className="font-mono font-black text-amber-600 shrink-0 whitespace-nowrap pl-1">
              {formatCurrency(team.totalRevenue)}
            </span>
          </div>

          {/* Profit */}
          <div className="flex items-center justify-between gap-1 p-1.5 rounded-xl bg-slate-50 border border-slate-200/80 min-w-0 overflow-hidden shadow-2xs">
            <div className="flex items-center gap-1 min-w-0 truncate">
              <TrendingUp className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
              <span className="truncate text-slate-600 font-semibold">Profit</span>
            </div>
            <span className="font-mono font-black text-emerald-600 shrink-0 whitespace-nowrap pl-1">
              {formatCurrency(team.totalProfit)}
            </span>
          </div>

          {/* Fields Planted */}
          <div className="flex items-center justify-between gap-1 p-1.5 rounded-xl bg-slate-50 border border-slate-200/80 min-w-0 overflow-hidden shadow-2xs">
            <div className="flex items-center gap-1 min-w-0 truncate">
              <Grid3X3 className="w-3.5 h-3.5 shrink-0 text-sky-500" />
              <span className="truncate text-slate-600 font-semibold">Planted</span>
            </div>
            <span className="font-mono font-black text-sky-600 shrink-0 whitespace-nowrap pl-1">
              {stageIdx * 20}%
            </span>
          </div>

          {/* Tractors */}
          <div className="flex items-center justify-between gap-1 p-1.5 rounded-xl bg-slate-50 border border-slate-200/80 min-w-0 overflow-hidden shadow-2xs">
            <div className="flex items-center gap-1 min-w-0 truncate">
              <span className="shrink-0 text-xs">🚜</span>
              <span className="truncate text-slate-600 font-semibold">Tractors</span>
            </div>
            <span className="font-mono font-black text-slate-800 shrink-0 whitespace-nowrap pl-1">1 / 2</span>
          </div>

          {/* Deliveries */}
          <div className="flex items-center justify-between gap-1 p-1.5 rounded-xl bg-slate-50 border border-slate-200/80 min-w-0 overflow-hidden shadow-2xs">
            <div className="flex items-center gap-1 min-w-0 truncate">
              <Truck className="w-3.5 h-3.5 shrink-0 text-purple-500" />
              <span className="truncate text-slate-600 font-semibold">Deliveries</span>
            </div>
            <span className="font-mono font-black text-purple-600 shrink-0 whitespace-nowrap pl-1">
              {team.deliveriesCount}/{matchQuestionCount}
            </span>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. BOTTOM MAJOR CARD: LIGHT QUESTION & PERCENTAGE WORKSPACE
          ───────────────────────────────────────────────────────────── */}
      <div className={`rounded-2xl p-2.5 bg-white/95 dark:bg-white/95 shadow-lg backdrop-blur-md border-2 flex flex-col gap-2 ${
        isBlue ? 'border-blue-300' : 'border-red-300'
      }`}>
        {/* Banner Header */}
        <div
          className={`flex items-center justify-between px-2.5 py-1 rounded-xl text-white font-black text-xs uppercase tracking-wider ${
            isBlue ? 'bg-blue-600' : 'bg-red-600'
          }`}
        >
          <div className="flex items-center gap-1.5 min-w-0 truncate">
            <Wheat className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{isBlue ? 'BLUE FARM' : 'RED FARM'} — Question {team.currentRound}/{matchQuestionCount}</span>
          </div>
        </div>

        {/* ── QUESTION PROMPT & SCENARIO CARD ── */}
        <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 shadow-2xs">
          <div className="text-[10px] font-bold text-slate-500 leading-tight">
            {q.scenario}
          </div>
          <div className="text-xs sm:text-[12.5px] font-black text-slate-900 leading-snug tracking-tight mt-0.5">
            {q.prompt}
          </div>
        </div>

        {/* ── 100-CELL PERCENTAGE WORKSPACE (COMPACT & LIGHT) ── */}
        <PercentageWorkspace teamId={teamId} />

        {/* ── ANSWER & ACTION BUTTON ── */}
        <div className="flex flex-col gap-1.5">
          {/* Multiple choice options selector (always available for easy clicking) */}
          {q.options && q.options.length > 0 && (
            <div className="grid grid-cols-4 gap-1">
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
                    className={`py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                      isSelected
                        ? isBlue
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-red-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          )}

          {/* Large Input Display + Action Button */}
          <div className="flex items-center gap-1.5">
            <div className="flex-1 px-2.5 py-1.5 rounded-xl bg-slate-100 border border-slate-300 text-center font-mono font-black text-sm sm:text-base text-slate-900">
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
                className={`flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-sm active:scale-95 transition cursor-pointer ${
                  team.selectedAnswer !== null || team.selectedCells.filter(Boolean).length > 0
                    ? 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-white shadow-emerald-500/30'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>
                  {stageIdx === 1
                    ? 'SOW SEED ROWS'
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
                className={`flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl font-black text-xs uppercase tracking-wider text-white shadow-sm active:scale-95 transition cursor-pointer ${
                  isBlue ? 'bg-blue-600 hover:bg-blue-500' : 'bg-red-600 hover:bg-red-500'
                }`}
              >
                <span>NEXT</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Feedback Message */}
          {team.hasAnsweredCurrent && (
            <div
              className={`p-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 ${
                team.isCurrentCorrect
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {team.isCurrentCorrect ? (
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
              ) : (
                <XCircle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
              )}
              <span className="leading-tight">{team.feedbackMessage}</span>
            </div>
          )}
        </div>

        {/* ── CROP ALLOCATION BREAKDOWN ── */}
        <div className="flex flex-col gap-1 pt-1 border-t border-slate-100">
          <span className="text-[10px] font-bold text-slate-500">
            Crop Allocation:
          </span>

          <div className="grid grid-cols-5 gap-0.5 text-[9px] font-bold">
            <div className="p-0.5 rounded bg-amber-50 border border-amber-200 text-center">
              <div>🌾 Wheat</div>
              <div className="font-mono font-black text-amber-700">
                {q.cropType === 'wheat' ? `${q.targetPercentage}%` : '0%'}
              </div>
            </div>

            <div className="p-0.5 rounded bg-green-50 border border-green-200 text-center">
              <div>🌽 Corn</div>
              <div className="font-mono font-black text-green-700">
                {q.cropType === 'corn' ? `${q.targetPercentage}%` : '0%'}
              </div>
            </div>

            <div className="p-0.5 rounded bg-rose-50 border border-rose-200 text-center">
              <div>🍅 Tomato</div>
              <div className="font-mono font-black text-rose-700">
                {q.cropType === 'tomatoes' ? `${q.targetPercentage}%` : '0%'}
              </div>
            </div>

            <div className="p-0.5 rounded bg-emerald-50 border border-emerald-200 text-center">
              <div>🥦 Veg</div>
              <div className="font-mono font-black text-emerald-700">
                {q.cropType === 'vegetables' ? `${q.targetPercentage}%` : '0%'}
              </div>
            </div>

            <div className="p-0.5 rounded bg-pink-50 border border-pink-200 text-center">
              <div>🌸 Flowers</div>
              <div className="font-mono font-black text-pink-700">
                {q.cropType === 'sunflowers' ? `${q.targetPercentage}%` : '0%'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
