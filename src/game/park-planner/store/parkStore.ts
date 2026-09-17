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
    installedObjects: [],
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
        if (teamState.hasAnsweredCurrent) return state;

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
        if (teamState.hasAnsweredCurrent) return state;

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
        if (teamState.hasAnsweredCurrent) return state;

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

      if (!q || team.hasAnsweredCurrent) return;

      // Determine correctness based on question mode
      let isCorrect = false;
      let targetCoord: Coordinate2D = q.targetPoint || { x: 0, y: 0 };

      if (q.mode === 'point_plot' || q.mode === 'translate' || q.mode === 'reflect' || q.mode === 'rotate') {
        if (team.selectedPoint && isEqualCoord(team.selectedPoint, q.correctAnswer as Coordinate2D)) {
          isCorrect = true;
          targetCoord = team.selectedPoint;
        } else if (typeof team.selectedAnswer === 'string') {
          const expectedStr = formatCoord(q.correctAnswer as Coordinate2D);
          if (team.selectedAnswer.replace(/\s+/g, '') === expectedStr.replace(/\s+/g, '')) {
            isCorrect = true;
          }
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

        const newHappiness = Math.min(100, team.citizenHappiness + q.physicalOutcome.happinessGain);
        const newRating = Number((1 + (newHappiness / 100) * 4).toFixed(1));
        const totalAnswered = team.totalAnswered + 1;
        const correctCount = team.correctAnswersCount + 1;

        set({
          [teamKey]: {
            ...team,
            hasAnsweredCurrent: true,
            isCurrentCorrect: true,
            feedbackMessage: `Correct! ${q.physicalOutcome.description}`,
            installedObjects: updatedObjects,
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
        // Incorrect
        parkAudio.playIncorrectBuzz();
        const totalAnswered = team.totalAnswered + 1;
        set({
          [teamKey]: {
            ...team,
            hasAnsweredCurrent: true,
            isCurrentCorrect: false,
            feedbackMessage: `Incorrect. Expected ${Array.isArray(q.correctAnswer) ? q.correctAnswer.map(formatCoord).join(', ') : typeof q.correctAnswer === 'object' ? formatCoord(q.correctAnswer as Coordinate2D) : q.correctAnswer}. Check your coordinates and try next round!`,
            totalAnswered,
            accuracy: Math.round((team.correctAnswersCount / totalAnswered) * 100),
          },
        });
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
          },
        });
      }
    },

    tickTransformProgress: (delta: number) => {
      set((state) => {
        let changed = false;
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

        const updatedBlueObjects = updateObjects(state.blueTeam.installedObjects);
        const updatedRedObjects = updateObjects(state.redTeam.installedObjects);

        if (!changed) return state;

        return {
          blueTeam: { ...state.blueTeam, installedObjects: updatedBlueObjects },
          redTeam: { ...state.redTeam, installedObjects: updatedRedObjects },
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
