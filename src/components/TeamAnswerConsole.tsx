'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Delete, CheckCircle2, Lock, AlertCircle, Zap, Shield, Flame } from 'lucide-react';
import { TeamId, TeamState } from '@/types/game';
import { soundManager } from '@/utils/audio';

interface TeamAnswerConsoleProps {
  team: TeamState;
  correctAnswer: number | string | null;
  isRevealed: boolean;
  disabled: boolean;
  onDigitPress: (teamId: TeamId, digit: string) => void;
  onClearPress: (teamId: TeamId) => void;
  onSubmitPress: (teamId: TeamId) => void;
  onSelectMultiplier: (teamId: TeamId, mult: 1 | 2 | 3) => void;
}

export const TeamAnswerConsole: React.FC<TeamAnswerConsoleProps> = ({
  team,
  correctAnswer,
  isRevealed,
  disabled,
  onDigitPress,
  onClearPress,
  onSubmitPress,
  onSelectMultiplier,
}) => {
  const isBlue = team.id === 'blue';

  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

  const boosts = [
    { multiplier: 1 as const, label: '1x SAFE', icon: Shield, color: 'bg-emerald-500 text-white' },
    { multiplier: 2 as const, label: '2x RISKY', icon: Zap, color: 'bg-amber-500 text-slate-950' },
    { multiplier: 3 as const, label: '3x DANGER', icon: Flame, color: 'bg-rose-600 text-white animate-pulse' },
  ];

  return (
    <div
      className={`relative w-full p-4 sm:p-5 rounded-3xl select-none transition-all flex flex-col justify-between ${
        isBlue ? 'bank-console-blue' : 'bank-console-red'
      }`}
      onPointerDown={(e) => e.stopPropagation()}
    >
      {/* 1. TOP CONSOLE HEADER */}
      <div className="flex items-center justify-between border-b-2 border-slate-300 pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <div
            className={`w-3.5 h-3.5 rounded-full ${
              isBlue ? 'bg-[#0088ff] shadow-[0_0_10px_#0088ff]' : 'bg-[#ff2a5f] shadow-[0_0_10px_#ff2a5f]'
            }`}
          />
          <h3
            className={`text-sm sm:text-base font-black tracking-wider uppercase font-game ${
              isBlue ? 'text-[#0055aa]' : 'text-[#aa1133]'
            }`}
          >
            {isBlue ? 'TEAM BLUE SECURITY TERMINAL' : 'TEAM RED SECURITY TERMINAL'}
          </h3>
        </div>

        {/* Multiplier Boost Selection Chips */}
        <div className="flex items-center gap-1.5">
          {boosts.map((b) => (
            <button
              key={b.multiplier}
              disabled={team.isLocked || disabled}
              onClick={() => {
                soundManager.playMultiplier(b.multiplier);
                onSelectMultiplier(team.id, b.multiplier);
              }}
              className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase font-game transition-all ${
                team.multiplier === b.multiplier
                  ? `${b.color} ring-2 ring-slate-900 shadow-sm font-extrabold`
                  : 'bg-slate-200/80 text-slate-600 hover:bg-slate-300'
              } ${team.isLocked || disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. LARGE DIGITAL LCD ANSWER DISPLAY SCREEN */}
      <div
        className={`relative w-full h-18 sm:h-22 rounded-2xl flex items-center justify-between px-5 mb-3.5 ${
          isBlue ? 'bank-lcd-blue' : 'bank-lcd-red'
        }`}
      >
        <div className="flex flex-col">
          <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400 font-game">
            ACCESS CODE INPUT
          </span>
          <div className="flex items-center gap-2">
            {team.isLocked && !isRevealed ? (
              <span className="text-xs sm:text-sm font-black text-amber-300 font-game uppercase flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>CODE TRANSMITTED & LOCKED</span>
              </span>
            ) : isRevealed ? (
              <span
                className={`text-xs sm:text-sm font-black uppercase font-game flex items-center gap-1 ${
                  team.lastResult === 'correct' ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {team.lastResult === 'correct' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>ACCESS GRANTED • +{team.lastScoreGained} PTS</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-rose-400" />
                    <span>ACCESS DENIED • TRY AGAIN</span>
                  </>
                )}
              </span>
            ) : (
              <span className="text-[11px] font-bold text-slate-400 font-game">
                ENTER NUMBER & PRESS SUBMIT
              </span>
            )}
          </div>
        </div>

        {/* Current Typed Value */}
        <div className="flex items-center justify-end min-w-[120px]">
          <span
            className={`text-4xl sm:text-5xl md:text-6xl font-black font-digital tracking-widest ${
              isBlue ? 'text-[#00e5ff] drop-shadow-[0_0_12px_#00e5ff]' : 'text-[#ff5588] drop-shadow-[0_0_12px_#ff2a5f]'
            }`}
          >
            {team.currentInput || (team.isLocked ? team.selectedAnswer : '_ _')}
          </span>
        </div>
      </div>

      {/* 3. PHYSICAL 80-100px KEYPAD BUTTONS */}
      <div className="flex flex-col gap-2.5 w-full">
        {/* Digits 1 to 5 */}
        <div className="grid grid-cols-5 gap-2 sm:gap-2.5 w-full">
          {digits.slice(0, 5).map((d) => (
            <motion.button
              key={d}
              whileTap={{ scale: disabled || team.isLocked ? 1 : 0.93 }}
              disabled={disabled || team.isLocked}
              onPointerDown={(e) => {
                e.stopPropagation();
                if (disabled || team.isLocked) return;
                soundManager.playClick();
                onDigitPress(team.id, d);
              }}
              className={`relative h-[68px] sm:h-[76px] md:h-[82px] rounded-2xl flex items-center justify-center font-black text-2xl sm:text-3xl md:text-4xl font-display ${
                isBlue ? 'keypad-btn-blue' : 'keypad-btn-red'
              } ${disabled || team.isLocked ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {d}
            </motion.button>
          ))}
        </div>

        {/* Digits 6 to 0 */}
        <div className="grid grid-cols-5 gap-2 sm:gap-2.5 w-full">
          {digits.slice(5, 10).map((d) => (
            <motion.button
              key={d}
              whileTap={{ scale: disabled || team.isLocked ? 1 : 0.93 }}
              disabled={disabled || team.isLocked}
              onPointerDown={(e) => {
                e.stopPropagation();
                if (disabled || team.isLocked) return;
                soundManager.playClick();
                onDigitPress(team.id, d);
              }}
              className={`relative h-[68px] sm:h-[76px] md:h-[82px] rounded-2xl flex items-center justify-center font-black text-2xl sm:text-3xl md:text-4xl font-display ${
                isBlue ? 'keypad-btn-blue' : 'keypad-btn-red'
              } ${disabled || team.isLocked ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {d}
            </motion.button>
          ))}
        </div>

        {/* Bottom Actions: Wide CLEAR + Big Glowing SUBMIT / ENTER */}
        <div className="grid grid-cols-12 gap-2.5 w-full mt-1">
          {/* CLEAR Button */}
          <motion.button
            whileTap={{ scale: disabled || team.isLocked ? 1 : 0.93 }}
            disabled={disabled || team.isLocked}
            onPointerDown={(e) => {
              e.stopPropagation();
              if (disabled || team.isLocked) return;
              soundManager.playClick();
              onClearPress(team.id);
            }}
            className={`col-span-4 h-[60px] sm:h-[68px] rounded-2xl bg-slate-200 hover:bg-slate-300 border-2 border-slate-400 text-slate-700 shadow-[0_5px_0_#94a3b8] flex items-center justify-center gap-1.5 font-black text-sm sm:text-base font-game uppercase ${
              disabled || team.isLocked ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            <Delete className="w-4 h-4" />
            <span>CLEAR</span>
          </motion.button>

          {/* ENTER / SUBMIT Button */}
          <motion.button
            whileTap={{ scale: disabled || team.isLocked ? 1 : 0.94 }}
            disabled={disabled || team.isLocked || !team.currentInput}
            onPointerDown={(e) => {
              e.stopPropagation();
              if (disabled || team.isLocked || !team.currentInput) return;
              soundManager.playClick();
              onSubmitPress(team.id);
            }}
            className={`col-span-8 h-[60px] sm:h-[68px] rounded-2xl flex items-center justify-center gap-2 font-black text-lg sm:text-xl font-game uppercase tracking-wider ${
              isBlue ? 'btn-enter-blue' : 'btn-enter-red'
            } ${disabled || team.isLocked || !team.currentInput ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <Lock className="w-5 h-5" />
            <span>SUBMIT CODE</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};
