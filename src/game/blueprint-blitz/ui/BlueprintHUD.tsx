// ============================================================
// BLUEPRINT BLITZ — Physical Construction Site HUD & Project Signboard
// Features:
// - Ultra-Readable, High-Contrast Daytime Project Signboard at center top
// - Grade 6 Friendly Prompts, Clear Formulas & Helpful Hints
// - Industrial Top Gantry with LED countdown clock & site round badge
// - Blue Workstation on LEFT, Red Workstation on RIGHT
// - Zero visual clutter, 100% solid construction materials & vector iconography
// ============================================================

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Home,
  Volume2,
  VolumeX,
  Timer,
  Play,
  Hammer,
  RotateCcw,
  Ruler,
  HardHat,
  Lightbulb,
  Target,
} from 'lucide-react';
import { useBlueprintStore } from '../store/blueprintStore';
import { TeamControlPanel } from './TeamControlPanel';
import { ScannerResultCard } from './ScannerResultCard';
import { WinnerCeremony } from './WinnerCeremony';
import { blueprintAudio } from '../audio/blueprintAudio';

export const BlueprintHUD: React.FC = () => {
  const router = useRouter();
  const {
    phase,
    currentRound,
    maxRounds,
    timeRemaining,
    isTimerRunning,
    tickTimer,
    activeChallenge,
    blueTeam,
    redTeam,
    settings,
    toggleMute,
    startBriefing,
    startBuilding,
    restartGame,
  } = useBlueprintStore();

  // Shared Countdown Timer Interval
  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(() => {
      tickTimer();
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning, tickTimer]);

  const handleReturnToArcade = () => {
    blueprintAudio.stopBgm();
    router.push('/');
  };

  const isScanning = phase === 'scanning';
  const isUrgent = timeRemaining <= 10;

  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-3 sm:p-4 select-none">
      {/* ── TOP INDUSTRIAL GANTRY HEADER BAR (Daytime Styling) ── */}
      <header className="flex items-center justify-between w-full pointer-events-auto gap-3">
        {/* Left: Back to Arcade & Site Identity */}
        <div className="flex items-center gap-2.5 bg-[#fff8e7] px-3.5 py-2 rounded-2xl border-4 border-slate-950 shadow-xl">
          <button
            onClick={handleReturnToArcade}
            className="p-2 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black border-2 border-slate-950 shadow transition-all"
            title="Return to Arcade Lobby"
          >
            <Home className="w-4 h-4 stroke-[3]" />
          </button>

          <div className="flex flex-col pr-1">
            <span className="text-[10px] font-black tracking-widest text-amber-700 uppercase">
              ACTIVITY #04
            </span>
            <span className="text-sm sm:text-base font-black text-slate-950 tracking-wide flex items-center gap-1.5">
              <HardHat className="w-4 h-4 text-amber-600" />
              <span>BLUEPRINT BLITZ</span>
            </span>
          </div>
        </div>

        {/* Center: Mission Round & High-Contrast LED Timer */}
        <div className="flex items-center gap-2.5">
          {/* Round Counter Box */}
          <div className="bg-[#fff8e7] px-4 py-1.5 rounded-2xl border-4 border-slate-950 text-center shadow-xl">
            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest block">
              SITE PHASE
            </span>
            <span className="text-base font-black text-amber-700 font-mono">
              PROJECT {currentRound}/{maxRounds}
            </span>
          </div>

          {/* Central Countdown Timer Box */}
          <div
            className={`flex items-center gap-2 px-4 py-1.5 rounded-2xl border-4 border-slate-950 shadow-2xl transition-all ${
              isUrgent
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-amber-400 text-slate-950'
            }`}
          >
            <Timer className={`w-5 h-5 ${isUrgent ? 'text-white' : 'text-slate-950'}`} />
            <span className="text-xl sm:text-2xl font-black font-mono tracking-wider">
              {timeRemaining}s
            </span>
          </div>
        </div>

        {/* Right: Audio Control & Quick Restart */}
        <div className="flex items-center gap-2 bg-[#fff8e7] p-1.5 rounded-2xl border-4 border-slate-950 shadow-xl">
          <button
            onClick={toggleMute}
            className="p-2 rounded-xl bg-amber-100 hover:bg-amber-200 active:scale-95 text-slate-900 border-2 border-slate-950 transition-all"
            title={settings.isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {settings.isMuted ? (
              <VolumeX className="w-4 h-4 text-red-600 stroke-[2.5]" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-700 stroke-[2.5]" />
            )}
          </button>
        </div>
      </header>

      {/* ── ULTRA-READABLE DAYTIME PROJECT MISSION SIGNBOARD (Top-Center) ── */}
      {activeChallenge && phase !== 'intro' && phase !== 'game-over' && (
        <div className="self-center pointer-events-auto max-w-2xl w-full mx-auto -mt-1 bg-[#fffdf5] border-4 border-slate-950 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-950">
          {/* Top Yellow Header Bar */}
          <div className="bg-amber-400 px-4 py-1.5 border-b-3 border-slate-950 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Ruler className="w-4 h-4 text-slate-950" />
              <span className="text-xs sm:text-sm font-black tracking-wide text-slate-950 uppercase">
                📐 PROJECT #{currentRound}: {activeChallenge.title}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-slate-950 text-amber-300 uppercase">
                ★ {activeChallenge.basePoints} PTS
              </span>
            </div>
          </div>

          {/* Main Question Body & Clear Grade 6 Prompt */}
          <div className="p-3.5 flex flex-col gap-2 bg-white">
            {/* Main Prompt Text in Large Bold Type */}
            <h2 className="text-base sm:text-lg font-black text-slate-950 leading-snug tracking-tight">
              {activeChallenge.prompt}
            </h2>

            {/* Helpful Hint & Target Spec Strip */}
            <div className="bg-amber-50 border-2 border-amber-300 rounded-xl px-3.5 py-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-amber-950 font-bold">
                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{activeChallenge.missionBrief}</span>
              </div>
              <div className="flex items-center gap-1 bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-lg border border-slate-950 font-black shrink-0">
                <Target className="w-3.5 h-3.5" />
                <span>SPEC: {activeChallenge.target.description}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── DUAL-WORKSTATION BATTLE ARENA (BLUE LEFT, RED RIGHT, 64% CENTER) ── */}
      <div className="flex items-end justify-between w-full h-full pb-2 gap-4">
        {/* LEFT 18%: BLUE WORKSTATION CONSOLE */}
        <div className="pointer-events-auto flex flex-col justify-end">
          <TeamControlPanel
            teamId="blue"
            teamName={blueTeam.name}
            score={blueTeam.score}
            build={blueTeam.build}
            mechanic={activeChallenge?.mechanic || 'floor'}
            isLocked={blueTeam.build.isLocked || isScanning || phase !== 'building'}
            isConfirmed={blueTeam.build.isConfirmed}
          />
        </div>

        {/* CENTER 64%: 3D CONSTRUCTION SITE VIEWPORT */}
        <div className="flex-1 pointer-events-none flex items-center justify-center">
          {/* Active Site Inspector Scan Indicator */}
          {isScanning && (
            <div className="bg-[#fff8e7] border-4 border-slate-950 px-8 py-4 rounded-3xl text-center shadow-2xl animate-pulse pointer-events-auto">
              <div className="text-xs font-black tracking-widest text-amber-700 uppercase flex items-center justify-center gap-1.5">
                <span>⚡</span>
                <span>SITE INSPECTOR GANTRY ACTIVE</span>
              </div>
              <div className="text-2xl font-black text-slate-950 mt-1">
                SCANNING PHYSICAL DIMENSIONS...
              </div>
            </div>
          )}
        </div>

        {/* RIGHT 18%: RED WORKSTATION CONSOLE */}
        <div className="pointer-events-auto flex flex-col justify-end">
          <TeamControlPanel
            teamId="red"
            teamName={redTeam.name}
            score={redTeam.score}
            build={redTeam.build}
            mechanic={activeChallenge?.mechanic || 'floor'}
            isLocked={redTeam.build.isLocked || isScanning || phase !== 'building'}
            isConfirmed={redTeam.build.isConfirmed}
          />
        </div>
      </div>

      {/* ── INTRO / SITE INDUCTION MODAL ── */}
      {phase === 'intro' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/75 backdrop-blur-sm pointer-events-auto select-none">
          <div className="w-full max-w-2xl bg-[#fff8e7] border-4 border-slate-950 rounded-3xl p-8 shadow-2xl flex flex-col items-center gap-6 text-center text-slate-950">
            <div className="w-20 h-20 rounded-2xl bg-amber-400 flex items-center justify-center text-slate-950 text-4xl shadow-xl border-4 border-slate-950">
              🏗️
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mb-1">
                <HardHat className="w-5 h-5 text-amber-600" />
                <span className="text-xs font-black tracking-widest text-amber-700 uppercase">
                  SKILLIZEE ARCADE • ACTIVITY #04
                </span>
              </div>
              <h1 className="text-4xl font-black text-slate-950 tracking-tight">
                BLUEPRINT BLITZ
              </h1>
              <p className="text-base text-amber-800 font-black mt-1 uppercase tracking-wider">
                BUILD IT • MEASURE IT • BEAT THE CLOCK
              </p>
              <p className="text-sm text-slate-700 mt-4 leading-relaxed max-w-lg mx-auto font-medium">
                Step onto the live sunny 3D construction site! Blue Team (Left) and Red Team (Right) operate physical workstations, manipulate floor dimensions, stack 3D unit cubes, select building materials, and satisfy precision blueprint tolerances.
              </p>
            </div>

            <button
              onClick={startBriefing}
              className="py-4 px-8 rounded-2xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black text-lg uppercase tracking-wider flex items-center gap-3 shadow-xl transition-all border-3 border-slate-950"
            >
              <span>ENTER WORK SITE & START</span>
              <Play className="w-6 h-6 fill-current" />
            </button>
          </div>
        </div>
      )}

      {/* ── PROJECT BRIEFING MODAL ── */}
      {phase === 'briefing' && activeChallenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/75 backdrop-blur-sm pointer-events-auto select-none">
          <div className="w-full max-w-2xl bg-[#fff8e7] border-4 border-slate-950 rounded-3xl p-8 shadow-2xl flex flex-col gap-5 text-slate-950">
            <div className="flex items-center justify-between border-b-2 border-slate-300 pb-3">
              <div className="flex items-center gap-2">
                <Ruler className="w-5 h-5 text-amber-600" />
                <span className="text-xs font-black tracking-wider text-amber-700 uppercase">
                  SITE BRIEFING • {activeChallenge.code}
                </span>
              </div>
              <span className="text-xs font-black px-3 py-1 rounded-lg bg-amber-400 text-slate-950 uppercase border-2 border-slate-950">
                ★ {activeChallenge.basePoints} PTS
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-950">
                {activeChallenge.title}
              </h2>
              <p className="text-lg font-bold text-amber-800 mt-2">
                {activeChallenge.prompt}
              </p>
              <p className="text-sm text-slate-700 mt-2 leading-relaxed font-medium">
                {activeChallenge.missionBrief}
              </p>
            </div>

            <div className="bg-white p-3.5 rounded-xl border-2 border-slate-300 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-600 uppercase tracking-wide">TIME LIMIT:</span>
              <span className="font-black text-amber-700 text-sm font-mono">
                ⏳ {activeChallenge.timeLimit} SECONDS
              </span>
            </div>

            <button
              onClick={startBuilding}
              className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-white font-black text-lg uppercase tracking-wider flex items-center justify-center gap-3 shadow-xl transition-all border-3 border-slate-950"
            >
              <span>COMMENCE CONSTRUCTION</span>
              <Hammer className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* ── ROUND SCANNER RESULT MODAL ── */}
      {phase === 'round-result' && (
        <div className="pointer-events-auto">
          <ScannerResultCard />
        </div>
      )}

      {/* ── WINNER PODIUM CEREMONY ── */}
      {phase === 'game-over' && (
        <div className="pointer-events-auto">
          <WinnerCeremony />
        </div>
      )}
    </div>
  );
};
