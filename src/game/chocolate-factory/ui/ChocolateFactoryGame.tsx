// ============================================================
// THE CHOCOLATE FACTORY — GAME SHELL
//
// Screen composition, fixed for the whole activity:
//
//   BLUE CONSOLE  |      3D CHOCOLATE FACTORY      |  RED CONSOLE
//   bottom-left   |        centre, always          |  bottom-right
//
// The two consoles are permanent operator stations. They are anchored in the
// bottom corners, sized to leave the middle of the screen — the factory — on
// show at all times, and they never unmount from the first mission to the
// final result.
// ============================================================

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FactoryScene3D } from '../world/FactoryScene3D';
import { TeamConsole } from './TeamConsole';
import { FactoryOverlays } from './FactoryOverlays';
import { useFactoryStore } from '../store/factoryStore';
import { drainEvents, runningStep, sim } from '../engine/factorySim';
import { factoryAudio } from '../engine/factoryAudio';

/** Feeds simulation events to the audio engine, outside the render loop. */
const AudioBridge: React.FC = () => {
  useEffect(() => {
    let raf = 0;
    const pump = () => {
      for (const e of drainEvents()) factoryAudio.onEvent(e);
      // Keep the running-machine sounds in step with the two factories.
      const b = sim.blue;
      const r = sim.red;
      const forkActive =
        b.logistics.startsWith('fork') ||
        r.logistics.startsWith('fork') ||
        b.forklift.task !== 'idle' ||
        r.forklift.task !== 'idle';

      factoryAudio.setForkliftActivity(forkActive ? 1 : 0);
      factoryAudio.setMachines({
        conveyor: b.phase === 'running' || r.phase === 'running',
        mixer: runningStep('blue') === 'mixing' || runningStep('red') === 'mixing',
        truck: b.logistics === 'truck_out' || b.logistics === 'truck_back'
          || r.logistics === 'truck_out' || r.logistics === 'truck_back',
        forklift: forkActive,
      });
      raf = requestAnimationFrame(pump);
    };
    raf = requestAnimationFrame(pump);
    return () => cancelAnimationFrame(raf);
  }, []);
  return null;
};

export const ChocolateFactoryGame: React.FC = () => {
  const router = useRouter();
  const phase = useFactoryStore((s) => s.phase);
  const muted = useFactoryStore((s) => s.muted);
  const toggleMute = useFactoryStore((s) => s.toggleMute);
  const resetGame = useFactoryStore((s) => s.resetGame);
  const blue = useFactoryStore((s) => s.blue);
  const red = useFactoryStore((s) => s.red);

  const [mobileActiveTeam, setMobileActiveTeam] = useState<'blue' | 'red'>('blue');
  const [isMobileViewport, setIsMobileViewport] = useState(false);

  useEffect(() => {
    const checkViewport = () => {
      setIsMobileViewport(window.innerWidth < 960);
    };
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  useEffect(() => {
    factoryAudio.startBgm();
    return () => factoryAudio.shutdown();
  }, []);
  useEffect(() => { factoryAudio.setMuted(muted); }, [muted]);

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden select-none bg-[#dbe9f6]">
      <AudioBridge />

      {/* ── TOP BAR ── */}
      <header className="relative z-30 shrink-0 flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1.5 bg-[#fdf6ec] border-b-4 border-amber-900/30 shadow flex-wrap sm:flex-nowrap">
        <button
          onPointerDown={() => router.push('/')}
          className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 border-2 border-amber-800/40 text-amber-950 font-black text-xs uppercase tracking-wider active:scale-95 transition cursor-pointer"
        >
          ← ARCADE
        </button>
        <div className="min-w-0">
          <div className="text-[9px] xl:text-[10px] font-black uppercase tracking-[0.25em] text-amber-800/80">
            GRADE 6 · FRACTIONS
          </div>
          <div className="text-xs sm:text-sm xl:text-lg font-black uppercase text-amber-950 leading-tight truncate">
            THE CHOCOLATE FACTORY
          </div>
        </div>

        {/* compact live comparison — the detail lives on the factory scoreboard */}
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <div className="text-right">
            <div className="text-[9px] font-black uppercase tracking-widest text-blue-600">BLUE</div>
            <div className="text-xs sm:text-sm xl:text-lg font-black tabular-nums text-blue-700 leading-none">
              {blue.ordersCompleted} orders
            </div>
          </div>
          <div className="w-px h-7 sm:h-8 bg-amber-900/20" />
          <div>
            <div className="text-[9px] font-black uppercase tracking-widest text-red-600">RED</div>
            <div className="text-xs sm:text-sm xl:text-lg font-black tabular-nums text-red-700 leading-none">
              {red.ordersCompleted} orders
            </div>
          </div>
          <button
            onPointerDown={toggleMute}
            className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 border-2 border-amber-800/40 text-amber-950 font-black text-xs uppercase active:scale-95 transition cursor-pointer"
          >
            {muted ? 'SOUND OFF' : 'SOUND ON'}
          </button>
          <button
            onPointerDown={resetGame}
            className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-amber-900 hover:bg-amber-800 border-2 border-amber-950 text-white font-black text-xs uppercase active:scale-95 transition cursor-pointer"
          >
            RESTART
          </button>
        </div>
      </header>

      {/* ── MAIN: FACTORY + PERMANENT CONSOLES ── */}
      <main className="relative flex-1 min-h-0">
        <FactoryScene3D />

        {/* ── PERMANENT DUAL OPERATOR CONSOLES ── */}
        {isMobileViewport ? (
          /* Mobile / Small Screen: Single active studio with quick team switcher */
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
                <span>BLUE FACTORY</span>
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
                <span>RED FACTORY</span>
              </button>
            </div>

            {/* Active Mobile Team Console */}
            <TeamConsole team={mobileActiveTeam} />
          </div>
        ) : (
          /* Desktop, Laptop, and TV Screens: Dual Side Panels at Bottom Corners */
          <>
            <div className="fixed z-30 bottom-3 left-3 w-[350px] md:w-[380px] lg:w-[410px] xl:w-[450px] 2xl:w-[480px] max-w-[calc(50vw-24px)] pointer-events-auto">
              <TeamConsole team="blue" />
            </div>
            <div className="fixed z-30 bottom-3 right-3 w-[350px] md:w-[380px] lg:w-[410px] xl:w-[450px] 2xl:w-[480px] max-w-[calc(50vw-24px)] pointer-events-auto">
              <TeamConsole team="red" />
            </div>
          </>
        )}

        <FactoryOverlays />
      </main>
    </div>
  );
};
