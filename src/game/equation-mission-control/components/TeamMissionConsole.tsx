// ============================================================
// EQUATION MISSION CONTROL — Team Mission Console
// Neo-Brutalist Light-Themed Aerospace Console
// Independent Simultaneous Touch Interface for Left/Right Teams
// ============================================================

'use client';

import React, { useState } from 'react';
import { useMissionControlStore } from '../store/missionControlStore';
import { TeamId } from '../types';
import {
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Zap,
  Gauge,
  Sliders,
  Scale,
  Lock,
  Rocket,
  Plus,
  Minus,
  Check,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { soundManager } from '@/utils/audio';

interface Props {
  team: TeamId;
}

export const TeamMissionConsole: React.FC<Props> = ({ team }) => {
  const isBlue = team === 'blue';
  const t = useMissionControlStore((s) => (isBlue ? s.blueTeam : s.redTeam));
  const challenge = useMissionControlStore((s) => s.activeChallenge);
  const stageIndex = useMissionControlStore((s) => s.currentStageIndex);
  const phase = useMissionControlStore((s) => s.phase);

  // Store actions
  const addToken = useMissionControlStore((s) => s.addToken);
  const removeToken = useMissionControlStore((s) => s.removeToken);
  const clearTokens = useMissionControlStore((s) => s.clearTokens);
  const submitExpression = useMissionControlStore((s) => s.submitExpression);

  const setDialValue = useMissionControlStore((s) => s.setDialValue);
  const submitVariableLoading = useMissionControlStore((s) => s.submitVariableLoading);

  const setBalanceOp = useMissionControlStore((s) => s.setBalanceOperation);
  const submitEquationBalance = useMissionControlStore((s) => s.submitEquationBalance);

  const setSpeedDial = useMissionControlStore((s) => s.setSpeedDial);
  const setTimeDial = useMissionControlStore((s) => s.setTimeDial);
  const submitNavCalibration = useMissionControlStore((s) => s.submitNavigationCalibration);

  const setLockDigits = useMissionControlStore((s) => s.setLockDigits);
  const armLaunch = useMissionControlStore((s) => s.armLaunch);

  // Local state for safety cover flip in Stage 5
  const [safetyCoverOpen, setSafetyCoverOpen] = useState<boolean>(false);

  // Styling Tokens
  const theme = isBlue
    ? {
        primary: '#1d4ed8',
        primaryDark: '#1e40af',
        border: '#2563eb',
        bgPlaque: '#eff6ff',
        bgCard: '#ffffff',
        accent: '#3b82f6',
        shadow: 'rgba(30, 58, 138, 1)',
        badge: 'bg-blue-100 text-blue-800 border-blue-300',
        activeBtn: 'bg-blue-600 hover:bg-blue-500 text-white border-blue-900',
        btnShadow: '0 4px 0 #1e3a8a',
        headerGrad: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
      }
    : {
        primary: '#b91c1c',
        primaryDark: '#991b1b',
        border: '#dc2626',
        bgPlaque: '#fef2f2',
        bgCard: '#ffffff',
        accent: '#ef4444',
        shadow: 'rgba(127, 29, 29, 1)',
        badge: 'bg-red-100 text-red-800 border-red-300',
        activeBtn: 'bg-red-600 hover:bg-red-500 text-white border-red-900',
        btnShadow: '0 4px 0 #7f1d1d',
        headerGrad: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
      };

  const isLocked = t.isLocked || phase !== 'active-mission';

  // --------------------------------------------------------------------------
  // STAGE 1: Expression Assembly
  // --------------------------------------------------------------------------
  const renderStage1 = () => {
    const data = challenge.stage1;
    if (!data) return null;

    return (
      <div className="flex flex-col gap-3">
        {/* Machine Telemetry Box */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border-2 border-slate-300 shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-500" />
              AVIONICS CODEC
            </span>
            <span className="text-[9px] font-bold text-slate-400">STAGE 01 / 05</span>
          </div>
          <div className="text-xs font-bold text-slate-700 leading-snug">
            "{data.wordDescription}"
          </div>
        </div>

        {/* Expression Assembly Slot Area */}
        <div className="p-3 rounded-2xl bg-white border-3 border-slate-800 mc-shadow-hard">
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>ASSEMBLED EXPRESSION</span>
            <span className="text-[9px] font-bold text-blue-600">
              {t.placedTokens.length} TOKENS
            </span>
          </div>

          <div className="min-h-[58px] p-2 rounded-xl bg-slate-100 border-2 border-dashed border-slate-400 flex flex-wrap items-center gap-2">
            {t.placedTokens.length === 0 ? (
              <span className="text-xs font-semibold text-slate-400 italic px-2">
                Tap tiles below to build expression...
              </span>
            ) : (
              t.placedTokens.map((tok, idx) => (
                <button
                  key={`${tok}-${idx}`}
                  disabled={isLocked}
                  onClick={() => {
                    soundManager.play('pop');
                    removeToken(team, idx);
                  }}
                  className="h-10 px-3.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm border-2 border-slate-900 mc-shadow-hard mc-pressable flex items-center gap-1.5"
                  title="Click to remove"
                >
                  <span>{tok}</span>
                  <span className="text-[10px] text-amber-800">✕</span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Available Physical Tile Rack */}
        <div>
          <div className="flex items-center justify-between mb-1.5 px-1">
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-wider">
              ALGEBRAIC TILE RACK
            </span>
            <button
              disabled={isLocked || t.placedTokens.length === 0}
              onClick={() => {
                soundManager.play('click');
                clearTokens(team);
              }}
              className="text-[10px] font-bold text-red-600 hover:text-red-700 underline flex items-center gap-0.5 disabled:opacity-40"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              CLEAR
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {data.availableTiles.map((tile, i) => (
              <button
                key={`${tile}-${i}`}
                disabled={isLocked}
                onClick={() => {
                  soundManager.play('tap');
                  addToken(team, tile);
                }}
                className="h-14 rounded-xl bg-slate-100 hover:bg-white text-slate-900 font-black text-base border-2.5 border-slate-800 mc-shadow-hard mc-pressable flex items-center justify-center disabled:opacity-50"
              >
                {tile}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          disabled={isLocked || t.placedTokens.length === 0}
          onClick={() => {
            soundManager.play('lock');
            submitExpression(team);
          }}
          className="w-full h-14 mt-1 rounded-2xl text-white font-black text-sm uppercase tracking-wider border-3 border-slate-900 mc-shadow-hard mc-pressable flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: theme.headerGrad }}
        >
          <Check className="w-5 h-5 stroke-[3]" />
          LOCK CONFIGURATION
        </button>
      </div>
    );
  };

  // --------------------------------------------------------------------------
  // STAGE 2: Variable Loading (Substitution)
  // --------------------------------------------------------------------------
  const renderStage2 = () => {
    const data = challenge.stage2;
    if (!data) return null;

    const val = t.dialValue;
    // Live calculation for preview
    const calculated = data.formula.includes('×') || data.formula.includes('x')
      ? val * 3 // general visual representation
      : val;

    return (
      <div className="flex flex-col gap-3">
        {/* Formula Target Header */}
        <div className="p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-300 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-black tracking-widest text-amber-700 uppercase flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-600" />
              CRYOGENIC FUEL FORMULA
            </span>
            <span className="text-[9px] font-bold text-amber-600">STAGE 02 / 05</span>
          </div>
          <div className="text-base font-black text-slate-900 tracking-wide font-mono">
            {data.formula}
          </div>
          <div className="text-xs font-bold text-amber-800 mt-1">
            Required Parameter: <span className="font-mono underline">{data.variableName} = {data.variableValue}</span>
          </div>
        </div>

        {/* Variable Rotary Dial / Stepper Console */}
        <div className="p-3.5 rounded-2xl bg-white border-3 border-slate-800 mc-shadow-hard">
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>ROTARY VARIABLE DIAL</span>
            <span className="text-[10px] font-black text-blue-600 font-mono">VARIABLE {data.variableName}</span>
          </div>

          <div className="flex items-center justify-center gap-3 my-2">
            <button
              disabled={isLocked || val <= 0}
              onClick={() => {
                soundManager.play('click');
                setDialValue(team, Math.max(0, val - 1));
              }}
              className="w-14 h-14 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-black text-xl border-2 border-slate-800 mc-shadow-hard mc-pressable flex items-center justify-center disabled:opacity-40"
            >
              <Minus className="w-6 h-6 stroke-[3]" />
            </button>

            <div className="w-28 h-18 rounded-2xl bg-slate-900 border-3 border-slate-800 flex flex-col items-center justify-center shadow-inner">
              <span className="text-[9px] font-bold text-emerald-400 tracking-wider">VALUE</span>
              <span className="text-3xl font-black text-white font-mono">{val}</span>
            </div>

            <button
              disabled={isLocked || val >= 30}
              onClick={() => {
                soundManager.play('click');
                setDialValue(team, Math.min(30, val + 1));
              }}
              className="w-14 h-14 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-black text-xl border-2 border-slate-800 mc-shadow-hard mc-pressable flex items-center justify-center disabled:opacity-40"
            >
              <Plus className="w-6 h-6 stroke-[3]" />
            </button>
          </div>

          {/* Quick Presets for Rapid Touch */}
          <div className="grid grid-cols-4 gap-1.5 mt-3 pt-2 border-t border-slate-200">
            {[data.variableValue - 2, data.variableValue - 1, data.variableValue, data.variableValue + 2]
              .filter((v) => v >= 0)
              .slice(0, 4)
              .map((preset) => (
                <button
                  key={preset}
                  disabled={isLocked}
                  onClick={() => {
                    soundManager.play('tap');
                    setDialValue(team, preset);
                  }}
                  className={`h-9 rounded-lg font-bold text-xs border-2 mc-pressable transition-all ${
                    val === preset
                      ? 'bg-amber-400 text-slate-950 border-slate-900 font-black'
                      : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {data.variableName} = {preset}
                </button>
              ))}
          </div>
        </div>

        {/* Live Mechanical Substitution Flow */}
        <div className="p-3 rounded-xl bg-slate-100 border-2 border-slate-300">
          <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">
            SUBSTITUTION COMPUTATION
          </div>
          <div className="flex items-center justify-between text-xs font-bold font-mono text-slate-800">
            <span>{data.variableName} = {val}</span>
            <span className="text-slate-400">➜</span>
            <span>Target: {data.targetResult} Units</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          disabled={isLocked}
          onClick={() => {
            soundManager.play('laser');
            submitVariableLoading(team);
          }}
          className="w-full h-14 rounded-2xl text-white font-black text-sm uppercase tracking-wider border-3 border-slate-900 mc-shadow-hard mc-pressable flex items-center justify-center gap-2 disabled:opacity-40"
          style={{ background: theme.headerGrad }}
        >
          <Flame className="w-5 h-5 fill-amber-300 text-amber-300" />
          ENGAGE FUEL INJECTOR
        </button>
      </div>
    );
  };

  // --------------------------------------------------------------------------
  // STAGE 3: Equation Balance
  // --------------------------------------------------------------------------
  const renderStage3 = () => {
    const data = challenge.stage3;
    if (!data) return null;

    const op = t.selectedBalanceOp;
    const val = t.selectedBalanceVal;

    return (
      <div className="flex flex-col gap-3">
        {/* Equation Objective Banner */}
        <div className="p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-black tracking-widest text-emerald-700 uppercase flex items-center gap-1">
              <Scale className="w-3 h-3 text-emerald-600" />
              MECHANICAL BALANCE BEAM
            </span>
            <span className="text-[9px] font-bold text-emerald-600">STAGE 03 / 05</span>
          </div>
          <div className="text-base font-black text-slate-900 tracking-wide font-mono">
            {data.equationDisplay}
          </div>
          <div className="text-xs font-semibold text-emerald-800 mt-0.5">
            Apply inverse operation to both balance pans!
          </div>
        </div>

        {/* Operation Selection Panel */}
        <div className="p-3.5 rounded-2xl bg-white border-3 border-slate-800 mc-shadow-hard">
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">
            1. SELECT INVERSE OPERATION
          </div>
          <div className="grid grid-cols-4 gap-2 mb-3">
            {(['+', '-', '×', '÷'] as const).map((operation) => (
              <button
                key={operation}
                disabled={isLocked}
                onClick={() => {
                  soundManager.play('click');
                  setBalanceOp(team, operation, val);
                }}
                className={`h-12 rounded-xl text-lg font-black border-2 mc-shadow-hard mc-pressable flex items-center justify-center transition-all ${
                  op === operation
                    ? 'bg-amber-400 text-slate-950 border-slate-900 scale-105'
                    : 'bg-slate-100 text-slate-700 border-slate-400 hover:bg-slate-200'
                }`}
              >
                {operation}
              </button>
            ))}
          </div>

          <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">
            2. SET OPERAND VALUE
          </div>
          <div className="flex items-center justify-center gap-3">
            <button
              disabled={isLocked || val <= 1}
              onClick={() => {
                soundManager.play('click');
                setBalanceOp(team, op, Math.max(1, val - 1));
              }}
              className="w-12 h-12 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-black text-lg border-2 border-slate-800 mc-shadow-hard mc-pressable flex items-center justify-center disabled:opacity-40"
            >
              <Minus className="w-5 h-5 stroke-[3]" />
            </button>

            <div className="w-24 h-14 rounded-xl bg-slate-900 border-2 border-slate-800 flex items-center justify-center">
              <span className="text-2xl font-black text-amber-400 font-mono">
                {op} {val}
              </span>
            </div>

            <button
              disabled={isLocked || val >= 25}
              onClick={() => {
                soundManager.play('click');
                setBalanceOp(team, op, Math.min(25, val + 1));
              }}
              className="w-12 h-12 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-black text-lg border-2 border-slate-800 mc-shadow-hard mc-pressable flex items-center justify-center disabled:opacity-40"
            >
              <Plus className="w-5 h-5 stroke-[3]" />
            </button>
          </div>
        </div>

        {/* Live Equation Transformation Preview */}
        <div className="p-3 rounded-xl bg-slate-100 border-2 border-slate-300">
          <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">
            BALANCE SCALE STATUS
          </div>
          <div className="text-xs font-bold font-mono text-slate-800 flex items-center justify-between">
            <span>L: {data.initialLeftDisplay} ({op}{val})</span>
            <span className="text-slate-400">═</span>
            <span>R: {data.initialRightValue} ({op}{val})</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          disabled={isLocked}
          onClick={() => {
            soundManager.play('powerup');
            submitEquationBalance(team);
          }}
          className="w-full h-14 rounded-2xl text-white font-black text-sm uppercase tracking-wider border-3 border-slate-900 mc-shadow-hard mc-pressable flex items-center justify-center gap-2 disabled:opacity-40"
          style={{ background: theme.headerGrad }}
        >
          <Scale className="w-5 h-5" />
          LOCK ENGINE BALANCE
        </button>
      </div>
    );
  };

  // --------------------------------------------------------------------------
  // STAGE 4: Launch Calibration (Formulae)
  // --------------------------------------------------------------------------
  const renderStage4 = () => {
    const data = challenge.stage4;
    if (!data) return null;

    const speed = t.speedDial;
    const time = t.timeDial;
    const calculatedDist = speed * time;

    return (
      <div className="flex flex-col gap-3">
        {/* Formula Header */}
        <div className="p-3.5 rounded-2xl bg-cyan-50 border-2 border-cyan-300 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-black tracking-widest text-cyan-800 uppercase flex items-center gap-1">
              <Gauge className="w-3 h-3 text-cyan-600" />
              FLIGHT PATH FORMULA
            </span>
            <span className="text-[9px] font-bold text-cyan-700">STAGE 04 / 05</span>
          </div>
          <div className="text-base font-black text-slate-900 font-mono">
            D = Speed × Time
          </div>
          <div className="text-xs font-semibold text-cyan-900 mt-0.5">
            Given: Speed = <span className="font-bold font-mono">{data.speedGiven} {data.speedUnit}</span> | Time = <span className="font-bold font-mono">{data.timeGiven} {data.timeUnit}</span>
          </div>
        </div>

        {/* Calibration Dials Grid */}
        <div className="p-3.5 rounded-2xl bg-white border-3 border-slate-800 mc-shadow-hard flex flex-col gap-3">
          {/* Speed Dial */}
          <div>
            <div className="flex items-center justify-between text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">
              <span>ORBITAL SPEED (S)</span>
              <span className="text-blue-600 font-mono">{speed} {data.speedUnit}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={isLocked || speed <= 1}
                onClick={() => {
                  soundManager.play('click');
                  setSpeedDial(team, Math.max(1, speed - 1));
                }}
                className="w-10 h-10 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 font-black border-2 border-slate-800 mc-pressable flex items-center justify-center disabled:opacity-40"
              >
                <Minus className="w-4 h-4 stroke-[3]" />
              </button>
              <input
                type="range"
                min={1}
                max={30}
                value={speed}
                disabled={isLocked}
                onChange={(e) => setSpeedDial(team, parseInt(e.target.value, 10))}
                className="flex-1 h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <button
                disabled={isLocked || speed >= 30}
                onClick={() => {
                  soundManager.play('click');
                  setSpeedDial(team, Math.min(30, speed + 1));
                }}
                className="w-10 h-10 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 font-black border-2 border-slate-800 mc-pressable flex items-center justify-center disabled:opacity-40"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </div>

          {/* Time Dial */}
          <div>
            <div className="flex items-center justify-between text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">
              <span>BURN TIME (T)</span>
              <span className="text-blue-600 font-mono">{time} {data.timeUnit}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={isLocked || time <= 1}
                onClick={() => {
                  soundManager.play('click');
                  setTimeDial(team, Math.max(1, time - 1));
                }}
                className="w-10 h-10 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 font-black border-2 border-slate-800 mc-pressable flex items-center justify-center disabled:opacity-40"
              >
                <Minus className="w-4 h-4 stroke-[3]" />
              </button>
              <input
                type="range"
                min={1}
                max={15}
                value={time}
                disabled={isLocked}
                onChange={(e) => setTimeDial(team, parseInt(e.target.value, 10))}
                className="flex-1 h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
              />
              <button
                disabled={isLocked || time >= 15}
                onClick={() => {
                  soundManager.play('click');
                  setTimeDial(team, Math.min(15, time + 1));
                }}
                className="w-10 h-10 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 font-black border-2 border-slate-800 mc-pressable flex items-center justify-center disabled:opacity-40"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </div>
        </div>

        {/* Calculated Telemetry Distance */}
        <div className="p-3 rounded-xl bg-slate-900 text-white border-2 border-slate-800 flex items-center justify-between">
          <span className="text-[10px] font-black tracking-widest text-slate-400">CALCULATED DISTANCE:</span>
          <span className="text-base font-black text-cyan-400 font-mono">
            {calculatedDist} {data.distanceUnit}
          </span>
        </div>

        {/* Action Button */}
        <button
          disabled={isLocked}
          onClick={() => {
            soundManager.play('powerup');
            submitNavCalibration(team);
          }}
          className="w-full h-14 rounded-2xl text-white font-black text-sm uppercase tracking-wider border-3 border-slate-900 mc-shadow-hard mc-pressable flex items-center justify-center gap-2 disabled:opacity-40"
          style={{ background: theme.headerGrad }}
        >
          <Sliders className="w-5 h-5" />
          LOCK FLIGHT PATH
        </button>
      </div>
    );
  };

  // --------------------------------------------------------------------------
  // STAGE 5: Final Launch Equation Lock & Arming
  // --------------------------------------------------------------------------
  const renderStage5 = () => {
    const data = challenge.stage5;
    if (!data) return null;

    const d1 = t.lockDigit1;
    const d2 = t.lockDigit2;
    const currentVal = d1 * 10 + d2;

    return (
      <div className="flex flex-col gap-3">
        {/* Launch Equation Banner */}
        <div className="p-3.5 rounded-2xl bg-red-50 border-2 border-red-300 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-black tracking-widest text-red-700 uppercase flex items-center gap-1">
              <Rocket className="w-3 h-3 text-red-600" />
              FINAL LAUNCH EQUATION
            </span>
            <span className="text-[9px] font-bold text-red-600">STAGE 05 / 05</span>
          </div>
          <div className="text-lg font-black text-slate-900 font-mono tracking-wider">
            {data.equationDisplay}
          </div>
          <div className="text-xs font-bold text-red-800 mt-0.5">
            Solve for <span className="font-mono underline">x</span> to unlock final launch sequence!
          </div>
        </div>

        {/* Combination Lock Tumblers */}
        <div className="p-3.5 rounded-2xl bg-white border-3 border-slate-800 mc-shadow-hard">
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>EQUATION NUMBER LOCK</span>
            <span className="text-[10px] font-black text-red-600 font-mono">x = {currentVal}</span>
          </div>

          <div className="flex items-center justify-center gap-4 my-2">
            {/* Tens Tumbler */}
            <div className="flex flex-col items-center gap-1">
              <button
                disabled={isLocked}
                onClick={() => {
                  soundManager.play('click');
                  setLockDigits(team, (d1 + 1) % 10, d2);
                }}
                className="w-12 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 border-2 border-slate-800 mc-pressable flex items-center justify-center"
              >
                <ChevronUp className="w-5 h-5 text-slate-800 stroke-[3]" />
              </button>
              <div className="w-14 h-16 rounded-xl bg-slate-900 border-3 border-slate-800 flex items-center justify-center shadow-inner">
                <span className="text-3xl font-black text-amber-400 font-mono">{d1}</span>
              </div>
              <button
                disabled={isLocked}
                onClick={() => {
                  soundManager.play('click');
                  setLockDigits(team, (d1 + 9) % 10, d2);
                }}
                className="w-12 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 border-2 border-slate-800 mc-pressable flex items-center justify-center"
              >
                <ChevronDown className="w-5 h-5 text-slate-800 stroke-[3]" />
              </button>
              <span className="text-[9px] font-bold text-slate-400">TENS</span>
            </div>

            {/* Units Tumbler */}
            <div className="flex flex-col items-center gap-1">
              <button
                disabled={isLocked}
                onClick={() => {
                  soundManager.play('click');
                  setLockDigits(team, d1, (d2 + 1) % 10);
                }}
                className="w-12 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 border-2 border-slate-800 mc-pressable flex items-center justify-center"
              >
                <ChevronUp className="w-5 h-5 text-slate-800 stroke-[3]" />
              </button>
              <div className="w-14 h-16 rounded-xl bg-slate-900 border-3 border-slate-800 flex items-center justify-center shadow-inner">
                <span className="text-3xl font-black text-amber-400 font-mono">{d2}</span>
              </div>
              <button
                disabled={isLocked}
                onClick={() => {
                  soundManager.play('click');
                  setLockDigits(team, d1, (d2 + 9) % 10);
                }}
                className="w-12 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 border-2 border-slate-800 mc-pressable flex items-center justify-center"
              >
                <ChevronDown className="w-5 h-5 text-slate-800 stroke-[3]" />
              </button>
              <span className="text-[9px] font-bold text-slate-400">UNITS</span>
            </div>
          </div>

          {/* Quick Keypad for Rapid Touch (0..9) */}
          <div className="grid grid-cols-5 gap-1.5 mt-2 pt-2 border-t border-slate-200">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
              <button
                key={num}
                disabled={isLocked}
                onClick={() => {
                  soundManager.play('tap');
                  setLockDigits(team, 0, num);
                }}
                className={`h-9 rounded-lg font-bold text-xs border-2 mc-pressable transition-all ${
                  currentVal === num
                    ? 'bg-red-500 text-white border-slate-900 font-black'
                    : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Safety Cover Switch & Guarded ARM LAUNCH Button */}
        <div className="p-3 rounded-2xl bg-amber-100 border-3 border-slate-900 mc-hazard-stripe p-1">
          <div className="p-3 rounded-xl bg-white border-2 border-slate-900 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                SAFETY INTERLOCK
              </span>
              <button
                onClick={() => {
                  soundManager.play('switch');
                  setSafetyCoverOpen(!safetyCoverOpen);
                }}
                className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase border-2 transition-all ${
                  safetyCoverOpen
                    ? 'bg-emerald-500 text-white border-emerald-900'
                    : 'bg-amber-400 text-slate-950 border-amber-900 animate-pulse'
                }`}
              >
                {safetyCoverOpen ? 'COVER: OPEN ✓' : 'LIFT COVER 🔓'}
              </button>
            </div>

            <button
              disabled={isLocked || !safetyCoverOpen}
              onClick={() => {
                soundManager.play('countdown');
                armLaunch(team);
              }}
              className={`w-full h-15 rounded-xl text-white font-black text-base uppercase tracking-widest border-3 border-slate-900 mc-shadow-hard mc-pressable flex items-center justify-center gap-2 transition-all ${
                safetyCoverOpen
                  ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:brightness-110 animate-bounce'
                  : 'bg-slate-400 cursor-not-allowed opacity-60'
              }`}
            >
              <Rocket className="w-6 h-6 stroke-[2.5]" />
              ARM LAUNCH
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <aside
      className="w-[330px] lg:w-[360px] xl:w-[400px] shrink-0 h-full flex flex-col bg-white shadow-2xl relative z-10 select-none overflow-hidden"
      style={{
        borderRight: isBlue ? '4px solid #1e293b' : 'none',
        borderLeft: !isBlue ? '4px solid #1e293b' : 'none',
      }}
    >
      {/* Neo-Brutalist Console Top Header */}
      <header
        className="p-4 text-white border-b-4 border-slate-900 relative"
        style={{ background: theme.headerGrad }}
      >
        {/* Screw Fasteners */}
        <div className="mc-screw absolute top-2 left-2" />
        <div className="mc-screw absolute top-2 right-2" />

        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="text-xl">{isBlue ? '🛰️' : '🚀'}</span>
            <div>
              <h2 className="text-sm font-black tracking-tight leading-none uppercase">
                {t.name}
              </h2>
              <span className="text-[10px] font-bold text-white/80 tracking-widest">
                STATION {isBlue ? 'ALPHA (01)' : 'BRAVO (02)'}
              </span>
            </div>
          </div>

          {/* Status LED */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/20 border border-white/30">
            <div className={`w-2.5 h-2.5 rounded-full ${isLocked ? 'mc-led-amber' : 'mc-led-green'}`} />
            <span className="text-[9px] font-black uppercase tracking-wider">
              {isLocked ? 'BUSY' : 'READY'}
            </span>
          </div>
        </div>

        {/* Score & Streak Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-white/20 mt-2">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-white leading-none">
              {t.score.toLocaleString()}
            </span>
            <span className="text-[10px] font-bold text-white/80">PTS</span>
          </div>

          <div className="flex items-center gap-2">
            {t.streak > 1 && (
              <span className="px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 text-[10px] font-black border border-slate-900 flex items-center gap-1">
                <Flame className="w-3 h-3 fill-slate-950" />
                {t.streak}x STREAK
              </span>
            )}
            <span className="text-[10px] font-bold text-white/90">
              STAGES: {t.stagesCleared}/5
            </span>
          </div>
        </div>
      </header>

      {/* Main Interactive Stage Body */}
      <main className="flex-1 p-3.5 overflow-y-auto mc-scrollbar bg-[#f8fafc] flex flex-col justify-between">
        {stageIndex === 0 && renderStage1()}
        {stageIndex === 1 && renderStage2()}
        {stageIndex === 2 && renderStage3()}
        {stageIndex === 3 && renderStage4()}
        {stageIndex === 4 && renderStage5()}
      </main>

      {/* Live Tactical Feedback Banner */}
      {t.lastFeedback && (
        <footer
          className={`p-3 border-t-3 border-slate-900 flex items-center gap-2.5 ${
            t.lastFeedback.isCorrect
              ? 'bg-emerald-100 text-emerald-950'
              : 'bg-amber-100 text-amber-950'
          }`}
        >
          {t.lastFeedback.isCorrect ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          )}
          <div className="text-xs font-bold leading-tight">
            <div>{t.lastFeedback.message}</div>
            {t.lastFeedback.isCorrect && (
              <span className="text-[10px] font-black text-emerald-700">
                +{t.lastFeedback.pointsEarned} PTS AWARDED
              </span>
            )}
          </div>
        </footer>
      )}
    </aside>
  );
};
