// ============================================================
// THE GREAT CARNIVAL OF CHANCE — Neo-Brutalist Side Operator Console
// Physical Arcade Console Panel for Team Blue (Left) & Team Red (Right)
// Zero Scrolling, Guaranteed Geometry, High Contrast, Tactile Touch Controls
// ============================================================

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useCarnivalStore } from '../store/carnivalStore';
import { AnswerChoice, TeamId } from '../types';
import { QuestionPanel } from './QuestionPanel';
import { AnswerButton } from './AnswerButton';
import { SubmitButton } from './SubmitButton';
import { Ticket, Star, Flame, ShieldAlert } from 'lucide-react';

interface TeamConsoleProps {
  teamId: TeamId;
}

export const TeamConsole: React.FC<TeamConsoleProps> = ({ teamId }) => {
  const isBlue = teamId === 'blue';
  const teamState = useCarnivalStore((s) => (isBlue ? s.blueTeam : s.redTeam));
  const activeChallenge = useCarnivalStore((s) => s.activeChallenge);
  const phase = useCarnivalStore((s) => s.phase);
  const selectChoice = useCarnivalStore((s) => s.selectChoice);
  const confirmPrediction = useCarnivalStore((s) => s.confirmPrediction);

  const isPredicting = phase === 'predicting';
  const isLocked = teamState.isConfirmed;

  const handleChoiceTouch = (choice: AnswerChoice, e: React.PointerEvent) => {
    e.preventDefault();
    if (!isPredicting || isLocked) return;
    selectChoice(teamId, choice.id);
  };

  const handleConfirmTouch = (e: React.PointerEvent) => {
    e.preventDefault();
    if (!isPredicting || isLocked || !teamState.selectedChoiceId) return;
    confirmPrediction(teamId);
  };

  return (
    <div
      className={`w-full h-full p-3.5 sm:p-4 rounded-3xl border-4 border-[#111111] shadow-[8px_8px_0px_#111111] select-none flex flex-col justify-between overflow-hidden ${
        isBlue ? 'bg-[#FFF8E7]' : 'bg-[#FFF8E7]'
      }`}
    >
      {/* ── 1. CONSOLE TOP HEADER ── */}
      <div className="shrink-0 space-y-2">
        {/* Header Marquee Plaque */}
        <div
          className={`w-full py-2 px-3 rounded-2xl border-3 border-[#111111] shadow-[4px_4px_0px_#111111] flex items-center justify-between text-white ${
            isBlue ? 'bg-[#2463EB]' : 'bg-[#E53935]'
          }`}
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#FFC928] border-2 border-[#111111] flex items-center justify-center font-black text-sm text-[#111111] shadow-[1px_1px_0px_#111111]">
              {isBlue ? 'B' : 'R'}
            </div>
            <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#FFF8E7]">
              {isBlue ? 'BLUE OPERATOR' : 'RED OPERATOR'}
            </span>
          </div>

          {/* Ticket Counter Badge */}
          <div className="flex items-center gap-1 bg-[#FFC928] px-2 py-0.5 rounded-lg border-2 border-[#111111] text-[#111111] font-black text-xs">
            <Ticket className="w-3.5 h-3.5 fill-[#111111] text-[#111111]" />
            <span>{teamState.goldTickets}</span>
          </div>
        </div>

        {/* Question Panel */}
        {activeChallenge && <QuestionPanel challenge={activeChallenge} />}
      </div>

      {/* ── 2. ANSWER SELECTION STACK ── */}
      <div className="my-auto py-1 flex flex-col gap-2 shrink-0">
        {activeChallenge?.choices.map((choice) => (
          <AnswerButton
            key={choice.id}
            choice={choice}
            teamId={teamId}
            isSelected={teamState.selectedChoiceId === choice.id}
            isConfirmed={teamState.isConfirmed}
            isPredicting={isPredicting}
            onSelect={(e) => handleChoiceTouch(choice, e)}
          />
        ))}
      </div>

      {/* ── 3. MASSIVE 72PX+ PRIMARY SUBMIT BUTTON ── */}
      <div className="shrink-0 pt-1">
        <SubmitButton
          isReady={!!teamState.selectedChoiceId}
          isConfirmed={teamState.isConfirmed}
          isPredicting={isPredicting}
          onConfirm={handleConfirmTouch}
          teamColor={isBlue ? 'blue' : 'red'}
        />
      </div>
    </div>
  );
};
