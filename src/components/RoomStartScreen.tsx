'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Volume2,
  VolumeX,
  Users,
  Plus,
  Minus,
  X,
  Divide,
  Calculator,
  Dices,
  Shield,
  Clock,
  GraduationCap,
  CheckSquare,
  Square,
  Check,
  Maximize,
  Minimize,
  Cpu,
  Terminal,
} from 'lucide-react';
import { DifficultyLevel, GameLength, GameSettings, MathTopic } from '@/types/game';
import { soundManager } from '@/utils/audio';

interface RoomStartScreenProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onStartGame: () => void;
}

export const RoomStartScreen: React.FC<RoomStartScreenProps> = ({
  settings,
  onUpdateSettings,
  onStartGame,
}) => {
  const [isMuted, setIsMuted] = useState(soundManager.getMuted());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showTeamNamingModal, setShowTeamNamingModal] = useState<boolean>(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const topicsList: { id: MathTopic; label: string; icon: React.ElementType }[] = [
    { id: 'mixed', label: 'Bloom’s Mixed Challenge', icon: Dices },
    { id: 'multiplication', label: 'Integers & Multiplication', icon: X },
    { id: 'division', label: 'Ratios, HCF & Division', icon: Divide },
    { id: 'addition', label: 'BODMAS & Number Patterns', icon: Plus },
    { id: 'subtraction', label: 'Angles & Geometry Analysis', icon: Minus },
  ];

  const currentSelectedTopics = settings.topics && settings.topics.length > 0 ? settings.topics : [settings.topic || 'mixed'];

  const toggleTopic = (tId: MathTopic) => {
    soundManager.playClick();
    let updated: MathTopic[];
    if (currentSelectedTopics.includes(tId)) {
      if (currentSelectedTopics.length === 1) return; // Keep at least one
      updated = currentSelectedTopics.filter((id) => id !== tId);
    } else {
      updated = [...currentSelectedTopics, tId];
    }
    onUpdateSettings({
      ...settings,
      topic: updated[0] || 'mixed',
      topics: updated,
    });
  };

  const handleSelectAll = () => {
    soundManager.playClick();
    const all = topicsList.map((t) => t.id);
    onUpdateSettings({
      ...settings,
      topic: 'mixed',
      topics: all,
    });
  };

  const difficulties: { id: DifficultyLevel; label: string }[] = [
    { id: 'easy', label: 'STANDARD' },
    { id: 'medium', label: 'ADVANCED' },
    { id: 'hard', label: 'EXPERT' },
  ];
  const lengths: GameLength[] = [5, 10, 20];

  const handleEnterClick = () => {
    soundManager.playClick();
    setShowTeamNamingModal(true);
  };

  const handleDoneLaunch = () => {
    soundManager.playClick();
    setShowTeamNamingModal(false);
    onStartGame();
  };

  const toggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  const toggleFullscreen = () => {
    soundManager.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-4 sm:p-6 md:p-8 z-30 select-none max-w-5xl mx-auto overflow-y-auto">
      
      {/* Top Header Bar with Fullscreen & Sound */}
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 border-2 border-slate-300 shadow-sm">
          <GraduationCap className="w-4 h-4 text-blue-700" />
          <span className="text-xs font-black tracking-widest text-slate-800 font-game uppercase">
            GRADE 6 MATHEMATICS • BLOOM’S TAXONOMY HEIST
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/95 border border-slate-300 text-slate-800 hover:text-slate-950 font-black text-xs font-game shadow-sm transition cursor-pointer hover:bg-slate-50"
          >
            {isFullscreen ? <Minimize className="w-4 h-4 text-purple-600" /> : <Maximize className="w-4 h-4 text-purple-600" />}
            <span className="hidden sm:inline">{isFullscreen ? 'EXIT FULL' : 'FULLSCREEN'}</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title="Toggle Sound"
            className="p-2 rounded-xl bg-white/95 border border-slate-300 text-slate-700 hover:text-slate-900 shadow-sm transition cursor-pointer hover:bg-slate-50"
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-rose-500" /> : <Volume2 className="w-5 h-5 text-blue-600" />}
          </button>
        </div>
      </div>

      {/* Main Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center text-center mt-1"
      >
        <h1 className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tight font-bank uppercase white-text-black-border">
          MATH VAULT
        </h1>
        <p className="text-sm sm:text-base md:text-lg font-black tracking-widest text-white font-game uppercase mt-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          CRACK 5 CODES MENTALLY TO CLAIM THE TREASURE
        </p>
      </motion.div>

      {/* 3 Setup Panels (Zero Scrollbars) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full my-3">
        
        {/* 1. GRADE 6 CURRICULUM LEVEL FOCUS */}
        <div className="bg-white/95 border-2 border-blue-200 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-slate-800 font-game flex items-center gap-1.5 mb-3">
              <GraduationCap className="w-4 h-4 text-blue-600" /> TARGET CURRICULUM
            </span>
            <div className="flex items-center justify-between p-3 bg-blue-50 border-2 border-blue-300 rounded-xl mb-2">
              <span className="text-2xl font-black font-bank text-blue-950">GRADE 6</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-600 text-white font-game">
                ACTIVE
              </span>
            </div>
            <p className="text-xs font-bold text-slate-600 leading-relaxed">
              100% Mental Math: Fast calculations for integers, BODMAS, ratios, percentages, and geometry without pen & paper.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-black text-blue-800 font-game mt-3 pt-2 border-t border-slate-100">
            <Cpu className="w-3.5 h-3.5 text-blue-600" />
            <span>1000+ DYNAMIC QUESTIONS (ZERO REPEATS)</span>
          </div>
        </div>

        {/* 2. MULTI-SELECT BLOOM'S TOPICS (NO SCROLLBAR) */}
        <div className="bg-white/95 border-2 border-blue-200 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black uppercase tracking-widest text-slate-800 font-game flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-blue-600" /> BLOOM'S TOPICS
              </span>
              <button
                onClick={handleSelectAll}
                className="text-[10px] font-black text-blue-700 hover:text-blue-900 font-game uppercase px-2 py-0.5 rounded bg-blue-100/80 cursor-pointer"
              >
                SELECT ALL
              </button>
            </div>

            {/* Clean Topic Button Stack with NO SCROLLBAR */}
            <div className="flex flex-col gap-1.5">
              {topicsList.map((t) => {
                const Icon = t.icon;
                const isSelected = currentSelectedTopics.includes(t.id);
                return (
                  <button
                    key={t.id}
                    onClick={() => toggleTopic(t.id)}
                    className={`py-2 px-3 rounded-xl text-xs font-black font-game border-2 flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5" />
                      <span className="truncate">{t.label}</span>
                    </div>
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 shrink-0 text-white" />
                    ) : (
                      <Square className="w-4 h-4 shrink-0 text-slate-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3. SECURITY LEVEL & HEIST LENGTH */}
        <div className="bg-white/95 border-2 border-blue-200 p-5 rounded-2xl shadow-sm flex flex-col justify-between gap-3">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-slate-800 font-game flex items-center gap-1.5 mb-2">
              <Shield className="w-4 h-4 text-blue-600" /> SECURITY LEVEL
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {difficulties.map((d) => (
                <button
                  key={d.id}
                  onClick={() => {
                    soundManager.playClick();
                    onUpdateSettings({ ...settings, difficulty: d.id });
                  }}
                  className={`py-2 px-1 rounded-xl text-xs font-black font-game border-2 transition-all cursor-pointer ${
                    settings.difficulty === d.id
                      ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-xs font-black uppercase tracking-widest text-slate-800 font-game flex items-center gap-1.5 mb-2">
              <Clock className="w-4 h-4 text-blue-600" /> HEIST ROUNDS
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {lengths.map((l) => (
                <button
                  key={l}
                  onClick={() => {
                    soundManager.playClick();
                    onUpdateSettings({ ...settings, totalRounds: l });
                  }}
                  className={`py-2 px-1 rounded-xl text-xs font-black font-game border-2 transition-all cursor-pointer ${
                    settings.totalRounds === l
                      ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {l} RDS
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* ENTER 3D ROOM MAIN BUTTON */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.94 }}
        onClick={handleEnterClick}
        className="px-16 sm:px-24 py-4 sm:py-5 rounded-3xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 border-4 border-white text-white font-black text-2xl sm:text-3xl md:text-4xl tracking-wider uppercase font-game shadow-[0_12px_35px_rgba(0,136,255,0.5)] flex items-center gap-4 cursor-pointer mb-2"
      >
        <Terminal className="w-8 h-8 text-cyan-200" />
        <span>ENTER 3D ROOM</span>
        <Play className="w-8 h-8 fill-white" />
      </motion.button>

      {/* TEAM NAMING MODAL (Opens when clicking ENTER 3D ROOM) */}
      <AnimatePresence>
        {showTeamNamingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.85, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 30 }}
              className="w-full max-w-lg bg-white rounded-3xl border-4 border-blue-400 p-6 sm:p-8 shadow-2xl flex flex-col gap-5 select-none"
            >
              <div className="flex items-center justify-between border-b-2 border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <Users className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl font-black font-bank uppercase text-slate-900">
                    NAME YOUR HEIST TEAMS
                  </h2>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {/* Left Team */}
                <div>
                  <label className="text-xs font-black text-blue-700 uppercase font-game block mb-1">
                    LEFT TEAM CALLSIGN
                  </label>
                  <input
                    type="text"
                    value={settings.teamBlueName}
                    onChange={(e) => onUpdateSettings({ ...settings, teamBlueName: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-blue-50 border-2 border-blue-400 text-blue-950 text-base font-black font-game focus:outline-none focus:ring-3 focus:ring-blue-500 shadow-inner"
                    placeholder="e.g. TEAM 1"
                  />
                </div>

                {/* Right Team */}
                <div>
                  <label className="text-xs font-black text-rose-700 uppercase font-game block mb-1">
                    RIGHT TEAM CALLSIGN
                  </label>
                  <input
                    type="text"
                    value={settings.teamRedName}
                    onChange={(e) => onUpdateSettings({ ...settings, teamRedName: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-rose-50 border-2 border-rose-400 text-rose-950 text-base font-black font-game focus:outline-none focus:ring-3 focus:ring-rose-500 shadow-inner"
                    placeholder="e.g. TEAM 2"
                  />
                </div>
              </div>

              {/* Quick Presets */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <button
                  onClick={() => onUpdateSettings({ ...settings, teamBlueName: 'TEAM 1', teamRedName: 'TEAM 2' })}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold font-game cursor-pointer"
                >
                  TEAM 1 & 2
                </button>
                <button
                  onClick={() => onUpdateSettings({ ...settings, teamBlueName: 'BLUE CYPHERS', teamRedName: 'RED HACKERS' })}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold font-game cursor-pointer"
                >
                  CYPHERS & HACKERS
                </button>
                <button
                  onClick={() => onUpdateSettings({ ...settings, teamBlueName: 'MATH WIZARDS', teamRedName: 'CODE BREAKERS' })}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold font-game cursor-pointer"
                >
                  WIZARDS & BREAKERS
                </button>
              </div>

              {/* DONE - LAUNCH BUTTON */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleDoneLaunch}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 border-2 border-white text-white font-black text-xl tracking-wider uppercase font-game shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <Check className="w-6 h-6 stroke-[3]" />
                <span>DONE — START ACTIVITY</span>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
