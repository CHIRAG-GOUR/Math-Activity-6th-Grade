// ============================================================
// THE GREAT CARNIVAL OF CHANCE — Neo-Brutalist Question Panel
// Structured Hierarchy for Mathematical Probability Problems
// Heading Badge → Physical Machine Setup Breakdown → Action Question
// ============================================================

import React from 'react';
import { ProbabilityChallenge } from '../types';
import { HelpCircle, Star, Sparkles } from 'lucide-react';

interface QuestionPanelProps {
  challenge: ProbabilityChallenge;
}

export const QuestionPanel: React.FC<QuestionPanelProps> = ({ challenge }) => {
  const { setup } = challenge;

  return (
    <div className="w-full bg-[#FFFFFF] border-4 border-[#111111] shadow-[5px_5px_0px_#111111] rounded-2xl p-3 sm:p-4 text-left flex flex-col gap-2 select-none shrink-0">
      {/* ── Top Badge Row: Mission Title & Points Value ── */}
      <div className="flex items-center justify-between gap-2 border-b-2 border-[#111111]/20 pb-1.5">
        <div className="flex items-center gap-1.5">
          <div className="px-2 py-0.5 rounded-lg bg-[#FFC928] border-2 border-[#111111] text-[10px] font-black uppercase text-[#111111] shadow-[1px_1px_0px_#111111]">
            MISSION
          </div>
          <span className="text-xs font-black uppercase tracking-wide text-[#E53935] truncate max-w-[160px]">
            {challenge.missionTitle}
          </span>
        </div>

        <div className="flex items-center gap-1 bg-[#2E9B57] text-white px-2 py-0.5 rounded-lg border-2 border-[#111111] text-[10px] font-black shadow-[1px_1px_0px_#111111] shrink-0">
          <Star className="w-3 h-3 fill-yellow-300 text-yellow-300" />
          <span>+{challenge.points} PTS</span>
        </div>
      </div>

      {/* ── Setup Breakdown (Color/Item Counts) ── */}
      {setup && setup.items && setup.items.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap py-1 px-2 rounded-xl bg-[#FFF8E7] border-2 border-[#111111]">
          <span className="text-[9px] font-black uppercase tracking-wider text-[#111111]/70 mr-1">
            TOTAL {setup.totalItems}:
          </span>
          {setup.items.map((it, idx) => (
            <div
              key={idx}
              className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white border border-[#111111] text-[9px] font-black"
            >
              <div
                className="w-2.5 h-2.5 rounded-full border border-[#111111] shadow-2xs"
                style={{ backgroundColor: it.color }}
              />
              <span>
                {it.count} {it.colorName}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ── Main Problem Question ── */}
      <div className="text-[13px] sm:text-[14px] font-black text-[#111111] leading-snug">
        {challenge.prompt}
      </div>

      {/* Optional Helper Note */}
      {challenge.helperNote && (
        <div className="text-[10px] font-bold text-[#E53935] bg-[#FEE2E2] px-2 py-1 rounded-lg border border-[#E53935]">
          💡 {challenge.helperNote}
        </div>
      )}
    </div>
  );
};
