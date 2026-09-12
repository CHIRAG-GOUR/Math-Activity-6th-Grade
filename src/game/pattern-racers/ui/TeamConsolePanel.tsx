// ============================================================
// PATTERN RACERS — Independent Team Console Panel
// Simultaneous Dual-Touch Mechanical Formula Control Consoles:
// - Left Panel (Blue Team) & Right Panel (Red Team)
// - Tactile Rotary Step Dials, Sequence Builders & Operator Wheels
// - Timer Countdown, Live Feedback & Misconception Coach Tips
// - Integrated PowerUpTray (50:50, Time Freeze, 2x Boost) & DigitalScratchpad
// ============================================================

'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePatternStore } from '../store/patternStore';
import { TeamId } from '../types';
import { PowerUpTray } from '@/components/shared/PowerUpTray';
import { DigitalScratchpad } from '@/components/shared/DigitalScratchpad';
import {
  CheckCircle2,
  Flame,
  Lightbulb,
  Timer,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface Props {
  teamId: TeamId;
}

export const TeamConsolePanel: React.FC<Props> = ({ teamId }) => {
  const currentRound = usePatternStore((s) => s.currentRound);
  const activeChallenge = usePatternStore((s) => s.activeChallenge);
  const timeRemaining = usePatternStore((s) => s.timeRemaining);

  const team = usePatternStore((s) => (teamId === 'blue' ? s.blueTeam : s.redTeam));
  const opponent = usePatternStore((s) => (teamId === 'blue' ? s.redTeam : s.blueTeam));

  // Store actions
  const updateBlueStep = usePatternStore((s) => s.updateBlueStep);
  const updateRedStep = usePatternStore((s) => s.updateRedStep);
  const updateBlueBuilder = usePatternStore((s) => s.updateBlueBuilder);
  const updateRedBuilder = usePatternStore((s) => s.updateRedBuilder);
  const updateBlueOutput = usePatternStore((s) => s.updateBlueOutput);
  const updateRedOutput = usePatternStore((s) => s.updateRedOutput);
  const updateBlueOperator = usePatternStore((s) => s.updateBlueOperator);
  const updateRedOperator = usePatternStore((s) => s.updateRedOperator);
  const updateBlueHybrid = usePatternStore((s) => s.updateBlueHybrid);
  const updateRedHybrid = usePatternStore((s) => s.updateRedHybrid);
  const submitAnswer = usePatternStore((s) => s.submitAnswer);
  const usePowerUp5050 = usePatternStore((s) => s.usePowerUp5050);
  const usePowerUpTimeFreeze = usePatternStore((s) => s.usePowerUpTimeFreeze);
  const usePowerUp2x = usePatternStore((s) => s.usePowerUp2x);

  const isBlue = teamId === 'blue';
  const isSurging = opponent.score - team.score >= 150;

  // Grade 6 Friendly Step choices for Round 1
  const STEP_CHOICES = [-8, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8, 10];
  const OPERATORS: ('+' | '-' | '×' | '÷')[] = ['+', '-', '×', '÷'];

  return (
    <div className="w-full h-full flex flex-col justify-between p-2 sm:p-2.5 bg-slate-100 border-2 border-slate-300 select-none overflow-y-auto">
      {/* ── 1. CONSOLE TOP HEADER (Team Badge, Score & Timer) ── */}
      <div
        className={`p-2.5 rounded-xl border-3 border-slate-900 shadow-sm flex items-center justify-between text-white ${
          isBlue ? 'bg-blue-600' : 'bg-red-600'
        }`}
      >
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-80">
              {isBlue ? 'CONSOLE #01' : 'CONSOLE #02'}
            </span>
            <span className="px-1.5 py-0.2 bg-black/40 rounded text-[9px] font-mono font-bold">
              ⏱️ {timeRemaining}s
            </span>
          </div>
          <h3 className="text-base font-black uppercase tracking-tight">{team.name}</h3>
        </div>
        <div className="px-3 py-1 bg-white text-slate-950 rounded-lg border-2 border-slate-900 font-mono font-black text-sm shadow-[2px_2px_0px_#000000]">
          {team.score} PTS
        </div>
      </div>

      {/* ── 2. COMEBACK SURGE BADGE ── */}
      {isSurging && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="my-1 p-1 bg-amber-400 border-2 border-black rounded-lg text-slate-950 font-black text-[10px] flex items-center justify-center gap-1 shadow-[2px_2px_0px_#000000]"
        >
          <Flame className="w-3.5 h-3.5 fill-red-600 text-red-600 animate-bounce" />
          <span>COMEBACK SURGE ACTIVE (+25% PTS)</span>
        </motion.div>
      )}

      {/* ── 3. BLUEPRINT CHALLENGE CARD ── */}
      <div className="my-1 p-2 bg-white rounded-xl border-2 border-slate-300 shadow-sm flex flex-col gap-1">
        <div className="flex items-center justify-between text-[10px] font-black uppercase text-slate-500">
          <span>ROUND {currentRound} / 5</span>
          <span className="px-1.5 py-0.2 bg-slate-100 rounded text-[9px] border border-slate-200">
            {team.attemptsLeft} TRIES LEFT
          </span>
        </div>

        <h4 className="text-xs font-black text-slate-900 leading-tight">
          {activeChallenge.title}
        </h4>

        {/* Dynamic Mathematical Sequence / Formula Display */}
        {activeChallenge.sequence && (
          <div className="my-1 p-1.5 rounded-lg bg-slate-900 text-yellow-300 border-2 border-slate-800 flex items-center justify-center gap-1.5 font-mono font-black text-xs">
            {activeChallenge.sequence.slice(0, 4).map((num, i) => (
              <React.Fragment key={`seq-${i}`}>
                <span>{num}</span>
                <span className="text-slate-500">→</span>
              </React.Fragment>
            ))}
            <span className="px-1.5 py-0.5 bg-yellow-400 text-black rounded font-black text-xs animate-pulse">
              ?
            </span>
          </div>
        )}

        {/* Function In/Out Display for Rounds 3 & 4 */}
        {currentRound >= 3 && activeChallenge.functionInput !== undefined && (
          <div className="my-1 p-1.5 rounded-lg bg-slate-900 text-white border-2 border-slate-800 flex items-center justify-center gap-2 font-mono font-black text-xs">
            <span className="text-emerald-400">IN: [{activeChallenge.functionInput}]</span>
            <span className="text-slate-500">→</span>
            <span className="text-yellow-300">
              {currentRound === 4 ? '[ ? ]' : `[${activeChallenge.ruleDescription}]`}
            </span>
            <span className="text-slate-500">→</span>
            <span className="text-sky-400">
              OUT: [{activeChallenge.functionOutput ?? '?'}]
            </span>
          </div>
        )}
      </div>

      {/* ── 4. TACTILE MANIPULATION CONTROLS ── */}
      <div className="my-1 p-2 bg-white rounded-xl border-2 border-slate-300 shadow-sm flex-1 flex flex-col justify-center">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 block mb-1 text-center">
          {currentRound === 1 && '1. ROTARY STEP CONTROLLER'}
          {currentRound === 2 && '2. SEQUENCE BUILDER SLIDERS'}
          {currentRound === 3 && '3. FUNCTION OUTPUT CALCULATOR'}
          {currentRound === 4 && '4. REPAIR OPERATOR WHEEL'}
          {currentRound === 5 && '5. CIRCUIT STEP & TURBO GATE'}
        </span>

        {/* ── ROUND 1: Mechanical Step Selector Dial ── */}
        {currentRound === 1 && (
          <div className="flex flex-col gap-1.5">
            <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-center">
              <span className="text-[9px] font-bold text-slate-500 block">SELECTED STEP</span>
              <span className="text-lg font-mono font-black text-blue-600">
                {team.selectedStep > 0 ? `+${team.selectedStep}` : team.selectedStep}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1">
              {STEP_CHOICES.map((st) => {
                const isEliminated = team.eliminatedOptions.includes(String(st)) || team.eliminatedOptions.includes(st > 0 ? `+${st}` : `${st}`);
                if (isEliminated) return null;

                return (
                  <button
                    key={`st-${st}`}
                    onClick={() => isBlue ? updateBlueStep(st) : updateRedStep(st)}
                    disabled={team.isLocked}
                    className={`py-1.5 rounded-lg border-2 font-mono font-black text-xs transition cursor-pointer ${
                      team.selectedStep === st
                        ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                        : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-blue-50'
                    }`}
                  >
                    {st > 0 ? `+${st}` : st}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── ROUND 2: Sequence Builder Controls ── */}
        {currentRound === 2 && (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-1 text-xs font-bold">
              <span className="text-slate-600">START:</span>
              <span className="font-mono font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                {team.builderStart}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="80"
              step="1"
              value={team.builderStart}
              disabled={team.isLocked}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (isBlue) updateBlueBuilder(val, team.builderStep, team.builderDirection);
                else updateRedBuilder(val, team.builderStep, team.builderDirection);
              }}
              className="w-full accent-blue-600 cursor-pointer"
            />

            <div className="flex items-center justify-between gap-1 text-xs font-bold mt-1">
              <span className="text-slate-600">STEP:</span>
              <span className="font-mono font-black text-blue-600">
                {team.builderStep > 0 ? `+${team.builderStep}` : team.builderStep}
              </span>
            </div>
            <div className="grid grid-cols-5 gap-1">
              {[-8, -5, -4, -3, 3, 4, 5, 6, 7, 10].map((st) => (
                <button
                  key={`b-step-${st}`}
                  onClick={() => {
                    if (isBlue) updateBlueBuilder(team.builderStart, st, st > 0 ? 'increasing' : 'decreasing');
                    else updateRedBuilder(team.builderStart, st, st > 0 ? 'increasing' : 'decreasing');
                  }}
                  disabled={team.isLocked}
                  className={`py-1 rounded-md border font-mono font-black text-[11px] cursor-pointer ${
                    team.builderStep === st
                      ? 'bg-blue-600 text-white border-blue-700'
                      : 'bg-slate-100 text-slate-700 border-slate-300'
                  }`}
                >
                  {st > 0 ? `+${st}` : st}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── ROUND 3: Output Computation Dial ── */}
        {currentRound === 3 && (
          <div className="flex flex-col gap-1.5">
            <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-center">
              <span className="text-[9px] font-bold text-slate-500 block">COMPUTED OUTPUT</span>
              <span className="text-xl font-mono font-black text-emerald-600">
                {team.computedOutput}
              </span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              {[-5, -1, +1, +5].map((delta) => (
                <button
                  key={`out-delta-${delta}`}
                  onClick={() => {
                    const nextVal = Math.max(1, team.computedOutput + delta);
                    if (isBlue) updateBlueOutput(nextVal);
                    else updateRedOutput(nextVal);
                  }}
                  disabled={team.isLocked}
                  className="py-1 px-2.5 rounded-lg bg-slate-200 hover:bg-slate-300 font-black text-xs cursor-pointer"
                >
                  {delta > 0 ? `+${delta}` : delta}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── ROUND 4: Function Machine Repair Wheels ── */}
        {currentRound === 4 && (
          <div className="flex flex-col gap-1.5">
            <span className="text-[9px] font-bold text-slate-500">OPERATOR:</span>
            <div className="grid grid-cols-4 gap-1">
              {OPERATORS.map((op) => (
                <button
                  key={`op-${op}`}
                  onClick={() => isBlue ? updateBlueOperator(op, team.selectedOperand) : updateRedOperator(op, team.selectedOperand)}
                  disabled={team.isLocked}
                  className={`py-1.5 rounded-lg border-2 font-mono font-black text-sm cursor-pointer ${
                    team.selectedOperator === op
                      ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-sm'
                      : 'bg-slate-100 text-slate-700 border-slate-300'
                  }`}
                >
                  {op}
                </button>
              ))}
            </div>

            <span className="text-[9px] font-bold text-slate-500 mt-0.5">VALUE: [{team.selectedOperand}]</span>
            <div className="grid grid-cols-5 gap-1">
              {[2, 3, 4, 5, 6, 7, 8, 9, 10, 12].map((num) => (
                <button
                  key={`val-${num}`}
                  onClick={() => isBlue ? updateBlueOperator(team.selectedOperator, num) : updateRedOperator(team.selectedOperator, num)}
                  disabled={team.isLocked}
                  className={`py-1 rounded-md border font-mono font-black text-xs cursor-pointer ${
                    team.selectedOperand === num
                      ? 'bg-blue-600 text-white border-blue-700'
                      : 'bg-slate-100 text-slate-700 border-slate-300'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── ROUND 5: Hybrid Sequence + Function Dual Lock ── */}
        {currentRound === 5 && (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span>STEP: [{team.hybridStep > 0 ? `+${team.hybridStep}` : team.hybridStep}]</span>
              <span>OUT: [{team.hybridOutput}]</span>
            </div>
            <div className="grid grid-cols-4 gap-1">
              {[-8, -5, -3, 3, 4, 5, 6, 7].map((st) => (
                <button
                  key={`h-step-${st}`}
                  onClick={() => isBlue ? updateBlueHybrid(st, team.hybridOutput) : updateRedHybrid(st, team.hybridOutput)}
                  disabled={team.isLocked}
                  className={`py-1 rounded border font-mono font-black text-[10px] cursor-pointer ${
                    team.hybridStep === st ? 'bg-blue-600 text-white' : 'bg-slate-100'
                  }`}
                >
                  {st > 0 ? `+${st}` : st}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-center gap-1 mt-0.5">
              {[-5, -1, +1, +5].map((delta) => (
                <button
                  key={`hy-delta-${delta}`}
                  onClick={() => {
                    const nextVal = Math.max(1, team.hybridOutput + delta);
                    if (isBlue) updateBlueHybrid(team.hybridStep, nextVal);
                    else updateRedHybrid(team.hybridStep, nextVal);
                  }}
                  disabled={team.isLocked}
                  className="py-0.5 px-2 rounded bg-slate-200 font-black text-[10px] cursor-pointer"
                >
                  {delta > 0 ? `+${delta}` : delta}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── 5. LIVE STATUS / FEEDBACK BANNER ── */}
      {team.lastFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className={`my-1 p-1.5 rounded-lg border-2 text-[10px] font-bold ${
            team.isCorrect === true
              ? 'bg-emerald-50 border-emerald-500 text-emerald-950'
              : team.isCorrect === false
                ? 'bg-red-50 border-red-500 text-red-950'
                : 'bg-amber-50 border-amber-400 text-amber-950'
          }`}
        >
          {team.lastFeedback}
        </motion.div>
      )}

      {/* ── 6. MISCONCEPTION COACH TIP BANNER ── */}
      {team.activeMisconception && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="my-1 p-1.5 bg-yellow-50 border-2 border-yellow-400 rounded-lg text-[10px] font-bold text-amber-900 flex items-start gap-1 shadow-sm"
        >
          <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
          <span>{team.activeMisconception}</span>
        </motion.div>
      )}

      {/* ── 7. LOCK & OPERATE ACTION BUTTON ── */}
      <button
        onClick={() => submitAnswer(teamId)}
        disabled={team.isLocked || team.hasSubmitted}
        className={`w-full py-3 rounded-xl border-3 border-slate-900 font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_#000000] flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer ${
          team.hasSubmitted
            ? team.isCorrect
              ? 'bg-emerald-500 text-white'
              : 'bg-red-500 text-white'
            : isBlue
              ? 'bg-blue-600 hover:bg-blue-500 text-white'
              : 'bg-red-600 hover:bg-red-500 text-white'
        }`}
      >
        <CheckCircle2 className="w-4 h-4" />
        <span>
          {team.hasSubmitted
            ? team.isCorrect
              ? 'TRACK CONNECTED!'
              : 'CALIBRATION LOCKED'
            : currentRound >= 3
              ? 'OPERATE MACHINE'
              : 'LOCK & BUILD TRACK'}
        </span>
      </button>

      {/* ── 8. TACTICAL POWER-UPS TRAY ── */}
      <div className="mt-1 p-1 bg-white rounded-xl border-2 border-slate-300 shadow-sm">
        <PowerUpTray
          teamId={teamId}
          powerUps={team.powerUps}
          onUse5050={() => usePowerUp5050(teamId)}
          onUseTimeFreeze={() => usePowerUpTimeFreeze(teamId)}
          onUse2x={() => usePowerUp2x(teamId)}
          disabled={team.isLocked || team.hasSubmitted}
        />
      </div>

      {/* ── 9. DIGITAL SCRATCHPAD (Rough Work) ── */}
      <div className="mt-1 w-full">
        <DigitalScratchpad teamId={teamId} teamName={team.name} />
      </div>
    </div>
  );
};
