'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, RotateCcw, Maximize, Minimize, Home, ZoomIn, ZoomOut } from 'lucide-react';
import { soundManager } from '@/utils/audio';

interface UtilityControlsProps {
  onRestart: () => void;
  onHome: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
}

export const UtilityControls: React.FC<UtilityControlsProps> = ({
  onRestart,
  onHome,
  onZoomIn,
  onZoomOut,
}) => {
  const [isMuted, setIsMuted] = useState(soundManager.getMuted());
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleSound = () => {
    const nextMuted = soundManager.toggleMute();
    setIsMuted(nextMuted);
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
    <div
      className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 rounded-2xl bg-white/95 border-2 border-slate-300 backdrop-blur-md shadow-[0_8px_25px_rgba(0,0,0,0.15)] pointer-events-auto z-40"
      onPointerDown={(e) => e.stopPropagation()}
    >
      {/* 1. Home Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => {
          soundManager.playClick();
          onHome();
        }}
        title="Exit to Start Screen"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-black text-xs font-game transition shadow-sm cursor-pointer"
      >
        <Home className="w-4 h-4 text-blue-600" />
        <span className="hidden sm:inline">HOME</span>
      </motion.button>

      {/* 2. Reset / Restart Round */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => {
          soundManager.playClick();
          onRestart();
        }}
        title="Reset Current Round"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-black text-xs font-game transition shadow-sm cursor-pointer"
      >
        <RotateCcw className="w-4 h-4 text-amber-600" />
        <span className="hidden sm:inline">RESET</span>
      </motion.button>

      {/* 3. Global Zoom In / Out */}
      {onZoomIn && (
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => {
            soundManager.playClick();
            onZoomIn();
          }}
          title="Zoom In Whole Screen"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-black text-xs font-game transition shadow-sm cursor-pointer"
        >
          <ZoomIn className="w-4 h-4 text-slate-700" />
          <span className="hidden md:inline">ZOOM +</span>
        </motion.button>
      )}

      {onZoomOut && (
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => {
            soundManager.playClick();
            onZoomOut();
          }}
          title="Zoom Out Whole Screen"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-black text-xs font-game transition shadow-sm cursor-pointer"
        >
          <ZoomOut className="w-4 h-4 text-slate-700" />
          <span className="hidden md:inline">ZOOM -</span>
        </motion.button>
      )}

      {/* 4. Sound Toggle */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={toggleSound}
        title="Toggle Sound Effects"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-black text-xs font-game transition shadow-sm cursor-pointer"
      >
        {isMuted ? (
          <>
            <VolumeX className="w-4 h-4 text-rose-500" />
            <span className="hidden sm:inline">MUTED</span>
          </>
        ) : (
          <>
            <Volume2 className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">SOUND</span>
          </>
        )}
      </motion.button>

      {/* 5. Fullscreen Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={toggleFullscreen}
        title="Toggle Fullscreen"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-black text-xs font-game transition shadow-sm cursor-pointer"
      >
        {isFullscreen ? (
          <>
            <Minimize className="w-4 h-4 text-purple-600" />
            <span className="hidden sm:inline">EXIT FULL</span>
          </>
        ) : (
          <>
            <Maximize className="w-4 h-4 text-purple-600" />
            <span className="hidden sm:inline">FULLSCREEN</span>
          </>
        )}
      </motion.button>
    </div>
  );
};
