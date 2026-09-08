// ============================================================
// THE GREAT CARNIVAL OF CHANCE — NEUBRUTALIST ANSWER BUTTON
// 100% Solid Push Cards with Green for Correct and Red for Wrong
// Turn-based Rebound Support with Instant Visual Feedback
// ============================================================

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AnswerChoice, TeamId } from '../types';
import { MathFractionDisplay } from './MathFraction';
import { Check, X } from 'lucide-react';

interface AnswerButtonProps {
  choice: AnswerChoice;
  teamId: TeamId;
  isSelected: boolean;
  isConfirmed: boolean;
  isLocked: boolean;
  isPredicting: boolean;
  onSelect: (e: React.PointerEvent) => void;
}

export const AnswerButton: React.FC<AnswerButtonProps> = ({
  choice,
  teamId,
  isSelected,
  isConfirmed,
  isLocked,
  isPredicting,
  onSelect,
}) => {
  const isBlue = teamId === 'blue';
  const isCorrect = choice.isCorrect;
  const isWrong = !isCorrect;

  // Visual state computation
  const showCorrect = isLocked && isCorrect;
  const showWrong = isLocked && isSelected && isWrong;

  let buttonStyle: React.CSSProperties = {
    backgroundColor: '#FFFFFF',
    border: '3.5px solid #000000',
    boxShadow: '4px 4px 0px #000000',
    borderRadius: '14px',
    color: '#000000',
  };

  if (showCorrect) {
    buttonStyle = {
      backgroundColor: '#00F0A8',
      border: '4px solid #000000',
      boxShadow: '5px 5px 0px #000000',
      borderRadius: '14px',
      color: '#000000',
    };
  } else if (showWrong) {
    buttonStyle = {
      backgroundColor: '#FF2A6D',
      border: '4px solid #000000',
      boxShadow: '5px 5px 0px #000000',
      borderRadius: '14px',
      color: '#FFFFFF',
    };
  } else if (isSelected && !isLocked) {
    buttonStyle = {
      backgroundColor: '#FED500',
      border: '4px solid #000000',
      boxShadow: '5px 5px 0px #000000',
      borderRadius: '14px',
      color: '#000000',
    };
  }

  const disabled = !isPredicting || isLocked;

  return (
    <motion.button
      type="button"
      onPointerDown={onSelect}
      disabled={disabled}
      style={buttonStyle}
      whileTap={!disabled ? { scale: 0.98, x: 2, y: 2 } : {}}
      animate={
        showCorrect
          ? { scale: [1, 0.96, 1.03, 1], transition: { duration: 0.4 } }
          : showWrong
          ? { x: [0, -4, 4, -4, 4, 0], transition: { duration: 0.35 } }
          : {}
      }
      className={`relative w-full h-[52px] sm:h-[58px] px-3 py-1.5 flex items-center justify-between gap-2.5 select-none cursor-pointer touch-manipulation transition-colors ${
        disabled && !showCorrect && !showWrong ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {/* ── Left: Stacked Fraction Display & Choice Text ── */}
      <div className="flex-1 min-w-0 text-left flex items-center gap-2.5">
        <div
          style={{
            backgroundColor: showCorrect ? '#FFFFFF' : showWrong ? 'rgba(0,0,0,0.25)' : isSelected ? '#FFFFFF' : '#FED500',
            border: '2px solid #000000',
            boxShadow: '1.5px 1.5px 0px #000000',
            borderRadius: '8px',
            padding: '2px 6px',
          }}
          className="shrink-0"
        >
          <MathFractionDisplay fraction={choice.fraction} size="sm" />
        </div>

        <span
          className={`text-[11px] sm:text-xs font-black truncate ${
            showWrong ? 'text-white' : 'text-black'
          }`}
        >
          {choice.label}
        </span>
      </div>

      {/* ── Right: Neubrutalist Outcome Status Stamps ── */}
      {showCorrect && (
        <div
          style={{
            backgroundColor: '#000000',
            color: '#00F0A8',
            border: '2px solid #000000',
            borderRadius: '10px',
          }}
          className="flex items-center gap-1 px-2 py-0.5 shrink-0"
        >
          <Check className="w-3.5 h-3.5 text-[#00F0A8] stroke-[3.5]" />
          <span className="text-[9px] font-black uppercase tracking-wider text-[#00F0A8]">
            CORRECT!
          </span>
        </div>
      )}

      {showWrong && (
        <div
          style={{
            backgroundColor: '#000000',
            color: '#FFFFFF',
            border: '2px solid #000000',
            borderRadius: '10px',
          }}
          className="flex items-center gap-1 px-2 py-0.5 shrink-0"
        >
          <X className="w-3.5 h-3.5 text-[#FF2A6D] stroke-[3.5]" />
          <span className="text-[9px] font-black uppercase tracking-wider text-white">
            WRONG
          </span>
        </div>
      )}

      {/* Selected Indicator Bullet (Radio Circle) */}
      {!isLocked && (
        <div
          style={{
            backgroundColor: isSelected ? (isBlue ? '#2563EB' : '#FF2A6D') : '#FFFFFF',
            border: '2.5px solid #000000',
            boxShadow: '1px 1px 0px #000000',
          }}
          className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
        >
          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
        </div>
      )}
    </motion.button>
  );
};
