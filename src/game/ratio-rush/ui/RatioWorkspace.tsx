// ============================================================
// RATIO RUSH — RATIO WORKSPACE & VISUAL TAPE DIAGRAM
// Interactive mathematical ratio modeling tools:
// - Interactive Tape Diagram (Bar Model with unit block multipliers)
// - Equivalent Ratio Scaling Table
// - Unit Rate Multiplier Breakdown
// ============================================================

import React, { useState } from 'react';
import { useRatioStore } from '../store/ratioStore';
import { RATIO_QUESTIONS } from '../data/questions';
import { Layers, Sliders, Table, Sparkles, CheckCircle2 } from 'lucide-react';

export const RatioWorkspace: React.FC = () => {
  const blueTeam = useRatioStore((s) => s.blueTeam);
  const redTeam = useRatioStore((s) => s.redTeam);
  const gameMode = useRatioStore((s) => s.gameMode);

  // Active question based on team progress
  const activeQIndex = Math.max(blueTeam.currentQuestionIndex, redTeam.currentQuestionIndex);
  const question = RATIO_QUESTIONS[activeQIndex] || RATIO_QUESTIONS[0];

  const [activeTab, setActiveTab] = useState<'tape' | 'table' | 'unit_rate'>('tape');
  const [userMultiplier, setUserMultiplier] = useState<number>(question.diagram.multiplier);

  // Table rows for equivalent ratios
  const scaleMultipliers = [1, 2, 5, 10, question.diagram.multiplier];
  const uniqueMultipliers = Array.from(new Set(scaleMultipliers)).sort((a, b) => a - b);

  return (
    <div className="w-full bg-white/95 backdrop-blur-md rounded-2xl border border-slate-300 p-3 text-slate-800 shadow-2xl flex flex-col gap-2.5">
      {/* ── Tool Tabs ── */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center border border-amber-300">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-black uppercase tracking-wider text-slate-900">
            Studio Ratio Lab
          </span>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[10px] font-bold">
          <button
            onClick={() => setActiveTab('tape')}
            className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
              activeTab === 'tape' ? 'bg-amber-500 text-slate-950 font-black shadow-xs' : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            Tape Diagram
          </button>
          <button
            onClick={() => setActiveTab('table')}
            className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
              activeTab === 'table' ? 'bg-amber-500 text-slate-950 font-black shadow-xs' : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            Scaling Table
          </button>
          <button
            onClick={() => setActiveTab('unit_rate')}
            className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
              activeTab === 'unit_rate' ? 'bg-amber-500 text-slate-950 font-black shadow-xs' : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            Unit Rate
          </button>
        </div>
      </div>

      {/* ── Tab 1: Interactive Tape Diagram ── */}
      {activeTab === 'tape' && (
        <div className="flex flex-col gap-2 text-xs">
          {/* Base Ratio Description */}
          <div className="flex items-center justify-between text-[11px] text-slate-700 font-medium">
            <span>
              Base Ratio: <strong className="text-amber-700">{question.ratioA} : {question.ratioB}</strong>
            </span>
            <span>
              Scale Factor: <strong className="text-sky-700 font-bold">{userMultiplier}×</strong>
            </span>
          </div>

          {/* Row A Tape */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[10px] font-bold text-sky-700">
              <span>{question.labelA} ({question.ratioA} parts)</span>
              <span>Total: {question.ratioA * userMultiplier}</span>
            </div>
            <div className="flex items-center gap-0.5 w-full bg-slate-50 p-1 rounded-lg border border-sky-300 overflow-x-auto scrollbar-none">
              {Array.from({ length: Math.min(question.ratioA, 16) }).map((_, idx) => (
                <div
                  key={`tape-a-${idx}`}
                  className="flex-1 min-w-[14px] h-6 rounded bg-gradient-to-t from-sky-600 to-sky-400 text-white text-[9px] font-black flex items-center justify-center shadow-xs"
                >
                  {userMultiplier}
                </div>
              ))}
            </div>
          </div>

          {/* Row B Tape */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[10px] font-bold text-amber-700">
              <span>{question.labelB} ({question.ratioB} parts)</span>
              <span>Total: {question.ratioB * userMultiplier}</span>
            </div>
            <div className="flex items-center gap-0.5 w-full bg-slate-50 p-1 rounded-lg border border-amber-300 overflow-x-auto scrollbar-none">
              {Array.from({ length: Math.min(question.ratioB, 16) }).map((_, idx) => (
                <div
                  key={`tape-b-${idx}`}
                  className="flex-1 min-w-[14px] h-6 rounded bg-gradient-to-t from-amber-500 to-yellow-400 text-slate-950 text-[9px] font-black flex items-center justify-center shadow-xs"
                >
                  {userMultiplier}
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Multiplier Adjuster */}
          <div className="flex items-center gap-2 mt-1 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
            <Sliders className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="text-[10px] text-slate-600 font-bold">Multiplier:</span>
            <input
              type="range"
              min={1}
              max={Math.max(question.diagram.multiplier * 1.5, 60)}
              step={1}
              value={userMultiplier}
              onChange={(e) => setUserMultiplier(Number(e.target.value))}
              className="flex-1 accent-amber-500 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />
            <button
              onClick={() => setUserMultiplier(question.diagram.multiplier)}
              className="px-2 py-0.5 rounded bg-amber-100 hover:bg-amber-200 border border-amber-300 text-[9px] font-black text-amber-900 transition-all cursor-pointer"
            >
              Match Question ({question.diagram.multiplier}×)
            </button>
          </div>
        </div>
      )}

      {/* ── Tab 2: Equivalent Ratio Scaling Table ── */}
      {activeTab === 'table' && (
        <div className="flex flex-col gap-1.5 text-xs">
          <div className="w-full overflow-hidden rounded-xl border border-slate-300 bg-white">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-[10px] font-black text-slate-700 uppercase">
                  <th className="p-1.5 border-b border-slate-200">Scale Factor</th>
                  <th className="p-1.5 border-b border-slate-200">{question.labelA}</th>
                  <th className="p-1.5 border-b border-slate-200">{question.labelB}</th>
                  <th className="p-1.5 border-b border-slate-200">Status</th>
                </tr>
              </thead>
              <tbody className="text-[11px] font-medium text-slate-800 divide-y divide-slate-200">
                {uniqueMultipliers.map((mult) => {
                  const valA = question.ratioA * mult;
                  const valB = question.ratioB * mult;
                  const isTarget = mult === question.diagram.multiplier;
                  return (
                    <tr
                      key={`row-${mult}`}
                      className={isTarget ? 'bg-amber-50 font-bold text-amber-900' : 'hover:bg-slate-50'}
                    >
                      <td className="p-1.5 font-bold">× {mult}</td>
                      <td className="p-1.5 text-sky-700 font-bold">{valA}</td>
                      <td className="p-1.5 text-amber-700 font-bold">{valB}</td>
                      <td className="p-1.5 text-[10px]">
                        {isTarget ? (
                          <span className="flex items-center gap-1 text-emerald-700 font-black">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Target Shoot
                          </span>
                        ) : (
                          <span className="text-slate-400">Equivalent</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Tab 3: Unit Rate Calculation Breakdown ── */}
      {activeTab === 'unit_rate' && (
        <div className="flex flex-col gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          <div className="flex items-center gap-1.5 text-amber-700 font-black text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Unit Rate Solution Formula</span>
          </div>
          <p className="text-[11.5px] text-slate-700 leading-relaxed font-medium">
            {question.unitRateExplanation}
          </p>
          <div className="p-2 rounded-lg bg-amber-50 border border-amber-300 text-[10.5px] text-amber-900 font-medium">
            💡 <strong>Pro Studio Rule:</strong> To find any equivalent ratio, calculate the value of 1 single ratio unit, then multiply by the requested number of parts.
          </div>
        </div>
      )}
    </div>
  );
};
