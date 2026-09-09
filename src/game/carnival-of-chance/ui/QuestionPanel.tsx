// ============================================================
// THE GREAT CARNIVAL OF CHANCE — CENTRAL NEUBRUTALIST QUESTION CARD
// Centered, Highly Visible Layout with Large Consistent Typography
// 100% Solid Yellow Card, 4px Black Outline, 5px Hard Shadow
// Hides during 3D Machine Operation to provide 100% Unobstructed Action!
// ============================================================

import React from 'react';
import { ProbabilityChallenge } from '../types';
import { Star, Clock, Target, HelpCircle } from 'lucide-react';
import { useCarnivalStore } from '../store/carnivalStore';

interface QuestionPanelProps {
  challenge: ProbabilityChallenge;
}

export const QuestionPanel: React.FC<QuestionPanelProps> = ({ challenge }) => {
  const { setup } = challenge;
  const timeRemaining = useCarnivalStore((s) => s.timeRemaining);
  const timerActive = useCarnivalStore((s) => s.timerActive);

  // Format prompt text to replace literal '\n' escape strings if present
  const formattedPrompt = challenge.prompt.replace(/\\n/g, '\n');
  const isUrgent = timeRemaining <= 8 && timerActive;

  return (
    <div
      style={{
        backgroundColor: '#FED500',
        border: '4px solid #000000',
        boxShadow: '5px 5px 0px #000000',
        borderRadius: '18px',
        color: '#000000',
      }}
      className="w-full max-w-xl mx-auto p-3 sm:p-4 text-left flex flex-col gap-2 select-none pointer-events-auto"
    >
      {/* ── Top Strip: Challenge Badge, Timer & Points Stamp ── */}
      <div className="flex items-center justify-between gap-2 border-b-2 border-black pb-1.5">
        <div className="flex items-center gap-2 min-w-0">
          <div
            style={{
              backgroundColor: '#FF2A6D',
              border: '2px solid #000000',
              boxShadow: '2px 2px 0px #000000',
              borderRadius: '8px',
              color: '#FFFFFF',
            }}
            className="px-2 py-0.5 text-[10px] sm:text-xs font-black uppercase tracking-wider shrink-0"
          >
            PROBABILITY MISSION
          </div>
          <span className="text-xs sm:text-sm font-black uppercase tracking-wide text-black truncate">
            {challenge.missionTitle}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Live Question Countdown Timer Badge */}
          <div
            style={{
              backgroundColor: isUrgent ? '#FF2A6D' : '#FFFFFF',
              border: '2px solid #000000',
              boxShadow: '1.5px 1.5px 0px #000000',
              borderRadius: '8px',
              color: isUrgent ? '#FFFFFF' : '#000000',
            }}
            className={`flex items-center gap-1 px-2 py-0.5 text-xs font-black transition-colors ${
              isUrgent ? 'animate-pulse' : ''
            }`}
          >
            <Clock className={`w-3.5 h-3.5 ${isUrgent ? 'text-white animate-spin' : 'text-black'}`} />
            <span>{timeRemaining}s</span>
          </div>

          {/* Points Badge */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '2px solid #000000',
              boxShadow: '1.5px 1.5px 0px #000000',
              borderRadius: '8px',
            }}
            className="flex items-center gap-1 px-2 py-0.5 text-xs font-black text-black"
          >
            <Star className="w-3.5 h-3.5 fill-[#FED500] text-black" />
            <span>+{challenge.points} PTS</span>
          </div>
        </div>
      </div>

      {/* ── Setup Counts Breakdown Ribbon (If applicable) ── */}
      {setup && setup.items && setup.items.length > 0 && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '2px solid #000000',
            borderRadius: '10px',
          }}
          className="flex items-center gap-1.5 flex-wrap py-1 px-2"
        >
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-black mr-1">
            TOTAL {setup.totalItems}:
          </span>
          {setup.items.map((it, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#FFF7E5',
                border: '1.5px solid #000000',
                borderRadius: '6px',
              }}
              className="flex items-center gap-1.5 px-2 py-0.5 text-[10px] sm:text-xs font-black text-black"
            >
              <div
                className="w-3 h-3 rounded-full border border-black shadow-sm"
                style={{ backgroundColor: it.color }}
              />
              <span>
                {it.count} {it.colorName}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ── Main Problem Narration (Clear, High-Contrast, Uniform Typography) ── */}
      <div className="text-sm sm:text-base font-black text-black leading-snug py-0.5">
        {formattedPrompt}
      </div>

      {/* ── Direct Operator Action Banner ── */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '2px solid #000000',
          borderRadius: '8px',
          boxShadow: '2px 2px 0px #000000',
        }}
        className="flex items-center gap-1.5 px-2 py-1 text-[10px] sm:text-xs font-black text-black"
      >
        <Target className="w-4 h-4 text-[#FF2A6D] shrink-0" />
        <span className="tracking-tight text-black truncate">
          Select your prediction on your team console below & lock in!
        </span>
      </div>
    </div>
  );
};
