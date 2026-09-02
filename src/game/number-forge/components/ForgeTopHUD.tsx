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
  bloomLevel = 'understand',
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
    <header className="relative w-full flex items-center justify-between px-3 sm:px-6 py-2 z-30 select-none bg-slate-950/80 border-b-2 border-amber-500/40 backdrop-blur-sm">
      
      {/* 1. LEFT: HOME & TEAM BLUE SCORE (28-32px) */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          onClick={() => soundManager.playClick()}
          title="Return to Arcade Hub"
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 text-white transition shadow cursor-pointer"
        >
          <Home className="w-5 h-5" />
        </Link>

        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-[#0c1c2e] border-2 border-blue-400 shadow">
          <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
          <div className="flex flex-col">
            <span className="text-[10px] font-black font-game uppercase tracking-widest text-cyan-300 leading-none">
              {teamBlue.name}
            </span>
            <span className="text-xl sm:text-2xl font-black font-bank text-white leading-tight">
              {teamBlue.score} <span className="text-xs font-mono text-cyan-300">PTS</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. CENTER: STAGE & TIMER */}
      <div className="flex items-center gap-3 px-4 py-1 rounded-2xl bg-black/60 border border-amber-400/60 shadow">
        <div className="text-center">
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 font-game block">
            STAGE {currentRound} / {totalRounds} • PLACE VALUE BUILDER
          </span>
        </div>

        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border ${
          timeLeft <= 5
            ? 'bg-rose-600 border-white text-white animate-bounce'
            : 'bg-amber-400 border-slate-950 text-slate-950'
        }`}>
          <TimerIcon className="w-4 h-4 stroke-[2.5]" />
          <span className="text-base sm:text-lg font-black font-mono tracking-wider">
            {formattedTime}
          </span>
        </div>
      </div>

      {/* 3. RIGHT: TEAM RED SCORE (28-32px) & CONTROLS */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-[#230f06] border-2 border-amber-500 shadow">
          <div className="flex flex-col text-right">
            <span className="text-[10px] font-black font-game uppercase tracking-widest text-amber-300 leading-none">
              {teamRed.name}
            </span>
            <span className="text-xl sm:text-2xl font-black font-bank text-amber-100 leading-tight">
              {teamRed.score} <span className="text-xs font-mono text-amber-300">PTS</span>
            </span>
          </div>
          <div className="w-3 h-3 rounded-full bg-amber-400 animate-pulse" />
        </div>

        <button
          onClick={toggleSound}
          title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 text-white transition shadow cursor-pointer"
        >
          {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5 text-amber-300" />}
        </button>

        <button
          onClick={toggleFullscreen}
          title="Toggle Fullscreen"
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 text-white transition shadow cursor-pointer"
        >
          {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
        </button>
      </div>

    </header>
  );
};
