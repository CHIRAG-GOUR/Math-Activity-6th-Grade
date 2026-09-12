// ============================================================
// PATTERN RACERS — Realistic Human Audience Engine 3D
// - Multi-tier instanced human geometry:
//   1. Human Torso in Team Jerseys (Blue Velocity, Red Turbo, Gold VIP, Green)
//   2. Human Head with Hair/Caps and Skin Tones
//   3. Cheering Arms & Waving Foam Fingers / Flags
// - Integrates the ChampagneStreakerFan3D Easter egg character
// ============================================================

'use client';

import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getTrackPointAt } from '../engine/trackPath';
import { PBR_MATERIALS } from './materials';
import { ChampagneStreakerFan3D } from './ChampagneStreakerFan3D';

interface SpectatorData {
  basePosition: THREE.Vector3;
  baseRotationY: number;
  animType: 'cheer' | 'jump' | 'wave' | 'clap' | 'photo';
  animSpeed: number;
  animPhase: number;
  color: THREE.Color;
  skinColor: THREE.Color;
}

export const AudienceInstanced3D: React.FC = () => {
  const torsosRef = useRef<THREE.InstancedMesh>(null);
  const headsRef = useRef<THREE.InstancedMesh>(null);
  const capsRef = useRef<THREE.InstancedMesh>(null);
  const armsRef = useRef<THREE.InstancedMesh>(null);

  // Reusable math objects for 60fps zero-garbage matrix updates
  const tempMatrix = useMemo(() => new THREE.Matrix4(), []);
  const tempPos = useMemo(() => new THREE.Vector3(), []);
  const tempRot = useMemo(() => new THREE.Quaternion(), []);
  const tempScale = useMemo(() => new THREE.Vector3(1, 1, 1), []);
  const tempEuler = useMemo(() => new THREE.Euler(), []);

  // Generate spectator layout along all 12 spline-aligned stadium grandstands
  const crowdData = useMemo(() => {
    const data: SpectatorData[] = [];
    const stadiumTValues = [
      0.03, 0.10, 0.18, 0.26, 0.34, 0.42, 0.50, 0.58, 0.66, 0.74, 0.82, 0.90, 0.96,
    ];

    const teamColors = [
      new THREE.Color('#2563eb'), // Blue Velocity jersey
      new THREE.Color('#38bdf8'), // Sky Blue jersey
      new THREE.Color('#dc2626'), // Red Turbo jersey
      new THREE.Color('#f87171'), // Coral Red jersey
      new THREE.Color('#f59e0b'), // Gold VIP jersey
      new THREE.Color('#10b981'), // Emerald Green jersey
      new THREE.Color('#ffffff'), // White Classic jersey
      new THREE.Color('#8b5cf6'), // Purple jersey
    ];

    const skinTones = [
      new THREE.Color('#ffd1b3'), // Fair
      new THREE.Color('#e0ac69'), // Warm
      new THREE.Color('#c68642'), // Tan
      new THREE.Color('#8d5524'), // Brown
      new THREE.Color('#4c2e1b'), // Deep
    ];

    const animTypes: ('cheer' | 'jump' | 'wave' | 'clap' | 'photo')[] = [
      'cheer',
      'jump',
      'wave',
      'clap',
      'photo',
    ];

    stadiumTValues.forEach((tVal, sIdx) => {
      const pt = getTrackPointAt(tVal);
      const angle = pt.angle;

      // 6 spectator columns per grandstand bay x 4 tiers = 24 fans per side = 48 per module
      [-6.5, -3.9, -1.3, 1.3, 3.9, 6.5].forEach((rowZ, rIdx) => {
        [0, 1, 2, 3].forEach((tier) => {
          const dist = 10.5 + tier * 1.4;
          const tierY = 0.85 + tier * 0.75;

          // Left side (Turned towards track: angle + PI/2)
          const worldLX = pt.x - pt.normalX * dist + pt.tangentX * rowZ;
          const worldLZ = pt.z - pt.normalZ * dist + pt.tangentZ * rowZ;
          const lColor = teamColors[(sIdx * 4 + rIdx * 2 + tier) % teamColors.length];
          const lSkin = skinTones[(sIdx + rIdx + tier) % skinTones.length];
          const lAnim = animTypes[(sIdx + rIdx + tier) % animTypes.length];

          data.push({
            basePosition: new THREE.Vector3(worldLX, tierY, worldLZ),
            baseRotationY: angle + Math.PI / 2 + 0.08 * (rIdx - 2.5),
            animType: lAnim,
            animSpeed: 2.8 + ((sIdx + rIdx) % 3) * 0.9,
            animPhase: (sIdx * 1.3 + rIdx * 0.8 + tier * 0.5) % (Math.PI * 2),
            color: lColor,
            skinColor: lSkin,
          });

          // Right side (Turned towards track: angle - PI/2)
          const worldRX = pt.x + pt.normalX * dist + pt.tangentX * rowZ;
          const worldRZ = pt.z + pt.normalZ * dist + pt.tangentZ * rowZ;
          const rColor = teamColors[(sIdx * 4 + rIdx * 2 + tier + 2) % teamColors.length];
          const rSkin = skinTones[(sIdx + rIdx + tier + 2) % skinTones.length];
          const rAnim = animTypes[(sIdx + rIdx + tier + 1) % animTypes.length];

          data.push({
            basePosition: new THREE.Vector3(worldRX, tierY, worldRZ),
            baseRotationY: angle - Math.PI / 2 + 0.08 * (rIdx - 2.5),
            animType: rAnim,
            animSpeed: 2.8 + ((sIdx + rIdx) % 3) * 0.9,
            animPhase: (sIdx * 1.3 + rIdx * 0.8 + tier * 0.5 + 1.2) % (Math.PI * 2),
            color: rColor,
            skinColor: rSkin,
          });
        });
      });
    });

    return data;
  }, []);

  const totalSpectators = crowdData.length;

  // Initialize instanced colors and initial matrix layout
  useEffect(() => {
    if (!torsosRef.current || !headsRef.current || !capsRef.current || !armsRef.current) return;

    for (let i = 0; i < totalSpectators; i++) {
      const item = crowdData[i];

      // Set jersey color
      torsosRef.current.setColorAt(i, item.color);
      capsRef.current.setColorAt(i, item.color);

      // Set skin color
      headsRef.current.setColorAt(i, item.skinColor);
      armsRef.current.setColorAt(i, item.skinColor);

      // Initial Torso transform
      tempPos.copy(item.basePosition).add(new THREE.Vector3(0, 0.28, 0));
      tempEuler.set(0, item.baseRotationY, 0);
      tempRot.setFromEuler(tempEuler);
      tempScale.set(1, 1, 1);
      tempMatrix.compose(tempPos, tempRot, tempScale);
      torsosRef.current.setMatrixAt(i, tempMatrix);

      // Initial Head transform
      tempPos.copy(item.basePosition).add(new THREE.Vector3(0, 0.62, 0));
      tempMatrix.compose(tempPos, tempRot, tempScale);
      headsRef.current.setMatrixAt(i, tempMatrix);

      // Initial Cap transform
      tempPos.copy(item.basePosition).add(new THREE.Vector3(0, 0.72, 0));
      tempMatrix.compose(tempPos, tempRot, tempScale);
      capsRef.current.setMatrixAt(i, tempMatrix);

      // Initial Cheering Arms transform
      tempPos.copy(item.basePosition).add(new THREE.Vector3(0, 0.45, 0));
      tempMatrix.compose(tempPos, tempRot, tempScale);
      armsRef.current.setMatrixAt(i, tempMatrix);
    }

    if (torsosRef.current.instanceColor) torsosRef.current.instanceColor.needsUpdate = true;
    if (headsRef.current.instanceColor) headsRef.current.instanceColor.needsUpdate = true;
    if (capsRef.current.instanceColor) capsRef.current.instanceColor.needsUpdate = true;
    if (armsRef.current.instanceColor) armsRef.current.instanceColor.needsUpdate = true;

    torsosRef.current.instanceMatrix.needsUpdate = true;
    headsRef.current.instanceMatrix.needsUpdate = true;
    capsRef.current.instanceMatrix.needsUpdate = true;
    armsRef.current.instanceMatrix.needsUpdate = true;
  }, [crowdData, totalSpectators, tempMatrix, tempPos, tempRot, tempScale, tempEuler]);

  // High-performance 60 FPS GPU matrix animation loop
  useFrame((state) => {
    if (!torsosRef.current || !headsRef.current || !capsRef.current || !armsRef.current) return;

    const time = state.clock.getElapsedTime();
    const activeCount = Math.min(totalSpectators, 192);

    for (let i = 0; i < activeCount; i++) {
      const item = crowdData[i];
      const t = time * item.animSpeed + item.animPhase;

      let jumpY = 0;
      let waveAngle = 0;
      let armScaleY = 1.0;

      if (item.animType === 'jump' || item.animType === 'cheer') {
        const sinVal = Math.sin(t);
        jumpY = sinVal > 0.2 ? sinVal * 0.22 : 0;
        waveAngle = Math.sin(t * 1.5) * 0.14;
        armScaleY = 1.0 + Math.sin(t * 3) * 0.25;
      } else if (item.animType === 'wave') {
        waveAngle = Math.sin(t * 2) * 0.24;
      } else if (item.animType === 'clap') {
        jumpY = Math.abs(Math.sin(t * 2.5)) * 0.08;
      }

      // Torso Matrix
      tempPos.set(
        item.basePosition.x,
        item.basePosition.y + 0.28 + jumpY,
        item.basePosition.z
      );
      tempEuler.set(0, item.baseRotationY + waveAngle, 0);
      tempRot.setFromEuler(tempEuler);
      tempScale.set(1, 1, 1);
      tempMatrix.compose(tempPos, tempRot, tempScale);
      torsosRef.current.setMatrixAt(i, tempMatrix);

      // Head Matrix
      tempPos.set(
        item.basePosition.x,
        item.basePosition.y + 0.62 + jumpY,
        item.basePosition.z
      );
      tempMatrix.compose(tempPos, tempRot, tempScale);
      headsRef.current.setMatrixAt(i, tempMatrix);

      // Cap Matrix
      tempPos.set(
        item.basePosition.x,
        item.basePosition.y + 0.72 + jumpY,
        item.basePosition.z
      );
      tempMatrix.compose(tempPos, tempRot, tempScale);
      capsRef.current.setMatrixAt(i, tempMatrix);

      // Cheering Arms Matrix (Moves up and down during cheering)
      tempPos.set(
        item.basePosition.x,
        item.basePosition.y + 0.45 + jumpY * 1.4,
        item.basePosition.z
      );
      tempScale.set(1, armScaleY, 1);
      tempMatrix.compose(tempPos, tempRot, tempScale);
      armsRef.current.setMatrixAt(i, tempMatrix);
    }

    torsosRef.current.instanceMatrix.needsUpdate = true;
    headsRef.current.instanceMatrix.needsUpdate = true;
    capsRef.current.instanceMatrix.needsUpdate = true;
    armsRef.current.instanceMatrix.needsUpdate = true;
  });

  // Anatomical Human Geometries for realistic spectator silhouettes
  const torsoGeom = useMemo(() => new THREE.BoxGeometry(0.32, 0.42, 0.22), []);
  const headGeom = useMemo(() => new THREE.SphereGeometry(0.12, 10, 10), []);
  const capGeom = useMemo(() => new THREE.CylinderGeometry(0.13, 0.13, 0.06, 10), []);
  const armsGeom = useMemo(() => new THREE.BoxGeometry(0.48, 0.28, 0.12), []); // Raised cheering arm silhouette

  return (
    <group>
      {/* ── 1. INSTANCED AUDIENCE HUMAN TORSOS (Team Jerseys) ── */}
      <instancedMesh
        ref={torsosRef}
        args={[torsoGeom, PBR_MATERIALS.spectatorWhite, totalSpectators]}
        castShadow
        receiveShadow
      />

      {/* ── 2. INSTANCED AUDIENCE HUMAN HEADS (Skin Tones) ── */}
      <instancedMesh
        ref={headsRef}
        args={[headGeom, PBR_MATERIALS.spectatorSkin, totalSpectators]}
        castShadow
      />

      {/* ── 3. INSTANCED AUDIENCE TEAM CAPS ── */}
      <instancedMesh
        ref={capsRef}
        args={[capGeom, PBR_MATERIALS.spectatorWhite, totalSpectators]}
        castShadow
      />

      {/* ── 4. INSTANCED CHEERING / WAVING ARMS ── */}
      <instancedMesh
        ref={armsRef}
        args={[armsGeom, PBR_MATERIALS.spectatorSkin, totalSpectators]}
        castShadow
      />

      {/* ── 5. HERO: ANIMATED CHAMPAGNE STREAKER FAN (Tripping on road & Dancing) ── */}
      <ChampagneStreakerFan3D />
    </group>
  );
};
