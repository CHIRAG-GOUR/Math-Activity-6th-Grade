'use client';

// ============================================================
// SKILLIZEE ARCADE — 3D Interactive Retro Arcade Lobby Dashboard
// Seamless Three.js 3D Arcade Arena with:
// - Physical 3D Cabinets in rich custom activity themes & colors
// - Multi-Wing Support (Wing 1: 01-04, Wing 2: 05-08, Wing 3: 09-12, Wing 4: 13)
// - Top Quick Wing Switchers + All 13 Games Catalog Modal
// - Central Question Bank & Management System for Teachers
// - Pre-Game Question Setup Modal (5 / 10 / 15 questions with Teacher Priority)
// - Floating Left & Right Navigation Arrows with Machine Counters
// - Direct 3D Click-to-Play interaction
// - Clean unified bottom dock bar with wing switchers & audio controls
// ============================================================

import React, { useState, useEffect, useCallback } from 'react';
import {
  Gamepad2,
  Maximize,
  Minimize,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { ArcadeLobbyScene, ARCADE_CABINET_DATA, MACHINES_PER_PAGE } from './ArcadeLobbyScene';
import { AllGamesCatalogModal } from './AllGamesCatalogModal';
import { QuestionBankModal } from './question-bank/QuestionBankModal';
import { GameQuestionSetupModal } from './question-bank/GameQuestionSetupModal';
import { soundManager } from '@/utils/audio';
import { useRouter } from 'next/navigation';
import { GameSessionSetup } from '@/types/questionBank';

export const ArcadeHubDashboard: React.FC = () => {
  const router = useRouter();
  const [activePage, setActivePage] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(soundManager.getMuted());
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  // Question Management & Activity Setup Modals
  const [isQuestionBankOpen, setIsQuestionBankOpen] = useState<boolean>(false);
  const [setupActivityId, setSetupActivityId] = useState<string | null>(null);

  const totalPages = Math.ceil(ARCADE_CABINET_DATA.length / MACHINES_PER_PAGE);

  const wingLabels = [
    { name: 'WING 1', range: '#01 - #04', desc: 'Vault • Railway • Carnival • Blueprint' },
    { name: 'WING 2', range: '#05 - #08', desc: 'Equations • Patterns • Decimals • Solar' },
    { name: 'WING 3', range: '#09 - #12', desc: 'Chocolate • Graphworks • Harvest • Park' },
    { name: 'WING 4', range: '#13', desc: 'Ratio Rush (Film Studio)' },
  ];

  const goToNextPage = useCallback(() => {
    soundManager.playClick();
    setActivePage((prev) => {
      const next = Math.min(prev + 1, totalPages - 1);
      setSelectedCategory('all');
      return next;
    });
  }, [totalPages]);

  const goToPrevPage = useCallback(() => {
    soundManager.playClick();
    setActivePage((prev) => {
      const prevPage = Math.max(prev - 1, 0);
      setSelectedCategory('all');
      return prevPage;
    });
  }, []);

  // Keyboard Navigation: Left/Right arrow keys & Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isCatalogOpen || isQuestionBankOpen || setupActivityId) {
        if (e.key === 'Escape') {
          setIsCatalogOpen(false);
          setIsQuestionBankOpen(false);
          setSetupActivityId(null);
        }
        return;
      }
      if (e.key === 'ArrowRight') {
        goToNextPage();
      } else if (e.key === 'ArrowLeft') {
        goToPrevPage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNextPage, goToPrevPage, isCatalogOpen, isQuestionBankOpen, setupActivityId]);

  // Fullscreen Listener
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

  const handleSelectCabinetIn3D = (cabId: string, wingIndex: number) => {
    setActivePage(wingIndex);
    const cab = ARCADE_CABINET_DATA.find((c) => c.id === cabId);
    if (cab) {
      setSelectedCategory(`#${cab.number}`);
    }
  };

  const handleOpenGameSetup = (activityId: string) => {
    soundManager.playClick();
    setSetupActivityId(activityId);
  };

  const handleLaunchGameFromSetup = (sessionSetup: GameSessionSetup) => {
    const cab = ARCADE_CABINET_DATA.find((c) => c.id === sessionSetup.activityId);
    const targetRoute = cab ? cab.route : `/${sessionSetup.activityId}`;
    soundManager.playArcadeGameStart();
    setTimeout(() => {
      router.push(targetRoute);
    }, 200);
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#fffbeb] select-none text-slate-800 flex flex-col justify-between">
      
      {/* ── 3D RETRO ARCADE ARENA WITH MULTI-WING SUPPORT ── */}
      <ArcadeLobbyScene
        activePage={activePage}
        selectedCategory={selectedCategory}
        onSelectCabinet={(id) => {
          const target = ARCADE_CABINET_DATA.find((c) => c.id === id);
          if (target && target.status === 'active' && target.route !== '#') {
            handleOpenGameSetup(target.id);
          } else {
            soundManager.playClick();
          }
        }}
      />

      {/* ── TOP FLOATING ARCADE STATUS & ALL-GAMES LAUNCHER BAR ── */}
      <header className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-3 flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
        
        {/* Left: Brand Badge & Total Games Counter */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white/95 border-2 border-slate-950 shadow-[3px_3px_0px_0px_#0f172a] backdrop-blur-md">
            <div className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black">
              <Gamepad2 className="w-4 h-4" />
            </div>
            <span className="text-xs font-black font-bank uppercase tracking-wider text-slate-950">
              SKILLIZEE <span className="text-amber-600">ARCADE</span>
            </span>
            <span className="px-1.5 py-0.5 rounded-md bg-amber-100 border border-amber-400 text-amber-950 text-[9px] font-black font-game uppercase">
              13 ACTIVE DUELS
            </span>
          </div>
        </div>

        {/* Center: Wing Switcher Quick Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/90 border-2 border-slate-950 shadow-[3px_3px_0px_0px_#0f172a] backdrop-blur-md">
          {wingLabels.map((wing, idx) => {
            const isActive = activePage === idx;
            return (
              <button
                key={wing.name}
                onClick={() => {
                  soundManager.playClick();
                  setActivePage(idx);
                  setSelectedCategory('all');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black font-game uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-slate-950 text-amber-400 shadow-sm scale-[1.02]'
                    : 'text-slate-700 hover:bg-amber-100 hover:text-slate-950'
                }`}
                title={`${wing.name} (${wing.range}): ${wing.desc}`}
              >
                <span>{wing.name}</span>
                <span
                  className={`text-[9.5px] px-1.5 py-0.5 rounded-md font-bold ${
                    isActive ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {wing.range}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right: QUESTION BANK & ALL 13 GAMES GRID BUTTONS */}
        <div className="flex items-center gap-2">
          {/* Question Bank Launcher */}
          <button
            onClick={() => {
              soundManager.playClick();
              setIsQuestionBankOpen(true);
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white hover:bg-slate-50 border-2 border-slate-950 text-slate-950 shadow-[3px_3px_0px_0px_#0f172a] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_#0f172a] transition-all cursor-pointer font-black font-game text-xs uppercase tracking-wider group"
            title="Open Central Question Manager (Teacher Questions, Excel Import)"
          >
            <BookOpen className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
            <span>QUESTION BANK</span>
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          </button>

          {/* All 13 Games Catalog */}
          <button
            onClick={() => {
              soundManager.playClick();
              setIsCatalogOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-400 hover:bg-amber-300 border-2 border-slate-950 text-slate-950 shadow-[3px_3px_0px_0px_#0f172a] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_#0f172a] transition-all cursor-pointer font-black font-game text-xs uppercase tracking-wider group"
            title="Open Complete 13-Game Visual Grid Catalog"
          >
            <LayoutGrid className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>ALL 13 GAMES</span>
            <span className="px-1.5 py-0.5 rounded-md bg-slate-950 text-amber-300 text-[10px]">
              13
            </span>
          </button>
        </div>

      </header>

      {/* ── FLOATING LEFT NAVIGATION ARROW (PREVIOUS WING) ── */}
      {activePage > 0 && (
        <button
          onClick={goToPrevPage}
          className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 group flex items-center gap-2.5 p-2 sm:p-3 rounded-2xl bg-white/95 hover:bg-white backdrop-blur-md border-3 border-slate-950 text-slate-900 shadow-[5px_5px_0px_0px_#0f172a] transition-all duration-200 transform hover:scale-105 hover:-translate-x-1 cursor-pointer"
          title={`Go to ${wingLabels[activePage - 1].name} (${wingLabels[activePage - 1].range})`}
        >
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center border-2 border-slate-950 shadow-sm group-hover:bg-amber-300 transition-colors">
            <ChevronLeft className="w-6 h-6 stroke-[3]" />
          </div>
          <div className="text-left hidden md:block pr-2">
            <div className="text-[9px] font-black font-game text-amber-800 uppercase tracking-widest leading-none">
              PREVIOUS WING
            </div>
            <div className="text-xs font-black font-bank uppercase tracking-wider text-slate-950 leading-tight mt-0.5">
              {wingLabels[activePage - 1].name}{' '}
              <span className="text-[10px] text-slate-600 font-game">
                ({wingLabels[activePage - 1].range})
              </span>
            </div>
          </div>
        </button>
      )}

      {/* ── FLOATING RIGHT NAVIGATION ARROW (NEXT WING) ── */}
      {activePage < totalPages - 1 && (
        <button
          onClick={goToNextPage}
          className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 group flex items-center gap-2.5 p-2 sm:p-3 rounded-2xl bg-white/95 hover:bg-white backdrop-blur-md border-3 border-slate-950 text-slate-900 shadow-[5px_5px_0px_0px_#0f172a] transition-all duration-200 transform hover:scale-105 hover:translate-x-1 cursor-pointer"
          title={`Go to ${wingLabels[activePage + 1].name} (${wingLabels[activePage + 1].range})`}
        >
          <div className="text-right hidden md:block pl-2">
            <div className="text-[9px] font-black font-game text-amber-800 uppercase tracking-widest leading-none">
              NEXT WING
            </div>
            <div className="text-xs font-black font-bank uppercase tracking-wider text-slate-950 leading-tight mt-0.5">
              {wingLabels[activePage + 1].name}{' '}
              <span className="text-[10px] text-slate-600 font-game">
                ({wingLabels[activePage + 1].range})
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center border-2 border-slate-950 shadow-sm group-hover:bg-amber-300 transition-colors">
            <ChevronRight className="w-6 h-6 stroke-[3]" />
          </div>
        </button>
      )}

      {/* ── TOP OPEN VIEWPORT SPACER ── */}
      <div className="flex-1 pointer-events-none" />

      {/* ── UNIFIED BOTTOM NAVIGATION DOCK ── */}
      <footer className="relative z-30 w-full max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 border-t-3 border-slate-950 bg-white/95 backdrop-blur-md rounded-t-3xl text-xs font-game tracking-wider text-slate-700 shadow-[0_-8px_25px_rgba(0,0,0,0.12)] pointer-events-auto mb-1">
        
        {/* Left: Quick Launchers */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              soundManager.playClick();
              setIsCatalogOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 text-amber-400 hover:bg-slate-800 border-2 border-slate-950 font-black text-xs uppercase tracking-wider transition cursor-pointer shadow-sm"
          >
            <LayoutGrid className="w-4 h-4" />
            <span>GRID</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setIsQuestionBankOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 hover:bg-amber-300 border-2 border-slate-950 font-black text-xs uppercase tracking-wider transition cursor-pointer shadow-sm"
            title="Central Question Bank"
          >
            <BookOpen className="w-4 h-4" />
            <span>QUESTIONS</span>
          </button>
        </div>

        {/* Center: All Arcade Games with Full Titles & Proper Math Topics */}
        <div className="flex-1 flex items-center gap-1.5 bg-amber-50/90 p-1.5 rounded-2xl border-2 border-slate-950 shadow-inner overflow-x-auto scrollbar-thin min-w-0">
          
          {/* Wing Selector Tabs */}
          <div className="flex items-center gap-1 border-r-2 border-amber-300 pr-2 mr-1 shrink-0">
            {wingLabels.map((wing, pIdx) => (
              <button
                key={`dock-wing-${pIdx}`}
                onClick={() => {
                  soundManager.playClick();
                  setActivePage(pIdx);
                  setSelectedCategory('all');
                }}
                className={`px-2 py-1 rounded-lg text-[10px] font-black font-game uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                  activePage === pIdx
                    ? 'bg-slate-950 text-amber-400 shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-white hover:text-slate-950 border border-slate-200'
                }`}
              >
                {wing.name}
              </button>
            ))}
          </div>

          {/* ALL Overview Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              setSelectedCategory('all');
            }}
            className={`px-2.5 py-1.5 rounded-xl text-[10px] font-black font-game uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1 ${
              selectedCategory === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold border-2 border-slate-950'
                : 'bg-white text-slate-700 hover:bg-white hover:text-slate-950 border border-slate-300'
            }`}
          >
            <span>🎮</span> ALL
          </button>

          {/* ALL 13 Arcade Games with Proper Names & Math Topics */}
          {ARCADE_CABINET_DATA.map((cab, idx) => {
            const isSelected = selectedCategory === `#${cab.number}`;
            const targetWing = Math.floor(idx / MACHINES_PER_PAGE);

            return (
              <button
                key={cab.id}
                onClick={() => {
                  if (isSelected && cab.status === 'active' && cab.route !== '#') {
                    handleOpenGameSetup(cab.id);
                  } else {
                    soundManager.playClick();
                    setActivePage(targetWing);
                    setSelectedCategory(`#${cab.number}`);
                  }
                }}
                title={cab.status === 'active' ? `Setup & Play ${cab.title} (${cab.topic})` : `${cab.title} (Coming Soon)`}
                className={`px-2.5 py-1.5 rounded-xl text-[10.5px] font-black font-game transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 border-2 ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-slate-950 border-slate-950 shadow-[2px_2px_0px_0px_#0f172a] scale-[1.02]'
                    : 'bg-white text-slate-800 border-slate-300 hover:bg-white hover:border-slate-950 hover:text-slate-950'
                }`}
              >
                {/* Cabinet Number Badge */}
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[9px] font-black ${
                    isSelected
                      ? 'bg-slate-950 text-amber-300'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  #{cab.number}
                </span>

                {/* Game Full Name */}
                <span className="font-extrabold uppercase tracking-tight">
                  {cab.title}
                </span>

                {/* Proper Math Topic Pill */}
                <span
                  className={`px-2 py-0.5 rounded-full text-[8.5px] font-bold uppercase tracking-wider ${
                    isSelected
                      ? 'bg-slate-900/15 text-slate-950 border border-slate-900/20'
                      : 'bg-amber-100 text-amber-950 border border-amber-300'
                  }`}
                >
                  {cab.topic}
                </span>

                {/* Active Play Indicator */}
                {cab.status === 'active' && isSelected && (
                  <span className="text-[8.5px] font-black text-emerald-950 bg-emerald-300 px-1.5 py-0.5 rounded-md ml-0.5 animate-pulse">
                    SETUP & PLAY →
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right: Sound & Fullscreen Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            className="p-2 rounded-xl bg-white hover:bg-slate-50 border-2 border-slate-950 text-slate-800 transition shadow-[2px_2px_0px_0px_#0f172a] cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-amber-600" />}
          </button>

          <button
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
            className="p-2 rounded-xl bg-white hover:bg-slate-50 border-2 border-slate-950 text-slate-800 transition shadow-[2px_2px_0px_0px_#0f172a] cursor-pointer"
          >
            {isFullscreen ? <Minimize className="w-4 h-4 text-purple-600" /> : <Maximize className="w-4 h-4 text-purple-600" />}
          </button>
        </div>

      </footer>

      {/* ── ALL 13 GAMES CATALOG MODAL ── */}
      <AllGamesCatalogModal
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
        cabinets={ARCADE_CABINET_DATA}
        onSelectCabinetIn3D={handleSelectCabinetIn3D}
        onOpenSetup={handleOpenGameSetup}
        onOpenQuestionBank={() => setIsQuestionBankOpen(true)}
      />

      {/* ── CENTRAL QUESTION BANK MODAL ── */}
      <QuestionBankModal
        isOpen={isQuestionBankOpen}
        onClose={() => setIsQuestionBankOpen(false)}
        onStartActivitySetup={(actId) => {
          setIsQuestionBankOpen(false);
          setSetupActivityId(actId);
        }}
      />

      {/* ── PRE-GAME QUESTION SETUP MODAL (5 / 10 / 15 QS WITH TEACHER PRIORITY) ── */}
      {setupActivityId && (
        <GameQuestionSetupModal
          isOpen={Boolean(setupActivityId)}
          activityId={setupActivityId}
          onClose={() => setSetupActivityId(null)}
          onLaunchGame={handleLaunchGameFromSetup}
          onOpenQuestionManager={() => {
            setSetupActivityId(null);
            setIsQuestionBankOpen(true);
          }}
        />
      )}

    </main>
  );
};
