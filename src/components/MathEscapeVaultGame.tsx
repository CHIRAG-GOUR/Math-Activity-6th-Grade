'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Siren, Zap, ShieldAlert, Lock } from 'lucide-react';
import {
  GamePhase,
  GameSettings,
  Question,
  TeamId,
  TeamState,
} from '@/types/game';
import { generateQuestion, clearQuestionHistory } from '@/utils/questionGenerator';
import { soundManager } from '@/utils/audio';

// Visual & Sub-Components
import { Room3DScene } from './Room3DScene';
import { RoomStartScreen } from './RoomStartScreen';
import { RoomVictoryScreen } from './RoomVictoryScreen';
import { CountdownOverlay } from './CountdownOverlay';
import { BankTopHUD } from './BankTopHUD';
import { Vault3DDoor } from './Vault3DDoor';
import { VaultQuestionBox } from './VaultQuestionBox';
import { FastCompetitiveConsole } from './FastCompetitiveConsole';
import { TeamConsoleScoreHeader } from './TeamConsoleScoreHeader';
import { GameFeedback } from './GameFeedback';

const INITIAL_SETTINGS: GameSettings = {
  grade: '5-6',
  topic: 'mixed',
  topics: ['addition', 'subtraction', 'multiplication', 'division', 'mixed'],
  difficulty: 'medium',
  totalRounds: 5,
  timePerRound: 25,
  soundEnabled: true,
  teamBlueName: 'TEAM 1',
  teamRedName: 'TEAM 2',
};

const VAULT_UNLOCK_TARGET = 5;

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

  const [teamBlue, setTeamBlue] = useState<TeamState>(
    createInitialTeam('blue', INITIAL_SETTINGS.teamBlueName)
  );
  const [teamRed, setTeamRed] = useState<TeamState>(
    createInitialTeam('red', INITIAL_SETTINGS.teamRedName)
  );

  // Fast Keypad Lockout states
  const [blueLockedOut, setBlueLockedOut] = useState<boolean>(false);
  const [redLockedOut, setRedLockedOut] = useState<boolean>(false);

  // Wrong strikes
  const [blueStrikes, setBlueStrikes] = useState<number>(0);
  const [redStrikes, setRedStrikes] = useState<number>(0);
  const [blueBusted, setBlueBusted] = useState<boolean>(false);
  const [redBusted, setRedBusted] = useState<boolean>(false);

  // BUSTED PENALTY: SKIP NEXT ROUND
  const [blueSkipNextRound, setBlueSkipNextRound] = useState<boolean>(false);
  const [redSkipNextRound, setRedSkipNextRound] = useState<boolean>(false);
  const [blueIsSkipping, setBlueIsSkipping] = useState<boolean>(false);
  const [redIsSkipping, setRedIsSkipping] = useState<boolean>(false);

  // TIE-BREAKER SUDDEN DEATH MECHANICS
  const [isSuperTieBreaker, setIsSuperTieBreaker] = useState<boolean>(false);
  const [isPoliceBusted, setIsPoliceBusted] = useState<boolean>(false);
  const [tieBreakerIntro, setTieBreakerIntro] = useState<boolean>(false);

  // WHOLE SCREEN GLOBAL ZOOM
  const [globalZoom, setGlobalZoom] = useState<number>(1);

  const [currentRound, setCurrentRound] = useState<number>(1);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(INITIAL_SETTINGS.timePerRound);

  // Progressive vault door unlocking count
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [lastSolvedTeam, setLastSolvedTeam] = useState<'blue' | 'red' | null>(null);

  const [blueEarnedKey, setBlueEarnedKey] = useState<boolean>(false);
  const [redEarnedKey, setRedEarnedKey] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Start detective BGM at 40% volume on loop
  useEffect(() => {
    soundManager.startBgm(0.4);

    const handleFirstUserGesture = () => {
      soundManager.startBgm(0.4);
      window.removeEventListener('click', handleFirstUserGesture);
      window.removeEventListener('keydown', handleFirstUserGesture);
      window.removeEventListener('touchstart', handleFirstUserGesture);
    };

    window.addEventListener('click', handleFirstUserGesture);
    window.addEventListener('keydown', handleFirstUserGesture);
    window.addEventListener('touchstart', handleFirstUserGesture);

    return () => {
      window.removeEventListener('click', handleFirstUserGesture);
      window.removeEventListener('keydown', handleFirstUserGesture);
      window.removeEventListener('touchstart', handleFirstUserGesture);
    };
  }, []);

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
    setIsSuperTieBreaker(false);
    setIsPoliceBusted(false);
    setTieBreakerIntro(false);
    setPhase('countdown');
  };

  // Next round transition with TIE-BREAKER SUDDEN DEATH SUPPORT
  const advanceRound = useCallback(() => {
    if (currentRound >= settings.totalRounds && !isSuperTieBreaker) {
      // Check if scores are tied!
      if (teamBlue.score === teamRed.score) {
        // TRIGGER SUPER SUDDEN DEATH QUESTION
        setIsSuperTieBreaker(true);
        setTieBreakerIntro(true);
        soundManager.playSecurityAlarm();

        setTimeout(() => {
          setTieBreakerIntro(false);
          const activeTopics = settings.topics && settings.topics.length > 0 ? settings.topics : [settings.topic || 'mixed'];
          const q = generateQuestion(activeTopics, 'hard', '6', 99999);
          q.text = `⚡ [SUDDEN DEATH] ` + q.text;
          q.subText = 'TIE-BREAKER SUPER QUESTION // FIRST TEAM TO SOLVE WINS';
          setCurrentQuestion(q);
          setCurrentRound(settings.totalRounds + 1);
          setTimeLeft(35);

          // Reset lockouts and strikes for fair sudden death
          setBlueLockedOut(false);
          setBlueBusted(false);
          setBlueIsSkipping(false);
          setBlueStrikes(0);

          setRedLockedOut(false);
          setRedBusted(false);
          setRedIsSkipping(false);
          setRedStrikes(0);

          setTeamBlue((prev) => ({
            ...prev,
            currentInput: '',
            selectedAnswer: null,
            isLocked: false,
            lastResult: null,
            lastScoreGained: 0,
          }));

          setTeamRed((prev) => ({
            ...prev,
            currentInput: '',
            selectedAnswer: null,
            isLocked: false,
            lastResult: null,
            lastScoreGained: 0,
          }));

          setPhase('playing');
        }, 3200);
      } else {
        setPhase('game_over');
      }
    } else if (isSuperTieBreaker) {
      // Tie breaker ended without a victor: Police busts both!
      if (teamBlue.score === teamRed.score) {
        setIsPoliceBusted(true);
      }
      setPhase('game_over');
    } else {
      startRound(currentRound + 1);
    }
  }, [
    currentRound,
    settings.totalRounds,
    isSuperTieBreaker,
    teamBlue.score,
    teamRed.score,
    settings.topics,
    settings.topic,
    startRound,
  ]);

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

          if (isSuperTieBreaker) {
            // Super question expired: Police busts both!
            setIsPoliceBusted(true);
            setTimeout(() => setPhase('game_over'), 2000);
          } else {
            setTimeout(advanceRound, 2000);
          }
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
  }, [phase, isSuperTieBreaker, advanceRound]);

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
        if (timerRef.current) clearInterval(timerRef.current);
        setPhase('round_reveal');
        soundManager.playCorrect();
        soundManager.playVaultWheelTurn();

        const basePts = isSuperTieBreaker ? 200 : 100;
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

        if (isSuperTieBreaker) {
          // Instant Win for Team Blue on Sudden Death!
          setTimeout(() => setPhase('game_over'), 1600);
        } else {
          setTimeout(advanceRound, 1500);
        }

      } else {
        // WRONG ANSWER FOR TEAM BLUE
        soundManager.playWrong();
        setBlueLockedOut(true);

        setTeamBlue((prev) => ({
          ...prev,
          streak: 0,
          selectedAnswer: prev.currentInput,
          isLocked: true,
          lastResult: 'wrong',
          lastScoreGained: 0,
        }));

        if (isSuperTieBreaker) {
          // If in tie-breaker and red is also locked out -> both failed!
          if (redLockedOut || redBusted || redIsSkipping) {
            if (timerRef.current) clearInterval(timerRef.current);
            setIsPoliceBusted(true);
            setPhase('round_reveal');
            setTimeout(() => setPhase('game_over'), 2000);
          }
        } else {
          const newStrikes = blueStrikes + 1;
          setBlueStrikes(newStrikes);
          if (newStrikes >= 3) {
            soundManager.playSecurityAlarm();
            setBlueBusted(true);
            setBlueSkipNextRound(true);
          }
          if (redLockedOut || redBusted || redIsSkipping) {
            if (timerRef.current) clearInterval(timerRef.current);
            setPhase('round_reveal');
            setTimeout(advanceRound, 2000);
          }
        }
      }

    } else {
      // TEAM RED SUBMISSION
      if (teamRed.isLocked || redLockedOut || redBusted || redIsSkipping || !teamRed.currentInput) return;

      const isCorrect = String(teamRed.currentInput).trim() === String(currentQuestion.answer).trim();

      if (isCorrect) {
        if (timerRef.current) clearInterval(timerRef.current);
        setPhase('round_reveal');
        soundManager.playCorrect();
        soundManager.playVaultWheelTurn();

        const basePts = isSuperTieBreaker ? 200 : 100;
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

        if (isSuperTieBreaker) {
          // Instant Win for Team Red on Sudden Death!
          setTimeout(() => setPhase('game_over'), 1600);
        } else {
          setTimeout(advanceRound, 1500);
        }

      } else {
        // WRONG ANSWER FOR TEAM RED
        soundManager.playWrong();
        setRedLockedOut(true);

        setTeamRed((prev) => ({
          ...prev,
          streak: 0,
          selectedAnswer: prev.currentInput,
          isLocked: true,
          lastResult: 'wrong',
          lastScoreGained: 0,
        }));

        if (isSuperTieBreaker) {
          // If in tie-breaker and blue is also locked out -> both failed!
          if (blueLockedOut || blueBusted || blueIsSkipping) {
            if (timerRef.current) clearInterval(timerRef.current);
            setIsPoliceBusted(true);
            setPhase('round_reveal');
            setTimeout(() => setPhase('game_over'), 2000);
          }
        } else {
          const newStrikes = redStrikes + 1;
          setRedStrikes(newStrikes);
          if (newStrikes >= 3) {
            soundManager.playSecurityAlarm();
            setRedBusted(true);
            setRedSkipNextRound(true);
          }
          if (blueLockedOut || blueBusted || blueIsSkipping) {
            if (timerRef.current) clearInterval(timerRef.current);
            setPhase('round_reveal');
            setTimeout(advanceRound, 2000);
          }
        }
      }
    }
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#0c1829] select-none">
      
      {/* 3D Bank Room Background */}
      <Room3DScene />

      {/* SUDDEN DEATH INTRO MODAL */}
      <AnimatePresence>
        {tieBreakerIntro && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center select-none"
          >
            <div className="flex items-center gap-2.5 px-6 py-2 rounded-full bg-rose-600 border-2 border-white text-white font-mono font-black text-sm tracking-widest uppercase mb-4 shadow-[0_0_30px_#ff0000] animate-pulse">
              <Siren className="w-6 h-6 animate-bounce" />
              <span>SCORE TIED ({teamBlue.score} - {teamRed.score}) // SUDDEN DEATH</span>
            </div>
            <h2 className="text-5xl sm:text-7xl font-black font-bank uppercase text-white drop-shadow-[0_10px_35px_rgba(255,0,0,0.8)]">
              SUPER QUESTION INCOMING!
            </h2>
            <p className="text-base sm:text-xl font-black text-amber-300 font-game uppercase tracking-widest mt-4 max-w-2xl">
              FIRST TEAM TO ENTER THE CORRECT CODE WINS THE HEIST • IF BOTH ARE WRONG OR TIME RUNS OUT, POLICE BUSTS BOTH TEAMS!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PHASE 1: START SCREEN */}
      {phase === 'start' && (
        <RoomStartScreen
          settings={settings}
          onUpdateSettings={setSettings}
          onStartGame={handleStartGame}
        />
      )}

      {/* PHASE 2: 3-2-1 COUNTDOWN OVERLAY */}
      {phase === 'countdown' && (
        <CountdownOverlay
          onComplete={() => {
            startRound(1);
          }}
        />
      )}

      {/* PHASE 3: ACTIVE PLAYING / ROUND REVEAL */}
      {(phase === 'playing' || phase === 'round_reveal') && (
        <div
          style={{ transform: `scale(${globalZoom})`, transformOrigin: 'top center' }}
          className="relative w-full h-full flex flex-col items-center justify-between p-2 sm:p-3 md:p-4 z-30 transition-transform duration-200 overflow-hidden"
        >
          {/* Top Bar HUD with Round & Timer */}
          <BankTopHUD
            currentRound={currentRound}
            totalRounds={settings.totalRounds}
            timeLeft={timeLeft}
            totalTime={currentQuestion?.timeLimit || settings.timePerRound}
            isTieBreaker={isSuperTieBreaker}
          />

          {/* MAIN ARENA GRID: TEAM 1 (LEFT) | CENTER (VAULT + ARDUINO) | TEAM 2 (RIGHT) */}
          <div className="w-full flex-1 grid grid-cols-12 gap-2 sm:gap-3 md:gap-4 items-center justify-center max-w-[1400px] mx-auto z-20 my-auto">
            
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

      {/* PHASE 4: VICTORY TREASURY SCENE OR POLICE BUST LOCKDOWN */}
      {phase === 'game_over' && (
        <RoomVictoryScreen
          teamBlue={teamBlue}
          teamRed={teamRed}
          isPoliceBusted={isPoliceBusted}
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
            setIsSuperTieBreaker(false);
            setIsPoliceBusted(false);
            setTieBreakerIntro(false);
            setPhase('countdown');
          }}
          onChangeSettings={() => setPhase('start')}
        />
      )}
    </main>
  );
};
