// ============================================================
// THE GREAT CARNIVAL OF CHANCE — DYNAMIC TOP HUD
// - On Island Hub: Full Marquee Navigation (Scores + Hub Title + Controls)
// - Inside Activity: Dynamic Single Center Plaque (Map + Activity Name) + Top-Right Audio/FS
// Strictly Neo-Brutalist: Yellow with Black, Red with White & Black
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

  const isInsideActivity = activeActivity !== 'hub';
  const meta = CARNIVAL_THEME.activityAccents[activeActivity] || CARNIVAL_THEME.activityAccents.hub;

  // ═══════════════════════════════════════════════════════════════
  // MODE 1: INSIDE ACTIVITY — 1 CENTER PLAQUE + TOP-RIGHT CONTROLS ONLY
  // ═══════════════════════════════════════════════════════════════
  if (isInsideActivity) {
    return (
      <>
        {/* ── 1. MIDDLE TOP: EXACTLY ONE PROPERLY DEFINED UNIFIED CARD ── */}
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-40 pointer-events-auto select-none">
          <div
            style={{
              backgroundColor: '#FED500',
              border: '4px solid #000000',
              boxShadow: '5px 5px 0px #000000',
              borderRadius: '18px',
            }}
            className="flex items-center gap-3 px-4 py-2"
          >
            {/* Return to Map/Island Button */}
            <button
              onClick={returnToHub}
              title="Return to Carnival Island"
              style={{
                backgroundColor: '#FF2A6D',
                border: '2.5px solid #000000',
                boxShadow: '2px 2px 0px #000000',
                borderRadius: '10px',
                color: '#FFFFFF',
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 font-black text-xs cursor-pointer active:scale-95 transition-transform shrink-0"
            >
              <MapPin className="w-4 h-4 stroke-[3] text-white" />
              <span className="font-black uppercase tracking-wider">ISLAND</span>
            </button>

            {/* Divider */}
            <div className="w-[2.5px] h-7 bg-black rounded-full shrink-0" />

            {/* Activity Name & Tagline */}
            <div className="text-left leading-tight pr-1">
              <h1 className="text-xs sm:text-sm md:text-base font-black uppercase tracking-wider text-black">
                {meta.name}
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  style={{
                    backgroundColor: '#FF2A6D',
                    border: '1.5px solid #000000',
                    borderRadius: '6px',
                    color: '#FFFFFF',
                  }}
                  className="px-1.5 py-0.2 text-[8px] font-black uppercase tracking-wider"
                >
                  GRADE 6 PROBABILITY
                </span>
                <span className="text-[9px] font-black uppercase tracking-wider text-black opacity-80">
                  {meta.subtitle}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── 2. TOP RIGHT: MUSIC & FULLSCREEN BUTTONS ONLY ── */}
        <div className="fixed top-3 right-4 z-40 pointer-events-auto select-none">
          <div
            style={{
              backgroundColor: '#FED500',
              border: '3.5px solid #000000',
              boxShadow: '4px 4px 0px #000000',
              borderRadius: '16px',
            }}
            className="flex items-center gap-1 p-1"
          >
            <button
              onClick={toggleMute}
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              style={{
                backgroundColor: isMuted ? '#FF2A6D' : '#FFFFFF',
                border: '2px solid #000000',
                borderRadius: '10px',
                color: isMuted ? '#FFFFFF' : '#000000',
              }}
              className="w-8 h-8 flex items-center justify-center font-black cursor-pointer active:scale-95 transition-transform"
            >
              {isMuted ? <VolumeX className="w-4 h-4 stroke-[3] text-white" /> : <Volume2 className="w-4 h-4 stroke-[3] text-black" />}
            </button>
            <button
              onClick={toggleFullscreen}
              title="Toggle Fullscreen"
              style={{
                backgroundColor: '#FFFFFF',
                border: '2px solid #000000',
                borderRadius: '10px',
                color: '#000000',
              }}
              className="w-8 h-8 flex items-center justify-center font-black cursor-pointer active:scale-95 transition-transform"
            >
              <Maximize className="w-4 h-4 stroke-[3] text-black" />
            </button>
          </div>
        </div>
      </>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // MODE 2: ISLAND HUB — FULL CARNIVAL MARQUEE HUD
  // ═══════════════════════════════════════════════════════════════
  return (
    <header className="fixed top-2.5 inset-x-3 sm:inset-x-6 md:inset-x-8 z-40 h-[72px] flex items-center justify-between pointer-events-none select-none">
      {/* ── 1. LEFT: HOME + TEAM BLUE SCORE ── */}
      <div className="pointer-events-auto flex items-center gap-2">
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
          className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
        >
          <Home className="w-5 h-5 stroke-[3]" />
        </Link>
        <TeamScoreBadge team={blueTeam} side="blue" />
      </div>

      {/* ── 2. CENTER: CARNIVAL ISLAND MARQUEE ── */}
      <div className="pointer-events-auto flex flex-col items-center">
        <div
          style={{
            backgroundColor: '#FED500',
            border: '4px solid #000000',
            boxShadow: '6px 6px 0px #000000',
            borderRadius: '18px',
            color: '#000000',
          }}
          className="px-5 sm:px-7 py-1.5 text-center flex flex-col items-center"
        >
          <h1 className="text-xs sm:text-sm md:text-base font-black uppercase tracking-wider text-black">
            THE GREAT CARNIVAL OF CHANCE
          </h1>
          <div
            style={{
              backgroundColor: '#FF2A6D',
              border: '2px solid #000000',
              borderRadius: '8px',
              color: '#FFFFFF',
            }}
            className="px-2.5 py-0.2 text-[8px] sm:text-[9px] font-black uppercase tracking-wider mt-0.5"
          >
            EXPLORE • PREDICT • DISCOVER
          </div>
        </div>
      </div>

      {/* ── 3. RIGHT: TEAM RED SCORE + CONTROLS ── */}
      <div className="pointer-events-auto flex items-center gap-2">
        <TeamScoreBadge team={redTeam} side="red" />

        <div
          style={{
            backgroundColor: '#FED500',
            border: '3.5px solid #000000',
            boxShadow: '4px 4px 0px #000000',
            borderRadius: '14px',
          }}
          className="flex items-center gap-1 p-1 h-11 sm:h-12"
        >
          <button
            onClick={toggleMute}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            style={{
              backgroundColor: isMuted ? '#FF2A6D' : '#FFFFFF',
              border: '2px solid #000000',
              borderRadius: '8px',
              color: isMuted ? '#FFFFFF' : '#000000',
            }}
            className="w-8 h-8 flex items-center justify-center font-black cursor-pointer active:scale-95 transition-transform"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-white stroke-[3]" /> : <Volume2 className="w-4 h-4 stroke-[3] text-black" />}
          </button>
          <button
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
            style={{
              backgroundColor: '#FFFFFF',
              border: '2px solid #000000',
              borderRadius: '8px',
              color: '#000000',
            }}
            className="w-8 h-8 flex items-center justify-center font-black cursor-pointer active:scale-95 transition-transform"
          >
            <Maximize className="w-4 h-4 stroke-[3] text-black" />
          </button>
        </div>
      </div>
    </header>
  );
};
