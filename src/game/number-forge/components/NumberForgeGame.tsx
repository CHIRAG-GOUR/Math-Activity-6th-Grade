'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNumberForgeStore } from '../store/numberForgeStore';
import { NumberForgeWorldCanvas } from '../world/NumberForgeWorldCanvas';
import { ForgeTopHUD } from './ForgeTopHUD';
import { NumberForgeStartScreen } from './NumberForgeStartScreen';
import { PlaceValueSideConsole } from './PlaceValueSideConsole';
import { ForgeVictoryScreen } from './ForgeVictoryScreen';
import { soundManager } from '@/utils/audio';
import { ArrowRight, CheckCircle2, Lightbulb, Wrench } from 'lucide-react';

export const NumberForgeGame: React.FC = () => {
  const {
    gameStage,
    currentRound,
    totalRounds,
    currentChallenge,
    activeZone,
    timeLeft,
    teamBlue,
    teamRed,
    initializeGame,
    submitAnswer,
    nextRound,
    tickTimer,
    restartGame,
  } = useNumberForgeStore();

  // Background Audio & Timer Tick Loop
  useEffect(() => {
    soundManager.startBgm(0.35);

    const timer = setInterval(() => {
      tickTimer();
    }, 1000);

    return () => clearInterval(timer);
  }, [tickTimer]);

  const handleStart = (blueName: string, redName: string, rounds: number) => {
    initializeGame(blueName, redName, rounds);
  };

  const handleBlueSubmit = (slots: any, total: number) => {
    submitAnswer('blue', slots, total);
  };

  const handleRedSubmit = (slots: any, total: number) => {
    submitAnswer('red', slots, total);
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#fbf7ee] text-slate-900 select-none flex flex-col justify-between">
      
      {/* 1. 3D STYLIZED WORKSHOP CANVAS (BRIGHT SUNLIT SUNNY WORKSHOP) */}
      <NumberForgeWorldCanvas activeZone={activeZone} />

      {/* 2. STAGE: INTRO / SETUP */}
      {gameStage === 'intro' && (
        <NumberForgeStartScreen onStartGame={handleStart} />
      )}

      {/* 3. STAGE: ACTIVE MATHEMATICAL CHALLENGE (SIDE-BY-SIDE 3-COLUMN COMPOSITION) */}
      {gameStage === 'active-challenge' && currentChallenge && (
        <div className="relative w-full h-full flex flex-col justify-between z-20 overflow-hidden">
          
          {/* TOP COMPACT HUD */}
          <ForgeTopHUD
            teamBlue={teamBlue}
            teamRed={teamRed}
            currentRound={currentRound}
            totalRounds={totalRounds}
            timeLeft={timeLeft}
            bloomLevel={currentChallenge.bloomLevel}
          />

          {/* MAIN 3-COLUMN INTERACTION ARENA */}
          <div className="flex-1 w-full max-w-[1920px] mx-auto px-4 py-2 flex items-center justify-between gap-4 overflow-hidden">
            
            {/* COLUMN 1: LEFT ~30% — TEAM BLUE CONSOLE */}
            <div className="w-[30%] h-full max-h-[660px] flex flex-col justify-center">
              <PlaceValueSideConsole
                team="blue"
                teamState={teamBlue}
                challenge={currentChallenge}
                onSubmit={handleBlueSubmit}
              />
            </div>

            {/* COLUMN 2: CENTER ~40% — 3D FORGE MACHINE + LIGHT CHALLENGE BANNER */}
            <div className="w-[38%] h-full flex flex-col justify-between items-center py-1 pointer-events-none">
              
              {/* TOP CENTER: BRIGHT HIGH-CONTRAST CHALLENGE BANNER */}
              <div className="w-full pointer-events-auto p-4 rounded-3xl bg-white/95 border-3 border-amber-500 text-center shadow-xl backdrop-blur-sm flex flex-col items-center gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-100 border border-amber-400 text-amber-900 text-xs font-black font-game uppercase tracking-widest">
                  <Wrench className="w-3.5 h-3.5 text-amber-600" />
                  <span>{currentChallenge.title}</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black font-bank uppercase text-slate-950 tracking-wide">
                  BUILD THE NUMBER
                </h2>

                {/* Structured Mathematical Place Parts Breakdown */}
                {currentChallenge.structuredDecomposition && (
                  <div className="w-full flex flex-col gap-2 mt-1">
                    <div className="grid grid-cols-3 gap-1.5 w-full">
                      {currentChallenge.structuredDecomposition.placeParts.map((part, idx) => (
                        <div
                          key={idx}
                          className="p-1.5 rounded-xl bg-amber-50 border-2 border-amber-300 text-center shadow-sm"
                        >
                          <span className="text-xl font-black font-bank text-amber-900 mr-1">
                            {part.quantity}
                          </span>
                          <span className="text-[11px] font-bold font-game text-slate-800 uppercase block">
                            {part.placeLabel}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Addition Breakdown Form */}
                    <div className="w-full py-1.5 px-3 rounded-xl bg-slate-100 border-2 border-slate-300 flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm font-mono font-bold text-slate-800">
                      {currentChallenge.structuredDecomposition.additionParts.map((addPart, idx) => (
                        <span key={idx} className="tracking-wide">
                          {addPart}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* CENTER 3D MACHINE VIEWPORT (Unobstructed view of 3D Machine) */}
              <div className="flex-1 w-full flex items-center justify-center pointer-events-none" />

            </div>

            {/* COLUMN 3: RIGHT ~30% — TEAM RED CONSOLE */}
            <div className="w-[30%] h-full max-h-[660px] flex flex-col justify-center">
              <PlaceValueSideConsole
                team="red"
                teamState={teamRed}
                challenge={currentChallenge}
                onSubmit={handleRedSubmit}
              />
            </div>

          </div>

        </div>
      )}

      {/* 4. STAGE: ROUND SUMMARY & MATHEMATICAL PROOF */}
      {gameStage === 'round-summary' && currentChallenge && (
        <div className="relative w-full h-full flex flex-col items-center justify-center p-4 sm:p-8 z-30 select-none max-w-3xl mx-auto">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full p-6 sm:p-8 rounded-3xl bg-white border-4 border-amber-500 shadow-2xl text-slate-900 flex flex-col gap-4"
          >
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
              <CheckCircle2 className="w-7 h-7 text-amber-600" />
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-700 font-game">
                  STAGE {currentRound} COMPLETED // MATHEMATICAL PROOF
                </span>
                <h3 className="text-2xl sm:text-3xl font-black font-bank uppercase text-slate-950">
                  {currentChallenge.title}
                </h3>
              </div>
            </div>

            <p className="text-base sm:text-lg font-semibold text-slate-800 leading-relaxed font-display whitespace-pre-line">
              {currentChallenge.explanation}
            </p>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 flex items-start gap-3 text-xs font-bold text-amber-900 font-game">
              <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>FORGE MASTER TIP:</strong> {currentChallenge.learningTip}
              </span>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={nextRound}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 border-2 border-white text-slate-950 font-black text-lg font-game uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-2 hover:brightness-105"
            >
              <span>ADVANCE TO STAGE {currentRound + 1}</span>
              <ArrowRight className="w-5 h-5 stroke-[3]" />
            </motion.button>
          </motion.div>
        </div>
      )}

      {/* 5. STAGE: VICTORY CELEBRATION */}
      {gameStage === 'master-complete' && (
        <ForgeVictoryScreen
          teamBlue={teamBlue}
          teamRed={teamRed}
          onPlayAgain={restartGame}
        />
      )}

    </main>
  );
};
