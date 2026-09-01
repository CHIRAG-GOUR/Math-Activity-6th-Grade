'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Zap } from 'lucide-react';
import { soundManager } from '@/utils/audio';

interface CountdownOverlayProps {
  onComplete: () => void;
}

export const CountdownOverlay: React.FC<CountdownOverlayProps> = ({ onComplete }) => {
  const [count, setCount] = useState<number | string>(3);

  useEffect(() => {
    soundManager.playCountdownTick();

    const t1 = setTimeout(() => {
      setCount(2);
      soundManager.playCountdownTick();
    }, 900);

    const t2 = setTimeout(() => {
      setCount(1);
      soundManager.playCountdownTick();
    }, 1800);

    const t3 = setTimeout(() => {
      setCount('CRACK THE VAULT!');
      soundManager.playCountdownGo();
    }, 2700);

    const t4 = setTimeout(() => {
      onComplete();
    }, 3700);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md select-none pointer-events-none overflow-hidden">
      
      {/* Background Radial Light Rays */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[600px] h-[600px] rounded-full bg-blue-500/15 blur-3xl animate-pulse" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={String(count)}
          initial={{ scale: 0.3, opacity: 0, rotate: typeof count === 'number' ? -20 : 0 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          exit={{ scale: 1.5, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 450, damping: 22 }}
          className="relative flex flex-col items-center justify-center text-center px-8 z-10"
        >
          {typeof count === 'number' ? (
            <div className="relative flex items-center justify-center">
              {/* Outer Rotating Dials */}
              <div className="w-56 h-56 sm:w-72 sm:h-72 rounded-full border-4 border-dashed border-cyan-400/40 animate-spin flex items-center justify-center" />
              
              <div className="absolute w-44 h-44 sm:w-56 sm:h-56 rounded-full border-4 border-amber-400/50 flex items-center justify-center bg-slate-900/90 shadow-[0_0_50px_rgba(0,136,255,0.6)]">
                <span className="text-8xl sm:text-9xl md:text-[9rem] font-black font-bank tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-yellow-500 drop-shadow-[0_4px_25px_rgba(255,215,0,0.9)]">
                  {count}
                </span>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ scale: 0.7 }}
              animate={{ scale: [0.7, 1.1, 1] }}
              className="flex flex-col items-center"
            >
              <div className="px-6 py-2 rounded-full bg-amber-400/20 border-2 border-amber-400 text-amber-300 text-xs font-black tracking-widest font-game uppercase mb-3 flex items-center gap-2 shadow">
                <ShieldAlert className="w-4 h-4 text-amber-300" />
                <span>HEIST SYSTEM ENGAGED</span>
              </div>
              <div className="text-5xl sm:text-7xl md:text-8xl font-black font-bank uppercase tracking-wider bg-gradient-to-r from-yellow-300 via-white to-amber-400 bg-clip-text text-transparent drop-shadow-[0_0_45px_rgba(255,215,0,1)]">
                {count}
              </div>
            </motion.div>
          )}

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm sm:text-base md:text-lg font-black uppercase tracking-widest text-cyan-200 font-game mt-6 flex items-center gap-2"
          >
            <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span>SOLVE MENTALLY • BUZZ IN FIRST</span>
            <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          </motion.p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
