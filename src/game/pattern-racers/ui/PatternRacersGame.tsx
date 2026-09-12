// ============================================================
// PATTERN RACERS — Main Game Orchestrator Component
// 16:9 / 1920x1080 Arcade Arena Layout:
// - Stages 1-4: 3-Panel Battleground (16% Blue Console | 68% 3D Facility | 16% Red Console)
// - Stage 5: 100% Full-Screen NFS Grand Prix Race with On-Screen HUD & Virtual Joystick
// ============================================================

'use client';

import React, { useEffect } from 'react';
import { PatternRacersScene3D } from '../world/PatternRacersScene3D';
import { TeamConsolePanel } from './TeamConsolePanel';
import { PatternHeader } from './PatternHeader';
import { PatternOverlays } from './PatternOverlays';
import { NFSMostWantedRaceHUD } from './NFSMostWantedRaceHUD';
import { usePatternStore } from '../store/patternStore';
import '../pattern-racers.css';

export const PatternRacersGame: React.FC = () => {
  const phase = usePatternStore((s) => s.phase);
  const pressThrottle = usePatternStore((s) => s.pressThrottle);
  const releaseThrottle = usePatternStore((s) => s.releaseThrottle);
  const pressBrake = usePatternStore((s) => s.pressBrake);
  const releaseBrake = usePatternStore((s) => s.releaseBrake);
  const switchLane = usePatternStore((s) => s.switchLane);
  const triggerNitro = usePatternStore((s) => s.triggerNitro);

  const isRaceActive = phase === 'grand_prix_race';

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

  // Keyboard controls for live Stage 5 Grand Prix Race
  useEffect(() => {
    if (!isRaceActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Blue Team: W/A/S/D + Shift / Space
      if (e.code === 'KeyW') pressThrottle('blue');
      else if (e.code === 'KeyS') pressBrake('blue');
      else if (e.code === 'KeyA') switchLane('blue', 'left');
      else if (e.code === 'KeyD') switchLane('blue', 'right');
      else if (e.code === 'Space' || e.code === 'ShiftLeft') triggerNitro('blue');

      // Red Team: Arrow Keys + Enter / Numpad0
      if (e.code === 'ArrowUp') pressThrottle('red');
      else if (e.code === 'ArrowDown') pressBrake('red');
      else if (e.code === 'ArrowLeft') switchLane('red', 'left');
      else if (e.code === 'ArrowRight') switchLane('red', 'right');
      else if (e.code === 'Enter' || e.code === 'Numpad0') triggerNitro('red');
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'KeyW') releaseThrottle('blue');
      if (e.code === 'KeyS') releaseBrake('blue');
      if (e.code === 'ArrowUp') releaseThrottle('red');
      if (e.code === 'ArrowDown') releaseBrake('red');
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isRaceActive, pressThrottle, releaseThrottle, pressBrake, releaseBrake, switchLane, triggerNitro]);

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col bg-slate-900 text-slate-950 select-none">
      {/* ── 1. TOP HEADER (Round, Scores, Pacing, Audio) ── */}
      {!isRaceActive && <PatternHeader />}

      {/* ── 2. MAIN BATTLEGROUND ── */}
      <div className="flex-1 w-full flex flex-row overflow-hidden relative">
        {/* LEFT PANEL: BLUE TEAM CONSOLE (~16% Width, hidden in Live Race) */}
        {!isRaceActive && (
          <aside className="w-[16%] min-w-[240px] max-w-[320px] h-full z-20 shadow-xl border-r-3 border-slate-900 bg-white">
            <TeamConsolePanel teamId="blue" />
          </aside>
        )}

        {/* CENTER 3D WORLD (100% in Race Mode, 68% in Quiz Mode) */}
        <main className="flex-1 h-full relative z-10 bg-sky-100 overflow-hidden">
          <PatternRacersScene3D />

          {/* FULL SCREEN NFS MOST WANTED LIVE RACING HUD */}
          {isRaceActive && <NFSMostWantedRaceHUD />}
        </main>

        {/* RIGHT PANEL: RED TEAM CONSOLE (~16% Width, hidden in Live Race) */}
        {!isRaceActive && (
          <aside className="w-[16%] min-w-[240px] max-w-[320px] h-full z-20 shadow-xl border-l-3 border-slate-900 bg-white">
            <TeamConsolePanel teamId="red" />
          </aside>
        )}
      </div>

      {/* ── 3. OVERLAYS & MODALS (Intro, Starting Lights, Podium & Certificate) ── */}
      <PatternOverlays />
    </div>
  );
};

