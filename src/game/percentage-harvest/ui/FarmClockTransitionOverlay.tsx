// ============================================================
// PERCENTAGE HARVEST — VINTAGE BRASS FARM CLOCK & DAY/NIGHT TRANSITION OVERLAY
// Antique Clock with Spinning Hands, Sun Arc & Moon Cycle, Day Advancement & "After Some Days..."
// ============================================================

import React, { useEffect, useState } from 'react';
import { farmSim } from '../engine/farmSim';
import { farmAudio } from '../engine/farmAudio';

export const FarmClockTransitionOverlay: React.FC = () => {
  const [transitionState, setTransitionState] = useState<{
    isActive: boolean;
    day: number;
    prevDay: number;
    hour: number;
    minute: number;
    notice: string | null;
    timer: number;
  }>({
    isActive: false,
    day: 1,
    prevDay: 1,
    hour: 8,
    minute: 30,
    notice: null,
    timer: 0,
  });

  const [handAngle, setHandAngle] = useState(0);

  useEffect(() => {
    let lastActive = false;
    let prevDayTracked = 1;

    const interval = setInterval(() => {
      const clk = farmSim.clock;
      const isActive = clk.isNightTransition || clk.transitionTimer > 0;

      if (isActive && !lastActive) {
        // Just triggered
        farmAudio.playClockTicking(8);
        setTimeout(() => {
          farmAudio.playRoosterMorning();
        }, 1300);
      }

      if (isActive) {
        setHandAngle((prev) => prev + 24);
      }

      setTransitionState({
        isActive,
        day: clk.day,
        prevDay: prevDayTracked,
        hour: clk.hour,
        minute: clk.minute,
        notice: clk.stageNotice,
        timer: clk.transitionTimer,
      });

      if (!isActive && lastActive) {
        prevDayTracked = clk.day;
      }
      lastActive = isActive;
    }, 50);

    return () => clearInterval(interval);
  }, []);

  if (!transitionState.isActive && !transitionState.notice) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center pointer-events-none transition-opacity duration-500 ${
        transitionState.isActive ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* ── AMBIENT TWILIGHT SKY DARKENING BACKDROP ── */}
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] transition-opacity duration-700" />

      {/* ── CENTRAL ANTIQUE BRASS POCKET CLOCK & SUN/MOON TRANSITION CARD ── */}
      <div className="relative z-10 flex flex-col items-center gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-amber-50 via-white to-amber-100/95 border-4 border-amber-400 shadow-2xl shadow-amber-950/40 text-slate-800 max-w-lg mx-4 transform animate-in fade-in zoom-in-95 duration-300">
        {/* Glow halo */}
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 opacity-30 blur-xl animate-pulse" />

        {/* ── TOP: DYNAMIC SUN ➔ MOON ➔ SUN SKY ARC ── */}
        <div className="relative w-64 h-16 rounded-2xl bg-gradient-to-r from-sky-400 via-indigo-900 to-sky-300 overflow-hidden border-2 border-amber-300 shadow-inner flex items-center justify-between px-4">
          {/* Day Sun (Left) */}
          <div className="flex flex-col items-center animate-bounce">
            <span className="text-2xl drop-shadow-md">☀️</span>
            <span className="text-[9px] font-black text-amber-200 uppercase tracking-widest">Sunset</span>
          </div>

          {/* Stars & Crescent Moon (Center) */}
          <div className="flex flex-col items-center animate-pulse">
            <span className="text-2xl drop-shadow-md">🌙</span>
            <span className="text-[9px] font-black text-indigo-200 uppercase tracking-widest">Night</span>
          </div>

          {/* Morning Dawn (Right) */}
          <div className="flex flex-col items-center animate-bounce">
            <span className="text-2xl drop-shadow-md">🌅</span>
            <span className="text-[9px] font-black text-amber-200 uppercase tracking-widest">Sunrise</span>
          </div>
        </div>

        {/* ── ANTIQUE BRASS POCKET CLOCK FACE ── */}
        <div className="relative w-36 h-36 rounded-full bg-gradient-to-b from-amber-300 via-yellow-100 to-amber-400 p-2 shadow-xl border-4 border-amber-600 flex items-center justify-center">
          {/* Outer Roman/Tick Ring */}
          <div className="relative w-full h-full rounded-full bg-amber-50 border-2 border-amber-700/40 flex items-center justify-center shadow-inner">
            {/* Clock Ticks */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
              <div
                key={`tick-${deg}`}
                className="absolute w-1 h-2.5 bg-amber-800/80 rounded-full"
                style={{
                  top: '4px',
                  transformOrigin: '50% 60px',
                  transform: `rotate(${deg}deg)`,
                }}
              />
            ))}

            {/* Hour Numbers */}
            <span className="absolute top-2 text-[10px] font-black font-serif text-amber-900">12</span>
            <span className="absolute right-2 text-[10px] font-black font-serif text-amber-900">3</span>
            <span className="absolute bottom-2 text-[10px] font-black font-serif text-amber-900">6</span>
            <span className="absolute left-2 text-[10px] font-black font-serif text-amber-900">9</span>

            {/* Rapidly Spinning Hour Hand */}
            <div
              className="absolute w-1.5 h-10 bg-amber-950 rounded-full origin-bottom shadow-sm"
              style={{
                bottom: '50%',
                transform: `rotate(${handAngle * 0.25}deg)`,
              }}
            />

            {/* Rapidly Spinning Minute Hand */}
            <div
              className="absolute w-1 h-14 bg-amber-800 rounded-full origin-bottom shadow-sm"
              style={{
                bottom: '50%',
                transform: `rotate(${handAngle * 2}deg)`,
              }}
            />

            {/* Brass Center Pin */}
            <div className="w-3.5 h-3.5 rounded-full bg-amber-700 border-2 border-yellow-200 shadow-md z-10" />
          </div>
        </div>

        {/* ── DAY ADVANCEMENT BADGE & TIME COUNTER ── */}
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2 px-5 py-1.5 rounded-full bg-amber-500/20 border-2 border-amber-500 text-amber-900 font-black font-mono text-base sm:text-lg shadow-sm">
            <span>DAY {transitionState.day}</span>
            <span className="text-amber-400">|</span>
            <span>
              {String(transitionState.hour).padStart(2, '0')}:
              {String(transitionState.minute).padStart(2, '0')}{' '}
              {transitionState.hour >= 12 ? 'PM' : 'AM'}
            </span>
          </div>

          {/* Time Passage Header */}
          <span className="text-[11px] font-black uppercase tracking-widest text-amber-800">
            ⏳ TIME PASSES ON THE SMART FARM...
          </span>
        </div>

        {/* ── STAGE NOTICE BANNER (e.g. "AFTER SOME DAYS... CROPS GROWING TALL") ── */}
        {transitionState.notice && (
          <div className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 text-white font-black text-xs sm:text-sm text-center tracking-wide shadow-lg border border-emerald-300 max-w-sm">
            {transitionState.notice}
          </div>
        )}
      </div>
    </div>
  );
};
