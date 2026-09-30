// ============================================================
// BLUEPRINT BLITZ — Physical Construction Workstation Console
// Heavy-duty industrial control console for Blue (LEFT) and Red (RIGHT):
// - Direct Multiple Choice Option Selection (A, B, C, D)
// - Neo-Brutalist Light Styling (#FFF8E7 Solid Cream casing with hazard safety trim)
// - 2-Chance System with Diagnostic Feedback & Coach Misconception Tips
// - Tactical Power-ups (50:50 Assist, Time Freeze, 2x Multiplier)
// - Integrated Digital Scratchpad for student rough work
// ============================================================

import React from 'react';
import {
  CheckCircle2,
  RotateCcw,
  Hammer,
  Sparkles,
  Zap,
  Target,
  Send,
} from 'lucide-react';
import { MechanicType, TeamBuild, TeamId } from '../types';
import { useBlueprintStore } from '../store/blueprintStore';
import { PowerUpTray } from '@/components/shared/PowerUpTray';
import { DigitalScratchpad } from '@/components/shared/DigitalScratchpad';

interface TeamControlPanelProps {
  teamId: TeamId;
  teamName: string;
  score: number;
  build: TeamBuild;
  mechanic?: MechanicType;
  isLocked: boolean;
  isConfirmed: boolean;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export const TeamControlPanel: React.FC<TeamControlPanelProps> = ({
  teamId,
  teamName,
  score,
  isLocked,
  isConfirmed,
}) => {
  const {
    selectOption,
    submitBuild,
    blueTeam,
    redTeam,
    bluePowerUps,
    redPowerUps,
    blueMisconception,
    redMisconception,
    usePowerUp5050,
    usePowerUpTimeFreeze,
    usePowerUp2x,
    activeChallenge,
  } = useBlueprintStore();

  const isBlue = teamId === 'blue';
  const teamState = isBlue ? blueTeam : redTeam;
  const otherTeam = isBlue ? redTeam : blueTeam;
  const teamPowerUps = isBlue ? bluePowerUps : redPowerUps;
  const misconception = isBlue ? blueMisconception : redMisconception;
  const scanResult = teamState.scanResult;

  // Check Comeback Surge: +25% bonus points when trailing
  const isTrailingByChallenges = otherTeam.completedChallengesCount - teamState.completedChallengesCount >= 2;
  const isTrailingByPoints = otherTeam.score - teamState.score >= 150;
  const isComebackSurge = isTrailingByChallenges || isTrailingByPoints;

  const isCorrect = scanResult?.isCorrect === true;
  const isWrong = scanResult !== null && scanResult?.isCorrect === false;

  const headerBgClass = isCorrect
    ? 'bg-emerald-600 text-white shadow-emerald-200'
    : isWrong
      ? 'bg-red-600 text-white shadow-red-200'
      : isBlue
        ? 'bg-blue-600 text-white'
        : 'bg-red-600 text-white';

  const workstationClass = isCorrect
    ? 'bb-workstation-correct ring-4 ring-emerald-500'
    : isWrong
      ? 'bb-workstation-wrong ring-4 ring-red-500'
      : isBlue
        ? 'bb-workstation-blue'
        : 'bb-workstation-red';

  const testSwitchClass = isBlue ? 'bb-test-switch-blue' : 'bb-test-switch-red';

  const selectedAnswer = teamState.selectedOption !== null ? teamState.selectedOption : teamState.inputAnswer;
  const eliminatedOptions = teamState.eliminatedOptions || [];

  return (
    <div
      className={`w-full max-w-[380px] flex flex-col gap-2.5 p-3.5 rounded-2xl ${workstationClass} select-none z-20 text-slate-950 max-h-[92vh] overflow-y-auto`}
    >
      {/* ── TOP BOLTS & HAZARD SAFETY STRIPING ── */}
      <div className="flex items-center justify-between px-1">
        <div className="bb-bolt" />
        <div className="h-2 flex-1 mx-3 rounded-full bb-hazard-stripe border border-slate-950" />
        <div className="bb-bolt" />
      </div>

      {/* ── COMEBACK SURGE NOTIFIER ── */}
      {isComebackSurge && (
        <div className="bg-amber-400 text-slate-950 px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1 shadow-md border-2 border-slate-950 animate-pulse">
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>⚡ COMEBACK SURGE (+25% BONUS POINTS)</span>
        </div>
      )}

      {/* ── CONSOLE WORKSTATION TEAM BANNER & 2-CHANCE BADGE ── */}
      <div
        className={`flex flex-col gap-1.5 p-2.5 rounded-xl font-black ${headerBgClass} shadow-md border-3 border-slate-950`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hammer className="w-5 h-5 stroke-[2.5]" />
            <span className="text-sm tracking-wider uppercase drop-shadow">{teamName}</span>
          </div>
          <div className="bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-lg text-xs font-black flex items-center gap-1 shadow border border-slate-950">
            <span>★</span>
            <span>{score} PTS</span>
          </div>
        </div>

        {/* 2-Chance Indicator Strip */}
        <div className="flex items-center justify-between text-[10px] font-black tracking-wide bg-slate-950/20 px-2 py-0.5 rounded-lg">
          <span className="text-white/80">ATTEMPT STATUS:</span>
          {isCorrect ? (
            <span className="bg-emerald-400 text-slate-950 px-2 py-0.5 rounded font-black">
              ✓ APPROVED
            </span>
          ) : teamState.attemptsLeft === 2 ? (
            <span className="bg-amber-300 text-slate-950 px-2 py-0.5 rounded font-black">
              CHANCE 1 OF 2
            </span>
          ) : teamState.attemptsLeft === 1 ? (
            <span className="bg-orange-400 text-slate-950 px-2 py-0.5 rounded font-black animate-pulse">
              CHANCE 2 OF 2 (FINAL)
            </span>
          ) : (
            <span className="bg-red-300 text-slate-950 px-2 py-0.5 rounded font-black">
              0 CHANCES LEFT
            </span>
          )}
        </div>
      </div>

      {/* ── TARGETED MISCONCEPTION HINT (On 1st error) ── */}
      {misconception && !isCorrect && teamState.attemptsLeft === 1 && (
        <div className="bg-amber-100 border-2 border-amber-500 p-2.5 rounded-xl text-left shadow-md flex items-start gap-2 animate-in fade-in">
          <span className="text-base shrink-0">💡</span>
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase tracking-wider text-amber-900">
              COACH TIP:
            </span>
            <span className="text-[11px] font-bold text-slate-900 leading-tight">
              {misconception}
            </span>
          </div>
        </div>
      )}

      {/* ── ACTIVE MISSION QUESTION CARD ── */}
      {activeChallenge && (
        <div className="bg-amber-100/95 border-3 border-amber-400 p-3 rounded-xl text-slate-950 flex flex-col gap-1 shadow-sm">
          <div className="flex items-center justify-between text-[9.5px] font-black text-amber-900 uppercase">
            <span className="flex items-center gap-1">
              <Target className="w-3.5 h-3.5" />
              <span>QUESTION #{activeChallenge.code}</span>
            </span>
            <span className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded-md font-black text-[9px] border border-slate-950">
              {activeChallenge.target.description}
            </span>
          </div>
          <p className="text-xs sm:text-sm font-black text-slate-950 leading-snug">
            {activeChallenge.prompt}
          </p>
        </div>
      )}

      {/* ── DIRECT MULTIPLE CHOICE OPTIONS GRID ── */}
      {activeChallenge && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1 text-[10px] font-black text-slate-700 uppercase tracking-wider">
            <span>SELECT YOUR ANSWER</span>
            <span className="text-amber-800 font-black">4 OPTIONS</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {activeChallenge.options.map((opt, idx) => {
              const isSelected = String(selectedAnswer).trim().toLowerCase() === String(opt).trim().toLowerCase();
              const isEliminated = eliminatedOptions.some(
                (elim) => String(elim).trim().toLowerCase() === String(opt).trim().toLowerCase()
              );
              const letter = OPTION_LETTERS[idx] || String(idx + 1);
              const isOptionDisabled =
                isLocked ||
                isConfirmed ||
                isEliminated ||
                teamState.attemptsLeft <= 0 ||
                (teamState.scanResult !== null && teamState.scanResult.isCorrect);

              return (
                <button
                  key={`opt-${idx}-${opt}`}
                  type="button"
                  onClick={() => selectOption(teamId, opt)}
                  disabled={isOptionDisabled}
                  className={`p-2.5 rounded-xl font-black text-left transition-all flex items-center gap-2 border-3 select-none ${
                    isEliminated
                      ? 'bg-slate-200 border-slate-300 text-slate-400 line-through opacity-40 cursor-not-allowed'
                      : isOptionDisabled
                        ? 'bg-slate-100 border-slate-300 text-slate-400 opacity-60 cursor-not-allowed'
                        : isSelected
                          ? 'bg-amber-400 border-slate-950 text-slate-950 shadow-[4px_4px_0px_#000000] ring-2 ring-amber-300 scale-[1.02] cursor-pointer'
                          : 'bg-white hover:bg-amber-50 border-slate-800 text-slate-900 shadow-[2px_2px_0px_#000000] active:scale-95 cursor-pointer'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center shrink-0 border-2 ${
                      isSelected
                        ? 'bg-slate-950 text-amber-300 border-slate-950'
                        : 'bg-amber-100 text-slate-950 border-slate-800'
                    }`}
                  >
                    {letter}
                  </span>
                  <span className="text-xs sm:text-sm font-black leading-tight flex-1 break-words">
                    {opt}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── ANSWER STATUS FEEDBACK BANNER ── */}
      {scanResult && (
        <div
          className={`p-2.5 rounded-xl border-2 flex items-start gap-2 shadow-md ${
            isCorrect
              ? 'bg-emerald-600 border-emerald-800 text-white animate-pulse'
              : teamState.attemptsLeft === 1
                ? 'bg-amber-600 border-amber-800 text-white'
                : 'bg-red-700 border-red-900 text-white'
          }`}
        >
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
            {isCorrect ? (
              <CheckCircle2 className="w-4 h-4 text-white stroke-[3]" />
            ) : (
              <span className="text-white text-xs font-black">✕</span>
            )}
          </div>
          <div className="flex flex-col text-left leading-tight">
            <span className="text-xs font-black uppercase tracking-wider">
              {isCorrect
                ? '✓ CORRECT! OPTION APPROVED'
                : teamState.attemptsLeft === 1
                  ? '✕ CHANCE 1 WRONG (1 TRY LEFT)'
                  : '✕ 2 CHANCES EXHAUSTED'}
            </span>
            <span className="text-[10px] text-white/95 font-medium mt-0.5">
              {isCorrect
                ? `+${scanResult.scoreBreakdown.total} PTS AWARDED!`
                : `${scanResult.diffMessage}`}
            </span>
          </div>
        </div>
      )}

      {/* ── 2-CHANCE SUBMIT BUTTON ── */}
      <button
        type="button"
        onClick={() => submitBuild(teamId)}
        disabled={
          isLocked ||
          isConfirmed ||
          !selectedAnswer ||
          teamState.attemptsLeft <= 0 ||
          (teamState.scanResult !== null && teamState.scanResult.isCorrect)
        }
        className={`w-full py-3.5 rounded-xl font-black text-sm sm:text-base tracking-wider uppercase flex items-center justify-center gap-2 border-3 border-slate-950 cursor-pointer ${
          isConfirmed || (teamState.scanResult !== null && teamState.scanResult.isCorrect)
            ? 'bg-emerald-600 hover:bg-emerald-500 text-white ring-2 ring-emerald-300'
            : isWrong && teamState.attemptsLeft === 1
              ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 ring-2 ring-amber-300 shadow-[4px_4px_0px_#000000] active:scale-98'
              : isWrong
                ? 'bg-red-600 hover:bg-red-500 text-white ring-2 ring-red-300'
                : selectedAnswer
                  ? testSwitchClass + ' shadow-[4px_4px_0px_#000000] active:scale-98'
                  : 'bg-slate-200 text-slate-500 border-slate-400 cursor-not-allowed shadow-none'
        } disabled:opacity-50 disabled:cursor-not-allowed transition-all`}
      >
        {isConfirmed ? (
          <>
            <CheckCircle2 className="w-5 h-5 text-emerald-300" />
            <span>✓ ANSWER CONFIRMED</span>
          </>
        ) : teamState.attemptsLeft === 1 && !isCorrect ? (
          <>
            <RotateCcw className="w-5 h-5 stroke-[2.5]" />
            <span>REVISE & SUBMIT (CHANCE #2)</span>
          </>
        ) : teamState.attemptsLeft === 0 && !isCorrect ? (
          <>
            <span>✕ 2 CHANCES EXHAUSTED</span>
          </>
        ) : (
          <>
            <Send className="w-4 h-4 stroke-[2.5]" />
            <span>LOCK & SUBMIT (CHANCE 1 OF 2)</span>
          </>
        )}
      </button>

      {/* ── TACTICAL POWER-UPS TRAY ── */}
      <div className="bg-white/95 p-1.5 rounded-xl border-2 border-slate-300 shadow-sm">
        <PowerUpTray
          teamId={teamId}
          powerUps={teamPowerUps}
          onUse5050={() => usePowerUp5050(teamId)}
          onUseTimeFreeze={() => usePowerUpTimeFreeze(teamId)}
          onUse2x={() => usePowerUp2x(teamId)}
          disabled={isLocked || isConfirmed}
        />
      </div>

      {/* ── DIGITAL SCRATCHPAD (Rough Work) ── */}
      <div className="w-full">
        <DigitalScratchpad
          teamId={teamId}
          teamName={teamName}
        />
      </div>

      {/* ── BOTTOM BOLTS ── */}
      <div className="flex items-center justify-between px-1">
        <div className="bb-bolt" />
        <div className="bb-bolt" />
      </div>
    </div>
  );
};
