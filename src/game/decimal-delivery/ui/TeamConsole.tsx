// ============================================================
// THE DECIMAL DELIVERY NETWORK — TEAM CONSOLE
//
// One per side: Blue on the LEFT, Red on the RIGHT — never stacked.
//
// Each console drives that team's TWO conveyor belts. Both belts are always
// listed with their order and status; the operator taps a belt to work it, and
// the console follows the action on its own if the selected belt is idle while
// the other has a parcel on its scale. Belt selection is local UI state, so it
// can never affect the other team or the simulation.
// ============================================================

'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { TeamId } from '../types';
import { LANES, type LaneId } from '../engine/depotLayout';
import { useDepotStore, ATTEMPTS_PER_ORDER } from '../store/depotStore';
import { DepotKeypad } from './DepotKeypad';

/** Money counter that rolls up to its new value rather than snapping. */
const MoneyCounter: React.FC<{ value: number }> = ({ value }) => {
  const [shown, setShown] = useState(value);
  const from = useRef(value);

  useEffect(() => {
    if (Math.abs(value - shown) < 0.005) return;
    from.current = shown;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 800);
      setShown(from.current + (value - from.current) * (1 - Math.pow(1 - t, 3)));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <span className="font-black tabular-nums">₹{shown.toFixed(2)}</span>;
};

export const TeamConsole: React.FC<{ team: TeamId }> = ({ team }) => {
  const t = useDepotStore((s) => (team === 'blue' ? s.blue : s.red));
  const phase = useDepotStore((s) => s.phase);
  const useHint = useDepotStore((s) => s.useHint);
  const useExtraTry = useDepotStore((s) => s.useExtraTry);
  const useDoublePay = useDepotStore((s) => s.useDoublePay);

  const isBlue = team === 'blue';
  const [selected, setSelected] = useState<LaneId>('A');

  // Follow the action when the selected belt has nothing to solve.
  useEffect(() => {
    if (t.lanes[selected].status === 'ready') return;
    const other: LaneId = selected === 'A' ? 'B' : 'A';
    if (t.lanes[other].status === 'ready') setSelected(other);
  }, [t.lanes, selected]);

  // Result toast: exactly when a parcel lands in the truck or the reject bin.
  const [toast, setToast] = useState<typeof t.lastResult>(null);
  useEffect(() => {
    if (!t.lastResult) return;
    setToast(t.lastResult);
    const id = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(id);
  }, [t.lastResult]);

  const lane = t.lanes[selected];
  const order = lane.active?.order ?? null;
  const live = lane.status === 'ready' && (phase === 'operating' || phase === 'tie_breaker');

  const ring = isBlue ? 'border-blue-300' : 'border-red-300';
  const head = isBlue ? 'bg-blue-600' : 'bg-red-600';

  const chip = (s: string) =>
    s === 'ready' ? { word: 'ON SCALE', dot: 'bg-emerald-500' }
      : s === 'incoming' ? { word: 'ON THE WAY', dot: 'bg-sky-400' }
        : { word: 'BELT CLEAR', dot: 'bg-slate-300' };

  return (
    <div className={`relative h-full flex flex-col gap-1.5 p-2 bg-slate-50/95 border-4 ${ring} rounded-3xl shadow-xl overflow-hidden`}>

      {/* ── HEADER ── */}
      <div className={`${head} rounded-2xl px-3 py-1.5 text-white flex items-center justify-between shadow`}>
        <div className="min-w-0">
          <div className="text-[9px] font-black uppercase tracking-widest opacity-80">
            {isBlue ? 'WEST DEPOT' : 'EAST DEPOT'}
          </div>
          <div className="text-sm xl:text-lg font-black uppercase leading-tight truncate">{t.name}</div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-[9px] font-black uppercase tracking-widest opacity-80">EARNINGS</div>
          <div className="text-lg xl:text-2xl leading-tight"><MoneyCounter value={t.balance} /></div>
        </div>
      </div>

      {/* ── BOTH BELTS ── */}
      <div className="grid grid-cols-2 gap-1.5">
        {LANES.map((id) => {
          const l = t.lanes[id];
          const c = chip(l.status);
          const active = id === selected;
          return (
            <button
              key={id}
              type="button"
              onPointerDown={(e) => { e.preventDefault(); setSelected(id); }}
              className={
                'touch-none select-none rounded-2xl border-2 px-2 py-1 text-left transition ' +
                (active
                  ? (isBlue ? 'border-blue-500 bg-blue-50' : 'border-red-500 bg-red-50')
                  : 'border-slate-300 bg-white')
              }
            >
              <div className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${c.dot}`} />
                <span className="text-[11px] xl:text-xs font-black uppercase tracking-wider text-slate-800">BELT {id}</span>
                {l.next && (
                  <span className="ml-auto rounded bg-slate-200 px-1 text-[9px] font-black text-slate-600">+1 QUEUED</span>
                )}
              </div>
              <div className="text-[9px] xl:text-[10px] font-black uppercase tracking-wide text-slate-500 truncate">
                {l.active ? `${l.active.order.id} · ${c.word}` : c.word}
              </div>
            </button>
          );
        })}
      </div>

      {/* ── SHIPPING LABEL / ORDER ── */}
      <div className="rounded-2xl border-2 border-slate-300 bg-white p-2 shadow-sm">
        {order ? (
          <>
            <div className="flex items-baseline justify-between border-b-2 border-dashed border-slate-300 pb-1 mb-1">
              <span className="text-xs xl:text-sm font-black text-slate-900">ORDER {order.id}</span>
              <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 truncate ml-2">
                {order.destination.name}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-x-2">
              {order.labelRows.map((row) => (
                <React.Fragment key={row.label}>
                  <span className="text-[9px] xl:text-[10px] font-bold uppercase tracking-wide text-slate-500 self-center">
                    {row.label}
                  </span>
                  <span className="text-sm xl:text-base font-black tabular-nums text-slate-900 text-right">
                    {order.isMoney && /^[\d.]+$/.test(row.value) ? `₹${row.value}` : row.value}
                  </span>
                </React.Fragment>
              ))}
            </div>
            <p className="mt-1 text-[11px] xl:text-sm font-bold text-slate-700 leading-snug">{order.prompt}</p>
            {lane.hintShown && (
              <p className="mt-1 rounded-lg border border-amber-300 bg-amber-100 px-2 py-1 text-[10px] xl:text-xs font-bold text-amber-900">
                HINT: {order.explanation.replace(/=\s*[^=]*$/, '= ?')}
              </p>
            )}
            {lane.status === 'incoming' && (
              <p className="mt-1 text-[10px] font-black uppercase tracking-wider text-sky-600">
                Parcel travelling to the scale…
              </p>
            )}
          </>
        ) : (
          <div className="py-3 text-center text-[11px] font-black uppercase tracking-widest text-slate-400">
            Waiting for the next parcel
          </div>
        )}
      </div>

      {/* ── ATTEMPTS ── */}
      <div className="flex items-center justify-between px-1">
        <span className="text-[9px] xl:text-[10px] font-black uppercase tracking-widest text-slate-500">
          {lane.lastWrong && lane.attemptsLeft > 0 ? 'NOT QUITE — TRY AGAIN' : 'ATTEMPTS'}
        </span>
        <div className="flex items-center gap-1">
          {Array.from({ length: Math.max(ATTEMPTS_PER_ORDER, lane.attemptsLeft) }, (_, i) => (
            <span key={i} className={
              'w-5 h-2.5 rounded-full border ' +
              (i < lane.attemptsLeft
                ? (isBlue ? 'bg-blue-500 border-blue-700' : 'bg-red-500 border-red-700')
                : 'bg-slate-200 border-slate-300')
            } />
          ))}
        </div>
      </div>

      {/* ── ANSWER FIELD ── */}
      <div className={
        'rounded-2xl border-4 px-3 py-1 flex items-center justify-between transition-colors ' +
        (lane.lastWrong ? 'border-amber-400 bg-amber-50' : live ? 'border-emerald-300 bg-white' : 'border-slate-300 bg-slate-100')
      }>
        <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">
          {order?.laneOptions ? 'LANE NO.' : 'ANSWER'}
        </span>
        <span className="text-2xl xl:text-3xl font-black tabular-nums text-slate-900 truncate">
          {order?.isMoney && lane.input ? '₹' : ''}{lane.input || '—'}
          {order && !order.isMoney && order.unit && lane.input
            ? <span className="ml-1 text-sm xl:text-base text-slate-500">{order.unit}</span> : null}
        </span>
      </div>

      {/* ── POWER-UPS (one of each per match) ── */}
      <div className="grid grid-cols-3 gap-1.5">
        {([
          ['HINT', t.powerUps.fiftyFifty, () => useHint(team, selected), 'bg-amber-300 border-amber-500'],
          ['+1 TRY', t.powerUps.timeFreeze, () => useExtraTry(team, selected), 'bg-sky-300 border-sky-500'],
          [lane.doubleArmed ? '2x ARMED' : '2x PAY', t.powerUps.doublePoints || lane.doubleArmed,
            () => useDoublePay(team, selected), 'bg-violet-300 border-violet-500'],
        ] as const).map(([label, available, fn, cls]) => (
          <button
            key={label}
            type="button"
            disabled={!available || !live}
            onPointerDown={(e) => { e.preventDefault(); fn(); }}
            className={
              'touch-none select-none rounded-xl border-2 py-1 text-[10px] xl:text-xs font-black uppercase tracking-wider text-slate-900 ' +
              'active:scale-95 transition disabled:opacity-35 disabled:grayscale ' + cls
            }
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── KEYPAD ── */}
      <div className="mt-auto">
        <DepotKeypad team={team} lane={selected} live={live} />
      </div>

      {/* ── TRUCK ── */}
      <div className="flex items-center justify-between px-1 pt-0.5">
        <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">
          TRUCK {t.ordersCompleted} LOADED
        </span>
        <span className="text-[9px] font-black uppercase tracking-widest text-orange-600">
          {t.ordersRejected} REJECTED
        </span>
      </div>
      <div className="h-2.5 rounded-full bg-slate-200 overflow-hidden border border-slate-300">
        <div className={`h-full transition-[width] duration-700 ${isBlue ? 'bg-blue-500' : 'bg-red-500'}`}
          style={{ width: `${Math.round(t.truckLoad * 100)}%` }} />
      </div>

      {/* ── RESULT TOAST: appears the moment the parcel physically lands ── */}
      {toast && (
        <div className="pointer-events-none absolute inset-x-3 top-16 z-10 flex justify-center">
          <div className={
            'rounded-2xl border-4 px-4 py-2 text-center shadow-lg ' +
            (toast.kind === 'delivered' ? 'border-emerald-600 bg-emerald-50' : 'border-orange-500 bg-orange-50')
          }>
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-600">
              ORDER {toast.orderId}
            </div>
            <div className={`text-lg xl:text-xl font-black ${toast.kind === 'delivered' ? 'text-emerald-700' : 'text-orange-700'}`}>
              {toast.kind === 'delivered' ? `DELIVERED  +₹${toast.amount.toFixed(2)}` : 'ORDER LOST · ₹0'}
            </div>
            {toast.kind === 'rejected' && (
              <div className="text-[10px] font-bold text-slate-600">Parcel sent to the reject zone. Next one's coming!</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
