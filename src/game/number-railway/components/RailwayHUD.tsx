// ============================================================
// THE GREAT NUMBER RAILWAY — Top HUD Bar
// Mission title, timer, stage indicator, network progress
// ============================================================

'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useRailwayStore } from '../store/railwayStore';

export const RailwayHUD: React.FC = () => {
  const phase = useRailwayStore((s) => s.phase);
  const currentMission = useRailwayStore((s) => s.currentMission);
  const totalMissions = useRailwayStore((s) => s.totalMissions);
  const challenge = useRailwayStore((s) => s.activeChallenge);
  const blueScore = useRailwayStore((s) => s.blueTeam.score);
  const redScore = useRailwayStore((s) => s.redTeam.score);
  const networkProgress = useRailwayStore((s) => s.networkProgress);
  const timeRemaining = useRailwayStore((s) => s.timeRemaining);
  const timerActive = useRailwayStore((s) => s.timerActive);
  const setTime = useRailwayStore((s) => s.setTimeRemaining);
  const isMuted = useRailwayStore((s) => s.isMuted);
  const toggleMute = useRailwayStore((s) => s.toggleMute);

  // Timer countdown
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (timerActive && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTime(useRailwayStore.getState().timeRemaining - 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerActive, setTime]);

  // Stop timer when it hits 0
  useEffect(() => {
    if (timeRemaining <= 0 && timerActive) {
      useRailwayStore.getState().setTimerActive(false);
    }
  }, [timeRemaining, timerActive]);

  const timerColor =
    timeRemaining <= 10
      ? '#ef4444'
      : timeRemaining <= 20
        ? '#f59e0b'
        : '#22c55e';

  const missionTitle = challenge?.missionTitle || 'THE GREAT NUMBER RAILWAY';

  if (phase === 'title') return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '52px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 12px',
        background: 'linear-gradient(180deg, rgba(15,23,42,0.92) 0%, rgba(15,23,42,0.8) 100%)',
        borderBottom: '2px solid rgba(255,255,255,0.08)',
        zIndex: 20,
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        color: '#fff',
        pointerEvents: 'none',
      }}
    >
      {/* Blue Score */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '140px' }}>
        <div
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: '#3b82f6',
            boxShadow: '0 0 8px rgba(59,130,246,0.6)',
          }}
        />
        <div>
          <div style={{ fontSize: '9px', opacity: 0.6, letterSpacing: '1.5px', fontWeight: 700 }}>
            BLUE ENGINEERS
          </div>
          <div style={{ fontSize: '18px', fontWeight: 800 }}>{blueScore}</div>
        </div>
      </div>

      {/* Center: Mission info */}
      <div style={{ textAlign: 'center', flex: 1 }}>
        <div style={{ fontSize: '8px', opacity: 0.5, letterSpacing: '2px', fontWeight: 700 }}>
          MISSION {currentMission + 1} / {totalMissions}
        </div>
        <div style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '1.5px' }}>
          {missionTitle}
        </div>

        {/* Timer & progress */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginTop: '2px',
          }}
        >
          {timerActive && (
            <div
              style={{
                fontSize: '12px',
                fontWeight: 800,
                fontFamily: "'JetBrains Mono', monospace",
                color: timerColor,
              }}
            >
              ⏱ {timeRemaining}s
            </div>
          )}

          {/* Network progress bar */}
          <div
            style={{
              width: '80px',
              height: '4px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '2px',
              overflow: 'hidden',
            }}
          >
            <motion.div
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #22c55e, #86efac)',
                borderRadius: '2px',
              }}
              animate={{ width: `${networkProgress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div style={{ fontSize: '8px', opacity: 0.5 }}>{networkProgress}% NETWORK</div>
        </div>
      </div>

      {/* Red Score */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          minWidth: '140px',
          justifyContent: 'flex-end',
        }}
      >
        <div>
          <div
            style={{
              fontSize: '9px',
              opacity: 0.6,
              letterSpacing: '1.5px',
              fontWeight: 700,
              textAlign: 'right',
            }}
          >
            RED ENGINEERS
          </div>
          <div style={{ fontSize: '18px', fontWeight: 800, textAlign: 'right' }}>{redScore}</div>
        </div>
        <div
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: '#ef4444',
            boxShadow: '0 0 8px rgba(239,68,68,0.6)',
          }}
        />
      </div>

      {/* Mute button */}
      <button
        onPointerDown={(e) => {
          e.stopPropagation();
          toggleMute();
        }}
        style={{
          position: 'absolute',
          right: '8px',
          top: '4px',
          background: 'none',
          border: 'none',
          color: '#fff',
          fontSize: '14px',
          cursor: 'pointer',
          opacity: 0.5,
          pointerEvents: 'auto',
          padding: '4px',
        }}
      >
        {isMuted ? '🔇' : '🔊'}
      </button>
    </div>
  );
};
