// ============================================================
// PATTERN RACERS — Main Game Orchestrator Component
// 16:9 / 1920x1080 Arcade Arena Layout:
// - Left 16%: Blue Team Independent Mechanical Console
// - Center 68%: Full React Three Fiber Daylight 3D Facility
// - Right 16%: Red Team Independent Mechanical Console
// ============================================================

'use client';

import React, { useEffect } from 'react';
import { PatternRacersScene3D } from '../world/PatternRacersScene3D';
import { TeamConsolePanel } from './TeamConsolePanel';
import { PatternHeader } from './PatternHeader';
import { PatternOverlays } from './PatternOverlays';
import { usePatternStore } from '../store/patternStore';
import '../pattern-racers.css';

export const PatternRacersGame: React.FC = () => {
  const phase = usePatternStore((s) => s.phase);

  // Prevent default pull-to-refresh on classroom touch TV
  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => document.removeEventListener('touchmove', handleTouchMove);
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col bg-slate-900 text-slate-950 select-none">
      {/* ── 1. TOP HEADER (Round, Scores, Pacing, Audio) ── */}
      <PatternHeader />

      {/* ── 2. MAIN 3-PANEL BATTLEGROUND (16% | 68% | 16%) ── */}
      <div className="flex-1 w-full flex flex-row overflow-hidden relative">
        {/* LEFT PANEL: BLUE TEAM CONSOLE (~16% Width) */}
        <aside className="w-[16%] min-w-[240px] max-w-[320px] h-full z-20 shadow-xl border-r-3 border-slate-900 bg-white">
          <TeamConsolePanel teamId="blue" />
        </aside>

        {/* CENTER 3D WORLD (~68% Main Stage) */}
        <main className="flex-1 h-full relative z-10 bg-sky-100 overflow-hidden">
          <PatternRacersScene3D />
        </main>

        {/* RIGHT PANEL: RED TEAM CONSOLE (~16% Width) */}
        <aside className="w-[16%] min-w-[240px] max-w-[320px] h-full z-20 shadow-xl border-l-3 border-slate-900 bg-white">
          <TeamConsolePanel teamId="red" />
        </aside>
      </div>

      {/* ── 3. OVERLAYS & MODALS (Intro, Starting Lights, Podium & Certificate) ── */}
      <PatternOverlays />
    </div>
  );
};
