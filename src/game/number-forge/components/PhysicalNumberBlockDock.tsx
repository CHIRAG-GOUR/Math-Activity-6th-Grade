'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { soundManager } from '@/utils/audio';

interface PhysicalNumberBlockDockProps {
  onSelectDigit: (digit: number) => void;
  disabled?: boolean;
}

export const PhysicalNumberBlockDock: React.FC<PhysicalNumberBlockDockProps> = ({
  onSelectDigit,
  disabled = false,
}) => {
  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 p-3 rounded-3xl bg-amber-950/80 border-3 border-amber-500/80 shadow-2xl backdrop-blur-md select-none">
      <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-amber-300 font-game mr-1 hidden sm:inline">
        FORGE BLOCKS:
      </span>
      {digits.map((d) => (
        <motion.button
          key={d}
          whileHover={{ scale: 1.12, y: -4 }}
          whileTap={{ scale: 0.92 }}
          disabled={disabled}
          onClick={() => {
            if (!disabled) {
              soundManager.playKeypadBeep();
              onSelectDigit(d);
            }
          }}
          className={`w-11 h-12 sm:w-14 sm:h-16 rounded-2xl flex flex-col items-center justify-center font-black font-bank text-xl sm:text-2xl shadow-lg transition-all cursor-pointer ${
            disabled
              ? 'bg-slate-800 text-slate-500 border-2 border-slate-700 cursor-not-allowed'
              : 'bg-gradient-to-b from-[#fcd34d] via-[#f59e0b] to-[#b45309] border-3 border-white text-slate-950 shadow-[0_6px_0_#78350f,0_10px_20px_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-[0_2px_0_#78350f]'
          }`}
        >
          <span>{d}</span>
        </motion.button>
      ))}
    </div>
  );
};
