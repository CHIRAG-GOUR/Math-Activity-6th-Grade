// ============================================================
// THE GREAT CARNIVAL OF CHANCE — NEUBRUTALIST SUBMIT ACTUATOR
// Compact Physical Action Push Button for Zero-Overflow Viewports
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
  customLabel?: string;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  isReady,
  isConfirmed,
  isPredicting,
  onConfirm,
  teamColor = 'blue',
  customLabel,
}) => {
  const disabled = !isPredicting || !isReady || isConfirmed;

  if (isConfirmed) {
    return (
      <div
        style={{
          backgroundColor: '#00F0A8',
          border: '3px solid #000000',
          boxShadow: '3px 3px 0px #000000',
          borderRadius: '12px',
          color: '#000000',
        }}
        className="w-full h-[38px] sm:h-[42px] flex items-center justify-center gap-1.5 font-black text-xs uppercase tracking-wider select-none shrink-0"
      >
        <CheckCircle2 className="w-4 h-4 stroke-[3.5] text-black" />
        <span>PREDICTION LOCKED!</span>
      </div>
    );
  }

  const activeStyle: React.CSSProperties = isReady && isPredicting
    ? {
        backgroundColor: '#FED500',
        border: '3px solid #000000',
        boxShadow: '3px 3px 0px #000000',
        borderRadius: '12px',
        color: '#000000',
        cursor: 'pointer',
      }
    : {
        backgroundColor: '#FFF7E5',
        border: '2px solid #000000',
        boxShadow: '2px 2px 0px #000000',
        borderRadius: '12px',
        color: '#94A3B8',
        cursor: 'not-allowed',
      };

  const actionText = customLabel || 'LOCK IN PREDICTION';

  return (
    <motion.button
      type="button"
      onPointerDown={onConfirm}
      disabled={disabled}
      style={activeStyle}
      whileTap={!disabled ? { scale: 0.98, x: 1, y: 1 } : {}}
      className="w-full h-[38px] sm:h-[42px] px-3 flex items-center justify-center gap-1.5 font-black text-xs uppercase tracking-wider select-none shrink-0 touch-manipulation transition-all"
    >
      <Lock className={`w-3.5 h-3.5 stroke-[3] ${isReady ? 'text-black' : 'text-[#94A3B8]'}`} />
      <span className="truncate">{isReady ? actionText : 'CHOOSE AN OPTION'}</span>
      {isReady && <ArrowRight className="w-3.5 h-3.5 stroke-[3.5] text-black shrink-0" />}
    </motion.button>
  );
};

