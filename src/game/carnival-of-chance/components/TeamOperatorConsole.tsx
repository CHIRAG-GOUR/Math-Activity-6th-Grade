// ============================================================
// THE GREAT CARNIVAL OF CHANCE — Dual-Team Operator Consoles
// Physical tactile arcade operator panels for 16:9 Classroom Touchscreen:
// - TEAM BLUE: Left Side Console (w-[320px])
// - TEAM RED: Right Side Console (w-[320px])
// - Large tactile buttons (70-90px), vertical math fractions,
// - Green Success / Coral Wrong states, and simultaneous pointerdown events
// ============================================================

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useCarnivalStore } from '../store/carnivalStore';
import { AnswerChoice, MathFraction, TeamId } from '../types';
import { Check, X, Star, Flame, Trophy, Play, CheckCircle2 } from 'lucide-react';

// ── Mathematical Vertical Fraction Display Component ──
export const MathFractionDisplay: React.FC<{
  fraction: MathFraction;
  className?: string;
  large?: boolean;
}> = ({ fraction, className = '', large = false }) => {
  return (
    <div className={`inline-flex items-center gap-2 font-mono ${className}`}>
      <div className="inline-flex flex-col items-center justify-center leading-none">
        <span className={`font-black ${large ? 'text-xl sm:text-2xl' : 'text-base sm:text-lg'}`}>
          {fraction.numerator}
        </span>
        <span className={`w-full h-0.5 bg-current my-0.5 rounded-full`} />
        <span className={`font-black ${large ? 'text-xl sm:text-2xl' : 'text-base sm:text-lg'}`}>
          {fraction.denominator}
        </span>
      </div>
      {fraction.percentage && (
        <span className={`font-black tracking-tight ${large ? 'text-base sm:text-lg' : 'text-xs sm:text-sm'} opacity-90`}>
          = {fraction.percentage}
        </span>
      )}
    </div>
  );
};

interface TeamConsoleProps {
  teamId: TeamId;
  align: 'left' | 'right';
}

export const TeamOperatorConsole: React.FC<TeamConsoleProps> = ({ teamId, align }) => {
  const isBlue = teamId === 'blue';
  const teamState = useCarnivalStore((s) => (isBlue ? s.blueTeam : s.redTeam));
  const activeChallenge = useCarnivalStore((s) => s.activeChallenge);
  const phase = useCarnivalStore((s) => s.phase);
  const selectChoice = useCarnivalStore((s) => s.selectChoice);
  const confirmPrediction = useCarnivalStore((s) => s.confirmPrediction);

  const isPredicting = phase === 'predicting';
  const isLocked = teamState.isConfirmed;

  const headerGradient = isBlue
    ? 'from-blue-700 via-blue-600 to-indigo-800 border-amber-300'
    : 'from-red-700 via-red-600 to-rose-800 border-amber-300';

  const frameBorder = isBlue
    ? 'border-blue-500 shadow-[0_12px_45px_rgba(29,78,216,0.35)]'
    : 'border-red-500 shadow-[0_12px_45px_rgba(220,38,38,0.35)]';

  const handleTouchChoice = (choice: AnswerChoice, e: React.PointerEvent) => {
    e.preventDefault();
    if (!isPredicting || isLocked) return;
    selectChoice(teamId, choice.id);
  };

  const handleConfirm = (e: React.PointerEvent) => {
    e.preventDefault();
    if (!isPredicting || isLocked || !teamState.selectedChoiceId) return;
    confirmPrediction(teamId);
  };

  return (
    <motion.aside
      initial={{ x: align === 'left' ? -180 : 180, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 22, stiffness: 140 }}
      className={`w-[300px] sm:w-[320px] md:w-[340px] pointer-events-auto flex flex-col justify-between p-3.5 sm:p-4 rounded-3xl bg-gradient-to-b from-[#fffbeb] to-[#fef3c7] border-3 ${frameBorder} select-none shrink-0 shadow-2xl z-30 max-h-[86vh] overflow-y-auto`}
    >
      {/* ── 1. Operator Console Top Header Bar ── */}
      <div>
        <div className={`w-full py-2 px-3 rounded-2xl bg-gradient-to-r ${headerGradient} border-2 text-white flex items-center justify-between shadow-md`}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-white/20 border border-amber-300 flex items-center justify-center font-black text-xs text-amber-300">
              {isBlue ? 'B' : 'R'}
            </div>
            <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-amber-300 drop-shadow">
              {isBlue ? 'BLUE OPERATOR' : 'RED OPERATOR'}
            </span>
          </div>

          {/* Gold Tickets / Stars */}
          <div className="flex items-center gap-1 bg-amber-400/20 px-2 py-0.5 rounded-full border border-amber-300/40">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-300" />
            <span className="text-xs font-black text-amber-200 font-mono">
              {teamState.goldTickets}
            </span>
          </div>
        </div>

        {/* Live Points & Streak */}
        <div className="flex items-center justify-between px-2 pt-2 pb-1 border-b border-amber-200/80">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-600">SCORE:</span>
            <span className="text-base sm:text-lg font-black text-slate-900 font-mono">
              {teamState.score.toLocaleString()} <span className="text-[10px] text-amber-700">PTS</span>
            </span>
          </div>
          {teamState.streak > 1 && (
            <div className="flex items-center gap-1 text-[10px] font-black text-amber-700 bg-amber-200/60 px-2 py-0.5 rounded-md border border-amber-300">
              <Flame className="w-3 h-3 fill-amber-500 text-amber-600" />
              <span>{teamState.streak}x STREAK</span>
            </div>
          )}
        </div>
      </div>

      {/* ── 2. Challenge Prompt & Goal ── */}
      {activeChallenge && (
        <div className="my-2 p-3 rounded-2xl bg-white/90 border-2 border-amber-300 shadow-xs text-left">
          <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-amber-800 mb-1">
            <span>{activeChallenge.missionTitle}</span>
            <span className="px-1.5 py-0.5 rounded bg-amber-200 text-amber-950 font-black">
              +{activeChallenge.points} PTS
            </span>
          </div>
          <p className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
            {activeChallenge.prompt}
          </p>
        </div>
      )}

      {/* ── 3. Tactile 70-80px Choice Cards (Cream -> Green / Coral States) ── */}
      <div className="my-1.5 space-y-2">
        {activeChallenge?.choices.map((choice) => {
          const isSelected = teamState.selectedChoiceId === choice.id;
          const isConfirmedCorrect = teamState.isConfirmed && choice.isCorrect;
          const isConfirmedWrong = teamState.isConfirmed && isSelected && !choice.isCorrect;

          let cardClasses = 'bg-white text-slate-800 border-amber-300 hover:border-amber-400 shadow-sm';

          if (isSelected && !teamState.isConfirmed) {
            cardClasses = isBlue
              ? 'bg-blue-50 border-blue-600 text-blue-950 shadow-md ring-2 ring-blue-500 scale-[1.02]'
              : 'bg-red-50 border-red-600 text-red-950 shadow-md ring-2 ring-red-500 scale-[1.02]';
          }

          if (isConfirmedCorrect) {
            // Rich Green Success Panel
            cardClasses = 'bg-emerald-600 border-emerald-700 text-white shadow-lg ring-2 ring-emerald-400 scale-[1.02]';
          } else if (isConfirmedWrong) {
            // Warm Coral / Red Panel
            cardClasses = 'bg-rose-600 border-rose-700 text-white shadow-md ring-2 ring-rose-400';
          }

          return (
            <button
              key={choice.id}
              onPointerDown={(e) => handleTouchChoice(choice, e)}
              disabled={!isPredicting || isLocked}
              className={`w-full min-h-[68px] sm:min-h-[74px] p-2.5 sm:p-3 rounded-2xl border-3 text-left font-black transition-all flex items-center justify-between gap-3 touch-manipulation cursor-pointer ${cardClasses} ${
                !isPredicting && !isLocked ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              <div className="flex-1 min-w-0">
                <MathFractionDisplay fraction={choice.fraction} />
                <div className="text-[10px] sm:text-[11px] font-bold opacity-85 truncate mt-0.5">
                  {choice.label}
                </div>
              </div>

              {/* Status Feedback Icons */}
              {isConfirmedCorrect && (
                <div className="flex items-center gap-1 shrink-0 bg-emerald-700/80 px-2 py-1 rounded-xl">
                  <Check className="w-5 h-5 text-white stroke-[3]" />
                  <span className="text-[10px] font-black uppercase">CORRECT!</span>
                </div>
              )}
              {isConfirmedWrong && (
                <div className="flex items-center gap-1 shrink-0 bg-rose-700/80 px-2 py-1 rounded-xl">
                  <X className="w-5 h-5 text-white stroke-[3]" />
                  <span className="text-[10px] font-black uppercase">TRY AGAIN</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* ── 4. Large Confirmation Action Button ── */}
      <div className="mt-2 pt-1 border-t border-amber-200">
        {!teamState.isConfirmed ? (
          <button
            onPointerDown={handleConfirm}
            disabled={!isPredicting || !teamState.selectedChoiceId}
            className={`w-full py-3 px-4 rounded-2xl font-black text-xs sm:text-sm tracking-wider uppercase border-2 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
              teamState.selectedChoiceId
                ? isBlue
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-700 hover:brightness-110 active:scale-97'
                  : 'bg-gradient-to-r from-red-600 to-rose-600 text-white border-red-700 hover:brightness-110 active:scale-97'
                : 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed'
            }`}
          >
            <span>CONFIRM PREDICTION</span>
          </button>
        ) : (
          <div className="w-full py-2.5 px-3 rounded-2xl bg-amber-100 border-2 border-amber-400 text-amber-950 text-center font-black text-xs flex items-center justify-center gap-1.5 shadow-inner">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>PREDICTION LOCKED & OPERATING</span>
          </div>
        )}
      </div>
    </motion.aside>
  );
};

export const TeamOperatorConsoles: React.FC = () => {
  const activeActivity = useCarnivalStore((s) => s.activeActivity);

  if (activeActivity === 'hub') return null;

  return (
    <div className="fixed inset-x-0 bottom-4 sm:bottom-6 z-30 flex items-end justify-between px-3 sm:px-6 pointer-events-none">
      <TeamOperatorConsole teamId="blue" align="left" />
      <TeamOperatorConsole teamId="red" align="right" />
    </div>
  );
};
