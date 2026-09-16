// ============================================================
// THE CHOCOLATE FACTORY — TEAM CONTROL CONSOLE
//
// A PERMANENT operator station: Blue bottom-left, Red bottom-right. It never
// disappears, never goes full screen and never waits for the other team. The
// question area changes; the console itself stays exactly where it is from
// the first mission to the final result.
//
// Live production values (line stage, quality, satisfaction) are polled from
// the simulation a few times a second rather than pushed through React every
// frame, so a running factory never re-renders the panel at 60 Hz.
// ============================================================

'use client';

import React, { useEffect, useState } from 'react';
import type { TeamId } from '../types';
import { sim, type LineStage, type LogisticsStage } from '../engine/factorySim';
import { useFactoryStore, TOTAL_MISSIONS } from '../store/factoryStore';

const STAGE_LABEL: Record<LineStage, string> = {
  idle: 'LINE READY',
  filling: 'TANK FILLING',
  mixing: 'MIXING BATCH',
  molding: 'FILLING MOLDS',
  cooling: 'COOLING TUNNEL',
  cutting: 'CUTTING BARS',
  quality_check: 'QUALITY CHECK',
  packaging: 'PACKAGING',
};

const LOGISTICS_LABEL: Record<LogisticsStage, string> = {
  idle: '',
  loading: 'LOADING TRUCK',
  outbound: 'OUT FOR DELIVERY',
  unloading: 'AT THE CUSTOMER',
  returning: 'TRUCK RETURNING',
};

const STAGE_PIPS: { key: LineStage; short: string }[] = [
  { key: 'filling', short: 'TANK' },
  { key: 'mixing', short: 'MIX' },
  { key: 'molding', short: 'MOLD' },
  { key: 'cooling', short: 'COOL' },
  { key: 'cutting', short: 'CUT' },
  { key: 'quality_check', short: 'QC' },
  { key: 'packaging', short: 'PACK' },
];

interface Live {
  line: LineStage;
  logistics: LogisticsStage;
  quality: number;
  satisfaction: number;
  orders: number;
  deliveries: number;
  tankFill: number;
  boxes: number;
}

function readLive(team: TeamId): Live {
  const s = sim[team];
  return {
    line: s.line,
    logistics: s.logistics,
    quality: s.quality,
    satisfaction: s.customerSatisfaction,
    orders: s.ordersCompleted,
    deliveries: s.deliveries,
    tankFill: s.tankFill,
    boxes: s.boxesInTruck,
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
    const id = setInterval(() => setLive(readLive(team)), 130);
    return () => clearInterval(id);
  }, [team]);

  const accent = isBlue ? 'blue' : 'red';
  const headerBg = isBlue ? 'bg-blue-600' : 'bg-red-600';
  const ringSel = isBlue ? 'ring-blue-500 bg-blue-50 border-blue-500' : 'ring-red-500 bg-red-50 border-red-500';
  const actionBg = isBlue
    ? 'bg-blue-600 hover:bg-blue-500 border-blue-800'
    : 'bg-red-600 hover:bg-red-500 border-red-800';

  const finished = phase === 'final_results';
  const isChampion = finished && winner === team;
  const isTie = finished && winner === 'tie';

  const canAnswer = (t.status === 'answering' || t.status === 'retry') && !finished;
  const order = t.order;
  const missionNo = Math.min(TOTAL_MISSIONS, t.missionIndex + 1);

  const statusLine = finished
    ? (isChampion ? 'FACTORY CHAMPIONS' : isTie ? 'CHALLENGE COMPLETE — TIED' : 'CHALLENGE COMPLETE')
    : live.line !== 'idle'
      ? STAGE_LABEL[live.line]
      : LOGISTICS_LABEL[live.logistics] || (t.status === 'complete' ? 'ALL MISSIONS COMPLETE' : 'AWAITING YOUR FRACTION');

  return (
    <div
      className={
        'pointer-events-auto select-none w-full rounded-2xl border-4 bg-white/95 backdrop-blur-sm shadow-2xl overflow-hidden ' +
        (isBlue ? 'border-blue-600' : 'border-red-600')
      }
    >
      {/* ── HEADER ── */}
      <div className={`${headerBg} px-3 py-2 flex items-center gap-2 text-white`}>
        <div className="min-w-0 flex-1">
          <div className="text-[13px] xl:text-sm font-black uppercase tracking-wide leading-none truncate">
            {isBlue ? 'BLUE CHOCOLATE WORKS' : 'RED CHOCOLATE WORKS'}
          </div>
          <div className="text-[10px] font-bold uppercase tracking-widest opacity-90 mt-0.5">
            MISSION {missionNo} / {TOTAL_MISSIONS} · ROUND {t.round}
          </div>
        </div>
        <div className="shrink-0 rounded-lg bg-white/20 px-2 py-1 text-[10px] font-black uppercase tracking-wider">
          {statusLine}
        </div>
      </div>

      {/* ── ORDER + QUESTION ── */}
      <div className="px-3 pt-2 pb-1">
        {order ? (
          <>
            <div className="flex items-baseline justify-between gap-2">
              <div className={`text-[10px] font-black uppercase tracking-widest text-${accent}-700 truncate`}>
                {order.customerName}
              </div>
              <div className="text-[10px] font-bold text-slate-500 shrink-0">
                {order.units} {order.productName}
              </div>
            </div>
            <p className="mt-1 text-[12px] xl:text-[13px] font-bold text-slate-800 leading-snug min-h-[2.4rem]">
              {order.question.prompt}
            </p>
          </>
        ) : (
          <p className="text-[12px] font-bold text-slate-500 leading-snug min-h-[3.2rem] flex items-center">
            {finished
              ? (isChampion
                ? 'Your factory ran the best production line of the shift.'
                : 'Production finished — the shift is complete.')
              : 'All missions complete. Finishing the last deliveries…'}
          </p>
        )}
      </div>

      {/* ── ANSWER OPTIONS ── */}
      {order && !finished && (
        <div className="px-3 grid grid-cols-2 gap-2">
          {order.question.options.map((opt, i) => {
            const chosen = t.selected === i;
            return (
              <button
                key={i}
                onPointerDown={() => canAnswer && selectAnswer(team, i)}
                disabled={!canAnswer}
                className={
                  'h-12 xl:h-14 rounded-xl border-2 text-lg xl:text-xl font-black tabular-nums transition active:scale-95 ' +
                  (chosen
                    ? `ring-4 ${ringSel} text-slate-900`
                    : canAnswer
                      ? 'bg-slate-50 border-slate-300 text-slate-800 hover:bg-slate-100'
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
            'mx-3 mt-2 rounded-lg px-2 py-1.5 text-[10px] font-black uppercase tracking-wide leading-tight ' +
            (t.lastCorrect === false
              ? 'bg-amber-100 text-amber-800 border-2 border-amber-300'
              : 'bg-emerald-100 text-emerald-800 border-2 border-emerald-300')
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
            'w-full h-12 xl:h-14 rounded-xl border-b-4 text-white text-sm xl:text-base font-black uppercase tracking-wider transition active:scale-95 active:border-b-2 ' +
            (canAnswer && t.selected !== null ? actionBg : 'bg-slate-300 border-slate-400 cursor-not-allowed')
          }
        >
          {finished
            ? (isChampion ? '🏆 FACTORY CHAMPIONS' : 'CHALLENGE COMPLETE')
            : t.status === 'producing'
              ? 'PRODUCTION RUNNING…'
              : t.status === 'complete'
                ? 'FINISHING DELIVERIES…'
                : t.status === 'retry'
                  ? 'APPLY CORRECTED FRACTION →'
                  : 'APPLY FRACTION →'}
        </button>
      </div>

      {/* ── LIVE PRODUCTION STRIP ── */}
      <div className="px-3 pt-2 flex items-center gap-1">
        {STAGE_PIPS.map((p) => {
          const active = live.line === p.key;
          return (
            <div
              key={p.key}
              className={
                'flex-1 rounded text-center text-[8px] xl:text-[9px] font-black uppercase py-1 border ' +
                (active
                  ? isBlue
                    ? 'bg-blue-600 text-white border-blue-700'
                    : 'bg-red-600 text-white border-red-700'
                  : 'bg-slate-100 text-slate-400 border-slate-200')
              }
            >
              {p.short}
            </div>
          );
        })}
      </div>

      {/* ── METRICS ── */}
      <div className="px-3 py-2 grid grid-cols-4 gap-1.5 text-center">
        {[
          ['ORDERS', `${live.orders}`],
          ['QUALITY', `${live.quality}%`],
          ['DELIVERED', `${live.deliveries}`],
          ['CUSTOMER', `${live.satisfaction}%`],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg bg-slate-50 border border-slate-200 py-1">
            <div className="text-[8px] font-black uppercase tracking-widest text-slate-500">{label}</div>
            <div className="text-sm xl:text-base font-black tabular-nums text-slate-800 leading-none mt-0.5">{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
