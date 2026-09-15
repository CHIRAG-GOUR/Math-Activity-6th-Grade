'use client';

// ============================================================
// THE SOLAR FORGE: 3D Flying Birds Flock
// Natural summer wildlife: 3D birds with articulated flapping & gliding
// wings, banking turns, and graceful flight trajectories traversing
// the open desert sky above the facility and distant mountains.
// ============================================================

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SingleBirdProps {
  offset: [number, number, number];
  speedMult: number;
  flapPhase: number;
  scale?: number;
}

const Bird3D: React.FC<SingleBirdProps> = ({ offset, speedMult, flapPhase, scale = 1.0 }) => {
  const birdRef = useRef<THREE.Group>(null);
  const leftWingRef = useRef<THREE.Group>(null);
  const rightWingRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speedMult + flapPhase;

    // Flight Path: Wide scenic loop around the solar facility & valley
    const flightRadiusX = 70;
    const flightRadiusZ = 55;
    const pathAngle = t * 0.12;

    const x = Math.sin(pathAngle) * flightRadiusX + offset[0];
    const y = 36 + Math.sin(t * 0.25) * 6 + offset[1];
    const z = -30 + Math.cos(pathAngle) * flightRadiusZ + offset[2];

    if (birdRef.current) {
      birdRef.current.position.set(x, y, z);

      // Tangent direction for flight orientation
      const nextAngle = pathAngle + 0.02;
      const nextX = Math.sin(nextAngle) * flightRadiusX + offset[0];
      const nextZ = -30 + Math.cos(nextAngle) * flightRadiusZ + offset[2];

      const dirX = nextX - x;
      const dirZ = nextZ - z;
      const yaw = Math.atan2(dirX, dirZ);

      // Banking into the turn
      const bank = Math.sin(pathAngle) * 0.35;
      birdRef.current.rotation.set(-0.05, yaw + Math.PI, bank);
    }

    // Wing Flapping & Gliding Physics:
    // Alternate between bursts of wing flapping and smooth aerodynamic glides
    const glideCycle = Math.sin(t * 0.6);
    const isGliding = glideCycle > 0.4;

    const flapAngle = isGliding
      ? 0.08 + Math.sin(t * 1.5) * 0.04 // Slight gliding dihedral angle
      : Math.sin(t * 7.5) * 0.52;        // Active rhythmic wing flap

    if (leftWingRef.current) {
      leftWingRef.current.rotation.z = flapAngle;
    }
    if (rightWingRef.current) {
      rightWingRef.current.rotation.z = -flapAngle;
    }
  });

  return (
    <group ref={birdRef} scale={[scale, scale, scale]}>
      {/* Sleek Torso */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.22, 1.4, 8]} />
        <meshStandardMaterial color="#334155" roughness={0.7} />
      </mesh>

      {/* Head & Beak */}
      <mesh position={[0, 0.1, 0.75]}>
        <sphereGeometry args={[0.16, 8, 8]} />
        <meshStandardMaterial color="#475569" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.08, 0.96]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.06, 0.3, 5]} />
        <meshStandardMaterial color="#d97706" roughness={0.4} />
      </mesh>

      {/* Tail Feathers */}
      <mesh position={[0, 0.05, -0.9]} rotation={[-0.1, 0, 0]}>
        <boxGeometry args={[0.35, 0.04, 0.6]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>

      {/* ── LEFT ARTICULATED WING ── */}
      <group ref={leftWingRef} position={[-0.18, 0.05, 0.1]}>
        {/* Inner Wing Span */}
        <mesh position={[-0.55, 0, 0]} rotation={[0, -0.15, 0]}>
          <boxGeometry args={[1.1, 0.03, 0.42]} />
          <meshStandardMaterial color="#334155" roughness={0.7} />
        </mesh>
        {/* Outer Wing Tip */}
        <mesh position={[-1.35, 0, -0.05]} rotation={[0, -0.3, 0]}>
          <boxGeometry args={[0.7, 0.02, 0.28]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>
      </group>

      {/* ── RIGHT ARTICULATED WING ── */}
      <group ref={rightWingRef} position={[0.18, 0.05, 0.1]}>
        {/* Inner Wing Span */}
        <mesh position={[0.55, 0, 0]} rotation={[0, 0.15, 0]}>
          <boxGeometry args={[1.1, 0.03, 0.42]} />
          <meshStandardMaterial color="#334155" roughness={0.7} />
        </mesh>
        {/* Outer Wing Tip */}
        <mesh position={[1.35, 0, -0.05]} rotation={[0, 0.3, 0]}>
          <boxGeometry args={[0.7, 0.02, 0.28]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>
      </group>
    </group>
  );
};

export const FlyingBirds3D: React.FC = () => {
  // V-Formation flock offsets
  const flockData = useMemo(() => [
    { offset: [0, 0, 0] as [number, number, number], speedMult: 1.0, flapPhase: 0, scale: 0.85 },       // Leader
    { offset: [-3.5, 0.8, -2.5] as [number, number, number], speedMult: 1.0, flapPhase: 0.8, scale: 0.8 }, // Left 1
    { offset: [3.2, -0.6, -2.8] as [number, number, number], speedMult: 1.0, flapPhase: 1.4, scale: 0.78 }, // Right 1
    { offset: [-6.8, 1.4, -5.2] as [number, number, number], speedMult: 1.0, flapPhase: 2.2, scale: 0.75 }, // Left 2
    { offset: [6.5, -0.4, -5.6] as [number, number, number], speedMult: 1.0, flapPhase: 3.1, scale: 0.76 }, // Right 2
    { offset: [-9.8, 2.0, -8.0] as [number, number, number], speedMult: 1.0, flapPhase: 4.0, scale: 0.72 }, // Left 3
  ], []);

  return (
    <group>
      {flockData.map((b, idx) => (
        <Bird3D
          key={idx}
          offset={b.offset}
          speedMult={b.speedMult}
          flapPhase={b.flapPhase}
          scale={b.scale}
        />
      ))}
    </group>
  );
};
