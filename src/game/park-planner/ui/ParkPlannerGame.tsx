'use client';

// ============================================================
// PARK PLANNER — Master Game Component
// Grade 6 Mathematics: Position and Transformation in 3D City Park
// ============================================================

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { ParkHeader } from './ParkHeader';
import { TeamParkConsole } from './TeamParkConsole';
import { ParkBriefingModal } from './ParkBriefingModal';
import { ParkVictoryOverlay } from './ParkVictoryOverlay';
import { useParkStore } from '../store/parkStore';
import { Coordinate2D } from '../types';

// Dynamic import of 3D Scene with SSR disabled
const ParkScene3D = dynamic(
  () => import('../world/ParkScene3D').then((mod) => mod.ParkScene3D),
  { ssr: false }
);

export const ParkPlannerGame: React.FC = () => {
  const [isBriefingOpen, setIsBriefingOpen] = useState(false);
  const selectPoint = useParkStore((s) => s.selectPoint);
  const togglePolygonPoint = useParkStore((s) => s.togglePolygonPoint);
  const selectedTeamPreview = useParkStore((s) => s.selectedTeamPreview);
  const activeTeam = useParkStore((s) =>
    selectedTeamPreview === 'blue' ? s.blueTeam : s.redTeam
  );

  const handleCoordinateClick = (coord: Coordinate2D) => {
    const q = activeTeam.currentQuestion;
    if (!q || activeTeam.hasAnsweredCurrent) return;

    if (q.mode === 'polygon' || q.mode === 'path') {
      togglePolygonPoint(selectedTeamPreview, coord);
    } else {
      selectPoint(selectedTeamPreview, coord);
    }
  };

  return (
    <div className="relative w-full h-screen min-h-screen bg-slate-900 flex flex-col overflow-hidden select-none font-sans">
      {/* Top Header Status Bar */}
      <ParkHeader onOpenBriefing={() => setIsBriefingOpen(true)} />

      {/* Center 3D Park Simulation Canvas */}
      <main className="relative flex-1 w-full h-full overflow-hidden">
        <ParkScene3D onCoordinateClick={handleCoordinateClick} />

        {/* Dual Team Consoles: Positioned towards bottom corners */}
        <div className="absolute inset-0 pointer-events-none p-4 md:p-6 flex justify-between items-end z-10">
          {/* Blue Team Console (Left Corner) */}
          <div className="pointer-events-auto max-w-[340px] w-full">
            <TeamParkConsole teamId="blue" />
          </div>

          {/* Red Team Console (Right Corner) */}
          <div className="pointer-events-auto max-w-[340px] w-full">
            <TeamParkConsole teamId="red" />
          </div>
        </div>
      </main>

      {/* Briefing Guide Modal */}
      <ParkBriefingModal
        isOpen={isBriefingOpen}
        onClose={() => setIsBriefingOpen(false)}
      />

      {/* Match Victory & Park Completion Modal */}
      <ParkVictoryOverlay />
    </div>
  );
};
