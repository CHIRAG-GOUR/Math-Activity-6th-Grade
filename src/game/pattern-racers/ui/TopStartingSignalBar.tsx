// ============================================================
// PATTERN RACERS — Top Starting Signal Lights Bar
// Displays 3 Physical FIA Race Starting Lamps:
// - Round 1 (Garage): [🔴 🔴 🔴] (Garages Locked)
// - Round 2 (Pit Check): [🔴 🔴 🔴] (Pit Inspection Active)
// - Round 3 (Grid Rev 1): [🟢 🔴 🔴] (1st Signal Green)
// - Round 4 (Pre-Grid Rev): [🟢 🟢 🔴] (2nd Signal Green)
// - Round 5 (Countdown): [🟢 🟢 🟢] (All Green -> Launch)
// ============================================================

'use client';

import React from 'react';
import { usePatternStore } from '../store/patternStore';
import { Zap, ShieldCheck, Flag, Sparkles } from 'lucide-react';

export const TopStartingSignalBar: React.FC = () => {
  const currentRound = usePatternStore((s) => s.currentRound);
  const phase = usePatternStore((s) => s.phase);
  const signalLights = usePatternStore((s) => s.signalLights);
  const headStartTeam = usePatternStore((s) => s.headStartTeam);
  const headStartRestraintActive = usePatternStore((s) => s.headStartRestraintActive);
  const blueScore = usePatternStore((s) => s.blueTeam.score);
  const redScore = usePatternStore((s) => s.redTeam.score);

  if (phase === 'intro') return null;

  const getStageTitle = () => {
    switch (currentRound) {
      case 1:
        return 'STAGE 1: GARAGE DEPARTURE';
      case 2:
        return 'STAGE 2: PIT INSPECTION & TYRE CHECK';
      case 3:
        return 'STAGE 3: GRID STAGING — 1ST SIGNAL GREEN';
      case 4:
        return 'STAGE 4: PRE-GRID REV — 2ND SIGNAL GREEN';
      case 5:
        return phase === 'pre_race_countdown' || phase === 'grand_prix_race'
          ? 'STAGE 5: ALL GREEN GO! — LIVE GRAND PRIX'
          : 'STAGE 5: FINAL LAUNCH CHALLENGE';
      default:
        return 'RACE GRID';
    }
  };

  const blueHasLead = blueScore > redScore;
  const redHasLead = redScore > blueScore;

  return (
    <div className="absolute top-14 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-none select-none">
      {/* ── 3 PHYSICAL FIA STARTING LAMPS HOUSING ── */}
      <div className="px-5 py-2 rounded-2xl bg-slate-950/95 backdrop-blur-xl border-2 border-slate-700/80 shadow-[0_10px_30px_rgba(0,0,0,0.8)] flex items-center gap-4">
        {/* Blue Team Lead Indicator */}
        <div
          className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${
            blueHasLead
              ? 'bg-blue-600/30 border border-blue-400 text-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.5)]'
              : 'bg-slate-900/80 text-slate-500 border border-slate-800'
          }`}
        >
          <Flag className="w-3 h-3 text-blue-400" />
          {blueHasLead && <span>★ +3.5s LEAD</span>}
        </div>

        {/* 3 Physical Starting Signal Lamps */}
        <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-inner">
          {[0, 1, 2].map((idx) => {
            const isGreen = signalLights[idx];

            return (
              <div key={`sig-lamp-${idx}`} className="flex flex-col items-center gap-1">
                <div
                  className={`w-5 h-5 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                    isGreen
                      ? 'bg-emerald-500 border-emerald-300 shadow-[0_0_15px_#10b981] animate-pulse'
                      : 'bg-red-600 border-red-400 shadow-[0_0_12px_#ef4444]'
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isGreen ? 'bg-emerald-200' : 'bg-red-300'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Red Team Lead Indicator */}
        <div
          className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${
            redHasLead
              ? 'bg-red-600/30 border border-red-400 text-red-300 shadow-[0_0_12px_rgba(239,68,68,0.5)]'
              : 'bg-slate-900/80 text-slate-500 border border-slate-800'
          }`}
        >
          {redHasLead && <span>+3.5s LEAD ★</span>}
          <Flag className="w-3 h-3 text-red-400" />
        </div>
      </div>

      {/* ── STAGE BANNER ── */}
      <div className="mt-1.5 px-4 py-0.5 rounded-full bg-slate-900/90 backdrop-blur-md border border-amber-500/40 text-[10px] font-extrabold text-amber-300 uppercase tracking-widest shadow-md flex items-center gap-1.5">
        <Zap className="w-3 h-3 text-amber-400" />
        <span>{getStageTitle()}</span>
      </div>

      {/* Head Start Restraint Banner */}
      {headStartRestraintActive && headStartTeam && (
        <div className="mt-1.5 px-4 py-1 rounded-xl bg-amber-500/90 text-slate-950 text-xs font-black uppercase tracking-widest shadow-xl animate-bounce flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span>{headStartTeam.toUpperCase()} TEAM LAUNCHES WITH 3.5s HEAD START!</span>
        </div>
      )}
    </div>
  );
};
