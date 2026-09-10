// ============================================================
// EQUATION MISSION CONTROL 2.0 — Compact Team Mission Console
// Neo-Brutalist Aerospace Operator Console (15–18% Screen Width)
// Compact Touchscreen Interface for Left (Blue) / Right (Red) Stations
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

  const [safetyCoverOpen, setSafetyCoverOpen] = useState<boolean>(false);

  // Styling Tokens
  const theme = isBlue
    ? {
        primary: '#1d4ed8',
        border: '#2563eb',
        accent: '#3b82f6',
        headerGrad: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
      }
    : {
        primary: '#b91c1c',
        border: '#dc2626',
        accent: '#ef4444',
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
      <div className="flex flex-col gap-2.5">
        {/* Machine Telemetry Card */}
        <div className="p-2.5 rounded-xl bg-slate-50 border-2 border-slate-300 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] font-black tracking-widest text-slate-500 uppercase flex items-center gap-1">
              <Zap className="w-2.5 h-2.5 text-amber-500" />
              AVIONICS
            </span>
            <span className="text-[8px] font-bold text-slate-400">STAGE 01</span>
          </div>
          <div className="text-[11px] font-bold text-slate-800 leading-snug">
            "{data.wordDescription}"
          </div>
        </div>

        {/* Expression Assembly Slots */}
        <div className="p-2 rounded-xl bg-white border-2 border-slate-800 mc-shadow-hard">
          <div className="text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span>EXPRESSION</span>
            <span className="text-[8px] font-bold text-blue-600">{t.placedTokens.length} PIECES</span>
          </div>

          <div className="min-h-[44px] p-1.5 rounded-lg bg-slate-100 border border-dashed border-slate-400 flex flex-wrap items-center gap-1.5">
            {t.placedTokens.length === 0 ? (
              <span className="text-[10px] font-medium text-slate-400 italic px-1">
                Tap tiles below...
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
                  className="h-8 px-2 rounded-md bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs border border-slate-900 mc-shadow-hard mc-pressable flex items-center gap-1"
                >
                  <span>{tok}</span>
                  <span className="text-[8px] text-amber-900">✕</span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Tile Rack */}
        <div>
          <div className="flex items-center justify-between mb-1 px-0.5">
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-wider">
              TILE RACK
            </span>
            <button
              disabled={isLocked || t.placedTokens.length === 0}
              onClick={() => {
                soundManager.play('click');
                clearTokens(team);
              }}
              className="text-[9px] font-bold text-red-600 hover:underline flex items-center gap-0.5 disabled:opacity-40"
            >
              <RotateCcw className="w-2 h-2" /> CLEAR
            </button>
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            {data.availableTiles.map((tile, i) => (
              <button
                key={`${tile}-${i}`}
                disabled={isLocked}
                onClick={() => {
                  soundManager.play('tap');
                  addToken(team, tile);
                }}
                className="h-11 rounded-lg bg-slate-100 hover:bg-white text-slate-900 font-black text-sm border-2 border-slate-800 mc-shadow-hard mc-pressable flex items-center justify-center disabled:opacity-40"
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
          className="w-full h-12 rounded-xl text-white font-black text-xs uppercase tracking-wider border-2 border-slate-900 mc-shadow-hard mc-pressable flex items-center justify-center gap-1.5 disabled:opacity-40"
          style={{ background: theme.headerGrad }}
        >
          <Check className="w-4 h-4 stroke-[3]" />
          LOCK STRUCTURE
        </button>
      </div>
    );
  };

  // --------------------------------------------------------------------------
  // STAGE 2: Cryogenic Fuel Variable Loading
  // --------------------------------------------------------------------------
  const renderStage2 = () => {
    const data = challenge.stage2;
    if (!data) return null;

    const val = t.dialValue;

    return (
      <div className="flex flex-col gap-2.5">
        <div className="p-2.5 rounded-xl bg-amber-50 border-2 border-amber-300 shadow-xs">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-[9px] font-black tracking-widest text-amber-700 uppercase flex items-center gap-1">
              <Flame className="w-2.5 h-2.5 text-amber-600" />
              FUEL FORMULA
            </span>
            <span className="text-[8px] font-bold text-amber-600">STAGE 02</span>
          </div>
          <div className="text-sm font-black text-slate-900 font-mono">
            {data.formula}
          </div>
          <div className="text-[10px] font-bold text-amber-800 mt-0.5">
            Set: <span className="font-mono underline">{data.variableName} = {data.variableValue}</span>
          </div>
        </div>

        {/* Rotary Stepper */}
        <div className="p-2.5 rounded-xl bg-white border-2 border-slate-800 mc-shadow-hard">
          <div className="text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>VARIABLE DIAL</span>
            <span className="text-[9px] font-black text-blue-600 font-mono">{data.variableName}</span>
          </div>

          <div className="flex items-center justify-center gap-2 my-1">
            <button
              disabled={isLocked || val <= 0}
              onClick={() => {
                soundManager.play('click');
                setDialValue(team, Math.max(0, val - 1));
              }}
              className="w-11 h-11 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 font-black text-lg border-2 border-slate-800 mc-pressable flex items-center justify-center disabled:opacity-40"
            >
              <Minus className="w-4 h-4 stroke-[3]" />
            </button>

            <div className="w-20 h-13 rounded-xl bg-slate-900 border-2 border-slate-800 flex flex-col items-center justify-center shadow-inner">
              <span className="text-[8px] font-bold text-emerald-400">VALUE</span>
              <span className="text-2xl font-black text-white font-mono leading-none">{val}</span>
            </div>

            <button
              disabled={isLocked || val >= 30}
              onClick={() => {
                soundManager.play('click');
                setDialValue(team, Math.min(30, val + 1));
              }}
              className="w-11 h-11 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 font-black text-lg border-2 border-slate-800 mc-pressable flex items-center justify-center disabled:opacity-40"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
            </button>
          </div>

          {/* Quick Presets */}
          <div className="grid grid-cols-4 gap-1 mt-2 pt-1.5 border-t border-slate-200">
            {[data.variableValue - 1, data.variableValue, data.variableValue + 1, data.variableValue + 2]
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
                  className={`h-7 rounded-md font-bold text-[10px] border mc-pressable ${
                    val === preset
                      ? 'bg-amber-400 text-slate-950 border-slate-900 font-black'
                      : 'bg-slate-100 text-slate-700 border-slate-300'
                  }`}
                >
                  {preset}
                </button>
              ))}
          </div>
        </div>

        <button
          disabled={isLocked}
          onClick={() => {
            soundManager.play('laser');
            submitVariableLoading(team);
          }}
          className="w-full h-12 rounded-xl text-white font-black text-xs uppercase tracking-wider border-2 border-slate-900 mc-shadow-hard mc-pressable flex items-center justify-center gap-1.5 disabled:opacity-40"
          style={{ background: theme.headerGrad }}
        >
          <Flame className="w-4 h-4 fill-amber-300 text-amber-300" />
          PUMP FUEL
        </button>
      </div>
    );
  };

  // --------------------------------------------------------------------------
  // STAGE 3: Rocket Engine Equation Balance
  // --------------------------------------------------------------------------
  const renderStage3 = () => {
    const data = challenge.stage3;
    if (!data) return null;

    const op = t.selectedBalanceOp;
    const val = t.selectedBalanceVal;

    return (
      <div className="flex flex-col gap-2.5">
        <div className="p-2.5 rounded-xl bg-emerald-50 border-2 border-emerald-300 shadow-xs">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-[9px] font-black tracking-widest text-emerald-700 uppercase flex items-center gap-1">
              <Scale className="w-2.5 h-2.5 text-emerald-600" />
              BALANCE EQUATION
            </span>
            <span className="text-[8px] font-bold text-emerald-600">STAGE 03</span>
          </div>
          <div className="text-sm font-black text-slate-900 font-mono">
            {data.equationDisplay}
          </div>
          <div className="text-[9px] font-semibold text-emerald-800 mt-0.5">
            Apply inverse operation to both sides
          </div>
        </div>

        {/* Operation Buttons */}
        <div className="p-2.5 rounded-xl bg-white border-2 border-slate-800 mc-shadow-hard">
          <div className="text-[8px] font-black text-slate-500 uppercase tracking-wider mb-1">
            OPERATION & VALUE
          </div>
          <div className="grid grid-cols-4 gap-1 mb-2">
            {(['+', '-', '×', '÷'] as const).map((operation) => (
              <button
                key={operation}
                disabled={isLocked}
                onClick={() => {
                  soundManager.play('click');
                  setBalanceOp(team, operation, val);
                }}
                className={`h-9 rounded-lg text-sm font-black border-2 mc-pressable flex items-center justify-center ${
                  op === operation
                    ? 'bg-amber-400 text-slate-950 border-slate-900 scale-105'
                    : 'bg-slate-100 text-slate-700 border-slate-300'
                }`}
              >
                {operation}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2">
            <button
              disabled={isLocked || val <= 1}
              onClick={() => {
                soundManager.play('click');
                setBalanceOp(team, op, Math.max(1, val - 1));
              }}
              className="w-10 h-10 rounded-lg bg-slate-100 text-slate-900 font-black border-2 border-slate-800 mc-pressable flex items-center justify-center disabled:opacity-40"
            >
              <Minus className="w-4 h-4 stroke-[3]" />
            </button>

            <div className="w-18 h-10 rounded-lg bg-slate-900 flex items-center justify-center">
              <span className="text-lg font-black text-amber-400 font-mono">
                {op} {val}
              </span>
            </div>

            <button
              disabled={isLocked || val >= 25}
              onClick={() => {
                soundManager.play('click');
                setBalanceOp(team, op, Math.min(25, val + 1));
              }}
              className="w-10 h-10 rounded-lg bg-slate-100 text-slate-900 font-black border-2 border-slate-800 mc-pressable flex items-center justify-center disabled:opacity-40"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>

        <button
          disabled={isLocked}
          onClick={() => {
            soundManager.play('powerup');
            submitEquationBalance(team);
          }}
          className="w-full h-12 rounded-xl text-white font-black text-xs uppercase tracking-wider border-2 border-slate-900 mc-shadow-hard mc-pressable flex items-center justify-center gap-1.5 disabled:opacity-40"
          style={{ background: theme.headerGrad }}
        >
          <Scale className="w-4 h-4" />
          BALANCE ENGINES
        </button>
      </div>
    );
  };

  // --------------------------------------------------------------------------
  // STAGE 4: Flight Path Formula Calibration
  // --------------------------------------------------------------------------
  const renderStage4 = () => {
    const data = challenge.stage4;
    if (!data) return null;

    const speed = t.speedDial;
    const time = t.timeDial;
    const dist = speed * time;

    return (
      <div className="flex flex-col gap-2.5">
        <div className="p-2.5 rounded-xl bg-cyan-50 border-2 border-cyan-300 shadow-xs">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-[9px] font-black tracking-widest text-cyan-800 uppercase flex items-center gap-1">
              <Gauge className="w-2.5 h-2.5 text-cyan-600" />
              FLIGHT PATH
            </span>
            <span className="text-[8px] font-bold text-cyan-700">STAGE 04</span>
          </div>
          <div className="text-sm font-black text-slate-900 font-mono">
            D = S × T
          </div>
          <div className="text-[9px] font-semibold text-cyan-900 mt-0.5">
            S = {data.speedGiven} {data.speedUnit} | T = {data.timeGiven} {data.timeUnit}
          </div>
        </div>

        {/* Dials */}
        <div className="p-2.5 rounded-xl bg-white border-2 border-slate-800 mc-shadow-hard flex flex-col gap-2">
          {/* Speed */}
          <div>
            <div className="flex items-center justify-between text-[8px] font-black text-slate-500 uppercase mb-0.5">
              <span>SPEED (S)</span>
              <span className="text-blue-600 font-mono font-bold">{speed} km/s</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                disabled={isLocked || speed <= 1}
                onClick={() => setSpeedDial(team, Math.max(1, speed - 1))}
                className="w-8 h-8 rounded-md bg-slate-100 font-black border border-slate-800 flex items-center justify-center"
              >
                -
              </button>
              <input
                type="range"
                min={1}
                max={25}
                value={speed}
                disabled={isLocked}
                onChange={(e) => setSpeedDial(team, parseInt(e.target.value, 10))}
                className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
              <button
                disabled={isLocked || speed >= 25}
                onClick={() => setSpeedDial(team, Math.min(25, speed + 1))}
                className="w-8 h-8 rounded-md bg-slate-100 font-black border border-slate-800 flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>

          {/* Time */}
          <div>
            <div className="flex items-center justify-between text-[8px] font-black text-slate-500 uppercase mb-0.5">
              <span>TIME (T)</span>
              <span className="text-blue-600 font-mono font-bold">{time} s</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                disabled={isLocked || time <= 1}
                onClick={() => setTimeDial(team, Math.max(1, time - 1))}
                className="w-8 h-8 rounded-md bg-slate-100 font-black border border-slate-800 flex items-center justify-center"
              >
                -
              </button>
              <input
                type="range"
                min={1}
                max={15}
                value={time}
                disabled={isLocked}
                onChange={(e) => setTimeDial(team, parseInt(e.target.value, 10))}
                className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
              <button
                disabled={isLocked || time >= 15}
                onClick={() => setTimeDial(team, Math.min(15, time + 1))}
                className="w-8 h-8 rounded-md bg-slate-100 font-black border border-slate-800 flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Calculated Distance */}
        <div className="p-2 rounded-lg bg-slate-900 text-white flex items-center justify-between text-xs font-mono">
          <span className="text-[8px] font-bold text-slate-400">CALCULATED:</span>
          <span className="font-black text-cyan-400">{dist} km</span>
        </div>

        <button
          disabled={isLocked}
          onClick={() => {
            soundManager.play('powerup');
            submitNavCalibration(team);
          }}
          className="w-full h-12 rounded-xl text-white font-black text-xs uppercase tracking-wider border-2 border-slate-900 mc-shadow-hard mc-pressable flex items-center justify-center gap-1.5 disabled:opacity-40"
          style={{ background: theme.headerGrad }}
        >
          <Sliders className="w-4 h-4" />
          LOCK GUIDANCE
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
      <div className="flex flex-col gap-2.5">
        <div className="p-2.5 rounded-xl bg-red-50 border-2 border-red-300 shadow-xs">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-[9px] font-black tracking-widest text-red-700 uppercase flex items-center gap-1">
              <Rocket className="w-2.5 h-2.5 text-red-600" />
              LAUNCH EQUATION
            </span>
            <span className="text-[8px] font-bold text-red-600">STAGE 05</span>
          </div>
          <div className="text-sm font-black text-slate-900 font-mono">
            {data.equationDisplay}
          </div>
          <div className="text-[9px] font-bold text-red-800 mt-0.5">
            Solve for x to arm launch sequence!
          </div>
        </div>

        {/* Tumbler Dials */}
        <div className="p-2.5 rounded-xl bg-white border-2 border-slate-800 mc-shadow-hard">
          <div className="text-[8px] font-black text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>LOCK COMBINATION</span>
            <span className="text-[9px] font-black text-red-600 font-mono">x = {currentVal}</span>
          </div>

          <div className="flex items-center justify-center gap-3 my-1">
            {/* Tens */}
            <div className="flex flex-col items-center">
              <button
                disabled={isLocked}
                onClick={() => setLockDigits(team, (d1 + 1) % 10, d2)}
                className="w-10 h-7 rounded-md bg-slate-100 border border-slate-800 flex items-center justify-center"
              >
                <ChevronUp className="w-4 h-4 stroke-[3]" />
              </button>
              <div className="w-11 h-12 rounded-lg bg-slate-900 flex items-center justify-center my-0.5">
                <span className="text-2xl font-black text-amber-400 font-mono">{d1}</span>
              </div>
              <button
                disabled={isLocked}
                onClick={() => setLockDigits(team, (d1 + 9) % 10, d2)}
                className="w-10 h-7 rounded-md bg-slate-100 border border-slate-800 flex items-center justify-center"
              >
                <ChevronDown className="w-4 h-4 stroke-[3]" />
              </button>
            </div>

            {/* Units */}
            <div className="flex flex-col items-center">
              <button
                disabled={isLocked}
                onClick={() => setLockDigits(team, d1, (d2 + 1) % 10)}
                className="w-10 h-7 rounded-md bg-slate-100 border border-slate-800 flex items-center justify-center"
              >
                <ChevronUp className="w-4 h-4 stroke-[3]" />
              </button>
              <div className="w-11 h-12 rounded-lg bg-slate-900 flex items-center justify-center my-0.5">
                <span className="text-2xl font-black text-amber-400 font-mono">{d2}</span>
              </div>
              <button
                disabled={isLocked}
                onClick={() => setLockDigits(team, d1, (d2 + 9) % 10)}
                className="w-10 h-7 rounded-md bg-slate-100 border border-slate-800 flex items-center justify-center"
              >
                <ChevronDown className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </div>
        </div>

        {/* Safety Interlock Switch & Guarded ARM LAUNCH */}
        <div className="p-2 rounded-xl bg-amber-100 border-2 border-slate-900 mc-hazard-stripe p-0.5">
          <div className="p-2 rounded-lg bg-white border border-slate-900 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[8px] font-black text-slate-800 uppercase flex items-center gap-1">
                <Lock className="w-3 h-3 text-amber-600" />
                INTERLOCK
              </span>
              <button
                onClick={() => {
                  soundManager.play('switch');
                  setSafetyCoverOpen(!safetyCoverOpen);
                }}
                className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border ${
                  safetyCoverOpen ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-slate-950 animate-pulse'
                }`}
              >
                {safetyCoverOpen ? 'OPEN ✓' : 'LIFT 🔓'}
              </button>
            </div>

            <button
              disabled={isLocked || !safetyCoverOpen}
              onClick={() => {
                soundManager.play('countdown');
                armLaunch(team);
              }}
              className={`w-full h-12 rounded-lg text-white font-black text-xs uppercase tracking-wider border-2 border-slate-900 mc-shadow-hard mc-pressable flex items-center justify-center gap-1.5 ${
                safetyCoverOpen
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 animate-bounce'
                  : 'bg-slate-400 cursor-not-allowed opacity-60'
              }`}
            >
              <Rocket className="w-4 h-4" />
              ARM LAUNCH
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <aside
      className="w-[230px] lg:w-[255px] xl:w-[275px] shrink-0 h-full flex flex-col bg-white shadow-2xl relative z-20 select-none overflow-hidden"
      style={{
        borderRight: isBlue ? '3px solid #1e293b' : 'none',
        borderLeft: !isBlue ? '3px solid #1e293b' : 'none',
      }}
    >
      {/* Console Top Header */}
      <header
        className="p-3 text-white border-b-3 border-slate-900 relative"
        style={{ background: theme.headerGrad }}
      >
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5">
            <span className="text-base">{isBlue ? '🛰️' : '🚀'}</span>
            <div>
              <h2 className="text-xs font-black tracking-tight leading-none uppercase">
                {t.name}
              </h2>
              <span className="text-[8px] font-bold text-white/80">
                {isBlue ? 'LEFT LAUNCH PAD' : 'RIGHT LAUNCH PAD'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/20 border border-white/30">
            <div className={`w-2 h-2 rounded-full ${isLocked ? 'mc-led-amber' : 'mc-led-green'}`} />
            <span className="text-[8px] font-black uppercase">
              {isLocked ? 'BUSY' : 'READY'}
            </span>
          </div>
        </div>

        {/* Score Plaque */}
        <div className="flex items-center justify-between pt-1.5 border-t border-white/20 mt-1">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-white leading-none">
              {t.score.toLocaleString()}
            </span>
            <span className="text-[9px] font-bold text-white/80">PTS</span>
          </div>
          <span className="text-[9px] font-black text-amber-300">
            {t.stagesCleared}/5 STAGES
          </span>
        </div>
      </header>

      {/* Main Interactive Stage Body */}
      <main className="flex-1 p-2.5 overflow-y-auto mc-scrollbar bg-[#f8fafc] flex flex-col justify-between">
        {stageIndex === 0 && renderStage1()}
        {stageIndex === 1 && renderStage2()}
        {stageIndex === 2 && renderStage3()}
        {stageIndex === 3 && renderStage4()}
        {stageIndex === 4 && renderStage5()}
      </main>

      {/* Live Tactical Feedback Banner */}
      {t.lastFeedback && (
        <footer
          className={`p-2 border-t-2 border-slate-900 flex items-center gap-1.5 ${
            t.lastFeedback.isCorrect ? 'bg-emerald-100 text-emerald-950' : 'bg-amber-100 text-amber-950'
          }`}
        >
          {t.lastFeedback.isCorrect ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          )}
          <div className="text-[10px] font-bold leading-tight">
            <div>{t.lastFeedback.message}</div>
          </div>
        </footer>
      )}
    </aside>
  );
};
