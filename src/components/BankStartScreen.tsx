'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Play, Volume2, VolumeX, Landmark, Users } from 'lucide-react';
import { OrnateKey } from './OrnateKey';
import { DifficultyLevel, GameLength, GameSettings, GradeLevel, MathTopic } from '@/types/game';
import { soundManager } from '@/utils/audio';

interface BankStartScreenProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onStartGame: () => void;
}

export const BankStartScreen: React.FC<BankStartScreenProps> = ({
  settings,
  onUpdateSettings,
  onStartGame,
}) => {
  const [isMuted, setIsMuted] = useState(soundManager.getMuted());

  const grades: GradeLevel[] = ['1-2', '3-4', '5-6', '7-8', '9-10'];
  const topics: { id: MathTopic; label: string; icon: string }[] = [
    { id: 'addition', label: 'Addition', icon: '➕' },
    { id: 'subtraction', label: 'Subtraction', icon: '➖' },
    { id: 'multiplication', label: 'Multiplication', icon: '✖️' },
    { id: 'division', label: 'Division', icon: '➗' },
    { id: 'fractions', label: 'Fractions', icon: '½' },
    { id: 'decimals', label: 'Decimals', icon: '0.5' },
    { id: 'mixed', label: 'Mixed Operations', icon: '🎲' },
  ];
  const difficulties: { id: DifficultyLevel; label: string }[] = [
    { id: 'easy', label: 'STANDARD' },
    { id: 'medium', label: 'ADVANCED' },
    { id: 'hard', label: 'EXPERT' },
  ];
  const lengths: GameLength[] = [5, 10, 20];

  const handleStart = () => {
    soundManager.playClick();
    onStartGame();
  };

  const toggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-6 sm:p-8 z-30 select-none max-w-6xl mx-auto overflow-y-auto">
      {/* Top Header Bar */}
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border-2 border-amber-300 shadow-sm">
          <Landmark className="w-4 h-4 text-amber-700" />
          <span className="text-xs font-black tracking-widest text-amber-900 font-game uppercase">
            CLASSROOM BANK VAULT HEIST
          </span>
        </div>

        <button
          onClick={toggleSound}
          className="p-2.5 rounded-xl bg-white/90 border border-amber-300 text-slate-700 hover:text-slate-900 shadow-sm transition cursor-pointer"
        >
          {isMuted ? <VolumeX className="w-5 h-5 text-rose-500" /> : <Volume2 className="w-5 h-5 text-blue-600" />}
        </button>
      </div>

      {/* Main Bank Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center text-center mt-2"
      >
        <div className="relative flex items-center justify-center">
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight bank-gold-text font-bank uppercase">
            MATH VAULT
          </h1>
        </div>

        <div className="flex items-center gap-3 mt-1">
          <div className="w-12 sm:w-20 h-0.5 bg-gradient-to-r from-transparent to-amber-600" />
          <p className="text-sm sm:text-base md:text-xl font-black tracking-widest text-amber-950 font-game uppercase">
            CRACK THE BANK CODE • MASTER THE MATH
          </p>
          <div className="w-12 sm:w-20 h-0.5 bg-gradient-to-l from-transparent to-amber-600" />
        </div>
      </motion.div>

      {/* 4 Setup Consoles in Warm Ivory/Gold */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full my-4">
        
        {/* 1. GRADE */}
        <div className="bg-white/90 border-2 border-amber-300 p-4 rounded-2xl shadow-sm flex flex-col gap-2.5">
          <span className="text-xs font-black uppercase tracking-widest text-amber-900 font-game flex items-center gap-1.5">
            <span>🎯</span> TARGET GRADE
          </span>
          <div className="grid grid-cols-5 gap-1.5">
            {grades.map((g) => (
              <button
                key={g}
                onClick={() => {
                  soundManager.playClick();
                  onUpdateSettings({ ...settings, grade: g });
                }}
                className={`py-2 px-1 rounded-xl text-xs font-black font-game border-2 transition-all cursor-pointer ${
                  settings.grade === g
                    ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                    : 'bg-amber-50/70 border-amber-200 text-slate-700 hover:bg-amber-100'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* 2. MATH TOPIC */}
        <div className="bg-white/90 border-2 border-amber-300 p-4 rounded-2xl shadow-sm flex flex-col gap-2.5">
          <span className="text-xs font-black uppercase tracking-widest text-amber-900 font-game flex items-center gap-1.5">
            <span>📚</span> MATH TOPIC
          </span>
          <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
            {topics.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  soundManager.playClick();
                  onUpdateSettings({ ...settings, topic: t.id });
                }}
                className={`py-1.5 px-2 rounded-xl text-[11px] font-black font-game border-2 flex items-center gap-1.5 transition-all cursor-pointer ${
                  settings.topic === t.id
                    ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                    : 'bg-amber-50/70 border-amber-200 text-slate-700 hover:bg-amber-100'
                }`}
              >
                <span>{t.icon}</span>
                <span className="truncate">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 3. DIFFICULTY & ROUNDS */}
        <div className="bg-white/90 border-2 border-amber-300 p-4 rounded-2xl shadow-sm flex flex-col gap-3">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-amber-900 font-game flex items-center gap-1.5 mb-1.5">
              <span>⚡</span> SECURITY LEVEL
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {difficulties.map((d) => (
                <button
                  key={d.id}
                  onClick={() => {
                    soundManager.playClick();
                    onUpdateSettings({ ...settings, difficulty: d.id });
                  }}
                  className={`py-1.5 px-1 rounded-xl text-xs font-black font-game border-2 transition-all cursor-pointer ${
                    settings.difficulty === d.id
                      ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                      : 'bg-amber-50/70 border-amber-200 text-slate-700 hover:bg-amber-100'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-xs font-black uppercase tracking-widest text-amber-900 font-game flex items-center gap-1.5 mb-1.5">
              <span>⏱️</span> HEIST ROUNDS
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {lengths.map((l) => (
                <button
                  key={l}
                  onClick={() => {
                    soundManager.playClick();
                    onUpdateSettings({ ...settings, totalRounds: l });
                  }}
                  className={`py-1.5 px-1 rounded-xl text-xs font-black font-game border-2 transition-all cursor-pointer ${
                    settings.totalRounds === l
                      ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                      : 'bg-amber-50/70 border-amber-200 text-slate-700 hover:bg-amber-100'
                  }`}
                >
                  {l} RDS
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4. TEAM CALLSIGNS */}
        <div className="bg-white/90 border-2 border-amber-300 p-4 rounded-2xl shadow-sm flex flex-col gap-2.5">
          <span className="text-xs font-black uppercase tracking-widest text-amber-900 font-game flex items-center gap-1.5">
            <Users className="w-4 h-4" /> TEAM CALLSIGNS
          </span>
          <div className="flex flex-col gap-2">
            <div>
              <label className="text-[10px] font-black text-blue-700 uppercase font-game">LEFT TEAM (BLUE)</label>
              <input
                type="text"
                value={settings.teamBlueName}
                onChange={(e) => onUpdateSettings({ ...settings, teamBlueName: e.target.value })}
                className="w-full px-3 py-1.5 rounded-xl bg-blue-50 border-2 border-blue-400 text-blue-900 text-xs font-black font-game focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-rose-700 uppercase font-game">RIGHT TEAM (RED)</label>
              <input
                type="text"
                value={settings.teamRedName}
                onChange={(e) => onUpdateSettings({ ...settings, teamRedName: e.target.value })}
                className="w-full px-3 py-1.5 rounded-xl bg-rose-50 border-2 border-rose-400 text-rose-900 text-xs font-black font-game focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-inner"
              />
            </div>
          </div>
        </div>

      </div>

      {/* START HEIST MASSIVE BUTTON */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.94 }}
        onClick={handleStart}
        className="relative group px-16 sm:px-24 py-4 sm:py-5 rounded-3xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 border-4 border-white text-white font-black text-2xl sm:text-3xl md:text-4xl tracking-wider uppercase font-game shadow-[0_12px_35px_rgba(217,164,65,0.6),inset_0_2px_4px_rgba(255,255,255,0.8)] flex items-center gap-4 cursor-pointer mb-2"
      >
        <OrnateKey size={34} color="gold" glow={false} />
        <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">START HEIST</span>
        <Play className="w-8 h-8 fill-white" />
      </motion.button>
    </div>
  );
};
