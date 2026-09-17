// ============================================================
// PARK PLANNER — Zustand Game Store
// State Management for Dual-Team Simultaneous Cartesian 3D Park Construction
// ============================================================

import { create } from 'zustand';
import {
  TeamId,
  TeamParkState,
  ParkQuestion,
  InstalledParkObject,
  Coordinate2D,
  SimEvent,
  QuadrantBuildProgress,
} from '../types';
import { generateParkQuestions } from '../data/questions';
import {
  isEqualCoord,
  arePointListsEqual,
  formatCoord,
  translateCoord,
  reflectX,
  reflectY,
  reflectOrigin,
  rotateAroundOrigin,
} from '../engine/coordinateMath';
import { parkAudio } from '../engine/parkAudio';

export interface ParkStoreState {
  matchQuestionCount: 5 | 10 | 15;
  blueTeam: TeamParkState;
  redTeam: TeamParkState;
  blueQuestions: ParkQuestion[];
  redQuestions: ParkQuestion[];
  simEvents: SimEvent[];
  isMatchOver: boolean;
  winnerTeam: TeamId | 'tie' | null;
  selectedTeamPreview: TeamId; // For camera focus or combined view
  
  // Actions
  selectPoint: (teamId: TeamId, coord: Coordinate2D) => void;
  togglePolygonPoint: (teamId: TeamId, coord: Coordinate2D) => void;
  clearSelectedPoints: (teamId: TeamId) => void;
  selectOptionAnswer: (teamId: TeamId, answer: string | Coordinate2D) => void;
  submitAnswer: (teamId: TeamId) => void;
  advanceRound: (teamId: TeamId) => void;
  restartGame: (questionCount?: 5 | 10 | 15) => void;
  tickTransformProgress: (delta: number) => void;
  setTeamPreview: (teamId: TeamId) => void;
}

function createInitialQuadrantBuild(): QuadrantBuildProgress {
  return {
    q1Building: false,
    q1Built: false,
    q1Progress: 0,
    q2Building: false,
    q2Built: false,
    q2Progress: 0,
    q3Building: false,
    q3Built: false,
    q3Progress: 0,
    q4Building: false,
    q4Built: false,
    q4Progress: 0,
    fountainActive: false,
    gateUnlocked: false,
    gateOpenAngle: 0,
    grandOpeningActive: false,
    grandOpeningTimer: 0,
  };
}

function createInitialTeamState(teamId: TeamId, teamName: string, firstQuestion: ParkQuestion): TeamParkState {
  return {
    teamId,
    teamName,
    currentRound: 1,
    isMatchComplete: false,
    currentQuestion: firstQuestion,
    selectedPoint: null,
    selectedPoints: [],
    selectedAnswer: null,
    hasAnsweredCurrent: false,
    isCurrentCorrect: null,
    feedbackMessage: null,
    attemptsRemaining: 2,
    maxAttempts: 2,
    timeLeft: 60,
    isTimeExpired: false,
    installedObjects: [],
    quadrantBuild: createInitialQuadrantBuild(),
    citizenHappiness: 20,
    parkRating: 1,
    totalPointsPlaced: 0,
    transformationsCompleted: 0,
    accuracy: 100,
    totalAnswered: 0,
    correctAnswersCount: 0,
  };
}

export const useParkStore = create<ParkStoreState>((set, get) => {
  const initialCount: 5 | 10 | 15 = 5;
  const initialBlueQuestions = generateParkQuestions(initialCount);
  const initialRedQuestions = generateParkQuestions(initialCount);

  return {
    matchQuestionCount: initialCount,
    blueQuestions: initialBlueQuestions,
    redQuestions: initialRedQuestions,
    blueTeam: createInitialTeamState('blue', 'Blue Park Planners', initialBlueQuestions[0]),
    redTeam: createInitialTeamState('red', 'Red Park Planners', initialRedQuestions[0]),
    simEvents: [],
    isMatchOver: false,
    winnerTeam: null,
    selectedTeamPreview: 'blue',

    setTeamPreview: (teamId) => set({ selectedTeamPreview: teamId }),

    selectPoint: (teamId, coord) => {
      parkAudio.playCoordinateSelect();
      set((state) => {
        const teamKey = teamId === 'blue' ? 'blueTeam' : 'redTeam';
        const teamState = state[teamKey];
        if (teamState.hasAnsweredCurrent || teamState.isTimeExpired) return state;

        return {
          [teamKey]: {
            ...teamState,
            selectedPoint: coord,
            selectedAnswer: formatCoord(coord),
          },
        };
      });
    },

    togglePolygonPoint: (teamId, coord) => {
      parkAudio.playCoordinateSelect();
      set((state) => {
        const teamKey = teamId === 'blue' ? 'blueTeam' : 'redTeam';
        const teamState = state[teamKey];
        if (teamState.hasAnsweredCurrent || teamState.isTimeExpired) return state;

        const currentPoints = [...teamState.selectedPoints];
        const existingIdx = currentPoints.findIndex(p => isEqualCoord(p, coord));
        if (existingIdx >= 0) {
          currentPoints.splice(existingIdx, 1);
        } else {
          currentPoints.push(coord);
        }

        return {
          [teamKey]: {
            ...teamState,
            selectedPoints: currentPoints,
            selectedPoint: coord,
          },
        };
      });
    },

    clearSelectedPoints: (teamId) => {
      set((state) => {
        const teamKey = teamId === 'blue' ? 'blueTeam' : 'redTeam';
        return {
          [teamKey]: {
            ...state[teamKey],
            selectedPoints: [],
            selectedPoint: null,
            selectedAnswer: null,
          },
        };
      });
    },

    selectOptionAnswer: (teamId, answer) => {
      parkAudio.playCoordinateSelect();
      set((state) => {
        const teamKey = teamId === 'blue' ? 'blueTeam' : 'redTeam';
        const teamState = state[teamKey];
        if (teamState.hasAnsweredCurrent || teamState.isTimeExpired) return state;

        let parsedPoint: Coordinate2D | null = null;
        if (typeof answer === 'object' && answer !== null && 'x' in answer) {
          parsedPoint = answer as Coordinate2D;
        } else if (typeof answer === 'string') {
          const match = answer.match(/\((-?\d+),\s*(-?\d+)\)/);
          if (match) {
            parsedPoint = { x: parseInt(match[1]), y: parseInt(match[2]) };
          }
        }

        return {
          [teamKey]: {
            ...teamState,
            selectedAnswer: answer,
            selectedPoint: parsedPoint || teamState.selectedPoint,
          },
        };
      });
    },

    submitAnswer: (teamId) => {
      const state = get();
      const teamKey = teamId === 'blue' ? 'blueTeam' : 'redTeam';
      const team = state[teamKey];
      const q = team.currentQuestion;

      if (!q || team.hasAnsweredCurrent || team.isTimeExpired) return;

      // Determine correctness based on question mode
      let isCorrect = false;
      let targetCoord: Coordinate2D = q.targetPoint || { x: 0, y: 0 };

      if (q.mode === 'point_plot' || q.mode === 'translate' || q.mode === 'reflect' || q.mode === 'rotate') {
        if (team.selectedPoint && typeof q.correctAnswer === 'object' && isEqualCoord(team.selectedPoint, q.correctAnswer as Coordinate2D)) {
          isCorrect = true;
          targetCoord = team.selectedPoint;
        } else if (typeof team.selectedAnswer === 'string') {
          const expectedStr = typeof q.correctAnswer === 'object' ? formatCoord(q.correctAnswer as Coordinate2D) : String(q.correctAnswer);
          if (team.selectedAnswer.replace(/\s+/g, '') === expectedStr.replace(/\s+/g, '')) {
            isCorrect = true;
          }
        }
      } else if (q.mode === 'identify') {
        if (typeof team.selectedAnswer === 'string' && team.selectedAnswer === String(q.correctAnswer)) {
          isCorrect = true;
        }
      } else if (q.mode === 'polygon' || q.mode === 'path') {
        const expectedPoints = q.correctAnswer as Coordinate2D[];
        if (arePointListsEqual(team.selectedPoints, expectedPoints)) {
          isCorrect = true;
        } else if (typeof team.selectedAnswer === 'string' && team.selectedAnswer === q.options[0]) {
          isCorrect = true;
        }
      }

      if (isCorrect) {
        parkAudio.playCorrectChime();
        parkAudio.playConstructionStart();

        // Create or update 3D park object
        const newObjId = `${teamId}_${q.objectType}_${team.currentRound}`;
        const existingObjIdx = team.installedObjects.findIndex(o => o.type === q.objectType);
        const updatedObjects = [...team.installedObjects];

        if (existingObjIdx >= 0 && (q.mode === 'translate' || q.mode === 'reflect' || q.mode === 'rotate')) {
          const oldObj = updatedObjects[existingObjIdx];
          updatedObjects[existingObjIdx] = {
            ...oldObj,
            previousPosition: oldObj.position,
            position: targetCoord,
            isTransforming: true,
            transformProgress: 0,
            transformType: q.category,
            stagePlaced: team.currentRound,
          };
          parkAudio.playTransformationGlide();
        } else {
          // New placement
          const newObject: InstalledParkObject = {
            id: newObjId,
            type: q.objectType,
            teamId,
            name: q.objectName,
            position: targetCoord,
            polygonPoints: q.targetPoints || (team.selectedPoints.length > 0 ? team.selectedPoints : undefined),
            stagePlaced: team.currentRound,
            isConstructing: true,
            constructionProgress: 0,
            isActive: true,
          };
          updatedObjects.push(newObject);
        }

        // Trigger Quadrant Build State progression based on round number
        const updatedQuadrantBuild: QuadrantBuildProgress = { ...team.quadrantBuild };
        if (team.currentRound === 1) {
          updatedQuadrantBuild.q1Building = true;
          updatedQuadrantBuild.q1Progress = 0;
        } else if (team.currentRound === 2) {
          updatedQuadrantBuild.q2Building = true;
          updatedQuadrantBuild.q2Progress = 0;
        } else if (team.currentRound === 3) {
          updatedQuadrantBuild.q3Building = true;
          updatedQuadrantBuild.q3Progress = 0;
        } else if (team.currentRound === 4) {
          updatedQuadrantBuild.q4Building = true;
          updatedQuadrantBuild.q4Progress = 0;
          updatedQuadrantBuild.fountainActive = true;
        } else if (team.currentRound === 5) {
          updatedQuadrantBuild.gateUnlocked = true;
          updatedQuadrantBuild.grandOpeningActive = true;
          updatedQuadrantBuild.grandOpeningTimer = 15;
          parkAudio.playVictoryFanfare();
        }

        const newHappiness = Math.min(100, team.citizenHappiness + q.physicalOutcome.happinessGain);
        const newRating = Number((1 + (newHappiness / 100) * 4).toFixed(1));
        const totalAnswered = team.totalAnswered + 1;
        const correctCount = team.correctAnswersCount + 1;

        set({
          [teamKey]: {
            ...team,
            hasAnsweredCurrent: true,
            isCurrentCorrect: true,
            feedbackMessage: `✅ Correct! ${q.physicalOutcome.description}`,
            installedObjects: updatedObjects,
            quadrantBuild: updatedQuadrantBuild,
            citizenHappiness: newHappiness,
            parkRating: newRating,
            totalPointsPlaced: team.totalPointsPlaced + (q.targetPoints ? q.targetPoints.length : 1),
            transformationsCompleted: team.transformationsCompleted + (q.mode !== 'point_plot' ? 1 : 0),
            totalAnswered,
            correctAnswersCount: correctCount,
            accuracy: Math.round((correctCount / totalAnswered) * 100),
          },
        });
      } else {
        // Incorrect answer
        parkAudio.playIncorrectBuzz();
        const remaining = team.attemptsRemaining - 1;

        if (remaining > 0) {
          // 1 attempt remaining - allow retry!
          set({
            [teamKey]: {
              ...team,
              attemptsRemaining: remaining,
              hasAnsweredCurrent: false,
              isCurrentCorrect: null,
              selectedAnswer: null,
              feedbackMessage: `⚠️ Not quite right! You have 1 try remaining. Tip: Check the X and Y coordinates and try again!`,
            },
          });
        } else {
          // 0 attempts remaining - out of tries, no construction!
          const totalAnswered = team.totalAnswered + 1;
          const expectedStr = typeof q.correctAnswer === 'object' && !Array.isArray(q.correctAnswer)
            ? formatCoord(q.correctAnswer as Coordinate2D)
            : Array.isArray(q.correctAnswer)
            ? q.correctAnswer.map(formatCoord).join(', ')
            : String(q.correctAnswer);

          set({
            [teamKey]: {
              ...team,
              attemptsRemaining: 0,
              hasAnsweredCurrent: true,
              isCurrentCorrect: false,
              feedbackMessage: `❌ Out of tries (2/2 used). Expected: ${expectedStr}. No construction progress made this round.`,
              totalAnswered,
              accuracy: Math.round((team.correctAnswersCount / totalAnswered) * 100),
            },
          });
        }
      }
    },

    advanceRound: (teamId) => {
      const state = get();
      const teamKey = teamId === 'blue' ? 'blueTeam' : 'redTeam';
      const questions = teamId === 'blue' ? state.blueQuestions : state.redQuestions;
      const team = state[teamKey];

      const nextRound = team.currentRound + 1;
      const isComplete = nextRound > state.matchQuestionCount;

      if (isComplete) {
        // Check if both teams are finished
        const otherTeamKey = teamId === 'blue' ? 'redTeam' : 'blueTeam';
        const otherTeam = state[otherTeamKey];
        const isMatchOver = otherTeam.isMatchComplete;

        let winner: TeamId | 'tie' | null = null;
        if (isMatchOver) {
          const blueScore = state.blueTeam.citizenHappiness * state.blueTeam.parkRating;
          const redScore = state.redTeam.citizenHappiness * state.redTeam.parkRating;
          if (blueScore > redScore) winner = 'blue';
          else if (redScore > blueScore) winner = 'red';
          else winner = 'tie';
          parkAudio.playVictoryFanfare();
        }

        set({
          [teamKey]: {
            ...team,
            isMatchComplete: true,
            hasAnsweredCurrent: true,
          },
          isMatchOver: isMatchOver,
          winnerTeam: winner,
        });
      } else {
        const nextQ = questions[nextRound - 1] || questions[0];
        set({
          [teamKey]: {
            ...team,
            currentRound: nextRound,
            currentQuestion: nextQ,
            selectedPoint: null,
            selectedPoints: [],
            selectedAnswer: null,
            hasAnsweredCurrent: false,
            isCurrentCorrect: null,
            feedbackMessage: null,
            attemptsRemaining: 2,
            maxAttempts: 2,
            timeLeft: 60,
            isTimeExpired: false,
          },
        });
      }
    },

    tickTransformProgress: (delta: number) => {
      set((state) => {
        let changed = false;

        // Countdown timer for blue and red teams (60 seconds per round)
        const updateTeamTimer = (team: TeamParkState): TeamParkState => {
          if (team.hasAnsweredCurrent || team.isMatchComplete || team.isTimeExpired) {
            return team;
          }
          changed = true;
          const newTime = Math.max(0, team.timeLeft - delta);
          if (newTime <= 0) {
            parkAudio.playIncorrectBuzz();
            return {
              ...team,
              timeLeft: 0,
              isTimeExpired: true,
              hasAnsweredCurrent: true,
              isCurrentCorrect: false,
              feedbackMessage: `⏰ Time's up! (60s expired) No construction progress was made for this round.`,
            };
          }
          return {
            ...team,
            timeLeft: newTime,
          };
        };

        const updateQuadrantBuild = (qb: QuadrantBuildProgress): QuadrantBuildProgress => {
          const updated = { ...qb };
          // 8-10s construction duration: rate = delta / 8.5
          const buildRate = delta / 8.5;

          if (updated.q1Building) {
            changed = true;
            const p = updated.q1Progress + buildRate;
            if (p >= 1) {
              updated.q1Progress = 1;
              updated.q1Building = false;
              updated.q1Built = true;
            } else {
              updated.q1Progress = p;
            }
          }
          if (updated.q2Building) {
            changed = true;
            const p = updated.q2Progress + buildRate;
            if (p >= 1) {
              updated.q2Progress = 1;
              updated.q2Building = false;
              updated.q2Built = true;
            } else {
              updated.q2Progress = p;
            }
          }
          if (updated.q3Building) {
            changed = true;
            const p = updated.q3Progress + buildRate;
            if (p >= 1) {
              updated.q3Progress = 1;
              updated.q3Building = false;
              updated.q3Built = true;
            } else {
              updated.q3Progress = p;
            }
          }
          if (updated.q4Building) {
            changed = true;
            const p = updated.q4Progress + buildRate;
            if (p >= 1) {
              updated.q4Progress = 1;
              updated.q4Building = false;
              updated.q4Built = true;
            } else {
              updated.q4Progress = p;
            }
          }

          // Gate opening angle interpolation (0 to PI/2 over ~2.5s)
          if (updated.gateUnlocked && updated.gateOpenAngle < Math.PI / 2) {
            changed = true;
            updated.gateOpenAngle = Math.min(Math.PI / 2, updated.gateOpenAngle + delta * 0.7);
          }

          // Grand opening timer countdown (15s sequence)
          if (updated.grandOpeningActive && updated.grandOpeningTimer > 0) {
            changed = true;
            updated.grandOpeningTimer = Math.max(0, updated.grandOpeningTimer - delta);
          }

          return updated;
        };

        const updateObjects = (objs: InstalledParkObject[]) => {
          return objs.map((obj) => {
            if (obj.isTransforming) {
              changed = true;
              const newProgress = Math.min(1, (obj.transformProgress || 0) + delta * 0.9);
              return {
                ...obj,
                transformProgress: newProgress,
                isTransforming: newProgress < 1,
              };
            }
            if (obj.isConstructing) {
              changed = true;
              const newProgress = Math.min(1, (obj.constructionProgress || 0) + delta * 1.2);
              return {
                ...obj,
                constructionProgress: newProgress,
                isConstructing: newProgress < 1,
              };
            }
            return obj;
          });
        };

        const updatedBlueTeam = updateTeamTimer(state.blueTeam);
        const updatedRedTeam = updateTeamTimer(state.redTeam);
        const updatedBlueQb = updateQuadrantBuild(updatedBlueTeam.quadrantBuild);
        const updatedRedQb = updateQuadrantBuild(updatedRedTeam.quadrantBuild);
        const updatedBlueObjects = updateObjects(updatedBlueTeam.installedObjects);
        const updatedRedObjects = updateObjects(updatedRedTeam.installedObjects);

        if (!changed) return state;

        return {
          blueTeam: {
            ...updatedBlueTeam,
            quadrantBuild: updatedBlueQb,
            installedObjects: updatedBlueObjects,
          },
          redTeam: {
            ...updatedRedTeam,
            quadrantBuild: updatedRedQb,
            installedObjects: updatedRedObjects,
          },
        };
      });
    },

    restartGame: (questionCount) => {
      const count = questionCount || get().matchQuestionCount;
      const blueQs = generateParkQuestions(count);
      const redQs = generateParkQuestions(count);

      set({
        matchQuestionCount: count,
        blueQuestions: blueQs,
        redQuestions: redQs,
        blueTeam: createInitialTeamState('blue', 'Blue Park Planners', blueQs[0]),
        redTeam: createInitialTeamState('red', 'Red Park Planners', redQs[0]),
        isMatchOver: false,
        winnerTeam: null,
      });
    },
  };
});

