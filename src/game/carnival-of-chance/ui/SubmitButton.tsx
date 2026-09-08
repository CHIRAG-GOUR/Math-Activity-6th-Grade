// ============================================================
// THE GREAT CARNIVAL OF CHANCE — NEUBRUTALIST SUBMIT ACTUATOR
// Massive Physical Action Push Button with Guaranteed Inline Styles
// Yellow Active, Mint Green Locked, 4px Black Outlines & 6px Hard Shadows
// ============================================================

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Lock, ArrowRight } from 'lucide-react';

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
      <div
        style={{
          backgroundColor: '#00F0A8',
          border: '4px solid #000000',
          boxShadow: '5px 5px 0px #000000',
          borderRadius: '16px',
          color: '#000000',
        }}
        className="w-full h-[58px] sm:h-[64px] flex items-center justify-center gap-2 font-black text-xs sm:text-sm uppercase tracking-wider select-none shrink-0"
      >
        <CheckCircle2 className="w-5 h-5 stroke-[3.5] text-black" />
        <span>PREDICTION LOCKED!</span>
      </div>
    );
  }

  const activeStyle: React.CSSProperties = isReady && isPredicting
    ? {
        backgroundColor: '#FED500',
        border: '4px solid #000000',
        boxShadow: '6px 6px 0px #000000',
        borderRadius: '16px',
        color: '#000000',
        cursor: 'pointer',
      }
    : {
        backgroundColor: '#E2E8F0',
        border: '3px solid #000000',
        boxShadow: '3px 3px 0px #000000',
        borderRadius: '16px',
        color: '#64748B',
        cursor: 'not-allowed',
      };

  return (
    <motion.button
      type="button"
      onPointerDown={onConfirm}
      disabled={disabled}
      style={activeStyle}
      whileTap={!disabled ? { scale: 0.97, x: 2, y: 2 } : {}}
      className="w-full h-[58px] sm:h-[64px] flex items-center justify-center gap-2.5 font-black text-xs sm:text-sm uppercase tracking-wider select-none shrink-0 touch-manipulation transition-all"
    >
      <Lock className={`w-4 h-4 stroke-[3] ${isReady ? 'text-black' : 'text-[#64748B]'}`} />
      <span>{isReady ? 'LOCK IN PREDICTION' : 'CHOOSE AN OPTION'}</span>
      {isReady && <ArrowRight className="w-4 h-4 stroke-[3.5] text-black" />}
    </motion.button>
  );
};
