// ============================================================
// EQUATION MISSION CONTROL — Master Game Component
// Grade 6: Expressions, Formulae & Equations
// Layout: [BLUE CONTROL (LEFT)] [3D SPACECRAFT WORLD (CENTER)] [RED CONTROL (RIGHT)]
// ============================================================

'use client';

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useMissionControlStore } from '../store/missionControlStore';
import { BlueMissionConsole } from './BlueMissionConsole';
import { RedMissionConsole } from './RedMissionConsole';
import { MissionBriefingHUD } from './MissionBriefingHUD';
import { MissionControlOverlays } from './MissionControlOverlays';
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
          INITIALIZING 3D LAUNCH FACILITY...
        </span>
      </div>
    ),
  }
);

export const EquationMissionControlGame: React.FC = () => {
  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col bg-slate-100 select-none relative">
      {/* Top Telemetry Header HUD with 5 Stage Indicator Lights */}
      <MissionBriefingHUD />

      {/* Main 3-Column Split: [BLUE (LEFT)] | [3D WORLD (CENTER)] | [RED (RIGHT)] */}
      <main className="flex-1 flex flex-row w-full h-full overflow-hidden relative pt-16">
        {/* Blue Mission Control — Left Side */}
        <BlueMissionConsole />

        {/* Central 3D Spacecraft & Aerospace Campus World */}
        <section className="flex-1 h-full relative bg-sky-200 overflow-hidden">
          <MissionControlScene3D />
        </section>

        {/* Red Mission Control — Right Side */}
        <RedMissionConsole />

        {/* Modals, Directives & Final Report Overlays */}
        <MissionControlOverlays />
      </main>
    </div>
  );
};
