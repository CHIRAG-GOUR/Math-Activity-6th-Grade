// ============================================================
// GRAPHWORKS — THE DATA CITY: Main Game Component
// Orchestrates 3D world + Graph Studios + Scoring + Rounds
// ============================================================
'use client';

import React, { Suspense, useEffect, useCallback, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { DataCity3D } from '../world/DataCity3D';
import { GraphStudio } from './GraphStudio';
import { GraphworksHeader } from './GraphworksHeader';
import { GraphworksBriefing, GraphworksVictory } from './GraphworksBriefing';
import { useGraphworksStore } from '../store/graphworksStore';
import { getMissionForTeam, generateFinalChallenge } from '../data/questions';
import type { CityDistrict } from '../store/graphworksStore';

// ── MISSION FLOW CONTROLLER ──
function MissionController() {
  const gamePhase = useGraphworksStore((s) => s.gamePhase);
  const currentRound = useGraphworksStore((s) => s.currentRound);
  const blue = useGraphworksStore((s) => s.blue);
  const red = useGraphworksStore((s) => s.red);
  const setMission = useGraphworksStore((s) => s.setMission);
  const advanceRound = useGraphworksStore((s) => s.advanceRound);
  const setGamePhase = useGraphworksStore((s) => s.setGamePhase);

  // Districts to cycle through
  const districtOrder: CityDistrict[] = ['weather', 'traffic', 'water', 'power', 'train', 'park'];

  // Assign missions when round starts or mission completes
  const assignMissions = useCallback(() => {
    if (gamePhase !== 'playing') return;

    // Blue gets one district, Red gets another
    const blueDistrict = districtOrder[(currentRound - 1) % districtOrder.length];
    const redDistrict = districtOrder[(currentRound) % districtOrder.length];

    if (!blue.currentMission) {
      const mission = getMissionForTeam(currentRound, blueDistrict);
      setMission('blue', mission);
    }
    if (!red.currentMission) {
      const mission = getMissionForTeam(currentRound, redDistrict);
      setMission('red', mission);
    }
  }, [gamePhase, currentRound, blue.currentMission, red.currentMission, setMission]);

  useEffect(() => {
    assignMissions();
  }, [assignMissions]);

  // When feedback is dismissed, check if we should advance
  useEffect(() => {
    if (gamePhase !== 'feedback') return;

    const bothDone = blue.completedMissions > 0 && red.completedMissions > 0 &&
      blue.completedMissions === red.completedMissions;

    if (bothDone) {
      const timeout = setTimeout(() => {
        advanceRound();
        // Clear missions for next round
        setMission('blue', getMissionForTeam(
          Math.min(currentRound + 1, 5),
          districtOrder[(currentRound) % districtOrder.length]
        ));
        setMission('red', getMissionForTeam(
          Math.min(currentRound + 1, 5),
          districtOrder[(currentRound + 1) % districtOrder.length]
        ));
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [gamePhase, blue.completedMissions, red.completedMissions]);

  // Auto-assign new mission after completing one
  useEffect(() => {
    if (gamePhase === 'feedback' || gamePhase === 'playing') {
      if (!blue.currentMission && blue.completedMissions < 5) {
        const d = districtOrder[(blue.completedMissions) % districtOrder.length];
        setMission('blue', getMissionForTeam(currentRound, d));
      }
      if (!red.currentMission && red.completedMissions < 5) {
        const d = districtOrder[(red.completedMissions + 1) % districtOrder.length];
        setMission('red', getMissionForTeam(currentRound, d));
      }
    }
  }, [gamePhase, blue.currentMission, red.currentMission, blue.completedMissions, red.completedMissions]);

  return null;
}

// ── ROUND PROGRESS INDICATOR ──
function RoundProgress() {
  const currentRound = useGraphworksStore((s) => s.currentRound);
  const gamePhase = useGraphworksStore((s) => s.gamePhase);
  const advanceRound = useGraphworksStore((s) => s.advanceRound);

  if (gamePhase !== 'feedback' && gamePhase !== 'playing') return null;

  const roundNames = ['READ', 'COMPLETE', 'BUILD', 'INTERPRET', 'CREATE'];

  return (
    <div className="absolute top-14 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-md border border-gray-200">
      {roundNames.map((name, i) => {
        const roundNum = i + 1;
        const isActive = currentRound === roundNum;
        const isComplete = currentRound > roundNum;
        return (
          <div key={name} className="flex items-center gap-1">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black transition-all ${
              isComplete ? 'bg-green-500 text-white' :
              isActive ? 'bg-indigo-600 text-white ring-2 ring-indigo-300' :
              'bg-gray-200 text-gray-500'
            }`}>
              {isComplete ? '✓' : roundNum}
            </div>
            <span className={`text-[9px] font-semibold hidden sm:inline ${
              isActive ? 'text-indigo-700' : 'text-gray-400'
            }`}>{name}</span>
            {i < 4 && <span className="text-gray-300 text-[8px]">›</span>}
          </div>
        );
      })}

      {gamePhase === 'feedback' && currentRound < 5 && (
        <button
          onClick={advanceRound}
          className="ml-2 px-2 py-0.5 bg-indigo-600 text-white rounded-full text-[9px] font-bold hover:bg-indigo-700 transition-all"
        >
          Next Round ▸
        </button>
      )}
    </div>
  );
}

// ── DISTRICT LABELS (floating over 3D) ──
function DistrictLabels() {
  const districts = [
    { name: 'Weather Station', icon: '🌤', pos: { left: '5%', top: '25%' }, color: '#1565C0' },
    { name: 'Traffic Junction', icon: '🚗', pos: { left: '42%', top: '45%' }, color: '#E65100' },
    { name: 'Water Plant', icon: '💧', pos: { left: '18%', top: '35%' }, color: '#0277BD' },
    { name: 'Power Station', icon: '⚡', pos: { left: '72%', top: '35%' }, color: '#F57F17' },
    { name: 'Train Station', icon: '🚂', pos: { left: '42%', top: '58%' }, color: '#4527A0' },
    { name: 'City Park', icon: '🌳', pos: { left: '42%', top: '30%' }, color: '#2E7D32' },
  ];

  return (
    <>
      {districts.map((d) => (
        <div key={d.name} className="absolute z-10 pointer-events-none"
          style={{ left: d.pos.left, top: d.pos.top }}>
          <div className="bg-white/80 backdrop-blur-sm rounded-full px-2 py-0.5 shadow-sm border border-gray-200 flex items-center gap-1">
            <span className="text-[10px]">{d.icon}</span>
            <span className="text-[9px] font-bold" style={{ color: d.color }}>{d.name}</span>
          </div>
        </div>
      ))}
    </>
  );
}

// ── GRAPH RUN INDICATOR ──
function GraphRunIndicator() {
  const isRunningGraph = useGraphworksStore((s) => s.isRunningGraph);
  const runningTeam = useGraphworksStore((s) => s.runningTeam);
  const graphRunProgress = useGraphworksStore((s) => s.graphRunProgress);

  if (!isRunningGraph) return null;

  const color = runningTeam === 'blue' ? '#1976D2' : '#D32F2F';
  const teamName = runningTeam === 'blue' ? 'BLUE' : 'RED';

  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30">
      <div className="bg-white rounded-xl shadow-xl px-5 py-3 border-2 flex items-center gap-3"
        style={{ borderColor: color }}>
        <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: `${color} transparent ${color} ${color}` }} />
        <div>
          <div className="font-black text-xs" style={{ color }}>
            {teamName} GRAPH RUNNING
          </div>
          <div className="w-32 h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
            <div className="h-full rounded-full transition-all"
              style={{ width: `${graphRunProgress * 100}%`, background: color }} />
          </div>
        </div>
        <span className="text-lg">🏙️</span>
      </div>
    </div>
  );
}

import dynamic from 'next/dynamic';

const DataCityCanvas = dynamic(
  () => import('../world/DataCityCanvas').then((m) => m.DataCityCanvas),
  { ssr: false }
);

// ── MAIN GAME COMPONENT ──
export function GraphworksGame() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none bg-sky-100"
      style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
      {/* Load Inter font */}
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

      {/* ── FULLSCREEN 3D DATA CITY CANVAS ── */}
      <div className="absolute inset-0 z-0">
        <DataCityCanvas />
        <DistrictLabels />
        <GraphRunIndicator />
      </div>

      {/* ── BRIEFING MODAL ── */}
      <GraphworksBriefing />

      {/* ── VICTORY CINEMATIC ── */}
      <GraphworksVictory />

      {/* ── TOP SCOREBOARD & CONTROLS HEADER ── */}
      <div className="relative z-20 pointer-events-auto">
        <GraphworksHeader />
        <RoundProgress />
      </div>

      {/* ── MISSION CONTROLLER LOGIC ── */}
      <MissionController />

      {/* ── BOTTOM-LEFT CORNER: BLUE GRAPH STUDIO ── */}
      <div className="fixed z-30 bottom-2.5 left-2.5 w-[310px] min-w-[310px] max-w-[310px] pointer-events-auto">
        <GraphStudio team="blue" />
      </div>

      {/* ── BOTTOM-RIGHT CORNER: RED GRAPH STUDIO ── */}
      <div className="fixed z-30 bottom-2.5 right-2.5 w-[310px] min-w-[310px] max-w-[310px] pointer-events-auto">
        <GraphStudio team="red" />
      </div>
    </div>
  );
}
