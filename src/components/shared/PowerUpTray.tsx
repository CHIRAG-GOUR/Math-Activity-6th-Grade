// ============================================================
// SKILLIZEE ARCADE — Tactical Power-Up Tray
// Grade 6 Classroom Power-Ups (1 of each per match per team):
// 1. 50:50 Eliminator: Removes 2 incorrect options
// 2. Time Freeze (+10s): Adds 10 bonus seconds to countdown
// 3. 2x Multiplier: Doubles score earned on current question
// ============================================================

'use client';

import React from 'react';
import { TeamPowerUps, TeamId } from '@/types/powerUps';
import { soundManager } from '@/utils/audio';
import { Zap, Clock, Sparkles } from 'lucide-react';

interface Props {
  teamId: TeamId;
  powerUps: TeamPowerUps;
  onUse5050: () => void;
  onUseTimeFreeze: () => void;
  onUse2x: () => void;
  disabled?: boolean;
}

export const PowerUpTray: React.FC<Props> = ({
  teamId,
  powerUps,
  onUse5050,
  onUseTimeFreeze,
  onUse2x,
  disabled = false,
}) => {
  const isBlue = teamId === 'blue';

  const handle5050 = () => {
    if (disabled || !powerUps.fiftyFifty) return;
    soundManager.play('powerup');
    onUse5050();
  };

  const handleTimeFreeze = () => {
    if (disabled || !powerUps.timeFreeze) return;
    soundManager.play('powerup');
    onUseTimeFreeze();
  };

  const handle2x = () => {
    if (disabled || !powerUps.doublePoints) return;
    soundManager.play('powerup');
    onUse2x();
  };

  return (
    <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 border-2 border-black shadow-[2px_2px_0px_#000000] select-none pointer-events-auto">
      {/* ── 1. 50:50 Eliminator ── */}
      <button
        type="button"
        onClick={handle5050}
        disabled={disabled || !powerUps.fiftyFifty}
        title={powerUps.fiftyFifty ? '50:50 Eliminator: Removes 2 wrong options' : '50:50 Already Used'}
        className={`flex items-center gap-1 px-2 py-1 rounded-lg font-black text-[10px] uppercase tracking-wider transition-all border ${
          powerUps.fiftyFifty && !disabled
            ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 border-amber-500 shadow-xs active:scale-95 cursor-pointer'
            : 'bg-slate-800 text-slate-500 border-slate-700 opacity-50 cursor-not-allowed'
        }`}
      >
        <Zap className="w-3 h-3 text-slate-950 stroke-[2.5]" />
        <span>50:50</span>
      </button>

      {/* ── 2. Time Freeze (+10s) ── */}
      <button
        type="button"
        onClick={handleTimeFreeze}
        disabled={disabled || !powerUps.timeFreeze}
        title={powerUps.timeFreeze ? 'Time Freeze: Adds +10s to timer' : '+10s Already Used'}
        className={`flex items-center gap-1 px-2 py-1 rounded-lg font-black text-[10px] uppercase tracking-wider transition-all border ${
          powerUps.timeFreeze && !disabled
            ? 'bg-cyan-400 hover:bg-cyan-300 text-slate-950 border-cyan-500 shadow-xs active:scale-95 cursor-pointer'
            : 'bg-slate-800 text-slate-500 border-slate-700 opacity-50 cursor-not-allowed'
        }`}
      >
        <Clock className="w-3 h-3 text-slate-950 stroke-[2.5]" />
        <span>+10s</span>
      </button>

      {/* ── 3. 2x Score Multiplier ── */}
      <button
        type="button"
        onClick={handle2x}
        disabled={disabled || (!powerUps.doublePoints && !powerUps.active2x)}
        title={
          powerUps.active2x
            ? '2x Multiplier ARMED for this question!'
            : powerUps.doublePoints
            ? '2x Multiplier: Double points on this question'
            : '2x Already Used'
        }
        className={`flex items-center gap-1 px-2 py-1 rounded-lg font-black text-[10px] uppercase tracking-wider transition-all border ${
          powerUps.active2x
            ? 'bg-red-500 text-white border-red-400 animate-pulse ring-2 ring-red-400 shadow-xs cursor-default'
            : powerUps.doublePoints && !disabled
            ? 'bg-purple-500 hover:bg-purple-400 text-white border-purple-400 shadow-xs active:scale-95 cursor-pointer'
            : 'bg-slate-800 text-slate-500 border-slate-700 opacity-50 cursor-not-allowed'
        }`}
      >
        <Sparkles className="w-3 h-3 text-white stroke-[2.5]" />
        <span>{powerUps.active2x ? '2X ARMED' : '2X PTS'}</span>
      </button>
    </div>
  );
};
