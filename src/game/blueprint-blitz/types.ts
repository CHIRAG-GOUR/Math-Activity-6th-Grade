// ============================================================
// BLUEPRINT BLITZ — Core Types & Data Contracts
// Grade 6 Mathematics: Shapes, Area & Volume 3D Construction Game
// ============================================================

export type TeamId = 'blue' | 'red';

export type ChallengeCategory = 'shape' | 'area' | 'volume' | 'mixed';

export type BloomLevel =
  | 'remember'
  | 'understand'
  | 'apply'
  | 'analyze'
  | 'evaluate'
  | 'create';

export type MechanicType =
  | 'floor'         // Physical tile grid L x W for area
  | 'cubes'         // 3D physical unit cubes stacked in L x W x H for volume
  | 'crane'         // Tower crane moving and placing blocks
  | 'modify'        // Add/remove tiles/cubes to match target delta
  | 'blueprint'     // Multi-constraint architectural blueprint
  | 'target-build'  // Open-ended target range with multiple valid solutions
  | 'shape'         // 2D/3D shape properties, vertices, and sides
  | 'mega-build';   // Final championship grand round

export interface BlueprintChallenge {
  id: string;
  code: string;
  title: string;
  category: ChallengeCategory;
  bloomLevel: BloomLevel;
  difficulty: 1 | 2 | 3 | 4 | 5;
  mechanic: MechanicType;
  prompt: string;
  missionBrief: string;
  
  // Starting construction state for both teams
  initialBuild: {
    length: number;
    width: number;
    height: number;
    blocks?: number;
    shapeType?: string;
  };

  // Target mathematical constraints (Any valid mathematical permutation is accepted)
  target: {
    length?: number;
    width?: number;
    height?: number;
    area?: number;
    volume?: number;
    minArea?: number;
    maxArea?: number;
    minVolume?: number;
    maxVolume?: number;
    shapeSides?: number;
    shapeVertices?: number;
    shapeType?: string;
    description: string;
  };

  allowedSolutionsDescription: string;
  timeLimit: number; // in seconds
  basePoints: number;
  explanationFormula: string;
  learningTip: string;
}

export interface TeamBuild {
  length: number;
  width: number;
  height: number;
  blocks: number;
  shapeType: string;
  selectedTool: 'tile' | 'cube' | 'crane' | 'demolish';
  cranePosition: [number, number, number];
  craneAngle: number;
  craneHeight: number;
  craneHolding: boolean;
  placedPiecesCount: number;
  isConfirmed: boolean;
  isLocked: boolean;
}

export interface ScoreBreakdown {
  base: number;
  speed: number;
  precision: number;
  efficiency: number;
  total: number;
}

export interface ScanResult {
  teamId: TeamId;
  measuredLength: number;
  measuredWidth: number;
  measuredHeight: number;
  measuredArea: number;
  measuredVolume: number;
  targetDescription: string;
  isCorrect: boolean;
  statusMessage: string;
  diffMessage: string;
  formula: string;
  scoreBreakdown: ScoreBreakdown;
  timestamp: number;
}

export interface TeamGameState {
  id: TeamId;
  name: string;
  score: number;
  roundScore: number;
  completedChallengesCount: number;
  attemptsLeft: number;
  attemptCount: number;
  build: TeamBuild;
  scanResult: ScanResult | null;
  hasSecondChance: boolean;
}

export type GamePhase =
  | 'intro'           // Cinematic reveal of Construction District
  | 'briefing'        // Blueprint mission announcement & target specs
  | 'building'        // Live simultaneous construction with shared timer
  | 'scanning'        // 3D measurement scanner sweeping over structures
  | 'round-result'    // Mathematical diagnostic breakdown & score animation
  | 'mega-build'      // Final championship mega round
  | 'game-over';      // Winner podium celebration & stats

export interface GameSettings {
  roundDuration: number;
  isMuted: boolean;
  soundVolume: number;
  maxRounds: number;
}
