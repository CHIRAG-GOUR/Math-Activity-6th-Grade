// ============================================================
// GRAPHWORKS — THE DATA CITY: Master 3D World Component
// Premium stylized metropolitan data city with 6 functional districts,
// full 360° daylight sky dome, dynamic transit, articulated pedestrians,
// engineered Data Tower, and smooth mouse parallax.
// ============================================================
'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CityEnvironment3D } from './CityEnvironment3D';
import { CityArchitecture3D } from './CityArchitecture3D';
import { CityDistricts3D } from './CityDistricts3D';
import { CityTransit3D } from './CityTransit3D';
import { CityPedestrians3D } from './CityPedestrians3D';

// Cinematic Camera Director with Fluid Mouse Parallax
function CityCameraDirector() {
  const currentPos = useRef(new THREE.Vector3(0, 15.5, 25.5));
  const currentTarget = useRef(new THREE.Vector3(0, 3.2, 0.5));

  useFrame((state, delta) => {
    // Normalized mouse coordinates (-1 to +1)
    const mx = state.pointer.x;
    const my = state.pointer.y;

    // Gentle, cinematic parallax shifts
    const targetX = mx * 4.2;
    const targetY = 15.5 + my * 2.0;
    const targetZ = 25.5 - my * 1.5;

    const lookX = -mx * 1.5;
    const lookY = 3.2 + my * 0.8;
    const lookZ = 0.5;

    // Smooth exponential dampening
    currentPos.current.x = THREE.MathUtils.damp(currentPos.current.x, targetX, 2.5, delta);
    currentPos.current.y = THREE.MathUtils.damp(currentPos.current.y, targetY, 2.5, delta);
    currentPos.current.z = THREE.MathUtils.damp(currentPos.current.z, targetZ, 2.5, delta);

    currentTarget.current.x = THREE.MathUtils.damp(currentTarget.current.x, lookX, 2.5, delta);
    currentTarget.current.y = THREE.MathUtils.damp(currentTarget.current.y, lookY, 2.5, delta);
    currentTarget.current.z = THREE.MathUtils.damp(currentTarget.current.z, lookZ, 2.5, delta);

    state.camera.position.copy(currentPos.current);
    state.camera.lookAt(currentTarget.current);
  });

  return null;
}

export function DataCity3D() {
  return (
    <group>
      {/* ── CINEMATIC CAMERA DIRECTOR ── */}
      <CityCameraDirector />

      {/* ── PREMIUM DAYLIGHT LIGHTING RIG ── */}
      {/* Soft atmospheric ambient light */}
      <ambientLight color="#e0f2fe" intensity={1.15} />

      {/* Sun directional light with clean crisp shadows */}
      <directionalLight
        position={[35, 45, 25]}
        intensity={2.6}
        color="#fffdf0"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={120}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={35}
        shadow-camera-bottom={-35}
        shadow-bias={-0.0002}
      />

      {/* Sky-to-ground natural hemisphere bounce */}
      <hemisphereLight args={['#bae6fd', '#86efac', 0.7]} />

      {/* Subtle warm accent light from ocean side */}
      <directionalLight position={[-30, 20, 30]} intensity={0.65} color="#e0f2fe" />

      {/* ── 1. ENVIRONMENT & 360° SKY DOME ── */}
      <CityEnvironment3D />

      {/* ── 2. ARCHITECTURE & ENGINEERED DATA TOWER ── */}
      <CityArchitecture3D />

      {/* ── 3. SIX FUNCTIONAL DATA DISTRICTS ── */}
      <CityDistricts3D />

      {/* ── 4. LIVE TRANSIT & TRAFFIC SIMULATION ── */}
      <CityTransit3D />

      {/* ── 5. STYLIZED CITIZEN PEDESTRIANS & CROWD PHYSICS ── */}
      <CityPedestrians3D />
    </group>
  );
}
