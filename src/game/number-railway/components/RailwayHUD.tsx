// ============================================================
// THE GREAT NUMBER RAILWAY — Sleek Light-Themed Top HUD
// Modern, crisp, porcelain white navigation bar:
// - Blue Team Plaque (Left, Light Porcelain + Blue Accents)
// - Stage & Question Status + Progressive Green Signals (Center)
// - Red Team Plaque (Right, Light Porcelain + Red Accents)
// ============================================================

'use client';

import React, { useEffect, useRef } from 'react';
import { useRailwayStore } from '../store/railwayStore';
import { Volume2, VolumeX, Home, Maximize } from 'lucide-react';
import Link from 'next/link';
import { TeamId } from '../types';

const TeamPlaque: React.FC<{ team: TeamId; align: 'left' | 'right' }> = ({ team, align }) => {
  const t = useRailwayStore((s) => (team === 'blue' ? s.blueTeam : s.redTeam));
  const isBlue = team === 'blue';
  const primary = isBlue ? '#2563eb' : '#dc2626';
  const borderCol = isBlue ? '#93c5fd' : '#fca5a5';
  const bgCol = isBlue ? 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)' : 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)';

  const avatar = (
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs"
      style={{
        background: isBlue ? '#2563eb' : '#dc2626',
        color: '#ffffff',
      }}
    >
      <span className="text-base">{isBlue ? '🔵' : '🔴'}</span>
    </div>
  );

  const info = (
    <div className={align === 'right' ? 'text-right' : 'text-left'}>
      <div
        className="text-[9px] font-black uppercase tracking-wider"
        style={{ color: isBlue ? '#1e40af' : '#991b1b' }}
      >
        TEAM {isBlue ? 'BLUE' : 'RED'}
      </div>
      <div className="flex items-center gap-1 leading-none" style={{ justifyContent: align === 'right' ? 'flex-end' : 'flex-start' }}>
        <span className="text-[19px] font-black text-slate-900 tracking-tight">{t.score.toLocaleString()}</span>
        <span className="text-[9px] font-bold text-slate-500 ml-0.5">PTS</span>
      </div>
    </div>
  );

  return (
    <div
      className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl border-2 shadow-lg bg-white"
      style={{
        background: bgCol,
        borderColor: borderCol,
      }}
    >
      {align === 'left' ? <>{avatar}{info}</> : <>{info}{avatar}</>}
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
  const signalsGreenCount = useRailwayStore((s) => s.signalsGreenCount);

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
  const timerColor = timeRemaining <= 8 ? '#ef4444' : timeRemaining <= 18 ? '#f59e0b' : '#10b981';

  return (
    <header className="absolute top-2.5 inset-x-0 z-30 px-3 pointer-events-none select-none flex items-start justify-between gap-3">
      {/* Left: Blue plaque + home */}
      <div className="flex items-center gap-2 pointer-events-auto">
        <Link
          href="/"
          title="Arcade Hub"
          className="w-10 h-10 rounded-2xl bg-white border-2 border-slate-300 hover:border-blue-400 flex items-center justify-center shadow-lg transition"
        >
          <Home className="w-5 h-5 text-slate-700" />
        </Link>
        <TeamPlaque team="blue" align="left" />
      </div>

      {/* Centre: Light Porcelain Stage Card & Progressive Green Signals */}
      <div className="pointer-events-auto flex flex-col items-center gap-1 mt-0.5">
        <div className="px-5 py-2 rounded-2xl bg-white/95 backdrop-blur-md border-2 border-slate-300 shadow-xl flex items-center gap-4">
          <div className="text-center leading-tight">
            <div className="text-[9px] font-black tracking-widest text-amber-600 uppercase">
              STAGE {roundIndex + 1} / {totalRounds} • {round?.name ?? 'RAILWAY'}
            </div>
            <div className="text-[13px] font-black tracking-wide text-slate-900 mt-0.5">
              QUESTION {Math.min(qIndex + 1, totalQ)} OF {totalQ}
            </div>
          </div>

          {/* Progressive Signals Turning Green One by One */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 border border-slate-200">
            {[0, 1, 2, 3, 4].map((idx) => {
              const isGreen = idx < signalsGreenCount;
              return (
                <div
                  key={idx}
                  title={`Signal ${idx + 1}: ${isGreen ? 'GREEN' : 'RED'}`}
                  className={`w-3 h-3 rounded-full border transition-all ${
                    isGreen
                      ? 'bg-emerald-500 border-emerald-600 shadow-xs shadow-emerald-400'
                      : 'bg-red-500 border-red-600 opacity-40'
                  }`}
                />
              );
            })}
          </div>

          {/* Countdown Timer */}
          {timerActive && (
            <div
              className="font-mono text-xs font-black px-2.5 py-1 rounded-xl bg-slate-100 border border-slate-200"
              style={{ color: timerColor }}
            >
              ⏱ {mm}:{ss}
            </div>
          )}
        </div>
      </div>

      {/* Right: Red plaque + sound toggle + fullscreen */}
      <div className="flex items-center gap-2 pointer-events-auto">
        <TeamPlaque team="red" align="right" />
        <button
          onClick={toggleMute}
          title={isMuted ? 'Unmute' : 'Mute'}
          className="w-10 h-10 rounded-2xl bg-white border-2 border-slate-300 hover:border-red-400 flex items-center justify-center shadow-lg transition cursor-pointer"
        >
          {isMuted ? <VolumeX className="w-5 h-5 text-red-500" /> : <Volume2 className="w-5 h-5 text-slate-700" />}
        </button>
        <button
          onClick={() => {
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen().catch(() => {});
            } else {
              if (document.exitFullscreen) document.exitFullscreen();
            }
          }}
          title="Toggle Fullscreen"
          className="w-10 h-10 rounded-2xl bg-white border-2 border-slate-300 hover:border-red-400 flex items-center justify-center shadow-lg transition cursor-pointer"
        >
          <Maximize className="w-5 h-5 text-slate-700" />
        </button>
      </div>
    </header>
  );
};
