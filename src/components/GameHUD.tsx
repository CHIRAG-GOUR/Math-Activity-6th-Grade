'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Timer as TimerIcon } from 'lucide-react';
import { TeamPanel } from './TeamPanel';
import { TeamState } from '@/types/game';

interface GameHUDProps {
  teamBlue: TeamState;
  teamRed: TeamState;
  currentRound: number;
  totalRounds: number;
  timeLeft: number;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  teamBlue,
  teamRed,
  currentRound,
  totalRounds,
  timeLeft,
}) => {
  const formattedTime = `00:${timeLeft < 10 ? `0${timeLeft}` : timeLeft}`;
  const isWarning = timeLeft <= 5 && timeLeft > 2;
  const isUrgent = timeLeft <= 2;

  return (
    <header className="relative w-full flex items-center justify-between gap-3 sm:gap-6 px-4 sm:px-8 py-2.5 z-30 pointer-events-none select-none">
      {/* Left HUD: Team Blue Panel */}
      <div className="pointer-events-auto">
        <TeamPanel team={teamBlue} />
      </div>

      {/* Center HUD: Round Indicator & Timer */}
      <div className="flex flex-col items-center justify-center pointer-events-auto">
        <div className="hud-panel-center flex items-center gap-4 sm:gap-6 px-5 sm:px-8 py-2 rounded-2xl">
          {/* Round Indicator */}
          <div className="flex flex-col items-center border-r border-slate-700/80 pr-4 sm:pr-6">
            <span className="text-[11px] font-black tracking-widest uppercase text-amber-300 font-game">
              ROUND
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl md:text-4xl font-black text-white font-game">
                {currentRound}
              </span>
              <span className="text-sm font-bold text-slate-400 font-game">
                / {totalRounds}
              </span>
            </div>
          </div>

          {/* Large Countdown Timer */}
          <div className="flex flex-col items-center pl-1 sm:pl-2">
            <div className="flex items-center gap-1.5">
              <TimerIcon
                className={`w-4 h-4 ${
                  isUrgent
                    ? 'text-rose-500 animate-spin'
                    : isWarning
                    ? 'text-amber-400 animate-pulse'
                    : 'text-amber-300'
                }`}
              />
              <span className="text-[11px] font-black tracking-widest uppercase text-amber-300 font-game">
                TIME LEFT
              </span>
            </div>

            <motion.div
              animate={
                isUrgent
                  ? { scale: [1, 1.18, 1], color: ['#ff3366', '#ffffff', '#ff3366'] }
                  : isWarning
                  ? { scale: [1, 1.08, 1], color: ['#fbbf24', '#ffffff', '#fbbf24'] }
                  : { scale: 1, color: '#ffffff' }
              }
              transition={{ duration: 0.5, repeat: isUrgent || isWarning ? Infinity : 0 }}
              className={`text-3xl sm:text-4xl md:text-5xl font-black font-game tracking-wider drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] ${
                isUrgent
                  ? 'text-rose-500 drop-shadow-[0_0_15px_#ff3366]'
                  : isWarning
                  ? 'text-amber-400 drop-shadow-[0_0_12px_#fbbf24]'
                  : 'text-white'
              }`}
            >
              {formattedTime}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Right HUD: Team Red Panel */}
      <div className="pointer-events-auto">
        <TeamPanel team={teamRed} />
      </div>
    </header>
  );
};
