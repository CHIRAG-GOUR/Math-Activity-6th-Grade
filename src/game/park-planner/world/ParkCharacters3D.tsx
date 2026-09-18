// ============================================================
// PARK PLANNER — High-Fidelity 3D Characters & Human Locomotion
// PERFORMANCE-OPTIMIZED: All materials are cached singletons.
// Uses getCachedMaterial() to prevent per-frame allocations.
// ============================================================

import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { getCachedMaterial, getCachedCylinderGeo, getCachedBoxGeo, getCachedSphereGeo } from './ParkMaterials';

// Shared geometry instances (created once, reused by every character)
const _thighGeo = new THREE.CylinderGeometry(0.06, 0.05, 0.4, 6);
const _calfGeo = new THREE.CylinderGeometry(0.048, 0.045, 0.38, 6);
const _shoeGeo = new THREE.BoxGeometry(0.08, 0.08, 0.18);
const _upperArmGeo = new THREE.CylinderGeometry(0.045, 0.04, 0.28, 6);
const _forearmGeo = new THREE.CylinderGeometry(0.038, 0.035, 0.28, 6);
const _torsoGeo = new THREE.BoxGeometry(0.34, 0.42, 0.22);
const _hipGeo = new THREE.BoxGeometry(0.3, 0.16, 0.2);
const _headGeo = new THREE.SphereGeometry(0.13, 8, 8);
const _neckGeo = new THREE.CylinderGeometry(0.045, 0.05, 0.1, 6);
const _eyeGeo = new THREE.SphereGeometry(0.02, 4, 4);
const _eyeMat = getCachedMaterial('#0f172a', 0.5, 0);

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
  hasGuardUniform?: boolean;
  hasGuardCap?: boolean;
  isJogging?: boolean;
  isWalking?: boolean;
  isSeated?: boolean;
  isCycling?: boolean;
  isHammering?: boolean;
  speed?: number;
}

export const StylizedHuman3D: React.FC<HumanCharacterProps> = React.memo(({
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
  hasGuardUniform = false,
  hasGuardCap = false,
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

  // Cache all materials as stable refs — zero allocations per frame
  const mats = useMemo(() => ({
    shirt: getCachedMaterial(shirtColor, 0.7),
    pants: getCachedMaterial(pantsColor, 0.7),
    shoes: getCachedMaterial(hasGuardUniform ? '#0f172a' : shoesColor, 0.5),
    skin: getCachedMaterial(skinColor, 0.6),
    hair: getCachedMaterial(hairColor, 0.8),
    calfSkin: getCachedMaterial(hasGuardUniform ? pantsColor : skinColor, 0.6),
  }), [shirtColor, pantsColor, shoesColor, skinColor, hairColor, hasGuardUniform]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * (isJogging ? 7.5 : isWalking ? 4.5 : isCycling ? 6.0 : 1) * speed;

    if (isCycling) {
      if (rootRef.current) {
        rootRef.current.position.y = position[1];
        rootRef.current.rotation.x = -0.32;
      }
      if (headRef.current) headRef.current.rotation.x = 0.32;
      const pedalCycle = Math.sin(t);
      if (leftLegRef.current) leftLegRef.current.rotation.x = -0.65 + pedalCycle * 0.45;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -0.65 - pedalCycle * 0.45;
      if (leftArmRef.current) leftArmRef.current.rotation.set(-1.08, 0.08, 0.05);
      if (rightArmRef.current) rightArmRef.current.rotation.set(-1.08, -0.08, -0.05);
      return;
    }

    if (isSeated) {
      if (rootRef.current) {
        rootRef.current.position.y = position[1] - 0.22;
        rootRef.current.rotation.x = 0;
      }
      if (leftLegRef.current) leftLegRef.current.rotation.set(-Math.PI / 2.2, 0, 0);
      if (rightLegRef.current) rightLegRef.current.rotation.set(-Math.PI / 2.2, 0, 0);
      if (leftArmRef.current) leftArmRef.current.rotation.set(-0.25, 0, 0);
      if (rightArmRef.current) rightArmRef.current.rotation.set(-0.25, 0, 0);
      if (headRef.current) headRef.current.rotation.set(0, 0, 0);
      return;
    }

    if (isHammering) {
      if (rootRef.current) {
        rootRef.current.position.y = position[1];
        rootRef.current.rotation.x = 0;
      }
      if (rightArmRef.current) rightArmRef.current.rotation.x = -Math.PI / 3 + Math.sin(t * 2) * 0.6;
      if (leftArmRef.current) leftArmRef.current.rotation.x = -0.2;
      if (leftLegRef.current) leftLegRef.current.rotation.set(0, 0, 0);
      if (rightLegRef.current) rightLegRef.current.rotation.set(0, 0, 0);
      if (headRef.current) headRef.current.rotation.set(0, 0, 0);
      return;
    }

    if (isWalking || isJogging) {
      const legAmp = isJogging ? 0.6 : 0.38;
      const armAmp = isJogging ? 0.5 : 0.32;
      const swing = Math.sin(t);

      if (leftLegRef.current) leftLegRef.current.rotation.x = swing * legAmp;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -swing * legAmp;
      if (leftArmRef.current) leftArmRef.current.rotation.x = -swing * armAmp - (isJogging ? 0.25 : 0);
      if (rightArmRef.current) rightArmRef.current.rotation.x = swing * armAmp - (isJogging ? 0.25 : 0);
      if (headRef.current) {
        headRef.current.rotation.y = hasGuardCap ? Math.sin(t * 0.5) * 0.25 : 0;
      }

      if (rootRef.current) {
        const bounce = Math.abs(Math.sin(t)) * (isJogging ? 0.045 : 0.022);
        rootRef.current.position.y = position[1] + bounce;
        rootRef.current.rotation.x = isJogging ? -0.06 : 0;
      }
      return;
    }

    // Idle
    if (rootRef.current) {
      rootRef.current.position.y = position[1];
      rootRef.current.rotation.x = 0;
    }
    if (leftLegRef.current) leftLegRef.current.rotation.set(0, 0, 0);
    if (rightLegRef.current) rightLegRef.current.rotation.set(0, 0, 0);
    if (leftArmRef.current) leftArmRef.current.rotation.set(0, 0, 0);
    if (rightArmRef.current) rightArmRef.current.rotation.set(0, 0, 0);
    if (headRef.current) headRef.current.rotation.set(0, 0, 0);
  });

  return (
    <group ref={rootRef} position={position as [number, number, number]} rotation={[0, rotationY, 0]} scale={[scale, scale, scale]}>
      {/* LOWER BODY */}
      <mesh position={[0, 0.72, 0]} geometry={_hipGeo} material={mats.pants} />

      {/* Guard Belt */}
      {hasGuardUniform && (
        <group position={[0, 0.76, 0]}>
          <mesh geometry={getCachedBoxGeo(0.32, 0.06, 0.22)} material={getCachedMaterial('#0f172a', 0.5)} />
          <mesh position={[0, 0, 0.115]} geometry={getCachedBoxGeo(0.06, 0.06, 0.01)} material={getCachedMaterial('#fbbf24', 0.2, 0.9)} />
          <mesh position={[0.16, -0.08, 0]} geometry={getCachedCylinderGeo(0.025, 0.025, 0.16, 6)} material={getCachedMaterial('#1e293b', 0.5)} />
        </group>
      )}

      {/* Left Leg */}
      <group position={[-0.09, 0.68, 0]} ref={leftLegRef}>
        <mesh position={[0, -0.22, 0]} geometry={_thighGeo} material={mats.pants} />
        <mesh position={[0, -0.52, 0]} geometry={_calfGeo} material={mats.calfSkin} />
        <mesh position={[0, -0.7, 0.05]} geometry={_shoeGeo} material={mats.shoes} />
      </group>

      {/* Right Leg */}
      <group position={[0.09, 0.68, 0]} ref={rightLegRef}>
        <mesh position={[0, -0.22, 0]} geometry={_thighGeo} material={mats.pants} />
        <mesh position={[0, -0.52, 0]} geometry={_calfGeo} material={mats.calfSkin} />
        <mesh position={[0, -0.7, 0.05]} geometry={_shoeGeo} material={mats.shoes} />
      </group>

      {/* UPPER BODY */}
      <group position={[0, 0.95, 0]}>
        <mesh position={[0, 0.12, 0]} geometry={_torsoGeo} material={mats.shirt} />

        {/* Guard details */}
        {hasGuardUniform && (
          <group position={[0, 0.12, 0]}>
            <mesh position={[-0.09, 0.09, 0.115]} geometry={getCachedBoxGeo(0.05, 0.06, 0.01)} material={getCachedMaterial('#fbbf24', 0.2, 0.9)} />
            <mesh position={[-0.18, 0.2, 0]} geometry={getCachedBoxGeo(0.06, 0.02, 0.14)} material={getCachedMaterial('#0f172a', 0.5)} />
            <mesh position={[0.18, 0.2, 0]} geometry={getCachedBoxGeo(0.06, 0.02, 0.14)} material={getCachedMaterial('#0f172a', 0.5)} />
          </group>
        )}

        {/* Safety Vest */}
        {hasSafetyVest && (
          <group position={[0, 0.12, 0]}>
            <mesh geometry={getCachedBoxGeo(0.35, 0.4, 0.23)} material={getCachedMaterial('#ea580c', 0.5)} />
            <mesh position={[0, 0.08, 0.12]} geometry={getCachedBoxGeo(0.36, 0.04, 0.01)} material={getCachedMaterial('#facc15', 0.3, 0, { emissive: '#ca8a04', emissiveIntensity: 0.3 })} />
            <mesh position={[0, -0.08, 0.12]} geometry={getCachedBoxGeo(0.36, 0.04, 0.01)} material={getCachedMaterial('#facc15', 0.3, 0, { emissive: '#ca8a04', emissiveIntensity: 0.3 })} />
          </group>
        )}
      </group>

      {/* ARMS */}
      <group position={[-0.21, 1.25, 0]} ref={leftArmRef}>
        <mesh position={[0, -0.16, 0]} geometry={_upperArmGeo} material={mats.shirt} />
        <mesh position={[0, -0.4, 0]} geometry={_forearmGeo} material={mats.skin} />
      </group>
      <group position={[0.21, 1.25, 0]} ref={rightArmRef}>
        <mesh position={[0, -0.16, 0]} geometry={_upperArmGeo} material={mats.shirt} />
        <mesh position={[0, -0.4, 0]} geometry={_forearmGeo} material={mats.skin} />
      </group>

      {/* HEAD */}
      <group position={[0, 1.45, 0]} ref={headRef}>
        <mesh position={[0, -0.1, 0]} geometry={_neckGeo} material={mats.skin} />
        <mesh position={[0, 0.04, 0]} geometry={_headGeo} material={mats.skin} />
        <mesh position={[-0.045, 0.06, 0.11]} geometry={_eyeGeo} material={_eyeMat} />
        <mesh position={[0.045, 0.06, 0.11]} geometry={_eyeGeo} material={_eyeMat} />

        {/* Hair */}
        {!hasHardHat && !hasHelmet && !hasGuardCap && (
          <mesh position={[0, 0.1, -0.02]}>
            <sphereGeometry args={[0.135, 8, 8, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
            <meshStandardMaterial color={hairColor} roughness={0.8} />
          </mesh>
        )}

        {/* Headband */}
        {hasHeadband && (
          <mesh position={[0, 0.08, 0]} geometry={getCachedCylinderGeo(0.132, 0.132, 0.04, 8)} material={getCachedMaterial('#f43f5e', 0.5)} />
        )}

        {/* Hard Hat */}
        {hasHardHat && (
          <group position={[0, 0.08, 0]}>
            <mesh>
              <sphereGeometry args={[0.15, 8, 8, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
              <meshStandardMaterial color="#facc15" roughness={0.3} metalness={0.2} />
            </mesh>
            <mesh position={[0, -0.01, 0.04]} rotation={[0.1, 0, 0]} geometry={getCachedBoxGeo(0.32, 0.02, 0.34)} material={getCachedMaterial('#facc15', 0.3)} />
          </group>
        )}

        {/* Guard Cap */}
        {hasGuardCap && (
          <group position={[0, 0.1, 0]}>
            <mesh position={[0, 0.02, 0]} geometry={getCachedCylinderGeo(0.16, 0.14, 0.09, 12)} material={getCachedMaterial('#0f172a', 0.4)} />
            <mesh position={[0, -0.01, 0]} geometry={getCachedCylinderGeo(0.145, 0.145, 0.02, 12)} material={getCachedMaterial('#fbbf24', 0.2, 0.9)} />
            <mesh position={[0, -0.02, 0.12]} rotation={[0.2, 0, 0]} geometry={getCachedBoxGeo(0.26, 0.02, 0.12)} material={getCachedMaterial('#000000', 0.1, 0.8)} />
            <mesh position={[0, 0.04, 0.15]} geometry={getCachedBoxGeo(0.04, 0.04, 0.01)} material={getCachedMaterial('#fbbf24', 0.2, 0.9)} />
          </group>
        )}

        {/* Cyclist Helmet */}
        {hasHelmet && (
          <mesh position={[0, 0.08, -0.02]}>
            <sphereGeometry args={[0.155, 8, 8, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
            <meshStandardMaterial color="#0284c7" metalness={0.4} roughness={0.3} />
          </mesh>
        )}
      </group>
    </group>
  );
});

// Shared bicycle geometries (created once)
const _tireGeo = new THREE.TorusGeometry(0.3, 0.032, 8, 20);
const _tireMat = getCachedMaterial('#0f172a', 0.9);
const _hubGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.09, 8);
const _hubMat = getCachedMaterial('#cbd5e1', 0.3, 0.8);
const _spokeGeo = new THREE.CylinderGeometry(0.005, 0.005, 0.58, 3);
const _spokeMat = getCachedMaterial('#94a3b8', 0.3, 0.6);
const _frameMat = getCachedMaterial('#0284c7', 0.3, 0.7);
const _seatMat = getCachedMaterial('#0f172a', 0.6);
const _gripMat = getCachedMaterial('#f43f5e', 0.5);
const _handleMat = getCachedMaterial('#1e293b', 0.5);
const _pedalMat = getCachedMaterial('#1e293b', 0.5);
const _crankMat = getCachedMaterial('#94a3b8', 0.3, 0.8);

// ------------------------------------------------------------
// 2. DEDICATED REALISTIC CYCLIST & BICYCLE
// ------------------------------------------------------------
export interface RealisticCyclistProps {
  position?: [number, number, number];
  rotationY?: number;
  speed?: number;
}

export const RealisticCyclist3D: React.FC<RealisticCyclistProps> = React.memo(({
  position = [0, 0, 0],
  rotationY = 0,
  speed = 1.0,
}) => {
  const wheelFrontRef = useRef<THREE.Group>(null);
  const wheelRearRef = useRef<THREE.Group>(null);
  const pedalsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * 6.0 * speed;
    if (wheelFrontRef.current) wheelFrontRef.current.rotation.x = t;
    if (wheelRearRef.current) wheelRearRef.current.rotation.x = t;
    if (pedalsRef.current) pedalsRef.current.rotation.x = t;
  });

  return (
    <group position={position as [number, number, number]} rotation={[0, rotationY, 0]}>
      {/* BICYCLE GEOMETRY */}
      <group position={[0, 0.35, 0]}>
        {/* Front Wheel */}
        <group position={[0, 0, 0.55]} ref={wheelFrontRef}>
          <mesh rotation={[0, Math.PI / 2, 0]} geometry={_tireGeo} material={_tireMat} />
          <mesh rotation={[0, 0, Math.PI / 2]} geometry={_hubGeo} material={_hubMat} />
          <mesh geometry={_spokeGeo} material={_spokeMat} />
          <mesh rotation={[Math.PI / 2, 0, 0]} geometry={_spokeGeo} material={_spokeMat} />
        </group>

        {/* Rear Wheel */}
        <group position={[0, 0, -0.55]} ref={wheelRearRef}>
          <mesh rotation={[0, Math.PI / 2, 0]} geometry={_tireGeo} material={_tireMat} />
          <mesh rotation={[0, 0, Math.PI / 2]} geometry={_hubGeo} material={_hubMat} />
          <mesh geometry={_spokeGeo} material={_spokeMat} />
          <mesh rotation={[Math.PI / 2, 0, 0]} geometry={_spokeGeo} material={_spokeMat} />
        </group>

        {/* Frame Tubes */}
        <mesh position={[0, 0.32, 0]} rotation={[0.1, 0, 0]} geometry={getCachedCylinderGeo(0.02, 0.02, 0.85, 6)} material={_frameMat} />
        <mesh position={[0, 0.15, 0.15]} rotation={[-0.6, 0, 0]} geometry={getCachedCylinderGeo(0.024, 0.024, 0.88, 6)} material={_frameMat} />
        <mesh position={[0, 0.18, -0.15]} rotation={[0.3, 0, 0]} geometry={getCachedCylinderGeo(0.022, 0.022, 0.72, 6)} material={_frameMat} />
        <mesh position={[0, 0.12, 0.5]} rotation={[-0.25, 0, 0]} geometry={getCachedCylinderGeo(0.02, 0.02, 0.68, 6)} material={_hubMat} />

        {/* Handlebars */}
        <group position={[0, 0.46, 0.44]}>
          <mesh rotation={[0, 0, Math.PI / 2]} geometry={getCachedCylinderGeo(0.018, 0.018, 0.44, 6)} material={_handleMat} />
          <mesh position={[-0.21, 0, 0]} rotation={[0, 0, Math.PI / 2]} geometry={getCachedCylinderGeo(0.022, 0.022, 0.08, 6)} material={_gripMat} />
          <mesh position={[0.21, 0, 0]} rotation={[0, 0, Math.PI / 2]} geometry={getCachedCylinderGeo(0.022, 0.022, 0.08, 6)} material={_gripMat} />
        </group>

        {/* Saddle Seat */}
        <mesh position={[0, 0.42, -0.22]} rotation={[-0.1, 0, 0]} geometry={getCachedBoxGeo(0.14, 0.04, 0.22)} material={_seatMat} />

        {/* Pedals */}
        <group position={[0, -0.1, -0.05]} ref={pedalsRef}>
          <mesh rotation={[0, 0, Math.PI / 2]} geometry={getCachedCylinderGeo(0.015, 0.015, 0.28, 6)} material={_crankMat} />
          <mesh position={[0.16, 0.08, 0]} geometry={getCachedBoxGeo(0.08, 0.02, 0.09)} material={_pedalMat} />
          <mesh position={[-0.16, -0.08, 0]} geometry={getCachedBoxGeo(0.08, 0.02, 0.09)} material={_pedalMat} />
        </group>
      </group>

      {/* CYCLIST RIDER */}
      <group position={[0, 0.28, -0.18]}>
        <StylizedHuman3D
          position={[0, 0, 0]}
          scale={0.86}
          shirtColor="#0284c7"
          pantsColor="#0f172a"
          hasHelmet={true}
          isWalking={false}
          isCycling={true}
          speed={speed}
        />
      </group>
    </group>
  );
});

// ------------------------------------------------------------
// 3. DEDICATED PARK RANGER / SECURITY GUARD
// ------------------------------------------------------------
export const ParkSecurityGuard3D: React.FC<{
  position: [number, number, number];
  rotationY: number;
  isWalking?: boolean;
}> = ({ position, rotationY, isWalking = true }) => {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <StylizedHuman3D
        position={[0, 0, 0]}
        scale={0.95}
        shirtColor="#166534"
        pantsColor="#475569"
        hairColor="#1e293b"
        skinColor="#fed7aa"
        hasGuardUniform={true}
        hasGuardCap={true}
        isWalking={isWalking}
        speed={0.85}
      />
    </group>
  );
};
