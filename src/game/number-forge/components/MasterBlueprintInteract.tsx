'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MathChallenge } from '../types';
import { PhysicalNumberBlockDock } from './PhysicalNumberBlockDock';
import { soundManager } from '@/utils/audio';
import { Check, CheckCircle2, FileCode, RotateCcw, ShieldCheck, XCircle } from 'lucide-react';

interface MasterBlueprintInteractProps {
  challenge: MathChallenge;
  onSubmit: (constructedNumberStr: string) => void;
  disabled?: boolean;
}

export const MasterBlueprintInteract: React.FC<MasterBlueprintInteractProps> = ({
  challenge,
  onSubmit,
  disabled = false,
}) => {
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [selectedSlotIdx, setSelectedSlotIdx] = useState<number>(0);

  const slotLabels = ['HUNDRED THOUSANDS', 'TEN THOUSANDS', 'THOUSANDS', 'HUNDREDS', 'TENS', 'ONES'];
  const slotShort = ['HTh', 'TTh', 'Th', 'H', 'T', 'O'];

  const handleDigitSelect = (d: number) => {
    if (disabled) return;
    const newDigits = [...digits];
    newDigits[selectedSlotIdx] = String(d);
    setDigits(newDigits);

    // Advance to next slot
    if (selectedSlotIdx < 5) {
      setSelectedSlotIdx(selectedSlotIdx + 1);
    }
  };

  const handleReset = () => {
    soundManager.playClick();
    setDigits(['', '', '', '', '', '']);
    setSelectedSlotIdx(0);
  };

  const currentNumberStr = digits.join('');
  const constraints = challenge.data.blueprintConstraints || [];

  const handleFinalSubmit = () => {
    if (disabled || currentNumberStr.length !== 6) return;
    onSubmit(currentNumberStr);
  };

  return (
    <div className="w-full max-w-4xl flex flex-col items-center gap-5 select-none">
      
      {/* 1. 6-SLOT PHYSICAL NUMBER ASSEMBLER */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 w-full flex-wrap">
        {slotShort.map((label, idx) => {
          const isSelected = selectedSlotIdx === idx;
          const val = digits[idx];

          return (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                soundManager.playClick();
                setSelectedSlotIdx(idx);
              }}
              disabled={disabled}
              className={`w-14 h-20 sm:w-20 sm:h-28 rounded-2xl flex flex-col items-center justify-between p-2 border-3 transition-all cursor-pointer shadow-xl ${
                isSelected
                  ? 'bg-amber-100 border-amber-400 ring-4 ring-amber-400/50 scale-105'
                  : 'bg-white/95 border-slate-300 hover:border-amber-300'
              }`}
            >
              <span className="text-[10px] font-black text-slate-700 font-game">{label}</span>
              <span className="text-3xl sm:text-5xl font-black font-bank text-slate-950">
                {val !== '' ? val : '·'}
              </span>
              <span className="text-[8px] font-bold text-slate-400 font-mono">SLOT {idx + 1}</span>
            </motion.button>
          );
        })}
      </div>

      {/* 2. REAL-TIME BLUEPRINT CONSTRAINTS VALIDATION GAUGES */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-4 rounded-3xl bg-amber-950/90 border-3 border-amber-400 shadow-2xl backdrop-blur-md">
        <div className="sm:col-span-2 flex items-center gap-2 border-b border-amber-500/30 pb-2">
          <FileCode className="w-5 h-5 text-amber-400" />
          <span className="text-xs font-black uppercase tracking-widest text-amber-300 font-game">
            CHAMBER CONSTRAINTS VERIFICATION:
          </span>
        </div>

        {constraints.map((c) => {
          const isPassed = currentNumberStr.length === 6 && c.check(currentNumberStr);

          return (
            <div
              key={c.id}
              className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all text-xs font-semibold ${
                isPassed
                  ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200'
                  : 'bg-slate-900/60 border-slate-700 text-slate-300'
              }`}
            >
              {isPassed ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-slate-500 shrink-0" />
              )}
              <span>{c.description}</span>
            </div>
          );
        })}
      </div>

      {/* 3. PHYSICAL NUMBER BLOCKS */}
      <PhysicalNumberBlockDock onSelectDigit={handleDigitSelect} disabled={disabled} />

      {/* 4. ACTIONS */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleReset}
          disabled={disabled}
          className="px-5 py-2.5 rounded-2xl bg-white border-2 border-slate-300 text-slate-800 font-black text-xs font-game uppercase shadow hover:bg-slate-50 transition cursor-pointer flex items-center gap-1.5"
        >
          <RotateCcw className="w-4 h-4" />
          <span>RESET BLUEPRINT</span>
        </button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleFinalSubmit}
          disabled={currentNumberStr.length !== 6 || disabled}
          className={`px-12 py-3.5 rounded-2xl border-2 border-white font-black text-base sm:text-lg font-game uppercase tracking-wider shadow-2xl flex items-center gap-2 cursor-pointer transition-all ${
            currentNumberStr.length === 6 && !disabled
              ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-slate-950 shadow-[0_0_25px_rgba(255,215,0,0.6)] hover:brightness-110'
              : 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'
          }`}
        >
          <ShieldCheck className="w-5 h-5 stroke-[3]" />
          <span>SUBMIT MASTER BLUEPRINT</span>
        </motion.button>
      </div>

    </div>
  );
};
