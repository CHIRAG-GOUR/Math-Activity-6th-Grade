// ============================================================
// PATTERN RACERS — GPU-Accelerated 3D Grand Prix Track & Grid
// - 820m Continuous Instanced Road Asphalt, FIA Curbs & Markings (160 segments)
// - Instanced 3D Stacked Rubber Tire Barriers with Sponsor Wraps
// - Painted Grid Starting Boxes (Blue Left #01, Red Right #02) & Pit Service Bays
// - FIA Start Lights Gantry & Checkered Finish Line Archway with Victory Confetti
// - Intermediate Electronic Sector Timing Gantries
// ============================================================

'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePatternStore } from '../store/patternStore';
import { getTrackPointAt, TRACK_FINISH_PROGRESS } from '../engine/trackPath';
import { PBR_MATERIALS } from './materials';

export const GrandPrixTrack3D: React.FC = () => {
  const confettiRef = useRef<THREE.Group>(null);
  const raceWinner = usePatternStore((s) => s.raceWinner);
  const signalLights = usePatternStore((s) => s.signalLights);

  // Instanced Mesh Refs
  const roadMeshRef = useRef<THREE.InstancedMesh>(null);
  const curbRedRef = useRef<THREE.InstancedMesh>(null);
  const curbWhiteRef = useRef<THREE.InstancedMesh>(null);
  const yellowLinesRef = useRef<THREE.InstancedMesh>(null);
  const whiteEdgeLinesRef = useRef<THREE.InstancedMesh>(null);
  const runoffsRef = useRef<THREE.InstancedMesh>(null);
  const tireStackRef = useRef<THREE.InstancedMesh>(null);

  // Reusable math objects for zero-allocation instancing
  const tempMatrix = useMemo(() => new THREE.Matrix4(), []);
  const tempPos = useMemo(() => new THREE.Vector3(), []);
  const tempRot = useMemo(() => new THREE.Quaternion(), []);
  const tempScale = useMemo(() => new THREE.Vector3(1, 1, 1), []);
  const tempEuler = useMemo(() => new THREE.Euler(), []);

  // Generate 160 Spline Track Segment Transforms spanning the full 820m circuit
  const trackSegments = useMemo(() => {
    const count = 160;
    const segs = [];

    for (let i = 0; i < count; i++) {
      const t = i / count;
      const nextT = (i + 1) / count;
      const pt = getTrackPointAt(t);
      const nextPt = getTrackPointAt(nextT);

      const midX = (pt.x + nextPt.x) / 2;
      const midZ = (pt.z + nextPt.z) / 2;
      const dx = nextPt.x - pt.x;
      const dz = nextPt.z - pt.z;
      const segLen = Math.sqrt(dx * dx + dz * dz) + 0.1;
      const segAngle = Math.atan2(dx, dz);

      segs.push({
        idx: i,
        pos: new THREE.Vector3(midX, 0.02, midZ),
        angle: segAngle,
        bankAngle: pt.bankAngle || 0,
        normalX: pt.normalX,
        normalZ: pt.normalZ,
        length: segLen,
      });
    }

    return segs;
  }, []);

  // Generate 3D Stacked Tire Barrier Locations
  const tireBarrierLocations = useMemo(() => {
    const locs: { pos: THREE.Vector3; rotY: number; isRed: boolean }[] = [];

    // 1. Pit Area Tyre Barrier Stacks (Stage 2 Tyre Place at z: 12 -> 16)
    [-6.8, -6.8, 6.8, 6.8].forEach((x, idx) => {
      const zOffset = 11.5 + (idx % 2) * 3.5;
      locs.push({ pos: new THREE.Vector3(x, 0.3, zOffset), rotY: 0, isRed: idx < 2 });
    });

    // 2. Trackside Runoff & Apex Tire Bundles every 8% of track
    const sampleT = [0.08, 0.20, 0.35, 0.48, 0.58, 0.68, 0.78, 0.88];
    sampleT.forEach((tVal, idx) => {
      const pt = getTrackPointAt(tVal);
      // Left side stack
      locs.push({
        pos: new THREE.Vector3(pt.x - pt.normalX * 6.8, 0.3, pt.z - pt.normalZ * 6.8),
        rotY: pt.angle,
        isRed: idx % 2 === 0,
      });
      // Right side stack
      locs.push({
        pos: new THREE.Vector3(pt.x + pt.normalX * 6.8, 0.3, pt.z + pt.normalZ * 6.8),
        rotY: pt.angle,
        isRed: idx % 2 !== 0,
      });
    });

    return locs;
  }, []);

  // Initialize Instanced Track Meshes
  useEffect(() => {
    if (
      !roadMeshRef.current ||
      !curbRedRef.current ||
      !curbWhiteRef.current ||
      !yellowLinesRef.current ||
      !whiteEdgeLinesRef.current ||
      !runoffsRef.current
    )
      return;

    let yellowLineCount = 0;
    let whiteEdgeCount = 0;

    trackSegments.forEach((seg, i) => {
      // 1. 12.8m Wide Asphalt Road
      tempPos.copy(seg.pos);
      tempEuler.set(0, seg.angle, seg.bankAngle);
      tempRot.setFromEuler(tempEuler);
      tempScale.set(1, 1, seg.length / 4.0);
      tempMatrix.compose(tempPos, tempRot, tempScale);
      roadMeshRef.current!.setMatrixAt(i, tempMatrix);

      // 2. Left & Right Curbs
      const curbOffset = 6.2;
      const isRed = i % 2 === 0;

      // Left curb
      tempPos.set(
        seg.pos.x - Math.cos(seg.angle) * curbOffset,
        0.04,
        seg.pos.z + Math.sin(seg.angle) * curbOffset
      );
      tempScale.set(1, 1, seg.length / 4.0);
      tempMatrix.compose(tempPos, tempRot, tempScale);
      if (isRed) curbRedRef.current!.setMatrixAt(i, tempMatrix);
      else curbWhiteRef.current!.setMatrixAt(i, tempMatrix);

      // 3. Green Runoffs
      tempPos.set(
        seg.pos.x - Math.cos(seg.angle) * 8.6,
        0.01,
        seg.pos.z + Math.sin(seg.angle) * 8.6
      );
      tempScale.set(1, 1, seg.length / 4.0);
      tempMatrix.compose(tempPos, tempRot, tempScale);
      runoffsRef.current!.setMatrixAt(i, tempMatrix);

      // 4. Center Dashed Yellow Lines (alternating dashes)
      if (i % 2 === 0) {
        tempPos.set(seg.pos.x, 0.035, seg.pos.z);
        tempEuler.set(-Math.PI / 2, 0, seg.angle);
        tempRot.setFromEuler(tempEuler);
        tempScale.set(1, (seg.length * 0.65) / 2.0, 1);
        tempMatrix.compose(tempPos, tempRot, tempScale);
        yellowLinesRef.current!.setMatrixAt(yellowLineCount, tempMatrix);
        yellowLineCount++;
      }

      // 5. White Edge Lines
      [-5.5, 5.5].forEach((eOffset) => {
        tempPos.set(
          seg.pos.x - Math.cos(seg.angle) * eOffset,
          0.032,
          seg.pos.z + Math.sin(seg.angle) * eOffset
        );
        tempEuler.set(-Math.PI / 2, 0, seg.angle);
        tempRot.setFromEuler(tempEuler);
        tempScale.set(1, seg.length / 2.0, 1);
        tempMatrix.compose(tempPos, tempRot, tempScale);
        whiteEdgeLinesRef.current!.setMatrixAt(whiteEdgeCount, tempMatrix);
        whiteEdgeCount++;
      });
    });

    // 6. 3D Tire Stacks
    if (tireStackRef.current) {
      tireBarrierLocations.forEach((loc, tIdx) => {
        tempPos.copy(loc.pos);
        tempEuler.set(0, loc.rotY, 0);
        tempRot.setFromEuler(tempEuler);
        tempScale.set(1, 1, 1);
        tempMatrix.compose(tempPos, tempRot, tempScale);
        tireStackRef.current!.setMatrixAt(tIdx, tempMatrix);
      });
      tireStackRef.current.instanceMatrix.needsUpdate = true;
    }

    roadMeshRef.current.instanceMatrix.needsUpdate = true;
    curbRedRef.current.instanceMatrix.needsUpdate = true;
    curbWhiteRef.current.instanceMatrix.needsUpdate = true;
    runoffsRef.current.instanceMatrix.needsUpdate = true;
    yellowLinesRef.current.instanceMatrix.needsUpdate = true;
    whiteEdgeLinesRef.current.instanceMatrix.needsUpdate = true;
  }, [trackSegments, tireBarrierLocations, tempMatrix, tempPos, tempRot, tempScale, tempEuler]);

  // Victory Confetti Particle loop
  useFrame(() => {
    if (confettiRef.current && raceWinner) {
      confettiRef.current.children.forEach((particle, i) => {
        particle.position.y -= 0.08;
        particle.rotation.x += 0.05;
        particle.rotation.y += 0.08;
        if (particle.position.y < 0) {
          particle.position.y = 12 + (i % 8);
        }
      });
    }
  });

  const finishPt = useMemo(() => getTrackPointAt(TRACK_FINISH_PROGRESS), []);
  const sector1Pt = useMemo(() => getTrackPointAt(0.35), []);
  const sector2Pt = useMemo(() => getTrackPointAt(0.68), []);

  // Shared Geometries
  const roadGeom = useMemo(() => new THREE.BoxGeometry(12.4, 0.06, 4.0), []);
  const curbGeom = useMemo(() => new THREE.BoxGeometry(0.9, 0.08, 4.0), []);
  const runoffGeom = useMemo(() => new THREE.BoxGeometry(4.0, 0.02, 4.0), []);
  const yellowLineGeom = useMemo(() => new THREE.PlaneGeometry(0.26, 2.0), []);
  const whiteEdgeGeom = useMemo(() => new THREE.PlaneGeometry(0.18, 2.0), []);
  const tireStackGeom = useMemo(() => new THREE.CylinderGeometry(0.48, 0.48, 0.9, 12), []);

  return (
    <group>
      {/* ── 1. INSTANCED ASPHALT ROAD SURFACE (160 segments, 1 Draw Call) ── */}
      <instancedMesh
        ref={roadMeshRef}
        args={[roadGeom, PBR_MATERIALS.asphalt, trackSegments.length]}
        receiveShadow
      />

      {/* ── 2. INSTANCED FIA RED & WHITE CURBS (2 Draw Calls) ── */}
      <instancedMesh
        ref={curbRedRef}
        args={[curbGeom, PBR_MATERIALS.curbRed, trackSegments.length]}
        receiveShadow
      />
      <instancedMesh
        ref={curbWhiteRef}
        args={[curbGeom, PBR_MATERIALS.curbWhite, trackSegments.length]}
        receiveShadow
      />

      {/* ── 3. INSTANCED CENTER YELLOW & WHITE EDGE LINES (2 Draw Calls) ── */}
      <instancedMesh
        ref={yellowLinesRef}
        args={[yellowLineGeom, PBR_MATERIALS.roadLineYellow, Math.ceil(trackSegments.length / 2)]}
      />
      <instancedMesh
        ref={whiteEdgeLinesRef}
        args={[whiteEdgeGeom, PBR_MATERIALS.roadLineWhite, trackSegments.length * 2]}
      />

      {/* ── 4. INSTANCED GREEN RUNOFFS ── */}
      <instancedMesh
        ref={runoffsRef}
        args={[runoffGeom, PBR_MATERIALS.asphaltRunoff, trackSegments.length]}
        receiveShadow
      />

      {/* ── 5. INSTANCED 3D STACKED TIRE BARRIERS ── */}
      <instancedMesh
        ref={tireStackRef}
        args={[tireStackGeom, PBR_MATERIALS.tireRubber, tireBarrierLocations.length]}
        castShadow
        receiveShadow
      />

      {/* ── 6. PAINTED PIT SERVICE BAY BOXES (STAGE 2 TYRE PLACE AT Z: 14) ── */}
      {/* Blue Pit Box */}
      <group position={[-4.5, 0.04, 14]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} material={PBR_MATERIALS.roadLineWhite}>
          <planeGeometry args={[3.4, 5.2]} />
        </mesh>
        <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} material={PBR_MATERIALS.asphalt}>
          <planeGeometry args={[3.2, 5.0]} />
        </mesh>
        {/* Tyre Stack Marker */}
        <mesh position={[-2.2, 0.45, 0]} castShadow material={PBR_MATERIALS.tireWhiteWrap}>
          <cylinderGeometry args={[0.45, 0.45, 0.9, 12]} />
        </mesh>
      </group>
      {/* Red Pit Box */}
      <group position={[4.5, 0.04, 14]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} material={PBR_MATERIALS.roadLineWhite}>
          <planeGeometry args={[3.4, 5.2]} />
        </mesh>
        <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} material={PBR_MATERIALS.asphalt}>
          <planeGeometry args={[3.2, 5.0]} />
        </mesh>
        {/* Tyre Stack Marker */}
        <mesh position={[2.2, 0.45, 0]} castShadow material={PBR_MATERIALS.tireWhiteWrap}>
          <cylinderGeometry args={[0.45, 0.45, 0.9, 12]} />
        </mesh>
      </group>

      {/* ── 7. PAINTED STARTING GRID BOXES (BLUE LEFT #01 | RED RIGHT #02 AT Z: 6) ── */}
      {/* Blue Grid Box 1 */}
      <group position={[-2.0, 0.04, 6]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} material={PBR_MATERIALS.seatBlue}>
          <planeGeometry args={[2.6, 4.5]} />
        </mesh>
        <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} material={PBR_MATERIALS.asphalt}>
          <planeGeometry args={[2.4, 4.3]} />
        </mesh>
        <mesh position={[0, 0.01, -2.1]} rotation={[-Math.PI / 2, 0, 0]} material={PBR_MATERIALS.roadLineYellow}>
          <planeGeometry args={[2.6, 0.25]} />
        </mesh>
      </group>

      {/* Red Grid Box 2 */}
      <group position={[2.0, 0.04, 6]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} material={PBR_MATERIALS.seatRed}>
          <planeGeometry args={[2.6, 4.5]} />
        </mesh>
        <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} material={PBR_MATERIALS.asphalt}>
          <planeGeometry args={[2.4, 4.3]} />
        </mesh>
        <mesh position={[0, 0.01, -2.1]} rotation={[-Math.PI / 2, 0, 0]} material={PBR_MATERIALS.roadLineYellow}>
          <planeGeometry args={[2.6, 0.25]} />
        </mesh>
      </group>

      {/* ── 8. ELEVATED FIA STARTING SIGNAL LIGHTS GANTRY (3 Synchronized Lamps) ── */}
      <group position={[0, 0, 4.5]}>
        <mesh position={[-7.2, 3.4, 0]} castShadow material={PBR_MATERIALS.darkWall}>
          <boxGeometry args={[0.6, 6.8, 0.6]} />
        </mesh>
        <mesh position={[7.2, 3.4, 0]} castShadow material={PBR_MATERIALS.darkWall}>
          <boxGeometry args={[0.6, 6.8, 0.6]} />
        </mesh>
        <mesh position={[0, 6.5, 0]} castShadow material={PBR_MATERIALS.darkWall}>
          <boxGeometry args={[13.8, 1.5, 0.8]} />
        </mesh>
        {/* 3 Physical Starting Signal Lamps (Red -> Green) */}
        {[-3.0, 0, 3.0].map((xOffset, li) => {
          const isGreen = signalLights[li];
          return (
            <group key={`gantry-lamp-${li}`} position={[xOffset, 6.5, 0.42]}>
              <mesh>
                <circleGeometry args={[0.55, 16]} />
                <meshBasicMaterial color="#090d16" />
              </mesh>
              <mesh position={[0, 0, 0.01]}>
                <circleGeometry args={[0.46, 16]} />
                <meshBasicMaterial color={isGreen ? '#22c55e' : '#ef4444'} />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* ── 9. INTERMEDIATE ELECTRONIC SECTOR 1 TIMING GANTRY (AT T: 0.35) ── */}
      <group position={[sector1Pt.x, 0, sector1Pt.z]} rotation={[0, sector1Pt.angle, 0]}>
        <mesh position={[-7.2, 3.4, 0]} castShadow material={PBR_MATERIALS.metalTruss}>
          <boxGeometry args={[0.5, 6.8, 0.5]} />
        </mesh>
        <mesh position={[7.2, 3.4, 0]} castShadow material={PBR_MATERIALS.metalTruss}>
          <boxGeometry args={[0.5, 6.8, 0.5]} />
        </mesh>
        <mesh position={[0, 6.6, 0]} castShadow material={PBR_MATERIALS.darkWall}>
          <boxGeometry args={[13.8, 1.4, 0.6]} />
        </mesh>
        <mesh position={[0, 6.6, 0.32]} material={PBR_MATERIALS.ledScreenBlue}>
          <planeGeometry args={[13.2, 1.1]} />
        </mesh>
      </group>

      {/* ── 10. INTERMEDIATE ELECTRONIC SECTOR 2 TIMING GANTRY (AT T: 0.68) ── */}
      <group position={[sector2Pt.x, 0, sector2Pt.z]} rotation={[0, sector2Pt.angle, 0]}>
        <mesh position={[-7.2, 3.4, 0]} castShadow material={PBR_MATERIALS.metalTruss}>
          <boxGeometry args={[0.5, 6.8, 0.5]} />
        </mesh>
        <mesh position={[7.2, 3.4, 0]} castShadow material={PBR_MATERIALS.metalTruss}>
          <boxGeometry args={[0.5, 6.8, 0.5]} />
        </mesh>
        <mesh position={[0, 6.6, 0]} castShadow material={PBR_MATERIALS.darkWall}>
          <boxGeometry args={[13.8, 1.4, 0.6]} />
        </mesh>
        <mesh position={[0, 6.6, 0.32]} material={PBR_MATERIALS.ledScreenYellow}>
          <planeGeometry args={[13.2, 1.1]} />
        </mesh>
      </group>

      {/* ── 11. CHECKERED FINISH LINE ARCHWAY (AT FINISH LINE Z: ≈ -765) ── */}
      <group position={[finishPt.x, 0, finishPt.z]} rotation={[0, finishPt.angle, 0]}>
        <mesh position={[-7.5, 4.2, 0]} castShadow material={PBR_MATERIALS.darkWall}>
          <boxGeometry args={[0.7, 8.4, 0.7]} />
        </mesh>
        <mesh position={[7.5, 4.2, 0]} castShadow material={PBR_MATERIALS.darkWall}>
          <boxGeometry args={[0.7, 8.4, 0.7]} />
        </mesh>
        <mesh position={[0, 8.2, 0]} castShadow material={PBR_MATERIALS.darkWall}>
          <boxGeometry args={[15.2, 2.0, 1.0]} />
        </mesh>
        <mesh position={[0, 8.2, 0.52]}>
          <planeGeometry args={[14.4, 1.6]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>

        {/* Victory Confetti Cannons */}
        {raceWinner && (
          <group ref={confettiRef} position={[0, 8.5, 0]}>
            {Array.from({ length: 50 }).map((_, pi) => {
              const colors = ['#f59e0b', '#3b82f6', '#ef4444', '#10b981', '#ec4899', '#8b5cf6'];
              const col = colors[pi % colors.length];
              const px = (pi % 12) * 1.2 - 6.5;
              const pz = ((pi * 3) % 12) * 0.4 - 2.5;

              return (
                <mesh key={`confetti-${pi}`} position={[px, 4 + (pi % 6), pz]}>
                  <planeGeometry args={[0.22, 0.22]} />
                  <meshBasicMaterial color={col} side={THREE.DoubleSide} />
                </mesh>
              );
            })}
          </group>
        )}
      </group>
    </group>
  );
};
