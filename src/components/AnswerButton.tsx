'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { TeamId } from '@/types/game';

interface AnswerButtonProps {
  team: TeamId;
  value: number | string;
  isSelected: boolean;
  isCorrectRevealed?: boolean;
  isWrongRevealed?: boolean;
  disabled?: boolean;
  onSelect: (val: number | string) => void;
}

export const AnswerButton: React.FC<AnswerButtonProps> = ({
  team,
  value,
  isSelected,
  isCorrectRevealed = false,
  isWrongRevealed = false,
  disabled = false,
  onSelect,
}) => {
  const isBlue = team === 'blue';

  let customClasses = isBlue ? 'arcade-btn-blue' : 'arcade-btn-red';
  let textClasses = isBlue ? 'text-cyan-100' : 'text-rose-100';

  if (isCorrectRevealed) {
    customClasses =
      'bg-gradient-to-b from-emerald-500 via-emerald-600 to-green-800 border-2 border-emerald-300 shadow-[0_6px_0_#064e3b,0_0_30px_rgba(52,211,153,0.9)] ring-4 ring-emerald-400/70 text-white';
    textClasses = 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]';
  } else if (isWrongRevealed) {
    customClasses =
      'bg-gradient-to-b from-rose-700 via-red-800 to-rose-950 border-2 border-rose-400 shadow-[0_6px_0_#4c0519,0_0_20px_rgba(244,63,94,0.7)] text-white opacity-80';
    textClasses = 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]';
  } else if (isSelected) {
    if (isBlue) {
      customClasses =
        'bg-gradient-to-b from-cyan-300 via-cyan-400 to-blue-600 border-2 border-white shadow-[0_4px_0_#0c4a6e,0_0_35px_rgba(0,240,255,1)] ring-4 ring-cyan-300/80';
      textClasses = 'text-slate-950 font-black';
    } else {
      customClasses =
        'bg-gradient-to-b from-rose-300 via-rose-400 to-red-600 border-2 border-white shadow-[0_4px_0_#4c0519,0_0_35px_rgba(255,51,102,1)] ring-4 ring-rose-300/80';
      textClasses = 'text-slate-950 font-black';
    }
  }

  return (
    <motion.button
      type="button"
      whileTap={{ scale: disabled ? 1 : 0.94 }}
      disabled={disabled}
      onPointerDown={(e) => {
        e.stopPropagation();
        if (disabled) return;
        onSelect(value);
      }}
      className={`tactile-btn relative w-full h-[70px] sm:h-[78px] md:h-[84px] rounded-2xl flex items-center justify-center font-black transition-all ${customClasses} ${
        disabled && !isSelected && !isCorrectRevealed ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
      }`}
    >
      {/* Top Gloss Highlight Bevel */}
      <div className="absolute top-1 inset-x-2 h-2.5 rounded-t-xl bg-white/20 pointer-events-none" />

      {/* Answer Value Number */}
      <span className={`text-2xl sm:text-3xl md:text-4xl font-black tracking-tight font-display ${textClasses}`}>
        {value}
      </span>

      {/* Revealed Status Icon Badges */}
      {isCorrectRevealed && (
        <div className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full bg-white text-emerald-800 flex items-center justify-center shadow-xl border border-emerald-400">
          <Check className="w-5 h-5 stroke-[3.5]" />
        </div>
      )}
      {isWrongRevealed && (
        <div className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full bg-white text-rose-800 flex items-center justify-center shadow-xl border border-rose-400">
          <X className="w-5 h-5 stroke-[3.5]" />
        </div>
      )}
    </motion.button>
  );
};
