'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { TeamId } from '@/types/game';

interface ArcadeKeypadProps {
  team: TeamId;
  value: number | string;
  isSelected: boolean;
  isCorrectRevealed?: boolean;
  isWrongRevealed?: boolean;
  disabled?: boolean;
  onSelect: (val: number | string) => void;
}

export const ArcadeKeypad: React.FC<ArcadeKeypadProps> = ({
  team,
  value,
  isSelected,
  isCorrectRevealed = false,
  isWrongRevealed = false,
  disabled = false,
  onSelect,
}) => {
  const isBlue = team === 'blue';

  let customClasses = isBlue ? 'btn-arcade-3d-blue' : 'btn-arcade-3d-red';
  let textClasses = isBlue ? 'text-cyan-100' : 'text-rose-100';

  if (isCorrectRevealed) {
    customClasses =
      'bg-gradient-to-b from-emerald-400 via-emerald-600 to-green-900 border-2 border-emerald-200 shadow-[0_7px_0_#064e3b,0_0_35px_rgba(52,211,153,1)] ring-4 ring-emerald-300/80 text-white';
    textClasses = 'text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]';
  } else if (isWrongRevealed) {
    customClasses =
      'bg-gradient-to-b from-rose-700 via-red-800 to-rose-950 border-2 border-rose-400 shadow-[0_7px_0_#4c0519,0_0_25px_rgba(255,42,95,0.8)] text-white opacity-80';
    textClasses = 'text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]';
  } else if (isSelected) {
    if (isBlue) {
      customClasses =
        'bg-gradient-to-b from-cyan-300 via-cyan-400 to-blue-600 border-2 border-white shadow-[0_5px_0_#0c4a6e,0_0_40px_rgba(0,229,255,1)] ring-4 ring-cyan-200/90';
      textClasses = 'text-slate-950 font-black';
    } else {
      customClasses =
        'bg-gradient-to-b from-rose-300 via-rose-400 to-red-600 border-2 border-white shadow-[0_5px_0_#4c0519,0_0_40px_rgba(255,42,95,1)] ring-4 ring-rose-200/90';
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
      className={`relative w-full h-[72px] sm:h-[80px] md:h-[86px] rounded-2xl flex items-center justify-center font-black transition-all ${customClasses} ${
        disabled && !isSelected && !isCorrectRevealed ? 'opacity-35 cursor-not-allowed' : 'cursor-pointer'
      }`}
    >
      {/* Top Gloss Highlight Bevel */}
      <div className="absolute top-1 inset-x-2 h-3 rounded-t-xl bg-white/25 pointer-events-none" />

      {/* Answer Number Value */}
      <span className={`text-2xl sm:text-3xl md:text-4xl font-black tracking-tight font-display ${textClasses}`}>
        {value}
      </span>

      {/* Revealed Status Icon Badges */}
      {isCorrectRevealed && (
        <div className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full bg-white text-emerald-800 flex items-center justify-center shadow-xl border-2 border-emerald-400">
          <Check className="w-5 h-5 stroke-[3.5]" />
        </div>
      )}
      {isWrongRevealed && (
        <div className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full bg-white text-rose-800 flex items-center justify-center shadow-xl border-2 border-rose-400">
          <X className="w-5 h-5 stroke-[3.5]" />
        </div>
      )}
    </motion.button>
  );
};
