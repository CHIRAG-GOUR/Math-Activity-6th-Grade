'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Timer as TimerIcon,
  Maximize,
  Minimize,
  Volume2,
  VolumeX,
  Home,
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

  return (
    <header className="relative w-full flex items-center justify-between px-4 py-2 z-30 select-none bg-white/95 border-b-2 border-amber-400/80 shadow-sm backdrop-blur-md">
      
      {/* 1. LEFT: HOME & TEAM BLUE SCORE */}
      <div className="flex items-center gap-2.5">
        <Link
          href="/"
          onClick={() => soundManager.playClick()}
          title="Return to Arcade Hub"
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 text-slate-800 transition shadow-sm cursor-pointer"
        >
          <Home className="w-5 h-5" />
        </Link>

        <div className="flex items-center gap-2 px-3 py-1 rounded-2xl bg-blue-50 border-2 border-blue-600 shadow-sm">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
          <div className="flex flex-col">
            <span className="text-[10px] font-black font-game uppercase tracking-widest text-blue-800 leading-tight">
              {teamBlue.name}
            </span>
            <span className="text-lg sm:text-xl font-black font-bank text-blue-950 leading-tight">
              {teamBlue.score} <span className="text-[10px] font-mono text-blue-700">PTS</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. CENTER: STAGE & TIMER */}
      <div className="flex items-center gap-2.5 px-3.5 py-1 rounded-2xl bg-amber-50 border-2 border-amber-400 shadow-sm">
        <span className="text-xs font-black uppercase tracking-wider text-amber-950 font-game hidden sm:inline">
          STAGE {currentRound} / {totalRounds} • PLACE VALUE BUILDER
        </span>

        <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-xl border-2 ${
          timeLeft <= 5
            ? 'bg-rose-600 border-rose-700 text-white animate-bounce'
            : 'bg-amber-400 border-amber-500 text-slate-950 font-black'
        }`}>
          <TimerIcon className="w-3.5 h-3.5 stroke-[3]" />
          <span className="text-sm sm:text-base font-black font-mono tracking-wider">
            {formattedTime}
          </span>
        </div>
      </div>

      {/* 3. RIGHT: TEAM RED SCORE & CONTROLS */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-2 px-3 py-1 rounded-2xl bg-amber-50 border-2 border-amber-600 shadow-sm">
          <div className="flex flex-col text-right">
            <span className="text-[10px] font-black font-game uppercase tracking-widest text-amber-800 leading-tight">
              {teamRed.name}
            </span>
            <span className="text-lg sm:text-xl font-black font-bank text-amber-950 leading-tight">
              {teamRed.score} <span className="text-[10px] font-mono text-amber-700">PTS</span>
            </span>
          </div>
          <div className="w-2.5 h-2.5 rounded-full bg-amber-600 animate-pulse" />
        </div>

        <button
          onClick={toggleSound}
          title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 text-slate-800 transition shadow-sm cursor-pointer"
        >
          {isMuted ? <VolumeX className="w-5 h-5 text-rose-500" /> : <Volume2 className="w-5 h-5 text-amber-600" />}
        </button>

        <button
          onClick={toggleFullscreen}
          title="Toggle Fullscreen"
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 text-slate-800 transition shadow-sm cursor-pointer"
        >
          {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
        </button>
      </div>

    </header>
  );
};
