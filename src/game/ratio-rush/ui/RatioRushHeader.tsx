// ============================================================
// RATIO RUSH — HEADER & STUDIO PRODUCTION CONTROLS (LIGHT THEME)
// Clean, bright top control bar with camera presets, production triggers,
// timer, audio controls, and arcade navigation
// ============================================================

import React from 'react';
import {
  Clapperboard,
  Camera,
  Film,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Eye,
  Video,
  Shirt,
  RotateCcw,
  ArrowLeft,
} from 'lucide-react';
import { useRatioStore } from '../store/ratioStore';
import { StudioCameraView } from '../types';
import { useRouter } from 'next/navigation';

export const RatioRushHeader: React.FC = () => {
  const router = useRouter();
  const activeCameraView = useRatioStore((s) => s.activeCameraView);
  const setActiveCameraView = useRatioStore((s) => s.setActiveCameraView);
  const timeRemaining = useRatioStore((s) => s.timeRemaining);
  const isMuted = useRatioStore((s) => s.isMuted);
  const isFullscreen = useRatioStore((s) => s.isFullscreen);
  const toggleMute = useRatioStore((s) => s.toggleMute);
  const toggleFullscreen = useRatioStore((s) => s.toggleFullscreen);
  const triggerFlash = useRatioStore((s) => s.triggerFlash);
  const triggerClapper = useRatioStore((s) => s.triggerClapper);
  const resetGame = useRatioStore((s) => s.resetGame);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const cameraButtons: { id: StudioCameraView; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Front Director View', icon: <Eye className="w-3.5 h-3.5" /> },
    { id: 'camera1', label: 'Cinema Cam 1', icon: <Camera className="w-3.5 h-3.5" /> },
    { id: 'director', label: 'Director Village', icon: <Video className="w-3.5 h-3.5" /> },
    { id: 'wardrobe', label: 'Props & Wardrobe', icon: <Shirt className="w-3.5 h-3.5" /> },
    { id: 'premiere', label: 'Cinema Premiere', icon: <Film className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="relative z-20 w-full px-3 py-2 bg-white/95 backdrop-blur-md border-b-2 border-amber-400 text-slate-800 shadow-md flex flex-wrap items-center justify-between gap-2 select-none">
      {/* ── Left: Hub Return & Activity Branding ── */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => router.push('/')}
          className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-900 text-xs font-black flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          title="Return to Arcade Lobby"
        >
          <ArrowLeft className="w-4 h-4 text-amber-600 stroke-[3]" />
          <span className="hidden sm:inline">LOBBY</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-yellow-400 p-0.5 shadow-md flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
              <Clapperboard className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 leading-none">
              <h1 className="text-xs sm:text-sm font-black tracking-wider text-slate-950 uppercase font-bank">
                RATIO RUSH
              </h1>
              <span className="px-1.5 py-0.5 rounded bg-amber-100 border border-amber-400 text-amber-900 text-[9px] font-black uppercase">
                MACHINE #13
              </span>
            </div>
            <p className="text-[9px] text-slate-500 font-medium hidden md:block mt-0.5">
              Movie Production House • Ratios, Rates & Proportions
            </p>
          </div>
        </div>
      </div>

      {/* ── Center: Cinematic Camera Presets (Front View Default) ── */}
      <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200 shadow-inner">
        {cameraButtons.map((btn) => (
          <button
            key={btn.id}
            onClick={() => setActiveCameraView(btn.id)}
            className={`px-2.5 py-1 rounded-lg text-[10.5px] font-black uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer ${
              activeCameraView === btn.id
                ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm'
                : 'text-slate-600 hover:text-slate-950 hover:bg-white'
            }`}
          >
            {btn.icon}
            <span className="hidden lg:inline">{btn.label}</span>
          </button>
        ))}
      </div>

      {/* ── Right: Studio Action Triggers & System Tools ── */}
      <div className="flex items-center gap-1.5">
        {/* Take Photo Flash Trigger */}
        <button
          onClick={triggerFlash}
          className="px-2.5 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 border border-sky-300 text-sky-900 text-[10px] font-black uppercase flex items-center gap-1 shadow-sm transition-all cursor-pointer"
          title="Take Behind-The-Scenes Set Photo"
        >
          <Camera className="w-3.5 h-3.5 text-sky-600 stroke-[2.5]" />
          <span className="hidden sm:inline">PHOTO</span>
        </button>

        {/* Snap Clapper Trigger */}
        <button
          onClick={triggerClapper}
          className="px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 border border-red-300 text-red-900 text-[10px] font-black uppercase flex items-center gap-1 shadow-sm transition-all cursor-pointer"
          title="Snap Clapperboard Take"
        >
          <Clapperboard className="w-3.5 h-3.5 text-red-600 stroke-[2.5]" />
          <span className="hidden sm:inline">TAKE</span>
        </button>

        {/* Countdown Timer */}
        <div className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-300 text-amber-950 text-xs font-mono font-black shadow-inner">
          ⏱️ {formatTime(timeRemaining)}
        </div>

        {/* Audio Mute Toggle */}
        <button
          onClick={toggleMute}
          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 shadow-sm cursor-pointer"
          title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
        </button>

        {/* Reset Game */}
        <button
          onClick={resetGame}
          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 shadow-sm cursor-pointer"
          title="Reset Production Shoot"
        >
          <RotateCcw className="w-4 h-4 text-amber-600" />
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 shadow-sm cursor-pointer"
          title="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
