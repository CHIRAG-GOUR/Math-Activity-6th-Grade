'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gamepad2,
  Sparkles,
  Play,
  Layers,
  GraduationCap,
  Users,
  Timer,
  ShieldCheck,
  Plus,
  Maximize,
  Minimize,
  Volume2,
  VolumeX,
  Search,
  SlidersHorizontal,
  ExternalLink,
  Flame,
  Key,
  Lock,
} from 'lucide-react';
import { ArcadeLobbyScene } from './ArcadeLobbyScene';
import { soundManager } from '@/utils/audio';

interface ActivityItem {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  grade: string;
  category: string;
  status: 'active' | 'in-development' | 'planned';
  image: string;
  route: string;
  description: string;
  tags: string[];
  features: string[];
  players: string;
}

const ACTIVITIES_LIST: ActivityItem[] = [
  {
    id: 'math-escape-vault',
    number: '01',
    title: 'MATH ESCAPE VAULT',
    subtitle: 'Grade 6 Bloom’s Taxonomy Mental Math Heist',
    grade: 'Grade 6',
    category: 'Heist & Escape',
    status: 'active',
    image: '/images/math-vault-card.jpg',
    route: '/math-vault',
    description: 'Fast 2-team head-to-head keypad battle. Solve 5 progressive codes to crack the bank vault into the GTA V Treasury!',
    tags: ['BODMAS', 'Integers', 'Fractions', 'Percentages', 'Equations', 'Ratios'],
    features: [
      'Dual live keypad answering consoles with strike lockout',
      '3D circular bank vault safe door with progressive unlock',
      'Sudden-Death Super Question tie-breaker',
      'GTA V style gold & cash rolling cages celebration',
    ],
    players: '2 Teams (Head-to-Head)',
  },
  {
    id: 'number-forge',
    number: '02',
    title: 'NUMBER FORGE',
    subtitle: 'BUILD IT. UNDERSTAND IT. ROUND IT. PROVE IT.',
    grade: 'Grade 6',
    category: 'Workshop & Logic',
    status: 'active',
    image: '/images/number-forge-card.jpg',
    route: '/number-forge',
    description: 'Interactive 3D mathematical workshop. Construct place values, operate rounding tracks, spot misconceptions, and calibrate master blueprints!',
    tags: ['Place Value', 'Rounding', 'Expanded Form', 'Decomposition', 'Master Blueprints'],
    features: [
      '3D Inventor Workshop Canvas with gears & sunlight',
      'Place Value Tower & physical number blocks',
      'Calibrated Rounding Track with benchmark pegs',
      'Master Blueprint multi-constraint engine',
    ],
    players: '2 Teams (Inventors vs Crafters)',
  },
  {
    id: 'slot-03',
    number: '03',
    title: 'COMING SOON',
    subtitle: 'Next Club Activity in Production',
    grade: 'Grade 6',
    category: 'Puzzle & Logic',
    status: 'planned',
    image: '/images/math-vault-card.jpg',
    route: '#',
    description: 'The next exciting 3D mathematics club activity is currently under development.',
    tags: ['Upcoming', 'Mathematics', 'Classroom Duel'],
    features: ['In Production', 'Interactive 3D Environment'],
    players: '2 Teams',
  },
  {
    id: 'slot-04',
    number: '04',
    title: 'COMING SOON',
    subtitle: 'Next Club Activity in Production',
    grade: 'Grade 6',
    category: 'Arcade Arena',
    status: 'planned',
    image: '/images/math-vault-card.jpg',
    route: '#',
    description: 'The next exciting 3D mathematics club activity is currently under development.',
    tags: ['Upcoming', 'Mathematics', 'Classroom Duel'],
    features: ['In Production', 'Interactive 3D Environment'],
    players: '2 Teams',
  },
];

export const ArcadeHubDashboard: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(soundManager.getMuted());
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  useEffect(() => {
    // Start background ambient music
    soundManager.startBgm(0.35);

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
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
    { id: 'all', label: 'ALL ACTIVITIES' },
    { id: 'Heist & Escape', label: 'HEIST & ESCAPE' },
    { id: 'Workshop & Logic', label: 'WORKSHOP & LOGIC' },
    { id: 'Puzzle & Logic', label: 'PUZZLE & LOGIC' },
    { id: 'Arcade Arena', label: 'ARCADE ARENA' },
  ];

  const filteredActivities = ACTIVITIES_LIST.filter((act) => {
    const matchesCat = selectedCategory === 'all' || act.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <main className="relative w-screen h-screen overflow-x-hidden overflow-y-auto bg-[#132235] select-none text-slate-100 flex flex-col justify-between">
      
      {/* 3D Realistic Arcade Hall Background with Wood Floor */}
      <ArcadeLobbyScene />

      {/* TOP HEADER NAVIGATION BAR */}
      <header className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between border-b border-amber-300/20 bg-slate-900/60 backdrop-blur-md shadow-lg rounded-b-2xl">
        
        {/* Logo & Branding */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 p-0.5 shadow-[0_0_20px_rgba(255,215,0,0.6)] flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Gamepad2 className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black font-bank uppercase tracking-wider text-white drop-shadow">
                SKILLIZEE <span className="text-amber-400">ARCADE</span>
              </h1>
              <span className="px-2 py-0.5 rounded-md bg-blue-500/30 border border-cyan-400 text-cyan-300 text-[10px] font-black font-game uppercase tracking-widest">
                ACTIVITY HUB
              </span>
            </div>
            <p className="text-xs text-slate-400 font-game tracking-wider hidden sm:block">
              Interactive Club Learning Stations & Head-to-Head Duels
            </p>
          </div>
        </div>

        {/* Global Controls & Add Activity Button */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              soundManager.playClick();
              setShowAddModal(true);
            }}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-xs font-game uppercase tracking-wider shadow-[0_0_15px_rgba(255,215,0,0.4)] hover:brightness-110 transition cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>CREATE ACTIVITY</span>
          </button>

          <button
            onClick={toggleSound}
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-slate-600 text-slate-200 transition shadow cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5 text-amber-400" />}
          </button>

          <button
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-slate-600 text-slate-200 transition shadow cursor-pointer"
          >
            {isFullscreen ? <Minimize className="w-5 h-5 text-purple-400" /> : <Maximize className="w-5 h-5 text-purple-400" />}
          </button>
        </div>

      </header>

      {/* HERO BANNER SECTION */}
      <section className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-8 pt-4 pb-2 flex flex-col items-center text-center">
        
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-400/10 border border-amber-400/40 text-amber-300 text-xs font-black font-game tracking-widest uppercase mb-2 shadow">
          <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>GRADE 6 CLUB ACTIVITIES • LIVE CLASSROOM ARENA</span>
        </div>

        <h2 className="text-4xl sm:text-5xl md:text-6xl font-black font-bank uppercase tracking-tight text-white drop-shadow-[0_8px_25px_rgba(0,0,0,0.8)]">
          SELECT AN <span className="text-amber-400">ARCADE ACTIVITY</span>
        </h2>

        {/* Filter Categories & Search Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4 max-w-4xl w-full">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                soundManager.playClick();
                setSelectedCategory(cat.id);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black font-game uppercase tracking-wider border-2 transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 border-white text-white shadow-[0_0_20px_rgba(0,200,255,0.6)] scale-105'
                  : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* MAIN ACTIVITIES CAROUSEL / GRID OVER WOOD FLOOR */}
      <section className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-8 py-4 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {filteredActivities.map((act) => {
            const isActive = act.status === 'active';

            return (
              <motion.div
                key={act.id}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className={`relative rounded-3xl border-3 flex flex-col justify-between overflow-hidden shadow-2xl backdrop-blur-xl transition-all ${
                  isActive
                    ? 'bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-[#0f1d30] border-amber-400 ring-2 ring-amber-400/40 shadow-[0_20px_40px_rgba(0,0,0,0.8),0_0_30px_rgba(255,215,0,0.25)]'
                    : 'bg-slate-950/75 border-slate-700/80 opacity-80'
                }`}
              >
                {/* Top Glowing Header Badge */}
                <div className="relative p-4 pb-2 flex items-center justify-between z-10">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 font-black font-bank text-sm flex items-center justify-center shadow-md">
                      {act.number}
                    </span>
                    <span className="text-xs font-black uppercase tracking-wider font-game text-amber-300">
                      {act.category}
                    </span>
                  </div>

                  {isActive ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-[10px] font-black font-game uppercase tracking-widest flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      LIVE READY
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-600 text-slate-400 text-[10px] font-black font-game uppercase tracking-widest">
                      {act.status === 'in-development' ? 'IN DEV' : 'PLANNED'}
                    </span>
                  )}
                </div>

                {/* Activity Image Banner */}
                <div className="relative w-full h-44 px-3 py-1">
                  <div className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-slate-700/80 shadow-inner group">
                    <Image
                      src={act.image}
                      alt={act.title}
                      fill
                      className={`object-cover object-center transition-transform duration-500 ${
                        isActive ? 'group-hover:scale-105' : 'grayscale opacity-60'
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                    
                    {/* Players & Grade floating pills */}
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] font-black font-game uppercase text-white">
                      <span className="px-2 py-0.5 rounded-md bg-slate-900/90 border border-slate-600">
                        {act.grade}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-blue-600/90 border border-cyan-400">
                        {act.players}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-4 pt-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-black font-bank uppercase text-white tracking-wide">
                      {act.title}
                    </h3>
                    <p className="text-xs font-semibold text-slate-300 line-clamp-2 mt-1 leading-relaxed">
                      {act.description}
                    </p>

                    {/* Topic Tags */}
                    <div className="flex flex-wrap gap-1 mt-3">
                      {act.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-white/5 border border-slate-700 text-slate-300 text-[10px] font-black font-game uppercase"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Launch Action Button */}
                  <div className="mt-4 pt-3 border-t border-slate-800">
                    {isActive ? (
                      <Link
                        href={act.route}
                        onClick={() => soundManager.playClick()}
                        className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 border-2 border-white text-slate-950 font-black text-sm font-game uppercase tracking-wider shadow-[0_0_20px_rgba(255,215,0,0.5)] flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                      >
                        <span>ENTER ACTIVITY #{act.number}</span>
                        <Play className="w-4 h-4 fill-slate-950" />
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="w-full py-2.5 rounded-2xl bg-slate-800/80 border border-slate-700 text-slate-500 font-black text-xs font-game uppercase tracking-widest flex items-center justify-center gap-1.5 cursor-not-allowed"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>SLOT #{act.number} • COMING NEXT</span>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* FOOTER QUICK STATS */}
      <footer className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between border-t border-amber-300/20 bg-slate-900/60 backdrop-blur-md rounded-t-2xl text-xs font-game tracking-wider text-slate-400">
        <div className="flex items-center gap-4">
          <span>⚡ ACTIVITY #01 LIVE: <strong>MATH ESCAPE VAULT</strong></span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">CURRICULUM: <strong>GRADE 6 MENTAL MATH</strong></span>
        </div>
        <div>
          <span>SKILLIZEE INTERACTIVE LEARNING PLATFORM</span>
        </div>
      </footer>

      {/* CREATE NEW ACTIVITY MODAL */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-md bg-slate-900 border-3 border-amber-400 rounded-3xl p-6 shadow-2xl text-white select-none flex flex-col gap-4"
            >
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-amber-400" />
                  <h3 className="text-xl font-black font-bank uppercase text-white">
                    ADD NEXT ACTIVITY
                  </h3>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-white font-bold p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-game">
                Activity #1 (<strong>Math Escape Vault</strong>) is live at <code className="text-cyan-300">/math-vault</code>. You can now build Activity #2, #3, or #4 with customized 3D environments, rules, and topics!
              </p>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col gap-2 text-xs font-mono text-slate-400">
                <div className="flex justify-between">
                  <span>Slot #01:</span>
                  <span className="text-emerald-400">Math Escape Vault (/math-vault)</span>
                </div>
                <div className="flex justify-between">
                  <span>Slot #02:</span>
                  <span className="text-amber-400">Fraction Factory Blitz (/fraction-factory)</span>
                </div>
                <div className="flex justify-between">
                  <span>Slot #03:</span>
                  <span className="text-cyan-400">Algebra Cypher Dungeon (/algebra-dungeon)</span>
                </div>
              </div>

              <button
                onClick={() => {
                  soundManager.playClick();
                  setShowAddModal(false);
                }}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black font-game uppercase tracking-wider shadow cursor-pointer hover:brightness-110"
              >
                GOT IT • READY TO BUILD NEXT ACTIVITY
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
};
