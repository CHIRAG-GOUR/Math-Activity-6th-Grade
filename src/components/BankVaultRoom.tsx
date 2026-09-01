'use client';

import React from 'react';
import { ShieldCheck, Video } from 'lucide-react';

export const BankVaultRoom: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none -z-10 bank-wall-bg">
      {/* 1. ARCHITECTURAL WALL MOULDINGS & PANELS */}
      <div className="absolute inset-0 grid grid-cols-6 gap-6 p-6 opacity-35">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-full rounded-2xl border-2 border-[#d9a441]/40 shadow-[inset_0_0_20px_rgba(217,164,65,0.1)]"
          />
        ))}
      </div>

      {/* 2. TOP CEILING CORNICE & OVERHEAD LIGHTS */}
      <div className="absolute top-0 inset-x-0 h-12 bg-gradient-to-b from-[#e8c77b] via-[#f7e7c6] to-transparent border-b-2 border-[#d9a441]/60 flex items-center justify-between px-12">
        {/* Left Security Camera */}
        <div className="flex items-center gap-2 text-slate-700 bg-white/70 px-3 py-1 rounded-full border border-amber-300 shadow-sm">
          <Video className="w-3.5 h-3.5 text-slate-600 animate-pulse" />
          <span className="text-[10px] font-bold tracking-widest uppercase font-game text-slate-600">
            CAM 01 • SECURE
          </span>
        </div>

        {/* Center Bank Seal */}
        <div className="flex items-center gap-1.5 text-amber-900 bg-white/80 px-4 py-1 rounded-full border border-amber-400 shadow-sm">
          <ShieldCheck className="w-4 h-4 text-amber-600" />
          <span className="text-xs font-black tracking-widest uppercase font-game">
            RESERVE BANK VAULT • SECTOR 7
          </span>
        </div>

        {/* Right Security Cam / Exit Sign */}
        <div className="flex items-center gap-2 text-emerald-800 bg-emerald-100/90 px-3 py-1 rounded-md border border-emerald-400 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-[10px] font-extrabold tracking-wider uppercase font-game">
            SYSTEM ONLINE
          </span>
        </div>
      </div>

      {/* 3. WARM OVERHEAD VOLUMETRIC CONES OF LIGHT */}
      <div className="absolute -top-10 left-1/4 w-96 h-[500px] bg-gradient-to-b from-amber-100/60 via-amber-200/20 to-transparent blur-3xl transform -rotate-12 pointer-events-none" />
      <div className="absolute -top-10 right-1/4 w-96 h-[500px] bg-gradient-to-b from-amber-100/60 via-amber-200/20 to-transparent blur-3xl transform rotate-12 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-amber-300/20 blur-[130px] pointer-events-none" />

      {/* 4. TEAM SIDE AMBIENT LIGHT ACCENTS */}
      <div className="absolute left-0 top-1/3 w-80 h-96 bg-blue-400/10 blur-[100px] pointer-events-none" />
      <div className="absolute right-0 top-1/3 w-80 h-96 bg-rose-400/10 blur-[100px] pointer-events-none" />

      {/* 5. POLISHED MARBLE REFLECTION FLOOR AT BOTTOM */}
      <div className="absolute bottom-0 inset-x-0 h-40 bank-marble-floor border-t-4 border-[#d9a441] flex flex-col justify-end p-4">
        {/* Subtle Gold Bullion Vault Grate Silhouettes at floor base */}
        <div className="w-full flex justify-between px-10 opacity-30 text-amber-950 text-[11px] font-black tracking-widest uppercase font-game">
          <span>SECURE REPOSITORY SUB-LEVEL</span>
          <span>MAXIMUM REINFORCEMENT CLASS-A</span>
        </div>
      </div>
    </div>
  );
};
