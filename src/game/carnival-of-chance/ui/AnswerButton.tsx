// ============================================================
// THE GREAT CARNIVAL OF CHANCE — COMIC-BOOK ANSWER BUTTON
// 100% Opaque Cream/Yellow Push Cards, 4px Black Outlines, 5px Hard Shadows
// Comic Success Green Stamp & Error Red Feedback
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
  isPredicting: boolean;
  onSelect: (e: React.PointerEvent) => void;
}

export const AnswerButton: React.FC<AnswerButtonProps> = ({
  choice,
  teamId,
  isSelected,
  isConfirmed,
  isPredicting,
  onSelect,
}) => {
  const isBlue = teamId === 'blue';
  const isCorrect = choice.isCorrect;
  const showCorrectResult = isConfirmed && isCorrect;
  const showWrongResult = isConfirmed && isSelected && !isCorrect;

  // Style Variants
  let bgClass = 'bg-[#FFFDF8] hover:bg-[#FFE58F] text-[#111111]';
  let borderClass = 'border-[4px] border-[#111111]';
  let shadowClass = 'shadow-[5px_5px_0px_#111111]';
  let ringClass = '';

  if (isSelected && !isConfirmed) {
    if (isBlue) {
      bgClass = 'bg-[#DBEAFE] text-[#111111]';
      ringClass = 'ring-4 ring-[#2463EB]';
      shadowClass = 'shadow-[6px_6px_0px_#2463EB]';
    } else {
      bgClass = 'bg-[#FEE2E2] text-[#111111]';
      ringClass = 'ring-4 ring-[#E53935]';
      shadowClass = 'shadow-[6px_6px_0px_#E53935]';
    }
  }

  if (showCorrectResult) {
    bgClass = 'bg-[#2E9B57] text-[#FFFFFF]';
    shadowClass = 'shadow-[6px_6px_0px_#111111]';
  } else if (showWrongResult) {
    bgClass = 'bg-[#E53935] text-[#FFFFFF]';
    shadowClass = 'shadow-[5px_5px_0px_#111111]';
  }

  const disabled = !isPredicting || isConfirmed;

  return (
    <motion.button
      type="button"
      onPointerDown={onSelect}
      disabled={disabled}
      whileTap={!disabled ? { scale: 0.98, x: 2, y: 2 } : {}}
      animate={
        showCorrectResult
          ? { scale: [1, 0.95, 1.04, 1], transition: { duration: 0.4 } }
          : showWrongResult
          ? { x: [0, -4, 4, -4, 4, 0], transition: { duration: 0.35 } }
          : {}
      }
      className={`relative w-full h-[62px] sm:h-[66px] px-3.5 py-1.5 rounded-[16px] ${borderClass} ${shadowClass} ${ringClass} ${bgClass} flex items-center justify-between gap-3 transition-colors select-none cursor-pointer touch-manipulation ${
        disabled && !isConfirmed ? 'opacity-55 cursor-not-allowed' : ''
      }`}
    >
      {/* ── Left: Stacked Fraction & Label ── */}
      <div className="flex-1 min-w-0 text-left flex items-center gap-3">
        <MathFractionDisplay fraction={choice.fraction} size="md" />

        <span
          className={`text-[11px] sm:text-xs font-black truncate ${
            showCorrectResult || showWrongResult ? 'text-white' : 'text-[#111111]'
          }`}
        >
          {choice.label}
        </span>
      </div>

      {/* ── Right: Comic Stamp Badge ── */}
      {showCorrectResult && (
        <div className="flex items-center gap-1 bg-[#111111] text-[#FFFFFF] px-2.5 py-1 rounded-xl border-2 border-white shrink-0 shadow-[2px_2px_0px_#FFFFFF]">
          <Check className="w-4 h-4 text-[#2E9B57] stroke-[3.5]" />
          <span className="text-[10px] font-black uppercase tracking-wider">CORRECT!</span>
        </div>
      )}

      {showWrongResult && (
        <div className="flex items-center gap-1 bg-[#111111] text-[#FFFFFF] px-2.5 py-1 rounded-xl border-2 border-white shrink-0 shadow-[2px_2px_0px_#FFFFFF]">
          <X className="w-4 h-4 text-[#E53935] stroke-[3.5]" />
          <span className="text-[10px] font-black uppercase tracking-wider">TRY AGAIN</span>
        </div>
      )}

      {/* Selected Indicator Bullet */}
      {!isConfirmed && (
        <div
          className={`w-6 h-6 rounded-full border-[3px] border-[#111111] flex items-center justify-center shrink-0 shadow-[1px_1px_0px_#111111] ${
            isSelected
              ? isBlue
                ? 'bg-[#2463EB]'
                : 'bg-[#E53935]'
              : 'bg-white'
          }`}
        >
          {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
        </div>
      )}
    </motion.button>
  );
};
