// ============================================================
// PATTERN RACERS — Need for Speed / Forza Grand Prix HUD
// Full-Screen High-Energy Live Racing Cockpit Overlay:
// - Left: Blue Team Speedometer, Tachometer, NOS Tanks & D-Pad Arrow Controls
// - Center: Real-Time Circuit Radar Minimap & Analog Virtual Touch Joystick
// - Right: Red Team Speedometer, Tachometer, NOS Tanks & D-Pad Arrow Controls
// - Advantage Display for Math Round Champions (3x Nitrous, Pole Position)
// ============================================================

'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { usePatternStore } from '../store/patternStore';
import { getTrackPointAt, TRACK_TOTAL_LENGTH_METERS, TRACK_FINISH_PROGRESS } from '../engine/trackPath';
import { Flame, Gauge, Zap, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Navigation } from 'lucide-react';

export const NFSMostWantedRaceHUD: React.FC = () => {
  const blueTeam = usePatternStore((s) => s.blueTeam);
  const redTeam = usePatternStore((s) => s.redTeam);
  const pressThrottle = usePatternStore((s) => s.pressThrottle);
  const releaseThrottle = usePatternStore((s) => s.releaseThrottle);
  const pressBrake = usePatternStore((s) => s.pressBrake);
  const releaseBrake = usePatternStore((s) => s.releaseBrake);
  const setSteerInput = usePatternStore((s) => s.setSteerInput);
  const switchLane = usePatternStore((s) => s.switchLane);
  const triggerNitro = usePatternStore((s) => s.triggerNitro);
  const applyVirtualJoystick = usePatternStore((s) => s.applyVirtualJoystick);
  const raceLights = usePatternStore((s) => s.raceLights);

  const bCtrl = blueTeam.raceControls;
  const rCtrl = redTeam.raceControls;

  // ── VIRTUAL JOYSTICK STATE ──
  const joystickBaseRef = useRef<HTMLDivElement>(null);
  const [joystickActive, setJoystickActive] = useState(false);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });

  const handleJoystickMove = useCallback((clientX: number, clientY: number) => {
    if (!joystickBaseRef.current) return;
    const rect = joystickBaseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const maxRadius = rect.width / 2 - 15;

    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);

    const clampedDist = Math.min(distance, maxRadius);
    const clampedX = Math.cos(angle) * clampedDist;
    const clampedY = Math.sin(angle) * clampedDist;

    setKnobPos({ x: clampedX, y: clampedY });

    // Normalized inputs: X in [-1, 1], Y in [-1, 1] (negative Y is up)
    const normX = clampedX / maxRadius;
    const normY = -clampedY / maxRadius; // invert so up is positive throttle

    applyVirtualJoystick('blue', { x: normX, y: normY });
    applyVirtualJoystick('red', { x: normX, y: normY });
  }, [applyVirtualJoystick]);

  const handlePointerDown = (e: React.PointerEvent) => {
    setJoystickActive(true);
    handleJoystickMove(e.clientX, e.clientY);
  };

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      if (joystickActive) {
        handleJoystickMove(e.clientX, e.clientY);
      }
    };
    const onPointerUp = () => {
      if (joystickActive) {
        setJoystickActive(false);
        setKnobPos({ x: 0, y: 0 });
        setSteerInput('blue', 0);
        setSteerInput('red', 0);
        releaseThrottle('blue');
        releaseThrottle('red');
      }
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [joystickActive, handleJoystickMove, setSteerInput, releaseThrottle]);

  // Track progress calculations
  const blueDistRemaining = Math.max(0, Math.round((TRACK_FINISH_PROGRESS - bCtrl.trackProgress) * TRACK_TOTAL_LENGTH_METERS));
  const redDistRemaining = Math.max(0, Math.round((TRACK_FINISH_PROGRESS - rCtrl.trackProgress) * TRACK_TOTAL_LENGTH_METERS));
  const blueIsLeader = bCtrl.trackProgress >= rCtrl.trackProgress;

  // Mini-map coordinates along 2D SVG track curve
  const getMinimapCoords = (progress: number) => {
    const pt = getTrackPointAt(progress);
    const svgX = 60 + pt.x * 2.2;
    const svgY = 240 + (pt.z / 205) * 220;
    return { x: svgX, y: svgY };
  };

  const blueDot = getMinimapCoords(bCtrl.trackProgress);
  const redDot = getMinimapCoords(rCtrl.trackProgress);

  return (
    <div className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-between p-3 select-none">
      {/* ── TOP RACE STATUS & ADVANTAGE BANNER ── */}
      <div className="w-full flex items-start justify-between">
        {/* Blue Team Top Stat Tag */}
        <div className="flex items-center gap-2 bg-blue-950/80 backdrop-blur-md border-2 border-blue-500/80 px-4 py-2 rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.4)]">
          <div className="w-3.5 h-3.5 rounded-full bg-blue-500 animate-ping" />
          <div>
            <div className="text-[10px] font-black uppercase text-blue-300 tracking-wider">
              {blueTeam.name}
            </div>
            <div className="text-xs font-black text-white flex items-center gap-1.5">
              <span>{blueIsLeader ? '🥇 1st PLACE' : '🥈 2nd PLACE'}</span>
              <span className="text-blue-300 font-mono text-[10px]">({blueDistRemaining}m to flag)</span>
            </div>
            {bCtrl.hasAdvantage && (
              <div className="text-[9px] font-black text-yellow-300 bg-yellow-500/20 px-1.5 py-0.5 rounded border border-yellow-400/30 mt-0.5">
                ⚡ 3X NOS + POLE POSITION ADVANTAGE
              </div>
            )}
          </div>
        </div>

        {/* Center Mini-map Radar */}
        <div className="flex flex-col items-center bg-slate-950/85 backdrop-blur-md border-2 border-slate-700/80 p-2.5 rounded-3xl shadow-2xl">
          <div className="text-[10px] font-black uppercase tracking-widest text-amber-400 flex items-center gap-1 mb-1">
            <Navigation className="w-3 h-3 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>CIRCUIT RADAR</span>
          </div>

          <div className="relative w-32 h-20 bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center">
            {/* SVG Curving Circuit Track */}
            <svg viewBox="0 0 120 260" className="w-full h-full p-2">
              {/* Asphalt Line */}
              <path
                d="M 60 240 C 60 210, 60 190, 80 160 C 100 130, 80 100, 30 70 C 20 50, 60 30, 60 10"
                fill="none"
                stroke="#334155"
                strokeWidth="16"
                strokeLinecap="round"
              />
              {/* Dashed Center Guide */}
              <path
                d="M 60 240 C 60 210, 60 190, 80 160 C 100 130, 80 100, 30 70 C 20 50, 60 30, 60 10"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              {/* Finish Line Checkered Mark */}
              <line x1="45" y1="20" x2="75" y2="20" stroke="#fbbf24" strokeWidth="4" strokeDasharray="3 3" />

              {/* Live Blue Racer Dot */}
              <circle
                cx={blueDot.x}
                cy={blueDot.y}
                r="7"
                fill="#3b82f6"
                stroke="#ffffff"
                strokeWidth="2"
                className="transition-all duration-75 shadow-lg"
              />

              {/* Live Red Racer Dot */}
              <circle
                cx={redDot.x}
                cy={redDot.y}
                r="7"
                fill="#ef4444"
                stroke="#ffffff"
                strokeWidth="2"
                className="transition-all duration-75 shadow-lg"
              />
            </svg>
          </div>
        </div>

        {/* Red Team Top Stat Tag */}
        <div className="flex items-center gap-2 bg-red-950/80 backdrop-blur-md border-2 border-red-500/80 px-4 py-2 rounded-2xl shadow-[0_0_20px_rgba(220,38,38,0.4)]">
          <div className="text-right">
            <div className="text-[10px] font-black uppercase text-red-300 tracking-wider">
              {redTeam.name}
            </div>
            <div className="text-xs font-black text-white flex items-center justify-end gap-1.5">
              <span className="text-red-300 font-mono text-[10px]">({redDistRemaining}m to flag)</span>
              <span>{!blueIsLeader ? '🥇 1st PLACE' : '🥈 2nd PLACE'}</span>
            </div>
            {rCtrl.hasAdvantage && (
              <div className="text-[9px] font-black text-yellow-300 bg-yellow-500/20 px-1.5 py-0.5 rounded border border-yellow-400/30 mt-0.5">
                ⚡ 3X NOS + POLE POSITION ADVANTAGE
              </div>
            )}
          </div>
          <div className="w-3.5 h-3.5 rounded-full bg-red-500 animate-ping" />
        </div>
      </div>

      {/* ── BOTTOM COCKPIT HUD CONTROLS ── */}
      <div className="w-full flex items-end justify-between gap-4">
        {/* ============================================================ */}
        {/* 1. BLUE TEAM CONTROLS (LEFT)                                  */}
        {/* ============================================================ */}
        <div className="pointer-events-auto flex flex-col gap-2.5 p-3 rounded-3xl bg-slate-950/90 backdrop-blur-lg border-3 border-blue-500/80 shadow-[0_0_35px_rgba(37,99,235,0.4)] max-w-[340px]">
          {/* Blue Speedometer & Tachometer Cluster */}
          <div className="flex items-center justify-between bg-slate-900/90 border border-blue-500/40 px-3 py-2 rounded-2xl">
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-3xl font-black text-white tracking-tighter drop-shadow">
                {bCtrl.speedKmh}
              </span>
              <span className="text-[10px] font-black text-blue-400">KM/H</span>
            </div>

            {/* Gear & RPM readout */}
            <div className="text-right">
              <div className="text-xs font-black text-amber-400">GEAR {bCtrl.gear}</div>
              <div className="text-[10px] font-mono text-slate-400">{bCtrl.rpm} RPM</div>
            </div>
          </div>

          {/* Blue NOS Nitrous Bar & Trigger */}
          <div className="flex items-center gap-2">
            <div className="flex-1 flex flex-col gap-1">
              <div className="flex items-center justify-between text-[10px] font-black text-blue-300">
                <span className="flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-blue-400" />
                  <span>NITROUS TANKS: {bCtrl.nitroCharges}x</span>
                </span>
                <span>{Math.round(bCtrl.nitroRemaining)}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden border border-blue-400/40">
                <div
                  className={`h-full transition-all duration-75 ${
                    bCtrl.nitroActive ? 'bg-cyan-300 shadow-[0_0_12px_#38bdf8]' : 'bg-blue-500'
                  }`}
                  style={{ width: `${bCtrl.nitroRemaining}%` }}
                />
              </div>
            </div>

            {/* NOS Button */}
            <button
              onPointerDown={() => triggerNitro('blue')}
              disabled={bCtrl.nitroCharges <= 0 && bCtrl.nitroRemaining <= 0}
              className={`px-3 py-2 rounded-xl font-black text-xs uppercase tracking-wider border-2 cursor-pointer transition active:scale-90 flex items-center gap-1 ${
                bCtrl.nitroActive
                  ? 'bg-cyan-400 text-slate-950 border-cyan-200 shadow-[0_0_20px_#22d3ee]'
                  : bCtrl.nitroCharges > 0
                  ? 'bg-blue-600 hover:bg-blue-500 text-white border-blue-300 shadow-[0_0_15px_rgba(37,99,235,0.6)]'
                  : 'bg-slate-800 text-slate-500 border-slate-700'
              }`}
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>NOS</span>
            </button>
          </div>

          {/* Blue Arrow D-Pad Controls */}
          <div className="flex items-center justify-center pt-1">
            <div className="grid grid-cols-3 gap-2 w-48">
              <div />
              {/* UP / THROTTLE */}
              <button
                onPointerDown={() => pressThrottle('blue')}
                onPointerUp={() => releaseThrottle('blue')}
                onPointerLeave={() => releaseThrottle('blue')}
                className="h-12 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-400 text-white font-black border-2 border-blue-300 shadow-md flex items-center justify-center cursor-pointer active:scale-90 transition"
              >
                <ChevronUp className="w-7 h-7" />
              </button>
              <div />

              {/* LEFT / STEER LEFT */}
              <button
                onPointerDown={() => switchLane('blue', 'left')}
                className="h-12 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-blue-600 text-white font-black border-2 border-slate-600 shadow-md flex items-center justify-center cursor-pointer active:scale-90 transition"
              >
                <ChevronLeft className="w-7 h-7" />
              </button>

              {/* DOWN / BRAKE */}
              <button
                onPointerDown={() => pressBrake('blue')}
                onPointerUp={() => releaseBrake('blue')}
                onPointerLeave={() => releaseBrake('blue')}
                className="h-12 rounded-xl bg-rose-600 hover:bg-rose-500 active:bg-rose-400 text-white font-black border-2 border-rose-300 shadow-md flex items-center justify-center cursor-pointer active:scale-90 transition"
              >
                <ChevronDown className="w-7 h-7" />
              </button>

              {/* RIGHT / STEER RIGHT */}
              <button
                onPointerDown={() => switchLane('blue', 'right')}
                className="h-12 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-blue-600 text-white font-black border-2 border-slate-600 shadow-md flex items-center justify-center cursor-pointer active:scale-90 transition"
              >
                <ChevronRight className="w-7 h-7" />
              </button>
            </div>
          </div>
          <div className="text-[9px] font-mono text-center text-blue-300">
            KEYBOARD: [W / A / S / D] + [SPACE / SHIFT]
          </div>
        </div>

        {/* ============================================================ */}
        {/* 2. CENTER VIRTUAL JOYSTICK & STEERING WHEEL                   */}
        {/* ============================================================ */}
        <div className="pointer-events-auto flex flex-col items-center gap-1">
          <div className="text-[10px] font-black uppercase tracking-widest text-amber-300 bg-black/80 px-3 py-1 rounded-full border border-amber-400/40">
            TOUCH JOYSTICK / STEERING WHEEL
          </div>

          <div
            ref={joystickBaseRef}
            onPointerDown={handlePointerDown}
            className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-slate-950/90 border-4 border-amber-400/80 shadow-[0_0_35px_rgba(251,191,36,0.3)] flex items-center justify-center touch-none cursor-grab active:cursor-grabbing backdrop-blur-lg"
          >
            {/* Background Crosshair Guides */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-full h-0.5 bg-amber-400/20" />
              <div className="h-full w-0.5 bg-amber-400/20 absolute" />
              <div className="w-20 h-20 rounded-full border border-amber-400/30" />
            </div>

            {/* Draggable Analog Joystick Knob */}
            <motion.div
              animate={{ x: knobPos.x, y: knobPos.y }}
              transition={{ type: 'spring', damping: 20, stiffness: 350 }}
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full border-3 shadow-2xl flex flex-col items-center justify-center text-slate-950 transition-colors ${
                joystickActive
                  ? 'bg-gradient-to-b from-amber-300 to-amber-500 border-white shadow-[0_0_25px_#f59e0b]'
                  : 'bg-gradient-to-b from-slate-200 to-slate-400 border-slate-700'
              }`}
            >
              <Gauge className="w-6 h-6 text-slate-950" />
              <span className="text-[8px] font-black uppercase tracking-tighter">STEER</span>
            </motion.div>
          </div>
          <div className="text-[9px] font-black text-slate-400 uppercase tracking-wider">
            DRAG TO ACCELERATE & STEER
          </div>
        </div>

        {/* ============================================================ */}
        {/* 3. RED TEAM CONTROLS (RIGHT)                                 */}
        {/* ============================================================ */}
        <div className="pointer-events-auto flex flex-col gap-2.5 p-3 rounded-3xl bg-slate-950/90 backdrop-blur-lg border-3 border-red-500/80 shadow-[0_0_35px_rgba(220,38,38,0.4)] max-w-[340px]">
          {/* Red Speedometer & Tachometer Cluster */}
          <div className="flex items-center justify-between bg-slate-900/90 border border-red-500/40 px-3 py-2 rounded-2xl">
            {/* Gear & RPM readout */}
            <div>
              <div className="text-xs font-black text-amber-400">GEAR {rCtrl.gear}</div>
              <div className="text-[10px] font-mono text-slate-400">{rCtrl.rpm} RPM</div>
            </div>

            <div className="flex items-baseline gap-1 text-right">
              <span className="font-mono text-3xl font-black text-white tracking-tighter drop-shadow">
                {rCtrl.speedKmh}
              </span>
              <span className="text-[10px] font-black text-red-400">KM/H</span>
            </div>
          </div>

          {/* Red NOS Nitrous Bar & Trigger */}
          <div className="flex items-center gap-2">
            {/* NOS Button */}
            <button
              onPointerDown={() => triggerNitro('red')}
              disabled={rCtrl.nitroCharges <= 0 && rCtrl.nitroRemaining <= 0}
              className={`px-3 py-2 rounded-xl font-black text-xs uppercase tracking-wider border-2 cursor-pointer transition active:scale-90 flex items-center gap-1 ${
                rCtrl.nitroActive
                  ? 'bg-amber-400 text-slate-950 border-amber-200 shadow-[0_0_20px_#f59e0b]'
                  : rCtrl.nitroCharges > 0
                  ? 'bg-red-600 hover:bg-red-500 text-white border-red-300 shadow-[0_0_15px_rgba(220,38,38,0.6)]'
                  : 'bg-slate-800 text-slate-500 border-slate-700'
              }`}
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>NOS</span>
            </button>

            <div className="flex-1 flex flex-col gap-1">
              <div className="flex items-center justify-between text-[10px] font-black text-red-300">
                <span>{Math.round(rCtrl.nitroRemaining)}%</span>
                <span className="flex items-center gap-1">
                  <span>NITROUS TANKS: {rCtrl.nitroCharges}x</span>
                  <Flame className="w-3.5 h-3.5 text-red-400" />
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden border border-red-400/40">
                <div
                  className={`h-full transition-all duration-75 ${
                    rCtrl.nitroActive ? 'bg-amber-300 shadow-[0_0_12px_#f59e0b]' : 'bg-red-500'
                  }`}
                  style={{ width: `${rCtrl.nitroRemaining}%` }}
                />
              </div>
            </div>
          </div>

          {/* Red Arrow D-Pad Controls */}
          <div className="flex items-center justify-center pt-1">
            <div className="grid grid-cols-3 gap-2 w-48">
              <div />
              {/* UP / THROTTLE */}
              <button
                onPointerDown={() => pressThrottle('red')}
                onPointerUp={() => releaseThrottle('red')}
                onPointerLeave={() => releaseThrottle('red')}
                className="h-12 rounded-xl bg-red-600 hover:bg-red-500 active:bg-red-400 text-white font-black border-2 border-red-300 shadow-md flex items-center justify-center cursor-pointer active:scale-90 transition"
              >
                <ChevronUp className="w-7 h-7" />
              </button>
              <div />

              {/* LEFT / STEER LEFT */}
              <button
                onPointerDown={() => switchLane('red', 'left')}
                className="h-12 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-red-600 text-white font-black border-2 border-slate-600 shadow-md flex items-center justify-center cursor-pointer active:scale-90 transition"
              >
                <ChevronLeft className="w-7 h-7" />
              </button>

              {/* DOWN / BRAKE */}
              <button
                onPointerDown={() => pressBrake('red')}
                onPointerUp={() => releaseBrake('red')}
                onPointerLeave={() => releaseBrake('red')}
                className="h-12 rounded-xl bg-rose-600 hover:bg-rose-500 active:bg-rose-400 text-white font-black border-2 border-rose-300 shadow-md flex items-center justify-center cursor-pointer active:scale-90 transition"
              >
                <ChevronDown className="w-7 h-7" />
              </button>

              {/* RIGHT / STEER RIGHT */}
              <button
                onPointerDown={() => switchLane('red', 'right')}
                className="h-12 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-red-600 text-white font-black border-2 border-slate-600 shadow-md flex items-center justify-center cursor-pointer active:scale-90 transition"
              >
                <ChevronRight className="w-7 h-7" />
              </button>
            </div>
          </div>
          <div className="text-[9px] font-mono text-center text-red-300">
            KEYBOARD: [↑ / ← / ↓ / →] + [ENTER / NUM 0]
          </div>
        </div>
      </div>
    </div>
  );
};
