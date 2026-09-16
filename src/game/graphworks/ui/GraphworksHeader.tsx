// ============================================================
// GRAPHWORKS — TOP SCOREBOARD & HEADER
// Premium arcade machine header with team scores and timer
// ============================================================
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useGraphworksStore } from '../store/graphworksStore';

export function GraphworksHeader() {
  const blue = useGraphworksStore((s) => s.blue);
  const red = useGraphworksStore((s) => s.red);
  const currentRound = useGraphworksStore((s) => s.currentRound);
  const gamePhase = useGraphworksStore((s) => s.gamePhase);
  const timer = useGraphworksStore((s) => s.timer);
  const isTimerRunning = useGraphworksStore((s) => s.isTimerRunning);

  const [displayTimer, setDisplayTimer] = useState(timer);

  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(() => {
      setDisplayTimer((t) => Math.max(0, t - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const minutes = Math.floor(displayTimer / 60);
  const seconds = displayTimer % 60;

  const roundNames = ['READ', 'COMPLETE', 'BUILD', 'INTERPRET', 'CREATE'];
  const roundName = roundNames[currentRound - 1] ?? 'BUILD';

  return (
    <div className="w-full flex items-center justify-between px-3 py-1.5"
      style={{
        background: 'linear-gradient(180deg, #1A237E 0%, #283593 100%)',
        borderBottom: '2px solid #3949AB',
      }}>
      {/* BLUE TEAM */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded bg-blue-500 flex items-center justify-center">
            <span className="text-white text-[10px] font-black">B</span>
          </div>
          <span className="text-white font-black text-xs tracking-wider">BLUE</span>
        </div>
        <div className="flex gap-3 text-[10px]">
          <div className="text-center">
            <div className="text-blue-300 font-semibold">Accuracy</div>
            <div className="text-white font-black">{blue.graphAccuracy}%</div>
          </div>
          <div className="text-center">
            <div className="text-blue-300 font-semibold">City</div>
            <div className="text-white font-black">Lv.{blue.cityLevel}</div>
          </div>
          <div className="text-center">
            <div className="text-blue-300 font-semibold">Score</div>
            <div className="text-white font-black">{blue.totalScore}</div>
          </div>
        </div>
      </div>

      {/* CENTER — TITLE + TIMER + ROUND */}
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-2">
          <span className="text-white/60 text-[9px] font-bold tracking-widest">GRAPHWORKS</span>
          <span className="text-[9px] text-yellow-300 font-black">THE DATA CITY</span>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <div className="bg-white/10 rounded px-2.5 py-0.5 border border-white/20">
            <span className="text-white font-mono font-black text-sm tracking-wider">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
          </div>
          <div className="bg-yellow-400/20 rounded px-2 py-0.5 border border-yellow-400/30">
            <span className="text-yellow-300 font-black text-[10px] tracking-wider">
              ROUND {currentRound}/5 — {roundName}
            </span>
          </div>
        </div>
      </div>

      {/* RED TEAM */}
      <div className="flex items-center gap-3">
        <div className="flex gap-3 text-[10px]">
          <div className="text-center">
            <div className="text-red-300 font-semibold">Accuracy</div>
            <div className="text-white font-black">{red.graphAccuracy}%</div>
          </div>
          <div className="text-center">
            <div className="text-red-300 font-semibold">City</div>
            <div className="text-white font-black">Lv.{red.cityLevel}</div>
          </div>
          <div className="text-center">
            <div className="text-red-300 font-semibold">Score</div>
            <div className="text-white font-black">{red.totalScore}</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-white font-black text-xs tracking-wider">RED</span>
          <div className="w-5 h-5 rounded bg-red-500 flex items-center justify-center">
            <span className="text-white text-[10px] font-black">R</span>
          </div>
        </div>
      </div>
    </div>
  );
}
