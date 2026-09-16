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
  // Central Data Tower base & fountain
  { x: 0, z: 0, radius: 2.8, name: 'tower_base' },
  // Park central fountain
  { x: 0, z: 11, radius: 2.1, name: 'park_fountain' },
  // Plaza flowerbeds
  { x: 3.25, z: 3.25, radius: 1.3, name: 'flowerbed_1' },
  { x: -3.25, z: 3.25, radius: 1.3, name: 'flowerbed_2' },
  { x: 3.25, z: -3.25, radius: 1.3, name: 'flowerbed_3' },
  { x: -3.25, z: -3.25, radius: 1.3, name: 'flowerbed_4' },
  // Boulevard streetlamps & poles (Z = 3.0)
  { x: -26, z: 3.0, radius: 0.45, name: 'lamp_1' },
  { x: -18, z: 3.0, radius: 0.45, name: 'lamp_2' },
  { x: -10, z: 3.0, radius: 0.45, name: 'lamp_3' },
  { x: 0, z: 3.0, radius: 0.45, name: 'lamp_4' },
  { x: 10, z: 3.0, radius: 0.45, name: 'lamp_5' },
  { x: 18, z: 3.0, radius: 0.45, name: 'lamp_6' },
  { x: 26, z: 3.0, radius: 0.45, name: 'lamp_7' },
  // Traffic signal poles
  { x: -8.5, z: 3.1, radius: 0.45, name: 'traffic_pole_1' },
  { x: 8.5, z: 3.1, radius: 0.45, name: 'traffic_pole_2' },
  // Tree trunks
  { x: -7.2, z: 9.5, radius: 0.5, name: 'tree_1' },
  { x: 7.2, z: 9.5, radius: 0.5, name: 'tree_2' },
  { x: -6.8, z: 12.8, radius: 0.5, name: 'tree_3' },
  { x: 6.8, z: 12.8, radius: 0.5, name: 'tree_4' },
  { x: -4.2, z: 14.2, radius: 0.5, name: 'tree_5' },
  { x: 4.2, z: 14.2, radius: 0.5, name: 'tree_6' },
  { x: -12.0, z: 8.2, radius: 0.5, name: 'tree_7' },
  { x: -16.0, z: 8.2, radius: 0.5, name: 'tree_8' },
  { x: 12.0, z: 8.2, radius: 0.5, name: 'tree_9' },
  { x: 16.0, z: 8.2, radius: 0.5, name: 'tree_10' },
];

const BOX_OBSTACLES = [
  // Commercial Skyscrapers (Footprints)
  { minX: -8.5, maxX: -4.5, minZ: -10.0, maxZ: -6.0, name: 'bldg_left_1' },
  { minX: -12.2, maxX: -8.8, minZ: -6.8, maxZ: -3.2, name: 'bldg_left_2' },
  { minX: 4.5, maxX: 8.5, minZ: -10.0, maxZ: -6.0, name: 'bldg_right_1' },
  { minX: 8.8, maxX: 12.2, minZ: -6.8, maxZ: -3.2, name: 'bldg_right_2' },
  // Park Benches
  { minX: -4.3, maxX: -2.7, minZ: 11.8, maxZ: 12.6, name: 'bench_left' },
  { minX: 2.7, maxX: 4.3, minZ: 11.8, maxZ: 12.6, name: 'bench_right' },
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
}

export function StylizedHumanRig({
  role,
  isWalking,
  walkPhase,
  walkSpeed,
  isSitting = false,
  isWaitingTraffic = false,
  customStyle,
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
      // ── ACTIVE DYNAMIC WALK CYCLE ──
      const strideAngle = 0.52;
      const phase = walkPhase;

      // 1. Pelvis dynamics: vertical bob and lateral sway
      if (pelvisRef.current) {
        const bob = Math.abs(Math.sin(phase)) * 0.04;
        pelvisRef.current.position.y = 0.72 + bob;
        pelvisRef.current.rotation.y = Math.sin(phase) * 0.07;
        pelvisRef.current.rotation.z = Math.cos(phase) * 0.035;
      }

      // 2. Torso counter-rotates slightly
      if (torsoRef.current) {
        torsoRef.current.rotation.y = -Math.sin(phase) * 0.08;
        torsoRef.current.rotation.x = 0.03;
      }

      // 3. Legs: alternating hip swing and knee flexion
      const leftLegForward = Math.sin(phase);
      const rightLegForward = Math.sin(phase + Math.PI);

      if (leftHipRef.current) leftHipRef.current.rotation.x = leftLegForward * strideAngle;
      if (rightHipRef.current) rightHipRef.current.rotation.x = rightLegForward * strideAngle;

      if (leftKneeRef.current) {
        const leftKneeBend = Math.max(0, -leftLegForward * 0.85);
        leftKneeRef.current.rotation.x = leftKneeBend;
      }
      if (rightKneeRef.current) {
        const rightKneeBend = Math.max(0, -rightLegForward * 0.85);
        rightKneeRef.current.rotation.x = rightKneeBend;
      }

      if (leftFootRef.current) leftFootRef.current.rotation.x = -Math.sin(phase) * 0.18;
      if (rightFootRef.current) rightFootRef.current.rotation.x = -Math.sin(phase + Math.PI) * 0.18;

      // 4. Arms: swing opposite to legs
      const armSwingAngle = 0.42;
      if (leftShoulderRef.current) {
        leftShoulderRef.current.rotation.x = -leftLegForward * armSwingAngle;
        leftShoulderRef.current.rotation.z = 0.08;
      }
      if (rightShoulderRef.current) {
        if (style.hasTablet) {
          rightShoulderRef.current.rotation.x = -0.6 + Math.sin(t * 1.5) * 0.05;
          rightShoulderRef.current.rotation.z = -0.15;
        } else {
          rightShoulderRef.current.rotation.x = -rightLegForward * armSwingAngle;
          rightShoulderRef.current.rotation.z = -0.08;
        }
      }

      if (leftElbowRef.current) {
        leftElbowRef.current.rotation.x = 0.25 + Math.max(0, -leftLegForward * 0.4);
      }
      if (rightElbowRef.current) {
        if (style.hasTablet) {
          rightElbowRef.current.rotation.x = 0.9;
        } else {
          rightElbowRef.current.rotation.x = 0.25 + Math.max(0, -rightLegForward * 0.4);
        }
      }

      // 5. Head stays relatively stable
      if (headRef.current) {
        headRef.current.rotation.y = THREE.MathUtils.damp(
          headRef.current.rotation.y,
          Math.sin(t * 0.8) * 0.1,
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
  // Carefully planned routes that stay strictly on sidewalks and paths
  const pedestrians = useMemo(() => [
    // 1. City Worker: Inspecting central civic plaza walkway
    {
      id: 'worker-1',
      role: 'city_worker' as CharacterRole,
      route: [
        [-2.0, 0, 3.8],
        [2.0, 0, 3.8],
        [3.8, 0, 2.0],
        [3.8, 0, -2.0],
        [-3.8, 0, -2.0],
        [-3.8, 0, 2.0],
      ],
      speed: 1.05,
      currentWp: 0,
      pos: new THREE.Vector3(-2.0, 0, 3.8),
      yaw: 0,
      walkPhase: 0,
      isWalking: true,
      state: 'WALKING',
      stateTimer: 0,
    },
    // 2. Weather Scientist: Walking along South park trail
    {
      id: 'scientist-1',
      role: 'weather_scientist' as CharacterRole,
      route: [
        [-5.2, 0, 9.5],
        [-2.5, 0, 9.8],
        [-1.6, 0, 12.8],
        [-5.2, 0, 12.0],
      ],
      speed: 0.95,
      currentWp: 0,
      pos: new THREE.Vector3(-5.2, 0, 9.5),
      yaw: 0,
      walkPhase: 1.2,
      isWalking: true,
      state: 'WALKING',
      stateTimer: 0,
    },
    // 3. Train Passenger: Commuting via East Zebra Crosswalk (X = 5.0)
    {
      id: 'passenger-1',
      role: 'train_passenger' as CharacterRole,
      route: [
        [5.0, 0, 8.2], // South sidewalk curb waiting point
        [5.0, 0, 2.8], // Crosses zebra crossing to North sidewalk
        [7.2, 0, 2.6], // North promenade
        [5.0, 0, 2.8], // North sidewalk curb waiting point
        [5.0, 0, 8.2], // Crosses zebra crossing back to South sidewalk
      ],
      speed: 1.25,
      currentWp: 0,
      pos: new THREE.Vector3(5.0, 0, 8.2),
      yaw: 0,
      walkPhase: 2.5,
      isWalking: true,
      state: 'WALKING',
      stateTimer: 0,
    },
    // 4. Park Visitor 1: Strolling along park promenade loop
    {
      id: 'visitor-1',
      role: 'park_visitor' as CharacterRole,
      route: [
        [-2.5, 0, 13.5],
        [0.0, 0, 13.8],
        [2.5, 0, 13.5],
        [1.2, 0, 10.2],
        [-1.2, 0, 10.2],
      ],
      speed: 0.92,
      currentWp: 0,
      pos: new THREE.Vector3(-2.5, 0, 13.5),
      yaw: 0,
      walkPhase: 0.8,
      isWalking: true,
      state: 'WALKING',
      stateTimer: 0,
    },
    // 5. Traffic Officer: Supervising West Zebra Crosswalk (X = -5.0)
    {
      id: 'officer-1',
      role: 'traffic_officer' as CharacterRole,
      route: [
        [-5.0, 0, 2.8], // North sidewalk curb
        [-5.0, 0, 8.2], // South sidewalk curb
        [-5.0, 0, 2.8],
      ],
      speed: 0.85,
      currentWp: 0,
      pos: new THREE.Vector3(-5.0, 0, 2.8),
      yaw: 0,
      walkPhase: 1.9,
      isWalking: true,
      state: 'WALKING',
      stateTimer: 0,
    },
    // 6. Systems Engineer: Calibrating Data Tower along North concourse
    {
      id: 'engineer-1',
      role: 'systems_engineer' as CharacterRole,
      route: [
        [2.2, 0, 3.8],
        [1.5, 0, 2.2],
        [-1.5, 0, 2.2],
        [-2.2, 0, 3.8],
      ],
      speed: 1.0,
      currentWp: 0,
      pos: new THREE.Vector3(2.2, 0, 3.8),
      yaw: 0,
      walkPhase: 3.1,
      isWalking: true,
      state: 'WALKING',
      stateTimer: 0,
    },
  ], []);

  // Bench Sitters: Peaceful citizens enjoying park fountain
  const benchSitters = useMemo(() => [
    {
      id: 'sitter-left',
      role: 'park_visitor' as CharacterRole,
      pos: [-3.5, 0.05, 12.2] as [number, number, number],
      rotY: 0,
    },
    {
      id: 'sitter-right',
      role: 'weather_scientist' as CharacterRole,
      pos: [3.5, 0.05, 12.2] as [number, number, number],
      rotY: 0,
    },
  ], []);

  const agentsRef = useRef<(THREE.Group | null)[]>([]);

  useFrame((state, delta) => {
    pedestrians.forEach((ped, idx) => {
      const group = agentsRef.current[idx];
      if (!group) return;

      const targetArr = ped.route[ped.currentWp];
      const targetVec = new THREE.Vector3(targetArr[0], targetArr[1], targetArr[2]);
      const dist = ped.pos.distanceTo(targetVec);

      // Advance waypoint upon arrival
      if (dist < 0.35) {
        ped.currentWp = (ped.currentWp + 1) % ped.route.length;
        if (Math.random() < 0.2) {
          ped.isWalking = false;
          ped.state = 'IDLE';
          ped.stateTimer = 1.8;
        }
      }

      // ── 1. STRICT VEHICLE & ROAD CROSSING SAFETY PHYSICS ──
      // Determine if next leg crosses the road avenue (Z between 3.5 and 7.5)
      const isTargetAcrossRoad =
        (ped.pos.z < 3.5 && targetVec.z > 5.5) ||
        (ped.pos.z > 7.5 && targetVec.z < 5.5);

      // If approaching road curb holding zone
      const atNorthCurb = ped.pos.z >= 2.6 && ped.pos.z <= 3.4;
      const atSouthCurb = ped.pos.z >= 7.6 && ped.pos.z <= 8.4;
      const isNearCrosswalk = Math.abs(ped.pos.x - (-5.0)) < 1.2 || Math.abs(ped.pos.x - 5.0) < 1.2;

      if (isTargetAcrossRoad && isNearCrosswalk && (atNorthCurb || atSouthCurb)) {
        // Pedestrian is at the curb ready to cross: verify highway traffic clearance
        const safeToCross = cityTraffic.isRoadSafeToCross(ped.pos.x);
        if (!safeToCross) {
          // Cars are approaching or moving! HALT at curb, DO NOT STEP ONTO ROAD!
          ped.isWalking = false;
          ped.state = 'WAITING_TRAFFIC';
        } else {
          // Highway is clear or vehicles are stopped at zebra line: safe to cross!
          ped.isWalking = true;
          ped.state = 'WALKING';
        }
      }

      // If actively crossing the road, register with coordinator so vehicles stop!
      const onRoadway = ped.pos.z >= 3.5 && ped.pos.z <= 7.5;
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
          if (separationDist < 0.85 && separationDist > 0.01) {
            const pushDir = new THREE.Vector3().subVectors(ped.pos, otherPed.pos).normalize();
            dir.addScaledVector(pushDir, 0.7 / separationDist);
          }
        });
        dir.normalize();

        const targetAngle = Math.atan2(dir.x, dir.z);
        ped.yaw = THREE.MathUtils.damp(ped.yaw, targetAngle, 8, delta);

        // Advance position
        const moveDist = ped.speed * delta;
        ped.pos.x += Math.sin(ped.yaw) * moveDist;
        ped.pos.z += Math.cos(ped.yaw) * moveDist;
        ped.pos.y = 0.03; // Ground clamp

        // Advance walk cycle frequency locked to travel speed (no sliding!)
        ped.walkPhase += moveDist * 5.2;
      }

      // ── 3. HARD OBSTACLE COLLISION BOUNDARIES (POLES, BUILDINGS, TREES, FOUNTAINS) ──
      // A. Circular Obstacles (Streetlamps, signal poles, trees, fountains, tower base)
      CIRCULAR_OBSTACLES.forEach((obs) => {
        const dx = ped.pos.x - obs.x;
        const dz = ped.pos.z - obs.z;
        const dist = Math.hypot(dx, dz);
        const minDist = obs.radius + 0.35;
        if (dist < minDist && dist > 0.001) {
          const overlap = minDist - dist;
          ped.pos.x += (dx / dist) * overlap;
          ped.pos.z += (dz / dist) * overlap;
        }
      });

      // B. Box Obstacles (Skyscrapers, district buildings, benches)
      BOX_OBSTACLES.forEach((box) => {
        const pad = 0.35;
        if (
          ped.pos.x >= box.minX - pad &&
          ped.pos.x <= box.maxX + pad &&
          ped.pos.z >= box.minZ - pad &&
          ped.pos.z <= box.maxZ + pad
        ) {
          // Push out along the closest face
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

  const blueVisitors = useGraphworksStore((s) => s.blueCity.park.visitorCount);
  const redVisitors = useGraphworksStore((s) => s.redCity.park.visitorCount);
  const activeVisitors = Math.max(blueVisitors, redVisitors);

  // Dynamic crowd density scaled by plotted park visitors
  const allowedWalkers = activeVisitors <= 10 ? 4 : activeVisitors <= 20 ? 6 : pedestrians.length;
  const allowedSitters = activeVisitors <= 10 ? 1 : activeVisitors <= 20 ? 2 : benchSitters.length;

  return (
    <group>
      {/* ── 1. ACTIVE PATH-NAVIGATING CITIZENS ── */}
      {pedestrians.map((ped, idx) => (
        <group
          key={ped.id}
          ref={(el) => {
            agentsRef.current[idx] = el;
          }}
          position={ped.pos}
          rotation={[0, ped.yaw, 0]}
          visible={idx < allowedWalkers}
        >
          <StylizedHumanRig
            role={ped.role}
            isWalking={ped.isWalking}
            walkPhase={ped.walkPhase}
            walkSpeed={ped.speed}
            isWaitingTraffic={ped.state === 'WAITING_TRAFFIC'}
          />
        </group>
      ))}

      {/* ── 2. SEATED PARK BENCH CITIZENS ── */}
      {benchSitters.map((sitter, idx) => (
        <group
          key={sitter.id}
          position={sitter.pos}
          rotation={[0, sitter.rotY, 0]}
          visible={idx < allowedSitters}
        >
          <StylizedHumanRig
            role={sitter.role}
            isWalking={false}
            walkPhase={0}
            walkSpeed={0}
            isSitting={true}
          />
        </group>
      ))}
    </group>
  );
}
