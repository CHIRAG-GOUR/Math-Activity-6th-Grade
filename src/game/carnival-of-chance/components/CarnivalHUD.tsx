// ============================================================
// THE GREAT CARNIVAL OF CHANCE — Neo-Brutalist Carnival HUD
// Bold High-Contrast Yellow, Red & Black Arcade Header Bar
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
          className="w-11 h-11 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black border-3 border-black flex items-center justify-center shadow-[3px_3px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_#000000] transition-all cursor-pointer active:scale-95"
        >
          <Home className="w-5 h-5 stroke-[2.5]" />
        </Link>

        {activeActivity !== 'hub' && (
          <button
            onClick={returnToHub}
            className="h-11 px-3.5 rounded-xl bg-white hover:bg-amber-100 text-black border-3 border-black shadow-[3px_3px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_#000000] flex items-center gap-1.5 font-black text-xs transition-all cursor-pointer active:scale-95"
          >
            <MapPin className="w-4 h-4 text-red-600 stroke-[2.5]" />
            <span>CARNIVAL MAP</span>
          </button>
        )}

        {/* Team Blue Pill */}
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-blue-600 border-3 border-black shadow-[4px_4px_0px_#000000] text-white">
          <div className="w-8 h-8 rounded-lg bg-yellow-400 border-2 border-black flex items-center justify-center font-black text-sm text-black shadow-xs">
            B
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-100">
              {blueTeam.name}
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-yellow-300 text-yellow-400 stroke-black stroke-1" />
              <span className="text-sm sm:text-base font-black text-white font-mono">
                {blueTeam.score.toLocaleString()} <span className="text-[10px] text-yellow-300 font-sans">PTS</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── CENTER: NEO-BRUTALIST CIRCUS MARQUEE ── */}
      <div className="pointer-events-auto flex flex-col items-center">
        <div className="px-5 sm:px-7 py-1.5 rounded-t-xl bg-red-600 border-3 border-black shadow-[4px_4px_0px_#000000] text-center">
          <h1 className="text-xs sm:text-sm md:text-base font-black uppercase tracking-wider text-yellow-300 drop-shadow-xs">
            THE GREAT CARNIVAL OF CHANCE
          </h1>
        </div>
        <div className="-mt-1 px-4 py-0.5 rounded-b-lg bg-yellow-400 border-x-3 border-b-3 border-black shadow-xs">
          <span className="text-[8px] sm:text-[9px] font-black tracking-widest text-black uppercase">
            EXPLORE • PREDICT • DISCOVER
          </span>
        </div>
      </div>

      {/* ── RIGHT: TEAM RED CAPSULE & CONTROLS ── */}
      <div className="pointer-events-auto flex items-center gap-2">
        {/* Team Red Pill */}
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-red-600 border-3 border-black shadow-[4px_4px_0px_#000000] text-white">
          <div className="flex flex-col text-right">
            <span className="text-[10px] font-black uppercase tracking-wider text-red-100">
              {redTeam.name}
            </span>
            <div className="flex items-center justify-end gap-1">
              <span className="text-sm sm:text-base font-black text-white font-mono">
                {redTeam.score.toLocaleString()} <span className="text-[10px] text-yellow-300 font-sans">PTS</span>
              </span>
              <Star className="w-3.5 h-3.5 fill-yellow-300 text-yellow-400 stroke-black stroke-1" />
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-yellow-400 border-2 border-black flex items-center justify-center font-black text-sm text-black shadow-xs">
            R
          </div>
        </div>

        {/* Audio Mute & Fullscreen Buttons */}
        <div className="flex items-center gap-1 bg-yellow-400 border-3 border-black rounded-xl p-1 shadow-[3px_3px_0px_#000000]">
          <button
            onClick={toggleMute}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-black hover:bg-yellow-300 transition active:scale-95 cursor-pointer font-black"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-700" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-black hover:bg-yellow-300 transition active:scale-95 cursor-pointer font-black"
          >
            <Maximize className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
