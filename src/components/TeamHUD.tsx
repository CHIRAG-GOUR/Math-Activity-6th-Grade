'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Zap } from 'lucide-react';
import { OrnateKey } from './OrnateKey';
import { TeamState } from '@/types/game';

interface TeamHUDProps {
  team: TeamState;
}

export const TeamHUD: React.FC<TeamHUDProps> = ({ team }) => {
  const isBlue = team.id === 'blue';

  return (
    <div
      className={`relative p-3.5 sm:p-4.5 min-w-[260px] sm:min-w-[300px] md:min-w-[340px] select-none ${
        isBlue ? 'chamfer-hud-blue' : 'chamfer-hud-red'
      }`}
    >
      {/* Decorative Hardware Rivets */}
      <div
        className={`absolute top-2 ${
          isBlue ? 'left-4' : 'right-4'
        } w-2.5 h-2.5 rounded-full ${
          isBlue ? 'bg-cyan-300 shadow-[0_0_10px_#00e5ff]' : 'bg-rose-300 shadow-[0_0_10px_#ff2a5f]'
        }`}
      />
      <div
        className={`absolute bottom-2 ${
          isBlue ? 'right-4' : 'left-4'
        } w-2 h-2 rounded-full ${
          isBlue ? 'bg-cyan-500/70' : 'bg-rose-500/70'
        }`}
      />

      {/* Team Header Title & Boost Badge */}
      <div className="flex items-center justify-between border-b border-slate-700/80 pb-2 mb-2.5">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-3.5 h-3.5 rounded-full ${
              isBlue
                ? 'bg-cyan-400 shadow-[0_0_14px_#00e5ff]'
                : 'bg-rose-400 shadow-[0_0_14px_#ff2a5f]'
            }`}
          />
          <h2
            className={`text-xl sm:text-2xl font-black tracking-wider uppercase font-game ${
              isBlue ? 'blue-neon-text' : 'red-neon-text'
            }`}
          >
            {team.name}
          </h2>
        </div>

        {/* Multiplier Boost Badge */}
        {team.multiplier > 1 && (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className={`px-3 py-0.5 rounded-full text-xs font-black uppercase font-game shadow-[0_0_15px_currentColor] flex items-center gap-1 ${
              team.multiplier === 3
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-amber-400 text-slate-950 font-black'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>×{team.multiplier} BOOST</span>
          </motion.div>
        )}
      </div>

      {/* Main Score & Streak Rows */}
      <div className="flex items-center justify-between mb-3 px-1">
        {/* Giant Score */}
        <div className="flex flex-col">
          <span className="text-[11px] font-black tracking-widest uppercase text-slate-400 font-game">
            SCORE
          </span>
          <motion.div
            key={team.score}
            initial={{ scale: 1.15, filter: 'brightness(1.5)' }}
            animate={{ scale: 1, filter: 'brightness(1)' }}
            className="flex items-baseline gap-1.5"
          >
            <span className="text-4xl sm:text-5xl font-black tracking-tight font-display text-white drop-shadow-[0_4px_14px_rgba(0,0,0,1)]">
              {team.score}
            </span>
            <span className="text-xs font-black text-amber-400 uppercase font-game">
              PTS
            </span>
          </motion.div>
        </div>

        {/* Streak */}
        <div className="flex flex-col items-end">
          <span className="text-[11px] font-black tracking-widest uppercase text-slate-400 font-game">
            STREAK
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-amber-300 font-game">
              {team.streak}
            </span>
            <Flame
              className={`w-6 h-6 ${
                team.streak >= 3
                  ? 'text-amber-400 fill-amber-400 animate-bounce drop-shadow-[0_0_12px_#ffd700]'
                  : team.streak > 0
                  ? 'text-amber-500 fill-amber-500/70'
                  : 'text-slate-600'
              }`}
            />
          </div>
        </div>
      </div>

      {/* 3 Physical Vault Key Slots */}
      <div className="flex flex-col gap-1 pt-1 border-t border-slate-700/60">
        <div className="flex items-center justify-between text-[11px] font-black tracking-wider uppercase font-game text-slate-300">
          <span>VAULT KEYS</span>
          <span className={isBlue ? 'text-cyan-300' : 'text-rose-300'}>
            {team.keys}/3
          </span>
        </div>

        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-black/60 border border-slate-700/80 shadow-inner">
          {[1, 2, 3].map((slotIdx) => {
            const isFilled = team.keys >= slotIdx;
            return (
              <div
                key={slotIdx}
                className="relative flex-1 h-9 rounded-lg bg-slate-950/90 border border-slate-700 flex items-center justify-center overflow-hidden"
              >
                {isFilled ? (
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                    className="flex items-center justify-center"
                  >
                    <OrnateKey size={22} color={isBlue ? 'blue' : 'red'} />
                  </motion.div>
                ) : (
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
