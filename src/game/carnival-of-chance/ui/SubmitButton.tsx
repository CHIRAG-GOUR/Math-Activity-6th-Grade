// ============================================================
// THE GREAT CARNIVAL OF CHANCE — Neo-Brutalist Primary Submit Button
// Massive 72px+ Physical Actuator for Classroom Touchscreen TV
// Always Visible, Fixed Height, Uncompromised Contrast & Press Physics
// ============================================================

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Lock, ArrowRight } from 'lucide-react';
import { CARNIVAL_THEME } from './tokens';

interface SubmitButtonProps {
  isReady: boolean;
  isConfirmed: boolean;
  isPredicting: boolean;
  onConfirm: (e: React.PointerEvent) => void;
  teamColor?: 'blue' | 'red';
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  isReady,
  isConfirmed,
  isPredicting,
  onConfirm,
  teamColor = 'blue',
}) => {
  const disabled = !isPredicting || !isReady || isConfirmed;

  if (isConfirmed) {
    return (
      <div className="w-full h-[68px] sm:h-[74px] rounded-2xl bg-[#2E9B57] text-[#FFFFFF] border-4 border-[#111111] shadow-[5px_5px_0px_#111111] flex items-center justify-center gap-2.5 font-black text-sm sm:text-base uppercase tracking-wider select-none shrink-0">
        <CheckCircle2 className="w-6 h-6 stroke-[3] text-white" />
        <span>PREDICTION LOCKED IN</span>
      </div>
    );
  }

  return (
    <motion.button
      type="button"
      onPointerDown={onConfirm}
      disabled={disabled}
      whileTap={!disabled ? { scale: 0.97, x: 2, y: 2 } : {}}
      className={`w-full h-[68px] sm:h-[74px] rounded-2xl border-4 border-[#111111] flex items-center justify-center gap-3 font-black text-sm sm:text-base uppercase tracking-wider transition-all select-none shrink-0 cursor-pointer touch-manipulation ${
        isReady && isPredicting
          ? 'bg-[#FFC928] hover:bg-[#FFE380] text-[#111111] shadow-[6px_6px_0px_#111111] active:shadow-[1px_1px_0px_#111111]'
          : 'bg-[#E9E2D3] text-[#78716C] shadow-[3px_3px_0px_#111111] cursor-not-allowed opacity-75'
      }`}
    >
      <Lock className={`w-5 h-5 stroke-[2.5] ${isReady ? 'text-[#111111]' : 'text-[#78716C]'}`} />
      <span>{isReady ? 'LOCK IN PREDICTION' : 'SELECT AN OPTION'}</span>
      {isReady && <ArrowRight className="w-5 h-5 stroke-[3] text-[#111111]" />}
    </motion.button>
  );
};
