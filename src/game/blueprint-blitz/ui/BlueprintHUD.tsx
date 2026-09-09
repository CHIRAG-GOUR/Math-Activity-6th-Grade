// ============================================================
// BLUEPRINT BLITZ — Main HUD Interface Component
// Strict Layout Architecture:
// - Left 18%: Blue Team Control Panel (LEFT)
// - Center 64%: Live 3D Construction District Viewport
// - Right 18%: Red Team Control Panel (RIGHT)
// - Top Bar: Shared Timer, Round Counter, Audio & Back to Arcade
// - Physical Architectural Blueprint Board at top-center
// ============================================================

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Home,
  Volume2,
  VolumeX,
  Timer,
  FileText,
  Play,
  Hammer,
  Zap,
  RotateCcw,
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
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-4 select-none">
      {/* ── TOP STAGE HEADER BAR ── */}
      <header className="flex items-center justify-between w-full pointer-events-auto gap-4">
        {/* Left: Back to Arcade & Game Title */}
        <div className="flex items-center gap-3 bg-slate-900/90 p-2 rounded-2xl border-2 border-slate-700 shadow-xl backdrop-blur-md">
          <button
            onClick={handleReturnToArcade}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 hover:text-white border border-slate-600 transition-all"
            title="Return to Arcade Lobby"
          >
            <Home className="w-5 h-5" />
          </button>

          <div className="flex flex-col pr-2">
            <span className="text-xs font-black tracking-widest text-amber-400 uppercase">
              ACTIVITY #04
            </span>
            <span className="text-base font-black text-white tracking-wide flex items-center gap-1.5">
              <span>🏗️</span> BLUEPRINT BLITZ
            </span>
          </div>
        </div>

        {/* Center: Shared Timer & Round Badge */}
        <div className="flex items-center gap-3">
          {/* Round Counter */}
          <div className="bg-slate-900/90 px-4 py-2 rounded-2xl border-2 border-slate-700 text-center shadow-xl">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
              MISSION ROUND
            </span>
            <span className="text-lg font-black text-amber-400">
              {currentRound} / {maxRounds}
            </span>
          </div>

          {/* Central Countdown Timer */}
          <div
            className={`flex items-center gap-2.5 px-5 py-2 rounded-2xl border-4 shadow-2xl transition-all ${
              isUrgent
                ? 'bg-red-950/90 border-red-500 text-red-300 animate-pulse'
                : 'bg-slate-900/90 border-amber-400 text-amber-300'
            }`}
          >
            <Timer className={`w-6 h-6 ${isUrgent ? 'text-red-400' : 'text-amber-400'}`} />
            <span className="text-2xl font-black font-mono tracking-wider">
              {timeRemaining}s
            </span>
          </div>
        </div>

        {/* Right: Audio Control */}
        <div className="flex items-center gap-2 bg-slate-900/90 p-2 rounded-2xl border-2 border-slate-700 shadow-xl backdrop-blur-md">
          <button
            onClick={toggleMute}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 hover:text-white border border-slate-600 transition-all"
            title={settings.isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {settings.isMuted ? (
              <VolumeX className="w-5 h-5 text-red-400" />
            ) : (
              <Volume2 className="w-5 h-5 text-emerald-400" />
            )}
          </button>
        </div>
      </header>

      {/* ── CENTRAL TOP ARCHITECTURAL BLUEPRINT BOARD ── */}
      {activeChallenge && phase !== 'intro' && phase !== 'game-over' && (
        <div className="self-center pointer-events-auto max-w-xl w-full mx-auto -mt-2 bg-slate-900/95 border-4 border-amber-400 rounded-2xl p-3.5 shadow-2xl text-slate-100 flex flex-col gap-1.5">
          <div className="flex items-center justify-between border-b border-slate-700 pb-1.5">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-black tracking-wider text-amber-300 uppercase">
                {activeChallenge.code} • {activeChallenge.title}
              </span>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-900/80 text-blue-200 border border-blue-600 uppercase">
              {activeChallenge.category}
            </span>
          </div>

          <p className="text-sm font-black text-white leading-tight">
            {activeChallenge.prompt}
          </p>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-0.5">
            <span className="font-bold text-amber-400">
              TARGET: {activeChallenge.target.description}
            </span>
            <span className="text-[11px] text-slate-400 italic">
              {activeChallenge.allowedSolutionsDescription}
            </span>
          </div>
        </div>
      )}

      {/* ── MAIN HORIZONTAL BATTLE ARENA (BLUE ON LEFT, RED ON RIGHT) ── */}
      <div className="flex items-end justify-between w-full h-full pb-4 gap-4">
        {/* LEFT 18%: BLUE TEAM PANEL */}
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

        {/* CENTER 64%: 3D CONSTRUCTION SITE (Transparent for Canvas interaction) */}
        <div className="flex-1 pointer-events-none flex items-center justify-center">
          {/* Active Scanner Scanning Indicator Banner */}
          {isScanning && (
            <div className="bg-cyan-950/90 border-4 border-cyan-400 px-8 py-4 rounded-3xl text-center shadow-2xl animate-pulse">
              <div className="text-xs font-black tracking-widest text-cyan-300 uppercase">
                MEASUREMENT GANTRY ACTIVE
              </div>
              <div className="text-2xl font-black text-white mt-1">
                ⚡ SCANNING STRUCTURES...
              </div>
            </div>
          )}
        </div>

        {/* RIGHT 18%: RED TEAM PANEL */}
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

      {/* ── INTRO / BRIEFING OVERLAY MODAL ── */}
      {phase === 'intro' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md pointer-events-auto">
          <div className="w-full max-w-2xl bg-slate-900 border-4 border-amber-400 rounded-3xl p-8 shadow-2xl flex flex-col items-center gap-6 text-center text-slate-100">
            <div className="w-20 h-20 rounded-2xl bg-amber-400 flex items-center justify-center text-4xl shadow-xl">
              🏗️
            </div>
            <div>
              <span className="text-xs font-black tracking-widest text-amber-400 uppercase">
                SKILLIZEE ARCADE • ACTIVITY #04
              </span>
              <h1 className="text-4xl font-black text-white tracking-tight mt-1">
                BLUEPRINT BLITZ
              </h1>
              <p className="text-base text-amber-300 font-bold mt-1">
                BUILD IT • MEASURE IT • BEAT THE CLOCK
              </p>
              <p className="text-sm text-slate-300 mt-4 leading-relaxed max-w-lg mx-auto">
                Two construction teams compete in a live 3D architectural district! Manipulate physical floor dimensions, stack 3D unit cubes, operate cranes, and pass precision measurement scanners.
              </p>
            </div>

            <button
              onClick={startBriefing}
              className="py-4 px-8 rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-lg uppercase tracking-wider flex items-center gap-3 shadow-xl transition-all"
            >
              <span>ENTER SITE & START</span>
              <Play className="w-6 h-6 fill-current" />
            </button>
          </div>
        </div>
      )}

      {/* ── MISSION BRIEFING MODAL ── */}
      {phase === 'briefing' && activeChallenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md pointer-events-auto">
          <div className="w-full max-w-2xl bg-slate-900 border-4 border-amber-400 rounded-3xl p-8 shadow-2xl flex flex-col gap-5 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-wider text-amber-400 uppercase">
                  ROUND {currentRound} BRIEFING • {activeChallenge.code}
                </span>
              </div>
              <span className="text-xs font-black px-2.5 py-1 rounded bg-amber-400 text-slate-950 uppercase">
                ★ {activeChallenge.basePoints} PTS
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-black text-white">
                {activeChallenge.title}
              </h2>
              <p className="text-lg font-bold text-amber-300 mt-2">
                {activeChallenge.prompt}
              </p>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                {activeChallenge.missionBrief}
              </p>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-400">TIME LIMIT:</span>
              <span className="font-black text-amber-300 text-sm">
                ⏳ {activeChallenge.timeLimit} SECONDS
              </span>
            </div>

            <button
              onClick={startBuilding}
              className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-white font-black text-lg uppercase tracking-wider flex items-center justify-center gap-3 shadow-xl transition-all"
            >
              <span>COMMENCE CONSTRUCTION</span>
              <Hammer className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* ── ROUND RESULT MODAL ── */}
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
