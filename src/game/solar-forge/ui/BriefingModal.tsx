'use client';

// ============================================================
// THE SOLAR FORGE: Mission Briefing Modal
// Introduces the engineering fantasy: "We are engineers using geometry to harness the sun."
// ============================================================

import React from 'react';
import { useSolarForgeStore } from '../store/solarForgeStore';

export const BriefingModal: React.FC = () => {
  const gamePhase = useSolarForgeStore((s) => s.gamePhase);
  const startForgeChallenge = useSolarForgeStore((s) => s.startForgeChallenge);

  if (gamePhase !== 'briefing') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm select-none animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 flex flex-col gap-5 text-slate-800">
        {/* Banner Top */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-2xl shadow-md">
            ☀️
          </div>
          <div>
            <span className="text-[11px] font-black uppercase tracking-widest text-amber-600">
              Grade 6 Mathematics • Angles & Constructions
            </span>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
              THE SOLAR FORGE
            </h1>
            <p className="text-xs font-bold text-slate-500">
              The Great Angle Energy Challenge
            </p>
          </div>
        </div>

        {/* Fantasy Mission Overview */}
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-xs leading-relaxed text-amber-950 flex flex-col gap-2">
          <p className="font-bold text-sm text-amber-900">
            Welcome, Lead Energy Engineers!
          </p>
          <p>
            You have been commissioned to operate a giant solar research facility. The Sun is traveling across the sky, and you must use <strong>geometry, angles, protractor measurements, and geometric constructions</strong> to direct sunlight through giant motorized heliostat mirrors and power the central Solar Forge!
          </p>
        </div>

        {/* 4 Mission Stages */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col gap-1">
            <span className="font-extrabold text-sky-700">1. Angle Types</span>
            <span className="text-[11px] text-slate-600">
              Classify acute, right, obtuse, straight, and reflex angles to calibrate mirror joints.
            </span>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col gap-1">
            <span className="font-extrabold text-sky-700">2. Protractor Calibration</span>
            <span className="text-[11px] text-slate-600">
              Align high-precision protractor instruments to rotate mirrors into target sun paths.
            </span>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col gap-1">
            <span className="font-extrabold text-sky-700">3. Missing Angles</span>
            <span className="text-[11px] text-slate-600">
              Solve straight-line (180°), complementary (90°), and vertically opposite beam paths.
            </span>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col gap-1">
            <span className="font-extrabold text-sky-700">4. Sundial & Ignition</span>
            <span className="text-[11px] text-slate-600">
              Use the physical 3D sundial shadow to calculate the final beam bounce and ignite the Forge!
            </span>
          </div>
        </div>

        {/* Two-Team Notice */}
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 pt-1 border-t border-slate-100">
          <span className="text-sky-600">🔵 Blue Squadron: Controls on Left</span>
          <span className="text-red-600">🔴 Red Corps: Controls on Right</span>
        </div>

        {/* Start Button */}
        <button
          onClick={startForgeChallenge}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-black text-sm tracking-wider uppercase shadow-lg shadow-orange-500/25 transition-all active:scale-98"
        >
          COMMENCE SOLAR EXPEDITION ☀️
        </button>
      </div>
    </div>
  );
};
