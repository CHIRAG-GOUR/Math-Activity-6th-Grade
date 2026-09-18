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
  if (typeof window !== 'undefined') (window as unknown as Record<string, unknown>).__ratio = useRatioStore;
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
