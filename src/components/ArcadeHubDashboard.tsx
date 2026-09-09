'use client';

// ============================================================
// SKILLIZEE ARCADE — 3D Interactive Retro Arcade Lobby Dashboard
// Seamless Three.js 3D Arcade Arena with:
// - Physical 3D Cabinets in rich custom activity themes & colors
// - Overhead prominent Name & Topic cards for instant readability
// - Direct 3D Click-to-Play interaction
// - Clean unified bottom dock bar with quick filters & audio controls
// ============================================================

import React, { useState, useEffect } from 'react';
import {
  Gamepad2,
  Maximize,
  Minimize,
  Volume2,
  VolumeX,
  Flame,
  ArrowRight,
} from 'lucide-react';
import { ArcadeLobbyScene } from './ArcadeLobbyScene';
import { soundManager } from '@/utils/audio';
import { useRouter } from 'next/navigation';

export const ArcadeHubDashboard: React.FC = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(soundManager.getMuted());

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      soundManager.stopBgm();
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    soundManager.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const toggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  const categories = [
    { id: 'all', label: 'ALL 3D MACHINES' },
    { id: '#01 MATH VAULT', label: '#01 MATH VAULT' },
    { id: '#02 NUMBER RAILWAY', label: '#02 NUMBER RAILWAY' },
    { id: '#03 CARNIVAL OF CHANCE', label: '#03 CARNIVAL OF CHANCE' },
    { id: '#04 COMING SOON', label: '#04 COMING SOON' },
  ];

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#fffbeb] select-none text-slate-800 flex flex-col justify-between">
      
      {/* ── 3D RETRO ARCADE PLACE WITH CLICKABLE 3D CABINETS ── */}
      <ArcadeLobbyScene
        selectedCategory={selectedCategory}
        onSelectCabinet={(id) => {
          if (id === 'math-escape-vault') router.push('/math-vault');
          else if (id === 'number-railway') router.push('/number-railway');
          else if (id === 'carnival-of-chance') router.push('/carnival-of-chance');
        }}
      />

      {/* ── TOP OPEN VIEWPORT (Leaves 3D Scene and Floating Overhead Cards Clear) ── */}
      <div className="flex-1 pointer-events-none" />

      {/* ── UNIFIED BOTTOM NAVIGATION DOCK ── */}
      <footer className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3 border-t-2 border-amber-400/60 bg-white/95 backdrop-blur-md rounded-t-3xl text-xs font-game tracking-wider text-slate-700 shadow-2xl pointer-events-auto mb-1">
        
        {/* Left: Branding & Tag */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 p-0.5 shadow-md flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[9px] flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black font-bank uppercase tracking-wider text-slate-950">
                SKILLIZEE <span className="text-amber-600">3D ARCADE</span>
              </h1>
              <span className="px-2 py-0.5 rounded-md bg-amber-100 border border-amber-400 text-amber-900 text-[10px] font-black font-game uppercase tracking-widest shadow-sm">
                GRADE 6
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-game hidden sm:block">
              Click any 3D arcade machine above to enter activity
            </p>
          </div>
        </div>

        {/* Center: Category Machine Focus Filter Pills */}
        <div className="flex items-center gap-1.5 bg-amber-50/80 p-1.5 rounded-2xl border border-amber-300 shadow-inner overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                soundManager.playClick();
                setSelectedCategory(cat.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black font-game uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold scale-105'
                  : 'text-slate-700 hover:bg-white hover:text-slate-950'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Right: Quick Launch & Audio/Screen Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            className="p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 transition shadow cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-amber-600" />}
          </button>

          <button
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
            className="p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 transition shadow cursor-pointer"
          >
            {isFullscreen ? <Minimize className="w-4 h-4 text-purple-600" /> : <Maximize className="w-4 h-4 text-purple-600" />}
          </button>
        </div>

      </footer>

    </main>
  );
};
