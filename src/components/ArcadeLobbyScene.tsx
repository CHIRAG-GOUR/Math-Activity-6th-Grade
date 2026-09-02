'use client';

import React from 'react';

export const ArcadeLobbyScene: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      
      {/* 1. BRIGHT, LIGHT & WARM ARCADE WALLS GRADIENT */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#fffbeb] via-[#fef3c7] via-45% to-[#fde68a]" />

      {/* 2. SOFT WARM DAYLIGHT & SUNNY TRACK SPOTLIGHTS */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-200/40 rounded-full blur-3xl" />
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-sky-200/35 rounded-full blur-3xl" />
      <div className="absolute top-5 left-1/2 -translate-x-1/2 w-[700px] h-72 bg-amber-300/30 rounded-full blur-3xl" />

      {/* 3. LIGHT VIBRANT ARCADE CANOPY & STRIPED WALL ACCENTS */}
      <div className="absolute top-0 inset-x-0 h-40 opacity-40 flex justify-between px-16">
        <div className="w-2 h-40 bg-gradient-to-b from-amber-400 to-transparent shadow-[0_0_20px_#f59e0b]" />
        <div className="w-2 h-40 bg-gradient-to-b from-sky-400 to-transparent shadow-[0_0_20px_#0284c7]" />
        <div className="w-2 h-40 bg-gradient-to-b from-rose-400 to-transparent shadow-[0_0_20px_#e11d48]" />
        <div className="w-2 h-40 bg-gradient-to-b from-amber-400 to-transparent shadow-[0_0_20px_#f59e0b]" />
      </div>

      {/* 4. LIGHT HONEY-TONED POLISHED WOOD FLOOR PERSPECTIVE */}
      <div className="absolute bottom-0 inset-x-0 h-[48%] perspective-[800px]">
        <div 
          style={{
            transform: 'rotateX(55deg)',
            transformOrigin: 'bottom center',
            background: `
              repeating-linear-gradient(
                90deg,
                #d99b58 0px,
                #c5833e 4px,
                #e5b370 60px,
                #b8742d 120px,
                #d39652 124px
              ),
              linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(0,0,0,0.15) 100%)
            `,
            boxShadow: 'inset 0 10px 30px rgba(0,0,0,0.2), 0 -10px 40px rgba(245,158,11,0.2)',
          }}
          className="w-full h-[150%] relative border-t-4 border-amber-400/60"
        >
          {/* Wood Floor Planks Horizontal Seams */}
          <div 
            style={{
              backgroundImage: `repeating-linear-gradient(
                0deg,
                rgba(0,0,0,0.15) 0px,
                rgba(0,0,0,0.15) 2px,
                transparent 2px,
                transparent 45px
              )`,
            }}
            className="absolute inset-0"
          />

          {/* Bright Specular Highlight Reflections from Cabinets & Overhead Lights */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-amber-200/25 to-white/30" />
          
          {/* Reflective Light Cones on Honey Wood Floor */}
          <div className="absolute top-0 left-[20%] w-72 h-full bg-blue-300/25 blur-3xl transform -skew-x-12" />
          <div className="absolute top-0 right-[20%] w-72 h-full bg-amber-300/35 blur-3xl transform skew-x-12" />
        </div>
      </div>

      {/* 5. VIBRANT GOLD BASEBOARD ACCENT */}
      <div className="absolute bottom-[48%] inset-x-0 h-2 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.6)] opacity-80" />

    </div>
  );
};
