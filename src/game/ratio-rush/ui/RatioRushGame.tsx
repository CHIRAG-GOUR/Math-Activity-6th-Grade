// ============================================================
// RATIO RUSH — MAIN GAME CONTAINER & ORCHESTRATOR
// Integrates 3D Film Soundstage, Duel Consoles, Workspace, and Overlays
// ============================================================

'use client';

import React, { useEffect } from 'react';
import { RatioRushScene3D } from '../world/RatioRushScene3D';
import { RatioRushHeader } from './RatioRushHeader';
import { TeamStudioConsole } from './TeamStudioConsole';
import { MoviePremiereOverlay } from './MoviePremiereOverlay';
import { StudioBriefingModal } from './StudioBriefingModal';
import { useRatioStore } from '../store/ratioStore';
import { Film, Eye, Sparkles } from 'lucide-react';

export const RatioRushGame: React.FC = () => {
  const isFilmingActive = useRatioStore((s) => s.isFilmingActive);
  const isPremiereActive = useRatioStore((s) => s.isPremiereActive);
  const blueComplete = useRatioStore((s) => s.blueTeam.isComplete);
  const redComplete = useRatioStore((s) => s.redTeam.isComplete);
  const decrementTimer = useRatioStore((s) => s.decrementTimer);
  const reloadSessionQuestions = useRatioStore((s) => s.reloadSessionQuestions);

  const hidePanels = isFilmingActive || isPremiereActive || (blueComplete && redComplete);

  // Reload active session questions on mount
  useEffect(() => {
    reloadSessionQuestions();
  }, [reloadSessionQuestions]);

  // Countdown timer hook
  useEffect(() => {
    const timer = setInterval(() => {
      decrementTimer();
    }, 1000);
    return () => clearInterval(timer);
  }, [decrementTimer]);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-slate-900 select-none flex flex-col justify-between">
      {/* ── 1. TOP HEADER & STUDIO BAR (Smoothly transitions out during filming) ── */}
      <div
        className={`transition-all duration-700 ease-in-out z-20 ${
          hidePanels
            ? 'opacity-0 -translate-y-full pointer-events-none h-0 overflow-hidden'
            : 'opacity-100 translate-y-0 h-auto'
        }`}
      >
        <RatioRushHeader />
      </div>

      {/* ── 2. MAIN 3D SOUNDSTAGE ARENA WITH FULLSCREEN CLEAR SHOOT VIEW ── */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        {/* Full-Window 3D Canvas */}
        <div className="absolute inset-0 z-0">
          <RatioRushScene3D />
        </div>

        {/* ── Side HUD Consoles (Completely hidden during filming after last question) ── */}
        <div
          className={`absolute inset-x-4 bottom-3 top-14 pointer-events-none flex items-end justify-between gap-4 z-10 transition-all duration-700 ease-in-out ${
            hidePanels
              ? 'opacity-0 translate-y-16 pointer-events-none scale-95'
              : 'opacity-100 translate-y-0 scale-100'
          }`}
        >
          {/* Left Console: Blue Studio Crew */}
          <div className="w-[430px] max-w-[48vw] h-auto max-h-[86vh] pointer-events-auto flex flex-col gap-2">
            <TeamStudioConsole team="blue" />
          </div>

          {/* Right Console: Red Studio Crew */}
          <div className="w-[430px] max-w-[48vw] h-auto max-h-[86vh] pointer-events-auto flex flex-col gap-2">
            <TeamStudioConsole team="red" />
          </div>
        </div>

        {/* ── Cinematic Filming On-Air Floating Indicator (when panels are hidden) ── */}
        {hidePanels && !isPremiereActive && (
          <div className="absolute top-5 left-1/2 -translate-x-1/2 z-30 pointer-events-auto flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-black/90 text-white border-3 border-yellow-400 shadow-[0_8px_30px_rgba(0,0,0,0.7)] animate-fadeIn">
            <div className="relative flex items-center justify-center">
              <span className="w-3 h-3 rounded-full bg-red-600 animate-ping absolute" />
              <span className="w-3 h-3 rounded-full bg-red-500" />
            </div>
            <span className="text-xs font-black tracking-widest text-yellow-400 uppercase font-bank flex items-center gap-1.5">
              <Film className="w-4 h-4" />
              <span>4K CINEMA SHOOT IN PROGRESS • FULLSCREEN TAKE</span>
            </span>
          </div>
        )}
      </div>

      {/* ── 3. OVERLAYS & MODALS ── */}
      <MoviePremiereOverlay />
      <StudioBriefingModal />
    </main>
  );
};

