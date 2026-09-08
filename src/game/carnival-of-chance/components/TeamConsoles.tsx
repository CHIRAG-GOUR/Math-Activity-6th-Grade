// ============================================================
// THE GREAT CARNIVAL OF CHANCE — Dual-Team Consoles & Arcade Sidebars
// Exact visual recreation of the Classroom Touchscreen Island UI:
// - Left Side: BLUE TEAM Arcade Panel (SELECT AN ATTRACTION / PREDICTION CONSOLE)
// - Right Side: RED TEAM Arcade Panel (SELECT AN ATTRACTION / PREDICTION CONSOLE)
// - Simultaneous touch support, pointerdown events, independent scoring
// ============================================================

'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCarnivalStore } from '../store/carnivalStore';
import { AttractionId, OptionChoice, TeamId } from '../types';
import { CheckCircle2, XCircle, Flame, Flag, Trophy, Check, ArrowRight } from 'lucide-react';

// ── Custom Rich SVGs for the 6 Attractions (Matching the Image) ──

export const AttractionIcon: React.FC<{ id: AttractionId; className?: string }> = ({ id, className = "w-6 h-6" }) => {
  switch (id) {
    case 'odds-wheel':
      return (
        <svg viewBox="0 0 32 32" className={className}>
          <circle cx="16" cy="16" r="14" fill="#1e293b" />
          <circle cx="16" cy="16" r="13" fill="#f59e0b" />
          {/* Slices */}
          <path d="M16 16 L16 3 A13 13 0 0 1 25.2 6.8 Z" fill="#ef4444" />
          <path d="M16 16 L25.2 6.8 A13 13 0 0 1 29 16 Z" fill="#3b82f6" />
          <path d="M16 16 L29 16 A13 13 0 0 1 25.2 25.2 Z" fill="#eab308" />
          <path d="M16 16 L25.2 25.2 A13 13 0 0 1 16 29 Z" fill="#10b981" />
          <path d="M16 16 L16 29 A13 13 0 0 1 6.8 25.2 Z" fill="#ef4444" />
          <path d="M16 16 L6.8 25.2 A13 13 0 0 1 3 16 Z" fill="#3b82f6" />
          <path d="M16 16 L3 16 A13 13 0 0 1 6.8 6.8 Z" fill="#eab308" />
          <path d="M16 16 L6.8 6.8 A13 13 0 0 1 16 3 Z" fill="#10b981" />
          {/* Center Hub */}
          <circle cx="16" cy="16" r="4" fill="#0f172a" />
          <circle cx="16" cy="16" r="2.5" fill="#fef08a" />
        </svg>
      );
    case 'mystery-chests':
      return (
        <svg viewBox="0 0 32 32" className={className}>
          {/* Treasure Chest */}
          <path d="M4 14 C4 10 28 10 28 14 L28 24 C28 26 26 28 24 28 L8 28 C6 28 4 26 4 24 Z" fill="#78350f" />
          {/* Lid */}
          <path d="M4 14 C4 9 9 6 16 6 C23 6 28 9 28 14 Z" fill="#92400e" />
          {/* Gold Straps & Lock */}
          <rect x="7" y="6" width="3" height="22" rx="1.5" fill="#f59e0b" />
          <rect x="22" y="6" width="3" height="22" rx="1.5" fill="#f59e0b" />
          <rect x="13" y="14" width="6" height="6" rx="2" fill="#fef08a" stroke="#b45309" strokeWidth="1" />
          <circle cx="16" cy="17" r="1" fill="#78350f" />
        </svg>
      );
    case 'giant-ball-drop':
      return (
        <svg viewBox="0 0 32 32" className={className}>
          {/* 3 Colorful Balls */}
          <circle cx="11" cy="12" r="7" fill="#f97316" />
          <circle cx="11" cy="12" r="5" fill="#fb923c" />
          <circle cx="21" cy="12" r="7" fill="#3b82f6" />
          <circle cx="21" cy="12" r="5" fill="#60a5fa" />
          <circle cx="16" cy="22" r="7" fill="#ec4899" />
          <circle cx="16" cy="22" r="5" fill="#f472b6" />
        </svg>
      );
    case 'chance-lab':
      return (
        <svg viewBox="0 0 32 32" className={className}>
          {/* Science Flask */}
          <path d="M13 5 L19 5 L19 11 L26 23 C27.5 25.5 25.5 28 22.5 28 L9.5 28 C6.5 28 4.5 25.5 6 23 L13 11 Z" fill="#a855f7" />
          <path d="M9.5 28 L22.5 28 C24.5 28 25.8 26.5 24.8 24.5 L20 16 L12 16 L7.2 24.5 C6.2 26.5 7.5 28 9.5 28 Z" fill="#06b6d4" />
          <circle cx="13" cy="21" r="1.5" fill="#ffffff" opacity="0.8" />
          <circle cx="18" cy="23" r="2" fill="#ffffff" opacity="0.8" />
          <rect x="12" y="3" width="8" height="3" rx="1.5" fill="#c084fc" />
        </svg>
      );
    case 'carnival-workshop':
      return (
        <svg viewBox="0 0 32 32" className={className}>
          {/* Crossed Wrench & Screwdriver */}
          <path d="M7 23 L18 12 L22 16 L11 27 Z" fill="#38bdf8" />
          <path d="M21 7 C19 7 17 8 16 10 L20 14 L24 10 C25 9 26 9 27 10 L28 9 C28 8 27 7 26 7 Z" fill="#0284c7" />
          <path d="M25 23 L14 12 L10 16 L21 27 Z" fill="#f97316" />
          <circle cx="9" cy="25" r="3" fill="#ea580c" />
        </svg>
      );
    case 'grand-carnival':
    default:
      return (
        <svg viewBox="0 0 32 32" className={className}>
          {/* Grand Trophy */}
          <path d="M8 7 L24 7 L22 18 C21 21 18 23 16 23 C14 23 11 21 10 18 Z" fill="#eab308" />
          <path d="M8 9 C5 9 4 13 6 15 C8 17 10 16 10 16" stroke="#ca8a04" strokeWidth="2" fill="none" />
          <path d="M24 9 C27 9 28 13 26 15 C24 17 22 16 22 16" stroke="#ca8a04" strokeWidth="2" fill="none" />
          <rect x="14" y="23" width="4" height="4" fill="#ca8a04" />
          <rect x="10" y="27" width="12" height="3" rx="1.5" fill="#a16207" />
          <polygon points="16,9 17.5,12 21,12.5 18.5,15 19,18.5 16,17 13,18.5 13.5,15 11,12.5 14.5,12" fill="#fef08a" />
        </svg>
      );
  }
};

// ── 6 Core Attractions List (Matching the Sidebar UI) ──
const SIDEBAR_ATTRACTIONS: { id: AttractionId; label: string }[] = [
  { id: 'odds-wheel', label: 'The Odds Wheel' },
  { id: 'mystery-chests', label: 'Mystery Chests' },
  { id: 'giant-ball-drop', label: 'Giant Ball Drop' },
  { id: 'chance-lab', label: 'The Probability Lab' },
  { id: 'carnival-workshop', label: 'Build a Game' },
  { id: 'grand-carnival', label: 'Grand Carnival' },
];

interface SidebarConsoleProps {
  teamId: TeamId;
  align: 'left' | 'right';
}

export const TeamArcadeSidebar: React.FC<SidebarConsoleProps> = ({ teamId, align }) => {
  const isBlue = teamId === 'blue';
  const teamState = useCarnivalStore((s) => (isBlue ? s.blueTeam : s.redTeam));
  const activeAttractionId = useCarnivalStore((s) => s.activeAttractionId);
  const attractions = useCarnivalStore((s) => s.attractions);
  const activeChallenge = useCarnivalStore((s) => s.activeChallenge);
  const phase = useCarnivalStore((s) => s.phase);
  const selectAttraction = useCarnivalStore((s) => s.selectAttraction);
  const submitTeamAnswer = useCarnivalStore((s) => s.submitTeamAnswer);

  const isPredictingMode =
    phase === 'predicting' ||
    phase === 'machine-running' ||
    phase === 'observation-reasoning' ||
    phase === 'experiment-trials';
  const canVote = phase === 'predicting' && !teamState.isLocked;

  const headerBg = isBlue
    ? 'from-blue-700 via-blue-600 to-indigo-700 border-amber-300'
    : 'from-red-700 via-red-600 to-rose-700 border-amber-300';

  const frameBorder = isBlue ? 'border-blue-500/80 shadow-[0_12px_40px_rgba(29,78,216,0.35)]' : 'border-red-500/80 shadow-[0_12px_40px_rgba(220,38,38,0.35)]';
  const statusBg = isBlue ? 'from-blue-900 to-indigo-950 border-blue-400' : 'from-red-950 to-rose-950 border-red-400';

  return (
    <motion.aside
      initial={{ x: align === 'left' ? -150 : 150, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 20, stiffness: 120 }}
      className={`w-[240px] sm:w-[260px] md:w-[280px] pointer-events-auto flex flex-col justify-between p-2.5 sm:p-3 rounded-3xl bg-white/95 backdrop-blur-md border-3 ${frameBorder} select-none shrink-0 shadow-2xl z-30 max-h-[82vh]`}
    >
      {/* ── 1. Top Capsule Header Banner (BLUE TEAM / RED TEAM) ── */}
      <div>
        <div className={`w-full py-2 px-3 rounded-2xl bg-gradient-to-r ${headerBg} border-2 text-center shadow-md`}>
          <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-amber-300 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
            {isBlue ? 'BLUE TEAM' : 'RED TEAM'}
          </h2>
        </div>

        <div className="text-center mt-2 mb-1.5">
          <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-slate-600">
            {isPredictingMode ? 'PREDICTION CONSOLE' : 'SELECT AN ATTRACTION'}
          </span>
        </div>
      </div>

      {/* ── 2. Middle Body: Attraction Selectors OR Interactive Prediction Options ── */}
      <div className="my-1.5 space-y-1.5 flex-1 overflow-y-auto pr-0.5">
        {!isPredictingMode ? (
          /* ── Attraction Selection Menu (Matching Reference Image) ── */
          SIDEBAR_ATTRACTIONS.map((item) => {
            const attrData = attractions.find((a) => a.id === item.id);
            const isSelected = activeAttractionId === item.id;
            const isCompleted = attrData?.completed;

            let cardStyle = 'bg-slate-50 hover:bg-amber-50/80 border-slate-200 text-slate-800';
            if (isSelected) {
              cardStyle = isBlue
                ? 'bg-blue-50 border-blue-500 text-blue-950 shadow-md ring-2 ring-blue-400'
                : 'bg-red-50 border-red-500 text-red-950 shadow-md ring-2 ring-red-400';
            }

            return (
              <button
                key={item.id}
                onClick={() => selectAttraction(item.id)}
                className={`w-full py-2 px-2.5 sm:px-3 rounded-2xl border-2 flex items-center justify-between gap-2.5 transition-all text-left cursor-pointer active:scale-97 ${cardStyle}`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-xs">
                    <AttractionIcon id={item.id} className="w-5 h-5" />
                  </div>
                  <span className="text-xs sm:text-sm font-black tracking-tight truncate">
                    {item.label}
                  </span>
                </div>

                {isCompleted ? (
                  <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                ) : isSelected ? (
                  <ArrowRight className={`w-4 h-4 shrink-0 ${isBlue ? 'text-blue-600' : 'text-red-600'}`} />
                ) : null}
              </button>
            );
          })
        ) : (
          /* ── Live Dual Prediction Question & Options Mode ── */
          <div className="space-y-2">
            {activeChallenge && (
              <div className="p-2.5 rounded-2xl bg-amber-50/90 border border-amber-300 text-left mb-2">
                <div className="flex items-center justify-between text-[8px] sm:text-[9px] font-black uppercase text-amber-800 mb-1">
                  <span>{activeChallenge.missionTitle}</span>
                  <span className="px-1.5 py-0.5 rounded bg-amber-200 text-amber-950 font-black">
                    +{activeChallenge.points} PTS
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs font-bold text-slate-900 leading-snug">
                  {activeChallenge.prompt}
                </p>
              </div>
            )}

            {/* Answer Options */}
            <div className="space-y-1.5">
              {activeChallenge?.options.map((opt) => {
                const isSelected = String(teamState.selectedAnswer) === String(opt.value);
                const isCorrect = teamState.isLocked && String(opt.value) === String(activeChallenge.correctAnswer);

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
                    onPointerDown={(e) => {
                      e.preventDefault();
                      if (canVote) submitTeamAnswer(teamId, opt.value);
                    }}
                    disabled={!canVote}
                    className={`w-full min-h-[48px] p-2.5 rounded-2xl border-2 text-left font-black transition-all flex items-center justify-between gap-2 touch-manipulation cursor-pointer ${btnBg} ${
                      !canVote && !teamState.isLocked ? 'opacity-60 cursor-not-allowed' : ''
                    }`}
                  >
                    <div className="flex-1">
                      <div className="text-xs font-black leading-tight">{opt.label}</div>
                      {opt.fractionDisplay && (
                        <div className="text-[9px] font-mono opacity-80 mt-0.5">
                          {opt.fractionDisplay}
                        </div>
                      )}
                    </div>
                    {teamState.isLocked && isSelected && (
                      <div>
                        {isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-white shrink-0" />
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── 3. Bottom Status Pill (TEAM STATUS: Ready to play!) ── */}
      <div className="mt-2 pt-1.5 border-t border-slate-200">
        <div className={`w-full py-2 px-3 rounded-2xl bg-gradient-to-r ${statusBg} border-2 text-white flex items-center justify-center gap-2 shadow-inner`}>
          <Flag className={`w-3.5 h-3.5 ${isBlue ? 'text-blue-400 fill-blue-400' : 'text-red-400 fill-red-400'}`} />
          <div className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-center">
            {teamState.isLocked ? (
              <span className={teamState.lastResult === 'correct' ? 'text-emerald-300' : 'text-amber-300'}>
                {teamState.lastFeedback || 'ANSWER LOCKED'}
              </span>
            ) : isPredictingMode ? (
              <span className="text-amber-300 animate-pulse">TAP YOUR PREDICTION!</span>
            ) : (
              <span>TEAM STATUS: Ready to play!</span>
            )}
          </div>
        </div>
      </div>
    </motion.aside>
  );
};

export const TeamConsoles: React.FC = () => {
  const phase = useCarnivalStore((s) => s.phase);

  if (phase === 'title' || phase === 'grand-celebration') return null;

  return (
    <div className="fixed inset-x-0 bottom-3 sm:bottom-4 z-30 flex items-end justify-between px-2 sm:px-5 pointer-events-none">
      <TeamArcadeSidebar teamId="blue" align="left" />
      <TeamArcadeSidebar teamId="red" align="right" />
    </div>
  );
};
