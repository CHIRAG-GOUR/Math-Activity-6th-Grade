// ============================================================
// THE GREAT CARNIVAL OF CHANCE — NEUBRUTALIST TOP MARQUEE HUD
// Solid Yellow & Red Signboards with 4px Black Outlines & 6px Hard Shadows
// Left: Home + Blue Score | Center: Marquee Sign | Right: Red Score + Controls
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
    <header className="fixed top-2.5 inset-x-3 sm:inset-x-6 md:inset-x-8 z-40 h-[72px] flex items-center justify-between pointer-events-none select-none">
      {/* ── 1. LEFT: HOME / MAP BUTTON + TEAM BLUE SCORE ── */}
      <div className="pointer-events-auto flex items-center gap-2">
        {/* Navigation Button */}
        {isInsideActivity ? (
          <button
            onClick={returnToHub}
            title="Return to Carnival Island Map"
            style={{
              backgroundColor: '#FED500',
              border: '3.5px solid #000000',
              boxShadow: '4px 4px 0px #000000',
              borderRadius: '14px',
              color: '#000000',
            }}
            className="h-11 sm:h-12 px-3 sm:px-3.5 flex items-center gap-1.5 font-black text-xs cursor-pointer active:translate-x-0.5 active:translate-y-0.5 transition-transform"
          >
            <MapPin className="w-4 h-4 text-black stroke-[3]" />
            <span className="hidden md:inline font-black uppercase">MAP</span>
          </button>
        ) : (
          <Link
            href="/"
            title="Return to Skillizee Arcade"
            style={{
              backgroundColor: '#FED500',
              border: '3.5px solid #000000',
              boxShadow: '4px 4px 0px #000000',
              borderRadius: '14px',
              color: '#000000',
            }}
            className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center cursor-pointer active:translate-x-0.5 active:translate-y-0.5 transition-transform"
          >
            <Home className="w-5 h-5 stroke-[3]" />
          </Link>
        )}

        {/* Team Blue Score Signboard */}
        <TeamScoreBadge team={blueTeam} side="blue" />
      </div>

      {/* ── 2. CENTER: NEUBRUTALIST CARNIVAL MARQUEE SIGN ── */}
      <div className="pointer-events-auto flex flex-col items-center">
        <div
          style={{
            backgroundColor: isInsideActivity ? '#FED500' : '#FF2A6D',
            border: '4px solid #000000',
            boxShadow: '6px 6px 0px #000000',
            borderRadius: '18px',
            color: '#000000',
          }}
          className="px-4 sm:px-6 py-1 sm:py-1.5 text-center flex flex-col items-center"
        >
          {/* Main Title */}
          <h1 className="text-xs sm:text-sm md:text-base font-black uppercase tracking-wider text-black">
            {isInsideActivity ? meta.name : 'THE GREAT CARNIVAL OF CHANCE'}
          </h1>

          {/* Subtitle Ribbon */}
          <div
            style={{
              backgroundColor: '#C4A1FF',
              border: '2px solid #000000',
              borderRadius: '8px',
              color: '#000000',
            }}
            className="px-2.5 py-0.5 text-[8px] sm:text-[9px] font-black uppercase tracking-wider mt-0.5"
          >
            {isInsideActivity ? meta.tagline : 'EXPLORE • PREDICT • DISCOVER'}
          </div>
        </div>
      </div>

      {/* ── 3. RIGHT: TEAM RED SCORE + AUDIO & FULLSCREEN CONTROLS ── */}
      <div className="pointer-events-auto flex items-center gap-2">
        {/* Team Red Score Signboard */}
        <TeamScoreBadge team={redTeam} side="red" />

        {/* Tactile Control Buttons Box */}
        <div
          style={{
            backgroundColor: '#FED500',
            border: '3.5px solid #000000',
            boxShadow: '4px 4px 0px #000000',
            borderRadius: '14px',
          }}
          className="flex items-center gap-0.5 p-1 h-11 sm:h-12"
        >
          <button
            onClick={toggleMute}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-black hover:bg-[#FFF59D] font-black cursor-pointer active:translate-x-0.5 active:translate-y-0.5 transition-transform"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-[#FF2A6D] stroke-[3]" /> : <Volume2 className="w-4 h-4 stroke-[3]" />}
          </button>
          <button
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-black hover:bg-[#FFF59D] font-black cursor-pointer active:translate-x-0.5 active:translate-y-0.5 transition-transform"
          >
            <Maximize className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </div>
    </header>
  );
};
