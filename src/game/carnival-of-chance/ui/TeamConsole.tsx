// ============================================================
// THE GREAT CARNIVAL OF CHANCE — NEUBRUTALIST OPERATOR CONSOLE
// 100% Solid Opaque Panels with Guaranteed Inline Styles & CSS Tokens
// Layered Neubrutalism Architecture: Outer Color Frame → Cream Panel → White Narration Box
// ============================================================

'use client';

import React from 'react';
import { useCarnivalStore } from '../store/carnivalStore';
import { AnswerChoice, TeamId } from '../types';
import { QuestionPanel } from './QuestionPanel';
import { AnswerButton } from './AnswerButton';
import { SubmitButton } from './SubmitButton';
import { Ticket } from 'lucide-react';

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
    // ── LAYER 1: SOLID COLOR OUTER FRAME (Blue or Red) with 5px Black Outline & 8px Hard Shadow ──
    <div
      style={{
        backgroundColor: isBlue ? '#3B82F6' : '#FF2A6D',
        border: '5px solid #000000',
        boxShadow: '8px 8px 0px #000000',
        borderRadius: '24px',
      }}
      className="w-full h-full p-2.5 sm:p-3.5 select-none flex flex-col justify-between overflow-hidden"
    >
      {/* ── LAYER 2: SOLID OPAQUE CREAM INNER CONTAINER (4px Black Outline) ── */}
      <div
        style={{
          backgroundColor: '#FFF7E5',
          border: '4px solid #000000',
          boxShadow: '4px 4px 0px #000000',
          borderRadius: '18px',
        }}
        className="w-full h-full p-3 flex flex-col justify-between overflow-hidden"
      >
        {/* ── HEADER: YELLOW RIBBON STRIP & TICKET BADGE ── */}
        <div className="shrink-0 space-y-2">
          <div
            style={{
              backgroundColor: '#FED500',
              border: '3px solid #000000',
              boxShadow: '3px 3px 0px #000000',
              borderRadius: '12px',
            }}
            className="w-full py-1.5 px-3 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <div
                style={{
                  backgroundColor: isBlue ? '#3B82F6' : '#FF2A6D',
                  border: '2px solid #000000',
                  boxShadow: '1px 1px 0px #000000',
                  borderRadius: '8px',
                }}
                className="w-7 h-7 flex items-center justify-center font-black text-sm text-white"
              >
                {isBlue ? 'B' : 'R'}
              </div>
              <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-black">
                {isBlue ? 'BLUE OPERATOR' : 'RED OPERATOR'}
              </span>
            </div>

            {/* Gold Tickets Count Badge */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '2px solid #000000',
                boxShadow: '2px 2px 0px #000000',
                borderRadius: '8px',
              }}
              className="flex items-center gap-1 px-2 py-0.5 font-black text-xs text-black"
            >
              <Ticket className="w-3.5 h-3.5 fill-[#FED500] text-black" />
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

        {/* ── LAYER 5: PROMINENT 72PX PHYSICAL SUBMIT ACTUATOR ── */}
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
