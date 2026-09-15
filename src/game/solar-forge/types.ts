// ============================================================
// THE SOLAR FORGE: The Great Angle Energy Challenge
// Grade 6 — Angles, Geometric Constructions & Solar Engineering
// Type Definitions
// ============================================================

export type TeamId = 'blue' | 'red';

export type AngleCategory =
  | 'classify_angles'        // Acute, Right, Obtuse, Straight, Reflex
  | 'measure_angles'         // Protractor alignment (0° to 360°)
  | 'missing_angles'         // Straight line (180°), around a point (360°), complementary (90°), supplementary (180°), vertically opposite
  | 'constructions'          // Perpendicular bisector, angle bisector, angle transfer
  | 'sundial_tracking'       // Sun azimuth calculation, shadow vector, multi-mirror bounce to Solar Forge
  | 'solar_forge_ignition';   // Final multi-beam convergence challenge

export type AngleClassification = 'acute' | 'right' | 'obtuse' | 'straight' | 'reflex';

export interface SolarQuestion {
  id: string;
  round: number;
  category: AngleCategory;
  title: string;
  scenario: string;
  prompt: string;
  targetAngle: number;
  toleranceDeg: number;
  angleClassification?: AngleClassification;
  baseAngle?: number;          // For missing angle or construction
  secondaryAngle?: number;     // For complementary/supplementary
  missingAngleType?: 'straight_line' | 'around_point' | 'complementary' | 'supplementary' | 'vertically_opposite';
  options?: {
    id: string;
    label: string;
    value: number | string;
    isCorrect: boolean;
  }[];
  timeOfDay?: string;          // e.g. "09:00 AM", "12:00 PM", "03:00 PM"
  explanation?: string;
  highlightClockAngle?: {
    startHour: number;         // 1 to 12 (or 0 to 12)
    endHour: number;           // 1 to 12
    angleDeg: number;          // e.g. 90, 60, 180, 240
    isReflex?: boolean;
    label?: string;            // e.g. "90° (3 HRS × 30°)"
  };
  physicalTarget: {
    mirrorIndex: number;       // Which mirror in the team's array rotates
    targetAzimuth: number;     // Resulting mirror azimuth
    targetElevation: number;   // Resulting mirror elevation
    receiverId: string;        // Target receiver
    conduitEffect: string;     // What mechanical change happens
  };
}

export interface HeliostatMirrorState {
  id: string;
  position: [number, number, number];
  azimuthDeg: number;          // Horizontal rotation (yaw)
  elevationDeg: number;        // Vertical tilt (pitch)
  targetAzimuthDeg: number;
  targetElevationDeg: number;
  isActive: boolean;
  isLockedOnTarget: boolean;
  reflectionVector: [number, number, number];
}

export interface ReceiverTowerState {
  id: string;
  position: [number, number, number];
  powerLevel: number;          // 0 to 100%
  isActive: boolean;
  isStruckByBeam: boolean;
  temperatureKelvin: number;
}

export interface SunState {
  elevationDeg: number;        // 25° morning to 65° noon to 40° afternoon
  azimuthDeg: number;          // 110° east to 200° south to 250° west
  worldPosition: [number, number, number];
  directionVector: [number, number, number];
  timeString: string;          // "09:30 AM", "12:00 PM", "03:15 PM"
}

export interface SundialState {
  position: [number, number, number];
  shadowAngleDeg: number;      // Current shadow angle from north/noon line
  shadowLength: number;
  gnomonHeight: number;
  interactiveDialAngle: number;
  isCalibrated: boolean;
}

export interface ConstructionWorkspaceState {
  type: 'none' | 'angle_bisector' | 'perpendicular' | 'construct_angle';
  vertex: [number, number];
  rayA: [number, number];
  rayB: [number, number];
  compassRadius: number;
  placedArcs: { center: [number, number]; radius: number; startAngle: number; endAngle: number }[];
  constructedLineAngle: number;
  isCompleted: boolean;
}

export interface TeamFacilityState {
  teamId: TeamId;
  teamName: string;
  energyMegawatts: number;
  activeSubsystems: number;    // 0 to 5
  streakCount: number;
  currentRound: number;
  currentQuestionIndex: number;
  currentQuestion: SolarQuestion | null;
  questions: SolarQuestion[];
  selectedClassification: AngleClassification | null;
  instrumentAngle: number;     // Interactive protractor value
  isProtractorLocked: boolean;
  isRotatingMirror: boolean;
  lastFeedback: 'idle' | 'rotating' | 'beam_aligned' | 'power_up' | 'off_target';
  feedbackMessage: string;
  constructionState: ConstructionWorkspaceState;
  mirrors: HeliostatMirrorState[];
  receiver: ReceiverTowerState;
}

export interface CentralSolarForgeState {
  powerLevel: number;          // 0 to 100%
  turbineRPM: number;
  moltenCoreTemperature: number; // Celsius
  ringRotationSpeed: number;
  isBlueBeamConnected: boolean;
  isRedBeamConnected: boolean;
  isFullyOperational: boolean;
}

export type SolarForgePhase = 'briefing' | 'forging' | 'cinematic_activation' | 'victory';
