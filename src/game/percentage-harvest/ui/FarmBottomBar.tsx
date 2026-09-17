// ============================================================
// PERCENTAGE HARVEST — BOTTOM STATUS BAR & CROP GROWTH TIMELINE
// Light Aesthetic, Farm Clock, Step-by-Step Crop Growth & Weather Capsule
// ============================================================

import React from 'react';
import {
  Sun,
  Clock,
  FastForward,
} from 'lucide-react';
import { useFarmStore } from '../store/farmStore';

export const FarmBottomBar: React.FC = () => {
  const blue = useFarmStore((s) => s.blue);
  const red = useFarmStore((s) => s.red);
  const matchQuestionCount = useFarmStore((s) => s.matchQuestionCount);

  const currentRound = Math.max(blue.currentRound, red.currentRound);
  const totalQ = matchQuestionCount;
  const currentStep = Math.min(5, Math.floor(((currentRound - 1) / totalQ) * 5) + 1);

  const steps = [
    { id: 1, label: 'Sow', icon: '🌰', desc: 'Seeds Planted' },
    { id: 2, label: 'Sprout & Manure', icon: '🌱', desc: 'Young Shoots' },
    { id: 3, label: 'Growing', icon: '🌿', desc: 'Nutrients & Water' },
    { id: 4, label: 'Pest Spray', icon: '🌾', desc: 'Protection' },
    { id: 5, label: 'Harvest & Sell', icon: '🚜', desc: 'Market Logistics' },
  ];

  return (
    <footer className="relative z-30 w-full flex items-center justify-between gap-3 px-4 pb-2.5 pt-1 pointer-events-none max-w-[1880px] mx-auto">
      {/* ── LEFT: FARM CLOCK CAPSULE ── */}
      <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/95 text-slate-800 border-2 border-slate-200 shadow-md pointer-events-auto backdrop-blur-md">
        <Sun className="w-4 h-4 text-amber-500" />
        <div className="flex flex-col">
          <span className="text-[9px] font-black uppercase tracking-wider text-amber-700">
            DAY {currentStep === 1 ? 1 : currentStep === 2 ? 3 : currentStep === 3 ? 6 : currentStep === 4 ? 10 : 15}
          </span>
          <span className="text-xs font-black font-mono text-slate-900">
            {currentStep === 1 ? '08:30 AM' : currentStep === 2 ? '10:15 AM' : currentStep === 3 ? '02:00 PM' : currentStep === 4 ? '09:45 AM' : '11:30 AM'}
          </span>
        </div>
      </div>

      {/* ── CENTER: CROP GROWTH PROGRESS CAPSULE ── */}
      <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/95 text-slate-800 border-2 border-slate-200 shadow-md pointer-events-auto backdrop-blur-md">
        <span className="text-[11px] font-black uppercase tracking-wider text-slate-600 hidden md:inline">
          Crop Growth Progress:
        </span>

        <div className="flex items-center gap-1 sm:gap-1.5">
          {steps.map((step, idx) => {
            const isCompleted = step.id <= currentStep;
            const isCurrent = step.id === currentStep;

            return (
              <React.Fragment key={`growth-step-${step.id}`}>
                <div
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-lg transition-all ${
                    isCurrent
                      ? 'bg-gradient-to-r from-emerald-600 to-green-500 text-white shadow-xs scale-105 font-black'
                      : isCompleted
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold'
                      : 'bg-slate-100 text-slate-400 border border-slate-200 font-medium'
                  }`}
                >
                  <span className="text-xs">{step.icon}</span>
                  <span className="text-[10px]">{step.label}</span>
                </div>

                {idx < steps.length - 1 && (
                  <span className="text-slate-400 font-black text-[10px]">→</span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ── RIGHT: WEATHER & TEMPERATURE CAPSULE ── */}
      <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 text-slate-800 border-2 border-slate-200 shadow-md pointer-events-auto backdrop-blur-md">
        <Sun className="w-4 h-4 text-amber-500" />
        <div className="flex flex-col">
          <span className="text-[9px] font-black uppercase tracking-wider text-amber-700">
            Sunny
          </span>
          <span className="text-xs font-black font-mono text-slate-900">
            24°C
          </span>
        </div>
      </div>
    </footer>
  );
};
