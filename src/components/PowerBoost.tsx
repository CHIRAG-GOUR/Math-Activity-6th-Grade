'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Flame } from 'lucide-react';
import { TeamId } from '@/types/game';
import { soundManager } from '@/utils/audio';

interface PowerBoostProps {
  team: TeamId;
  currentMultiplier: 1 | 2 | 3;
  disabled?: boolean;
  onSelectMultiplier: (multiplier: 1 | 2 | 3) => void;
}

export const PowerBoost: React.FC<PowerBoostProps> = ({
  team,
  currentMultiplier,
  disabled = false,
  onSelectMultiplier,
}) => {
  const boosts = [
    {
      multiplier: 1 as const,
      label: 'SAFE',
      icon: Shield,
      sub: '1x Points',
      activeBg: 'bg-gradient-to-b from-emerald-400 via-teal-500 to-emerald-800',
      activeBorder: 'border-emerald-200 shadow-[0_4px_0_#064e3b,0_0_20px_rgba(52,211,153,0.8)]',
      iconColor: 'text-emerald-300',
    },
    {
      multiplier: 2 as const,
      label: 'RISKY',
      icon: Zap,
      sub: '2x Points',
      activeBg: 'bg-gradient-to-b from-amber-400 via-yellow-500 to-amber-700',
      activeBorder: 'border-yellow-200 shadow-[0_4px_0_#78350f,0_0_25px_rgba(251,191,36,0.9)]',
      iconColor: 'text-amber-300',
    },
    {
      multiplier: 3 as const,
      label: 'DANGEROUS',
      icon: Flame,
      sub: '3x Points',
      activeBg: 'bg-gradient-to-b from-rose-400 via-red-500 to-rose-800',
      activeBorder: 'border-rose-200 shadow-[0_4px_0_#4c0519,0_0_30px_rgba(244,63,94,1)]',
      iconColor: 'text-rose-300',
    },
  ];

  return (
    <div className="flex flex-col items-center gap-1.5 w-full select-none">
      <div className="flex items-center gap-1 text-[11px] font-black tracking-widest uppercase font-game text-amber-300">
        <Zap className="w-3.5 h-3.5 text-amber-400" />
        <span>POWER MULTIPLIER BOOST</span>
      </div>

      <div className="flex items-center justify-center gap-2 sm:gap-3 w-full">
        {boosts.map((b) => {
          const isSelected = currentMultiplier === b.multiplier;
          const Icon = b.icon;

          return (
            <motion.button
              key={b.multiplier}
              whileTap={{ scale: disabled ? 1 : 0.93 }}
              disabled={disabled}
              onPointerDown={(e) => {
                e.stopPropagation();
                if (disabled) return;
                soundManager.playMultiplier(b.multiplier);
                onSelectMultiplier(b.multiplier);
              }}
              className={`tactile-btn relative flex-1 max-w-[140px] py-2 px-2 rounded-2xl flex flex-col items-center justify-center border-2 transition-all ${
                isSelected
                  ? `${b.activeBg} ${b.activeBorder} text-slate-950 font-black ring-2 ring-white/50`
                  : 'bg-gradient-to-b from-[#141b2c] via-[#0d121f] to-[#080b14] border-slate-700/80 shadow-[0_4px_0_#04060c] text-slate-400 hover:border-slate-500 hover:text-slate-200'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {/* Highlight badge on active */}
              {isSelected && (
                <div className="absolute -top-2 px-2 py-0.2 rounded-full bg-white text-slate-950 text-[9px] font-black tracking-widest uppercase shadow">
                  SELECTED
                </div>
              )}

              <div className="flex items-center gap-1">
                <Icon className={`w-4 h-4 ${isSelected ? 'text-slate-950' : b.iconColor}`} />
                <span className={`text-base sm:text-lg font-black tracking-wide font-game ${isSelected ? 'text-slate-950' : 'text-white'}`}>
                  ×{b.multiplier}
                </span>
              </div>
              <span className={`text-[10px] font-black tracking-wider uppercase font-game ${isSelected ? 'text-slate-900' : 'text-slate-400'}`}>
                {b.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
