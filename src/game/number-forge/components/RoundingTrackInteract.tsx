'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MathChallenge } from '../types';
import { soundManager } from '@/utils/audio';
import { ArrowLeftRight, Check, Compass, Sparkles } from 'lucide-react';

interface RoundingTrackInteractProps {
  challenge: MathChallenge;
  onSubmit: (chosenBenchmark: number) => void;
  disabled?: boolean;
}

export const RoundingTrackInteract: React.FC<RoundingTrackInteractProps> = ({
  challenge,
  onSubmit,
  disabled = false,
}) => {
  const pegs = challenge.data.benchmarkPegs || [470000, 475000, 480000];
  const [lower, mid, upper] = pegs;
  const num = challenge.targetNumber || 476281;

  const [selectedBenchmark, setSelectedBenchmark] = useState<number | null>(null);

  // Calculate proportional position on the track (0% to 100%)
  const percentage = Math.min(Math.max(((num - lower) / (upper - lower)) * 100, 5), 95);

  const handleSelectBenchmark = (val: number) => {
    if (disabled) return;
    soundManager.playKeypadBeep();
    setSelectedBenchmark(val);
  };

  const handleConfirm = () => {
    if (!selectedBenchmark || disabled) return;
    onSubmit(selectedBenchmark);
  };

  return (
    <div className="w-full max-w-4xl flex flex-col items-center gap-6 select-none">
      
      {/* TARGET NUMBER CARVED DISPLAY */}
      <div className="flex flex-col items-center text-center p-4 rounded-3xl bg-amber-950/90 border-3 border-amber-400 shadow-2xl backdrop-blur-md">
        <span className="text-xs font-black uppercase tracking-widest text-amber-300 font-game mb-1">
          NUMBER TO ROUND:
        </span>
        <span className="text-4xl sm:text-5xl font-black font-bank text-amber-400 tracking-wider">
          {num.toLocaleString()}
        </span>
      </div>

      {/* MECHANICAL WOODEN ROUNDING TRACK */}
      <div className="w-full p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#854519] via-[#6e3b18] to-[#45220c] border-4 border-[#d4944d] shadow-[0_20px_50px_rgba(0,0,0,0.7)] relative">
        
        {/* Track Rail Groove */}
        <div className="w-full h-8 sm:h-10 rounded-full bg-slate-950 border-3 border-[#3d1d07] shadow-inner relative flex items-center px-4">
          
          {/* Calibrated Midpoint Notch */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1.5 bg-amber-400/80 shadow-[0_0_10px_#ffd700]" />

          {/* Magnetic Number Puck on Track */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{ left: `${percentage}%` }}
            className="absolute -translate-x-1/2 -top-6 sm:-top-7 z-20 flex flex-col items-center cursor-grab active:cursor-grabbing"
          >
            <div className="px-3 py-1 rounded-xl bg-amber-300 border-2 border-slate-950 text-slate-950 font-black font-bank text-sm sm:text-base shadow-[0_8px_15px_rgba(0,0,0,0.6)] flex items-center gap-1">
              <Compass className="w-4 h-4 text-amber-800 animate-spin" />
              <span>{num.toLocaleString()}</span>
            </div>
            <div className="w-4 h-4 bg-amber-400 rotate-45 -mt-2 border-r-2 border-b-2 border-slate-950" />
          </motion.div>

        </div>

        {/* BENCHMARK PEGS (LOWER / MIDPOINT / UPPER) */}
        <div className="w-full flex items-start justify-between mt-6 px-1">
          
          {/* LOWER BENCHMARK BUTTON */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelectBenchmark(lower)}
            disabled={disabled}
            className={`flex flex-col items-center p-3 sm:p-4 rounded-2xl border-3 transition-all cursor-pointer shadow-xl ${
              selectedBenchmark === lower
                ? 'bg-amber-300 border-white text-slate-950 ring-4 ring-amber-400 scale-105'
                : 'bg-amber-900/90 border-amber-600/80 text-amber-200 hover:bg-amber-800'
            }`}
          >
            <span className="text-[10px] font-black tracking-widest uppercase font-game">
              LOWER BENCHMARK
            </span>
            <span className="text-xl sm:text-2xl font-black font-bank mt-1">
              {lower.toLocaleString()}
            </span>
            <span className="text-[9px] font-bold text-amber-300/80 mt-0.5">
              (4 or less stays here)
            </span>
          </motion.button>

          {/* MIDPOINT INDICATOR */}
          <div className="flex flex-col items-center text-center p-2 rounded-xl bg-slate-950/60 border border-amber-400/40 text-amber-300">
            <span className="text-[9px] font-black uppercase font-game">MIDPOINT PEG</span>
            <span className="text-sm sm:text-base font-black font-bank">
              {mid.toLocaleString()}
            </span>
            <span className="text-[8px] text-slate-300 mt-0.5">
              Cutoff threshold: ≥ {mid.toLocaleString()}
            </span>
          </div>

          {/* UPPER BENCHMARK BUTTON */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelectBenchmark(upper)}
            disabled={disabled}
            className={`flex flex-col items-center p-3 sm:p-4 rounded-2xl border-3 transition-all cursor-pointer shadow-xl ${
              selectedBenchmark === upper
                ? 'bg-amber-300 border-white text-slate-950 ring-4 ring-amber-400 scale-105'
                : 'bg-amber-900/90 border-amber-600/80 text-amber-200 hover:bg-amber-800'
            }`}
          >
            <span className="text-[10px] font-black tracking-widest uppercase font-game">
              UPPER BENCHMARK
            </span>
            <span className="text-xl sm:text-2xl font-black font-bank mt-1">
              {upper.toLocaleString()}
            </span>
            <span className="text-[9px] font-bold text-amber-300/80 mt-0.5">
              (5 or more rounds UP)
            </span>
          </motion.button>

        </div>

      </div>

      {/* CONFIRM LOCK-IN BUTTON */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleConfirm}
        disabled={!selectedBenchmark || disabled}
        className={`px-12 py-4 rounded-2xl border-2 border-white font-black text-lg font-game uppercase tracking-wider shadow-2xl flex items-center gap-2 cursor-pointer transition-all ${
          selectedBenchmark && !disabled
            ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-slate-950 shadow-[0_0_30px_rgba(255,215,0,0.6)] hover:brightness-110'
            : 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'
        }`}
      >
        <Check className="w-6 h-6 stroke-[3]" />
        <span>LOCK IN ROUNDED BENCHMARK</span>
      </motion.button>

    </div>
  );
};
