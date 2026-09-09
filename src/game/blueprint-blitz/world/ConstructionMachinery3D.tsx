// ============================================================
// BLUEPRINT BLITZ — 3D Construction Machinery
// High-detail stylized active construction vehicles:
// 1. Excavator: Articulated boom, hydraulic arm & rotating shovel bucket
// 2. Articulated Dump Truck: Heavy 6-wheel chassis & tipper bed
// 3. Cement Mixer: Rotating concrete barrel drum & truck chassis
// 4. Forklift: Mast, tines & pallet carrying unit bricks
// ============================================================

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ── 1. HEAVY TRACKED EXCAVATOR ──
export const Excavator3D: React.FC<{ position: [number, number, number]; rotation?: [number, number, number] }> = ({
  position,
  rotation = [0, 0, 0],
}) => {
  const boomRef = useRef<THREE.Group>(null);
  const bucketRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (boomRef.current) {
      boomRef.current.rotation.z = Math.sin(t * 0.8) * 0.15 - 0.3;
    }
    if (bucketRef.current) {
      bucketRef.current.rotation.z = Math.cos(t * 0.8) * 0.25 + 0.2;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Heavy Crawler Tracks */}
      <mesh position={[0, 0.35, 0.9]} castShadow>
        <boxGeometry args={[3.2, 0.7, 0.6]} />
        <meshStandardMaterial color="#1e293b" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.35, -0.9]} castShadow>
        <boxGeometry args={[3.2, 0.7, 0.6]} />
        <meshStandardMaterial color="#1e293b" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[2.0, 0.4, 1.4]} />
        <meshStandardMaterial color="#334155" metalness={0.7} />
      </mesh>

      {/* Rotating Upper Slew Body & Cabin */}
      <group position={[0, 0.7, 0]}>
        {/* Main Yellow Body & Engine Housing */}
        <mesh position={[-0.4, 0.6, 0]} castShadow>
          <boxGeometry args={[2.0, 1.0, 1.8]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.4} metalness={0.3} />
        </mesh>
        {/* Radiator Grille & Counterweight */}
        <mesh position={[-1.45, 0.5, 0]} castShadow>
          <boxGeometry args={[0.3, 0.8, 1.7]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} />
        </mesh>

        {/* Operator Cabin with Glass Windows */}
        <mesh position={[0.4, 0.75, 0.55]} castShadow>
          <boxGeometry args={[1.1, 1.2, 0.9]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.2} />
        </mesh>
        <mesh position={[0.6, 0.8, 0.55]}>
          <planeGeometry args={[0.5, 0.7]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.1} metalness={0.9} />
        </mesh>

        {/* Articulated Boom & Arm */}
        <group position={[0.8, 0.5, -0.3]}>
          {/* Main Boom Arm */}
          <group ref={boomRef} rotation={[0, 0, -0.4]}>
            <mesh position={[1.4, 0.8, 0]} rotation={[0, 0, 0.5]} castShadow>
              <boxGeometry args={[2.8, 0.3, 0.25]} />
              <meshStandardMaterial color="#f59e0b" roughness={0.4} />
            </mesh>
            {/* Hydraulic Cylinder */}
            <mesh position={[0.8, 0.4, 0]} rotation={[0, 0, 0.5]}>
              <cylinderGeometry args={[0.08, 0.08, 1.6, 8]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.9} />
            </mesh>

            {/* Stick (Forearm) */}
            <group position={[2.6, 1.5, 0]}>
              <mesh position={[0.8, -0.6, 0]} rotation={[0, 0, -0.8]} castShadow>
                <boxGeometry args={[2.0, 0.25, 0.22]} />
                <meshStandardMaterial color="#f59e0b" roughness={0.4} />
              </mesh>

              {/* Shovel Bucket */}
              <group ref={bucketRef} position={[1.7, -1.3, 0]}>
                <mesh castShadow>
                  <boxGeometry args={[0.8, 0.7, 0.8]} />
                  <meshStandardMaterial color="#334155" roughness={0.8} metalness={0.6} />
                </mesh>
                {/* Bucket Teeth */}
                <mesh position={[0.45, -0.3, 0]}>
                  <boxGeometry args={[0.2, 0.1, 0.75]} />
                  <meshStandardMaterial color="#f59e0b" />
                </mesh>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
};

// ── 2. ARTICULATED HEAVY DUMP TRUCK ──
export const DumpTruck3D: React.FC<{ position: [number, number, number]; rotation?: [number, number, number] }> = ({
  position,
  rotation = [0, 0, 0],
}) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Front Cabin Section */}
      <group position={[1.6, 0, 0]}>
        {/* Cabin Body (Bright Red/Safety Orange as in reference image) */}
        <mesh position={[0, 1.1, 0]} castShadow>
          <boxGeometry args={[1.8, 1.3, 1.8]} />
          <meshStandardMaterial color="#dc2626" roughness={0.3} metalness={0.2} />
        </mesh>
        {/* Windshield & Side Glass */}
        <mesh position={[0.91, 1.2, 0]}>
          <planeGeometry args={[0.2, 0.8]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.1} metalness={0.9} />
        </mesh>
        {/* Front Radiator Grille */}
        <mesh position={[0.92, 0.7, 0]}>
          <boxGeometry args={[0.05, 0.5, 1.4]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} />
        </mesh>
        {/* Headlights */}
        <mesh position={[0.92, 0.6, 0.6]}>
          <cylinderGeometry args={[0.1, 0.1, 0.05, 8]} />
          <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.8} />
        </mesh>
        <mesh position={[0.92, 0.6, -0.6]}>
          <cylinderGeometry args={[0.1, 0.1, 0.05, 8]} />
          <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.8} />
        </mesh>

        {/* Front Wheels (2 Wheels) */}
        <mesh position={[0.3, 0.45, 1.05]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.45, 0.45, 0.45, 16]} />
          <meshStandardMaterial color="#0f172a" roughness={0.9} />
        </mesh>
        <mesh position={[0.3, 0.45, -1.05]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.45, 0.45, 0.45, 16]} />
          <meshStandardMaterial color="#0f172a" roughness={0.9} />
        </mesh>
      </group>

      {/* Rear Articulated Heavy Tipper Bed & 4 Wheels */}
      <group position={[-1.2, 0, 0]}>
        {/* Heavy Dump Tipper Bed */}
        <mesh position={[0, 1.25, 0]} castShadow>
          <boxGeometry args={[3.2, 1.3, 2.0]} />
          <meshStandardMaterial color="#dc2626" roughness={0.4} />
        </mesh>
        {/* Gravel / Earth Pile in Bed */}
        <mesh position={[0, 1.6, 0]}>
          <boxGeometry args={[2.8, 0.4, 1.7]} />
          <meshStandardMaterial color="#78350f" roughness={0.9} />
        </mesh>

        {/* Rear Wheels (4 Wheels on Tandem Axle) */}
        {[-0.8, 0.8].map((xOffset, idx) => (
          <group key={idx}>
            <mesh position={[xOffset, 0.45, 1.1]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.45, 0.45, 0.45, 16]} />
              <meshStandardMaterial color="#0f172a" roughness={0.9} />
            </mesh>
            <mesh position={[xOffset, 0.45, -1.1]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.45, 0.45, 0.45, 16]} />
              <meshStandardMaterial color="#0f172a" roughness={0.9} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
};

// ── 3. ROTATING CEMENT MIXER TRUCK ──
export const CementMixer3D: React.FC<{ position: [number, number, number]; rotation?: [number, number, number] }> = ({
  position,
  rotation = [0, 0, 0],
}) => {
  const drumRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (drumRef.current) {
      drumRef.current.rotation.x += delta * 1.8;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Truck Chassis & Wheels */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[4.4, 0.35, 1.6]} />
        <meshStandardMaterial color="#334155" metalness={0.7} />
      </mesh>

      {/* Front Blue Cabin */}
      <group position={[1.6, 0, 0]}>
        <mesh position={[0, 0.9, 0]} castShadow>
          <boxGeometry args={[1.3, 1.1, 1.6]} />
          <meshStandardMaterial color="#0284c7" roughness={0.3} />
        </mesh>
        <mesh position={[0.66, 1.0, 0]}>
          <planeGeometry args={[0.1, 0.6]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.1} />
        </mesh>
      </group>

      {/* Rotating Mixing Barrel Drum */}
      <group ref={drumRef} position={[-0.6, 1.3, 0]} rotation={[0, 0, 0.2]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.75, 0.95, 2.6, 16]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.5} metalness={0.2} />
        </mesh>
        {/* Spiral Spiral Stripes */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.77, 0.97, 0.4, 16]} />
          <meshStandardMaterial color="#f59e0b" />
        </mesh>
      </group>

      {/* Wheels */}
      {[-1.5, -0.6, 1.4].map((xPos, idx) => (
        <group key={idx}>
          <mesh position={[xPos, 0.35, 0.9]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.35, 0.35, 0.3, 16]} />
            <meshStandardMaterial color="#0f172a" roughness={0.9} />
          </mesh>
          <mesh position={[xPos, 0.35, -0.9]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.35, 0.35, 0.3, 16]} />
            <meshStandardMaterial color="#0f172a" roughness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
};
