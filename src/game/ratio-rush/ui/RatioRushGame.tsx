// ============================================================
// RATIO RUSH — MAIN GAME CONTAINER & ORCHESTRATOR
// Integrates 3D Film Soundstage, Duel Consoles, Workspace, and Overlays
// ============================================================

'use client';

import React, { useEffect } from 'react';
import { RatioRushScene3D } from '../world/RatioRushScene3D';
import { RatioRushHeader } from './RatioRushHeader';
import { TeamStudioConsole } from './TeamStudioConsole';
import { RatioWorkspace } from './RatioWorkspace';
import { MoviePremiereOverlay } from './MoviePremiereOverlay';
import { StudioBriefingModal } from './StudioBriefingModal';
import { useRatioStore } from '../store/ratioStore';
import { Users, User, HelpCircle } from 'lucide-react';

export const RatioRushGame: React.FC = () => {
  const gameMode = useRatioStore((s) => s.gameMode);
  const setGameMode = useRatioStore((s) => s.setGameMode);
  const decrementTimer = useRatioStore((s) => s.decrementTimer);
  const setShowBriefingModal = useRatioStore((s) => s.setShowBriefingModal);

  // Countdown timer hook
  useEffect(() => {
    const timer = setInterval(() => {
      decrementTimer();
    }, 1000);
    return () => clearInterval(timer);
  }, [decrementTimer]);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-slate-100 select-none flex flex-col justify-between">
      {/* ── 1. TOP HEADER & STUDIO BAR ── */}
      <RatioRushHeader />

      {/* ── 2. MAIN 3D SOUNDSTAGE ARENA WITH DOCKABLE SIDE CONSOLES ── */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        {/* Full-Window 3D Canvas */}
        <div className="absolute inset-0 z-0">
          <RatioRushScene3D />
        </div>

        {/* Floating Top 2-Player Production Status & Help (Neo-Brutalism) */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-xl border-3 border-black shadow-[4px_4px_0px_#000000]">
          <div className="px-3 py-1 rounded-lg bg-yellow-400 text-black text-xs font-black uppercase tracking-wider flex items-center gap-1.5 border-2 border-black shadow-[2px_2px_0px_#000000]">
            <Users className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>2-PLAYER STUDIO DUEL</span>
          </div>

          <div className="w-[2px] h-5 bg-black mx-0.5" />

          <button
            onClick={() => setShowBriefingModal(true)}
            className="p-1 rounded-lg bg-white hover:bg-yellow-200 border-2 border-black text-black shadow-[2px_2px_0px_#000000] active:shadow-none transition-all cursor-pointer"
            title="Production Shoot Briefing"
          >
            <HelpCircle className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* ── Side HUD Consoles (Left & Right — Always 2-Player Duel, Larger Size) ── */}
        <div className="absolute inset-x-4 bottom-3 top-14 pointer-events-none flex items-end justify-between gap-4 z-10">
          {/* Left Console: Blue Studio Crew */}
          <div className="w-[430px] max-w-[48vw] h-auto max-h-[86vh] pointer-events-auto flex flex-col gap-2">
            <TeamStudioConsole team="blue" />
          </div>

          {/* Right Console: Red Studio Crew */}
          <div className="w-[430px] max-w-[48vw] h-auto max-h-[86vh] pointer-events-auto flex flex-col gap-2">
            <TeamStudioConsole team="red" />
          </div>
        </div>
      </div>

      {/* ── 3. OVERLAYS & MODALS ── */}
      <MoviePremiereOverlay />
      <StudioBriefingModal />
    </main>
  );
};
