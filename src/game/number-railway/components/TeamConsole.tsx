// ============================================================
// THE GREAT NUMBER RAILWAY — Team Control Console
// Railway operator console for each team (Blue LEFT, Red RIGHT)
// Touch-friendly, simultaneous multi-touch support
// ============================================================

'use client';

import React, { useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRailwayStore } from '../store/railwayStore';
import { TeamId } from '../types';

interface TeamConsoleProps {
  team: TeamId;
}

export const TeamConsole: React.FC<TeamConsoleProps> = ({ team }) => {
  const teamState = useRailwayStore((s) =>
    team === 'blue' ? s.blueTeam : s.redTeam
  );
  const challenge = useRailwayStore((s) => s.activeChallenge);
  const phase = useRailwayStore((s) => s.phase);
  const setAnswer = useRailwayStore((s) => s.setTeamAnswer);
  const lockIn = useRailwayStore((s) => s.lockInTeam);
  const evaluate = useRailwayStore((s) => s.evaluateTeam);

  const consoleRef = useRef<HTMLDivElement>(null);

  const isBlue = team === 'blue';
  const teamLabel = isBlue ? 'BLUE ENGINEERS' : 'RED ENGINEERS';

  // Colors
  const primary = isBlue ? '#1e40af' : '#991b1b';
  const primaryLight = isBlue ? '#3b82f6' : '#ef4444';
  const primaryBg = isBlue ? '#1e3a5f' : '#5f1e1e';
  const primaryGlow = isBlue ? 'rgba(59,130,246,0.3)' : 'rgba(239,68,68,0.3)';
  const accentBorder = isBlue ? '#60a5fa' : '#f87171';

  // Handle option selection (pointer events for multi-touch)
  const handleSelect = useCallback(
    (value: number | string) => {
      if (teamState.isLockedIn || phase !== 'challenge') return;
      setAnswer(team, value);
    },
    [team, teamState.isLockedIn, phase, setAnswer]
  );

  // Handle lock-in
  const handleLockIn = useCallback(() => {
    if (teamState.isLockedIn || teamState.currentAnswer === null || phase !== 'challenge')
      return;
    lockIn(team);
    // Evaluate after small delay for drama
    setTimeout(() => evaluate(team), 600);
  }, [team, teamState, phase, lockIn, evaluate]);

  const showChallenge = phase === 'challenge' && challenge;

  return (
    <div
      ref={consoleRef}
      className="team-console"
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: `linear-gradient(180deg, ${primaryBg} 0%, #1a1a2e 100%)`,
        borderLeft: isBlue ? 'none' : `3px solid ${accentBorder}`,
        borderRight: isBlue ? `3px solid ${accentBorder}` : 'none',
        color: '#fff',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        overflow: 'hidden',
        touchAction: 'manipulation',
        userSelect: 'none',
      }}
      // Prevent touch events from propagating to other team
      onPointerDown={(e) => e.stopPropagation()}
    >
      {/* ── Team Header ── */}
      <div
        style={{
          padding: '8px 12px',
          background: `linear-gradient(135deg, ${primary}, ${primaryLight})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Team icon - engineer hat */}
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
            }}
          >
            🚂
          </div>
          <div>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '2px',
                opacity: 0.9,
              }}
            >
              {teamLabel}
            </div>
            <div style={{ fontSize: '9px', opacity: 0.7, letterSpacing: '1px' }}>
              RAILWAY OPERATOR
            </div>
          </div>
        </div>

        {/* Score */}
        <div
          style={{
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '8px',
            padding: '4px 12px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '18px', fontWeight: 800 }}>{teamState.score}</div>
          <div style={{ fontSize: '8px', opacity: 0.7, letterSpacing: '1px' }}>POINTS</div>
        </div>
      </div>

      {/* ── Stats Bar ── */}
      <div
        style={{
          display: 'flex',
          gap: '4px',
          padding: '6px 10px',
          background: 'rgba(0,0,0,0.2)',
          fontSize: '9px',
          flexShrink: 0,
        }}
      >
        <div style={{ flex: 1, textAlign: 'center', opacity: 0.8 }}>
          <div style={{ fontWeight: 700 }}>{teamState.routesCompleted}</div>
          <div>ROUTES</div>
        </div>
        <div
          style={{ width: '1px', background: 'rgba(255,255,255,0.15)' }}
        />
        <div style={{ flex: 1, textAlign: 'center', opacity: 0.8 }}>
          <div style={{ fontWeight: 700 }}>{teamState.deliveriesCount}</div>
          <div>DELIVERIES</div>
        </div>
        <div
          style={{ width: '1px', background: 'rgba(255,255,255,0.15)' }}
        />
        <div style={{ flex: 1, textAlign: 'center', opacity: 0.8 }}>
          <div style={{ fontWeight: 700 }}>×{teamState.streak}</div>
          <div>STREAK</div>
        </div>
      </div>

      {/* ── Challenge Area ── */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: '10px',
          gap: '8px',
          overflow: 'auto',
        }}
      >
        {showChallenge ? (
          <>
            {/* Mission context */}
            <div
              style={{
                background: 'rgba(0,0,0,0.25)',
                borderRadius: '8px',
                padding: '8px 10px',
                borderLeft: `3px solid ${accentBorder}`,
              }}
            >
              <div
                style={{
                  fontSize: '9px',
                  opacity: 0.7,
                  letterSpacing: '1.5px',
                  fontWeight: 700,
                  marginBottom: '4px',
                }}
              >
                MISSION BRIEFING
              </div>
              <div style={{ fontSize: '11px', lineHeight: 1.4, opacity: 0.9 }}>
                {challenge.context.narrative}
              </div>
            </div>

            {/* Question */}
            <div
              style={{
                background: `linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))`,
                borderRadius: '10px',
                padding: '12px',
                border: `1px solid rgba(255,255,255,0.1)`,
              }}
            >
              <div
                style={{
                  fontSize: '10px',
                  opacity: 0.6,
                  letterSpacing: '1.5px',
                  fontWeight: 700,
                  marginBottom: '6px',
                }}
              >
                SOLVE
              </div>
              <div
                style={{
                  fontSize: '15px',
                  fontWeight: 700,
                  lineHeight: 1.4,
                }}
              >
                {challenge.prompt}
              </div>

              {/* Number display */}
              {challenge.numberString && (
                <div
                  style={{
                    marginTop: '8px',
                    fontSize: '28px',
                    fontWeight: 800,
                    fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                    letterSpacing: '3px',
                    color: primaryLight,
                    textAlign: 'center',
                    padding: '8px',
                    background: 'rgba(0,0,0,0.3)',
                    borderRadius: '8px',
                  }}
                >
                  {challenge.numberString}
                </div>
              )}
            </div>

            {/* Answer Options */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              {challenge.options?.map((opt, idx) => {
                const isSelected = teamState.currentAnswer === opt.value;
                const isLocked = teamState.isLockedIn;

                return (
                  <motion.button
                    key={idx}
                    whileTap={!isLocked ? { scale: 0.96 } : {}}
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      handleSelect(opt.value);
                    }}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: isSelected
                        ? `2px solid ${primaryLight}`
                        : '2px solid rgba(255,255,255,0.15)',
                      borderRadius: '10px',
                      background: isSelected
                        ? `linear-gradient(135deg, ${primaryGlow}, rgba(0,0,0,0.3))`
                        : 'rgba(255,255,255,0.05)',
                      color: '#fff',
                      fontSize: '18px',
                      fontWeight: 700,
                      fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                      cursor: isLocked ? 'default' : 'pointer',
                      opacity: isLocked && !isSelected ? 0.4 : 1,
                      textAlign: 'center',
                      letterSpacing: '1px',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {opt.label}
                  </motion.button>
                );
              })}
            </div>

            {/* Lock-in Button */}
            {!teamState.isLockedIn && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  handleLockIn();
                }}
                style={{
                  width: '100%',
                  padding: '14px',
                  border: 'none',
                  borderRadius: '10px',
                  background:
                    teamState.currentAnswer !== null
                      ? `linear-gradient(135deg, ${primary}, ${primaryLight})`
                      : 'rgba(255,255,255,0.08)',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 800,
                  letterSpacing: '2px',
                  cursor:
                    teamState.currentAnswer !== null ? 'pointer' : 'default',
                  opacity: teamState.currentAnswer !== null ? 1 : 0.4,
                  textTransform: 'uppercase',
                }}
              >
                ⚡ CONFIRM ROUTE
              </motion.button>
            )}

            {/* Feedback */}
            <AnimatePresence>
              {teamState.lastFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    background: teamState.lastFeedback.isCorrect
                      ? 'rgba(34,197,94,0.2)'
                      : 'rgba(239,68,68,0.15)',
                    border: `1px solid ${
                      teamState.lastFeedback.isCorrect
                        ? 'rgba(34,197,94,0.4)'
                        : 'rgba(239,68,68,0.3)'
                    }`,
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontSize: '20px',
                      marginBottom: '4px',
                    }}
                  >
                    {teamState.lastFeedback.isCorrect ? '✅' : '🔍'}
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      lineHeight: 1.4,
                    }}
                  >
                    {teamState.lastFeedback.message}
                  </div>
                  {teamState.lastFeedback.isCorrect && (
                    <div
                      style={{
                        fontSize: '10px',
                        marginTop: '4px',
                        opacity: 0.7,
                      }}
                    >
                      Signal → GREEN | Train departing...
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          /* Waiting state */
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              opacity: 0.6,
            }}
          >
            <div style={{ fontSize: '36px' }}>🚂</div>
            <div
              style={{
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '2px',
                textAlign: 'center',
              }}
            >
              {phase === 'title'
                ? 'WAITING FOR DEPARTURE'
                : phase === 'train-journey'
                  ? 'TRAIN EN ROUTE...'
                  : phase === 'delivery'
                    ? 'DELIVERY COMPLETE!'
                    : phase === 'network-complete'
                      ? '🎉 NETWORK RESTORED!'
                      : 'STAND BY'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
