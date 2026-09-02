'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play, Lock, Sparkles, Coins, Users, Flame } from 'lucide-react';
import { soundManager } from '@/utils/audio';

export interface ArcadeGameData {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  grade: string;
  category: string;
  status: 'active' | 'planned';
  image: string;
  route: string;
  description: string;
  tags: string[];
  theme: {
    cabinetColor: string; // Tailwind class
    marqueeBg: string;
    marqueeText: string;
    bezelBorder: string;
    joystickColor: string;
    buttonColors: string[];
    accentGlow: string;
  };
}

interface ArcadeMachineCardProps {
  game: ArcadeGameData;
}

export const ArcadeMachineCard: React.FC<ArcadeMachineCardProps> = ({ game }) => {
  const isActive = game.status === 'active';

  return (
    <motion.div
      whileHover={{ y: -12, scale: 1.02 }}
      transition={{ duration: 0.25 }}
      className="relative flex flex-col items-center select-none w-full max-w-sm mx-auto group"
    >
      {/* 3D ARCADE CABINET CONTAINER */}
      <div
        className={`relative w-full rounded-t-[32px] rounded-b-2xl p-3 sm:p-4 flex flex-col shadow-[0_25px_50px_rgba(0,0,0,0.35),0_10px_20px_rgba(0,0,0,0.2)] border-4 border-slate-900/90 transition-all ${
          game.theme.cabinetColor
        }`}
      >
        {/* 1. TOP MARQUEE LIGHTED SIGN */}
        <div
          className={`w-full py-2.5 px-3 rounded-2xl border-3 border-slate-900 shadow-md flex items-center justify-between relative overflow-hidden mb-2.5 ${game.theme.marqueeBg}`}
        >
          {/* Backlight Glare Sheen */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
          
          {/* Left Speaker Grille */}
          <div className="flex gap-0.5">
            <div className="w-1.5 h-3 rounded-full bg-slate-950/70" />
            <div className="w-1.5 h-3 rounded-full bg-slate-950/70" />
            <div className="w-1.5 h-3 rounded-full bg-slate-950/70" />
          </div>

          {/* Marquee Game Title */}
          <div className="flex flex-col items-center text-center">
            <span className="text-[9px] font-black tracking-widest uppercase font-game text-slate-900/80 leading-none">
              CABINET #{game.number}
            </span>
            <h3 className={`text-base sm:text-lg font-black font-bank uppercase tracking-wider ${game.theme.marqueeText} drop-shadow-sm leading-tight`}>
              {game.title}
            </h3>
          </div>

          {/* Right Speaker Grille */}
          <div className="flex gap-0.5">
            <div className="w-1.5 h-3 rounded-full bg-slate-950/70" />
            <div className="w-1.5 h-3 rounded-full bg-slate-950/70" />
            <div className="w-1.5 h-3 rounded-full bg-slate-950/70" />
          </div>
        </div>

        {/* 2. RECESSED CRT PREVIEW SCREEN WINDOW */}
        <div className={`relative w-full rounded-2xl p-2.5 bg-slate-950 border-4 ${game.theme.bezelBorder} shadow-inner overflow-hidden flex flex-col`}>
          
          {/* CRT Screen Bezel Glass Frame */}
          <div className="relative w-full h-44 sm:h-48 rounded-xl overflow-hidden border-2 border-slate-800 relative bg-black shadow-inner">
            <Image
              src={game.image}
              alt={game.title}
              fill
              className={`object-cover object-center transition-transform duration-500 ${
                isActive ? 'group-hover:scale-105' : 'grayscale opacity-50'
              }`}
            />
            
            {/* Screen Glass Reflection Glare */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 pointer-events-none" />

            {/* Scanlines Overlay Effect */}
            <div 
              style={{
                backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.2) 0px, rgba(0,0,0,0.2) 1px, transparent 1px, transparent 3px)',
              }}
              className="absolute inset-0 pointer-events-none"
            />

            {/* Live Status Badge / Pill */}
            <div className="absolute top-2 left-2 right-2 flex items-center justify-between text-[10px] font-black font-game uppercase">
              <span className="px-2 py-0.5 rounded-md bg-slate-950/90 border border-slate-700 text-amber-300 shadow">
                {game.grade}
              </span>
              {isActive ? (
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/90 text-slate-950 border border-white font-black flex items-center gap-1 shadow">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  LIVE
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-md bg-slate-800/90 text-slate-400 border border-slate-600 font-bold shadow">
                  COMING SOON
                </span>
              )}
            </div>

            {/* Subtitle / Category at Bottom of Screen */}
            <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent">
              <p className="text-[11px] font-black text-amber-200 uppercase font-game truncate drop-shadow">
                {game.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* 3. ANGLED ARCADE CONTROL PANEL DECK */}
        <div className="w-full mt-2.5 p-3 rounded-2xl bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 border-3 border-slate-900 shadow-xl flex items-center justify-between relative overflow-hidden">
          
          {/* Joystick Assembly (Left) */}
          <div className="flex items-center gap-2">
            <div className="relative w-10 h-10 flex items-center justify-center">
              {/* Dust Washer Ring */}
              <div className="w-9 h-9 rounded-full bg-slate-950 border-2 border-slate-700 shadow-inner flex items-center justify-center">
                {/* Joystick Ball Top */}
                <div
                  className={`w-6 h-6 rounded-full shadow-[0_4px_8px_rgba(0,0,0,0.8),inset_-2px_-2px_4px_rgba(0,0,0,0.5),inset_2px_2px_4px_rgba(255,255,255,0.6)] ${game.theme.joystickColor} transform transition-transform group-hover:rotate-12 group-hover:translate-x-0.5`}
                />
              </div>
            </div>
            <span className="text-[8px] font-black text-slate-400 font-game uppercase hidden sm:inline">
              JOYSTICK
            </span>
          </div>

          {/* 1P / 2P Start Buttons (Center) */}
          <div className="flex flex-col items-center gap-0.5">
            <div className="flex gap-1.5">
              <div className="w-3.5 h-3.5 rounded-full bg-white border border-slate-600 shadow-sm flex items-center justify-center text-[7px] font-black text-slate-900">
                1P
              </div>
              <div className="w-3.5 h-3.5 rounded-full bg-white border border-slate-600 shadow-sm flex items-center justify-center text-[7px] font-black text-slate-900">
                2P
              </div>
            </div>
            <span className="text-[7px] font-bold text-slate-500 font-game">START</span>
          </div>

          {/* Action Push Buttons (Right - 4 Arcade Buttons) */}
          <div className="grid grid-cols-2 gap-1.5">
            {game.theme.buttonColors.map((col, idx) => (
              <div
                key={idx}
                className={`w-4 h-4 rounded-full border border-black/60 shadow-[0_2px_4px_rgba(0,0,0,0.6),inset_1px_1px_2px_rgba(255,255,255,0.6)] ${col} transition-transform active:scale-90`}
              />
            ))}
          </div>

        </div>

        {/* 4. LOWER CHASSIS & COIN DOOR WITH PLAY BUTTON */}
        <div className="w-full mt-2.5 p-3 rounded-2xl bg-slate-950/90 border-3 border-slate-900 shadow-inner flex flex-col gap-2.5">
          
          {/* Dual 25¢ Metal Coin Return Doors */}
          <div className="flex items-center justify-center gap-4 py-1 border-b border-slate-800/80">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 shadow-inner">
              <Coins className="w-3 h-3 text-amber-400" />
              <div className="w-3 h-4 rounded bg-rose-600 border border-rose-400 text-[6px] font-black text-white flex items-center justify-center shadow">
                25¢
              </div>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 shadow-inner">
              <Coins className="w-3 h-3 text-amber-400" />
              <div className="w-3 h-4 rounded bg-rose-600 border border-rose-400 text-[6px] font-black text-white flex items-center justify-center shadow">
                25¢
              </div>
            </div>
          </div>

          {/* Main Action Launcher Button */}
          {isActive ? (
            <Link
              href={game.route}
              onClick={() => soundManager.playClick()}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 border-2 border-white text-slate-950 font-black text-sm font-game uppercase tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.6)] flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              <span>PLAY NOW</span>
              <Play className="w-4 h-4 fill-slate-950" />
            </Link>
          ) : (
            <button
              disabled
              className="w-full py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-500 font-black text-xs font-game uppercase tracking-widest flex items-center justify-center gap-1.5 cursor-not-allowed"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>INSERT COIN • COMING SOON</span>
            </button>
          )}

        </div>

      </div>

      {/* Realistic Shadow Cast on Wood Floor */}
      <div className="w-4/5 h-4 bg-slate-900/30 rounded-full blur-md -mt-2 pointer-events-none" />

    </motion.div>
  );
};
