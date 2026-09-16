// ============================================================
// THE CHOCOLATE FACTORY — ARTICULATED FACTORY CREW & WORK SIMULATION
//
// High-fidelity stylized factory staff with organic humanoid anatomy:
// - Smooth curved limbs (cylinders/capsules), articulated knees and elbows
// - Expressive faces (sclera + pupils, eyebrows, nose, animated smile)
// - Team-branded work uniforms, hi-vis vests, white QC coats, safety hardhats
// - Active, meaningful work animations (cocoa bag pouring with bean streams,
//   mixer valve operation & digital tablet monitoring, chocolate bar QC inspection,
//   gift box packing & pallet stacking, forklift cab steering).
// ============================================================

'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { TeamId } from '../types';
import { runningStep, sim } from '../engine/factorySim';
import { sideOf, sideSign } from '../engine/factoryLayout';
import { GEO, MAT, teamMat, teamVestMat } from './materials';
import { angleDelta, type Vec3 } from './geom';

export type Gesture = 'none' | 'operate' | 'inspect' | 'talk' | 'pour' | 'pack' | 'tablet';

export interface PersonState {
  pos: Vec3;
  heading: number;
  moving: boolean;
  carrying: boolean;
  gesture: Gesture;
}

export interface WorkerStyle {
  skinTone: string;
  hairColor: string;
  shirtColor: string;
  pantsColor: string;
  shoesColor: string;
  vestColor?: string;
  isHiVis?: boolean;
  isCoat?: boolean;
  hat: 'hardhat' | 'cap' | 'cleanroom' | 'none';
  hasTablet?: boolean;
  hasGlasses?: boolean;
  heightScale?: number;
}

// ── SHARED ARTICULATED HUMANOID RIG ──

interface HumanoidRigProps {
  style: WorkerStyle;
  team: TeamId;
  read: () => PersonState;
  scale?: number;
  customAccessory?: React.ReactNode;
}

export const ArticulatedHuman3D: React.FC<HumanoidRigProps> = ({
  style,
  team,
  read,
  scale = 1,
  customAccessory,
}) => {
  const root = useRef<THREE.Group>(null);
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

  const walkPhase = useRef(Math.random() * Math.PI * 2);

  // Dynamic procedural materials for skin, hair, and clothing
  const skinMat = useMemo(() => new THREE.MeshStandardMaterial({ color: style.skinTone, roughness: 0.65 }), [style.skinTone]);
  const hairMat = useMemo(() => new THREE.MeshStandardMaterial({ color: style.hairColor, roughness: 0.8 }), [style.hairColor]);
  const pantsMat = useMemo(() => new THREE.MeshStandardMaterial({ color: style.pantsColor, roughness: 0.75 }), [style.pantsColor]);
  const shoeMat = useMemo(() => new THREE.MeshStandardMaterial({ color: style.shoesColor, roughness: 0.5 }), [style.shoesColor]);
  const shirtMat = useMemo(() => new THREE.MeshStandardMaterial({ color: style.shirtColor, roughness: 0.7 }), [style.shirtColor]);
  const eyePupilMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.2 }), []);
  const eyeWhiteMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.3 }), []);
  const hardhatMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: team === 'blue' ? '#3b82f6' : '#ef4444',
    roughness: 0.4,
    metalness: 0.15,
  }), [team]);

  useFrame((state, delta) => {
    const s = read();
    const g = root.current;
    if (!g) return;

    // Position & Smooth Heading Easing
    g.position.set(s.pos.x, 0, s.pos.z);
    g.rotation.y += angleDelta(g.rotation.y, s.heading) * (1 - Math.exp(-10 * delta));

    const t = state.clock.getElapsedTime();

    if (s.moving) {
      // ── BIPEDAL WALKING GAIT ──
      walkPhase.current += delta * 7.5;
      const p = walkPhase.current;

      // 1. Pelvic bobbing and lateral sway
      if (pelvisRef.current) {
        pelvisRef.current.position.y = 0.72 + Math.abs(Math.sin(p)) * 0.035;
        pelvisRef.current.rotation.y = Math.sin(p) * 0.07;
        pelvisRef.current.rotation.z = Math.cos(p) * 0.025;
      }
      if (torsoRef.current) {
        torsoRef.current.rotation.y = -Math.sin(p) * 0.06;
        torsoRef.current.rotation.x = 0.05;
      }

      // 2. Leg kinematics with natural knee flexion
      const leftPitch = -Math.sin(p) * 0.46;
      const rightPitch = -Math.sin(p + Math.PI) * 0.46;
      if (leftHipRef.current) leftHipRef.current.rotation.x = leftPitch;
      if (rightHipRef.current) rightHipRef.current.rotation.x = rightPitch;

      const leftSwing = Math.max(0, Math.sin(p));
      const rightSwing = Math.max(0, Math.sin(p + Math.PI));
      if (leftKneeRef.current) leftKneeRef.current.rotation.x = Math.max(0.04, Math.pow(leftSwing, 1.1) * 0.9);
      if (rightKneeRef.current) rightKneeRef.current.rotation.x = Math.max(0.04, Math.pow(rightSwing, 1.1) * 0.9);

      if (leftFootRef.current) leftFootRef.current.rotation.x = -Math.sin(p) * 0.18;
      if (rightFootRef.current) rightFootRef.current.rotation.x = -Math.sin(p + Math.PI) * 0.18;

      // 3. Arms Swing vs Carrying Load
      if (s.carrying) {
        // Firmly cradling the cargo sack/box with both arms raised against chest
        if (leftShoulderRef.current) {
          leftShoulderRef.current.rotation.x = -1.35;
          leftShoulderRef.current.rotation.y = 0.28;
          leftShoulderRef.current.rotation.z = 0.2;
        }
        if (rightShoulderRef.current) {
          rightShoulderRef.current.rotation.x = -1.35;
          rightShoulderRef.current.rotation.y = -0.28;
          rightShoulderRef.current.rotation.z = -0.2;
        }
        if (leftElbowRef.current) leftElbowRef.current.rotation.x = 0.85;
        if (rightElbowRef.current) rightElbowRef.current.rotation.x = 0.85;
      } else {
        // Natural counter-swing
        if (leftShoulderRef.current) {
          leftShoulderRef.current.rotation.x = Math.sin(p) * 0.38;
          leftShoulderRef.current.rotation.y = 0;
          leftShoulderRef.current.rotation.z = 0.08;
        }
        if (rightShoulderRef.current) {
          rightShoulderRef.current.rotation.x = -Math.sin(p) * 0.38;
          rightShoulderRef.current.rotation.y = 0;
          rightShoulderRef.current.rotation.z = -0.08;
        }
        if (leftElbowRef.current) leftElbowRef.current.rotation.x = 0.2 + Math.max(0, Math.sin(p) * 0.25);
        if (rightElbowRef.current) rightElbowRef.current.rotation.x = 0.2 + Math.max(0, -Math.sin(p) * 0.25);
      }

      if (headRef.current) {
        headRef.current.rotation.y = Math.sin(t * 1.5) * 0.06;
        headRef.current.rotation.x = 0.02;
      }
    } else {
      // ── STATIONARY WORK POSE & GESTURES ──
      if (pelvisRef.current) {
        pelvisRef.current.position.y = 0.72 + Math.sin(t * 2.0) * 0.008;
        pelvisRef.current.rotation.set(0, 0, 0);
      }
      if (torsoRef.current) torsoRef.current.rotation.set(0, 0, 0);
      if (leftHipRef.current) leftHipRef.current.rotation.x = 0;
      if (rightHipRef.current) rightHipRef.current.rotation.x = 0;
      if (leftKneeRef.current) leftKneeRef.current.rotation.x = 0;
      if (rightKneeRef.current) rightKneeRef.current.rotation.x = 0;
      if (leftFootRef.current) leftFootRef.current.rotation.x = 0;
      if (rightFootRef.current) rightFootRef.current.rotation.x = 0;

      switch (s.gesture) {
        case 'pour': {
          // Tipping cocoa sack into tank
          if (leftShoulderRef.current) {
            leftShoulderRef.current.rotation.x = -1.9 + Math.sin(t * 3) * 0.05;
            leftShoulderRef.current.rotation.y = 0.35;
            leftShoulderRef.current.rotation.z = 0.15;
          }
          if (rightShoulderRef.current) {
            rightShoulderRef.current.rotation.x = -1.9 + Math.sin(t * 3) * 0.05;
            rightShoulderRef.current.rotation.y = -0.35;
            rightShoulderRef.current.rotation.z = -0.15;
          }
          if (leftElbowRef.current) leftElbowRef.current.rotation.x = 0.45;
          if (rightElbowRef.current) rightElbowRef.current.rotation.x = 0.45;
          if (headRef.current) {
            headRef.current.rotation.x = 0.35; // Looking down into tank
            headRef.current.rotation.y = 0;
          }
          break;
        }

        case 'operate': {
          // Operating mixer dials / throttle levers
          const dialSpin = Math.sin(t * 3.5);
          if (leftShoulderRef.current) {
            leftShoulderRef.current.rotation.x = -1.15 + dialSpin * 0.12;
            leftShoulderRef.current.rotation.y = 0.25;
            leftShoulderRef.current.rotation.z = 0.1;
          }
          if (rightShoulderRef.current) {
            rightShoulderRef.current.rotation.x = -1.35 + Math.cos(t * 2.8) * 0.15;
            rightShoulderRef.current.rotation.y = -0.2;
            rightShoulderRef.current.rotation.z = -0.1;
          }
          if (leftElbowRef.current) leftElbowRef.current.rotation.x = 0.7;
          if (rightElbowRef.current) rightElbowRef.current.rotation.x = 0.85;
          if (headRef.current) {
            headRef.current.rotation.x = 0.12;
            headRef.current.rotation.y = Math.sin(t * 1.8) * 0.2;
          }
          break;
        }

        case 'inspect': {
          // Quality Inspector examining bar & clipboard
          if (leftShoulderRef.current) {
            // Holding clipboard in left hand
            leftShoulderRef.current.rotation.x = -0.95;
            leftShoulderRef.current.rotation.y = 0.35;
            leftShoulderRef.current.rotation.z = 0.15;
          }
          if (rightShoulderRef.current) {
            // Right hand holding sample chocolate bar under inspection light
            rightShoulderRef.current.rotation.x = -1.25 + Math.sin(t * 2.2) * 0.1;
            rightShoulderRef.current.rotation.y = -0.25;
            rightShoulderRef.current.rotation.z = -0.1;
          }
          if (leftElbowRef.current) leftElbowRef.current.rotation.x = 1.1;
          if (rightElbowRef.current) rightElbowRef.current.rotation.x = 0.95;
          if (headRef.current) {
            headRef.current.rotation.x = 0.25; // Focused gaze on bar
            headRef.current.rotation.y = Math.sin(t * 1.2) * 0.18;
          }
          break;
        }

        case 'pack': {
          // Packing Worker boxing wrapped bars
          const packCycle = Math.sin(t * 3.2);
          if (leftShoulderRef.current) {
            leftShoulderRef.current.rotation.x = -1.1 + packCycle * 0.15;
            leftShoulderRef.current.rotation.y = 0.2;
          }
          if (rightShoulderRef.current) {
            rightShoulderRef.current.rotation.x = -1.15 - packCycle * 0.15;
            rightShoulderRef.current.rotation.y = -0.2;
          }
          if (leftElbowRef.current) leftElbowRef.current.rotation.x = 0.85;
          if (rightElbowRef.current) rightElbowRef.current.rotation.x = 0.85;
          if (headRef.current) {
            headRef.current.rotation.x = 0.28;
            headRef.current.rotation.y = Math.sin(t * 2.0) * 0.15;
          }
          break;
        }

        case 'tablet':
        default: {
          // Idle worker checking diagnostic tablet / notes
          if (leftShoulderRef.current) {
            leftShoulderRef.current.rotation.x = -0.85;
            leftShoulderRef.current.rotation.y = 0.3;
            leftShoulderRef.current.rotation.z = 0.1;
          }
          if (rightShoulderRef.current) {
            rightShoulderRef.current.rotation.x = -0.7 + Math.sin(t * 1.5) * 0.08;
            rightShoulderRef.current.rotation.y = -0.2;
            rightShoulderRef.current.rotation.z = -0.1;
          }
          if (leftElbowRef.current) leftElbowRef.current.rotation.x = 1.0;
          if (rightElbowRef.current) rightElbowRef.current.rotation.x = 0.9;
          if (headRef.current) {
            headRef.current.rotation.x = 0.22;
            headRef.current.rotation.y = Math.sin(t * 0.8) * 0.2;
          }
          break;
        }
      }
    }
  });

  return (
    <group ref={root} scale={scale * (style.heightScale ?? 1.0)}>
      {/* ── 1. PELVIS & LOWER BODY ── */}
      <group ref={pelvisRef} position={[0, 0.72, 0]}>
        {/* Belt & Waist */}
        <mesh position={[0, 0.02, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.17, 0.12, 12]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} />
        </mesh>
        {/* Belt Buckle */}
        <mesh position={[0, 0.02, 0.175]}>
          <boxGeometry args={[0.06, 0.05, 0.02]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* ── LEFT LEG ── */}
        <group ref={leftHipRef} position={[-0.1, -0.04, 0]}>
          <mesh position={[0, -0.16, 0]} castShadow>
            <cylinderGeometry args={[0.075, 0.065, 0.32, 10]} />
            <primitive object={pantsMat} attach="material" />
          </mesh>
          <group ref={leftKneeRef} position={[0, -0.32, 0]}>
            <mesh position={[0, -0.16, 0]} castShadow>
              <cylinderGeometry args={[0.065, 0.055, 0.32, 10]} />
              <primitive object={pantsMat} attach="material" />
            </mesh>
            <group ref={leftFootRef} position={[0, -0.32, 0.03]}>
              <mesh position={[0, 0.04, 0]} castShadow>
                <boxGeometry args={[0.11, 0.08, 0.22]} />
                <primitive object={shoeMat} attach="material" />
              </mesh>
              {/* Rubber Tread */}
              <mesh position={[0, 0.01, 0]}>
                <boxGeometry args={[0.115, 0.025, 0.23]} />
                <meshStandardMaterial color="#0f172a" roughness={0.9} />
              </mesh>
            </group>
          </group>
        </group>

        {/* ── RIGHT LEG ── */}
        <group ref={rightHipRef} position={[0.1, -0.04, 0]}>
          <mesh position={[0, -0.16, 0]} castShadow>
            <cylinderGeometry args={[0.075, 0.065, 0.32, 10]} />
            <primitive object={pantsMat} attach="material" />
          </mesh>
          <group ref={rightKneeRef} position={[0, -0.32, 0]}>
            <mesh position={[0, -0.16, 0]} castShadow>
              <cylinderGeometry args={[0.065, 0.055, 0.32, 10]} />
              <primitive object={pantsMat} attach="material" />
            </mesh>
            <group ref={rightFootRef} position={[0, -0.32, 0.03]}>
              <mesh position={[0, 0.04, 0]} castShadow>
                <boxGeometry args={[0.11, 0.08, 0.22]} />
                <primitive object={shoeMat} attach="material" />
              </mesh>
              <mesh position={[0, 0.01, 0]}>
                <boxGeometry args={[0.115, 0.025, 0.23]} />
                <meshStandardMaterial color="#0f172a" roughness={0.9} />
              </mesh>
            </group>
          </group>
        </group>

        {/* ── 2. TORSO & UPPER BODY ── */}
        <group ref={torsoRef} position={[0, 0.08, 0]}>
          {/* Main Chest / Shirt */}
          <mesh position={[0, 0.26, 0]} castShadow>
            <cylinderGeometry args={[0.21, 0.17, 0.44, 12]} />
            <primitive object={style.isCoat ? MAT.coatWhite : shirtMat} attach="material" />
          </mesh>

          {/* Hi-Vis Safety Vest Overlay */}
          {style.isHiVis && (
            <>
              <mesh position={[0, 0.26, 0]} castShadow>
                <cylinderGeometry args={[0.215, 0.175, 0.42, 12]} />
                <meshStandardMaterial color="#facc15" roughness={0.6} />
              </mesh>
              {/* Reflective Silver Stripes */}
              <mesh position={[0, 0.32, 0]}>
                <cylinderGeometry args={[0.218, 0.21, 0.05, 12]} />
                <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.8} />
              </mesh>
              <mesh position={[0, 0.18, 0]}>
                <cylinderGeometry args={[0.198, 0.185, 0.05, 12]} />
                <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.8} />
              </mesh>
              {/* Team ID Badge on Chest */}
              <mesh position={[0.1, 0.34, 0.2]}>
                <boxGeometry args={[0.07, 0.09, 0.02]} />
                <primitive object={team === 'blue' ? MAT.blue : MAT.red} attach="material" />
              </mesh>
            </>
          )}

          {/* Lab Coat Details for Quality Inspector */}
          {style.isCoat && (
            <>
              {/* Pocket + Golden QC Pen */}
              <mesh position={[0.1, 0.3, 0.195]}>
                <boxGeometry args={[0.07, 0.08, 0.02]} />
                <meshStandardMaterial color="#e2e8f0" roughness={0.6} />
              </mesh>
              <mesh position={[0.11, 0.34, 0.205]}>
                <cylinderGeometry args={[0.008, 0.008, 0.08, 8]} />
                <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.2} />
              </mesh>
            </>
          )}

          {/* Collar & Neck */}
          <mesh position={[0, 0.51, 0]}>
            <cylinderGeometry args={[0.09, 0.1, 0.1, 10]} />
            <primitive object={skinMat} attach="material" />
          </mesh>

          {/* ── LEFT ARM ── */}
          <group ref={leftShoulderRef} position={[-0.24, 0.44, 0]}>
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.07, 10, 8]} />
              <primitive object={style.isCoat ? MAT.coatWhite : shirtMat} attach="material" />
            </mesh>
            <mesh position={[0, -0.15, 0]} castShadow>
              <cylinderGeometry args={[0.06, 0.05, 0.28, 10]} />
              <primitive object={style.isCoat ? MAT.coatWhite : shirtMat} attach="material" />
            </mesh>
            <group ref={leftElbowRef} position={[0, -0.28, 0]}>
              <mesh position={[0, -0.14, 0]} castShadow>
                <cylinderGeometry args={[0.05, 0.045, 0.26, 10]} />
                <primitive object={skinMat} attach="material" />
              </mesh>
              {/* Hand / Work Glove */}
              <mesh position={[0, -0.28, 0]}>
                <sphereGeometry args={[0.055, 10, 8]} />
                <primitive object={skinMat} attach="material" />
              </mesh>
            </group>
          </group>

          {/* ── RIGHT ARM ── */}
          <group ref={rightShoulderRef} position={[0.24, 0.44, 0]}>
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.07, 10, 8]} />
              <primitive object={style.isCoat ? MAT.coatWhite : shirtMat} attach="material" />
            </mesh>
            <mesh position={[0, -0.15, 0]} castShadow>
              <cylinderGeometry args={[0.06, 0.05, 0.28, 10]} />
              <primitive object={style.isCoat ? MAT.coatWhite : shirtMat} attach="material" />
            </mesh>
            <group ref={rightElbowRef} position={[0, -0.28, 0]}>
              <mesh position={[0, -0.14, 0]} castShadow>
                <cylinderGeometry args={[0.05, 0.045, 0.26, 10]} />
                <primitive object={skinMat} attach="material" />
              </mesh>
              <mesh position={[0, -0.28, 0]}>
                <sphereGeometry args={[0.055, 10, 8]} />
                <primitive object={skinMat} attach="material" />
              </mesh>
            </group>
          </group>

          {/* ── 3. HEAD & EXPRESSIVE FACE ── */}
          <group ref={headRef} position={[0, 0.68, 0]}>
            {/* Smooth Rounded Head Cranium */}
            <mesh castShadow>
              <sphereGeometry args={[0.16, 16, 14]} />
              <primitive object={skinMat} attach="material" />
            </mesh>

            {/* Stylized Eyes with Pupils and Specular Glint */}
            {[-0.055, 0.055].map((ex, i) => (
              <group key={i} position={[ex, 0.02, 0.14]}>
                {/* Sclera */}
                <mesh>
                  <sphereGeometry args={[0.028, 10, 8]} />
                  <primitive object={eyeWhiteMat} attach="material" />
                </mesh>
                {/* Dark Pupil */}
                <mesh position={[0, 0, 0.02]}>
                  <sphereGeometry args={[0.016, 8, 8]} />
                  <primitive object={eyePupilMat} attach="material" />
                </mesh>
                {/* Specular Highlight */}
                <mesh position={[0.007, 0.007, 0.03]}>
                  <sphereGeometry args={[0.005, 6, 6]} />
                  <meshBasicMaterial color="#ffffff" />
                </mesh>
              </group>
            ))}

            {/* Eyebrows */}
            {[-0.055, 0.055].map((bx, i) => (
              <mesh key={i} position={[bx, 0.065, 0.145]} rotation={[0, 0, (i === 0 ? 1 : -1) * 0.1]}>
                <boxGeometry args={[0.04, 0.01, 0.015]} />
                <primitive object={hairMat} attach="material" />
              </mesh>
            ))}

            {/* Cute Stylized Nose */}
            <mesh position={[0, -0.015, 0.162]}>
              <sphereGeometry args={[0.02, 8, 8]} />
              <primitive object={skinMat} attach="material" />
            </mesh>

            {/* Cheerful Factory Smile */}
            <mesh position={[0, -0.06, 0.142]} rotation={[0.2, 0, 0]}>
              <torusGeometry args={[0.03, 0.008, 6, 10, Math.PI]} />
              <meshStandardMaterial color="#451a03" roughness={0.4} />
            </mesh>

            {/* Natural Hair Layer */}
            <mesh position={[0, 0.07, -0.02]}>
              <sphereGeometry args={[0.168, 14, 12]} />
              <primitive object={hairMat} attach="material" />
            </mesh>
            {/* Front Bangs / Hair Strands */}
            <mesh position={[0, 0.12, 0.1]}>
              <boxGeometry args={[0.16, 0.06, 0.1]} />
              <primitive object={hairMat} attach="material" />
            </mesh>

            {/* Safety Hardhat */}
            {style.hat === 'hardhat' && (
              <group position={[0, 0.07, 0]}>
                <mesh castShadow>
                  <sphereGeometry args={[0.185, 14, 12]} />
                  <primitive object={hardhatMat} attach="material" />
                </mesh>
                {/* Hardhat Visor / Brim */}
                <mesh position={[0, -0.03, 0.09]} rotation={[0.25, 0, 0]}>
                  <boxGeometry args={[0.22, 0.025, 0.14]} />
                  <primitive object={hardhatMat} attach="material" />
                </mesh>
                {/* Team Insignia Band */}
                <mesh position={[0, 0.01, 0]}>
                  <cylinderGeometry args={[0.188, 0.188, 0.04, 14]} />
                  <meshStandardMaterial color="#fbbf24" metalness={0.6} roughness={0.3} />
                </mesh>
              </group>
            )}

            {/* Worker Cap */}
            {style.hat === 'cap' && (
              <group position={[0, 0.07, 0]}>
                <mesh>
                  <sphereGeometry args={[0.178, 14, 12]} />
                  <primitive object={teamMat(team)} attach="material" />
                </mesh>
                <mesh position={[0, -0.02, 0.1]} rotation={[0.2, 0, 0]}>
                  <boxGeometry args={[0.2, 0.02, 0.15]} />
                  <primitive object={teamMat(team)} attach="material" />
                </mesh>
              </group>
            )}
          </group>
        </group>
      </group>

      {/* Role-Specific Custom Props / Tools / Sacks */}
      {customAccessory}
    </group>
  );
};

// ── COMPATIBILITY EXPORT: Person3D ──
export const Person3D: React.FC<{ look: any; read: () => PersonState; scale?: number }> = ({
  look,
  read,
  scale = 1,
}) => {
  const style: WorkerStyle = useMemo(() => ({
    skinTone: '#e8b98f',
    hairColor: '#3b2b21',
    shirtColor: '#f97316',
    pantsColor: '#1e3a8a',
    shoesColor: '#1e293b',
    isHiVis: true,
    isCoat: look.coat,
    hat: look.hat || 'hardhat',
  }), [look]);

  return <ArticulatedHuman3D style={style} team="blue" read={read} scale={scale} />;
};

// ── 1. INGREDIENT HANDLERS (2 PER TEAM) ──────────────────────────────────
// Fetch raw organic cocoa bean sacks from pallet, carry them with both arms,
// and tilt the sack smoothly over the measuring tank intake chute with
// animated roasted cocoa bean cascade!

const headingTowards = (from: Vec3, to: Vec3) => Math.atan2(-(to.x - from.x), -(to.z - from.z));

export const IngredientHandler3D: React.FC<{ team: TeamId; index: 0 | 1 }> = ({ team, index }) => {
  const sackRef = useRef<THREE.Group>(null);
  const beanStreamRef = useRef<THREE.Group>(null);
  const tank = sideOf(team).measuringTank;

  const style: WorkerStyle = useMemo(() => ({
    skinTone: index === 0 ? '#e0ac69' : '#a9724a',
    hairColor: index === 0 ? '#1e293b' : '#451a03',
    shirtColor: team === 'blue' ? '#1d4ed8' : '#b91c1c',
    pantsColor: '#1e3a8a', // Heavy denim work pants
    shoesColor: '#451a03', // Steel-toe brown boots
    isHiVis: true,
    hat: 'hardhat',
    heightScale: index === 0 ? 1.02 : 0.98,
  }), [team, index]);

  const read = (): PersonState => {
    const w = sim[team].handlers[index];
    const walking = w.task === 'to_pallet' || w.task === 'to_tank' || w.task === 'back' || w.task === 'ambient';
    const isTipping = w.task === 'tipping';
    return {
      pos: w.pos,
      heading: isTipping ? headingTowards(w.pos, tank) : w.heading,
      moving: walking && w.task !== 'ambient',
      carrying: w.carrying,
      gesture: isTipping ? 'pour' : w.task === 'ambient' ? 'tablet' : 'none',
    };
  };

  useFrame((state) => {
    const w = sim[team].handlers[index];
    const isTipping = w.task === 'tipping';
    const isCarrying = w.carrying || isTipping;

    if (sackRef.current) {
      sackRef.current.visible = isCarrying;
      if (isCarrying) {
        const f = { x: -Math.sin(w.heading), z: -Math.cos(w.heading) };
        if (isTipping) {
          // Elevated above tank rim and tilted 55 degrees
          sackRef.current.position.set(
            w.pos.x + f.x * 0.72,
            1.82,
            w.pos.z + f.z * 0.72
          );
          sackRef.current.rotation.set(-1.1, w.heading, 0);
        } else {
          // Held against chest with both arms cradling
          sackRef.current.position.set(
            w.pos.x + f.x * 0.42,
            1.12 + Math.sin(state.clock.elapsedTime * 7.5) * 0.03,
            w.pos.z + f.z * 0.42
          );
          sackRef.current.rotation.set(0, w.heading, 0);
        }
      }
    }

    // Animated cocoa bean stream dropping into the tank
    if (beanStreamRef.current) {
      beanStreamRef.current.visible = isTipping;
      if (isTipping) {
        const f = { x: -Math.sin(w.heading), z: -Math.cos(w.heading) };
        beanStreamRef.current.position.set(
          w.pos.x + f.x * 0.95,
          1.4,
          w.pos.z + f.z * 0.95
        );
      }
    }
  });

  return (
    <group>
      <ArticulatedHuman3D style={style} team={team} read={read} />

      {/* ── REALISTIC BURLAP COCOA SACK ── */}
      <group ref={sackRef} visible={false}>
        {/* Main Sack Body */}
        <mesh castShadow>
          <boxGeometry args={[0.46, 0.62, 0.32]} />
          <meshStandardMaterial color="#c99a63" roughness={0.9} />
        </mesh>
        {/* Tied Sack Neck */}
        <mesh position={[0, 0.35, 0]}>
          <cylinderGeometry args={[0.09, 0.16, 0.12, 10]} />
          <meshStandardMaterial color="#b45309" roughness={0.95} />
        </mesh>
        {/* Burlap Tie Rope */}
        <mesh position={[0, 0.32, 0]}>
          <torusGeometry args={[0.11, 0.02, 6, 12]} />
          <meshStandardMaterial color="#78350f" roughness={0.8} />
        </mesh>
        {/* Cacao Pod Logo Stamp */}
        <mesh position={[0, 0, 0.165]}>
          <boxGeometry args={[0.22, 0.22, 0.01]} />
          <meshStandardMaterial color="#4a2410" roughness={0.7} />
        </mesh>
      </group>

      {/* ── COCOA BEAN CASCADE STREAM ── */}
      <group ref={beanStreamRef} visible={false}>
        {[0, 0.15, 0.3, 0.45].map((y, i) => (
          <mesh key={i} position={[0, -y, 0]}>
            <sphereGeometry args={[0.055, 8, 6]} />
            <meshStandardMaterial color="#4a2410" roughness={0.3} />
          </mesh>
        ))}
      </group>
    </group>
  );
};

// ── 2. MIXER OPERATOR (1 PER TEAM) ──────────────────────────────────────
// Stationed at the mixer control console: actively turns copper pressure
// valves, pulls speed levers, and consults digital telemetry tablet.

export const MixerOperator3D: React.FC<{ team: TeamId }> = ({ team }) => {
  const mixer = sideOf(team).mixer;
  const tabletRef = useRef<THREE.Group>(null);

  const style: WorkerStyle = useMemo(() => ({
    skinTone: '#fed7aa',
    hairColor: '#1e293b',
    shirtColor: team === 'blue' ? '#2563eb' : '#dc2626',
    pantsColor: '#1e293b',
    shoesColor: '#1e293b',
    isHiVis: true,
    hat: 'hardhat',
    heightScale: 1.0,
  }), [team]);

  const read = (): PersonState => {
    const w = sim[team].operator;
    const step = runningStep(team);
    const active = step === 'mixing' || step === 'molding';
    return {
      pos: w.pos,
      heading: headingTowards(w.pos, mixer),
      moving: false,
      carrying: false,
      gesture: active ? 'operate' : 'tablet',
    };
  };

  useFrame((state) => {
    const w = sim[team].operator;
    const step = runningStep(team);
    const isOperating = step === 'mixing' || step === 'molding';

    if (tabletRef.current) {
      tabletRef.current.visible = !isOperating;
      if (!isOperating) {
        const f = { x: -Math.sin(w.heading), z: -Math.cos(w.heading) };
        tabletRef.current.position.set(
          w.pos.x + f.x * 0.35,
          1.05 + Math.sin(state.clock.elapsedTime * 1.5) * 0.02,
          w.pos.z + f.z * 0.35
        );
        tabletRef.current.rotation.set(-0.5, w.heading, 0);
      }
    }
  });

  return (
    <group>
      <ArticulatedHuman3D style={style} team={team} read={read} />

      {/* Holographic Diagnostic Tablet */}
      <group ref={tabletRef}>
        <mesh castShadow>
          <boxGeometry args={[0.26, 0.36, 0.02]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0, 0.012]}>
          <planeGeometry args={[0.22, 0.32]} />
          <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.9} />
        </mesh>
      </group>
    </group>
  );
};

// ── 3. QUALITY INSPECTOR (1 PER TEAM) ───────────────────────────────────
// Stationed at the cooling tunnel exit: wears lab coat and safety goggles,
// holds illuminated QC clipboard, inspects chocolate bars, logs 100% Quality!

export const QualityInspector3D: React.FC<{ team: TeamId }> = ({ team }) => {
  const station = sideOf(team).qcStation;
  const sampleBarRef = useRef<THREE.Mesh>(null);
  const clipboardRef = useRef<THREE.Group>(null);

  const style: WorkerStyle = useMemo(() => ({
    skinTone: '#fed7aa',
    hairColor: '#b45309',
    shirtColor: '#ffffff',
    pantsColor: '#334155',
    shoesColor: '#f8fafc',
    isCoat: true,
    hat: 'none',
    heightScale: 0.97,
  }), []);

  const read = (): PersonState => {
    const w = sim[team].inspector;
    return {
      pos: w.pos,
      heading: headingTowards(w.pos, station),
      moving: false,
      carrying: false,
      gesture: 'inspect',
    };
  };

  useFrame((state) => {
    const w = sim[team].inspector;
    const f = { x: -Math.sin(w.heading), z: -Math.cos(w.heading) };

    if (clipboardRef.current) {
      clipboardRef.current.position.set(
        w.pos.x + f.x * 0.32 - 0.12,
        1.1,
        w.pos.z + f.z * 0.32
      );
      clipboardRef.current.rotation.set(-0.6, w.heading - 0.3, 0);
    }

    if (sampleBarRef.current) {
      const inspectCycle = Math.sin(state.clock.elapsedTime * 2.2);
      sampleBarRef.current.position.set(
        w.pos.x + f.x * 0.36 + 0.14,
        1.25 + inspectCycle * 0.04,
        w.pos.z + f.z * 0.36
      );
      sampleBarRef.current.rotation.set(0.4 + inspectCycle * 0.2, w.heading, 0);
    }
  });

  return (
    <group>
      <ArticulatedHuman3D style={style} team={team} read={read} />

      {/* QC Clipboard */}
      <group ref={clipboardRef}>
        <mesh castShadow>
          <boxGeometry args={[0.22, 0.32, 0.015]} />
          <meshStandardMaterial color="#84562b" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.02, 0.01]}>
          <planeGeometry args={[0.18, 0.26]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.9} />
        </mesh>
        {/* Metal Spring Clip */}
        <mesh position={[0, 0.15, 0.015]}>
          <boxGeometry args={[0.1, 0.03, 0.02]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* Glossy Sample Chocolate Bar */}
      <mesh ref={sampleBarRef} castShadow>
        <boxGeometry args={[0.18, 0.09, 0.025]} />
        <meshStandardMaterial color="#4a2410" roughness={0.15} metalness={0.05} />
      </mesh>
    </group>
  );
};

// ── 4. PACKING WORKER (1 PER TEAM) ──────────────────────────────────────
// Stationed at packaging machine: packs bars into branded boxes and neatly
// stacks sealed gift boxes onto transport pallets.

export const PackingWorker3D: React.FC<{ team: TeamId }> = ({ team }) => {
  const machine = sideOf(team).packagingMachine;
  const boxRef = useRef<THREE.Group>(null);

  const style: WorkerStyle = useMemo(() => ({
    skinTone: '#e0ac69',
    hairColor: '#1e293b',
    shirtColor: team === 'blue' ? '#2563eb' : '#dc2626',
    pantsColor: '#1e3a8a',
    shoesColor: '#1e293b',
    isHiVis: true,
    hat: 'cap',
    heightScale: 1.0,
  }), [team]);

  const read = (): PersonState => {
    const w = sim[team].packer;
    const step = runningStep(team);
    const packing = step === 'packaging';
    return {
      pos: w.pos,
      heading: headingTowards(w.pos, machine),
      moving: false,
      carrying: packing,
      gesture: packing ? 'pack' : 'tablet',
    };
  };

  useFrame((state) => {
    const w = sim[team].packer;
    const step = runningStep(team);
    const packing = step === 'packaging';

    if (boxRef.current) {
      boxRef.current.visible = packing;
      if (packing) {
        const f = { x: -Math.sin(w.heading), z: -Math.cos(w.heading) };
        boxRef.current.position.set(
          w.pos.x + f.x * 0.46,
          1.06 + Math.sin(state.clock.elapsedTime * 3.2) * 0.05,
          w.pos.z + f.z * 0.46
        );
        boxRef.current.rotation.set(0, w.heading, 0);
      }
    }
  });

  return (
    <group>
      <ArticulatedHuman3D style={style} team={team} read={read} />

      {/* Branded Chocolate Gift Box */}
      <group ref={boxRef} visible={false}>
        <mesh castShadow>
          <boxGeometry args={[0.42, 0.28, 0.32]} />
          <meshStandardMaterial color={team === 'blue' ? '#1d4ed8' : '#b91c1c'} roughness={0.5} />
        </mesh>
        {/* Golden Gift Ribbon */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.06, 0.285, 0.325]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
};

// ── 5. SEATED FORKLIFT DRIVER ───────────────────────────────────────────
// Seated in the forklift cab, hands on steering wheel and hydraulic levers.

export const SeatedDriver3D: React.FC<{ team: TeamId }> = ({ team }) => {
  const headRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 1.6) * 0.25;
    }
  });

  return (
    <group position={[0, 0.65, 0.24]}>
      {/* Thighs / Legs on Pedals */}
      <mesh position={[-0.12, 0.16, -0.22]} rotation={[-Math.PI / 2.8, 0, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.06, 0.38, 10]} />
        <meshStandardMaterial color="#1e3a8a" roughness={0.7} />
      </mesh>
      <mesh position={[0.12, 0.16, -0.22]} rotation={[-Math.PI / 2.8, 0, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.06, 0.38, 10]} />
        <meshStandardMaterial color="#1e3a8a" roughness={0.7} />
      </mesh>

      {/* Torso with Hi-Vis Vest */}
      <mesh position={[0, 0.44, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.17, 0.44, 12]} />
        <meshStandardMaterial color="#facc15" roughness={0.6} />
      </mesh>
      {/* Reflective Band */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.205, 0.2, 0.05, 12]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Arms Gripping Steering Wheel & Levers */}
      <mesh position={[-0.18, 0.44, -0.2]} rotation={[-0.7, 0.3, 0]}>
        <cylinderGeometry args={[0.05, 0.045, 0.36, 10]} />
        <meshStandardMaterial color={team === 'blue' ? '#1d4ed8' : '#b91c1c'} roughness={0.7} />
      </mesh>
      <mesh position={[0.18, 0.44, -0.2]} rotation={[-0.7, -0.3, 0]}>
        <cylinderGeometry args={[0.05, 0.045, 0.36, 10]} />
        <meshStandardMaterial color={team === 'blue' ? '#1d4ed8' : '#b91c1c'} roughness={0.7} />
      </mesh>

      {/* Head with Safety Hardhat */}
      <group ref={headRef} position={[0, 0.82, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.15, 14, 12]} />
          <meshStandardMaterial color="#e0ac69" roughness={0.65} />
        </mesh>
        {/* Safety Hardhat */}
        <mesh position={[0, 0.06, 0]} castShadow>
          <sphereGeometry args={[0.175, 14, 12]} />
          <meshStandardMaterial color={team === 'blue' ? '#3b82f6' : '#ef4444'} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.02, 0.08]} rotation={[0.2, 0, 0]}>
          <boxGeometry args={[0.2, 0.025, 0.12]} />
          <meshStandardMaterial color={team === 'blue' ? '#3b82f6' : '#ef4444'} roughness={0.4} />
        </mesh>
      </group>
    </group>
  );
};
