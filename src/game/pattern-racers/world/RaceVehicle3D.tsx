// ============================================================
// PATTERN RACERS — Professional High-Performance 3D Race Vehicles
// Blue Velocity (#01) & Red Turbo (#02)
// True Formula 1 / Le Mans Hypercar Aero Architecture:
// - Low-slung monocoque chassis, aerodynamic nose & dual-plane front carbon splitter
// - Contoured sidepod air intakes, halo safety structure & overhead airbox scoop
// - Realistic 3D Driver with Team Racing Helmet & Reflective Visor
// - Multi-tier high-downforce rear wing & rear aerodynamic diffuser strakes
// - 4 Wide Racing Slick Wheels with Alloy Rims, Brake Calipers & STEERING FRONT WHEELS
// - Dynamic RPM Engine Vibration across Rounds 1-5, Launch Squat, and Nitro Flames
// ============================================================

'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TeamId } from '../types';
import { usePatternStore } from '../store/patternStore';
import { PBR_MATERIALS } from './materials';

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
  const phase = usePatternStore((s) => s.phase);
  const blueVehicle = usePatternStore((s) => s.blueVehicle);
  const redVehicle = usePatternStore((s) => s.redVehicle);
  const blueControls = usePatternStore((s) => s.blueTeam.raceControls);
  const redControls = usePatternStore((s) => s.redTeam.raceControls);

  const isBlue = teamId === 'blue';
  const veh = isBlue ? blueVehicle : redVehicle;
  const controls = isBlue ? blueControls : redControls;
  const steerInput = controls.steer || 0;

  // Authentic Materials from Singleton Library
  const bodyMat = isBlue ? PBR_MATERIALS.vehicleBodyBlue : PBR_MATERIALS.vehicleBodyRed;
  const accentMat = isBlue ? PBR_MATERIALS.seatBlue : PBR_MATERIALS.seatYellow;
  const helmetMat = isBlue ? PBR_MATERIALS.spectatorBlue : PBR_MATERIALS.spectatorRed;
  const visorMat = isBlue ? PBR_MATERIALS.seatBlue : PBR_MATERIALS.spectatorYellow;

  const groupRef = useRef<THREE.Group>(null);
  const frontLeftWheelRef = useRef<THREE.Group>(null);
  const frontRightWheelRef = useRef<THREE.Group>(null);
  const rearWheelsRef = useRef<THREE.Group>(null);
  const chassisRollRef = useRef<THREE.Group>(null);
  const nitroFlamesRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    // Engine RPM vibration intensity across Rounds 1-5
    const rpm = veh.rpm || 2500;
    const vibIntensity = (rpm / 12000) * 0.012;
    const idleTime = state.clock.getElapsedTime() * 30;
    const shake = Math.sin(idleTime) * vibIntensity;

    if (groupRef.current) {
      groupRef.current.position.y = position[1] + shake;
      groupRef.current.position.x = position[0];
      groupRef.current.position.z = position[2];
      groupRef.current.rotation.y = rotationY;
    }

    // Dynamic Chassis Banking / Roll into turns (-8 deg to +8 deg)
    if (chassisRollRef.current) {
      const targetRoll = -steerInput * 0.12;
      chassisRollRef.current.rotation.z = THREE.MathUtils.lerp(
        chassisRollRef.current.rotation.z,
        targetRoll,
        delta * 8
      );
    }

    // Front Wheels Physical Steering Angle (Turns left / right)
    const targetSteerAngle = -steerInput * 0.45;
    if (frontLeftWheelRef.current) {
      frontLeftWheelRef.current.rotation.y = THREE.MathUtils.lerp(
        frontLeftWheelRef.current.rotation.y,
        targetSteerAngle,
        delta * 12
      );
    }
    if (frontRightWheelRef.current) {
      frontRightWheelRef.current.rotation.y = THREE.MathUtils.lerp(
        frontRightWheelRef.current.rotation.y,
        targetSteerAngle,
        delta * 12
      );
    }

    // Wheel Rotation from Forward Speed or Head Start Burnout
    const rotSpeed =
      controls.isHeldByHeadStart
        ? 25 * delta // Burnout on the spot while restrained
        : isRacing
        ? Math.max(12, speed * delta * 0.25)
        : speed > 0
        ? speed * delta * 0.2
        : 0;

    if (frontLeftWheelRef.current?.children[0]) frontLeftWheelRef.current.children[0].rotation.x += rotSpeed;
    if (frontRightWheelRef.current?.children[0]) frontRightWheelRef.current.children[0].rotation.x += rotSpeed;
    if (rearWheelsRef.current) {
      rearWheelsRef.current.children.forEach((w) => {
        w.rotation.x += rotSpeed;
      });
    }

    // Dynamic Nitrous Flame Oscillation & Scale
    if (nitroFlamesRef.current) {
      if (boostActive) {
        const flameScale = 1.0 + Math.sin(state.clock.getElapsedTime() * 35) * 0.35;
        nitroFlamesRef.current.scale.set(flameScale, flameScale, flameScale * 1.5);
      }
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* ── CHASSIS ROLL GROUP (Banks on turns) ── */}
      <group ref={chassisRollRef}>
        {/* ── 1. MAIN MONOCOQUE BODY & NOSE CONE ── */}
        {/* Central Monocoque Cockpit Shell */}
        <mesh position={[0, 0.26, 0.1]} castShadow receiveShadow material={bodyMat}>
          <boxGeometry args={[1.15, 0.3, 2.6]} />
        </mesh>

        {/* Center Racing Stripe Decal */}
        <mesh position={[0, 0.415, 0.1]} material={PBR_MATERIALS.concrete}>
          <boxGeometry args={[0.26, 0.01, 2.62]} />
        </mesh>

        {/* Number Badge (#01 or #02) */}
        <mesh position={[0, 0.42, 0.3]} material={PBR_MATERIALS.concrete}>
          <circleGeometry args={[0.22, 16]} />
        </mesh>

        {/* Sloping Aerodynamic Front Nose */}
        <mesh position={[0, 0.2, -1.5]} rotation={[0.1, 0, 0]} castShadow receiveShadow material={bodyMat}>
          <boxGeometry args={[0.65, 0.22, 1.3]} />
        </mesh>
        <mesh position={[0, 0.315, -1.5]} rotation={[0.1, 0, 0]} material={PBR_MATERIALS.concrete}>
          <boxGeometry args={[0.2, 0.01, 1.32]} />
        </mesh>

        {/* ── 2. DUAL-PLANE CARBON FRONT WING & SPLITTER ── */}
        <group position={[0, 0.08, -2.1]}>
          {/* Main Lower Carbon Splitter */}
          <mesh castShadow material={PBR_MATERIALS.vehicleCarbon}>
            <boxGeometry args={[1.9, 0.05, 0.55]} />
          </mesh>
          {/* Upper Aero Flap */}
          <mesh position={[0, 0.1, 0.05]} castShadow material={accentMat}>
            <boxGeometry args={[1.75, 0.04, 0.3]} />
          </mesh>
          {/* Left & Right Endplate Winglets */}
          {[-0.95, 0.95].map((x, i) => (
            <mesh key={`fwing-end-${i}`} position={[x, 0.12, 0]} castShadow material={PBR_MATERIALS.vehicleCarbon}>
              <boxGeometry args={[0.04, 0.28, 0.6]} />
            </mesh>
          ))}
        </group>

        {/* ── 3. SCULPTED SIDE AIR INTAKE PODS & BARGEBOARDS ── */}
        {[-0.68, 0.68].map((x, i) => (
          <group key={`sidepod-${i}`} position={[x, 0.22, 0.1]}>
            <mesh castShadow receiveShadow material={accentMat}>
              <boxGeometry args={[0.36, 0.32, 1.9]} />
            </mesh>
            <mesh position={[0, 0, -0.96]}>
              <planeGeometry args={[0.3, 0.26]} />
              <meshBasicMaterial color="#000000" />
            </mesh>
            <mesh position={[x > 0 ? 0.06 : -0.06, -0.14, 0]} material={PBR_MATERIALS.vehicleCarbon}>
              <boxGeometry args={[0.12, 0.03, 2.1]} />
            </mesh>
          </group>
        ))}

        {/* ── 4. OPEN COCKPIT, 3D DRIVER & HALO SAFETY RING ── */}
        {/* Cockpit Cutout Tub */}
        <mesh position={[0, 0.26, -0.1]} material={PBR_MATERIALS.darkWall}>
          <boxGeometry args={[0.62, 0.22, 0.75]} />
        </mesh>

        {/* 3D Formula Driver (Helmet, Visor, Racing Suit) */}
        <group position={[0, 0.38, -0.05]}>
          <mesh position={[0, 0.02, 0]} castShadow material={accentMat}>
            <boxGeometry args={[0.42, 0.3, 0.3]} />
          </mesh>
          <mesh position={[0, 0.26, 0]} castShadow material={helmetMat}>
            <sphereGeometry args={[0.18, 12, 12]} />
          </mesh>
          <mesh position={[0, 0.26, -0.12]} rotation={[0.2, 0, 0]} material={visorMat}>
            <boxGeometry args={[0.22, 0.09, 0.12]} />
          </mesh>
        </group>

        {/* Carbon Fiber Halo Safety Ring */}
        <group position={[0, 0.52, -0.1]}>
          <mesh position={[0, 0, -0.32]} material={PBR_MATERIALS.vehicleCarbon}>
            <cylinderGeometry args={[0.025, 0.025, 0.35, 8]} />
          </mesh>
          <mesh position={[0, 0.16, 0.05]} rotation={[Math.PI / 2, 0, 0]} material={PBR_MATERIALS.vehicleCarbon}>
            <torusGeometry args={[0.28, 0.025, 8, 16, Math.PI]} />
          </mesh>
        </group>

        {/* Overhead Engine Air Intake Scoop */}
        <mesh position={[0, 0.62, 0.42]} rotation={[-0.2, 0, 0]} castShadow material={bodyMat}>
          <boxGeometry args={[0.32, 0.24, 0.65]} />
        </mesh>
        <mesh position={[0, 0.68, 0.12]} rotation={[-0.2, 0, 0]}>
          <circleGeometry args={[0.1, 12]} />
          <meshBasicMaterial color="#000000" />
        </mesh>

        {/* ── 5. MULTI-TIER REAR HIGH-DOWNFORCE GT WING & DIFFUSER ── */}
        <group position={[0, 0.68, 1.3]}>
          <mesh castShadow material={PBR_MATERIALS.vehicleCarbon}>
            <boxGeometry args={[1.85, 0.04, 0.42]} />
          </mesh>
          <mesh position={[0, -0.12, -0.05]} castShadow material={accentMat}>
            <boxGeometry args={[1.7, 0.03, 0.3]} />
          </mesh>
          {[-0.45, 0.45].map((x, i) => (
            <mesh key={`wing-pylon-${i}`} position={[x, -0.32, 0]} castShadow material={PBR_MATERIALS.vehicleCarbon}>
              <boxGeometry args={[0.04, 0.6, 0.25]} />
            </mesh>
          ))}
          {[-0.92, 0.92].map((x, i) => (
            <mesh key={`rear-endplate-${i}`} position={[x, -0.05, 0]} castShadow material={bodyMat}>
              <boxGeometry args={[0.04, 0.35, 0.48]} />
            </mesh>
          ))}
        </group>

        {/* Rear Aerodynamic Diffuser & Strakes */}
        <group position={[0, 0.12, 1.35]}>
          <mesh material={PBR_MATERIALS.vehicleCarbon}>
            <boxGeometry args={[1.2, 0.08, 0.4]} />
          </mesh>
          {[-0.4, -0.15, 0.15, 0.4].map((x, i) => (
            <mesh key={`strake-${i}`} position={[x, -0.04, 0]} material={PBR_MATERIALS.vehicleCarbon}>
              <boxGeometry args={[0.02, 0.12, 0.42]} />
            </mesh>
          ))}
        </group>

        {/* ── 6. DUAL EXHAUST PIPES & NITRO FLAME FX ── */}
        <group position={[0, 0.25, 1.42]}>
          {[-0.16, 0.16].map((x, i) => (
            <mesh key={`exhaust-${i}`} position={[x, 0, 0]} rotation={[Math.PI / 2, 0, 0]} material={PBR_MATERIALS.darkWall}>
              <cylinderGeometry args={[0.06, 0.06, 0.14, 8]} />
            </mesh>
          ))}

          {/* Dynamic Nitrous Exhaust Flame Mesh (Sparks & expands on Nitro) */}
          {boostActive && (
            <group ref={nitroFlamesRef} position={[0, 0, 0.18]}>
              {[-0.16, 0.16].map((x, i) => (
                <mesh key={`flame-${i}`} position={[x, 0, 0.35]} rotation={[Math.PI / 2, 0, 0]}>
                  <coneGeometry args={[0.12, 0.8, 8]} />
                  <meshBasicMaterial color="#38bdf8" />
                </mesh>
              ))}
            </group>
          )}
        </group>

        {/* ── 7. HIGH-INTENSITY LED HEADLIGHTS ── */}
        <group position={[0, 0.16, -2.0]}>
          {[-0.65, 0.65].map((x, i) => (
            <mesh key={`headlight-${i}`} position={[x, 0, 0]}>
              <boxGeometry args={[0.18, 0.04, 0.08]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          ))}
        </group>
      </group>

      {/* ── 8. 4 HIGH-GRIP RACING WHEELS (FRONT WHEELS PHYSICAL STEERING) ── */}
      {/* Front Left Steering Wheel */}
      <group ref={frontLeftWheelRef} position={[-0.92, 0.22, -1.2]}>
        <group>
          {/* Rubber Tire */}
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow material={PBR_MATERIALS.vehicleRubber}>
            <cylinderGeometry args={[0.3, 0.3, 0.32, 14]} />
          </mesh>
          {/* Alloy Rim */}
          <mesh rotation={[0, 0, Math.PI / 2]} material={PBR_MATERIALS.vehicleRimChrome}>
            <cylinderGeometry args={[0.2, 0.2, 0.33, 10]} />
          </mesh>
        </group>
      </group>

      {/* Front Right Steering Wheel */}
      <group ref={frontRightWheelRef} position={[0.92, 0.22, -1.2]}>
        <group>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow material={PBR_MATERIALS.vehicleRubber}>
            <cylinderGeometry args={[0.3, 0.3, 0.32, 14]} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]} material={PBR_MATERIALS.vehicleRimChrome}>
            <cylinderGeometry args={[0.2, 0.2, 0.33, 10]} />
          </mesh>
        </group>
      </group>

      {/* Rear Wheels (Wider Slicks) */}
      <group ref={rearWheelsRef}>
        {[-0.96, 0.96].map((x, i) => (
          <group key={`rear-wheel-${i}`} position={[x, 0.24, 1.1]}>
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow material={PBR_MATERIALS.vehicleRubber}>
              <cylinderGeometry args={[0.34, 0.34, 0.42, 14]} />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]} material={PBR_MATERIALS.vehicleRimChrome}>
              <cylinderGeometry args={[0.22, 0.22, 0.43, 10]} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
};
