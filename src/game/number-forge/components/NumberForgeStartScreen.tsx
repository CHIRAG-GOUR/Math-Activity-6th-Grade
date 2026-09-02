'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Award,
  Compass,
  GraduationCap,
  Hammer,
  Home,
  Maximize,
  Minimize,
  Play,
  RotateCcw,
  Sparkles,
  Users,
  Volume2,
  VolumeX,
  Wrench,
} from 'lucide-react';
import { soundManager } from '@/utils/audio';

interface NumberForgeStartScreenProps {
  onStartGame: (blueName: string, redName: string, rounds: number) => void;
}

export const NumberForgeStartScreen: React.FC<NumberForgeStartScreenProps> = ({
  onStartGame,
}) => {
  const [blueName, setBlueName] = useState('Team Inventors');
  const [redName, setRedName] = useState('Team Crafters');
  const [rounds, setRounds] = useState<number>(6);
  const [isMuted, setIsMuted] = useState(soundManager.getMuted());
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    soundManager.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const toggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-4 sm:p-8 z-30 select-none max-w-5xl mx-auto overflow-y-auto">
      
      {/* 1. TOP HEADER */}
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            onClick={() => soundManager.playClick()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-400 hover:bg-yellow-400 border-2 border-slate-950 text-slate-950 font-black text-xs font-game shadow transition cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>ARCADE HUB</span>
          </Link>

          <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/80 border-2 border-amber-500/60 text-amber-200 shadow-sm backdrop-blur-md">
            <GraduationCap className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-black tracking-widest font-game uppercase">
              GRADE 6 MATHEMATICS • PLACE VALUE & ROUNDING
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            className="p-2 rounded-xl bg-amber-950/80 border-2 border-amber-500/60 text-amber-300 hover:text-white shadow transition cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5 text-amber-400" />}
          </button>

          <button
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
            className="p-2 rounded-xl bg-amber-950/80 border-2 border-amber-500/60 text-amber-300 hover:text-white shadow transition cursor-pointer"
          >
            {isFullscreen ? <Minimize className="w-5 h-5 text-purple-400" /> : <Maximize className="w-5 h-5 text-purple-400" />}
          </button>
        </div>
      </div>

      {/* 2. TITLE & TAGLINE */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex flex-col items-center text-center my-2"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 text-xs font-black font-game uppercase tracking-widest mb-2 shadow">
          <Hammer className="w-4 h-4 text-amber-400" />
          <span>INTERACTIVE 3D MATHEMATICAL WORKSHOP</span>
        </div>

        <h1 className="text-6xl sm:text-7xl md:text-8xl font-black font-bank uppercase tracking-tight text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)]">
          NUMBER <span className="text-amber-400">FORGE</span>
        </h1>

        <p className="text-sm sm:text-base md:text-lg font-black tracking-widest text-amber-200 font-game uppercase mt-1 drop-shadow">
          BUILD IT. UNDERSTAND IT. ROUND IT. PROVE IT.
        </p>
      </motion.div>

      {/* 3. TEAM SETUP & ROUND CONFIGURATION CARD */}
      <div className="w-full max-w-2xl p-6 sm:p-8 rounded-3xl bg-amber-950/90 border-3 border-amber-400 shadow-2xl backdrop-blur-xl flex flex-col gap-5">
        
        {/* Team Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-black font-game uppercase text-blue-300 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-cyan-400" /> TEAM BLUE (LEFT)
            </span>
            <input
              type="text"
              value={blueName}
              onChange={(e) => setBlueName(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-blue-950/80 border-2 border-blue-400 text-white font-bold font-game tracking-wider focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-black font-game uppercase text-amber-300 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-yellow-400" /> TEAM RED (RIGHT)
            </span>
            <input
              type="text"
              value={redName}
              onChange={(e) => setRedName(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-amber-900/80 border-2 border-amber-400 text-white font-bold font-game tracking-wider focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
        </div>

        {/* Round Length Toggle */}
        <div className="flex flex-col gap-2 pt-2 border-t border-amber-500/30">
          <span className="text-xs font-black font-game uppercase text-amber-300">
            BLOOM'S TAXONOMY JOURNEY LENGTH:
          </span>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                soundManager.playClick();
                setRounds(6);
              }}
              className={`py-2.5 rounded-xl font-black font-game text-xs uppercase tracking-wider border-2 transition cursor-pointer ${
                rounds === 6
                  ? 'bg-amber-400 text-slate-950 border-white shadow-md'
                  : 'bg-amber-900/40 text-amber-200 border-amber-600/60 hover:border-amber-400'
              }`}
            >
              6 STAGES (RECOMMENDED)
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                setRounds(12);
              }}
              className={`py-2.5 rounded-xl font-black font-game text-xs uppercase tracking-wider border-2 transition cursor-pointer ${
                rounds === 12
                  ? 'bg-amber-400 text-slate-950 border-white shadow-md'
                  : 'bg-amber-900/40 text-amber-200 border-amber-600/60 hover:border-amber-400'
              }`}
            >
              12 STAGES (FULL MASTERY)
            </button>
          </div>
        </div>

      </div>

      {/* 4. ENTER WORKSHOP ACTION BUTTON */}
      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => {
          soundManager.playClick();
          onStartGame(blueName, redName, rounds);
        }}
        className="px-16 sm:px-24 py-4 sm:py-5 rounded-3xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 border-4 border-white text-slate-950 font-black text-2xl sm:text-3xl tracking-wider uppercase font-game shadow-[0_12px_35px_rgba(255,215,0,0.6)] flex items-center justify-center gap-4 cursor-pointer my-2 hover:brightness-110"
      >
        <span>ENTER NUMBER FORGE</span>
        <Play className="w-8 h-8 fill-slate-950" />
      </motion.button>

    </div>
  );
};
