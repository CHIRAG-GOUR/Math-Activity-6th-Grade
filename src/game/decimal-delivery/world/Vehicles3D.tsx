// ============================================================
// THE DECIMAL DELIVERY NETWORK — VEHICLES
//
// Delivery trucks and forklifts. Both read the simulation every frame and hold
// no position of their own.
//
// THE TRUCK IS A DROPSIDE FLATBED. A closed box van loaded from the rear would
// hide its cargo from the playing camera, and the brief is explicit that a
// student must be able to glance at a truck and see how full it is (sections
// 96-98). The low rails keep every delivered parcel in view; a tarp is drawn
// over the load only at dispatch. It starts the game completely empty.
// ============================================================

'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GEO, MAT } from './DepotMaterials';
import { sideSim, type ForkliftRole } from '../engine/depotSim';
import type { TeamId } from '../types';
import { makeSign } from './canvasText';

// ── DELIVERY TRUCK ──────────────────────────────────────────────────────────
// Local frame: cab toward -Z (the direction of travel), bed toward +Z.

export const Truck3D: React.FC<{ team: TeamId }> = ({ team }) => {
  const root = useRef<THREE.Group>(null);
  const wheels = useRef<THREE.Group>(null);
  const tarp = useRef<THREE.Group>(null);
  const lamps = useRef<THREE.Group>(null);
  const cabShake = useRef<THREE.Group>(null);
  const isBlue = team === 'blue';
  const paint = isBlue ? MAT.truckBlue : MAT.truckRed;

  const mats = useMemo(() => ({
    branding: new THREE.MeshStandardMaterial({
      map: makeSign(isBlue ? 'BLUE LOGISTICS' : 'RED LOGISTICS', 'DECIMAL DELIVERY NETWORK',
        isBlue ? '#1e63c8' : '#c62f28'),
      roughness: 0.55,
    }),
    tarp: new THREE.MeshStandardMaterial({
      color: isBlue ? '#2a6fd6' : '#d23a33', roughness: 0.8, side: THREE.DoubleSide,
    }),
    lampOn: new THREE.MeshStandardMaterial({
      color: '#fff6d8', emissive: '#ffe7a3', emissiveIntensity: 1.6, roughness: 0.3,
    }),
    tail: new THREE.MeshStandardMaterial({
      color: '#ef4444', emissive: '#b91c1c', emissiveIntensity: 1.2, roughness: 0.3,
    }),
  }), [isBlue]);

  useFrame((state) => {
    const s = sideSim(team);
    if (root.current) {
      root.current.position.set(s.truckPos.x, 0, s.truckPos.z);
      root.current.rotation.y = s.truckHeading;
    }
    if (wheels.current) wheels.current.children.forEach((w) => { w.rotation.x = s.wheelSpin; });

    if (lamps.current) {
      lamps.current.children.forEach((l) => {
        (l as THREE.Mesh).material = s.truckLights ? mats.lampOn : MAT.lampOff;
      });
    }
    // Idle engine vibration once it has started.
    if (cabShake.current) {
      cabShake.current.position.y = s.truckLights ? Math.sin(state.clock.elapsedTime * 55) * 0.012 : 0;
    }
  });

  // The tarp rolls smoothly forward over the load when the truck is closed for
  // dispatch (truckTarp 1 = rolled back, 0 = fully covering).
  const cover = useRef(0);
  useFrame((_, dt) => {
    const want = 1 - sideSim(team).truckTarp;
    cover.current += (want - cover.current) * (1 - Math.exp(-2.2 * dt));
    if (tarp.current) {
      tarp.current.scale.z = Math.max(0.02, cover.current);
      tarp.current.visible = cover.current > 0.03;
    }
  });

  return (
    <group ref={root}>
      <group ref={cabShake}>
        {/* ── cab ── */}
        <mesh geometry={GEO.unitBox} material={paint}
          position={[0, 1.75, -2.45]} scale={[2.55, 2.1, 2.1]} castShadow receiveShadow />
        <mesh geometry={GEO.unitBox} material={MAT.glass}
          position={[0, 2.25, -3.52]} scale={[2.25, 0.95, 0.08]} />
        {[-1.29, 1.29].map((x) => (
          <mesh key={x} geometry={GEO.unitBox} material={MAT.glass}
            position={[x, 2.3, -2.6]} scale={[0.04, 0.8, 1.1]} />
        ))}
        {/* branding on both cab doors */}
        {[-1.3, 1.3].map((x) => (
          <mesh key={`b${x}`} geometry={GEO.plane} material={mats.branding}
            position={[x, 1.35, -2.25]} rotation={[0, x < 0 ? -Math.PI / 2 : Math.PI / 2, 0]}
            scale={[1.9, 0.6, 1]} />
        ))}
        <mesh geometry={GEO.unitBox} material={MAT.trim}
          position={[0, 0.75, -3.55]} scale={[2.45, 0.35, 0.1]} />
        <group ref={lamps}>
          {[-0.95, 0.95].map((x) => (
            <mesh key={x} geometry={GEO.unitBox} material={MAT.lampOff}
              position={[x, 1.0, -3.56]} scale={[0.45, 0.22, 0.06]} />
          ))}
        </group>
      </group>

      {/* ── chassis & flatbed ── */}
      <mesh geometry={GEO.unitBox} material={MAT.trim}
        position={[0, 0.72, 0.6]} scale={[2.2, 0.35, 8.2]} />
      <mesh geometry={GEO.unitBox} material={MAT.steelDark}
        position={[0, 1.13, 2.0]} scale={[2.6, 0.24, 4.6]} castShadow receiveShadow />
      {/* dropside rails: low enough that the load stays visible */}
      {[-1.28, 1.28].map((x) => (
        <mesh key={x} geometry={GEO.unitBox} material={paint}
          position={[x, 1.45, 2.0]} scale={[0.07, 0.42, 4.6]} castShadow />
      ))}
      <mesh geometry={GEO.unitBox} material={paint}
        position={[0, 1.45, 4.28]} scale={[2.6, 0.42, 0.07]} castShadow />
      <mesh geometry={GEO.unitBox} material={paint}
        position={[0, 1.7, -0.3]} scale={[2.6, 0.95, 0.12]} castShadow />
      {/* tarp hoops */}
      {[0.1, 2.0, 3.9].map((z) => (
        <mesh key={z} geometry={GEO.unitBox} material={MAT.steel}
          position={[0, 2.75, z]} scale={[2.6, 0.06, 0.06]} />
      ))}
      {/* tarp, drawn over the load at dispatch */}
      <group ref={tarp} position={[0, 2.78, -0.25]} visible={false}>
        <mesh geometry={GEO.unitBox} material={mats.tarp}
          position={[0, 0, 2.3]} scale={[2.66, 0.05, 4.6]} castShadow />
      </group>
      {/* tail lights */}
      {[-1.05, 1.05].map((x) => (
        <mesh key={`t${x}`} geometry={GEO.unitBox} material={mats.tail}
          position={[x, 0.95, 4.33]} scale={[0.32, 0.16, 0.05]} />
      ))}

      {/* ── wheels ── */}
      <group ref={wheels}>
        {[[-1.15, -2.55], [1.15, -2.55], [-1.15, 1.6], [1.15, 1.6], [-1.15, 3.1], [1.15, 3.1]].map(
          ([x, z], i) => (
            <group key={i} position={[x, 0.55, z]}>
              <mesh geometry={GEO.unitCyl} material={MAT.tyre}
                rotation={[0, 0, Math.PI / 2]} scale={[1.1, 0.38, 1.1]} castShadow />
              <mesh geometry={GEO.unitCyl} material={MAT.chrome}
                rotation={[0, 0, Math.PI / 2]} scale={[0.55, 0.4, 0.55]} />
            </group>
          )
        )}
      </group>
    </group>
  );
};

// ── FORKLIFT ────────────────────────────────────────────────────────────────
// Local frame: forks toward -Z. The fork carriage sits so the top of the forks
// is at `forkY + 0.5`, matching where the simulation places a lifted parcel.

export const Forklift3D: React.FC<{ team: TeamId; role: ForkliftRole }> = ({ team, role }) => {
  const root = useRef<THREE.Group>(null);
  const carriage = useRef<THREE.Group>(null);
  const wheels = useRef<THREE.Group>(null);
  const beacon = useRef<THREE.Mesh>(null);
  const lastPos = useRef<{ x: number; z: number } | null>(null);

  const beaconMats = useMemo(() => ({
    on: new THREE.MeshStandardMaterial({ color: '#ffb020', emissive: '#ff8a00', emissiveIntensity: 1.8 }),
  }), []);

  useFrame((state) => {
    const fl = sideSim(team).forklifts[role];
    if (root.current) {
      root.current.position.set(fl.pos.x, 0, fl.pos.z);
      root.current.rotation.y = fl.heading;
    }
    if (carriage.current) carriage.current.position.y = fl.forkY + 0.42;

    // Wheels turn by the distance actually travelled.
    const prev = lastPos.current;
    const moved = prev ? Math.hypot(fl.pos.x - prev.x, fl.pos.z - prev.z) : 0;
    lastPos.current = { x: fl.pos.x, z: fl.pos.z };
    if (wheels.current) wheels.current.children.forEach((w) => { w.rotation.x += (fl.reversing ? 1 : -1) * moved / 0.32; });

    // Warning beacon flashes while working a job.
    if (beacon.current) {
      const busy = fl.task !== 'parked';
      beacon.current.material = busy && Math.sin(state.clock.elapsedTime * 9) > 0 ? beaconMats.on : MAT.lampOff;
    }
  });

  return (
    <group ref={root}>
      <mesh geometry={GEO.unitBox} material={MAT.guardOrange}
        position={[0, 0.72, 0.5]} scale={[1.35, 0.95, 1.85]} castShadow receiveShadow />
      <mesh geometry={GEO.unitBox} material={MAT.trim}
        position={[0, 0.85, 1.5]} scale={[1.35, 0.85, 0.3]} castShadow />
      {/* overhead guard */}
      <mesh geometry={GEO.unitBox} material={MAT.steelDark}
        position={[0, 2.25, 0.5]} scale={[1.3, 0.08, 1.45]} castShadow />
      {[[-0.58, -0.1], [0.58, -0.1], [-0.58, 1.1], [0.58, 1.1]].map(([x, z], i) => (
        <mesh key={i} geometry={GEO.unitBox} material={MAT.steelDark}
          position={[x, 1.65, z]} scale={[0.07, 1.2, 0.07]} />
      ))}
      <mesh geometry={GEO.unitBox} material={MAT.trim}
        position={[0, 1.25, 0.85]} scale={[0.6, 0.55, 0.18]} />
      <mesh ref={beacon} geometry={GEO.unitSphere} material={MAT.lampOff}
        position={[0, 2.38, 0.9]} scale={[0.16, 0.16, 0.16]} />
      {/* mast */}
      {[-0.4, 0.4].map((x) => (
        <mesh key={x} geometry={GEO.unitBox} material={MAT.steel}
          position={[x, 1.45, -0.55]} scale={[0.1, 2.7, 0.12]} castShadow />
      ))}
      {/* fork carriage */}
      <group ref={carriage} position={[0, 0.62, 0]}>
        <mesh geometry={GEO.unitBox} material={MAT.steelDark}
          position={[0, 0.25, -0.66]} scale={[1.0, 0.5, 0.08]} />
        {[-0.3, 0.3].map((x) => (
          <mesh key={x} geometry={GEO.unitBox} material={MAT.steel}
            position={[x, 0.04, -1.45]} scale={[0.12, 0.06, 1.55]} castShadow />
        ))}
      </group>
      <group ref={wheels}>
        {[[-0.6, -0.15], [0.6, -0.15], [-0.52, 1.2], [0.52, 1.2]].map(([x, z], i) => (
          <mesh key={i} geometry={GEO.unitCyl} material={MAT.tyre}
            position={[x, 0.32, z]} rotation={[0, 0, Math.PI / 2]} scale={[0.64, 0.26, 0.64]} castShadow />
        ))}
      </group>
    </group>
  );
};
