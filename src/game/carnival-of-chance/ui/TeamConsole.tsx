// ============================================================
// THE GREAT CARNIVAL OF CHANCE — NEUBRUTALIST OPERATOR CONSOLE
// Clean, Non-Colliding Layout with Guaranteed Solid Colors & 4-5px Outlines
// Phase-Aware Dynamic Flow:
// - PREDICTING: Shows Question Card, Answer Push Buttons & Submit Actuator
// - OPERATING (Action): HIDES Questions & Choices to give 100% unobstructed 3D machine view!
// - OBSERVATION: Shows Team Result Badge & Streak without blocking central modal
// ============================================================

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useCarnivalStore } from '../store/carnivalStore';
import { AnswerChoice, TeamId, ActivityId } from '../types';
import { QuestionPanel } from './QuestionPanel';
import { AnswerButton } from './AnswerButton';
import { SubmitButton } from './SubmitButton';
import { MathFractionDisplay } from './MathFraction';
import { Ticket, Sparkles, CheckCircle2, XCircle, Flame, Eye } from 'lucide-react';

interface TeamConsoleProps {
  teamId: TeamId;
}

const ACTION_LABELS: Record<ActivityId, string> = {
  hub: 'LOCK IN PREDICTION',
  'odds-wheel': 'SPIN THE 3D WHEEL',
  'mystery-bag': 'PULL DRAWSTRING & DRAW',
  'ball-drop': 'RELEASE PACHINKO BALL',
  'probability-lab': 'TEST LABORATORY CHAMBER',
  'game-builder': 'LAUNCH TEST TOKEN',
  'grand-carnival': 'SUBMIT CHAMPIONSHIP SELECTION',
};

export const TeamConsole: React.FC<TeamConsoleProps> = ({ teamId }) => {
  const isBlue = teamId === 'blue';
  const teamState = useCarnivalStore((s) => (isBlue ? s.blueTeam : s.redTeam));
  const activeChallenge = useCarnivalStore((s) => s.activeChallenge);
  const activeActivity = useCarnivalStore((s) => s.activeActivity);
  const phase = useCarnivalStore((s) => s.phase);
  const selectChoice = useCarnivalStore((s) => s.selectChoice);
  const confirmPrediction = useCarnivalStore((s) => s.confirmPrediction);

  const isPredicting = phase === 'predicting';
  const isOperating = phase === 'operating';
  const isObservation = phase === 'observation' || phase === 'batch-trials';
  const isCompleted = phase === 'completed';

  const selectedChoice = activeChallenge?.choices.find(
    (c) => c.id === teamState.selectedChoiceId
  );

  const handleChoiceTouch = (choice: AnswerChoice, e: React.PointerEvent) => {
    e.preventDefault();
    if (!isPredicting || teamState.isConfirmed) return;
    selectChoice(teamId, choice.id);
  };

  const handleConfirmTouch = (e: React.PointerEvent) => {
    e.preventDefault();
    if (!isPredicting || teamState.isConfirmed || !teamState.selectedChoiceId) return;
    confirmPrediction(teamId);
  };

  const actionLabel = ACTION_LABELS[activeActivity] || 'LOCK IN PREDICTION';

  return (
    // ── LAYER 1: SOLID COLOR OUTER FRAME (4.5px Black Outline & 6px Hard Shadow) ──
    <div
      style={{
        backgroundColor: isBlue ? '#2563EB' : '#FF2A6D',
        border: '4.5px solid #000000',
        boxShadow: '6px 6px 0px #000000',
        borderRadius: '22px',
      }}
      className="w-full h-full p-2 sm:p-2.5 select-none flex flex-col justify-between overflow-hidden"
    >
      {/* ── LAYER 2: SOLID OPAQUE CREAM INNER CONTAINER (3.5px Black Outline) ── */}
      <div
        style={{
          backgroundColor: '#FFF7E5',
          border: '3.5px solid #000000',
          boxShadow: '3px 3px 0px #000000',
          borderRadius: '16px',
        }}
        className="w-full h-full p-2.5 sm:p-3 flex flex-col justify-between overflow-y-auto"
      >
        {/* ── HEADER STRIP: TEAM BADGE & TICKETS (Yellow with Black Card) ── */}
        <div
          style={{
            backgroundColor: '#FED500',
            border: '3px solid #000000',
            boxShadow: '3px 3px 0px #000000',
            borderRadius: '12px',
          }}
          className="w-full py-1.5 px-2.5 flex items-center justify-between shrink-0"
        >
          <div className="flex items-center gap-2 min-w-0">
            <div
              style={{
                backgroundColor: isBlue ? '#2563EB' : '#FF2A6D',
                border: '2px solid #000000',
                boxShadow: '1.5px 1.5px 0px #000000',
                borderRadius: '8px',
              }}
              className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center font-black text-xs sm:text-sm text-white shrink-0"
            >
              {isBlue ? 'B' : 'R'}
            </div>
            <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-black truncate">
              {isBlue ? 'BLUE OPERATOR' : 'RED OPERATOR'}
            </span>
          </div>

          {/* Gold Tickets Badge */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '2px solid #000000',
              boxShadow: '1.5px 1.5px 0px #000000',
              borderRadius: '8px',
            }}
            className="flex items-center gap-1 px-2 py-0.5 font-black text-xs text-black shrink-0"
          >
            <Ticket className="w-3.5 h-3.5 fill-[#FED500] text-black" />
            <span>{teamState.goldTickets}</span>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════════
            PHASE 1: PREDICTING — QUESTION + ANSWER CARDS + SUBMIT ACTUATOR
            ═════════════════════════════════════════════════════════════ */}
        {isPredicting && (
          <div className="flex-1 flex flex-col justify-between gap-2 my-2 min-h-0">
            {/* Question Panel Card (Yellow with Black) */}
            {activeChallenge && <QuestionPanel challenge={activeChallenge} />}

            {/* Answer Options Push Cards Stack */}
            <div className="flex flex-col gap-1.5 my-auto shrink-0">
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

            {/* Submit Actuator (Yellow / Mint) */}
            <div className="shrink-0 pt-0.5">
              <SubmitButton
                isReady={!!teamState.selectedChoiceId}
                isConfirmed={teamState.isConfirmed}
                isPredicting={isPredicting}
                onConfirm={handleConfirmTouch}
                teamColor={isBlue ? 'blue' : 'red'}
                customLabel={actionLabel}
              />
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════
            PHASE 2: OPERATING (ACTION) — HIDE QUESTION & OPEN 3D SCENE
            ═════════════════════════════════════════════════════════════ */}
        {isOperating && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col justify-center items-center text-center p-3 gap-3 my-auto"
          >
            {/* Prediction Locked Preview Card (Yellow with Black) */}
            <div
              style={{
                backgroundColor: '#FED500',
                border: '3.5px solid #000000',
                boxShadow: '4px 4px 0px #000000',
                borderRadius: '16px',
                color: '#000000',
              }}
              className="w-full p-3.5 flex flex-col items-center gap-1.5"
            >
              <span className="text-[10px] font-black uppercase tracking-wider text-black opacity-75">
                LOCKED PREDICTION
              </span>
              {selectedChoice && (
                <div className="flex items-center gap-2">
                  <div
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '2px solid #000000',
                      borderRadius: '8px',
                      padding: '2px 6px',
                    }}
                  >
                    <MathFractionDisplay fraction={selectedChoice.fraction} size="sm" />
                  </div>
                  <span className="text-xs font-black text-black">
                    {selectedChoice.label}
                  </span>
                </div>
              )}
            </div>

            {/* Active Machine Vibration Banner (Red with White) */}
            <div
              style={{
                backgroundColor: '#FF2A6D',
                border: '3.5px solid #000000',
                boxShadow: '4px 4px 0px #000000',
                borderRadius: '16px',
                color: '#FFFFFF',
              }}
              className="w-full p-4 flex flex-col items-center gap-1.5 animate-pulse"
            >
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 stroke-[3] text-white" />
                <span className="text-xs font-black uppercase tracking-wider text-white">
                  WATCH THE 3D MACHINE
                </span>
              </div>
              <span className="text-[10px] font-bold text-white opacity-90">
                Physical random experiment in progress...
              </span>
            </div>
          </motion.div>
        )}

        {/* ═════════════════════════════════════════════════════════════
            PHASE 3: OBSERVATION & REASONING — OUTCOME SUMMARY
            ═════════════════════════════════════════════════════════════ */}
        {isObservation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col justify-center items-center text-center p-3 gap-3 my-auto"
          >
            {/* Correct or Incorrect Team Badge */}
            <div
              style={{
                backgroundColor: teamState.isCorrect ? '#00F0A8' : '#FF2A6D',
                border: '4px solid #000000',
                boxShadow: '5px 5px 0px #000000',
                borderRadius: '18px',
                color: teamState.isCorrect ? '#000000' : '#FFFFFF',
              }}
              className="w-full p-4 flex flex-col items-center gap-2"
            >
              {teamState.isCorrect ? (
                <>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-6 h-6 stroke-[3.5] text-black" />
                    <span className="text-sm font-black uppercase tracking-wider">
                      PREDICTION ACCURATE!
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      style={{
                        backgroundColor: '#FED500',
                        border: '2px solid #000000',
                        boxShadow: '2px 2px 0px #000000',
                        borderRadius: '8px',
                      }}
                      className="px-2.5 py-0.5 text-xs font-black text-black"
                    >
                      +{teamState.scoreGained} PTS
                    </div>
                    {teamState.streak > 1 && (
                      <div
                        style={{
                          backgroundColor: '#FED500',
                          border: '2px solid #000000',
                          borderRadius: '8px',
                        }}
                        className="flex items-center gap-1 px-2 py-0.5 text-xs font-black text-black"
                      >
                        <Flame className="w-3.5 h-3.5 fill-[#FF2A6D] text-[#FF2A6D]" />
                        <span>{teamState.streak}X STREAK</span>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-1.5">
                    <XCircle className="w-6 h-6 stroke-[3.5] text-white" />
                    <span className="text-sm font-black uppercase tracking-wider">
                      TRY AGAIN NEXT TRIAL
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-white opacity-90">
                    Review the center reasoning card!
                  </span>
                </>
              )}
            </div>

            {/* Team Score Plaque (Yellow with Black) */}
            <div
              style={{
                backgroundColor: '#FED500',
                border: '3.5px solid #000000',
                boxShadow: '4px 4px 0px #000000',
                borderRadius: '14px',
                color: '#000000',
              }}
              className="w-full p-3 flex items-center justify-between"
            >
              <span className="text-xs font-black uppercase text-black">
                TOTAL SCORE
              </span>
              <span className="text-base font-black font-mono text-black">
                {teamState.score.toLocaleString()} PTS
              </span>
            </div>
          </motion.div>
        )}

        {/* ═════════════════════════════════════════════════════════════
            PHASE 4: COMPLETED — MASTERED BADGE
            ═════════════════════════════════════════════════════════════ */}
        {isCompleted && (
          <div className="flex-1 flex flex-col justify-center items-center text-center p-3 gap-2 my-auto">
            <div
              style={{
                backgroundColor: '#FED500',
                border: '4px solid #000000',
                boxShadow: '5px 5px 0px #000000',
                borderRadius: '18px',
                color: '#000000',
              }}
              className="w-full p-4 flex flex-col items-center gap-1"
            >
              <Sparkles className="w-6 h-6 text-black stroke-[3]" />
              <span className="text-xs font-black uppercase text-black">
                ATTRACTION MASTERED!
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
