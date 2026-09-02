// ============================================================
// THE GREAT NUMBER RAILWAY — Title Screen & Mission Briefing
// ============================================================

'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRailwayStore } from '../store/railwayStore';

// ── Title Screen ──
export const RailwayTitleScreen: React.FC = () => {
  const startGame = useRailwayStore((s) => s.startGame);
  const phase = useRailwayStore((s) => s.phase);

  if (phase !== 'title') return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'linear-gradient(135deg, #0f172a 0%, #1e3a5f 30%, #1a1a2e 70%, #5f1e1e 100%)',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        color: '#fff',
        gap: '20px',
      }}
    >
      {/* Railway tracks decoration */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '4px',
          background:
            'repeating-linear-gradient(90deg, #6b7280 0px, #6b7280 20px, transparent 20px, transparent 30px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '8px',
          left: 0,
          right: 0,
          height: '4px',
          background:
            'repeating-linear-gradient(90deg, #6b7280 0px, #6b7280 20px, transparent 20px, transparent 30px)',
        }}
      />

      {/* Title */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        style={{ textAlign: 'center' }}
      >
        <div
          style={{
            fontSize: '12px',
            letterSpacing: '6px',
            opacity: 0.5,
            fontWeight: 700,
            marginBottom: '8px',
          }}
        >
          GRADE 6 MATHEMATICS
        </div>
        <div
          style={{
            fontSize: '48px',
            fontWeight: 900,
            letterSpacing: '4px',
            lineHeight: 1.1,
            textShadow: '0 4px 20px rgba(0,0,0,0.5)',
          }}
        >
          THE GREAT
          <br />
          NUMBER RAILWAY
        </div>
        <div
          style={{
            marginTop: '12px',
            fontSize: '14px',
            letterSpacing: '3px',
            opacity: 0.6,
            fontWeight: 600,
          }}
        >
          PLACE VALUE & ROUNDING
        </div>
      </motion.div>

      {/* Locomotive emoji */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        style={{ fontSize: '64px' }}
      >
        🚂
      </motion.div>

      {/* Team indicators */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        style={{
          display: 'flex',
          gap: '40px',
          alignItems: 'center',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 8px',
              fontSize: '20px',
              boxShadow: '0 0 20px rgba(59,130,246,0.4)',
            }}
          >
            🔵
          </div>
          <div style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '2px' }}>
            BLUE ENGINEERS
          </div>
          <div style={{ fontSize: '8px', opacity: 0.5 }}>LEFT SIDE</div>
        </div>

        <div style={{ fontSize: '16px', fontWeight: 800, opacity: 0.4, letterSpacing: '3px' }}>
          VS
        </div>

        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #991b1b, #ef4444)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 8px',
              fontSize: '20px',
              boxShadow: '0 0 20px rgba(239,68,68,0.4)',
            }}
          >
            🔴
          </div>
          <div style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '2px' }}>
            RED ENGINEERS
          </div>
          <div style={{ fontSize: '8px', opacity: 0.5 }}>RIGHT SIDE</div>
        </div>
      </motion.div>

      {/* Start button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={startGame}
        style={{
          marginTop: '20px',
          padding: '16px 48px',
          background: 'linear-gradient(135deg, #d97706, #f59e0b)',
          border: 'none',
          borderRadius: '12px',
          color: '#1f2937',
          fontSize: '16px',
          fontWeight: 900,
          letterSpacing: '3px',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(217,119,6,0.4)',
          textTransform: 'uppercase',
        }}
      >
        🚂 ALL ABOARD
      </motion.button>

      {/* Bottom info */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          fontSize: '9px',
          opacity: 0.3,
          letterSpacing: '2px',
        }}
      >
        OPTIMIZED FOR CLASSROOM TOUCHSCREEN TVS • 1920×1080
      </div>
    </motion.div>
  );
};

// ── Mission Briefing Overlay ──
export const MissionBriefing: React.FC = () => {
  const phase = useRailwayStore((s) => s.phase);
  const challenge = useRailwayStore((s) => s.activeChallenge);
  const currentMission = useRailwayStore((s) => s.currentMission);
  const totalMissions = useRailwayStore((s) => s.totalMissions);
  const setPhase = useRailwayStore((s) => s.setPhase);
  const setTimerActive = useRailwayStore((s) => s.setTimerActive);
  const setTimeRemaining = useRailwayStore((s) => s.setTimeRemaining);

  if (phase !== 'briefing' || !challenge) return null;

  const handleStartMission = () => {
    setTimeRemaining(challenge.timeLimit);
    setTimerActive(true);
    setPhase('challenge');
  };

  const cargoIcon =
    challenge.context.cargoType === 'passengers'
      ? '👥'
      : challenge.context.cargoType === 'cargo'
        ? '📦'
        : challenge.context.cargoType === 'construction'
          ? '🏗️'
          : '📨';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(15,23,42,0.85)',
          backdropFilter: 'blur(4px)',
          fontFamily: "'Inter', 'Segoe UI', sans-serif",
          color: '#fff',
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          style={{
            maxWidth: '520px',
            width: '90%',
            background: 'linear-gradient(135deg, #1e293b, #0f172a)',
            borderRadius: '16px',
            padding: '28px',
            border: '1px solid rgba(255,255,255,0.1)',
            textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          }}
        >
          {/* Mission number */}
          <div
            style={{
              fontSize: '10px',
              letterSpacing: '3px',
              opacity: 0.5,
              fontWeight: 700,
            }}
          >
            MISSION {currentMission + 1} OF {totalMissions}
          </div>

          {/* Mission title */}
          <div
            style={{
              fontSize: '28px',
              fontWeight: 900,
              letterSpacing: '2px',
              marginTop: '8px',
              marginBottom: '16px',
            }}
          >
            {challenge.missionTitle}
          </div>

          {/* Cargo type */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              background: 'rgba(255,255,255,0.06)',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '1px',
              marginBottom: '16px',
            }}
          >
            <span>{cargoIcon}</span>
            {challenge.context.cargoType.toUpperCase()} TRANSPORT
          </div>

          {/* Narrative */}
          <div
            style={{
              fontSize: '13px',
              lineHeight: 1.6,
              opacity: 0.8,
              marginBottom: '20px',
              padding: '0 10px',
            }}
          >
            {challenge.context.narrative}
          </div>

          {/* Difficulty badge */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '12px',
              marginBottom: '20px',
              fontSize: '9px',
              letterSpacing: '1.5px',
              fontWeight: 700,
            }}
          >
            <span
              style={{
                padding: '4px 12px',
                background: 'rgba(34,197,94,0.15)',
                borderRadius: '12px',
                color: '#4ade80',
              }}
            >
              {challenge.difficulty.toUpperCase()}
            </span>
            <span
              style={{
                padding: '4px 12px',
                background: 'rgba(59,130,246,0.15)',
                borderRadius: '12px',
                color: '#60a5fa',
              }}
            >
              {challenge.bloomLevel.toUpperCase()}
            </span>
            <span
              style={{
                padding: '4px 12px',
                background: 'rgba(251,191,36,0.15)',
                borderRadius: '12px',
                color: '#fbbf24',
              }}
            >
              +{challenge.points} PTS
            </span>
          </div>

          {/* Start button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartMission}
            style={{
              padding: '14px 40px',
              background: 'linear-gradient(135deg, #d97706, #f59e0b)',
              border: 'none',
              borderRadius: '10px',
              color: '#1f2937',
              fontSize: '14px',
              fontWeight: 900,
              letterSpacing: '2px',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(217,119,6,0.3)',
            }}
          >
            🚂 START MISSION
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ── Delivery Complete Overlay ──
export const DeliveryOverlay: React.FC = () => {
  const phase = useRailwayStore((s) => s.phase);
  const challenge = useRailwayStore((s) => s.activeChallenge);
  const blueTeam = useRailwayStore((s) => s.blueTeam);
  const redTeam = useRailwayStore((s) => s.redTeam);
  const nextMission = useRailwayStore((s) => s.nextMission);

  if (phase !== 'delivery' || !challenge) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 35,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(15,23,42,0.7)',
        backdropFilter: 'blur(3px)',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        color: '#fff',
      }}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          maxWidth: '480px',
          width: '90%',
          background: 'linear-gradient(135deg, #1e293b, #0f172a)',
          borderRadius: '16px',
          padding: '28px',
          border: '1px solid rgba(34,197,94,0.3)',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}
      >
        <div style={{ fontSize: '40px', marginBottom: '8px' }}>✅</div>
        <div
          style={{
            fontSize: '22px',
            fontWeight: 900,
            letterSpacing: '2px',
            marginBottom: '8px',
          }}
        >
          DELIVERY COMPLETE
        </div>

        {/* Explanation */}
        <div
          style={{
            fontSize: '12px',
            lineHeight: 1.6,
            opacity: 0.8,
            marginBottom: '20px',
            padding: '12px',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '8px',
            borderLeft: '3px solid #22c55e',
            textAlign: 'left',
          }}
        >
          {challenge.explanation}
        </div>

        {/* Team results */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
          <div
            style={{
              flex: 1,
              padding: '12px',
              background: blueTeam.isCorrect
                ? 'rgba(59,130,246,0.15)'
                : 'rgba(255,255,255,0.03)',
              borderRadius: '8px',
              border: `1px solid ${blueTeam.isCorrect ? 'rgba(59,130,246,0.3)' : 'rgba(255,255,255,0.05)'}`,
            }}
          >
            <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '1.5px', opacity: 0.6 }}>
              BLUE ENGINEERS
            </div>
            <div
              style={{
                fontSize: '18px',
                fontWeight: 800,
                marginTop: '4px',
                color: blueTeam.isCorrect ? '#60a5fa' : '#6b7280',
              }}
            >
              {blueTeam.isCorrect ? `+${challenge.points}` : '—'}
            </div>
          </div>
          <div
            style={{
              flex: 1,
              padding: '12px',
              background: redTeam.isCorrect
                ? 'rgba(239,68,68,0.15)'
                : 'rgba(255,255,255,0.03)',
              borderRadius: '8px',
              border: `1px solid ${redTeam.isCorrect ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.05)'}`,
            }}
          >
            <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '1.5px', opacity: 0.6 }}>
              RED ENGINEERS
            </div>
            <div
              style={{
                fontSize: '18px',
                fontWeight: 800,
                marginTop: '4px',
                color: redTeam.isCorrect ? '#f87171' : '#6b7280',
              }}
            >
              {redTeam.isCorrect ? `+${challenge.points}` : '—'}
            </div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={nextMission}
          style={{
            padding: '12px 36px',
            background: 'linear-gradient(135deg, #d97706, #f59e0b)',
            border: 'none',
            borderRadius: '10px',
            color: '#1f2937',
            fontSize: '13px',
            fontWeight: 900,
            letterSpacing: '2px',
            cursor: 'pointer',
          }}
        >
          NEXT MISSION →
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

// ── Network Complete (Victory) Overlay ──
export const NetworkComplete: React.FC = () => {
  const phase = useRailwayStore((s) => s.phase);
  const blueTeam = useRailwayStore((s) => s.blueTeam);
  const redTeam = useRailwayStore((s) => s.redTeam);
  const networkProgress = useRailwayStore((s) => s.networkProgress);

  if (phase !== 'network-complete') return null;

  const winner =
    blueTeam.score > redTeam.score
      ? 'BLUE ENGINEERS'
      : redTeam.score > blueTeam.score
        ? 'RED ENGINEERS'
        : 'DRAW';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,58,95,0.95), rgba(95,30,30,0.95))',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        color: '#fff',
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{ textAlign: 'center', maxWidth: '600px' }}
      >
        <div style={{ fontSize: '60px', marginBottom: '16px' }}>🏆</div>
        <div
          style={{
            fontSize: '36px',
            fontWeight: 900,
            letterSpacing: '4px',
            marginBottom: '8px',
          }}
        >
          NETWORK RESTORED
        </div>
        <div
          style={{
            fontSize: '14px',
            letterSpacing: '3px',
            opacity: 0.6,
            marginBottom: '32px',
          }}
        >
          THE GREAT NUMBER RAILWAY IS OPERATIONAL
        </div>

        {/* Scores */}
        <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', marginBottom: '24px' }}>
          <div
            style={{
              padding: '20px 32px',
              background: 'rgba(59,130,246,0.15)',
              borderRadius: '12px',
              border: '1px solid rgba(59,130,246,0.3)',
            }}
          >
            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2px', opacity: 0.6 }}>
              BLUE ENGINEERS
            </div>
            <div
              style={{
                fontSize: '36px',
                fontWeight: 900,
                color: '#60a5fa',
              }}
            >
              {blueTeam.score}
            </div>
          </div>
          <div
            style={{
              padding: '20px 32px',
              background: 'rgba(239,68,68,0.15)',
              borderRadius: '12px',
              border: '1px solid rgba(239,68,68,0.3)',
            }}
          >
            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2px', opacity: 0.6 }}>
              RED ENGINEERS
            </div>
            <div
              style={{
                fontSize: '36px',
                fontWeight: 900,
                color: '#f87171',
              }}
            >
              {redTeam.score}
            </div>
          </div>
        </div>

        {/* Winner */}
        <div
          style={{
            fontSize: '20px',
            fontWeight: 900,
            letterSpacing: '3px',
            color: '#fbbf24',
          }}
        >
          {winner === 'DRAW'
            ? '🤝 PERFECT COOPERATION — IT\'S A DRAW!'
            : `🎉 WINNER: ${winner}`}
        </div>

        {/* Back button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.href = '/'}
          style={{
            marginTop: '24px',
            padding: '12px 36px',
            background: 'linear-gradient(135deg, #d97706, #f59e0b)',
            border: 'none',
            borderRadius: '10px',
            color: '#1f2937',
            fontSize: '13px',
            fontWeight: 900,
            letterSpacing: '2px',
            cursor: 'pointer',
          }}
        >
          RETURN TO ARCADE
        </motion.button>
      </motion.div>
    </motion.div>
  );
};
