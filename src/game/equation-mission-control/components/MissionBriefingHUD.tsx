// ============================================================
// EQUATION MISSION CONTROL 2.0 — Mission Briefing Top HUD
// Mounted Aerospace Flight Telemetry Header:
// - Physical Aerospace Display Frame with Screws & Yellow Trim
// - 5 Stage Indicator Lights (Configure, Fuel, Engine, Navigation, Launch)
// - Stage Countdown Timer + Audio & Navigation Controls
// ============================================================

'use client';

import React, { useEffect, useRef } from 'react';
import { useMissionControlStore } from '../store/missionControlStore';
import { Volume2, VolumeX, Home, Maximize } from 'lucide-react';
import Link from 'next/link';
import { StageIndex } from '../types';

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
    <header className="absolute top-2 inset-x-0 z-30 px-4 pointer-events-none select-none flex items-center justify-between gap-3">
      {/* Left Control: Home Button */}
      <div className="pointer-events-auto flex items-center gap-2">
        <Link
          href="/"
          title="Arcade Hub"
          className="w-9 h-9 rounded-xl bg-white border-2 border-slate-800 hover:border-blue-600 flex items-center justify-center mc-shadow-hard mc-pressable transition"
        >
          <Home className="w-4 h-4 text-slate-800" />
        </Link>
      </div>

      {/* Center: Mounted Physical Aerospace Briefing Display */}
      <div className="pointer-events-auto flex flex-col items-center">
        <div className="px-5 py-2 rounded-2xl bg-white border-3 border-slate-900 mc-shadow-hard-lg flex items-center gap-5 relative">
          <div className="mc-screw absolute -top-1.5 -left-1.5" />
          <div className="mc-screw absolute -top-1.5 -right-1.5" />

          {/* Mission Info */}
          <div className="text-center leading-none">
            <div className="text-[9px] font-black tracking-widest text-amber-600 uppercase flex items-center justify-center gap-1">
              <span>🚀</span> MISSION 0{currentStage + 1}
            </div>
            <div className="text-xs font-black text-slate-950 mt-1 uppercase tracking-tight">
              {challenge?.stageTitle || 'DUAL SPACECRAFT PREPARATION'}
            </div>
          </div>

          {/* 5 Physical Stage Indicator Lights */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border-2 border-slate-800">
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
                    className={`w-2.5 h-2.5 rounded-full border transition-all ${
                      isDone
                        ? 'bg-emerald-500 border-emerald-400 shadow-[0_0_8px_#10b981]'
                        : isCurrent
                        ? 'bg-amber-400 border-amber-300 shadow-[0_0_8px_#facc15] animate-pulse'
                        : 'bg-slate-700 border-slate-800 opacity-40'
                    }`}
                  />
                  <span
                    className={`text-[8px] font-black uppercase hidden md:inline ${
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

          {/* Flight Countdown Timer */}
          {timerActive && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 border-2 border-slate-300">
              <span className="text-[9px] font-black text-slate-500">T-</span>
              <span
                className="text-sm font-black font-mono leading-none tracking-tight"
                style={{ color: timerColor }}
              >
                {mm}:{ss}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Right Controls: Sound & Fullscreen */}
      <div className="pointer-events-auto flex items-center gap-2">
        <button
          onClick={toggleMute}
          title={isMuted ? 'Unmute' : 'Mute'}
          className="w-9 h-9 rounded-xl bg-white border-2 border-slate-800 hover:border-amber-500 flex items-center justify-center mc-shadow-hard mc-pressable"
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-slate-500" />
          ) : (
            <Volume2 className="w-4 h-4 text-emerald-600" />
          )}
        </button>

        <button
          onClick={() => {
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen().catch(() => {});
            } else {
              document.exitFullscreen().catch(() => {});
            }
          }}
          title="Toggle Fullscreen"
          className="w-9 h-9 rounded-xl bg-white border-2 border-slate-800 hover:border-blue-600 flex items-center justify-center mc-shadow-hard mc-pressable"
        >
          <Maximize className="w-4 h-4 text-slate-800" />
        </button>
      </div>
    </header>
  );
};
