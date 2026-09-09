// ============================================================
// THE GREAT NUMBER RAILWAY — Main 3D Canvas Scene
// A wye junction: BLUE spur (left) + RED spur (right) merge at a central
// mechanical SWITCH onto the shared scenic main line to the highlands.
// Each team has its own liveried train and its own three-aspect signal.
// The camera stays on the junction during play and the showdown, then
// chases the winning train down the line to its destination.
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
const JUNCTION: [number, number, number] = [0, 0.1, 5.0];

const BLUE_SPUR: [number, number, number][] = [
  [-4.6, 0.1, 9.6], [-3.4, 0.1, 7.6], [-1.7, 0.1, 6.0], JUNCTION,
];
const RED_SPUR: [number, number, number][] = [
  [4.6, 0.1, 9.6], [3.4, 0.1, 7.6], [1.7, 0.1, 6.0], JUNCTION,
];
const MAIN_TAIL: [number, number, number][] = [
  [0, 0.1, 5.0], [0, 0.1, 1.5], [0, 0.1, -4], [-3.5, 0.1, -12],
  [-2.5, 0.1, -19], [3.2, 0.1, -26], [0, 0.1, -33], [0, 0.1, -40],
];

export const BLUE_ROUTE: [number, number, number][] = [...BLUE_SPUR.slice(0, 3), ...MAIN_TAIL];
export const RED_ROUTE: [number, number, number][] = [...RED_SPUR.slice(0, 3), ...MAIN_TAIL];

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

    // Default: symmetric establishing shot of the whole junction yard
    camPos.set(0, 5.6, 15.5);
    camLook.set(0, 0.9, 1.5);

    if (phase === 'showdown' && (step === 'switching' || step === 'signal-yellow' || step === 'signal-green' || step === 'quiet')) {
      // Emphasise the junction switch & the deciding signals
      camPos.set(0.2, 3.4, 10.5);
      camLook.set(0, 0.7, 4.6);
    } else if ((phase === 'showdown' && step === 'departing') || phase === 'winner-reveal') {
      // Chase the winning train down the line
      const curve = route === 'red' ? redCurve : blueCurve;
      const anim = route === 'red' ? s.redTrain : s.blueTrain;
      const t = Math.min(Math.max(anim.progress, 0), 0.999);
      const p = curve.getPointAt(t);
      camPos.set(p.x + 4.6, p.y + 3.4, p.z + 6.0);
      camLook.set(p.x, p.y + 0.6, p.z);
    } else if (phase === 'round-intro') {
      camPos.set(0, 5.2, 14.0);
      camLook.set(0, 0.9, 2.0);
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
      <ambientLight intensity={0.85} color="#fffbeb" />
      <directionalLight position={[14, 22, 14]} intensity={1.4} color="#fffdf5" castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
      <directionalLight position={[-10, 14, -8]} intensity={0.45} color="#bae6fd" />
      <hemisphereLight args={['#38bdf8', '#65a30d', 0.55]} />

      <StorybookGround />

      <CartoonCloud position={[-18, 14, -20]} speed={0.8} scale={1.2} />
      <CartoonCloud position={[8, 16, -30]} speed={0.5} scale={1.4} />
      <CartoonCloud position={[22, 13, -10]} speed={0.6} scale={1.0} />
      <CartoonCloud position={[-8, 15, 8]} speed={0.7} scale={1.1} />

      {/* Origin platform (front-left) & highlands terminus */}
      <CartoonStation position={[-7.4, 0, 8.5]} name="Skillizee Junction" isSkillizeeJunction />
      <CartoonStation position={[-2.6, 0, -40]} name="CCIS Junction" isSkillizeeJunction={false} />

      {/* Network station markers that light up as rounds are won */}
      {NETWORK_STATIONS.map((st) => (
        <NetworkStationMarker key={st.id} position={st.position} color={st.color} unlocked={unlocked.includes(st.id)} />
      ))}

      {/* ── 2-Stage Progressive Signals along each route ── */}
      {/* Blue Route Signals: S1 (Station Exit Block) & S2 (Junction Entrance Switch Guard) */}
      <DynamicRailwaySignal position={[-4.1, 0, 8.2]} signalState={signal1Blue} team="blue" rotation={[0, 0.35, 0]} label="S1" scale={0.95} />
      <DynamicRailwaySignal position={[-2.1, 0, 6.2]} signalState={signal2Blue} team="blue" rotation={[0, 0.55, 0]} label="S2" scale={0.95} />

      {/* Red Route Signals: S1 (Station Exit Block) & S2 (Junction Entrance Switch Guard) */}
      <DynamicRailwaySignal position={[4.1, 0, 8.2]} signalState={signal1Red} team="red" rotation={[0, -0.35, 0]} label="S1" scale={0.95} />
      <DynamicRailwaySignal position={[2.1, 0, 6.2]} signalState={signal2Red} team="red" rotation={[0, -0.55, 0]} label="S2" scale={0.95} />

      {/* Spur tracks + the mechanical switch + the shared main line */}
      <ContinuousRailwayTrack controlPoints={BLUE_SPUR} active />
      <ContinuousRailwayTrack controlPoints={RED_SPUR} active />
      <RailwaySwitch position={[0, 0, 4.6]} target={switchTarget} />
      <ContinuousRailwayTrack controlPoints={MAIN_TAIL} active hasBridge hasTunnel />

      {/* The two team trains, each idling on its own spur */}
      <TeamTrain team="blue" route={BLUE_ROUTE} />
      <TeamTrain team="red" route={RED_ROUTE} />

      {/* Scenery */}
      <CartoonPineTree position={[-6.6, 0, 3]} scale={1.2} />
      <CartoonPineTree position={[6.6, 0, 3]} scale={1.2} />
      <CartoonPineTree position={[-7.4, 0, -8]} scale={1.5} />
      <CartoonPineTree position={[6.2, 0, -5]} scale={1.2} />
      <CartoonPineTree position={[-7.5, 0, -14]} scale={1.4} />
      <CartoonPineTree position={[-8.5, 0, -20]} scale={1.6} />
      <CartoonPineTree position={[6.2, 0, -16]} scale={1.3} />
      <CartoonPineTree position={[7.0, 0, -24]} scale={1.5} />
      <CartoonPineTree position={[-5.8, 0, -30]} scale={1.4} />
      <CartoonPineTree position={[6.8, 0, -36]} scale={1.5} />
      <CartoonBush position={[-4.6, 0, 6.5]} scale={1.1} />
      <CartoonBush position={[4.6, 0, 6.5]} scale={1.1} />
      <CartoonBush position={[-4.2, 0, -22]} scale={1.3} />
      <CartoonBush position={[4.5, 0, -28]} scale={1.2} />
    </>
  );
};

export const RailwayScene: React.FC = () => {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 5.6, 15.5], fov: 44, near: 0.1, far: 200 }}
      style={{ width: '100%', height: '100%', background: 'linear-gradient(180deg, #38bdf8 0%, #7dd3fc 60%, #bae6fd 100%)' }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
    >
      <CameraController />
      <RailwayWorld />
    </Canvas>
  );
};
