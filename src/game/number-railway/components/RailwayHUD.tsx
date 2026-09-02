// ============================================================
// THE GREAT NUMBER RAILWAY — Sleek Floating Top HUD
// Modern, crisp, floating navigation bar:
// - Blue Team Score (Left)
// - Station Route & 5-Step Visual Progress Badges (Center)
// - Red Team Score & Sound Toggle (Right)
// ============================================================

'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useRailwayStore } from '../store/railwayStore';
import { Volume2, VolumeX, Home } from 'lucide-react';
import Link from 'next/link';

const LOADING_STEP_BADGES = [
  { step: 1, icon: '🚗', name: 'Vehicles' },
  { step: 2, icon: '🧱', name: 'Materials' },
  { step: 3, icon: '👥', name: 'Passengers' },
  { step: 4, icon: '⚙️', name: 'Brakes' },
  { step: 5, icon: '🚦', name: 'Go!' },
];

export const RailwayHUD: React.FC = () => {
  const phase = useRailwayStore((s) => s.phase);
  const currentStep = useRailwayStore((s) => s.currentStepIndex);
  const blueTeam = useRailwayStore((s) => s.blueTeam);
  const redTeam = useRailwayStore((s) => s.redTeam);
  const loadedItems = useRailwayStore((s) => s.loadedItems);
  const fromStation = useRailwayStore((s) => s.fromStationName);
  const toStation = useRailwayStore((s) => s.toStationName);
  const timeRemaining = useRailwayStore((s) => s.timeRemaining);
  const timerActive = useRailwayStore((s) => s.timerActive);
  const setTime = useRailwayStore((s) => s.setTimeRemaining);
  const isMuted = useRailwayStore((s) => s.isMuted);
  const toggleMute = useRailwayStore((s) => s.toggleMute);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (timerActive && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTime(useRailwayStore.getState().timeRemaining - 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerActive, setTime]);

  const timerColor =
    timeRemaining <= 10 ? '#ef4444' : timeRemaining <= 20 ? '#f59e0b' : '#10b981';

  if (phase === 'title') return null;

  return (
    <header className="absolute top-2.5 inset-x-0 z-30 px-4 pointer-events-none select-none flex justify-center">
      <div className="w-full max-w-6xl pointer-events-auto bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-2xl shadow-xl shadow-slate-900/10 px-4 py-2 flex items-center justify-between gap-3 text-slate-800">
        
        {/* ── 1. BLUE TEAM SCORE (LEFT) ── */}
        <div className="flex items-center gap-2.5 min-w-[150px]">
          <Link
            href="/"
            title="Return to Arcade Hub"
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
          >
            <Home className="w-4 h-4 text-blue-600" />
          </Link>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 flex items-center justify-center text-sm shadow-md text-white font-black">
            🔵
          </div>
          <div>
            <div className="text-[9px] font-black uppercase tracking-wider text-blue-700">
              BLUE TEAM
            </div>
            <div className="text-lg font-black tracking-tight text-slate-900 leading-none">
              {blueTeam.score} <span className="text-[9px] font-bold text-slate-400">PTS</span>
            </div>
          </div>
        </div>

        {/* ── 2. CENTER: ROUTE BANNER & 5-STEP STAGE BADGES ── */}
        <div className="flex-1 flex flex-col items-center max-w-xl">
          {/* Station Route Banner */}
          <div className="flex items-center gap-2 text-[11px] font-black tracking-wide text-slate-700">
            <span className="text-blue-700 font-extrabold">🚉 {fromStation}</span>
            <span className="text-amber-500 font-bold">➔</span>
            <span className="text-emerald-700 font-extrabold">🏁 {toStation}</span>
          </div>

          {/* 5-Step Visual Badges */}
          <div className="flex items-center gap-1.5 mt-1">
            {LOADING_STEP_BADGES.map((b) => {
              const isCompleted =
                b.step === 1
                  ? loadedItems.vehicles
                  : b.step === 2
                    ? loadedItems.materials
                    : b.step === 3
                      ? loadedItems.passengers
                      : b.step === 4
                        ? loadedItems.brakesLifted
                        : loadedItems.signalGreen;

              const isCurrent = currentStep === b.step;

              return (
                <div
                  key={b.step}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black border transition-all duration-200 ${
                    isCompleted
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                      : isCurrent
                        ? 'bg-amber-400 border-amber-500 text-slate-950 scale-105 shadow-sm animate-pulse'
                        : 'bg-slate-100 border-slate-200 text-slate-400'
                  }`}
                >
                  <span className="text-[11px]">{b.icon}</span>
                  <span className="hidden sm:inline">{b.name}</span>
                  {isCompleted && <span>✓</span>}
                </div>
              );
            })}

            {/* Timer Badge */}
            {timerActive && (
              <div
                className="ml-1 font-mono font-black text-xs px-2 py-0.5 rounded-md bg-slate-100 border border-slate-300"
                style={{ color: timerColor }}
              >
                ⏱ {timeRemaining}s
              </div>
            )}
          </div>
        </div>

        {/* ── 3. RED TEAM SCORE (RIGHT) ── */}
        <div className="flex items-center gap-2.5 min-w-[150px] justify-end">
          <div className="text-right">
            <div className="text-[9px] font-black uppercase tracking-wider text-red-700">
              RED TEAM
            </div>
            <div className="text-lg font-black tracking-tight text-slate-900 leading-none">
              {redTeam.score} <span className="text-[9px] font-bold text-slate-400">PTS</span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-red-700 to-red-500 flex items-center justify-center text-sm shadow-md text-white font-black">
            🔴
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleMute}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
            title="Toggle Sound"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
          </button>
        </div>
      </div>
    </header>
  );
};
