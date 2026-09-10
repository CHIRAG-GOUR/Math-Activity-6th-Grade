// ============================================================
// EQUATION MISSION CONTROL 2.0 — Mission Control Overlays
// Neo-Brutalist Flight Briefings, Solution Telemetry & Final Report
// ============================================================

'use client';

import React from 'react';
import { useMissionControlStore } from '../store/missionControlStore';
import {
  Rocket,
  Trophy,
  Award,
  Play,
  RotateCcw,
  CheckCircle2,
  Gauge,
  Flame,
  Scale,
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
  const blueShip = useMissionControlStore((s) => s.blueSpacecraft);
  const redShip = useMissionControlStore((s) => s.redSpacecraft);
  const toast = useMissionControlStore((s) => s.toastMessage);

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
        <div className="w-full max-w-3xl bg-white rounded-3xl border-4 border-slate-900 mc-shadow-hard-xl p-6 md:p-8 flex flex-col gap-5 relative">
          <div className="mc-screw absolute top-3 left-3" />
          <div className="mc-screw absolute top-3 right-3" />
          <div className="mc-screw absolute bottom-3 left-3" />
          <div className="mc-screw absolute bottom-3 right-3" />

          {/* Header Banner */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border-2 border-amber-400 text-amber-900 text-xs font-black uppercase tracking-widest mb-1.5">
              <Rocket className="w-3.5 h-3.5 text-amber-600" />
              GRADE 6 DUAL 3D SPACECRAFT DUEL
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-none uppercase">
              EQUATION MISSION CONTROL
            </h1>
            <p className="text-xs md:text-sm font-bold text-slate-600 mt-1">
              Expressions, Formulae & Equations • Prepare & Launch Two 3D Rockets
            </p>
          </div>

          {/* Mission Briefing Card */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border-3 border-slate-800 mc-shadow-hard">
            <div className="flex items-center gap-2 mb-1 text-xs font-black uppercase tracking-wider text-slate-700">
              <Radio className="w-4 h-4 text-blue-600" />
              DUAL LAUNCH DIRECTIVE • {campaign.title}
            </div>
            <p className="text-xs md:text-sm font-semibold text-slate-600 leading-relaxed">
              Two engineering teams prepare two real 3D spacecraft simultaneously on the launchpad.
              Correct mathematics physically builds your rocket:
              <span className="font-bold text-slate-900"> Structure</span>, 
              <span className="font-bold text-slate-900"> Cryo Fuel</span>, 
              <span className="font-bold text-slate-900"> Engine Balance</span>, 
              <span className="font-bold text-slate-900"> Guidance</span>, and 
              <span className="font-bold text-slate-900"> Final Liftoff</span>.
            </p>
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
            className="w-full h-15 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:brightness-105 text-slate-950 font-black text-lg uppercase tracking-wider border-4 border-slate-900 mc-shadow-hard mc-pressable flex items-center justify-center gap-3"
          >
            <Play className="w-5 h-5 fill-slate-950" />
            INITIALIZE DUAL LAUNCH SYSTEMS
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
      <Zap className="w-5 h-5 text-amber-500" key="1" />,
      <Flame className="w-5 h-5 text-amber-500" key="2" />,
      <Scale className="w-5 h-5 text-emerald-500" key="3" />,
      <Gauge className="w-5 h-5 text-cyan-500" key="4" />,
      <Rocket className="w-5 h-5 text-red-500" key="5" />,
    ];

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 select-none">
        <div className="w-full max-w-xl bg-white rounded-3xl border-4 border-slate-900 mc-shadow-hard-xl p-6 flex flex-col gap-3.5 relative animate-in fade-in zoom-in-95 duration-200">
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
            <div className="text-xs font-bold text-slate-500 mt-0.5">
              {challenge.stageSubtitle}
            </div>
          </div>

          {/* Mathematical Prompt Card */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border-3 border-amber-400 mc-shadow-hard">
            <div className="text-[9px] font-black uppercase tracking-wider text-amber-900 mb-1">
              OPERATIONAL MISSION DIRECTIVE:
            </div>
            <div className="text-sm md:text-base font-black text-slate-900 leading-snug">
              {challenge.briefingPrompt}
            </div>
          </div>

          <div className="text-xs font-semibold text-slate-600 bg-slate-100 p-2.5 rounded-xl border border-slate-300">
            💡 <span className="font-bold text-slate-900">Engineering Guidance:</span> {challenge.hint}
          </div>

          <button
            onClick={() => {
              soundManager.play('click');
              beginActiveMission();
            }}
            className="w-full h-13 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 text-white font-black text-sm uppercase tracking-wider border-3 border-slate-900 mc-shadow-hard mc-pressable flex items-center justify-center gap-2"
          >
            ENGAGE STAGE CONTROLS
            <ArrowRight className="w-4 h-4" />
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

          <div className="flex items-center justify-between border-b-2 border-slate-200 pb-2.5">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <div>
                <h3 className="text-base font-black text-slate-900 uppercase">
                  STAGE 0{currentStage + 1} COMPLETE
                </h3>
                <span className="text-[10px] font-bold text-slate-500">
                  MATHEMATICAL TELEMETRY CONFIRMED
                </span>
              </div>
            </div>

            <span className="text-[11px] font-black text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
              SYSTEM READY ✓
            </span>
          </div>

          {/* Educational Proof */}
          <div className="p-3.5 rounded-2xl bg-slate-900 text-white border-2 border-slate-800 flex flex-col gap-1.5">
            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">
              ALGEBRAIC PROOF:
            </span>
            <div className="text-xs font-mono font-bold leading-relaxed text-slate-200">
              {challenge.educationalTakeaway}
            </div>
          </div>

          {/* Dual Rocket Status Comparison */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-blue-50 border-2 border-blue-400 flex items-center justify-between">
              <div>
                <div className="text-[9px] font-black text-blue-800 uppercase">{blueTeam.name}</div>
                <div className="text-base font-black text-slate-900">{blueTeam.score} PTS</div>
                <div className="text-[9px] font-bold text-blue-700">
                  {blueShip.stage1StructureDone && 'Structure ✓ '}
                  {blueShip.stage2FuelDone && 'Fuel ✓ '}
                  {blueShip.stage3EngineDone && 'Engines ✓ '}
                  {blueShip.stage4NavDone && 'Nav ✓ '}
                  {blueShip.stage5Armed && 'Armed ✓ '}
                </div>
              </div>
              <span className="text-lg">🛰️</span>
            </div>

            <div className="p-3 rounded-xl bg-red-50 border-2 border-red-400 flex items-center justify-between">
              <div>
                <div className="text-[9px] font-black text-red-800 uppercase">{redTeam.name}</div>
                <div className="text-base font-black text-slate-900">{redTeam.score} PTS</div>
                <div className="text-[9px] font-bold text-red-700">
                  {redShip.stage1StructureDone && 'Structure ✓ '}
                  {redShip.stage2FuelDone && 'Fuel ✓ '}
                  {redShip.stage3EngineDone && 'Engines ✓ '}
                  {redShip.stage4NavDone && 'Nav ✓ '}
                  {redShip.stage5Armed && 'Armed ✓ '}
                </div>
              </div>
              <span className="text-lg">🚀</span>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.play('powerup');
              advanceToNextStage();
            }}
            className="w-full h-13 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:brightness-105 text-slate-950 font-black text-sm uppercase tracking-wider border-3 border-slate-900 mc-shadow-hard mc-pressable flex items-center justify-center gap-2"
          >
            {currentStage >= 4 ? 'INITIATE FINAL LAUNCH SEQUENCE' : 'ADVANCE TO NEXT STAGE'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // 4. 12-STEP LAUNCH CINEMATIC TELEMETRY BANNER
  // --------------------------------------------------------------------------
  if (phase === 'launch-cinematic') {
    const heroShip = winner === 'red' ? redShip : blueShip;
    const heroName = winner === 'red' ? redTeam.name : blueTeam.name;

    const launchStepTitles: Record<string, string> = {
      arming: 'LAUNCH SYSTEMS ARMED — WORKERS TO SAFETY PERIMETER',
      'hazard-lights': 'SAFETY WARNING ROTATING BEACONS ACTIVE',
      'umbilical-retract': 'SERVICE GANTRY UMBILICALS RETRACTING',
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

    const currentTitle = launchStepTitles[heroShip.launchStage] || 'LIFTOFF IN PROGRESS';

    return (
      <div className="fixed top-18 left-1/2 -translate-x-1/2 z-40 pointer-events-none select-none">
        <div className="px-5 py-2.5 rounded-2xl bg-slate-900/90 text-white border-3 border-amber-400 mc-shadow-hard flex items-center gap-3 animate-pulse">
          <Rocket className="w-5 h-5 text-amber-400 animate-bounce" />
          <div>
            <div className="text-[9px] font-black uppercase tracking-widest text-amber-400">
              {heroName} FLIGHT TELEMETRY:
            </div>
            <div className="text-sm font-black tracking-wide font-mono">
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

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 select-none animate-in fade-in zoom-in-95 duration-300">
        <div className="w-full max-w-2xl bg-white rounded-3xl border-4 border-slate-900 mc-shadow-hard-xl p-6 md:p-8 flex flex-col gap-4 relative">
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

          {/* Winner Plaque with Team Flag Identity */}
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
              <Trophy className="w-7 h-7 text-amber-500" />
              <div>
                <div className="text-[9px] font-black uppercase tracking-wider">
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

          {/* Scoreboard Comparison */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-blue-50 border-2 border-blue-400">
              <div className="text-xs font-black text-blue-900 uppercase">{blueTeam.name}</div>
              <div className="text-xl font-black text-slate-900 mt-0.5">{blueTeam.score} PTS</div>
              <div className="text-[10px] font-bold text-blue-700 mt-0.5">
                Stages Cleared: {blueTeam.stagesCleared}/5
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-red-50 border-2 border-red-400">
              <div className="text-xs font-black text-red-900 uppercase">{redTeam.name}</div>
              <div className="text-xl font-black text-slate-900 mt-0.5">{redTeam.score} PTS</div>
              <div className="text-[10px] font-bold text-red-700 mt-0.5">
                Stages Cleared: {redTeam.stagesCleared}/5
              </div>
            </div>
          </div>

          {/* Replay Button */}
          <button
            onClick={() => {
              soundManager.play('powerup');
              startGame();
            }}
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:brightness-105 text-slate-950 font-black text-sm uppercase tracking-wider border-3 border-slate-900 mc-shadow-hard mc-pressable flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
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
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none select-none">
        <div className="px-4 py-2 rounded-xl bg-slate-900 text-white border-2 border-amber-400 mc-shadow-hard flex items-center gap-2 animate-bounce">
          <span className="text-sm">🚀</span>
          <span className="text-xs font-black uppercase tracking-wider">{toast}</span>
        </div>
      </div>
    );
  }

  return null;
};
