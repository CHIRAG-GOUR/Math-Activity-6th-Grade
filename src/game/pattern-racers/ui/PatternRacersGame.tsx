// ============================================================
// PATTERN RACERS — Main Game Orchestrator Component
// 16:9 / 1920x1080 Arcade Arena Layout:
// - Stages 1-4: 3-Panel Battleground (Blue Console | Central 3D World | Red Console)
// - Transitions: Smooth Physical Driving (Garage -> Pit -> Grid)
// - Stage 5: Live 3-2-1 Countdown & NFS Grand Prix Race with Live Cockpit HUD
// ============================================================

'use client';

import React, { useEffect } from 'react';
import { PatternRacersScene3D } from '../world/PatternRacersScene3D';
import { TeamConsolePanel } from './TeamConsolePanel';
import { PatternHeader } from './PatternHeader';
import { PatternOverlays } from './PatternOverlays';
import { NFSMostWantedRaceHUD } from './NFSMostWantedRaceHUD';
import { TopStartingSignalBar } from './TopStartingSignalBar';
import { PerformanceMonitorOverlay } from './PerformanceMonitorOverlay';
import { usePatternStore } from '../store/patternStore';
import { Zap } from 'lucide-react';
import '../pattern-racers.css';
import { setInputFlag, clearInputs, requestRespawn } from '../engine/raceSim';
import type { TeamId } from '../types';

export const PatternRacersGame: React.FC = () => {
  const phase = usePatternStore((s) => s.phase);
  const currentRound = usePatternStore((s) => s.currentRound);

  const splitViewMode = usePatternStore((s) => s.splitViewMode);
  const blueScore = usePatternStore((s) => s.blueTeam.score);
  const redScore = usePatternStore((s) => s.redTeam.score);

  const pressThrottle = usePatternStore((s) => s.pressThrottle);
  const releaseThrottle = usePatternStore((s) => s.releaseThrottle);
  const pressBrake = usePatternStore((s) => s.pressBrake);
  const releaseBrake = usePatternStore((s) => s.releaseBrake);
  const startSteering = usePatternStore((s) => s.startSteering);
  const stopSteering = usePatternStore((s) => s.stopSteering);
  const triggerNitro = usePatternStore((s) => s.triggerNitro);

  const isRaceActive = phase === 'grand_prix_race';
  const showSidePanels = phase === 'round_active' || phase === 'phase_transition';

  // Prevent touch gesture conflicts
  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 1) e.preventDefault();
    };
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => document.removeEventListener('touchmove', handleTouchMove);
  }, []);

  // Keyboard controls for live Stage 5 Grand Prix Race
  // ---- KEYBOARD ----
  //
  // W/A/S/D and the arrow keys are BOTH live and both drive the player's car,
  // so a student can use whichever they reach for. In two-player (split) mode
  // they separate: WASD = blue, arrows = red.
  //
  // Notes on what this fixes:
  //  - Throttle and steering are independent flags. Holding W can never
  //    produce a heading change; only A/D/Left/Right can.
  //  - Arrow keys and Space are preventDefault-ed, so the page no longer
  //    scrolls underneath the race.
  //  - Boost ignores auto-repeat, which previously re-fired nitro continuously
  //    while the key was held.
  useEffect(() => {
    const controllable = phase === 'grand_prix_race';
    if (!controllable) {
      clearInputs();
      return;
    }

    const BLOCKED = new Set([
      'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space',
    ]);

    // In split (two-player) mode the arrow keys belong to red. Otherwise both
    // key sets control blue, the car the class is driving.
    const arrowTeam: TeamId = splitViewMode ? 'red' : 'blue';

    const apply = (code: string, down: boolean, repeat: boolean) => {
      switch (code) {
        case 'KeyW': setInputFlag('blue', 'accel', down); return true;
        case 'KeyS': setInputFlag('blue', 'brake', down); return true;
        case 'KeyA': setInputFlag('blue', 'left', down); return true;
        case 'KeyD': setInputFlag('blue', 'right', down); return true;

        case 'ArrowUp': setInputFlag(arrowTeam, 'accel', down); return true;
        case 'ArrowDown': setInputFlag(arrowTeam, 'brake', down); return true;
        case 'ArrowLeft': setInputFlag(arrowTeam, 'left', down); return true;
        case 'ArrowRight': setInputFlag(arrowTeam, 'right', down); return true;

        case 'Space':
        case 'ShiftLeft':
          if (down && !repeat) triggerNitro('blue');
          return true;
        case 'Enter':
        case 'Numpad0':
          if (down && !repeat) triggerNitro(arrowTeam);
          return true;

        case 'KeyR':
          if (down && !repeat) {
            requestRespawn('blue');
            if (splitViewMode) requestRespawn('red');
          }
          return true;
        default:
          return false;
      }
    };

    const onDown = (e: KeyboardEvent) => {
      if (BLOCKED.has(e.code)) e.preventDefault();
      apply(e.code, true, e.repeat);
    };
    const onUp = (e: KeyboardEvent) => {
      if (BLOCKED.has(e.code)) e.preventDefault();
      apply(e.code, false, false);
    };
    // Losing focus mid-corner must not leave a key stuck down.
    const onBlur = () => clearInputs();

    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
      window.removeEventListener('blur', onBlur);
      clearInputs();
    };
  }, [phase, splitViewMode, triggerNitro]);


  const blueLeading = blueScore > redScore;
  const redLeading = redScore > blueScore;

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col bg-slate-900 text-slate-950 select-none">
      {/* ── 1. TOP MISSION BAR ── */}
      {!isRaceActive && <PatternHeader />}

      {/* ── 2. MAIN BATTLEGROUND (Left Blue Console | Center 3D World | Right Red Console) ── */}
      <div className="flex-1 w-full flex flex-row overflow-hidden relative">
        {/* LEFT PANEL: BLUE TEAM CONSOLE */}
        {showSidePanels && (
          <aside className="w-[18%] min-w-[250px] max-w-[340px] h-full z-20 shadow-2xl border-r-3 border-slate-900 bg-white">
            <TeamConsolePanel teamId="blue" />
          </aside>
        )}

        {/* CENTER 3D WORLD */}
        <main className="flex-1 h-full relative z-10 bg-sky-100 overflow-hidden">
          <PatternRacersScene3D />

          {/* Top Starting Signal Lamps */}
          <TopStartingSignalBar />

          {/* Live Racing Cockpit HUD */}
          <NFSMostWantedRaceHUD />

          {/* ── BOTTOM FLOATING ACTION BAR ── */}
          {!isRaceActive && phase !== 'intro' && (
            <div className="absolute bottom-3 inset-x-4 z-20 pointer-events-none flex items-center justify-between">
              <div className="w-0" />

              {/* Bottom Center: Information Pill */}
              <div className="flex items-center gap-2 px-5 py-2 rounded-2xl bg-slate-950/90 backdrop-blur-md border-2 border-slate-800 text-white shadow-xl max-w-lg text-center">
                <div className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xs">
                  ℹ
                </div>
                <span className="text-xs font-bold text-slate-200">
                  {currentRound === 1 && 'Stage 1: Solve sequence step difference to trigger garage departure.'}
                  {currentRound === 2 && 'Stage 2: Pit inspection & tyre check — lock the sequence builder.'}
                  {currentRound === 3 && 'Stage 3: Starting grid staging — solve turbo function for Signal 1 Green.'}
                  {currentRound === 4 && 'Stage 4: Pre-grid revving — repair operator to unlock Signal 2 Green.'}
                  {currentRound === 5 && 'Stage 5: Solve final launch challenge to trigger 3-2-1 Countdown & GO!'}
                </span>
              </div>

              {/* Bottom Right: Head Start Advantage Indicator */}
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-slate-950/90 backdrop-blur-md border-2 border-amber-400/80 text-amber-300 font-black text-xs shadow-lg">
                <Zap className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
                <span>
                  {blueLeading
                    ? 'Blue Team Head Start +3.5s'
                    : redLeading
                    ? 'Red Team Head Start +3.5s'
                    : 'Deadlock: Even Grid Launch'}
                </span>
              </div>
            </div>
          )}

          {/* Real-time WebGL Performance Diagnostics HUD */}
          <PerformanceMonitorOverlay />
        </main>

        {/* RIGHT PANEL: RED TEAM CONSOLE */}
        {showSidePanels && (
          <aside className="w-[18%] min-w-[250px] max-w-[340px] h-full z-20 shadow-2xl border-l-3 border-slate-900 bg-white">
            <TeamConsolePanel teamId="red" />
          </aside>
        )}
      </div>

      {/* ── 3. OVERLAYS & MODALS ── */}
      <PatternOverlays />
    </div>
  );
};
