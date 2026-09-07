// ============================================================
// THE GREAT CARNIVAL OF CHANCE — Core Types
// Grade 6 Mathematics: Probability & Chance
//
// Dual-Team Classroom Touchscreen Architecture:
// - TEAM BLUE: Left Console
// - TEAM RED: Right Console
// - SHARED 3D CARNIVAL ISLAND in Center
// ============================================================

export type AttractionId =
  | 'central-plaza'
  | 'odds-wheel'
  | 'mystery-chests'
  | 'giant-ball-drop'
  | 'chance-lab'
  | 'carnival-workshop'
  | 'grand-carnival';

export type BloomLevel =
  | 'remember'
  | 'understand'
  | 'apply'
  | 'analyze'
  | 'evaluate'
  | 'create';

export type TeamId = 'blue' | 'red';

export type CameraViewMode = 'island-overview' | 'attraction-focus' | 'machine-run' | 'grand-celebration';

export type MachineAnimationState =
  | 'idle'
  | 'mixing'
  | 'spinning'
  | 'dropping'
  | 'opening'
  | 'batch-simulating'
  | 'settled';

export interface AttractionInfo {
  id: AttractionId;
  name: string;
  subtitle: string;
  description: string;
  position: [number, number, number];
  cameraTarget: [number, number, number];
  cameraPosition: [number, number, number];
  color: string;
  unlocked: boolean;
  completed: boolean;
  totalChallenges: number;
  completedChallenges: number;
}

export interface OptionChoice {
  id: string;
  value: string | number;
  label: string;
  fractionDisplay?: string; // e.g. "2/5"
  percentageDisplay?: string; // e.g. "40%"
}

export interface ProbabilityData {
  totalOutcomes: number;
  favorableOutcomes: number;
  items: { label: string; color: string; count: number }[];
  theoreticalProbabilityFraction: string; // e.g. "2/5"
  theoreticalProbabilityDecimal: number; // e.g. 0.4
}

export interface ProbabilityChallenge {
  id: string;
  attractionId: AttractionId;
  bloomLevel: BloomLevel;
  difficulty: 'foundation' | 'core' | 'challenge' | 'mastery';
  points: number;
  missionTitle: string;
  prompt: string;
  scenarioText?: string;
  probabilityData: ProbabilityData;
  options: OptionChoice[];
  correctAnswer: string | number;
  hints: string[];
  explanation: string;
  reflectionQuestion?: string;
  machineAction: 'spin-wheel' | 'drop-ball' | 'open-chest' | 'run-lab' | 'test-slots' | 'grand-spectacle';
}

export interface TeamScoreState {
  id: TeamId;
  name: string;
  score: number;
  selectedAnswer: string | number | null;
  isLocked: boolean;
  lastResult: 'correct' | 'wrong' | null;
  lastFeedback: string | null;
  correctCount: number;
  streak: number;
}

export interface TrialSimulationResult {
  totalTrials: number;
  tally: Record<string, number>;
  history: string[]; // sequence of outcome labels
  lastOutcome: string;
}

export type CarnivalGamePhase =
  | 'title'
  | 'island-explore'
  | 'attraction-intro'
  | 'predicting'
  | 'machine-running'
  | 'observation-reasoning'
  | 'experiment-trials'
  | 'attraction-summary'
  | 'grand-celebration';
