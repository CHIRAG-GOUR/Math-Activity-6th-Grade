// ============================================================
// EQUATION MISSION CONTROL — Mission Briefing Top HUD
// Neo-Brutalist Aerospace Flight Telemetry Header:
// - Left: Blue Mission Control Plaque + Home
// - Center: Shared Aerospace Mission Briefing Display + 5 Stage Indicator Lights
// - Right: Red Mission Control Plaque + Sound Toggle + Fullscreen
// ============================================================

'use client';

import React, { useEffect, useRef } from 'react';
import { useMissionControlStore } from '../store/missionControlStore';
import { Volume2, VolumeX, Home, Maximize } from 'lucide-react';
import Link from 'next/link';
import { TeamId, StageIndex } from '../types';

const TeamPlaque: React.FC<{ team: TeamId; align: 'left' | 'right' }> = ({ team, align }) => {
  const t = useMissionControlStore((s) => (team === 'blue' ? s.blueTeam : s.redTeam));
  const isBlue = team === 'blue';
  const borderCol = isBlue ? '#60a5fa' : '#f87171';
  const bgCol = isBlue
    ? 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)'
    : 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)';

  const avatar = (
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs border-2"
      style={{
        background: isBlue ? '#2563eb' : '#dc2626',
        borderColor: isBlue ? '#1e40af' : '#991b1b',
        color: '#ffffff',
      }}
    >
      <span className="text-base">{isBlue ? '🛰️' : '🚀'}</span>
    </div>
  );

  const info = (
    <div className={align === 'right' ? 'text-right' : 'text-left'}>
      <div
        className="text-[9px] font-black uppercase tracking-wider"
        style={{ color: isBlue ? '#1e40af' : '#991b1b' }}
      >
        {t.name}
      </div>
      <div
        className="flex items-center gap-1 leading-none"
        style={{ justifyContent: align === 'right' ? 'flex-end' : 'flex-start' }}
      >
        <span className="text-[19px] font-black text-slate-900 tracking-tight">
          {t.score.toLocaleString()}
        </span>
        <span className="text-[9px] font-bold text-slate-500 ml-0.5">PTS</span>
      </div>
    </div>
  );

  return (
    <div
      className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl border-3 shadow-lg bg-white"
      style={{
        background: bgCol,
        borderColor: borderCol,
      }}
    >
      {align === 'left' ? (
        <>
          {avatar}
          {info}
        </>
      ) : (
        <>
          {info}
          {avatar}
        </>
      )}
    </div>
  );
};

export const MissionBriefingHUD: React.FC = () => {
  const phase = useMissionControlStore((s) => s.phase);
  const currentStage = useMissionControlStore((s) => s.currentStageIndex);
  const challenge = useMissionControlStore((s) => s.activeChallenge);
  const timeRemaining = useMissionControlStore((s) => s.timeRemaining);
  const timerActive = useMissionControlStore((s) => s.timerActive);
  const setTime = useMissionControlStore((s) => s.setTimeRemaining);
  const isMuted = useMissionControlStore((s) => s.isMuted);
  const toggleMute = useMissionControlStore((s) => s.toggleMute);
  const handleTimerExpired = useMissionControlStore((s) => s.handleTimerExpired);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (timerActive) {
      timerRef.current = setInterval(() => {
        const cur = useMissionControlStore.getState().timeRemaining;
        if (cur <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setTime(0);
          handleTimerExpired();
        } else {
          setTime(cur - 1);
        }
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerActive, setTime, handleTimerExpired]);

  if (phase === 'title' || phase === 'mission-report') return null;

  const mm = String(Math.floor(timeRemaining / 60)).padStart(2, '0');
  const ss = String(timeRemaining % 60).padStart(2, '0');
  const timerColor =
    timeRemaining <= 8 ? '#ef4444' : timeRemaining <= 18 ? '#f59e0b' : '#10b981';

  const STAGE_NAMES = ['CONFIGURE', 'FUEL', 'ENGINE', 'NAVIGATION', 'LAUNCH'];

  return (
    <header className="absolute top-2.5 inset-x-0 z-30 px-3 pointer-events-none select-none flex items-start justify-between gap-3">
      {/* Left: Blue Telemetry Plaque + Home */}
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

      {/* Center: Physical Aerospace Mission Telemetry Frame */}
      <div className="pointer-events-auto flex flex-col items-center gap-1 mt-0.5">
        <div className="px-5 py-2 rounded-2xl bg-white/95 backdrop-blur-md border-3 border-amber-400 shadow-2xl flex items-center gap-4">
          <div className="text-center leading-tight">
            <div className="text-[9px] font-black tracking-widest text-amber-700 uppercase">
              MISSION TELEMETRY • STAGE {currentStage + 1} OF 5
            </div>
            <div className="text-[13px] font-black tracking-wide text-slate-950 mt-0.5">
              {challenge?.stageTitle || 'AEROSPACE LAUNCH PREPARATION'}
            </div>
          </div>

          {/* 5 Aerospace Stage Indicator Lights */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border-2 border-slate-800">
            {([0, 1, 2, 3, 4] as StageIndex[]).map((idx) => {
              const isDone = idx < currentStage;
              const isCurrent = idx === currentStage;
              return (
                <div
                  key={`stage-light-${idx}`}
                  title={`${STAGE_NAMES[idx]}: ${isDone ? 'COMPLETE' : isCurrent ? 'IN PROGRESS' : 'PENDING'}`}
                  className="flex items-center gap-1"
                >
                  <div
                    className={`w-3 h-3 rounded-full border transition-all ${
                      isDone
                        ? 'bg-emerald-500 border-emerald-400 shadow-[0_0_8px_#10b981]'
                        : isCurrent
                          ? 'bg-amber-400 border-amber-300 shadow-[0_0_8px_#facc15] animate-pulse'
                          : 'bg-slate-700 border-slate-800 opacity-40'
                    }`}
                  />
                  <span
                    className={`text-[8px] font-black uppercase hidden sm:inline ${
                      isDone
                        ? 'text-emerald-400'
                        : isCurrent
                          ? 'text-amber-300'
                          : 'text-slate-500'
                    }`}
                  >
                    {STAGE_NAMES[idx]}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Countdown Clock */}
          {timerActive && (
            <div
              className="font-mono text-xs font-black px-2.5 py-1 rounded-xl bg-slate-100 border-2 border-slate-300 shadow-inner"
              style={{ color: timerColor }}
            >
              ⏱ {mm}:{ss}
            </div>
          )}
        </div>
      </div>

      {/* Right: Red Telemetry Plaque + Audio Toggle + Fullscreen */}
      <div className="flex items-center gap-2 pointer-events-auto">
        <TeamPlaque team="red" align="right" />
        <button
          onClick={toggleMute}
          title={isMuted ? 'Unmute' : 'Mute'}
          className="w-10 h-10 rounded-2xl bg-white border-2 border-slate-300 hover:border-red-400 flex items-center justify-center shadow-lg transition cursor-pointer"
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 text-red-500" />
          ) : (
            <Volume2 className="w-5 h-5 text-slate-700" />
          )}
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
