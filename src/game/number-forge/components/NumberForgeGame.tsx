'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNumberForgeStore } from '../store/numberForgeStore';
import { NumberForgeWorldCanvas } from '../world/NumberForgeWorldCanvas';
import { ForgeTopHUD } from './ForgeTopHUD';
import { NumberForgeStartScreen } from './NumberForgeStartScreen';
import { DualTeamForgeConsole } from './DualTeamForgeConsole';
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

  const handleAnswerSubmit = (team: 'blue' | 'red', val: any) => {
    submitAnswer(team, val);
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#24170d] text-slate-100 select-none flex flex-col justify-between">
      
      {/* 1. 3D STYLIZED WORKSHOP CANVAS (60FPS THREE.JS) */}
      <NumberForgeWorldCanvas
        activeZone={activeZone}
        teamBlueAction={teamBlue.characterAction}
        teamRedAction={teamRed.characterAction}
      />

      {/* 2. STAGE: INTRO / SETUP */}
      {gameStage === 'intro' && (
        <NumberForgeStartScreen onStartGame={handleStart} />
      )}

      {/* 3. STAGE: ACTIVE MATHEMATICAL CHALLENGE (SIMULTANEOUS DUAL TEAM CONSOLES) */}
      {gameStage === 'active-challenge' && currentChallenge && (
        <div className="relative w-full h-full flex flex-col justify-between p-2 sm:p-4 z-20 overflow-y-auto">
          
          {/* Top HUD */}
          <ForgeTopHUD
            teamBlue={teamBlue}
            teamRed={teamRed}
            currentRound={currentRound}
            totalRounds={totalRounds}
            timeLeft={timeLeft}
            bloomLevel={currentChallenge.bloomLevel}
          />

          {/* Center Main Stage Activity Area */}
          <div className="w-full max-w-6xl mx-auto flex flex-col items-center gap-3 my-auto">
            
            {/* High-Contrast Question Header Card */}
            <div className="w-full p-4 rounded-3xl bg-[#1e1008] border-3 border-amber-400 text-center shadow-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-black font-game uppercase tracking-widest mb-1">
                <Wrench className="w-3.5 h-3.5 text-amber-400" />
                <span>{currentChallenge.title}</span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-display text-white whitespace-pre-line leading-tight">
                {currentChallenge.question}
              </h2>
            </div>

            {/* SIMULTANEOUS DUAL TEAM CONSOLES (Left: Blue, Right: Red) */}
            <DualTeamForgeConsole
              challenge={currentChallenge}
              teamBlue={teamBlue}
              teamRed={teamRed}
              onSubmitAnswer={handleAnswerSubmit}
            />

          </div>

        </div>
      )}

      {/* 4. STAGE: ROUND SUMMARY & MATHEMATICAL PROOF */}
      {gameStage === 'round-summary' && currentChallenge && (
        <div className="relative w-full h-full flex flex-col items-center justify-center p-4 sm:p-8 z-30 select-none max-w-3xl mx-auto">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full p-6 sm:p-8 rounded-3xl bg-[#200e05] border-4 border-amber-400 shadow-2xl text-white flex flex-col gap-4"
          >
            <div className="flex items-center gap-2 border-b border-amber-500/30 pb-3">
              <CheckCircle2 className="w-7 h-7 text-amber-400" />
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 font-game">
                  STAGE {currentRound} COMPLETED // MATHEMATICAL PROOF
                </span>
                <h3 className="text-2xl sm:text-3xl font-black font-bank uppercase text-white">
                  {currentChallenge.title}
                </h3>
              </div>
            </div>

            <p className="text-base sm:text-lg font-semibold text-slate-100 leading-relaxed font-display whitespace-pre-line">
              {currentChallenge.explanation}
            </p>

            <div className="p-4 rounded-2xl bg-amber-950 border border-amber-500/50 flex items-start gap-3 text-xs font-bold text-amber-200 font-game">
              <Lightbulb className="w-5 h-5 text-yellow-300 shrink-0 mt-0.5" />
              <span>
                <strong>FORGE MASTER TIP:</strong> {currentChallenge.learningTip}
              </span>
            </div>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={nextRound}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 border-2 border-white text-slate-950 font-black text-lg font-game uppercase tracking-wider shadow-xl flex items-center justify-center gap-2 cursor-pointer mt-2 hover:brightness-110"
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
