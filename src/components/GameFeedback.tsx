'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Key, Zap, CheckCircle2, AlertTriangle } from 'lucide-react';
import { TeamState } from '@/types/game';

interface GameFeedbackProps {
  teamBlue: TeamState;
  teamRed: TeamState;
  isRevealed: boolean;
  blueEarnedKey?: boolean;
  redEarnedKey?: boolean;
}

export const GameFeedback: React.FC<GameFeedbackProps> = ({
  teamBlue,
  teamRed,
  isRevealed,
  blueEarnedKey = false,
  redEarnedKey = false,
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden flex items-center justify-between px-10">
      {/* Team Blue Feedback Zone (Left) */}
      <div className="flex flex-col items-center gap-3 w-80">
        <AnimatePresence>
          {isRevealed && teamBlue.lastResult === 'correct' && (
            <motion.div
              initial={{ scale: 0, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: -40, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 350, damping: 15 }}
              className="flex flex-col items-center px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-600/90 to-blue-700/90 border-2 border-cyan-300 shadow-[0_0_40px_rgba(0,240,255,0.8)] backdrop-blur-md"
            >
              <div className="flex items-center gap-2 text-white font-black text-2xl tracking-wider uppercase font-game">
                <CheckCircle2 className="w-7 h-7 text-cyan-200" />
                <span>CORRECT!</span>
              </div>
              <span className="text-xl font-extrabold text-yellow-300 font-display">
                +{teamBlue.lastScoreGained} PTS
              </span>
            </motion.div>
          )}

          {isRevealed && teamBlue.lastResult === 'wrong' && (
            <motion.div
              initial={{ scale: 0, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: -40, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 350, damping: 15 }}
              className="flex flex-col items-center px-5 py-2.5 rounded-2xl bg-gradient-to-r from-slate-800/90 to-slate-900/90 border border-slate-600 shadow-xl backdrop-blur-md"
            >
              <div className="flex items-center gap-2 text-slate-300 font-bold text-lg tracking-wider uppercase font-game">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                <span>TRY AGAIN</span>
              </div>
            </motion.div>
          )}

          {/* Blue Combo Banner */}
          {isRevealed && teamBlue.comboTitle && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotate: -5 }}
              animate={{ scale: [1, 1.15, 1], opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-sm sm:text-base tracking-widest uppercase font-game shadow-[0_0_20px_rgba(255,215,0,0.8)] flex items-center gap-1.5"
            >
              <Flame className="w-4 h-4 fill-slate-950 text-slate-950" />
              <span>{teamBlue.comboTitle}</span>
            </motion.div>
          )}

          {/* Blue Key Earned Notification */}
          {blueEarnedKey && (
            <motion.div
              initial={{ scale: 0, y: 50 }}
              animate={{ scale: 1.1, y: 0 }}
              exit={{ scale: 0, y: -50 }}
              className="px-5 py-2 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 font-black text-lg tracking-wider uppercase font-game shadow-[0_0_30px_rgba(255,215,0,0.9)] flex items-center gap-2 border-2 border-white"
            >
              <Key className="w-6 h-6 stroke-[3]" />
              <span>VAULT KEY UNLOCKED!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Team Red Feedback Zone (Right) */}
      <div className="flex flex-col items-center gap-3 w-80">
        <AnimatePresence>
          {isRevealed && teamRed.lastResult === 'correct' && (
            <motion.div
              initial={{ scale: 0, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: -40, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 350, damping: 15 }}
              className="flex flex-col items-center px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-600/90 to-red-700/90 border-2 border-rose-300 shadow-[0_0_40px_rgba(255,51,102,0.8)] backdrop-blur-md"
            >
              <div className="flex items-center gap-2 text-white font-black text-2xl tracking-wider uppercase font-game">
                <CheckCircle2 className="w-7 h-7 text-rose-200" />
                <span>CORRECT!</span>
              </div>
              <span className="text-xl font-extrabold text-yellow-300 font-display">
                +{teamRed.lastScoreGained} PTS
              </span>
            </motion.div>
          )}

          {isRevealed && teamRed.lastResult === 'wrong' && (
            <motion.div
              initial={{ scale: 0, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: -40, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 350, damping: 15 }}
              className="flex flex-col items-center px-5 py-2.5 rounded-2xl bg-gradient-to-r from-slate-800/90 to-slate-900/90 border border-slate-600 shadow-xl backdrop-blur-md"
            >
              <div className="flex items-center gap-2 text-slate-300 font-bold text-lg tracking-wider uppercase font-game">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                <span>TRY AGAIN</span>
              </div>
            </motion.div>
          )}

          {/* Red Combo Banner */}
          {isRevealed && teamRed.comboTitle && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotate: 5 }}
              animate={{ scale: [1, 1.15, 1], opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-sm sm:text-base tracking-widest uppercase font-game shadow-[0_0_20px_rgba(255,215,0,0.8)] flex items-center gap-1.5"
            >
              <Flame className="w-4 h-4 fill-slate-950 text-slate-950" />
              <span>{teamRed.comboTitle}</span>
            </motion.div>
          )}

          {/* Red Key Earned Notification */}
          {redEarnedKey && (
            <motion.div
              initial={{ scale: 0, y: 50 }}
              animate={{ scale: 1.1, y: 0 }}
              exit={{ scale: 0, y: -50 }}
              className="px-5 py-2 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 font-black text-lg tracking-wider uppercase font-game shadow-[0_0_30px_rgba(255,215,0,0.9)] flex items-center gap-2 border-2 border-white"
            >
              <Key className="w-6 h-6 stroke-[3]" />
              <span>VAULT KEY UNLOCKED!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
