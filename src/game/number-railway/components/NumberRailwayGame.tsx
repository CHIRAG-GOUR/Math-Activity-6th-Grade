// ============================================================
// THE GREAT NUMBER RAILWAY — Main Orchestrator
// Full-bleed 3D world with floating railway-operator consoles,
// wood & brass HUD, and the cinematic Railway Showdown overlays.
// ============================================================

'use client';

import React, { useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useRailwayStore } from '../store/railwayStore';
import { TeamConsole } from './TeamConsole';
import { RailwayHUD } from './RailwayHUD';
import {
  RailwayTitleScreen,
  RoundIntroOverlay,
  RouteDecisionBoard,
  WinnerPlaque,
  NetworkCompleteOverlay,
  RailwayToast,
  MissionBar,
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
    <main className="relative w-screen h-screen overflow-hidden select-none font-sans" style={{ background: '#7dd3fc' }}>
      {/* 3D world */}
      <div className="absolute inset-0 z-0">
        <RailwayScene />
      </div>

      {/* HUD + overlays */}
      <RailwayHUD />
      <RailwayToast />
      <RoundIntroOverlay />
      <RouteDecisionBoard />
      <MissionBar />
      <WinnerPlaque />
      <RailwayTitleScreen />
      <NetworkCompleteOverlay />

      {/* Floating consoles */}
      {showConsoles && (
        <div className="absolute inset-x-0 top-24 bottom-3 pointer-events-none px-3 flex items-start justify-between z-20">
          <div className="pointer-events-auto">
            <TeamConsole team="blue" />
          </div>
          <div className="pointer-events-auto">
            <TeamConsole team="red" />
          </div>
        </div>
      )}

      {/* Fullscreen toggle */}
      <button onClick={toggleFullscreen} title="Fullscreen"
        className="absolute bottom-3 right-3 z-30 w-9 h-9 rounded-xl flex items-center justify-center pointer-events-auto"
        style={{ background: 'linear-gradient(180deg,#5b4326,#3a2a17)', border: '2px solid #c9a24b' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fde68a" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></svg>
      </button>
    </main>
  );
};
