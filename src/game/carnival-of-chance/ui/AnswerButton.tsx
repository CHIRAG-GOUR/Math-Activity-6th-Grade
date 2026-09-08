// ============================================================
// THE GREAT CARNIVAL OF CHANCE — Neo-Brutalist Answer Button
// Physical Carnival Arcade Push-Card for Dual-Team Touch Screens
// High Contrast, Mathematical Fraction Display, Press Physics
// ============================================================

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AnswerChoice, TeamId } from '../types';
import { MathFractionDisplay } from './MathFraction';
import { Check, X, Sparkles } from 'lucide-react';

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

  // Determine Dynamic Style Classes
  let bgClass = 'bg-[#FFFDF6] hover:bg-[#FFE380] text-[#111111]';
  let borderClass = 'border-3 border-[#111111]';
  let shadowClass = 'shadow-[4px_4px_0px_#111111]';
  let ringClass = '';

  if (isSelected && !isConfirmed) {
    if (isBlue) {
      bgClass = 'bg-[#DBEAFE] text-[#111111]';
      ringClass = 'ring-4 ring-[#2463EB]';
      shadowClass = 'shadow-[6px_6px_0px_#111111]';
    } else {
      bgClass = 'bg-[#FFE4E6] text-[#111111]';
      ringClass = 'ring-4 ring-[#E53935]';
      shadowClass = 'shadow-[6px_6px_0px_#111111]';
    }
  }

  if (showCorrectResult) {
    bgClass = 'bg-[#2E9B57] text-[#FFFFFF]';
    shadowClass = 'shadow-[5px_5px_0px_#111111]';
  } else if (showWrongResult) {
    bgClass = 'bg-[#E53935] text-[#FFFFFF]';
    shadowClass = 'shadow-[4px_4px_0px_#111111]';
  }

  const disabled = !isPredicting || isConfirmed;

  return (
    <motion.button
      type="button"
      onPointerDown={onSelect}
      disabled={disabled}
      whileTap={!disabled ? { scale: 0.98, x: 2, y: 2 } : {}}
      className={`relative w-full h-[62px] sm:h-[68px] px-3.5 py-2 rounded-2xl ${borderClass} ${shadowClass} ${ringClass} ${bgClass} flex items-center justify-between gap-3 transition-colors select-none cursor-pointer touch-manipulation ${
        disabled && !isConfirmed ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {/* ── Left: Fraction Display & Descriptor ── */}
      <div className="flex-1 min-w-0 text-left flex items-center gap-3">
        <MathFractionDisplay fraction={choice.fraction} size="md" />

        {/* Small label / explanation hint */}
        <span
          className={`text-[11px] sm:text-xs font-bold truncate ${
            showCorrectResult || showWrongResult ? 'text-white/90' : 'text-[#111111]/80'
          }`}
        >
          {choice.label}
        </span>
      </div>

      {/* ── Right: Status Feedback Badge ── */}
      {showCorrectResult && (
        <div className="flex items-center gap-1.5 bg-[#111111] text-[#FFFFFF] px-2.5 py-1 rounded-xl border border-white shrink-0 shadow-[2px_2px_0px_#FFFFFF]">
          <Check className="w-4 h-4 text-[#2E9B57] stroke-[3]" />
          <span className="text-[10px] font-black uppercase tracking-wider">CORRECT!</span>
        </div>
      )}

      {showWrongResult && (
        <div className="flex items-center gap-1.5 bg-[#111111] text-[#FFFFFF] px-2.5 py-1 rounded-xl border border-white shrink-0 shadow-[2px_2px_0px_#FFFFFF]">
          <X className="w-4 h-4 text-[#E53935] stroke-[3]" />
          <span className="text-[10px] font-black uppercase tracking-wider">WRONG</span>
        </div>
      )}

      {/* Selected Radio Indicator (when not yet confirmed) */}
      {!isConfirmed && (
        <div
          className={`w-6 h-6 rounded-full border-3 border-[#111111] flex items-center justify-center shrink-0 ${
            isSelected
              ? isBlue
                ? 'bg-[#2463EB]'
                : 'bg-[#E53935]'
              : 'bg-white'
          }`}
        >
          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
        </div>
      )}
    </motion.button>
  );
};
