'use client';

// ============================================================
// THE SOLAR FORGE: Top Navigation & Facility Telemetry Header
// Solar trajectory status, Central Forge Power level,
// audio toggle, restart button & arcade hub exit
// ============================================================

import React, { useState } from 'react';
import Link from 'next/link';
import { useSolarForgeStore } from '../store/solarForgeStore';
import { solarAudio } from '../audio/solarAudio';

export const SolarForgeHeader: React.FC = () => {
  const sun = useSolarForgeStore((s) => s.sun);
  const forge = useSolarForgeStore((s) => s.solarForge);
  const blue = useSolarForgeStore((s) => s.blue);
  const red = useSolarForgeStore((s) => s.red);
  const restartChallenge = useSolarForgeStore((s) => s.restartChallenge);
  const [isMuted, setIsMuted] = useState(false);

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    solarAudio.setMuted(next);
  };

  return (
    <header className="fixed top-2 left-3 right-3 z-30 flex items-center justify-between pointer-events-none select-none">
      {/* ── LEFT: TITLE & ARCADE LINK ── */}
      <div className="flex items-center gap-2 pointer-events-auto">
        <Link
          href="/"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 hover:bg-white text-slate-700 hover:text-slate-950 font-bold text-xs rounded-xl shadow-sm border border-slate-200 transition-all active:scale-95"
        >
          <span className="text-sm">←</span>
          <span>Arcade Hub</span>
        </Link>

        <div className="bg-white/90 backdrop-blur-md border border-slate-200 px-3.5 py-1.5 rounded-xl shadow-sm flex items-center gap-2">
          <span className="text-amber-500 text-sm">☀️</span>
          <span className="font-extrabold text-xs tracking-wider text-slate-800 uppercase">
            THE SOLAR FORGE
          </span>
          <span className="hidden sm:inline-block text-[11px] font-semibold text-slate-500">
            • Grade 6 Angles & Constructions
          </span>
        </div>
      </div>

      {/* ── CENTER: SUN & SOLAR FORGE POWER TELEMETRY ── */}
      <div className="hidden md:flex items-center gap-3 bg-white/95 backdrop-blur-md border border-amber-300 px-4 py-1.5 rounded-2xl shadow-md pointer-events-auto">
        {/* Precision Solar Watch & Telemetry */}
        <div className="flex items-center gap-2 text-xs font-black text-slate-800">
          <div className="w-5 h-5 rounded-full border-2 border-amber-500 bg-amber-50 flex items-center justify-center relative shadow-xs">
            <div className="w-1.5 h-0.5 bg-amber-700 absolute top-2 right-1.5 origin-left" />
            <div className="w-0.5 h-2 bg-amber-900 absolute top-1 origin-bottom" />
            <div className="w-1 h-1 rounded-full bg-amber-600 z-10" />
          </div>
          <span className="tracking-wide text-slate-900 text-sm font-extrabold tabular-nums">
            {sun.timeString}
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded-md text-[11px] font-bold">
            ☀️ {sun.elevationDeg}° ELEVATION
          </span>
          <span className="text-sky-800 bg-sky-100/90 px-2 py-0.5 rounded-md text-[11px] font-bold">
            🧭 {sun.azimuthDeg}° AZIMUTH
          </span>
        </div>

        <span className="text-slate-300">|</span>

        {/* Central Solar Forge Power Bar */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-600 uppercase">Forge Core:</span>
          <div className="w-24 h-2.5 bg-slate-200 rounded-full overflow-hidden flex">
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 transition-all duration-500"
              style={{ width: `${forge.powerLevel}%` }}
            />
          </div>
          <span className="text-xs font-black text-amber-600 tabular-nums">
            {forge.powerLevel}%
          </span>
        </div>
      </div>

      {/* ── RIGHT: SQUADRON POWER COMPARISON & SYSTEM CONTROLS ── */}
      <div className="flex items-center gap-2 pointer-events-auto">
        {/* Blue vs Red Megawatt pill */}
        <div className="flex items-center bg-white/90 backdrop-blur-md border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm gap-2 text-xs font-black">
          <span className="text-sky-600">{blue.energyMegawatts} MW</span>
          <span className="text-slate-300">vs</span>
          <span className="text-red-600">{red.energyMegawatts} MW</span>
        </div>


        {/* BGM 30% & Sound Toggle */}
        <button
          onClick={toggleSound}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 border rounded-xl shadow-sm text-xs font-bold transition-all active:scale-95 ${
            isMuted
              ? 'bg-slate-100 text-slate-400 border-slate-300'
              : 'bg-white/95 text-amber-800 border-amber-300 hover:bg-amber-50'
          }`}
          title={isMuted ? 'Unmute Audio & BGM' : 'Mute Audio & BGM (Currently 30%)'}
        >
          <span>{isMuted ? '🔇' : '🎵'}</span>
          <span className="hidden sm:inline font-extrabold">{isMuted ? 'OFF' : 'BGM 30%'}</span>
        </button>

        {/* Restart Button */}
        <button
          onClick={restartChallenge}
          className="px-2.5 py-1.5 bg-white/90 hover:bg-white border border-slate-200 rounded-xl shadow-sm text-xs font-bold text-slate-700 hover:text-slate-900 transition-all active:scale-95"
          title="Restart Challenge"
        >
          ↺ Reset
        </button>
      </div>
    </header>
  );
};
