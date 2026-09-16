'use client';

// ============================================================
// THE SOLAR FORGE: Main Activity Container Component
// Bridges 3D Canvas world, Top Header, and bottom-corner Team Consoles
// ============================================================

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { SolarForgeHeader } from './SolarForgeHeader';
import { SolarTeamConsole } from './SolarTeamConsole';
import { BriefingModal } from './BriefingModal';
import { SolarForgeVictoryCinematic } from './SolarForgeVictoryCinematic';

const SolarForgeScene3D = dynamic(
  () => import('../world/SolarForgeScene3D').then((m) => m.SolarForgeScene3D),
  { ssr: false }
);

export const SolarForgeGame: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [mobileActiveTeam, setMobileActiveTeam] = useState<'blue' | 'red'>('blue');
  const [isMobileViewport, setIsMobileViewport] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkViewport = () => {
      setIsMobileViewport(window.innerWidth < 960);
    };
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  if (!mounted) return null;

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#bae6fd] select-none font-sans">
      {/* ── 3D SUNLIT VALLEY & SOLAR FORGE WORLD (Canvas) ── */}
      <div className="absolute inset-0 z-0">
        <SolarForgeScene3D />
      </div>

      {/* ── TOP TELEMETRY & CONTROLS HEADER ── */}
      <SolarForgeHeader />

      {/* ── RESPONSIVE DUAL-CONSOLE / MOBILE-TOGGLE LAYOUT ── */}
      {isMobileViewport ? (
        /* Mobile / Small Screen: Single active console with quick team switcher */
        <div className="fixed z-30 bottom-2 left-2 right-2 max-w-lg mx-auto pointer-events-auto flex flex-col gap-1.5">
          {/* Mobile Team Toggle Bar */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1 rounded-xl shadow-lg border border-slate-700/80">
            <button
              type="button"
              onClick={() => setMobileActiveTeam('blue')}
              className={`flex-1 py-1.5 px-3 rounded-lg font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mobileActiveTeam === 'blue'
                  ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-md shadow-sky-500/30 ring-2 ring-sky-300'
                  : 'text-slate-300 hover:text-white bg-slate-800/60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              <span>HELIO SQUADRON</span>
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
              <span>SOLAR CORPS</span>
            </button>
          </div>

          {/* Active Mobile Team Console */}
          <SolarTeamConsole team={mobileActiveTeam} />
        </div>
      ) : (
        /* Desktop, Laptop, and TV Screens: Dual Side Panels at Bottom Corners */
        <>
          {/* ── BOTTOM-LEFT: BLUE HELIO SQUADRON CONSOLE ── */}
          <div className="fixed z-30 bottom-2.5 left-2.5 w-[340px] md:w-[370px] lg:w-[400px] xl:w-[440px] 2xl:w-[480px] max-w-[calc(50vw-20px)] pointer-events-auto">
            <SolarTeamConsole team="blue" />
          </div>

          {/* ── BOTTOM-RIGHT: RED SOLAR CORPS CONSOLE ── */}
          <div className="fixed z-30 bottom-2.5 right-2.5 w-[340px] md:w-[370px] lg:w-[400px] xl:w-[440px] 2xl:w-[480px] max-w-[calc(50vw-20px)] pointer-events-auto">
            <SolarTeamConsole team="red" />
          </div>
        </>
      )}

      {/* ── BRIEFING INTRODUCTION MODAL ── */}
      <BriefingModal />

      {/* ── SOLAR FORGE ONLINE CINEMATIC ── */}
      <SolarForgeVictoryCinematic />
    </main>
  );
};
