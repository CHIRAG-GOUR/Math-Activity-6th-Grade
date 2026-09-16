// ============================================================
// GRAPHWORKS — THE DATA CITY: City Transit & Intelligent Traffic Simulation
// Multi-lane moving vehicles (sedans, transit buses, delivery vans) with
// car-following collision avoidance, crosswalk braking at zebra stripes,
// aerodynamic bullet train on elevated railway, and road infrastructure.
// ============================================================
'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CITY_MAT } from './CityMaterials';

// Individual procedural vehicle component with wheels and lights
function VehicleModel({
  color,
  type = 'sedan',
  brakeLightsOn = false,
}: {
  color: string;
  type?: 'sedan' | 'bus' | 'van';
  brakeLightsOn?: boolean;
}) {
  const isBus = type === 'bus';
  const isVan = type === 'van';

  const bodyLength = isBus ? 3.8 : isVan ? 2.4 : 1.9;
  const bodyHeight = isBus ? 1.2 : isVan ? 1.05 : 0.68;
  const bodyWidth = isBus ? 1.05 : 0.88;

  return (
    <group>
      {/* Main Vehicle Body Chassis */}
      <mesh position={[0, bodyHeight / 2 + 0.15, 0]} castShadow>
        <boxGeometry args={[bodyWidth, bodyHeight, bodyLength]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.25} />
      </mesh>

      {/* Windshield & Cabin Glass */}
      {!isBus && (
        <mesh position={[0, bodyHeight + 0.05, -0.1]} castShadow>
          <boxGeometry args={[bodyWidth * 0.92, 0.45, bodyLength * 0.52]} />
          <meshStandardMaterial color="#0f172a" roughness={0.15} metalness={0.7} />
        </mesh>
      )}

      {isBus && (
        <mesh position={[0, bodyHeight * 0.7 + 0.15, 0]}>
          <boxGeometry args={[bodyWidth * 1.02, 0.4, bodyLength * 0.88]} />
          <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.6} />
        </mesh>
      )}

      {/* Headlights (Warm White Glow) */}
      <mesh position={[-bodyWidth * 0.35, 0.35, -bodyLength / 2 - 0.02]}>
        <boxGeometry args={[0.15, 0.1, 0.05]} />
        <meshStandardMaterial color="#fffef0" emissive="#fffef0" emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[bodyWidth * 0.35, 0.35, -bodyLength / 2 - 0.02]}>
        <boxGeometry args={[0.15, 0.1, 0.05]} />
        <meshStandardMaterial color="#fffef0" emissive="#fffef0" emissiveIntensity={1.2} />
      </mesh>

      {/* Taillights / Brake Lights */}
      <mesh position={[-bodyWidth * 0.35, 0.35, bodyLength / 2 + 0.02]}>
        <boxGeometry args={[0.15, 0.1, 0.05]} />
        <meshStandardMaterial
          color="#ef4444"
          emissive="#dc2626"
          emissiveIntensity={brakeLightsOn ? 2.5 : 0.8}
        />
      </mesh>
      <mesh position={[bodyWidth * 0.35, 0.35, bodyLength / 2 + 0.02]}>
        <boxGeometry args={[0.15, 0.1, 0.05]} />
        <meshStandardMaterial
          color="#ef4444"
          emissive="#dc2626"
          emissiveIntensity={brakeLightsOn ? 2.5 : 0.8}
        />
      </mesh>

      {/* Wheels with Rims */}
      {[-bodyWidth / 2 - 0.03, bodyWidth / 2 + 0.03].map((wx, i) => (
        <React.Fragment key={i}>
          <mesh position={[wx, 0.18, -bodyLength * 0.3]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.18, 0.18, 0.07, 12]} />
            <meshStandardMaterial color="#1e293b" roughness={0.9} />
          </mesh>
          <mesh position={[wx, 0.18, bodyLength * 0.3]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.18, 0.18, 0.07, 12]} />
            <meshStandardMaterial color="#1e293b" roughness={0.9} />
          </mesh>
        </React.Fragment>
      ))}
    </group>
  );
}

export function CityTransit3D() {
  const trainRef = useRef<THREE.Group>(null);
  const trafficGroupRef = useRef<THREE.Group>(null);

  // Dynamic vehicles with current positions, velocities, and lane directions
  const vehicles = useMemo(
    () => [
      // Westbound Lane (Z = 4.6, +X travel)
      { id: 1, x: -28, z: 4.6, baseSpeed: 5.0, currentSpeed: 5.0, type: 'sedan' as const, color: '#2563eb', rotY: Math.PI / 2, isBraking: false },
      { id: 2, x: -14, z: 4.6, baseSpeed: 4.5, currentSpeed: 4.5, type: 'bus' as const, color: '#0284c7', rotY: Math.PI / 2, isBraking: false },
      { id: 3, x: 2, z: 4.6, baseSpeed: 5.2, currentSpeed: 5.2, type: 'sedan' as const, color: '#f59e0b', rotY: Math.PI / 2, isBraking: false },
      { id: 4, x: 18, z: 4.6, baseSpeed: 4.8, currentSpeed: 4.8, type: 'van' as const, color: '#ffffff', rotY: Math.PI / 2, isBraking: false },

      // Eastbound Lane (Z = 6.4, -X travel)
      { id: 5, x: 28, z: 6.4, baseSpeed: -5.0, currentSpeed: -5.0, type: 'sedan' as const, color: '#dc2626', rotY: -Math.PI / 2, isBraking: false },
      { id: 6, x: 14, z: 6.4, baseSpeed: -4.3, currentSpeed: -4.3, type: 'bus' as const, color: '#ef4444', rotY: -Math.PI / 2, isBraking: false },
      { id: 7, x: -2, z: 6.4, baseSpeed: -5.1, currentSpeed: -5.1, type: 'sedan' as const, color: '#ffffff', rotY: -Math.PI / 2, isBraking: false },
      { id: 8, x: -18, z: 6.4, baseSpeed: -4.7, currentSpeed: -4.7, type: 'sedan' as const, color: '#10b981', rotY: -Math.PI / 2, isBraking: false },
    ],
    []
  );

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // ── 1. VEHICLE SIMULATION: SPACING PHYSICS & CROSSWALK BRAKING ──
    // Periodic pedestrian crossing window (every 14s for 3.5s)
    const isCrossingCycle = (t % 14) > 10.5;

    vehicles.forEach((v, idx) => {
      let desiredSpeed = v.baseSpeed;
      v.isBraking = false;

      // Check distance to crosswalks at X = -5 and X = +5
      const crosswalks = [-5.0, 5.0];
      if (isCrossingCycle) {
        crosswalks.forEach((cwX) => {
          if (v.baseSpeed > 0 && v.x < cwX && cwX - v.x < 4.0 && cwX - v.x > 0.3) {
            // Westbound car approaching crosswalk from left: decelerate to complete stop
            desiredSpeed = 0;
            v.isBraking = true;
          } else if (v.baseSpeed < 0 && v.x > cwX && v.x - cwX < 4.0 && v.x - cwX > 0.3) {
            // Eastbound car approaching crosswalk from right: decelerate to complete stop
            desiredSpeed = 0;
            v.isBraking = true;
          }
        });
      }

      // Check distance to car directly ahead in same lane (car-following spacing physics)
      vehicles.forEach((otherV, otherIdx) => {
        if (idx === otherIdx || v.z !== otherV.z) return;
        if (v.baseSpeed > 0) {
          // Moving in +X direction
          const dist = otherV.x - v.x;
          if (dist > 0 && dist < 6.5) {
            desiredSpeed = Math.min(desiredSpeed, Math.max(0, otherV.currentSpeed * 0.9));
            if (dist < 4.5) v.isBraking = true;
          }
        } else {
          // Moving in -X direction
          const dist = v.x - otherV.x;
          if (dist > 0 && dist < 6.5) {
            desiredSpeed = Math.max(desiredSpeed, Math.min(0, otherV.currentSpeed * 0.9));
            if (dist < 4.5) v.isBraking = true;
          }
        }
      });

      // Smooth acceleration / deceleration
      v.currentSpeed = THREE.MathUtils.damp(v.currentSpeed, desiredSpeed, 4, delta);
      v.x += v.currentSpeed * delta;

      // Wrap around road boundaries (-36 to +36)
      if (v.x > 36) v.x = -36;
      if (v.x < -36) v.x = 36;

      // Update Three.js vehicle group transform
      if (trafficGroupRef.current && trafficGroupRef.current.children[idx]) {
        const carGroup = trafficGroupRef.current.children[idx];
        carGroup.position.x = v.x;
        // Subtle pitch dip under heavy braking
        carGroup.rotation.z = v.isBraking ? (v.baseSpeed > 0 ? 0.03 : -0.03) : 0;
      }
    });

    // ── 2. BULLET TRAIN CRUISE ──
    if (trainRef.current) {
      const trainX = -18 + ((t * 6.5) % 36);
      trainRef.current.position.x = trainX;
    }
  });

  return (
    <group>
      {/* ── 1. MAIN ARTERIAL HIGHWAY AVENUE ── */}
      <group position={[0, 0, 5.5]}>
        {/* Asphalt Road Surface */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
          <planeGeometry args={[72, 3.8]} />
          <primitive object={CITY_MAT.asphalt} attach="material" />
        </mesh>
        {/* Yellow Broken Centerline */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 0]}>
          <planeGeometry args={[72, 0.12]} />
          <primitive object={CITY_MAT.roadMarkingYellow} attach="material" />
        </mesh>
        {/* Solid White Edge Lines */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, -1.75]}>
          <planeGeometry args={[72, 0.08]} />
          <primitive object={CITY_MAT.roadMarkingWhite} attach="material" />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 1.75]}>
          <planeGeometry args={[72, 0.08]} />
          <primitive object={CITY_MAT.roadMarkingWhite} attach="material" />
        </mesh>

        {/* Concrete Sidewalks with Curbs */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, -2.4]}>
          <planeGeometry args={[72, 1.1]} />
          <primitive object={CITY_MAT.sidewalk} attach="material" />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 2.4]}>
          <planeGeometry args={[72, 1.1]} />
          <primitive object={CITY_MAT.sidewalk} attach="material" />
        </mesh>

        {/* Modern Streetlamps along Boulevard */}
        {[-26, -18, -10, 0, 10, 18, 26].map((lx) => (
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
          <group key={v.id} position={[v.x, 0, v.z]} rotation={[0, v.rotY, 0]}>
            <VehicleModel color={v.color} type={v.type} brakeLightsOn={v.isBraking} />
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
          {/* Cyan/Blue High-Speed Livery Stripe */}
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
    </group>
  );
}
