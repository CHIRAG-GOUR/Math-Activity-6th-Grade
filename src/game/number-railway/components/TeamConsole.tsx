// ============================================================
// THE GREAT NUMBER RAILWAY — Team Control Console
// Dedicated Side-by-Side Consoles:
// - Blue Team = Left 27%
// - Red Team = Right 27%
// - Isolated multi-touch interaction
// - 5-Stage Step Indicators & Tactile Large Buttons
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
  const currentStep = useRailwayStore((s) => s.currentStepIndex);

  const isBlue = team === 'blue';
  const teamTitle = isBlue ? 'TEAM BLUE ENGINEERS' : 'TEAM RED ENGINEERS';

  // Team Theme Tokens
  const theme = isBlue
    ? {
        bgHeader: 'bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700',
        border: 'border-blue-500/40',
        accentGlow: 'shadow-blue-500/20',
        badgeBg: 'bg-blue-950/80 border-blue-400 text-blue-300',
        buttonSelected: 'bg-gradient-to-r from-blue-600 to-indigo-600 border-blue-300 text-white shadow-lg shadow-blue-500/30',
        confirmBtn: 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white shadow-lg shadow-blue-600/40',
        numberColor: 'text-cyan-300',
      }
    : {
        bgHeader: 'bg-gradient-to-r from-red-700 via-red-600 to-rose-700',
        border: 'border-red-500/40',
        accentGlow: 'shadow-red-500/20',
        badgeBg: 'bg-red-950/80 border-red-400 text-red-300',
        buttonSelected: 'bg-gradient-to-r from-red-600 to-rose-600 border-red-300 text-white shadow-lg shadow-red-500/30',
        confirmBtn: 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 text-white shadow-lg shadow-red-600/40',
        numberColor: 'text-amber-300',
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
      className={`w-full h-full flex flex-col bg-slate-900 border-x ${theme.border} text-white select-none overflow-hidden`}
      onPointerDown={(e) => e.stopPropagation()} // Multi-touch isolation
    >
      {/* ── 1. Team Header Bar ── */}
      <div className={`px-4 py-3 ${theme.bgHeader} flex items-center justify-between shadow-md`}>
        <div className="flex items-center gap-2">
          <span className="text-xl">🚂</span>
          <div>
            <h2 className="text-xs font-black tracking-wider uppercase text-white leading-none">
              {teamTitle}
            </h2>
            <p className="text-[10px] font-semibold text-white/80 mt-0.5 tracking-wide">
              RAILWAY OPERATOR STATION
            </p>
          </div>
        </div>

        {/* Individual Team Score */}
        <div className="px-3 py-1 bg-black/30 rounded-lg border border-white/20 text-center">
          <div className="text-xs font-black text-amber-300 leading-none">
            {teamState.score}
          </div>
          <div className="text-[8px] font-bold text-slate-300 uppercase">SCORE</div>
        </div>
      </div>

      {/* ── 2. Current 5-Step Stage Indicator ── */}
      {challenge && (
        <div className="px-4 py-2 bg-slate-950/80 border-b border-white/10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-bold text-amber-300">
            <span className="text-base">{challenge.stepIcon}</span>
            <span className="text-[11px] uppercase tracking-wide font-black">
              {challenge.stepTitle}
            </span>
          </div>
          <div className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-300 font-bold border border-slate-700">
            +{challenge.points} PTS
          </div>
        </div>
      )}

      {/* ── 3. Interactive Challenge & Console Controls ── */}
      <div className="flex-1 p-4 flex flex-col justify-between overflow-y-auto">
        {showQuestion ? (
          <div className="flex flex-col gap-3">
            {/* Context Box */}
            <div className="p-3 bg-slate-800/80 rounded-xl border border-white/10 shadow-sm">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                DISPATCH OBJECTIVE
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {challenge.context.narrative}
              </p>
            </div>

            {/* Question Card */}
            <div className="p-4 bg-slate-800/90 rounded-2xl border border-white/15 shadow-md">
              <div className="text-[10px] font-black uppercase tracking-wider text-amber-400 mb-1">
                MATHEMATICAL PROBLEM
              </div>
              <h3 className="text-base font-extrabold text-white leading-snug">
                {challenge.prompt}
              </h3>

              {/* High-Contrast Large Number Display */}
              {challenge.numberString && (
                <div className="mt-3 p-3 bg-slate-950 rounded-xl border border-slate-700 text-center">
                  <div
                    className={`font-mono text-3xl font-black tracking-widest ${theme.numberColor}`}
                  >
                    {challenge.numberString}
                  </div>
                </div>
              )}
            </div>

            {/* Answer Options Grid */}
            <div className="flex flex-col gap-2.5 mt-1">
              {challenge.options.map((opt, i) => {
                const isSelected = teamState.currentAnswer === opt.value;
                const isLocked = teamState.isLockedIn;

                return (
                  <motion.button
                    key={i}
                    whileTap={!isLocked ? { scale: 0.97 } : {}}
                    onClick={() => handleSelectOption(opt.value)}
                    disabled={isLocked}
                    className={`w-full py-3.5 px-4 rounded-xl font-mono text-lg font-black text-center border-2 transition-all duration-200 ${
                      isSelected
                        ? theme.buttonSelected
                        : 'bg-slate-800/90 border-slate-700 text-slate-200 hover:border-slate-500 hover:bg-slate-800'
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
                className={`w-full py-3.5 rounded-xl font-black text-sm uppercase tracking-wider transition-all duration-200 mt-2 ${
                  teamState.currentAnswer !== null
                    ? theme.confirmBtn
                    : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                }`}
              >
                ⚡ CONFIRM DISPATCH
              </motion.button>
            ) : (
              <div className="w-full py-3 rounded-xl bg-slate-950 border border-amber-500/40 text-center font-bold text-xs text-amber-300 animate-pulse">
                ⏳ ROUTE LOCKED IN — VALIDATING...
              </div>
            )}

            {/* Live Feedback Toast */}
            <AnimatePresence>
              {teamState.lastFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`p-3 rounded-xl border text-xs font-bold leading-relaxed ${
                    teamState.lastFeedback.isCorrect
                      ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
                      : 'bg-red-950/90 border-red-500/50 text-red-200'
                  }`}
                >
                  {teamState.lastFeedback.message}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          /* Waiting / Journey View */
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 gap-3">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-3xl animate-bounce">
              {phase === 'train-journey' ? '🚂' : phase === 'station-arrived' ? '🏁' : '⚙️'}
            </div>
            <h4 className="text-sm font-black text-white uppercase tracking-wider">
              {phase === 'train-journey'
                ? 'TRAIN JOURNEYING TO NEXT STATION!'
                : phase === 'station-arrived'
                  ? 'ARRIVED AT DESTINATION!'
                  : 'STANDBY FOR DISPATCH'}
            </h4>
            <p className="text-xs text-slate-400 max-w-[200px]">
              {phase === 'train-journey'
                ? 'Watch the train travel across the scenic railway network.'
                : 'Preparing next station departure manifest...'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
