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

  const [mobileActiveTeam, setMobileActiveTeam] = React.useState<'blue' | 'red'>('blue');
  const [isMobileViewport, setIsMobileViewport] = React.useState(false);

  React.useEffect(() => {
    const checkViewport = () => {
      setIsMobileViewport(window.innerWidth < 960);
    };
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

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

      {/* ── 3. Floating Team Consoles / Responsive Layout ── */}
      {showConsoles && (
        isMobileViewport ? (
          /* Mobile / Small Screen: Single active console with quick team switcher */
          <div className="fixed z-30 bottom-2 left-2 right-2 max-w-lg mx-auto pointer-events-auto flex flex-col gap-1.5">
            {/* Mobile Team Toggle Bar */}
            <div className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1 rounded-xl shadow-lg border border-slate-700/80">
              <button
                type="button"
                onClick={() => setMobileActiveTeam('blue')}
                className={`flex-1 py-1.5 px-3 rounded-lg font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  mobileActiveTeam === 'blue'
                    ? 'bg-gradient-to-r from-blue-600 to-sky-600 text-white shadow-md shadow-blue-500/30 ring-2 ring-sky-300'
                    : 'text-slate-300 hover:text-white bg-slate-800/60'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-sky-400" />
                <span>BLUE COMPLEX</span>
              </button>
              <button
                type="button"
                onClick={() => setMobileActiveTeam('red')}
                className={`flex-1 py-1.5 px-3 rounded-lg font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  mobileActiveTeam === 'red'
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-500/30 ring-2 ring-rose-300'
                    : 'text-slate-300 hover:text-white bg-slate-800/60'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                <span>RED COMPLEX</span>
              </button>
            </div>

            {/* Active Mobile Console */}
            <div className="w-full">
              {mobileActiveTeam === 'blue' ? <BlueMissionConsole /> : <RedMissionConsole />}
            </div>
          </div>
        ) : (
          /* Desktop, Laptop, and TV Screens: Dual Symmetrical Consoles */
          <div className="absolute inset-x-0 top-18 bottom-3 pointer-events-none px-3 flex items-start justify-between z-20">
            <div className="pointer-events-auto w-[280px] md:w-[320px] lg:w-[360px] xl:w-[400px] 2xl:w-[440px] max-w-[calc(50vw-20px)]">
              <BlueMissionConsole />
            </div>
            <div className="pointer-events-auto w-[280px] md:w-[320px] lg:w-[360px] xl:w-[400px] 2xl:w-[440px] max-w-[calc(50vw-20px)]">
              <RedMissionConsole />
            </div>
          </div>
        )
      )}

      {/* ── 4. Modals, Directives, Solution Telemetry & Flight Certificate ── */}
      <MissionControlOverlays />
    </main>
  );
};
