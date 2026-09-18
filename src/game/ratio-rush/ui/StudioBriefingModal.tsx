// ============================================================
// RATIO RUSH — STUDIO BRIEFING MODAL
// Classroom instructions, curriculum ratio concepts & controls guide
// ============================================================

import React from 'react';
import { useRatioStore } from '../store/ratioStore';
import {
  Clapperboard,
  Sparkles,
  Camera,
  Layers,
  Award,
  X,
  Play,
  Film,
} from 'lucide-react';

export const StudioBriefingModal: React.FC = () => {
  const showBriefingModal = useRatioStore((s) => s.showBriefingModal);
  const setShowBriefingModal = useRatioStore((s) => s.setShowBriefingModal);

  if (!showBriefingModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md select-none animate-fadeIn">
      <div className="w-full max-w-2xl bg-white border-2 border-amber-400 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 text-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-md">
              <Clapperboard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black uppercase tracking-wider text-slate-950 font-bank">
                Production Briefing: Ratio Rush
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">
                Grade 6 Mathematics • Ratios, Rates & Film Studio Proportions
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowBriefingModal(false)}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Core Gameplay Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200 flex flex-col gap-1.5">
            <div className="w-7 h-7 rounded-lg bg-sky-500 text-white flex items-center justify-center shadow-xs">
              <Camera className="w-4 h-4" />
            </div>
            <h3 className="font-black uppercase text-sky-900">1. Real Studio Production</h3>
            <p className="text-slate-600 text-[11px] leading-relaxed font-medium">
              Solve ratio challenges to construct movie sets, power studio lights, roll camera dollies, and cue actors.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col gap-1.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center shadow-xs">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="font-black uppercase text-amber-900">2. Tape & Scale Modeling</h3>
            <p className="text-slate-600 text-[11px] leading-relaxed font-medium">
              Use the interactive tape diagrams and scaling tables to calculate unit rates and equivalent proportions.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col gap-1.5">
            <div className="w-7 h-7 rounded-lg bg-rose-500 text-white flex items-center justify-center shadow-xs">
              <Film className="w-4 h-4" />
            </div>
            <h3 className="font-black uppercase text-rose-900">3. Cinema Premiere</h3>
            <p className="text-slate-600 text-[11px] leading-relaxed font-medium">
              Complete all 5 stages to trigger the live cinematic film shoot and transition into the Grand Cinema Premiere!
            </p>
          </div>
        </div>

        {/* Start Shoot Button */}
        <button
          onClick={() => setShowBriefingModal(false)}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
        >
          <Play className="w-4 h-4 fill-slate-950" />
          <span>ENTER FILM SOUNDSTAGE</span>
        </button>
      </div>
    </div>
  );
};
