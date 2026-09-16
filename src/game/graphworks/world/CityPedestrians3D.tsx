// ============================================================
// GRAPHWORKS — THE DATA CITY: Stylized Pedestrians & Locomotion Physics
// High-fidelity stylized citizens with proper human anatomy, visible
// facial features (eyes, eyebrows, nose, mouth, hair), clothing variants,
// hierarchical skeletal walk cycle, hard obstacle collision physics
// (poles, buildings, trees, fountains), and strict vehicle avoidance
// so humans NEVER cross the street while moving vehicles are present.
// ============================================================
'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { cityTraffic } from './CityTrafficState';
import { useGraphworksStore } from '../store/graphworksStore';

export type CharacterRole =
  | 'city_worker'
  | 'weather_scientist'
  | 'train_passenger'
  | 'park_visitor'
  | 'traffic_officer'
  | 'systems_engineer';

interface CharacterStyle {
  skinTone: string;
  hairColor: string;
  shirtColor: string;
  pantsColor: string;
  shoesColor: string;
  accentColor?: string;
  hasHardHat?: boolean;
  hasBackpack?: boolean;
  hasTablet?: boolean;
  hasGlasses?: boolean;
  hairStyle: 'short' | 'parted' | 'bun' | 'curly';
  heightScale: number;
}

// Pre-curated character identity configurations
const ARCHETYPE_STYLES: Record<CharacterRole, CharacterStyle> = {
  city_worker: {
    skinTone: '#e0ac69',
    hairColor: '#1e293b',
    shirtColor: '#f97316', // High-vis orange
    pantsColor: '#1e3a8a', // Heavy navy denim
    shoesColor: '#451a03', // Steel-toe brown boots
    accentColor: '#e2e8f0', // Reflective silver tape
    hasHardHat: true,
    hasTablet: true,
    hairStyle: 'short',
    heightScale: 1.02,
  },
  weather_scientist: {
    skinTone: '#fed7aa',
    hairColor: '#451a03',
    shirtColor: '#0284c7', // Azure field coat
    pantsColor: '#d4b996', // Khakis
    shoesColor: '#334155',
    accentColor: '#38bdf8',
    hasGlasses: true,
    hasTablet: true,
    hairStyle: 'parted',
    heightScale: 0.98,
  },
  train_passenger: {
    skinTone: '#c68642',
    hairColor: '#0f172a',
    shirtColor: '#8b5cf6', // Violet sweater
    pantsColor: '#334155', // Charcoal slacks
    shoesColor: '#ffffff', // White sneakers
    hasBackpack: true,
    hairStyle: 'curly',
    heightScale: 1.0,
  },
  park_visitor: {
    skinTone: '#fce7d2',
    hairColor: '#b45309', // Auburn
    shirtColor: '#10b981', // Emerald casual tee
    pantsColor: '#2563eb', // Blue jeans
    shoesColor: '#f8fafc', // Sport runners
    hairStyle: 'bun',
    heightScale: 0.95,
  },
  traffic_officer: {
    skinTone: '#8d5524',
    hairColor: '#0f172a',
    shirtColor: '#eab308', // Neon safety yellow/lime
    pantsColor: '#0f172a', // Dark duty pants
    shoesColor: '#000000',
    accentColor: '#ffffff',
    hasHardHat: false,
    hairStyle: 'short',
    heightScale: 1.05,
  },
  systems_engineer: {
    skinTone: '#fed7aa',
    hairColor: '#64748b', // Slate grey
    shirtColor: '#0284c7', // Technical cyan
    pantsColor: '#1e293b',
    shoesColor: '#1e293b',
    hasTablet: true,
    hasGlasses: true,
    hairStyle: 'parted',
    heightScale: 1.0,
  },
};

// ── WORLD OBSTACLES (HARD BOUNDARIES HUMANS MUST NEVER ENTER) ──
const CIRCULAR_OBSTACLES = [
  // Central Data Tower base
  { x: 0, z: 0, radius: 2.3, name: 'tower_base' },
  // Grand Botanical Garden Fountain (Center of Park District)
  { x: 0, z: 11.0, radius: 2.3, name: 'park_botanical_fountain' },
  // 4 Plaza Ornamental Flowerbeds
  { x: 3.25, z: 3.25, radius: 0.9, name: 'flowerbed_ne' },
  { x: -3.25, z: 3.25, radius: 0.9, name: 'flowerbed_nw' },
  { x: -3.25, z: -3.25, radius: 0.9, name: 'flowerbed_sw' },
  { x: 3.25, z: -3.25, radius: 0.9, name: 'flowerbed_se' },
  // Boulevard streetlamps & poles (Z = 2.8 / 8.2 along sidewalks)
  { x: -26, z: 2.8, radius: 0.35, name: 'lamp_1' },
  { x: -18, z: 2.8, radius: 0.35, name: 'lamp_2' },
  { x: -10, z: 2.8, radius: 0.35, name: 'lamp_3' },
  { x: 10, z: 2.8, radius: 0.35, name: 'lamp_5' },
  { x: 18, z: 2.8, radius: 0.35, name: 'lamp_6' },
  { x: 26, z: 2.8, radius: 0.35, name: 'lamp_7' },
  // Traffic signal poles
  { x: -8.5, z: 2.9, radius: 0.35, name: 'traffic_pole_1' },
  { x: 8.5, z: 2.9, radius: 0.35, name: 'traffic_pole_2' },
  // Tree trunks in park
  { x: -7.2, z: 9.5, radius: 0.35, name: 'tree_1' },
  { x: 7.2, z: 9.5, radius: 0.35, name: 'tree_2' },
  { x: -6.8, z: 12.8, radius: 0.35, name: 'tree_3' },
  { x: 6.8, z: 12.8, radius: 0.35, name: 'tree_4' },
  { x: -4.2, z: 14.2, radius: 0.35, name: 'tree_5' },
  { x: 4.2, z: 14.2, radius: 0.35, name: 'tree_6' },
];

const BOX_OBSTACLES = [
  // Commercial Skyscrapers (Footprints - Pushed Back)
  { minX: -12.5, maxX: -8.5, minZ: -14.0, maxZ: -10.0, name: 'bldg_left_1' },
  { minX: -17.5, maxX: -13.5, minZ: -10.0, maxZ: -6.0, name: 'bldg_left_2' },
  { minX: 8.5, maxX: 12.5, minZ: -14.0, maxZ: -10.0, name: 'bldg_right_1' },
  { minX: 13.5, maxX: 17.5, minZ: -10.0, maxZ: -6.0, name: 'bldg_right_2' },
  // Cafe & Bistro Pavilion (Pushed Back)
  { minX: -18.5, maxX: -10.5, minZ: -5.5, maxZ: 0.5, name: 'cafe_bistro' },
  // Park Benches (Exact bounds)
  { minX: -5.5, maxX: -4.1, minZ: 11.6, maxZ: 12.2, name: 'bench_left' },
  { minX: 4.1, maxX: 5.5, minZ: 11.6, maxZ: 12.2, name: 'bench_right' },
];

// ── HIERARCHICALLY ARTICULATED HUMAN RIG ──
interface StylizedHumanRigProps {
  role: CharacterRole;
  isWalking: boolean;
  walkPhase: number;
  walkSpeed: number;
  isSitting?: boolean;
  isWaitingTraffic?: boolean;
  customStyle?: Partial<CharacterStyle>;
  isCelebrating?: boolean;
  celebrationStyle?: 'clap' | 'wave' | 'cheer';
  celebrationVariant?: number;
}

export function StylizedHumanRig({
  role,
  isWalking,
  walkPhase,
  walkSpeed,
  isSitting = false,
  isWaitingTraffic = false,
  customStyle,
  isCelebrating = false,
  celebrationStyle = 'clap',
  celebrationVariant = 0,
}: StylizedHumanRigProps) {
  const style = useMemo(() => ({ ...ARCHETYPE_STYLES[role], ...customStyle }), [role, customStyle]);

  // Joint hierarchy refs for smooth kinematic animation
  const pelvisRef = useRef<THREE.Group>(null);
  const torsoRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftHipRef = useRef<THREE.Group>(null);
  const rightHipRef = useRef<THREE.Group>(null);
  const leftKneeRef = useRef<THREE.Group>(null);
  const rightKneeRef = useRef<THREE.Group>(null);
  const leftFootRef = useRef<THREE.Group>(null);
  const rightFootRef = useRef<THREE.Group>(null);
  const leftShoulderRef = useRef<THREE.Group>(null);
  const rightShoulderRef = useRef<THREE.Group>(null);
  const leftElbowRef = useRef<THREE.Group>(null);
  const rightElbowRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    if (isCelebrating) {
      // ── JOYOUS CITIZEN CELEBRATION (WINNING BLUEPRINT FORMED) ──
      const cheerFreq = 4.5 + (celebrationVariant % 3) * 0.8;
      const cheerBounce = Math.abs(Math.sin(t * cheerFreq + celebrationVariant)) * 0.09;
      if (pelvisRef.current) {
        pelvisRef.current.position.y = 0.72 + cheerBounce;
        pelvisRef.current.rotation.y = Math.sin(t * 2.5 + celebrationVariant) * 0.1;
        pelvisRef.current.rotation.z = Math.cos(t * cheerFreq) * 0.03;
      }
      if (torsoRef.current) {
        torsoRef.current.rotation.y = Math.sin(t * 3.0) * 0.06;
        torsoRef.current.rotation.x = -0.05;
      }
      // Joyous spring in legs
      if (leftHipRef.current) leftHipRef.current.rotation.x = Math.sin(t * cheerFreq) * 0.12;
      if (rightHipRef.current) rightHipRef.current.rotation.x = -Math.sin(t * cheerFreq) * 0.12;
      if (leftKneeRef.current) leftKneeRef.current.rotation.x = Math.max(0, Math.sin(t * cheerFreq) * 0.2);
      if (rightKneeRef.current) rightKneeRef.current.rotation.x = Math.max(0, -Math.sin(t * cheerFreq) * 0.2);
      if (leftFootRef.current) leftFootRef.current.rotation.x = 0;
      if (rightFootRef.current) rightFootRef.current.rotation.x = 0;

      if (celebrationStyle === 'wave') {
        // High enthusiastic waving towards the winning team
        if (rightShoulderRef.current) {
          rightShoulderRef.current.rotation.x = -2.6; // Arm straight up
          rightShoulderRef.current.rotation.z = -0.4 + Math.sin(t * 6.5 + celebrationVariant) * 0.45; // Waving side to side
        }
        if (rightElbowRef.current) rightElbowRef.current.rotation.x = 0.4;
        if (leftShoulderRef.current) {
          leftShoulderRef.current.rotation.x = -0.4;
          leftShoulderRef.current.rotation.z = 0.25;
        }
        if (leftElbowRef.current) leftElbowRef.current.rotation.x = 0.5;
      } else if (celebrationStyle === 'cheer') {
        // Both arms raised high in triumphant victory pump
        const pump = Math.sin(t * 5.0 + celebrationVariant) * 0.25;
        if (leftShoulderRef.current) {
          leftShoulderRef.current.rotation.x = -2.7 + pump * 0.2;
          leftShoulderRef.current.rotation.z = 0.35;
        }
        if (rightShoulderRef.current) {
          rightShoulderRef.current.rotation.x = -2.7 + pump * 0.2;
          rightShoulderRef.current.rotation.z = -0.35;
        }
        if (leftElbowRef.current) leftElbowRef.current.rotation.x = 0.35 + pump * 0.3;
        if (rightElbowRef.current) rightElbowRef.current.rotation.x = 0.35 + pump * 0.3;
      } else {
        // Enthusiastic clapping in front of chest
        const clapAngle = Math.sin(t * 9.5) * 0.3;
        if (leftShoulderRef.current) {
          leftShoulderRef.current.rotation.x = -1.1;
          leftShoulderRef.current.rotation.y = 0.55 + clapAngle;
          leftShoulderRef.current.rotation.z = 0.25;
        }
        if (rightShoulderRef.current) {
          rightShoulderRef.current.rotation.x = -1.1;
          rightShoulderRef.current.rotation.y = -0.55 - clapAngle;
          rightShoulderRef.current.rotation.z = -0.25;
        }
        if (leftElbowRef.current) leftElbowRef.current.rotation.x = 1.35;
        if (rightElbowRef.current) rightElbowRef.current.rotation.x = 1.35;
      }

      if (headRef.current) {
        // Head tilted slightly upwards toward the Sky Proclamation and winning studio
        headRef.current.rotation.x = -0.22 + Math.sin(t * 3.5) * 0.08;
        headRef.current.rotation.y = Math.sin(t * 2.0 + celebrationVariant) * 0.2;
      }
      return;
    }

    if (isSitting) {
      // ── SITTING POSE ON PARK BENCH ──
      if (pelvisRef.current) {
        pelvisRef.current.position.y = THREE.MathUtils.damp(pelvisRef.current.position.y, 0.42, 6, delta);
        pelvisRef.current.rotation.x = 0;
        pelvisRef.current.rotation.y = 0;
        pelvisRef.current.rotation.z = 0;
      }
      if (leftHipRef.current) leftHipRef.current.rotation.x = THREE.MathUtils.damp(leftHipRef.current.rotation.x, -Math.PI / 2, 6, delta);
      if (rightHipRef.current) rightHipRef.current.rotation.x = THREE.MathUtils.damp(rightHipRef.current.rotation.x, -Math.PI / 2, 6, delta);
      if (leftKneeRef.current) leftKneeRef.current.rotation.x = THREE.MathUtils.damp(leftKneeRef.current.rotation.x, Math.PI / 2, 6, delta);
      if (rightKneeRef.current) rightKneeRef.current.rotation.x = THREE.MathUtils.damp(rightKneeRef.current.rotation.x, Math.PI / 2, 6, delta);
      if (leftFootRef.current) leftFootRef.current.rotation.x = 0;
      if (rightFootRef.current) rightFootRef.current.rotation.x = 0;
      if (leftShoulderRef.current) leftShoulderRef.current.rotation.x = -0.3;
      if (rightShoulderRef.current) rightShoulderRef.current.rotation.x = -0.3;
      if (leftElbowRef.current) leftElbowRef.current.rotation.x = 0.5;
      if (rightElbowRef.current) rightElbowRef.current.rotation.x = 0.5;
      if (headRef.current) {
        headRef.current.rotation.y = Math.sin(t * 0.5) * 0.25;
        headRef.current.rotation.x = 0.05 + Math.sin(t * 0.3) * 0.05;
      }
      return;
    }

    if (isWaitingTraffic) {
      // ── WAITING AT CROSSWALK CURB (LOOKING FOR CARS) ──
      if (pelvisRef.current) {
        pelvisRef.current.position.y = 0.72;
        pelvisRef.current.rotation.set(0, 0, 0);
      }
      if (torsoRef.current) torsoRef.current.rotation.set(0, 0, 0);
      if (leftHipRef.current) leftHipRef.current.rotation.x = THREE.MathUtils.damp(leftHipRef.current.rotation.x, 0, 6, delta);
      if (rightHipRef.current) rightHipRef.current.rotation.x = THREE.MathUtils.damp(rightHipRef.current.rotation.x, 0, 6, delta);
      if (leftKneeRef.current) leftKneeRef.current.rotation.x = THREE.MathUtils.damp(leftKneeRef.current.rotation.x, 0, 6, delta);
      if (rightKneeRef.current) rightKneeRef.current.rotation.x = THREE.MathUtils.damp(rightKneeRef.current.rotation.x, 0, 6, delta);
      if (leftFootRef.current) leftFootRef.current.rotation.x = 0;
      if (rightFootRef.current) rightFootRef.current.rotation.x = 0;

      // Cautious stance: head turns actively left and right scanning oncoming highway traffic
      if (headRef.current) {
        const trafficScan = Math.sin(t * 2.2) * 0.55; // Left & right head scan
        headRef.current.rotation.y = THREE.MathUtils.damp(headRef.current.rotation.y, trafficScan, 6, delta);
        headRef.current.rotation.x = 0.04;
      }
      return;
    }

    if (isWalking) {
      // ── BIOMECHANICALLY AUTHENTIC BIPEDAL WALK GAIT ──
      const phase = walkPhase;

      // 1. Pelvic Kinematics: Center of Mass vertical oscillation, lateral weight-shift & yaw
      if (pelvisRef.current) {
        // Vertical COM: double-bounce per stride (lowest at double-support, highest at mid-stance)
        const verticalBob = (Math.sin(phase * 2) * 0.5 + 0.5) * 0.032;
        pelvisRef.current.position.y = 0.72 + verticalBob;
        // Lateral sway: shifting pelvis over the weight-bearing stance foot
        pelvisRef.current.position.x = Math.sin(phase) * 0.024;
        // Pelvic yaw rotation (turning into the leading hip)
        pelvisRef.current.rotation.y = Math.sin(phase) * 0.075;
        // Pelvic roll list (weight-bearing hip raises slightly, swing side lowers)
        pelvisRef.current.rotation.z = Math.cos(phase) * 0.03;
      }

      // 2. Torso counter-balance: twists opposite to pelvis in yaw, slight forward lean
      if (torsoRef.current) {
        torsoRef.current.rotation.y = -Math.sin(phase) * 0.065;
        torsoRef.current.rotation.x = 0.045 + Math.min(0.03, (walkSpeed / 1.5) * 0.02);
      }

      // 3. Legs Biomechanics: Left Leg (phase) vs Right Leg (phase + Math.PI)
      // Thigh Pitch: Negative tilts thigh forward (+Z), Positive extends backward (-Z)
      const leftThighPitch = -Math.sin(phase) * 0.44;
      const rightThighPitch = -Math.sin(phase + Math.PI) * 0.44;

      if (leftHipRef.current) {
        leftHipRef.current.rotation.x = leftThighPitch;
        leftHipRef.current.rotation.z = Math.cos(phase) * 0.02;
      }
      if (rightHipRef.current) {
        rightHipRef.current.rotation.x = rightThighPitch;
        rightHipRef.current.rotation.z = -Math.cos(phase) * 0.02;
      }

      // Knee Flexion: During swing phase (sin > 0), knee flexes dramatically backward (+X rotation)
      // to clear ground; during stance phase (sin <= 0), knee remains straight/supporting weight.
      const leftSwing = Math.max(0, Math.sin(phase));
      const leftPush = Math.max(0, -Math.cos(phase)) * Math.max(0, -Math.sin(phase));
      const leftKneeAngle = Math.max(0.04, Math.pow(leftSwing, 1.1) * 0.95 + leftPush * 0.4);

      const rightSwing = Math.max(0, Math.sin(phase + Math.PI));
      const rightPush = Math.max(0, -Math.cos(phase + Math.PI)) * Math.max(0, -Math.sin(phase + Math.PI));
      const rightKneeAngle = Math.max(0.04, Math.pow(rightSwing, 1.1) * 0.95 + rightPush * 0.4);

      if (leftKneeRef.current) leftKneeRef.current.rotation.x = leftKneeAngle;
      if (rightKneeRef.current) rightKneeRef.current.rotation.x = rightKneeAngle;

      // Ankle / Foot Pitch: Heel strike (dorsiflexion < 0) -> flat foot -> push-off roll (plantarflexion > 0)
      const leftFootRoll = -Math.sin(phase) * 0.2 + Math.cos(phase) * 0.12;
      const rightFootRoll = -Math.sin(phase + Math.PI) * 0.2 + Math.cos(phase + Math.PI) * 0.12;

      if (leftFootRef.current) leftFootRef.current.rotation.x = leftFootRoll;
      if (rightFootRef.current) rightFootRef.current.rotation.x = rightFootRoll;

      // 4. Arms Counter-Swing with Dynamic Elbow Flexion
      const armSwingRange = 0.38;
      if (leftShoulderRef.current) {
        leftShoulderRef.current.rotation.x = Math.sin(phase) * armSwingRange;
        leftShoulderRef.current.rotation.z = 0.08;
      }
      if (rightShoulderRef.current) {
        if (style.hasTablet) {
          rightShoulderRef.current.rotation.x = -0.6 + Math.sin(t * 1.5) * 0.05;
          rightShoulderRef.current.rotation.z = -0.15;
        } else {
          rightShoulderRef.current.rotation.x = -Math.sin(phase) * armSwingRange;
          rightShoulderRef.current.rotation.z = -0.08;
        }
      }

      if (leftElbowRef.current) {
        leftElbowRef.current.rotation.x = 0.2 + Math.max(0, Math.sin(phase) * 0.32);
      }
      if (rightElbowRef.current) {
        if (style.hasTablet) {
          rightElbowRef.current.rotation.x = 0.9;
        } else {
          rightElbowRef.current.rotation.x = 0.2 + Math.max(0, -Math.sin(phase) * 0.32);
        }
      }

      // 5. Head Stabilization & Micro-Gaze
      if (headRef.current) {
        headRef.current.rotation.y = THREE.MathUtils.damp(
          headRef.current.rotation.y,
          Math.sin(t * 0.8) * 0.08,
          4,
          delta
        );
        headRef.current.rotation.x = 0.02;
      }
    } else {
      // ── IDLE STANDING POSE ──
      if (pelvisRef.current) {
        pelvisRef.current.position.y = THREE.MathUtils.damp(
          pelvisRef.current.position.y,
          0.72 + Math.sin(t * 2.0) * 0.008,
          5,
          delta
        );
        pelvisRef.current.rotation.set(0, 0, 0);
      }

      if (torsoRef.current) torsoRef.current.rotation.set(0, 0, 0);
      if (leftHipRef.current) leftHipRef.current.rotation.x = THREE.MathUtils.damp(leftHipRef.current.rotation.x, 0, 6, delta);
      if (rightHipRef.current) rightHipRef.current.rotation.x = THREE.MathUtils.damp(rightHipRef.current.rotation.x, 0, 6, delta);
      if (leftKneeRef.current) leftKneeRef.current.rotation.x = THREE.MathUtils.damp(leftKneeRef.current.rotation.x, 0, 6, delta);
      if (rightKneeRef.current) rightKneeRef.current.rotation.x = THREE.MathUtils.damp(rightKneeRef.current.rotation.x, 0, 6, delta);
      if (leftFootRef.current) leftFootRef.current.rotation.x = THREE.MathUtils.damp(leftFootRef.current.rotation.x, 0, 6, delta);
      if (rightFootRef.current) rightFootRef.current.rotation.x = THREE.MathUtils.damp(rightFootRef.current.rotation.x, 0, 6, delta);

      if (leftShoulderRef.current) leftShoulderRef.current.rotation.x = 0.05;
      if (rightShoulderRef.current) rightShoulderRef.current.rotation.x = style.hasTablet ? -0.75 : 0.05;
      if (leftElbowRef.current) leftElbowRef.current.rotation.x = 0.15;
      if (rightElbowRef.current) rightElbowRef.current.rotation.x = style.hasTablet ? 1.0 : 0.15;

      if (headRef.current) {
        const lookCycle = Math.sin(t * 0.7);
        const targetHeadX = style.hasTablet ? (lookCycle > 0 ? 0.35 : 0.05) : Math.sin(t * 0.9) * 0.06;
        const targetHeadY = Math.sin(t * 0.5) * 0.3;
        headRef.current.rotation.x = THREE.MathUtils.damp(headRef.current.rotation.x, targetHeadX, 4, delta);
        headRef.current.rotation.y = THREE.MathUtils.damp(headRef.current.rotation.y, targetHeadY, 4, delta);
      }
    }
  });

  return (
    <group scale={[style.heightScale, style.heightScale, style.heightScale]}>
      {/* ── 1. PELVIS & LOWER BODY ── */}
      <group ref={pelvisRef} position={[0, 0.72, 0]}>
        {/* Belt & Waist */}
        <mesh position={[0, 0.04, 0]} castShadow>
          <boxGeometry args={[0.34, 0.12, 0.22]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.04, 0.115]}>
          <boxGeometry args={[0.06, 0.06, 0.02]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* ── LEFT HIP & LEG HIERARCHY ── */}
        <group ref={leftHipRef} position={[-0.1, -0.02, 0]}>
          <mesh position={[0, -0.16, 0]} castShadow>
            <cylinderGeometry args={[0.075, 0.065, 0.32, 10]} />
            <meshStandardMaterial color={style.pantsColor} roughness={0.65} />
          </mesh>
          <group ref={leftKneeRef} position={[0, -0.32, 0]}>
            <mesh position={[0, -0.16, 0]} castShadow>
              <cylinderGeometry args={[0.06, 0.05, 0.32, 10]} />
              <meshStandardMaterial color={style.pantsColor} roughness={0.65} />
            </mesh>
            <group ref={leftFootRef} position={[0, -0.32, 0.04]}>
              <mesh position={[0, 0.04, 0]} castShadow>
                <boxGeometry args={[0.11, 0.08, 0.22]} />
                <meshStandardMaterial color={style.shoesColor} roughness={0.5} />
              </mesh>
              <mesh position={[0, 0.01, 0]}>
                <boxGeometry args={[0.115, 0.03, 0.23]} />
                <meshStandardMaterial color="#f8fafc" roughness={0.9} />
              </mesh>
            </group>
          </group>
        </group>

        {/* ── RIGHT HIP & LEG HIERARCHY ── */}
        <group ref={rightHipRef} position={[0.1, -0.02, 0]}>
          <mesh position={[0, -0.16, 0]} castShadow>
            <cylinderGeometry args={[0.075, 0.065, 0.32, 10]} />
            <meshStandardMaterial color={style.pantsColor} roughness={0.65} />
          </mesh>
          <group ref={rightKneeRef} position={[0, -0.32, 0]}>
            <mesh position={[0, -0.16, 0]} castShadow>
              <cylinderGeometry args={[0.06, 0.05, 0.32, 10]} />
              <meshStandardMaterial color={style.pantsColor} roughness={0.65} />
            </mesh>
            <group ref={rightFootRef} position={[0, -0.32, 0.04]}>
              <mesh position={[0, 0.04, 0]} castShadow>
                <boxGeometry args={[0.11, 0.08, 0.22]} />
                <meshStandardMaterial color={style.shoesColor} roughness={0.5} />
              </mesh>
              <mesh position={[0, 0.01, 0]}>
                <boxGeometry args={[0.115, 0.03, 0.23]} />
                <meshStandardMaterial color="#f8fafc" roughness={0.9} />
              </mesh>
            </group>
          </group>
        </group>

        {/* ── 2. TORSO & CHEST ── */}
        <group ref={torsoRef} position={[0, 0.1, 0]}>
          <mesh position={[0, 0.2, 0]} castShadow>
            <boxGeometry args={[0.38, 0.4, 0.22]} />
            <meshStandardMaterial color={style.shirtColor} roughness={0.6} />
          </mesh>

          {style.accentColor && (
            <>
              <mesh position={[0, 0.24, 0.115]}>
                <boxGeometry args={[0.36, 0.04, 0.01]} />
                <meshStandardMaterial color={style.accentColor} roughness={0.3} metalness={0.5} />
              </mesh>
              <mesh position={[0, 0.12, 0.115]}>
                <boxGeometry args={[0.36, 0.04, 0.01]} />
                <meshStandardMaterial color={style.accentColor} roughness={0.3} metalness={0.5} />
              </mesh>
              <mesh position={[-0.12, 0.24, 0.115]}>
                <boxGeometry args={[0.04, 0.22, 0.01]} />
                <meshStandardMaterial color={style.accentColor} roughness={0.3} metalness={0.5} />
              </mesh>
              <mesh position={[0.12, 0.24, 0.115]}>
                <boxGeometry args={[0.04, 0.22, 0.01]} />
                <meshStandardMaterial color={style.accentColor} roughness={0.3} metalness={0.5} />
              </mesh>
            </>
          )}

          {style.hasBackpack && (
            <mesh position={[0, 0.2, -0.15]} castShadow>
              <boxGeometry args={[0.26, 0.32, 0.14]} />
              <meshStandardMaterial color="#1e293b" roughness={0.8} />
            </mesh>
          )}

          {/* ── LEFT ARM HIERARCHY ── */}
          <group ref={leftShoulderRef} position={[-0.22, 0.34, 0]}>
            <mesh position={[0, -0.12, 0]} castShadow>
              <cylinderGeometry args={[0.05, 0.045, 0.24, 8]} />
              <meshStandardMaterial color={style.shirtColor} roughness={0.6} />
            </mesh>
            <group ref={leftElbowRef} position={[0, -0.24, 0]}>
              <mesh position={[0, -0.1, 0]} castShadow>
                <cylinderGeometry args={[0.045, 0.04, 0.2, 8]} />
                <meshStandardMaterial color={style.skinTone} roughness={0.5} />
              </mesh>
              <mesh position={[0, -0.22, 0]} castShadow>
                <boxGeometry args={[0.06, 0.07, 0.05]} />
                <meshStandardMaterial color={style.skinTone} roughness={0.5} />
              </mesh>
            </group>
          </group>

          {/* ── RIGHT ARM HIERARCHY ── */}
          <group ref={rightShoulderRef} position={[0.22, 0.34, 0]}>
            <mesh position={[0, -0.12, 0]} castShadow>
              <cylinderGeometry args={[0.05, 0.045, 0.24, 8]} />
              <meshStandardMaterial color={style.shirtColor} roughness={0.6} />
            </mesh>
            <group ref={rightElbowRef} position={[0, -0.24, 0]}>
              <mesh position={[0, -0.1, 0]} castShadow>
                <cylinderGeometry args={[0.045, 0.04, 0.2, 8]} />
                <meshStandardMaterial color={style.skinTone} roughness={0.5} />
              </mesh>
              <mesh position={[0, -0.22, 0]} castShadow>
                <boxGeometry args={[0.06, 0.07, 0.05]} />
                <meshStandardMaterial color={style.skinTone} roughness={0.5} />
              </mesh>
              {style.hasTablet && (
                <group position={[0, -0.22, 0.08]} rotation={[Math.PI / 4, 0, 0]}>
                  <mesh castShadow>
                    <boxGeometry args={[0.18, 0.24, 0.015]} />
                    <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.6} />
                  </mesh>
                  <mesh position={[0, 0, 0.01]}>
                    <planeGeometry args={[0.15, 0.2]} />
                    <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.8} />
                  </mesh>
                </group>
              )}
            </group>
          </group>

          {/* ── 3. NECK, HEAD & FACIAL FEATURES ── */}
          <group position={[0, 0.42, 0]}>
            <mesh position={[0, 0.04, 0]}>
              <cylinderGeometry args={[0.065, 0.075, 0.1, 10]} />
              <meshStandardMaterial color={style.skinTone} roughness={0.5} />
            </mesh>

            <group ref={headRef} position={[0, 0.16, 0]}>
              {/* Cranium */}
              <mesh position={[0, 0, 0]} castShadow>
                <boxGeometry args={[0.2, 0.22, 0.2]} />
                <meshStandardMaterial color={style.skinTone} roughness={0.45} />
              </mesh>

              {/* Ears */}
              <mesh position={[-0.108, 0.01, -0.01]}>
                <boxGeometry args={[0.02, 0.05, 0.04]} />
                <meshStandardMaterial color={style.skinTone} roughness={0.5} />
              </mesh>
              <mesh position={[0.108, 0.01, -0.01]}>
                <boxGeometry args={[0.02, 0.05, 0.04]} />
                <meshStandardMaterial color={style.skinTone} roughness={0.5} />
              </mesh>

              {/* Left & Right Eyes */}
              <group position={[-0.05, 0.03, 0.102]}>
                <mesh>
                  <planeGeometry args={[0.035, 0.028]} />
                  <meshBasicMaterial color="#ffffff" />
                </mesh>
                <mesh position={[0, 0, 0.002]}>
                  <planeGeometry args={[0.018, 0.022]} />
                  <meshBasicMaterial color="#0f172a" />
                </mesh>
              </group>
              <group position={[0.05, 0.03, 0.102]}>
                <mesh>
                  <planeGeometry args={[0.035, 0.028]} />
                  <meshBasicMaterial color="#ffffff" />
                </mesh>
                <mesh position={[0, 0, 0.002]}>
                  <planeGeometry args={[0.018, 0.022]} />
                  <meshBasicMaterial color="#0f172a" />
                </mesh>
              </group>

              {/* Eyebrows */}
              <mesh position={[-0.05, 0.062, 0.104]}>
                <boxGeometry args={[0.045, 0.012, 0.008]} />
                <meshBasicMaterial color={style.hairColor} />
              </mesh>
              <mesh position={[0.05, 0.062, 0.104]}>
                <boxGeometry args={[0.045, 0.012, 0.008]} />
                <meshBasicMaterial color={style.hairColor} />
              </mesh>

              {/* Nose */}
              <mesh position={[0, 0.005, 0.112]} castShadow>
                <boxGeometry args={[0.032, 0.045, 0.03]} />
                <meshStandardMaterial color={style.skinTone} roughness={0.5} />
              </mesh>

              {/* Mouth */}
              <mesh position={[0, -0.045, 0.102]}>
                <boxGeometry args={[0.055, 0.012, 0.005]} />
                <meshBasicMaterial color="#be123c" />
              </mesh>

              {/* Glasses */}
              {style.hasGlasses && (
                <group position={[0, 0.03, 0.11]}>
                  <mesh position={[-0.05, 0, 0]}>
                    <ringGeometry args={[0.02, 0.028, 12]} />
                    <meshStandardMaterial color="#0f172a" metalness={0.8} />
                  </mesh>
                  <mesh position={[0.05, 0, 0]}>
                    <ringGeometry args={[0.02, 0.028, 12]} />
                    <meshStandardMaterial color="#0f172a" metalness={0.8} />
                  </mesh>
                  <mesh position={[0, 0, 0]}>
                    <boxGeometry args={[0.04, 0.008, 0.008]} />
                    <meshStandardMaterial color="#0f172a" metalness={0.8} />
                  </mesh>
                </group>
              )}

              {/* Headwear */}
              {style.hasHardHat ? (
                <group position={[0, 0.09, 0]}>
                  <mesh castShadow>
                    <cylinderGeometry args={[0.13, 0.14, 0.09, 14]} />
                    <meshStandardMaterial color="#facc15" roughness={0.3} metalness={0.2} />
                  </mesh>
                  <mesh position={[0, -0.03, 0.08]} rotation={[-0.1, 0, 0]}>
                    <boxGeometry args={[0.2, 0.02, 0.08]} />
                    <meshStandardMaterial color="#facc15" roughness={0.3} />
                  </mesh>
                </group>
              ) : style.hairStyle === 'bun' ? (
                <group position={[0, 0.06, 0]}>
                  <mesh position={[0, 0.04, -0.02]} castShadow>
                    <boxGeometry args={[0.21, 0.1, 0.21]} />
                    <meshStandardMaterial color={style.hairColor} roughness={0.7} />
                  </mesh>
                  <mesh position={[0, 0.08, -0.1]}>
                    <sphereGeometry args={[0.06, 10, 10]} />
                    <meshStandardMaterial color={style.hairColor} roughness={0.7} />
                  </mesh>
                </group>
              ) : (
                <mesh position={[0, 0.08, -0.01]} castShadow>
                  <boxGeometry args={[0.21, 0.09, 0.22]} />
                  <meshStandardMaterial color={style.hairColor} roughness={0.7} />
                </mesh>
              )}
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

// ── PEDESTRIAN NAVIGATOR & CROWD CONTROLLER ──
export function CityPedestrians3D() {
  // Carefully planned district-specific routes (linear, purpose-driven, zero circular clustering)
  const pedestrians = useMemo(() => [
    // 1. City Worker (Lead Surveyor): Inspects West commercial building site & Cafe bistro lot
    {
      id: 'worker-1',
      role: 'city_worker' as CharacterRole,
      route: [
        [-9.5, 0, 1.8],
        [-13.5, 0, 0.5],
        [-15.5, 0, -3.5],
        [-12.5, 0, -6.5],
        [-9.5, 0, -4.5],
        [-9.5, 0, -1.0],
      ],
      speed: 0.95,
      currentWp: 0,
      pos: new THREE.Vector3(-9.5, 0.03, 1.8),
      lastPos: new THREE.Vector3(-9.5, 0.03, 1.8),
      stuckTimer: 0,
      yaw: -Math.PI / 2,
      walkPhase: 0,
      isWalking: true,
      state: 'WALKING',
      stateTimer: 0,
    },
    // 2. Weather Scientist (Lead Climatologist): Walks along North Weather Observatory Terrace
    {
      id: 'scientist-1',
      role: 'weather_scientist' as CharacterRole,
      route: [
        [-10.0, 0, -9.5],
        [-15.0, 0, -11.5],
        [-18.0, 0, -14.5],
        [-13.0, 0, -16.2],
        [-8.5, 0, -12.0],
      ],
      speed: 0.9,
      currentWp: 0,
      pos: new THREE.Vector3(-10.0, 0.03, -9.5),
      lastPos: new THREE.Vector3(-10.0, 0.03, -9.5),
      stuckTimer: 0,
      yaw: -Math.PI / 2,
      walkPhase: 1.2,
      isWalking: true,
      state: 'WALKING',
      stateTimer: 0,
    },
    // 3. Train Passenger (Commuter): Commutes from South plaza across East crosswalk to train station platform
    {
      id: 'passenger-1',
      role: 'train_passenger' as CharacterRole,
      route: [
        [7.0, 0, 8.2],   // South sidewalk curb (Crosswalk East)
        [7.0, 0, 2.6],   // Crosses road to North sidewalk
        [8.5, 0, -3.5],  // Transit concourse
        [7.5, 0, -9.5],  // Station access ramp
        [7.5, 0, -13.5], // Train boarding platform
        [9.5, 0, -13.5], // Platform waiting bench
        [8.5, 0, -3.5],  // Returns
        [7.0, 0, 2.6],
      ],
      speed: 1.1,
      currentWp: 0,
      pos: new THREE.Vector3(7.0, 0.03, 8.2),
      lastPos: new THREE.Vector3(7.0, 0.03, 8.2),
      stuckTimer: 0,
      yaw: -Math.PI,
      walkPhase: 2.5,
      isWalking: true,
      state: 'WALKING',
      stateTimer: 0,
    },
    // 4. Park Visitor 1 (Nature Enthusiast): Strolls along South botanical garden promenade around fountain
    {
      id: 'visitor-1',
      role: 'park_visitor' as CharacterRole,
      route: [
        [-5.5, 0, 9.5],
        [-3.2, 0, 11.0],
        [0, 0, 13.8],
        [3.2, 0, 11.0],
        [5.5, 0, 9.5],
        [2.0, 0, 9.0],
        [-2.0, 0, 9.0],
      ],
      speed: 0.85,
      currentWp: 0,
      pos: new THREE.Vector3(-5.5, 0.03, 9.5),
      lastPos: new THREE.Vector3(-5.5, 0.03, 9.5),
      stuckTimer: 0,
      yaw: Math.PI / 2,
      walkPhase: 0.8,
      isWalking: true,
      state: 'WALKING',
      stateTimer: 0,
    },
    // 5. Traffic Officer: Manages West Boulevard Crosswalk & safety signals
    {
      id: 'officer-1',
      role: 'traffic_officer' as CharacterRole,
      route: [
        [-7.0, 0, 2.6], // North sidewalk curb (Crosswalk West)
        [-7.0, 0, 5.5], // Center road median
        [-7.0, 0, 8.2], // South sidewalk curb
        [-7.0, 0, 5.5], // Back to median
      ],
      speed: 0.8,
      currentWp: 0,
      pos: new THREE.Vector3(-7.0, 0.03, 2.6),
      lastPos: new THREE.Vector3(-7.0, 0.03, 2.6),
      stuckTimer: 0,
      yaw: 0,
      walkPhase: 1.9,
      isWalking: true,
      state: 'WALKING',
      stateTimer: 0,
    },
    // 6. Systems Engineer: Patrols East Power Substation & Hydro Conduits
    {
      id: 'engineer-1',
      role: 'systems_engineer' as CharacterRole,
      route: [
        [10.5, 0, 1.8],
        [15.5, 0, 0.0],
        [17.5, 0, -5.5],
        [13.5, 0, -9.0],
        [9.5, 0, -5.0],
        [10.5, 0, -1.0],
      ],
      speed: 0.95,
      currentWp: 0,
      pos: new THREE.Vector3(10.5, 0.03, 1.8),
      lastPos: new THREE.Vector3(10.5, 0.03, 1.8),
      stuckTimer: 0,
      yaw: Math.PI / 2,
      walkPhase: 3.1,
      isWalking: true,
      state: 'WALKING',
      stateTimer: 0,
    },
    // 7. Park Botanist (Botanical Caretaker): Strolls around Grand Fountain floral terrace
    {
      id: 'botanist-1',
      role: 'weather_scientist' as CharacterRole,
      route: [
        [-3.2, 0, 11.0],
        [-1.5, 0, 13.5],
        [1.5, 0, 13.5],
        [3.2, 0, 11.0],
        [1.5, 0, 9.2],
        [-1.5, 0, 9.2],
      ],
      speed: 0.85,
      currentWp: 0,
      pos: new THREE.Vector3(-3.2, 0.03, 11.0),
      lastPos: new THREE.Vector3(-3.2, 0.03, 11.0),
      stuckTimer: 0,
      yaw: Math.PI / 2,
      walkPhase: 0.4,
      isWalking: true,
      state: 'WALKING',
      stateTimer: 0,
    },
  ], []);

  // Bench Sitters: Set to empty so no character is static or motionless
  const benchSitters = useMemo(() => [] as { id: string; role: CharacterRole; pos: [number, number, number]; rotY: number }[], []);

  const gamePhase = useGraphworksStore((s) => s.gamePhase);
  const cityStage = useGraphworksStore((s) => s.cityStage);
  const winningBlueprint = useGraphworksStore((s) => s.winningBlueprint);
  const isVictory = gamePhase === 'victory';

  const agentsRef = useRef<(THREE.Group | null)[]>([]);

  useFrame((state, delta) => {
    pedestrians.forEach((ped, idx) => {
      const group = agentsRef.current[idx];
      if (!group) return;

      // ── CELEBRATION ASSEMBLY IN CIVIC PLAZA ──
      if (isVictory) {
        // Assemble in a semicircle around Data Tower base facing the winner
        const angle = (idx / pedestrians.length) * Math.PI * 2;
        const radius = 3.6 + (idx % 2) * 0.4;
        const targetX = Math.cos(angle) * radius;
        const targetZ = Math.sin(angle) * radius;

        ped.pos.x = THREE.MathUtils.damp(ped.pos.x, targetX, 2.5, delta);
        ped.pos.z = THREE.MathUtils.damp(ped.pos.z, targetZ, 2.5, delta);
        ped.pos.y = 0.03;

        // Face towards winning studio
        let faceTargetX = 0;
        let faceTargetZ = 12;
        if (winningBlueprint === 'blue') {
          faceTargetX = -15; // Face left toward Blue studio
          faceTargetZ = 8;
        } else if (winningBlueprint === 'red') {
          faceTargetX = 15; // Face right toward Red studio
          faceTargetZ = 8;
        }
        const dirToWinner = new THREE.Vector2(faceTargetX - ped.pos.x, faceTargetZ - ped.pos.z).normalize();
        const targetYaw = Math.atan2(dirToWinner.x, dirToWinner.y);
        ped.yaw = THREE.MathUtils.damp(ped.yaw, targetYaw, 4.0, delta);
        ped.isWalking = false;

        group.position.copy(ped.pos);
        group.rotation.y = ped.yaw;
        return;
      }

      const targetArr = ped.route[ped.currentWp];
      const targetVec = new THREE.Vector3(targetArr[0], targetArr[1], targetArr[2]);
      const dist = ped.pos.distanceTo(targetVec);

      // Advance waypoint upon arrival (generous 0.55m threshold)
      if (dist < 0.65) {
        ped.currentWp = (ped.currentWp + 1) % ped.route.length;
        if (Math.random() < 0.08) {
          ped.isWalking = false;
          ped.state = 'IDLE';
          ped.stateTimer = 1.5 + Math.random() * 1.5;
        }
      }

      // ── SMART STUCK PREVENTION & AUTO-RECOVERY ENGINE ──
      if (ped.isWalking) {
        const movedDist = ped.pos.distanceTo(ped.lastPos);
        if (movedDist < 0.015) {
          ped.stuckTimer += delta;
          if (ped.stuckTimer > 0.5) {
            // Unstuck recovery: advance waypoint and give gentle lateral escape nudge
            ped.currentWp = (ped.currentWp + 1) % ped.route.length;
            ped.stuckTimer = 0;
            const outward = new THREE.Vector2(ped.pos.x, ped.pos.z).normalize();
            ped.pos.x += outward.x * 0.25;
            ped.pos.z += outward.y * 0.25;
          }
        } else {
          ped.stuckTimer = 0;
          ped.lastPos.copy(ped.pos);
        }
      }

      // ── 1. STRICT VEHICLE & ROAD CROSSING SAFETY PHYSICS ──
      const curRadius = Math.hypot(ped.pos.x, ped.pos.z);
      const targetRadius = Math.hypot(targetVec.x, targetVec.z);
      const isTargetAcrossRoad =
        (curRadius < 6.8 && targetRadius > 10.2) ||
        (curRadius > 10.2 && targetRadius < 6.8);

      const atInnerCurb = curRadius >= 6.3 && curRadius <= 6.9;
      const atOuterCurb = curRadius >= 10.1 && curRadius <= 10.7;

      if (isTargetAcrossRoad && (atInnerCurb || atOuterCurb)) {
        const safeToCross = cityTraffic.isRoadSafeToCross(ped.pos.x, ped.pos.z);
        if (!safeToCross) {
          ped.isWalking = false;
          ped.state = 'WAITING_TRAFFIC';
        } else {
          ped.isWalking = true;
          ped.state = 'WALKING';
        }
      }

      const onRoadway = curRadius >= 6.8 && curRadius <= 10.2;
      if (onRoadway) {
        cityTraffic.updatePedestrian(ped.id, ped.pos.x, ped.pos.z);
      }


      if (ped.state === 'IDLE') {
        ped.stateTimer -= delta;
        if (ped.stateTimer <= 0) {
          ped.state = 'WALKING';
          ped.isWalking = true;
        }
      }

      if (ped.isWalking) {
        const dir = new THREE.Vector3().subVectors(targetVec, ped.pos).normalize();

        // ── 2. CROWD PHYSICS: Separation from other pedestrians ──
        pedestrians.forEach((otherPed, otherIdx) => {
          if (idx === otherIdx) return;
          const separationDist = ped.pos.distanceTo(otherPed.pos);
          if (separationDist < 0.7 && separationDist > 0.01) {
            const pushDir = new THREE.Vector3().subVectors(ped.pos, otherPed.pos).normalize();
            dir.addScaledVector(pushDir, 0.4 / separationDist);
          }
        });
        dir.normalize();

        const targetAngle = Math.atan2(dir.x, dir.z);
        // Natural exponential heading damping (learn from Chocolate Factory kinematics)
        let diff = (targetAngle - ped.yaw) % (Math.PI * 2);
        if (diff < -Math.PI) diff += Math.PI * 2;
        if (diff > Math.PI) diff -= Math.PI * 2;
        ped.yaw += diff * (1 - Math.exp(-9 * delta));

        // Advance position in facing direction
        const moveDist = ped.speed * delta;
        ped.pos.x += Math.sin(ped.yaw) * moveDist;
        ped.pos.z += Math.cos(ped.yaw) * moveDist;
        ped.pos.y = 0.03; // Ground clamp

        // Advance walk cycle frequency locked to travel speed
        ped.walkPhase += moveDist * 6.0;
      }

      // ── 3. HARD OBSTACLE COLLISION BOUNDARIES WITH TANGENTIAL DEFLECTION ──
      CIRCULAR_OBSTACLES.forEach((obs) => {
        const dx = ped.pos.x - obs.x;
        const dz = ped.pos.z - obs.z;
        const dist = Math.hypot(dx, dz);
        const minDist = obs.radius + 0.35;
        if (dist < minDist && dist > 0.001) {
          const overlap = minDist - dist;
          ped.pos.x += (dx / dist) * overlap;
          ped.pos.z += (dz / dist) * overlap;

          // Tangential sliding deflection: guide character smoothly around obstacle!
          const tangentAngle = Math.atan2(-dz, dx);
          ped.yaw = THREE.MathUtils.damp(ped.yaw, tangentAngle, 6, delta);
        }
      });

      // Box Obstacles (Skyscrapers, district buildings, benches)
      BOX_OBSTACLES.forEach((box) => {
        const pad = 0.35;
        if (
          ped.pos.x >= box.minX - pad &&
          ped.pos.x <= box.maxX + pad &&
          ped.pos.z >= box.minZ - pad &&
          ped.pos.z <= box.maxZ + pad
        ) {
          const dLeft = Math.abs(ped.pos.x - (box.minX - pad));
          const dRight = Math.abs(ped.pos.x - (box.maxX + pad));
          const dFront = Math.abs(ped.pos.z - (box.minZ - pad));
          const dBack = Math.abs(ped.pos.z - (box.maxZ + pad));
          const minOverlap = Math.min(dLeft, dRight, dFront, dBack);

          if (minOverlap === dLeft) ped.pos.x = box.minX - pad;
          else if (minOverlap === dRight) ped.pos.x = box.maxX + pad;
          else if (minOverlap === dFront) ped.pos.z = box.minZ - pad;
          else ped.pos.z = box.maxZ + pad;
        }
      });

      // Update Three.js Transform
      group.position.copy(ped.pos);
      group.rotation.y = ped.yaw;
    });
  });

  return (
    <group>
      {/* ── 1. ACTIVE PATH-NAVIGATING CITIZENS ── */}
      {pedestrians.map((ped, idx) => {
        // Stage 0-2: Only 2 construction workers patrol the site
        // Stage 3+: Citizens enter the city
        // Victory: All citizens assemble and celebrate
        const isVisible = isVictory || (cityStage >= 3) || (idx < 2);
        const celebrationStyle: 'clap' | 'wave' | 'cheer' =
          idx % 3 === 0 ? 'clap' : idx % 3 === 1 ? 'wave' : 'cheer';

        return (
          <group
            key={ped.id}
            ref={(el) => {
              agentsRef.current[idx] = el;
            }}
            position={ped.pos}
            rotation={[0, ped.yaw, 0]}
            visible={isVisible}
          >
            <StylizedHumanRig
              role={ped.role}
              isWalking={isVictory ? false : ped.isWalking}
              walkPhase={ped.walkPhase}
              walkSpeed={ped.speed}
              isWaitingTraffic={ped.state === 'WAITING_TRAFFIC'}
              isCelebrating={isVictory}
              celebrationStyle={celebrationStyle}
              celebrationVariant={idx}
            />
          </group>
        );
      })}

      {/* ── 2. SEATED PARK BENCH CITIZENS ── */}
      {benchSitters.map((sitter, idx) => {
        // Bench sitters appear from Stage 3 onwards
        const isSitterVisible = isVictory || (cityStage >= 3);

        return (
          <group
            key={sitter.id}
            position={sitter.pos}
            rotation={[0, sitter.rotY, 0]}
            visible={isSitterVisible}
          >
            <StylizedHumanRig
              role={sitter.role}
              isWalking={false}
              walkPhase={0}
              walkSpeed={0}
              isSitting={!isVictory}
              isCelebrating={isVictory}
              celebrationStyle="cheer"
              celebrationVariant={idx + 5}
            />
          </group>
        );
      })}
    </group>
  );
}
