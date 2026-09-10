// ============================================================
// THE GREAT NUMBER RAILWAY — Main 3D Canvas Scene
// Extended dual-track staging layout:
// - Blue Spur (Left): Starts far in background (z=26) -> Blue Station (z=14.0) -> Signal 1 -> Signal 2 -> Switch
// - Red Spur (Right): Starts far in background (z=26) -> Red Station (z=14.0) -> Signal 1 -> Signal 2 -> Switch
// - Movement Schedule:
//   * Q1: Move from far staging (z=26) to Station platform (z=14)
//   * Q2: NO MOVE at Station -> Blow Horn & Whistle
//   * Q3: NO MOVE at Station -> Blow Horn & Signal 1 turns GREEN
//   * Q4: Move from Station to Switch Approach (z=6.5, x=±2.4) -> Signal 2 turns GREEN (zero collision, 4.8m apart)
//   * Q5: Switch flips to winner -> ONLY winner passes through junction to Destination Station (z=-52)
// ============================================================

'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useRailwayStore } from '../store/railwayStore';
import { ContinuousRailwayTrack, DynamicRailwaySignal, RailwaySwitch } from './RailwayTrack';
import { TeamTrain } from './Locomotive';
import {
  CartoonStation,
  CartoonPineTree,
  CartoonBush,
  CartoonCloud,
  StorybookGround,
  NetworkStationMarker,
} from './Environment';
import { NETWORK_STATIONS } from '../engine/challenges';

// ── Junction geometry ──
const JUNCTION: [number, number, number] = [0, 0.1, 3.5];

const BLUE_SPUR: [number, number, number][] = [
  [-8.5, 0.1, 26.0],
  [-7.0, 0.1, 18.0],
  [-5.5, 0.1, 14.0],
  [-3.8, 0.1, 9.5],
  [-2.4, 0.1, 6.5],
  JUNCTION,
];

const RED_SPUR: [number, number, number][] = [
  [8.5, 0.1, 26.0],
  [7.0, 0.1, 18.0],
  [5.5, 0.1, 14.0],
  [3.8, 0.1, 9.5],
  [2.4, 0.1, 6.5],
  JUNCTION,
];

const MAIN_TAIL: [number, number, number][] = [
  [0, 0.1, 3.5],
  [0, 0.1, -1.0],
  [-0.5, 0.1, -8.0],
  [-3.8, 0.1, -16.0],
  [-2.0, 0.1, -25.0],
  [3.0, 0.1, -34.0],
  [0, 0.1, -42.0],
  [0, 0.1, -52.0],
];

export const BLUE_ROUTE: [number, number, number][] = [...BLUE_SPUR.slice(0, 5), ...MAIN_TAIL];
export const RED_ROUTE: [number, number, number][] = [...RED_SPUR.slice(0, 5), ...MAIN_TAIL];

// ── Cinematic Camera Controller ──
const CameraController: React.FC = () => {
  const { camera } = useThree();

  const blueCurve = useMemo(() => new THREE.CatmullRomCurve3(BLUE_ROUTE.map((p) => new THREE.Vector3(...p)), false, 'catmullrom', 0.5), []);
  const redCurve = useMemo(() => new THREE.CatmullRomCurve3(RED_ROUTE.map((p) => new THREE.Vector3(...p)), false, 'catmullrom', 0.5), []);

  const camPos = useMemo(() => new THREE.Vector3(), []);
  const camLook = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const s = useRailwayStore.getState();
    const phase = s.phase;
    const step = s.showdownStep;
    const route = s.activeRoute;

    // Default: symmetric establishing shot of both dual spurs & the switch
    camPos.set(0, 7.5, 21.0);
    camLook.set(0, 1.2, 4.5);

    if (phase === 'showdown' && (step === 'switching' || step === 'signal-yellow' || step === 'signal-green' || step === 'quiet')) {
      // Emphasise the junction switch & the deciding signals
      camPos.set(0.2, 4.4, 12.0);
      camLook.set(0, 0.9, 4.0);
    } else if ((phase === 'showdown' && step === 'departing') || phase === 'winner-reveal') {
      // Chase the winning train down the line
      const curve = route === 'red' ? redCurve : blueCurve;
      const anim = route === 'red' ? s.redTrain : s.blueTrain;
      const t = Math.min(Math.max(anim.progress, 0), 0.999);
      const p = curve.getPointAt(t);
      camPos.set(p.x + 4.8, p.y + 3.6, p.z + 6.4);
      camLook.set(p.x, p.y + 0.6, p.z);
    } else if (phase === 'round-intro') {
      camPos.set(0, 6.8, 19.5);
      camLook.set(0, 1.1, 5.0);
    }

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

// ── 3D World Composition ──
const RailwayWorld: React.FC = () => {
  const signal1Blue = useRailwayStore((s) => s.signal1Blue);
  const signal2Blue = useRailwayStore((s) => s.signal2Blue);
  const signal1Red = useRailwayStore((s) => s.signal1Red);
  const signal2Red = useRailwayStore((s) => s.signal2Red);
  const switchTarget = useRailwayStore((s) => s.switchTarget);
  const unlocked = useRailwayStore((s) => s.unlockedStationIds);

  return (
    <>
      <ambientLight intensity={0.88} color="#fffbeb" />
      <directionalLight position={[16, 26, 16]} intensity={1.45} color="#fffdf5" castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
      <directionalLight position={[-12, 16, -10]} intensity={0.45} color="#bae6fd" />
      <hemisphereLight args={['#38bdf8', '#65a30d', 0.55]} />

      <StorybookGround />

      <CartoonCloud position={[-18, 14, -20]} speed={0.8} scale={1.2} />
      <CartoonCloud position={[8, 16, -30]} speed={0.5} scale={1.4} />
      <CartoonCloud position={[22, 13, -10]} speed={0.6} scale={1.0} />
      <CartoonCloud position={[-8, 15, 8]} speed={0.7} scale={1.1} />

      {/* ── 2 STATIONS: One on each railway track ── */}
      {/* 1. Blue Team Station on Blue Spur */}
      <CartoonStation
        position={[-8.2, 0, 14.0]}
        rotation={[0, 0.2, 0]}
        name="Skillizee West"
        team="blue"
        isSkillizeeJunction={true}
      />

      {/* 2. Red Team Station on Red Spur */}
      <CartoonStation
        position={[8.2, 0, 14.0]}
        rotation={[0, -0.2, 0]}
        name="Skillizee East"
        team="red"
        isSkillizeeJunction={true}
      />

      {/* 3. Highlands Terminus Destination Station at the end of merged main line */}
      <CartoonStation
        position={[-2.8, 0, -52.0]}
        rotation={[0, 0, 0]}
        name="Highlands Central"
        team="terminal"
        isSkillizeeJunction={false}
      />

      {/* Network station markers that light up as rounds are won */}
      {NETWORK_STATIONS.map((st) => (
        <NetworkStationMarker key={st.id} position={st.position} color={st.color} unlocked={unlocked.includes(st.id)} />
      ))}

      {/* ── 2-Stage Progressive Signals along each route ── */}
      {/* Blue Route Signals: S1 (Station Exit Block) & S2 (Junction Entrance Switch Guard) */}
      <DynamicRailwaySignal position={[-4.5, 0, 13.0]} signalState={signal1Blue} team="blue" rotation={[0, 0.2, 0]} label="S1" scale={0.95} />
      <DynamicRailwaySignal position={[-2.8, 0, 7.0]} signalState={signal2Blue} team="blue" rotation={[0, 0.45, 0]} label="S2" scale={0.95} />

      {/* Red Route Signals: S1 (Station Exit Block) & S2 (Junction Entrance Switch Guard) */}
      <DynamicRailwaySignal position={[4.5, 0, 13.0]} signalState={signal1Red} team="red" rotation={[0, -0.2, 0]} label="S1" scale={0.95} />
      <DynamicRailwaySignal position={[2.8, 0, 7.0]} signalState={signal2Red} team="red" rotation={[0, -0.45, 0]} label="S2" scale={0.95} />

      {/* Spur tracks + the mechanical switch + the shared main line */}
      <ContinuousRailwayTrack controlPoints={BLUE_SPUR} active />
      <ContinuousRailwayTrack controlPoints={RED_SPUR} active />
      <RailwaySwitch position={[0, 0, 3.3]} target={switchTarget} />
      <ContinuousRailwayTrack controlPoints={MAIN_TAIL} active hasBridge hasTunnel />

      {/* The two team trains, each idling on its own spur */}
      <TeamTrain team="blue" route={BLUE_ROUTE} />
      <TeamTrain team="red" route={RED_ROUTE} />

      {/* Scenery with generous track clearance */}
      <CartoonPineTree position={[-11.5, 0, 20]} scale={1.3} />
      <CartoonPineTree position={[11.5, 0, 20]} scale={1.3} />
      <CartoonPineTree position={[-9.5, 0, 6]} scale={1.2} />
      <CartoonPineTree position={[9.5, 0, 6]} scale={1.2} />
      <CartoonPineTree position={[-8.5, 0, -8]} scale={1.5} />
      <CartoonPineTree position={[8.0, 0, -6]} scale={1.3} />
      <CartoonPineTree position={[-8.5, 0, -18]} scale={1.4} />
      <CartoonPineTree position={[8.5, 0, -18]} scale={1.5} />
      <CartoonPineTree position={[-7.5, 0, -28]} scale={1.4} />
      <CartoonPineTree position={[8.0, 0, -28]} scale={1.5} />
      <CartoonPineTree position={[-6.5, 0, -38]} scale={1.4} />
      <CartoonPineTree position={[7.0, 0, -38]} scale={1.5} />
      <CartoonBush position={[-6.0, 0, 9]} scale={1.1} />
      <CartoonBush position={[6.0, 0, 9]} scale={1.1} />
      <CartoonBush position={[-6.5, 0, -12]} scale={1.3} />
      <CartoonBush position={[6.0, 0, -24]} scale={1.2} />
    </>
  );
};

export const RailwayScene: React.FC = () => {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 7.5, 21.0], fov: 44, near: 0.1, far: 200 }}
      style={{ width: '100%', height: '100%', background: 'linear-gradient(180deg, #38bdf8 0%, #7dd3fc 60%, #bae6fd 100%)' }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
    >
      <CameraController />
      <RailwayWorld />
    </Canvas>
  );
};
