// ============================================================
// THE GREAT NUMBER RAILWAY — Team Control Console
// Clean, Bright, White-Themed Aesthetic with High Contrast:
// - Blue Team = Left side (Porcelain White + Royal Blue Accents)
// - Red Team = Right side (Porcelain White + Crimson Red Accents)
// - Compact sizing for 16:9 touchscreen TVs
// - Ultra-sharp typography & large tactile answer buttons
// ============================================================

'use client';

import React, { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRailwayStore } from '../store/railwayStore';
import { TeamId } from '../types';

interface TeamConsoleProps {
  team: TeamId;
}

export const TeamConsole: React.FC<TeamConsoleProps> = ({ team }) => {
  const teamState = useRailwayStore((s) => (team === 'blue' ? s.blueTeam : s.redTeam));
  const challenge = useRailwayStore((s) => s.activeChallenge);
  const phase = useRailwayStore((s) => s.phase);
  const setAnswer = useRailwayStore((s) => s.setTeamAnswer);
  const lockIn = useRailwayStore((s) => s.lockInTeam);
  const evaluate = useRailwayStore((s) => s.evaluateTeam);

  const isBlue = team === 'blue';
  const teamTitle = isBlue ? 'TEAM BLUE' : 'TEAM RED';

  // Crisp, Bright, High-Contrast White Theme Tokens
  const theme = isBlue
    ? {
        headerBg: 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700',
        borderColor: 'border-blue-300',
        badgeBg: 'bg-blue-50 text-blue-800 border-blue-200',
        cardBg: 'bg-blue-50/60 border-blue-100',
        numberBoxBg: 'bg-white border-2 border-blue-500 shadow-sm',
        numberText: 'text-blue-700',
        optionDefault: 'bg-white border-2 border-slate-300 text-slate-900 hover:border-blue-500 hover:bg-blue-50 shadow-sm',
        optionSelected: 'bg-blue-600 border-2 border-blue-700 text-white shadow-md shadow-blue-500/30',
        confirmBtn: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-600/30',
      }
    : {
        headerBg: 'bg-gradient-to-r from-red-600 via-red-700 to-rose-700',
        borderColor: 'border-red-300',
        badgeBg: 'bg-red-50 text-red-800 border-red-200',
        cardBg: 'bg-red-50/60 border-red-100',
        numberBoxBg: 'bg-white border-2 border-red-500 shadow-sm',
        numberText: 'text-red-700',
        optionDefault: 'bg-white border-2 border-slate-300 text-slate-900 hover:border-red-500 hover:bg-red-50 shadow-sm',
        optionSelected: 'bg-red-600 border-2 border-red-700 text-white shadow-md shadow-red-500/30',
        confirmBtn: 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-md shadow-red-600/30',
      };

  const handleSelectOption = useCallback(
    (val: number | string) => {
      if (teamState.isLockedIn || phase !== 'challenge') return;
      setAnswer(team, val);
    },
    [team, teamState.isLockedIn, phase, setAnswer]
  );

  const handleConfirmAnswer = useCallback(() => {
    if (teamState.isLockedIn || teamState.currentAnswer === null || phase !== 'challenge') return;
    lockIn(team);
    setTimeout(() => {
      evaluate(team);
    }, 400);
  }, [team, teamState.isLockedIn, teamState.currentAnswer, phase, lockIn, evaluate]);

  const showQuestion = phase === 'challenge' && challenge;

  return (
    <div
      className={`w-full h-full flex flex-col bg-white border-x-2 ${theme.borderColor} shadow-xl select-none overflow-hidden font-sans`}
      onPointerDown={(e) => e.stopPropagation()} // Multi-touch isolation
    >
      {/* ── 1. Team Header Bar ── */}
      <div className={`px-3 py-2.5 ${theme.headerBg} flex items-center justify-between text-white shadow-sm`}>
        <div className="flex items-center gap-2">
          <span className="text-lg">🚂</span>
          <div>
            <h2 className="text-[11px] font-black tracking-wider uppercase text-white leading-tight">
              {teamTitle}
            </h2>
            <p className="text-[9px] font-semibold text-white/85 tracking-wide">
              OPERATOR CONSOLE
            </p>
          </div>
        </div>

        {/* Score Badge */}
        <div className="px-2.5 py-0.5 bg-black/25 rounded-lg border border-white/30 text-center">
          <div className="text-xs font-black text-amber-300 leading-tight">
            {teamState.score}
          </div>
          <div className="text-[7px] font-bold text-slate-200 uppercase">SCORE</div>
        </div>
      </div>

      {/* ── 2. Current 5-Step Stage Indicator ── */}
      {challenge && (
        <div className={`px-3 py-1.5 ${theme.badgeBg} border-b flex items-center justify-between`}>
          <div className="flex items-center gap-1.5">
            <span className="text-sm">{challenge.stepIcon}</span>
            <span className="text-[10px] font-black uppercase tracking-tight">
              {challenge.stepTitle}
            </span>
          </div>
          <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-white border border-slate-300 text-slate-800 shadow-xs">
            +{challenge.points}P
          </span>
        </div>
      )}

      {/* ── 3. Interactive Challenge Area ── */}
      <div className="flex-1 p-3 flex flex-col justify-between overflow-y-auto bg-slate-50/70">
        {showQuestion ? (
          <div className="flex flex-col gap-2.5">
            
            {/* Objective Narrative (Compact) */}
            <div className={`p-2.5 rounded-xl border ${theme.cardBg}`}>
              <div className="text-[8px] font-black uppercase tracking-wider text-slate-500 mb-0.5">
                MISSION OBJECTIVE
              </div>
              <p className="text-[11px] text-slate-700 leading-snug font-medium">
                {challenge.context.narrative}
              </p>
            </div>

            {/* Question Card (White with Crisp Typography) */}
            <div className="p-3 bg-white rounded-2xl border-2 border-slate-200 shadow-sm">
              <div className="text-[9px] font-black uppercase tracking-wider text-amber-600 mb-0.5">
                SOLVE MATH QUESTION
              </div>
              <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug">
                {challenge.prompt}
              </h3>

              {/* Large High-Contrast Number Box */}
              {challenge.numberString && (
                <div className={`mt-2 p-2 rounded-xl text-center ${theme.numberBoxBg}`}>
                  <div className={`font-mono text-xl sm:text-2xl font-black tracking-wider ${theme.numberText}`}>
                    {challenge.numberString}
                  </div>
                </div>
              )}
            </div>

            {/* Tactile Answer Options */}
            <div className="flex flex-col gap-2 mt-0.5">
              {challenge.options.map((opt, i) => {
                const isSelected = teamState.currentAnswer === opt.value;
                const isLocked = teamState.isLockedIn;

                return (
                  <motion.button
                    key={i}
                    whileTap={!isLocked ? { scale: 0.97 } : {}}
                    onClick={() => handleSelectOption(opt.value)}
                    disabled={isLocked}
                    className={`w-full py-2.5 px-3 rounded-xl font-mono text-sm sm:text-base font-black text-center transition-all duration-150 ${
                      isSelected
                        ? theme.optionSelected
                        : theme.optionDefault
                    } ${isLocked && !isSelected ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    {opt.label}
                  </motion.button>
                );
              })}
            </div>

            {/* Lock In / Confirm Route Button */}
            {!teamState.isLockedIn ? (
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handleConfirmAnswer}
                disabled={teamState.currentAnswer === null}
                className={`w-full py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-200 mt-1 cursor-pointer ${
                  teamState.currentAnswer !== null
                    ? theme.confirmBtn
                    : 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed'
                }`}
              >
                ⚡ CONFIRM ROUTE
              </motion.button>
            ) : (
              <div className="w-full py-2 rounded-xl bg-amber-50 border border-amber-400 text-center font-black text-[11px] text-amber-800 animate-pulse shadow-xs">
                ⏳ ROUTE CONFIRMED...
              </div>
            )}

            {/* Live Feedback Toast */}
            <AnimatePresence>
              {teamState.lastFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`p-2 rounded-xl border text-[10px] font-bold leading-tight shadow-xs ${
                    teamState.lastFeedback.isCorrect
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : 'bg-red-50 border-red-300 text-red-900'
                  }`}
                >
                  {teamState.lastFeedback.message}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          /* Waiting / Journey State */
          <div className="flex-1 flex flex-col items-center justify-center text-center p-4 gap-2">
            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-2xl animate-bounce">
              {phase === 'train-journey' ? '🚂' : phase === 'station-arrived' ? '🏁' : '⚙️'}
            </div>
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-tight">
              {phase === 'train-journey'
                ? 'TRAIN EN ROUTE!'
                : phase === 'station-arrived'
                  ? 'ARRIVED AT STATION!'
                  : 'STANDBY'}
            </h4>
            <p className="text-[10px] text-slate-500 max-w-[170px] leading-snug">
              {phase === 'train-journey'
                ? 'Watching train travel along the scenic railway...'
                : 'Preparing next station departure manifest.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
