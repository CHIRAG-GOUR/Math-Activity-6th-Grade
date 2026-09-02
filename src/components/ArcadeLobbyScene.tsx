'use client';

import React from 'react';

export const ArcadeLobbyScene: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      
      {/* 1. WARM LUXURY ARCADE WALLS GRADIENT (Bright, inviting ambient lighting) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a2c42] via-[#243b55] via-50% to-[#1e293b]" />

      {/* 2. OVERHEAD AMBIENT TRACK SPOTLIGHTS */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-400/25 rounded-full blur-3xl" />
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-64 bg-blue-500/20 rounded-full blur-3xl" />

      {/* 3. RETRO-MODERN ARCADE NEON GEOMETRIC WALL ACCENTS */}
      <div className="absolute top-0 inset-x-0 h-32 opacity-30 flex justify-between px-12">
        <div className="w-1 h-32 bg-gradient-to-b from-cyan-400 to-transparent shadow-[0_0_15px_#00f0ff]" />
        <div className="w-1 h-32 bg-gradient-to-b from-amber-400 to-transparent shadow-[0_0_15px_#ffd700]" />
        <div className="w-1 h-32 bg-gradient-to-b from-purple-400 to-transparent shadow-[0_0_15px_#c084fc]" />
        <div className="w-1 h-32 bg-gradient-to-b from-cyan-400 to-transparent shadow-[0_0_15px_#00f0ff]" />
      </div>

      {/* 4. REAL POLISHED HARDWOOD FLOOR PERSPECTIVE (BRIGHT WOOD PLANK TEXTURE) */}
      <div className="absolute bottom-0 inset-x-0 h-[48%] perspective-[800px]">
        <div 
          style={{
            transform: 'rotateX(55deg)',
            transformOrigin: 'bottom center',
            background: `
              repeating-linear-gradient(
                90deg,
                #b87333 0px,
                #9a5823 4px,
                #c68346 60px,
                #854519 120px,
                #ab6831 124px
              ),
              linear-gradient(180deg, rgba(255,255,255,0.25) 0%, rgba(0,0,0,0.4) 100%)
            `,
            boxShadow: 'inset 0 10px 40px rgba(0,0,0,0.6), 0 -15px 50px rgba(255,215,0,0.15)',
          }}
          className="w-full h-[150%] relative border-t-4 border-amber-300/40"
        >
          {/* Wood Floor Planks Horizontal Seams */}
          <div 
            style={{
              backgroundImage: `repeating-linear-gradient(
                0deg,
                rgba(0,0,0,0.3) 0px,
                rgba(0,0,0,0.3) 2px,
                transparent 2px,
                transparent 45px
              )`,
            }}
            className="absolute inset-0"
          />

          {/* Golden Specular Highlight Reflections from Cabinets & Overhead Lights */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-amber-300/10 to-cyan-300/15" />
          
          {/* Reflective Arcade Light Cones on Wood Floor */}
          <div className="absolute top-0 left-[20%] w-64 h-full bg-cyan-400/15 blur-2xl transform -skew-x-12" />
          <div className="absolute top-0 right-[20%] w-64 h-full bg-amber-400/20 blur-2xl transform skew-x-12" />
        </div>
      </div>

      {/* 5. VIBRANT BASEBOARD & CORNER ACCENTS */}
      <div className="absolute bottom-[48%] inset-x-0 h-2 bg-gradient-to-r from-amber-400 via-cyan-400 to-amber-400 shadow-[0_0_20px_rgba(255,215,0,0.8)] opacity-60" />

    </div>
  );
};
