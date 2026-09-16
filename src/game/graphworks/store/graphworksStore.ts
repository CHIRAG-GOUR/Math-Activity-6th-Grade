// ============================================================
// GRAPHWORKS — THE DATA CITY: Zustand Game State Store
// Manages two-team state, graph data, city simulation,
// scoring, rounds, and mission progression.
// ============================================================

import { create } from 'zustand';
import { getCompetitiveQuestion } from '../data/questions';
import { soundManager } from '@/utils/audio';

// ── GRAPH DATA TYPES ──
export type GraphType = 'line' | 'bar' | 'pictograph' | 'coordinate' | 'pie';
export type RoundPhase = 'read' | 'complete' | 'build' | 'interpret' | 'create';
export type GamePhase = 'briefing' | 'playing' | 'checking' | 'running' | 'feedback' | 'victory';
export type CityDistrict = 'weather' | 'traffic' | 'water' | 'power' | 'train' | 'park';
export type Team = 'blue' | 'red';

export interface DataPoint {
  label: string;
  value: number;
}

export interface GraphAxis {
  title: string;
  min: number;
  max: number;
  step: number;
  labels: string[];
}

export interface PlottedPoint {
  x: number;  // pixel or index position
  y: number;  // value
  label: string;
  connected: boolean;
}

export interface PlottedBar {
  label: string;
  height: number; // value
}

export interface GraphValidation {
  isCorrect: boolean;
  accuracy: number;        // 0–100
  feedback: string[];
  pointsCorrect: number;
  pointsTotal: number;
  axisCorrect: boolean;
  scaleCorrect: boolean;
  labelsCorrect: boolean;
}

export interface MissionQuestion {
  id: string;
  round: number;
  phase: RoundPhase;
  district: CityDistrict;
  graphType: GraphType;
  title: string;
  instruction: string;
  dataTable: DataPoint[];
  xAxis: GraphAxis;
  yAxis: GraphAxis;
  expectedValues: number[];
  unit: string;
  interpretationQ?: string;
  interpretationA?: string;
  createConditions?: string[];
  partialGraphData?: number[];    // for 'complete' phase (pre-filled values, -1 = missing)
  difficulty: number;  // 1–5
}

export interface TeamState {
  team: Team;
  currentMission: MissionQuestion | null;
  missionIndex: number;
  completedMissions: number;

  // Graph editor state
  graphType: GraphType;
  plottedPoints: PlottedPoint[];
  plottedBars: PlottedBar[];
  selectedTool: 'select' | 'addPoint' | 'movePoint' | 'addBar' | 'connect' | 'erase' | 'label';

  // Validation
  lastValidation: GraphValidation | null;
  showFeedback: boolean;

  // Interpretation answer
  interpretationAnswer: string;

  // Scoring
  graphAccuracy: number;
  interpretationScore: number;
  creationScore: number;
  cityEfficiency: number;
  totalScore: number;
  speedBonus: number;

  // City progression
  activatedDistricts: CityDistrict[];
  cityLevel: number;  // 0–5
}

export interface CityWeatherState {
  temperature: number;
  rainfall: number;
  windSpeed: number;
  cloudCover: number;    // 0–1
  isRaining: boolean;
  sunIntensity: number;  // 0–1
}

export interface CityTrafficState {
  vehicleCount: number;
  pedestrianCount: number;
  congestionLevel: number; // 0–1
}

export interface CityWaterState {
  reservoirLevel: number;  // 0–100
  pumpActive: boolean;
  flowRate: number;
}

export interface CityPowerState {
  generationMW: number;
  consumptionMW: number;
  turbineRPM: number;
  gridActive: boolean;
}

export interface CityTrainState {
  trainPosition: number;  // 0–1 along track
  distanceMeters: number; // actual meters plotted
  speed: number;
  atStation: boolean;
  isStopped: boolean;
  passengerCount: number;
}

export interface CityParkState {
  visitorCount: number;
  fountainActive: boolean;
  activityLevel: number;  // 0–1
  fountainHeight: number; // 0.4 to 2.5 meters
}

export interface CityState {
  weather: CityWeatherState;
  traffic: CityTrafficState;
  water: CityWaterState;
  power: CityPowerState;
  train: CityTrainState;
  park: CityParkState;
}

export interface CityLiveTelemetry {
  team: Team;
  district: CityDistrict;
  value: number;
  prevValue: number;
  delta: number;
  trend: 'increasing' | 'constant' | 'decreasing' | 'initial';
  timestamp: number;
  dataLabel: string;
  targetIndex: number;
}

export interface ActiveDataPulse {
  id: number;
  team: Team;
  district: CityDistrict;
  value: number;
  timestamp: number;
}

export interface RoundWinBannerData {
  visible: boolean;
  team: Team | 'tie';
  title: string;
  subtitle: string;
  round: number;
}

export interface GraphworksStore {
  // Game phase
  gamePhase: GamePhase;
  currentRound: number;       // 1–5
  roundPhase: RoundPhase;
  timer: number;              // seconds remaining
  isTimerRunning: boolean;

  // Teams
  blue: TeamState;
  red: TeamState;

  // City
  blueCity: CityState;
  redCity: CityState;

  // Real-time live control telemetry & data pulses
  blueTelemetry: CityLiveTelemetry | null;
  redTelemetry: CityLiveTelemetry | null;
  activePulses: ActiveDataPulse[];

  // 5-Question First-to-Answer Race State
  roundWins: { blue: number; red: number };
  roundWinner: Team | 'tie' | null;
  roundWinnersHistory: Array<Team | 'tie'>;
  roundBanner: RoundWinBannerData | null;
  roundTransitionPending: boolean;

  // City animation
  isRunningGraph: boolean;
  runningTeam: Team | null;
  graphRunProgress: number;   // 0–1

  // Actions
  startGame: () => void;
  setMission: (team: Team, mission: MissionQuestion) => void;
  setTool: (team: Team, tool: TeamState['selectedTool']) => void;
  addPlottedPoint: (team: Team, point: PlottedPoint) => void;
  updatePlottedPoint: (team: Team, index: number, point: Partial<PlottedPoint>) => void;
  removePlottedPoint: (team: Team, index: number) => void;
  setPlottedBars: (team: Team, bars: PlottedBar[]) => void;
  updateBarHeight: (team: Team, index: number, height: number) => void;
  clearGraph: (team: Team) => void;
  checkGraph: (team: Team) => void;
  runGraph: (team: Team) => void;
  setInterpretationAnswer: (team: Team, answer: string) => void;
  submitInterpretation: (team: Team) => void;
  advanceRound: () => void;
  setRoundBanner: (banner: RoundWinBannerData | null) => void;
  setGraphRunProgress: (progress: number) => void;
  updateCityFromGraph: (team: Team, values: number[], district: CityDistrict) => void;
  syncCityFromCurrentGraph: (team: Team, activeIndex?: number) => void;
  triggerDataPulse: (team: Team, district: CityDistrict, value: number) => void;
  setGamePhase: (phase: GamePhase) => void;
  setShowFeedback: (team: Team, show: boolean) => void;
  restartGame: () => void;
}

// ── DEFAULT STATES ──
const defaultWeather: CityWeatherState = {
  temperature: 15, rainfall: 0, windSpeed: 5, cloudCover: 0.3,
  isRaining: false, sunIntensity: 0.7,
};

const defaultTraffic: CityTrafficState = {
  vehicleCount: 10, pedestrianCount: 20, congestionLevel: 0.2,
};

const defaultWater: CityWaterState = {
  reservoirLevel: 50, pumpActive: false, flowRate: 0,
};

const defaultPower: CityPowerState = {
  generationMW: 30, consumptionMW: 20, turbineRPM: 0, gridActive: false,
};

const defaultTrain: CityTrainState = {
  trainPosition: 0, distanceMeters: 0, speed: 0, atStation: true, isStopped: true, passengerCount: 0,
};

const defaultPark: CityParkState = {
  visitorCount: 10, fountainActive: false, activityLevel: 0.3, fountainHeight: 0.8,
};

const defaultCity: CityState = {
  weather: { ...defaultWeather },
  traffic: { ...defaultTraffic },
  water: { ...defaultWater },
  power: { ...defaultPower },
  train: { ...defaultTrain },
  park: { ...defaultPark },
};

const createDefaultTeam = (team: Team): TeamState => ({
  team,
  currentMission: null,
  missionIndex: 0,
  completedMissions: 0,
  graphType: 'line',
  plottedPoints: [],
  plottedBars: [],
  selectedTool: 'addPoint',
  lastValidation: null,
  showFeedback: false,
  interpretationAnswer: '',
  graphAccuracy: 0,
  interpretationScore: 0,
  creationScore: 0,
  cityEfficiency: 0,
  totalScore: 0,
  speedBonus: 0,
  activatedDistricts: [],
  cityLevel: 0,
});

// ── GRAPH VALIDATION ENGINE ──
function validateGraph(team: TeamState): GraphValidation {
  const mission = team.currentMission;
  if (!mission) {
    return {
      isCorrect: false, accuracy: 0, feedback: ['No mission loaded.'],
      pointsCorrect: 0, pointsTotal: 0, axisCorrect: false,
      scaleCorrect: false, labelsCorrect: false,
    };
  }

  const expected = mission.expectedValues;
  const feedback: string[] = [];
  let pointsCorrect = 0;
  const pointsTotal = expected.length;

  if (mission.graphType === 'bar' || mission.graphType === 'pie' || mission.graphType === 'pictograph') {
    const bars = team.plottedBars;
    if (bars.length !== expected.length) {
      feedback.push(`Expected ${expected.length} categories, but you have ${bars.length}.`);
    }
    bars.forEach((bar, i) => {
      if (i < expected.length) {
        const diff = Math.abs(bar.height - expected[i]);
        const tolerance = Math.max(expected[i] * 0.1, 2);
        if (diff <= tolerance) {
          pointsCorrect++;
        } else {
          feedback.push(`"${bar.label}": expected ${expected[i]}${mission.unit}, got ${Math.round(bar.height)}${mission.unit}.`);
        }
      }
    });
  } else {
    // line / coordinate
    const points = team.plottedPoints;
    if (points.length < expected.length) {
      feedback.push(`Expected ${expected.length} points, but you plotted ${points.length}.`);
    }
    points.forEach((pt, i) => {
      if (i < expected.length) {
        const diff = Math.abs(pt.y - expected[i]);
        const tolerance = Math.max(expected[i] * 0.1, 2);
        if (diff <= tolerance) {
          pointsCorrect++;
        } else {
          feedback.push(`Point at "${pt.label}": expected ${expected[i]}${mission.unit}, your value is ${Math.round(pt.y)}${mission.unit}.`);
        }
      }
    });
  }

  const accuracy = pointsTotal > 0 ? Math.round((pointsCorrect / pointsTotal) * 100) : 0;
  const isCorrect = accuracy >= 80;

  if (accuracy === 100) {
    feedback.unshift('🎉 Perfect graph! All data values are correct.');
  } else if (accuracy >= 80) {
    feedback.unshift('✅ Good work! Most values are accurate.');
  } else if (accuracy >= 50) {
    feedback.unshift('📊 Partial credit — review the highlighted values.');
  } else {
    feedback.unshift('📝 Keep trying — check your data table carefully.');
  }

  return {
    isCorrect,
    accuracy,
    feedback,
    pointsCorrect,
    pointsTotal,
    axisCorrect: true,
    scaleCorrect: true,
    labelsCorrect: true,
  };
}

// ── STORE ──
export const useGraphworksStore = create<GraphworksStore>((set, get) => ({
  gamePhase: 'briefing',
  currentRound: 1,
  roundPhase: 'read',
  timer: 300,
  isTimerRunning: false,

  // 5-Question First-to-Answer Race State
  roundWins: { blue: 0, red: 0 },
  roundWinner: null,
  roundWinnersHistory: [],
  roundBanner: null,
  roundTransitionPending: false,

  blue: createDefaultTeam('blue'),
  red: createDefaultTeam('red'),

  blueCity: { ...defaultCity },
  redCity: { ...defaultCity },

  blueTelemetry: null,
  redTelemetry: null,
  activePulses: [],

  isRunningGraph: false,
  runningTeam: null,
  graphRunProgress: 0,

  setRoundBanner: (banner) => set({ roundBanner: banner }),

  startGame: () => {
    const q1 = getCompetitiveQuestion(1);
    const blueInitial = createDefaultTeam('blue');
    const redInitial = createDefaultTeam('red');

    blueInitial.currentMission = q1;
    blueInitial.graphType = q1.graphType;
    blueInitial.plottedBars = (q1.graphType === 'bar' || q1.graphType === 'pie' || q1.graphType === 'pictograph')
      ? q1.dataTable.map((d) => ({ label: d.label, height: 0 }))
      : [];

    redInitial.currentMission = q1;
    redInitial.graphType = q1.graphType;
    redInitial.plottedBars = (q1.graphType === 'bar' || q1.graphType === 'pie' || q1.graphType === 'pictograph')
      ? q1.dataTable.map((d) => ({ label: d.label, height: 0 }))
      : [];

    set({
      gamePhase: 'playing',
      currentRound: 1,
      roundPhase: 'build',
      timer: 300,
      isTimerRunning: true,
      roundWins: { blue: 0, red: 0 },
      roundWinner: null,
      roundWinnersHistory: [],
      roundBanner: null,
      roundTransitionPending: false,
      blue: blueInitial,
      red: redInitial,
      blueCity: { ...defaultCity },
      redCity: { ...defaultCity },
      blueTelemetry: null,
      redTelemetry: null,
      activePulses: [],
    });
    get().syncCityFromCurrentGraph('blue', 0);
    get().syncCityFromCurrentGraph('red', 0);
  },

  setMission: (team, mission) => {
    set((s) => ({
      [team]: {
        ...s[team],
        currentMission: mission,
        graphType: mission.graphType,
        plottedPoints: [],
        plottedBars: (mission.graphType === 'bar' || mission.graphType === 'pie' || mission.graphType === 'pictograph')
          ? mission.dataTable.map((d) => ({ label: d.label, height: 0 }))
          : [],
        lastValidation: null,
        showFeedback: false,
        interpretationAnswer: '',
      },
    }));
    get().syncCityFromCurrentGraph(team, 0);
  },

  setTool: (team, tool) => set((s) => ({
    [team]: { ...s[team], selectedTool: tool },
  })),

  addPlottedPoint: (team, point) => {
    set((s) => ({
      [team]: {
        ...s[team],
        plottedPoints: [...s[team].plottedPoints, point],
      },
    }));
    get().syncCityFromCurrentGraph(team, point.x);
  },

  updatePlottedPoint: (team, index, updates) => {
    set((s) => {
      const pts = [...s[team].plottedPoints];
      if (pts[index]) pts[index] = { ...pts[index], ...updates };
      return { [team]: { ...s[team], plottedPoints: pts } };
    });
    get().syncCityFromCurrentGraph(team, index);
  },

  removePlottedPoint: (team, index) => {
    set((s) => ({
      [team]: {
        ...s[team],
        plottedPoints: s[team].plottedPoints.filter((_, i) => i !== index),
      },
    }));
    get().syncCityFromCurrentGraph(team);
  },

  setPlottedBars: (team, bars) => {
    set((s) => ({
      [team]: { ...s[team], plottedBars: bars },
    }));
    get().syncCityFromCurrentGraph(team);
  },

  updateBarHeight: (team, index, height) => {
    set((s) => {
      const bars = [...s[team].plottedBars];
      if (bars[index]) bars[index] = { ...bars[index], height };
      return { [team]: { ...s[team], plottedBars: bars } };
    });
    get().syncCityFromCurrentGraph(team, index);
  },

  clearGraph: (team) => {
    set((s) => ({
      [team]: {
        ...s[team],
        plottedPoints: [],
        plottedBars: (s[team].currentMission?.graphType === 'bar' || s[team].currentMission?.graphType === 'pie' || s[team].currentMission?.graphType === 'pictograph')
          ? (s[team].currentMission?.dataTable.map((d) => ({ label: d.label, height: 0 })) ?? [])
          : [],
        lastValidation: null,
        showFeedback: false,
      },
    }));
    get().syncCityFromCurrentGraph(team, 0);
  },

  checkGraph: (team) => {
    const state = get();
    // If a round winner was already declared and transition is in flight, prevent duplicate triggers
    if (state.roundWinner && state.roundWinner !== team && state.roundTransitionPending) {
      return;
    }

    const teamState = state[team];
    const validation = validateGraph(teamState);

    set((s) => ({
      [team]: {
        ...s[team],
        lastValidation: validation,
        showFeedback: true,
        graphAccuracy: Math.max(s[team].graphAccuracy, validation.accuracy),
      },
      gamePhase: 'checking',
    }));

    // If accuracy >= 80%: SUCCESS!
    if (validation.accuracy >= 80) {
      // Check if this team is the FIRST to answer!
      if (!get().roundWinner) {
        const winningTeam = team;
        const currentRoundNum = get().currentRound;
        const newWins = {
          ...get().roundWins,
          [winningTeam]: get().roundWins[winningTeam] + 1,
        };
        const newHistory = [...get().roundWinnersHistory, winningTeam];

        soundManager.playCorrect(true);

        const banner: RoundWinBannerData = {
          visible: true,
          team: winningTeam,
          title: `⚡ ${winningTeam.toUpperCase()} TEAM ANSWERED FIRST!`,
          subtitle: `ROUND ${currentRoundNum} OF 5 WON (+100 PTS) · ${
            currentRoundNum >= 5 ? 'CHAMPIONSHIP CONCLUDED!' : `ROUND ${currentRoundNum + 1} LOADING...`
          }`,
          round: currentRoundNum,
        };

        set((s) => ({
          roundWinner: winningTeam,
          roundWins: newWins,
          roundWinnersHistory: newHistory,
          roundBanner: banner,
          roundTransitionPending: true,
          [winningTeam]: {
            ...s[winningTeam],
            totalScore: s[winningTeam].totalScore + 100 + validation.accuracy,
            completedMissions: s[winningTeam].completedMissions + 1,
            cityLevel: Math.min(5, s[winningTeam].cityLevel + 1),
          },
        }));

        // Trigger dynamic city simulation run for winning team
        get().runGraph(winningTeam);

        // Transition timer to advance to next question or declare victory
        setTimeout(() => {
          const sNow = get();
          if (sNow.currentRound >= 5) {
            set({
              gamePhase: 'victory',
              roundBanner: null,
              roundTransitionPending: false,
            });
          } else {
            get().advanceRound();
          }
        }, 2800);
      } else {
        // Second team to finish correctly
        soundManager.playClick();
        set((s) => ({
          [team]: {
            ...s[team],
            totalScore: s[team].totalScore + Math.round(validation.accuracy * 0.5),
            completedMissions: s[team].completedMissions + 1,
          },
        }));
      }
    } else {
      // Inaccurate (<80%)
      soundManager.playKeypadBeep();
    }
  },

  runGraph: (team) => {
    const state = get();
    const teamState = state[team];
    const mission = teamState.currentMission;
    if (!mission) return;

    set({
      isRunningGraph: true,
      runningTeam: team,
      graphRunProgress: 0,
      gamePhase: 'running',
    });

    // Extract values from the plotted graph
    const values = mission.graphType === 'bar'
      ? teamState.plottedBars.map((b) => b.height)
      : teamState.plottedPoints.map((p) => p.y);

    // Animate graph run over 3 seconds
    const duration = 3000;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentIndex = Math.floor(progress * values.length);

      // Update city based on current progress
      if (currentIndex < values.length) {
        get().updateCityFromGraph(team, values.slice(0, currentIndex + 1), mission.district);
      }

      set({ graphRunProgress: progress });

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Graph run complete
        const accuracy = teamState.lastValidation?.accuracy ?? 0;
        const scoreGain = Math.round(accuracy * 0.8 + (accuracy >= 90 ? 20 : 0));

        set((s) => ({
          isRunningGraph: false,
          runningTeam: null,
          gamePhase: 'feedback',
          [team]: {
            ...s[team],
            completedMissions: s[team].completedMissions + 1,
            totalScore: s[team].totalScore + scoreGain,
            cityLevel: Math.min(5, s[team].cityLevel + (accuracy >= 80 ? 1 : 0)),
            cityEfficiency: Math.min(100, s[team].cityEfficiency + Math.round(accuracy * 0.2)),
            activatedDistricts: accuracy >= 60 && !s[team].activatedDistricts.includes(mission.district)
              ? [...s[team].activatedDistricts, mission.district]
              : s[team].activatedDistricts,
          },
        }));
      }
    };
    requestAnimationFrame(animate);
  },

  setInterpretationAnswer: (team, answer) => set((s) => ({
    [team]: { ...s[team], interpretationAnswer: answer },
  })),

  submitInterpretation: (team) => set((s) => {
    const teamState = s[team];
    const mission = teamState.currentMission;
    if (!mission?.interpretationA) return {};

    const correct = teamState.interpretationAnswer.trim().toLowerCase() === mission.interpretationA.toLowerCase();
    const scoreGain = correct ? 15 : 5;

    return {
      [team]: {
        ...teamState,
        interpretationScore: teamState.interpretationScore + scoreGain,
        totalScore: teamState.totalScore + scoreGain,
        showFeedback: true,
        lastValidation: {
          ...(teamState.lastValidation ?? {
            isCorrect: false, accuracy: 0, feedback: [], pointsCorrect: 0,
            pointsTotal: 0, axisCorrect: true, scaleCorrect: true, labelsCorrect: true,
          }),
          feedback: [
            correct
              ? `✅ Correct! "${mission.interpretationA}" is right.`
              : `📝 The answer is "${mission.interpretationA}". Good effort!`,
          ],
        },
      },
    };
  }),

  advanceRound: () => {
    const s = get();
    const nextRound = s.currentRound + 1;

    if (nextRound > 5) {
      set({ gamePhase: 'victory', roundBanner: null, roundTransitionPending: false });
      return;
    }

    const nextMission = getCompetitiveQuestion(nextRound);

    set({
      currentRound: nextRound,
      roundPhase: 'build',
      roundWinner: null,
      roundBanner: null,
      roundTransitionPending: false,
      gamePhase: 'playing',
      blue: {
        ...s.blue,
        currentMission: nextMission,
        graphType: nextMission.graphType,
        plottedPoints: [],
        plottedBars: (nextMission.graphType === 'bar' || nextMission.graphType === 'pie' || nextMission.graphType === 'pictograph')
          ? nextMission.dataTable.map((d) => ({ label: d.label, height: 0 }))
          : [],
        lastValidation: null,
        showFeedback: false,
      },
      red: {
        ...s.red,
        currentMission: nextMission,
        graphType: nextMission.graphType,
        plottedPoints: [],
        plottedBars: (nextMission.graphType === 'bar' || nextMission.graphType === 'pie' || nextMission.graphType === 'pictograph')
          ? nextMission.dataTable.map((d) => ({ label: d.label, height: 0 }))
          : [],
        lastValidation: null,
        showFeedback: false,
      },
    });

    get().syncCityFromCurrentGraph('blue', 0);
    get().syncCityFromCurrentGraph('red', 0);
  },

  setGraphRunProgress: (progress) => set({ graphRunProgress: progress }),

  updateCityFromGraph: (team, values, district) => {
    const cityKey = team === 'blue' ? 'blueCity' : 'redCity';
    const avg = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
    const latest = values.length > 0 ? values[values.length - 1] : 0;

    set((s) => {
      const city = { ...s[cityKey] };

      switch (district) {
        case 'weather':
          city.weather = {
            ...city.weather,
            temperature: latest,
            sunIntensity: Math.min(1, latest / 35),
            cloudCover: latest < 15 ? 0.7 : latest < 25 ? 0.3 : 0.1,
            isRaining: latest < 12,
            windSpeed: 5 + Math.abs(latest - 20) * 0.5,
          };
          break;
        case 'traffic':
          city.traffic = {
            ...city.traffic,
            vehicleCount: Math.round(latest),
            congestionLevel: Math.min(1, latest / 100),
            pedestrianCount: Math.round(latest * 0.6),
          };
          break;
        case 'water':
          city.water = {
            ...city.water,
            reservoirLevel: Math.min(100, latest),
            pumpActive: latest > 30,
            flowRate: latest * 0.8,
          };
          break;
        case 'power':
          city.power = {
            ...city.power,
            generationMW: latest,
            turbineRPM: latest * 12,
            gridActive: latest > 20,
          };
          break;
        case 'train':
          city.train = {
            ...city.train,
            speed: latest,
            trainPosition: Math.min(1, avg / 80),
            atStation: latest < 5,
            passengerCount: Math.round(latest * 2),
          };
          break;
        case 'park':
          city.park = {
            ...city.park,
            visitorCount: Math.round(latest),
            activityLevel: Math.min(1, latest / 80),
            fountainActive: latest > 30,
          };
          break;
      }

      return { [cityKey]: city };
    });
  },

  triggerDataPulse: (team, district, value) => {
    const pulse: ActiveDataPulse = {
      id: Date.now() + Math.random(),
      team,
      district,
      value,
      timestamp: Date.now(),
    };
    set((s) => ({
      activePulses: [...s.activePulses.filter((p) => Date.now() - p.timestamp < 1500), pulse],
    }));
  },

  syncCityFromCurrentGraph: (team, activeIndex) => {
    const state = get();
    const teamState = state[team];
    const mission = teamState.currentMission;
    if (!mission) return;

    const district = mission.district;
    const isBars = mission.graphType === 'bar' || mission.graphType === 'pie' || mission.graphType === 'pictograph';

    let currentVal = 0;
    let prevVal = 0;
    let delta = 0;
    let trend: 'increasing' | 'constant' | 'decreasing' | 'initial' = 'initial';
    let dataLabel = '';
    let targetIndex = 0;

    if (isBars) {
      const bars = teamState.plottedBars;
      targetIndex = activeIndex !== undefined ? activeIndex : 0;
      const currentBar = bars[targetIndex];
      currentVal = currentBar ? currentBar.height : 0;
      dataLabel = currentBar ? currentBar.label : (mission.xAxis.labels[targetIndex] ?? '');

      if (targetIndex > 0 && bars[targetIndex - 1]) {
        prevVal = bars[targetIndex - 1].height;
        delta = currentVal - prevVal;
        trend = Math.abs(delta) < 0.01 ? 'constant' : delta > 0 ? 'increasing' : 'decreasing';
      } else {
        prevVal = currentVal;
        trend = 'initial';
      }
    } else {
      const pts = [...teamState.plottedPoints].sort((a, b) => a.x - b.x);
      if (pts.length === 0) {
        currentVal = 0;
        prevVal = 0;
        trend = 'initial';
        dataLabel = mission.xAxis.labels[0] ?? '';
      } else if (pts.length === 1) {
        currentVal = pts[0].y;
        prevVal = pts[0].y;
        dataLabel = pts[0].label;
        targetIndex = pts[0].x;
        trend = 'initial';
      } else {
        targetIndex = activeIndex !== undefined ? activeIndex : pts.length - 1;
        const curPt = pts[targetIndex] ?? pts[pts.length - 1];
        currentVal = curPt.y;
        dataLabel = curPt.label;

        const prevPt = targetIndex > 0 ? pts[targetIndex - 1] : pts[0];
        prevVal = prevPt.y;
        delta = currentVal - prevVal;
        trend = Math.abs(delta) < 0.01 ? 'constant' : delta > 0 ? 'increasing' : 'decreasing';
      }
    }

    const cityKey = team === 'blue' ? 'blueCity' : 'redCity';
    const currentCity = { ...state[cityKey] };

    // Update physical district state directly from live graph data!
    switch (district) {
      case 'weather':
        currentCity.weather = {
          ...currentCity.weather,
          temperature: currentVal,
          sunIntensity: Math.min(1.4, Math.max(0.4, currentVal / 32)),
          cloudCover: currentVal < 14 ? 0.7 : currentVal < 24 ? 0.3 : 0.05,
          isRaining: currentVal < 10,
          windSpeed: 4 + Math.max(0, (currentVal - 10) * 0.45),
        };
        break;

      case 'traffic':
        currentCity.traffic = {
          ...currentCity.traffic,
          vehicleCount: Math.round(currentVal),
          congestionLevel: Math.min(1, currentVal / 40),
          pedestrianCount: Math.max(6, Math.round(currentVal * 0.75)),
        };
        break;

      case 'water':
        currentCity.water = {
          ...currentCity.water,
          reservoirLevel: Math.min(100, Math.max(0, currentVal)),
          pumpActive: currentVal > 15,
          flowRate: currentVal * 0.85,
        };
        break;

      case 'power':
        currentCity.power = {
          ...currentCity.power,
          generationMW: currentVal,
          turbineRPM: currentVal * 16,
          gridActive: currentVal > 10,
        };
        break;

      case 'train': {
        const maxDist = Math.max(60, mission.yAxis.max || 250);
        const ptsCount = isBars ? teamState.plottedBars.length : teamState.plottedPoints.length;
        const isStopped = trend === 'constant' || (ptsCount > 1 && Math.abs(delta) < 0.01);
        currentCity.train = {
          ...currentCity.train,
          distanceMeters: currentVal,
          trainPosition: Math.min(1, Math.max(0, currentVal / maxDist)),
          speed: isStopped ? 0 : Math.abs(delta) > 15 ? 40 : 20,
          atStation: currentVal < 5,
          isStopped,
          passengerCount: Math.round(currentVal * 1.5),
        };
        break;
      }

      case 'park':
        currentCity.park = {
          ...currentCity.park,
          visitorCount: Math.round(currentVal),
          activityLevel: Math.min(1, currentVal / 50),
          fountainActive: currentVal > 5,
          fountainHeight: Math.min(2.5, Math.max(0.4, (currentVal / 40) * 2.2)),
        };
        break;
    }

    const telemetry: CityLiveTelemetry = {
      team,
      district,
      value: currentVal,
      prevValue: prevVal,
      delta,
      trend,
      timestamp: Date.now(),
      dataLabel,
      targetIndex,
    };

    const telemetryKey = team === 'blue' ? 'blueTelemetry' : 'redTelemetry';

    // Add subtle data pulse
    const newPulse: ActiveDataPulse = {
      id: Date.now() + Math.random(),
      team,
      district,
      value: currentVal,
      timestamp: Date.now(),
    };

    const updatedPulses = [...state.activePulses.filter((p) => Date.now() - p.timestamp < 1200), newPulse];

    set({
      [cityKey]: currentCity,
      [telemetryKey]: telemetry,
      activePulses: updatedPulses,
    });
  },

  setGamePhase: (phase) => set({ gamePhase: phase }),

  setShowFeedback: (team, show) => set((s) => ({
    [team]: { ...s[team], showFeedback: show },
  })),

  restartGame: () => set({
    gamePhase: 'briefing',
    currentRound: 1,
    roundPhase: 'build',
    timer: 300,
    isTimerRunning: false,
    roundWins: { blue: 0, red: 0 },
    roundWinner: null,
    roundWinnersHistory: [],
    roundBanner: null,
    roundTransitionPending: false,
    blue: createDefaultTeam('blue'),
    red: createDefaultTeam('red'),
    blueCity: { ...defaultCity },
    redCity: { ...defaultCity },
    isRunningGraph: false,
    runningTeam: null,
    graphRunProgress: 0,
  }),
}));
