// ============================================================
// THE GREAT CARNIVAL OF CHANCE — NEUBRUTALIST ANSWER BUTTON
// Clean, Harmoniously Proportioned Push Card for Zero-Overflow Viewports
// Green for Correct, Red for Wrong, Yellow for Selected
// ============================================================

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AnswerChoice, TeamId } from '../types';
import { Check, X } from 'lucide-react';

interface AnswerButtonProps {
  choice: AnswerChoice;
  choiceIndex?: number;
  teamId: TeamId;
  isSelected: boolean;
  isConfirmed: boolean;
  isLocked: boolean;
  isPredicting: boolean;
  onSelect: (e: React.PointerEvent) => void;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

export const AnswerButton: React.FC<AnswerButtonProps> = ({
  choice,
  choiceIndex = 0,
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

  const letter = OPTION_LETTERS[choiceIndex] || `${choiceIndex + 1}`;

  let buttonBg = '#FFFFFF';
  let buttonBorder = '2.5px solid #000000';
  let buttonShadow = '2.5px 2.5px 0px #000000';
  let textColor = '#000000';

  if (showCorrect) {
    buttonBg = '#00F0A8';
    buttonBorder = '3px solid #000000';
    buttonShadow = '3px 3px 0px #000000';
    textColor = '#000000';
  } else if (showWrong) {
    buttonBg = '#FF2A6D';
    buttonBorder = '3px solid #000000';
    buttonShadow = '3px 3px 0px #000000';
    textColor = '#FFFFFF';
  } else if (isSelected && !isLocked) {
    buttonBg = '#FED500';
    buttonBorder = '3px solid #000000';
    buttonShadow = '3px 3px 0px #000000';
    textColor = '#000000';
  }

  const disabled = !isPredicting || isLocked;

  return (
    <motion.button
      type="button"
      onPointerDown={onSelect}
      disabled={disabled}
      style={{
        backgroundColor: buttonBg,
        border: buttonBorder,
        boxShadow: buttonShadow,
        borderRadius: '12px',
        color: textColor,
      }}
      whileTap={!disabled ? { scale: 0.98, x: 1, y: 1 } : {}}
      animate={
        showCorrect
          ? { scale: [1, 0.97, 1.02, 1], transition: { duration: 0.35 } }
          : showWrong
          ? { x: [0, -3, 3, -3, 3, 0], transition: { duration: 0.3 } }
          : {}
      }
      className={`relative w-full h-[44px] sm:h-[48px] px-2.5 py-1.5 flex items-center justify-between gap-2 select-none cursor-pointer touch-manipulation transition-all shrink-0 ${
        disabled && !showCorrect && !showWrong ? 'opacity-55 cursor-not-allowed' : ''
      }`}
    >
      {/* ── Left: Option Letter Pill + Fraction / Value Text ── */}
      <div className="flex-1 min-w-0 text-left flex items-center gap-2">
        {/* Option Letter Stamp (A, B, C, D) */}
        <div
          style={{
            backgroundColor: showCorrect
              ? '#000000'
              : showWrong
              ? '#000000'
              : isSelected
              ? '#000000'
              : '#FED500',
            color: showCorrect
              ? '#00F0A8'
              : showWrong
              ? '#FFFFFF'
              : isSelected
              ? '#FED500'
              : '#000000',
            border: '2px solid #000000',
            boxShadow: '1.5px 1.5px 0px #000000',
            borderRadius: '8px',
          }}
          className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center font-black text-xs shrink-0"
        >
          {letter}
        </div>

        {/* Clean Math Fraction / Answer Label */}
        <div className="flex items-center gap-1.5 min-w-0 truncate">
          {choice.fraction && (
            <span
              style={{
                backgroundColor: showCorrect
                  ? 'rgba(0,0,0,0.12)'
                  : showWrong
                  ? 'rgba(0,0,0,0.25)'
                  : '#FFF7E5',
                border: '1.5px solid #000000',
                borderRadius: '6px',
              }}
              className="px-1.5 py-0.5 font-mono font-black text-[11px] sm:text-xs shrink-0 text-black"
            >
              {choice.fraction.numerator}/{choice.fraction.denominator}
            </span>
          )}

          <span
            className={`font-black text-xs sm:text-[13px] truncate ${
              showWrong ? 'text-white' : 'text-black'
            }`}
          >
            {choice.label.includes('/') && choice.fraction
              ? choice.fraction.percentage
                ? `(${choice.fraction.percentage})`
                : ''
              : choice.label}
          </span>
        </div>
      </div>

      {/* ── Right: Neubrutalist Outcome Status Stamps or Radio Indicator ── */}
      {showCorrect && (
        <div
          style={{
            backgroundColor: '#000000',
            color: '#00F0A8',
            border: '1.5px solid #000000',
            borderRadius: '6px',
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
            border: '1.5px solid #000000',
            borderRadius: '6px',
          }}
          className="flex items-center gap-1 px-2 py-0.5 shrink-0"
        >
          <X className="w-3.5 h-3.5 text-[#FF2A6D] stroke-[3.5]" />
          <span className="text-[9px] font-black uppercase tracking-wider text-white">
            WRONG
          </span>
        </div>
      )}

      {/* Selected Indicator Bullet (Neubrutalist Radio Circle) */}
      {!isLocked && (
        <div
          style={{
            backgroundColor: isSelected ? (isBlue ? '#2563EB' : '#FF2A6D') : '#FFFFFF',
            border: '2.5px solid #000000',
            boxShadow: '1.5px 1.5px 0px #000000',
          }}
          className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
        >
          {isSelected && <div className="w-2 h-2 rounded-full bg-white shadow-xs" />}
        </div>
      )}
    </motion.button>
  );
};
