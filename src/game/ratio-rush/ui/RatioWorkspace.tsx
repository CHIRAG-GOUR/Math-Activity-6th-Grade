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
  const questions = useRatioStore((s) => s.questions || RATIO_QUESTIONS);

  // Active question based on team progress
  const activeQIndex = Math.max(blueTeam.currentQuestionIndex, redTeam.currentQuestionIndex);
  const question = questions[activeQIndex] || questions[0] || RATIO_QUESTIONS[0];


  const [activeTab, setActiveTab] = useState<'tape' | 'table' | 'unit_rate'>('tape');
  const [userMultiplier, setUserMultiplier] = useState<number>(question.diagram.multiplier);

  // Table rows for equivalent ratios
  const scaleMultipliers = [1, 2, 5, 10, question.diagram.multiplier];
  const uniqueMultipliers = Array.from(new Set(scaleMultipliers)).sort((a, b) => a - b);

  return (
    <div className="w-full bg-white rounded-2xl border-4 border-black p-4 text-black shadow-[8px_8px_0px_#000000] flex flex-col gap-3">
      {/* ── Tool Tabs ── */}
      <div className="flex items-center justify-between border-b-3 border-black pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-yellow-400 text-black flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_#000000]">
            <Layers className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="text-xs font-black uppercase tracking-wider text-black">
            Studio Ratio Lab
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-yellow-100 p-1 rounded-xl border-2 border-black text-xs font-black">
          <button
            onClick={() => setActiveTab('tape')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              activeTab === 'tape' ? 'bg-yellow-400 text-black border-2 border-black shadow-[2px_2px_0px_#000000]' : 'text-black hover:bg-white'
            }`}
          >
            Tape Diagram
          </button>
          <button
            onClick={() => setActiveTab('table')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              activeTab === 'table' ? 'bg-yellow-400 text-black border-2 border-black shadow-[2px_2px_0px_#000000]' : 'text-black hover:bg-white'
            }`}
          >
            Scaling Table
          </button>
          <button
            onClick={() => setActiveTab('unit_rate')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              activeTab === 'unit_rate' ? 'bg-yellow-400 text-black border-2 border-black shadow-[2px_2px_0px_#000000]' : 'text-black hover:bg-white'
            }`}
          >
            Unit Rate
          </button>
        </div>
      </div>

      {/* ── Tab 1: Interactive Tape Diagram ── */}
      {activeTab === 'tape' && (
        <div className="flex flex-col gap-2.5 text-xs">
          {/* Base Ratio Description */}
          <div className="flex items-center justify-between text-xs text-black font-extrabold">
            <span>
              Base Ratio: <strong className="bg-yellow-300 px-1.5 py-0.5 rounded border border-black">{question.ratioA} : {question.ratioB}</strong>
            </span>
            <span>
              Scale Factor: <strong className="bg-blue-300 px-1.5 py-0.5 rounded border border-black">{userMultiplier}×</strong>
            </span>
          </div>

          {/* Row A Tape */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[11px] font-black text-black">
              <span>{question.labelA} ({question.ratioA} parts)</span>
              <span>Total: {question.ratioA * userMultiplier}</span>
            </div>
            <div className="flex items-center gap-1 w-full bg-blue-50 p-1.5 rounded-xl border-2 border-black overflow-x-auto scrollbar-none">
              {Array.from({ length: Math.min(question.ratioA, 16) }).map((_, idx) => (
                <div
                  key={`tape-a-${idx}`}
                  className="flex-1 min-w-[20px] h-7 rounded-lg bg-blue-500 border border-black text-white text-xs font-black flex items-center justify-center shadow-[1px_1px_0px_#000000]"
                >
                  {userMultiplier}
                </div>
              ))}
            </div>
          </div>

          {/* Row B Tape */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[11px] font-black text-black">
              <span>{question.labelB} ({question.ratioB} parts)</span>
              <span>Total: {question.ratioB * userMultiplier}</span>
            </div>
            <div className="flex items-center gap-1 w-full bg-yellow-50 p-1.5 rounded-xl border-2 border-black overflow-x-auto scrollbar-none">
              {Array.from({ length: Math.min(question.ratioB, 16) }).map((_, idx) => (
                <div
                  key={`tape-b-${idx}`}
                  className="flex-1 min-w-[20px] h-7 rounded-lg bg-yellow-400 border border-black text-black text-xs font-black flex items-center justify-center shadow-[1px_1px_0px_#000000]"
                >
                  {userMultiplier}
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Multiplier Adjuster */}
          <div className="flex items-center gap-2 mt-1 bg-yellow-50 p-2 rounded-xl border-2 border-black">
            <Sliders className="w-4 h-4 text-black shrink-0 stroke-[2.5]" />
            <span className="text-xs text-black font-black">Multiplier:</span>
            <input
              type="range"
              min={1}
              max={Math.max(question.diagram.multiplier * 1.5, 60)}
              step={1}
              value={userMultiplier}
              onChange={(e) => setUserMultiplier(Number(e.target.value))}
              className="flex-1 accent-yellow-400 h-2 bg-white border border-black rounded-lg cursor-pointer"
            />
            <button
              onClick={() => setUserMultiplier(question.diagram.multiplier)}
              className="px-2.5 py-1 rounded-lg bg-yellow-400 hover:bg-yellow-300 border-2 border-black text-xs font-black text-black shadow-[2px_2px_0px_#000000] active:shadow-none transition-all cursor-pointer"
            >
              Match ({question.diagram.multiplier}×)
            </button>
          </div>
        </div>
      )}

      {/* ── Tab 2: Equivalent Ratio Scaling Table ── */}
      {activeTab === 'table' && (
        <div className="flex flex-col gap-1.5 text-xs">
          <div className="w-full overflow-hidden rounded-xl border-2 border-black bg-white">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-yellow-300 text-xs font-black text-black uppercase border-b-2 border-black">
                  <th className="p-2 border-r-2 border-black">Scale Factor</th>
                  <th className="p-2 border-r-2 border-black">{question.labelA}</th>
                  <th className="p-2 border-r-2 border-black">{question.labelB}</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody className="text-xs font-extrabold text-black divide-y-2 divide-black">
                {uniqueMultipliers.map((mult) => {
                  const valA = question.ratioA * mult;
                  const valB = question.ratioB * mult;
                  const isTarget = mult === question.diagram.multiplier;
                  return (
                    <tr
                      key={`row-${mult}`}
                      className={isTarget ? 'bg-yellow-100 font-black' : 'hover:bg-yellow-50'}
                    >
                      <td className="p-2 font-black border-r-2 border-black">× {mult}</td>
                      <td className="p-2 border-r-2 border-black text-blue-700 font-black">{valA}</td>
                      <td className="p-2 border-r-2 border-black text-black font-black">{valB}</td>
                      <td className="p-2">
                        {isTarget ? (
                          <span className="flex items-center gap-1 text-emerald-700 font-black">
                            <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" /> Target Shoot
                          </span>
                        ) : (
                          <span className="text-slate-500 font-bold">Equivalent</span>
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
        <div className="flex flex-col gap-2 text-xs bg-yellow-50 p-3 rounded-xl border-2 border-black">
          <div className="flex items-center gap-1.5 text-black font-black text-xs">
            <Sparkles className="w-4 h-4 text-black stroke-[2.5]" />
            <span>Unit Rate Solution Formula</span>
          </div>
          <p className="text-xs text-black leading-relaxed font-bold">
            {question.unitRateExplanation}
          </p>
          <div className="p-2 rounded-lg bg-yellow-200 border-2 border-black text-xs text-black font-extrabold shadow-[2px_2px_0px_#000000]">
            💡 <strong>Pro Studio Rule:</strong> Calculate the value of 1 ratio part first, then multiply by the required parts!
          </div>
        </div>
      )}
    </div>
  );
};
