// ============================================================
// THE GREAT NUMBER RAILWAY — Symmetrical Team Control Console
// Perfectly Identical Sizing & High-Contrast Visuals for Both Teams:
// - Blue Team = Left (Porcelain White + Royal Blue Accents)
// - Red Team = Right (Porcelain White + Crimson Red Accents)
// - 100% Readable Text on All States (Default, Selected, Confirm)
// - String & Number Safe Selection Comparison
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
  const isSuperTieBreaker = useRailwayStore((s) => s.isSuperTieBreaker);

  const isBlue = team === 'blue';
  const teamTitle = isBlue ? 'TEAM BLUE' : 'TEAM RED';

  // High-Contrast Theme Tokens
  const theme = isBlue
    ? {
        headerBg: 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white',
        border: 'border-blue-400',
        badgeBg: 'bg-blue-50 text-blue-900 border-blue-200',
        numberBoxBg: 'bg-blue-50/90 border-2 border-blue-400',
        numberText: 'text-blue-900',
        optionDefault: 'bg-white border-2 border-slate-300 text-slate-900 hover:border-blue-500 hover:bg-blue-50 shadow-xs',
        optionSelected: 'bg-blue-600 border-2 border-blue-800 text-white font-black shadow-md shadow-blue-500/40',
        confirmActive: 'bg-blue-600 hover:bg-blue-700 border-2 border-blue-800 text-white font-black shadow-md shadow-blue-600/30 cursor-pointer',
        confirmDisabled: 'bg-slate-100 border-2 border-slate-200 text-slate-400 font-bold cursor-not-allowed',
      }
    : {
        headerBg: 'bg-gradient-to-r from-red-600 via-red-700 to-rose-700 text-white',
        border: 'border-red-400',
        badgeBg: 'bg-red-50 text-red-900 border-red-200',
        numberBoxBg: 'bg-red-50/90 border-2 border-red-400',
        numberText: 'text-red-900',
        optionDefault: 'bg-white border-2 border-slate-300 text-slate-900 hover:border-red-500 hover:bg-red-50 shadow-xs',
        optionSelected: 'bg-red-600 border-2 border-red-800 text-white font-black shadow-md shadow-red-500/40',
        confirmActive: 'bg-red-600 hover:bg-red-700 border-2 border-red-800 text-white font-black shadow-md shadow-red-600/30 cursor-pointer',
        confirmDisabled: 'bg-slate-100 border-2 border-slate-200 text-slate-400 font-bold cursor-not-allowed',
      };

  const isPlayable = phase === 'challenge' || phase === 'super-tie-breaker';

  const handleSelectOption = useCallback(
    (val: number | string) => {
      if (teamState.isLocked || !isPlayable) return;
      setAnswer(team, val);
    },
    [team, teamState.isLocked, isPlayable, setAnswer]
  );

  const handleConfirmAnswer = useCallback(() => {
    if (teamState.isLocked || teamState.selectedAnswer === null || !isPlayable) return;
    lockIn(team);
  }, [team, teamState.isLocked, teamState.selectedAnswer, isPlayable, lockIn]);

  return (
    <div
      className={`w-[270px] min-w-[270px] max-w-[270px] bg-white border-2 ${theme.border} rounded-2xl shadow-2xl shadow-slate-900/20 select-none overflow-hidden font-sans flex flex-col`}
      onPointerDown={(e) => e.stopPropagation()} // Multi-touch isolation
    >
      {/* ── 1. Team Header Bar ── */}
      <div className={`px-3 py-2 ${theme.headerBg} flex items-center justify-between shadow-xs`}>
        <div className="flex items-center gap-1.5">
          <span className="text-base">{isBlue ? '🔵' : '🔴'}</span>
          <div>
            <h2 className="text-[11px] font-black tracking-wider uppercase leading-tight text-white">
              {teamTitle}
            </h2>
            <div className="text-[8px] font-bold text-white/90 tracking-wide">
              OPERATOR CONSOLE
            </div>
          </div>
        </div>

        {/* Score & Streak */}
        <div className="flex items-center gap-1.5">
          {teamState.streak > 1 && (
            <span className="px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-[9px] animate-bounce">
              🔥×{teamState.streak}
            </span>
          )}
          <div className="px-2 py-0.5 bg-black/30 rounded-md border border-white/30 text-center">
            <span className="text-xs font-black text-amber-300 leading-tight">
              {teamState.score} <span className="text-[7px] text-slate-200 uppercase font-bold">PTS</span>
            </span>
          </div>
        </div>
      </div>

      {/* ── 2. Current Step Badge ── */}
      {challenge && (
        <div className={`px-2.5 py-1 ${isSuperTieBreaker ? 'bg-amber-100 text-amber-900 border-amber-300' : theme.badgeBg} border-b flex items-center justify-between`}>
          <div className="flex items-center gap-1 font-black text-[9px] uppercase tracking-tight">
            <span>{challenge.stepIcon}</span>
            <span>{challenge.stepTitle}</span>
          </div>
          <span className="text-[8px] font-black px-1.5 py-0.2 rounded bg-white border border-slate-300 text-slate-800">
            +{challenge.points}P
          </span>
        </div>
      )}

      {/* ── 3. Interactive Challenge Content ── */}
      <div className="p-2.5 flex flex-col gap-2 bg-slate-50 overflow-y-auto max-h-[380px]">
        {isPlayable && challenge ? (
          <>
            {/* Question Card */}
            <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[8px] font-black uppercase tracking-wider text-amber-700 block mb-0.5">
                QUESTION
              </span>
              <h3 className="text-xs font-black text-slate-900 leading-snug">
                {challenge.prompt}
              </h3>

              {/* High-Contrast Large Number Display */}
              {challenge.numberString && (
                <div className={`mt-1.5 p-1.5 rounded-lg text-center ${theme.numberBoxBg}`}>
                  <div className={`font-mono text-xl font-black tracking-wide ${theme.numberText}`}>
                    {challenge.numberString}
                  </div>
                </div>
              )}
            </div>

            {/* Answer Options Grid (Safe comparison for number & string) */}
            <div className="flex flex-col gap-1.5">
              {challenge.options.map((opt, i) => {
                const isSelected =
                  teamState.selectedAnswer !== null &&
                  String(teamState.selectedAnswer) === String(opt.value);
                const isLocked = teamState.isLocked;

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
            {!teamState.isLocked ? (
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handleConfirmAnswer}
                disabled={teamState.selectedAnswer === null}
                className={`w-full py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all duration-150 ${
                  teamState.selectedAnswer !== null
                    ? theme.confirmActive
                    : theme.confirmDisabled
                }`}
              >
                ⚡ CONFIRM ROUTE
              </motion.button>
            ) : (
              <div className="w-full py-2 rounded-xl bg-amber-50 border-2 border-amber-400 text-center font-black text-[10px] text-amber-900 animate-pulse shadow-xs">
                ⏳ ROUTE CONFIRMED...
              </div>
            )}

            {/* Live Feedback Toast */}
            <AnimatePresence>
              {teamState.lastFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`p-1.5 rounded-lg border text-[9px] font-black leading-tight text-center shadow-xs ${
                    teamState.lastFeedback.isCorrect
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                      : 'bg-red-50 border-red-400 text-red-950'
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
