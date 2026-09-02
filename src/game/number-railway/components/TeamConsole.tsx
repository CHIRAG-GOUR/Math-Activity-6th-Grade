// ============================================================
// THE GREAT NUMBER RAILWAY — Compact Floating Team Console
// Designed for Touchscreen Ergonomics:
// - Width: 265px (Compact, leaves ~70% screen for 3D world!)
// - Theme: Fresh, crisp porcelain white with vibrant team accents
// - High-contrast readable typography
// - Multi-touch isolated interaction
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

  // Crisp, Fresh White + Vibrant Team Color Tokens
  const theme = isBlue
    ? {
        headerBg: 'bg-gradient-to-r from-blue-600 to-indigo-600',
        border: 'border-blue-200',
        badgeBg: 'bg-blue-50 text-blue-800 border-blue-200',
        cardBg: 'bg-blue-50/40 border-blue-100',
        numberBoxBg: 'bg-blue-50/80 border border-blue-300',
        numberText: 'text-blue-800',
        optionDefault: 'bg-white border-2 border-slate-200 text-slate-800 hover:border-blue-400 hover:bg-blue-50/50 shadow-xs',
        optionSelected: 'bg-blue-600 border-2 border-blue-700 text-white shadow-md shadow-blue-500/30',
        confirmBtn: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-600/30',
      }
    : {
        headerBg: 'bg-gradient-to-r from-red-600 to-rose-600',
        border: 'border-red-200',
        badgeBg: 'bg-red-50 text-red-800 border-red-200',
        cardBg: 'bg-red-50/40 border-red-100',
        numberBoxBg: 'bg-red-50/80 border border-red-300',
        numberText: 'text-red-800',
        optionDefault: 'bg-white border-2 border-slate-200 text-slate-800 hover:border-red-400 hover:bg-red-50/50 shadow-xs',
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
      className={`w-full max-w-[275px] bg-white/95 backdrop-blur-md border-2 ${theme.border} rounded-2xl shadow-2xl shadow-slate-900/15 select-none overflow-hidden font-sans flex flex-col`}
      onPointerDown={(e) => e.stopPropagation()} // Multi-touch isolation
    >
      {/* ── 1. Team Header Bar ── */}
      <div className={`px-3 py-2 ${theme.headerBg} flex items-center justify-between text-white shadow-xs`}>
        <div className="flex items-center gap-1.5">
          <span className="text-base">🚂</span>
          <h2 className="text-[11px] font-black tracking-wider uppercase text-white leading-tight">
            {teamTitle}
          </h2>
        </div>

        {/* Score Badge */}
        <div className="px-2 py-0.5 bg-black/20 rounded-md border border-white/20 text-center">
          <span className="text-xs font-black text-amber-300 leading-tight">
            {teamState.score} <span className="text-[7px] text-slate-200 uppercase font-bold">PTS</span>
          </span>
        </div>
      </div>

      {/* ── 2. Current Step Badge ── */}
      {challenge && (
        <div className={`px-2.5 py-1 ${theme.badgeBg} border-b flex items-center justify-between`}>
          <div className="flex items-center gap-1 font-black text-[9px] uppercase tracking-tight">
            <span>{challenge.stepIcon}</span>
            <span>{challenge.stepTitle}</span>
          </div>
          <span className="text-[8px] font-extrabold px-1.5 py-0.2 rounded bg-white border border-slate-300 text-slate-700">
            +{challenge.points}P
          </span>
        </div>
      )}

      {/* ── 3. Interactive Challenge Content ── */}
      <div className="p-3 flex flex-col gap-2 bg-slate-50/80 overflow-y-auto">
        {showQuestion ? (
          <>
            {/* Question Card */}
            <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[8px] font-black uppercase tracking-wider text-amber-600 block mb-0.5">
                QUESTION
              </span>
              <h3 className="text-xs font-black text-slate-900 leading-snug">
                {challenge.prompt}
              </h3>

              {/* Large High-Contrast Number Box */}
              {challenge.numberString && (
                <div className={`mt-1.5 p-1.5 rounded-lg text-center ${theme.numberBoxBg}`}>
                  <div className={`font-mono text-xl font-black tracking-wide ${theme.numberText}`}>
                    {challenge.numberString}
                  </div>
                </div>
              )}
            </div>

            {/* Answer Options Grid */}
            <div className="flex flex-col gap-1.5">
              {challenge.options.map((opt, i) => {
                const isSelected = teamState.currentAnswer === opt.value;
                const isLocked = teamState.isLockedIn;

                return (
                  <motion.button
                    key={i}
                    whileTap={!isLocked ? { scale: 0.97 } : {}}
                    onClick={() => handleSelectOption(opt.value)}
                    disabled={isLocked}
                    className={`w-full py-2 px-2.5 rounded-xl font-mono text-sm font-black text-center transition-all duration-150 ${
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
                className={`w-full py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  teamState.currentAnswer !== null
                    ? theme.confirmBtn
                    : 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed'
                }`}
              >
                ⚡ CONFIRM
              </motion.button>
            ) : (
              <div className="w-full py-1.5 rounded-xl bg-amber-50 border border-amber-300 text-center font-black text-[10px] text-amber-800 animate-pulse shadow-xs">
                ⏳ CONFIRMED...
              </div>
            )}

            {/* Live Feedback Toast */}
            <AnimatePresence>
              {teamState.lastFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`p-1.5 rounded-lg border text-[9px] font-bold leading-tight shadow-xs ${
                    teamState.lastFeedback.isCorrect
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : 'bg-red-50 border-red-300 text-red-900'
                  }`}
                >
                  {teamState.lastFeedback.message}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          /* Waiting / Journey State */
          <div className="py-6 flex flex-col items-center justify-center text-center gap-1.5">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-xl animate-bounce">
              {phase === 'train-journey' ? '🚂' : phase === 'station-arrived' ? '🏁' : '⚙️'}
            </div>
            <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-tight">
              {phase === 'train-journey'
                ? 'TRAIN EN ROUTE!'
                : phase === 'station-arrived'
                  ? 'ARRIVED AT STATION!'
                  : 'STANDBY'}
            </h4>
          </div>
        )}
      </div>
    </div>
  );
};
