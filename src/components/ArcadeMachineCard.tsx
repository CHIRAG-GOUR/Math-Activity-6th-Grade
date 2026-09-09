'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play, Lock, Sparkles, Coins, Users, Flame, Shield, Award, Zap } from 'lucide-react';
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
    cabinetColor: string;
    tMoldingColor: string;
    marqueeBg: string;
    marqueeText: string;
    marqueeGlow: string;
    bezelBorder: string;
    screenGlow: string;
    deckBg: string;
    deckPattern: 'checker' | 'wood' | 'circus' | 'matrix';
    sideArtGradient: string;
    sideArtAccent: string;
    joystickColor: string;
    buttonColors: string[];
    accentGlow: string;
    coinDoorColor: string;
    cabinetBadge: string;
  };
}

interface ArcadeMachineCardProps {
  game: ArcadeGameData;
}

export const ArcadeMachineCard: React.FC<ArcadeMachineCardProps> = ({ game }) => {
  const isActive = game.status === 'active';
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setRotateX(-y * 0.035);
    setRotateY(x * 0.035);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX, rotateY }}
      whileHover={{ y: -16, scale: 1.025 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
      className="relative flex flex-col items-center select-none w-full max-w-[340px] mx-auto group cursor-pointer"
    >
      {/* ── 3D CABINET OUTER CHASSIS WITH T-MOLDING & WING SIDES ── */}
      <div className="relative w-full flex flex-col items-center">
        
        {/* Left 3D T-Molding Edge Strip */}
        <div
          className={`absolute -left-2 top-4 bottom-4 w-2.5 rounded-l-full z-30 pointer-events-none transition-all ${game.theme.tMoldingColor}`}
        />

        {/* Right 3D T-Molding Edge Strip */}
        <div
          className={`absolute -right-2 top-4 bottom-4 w-2.5 rounded-r-full z-30 pointer-events-none transition-all ${game.theme.tMoldingColor}`}
        />

        {/* MAIN CABINET SHELL */}
        <div
          className={`relative w-full rounded-t-[36px] rounded-b-2xl p-3 sm:p-4 flex flex-col shadow-[0_30px_60px_rgba(0,0,0,0.5),0_15px_25px_rgba(0,0,0,0.3)] border-4 border-slate-950 transition-all overflow-hidden ${game.theme.cabinetColor}`}
        >
          {/* Subtle Side Art Vignette Print on Cabinet Body */}
          <div
            className={`absolute inset-0 bg-gradient-to-r ${game.theme.sideArtGradient} opacity-60 pointer-events-none`}
          />

          {/* ═════════════════════════════════════════════════════════════
              1. 3D SLANTED ILLUMINATED MARQUEE HEADER
              ═════════════════════════════════════════════════════════════ */}
          <div
            style={{
              boxShadow: `0 0 25px ${game.theme.marqueeGlow}, inset 0 2px 6px rgba(255,255,255,0.7), inset 0 -4px 8px rgba(0,0,0,0.6)`,
            }}
            className={`w-full py-3 px-3 rounded-2xl border-3 border-slate-950 flex items-center justify-between relative overflow-hidden mb-3 z-10 ${game.theme.marqueeBg}`}
          >
            {/* Glossy Backlight Reflection Sheen */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-black/20 pointer-events-none" />

            {/* Left Speaker Grille (Vintage Slits) */}
            <div className="flex flex-col gap-1 z-10">
              <div className="w-4 h-1 rounded-full bg-slate-950/80 shadow-sm" />
              <div className="w-4 h-1 rounded-full bg-slate-950/80 shadow-sm" />
              <div className="w-4 h-1 rounded-full bg-slate-950/80 shadow-sm" />
            </div>

            {/* Centered Marquee Typography */}
            <div className="flex flex-col items-center text-center z-10 px-1">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[9px] font-black tracking-widest uppercase font-game text-slate-950/90 bg-white/40 px-1.5 py-0.2 rounded border border-black/20">
                  CABINET #{game.number}
                </span>
                <span className="text-[9px] font-black tracking-wider uppercase font-game text-slate-950/80 hidden sm:inline">
                  {game.theme.cabinetBadge}
                </span>
              </div>
              <h3
                className={`text-base sm:text-lg font-black font-bank uppercase tracking-wider ${game.theme.marqueeText} drop-shadow-md leading-none`}
              >
                {game.title}
              </h3>
            </div>

            {/* Right Speaker Grille */}
            <div className="flex flex-col gap-1 z-10">
              <div className="w-4 h-1 rounded-full bg-slate-950/80 shadow-sm" />
              <div className="w-4 h-1 rounded-full bg-slate-950/80 shadow-sm" />
              <div className="w-4 h-1 rounded-full bg-slate-950/80 shadow-sm" />
            </div>
          </div>

          {/* ═════════════════════════════════════════════════════════════
              2. DEEP RECESSED CRT MONITOR WITH 3D BEZEL
              ═════════════════════════════════════════════════════════════ */}
          <div
            style={{
              boxShadow: `inset 0 10px 25px rgba(0,0,0,0.9), 0 0 20px ${game.theme.screenGlow}`,
            }}
            className={`relative w-full rounded-2xl p-2.5 bg-slate-950 border-4 ${game.theme.bezelBorder} overflow-hidden flex flex-col z-10`}
          >
            {/* Bezel Corner Mounting Screws */}
            <div className="absolute top-1 left-1.5 w-1.5 h-1.5 rounded-full bg-slate-700 border border-slate-500 shadow-inner flex items-center justify-center text-[5px] text-slate-900 font-bold">
              +
            </div>
            <div className="absolute top-1 right-1.5 w-1.5 h-1.5 rounded-full bg-slate-700 border border-slate-500 shadow-inner flex items-center justify-center text-[5px] text-slate-900 font-bold">
              +
            </div>
            <div className="absolute bottom-1 left-1.5 w-1.5 h-1.5 rounded-full bg-slate-700 border border-slate-500 shadow-inner flex items-center justify-center text-[5px] text-slate-900 font-bold">
              +
            </div>
            <div className="absolute bottom-1 right-1.5 w-1.5 h-1.5 rounded-full bg-slate-700 border border-slate-500 shadow-inner flex items-center justify-center text-[5px] text-slate-900 font-bold">
              +
            </div>

            {/* CRT Screen Display Window */}
            <div className="relative w-full h-44 sm:h-48 rounded-xl overflow-hidden border-2 border-slate-800 bg-black shadow-[inset_0_4px_16px_rgba(0,0,0,0.9)]">
              <Image
                src={game.image}
                alt={game.title}
                fill
                priority
                className={`object-cover object-center transition-transform duration-700 ${
                  isActive ? 'group-hover:scale-108' : 'grayscale opacity-50'
                }`}
              />

              {/* CRT Curved Glass Reflection Overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/25 pointer-events-none" />

              {/* CRT Scanline Texture Lines */}
              <div
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(0deg, rgba(0,0,0,0.25) 0px, rgba(0,0,0,0.25) 1px, transparent 1px, transparent 3px)',
                }}
                className="absolute inset-0 pointer-events-none opacity-80"
              />

              {/* Live Game Status Badge */}
              <div className="absolute top-2 left-2 right-2 flex items-center justify-between text-[10px] font-black font-game uppercase z-10">
                <span className="px-2 py-0.5 rounded-md bg-slate-950/95 border-2 border-amber-400 text-amber-300 shadow-md">
                  {game.grade}
                </span>
                {isActive ? (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-slate-950 border-2 border-white font-black flex items-center gap-1 shadow-lg animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    LIVE
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-md bg-slate-800/90 text-slate-400 border border-slate-600 font-bold shadow">
                    COMING SOON
                  </span>
                )}
              </div>

              {/* Subtitle Ribbon at Bottom of Monitor */}
              <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent z-10">
                <p className="text-[11px] font-black text-amber-300 uppercase font-game truncate drop-shadow">
                  {game.subtitle}
                </p>
              </div>
            </div>
          </div>

          {/* ═════════════════════════════════════════════════════════════
              3. ANGLED 3D ARCADE CONTROL DECK
              ═════════════════════════════════════════════════════════════ */}
          <div
            style={{
              transform: 'perspective(400px) rotateX(8deg)',
              boxShadow: '0 8px 18px rgba(0,0,0,0.7), inset 0 2px 4px rgba(255,255,255,0.2)',
            }}
            className={`w-full mt-3 p-3 rounded-2xl border-3 border-slate-950 flex items-center justify-between relative overflow-hidden z-10 ${game.theme.deckBg}`}
          >
            {/* Custom Pattern Overlay on Deck */}
            {game.theme.deckPattern === 'checker' && (
              <div
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(45deg, rgba(255,255,255,0.06) 0, rgba(255,255,255,0.06) 2px, transparent 0, transparent 8px)',
                }}
                className="absolute inset-0 pointer-events-none"
              />
            )}
            {game.theme.deckPattern === 'circus' && (
              <div
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(90deg, rgba(251,191,36,0.15) 0, rgba(251,191,36,0.15) 12px, transparent 12px, transparent 24px)',
                }}
                className="absolute inset-0 pointer-events-none"
              />
            )}
            {game.theme.deckPattern === 'wood' && (
              <div
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(0deg, rgba(0,0,0,0.2) 0, rgba(0,0,0,0.2) 2px, transparent 2px, transparent 10px)',
                }}
                className="absolute inset-0 pointer-events-none"
              />
            )}

            {/* Left: 3D Ball-Top Arcade Joystick */}
            <div className="flex items-center gap-2 z-10">
              <div className="relative w-11 h-11 flex items-center justify-center">
                {/* Outer Dust Washer Ring */}
                <div className="w-10 h-10 rounded-full bg-slate-950 border-2 border-slate-700 shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)] flex items-center justify-center">
                  {/* Metal Shaft Base */}
                  <div className="w-3 h-3 rounded-full bg-slate-400 border border-slate-200 shadow-sm flex items-center justify-center">
                    {/* Glossy 3D Ball Top with Specular Highlight */}
                    <div
                      style={{
                        boxShadow:
                          '0 6px 12px rgba(0,0,0,0.9), inset -3px -3px 6px rgba(0,0,0,0.6), inset 3px 3px 6px rgba(255,255,255,0.8)',
                      }}
                      className={`w-7 h-7 rounded-full ${game.theme.joystickColor} transform transition-transform group-hover:rotate-12 group-hover:translate-x-1 group-hover:-translate-y-0.5`}
                    />
                  </div>
                </div>
              </div>
              <span className="text-[8px] font-black text-slate-300 font-game uppercase tracking-widest hidden sm:inline">
                P1 STICK
              </span>
            </div>

            {/* Center: 1P / 2P Player Select Buttons */}
            <div className="flex flex-col items-center gap-1 z-10">
              <div className="flex gap-2">
                <div className="w-4 h-4 rounded-full bg-white border-2 border-slate-800 shadow-[0_2px_4px_rgba(0,0,0,0.6)] flex items-center justify-center text-[7px] font-black text-slate-950">
                  1P
                </div>
                <div className="w-4 h-4 rounded-full bg-white border-2 border-slate-800 shadow-[0_2px_4px_rgba(0,0,0,0.6)] flex items-center justify-center text-[7px] font-black text-slate-950">
                  2P
                </div>
              </div>
              <span className="text-[7px] font-black text-amber-300 font-game tracking-widest uppercase">
                2-PLAYER
              </span>
            </div>

            {/* Right: 4 Microswitch Push Buttons */}
            <div className="grid grid-cols-2 gap-2 z-10">
              {game.theme.buttonColors.map((col, idx) => (
                <div
                  key={idx}
                  style={{
                    boxShadow:
                      '0 3px 6px rgba(0,0,0,0.7), inset 1px 1px 2px rgba(255,255,255,0.7), inset -1px -1px 2px rgba(0,0,0,0.5)',
                  }}
                  className={`w-4.5 h-4.5 rounded-full border-2 border-slate-950 ${col} transition-transform active:scale-85 group-hover:brightness-110`}
                />
              ))}
            </div>
          </div>

          {/* ═════════════════════════════════════════════════════════════
              4. LOWER CHASSIS & COIN DOOR WITH PLAY BUTTON
              ═════════════════════════════════════════════════════════════ */}
          <div
            style={{
              boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.9)',
            }}
            className={`w-full mt-3 p-3 rounded-2xl border-3 border-slate-950 flex flex-col gap-2.5 z-10 ${game.theme.coinDoorColor}`}
          >
            {/* Dual 25¢ Stamped Coin Reject Buttons & Key Cylinder */}
            <div className="flex items-center justify-between px-2 py-1 border-b border-slate-800">
              {/* Left 25¢ Coin Slot */}
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-950 border border-slate-700 shadow-inner">
                <Coins className="w-3 h-3 text-amber-400" />
                <div className="px-1.5 py-0.5 rounded bg-rose-600 border border-rose-400 text-[7px] font-black text-white shadow animate-pulse">
                  25¢
                </div>
              </div>

              {/* Center Lock Cylinder */}
              <div className="w-3 h-3 rounded-full bg-amber-400 border border-amber-600 shadow-inner flex items-center justify-center">
                <div className="w-0.5 h-1.5 bg-slate-950 rounded-full" />
              </div>

              {/* Right 25¢ Coin Slot */}
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-950 border border-slate-700 shadow-inner">
                <Coins className="w-3 h-3 text-amber-400" />
                <div className="px-1.5 py-0.5 rounded bg-rose-600 border border-rose-400 text-[7px] font-black text-white shadow animate-pulse">
                  25¢
                </div>
              </div>
            </div>

            {/* Big Action Launcher Button */}
            {isActive ? (
              <Link
                href={game.route}
                onClick={() => soundManager.playClick()}
                style={{
                  boxShadow: `0 0 25px ${game.theme.accentGlow}, inset 0 2px 4px rgba(255,255,255,0.6)`,
                }}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 border-2 border-white text-slate-950 font-black text-sm font-game uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                <span>INSERT COIN • PLAY</span>
                <Play className="w-4 h-4 fill-slate-950" />
              </Link>
            ) : (
              <button
                disabled
                className="w-full py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 font-black text-xs font-game uppercase tracking-widest flex items-center justify-center gap-1.5 cursor-not-allowed"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>CABINET LOCKED • COMING SOON</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Dynamic 3D Neon Underglow & Floor Shadow */}
      <div
        style={{
          boxShadow: `0 0 35px ${game.theme.accentGlow}`,
        }}
        className="w-3/4 h-5 bg-slate-950/40 rounded-full blur-lg -mt-2 pointer-events-none"
      />
    </motion.div>
  );
};

