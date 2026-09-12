// ============================================================
// PATTERN RACERS — High-Performance Daylight Stadium Environment 3D
// - 820m Continuous Trackside Concrete Barriers, LED Sponsor Boards & Catch Fences
// - Instanced Grandstand Bleachers & Seating Rows across the whole circuit
// - Open-Front Blue & Red Team Pit Garages & Pit Wall Telemetry Monitors
// - 6 High-Mast Stadium Floodlight Towers with Glowing Lamp Arrays
// - Sky Zeppelin Blimp, Hot Air Balloons, Cameramen & Alpine Peaks
// - Expansive 2000m x 2000m Terrain Surface (No clipping or transparent voids)
// ============================================================

'use client';

import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getTrackPointAt } from '../engine/trackPath';
import { AudienceInstanced3D } from './AudienceInstanced3D';
import { PBR_MATERIALS } from './materials';

export const DaylightFacilityEnvironment3D: React.FC = () => {
  const blimpRef = useRef<THREE.Group>(null);
  const flagsRef = useRef<THREE.Group>(null);
  const flashStrobeLightRef = useRef<THREE.PointLight>(null);
  const beaconLightRef = useRef<THREE.PointLight>(null);

  // Instanced Meshes Refs
  const barrierConcreteRef = useRef<THREE.InstancedMesh>(null);
  const barrierLedRef = useRef<THREE.InstancedMesh>(null);
  const barrierPostRef = useRef<THREE.InstancedMesh>(null);
  const barrierFenceRef = useRef<THREE.InstancedMesh>(null);

  const stadiumTierRef = useRef<THREE.InstancedMesh>(null);
  const stadiumSeatRef = useRef<THREE.InstancedMesh>(null);
  const stadiumRoofRef = useRef<THREE.InstancedMesh>(null);

  // Math transform helpers
  const tempMatrix = useMemo(() => new THREE.Matrix4(), []);
  const tempPos = useMemo(() => new THREE.Vector3(), []);
  const tempRot = useMemo(() => new THREE.Quaternion(), []);
  const tempScale = useMemo(() => new THREE.Vector3(1, 1, 1), []);
  const tempEuler = useMemo(() => new THREE.Euler(), []);

  // 1. Generate 120 Trackside Barrier & LED Segments data spanning the 820m circuit
  const barrierData = useMemo(() => {
    const count = 120;
    const items = [];
    const ledColors = [
      new THREE.Color('#0284c7'), // Skillizee Blue
      new THREE.Color('#d97706'), // Math Arcade Amber
      new THREE.Color('#10b981'), // Blueprint Blitz Green
      new THREE.Color('#ec4899'), // Carnival Pink
      new THREE.Color('#8b5cf6'), // Mission Control Purple
      new THREE.Color('#dc2626'), // Pattern Racers Red
    ];

    for (let i = 0; i < count; i++) {
      const t = i / count;
      const nextT = (i + 1) / count;
      const pt = getTrackPointAt(t);
      const nextPt = getTrackPointAt(nextT);

      // Left Barrier (6.6m from center)
      const lStart = [pt.x - pt.normalX * 6.6, 0, pt.z - pt.normalZ * 6.6];
      const lEnd = [nextPt.x - nextPt.normalX * 6.6, 0, nextPt.z - nextPt.normalZ * 6.6];
      const lMidX = (lStart[0] + lEnd[0]) / 2;
      const lMidZ = (lStart[2] + lEnd[2]) / 2;
      const lDx = lEnd[0] - lStart[0];
      const lDz = lEnd[2] - lStart[2];
      const lLen = Math.sqrt(lDx * lDx + lDz * lDz) + 0.1;
      const lAngle = Math.atan2(lDx, lDz);

      // Right Barrier (6.6m from center)
      const rStart = [pt.x + pt.normalX * 6.6, 0, pt.z + pt.normalZ * 6.6];
      const rEnd = [nextPt.x + nextPt.normalX * 6.6, 0, nextPt.z + nextPt.normalZ * 6.6];
      const rMidX = (rStart[0] + rEnd[0]) / 2;
      const rMidZ = (rStart[2] + rEnd[2]) / 2;
      const rDx = rEnd[0] - rStart[0];
      const rDz = rEnd[2] - rStart[2];
      const rLen = Math.sqrt(rDx * rDx + rDz * rDz) + 0.1;
      const rAngle = Math.atan2(rDx, rDz);

      items.push({
        isLeft: true,
        pos: new THREE.Vector3(lMidX, 0.45, lMidZ),
        rotY: lAngle,
        length: lLen,
        color: ledColors[i % ledColors.length],
      });

      items.push({
        isLeft: false,
        pos: new THREE.Vector3(rMidX, 0.45, rMidZ),
        rotY: rAngle,
        length: rLen,
        color: ledColors[(i + 3) % ledColors.length],
      });
    }
    return items;
  }, []);

  // 2. Generate Stadium Module Layout (14 grandstand modules x 2 sides = 28 grandstands x 5 tiers = 140 tiers)
  const stadiumData = useMemo(() => {
    const tValues = [0.03, 0.10, 0.18, 0.26, 0.34, 0.42, 0.50, 0.58, 0.66, 0.74, 0.82, 0.90, 0.96];
    const tiers: { pos: THREE.Vector3; rotY: number; isBlue: boolean }[] = [];
    const roofs: { pos: THREE.Vector3; rotY: number; isBlue: boolean }[] = [];

    tValues.forEach((tVal) => {
      const pt = getTrackPointAt(tVal);
      const angle = pt.angle;

      // Left Grandstand (Steps UP going away from track, facing track)
      for (let tier = 0; tier < 5; tier++) {
        const dist = 10.5 + tier * 1.4;
        const tierY = 0.45 + tier * 0.75;
        const wx = pt.x - pt.normalX * dist;
        const wz = pt.z - pt.normalZ * dist;
        tiers.push({ pos: new THREE.Vector3(wx, tierY, wz), rotY: angle, isBlue: true });
      }
      roofs.push({
        pos: new THREE.Vector3(pt.x - pt.normalX * 13.5, 6.2, pt.z - pt.normalZ * 13.5),
        rotY: angle,
        isBlue: true,
      });

      // Right Grandstand (Steps UP going away from track, facing track)
      for (let tier = 0; tier < 5; tier++) {
        const dist = 10.5 + tier * 1.4;
        const tierY = 0.45 + tier * 0.75;
        const wx = pt.x + pt.normalX * dist;
        const wz = pt.z + pt.normalZ * dist;
        tiers.push({ pos: new THREE.Vector3(wx, tierY, wz), rotY: angle, isBlue: false });
      }
      roofs.push({
        pos: new THREE.Vector3(pt.x + pt.normalX * 13.5, 6.2, pt.z + pt.normalZ * 13.5),
        rotY: angle,
        isBlue: false,
      });
    });

    return { tiers, roofs };
  }, []);

  // 3. High-Mast Floodlight Tower Positions
  const floodlightTowers = useMemo(() => {
    const locs: { pos: THREE.Vector3; rotY: number }[] = [];
    [0.05, 0.22, 0.40, 0.58, 0.76, 0.92].forEach((tVal) => {
      const pt = getTrackPointAt(tVal);
      // Left tower
      locs.push({
        pos: new THREE.Vector3(pt.x - pt.normalX * 17.5, 0, pt.z - pt.normalZ * 17.5),
        rotY: pt.angle + 0.3,
      });
      // Right tower
      locs.push({
        pos: new THREE.Vector3(pt.x + pt.normalX * 17.5, 0, pt.z + pt.normalZ * 17.5),
        rotY: pt.angle - 0.3,
      });
    });
    return locs;
  }, []);

  // Initialize Instanced Meshes Matrices on Mount
  useEffect(() => {
    // 1. Initialize Barrier Instanced Meshes (240 barriers)
    if (barrierConcreteRef.current && barrierLedRef.current && barrierPostRef.current && barrierFenceRef.current) {
      barrierData.forEach((item, i) => {
        // Concrete base
        tempPos.copy(item.pos);
        tempEuler.set(0, item.rotY, 0);
        tempRot.setFromEuler(tempEuler);
        tempScale.set(1, 1, item.length / 4.0);
        tempMatrix.compose(tempPos, tempRot, tempScale);
        barrierConcreteRef.current!.setMatrixAt(i, tempMatrix);

        // Catch Fence mesh above barrier
        tempPos.set(item.pos.x, item.pos.y + 0.8, item.pos.z);
        tempScale.set(1, 1, item.length / 4.0);
        tempMatrix.compose(tempPos, tempRot, tempScale);
        barrierFenceRef.current!.setMatrixAt(i, tempMatrix);

        // LED screen panel
        const signOffset = item.isLeft ? 0.16 : -0.16;
        tempPos.set(
          item.pos.x + Math.cos(item.rotY) * signOffset,
          item.pos.y + 0.1,
          item.pos.z - Math.sin(item.rotY) * signOffset
        );
        tempEuler.set(0, item.rotY + (item.isLeft ? 0 : Math.PI), 0);
        tempRot.setFromEuler(tempEuler);
        tempScale.set(1, 1, item.length / 4.0);
        tempMatrix.compose(tempPos, tempRot, tempScale);
        barrierLedRef.current!.setMatrixAt(i, tempMatrix);
        barrierLedRef.current!.setColorAt(i, item.color);

        // Steel Posts
        tempPos.set(item.pos.x, item.pos.y + 0.45, item.pos.z);
        tempEuler.set(0, 0, 0);
        tempRot.setFromEuler(tempEuler);
        tempScale.set(1, 1, 1);
        tempMatrix.compose(tempPos, tempRot, tempScale);
        barrierPostRef.current!.setMatrixAt(i, tempMatrix);
      });

      barrierConcreteRef.current.instanceMatrix.needsUpdate = true;
      barrierFenceRef.current.instanceMatrix.needsUpdate = true;
      barrierLedRef.current.instanceMatrix.needsUpdate = true;
      if (barrierLedRef.current.instanceColor) barrierLedRef.current.instanceColor.needsUpdate = true;
      barrierPostRef.current.instanceMatrix.needsUpdate = true;
    }

    // 2. Initialize Stadium Grandstands Meshes
    if (stadiumTierRef.current && stadiumSeatRef.current && stadiumRoofRef.current) {
      stadiumData.tiers.forEach((tier, i) => {
        // Concrete Tier Step
        tempPos.copy(tier.pos);
        tempEuler.set(0, tier.rotY, 0);
        tempRot.setFromEuler(tempEuler);
        tempScale.set(1, 1, 1);
        tempMatrix.compose(tempPos, tempRot, tempScale);
        stadiumTierRef.current!.setMatrixAt(i, tempMatrix);

        // Stadium Seats (Top surface of step)
        tempPos.set(tier.pos.x, tier.pos.y + 0.38, tier.pos.z);
        tempMatrix.compose(tempPos, tempRot, tempScale);
        stadiumSeatRef.current!.setMatrixAt(i, tempMatrix);
        stadiumSeatRef.current!.setColorAt(
          i,
          tier.isBlue ? new THREE.Color('#38bdf8') : new THREE.Color('#f87171')
        );
      });

      stadiumData.roofs.forEach((roof, i) => {
        tempPos.copy(roof.pos);
        tempEuler.set(0, roof.rotY, 0);
        tempRot.setFromEuler(tempEuler);
        tempScale.set(1, 1, 1);
        tempMatrix.compose(tempPos, tempRot, tempScale);
        stadiumRoofRef.current!.setMatrixAt(i, tempMatrix);
      });

      stadiumTierRef.current.instanceMatrix.needsUpdate = true;
      stadiumSeatRef.current.instanceMatrix.needsUpdate = true;
      if (stadiumSeatRef.current.instanceColor) stadiumSeatRef.current.instanceColor.needsUpdate = true;
      stadiumRoofRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [barrierData, stadiumData, tempMatrix, tempPos, tempRot, tempScale, tempEuler]);

  // Dynamic Scene Animations
  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Skillizee Blimp floating gently above the central circuit
    if (blimpRef.current) {
      blimpRef.current.position.x = Math.sin(time * 0.06) * 60;
      blimpRef.current.position.z = -350 + Math.cos(time * 0.04) * 80;
    }

    // Waving team flags atop grandstands
    if (flagsRef.current) {
      const t = time * 3;
      flagsRef.current.children.forEach((flag, i) => {
        flag.rotation.y = Math.sin(t + i * 0.8) * 0.4;
      });
    }

    // Single synchronized camera flash strobe light
    if (flashStrobeLightRef.current) {
      const isFlash = Math.sin(time * 12) > 0.88;
      flashStrobeLightRef.current.intensity = isFlash ? 2.5 : 0;
    }

    // Garage amber warning beacon
    if (beaconLightRef.current) {
      beaconLightRef.current.intensity = 1.2 + Math.sin(time * 10) * 1.2;
    }
  });

  // Shared optimized geometries
  const barrierGeom = useMemo(() => new THREE.BoxGeometry(0.3, 0.9, 4.0), []);
  const barrierLedGeom = useMemo(() => new THREE.BoxGeometry(0.04, 0.65, 3.8), []);
  const postGeom = useMemo(() => new THREE.CylinderGeometry(0.035, 0.035, 1.8, 6), []);
  const fenceGeom = useMemo(() => new THREE.PlaneGeometry(3.9, 1.1), []);

  const stadiumTierGeom = useMemo(() => new THREE.BoxGeometry(1.3, 0.75, 18.0), []);
  const stadiumSeatGeom = useMemo(() => new THREE.BoxGeometry(0.9, 0.08, 17.2), []);
  const stadiumRoofGeom = useMemo(() => new THREE.BoxGeometry(7.5, 0.35, 18.0), []);

  return (
    <group>
      {/* ── 1. OPTIMIZED SUN & SKY LIGHTING ── */}
      <ambientLight intensity={1.35} color="#f0f9ff" />
      <directionalLight
        position={[60, 90, 40]}
        intensity={2.8}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-65}
        shadow-camera-right={65}
        shadow-camera-top={65}
        shadow-camera-bottom={-65}
        shadow-camera-near={1}
        shadow-camera-far={260}
        shadow-bias={-0.00015}
        color="#fffbeb"
      />
      <hemisphereLight args={['#e0f2fe', '#4ade80', 0.75]} />

      {/* Synchronized single accent lights */}
      <pointLight ref={flashStrobeLightRef} position={[0, 4, 10]} color="#ffffff" distance={40} intensity={0} />
      <pointLight ref={beaconLightRef} position={[0, 6, 12]} color="#eab308" distance={25} intensity={1.5} />

      {/* ── 2. EXPANSIVE 2000m x 2000m TERRAIN (No voids or transparency) ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.15, -400]} receiveShadow material={PBR_MATERIALS.grass}>
        <planeGeometry args={[2000, 2000]} />
      </mesh>

      {/* ── 3. INSTANCED TRACKSIDE BARRIERS, LED BOARDS & FENCES (240 segments) ── */}
      <instancedMesh
        ref={barrierConcreteRef}
        args={[barrierGeom, PBR_MATERIALS.concrete, barrierData.length]}
        castShadow
        receiveShadow
      />
      <instancedMesh
        ref={barrierFenceRef}
        args={[fenceGeom, PBR_MATERIALS.fenceWire, barrierData.length]}
      />
      <instancedMesh
        ref={barrierLedRef}
        args={[barrierLedGeom, PBR_MATERIALS.ledScreenBlue, barrierData.length]}
      />
      <instancedMesh
        ref={barrierPostRef}
        args={[postGeom, PBR_MATERIALS.metalTruss, barrierData.length]}
      />

      {/* ── 4. INSTANCED STADIUM GRANDSTANDS & SEATS (140 tiers across 820m) ── */}
      <instancedMesh
        ref={stadiumTierRef}
        args={[stadiumTierGeom, PBR_MATERIALS.concrete, stadiumData.tiers.length]}
        castShadow
        receiveShadow
      />
      <instancedMesh
        ref={stadiumSeatRef}
        args={[stadiumSeatGeom, PBR_MATERIALS.seatBlue, stadiumData.tiers.length]}
        receiveShadow
      />
      <instancedMesh
        ref={stadiumRoofRef}
        args={[stadiumRoofGeom, PBR_MATERIALS.concrete, stadiumData.roofs.length]}
        castShadow
      />

      {/* ── 5. INSTANCED AUDIENCE ENGINE (Spectators in Grandstands) ── */}
      <AudienceInstanced3D />

      {/* ── 6. HIGH-MAST STADIUM FLOODLIGHT TOWERS (12 Towers along track) ── */}
      {floodlightTowers.map((tower, tIdx) => (
        <group key={`floodlight-tower-${tIdx}`} position={[tower.pos.x, 0, tower.pos.z]} rotation={[0, tower.rotY, 0]}>
          {/* Main Lattice Tower Mast */}
          <mesh position={[0, 9.0, 0]} castShadow material={PBR_MATERIALS.metalTruss}>
            <cylinderGeometry args={[0.35, 0.7, 18.0, 6]} />
          </mesh>
          {/* Top Floodlight Frame Crosshead */}
          <mesh position={[0, 18.2, 0]} castShadow material={PBR_MATERIALS.darkWall}>
            <boxGeometry args={[4.2, 1.2, 0.8]} />
          </mesh>
          {/* 6 Glowing Emissive Bulbs */}
          {[-1.6, -0.6, 0.6, 1.6].map((bx, bi) => (
            <mesh key={`bulb-${bi}`} position={[bx, 18.2, 0.42]} material={PBR_MATERIALS.floodlightBulb}>
              <circleGeometry args={[0.32, 12]} />
            </mesh>
          ))}
        </group>
      ))}

      {/* ── 7. OPEN-FRONT TEAM PIT GARAGES & PIT LANE COMPLEX ── */}
      {/* Left Blue Pit Garage Box (Houses Blue car at [-8.5, 0.25, 22]) */}
      <group position={[-8.5, 0, 22]}>
        {/* Back Wall */}
        <mesh position={[0, 2.8, 5.2]} castShadow receiveShadow material={PBR_MATERIALS.concrete}>
          <boxGeometry args={[7.2, 5.6, 0.5]} />
        </mesh>
        {/* Left Side Wall */}
        <mesh position={[-3.4, 2.8, 0]} castShadow receiveShadow material={PBR_MATERIALS.concrete}>
          <boxGeometry args={[0.5, 5.6, 10.5]} />
        </mesh>
        {/* Floor */}
        <mesh position={[0, 0.04, 0]} receiveShadow material={PBR_MATERIALS.concrete}>
          <boxGeometry args={[7.2, 0.08, 10.5]} />
        </mesh>
        {/* Roof with Team Blue Header */}
        <mesh position={[0, 5.6, 0]} castShadow material={PBR_MATERIALS.vehicleBodyBlue}>
          <boxGeometry args={[7.2, 0.5, 10.8]} />
        </mesh>
        {/* Overhead Team Sponsor Header */}
        <mesh position={[0, 4.8, -5.1]} material={PBR_MATERIALS.ledScreenBlue}>
          <planeGeometry args={[6.8, 1.2]} />
        </mesh>
        {/* Floor Parking Box Lines */}
        <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]} material={PBR_MATERIALS.roadLineWhite}>
          <planeGeometry args={[3.4, 6.0]} />
        </mesh>
        {/* Tool chest & telemetry racks */}
        <mesh position={[-2.6, 0.9, -1.5]} castShadow material={PBR_MATERIALS.darkWall}>
          <boxGeometry args={[0.8, 1.8, 3.4]} />
        </mesh>
        <mesh position={[-2.55, 2.0, -1.5]} rotation={[0, Math.PI / 2, 0]} material={PBR_MATERIALS.ledScreenBlue}>
          <planeGeometry args={[3.2, 0.7]} />
        </mesh>
      </group>

      {/* Right Red Pit Garage Box (Houses Red car at [8.5, 0.25, 22]) */}
      <group position={[8.5, 0, 22]}>
        {/* Back Wall */}
        <mesh position={[0, 2.8, 5.2]} castShadow receiveShadow material={PBR_MATERIALS.concrete}>
          <boxGeometry args={[7.2, 5.6, 0.5]} />
        </mesh>
        {/* Right Side Wall */}
        <mesh position={[3.4, 2.8, 0]} castShadow receiveShadow material={PBR_MATERIALS.concrete}>
          <boxGeometry args={[0.5, 5.6, 10.5]} />
        </mesh>
        {/* Floor */}
        <mesh position={[0, 0.04, 0]} receiveShadow material={PBR_MATERIALS.concrete}>
          <boxGeometry args={[7.2, 0.08, 10.5]} />
        </mesh>
        {/* Roof with Team Red Header */}
        <mesh position={[0, 5.6, 0]} castShadow material={PBR_MATERIALS.vehicleBodyRed}>
          <boxGeometry args={[7.2, 0.5, 10.8]} />
        </mesh>
        {/* Overhead Team Sponsor Header */}
        <mesh position={[0, 4.8, -5.1]} material={PBR_MATERIALS.ledScreenRed}>
          <planeGeometry args={[6.8, 1.2]} />
        </mesh>
        {/* Floor Parking Box Lines */}
        <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]} material={PBR_MATERIALS.roadLineWhite}>
          <planeGeometry args={[3.4, 6.0]} />
        </mesh>
        {/* Tool chest & telemetry racks */}
        <mesh position={[2.6, 0.9, -1.5]} castShadow material={PBR_MATERIALS.darkWall}>
          <boxGeometry args={[0.8, 1.8, 3.4]} />
        </mesh>
        <mesh position={[2.55, 2.0, -1.5]} rotation={[0, -Math.PI / 2, 0]} material={PBR_MATERIALS.ledScreenRed}>
          <planeGeometry args={[3.2, 0.7]} />
        </mesh>
      </group>

      {/* ── 8. SKILLIZEE ZEPPELIN BLIMP & HOT AIR BALLOONS ── */}
      <group ref={blimpRef} position={[0, 65, -350]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow material={PBR_MATERIALS.concrete}>
          <capsuleGeometry args={[6.5, 22, 12, 16]} />
        </mesh>
        <mesh position={[0, -2.0, 0]} rotation={[0, 0, Math.PI / 2]} material={PBR_MATERIALS.vehicleBodyBlue}>
          <capsuleGeometry args={[6.0, 20, 12, 16]} />
        </mesh>
        <mesh position={[0, -7.2, 0]} castShadow material={PBR_MATERIALS.darkWall}>
          <boxGeometry args={[3.0, 1.8, 9.0]} />
        </mesh>
      </group>

      {/* Hot Air Balloons in Sky */}
      {[
        [-90, 52, -250, PBR_MATERIALS.curbRed],
        [110, 60, -420, PBR_MATERIALS.ledScreenPurple],
        [-150, 48, -580, PBR_MATERIALS.ledScreenGreen],
      ].map(([bx, by, bz, mat], bIdx) => (
        <group key={`balloon-${bIdx}`} position={[bx as number, by as number, bz as number]}>
          <mesh castShadow material={mat as THREE.Material}>
            <sphereGeometry args={[5.5, 12, 12]} />
          </mesh>
          <mesh position={[0, -5.8, 0]} castShadow material={PBR_MATERIALS.darkWall}>
            <boxGeometry args={[1.5, 1.3, 1.5]} />
          </mesh>
        </group>
      ))}

      {/* ── 9. DISTANT ALPINE MOUNTAIN RANGE ── */}
      <group position={[0, 0, -880]}>
        {[-300, -180, -60, 60, 180, 300].map((x, i) => (
          <mesh key={`alp-peak-${i}`} position={[x, 60 + (i % 3) * 25, 0]} material={PBR_MATERIALS.asphaltRunoff}>
            <coneGeometry args={[120 + (i % 3) * 25, 160, 6]} />
          </mesh>
        ))}
      </group>
    </group>
  );
};
