'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Lock, CheckCircle, XCircle } from 'lucide-react';
import { AnswerButton } from './AnswerButton';
import { TeamId, TeamState } from '@/types/game';

interface AnswerGridProps {
  team: TeamState;
  options: (number | string)[];
  correctAnswer: number | string | null;
  isRevealed: boolean;
  disabled: boolean;
  onSelectAnswer: (teamId: TeamId, answer: number | string) => void;
}

export const AnswerGrid: React.FC<AnswerGridProps> = ({
  team,
  options,
  correctAnswer,
  isRevealed,
  disabled,
  onSelectAnswer,
}) => {
  const isBlue = team.id === 'blue';

  return (
    <div
      className={`relative w-full p-3 sm:p-4 rounded-3xl border-2 transition-all flex flex-col justify-between select-none ${
        isBlue ? 'hud-panel-blue' : 'hud-panel-red'
      }`}
      onPointerDown={(e) => {
        e.stopPropagation();
      }}
    >
      {/* Top Header Bar */}
      <div className="flex items-center justify-between mb-2.5 px-1.5">
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              isBlue ? 'bg-cyan-400 shadow-[0_0_10px_#00f0ff]' : 'bg-rose-400 shadow-[0_0_10px_#ff3366]'
            }`}
          />
          <h3
            className={`text-xs sm:text-sm font-black tracking-widest uppercase font-game ${
              isBlue ? 'text-cyan-300' : 'text-rose-300'
            }`}
          >
            TAP YOUR ANSWER
          </h3>
        </div>

        {/* Locked In Status Badge */}
        {team.isLocked && !isRevealed && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-black uppercase font-game ${
              isBlue
                ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/50 shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                : 'bg-rose-500/20 text-rose-200 border border-rose-400/50 shadow-[0_0_12px_rgba(255,51,102,0.4)]'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>LOCKED IN</span>
          </motion.div>
        )}

        {/* Revealed Outcome Badge */}
        {isRevealed && (
          <div
            className={`flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-black uppercase font-game shadow ${
              team.lastResult === 'correct'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/60 shadow-[0_0_12px_rgba(52,211,153,0.5)]'
                : 'bg-rose-500/20 text-rose-300 border border-rose-400/60 shadow-[0_0_12px_rgba(244,63,94,0.5)]'
            }`}
          >
            {team.lastResult === 'correct' ? (
              <>
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>CORRECT!</span>
              </>
            ) : (
              <>
                <XCircle className="w-3.5 h-3.5 text-rose-400" />
                <span>MISSED</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* 5-Column x 2-Row Answer Grid */}
      <div className="grid grid-cols-5 gap-2 sm:gap-2.5 w-full">
        {options.map((optVal, idx) => {
          const isSelected = team.selectedAnswer === optVal;
          const isCorrect = isRevealed && optVal === correctAnswer;
          const isWrong = isRevealed && isSelected && optVal !== correctAnswer;

          return (
            <AnswerButton
              key={`${optVal}-${idx}`}
              team={team.id}
              value={optVal}
              isSelected={isSelected}
              isCorrectRevealed={isCorrect}
              isWrongRevealed={isWrong}
              disabled={disabled || team.isLocked}
              onSelect={(val) => onSelectAnswer(team.id, val)}
            />
          );
        })}
      </div>
    </div>
  );
};
