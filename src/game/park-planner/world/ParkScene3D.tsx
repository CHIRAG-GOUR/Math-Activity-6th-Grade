// ============================================================
// PARK PLANNER — Master 3D Scene & Canvas
// Real daylight 3D park simulation powered by Cartesian coordinates
// ============================================================

import React, { useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sky, Environment } from '@react-three/drei';
import { useParkStore } from '../store/parkStore';
import { coordToWorld, lerp3D, easeInOutCubic, UNIT_SIZE } from '../engine/coordinateMath';
import { Coordinate2D, InstalledParkObject } from '../types';

import { ParkTerrain3D } from './ParkTerrain3D';
import { SwingSet3D, SlideTower3D, ClimbingDome3D, Seesaw3D } from './ParkPlayground3D';
import { TieredFountain3D, FlowerBed3D, VictorianGazebo3D, KoiPond3D } from './ParkBotanicalGarden3D';
import { BasketballCourt3D, SoccerPitch3D, FitnessStation3D } from './ParkSportsComplex3D';
import { PicnicTable3D, ParkBench3D, ShadyTree3D } from './ParkPicnicGrove3D';
import { ConstructionWorker3D, ConstructionCart3D } from './ParkWorkers3D';
import { ActiveJogger3D, Cyclist3D, BenchSitter3D } from './ParkCitizens3D';

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
      {object.type === 'park_bench' && (
        <group>
          <ParkBench3D />
          {!object.isConstructing && <BenchSitter3D position={[0, 0, 0]} />}
        </group>
      )}
      {object.type === 'tree_grove' && <ShadyTree3D scale={1.2} />}
      {object.type === 'sculpture' && <TieredFountain3D isFlowing={true} />}
      {object.type === 'walking_path' && (
        <mesh position={[0, 0.03, 0]}>
          <boxGeometry args={[2.2, 0.03, 2.2]} />
          <meshStandardMaterial color="#d4c7b0" roughness={0.6} />
        </mesh>
      )}
    </group>
  );
};

// ------------------------------------------------------------
// SIMULATION TICKER COMPONENT
// ------------------------------------------------------------
const SimTicker: React.FC = () => {
  const tickTransform = useParkStore((s) => s.tickTransformProgress);
  useFrame((_, delta) => {
    tickTransform(delta);
  });
  return null;
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
        camera={{ position: [0, 18, 22], fov: 42 }}
        className="w-full h-full"
      >
        <SimTicker />

        {/* Daylight Environment */}
        <Sky
          distance={450000}
          sunPosition={[20, 35, 20]}
          inclination={0.6}
          azimuth={0.25}
          turbidity={6}
          rayleigh={0.5}
        />
        <ambientLight intensity={0.7} />
        <directionalLight
          castShadow
          position={[18, 30, 18]}
          intensity={1.2}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={60}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
        />

        {/* Orbit Controls with bounded angles */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          minDistance={10}
          maxDistance={38}
          maxPolarAngle={Math.PI / 2.15}
          target={[0, 0, 0]}
        />

        {/* Base Cartesian Park Promenades & Grid */}
        <ParkTerrain3D
          selectedPoint={activeTeam.selectedPoint}
          selectedPoints={activeTeam.selectedPoints}
          onPointClick={onCoordinateClick}
        />

        {/* Standing Perimeter Trees */}
        {[
          [-10, -10],
          [10, -10],
          [-10, 10],
          [10, 10],
          [-8, 6],
          [8, -6],
          [9, 4],
          [-9, -5],
        ].map(([tx, tz], i) => (
          <ShadyTree3D key={`ptree_${i}`} position={[tx, 0, tz]} scale={0.9 + (i % 3) * 0.15} />
        ))}

        {/* Installed Objects: Blue Team */}
        {blueTeam.installedObjects.map((obj) => (
          <RenderInstalledObject key={`blue_obj_${obj.id}`} object={obj} />
        ))}

        {/* Installed Objects: Red Team */}
        {redTeam.installedObjects.map((obj) => (
          <RenderInstalledObject key={`red_obj_${obj.id}`} object={obj} />
        ))}

        {/* Construction Workers on Active Tasks */}
        {activeTeam.selectedPoint && (
          <group>
            <ConstructionWorker3D
              position={coordToWorld(activeTeam.selectedPoint, 0)}
              isConstructing={activeTeam.hasAnsweredCurrent && activeTeam.isCurrentCorrect === true}
            />
            <ConstructionCart3D
              position={coordToWorld(
                { x: activeTeam.selectedPoint.x + 0.6, y: activeTeam.selectedPoint.y },
                0
              )}
            />
          </group>
        )}

        {/* Living Park Citizens */}
        <ActiveJogger3D />
        <Cyclist3D />
      </Canvas>
    </div>
  );
};
