'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cpu,
  Terminal,
  Lightbulb,
  Home,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Activity,
  X,
} from 'lucide-react';
import { Question } from '@/types/game';
import { soundManager } from '@/utils/audio';

interface VaultQuestionBoxProps {
  question: Question | null;
  roundNumber: number;
  totalRounds: number;
  onHome?: () => void;
  onRestart?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
}

export const VaultQuestionBox: React.FC<VaultQuestionBoxProps> = ({
  question,
  roundNumber,
  totalRounds,
  onHome,
  onRestart,
  onZoomIn,
  onZoomOut,
}) => {
  // STRICTLY FALSE BY DEFAULT
  const [showHint, setShowHint] = useState<boolean>(false);

  // Reset hint whenever question changes
  useEffect(() => {
    setShowHint(false);
  }, [question?.id]);

  const handleZoomIn = () => {
    soundManager.playClick();
    if (onZoomIn) onZoomIn();
  };

  const handleZoomOut = () => {
    soundManager.playClick();
    if (onZoomOut) onZoomOut();
  };

  if (!question) return null;

  return (
    <div className="relative w-full max-w-[96%] sm:max-w-[480px] md:max-w-[540px] mx-auto z-20 select-none mb-1 flex flex-col items-center">
      
      {/* 1. ARDUINO MULTI-COLORED I2C RIBBON BUS WIRES */}
      <div className="flex items-center justify-between w-5/6 -mb-1 px-4 z-10">
        <div className="flex gap-1.5">
          <div className="w-1.5 h-2.5 bg-red-500 rounded-t shadow-sm" />
          <div className="w-1.5 h-2.5 bg-blue-600 rounded-t shadow-sm" />
          <div className="w-1.5 h-2.5 bg-amber-400 rounded-t shadow-sm" />
          <div className="w-1.5 h-2.5 bg-emerald-500 rounded-t shadow-sm" />
        </div>
        <div className="flex items-center gap-1.5 bg-white border-2 border-blue-400 px-3 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-black text-blue-900 shadow-sm">
          <Activity className="w-3 h-3 text-blue-600 animate-pulse" />
          <span>ARDUINO I2C BUS • 0x27</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-1.5 h-2.5 bg-amber-400 rounded-t shadow-sm" />
          <div className="w-1.5 h-2.5 bg-emerald-500 rounded-t shadow-sm" />
          <div className="w-1.5 h-2.5 bg-cyan-500 rounded-t shadow-sm" />
        </div>
      </div>

      {/* 2. LIGHT ARDUINO DECODER ENCLOSURE */}
      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, scale: 0.96, y: -4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 4 }}
          transition={{ duration: 0.2 }}
          className="relative w-full rounded-2xl sm:rounded-3xl bg-white/95 border-2 sm:border-3 border-blue-400 p-2.5 sm:p-4 shadow-[0_12px_35px_rgba(0,0,0,0.12),inset_0_2px_4px_rgba(255,255,255,1)] flex flex-col items-center"
        >
          {/* Microcontroller Corner Brass Screws */}
          <div className="absolute top-2 left-2 w-2.5 h-2.5 rounded-full bg-amber-300 border border-amber-600 shadow-inner" />
          <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-amber-300 border border-amber-600 shadow-inner" />
          <div className="absolute bottom-2 left-2 w-2.5 h-2.5 rounded-full bg-amber-300 border border-amber-600 shadow-inner" />
          <div className="absolute bottom-2 right-2 w-2.5 h-2.5 rounded-full bg-amber-300 border border-amber-600 shadow-inner" />

          {/* Top Bar: Arduino Status & Utility Action Buttons */}
          <div className="w-full flex items-center justify-between px-1.5 mb-1.5">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <Cpu className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
              <span className="text-[9px] sm:text-[11px] font-mono font-black tracking-wider text-slate-800 uppercase">
                ARDUINO DECODER // ATmega328P
              </span>
            </div>

            {/* INTEGRATED ACTION BUTTONS: HOME, RESET, ZOOM IN, ZOOM OUT */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              {onHome && (
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onHome();
                  }}
                  title="Home Screen"
                  className="p-1 sm:p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-300 text-blue-800 transition cursor-pointer shadow-sm"
                >
                  <Home className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </button>
              )}

              {onRestart && (
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onRestart();
                  }}
                  title="Reset Round"
                  className="p-1 sm:p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-800 transition cursor-pointer shadow-sm"
                >
                  <RotateCcw className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </button>
              )}

              <button
                onClick={handleZoomIn}
                title="Zoom In Question"
                className="p-1 sm:p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 transition cursor-pointer shadow-sm"
              >
                <ZoomIn className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>

              <button
                onClick={handleZoomOut}
                title="Zoom Out Question"
                className="p-1 sm:p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 transition cursor-pointer shadow-sm"
              >
                <ZoomOut className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
            </div>
          </div>

          {/* 3. LIGHT HIGH-CONTRAST BACKLIT LCD SCREEN (HIGH VISIBILITY) */}
          <div className="relative w-full rounded-xl sm:rounded-2xl bg-gradient-to-b from-[#e8f8f0] via-[#def4ea] to-[#d2efdf] border-2 border-emerald-500/80 p-2.5 sm:p-4 shadow-[inset_0_2px_6px_rgba(0,0,0,0.06),0_2px_8px_rgba(16,185,129,0.15)] flex flex-col items-center justify-center text-center overflow-hidden">
            
            {/* Subtle LCD Scanline Pattern */}
            <div
              className="absolute inset-0 pointer-events-none opacity-15"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(5, 150, 105, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(5, 150, 105, 0.2) 1px, transparent 1px)',
                backgroundSize: '4px 4px',
              }}
            />

            {/* LCD Header Strip */}
            <div className="flex items-center justify-between w-full border-b border-emerald-300/80 pb-1 mb-1 z-10">
              <span className="text-[10px] sm:text-[11px] font-mono font-black tracking-widest text-emerald-900 uppercase flex items-center gap-1">
                <Terminal className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-700" />
                <span>TUMBLER {roundNumber} OF {totalRounds}</span>
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono font-black text-amber-900 uppercase px-2 py-0.5 rounded-full bg-amber-200/90 border border-amber-400">
                SOLVE FOR BYPASS CODE
              </span>
            </div>

            {/* GIANT HIGH-CONTRAST QUESTION TEXT */}
            <div className="w-full flex flex-col items-center py-0.5">
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black font-mono tracking-wide text-slate-950 my-0.5 leading-tight z-10 drop-shadow-sm">
                {question.text}
              </h2>

              {/* Subtext info */}
              {question.subText && (
                <p className="text-[11px] sm:text-sm font-mono font-extrabold text-emerald-950 mt-0.5 z-10">
                  {'// '}{question.subText}
                </p>
              )}
            </div>

            {/* HINT BUTTON (HINT NEVER SHOWN UNLESS EXPLICITLY CLICKED) */}
            {question.hint && (
              <div className="mt-1.5 flex flex-col items-center z-10">
                {!showHint ? (
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setShowHint(true);
                    }}
                    className="flex items-center gap-1 text-[9px] sm:text-[11px] font-mono font-black text-amber-950 bg-amber-200/90 hover:bg-amber-300 px-3 py-0.5 sm:py-1 rounded-full border border-amber-400 shadow-sm transition cursor-pointer"
                  >
                    <Lightbulb className="w-3 h-3 text-amber-700" />
                    <span>[DECRYPT HINT]</span>
                  </button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-[11px] sm:text-xs font-mono font-bold text-amber-950 bg-white/95 border-2 border-amber-400 px-3 py-1.5 rounded-xl shadow-md mt-1 max-w-[400px] flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-yellow-600 shrink-0" />
                      <span>{question.hint}</span>
                    </div>
                    <button
                      onClick={() => setShowHint(false)}
                      className="p-0.5 rounded hover:bg-amber-100 text-amber-900 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </motion.div>
                )}
              </div>
            )}

          </div>

          {/* Bottom Arduino Status Strip */}
          <div className="w-full flex items-center justify-between px-2 mt-1.5 text-[9px] sm:text-[10px] font-mono font-bold text-slate-600">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm" />
              <span>PIN D13: ACTIVE</span>
            </span>
            <span className="text-blue-700">BAUD: 115200</span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping" />
              <span>STATUS: READY</span>
            </span>
          </div>

        </motion.div>
      </AnimatePresence>

    </div>
  );
};
