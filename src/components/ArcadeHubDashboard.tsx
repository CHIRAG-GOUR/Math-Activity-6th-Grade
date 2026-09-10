'use client';

// ============================================================
// SKILLIZEE ARCADE — 3D Interactive Retro Arcade Lobby Dashboard
// Seamless Three.js 3D Arcade Arena with:
// - Physical 3D Cabinets in rich custom activity themes & colors
// - Multi-Page / Multi-Wing Arcade Hall Support (Banks of 4 Machines)
// - Floating Left & Right Navigation Arrows to travel between wings
// - Overhead compact Name & Topic cards for instant readability
// - Direct 3D Click-to-Play interaction
// - Clean unified bottom dock bar with wing switchers & audio controls
// ============================================================

import React, { useState, useEffect, useCallback } from 'react';
import {
  Gamepad2,
  Maximize,
  Minimize,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { ArcadeLobbyScene, ARCADE_CABINET_DATA, MACHINES_PER_PAGE } from './ArcadeLobbyScene';
import { soundManager } from '@/utils/audio';
import { useRouter } from 'next/navigation';

export const ArcadeHubDashboard: React.FC = () => {
  const router = useRouter();
  const [activePage, setActivePage] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(soundManager.getMuted());

  // Multi-wing exploration enabled for Wing 1 (Games 1-4) and Wing 2 (Game 5 Equation Mission Control)
  const ENABLE_FUTURE_WINGS_EXPLORATION = true;
  const totalPages = Math.ceil(ARCADE_CABINET_DATA.length / MACHINES_PER_PAGE);

  const goToNextPage = useCallback(() => {
    soundManager.playClick();
    setActivePage((prev) => {
      const next = Math.min(prev + 1, totalPages - 1);
      setSelectedCategory('all');
      return next;
    });
  }, [totalPages]);

  const goToPrevPage = useCallback(() => {
    soundManager.playClick();
    setActivePage((prev) => {
      const prevPage = Math.max(prev - 1, 0);
      setSelectedCategory('all');
      return prevPage;
    });
  }, []);

  // Keyboard Navigation: Left and Right arrows to switch wings (when enabled)
  useEffect(() => {
    if (!ENABLE_FUTURE_WINGS_EXPLORATION) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        goToNextPage();
      } else if (e.key === 'ArrowLeft') {
        goToPrevPage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [ENABLE_FUTURE_WINGS_EXPLORATION, goToNextPage, goToPrevPage]);

  // Fullscreen Listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      soundManager.stopBgm();
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    soundManager.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const toggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  // Machines on current active wing
  const currentWingCabinets = ARCADE_CABINET_DATA.slice(
    activePage * MACHINES_PER_PAGE,
    (activePage + 1) * MACHINES_PER_PAGE
  );

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#fffbeb] select-none text-slate-800 flex flex-col justify-between">
      
      {/* ── 3D RETRO ARCADE ARENA WITH MULTI-WING SUPPORT ── */}
      <ArcadeLobbyScene
        activePage={activePage}
        selectedCategory={selectedCategory}
        onSelectCabinet={(id) => {
          const target = ARCADE_CABINET_DATA.find((c) => c.id === id);
          if (target && target.status === 'active' && target.route !== '#') {
            soundManager.playArcadeGameStart();
            setTimeout(() => router.push(target.route), 260);
          } else {
            soundManager.playClick();
          }
        }}
      />

      {/* ── FLOATING LEFT NAVIGATION ARROW (PREVIOUS WING) ── */}
      {activePage > 0 && (
        <button
          onClick={goToPrevPage}
          className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 group flex items-center gap-2 p-2 sm:p-3 rounded-2xl bg-white/90 hover:bg-white backdrop-blur-md border-2 border-amber-400 text-slate-900 shadow-xl transition-all duration-300 transform hover:scale-110 hover:-translate-x-1 cursor-pointer"
          title="Go to Previous Wing"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-md group-hover:bg-amber-400 transition-colors">
            <ChevronLeft className="w-6 h-6 stroke-[3]" />
          </div>
          <div className="text-left hidden md:block pr-2">
            <div className="text-[9px] font-black font-game text-amber-700 uppercase tracking-widest leading-none">
              PREV WING
            </div>
            <div className="text-xs font-black font-bank uppercase tracking-wider text-slate-950 leading-tight">
              MACHINES 01 - 04
            </div>
          </div>
        </button>
      )}

      {/* ── FLOATING RIGHT NAVIGATION ARROW (NEXT WING) ── */}
      {activePage < totalPages - 1 && (
        <button
          onClick={goToNextPage}
          className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 group flex items-center gap-2 p-2 sm:p-3 rounded-2xl bg-white/90 hover:bg-white backdrop-blur-md border-2 border-amber-400 text-slate-900 shadow-xl transition-all duration-300 transform hover:scale-110 hover:translate-x-1 cursor-pointer animate-pulse hover:animate-none"
          title="Go to Next Arcade Machines"
        >
          <div className="text-right hidden md:block pl-2">
            <div className="text-[9px] font-black font-game text-amber-700 uppercase tracking-widest leading-none">
              NEXT WING
            </div>
            <div className="text-xs font-black font-bank uppercase tracking-wider text-slate-950 leading-tight">
              MACHINES 05 - 08
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center shadow-md group-hover:from-yellow-400 group-hover:to-amber-500 transition-colors">
            <ChevronRight className="w-6 h-6 stroke-[3]" />
          </div>
        </button>
      )}

      {/* ── TOP OPEN VIEWPORT ── */}
      <div className="flex-1 pointer-events-none" />

      {/* ── UNIFIED BOTTOM NAVIGATION DOCK ── */}
      <footer className="relative z-30 w-full max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 border-t-2 border-amber-400/60 bg-white/95 backdrop-blur-md rounded-t-3xl text-xs font-game tracking-wider text-slate-700 shadow-2xl pointer-events-auto mb-1">
        
        {/* Left: Branding & Wing Badges */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 p-0.5 shadow-md flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[9px] flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-black font-bank uppercase tracking-wider text-slate-950 leading-none">
                SKILLIZEE <span className="text-amber-600">3D ARCADE</span>
              </h1>
              <span className="px-1.5 py-0.5 rounded-md bg-amber-100 border border-amber-400 text-amber-900 text-[9px] font-black font-game uppercase tracking-widest shadow-xs">
                GRADE 6
              </span>
            </div>
            <p className="text-[9px] text-slate-500 font-game hidden lg:block mt-0.5">
              Explore 3D arcade machines & duels
            </p>
          </div>
        </div>

        {/* Center: All Arcade Games with Full Titles & Proper Math Topics */}
        <div className="flex-1 flex items-center gap-1.5 bg-amber-50/90 p-1.5 rounded-2xl border border-amber-300 shadow-inner overflow-x-auto scrollbar-thin min-w-0">
          
          {/* Wing Selector Tabs */}
          {totalPages > 1 && (
            <div className="flex items-center gap-1 border-r border-amber-300/80 pr-2 mr-1 shrink-0">
              {Array.from({ length: totalPages }).map((_, pIdx) => (
                <button
                  key={`wing-${pIdx}`}
                  onClick={() => {
                    soundManager.playClick();
                    setActivePage(pIdx);
                    setSelectedCategory('all');
                  }}
                  className={`px-2 py-1 rounded-lg text-[10px] font-black font-game uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                    activePage === pIdx
                      ? 'bg-slate-950 text-amber-400 shadow-sm'
                      : 'bg-white/80 text-slate-600 hover:bg-white hover:text-slate-950'
                  }`}
                >
                  WING {pIdx + 1}
                </button>
              ))}
            </div>
          )}

          {/* ALL Overview Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              setSelectedCategory('all');
            }}
            className={`px-2.5 py-1.5 rounded-xl text-[10px] font-black font-game uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1 ${
              selectedCategory === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                : 'bg-white/70 text-slate-700 hover:bg-white hover:text-slate-950 border border-slate-200'
            }`}
          >
            <span>🎮</span> ALL
          </button>

          {/* ALL Arcade Games with Proper Names & Math Topics */}
          {ARCADE_CABINET_DATA.map((cab, idx) => {
            const isSelected = selectedCategory === `#${cab.number}`;
            const targetWing = Math.floor(idx / MACHINES_PER_PAGE);

            // Clean, friendly title & topic display names
            const displayTitle =
              cab.id === 'math-escape-vault'
                ? 'Math Escape Vault'
                : cab.id === 'number-railway'
                ? 'Number Railway'
                : cab.id === 'carnival-of-chance'
                ? 'Carnival of Chance'
                : cab.id === 'blueprint-blitz'
                ? 'Blueprint Blitz'
                : cab.id === 'equation-mission-control'
                ? 'Equation Mission Control'
                : cab.status === 'planned'
                ? 'Coming Soon'
                : cab.title;

            const topicLabel =
              cab.id === 'math-escape-vault'
                ? 'Place Value & Decimals'
                : cab.id === 'number-railway'
                ? 'Operations & Rounding'
                : cab.id === 'carnival-of-chance'
                ? 'Probability'
                : cab.id === 'blueprint-blitz'
                ? 'Shapes, Area & Volume'
                : cab.id === 'equation-mission-control'
                ? 'Expressions & Equations'
                : cab.status === 'planned'
                ? 'Planned Duel'
                : cab.topic;

            return (
              <button
                key={cab.id}
                onClick={() => {
                  if (isSelected && cab.status === 'active' && cab.route !== '#') {
                    soundManager.playArcadeGameStart();
                    setTimeout(() => router.push(cab.route), 260);
                  } else {
                    soundManager.playClick();
                    setActivePage(targetWing);
                    setSelectedCategory(`#${cab.number}`);
                  }
                }}
                title={cab.status === 'active' ? `Select ${displayTitle} (${topicLabel})` : `${displayTitle} (Coming Soon)`}
                className={`px-2.5 py-1.5 rounded-xl text-[10.5px] font-black font-game transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 border-amber-600 shadow-md scale-[1.02]'
                    : 'bg-white/90 text-slate-800 border-slate-200 hover:bg-white hover:border-amber-400 hover:text-slate-950'
                }`}
              >
                {/* Cabinet Number Badge */}
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[9px] font-black ${
                    isSelected
                      ? 'bg-slate-950 text-amber-300'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  #{cab.number}
                </span>

                {/* Game Full Name */}
                <span className="font-extrabold uppercase tracking-tight">
                  {displayTitle}
                </span>

                {/* Proper Math Topic Pill */}
                <span
                  className={`px-2 py-0.5 rounded-full text-[8.5px] font-bold uppercase tracking-wider ${
                    isSelected
                      ? 'bg-slate-900/15 text-slate-950 border border-slate-900/20'
                      : 'bg-amber-100/90 text-amber-900 border border-amber-300/70'
                  }`}
                >
                  {topicLabel}
                </span>

                {/* Active Play Indicator */}
                {cab.status === 'active' && isSelected && (
                  <span className="text-[8.5px] font-black text-emerald-950 bg-emerald-300 px-1.5 py-0.5 rounded-md ml-0.5 animate-pulse">
                    PLAY →
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right: Sound & Fullscreen Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            className="p-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 transition shadow cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-amber-600" />}
          </button>

          <button
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
            className="p-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 transition shadow cursor-pointer"
          >
            {isFullscreen ? <Minimize className="w-4 h-4 text-purple-600" /> : <Maximize className="w-4 h-4 text-purple-600" />}
          </button>
        </div>

      </footer>

    </main>
  );
};
