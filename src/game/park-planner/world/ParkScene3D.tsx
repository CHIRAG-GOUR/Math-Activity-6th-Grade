import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sky } from '@react-three/drei';
import { useParkStore } from '../store/parkStore';
import { coordToWorld, lerp3D, easeInOutCubic } from '../engine/coordinateMath';
import { Coordinate2D, InstalledParkObject } from '../types';
import { globalParkSim } from '../engine/parkSimEngine';

import { ParkTerrain3D } from './ParkTerrain3D';
import { FullQuadrant1Playground3D } from './ParkPlayground3D';
import { FullQuadrant2Botanical3D } from './ParkBotanicalGarden3D';
import { FullQuadrant3Sports3D } from './ParkSportsComplex3D';
import { FullQuadrant4Picnic3D } from './ParkPicnicGrove3D';
import { ShadyTree3D } from './ParkPicnicGrove3D';
import { StylizedHuman3D, RealisticCyclist3D } from './ParkCharacters3D';
import { ParkCitySurroundings3D } from './ParkCitySurroundings3D';

// ------------------------------------------------------------
// INTERACTIVE CURSOR PARALLAX RIG
// ------------------------------------------------------------
const CursorParallaxRig: React.FC<{
  mouse: { x: number; y: number };
  children: React.ReactNode;
}> = ({ mouse, children }) => {
  const parallaxGroupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!parallaxGroupRef.current) return;
    const clampedDelta = Math.min(0.1, delta);

    // Subtle, buttery smooth 3D tilt & holographic parallax translation
    const targetRotY = mouse.x * 0.045; // Subtle yaw tilt with mouse horizontal movement
    const targetRotX = -mouse.y * 0.035; // Subtle pitch tilt with mouse vertical movement
    const targetPosX = mouse.x * 1.6; // Lateral world shift
    const targetPosZ = mouse.y * 1.1;

    parallaxGroupRef.current.rotation.y = THREE.MathUtils.damp(
      parallaxGroupRef.current.rotation.y,
      targetRotY,
      4.0,
      clampedDelta
    );
    parallaxGroupRef.current.rotation.x = THREE.MathUtils.damp(
      parallaxGroupRef.current.rotation.x,
      targetRotX,
      4.0,
      clampedDelta
    );
    parallaxGroupRef.current.position.x = THREE.MathUtils.damp(
      parallaxGroupRef.current.position.x,
      targetPosX,
      4.0,
      clampedDelta
    );
    parallaxGroupRef.current.position.z = THREE.MathUtils.damp(
      parallaxGroupRef.current.position.z,
      targetPosZ,
      4.0,
      clampedDelta
    );
  });

  return <group ref={parallaxGroupRef}>{children}</group>;
};

// ------------------------------------------------------------
// SIMULATION & NPC TICKER COMPONENT
// ------------------------------------------------------------
const LiveParkSimManager: React.FC<{ grandOpeningActive?: boolean }> = ({ grandOpeningActive }) => {
  const tickTransform = useParkStore((s) => s.tickTransformProgress);
  const [, setFrame] = useState(0);

  useEffect(() => {
    if (grandOpeningActive) {
      globalParkSim.triggerGrandOpening();
    }
  }, [grandOpeningActive]);

  useFrame((_, delta) => {
    tickTransform(delta);
    globalParkSim.update(delta);
    setFrame((f) => (f + 1) % 1000);
  });

  const citizens = globalParkSim.getCitizens();

  return (
    <group name="LivingParkCitizens">
      {citizens.map((c) => {
        if (c.type === 'cyclist') {
          return (
            <RealisticCyclist3D
              key={c.id}
              position={c.pos}
              rotationY={c.rotationY}
              speed={1.2}
            />
          );
        }

        return (
          <StylizedHuman3D
            key={c.id}
            position={c.pos}
            rotationY={c.rotationY}
            scale={c.type === 'child' ? 0.65 : 0.95}
            shirtColor={c.shirtColor}
            pantsColor={c.pantsColor}
            hairColor={c.hairColor}
            skinColor={c.skinColor}
            isJogging={c.state === 'jogging'}
            isWalking={c.state === 'walking'}
            isSeated={c.state === 'resting'}
            hasHeadband={c.type === 'jogger'}
          />
        );
      })}
    </group>
  );
};

// ------------------------------------------------------------
// MASTER 3D PARK & CITY SCENE
// ------------------------------------------------------------
interface ParkScene3DProps {
  onCoordinateClick?: (coord: Coordinate2D) => void;
}

export const ParkScene3D: React.FC<ParkScene3DProps> = ({ onCoordinateClick }) => {
  const blueTeam = useParkStore((s) => s.blueTeam);
  const redTeam = useParkStore((s) => s.redTeam);
  const selectedTeam = useParkStore((s) => s.selectedTeamPreview);

  const activeTeam = selectedTeam === 'blue' ? blueTeam : redTeam;
  const qb = activeTeam.quadrantBuild;

  // Track cursor movement for interactive parallax
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    setMousePos({ x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, y)) });
  };

  return (
    <div
      className="relative w-full h-full min-h-[460px] bg-sky-200 overflow-hidden select-none"
      onPointerMove={handlePointerMove}
    >
      <Canvas
        shadows
        camera={{ position: [0, 22, 26], fov: 42 }}
        className="w-full h-full"
      >
        {/* Daylight Environment */}
        <Sky
          distance={450000}
          sunPosition={[28, 42, -28]}
          inclination={0.65}
          azimuth={0.25}
          turbidity={4}
          rayleigh={0.3}
        />
        <ambientLight intensity={0.8} />
        <directionalLight
          castShadow
          position={[28, 42, -28]}
          intensity={1.35}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={85}
          shadow-camera-left={-32}
          shadow-camera-right={32}
          shadow-camera-top={32}
          shadow-camera-bottom={-32}
        />

        {/* Orbit Controls with generous bounds */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          minDistance={10}
          maxDistance={50}
          maxPolarAngle={Math.PI / 2.15}
          target={[0, 0, 0]}
        />

        {/* Parallax-Responsive 3D City & Park World */}
        <CursorParallaxRig mouse={mousePos}>
          {/* 1. Surrounding City Skyline, Buildings, Shops, Food Stalls, Balloon Seller & Sun */}
          <ParkCitySurroundings3D />

          {/* 2. Master Terrain with Footpath, Roads, Gates & Central Fountain */}
          <ParkTerrain3D
            selectedPoint={activeTeam.selectedPoint}
            selectedPoints={activeTeam.selectedPoints}
            onPointClick={onCoordinateClick}
            gateOpenAngle={qb?.gateOpenAngle || 0}
            fountainActive={qb?.fountainActive || false}
          />

          {/* 3. QUADRANT I: CHILDREN'S PLAYGROUND (+x, +y -> world [+6, 0, -6]) */}
          <FullQuadrant1Playground3D
            progress={qb?.q1Progress || 0}
            isBuilding={qb?.q1Building || false}
            isBuilt={qb?.q1Built || false}
          />

          {/* 4. QUADRANT II: BOTANICAL GARDEN (-x, +y -> world [-6, 0, -6]) */}
          <FullQuadrant2Botanical3D
            progress={qb?.q2Progress || 0}
            isBuilding={qb?.q2Building || false}
            isBuilt={qb?.q2Built || false}
          />

          {/* 5. QUADRANT III: SPORTS COMPLEX (-x, -y -> world [-6, 0, 6]) */}
          <FullQuadrant3Sports3D
            progress={qb?.q3Progress || 0}
            isBuilding={qb?.q3Building || false}
            isBuilt={qb?.q3Built || false}
          />

          {/* 6. QUADRANT IV: PICNIC & RELAXATION (+x, -y -> world [+6, 0, 6]) */}
          <FullQuadrant4Picnic3D
            progress={qb?.q4Progress || 0}
            isBuilding={qb?.q4Building || false}
            isBuilt={qb?.q4Built || false}
          />

          {/* Outer Perimeter Street Trees */}
          {[
            [-15, -15],
            [15, -15],
            [-15, 15],
            [15, 15],
            [-15, 0],
            [15, 0],
            [0, -15],
            [0, 15],
            [-11, -7],
            [11, -7],
            [-11, 7],
            [11, 7],
          ].map(([tx, tz], i) => (
            <ShadyTree3D key={`outer_tree_${i}`} position={[tx, 0, tz]} scale={1.0 + (i % 3) * 0.15} />
          ))}

          {/* Living Park Citizens & Grand Opening Traffic Simulation */}
          <LiveParkSimManager grandOpeningActive={qb?.grandOpeningActive} />
        </CursorParallaxRig>
      </Canvas>
    </div>
  );
};
