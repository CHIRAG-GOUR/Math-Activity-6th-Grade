'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Trophy, Zap } from 'lucide-react';
import { VaultKeys } from './VaultKeys';
import { TeamState } from '@/types/game';

interface TeamPanelProps {
  team: TeamState;
}

export const TeamPanel: React.FC<TeamPanelProps> = ({ team }) => {
  const isBlue = team.id === 'blue';

  return (
    <div
      className={`relative p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl min-w-[250px] sm:min-w-[290px] md:min-w-[330px] transition-all select-none ${
        isBlue ? 'hud-panel-blue' : 'hud-panel-red'
      }`}
    >
      {/* Corner Metallic Bolts */}
      <div className={`absolute top-2.5 ${isBlue ? 'left-2.5' : 'right-2.5'} w-2.5 h-2.5 rounded-full ${isBlue ? 'bg-cyan-300' : 'bg-rose-300'} shadow-[0_0_8px_currentColor]`} />
      <div className={`absolute bottom-2.5 ${isBlue ? 'right-2.5' : 'left-2.5'} w-2 h-2 rounded-full ${isBlue ? 'bg-cyan-500/60' : 'bg-rose-500/60'}`} />

      {/* Team Header */}
      <div className="flex items-center justify-between border-b border-slate-700/70 pb-2 mb-2.5">
        <div className="flex items-center gap-2">
          <div
            className={`w-3.5 h-3.5 rounded-full ${
              isBlue
                ? 'bg-cyan-400 shadow-[0_0_12px_#00f0ff]'
                : 'bg-rose-400 shadow-[0_0_12px_#ff3366]'
            }`}
          />
          <h2
            className={`text-xl sm:text-2xl font-black tracking-wider uppercase font-game ${
              isBlue ? 'blue-gradient-text' : 'red-gradient-text'
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
            className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase font-game shadow-[0_0_12px_currentColor] flex items-center gap-1 ${
              team.multiplier === 3
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-amber-400 text-slate-950 font-black'
            }`}
          >
            <Zap className="w-3 h-3" />
            <span>×{team.multiplier} BOOST</span>
          </motion.div>
        )}
      </div>

      {/* Score & Streak Section */}
      <div className="flex items-center justify-between mb-3 px-1">
        {/* Score */}
        <div className="flex flex-col">
          <span className="text-[11px] font-extrabold tracking-widest uppercase text-slate-400 font-game">
            TEAM SCORE
          </span>
          <motion.div
            key={team.score}
            initial={{ scale: 1.15, filter: 'brightness(1.5)' }}
            animate={{ scale: 1, filter: 'brightness(1)' }}
            className="flex items-baseline gap-1"
          >
            <span className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight font-display text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
              {team.score}
            </span>
            <span className="text-xs font-black text-amber-400 uppercase font-game">
              PTS
            </span>
          </motion.div>
        </div>

        {/* Streak */}
        <div className="flex flex-col items-end">
          <span className="text-[11px] font-extrabold tracking-widest uppercase text-slate-400 font-game">
            STREAK
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-amber-300 font-game">
              {team.streak}
            </span>
            <Flame
              className={`w-6 h-6 ${
                team.streak >= 3
                  ? 'text-amber-400 fill-amber-400 animate-bounce drop-shadow-[0_0_10px_#ffd700]'
                  : team.streak > 0
                  ? 'text-amber-500 fill-amber-500/70'
                  : 'text-slate-600'
              }`}
            />
          </div>
        </div>
      </div>

      {/* 3 Key Sockets */}
      <VaultKeys team={team.id} keysCount={team.keys} />
    </div>
  );
};
