// ============================================================
// THE GREAT CARNIVAL OF CHANCE — Top Navigation HUD
// Warm, clean, classroom-friendly porcelain navigation bar:
// - Return to Island & Arcade Hub Link
// - Central Clock Progress Counter
// - Touchscreen Controls: Zoom (+/-), Sound Mute, Fullscreen
// ============================================================

import React, { useCallback } from 'react';
import Link from 'next/link';
import { useCarnivalStore } from '../store/carnivalStore';
import {
  Home,
  MapPin,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Compass,
} from 'lucide-react';

export const CarnivalHUD: React.FC = () => {
  const phase = useCarnivalStore((s) => s.phase);
  const activeAttractionId = useCarnivalStore((s) => s.activeAttractionId);
  const attractions = useCarnivalStore((s) => s.attractions);
  const returnToIsland = useCarnivalStore((s) => s.returnToIsland);
  const isMuted = useCarnivalStore((s) => s.isMuted);
  const toggleMute = useCarnivalStore((s) => s.toggleMute);
  const zoomIn = useCarnivalStore((s) => s.zoomIn);
  const zoomOut = useCarnivalStore((s) => s.zoomOut);
  const resetZoom = useCarnivalStore((s) => s.resetZoom);
  const zoomLevel = useCarnivalStore((s) => s.zoomLevel);

  const completedCount = attractions.filter(
    (a) => a.id !== 'grand-carnival' && a.id !== 'central-plaza' && a.completed
  ).length;
  const totalAttractions = 5; // 5 core attractions

  const activeAttr = attractions.find((a) => a.id === activeAttractionId);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  }, []);

  if (phase === 'title') return null;

  return (
    <header className="fixed top-2 sm:top-3 inset-x-2 sm:inset-x-6 z-40 flex items-center justify-between pointer-events-none select-none">
      {/* ── Left Navigation: Hub & Return to Island ── */}
      <div className="flex items-center gap-2 pointer-events-auto">
        <Link
          href="/"
          title="Return to Skillizee Arcade"
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white/95 backdrop-blur-md border-2 border-slate-300 hover:border-amber-400 flex items-center justify-center text-slate-700 shadow-lg transition-transform active:scale-95 cursor-pointer"
        >
          <Home className="w-5 h-5" />
        </Link>

        {phase !== 'island-explore' && (
          <button
            onClick={returnToIsland}
            className="h-10 sm:h-11 px-3 sm:px-4 rounded-2xl bg-white/95 backdrop-blur-md border-2 border-slate-300 hover:border-amber-500 shadow-lg flex items-center gap-1.5 font-black text-xs sm:text-sm text-slate-800 transition-all active:scale-95 cursor-pointer"
          >
            <MapPin className="w-4 h-4 text-amber-600" />
            <span>CARNIVAL MAP</span>
          </button>
        )}
      </div>

      {/* ── Center Header: Attraction Status & Progress Dial ── */}
      <div className="pointer-events-auto flex items-center gap-2 px-3 sm:px-5 py-1.5 sm:py-2 rounded-2xl bg-white/95 backdrop-blur-md border-2 border-slate-300 shadow-xl">
        <div className="text-center">
          <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-amber-700 flex items-center justify-center gap-1">
            <Compass className="w-3.5 h-3.5 text-amber-600" />
            <span>
              {phase === 'island-explore'
                ? 'CHOOSE AN ATTRACTION'
                : activeAttr?.name || 'THE GREAT CARNIVAL OF CHANCE'}
            </span>
          </div>
          <div className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
            {completedCount} / {totalAttractions} ATTRACTIONS COMPLETE
          </div>
        </div>

        {/* 5 Physical Carnival Progress Tokens */}
        <div className="flex items-center gap-1 ml-2 pl-2 border-l border-slate-200">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              title={`Attraction ${i + 1}`}
              className={`w-3 h-3 rounded-full border transition-all ${
                i < completedCount
                  ? 'bg-amber-400 border-amber-600 shadow-xs'
                  : 'bg-slate-200 border-slate-300 opacity-60'
              }`}
            />
          ))}
        </div>
      </div>

      {/* ── Right Controls: Zoom, Mute, Fullscreen ── */}
      <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
        {/* Zoom Controls */}
        <div className="hidden xs:flex items-center bg-white/95 backdrop-blur-md border-2 border-slate-300 rounded-2xl shadow-lg p-0.5">
          <button
            onClick={zoomIn}
            title="Zoom In"
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-slate-700 hover:text-amber-600 active:scale-90 transition cursor-pointer"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={resetZoom}
            title="Reset Zoom"
            className="text-[10px] font-black px-1.5 text-slate-600 hover:text-slate-900 active:scale-90 transition cursor-pointer"
          >
            {Math.round(zoomLevel * 100)}%
          </button>
          <button
            onClick={zoomOut}
            title="Zoom Out"
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-slate-700 hover:text-amber-600 active:scale-90 transition cursor-pointer"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>

        {/* Mute Toggle */}
        <button
          onClick={toggleMute}
          title={isMuted ? 'Unmute' : 'Mute Sound'}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white/95 backdrop-blur-md border-2 border-slate-300 hover:border-amber-400 flex items-center justify-center text-slate-700 shadow-lg active:scale-95 transition cursor-pointer"
        >
          {isMuted ? <VolumeX className="w-5 h-5 text-red-500" /> : <Volume2 className="w-5 h-5" />}
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          title="Toggle Fullscreen"
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white/95 backdrop-blur-md border-2 border-slate-300 hover:border-amber-400 flex items-center justify-center text-slate-700 shadow-lg active:scale-95 transition cursor-pointer"
        >
          <Maximize className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
