// ============================================================
// PATTERN RACERS — Professional 3D Race Vehicles
// Blue Velocity (#01) & Red Turbo (#02)
// 5-Stage Physical Behavior:
// - Stage 1: Diagnostic scan beams & umbilical power connection
// - Stage 2: Elevated on pneumatic jacks with active tire swap animation
// - Stage 3: Factory rollout with exhaust flames & hangar exit
// - Stage 4: Staged at starting line grid with idling engine
// - Stage 5: High-speed live racing with throttle, lane shift & nitro boost
// ============================================================

'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TeamId } from '../types';
import { usePatternStore } from '../store/patternStore';

interface Props {
  teamId: TeamId;
  position: [number, number, number];
  rotationY?: number;
  boostActive?: boolean;
  isRacing?: boolean;
  speed?: number;
}

export const RaceVehicle3D: React.FC<Props> = ({
  teamId,
  position,
  rotationY = 0,
  boostActive = false,
  isRacing = false,
  speed = 0,
}) => {
  const currentRound = usePatternStore((s) => s.currentRound);
  const isBlue = teamId === 'blue';
  const primaryColor = isBlue ? '#2563eb' : '#dc2626';
  const secondaryColor = isBlue ? '#60a5fa' : '#f87171';
  const glowColor = isBlue ? '#38bdf8' : '#ef4444';

  const groupRef = useRef<THREE.Group>(null);
  const wheelsRef = useRef<THREE.Group>(null);
  const flagRef = useRef<THREE.Mesh>(null);
  const exhaustGlowRef = useRef<THREE.PointLight>(null);
  const scanLaserRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    // Dynamic vertical lift for Stage 2 Hydraulic Jacks
    const isTireChange = currentRound === 2;
    const baseElevation = isTireChange ? 0.35 : 0;

    // Subtle engine idling vibration
    if (groupRef.current) {
      const idleTime = state.clock.getElapsedTime() * 14;
      const shake = (boostActive || isRacing) ? Math.sin(idleTime * 2) * 0.02 : Math.sin(idleTime) * 0.008;
      groupRef.current.position.y = position[1] + baseElevation + shake;
      groupRef.current.position.x = position[0];
      groupRef.current.position.z = position[2];
      groupRef.current.rotation.y = rotationY;
    }

    // Wheel rotation during live racing / rollout
    if (wheelsRef.current) {
      if (isRacing || currentRound >= 3) {
        const rotSpeed = isRacing ? Math.max(12, speed * delta * 8) : 4 * delta;
        wheelsRef.current.children.forEach((wheel) => {
          wheel.rotation.x += rotSpeed;
        });
      }
    }

    // Dynamic waving cloth flag on rear wing
    if (flagRef.current) {
      const time = state.clock.getElapsedTime() * (isRacing ? 18 : 6);
      flagRef.current.rotation.y = Math.sin(time) * 0.3;
      flagRef.current.rotation.z = Math.cos(time * 0.8) * 0.12;
    }

    // Exhaust glow pulse on boost / race
    if (exhaustGlowRef.current) {
      if (boostActive || isRacing) {
        exhaustGlowRef.current.intensity = 2.4 + Math.sin(state.clock.getElapsedTime() * 25) * 1.0;
      } else if (currentRound >= 3) {
        exhaustGlowRef.current.intensity = 0.8 + Math.sin(state.clock.getElapsedTime() * 10) * 0.3;
      } else {
        exhaustGlowRef.current.intensity = 0.15;
      }
    }

    // Stage 1 Telemetry Scanner Laser sweep
    if (scanLaserRef.current && currentRound === 1) {
      const scanT = Math.sin(state.clock.getElapsedTime() * 3) * 1.4;
      scanLaserRef.current.position.z = scanT;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* ── 1. STAGE 2 HYDRAULIC PNEUMATIC JACKS (When in Tire Change) ── */}
      {currentRound === 2 && (
        <group position={[0, -0.25, 0]}>
          {[-0.6, 0.6].map((x, i) =>
            [-0.8, 0.8].map((z, zi) => (
              <mesh key={`jack-${i}-${zi}`} position={[x, 0.12, z]} castShadow>
                <cylinderGeometry args={[0.08, 0.12, 0.35, 8]} />
                <meshStandardMaterial color="#eab308" metalness={0.8} />
              </mesh>
            ))
          )}
        </group>
      )}

      {/* ── 2. STAGE 1 SCANNING DIAGNOSTIC LASER BEAM ── */}
      {currentRound === 1 && (
        <mesh ref={scanLaserRef} position={[0, 0.35, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.015, 0.015, 1.8, 8]} />
          <meshBasicMaterial color={glowColor} transparent opacity={0.7} />
        </mesh>
      )}

      {/* ── 3. MAIN MONOCOQUE CHASSIS ── */}
      <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.3, 0.26, 3.2]} />
        <meshStandardMaterial color={primaryColor} roughness={0.25} metalness={0.7} />
      </mesh>

      {/* Front Nose Wedge */}
      <mesh position={[0, 0.16, -1.8]} castShadow>
        <cylinderGeometry args={[0.2, 0.6, 0.9, 4]} />
        <meshStandardMaterial color={primaryColor} roughness={0.25} metalness={0.7} />
      </mesh>

      {/* Front Aerodynamic Splitter / Wing */}
      <mesh position={[0, 0.08, -2.1]} castShadow>
        <boxGeometry args={[1.8, 0.06, 0.45]} />
        <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.9} />
      </mesh>

      {/* Side Pods (Air Intakes) */}
      {[-0.65, 0.65].map((x, i) => (
        <group key={`sidepod-${i}`} position={[x, 0.2, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.35, 0.28, 1.8]} />
            <meshStandardMaterial color={secondaryColor} roughness={0.3} metalness={0.6} />
          </mesh>
          {/* Radiator Vent */}
          <mesh position={[0, 0, -0.91]}>
            <planeGeometry args={[0.28, 0.22]} />
            <meshBasicMaterial color="#000000" />
          </mesh>
        </group>
      ))}

      {/* ── 4. COCKPIT & TINTED AERO WINDSHIELD ── */}
      <mesh position={[0, 0.42, -0.2]} castShadow>
        <boxGeometry args={[0.65, 0.22, 1.1]} />
        <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.9} />
      </mesh>
      {/* Smoked Tint Glass Canopy */}
      <mesh position={[0, 0.45, -0.2]}>
        <sphereGeometry args={[0.42, 16, 12]} />
        <meshStandardMaterial color="#38bdf8" roughness={0.1} metalness={0.9} transparent opacity={0.65} />
      </mesh>

      {/* ── 5. HIGH-DOWNFORCE REAR WING ── */}
      <group position={[0, 0.65, 1.4]}>
        <mesh castShadow>
          <boxGeometry args={[1.9, 0.08, 0.5]} />
          <meshStandardMaterial color={primaryColor} roughness={0.25} metalness={0.7} />
        </mesh>
        {/* End Plates */}
        {[-0.95, 0.95].map((x, i) => (
          <mesh key={`wing-end-${i}`} position={[x, 0, 0]}>
            <boxGeometry args={[0.05, 0.35, 0.55]} />
            <meshStandardMaterial color="#0f172a" roughness={0.4} />
          </mesh>
        ))}
        {/* Dual Vertical Pylons */}
        {[-0.35, 0.35].map((x, i) => (
          <mesh key={`pylon-${i}`} position={[x, -0.32, 0]}>
            <boxGeometry args={[0.06, 0.6, 0.15]} />
            <meshStandardMaterial color="#0f172a" roughness={0.5} />
          </mesh>
        ))}
      </group>

      {/* ── 6. WHEELS WITH RUBBER TIRES & ALLOY RIMS ── */}
      <group ref={wheelsRef}>
        {[
          [-0.85, 0.22, -1.1], // Front Left
          [0.85, 0.22, -1.1],  // Front Right
          [-0.9, 0.28, 1.1],   // Rear Left
          [0.9, 0.28, 1.1],    // Rear Right
        ].map(([x, y, z], idx) => {
          const isRear = idx >= 2;
          const radius = isRear ? 0.32 : 0.26;
          const width = isRear ? 0.32 : 0.24;
          // Offset wheels slightly outward in Stage 2 during tire change
          const xOffset = currentRound === 2 ? (x > 0 ? 0.2 : -0.2) : 0;

          return (
            <group key={`wheel-${idx}`} position={[x + xOffset, y, z]} rotation={[0, 0, Math.PI / 2]}>
              {/* Outer Rubber Tire */}
              <mesh castShadow>
                <cylinderGeometry args={[radius, radius, width, 24]} />
                <meshStandardMaterial color="#18181b" roughness={0.85} metalness={0.2} />
              </mesh>
              {/* Center Alloy Rim */}
              <mesh position={[0, (width / 2) * (x > 0 ? 1.01 : -1.01), 0]}>
                <cylinderGeometry args={[radius * 0.6, radius * 0.6, 0.05, 12]} />
                <meshStandardMaterial color="#e2e8f0" roughness={0.2} metalness={0.9} />
              </mesh>
              {/* Pirelli-Style Colored Sidewall Ring */}
              <mesh position={[0, (width / 2) * (x > 0 ? 1.005 : -1.005), 0]}>
                <ringGeometry args={[radius * 0.65, radius * 0.85, 16]} />
                <meshBasicMaterial color={currentRound >= 2 ? '#eab308' : '#64748b'} />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* ── 7. HEADLIGHTS & BRAKE LED LIGHTS ── */}
      {[-0.45, 0.45].map((x, i) => (
        <mesh key={`headlight-${i}`} position={[x, 0.2, -1.65]}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshBasicMaterial color={currentRound >= 3 ? '#ffffff' : '#94a3b8'} />
        </mesh>
      ))}
      <mesh position={[0, 0.25, 1.62]}>
        <boxGeometry args={[0.8, 0.06, 0.04]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>

      {/* ── 8. EXHAUST & TURBO THRUST GLOW + NITROUS FLAMES ── */}
      {[-0.2, 0.2].map((xExhaust, exIdx) => (
        <group key={`exhaust-pipe-${exIdx}`} position={[xExhaust, 0.18, 1.64]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.15, 12]} />
            <meshStandardMaterial color="#0f172a" roughness={0.6} metalness={0.9} />
          </mesh>

          {/* Glowing Exhaust Flame Cones on Nitro Boost */}
          {boostActive && (
            <mesh position={[0, 0, 0.45]} rotation={[-Math.PI / 2, 0, 0]}>
              <coneGeometry args={[0.16, 0.8, 12]} />
              <meshBasicMaterial
                color={isBlue ? '#38bdf8' : '#f97316'}
                transparent
                opacity={0.85}
              />
            </mesh>
          )}
        </group>
      ))}

      <pointLight
        ref={exhaustGlowRef}
        position={[0, 0.2, 2.2]}
        color={boostActive ? (isBlue ? '#38bdf8' : '#f97316') : '#f59e0b'}
        intensity={boostActive ? 4.5 : 0.4}
        distance={4.5}
      />

      {/* ── 9. NUMBER EMBLEM BADGE & WAVING TEAM FLAG ── */}
      <mesh position={[0, 0.36, -0.9]} rotation={[-Math.PI / 4, 0, 0]}>
        <cylinderGeometry args={[0.26, 0.26, 0.02, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>

      <group position={[0, 0.7, 1.3]}>
        <mesh position={[0, 0.35, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.7, 8]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} />
        </mesh>
        <mesh ref={flagRef} position={[0.22, 0.55, 0]}>
          <planeGeometry args={[0.42, 0.25]} />
          <meshStandardMaterial
            color={primaryColor}
            roughness={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </group>
  );
};
