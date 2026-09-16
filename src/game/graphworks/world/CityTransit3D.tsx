// ============================================================
// GRAPHWORKS — THE DATA CITY: City Transit & Traffic Simulation
// Multi-lane moving vehicles (sedans, transit buses, delivery vans),
// animated high-speed bullet train on monorail, and citizens walking.
// ============================================================
'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CITY_GEO, CITY_MAT, CITY_COLORS } from './CityMaterials';
import { useGraphworksStore } from '../store/graphworksStore';

// Individual procedural vehicle component
function VehicleModel({
  color,
  type = 'sedan',
}: {
  color: string;
  type?: 'sedan' | 'bus' | 'van';
}) {
  const isBus = type === 'bus';
  const isVan = type === 'van';

  const bodyLength = isBus ? 3.6 : isVan ? 2.2 : 1.8;
  const bodyHeight = isBus ? 1.1 : isVan ? 1.0 : 0.65;
  const bodyWidth = isBus ? 1.0 : 0.85;

  return (
    <group>
      {/* Chassis / Body */}
      <mesh position={[0, bodyHeight / 2 + 0.15, 0]} castShadow>
        <boxGeometry args={[bodyWidth, bodyHeight, bodyLength]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.2} />
      </mesh>

      {/* Windshield & Windows */}
      {!isBus && (
        <mesh position={[0, bodyHeight + 0.05, -0.1]} castShadow>
          <boxGeometry args={[bodyWidth * 0.9, 0.45, bodyLength * 0.55]} />
          <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.6} />
        </mesh>
      )}

      {/* Headlights */}
      <mesh position={[-bodyWidth * 0.35, 0.35, -bodyLength / 2 - 0.02]}>
        <boxGeometry args={[0.15, 0.1, 0.05]} />
        <meshStandardMaterial color="#fffef0" emissive="#fffef0" emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[bodyWidth * 0.35, 0.35, -bodyLength / 2 - 0.02]}>
        <boxGeometry args={[0.15, 0.1, 0.05]} />
        <meshStandardMaterial color="#fffef0" emissive="#fffef0" emissiveIntensity={1.2} />
      </mesh>

      {/* Red Taillights */}
      <mesh position={[-bodyWidth * 0.35, 0.35, bodyLength / 2 + 0.02]}>
        <boxGeometry args={[0.15, 0.1, 0.05]} />
        <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[bodyWidth * 0.35, 0.35, bodyLength / 2 + 0.02]}>
        <boxGeometry args={[0.15, 0.1, 0.05]} />
        <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={1.2} />
      </mesh>

      {/* Wheels */}
      {[-bodyWidth / 2 - 0.04, bodyWidth / 2 + 0.04].map((wx, i) => (
        <React.Fragment key={i}>
          <mesh position={[wx, 0.18, -bodyLength * 0.3]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.18, 0.18, 0.08, 12]} />
            <meshStandardMaterial color="#1e293b" roughness={0.9} />
          </mesh>
          <mesh position={[wx, 0.18, bodyLength * 0.3]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.18, 0.18, 0.08, 12]} />
            <meshStandardMaterial color="#1e293b" roughness={0.9} />
          </mesh>
        </React.Fragment>
      ))}
    </group>
  );
}

export function CityTransit3D() {
  const blueCity = useGraphworksStore((s) => s.blueCity);
  const redCity = useGraphworksStore((s) => s.redCity);

  const trainRef = useRef<THREE.Group>(null);
  const trafficGroupRef = useRef<THREE.Group>(null);
  const pedestriansRef = useRef<THREE.Group>(null);

  // Highway lanes and vehicles
  const vehicles = useMemo(() => [
    // Westbound Lane (Z = 4.6)
    { id: 1, basePos: [-20, 0, 4.6], speed: 4.8, type: 'sedan' as const, color: '#2563eb', rotY: Math.PI / 2 },
    { id: 2, basePos: [-6, 0, 4.6], speed: 4.5, type: 'bus' as const, color: '#0284c7', rotY: Math.PI / 2 },
    { id: 3, basePos: [10, 0, 4.6], speed: 5.2, type: 'sedan' as const, color: '#f59e0b', rotY: Math.PI / 2 },
    { id: 4, basePos: [24, 0, 4.6], speed: 4.6, type: 'van' as const, color: '#ffffff', rotY: Math.PI / 2 },

    // Eastbound Lane (Z = 6.4)
    { id: 5, basePos: [22, 0, 6.4], speed: -4.8, type: 'sedan' as const, color: '#dc2626', rotY: -Math.PI / 2 },
    { id: 6, basePos: [8, 0, 6.4], speed: -4.2, type: 'bus' as const, color: '#ef4444', rotY: -Math.PI / 2 },
    { id: 7, basePos: [-8, 0, 6.4], speed: -5.0, type: 'sedan' as const, color: '#ffffff', rotY: -Math.PI / 2 },
    { id: 8, basePos: [-22, 0, 6.4], speed: -4.6, type: 'sedan' as const, color: '#10b981', rotY: -Math.PI / 2 },
  ], []);

  // Citizens walking in park
  const pedestrians = useMemo(() => [
    { pos: [-4, 0, 11], speed: 0.8, color: '#2563eb' },
    { pos: [-1.5, 0, 11.5], speed: -0.7, color: '#dc2626' },
    { pos: [2, 0, 10.8], speed: 0.9, color: '#f59e0b' },
    { pos: [4.5, 0, 11.2], speed: -0.6, color: '#10b981' },
    { pos: [-8, 0, 11], speed: 0.75, color: '#64748b' },
    { pos: [8, 0, 11.5], speed: -0.85, color: '#3b82f6' },
  ], []);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // 1. Move vehicles along the highway avenue
    if (trafficGroupRef.current) {
      trafficGroupRef.current.children.forEach((carGroup, idx) => {
        const v = vehicles[idx];
        if (!v) return;

        // Position wrapped along X: -32 to +32
        const span = 64;
        let x = v.basePos[0] + t * v.speed;
        x = ((x + 32) % span) - 32;
        if (x < -32) x += span;

        carGroup.position.x = x;
      });
    }

    // 2. High-speed bullet train along elevated railway track
    if (trainRef.current) {
      // Train smoothly cruises along the line
      const trainX = -18 + ((t * 6.5) % 36);
      trainRef.current.position.x = trainX;
    }

    // 3. Citizens walking with subtle gait stride
    if (pedestriansRef.current) {
      pedestriansRef.current.children.forEach((ped, idx) => {
        const p = pedestrians[idx];
        if (!p) return;
        const x = p.pos[0] + Math.sin(t * p.speed) * 3.5;
        ped.position.x = x;
        // Subtle vertical bounce for walking gait
        ped.position.y = Math.abs(Math.sin(t * 5 + idx)) * 0.05;
      });
    }
  });

  return (
    <group>
      {/* ── 1. MAIN HIGHWAY ARTERIAL AVENUE ── */}
      <group position={[0, 0, 5.5]}>
        {/* Asphalt Road Surface */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
          <planeGeometry args={[70, 3.8]} />
          <primitive object={CITY_MAT.asphalt} attach="material" />
        </mesh>
        {/* Yellow Centerline */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 0]}>
          <planeGeometry args={[70, 0.12]} />
          <primitive object={CITY_MAT.roadMarkingYellow} attach="material" />
        </mesh>
        {/* White Edge Lines */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, -1.75]}>
          <planeGeometry args={[70, 0.08]} />
          <primitive object={CITY_MAT.roadMarkingWhite} attach="material" />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 1.75]}>
          <planeGeometry args={[70, 0.08]} />
          <primitive object={CITY_MAT.roadMarkingWhite} attach="material" />
        </mesh>

        {/* Concrete Sidewalks with Pedestrian Curbs */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, -2.4]}>
          <planeGeometry args={[70, 1.1]} />
          <primitive object={CITY_MAT.sidewalk} attach="material" />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 2.4]}>
          <planeGeometry args={[70, 1.1]} />
          <primitive object={CITY_MAT.sidewalk} attach="material" />
        </mesh>

        {/* Modern Streetlamps */}
        {[-24, -16, -8, 0, 8, 16, 24].map((lx) => (
          <group key={lx} position={[lx, 0, -2.5]}>
            <mesh position={[0, 1.6, 0]}>
              <cylinderGeometry args={[0.04, 0.06, 3.2, 8]} />
              <meshStandardMaterial color="#64748b" metalness={0.8} />
            </mesh>
            <mesh position={[0, 3.2, 0.4]}>
              <boxGeometry args={[0.1, 0.08, 0.8]} />
              <meshStandardMaterial color="#64748b" metalness={0.8} />
            </mesh>
            <mesh position={[0, 3.16, 0.7]}>
              <boxGeometry args={[0.12, 0.04, 0.2]} />
              <meshStandardMaterial color="#fffef0" emissive="#fffef0" emissiveIntensity={1.0} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ── 2. DYNAMIC VEHICLES ON HIGHWAY ── */}
      <group ref={trafficGroupRef}>
        {vehicles.map((v) => (
          <group key={v.id} position={v.basePos as [number, number, number]} rotation={[0, v.rotY, 0]}>
            <VehicleModel color={v.color} type={v.type} />
          </group>
        ))}
      </group>

      {/* ── 3. HIGH-SPEED BULLET TRAIN ON ELEVATED TRACK ── */}
      <group ref={trainRef} position={[0, 1.25, -14]}>
        {/* Streamlined Bullet Locomotive */}
        <group position={[3.2, 0, 0]}>
          <mesh position={[0, 0.5, 0]} castShadow>
            <boxGeometry args={[3.2, 0.9, 0.85]} />
            <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.4} />
          </mesh>
          {/* Aerodynamic Tapered Nose Cone */}
          <mesh position={[1.8, 0.35, 0]} rotation={[0, 0, -Math.PI / 6]} castShadow>
            <boxGeometry args={[0.9, 0.65, 0.84]} />
            <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.4} />
          </mesh>
          {/* Red/Blue Team Livery Stripe */}
          <mesh position={[0.2, 0.55, 0]}>
            <boxGeometry args={[3.4, 0.16, 0.88]} />
            <meshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={0.4} />
          </mesh>
          {/* Panoramic Cabin Glass */}
          <mesh position={[0.4, 0.65, 0]}>
            <boxGeometry args={[2.2, 0.3, 0.87]} />
            <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.7} />
          </mesh>
        </group>

        {/* Passenger Car 1 */}
        <group position={[0, 0, 0]}>
          <mesh position={[0, 0.5, 0]} castShadow>
            <boxGeometry args={[3.0, 0.9, 0.85]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.55, 0]}>
            <boxGeometry args={[3.05, 0.16, 0.88]} />
            <meshStandardMaterial color="#0284c7" />
          </mesh>
          <mesh position={[0, 0.65, 0]}>
            <boxGeometry args={[2.5, 0.3, 0.87]} />
            <meshStandardMaterial color="#0f172a" roughness={0.1} />
          </mesh>
        </group>

        {/* Passenger Car 2 */}
        <group position={[-3.2, 0, 0]}>
          <mesh position={[0, 0.5, 0]} castShadow>
            <boxGeometry args={[3.0, 0.9, 0.85]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.55, 0]}>
            <boxGeometry args={[3.05, 0.16, 0.88]} />
            <meshStandardMaterial color="#0284c7" />
          </mesh>
          <mesh position={[0, 0.65, 0]}>
            <boxGeometry args={[2.5, 0.3, 0.87]} />
            <meshStandardMaterial color="#0f172a" roughness={0.1} />
          </mesh>
        </group>
      </group>

      {/* ── 4. STYLIZED CITIZEN PEDESTRIANS IN PARK ── */}
      <group ref={pedestriansRef}>
        {pedestrians.map((p, idx) => (
          <group key={idx} position={p.pos as [number, number, number]}>
            {/* Legs */}
            <mesh position={[-0.08, 0.22, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 0.44, 6]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
            <mesh position={[0.08, 0.22, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 0.44, 6]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
            {/* Torso */}
            <mesh position={[0, 0.65, 0]}>
              <boxGeometry args={[0.26, 0.45, 0.16]} />
              <meshStandardMaterial color={p.color} roughness={0.6} />
            </mesh>
            {/* Head */}
            <mesh position={[0, 1.0, 0]}>
              <sphereGeometry args={[0.1, 10, 10]} />
              <meshStandardMaterial color="#fed7aa" roughness={0.6} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}
