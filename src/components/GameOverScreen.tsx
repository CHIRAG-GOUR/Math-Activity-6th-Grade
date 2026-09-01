'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Trophy, Key, RotateCcw, Settings, Sparkles } from 'lucide-react';
import { TeamState } from '@/types/game';
import { soundManager } from '@/utils/audio';

interface GameOverScreenProps {
  teamBlue: TeamState;
  teamRed: TeamState;
  onPlayAgain: () => void;
  onChangeSettings: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  teamBlue,
  teamRed,
  onPlayAgain,
  onChangeSettings,
}) => {
  const blueWon = teamBlue.score > teamRed.score || (teamBlue.score === teamRed.score && teamBlue.keys > teamRed.keys);
  const redWon = teamRed.score > teamBlue.score || (teamBlue.score === teamRed.score && teamRed.keys > teamBlue.keys);
  const isDraw = teamBlue.score === teamRed.score && teamBlue.keys === teamRed.keys;

  useEffect(() => {
    soundManager.playVaultCracked();

    // Trigger explosive confetti celebration
    const count = 220;
    const defaults = {
      origin: { y: 0.65 },
      colors: blueWon
        ? ['#00F0FF', '#FFD700', '#FFFFFF', '#0099FF']
        : redWon
        ? ['#FF3366', '#FFD700', '#FFFFFF', '#FF5500']
        : ['#FFD700', '#00F0FF', '#FF3366', '#FFFFFF'],
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  }, [blueWon, redWon]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 z-40 select-none max-w-5xl mx-auto overflow-y-auto">
      {/* Background Volumetric Glow */}
      <div className="absolute inset-0 bg-radial from-amber-500/25 via-black/80 to-black/95 pointer-events-none" />

      {/* Main Victory Headline */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 350, damping: 16 }}
        className="flex flex-col items-center text-center mb-6 z-10"
      >
        <div className="flex items-center gap-2 px-5 py-1.5 rounded-full bg-amber-500/20 border-2 border-amber-400 text-amber-300 text-xs font-black tracking-widest uppercase font-game mb-2 shadow-[0_0_20px_rgba(255,215,0,0.6)]">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>VAULT CRACKED • HEIST COMPLETE</span>
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-game uppercase tracking-tight text-white drop-shadow-[0_10px_35px_rgba(0,0,0,1)]">
          {blueWon ? (
            <span className="blue-gradient-text">{teamBlue.name} WINS!</span>
          ) : redWon ? (
            <span className="red-gradient-text">{teamRed.name} WINS!</span>
          ) : (
            <span className="gold-gradient-text">EPIC DRAW!</span>
          )}
        </h1>
        <p className="text-sm sm:text-lg font-black text-amber-200 uppercase tracking-widest font-game mt-1">
          THE GOLDEN VAULT TREASURE HAS BEEN SECURED
        </p>
      </motion.div>

      {/* Duel Comparison Match Consoles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-8 z-10">
        
        {/* Team Blue Match Console */}
        <motion.div
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className={`p-6 rounded-3xl border-2 backdrop-blur-md flex flex-col justify-between ${
            blueWon
              ? 'hud-panel-blue ring-4 ring-cyan-300/80 shadow-[0_0_50px_rgba(0,240,255,0.5)]'
              : 'bg-slate-950/80 border-slate-700/80 opacity-80'
          }`}
        >
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_12px_#00f0ff]" />
              <h3 className="text-2xl font-black text-cyan-300 uppercase font-game">
                {teamBlue.name}
              </h3>
            </div>
            {blueWon && (
              <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase font-game shadow-[0_0_12px_rgba(255,215,0,0.8)]">
                <Trophy className="w-4 h-4" />
                <span>CHAMPIONS</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 my-2">
            <div className="flex flex-col">
              <span className="text-xs font-black text-slate-400 uppercase font-game">TOTAL SCORE</span>
              <span className="text-5xl font-black text-white font-display">{teamBlue.score}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black text-slate-400 uppercase font-game">KEYS OBTAINED</span>
              <div className="flex items-center gap-1 text-3xl font-black text-amber-300 font-game">
                <span>{teamBlue.keys}/3</span>
                <Key className="w-6 h-6 text-amber-400" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Team Red Match Console */}
        <motion.div
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className={`p-6 rounded-3xl border-2 backdrop-blur-md flex flex-col justify-between ${
            redWon
              ? 'hud-panel-red ring-4 ring-rose-300/80 shadow-[0_0_50px_rgba(255,51,102,0.5)]'
              : 'bg-slate-950/80 border-slate-700/80 opacity-80'
          }`}
        >
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-rose-400 shadow-[0_0_12px_#ff3366]" />
              <h3 className="text-2xl font-black text-rose-300 uppercase font-game">
                {teamRed.name}
              </h3>
            </div>
            {redWon && (
              <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase font-game shadow-[0_0_12px_rgba(255,215,0,0.8)]">
                <Trophy className="w-4 h-4" />
                <span>CHAMPIONS</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 my-2">
            <div className="flex flex-col">
              <span className="text-xs font-black text-slate-400 uppercase font-game">TOTAL SCORE</span>
              <span className="text-5xl font-black text-white font-display">{teamRed.score}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black text-slate-400 uppercase font-game">KEYS OBTAINED</span>
              <div className="flex items-center gap-1 text-3xl font-black text-amber-300 font-game">
                <span>{teamRed.keys}/3</span>
                <Key className="w-6 h-6 text-amber-400" />
              </div>
            </div>
          </div>
        </motion.div>

      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4 z-10">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            soundManager.playClick();
            onPlayAgain();
          }}
          className="tactile-btn gold-shine-effect px-10 sm:px-14 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-600 border-2 border-yellow-100 text-slate-950 font-black text-lg sm:text-xl uppercase font-game shadow-[0_0_40px_rgba(255,215,0,0.8)] flex items-center gap-3 cursor-pointer overflow-hidden"
        >
          <RotateCcw className="w-6 h-6 stroke-[3]" />
          <span>PLAY AGAIN</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            soundManager.playClick();
            onChangeSettings();
          }}
          className="tactile-btn px-8 sm:px-10 py-4 rounded-2xl bg-slate-950/90 border-2 border-slate-700 text-slate-300 hover:text-white font-black text-lg uppercase font-game shadow-xl flex items-center gap-2.5 cursor-pointer"
        >
          <Settings className="w-5 h-5" />
          <span>CHANGE HEIST CONFIG</span>
        </motion.button>
      </div>
    </div>
  );
};
