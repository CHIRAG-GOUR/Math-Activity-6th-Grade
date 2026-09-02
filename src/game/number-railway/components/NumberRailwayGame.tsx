// ============================================================
// THE GREAT NUMBER RAILWAY — Main Orchestrator
// Full-Bleed 3D World with Floating Symmetrical Consoles:
// - FULLSCREEN 3D CANVAS (100% Viewport Background)
// - Floating Top HUD (Scores, Stage & Progressive Green Signals)
// - Symmetrical Consoles: Team Blue (Left, 270px) & Team Red (Right, 270px)
// - Turn-based First-Answerer & Rebound support
// - Light Porcelain Overlays & Solution Reveals
// ============================================================

'use client';

import React, { useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useRailwayStore } from '../store/railwayStore';
import { TeamConsole } from './TeamConsole';
import { RailwayHUD } from './RailwayHUD';
import {
  RailwayTitleScreen,
  RoundIntroModal,
  QuestionRevealOverlay,
  LiveToast,
  WinnerPlaqueOverlay,
  NetworkCompleteOverlay,
} from './RailwayOverlays';

const RailwayScene = dynamic(
  () => import('../world/RailwayScene').then((m) => ({ default: m.RailwayScene })),
  { ssr: false }
);

export const NumberRailwayGame: React.FC = () => {
  const phase = useRailwayStore((s) => s.phase);
  const showConsoles = phase !== 'title' && phase !== 'network-complete';

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else document.documentElement.requestFullscreen().catch(() => {});
  }, []);

  return (
    <main className="relative w-screen h-screen overflow-hidden select-none font-sans bg-sky-300">
      {/* ── 1. 3D Cartoon Railway World (100% Canvas Background) ── */}
      <div className="absolute inset-0 z-0">
        <RailwayScene />
      </div>

      {/* ── 2. Top HUD Bar ── */}
      <RailwayHUD />

      {/* ── 3. Live Toast Notifications ── */}
      <LiveToast />

      {/* ── 4. Modals & Overlays ── */}
      <RailwayTitleScreen />
      <RoundIntroModal />
      <QuestionRevealOverlay />
      <WinnerPlaqueOverlay />
      <NetworkCompleteOverlay />

      {/* ── 5. Floating Symmetrical Team Consoles (Left & Right) ── */}
      {showConsoles && (
        <div className="absolute inset-x-0 top-18 bottom-3 pointer-events-none px-3 flex items-start justify-between z-20">
          <div className="pointer-events-auto">
            <TeamConsole team="blue" />
          </div>
          <div className="pointer-events-auto">
            <TeamConsole team="red" />
          </div>
        </div>
      )}

      {/* ── 6. Fullscreen Toggle Button ── */}
      <button
        onClick={toggleFullscreen}
        title="Toggle Fullscreen"
        className="absolute bottom-3 right-3 z-30 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-slate-300 text-slate-800 hover:text-slate-950 text-[10px] font-black uppercase tracking-wider hover:bg-white transition-all shadow-lg cursor-pointer pointer-events-auto"
      >
        ⛶ FULLSCREEN
      </button>
    </main>
  );
};
