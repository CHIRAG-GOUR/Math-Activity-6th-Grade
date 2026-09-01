'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Room3DScene } from './Room3DScene';
import { BankTopHUD } from './BankTopHUD';
import { Vault3DDoor } from './Vault3DDoor';
import { VaultQuestionBox } from './VaultQuestionBox';
import { FastCompetitiveConsole } from './FastCompetitiveConsole';
import { TeamConsoleScoreHeader } from './TeamConsoleScoreHeader';
import { GameFeedback } from './GameFeedback';
import { CountdownOverlay } from './CountdownOverlay';
import { RoomStartScreen } from './RoomStartScreen';
import { RoomVictoryScreen } from './RoomVictoryScreen';
import { GamePhase, GameSettings, Question, TeamId, TeamState } from '@/types/game';
import { generateQuestion, clearQuestionHistory } from '@/utils/questionGenerator';
import { soundManager } from '@/utils/audio';

const INITIAL_SETTINGS: GameSettings = {
  grade: '5-6',
  topic: 'mixed',
  topics: ['addition', 'subtraction', 'multiplication', 'division', 'mixed'],
  difficulty: 'medium',
  totalRounds: 5,
  timePerRound: 20,
  soundEnabled: true,
  teamBlueName: 'TEAM 1',
  teamRedName: 'TEAM 2',
};

const createInitialTeam = (id: TeamId, name: string): TeamState => ({
  id,
  name,
  score: 0,
  streak: 0,
  keys: 0,
  multiplier: 1,
  currentInput: '',
  selectedAnswer: null,
  isLocked: false,
  lastResult: null,
  lastScoreGained: 0,
  comboTitle: null,
});

export const MathEscapeVaultGame: React.FC = () => {
  const [phase, setPhase] = useState<GamePhase>('start');
  const [settings, setSettings] = useState<GameSettings>(INITIAL_SETTINGS);
  const VAULT_UNLOCK_TARGET = settings.totalRounds;

  const [teamBlue, setTeamBlue] = useState<TeamState>(createInitialTeam('blue', INITIAL_SETTINGS.teamBlueName));
  const [teamRed, setTeamRed] = useState<TeamState>(createInitialTeam('red', INITIAL_SETTINGS.teamRedName));

  // Lockouts & 3-Strike Alarms
  const [blueLockedOut, setBlueLockedOut] = useState<boolean>(false);
  const [redLockedOut, setRedLockedOut] = useState<boolean>(false);

  const [blueStrikes, setBlueStrikes] = useState<number>(0);
  const [redStrikes, setRedStrikes] = useState<number>(0);

  const [blueBusted, setBlueBusted] = useState<boolean>(false);
  const [redBusted, setRedBusted] = useState<boolean>(false);

  // BUSTED PENALTY: SKIP NEXT ROUND
  const [blueSkipNextRound, setBlueSkipNextRound] = useState<boolean>(false);
  const [redSkipNextRound, setRedSkipNextRound] = useState<boolean>(false);
  const [blueIsSkipping, setBlueIsSkipping] = useState<boolean>(false);
  const [redIsSkipping, setRedIsSkipping] = useState<boolean>(false);

  // WHOLE SCREEN GLOBAL ZOOM
  const [globalZoom, setGlobalZoom] = useState<number>(1);

  const [currentRound, setCurrentRound] = useState<number>(1);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(INITIAL_SETTINGS.timePerRound);

  // Progressive vault door unlocking count (0 to 5)
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [lastSolvedTeam, setLastSolvedTeam] = useState<'blue' | 'red' | null>(null);

  const [blueEarnedKey, setBlueEarnedKey] = useState<boolean>(false);
  const [redEarnedKey, setRedEarnedKey] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync team names if settings change
  useEffect(() => {
    if (phase === 'start') {
      setTeamBlue((prev) => ({ ...prev, name: settings.teamBlueName }));
      setTeamRed((prev) => ({ ...prev, name: settings.teamRedName }));
    }
  }, [settings.teamBlueName, settings.teamRedName, phase]);

  // Start new round
  const startRound = useCallback(
    (roundNum: number) => {
      const activeTopics = settings.topics && settings.topics.length > 0 ? settings.topics : [settings.topic || 'mixed'];
      const q = generateQuestion(activeTopics, settings.difficulty, '6', roundNum);
      setCurrentQuestion(q);
      setCurrentRound(roundNum);
      const timerSec = q.timeLimit || settings.timePerRound || 25;
      setTimeLeft(timerSec);

      // Handle next round skip penalty for Blue
      if (blueSkipNextRound) {
        setBlueIsSkipping(true);
        setBlueLockedOut(true);
        setBlueBusted(true);
        setBlueSkipNextRound(false);
        setBlueStrikes(0);
      } else {
        setBlueIsSkipping(false);
        setBlueLockedOut(false);
        setBlueBusted(false);
      }

      // Handle next round skip penalty for Red
      if (redSkipNextRound) {
        setRedIsSkipping(true);
        setRedLockedOut(true);
        setRedBusted(true);
        setRedSkipNextRound(false);
        setRedStrikes(0);
      } else {
        setRedIsSkipping(false);
        setRedLockedOut(false);
        setRedBusted(false);
      }

      setBlueEarnedKey(false);
      setRedEarnedKey(false);
      setLastSolvedTeam(null);

      setTeamBlue((prev) => ({
        ...prev,
        currentInput: '',
        selectedAnswer: null,
        isLocked: false,
        lastResult: null,
        lastScoreGained: 0,
        comboTitle: null,
      }));

      setTeamRed((prev) => ({
        ...prev,
        currentInput: '',
        selectedAnswer: null,
        isLocked: false,
        lastResult: null,
        lastScoreGained: 0,
        comboTitle: null,
      }));

      setPhase('playing');
    },
    [settings, blueSkipNextRound, redSkipNextRound]
  );

  // Start Game
  const handleStartGame = () => {
    clearQuestionHistory();
    setTeamBlue(createInitialTeam('blue', settings.teamBlueName));
    setTeamRed(createInitialTeam('red', settings.teamRedName));
    setCorrectCount(0);
    setBlueStrikes(0);
    setRedStrikes(0);
    setBlueSkipNextRound(false);
    setRedSkipNextRound(false);
    setBlueIsSkipping(false);
    setRedIsSkipping(false);
    setPhase('countdown');
  };

  // Next round transition
  const advanceRound = useCallback(() => {
    if (correctCount >= settings.totalRounds || currentRound >= settings.totalRounds) {
      setPhase('game_over');
    } else {
      startRound(currentRound + 1);
    }
  }, [correctCount, currentRound, settings.totalRounds, startRound]);

  // Timer countdown loop
  useEffect(() => {
    if (phase !== 'playing') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setPhase('round_reveal');
          soundManager.playWrong();
          setTimeout(advanceRound, 2000);
          return 0;
        }

        if (prev <= 3) {
          soundManager.playTimerUrgent(true);
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, advanceRound]);

  // 1. KEYPAD DIGIT PRESS
  const handleDigitPress = (teamId: TeamId, digit: string) => {
    if (phase !== 'playing') return;

    if (teamId === 'blue') {
      if (teamBlue.isLocked || blueLockedOut || blueBusted || blueIsSkipping) return;
      setTeamBlue((prev) => {
        if (prev.currentInput.length >= 6) return prev;
        return { ...prev, currentInput: prev.currentInput + digit };
      });
    } else {
      if (teamRed.isLocked || redLockedOut || redBusted || redIsSkipping) return;
      setTeamRed((prev) => {
        if (prev.currentInput.length >= 6) return prev;
        return { ...prev, currentInput: prev.currentInput + digit };
      });
    }
  };

  // 2. CLEAR KEYPAD PRESS
  const handleClearPress = (teamId: TeamId) => {
    if (phase !== 'playing') return;

    if (teamId === 'blue') {
      if (teamBlue.isLocked || blueLockedOut || blueBusted || blueIsSkipping) return;
      setTeamBlue((prev) => ({ ...prev, currentInput: '' }));
    } else {
      if (teamRed.isLocked || redLockedOut || redBusted || redIsSkipping) return;
      setTeamRed((prev) => ({ ...prev, currentInput: '' }));
    }
  };

  // 3. FAST COMPETITIVE SUBMISSION
  const handleSubmitPress = (teamId: TeamId) => {
    if (phase !== 'playing' || !currentQuestion) return;

    if (teamId === 'blue') {
      if (teamBlue.isLocked || blueLockedOut || blueBusted || blueIsSkipping || !teamBlue.currentInput) return;

      const isCorrect = String(teamBlue.currentInput).trim() === String(currentQuestion.answer).trim();

      if (isCorrect) {
        // INSTANT WIN FOR TEAM BLUE!
        if (timerRef.current) clearInterval(timerRef.current);
        setPhase('round_reveal');
        soundManager.playCorrect();
        soundManager.playVaultWheelTurn();

        const basePts = 100;
        const streakBonus = Math.min((teamBlue.streak + 1) * 15, 60);
        const gained = basePts + streakBonus;

        setTeamBlue((prev) => ({
          ...prev,
          score: prev.score + gained,
          streak: prev.streak + 1,
          keys: Math.min(3, prev.keys + 1),
          selectedAnswer: prev.currentInput,
          isLocked: true,
          lastResult: 'correct',
          lastScoreGained: gained,
        }));

        setLastSolvedTeam('blue');
        setCorrectCount((prev) => Math.min(VAULT_UNLOCK_TARGET, prev + 1));
        setBlueEarnedKey(true);
        setBlueStrikes(0);

        setTimeout(advanceRound, 1500);

      } else {
        // WRONG ANSWER FOR TEAM BLUE
        soundManager.playWrong();
        const newStrikes = blueStrikes + 1;
        setBlueStrikes(newStrikes);

        if (newStrikes >= 3) {
          // 3 WRONG: TRIGGER ALARM & BUSTED! (MUST SKIP NEXT ROUND AS WELL)
          soundManager.playSecurityAlarm();
          setBlueBusted(true);
          setBlueSkipNextRound(true);
        } else {
          setBlueLockedOut(true);
        }

        setTeamBlue((prev) => ({
          ...prev,
          streak: 0,
          selectedAnswer: prev.currentInput,
          isLocked: true,
          lastResult: 'wrong',
          lastScoreGained: 0,
        }));

        // If Team Red is also locked out or busted, both failed!
        if (redLockedOut || redBusted || redIsSkipping) {
          if (timerRef.current) clearInterval(timerRef.current);
          setPhase('round_reveal');
          setTimeout(advanceRound, 2000);
        }
      }

    } else {
      // TEAM RED SUBMISSION
      if (teamRed.isLocked || redLockedOut || redBusted || redIsSkipping || !teamRed.currentInput) return;

      const isCorrect = String(teamRed.currentInput).trim() === String(currentQuestion.answer).trim();

      if (isCorrect) {
        // INSTANT WIN FOR TEAM RED!
        if (timerRef.current) clearInterval(timerRef.current);
        setPhase('round_reveal');
        soundManager.playCorrect();
        soundManager.playVaultWheelTurn();

        const basePts = 100;
        const streakBonus = Math.min((teamRed.streak + 1) * 15, 60);
        const gained = basePts + streakBonus;

        setTeamRed((prev) => ({
          ...prev,
          score: prev.score + gained,
          streak: prev.streak + 1,
          keys: Math.min(3, prev.keys + 1),
          selectedAnswer: prev.currentInput,
          isLocked: true,
          lastResult: 'correct',
          lastScoreGained: gained,
        }));

        setLastSolvedTeam('red');
        setCorrectCount((prev) => Math.min(VAULT_UNLOCK_TARGET, prev + 1));
        setRedEarnedKey(true);
        setRedStrikes(0);

        setTimeout(advanceRound, 1500);

      } else {
        // WRONG ANSWER FOR TEAM RED
        soundManager.playWrong();
        const newStrikes = redStrikes + 1;
        setRedStrikes(newStrikes);

        if (newStrikes >= 3) {
          // 3 WRONG: TRIGGER ALARM & BUSTED! (MUST SKIP NEXT ROUND AS WELL)
          soundManager.playSecurityAlarm();
          setRedBusted(true);
          setRedSkipNextRound(true);
        } else {
          setRedLockedOut(true);
        }

        setTeamRed((prev) => ({
          ...prev,
          streak: 0,
          selectedAnswer: prev.currentInput,
          isLocked: true,
          lastResult: 'wrong',
          lastScoreGained: 0,
        }));

        // If Team Blue is also locked out or busted, both failed!
        if (blueLockedOut || blueBusted || blueIsSkipping) {
          if (timerRef.current) clearInterval(timerRef.current);
          setPhase('round_reveal');
          setTimeout(advanceRound, 2000);
        }
      }
    }
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden flex flex-col justify-between select-none bg-[#357fca]">
      
      {/* 1. FIXED FULL-BLEED 3D ESCAPE ROOM BACKGROUND (NEVER SHOWS WHITE GAPS) */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
        <Room3DScene />
      </div>

      {/* PHASE 1: START SCREEN */}
      {phase === 'start' && (
        <RoomStartScreen
          settings={settings}
          onUpdateSettings={setSettings}
          onStartGame={handleStartGame}
        />
      )}

      {/* PHASE 2: COUNTDOWN */}
      {phase === 'countdown' && (
        <CountdownOverlay onComplete={() => startRound(1)} />
      )}

      {/* PHASE 3: ACTIVE PLAYING WITH GLOBAL SCREEN ZOOM */}
      {(phase === 'playing' || phase === 'round_reveal') && (
        <div
          style={{ transform: `scale(${globalZoom})`, transformOrigin: 'center center' }}
          className="relative w-full h-full flex flex-col justify-between max-w-[1920px] mx-auto z-10 p-2 sm:p-4 transition-transform duration-200"
        >
          
          {/* TOP AREA: HUD */}
          <BankTopHUD
            teamBlue={teamBlue}
            teamRed={teamRed}
            currentRound={currentRound}
            totalRounds={settings.totalRounds}
            timeLeft={timeLeft}
          />

          {/* MAIN 3-COLUMN PLAYING SCREEN: TEAM 1 | CENTER 3D VAULT | TEAM 2 */}
          <div className="relative flex-1 grid grid-cols-12 gap-3 sm:gap-6 items-center px-2 sm:px-6 my-1">
            
            {/* LEFT COLUMN: TEAM 1 SCORE HEADER + COMPACT KEYPAD CONSOLE */}
            <div className="col-span-3 lg:col-span-3 flex flex-col items-center justify-center">
              <TeamConsoleScoreHeader team={teamBlue} />
              <FastCompetitiveConsole
                team={teamBlue}
                otherTeam={teamRed}
                isLockedOut={blueLockedOut}
                isStealOpportunity={redLockedOut && !blueLockedOut && !blueBusted && !blueIsSkipping}
                wrongStrikes={blueStrikes}
                isBusted={blueBusted}
                isSkippingRound={blueIsSkipping}
                correctAnswer={phase === 'round_reveal' && currentQuestion ? currentQuestion.answer : null}
                isRevealed={phase === 'round_reveal'}
                disabled={phase !== 'playing'}
                onDigitPress={handleDigitPress}
                onClearPress={handleClearPress}
                onSubmitPress={handleSubmitPress}
              />
            </div>

            {/* CENTER COLUMN: ARDUINO QUESTION BOX (TOP) + 3D ESCAPE ROOM VAULT */}
            <div className="col-span-6 lg:col-span-6 flex flex-col items-center justify-between h-full py-1">
              <VaultQuestionBox
                question={currentQuestion}
                roundNumber={currentRound}
                totalRounds={settings.totalRounds}
                onHome={() => setPhase('start')}
                onRestart={() => startRound(currentRound)}
                onZoomIn={() => setGlobalZoom((prev) => Math.min(prev + 0.1, 1.35))}
                onZoomOut={() => setGlobalZoom((prev) => Math.max(prev - 0.1, 0.85))}
              />
              <Vault3DDoor
                correctCount={correctCount}
                totalNeeded={settings.totalRounds}
                roundNumber={currentRound}
                lastSolvedTeam={lastSolvedTeam}
              />
            </div>

            {/* RIGHT COLUMN: TEAM 2 SCORE HEADER + COMPACT KEYPAD CONSOLE */}
            <div className="col-span-3 lg:col-span-3 flex flex-col items-center justify-center">
              <TeamConsoleScoreHeader team={teamRed} />
              <FastCompetitiveConsole
                team={teamRed}
                otherTeam={teamBlue}
                isLockedOut={redLockedOut}
                isStealOpportunity={blueLockedOut && !redLockedOut && !redBusted && !redIsSkipping}
                wrongStrikes={redStrikes}
                isBusted={redBusted}
                isSkippingRound={redIsSkipping}
                correctAnswer={phase === 'round_reveal' && currentQuestion ? currentQuestion.answer : null}
                isRevealed={phase === 'round_reveal'}
                disabled={phase !== 'playing'}
                onDigitPress={handleDigitPress}
                onClearPress={handleClearPress}
                onSubmitPress={handleSubmitPress}
              />
            </div>

          </div>

          {/* Floating Points Feedback */}
          <GameFeedback
            teamBlue={teamBlue}
            teamRed={teamRed}
            isRevealed={phase === 'round_reveal'}
            blueEarnedKey={blueEarnedKey}
            redEarnedKey={redEarnedKey}
          />
        </div>
      )}

      {/* PHASE 4: VICTORY TREASURY SCENE */}
      {phase === 'game_over' && (
        <RoomVictoryScreen
          teamBlue={teamBlue}
          teamRed={teamRed}
          onPlayAgain={() => {
            setTeamBlue(createInitialTeam('blue', settings.teamBlueName));
            setTeamRed(createInitialTeam('red', settings.teamRedName));
            setCorrectCount(0);
            setBlueStrikes(0);
            setRedStrikes(0);
            setBlueSkipNextRound(false);
            setRedSkipNextRound(false);
            setBlueIsSkipping(false);
            setRedIsSkipping(false);
            setPhase('countdown');
          }}
          onChangeSettings={() => setPhase('start')}
        />
      )}
    </main>
  );
};
