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

  // Keyboard Navigation: Left and Right arrows to switch wings
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        goToNextPage();
      } else if (e.key === 'ArrowLeft') {
        goToPrevPage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNextPage, goToPrevPage]);

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
          if (id === 'math-escape-vault') router.push('/math-vault');
          else if (id === 'number-railway') router.push('/number-railway');
          else if (id === 'carnival-of-chance') router.push('/carnival-of-chance');
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
          title="Go to Next 4 Arcade Machines"
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
      <footer className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 border-t-2 border-amber-400/60 bg-white/95 backdrop-blur-md rounded-t-3xl text-xs font-game tracking-wider text-slate-700 shadow-2xl pointer-events-auto mb-1">
        
        {/* Left: Branding & Wing Badges */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 p-0.5 shadow-md flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[9px] flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-black font-bank uppercase tracking-wider text-slate-950">
                SKILLIZEE <span className="text-amber-600">3D ARCADE</span>
              </h1>
              <span className="px-2 py-0.5 rounded-md bg-amber-100 border border-amber-400 text-amber-900 text-[10px] font-black font-game uppercase tracking-widest shadow-sm">
                GRADE 6
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-game hidden sm:block">
              Use side arrows or click machines to explore
            </p>
          </div>
        </div>

        {/* Center: Wing Switcher & Machine Filter Pills */}
        <div className="flex items-center gap-2 bg-amber-50/90 p-1 rounded-2xl border border-amber-300 shadow-inner overflow-x-auto">
          
          {/* Wing Selector Tabs */}
          <div className="flex items-center gap-1 border-r border-amber-300/80 pr-2 mr-1">
            {Array.from({ length: totalPages }).map((_, pIdx) => (
              <button
                key={`wing-${pIdx}`}
                onClick={() => {
                  soundManager.playClick();
                  setActivePage(pIdx);
                  setSelectedCategory('all');
                }}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-black font-game uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                  activePage === pIdx
                    ? 'bg-slate-950 text-amber-400 shadow-sm'
                    : 'bg-white/80 text-slate-600 hover:bg-white hover:text-slate-950'
                }`}
              >
                WING {pIdx + 1}
              </button>
            ))}
          </div>

          {/* Current Wing Category Pills */}
          <button
            onClick={() => {
              soundManager.playClick();
              setSelectedCategory('all');
            }}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-black font-game uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-700 hover:bg-white hover:text-slate-950'
            }`}
          >
            ALL
          </button>

          {currentWingCabinets.map((cab) => (
            <button
              key={cab.id}
              onClick={() => {
                soundManager.playClick();
                setSelectedCategory(`#${cab.number}`);
              }}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-black font-game uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === `#${cab.number}`
                  ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold scale-105'
                  : 'text-slate-700 hover:bg-white hover:text-slate-950'
              }`}
            >
              #{cab.number} {cab.title.split(' ')[0]}
            </button>
          ))}
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
