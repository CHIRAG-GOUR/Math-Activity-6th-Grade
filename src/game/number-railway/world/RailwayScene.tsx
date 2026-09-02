// ============================================================
// THE GREAT NUMBER RAILWAY — Main 3D Railway Scene
// Composes tracks, stations, trains, signals, environment
// ============================================================

'use client';

import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment as DreiEnv } from '@react-three/drei';
import { useRailwayStore } from '../store/railwayStore';
import { RailwayTrack, RailwaySignal, RailwaySwitch } from './RailwayTrack';
import { Locomotive } from './Locomotive';
import {
  Station,
  WaterTower,
  Tree,
  Hill,
  SignalTower,
  CargoDepot,
  GroundPlane,
  Mountains,
} from './Environment';

// ── Camera Controller ──
const CameraController: React.FC = () => {
  const { camera } = useThree();
  const phase = useRailwayStore((s) => s.phase);

  useFrame(() => {
    // Default elevated 3/4 view
    const targetPos = new THREE.Vector3(8, 14, 16);
    const targetLookAt = new THREE.Vector3(0, 0, -3);

    camera.position.lerp(targetPos, 0.02);
    const currentLookAt = new THREE.Vector3();
    camera.getWorldDirection(currentLookAt);
    camera.lookAt(targetLookAt);
  });

  return null;
};

// ── Railway World (inside Canvas) ──
const RailwayWorld: React.FC = () => {
  const stations = useRailwayStore((s) => s.stations);
  const tracks = useRailwayStore((s) => s.tracks);
  const junctions = useRailwayStore((s) => s.junctions);
  const signals = useRailwayStore((s) => s.signals);
  const phase = useRailwayStore((s) => s.phase);
  const blueTrain = useRailwayStore((s) => s.blueTrain);
  const redTrain = useRailwayStore((s) => s.redTrain);

  return (
    <>
      {/* ── Lighting ── */}
      <ambientLight intensity={0.5} color="#fef3c7" />
      <directionalLight
        position={[15, 20, 10]}
        intensity={1.2}
        color="#fffbeb"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={60}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <directionalLight position={[-8, 12, -5]} intensity={0.3} color="#bfdbfe" />

      {/* Sky hemisphere */}
      <hemisphereLight args={['#87ceeb', '#86b85c', 0.4]} />

      {/* ── Ground & Environment ── */}
      <GroundPlane />
      <Mountains />

      {/* ── Hills ── */}
      <Hill position={[-12, 0, -8]} scale={[3, 1.5, 3]} color="#7ec87e" />
      <Hill position={[15, 0, -12]} scale={[4, 2, 3.5]} color="#6db86d" />
      <Hill position={[-8, 0, 12]} scale={[2.5, 1, 2.5]} color="#8ed88e" />
      <Hill position={[12, 0, 10]} scale={[3, 1.2, 2.8]} color="#7ec87e" />

      {/* ── Trees ── */}
      {/* Forest clusters */}
      <Tree position={[-6, 0, -6]} variant="pine" scale={1.2} />
      <Tree position={[-7, 0, -5]} variant="oak" />
      <Tree position={[-5.5, 0, -7]} variant="pine" scale={0.9} />
      <Tree position={[-8, 0, -4]} variant="bush" scale={1.3} />

      <Tree position={[10, 0, -8]} variant="oak" scale={1.1} />
      <Tree position={[11, 0, -9]} variant="pine" />
      <Tree position={[9, 0, -7]} variant="bush" />

      <Tree position={[-4, 0, 8]} variant="pine" scale={1.3} />
      <Tree position={[-3, 0, 9]} variant="oak" scale={0.8} />
      <Tree position={[-5, 0, 7]} variant="pine" />

      <Tree position={[8, 0, 6]} variant="oak" scale={1.2} />
      <Tree position={[9, 0, 7]} variant="pine" scale={0.9} />
      <Tree position={[7, 0, 5]} variant="bush" scale={1.1} />

      {/* Roadside trees */}
      <Tree position={[3, 0, -4]} variant="oak" scale={0.7} />
      <Tree position={[-3, 0, -10]} variant="pine" scale={1.0} />
      <Tree position={[6, 0, -2]} variant="bush" />

      {/* ── Stations ── */}
      {Object.values(stations).map((st) => (
        <Station
          key={st.id}
          position={st.position}
          name={st.name}
          type={st.type}
          active={st.active}
        />
      ))}

      {/* ── Water Tower ── */}
      <WaterTower position={[3, 0, 2]} />

      {/* ── Signal Tower ── */}
      <SignalTower position={[-3, 0, -3]} />

      {/* ── Cargo Depot ── */}
      <CargoDepot position={[16, 0, -7]} />

      {/* ── Railway Tracks ── */}
      {Object.values(tracks).map((track) => (
        <RailwayTrack
          key={track.id}
          controlPoints={track.controlPoints}
          active={track.active}
          hasBridge={track.hasBridge}
          hasTunnel={track.hasTunnel}
        />
      ))}

      {/* ── Junction Switches ── */}
      {Object.values(junctions).map((jn) => (
        <RailwaySwitch
          key={jn.id}
          position={jn.position}
          routeA={jn.currentRoute === 'A'}
        />
      ))}

      {/* ── Railway Signals ── */}
      <RailwaySignal position={[-1, 0, -6]} state={signals['signal-north']} />
      <RailwaySignal position={[6, 0, -2]} state={signals['signal-east']} />
      <RailwaySignal position={[-2, 0, 5]} state={signals['signal-south']} />

      {/* ── Locomotives ── */}
      {(phase !== 'title') && (
        <>
          <Locomotive
            team="blue"
            trackControlPoints={
              blueTrain.currentTrackId && tracks[blueTrain.currentTrackId]
                ? tracks[blueTrain.currentTrackId].controlPoints
                : tracks['track-central-north']?.controlPoints
            }
          />
          <Locomotive
            team="red"
            trackControlPoints={
              redTrain.currentTrackId && tracks[redTrain.currentTrackId]
                ? tracks[redTrain.currentTrackId].controlPoints
                : tracks['track-central-east']?.controlPoints
            }
          />
        </>
      )}

      {/* ── Small details ── */}
      {/* Fence posts near central station */}
      {[-2, -1.5, -1, -0.5, 0.5, 1, 1.5, 2].map((x, i) => (
        <mesh key={`fence-${i}`} position={[x, 0.15, 1.2]}>
          <boxGeometry args={[0.04, 0.3, 0.04]} />
          <meshStandardMaterial color="#78350f" roughness={0.9} />
        </mesh>
      ))}
    </>
  );
};

// ── Main Scene Export ──
export const RailwayScene: React.FC = () => {
  return (
    <Canvas
      shadows
      camera={{ position: [8, 14, 16], fov: 45, near: 0.1, far: 200 }}
      style={{ width: '100%', height: '100%' }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
    >
      <CameraController />
      <RailwayWorld />
    </Canvas>
  );
};
