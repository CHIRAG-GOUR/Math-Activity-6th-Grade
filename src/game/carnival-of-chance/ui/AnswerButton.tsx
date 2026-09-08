// ============================================================
// THE GREAT CARNIVAL OF CHANCE — NEUBRUTALIST ANSWER BUTTON
// Compact Responsive Push Card for Zero-Overflow Viewports
// Green for Correct, Red for Wrong, Yellow for Selected
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

  // Visual state computation:
  // Show Green ONLY if this choice was actually selected and correct!
  // If a player picked wrong, show RED ONLY on their wrong choice without revealing the right answer.
  const showCorrect = isLocked && isSelected && isCorrect;
  const showWrong = isLocked && isSelected && isWrong;

  let buttonStyle: React.CSSProperties = {
    backgroundColor: '#FFFFFF',
    border: '2.5px solid #000000',
    boxShadow: '2.5px 2.5px 0px #000000',
    borderRadius: '10px',
    color: '#000000',
  };

  if (showCorrect) {
    buttonStyle = {
      backgroundColor: '#00F0A8',
      border: '3px solid #000000',
      boxShadow: '3px 3px 0px #000000',
      borderRadius: '10px',
      color: '#000000',
    };
  } else if (showWrong) {
    buttonStyle = {
      backgroundColor: '#FF2A6D',
      border: '3px solid #000000',
      boxShadow: '3px 3px 0px #000000',
      borderRadius: '10px',
      color: '#FFFFFF',
    };
  } else if (isSelected && !isLocked) {
    buttonStyle = {
      backgroundColor: '#FED500',
      border: '3px solid #000000',
      boxShadow: '3px 3px 0px #000000',
      borderRadius: '10px',
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
      whileTap={!disabled ? { scale: 0.98, x: 1, y: 1 } : {}}
      animate={
        showCorrect
          ? { scale: [1, 0.97, 1.02, 1], transition: { duration: 0.35 } }
          : showWrong
          ? { x: [0, -3, 3, -3, 3, 0], transition: { duration: 0.3 } }
          : {}
      }
      className={`relative w-full h-[38px] sm:h-[42px] px-2 sm:px-2.5 py-1 flex items-center justify-between gap-1.5 select-none cursor-pointer touch-manipulation transition-colors shrink-0 ${
        disabled && !showCorrect && !showWrong ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {/* ── Left: Stacked Fraction Display & Choice Text ── */}
      <div className="flex-1 min-w-0 text-left flex items-center gap-1.5 sm:gap-2">
        <div
          style={{
            backgroundColor: showCorrect
              ? '#FFFFFF'
              : showWrong
              ? 'rgba(0,0,0,0.25)'
              : isSelected
              ? '#FFFFFF'
              : '#FED500',
            border: '1.5px solid #000000',
            boxShadow: '1px 1px 0px #000000',
            borderRadius: '6px',
            padding: '1px 4px',
          }}
          className="shrink-0"
        >
          <MathFractionDisplay fraction={choice.fraction} size="sm" />
        </div>

        <span
          className={`text-[10px] sm:text-[11px] font-black truncate ${
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
            border: '1.5px solid #000000',
            borderRadius: '6px',
          }}
          className="flex items-center gap-0.5 px-1.5 py-0.2 shrink-0"
        >
          <Check className="w-3 h-3 text-[#00F0A8] stroke-[3.5]" />
          <span className="text-[8px] font-black uppercase tracking-wider text-[#00F0A8]">
            CORRECT!
          </span>
        </div>
      )}

      {showWrong && (
        <div
          style={{
            backgroundColor: '#000000',
            color: '#FFFFFF',
            border: '1.5px solid #000000',
            borderRadius: '6px',
          }}
          className="flex items-center gap-0.5 px-1.5 py-0.2 shrink-0"
        >
          <X className="w-3 h-3 text-[#FF2A6D] stroke-[3.5]" />
          <span className="text-[8px] font-black uppercase tracking-wider text-white">
            WRONG
          </span>
        </div>
      )}

      {/* Selected Indicator Bullet (Radio Circle) */}
      {!isLocked && (
        <div
          style={{
            backgroundColor: isSelected ? (isBlue ? '#2563EB' : '#FF2A6D') : '#FFFFFF',
            border: '2px solid #000000',
            boxShadow: '1px 1px 0px #000000',
          }}
          className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
        >
          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
        </div>
      )}
    </motion.button>
  );
};

