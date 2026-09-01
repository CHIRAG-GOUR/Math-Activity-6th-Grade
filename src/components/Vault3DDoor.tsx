'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Unlock } from 'lucide-react';
import { TreasureJewelryAsset } from './TreasureJewelryAsset';

interface Vault3DDoorProps {
  correctCount: number;
  totalNeeded?: number;
  roundNumber?: number;
  lastSolvedTeam?: 'blue' | 'red' | null;
}

export const Vault3DDoor: React.FC<Vault3DDoorProps> = ({
  correctCount,
  totalNeeded = 5,
  roundNumber = 1,
  lastSolvedTeam = null,
}) => {
  const [wheelRotation, setWheelRotation] = useState<number>(0);

  // When correct count increases, turn the physical mechanical handle wheel
  useEffect(() => {
    if (correctCount > 0) {
      setWheelRotation((prev) => prev + 180);
    }
  }, [correctCount]);

  const openPercentage = Math.min(100, (correctCount / totalNeeded) * 100);
  const doorRotateY = Math.min(85, (openPercentage / 100) * 85);
  const interiorLightOpacity = Math.min(1, Math.max(0.15, openPercentage / 100));

  return (
    <div className="relative flex items-center justify-center w-[270px] h-[270px] sm:w-[320px] sm:h-[320px] md:w-[370px] md:h-[370px] lg:w-[410px] lg:h-[410px] aspect-square select-none perspective-[1200px] mx-auto">
      
      {/* 1. SQUARE STEEL WALL HOUSING PLATE */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#8a99a8] via-[#758494] to-[#596675] rounded-2xl border-3 sm:border-4 border-slate-900 shadow-[0_15px_40px_rgba(0,0,0,0.35),inset_0_2px_4px_rgba(255,255,255,0.8),inset_0_-4px_8px_rgba(0,0,0,0.6)] flex items-center justify-center">
        
        {/* Left Small Wall NFC Reader */}
        <div className="absolute left-2 sm:left-2.5 top-1/2 -translate-y-1/2 w-6 sm:w-8 h-11 sm:h-14 bg-white rounded border-2 border-slate-800 shadow flex flex-col items-center justify-around py-1 z-20">
          <div className="w-3 sm:w-4 h-1 sm:h-1.5 bg-slate-800 rounded-sm" />
          <div className="w-4 sm:w-5 h-4 sm:h-5 bg-slate-200 border border-slate-400 rounded-sm flex items-center justify-center text-[6px] sm:text-[7px] font-black text-slate-800">
            NFC
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>

        {/* Right Small Wall Security Display (Stage Lock Indicators) */}
        <div className="absolute right-2 sm:right-2.5 top-1/2 -translate-y-1/2 w-7 sm:w-9 h-16 sm:h-20 bg-[#162130] rounded border-2 border-slate-800 shadow p-1 flex flex-col justify-between z-20">
          <span className="text-[6px] font-mono text-cyan-300 text-center font-bold">
            LOCKS
          </span>
          {/* Lock Stage LEDs */}
          <div className="flex flex-col gap-0.5 sm:gap-1 items-center">
            {Array.from({ length: Math.min(10, totalNeeded) }).map((_, idx) => {
              const isUnlocked = (correctCount / totalNeeded) * Math.min(10, totalNeeded) > idx;
              return (
                <div
                  key={idx}
                  className={`w-3.5 sm:w-4 h-1 sm:h-1.5 rounded-sm transition-colors duration-500 ${
                    isUnlocked
                      ? 'bg-emerald-400 shadow-[0_0_6px_#00e5ff]'
                      : 'bg-rose-900/80 border border-rose-700/50'
                  }`}
                />
              );
            })}
          </div>
          <span className="text-[6px] font-mono text-amber-300 text-center font-bold">
            {correctCount}/{totalNeeded}
          </span>
        </div>

        {/* 2. REVEALED VAULT INTERIOR (Visible Gold Bars & Gems Inside Crack) */}
        <div className="absolute w-[80%] h-[80%] rounded-full bg-[#101827] border-3 sm:border-4 border-slate-950 overflow-hidden flex items-center justify-center shadow-inner">
          <div
            className="absolute inset-0 bg-radial from-amber-300/80 via-amber-500/40 to-transparent transition-opacity duration-700"
            style={{ opacity: interiorLightOpacity }}
          />

          <div
            className="absolute inset-0 flex items-center justify-center gap-2 sm:gap-3 transition-all duration-700 pointer-events-none"
            style={{
              opacity: correctCount > 0 ? 1 : 0,
              transform: `scale(${0.65 + (openPercentage / 100) * 0.35})`,
            }}
          >
            <div className="flex flex-col items-center">
              <TreasureJewelryAsset type="gold_bar" size={50} className="-mb-2" />
              <TreasureJewelryAsset type="gold_bar" size={60} />
            </div>
            <div className="flex flex-col items-center">
              <TreasureJewelryAsset type="diamond" size={40} className="animate-pulse" />
              <TreasureJewelryAsset type="ruby" size={35} />
            </div>
          </div>
        </div>

        {/* 3. PROGRESSIVE SWINGING CIRCULAR VAULT DOOR */}
        <motion.div
          animate={{
            rotateY: -doorRotateY,
            x: -(openPercentage / 100) * 50,
          }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="relative w-[80%] h-[80%] rounded-full bg-gradient-to-br from-[#7a8b9c] via-[#637282] to-[#434e5a] border-3 sm:border-4 border-slate-950 shadow-[0_10px_30px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(255,255,255,0.7)] flex items-center justify-center transform-origin-left z-10"
        >
          {/* Black Circular Inset Ring */}
          <div className="absolute inset-2 rounded-full border-2 border-slate-900 pointer-events-none" />

          {/* 6 Radial Gold Locking Spokes */}
          {[0, 60, 120, 180, 240, 300].map((deg) => (
            <div
              key={deg}
              className="absolute w-1 sm:w-1.5 h-28 sm:h-36 bg-gradient-to-t from-amber-500 via-yellow-300 to-amber-600 border border-slate-900 rounded-sm shadow-sm"
              style={{
                transform: `rotate(${deg}deg) translate(0, -32px)`,
              }}
            >
              <div className="absolute top-0 -left-1 sm:-left-1.5 w-3 sm:w-4 h-2.5 sm:h-3 bg-slate-800 border border-slate-600 rounded-sm" />
            </div>
          ))}

          {/* 4. THE SIGNATURE BOLD YELLOW "I"-BEAM LOCK BRACKET */}
          <div
            className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 w-16 sm:w-22 md:w-24 h-28 sm:h-38 md:h-44 bg-gradient-to-r from-[#ffe135] via-[#ffd700] to-[#e6b800] border-3 sm:border-4 border-slate-950 rounded-xl shadow-[0_6px_20px_rgba(0,0,0,0.7),inset_0_2px_4px_rgba(255,255,255,0.9)] z-20 flex flex-col justify-between p-1"
            style={{
              clipPath:
                'polygon(0% 0%, 100% 0%, 100% 28%, 70% 38%, 70% 62%, 100% 72%, 100% 100%, 0% 100%, 0% 72%, 30% 62%, 30% 38%, 0% 28%)',
            }}
          >
            <div className="w-full flex justify-between px-0.5">
              <div className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-slate-900 border border-amber-200 shadow-inner" />
              <div className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-slate-900 border border-amber-200 shadow-inner" />
            </div>
            <div className="w-full flex justify-between px-0.5">
              <div className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-slate-900 border border-amber-200 shadow-inner" />
              <div className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-slate-900 border border-amber-200 shadow-inner" />
            </div>
          </div>

          {/* 5. CENTER MECHANICAL MASTER VAULT WHEEL & CORE LOCK */}
          <div className="relative w-28 sm:w-36 md:w-40 h-28 sm:h-36 md:h-40 rounded-full bg-gradient-to-br from-[#2b3542] via-[#1a232f] to-[#0f172a] border-3 sm:border-4 border-slate-900 shadow-[0_6px_25px_rgba(0,0,0,0.8),inset_0_2px_4px_rgba(255,255,255,0.4)] z-30 flex flex-col items-center justify-center p-1.5 sm:p-2">
            
            {/* Outer Circular Steel Gear Notches */}
            <div className="absolute inset-1 rounded-full border-2 border-dashed border-slate-700/60 pointer-events-none" />

            {/* PHYSICAL ROTATING 6-SPOKE MASTER VAULT WHEEL */}
            <motion.div
              animate={{ rotate: wheelRotation }}
              transition={{ duration: 0.8, type: 'spring', stiffness: 180, damping: 15 }}
              className="relative w-20 sm:w-26 md:w-28 h-20 sm:h-26 md:h-28 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-300 border-3 sm:border-4 border-slate-950 shadow-[0_4px_15px_rgba(0,0,0,0.7),inset_0_2px_4px_rgba(255,255,255,0.8)] flex items-center justify-center"
            >
              {/* 6 Heavy Spokes */}
              {[0, 60, 120, 180, 240, 300].map((deg) => (
                <div
                  key={deg}
                  className="absolute w-1.5 sm:w-2 h-10 sm:h-14 bg-gradient-to-b from-slate-950 via-slate-800 to-slate-950 border border-amber-300/40 rounded-sm"
                  style={{ transform: `rotate(${deg}deg) translate(0, -12px)` }}
                />
              ))}

              {/* Center Core Hub & Status Emblem */}
              <div className="relative w-10 sm:w-12 md:w-14 h-10 sm:h-12 md:h-14 rounded-full bg-gradient-to-br from-slate-900 via-slate-800 to-black border-2 border-amber-400 shadow-inner flex flex-col items-center justify-center z-10">
                {correctCount >= totalNeeded ? (
                  <Unlock className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-emerald-400" />
                ) : (
                  <Lock className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-amber-300" />
                )}
                <span className="text-[6px] sm:text-[7px] font-black tracking-widest text-amber-400 font-game uppercase">
                  {correctCount >= totalNeeded ? 'OPEN' : 'SECURE'}
                </span>
              </div>
            </motion.div>

          </div>

        </motion.div>

      </div>
    </div>
  );
};
