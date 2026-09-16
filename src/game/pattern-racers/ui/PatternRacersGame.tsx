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

  const [mobileActiveTeam, setMobileActiveTeam] = React.useState<'blue' | 'red'>('blue');
  const [isMobileViewport, setIsMobileViewport] = React.useState(false);

  React.useEffect(() => {
    const checkViewport = () => {
      setIsMobileViewport(window.innerWidth < 960);
    };
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

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
    const controllable = phase === 'grand_prix_race';
    if (!controllable) {
      clearInputs();
      return;
    }

    const BLOCKED = new Set([
      'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space',
    ]);

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

      {/* ── 2. MAIN BATTLEGROUND ── */}
      <div className="flex-1 w-full flex flex-row overflow-hidden relative">
        {/* LEFT PANEL: BLUE TEAM CONSOLE (Desktop/TV) */}
        {showSidePanels && !isMobileViewport && (
          <aside className="w-[280px] md:w-[320px] lg:w-[350px] xl:w-[380px] 2xl:w-[420px] max-w-[calc(50vw-20px)] h-full z-20 shadow-2xl border-r-3 border-slate-900 bg-white shrink-0">
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
          {!isRaceActive && phase !== 'intro' && !isMobileViewport && (
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

          {/* Mobile Single-Console Toggle Layout */}
          {showSidePanels && isMobileViewport && (
            <div className="fixed z-30 bottom-2 left-2 right-2 max-w-lg mx-auto pointer-events-auto flex flex-col gap-1.5">
              {/* Mobile Team Toggle Bar */}
              <div className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1 rounded-xl shadow-lg border border-slate-700/80">
                <button
                  type="button"
                  onClick={() => setMobileActiveTeam('blue')}
                  className={`flex-1 py-1.5 px-3 rounded-lg font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    mobileActiveTeam === 'blue'
                      ? 'bg-gradient-to-r from-blue-600 to-sky-600 text-white shadow-md shadow-blue-500/30 ring-2 ring-sky-300'
                      : 'text-slate-300 hover:text-white bg-slate-800/60'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-sky-400" />
                  <span>BLUE RACER ({blueScore}P)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMobileActiveTeam('red')}
                  className={`flex-1 py-1.5 px-3 rounded-lg font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    mobileActiveTeam === 'red'
                      ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-500/30 ring-2 ring-rose-300'
                      : 'text-slate-300 hover:text-white bg-slate-800/60'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-rose-400" />
                  <span>RED RACER ({redScore}P)</span>
                </button>
              </div>

              {/* Active Mobile Console */}
              <div className="w-full bg-white rounded-2xl shadow-2xl border-2 border-slate-900 overflow-hidden max-h-[75vh]">
                <TeamConsolePanel teamId={mobileActiveTeam} />
              </div>
            </div>
          )}

          {/* Real-time WebGL Performance Diagnostics HUD */}
          <PerformanceMonitorOverlay />
        </main>

        {/* RIGHT PANEL: RED TEAM CONSOLE (Desktop/TV) */}
        {showSidePanels && !isMobileViewport && (
          <aside className="w-[280px] md:w-[320px] lg:w-[350px] xl:w-[380px] 2xl:w-[420px] max-w-[calc(50vw-20px)] h-full z-20 shadow-2xl border-l-3 border-slate-900 bg-white shrink-0">
            <TeamConsolePanel teamId="red" />
          </aside>
        )}
      </div>

      {/* ── 3. OVERLAYS & MODALS ── */}
      <PatternOverlays />
    </div>
  );
};
