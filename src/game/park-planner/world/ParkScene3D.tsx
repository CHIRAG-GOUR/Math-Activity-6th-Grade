// ============================================================
// PARK PLANNER — Master 3D Park Scene & Canvas
// Real daylight 3D park simulation powered by Cartesian coordinates & Waypoint Navigation
// ============================================================

import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sky } from '@react-three/drei';
import { useParkStore } from '../store/parkStore';
import { coordToWorld, lerp3D, easeInOutCubic } from '../engine/coordinateMath';
import { Coordinate2D, InstalledParkObject } from '../types';
import { globalParkSim, SimCitizen } from '../engine/parkSimEngine';

import { ParkTerrain3D } from './ParkTerrain3D';
import { SwingSet3D, SlideTower3D, ClimbingDome3D, Seesaw3D } from './ParkPlayground3D';
import { TieredFountain3D, FlowerBed3D, VictorianGazebo3D, KoiPond3D } from './ParkBotanicalGarden3D';
import { BasketballCourt3D, SoccerPitch3D, FitnessStation3D } from './ParkSportsComplex3D';
import { PicnicTable3D, ParkBench3D, ShadyTree3D } from './ParkPicnicGrove3D';
import { ConstructionWorker3D, ConstructionCart3D } from './ParkWorkers3D';
import { StylizedHuman3D, RealisticCyclist3D } from './ParkCharacters3D';

// ------------------------------------------------------------
// OBJECT RENDERER WITH SMOOTH INTERPOLATIONS
// ------------------------------------------------------------
const RenderInstalledObject: React.FC<{ object: InstalledParkObject }> = ({ object }) => {
  const currentPos = coordToWorld(object.position);
  let renderPos = currentPos;

  if (object.isTransforming && object.previousPosition && object.transformProgress !== undefined) {
    const prevPos = coordToWorld(object.previousPosition);
    const easedT = easeInOutCubic(object.transformProgress);
    renderPos = lerp3D(prevPos, currentPos, easedT);
  }

  const scale = object.isConstructing
    ? Math.min(1, 0.2 + (object.constructionProgress || 0) * 0.8)
    : 1;

  return (
    <group position={renderPos} scale={[scale, scale, scale]}>
      {/* Playground items */}
      {object.type === 'swings' && <SwingSet3D />}
      {object.type === 'slide' && <SlideTower3D />}
      {object.type === 'climbing_frame' && <ClimbingDome3D />}
      {object.type === 'seesaw' && <Seesaw3D />}
      {object.type === 'sandbox' && <SwingSet3D />}

      {/* Botanical items */}
      {object.type === 'fountain' && <TieredFountain3D isFlowing={!object.isConstructing} />}
      {object.type === 'flower_bed' && <FlowerBed3D />}
      {object.type === 'rose_garden' && <FlowerBed3D flowerColor="#ef4444" />}
      {object.type === 'gazebo' && <VictorianGazebo3D />}
      {object.type === 'pond' && <KoiPond3D />}

      {/* Sports items */}
      {object.type === 'basketball_court' && <BasketballCourt3D />}
      {object.type === 'soccer_goal' && <SoccerPitch3D />}
      {object.type === 'fitness_station' && <FitnessStation3D />}

      {/* Picnic & Relaxation items */}
      {object.type === 'picnic_table' && <PicnicTable3D />}
      {object.type === 'park_bench' && <ParkBench3D hasVisitor={!object.isConstructing} />}
      {object.type === 'tree_grove' && <ShadyTree3D scale={1.2} />}
      {object.type === 'sculpture' && <TieredFountain3D isFlowing={true} />}
      {object.type === 'walking_path' && (
        <mesh position={[0, 0.035, 0]}>
          <boxGeometry args={[2.3, 0.03, 2.3]} />
          <meshStandardMaterial color="#d4c7b0" roughness={0.6} />
        </mesh>
      )}
    </group>
  );
};

// ------------------------------------------------------------
// SIMULATION & NPC TICKER COMPONENT
// ------------------------------------------------------------
const LiveParkSimManager: React.FC = () => {
  const tickTransform = useParkStore((s) => s.tickTransformProgress);
  const [, setFrame] = useState(0);

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

        {/* Master Terrain with Footpath, Roads & Cartesian Promenades */}
        <ParkTerrain3D
          selectedPoint={activeTeam.selectedPoint}
          selectedPoints={activeTeam.selectedPoints}
          onPointClick={onCoordinateClick}
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

        {/* Living Park Citizens & Traffic Simulation */}
        <LiveParkSimManager />

        {/* Installed Objects: Blue Team */}
        {blueTeam.installedObjects.map((obj) => (
          <RenderInstalledObject key={`blue_obj_${obj.id}`} object={obj} />
        ))}

        {/* Installed Objects: Red Team */}
        {redTeam.installedObjects.map((obj) => (
          <RenderInstalledObject key={`red_obj_${obj.id}`} object={obj} />
        ))}

        {/* Active Construction Workers & Utility Carts */}
        {activeTeam.selectedPoint && (
          <group>
            <ConstructionWorker3D
              position={coordToWorld(activeTeam.selectedPoint, 0)}
              isConstructing={activeTeam.hasAnsweredCurrent && activeTeam.isCurrentCorrect === true}
            />
            <ConstructionCart3D
              position={coordToWorld(
                { x: activeTeam.selectedPoint.x + 0.65, y: activeTeam.selectedPoint.y },
                0
              )}
            />
          </group>
        )}
      </Canvas>
    </div>
  );
};
