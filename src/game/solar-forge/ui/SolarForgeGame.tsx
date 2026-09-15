'use client';

// ============================================================
// THE SOLAR FORGE: Main Activity Container Component
// Bridges 3D Canvas world, Top Header, and bottom-corner Team Consoles
// ============================================================

import React from 'react';
import dynamic from 'next/dynamic';
import { SolarForgeHeader } from './SolarForgeHeader';
import { SolarTeamConsole } from './SolarTeamConsole';
import { BriefingModal } from './BriefingModal';
import { SolarForgeVictoryCinematic } from './SolarForgeVictoryCinematic';

const SolarForgeScene3D = dynamic(
  () => import('../world/SolarForgeScene3D').then((m) => m.SolarForgeScene3D),
  { ssr: false }
);

export const SolarForgeGame: React.FC = () => {
  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#bae6fd] select-none font-sans">
      {/* ── 3D SUNLIT VALLEY & SOLAR FORGE WORLD (Canvas) ── */}
      <div className="absolute inset-0 z-0">
        <SolarForgeScene3D />
      </div>

      {/* ── TOP TELEMETRY & CONTROLS HEADER ── */}
      <SolarForgeHeader />

      {/* ── BOTTOM-LEFT: BLUE HELIO SQUADRON CONSOLE ── */}
      <SolarTeamConsole team="blue" />

      {/* ── BOTTOM-RIGHT: RED SOLAR CORPS CONSOLE ── */}
      <SolarTeamConsole team="red" />

      {/* ── BRIEFING INTRODUCTION MODAL ── */}
      <BriefingModal />

      {/* ── SOLAR FORGE ONLINE CINEMATIC ── */}
      <SolarForgeVictoryCinematic />
    </main>
  );
};
