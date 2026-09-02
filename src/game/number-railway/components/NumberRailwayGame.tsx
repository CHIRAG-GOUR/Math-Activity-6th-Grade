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

import React, { useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRailwayStore } from '../store/railwayStore';
import { soundManager } from '@/utils/audio';
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

  // Ensure game sound isolation: stop 1st activity BGM completely
  useEffect(() => {
    soundManager.stopBgm();
    return () => {
      soundManager.stopBgm();
      soundManager.stopTrainRunningAudio();
    };
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else document.documentElement.requestFullscreen().catch(() => {});
  }, []);

  const zoomIn = useRailwayStore((s) => s.zoomIn);
  const zoomOut = useRailwayStore((s) => s.zoomOut);
  const resetZoom = useRailwayStore((s) => s.resetZoom);
  const zoomLevel = useRailwayStore((s) => s.zoomLevel);

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

      {/* ── 6. Bottom Controls: Zoom (+ & -) & Fullscreen ── */}
      <div className="absolute bottom-3 right-3 z-30 flex items-center gap-1.5 pointer-events-auto">
        {/* Zoom In Button */}
        <button
          onClick={zoomIn}
          title="Zoom In"
          className="w-8 h-8 rounded-xl bg-white/95 backdrop-blur-md border border-slate-300 text-slate-800 hover:text-blue-600 text-sm font-black flex items-center justify-center hover:bg-white shadow-lg transition-all cursor-pointer"
        >
          ＋
        </button>

        {/* Zoom Reset / Current Display */}
        <button
          onClick={resetZoom}
          title="Reset Zoom"
          className="px-2 h-8 rounded-xl bg-white/95 backdrop-blur-md border border-slate-300 text-slate-800 hover:text-amber-600 text-[10px] font-black flex items-center justify-center hover:bg-white shadow-lg transition-all cursor-pointer"
        >
          {Math.round(zoomLevel * 100)}%
        </button>

        {/* Zoom Out Button */}
        <button
          onClick={zoomOut}
          title="Zoom Out"
          className="w-8 h-8 rounded-xl bg-white/95 backdrop-blur-md border border-slate-300 text-slate-800 hover:text-blue-600 text-sm font-black flex items-center justify-center hover:bg-white shadow-lg transition-all cursor-pointer"
        >
          －
        </button>

        {/* Fullscreen Button */}
        <button
          onClick={toggleFullscreen}
          title="Toggle Fullscreen"
          className="px-3 h-8 rounded-xl bg-white/95 backdrop-blur-md border border-slate-300 text-slate-800 hover:text-slate-950 text-[10px] font-black uppercase tracking-wider hover:bg-white transition-all shadow-lg cursor-pointer"
        >
          ⛶ FULLSCREEN
        </button>
      </div>
    </main>
  );
};
