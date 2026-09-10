// ============================================================
// EQUATION MISSION CONTROL 2.0 — Stylized 3D Aerospace Workers
// Human Technicians & Engineers with:
// - Proper Human Proportions (Head, Helmet, Vest, ID, Trousers, Boots)
// - Blue / Red Team Engineering Accents
// - Looping Job Animations (Tablet Inspection, Walking, Console Ops)
// - Stage Reactions & Evacuation to Safety Line on Countdown
// ============================================================

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TeamId, LaunchStep } from '../types';

interface CharacterProps {
  initialPos: [number, number, number];
  rotationY?: number;
  team: TeamId;
  job: 'tablet' | 'walk' | 'console' | 'engine-scan' | 'guidance';
  isEvacuated: boolean;
  isCheering: boolean;
}

const AerospaceCharacter: React.FC<CharacterProps> = ({
  initialPos,
  rotationY = 0,
  team,
  job,
  isEvacuated,
  isCheering,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);

  const isBlue = team === 'blue';
  const teamAccent = isBlue ? '#2563eb' : '#dc2626';

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    if (!groupRef.current) return;

    // 1. Evacuation Movement to Safety Perimeter during Liftoff
    if (isEvacuated) {
      const targetZ = initialPos[2] + 4.5;
      const targetX = initialPos[0] + (isBlue ? -2.0 : 2.0);
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, delta * 2.5);
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, delta * 2.5);
    } else {
      // 2. Walking Job Looping Motion
      if (job === 'walk') {
        const walkOffset = Math.sin(time * 1.5) * 1.6;
        groupRef.current.position.x = initialPos[0] + walkOffset;
        groupRef.current.rotation.y = walkOffset >= 0 ? 1.57 : -1.57;

        if (leftLegRef.current && rightLegRef.current) {
          leftLegRef.current.rotation.x = Math.sin(time * 6) * 0.4;
          rightLegRef.current.rotation.x = -Math.sin(time * 6) * 0.4;
        }
        if (leftArmRef.current && rightArmRef.current) {
          leftArmRef.current.rotation.x = -Math.sin(time * 6) * 0.35;
          rightArmRef.current.rotation.x = Math.sin(time * 6) * 0.35;
        }
      }
    }

    // 3. Stage Celebration Cheer (Hands Raised)
    if (isCheering) {
      if (leftArmRef.current) leftArmRef.current.rotation.z = 2.4 + Math.sin(time * 8) * 0.2;
      if (rightArmRef.current) rightArmRef.current.rotation.z = -2.4 - Math.sin(time * 8) * 0.2;
      if (headRef.current) headRef.current.rotation.x = -0.3;
      return;
    }

    // 4. Specific Job Gestures
    if (job === 'tablet') {
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = -1.2 + Math.sin(time * 3) * 0.1;
        rightArmRef.current.rotation.y = -0.4;
      }
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = -1.0;
        leftArmRef.current.rotation.y = 0.3;
      }
      if (headRef.current) headRef.current.rotation.x = 0.35 + Math.sin(time * 2) * 0.05;
    } else if (job === 'console') {
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = -1.1 + Math.sin(time * 4) * 0.15;
      }
      if (headRef.current) headRef.current.rotation.y = Math.sin(time * 1.5) * 0.2;
    } else if (job === 'engine-scan') {
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = -1.4 + Math.sin(time * 2) * 0.1;
        rightArmRef.current.rotation.z = 0.3;
      }
    }
  });

  return (
    <group ref={groupRef} position={initialPos} rotation={[0, rotationY, 0]}>
      {/* ── PELVIS & BLUE WORK TROUSERS ── */}
      <mesh position={[0, 0.75, 0]} castShadow>
        <boxGeometry args={[0.36, 0.22, 0.24]} />
        <meshStandardMaterial color="#1e3a8a" roughness={0.7} />
      </mesh>

      {/* Left Leg */}
      <group ref={leftLegRef} position={[-0.1, 0.65, 0]}>
        <mesh position={[0, -0.3, 0]} castShadow>
          <cylinderGeometry args={[0.075, 0.07, 0.6, 12]} />
          <meshStandardMaterial color="#1e3a8a" roughness={0.7} />
        </mesh>
        {/* Steel-Toe Work Boot */}
        <mesh position={[0, -0.65, 0.05]} castShadow>
          <boxGeometry args={[0.13, 0.14, 0.24]} />
          <meshStandardMaterial color="#334155" roughness={0.4} />
        </mesh>
      </group>

      {/* Right Leg */}
      <group ref={rightLegRef} position={[0.1, 0.65, 0]}>
        <mesh position={[0, -0.3, 0]} castShadow>
          <cylinderGeometry args={[0.075, 0.07, 0.6, 12]} />
          <meshStandardMaterial color="#1e3a8a" roughness={0.7} />
        </mesh>
        {/* Steel-Toe Work Boot */}
        <mesh position={[0, -0.65, 0.05]} castShadow>
          <boxGeometry args={[0.13, 0.14, 0.24]} />
          <meshStandardMaterial color="#334155" roughness={0.4} />
        </mesh>
      </group>

      {/* ── TORSO & HIGH-VISIBILITY ORANGE SAFETY VEST ── */}
      <mesh position={[0, 1.15, 0]} castShadow>
        <boxGeometry args={[0.42, 0.58, 0.28]} />
        <meshStandardMaterial color="#ea580c" roughness={0.5} />
      </mesh>

      {/* Reflective Yellow Safety Stripes */}
      <mesh position={[0, 1.25, 0.15]}>
        <boxGeometry args={[0.38, 0.06, 0.02]} />
        <meshStandardMaterial
          color="#fde047"
          emissive="#fef08a"
          emissiveIntensity={0.6}
        />
      </mesh>
      <mesh position={[0, 1.02, 0.15]}>
        <boxGeometry args={[0.38, 0.06, 0.02]} />
        <meshStandardMaterial
          color="#fde047"
          emissive="#fef08a"
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Team ID Badge */}
      <mesh position={[0.12, 1.28, 0.16]}>
        <boxGeometry args={[0.08, 0.1, 0.01]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.12, 1.3, 0.165]}>
        <boxGeometry args={[0.06, 0.03, 0.01]} />
        <meshStandardMaterial color={teamAccent} />
      </mesh>

      {/* ── HEAD & SAFETY HARD HAT ── */}
      <group ref={headRef} position={[0, 1.58, 0]}>
        {/* Neck */}
        <mesh position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.06, 0.07, 0.1, 12]} />
          <meshStandardMaterial color="#fed7aa" roughness={0.6} />
        </mesh>

        {/* Head */}
        <mesh castShadow>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#fed7aa" roughness={0.6} />
        </mesh>

        {/* White / Yellow Hard Hat */}
        <mesh position={[0, 0.08, 0]} castShadow>
          <sphereGeometry args={[0.17, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.2} />
        </mesh>
        {/* Hard Hat Brim */}
        <mesh position={[0, 0.07, 0.04]} rotation={[0.15, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.03, 16]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} />
        </mesh>
        {/* Team Stripe on Hard Hat */}
        <mesh position={[0, 0.16, 0]}>
          <boxGeometry args={[0.08, 0.04, 0.32]} />
          <meshStandardMaterial color={teamAccent} />
        </mesh>
      </group>

      {/* ── LEFT ARM ── */}
      <group ref={leftArmRef} position={[-0.26, 1.38, 0]}>
        {/* Sleeve */}
        <mesh position={[0, -0.14, 0]} castShadow>
          <cylinderGeometry args={[0.065, 0.06, 0.3, 12]} />
          <meshStandardMaterial color="#1e3a8a" roughness={0.7} />
        </mesh>
        {/* Forearm & Glove */}
        <mesh position={[0, -0.38, 0]} castShadow>
          <cylinderGeometry args={[0.055, 0.05, 0.26, 12]} />
          <meshStandardMaterial color="#fed7aa" roughness={0.6} />
        </mesh>
        {/* Hand / Glove */}
        <mesh position={[0, -0.54, 0]} castShadow>
          <boxGeometry args={[0.08, 0.1, 0.08]} />
          <meshStandardMaterial color="#475569" roughness={0.5} />
        </mesh>

        {/* Tablet Item (if job is tablet) */}
        {job === 'tablet' && (
          <mesh position={[0.1, -0.45, 0.2]} rotation={[0.4, 0, 0]} castShadow>
            <boxGeometry args={[0.22, 0.3, 0.02]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} />
          </mesh>
        )}
      </group>

      {/* ── RIGHT ARM ── */}
      <group ref={rightArmRef} position={[0.26, 1.38, 0]}>
        {/* Sleeve */}
        <mesh position={[0, -0.14, 0]} castShadow>
          <cylinderGeometry args={[0.065, 0.06, 0.3, 12]} />
          <meshStandardMaterial color="#1e3a8a" roughness={0.7} />
        </mesh>
        {/* Forearm & Glove */}
        <mesh position={[0, -0.38, 0]} castShadow>
          <cylinderGeometry args={[0.055, 0.05, 0.26, 12]} />
          <meshStandardMaterial color="#fed7aa" roughness={0.6} />
        </mesh>
        {/* Hand / Glove */}
        <mesh position={[0, -0.54, 0]} castShadow>
          <boxGeometry args={[0.08, 0.1, 0.08]} />
          <meshStandardMaterial color="#475569" roughness={0.5} />
        </mesh>

        {/* Flashlight / Scanner Tool (if job is engine-scan) */}
        {job === 'engine-scan' && (
          <group position={[0, -0.55, 0.15]} rotation={[0.8, 0, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.03, 0.03, 0.2, 10]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.6} />
            </mesh>
            <pointLight color="#38bdf8" intensity={1.5} distance={3} />
          </group>
        )}
      </group>
    </group>
  );
};

interface WorkersProps {
  launchStage: LaunchStep;
  blueCheering: boolean;
  redCheering: boolean;
}

export const AerospaceWorkers3D: React.FC<WorkersProps> = ({
  launchStage,
  blueCheering,
  redCheering,
}) => {
  const isEvac =
    launchStage === 'ignition' ||
    launchStage === 'thrust-ramp' ||
    launchStage === 'liftoff' ||
    launchStage === 'tower-clear' ||
    launchStage === 'sky-ascent';

  return (
    <group>
      {/* ── BLUE TEAM CREW (Left Launch Complex) ── */}
      {/* Blue Worker 1: Fuselage Avionics Inspector */}
      <AerospaceCharacter
        initialPos={[-6.2, 0, 1.2]}
        rotationY={-0.6}
        team="blue"
        job="tablet"
        isEvacuated={isEvac}
        isCheering={blueCheering}
      />
      {/* Blue Worker 2: Walking Fuel Pipe Inspector */}
      <AerospaceCharacter
        initialPos={[-8.6, 0, -1.0]}
        rotationY={1.2}
        team="blue"
        job="walk"
        isEvacuated={isEvac}
        isCheering={blueCheering}
      />
      {/* Blue Worker 3: Launch Pad Hydraulic Operator */}
      <AerospaceCharacter
        initialPos={[-9.2, 0, 1.8]}
        rotationY={0.3}
        team="blue"
        job="console"
        isEvacuated={isEvac}
        isCheering={blueCheering}
      />
      {/* Blue Worker 4: Engine Bay Scanner */}
      <AerospaceCharacter
        initialPos={[-6.8, 0, -1.8]}
        rotationY={2.2}
        team="blue"
        job="engine-scan"
        isEvacuated={isEvac}
        isCheering={blueCheering}
      />

      {/* ── RED TEAM CREW (Right Launch Complex) ── */}
      {/* Red Worker 1: Fuselage Avionics Inspector */}
      <AerospaceCharacter
        initialPos={[6.2, 0, 1.2]}
        rotationY={0.6}
        team="red"
        job="tablet"
        isEvacuated={isEvac}
        isCheering={redCheering}
      />
      {/* Red Worker 2: Walking Fuel Pipe Inspector */}
      <AerospaceCharacter
        initialPos={[8.6, 0, -1.0]}
        rotationY={-1.2}
        team="red"
        job="walk"
        isEvacuated={isEvac}
        isCheering={redCheering}
      />
      {/* Red Worker 3: Launch Pad Hydraulic Operator */}
      <AerospaceCharacter
        initialPos={[9.2, 0, 1.8]}
        rotationY={-0.3}
        team="red"
        job="console"
        isEvacuated={isEvac}
        isCheering={redCheering}
      />
      {/* Red Worker 4: Engine Bay Scanner */}
      <AerospaceCharacter
        initialPos={[6.8, 0, -1.8]}
        rotationY={-2.2}
        team="red"
        job="engine-scan"
        isEvacuated={isEvac}
        isCheering={redCheering}
      />
    </group>
  );
};
