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

import React, { useEffect } from 'react';
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
      factoryAudio.setMachines({
        conveyor: b.phase === 'running' || r.phase === 'running',
        mixer: runningStep('blue') === 'mixing' || runningStep('red') === 'mixing',
        truck: b.logistics === 'truck_out' || b.logistics === 'truck_back'
          || r.logistics === 'truck_out' || r.logistics === 'truck_back',
        forklift: b.logistics.startsWith('fork') || r.logistics.startsWith('fork'),
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

  useEffect(() => () => factoryAudio.shutdown(), []);
  useEffect(() => { factoryAudio.setMuted(muted); }, [muted]);

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden select-none bg-[#dbe9f6]">
      <AudioBridge />

      {/* ── TOP BAR ── */}
      <header className="relative z-30 shrink-0 flex items-center gap-3 px-3 py-1.5 bg-[#fdf6ec] border-b-4 border-amber-900/30 shadow">
        <button
          onPointerDown={() => router.push('/')}
          className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 border-2 border-amber-800/40 text-amber-950 font-black text-xs uppercase tracking-wider active:scale-95 transition"
        >
          ← ARCADE
        </button>
        <div className="min-w-0">
          <div className="text-[9px] xl:text-[10px] font-black uppercase tracking-[0.25em] text-amber-800/80">
            GRADE 6 · FRACTIONS
          </div>
          <div className="text-sm xl:text-lg font-black uppercase text-amber-950 leading-tight truncate">
            THE CHOCOLATE FACTORY
          </div>
        </div>

        {/* compact live comparison — the detail lives on the factory scoreboard */}
        <div className="ml-auto flex items-center gap-3">
          <div className="text-right">
            <div className="text-[9px] font-black uppercase tracking-widest text-blue-600">BLUE</div>
            <div className="text-sm xl:text-lg font-black tabular-nums text-blue-700 leading-none">
              {blue.ordersCompleted} orders
            </div>
          </div>
          <div className="w-px h-8 bg-amber-900/20" />
          <div>
            <div className="text-[9px] font-black uppercase tracking-widest text-red-600">RED</div>
            <div className="text-sm xl:text-lg font-black tabular-nums text-red-700 leading-none">
              {red.ordersCompleted} orders
            </div>
          </div>
          <button
            onPointerDown={toggleMute}
            className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 border-2 border-amber-800/40 text-amber-950 font-black text-xs uppercase active:scale-95 transition"
          >
            {muted ? 'SOUND OFF' : 'SOUND ON'}
          </button>
          <button
            onPointerDown={resetGame}
            className="px-3 py-1.5 rounded-xl bg-amber-900 hover:bg-amber-800 border-2 border-amber-950 text-white font-black text-xs uppercase active:scale-95 transition"
          >
            RESTART
          </button>
        </div>
      </header>

      {/* ── MAIN: FACTORY + PERMANENT CONSOLES ── */}
      <main className="relative flex-1 min-h-0">
        <FactoryScene3D />

        {phase !== 'intro' && (
          <>
            <div className="pointer-events-none absolute bottom-3 left-3 z-20 w-[24vw] min-w-[300px] max-w-[430px]">
              <TeamConsole team="blue" />
            </div>
            <div className="pointer-events-none absolute bottom-3 right-3 z-20 w-[24vw] min-w-[300px] max-w-[430px]">
              <TeamConsole team="red" />
            </div>
          </>
        )}

        <FactoryOverlays />
      </main>
    </div>
  );
};
