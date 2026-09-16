// ============================================================
// THE CHOCOLATE FACTORY — SCENE ASSEMBLY
//
// One continuous world: both production lines, the shared atrium, the
// delivery boulevard and the customers all live in the same scene and the
// same camera. There are no separate screens for mixing, packaging,
// delivery or customers — the camera only ever breathes gently toward
// whatever is currently running.
//
// The simulation is stepped here on a fixed timestep so the factory runs at
// the same speed on a slow machine as on a fast one.
// ============================================================

'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { TeamId } from '../types';
import { sim, stepSim } from '../engine/factorySim';
import { sideOf } from '../engine/factoryLayout';
import {
  CentralAtrium3D, CentralProcessing3D, CustomerRow3D, Ground3D, IngredientPallets3D,
  LoadingDock3D, Surroundings3D, Warehouse3D,
} from './Buildings3D';
import {
  CoolingTunnel3D, CuttingMachine3D, LineConveyor3D, MeasuringTank3D, Mixer3D,
  MoldingMachine3D, PackagingMachine3D, QualityStation3D,
} from './Machines3D';
import { DeliveryTruck3D, Forklift3D } from './Vehicles3D';
import { FactoryOperator3D, LoaderWorker3D, QualityInspector3D, WarehouseWorker3D } from './Humans3D';

// ── FIXED-STEP SIMULATION DRIVER ────────────────────────────────────────

const STEP = 1 / 60;

const SimDriver: React.FC = () => {
  const acc = useRef(0);
  useFrame((_, delta) => {
    acc.current += Math.min(0.25, delta);
    let steps = 0;
    while (acc.current >= STEP && steps < 90) {
      stepSim(STEP);
      acc.current -= STEP;
      steps++;
    }
  }, -1);
  return null;
};

// ── CAMERA ───────────────────────────────────────────────────────────────
// A single wide shot that keeps BOTH factories on screen at all times. When
// a line is running the camera eases a little way toward the average of the
// active machines — with both teams busy that average sits in the middle, so
// neither team is ever pushed out of frame.

const BASE_POS = new THREE.Vector3(0, 45, 92);
const BASE_LOOK = new THREE.Vector3(0, 5, -7);

function activeFocus(team: TeamId): THREE.Vector3 | null {
  const s = sim[team];
  const side = sideOf(team);
  switch (s.line) {
    case 'filling': return new THREE.Vector3(side.measuringTank.x, 3, side.measuringTank.z);
    case 'mixing': return new THREE.Vector3(side.mixer.x, 3, side.mixer.z);
    case 'molding': return new THREE.Vector3(side.moldingMachine.x, 2, side.moldingMachine.z);
    case 'cooling': return new THREE.Vector3(side.coolingEntry.x, 2, (side.coolingEntry.z + side.coolingExit.z) / 2);
    case 'cutting': return new THREE.Vector3(side.cutter.x, 2, side.cutter.z);
    case 'quality_check': return new THREE.Vector3(side.qcStation.x, 2, side.qcStation.z);
    case 'packaging': return new THREE.Vector3(side.packagingMachine.x, 2, side.packagingMachine.z);
    default:
      if (s.logistics === 'outbound' || s.logistics === 'unloading') {
        return new THREE.Vector3(s.truck.pos.x, 2, s.truck.pos.z);
      }
      return null;
  }
}

const CameraDirector: React.FC = () => {
  const { camera } = useThree();
  const look = useRef(BASE_LOOK.clone());
  const focus = useRef(new THREE.Vector3());
  const tmp = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    // Average of whatever the two teams are doing right now.
    focus.current.copy(BASE_LOOK);
    const a = activeFocus('blue');
    const b = activeFocus('red');
    if (a && b) focus.current.set((a.x + b.x) / 2, 3, (a.z + b.z) / 2);
    else if (a) focus.current.set(a.x * 0.32, 3, a.z * 0.5 + BASE_LOOK.z * 0.5);
    else if (b) focus.current.set(b.x * 0.32, 3, b.z * 0.5 + BASE_LOOK.z * 0.5);

    // Never travel far: this is a breath, not a cut.
    tmp.current.copy(BASE_LOOK).lerp(focus.current, 0.45);
    look.current.lerp(tmp.current, 1 - Math.exp(-1.2 * delta));

    const drift = Math.sin(state.clock.elapsedTime * 0.12) * 1.6;
    camera.position.lerp(
      tmp.current.clone().multiplyScalar(0.08).add(BASE_POS).setX(BASE_POS.x + drift + look.current.x * 0.06),
      1 - Math.exp(-1.1 * delta)
    );
    camera.lookAt(look.current);
  });
  return null;
};

// ── LIGHTING ─────────────────────────────────────────────────────────────

const Lighting: React.FC = () => (
  <>
    <hemisphereLight args={['#fff6e6', '#b8cfa8', 0.62]} />
    <ambientLight intensity={0.34} color="#fff3e2" />
    <directionalLight
      position={[46, 72, 40]}
      intensity={1.65}
      color="#fff2dc"
      castShadow
      shadow-mapSize={[2048, 2048]}
      shadow-camera-left={-80}
      shadow-camera-right={80}
      shadow-camera-top={80}
      shadow-camera-bottom={-70}
      shadow-camera-near={1}
      shadow-camera-far={220}
      shadow-bias={-0.0006}
    />
    {/* cool fill from the opposite side so the steel reads as metal */}
    <directionalLight position={[-60, 40, -30]} intensity={0.42} color="#d8e8ff" />
  </>
);

// ── ONE TEAM'S COMPLETE PRODUCTION LINE ─────────────────────────────────

const TeamFactory3D: React.FC<{ team: TeamId }> = ({ team }) => {
  const s = sideOf(team);
  return (
    <group>
      <Warehouse3D team={team} />
      <IngredientPallets3D team={team} />
      <MeasuringTank3D team={team} />
      <Mixer3D team={team} />
      <MoldingMachine3D team={team} />
      <CoolingTunnel3D team={team} />
      <CuttingMachine3D team={team} />
      <QualityStation3D team={team} />
      <PackagingMachine3D team={team} />
      <LoadingDock3D team={team} />

      {/* belts joining one machine to the next */}
      <LineConveyor3D team={team} from={s.moldingMachine.z + 2.6} to={s.coolingEntry.z - 1} />
      <LineConveyor3D team={team} from={s.coolingExit.z + 1} to={s.cutter.z - 1.8} />
      <LineConveyor3D team={team} from={s.cutter.z + 1.8} to={s.qcStation.z - 2.3} />
      <LineConveyor3D team={team} from={s.qcStation.z + 2.3} to={s.packagingMachine.z - 1.9} />

      <Forklift3D team={team} />
      <DeliveryTruck3D team={team} />

      <FactoryOperator3D team={team} />
      <QualityInspector3D team={team} />
      <LoaderWorker3D team={team} />
      <WarehouseWorker3D team={team} />
      <WarehouseWorker3D team={team} offset={3.2} />
    </group>
  );
};

// ── SCENE ────────────────────────────────────────────────────────────────

const SceneContents: React.FC = () => (
  <>
    <SimDriver />
    <CameraDirector />
    <Lighting />
    <fog attach="fog" args={['#e8eef5', 170, 340]} />

    <Ground3D />
    <Surroundings3D />
    <CentralAtrium3D />
    <CentralProcessing3D />
    <CustomerRow3D />

    <TeamFactory3D team="blue" />
    <TeamFactory3D team="red" />
  </>
);

export const FactoryScene3D: React.FC = () => (
  <Canvas
    shadows="percentage"
    dpr={[1, 1.5]}
    gl={{ antialias: true, powerPreference: 'high-performance' }}
    camera={{ position: [BASE_POS.x, BASE_POS.y, BASE_POS.z], fov: 36, near: 1, far: 460 }}
    onCreated={({ scene, gl }) => {
      scene.background = new THREE.Color('#dbe9f6');
      gl.shadowMap.autoUpdate = true;
      gl.toneMapping = THREE.ACESFilmicToneMapping;
      gl.toneMappingExposure = 1.05;
    }}
    className="absolute inset-0"
  >
    <SceneContents />
  </Canvas>
);
