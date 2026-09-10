// ============================================================
// EQUATION MISSION CONTROL — Mission Control Overlays
// Neo-Brutalist Flight Briefings, Solution Telemetry & Final Report
// ============================================================

'use client';

import React from 'react';
import { useMissionControlStore } from '../store/missionControlStore';
import {
  Rocket,
  Shield,
  Trophy,
  Award,
  Play,
  RotateCcw,
  CheckCircle2,
  X,
  Gauge,
  Flame,
  Scale,
  Sliders,
  Radio,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { soundManager } from '@/utils/audio';

export const MissionControlOverlays: React.FC = () => {
  const phase = useMissionControlStore((s) => s.phase);
  const campaign = useMissionControlStore((s) => s.campaign);
  const currentStage = useMissionControlStore((s) => s.currentStageIndex);
  const challenge = useMissionControlStore((s) => s.activeChallenge);
  const blueTeam = useMissionControlStore((s) => s.blueTeam);
  const redTeam = useMissionControlStore((s) => s.redTeam);
  const winner = useMissionControlStore((s) => s.winnerTeam);
  const spacecraft = useMissionControlStore((s) => s.spacecraft);
  const toast = useMissionControlStore((s) => s.toastMessage);
  const clearToast = useMissionControlStore((s) => s.clearToast);

  // Store actions
  const startGame = useMissionControlStore((s) => s.startGame);
  const beginActiveMission = useMissionControlStore((s) => s.beginActiveMission);
  const advanceToNextStage = useMissionControlStore((s) => s.advanceToNextStage);
  const setTeamName = useMissionControlStore((s) => s.setTeamName);

  // --------------------------------------------------------------------------
  // 1. TITLE SCREEN OVERLAY
  // --------------------------------------------------------------------------
  if (phase === 'title') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 select-none">
        <div className="w-full max-w-3xl bg-white rounded-3xl border-4 border-slate-900 mc-shadow-hard-xl p-6 md:p-8 flex flex-col gap-6 relative">
          {/* Screws */}
          <div className="mc-screw absolute top-3 left-3" />
          <div className="mc-screw absolute top-3 right-3" />
          <div className="mc-screw absolute bottom-3 left-3" />
          <div className="mc-screw absolute bottom-3 right-3" />

          {/* Header Banner */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border-2 border-amber-400 text-amber-900 text-xs font-black uppercase tracking-widest mb-2">
              <Rocket className="w-3.5 h-3.5 text-amber-600" />
              GRADE 6 MATHEMATICS ARCADE
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-none uppercase">
              EQUATION MISSION CONTROL
            </h1>
            <p className="text-sm md:text-base font-bold text-slate-600 mt-2">
              Topic: Expressions, Formulae & Equations • 2-Team Interactive 3D Launch
            </p>
          </div>

          {/* Mission Objective Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border-3 border-slate-800 mc-shadow-hard">
            <div className="flex items-center gap-2 mb-2 text-xs font-black uppercase tracking-wider text-slate-700">
              <Radio className="w-4 h-4 text-blue-600" />
              MISSION BRIEFING • {campaign.title}
            </div>
            <p className="text-xs md:text-sm font-semibold text-slate-600 leading-relaxed">
              Prepare the physical 3D spacecraft for orbital insertion through 5 real aerospace stages:
              <span className="font-bold text-slate-900"> Expression Assembly</span>, 
              <span className="font-bold text-slate-900"> Variable Loading</span>, 
              <span className="font-bold text-slate-900"> Equation Balance</span>, 
              <span className="font-bold text-slate-900"> Flight Calibration</span>, and 
              <span className="font-bold text-slate-900"> Final Launch Arming</span>.
            </p>
          </div>

          {/* Team Names Input Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-blue-50 border-3 border-blue-600 mc-shadow-hard">
              <div className="text-[11px] font-black text-blue-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <span>🛰️</span> BLUE TEAM (LEFT CONSOLE)
              </div>
              <input
                type="text"
                value={blueTeam.name}
                onChange={(e) => setTeamName('blue', e.target.value)}
                maxLength={24}
                className="w-full h-11 px-3 rounded-xl bg-white border-2 border-blue-400 font-bold text-sm text-slate-900 focus:outline-hidden focus:border-blue-600"
              />
            </div>

            <div className="p-4 rounded-2xl bg-red-50 border-3 border-red-600 mc-shadow-hard">
              <div className="text-[11px] font-black text-red-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <span>🚀</span> RED TEAM (RIGHT CONSOLE)
              </div>
              <input
                type="text"
                value={redTeam.name}
                onChange={(e) => setTeamName('red', e.target.value)}
                maxLength={24}
                className="w-full h-11 px-3 rounded-xl bg-white border-2 border-red-400 font-bold text-sm text-slate-900 focus:outline-hidden focus:border-red-600"
              />
            </div>
          </div>

          {/* Launch Start Button */}
          <button
            onClick={() => {
              soundManager.play('powerup');
              startGame();
            }}
            className="w-full h-16 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:brightness-105 text-slate-950 font-black text-lg md:text-xl uppercase tracking-wider border-4 border-slate-900 mc-shadow-hard mc-pressable flex items-center justify-center gap-3"
          >
            <Play className="w-6 h-6 fill-slate-950" />
            INITIALIZE LAUNCH SYSTEMS
          </button>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // 2. STAGE DIRECTIVE OVERLAY (Stage Intro)
  // --------------------------------------------------------------------------
  if (phase === 'stage-intro') {
    const stageIcons = [
      <Zap className="w-6 h-6 text-amber-500" key="1" />,
      <Flame className="w-6 h-6 text-amber-500" key="2" />,
      <Scale className="w-6 h-6 text-emerald-500" key="3" />,
      <Gauge className="w-6 h-6 text-cyan-500" key="4" />,
      <Rocket className="w-6 h-6 text-red-500" key="5" />,
    ];

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 select-none">
        <div className="w-full max-w-xl bg-white rounded-3xl border-4 border-slate-900 mc-shadow-hard-xl p-6 flex flex-col gap-4 relative animate-in fade-in zoom-in-95 duration-200">
          <div className="mc-screw absolute top-3 left-3" />
          <div className="mc-screw absolute top-3 right-3" />

          {/* Stage Badge */}
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border-2 border-slate-400 text-slate-800 text-xs font-black uppercase">
              {stageIcons[currentStage]}
              STAGE 0{currentStage + 1} DIRECTIVE
            </div>
            <span className="text-xs font-black text-amber-600 font-mono">
              +{challenge.points} PTS
            </span>
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
              {challenge.stageTitle}
            </h2>
            <div className="text-sm font-bold text-slate-500 mt-0.5">
              {challenge.stageSubtitle}
            </div>
          </div>

          {/* Mathematical Prompt Card */}
          <div className="p-4 rounded-2xl bg-amber-50 border-3 border-amber-400 mc-shadow-hard">
            <div className="text-[10px] font-black uppercase tracking-wider text-amber-900 mb-1">
              OPERATIONAL MISSION DIRECTIVE:
            </div>
            <div className="text-base font-black text-slate-900 leading-snug">
              {challenge.briefingPrompt}
            </div>
          </div>

          {/* Educational Takeaway Hint */}
          <div className="text-xs font-semibold text-slate-600 bg-slate-100 p-3 rounded-xl border border-slate-300">
            💡 <span className="font-bold text-slate-900">Aerospace Guidance:</span> {challenge.hint}
          </div>

          <button
            onClick={() => {
              soundManager.play('click');
              beginActiveMission();
            }}
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 text-white font-black text-base uppercase tracking-wider border-3 border-slate-900 mc-shadow-hard mc-pressable flex items-center justify-center gap-2"
          >
            ENGAGE STAGE CONTROLS
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // 3. SOLUTION REVEAL OVERLAY (Solution Telemetry)
  // --------------------------------------------------------------------------
  if (phase === 'solution-reveal') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 select-none">
        <div className="w-full max-w-2xl bg-white rounded-3xl border-4 border-slate-900 mc-shadow-hard-xl p-6 flex flex-col gap-4 relative animate-in fade-in zoom-in-95 duration-200">
          <div className="mc-screw absolute top-3 left-3" />
          <div className="mc-screw absolute top-3 right-3" />

          <div className="flex items-center justify-between border-b-2 border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              <div>
                <h3 className="text-lg font-black text-slate-900 uppercase">
                  STAGE 0{currentStage + 1} COMPLETE
                </h3>
                <span className="text-[11px] font-bold text-slate-500">
                  MATHEMATICAL TELEMETRY CONFIRMED
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-black text-emerald-600 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300">
                SYSTEM VERIFIED ✓
              </span>
            </div>
          </div>

          {/* Educational Proof & Solution Breakdown */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white border-3 border-slate-800 flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
              ALGEBRAIC PROOF:
            </span>
            <div className="text-sm font-mono font-bold leading-relaxed text-slate-200">
              {challenge.educationalTakeaway}
            </div>
          </div>

          {/* Dual Team Score Summary */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-blue-50 border-2 border-blue-400 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-black text-blue-800 uppercase">{blueTeam.name}</div>
                <div className="text-lg font-black text-slate-900">{blueTeam.score} PTS</div>
              </div>
              <span className="text-xl">🛰️</span>
            </div>

            <div className="p-3 rounded-xl bg-red-50 border-2 border-red-400 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-black text-red-800 uppercase">{redTeam.name}</div>
                <div className="text-lg font-black text-slate-900">{redTeam.score} PTS</div>
              </div>
              <span className="text-xl">🚀</span>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.play('powerup');
              advanceToNextStage();
            }}
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:brightness-105 text-slate-950 font-black text-base uppercase tracking-wider border-3 border-slate-900 mc-shadow-hard mc-pressable flex items-center justify-center gap-2"
          >
            {currentStage >= 4 ? 'INITIATE FINAL LAUNCH SEQUENCE' : 'ADVANCE TO NEXT STAGE'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // 4. 12-STEP LAUNCH CINEMATIC TELEMETRY BANNER
  // --------------------------------------------------------------------------
  if (phase === 'launch-cinematic') {
    const launchStepTitles: Record<string, string> = {
      arming: 'LAUNCH SYSTEM ARMED',
      'hazard-lights': 'SAFETY WARNING LIGHTS ACTIVE',
      'umbilical-retract': 'SERVICE UMBILICAL RETRACTING',
      'fuel-decouple': 'CRYOGENIC FUEL LINES DECOUPLED',
      'clamp-release': 'LAUNCH TOWER CLAMPS RELEASED',
      ignition: 'ROCKET ENGINES IGNITED',
      'thrust-ramp': 'MAXIMUM THRUST REACHED',
      liftoff: 'LIFTOFF! SPACECRAFT ASCENDING',
      'tower-clear': 'LAUNCH TOWER CLEARED',
      'sky-ascent': 'ASCENDING INTO BRIGHT SKY',
      'cloud-entry': 'PASSING SUNLIT CUMULUS LAYER',
      'orbital-insertion': 'ORBITAL TRAJECTORY ACHIEVED',
      complete: 'MISSION SUCCESSFUL',
    };

    const currentTitle = launchStepTitles[spacecraft.launchStage] || 'LIFTOFF IN PROGRESS';

    return (
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 pointer-events-none select-none">
        <div className="px-6 py-3 rounded-2xl bg-slate-900/90 text-white border-3 border-amber-400 mc-shadow-hard flex items-center gap-3 animate-pulse">
          <Rocket className="w-6 h-6 text-amber-400 animate-bounce" />
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-amber-400">
              FLIGHT TELEMETRY STATUS:
            </div>
            <div className="text-base font-black tracking-wide font-mono">
              {currentTitle}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // 5. FINAL MISSION REPORT (Certificate of Flight)
  // --------------------------------------------------------------------------
  if (phase === 'mission-report') {
    const isWinnerBlue = winner === 'blue';
    const isWinnerRed = winner === 'red';
    const isDraw = winner === 'draw';

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 select-none animate-in fade-in zoom-in-95 duration-300">
        <div className="w-full max-w-2xl bg-white rounded-3xl border-4 border-slate-900 mc-shadow-hard-xl p-6 md:p-8 flex flex-col gap-5 relative">
          <div className="mc-screw absolute top-3 left-3" />
          <div className="mc-screw absolute top-3 right-3" />
          <div className="mc-screw absolute bottom-3 left-3" />
          <div className="mc-screw absolute bottom-3 right-3" />

          {/* Certificate Header */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border-2 border-emerald-400 text-emerald-900 text-xs font-black uppercase tracking-widest mb-1.5">
              <Award className="w-4 h-4 text-emerald-600" />
              FLIGHT CERTIFICATION COMPLETED
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tight">
              MISSION SUCCESSFUL
            </h2>
            <p className="text-xs md:text-sm font-bold text-slate-500 mt-1">
              Destination: {campaign.destinationOrbit} • Grade 6 Mathematics Verified
            </p>
          </div>

          {/* Winner Plaque */}
          <div
            className={`p-4 rounded-2xl border-3 mc-shadow-hard flex items-center justify-between ${
              isWinnerBlue
                ? 'bg-blue-100 border-blue-600 text-blue-950'
                : isWinnerRed
                ? 'bg-red-100 border-red-600 text-red-950'
                : 'bg-amber-100 border-amber-600 text-amber-950'
            }`}
          >
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-amber-500" />
              <div>
                <div className="text-[10px] font-black uppercase tracking-wider">
                  MISSION CHAMPION
                </div>
                <div className="text-xl font-black">
                  {isWinnerBlue ? blueTeam.name : isWinnerRed ? redTeam.name : 'CO-CHAMPIONS (DRAW)'}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black font-mono">
                {isWinnerBlue ? blueTeam.score : isWinnerRed ? redTeam.score : blueTeam.score} PTS
              </div>
            </div>
          </div>

          {/* Final Scoreboard Comparison */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-blue-50 border-2 border-blue-400">
              <div className="text-xs font-black text-blue-900 uppercase">{blueTeam.name}</div>
              <div className="text-2xl font-black text-slate-900 mt-1">{blueTeam.score} PTS</div>
              <div className="text-[11px] font-bold text-blue-700 mt-1">
                Stages Cleared: {blueTeam.stagesCleared}/5
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-red-50 border-2 border-red-400">
              <div className="text-xs font-black text-red-900 uppercase">{redTeam.name}</div>
              <div className="text-2xl font-black text-slate-900 mt-1">{redTeam.score} PTS</div>
              <div className="text-[11px] font-bold text-red-700 mt-1">
                Stages Cleared: {redTeam.stagesCleared}/5
              </div>
            </div>
          </div>

          {/* Replay / New Mission Button */}
          <button
            onClick={() => {
              soundManager.play('powerup');
              startGame();
            }}
            className="w-full h-15 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:brightness-105 text-slate-950 font-black text-base uppercase tracking-wider border-3 border-slate-900 mc-shadow-hard mc-pressable flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            LAUNCH NEW CAMPAIGN MISSION
          </button>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // 6. LIVE TOAST NOTIFICATION
  // --------------------------------------------------------------------------
  if (toast) {
    return (
      <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none select-none">
        <div className="px-5 py-2.5 rounded-xl bg-slate-900 text-white border-2 border-amber-400 mc-shadow-hard flex items-center gap-2 animate-bounce">
          <span className="text-base">🚀</span>
          <span className="text-xs font-black uppercase tracking-wider">{toast}</span>
        </div>
      </div>
    );
  }

  return null;
};
