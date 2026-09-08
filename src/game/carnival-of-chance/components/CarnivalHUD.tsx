// ============================================================
// THE GREAT CARNIVAL OF CHANCE — Top Navigation HUD
// Streamlined Header Bar with Blue Team Score, Red Team Score,
// Central Circus Marquee, Audio Toggle, and Return to Map Button
// ============================================================

'use client';

import React, { useCallback } from 'react';
import Link from 'next/link';
import { useCarnivalStore } from '../store/carnivalStore';
import { Home, Volume2, VolumeX, Maximize, MapPin, Star } from 'lucide-react';

export const CarnivalHUD: React.FC = () => {
  const activeActivity = useCarnivalStore((s) => s.activeActivity);
  const blueTeam = useCarnivalStore((s) => s.blueTeam);
  const redTeam = useCarnivalStore((s) => s.redTeam);
  const isMuted = useCarnivalStore((s) => s.isMuted);
  const toggleMute = useCarnivalStore((s) => s.toggleMute);
  const returnToHub = useCarnivalStore((s) => s.returnToHub);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  }, []);

  return (
    <header className="fixed top-2.5 inset-x-3 sm:inset-x-6 z-40 flex items-start justify-between pointer-events-none select-none">
      {/* ── LEFT: TEAM BLUE CAPSULE & HOME ── */}
      <div className="pointer-events-auto flex items-center gap-2">
        <Link
          href="/"
          title="Return to Skillizee Arcade"
          className="w-11 h-11 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-amber-300 border-2 border-amber-500/60 flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer"
        >
          <Home className="w-5 h-5" />
        </Link>

        {activeActivity !== 'hub' && (
          <button
            onClick={returnToHub}
            className="h-11 px-3.5 rounded-2xl bg-white/95 hover:bg-amber-50 text-slate-800 border-2 border-amber-400/90 shadow-lg flex items-center gap-1.5 font-black text-xs transition-transform active:scale-95 cursor-pointer"
          >
            <MapPin className="w-4 h-4 text-amber-600" />
            <span>CARNIVAL MAP</span>
          </button>
        )}

        {/* Team Blue Pill */}
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 border-3 border-amber-400 shadow-[0_6px_20px_rgba(30,58,138,0.6)] text-white">
          <div className="w-8 h-8 rounded-xl bg-blue-500/40 border border-amber-300 flex items-center justify-center font-black text-xs text-amber-300">
            B
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-200">
              {blueTeam.name}
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-300" />
              <span className="text-sm sm:text-base font-black text-white font-mono">
                {blueTeam.score.toLocaleString()} <span className="text-[10px] text-amber-300 font-sans">PTS</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── CENTER: GRAND CIRCUS CANOPY & TITLE ── */}
      <div className="pointer-events-auto flex flex-col items-center">
        <div className="px-6 sm:px-8 py-1.5 rounded-t-2xl bg-gradient-to-b from-red-600 via-red-700 to-red-800 border-t-2 border-x-2 border-amber-400 shadow-[0_6px_20px_rgba(220,38,38,0.6)] text-center">
          <h1 className="text-xs sm:text-sm md:text-base font-black uppercase tracking-wider text-amber-300 drop-shadow">
            THE GREAT CARNIVAL OF CHANCE
          </h1>
        </div>
        <div className="-mt-1 px-4 py-0.5 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 border border-amber-600 shadow-sm">
          <span className="text-[8px] sm:text-[9px] font-black tracking-widest text-slate-950 uppercase">
            EXPLORE • PREDICT • DISCOVER
          </span>
        </div>
      </div>

      {/* ── RIGHT: TEAM RED CAPSULE & CONTROLS ── */}
      <div className="pointer-events-auto flex items-center gap-2">
        {/* Team Red Pill */}
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-rose-900 via-red-800 to-red-900 border-3 border-amber-400 shadow-[0_6px_20px_rgba(185,28,28,0.6)] text-white">
          <div className="flex flex-col text-right">
            <span className="text-[10px] font-black uppercase tracking-wider text-red-200">
              {redTeam.name}
            </span>
            <div className="flex items-center justify-end gap-1">
              <span className="text-sm sm:text-base font-black text-white font-mono">
                {redTeam.score.toLocaleString()} <span className="text-[10px] text-amber-300 font-sans">PTS</span>
              </span>
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-300" />
            </div>
          </div>
          <div className="w-8 h-8 rounded-xl bg-red-500/40 border border-amber-300 flex items-center justify-center font-black text-xs text-amber-300">
            R
          </div>
        </div>

        {/* Audio Mute & Fullscreen Buttons */}
        <div className="flex items-center gap-1 bg-slate-900/90 border-2 border-amber-500/60 rounded-2xl p-1 shadow-lg">
          <button
            onClick={toggleMute}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-amber-300 hover:bg-slate-800 transition active:scale-95 cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
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
  );
};
