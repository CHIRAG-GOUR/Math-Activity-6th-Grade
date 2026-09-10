// ============================================================
// EQUATION MISSION CONTROL — Master 3D Canvas Scene
// Bright Sunny Aerospace Facility with Dynamic Stage Camera Rig:
// - Central 3D Spacecraft & Pad
// - Tall Umbilical Tower & Retracting Service Arms
// - 5 Physical Interactive 3D Machines around the Pad
// - Cinematic Camera Controller with Dynamic Stage Focusing
// ============================================================

'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useMissionControlStore } from '../store/missionControlStore';
import { Spacecraft3D } from './Spacecraft3D';
import { LaunchFacility3D } from './LaunchFacility3D';
import { AvionicsAssembly3D } from './AvionicsAssembly3D';
import { FuelLoadingMachine3D } from './FuelLoadingMachine3D';
import { EquationBalanceScale3D } from './EquationBalanceScale3D';
import { NavigationCalibration3D } from './NavigationCalibration3D';
import { LaunchLockMechanism3D } from './LaunchLockMechanism3D';
import { DaytimeAtmosphere3D } from './DaytimeAtmosphere3D';

const CameraController: React.FC = () => {
  const { camera } = useThree();

  const camPos = useMemo(() => new THREE.Vector3(), []);
  const camLook = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const s = useMissionControlStore.getState();
    const stage = s.currentStageIndex;
    const phase = s.phase;
    const launchStep = s.spacecraft.launchStage;
    const alt = s.spacecraft.altitude;

    // Default overview shot
    camPos.set(0, 6.2, 12.8);
    camLook.set(0, 4.2, 0);

    if (phase === 'active-mission' || phase === 'stage-intro' || phase === 'solution-reveal') {
      if (stage === 0) {
        // Stage 1: Focus toward Left Front Avionics Terminal & Cockpit
        camPos.set(-1.8, 4.8, 9.8);
        camLook.set(-0.8, 3.2, 1.2);
      } else if (stage === 1) {
        // Stage 2: Focus toward Right Front Variable Fuel Machine
        camPos.set(2.0, 4.8, 9.8);
        camLook.set(1.0, 3.0, 1.0);
      } else if (stage === 2) {
        // Stage 3: Focus toward Left Rear Equation Balance Scale
        camPos.set(-2.2, 4.5, 7.8);
        camLook.set(-1.4, 2.5, -0.8);
      } else if (stage === 3) {
        // Stage 4: Focus toward Right Rear Navigation Calibration Station
        camPos.set(2.2, 4.6, 7.8);
        camLook.set(1.4, 3.2, -0.6);
      } else if (stage === 4) {
        // Stage 5: Focus toward Center Front Launch Lock Mechanism
        camPos.set(0, 4.2, 9.2);
        camLook.set(0, 2.6, 1.8);
      }
    } else if (phase === 'launch-cinematic') {
      if (launchStep === 'arming' || launchStep === 'hazard-lights') {
        camPos.set(0, 4.5, 9.5);
        camLook.set(0, 3.2, 0);
      } else if (launchStep === 'umbilical-retract' || launchStep === 'fuel-decouple') {
        camPos.set(-2.8, 7.5, 11.2);
        camLook.set(0, 6.0, 0);
      } else if (launchStep === 'ignition') {
        camPos.set(0, 4.2, 11.8);
        camLook.set(0, 2.8, 0);
      } else {
        // Liftoff & Sky Ascent: Camera pans upward and tracks rocket into sunlit sky!
        const trackY = Math.min(65, alt * 0.7);
        camPos.set(0, 6.5 + trackY, 14.5 + alt * 0.2);
        camLook.set(0, 4.0 + alt, 0);
      }
    }

    // Dynamic Zoom Level
    const targetZoom = s.zoomLevel || 1.0;
    if ('zoom' in camera) {
      const pCam = camera as THREE.PerspectiveCamera;
      if (Math.abs(pCam.zoom - targetZoom) > 0.005) {
        pCam.zoom = THREE.MathUtils.lerp(pCam.zoom, targetZoom, 0.1);
        pCam.updateProjectionMatrix();
      }
    }

    camera.position.lerp(camPos, 0.045);
    camera.lookAt(camLook);
  });

  return null;
};

export const MissionControlScene3D: React.FC = () => {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 6.2, 12.8], fov: 46, near: 0.1, far: 250 }}
      style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(180deg, #38bdf8 0%, #7dd3fc 50%, #bae6fd 100%)',
      }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
    >
      {/* ── SUNLIT DAYTIME LIGHTING ── */}
      <ambientLight intensity={0.9} color="#fffbeb" />
      <directionalLight
        position={[20, 35, 18]}
        intensity={1.6}
        color="#fffdf5"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={80}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
      />
      <directionalLight position={[-15, 20, -12]} intensity={0.45} color="#bae6fd" />
      <hemisphereLight args={['#38bdf8', '#4ade80', 0.6]} />

      <CameraController />

      {/* Daytime Environment & Atmosphere */}
      <DaytimeAtmosphere3D />

      {/* Launch Pad, Tower & Ground Support Equipment */}
      <LaunchFacility3D />

      {/* The 5 Stage 3D Machines */}
      <AvionicsAssembly3D />
      <FuelLoadingMachine3D />
      <EquationBalanceScale3D />
      <NavigationCalibration3D />
      <LaunchLockMechanism3D />

      {/* The Central Heavy 3D Spacecraft */}
      <Spacecraft3D />
    </Canvas>
  );
};
