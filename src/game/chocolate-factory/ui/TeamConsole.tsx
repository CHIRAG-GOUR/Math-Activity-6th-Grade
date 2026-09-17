// ============================================================
// THE CHOCOLATE FACTORY — TEAM CONTROL CONSOLE
//
// A PERMANENT operator station: Blue bottom-left, Red bottom-right. It never
// disappears, never goes full screen and never waits for the other team.
//
// The console shows the five-step production chain for the current customer
// order, with the step the team is on picked out. Each question sets the
// QUANTITY for that step, so the panel always says what the answer will do
// to the factory before it is applied.
//
// Live machine values are polled a few times a second rather than pushed
// through React every frame, so a running factory never re-renders the panel
// at 60 Hz.
// ============================================================

'use client';

import React, { useEffect, useState } from 'react';
import type { TeamId } from '../types';
import { sim, STEPS, type Logistics, type StepId } from '../engine/factorySim';
import { useFactoryStore, TOTAL_CYCLES } from '../store/factoryStore';

const STEP_SHORT: Record<StepId, string> = {
  ingredients: 'COCOA',
  mixing: 'MIX',
  molding: 'MOLD',
  cooling: 'COOL & CUT',
  packaging: 'BOX',
};

const STEP_ICON: Record<StepId, string> = {
  ingredients: '🫘',
  mixing: '🌀',
  molding: '🧊',
  cooling: '❄️',
  packaging: '📦',
};

const LOGISTICS_LABEL: Record<Logistics, string> = {
  idle: '',
  fork_to_pallet: 'FORKLIFT COLLECTING PALLET',
  fork_lift: 'LIFTING THE PALLET',
  fork_to_truck: 'CARRYING BOXES TO THE TRUCK',
  fork_unload: 'LOADING THE TRUCK',
  fork_return: 'FORKLIFT RETURNING',
  truck_out: 'TRUCK OUT FOR DELIVERY',
  at_customer: 'DELIVERING TO THE CUSTOMER',
  truck_back: 'TRUCK RETURNING',
  // A heavy cocoa load comes over on the forklift instead of by hand.
  cocoa_to_stack: 'FORKLIFT FETCHING THE COCOA PALLET',
  cocoa_lift: 'LIFTING THE COCOA PALLET',
  cocoa_to_tank: 'CARRYING COCOA TO THE TANK',
  cocoa_pour: 'TIPPING THE PALLET INTO THE TANK',
  cocoa_return: 'FORKLIFT RETURNING',
};

interface Live {
  stepIndex: number;
  running: boolean;
  logistics: Logistics;
  quality: number;
  satisfaction: number;
  orders: number;
  cocoa: number;
  molds: number;
  bars: number;
  boxes: number;
  inTruck: number;
}

function readLive(team: TeamId): Live {
  const s = sim[team];
  return {
    stepIndex: s.stepIndex,
    running: s.phase === 'running',
    logistics: s.logistics,
    quality: s.quality,
    satisfaction: s.customerSatisfaction,
    orders: s.ordersCompleted,
    cocoa: s.tankFill,
    molds: s.moldCount,
    bars: s.barCount,
    boxes: s.boxCount,
    inTruck: s.boxesInTruck,
  };
}

export const TeamConsole: React.FC<{ team: TeamId }> = ({ team }) => {
  const isBlue = team === 'blue';
  const t = useFactoryStore((s) => s[team]);
  const phase = useFactoryStore((s) => s.phase);
  const winner = useFactoryStore((s) => s.winner);
  const selectAnswer = useFactoryStore((s) => s.selectAnswer);
  const applyAnswer = useFactoryStore((s) => s.applyAnswer);

  const [live, setLive] = useState<Live>(() => readLive(team));
  useEffect(() => {
    const id = setInterval(() => setLive(readLive(team)), 120);
    return () => clearInterval(id);
  }, [team]);

  const finished = phase === 'final_results';
  const isChampion = finished && winner === team;
  const isTie = finished && winner === 'tie';
  const canAnswer = (t.status === 'answering' || t.status === 'retry') && !finished;
  const order = t.order;

  const tint = isBlue
    ? { head: 'from-blue-600 to-blue-700', ring: 'ring-blue-500 border-blue-500 bg-blue-50', btn: 'from-blue-600 to-blue-700 border-blue-900', chip: 'bg-blue-600', text: 'text-blue-700', soft: 'bg-blue-50 border-blue-200' }
    : { head: 'from-red-600 to-red-700', ring: 'ring-red-500 border-red-500 bg-red-50', btn: 'from-red-600 to-red-700 border-red-900', chip: 'bg-red-600', text: 'text-red-700', soft: 'bg-red-50 border-red-200' };

  const statusLine = finished
    ? (isChampion ? '🏆 FACTORY CHAMPIONS' : isTie ? 'CHALLENGE COMPLETE — TIED' : 'CHALLENGE COMPLETE')
    : LOGISTICS_LABEL[live.logistics]
      || (live.running ? `${t.stepLabel} — RUNNING` : t.status === 'complete' ? 'ALL ORDERS COMPLETE' : 'AWAITING YOUR FRACTION');

  return (
    <div
      className={
        'pointer-events-auto select-none w-full rounded-2xl border-[3px] shadow-[0_10px_40px_rgba(15,23,42,0.35)] max-h-[82vh] overflow-y-auto ' +
        'bg-gradient-to-b from-white to-slate-50 ' + (isBlue ? 'border-blue-600' : 'border-red-600')
      }
    >
      {/* ── HEADER ── */}
      <div className={`bg-gradient-to-r ${tint.head} px-3 py-2 flex items-center gap-2 text-white`}>
        <div className="min-w-0 flex-1">
          <div className="text-[13px] xl:text-[15px] font-black uppercase tracking-wide leading-none truncate">
            {isBlue ? 'BLUE CHOCOLATE WORKS' : 'RED CHOCOLATE WORKS'}
          </div>
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] opacity-90 mt-0.5">
            ORDER {Math.min(TOTAL_CYCLES, t.cycle + 1)} OF {TOTAL_CYCLES} · ROUND {t.round}
          </div>
        </div>
        <div className="shrink-0 rounded-lg bg-white/20 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-right leading-tight max-w-[46%]">
          {statusLine}
        </div>
      </div>

      {/* ── FIVE-STEP CHAIN ── */}
      <div className="px-2.5 pt-2 flex items-center gap-1">
        {STEPS.map((id, i) => {
          const done = i < live.stepIndex;
          const active = i === live.stepIndex;
          return (
            <React.Fragment key={id}>
              <div
                className={
                  'flex-1 rounded-lg border text-center py-1 transition ' +
                  (active
                    ? `${tint.chip} border-transparent text-white shadow`
                    : done
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                      : 'bg-slate-100 border-slate-200 text-slate-400')
                }
              >
                <div className="text-[11px] leading-none">{done ? '✓' : STEP_ICON[id]}</div>
                <div className="text-[7px] xl:text-[8px] font-black uppercase tracking-wide mt-0.5">{STEP_SHORT[id]}</div>
              </div>
              {i < STEPS.length - 1 && <div className={'w-1.5 h-[2px] ' + (done ? 'bg-emerald-400' : 'bg-slate-200')} />}
            </React.Fragment>
          );
        })}
      </div>

      {/* ── ORDER + STEP + QUESTION ── */}
      <div className="px-3 pt-2">
        {order ? (
          <>
            <div className="flex items-baseline justify-between gap-2">
              <div className={`text-[10px] font-black uppercase tracking-widest ${tint.text} truncate`}>
                {order.customerName}
              </div>
              <div className="text-[10px] font-bold text-slate-500 shrink-0">
                {order.units} {order.productName}
              </div>
            </div>

            <div className={`mt-1.5 rounded-lg border px-2.5 py-1.5 ${tint.soft}`}>
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-700">
                STEP {t.step + 1} · {t.stepLabel}
              </div>
              <div className="text-[9.5px] font-bold text-slate-600 leading-snug">{t.stepAction}</div>
            </div>

            <p className="mt-2 text-[12.5px] xl:text-[14px] font-bold text-slate-900 leading-snug break-words">
              {order.question.prompt}
            </p>
          </>
        ) : (
          <p className="text-[12px] font-bold text-slate-500 leading-snug min-h-[3rem] flex items-center">
            {finished
              ? (isChampion
                ? 'Your factory ran the best production line of the shift — the victory truck is rolling out.'
                : 'Production finished. The shift is complete.')
              : 'All five orders complete. Finishing the last delivery…'}
          </p>
        )}
      </div>

      {/* ── ANSWERS ── */}
      {order && !finished && (
        <div className="px-3 pt-1.5 grid grid-cols-2 gap-2">
          {order.question.options.map((opt, i) => {
            const chosen = t.selected === i;
            return (
              <button
                key={i}
                onPointerDown={() => canAnswer && selectAnswer(team, i)}
                disabled={!canAnswer}
                className={
                  'min-h-[48px] xl:min-h-[56px] py-2 px-2 rounded-xl border-2 text-base xl:text-xl font-black tabular-nums transition active:scale-95 flex items-center justify-center text-center break-words ' +
                  (chosen
                    ? `ring-4 ${tint.ring} text-slate-900 shadow-inner`
                    : canAnswer
                      ? 'bg-white border-slate-300 text-slate-800 shadow-sm hover:bg-slate-50'
                      : 'bg-slate-100 border-slate-200 text-slate-400')
                }
              >
                {opt}
              </button>
            );
          })}
        </div>
      )}

      {/* ── FEEDBACK ── */}
      {t.feedback && (
        <div
          className={
            'mx-3 mt-2 rounded-lg px-2 py-1.5 text-[10px] font-black uppercase tracking-wide leading-tight border-2 ' +
            (t.lastCorrect === false
              ? 'bg-amber-50 text-amber-800 border-amber-300'
              : 'bg-emerald-50 text-emerald-800 border-emerald-300')
          }
        >
          {t.feedback}
        </div>
      )}

      {/* ── PRIMARY ACTION ── */}
      <div className="px-3 pt-2">
        <button
          onPointerDown={() => canAnswer && applyAnswer(team)}
          disabled={!canAnswer || t.selected === null}
          className={
            'w-full h-12 xl:h-14 rounded-xl border-b-4 text-white text-sm xl:text-base font-black uppercase tracking-wider transition active:scale-95 active:border-b-2 bg-gradient-to-b ' +
            (canAnswer && t.selected !== null ? tint.btn : 'from-slate-300 to-slate-400 border-slate-500 cursor-not-allowed')
          }
        >
          {finished
            ? (isChampion ? '🏆 FACTORY CHAMPIONS' : 'CHALLENGE COMPLETE')
            : t.status === 'working'
              ? 'LINE RUNNING…'
              : t.status === 'delivering'
                ? 'LOADING & DELIVERING…'
                : t.status === 'complete'
                  ? 'FINISHING DELIVERY…'
                  : t.status === 'retry'
                    ? 'APPLY CORRECTED FRACTION →'
                    : 'APPLY FRACTION →'}
        </button>
      </div>

      {/* ── WHAT THE FACTORY IS HOLDING RIGHT NOW ── */}
      <div className="px-3 pt-2 grid grid-cols-4 gap-1.5 text-center">
        {[
          ['COCOA', `${Math.round(live.cocoa * 100)}%`],
          ['MOLDS', `${live.molds}`],
          ['BARS', `${live.bars}`],
          ['BOXES', `${live.boxes}`],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg bg-white border border-slate-200 py-1 shadow-sm">
            <div className="text-[7px] font-black uppercase tracking-widest text-slate-400">{label}</div>
            <div className="text-[13px] xl:text-sm font-black tabular-nums text-slate-800 leading-none mt-0.5">{value}</div>
          </div>
        ))}
      </div>

      {/* ── RESULTS ── */}
      <div className="px-3 py-2 mt-1.5 grid grid-cols-4 gap-1.5 text-center bg-slate-100/70 border-t border-slate-200">
        {[
          ['DELIVERED', `${live.orders}`],
          ['QUALITY', `${live.quality}%`],
          ['CUSTOMER', `${live.satisfaction}%`],
          ['IN TRUCK', `${live.inTruck}`],
        ].map(([label, value]) => (
          <div key={label}>
            <div className="text-[7px] font-black uppercase tracking-widest text-slate-500">{label}</div>
            <div className={`text-[13px] xl:text-sm font-black tabular-nums ${tint.text} leading-none mt-0.5`}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
