// ============================================================
// THE DECIMAL DELIVERY NETWORK — GAME SHELL
//
// 16:9 classroom layout:
//   - Blue console on the LEFT rail, Red console on the RIGHT rail
//   - each team's live STATION WINDOW across the top of the centre band,
//     directly beside its own console
//   - the whole depot overview filling the rest of the centre
//
// The 3D canvas fills the screen underneath; consoles and window frames are
// drawn over it, so the depot is never hidden behind an opaque sheet.
// ============================================================

'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DepotScene3D } from '../world/DepotScene3D';
import { TeamConsole } from './TeamConsole';
import { DepotOverlays } from './DepotOverlays';
import { useDepotStore, PARCELS_PER_ROUND } from '../store/depotStore';
import { ROUND_TITLES, ROUND_BRIEFS } from '../engine/questionEngine';
import { depotAudio } from '../engine/depotAudio';
import { drainEvents, focusParcel, laneSim } from '../engine/depotSim';
import { screenLayout, type ScreenLayout } from './stationWindows';
import type { TeamId } from '../types';
import { DevAutoplay } from './DevAutoplay';

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

/** Frame and caption drawn over a team's station window. */
const StationFrame: React.FC<{ team: TeamId; layout: ScreenLayout }> = ({ team, layout }) => {
  const r = layout[team];
  const isBlue = team === 'blue';
  const [caption, setCaption] = useState('WEIGHING STATION');

  // Caption follows the parcel's journey, refreshed a few times a second.
  useEffect(() => {
    const id = setInterval(() => {
      const f = focusParcel(team);
      if (!f) { setCaption('WEIGHING STATION · WAITING FOR PARCEL'); return; }
      const st = laneSim(team, f.lane).status;
      const stage = f.parcel.stage;
      const where =
        stage === 'at_station' ? 'ON THE SCALE'
          : stage === 'on_belt' || stage === 'arriving' ? 'ARRIVING'
            : f.parcel.approved === false ? 'TO REJECT ZONE'
              : 'TO THE TRUCK';
      setCaption(`BELT ${f.lane} · ${where} · ${st}`);
    }, 250);
    return () => clearInterval(id);
  }, [team]);

  return (
    <div
      className={`pointer-events-none absolute z-20 rounded-2xl border-4 ${isBlue ? 'border-blue-500' : 'border-red-500'} shadow-lg`}
      style={{ left: r.x - 4, top: r.y - 4, width: r.w + 8, height: r.h + 8 }}
    >
      <div className={`absolute left-2 top-2 rounded-lg px-2 py-0.5 text-[10px] xl:text-xs font-black uppercase tracking-wider text-white shadow ${isBlue ? 'bg-blue-600' : 'bg-red-600'}`}>
        {isBlue ? 'BLUE' : 'RED'} · {caption}
      </div>
    </div>
  );
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

  const mainRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<ScreenLayout | null>(null);

  // Keep the HTML frames in lock-step with the canvas the station windows are drawn into.
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const update = () => setLayout(screenLayout(el.clientWidth, el.clientHeight));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => () => depotAudio.shutdown(), []);
  useEffect(() => { depotAudio.setMuted(muted); }, [muted]);

  const showConsoles = phase !== 'intro';
  const playing = phase === 'operating' || phase === 'tie_breaker' || phase === 'round_complete';

  return (
    <div className="fixed inset-0 flex flex-col bg-sky-100 overflow-hidden select-none">
      <AudioBridge />
      <DevAutoplay />

      {/* ── TOP BAR ── */}
      <header className="relative z-30 shrink-0 flex items-center gap-3 px-3 py-1.5 bg-white border-b-4 border-slate-300 shadow">
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
            {phase === 'tie_breaker' ? 'TIE-BREAK — EXPRESS ORDER' : `ROUND ${round} — ${ROUND_TITLES[round]}`}
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-1.5 ml-2">
          {([1, 2, 3, 4, 5] as const).map((r) => (
            <div key={r} className={
              'px-2.5 py-1 rounded-lg text-[10px] font-black border-2 ' +
              (r === round ? 'bg-amber-300 border-amber-500 text-slate-900'
                : r < round ? 'bg-emerald-100 border-emerald-300 text-emerald-700'
                  : 'bg-slate-100 border-slate-300 text-slate-400')
            }>{r}</div>
          ))}
        </div>
        {playing && (
          <div className="hidden xl:block ml-3 text-[11px] font-bold text-slate-600 truncate">
            {ROUND_BRIEFS[round]} · {PARCELS_PER_ROUND} parcels each
          </div>
        )}
        <div className="ml-auto flex items-center gap-3">
          <div className="text-right">
            <div className="text-[9px] font-black uppercase tracking-widest text-blue-600">BLUE</div>
            <div className="text-sm xl:text-xl font-black tabular-nums text-blue-700 leading-none">₹{blue.balance.toFixed(2)}</div>
          </div>
          <div className="w-px h-8 bg-slate-300" />
          <div>
            <div className="text-[9px] font-black uppercase tracking-widest text-red-600">RED</div>
            <div className="text-sm xl:text-xl font-black tabular-nums text-red-700 leading-none">₹{red.balance.toFixed(2)}</div>
          </div>
          <button onClick={toggleMute}
            className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 border-2 border-slate-400 text-slate-800 font-black text-xs uppercase active:scale-95 transition">
            {muted ? 'SOUND OFF' : 'SOUND ON'}
          </button>
          <button onClick={resetGame}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border-2 border-slate-900 text-white font-black text-xs uppercase active:scale-95 transition">
            RESTART
          </button>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main ref={mainRef} className="relative flex-1 min-h-0">
        <DepotScene3D />

        {showConsoles && layout && (
          <>
            <aside className="absolute inset-y-0 left-0 z-20 p-2 xl:p-3" style={{ width: layout.rail }}>
              <TeamConsole team="blue" />
            </aside>
            <aside className="absolute inset-y-0 right-0 z-20 p-2 xl:p-3" style={{ width: layout.rail }}>
              <TeamConsole team="red" />
            </aside>
          </>
        )}

        {playing && layout && (
          <>
            <StationFrame team="blue" layout={layout} />
            <StationFrame team="red" layout={layout} />
          </>
        )}

        <DepotOverlays />
      </main>
    </div>
  );
};
