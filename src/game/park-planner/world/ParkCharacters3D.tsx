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
  isCycling?: boolean;
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
  isCycling = false,
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
    const t = state.clock.getElapsedTime() * (isJogging ? 10 : isWalking ? 6 : isCycling ? 8 : 1) * speed;

    if (isCycling) {
      // Dynamic pedaling legs in opposition & arms grasping handlebars
      if (leftLegRef.current) {
        leftLegRef.current.rotation.x = 0.65 + Math.sin(t) * 0.38;
      }
      if (rightLegRef.current) {
        rightLegRef.current.rotation.x = 0.65 - Math.sin(t) * 0.38;
      }
      if (leftArmRef.current) leftArmRef.current.rotation.x = 0.62;
      if (rightArmRef.current) rightArmRef.current.rotation.x = 0.62;
      if (headRef.current) headRef.current.rotation.x = 0.08;
      if (rootRef.current) rootRef.current.position.y = position[1] - 0.22;
      return;
    }

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
      {/* UPPER BODY: Torso & Shoulders */}
      {/* ============================================================ */}
      <group position={[0, 0.95, 0]}>
        {/* Torso Shirt */}
        <mesh castShadow position={[0, 0.12, 0]}>
          <boxGeometry args={[0.34, 0.42, 0.22]} />
          <meshStandardMaterial color={shirtColor} roughness={0.7} />
        </mesh>

        {/* Safety Vest Over Shirt */}
        {hasSafetyVest && (
          <group position={[0, 0.12, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.35, 0.4, 0.23]} />
              <meshStandardMaterial color="#ea580c" roughness={0.5} />
            </mesh>
            {/* Hi-Vis Yellow Reflective Stripes */}
            <mesh position={[0, 0.08, 0.12]}>
              <boxGeometry args={[0.36, 0.04, 0.01]} />
              <meshStandardMaterial color="#facc15" emissive="#ca8a04" emissiveIntensity={0.3} />
            </mesh>
            <mesh position={[0, -0.08, 0.12]}>
              <boxGeometry args={[0.36, 0.04, 0.01]} />
              <meshStandardMaterial color="#facc15" emissive="#ca8a04" emissiveIntensity={0.3} />
            </mesh>
          </group>
        )}
      </group>

      {/* ============================================================ */}
      {/* ARMS & HANDS */}
      {/* ============================================================ */}
      {/* Left Arm */}
      <group position={[-0.21, 1.25, 0]} ref={leftArmRef}>
        {/* Upper Arm Sleeve */}
        <mesh castShadow position={[0, -0.16, 0]}>
          <cylinderGeometry args={[0.045, 0.04, 0.28, 8]} />
          <meshStandardMaterial color={shirtColor} roughness={0.7} />
        </mesh>
        {/* Forearm & Hand */}
        <mesh castShadow position={[0, -0.4, 0]}>
          <cylinderGeometry args={[0.038, 0.035, 0.28, 8]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} />
        </mesh>
      </group>

      {/* Right Arm */}
      <group position={[0.21, 1.25, 0]} ref={rightArmRef}>
        {/* Upper Arm Sleeve */}
        <mesh castShadow position={[0, -0.16, 0]}>
          <cylinderGeometry args={[0.045, 0.04, 0.28, 8]} />
          <meshStandardMaterial color={shirtColor} roughness={0.7} />
        </mesh>
        {/* Forearm & Hand */}
        <mesh castShadow position={[0, -0.4, 0]}>
          <cylinderGeometry args={[0.038, 0.035, 0.28, 8]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} />
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
    // Pure rolling motion around the axle (X-axis) in the YZ plane
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
        {/* Front Wheel Assembly (Z = +0.55m) */}
        <group position={[0, 0, 0.55]} ref={wheelFrontRef}>
          {/* Rubber Tire: Oriented with normal along X (in YZ plane) so it ROLLS forward */}
          <mesh castShadow rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.3, 0.032, 12, 32]} />
            <meshStandardMaterial color="#0f172a" roughness={0.9} />
          </mesh>
          {/* Wheel Axle Hub (Cylinder along X) */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.03, 0.03, 0.09, 12]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.8} />
          </mesh>
          {/* Spokes in YZ Plane */}
          <mesh>
            <cylinderGeometry args={[0.005, 0.005, 0.58, 4]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.6} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.005, 0.005, 0.58, 4]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.6} />
          </mesh>
          <mesh rotation={[Math.PI / 4, 0, 0]}>
            <cylinderGeometry args={[0.005, 0.005, 0.58, 4]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.6} />
          </mesh>
          <mesh rotation={[-Math.PI / 4, 0, 0]}>
            <cylinderGeometry args={[0.005, 0.005, 0.58, 4]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.6} />
          </mesh>
        </group>

        {/* Rear Wheel Assembly (Z = -0.55m) */}
        <group position={[0, 0, -0.55]} ref={wheelRearRef}>
          {/* Rubber Tire: Oriented in YZ plane so it ROLLS forward */}
          <mesh castShadow rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.3, 0.032, 12, 32]} />
            <meshStandardMaterial color="#0f172a" roughness={0.9} />
          </mesh>
          {/* Wheel Axle Hub */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.03, 0.03, 0.09, 12]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.8} />
          </mesh>
          {/* Spokes in YZ Plane */}
          <mesh>
            <cylinderGeometry args={[0.005, 0.005, 0.58, 4]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.6} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.005, 0.005, 0.58, 4]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.6} />
          </mesh>
          <mesh rotation={[Math.PI / 4, 0, 0]}>
            <cylinderGeometry args={[0.005, 0.005, 0.58, 4]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.6} />
          </mesh>
          <mesh rotation={[-Math.PI / 4, 0, 0]}>
            <cylinderGeometry args={[0.005, 0.005, 0.58, 4]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.6} />
          </mesh>
        </group>

        {/* Diamond Frame Tubes */}
        {/* Top Tube */}
        <mesh position={[0, 0.32, 0]} rotation={[0.1, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.85, 8]} />
          <meshStandardMaterial color="#0284c7" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Down Tube */}
        <mesh position={[0, 0.15, 0.15]} rotation={[-0.6, 0, 0]}>
          <cylinderGeometry args={[0.024, 0.024, 0.88, 8]} />
          <meshStandardMaterial color="#0284c7" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Seat Tube */}
        <mesh position={[0, 0.18, -0.15]} rotation={[0.3, 0, 0]}>
          <cylinderGeometry args={[0.022, 0.022, 0.72, 8]} />
          <meshStandardMaterial color="#0284c7" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Front Fork */}
        <mesh position={[0, 0.12, 0.5]} rotation={[-0.25, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.68, 8]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} />
        </mesh>

        {/* Handlebars */}
        <group position={[0, 0.46, 0.44]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.018, 0.018, 0.44, 8]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          {/* Grips */}
          <mesh position={[-0.21, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.022, 0.022, 0.08, 8]} />
            <meshStandardMaterial color="#f43f5e" />
          </mesh>
          <mesh position={[0.21, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.022, 0.022, 0.08, 8]} />
            <meshStandardMaterial color="#f43f5e" />
          </mesh>
        </group>

        {/* Bicycle Saddle Seat */}
        <mesh position={[0, 0.42, -0.22]} rotation={[-0.1, 0, 0]}>
          <boxGeometry args={[0.14, 0.04, 0.22]} />
          <meshStandardMaterial color="#0f172a" roughness={0.6} />
        </mesh>

        {/* Bottom Bracket & Rotating Pedals */}
        <group position={[0, -0.1, -0.05]} ref={pedalsRef}>
          {/* Crank Axle */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.015, 0.015, 0.28, 8]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.8} />
          </mesh>
          {/* Left Pedal */}
          <mesh position={[0.16, 0.08, 0]}>
            <boxGeometry args={[0.08, 0.02, 0.09]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          {/* Right Pedal */}
          <mesh position={[-0.16, -0.08, 0]}>
            <boxGeometry args={[0.08, 0.02, 0.09]} />
            <meshStandardMaterial color="#1e293b" />
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
          isCycling={true}
        />
      </group>
    </group>
  );
};
