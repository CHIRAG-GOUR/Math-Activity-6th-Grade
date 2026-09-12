// ============================================================
// PATTERN RACERS — Professional 3D Race Vehicles
// Blue Velocity (#01) & Red Turbo (#02)
// Realistic Stylized Formula / Prototype Aerodynamic Racer:
// - Streamlined Monocoque Chassis & Carbon Fiber Diffuser
// - Open-Wheel Aerodynamic Pods with Rubber Tires & Brake Calipers
// - Cockpit with Smoked Windshield & Digital HUD Display
// - High-Downforce Rear Wing with Dynamic Heat/Thrust Exhaust
// - Physical Waving Team Flag on Rear Gantry
// ============================================================

'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TeamId } from '../types';

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
  const isBlue = teamId === 'blue';
  const primaryColor = isBlue ? '#2563eb' : '#dc2626';
  const secondaryColor = isBlue ? '#60a5fa' : '#f87171';
  const numberText = isBlue ? '01' : '02';

  const groupRef = useRef<THREE.Group>(null);
  const wheelsRef = useRef<THREE.Group>(null);
  const flagRef = useRef<THREE.Mesh>(null);
  const exhaustGlowRef = useRef<THREE.PointLight>(null);

  useFrame((state, delta) => {
    // Subtle engine idling vibration
    if (groupRef.current) {
      const idleTime = state.clock.getElapsedTime() * 12;
      groupRef.current.position.y = position[1] + Math.sin(idleTime) * 0.012;
      groupRef.current.position.x = position[0];
      groupRef.current.position.z = position[2];
      groupRef.current.rotation.y = rotationY;
    }

    // Wheel rotation during motion
    if (wheelsRef.current && (isRacing || boostActive)) {
      const rotSpeed = isRacing ? speed * delta * 6 : 8 * delta;
      wheelsRef.current.children.forEach((wheel) => {
        wheel.rotation.x += rotSpeed;
      });
    }

    // Dynamic waving cloth flag on rear gantry
    if (flagRef.current) {
      const time = state.clock.getElapsedTime() * (isRacing ? 16 : 6);
      flagRef.current.rotation.y = Math.sin(time) * 0.25;
      flagRef.current.rotation.z = Math.cos(time * 0.8) * 0.1;
    }

    // Exhaust glow pulse on boost
    if (exhaustGlowRef.current) {
      if (boostActive || isRacing) {
        exhaustGlowRef.current.intensity = 1.5 + Math.sin(state.clock.getElapsedTime() * 20) * 0.8;
      } else {
        exhaustGlowRef.current.intensity = 0.2;
      }
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* ── 1. MAIN CHASSIS & AERODYNAMIC NOSE CONE ── */}
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
          {/* Black Radiator Intake Vent */}
          <mesh position={[0, 0, -0.91]}>
            <planeGeometry args={[0.28, 0.22]} />
            <meshBasicMaterial color="#000000" />
          </mesh>
        </group>
      ))}

      {/* ── 2. COCKPIT & TINTED AERO WINDSHIELD ── */}
      <mesh position={[0, 0.42, -0.2]} castShadow>
        <boxGeometry args={[0.65, 0.22, 1.1]} />
        <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.9} />
      </mesh>
      {/* Smoked Tint Glass Canopy */}
      <mesh position={[0, 0.45, -0.2]}>
        <sphereGeometry args={[0.42, 16, 12]} />
        <meshStandardMaterial color="#38bdf8" roughness={0.1} metalness={0.9} transparent opacity={0.65} />
      </mesh>

      {/* ── 3. HIGH-DOWNFORCE REAR WING & DIFFUSER ── */}
      <group position={[0, 0.65, 1.4]}>
        {/* Main Wing Blade */}
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

      {/* ── 4. WHEELS WITH RUBBER TIRES & BRAKE CALIPERS ── */}
      <group ref={wheelsRef}>
        {[
          [-0.85, 0.22, -1.1], // Front Left
          [0.85, 0.22, -1.1],  // Front Right
          [-0.9, 0.28, 1.1],   // Rear Left (Wider)
          [0.9, 0.28, 1.1],    // Rear Right (Wider)
        ].map(([x, y, z], idx) => {
          const isRear = idx >= 2;
          const radius = isRear ? 0.32 : 0.26;
          const width = isRear ? 0.32 : 0.24;
          return (
            <group key={`wheel-${idx}`} position={[x, y, z]} rotation={[0, 0, Math.PI / 2]}>
              {/* Outer Tire */}
              <mesh castShadow>
                <cylinderGeometry args={[radius, radius, width, 24]} />
                <meshStandardMaterial color="#18181b" roughness={0.85} metalness={0.2} />
              </mesh>
              {/* Center Alloy Rim */}
              <mesh position={[0, (width / 2) * (x > 0 ? 1.01 : -1.01), 0]}>
                <cylinderGeometry args={[radius * 0.6, radius * 0.6, 0.05, 12]} />
                <meshStandardMaterial color="#e2e8f0" roughness={0.2} metalness={0.9} />
              </mesh>
              {/* Gold/Red Brake Caliper */}
              <mesh position={[radius * 0.3, 0, 0]}>
                <boxGeometry args={[0.1, width * 0.8, 0.15]} />
                <meshStandardMaterial color="#f59e0b" roughness={0.4} metalness={0.8} />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* ── 5. HEADLIGHTS & BRAKE LED LIGHTS ── */}
      {/* Front Xenon Headlights */}
      {[-0.45, 0.45].map((x, i) => (
        <mesh key={`headlight-${i}`} position={[x, 0.2, -1.65]}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      ))}
      {/* Rear Red LED Brake Bar */}
      <mesh position={[0, 0.25, 1.62]}>
        <boxGeometry args={[0.8, 0.06, 0.04]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>

      {/* ── 6. EXHAUST & DYNAMIC TURBO THRUST GLOW ── */}
      <mesh position={[0, 0.18, 1.64]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.15, 12]} />
        <meshStandardMaterial color="#0f172a" roughness={0.6} metalness={0.9} />
      </mesh>
      <pointLight
        ref={exhaustGlowRef}
        position={[0, 0.2, 1.9]}
        color={boostActive ? '#38bdf8' : '#f97316'}
        intensity={boostActive ? 2.5 : 0.4}
        distance={3}
      />

      {/* ── 7. PHYSICAL TEAM NUMBER DECAL & WAVING FLAG ── */}
      {/* Number Emblem Badge */}
      <mesh position={[0, 0.36, -0.9]} rotation={[-Math.PI / 4, 0, 0]}>
        <cylinderGeometry args={[0.26, 0.26, 0.02, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>

      {/* Waving Team Flag on Rear Wing Post */}
      <group position={[0, 0.7, 1.3]}>
        {/* Mast */}
        <mesh position={[0, 0.35, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.7, 8]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} />
        </mesh>
        {/* Cloth Flag */}
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
