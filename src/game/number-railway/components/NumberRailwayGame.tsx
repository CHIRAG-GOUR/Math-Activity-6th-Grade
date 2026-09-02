// ============================================================
// THE GREAT NUMBER RAILWAY — Main Game Orchestrator
// 16:9 Classroom Touchscreen Dual-Console Architecture:
// LEFT: Blue Team Console (27%)
// CENTER: 3D High-Graphics Cartoon Railway World (46%)
// RIGHT: Red Team Console (27%)
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
  const phase = useRailwayStore((s) => s.phase);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  }, []);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-slate-950 select-none flex flex-col font-sans">
      
      {/* ── 1. Top HUD Bar (Scoreboard, Station Route, 5-Step Badges) ── */}
      <RailwayHUD />

      {/* ── 2. Live Step Loading Notification Toast ── */}
      <StepLoadingToast />

      {/* ── 3. Overlays & Dialogs ── */}
      <RailwayTitleScreen />
      <MissionBriefing />
      <StationArrivalOverlay />
      <NetworkCompleteOverlay />

      {/* ── 4. Main 3-Column Screen Composition ── */}
      <div className="flex-1 w-full h-full pt-16 flex flex-row overflow-hidden relative">
        
        {/* ── LEFT: BLUE TEAM OPERATOR CONSOLE (~27% Viewport) ── */}
        <section className="w-[27%] min-w-[320px] max-w-[420px] h-full shrink-0 z-20 shadow-2xl">
          <TeamConsole team="blue" />
        </section>

        {/* ── CENTER: SHARED 3D CARTOON RAILWAY WORLD (~46% Viewport) ── */}
        <section className="flex-1 h-full relative z-10 overflow-hidden bg-sky-300">
          <RailwayScene />

          {/* Fullscreen Toggle Button at Bottom Center */}
          <button
            onClick={toggleFullscreen}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 px-3.5 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-wider hover:bg-slate-800 transition-all shadow-lg"
          >
            ⛶ FULLSCREEN
          </button>
        </section>

        {/* ── RIGHT: RED TEAM OPERATOR CONSOLE (~27% Viewport) ── */}
        <section className="w-[27%] min-w-[320px] max-w-[420px] h-full shrink-0 z-20 shadow-2xl">
          <TeamConsole team="red" />
        </section>
      </div>
    </main>
  );
};
