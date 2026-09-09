'use client';

// ============================================================
// SKILLIZEE ARCADE — 3D Interactive Retro Arcade Lobby Dashboard
// Seamless Three.js 3D Arcade Arena with:
// - Physical 3D Cabinets in custom activity themes & colors
// - Glowing illuminated Top Marquees with Activity Names
// - Direct 3D Click-to-Play interaction
// - Floating Non-Intrusive HUD with Quick Filters & Audio Controls
// ============================================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gamepad2,
  Sparkles,
  Plus,
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
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

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
    { id: 'all', label: 'ALL 3D CABINETS' },
    { id: 'Heist & Escape', label: '#01 MATH VAULT' },
    { id: 'Adventure & Strategy', label: '#02 NUMBER RAILWAY' },
    { id: 'Theme Park & Chance', label: '#03 CARNIVAL OF CHANCE' },
    { id: 'Arcade Arena', label: '#04 COMING SOON' },
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

      {/* ── TOP FLOATING HEADER NAVIGATION BAR ── */}
      <header className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        
        {/* Logo & Branding */}
        <div className="flex items-center gap-3 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl border-2 border-amber-400/60 shadow-lg pointer-events-auto">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 p-0.5 shadow-md flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Gamepad2 className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black font-bank uppercase tracking-wider text-slate-950">
                SKILLIZEE <span className="text-amber-600">3D ARCADE</span>
              </h1>
              <span className="px-2 py-0.5 rounded-md bg-amber-100 border border-amber-400 text-amber-900 text-[10px] font-black font-game uppercase tracking-widest shadow-sm">
                GRADE 6
              </span>
            </div>
            <p className="text-[11px] text-slate-600 font-game tracking-wider hidden sm:block">
              Interactive Classroom Learning Cabinets in Full 3D
            </p>
          </div>
        </div>

        {/* Center Category Camera Filter Chips */}
        <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md p-1.5 rounded-2xl border-2 border-amber-400/60 shadow-lg pointer-events-auto overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                soundManager.playClick();
                setSelectedCategory(cat.id);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-black font-game uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-700 hover:bg-amber-100 hover:text-slate-950'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md p-1.5 rounded-2xl border-2 border-amber-400/60 shadow-lg pointer-events-auto">
          <button
            onClick={() => {
              soundManager.playClick();
              setShowAddModal(true);
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs font-game uppercase tracking-wider shadow hover:brightness-105 transition cursor-pointer border border-amber-600"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>CREATE CABINET</span>
          </button>

          <button
            onClick={toggleSound}
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            className="p-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 transition shadow cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-amber-600" />}
          </button>

          <button
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
            className="p-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 transition shadow cursor-pointer"
          >
            {isFullscreen ? <Minimize className="w-4 h-4 text-purple-600" /> : <Maximize className="w-4 h-4 text-purple-600" />}
          </button>
        </div>

      </header>

      {/* CENTER EMPTY SPACE TO LET 3D ARCADE MACHINES SHINE */}
      <div className="flex-1 pointer-events-none" />

      {/* ── FOOTER INTERACTIVE QUICK BAR ── */}
      <footer className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-8 py-2.5 flex flex-wrap items-center justify-between border-t-2 border-amber-400/50 bg-white/95 backdrop-blur-md rounded-t-2xl text-xs font-game tracking-wider text-slate-700 shadow-xl pointer-events-auto mb-1">
        <div className="flex items-center gap-3">
          <span className="font-black text-slate-950 flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-500" />
            3D ARCADE HALL:
          </span>
          <button
            onClick={() => router.push('/math-vault')}
            className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold border border-amber-300 transition cursor-pointer flex items-center gap-1"
          >
            <span>#01 Math Vault</span>
            <ArrowRight className="w-3 h-3 text-amber-700" />
          </button>
          <button
            onClick={() => router.push('/number-railway')}
            className="px-2.5 py-1 rounded-lg bg-sky-100 hover:bg-sky-200 text-sky-950 font-bold border border-sky-300 transition cursor-pointer flex items-center gap-1"
          >
            <span>#02 Number Railway</span>
            <ArrowRight className="w-3 h-3 text-sky-700" />
          </button>
          <button
            onClick={() => router.push('/carnival-of-chance')}
            className="px-2.5 py-1 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-950 font-bold border border-rose-300 transition cursor-pointer flex items-center gap-1"
          >
            <span>#03 Carnival of Chance</span>
            <ArrowRight className="w-3 h-3 text-rose-700" />
          </button>
        </div>

        <div className="text-slate-500 font-semibold hidden md:block">
          Hover or click on any 3D machine in the room to play!
        </div>
      </footer>

      {/* CREATE NEW CABINET MODAL */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 pointer-events-auto"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-md bg-white border-4 border-amber-400 rounded-3xl p-6 shadow-2xl text-slate-900 select-none flex flex-col gap-4"
            >
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-amber-600" />
                  <h3 className="text-xl font-black font-bank uppercase text-slate-950">
                    CREATE NEW CABINET
                  </h3>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-slate-950 font-bold p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-game">
                Cabinets #01 (<strong>Math Escape Vault</strong>), #02 (<strong>The Great Number Railway</strong>), and #03 (<strong>The Great Carnival of Chance</strong>) are live in full 3D! Remaining slots display <code className="text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-300">COMING SOON</code>.
              </p>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col gap-2 text-xs font-mono text-slate-700">
                <div className="flex justify-between">
                  <span>Cabinet #01:</span>
                  <span className="text-amber-700 font-bold">Math Escape Vault (/math-vault)</span>
                </div>
                <div className="flex justify-between">
                  <span>Cabinet #02:</span>
                  <span className="text-sky-700 font-bold">The Great Number Railway (/number-railway)</span>
                </div>
                <div className="flex justify-between">
                  <span>Cabinet #03:</span>
                  <span className="text-rose-700 font-bold">The Great Carnival of Chance (/carnival-of-chance)</span>
                </div>
                <div className="flex justify-between">
                  <span>Cabinet #04:</span>
                  <span className="text-purple-600 font-semibold">Slot #04 (In Production)</span>
                </div>
              </div>

              <button
                onClick={() => {
                  soundManager.playClick();
                  setShowAddModal(false);
                }}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black font-game uppercase tracking-wider shadow cursor-pointer hover:brightness-105 border border-amber-600"
              >
                GOT IT • BACK TO 3D ARCADE
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
};
