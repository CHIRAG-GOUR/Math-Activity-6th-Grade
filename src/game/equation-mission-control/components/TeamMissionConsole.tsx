// ============================================================
// EQUATION MISSION CONTROL 2.0 — Symmetrical Team Control Console
// Perfectly Identical Sizing & Positioning to Train Game:
// - Fixed dimensions: w-[270px] min-w-[270px] max-w-[270px]
// - Rounded-2xl card with gradient header & compact score pill
// - Inner scrollable content constrained to max-h-[380px]
// - 5 Tactile Mathematics Mechanics optimized for touch targets
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

  // Styling Tokens matching Train Game
  const teamBorderColor = isBlue ? '#60a5fa' : '#f87171';
  const teamPrimaryColor = isBlue ? '#2563eb' : '#dc2626';
  const teamDarkBorder = isBlue ? '#1e40af' : '#991b1b';
  const headerGrad = isBlue
    ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'
    : 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)';

  const isLocked = t.isLocked || phase !== 'active-mission';

  // --------------------------------------------------------------------------
  // STAGE 1: Expression Assembly
  // --------------------------------------------------------------------------
  const renderStage1 = () => {
    const data = challenge.stage1;
    if (!data) return null;

    return (
      <div className="flex flex-col gap-1.5">
        {/* Machine Telemetry Card */}
        <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-[8px] font-black uppercase tracking-wider text-amber-700 flex items-center gap-1">
              <Zap className="w-2.5 h-2.5 text-amber-600" />
              AVIONICS SPEC
            </span>
            <span className="text-[8px] font-bold text-slate-400">STAGE 01</span>
          </div>
          <div className="text-[11px] font-black text-slate-900 leading-snug">
            "{data.wordDescription}"
          </div>
        </div>

        {/* Expression Assembly Slots */}
        <div className="p-1.5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[8px] font-black text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>EXPRESSION</span>
            <span className="text-[8px] font-bold text-blue-600">{t.placedTokens.length} TILES</span>
          </div>

          <div className="min-h-[34px] p-1 rounded-lg bg-slate-100 border border-dashed border-slate-300 flex flex-wrap items-center gap-1">
            {t.placedTokens.length === 0 ? (
              <span className="text-[9px] font-medium text-slate-400 italic px-1">
                Tap tiles below to build...
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
                  className="h-6 px-1.5 rounded bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[11px] font-mono border border-slate-800 flex items-center gap-1 cursor-pointer transition-all active:scale-95"
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
              AVAILABLE TILES
            </span>
            <button
              disabled={isLocked || t.placedTokens.length === 0}
              onClick={() => {
                soundManager.play('click');
                clearTokens(team);
              }}
              className="text-[8px] font-bold text-red-600 hover:underline flex items-center gap-0.5 disabled:opacity-40 cursor-pointer"
            >
              <RotateCcw className="w-2 h-2" /> CLEAR
            </button>
          </div>

          <div className="grid grid-cols-4 gap-1">
            {data.availableTiles.map((tile, i) => (
              <button
                key={`${tile}-${i}`}
                disabled={isLocked}
                onClick={() => {
                  soundManager.play('tap');
                  addToken(team, tile);
                }}
                className="h-8 rounded-lg bg-white hover:bg-slate-100 text-slate-900 font-black font-mono text-xs border-2 border-slate-300 shadow-xs flex items-center justify-center disabled:opacity-40 cursor-pointer transition-all active:scale-95"
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
          className="w-full py-2 rounded-xl text-white font-black text-[11px] uppercase tracking-wider border-2 border-slate-900 shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-40 cursor-pointer transition-all active:scale-95"
          style={{ background: headerGrad }}
        >
          <Check className="w-3.5 h-3.5 stroke-[3]" />
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
      <div className="flex flex-col gap-1.5">
        <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-[8px] font-black uppercase tracking-wider text-amber-700 flex items-center gap-1">
              <Flame className="w-2.5 h-2.5 text-amber-600" />
              FUEL FORMULA
            </span>
            <span className="text-[8px] font-bold text-slate-400">STAGE 02</span>
          </div>
          <div className="text-xs font-black text-slate-900 font-mono">
            {data.formula}
          </div>
          <div className="text-[9.5px] font-bold text-amber-800 mt-0.5">
            Set: <span className="font-mono underline font-black">{data.variableName} = {data.variableValue}</span>
          </div>
        </div>

        {/* Rotary Stepper */}
        <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[8px] font-black text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>VARIABLE DIAL</span>
            <span className="text-[9px] font-black text-blue-600 font-mono">{data.variableName}</span>
          </div>

          <div className="flex items-center justify-center gap-2 my-0.5">
            <button
              disabled={isLocked || val <= 0}
              onClick={() => {
                soundManager.play('click');
                setDialValue(team, Math.max(0, val - 1));
              }}
              className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 font-black text-sm border-2 border-slate-300 shadow-xs flex items-center justify-center disabled:opacity-40 cursor-pointer active:scale-95"
            >
              <Minus className="w-3.5 h-3.5 stroke-[3]" />
            </button>

            <div className="w-16 h-8 rounded-lg bg-slate-900 flex flex-col items-center justify-center shadow-inner">
              <span className="text-[6.5px] font-bold text-emerald-400 leading-none">VALUE</span>
              <span className="text-base font-black text-white font-mono leading-tight">{val}</span>
            </div>

            <button
              disabled={isLocked || val >= 30}
              onClick={() => {
                soundManager.play('click');
                setDialValue(team, Math.min(30, val + 1));
              }}
              className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 font-black text-sm border-2 border-slate-300 shadow-xs flex items-center justify-center disabled:opacity-40 cursor-pointer active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          </div>

          {/* Quick Presets */}
          <div className="grid grid-cols-4 gap-1 mt-1.5 pt-1.5 border-t border-slate-100">
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
                  className={`h-5.5 rounded font-mono text-[9px] border transition-all cursor-pointer ${
                    val === preset
                      ? 'bg-amber-400 text-slate-950 border-slate-900 font-black shadow-xs'
                      : 'bg-slate-100 text-slate-700 border-slate-300 font-bold hover:bg-white'
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
          className="w-full py-2 rounded-xl text-white font-black text-[11px] uppercase tracking-wider border-2 border-slate-900 shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-40 cursor-pointer transition-all active:scale-95"
          style={{ background: headerGrad }}
        >
          <Flame className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
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
      <div className="flex flex-col gap-1.5">
        <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-[8px] font-black uppercase tracking-wider text-emerald-700 flex items-center gap-1">
              <Scale className="w-2.5 h-2.5 text-emerald-600" />
              BALANCE EQUATION
            </span>
            <span className="text-[8px] font-bold text-slate-400">STAGE 03</span>
          </div>
          <div className="text-xs font-black text-slate-900 font-mono">
            {data.equationDisplay}
          </div>
          <div className="text-[8.5px] font-semibold text-emerald-800 mt-0.5">
            Apply inverse operation to both sides
          </div>
        </div>

        {/* Operation Buttons */}
        <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[8px] font-black text-slate-500 uppercase tracking-wider mb-1">
            OPERATION & VALUE
          </div>
          <div className="grid grid-cols-4 gap-1 mb-1">
            {(['+', '-', '×', '÷'] as const).map((operation) => (
              <button
                key={operation}
                disabled={isLocked}
                onClick={() => {
                  soundManager.play('click');
                  setBalanceOp(team, operation, val);
                }}
                className={`h-7 rounded-lg text-xs font-black border transition-all cursor-pointer flex items-center justify-center ${
                  op === operation
                    ? 'bg-amber-400 text-slate-950 border-slate-900 shadow-xs scale-102'
                    : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-white'
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
              className="w-8 h-8 rounded-lg bg-slate-100 text-slate-900 font-black border border-slate-300 shadow-xs flex items-center justify-center disabled:opacity-40 cursor-pointer active:scale-95"
            >
              <Minus className="w-3 h-3 stroke-[3]" />
            </button>

            <div className="w-14 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
              <span className="text-xs font-black text-amber-400 font-mono">
                {op} {val}
              </span>
            </div>

            <button
              disabled={isLocked || val >= 25}
              onClick={() => {
                soundManager.play('click');
                setBalanceOp(team, op, Math.min(25, val + 1));
              }}
              className="w-8 h-8 rounded-lg bg-slate-100 text-slate-900 font-black border border-slate-300 shadow-xs flex items-center justify-center disabled:opacity-40 cursor-pointer active:scale-95"
            >
              <Plus className="w-3 h-3 stroke-[3]" />
            </button>
          </div>
        </div>

        <button
          disabled={isLocked}
          onClick={() => {
            soundManager.play('powerup');
            submitEquationBalance(team);
          }}
          className="w-full py-2 rounded-xl text-white font-black text-[11px] uppercase tracking-wider border-2 border-slate-900 shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-40 cursor-pointer transition-all active:scale-95"
          style={{ background: headerGrad }}
        >
          <Scale className="w-3.5 h-3.5" />
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
      <div className="flex flex-col gap-1.5">
        <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-[8px] font-black uppercase tracking-wider text-cyan-800 flex items-center gap-1">
              <Gauge className="w-2.5 h-2.5 text-cyan-600" />
              FLIGHT PATH
            </span>
            <span className="text-[8px] font-bold text-slate-400">STAGE 04</span>
          </div>
          <div className="text-xs font-black text-slate-900 font-mono">
            D = S × T
          </div>
          <div className="text-[8.5px] font-semibold text-cyan-900 mt-0.5">
            S = {data.speedGiven} {data.speedUnit} | T = {data.timeGiven} {data.timeUnit}
          </div>
        </div>

        {/* Dials */}
        <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col gap-1">
          {/* Speed */}
          <div>
            <div className="flex items-center justify-between text-[8px] font-black text-slate-500 uppercase mb-0.5">
              <span>SPEED (S)</span>
              <span className="text-blue-600 font-mono font-bold">{speed} km/s</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                disabled={isLocked || speed <= 1}
                onClick={() => setSpeedDial(team, Math.max(1, speed - 1))}
                className="w-6 h-6 rounded bg-slate-100 font-black border border-slate-300 flex items-center justify-center text-[10px] cursor-pointer"
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
                className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
              <button
                disabled={isLocked || speed >= 25}
                onClick={() => setSpeedDial(team, Math.min(25, speed + 1))}
                className="w-6 h-6 rounded bg-slate-100 font-black border border-slate-300 flex items-center justify-center text-[10px] cursor-pointer"
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
            <div className="flex items-center gap-1">
              <button
                disabled={isLocked || time <= 1}
                onClick={() => setTimeDial(team, Math.max(1, time - 1))}
                className="w-6 h-6 rounded bg-slate-100 font-black border border-slate-300 flex items-center justify-center text-[10px] cursor-pointer"
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
                className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
              <button
                disabled={isLocked || time >= 15}
                onClick={() => setTimeDial(team, Math.min(15, time + 1))}
                className="w-6 h-6 rounded bg-slate-100 font-black border border-slate-300 flex items-center justify-center text-[10px] cursor-pointer"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Calculated Distance */}
        <div className="p-1.5 rounded-lg bg-slate-900 text-white flex items-center justify-between text-[11px] font-mono">
          <span className="text-[8px] font-bold text-slate-400">DISTANCE:</span>
          <span className="font-black text-cyan-400">{dist} km</span>
        </div>

        <button
          disabled={isLocked}
          onClick={() => {
            soundManager.play('powerup');
            submitNavCalibration(team);
          }}
          className="w-full py-2 rounded-xl text-white font-black text-[11px] uppercase tracking-wider border-2 border-slate-900 shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-40 cursor-pointer transition-all active:scale-95"
          style={{ background: headerGrad }}
        >
          <Sliders className="w-3.5 h-3.5" />
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
      <div className="flex flex-col gap-1.5">
        <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-[8px] font-black uppercase tracking-wider text-red-700 flex items-center gap-1">
              <Rocket className="w-2.5 h-2.5 text-red-600" />
              LAUNCH EQUATION
            </span>
            <span className="text-[8px] font-bold text-slate-400">STAGE 05</span>
          </div>
          <div className="text-xs font-black text-slate-900 font-mono">
            {data.equationDisplay}
          </div>
          <div className="text-[8.5px] font-bold text-red-800 mt-0.5">
            Solve for x to arm launch sequence!
          </div>
        </div>

        {/* Tumbler Dials */}
        <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[8px] font-black text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>LOCK COMBINATION</span>
            <span className="text-[9px] font-black text-red-600 font-mono">x = {currentVal}</span>
          </div>

          <div className="flex items-center justify-center gap-3 my-0.5">
            {/* Tens */}
            <div className="flex flex-col items-center">
              <button
                disabled={isLocked}
                onClick={() => setLockDigits(team, (d1 + 1) % 10, d2)}
                className="w-8 h-5 rounded bg-slate-100 border border-slate-300 flex items-center justify-center cursor-pointer hover:bg-slate-200"
              >
                <ChevronUp className="w-3 h-3 stroke-[3]" />
              </button>
              <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center my-0.5">
                <span className="text-lg font-black text-amber-400 font-mono">{d1}</span>
              </div>
              <button
                disabled={isLocked}
                onClick={() => setLockDigits(team, (d1 + 9) % 10, d2)}
                className="w-8 h-5 rounded bg-slate-100 border border-slate-300 flex items-center justify-center cursor-pointer hover:bg-slate-200"
              >
                <ChevronDown className="w-3 h-3 stroke-[3]" />
              </button>
            </div>

            {/* Units */}
            <div className="flex flex-col items-center">
              <button
                disabled={isLocked}
                onClick={() => setLockDigits(team, d1, (d2 + 1) % 10)}
                className="w-8 h-5 rounded bg-slate-100 border border-slate-300 flex items-center justify-center cursor-pointer hover:bg-slate-200"
              >
                <ChevronUp className="w-3 h-3 stroke-[3]" />
              </button>
              <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center my-0.5">
                <span className="text-lg font-black text-amber-400 font-mono">{d2}</span>
              </div>
              <button
                disabled={isLocked}
                onClick={() => setLockDigits(team, d1, (d2 + 9) % 10)}
                className="w-8 h-5 rounded bg-slate-100 border border-slate-300 flex items-center justify-center cursor-pointer hover:bg-slate-200"
              >
                <ChevronDown className="w-3 h-3 stroke-[3]" />
              </button>
            </div>
          </div>
        </div>

        {/* Safety Interlock Switch & Guarded ARM LAUNCH */}
        <div className="p-1 rounded-xl bg-amber-50 border border-amber-300 flex flex-col gap-1">
          <div className="flex items-center justify-between px-1">
            <span className="text-[8px] font-black text-slate-800 uppercase flex items-center gap-1">
              <Lock className="w-2.5 h-2.5 text-amber-600" />
              INTERLOCK
            </span>
            <button
              onClick={() => {
                soundManager.play('switch');
                setSafetyCoverOpen(!safetyCoverOpen);
              }}
              className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase border cursor-pointer ${
                safetyCoverOpen ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-amber-400 text-slate-950 border-amber-500 animate-pulse'
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
            className={`w-full py-2 rounded-xl text-white font-black text-[11px] uppercase tracking-wider border-2 border-slate-900 shadow-xs flex items-center justify-center gap-1.5 ${
              safetyCoverOpen
                ? 'bg-gradient-to-r from-red-600 to-rose-600 animate-bounce cursor-pointer active:scale-95'
                : 'bg-slate-400 cursor-not-allowed opacity-60'
            }`}
          >
            <Rocket className="w-3.5 h-3.5" />
            ARM LAUNCH
          </button>
        </div>
      </div>
    );
  };

  return (
    <div
      className="w-[270px] min-w-[270px] max-w-[270px] bg-white border-2 rounded-2xl shadow-2xl select-none overflow-hidden font-sans flex flex-col pointer-events-auto"
      style={{ borderColor: teamBorderColor }}
      onPointerDown={(e) => e.stopPropagation()}
    >
      {/* ── 1. Team Header Bar (Identical to Train Game) ── */}
      <div
        className="px-3 py-2 flex items-center justify-between text-white shadow-xs"
        style={{ background: headerGrad }}
      >
        <div className="flex items-center gap-1.5">
          <span className="text-base">{isBlue ? '🔵' : '🔴'}</span>
          <div>
            <h2 className="text-[11px] font-black tracking-wider uppercase leading-tight text-white">
              {t.name}
            </h2>
            <div className="text-[8px] font-bold text-white/90 tracking-wide">
              {isBlue ? 'LEFT COMPLEX' : 'RIGHT COMPLEX'}
            </div>
          </div>
        </div>

        {/* Score & Streak Pill */}
        <div className="flex items-center gap-1.5">
          {t.streak > 1 && (
            <span className="px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-[9px] animate-bounce">
              🔥×{t.streak}
            </span>
          )}
          <div className="px-2 py-0.5 bg-black/30 rounded-md border border-white/30 text-center">
            <span className="text-xs font-black text-amber-300 leading-tight">
              {t.score} <span className="text-[7px] text-slate-200 uppercase font-bold">PTS</span>
            </span>
          </div>
        </div>
      </div>

      {/* ── 2. Stage Objective Subheader ── */}
      <div
        className="px-2.5 py-1 border-b flex items-center justify-between text-xs font-black"
        style={{
          backgroundColor: isBlue ? '#eff6ff' : '#fef2f2',
          color: isBlue ? '#1e40af' : '#991b1b',
          borderColor: isBlue ? '#bfdbfe' : '#fecaca',
        }}
      >
        <div className="flex items-center gap-1 font-black text-[9px] uppercase tracking-tight">
          <span>🚀</span>
          <span>STAGE 0{stageIndex + 1} / 05</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[7.5px] font-black px-1.5 py-0.2 rounded bg-slate-100 border border-slate-300 text-slate-700">
            {t.stagesCleared}/5 DONE
          </span>
        </div>
      </div>

      {/* ── 3. Main Interactive Stage Body (Identical max-h-[380px] to Train Game) ── */}
      <div className="p-2.5 flex flex-col gap-2 bg-slate-50 overflow-y-auto max-h-[380px] mc-scrollbar">
        {phase === 'active-mission' ? (
          <>
            {stageIndex === 0 && renderStage1()}
            {stageIndex === 1 && renderStage2()}
            {stageIndex === 2 && renderStage3()}
            {stageIndex === 3 && renderStage4()}
            {stageIndex === 4 && renderStage5()}
          </>
        ) : (
          /* Standby / Showdown / Launch State */
          <div className="py-6 flex flex-col items-center justify-center text-center gap-1.5">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-xl animate-bounce">
              {phase === 'countdown' ? '⏱️' : phase === 'launch-cinematic' ? '🚀' : phase === 'solution-reveal' ? '🏁' : '⚙️'}
            </div>
            <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-tight">
              {phase === 'countdown'
                ? 'COUNTDOWN ACTIVE!'
                : phase === 'launch-cinematic'
                  ? 'ROCKET LIFTOFF!'
                  : phase === 'solution-reveal'
                    ? 'STAGE COMPLETED!'
                    : 'MISSION STANDBY'}
            </h4>
          </div>
        )}
      </div>

      {/* ── 4. Live Tactical Feedback Banner ── */}
      {t.lastFeedback && (
        <div
          className={`px-2.5 py-1.5 border-t flex items-center gap-1.5 ${
            t.lastFeedback.isCorrect
              ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
              : 'bg-amber-100 text-amber-950 border-amber-300'
          }`}
        >
          {t.lastFeedback.isCorrect ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          )}
          <div className="text-[9.5px] font-bold leading-tight">
            {t.lastFeedback.message}
          </div>
        </div>
      )}
    </div>
  );
};

