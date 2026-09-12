// ============================================================
// PATTERN RACERS — Live Grand Prix Cockpit HUD & 3-2-1 Countdown
// HARD REQUIREMENT:
// - Controls HUD appears ONLY at countdown "3" and during live race.
// - Hidden completely during Questions 1-4.
// - Giant 3-2-1-GO visual countdown.
// - Split Dual Cockpit Controls for Blue (Left) & Red (Right) Teams.
// - Head Start launch restraint timer for trailing team.
// ============================================================

'use client';

import React from 'react';
import { usePatternStore } from '../store/patternStore';
import {
  Gauge,
  Flame,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Zap,
  Timer,
  Flag,
} from 'lucide-react';

export const NFSMostWantedRaceHUD: React.FC = () => {
  const phase = usePatternStore((s) => s.phase);
  const countdownValue = usePatternStore((s) => s.countdownValue);
  const raceWinner = usePatternStore((s) => s.raceWinner);

  const blueTeam = usePatternStore((s) => s.blueTeam);
  const redTeam = usePatternStore((s) => s.redTeam);

  const pressThrottle = usePatternStore((s) => s.pressThrottle);
  const releaseThrottle = usePatternStore((s) => s.releaseThrottle);
  const pressBrake = usePatternStore((s) => s.pressBrake);
  const releaseBrake = usePatternStore((s) => s.releaseBrake);
  const startSteering = usePatternStore((s) => s.startSteering);
  const stopSteering = usePatternStore((s) => s.stopSteering);
  const triggerNitro = usePatternStore((s) => s.triggerNitro);

  // HARD RULE: Only show when countdown has started or during live race
  const isVisible = phase === 'pre_race_countdown' || phase === 'grand_prix_race';

  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 z-30 pointer-events-none select-none flex flex-col justify-between p-4">
      {/* ── 1. GIANT PHYSICAL 3-2-1-GO COUNTDOWN ── */}
      {countdownValue !== null && (
        <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div
            key={`cd-${countdownValue}`}
            className="animate-in zoom-in-50 duration-300 flex flex-col items-center justify-center"
          >
            <div className="text-[120px] font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-amber-300 via-amber-400 to-orange-600 drop-shadow-[0_15px_35px_rgba(245,158,11,0.8)]">
              {countdownValue}
            </div>
            <div className="px-6 py-2 rounded-2xl bg-slate-950/90 border-2 border-amber-400 text-amber-300 font-extrabold text-sm uppercase tracking-widest shadow-2xl">
              {countdownValue === 'GO' ? 'RACE DUEL ENGAGED!' : 'CONTROLS ACTIVE — PREPARE LAUNCH'}
            </div>
          </div>
        </div>
      )}

      {/* ── 2. TOP RACE BANNER & TELEMETRY ── */}
      <div className="w-full flex items-center justify-between px-6 pt-2">
        {/* Blue Team Race Mini Banner */}
        <div className="px-4 py-2 rounded-2xl bg-blue-950/90 backdrop-blur-md border-2 border-blue-500 shadow-lg flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-blue-400 animate-ping" />
          <div>
            <div className="text-[10px] font-extrabold text-blue-300 uppercase tracking-widest">BLUE VELOCITY #01</div>
            <div className="text-sm font-black text-white">{blueTeam.raceControls.speedKmh} KM/H</div>
          </div>
        </div>

        {/* Center Finish Progress */}
        <div className="px-5 py-1.5 rounded-full bg-slate-950/90 backdrop-blur-md border border-slate-700 text-xs font-black text-amber-400 uppercase tracking-widest flex items-center gap-2">
          <Flag className="w-4 h-4 text-amber-400" />
          <span>750M GRAND PRIX SPRINT</span>
        </div>

        {/* Red Team Race Mini Banner */}
        <div className="px-4 py-2 rounded-2xl bg-red-950/90 backdrop-blur-md border-2 border-red-500 shadow-lg flex items-center gap-3">
          <div className="text-right">
            <div className="text-[10px] font-extrabold text-red-300 uppercase tracking-widest">RED TURBO #02</div>
            <div className="text-sm font-black text-white">{redTeam.raceControls.speedKmh} KM/H</div>
          </div>
          <div className="w-3 h-3 rounded-full bg-red-400 animate-ping" />
        </div>
      </div>

      {/* ── 3. DUAL-TEAM COCKPIT CONTROLS (LEFT FOR BLUE | RIGHT FOR RED) ── */}
      <div className="w-full flex items-end justify-between pb-2">
        {/* ── BLUE TEAM CONTROLS (LEFT) ── */}
        <div className="pointer-events-auto flex flex-col gap-3 p-4 rounded-3xl bg-slate-950/90 backdrop-blur-xl border-2 border-blue-500/80 shadow-2xl w-80">
          <div className="flex items-center justify-between border-b border-blue-900/60 pb-2">
            <span className="font-black text-xs text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
              <Gauge className="w-4 h-4" />
              BLUE RACER COCKPIT
            </span>
            {blueTeam.raceControls.isHeldByHeadStart && (
              <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 text-[10px] font-black animate-pulse">
                HOLDING: 3.5s HEAD START
              </span>
            )}
          </div>

          {/* Throttle / Brake / Steer Touch Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onPointerDown={() => startSteering('blue', 'left')}
              onPointerUp={() => stopSteering('blue')}
              className="h-16 rounded-2xl bg-blue-900/40 hover:bg-blue-800/60 active:bg-blue-600 border border-blue-500/50 text-white font-black flex items-center justify-center shadow-lg transition active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-7 h-7" />
            </button>

            <div className="flex flex-col gap-2">
              <button
                onPointerDown={() => pressThrottle('blue')}
                onPointerUp={() => releaseThrottle('blue')}
                disabled={blueTeam.raceControls.isHeldByHeadStart}
                className="h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-400 border border-emerald-300 text-white font-black flex flex-col items-center justify-center shadow-lg transition active:scale-95 cursor-pointer disabled:opacity-40"
              >
                <ArrowUp className="w-5 h-5" />
                <span className="text-[10px] uppercase">GAS</span>
              </button>

              <button
                onPointerDown={() => pressBrake('blue')}
                onPointerUp={() => releaseBrake('blue')}
                className="h-10 rounded-2xl bg-red-900/50 hover:bg-red-800/60 active:bg-red-600 border border-red-500/50 text-white font-black flex items-center justify-center shadow-md transition active:scale-95 cursor-pointer"
              >
                <ArrowDown className="w-4 h-4" />
                <span className="text-[9px] uppercase">BRAKE</span>
              </button>
            </div>

            <button
              onPointerDown={() => startSteering('blue', 'right')}
              onPointerUp={() => stopSteering('blue')}
              className="h-16 rounded-2xl bg-blue-900/40 hover:bg-blue-800/60 active:bg-blue-600 border border-blue-500/50 text-white font-black flex items-center justify-center shadow-lg transition active:scale-95 cursor-pointer"
            >
              <ArrowRight className="w-7 h-7" />
            </button>
          </div>

          {/* Nitro Boost Button */}
          <button
            onClick={() => triggerNitro('blue')}
            disabled={blueTeam.raceControls.nitroCharges <= 0 || blueTeam.raceControls.nitroActive}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-98 text-white font-black text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(6,182,212,0.6)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
          >
            <Flame className="w-4 h-4 text-amber-300 animate-bounce" />
            <span>NITROUS BOOST ({blueTeam.raceControls.nitroCharges} LEFT)</span>
          </button>
        </div>

        {/* ── RED TEAM CONTROLS (RIGHT) ── */}
        <div className="pointer-events-auto flex flex-col gap-3 p-4 rounded-3xl bg-slate-950/90 backdrop-blur-xl border-2 border-red-500/80 shadow-2xl w-80">
          <div className="flex items-center justify-between border-b border-red-900/60 pb-2">
            <span className="font-black text-xs text-red-400 uppercase tracking-wider flex items-center gap-1.5">
              <Gauge className="w-4 h-4" />
              RED RACER COCKPIT
            </span>
            {redTeam.raceControls.isHeldByHeadStart && (
              <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 text-[10px] font-black animate-pulse">
                HOLDING: 3.5s HEAD START
              </span>
            )}
          </div>

          {/* Throttle / Brake / Steer Touch Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onPointerDown={() => startSteering('red', 'left')}
              onPointerUp={() => stopSteering('red')}
              className="h-16 rounded-2xl bg-red-900/40 hover:bg-red-800/60 active:bg-red-600 border border-red-500/50 text-white font-black flex items-center justify-center shadow-lg transition active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-7 h-7" />
            </button>

            <div className="flex flex-col gap-2">
              <button
                onPointerDown={() => pressThrottle('red')}
                onPointerUp={() => releaseThrottle('red')}
                disabled={redTeam.raceControls.isHeldByHeadStart}
                className="h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-400 border border-emerald-300 text-white font-black flex flex-col items-center justify-center shadow-lg transition active:scale-95 cursor-pointer disabled:opacity-40"
              >
                <ArrowUp className="w-5 h-5" />
                <span className="text-[10px] uppercase">GAS</span>
              </button>

              <button
                onPointerDown={() => pressBrake('red')}
                onPointerUp={() => releaseBrake('red')}
                className="h-10 rounded-2xl bg-red-900/50 hover:bg-red-800/60 active:bg-red-600 border border-red-500/50 text-white font-black flex items-center justify-center shadow-md transition active:scale-95 cursor-pointer"
              >
                <ArrowDown className="w-4 h-4" />
                <span className="text-[9px] uppercase">BRAKE</span>
              </button>
            </div>

            <button
              onPointerDown={() => startSteering('red', 'right')}
              onPointerUp={() => stopSteering('red')}
              className="h-16 rounded-2xl bg-red-900/40 hover:bg-red-800/60 active:bg-red-600 border border-red-500/50 text-white font-black flex items-center justify-center shadow-lg transition active:scale-95 cursor-pointer"
            >
              <ArrowRight className="w-7 h-7" />
            </button>
          </div>

          {/* Nitro Boost Button */}
          <button
            onClick={() => triggerNitro('red')}
            disabled={redTeam.raceControls.nitroCharges <= 0 || redTeam.raceControls.nitroActive}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 active:scale-98 text-white font-black text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(239,68,68,0.6)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
          >
            <Flame className="w-4 h-4 text-amber-300 animate-bounce" />
            <span>NITROUS BOOST ({redTeam.raceControls.nitroCharges} LEFT)</span>
          </button>
        </div>
      </div>

      {/* ── 4. WINNER PODIUM MODAL ON FINISH ── */}
      {raceWinner && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-slate-950/80 backdrop-blur-md pointer-events-auto">
          <div className="p-8 rounded-3xl bg-slate-900 border-2 border-amber-400 shadow-2xl text-center flex flex-col items-center gap-4 max-w-md animate-in zoom-in-75">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-3xl">
              🏆
            </div>
            <div className="text-2xl font-black text-white uppercase tracking-wider">
              {raceWinner === 'blue' ? 'BLUE VELOCITY #01 WINS!' : 'RED TURBO #02 WINS!'}
            </div>
            <p className="text-sm text-slate-300 font-medium">
              Championship victory secured! Outstanding sequence calculation and race execution.
            </p>
            <button
              onClick={() => usePatternStore.getState().resetGame()}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-sm uppercase tracking-widest shadow-xl hover:brightness-110 active:scale-95 cursor-pointer"
            >
              RACE AGAIN (RESTART)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
