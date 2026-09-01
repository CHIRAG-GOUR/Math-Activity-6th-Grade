'use client';

import React from 'react';

export const Room3DScene: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="absolute inset-0 overflow-hidden select-none pointer-events-none z-0 bg-[#357fca]">
      
      {/* 1. ROOM CEILING (Light White/Grey Perspective) */}
      <div
        className="absolute top-0 inset-x-0 h-[15%] bg-gradient-to-b from-[#ffffff] to-[#e2e8f0] border-b-2 border-slate-700 z-0 shadow-md"
        style={{
          clipPath: 'polygon(0% 0%, 100% 0%, 90% 100%, 10% 100%)',
        }}
      >
        {/* Subtle Ceiling Tile Seams */}
        <div className="absolute inset-0 flex justify-around opacity-20">
          <div className="w-px h-full bg-slate-600" />
          <div className="w-px h-full bg-slate-600" />
          <div className="w-px h-full bg-slate-600" />
        </div>
      </div>

      {/* 2. CCTV CAMERA (Top Right Corner matching reference) */}
      <div className="absolute top-1 right-[11%] z-20 flex flex-col items-center">
        {/* Ceiling Mount Rod */}
        <div className="w-2.5 h-6 bg-slate-700 border-x border-slate-900" />
        {/* Base */}
        <div className="w-9 h-3 bg-slate-800 rounded-sm border border-slate-600 shadow" />
        {/* Body */}
        <div
          className="relative w-14 h-8 bg-slate-800 rounded-md border-2 border-slate-600 shadow-lg flex items-center justify-between px-1.5"
          style={{ transform: 'rotate(-25deg)' }}
        >
          <div className="w-4 h-4 rounded-full bg-cyan-400 border-2 border-slate-950 shadow-[0_0_10px_#00e5ff] animate-pulse" />
          <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
        </div>
      </div>

      {/* 3. LEFT PERSPECTIVE BLUE WALL (With Intercom/Panel) */}
      <div
        className="absolute top-0 left-0 w-[18%] h-full bg-gradient-to-r from-[#20558e] to-[#2c6ea9] border-r-2 border-slate-800 z-0 flex flex-col justify-center px-4"
        style={{
          clipPath: 'polygon(0% 0%, 100% 15%, 100% 80%, 0% 100%)',
        }}
      >
        {/* Left Security Control Panel */}
        <div className="w-24 h-16 bg-[#16385d] rounded-lg border-2 border-slate-800 p-2 shadow-inner flex flex-col justify-between">
          <div className="flex justify-around">
            <div className="w-6 h-6 bg-slate-800 rounded border border-slate-600 flex items-center justify-center text-[10px] text-white font-bold">
              ⬇
            </div>
            <div className="w-6 h-6 bg-slate-800 rounded border border-slate-600 flex items-center justify-center text-[10px] text-white font-bold">
              ⬇
            </div>
          </div>
          <div className="w-full h-1.5 bg-cyan-400 rounded-full shadow-[0_0_8px_#00e5ff]" />
        </div>
      </div>

      {/* 4. RIGHT PERSPECTIVE BLUE WALL (Safety Lockers Column & Door) */}
      <div
        className="absolute top-0 right-0 w-[24%] h-full bg-[#2c6ea9] border-l-2 border-slate-800 z-0 flex"
        style={{
          clipPath: 'polygon(0% 15%, 100% 0%, 100% 100%, 0% 80%)',
        }}
      >
        {/* Security Sub-Door (H300) */}
        <div className="w-[50%] h-full border-r-2 border-slate-800 flex flex-col justify-center p-3">
          <div className="w-16 h-6 bg-slate-100 rounded border border-slate-800 flex items-center justify-center text-[11px] font-black text-slate-800 tracking-wider mb-4 shadow">
            H300
          </div>
          {/* Hexagonal White Badge */}
          <div
            className="w-16 h-18 bg-white border-2 border-slate-800 shadow-inner flex items-center justify-center mb-6"
            style={{
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            }}
          />
          {/* Lock Handle */}
          <div className="w-4 h-10 bg-amber-400 rounded border border-amber-800 shadow" />
        </div>

        {/* Safety Deposit Lockers Column */}
        <div className="w-[50%] h-full flex flex-col justify-around py-16 px-2 bg-[#235889]">
          {Array.from({ length: 9 }).map((_, idx) => (
            <div
              key={idx}
              className="w-full h-7 bg-[#2e74b3] rounded border border-slate-800 shadow-sm flex items-center justify-between px-2"
            >
              <div className="w-3.5 h-1 bg-slate-900 rounded-full" />
              <div className="w-2 h-2 bg-slate-800 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* 5. CENTER FEATURE WALL (Surrounding the vault plate) */}
      <div className="absolute top-[15%] inset-x-[18%] h-[65%] bg-gradient-to-b from-[#357fca] via-[#3176bd] to-[#25629c] border-b-2 border-slate-800 z-0" />

      {/* 6. ROOM FLOOR (Perspective Light Floor with Floor Mats) */}
      <div
        className="absolute bottom-0 inset-x-0 h-[20%] bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] border-t-2 border-slate-700 z-0"
        style={{
          clipPath: 'polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)',
        }}
      >
        {/* Left Floor Mat (Orange/Red) */}
        <div
          className="absolute left-[12%] bottom-3 w-28 h-12 bg-gradient-to-br from-rose-500 to-rose-700 border-2 border-white rounded shadow-md transform -skew-x-12"
        />

        {/* Right Floor Mat */}
        <div
          className="absolute right-[20%] bottom-3 w-28 h-12 bg-gradient-to-br from-rose-500 to-rose-700 border-2 border-white rounded shadow-md transform skew-x-12"
        />

        {/* Floor Depth Lines */}
        <div className="absolute inset-0 opacity-25 pointer-events-none">
          <div className="w-0.5 h-full bg-slate-400 absolute left-1/3 transform -skew-x-12" />
          <div className="w-0.5 h-full bg-slate-400 absolute right-1/3 transform skew-x-12" />
        </div>
      </div>

      {children}
    </div>
  );
};
