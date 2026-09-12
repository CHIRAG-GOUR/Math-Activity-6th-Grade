// ============================================================
// EQUATION MISSION CONTROL 2.0 — Symmetrical Team Control Console
// Perfectly Identical Sizing & Porcelain Styling to Train Game:
// - Fixed dimensions: w-[270px] min-w-[270px] max-w-[270px]
// - Compact question card & clean typography
// - Turn-based first answerer & rebound indicator
// - Guaranteed solid Blue/Red selected states with bold white text
// - Tactical Power-ups, Scratchpad, Comeback Surge & Coach Tips
// ============================================================

'use client';

import React, { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMissionControlStore } from '../store/missionControlStore';
import { TeamId } from '../types';
import { soundManager } from '@/utils/audio';
import { PowerUpTray } from '@/components/shared/PowerUpTray';
import { DigitalScratchpad } from '@/components/shared/DigitalScratchpad';

interface Props {
  team: TeamId;
}

export const TeamMissionConsole: React.FC<Props> = ({ team }) => {
  const isBlue = team === 'blue';
  const teamState = useMissionControlStore((s) => (isBlue ? s.blueTeam : s.redTeam));
  const otherTeamState = useMissionControlStore((s) => (isBlue ? s.redTeam : s.blueTeam));
  const challenge = useMissionControlStore((s) => s.activeChallenge);
  const stageIndex = useMissionControlStore((s) => s.currentStageIndex);
  const targetStages = useMissionControlStore((s) => s.targetStages);
  const phase = useMissionControlStore((s) => s.phase);

  // Power-Ups & Misconceptions
  const powerUps = useMissionControlStore((s) => (isBlue ? s.bluePowerUps : s.redPowerUps));
  const eliminatedOptions = useMissionControlStore((s) => (isBlue ? s.blueEliminatedOptions : s.redEliminatedOptions));
  const misconception = useMissionControlStore((s) => (isBlue ? s.blueMisconception : s.redMisconception));

  // Store actions
  const setAnswer = useMissionControlStore((s) => s.setTeamAnswer);
  const lockIn = useMissionControlStore((s) => s.lockInTeam);
  const use5050 = useMissionControlStore((s) => s.usePowerUp5050);
  const useTimeFreeze = useMissionControlStore((s) => s.usePowerUpTimeFreeze);
  const use2x = useMissionControlStore((s) => s.usePowerUp2x);

  const teamTitle = isBlue ? teamState.name || 'BLUE TEAM' : teamState.name || 'RED TEAM';
  const teamPrimaryColor = isBlue ? '#2563eb' : '#dc2626';
  const teamBorderColor = isBlue ? '#60a5fa' : '#f87171';
  const teamDarkBorder = isBlue ? '#1e40af' : '#991b1b';
  const headerGrad = isBlue
    ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'
    : 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)';

  const isPlayable = phase === 'active-mission' || phase === 'tie-break';

  // Check Comeback Surge
  const isComebackSurge =
    otherTeamState.stagesCleared - teamState.stagesCleared >= 2 ||
    otherTeamState.score - teamState.score >= 150;

  const handleSelectOption = useCallback(
    (val: number | string) => {
      if (teamState.isLocked || !isPlayable) return;
      setAnswer(team, val);
    },
    [team, teamState.isLocked, isPlayable, setAnswer]
  );

  const handleConfirmAnswer = useCallback(() => {
    if (teamState.isLocked || teamState.selectedAnswer === null || !isPlayable) return;
    lockIn(team);
  }, [team, teamState.isLocked, teamState.selectedAnswer, isPlayable, lockIn]);

  // Rebound prompt when other team got locked out
  const isReboundOpportunity =
    otherTeamState.isLocked && !teamState.isLocked && otherTeamState.lastResult === 'wrong';

  return (
    <div
      className="w-[270px] min-w-[270px] max-w-[270px] bg-white border-2 rounded-2xl shadow-2xl select-none overflow-hidden font-sans flex flex-col pointer-events-auto max-h-[94vh] overflow-y-auto"
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
            <h2 className="text-[11px] font-black tracking-wider uppercase leading-tight text-white truncate max-w-[130px]">
              {teamTitle}
            </h2>
            <div className="text-[8px] font-bold text-white/90 tracking-wide">
              {isBlue ? 'LEFT COMPLEX' : 'RIGHT COMPLEX'}
            </div>
          </div>
        </div>

        {/* Score & Streak Pill */}
        <div className="flex items-center gap-1.5">
          {teamState.streak > 1 && (
            <span className="px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-[9px] animate-bounce">
              🔥×{teamState.streak}
            </span>
          )}
          <div className="px-2 py-0.5 bg-black/30 rounded-md border border-white/30 text-center">
            <span className="text-xs font-black text-amber-300 leading-tight">
              {teamState.score} <span className="text-[7px] text-slate-200 uppercase font-bold">PTS</span>
            </span>
          </div>
        </div>
      </div>

      {/* ── COMEBACK SURGE BADGE ── */}
      {isComebackSurge && (
        <div className="px-2.5 py-1 bg-amber-400 border-b border-slate-900 text-slate-950 font-black text-[9px] uppercase tracking-wider flex items-center justify-center gap-1 animate-pulse">
          <span>⚡ COMEBACK SURGE (+25% BONUS ACTIVE)</span>
        </div>
      )}

      {/* ── 2. Rebound Notice or Stage Status Pill ── */}
      {isReboundOpportunity ? (
        <div className="px-2.5 py-1 bg-amber-100 border-b border-amber-300 flex items-center justify-center text-[9px] font-black text-amber-900 animate-pulse">
          ⚡ REBOUND CHANCE — ANSWER TO STEAL!
        </div>
      ) : !teamState.isLocked && teamState.attemptsLeft === 1 ? (
        <div className="px-2.5 py-1 bg-amber-100 border-b border-amber-300 flex items-center justify-center text-[9px] font-black text-amber-900 animate-pulse">
          ⚠️ 1 ATTEMPT REMAINING — TRY AGAIN!
        </div>
      ) : challenge ? (
        <div
          className="px-2.5 py-1 border-b flex items-center justify-between text-xs font-black"
          style={{
            backgroundColor: isBlue ? '#eff6ff' : '#fef2f2',
            color: isBlue ? '#1e40af' : '#991b1b',
            borderColor: isBlue ? '#bfdbfe' : '#fecaca',
          }}
        >
          <div className="flex items-center gap-1 font-black text-[9px] uppercase tracking-tight truncate max-w-[170px]">
            <span>🚀</span>
            <span>STAGE 0{stageIndex + 1}: {challenge.stageTitle.replace('STAGE ', '').split(':')[1] || challenge.stageTitle}</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <span
              className={`text-[8px] font-black px-1.5 py-0.2 rounded border ${
                teamState.stagesCleared >= (targetStages - 1)
                  ? 'bg-emerald-500 text-white border-emerald-600 animate-pulse'
                  : 'bg-slate-100 border-slate-300 text-slate-700'
              }`}
            >
              {teamState.stagesCleared}/{targetStages} GO
            </span>
            <span className="text-[8px] font-black px-1.5 py-0.2 rounded bg-white border border-slate-300 text-slate-800">
              +{challenge.points}P
            </span>
          </div>
        </div>
      ) : null}

      {/* ── TARGETED MISCONCEPTION COACH TIP (On 1st error) ── */}
      {misconception && !teamState.isLocked && teamState.attemptsLeft === 1 && (
        <div className="px-2.5 py-1.5 bg-amber-50 border-b border-amber-300 text-slate-900 text-[9px] font-bold text-left flex items-start gap-1">
          <span className="text-xs shrink-0">💡</span>
          <div>
            <span className="font-black text-amber-900 uppercase block text-[8px]">COACH TIP:</span>
            <span>{misconception}</span>
          </div>
        </div>
      )}

      {/* ── 3. Subsystem Physical Preparation Bar ── */}
      <div className="px-2 py-1 bg-slate-100 border-b border-slate-200 flex items-center justify-between gap-1">
        {[
          { icon: '💻', desc: 'AVN' },
          { icon: '⛽', desc: 'FUEL' },
          { icon: '🔥', desc: 'WELD' },
          { icon: '🟢', desc: 'BRAKE' },
          { icon: '🚀', desc: 'LAUNCH' },
        ].map((step, idx) => {
          const isCompleted = idx < teamState.stagesCleared;
          const isNext = idx === teamState.stagesCleared;

          return (
            <div
              key={idx}
              title={`Step ${idx + 1}: ${isCompleted ? 'READY' : isNext ? 'IN PROGRESS' : 'LOCKED'}`}
              className={`flex-1 py-1 rounded-md text-center border transition-all flex flex-col items-center justify-center ${
                isCompleted
                  ? isBlue
                    ? 'bg-blue-600 border-blue-700 text-white shadow-xs'
                    : 'bg-red-600 border-red-700 text-white shadow-xs'
                  : isNext
                  ? 'bg-amber-200 border-amber-400 text-amber-950 font-black animate-pulse'
                  : 'bg-white border-slate-200 text-slate-400'
              }`}
            >
              <span className="text-[9px] leading-none">{step.icon}</span>
              <span className="text-[6.5px] font-black uppercase leading-none mt-0.5">
                {step.desc}
              </span>
            </div>
          );
        })}
      </div>

      {/* ── 4. Interactive Challenge Content ── */}
      <div className="p-2.5 flex flex-col gap-2 bg-slate-50 overflow-y-auto max-h-[340px] mc-scrollbar">
        {isPlayable && challenge ? (
          <>
            {/* Compact Question Card */}
            <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[8px] font-black uppercase tracking-wider text-amber-700 block mb-0.5">
                TELEMETRY DIRECTIVE
              </span>
              <h3 className="text-[11px] font-black text-slate-900 leading-snug">
                {challenge.briefingPrompt}
              </h3>
            </div>

            {/* 4 Multiple Choice Answer Options Grid */}
            <div className="flex flex-col gap-1.5">
              {challenge.options.map((opt, i) => {
                const isSelected =
                  teamState.selectedAnswer !== null &&
                  String(teamState.selectedAnswer) === String(opt.value);
                const isEliminated = eliminatedOptions.some(
                  (eo) => String(eo).trim().toLowerCase() === String(opt.value).trim().toLowerCase()
                );
                const isLocked = teamState.isLocked || isEliminated;

                return (
                  <motion.button
                    key={i}
                    whileTap={!isLocked ? { scale: 0.97 } : {}}
                    onClick={() => handleSelectOption(opt.value)}
                    disabled={isLocked}
                    className={`w-full py-2 px-2.5 rounded-xl font-mono text-xs font-black text-center transition-all duration-150 border-2 shadow-xs cursor-pointer ${
                      isEliminated ? 'line-through opacity-25 cursor-not-allowed bg-slate-200 text-slate-400' : ''
                    }`}
                    style={{
                      backgroundColor: isSelected ? teamPrimaryColor : isEliminated ? '#e2e8f0' : '#ffffff',
                      color: isSelected ? '#ffffff' : isEliminated ? '#94a3b8' : '#0f172a',
                      borderColor: isSelected ? teamDarkBorder : isEliminated ? '#cbd5e1' : '#cbd5e1',
                      opacity: isEliminated ? 0.3 : isLocked && !isSelected ? 0.35 : 1,
                      boxShadow: isSelected
                        ? `0 3px 10px ${isBlue ? 'rgba(37, 99, 235, 0.35)' : 'rgba(220, 38, 38, 0.35)'}`
                        : '0 1px 2px rgba(0,0,0,0.04)',
                    }}
                  >
                    {opt.label}
                  </motion.button>
                );
              })}
            </div>

            {/* Lock In / Confirm Route Button */}
            {!teamState.isLocked ? (
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handleConfirmAnswer}
                disabled={teamState.selectedAnswer === null}
                className="w-full py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all duration-150 border-2"
                style={{
                  backgroundColor:
                    teamState.selectedAnswer !== null ? teamPrimaryColor : '#f1f5f9',
                  color: teamState.selectedAnswer !== null ? '#ffffff' : '#94a3b8',
                  borderColor:
                    teamState.selectedAnswer !== null ? teamDarkBorder : '#e2e8f0',
                  cursor:
                    teamState.selectedAnswer !== null ? 'pointer' : 'not-allowed',
                  boxShadow:
                    teamState.selectedAnswer !== null
                      ? `0 4px 12px ${isBlue ? 'rgba(37, 99, 235, 0.3)' : 'rgba(220, 38, 38, 0.3)'}`
                      : 'none',
                }}
              >
                🚀 LOCK IN TELEMETRY
              </motion.button>
            ) : (
              <div
                className="w-full py-2 rounded-xl border-2 text-center font-black text-[10px] shadow-xs"
                style={{
                  backgroundColor: teamState.lastResult === 'wrong' ? '#fee2e2' : '#fef3c7',
                  borderColor: teamState.lastResult === 'wrong' ? '#ef4444' : '#f59e0b',
                  color: teamState.lastResult === 'wrong' ? '#991b1b' : '#78350f',
                }}
              >
                {teamState.lastResult === 'wrong'
                  ? '❌ LOCKED OUT — REBOUND ACTIVE'
                  : '⏳ TELEMETRY LOCKED IN...'}
              </div>
            )}

            {/* Live Feedback Banner */}
            <AnimatePresence>
              {teamState.lastFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-1.5 rounded-lg border text-[9px] font-black leading-tight text-center shadow-xs"
                  style={{
                    backgroundColor: teamState.lastFeedback.isCorrect ? '#ecfdf5' : '#fef2f2',
                    borderColor: teamState.lastFeedback.isCorrect ? '#34d399' : '#f87171',
                    color: teamState.lastFeedback.isCorrect ? '#065f46' : '#991b1b',
                  }}
                >
                  {teamState.lastFeedback.message}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          /* Standby / Liftoff State */
          <div className="py-6 flex flex-col items-center justify-center text-center gap-1.5">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-xl animate-bounce">
              {phase === 'countdown' ? '⏱️' : phase === 'launch-cinematic' ? '🚀' : '⚙️'}
            </div>
            <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-tight">
              {phase === 'countdown'
                ? 'COUNTDOWN ACTIVE!'
                : phase === 'launch-cinematic'
                ? 'ROCKET LIFTOFF!'
                : 'MISSION STANDBY'}
            </h4>
          </div>
        )}
      </div>

      {/* ── TACTICAL POWER-UPS TRAY ── */}
      <div className="px-2 py-1.5 bg-white border-t border-slate-200">
        <PowerUpTray
          teamId={team}
          powerUps={powerUps}
          onUse5050={() => use5050(team)}
          onUseTimeFreeze={() => useTimeFreeze(team)}
          onUse2x={() => use2x(team)}
          disabled={teamState.isLocked || !isPlayable}
        />
      </div>

      {/* ── DIGITAL SCRATCHPAD (Rough Work) ── */}
      <div className="p-1.5 bg-slate-50 border-t border-slate-200">
        <DigitalScratchpad
          teamId={team}
          teamName={teamTitle}
        />
      </div>
    </div>
  );
};

