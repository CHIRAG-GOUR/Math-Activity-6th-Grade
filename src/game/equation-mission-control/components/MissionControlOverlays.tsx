// ============================================================
// EQUATION MISSION CONTROL 2.0 — Mission Control Overlays
// Non-Blocking Live Toast Telemetry (Learned from Train Game)
// No Disruptive Modals Between Questions!
// ============================================================

'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMissionControlStore } from '../store/missionControlStore';
import {
  Rocket,
  Trophy,
  Award,
  Play,
  RotateCcw,
  CheckCircle2,
  Radio,
  Sparkles,
} from 'lucide-react';
import { soundManager } from '@/utils/audio';

export const MissionControlOverlays: React.FC = () => {
  const phase = useMissionControlStore((s) => s.phase);
  const campaign = useMissionControlStore((s) => s.campaign);
  const blueTeam = useMissionControlStore((s) => s.blueTeam);
  const redTeam = useMissionControlStore((s) => s.redTeam);
  const winner = useMissionControlStore((s) => s.winnerTeam);
  const blueShip = useMissionControlStore((s) => s.blueSpacecraft);
  const redShip = useMissionControlStore((s) => s.redSpacecraft);
  const toast = useMissionControlStore((s) => s.toastMessage);

  const targetStages = useMissionControlStore((s) => s.targetStages);
  const setTargetStages = useMissionControlStore((s) => s.setTargetStages);

  // Store actions
  const startGame = useMissionControlStore((s) => s.startGame);
  const setTeamName = useMissionControlStore((s) => s.setTeamName);

  return (
    <>
      {/* -------------------------------------------------------------------------- */}
      {/* 1. NON-BLOCKING LIVE TOAST (Matching Train Game)                           */}
      {/* -------------------------------------------------------------------------- */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-18 left-1/2 -translate-x-1/2 z-50 pointer-events-none select-none max-w-xl w-auto px-5 py-2.5 rounded-2xl bg-white/95 backdrop-blur-md border-3 border-emerald-500 text-slate-900 font-black text-xs sm:text-sm tracking-wide shadow-2xl flex items-center gap-2.5"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="truncate">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* -------------------------------------------------------------------------- */}
      {/* 2. TITLE SCREEN OVERLAY                                                    */}
      {/* -------------------------------------------------------------------------- */}
      {phase === 'title' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 select-none">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-3xl bg-white rounded-3xl border-4 border-slate-900 mc-shadow-hard-xl p-6 md:p-8 flex flex-col gap-4 relative"
          >
            <div className="mc-screw absolute top-3 left-3" />
            <div className="mc-screw absolute top-3 right-3" />
            <div className="mc-screw absolute bottom-3 left-3" />
            <div className="mc-screw absolute bottom-3 right-3" />

            {/* Header Banner */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 border-2 border-amber-400 text-amber-900 text-xs font-black uppercase tracking-widest mb-1.5">
                <Rocket className="w-3.5 h-3.5 text-amber-600" />
                GRADE 6 DUAL 3D SPACECRAFT DUEL
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-none uppercase">
                EQUATION MISSION CONTROL
              </h1>
              <p className="text-xs md:text-sm font-bold text-slate-600 mt-1">
                Expressions, Formulae & Equations • First Correct Answer Wins Stage & Prepares 3D Rocket!
              </p>
            </div>

            {/* Mission Briefing Card */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border-3 border-slate-800 mc-shadow-hard">
              <div className="flex items-center gap-2 mb-1 text-xs font-black uppercase tracking-wider text-slate-700">
                <Radio className="w-4 h-4 text-blue-600" />
                MISSION DIRECTIVE • {campaign.title}
              </div>
              <p className="text-xs md:text-sm font-semibold text-slate-600 leading-relaxed">
                Two engineering teams race to prepare their 3D spacecraft on the launch campus.
                Each correct answer unlocks key subsystems:
                <span className="font-bold text-slate-900"> ① Avionics HUD</span>, 
                <span className="font-bold text-slate-900"> ② Cryo Fuel</span>, 
                <span className="font-bold text-slate-900"> ③ Engine Balance</span>, 
                <span className="font-bold text-slate-900"> ④ Guidance</span>, and 
                <span className="font-bold text-slate-900"> ⑤ Liftoff Ignition</span>!
              </p>
            </div>

            {/* Target Stages (5, 10, 15, 20) Selection */}
            <div className="p-3.5 rounded-2xl bg-amber-100 border-3 border-amber-500 mc-shadow-hard text-left">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-950 block mb-1.5">
                MISSION DURATION (STAGES / QUESTIONS TO WIN):
              </span>
              <div className="grid grid-cols-4 gap-2">
                {([5, 10, 15, 20] as const).map((stages) => (
                  <button
                    key={stages}
                    type="button"
                    onClick={() => setTargetStages(stages)}
                    className={`py-2 rounded-xl border-2 border-slate-900 font-black text-xs transition-all cursor-pointer ${
                      targetStages === stages
                        ? 'bg-amber-400 text-slate-950 mc-shadow-hard scale-105'
                        : 'bg-white text-slate-800 hover:bg-amber-50 shadow-xs'
                    }`}
                  >
                    {stages} Stages
                  </button>
                ))}
              </div>
            </div>

            {/* Team Names Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-blue-50 border-3 border-blue-600 mc-shadow-hard">
                <div className="text-[10px] font-black text-blue-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <span>🛰️</span> BLUE ROCKET (LEFT COMPLEX)
                </div>
                <input
                  type="text"
                  value={blueTeam.name}
                  onChange={(e) => setTeamName('blue', e.target.value)}
                  maxLength={24}
                  className="w-full h-10 px-3 rounded-xl bg-white border-2 border-blue-400 font-bold text-sm text-slate-900 focus:outline-hidden"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-red-50 border-3 border-red-600 mc-shadow-hard">
                <div className="text-[10px] font-black text-red-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <span>🚀</span> RED ROCKET (RIGHT COMPLEX)
                </div>
                <input
                  type="text"
                  value={redTeam.name}
                  onChange={(e) => setTeamName('red', e.target.value)}
                  maxLength={24}
                  className="w-full h-10 px-3 rounded-xl bg-white border-2 border-red-400 font-bold text-sm text-slate-900 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={() => {
                soundManager.play('powerup');
                startGame();
              }}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:brightness-105 text-slate-950 font-black text-lg uppercase tracking-wider border-4 border-slate-900 mc-shadow-hard mc-pressable flex items-center justify-center gap-3 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-slate-950" />
              START LAUNCH MISSION 🚀
            </button>
          </motion.div>
        </div>
      )}

      {/* -------------------------------------------------------------------------- */}
      {/* 3. 12-STEP LAUNCH CINEMATIC TELEMETRY BANNER                               */}
      {/* -------------------------------------------------------------------------- */}
      {phase === 'launch-cinematic' && (
        <div className="fixed top-18 left-1/2 -translate-x-1/2 z-40 pointer-events-none select-none">
          {(() => {
            const heroShip = winner === 'red' ? redShip : blueShip;
            const heroName =
              winner === 'red'
                ? redTeam.name
                : winner === 'blue'
                ? blueTeam.name
                : 'DUAL SPACECRAFT';

            const launchStepTitles: Record<string, string> = {
              arming: 'LAUNCH SYSTEMS ARMED — PERSONNEL TO PERIMETER',
              'hazard-lights': 'SAFETY WARNING ROTATING BEACONS ACTIVE',
              'umbilical-retract': 'SERVICE GANTRY UMBILICALS RETRACTED',
              'fuel-decouple': 'CRYOGENIC FUEL LINES DECOUPLED',
              'clamp-release': 'LAUNCH TOWER HYDRAULIC CLAMPS RELEASED',
              ignition: `${heroName} ENGINES IGNITED`,
              'thrust-ramp': 'MAXIMUM THRUST REACHED',
              liftoff: `LIFTOFF! ${heroName} ASCENDING`,
              'tower-clear': 'LAUNCH TOWER CLEARED',
              'sky-ascent': 'ASCENDING INTO BRIGHT SUNLIT SKY',
              'cloud-entry': 'PENETRATING CUMULUS CLOUD LAYER',
              'orbital-insertion': 'ORBITAL TRAJECTORY ACHIEVED',
              complete: 'MISSION SUCCESSFUL',
            };

            const currentTitle =
              launchStepTitles[heroShip.launchStage] || 'LIFTOFF IN PROGRESS';

            return (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-6 py-3 rounded-2xl bg-slate-900/95 text-white border-3 border-amber-400 mc-shadow-hard flex items-center gap-3.5 shadow-2xl"
              >
                <Rocket className="w-6 h-6 text-amber-400 animate-bounce" />
                <div>
                  <div className="text-[9px] font-black uppercase tracking-widest text-amber-400">
                    {heroName} FLIGHT TELEMETRY:
                  </div>
                  <div className="text-sm sm:text-base font-black tracking-wide font-mono">
                    {currentTitle}
                  </div>
                </div>
              </motion.div>
            );
          })()}
        </div>
      )}

      {/* -------------------------------------------------------------------------- */}
      {/* 4. FINAL MISSION REPORT (Certificate of Flight)                            */}
      {/* -------------------------------------------------------------------------- */}
      {phase === 'mission-report' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 select-none">
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-2xl bg-white rounded-3xl border-4 border-slate-900 mc-shadow-hard-xl p-6 md:p-8 flex flex-col gap-4 relative"
          >
            <div className="mc-screw absolute top-3 left-3" />
            <div className="mc-screw absolute top-3 right-3" />
            <div className="mc-screw absolute bottom-3 left-3" />
            <div className="mc-screw absolute bottom-3 right-3" />

            {/* Certificate Header */}
            <div className="text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border-2 border-emerald-400 text-emerald-900 text-xs font-black uppercase tracking-widest mb-1">
                <Award className="w-3.5 h-3.5 text-emerald-600" />
                MISSION COMPLETED
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tight">
                LAUNCH SUCCESSFUL
              </h2>
              <p className="text-xs font-bold text-slate-500 mt-0.5">
                Destination: {campaign.destinationOrbit} • Grade 6 Mathematics Verified
              </p>
            </div>

            {/* Winner Plaque */}
            {(() => {
              const isWinnerRed = winner === 'red';
              const winningTeam = isWinnerRed ? redTeam : blueTeam;

              return (
                <div
                  className={`p-4 rounded-2xl border-3 mc-shadow-hard flex items-center justify-between ${
                    isWinnerRed
                      ? 'bg-red-100 border-red-600 text-red-950'
                      : 'bg-blue-100 border-blue-600 text-blue-950'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Trophy className="w-8 h-8 text-amber-500 animate-bounce" />
                    <div>
                      <div className="text-[9px] font-black uppercase tracking-wider">
                        MISSION CHAMPION & LIFTOFF WINNER
                      </div>
                      <div className="text-xl font-black">
                        {winningTeam.name}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black font-mono">
                      {winningTeam.score} PTS
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Scoreboard Comparison */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-blue-50 border-2 border-blue-400">
                <div className="text-xs font-black text-blue-900 uppercase">{blueTeam.name}</div>
                <div className="text-xl font-black text-slate-900 mt-0.5">{blueTeam.score} PTS</div>
                <div className="text-[10px] font-bold text-blue-700 mt-0.5">
                  Stages Cleared: {blueTeam.stagesCleared}/{targetStages}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-red-50 border-2 border-red-400">
                <div className="text-xs font-black text-red-900 uppercase">{redTeam.name}</div>
                <div className="text-xl font-black text-slate-900 mt-0.5">{redTeam.score} PTS</div>
                <div className="text-[10px] font-bold text-red-700 mt-0.5">
                  Stages Cleared: {redTeam.stagesCleared}/{targetStages}
                </div>
              </div>
            </div>

            {/* Replay Buttons */}
            <div className="flex gap-3 w-full justify-center mt-1">
              <button
                onClick={() => {
                  soundManager.stopRocketSounds();
                  soundManager.play('powerup');
                  startGame();
                }}
                className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:brightness-105 text-slate-950 font-black text-xs uppercase tracking-wider border-3 border-slate-900 mc-shadow-hard mc-pressable flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                PLAY AGAIN 🚀
              </button>
              <button
                onClick={() => (window.location.href = '/')}
                className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:brightness-105 text-slate-950 font-black text-xs uppercase tracking-wider border-3 border-slate-900 mc-shadow-hard mc-pressable flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                ARCADE HUB
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};
