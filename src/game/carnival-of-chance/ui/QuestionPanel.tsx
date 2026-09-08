// ============================================================
// THE GREAT CARNIVAL OF CHANCE — NEUBRUTALIST QUESTION CARD
// Compact, Non-Scrolling Layout for 720p - 1080p Viewports
// 100% Solid Yellow Card, 3.5px Black Outline, 4px Hard Shadow
// ============================================================

import React from 'react';
import { ProbabilityChallenge } from '../types';
import { Star, Target } from 'lucide-react';

interface QuestionPanelProps {
  challenge: ProbabilityChallenge;
}

export const QuestionPanel: React.FC<QuestionPanelProps> = ({ challenge }) => {
  const { setup } = challenge;

  // Format prompt text to replace literal '\n' escape strings if present
  const formattedPrompt = challenge.prompt.replace(/\\n/g, '\n');

  return (
    <div
      style={{
        backgroundColor: '#FED500',
        border: '3.5px solid #000000',
        boxShadow: '4px 4px 0px #000000',
        borderRadius: '14px',
        color: '#000000',
      }}
      className="w-full p-2 sm:p-2.5 text-left flex flex-col gap-1 sm:gap-1.5 select-none shrink-0"
    >
      {/* ── Top Strip: Challenge Badge & Points Stamp ── */}
      <div className="flex items-center justify-between gap-1.5 border-b-2 border-black pb-1">
        <div className="flex items-center gap-1.5 min-w-0">
          <div
            style={{
              backgroundColor: '#FF2A6D',
              border: '2px solid #000000',
              boxShadow: '1.5px 1.5px 0px #000000',
              borderRadius: '6px',
              color: '#FFFFFF',
            }}
            className="px-1.5 py-0.2 text-[9px] font-black uppercase tracking-wider shrink-0"
          >
            CHALLENGE
          </div>
          <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wide text-black truncate">
            {challenge.missionTitle}
          </span>
        </div>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '2px solid #000000',
            boxShadow: '1.5px 1.5px 0px #000000',
            borderRadius: '6px',
          }}
          className="flex items-center gap-1 px-1.5 py-0.2 text-[9px] font-black text-black shrink-0"
        >
          <Star className="w-2.5 h-2.5 fill-[#FED500] text-black" />
          <span>+{challenge.points} PTS</span>
        </div>
      </div>

      {/* ── Setup Counts Breakdown Ribbon ── */}
      {setup && setup.items && setup.items.length > 0 && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1.5px solid #000000',
            borderRadius: '8px',
          }}
          className="flex items-center gap-1 flex-wrap py-0.5 px-1.5"
        >
          <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-black mr-0.5">
            TOTAL {setup.totalItems}:
          </span>
          {setup.items.map((it, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#FFF7E5',
                border: '1px solid #000000',
                borderRadius: '5px',
              }}
              className="flex items-center gap-1 px-1 py-0.2 text-[8px] font-black text-black"
            >
              <div
                className="w-2 h-2 rounded-full border border-black"
                style={{ backgroundColor: it.color }}
              />
              <span>
                {it.count} {it.colorName}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ── Main Problem Narration ── */}
      <div className="text-[11px] sm:text-xs font-black text-black leading-tight">
        {formattedPrompt}
      </div>

      {/* ── Direct Operator Action Banner ── */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '1.5px solid #000000',
          borderRadius: '6px',
          boxShadow: '1.5px 1.5px 0px #000000',
        }}
        className="flex items-center gap-1 px-1.5 py-0.5 text-[8.5px] sm:text-[9px] font-black text-black"
      >
        <Target className="w-3 h-3 text-[#FF2A6D] shrink-0" />
        <span className="tracking-tight text-black truncate">
          Answer correctly and find the ball from correct box!
        </span>
      </div>
    </div>
  );
};

