'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { TeamForgeState } from '../types';
import { soundManager } from '@/utils/audio';
import {
  Award,
  Crown,
  Home,
  RotateCcw,
  Sparkles,
  Trophy,
  Users,
  Wrench,
} from 'lucide-react';

interface ForgeVictoryScreenProps {
  teamBlue: TeamForgeState;
  teamRed: TeamForgeState;
  onPlayAgain: () => void;
}

export const ForgeVictoryScreen: React.FC<ForgeVictoryScreenProps> = ({
  teamBlue,
  teamRed,
  onPlayAgain,
}) => {
  const blueWon = teamBlue.score > teamRed.score;
  const redWon = teamRed.score > teamBlue.score;
  const isTied = teamBlue.score === teamRed.score;

  useEffect(() => {
    soundManager.playVictory();

    // Trigger celebratory confetti burst
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#3b82f6', '#10b981', '#ffffff'],
    });
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-4 sm:p-8 z-40 select-none max-w-5xl mx-auto overflow-y-auto">
      
      {/* 1. TOP HEADER BANNER */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex flex-col items-center text-center mt-2"
      >
        <div className="flex items-center gap-2 px-5 py-1.5 rounded-full bg-amber-400 border-2 border-slate-950 text-slate-950 font-black text-xs font-game tracking-widest uppercase shadow-lg mb-2">
          <Award className="w-4 h-4 text-slate-950" />
          <span>BLOOM’S TAXONOMY FORGE COMPLETE</span>
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black font-bank uppercase tracking-tight text-white drop-shadow-[0_8px_25px_rgba(0,0,0,0.8)]">
          {isTied ? (
            <span className="text-amber-300">MASTER CO-INVENTORS!</span>
          ) : blueWon ? (
            <span className="text-cyan-300">{teamBlue.name.toUpperCase()} WINS!</span>
          ) : (
            <span className="text-amber-400">{teamRed.name.toUpperCase()} WINS!</span>
          )}
        </h1>

        <p className="text-sm sm:text-base font-bold text-amber-200 font-game tracking-wide mt-1">
          Full Place Value, Decomposition, Rounding & Constraint Blueprints Mastered!
        </p>
      </motion.div>

      {/* 2. CENTER SCORE & BLOOM'S MASTERY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl my-4">
        
        {/* TEAM BLUE CARD */}
        <motion.div
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className={`p-6 rounded-3xl border-3 flex flex-col items-center text-center shadow-2xl backdrop-blur-xl ${
            blueWon || isTied
              ? 'bg-blue-950/90 border-cyan-400 ring-4 ring-cyan-400/30'
              : 'bg-slate-900/80 border-slate-700'
          }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-blue-600/80 border-2 border-cyan-400 flex items-center justify-center text-white mb-2 shadow-md">
            {blueWon ? <Crown className="w-8 h-8 text-amber-300" /> : <Wrench className="w-7 h-7 text-cyan-200" />}
          </div>
          <span className="text-sm font-black font-game uppercase text-cyan-300">{teamBlue.name}</span>
          <span className="text-4xl sm:text-5xl font-black font-bank text-white mt-1">
            {teamBlue.score} <span className="text-lg font-bold text-cyan-300">PTS</span>
          </span>
          <div className="mt-3 px-3 py-1 rounded-full bg-blue-900/60 border border-cyan-400/40 text-[11px] font-black font-game text-cyan-200">
            {teamBlue.completedCount} Challenges Calibrated
          </div>
        </motion.div>

        {/* TEAM RED CARD */}
        <motion.div
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className={`p-6 rounded-3xl border-3 flex flex-col items-center text-center shadow-2xl backdrop-blur-xl ${
            redWon || isTied
              ? 'bg-amber-950/90 border-amber-400 ring-4 ring-amber-400/30'
              : 'bg-slate-900/80 border-slate-700'
          }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-amber-600/80 border-2 border-amber-400 flex items-center justify-center text-white mb-2 shadow-md">
            {redWon ? <Crown className="w-8 h-8 text-yellow-300" /> : <Wrench className="w-7 h-7 text-amber-200" />}
          </div>
          <span className="text-sm font-black font-game uppercase text-amber-300">{teamRed.name}</span>
          <span className="text-4xl sm:text-5xl font-black font-bank text-white mt-1">
            {teamRed.score} <span className="text-lg font-bold text-amber-300">PTS</span>
          </span>
          <div className="mt-3 px-3 py-1 rounded-full bg-amber-900/60 border border-amber-400/40 text-[11px] font-black font-game text-amber-200">
            {teamRed.completedCount} Challenges Calibrated
          </div>
        </motion.div>

      </div>

      {/* 3. BOTTOM ACTION BUTTONS */}
      <div className="flex flex-wrap items-center justify-center gap-4 z-30 mb-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            soundManager.playClick();
            onPlayAgain();
          }}
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 border-2 border-white text-slate-950 font-black text-base uppercase font-game shadow-2xl flex items-center gap-2 cursor-pointer hover:brightness-110"
        >
          <RotateCcw className="w-5 h-5 stroke-[2.5]" />
          <span>PLAY AGAIN</span>
        </motion.button>

        <Link
          href="/"
          onClick={() => soundManager.playClick()}
          className="px-6 py-3.5 rounded-2xl bg-white border-2 border-amber-400 text-slate-950 font-black text-base uppercase font-game shadow flex items-center gap-2 cursor-pointer hover:bg-amber-50 transition"
        >
          <Home className="w-5 h-5 text-amber-600" />
          <span>ARCADE HUB</span>
        </Link>
      </div>

    </div>
  );
};
