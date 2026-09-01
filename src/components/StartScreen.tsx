'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Play, Key, Volume2, VolumeX, Shield, Swords } from 'lucide-react';
import { DifficultyLevel, GameLength, GameSettings, GradeLevel, MathTopic } from '@/types/game';
import { soundManager } from '@/utils/audio';

interface StartScreenProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onStartGame: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
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
    { id: 'easy', label: 'EASY' },
    { id: 'medium', label: 'MEDIUM' },
    { id: 'hard', label: 'HARD' },
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
    <div className="relative w-full h-full flex flex-col items-center justify-between p-4 sm:p-6 lg:p-8 z-30 select-none max-w-7xl mx-auto overflow-y-auto">
      {/* Top Bar with Badge & Audio Toggle */}
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950/80 border border-amber-400/60 shadow-[0_0_15px_rgba(255,215,0,0.3)]">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span className="text-xs font-black tracking-widest text-amber-200 font-game uppercase">
            TOUCHSCREEN MATH SHOWDOWN
          </span>
        </div>

        <button
          onClick={toggleSound}
          className="tactile-btn p-2.5 rounded-2xl bg-slate-950/80 border border-slate-700 text-slate-300 hover:text-white transition shadow-lg"
        >
          {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5 text-cyan-400" />}
        </button>
      </div>

      {/* Main Game Show Title */}
      <motion.div
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center text-center mt-1"
      >
        <div className="relative flex items-center justify-center">
          <div className="absolute w-56 h-56 rounded-full bg-amber-500/25 blur-3xl pointer-events-none" />
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight gold-gradient-text font-display uppercase drop-shadow-[0_12px_35px_rgba(0,0,0,1)]">
            MATH VAULT
          </h1>
        </div>

        <div className="flex items-center gap-3 mt-1">
          <div className="w-8 sm:w-16 h-0.5 bg-gradient-to-r from-transparent to-amber-400" />
          <p className="text-sm sm:text-base md:text-xl font-black tracking-widest text-amber-200 font-game uppercase">
            CRACK THE VAULT • MASTER THE MATH
          </p>
          <div className="w-8 sm:w-16 h-0.5 bg-gradient-to-l from-transparent to-amber-400" />
        </div>
      </motion.div>

      {/* 4 Physical Game Setup Consoles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full my-4">
        
        {/* 1. GRADE SELECTOR */}
        <div className="hud-panel-center p-4 rounded-3xl flex flex-col gap-2.5">
          <span className="text-xs font-black uppercase tracking-widest text-amber-300 font-game flex items-center gap-1.5">
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
                className={`tactile-btn py-2 px-1 rounded-xl text-xs font-black font-game border-2 transition-all ${
                  settings.grade === g
                    ? 'bg-gradient-to-b from-amber-400 to-yellow-600 text-slate-950 border-white shadow-[0_0_15px_rgba(255,215,0,0.8)]'
                    : 'bg-slate-950/90 border-slate-700/80 text-slate-300 hover:border-slate-500'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* 2. MATH TOPIC */}
        <div className="hud-panel-center p-4 rounded-3xl flex flex-col gap-2.5">
          <span className="text-xs font-black uppercase tracking-widest text-amber-300 font-game flex items-center gap-1.5">
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
                className={`tactile-btn py-2 px-2 rounded-xl text-[11px] font-black font-game border-2 flex items-center gap-1.5 transition-all ${
                  settings.topic === t.id
                    ? 'bg-gradient-to-b from-amber-400 to-yellow-600 text-slate-950 border-white shadow-[0_0_15px_rgba(255,215,0,0.8)]'
                    : 'bg-slate-950/90 border-slate-700/80 text-slate-300 hover:border-slate-500'
                }`}
              >
                <span>{t.icon}</span>
                <span className="truncate">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 3. DIFFICULTY & ROUNDS */}
        <div className="hud-panel-center p-4 rounded-3xl flex flex-col gap-3">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-amber-300 font-game flex items-center gap-1.5 mb-1.5">
              <span>⚡</span> DIFFICULTY
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {difficulties.map((d) => (
                <button
                  key={d.id}
                  onClick={() => {
                    soundManager.playClick();
                    onUpdateSettings({ ...settings, difficulty: d.id });
                  }}
                  className={`tactile-btn py-1.5 px-1 rounded-xl text-xs font-black font-game border-2 transition-all ${
                    settings.difficulty === d.id
                      ? 'bg-gradient-to-b from-amber-400 to-yellow-600 text-slate-950 border-white shadow-[0_0_15px_rgba(255,215,0,0.8)]'
                      : 'bg-slate-950/90 border-slate-700/80 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-xs font-black uppercase tracking-widest text-amber-300 font-game flex items-center gap-1.5 mb-1.5">
              <span>⏱️</span> GAME ROUNDS
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {lengths.map((l) => (
                <button
                  key={l}
                  onClick={() => {
                    soundManager.playClick();
                    onUpdateSettings({ ...settings, totalRounds: l });
                  }}
                  className={`tactile-btn py-1.5 px-1 rounded-xl text-xs font-black font-game border-2 transition-all ${
                    settings.totalRounds === l
                      ? 'bg-gradient-to-b from-amber-400 to-yellow-600 text-slate-950 border-white shadow-[0_0_15px_rgba(255,215,0,0.8)]'
                      : 'bg-slate-950/90 border-slate-700/80 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  {l} RDS
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4. TEAM IDENTITIES */}
        <div className="hud-panel-center p-4 rounded-3xl flex flex-col gap-2.5">
          <span className="text-xs font-black uppercase tracking-widest text-amber-300 font-game flex items-center gap-1.5">
            <Swords className="w-4 h-4" /> TEAM CALLSIGNS
          </span>
          <div className="flex flex-col gap-2">
            <div>
              <label className="text-[10px] font-black text-cyan-300 uppercase font-game">LEFT SIDE (BLUE)</label>
              <input
                type="text"
                value={settings.teamBlueName}
                onChange={(e) => onUpdateSettings({ ...settings, teamBlueName: e.target.value })}
                className="w-full px-3 py-1.5 rounded-xl bg-cyan-950/70 border-2 border-cyan-500/60 text-cyan-100 text-xs font-black font-game focus:outline-none focus:ring-2 focus:ring-cyan-300 shadow-inner"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-rose-300 uppercase font-game">RIGHT SIDE (RED)</label>
              <input
                type="text"
                value={settings.teamRedName}
                onChange={(e) => onUpdateSettings({ ...settings, teamRedName: e.target.value })}
                className="w-full px-3 py-1.5 rounded-xl bg-rose-950/70 border-2 border-rose-500/60 text-rose-100 text-xs font-black font-game focus:outline-none focus:ring-2 focus:ring-rose-300 shadow-inner"
              />
            </div>
          </div>
        </div>

      </div>

      {/* START HEIST MASSIVE PULSING BUTTON */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.94 }}
        onClick={handleStart}
        className="tactile-btn gold-shine-effect relative group px-14 sm:px-24 py-4 sm:py-5 rounded-3xl bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-600 border-4 border-yellow-100 text-slate-950 font-black text-2xl sm:text-3xl md:text-4xl tracking-wider uppercase font-game shadow-[0_0_60px_rgba(255,215,0,0.9),0_10px_30px_rgba(0,0,0,0.9),inset_0_2px_10px_rgba(255,255,255,0.9)] flex items-center gap-4 cursor-pointer mb-2 overflow-hidden"
      >
        <Key className="w-9 h-9 stroke-[3] group-hover:rotate-45 transition-transform" />
        <span>START HEIST</span>
        <Play className="w-8 h-8 fill-slate-950" />
      </motion.button>
    </div>
  );
};
