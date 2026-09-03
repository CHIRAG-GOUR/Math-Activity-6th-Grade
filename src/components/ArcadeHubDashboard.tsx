'use client';

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
  GraduationCap,
} from 'lucide-react';
import { ArcadeLobbyScene } from './ArcadeLobbyScene';
import { ArcadeMachineCard, ArcadeGameData } from './ArcadeMachineCard';
import { soundManager } from '@/utils/audio';

const ARCADE_GAMES: ArcadeGameData[] = [
  {
    id: 'math-escape-vault',
    number: '01',
    title: 'MATH ESCAPE VAULT',
    subtitle: 'Grade 6 Bloom’s Mental Math Heist',
    grade: 'Grade 6',
    category: 'Heist & Escape',
    status: 'active',
    image: '/images/math-vault-card.jpg',
    route: '/math-vault',
    description: 'Fast 2-team head-to-head keypad battle. Solve 5 progressive codes to crack the bank vault into the GTA V Treasury!',
    tags: ['BODMAS', 'Integers', 'Fractions', 'Percentages', 'Equations', 'Ratios'],
    theme: {
      cabinetColor: 'bg-gradient-to-b from-[#1e3a8a] via-[#172554] to-[#0f172a]',
      marqueeBg: 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500',
      marqueeText: 'text-slate-950',
      bezelBorder: 'border-amber-400',
      joystickColor: 'bg-blue-500',
      buttonColors: ['bg-yellow-400', 'bg-cyan-400', 'bg-blue-600', 'bg-amber-500'],
      accentGlow: 'rgba(245,158,11,0.5)',
    },
  },
  {
    id: 'number-railway',
    number: '02',
    title: 'THE GREAT NUMBER RAILWAY',
    subtitle: 'Place Value & Rounding Railway Operations',
    grade: 'Grade 6',
    category: 'Adventure & Strategy',
    status: 'active',
    image: '/images/number-railway-card.jpg',
    route: '/number-railway',
    description: 'Operate a 3D railway network! Use place value and rounding to load cargo, board passengers, operate switches, and cruise between stations.',
    tags: ['Place Value', 'Rounding', 'Railway', '3D World', 'Train Operations'],
    theme: {
      cabinetColor: 'bg-gradient-to-b from-[#1e3a5f] via-[#0f2340] to-[#0a1628]',
      marqueeBg: 'bg-gradient-to-r from-sky-400 via-cyan-300 to-teal-400',
      marqueeText: 'text-slate-950',
      bezelBorder: 'border-sky-400',
      joystickColor: 'bg-cyan-500',
      buttonColors: ['bg-sky-400', 'bg-teal-400', 'bg-amber-400', 'bg-red-500'],
      accentGlow: 'rgba(14,165,233,0.5)',
    },
  },
  {
    id: 'slot-03',
    number: '03',
    title: 'COMING SOON',
    subtitle: 'Next Activity in Production',
    grade: 'Grade 6',
    category: 'Puzzle & Logic',
    status: 'planned',
    image: '/images/math-vault-card.jpg',
    route: '#',
    description: 'The next exciting 3D mathematics club activity is currently under development.',
    tags: ['Upcoming', 'Mathematics', 'Classroom Duel'],
    theme: {
      cabinetColor: 'bg-gradient-to-b from-[#581c87] via-[#3b0764] to-[#1e0538]',
      marqueeBg: 'bg-gradient-to-r from-purple-400 via-fuchsia-300 to-pink-400',
      marqueeText: 'text-slate-950',
      bezelBorder: 'border-purple-400',
      joystickColor: 'bg-pink-500',
      buttonColors: ['bg-purple-400', 'bg-pink-400', 'bg-indigo-400', 'bg-slate-600'],
      accentGlow: 'rgba(168,85,247,0.5)',
    },
  },
  {
    id: 'slot-04',
    number: '04',
    title: 'COMING SOON',
    subtitle: 'Next Activity in Production',
    grade: 'Grade 6',
    category: 'Arcade Arena',
    status: 'planned',
    image: '/images/math-vault-card.jpg',
    route: '#',
    description: 'The next exciting 3D mathematics club activity is currently under development.',
    tags: ['Upcoming', 'Mathematics', 'Classroom Duel'],
    theme: {
      cabinetColor: 'bg-gradient-to-b from-[#064e3b] via-[#022c22] to-[#01140e]',
      marqueeBg: 'bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500',
      marqueeText: 'text-slate-950',
      bezelBorder: 'border-emerald-400',
      joystickColor: 'bg-emerald-400',
      buttonColors: ['bg-emerald-400', 'bg-teal-400', 'bg-yellow-400', 'bg-slate-600'],
      accentGlow: 'rgba(168,85,247,0.5)',
    },
  },
];

export const ArcadeHubDashboard: React.FC = () => {
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
    { id: 'all', label: 'ALL CABINETS' },
    { id: 'Heist & Escape', label: 'HEIST & ESCAPE' },
    { id: 'Adventure & Strategy', label: 'ADVENTURE & STRATEGY' },
    { id: 'Puzzle & Logic', label: 'PUZZLE & LOGIC' },
    { id: 'Arcade Arena', label: 'ARCADE ARENA' },
  ];

  const filteredGames = ARCADE_GAMES.filter((g) => {
    return selectedCategory === 'all' || g.category === selectedCategory;
  });

  return (
    <main className="relative w-screen h-screen overflow-x-hidden overflow-y-auto bg-[#fef3c7] select-none text-slate-800 flex flex-col justify-between">
      
      {/* 3D Realistic Light Sunlit Arcade Hall with Honey Wood Floor */}
      <ArcadeLobbyScene />

      {/* TOP HEADER NAVIGATION BAR (Bright light theme) */}
      <header className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between border-b-2 border-amber-400/50 bg-white/90 backdrop-blur-md shadow-md rounded-b-2xl">
        
        {/* Logo & Branding */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 p-0.5 shadow-md flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Gamepad2 className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black font-bank uppercase tracking-wider text-slate-950">
                SKILLIZEE <span className="text-amber-600">ARCADE</span>
              </h1>
              <span className="px-2 py-0.5 rounded-md bg-amber-100 border border-amber-400 text-amber-900 text-[10px] font-black font-game uppercase tracking-widest shadow-sm">
                ACTIVITY HUB
              </span>
            </div>
            <p className="text-xs text-slate-600 font-game tracking-wider hidden sm:block">
              Interactive Classroom Learning Cabinets & Head-to-Head Duels
            </p>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              soundManager.playClick();
              setShowAddModal(true);
            }}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs font-game uppercase tracking-wider shadow-md hover:brightness-105 transition cursor-pointer border border-amber-600"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>CREATE CABINET</span>
          </button>

          <button
            onClick={toggleSound}
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            className="p-2.5 rounded-xl bg-white hover:bg-slate-50 border-2 border-slate-300 text-slate-800 transition shadow cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-rose-500" /> : <Volume2 className="w-5 h-5 text-amber-600" />}
          </button>

          <button
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
            className="p-2.5 rounded-xl bg-white hover:bg-slate-50 border-2 border-slate-300 text-slate-800 transition shadow cursor-pointer"
          >
            {isFullscreen ? <Minimize className="w-5 h-5 text-purple-600" /> : <Maximize className="w-5 h-5 text-purple-600" />}
          </button>
        </div>

      </header>

      {/* HERO SECTION */}
      <section className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-8 pt-4 pb-2 flex flex-col items-center text-center">
        
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/95 border-2 border-amber-400 text-amber-900 text-xs font-black font-game tracking-widest uppercase mb-2 shadow">
          <Flame className="w-4 h-4 text-amber-600 animate-pulse" />
          <span>GRADE 6 CLUB ACTIVITIES • ARCADE CABINET ARENA</span>
        </div>

        <h2 className="text-4xl sm:text-5xl md:text-6xl font-black font-bank uppercase tracking-tight text-slate-950 drop-shadow-sm">
          SELECT YOUR <span className="text-amber-600">ARCADE MACHINE</span>
        </h2>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-3.5 max-w-4xl w-full">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                soundManager.playClick();
                setSelectedCategory(cat.id);
              }}
              className={`px-4 py-1.5 rounded-xl text-xs font-black font-game uppercase tracking-wider border-2 transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 border-slate-950 text-slate-950 shadow-md scale-105'
                  : 'bg-white/90 border-slate-300 text-slate-700 hover:border-amber-400 hover:text-slate-950'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* ARCADE CABINETS ROW OVER LIGHT WOOD FLOOR */}
      <section className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-8 py-4 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 w-full items-end">
          {filteredGames.map((game) => (
            <ArcadeMachineCard key={game.id} game={game} />
          ))}
        </div>
      </section>

      {/* FOOTER STATS BAR */}
      <footer className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between border-t-2 border-amber-400/50 bg-white/90 backdrop-blur-md rounded-t-2xl text-xs font-game tracking-wider text-slate-700 shadow-lg">
        <div className="flex items-center gap-4">
          <span>⚡ LIVE CABINETS: <strong>#01 MATH VAULT</strong> & <strong>#02 NUMBER FORGE</strong></span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">CURRICULUM: <strong>GRADE 6 NCERT & CAMBRIDGE</strong></span>
        </div>
        <div>
          <span className="font-bold text-amber-800">SKILLIZEE INTERACTIVE ARCADE PLATFORM</span>
        </div>
      </footer>

      {/* CREATE NEW CABINET MODAL */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4"
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
                Cabinet #01 (<strong>Math Escape Vault</strong>) and Cabinet #02 (<strong>Number Forge</strong>) are live. Remaining slots display <code className="text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-300">COMING SOON</code>!
              </p>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col gap-2 text-xs font-mono text-slate-700">
                <div className="flex justify-between">
                  <span>Cabinet #01:</span>
                  <span className="text-blue-700 font-bold">Math Escape Vault (/math-vault)</span>
                </div>
                <div className="flex justify-between">
                  <span>Cabinet #02:</span>
                  <span className="text-amber-800 font-bold">Number Forge (/number-forge)</span>
                </div>
                <div className="flex justify-between">
                  <span>Cabinet #03:</span>
                  <span className="text-slate-500 font-semibold">Coming Soon</span>
                </div>
                <div className="flex justify-between">
                  <span>Cabinet #04:</span>
                  <span className="text-slate-500 font-semibold">Coming Soon</span>
                </div>
              </div>

              <button
                onClick={() => {
                  soundManager.playClick();
                  setShowAddModal(false);
                }}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black font-game uppercase tracking-wider shadow cursor-pointer hover:brightness-105 border border-amber-600"
              >
                GOT IT • BACK TO ARCADE LOBBY
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
};
