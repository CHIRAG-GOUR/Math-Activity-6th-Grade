// ============================================================
// RATIO RUSH — STUDIO BRIEFING MODAL (NEO-BRUTALIST THEME)
// Classroom instructions, curriculum ratio concepts & controls guide
// ============================================================

import React from 'react';
import { useRatioStore } from '../store/ratioStore';
import {
  Clapperboard,
  Camera,
  Layers,
  X,
  Play,
  Film,
} from 'lucide-react';

export const StudioBriefingModal: React.FC = () => {
  const showBriefingModal = useRatioStore((s) => s.showBriefingModal);
  const setShowBriefingModal = useRatioStore((s) => s.setShowBriefingModal);

  if (!showBriefingModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 select-none animate-fadeIn">
      <div className="w-full max-w-2xl bg-white border-4 border-black rounded-3xl p-6 shadow-[10px_10px_0px_#000000] flex flex-col gap-4 text-black">
        {/* Header */}
        <div className="flex items-center justify-between border-b-3 border-black pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-400 text-black border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_#000000]">
              <Clapperboard className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-lg font-black uppercase tracking-wider text-black font-bank">
                PRODUCTION BRIEFING: RATIO RUSH
              </h2>
              <p className="text-xs text-black font-bold">
                Grade 6 Mathematics • Ratios, Rates & Film Studio Proportions
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowBriefingModal(false)}
            className="p-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 border-2 border-black text-black shadow-[2px_2px_0px_#000000] active:shadow-none cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[3]" />
          </button>
        </div>

        {/* 3 Core Gameplay Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-yellow-50 border-3 border-black shadow-[3px_3px_0px_#000000] flex flex-col gap-1.5">
            <div className="w-8 h-8 rounded-lg bg-blue-400 text-black border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000000]">
              <Camera className="w-4 h-4 stroke-[2.5]" />
            </div>
            <h3 className="font-black uppercase text-black text-sm">1. Film Soundstage</h3>
            <p className="text-black text-xs leading-relaxed font-bold">
              Solve ratio math challenges to shoot 16:9 cinematic takes, paint cyclorama walls, and scale spaceship props.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-yellow-50 border-3 border-black shadow-[3px_3px_0px_#000000] flex flex-col gap-1.5">
            <div className="w-8 h-8 rounded-lg bg-yellow-400 text-black border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000000]">
              <Layers className="w-4 h-4 stroke-[2.5]" />
            </div>
            <h3 className="font-black uppercase text-black text-sm">2. Rough Work Canvas</h3>
            <p className="text-black text-xs leading-relaxed font-bold">
              Use the built-in scratchpad to draw tape diagrams, simplify ratios, and calculate unit scale factors.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-yellow-50 border-3 border-black shadow-[3px_3px_0px_#000000] flex flex-col gap-1.5">
            <div className="w-8 h-8 rounded-lg bg-rose-400 text-black border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000000]">
              <Film className="w-4 h-4 stroke-[2.5]" />
            </div>
            <h3 className="font-black uppercase text-black text-sm">3. Cinema Premiere</h3>
            <p className="text-black text-xs leading-relaxed font-bold">
              Complete all 5 stages in the 2-player studio duel to unlock the Grand Movie Premiere wrap party!
            </p>
          </div>
        </div>

        {/* Start Shoot Button */}
        <button
          onClick={() => setShowBriefingModal(false)}
          className="w-full py-3.5 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-black font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 border-3 border-black shadow-[4px_4px_0px_#000000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
        >
          <Play className="w-5 h-5 fill-black stroke-[2.5]" />
          <span>ENTER FILM SOUNDSTAGE</span>
        </button>
      </div>
    </div>
  );
};
