// ============================================================
// THE GREAT CARNIVAL OF CHANCE — COMIC-BOOK CARNIVAL MARQUEE HUD
// 100% Solid Opaque Signboards, 5px Black Outlines, 6px Hard Shadows
// Left: Home + Blue Score | Center: Marquee Sign | Right: Red Score + Audio
// ============================================================

'use client';

import React, { useCallback } from 'react';
import Link from 'next/link';
import { useCarnivalStore } from '../store/carnivalStore';
import { CARNIVAL_THEME } from './tokens';
import { TeamScoreBadge } from './TeamScoreBadge';
import { Home, MapPin, Volume2, VolumeX, Maximize } from 'lucide-react';

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

  const meta = CARNIVAL_THEME.activityAccents[activeActivity] || CARNIVAL_THEME.activityAccents.hub;
  const isInsideActivity = activeActivity !== 'hub';

  return (
    <header className="fixed top-3 inset-x-4 sm:inset-x-8 z-40 h-[80px] flex items-center justify-between pointer-events-none select-none">
      {/* ── 1. LEFT: HOME / MAP BUTTON + TEAM BLUE SCORE ── */}
      <div className="pointer-events-auto flex items-center gap-2.5">
        {/* Navigation Button */}
        {isInsideActivity ? (
          <button
            onClick={returnToHub}
            title="Return to Carnival Island Map"
            className="h-14 px-3.5 rounded-[18px] bg-[#FFF7E5] hover:bg-[#FFE58F] text-[#111111] border-[5px] border-[#111111] shadow-[6px_6px_0px_#111111] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#111111] flex items-center gap-2 font-black text-xs cursor-pointer transition-transform"
          >
            <MapPin className="w-5 h-5 text-[#E53935] stroke-[3]" />
            <span className="hidden sm:inline font-black uppercase">ISLAND MAP</span>
          </button>
        ) : (
          <Link
            href="/"
            title="Return to Skillizee Arcade"
            className="w-14 h-14 rounded-[18px] bg-[#FFC928] hover:bg-[#FFE58F] text-[#111111] border-[5px] border-[#111111] shadow-[6px_6px_0px_#111111] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#111111] flex items-center justify-center cursor-pointer transition-transform"
          >
            <Home className="w-6 h-6 stroke-[3]" />
          </Link>
        )}

        {/* Team Blue Score Signboard */}
        <TeamScoreBadge team={blueTeam} side="blue" />
      </div>

      {/* ── 2. CENTER: COMIC-BOOK CARNIVAL MARQUEE SIGNBOARD ── */}
      <div className="pointer-events-auto flex flex-col items-center">
        <div
          className={`px-6 sm:px-8 py-2 rounded-[20px] border-[5px] border-[#111111] shadow-[6px_6px_0px_#111111] text-center flex flex-col items-center ${
            isInsideActivity ? 'bg-[#FFC928]' : 'bg-[#E53935]'
          }`}
        >
          {/* Main Title */}
          <h1
            className={`text-sm sm:text-base md:text-lg font-black uppercase tracking-wider ${
              isInsideActivity ? 'text-[#111111]' : 'text-[#FFC928]'
            }`}
          >
            {isInsideActivity ? meta.name : 'THE GREAT CARNIVAL OF CHANCE'}
          </h1>

          {/* Subtitle Ribbon */}
          <div
            className={`px-3 py-0.5 rounded-lg border-2 border-[#111111] text-[9px] sm:text-[10px] font-black tracking-widest uppercase mt-0.5 shadow-[2px_2px_0px_#111111] ${
              isInsideActivity ? 'bg-[#E53935] text-[#FFF7E5]' : 'bg-[#FFC928] text-[#111111]'
            }`}
          >
            {isInsideActivity ? meta.tagline : 'EXPLORE • PREDICT • DISCOVER'}
          </div>
        </div>
      </div>

      {/* ── 3. RIGHT: TEAM RED SCORE + AUDIO & FULLSCREEN CONTROLS ── */}
      <div className="pointer-events-auto flex items-center gap-2.5">
        {/* Team Red Score Signboard */}
        <TeamScoreBadge team={redTeam} side="red" />

        {/* Tactile Control Buttons Box */}
        <div className="flex items-center gap-1 bg-[#FFC928] border-[5px] border-[#111111] rounded-[18px] p-1 shadow-[6px_6px_0px_#111111] h-14">
          <button
            onClick={toggleMute}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-[#111111] hover:bg-[#FFE58F] font-black cursor-pointer transition-transform active:translate-x-0.5 active:translate-y-0.5"
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-[#E53935] stroke-[3]" /> : <Volume2 className="w-5 h-5 stroke-[3]" />}
          </button>
          <button
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
            className="w-10 h-10 rounded-xl flex items-center justify-center text-[#111111] hover:bg-[#FFE58F] font-black cursor-pointer transition-transform active:translate-x-0.5 active:translate-y-0.5"
          >
            <Maximize className="w-5 h-5 stroke-[3]" />
          </button>
        </div>
      </div>
    </header>
  );
};
