// ============================================================
// THE GREAT NUMBER RAILWAY — Top HUD Component
// Displays:
// - Blue Team Score (Left)
// - Current Station ➔ Next Station Journey Banner & 5-Step Loading Progress
// - Red Team Score (Right)
// - Timer & Mute Controls
// ============================================================

'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useRailwayStore } from '../store/railwayStore';
import { Volume2, VolumeX } from 'lucide-react';

const LOADING_STEP_BADGES = [
  { step: 1, icon: '🚗', name: 'Vehicles' },
  { step: 2, icon: '🧱', name: 'Materials' },
  { step: 3, icon: '👥', name: 'Passengers' },
  { step: 4, icon: '⚙️', name: 'Brakes' },
  { step: 5, icon: '🚦', name: 'Departure' },
];

export const RailwayHUD: React.FC = () => {
  const phase = useRailwayStore((s) => s.phase);
  const currentStep = useRailwayStore((s) => s.currentStepIndex);
  const challenge = useRailwayStore((s) => s.activeChallenge);
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
  const signalState = useRailwayStore((s) => s.signalState);

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
    timeRemaining <= 10 ? '#ef4444' : timeRemaining <= 20 ? '#f59e0b' : '#22c55e';

  if (phase === 'title') return null;

  return (
    <header className="absolute top-0 left-0 right-0 h-16 z-30 px-4 bg-slate-900/95 backdrop-blur-md border-b border-white/10 flex items-center justify-between text-white select-none">
      
      {/* ── BLUE TEAM SCORE (LEFT) ── */}
      <div className="flex items-center gap-3 min-w-[170px]">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-black text-xl shadow-lg shadow-blue-500/30 border border-blue-400">
          🔵
        </div>
        <div>
          <div className="text-[10px] font-black uppercase tracking-wider text-blue-400">
            BLUE ENGINEERS
          </div>
          <div className="text-2xl font-black tracking-tight text-white leading-none">
            {blueTeam.score}{' '}
            <span className="text-[10px] font-bold text-slate-400">PTS</span>
          </div>
        </div>
      </div>

      {/* ── CENTER: STATION ROUTE & 5-STAGE LOADING PROGRESS BAR ── */}
      <div className="flex-1 max-w-2xl mx-auto flex flex-col items-center">
        {/* Route Banner */}
        <div className="flex items-center gap-2 text-xs font-black tracking-wider text-amber-300">
          <span>🚉 {fromStation}</span>
          <span className="text-amber-400 font-bold">➔</span>
          <span className="text-emerald-400">🏁 {toStation}</span>
        </div>

        {/* 5-Step Visual Loading Badges */}
        <div className="flex items-center gap-2 mt-1">
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
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black border transition-all duration-300 ${
                  isCompleted
                    ? 'bg-emerald-600/90 border-emerald-400 text-white shadow-sm'
                    : isCurrent
                      ? 'bg-amber-500 border-amber-300 text-slate-950 scale-105 shadow-md animate-pulse'
                      : 'bg-slate-800/80 border-slate-700 text-slate-400'
                }`}
              >
                <span>{b.icon}</span>
                <span>{b.name}</span>
                {isCompleted && <span>✓</span>}
              </div>
            );
          })}

          {/* Timer Display */}
          {timerActive && (
            <div
              className="ml-2 font-mono font-black text-xs px-2 py-0.5 rounded bg-slate-950 border border-white/10"
              style={{ color: timerColor }}
            >
              ⏱ {timeRemaining}s
            </div>
          )}
        </div>
      </div>

      {/* ── RED TEAM SCORE (RIGHT) ── */}
      <div className="flex items-center gap-3 min-w-[170px] justify-end">
        <div className="text-right">
          <div className="text-[10px] font-black uppercase tracking-wider text-red-400">
            RED ENGINEERS
          </div>
          <div className="text-2xl font-black tracking-tight text-white leading-none">
            {redTeam.score}{' '}
            <span className="text-[10px] font-bold text-slate-400">PTS</span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center font-black text-xl shadow-lg shadow-red-500/30 border border-red-400">
          🔴
        </div>

        {/* Sound Toggle */}
        <button
          onClick={toggleMute}
          className="ml-2 p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
          title="Toggle Sound"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
        </button>
      </div>
    </header>
  );
};
