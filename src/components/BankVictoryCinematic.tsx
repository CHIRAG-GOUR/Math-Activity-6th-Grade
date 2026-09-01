'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, Settings, Sparkles, Landmark } from 'lucide-react';
import { OrnateKey } from './OrnateKey';
import { TeamState } from '@/types/game';
import { soundManager } from '@/utils/audio';

interface BankVictoryCinematicProps {
  teamBlue: TeamState;
  teamRed: TeamState;
  onPlayAgain: () => void;
  onChangeSettings: () => void;
}

export const BankVictoryCinematic: React.FC<BankVictoryCinematicProps> = ({
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

    // Trigger celebratory gold and team confetti shower
    const count = 250;
    const defaults = {
      origin: { y: 0.65 },
      colors: blueWon
        ? ['#0088FF', '#FFD700', '#FFFFFF', '#00C8FF']
        : redWon
        ? ['#FF2A5F', '#FFD700', '#FFFFFF', '#FFAA00']
        : ['#FFD700', '#0088FF', '#FF2A5F', '#FFFFFF'],
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
    <div className="relative w-full h-full flex flex-col items-center justify-center p-6 sm:p-8 z-40 select-none max-w-5xl mx-auto overflow-y-auto">
      {/* Background Volumetric Gold Glow */}
      <div className="absolute inset-0 bg-radial from-amber-400/35 via-amber-100/70 to-amber-200/90 pointer-events-none" />

      {/* Main Victory Header */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 350, damping: 16 }}
        className="flex flex-col items-center text-center mb-6 z-10"
      >
        <div className="flex items-center gap-2 px-5 py-1.5 rounded-full bg-white/90 border-2 border-amber-400 text-amber-900 text-xs font-black tracking-widest uppercase font-game mb-2 shadow-sm">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>VAULT CODE CRACKED • MISSION ACCOMPLISHED</span>
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-bank uppercase tracking-tight text-slate-900 drop-shadow-md">
          {blueWon ? (
            <span className="blue-bank-text">{teamBlue.name} WINS!</span>
          ) : redWon ? (
            <span className="red-bank-text">{teamRed.name} WINS!</span>
          ) : (
            <span className="bank-gold-text">EPIC DRAW!</span>
          )}
        </h1>
        <p className="text-sm sm:text-lg font-black text-amber-950 uppercase tracking-widest font-game mt-1">
          THE CENTRAL BANK TREASURY HAS BEEN SECURED
        </p>
      </motion.div>

      {/* Match Consoles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-8 z-10">
        
        {/* Team Blue Match Console */}
        <motion.div
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className={`p-6 rounded-3xl backdrop-blur-md flex flex-col justify-between ${
            blueWon
              ? 'bank-console-blue ring-4 ring-blue-400 shadow-xl'
              : 'bg-white/80 border-2 border-slate-300 opacity-85'
          }`}
        >
          <div className="flex items-center justify-between border-b-2 border-slate-200 pb-3 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-4 h-4 rounded-full bg-[#0088ff] shadow-[0_0_10px_#0088ff]" />
              <h3 className="text-2xl font-black text-blue-900 uppercase font-game">
                {teamBlue.name}
              </h3>
            </div>
            {blueWon && (
              <div className="flex items-center gap-1.5 px-4 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-black text-xs uppercase font-game shadow-sm">
                <Trophy className="w-4 h-4" />
                <span>CHAMPIONS</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 my-2">
            <div className="flex flex-col">
              <span className="text-xs font-black text-slate-500 uppercase font-game">FINAL SCORE</span>
              <span className="text-5xl font-black text-slate-900 font-display">{teamBlue.score}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black text-slate-500 uppercase font-game">KEYS OBTAINED</span>
              <div className="flex items-center gap-2 text-3xl font-black text-amber-700 font-game">
                <span>{teamBlue.keys}/3</span>
                <OrnateKey size={26} color="blue" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Team Red Match Console */}
        <motion.div
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className={`p-6 rounded-3xl backdrop-blur-md flex flex-col justify-between ${
            redWon
              ? 'bank-console-red ring-4 ring-rose-400 shadow-xl'
              : 'bg-white/80 border-2 border-slate-300 opacity-85'
          }`}
        >
          <div className="flex items-center justify-between border-b-2 border-slate-200 pb-3 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-4 h-4 rounded-full bg-[#ff2a5f] shadow-[0_0_10px_#ff2a5f]" />
              <h3 className="text-2xl font-black text-rose-900 uppercase font-game">
                {teamRed.name}
              </h3>
            </div>
            {redWon && (
              <div className="flex items-center gap-1.5 px-4 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-black text-xs uppercase font-game shadow-sm">
                <Trophy className="w-4 h-4" />
                <span>CHAMPIONS</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 my-2">
            <div className="flex flex-col">
              <span className="text-xs font-black text-slate-500 uppercase font-game">FINAL SCORE</span>
              <span className="text-5xl font-black text-slate-900 font-display">{teamRed.score}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black text-slate-500 uppercase font-game">KEYS OBTAINED</span>
              <div className="flex items-center gap-2 text-3xl font-black text-amber-700 font-game">
                <span>{teamRed.keys}/3</span>
                <OrnateKey size={26} color="red" />
              </div>
            </div>
          </div>
        </motion.div>

      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-5 z-10">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            soundManager.playClick();
            onPlayAgain();
          }}
          className="px-10 sm:px-14 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 border-2 border-white text-white font-black text-lg sm:text-xl uppercase font-game shadow-lg flex items-center gap-3 cursor-pointer"
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
          className="px-8 sm:px-10 py-4 rounded-2xl bg-white border-2 border-amber-400 text-amber-950 font-black text-lg uppercase font-game shadow-md flex items-center gap-2.5 cursor-pointer hover:bg-amber-50"
        >
          <Settings className="w-5 h-5 text-amber-800" />
          <span>NEW HEIST SETUP</span>
        </motion.button>
      </div>
    </div>
  );
};
