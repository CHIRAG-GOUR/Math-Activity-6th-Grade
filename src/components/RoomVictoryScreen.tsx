'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { RotateCcw, Settings, ShieldCheck, ShieldAlert, Lock } from 'lucide-react';
import {
  GtaLargeGoldRollingCage,
  Gta3dBlueTrolley,
  Gta3dCashTrolley,
  GtaJewelryDiamondTray,
  GtaFloorGoldPyramid,
  GtaFloorCashStack,
} from './GtaVaultTreasuryScene';
import { VaultHeistChampionCharacter } from './VaultHeistChampionCharacter';
import { Vault3DDoor } from './Vault3DDoor';
import { TeamState } from '@/types/game';
import { soundManager } from '@/utils/audio';

interface RoomVictoryScreenProps {
  teamBlue: TeamState;
  teamRed: TeamState;
  onPlayAgain: () => void;
  onChangeSettings: () => void;
}

export const RoomVictoryScreen: React.FC<RoomVictoryScreenProps> = ({
  teamBlue,
  teamRed,
  onPlayAgain,
  onChangeSettings,
}) => {
  // Check if at least one team answered and scored points
  const hasSolvedAny = teamBlue.score > 0 || teamRed.score > 0;

  // STRICT EXPLICIT WINNER: Never show "Team 1 & Team 2"
  let blueWon = teamBlue.score > teamRed.score;
  let redWon = teamRed.score > teamBlue.score;

  // Tie-breaker if scores are equal (only if at least one team scored)
  if (hasSolvedAny && !blueWon && !redWon) {
    if (teamBlue.streak >= teamRed.streak) {
      blueWon = true;
    } else {
      redWon = true;
    }
  }

  const winnerName = blueWon ? teamBlue.name : teamRed.name;

  useEffect(() => {
    if (hasSolvedAny) {
      soundManager.playVaultCracked();

      const count = 350;
      const defaults = {
        origin: { y: 0.6 },
        colors: blueWon
          ? ['#0088FF', '#FFD700', '#FFFFFF', '#00E5FF']
          : ['#FF2A5F', '#FFD700', '#FFFFFF', '#FFAA00'],
      };

      const fire = (particleRatio: number, opts: confetti.Options) => {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      };

      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });
    } else {
      // No team answered or scored: Vault remains locked
      soundManager.playWrong();
    }
  }, [hasSolvedAny, blueWon, redWon]);

  // =========================================================================
  // SCENARIO A: NO TEAM ANSWERED AT ALL -> VAULT REMAINS LOCKED (HEIST FAILED)
  // =========================================================================
  if (!hasSolvedAny) {
    return (
      <div className="relative w-full h-full flex flex-col items-center justify-between p-4 sm:p-6 z-40 select-none max-w-5xl mx-auto overflow-hidden">
        
        {/* Top Header Banner */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col items-center text-center mt-2 z-20"
        >
          <div className="flex items-center gap-2 px-5 py-1.5 rounded-full bg-rose-100 border-2 border-rose-500 text-rose-900 text-xs font-black tracking-widest uppercase font-game mb-2 shadow">
            <ShieldAlert className="w-4 h-4 text-rose-600 animate-pulse" />
            <span>SECURITY LOCKDOWN • ZERO CODES SOLVED</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black font-bank uppercase tracking-tight text-slate-900 drop-shadow-md">
            <span className="text-rose-600">VAULT REMAINS LOCKED</span>
          </h1>
          <p className="text-sm sm:text-base font-black text-slate-700 uppercase font-game mt-1">
            NO TEAM ANSWERED CORRECTLY • ACCESS DENIED
          </p>
        </motion.div>

        {/* Center: Heavy Closed Locked Steel Vault */}
        <div className="relative w-full flex-1 flex flex-col items-center justify-center py-2 z-20">
          <div className="relative">
            <Vault3DDoor correctCount={0} totalNeeded={5} roundNumber={1} />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="px-6 py-3 rounded-2xl bg-rose-950/90 border-2 border-rose-500 text-rose-200 font-mono font-black text-sm tracking-widest flex items-center gap-2 shadow-2xl">
                <Lock className="w-5 h-5 text-rose-400 animate-bounce" />
                <span>ACCESS LOCKED</span>
              </div>
            </div>
          </div>
        </div>

        {/* Final Scores (0 PTS) & Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 z-30 mb-2">
          <div className="px-5 py-2 rounded-xl bg-blue-50 border-2 border-blue-400 flex items-center gap-3 shadow">
            <span className="text-sm font-black text-blue-950 uppercase font-game">{teamBlue.name}:</span>
            <span className="text-xl font-black text-blue-900 font-display">0 PTS</span>
          </div>

          <div className="px-5 py-2 rounded-xl bg-rose-50 border-2 border-rose-400 flex items-center gap-3 shadow">
            <span className="text-sm font-black text-rose-950 uppercase font-game">{teamRed.name}:</span>
            <span className="text-xl font-black text-rose-900 font-display">0 PTS</span>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              soundManager.playClick();
              onPlayAgain();
            }}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 border border-white text-white font-black text-base uppercase font-game shadow-md flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-5 h-5 stroke-[2.5]" />
            <span>TRY AGAIN</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              soundManager.playClick();
              onChangeSettings();
            }}
            className="px-6 py-3 rounded-xl bg-white border-2 border-slate-300 text-slate-800 font-black text-base uppercase font-game shadow flex items-center gap-2 cursor-pointer hover:bg-slate-50"
          >
            <Settings className="w-4 h-4 text-slate-700" />
            <span>SETTINGS</span>
          </motion.button>
        </div>

      </div>
    );
  }

  // =========================================================================
  // SCENARIO B: TEAM SOLVED CODES -> VAULT CRACKED & OPEN INTO GTA V TREASURY
  // =========================================================================
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-2 sm:p-4 z-40 select-none max-w-7xl mx-auto overflow-hidden">
      
      {/* 1. TOP BANNER */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex flex-col items-center text-center mt-1 z-20"
      >
        <div className="flex items-center gap-2 px-5 py-1 rounded-full bg-white/95 border-2 border-amber-400 text-amber-900 text-xs font-black tracking-widest uppercase font-game mb-1 shadow">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>CODES SOLVED • VAULT CRACKED</span>
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black font-bank uppercase tracking-tight text-slate-900 drop-shadow-md">
          {blueWon ? (
            <span className="blue-bank-text">{teamBlue.name} WINS!</span>
          ) : (
            <span className="red-bank-text">{teamRed.name} WINS!</span>
          )}
        </h1>
      </motion.div>

      {/* 2. REAL GTA V HEIST TREASURY SCENE: GROUNDED ON THE FLOOR */}
      <div className="relative w-full flex-1 flex items-end justify-center pb-2 z-20 min-h-[380px]">
        
        {/* === BACKGROUND: GIANT 2-TIER INDUSTRIAL WIRE ROLLING CAGES RESTING ON THE FLOOR === */}
        <div className="hidden lg:flex absolute left-2 bottom-4 z-10 opacity-90 transform -rotate-1">
          <GtaLargeGoldRollingCage scale={0.95} />
        </div>
        <div className="hidden lg:flex absolute right-2 bottom-4 z-10 opacity-90 transform rotate-1">
          <GtaLargeGoldRollingCage scale={0.95} />
        </div>

        {/* === FOREGROUND LEFT: INDUSTRIAL CASH TROLLEY + DIAMOND TRAY === */}
        <motion.div
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute left-4 sm:left-12 lg:left-32 bottom-2 z-20 flex flex-col items-center"
        >
          <div className="transform -translate-y-2 translate-x-4 z-30">
            <GtaJewelryDiamondTray scale={0.85} />
          </div>
          <Gta3dCashTrolley scale={1.0} />
        </motion.div>

        {/* === CENTER: FULL-BODY HUMAN CHAMPION GROUNDED ON FLOOR & CELEBRATING === */}
        <div className="relative z-30 flex items-end justify-center bottom-2">
          <VaultHeistChampionCharacter
            winnerName={winnerName}
            isBlueWinner={blueWon}
          />
        </div>

        {/* === FOREGROUND RIGHT: BLUE STEEL GOLD TROLLEY + DIAMOND TRAY === */}
        <motion.div
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute right-4 sm:right-12 lg:right-32 bottom-2 z-20 flex flex-col items-center"
        >
          <div className="transform -translate-y-2 -translate-x-4 z-30">
            <GtaJewelryDiamondTray scale={0.85} />
          </div>
          <Gta3dBlueTrolley scale={1.0} />
        </motion.div>

        {/* === SCATTERED FLOOR LOOT (DIAMOND TRAYS, GOLD PYRAMIDS & CASH BUNDLES) === */}
        <div className="absolute bottom-0 inset-x-6 hidden sm:flex justify-between items-end pointer-events-none z-30">
          {/* Left Floor Vault Stash */}
          <div className="flex items-end gap-2 transform -rotate-2">
            <GtaFloorGoldPyramid />
            <GtaJewelryDiamondTray scale={0.95} />
            <GtaFloorCashStack />
          </div>

          {/* Right Floor Vault Stash */}
          <div className="flex items-end gap-2 transform rotate-2">
            <GtaFloorCashStack />
            <GtaJewelryDiamondTray scale={0.95} />
            <GtaFloorGoldPyramid />
          </div>
        </div>

      </div>

      {/* 3. FINAL SCORES & ACTION BUTTONS */}
      <div className="flex flex-wrap items-center justify-center gap-4 z-30 my-1">
        <div className="px-5 py-2 rounded-xl bg-blue-50 border-2 border-blue-400 flex items-center gap-3 shadow">
          <span className="text-sm font-black text-blue-950 uppercase font-game">{teamBlue.name}:</span>
          <span className="text-xl font-black text-blue-900 font-display">{teamBlue.score} PTS</span>
        </div>

        <div className="px-5 py-2 rounded-xl bg-rose-50 border-2 border-rose-400 flex items-center gap-3 shadow">
          <span className="text-sm font-black text-rose-950 uppercase font-game">{teamRed.name}:</span>
          <span className="text-xl font-black text-rose-900 font-display">{teamRed.score} PTS</span>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            soundManager.playClick();
            onPlayAgain();
          }}
          className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 border border-white text-white font-black text-base uppercase font-game shadow-md flex items-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-5 h-5 stroke-[2.5]" />
          <span>PLAY AGAIN</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            soundManager.playClick();
            onChangeSettings();
          }}
          className="px-6 py-3 rounded-xl bg-white border-2 border-amber-400 text-amber-950 font-black text-base uppercase font-game shadow flex items-center gap-2 cursor-pointer hover:bg-amber-50"
        >
          <Settings className="w-4 h-4 text-amber-800" />
          <span>SETTINGS</span>
        </motion.button>
      </div>

    </div>
  );
};
