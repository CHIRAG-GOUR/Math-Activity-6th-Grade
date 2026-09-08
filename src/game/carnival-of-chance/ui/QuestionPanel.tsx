// ============================================================
// THE GREAT CARNIVAL OF CHANCE — COMIC NARRATION QUESTION PANEL
// 100% Solid Opaque White Box, 4px Black Outline, 5px Hard Shadow
// High-Hierarchy Comic Typography, Item Count Tokens, Math Clarity
// ============================================================

import React from 'react';
import { ProbabilityChallenge } from '../types';
import { Star } from 'lucide-react';

interface QuestionPanelProps {
  challenge: ProbabilityChallenge;
}

export const QuestionPanel: React.FC<QuestionPanelProps> = ({ challenge }) => {
  const { setup } = challenge;

  return (
    <div className="w-full bg-[#FFFFFF] border-[4px] border-[#111111] shadow-[5px_5px_0px_#111111] rounded-[16px] p-3 sm:p-3.5 text-left flex flex-col gap-2 select-none shrink-0">
      {/* ── Top Strip: Challenge Stamp & Points Value ── */}
      <div className="flex items-center justify-between gap-2 border-b-2 border-[#111111] pb-1.5">
        <div className="flex items-center gap-1.5">
          <div className="px-2 py-0.5 rounded-lg bg-[#FFC928] border-2 border-[#111111] text-[10px] font-black uppercase text-[#111111] shadow-[2px_2px_0px_#111111]">
            CHALLENGE
          </div>
          <span className="text-xs font-black uppercase tracking-wide text-[#E53935] truncate max-w-[150px]">
            {challenge.missionTitle}
          </span>
        </div>

        <div className="flex items-center gap-1 bg-[#2E9B57] text-white px-2 py-0.5 rounded-lg border-2 border-[#111111] text-[10px] font-black shadow-[2px_2px_0px_#111111] shrink-0">
          <Star className="w-3 h-3 fill-yellow-300 text-yellow-300" />
          <span>+{challenge.points} PTS</span>
        </div>
      </div>

      {/* ── Physical Machine Setup Breakdown (Count Tokens) ── */}
      {setup && setup.items && setup.items.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap py-1 px-2 rounded-xl bg-[#FFF7E5] border-2 border-[#111111]">
          <span className="text-[9px] font-black uppercase tracking-wider text-[#111111] font-black mr-1">
            TOTAL {setup.totalItems}:
          </span>
          {setup.items.map((it, idx) => (
            <div
              key={idx}
              className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white border-2 border-[#111111] text-[9px] font-black"
            >
              <div
                className="w-2.5 h-2.5 rounded-full border border-[#111111] shadow-2xs"
                style={{ backgroundColor: it.color }}
              />
              <span className="text-[#111111]">
                {it.count} {it.colorName}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ── Main Problem Narration ── */}
      <div className="text-[13px] sm:text-[14px] font-black text-[#111111] leading-snug">
        {challenge.prompt}
      </div>

      {/* Optional Helper Hint */}
      {challenge.helperNote && (
        <div className="text-[10px] font-black text-[#E53935] bg-[#FEE2E2] px-2 py-0.5 rounded-lg border-2 border-[#E53935]">
          💡 {challenge.helperNote}
        </div>
      )}
    </div>
  );
};
