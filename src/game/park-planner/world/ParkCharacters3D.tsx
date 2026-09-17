// ============================================================
// PARK PLANNER — High-Fidelity 3D Characters & Human Locomotion
// Detailed anatomical humans (head, eyes, hair, limbs, shoes, varied clothing)
// with true forward-facing kinematics and zero sideways sliding.
// ============================================================

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

// ------------------------------------------------------------
// 1. MODULAR HUMAN BODY CHARACTER
// ------------------------------------------------------------
export interface HumanCharacterProps {
  position?: [number, number, number];
  rotationY?: number;
  scale?: number;
  shirtColor?: string;
  pantsColor?: string;
  shoesColor?: string;
  hairColor?: string;
  skinColor?: string;
  hasHardHat?: boolean;
  hasSafetyVest?: boolean;
  hasHelmet?: boolean;
  hasHeadband?: boolean;
  isJogging?: boolean;
  isWalking?: boolean;
  isSeated?: boolean;
  isHammering?: boolean;
  speed?: number;
}

export const StylizedHuman3D: React.FC<HumanCharacterProps> = ({
  position = [0, 0, 0],
  rotationY = 0,
  scale = 1,
  shirtColor = '#3b82f6',
  pantsColor = '#1e293b',
  shoesColor = '#f8fafc',
  hairColor = '#451a03',
  skinColor = '#fcd34d',
  hasHardHat = false,
  hasSafetyVest = false,
  hasHelmet = false,
  hasHeadband = false,
  isJogging = false,
  isWalking = true,
  isSeated = false,
  isHammering = false,
  speed = 1,
}) => {
  const rootRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * (isJogging ? 10 : isWalking ? 6 : 1) * speed;

    if (isSeated) {
      // Fixed seated pose
      if (leftLegRef.current) leftLegRef.current.rotation.x = Math.PI / 2;
      if (rightLegRef.current) rightLegRef.current.rotation.x = Math.PI / 2;
      if (leftArmRef.current) leftArmRef.current.rotation.x = 0.3;
      if (rightArmRef.current) rightArmRef.current.rotation.x = 0.3;
      if (rootRef.current) rootRef.current.position.y = position[1] - 0.25;
      return;
    }

    if (isHammering) {
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = -Math.PI / 3 + Math.sin(t * 2) * 0.6;
      }
      if (leftArmRef.current) leftArmRef.current.rotation.x = 0.2;
      return;
    }

    if (isWalking || isJogging) {
      const legAmp = isJogging ? 0.65 : 0.45;
      const armAmp = isJogging ? 0.55 : 0.35;
      const swing = Math.sin(t);

      // Legs swing in opposition
      if (leftLegRef.current) leftLegRef.current.rotation.x = swing * legAmp;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -swing * legAmp;

      // Arms counter-swing
      if (leftArmRef.current) leftArmRef.current.rotation.x = -swing * armAmp;
      if (rightArmRef.current) rightArmRef.current.rotation.x = swing * armAmp;

      // Subtle vertical bounce & torso tilt
      if (rootRef.current) {
        const bounce = Math.abs(Math.sin(t)) * (isJogging ? 0.06 : 0.03);
        rootRef.current.position.y = position[1] + bounce;
      }
    }
  });

  return (
    <group ref={rootRef} position={position} rotation={[0, rotationY, 0]} scale={[scale, scale, scale]}>
      {/* ============================================================ */}
      {/* LOWER BODY: Hips & Legs */}
      {/* ============================================================ */}
      {/* Hips / Waist */}
      <mesh castShadow position={[0, 0.72, 0]}>
        <boxGeometry args={[0.3, 0.16, 0.2]} />
        <meshStandardMaterial color={pantsColor} roughness={0.7} />
      </mesh>

      {/* Left Leg Assembly */}
      <group position={[-0.09, 0.68, 0]} ref={leftLegRef}>
        {/* Thigh */}
        <mesh castShadow position={[0, -0.22, 0]}>
          <cylinderGeometry args={[0.06, 0.05, 0.4, 8]} />
          <meshStandardMaterial color={pantsColor} roughness={0.7} />
        </mesh>
        {/* Calf & Foot */}
        <mesh castShadow position={[0, -0.52, 0]}>
          <cylinderGeometry args={[0.048, 0.045, 0.38, 8]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} />
        </mesh>
        {/* Shoe */}
        <mesh castShadow position={[0, -0.7, 0.05]}>
          <boxGeometry args={[0.08, 0.08, 0.18]} />
          <meshStandardMaterial color={shoesColor} roughness={0.5} />
        </mesh>
      </group>

      {/* Right Leg Assembly */}
      <group position={[0.09, 0.68, 0]} ref={rightLegRef}>
        {/* Thigh */}
        <mesh castShadow position={[0, -0.22, 0]}>
          <cylinderGeometry args={[0.06, 0.05, 0.4, 8]} />
          <meshStandardMaterial color={pantsColor} roughness={0.7} />
        </mesh>
        {/* Calf & Foot */}
        <mesh castShadow position={[0, -0.52, 0]}>
          <cylinderGeometry args={[0.048, 0.045, 0.38, 8]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} />
        </mesh>
        {/* Shoe */}
        <mesh castShadow position={[0, -0.7, 0.05]}>
          <boxGeometry args={[0.08, 0.08, 0.18]} />
          <meshStandardMaterial color={shoesColor} roughness={0.5} />
        </mesh>
      </group>

      {/* ============================================================ */}
      {/* UPPER BODY: Torso, Vest & Arms */}
      {/* ============================================================ */}
      {/* Torso */}
      <mesh castShadow position={[0, 1.05, 0]}>
        <boxGeometry args={[0.34, 0.48, 0.22]} />
        <meshStandardMaterial color={hasSafetyVest ? '#ea580c' : shirtColor} roughness={0.6} />
      </mesh>

      {/* Safety Vest Reflective Stripes */}
      {hasSafetyVest && (
        <group position={[0, 1.05, 0]}>
          <mesh position={[0, 0.08, 0.115]}>
            <boxGeometry args={[0.32, 0.06, 0.01]} />
            <meshStandardMaterial color="#facc15" emissive="#facc15" emissiveIntensity={0.4} />
          </mesh>
          <mesh position={[0, -0.08, 0.115]}>
            <boxGeometry args={[0.32, 0.06, 0.01]} />
            <meshStandardMaterial color="#facc15" emissive="#facc15" emissiveIntensity={0.4} />
          </mesh>
        </group>
      )}

      {/* Left Arm */}
      <group position={[-0.22, 1.22, 0]} ref={leftArmRef}>
        <mesh castShadow position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.045, 0.04, 0.42, 8]} />
          <meshStandardMaterial color={hasSafetyVest ? '#ea580c' : shirtColor} />
        </mesh>
        {/* Hand */}
        <mesh castShadow position={[0, -0.42, 0]}>
          <sphereGeometry args={[0.042, 6, 6]} />
          <meshStandardMaterial color={skinColor} />
        </mesh>
      </group>

      {/* Right Arm */}
      <group position={[0.22, 1.22, 0]} ref={rightArmRef}>
        <mesh castShadow position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.045, 0.04, 0.42, 8]} />
          <meshStandardMaterial color={hasSafetyVest ? '#ea580c' : shirtColor} />
        </mesh>
        {/* Hand */}
        <mesh castShadow position={[0, -0.42, 0]}>
          <sphereGeometry args={[0.042, 6, 6]} />
          <meshStandardMaterial color={skinColor} />
        </mesh>
      </group>

      {/* ============================================================ */}
      {/* HEAD, FACE & ACCESSORIES */}
      {/* ============================================================ */}
      <group position={[0, 1.45, 0]} ref={headRef}>
        {/* Neck */}
        <mesh castShadow position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.045, 0.05, 0.1, 8]} />
          <meshStandardMaterial color={skinColor} />
        </mesh>
        {/* Head Cranium */}
        <mesh castShadow position={[0, 0.04, 0]}>
          <sphereGeometry args={[0.13, 12, 12]} />
          <meshStandardMaterial color={skinColor} roughness={0.5} />
        </mesh>

        {/* Eyes */}
        <mesh position={[-0.045, 0.06, 0.11]}>
          <sphereGeometry args={[0.02, 6, 6]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0.045, 0.06, 0.11]}>
          <sphereGeometry args={[0.02, 6, 6]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>

        {/* Hair Styles */}
        {!hasHardHat && !hasHelmet && (
          <mesh castShadow position={[0, 0.1, -0.02]}>
            <sphereGeometry args={[0.135, 10, 10, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
            <meshStandardMaterial color={hairColor} roughness={0.8} />
          </mesh>
        )}

        {/* Headband for Joggers */}
        {hasHeadband && (
          <mesh position={[0, 0.08, 0]}>
            <torusGeometry args={[0.132, 0.02, 6, 12]} />
            <meshStandardMaterial color="#f43f5e" />
          </mesh>
        )}

        {/* Construction Hard Hat */}
        {hasHardHat && (
          <group position={[0, 0.08, 0]}>
            <mesh castShadow>
              <sphereGeometry args={[0.15, 10, 10, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
              <meshStandardMaterial color="#facc15" roughness={0.3} metalness={0.2} />
            </mesh>
            <mesh position={[0, -0.01, 0.04]} rotation={[0.1, 0, 0]}>
              <boxGeometry args={[0.32, 0.02, 0.34]} />
              <meshStandardMaterial color="#facc15" />
            </mesh>
          </group>
        )}

        {/* Cyclist Helmet */}
        {hasHelmet && (
          <mesh castShadow position={[0, 0.08, -0.02]}>
            <sphereGeometry args={[0.155, 10, 10, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
            <meshStandardMaterial color="#0284c7" metalness={0.4} roughness={0.3} />
          </mesh>
        )}
      </group>
    </group>
  );
};

// ------------------------------------------------------------
// 2. DEDICATED REALISTIC CYCLIST & BICYCLE
// ------------------------------------------------------------
export interface RealisticCyclistProps {
  position: [number, number, number];
  rotationY: number;
  speed?: number;
}

export const RealisticCyclist3D: React.FC<RealisticCyclistProps> = ({
  position,
  rotationY,
  speed = 1.0,
}) => {
  const wheelFrontRef = useRef<THREE.Group>(null);
  const wheelRearRef = useRef<THREE.Group>(null);
  const pedalsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * 8 * speed;
    if (wheelFrontRef.current) wheelFrontRef.current.rotation.x = t;
    if (wheelRearRef.current) wheelRearRef.current.rotation.x = t;
    if (pedalsRef.current) pedalsRef.current.rotation.x = t;
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* ============================================================ */}
      {/* BICYCLE GEOMETRY */}
      {/* ============================================================ */}
      <group position={[0, 0.35, 0]}>
        {/* Front Wheel (Z = +0.55m) */}
        <group position={[0, 0, 0.55]} ref={wheelFrontRef}>
          {/* Rubber Tire */}
          <mesh castShadow>
            <torusGeometry args={[0.3, 0.03, 8, 20]} />
            <meshStandardMaterial color="#0f172a" roughness={0.9} />
          </mesh>
          {/* Wheel Hub & Spokes */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.03, 0.03, 0.08, 8]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.8} />
          </mesh>
          <mesh>
            <cylinderGeometry args={[0.006, 0.006, 0.58, 4]} />
            <meshStandardMaterial color="#94a3b8" />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.006, 0.006, 0.58, 4]} />
            <meshStandardMaterial color="#94a3b8" />
          </mesh>
        </group>

        {/* Rear Wheel (Z = -0.55m) */}
        <group position={[0, 0, -0.55]} ref={wheelRearRef}>
          <mesh castShadow>
            <torusGeometry args={[0.3, 0.03, 8, 20]} />
            <meshStandardMaterial color="#0f172a" roughness={0.9} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.03, 0.03, 0.08, 8]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.8} />
          </mesh>
          <mesh>
            <cylinderGeometry args={[0.006, 0.006, 0.58, 4]} />
            <meshStandardMaterial color="#94a3b8" />
          </mesh>
        </group>

        {/* Diamond Frame Tubes (Painted Cyan / Red) */}
        {/* Top Tube */}
        <mesh position={[0, 0.32, 0]} rotation={[0.1, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.85, 6]} />
          <meshStandardMaterial color="#0284c7" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Down Tube */}
        <mesh position={[0, 0.15, 0.15]} rotation={[-0.6, 0, 0]}>
          <cylinderGeometry args={[0.024, 0.024, 0.88, 6]} />
          <meshStandardMaterial color="#0284c7" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Seat Tube */}
        <mesh position={[0, 0.18, -0.15]} rotation={[0.3, 0, 0]}>
          <cylinderGeometry args={[0.022, 0.022, 0.72, 6]} />
          <meshStandardMaterial color="#0284c7" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Front Fork */}
        <mesh position={[0, 0.12, 0.5]} rotation={[-0.25, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.68, 6]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} />
        </mesh>

        {/* Handlebars */}
        <group position={[0, 0.46, 0.44]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.018, 0.018, 0.42, 6]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
        </group>

        {/* Bicycle Saddle Seat */}
        <mesh position={[0, 0.42, -0.22]} rotation={[-0.1, 0, 0]}>
          <boxGeometry args={[0.14, 0.04, 0.22]} />
          <meshStandardMaterial color="#0f172a" roughness={0.6} />
        </mesh>

        {/* Bottom Bracket & Pedals */}
        <group position={[0, -0.1, -0.05]} ref={pedalsRef}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.015, 0.015, 0.28, 6]} />
            <meshStandardMaterial color="#94a3b8" />
          </mesh>
        </group>
      </group>

      {/* ============================================================ */}
      {/* CYCLIST RIDER MODEL */}
      {/* ============================================================ */}
      <group position={[0, 0.15, -0.1]}>
        <StylizedHuman3D
          position={[0, 0, 0]}
          scale={0.88}
          shirtColor="#0284c7"
          pantsColor="#0f172a"
          hasHelmet={true}
          isWalking={false}
          isSeated={true}
        />
      </group>
    </group>
  );
};
