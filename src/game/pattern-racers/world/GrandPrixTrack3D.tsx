// ============================================================
// PATTERN RACERS — Dynamic 3D Grand Prix Track System
// 5 Modular Sectors with Hydraulic Elevators & Start Gantry:
// - Sector 1: Pattern Track Straight (Hydraulic Rise & Locking Bolts)
// - Sector 2: Sequence Builder Interlocking Hex Slabs
// - Sector 3: Function Machine Test Pad & Staging Chute
// - Sector 4: Repair Calibration Chicane & Neon Apex Kerbs
// - Sector 5: Championship Starting Grid & Overhead 5-Light Gantry
// ============================================================

'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePatternStore } from '../store/patternStore';

export const GrandPrixTrack3D: React.FC = () => {
  const trackCompletion = usePatternStore((s) => s.trackCompletion);
  const currentRound = usePatternStore((s) => s.currentRound);
  const raceLights = usePatternStore((s) => s.raceLights);

  const sector1Ref = useRef<THREE.Group>(null);
  const sector2Ref = useRef<THREE.Group>(null);
  const sector3Ref = useRef<THREE.Group>(null);
  const sector4Ref = useRef<THREE.Group>(null);
  const sector5Ref = useRef<THREE.Group>(null);

  // Smooth hydraulic elevation animations
  useFrame((state, delta) => {
    // Sector 1 elevation
    if (sector1Ref.current) {
      const targetY = trackCompletion >= 1 ? 0 : -1.2;
      sector1Ref.current.position.y = THREE.MathUtils.lerp(sector1Ref.current.position.y, targetY, delta * 4);
    }
    // Sector 2 elevation
    if (sector2Ref.current) {
      const targetY = trackCompletion >= 2 ? 0 : -1.5;
      sector2Ref.current.position.y = THREE.MathUtils.lerp(sector2Ref.current.position.y, targetY, delta * 4);
    }
    // Sector 3 elevation
    if (sector3Ref.current) {
      const targetY = trackCompletion >= 3 ? 0 : -1.8;
      sector3Ref.current.position.y = THREE.MathUtils.lerp(sector3Ref.current.position.y, targetY, delta * 4);
    }
    // Sector 4 elevation
    if (sector4Ref.current) {
      const targetY = trackCompletion >= 4 ? 0 : -2.0;
      sector4Ref.current.position.y = THREE.MathUtils.lerp(sector4Ref.current.position.y, targetY, delta * 4);
    }
    // Sector 5 elevation
    if (sector5Ref.current) {
      const targetY = trackCompletion >= 5 ? 0 : -2.2;
      sector5Ref.current.position.y = THREE.MathUtils.lerp(sector5Ref.current.position.y, targetY, delta * 4);
    }
  });

  return (
    <group>
      {/* ── SECTOR 1: PATTERN ASCENT STRAIGHT (Z = 6 to 2) ── */}
      <group ref={sector1Ref} position={[0, 0, 4]}>
        <mesh position={[0, 0.03, 0]} receiveShadow>
          <boxGeometry args={[8.4, 0.1, 7]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} />
        </mesh>
        {/* Center Dashed Lane Divider */}
        {[-2.5, 0, 2.5].map((z, i) => (
          <mesh key={`s1-lane-${i}`} position={[0, 0.09, z]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.2, 1.4]} />
            <meshBasicMaterial color="#fbbf24" />
          </mesh>
        ))}
        {/* Hydraulic Lifting Pistons under track */}
        {[-3.8, 3.8].map((x, i) => (
          <group key={`piston-s1-${i}`} position={[x, -0.4, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.18, 0.18, 0.8, 12]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[0, -0.4, 0]}>
              <cylinderGeometry args={[0.3, 0.3, 0.2, 12]} />
              <meshStandardMaterial color="#475569" roughness={0.5} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ── SECTOR 2: SEQUENCE BUILDER INTERLOCKING SLABS (Z = 2 to -4) ── */}
      <group ref={sector2Ref} position={[0, 0, -1]}>
        <mesh position={[0, 0.03, 0]} receiveShadow>
          <boxGeometry args={[8.4, 0.1, 7]} />
          <meshStandardMaterial color="#334155" roughness={0.65} />
        </mesh>
        {/* Interlocking Hex Plate Inlays */}
        {[-2, 0, 2].map((z, idx) => (
          <mesh key={`hex-slab-${idx}`} position={[0, 0.088, z]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.85, 6]} />
            <meshStandardMaterial color="#475569" roughness={0.4} metalness={0.5} />
          </mesh>
        ))}
      </group>

      {/* ── SECTOR 3: FUNCTION MACHINE TEST PAD (Z = -4 to -10) ── */}
      <group ref={sector3Ref} position={[0, 0, -7]}>
        <mesh position={[0, 0.03, 0]} receiveShadow>
          <boxGeometry args={[8.4, 0.1, 7]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} />
        </mesh>
        {/* Function Staging Yellow Hazard Stripes */}
        {[-2.8, 2.8].map((x, i) => (
          <mesh key={`s3-stripe-${i}`} position={[x, 0.09, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.6, 6.8]} />
            <meshStandardMaterial color="#eab308" roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* ── SECTOR 4: CALIBRATION CHICANE (Z = -10 to -16) ── */}
      <group ref={sector4Ref} position={[0, 0, -13]}>
        <mesh position={[0, 0.03, 0]} receiveShadow>
          <boxGeometry args={[8.4, 0.1, 7]} />
          <meshStandardMaterial color="#334155" roughness={0.65} />
        </mesh>
        {/* Cyan Apex Kerbs */}
        {[-3.8, 3.8].map((x, i) => (
          <mesh key={`apex-${i}`} position={[x, 0.09, 0]}>
            <boxGeometry args={[0.4, 0.06, 6.5]} />
            <meshStandardMaterial color="#38bdf8" roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* ── SECTOR 5: START/FINISH GRID & GANTRY (Z = -16 to -22) ── */}
      <group ref={sector5Ref} position={[0, 0, -19]}>
        {/* Start Line Grid Boxes */}
        <mesh position={[0, 0.03, 0]} receiveShadow>
          <boxGeometry args={[8.4, 0.1, 7]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} />
        </mesh>
        {/* Checkered Start/Finish Line */}
        <group position={[0, 0.09, 0]}>
          {Array.from({ length: 8 }).map((_, col) => (
            <mesh key={`chk-${col}`} position={[-3.5 + col * 1.0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[1.0, 0.8]} />
              <meshBasicMaterial color={col % 2 === 0 ? '#ffffff' : '#000000'} />
            </mesh>
          ))}
        </group>

        {/* ── OVERHEAD STARTING LIGHTS GANTRY ARCH ── */}
        <group position={[0, 0, 1.2]}>
          {/* Left Vertical Truss Pillar */}
          <mesh position={[-4.8, 2.5, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.25, 5, 8]} />
            <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.3} />
          </mesh>
          {/* Right Vertical Truss Pillar */}
          <mesh position={[4.8, 2.5, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.25, 5, 8]} />
            <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.3} />
          </mesh>
          {/* Horizontal Overhead Truss Beam */}
          <mesh position={[0, 4.8, 0]} castShadow>
            <boxGeometry args={[10.2, 0.45, 0.6]} />
            <meshStandardMaterial color="#0f172a" roughness={0.4} />
          </mesh>

          {/* 5 Gantry Signal Lights (3 Red, 1 Yellow, 1 Green) */}
          {[-2.0, -1.0, 0, 1.0, 2.0].map((x, lightIdx) => {
            const isLit = raceLights[lightIdx];
            const isGreen = lightIdx === 4;
            const isYellow = lightIdx === 3;
            const activeColor = isGreen ? '#22c55e' : isYellow ? '#eab308' : '#ef4444';
            const offColor = '#334155';

            return (
              <group key={`gantry-light-${lightIdx}`} position={[x, 4.8, 0.35]}>
                {/* Outer Bezel Housing */}
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.32, 0.32, 0.15, 16]} />
                  <meshStandardMaterial color="#18181b" roughness={0.5} />
                </mesh>
                {/* Luminous LED Lens */}
                <mesh position={[0, 0, 0.08]}>
                  <circleGeometry args={[0.26, 16]} />
                  <meshBasicMaterial color={isLit ? activeColor : offColor} />
                </mesh>
                {isLit && (
                  <pointLight position={[0, 0, 0.3]} color={activeColor} intensity={2.2} distance={3.5} />
                )}
              </group>
            );
          })}
        </group>
      </group>
    </group>
  );
};
