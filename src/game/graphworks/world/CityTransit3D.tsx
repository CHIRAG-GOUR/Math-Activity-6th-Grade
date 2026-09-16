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
  const winningBlueprint = useGraphworksStore((s) => s.winningBlueprint);
  const blueMission = useGraphworksStore((s) => s.blue.currentMission);
  const redMission = useGraphworksStore((s) => s.red.currentMission);

  // Train positions (interpolated smoothly)
  const blueTrainX = useRef(-12);
  const redTrainX = useRef(-12);

  // Dynamic vehicles running along the circular round road (Inner Blue Lane R=7.6m, Outer Red Lane R=9.2m)
  const vehicles = useMemo(
    () => [
      // Inner Circle (Radius = 7.6m, Counter-Clockwise, Blue Team Lane)
      { id: 1, lane: 'blue' as const, slot: 0, radius: 7.6, angle: 0, x: 7.6, z: 0, rotY: Math.PI, baseSpeed: 4.8, currentSpeed: 4.8, type: 'sedan' as const, color: '#2563eb', isBraking: false },
      { id: 2, lane: 'blue' as const, slot: 1, radius: 7.6, angle: (1 / 6) * Math.PI * 2, x: 3.8, z: 6.58, rotY: Math.PI - (1 / 6) * Math.PI * 2, baseSpeed: 4.4, currentSpeed: 4.4, type: 'bus' as const, color: '#0284c7', isBraking: false },
      { id: 3, lane: 'blue' as const, slot: 2, radius: 7.6, angle: (2 / 6) * Math.PI * 2, x: -3.8, z: 6.58, rotY: Math.PI - (2 / 6) * Math.PI * 2, baseSpeed: 4.6, currentSpeed: 4.6, type: 'sedan' as const, color: '#38bdf8', isBraking: false },
      { id: 4, lane: 'blue' as const, slot: 3, radius: 7.6, angle: (3 / 6) * Math.PI * 2, x: -7.6, z: 0, rotY: 0, baseSpeed: 4.5, currentSpeed: 4.5, type: 'van' as const, color: '#ffffff', isBraking: false },
      { id: 5, lane: 'blue' as const, slot: 4, radius: 7.6, angle: (4 / 6) * Math.PI * 2, x: -3.8, z: -6.58, rotY: -(1 / 3) * Math.PI, baseSpeed: 4.7, currentSpeed: 4.7, type: 'sedan' as const, color: '#1d4ed8', isBraking: false },
      { id: 6, lane: 'blue' as const, slot: 5, radius: 7.6, angle: (5 / 6) * Math.PI * 2, x: 3.8, z: -6.58, rotY: -(2 / 3) * Math.PI, baseSpeed: 4.3, currentSpeed: 4.3, type: 'sedan' as const, color: '#60a5fa', isBraking: false },

      // Outer Circle (Radius = 9.2m, Counter-Clockwise, Red Team Lane)
      { id: 7, lane: 'red' as const, slot: 0, radius: 9.2, angle: (0.5 / 6) * Math.PI * 2, x: 7.97, z: 4.6, rotY: Math.PI - (0.5 / 6) * Math.PI * 2, baseSpeed: 5.0, currentSpeed: 5.0, type: 'sedan' as const, color: '#dc2626', isBraking: false },
      { id: 8, lane: 'red' as const, slot: 1, radius: 9.2, angle: (1.5 / 6) * Math.PI * 2, x: 0, z: 9.2, rotY: Math.PI / 2, baseSpeed: 4.5, currentSpeed: 4.5, type: 'bus' as const, color: '#ef4444', isBraking: false },
      { id: 9, lane: 'red' as const, slot: 2, radius: 9.2, angle: (2.5 / 6) * Math.PI * 2, x: -7.97, z: 4.6, rotY: Math.PI / 6, baseSpeed: 4.8, currentSpeed: 4.8, type: 'sedan' as const, color: '#f87171', isBraking: false },
      { id: 10, lane: 'red' as const, slot: 3, radius: 9.2, angle: (3.5 / 6) * Math.PI * 2, x: -7.97, z: -4.6, rotY: -Math.PI / 6, baseSpeed: 4.6, currentSpeed: 4.6, type: 'van' as const, color: '#ffffff', isBraking: false },
      { id: 11, lane: 'red' as const, slot: 4, radius: 9.2, angle: (4.5 / 6) * Math.PI * 2, x: 0, z: -9.2, rotY: -Math.PI / 2, baseSpeed: 4.9, currentSpeed: 4.9, type: 'sedan' as const, color: '#b91c1c', isBraking: false },
      { id: 12, lane: 'red' as const, slot: 5, radius: 9.2, angle: (5.5 / 6) * Math.PI * 2, x: 7.97, z: -4.6, rotY: -(5 / 6) * Math.PI, baseSpeed: 4.4, currentSpeed: 4.4, type: 'sedan' as const, color: '#fb7185', isBraking: false },
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

    vehicles.forEach((v, idx) => {
      const isBlue = v.lane === 'blue';
      const activeLimit = isBlue ? blueActiveLimit : redActiveLimit;
      const speedMult = isBlue ? blueSpeedMult : redSpeedMult;
      const isActive = v.slot < activeLimit;

      let desiredSpeed = v.baseSpeed * speedMult;
      v.isBraking = false;

      // Yielding to crossing pedestrians
      const currentX = Math.cos(v.angle) * v.radius;
      const currentZ = Math.sin(v.angle) * v.radius;
      if (cityTraffic.isPedestrianInProximity(currentX, currentZ)) {
        desiredSpeed = 0;
        v.isBraking = true;
      }

      // Car-following spacing physics along the circular track
      vehicles.forEach((otherV, otherIdx) => {
        if (idx === otherIdx || v.lane !== otherV.lane) return;
        let deltaAngle = otherV.angle - v.angle;
        while (deltaAngle < 0) deltaAngle += Math.PI * 2;
        while (deltaAngle >= Math.PI * 2) deltaAngle -= Math.PI * 2;

        const arcDist = deltaAngle * v.radius;
        if (arcDist > 0 && arcDist < 5.8) {
          desiredSpeed = Math.min(desiredSpeed, Math.max(0, otherV.currentSpeed * 0.88));
          if (arcDist < 3.8) v.isBraking = true;
        }
      });

      // Smooth acceleration / deceleration
      v.currentSpeed = THREE.MathUtils.damp(v.currentSpeed, desiredSpeed, 4.5, delta);
      
      // Advance angle along circle
      const omega = v.currentSpeed / v.radius;
      v.angle = (v.angle + omega * delta) % (Math.PI * 2);

      // Compute Cartesian Coordinates
      const posX = Math.cos(v.angle) * v.radius;
      const posZ = Math.sin(v.angle) * v.radius;
      // Tangential Yaw (Front of vehicle model points along forward curve)
      const rotY = -v.angle + Math.PI;

      // Update coordinator with live state
      cityTraffic.updateVehicle(v.id, posX, posZ, v.currentSpeed, v.isBraking);

      // Update Three.js vehicle group transform
      if (trafficGroupRef.current && trafficGroupRef.current.children[idx]) {
        const carGroup = trafficGroupRef.current.children[idx] as THREE.Group;
        carGroup.visible = isActive;
        carGroup.position.set(posX, 0.03, posZ);
        carGroup.rotation.y = rotY;
        carGroup.rotation.z = v.isBraking ? -0.02 : 0;
      }
    });

    // ── 3. BULLET TRAIN PHYSICS DIRECTLY CONTROLLED BY GRAPH PLOTS ──
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
        const targetX = 13 - Math.min(1, Math.max(0, redCity.train.trainPosition)) * 26;
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
      {/* ── 1. CIRCULAR BOULEVARD ROAD MARKINGS & STREETLIGHTS ── */}
      <group position={[0, 0, 0]}>
        {/* Outer Circular Sidewalk Ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <ringGeometry args={[10.2, 11.2, 48]} />
          <primitive object={CITY_MAT.sidewalk} attach="material" />
        </mesh>

        {/* Inner Solid White Edge Line */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 0]}>
          <ringGeometry args={[6.85, 6.95, 48]} />
          <primitive object={CITY_MAT.roadMarkingWhite} attach="material" />
        </mesh>

        {/* Outer Solid White Edge Line */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 0]}>
          <ringGeometry args={[10.05, 10.15, 48]} />
          <primitive object={CITY_MAT.roadMarkingWhite} attach="material" />
        </mesh>

        {/* 4 Radial Crosswalk Zebra Stripes (North, South, East, West) */}
        {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((cwAngle, cwi) => (
          <group key={cwi} rotation={[0, cwAngle, 0]}>
            {[-0.6, -0.2, 0.2, 0.6].map((offset, si) => (
              <mesh
                key={si}
                rotation={[-Math.PI / 2, 0, 0]}
                position={[8.5, 0.03, offset]}
              >
                <planeGeometry args={[3.2, 0.24]} />
                <primitive object={CITY_MAT.roadMarkingWhite} attach="material" />
              </mesh>
            ))}
          </group>
        ))}

        {/* 8 Modern Curved Boulevard Streetlamps Around Circular Road */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((li) => {
          const lAngle = (li / 8) * Math.PI * 2;
          const lx = Math.cos(lAngle) * 11.0;
          const lz = Math.sin(lAngle) * 11.0;
          const rotY = -lAngle - Math.PI / 2;
          return (
            <group key={li} position={[lx, 0, lz]} rotation={[0, rotY, 0]}>
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
          );
        })}
      </group>

      {/* ── 2. DYNAMIC VEHICLES ON HIGHWAY (UNLOCKS AT QUESTION 4) ── */}
      {cityStage < 4 ? (
        <group>
          {/* Clean Road-Closed Barriers Around Circular Boulevard */}
          {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((bAngle, bi) => {
            const bx = Math.cos(bAngle) * 8.5;
            const bz = Math.sin(bAngle) * 8.5;
            return (
              <group key={bi} position={[bx, 0, bz]} rotation={[0, -bAngle + Math.PI / 2, 0]}>
                {/* White/Red Striped Barrier Bar */}
                <mesh position={[0, 0.45, 0]}>
                  <boxGeometry args={[2.4, 0.12, 0.08]} />
                  <meshStandardMaterial color="#f8fafc" roughness={0.4} />
                </mesh>
                <mesh position={[0, 0.45, 0.01]}>
                  <boxGeometry args={[0.6, 0.1, 0.02]} />
                  <meshStandardMaterial color="#ef4444" roughness={0.4} />
                </mesh>
                {/* Support Posts */}
                {[-1.0, 1.0].map((px) => (
                  <mesh key={px} position={[px, 0.22, 0]}>
                    <cylinderGeometry args={[0.03, 0.04, 0.44, 6]} />
                    <meshStandardMaterial color="#94a3b8" metalness={0.7} />
                  </mesh>
                ))}
              </group>
            );
          })}
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
