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
        <GraphRunIndicator />
      </div>

      {/* ── BRIEFING MODAL ── */}
      <GraphworksBriefing />

      {/* ── VICTORY CINEMATIC ── */}
      <GraphworksVictory />

      {/* ── TOP SCOREBOARD & CONTROLS HEADER ── */}
      <div className="relative z-20 pointer-events-auto">
        <GraphworksHeader />
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
