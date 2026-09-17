// ============================================================
// PARK PLANNER — THE FOUR-QUADRANT CITY PARK
// Grade 6 Mathematics: Position & Transformation on Cartesian Coordinate Plane
// Type Definitions & Interfaces
// ============================================================

export type TeamId = 'blue' | 'red';

export type QuadrantId = 'QI' | 'QII' | 'QIII' | 'QIV' | 'axis_x' | 'axis_y' | 'origin';

export interface Coordinate2D {
  x: number; // -5 to +5 on grid
  y: number; // -5 to +5 on grid
}

export type ParkObjectType =
  // Quadrant I: Active Playground
  | 'swings'
  | 'slide'
  | 'climbing_frame'
  | 'seesaw'
  | 'spring_rider'
  | 'sandbox'
  // Quadrant II: Nature & Botanical Gardens
  | 'fountain'
  | 'flower_bed'
  | 'pond'
  | 'gazebo'
  | 'rose_garden'
  | 'topiary'
  // Quadrant III: Sports Complex
  | 'basketball_court'
  | 'soccer_goal'
  | 'fitness_station'
  | 'table_tennis'
  // Quadrant IV: Picnic Grove & Relaxation
  | 'picnic_table'
  | 'park_bench'
  | 'tree_grove'
  | 'lawn_umbrella'
  // Infrastructure & Paths
  | 'lamp_post'
  | 'trash_bin'
  | 'bicycle_rack'
  | 'info_board'
  | 'walking_path'
  | 'sculpture';

export type TransformationType =
  | 'plot_point'
  | 'translate'
  | 'reflect_x'
  | 'reflect_y'
  | 'reflect_origin'
  | 'rotate_90_cw'
  | 'rotate_90_ccw'
  | 'rotate_180'
  | 'polygon_boundary'
  | 'path_design';

export interface InstalledParkObject {
  id: string;
  type: ParkObjectType;
  teamId: TeamId;
  name: string;
  position: Coordinate2D; // Cartesian coordinate (-5 to +5)
  previousPosition?: Coordinate2D;
  polygonPoints?: Coordinate2D[];
  rotationAngle?: number; // radians (0, PI/2, PI, 3PI/2)
  scale?: number;
  stagePlaced: number;
  isConstructing?: boolean;
  constructionProgress?: number; // 0 to 1
  isTransforming?: boolean;
  transformProgress?: number; // 0 to 1
  transformType?: TransformationType;
  isActive?: boolean;
}

export interface ParkQuestion {
  id: string;
  category: TransformationType;
  roundNumber: number; // 1 to 5
  scenario: string;
  prompt: string;
  objectType: ParkObjectType;
  objectName: string;
  targetQuadrant?: QuadrantId;
  startPoint?: Coordinate2D;
  startPoints?: Coordinate2D[];
  targetPoint?: Coordinate2D;
  targetPoints?: Coordinate2D[];
  translationDelta?: { dx: number; dy: number; directionLabel: string };
  reflectionAxis?: 'x-axis' | 'y-axis' | 'origin';
  rotationParams?: { degrees: 90 | 180 | 270; direction: 'clockwise' | 'counterclockwise'; center: Coordinate2D };
  correctAnswer: Coordinate2D | string | number | Coordinate2D[];
  options: (string | Coordinate2D)[];
  stepExplanation: string[];
  mode: 'point_plot' | 'translate' | 'reflect' | 'rotate' | 'polygon' | 'path' | 'identify';
  physicalOutcome: {
    objectType: ParkObjectType;
    description: string;
    happinessGain: number;
    quadrantEffect: QuadrantId;
  };
}

export interface WorkerSimState {
  task: 'idle' | 'walking' | 'constructing' | 'hammering' | 'assembling' | 'cheering';
  progress: number;
  position: [number, number, number]; // 3D world position
  targetPosition: [number, number, number];
  rotationY: number;
  carriedObject: ParkObjectType | null;
}

export interface VehicleSimState {
  task: 'idle' | 'delivering' | 'unloading' | 'returning';
  progress: number;
  position: [number, number, number];
  targetPosition: [number, number, number];
  rotationY: number;
  cargoType: ParkObjectType | null;
}

export interface CitizenNPCState {
  id: string;
  type: 'child' | 'jogger' | 'parent' | 'elder' | 'cyclist';
  activity: 'idle' | 'walking' | 'swinging' | 'sliding' | 'sitting' | 'jogging' | 'cycling' | 'playing_ball';
  position: [number, number, number];
  rotationY: number;
  animTimer: number;
  targetWaypoint: [number, number, number];
  pathIndex: number;
}

export interface TeamParkState {
  teamId: TeamId;
  teamName: string;
  currentRound: number; // 1 to matchQuestionCount
  isMatchComplete: boolean;
  currentQuestion: ParkQuestion | null;
  selectedPoint: Coordinate2D | null;
  selectedPoints: Coordinate2D[];
  selectedAnswer: string | Coordinate2D | null;
  hasAnsweredCurrent: boolean;
  isCurrentCorrect: boolean | null;
  feedbackMessage: string | null;
  installedObjects: InstalledParkObject[];
  citizenHappiness: number; // 0 to 100%
  parkRating: number; // 0 to 5 stars
  totalPointsPlaced: number;
  transformationsCompleted: number;
  accuracy: number;
  totalAnswered: number;
  correctAnswersCount: number;
}

export type SimEventType =
  | 'worker_dispatch'
  | 'construction_start'
  | 'object_placed'
  | 'transform_animate'
  | 'fountain_start'
  | 'swings_activate'
  | 'citizen_enter'
  | 'celebration';

export interface SimEvent {
  type: SimEventType;
  teamId: TeamId;
  payload?: any;
}
