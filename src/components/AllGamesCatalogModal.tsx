'use client';

// ============================================================
// SKILLIZEE ARCADE — ALL 13 GAMES CATALOG MODAL
// Full Interactive Grid View displaying all 13 Grade 6 Mathematics
// 3D Arcade Machines with artwork, topics, and 1-click duel launch.
// ============================================================

import React, { useState, useMemo } from 'react';
import {
  Gamepad2,
  Search,
  X,
  Play,
  Eye,
  Sparkles,
  Trophy,
  Users,
  Compass,
  ArrowRight,
  Filter,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { soundManager } from '@/utils/audio';
import { ArcadeCabinetConfig } from './ArcadeCabinet3D';

interface AllGamesCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  cabinets: ArcadeCabinetConfig[];
  onSelectCabinetIn3D: (id: string, wingIndex: number) => void;
  onOpenSetup?: (activityId: string) => void;
  onOpenQuestionBank?: () => void;
}

type TopicCategory =
  | 'all'
  | 'numbers'
  | 'fractions_ratios'
  | 'algebra_patterns'
  | 'geometry_coords'
  | 'data_probability';

export const AllGamesCatalogModal: React.FC<AllGamesCatalogModalProps> = ({
  isOpen,
  onClose,
  cabinets,
  onSelectCabinetIn3D,
  onOpenSetup,
  onOpenQuestionBank,
}) => {

  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TopicCategory>('all');

  const categories: { id: TopicCategory; label: string; icon: string }[] = [
    { id: 'all', label: 'All 13 Games', icon: '🎮' },
    { id: 'numbers', label: 'Numbers & Decimals', icon: '🔢' },
    { id: 'fractions_ratios', label: 'Fractions & Ratios', icon: '➗' },
    { id: 'algebra_patterns', label: 'Algebra & Patterns', icon: '⚡' },
    { id: 'geometry_coords', label: 'Geometry & Coordinates', icon: '📐' },
    { id: 'data_probability', label: 'Data & Probability', icon: '🎲' },
  ];

  const filteredCabinets = useMemo(() => {
    return cabinets.filter((cab) => {
      // 1. Search filter
      const matchesSearch =
        searchQuery.trim() === '' ||
        cab.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cab.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cab.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cab.number.includes(searchQuery);

      // 2. Category filter
      let matchesCategory = true;
      if (selectedCategory === 'numbers') {
        matchesCategory =
          cab.id === 'math-escape-vault' ||
          cab.id === 'number-railway' ||
          cab.id === 'decimal-delivery';
      } else if (selectedCategory === 'fractions_ratios') {
        matchesCategory =
          cab.id === 'chocolate-factory' ||
          cab.id === 'percentage-harvest' ||
          cab.id === 'ratio-rush';
      } else if (selectedCategory === 'algebra_patterns') {
        matchesCategory =
          cab.id === 'equation-mission-control' || cab.id === 'pattern-racers';
      } else if (selectedCategory === 'geometry_coords') {
        matchesCategory =
          cab.id === 'blueprint-blitz' ||
          cab.id === 'solar-forge' ||
          cab.id === 'park-planner';
      } else if (selectedCategory === 'data_probability') {
        matchesCategory =
          cab.id === 'carnival-of-chance' || cab.id === 'graphworks';
      }

      return matchesSearch && matchesCategory;
    });
  }, [cabinets, searchQuery, selectedCategory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      {/* ── MAIN MODAL CONTAINER (NEO-BRUTALIST STYLING) ── */}
      <div className="relative w-full max-w-6xl max-h-[92vh] bg-[#fffbeb] border-4 border-slate-950 rounded-3xl shadow-[10px_10px_0px_0px_#0f172a] flex flex-col overflow-hidden text-slate-900">
        
        {/* ── TOP HEADER ── */}
        <div className="flex items-center justify-between px-5 sm:px-8 py-4 bg-amber-400 border-b-4 border-slate-950 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-slate-950 text-amber-400 flex items-center justify-center border-2 border-slate-900 shadow-md">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black font-bank uppercase tracking-wider text-slate-950">
                  ALL 13 ARCADE GAMES
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-950 text-amber-300 text-[10px] font-black font-game uppercase tracking-widest">
                  GRADE 6 CURRICULUM
                </span>
              </div>
              <p className="text-xs font-bold text-slate-800 font-game mt-0.5">
                Head-to-head 2-player multiplayer duels covering every Grade 6 math topic
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {onOpenQuestionBank && (
              <button
                onClick={() => {
                  soundManager.playClick();
                  onClose();
                  onOpenQuestionBank();
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-amber-300 border-2 border-slate-950 text-xs font-black font-game uppercase tracking-wider flex items-center gap-1.5 transition shadow-sm"
              >
                <span>📚</span> QUESTION BANK
              </button>
            )}

            <button
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="w-10 h-10 rounded-2xl bg-white hover:bg-rose-500 hover:text-white border-2 border-slate-950 text-slate-950 flex items-center justify-center transition shadow-md cursor-pointer group"
              title="Close Catalog"
            >
              <X className="w-6 h-6 stroke-[3] group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>


        {/* ── FILTER & SEARCH TOOLBAR ── */}
        <div className="px-5 sm:px-8 py-3.5 bg-amber-100/80 border-b-2 border-amber-300 flex flex-wrap items-center justify-between gap-3 shrink-0">
          
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedCategory(cat.id);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black font-game uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 border-2 ${
                    isSelected
                      ? 'bg-slate-950 text-amber-400 border-slate-950 shadow-[2px_2px_0px_0px_#0f172a]'
                      : 'bg-white text-slate-700 border-slate-300 hover:border-slate-950 hover:text-slate-950'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Search Input */}
          <div className="relative min-w-[220px] sm:min-w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topic or game..."
              className="w-full pl-9 pr-8 py-1.5 rounded-xl bg-white border-2 border-slate-950 text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs font-black"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* ── SCROLLABLE 13-GAME GRID ── */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 bg-[#fffbeb] scrollbar-thin">
          {filteredCabinets.length === 0 ? (
            <div className="py-16 text-center">
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="text-lg font-black font-game uppercase text-slate-800">
                No matching arcade games found
              </h3>
              <p className="text-xs text-slate-500 font-game mt-1">
                Try clearing your search or picking another category filter.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {filteredCabinets.map((cab) => {
                const cabIndex = cabinets.findIndex((c) => c.id === cab.id);
                const wingNum = Math.floor(cabIndex / 4) + 1;

                return (
                  <div
                    key={cab.id}
                    className="group relative bg-white rounded-2xl border-3 border-slate-950 shadow-[4px_4px_0px_0px_#0f172a] hover:shadow-[6px_6px_0px_0px_#0f172a] hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between overflow-hidden"
                  >
                    {/* Top Artwork Image with Badge Overlay */}
                    <div className="relative w-full h-36 bg-slate-900 overflow-hidden border-b-2 border-slate-950">
                      {cab.image ? (
                        <Image
                          src={cab.image}
                          alt={cab.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-500 to-yellow-600 text-white font-black font-game text-xl">
                          {cab.title}
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                      {/* Machine Number Badge */}
                      <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-lg bg-slate-950/90 border border-amber-400 text-amber-300 text-[10px] font-black font-game uppercase tracking-wider shadow-md">
                        #{cab.number} • WING {wingNum}
                      </div>

                      {/* 2-Player Duel Tag */}
                      <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-amber-500 text-slate-950 text-[9px] font-black font-game uppercase tracking-widest shadow-md flex items-center gap-1">
                        <Users className="w-3 h-3" /> 2P DUEL
                      </div>

                      {/* Title over Artwork */}
                      <div className="absolute bottom-2 left-2.5 right-2.5 text-white">
                        <h4 className="text-sm font-black font-bank uppercase tracking-wider text-amber-300 drop-shadow-md leading-tight line-clamp-1">
                          {cab.title}
                        </h4>
                      </div>
                    </div>

                    {/* Card Body Details */}
                    <div className="p-3.5 flex-1 flex flex-col justify-between gap-3">
                      <div>
                        {/* Math Topic Pill */}
                        <div className="inline-block px-2 py-0.5 rounded-md bg-amber-100 border border-amber-300 text-amber-900 text-[9.5px] font-black font-game uppercase tracking-wider mb-1.5">
                          📐 {cab.topic}
                        </div>

                        {/* Subtitle / Description */}
                        <p className="text-[11px] font-medium text-slate-600 font-game leading-relaxed line-clamp-2">
                          {cab.subtitle}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                        {/* 1. View in 3D Hall */}
                        <button
                          onClick={() => {
                            soundManager.playClick();
                            onSelectCabinetIn3D(cab.id, wingNum - 1);
                            onClose();
                          }}
                          className="px-2 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-950 text-slate-900 text-[10px] font-black font-game uppercase tracking-wider flex items-center justify-center gap-1 transition cursor-pointer shadow-xs"
                          title="View 3D arcade cabinet in lobby"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-700" />
                          <span>3D VIEW</span>
                        </button>

                        {/* 2. Play Game */}
                        <button
                          onClick={() => {
                            soundManager.playArcadeGameStart();
                            onClose();
                            if (onOpenSetup) {
                              onOpenSetup(cab.id);
                            } else {
                              setTimeout(() => router.push(cab.route), 200);
                            }
                          }}
                          className="px-2 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 border-2 border-slate-950 text-slate-950 text-[10px] font-black font-game uppercase tracking-wider flex items-center justify-center gap-1 transition cursor-pointer shadow-[2px_2px_0px_0px_#0f172a] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
                          title="Setup & start 2-player match"
                        >
                          <Play className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
                          <span>PLAY →</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>


        {/* ── BOTTOM STATUS BAR ── */}
        <div className="px-5 sm:px-8 py-3 bg-white border-t-4 border-slate-950 flex flex-wrap items-center justify-between gap-3 text-xs font-game shrink-0">
          <div className="flex items-center gap-2 font-bold text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span>
              Showing <strong>{filteredCabinets.length}</strong> of <strong>{cabinets.length}</strong> Grade 6 arcade activities
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-500">
              Arcade Wing 1: #01-#04 • Wing 2: #05-#08 • Wing 3: #09-#12 • Wing 4: #13
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
