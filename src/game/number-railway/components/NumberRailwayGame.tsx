// ============================================================
// THE GREAT NUMBER RAILWAY — Main Game Orchestrator
// Full-Bleed 3D World with Floating Ergonomic Touch Consoles:
// - FULLSCREEN 3D CANVAS (100% Viewport Background)
// - Floating Top HUD (Station Route, Scores, 5-Step Badges)
// - Symmetrical Floating Consoles: Team Blue (Left) & Team Red (Right)
// - Round Reveal Solution Explanation
// - Super Tie-Breaker & Game Over Celebrations
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
  RoundRevealOverlay,
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
      <RoundRevealOverlay />
      <StationArrivalOverlay />
      <NetworkCompleteOverlay />

      {/* ── 5. Floating Symmetrical Team Consoles (Bottom-Left & Bottom-Right) ── */}
      <div className="absolute inset-x-0 bottom-3 top-16 pointer-events-none px-4 flex items-end justify-between z-20">
        
        {/* ── LEFT: BLUE TEAM OPERATOR CONSOLE (270px) ── */}
        <div className="pointer-events-auto">
          <TeamConsole team="blue" />
        </div>

        {/* ── CENTER: Fullscreen Toggle Button at Bottom ── */}
        <button
          onClick={toggleFullscreen}
          className="pointer-events-auto px-3.5 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-slate-300 text-slate-800 hover:text-slate-950 text-[10px] font-black uppercase tracking-wider hover:bg-white transition-all shadow-lg cursor-pointer mb-1"
        >
          ⛶ FULLSCREEN
        </button>

        {/* ── RIGHT: RED TEAM OPERATOR CONSOLE (270px) ── */}
        <div className="pointer-events-auto">
          <TeamConsole team="red" />
        </div>
      </div>
    </main>
  );
};
