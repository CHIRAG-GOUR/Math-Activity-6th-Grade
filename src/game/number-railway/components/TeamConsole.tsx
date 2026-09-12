// ============================================================
// THE GREAT NUMBER RAILWAY — Symmetrical Team Control Console
// Perfectly Identical Sizing & Light Porcelain Styling:
// - Fixed dimensions: w-[270px] min-w-[270px] max-w-[270px]
// - Compact question card & clean typography
// - Turn-based first answerer & rebound indicator
// - Guaranteed solid Blue/Red selected states with bold white text
// ============================================================

'use client';

import React, { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRailwayStore } from '../store/railwayStore';
import { TeamId } from '../types';
import { PowerUpTray } from '@/components/shared/PowerUpTray';
import { DigitalScratchpad } from '@/components/shared/DigitalScratchpad';
import { Zap } from 'lucide-react';

interface TeamConsoleProps {
  team: TeamId;
}

export const TeamConsole: React.FC<TeamConsoleProps> = ({ team }) => {
  const teamState = useRailwayStore((s) => (team === 'blue' ? s.blueTeam : s.redTeam));
  const otherTeamState = useRailwayStore((s) => (team === 'blue' ? s.redTeam : s.blueTeam));
  const challenge = useRailwayStore((s) => s.activeChallenge);
  const phase = useRailwayStore((s) => s.phase);
  const setAnswer = useRailwayStore((s) => s.setTeamAnswer);
  const lockIn = useRailwayStore((s) => s.lockInTeam);
  const isTieBreak = useRailwayStore((s) => s.isTieBreak);

  // Power-Ups and Hints from Store
  const powerUps = useRailwayStore((s) => (team === 'blue' ? s.bluePowerUps : s.redPowerUps));
  const misconception = useRailwayStore((s) => (team === 'blue' ? s.blueMisconception : s.redMisconception));
  const eliminatedOptions = useRailwayStore((s) => (team === 'blue' ? s.blueEliminatedOptions : s.redEliminatedOptions));
  const use5050 = useRailwayStore((s) => s.usePowerUp5050);
  const useTimeFreeze = useRailwayStore((s) => s.usePowerUpTimeFreeze);
  const use2x = useRailwayStore((s) => s.usePowerUp2x);

  const isBlue = team === 'blue';
  const teamTitle = isBlue ? 'TEAM BLUE' : 'TEAM RED';
  const teamPrimaryColor = isBlue ? '#2563eb' : '#dc2626';
  const teamBorderColor = isBlue ? '#60a5fa' : '#f87171';
  const teamDarkBorder = isBlue ? '#1e40af' : '#991b1b';

  const isPlayable = phase === 'challenge' || phase === 'tie-break';

  const handleSelectOption = useCallback(
    (val: number | string) => {
      if (teamState.isLocked || !isPlayable) return;
      if (eliminatedOptions.includes(val)) return;
      setAnswer(team, val);
    },
    [team, teamState.isLocked, isPlayable, eliminatedOptions, setAnswer]
  );

  const handleConfirmAnswer = useCallback(() => {
    if (teamState.isLocked || teamState.selectedAnswer === null || !isPlayable) return;
    lockIn(team);
  }, [team, teamState.isLocked, teamState.selectedAnswer, isPlayable, lockIn]);

  // Rebound prompt when other team got locked out
  const isReboundOpportunity = otherTeamState.isLocked && !teamState.isLocked && otherTeamState.lastResult === 'wrong';

  // Comeback Surge: when team is behind by 2+ correct answers or 150+ pts
  const isComebackSurge = !teamState.isLocked && (otherTeamState.roundCorrect - teamState.roundCorrect >= 2 || otherTeamState.score - teamState.score >= 150);

  return (
    <div className="flex flex-col gap-1.5 items-center select-none font-sans">
      <div
        className="w-[270px] min-w-[270px] max-w-[270px] bg-white border-2 rounded-2xl shadow-2xl select-none overflow-hidden flex flex-col"
        style={{ borderColor: teamBorderColor }}
        onPointerDown={(e) => e.stopPropagation()}
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

        {/* ── 2. Comeback Surge / Rebound Notice / Attempts Status Pill ── */}
        {isComebackSurge ? (
          <div className="px-2.5 py-1 bg-gradient-to-r from-orange-500 to-amber-400 border-b border-orange-600 flex items-center justify-center text-[9px] font-black text-slate-950 animate-pulse gap-1">
            <Zap className="w-3 h-3 fill-slate-950" />
            <span>🔥 COMEBACK SURGE (+25% BONUS)</span>
          </div>
        ) : isReboundOpportunity ? (
          <div className="px-2.5 py-1 bg-amber-100 border-b border-amber-300 flex items-center justify-center text-[9px] font-black text-amber-900 animate-pulse">
            ⚡ REBOUND CHANCE — ANSWER TO STEAL!
          </div>
        ) : !teamState.isLocked && teamState.attemptsLeft === 1 ? (
          <div className="px-2.5 py-1 bg-amber-100 border-b border-amber-300 flex items-center justify-center text-[9px] font-black text-amber-900 animate-pulse">
            ⚠️ 1 ATTEMPT REMAINING — TRY AGAIN!
          </div>
        ) : challenge ? (
          <div
            className="px-2.5 py-1 border-b flex items-center justify-between text-xs font-black"
            style={{
              backgroundColor: isTieBreak ? '#fef3c7' : isBlue ? '#eff6ff' : '#fef2f2',
              color: isTieBreak ? '#78350f' : isBlue ? '#1e40af' : '#991b1b',
              borderColor: isBlue ? '#bfdbfe' : '#fecaca',
            }}
          >
            <div className="flex items-center gap-1 font-black text-[9px] uppercase tracking-tight">
              <span>{isTieBreak ? '⚡' : '🚂'}</span>
              <span>{challenge.missionTitle}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[7.5px] font-black px-1 py-0.2 rounded bg-slate-100 border border-slate-300 text-slate-700">
                {teamState.attemptsLeft}/2 TRIES
              </span>
              <span className="text-[8px] font-black px-1.5 py-0.2 rounded bg-white border border-slate-300 text-slate-800">
                +{challenge.points}P
              </span>
            </div>
          </div>
        ) : null}

        {/* ── 3. Interactive Challenge Content ── */}
        <div className="p-2.5 flex flex-col gap-2 bg-slate-50 overflow-y-auto max-h-[380px]">
          {isPlayable && challenge ? (
            <>
              {/* Misconception Hint Callout on 1st Mistake */}
              {teamState.attemptsLeft === 1 && misconception && !teamState.isLocked && (
                <div className="p-2 rounded-xl bg-amber-400/20 border-2 border-amber-400 text-amber-900 text-[10px] font-bold leading-tight flex items-center gap-1.5 animate-fadeIn">
                  <span>{misconception}</span>
                </div>
              )}

              {/* Compact Question Card */}
              <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[8px] font-black uppercase tracking-wider text-amber-700 block mb-0.5">
                  QUESTION
                </span>
                <h3 className="text-[11px] font-black text-slate-900 leading-snug">
                  {challenge.prompt}
                </h3>

                {/* Number Readout Box */}
                {challenge.numberString && (
                  <div
                    className="mt-1 p-1 rounded-lg text-center border"
                    style={{
                      backgroundColor: isBlue ? '#eff6ff' : '#fef2f2',
                      borderColor: isBlue ? '#93c5fa' : '#fca5a5',
                    }}
                  >
                    <div
                      className="font-mono text-lg font-black tracking-wide"
                      style={{ color: isBlue ? '#1e3a8a' : '#991b1b' }}
                    >
                      {challenge.numberString}
                    </div>
                  </div>
                )}
              </div>

              {/* Answer Options Grid */}
              <div className="flex flex-col gap-1.5">
                {challenge.options.map((opt, i) => {
                  const isSelected =
                    teamState.selectedAnswer !== null &&
                    String(teamState.selectedAnswer) === String(opt.value);
                  const isEliminated = eliminatedOptions.includes(opt.value);
                  const isLocked = teamState.isLocked || isEliminated;

                  return (
                    <motion.button
                      key={i}
                      whileTap={!isLocked ? { scale: 0.97 } : {}}
                      onClick={() => handleSelectOption(opt.value)}
                      disabled={isLocked}
                      className={`w-full py-1.5 px-2.5 rounded-xl font-mono text-xs font-black text-center transition-all duration-150 border-2 shadow-xs ${
                        isEliminated
                          ? 'opacity-25 line-through bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed'
                          : 'cursor-pointer'
                      }`}
                      style={{
                        backgroundColor: isSelected
                          ? teamPrimaryColor
                          : isEliminated
                          ? '#e2e8f0'
                          : '#ffffff',
                        color: isSelected ? '#ffffff' : isEliminated ? '#94a3b8' : '#0f172a',
                        borderColor: isSelected
                          ? teamDarkBorder
                          : isEliminated
                          ? '#cbd5e1'
                          : '#cbd5e1',
                        opacity: isEliminated ? 0.3 : isLocked && !isSelected ? 0.35 : 1,
                        boxShadow: isSelected
                          ? `0 3px 10px ${isBlue ? 'rgba(37, 99, 235, 0.35)' : 'rgba(220, 38, 38, 0.35)'}`
                          : '0 1px 2px rgba(0,0,0,0.04)',
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
                  className="w-full py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all duration-150 border-2"
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
                        ? `0 4px 12px ${isBlue ? 'rgba(37, 99, 235, 0.3)' : 'rgba(220, 38, 38, 0.3)'}`
                        : 'none',
                  }}
                >
                  ⚡ CONFIRM ROUTE
                </motion.button>
              ) : (
                <div
                  className="w-full py-2 rounded-xl border-2 text-center font-black text-[10px] shadow-xs"
                  style={{
                    backgroundColor: teamState.lastResult === 'wrong' ? '#fee2e2' : '#fef3c7',
                    borderColor: teamState.lastResult === 'wrong' ? '#ef4444' : '#f59e0b',
                    color: teamState.lastResult === 'wrong' ? '#991b1b' : '#78350f',
                  }}
                >
                  {teamState.lastResult === 'wrong'
                    ? '❌ LOCKED OUT — REBOUND ACTIVE'
                    : '⏳ ROUTE CONFIRMED...'}
                </div>
              )}

              {/* Live Feedback Toast */}
              <AnimatePresence>
                {teamState.lastFeedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-1.5 rounded-lg border text-[9px] font-black leading-tight text-center shadow-xs"
                    style={{
                      backgroundColor: teamState.lastFeedback.isCorrect ? '#ecfdf5' : '#fef2f2',
                      borderColor: teamState.lastFeedback.isCorrect ? '#34d399' : '#f87171',
                      color: teamState.lastFeedback.isCorrect ? '#065f46' : '#991b1b',
                    }}
                  >
                    {teamState.lastFeedback.message}
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            /* Standby / Showdown State */
            <div className="py-6 flex flex-col items-center justify-center text-center gap-1.5">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-xl animate-bounce">
                {phase === 'showdown' ? '🚂' : phase === 'round-complete' ? '🏁' : '⚙️'}
              </div>
              <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-tight">
                {phase === 'showdown'
                  ? 'SHOWDOWN IN PROGRESS!'
                  : phase === 'round-complete'
                    ? 'STAGE COMPLETED!'
                    : 'STANDBY'}
              </h4>
            </div>
          )}
        </div>
      </div>

      {/* ── 4. Tactical Power-Up Tray & Digital Scratchpad Dock ── */}
      <div className="w-[270px] flex items-center justify-between gap-1">
        <PowerUpTray
          teamId={team}
          powerUps={powerUps}
          onUse5050={() => use5050(team)}
          onUseTimeFreeze={() => useTimeFreeze(team)}
          onUse2x={() => use2x(team)}
          disabled={!isPlayable || teamState.isLocked}
        />
        <DigitalScratchpad teamId={team} teamName={teamState.name} position={isBlue ? 'left' : 'right'} />
      </div>
    </div>
  );
};
