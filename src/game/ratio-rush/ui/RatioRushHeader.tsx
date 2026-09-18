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
  const currentMovieStage = useRatioStore((s) => s.currentMovieStage);
  const blueScenesWon = useRatioStore((s) => s.blueScenesWon);
  const redScenesWon = useRatioStore((s) => s.redScenesWon);
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
    <header className="relative z-20 w-full px-3 py-2 bg-white border-b-4 border-black text-black shadow-[0_4px_0px_#000000] flex flex-wrap items-center justify-between gap-2 select-none">
      {/* ── Left: Hub Return & Activity Branding ── */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => router.push('/')}
          className="px-3 py-1.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 border-3 border-black text-black text-xs font-black flex items-center gap-1.5 shadow-[2px_2px_0px_#000000] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
          title="Return to Arcade Lobby"
        >
          <ArrowLeft className="w-4 h-4 stroke-[3]" />
          <span className="hidden sm:inline">LOBBY</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-yellow-400 border-2 border-black shadow-[2px_2px_0px_#000000] flex items-center justify-center">
            <Clapperboard className="w-4 h-4 text-black stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 leading-none">
              <h1 className="text-xs sm:text-sm font-black tracking-wider text-black uppercase font-bank">
                RATIO RUSH
              </h1>
              <span className="px-1.5 py-0.5 rounded bg-yellow-400 border border-black text-black text-[9px] font-black uppercase shadow-[1px_1px_0px_#000000]">
                MACHINE #13
              </span>
            </div>
            <p className="text-[9.5px] text-black font-extrabold hidden md:block mt-0.5">
              Movie Production House • Grade 6 Ratios & Proportions
            </p>
          </div>
        </div>
      </div>

      {/* ── Center: Cinematic Camera Presets (Front View Default) ── */}
      <div className="flex items-center gap-1 bg-yellow-50 p-1 rounded-xl border-2 border-black shadow-[2px_2px_0px_#000000]">
        {cameraButtons.map((btn) => (
          <button
            key={btn.id}
            onClick={() => setActiveCameraView(btn.id)}
            className={`px-2.5 py-1 rounded-lg text-[10.5px] font-black uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer ${
              activeCameraView === btn.id
                ? 'bg-yellow-400 text-black border-2 border-black shadow-[2px_2px_0px_#000000] font-black'
                : 'text-black hover:bg-white border-2 border-transparent'
            }`}
          >
            {btn.icon}
            <span className="hidden lg:inline">{btn.label}</span>
          </button>
        ))}
      </div>

      {/* ── Shared Movie Duel Score Badge ── */}
      <div className="flex items-center gap-2 bg-yellow-100 px-3 py-1 rounded-xl border-2 border-black shadow-[2px_2px_0px_#000000]">
        <div className="flex items-center gap-1.5 text-xs font-black">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 border border-black" />
          <span className="font-mono text-blue-800 font-black">{blueScenesWon}</span>
          <span className="text-black/60 font-black text-[10px]">SCENES</span>
          <span className="text-black font-black">🎬</span>
          <span className="text-black/60 font-black text-[10px]">SCENES</span>
          <span className="font-mono text-red-700 font-black">{redScenesWon}</span>
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 border border-black" />
        </div>
        <div className="h-3.5 w-px bg-black/30 mx-0.5" />
        <span className="text-[10px] font-black uppercase tracking-wider bg-yellow-300 px-2 py-0.5 rounded border border-black">
          SCENE {Math.min(5, currentMovieStage + 1)} / 5
        </span>
      </div>

      {/* ── Right: Studio Action Triggers & System Tools ── */}
      <div className="flex items-center gap-1.5">
        {/* Take Photo Flash Trigger */}
        <button
          onClick={triggerFlash}
          className="px-2.5 py-1.5 rounded-lg bg-sky-300 hover:bg-sky-200 border-2 border-black text-black text-[10px] font-black uppercase flex items-center gap-1 shadow-[2px_2px_0px_#000000] active:shadow-none transition-all cursor-pointer"
          title="Take Behind-The-Scenes Set Photo"
        >
          <Camera className="w-3.5 h-3.5 stroke-[2.5]" />
          <span className="hidden sm:inline">PHOTO</span>
        </button>

        {/* Snap Clapper Trigger */}
        <button
          onClick={triggerClapper}
          className="px-2.5 py-1.5 rounded-lg bg-rose-400 hover:bg-rose-300 border-2 border-black text-black text-[10px] font-black uppercase flex items-center gap-1 shadow-[2px_2px_0px_#000000] active:shadow-none transition-all cursor-pointer"
          title="Snap Clapperboard Take"
        >
          <Clapperboard className="w-3.5 h-3.5 stroke-[2.5]" />
          <span className="hidden sm:inline">TAKE</span>
        </button>

        {/* Countdown Timer */}
        <div className="px-2.5 py-1 rounded-lg bg-yellow-300 border-2 border-black text-black text-xs font-mono font-black shadow-[2px_2px_0px_#000000]">
          ⏱️ {formatTime(timeRemaining)}
        </div>

        {/* Audio Mute Toggle */}
        <button
          onClick={toggleMute}
          className="p-1.5 rounded-lg bg-white hover:bg-yellow-200 border-2 border-black text-black shadow-[2px_2px_0px_#000000] cursor-pointer"
          title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-red-600" /> : <Volume2 className="w-4 h-4 text-emerald-700" />}
        </button>

        {/* Reset Game */}
        <button
          onClick={resetGame}
          className="p-1.5 rounded-lg bg-white hover:bg-yellow-200 border-2 border-black text-black shadow-[2px_2px_0px_#000000] cursor-pointer"
          title="Reset Production Shoot"
        >
          <RotateCcw className="w-4 h-4 text-black" />
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          className="p-1.5 rounded-lg bg-white hover:bg-yellow-200 border-2 border-black text-black shadow-[2px_2px_0px_#000000] cursor-pointer"
          title="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
