// ============================================================
// THE GREAT NUMBER RAILWAY — Team Operator Console
// Physical railway-operator panel (Blue = LEFT, Red = RIGHT):
//   large question · big number readout · destination-style answer cards
//   with gold selected state · green confirm · status + progress dots.
// During the showdown it becomes a route-status板: ROUND COMPLETE,
// round points, and ROUTE CLEARED / ROUTE CLOSED.
// ============================================================

'use client';

import React, { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRailwayStore } from '../store/railwayStore';
import { TeamId } from '../types';

interface TeamConsoleProps {
  team: TeamId;
}

// Little building glyph shown on each answer card (premium, no emoji)
const CardGlyph: React.FC<{ color: string }> = ({ color }) => (
  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden>
    <rect x="6" y="12" width="18" height="13" rx="1.5" fill={color} opacity="0.9" />
    <path d="M4 13 L15 5 L26 13 Z" fill={color} />
    <rect x="10" y="16" width="3.5" height="3.5" rx="0.6" fill="#fffef7" />
    <rect x="16.5" y="16" width="3.5" height="3.5" rx="0.6" fill="#fffef7" />
    <rect x="13" y="20.5" width="4" height="4.5" rx="0.6" fill="#fffef7" />
  </svg>
);

export const TeamConsole: React.FC<TeamConsoleProps> = ({ team }) => {
  const teamState = useRailwayStore((s) => (team === 'blue' ? s.blueTeam : s.redTeam));
  const challenge = useRailwayStore((s) => s.activeChallenge);
  const phase = useRailwayStore((s) => s.phase);
  const roundWinner = useRailwayStore((s) => s.roundWinner);
  const qIndex = useRailwayStore((s) => s.questionIndexInRound);
  const rounds = useRailwayStore((s) => s.rounds);
  const roundIndex = useRailwayStore((s) => s.currentRoundIndex);
  const isTieBreak = useRailwayStore((s) => s.isTieBreak);
  const setAnswer = useRailwayStore((s) => s.setTeamAnswer);
  const lockIn = useRailwayStore((s) => s.lockInTeam);

  const isBlue = team === 'blue';
  const primary = isBlue ? '#2563eb' : '#dc2626';
  const dark = isBlue ? '#1e3a8a' : '#7f1d1d';
  const darker = isBlue ? '#172554' : '#450a0a';
  const panelGrad = isBlue
    ? 'linear-gradient(160deg,#3b82f6 0%,#2563eb 45%,#1e40af 100%)'
    : 'linear-gradient(160deg,#f05252 0%,#dc2626 45%,#991b1b 100%)';

  const totalQ = rounds[roundIndex]?.questions.length ?? 5;
  const isPlayable = phase === 'challenge' || phase === 'tie-break';
  const isReveal = phase === 'question-reveal';
  const isShowdown = phase === 'showdown';
  const isResult = phase === 'winner-reveal' || phase === 'round-complete';
  const isWinner = roundWinner === team;

  const handleSelect = useCallback(
    (val: number | string) => {
      if (teamState.isLocked || !isPlayable) return;
      setAnswer(team, val);
    },
    [team, teamState.isLocked, isPlayable, setAnswer]
  );
  const handleConfirm = useCallback(() => {
    if (teamState.isLocked || teamState.selectedAnswer === null || !isPlayable) return;
    lockIn(team);
  }, [team, teamState.isLocked, teamState.selectedAnswer, isPlayable, lockIn]);

  // ── Status line text ──
  let statusText = 'STANDBY';
  if (isPlayable) {
    statusText = teamState.isLocked
      ? teamState.lastResult === 'correct' ? 'LOCKED — CORRECT' : teamState.lastResult === 'wrong' ? 'LOCKED — TRY NEXT' : 'LOCKED IN'
      : teamState.selectedAnswer !== null ? 'ANSWER SELECTED' : 'AWAITING ANSWER';
  } else if (isReveal) {
    statusText = teamState.lastResult === 'correct' ? 'CORRECT!' : teamState.lastResult === 'wrong' ? 'INCORRECT' : 'REVEALING…';
  } else if (isShowdown) statusText = 'ROUTE STATUS — WAITING';
  else if (isResult) statusText = isWinner ? 'ROUTE CLEARED — DEPARTING' : 'ROUTE CLOSED — NEXT ROUND';
  else if (phase === 'round-intro') statusText = 'GET READY';

  return (
    <div
      className="w-[300px] min-w-[300px] max-w-[300px] rounded-[20px] select-none overflow-hidden font-sans flex flex-col"
      style={{ background: panelGrad, border: '3px solid #c9a24b', boxShadow: '0 18px 40px rgba(0,0,0,0.35), inset 0 2px 0 rgba(255,255,255,0.25)' }}
      onPointerDown={(e) => e.stopPropagation()}
    >
      {/* ── Header ── */}
      <div className="px-3.5 py-2.5 flex items-center justify-between" style={{ borderBottom: '2px solid rgba(201,162,75,0.6)' }}>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'radial-gradient(circle at 35% 30%,#fff,#e2e8f0)', border: `2px solid ${dark}` }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3.4" fill={primary} /><path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6" fill={primary} /><rect x="7" y="3" width="10" height="3" rx="1.5" fill={dark} /></svg>
          </div>
          <div>
            <div className="text-[13px] font-black tracking-wide text-white leading-none">{isBlue ? 'BLUE CONSOLE' : 'RED CONSOLE'}</div>
            <div className="text-[9px] font-bold tracking-wider text-white/80 mt-0.5">TEAM {isBlue ? 'BLUE' : 'RED'} · OPERATOR</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {teamState.streak > 1 && isPlayable && (
            <span className="px-1.5 py-0.5 rounded-md text-[9px] font-black" style={{ background: '#f9d451', color: darker }}>x{teamState.streak}</span>
          )}
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: 'rgba(0,0,0,0.28)', border: '1px solid rgba(201,162,75,0.7)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#f9d451"><path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.7L12 17.8 5.9 20.3l1.4-6.7L2.2 9l6.9-.7z" /></svg>
            <span className="text-sm font-black text-white leading-none">{teamState.score.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="p-2.5">
        <div className="rounded-2xl p-2.5 flex flex-col gap-2" style={{ background: '#f5ecd6', border: '2px solid #c9a24b' }}>
          {(isPlayable || isReveal) && challenge ? (
            <>
              {/* Instruction */}
              <div>
                <div className="text-[9px] font-black uppercase tracking-widest" style={{ color: dark }}>
                  {isTieBreak ? 'TIE-BREAK' : challenge.missionTitle}
                </div>
                <div className="text-[13px] font-black leading-tight mt-0.5" style={{ color: '#2a1d12' }}>
                  {challenge.prompt}
                </div>
              </div>

              {/* Big number readout */}
              {challenge.numberString && (
                <div className="rounded-xl px-3 py-2 text-center" style={{ background: 'linear-gradient(180deg,#20160d,#3b2a1a)', border: '2px solid #c9a24b' }}>
                  <div className="text-[8px] font-black uppercase tracking-widest text-amber-200/80">THE NUMBER</div>
                  <div className="font-mono text-[26px] font-black tracking-wider text-white leading-tight">{challenge.numberString}</div>
                </div>
              )}

              {/* Answer cards */}
              <div className="text-[9px] font-black uppercase tracking-widest text-center" style={{ color: dark }}>Choose the correct route</div>
              <div className="flex flex-col gap-1.5">
                {challenge.options.map((opt, i) => {
                  const selected = teamState.selectedAnswer !== null && String(teamState.selectedAnswer) === String(opt.value);
                  const glyph = ['#e11d48', '#2563eb', '#16a34a', '#f59e0b'][i % 4];
                  return (
                    <motion.button
                      key={i}
                      whileTap={!teamState.isLocked ? { scale: 0.98 } : {}}
                      onClick={() => handleSelect(opt.value)}
                      disabled={teamState.isLocked}
                      className="w-full flex items-center gap-2.5 px-3 rounded-xl text-left transition-all duration-150"
                      style={{
                        minHeight: 58,
                        background: selected ? 'linear-gradient(180deg,#fde68a,#f9d451)' : '#fffdf5',
                        border: selected ? '3px solid #b8862f' : '2px solid #d8c9a8',
                        boxShadow: selected ? '0 4px 14px rgba(184,134,47,0.45)' : '0 1px 2px rgba(0,0,0,0.08)',
                        opacity: teamState.isLocked && !selected ? 0.45 : 1,
                        cursor: teamState.isLocked ? 'default' : 'pointer',
                      }}
                    >
                      <CardGlyph color={glyph} />
                      <span className="font-mono text-[17px] font-black leading-tight" style={{ color: '#2a1d12' }}>{opt.label}</span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Confirm / locked */}
              {!teamState.isLocked ? (
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleConfirm}
                  disabled={teamState.selectedAnswer === null}
                  className="w-full rounded-xl font-black text-[13px] uppercase tracking-wider text-white flex items-center justify-center gap-2"
                  style={{
                    minHeight: 52,
                    background: teamState.selectedAnswer !== null ? 'linear-gradient(180deg,#22c55e,#15803d)' : '#cbb998',
                    border: teamState.selectedAnswer !== null ? '2px solid #14532d' : '2px solid #b8a880',
                    boxShadow: teamState.selectedAnswer !== null ? '0 5px 16px rgba(21,128,61,0.4)' : 'none',
                    cursor: teamState.selectedAnswer !== null ? 'pointer' : 'not-allowed',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 6" /></svg>
                  CONFIRM ROUTE
                </motion.button>
              ) : (
                <div className="w-full rounded-xl font-black text-[12px] uppercase tracking-wider flex items-center justify-center" style={{ minHeight: 52, background: '#fef3c7', border: '2px solid #d97706', color: '#78350f' }}>
                  ROUTE CONFIRMED
                </div>
              )}

              <AnimatePresence>
                {teamState.lastFeedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="rounded-lg text-[11px] font-black text-center py-1.5"
                    style={{ background: teamState.lastFeedback.isCorrect ? '#dcfce7' : '#fee2e2', border: `2px solid ${teamState.lastFeedback.isCorrect ? '#16a34a' : '#dc2626'}`, color: teamState.lastFeedback.isCorrect ? '#14532d' : '#7f1d1d' }}
                  >
                    {teamState.lastFeedback.message}
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            /* ── Route status board (showdown / result / intro) ── */
            <div className="flex flex-col items-center text-center py-3 gap-2">
              <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: dark }}>
                {phase === 'round-intro' ? 'NEXT DEPARTURE' : 'ROUND COMPLETE'}
              </div>
              {(isShowdown || isResult) && (
                <div className="rounded-xl px-4 py-2" style={{ background: 'linear-gradient(180deg,#20160d,#3b2a1a)', border: '2px solid #c9a24b' }}>
                  <div className="text-[8px] font-black uppercase tracking-widest text-amber-200/80">ROUND POINTS</div>
                  <div className="font-mono text-[26px] font-black text-white leading-tight">+{teamState.roundScore.toLocaleString()}</div>
                </div>
              )}
              <div
                className="w-full rounded-xl font-black text-[12px] uppercase tracking-wider py-2.5"
                style={
                  isResult
                    ? isWinner
                      ? { background: 'linear-gradient(180deg,#22c55e,#15803d)', color: '#fff', border: '2px solid #14532d' }
                      : { background: '#e7ddc7', color: '#6b5836', border: '2px solid #c9a24b' }
                    : { background: '#fef3c7', color: '#78350f', border: '2px solid #d97706' }
                }
              >
                {isResult ? (isWinner ? 'ROUTE CLEARED · TRAIN DEPARTING' : 'ROUTE CLOSED · READY') : isShowdown ? 'ROUTE STATUS · WAITING' : 'ALL ABOARD'}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Footer: status + progress dots ── */}
      <div className="px-3.5 py-2 flex items-center justify-between" style={{ borderTop: '2px solid rgba(201,162,75,0.6)' }}>
        <div>
          <div className="text-[8px] font-black uppercase tracking-widest text-white/70">Status</div>
          <div className="text-[11px] font-black text-white leading-tight">{statusText}</div>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: totalQ }).map((_, i) => (
            <span key={i} className="rounded-full" style={{ width: 9, height: 9, background: i < qIndex + (teamState.isLocked && (isPlayable || isReveal) ? 1 : 0) ? '#f9d451' : 'rgba(255,255,255,0.35)', border: '1px solid rgba(0,0,0,0.15)' }} />
          ))}
        </div>
      </div>
    </div>
  );
};
