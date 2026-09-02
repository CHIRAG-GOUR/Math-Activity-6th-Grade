// ============================================================
// THE GREAT NUMBER RAILWAY — Symmetrical Team Control Console
// 100% Guaranteed High-Contrast Inline Styles:
// - Blue Team = Left (Royal Blue Selection)
// - Red Team = Right (Solid Crimson Red Selection & Confirm)
// - Eliminates any white-on-white text issues
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
  const teamPrimaryColor = isBlue ? '#2563eb' : '#dc2626';
  const teamDarkBorder = isBlue ? '#1e40af' : '#991b1b';

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
      className={`w-[270px] min-w-[270px] max-w-[270px] bg-white border-2 rounded-2xl shadow-2xl select-none overflow-hidden font-sans flex flex-col`}
      style={{ borderColor: isBlue ? '#60a5fa' : '#f87171' }}
      onPointerDown={(e) => e.stopPropagation()} // Multi-touch isolation
    >
      {/* ── 1. Team Header Bar ── */}
      <div
        className="px-3 py-2 flex items-center justify-between text-white shadow-xs"
        style={{
          background: isBlue
            ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'
            : 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
        }}
      >
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
        <div
          className="px-2.5 py-1 border-b flex items-center justify-between text-xs font-black"
          style={{
            backgroundColor: isSuperTieBreaker ? '#fef3c7' : isBlue ? '#eff6ff' : '#fef2f2',
            color: isSuperTieBreaker ? '#78350f' : isBlue ? '#1e40af' : '#991b1b',
            borderColor: isBlue ? '#bfdbfe' : '#fecaca',
          }}
        >
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

              {/* High-Contrast Large Number Box */}
              {challenge.numberString && (
                <div
                  className="mt-1.5 p-1.5 rounded-lg text-center border-2"
                  style={{
                    backgroundColor: isBlue ? '#eff6ff' : '#fef2f2',
                    borderColor: isBlue ? '#60a5fa' : '#f87171',
                  }}
                >
                  <div
                    className="font-mono text-xl font-black tracking-wide"
                    style={{ color: isBlue ? '#1e3a8a' : '#991b1b' }}
                  >
                    {challenge.numberString}
                  </div>
                </div>
              )}
            </div>

            {/* Answer Options Grid with Guaranteed Inline Contrast */}
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
                    className="w-full py-2 px-2.5 rounded-xl font-mono text-sm font-black text-center transition-all duration-150 border-2 shadow-xs cursor-pointer"
                    style={{
                      backgroundColor: isSelected ? teamPrimaryColor : '#ffffff',
                      color: isSelected ? '#ffffff' : '#0f172a',
                      borderColor: isSelected ? teamDarkBorder : '#cbd5e1',
                      opacity: isLocked && !isSelected ? 0.4 : 1,
                      boxShadow: isSelected
                        ? `0 4px 12px ${isBlue ? 'rgba(37, 99, 235, 0.4)' : 'rgba(220, 38, 38, 0.4)'}`
                        : '0 1px 2px rgba(0,0,0,0.05)',
                    }}
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
                className="w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-150 border-2"
                style={{
                  backgroundColor:
                    teamState.selectedAnswer !== null ? teamPrimaryColor : '#f1f5f9',
                  color: teamState.selectedAnswer !== null ? '#ffffff' : '#94a3b8',
                  borderColor:
                    teamState.selectedAnswer !== null ? teamDarkBorder : '#e2e8f0',
                  cursor:
                    teamState.selectedAnswer !== null ? 'pointer' : 'not-allowed',
                  boxShadow:
                    teamState.selectedAnswer !== null
                      ? `0 4px 14px ${isBlue ? 'rgba(37, 99, 235, 0.35)' : 'rgba(220, 38, 38, 0.35)'}`
                      : 'none',
                }}
              >
                ⚡ CONFIRM ROUTE
              </motion.button>
            ) : (
              <div
                className="w-full py-2 rounded-xl border-2 text-center font-black text-[10px] animate-pulse shadow-xs"
                style={{
                  backgroundColor: '#fef3c7',
                  borderColor: '#f59e0b',
                  color: '#78350f',
                }}
              >
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
