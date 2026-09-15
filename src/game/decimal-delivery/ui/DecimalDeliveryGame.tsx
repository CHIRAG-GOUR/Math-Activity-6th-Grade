// ============================================================
// THE DECIMAL DELIVERY NETWORK — GAME SHELL
//
// 16:9 classroom layout: Blue console LEFT, the live depot in the CENTRE,
// Red console RIGHT. Never stacked, and the 3D world is never buried under a
// full-screen panel — the consoles are side rails so the depot stays visible.
// ============================================================

'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DepotScene3D } from '../world/DepotScene3D';
import { TeamConsole } from './TeamConsole';
import { DepotOverlays } from './DepotOverlays';
import { useDepotStore } from '../store/depotStore';
import { ROUND_TITLES, ROUND_BRIEFS } from '../engine/questionEngine';
import { depotAudio } from '../engine/depotAudio';
import { drainEvents } from '../engine/depotSim';

/** Bridges simulation events to the audio engine, outside the render loop. */
const AudioBridge: React.FC = () => {
  useEffect(() => {
    let raf = 0;
    const pump = () => {
      for (const { event } of drainEvents()) depotAudio.onSimEvent(event);
      raf = requestAnimationFrame(pump);
    };
    raf = requestAnimationFrame(pump);
    return () => cancelAnimationFrame(raf);
  }, []);
  return null;
};

export const DecimalDeliveryGame: React.FC = () => {
  const router = useRouter();
  const phase = useDepotStore((s) => s.phase);
  const round = useDepotStore((s) => s.round);
  const blue = useDepotStore((s) => s.blue);
  const red = useDepotStore((s) => s.red);
  const muted = useDepotStore((s) => s.muted);
  const toggleMute = useDepotStore((s) => s.toggleMute);
  const resetGame = useDepotStore((s) => s.resetGame);

  // Stop the soundtrack when the player leaves the activity.
  useEffect(() => () => depotAudio.shutdown(), []);

  useEffect(() => { depotAudio.setMuted(muted); }, [muted]);

  const showConsoles = phase !== 'intro';

  return (
    <div className="fixed inset-0 flex flex-col bg-sky-100 overflow-hidden select-none">
      <AudioBridge />

      {/* ── TOP BAR ── */}
      <header className="relative z-30 shrink-0 flex items-center gap-3 px-3 py-2 bg-white/95 border-b-4 border-slate-300 shadow">
        <button
          onClick={() => router.push('/')}
          className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 border-2 border-slate-400 text-slate-800 font-black text-xs uppercase tracking-wider active:scale-95 transition"
        >
          ← ARCADE
        </button>

        <div className="min-w-0">
          <div className="text-[9px] xl:text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">
            THE DECIMAL DELIVERY NETWORK
          </div>
          <div className="text-sm xl:text-lg font-black uppercase text-slate-900 leading-tight truncate">
            ROUND {round} — {ROUND_TITLES[round]}
          </div>
        </div>

        {/* Round pips */}
        <div className="hidden lg:flex items-center gap-1.5 ml-3">
          {([1, 2, 3, 4, 5] as const).map((r) => (
            <div
              key={r}
              className={
                'px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border-2 ' +
                (r === round
                  ? 'bg-amber-300 border-amber-500 text-slate-900'
                  : r < round
                    ? 'bg-emerald-100 border-emerald-300 text-emerald-700'
                    : 'bg-slate-100 border-slate-300 text-slate-400')
              }
            >
              {r}
            </div>
          ))}
        </div>

        {/* Live balances, so the competition is readable from the back of a room */}
        <div className="ml-auto flex items-center gap-2 xl:gap-4">
          <div className="text-right">
            <div className="text-[9px] font-black uppercase tracking-widest text-blue-600">BLUE</div>
            <div className="text-sm xl:text-xl font-black tabular-nums text-blue-700 leading-none">
              ₹{blue.balance.toFixed(2)}
            </div>
          </div>
          <div className="w-px h-8 bg-slate-300" />
          <div className="text-left">
            <div className="text-[9px] font-black uppercase tracking-widest text-red-600">RED</div>
            <div className="text-sm xl:text-xl font-black tabular-nums text-red-700 leading-none">
              ₹{red.balance.toFixed(2)}
            </div>
          </div>

          <button
            onClick={toggleMute}
            className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 border-2 border-slate-400 text-slate-800 font-black text-xs uppercase active:scale-95 transition"
          >
            {muted ? 'SOUND OFF' : 'SOUND ON'}
          </button>
          <button
            onClick={resetGame}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border-2 border-slate-900 text-white font-black text-xs uppercase active:scale-95 transition"
          >
            RESTART
          </button>
        </div>
      </header>

      {/* ── MAIN: BLUE LEFT · DEPOT CENTRE · RED RIGHT ── */}
      <main className="relative flex-1 min-h-0 flex">
        {/* The 3D depot fills the whole area; consoles float over its edges so
            the facility is never hidden behind a solid panel. */}
        <DepotScene3D />

        {showConsoles && (
          <>
            <aside className="relative z-20 w-[22rem] xl:w-[25rem] max-w-[30vw] h-full p-2 xl:p-3">
              <TeamConsole team="blue" />
            </aside>

            <div className="flex-1" />

            <aside className="relative z-20 w-[22rem] xl:w-[25rem] max-w-[30vw] h-full p-2 xl:p-3">
              <TeamConsole team="red" />
            </aside>
          </>
        )}

        {/* Round brief, centred low so it never covers the machines */}
        {phase === 'operating' && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
            <div className="px-5 py-2 rounded-2xl bg-white/95 border-2 border-slate-300 shadow-lg">
              <span className="text-[11px] xl:text-sm font-bold text-slate-700">
                {ROUND_BRIEFS[round]}
              </span>
            </div>
          </div>
        )}

        <DepotOverlays />
      </main>
    </div>
  );
};
