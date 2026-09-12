// ============================================================
// PATTERN RACERS — Independent Team Console Panel
// Simultaneous Dual-Touch Mechanical Formula Control Consoles:
// - Stages 1-4: Tactile Sequence Dials, Builders, Function Calculators & Operator Wheels
// - Stage 5: Live Formula 1 Cockpit Interface (Throttle Paddle, Nitro Boost & Steering)
// - Integrated PowerUpTray (50:50, Time Freeze, 2x Boost) & DigitalScratchpad
// ============================================================

'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePatternStore } from '../store/patternStore';
import { TeamId } from '../types';
import { PowerUpTray } from '@/components/shared/PowerUpTray';
import { DigitalScratchpad } from '@/components/shared/DigitalScratchpad';
import {
  CheckCircle2,
  Flame,
  Lightbulb,
  Zap,
  ArrowLeft,
  ArrowRight,
  Gauge,
  Flag,
} from 'lucide-react';

interface Props {
  teamId: TeamId;
}

export const TeamConsolePanel: React.FC<Props> = ({ teamId }) => {
  const currentRound = usePatternStore((s) => s.currentRound);
  const phase = usePatternStore((s) => s.phase);
  const activeChallenge = usePatternStore((s) => s.activeChallenge);
  const timeRemaining = usePatternStore((s) => s.timeRemaining);

  const team = usePatternStore((s) => (teamId === 'blue' ? s.blueTeam : s.redTeam));
  const opponent = usePatternStore((s) => (teamId === 'blue' ? s.redTeam : s.blueTeam));

  // Store actions
  const updateBlueStep = usePatternStore((s) => s.updateBlueStep);
  const updateRedStep = usePatternStore((s) => s.updateRedStep);
  const updateBlueBuilder = usePatternStore((s) => s.updateBlueBuilder);
  const updateRedBuilder = usePatternStore((s) => s.updateRedBuilder);
  const updateBlueOutput = usePatternStore((s) => s.updateBlueOutput);
  const updateRedOutput = usePatternStore((s) => s.updateRedOutput);
  const updateBlueOperator = usePatternStore((s) => s.updateBlueOperator);
  const updateRedOperator = usePatternStore((s) => s.updateRedOperator);
  const updateBlueHybrid = usePatternStore((s) => s.updateBlueHybrid);
  const updateRedHybrid = usePatternStore((s) => s.updateRedHybrid);

  // Live racing cockpit actions
  const pressThrottle = usePatternStore((s) => s.pressThrottle);
  const releaseThrottle = usePatternStore((s) => s.releaseThrottle);
  const triggerNitro = usePatternStore((s) => s.triggerNitro);
  const switchLane = usePatternStore((s) => s.switchLane);

  const submitAnswer = usePatternStore((s) => s.submitAnswer);
  const usePowerUp5050 = usePatternStore((s) => s.usePowerUp5050);
  const usePowerUpTimeFreeze = usePatternStore((s) => s.usePowerUpTimeFreeze);
  const usePowerUp2x = usePatternStore((s) => s.usePowerUp2x);

  const isBlue = teamId === 'blue';
  const isSurging = opponent.score - team.score >= 150;
  const isLiveRace = phase === 'grand_prix_race';

  // Step choices for Round 1
  const STEP_CHOICES = [-8, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8, 10];
  const OPERATORS: ('+' | '-' | '×' | '÷')[] = ['+', '-', '×', '÷'];

  return (
    <div className="w-full h-full flex flex-col justify-between p-2 sm:p-2.5 bg-slate-100 border-2 border-slate-300 select-none overflow-y-auto">
      {/* ── 1. CONSOLE TOP HEADER (Team Badge, Score & Timer) ── */}
      <div
        className={`p-2.5 rounded-xl border-3 border-slate-900 shadow-sm flex items-center justify-between text-white ${
          isBlue ? 'bg-blue-600' : 'bg-red-600'
        }`}
      >
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-80">
              {isBlue ? 'CONSOLE #01' : 'CONSOLE #02'}
            </span>
            <span className="px-1.5 py-0.2 bg-black/40 rounded text-[9px] font-mono font-bold">
              ⏱️ {timeRemaining}s
            </span>
          </div>
          <h3 className="text-base font-black uppercase tracking-tight">{team.name}</h3>
        </div>
        <div className="px-3 py-1 bg-white text-slate-950 rounded-lg border-2 border-slate-900 font-mono font-black text-sm shadow-[2px_2px_0px_#000000]">
          {team.score} PTS
        </div>
      </div>

      {/* ── 2. STAGE BADGE ── */}
      <div className="my-1 px-2 py-1 bg-slate-900 text-yellow-300 rounded-lg border border-slate-800 flex items-center justify-between text-[10px] font-black uppercase">
        <span>
          {currentRound === 1 && 'STAGE 1: 🔍 DIAGNOSTICS & TELEMETRY'}
          {currentRound === 2 && 'STAGE 2: 🔧 HYDRAULIC TIRE CHANGE'}
          {currentRound === 3 && 'STAGE 3: 🚀 FACTORY ROLLOUT'}
          {currentRound === 4 && 'STAGE 4: 🏁 STARTING GRID STAGING'}
          {currentRound === 5 && 'STAGE 5: 🏎️ GRAND PRIX RACE DUEL!'}
        </span>
        <span className="text-slate-400">{currentRound}/5</span>
      </div>

      {/* ── 3. COMEBACK SURGE BADGE ── */}
      {isSurging && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="my-0.5 p-1 bg-amber-400 border-2 border-black rounded-lg text-slate-950 font-black text-[10px] flex items-center justify-center gap-1 shadow-[2px_2px_0px_#000000]"
        >
          <Flame className="w-3.5 h-3.5 fill-red-600 text-red-600 animate-bounce" />
          <span>COMEBACK SURGE ACTIVE (+25% PTS)</span>
        </motion.div>
      )}

      {/* ── 4. STAGE 5: LIVE FORMULA 1 RACING COCKPIT INTERFACE ── */}
      {isLiveRace ? (
        <div className="my-1 p-2.5 bg-slate-950 rounded-2xl border-3 border-slate-800 text-white flex flex-col gap-2 shadow-inner">
          {/* Live Speedometer & RPM Gauges */}
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[9px] font-black uppercase text-slate-400 block">SPEED</span>
              <span className="text-2xl font-mono font-black text-amber-400">
                {team.raceControls.speedKmh} <span className="text-xs text-white">KM/H</span>
              </span>
            </div>
            <div className="text-right">
              <span className="text-[9px] font-black uppercase text-slate-400 block">DISTANCE</span>
              <span className="text-lg font-mono font-black text-sky-400">
                {team.raceControls.distanceCovered}M <span className="text-xs text-slate-400">/ 500M</span>
              </span>
            </div>
          </div>

          {/* Distance to Finish Progress Bar */}
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700">
            <div
              className="bg-emerald-400 h-full transition-all duration-100"
              style={{ width: `${(team.raceControls.distanceCovered / 500) * 100}%` }}
            />
          </div>

          {/* Nitro Fuel Bar */}
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
            <span>⚡ NITRO LEVEL:</span>
            <span className="text-amber-400 font-mono font-black">{team.raceControls.nitroRemaining}%</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700">
            <div
              className="bg-amber-400 h-full transition-all duration-200"
              style={{ width: `${team.raceControls.nitroRemaining}%` }}
            />
          </div>

          {/* ── COCKPIT INTERACTIVE CONTROLS ── */}
          {/* Big Gas / Throttle Pedal */}
          <button
            onPointerDown={() => pressThrottle(teamId)}
            onPointerUp={() => releaseThrottle(teamId)}
            className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 border-3 border-emerald-400 text-white font-black text-sm uppercase tracking-wider shadow-[3px_3px_0px_#000000] flex items-center justify-center gap-2 cursor-pointer transition active:scale-95"
          >
            <Gauge className="w-5 h-5" />
            <span>HOLD / TAP THROTTLE 🏎️</span>
          </button>

          {/* Nitro Boost Button */}
          <button
            onClick={() => triggerNitro(teamId)}
            disabled={team.raceControls.nitroRemaining <= 0}
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 disabled:opacity-40 border-2 border-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition active:scale-95"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            <span>NITRO SUPERCHARGER BOOST!</span>
          </button>

          {/* Lane Switch Steering Controls */}
          <div className="grid grid-cols-2 gap-2 mt-1">
            <button
              onClick={() => switchLane(teamId, 'left')}
              className="py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-black text-xs flex items-center justify-center gap-1 cursor-pointer border border-slate-700"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>STEER LEFT</span>
            </button>
            <button
              onClick={() => switchLane(teamId, 'right')}
              className="py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-black text-xs flex items-center justify-center gap-1 cursor-pointer border border-slate-700"
            >
              <span>STEER RIGHT</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* ── STAGES 1-4: MATHEMATICAL MANIPULATION CONSOLE ── */
        <>
          {/* Blueprint Card */}
          <div className="my-1 p-2 bg-white rounded-xl border-2 border-slate-300 shadow-sm flex flex-col gap-1">
            <div className="flex items-center justify-between text-[10px] font-black uppercase text-slate-500">
              <span>{activeChallenge.difficulty.toUpperCase()}</span>
              <span className="px-1.5 py-0.2 bg-slate-100 rounded text-[9px] border border-slate-200">
                {team.attemptsLeft} TRIES LEFT
              </span>
            </div>

            <h4 className="text-xs font-black text-slate-900 leading-tight">
              {activeChallenge.title}
            </h4>

            {/* Sequence Display */}
            {activeChallenge.sequence && (
              <div className="my-1 p-1.5 rounded-lg bg-slate-900 text-yellow-300 border-2 border-slate-800 flex items-center justify-center gap-1.5 font-mono font-black text-xs">
                {activeChallenge.sequence.slice(0, 4).map((num, i) => (
                  <React.Fragment key={`seq-${i}`}>
                    <span>{num}</span>
                    <span className="text-slate-500">→</span>
                  </React.Fragment>
                ))}
                <span className="px-1.5 py-0.5 bg-yellow-400 text-black rounded font-black text-xs animate-pulse">
                  ?
                </span>
              </div>
            )}

            {/* Function In/Out Display */}
            {currentRound >= 3 && activeChallenge.functionInput !== undefined && (
              <div className="my-1 p-1.5 rounded-lg bg-slate-900 text-white border-2 border-slate-800 flex items-center justify-center gap-2 font-mono font-black text-xs">
                <span className="text-emerald-400">IN: [{activeChallenge.functionInput}]</span>
                <span className="text-slate-500">→</span>
                <span className="text-yellow-300">
                  {currentRound === 4 ? '[ ? ]' : `[${activeChallenge.ruleDescription}]`}
                </span>
                <span className="text-slate-500">→</span>
                <span className="text-sky-400">
                  OUT: [{activeChallenge.functionOutput ?? '?'}]
                </span>
              </div>
            )}
          </div>

          {/* Controls Container */}
          <div className="my-1 p-2 bg-white rounded-xl border-2 border-slate-300 shadow-sm flex-1 flex flex-col justify-center">
            {/* Round 1: Step Dial */}
            {currentRound === 1 && (
              <div className="flex flex-col gap-1.5">
                <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[9px] font-bold text-slate-500 block">SELECTED STEP</span>
                  <span className="text-lg font-mono font-black text-blue-600">
                    {team.selectedStep > 0 ? `+${team.selectedStep}` : team.selectedStep}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1">
                  {STEP_CHOICES.map((st) => {
                    const isEliminated = team.eliminatedOptions.includes(String(st)) || team.eliminatedOptions.includes(st > 0 ? `+${st}` : `${st}`);
                    if (isEliminated) return null;

                    return (
                      <button
                        key={`st-${st}`}
                        onClick={() => isBlue ? updateBlueStep(st) : updateRedStep(st)}
                        disabled={team.isLocked}
                        className={`py-1.5 rounded-lg border-2 font-mono font-black text-xs transition cursor-pointer ${
                          team.selectedStep === st
                            ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                            : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-blue-50'
                        }`}
                      >
                        {st > 0 ? `+${st}` : st}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Round 2: Builder */}
            {currentRound === 2 && (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-1 text-xs font-bold">
                  <span className="text-slate-600">START:</span>
                  <span className="font-mono font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                    {team.builderStart}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="80"
                  step="1"
                  value={team.builderStart}
                  disabled={team.isLocked}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (isBlue) updateBlueBuilder(val, team.builderStep, team.builderDirection);
                    else updateRedBuilder(val, team.builderStep, team.builderDirection);
                  }}
                  className="w-full accent-blue-600 cursor-pointer"
                />

                <div className="flex items-center justify-between gap-1 text-xs font-bold mt-1">
                  <span className="text-slate-600">STEP:</span>
                  <span className="font-mono font-black text-blue-600">
                    {team.builderStep > 0 ? `+${team.builderStep}` : team.builderStep}
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-1">
                  {[-8, -5, -4, -3, 3, 4, 5, 6, 7, 10].map((st) => (
                    <button
                      key={`b-step-${st}`}
                      onClick={() => {
                        if (isBlue) updateBlueBuilder(team.builderStart, st, st > 0 ? 'increasing' : 'decreasing');
                        else updateRedBuilder(team.builderStart, st, st > 0 ? 'increasing' : 'decreasing');
                      }}
                      disabled={team.isLocked}
                      className={`py-1 rounded-md border font-mono font-black text-[11px] cursor-pointer ${
                        team.builderStep === st
                          ? 'bg-blue-600 text-white border-blue-700'
                          : 'bg-slate-100 text-slate-700 border-slate-300'
                      }`}
                    >
                      {st > 0 ? `+${st}` : st}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Round 3: Output Dial */}
            {currentRound === 3 && (
              <div className="flex flex-col gap-1.5">
                <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[9px] font-bold text-slate-500 block">COMPUTED OUTPUT</span>
                  <span className="text-xl font-mono font-black text-emerald-600">
                    {team.computedOutput}
                  </span>
                </div>
                <div className="flex items-center justify-center gap-1.5">
                  {[-5, -1, +1, +5].map((delta) => (
                    <button
                      key={`out-delta-${delta}`}
                      onClick={() => {
                        const nextVal = Math.max(1, team.computedOutput + delta);
                        if (isBlue) updateBlueOutput(nextVal);
                        else updateRedOutput(nextVal);
                      }}
                      disabled={team.isLocked}
                      className="py-1 px-2.5 rounded-lg bg-slate-200 hover:bg-slate-300 font-black text-xs cursor-pointer"
                    >
                      {delta > 0 ? `+${delta}` : delta}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Round 4: Operator Wheel */}
            {currentRound === 4 && (
              <div className="flex flex-col gap-1.5">
                <span className="text-[9px] font-bold text-slate-500">OPERATOR:</span>
                <div className="grid grid-cols-4 gap-1">
                  {OPERATORS.map((op) => (
                    <button
                      key={`op-${op}`}
                      onClick={() => isBlue ? updateBlueOperator(op, team.selectedOperand) : updateRedOperator(op, team.selectedOperand)}
                      disabled={team.isLocked}
                      className={`py-1.5 rounded-lg border-2 font-mono font-black text-sm cursor-pointer ${
                        team.selectedOperator === op
                          ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-sm'
                          : 'bg-slate-100 text-slate-700 border-slate-300'
                      }`}
                    >
                      {op}
                    </button>
                  ))}
                </div>

                <span className="text-[9px] font-bold text-slate-500 mt-0.5">VALUE: [{team.selectedOperand}]</span>
                <div className="grid grid-cols-5 gap-1">
                  {[2, 3, 4, 5, 6, 7, 8, 9, 10, 12].map((num) => (
                    <button
                      key={`val-${num}`}
                      onClick={() => isBlue ? updateBlueOperator(team.selectedOperator, num) : updateRedOperator(team.selectedOperator, num)}
                      disabled={team.isLocked}
                      className={`py-1 rounded-md border font-mono font-black text-xs cursor-pointer ${
                        team.selectedOperand === num
                          ? 'bg-blue-600 text-white border-blue-700'
                          : 'bg-slate-100 text-slate-700 border-slate-300'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Round 5: Hybrid */}
            {currentRound === 5 && (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>STEP: [{team.hybridStep > 0 ? `+${team.hybridStep}` : team.hybridStep}]</span>
                  <span>OUT: [{team.hybridOutput}]</span>
                </div>
                <div className="grid grid-cols-4 gap-1">
                  {[-8, -5, -3, 3, 4, 5, 6, 7].map((st) => (
                    <button
                      key={`h-step-${st}`}
                      onClick={() => isBlue ? updateBlueHybrid(st, team.hybridOutput) : updateRedHybrid(st, team.hybridOutput)}
                      disabled={team.isLocked}
                      className={`py-1 rounded border font-mono font-black text-[10px] cursor-pointer ${
                        team.hybridStep === st ? 'bg-blue-600 text-white' : 'bg-slate-100'
                      }`}
                    >
                      {st > 0 ? `+${st}` : st}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-center gap-1 mt-0.5">
                  {[-5, -1, +1, +5].map((delta) => (
                    <button
                      key={`hy-delta-${delta}`}
                      onClick={() => {
                        const nextVal = Math.max(1, team.hybridOutput + delta);
                        if (isBlue) updateBlueHybrid(team.hybridStep, nextVal);
                        else updateRedHybrid(team.hybridStep, nextVal);
                      }}
                      disabled={team.isLocked}
                      className="py-0.5 px-2 rounded bg-slate-200 font-black text-[10px] cursor-pointer"
                    >
                      {delta > 0 ? `+${delta}` : delta}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Feedback & Misconceptions */}
          {team.lastFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className={`my-1 p-1.5 rounded-lg border-2 text-[10px] font-bold ${
                team.isCorrect === true
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-950'
                  : team.isCorrect === false
                    ? 'bg-red-50 border-red-500 text-red-950'
                    : 'bg-amber-50 border-amber-400 text-amber-950'
              }`}
            >
              {team.lastFeedback}
            </motion.div>
          )}

          {team.activeMisconception && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="my-1 p-1.5 bg-yellow-50 border-2 border-yellow-400 rounded-lg text-[10px] font-bold text-amber-900 flex items-start gap-1 shadow-sm"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <span>{team.activeMisconception}</span>
            </motion.div>
          )}

          {/* Submit Action Button */}
          <button
            onClick={() => submitAnswer(teamId)}
            disabled={team.isLocked || team.hasSubmitted}
            className={`w-full py-3 rounded-xl border-3 border-slate-900 font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_#000000] flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer ${
              team.hasSubmitted
                ? team.isCorrect
                  ? 'bg-emerald-500 text-white'
                  : 'bg-red-500 text-white'
                : isBlue
                  ? 'bg-blue-600 hover:bg-blue-500 text-white'
                  : 'bg-red-600 hover:bg-red-500 text-white'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>
              {team.hasSubmitted
                ? team.isCorrect
                  ? 'SYSTEM CALIBRATED!'
                  : 'CALIBRATION LOCKED'
                : currentRound === 1
                  ? 'CONFIRM DIAGNOSTICS'
                  : currentRound === 2
                    ? 'DEPLOY TIRE CHANGE'
                    : currentRound === 3
                      ? 'ROLLOUT TO TRACK'
                      : 'STAGE AT GRID LINE'}
            </span>
          </button>
        </>
      )}

      {/* ── TACTICAL POWER-UPS & SCRATCHPAD ── */}
      <div className="mt-1 p-1 bg-white rounded-xl border-2 border-slate-300 shadow-sm">
        <PowerUpTray
          teamId={teamId}
          powerUps={team.powerUps}
          onUse5050={() => usePowerUp5050(teamId)}
          onUseTimeFreeze={() => usePowerUpTimeFreeze(teamId)}
          onUse2x={() => usePowerUp2x(teamId)}
          disabled={team.isLocked || team.hasSubmitted}
        />
      </div>

      <div className="mt-1 w-full">
        <DigitalScratchpad teamId={teamId} teamName={team.name} />
      </div>
    </div>
  );
};
