'use client';

import React from 'react';
import { Flame } from 'lucide-react';
import { OrnateKey } from './OrnateKey';
import { TeamState } from '@/types/game';

interface TeamScoreHeaderProps {
  team: TeamState;
}

export const TeamConsoleScoreHeader: React.FC<TeamScoreHeaderProps> = ({ team }) => {
  const isBlue = team.id === 'blue';

  return (
    <div
      className={`w-full max-w-[360px] p-2 sm:p-2.5 rounded-2xl mb-1.5 flex items-center justify-between border-2 shadow-md bg-white/95 backdrop-blur-md select-none transition-all ${
        isBlue ? 'border-blue-400' : 'border-rose-400'
      }`}
    >
      {/* Team Name & Live Score */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              isBlue ? 'bg-[#0088ff] shadow-[0_0_6px_#0088ff]' : 'bg-[#ff2a5f] shadow-[0_0_6px_#ff2a5f]'
            }`}
          />
          <span
            className={`text-xs sm:text-sm font-black font-game uppercase tracking-wide ${
              isBlue ? 'blue-bank-text' : 'red-bank-text'
            }`}
          >
            {team.name}
          </span>
          {team.multiplier > 1 && (
            <span className="px-1.5 py-0.2 rounded-full text-[8px] font-black uppercase font-game bg-amber-500 text-white">
              ×{team.multiplier}
            </span>
          )}
        </div>

        <div className="flex items-baseline gap-1 mt-0.5">
          <span className="text-2xl sm:text-3xl font-black font-display text-slate-900 leading-none">
            {team.score}
          </span>
          <span className="text-[10px] font-black text-amber-700 font-game">PTS</span>
        </div>
      </div>

      {/* Streak & Key Badges */}
      <div className="flex items-center gap-3">
        {/* Streak */}
        <div className="flex flex-col items-center">
          <span className="text-[8px] font-black tracking-widest text-slate-500 uppercase font-game">
            STREAK
          </span>
          <div className="flex items-center gap-0.5">
            <span className="text-base sm:text-lg font-black text-amber-600 font-game">
              {team.streak}
            </span>
            <Flame
              className={`w-3.5 h-3.5 ${
                team.streak >= 3
                  ? 'text-amber-500 fill-amber-500 animate-bounce'
                  : team.streak > 0
                  ? 'text-amber-500 fill-amber-500/70'
                  : 'text-slate-300'
              }`}
            />
          </div>
        </div>

        {/* 3 Key Sockets */}
        <div className="flex flex-col items-end">
          <span className="text-[8px] font-black tracking-widest text-slate-500 uppercase font-game">
            KEYS
          </span>
          <div className="flex items-center gap-1 mt-0.5">
            {[1, 2, 3].map((slot) => (
              <div
                key={slot}
                className={`w-4 h-4 sm:w-5 sm:h-5 rounded-md flex items-center justify-center border ${
                  team.keys >= slot
                    ? isBlue
                      ? 'bg-gradient-to-tr from-blue-500 to-cyan-300 border-white shadow-sm'
                      : 'bg-gradient-to-tr from-rose-500 to-amber-300 border-white shadow-sm'
                    : 'bg-slate-100 border-slate-300'
                }`}
              >
                {team.keys >= slot ? (
                  <OrnateKey size={11} color={isBlue ? 'blue' : 'red'} glow={false} />
                ) : (
                  <div className="w-1 h-1 rounded-full bg-slate-300" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
