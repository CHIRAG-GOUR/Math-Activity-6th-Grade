// ============================================================
// THE GREAT CARNIVAL OF CHANCE — Dual-Team Consoles
// Simultaneous Touch Architecture:
// - TEAM BLUE: Left Console (w-72 md:w-80)
// - TEAM RED: Right Console (w-72 md:w-80)
// - Independent touch state, pointerdown listeners, tactile feedback
// ============================================================

import React from 'react';
import { motion } from 'framer-motion';
import { useCarnivalStore } from '../store/carnivalStore';
import { OptionChoice, TeamId } from '../types';
import { CheckCircle2, XCircle, Award, Flame } from 'lucide-react';

interface ConsoleProps {
  teamId: TeamId;
  align: 'left' | 'right';
}

export const SingleTeamConsole: React.FC<ConsoleProps> = ({ teamId, align }) => {
  const isBlue = teamId === 'blue';
  const teamState = useCarnivalStore((s) => (isBlue ? s.blueTeam : s.redTeam));
  const activeChallenge = useCarnivalStore((s) => s.activeChallenge);
  const phase = useCarnivalStore((s) => s.phase);
  const submitTeamAnswer = useCarnivalStore((s) => s.submitTeamAnswer);

  const canInteract = phase === 'predicting' && !teamState.isLocked;

  const primaryColor = isBlue ? '#2563eb' : '#dc2626';
  const bgBadge = isBlue ? 'bg-blue-50 border-blue-200 text-blue-900' : 'bg-red-50 border-red-200 text-red-900';
  const glowShadow = isBlue ? 'shadow-[0_15px_35px_rgba(37,99,235,0.25)]' : 'shadow-[0_15px_35px_rgba(220,38,38,0.25)]';
  const borderTheme = isBlue ? 'border-blue-400' : 'border-red-400';

  const handleTouch = (opt: OptionChoice, e: React.PointerEvent) => {
    e.preventDefault();
    if (!canInteract) return;
    submitTeamAnswer(teamId, opt.value);
  };

  return (
    <motion.aside
      initial={{ x: align === 'left' ? -120 : 120, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 18, stiffness: 120 }}
      className={`w-[290px] xs:w-[320px] sm:w-[350px] md:w-[370px] pointer-events-auto flex flex-col justify-between p-3.5 sm:p-4 rounded-3xl bg-white/95 backdrop-blur-md border-3 ${borderTheme} ${glowShadow} select-none shrink-0 max-h-[88vh] overflow-y-auto`}
    >
      {/* ── 1. Team Header Bar & Score ── */}
      <div className={`flex items-center justify-between pb-2 border-b-2 ${isBlue ? 'border-blue-100' : 'border-red-100'}`}>
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-white text-xs shadow-xs"
            style={{ backgroundColor: primaryColor }}
          >
            {isBlue ? 'B' : 'R'}
          </div>
          <div>
            <span className="text-[10px] sm:text-xs font-black tracking-wider uppercase text-slate-800 block leading-tight">
              {teamState.name}
            </span>
            <span className={`text-[8px] sm:text-[9px] font-bold uppercase ${isBlue ? 'text-blue-600' : 'text-red-600'}`}>
              {align === 'left' ? 'LEFT CONSOLE' : 'RIGHT CONSOLE'}
            </span>
          </div>
        </div>

        {/* Score & Streak */}
        <div className="text-right">
          <div className="flex items-center gap-1 justify-end">
            <span className="text-lg sm:text-xl font-black text-slate-950 font-mono">
              {teamState.score.toLocaleString()}
            </span>
            <span className="text-[9px] font-black text-slate-500">PTS</span>
          </div>
          {teamState.streak > 1 && (
            <div className="flex items-center gap-0.5 justify-end text-[9px] font-black text-amber-600">
              <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
              <span>{teamState.streak}x STREAK</span>
            </div>
          )}
        </div>
      </div>

      {/* ── 2. Active Probability Question Card ── */}
      {activeChallenge && (
        <div className="my-2.5 p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-left">
          <div className="flex items-center justify-between text-[8px] sm:text-[9px] font-black uppercase text-slate-700 tracking-wider mb-1">
            <span>{activeChallenge.missionTitle}</span>
            <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
              +{activeChallenge.points} PTS
            </span>
          </div>
          <p className="text-[11px] sm:text-xs font-bold text-slate-800 leading-snug">
            {activeChallenge.prompt}
          </p>
        </div>
      )}

      {/* ── 3. Touch Options (Simultaneous PointerDown Support) ── */}
      <div className="space-y-1.5 my-1">
        {activeChallenge?.options.map((opt) => {
          const isSelected = String(teamState.selectedAnswer) === String(opt.value);
          const isCorrect = teamState.isLocked && String(opt.value) === String(activeChallenge.correctAnswer);
          const isWrong = isSelected && !isCorrect;

          let btnBg = 'bg-white text-slate-800 border-slate-300 hover:border-slate-400';
          if (isSelected) {
            btnBg = isBlue
              ? 'bg-blue-600 text-white border-blue-700 shadow-md scale-[1.02]'
              : 'bg-red-600 text-white border-red-700 shadow-md scale-[1.02]';
          }
          if (teamState.isLocked && isCorrect) {
            btnBg = 'bg-emerald-600 text-white border-emerald-700 shadow-md';
          }

          return (
            <button
              key={opt.id}
              onPointerDown={(e) => handleTouch(opt, e)}
              disabled={!canInteract}
              className={`w-full min-h-[52px] sm:min-h-[58px] p-2.5 sm:p-3 rounded-2xl border-2 text-left font-black transition-all flex items-center justify-between gap-2 touch-manipulation cursor-pointer ${btnBg} ${
                !canInteract && !teamState.isLocked ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              <div className="flex-1">
                <div className="text-xs sm:text-sm leading-tight">{opt.label}</div>
                {opt.fractionDisplay && (
                  <div className="text-[9px] font-mono opacity-85 mt-0.5">
                    Fraction: {opt.fractionDisplay}
                  </div>
                )}
              </div>
              {teamState.isLocked && isSelected && (
                <div>
                  {isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-white shrink-0" />
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* ── 4. Feedback & Status Badge ── */}
      <div className="mt-2 pt-2 border-t border-slate-200 text-center">
        {teamState.isLocked ? (
          <div
            className={`py-1.5 px-2 rounded-xl text-[10px] sm:text-[11px] font-black tracking-wide ${
              teamState.lastResult === 'correct'
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                : 'bg-amber-100 text-amber-900 border border-amber-300'
            }`}
          >
            {teamState.lastFeedback}
          </div>
        ) : (
          <div className="text-[10px] sm:text-[11px] font-black uppercase text-slate-700 tracking-wider py-1">
            {phase === 'predicting' ? 'TAP YOUR PREDICTION' : 'Awaiting Next Attraction...'}
          </div>
        )}
      </div>
    </motion.aside>
  );
};

export const TeamConsoles: React.FC = () => {
  const phase = useCarnivalStore((s) => s.phase);
  const showConsoles = phase !== 'title' && phase !== 'island-explore' && phase !== 'grand-celebration';

  if (!showConsoles) return null;

  return (
    <div className="fixed inset-x-0 bottom-4 sm:bottom-6 z-40 flex items-end justify-between px-3 sm:px-6 pointer-events-none">
      <SingleTeamConsole teamId="blue" align="left" />
      <SingleTeamConsole teamId="red" align="right" />
    </div>
  );
};
