// ============================================================
// PERCENTAGE HARVEST — SMART FARM MISSION BRIEFING MODAL
// Interactive tutorial detailing the mathematics loop, field grid & economy
// ============================================================

import React from 'react';
import { X, Play, Sparkles } from 'lucide-react';
import { useFarmStore } from '../store/farmStore';

export const FarmBriefingModal: React.FC = () => {
  const showBriefing = useFarmStore((s) => s.showBriefing);
  const setShowBriefing = useFarmStore((s) => s.setShowBriefing);

  if (!showBriefing) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-slate-900 border-4 border-emerald-500/60 text-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🌾</span>
            <div>
              <div className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-emerald-400">
                OPERATIONS MANUAL · GRADE 6 MATHEMATICS
              </div>
              <h2 className="text-base sm:text-xl font-black uppercase tracking-tight text-white">
                PERCENTAGE HARVEST — THE SMART FARM
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowBriefing(false)}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          {/* Loop Card */}
          <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-2">
            <div className="font-black text-sm uppercase text-emerald-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>The Mathematics-Driven Farm Loop</span>
            </div>
            <p>
              Your mathematics calculations directly control the physical farm simulation. Every correct answer triggers real agricultural action:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px] font-bold text-center">
              <div className="p-2 rounded-xl bg-black/40 border border-emerald-500/20 text-emerald-300">
                ① CALCULATE %
              </div>
              <div className="p-2 rounded-xl bg-black/40 border border-emerald-500/20 text-sky-300">
                ② FIELD GROWS
              </div>
              <div className="p-2 rounded-xl bg-black/40 border border-emerald-500/20 text-amber-300">
                ③ WEIGH AT SCALE
              </div>
              <div className="p-2 rounded-xl bg-black/40 border border-emerald-500/20 text-purple-300">
                ④ SELL FOR ₹ REVENUE
              </div>
            </div>
          </div>

          {/* 5 Questions Progression */}
          <div className="space-y-2">
            <h3 className="font-black text-sm uppercase text-amber-300">
              5 Major Agricultural Rounds:
            </h3>
            <div className="space-y-1.5">
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-white/5 flex items-start gap-2.5">
                <span className="px-2 py-0.5 rounded-lg bg-amber-400 text-amber-950 font-black text-xs">R1</span>
                <div>
                  <strong className="text-white">Percentage of a Quantity:</strong> Calculate crop land allocations (e.g. 30% of 200 hectares = 60 ha wheat).
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-white/5 flex items-start gap-2.5">
                <span className="px-2 py-0.5 rounded-lg bg-sky-400 text-sky-950 font-black text-xs">R2</span>
                <div>
                  <strong className="text-white">100-Cell Field Modeling:</strong> Select percentage cells on a 10x10 farm grid (25% = 25/100).
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-white/5 flex items-start gap-2.5">
                <span className="px-2 py-0.5 rounded-lg bg-blue-400 text-blue-950 font-black text-xs">R3</span>
                <div>
                  <strong className="text-white">Increase & Decrease:</strong> Weather impacts (Rain +15%, Heatwave -20%) physically adjust crop yields.
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-white/5 flex items-start gap-2.5">
                <span className="px-2 py-0.5 rounded-lg bg-purple-400 text-purple-950 font-black text-xs">R4</span>
                <div>
                  <strong className="text-white">Finding the Whole:</strong> Determine full silo & field capacities given partial percentages.
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-white/5 flex items-start gap-2.5">
                <span className="px-2 py-0.5 rounded-lg bg-emerald-400 text-emerald-950 font-black text-xs">R5</span>
                <div>
                  <strong className="text-white">Multi-Step Logistics:</strong> Manage damages, local sales, and city export distribution for peak revenue!
                </div>
              </div>
            </div>
          </div>

          {/* Scoring */}
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-white/10">
            <strong className="text-white">Winning Criteria:</strong> The winner is determined by total Farm Performance Score (Harvest kg, Accuracy %, Deliveries & Revenue ₹ minus crop waste).
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-slate-950 flex justify-end">
          <button
            type="button"
            onClick={() => setShowBriefing(false)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black text-sm uppercase tracking-wider shadow-lg active:scale-95 transition cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>START AGRICULTURAL DUEL</span>
          </button>
        </div>
      </div>
    </div>
  );
};
