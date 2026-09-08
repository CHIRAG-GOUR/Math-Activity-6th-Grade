// ============================================================
// THE GREAT CARNIVAL OF CHANCE — COMIC-BOOK NEO-BRUTALIST OPERATOR CONSOLE
// 100% Solid Opaque Panels, 5px Black Outlines, 8px Offset Shadows,
// Layered Comic Architecture: Outer Frame → Cream Panel → White Narration Box
// ============================================================

'use client';

import React from 'react';
import { useCarnivalStore } from '../store/carnivalStore';
import { AnswerChoice, TeamId } from '../types';
import { QuestionPanel } from './QuestionPanel';
import { AnswerButton } from './AnswerButton';
import { SubmitButton } from './SubmitButton';
import { Ticket, Star, Flame } from 'lucide-react';

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
    // ── LAYER 1: OUTER SOLID COLOR FRAME (Blue or Red) with 5px Black Outline & 8px Hard Shadow ──
    <div
      className={`w-full h-full p-2.5 sm:p-3 rounded-[24px] border-[5px] border-[#111111] shadow-[8px_8px_0px_#111111] select-none flex flex-col justify-between overflow-hidden ${
        isBlue ? 'bg-[#2463EB]' : 'bg-[#E53935]'
      }`}
    >
      {/* ── LAYER 2: SOLID OPAQUE CREAM INNER CONTAINER (4px Black Outline) ── */}
      <div className="w-full h-full p-3 rounded-[18px] bg-[#FFF7E5] border-[4px] border-[#111111] shadow-[4px_4px_0px_#111111] flex flex-col justify-between overflow-hidden">
        
        {/* ── HEADER: COMIC TITLE STRIP & TICKET BADGE ── */}
        <div className="shrink-0 space-y-2">
          <div className="w-full py-1.5 px-3 rounded-xl bg-[#FFC928] border-[3px] border-[#111111] shadow-[3px_3px_0px_#111111] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-lg border-2 border-[#111111] flex items-center justify-center font-black text-sm text-white shadow-[1px_1px_0px_#111111] ${
                  isBlue ? 'bg-[#2463EB]' : 'bg-[#E53935]'
                }`}
              >
                {isBlue ? 'B' : 'R'}
              </div>
              <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#111111]">
                {isBlue ? 'BLUE OPERATOR' : 'RED OPERATOR'}
              </span>
            </div>

            {/* Gold Tickets Count Badge */}
            <div className="flex items-center gap-1 bg-[#FFFFFF] px-2 py-0.5 rounded-lg border-2 border-[#111111] text-[#111111] font-black text-xs shadow-[1px_1px_0px_#111111]">
              <Ticket className="w-3.5 h-3.5 fill-[#FFC928] text-[#111111]" />
              <span>{teamState.goldTickets}</span>
            </div>
          </div>

          {/* ── LAYER 3: QUESTION / CHALLENGE NARRATION BOX ── */}
          {activeChallenge && <QuestionPanel challenge={activeChallenge} />}
        </div>

        {/* ── LAYER 4: ANSWER OPTIONS COMIC CARDS STACK ── */}
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

        {/* ── LAYER 5: PROMINENT 74PX PHYSICAL SUBMIT ACTUATOR ── */}
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
    </div>
  );
};
