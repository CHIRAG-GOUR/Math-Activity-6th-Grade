// ============================================================
// THE GREAT CARNIVAL OF CHANCE — Top Navigation HUD & Grand Header
// Pixel-perfect implementation matching the Theme Park UI:
// - Left: TEAM BLUE Conductor capsule with Star & Live Points
// - Center-Left: Wooden Plaque (ROUND 1 / 5 • Attractions Completed)
// - Center: Grand Red-and-White Circus Marquee (THE GREAT CARNIVAL OF CHANCE • EXPLORE • PREDICT • DISCOVER)
// - Center-Right: Wooden Plaque (10:00 • Time Remaining countdown)
// - Right: TEAM RED Conductor capsule with Star & Live Points
// - Bottom Helper Banner: "Team up, solve probability challenges and bring the carnival to life!"
// ============================================================

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useCarnivalStore } from '../store/carnivalStore';
import {
  Home,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Settings,
  Clock,
  Star,
} from 'lucide-react';

export const CarnivalHUD: React.FC = () => {
  const phase = useCarnivalStore((s) => s.phase);
  const activeAttractionId = useCarnivalStore((s) => s.activeAttractionId);
  const attractions = useCarnivalStore((s) => s.attractions);
  const blueTeam = useCarnivalStore((s) => s.blueTeam);
  const redTeam = useCarnivalStore((s) => s.redTeam);
  const isMuted = useCarnivalStore((s) => s.isMuted);
  const toggleMute = useCarnivalStore((s) => s.toggleMute);
  const zoomIn = useCarnivalStore((s) => s.zoomIn);
  const zoomOut = useCarnivalStore((s) => s.zoomOut);
  const resetZoom = useCarnivalStore((s) => s.resetZoom);
  const zoomLevel = useCarnivalStore((s) => s.zoomLevel);

  // 10:00 Countdown Timer
  const [secondsRemaining, setSecondsRemaining] = useState<number>(600); // 10 minutes

  useEffect(() => {
    if (phase === 'title' || phase === 'grand-celebration') return;
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [phase]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const completedCount = attractions.filter(
    (a) => a.id !== 'grand-carnival' && a.id !== 'central-plaza' && a.completed
  ).length;

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  }, []);

  if (phase === 'title') return null;

  return (
    <>
      {/* ── Top Main HUD Banner ── */}
      <header className="fixed top-2.5 inset-x-2 sm:inset-x-5 z-40 flex items-start justify-between pointer-events-none select-none">
        
        {/* ── LEFT: TEAM BLUE CAPSULE (Avatar + Star + Score) ── */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Skillizee Arcade Home Link */}
          <Link
            href="/"
            title="Return to Skillizee Arcade"
            className="w-11 h-11 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-amber-300 border-2 border-amber-500/60 flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer"
          >
            <Home className="w-5 h-5" />
          </Link>

          {/* Team Blue Pill */}
          <div className="flex items-center gap-3 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 border-3 border-amber-400/90 shadow-[0_8px_25px_rgba(30,58,138,0.7)] text-white">
            {/* Illustrated Blue Conductor Avatar */}
            <div className="relative w-10 h-10 rounded-full bg-blue-500/40 border-2 border-amber-300 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
              <svg viewBox="0 0 40 40" className="w-full h-full">
                {/* Face & Ears */}
                <circle cx="20" cy="22" r="11" fill="#fed7aa" />
                <circle cx="9" cy="22" r="2.5" fill="#fdba74" />
                <circle cx="31" cy="22" r="2.5" fill="#fdba74" />
                {/* Hair */}
                <path d="M12 18 C14 13 26 13 28 18 C26 15 14 15 12 18 Z" fill="#78350f" />
                {/* Blue Conductor Cap */}
                <path d="M9 16 C9 11 31 11 31 16 Z" fill="#1d4ed8" />
                <rect x="8" y="15" width="24" height="3" rx="1.5" fill="#f59e0b" />
                <path d="M10 18 Q20 21 30 18" stroke="#1e3a8a" strokeWidth="2" fill="none" />
                {/* Eyes & Smile */}
                <circle cx="16" cy="21" r="1.5" fill="#0f172a" />
                <circle cx="24" cy="21" r="1.5" fill="#0f172a" />
                <path d="M17 25 Q20 28 23 25" stroke="#9a3412" strokeWidth="1.5" fill="none" />
              </svg>
            </div>

            {/* Team Info & Score */}
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-200">
                {blueTeam.name}
              </span>
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-amber-400 text-amber-300 drop-shadow" />
                <span className="text-base sm:text-lg font-black tracking-tight text-white font-mono drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  {blueTeam.score.toLocaleString()} <span className="text-xs text-amber-300 font-sans">PTS</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── CENTER GROUP: ROUND PLAQUE + GRAND MARQUEE CANOPY + TIMER PLAQUE ── */}
        <div className="flex items-center gap-2 sm:gap-3 pointer-events-auto">
          
          {/* Round Counter Plaque */}
          <div className="hidden md:flex flex-col items-center justify-center px-4 py-2 rounded-2xl bg-gradient-to-b from-[#78350f] via-[#5c2306] to-[#451a03] border-3 border-amber-400 shadow-[0_6px_20px_rgba(0,0,0,0.6)] text-center min-w-[130px]">
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 drop-shadow">
              ROUND {Math.min(5, completedCount + 1)} / 5
            </span>
            <span className="text-[9px] font-bold text-amber-100/90 whitespace-nowrap">
              Attractions: {completedCount} / 6
            </span>
          </div>

          {/* Grand Circus Marquee Arch (THE GREAT CARNIVAL OF CHANCE) */}
          <div className="relative flex flex-col items-center">
            {/* Circus Canopy Peak */}
            <div className="relative z-10 px-6 sm:px-9 py-1.5 sm:py-2 rounded-t-3xl bg-gradient-to-b from-red-600 via-red-700 to-red-800 border-t-3 border-x-3 border-amber-400 shadow-[0_8px_30px_rgba(220,38,38,0.7)] text-center">
              {/* Gold Arched Title */}
              <h1 className="text-sm sm:text-lg md:text-xl font-black uppercase tracking-wider text-amber-300 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] whitespace-nowrap">
                THE GREAT CARNIVAL OF CHANCE
              </h1>
            </div>

            {/* Gold Ribbon Sash Below */}
            <div className="-mt-1 z-20 px-4 sm:px-6 py-0.5 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 border-2 border-amber-600 shadow-md">
              <span className="text-[9px] sm:text-[10px] font-black tracking-widest text-slate-950 uppercase drop-shadow-xs">
                EXPLORE • PREDICT • DISCOVER
              </span>
            </div>
          </div>

          {/* Timer Plaque */}
          <div className="hidden md:flex flex-col items-center justify-center px-4 py-2 rounded-2xl bg-gradient-to-b from-[#78350f] via-[#5c2306] to-[#451a03] border-3 border-amber-400 shadow-[0_6px_20px_rgba(0,0,0,0.6)] text-center min-w-[130px]">
            <div className="flex items-center gap-1 text-amber-300">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-xs font-black font-mono tracking-wider">
                {formatTime(secondsRemaining)}
              </span>
            </div>
            <span className="text-[9px] font-bold text-amber-100/90 whitespace-nowrap">
              Time Remaining
            </span>
          </div>
        </div>

        {/* ── RIGHT: TEAM RED CAPSULE + CONTROLS ── */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Team Red Pill */}
          <div className="flex items-center gap-3 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-rose-900 via-red-800 to-red-900 border-3 border-amber-400/90 shadow-[0_8px_25px_rgba(185,28,28,0.7)] text-white">
            {/* Team Info & Score */}
            <div className="flex flex-col text-right">
              <span className="text-[10px] font-black uppercase tracking-widest text-red-200">
                {redTeam.name}
              </span>
              <div className="flex items-center justify-end gap-1.5">
                <span className="text-base sm:text-lg font-black tracking-tight text-white font-mono drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  {redTeam.score.toLocaleString()} <span className="text-xs text-amber-300 font-sans">PTS</span>
                </span>
                <Star className="w-4 h-4 fill-amber-400 text-amber-300 drop-shadow" />
              </div>
            </div>

            {/* Illustrated Red Conductor Avatar */}
            <div className="relative w-10 h-10 rounded-full bg-red-500/40 border-2 border-amber-300 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
              <svg viewBox="0 0 40 40" className="w-full h-full">
                {/* Face & Ears */}
                <circle cx="20" cy="22" r="11" fill="#fed7aa" />
                <circle cx="9" cy="22" r="2.5" fill="#fdba74" />
                <circle cx="31" cy="22" r="2.5" fill="#fdba74" />
                {/* Hair */}
                <path d="M12 18 C14 13 26 13 28 18 C26 15 14 15 12 18 Z" fill="#451a03" />
                {/* Red Conductor Cap */}
                <path d="M9 16 C9 11 31 11 31 16 Z" fill="#dc2626" />
                <rect x="8" y="15" width="24" height="3" rx="1.5" fill="#f59e0b" />
                <path d="M10 18 Q20 21 30 18" stroke="#991b1b" strokeWidth="2" fill="none" />
                {/* Eyes & Smile */}
                <circle cx="16" cy="21" r="1.5" fill="#0f172a" />
                <circle cx="24" cy="21" r="1.5" fill="#0f172a" />
                <path d="M17 25 Q20 28 23 25" stroke="#9a3412" strokeWidth="1.5" fill="none" />
              </svg>
            </div>
          </div>

          {/* Quick Settings & Audio & Fullscreen Buttons */}
          <div className="flex items-center gap-1 bg-slate-900/90 border-2 border-amber-500/60 rounded-2xl p-1 shadow-lg">
            <button
              onClick={toggleMute}
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-amber-300 hover:bg-slate-800 transition active:scale-95 cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={toggleFullscreen}
              title="Toggle Fullscreen"
              className="w-8 h-8 rounded-xl flex items-center justify-center text-amber-300 hover:bg-slate-800 transition active:scale-95 cursor-pointer"
            >
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Bottom Helper Ribbon Plaque ── */}
      {phase === 'island-explore' && (
        <div className="fixed bottom-3.5 inset-x-0 z-30 flex justify-center pointer-events-none select-none">
          <div className="px-6 py-2 rounded-2xl bg-gradient-to-r from-amber-100 via-amber-50 to-amber-100 border-3 border-amber-400 shadow-[0_10px_30px_rgba(0,0,0,0.4)] flex items-center gap-2">
            <Star className="w-4 h-4 fill-amber-500 text-amber-600" />
            <span className="text-xs sm:text-sm font-black text-slate-800 tracking-wide text-center">
              Team up, solve probability challenges and bring the carnival to life!
            </span>
            <Star className="w-4 h-4 fill-amber-500 text-amber-600" />
          </div>
        </div>
      )}
    </>
  );
};
