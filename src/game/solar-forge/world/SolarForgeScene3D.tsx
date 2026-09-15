'use client';

// ============================================================
// THE SOLAR FORGE: Master 3D World Scene
// Daylight valley, Sun in sky, 3D Sundial, Blue & Red Heliostats,
// Central Solar Forge, Receiver Towers, Sunlight Beams & Cinematic Camera
// ============================================================

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSolarForgeStore } from '../store/solarForgeStore';
import { DaylightEnvironment3D } from './DaylightEnvironment3D';
import { SunObject3D } from './SunObject3D';
import { InteractiveSundial3D } from './InteractiveSundial3D';
import { HeliostatMirror3D } from './HeliostatMirror3D';
import { CentralSolarForge3D } from './CentralSolarForge3D';
import { EnergyReceiverTower3D } from './EnergyReceiverTower3D';
import { SunlightBeams3D } from './SunlightBeams3D';
import { HumanCrew3D } from './HumanCrew3D';
import { FlyingBirds3D } from './FlyingBirds3D';
import { CamelCaravan3D } from './CamelCaravan3D';

// Cinematic World Camera Director with Responsive Mouse Parallax
const SolarForgeCameraDirector: React.FC<{
  isCinematic: boolean;
  blueActive: boolean;
  redActive: boolean;
}> = ({ isCinematic, blueActive, redActive }) => {
  const currentPos = useRef(new THREE.Vector3(0, 15, 30));
  const currentTarget = useRef(new THREE.Vector3(0, 7.5, -14));

  useFrame((state, delta) => {
    // ── MOUSE PARALLAX RESPONSE (Normalized -1 to +1) ──
    const mouseX = state.pointer.x; // Left -1 to Right +1
    const mouseY = state.pointer.y; // Bottom -1 to Top +1

    // Camera shifts smoothly with mouse movement
    const parallaxX = mouseX * 7.5;  // Lateral pan
    const parallaxY = mouseY * 3.5;  // Vertical pitch
    const lookOffsetX = -mouseX * 2.8;
    const lookOffsetY = -mouseY * 1.5;

    let targetX = 0;
    let targetY = 15;
    let targetZ = 30;
    let lookY = 7.5;
    let lookZ = -14;

    if (isCinematic) {
      // Grand cinematic pull-back showing the entire valley & blazing Forge
      targetX = 0;
      targetY = 26;
      targetZ = 48;
      lookY = 14;
      lookZ = -25;
    } else if (blueActive && !redActive) {
      targetX = -8;
      targetY = 14;
      targetZ = 28;
      lookY = 6.5;
      lookZ = -12;
    } else if (redActive && !blueActive) {
      targetX = 8;
      targetY = 14;
      targetZ = 28;
      lookY = 6.5;
      lookZ = -12;
    }

    const dampSpeed = 3.2;
    currentPos.current.x = THREE.MathUtils.damp(currentPos.current.x, targetX + parallaxX, dampSpeed, delta);
    currentPos.current.y = THREE.MathUtils.damp(currentPos.current.y, targetY + parallaxY, dampSpeed, delta);
    currentPos.current.z = THREE.MathUtils.damp(currentPos.current.z, targetZ, dampSpeed, delta);

    currentTarget.current.x = THREE.MathUtils.damp(currentTarget.current.x, lookOffsetX, dampSpeed, delta);
    currentTarget.current.y = THREE.MathUtils.damp(currentTarget.current.y, lookY + lookOffsetY, dampSpeed, delta);
    currentTarget.current.z = THREE.MathUtils.damp(currentTarget.current.z, lookZ, dampSpeed, delta);

    state.camera.position.copy(currentPos.current);
    state.camera.lookAt(currentTarget.current);
  });

  return null;
};

export const SolarForgeScene3D: React.FC = () => {
  const blue = useSolarForgeStore((s) => s.blue);
  const red = useSolarForgeStore((s) => s.red);
  const forge = useSolarForgeStore((s) => s.solarForge);
  const sun = useSolarForgeStore((s) => s.sun);
  const sundial = useSolarForgeStore((s) => s.sundial);
  const phase = useSolarForgeStore((s) => s.gamePhase);

  const isCinematic = phase === 'cinematic_activation' || phase === 'victory';
  const isBlueRotating = blue.isRotatingMirror || blue.lastFeedback === 'beam_aligned';
  const isRedRotating = red.isRotatingMirror || red.lastFeedback === 'beam_aligned';

  return (
    <div className="relative w-full h-full select-none overflow-hidden bg-[#bae6fd]">
      <Canvas
        camera={{ position: [0, 16, 32], fov: 48, near: 0.5, far: 500 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        shadows
        dpr={[1, 1.5]}
      >
        {/* ── CINEMATIC CAMERA ── */}
        <SolarForgeCameraDirector
          isCinematic={isCinematic}
          blueActive={isBlueRotating}
          redActive={isRedRotating}
        />

        {/* ── DAYLIGHT ENVIRONMENT & VALLEYS ── */}
        <DaylightEnvironment3D
          sunPosition={sun.worldPosition}
          timeString={sun.timeString}
        />

        {/* ── VISIBLE RADIANT SUN IN SKY ── */}
        <SunObject3D position={sun.worldPosition} />

        {/* ── FLYING BIRDS IN SUMMER SKY ── */}
        <FlyingBirds3D />

        {/* ── DISTANT CAMEL CARAVAN IN FOOTHILLS ── */}
        <CamelCaravan3D />

        {/* ── PHYSICAL INTERACTIVE SUNDIAL STATION ── */}
        <InteractiveSundial3D
          position={sundial.position}
          shadowAngleDeg={sundial.shadowAngleDeg}
          shadowLength={sundial.shadowLength}
          interactiveAngle={Math.max(blue.instrumentAngle, red.instrumentAngle)}
          highlightClockAngle={blue.currentQuestion?.highlightClockAngle || red.currentQuestion?.highlightClockAngle}
        />

        {/* ── BLUE TEAM HELIOSTAT MIRRORS (WEST ARRAY) ── */}
        {blue.mirrors.map((m, idx) => (
          <HeliostatMirror3D
            key={m.id}
            team="blue"
            index={idx}
            position={m.position}
            azimuthDeg={m.azimuthDeg}
            elevationDeg={m.elevationDeg}
            targetAzimuthDeg={m.targetAzimuthDeg}
            targetElevationDeg={m.targetElevationDeg}
            isActive={m.isActive}
            isLockedOnTarget={m.isLockedOnTarget}
          />
        ))}

        {/* ── RED TEAM HELIOSTAT MIRRORS (EAST ARRAY) ── */}
        {red.mirrors.map((m, idx) => (
          <HeliostatMirror3D
            key={m.id}
            team="red"
            index={idx}
            position={m.position}
            azimuthDeg={m.azimuthDeg}
            elevationDeg={m.elevationDeg}
            targetAzimuthDeg={m.targetAzimuthDeg}
            targetElevationDeg={m.targetElevationDeg}
            isActive={m.isActive}
            isLockedOnTarget={m.isLockedOnTarget}
          />
        ))}

        {/* ── BLUE & RED ENERGY RECEIVER TOWERS ── */}
        <EnergyReceiverTower3D
          team="blue"
          position={blue.receiver.position}
          powerLevel={blue.receiver.powerLevel}
          isActive={blue.receiver.isActive}
          isStruckByBeam={blue.receiver.isStruckByBeam}
        />
        <EnergyReceiverTower3D
          team="red"
          position={red.receiver.position}
          powerLevel={red.receiver.powerLevel}
          isActive={red.receiver.isActive}
          isStruckByBeam={red.receiver.isStruckByBeam}
        />

        {/* ── GIANT CENTRAL SOLAR FORGE ── */}
        <CentralSolarForge3D
          powerLevel={forge.powerLevel}
          turbineRPM={forge.turbineRPM}
          ringRotationSpeed={forge.ringRotationSpeed}
          isBlueConnected={forge.isBlueBeamConnected}
          isRedConnected={forge.isRedBeamConnected}
          isFullyOperational={forge.isFullyOperational}
        />

        {/* ── PHYSICAL SUNLIGHT BEAMS ── */}
        <SunlightBeams3D
          sunPosition={sun.worldPosition}
          blueMirrors={blue.mirrors}
          redMirrors={red.mirrors}
          blueReceiver={blue.receiver}
          redReceiver={red.receiver}
          centralForgePosition={[0, 19.8, -35]}
          isBlueActive={blue.receiver.isStruckByBeam}
          isRedActive={red.receiver.isStruckByBeam}
          isForgeActive={forge.isFullyOperational || forge.powerLevel > 0}
        />

        {/* ── EXPEDITION CREW, TRUCKS & FLAGS ── */}
        <HumanCrew3D />
      </Canvas>
    </div>
  );
};
