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

  const qb = activeTeam.quadrantBuild;

  const handleCoordinateClick = (coord: Coordinate2D) => {
    const q = activeTeam.currentQuestion;
    if (!q || activeTeam.hasAnsweredCurrent) return;

    if (q.mode === 'polygon' || q.mode === 'path') {
      togglePolygonPoint(selectedTeamPreview, coord);
    } else {
      selectPoint(selectedTeamPreview, coord);
    }
  };

  // Determine active construction status for HUD
  let constructionBanner = null;
  if (qb) {
    if (qb.grandOpeningActive) {
      constructionBanner = (
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white font-black text-xs md:text-sm px-4 py-1.5 rounded-full shadow-lg border border-amber-200 animate-bounce flex items-center gap-2">
          <span>🎉</span>
          <span>GRAND PARK OPENING! Gates Unlocked & Citizens Streaming In!</span>
        </div>
      );
    } else if (qb.q1Building) {
      constructionBanner = (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-black text-xs md:text-sm px-4 py-1.5 rounded-full shadow-lg border border-blue-300 animate-pulse flex items-center gap-2">
          <span>🏗️</span>
          <span>BUILDING QUADRANT I: Children's Playground ({Math.round(qb.q1Progress * 100)}%)</span>
        </div>
      );
    } else if (qb.q2Building) {
      constructionBanner = (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-black text-xs md:text-sm px-4 py-1.5 rounded-full shadow-lg border border-emerald-300 animate-pulse flex items-center gap-2">
          <span>🌿</span>
          <span>BUILDING QUADRANT II: Botanical Gardens & Greenhouse ({Math.round(qb.q2Progress * 100)}%)</span>
        </div>
      );
    } else if (qb.q3Building) {
      constructionBanner = (
        <div className="bg-gradient-to-r from-sky-600 to-blue-700 text-white font-black text-xs md:text-sm px-4 py-1.5 rounded-full shadow-lg border border-sky-300 animate-pulse flex items-center gap-2">
          <span>🏏</span>
          <span>BUILDING QUADRANT III: Cricket Pitch & Football Grounds ({Math.round(qb.q3Progress * 100)}%)</span>
        </div>
      );
    } else if (qb.q4Building) {
      constructionBanner = (
        <div className="bg-gradient-to-r from-amber-600 to-orange-700 text-white font-black text-xs md:text-sm px-4 py-1.5 rounded-full shadow-lg border border-amber-300 animate-pulse flex items-center gap-2">
          <span>🧺</span>
          <span>BUILDING QUADRANT IV: Picnic Grove & Central Fountain ({Math.round(qb.q4Progress * 100)}%)</span>
        </div>
      );
    }
  }

  return (
    <div className="relative w-full h-screen min-h-screen bg-slate-900 flex flex-col overflow-hidden select-none font-sans">
      {/* Top Header Status Bar */}
      <ParkHeader onOpenBriefing={() => setIsBriefingOpen(true)} />

      {/* Center 3D Park Simulation Canvas */}
      <main className="relative flex-1 w-full h-full overflow-hidden">
        <ParkScene3D onCoordinateClick={handleCoordinateClick} />

        {/* Live Construction / Grand Opening Status Banner */}
        {constructionBanner && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
            {constructionBanner}
          </div>
        )}

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
