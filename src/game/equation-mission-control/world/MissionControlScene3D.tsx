// ============================================================
// EQUATION MISSION CONTROL 2.0 — Master 3D Scene
// Complete Aerospace Launch Facility with:
// - Blue Team Rocket (Left) + Red Team Rocket (Right)
// - Dual Launch Towers & Central Campus Infrastructure
// - Animated Stylized Human Aerospace Workers
// - Sunny Daytime Atmosphere & Soaring Birds
// - Dynamic Cinematic Tracking Camera & Subtle Parallax
// ============================================================

'use client';

import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useMissionControlStore } from '../store/missionControlStore';
import { Spacecraft3D } from './Spacecraft3D';
import { LaunchFacility3D } from './LaunchFacility3D';
import { AerospaceWorkers3D } from './AerospaceWorkers3D';
import { DaytimeAtmosphere3D } from './DaytimeAtmosphere3D';

// Dynamic Camera Controller with Smooth Parallax & Liftoff Tracking
const DynamicCameraController: React.FC = () => {
  const { camera } = useThree();
  const phase = useMissionControlStore((s) => s.phase);
  const blueShip = useMissionControlStore((s) => s.blueSpacecraft);
  const redShip = useMissionControlStore((s) => s.redSpacecraft);
  const winner = useMissionControlStore((s) => s.winnerTeam);
  const cameraTarget = useMissionControlStore((s) => s.cameraTarget);
  const currentStage = useMissionControlStore((s) => s.currentStageIndex);
  const parallaxX = useMissionControlStore((s) => s.parallaxX);
  const parallaxY = useMissionControlStore((s) => s.parallaxY);

  const lookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 4.5, 0));

  useFrame((_, delta) => {
    const isHeroLaunch = phase === 'launch-cinematic';
    const heroShip = winner === 'red' ? redShip : blueShip;

    let targetCamPos = new THREE.Vector3(0, 8.2, 17.5);
    let targetLookAt = new THREE.Vector3(0, 4.5, 0);

    // 1. Final Liftoff Cinematic Tracking Shot
    if (isHeroLaunch) {
      const heroX = winner === 'red' ? 7.5 : winner === 'blue' ? -7.5 : 0;
      const shipAlt = heroShip.altitude;

      if (shipAlt < 15) {
        // Low altitude dramatic pad shot
        targetCamPos.set(heroX + (winner === 'red' ? -3 : 3), 5.5 + shipAlt * 0.4, 12);
        targetLookAt.set(heroX, 3.5 + shipAlt, 0);
      } else if (shipAlt < 60) {
        // Mid sky tracking shot
        targetCamPos.set(heroX * 0.4, 18 + shipAlt * 0.35, 24);
        targetLookAt.set(heroX * 0.5, shipAlt + 2, 0);
      } else {
        // High altitude wide shot passing sunlit cloud layer
        targetCamPos.set(0, 32, 30);
        targetLookAt.set(heroX * 0.2, shipAlt * 0.8, 0);
      }
    } else {
      // 2. Stage-Specific Focus Camera
      if (currentStage === 0) {
        // Stage 1: Wide Pad Avionics
        targetCamPos.set(0, 8.0, 16.5);
        targetLookAt.set(0, 4.5, 0);
      } else if (currentStage === 1) {
        // Stage 2: Fuel Umbilicals Focus
        targetCamPos.set(0, 7.2, 15.5);
        targetLookAt.set(0, 3.8, 0);
      } else if (currentStage === 2) {
        // Stage 3: Rocket Engines Focus
        targetCamPos.set(0, 6.0, 14.5);
        targetLookAt.set(0, 2.5, 0);
      } else if (currentStage === 3) {
        // Stage 4: Navigation Gimbals Focus
        targetCamPos.set(0, 8.5, 15.5);
        targetLookAt.set(0, 5.0, 0);
      } else if (currentStage === 4) {
        // Stage 5: Armed Launch Pad
        targetCamPos.set(0, 9.0, 18.0);
        targetLookAt.set(0, 4.8, 0);
      }

      // Add gentle subtle mouse / touch parallax
      targetCamPos.x += parallaxX * 1.8;
      targetCamPos.y -= parallaxY * 0.8;
    }

    // Smooth camera interpolation
    camera.position.lerp(targetCamPos, delta * 2.2);
    lookAtRef.current.lerp(targetLookAt, delta * 2.5);
    camera.lookAt(lookAtRef.current);
  });

  return null;
};

export const MissionControlScene3D: React.FC = () => {
  const blueSpacecraft = useMissionControlStore((s) => s.blueSpacecraft);
  const redSpacecraft = useMissionControlStore((s) => s.redSpacecraft);
  const blueTeam = useMissionControlStore((s) => s.blueTeam);
  const redTeam = useMissionControlStore((s) => s.redTeam);
  const winner = useMissionControlStore((s) => s.winnerTeam);
  const setParallax = useMissionControlStore((s) => s.setParallax);

  // Parallax Pointer Move Listener
  const handlePointerMove = (e: React.PointerEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth) * 2 - 1; // -1 to 1
    const y = (clientY / innerHeight) * 2 - 1;
    setParallax(x, y);
  };

  return (
    <div
      onPointerMove={handlePointerMove}
      className="w-full h-full relative cursor-grab active:cursor-grabbing select-none"
    >
      <Canvas
        shadows
        camera={{ position: [0, 8.2, 17.5], fov: 48 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
      >
        {/* Dynamic Camera Choreography */}
        <DynamicCameraController />

        {/* Sunny Atmosphere, Sky, Clouds & Campus */}
        <DaytimeAtmosphere3D />

        {/* Dual Launch Pad Facility (Left Blue, Right Red, Center Hub) */}
        <LaunchFacility3D
          blueState={blueSpacecraft}
          redState={redSpacecraft}
        />

        {/* ── LEFT LAUNCH PAD: BLUE TEAM SPACECRAFT (x = -7.5) ── */}
        <Spacecraft3D
          position={[-7.5, 0.72, 0]}
          team="blue"
          state={blueSpacecraft}
          isHeroWinner={winner === 'blue' || winner === 'draw'}
        />

        {/* ── RIGHT LAUNCH PAD: RED TEAM SPACECRAFT (x = +7.5) ── */}
        <Spacecraft3D
          position={[7.5, 0.72, 0]}
          team="red"
          state={redSpacecraft}
          isHeroWinner={winner === 'red' || winner === 'draw'}
        />

        {/* Stylized Animated Aerospace Engineers */}
        <AerospaceWorkers3D
          launchStage={blueSpacecraft.launchStage}
          blueCheering={blueTeam.lastResult === 'correct'}
          redCheering={redTeam.lastResult === 'correct'}
        />
      </Canvas>
    </div>
  );
};
