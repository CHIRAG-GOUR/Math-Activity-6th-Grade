// ============================================================
// EQUATION MISSION CONTROL 2.0 — Master 3D Scene
// Complete Aerospace Launch Facility with:
// - Blue Team Rocket (Left, x = -7.0) + Red Team Rocket (Right, x = +7.0)
// - Dual Launch Towers, Umbilicals & Central Operations Hub
// - Animated Stylized Human Aerospace Workers & 3D Workstations
// - Sunny Daytime Atmosphere, Clouds, Horizon Hills & Birds
// - Dynamic Cinematic Tracking Camera & Smooth Multi-layer Parallax
// ============================================================

'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useMissionControlStore } from '../store/missionControlStore';
import { Spacecraft3D } from './Spacecraft3D';
import { LaunchFacility3D } from './LaunchFacility3D';
import { AerospaceWorkers3D } from './AerospaceWorkers3D';
import { DaytimeAtmosphere3D } from './DaytimeAtmosphere3D';

// Dynamic Camera Controller with Smooth Multi-layer Parallax & Cinematic Liftoff
const DynamicCameraController: React.FC = () => {
  const { camera } = useThree();
  const phase = useMissionControlStore((s) => s.phase);
  const blueShip = useMissionControlStore((s) => s.blueSpacecraft);
  const redShip = useMissionControlStore((s) => s.redSpacecraft);
  const winner = useMissionControlStore((s) => s.winnerTeam);
  const currentStage = useMissionControlStore((s) => s.currentStageIndex);
  const parallaxX = useMissionControlStore((s) => s.parallaxX);
  const parallaxY = useMissionControlStore((s) => s.parallaxY);

  const lookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 5.0, 0));

  useFrame((_, delta) => {
    const isHeroLaunch = phase === 'launch-cinematic';
    const isRedHero = winner === 'red';
    const heroShip = isRedHero ? redShip : blueShip;

    // Default Campus Establishing Shot (Wide, open, sunny)
    let targetCamPos = new THREE.Vector3(0, 8.6, 18.2);
    let targetLookAt = new THREE.Vector3(0, 5.0, 0);

    // 1. Final Liftoff Cinematic Tracking Shot (Centered squarely on the winning rocket!)
    if (isHeroLaunch) {
      const heroX = isRedHero ? 7.0 : -7.0;
      const shipAlt = heroShip.altitude;

      if (shipAlt < 4.0) {
        // Stage A: Ignition & Pad Flame Eruption (Dead-center hero framing)
        targetCamPos.set(heroX, 5.2, 14.2);
        targetLookAt.set(heroX, 4.2, 0);
      } else if (shipAlt < 25.0) {
        // Stage B: Liftoff & Tower Clearing (Smooth vertical craning following ascent)
        targetCamPos.set(
          heroX,
          5.6 + shipAlt * 0.68,
          15.6 + shipAlt * 0.16
        );
        targetLookAt.set(heroX, 4.2 + shipAlt * 0.88, 0);
      } else {
        // Stage C: High Sky & Cloud Layer Entry (Cinematic upward tracking)
        targetCamPos.set(
          heroX * 0.5,
          20.0 + shipAlt * 0.45,
          26.0 + shipAlt * 0.08
        );
        targetLookAt.set(heroX * 0.7, shipAlt * 0.92 + 2.0, 0);
      }
    } else {
      // 2. Stage-Specific Subtle Camera Focus
      if (currentStage === 0) {
        // Stage 1: Wide Pad Avionics
        targetCamPos.set(0, 8.6, 18.2);
        targetLookAt.set(0, 5.0, 0);
      } else if (currentStage === 1) {
        // Stage 2: Fuel Umbilicals Focus
        targetCamPos.set(0, 7.8, 17.2);
        targetLookAt.set(0, 4.4, 0);
      } else if (currentStage === 2) {
        // Stage 3: Rocket Engines Focus
        targetCamPos.set(0, 6.8, 16.5);
        targetLookAt.set(0, 3.2, 0);
      } else if (currentStage === 3) {
        // Stage 4: Navigation Gimbals Focus
        targetCamPos.set(0, 9.0, 17.5);
        targetLookAt.set(0, 5.4, 0);
      } else if (currentStage === 4) {
        // Stage 5: Armed Launch Pad
        targetCamPos.set(0, 9.5, 19.0);
        targetLookAt.set(0, 5.2, 0);
      }

      // Add gentle subtle pointer parallax
      targetCamPos.x += parallaxX * 2.0;
      targetCamPos.y -= parallaxY * 0.9;
    }

    // Smooth camera interpolation
    camera.position.lerp(targetCamPos, delta * 2.6);
    lookAtRef.current.lerp(targetLookAt, delta * 2.8);
    camera.lookAt(lookAtRef.current);
  });

  return null;
};

export const MissionControlScene3D: React.FC = () => {
  const phase = useMissionControlStore((s) => s.phase);
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

  const isLaunchPhase = phase === 'launch-cinematic' || phase === 'mission-report';
  const heroLaunchStage = winner === 'red' ? redSpacecraft.launchStage : blueSpacecraft.launchStage;

  return (
    <div
      onPointerMove={handlePointerMove}
      className="w-full h-full relative cursor-grab active:cursor-grabbing select-none"
    >
      <Canvas
        shadows
        camera={{ position: [0, 8.6, 18.2], fov: 48 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.18,
        }}
      >
        {/* Dynamic Camera Choreography */}
        <DynamicCameraController />

        {/* Sunny Atmosphere, Sky, Clouds, Mountains & Campus */}
        <DaytimeAtmosphere3D />

        {/* Dual Launch Pad Facility (Left Blue, Right Red, Center Hub) */}
        <LaunchFacility3D
          blueState={blueSpacecraft}
          redState={redSpacecraft}
        />

        {/* ── LEFT LAUNCH PAD: BLUE TEAM SPACECRAFT (x = -7.0) ── */}
        <Spacecraft3D
          position={[-7.0, 0.85, 0]}
          team="blue"
          state={blueSpacecraft}
          isHeroWinner={winner === 'blue'}
        />

        {/* ── RIGHT LAUNCH PAD: RED TEAM SPACECRAFT (x = +7.0) ── */}
        <Spacecraft3D
          position={[7.0, 0.85, 0]}
          team="red"
          state={redSpacecraft}
          isHeroWinner={winner === 'red'}
        />

        {/* Stylized Animated Aerospace Engineers & 3D Workstations */}
        <AerospaceWorkers3D
          launchStage={heroLaunchStage}
          isLaunchPhase={isLaunchPhase}
          blueStagesCleared={blueTeam.stagesCleared}
          redStagesCleared={redTeam.stagesCleared}
          blueCheering={blueTeam.lastResult === 'correct' || winner === 'blue'}
          redCheering={redTeam.lastResult === 'correct' || winner === 'red'}
          blueIsWelding={blueSpacecraft.isWeldingActive && blueTeam.stagesCleared < 3}
          redIsWelding={redSpacecraft.isWeldingActive && redTeam.stagesCleared < 3}
        />
      </Canvas>
    </div>
  );
};
