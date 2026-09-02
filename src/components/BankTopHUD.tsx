'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Timer as TimerIcon, Maximize, Minimize, Volume2, VolumeX, Home } from 'lucide-react';
import { TeamState } from '@/types/game';
import { soundManager } from '@/utils/audio';

interface BankTopHUDProps {
  teamBlue?: TeamState;
  teamRed?: TeamState;
  currentRound: number;
  totalRounds: number;
  timeLeft: number;
  totalTime?: number;
  isTieBreaker?: boolean;
}

export const BankTopHUD: React.FC<BankTopHUDProps> = ({
  currentRound,
  totalRounds,
  timeLeft,
  isTieBreaker = false,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(soundManager.getMuted());

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    soundManager.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const toggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  const formattedTime = `00:${timeLeft < 10 ? `0${timeLeft}` : timeLeft}`;
  const isWarning = timeLeft <= 5 && timeLeft > 2;
  const isUrgent = timeLeft <= 2;

  return (
    <header className="relative w-full flex items-center justify-between px-3 sm:px-8 py-1 z-30 pointer-events-none select-none">
      
      {/* 1. LEFT CONTROLS: ARCADE HUB HOME BUTTON */}
      <div className="flex items-center gap-2 pointer-events-auto">
        <Link
          href="/"
          onClick={() => soundManager.playClick()}
          title="Return to Arcade Hub"
          className="p-2 sm:p-2.5 rounded-2xl bg-white/95 border-2 border-slate-300 text-slate-800 hover:text-slate-950 shadow-md flex items-center gap-1.5 cursor-pointer backdrop-blur-md transition hover:bg-slate-50"
        >
          <Home className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
          <span className="hidden md:inline text-xs font-black font-game uppercase">ARCADE HUB</span>
        </Link>
      </div>

      {/* 2. CENTER: ROUND COUNTER + TIME LEFT COUNTDOWN */}
      <div className="flex items-center gap-3 pointer-events-auto mx-auto">
        {/* ROUND COUNTER BADGE / SUDDEN DEATH BADGE */}
        {isTieBreaker ? (
          <div className="px-4 py-1.5 rounded-2xl border-2 border-rose-500 flex flex-col items-center justify-center shadow-md bg-rose-950 text-white animate-pulse">
            <span className="text-[9px] font-black tracking-widest uppercase text-rose-300 font-game">
              SUDDEN DEATH
            </span>
            <span className="text-sm sm:text-base font-black text-white font-game uppercase">
              SUPER QUESTION
            </span>
          </div>
        ) : (
          <div className="px-4 py-1.5 rounded-2xl border-2 border-amber-400 flex flex-col items-center justify-center shadow-md bg-white/95 backdrop-blur-md">
            <span className="text-[9px] font-black tracking-widest uppercase text-amber-900 font-game">
              ROUND
            </span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-xl sm:text-2xl font-black text-slate-900 font-game">
                {currentRound}
              </span>
              <span className="text-xs font-bold text-slate-500 font-game">
                /{totalRounds}
              </span>
            </div>
          </div>
        )}

        {/* TIME LEFT COUNTER BADGE */}
        <div className="px-4 py-1.5 rounded-2xl border-2 border-amber-400 flex flex-col items-center justify-center shadow-md bg-white/95 backdrop-blur-md min-w-[110px]">
          <div className="flex items-center gap-1">
            <TimerIcon
              className={`w-3.5 h-3.5 ${
                isUrgent
                  ? 'text-rose-600 animate-spin'
                  : isWarning
                  ? 'text-amber-600 animate-pulse'
                  : 'text-amber-700'
              }`}
            />
            <span className="text-[9px] font-black tracking-widest uppercase text-amber-900 font-game">
              TIME LEFT
            </span>
          </div>
          <motion.div
            animate={
              isUrgent
                ? { scale: [1, 1.1, 1], color: ['#ff2a5f', '#aa1133', '#ff2a5f'] }
                : isWarning
                ? { scale: [1, 1.05, 1], color: ['#d97706', '#b45309', '#d97706'] }
                : { scale: 1, color: '#0f172a' }
            }
            transition={{ duration: 0.5, repeat: isUrgent || isWarning ? Infinity : 0 }}
            className="text-xl sm:text-2xl font-black font-game tracking-wider"
          >
            {formattedTime}
          </motion.div>
        </div>
      </div>

      {/* 3. RIGHT: SOUND MUTE & FULLSCREEN CONTROLS */}
      <div className="flex items-center gap-2 pointer-events-auto">
        {/* Sound & Music Mute Toggle */}
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={toggleSound}
          title={isMuted ? 'Unmute Background Music & Sound' : 'Mute Background Music & Sound'}
          className="p-2.5 rounded-2xl bg-white/95 border-2 border-amber-400 text-slate-800 hover:text-slate-950 shadow-md flex items-center justify-center cursor-pointer backdrop-blur-md"
        >
          {isMuted ? <VolumeX className="w-5 h-5 text-rose-500" /> : <Volume2 className="w-5 h-5 text-blue-600" />}
        </motion.button>

        {/* Fullscreen Toggle */}
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={toggleFullscreen}
          title="Toggle Fullscreen"
          className="p-2.5 rounded-2xl bg-white/95 border-2 border-purple-400 text-purple-700 hover:text-purple-900 shadow-md flex items-center justify-center cursor-pointer backdrop-blur-md"
        >
          {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
        </motion.button>
      </div>

    </header>
  );
};
