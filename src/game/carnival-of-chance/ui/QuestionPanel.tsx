// ============================================================
// THE GREAT CARNIVAL OF CHANCE — NEUBRUTALIST QUESTION CARD
// 100% Solid Opaque Box, 4px Black Outline, 5px Hard Shadow
// Yellow with Black, Red with White & Black Carnival Palette
// ============================================================

import React from 'react';
import { ProbabilityChallenge } from '../types';
import { Star } from 'lucide-react';

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
        backgroundColor: '#FFFFFF',
        border: '4px solid #000000',
        boxShadow: '5px 5px 0px #000000',
        borderRadius: '16px',
        color: '#000000',
      }}
      className="w-full p-2.5 sm:p-3 text-left flex flex-col gap-2 select-none shrink-0"
    >
      {/* ── Top Strip: Red/Yellow Challenge Badge & Points Stamp ── */}
      <div className="flex items-center justify-between gap-2 border-b-2 border-black pb-1.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <div
            style={{
              backgroundColor: '#FF2A6D',
              border: '2px solid #000000',
              boxShadow: '2px 2px 0px #000000',
              borderRadius: '8px',
              color: '#FFFFFF',
            }}
            className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider shrink-0"
          >
            CHALLENGE
          </div>
          <span className="text-[11px] sm:text-xs font-black uppercase tracking-wide text-black truncate">
            {challenge.missionTitle}
          </span>
        </div>

        <div
          style={{
            backgroundColor: '#FED500',
            border: '2px solid #000000',
            boxShadow: '2px 2px 0px #000000',
            borderRadius: '8px',
          }}
          className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-black text-black shrink-0"
        >
          <Star className="w-3 h-3 fill-black text-black" />
          <span>+{challenge.points} PTS</span>
        </div>
      </div>

      {/* ── Setup Counts Breakdown Ribbon ── */}
      {setup && setup.items && setup.items.length > 0 && (
        <div
          style={{
            backgroundColor: '#FFF7E5',
            border: '2px solid #000000',
            borderRadius: '10px',
          }}
          className="flex items-center gap-1.5 flex-wrap py-1 px-2"
        >
          <span className="text-[9px] font-black uppercase tracking-wider text-black mr-1">
            TOTAL {setup.totalItems}:
          </span>
          {setup.items.map((it, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #000000',
                borderRadius: '6px',
              }}
              className="flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-black text-black"
            >
              <div
                className="w-2.5 h-2.5 rounded-full border border-black"
                style={{ backgroundColor: it.color }}
              />
              <span>
                {it.count} {it.colorName}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ── Main Problem Narration with Pre-Line Multi-Line Support ── */}
      <div className="text-[12px] sm:text-[13px] font-black text-black leading-snug whitespace-pre-line">
        {formattedPrompt}
      </div>

      {/* ── Optional Helper Hint ── */}
      {challenge.helperNote && (
        <div
          style={{
            backgroundColor: '#FED500',
            border: '2px solid #000000',
            boxShadow: '2px 2px 0px #000000',
            borderRadius: '8px',
          }}
          className="text-[10px] font-black text-black px-2 py-1 leading-tight"
        >
          💡 {challenge.helperNote}
        </div>
      )}
    </div>
  );
};
