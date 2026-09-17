// ============================================================
// PARK PLANNER — Master 3D Park Scene & Canvas
// Real daylight 3D park simulation powered by Cartesian coordinates, 
// 4 Full Quadrant progressive construction (8-10s build sequences),
// and 10-15s Grand Opening crowd celebration.
// ============================================================

import React, { useState, useEffect } from 'react';
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
// MASTER 3D PARK SCENE
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

  return (
    <div className="relative w-full h-full min-h-[460px] bg-sky-200 overflow-hidden select-none">
      <Canvas
        shadows
        camera={{ position: [0, 20, 24], fov: 40 }}
        className="w-full h-full"
      >
        {/* Daylight Environment */}
        <Sky
          distance={450000}
          sunPosition={[22, 38, 22]}
          inclination={0.6}
          azimuth={0.25}
          turbidity={5}
          rayleigh={0.4}
        />
        <ambientLight intensity={0.75} />
        <directionalLight
          castShadow
          position={[20, 32, 20]}
          intensity={1.25}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={65}
          shadow-camera-left={-22}
          shadow-camera-right={22}
          shadow-camera-top={22}
          shadow-camera-bottom={-22}
        />

        {/* Orbit Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          minDistance={10}
          maxDistance={42}
          maxPolarAngle={Math.PI / 2.15}
          target={[0, 0, 0]}
        />

        {/* Master Terrain with Footpath, Roads, Gates & Central Fountain */}
        <ParkTerrain3D
          selectedPoint={activeTeam.selectedPoint}
          selectedPoints={activeTeam.selectedPoints}
          onPointClick={onCoordinateClick}
          gateOpenAngle={qb?.gateOpenAngle || 0}
          fountainActive={qb?.fountainActive || false}
        />

        {/* 1. QUADRANT I: CHILDREN'S PLAYGROUND (+x, +y -> world [+6, 0, -6]) */}
        <FullQuadrant1Playground3D
          progress={qb?.q1Progress || 0}
          isBuilding={qb?.q1Building || false}
          isBuilt={qb?.q1Built || false}
        />

        {/* 2. QUADRANT II: BOTANICAL GARDEN (-x, +y -> world [-6, 0, -6]) */}
        <FullQuadrant2Botanical3D
          progress={qb?.q2Progress || 0}
          isBuilding={qb?.q2Building || false}
          isBuilt={qb?.q2Built || false}
        />

        {/* 3. QUADRANT III: SPORTS COMPLEX (-x, -y -> world [-6, 0, 6]) */}
        <FullQuadrant3Sports3D
          progress={qb?.q3Progress || 0}
          isBuilding={qb?.q3Building || false}
          isBuilt={qb?.q3Built || false}
        />

        {/* 4. QUADRANT IV: PICNIC & RELAXATION (+x, -y -> world [+6, 0, 6]) */}
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
      </Canvas>
    </div>
  );
};
