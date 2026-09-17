// ============================================================
// PERCENTAGE HARVEST — CHAMPIONSHIP VICTORY OVERLAY
// Grand Final Harvest Celebration with comparative farm scorecard,
// 5 / 10 / 15 question match restart options, and return to arcade
// ============================================================

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RefreshCw, Home, Sparkles, Zap, Award, Layers } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useFarmStore } from '../store/farmStore';
import { formatCurrency, formatWeight } from '../engine/percentageMath';
import { farmAudio } from '../engine/farmAudio';

export const FarmVictoryOverlay: React.FC = () => {
  const router = useRouter();
  const showVictory = useFarmStore((s) => s.showVictory);
  const winner = useFarmStore((s) => s.winner);
  const winnerSummary = useFarmStore((s) => s.winnerSummary);
  const blue = useFarmStore((s) => s.blue);
  const red = useFarmStore((s) => s.red);
  const matchQuestionCount = useFarmStore((s) => s.matchQuestionCount);
  const setMatchQuestionCount = useFarmStore((s) => s.setMatchQuestionCount);

  useEffect(() => {
    if (showVictory) {
      // Trigger festive confetti explosion
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#22c55e', '#3b82f6', '#ef4444', '#f59e0b', '#a855f7'],
      });
    }
  }, [showVictory]);

  if (!showVictory) return null;

  const isBlueWinner = winner === 'blue';
  const isRedWinner = winner === 'red';

  const handleRestart = (count: 5 | 10 | 15) => {
    farmAudio.unlock();
    farmAudio.playGridPop();
    setMatchQuestionCount(count);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-lg animate-in fade-in duration-300 select-none">
      <div className="relative w-full max-w-3xl max-h-[94vh] flex flex-col rounded-3xl bg-slate-900 border-4 border-amber-400 shadow-2xl text-white overflow-hidden">
        {/* Header Ribbon */}
        <div className="p-4 sm:p-5 text-center bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-slate-950 flex flex-col items-center gap-1 shadow-md">
          <div className="flex items-center gap-2 px-3 py-0.5 rounded-full bg-black/15 text-xs font-black uppercase tracking-widest">
            <Trophy className="w-4 h-4 fill-current" />
            <span>HARVEST CHAMPIONSHIP COMPLETE</span>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight">
            {isBlueWinner ? '🏆 BLUE FARM VICTORIOUS!' : isRedWinner ? '🏆 RED FARM VICTORIOUS!' : '🤝 AGRICULTURAL DUEL TIE!'}
          </h1>
          <p className="text-xs sm:text-sm font-bold text-slate-900 max-w-lg">
            {winnerSummary?.reason}
          </p>
        </div>

        {/* Scorecard Table & Restart Options Container */}
        <div className="flex-1 p-3.5 sm:p-5 overflow-y-auto space-y-3.5">
          {/* Performance Metrics Table */}
          <div className="rounded-2xl border border-white/10 bg-black/40 overflow-hidden">
            <div className="grid grid-cols-3 p-2.5 bg-white/5 border-b border-white/10 text-xs sm:text-sm font-black uppercase text-center">
              <span className="text-blue-400">BLUE FARM</span>
              <span className="text-slate-400">PERFORMANCE METRICS</span>
              <span className="text-red-400">RED FARM</span>
            </div>

            <div className="divide-y divide-white/5 text-xs sm:text-sm">
              {/* Total Revenue */}
              <div className="grid grid-cols-3 p-2.5 text-center font-mono items-center">
                <span className="text-sm sm:text-base md:text-lg font-black text-amber-300">{formatCurrency(blue.totalRevenue)}</span>
                <span className="font-bold text-slate-400 text-[11px] sm:text-xs">Total Revenue (₹)</span>
                <span className="text-sm sm:text-base md:text-lg font-black text-amber-300">{formatCurrency(red.totalRevenue)}</span>
              </div>

              {/* Total Profit */}
              <div className="grid grid-cols-3 p-2.5 text-center font-mono items-center">
                <span className="text-xs sm:text-sm md:text-base font-black text-emerald-400">{formatCurrency(blue.totalProfit)}</span>
                <span className="font-bold text-slate-400 text-[11px] sm:text-xs">Net Farm Profit</span>
                <span className="text-xs sm:text-sm md:text-base font-black text-emerald-400">{formatCurrency(red.totalProfit)}</span>
              </div>

              {/* Harvested Quantity */}
              <div className="grid grid-cols-3 p-2.5 text-center font-mono items-center">
                <span className="font-bold text-slate-200">{formatWeight(blue.totalHarvestKg)}</span>
                <span className="font-bold text-slate-400 text-[11px] sm:text-xs">Usable Harvest</span>
                <span className="font-bold text-slate-200">{formatWeight(red.totalHarvestKg)}</span>
              </div>

              {/* Calculation Accuracy */}
              <div className="grid grid-cols-3 p-2.5 text-center font-mono items-center">
                <span className="font-bold text-sky-300">{blue.accuracy}% ({blue.correctAnswersCount}/{matchQuestionCount})</span>
                <span className="font-bold text-slate-400 text-[11px] sm:text-xs">Percentage Accuracy</span>
                <span className="font-bold text-sky-300">{red.accuracy}% ({red.correctAnswersCount}/{matchQuestionCount})</span>
              </div>

              {/* Crop Waste */}
              <div className="grid grid-cols-3 p-2.5 text-center font-mono items-center">
                <span className="font-bold text-rose-300">{blue.wasteKg} kg lost</span>
                <span className="font-bold text-slate-400 text-[11px] sm:text-xs">Miscalculation Waste</span>
                <span className="font-bold text-rose-300">{red.wasteKg} kg lost</span>
              </div>

              {/* Deliveries */}
              <div className="grid grid-cols-3 p-2.5 text-center font-mono items-center">
                <span className="font-bold text-purple-300">{blue.deliveriesCount} market trips</span>
                <span className="font-bold text-slate-400 text-[11px] sm:text-xs">Completed Logistics</span>
                <span className="font-bold text-purple-300">{red.deliveriesCount} market trips</span>
              </div>
            </div>
          </div>

          {/* ── CHOOSE ACTIVITY RESTART LENGTH (5, 10, 15 QUESTIONS) ── */}
          <div className="flex flex-col gap-2 p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black uppercase tracking-wider text-amber-400">
              <Sparkles className="w-4 h-4" />
              <span>PLAY AGAIN — CHOOSE MATCH LENGTH:</span>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {/* 5 Questions */}
              <button
                type="button"
                onClick={() => handleRestart(5)}
                className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 border-2 border-blue-400/50 shadow-md active:scale-95 transition cursor-pointer group"
              >
                <div className="flex items-center gap-1 text-amber-300 text-xs sm:text-sm font-black uppercase">
                  <Zap className="w-3.5 h-3.5" />
                  <span>5 Questions</span>
                </div>
                <span className="text-[10.5px] sm:text-xs text-blue-100 font-bold mt-0.5">Quick Match</span>
              </button>

              {/* 10 Questions */}
              <button
                type="button"
                onClick={() => handleRestart(10)}
                className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl bg-gradient-to-br from-emerald-600 to-green-700 hover:from-emerald-500 hover:to-green-600 border-2 border-emerald-400/50 shadow-md active:scale-95 transition cursor-pointer group"
              >
                <div className="flex items-center gap-1 text-amber-300 text-xs sm:text-sm font-black uppercase">
                  <Award className="w-3.5 h-3.5" />
                  <span>10 Questions</span>
                </div>
                <span className="text-[10.5px] sm:text-xs text-emerald-100 font-bold mt-0.5">Standard Match</span>
              </button>

              {/* 15 Questions */}
              <button
                type="button"
                onClick={() => handleRestart(15)}
                className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl bg-gradient-to-br from-purple-600 to-pink-700 hover:from-purple-500 hover:to-pink-600 border-2 border-purple-400/50 shadow-md active:scale-95 transition cursor-pointer group"
              >
                <div className="flex items-center gap-1 text-amber-300 text-xs sm:text-sm font-black uppercase">
                  <Trophy className="w-3.5 h-3.5" />
                  <span>15 Questions</span>
                </div>
                <span className="text-[10.5px] sm:text-xs text-purple-100 font-bold mt-0.5">Championship</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3.5 sm:p-4 border-t border-white/10 bg-slate-950 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-black text-xs sm:text-sm uppercase tracking-wider transition cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>RETURN TO ARCADE</span>
          </button>

          <button
            type="button"
            onClick={() => handleRestart(matchQuestionCount)}
            className="flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg active:scale-95 transition cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>REMATCH ({matchQuestionCount}Q)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
