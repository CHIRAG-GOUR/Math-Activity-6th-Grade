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
import { Camera, Zap } from 'lucide-react';
import '../pattern-racers.css';

export const PatternRacersGame: React.FC = () => {
  const phase = usePatternStore((s) => s.phase);
  const currentRound = usePatternStore((s) => s.currentRound);
  const activeCameraView = usePatternStore((s) => s.activeCameraView);
  const setActiveCameraView = usePatternStore((s) => s.setActiveCameraView);

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
  useEffect(() => {
    if (!isRaceActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Blue Team: W/A/S/D + Shift / Space
      if (e.code === 'KeyW') pressThrottle('blue');
      else if (e.code === 'KeyS') pressBrake('blue');
      else if (e.code === 'KeyA') startSteering('blue', 'left');
      else if (e.code === 'KeyD') startSteering('blue', 'right');
      else if (e.code === 'Space' || e.code === 'ShiftLeft') triggerNitro('blue');

      // Red Team: Arrow Keys + Enter / Numpad0
      if (e.code === 'ArrowUp') pressThrottle('red');
      else if (e.code === 'ArrowDown') pressBrake('red');
      else if (e.code === 'ArrowLeft') startSteering('red', 'left');
      else if (e.code === 'ArrowRight') startSteering('red', 'right');
      else if (e.code === 'Enter' || e.code === 'Numpad0') triggerNitro('red');
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'KeyW') releaseThrottle('blue');
      if (e.code === 'KeyS') releaseBrake('blue');
      if (e.code === 'KeyA' || e.code === 'KeyD') stopSteering('blue');

      if (e.code === 'ArrowUp') releaseThrottle('red');
      if (e.code === 'ArrowDown') releaseBrake('red');
      if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') stopSteering('red');
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isRaceActive, pressThrottle, releaseThrottle, pressBrake, releaseBrake, startSteering, stopSteering, triggerNitro]);

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
              {/* Bottom Left: Camera Selector [1] [2] [3] */}
              <div className="pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-950/90 backdrop-blur-md border-2 border-slate-800 text-white shadow-lg">
                <Camera className="w-4 h-4 text-slate-300 mr-1" />
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">CAMERA</span>
                {([1, 2, 3] as const).map((camNum) => (
                  <button
                    key={`cam-btn-${camNum}`}
                    onClick={() => setActiveCameraView(camNum)}
                    className={`w-7 h-7 rounded-xl font-mono font-black text-xs transition cursor-pointer flex items-center justify-center ${
                      activeCameraView === camNum
                        ? 'bg-blue-600 text-white border-2 border-blue-400 shadow-sm'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                    title={`Switch to Camera Angle ${camNum}`}
                  >
                    {camNum}
                  </button>
                ))}
              </div>

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
