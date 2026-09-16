// ============================================================
// GRAPHWORKS — THE DATA CITY: Stylized Pedestrians & Locomotion Physics
// High-fidelity stylized citizens with proper human anatomy, visible
// facial features (eyes, eyebrows, nose, mouth, hair), clothing variants,
// hierarchical skeletal walk cycle, crowd physics, and environmental interactions.
// ============================================================
'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

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

// Pre-curated character identity configurations for visual richness
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

// ── HIERARCHICALLY ARTICULATED HUMAN RIG ──
interface StylizedHumanRigProps {
  role: CharacterRole;
  isWalking: boolean;
  walkPhase: number;
  walkSpeed: number;
  isSitting?: boolean;
  lookTarget?: [number, number, number] | null;
  customStyle?: Partial<CharacterStyle>;
}

export function StylizedHumanRig({
  role,
  isWalking,
  walkPhase,
  walkSpeed,
  isSitting = false,
  lookTarget = null,
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
      // Hips bent 90 degrees forward
      if (leftHipRef.current) leftHipRef.current.rotation.x = THREE.MathUtils.damp(leftHipRef.current.rotation.x, -Math.PI / 2, 6, delta);
      if (rightHipRef.current) rightHipRef.current.rotation.x = THREE.MathUtils.damp(rightHipRef.current.rotation.x, -Math.PI / 2, 6, delta);
      // Knees bent 90 degrees downward to ground
      if (leftKneeRef.current) leftKneeRef.current.rotation.x = THREE.MathUtils.damp(leftKneeRef.current.rotation.x, Math.PI / 2, 6, delta);
      if (rightKneeRef.current) rightKneeRef.current.rotation.x = THREE.MathUtils.damp(rightKneeRef.current.rotation.x, Math.PI / 2, 6, delta);
      // Feet planted flat
      if (leftFootRef.current) leftFootRef.current.rotation.x = 0;
      if (rightFootRef.current) rightFootRef.current.rotation.x = 0;
      // Relaxed arms on thighs or holding cup
      if (leftShoulderRef.current) leftShoulderRef.current.rotation.x = -0.3;
      if (rightShoulderRef.current) rightShoulderRef.current.rotation.x = -0.3;
      if (leftElbowRef.current) leftElbowRef.current.rotation.x = 0.5;
      if (rightElbowRef.current) rightElbowRef.current.rotation.x = 0.5;
      // Relaxed head looking around park
      if (headRef.current) {
        headRef.current.rotation.y = Math.sin(t * 0.5) * 0.25;
        headRef.current.rotation.x = 0.05 + Math.sin(t * 0.3) * 0.05;
      }
      return;
    }

    if (isWalking) {
      // ── ACTIVE DYNAMIC WALK CYCLE (BIOMECHANICALLY SYNCHRONIZED) ──
      const strideAngle = 0.52; // Natural human walking stride angle
      const phase = walkPhase;

      // 1. Pelvis dynamics: vertical bob (peaks at foot contact) and lateral sway
      if (pelvisRef.current) {
        const bob = Math.abs(Math.sin(phase)) * 0.04;
        pelvisRef.current.position.y = 0.72 + bob;
        pelvisRef.current.rotation.y = Math.sin(phase) * 0.07;
        pelvisRef.current.rotation.z = Math.cos(phase) * 0.035;
      }

      // 2. Torso counter-rotates slightly for natural weight transfer
      if (torsoRef.current) {
        torsoRef.current.rotation.y = -Math.sin(phase) * 0.08;
        torsoRef.current.rotation.x = 0.03; // Slight forward lean while walking
      }

      // 3. Legs: alternating hip swing and knee flexion (swing phase vs stance phase)
      const leftLegForward = Math.sin(phase);
      const rightLegForward = Math.sin(phase + Math.PI);

      if (leftHipRef.current) {
        leftHipRef.current.rotation.x = leftLegForward * strideAngle;
      }
      if (rightHipRef.current) {
        rightHipRef.current.rotation.x = rightLegForward * strideAngle;
      }

      // Knee bends backward during swing phase (when thigh is moving forward or passing), straightens on strike
      if (leftKneeRef.current) {
        const leftKneeBend = Math.max(0, -leftLegForward * 0.85);
        leftKneeRef.current.rotation.x = leftKneeBend;
      }
      if (rightKneeRef.current) {
        const rightKneeBend = Math.max(0, -rightLegForward * 0.85);
        rightKneeRef.current.rotation.x = rightKneeBend;
      }

      // Feet flex slightly to maintain grounded contact without toe-stubbing
      if (leftFootRef.current) {
        leftFootRef.current.rotation.x = -Math.sin(phase) * 0.18;
      }
      if (rightFootRef.current) {
        rightFootRef.current.rotation.x = -Math.sin(phase + Math.PI) * 0.18;
      }

      // 4. Arms: swing opposite to legs! Left arm forward when Right leg is forward
      const armSwingAngle = 0.42;
      if (leftShoulderRef.current) {
        leftShoulderRef.current.rotation.x = -leftLegForward * armSwingAngle;
        leftShoulderRef.current.rotation.z = 0.08;
      }
      if (rightShoulderRef.current) {
        if (style.hasTablet) {
          // Holding tablet with right arm, steady in front
          rightShoulderRef.current.rotation.x = -0.6 + Math.sin(t * 1.5) * 0.05;
          rightShoulderRef.current.rotation.z = -0.15;
        } else {
          rightShoulderRef.current.rotation.x = -rightLegForward * armSwingAngle;
          rightShoulderRef.current.rotation.z = -0.08;
        }
      }

      // Elbows flex more on forward arm swing
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

      // 5. Head stays relatively stable with subtle gaze damping
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
      // ── IDLE STANDING POSE WITH NATURAL BREATHING & GAZE ──
      if (pelvisRef.current) {
        pelvisRef.current.position.y = THREE.MathUtils.damp(
          pelvisRef.current.position.y,
          0.72 + Math.sin(t * 2.0) * 0.008,
          5,
          delta
        );
        pelvisRef.current.rotation.x = THREE.MathUtils.damp(pelvisRef.current.rotation.x, 0, 5, delta);
        pelvisRef.current.rotation.y = THREE.MathUtils.damp(pelvisRef.current.rotation.y, 0, 5, delta);
        pelvisRef.current.rotation.z = THREE.MathUtils.damp(pelvisRef.current.rotation.z, 0, 5, delta);
      }

      if (torsoRef.current) {
        torsoRef.current.rotation.x = THREE.MathUtils.damp(torsoRef.current.rotation.x, 0, 5, delta);
        torsoRef.current.rotation.y = THREE.MathUtils.damp(torsoRef.current.rotation.y, 0, 5, delta);
      }

      // Legs return to clean grounded stance
      if (leftHipRef.current) leftHipRef.current.rotation.x = THREE.MathUtils.damp(leftHipRef.current.rotation.x, 0, 6, delta);
      if (rightHipRef.current) rightHipRef.current.rotation.x = THREE.MathUtils.damp(rightHipRef.current.rotation.x, 0, 6, delta);
      if (leftKneeRef.current) leftKneeRef.current.rotation.x = THREE.MathUtils.damp(leftKneeRef.current.rotation.x, 0, 6, delta);
      if (rightKneeRef.current) rightKneeRef.current.rotation.x = THREE.MathUtils.damp(rightKneeRef.current.rotation.x, 0, 6, delta);
      if (leftFootRef.current) leftFootRef.current.rotation.x = THREE.MathUtils.damp(leftFootRef.current.rotation.x, 0, 6, delta);
      if (rightFootRef.current) rightFootRef.current.rotation.x = THREE.MathUtils.damp(rightFootRef.current.rotation.x, 0, 6, delta);

      // Idle Arm behaviors
      if (leftShoulderRef.current) {
        leftShoulderRef.current.rotation.x = THREE.MathUtils.damp(leftShoulderRef.current.rotation.x, 0.05, 5, delta);
        leftShoulderRef.current.rotation.z = THREE.MathUtils.damp(leftShoulderRef.current.rotation.z, 0.08, 5, delta);
      }
      if (rightShoulderRef.current) {
        if (style.hasTablet) {
          rightShoulderRef.current.rotation.x = -0.75 + Math.sin(t * 1.5) * 0.04;
          rightShoulderRef.current.rotation.z = -0.15;
        } else {
          rightShoulderRef.current.rotation.x = THREE.MathUtils.damp(rightShoulderRef.current.rotation.x, 0.05, 5, delta);
          rightShoulderRef.current.rotation.z = THREE.MathUtils.damp(rightShoulderRef.current.rotation.z, -0.08, 5, delta);
        }
      }
      if (leftElbowRef.current) leftElbowRef.current.rotation.x = THREE.MathUtils.damp(leftElbowRef.current.rotation.x, 0.15, 5, delta);
      if (rightElbowRef.current) {
        rightElbowRef.current.rotation.x = style.hasTablet ? 1.0 : THREE.MathUtils.damp(rightElbowRef.current.rotation.x, 0.15, 5, delta);
      }

      // Head glance behavior: looking around district or checking tablet
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
        {/* Belt Silver Buckle */}
        <mesh position={[0, 0.04, 0.115]}>
          <boxGeometry args={[0.06, 0.06, 0.02]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* ── LEFT HIP & LEG HIERARCHY ── */}
        <group ref={leftHipRef} position={[-0.1, -0.02, 0]}>
          {/* Upper Thigh */}
          <mesh position={[0, -0.16, 0]} castShadow>
            <cylinderGeometry args={[0.075, 0.065, 0.32, 10]} />
            <meshStandardMaterial color={style.pantsColor} roughness={0.65} />
          </mesh>

          {/* Left Knee Joint */}
          <group ref={leftKneeRef} position={[0, -0.32, 0]}>
            {/* Shin / Lower Leg */}
            <mesh position={[0, -0.16, 0]} castShadow>
              <cylinderGeometry args={[0.06, 0.05, 0.32, 10]} />
              <meshStandardMaterial color={style.pantsColor} roughness={0.65} />
            </mesh>

            {/* Left Foot / Shoe (with sole and toe cap) */}
            <group ref={leftFootRef} position={[0, -0.32, 0.04]}>
              <mesh position={[0, 0.04, 0]} castShadow>
                <boxGeometry args={[0.11, 0.08, 0.22]} />
                <meshStandardMaterial color={style.shoesColor} roughness={0.5} />
              </mesh>
              {/* Shoe White/Dark Rubber Sole */}
              <mesh position={[0, 0.01, 0]}>
                <boxGeometry args={[0.115, 0.03, 0.23]} />
                <meshStandardMaterial color="#f8fafc" roughness={0.9} />
              </mesh>
            </group>
          </group>
        </group>

        {/* ── RIGHT HIP & LEG HIERARCHY ── */}
        <group ref={rightHipRef} position={[0.1, -0.02, 0]}>
          {/* Upper Thigh */}
          <mesh position={[0, -0.16, 0]} castShadow>
            <cylinderGeometry args={[0.075, 0.065, 0.32, 10]} />
            <meshStandardMaterial color={style.pantsColor} roughness={0.65} />
          </mesh>

          {/* Right Knee Joint */}
          <group ref={rightKneeRef} position={[0, -0.32, 0]}>
            {/* Shin / Lower Leg */}
            <mesh position={[0, -0.16, 0]} castShadow>
              <cylinderGeometry args={[0.06, 0.05, 0.32, 10]} />
              <meshStandardMaterial color={style.pantsColor} roughness={0.65} />
            </mesh>

            {/* Right Foot / Shoe */}
            <group ref={rightFootRef} position={[0, -0.32, 0.04]}>
              <mesh position={[0, 0.04, 0]} castShadow>
                <boxGeometry args={[0.11, 0.08, 0.22]} />
                <meshStandardMaterial color={style.shoesColor} roughness={0.5} />
              </mesh>
              {/* Shoe Sole */}
              <mesh position={[0, 0.01, 0]}>
                <boxGeometry args={[0.115, 0.03, 0.23]} />
                <meshStandardMaterial color="#f8fafc" roughness={0.9} />
              </mesh>
            </group>
          </group>
        </group>

        {/* ── 2. TORSO & CHEST ── */}
        <group ref={torsoRef} position={[0, 0.1, 0]}>
          {/* Main Torso Block (tapered chest & shoulders) */}
          <mesh position={[0, 0.2, 0]} castShadow>
            <boxGeometry args={[0.38, 0.4, 0.22]} />
            <meshStandardMaterial color={style.shirtColor} roughness={0.6} />
          </mesh>

          {/* High-Vis Reflective Stripes for Workers & Officers */}
          {style.accentColor && (
            <>
              {/* Horizontal Chest Tape */}
              <mesh position={[0, 0.24, 0.115]}>
                <boxGeometry args={[0.36, 0.04, 0.01]} />
                <meshStandardMaterial color={style.accentColor} roughness={0.3} metalness={0.5} />
              </mesh>
              <mesh position={[0, 0.12, 0.115]}>
                <boxGeometry args={[0.36, 0.04, 0.01]} />
                <meshStandardMaterial color={style.accentColor} roughness={0.3} metalness={0.5} />
              </mesh>
              {/* Vertical Shoulder Straps */}
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

          {/* Commuter Backpack */}
          {style.hasBackpack && (
            <mesh position={[0, 0.2, -0.15]} castShadow>
              <boxGeometry args={[0.26, 0.32, 0.14]} />
              <meshStandardMaterial color="#1e293b" roughness={0.8} />
            </mesh>
          )}

          {/* ── LEFT ARM HIERARCHY ── */}
          <group ref={leftShoulderRef} position={[-0.22, 0.34, 0]}>
            {/* Left Upper Arm */}
            <mesh position={[0, -0.12, 0]} castShadow>
              <cylinderGeometry args={[0.05, 0.045, 0.24, 8]} />
              <meshStandardMaterial color={style.shirtColor} roughness={0.6} />
            </mesh>

            {/* Left Elbow Joint */}
            <group ref={leftElbowRef} position={[0, -0.24, 0]}>
              {/* Left Forearm */}
              <mesh position={[0, -0.1, 0]} castShadow>
                <cylinderGeometry args={[0.045, 0.04, 0.2, 8]} />
                <meshStandardMaterial color={style.skinTone} roughness={0.5} />
              </mesh>
              {/* Left Hand */}
              <mesh position={[0, -0.22, 0]} castShadow>
                <boxGeometry args={[0.06, 0.07, 0.05]} />
                <meshStandardMaterial color={style.skinTone} roughness={0.5} />
              </mesh>
            </group>
          </group>

          {/* ── RIGHT ARM HIERARCHY ── */}
          <group ref={rightShoulderRef} position={[0.22, 0.34, 0]}>
            {/* Right Upper Arm */}
            <mesh position={[0, -0.12, 0]} castShadow>
              <cylinderGeometry args={[0.05, 0.045, 0.24, 8]} />
              <meshStandardMaterial color={style.shirtColor} roughness={0.6} />
            </mesh>

            {/* Right Elbow Joint */}
            <group ref={rightElbowRef} position={[0, -0.24, 0]}>
              {/* Right Forearm */}
              <mesh position={[0, -0.1, 0]} castShadow>
                <cylinderGeometry args={[0.045, 0.04, 0.2, 8]} />
                <meshStandardMaterial color={style.skinTone} roughness={0.5} />
              </mesh>
              {/* Right Hand */}
              <mesh position={[0, -0.22, 0]} castShadow>
                <boxGeometry args={[0.06, 0.07, 0.05]} />
                <meshStandardMaterial color={style.skinTone} roughness={0.5} />
              </mesh>

              {/* Data Tablet / Diagnostic Scanner */}
              {style.hasTablet && (
                <group position={[0, -0.22, 0.08]} rotation={[Math.PI / 4, 0, 0]}>
                  <mesh castShadow>
                    <boxGeometry args={[0.18, 0.24, 0.015]} />
                    <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.6} />
                  </mesh>
                  {/* Glowing Data Tablet Screen */}
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
            {/* Anatomical Neck */}
            <mesh position={[0, 0.04, 0]}>
              <cylinderGeometry args={[0.065, 0.075, 0.1, 10]} />
              <meshStandardMaterial color={style.skinTone} roughness={0.5} />
            </mesh>

            {/* Head Assembly */}
            <group ref={headRef} position={[0, 0.16, 0]}>
              {/* Stylized Cranium & Jaw */}
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

              {/* ── VISIBLE FACIAL FEATURES (NO FACELESS PRIMITIVES) ── */}
              {/* Left & Right Eyes (Sclera + Pupil) */}
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

              {/* Stylized Nose */}
              <mesh position={[0, 0.005, 0.112]} castShadow>
                <boxGeometry args={[0.032, 0.045, 0.03]} />
                <meshStandardMaterial color={style.skinTone} roughness={0.5} />
              </mesh>

              {/* Friendly Mouth / Smile Line */}
              <mesh position={[0, -0.045, 0.102]}>
                <boxGeometry args={[0.055, 0.012, 0.005]} />
                <meshBasicMaterial color="#be123c" />
              </mesh>

              {/* Eyeglasses for Scientists / Engineers */}
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

              {/* ── HEADWEAR / HAIRSTYLES ── */}
              {style.hasHardHat ? (
                // Safety Hard Hat with Peak & Headlamp
                <group position={[0, 0.09, 0]}>
                  <mesh castShadow>
                    <cylinderGeometry args={[0.13, 0.14, 0.09, 14]} />
                    <meshStandardMaterial color="#facc15" roughness={0.3} metalness={0.2} />
                  </mesh>
                  {/* Hat Peak */}
                  <mesh position={[0, -0.03, 0.08]} rotation={[-0.1, 0, 0]}>
                    <boxGeometry args={[0.2, 0.02, 0.08]} />
                    <meshStandardMaterial color="#facc15" roughness={0.3} />
                  </mesh>
                </group>
              ) : style.hairStyle === 'bun' ? (
                // Stylish Updo / Hair Bun
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
                // Clean Stylized Cut / Parted Hair
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
  // Pedestrian Agents with navigation routes, ground contact, and behaviors
  const pedestrians = useMemo(() => [
    // 1. City Worker: Inspecting central plaza infrastructure
    {
      id: 'worker-1',
      role: 'city_worker' as CharacterRole,
      route: [
        [-3.5, 0, 3.2],
        [-1.0, 0, 2.0],
        [1.5, 0, 2.0],
        [3.5, 0, 3.2],
        [0.0, 0, 4.0],
      ],
      speed: 1.1,
      currentWp: 0,
      pos: new THREE.Vector3(-3.5, 0, 3.2),
      yaw: 0,
      walkPhase: 0,
      isWalking: true,
      state: 'WALKING',
      stateTimer: 0,
    },
    // 2. Weather Scientist: Walking between weather dome and park
    {
      id: 'scientist-1',
      role: 'weather_scientist' as CharacterRole,
      route: [
        [-6.5, 0, 8.5],
        [-4.0, 0, 9.5],
        [-5.5, 0, 11.5],
        [-8.0, 0, 10.0],
      ],
      speed: 1.0,
      currentWp: 0,
      pos: new THREE.Vector3(-6.5, 0, 8.5),
      yaw: 0,
      walkPhase: 1.2,
      isWalking: true,
      state: 'WALKING',
      stateTimer: 0,
    },
    // 3. Train Passenger: Commuting along station platform & crosswalk
    {
      id: 'passenger-1',
      role: 'train_passenger' as CharacterRole,
      route: [
        [5.0, 0, 3.4],
        [5.0, 0, 7.6],
        [3.0, 0, 9.2],
        [5.0, 0, 7.6],
      ],
      speed: 1.3,
      currentWp: 0,
      pos: new THREE.Vector3(5.0, 0, 3.4),
      yaw: 0,
      walkPhase: 2.5,
      isWalking: true,
      state: 'WALKING',
      stateTimer: 0,
    },
    // 4. Park Visitor 1: Strolling along the promenade loop
    {
      id: 'visitor-1',
      role: 'park_visitor' as CharacterRole,
      route: [
        [-3.0, 0, 12.2],
        [0.0, 0, 12.8],
        [3.0, 0, 12.2],
        [1.5, 0, 10.5],
        [-1.5, 0, 10.5],
      ],
      speed: 0.95,
      currentWp: 0,
      pos: new THREE.Vector3(-3.0, 0, 12.2),
      yaw: 0,
      walkPhase: 0.8,
      isWalking: true,
      state: 'WALKING',
      stateTimer: 0,
    },
    // 5. Traffic Officer: Monitoring zebra crossing at boulevard
    {
      id: 'officer-1',
      role: 'traffic_officer' as CharacterRole,
      route: [
        [-5.0, 0, 4.0],
        [-5.0, 0, 7.0],
        [-5.0, 0, 4.0],
      ],
      speed: 0.8,
      currentWp: 0,
      pos: new THREE.Vector3(-5.0, 0, 4.0),
      yaw: 0,
      walkPhase: 1.9,
      isWalking: true,
      state: 'WALKING',
      stateTimer: 0,
    },
    // 6. Systems Engineer: Calibrating Data Tower telemetry with tablet
    {
      id: 'engineer-1',
      role: 'systems_engineer' as CharacterRole,
      route: [
        [2.5, 0, 1.5],
        [1.8, 0, -1.2],
        [-1.8, 0, -1.2],
        [-2.5, 0, 1.5],
      ],
      speed: 1.05,
      currentWp: 0,
      pos: new THREE.Vector3(2.5, 0, 1.5),
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
    // Kinematic steering and crowd physics update loop
    pedestrians.forEach((ped, idx) => {
      const group = agentsRef.current[idx];
      if (!group) return;

      const targetArr = ped.route[ped.currentWp];
      const targetVec = new THREE.Vector3(targetArr[0], targetArr[1], targetArr[2]);
      const dist = ped.pos.distanceTo(targetVec);

      if (dist < 0.35) {
        // Reached waypoint: advance to next waypoint or briefly idle
        ped.currentWp = (ped.currentWp + 1) % ped.route.length;
        if (Math.random() < 0.25) {
          ped.isWalking = false;
          ped.state = 'IDLE';
          ped.stateTimer = 2.0; // Rest for 2 seconds
        }
      }

      if (ped.state === 'IDLE') {
        ped.stateTimer -= delta;
        if (ped.stateTimer <= 0) {
          ped.state = 'WALKING';
          ped.isWalking = true;
        }
      }

      if (ped.isWalking) {
        // Direction vector to destination
        const dir = new THREE.Vector3().subVectors(targetVec, ped.pos).normalize();

        // ── CROWD PHYSICS: Separation from other pedestrians ──
        pedestrians.forEach((otherPed, otherIdx) => {
          if (idx === otherIdx) return;
          const separationDist = ped.pos.distanceTo(otherPed.pos);
          if (separationDist < 0.8 && separationDist > 0.01) {
            const pushDir = new THREE.Vector3().subVectors(ped.pos, otherPed.pos).normalize();
            dir.addScaledVector(pushDir, 0.6 / separationDist);
          }
        });
        dir.normalize();

        // Smooth steering rotation
        const targetAngle = Math.atan2(dir.x, dir.z);
        ped.yaw = THREE.MathUtils.damp(ped.yaw, targetAngle, 8, delta);

        // Advance world position (guaranteeing exact grounding at y = 0.03)
        const moveDist = ped.speed * delta;
        ped.pos.x += Math.sin(ped.yaw) * moveDist;
        ped.pos.z += Math.cos(ped.yaw) * moveDist;
        ped.pos.y = 0.03; // Ground contact lock

        // Advance walk phase synchronized to actual forward velocity (preventing foot slide!)
        // Stride length = 0.65m; frequency = speed / (stride * 2 * PI)
        ped.walkPhase += moveDist * 5.2;
      }

      // Update Three.js Transform
      group.position.copy(ped.pos);
      group.rotation.y = ped.yaw;
    });
  });

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
        >
          <StylizedHumanRig
            role={ped.role}
            isWalking={ped.isWalking}
            walkPhase={ped.walkPhase}
            walkSpeed={ped.speed}
          />
        </group>
      ))}

      {/* ── 2. SEATED PARK BENCH CITIZENS ── */}
      {benchSitters.map((sitter) => (
        <group key={sitter.id} position={sitter.pos} rotation={[0, sitter.rotY, 0]}>
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
