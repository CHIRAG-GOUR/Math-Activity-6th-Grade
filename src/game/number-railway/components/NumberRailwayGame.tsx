// ============================================================
// THE GREAT NUMBER RAILWAY — Main Game Component
// Layout: BLUE LEFT | 3D RAILWAY CENTER | RED RIGHT
// ============================================================

'use client';

import React, { useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useRailwayStore } from '../store/railwayStore';
import { TeamConsole } from './TeamConsole';
import { RailwayHUD } from './RailwayHUD';
import {
  RailwayTitleScreen,
  MissionBriefing,
  DeliveryOverlay,
  NetworkComplete,
} from './RailwayOverlays';

// Dynamic import of 3D scene (SSR disabled for Three.js)
const RailwayScene = dynamic(
  () => import('../world/RailwayScene').then((m) => ({ default: m.RailwayScene })),
  { ssr: false }
);

export const NumberRailwayGame: React.FC = () => {
  const phase = useRailwayStore((s) => s.phase);
  const blueTeam = useRailwayStore((s) => s.blueTeam);
  const redTeam = useRailwayStore((s) => s.redTeam);
  const challenge = useRailwayStore((s) => s.activeChallenge);
  const startTrainJourney = useRailwayStore((s) => s.startTrainJourney);
  const setTrainProgress = useRailwayStore((s) => s.setTrainProgress);
  const completeTrainJourney = useRailwayStore((s) => s.completeTrainJourney);
  const setPhase = useRailwayStore((s) => s.setPhase);

  // ── Train journey animation trigger ──
  // When both teams have answered (or one is correct), trigger train animation
  useEffect(() => {
    if (phase !== 'challenge') return;

    const bothAnswered = blueTeam.hasAnswered && redTeam.hasAnswered;
    const blueCorrect = blueTeam.isCorrect === true;
    const redCorrect = redTeam.isCorrect === true;

    if (!bothAnswered) return;

    // After both lock in, start train journey after a delay
    const timer = setTimeout(() => {
      if (blueCorrect && challenge?.railwayAction.trackSegmentId) {
        startTrainJourney('blue', challenge.railwayAction.trackSegmentId);
      }
      if (redCorrect && challenge?.railwayAction.trackSegmentId) {
        startTrainJourney('red', challenge.railwayAction.trackSegmentId);
      }

      // If neither correct, just go to delivery
      if (!blueCorrect && !redCorrect) {
        setPhase('delivery');
        return;
      }

      // Animate train progress
      let progress = 0;
      const journeyInterval = setInterval(() => {
        progress += 0.015;
        if (blueCorrect) setTrainProgress('blue', progress);
        if (redCorrect) setTrainProgress('red', progress);

        if (progress >= 1) {
          clearInterval(journeyInterval);
          if (blueCorrect) completeTrainJourney('blue');
          else if (redCorrect) completeTrainJourney('red');
        }
      }, 50);

      return () => clearInterval(journeyInterval);
    }, 1500);

    return () => clearTimeout(timer);
  }, [
    phase,
    blueTeam.hasAnswered,
    redTeam.hasAnswered,
    blueTeam.isCorrect,
    redTeam.isCorrect,
    challenge,
    startTrainJourney,
    setTrainProgress,
    completeTrainJourney,
    setPhase,
  ]);

  // ── Fullscreen handler ──
  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  }, []);

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: '#0f172a',
        overflow: 'hidden',
        position: 'relative',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
      }}
    >
      {/* ── Title Screen ── */}
      <RailwayTitleScreen />

      {/* ── Mission Briefing ── */}
      <MissionBriefing />

      {/* ── Delivery Complete ── */}
      <DeliveryOverlay />

      {/* ── Network Complete (Victory) ── */}
      <NetworkComplete />

      {/* ── Top HUD ── */}
      <RailwayHUD />

      {/* ── Main Game Area ── */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'row',
          marginTop: phase !== 'title' ? '52px' : '0',
          position: 'relative',
        }}
      >
        {/* ── BLUE TEAM CONSOLE (LEFT ~27%) ── */}
        <div
          style={{
            width: '27%',
            height: '100%',
            flexShrink: 0,
            zIndex: 10,
          }}
        >
          <TeamConsole team="blue" />
        </div>

        {/* ── 3D RAILWAY WORLD (CENTER ~46%) ── */}
        <div
          style={{
            flex: 1,
            height: '100%',
            position: 'relative',
          }}
        >
          <RailwayScene />

          {/* Fullscreen button (centered bottom) */}
          <button
            onClick={toggleFullscreen}
            style={{
              position: 'absolute',
              bottom: '8px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '6px',
              color: '#fff',
              padding: '4px 12px',
              fontSize: '10px',
              cursor: 'pointer',
              zIndex: 15,
              opacity: 0.6,
              letterSpacing: '1px',
              fontWeight: 600,
            }}
          >
            ⛶ FULLSCREEN
          </button>
        </div>

        {/* ── RED TEAM CONSOLE (RIGHT ~27%) ── */}
        <div
          style={{
            width: '27%',
            height: '100%',
            flexShrink: 0,
            zIndex: 10,
          }}
        >
          <TeamConsole team="red" />
        </div>
      </div>
    </div>
  );
};
