// ============================================================
// PATTERN RACERS — Independent Team Console Panel
// 5-Round Mathematics Preparation Console:
// - Header: Team Flag, Name & Gold Star Score Badge (⭐ 100 PTS)
// - Round Tracker: STAGE N / 5 & [N/5 DONE] pill
// - Challenge Card:
//   * Clear Mathematical Sequence or Function Machine prompt
//   * 4 Instant-Click Multiple Choice Options (A, B, C, D)
// - Action Button: [✓ LOCK & CONFIRM ANSWER]
// - PowerUpTray + Digital Scratchpad
// ============================================================

'use client';

import React from 'react';
import { usePatternStore } from '../store/patternStore';
import { TeamId } from '../types';
import { PowerUpTray } from '@/components/shared/PowerUpTray';
import { DigitalScratchpad } from '@/components/shared/DigitalScratchpad';
import {
  CheckCircle2,
  Flag,
  Settings,
  Lock,
  Star,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

interface Props {
  teamId: TeamId;
}

export const TeamConsolePanel: React.FC<Props> = ({ teamId }) => {
  const currentRound = usePatternStore((s) => s.currentRound);
  const currentQuestion = usePatternStore((s) => s.currentQuestion);

  const team = usePatternStore((s) => (teamId === 'blue' ? s.blueTeam : s.redTeam));

  // Store Actions
  const selectOption = usePatternStore((s) => s.selectOption);
  const submitAnswer = usePatternStore((s) => s.submitAnswer);
  const use5050 = usePatternStore((s) => s.use5050);
  const useTimeFreeze = usePatternStore((s) => s.useTimeFreeze);
  const use2x = usePatternStore((s) => s.use2x);

  const isBlue = teamId === 'blue';

  const handleOptionClick = (optionId: 'A' | 'B' | 'C' | 'D', value: number | string) => {
    if (team.isLocked) return;
    selectOption(teamId, optionId, value);
  };

  const handleLock = () => {
    if (team.isLocked || !team.selectedOption) return;
    submitAnswer(teamId);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-3.5 bg-slate-50/95 backdrop-blur-md select-none overflow-y-auto border-x border-slate-300 shadow-xl">
      <div className="flex flex-col gap-3">
        {/* ── 1. TEAM HEADER BANNER ── */}
        <div
          className={`p-2.5 rounded-2xl border-2 border-slate-900 shadow-md flex items-center justify-between text-white ${
            isBlue
              ? 'bg-blue-600 shadow-[0_4px_12px_rgba(37,99,235,0.35)]'
              : 'bg-red-600 shadow-[0_4px_12px_rgba(220,38,38,0.35)]'
          }`}
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/20 border border-white/40 flex items-center justify-center shadow-inner">
              <Flag className="w-4 h-4 text-white fill-white" />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-tight leading-none">
                {isBlue ? 'BLUE TEAM' : 'RED TEAM'}
              </h3>
              <span className="text-[9px] font-bold text-white/80 uppercase tracking-widest block mt-0.5">
                #0{isBlue ? '1' : '2'} RACER
              </span>
            </div>
          </div>

          {/* Score Badge */}
          <div className="px-3 py-1 bg-amber-400 text-slate-950 rounded-xl border-2 border-slate-900 font-mono font-black text-xs flex items-center gap-1.5 shadow-[2px_2px_0px_#000000]">
            <Star className="w-3.5 h-3.5 fill-slate-950" />
            <span>{team.score} PTS</span>
          </div>
        </div>

        {/* ── 2. ROUND TRACKER ── */}
        <div className="flex items-center justify-between px-1 text-slate-800">
          <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-slate-900">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            STAGE {currentRound} / 5
          </div>
          <div className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 font-black text-[9px] border border-slate-300">
            {currentRound - 1}/5 COMPLETE
          </div>
        </div>

        {/* ── 3. CHALLENGE CARD ── */}
        <div className="p-3 rounded-2xl bg-white border-2 border-slate-300 shadow-xs flex flex-col gap-2.5">
          <div className="flex items-center gap-1.5 text-slate-600">
            <Settings className="w-3.5 h-3.5 text-blue-600 animate-spin-slow" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">
              {currentQuestion.stageName}
            </span>
          </div>

          {/* Math Card Display */}
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50/60 border-2 border-blue-200 flex flex-col items-center justify-center text-center gap-1.5">
            {currentQuestion.sequenceDisplay && (
              <div className="text-base sm:text-lg font-black font-mono text-slate-950 tracking-wide">
                {currentQuestion.sequenceDisplay}
              </div>
            )}

            {currentQuestion.functionDisplay && (
              <div className="text-xs sm:text-sm font-black font-mono text-slate-950 flex items-center justify-center gap-1.5 flex-wrap">
                <span className="px-2 py-1 bg-amber-200 text-slate-950 rounded-lg border border-amber-400">
                  INPUT: {currentQuestion.functionDisplay.input}
                </span>
                <span className="text-slate-500 font-bold">→</span>
                <span className="px-2 py-1 bg-sky-200 text-slate-950 rounded-lg border border-sky-400">
                  [ {currentQuestion.functionDisplay.rule} ]
                </span>
                <span className="text-slate-500 font-bold">→</span>
                <span className="px-2 py-1 bg-emerald-200 text-slate-950 rounded-lg border border-emerald-400">
                  OUTPUT: ?
                </span>
              </div>
            )}

            <p className="text-[11px] font-bold text-slate-700 mt-1 leading-tight">
              {currentQuestion.prompt}
            </p>
          </div>
        </div>

        {/* ── 4. 4 MULTIPLE CHOICE OPTIONS (A, B, C, D) ── */}
        <div className="flex flex-col gap-1.5">
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-600 px-1">
            SELECT YOUR ANSWER:
          </div>

          <div className="grid grid-cols-2 gap-2">
            {currentQuestion.options.map((opt) => {
              const isSelected = team.selectedOption === opt.id;
              const isEliminated = team.eliminatedOptions?.includes(opt.id);

              return (
                <button
                  key={`opt-${opt.id}`}
                  onClick={() => handleOptionClick(opt.id, opt.value)}
                  disabled={team.isLocked || isEliminated}
                  className={`relative p-2.5 rounded-xl font-mono text-left font-black transition-all flex items-center gap-2 border-2 cursor-pointer ${
                    isEliminated
                      ? 'opacity-30 line-through bg-slate-100 border-slate-200 cursor-not-allowed'
                      : isSelected
                      ? isBlue
                        ? 'bg-blue-600 text-white border-slate-900 shadow-[2px_2px_0px_#000000] scale-[1.02]'
                        : 'bg-red-600 text-white border-slate-900 shadow-[2px_2px_0px_#000000] scale-[1.02]'
                      : 'bg-white hover:bg-slate-100 text-slate-900 border-slate-300 hover:border-slate-400 shadow-xs'
                  } disabled:cursor-not-allowed`}
                >
                  <span
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black border ${
                      isSelected
                        ? 'bg-white text-slate-950 border-white'
                        : 'bg-slate-100 text-slate-700 border-slate-300'
                    }`}
                  >
                    {opt.id}
                  </span>
                  <span className="text-sm font-black truncate">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── 5. LOCK & CONFIRM BUTTON ── */}
        <button
          onClick={handleLock}
          disabled={team.isLocked || !team.selectedOption}
          className={`w-full py-3 rounded-2xl text-white font-black text-xs uppercase tracking-wider border-2 border-slate-900 shadow-[3px_3px_0px_#000000] flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
            isBlue ? 'bg-blue-600 hover:bg-blue-500' : 'bg-red-600 hover:bg-red-500'
          }`}
        >
          {team.isLocked ? (
            <>
              <Lock className="w-4 h-4" />
              <span>STAGE LOCKED & ENERGIZED</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>LOCK & CONFIRM ANSWER</span>
            </>
          )}
        </button>

        {/* Feedback Alert */}
        {team.lastFeedback && (
          <div
            className={`p-2.5 rounded-xl text-center text-xs font-black uppercase tracking-wider border-2 ${
              team.isCorrect
                ? 'bg-emerald-100 text-emerald-800 border-emerald-500 shadow-xs'
                : 'bg-red-100 text-red-800 border-red-500 shadow-xs'
            }`}
          >
            {team.lastFeedback}
          </div>
        )}

        {/* Misconception Tip if Wrong */}
        {team.activeMisconception && !team.isCorrect && (
          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-[11px] font-bold flex items-start gap-1.5 leading-tight">
            <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>{team.activeMisconception}</span>
          </div>
        )}

        {/* Power-Up Tray for Team Tactical Boosts */}
        <div className="mt-1">
          <PowerUpTray
            teamId={teamId}
            powerUps={team.powerUps}
            onUse5050={() => use5050(teamId)}
            onUseTimeFreeze={() => useTimeFreeze(teamId)}
            onUse2x={() => use2x(teamId)}
            disabled={team.isLocked}
          />
        </div>
      </div>

      {/* Digital Scratchpad at Bottom */}
      <div className="mt-3 pt-2.5 border-t border-slate-300 flex justify-center">
        <DigitalScratchpad teamId={teamId} teamName={team.name} position={isBlue ? 'left' : 'right'} />
      </div>
    </div>
  );
};
