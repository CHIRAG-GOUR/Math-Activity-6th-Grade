// ============================================================
// EQUATION MISSION CONTROL 2.0 — Main Master Orchestrator
// Full-Bleed 3D Aerospace World with Floating Symmetrical Consoles:
// - FULLSCREEN 3D CANVAS (100% Viewport Background)
// - Mounted Top Telemetry Briefing HUD
// - Floating Symmetrical Consoles: Team Blue (Left, 270px) & Team Red (Right, 270px)
// - Identical Size and Position as Train Game
// - Light Aerospace Overlays & Solution Telemetry
// ============================================================

'use client';

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useMissionControlStore } from '../store/missionControlStore';
import { BlueMissionConsole } from './BlueMissionConsole';
import { RedMissionConsole } from './RedMissionConsole';
import { MissionBriefingHUD } from './MissionBriefingHUD';
import { MissionControlOverlays } from './MissionControlOverlays';
import { soundManager } from '@/utils/audio';
import '../mission-control.css';

// Dynamic 3D Scene to prevent SSR Canvas hydration mismatch
const MissionControlScene3D = dynamic(
  () =>
    import('../world/MissionControlScene3D').then((m) => m.MissionControlScene3D),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-sky-400 via-sky-200 to-amber-100 text-slate-800">
        <div className="w-12 h-12 rounded-full border-4 border-slate-900 border-t-amber-400 animate-spin mb-3" />
        <span className="text-xs font-black uppercase tracking-widest text-slate-800">
          INITIALIZING DUAL 3D LAUNCH COMPLEX...
        </span>
      </div>
    ),
  }
);

export const EquationMissionControlGame: React.FC = () => {
  const phase = useMissionControlStore((s) => s.phase);
  const showConsoles = phase !== 'title' && phase !== 'mission-report';

  useEffect(() => {
    // Start authentic Spacecraft BGM at 40% volume continuously
    soundManager.startSpacecraftBgm(0.40);
    return () => {
      soundManager.stopSpacecraftBgm();
    };
  }, []);

  return (
    <main className="relative w-screen h-screen overflow-hidden select-none font-sans bg-sky-300">
      {/* ── 1. 3D Spacecraft Launch World (100% Canvas Background) ── */}
      <div className="absolute inset-0 z-0">
        <MissionControlScene3D />
      </div>

      {/* ── 2. Top Mounted Mission Briefing HUD ── */}
      <MissionBriefingHUD />

      {/* ── 3. Floating Symmetrical Team Consoles (Left & Right, top-18) ── */}
      {showConsoles && (
        <div className="absolute inset-x-0 top-18 bottom-3 pointer-events-none px-3 flex items-start justify-between z-20">
          <div className="pointer-events-auto">
            <BlueMissionConsole />
          </div>
          <div className="pointer-events-auto">
            <RedMissionConsole />
          </div>
        </div>
      )}

      {/* ── 4. Modals, Directives, Solution Telemetry & Flight Certificate ── */}
      <MissionControlOverlays />
    </main>
  );
};
