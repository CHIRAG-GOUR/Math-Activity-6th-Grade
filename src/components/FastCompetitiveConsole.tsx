'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Delete, CheckCircle2, Lock, AlertCircle, Unlock, Siren, AlertTriangle, Zap } from 'lucide-react';
import { TeamId, TeamState } from '@/types/game';
import { soundManager } from '@/utils/audio';

interface FastCompetitiveConsoleProps {
  team: TeamState;
  otherTeam: TeamState;
  isLockedOut: boolean;
  isStealOpportunity: boolean;
  wrongStrikes: number; // 0, 1, 2, 3
  isBusted: boolean; // triggered when 3 wrong answers
  isSkippingRound?: boolean;
  attemptsLeft?: number;
  correctAnswer: number | string | null;
  isRevealed: boolean;
  disabled: boolean;
  isComebackSurge?: boolean;
  misconceptionHint?: string | null;
  hint5050?: string | null;
  onDigitPress: (teamId: TeamId, digit: string) => void;
  onClearPress: (teamId: TeamId) => void;
  onSubmitPress: (teamId: TeamId) => void;
}

export const FastCompetitiveConsole: React.FC<FastCompetitiveConsoleProps> = ({
  team,
  otherTeam,
  isLockedOut,
  isStealOpportunity,
  wrongStrikes,
  isBusted,
  isSkippingRound = false,
  attemptsLeft = 2,
  isRevealed,
  disabled,
  isComebackSurge = false,
  misconceptionHint = null,
  hint5050 = null,
  onDigitPress,
  onClearPress,
  onSubmitPress,
}) => {
  const isBlue = team.id === 'blue';
  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
  const isBlocked = disabled || isLockedOut || isBusted || team.isLocked || isSkippingRound;

  return (
    <div
      className={`relative w-full max-w-[360px] mx-auto p-3.5 sm:p-4 rounded-2xl select-none transition-all flex flex-col justify-between shadow-xl overflow-hidden ${
        isBlue ? 'bank-console-blue' : 'bank-console-red'
      } ${isBusted ? 'ring-4 ring-rose-600 bg-rose-100/90' : isStealOpportunity ? 'ring-4 ring-yellow-400 animate-pulse' : ''}`}
      onPointerDown={(e) => e.stopPropagation()}
    >
      {/* BUSTED OVERLAY WHEN 3 WRONG ANSWERS TRIGGERED */}
      {/* 🚨 3-STRIKES BUSTED / SKIPPED ROUND OVERLAY */}
      <AnimatePresence>
        {(isBusted || isSkippingRound) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 rounded-3xl bg-red-950/90 backdrop-blur-sm border-4 border-red-500 p-4 flex flex-col items-center justify-center text-center shadow-2xl"
          >
            <Siren className="w-12 h-12 text-red-400 animate-bounce mb-2" />
            <span className="text-xl sm:text-2xl font-black font-bank text-white uppercase tracking-wider drop-shadow">
              {isSkippingRound ? 'ROUND SKIPPED!' : 'BUSTED!'}
            </span>
            <span className="text-xs font-mono font-bold text-red-200 uppercase mt-1">
              {isSkippingRound ? 'PENALTY FOR PREVIOUS BUST' : 'SECURITY ALARM TRIGGERED'}
            </span>
            <span className="px-3 py-1 rounded-full bg-red-800 text-white text-[10px] font-black font-game uppercase mt-2">
              LOCKED OUT THIS ROUND
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. CONSOLE HEADER */}
      <div className="flex items-center justify-between border-b border-slate-300 pb-1.5 mb-2">
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              isBlue ? 'bg-[#0088ff] shadow-[0_0_8px_#0088ff]' : 'bg-[#ff2a5f] shadow-[0_0_8px_#ff2a5f]'
            }`}
          />
          <h3
            className={`text-sm sm:text-base font-black tracking-wide uppercase font-game ${
              isBlue ? 'text-[#0055aa]' : 'text-[#aa1133]'
            }`}
          >
            {team.name}
          </h3>
        </div>

        {/* ATTEMPTS OR STRIKES */}
        <div className="flex items-center gap-1.5">
          {!isBlocked && attemptsLeft === 1 && (
            <span className="px-1.5 py-0.5 rounded-md text-[8.5px] font-black uppercase font-game bg-amber-400 text-slate-950 border border-amber-500 animate-pulse">
              1 TRY LEFT
            </span>
          )}

          {/* 3 STRIKE WARNING METER */}
          <div className="flex items-center gap-1 bg-slate-200/90 px-2 py-0.5 rounded-md border border-slate-300">
            <span className="text-[9px] font-black text-slate-600 font-game uppercase mr-0.5">
              STRIKES
            </span>
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  wrongStrikes >= s ? 'bg-rose-600 shadow-[0_0_6px_#ff0033]' : 'bg-slate-300'
                }`}
              />
            ))}
          </div>
        </div>

        {isStealOpportunity && !isLockedOut && !team.isLocked && !isBusted && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase font-game bg-amber-400 text-slate-950 border border-amber-600 animate-bounce shadow flex items-center gap-0.5">
            <Zap className="w-2.5 h-2.5 fill-slate-950" />
            <span>STEAL!</span>
          </span>
        )}

        {isComebackSurge && !isLockedOut && (
          <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase font-game bg-gradient-to-r from-orange-500 to-amber-400 text-slate-950 border border-orange-600 animate-pulse shadow flex items-center gap-0.5">
            <span>🔥 COMEBACK SURGE (+25%)</span>
          </span>
        )}
      </div>

      {/* Misconception Hint on 1st Mistake */}
      {attemptsLeft === 1 && misconceptionHint && !isBlocked && (
        <div className="mb-2 px-2.5 py-1 rounded-lg bg-amber-400/20 border-2 border-amber-400 text-amber-900 dark:text-amber-200 text-[10.5px] font-bold font-game flex items-center gap-1.5 animate-fadeIn">
          <span>{misconceptionHint}</span>
        </div>
      )}

      {/* 50:50 Eliminator Clue (if active) */}
      {hint5050 && !isBlocked && (
        <div className="mb-2 px-2.5 py-1 rounded-lg bg-sky-400/20 border-2 border-sky-400 text-sky-900 dark:text-sky-200 text-[10.5px] font-bold font-game flex items-center gap-1.5 animate-pulse">
          <span>{hint5050}</span>
        </div>
      )}

      {/* 2. DIGITAL LCD DISPLAY */}
      <div
        className={`relative w-full h-14 sm:h-16 rounded-xl flex items-center justify-between px-3.5 mb-2.5 ${
          isBlue ? 'bank-lcd-blue' : 'bank-lcd-red'
        }`}
      >
        <div className="flex flex-col">
          <span className="text-[9px] font-bold tracking-wider uppercase text-slate-400 font-game">
            ACCESS CODE
          </span>
          <div className="flex items-center gap-1">
            {isLockedOut ? (
              <span className="text-[10px] font-black text-rose-400 font-game uppercase flex items-center gap-0.5">
                <AlertCircle className="w-3 h-3 text-rose-500" />
                <span>DENIED</span>
              </span>
            ) : team.isLocked && !isRevealed ? (
              <span className="text-[10px] font-black text-amber-300 font-game uppercase flex items-center gap-0.5">
                <Lock className="w-3 h-3 text-amber-400" />
                <span>LOCKED</span>
              </span>
            ) : isRevealed ? (
              <span
                className={`text-[10px] font-black uppercase font-game flex items-center gap-0.5 ${
                  team.lastResult === 'correct' ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {team.lastResult === 'correct' ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>+100 PTS</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3 h-3 text-rose-400" />
                    <span>WRONG</span>
                  </>
                )}
              </span>
            ) : isStealOpportunity ? (
              <span className="text-[10px] font-black text-yellow-300 font-game animate-pulse">
                STEAL NOW!
              </span>
            ) : (
              <span className="text-[9px] font-bold text-slate-400 font-game">
                ENTER FIRST
              </span>
            )}
          </div>
        </div>

        {/* Current Typed Value */}
        <div className="flex items-center justify-end min-w-[80px]">
          <span
            className={`text-3xl sm:text-4xl font-black font-digital tracking-widest ${
              isBlue ? 'text-[#00e5ff] drop-shadow-[0_0_8px_#00e5ff]' : 'text-[#ff5588] drop-shadow-[0_0_8px_#ff2a5f]'
            }`}
          >
            {team.currentInput || (team.isLocked ? team.selectedAnswer : '_ _')}
          </span>
        </div>
      </div>

      {/* 3. PHYSICAL KEYPAD BUTTONS */}
      <div className="flex flex-col gap-1.5 w-full">
        {/* Digits 1 to 5 */}
        <div className="grid grid-cols-5 gap-1.5 w-full">
          {digits.slice(0, 5).map((d) => (
            <motion.button
              key={d}
              whileTap={{ scale: isBlocked ? 1 : 0.92 }}
              disabled={isBlocked}
              onPointerDown={(e) => {
                e.stopPropagation();
                if (isBlocked) return;
                soundManager.playClick();
                onDigitPress(team.id, d);
              }}
              className={`relative h-[50px] sm:h-[56px] rounded-xl flex items-center justify-center font-black text-xl sm:text-2xl font-display shadow-md ${
                isBlue ? 'keypad-btn-blue' : 'keypad-btn-red'
              } ${isBlocked ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {d}
            </motion.button>
          ))}
        </div>

        {/* Digits 6 to 0 */}
        <div className="grid grid-cols-5 gap-1.5 w-full">
          {digits.slice(5, 10).map((d) => (
            <motion.button
              key={d}
              whileTap={{ scale: isBlocked ? 1 : 0.92 }}
              disabled={isBlocked}
              onPointerDown={(e) => {
                e.stopPropagation();
                if (isBlocked) return;
                soundManager.playClick();
                onDigitPress(team.id, d);
              }}
              className={`relative h-[50px] sm:h-[56px] rounded-xl flex items-center justify-center font-black text-xl sm:text-2xl font-display shadow-md ${
                isBlue ? 'keypad-btn-blue' : 'keypad-btn-red'
              } ${isBlocked ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {d}
            </motion.button>
          ))}
        </div>

        {/* Bottom Actions: CLEAR + SUBMIT */}
        <div className="grid grid-cols-12 gap-1.5 w-full mt-0.5">
          {/* CLEAR Button */}
          <motion.button
            whileTap={{ scale: isBlocked ? 1 : 0.92 }}
            disabled={isBlocked}
            onPointerDown={(e) => {
              e.stopPropagation();
              if (isBlocked) return;
              soundManager.playClick();
              onClearPress(team.id);
            }}
            className={`col-span-4 h-[44px] sm:h-[50px] rounded-xl bg-slate-200 hover:bg-slate-300 border border-slate-400 text-slate-700 shadow-[0_3px_0_#94a3b8] flex items-center justify-center gap-1 font-black text-xs font-game uppercase ${
              isBlocked ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            <Delete className="w-3.5 h-3.5" />
            <span>CLEAR</span>
          </motion.button>

          {/* SUBMIT Button */}
          <motion.button
            whileTap={{ scale: isBlocked || !team.currentInput ? 1 : 0.94 }}
            disabled={isBlocked || !team.currentInput}
            onPointerDown={(e) => {
              e.stopPropagation();
              if (isBlocked || !team.currentInput) return;
              soundManager.playClick();
              onSubmitPress(team.id);
            }}
            className={`col-span-8 h-[44px] sm:h-[50px] rounded-xl flex items-center justify-center gap-1.5 font-black text-sm sm:text-base font-game uppercase tracking-wide ${
              isBlue ? 'btn-enter-blue' : 'btn-enter-red'
            } ${isBlocked || !team.currentInput ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <Unlock className="w-4 h-4" />
            <span>SUBMIT CODE</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};
