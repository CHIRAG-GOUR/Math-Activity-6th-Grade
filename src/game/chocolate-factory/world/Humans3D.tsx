// ============================================================
// THE CHOCOLATE FACTORY — FACTORY STAFF
//
// Stylised but unmistakably human: head with a face, hair, torso with work
// clothing, arms with hands, legs and shoes. Proportions are deliberately
// gentle (roughly six heads tall) so the crew reads as people at a distance
// rather than as blocks.
//
// Each person owns ONE useFrame that reads the simulation directly and drives
// its own limbs, so nothing here re-renders React while the factory runs.
// ============================================================

'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { TeamId } from '../types';
import { sim } from '../engine/factorySim';
import { sideOf } from '../engine/factoryLayout';
import { GEO, MAT, teamVestMat } from './materials';
import { angleDelta, type Vec3 } from './geom';

export type Gesture = 'none' | 'operate' | 'inspect' | 'talk';

export interface PersonState {
  pos: Vec3;
  heading: number;
  moving: boolean;
  carrying: boolean;
  gesture: Gesture;
}

interface Look {
  skin: THREE.Material;
  hair: THREE.Material;
  top: THREE.Material;
  hat?: 'hardhat' | 'cap' | 'none';
  coat?: boolean;
}

/**
 * One worker. `read` is called every frame and must return the person's
 * current position/pose — normally straight out of the simulation.
 */
export const Person3D: React.FC<{ look: Look; read: () => PersonState; scale?: number }> = ({ look, read, scale = 1 }) => {
  const root = useRef<THREE.Group>(null);
  const hips = useRef<THREE.Group>(null);
  const legL = useRef<THREE.Group>(null);
  const legR = useRef<THREE.Group>(null);
  const armL = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const phase = useRef(Math.random() * 6);

  useFrame((_, delta) => {
    const s = read();
    const g = root.current;
    if (!g) return;
    g.position.set(s.pos.x, 0, s.pos.z);
    g.rotation.y += angleDelta(g.rotation.y, s.heading) * (1 - Math.exp(-9 * delta));

    phase.current += delta * (s.moving ? 8.5 : 1.5);
    const p = phase.current;
    const swing = s.moving ? 0.62 : 0.06;

    if (legL.current) legL.current.rotation.x = Math.sin(p) * swing;
    if (legR.current) legR.current.rotation.x = -Math.sin(p) * swing;
    if (hips.current) hips.current.position.y = s.moving ? Math.abs(Math.sin(p)) * 0.06 : 0;

    if (armL.current && armR.current) {
      if (s.carrying) {
        // Both arms forward, holding the load against the chest.
        armL.current.rotation.x = -1.35;
        armR.current.rotation.x = -1.35;
        armL.current.rotation.z = 0.28;
        armR.current.rotation.z = -0.28;
      } else if (s.gesture === 'operate') {
        armL.current.rotation.x = -1.1 + Math.sin(p * 0.9) * 0.16;
        armR.current.rotation.x = -0.25;
        armL.current.rotation.z = 0.1; armR.current.rotation.z = -0.1;
      } else if (s.gesture === 'inspect') {
        armL.current.rotation.x = -1.25;
        armR.current.rotation.x = -0.95 + Math.sin(p * 0.7) * 0.2;
        armL.current.rotation.z = 0.22; armR.current.rotation.z = -0.22;
      } else {
        armL.current.rotation.x = -Math.sin(p) * swing * 0.8;
        armR.current.rotation.x = Math.sin(p) * swing * 0.8;
        armL.current.rotation.z = 0.08; armR.current.rotation.z = -0.08;
      }
    }

    if (head.current) {
      head.current.rotation.y = s.gesture === 'inspect' ? Math.sin(p * 0.5) * 0.35 : Math.sin(p * 0.25) * 0.18;
      head.current.rotation.x = s.gesture === 'inspect' ? 0.25 : 0;
    }
  });

  const faceMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#1f2937', roughness: 0.6 }), []);

  return (
    <group ref={root} scale={scale}>
      <group ref={hips}>
        {/* legs */}
        <group ref={legL} position={[-0.12, 0.78, 0]}>
          <mesh geometry={GEO.box} material={MAT.trousers} position={[0, -0.36, 0]} scale={[0.19, 0.76, 0.21]} castShadow />
          <mesh geometry={GEO.box} material={MAT.shoe} position={[0, -0.76, 0.05]} scale={[0.21, 0.12, 0.34]} castShadow />
        </group>
        <group ref={legR} position={[0.12, 0.78, 0]}>
          <mesh geometry={GEO.box} material={MAT.trousers} position={[0, -0.36, 0]} scale={[0.19, 0.76, 0.21]} castShadow />
          <mesh geometry={GEO.box} material={MAT.shoe} position={[0, -0.76, 0.05]} scale={[0.21, 0.12, 0.34]} castShadow />
        </group>

        {/* torso */}
        <mesh geometry={GEO.box} material={look.top} position={[0, 1.12, 0]} scale={[0.46, 0.62, 0.26]} castShadow />
        {look.coat && (
          <mesh geometry={GEO.box} material={MAT.coatWhite} position={[0, 0.94, 0]} scale={[0.5, 0.42, 0.29]} castShadow />
        )}
        {/* hi-vis band, so roles read at a glance */}
        <mesh geometry={GEO.box} material={MAT.vestHi} position={[0, 1.2, 0.135]} scale={[0.47, 0.12, 0.02]} />
        {/* neck */}
        <mesh geometry={GEO.cylLow} material={look.skin} position={[0, 1.47, 0]} scale={[0.13, 0.1, 0.13]} />

        {/* arms */}
        <group ref={armL} position={[-0.3, 1.36, 0]}>
          <mesh geometry={GEO.box} material={look.top} position={[0, -0.24, 0]} scale={[0.15, 0.5, 0.17]} castShadow />
          <mesh geometry={GEO.sphereLow} material={look.skin} position={[0, -0.52, 0]} scale={[0.15, 0.15, 0.15]} />
        </group>
        <group ref={armR} position={[0.3, 1.36, 0]}>
          <mesh geometry={GEO.box} material={look.top} position={[0, -0.24, 0]} scale={[0.15, 0.5, 0.17]} castShadow />
          <mesh geometry={GEO.sphereLow} material={look.skin} position={[0, -0.52, 0]} scale={[0.15, 0.15, 0.15]} />
        </group>

        {/* head + face */}
        <group ref={head} position={[0, 1.62, 0]}>
          <mesh geometry={GEO.box} material={look.skin} scale={[0.3, 0.32, 0.28]} castShadow />
          {/* eyes */}
          <mesh geometry={GEO.box} material={faceMat} position={[-0.07, 0.04, -0.15]} scale={[0.05, 0.05, 0.02]} />
          <mesh geometry={GEO.box} material={faceMat} position={[0.07, 0.04, -0.15]} scale={[0.05, 0.05, 0.02]} />
          {/* mouth */}
          <mesh geometry={GEO.box} material={faceMat} position={[0, -0.08, -0.15]} scale={[0.1, 0.02, 0.02]} />
          {/* hair */}
          <mesh geometry={GEO.box} material={look.hair} position={[0, 0.15, 0.01]} scale={[0.32, 0.1, 0.3]} />
          <mesh geometry={GEO.box} material={look.hair} position={[0, 0.04, 0.14]} scale={[0.31, 0.22, 0.04]} />
          {look.hat === 'hardhat' && (
            <>
              <mesh geometry={GEO.sphereLow} material={MAT.hardHat} position={[0, 0.2, 0]} scale={[0.34, 0.26, 0.34]} castShadow />
              <mesh geometry={GEO.box} material={MAT.hardHat} position={[0, 0.13, -0.16]} scale={[0.34, 0.04, 0.14]} />
            </>
          )}
          {look.hat === 'cap' && (
            <>
              <mesh geometry={GEO.box} material={look.top} position={[0, 0.2, 0]} scale={[0.32, 0.1, 0.3]} />
              <mesh geometry={GEO.box} material={look.top} position={[0, 0.16, -0.2]} scale={[0.3, 0.03, 0.14]} />
            </>
          )}
        </group>
      </group>
    </group>
  );
};

// ── ROLE PRESETS ─────────────────────────────────────────────────────────

const looks = (team: TeamId) => ({
  operator: { skin: MAT.skin, hair: MAT.hair, top: teamVestMat(team), hat: 'hardhat' as const },
  inspector: { skin: MAT.skinDark, hair: MAT.hair, top: MAT.coatWhite, hat: 'none' as const, coat: false },
  loader: { skin: MAT.skin, hair: MAT.hairLight, top: teamVestMat(team), hat: 'cap' as const },
  warehouse: { skin: MAT.skinDark, hair: MAT.hairLight, top: MAT.vestHi, hat: 'hardhat' as const },
});

/** Stands at the mixer control panel, working the valves while a batch runs. */
export const FactoryOperator3D: React.FC<{ team: TeamId }> = ({ team }) => {
  const home = sideOf(team).operatorHome;
  const mixer = sideOf(team).mixer;
  const read = (): PersonState => {
    const s = sim[team];
    const busy = s.line === 'filling' || s.line === 'mixing' || s.line === 'molding';
    return {
      pos: home,
      heading: Math.atan2(-(mixer.x - home.x), -(mixer.z - home.z)),
      moving: false,
      carrying: false,
      gesture: busy ? 'operate' : 'none',
    };
  };
  return <Person3D look={looks(team).operator} read={read} />;
};

/** Watches the quality station and leans in when a batch is being scanned. */
export const QualityInspector3D: React.FC<{ team: TeamId }> = ({ team }) => {
  const home = sideOf(team).inspectorHome;
  const station = sideOf(team).qcStation;
  const read = (): PersonState => {
    const s = sim[team];
    return {
      pos: home,
      heading: Math.atan2(-(station.x - home.x), -(station.z - home.z)),
      moving: false,
      carrying: false,
      gesture: s.line === 'quality_check' || s.line === 'cutting' ? 'inspect' : 'none',
    };
  };
  return (
    <group>
      <Person3D look={looks(team).inspector} read={read} />
      {/* clipboard resting on the inspection desk */}
      <mesh
        geometry={GEO.box} material={MAT.wood}
        position={[home.x + (team === 'blue' ? 0.6 : -0.6), 1.02, home.z + 0.5]}
        scale={[0.34, 0.03, 0.44]} rotation={[0, 0, 0]}
      />
    </group>
  );
};

/** Carries sealed boxes from the packaging line out to the truck. */
export const LoaderWorker3D: React.FC<{ team: TeamId }> = ({ team }) => {
  const read = (): PersonState => {
    const s = sim[team];
    const w = s.loader;
    const moving = w.task === 'to_truck' || w.task === 'return';
    return { pos: w.pos, heading: w.heading, moving, carrying: w.carrying, gesture: 'none' };
  };
  const boxRef = useRef<THREE.Mesh>(null);
  useFrame(() => {
    const s = sim[team];
    if (!boxRef.current) return;
    boxRef.current.visible = s.loader.carrying;
    if (s.loader.carrying) {
      const h = s.loader.heading;
      const f = { x: -Math.sin(h), z: -Math.cos(h) };
      boxRef.current.position.set(s.loader.pos.x + f.x * 0.46, 1.06, s.loader.pos.z + f.z * 0.46);
      boxRef.current.rotation.y = h;
    }
  });
  return (
    <group>
      <Person3D look={looks(team).loader} read={read} />
      <mesh ref={boxRef} geometry={GEO.box} material={team === 'blue' ? MAT.boxBlue : MAT.boxRed}
        scale={[0.56, 0.42, 0.46]} castShadow visible={false} />
    </group>
  );
};

/** Moves pallets around the ingredient store. */
export const WarehouseWorker3D: React.FC<{ team: TeamId; offset?: number }> = ({ team, offset = 0 }) => {
  const s = sideOf(team);
  const base: Vec3 = { x: s.palletStack.x + (team === 'blue' ? 2.6 : -2.6), y: 0, z: s.palletStack.z + 1.6 + offset };
  const read = (): PersonState => ({
    pos: base,
    heading: Math.atan2(-(s.palletStack.x - base.x), -(s.palletStack.z - base.z)),
    moving: false,
    carrying: false,
    gesture: 'inspect',
  });
  return <Person3D look={looks(team).warehouse} read={read} />;
};

/** Seated driver for the forklift — simplified pose, built into the cab. */
export const SeatedDriver3D: React.FC<{ team: TeamId }> = ({ team }) => (
  <group position={[0, 0.72, 0.28]}>
    <mesh geometry={GEO.box} material={teamVestMat(team)} position={[0, 0.42, 0]} scale={[0.42, 0.5, 0.26]} castShadow />
    <mesh geometry={GEO.box} material={MAT.vestHi} position={[0, 0.46, 0.14]} scale={[0.43, 0.12, 0.02]} />
    <mesh geometry={GEO.box} material={MAT.trousers} position={[0, 0.12, -0.2]} scale={[0.36, 0.18, 0.44]} />
    <mesh geometry={GEO.box} material={MAT.skin} position={[0, 0.84, 0]} scale={[0.27, 0.29, 0.25]} castShadow />
    <mesh geometry={GEO.box} material={MAT.hair} position={[0, 0.98, 0.01]} scale={[0.29, 0.09, 0.27]} />
    <mesh geometry={GEO.sphereLow} material={MAT.hardHat} position={[0, 1.03, 0]} scale={[0.31, 0.22, 0.31]} />
    {/* arms reaching the wheel */}
    <mesh geometry={GEO.box} material={teamVestMat(team)} position={[-0.24, 0.5, -0.22]} scale={[0.13, 0.13, 0.42]} />
    <mesh geometry={GEO.box} material={teamVestMat(team)} position={[0.24, 0.5, -0.22]} scale={[0.13, 0.13, 0.42]} />
  </group>
);
