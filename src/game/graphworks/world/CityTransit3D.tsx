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
import { cityTraffic } from './CityTrafficState';

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

import { useGraphworksStore } from '../store/graphworksStore';

export function CityTransit3D() {
  const blueTrainRef = useRef<THREE.Group>(null);
  const redTrainRef = useRef<THREE.Group>(null);
  const trafficGroupRef = useRef<THREE.Group>(null);

  const cityStage = useGraphworksStore((s) => s.cityStage);
  const blueCity = useGraphworksStore((s) => s.blueCity);
  const redCity = useGraphworksStore((s) => s.redCity);
  const blueMission = useGraphworksStore((s) => s.blue.currentMission);
  const redMission = useGraphworksStore((s) => s.red.currentMission);

  // Train positions (interpolated smoothly)
  const blueTrainX = useRef(-12);
  const redTrainX = useRef(-12);

  // Dynamic vehicles with current positions, velocities, and lane directions
  const vehicles = useMemo(
    () => [
      // Westbound Lane (Z = 4.6, +X travel, Blue Lane)
      { id: 1, lane: 'blue' as const, slot: 0, x: -28, z: 4.6, baseSpeed: 5.2, currentSpeed: 5.2, type: 'sedan' as const, color: '#2563eb', rotY: Math.PI / 2, isBraking: false },
      { id: 2, lane: 'blue' as const, slot: 1, x: -16, z: 4.6, baseSpeed: 4.6, currentSpeed: 4.6, type: 'bus' as const, color: '#0284c7', rotY: Math.PI / 2, isBraking: false },
      { id: 3, lane: 'blue' as const, slot: 2, x: -4, z: 4.6, baseSpeed: 5.0, currentSpeed: 5.0, type: 'sedan' as const, color: '#38bdf8', rotY: Math.PI / 2, isBraking: false },
      { id: 4, lane: 'blue' as const, slot: 3, x: 8, z: 4.6, baseSpeed: 4.8, currentSpeed: 4.8, type: 'van' as const, color: '#ffffff', rotY: Math.PI / 2, isBraking: false },
      { id: 5, lane: 'blue' as const, slot: 4, x: 20, z: 4.6, baseSpeed: 5.1, currentSpeed: 5.1, type: 'sedan' as const, color: '#1d4ed8', rotY: Math.PI / 2, isBraking: false },
      { id: 6, lane: 'blue' as const, slot: 5, x: 32, z: 4.6, baseSpeed: 4.7, currentSpeed: 4.7, type: 'sedan' as const, color: '#60a5fa', rotY: Math.PI / 2, isBraking: false },

      // Eastbound Lane (Z = 6.4, -X travel, Red Lane)
      { id: 7, lane: 'red' as const, slot: 0, x: 28, z: 6.4, baseSpeed: -5.2, currentSpeed: -5.2, type: 'sedan' as const, color: '#dc2626', rotY: -Math.PI / 2, isBraking: false },
      { id: 8, lane: 'red' as const, slot: 1, x: 16, z: 6.4, baseSpeed: -4.5, currentSpeed: -4.5, type: 'bus' as const, color: '#ef4444', rotY: -Math.PI / 2, isBraking: false },
      { id: 9, lane: 'red' as const, slot: 2, x: 4, z: 6.4, baseSpeed: -5.0, currentSpeed: -5.0, type: 'sedan' as const, color: '#f87171', rotY: -Math.PI / 2, isBraking: false },
      { id: 10, lane: 'red' as const, slot: 3, x: -8, z: 6.4, baseSpeed: -4.8, currentSpeed: -4.8, type: 'van' as const, color: '#ffffff', rotY: -Math.PI / 2, isBraking: false },
      { id: 11, lane: 'red' as const, slot: 4, x: -20, z: 6.4, baseSpeed: -5.1, currentSpeed: -5.1, type: 'sedan' as const, color: '#b91c1c', rotY: -Math.PI / 2, isBraking: false },
      { id: 12, lane: 'red' as const, slot: 5, x: -32, z: 6.4, baseSpeed: -4.7, currentSpeed: -4.7, type: 'sedan' as const, color: '#fb7185', rotY: -Math.PI / 2, isBraking: false },
    ],
    []
  );

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // ── 1. ACTIVE TRAFFIC DENSITY DRIVEN DIRECTLY BY GRAPH PLOTS ──
    const blueCount = blueCity.traffic.vehicleCount;
    const redCount = redCity.traffic.vehicleCount;

    // Active slots per lane
    const blueActiveLimit = blueCount <= 10 ? 2 : blueCount <= 22 ? 4 : 6;
    const redActiveLimit = redCount <= 10 ? 2 : redCount <= 22 ? 4 : 6;

    // Speed multiplier based on congestion
    const blueSpeedMult = Math.max(0.55, 1.2 - (blueCount / 50) * 0.5);
    const redSpeedMult = Math.max(0.55, 1.2 - (redCount / 50) * 0.5);

    // Periodic pedestrian crossing window (every 14s for 3.5s)
    const isCrossingCycle = (t % 14) > 10.5;

    vehicles.forEach((v, idx) => {
      const isBlue = v.lane === 'blue';
      const activeLimit = isBlue ? blueActiveLimit : redActiveLimit;
      const speedMult = isBlue ? blueSpeedMult : redSpeedMult;
      const isActive = v.slot < activeLimit;

      let desiredSpeed = v.baseSpeed * speedMult;
      v.isBraking = false;

      // Check distance to crosswalks at X = -5 and X = +5
      const crosswalks = [-5.0, 5.0];
      crosswalks.forEach((cwX) => {
        const pedCrossing = cityTraffic.isPedestrianInCrosswalk(cwX);
        if (pedCrossing || isCrossingCycle) {
          if (v.baseSpeed > 0 && v.x < cwX && cwX - v.x < 5.0 && cwX - v.x > 0.2) {
            desiredSpeed = 0;
            v.isBraking = true;
          } else if (v.baseSpeed < 0 && v.x > cwX && v.x - cwX < 5.0 && v.x - cwX > 0.2) {
            desiredSpeed = 0;
            v.isBraking = true;
          }
        }
      });

      // Car-following spacing physics
      vehicles.forEach((otherV, otherIdx) => {
        if (idx === otherIdx || v.z !== otherV.z) return;
        if (v.baseSpeed > 0) {
          const dist = otherV.x - v.x;
          if (dist > 0 && dist < 6.5) {
            desiredSpeed = Math.min(desiredSpeed, Math.max(0, otherV.currentSpeed * 0.9));
            if (dist < 4.5) v.isBraking = true;
          }
        } else {
          const dist = v.x - otherV.x;
          if (dist > 0 && dist < 6.5) {
            desiredSpeed = Math.max(desiredSpeed, Math.min(0, otherV.currentSpeed * 0.9));
            if (dist < 4.5) v.isBraking = true;
          }
        }
      });

      // Smooth acceleration / deceleration
      v.currentSpeed = THREE.MathUtils.damp(v.currentSpeed, desiredSpeed, 4.5, delta);
      v.x += v.currentSpeed * delta;

      // Wrap around road boundaries (-36 to +36)
      if (v.x > 36) v.x = -36;
      if (v.x < -36) v.x = 36;

      // Update coordinator with live state
      cityTraffic.updateVehicle(v.id, v.x, v.z, v.currentSpeed, v.isBraking);

      // Update Three.js vehicle group transform
      if (trafficGroupRef.current && trafficGroupRef.current.children[idx]) {
        const carGroup = trafficGroupRef.current.children[idx] as THREE.Group;
        carGroup.visible = isActive;
        carGroup.position.x = v.x;
        carGroup.rotation.z = v.isBraking ? (v.baseSpeed > 0 ? 0.03 : -0.03) : 0;
      }
    });

    // ── 2. BULLET TRAIN PHYSICS DIRECTLY CONTROLLED BY GRAPH PLOTS ──
    // Blue Train
    if (blueTrainRef.current) {
      if (blueMission?.district === 'train') {
        const targetX = -13 + Math.min(1, Math.max(0, blueCity.train.trainPosition)) * 26;
        blueTrainX.current = THREE.MathUtils.damp(
          blueTrainX.current,
          targetX,
          blueCity.train.isStopped ? 8.0 : 3.5,
          delta
        );
      } else {
        // Ambient cruising schedule if not active mission
        blueTrainX.current = -18 + ((t * 5.0) % 36);
      }
      blueTrainRef.current.position.x = blueTrainX.current;
    }

    // Red Train
    if (redTrainRef.current) {
      if (redMission?.district === 'train') {
        const targetX = -13 + Math.min(1, Math.max(0, redCity.train.trainPosition)) * 26;
        redTrainX.current = THREE.MathUtils.damp(
          redTrainX.current,
          targetX,
          redCity.train.isStopped ? 8.0 : 3.5,
          delta
        );
      } else {
        // Ambient cruising schedule if not active mission
        redTrainX.current = 18 - (((t * 4.8) + 12) % 36);
      }
      redTrainRef.current.position.x = redTrainX.current;
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

        {/* Modern Streetlamps along Boulevard (omitting X=0 for open pedestrian plaza concourse) */}
        {[-26, -18, -10, 10, 18, 26].map((lx) => (
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

      {/* ── 2. DYNAMIC VEHICLES ON HIGHWAY (UNLOCKS AT QUESTION 4) ── */}
      {cityStage < 4 ? (
        <group>
          {/* Clean Road-Closed Barriers (Awaiting Transport Activation) */}
          {[-18, -6, 6, 18].map((bx) => (
            <group key={bx} position={[bx, 0, 5.5]}>
              {/* White/Red Striped Barrier Bar */}
              <mesh position={[0, 0.45, 0]}>
                <boxGeometry args={[2.2, 0.12, 0.08]} />
                <meshStandardMaterial color="#f8fafc" roughness={0.4} />
              </mesh>
              <mesh position={[0, 0.45, 0.01]}>
                <boxGeometry args={[0.5, 0.1, 0.02]} />
                <meshStandardMaterial color="#ef4444" roughness={0.4} />
              </mesh>
              {/* Support Posts */}
              {[-0.9, 0.9].map((px) => (
                <mesh key={px} position={[px, 0.22, 0]}>
                  <cylinderGeometry args={[0.03, 0.04, 0.44, 6]} />
                  <meshStandardMaterial color="#94a3b8" metalness={0.7} />
                </mesh>
              ))}
            </group>
          ))}
        </group>
      ) : (
        <group ref={trafficGroupRef}>
          {vehicles.map((v) => (
            <group key={v.id} position={[v.x, 0, v.z]} rotation={[0, v.rotY, 0]}>
              <VehicleModel color={v.color} type={v.type} brakeLightsOn={v.isBraking} />
            </group>
          ))}
        </group>
      )}

      {/* ── 3. DUAL HIGH-SPEED BULLET TRAINS (INDEPENDENT BLUE & RED) ── */}
      {/* Blue Train on South Rail (Track 1) */}
      <group ref={blueTrainRef} position={[0, 1.25, -13.5]}>
        <group position={[3.2, 0, 0]}>
          <mesh position={[0, 0.5, 0]} castShadow>
            <boxGeometry args={[3.2, 0.9, 0.78]} />
            <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.4} />
          </mesh>
          <mesh position={[1.8, 0.35, 0]} rotation={[0, 0, -Math.PI / 6]} castShadow>
            <boxGeometry args={[0.9, 0.65, 0.76]} />
            <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.4} />
          </mesh>
          <mesh position={[0.2, 0.55, 0]}>
            <boxGeometry args={[3.4, 0.16, 0.82]} />
            <meshStandardMaterial color="#2563eb" emissive="#1d4ed8" emissiveIntensity={0.6} />
          </mesh>
          <mesh position={[0.4, 0.65, 0]}>
            <boxGeometry args={[2.2, 0.3, 0.8]} />
            <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.7} />
          </mesh>
        </group>
        <group position={[0, 0, 0]}>
          <mesh position={[0, 0.5, 0]} castShadow>
            <boxGeometry args={[3.0, 0.9, 0.78]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.55, 0]}>
            <boxGeometry args={[3.05, 0.16, 0.82]} />
            <meshStandardMaterial color="#2563eb" />
          </mesh>
          <mesh position={[0, 0.65, 0]}>
            <boxGeometry args={[2.5, 0.3, 0.8]} />
            <meshStandardMaterial color="#0f172a" roughness={0.1} />
          </mesh>
        </group>
      </group>

      {/* Red Train on North Rail (Track 2) */}
      <group ref={redTrainRef} position={[0, 1.25, -14.5]}>
        <group position={[3.2, 0, 0]}>
          <mesh position={[0, 0.5, 0]} castShadow>
            <boxGeometry args={[3.2, 0.9, 0.78]} />
            <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.4} />
          </mesh>
          <mesh position={[1.8, 0.35, 0]} rotation={[0, 0, -Math.PI / 6]} castShadow>
            <boxGeometry args={[0.9, 0.65, 0.76]} />
            <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.4} />
          </mesh>
          <mesh position={[0.2, 0.55, 0]}>
            <boxGeometry args={[3.4, 0.16, 0.82]} />
            <meshStandardMaterial color="#dc2626" emissive="#b91c1c" emissiveIntensity={0.6} />
          </mesh>
          <mesh position={[0.4, 0.65, 0]}>
            <boxGeometry args={[2.2, 0.3, 0.8]} />
            <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.7} />
          </mesh>
        </group>
        <group position={[0, 0, 0]}>
          <mesh position={[0, 0.5, 0]} castShadow>
            <boxGeometry args={[3.0, 0.9, 0.78]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.55, 0]}>
            <boxGeometry args={[3.05, 0.16, 0.82]} />
            <meshStandardMaterial color="#dc2626" />
          </mesh>
          <mesh position={[0, 0.65, 0]}>
            <boxGeometry args={[2.5, 0.3, 0.8]} />
            <meshStandardMaterial color="#0f172a" roughness={0.1} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
