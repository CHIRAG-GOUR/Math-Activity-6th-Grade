'use client';

// ============================================================
// THE SOLAR FORGE: Realistic Party Humanoid 3D
// Fully articulated human figures with detailed facial features
// (sclera + pupils, sculpted nose, smile, ears, realistic hairstyles,
// party neon sunglasses), anatomical bodies (collar, chest, waist, belt,
// multi-joint limbs, and designer sneakers) and expressive 128 BPM dance kinematics.
// ============================================================

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface RealisticPartyHuman3DProps {
  position: [number, number, number];
  rotationY?: number;
  scale?: number;
  role:
    | 'lead_dancer'
    | 'partner_dancer'
    | 'groove_dancer'
    | 'dj'
    | 'balcony_flag'
    | 'balcony_cheerer'
    | 'porch_hype'
    | 'porch_dancer';
  skinTone?: string;
  hairStyle?: 'pompadour' | 'ponytail' | 'curly' | 'cap' | 'headphones' | 'short';
  hairColor?: string;
  shirtColor: string;
  accentColor: string;
  pantsColor?: string;
  isPartyActive: boolean;
  winnerTeam: 'blue' | 'red';
}

export const RealisticPartyHuman3D: React.FC<RealisticPartyHuman3DProps> = ({
  position,
  rotationY = 0,
  scale = 1.0,
  role,
  skinTone = '#f5d0b5',
  hairStyle = 'pompadour',
  hairColor = '#1e1b18',
  shirtColor,
  accentColor,
  pantsColor = '#0f172a',
  isPartyActive,
  winnerTeam,
}) => {
  // Animation Node Refs
  const rootRef = useRef<THREE.Group>(null);
  const pelvisRef = useRef<THREE.Group>(null);
  const torsoRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const leftForearmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const rightForearmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const accessoryRef = useRef<THREE.Group>(null);

  const isBlue = winnerTeam === 'blue';
  const neonGlow = isBlue ? '#00f5ff' : '#ff0055';
  const shoeAccent = isBlue ? '#38bdf8' : '#f87171';

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (isPartyActive) {
      // ── HIGH-ENERGY 128 BPM DANCE KINEMATICS (~8.0 rad/s) ──
      const beat = t * 8.2;
      const halfBeat = beat * 0.5;

      // 1. Pelvis / Hips Bounce & Sway
      if (pelvisRef.current) {
        pelvisRef.current.position.y = Math.abs(Math.sin(beat)) * 0.22;
        pelvisRef.current.rotation.z = Math.sin(halfBeat) * 0.12;
        pelvisRef.current.rotation.y = Math.cos(halfBeat) * 0.15;
      }

      // 2. Torso counter-sway (organic human rhythm)
      if (torsoRef.current) {
        torsoRef.current.rotation.z = -Math.sin(halfBeat) * 0.08;
        torsoRef.current.rotation.x = Math.abs(Math.sin(beat)) * 0.06;
      }

      // 3. Head Bobbing & nodding
      if (headRef.current) {
        headRef.current.rotation.x = Math.sin(beat) * 0.14;
        headRef.current.rotation.y = Math.sin(halfBeat * 0.7) * 0.18;
      }

      // 4. Role-Specific Choreography
      switch (role) {
        case 'lead_dancer': {
          // Energetic jumping jacks & alternating high fist pumps
          if (rightArmRef.current) {
            rightArmRef.current.rotation.x = -2.2 + Math.sin(beat) * 0.6;
            rightArmRef.current.rotation.z = -0.3 + Math.cos(halfBeat) * 0.2;
          }
          if (leftArmRef.current) {
            leftArmRef.current.rotation.x = -2.2 + Math.sin(beat + Math.PI) * 0.6;
            leftArmRef.current.rotation.z = 0.3 - Math.cos(halfBeat) * 0.2;
          }
          if (rootRef.current) {
            rootRef.current.position.x = position[0] + Math.sin(halfBeat * 0.5) * 0.3;
            rootRef.current.rotation.y = rotationY + Math.sin(halfBeat * 0.5) * 0.4;
          }
          break;
        }

        case 'partner_dancer': {
          // Sweeping dual glowsticks in wide celebratory arcs
          if (rightArmRef.current) {
            rightArmRef.current.rotation.x = -1.4 + Math.sin(halfBeat) * 0.5;
            rightArmRef.current.rotation.y = 0.4 + Math.cos(beat) * 0.4;
            rightArmRef.current.rotation.z = -0.5;
          }
          if (leftArmRef.current) {
            leftArmRef.current.rotation.x = -1.4 + Math.cos(halfBeat) * 0.5;
            leftArmRef.current.rotation.y = -0.4 - Math.sin(beat) * 0.4;
            leftArmRef.current.rotation.z = 0.5;
          }
          if (leftForearmRef.current) leftForearmRef.current.rotation.x = -0.6 + Math.sin(beat) * 0.3;
          if (rightForearmRef.current) rightForearmRef.current.rotation.x = -0.6 + Math.cos(beat) * 0.3;
          break;
        }

        case 'groove_dancer': {
          // Smooth side-stepping and chest popping
          if (rightArmRef.current) {
            rightArmRef.current.rotation.x = -0.8 + Math.sin(halfBeat) * 0.4;
            rightArmRef.current.rotation.z = -0.6 + Math.sin(beat) * 0.3;
          }
          if (leftArmRef.current) {
            leftArmRef.current.rotation.x = -0.8 - Math.sin(halfBeat) * 0.4;
            leftArmRef.current.rotation.z = 0.6 - Math.sin(beat) * 0.3;
          }
          break;
        }

        case 'dj': {
          // Headphone scratching & hyping crowd
          if (headRef.current) {
            headRef.current.rotation.x = 0.25 + Math.sin(beat * 1.5) * 0.15;
            headRef.current.rotation.z = -0.15; // Leaning into headphone
          }
          // Left hand on turntable scratching
          if (leftArmRef.current) {
            leftArmRef.current.rotation.x = -1.1;
            leftArmRef.current.rotation.y = 0.3;
            leftArmRef.current.rotation.z = 0.4;
          }
          if (leftForearmRef.current) {
            leftForearmRef.current.rotation.y = Math.sin(beat * 2) * 0.4;
          }
          // Right arm pumping high hyping the dancers
          if (rightArmRef.current) {
            rightArmRef.current.rotation.x = -2.4 + Math.sin(beat) * 0.5;
            rightArmRef.current.rotation.z = -0.3;
          }
          break;
        }

        case 'balcony_flag': {
          // Waving giant winner banner over the desert
          if (rightArmRef.current) {
            rightArmRef.current.rotation.x = -1.8 + Math.sin(t * 4) * 0.4;
            rightArmRef.current.rotation.z = -0.4 + Math.cos(t * 3.5) * 0.5;
          }
          if (leftArmRef.current) {
            leftArmRef.current.rotation.x = -1.6;
            leftArmRef.current.rotation.z = 0.4;
          }
          if (accessoryRef.current) {
            accessoryRef.current.rotation.y = Math.sin(t * 5) * 0.35;
          }
          break;
        }

        case 'balcony_cheerer': {
          // Double victory hands high, cheering
          if (rightArmRef.current) {
            rightArmRef.current.rotation.x = -2.6 + Math.sin(beat) * 0.3;
            rightArmRef.current.rotation.z = -0.5;
          }
          if (leftArmRef.current) {
            leftArmRef.current.rotation.x = -2.6 + Math.sin(beat + 0.5) * 0.3;
            leftArmRef.current.rotation.z = 0.5;
          }
          break;
        }

        case 'porch_hype': {
          // Welcoming and hyping visitors at front steps
          if (rightArmRef.current) {
            rightArmRef.current.rotation.x = -1.2 + Math.sin(halfBeat) * 0.4;
            rightArmRef.current.rotation.y = -0.4;
            rightArmRef.current.rotation.z = -0.4;
          }
          if (leftArmRef.current) {
            leftArmRef.current.rotation.x = -1.2 - Math.sin(halfBeat) * 0.4;
            leftArmRef.current.rotation.y = 0.4;
            leftArmRef.current.rotation.z = 0.4;
          }
          break;
        }

        case 'porch_dancer': {
          // Rhythmic bounce on front steps
          if (rightArmRef.current) {
            rightArmRef.current.rotation.x = -1.5 + Math.sin(beat) * 0.4;
          }
          if (leftArmRef.current) {
            leftArmRef.current.rotation.x = -1.5 - Math.sin(beat) * 0.4;
          }
          break;
        }
      }
    } else {
      // ── CALM DESERT DAYTIME IDLE (NATURAL BREATHING) ──
      if (pelvisRef.current) {
        pelvisRef.current.position.y = 0;
        pelvisRef.current.rotation.set(0, 0, 0);
      }
      if (torsoRef.current) {
        torsoRef.current.rotation.set(Math.sin(t * 1.5) * 0.02, 0, 0);
      }
      if (headRef.current) {
        headRef.current.rotation.set(0, Math.sin(t * 0.6) * 0.15, 0);
      }
      if (rightArmRef.current) rightArmRef.current.rotation.set(0.1, 0, -0.1);
      if (leftArmRef.current) leftArmRef.current.rotation.set(0.1, 0, 0.1);
    }
  });

  return (
    <group ref={rootRef} position={position} rotation={[0, rotationY, 0]} scale={[scale, scale, scale]}>
      {/* ── 1. DESIGNER SNEAKERS (FOOTWEAR) ── */}
      {/* Left Sneaker */}
      <group position={[-0.14, 0.06, 0.04]}>
        {/* White Rubber Midsole */}
        <mesh position={[0, -0.02, 0]} castShadow>
          <boxGeometry args={[0.13, 0.05, 0.28]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.4} />
        </mesh>
        {/* Stylish Upper Shoe */}
        <mesh position={[0, 0.04, -0.01]} castShadow>
          <boxGeometry args={[0.12, 0.09, 0.25]} />
          <meshStandardMaterial color={pantsColor} roughness={0.6} />
        </mesh>
        {/* Sneaker Toe Cap & Accent Stripe */}
        <mesh position={[0, 0.03, 0.1]}>
          <boxGeometry args={[0.11, 0.06, 0.07]} />
          <meshStandardMaterial color={shoeAccent} roughness={0.5} />
        </mesh>
      </group>

      {/* Right Sneaker */}
      <group position={[0.14, 0.06, 0.04]}>
        <mesh position={[0, -0.02, 0]} castShadow>
          <boxGeometry args={[0.13, 0.05, 0.28]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.04, -0.01]} castShadow>
          <boxGeometry args={[0.12, 0.09, 0.25]} />
          <meshStandardMaterial color={pantsColor} roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.03, 0.1]}>
          <boxGeometry args={[0.11, 0.06, 0.07]} />
          <meshStandardMaterial color={shoeAccent} roughness={0.5} />
        </mesh>
      </group>

      {/* ── 2. LEGS & JEANS/TROUSERS ── */}
      {/* Left Leg */}
      <group ref={leftLegRef} position={[-0.14, 0.44, 0]}>
        {/* Calf */}
        <mesh position={[0, -0.15, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.06, 0.36, 10]} />
          <meshStandardMaterial color={pantsColor} roughness={0.8} />
        </mesh>
        {/* Knee joint */}
        <mesh position={[0, 0.05, 0]}>
          <sphereGeometry args={[0.075, 8, 8]} />
          <meshStandardMaterial color={pantsColor} roughness={0.8} />
        </mesh>
        {/* Thigh */}
        <mesh position={[0, 0.24, 0]} castShadow>
          <cylinderGeometry args={[0.085, 0.075, 0.36, 10]} />
          <meshStandardMaterial color={pantsColor} roughness={0.8} />
        </mesh>
      </group>

      {/* Right Leg */}
      <group ref={rightLegRef} position={[0.14, 0.44, 0]}>
        {/* Calf */}
        <mesh position={[0, -0.15, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.06, 0.36, 10]} />
          <meshStandardMaterial color={pantsColor} roughness={0.8} />
        </mesh>
        {/* Knee joint */}
        <mesh position={[0, 0.05, 0]}>
          <sphereGeometry args={[0.075, 8, 8]} />
          <meshStandardMaterial color={pantsColor} roughness={0.8} />
        </mesh>
        {/* Thigh */}
        <mesh position={[0, 0.24, 0]} castShadow>
          <cylinderGeometry args={[0.085, 0.075, 0.36, 10]} />
          <meshStandardMaterial color={pantsColor} roughness={0.8} />
        </mesh>
      </group>

      {/* ── 3. PELVIS & WAIST (BOUNCING HIP ROOT) ── */}
      <group ref={pelvisRef} position={[0, 0.88, 0]}>
        {/* Pelvis Structure */}
        <mesh castShadow>
          <boxGeometry args={[0.38, 0.16, 0.22]} />
          <meshStandardMaterial color={pantsColor} roughness={0.8} />
        </mesh>
        {/* Belt */}
        <mesh position={[0, 0.08, 0]}>
          <boxGeometry args={[0.39, 0.04, 0.23]} />
          <meshStandardMaterial color="#1e1b18" roughness={0.5} />
        </mesh>
        {/* Titanium Belt Buckle */}
        <mesh position={[0, 0.08, 0.12]}>
          <boxGeometry args={[0.08, 0.05, 0.02]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* ── 4. TORSO & STYLISH CLUBWEAR SHIRT/JACKET ── */}
        <group ref={torsoRef} position={[0, 0.28, 0]}>
          {/* Lower Waist */}
          <mesh position={[0, 0, 0]} castShadow>
            <boxGeometry args={[0.38, 0.24, 0.22]} />
            <meshStandardMaterial color={shirtColor} roughness={0.6} />
          </mesh>
          {/* Upper Chest */}
          <mesh position={[0, 0.22, 0]} castShadow>
            <boxGeometry args={[0.44, 0.26, 0.25]} />
            <meshStandardMaterial color={shirtColor} roughness={0.6} />
          </mesh>
          {/* Open V-Collar / Lapels */}
          <mesh position={[0, 0.33, 0.13]}>
            <boxGeometry args={[0.22, 0.08, 0.02]} />
            <meshStandardMaterial color={accentColor} />
          </mesh>
          {/* Team Glowing Chest Emblem / Seams */}
          <mesh position={[0, 0.22, 0.13]}>
            <boxGeometry args={[0.14, 0.14, 0.01]} />
            <meshStandardMaterial
              color={neonGlow}
              emissive={isPartyActive ? neonGlow : '#000000'}
              emissiveIntensity={isPartyActive ? 2.5 : 0}
            />
          </mesh>

          {/* ── 5. HEAD, NECK & FULL FACIAL ANATOMY ── */}
          <group ref={headRef} position={[0, 0.48, 0]}>
            {/* Neck */}
            <mesh position={[0, -0.06, 0]}>
              <cylinderGeometry args={[0.065, 0.075, 0.14, 12]} />
              <meshStandardMaterial color={skinTone} roughness={0.6} />
            </mesh>

            {/* Cranium / Head Structure */}
            <mesh position={[0, 0.08, 0]} castShadow>
              <sphereGeometry args={[0.13, 16, 16]} />
              <meshStandardMaterial color={skinTone} roughness={0.5} />
            </mesh>
            {/* Jaw / Chin */}
            <mesh position={[0, 0.02, 0.04]} castShadow>
              <boxGeometry args={[0.14, 0.11, 0.13]} />
              <meshStandardMaterial color={skinTone} roughness={0.5} />
            </mesh>

            {/* ── EYES (SCLERA + PUPILS) ── */}
            {/* Left Eye Sclera (White) */}
            <mesh position={[-0.045, 0.06, 0.115]}>
              <sphereGeometry args={[0.02, 10, 10]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            {/* Left Pupil (Dark) */}
            <mesh position={[-0.045, 0.06, 0.132]}>
              <sphereGeometry args={[0.011, 8, 8]} />
              <meshBasicMaterial color="#0f172a" />
            </mesh>
            {/* Right Eye Sclera (White) */}
            <mesh position={[0.045, 0.06, 0.115]}>
              <sphereGeometry args={[0.02, 10, 10]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            {/* Right Pupil (Dark) */}
            <mesh position={[0.045, 0.06, 0.132]}>
              <sphereGeometry args={[0.011, 8, 8]} />
              <meshBasicMaterial color="#0f172a" />
            </mesh>

            {/* Eyebrows */}
            <mesh position={[-0.045, 0.085, 0.12]} rotation={[0, 0, 0.05]}>
              <boxGeometry args={[0.042, 0.01, 0.015]} />
              <meshStandardMaterial color={hairColor} />
            </mesh>
            <mesh position={[0.045, 0.085, 0.12]} rotation={[0, 0, -0.05]}>
              <boxGeometry args={[0.042, 0.01, 0.015]} />
              <meshStandardMaterial color={hairColor} />
            </mesh>

            {/* ── 3D NOSE ── */}
            <mesh position={[0, 0.04, 0.135]}>
              <boxGeometry args={[0.025, 0.045, 0.03]} />
              <meshStandardMaterial color={skinTone} roughness={0.5} />
            </mesh>

            {/* ── JOYFUL PARTY SMILE ── */}
            <mesh position={[0, 0.005, 0.13]}>
              <boxGeometry args={[0.055, 0.016, 0.012]} />
              <meshStandardMaterial color="#991b1b" />
            </mesh>
            {/* White Teeth Line */}
            <mesh position={[0, 0.007, 0.134]}>
              <boxGeometry args={[0.042, 0.008, 0.01]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>

            {/* ── EARS ── */}
            <mesh position={[-0.13, 0.05, 0]}>
              <cylinderGeometry args={[0.02, 0.016, 0.04, 8]} />
              <meshStandardMaterial color={skinTone} roughness={0.6} />
            </mesh>
            <mesh position={[0.13, 0.05, 0]}>
              <cylinderGeometry args={[0.02, 0.016, 0.04, 8]} />
              <meshStandardMaterial color={skinTone} roughness={0.6} />
            </mesh>

            {/* ── REALISTIC HAIRSTYLES ── */}
            {hairStyle === 'pompadour' && (
              <group position={[0, 0.14, -0.01]}>
                <mesh castShadow>
                  <boxGeometry args={[0.24, 0.10, 0.22]} />
                  <meshStandardMaterial color={hairColor} roughness={0.8} />
                </mesh>
                {/* Front wave crest */}
                <mesh position={[0, 0.04, 0.06]}>
                  <boxGeometry args={[0.22, 0.06, 0.10]} />
                  <meshStandardMaterial color={hairColor} roughness={0.8} />
                </mesh>
              </group>
            )}

            {hairStyle === 'ponytail' && (
              <group position={[0, 0.14, 0]}>
                <mesh castShadow>
                  <sphereGeometry args={[0.135, 12, 12]} />
                  <meshStandardMaterial color={hairColor} roughness={0.8} />
                </mesh>
                {/* High Ponytail trailing behind */}
                <mesh position={[0, 0.02, -0.16]} rotation={[0.4, 0, 0]}>
                  <cylinderGeometry args={[0.035, 0.02, 0.28, 8]} />
                  <meshStandardMaterial color={hairColor} roughness={0.8} />
                </mesh>
                {/* Neon Hair Tie */}
                <mesh position={[0, 0.11, -0.1]}>
                  <torusGeometry args={[0.03, 0.01, 8, 12]} />
                  <meshStandardMaterial color={neonGlow} />
                </mesh>
              </group>
            )}

            {hairStyle === 'curly' && (
              <group position={[0, 0.14, 0]}>
                <mesh castShadow>
                  <sphereGeometry args={[0.15, 12, 12]} />
                  <meshStandardMaterial color={hairColor} roughness={0.9} />
                </mesh>
              </group>
            )}

            {hairStyle === 'cap' && (
              <group position={[0, 0.14, 0]}>
                <mesh position={[0, 0, 0]}>
                  <sphereGeometry args={[0.14, 14, 14, 0, Math.PI * 2, 0, Math.PI / 2]} />
                  <meshStandardMaterial color={shirtColor} roughness={0.5} />
                </mesh>
                {/* Backward Brim */}
                <mesh position={[0, -0.02, -0.14]}>
                  <boxGeometry args={[0.16, 0.02, 0.12]} />
                  <meshStandardMaterial color={accentColor} roughness={0.5} />
                </mesh>
              </group>
            )}

            {/* DJ Over-Ear Illuminated Headphones */}
            {hairStyle === 'headphones' && (
              <group position={[0, 0.06, 0]}>
                {/* Overhead padded band */}
                <mesh position={[0, 0.12, 0]}>
                  <torusGeometry args={[0.15, 0.02, 8, 18, Math.PI]} />
                  <meshStandardMaterial color="#0f172a" metalness={0.8} />
                </mesh>
                {/* Left Earcup */}
                <mesh position={[-0.15, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                  <cylinderGeometry args={[0.05, 0.05, 0.04, 16]} />
                  <meshStandardMaterial
                    color={neonGlow}
                    emissive={isPartyActive ? neonGlow : '#000000'}
                    emissiveIntensity={isPartyActive ? 2.5 : 0}
                  />
                </mesh>
                {/* Right Earcup */}
                <mesh position={[0.15, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                  <cylinderGeometry args={[0.05, 0.05, 0.04, 16]} />
                  <meshStandardMaterial
                    color={neonGlow}
                    emissive={isPartyActive ? neonGlow : '#000000'}
                    emissiveIntensity={isPartyActive ? 2.5 : 0}
                  />
                </mesh>
              </group>
            )}

            {/* ── PARTY NEON SUNGLASSES / SHADES ── */}
            {hairStyle !== 'headphones' && (
              <group position={[0, 0.06, 0.135]}>
                {/* Sleek Frame */}
                <mesh>
                  <boxGeometry args={[0.16, 0.035, 0.02]} />
                  <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.8} />
                </mesh>
                {/* Left Illuminated Lens */}
                <mesh position={[-0.04, 0, 0.01]}>
                  <boxGeometry args={[0.055, 0.028, 0.005]} />
                  <meshStandardMaterial
                    color={neonGlow}
                    emissive={isPartyActive ? neonGlow : '#000000'}
                    emissiveIntensity={isPartyActive ? 3.0 : 0}
                  />
                </mesh>
                {/* Right Illuminated Lens */}
                <mesh position={[0.04, 0, 0.01]}>
                  <boxGeometry args={[0.055, 0.028, 0.005]} />
                  <meshStandardMaterial
                    color={neonGlow}
                    emissive={isPartyActive ? neonGlow : '#000000'}
                    emissiveIntensity={isPartyActive ? 3.0 : 0}
                  />
                </mesh>
              </group>
            )}
          </group>

          {/* ── 6. LEFT ARM & HAND ── */}
          <group ref={leftArmRef} position={[-0.26, 0.32, 0]}>
            {/* Shoulder */}
            <mesh>
              <sphereGeometry args={[0.065, 8, 8]} />
              <meshStandardMaterial color={shirtColor} />
            </mesh>
            {/* Upper Arm */}
            <mesh position={[0, -0.16, 0]} castShadow>
              <cylinderGeometry args={[0.06, 0.052, 0.28, 8]} />
              <meshStandardMaterial color={shirtColor} />
            </mesh>
            {/* Elbow & Forearm */}
            <group ref={leftForearmRef} position={[0, -0.30, 0]}>
              <mesh>
                <sphereGeometry args={[0.052, 8, 8]} />
                <meshStandardMaterial color={skinTone} />
              </mesh>
              <mesh position={[0, -0.14, 0.02]} castShadow>
                <cylinderGeometry args={[0.05, 0.042, 0.26, 8]} />
                <meshStandardMaterial color={skinTone} />
              </mesh>
              {/* Hand & Palm */}
              <mesh position={[0, -0.30, 0.02]}>
                <boxGeometry args={[0.06, 0.07, 0.035]} />
                <meshStandardMaterial color={skinTone} />
              </mesh>
              {/* Optional Left Glowstick Wand */}
              {role === 'partner_dancer' && (
                <mesh position={[0, -0.36, 0.12]} rotation={[0.6, 0, 0]}>
                  <cylinderGeometry args={[0.02, 0.02, 0.42, 8]} />
                  <meshStandardMaterial
                    color={neonGlow}
                    emissive={isPartyActive ? neonGlow : '#000000'}
                    emissiveIntensity={isPartyActive ? 3.5 : 0}
                  />
                </mesh>
              )}
            </group>
          </group>

          {/* ── 7. RIGHT ARM & HAND ── */}
          <group ref={rightArmRef} position={[0.26, 0.32, 0]}>
            {/* Shoulder */}
            <mesh>
              <sphereGeometry args={[0.065, 8, 8]} />
              <meshStandardMaterial color={shirtColor} />
            </mesh>
            {/* Upper Arm */}
            <mesh position={[0, -0.16, 0]} castShadow>
              <cylinderGeometry args={[0.06, 0.052, 0.28, 8]} />
              <meshStandardMaterial color={shirtColor} />
            </mesh>
            {/* Elbow & Forearm */}
            <group ref={rightForearmRef} position={[0, -0.30, 0]}>
              <mesh>
                <sphereGeometry args={[0.052, 8, 8]} />
                <meshStandardMaterial color={skinTone} />
              </mesh>
              <mesh position={[0, -0.14, 0.02]} castShadow>
                <cylinderGeometry args={[0.05, 0.042, 0.26, 8]} />
                <meshStandardMaterial color={skinTone} />
              </mesh>
              {/* Hand & Palm */}
              <mesh position={[0, -0.30, 0.02]}>
                <boxGeometry args={[0.06, 0.07, 0.035]} />
                <meshStandardMaterial color={skinTone} />
              </mesh>
              {/* Right Hand Accessory: Glowstick or Flag */}
              {(role === 'partner_dancer' || role === 'lead_dancer') && (
                <mesh position={[0, -0.36, 0.12]} rotation={[0.6, 0, 0]}>
                  <cylinderGeometry args={[0.02, 0.02, 0.42, 8]} />
                  <meshStandardMaterial
                    color={neonGlow}
                    emissive={isPartyActive ? neonGlow : '#000000'}
                    emissiveIntensity={isPartyActive ? 3.5 : 0}
                  />
                </mesh>
              )}
              {role === 'balcony_flag' && (
                <group ref={accessoryRef} position={[0, -0.35, 0.2]} rotation={[0, 0, -0.4]}>
                  {/* Flagpole */}
                  <mesh position={[0, 0.4, 0]}>
                    <cylinderGeometry args={[0.018, 0.018, 1.2, 8]} />
                    <meshStandardMaterial color="#f8fafc" metalness={0.8} />
                  </mesh>
                  {/* Big Glowing Winner Team Pennant */}
                  <mesh position={[0.4, 0.7, 0]}>
                    <boxGeometry args={[0.75, 0.45, 0.02]} />
                    <meshStandardMaterial
                      color={neonGlow}
                      emissive={isPartyActive ? neonGlow : '#000000'}
                      emissiveIntensity={isPartyActive ? 2.5 : 0}
                    />
                  </mesh>
                </group>
              )}
            </group>
          </group>
        </group>
      </group>
    </group>
  );
};
