// ============================================================
// THE SOLAR FORGE: Comprehensive 165+ Question Bank & Generator
// Grade 6 Curriculum: Angles, Clock & Sundial Geometry, Protractor
// Measurements, Missing Angles, Geometric Constructions & Solar Tracking
// ============================================================

import { SolarQuestion, AngleClassification } from '../types';

export function classifyAngleFromDegrees(deg: number): AngleClassification {
  if (deg > 0 && deg < 90) return 'acute';
  if (deg === 90) return 'right';
  if (deg > 90 && deg < 180) return 'obtuse';
  if (deg === 180) return 'straight';
  return 'reflex';
}

export function makeTactileClassificationOptions(correctType: AngleClassification) {
  const allTypes: { id: AngleClassification; label: string; range: string }[] = [
    { id: 'acute', label: 'ACUTE', range: '< 90°' },
    { id: 'right', label: 'RIGHT', range: '= 90°' },
    { id: 'obtuse', label: 'OBTUSE', range: '90°–180°' },
    { id: 'straight', label: 'STRAIGHT', range: '= 180°' },
    { id: 'reflex', label: 'REFLEX ANGLE', range: '> 180°' },
  ];

  return allTypes.map((t) => ({
    id: t.id,
    label: t.label,
    value: t.id,
    isCorrect: t.id === correctType,
  }));
}

// ────────────────────────────────────────────────────────────
// ROUND 1: ANGLE CLASSIFICATION & CLOCK/SUNDIAL GEOMETRY (36 SPECS)
// Time: 09:00 AM (Morning)
// ────────────────────────────────────────────────────────────
interface R1Spec {
  angle: number;
  mission: string;
  context: string;
  prompt: string;
  clockAngle?: { startHour: number; endHour: number; angleDeg: number; isReflex?: boolean; label?: string };
}

const R1_SPECS: R1Spec[] = [
  // ── Sundial / Clock Geometry (30° per hour) ──
  {
    angle: 90,
    mission: 'Sundial Right-Angle Calibration',
    context: 'Track the movement of the morning Sun across the facility.',
    prompt: 'The sundial shows 12:00 PM. Three hours later at 3:00 PM, what angle is formed between the 12 and 3 positions (3 × 30°)?',
    clockAngle: { startHour: 12, endHour: 3, angleDeg: 90, label: '90° · 3 HRS (30°/HR)' },
  },
  {
    angle: 60,
    mission: 'Two-Hour Solar Progression',
    context: 'The primary array tracks the Sun from noon to 2:00 PM.',
    prompt: 'The sundial indicates 12:00 PM. Two hours later at 2:00 PM, what type of angle is formed between 12 and 2 (2 × 30° = 60°)?',
    clockAngle: { startHour: 12, endHour: 2, angleDeg: 60, label: '60° · 2 HRS (30°/HR)' },
  },
  {
    angle: 90,
    mission: 'Morning-to-Noon Transit',
    context: 'Observe the shadow shift from morning to midday solar noon.',
    prompt: 'The sundial shows 9:00 AM. Three hours later, it indicates 12:00 PM. What type of angle is formed between the 9 and 12 positions?',
    clockAngle: { startHour: 9, endHour: 12, angleDeg: 90, label: '90° · 3 HRS (30°/HR)' },
  },
  {
    angle: 180,
    mission: 'Diameter Solar Baseline',
    context: 'The solar station tracks daylight from noon to late afternoon.',
    prompt: 'The sundial measures time from 12:00 PM to 6:00 PM (6 hours later). What type of angle is formed between the 12 and 6 positions (6 × 30° = 180°)?',
    clockAngle: { startHour: 12, endHour: 6, angleDeg: 180, label: '180° · STRAIGHT LINE' },
  },
  {
    angle: 30,
    mission: 'One-Hour Unit Solar Step',
    context: 'Each single hour mark on a 12-hour clock face represents 360° ÷ 12 = 30°.',
    prompt: 'Between 12:00 PM and 1:00 PM, the shadow moves by exactly 30°. What type of angle is 30°?',
    clockAngle: { startHour: 12, endHour: 1, angleDeg: 30, label: '30° · 1 HR (ACUTE)' },
  },
  {
    angle: 120,
    mission: 'Four-Hour Transit Arc',
    context: 'The heliostat mirrors track the Sun over a 4-hour window from 12:00 PM to 4:00 PM.',
    prompt: 'Across 4 hours (4 × 30° = 120°), what type of angle do the 12 and 4 positions form on the dial?',
    clockAngle: { startHour: 12, endHour: 4, angleDeg: 120, label: '120° · 4 HRS (OBTUSE)' },
  },
  {
    angle: 150,
    mission: 'Five-Hour Afternoon Span',
    context: 'The sensor monitors continuous sunlight from 12:00 PM to 5:00 PM.',
    prompt: 'The arc between the 12 and 5 marks measures 5 × 30° = 150°. What type of angle is this?',
    clockAngle: { startHour: 12, endHour: 5, angleDeg: 150, label: '150° · 5 HRS (OBTUSE)' },
  },
  {
    angle: 90,
    mission: 'Afternoon Quadrant (3 PM to 6 PM)',
    context: 'The secondary reflector operates during the late afternoon transit.',
    prompt: 'Between 3:00 PM and 6:00 PM, 3 hours pass (3 × 30° = 90°). What type of angle is formed between 3 and 6?',
    clockAngle: { startHour: 3, endHour: 6, angleDeg: 90, label: '90° · RIGHT ANGLE' },
  },
  {
    angle: 180,
    mission: 'East-West Horizon Transit',
    context: 'The sun path from morning 9:00 AM to afternoon 3:00 PM spans across opposite horizon stations.',
    prompt: 'Between 9:00 AM and 3:00 PM (6 hours × 30° = 180°), what type of angle is formed?',
    clockAngle: { startHour: 9, endHour: 3, angleDeg: 180, label: '180° · STRAIGHT ANGLE' },
  },
  {
    angle: 60,
    mission: 'Late Morning Shift (10 AM to 12 PM)',
    context: 'The telemetry tracker aligns with the climbing sun.',
    prompt: 'From 10:00 AM to 12:00 PM, the Sun shifts through 2 hours (2 × 30° = 60°). Classify this 60° angle:',
    clockAngle: { startHour: 10, endHour: 12, angleDeg: 60, label: '60° · ACUTE ANGLE' },
  },
  {
    angle: 120,
    mission: 'Four-Hour Shift (3 PM to 7 PM)',
    context: 'Tracking late afternoon rays as shadows lengthen.',
    prompt: 'The sundial records a 4-hour change from 3:00 PM to 7:00 PM (4 × 30° = 120°). What type of angle is this?',
    clockAngle: { startHour: 3, endHour: 7, angleDeg: 120, label: '120° · OBTUSE ANGLE' },
  },
  {
    angle: 180,
    mission: 'Opposite Hour Stations (5 to 11)',
    context: 'Opposite positions on a 12-hour face form a straight diameter.',
    prompt: 'The angle between 5:00 and 11:00 positions spans 6 hours (6 × 30° = 180°). What type of angle is this?',
    clockAngle: { startHour: 5, endHour: 11, angleDeg: 180, label: '180° · STRAIGHT ANGLE' },
  },
  {
    angle: 240,
    mission: 'Reflex Circumferential Sweep',
    context: 'The perimeter sensor sweeps clockwise from 2:00 PM past 6:00 PM to 10:00 AM.',
    prompt: 'Tracking 8 hours clockwise produces an angle greater than 180° (8 × 30° = 240°). What type of angle is this?',
    clockAngle: { startHour: 2, endHour: 10, angleDeg: 240, isReflex: true, label: '240° · REFLEX ANGLE' },
  },
  {
    angle: 270,
    mission: 'Three-Quarter Turn Reflex',
    context: 'The rotary collector turns three-quarters of a complete 360° circle (9 hours × 30°).',
    prompt: 'The rotation angle measures 270° (360° - 90°). Classify this angle:',
    clockAngle: { startHour: 12, endHour: 9, angleDeg: 270, isReflex: true, label: '270° · REFLEX ANGLE' },
  },
  {
    angle: 210,
    mission: 'Seven-Hour Outer Sweep',
    context: 'A solar monitoring sweep measures from 12:00 PM clockwise to 7:00 PM.',
    prompt: 'Clockwise rotation across 7 hours yields 7 × 30° = 210°. What type of angle is this?',
    clockAngle: { startHour: 12, endHour: 7, angleDeg: 210, isReflex: true, label: '210° · REFLEX ANGLE' },
  },
  {
    angle: 300,
    mission: 'Ten-Hour Wide Panorama',
    context: 'The tracking sensor completes a 10-hour arc from 12:00 PM clockwise to 10:00 AM.',
    prompt: 'The angular sweep measures 10 × 30° = 300°. Classify this angle:',
    clockAngle: { startHour: 12, endHour: 10, angleDeg: 300, isReflex: true, label: '300° · REFLEX ANGLE' },
  },

  // ── Heliostat Engineering Angle Scenarios ──
  {
    angle: 125,
    mission: 'Heliostat Arm Deployment',
    context: 'Calibrate the primary mirror joint for optimal summer reflection.',
    prompt: 'The telemetry instrument registers an opening angle of 125°. What type of angle is this?',
  },
  {
    angle: 35,
    mission: 'Elevation Pivot Alignment',
    context: 'Calibrate the primary heliostat elevation hinge.',
    prompt: 'The optical sensor registers a tilt angle of 35°. What type of angle is this?',
  },
  {
    angle: 90,
    mission: 'Solar Tower Perpendicular Support',
    context: 'Align the vertical load-bearing frame of the energy receiver tower.',
    prompt: 'The vertical structural strut meets the foundation at exactly 90°. What type of angle is this?',
  },
  {
    angle: 150,
    mission: 'Thermal Intake Wing Aperture',
    context: 'Deploy the thermal collector intake wing to capture maximum sunlight.',
    prompt: 'The telemetry console registers an aperture angle of 150°. What type of angle is this?',
  },
  {
    angle: 42,
    mission: 'Gnomon Inclination Angle',
    context: 'Verify the tilt of the golden sundial gnomon relative to the marble plinth.',
    prompt: 'The precision angle gauge measures the gnomon inclination at 42°. What type of angle is this?',
  },
  {
    angle: 215,
    mission: 'Turntable Rotary Sweep',
    context: 'Rotate the sub-collector turntable to receive reflected beams from the west flank.',
    prompt: 'The turntable rotates through an opening angle of 215°. What type of angle is this?',
  },
  {
    angle: 180,
    mission: 'Linear Optical Conduit',
    context: 'Align the ground conduit pipeline connecting both team arrays.',
    prompt: 'The laser guidance system measures a flat, continuous angle of 180°. What type of angle is this?',
  },
  {
    angle: 68,
    mission: 'Beam Concentrator Funnel',
    context: 'Focus dispersed sunbeams into the high-density optical core.',
    prompt: 'The concentrator funnel narrows to an interior angle of 68°. What type of angle is this?',
  },
  {
    angle: 110,
    mission: 'South Reflector Orientation',
    context: 'Orient the secondary mirror pivot towards the central receiver array.',
    prompt: 'The servo arm reads an orientation angle of 110°. What type of angle is this?',
  },
  {
    angle: 25,
    mission: 'Early Morning Collector Pitch',
    context: 'Morning sun is low in the east; tilt collector pitch to capture low beams.',
    prompt: 'The morning pitch angle measures 25°. What type of angle is this?',
  },
  {
    angle: 165,
    mission: 'Emergency Heat Dissipation Flap',
    context: 'Open the thermal release louvers to cool the central exchanger.',
    prompt: 'The safety dissipation flap opens wide to 165°. What type of angle is this?',
  },
  {
    angle: 290,
    mission: 'Panoramic Sensor Sweep',
    context: 'Radar sweep monitors atmospheric cloud formations around the facility.',
    prompt: 'The sweep angle from north clockwise measures 290°. What type of angle is this?',
  },
  {
    angle: 55,
    mission: 'Turbine Cooling Fin Aperture',
    context: 'Calibrate cooling fins on the molten salt generator.',
    prompt: 'The cooling fin aperture is angled at 55°. What type of angle is this?',
  },
  {
    angle: 138,
    mission: 'Secondary Reflector Hinge',
    context: 'Align the secondary mirror bracket toward the central tower.',
    prompt: 'The hinge telemetry displays an angle of 138°. What type of angle is this?',
  },
  {
    angle: 76,
    mission: 'Solar Panel Array Bracket',
    context: 'Adjust photovoltaic panel mount for maximum direct irradiance.',
    prompt: 'The bracket elevation angle is set to 76°. What type of angle is this?',
  },
  {
    angle: 315,
    mission: 'Maintenance Crane Rotation',
    context: 'The facility crane swings to service the western receiver tower.',
    prompt: 'The crane rotates through an angle of 315°. What type of angle is this?',
  },
  {
    angle: 15,
    mission: 'Collimator Fine-Trim Adjustment',
    context: 'Fine-tune laser collimator lens for razor-sharp beam coherence.',
    prompt: 'The collimator deflection angle is trimmed to 15°. What type of angle is this?',
  },
  {
    angle: 105,
    mission: 'Afternoon Sun Tracker Bracket',
    context: 'Heliostat bracket tilts westward to follow descending sunlight.',
    prompt: 'The tracker bracket reads an angle of 105°. What type of angle is this?',
  },
  {
    angle: 48,
    mission: 'East Heliostat Elevation',
    context: 'East flank mirror rises to intercept ascending morning sunbeams.',
    prompt: 'The elevation angle sensor outputs 48°. What type of angle is this?',
  },
  {
    angle: 245,
    mission: 'Deep Reflex Turntable Pivot',
    context: 'Repositioning the mobile receiver cart along the perimeter curved rail.',
    prompt: 'The curved rail arc measures 245°. What type of angle is this?',
  },
];

// ────────────────────────────────────────────────────────────
// ROUND 2: PROTRACTOR MEASUREMENT & SUNDIAL TRACKING (35 SPECS)
// Time: 10:30 AM (Mid-Morning)
// ────────────────────────────────────────────────────────────
interface R2Spec {
  target: number;
  mirror: number;
  mission: string;
  context: string;
  prompt: string;
  clockAngle?: { startHour: number; endHour: number; angleDeg: number; isReflex?: boolean; label?: string };
}

const R2_SPECS: R2Spec[] = [
  // ── Clock & Sundial Tracking Angles ──
  {
    target: 90,
    mirror: 0,
    mission: 'Sundial 3-Hour Tracker Sync',
    context: 'The Sun has advanced 3 hours across the summer sky (12:00 PM to 3:00 PM).',
    prompt: 'Since each hour represents 30° (3 × 30° = 90°), calibrate the protractor needle to exactly 90° to synchronize Mirror Alpha.',
    clockAngle: { startHour: 12, endHour: 3, angleDeg: 90, label: '90° · 3 HRS (30°/HR)' },
  },
  {
    target: 60,
    mirror: 1,
    mission: 'Sundial 2-Hour Offset Tracking',
    context: 'The Sun has progressed 2 hours (12:00 PM to 2:00 PM).',
    prompt: 'Each hour mark represents 30°. Calibrate the tracking protractor to 2 × 30° = 60° to aim Mirror Beta.',
    clockAngle: { startHour: 12, endHour: 2, angleDeg: 60, label: '60° · 2 HRS (30°/HR)' },
  },
  {
    target: 30,
    mirror: 0,
    mission: 'One-Hour Solar Increment',
    context: 'The Sun shifts 30° every hour across the 12-hour dial face.',
    prompt: 'Align the protractor needle to exactly 30° to match the 1-hour solar increment from 12:00 PM to 1:00 PM.',
    clockAngle: { startHour: 12, endHour: 1, angleDeg: 30, label: '30° · 1 HOUR UNIT' },
  },
  {
    target: 120,
    mirror: 2,
    mission: 'Four-Hour Transit Calibration',
    context: 'Compensate for 4 hours of daylight movement (12:00 PM to 4:00 PM).',
    prompt: 'Four hours of solar movement equal 4 × 30° = 120°. Set the protractor instrument to exactly 120°.',
    clockAngle: { startHour: 12, endHour: 4, angleDeg: 120, label: '120° · 4 HRS (30°/HR)' },
  },
  {
    target: 150,
    mirror: 2,
    mission: 'Five-Hour Solar Trajectory',
    context: 'Tracking sunlight from 12:00 PM to 5:00 PM across the afternoon sky.',
    prompt: 'Five hours on the sundial equal 5 × 30° = 150°. Calibrate the protractor needle to 150°.',
    clockAngle: { startHour: 12, endHour: 5, angleDeg: 150, label: '150° · 5 HRS (30°/HR)' },
  },
  {
    target: 180,
    mirror: 0,
    mission: 'Full Semi-Circle Solar Arc',
    context: 'From morning 6:00 AM to solar noon 12:00 PM represents 6 hours.',
    prompt: 'Six hours of movement form a straight line (6 × 30° = 180°). Calibrate the tracker to 180°.',
    clockAngle: { startHour: 6, endHour: 12, angleDeg: 180, label: '180° · 6 HRS (HALF TURN)' },
  },
  {
    target: 75,
    mirror: 1,
    mission: 'Two-and-a-Half Hour Transit',
    context: 'Solar transit over 2.5 hours: 2.5 × 30° = 75°.',
    prompt: 'Use the interactive protractor to swing collector arm Beta to exactly 75°.',
  },
  {
    target: 45,
    mirror: 0,
    mission: 'Hour-and-a-Half Solar Arc',
    context: 'Between 12:00 PM and 1:30 PM (1.5 hours × 30° = 45°).',
    prompt: 'Align the protractor needle to precisely 45° to track the mid-transit beam.',
    clockAngle: { startHour: 12, endHour: 1, angleDeg: 45, label: '45° · 1.5 HOURS' },
  },
  {
    target: 105,
    mirror: 2,
    mission: 'Three-and-a-Half Hour Tracking',
    context: 'Track 3.5 hours of afternoon sun movement (3.5 × 30° = 105°).',
    prompt: 'Rotate the protractor control to lock Mirror Gamma at 105°.',
  },
  {
    target: 135,
    mirror: 2,
    mission: 'Four-and-a-Half Hour Advance',
    context: 'Four and a half hours across the sky equal 4.5 × 30° = 135°.',
    prompt: 'Calibrate the protractor instrument to an obtuse angle of 135°.',
  },

  // ── Precision Heliostat Mirror Protractor Targets ──
  { target: 40, mirror: 0, mission: 'Mirror Alpha Low-Angle Trim', context: 'Trim elevation for ascending morning rays.', prompt: 'Align the precision protractor instrument to 40° bearing.' },
  { target: 50, mirror: 1, mission: 'Thermal Conduit Convergence', context: 'Bridge secondary heliostat beam into tower intake.', prompt: 'Set the interactive protractor control to exactly 50°.' },
  { target: 65, mirror: 1, mission: 'Collector Arm Alignment', context: 'Calibrate tracking mount Beta to optimum incidence.', prompt: 'Adjust the protractor indicator needle to 65°.' },
  { target: 80, mirror: 0, mission: 'Concentrator Unit Alpha Pitch', context: 'Elevate concentrator unit Alpha toward focal point.', prompt: 'Position the protractor needle at 80°.' },
  { target: 85, mirror: 1, mission: 'High-Yield Reflector Trim', context: 'Fine-tune reflector Beta near perpendicular alignment.', prompt: 'Calibrate the protractor dial to exactly 85°.' },
  { target: 95, mirror: 2, mission: 'Central Relay Alignment', context: 'Aim reflector Gamma past the 90° normal line.', prompt: 'Rotate the protractor control to an angle of 95°.' },
  { target: 100, mirror: 2, mission: 'Mid-Field Reflector Pivot', context: 'Direct solar energy into secondary heat exchangers.', prompt: 'Set the precision protractor instrument to 100°.' },
  { target: 110, mirror: 2, mission: 'Wide Field Collector Relay', context: 'Rotate mid-field reflector Gamma toward central tower.', prompt: 'Adjust the protractor control until the indicator reads 110°.' },
  { target: 115, mirror: 2, mission: 'Tower Reflection Arm Trim', context: 'Angle secondary reflection arm to clear array shadow.', prompt: 'Align the protractor needle to exactly 115°.' },
  { target: 125, mirror: 2, mission: 'Perimeter Collector Wing', context: 'Deploy perimeter reflector wing to capture afternoon light.', prompt: 'Rotate the protractor control to lock at 125°.' },
  { target: 130, mirror: 2, mission: 'West Flank Mirror Deployment', context: 'Expand west collector array toward setting sun direction.', prompt: 'Set the protractor needle to exactly 130°.' },
  { target: 140, mirror: 2, mission: 'Deep Reflection Corridor', context: 'Route light beam through the facility central avenue.', prompt: 'Calibrate the protractor needle to an angle of 140°.' },
  { target: 145, mirror: 2, mission: 'Storage Pre-Heater Position', context: 'Focus peripheral beams into molten salt storage.', prompt: 'Align the protractor instrument to 145°.' },
  { target: 160, mirror: 2, mission: 'Wide Deflection Calibration', context: 'Maximum aperture deflection for cross-array transfer.', prompt: 'Set the protractor dial to 160°.' },
  { target: 170, mirror: 2, mission: 'Near-Straight Conduit Align', context: 'Almost straight line (180°) transfer along ground duct.', prompt: 'Adjust the protractor needle to 170°.' },
  { target: 20, mirror: 0, mission: 'Grazing Incidence Setup', context: 'Low morning grazing reflection across horizontal mirrors.', prompt: 'Position the protractor needle to 20°.' },
  { target: 25, mirror: 0, mission: 'Fine Collimator Bearing', context: 'Initial beam calibration from low sun altitude.', prompt: 'Calibrate the protractor control to 25°.' },
  { target: 35, mirror: 0, mission: 'Primary Heliostat Tilt', context: 'Morning sun altitude capture on Mirror Alpha.', prompt: 'Set the precision protractor instrument to 35°.' },
  { target: 55, mirror: 0, mission: 'Elevation Pitch Calibration', context: 'Mid-morning solar ascent compensation.', prompt: 'Align the protractor needle to exactly 55°.' },
  { target: 70, mirror: 1, mission: 'Beam Guiding Servo Calibration', context: 'Sync twin heliostats on receiver tower focal node.', prompt: 'Adjust the protractor control to 70°.' },
  { target: 90, mirror: 0, mission: 'True Perpendicular Lock', context: 'Establish 90° right-angle baseline to receiver tower.', prompt: 'Set the protractor needle to exactly 90°.' },
  { target: 15, mirror: 0, mission: 'Micro-Angle Horizon Skim', context: 'Fine-tune minimal elevation above the desert horizon.', prompt: 'Trim the protractor needle to exactly 15°.' },
  { target: 165, mirror: 2, mission: 'Wide Flank Solar Funnel', context: 'Deflect perimeter beam into central intake chute.', prompt: 'Set the protractor instrument to 165°.' },
  { target: 175, mirror: 2, mission: 'Flat Pipeline Alignment', context: 'Final straight-line verification across the facility base.', prompt: 'Calibrate the protractor needle to 175°.' },
  { target: 60, mirror: 1, mission: 'Twin Heliostat Synchronization', context: 'Lock dual reflector array at 60° equilateral bearing.', prompt: 'Align the protractor instrument to 60°.' },
];

// ────────────────────────────────────────────────────────────
// ROUND 3: MISSING ANGLES & GEOMETRIC THEOREMS (35 SPECS)
// Time: 12:00 PM (Solar Noon)
// ────────────────────────────────────────────────────────────
interface R3Spec {
  base: number;
  type: 'straight_line' | 'around_point' | 'complementary' | 'supplementary' | 'vertically_opposite';
  target: number;
  mission: string;
  context: string;
  prompt: string;
  clockAngle?: { startHour: number; endHour: number; angleDeg: number; isReflex?: boolean; label?: string };
}

const R3_SPECS: R3Spec[] = [
  // ── Straight Line Angles (Sum to 180°) ──
  {
    base: 65,
    type: 'straight_line',
    target: 115,
    mission: 'Straight Line Beam Split (180°)',
    context: 'Two reflection beams meet along a flat 180° mirror track.',
    prompt: 'Beam A is measured at 65°. Using the rule that angles on a straight line sum to 180°, find missing angle x for Beam B (180° - 65°).',
  },
  {
    base: 120,
    type: 'straight_line',
    target: 60,
    mission: 'Sundial Straight-Line Diameter (180°)',
    context: 'The sundial noon-to-6 baseline forms a straight line of 180°.',
    prompt: 'A 4-hour transit (12 to 4) covers 120°. What angle remains on the straight line to reach the 6:00 PM position (180° - 120°)?',
    clockAngle: { startHour: 4, endHour: 6, angleDeg: 60, label: '60° · REMAINING ARC' },
  },
  {
    base: 45,
    type: 'straight_line',
    target: 135,
    mission: 'Flat Mirror Reflection Line (180°)',
    context: 'Incident and reflected beams form adjacent angles on a flat 180° plane.',
    prompt: 'The incident ray makes an angle of 45° with the baseline. Calculate the remaining angle x to complete the 180° straight line (180° - 45°).',
  },
  {
    base: 80,
    type: 'straight_line',
    target: 100,
    mission: 'Conduit Pipe Junction (180°)',
    context: 'Two support struts meet on a straight 180° structural beam.',
    prompt: 'Strut Alpha forms an 80° angle with the beam. What angle does Strut Beta form on the 180° line (180° - 80°)?',
  },
  {
    base: 140,
    type: 'straight_line',
    target: 40,
    mission: 'Heliostat Linear Track (180°)',
    context: 'Motor traverse rail is straight (180°). Motor arm angle is 140°.',
    prompt: 'What angle remains on the straight track to reach the end stop (180° - 140°)?',
  },
  {
    base: 50,
    type: 'straight_line',
    target: 130,
    mission: 'Pipeline Linear Splice (180°)',
    context: 'Thermal fluid line runs straight across the field (180°).',
    prompt: 'Branch pipe diverges at 50°. What is the supplementary angle continuing along the pipeline (180° - 50°)?',
  },
  {
    base: 72,
    type: 'straight_line',
    target: 108,
    mission: 'Pentagonal Frame Strut (180°)',
    context: 'Perimeter fence girder forms a straight 180° line.',
    prompt: 'Cross brace meets the girder at 72°. Find the missing adjacent angle (180° - 72°).',
  },

  // ── Angles Around a Point (Sum to 360°) ──
  {
    base: 260,
    type: 'around_point',
    target: 100,
    mission: 'Full Circle Sensor Sweep (360°)',
    context: 'Three sensors monitor a complete 360° circle around the Central Forge.',
    prompt: 'Sensors A and B cover 260° total. Since angles around a point sum to 360°, find the angle covered by Sensor C (360° - 260°).',
  },
  {
    base: 310,
    type: 'around_point',
    target: 50,
    mission: 'Radar Ring Gap Angle (360°)',
    context: 'A 360° rotating radar ring has an active sector of 310°.',
    prompt: 'Calculate the missing blind spot gap angle to complete the 360° circle (360° - 310°).',
  },
  {
    base: 280,
    type: 'around_point',
    target: 80,
    mission: 'Circular Mirror Ring (360°)',
    context: 'Heliostats arranged in a 360° circle around the central tower.',
    prompt: 'Sector 1 and 2 cover 280°. What angle does Sector 3 occupy to complete 360°?',
  },
  {
    base: 225,
    type: 'around_point',
    target: 135,
    mission: 'Turntable Rotary Completion (360°)',
    context: 'Rotating observation platform has turned through 225°.',
    prompt: 'What angle remains to complete one full 360° revolution (360° - 225°)?',
  },
  {
    base: 300,
    type: 'around_point',
    target: 60,
    mission: 'Sundial Outer Dial Gap (360°)',
    context: 'The full 360° circular dial face has calibrated sections totaling 300°.',
    prompt: 'Find the uncalibrated sector angle (360° - 300°):',
    clockAngle: { startHour: 10, endHour: 12, angleDeg: 60, label: '60° · GAP TO 360°' },
  },
  {
    base: 240,
    type: 'around_point',
    target: 120,
    mission: 'Three-Sector Turbine Rotor (360°)',
    context: 'Turbine wheel divided into three sectors totaling 360°.',
    prompt: 'Sector 1 and 2 total 240°. What angle is Sector 3 (360° - 240°)?',
  },
  {
    base: 270,
    type: 'around_point',
    target: 90,
    mission: 'Quadrant Completion (360°)',
    context: 'Three quadrants of the circle cover 3 × 90° = 270°.',
    prompt: 'Find the angle of the fourth quadrant to complete the full 360° circle (360° - 270°):',
  },

  // ── Complementary Angles (Sum to 90°) ──
  {
    base: 35,
    type: 'complementary',
    target: 55,
    mission: 'Complementary Optical Corner (90°)',
    context: 'Two mirror guide-fins meet at a 90° right angle.',
    prompt: 'Fin 1 is calibrated to 35°. Since complementary angles sum to 90°, find the angle of Fin 2 (90° - 35°).',
  },
  {
    base: 50,
    type: 'complementary',
    target: 40,
    mission: 'Sundial Right-Angle Complement (90°)',
    context: 'The quadrant between 12:00 PM and 3:00 PM forms a 90° right angle.',
    prompt: 'Angle 1 is measured at 50°. Find the complementary angle needed to complete the 90° quadrant (90° - 50°).',
    clockAngle: { startHour: 12, endHour: 3, angleDeg: 90, label: '90° · QUADRANT SUM' },
  },
  {
    base: 20,
    type: 'complementary',
    target: 70,
    mission: 'Beam Splitter Prism (90°)',
    context: 'Complementary prism splitters total 90°.',
    prompt: 'Splitter A is angled at 20°. Find complementary angle B (90° - 20°).',
  },
  {
    base: 62,
    type: 'complementary',
    target: 28,
    mission: 'Optical Filter Wedge (90°)',
    context: 'Two optical filter wedges combine into a 90° corner.',
    prompt: 'Filter A measures 62°. Calculate complementary angle B (90° - 62°).',
  },
  {
    base: 45,
    type: 'complementary',
    target: 45,
    mission: 'Symmetric Right-Angle Bisection (90°)',
    context: 'A 90° right angle is split symmetrically into two equal complementary angles.',
    prompt: 'What is the measure of each equal complementary angle (90° ÷ 2)?',
  },
  {
    base: 75,
    type: 'complementary',
    target: 15,
    mission: 'Collimator Shutter Wedge (90°)',
    context: 'Shutter plate meets the vertical stop at 90°.',
    prompt: 'Plate angle is 75°. Find complementary angle x (90° - 75°).',
  },
  {
    base: 30,
    type: 'complementary',
    target: 60,
    mission: 'Sundial Hour Complement (90°)',
    context: 'The 12 to 1 arc is 30°. The 12 to 3 quadrant is 90°.',
    prompt: 'Find the complementary angle from 1:00 PM to 3:00 PM (90° - 30°):',
    clockAngle: { startHour: 1, endHour: 3, angleDeg: 60, label: '60° · COMPLEMENT' },
  },

  // ── Supplementary Angles (Sum to 180°) ──
  {
    base: 110,
    type: 'supplementary',
    target: 70,
    mission: 'Supplementary Heliostat Alignment (180°)',
    context: 'Two adjacent mirror panels must be supplementary (sum to 180°).',
    prompt: 'Panel Alpha is set at 110°. Calculate the supplementary angle required for Panel Beta (180° - 110°).',
  },
  {
    base: 75,
    type: 'supplementary',
    target: 105,
    mission: 'Supplementary Energy Conduits (180°)',
    context: 'Supplementary light tubes form 180°.',
    prompt: 'Tube 1 is angled at 75°. Find supplementary angle 2 (180° - 75°).',
  },
  {
    base: 130,
    type: 'supplementary',
    target: 50,
    mission: 'Articulated Robot Joint (180°)',
    context: 'Two jointed mechanical arms are supplementary (sum to 180°).',
    prompt: 'Arm 1 is positioned at 130°. Calculate angle x for Arm 2 to maintain straight-line balance (180° - 130°).',
  },
  {
    base: 95,
    type: 'supplementary',
    target: 85,
    mission: 'Supplementary Heliostat Alignment (180°)',
    context: 'Adjacent heliostat brackets sum to 180°.',
    prompt: 'Reading A is 95°. Find supplementary Reading B (180° - 95°).',
  },
  {
    base: 155,
    type: 'supplementary',
    target: 25,
    mission: 'Linear Optical Fiber Link (180°)',
    context: 'Fiber optic cables meet along a straight line (180°).',
    prompt: 'Cable 1 bends at 155°. Find supplementary angle x (180° - 155°).',
  },
  {
    base: 125,
    type: 'supplementary',
    target: 55,
    mission: 'Receiver Flank Supplementary (180°)',
    context: 'Heliostat elevation angles sum to 180°.',
    prompt: 'West flank reads 125°. Calculate supplementary angle for east flank (180° - 125°).',
  },
  {
    base: 85,
    type: 'supplementary',
    target: 95,
    mission: 'Tower Bracket Balance (180°)',
    context: 'Two structural brackets on opposite sides of the tower mast sum to 180°.',
    prompt: 'Left bracket is at 85°. Calculate right bracket angle (180° - 85°).',
  },

  // ── Vertically Opposite Angles (Equal) ──
  {
    base: 52,
    type: 'vertically_opposite',
    target: 52,
    mission: 'Vertically Opposite Laser Beams',
    context: 'Two laser targeting beams cross in the center of the array.',
    prompt: 'The east angle is measured at 52°. Since vertically opposite angles are equal, what is the west angle?',
  },
  {
    base: 118,
    type: 'vertically_opposite',
    target: 118,
    mission: 'Crossed Truss Support Members',
    context: 'Diagonal support girders intersect in an X on the receiver tower.',
    prompt: 'The top angle measures 118°. What is the vertically opposite bottom angle?',
  },
  {
    base: 37,
    type: 'vertically_opposite',
    target: 37,
    mission: 'Crossed Alignment Guidewires',
    context: 'Guidewires cross at the tower apex.',
    prompt: 'The left angle is 37°. What is the vertically opposite right angle?',
  },
  {
    base: 142,
    type: 'vertically_opposite',
    target: 142,
    mission: 'Structural Truss X-Brace',
    context: 'Heavy steel truss members intersect in an X.',
    prompt: 'The north angle is 142°. What is the vertically opposite south angle?',
  },
  {
    base: 68,
    type: 'vertically_opposite',
    target: 68,
    mission: 'Diagonal Mirror Support Cross',
    context: 'Two structural mirror arms intersect.',
    prompt: 'Upper angle reads 68°. Find the vertically opposite lower angle:',
  },
  {
    base: 44,
    type: 'vertically_opposite',
    target: 44,
    mission: 'Intersecting Beam Splitter Lines',
    context: 'Optical telemetry laser lines cross on the target screen.',
    prompt: 'East sector angle is 44°. What is the vertically opposite west sector angle?',
  },
  {
    base: 128,
    type: 'vertically_opposite',
    target: 128,
    mission: 'Tower Guywire Cross Section',
    context: 'Guywires crossing in an X pattern maintain tower equilibrium.',
    prompt: 'Angle Alpha is 128°. Find vertically opposite angle Beta:',
  },
];

// ────────────────────────────────────────────────────────────
// ROUND 4: GEOMETRIC CONSTRUCTIONS (30 SPECS)
// Time: 02:30 PM (Afternoon)
// ────────────────────────────────────────────────────────────
interface R4Spec {
  baseAngle: number;
  target: number;
  type: 'angle_bisector' | 'perpendicular';
  mission: string;
  context: string;
  prompt: string;
  clockAngle?: { startHour: number; endHour: number; angleDeg: number; isReflex?: boolean; label?: string };
}

const R4_SPECS: R4Spec[] = [
  {
    baseAngle: 90,
    target: 45,
    type: 'angle_bisector',
    mission: 'Bisect 90° Sundial Quadrant',
    context: 'The quadrant between 12:00 PM and 3:00 PM forms a 90° angle.',
    prompt: 'Construct the angle bisector to divide the 90° angle into two equal 45° halves for dual mirror reflection.',
    clockAngle: { startHour: 12, endHour: 3, angleDeg: 90, label: '90° → BISECT TO 45°' },
  },
  {
    baseAngle: 60,
    target: 30,
    type: 'angle_bisector',
    mission: 'Bisect 60° Two-Hour Arc',
    context: 'The 2-hour solar transit from 12:00 PM to 2:00 PM forms 60°.',
    prompt: 'Construct the angle bisector to find the exact 30° midpoint (1:00 PM sun position).',
    clockAngle: { startHour: 12, endHour: 2, angleDeg: 60, label: '60° → BISECT TO 30°' },
  },
  {
    baseAngle: 0,
    target: 90,
    type: 'perpendicular',
    mission: 'Construct 90° Gnomon Perpendicular',
    context: 'The sundial gnomon upright must stand at a true 90° right angle to the marble plinth.',
    prompt: 'Erect a true 90° perpendicular normal line from the baseline using compass arcs.',
  },
  {
    baseAngle: 120,
    target: 60,
    type: 'angle_bisector',
    mission: 'Bisect 120° Collector Wing',
    context: 'The wide collector wing opens to 120° across the field.',
    prompt: 'Construct the angle bisector of the 120° aperture to align the central intake conduit at 60°.',
  },
  {
    baseAngle: 70,
    target: 35,
    type: 'angle_bisector',
    mission: 'Bisect 70° Incident Beam',
    context: 'Incoming sunbeam and receiver target form an angle of 70°.',
    prompt: 'Construct the angle bisector between incoming sunbeam and receiver to lock the mirror normal at 35°.',
  },
  {
    baseAngle: 0,
    target: 90,
    type: 'perpendicular',
    mission: 'Construct 90° Mirror Normal',
    context: 'According to the Law of Reflection, the mirror normal must stand perpendicular (90°).',
    prompt: 'Erect a 90° perpendicular normal to guarantee specular reflection into the central furnace.',
  },
  {
    baseAngle: 80,
    target: 40,
    type: 'angle_bisector',
    mission: 'Bisect 80° Heliostat Mount',
    context: 'The dual heliostat mounting frame forms an angle of 80°.',
    prompt: 'Construct the exact bisector of the 80° angle to set the median tracking line at 40°.',
  },
  {
    baseAngle: 100,
    target: 50,
    type: 'angle_bisector',
    mission: 'Bisect 100° Conduit Junction',
    context: 'Two high-pressure thermal conduits converge at 100°.',
    prompt: 'Bisect the 100° junction angle using compass arcs to position the 50° relief valve.',
  },
  {
    baseAngle: 50,
    target: 25,
    type: 'angle_bisector',
    mission: 'Bisect 50° Morning Solar Angle',
    context: 'Morning sunlight hits the field at 50° incidence.',
    prompt: 'Bisect the 50° angle to position the primary reflection normal at 25°.',
  },
  {
    baseAngle: 140,
    target: 70,
    type: 'angle_bisector',
    mission: 'Bisect 140° Flank Array Arc',
    context: 'Wide angle between west and south receiver lines.',
    prompt: 'Construct the angle bisector of the 140° angle to center the 70° relay mirror.',
  },
  {
    baseAngle: 0,
    target: 90,
    type: 'perpendicular',
    mission: 'Erect Tower Perpendicular Strut',
    context: 'Support strut must stand at 90° perpendicular to ground beam.',
    prompt: 'Construct a 90° perpendicular line using compass arcs to secure the tower base.',
  },
  {
    baseAngle: 110,
    target: 55,
    type: 'angle_bisector',
    mission: 'Bisect 110° Afternoon Collector Wing',
    context: 'Collector wing opens to 110° for late afternoon sun gathering.',
    prompt: 'Bisect the 110° wing to route energy through the 55° central channel.',
  },
  {
    baseAngle: 0,
    target: 90,
    type: 'perpendicular',
    mission: 'Construct 90° Receiver Faceplate Normal',
    context: 'Receiver cavity requires a true 90° perpendicular normal.',
    prompt: 'Erect a 90° perpendicular normal from the receiver baseline into the focal zone.',
  },
  {
    baseAngle: 84,
    target: 42,
    type: 'angle_bisector',
    mission: 'Bisect 84° Dual Laser Telemetry Line',
    context: 'Two guidance lasers cross at 84° on the target sensor.',
    prompt: 'Construct the bisector of the 84° angle to establish the 42° optical centerline.',
  },
  {
    baseAngle: 130,
    target: 65,
    type: 'angle_bisector',
    mission: 'Bisect 130° Reflector Pivot',
    context: 'Perimeter mirrors angled at 130°.',
    prompt: 'Bisect the 130° angle to place the 65° secondary relay station.',
  },
  {
    baseAngle: 0,
    target: 90,
    type: 'perpendicular',
    mission: 'Erect 90° Vertical Normal to Mirror Base',
    context: 'Ensure zero-distortion specular reflection off mirror surface.',
    prompt: 'Construct a 90° perpendicular normal to guarantee flat mirror reflection.',
  },
  {
    baseAngle: 76,
    target: 38,
    type: 'angle_bisector',
    mission: 'Bisect 76° Optical Path',
    context: 'Telemetry path opens at 76° across the field.',
    prompt: 'Bisect the 76° angle to set the mirror orientation at 38°.',
  },
  {
    baseAngle: 96,
    target: 48,
    type: 'angle_bisector',
    mission: 'Bisect 96° Cross-Field Angle',
    context: 'Connecting east array and west array optical axes.',
    prompt: 'Bisect the 96° angle using compass arcs to establish the 48° median.',
  },
  {
    baseAngle: 64,
    target: 32,
    type: 'angle_bisector',
    mission: 'Bisect 64° Concentrator Apex',
    context: 'Apex of parabolic concentrator funnel measures 64°.',
    prompt: 'Bisect the 64° apex angle to aim the receiver directly at 32°.',
  },
  {
    baseAngle: 150,
    target: 75,
    type: 'angle_bisector',
    mission: 'Bisect 150° Wide Solar Track',
    context: 'Heliostat traverse track sweeps through a wide 150° arc.',
    prompt: 'Construct the angle bisector to center the tracking motor at 75°.',
  },
  {
    baseAngle: 0,
    target: 90,
    type: 'perpendicular',
    mission: 'Construct 90° High-Pressure Manifold Normal',
    context: 'Steam turbine intake flange requires an exact 90° right angle.',
    prompt: 'Construct a 90° perpendicular normal for the high-pressure manifold.',
  },
  {
    baseAngle: 56,
    target: 28,
    type: 'angle_bisector',
    mission: 'Bisect 56° Dual Beam Split',
    context: 'Optical beam splitter divides sunlight into two beams totaling 56°.',
    prompt: 'Bisect the 56° beam split to route energy through the 28° channel.',
  },
  {
    baseAngle: 104,
    target: 52,
    type: 'angle_bisector',
    mission: 'Bisect 104° Solar Collector',
    context: 'Dual collector array opens at 104°.',
    prompt: 'Bisect the 104° collector mount to orient the central sensor at 52°.',
  },
  {
    baseAngle: 0,
    target: 90,
    type: 'perpendicular',
    mission: 'Erect 90° Mast Anchor',
    context: 'Secure the central telemetric mast with a perpendicular foundation.',
    prompt: 'Construct a 90° perpendicular line using compass arcs to anchor the mast.',
  },
  {
    baseAngle: 72,
    target: 36,
    type: 'angle_bisector',
    mission: 'Bisect 72° Pentagonal Array Sector',
    context: 'Sector angle of pentagonal mirror array measures 72°.',
    prompt: 'Bisect the 72° sector angle to align the heliostat directly at 36°.',
  },
  {
    baseAngle: 40,
    target: 20,
    type: 'angle_bisector',
    mission: 'Bisect 40° Fine Beam Convergence',
    context: 'Two focused laser beams meet at 40° in the receiver core.',
    prompt: 'Construct the angle bisector of the 40° angle to find the 20° central axis.',
  },
  {
    baseAngle: 160,
    target: 80,
    type: 'angle_bisector',
    mission: 'Bisect 160° Wide-Angle Reflector Wing',
    context: 'Perimeter wings open to 160° across the desert facility.',
    prompt: 'Bisect the 160° wing angle to align the central intake pipe at 80°.',
  },
  {
    baseAngle: 0,
    target: 90,
    type: 'perpendicular',
    mission: 'Construct 90° Plinth Calibration Line',
    context: 'Marble plinth orientation line for True North alignment.',
    prompt: 'Construct a 90° perpendicular normal to establish the North-South meridian.',
  },
  {
    baseAngle: 88,
    target: 44,
    type: 'angle_bisector',
    mission: 'Bisect 88° Telemetry Junction',
    context: 'Telemetry sensor cables meet at 88° at the array junction box.',
    prompt: 'Bisect the 88° angle using compass arcs to align the conduit at 44°.',
  },
  {
    baseAngle: 124,
    target: 62,
    type: 'angle_bisector',
    mission: 'Bisect 124° Parabolic Reflector Arm',
    context: 'Flank collector arms open to 124° around the central forge.',
    prompt: 'Bisect the 124° angle to aim the central reflector at 62°.',
  },
];

// ────────────────────────────────────────────────────────────
// ROUND 5: SUNDIAL & SOLAR FORGE FINAL IGNITION (30 SPECS)
// Time: 04:30 PM (Golden Hour)
// ────────────────────────────────────────────────────────────
interface R5Spec {
  shadow: number;
  target: number;
  mission: string;
  context: string;
  prompt: string;
  clockAngle?: { startHour: number; endHour: number; angleDeg: number; isReflex?: boolean; label?: string };
}

const R5_SPECS: R5Spec[] = [
  {
    shadow: 40,
    target: 140,
    mission: 'Golden Hour 40° Shadow Convergence',
    context: 'Late afternoon sunlight casts a long sundial shadow at 40° bearing.',
    prompt: 'On a 180° straight baseline connecting to the Central Forge, calculate the supplementary angle (180° - 40°) to trigger full ignition!',
  },
  {
    shadow: 50,
    target: 130,
    mission: 'Sundial 4:00 PM Shadow Vector',
    context: 'The sundial shadow indicates 4:00 PM (shadow angle 50°).',
    prompt: 'Determine the 180° supplementary angle (180° - 50° = 130°) to align the master heliostat mirror directly with the Solar Forge core.',
    clockAngle: { startHour: 12, endHour: 4, angleDeg: 120, label: '4:00 PM · 120° FROM NOON' },
  },
  {
    shadow: 55,
    target: 125,
    mission: 'Final Supplementary Relay Lock',
    context: 'Sundial telemetry records a 55° shadow angle across the marble plinth.',
    prompt: 'Find the supplementary angle on the 180° plane required to fire the high-energy solar beam into the rotating Forge turbine rings.',
  },
  {
    shadow: 30,
    target: 150,
    mission: 'Direct Solar Forge Striking Angle',
    context: 'The sun tracker sensor registers an incident angle of 30° with north.',
    prompt: 'Calculate the supplementary angle (180° - 30°) to reflect the full concentrated solar flux into the molten salt chamber!',
  },
  {
    shadow: 60,
    target: 120,
    mission: 'Dual Team Fusion Convergence',
    context: 'Both Blue and Red light beams must converge at 120° on the central receiver.',
    prompt: 'The sundial shadow reads 60°. Calculate the 180° supplementary angle (120°) to lock the dual beam fusion core!',
  },
  {
    shadow: 45,
    target: 135,
    mission: 'Symmetric Core Resonance',
    context: 'Gnomon shadow points at 45° across the dial.',
    prompt: 'Rotate the multi-stage heliostat array by the supplementary angle (180° - 45° = 135°) to bring the Central Forge to 100% capacity!',
  },
  {
    shadow: 35,
    target: 55,
    mission: '35° Shadow → 55° Complementary Core Lock',
    context: 'Sundial indicates 35° azimuth deviation.',
    prompt: 'Calculate the complementary 90° angle (90° - 35°) to align the molten core turbine intake.',
  },
  {
    shadow: 70,
    target: 110,
    mission: '70° Shadow → 110° Final Relay Alignment',
    context: 'Late afternoon shadow measures 70°.',
    prompt: 'Calculate the 180° straight-line angle needed to route the beam to the Central Solar Forge (180° - 70°).',
  },
  {
    shadow: 25,
    target: 155,
    mission: '25° Shadow → 155° Superheater Strike',
    context: 'Low sun angle casts a 25° shadow.',
    prompt: 'Find the supplementary angle (180° - 25°) to redirect the full solar flux into the superheater.',
  },
  {
    shadow: 48,
    target: 132,
    mission: '48° Shadow → 132° Ignition Angle',
    context: 'Gnomon shadow records 48° across the dial.',
    prompt: 'Find the supplementary angle (180° - 48°) to align the master heliostat mirror and activate the Solar Forge.',
  },
  {
    shadow: 40,
    target: 50,
    mission: '40° Deviation → 50° Complementary Focus',
    context: 'Sun deviation angle is 40° from the meridian.',
    prompt: 'Calculate the complementary angle (90° - 40°) to focus both team beams onto the molten salt receiver.',
  },
  {
    shadow: 80,
    target: 100,
    mission: '80° Shadow → 100° Power Convergence',
    context: 'Afternoon sun yields an 80° shadow.',
    prompt: 'Calculate the supplementary angle (180° - 80°) to complete the optical circuit to the Forge.',
  },
  {
    shadow: 52,
    target: 128,
    mission: '52° Tracking Reading → 128° Final Relay',
    context: 'Sundial tracking sensor outputs 52°.',
    prompt: 'Calculate the supplementary angle (180° - 52°) to unlock the central generator turbines.',
  },
  {
    shadow: 38,
    target: 142,
    mission: '38° Optical Measurement → 142° Core Resonance',
    context: 'Shadow baseline reads 38°.',
    prompt: 'Calculate the missing angle on the 180° line (180° - 38°) to bring the Forge to 100% capacity.',
  },
  {
    shadow: 75,
    target: 105,
    mission: '75° Afternoon Shadow → 105° Final Charge',
    context: 'Afternoon shadow angle reads 75°.',
    prompt: 'Calculate the supplementary angle (180° - 75°) to trigger the final Solar Forge power cycle.',
  },
  {
    shadow: 42,
    target: 138,
    mission: '42° Precision Shadow → 138° Forge Lock',
    context: 'Telemetry detects 42° shadow angle.',
    prompt: 'Compute the supplementary angle (180° - 42°) to align the primary heliostats with the central tower.',
  },
  {
    shadow: 58,
    target: 122,
    mission: '58° Solar Bearing → 122° Grid Connection',
    context: 'Sundial gnomon shadow reads 58°.',
    prompt: 'Calculate the missing angle on the 180° plane (180° - 58°) to engage the main generator grid.',
  },
  {
    shadow: 22,
    target: 68,
    mission: '22° Sun Angle → 68° Complementary Fusion',
    context: 'Low sun angle measures 22° with vertical.',
    prompt: 'Determine the complementary 90° angle (90° - 22°) to complete the mirror alignment and power up the Forge.',
  },
  {
    shadow: 64,
    target: 116,
    mission: '64° Dial Reading → 116° Turbine Engagement',
    context: 'Sundial dial registers 64° shadow.',
    prompt: 'Find the 180° supplementary angle (180° - 64°) to reflect sunlight directly onto the central receiver.',
  },
  {
    shadow: 36,
    target: 144,
    mission: '36° Telemetry Reading → 144° Full Power Lock',
    context: 'Gnomon shadow stands at 36°.',
    prompt: 'Calculate the 180° supplementary angle (180° - 36°) to bring the Solar Forge to full operational power!',
  },
  {
    shadow: 46,
    target: 44,
    mission: '46° Quadrant Angle → 44° Complementary Relay',
    context: 'Sensor quadrant reads 46° deviation.',
    prompt: 'Determine the complementary angle (90° - 46°) to focus maximum solar energy into the central furnace.',
  },
  {
    shadow: 72,
    target: 108,
    mission: '72° Field Shadow → 108° Forge Activation',
    context: 'Field sundial shadow measures 72°.',
    prompt: 'Calculate the supplementary angle (180° - 72°) to strike the central power tower!',
  },
  {
    shadow: 50,
    target: 130,
    mission: '50° Master Alignment → 130° Solar Forge Ignition',
    context: 'Final sundial shadow reading is 50°.',
    prompt: 'Calculate the 180° supplementary angle (180° - 50°) to activate the Solar Forge at 100% capacity!',
  },
  {
    shadow: 62,
    target: 118,
    mission: '62° Golden Ray Strike → 118° High-Power Lock',
    context: 'Sunlight strikes the plaza dial at 62° bearing.',
    prompt: 'Calculate the supplementary angle (180° - 62°) to lock the high-density solar receiver beam!',
  },
  {
    shadow: 28,
    target: 152,
    mission: '28° Horizon Glance → 152° Furnace Ignition',
    context: 'Late sun casts an elongated shadow at 28° bearing.',
    prompt: 'Find the supplementary angle on the 180° axis (180° - 28°) to ignite the central molten salt storage!',
  },
  {
    shadow: 44,
    target: 136,
    mission: '44° Precision Vector → 136° Beam Convergence',
    context: 'Telemetry shadow vector stands at 44°.',
    prompt: 'Rotate the primary heliostat array by the supplementary angle (180° - 44° = 136°) to align with the core.',
  },
  {
    shadow: 66,
    target: 114,
    mission: '66° Shadow Vector → 114° Turbine Spin-Up',
    context: 'Afternoon sun bearing generates a 66° shadow.',
    prompt: 'Determine the supplementary angle (180° - 66°) to reach the 100% rotational threshold.',
  },
  {
    shadow: 32,
    target: 58,
    mission: '32° Telemetry Offset → 58° Complementary Lock',
    context: 'Optical deviation measures 32° from the focal normal.',
    prompt: 'Calculate the complementary angle (90° - 32°) to lock the primary beam splitter.',
  },
  {
    shadow: 54,
    target: 126,
    mission: '54° Master Bearing → 126° Dual Team Fusion',
    context: 'Sundial shadow angle records 54°.',
    prompt: 'Find the supplementary angle (180° - 54°) to converge Blue and Red beams into the Central Solar Forge!',
  },
  {
    shadow: 34,
    target: 146,
    mission: '34° Late Afternoon Transit → 146° Final Ignition',
    context: 'Sun altitude drops towards the golden horizon with a 34° shadow.',
    prompt: 'Calculate the supplementary angle (180° - 34°) to achieve 100% Solar Forge Full Operational Status!',
  },
];

// ────────────────────────────────────────────────────────────
// QUESTION GENERATOR: 165+ Curated Questions across Tournament
// ────────────────────────────────────────────────────────────
export function createSolarQuestionSet(totalPerTeam = 5): SolarQuestion[] {
  const result: SolarQuestion[] = [];

  // Round 1: Classification (09:00 AM)
  const r1Pick = R1_SPECS[Math.floor(Math.random() * R1_SPECS.length)];
  const r1Class = classifyAngleFromDegrees(r1Pick.angle);
  result.push({
    id: `q-r1-${Date.now()}-1`,
    round: 1,
    category: 'classify_angles',
    title: `MISSION 01: ${r1Pick.mission}`,
    scenario: r1Pick.context,
    prompt: r1Pick.prompt,
    targetAngle: r1Pick.angle,
    toleranceDeg: 0,
    angleClassification: r1Class,
    options: makeTactileClassificationOptions(r1Class),
    timeOfDay: '09:00 AM',
    highlightClockAngle: r1Pick.clockAngle,
    explanation: `${r1Pick.angle}° is classified as an ${r1Class.toUpperCase()} angle.`,
    physicalTarget: {
      mirrorIndex: 0,
      targetAzimuth: r1Pick.angle,
      targetElevation: 32,
      receiverId: 'receiver_tower_1',
      conduitEffect: 'Mirror Alpha unlocks and rotates into active sun-tracking position.',
    },
  });

  // Round 2: Measurement (10:30 AM)
  const r2Pick = R2_SPECS[Math.floor(Math.random() * R2_SPECS.length)];
  result.push({
    id: `q-r2-${Date.now()}-2`,
    round: 2,
    category: 'measure_angles',
    title: `MISSION 02: ${r2Pick.mission}`,
    scenario: r2Pick.context,
    prompt: r2Pick.prompt,
    targetAngle: r2Pick.target,
    toleranceDeg: 4,
    timeOfDay: '10:30 AM',
    highlightClockAngle: r2Pick.clockAngle,
    explanation: `Aligning the protractor needle to ${r2Pick.target}° directs the sunlight beam cleanly onto the secondary reflector.`,
    physicalTarget: {
      mirrorIndex: r2Pick.mirror,
      targetAzimuth: r2Pick.target,
      targetElevation: 42,
      receiverId: 'receiver_tower_1',
      conduitEffect: 'Primary sunlight beam bounces and strikes the collector tower.',
    },
  });

  // Round 3: Missing Angles (12:00 PM)
  const r3Pick = R3_SPECS[Math.floor(Math.random() * R3_SPECS.length)];
  result.push({
    id: `q-r3-${Date.now()}-3`,
    round: 3,
    category: 'missing_angles',
    title: `MISSION 03: ${r3Pick.mission}`,
    scenario: r3Pick.context,
    prompt: r3Pick.prompt,
    targetAngle: r3Pick.target,
    baseAngle: r3Pick.base,
    missingAngleType: r3Pick.type,
    toleranceDeg: 3,
    timeOfDay: '12:00 PM',
    highlightClockAngle: r3Pick.clockAngle,
    explanation: `Using the geometric relationship (${r3Pick.type.replace('_', ' ')}), the missing angle is ${r3Pick.target}°.`,
    physicalTarget: {
      mirrorIndex: 1,
      targetAzimuth: r3Pick.target,
      targetElevation: 50,
      receiverId: 'central_solar_forge',
      conduitEffect: 'Secondary relay aligns. Sunlight beam reflects into the Central Solar Forge heat exchanger.',
    },
  });

  // Round 4: Constructions (02:30 PM)
  const r4Pick = R4_SPECS[Math.floor(Math.random() * R4_SPECS.length)];
  result.push({
    id: `q-r4-${Date.now()}-4`,
    round: 4,
    category: 'constructions',
    title: `MISSION 04: ${r4Pick.mission}`,
    scenario: r4Pick.context,
    prompt: r4Pick.prompt,
    targetAngle: r4Pick.target,
    baseAngle: r4Pick.baseAngle,
    toleranceDeg: 3,
    timeOfDay: '02:30 PM',
    highlightClockAngle: r4Pick.clockAngle,
    explanation: `Constructed ${r4Pick.type === 'angle_bisector' ? `angle bisector at ${r4Pick.target}°` : 'perpendicular normal at 90°'} ensures specular reflection.`,
    physicalTarget: {
      mirrorIndex: 2,
      targetAzimuth: r4Pick.target,
      targetElevation: 54,
      receiverId: 'central_solar_forge',
      conduitEffect: 'Precision optical mount locks into place. Central Forge turbine preheaters engage.',
    },
  });

  // Round 5: Sundial & Solar Forge Final Ignition (04:30 PM)
  const r5Pick = R5_SPECS[Math.floor(Math.random() * R5_SPECS.length)];
  result.push({
    id: `q-r5-${Date.now()}-5`,
    round: 5,
    category: 'sundial_tracking',
    title: `MISSION 05: ${r5Pick.mission}`,
    scenario: r5Pick.context,
    prompt: r5Pick.prompt,
    targetAngle: r5Pick.target,
    baseAngle: r5Pick.shadow,
    toleranceDeg: 4,
    timeOfDay: '04:30 PM',
    highlightClockAngle: r5Pick.clockAngle,
    explanation: `With the sundial shadow at ${r5Pick.shadow}°, the supplementary angle of ${r5Pick.target}° directs the full solar flux into the Central Solar Forge!`,
    physicalTarget: {
      mirrorIndex: 0,
      targetAzimuth: r5Pick.target,
      targetElevation: 62,
      receiverId: 'central_solar_forge',
      conduitEffect: 'SOLAR FORGE FULL POWER: Mechanical rings rotate, turbines spin, and high-energy beam connects!',
    },
  });

  // If more questions requested, randomly sample from the 165+ curated problem pools
  while (result.length < totalPerTeam) {
    const rIdx = (result.length % 5) + 1;
    if (rIdx === 1) {
      const p = R1_SPECS[Math.floor(Math.random() * R1_SPECS.length)];
      const c = classifyAngleFromDegrees(p.angle);
      result.push({
        id: `q-r1-${Date.now()}-${result.length + 1}`,
        round: 1,
        category: 'classify_angles',
        title: `MISSION 01: ${p.mission}`,
        scenario: p.context,
        prompt: p.prompt,
        targetAngle: p.angle,
        toleranceDeg: 0,
        angleClassification: c,
        options: makeTactileClassificationOptions(c),
        timeOfDay: '09:00 AM',
        highlightClockAngle: p.clockAngle,
        explanation: `${p.angle}° is classified as ${c.toUpperCase()}.`,
        physicalTarget: { mirrorIndex: 0, targetAzimuth: p.angle, targetElevation: 32, receiverId: 'receiver_tower_1', conduitEffect: 'Mirror rotates.' },
      });
    } else if (rIdx === 2) {
      const p = R2_SPECS[Math.floor(Math.random() * R2_SPECS.length)];
      result.push({
        id: `q-r2-${Date.now()}-${result.length + 1}`,
        round: 2,
        category: 'measure_angles',
        title: `MISSION 02: ${p.mission}`,
        scenario: p.context,
        prompt: p.prompt,
        targetAngle: p.target,
        toleranceDeg: 4,
        timeOfDay: '10:30 AM',
        highlightClockAngle: p.clockAngle,
        explanation: `Target angle is ${p.target}°.`,
        physicalTarget: { mirrorIndex: p.mirror, targetAzimuth: p.target, targetElevation: 42, receiverId: 'receiver_tower_1', conduitEffect: 'Beam aligns.' },
      });
    } else if (rIdx === 3) {
      const p = R3_SPECS[Math.floor(Math.random() * R3_SPECS.length)];
      result.push({
        id: `q-r3-${Date.now()}-${result.length + 1}`,
        round: 3,
        category: 'missing_angles',
        title: `MISSION 03: ${p.mission}`,
        scenario: p.context,
        prompt: p.prompt,
        targetAngle: p.target,
        baseAngle: p.base,
        missingAngleType: p.type,
        toleranceDeg: 3,
        timeOfDay: '12:00 PM',
        highlightClockAngle: p.clockAngle,
        explanation: `Missing angle is ${p.target}°.`,
        physicalTarget: { mirrorIndex: 1, targetAzimuth: p.target, targetElevation: 50, receiverId: 'central_solar_forge', conduitEffect: 'Conduit activates.' },
      });
    } else if (rIdx === 4) {
      const p = R4_SPECS[Math.floor(Math.random() * R4_SPECS.length)];
      result.push({
        id: `q-r4-${Date.now()}-${result.length + 1}`,
        round: 4,
        category: 'constructions',
        title: `MISSION 04: ${p.mission}`,
        scenario: p.context,
        prompt: p.prompt,
        targetAngle: p.target,
        baseAngle: p.baseAngle,
        toleranceDeg: 3,
        timeOfDay: '02:30 PM',
        highlightClockAngle: p.clockAngle,
        explanation: `Result angle is ${p.target}°.`,
        physicalTarget: { mirrorIndex: 2, targetAzimuth: p.target, targetElevation: 54, receiverId: 'central_solar_forge', conduitEffect: 'Optics locked.' },
      });
    } else {
      const p = R5_SPECS[Math.floor(Math.random() * R5_SPECS.length)];
      result.push({
        id: `q-r5-${Date.now()}-${result.length + 1}`,
        round: 5,
        category: 'sundial_tracking',
        title: `MISSION 05: ${p.mission}`,
        scenario: p.context,
        prompt: p.prompt,
        targetAngle: p.target,
        baseAngle: p.shadow,
        toleranceDeg: 4,
        timeOfDay: '04:30 PM',
        highlightClockAngle: p.clockAngle,
        explanation: `Target angle is ${p.target}°.`,
        physicalTarget: { mirrorIndex: 0, targetAzimuth: p.target, targetElevation: 62, receiverId: 'central_solar_forge', conduitEffect: 'SOLAR FORGE FULL POWER!' },
      });
    }
  }

  return result;
}
