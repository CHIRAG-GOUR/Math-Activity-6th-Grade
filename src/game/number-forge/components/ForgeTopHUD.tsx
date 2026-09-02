'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Timer as TimerIcon,
  Maximize,
  Minimize,
  Volume2,
  VolumeX,
  Home,
  Sparkles,
  GraduationCap,
  Flame,
} from 'lucide-react';
import { BloomLevel, TeamForgeState } from '../types';
import { soundManager } from '@/utils/audio';

interface ForgeTopHUDProps {
  teamBlue: TeamForgeState;
  teamRed: TeamForgeState;
  currentRound: number;
  totalRounds: number;
  timeLeft: number;
  bloomLevel?: BloomLevel;
}

export const ForgeTopHUD: React.FC<ForgeTopHUDProps> = ({
  teamBlue,
  teamRed,
  currentRound,
  totalRounds,
  timeLeft,
  bloomLevel = 'remember',
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

  const bloomLabels: Record<BloomLevel, string> = {
    remember: '01 REMEMBER // DIGIT VALUE',
    understand: '02 UNDERSTAND // PLACE TOWER',
    apply: '03 APPLY // ROUNDING TRACK',
    analyze: '04 ANALYZE // ERROR DETECTION',
    evaluate: '05 EVALUATE // TRUTH & PROOF',
    create: '06 CREATE // MASTER BLUEPRINT',
  };

  return (
    <header className="relative w-full flex items-center justify-between px-3 sm:px-8 py-2 z-30 pointer-events-none select-none">
      
      {/* 1. LEFT: TEAM BLUE SCORE & HOME BUTTON */}
      <div className="flex items-center gap-3 pointer-events-auto">
        <Link
          href="/"
          onClick={() => soundManager.playClick()}
          title="Return to Arcade Hub"
          className="p-2 sm:p-2.5 rounded-2xl bg-white/95 border-2 border-slate-300 text-slate-800 hover:text-slate-950 shadow-md flex items-center gap-1.5 cursor-pointer backdrop-blur-md transition hover:bg-slate-50"
        >
          <Home className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
          <span className="hidden lg:inline text-xs font-black font-game uppercase">ARCADE HUB</span>
        </Link>

        {/* TEAM BLUE SCORE PILL */}
        <div className="px-4 py-1.5 rounded-2xl bg-blue-950/90 border-2 border-blue-400 text-white flex items-center gap-2.5 shadow-lg backdrop-blur-md">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" />
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase tracking-widest text-blue-300 font-game">
              {teamBlue.name}
            </span>
            <span className="text-lg sm:text-xl font-black font-bank text-blue-200 leading-none">
              {teamBlue.score} PTS
            </span>
          </div>
          {teamBlue.streak > 1 && (
            <span className="px-1.5 py-0.5 rounded-md bg-blue-500/40 text-[9px] font-black text-cyan-300 border border-cyan-400 flex items-center gap-0.5">
              <Flame className="w-3 h-3 text-amber-300" /> {teamBlue.streak}x
            </span>
          )}
        </div>
      </div>

      {/* 2. CENTER: BLOOM'S TAXONOMY BADGE + ROUND + TIME */}
      <div className="flex items-center gap-2 sm:gap-3 pointer-events-auto mx-auto">
        
        {/* ROUND & BLOOM LEVEL BADGE */}
        <div className="px-4 py-1.5 rounded-2xl border-2 border-amber-400 flex flex-col items-center justify-center shadow-md bg-amber-950/90 text-amber-200 backdrop-blur-md">
          <span className="text-[9px] font-black tracking-widest uppercase text-amber-400 font-game">
            {bloomLabels[bloomLevel]}
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-sm font-bold text-amber-300 font-game">STAGE</span>
            <span className="text-xl sm:text-2xl font-black text-white font-bank">
              {currentRound}
            </span>
            <span className="text-xs font-bold text-amber-400/80 font-game">
              /{totalRounds}
            </span>
          </div>
        </div>

        {/* TIME LEFT BADGE */}
        <div className="px-4 py-1.5 rounded-2xl border-2 border-amber-400 flex flex-col items-center justify-center shadow-md bg-amber-950/90 backdrop-blur-md min-w-[95px]">
          <div className="flex items-center gap-1">
            <TimerIcon
              className={`w-3.5 h-3.5 ${
                isUrgent
                  ? 'text-rose-400 animate-spin'
                  : isWarning
                  ? 'text-amber-400 animate-pulse'
                  : 'text-amber-300'
              }`}
            />
            <span className="text-[9px] font-black tracking-widest uppercase text-amber-300 font-game">
              TIME
            </span>
          </div>
          <motion.div
            animate={
              isUrgent
                ? { scale: [1, 1.1, 1], color: ['#f43f5e', '#ffffff', '#f43f5e'] }
                : isWarning
                ? { scale: [1, 1.05, 1], color: ['#fbbf24', '#ffffff', '#fbbf24'] }
                : { scale: 1, color: '#fef08a' }
            }
            transition={{ duration: 0.5, repeat: isUrgent || isWarning ? Infinity : 0 }}
            className="text-xl sm:text-2xl font-black font-bank tracking-wider"
          >
            {formattedTime}
          </motion.div>
        </div>

      </div>

      {/* 3. RIGHT: TEAM RED SCORE & AUDIO / FULLSCREEN CONTROLS */}
      <div className="flex items-center gap-2.5 pointer-events-auto">
        
        {/* TEAM RED SCORE PILL */}
        <div className="px-4 py-1.5 rounded-2xl bg-amber-950/90 border-2 border-amber-500 text-white flex items-center gap-2.5 shadow-lg backdrop-blur-md">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase tracking-widest text-amber-300 font-game">
              {teamRed.name}
            </span>
            <span className="text-lg sm:text-xl font-black font-bank text-amber-200 leading-none">
              {teamRed.score} PTS
            </span>
          </div>
          {teamRed.streak > 1 && (
            <span className="px-1.5 py-0.5 rounded-md bg-amber-500/40 text-[9px] font-black text-yellow-300 border border-yellow-400 flex items-center gap-0.5">
              <Flame className="w-3 h-3 text-yellow-300" /> {teamRed.streak}x
            </span>
          )}
        </div>

        {/* Sound Toggle */}
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={toggleSound}
          title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          className="p-2.5 rounded-2xl bg-white/95 border-2 border-amber-400 text-slate-800 hover:text-slate-950 shadow-md flex items-center justify-center cursor-pointer backdrop-blur-md"
        >
          {isMuted ? <VolumeX className="w-5 h-5 text-rose-500" /> : <Volume2 className="w-5 h-5 text-amber-600" />}
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
