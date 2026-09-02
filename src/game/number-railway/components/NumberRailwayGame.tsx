// ============================================================
// THE GREAT NUMBER RAILWAY — Main Game Orchestrator
// Full-Bleed 3D World with Floating Ergonomic Touch Consoles:
// - FULLSCREEN 3D CANVAS (100% Viewport Background)
// - Floating Top HUD (Station Route, Scores, 5-Step Badges)
// - Floating Left Console: Team Blue (265px, Bottom-Left)
// - Floating Right Console: Team Red (265px, Bottom-Right)
// - ~75% Unobstructed Center Viewport for 3D Train & Station!
// ============================================================

'use client';

import React, { useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useRailwayStore } from '../store/railwayStore';
import { TeamConsole } from './TeamConsole';
import { RailwayHUD } from './RailwayHUD';
import {
  RailwayTitleScreen,
  MissionBriefing,
  StationArrivalOverlay,
  StepLoadingToast,
  NetworkCompleteOverlay,
} from './RailwayOverlays';

// Disable SSR for 3D Three.js canvas
const RailwayScene = dynamic(
  () => import('../world/RailwayScene').then((m) => ({ default: m.RailwayScene })),
  { ssr: false }
);

export const NumberRailwayGame: React.FC = () => {
  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  }, []);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-sky-300 select-none font-sans">
      
      {/* ── 1. FULL-BLEED 3D CARTOON RAILWAY WORLD (100% Canvas Background) ── */}
      <div className="absolute inset-0 z-0">
        <RailwayScene />
      </div>

      {/* ── 2. Floating Top HUD Bar ── */}
      <RailwayHUD />

      {/* ── 3. Live Step Loading Notification Toast ── */}
      <StepLoadingToast />

      {/* ── 4. Fullscreen Overlays & Modals ── */}
      <RailwayTitleScreen />
      <MissionBriefing />
      <StationArrivalOverlay />
      <NetworkCompleteOverlay />

      {/* ── 5. Floating Team Consoles (Bottom-Left & Bottom-Right) ── */}
      <div className="absolute inset-x-0 bottom-4 top-18 pointer-events-none px-4 flex items-end justify-between z-20">
        
        {/* ── LEFT: BLUE TEAM OPERATOR CONSOLE ── */}
        <div className="pointer-events-auto">
          <TeamConsole team="blue" />
        </div>

        {/* ── CENTER: Fullscreen Toggle Button at Bottom ── */}
        <button
          onClick={toggleFullscreen}
          className="pointer-events-auto px-3 py-1 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200 text-slate-700 hover:text-slate-950 text-[10px] font-black uppercase tracking-wider hover:bg-white transition-all shadow-md cursor-pointer mb-1"
        >
          ⛶ FULLSCREEN
        </button>

        {/* ── RIGHT: RED TEAM OPERATOR CONSOLE ── */}
        <div className="pointer-events-auto">
          <TeamConsole team="red" />
        </div>
      </div>
    </main>
  );
};
