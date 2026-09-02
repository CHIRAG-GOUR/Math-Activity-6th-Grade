// ============================================================
// THE GREAT NUMBER RAILWAY — Top HUD (wood & brass)
//   Blue team plaque (left) · STAGE x/N + round + timer (centre) ·
//   Red team plaque (right) + mute. Drives the question countdown.
// ============================================================

'use client';

import React, { useEffect, useRef } from 'react';
import { useRailwayStore } from '../store/railwayStore';
import { Volume2, VolumeX, Home } from 'lucide-react';
import Link from 'next/link';
import { TeamId } from '../types';


const TeamPlaque: React.FC<{ team: TeamId; align: 'left' | 'right' }> = ({ team, align }) => {
  const t = useRailwayStore((s) => (team === 'blue' ? s.blueTeam : s.redTeam));
  const isBlue = team === 'blue';
  const primary = isBlue ? '#2563eb' : '#dc2626';
  const dark = isBlue ? '#1e3a8a' : '#7f1d1d';
  const avatar = (
    <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ background: 'radial-gradient(circle at 35% 30%,#fff,#e2e8f0)', border: `2.5px solid ${dark}`, boxShadow: '0 2px 6px rgba(0,0,0,0.35)' }}>
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3.6" fill={primary} /><path d="M4.5 20.5c0-3.9 3.4-6.5 7.5-6.5s7.5 2.6 7.5 6.5" fill={primary} /><rect x="6.6" y="2.6" width="10.8" height="3.2" rx="1.6" fill={dark} /><rect x="10.4" y="6.4" width="3.2" height="1.6" rx="0.6" fill="#f9d451" /></svg>
    </div>
  );
  const info = (
    <div className={align === 'right' ? 'text-right' : 'text-left'}>
      <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#f9d451' }}>TEAM {isBlue ? 'BLUE' : 'RED'}</div>
      <div className="flex items-center gap-1 leading-none" style={{ justifyContent: align === 'right' ? 'flex-end' : 'flex-start' }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="#f9d451"><path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.7L12 17.8 5.9 20.3l1.4-6.7L2.2 9l6.9-.7z" /></svg>
        <span className="text-[20px] font-black text-white tracking-tight">{t.score.toLocaleString()}</span>
        <span className="text-[9px] font-bold text-amber-200/70 ml-0.5">PTS</span>
      </div>
    </div>
  );
  return (
    <div className="flex items-center gap-2.5 px-3 py-2 rounded-2xl" style={{ background: 'linear-gradient(180deg,#5b4326,#3a2a17)', border: '3px solid #c9a24b', boxShadow: '0 8px 22px rgba(0,0,0,0.35), inset 0 2px 0 rgba(255,255,255,0.15)' }}>
      {align === 'left' ? (<>{avatar}{info}</>) : (<>{info}{avatar}</>)}
    </div>
  );
};

export const RailwayHUD: React.FC = () => {
  const phase = useRailwayStore((s) => s.phase);
  const roundIndex = useRailwayStore((s) => s.currentRoundIndex);
  const totalRounds = useRailwayStore((s) => s.totalRounds);
  const rounds = useRailwayStore((s) => s.rounds);
  const qIndex = useRailwayStore((s) => s.questionIndexInRound);
  const timeRemaining = useRailwayStore((s) => s.timeRemaining);
  const timerActive = useRailwayStore((s) => s.timerActive);
  const setTime = useRailwayStore((s) => s.setTimeRemaining);
  const isMuted = useRailwayStore((s) => s.isMuted);
  const toggleMute = useRailwayStore((s) => s.toggleMute);
  const handleTimerExpired = useRailwayStore((s) => s.handleTimerExpired);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (timerActive) {
      timerRef.current = setInterval(() => {
        const cur = useRailwayStore.getState().timeRemaining;
        if (cur <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setTime(0);
          handleTimerExpired();
        } else setTime(cur - 1);
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timerActive, setTime, handleTimerExpired]);

  if (phase === 'title' || phase === 'network-complete') return null;

  const round = rounds[roundIndex];
  const totalQ = round?.questions.length ?? 5;
  const mm = String(Math.floor(timeRemaining / 60)).padStart(2, '0');
  const ss = String(timeRemaining % 60).padStart(2, '0');
  const timerColor = timeRemaining <= 8 ? '#f87171' : timeRemaining <= 18 ? '#fbbf24' : '#4ade80';

  const centreLine =
    phase === 'showdown' ? 'RAILWAY SHOWDOWN'
      : phase === 'tie-break' ? 'TIE-BREAK'
        : phase === 'winner-reveal' ? 'ROUTE CLEARED'
          : `QUESTION ${Math.min(qIndex + 1, totalQ)} / ${totalQ}`;

  return (
    <header className="absolute top-2.5 inset-x-0 z-30 px-3 pointer-events-none select-none flex items-start justify-between gap-3">
      {/* Left: Blue plaque + home */}
      <div className="flex items-center gap-2 pointer-events-auto">
        <Link href="/" title="Arcade Hub" className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(180deg,#5b4326,#3a2a17)', border: '2px solid #c9a24b' }}>
          <Home className="w-4 h-4 text-amber-200" />
        </Link>
        <TeamPlaque team="blue" align="left" />
      </div>

      {/* Centre: Stage + round + timer */}
      <div className="pointer-events-auto flex flex-col items-center gap-1 mt-0.5">
        <div className="px-4 py-1.5 rounded-2xl flex items-center gap-3" style={{ background: 'linear-gradient(180deg,#3a2a17,#241a0e)', border: '3px solid #c9a24b', boxShadow: '0 8px 22px rgba(0,0,0,0.4)' }}>
          <div className="text-center leading-tight">
            <div className="text-[10px] font-black tracking-widest text-amber-200/80">STAGE {roundIndex + 1} / {totalRounds}</div>
            <div className="text-[13px] font-black tracking-wide text-white">{round?.name ?? 'RAILWAY'}</div>
          </div>
          <div className="w-px h-8" style={{ background: 'rgba(201,162,75,0.6)' }} />
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg" style={{ background: '#140e07', border: '1px solid rgba(201,162,75,0.6)' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={timerColor} strokeWidth="2.4"><circle cx="12" cy="13" r="8" /><path d="M12 9v4l2.5 2M9 2h6" strokeLinecap="round" /></svg>
            <span className="font-mono text-[16px] font-black tracking-wider" style={{ color: timerColor }}>{timerActive ? `${mm}:${ss}` : '--:--'}</span>
          </div>
        </div>
        <div className="px-3 py-0.5 rounded-full text-[10px] font-black tracking-widest text-white" style={{ background: 'rgba(36,26,14,0.85)', border: '1.5px solid rgba(201,162,75,0.5)' }}>
          {centreLine}
        </div>
      </div>

      {/* Right: Red plaque + mute */}
      <div className="flex items-center gap-2 pointer-events-auto">
        <TeamPlaque team="red" align="right" />
        <button onClick={toggleMute} title="Sound" className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(180deg,#5b4326,#3a2a17)', border: '2px solid #c9a24b' }}>
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-300" /> : <Volume2 className="w-4 h-4 text-emerald-300" />}
        </button>
      </div>
    </header>
  );
};
