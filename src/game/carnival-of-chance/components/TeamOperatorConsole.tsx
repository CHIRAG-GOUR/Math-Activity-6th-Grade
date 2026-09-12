// ============================================================
// THE GREAT CARNIVAL OF CHANCE — Neo-Brutalist Dual-Team Consoles
// High-Contrast Yellow, Red & Black Arcade Panels:
// - TEAM BLUE: Left Console (w-[290px] sm:w-[310px])
// - TEAM RED: Right Console (w-[290px] sm:w-[310px])
// - Clean contained boxes, zero overflow, solid neo-brutalist shadows
// ============================================================

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useCarnivalStore } from '../store/carnivalStore';
import { AnswerChoice, MathFraction, TeamId } from '../types';
import { Check, X, Star, Flame, CheckCircle2, Zap } from 'lucide-react';
import { PowerUpTray } from '@/components/shared/PowerUpTray';
import { DigitalScratchpad } from '@/components/shared/DigitalScratchpad';

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
  const otherTeamState = useCarnivalStore((s) => (isBlue ? s.redTeam : s.blueTeam));
  const activeChallenge = useCarnivalStore((s) => s.activeChallenge);
  const phase = useCarnivalStore((s) => s.phase);
  const selectChoice = useCarnivalStore((s) => s.selectChoice);
  const confirmPrediction = useCarnivalStore((s) => s.confirmPrediction);

  // Power-Ups & Hints
  const powerUps = useCarnivalStore((s) => (isBlue ? s.bluePowerUps : s.redPowerUps));
  const misconception = useCarnivalStore((s) => (isBlue ? s.blueMisconception : s.redMisconception));
  const eliminatedChoices = useCarnivalStore((s) => (isBlue ? s.blueEliminatedChoices : s.redEliminatedChoices));
  const use5050 = useCarnivalStore((s) => s.usePowerUp5050);
  const useTimeFreeze = useCarnivalStore((s) => s.usePowerUpTimeFreeze);
  const use2x = useCarnivalStore((s) => s.usePowerUp2x);

  const isPredicting = phase === 'predicting';
  const isLocked = teamState.isConfirmed;

  // Comeback Surge: trailing by 2+ tickets or 150+ pts
  const isComebackSurge = !teamState.isLocked && (otherTeamState.goldTickets - teamState.goldTickets >= 2 || otherTeamState.activityScore - teamState.activityScore >= 150);

  const handleTouchChoice = (choice: AnswerChoice, e: React.PointerEvent) => {
    e.preventDefault();
    if (!isPredicting || isLocked || eliminatedChoices.includes(choice.id)) return;
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
      className="w-[280px] sm:w-[300px] md:w-[320px] pointer-events-auto flex flex-col justify-between gap-1.5 p-3 rounded-2xl bg-[#fef08a] border-4 border-black select-none shrink-0 shadow-[6px_6px_0px_#000000] z-30 max-h-[calc(100vh-70px)] overflow-y-auto"
    >
      {/* ── 1. Operator Console Top Header Bar ── */}
      <div>
        <div
          className={`w-full py-2 px-3 rounded-xl border-3 border-black text-white flex items-center justify-between shadow-[3px_3px_0px_#000000] ${
            isBlue ? 'bg-blue-600' : 'bg-red-600'
          }`}
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-yellow-400 border-2 border-black flex items-center justify-center font-black text-xs text-black">
              {isBlue ? 'B' : 'R'}
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-yellow-300">
              {isBlue ? 'BLUE OPERATOR' : 'RED OPERATOR'}
            </span>
          </div>

          {/* Gold Tickets Badge */}
          <div className="flex items-center gap-1 bg-yellow-400 px-2 py-0.5 rounded-lg border-2 border-black text-black">
            <Star className="w-3 h-3 fill-black text-black" />
            <span className="text-xs font-black font-mono">
              {teamState.goldTickets}
            </span>
          </div>
        </div>

        {/* Live Points & Streak */}
        <div className="flex items-center justify-between px-1 pt-2 pb-1 border-b-2 border-black/20">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-black/70">SCORE:</span>
            <span className="text-sm sm:text-base font-black text-black font-mono">
              {teamState.score.toLocaleString()} <span className="text-[10px] text-red-700">PTS</span>
            </span>
          </div>
          {teamState.streak > 1 && (
            <div className="flex items-center gap-1 text-[9px] font-black text-black bg-yellow-300 px-1.5 py-0.5 rounded border border-black shadow-[1px_1px_0px_#000000]">
              <Flame className="w-3 h-3 fill-red-500 text-red-600" />
              <span>{teamState.streak}x STREAK</span>
            </div>
          )}
        </div>

        {/* Comeback Surge Pill */}
        {isComebackSurge && (
          <div className="mt-1.5 px-2 py-0.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-400 border-2 border-black text-black font-black text-[9px] flex items-center justify-center gap-1 animate-pulse shadow-[2px_2px_0px_#000000]">
            <Zap className="w-3 h-3 fill-black" />
            <span>🔥 COMEBACK SURGE (+25% BONUS)</span>
          </div>
        )}
      </div>

      {/* ── 2. Misconception Hint Callout on 1st Mistake ── */}
      {teamState.attemptsLeft === 1 && misconception && !teamState.isConfirmed && (
        <div className="p-2 rounded-xl bg-amber-400/30 border-2 border-black text-amber-950 text-[10px] font-bold leading-tight flex items-center gap-1.5 shadow-[2px_2px_0px_#000000]">
          <span>{misconception}</span>
        </div>
      )}

      {/* ── 3. Challenge Prompt & Goal (Contained Box) ── */}
      {activeChallenge && (
        <div className="my-1 p-2.5 rounded-xl bg-white border-3 border-black shadow-[3px_3px_0px_#000000] text-left">
          <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-red-700 mb-1">
            <span className="truncate">{activeChallenge.missionTitle}</span>
            <span className="px-1.5 py-0.2 rounded bg-yellow-300 text-black border border-black font-black shrink-0">
              +{activeChallenge.points} PTS
            </span>
          </div>
          <p className="text-[11px] sm:text-xs font-bold text-black leading-snug">
            {activeChallenge.prompt}
          </p>
        </div>
      )}

      {/* ── 4. Tactile Neo-Brutalist Choice Cards ── */}
      <div className="my-1 space-y-1.5">
        {activeChallenge?.choices.map((choice) => {
          const isSelected = teamState.selectedChoiceId === choice.id;
          const isConfirmedCorrect = teamState.isConfirmed && choice.isCorrect;
          const isConfirmedWrong = teamState.isConfirmed && isSelected && !choice.isCorrect;
          const isEliminated = eliminatedChoices.includes(choice.id);

          let cardClasses = 'bg-white text-black border-3 border-black shadow-[3px_3px_0px_#000000] hover:bg-yellow-100 hover:translate-x-0.5 hover:translate-y-0.5';

          if (isEliminated) {
            cardClasses = 'bg-slate-200 text-slate-400 border-3 border-slate-300 shadow-none opacity-30 line-through cursor-not-allowed';
          } else if (isSelected && !teamState.isConfirmed) {
            cardClasses = isBlue
              ? 'bg-blue-200 border-3 border-black text-black shadow-[4px_4px_0px_#000000] ring-2 ring-blue-700 scale-[1.01]'
              : 'bg-red-200 border-3 border-black text-black shadow-[4px_4px_0px_#000000] ring-2 ring-red-700 scale-[1.01]';
          }

          if (isConfirmedCorrect) {
            cardClasses = 'bg-emerald-500 text-white border-3 border-black shadow-[4px_4px_0px_#000000] scale-[1.01]';
          } else if (isConfirmedWrong) {
            cardClasses = 'bg-rose-500 text-white border-3 border-black shadow-[3px_3px_0px_#000000]';
          }

          return (
            <button
              key={choice.id}
              onPointerDown={(e) => handleTouchChoice(choice, e)}
              disabled={!isPredicting || isLocked || isEliminated}
              className={`w-full min-h-[52px] sm:min-h-[58px] p-2 sm:p-2.5 rounded-xl border-3 text-left font-black transition-all flex items-center justify-between gap-2.5 touch-manipulation cursor-pointer ${cardClasses} ${
                !isPredicting && !isLocked ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              <div className="flex-1 min-w-0">
                <MathFractionDisplay fraction={choice.fraction} />
                <div className="text-[10px] font-bold truncate mt-0.5 opacity-90">
                  {choice.label}
                </div>
              </div>

              {/* Status Feedback Icons */}
              {isConfirmedCorrect && (
                <div className="flex items-center gap-1 shrink-0 bg-black text-white px-2 py-0.5 rounded-lg border border-white">
                  <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                  <span className="text-[9px] font-black uppercase">CORRECT</span>
                </div>
              )}
              {isConfirmedWrong && (
                <div className="flex items-center gap-1 shrink-0 bg-black text-white px-2 py-0.5 rounded-lg border border-white">
                  <X className="w-4 h-4 text-rose-400 stroke-[3]" />
                  <span className="text-[9px] font-black uppercase">WRONG</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* ── 5. Large Confirmation Action Button ── */}
      <div className="mt-1 pt-1 border-t-2 border-black/20">
        {!teamState.isConfirmed ? (
          <button
            onPointerDown={handleConfirm}
            disabled={!isPredicting || !teamState.selectedChoiceId}
            className={`w-full py-2.5 px-3 rounded-xl font-black text-xs uppercase border-3 border-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              teamState.selectedChoiceId
                ? 'bg-yellow-400 hover:bg-yellow-300 text-black shadow-[4px_4px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000000]'
                : 'bg-slate-300 text-slate-500 shadow-none cursor-not-allowed'
            }`}
          >
            <span>CONFIRM PREDICTION</span>
          </button>
        ) : (
          <div className="w-full py-2 px-2.5 rounded-xl bg-white border-3 border-black text-black text-center font-black text-[11px] flex items-center justify-center gap-1.5 shadow-[3px_3px_0px_#000000]">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
            <span>LOCKED IN</span>
          </div>
        )}
      </div>

      {/* ── 6. Power-Up Tray & Digital Scratchpad Dock ── */}
      <div className="w-full flex items-center justify-between gap-1 pt-1 border-t-2 border-black/20">
        <PowerUpTray
          teamId={teamId}
          powerUps={powerUps}
          onUse5050={() => use5050(teamId)}
          onUseTimeFreeze={() => useTimeFreeze(teamId)}
          onUse2x={() => use2x(teamId)}
          disabled={!isPredicting || isLocked}
        />
        <DigitalScratchpad teamId={teamId} teamName={teamState.name} position={align} />
      </div>
    </motion.aside>
  );
};

export const TeamOperatorConsoles: React.FC = () => {
  const activeActivity = useCarnivalStore((s) => s.activeActivity);

  if (activeActivity === 'hub') return null;

  return (
    <div className="fixed inset-x-0 bottom-3 sm:bottom-4 z-30 flex items-end justify-between px-3 sm:px-6 pointer-events-none">
      <TeamOperatorConsole teamId="blue" align="left" />
      <TeamOperatorConsole teamId="red" align="right" />
    </div>
  );
};
