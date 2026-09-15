// ============================================================
// THE DECIMAL DELIVERY NETWORK — TEAM CONSOLE
//
// One per side. Blue renders on the LEFT, Red on the RIGHT — never stacked.
// Light, physical-looking control panel rather than a dark dashboard.
//
// Reads only its own slice of the store, so a re-render on one side never
// touches the other.
// ============================================================

'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { TeamId } from '../types';
import { useDepotStore } from '../store/depotStore';
import { DepotKeypad } from './DepotKeypad';

interface Props { team: TeamId }

/** Money counter that rolls up to its new value rather than snapping. */
const MoneyCounter: React.FC<{ value: number; accent: string }> = ({ value, accent }) => {
  const [shown, setShown] = useState(value);
  const from = useRef(value);
  const start = useRef(0);

  useEffect(() => {
    if (Math.abs(value - shown) < 0.005) return;
    from.current = shown;
    start.current = performance.now();
    let raf = 0;
    const DURATION = 700;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start.current) / DURATION);
      // Ease out so the number decelerates into place.
      const e = 1 - Math.pow(1 - t, 3);
      setShown(from.current + (value - from.current) * e);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // `shown` intentionally excluded: including it would restart the tween on
    // every animated frame.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <span className={`font-black tabular-nums ${accent}`}>
      ₹{shown.toFixed(2)}
    </span>
  );
};

export const TeamConsole: React.FC<Props> = ({ team }) => {
  const t = useDepotStore((s) => (team === 'blue' ? s.blue : s.red));
  const phase = useDepotStore((s) => s.phase);

  const isBlue = team === 'blue';
  const order = t.currentOrder;
  const live = t.phase === 'answering' &&
    (phase === 'operating' || phase === 'tie_breaker');

  const headerBg = isBlue ? 'bg-blue-600' : 'bg-red-600';
  const ring = isBlue ? 'border-blue-300' : 'border-red-300';
  const accentText = isBlue ? 'text-blue-700' : 'text-red-700';

  // Status lamp mirrors the physical machine on that side.
  const status =
    t.phase === 'processing' ? { label: 'PROCESSING', cls: 'bg-emerald-500' }
      : t.lastWrong ? { label: 'CHECK FIGURE', cls: 'bg-amber-500' }
        : t.phase === 'answering' ? { label: 'READY', cls: 'bg-emerald-500' }
          : t.phase === 'incoming' ? { label: 'INBOUND', cls: 'bg-sky-400' }
            : { label: 'STANDBY', cls: 'bg-slate-400' };

  return (
    <div className={`h-full flex flex-col gap-2 p-2 xl:p-3 bg-slate-50 border-4 ${ring} rounded-3xl shadow-xl overflow-hidden`}>

      {/* ── DEPOT HEADER ── */}
      <div className={`${headerBg} rounded-2xl px-3 py-2 text-white flex items-center justify-between shadow`}>
        <div className="min-w-0">
          <div className="text-[10px] xl:text-xs font-black uppercase tracking-widest opacity-80">
            DEPOT {isBlue ? 'A · WEST' : 'B · EAST'}
          </div>
          <div className="text-base xl:text-xl font-black uppercase leading-tight truncate">
            {t.name}
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-[9px] xl:text-[10px] font-black uppercase tracking-widest opacity-80">
            BALANCE
          </div>
          <div className="text-lg xl:text-2xl leading-tight">
            <MoneyCounter value={t.balance} accent="text-white" />
          </div>
        </div>
      </div>

      {/* ── STATUS STRIP ── */}
      <div className="flex items-center gap-2 px-2">
        <span className={`w-3 h-3 rounded-full ${status.cls} shadow-inner`} />
        <span className="text-[10px] xl:text-xs font-black uppercase tracking-widest text-slate-600">
          {status.label}
        </span>
        <span className="ml-auto text-[10px] xl:text-xs font-black uppercase tracking-widest text-slate-500">
          ORDERS {t.ordersCompleted}
        </span>
      </div>

      {/* ── SHIPPING LABEL ── */}
      <div className="rounded-2xl border-2 border-slate-300 bg-white p-2 xl:p-3 shadow-sm">
        {order ? (
          <>
            <div className="flex items-baseline justify-between border-b-2 border-dashed border-slate-300 pb-1 mb-2">
              <span className="text-xs xl:text-sm font-black text-slate-900">
                ORDER {order.id}
              </span>
              <span className="text-[9px] xl:text-[10px] font-black uppercase tracking-wider text-slate-500">
                {order.destination.name}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-x-2 gap-y-1">
              {order.labelRows.map((row) => (
                <React.Fragment key={row.label}>
                  <span className="text-[9px] xl:text-[11px] font-bold uppercase tracking-wide text-slate-500">
                    {row.label}
                  </span>
                  <span className="text-sm xl:text-lg font-black tabular-nums text-slate-900 text-right">
                    {order.isMoney && !row.value.startsWith('₹') && /^[\d.]+$/.test(row.value)
                      ? `₹${row.value}` : row.value}
                  </span>
                </React.Fragment>
              ))}
            </div>

            <p className="mt-2 text-[11px] xl:text-sm font-bold text-slate-700 leading-snug">
              {order.prompt}
            </p>
          </>
        ) : (
          <div className="py-6 text-center text-xs xl:text-sm font-black uppercase tracking-widest text-slate-400">
            {t.phase === 'incoming' ? 'PARCEL INBOUND…' : 'AWAITING NEXT ORDER'}
          </div>
        )}
      </div>

      {/* ── ANSWER FIELD ── */}
      <div
        className={
          'rounded-2xl border-4 px-3 py-2 flex items-center justify-between transition-colors ' +
          (t.lastWrong
            ? 'border-amber-400 bg-amber-50'
            : t.phase === 'processing'
              ? 'border-emerald-400 bg-emerald-50'
              : 'border-slate-300 bg-white')
        }
      >
        <span className="text-[9px] xl:text-[11px] font-black uppercase tracking-widest text-slate-500">
          {order?.laneOptions ? 'LANE' : 'ENTER VALUE'}
        </span>
        <span className="text-2xl xl:text-4xl font-black tabular-nums text-slate-900 truncate">
          {order?.isMoney && t.input ? '₹' : ''}{t.input || '—'}
          {order && !order.isMoney && order.unit && t.input
            ? <span className="text-base xl:text-xl text-slate-500 ml-1">{order.unit}</span>
            : null}
        </span>
      </div>

      {/* ── KEYPAD ── */}
      <div className="mt-auto">
        <DepotKeypad team={team} live={live} />
      </div>

      {/* ── TRUCK LOAD ── */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[9px] xl:text-[10px] font-black uppercase tracking-widest text-slate-500">
            TRUCK LOAD
          </span>
          <span className={`text-[10px] xl:text-xs font-black tabular-nums ${accentText}`}>
            {t.loadedWeight.toFixed(2)} kg
          </span>
        </div>
        <div className="h-3 rounded-full bg-slate-200 overflow-hidden border border-slate-300">
          <div
            className={`h-full transition-[width] duration-700 ${isBlue ? 'bg-blue-500' : 'bg-red-500'}`}
            style={{ width: `${Math.round(t.truckLoad * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};
