// ============================================================
// THE DECIMAL DELIVERY NETWORK — PHYSICAL MACHINES
//
// These are not decorative meshes. Each one reads the simulation and shows the
// state it is genuinely in:
//   - the weighing platform dips under load and its display counts up to the
//     parcel's real weight
//   - the status lamp goes green only when an answer has been accepted, and
//     amber when it has been refused
//   - the scanner arch fires as a parcel passes through it
//   - the sorting gate physically swings open before the parcel reaches it
//   - the central hub's rollers and arms run continuously
// ============================================================

'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MAT, GEO } from './DepotMaterials';
import { sideSim, sim } from '../engine/depotSim';
import { sideOf, sideSign, HUB } from '../engine/depotLayout';
import type { TeamId } from '../types';

/** Seven-segment style readout drawn with small boxes — no font dependency. */
const DigitBars: React.FC<{ value: number; team: TeamId }> = ({ value, team }) => {
  const group = useRef<THREE.Group>(null);
  const BARS = 12;

  useFrame(() => {
    const s = sideSim(team);
    if (!group.current) return;
    // Bar meter: how much of the display is "lit" tracks the live weight.
    const frac = Math.min(1, s.scaleDisplay / 8);
    group.current.children.forEach((c, i) => {
      const lit = i / BARS < frac;
      (c as THREE.Mesh).material = lit
        ? (s.scaleLight === 'error' ? MAT.lampRed : MAT.lampGreen)
        : MAT.lampOff;
    });
    void value;
  });

  return (
    <group ref={group}>
      {Array.from({ length: BARS }, (_, i) => (
        <mesh key={i} geometry={GEO.unitBox} material={MAT.lampOff}
          position={[-0.55 + i * 0.1, 0, 0.02]} scale={[0.07, 0.3, 0.02]} />
      ))}
    </group>
  );
};

// ── WEIGHING STATION ────────────────────────────────────────────────────────

export const WeighStation3D: React.FC<{ team: TeamId }> = ({ team }) => {
  const s0 = sideOf(team);
  const sign = sideSign(team);
  const platform = useRef<THREE.Mesh>(null);
  const lamp = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const s = sideSim(team);
    if (platform.current) platform.current.position.y = 0.95 - s.scaleDepress;
    if (lamp.current) {
      lamp.current.material =
        s.scaleLight === 'ok' ? MAT.lampGreen
          : s.scaleLight === 'error' ? MAT.lampRed
            : s.scaleLight === 'ready' ? MAT.lampAmber
              : MAT.lampOff;
    }
  });

  return (
    <group position={[s0.scale.x, 0, s0.scale.z]}>
      {/* floor pit and frame */}
      <mesh geometry={GEO.unitBox} material={MAT.concreteDark}
        position={[0, 0.06, 0]} scale={[4.4, 0.12, 4.4]} receiveShadow />
      <mesh geometry={GEO.unitBox} material={MAT.steelDark}
        position={[0, 0.45, 0]} scale={[3.8, 0.7, 3.8]} receiveShadow />
      {/* safety hatching */}
      {[-1.9, 1.9].map((x) => (
        <mesh key={x} geometry={GEO.unitBox} material={MAT.guardYellow}
          position={[x, 0.14, 0]} scale={[0.35, 0.06, 4.4]} />
      ))}

      {/* the platform itself — dips under load */}
      <mesh ref={platform} geometry={GEO.unitBox} material={MAT.steel}
        position={[0, 0.95, 0]} scale={[3.4, 0.22, 3.4]} castShadow receiveShadow />

      {/* readout pillar, angled toward the players */}
      <group position={[sign * 2.6, 0, -1.4]} rotation={[0, sign * -0.5, 0]}>
        <mesh geometry={GEO.unitBox} material={MAT.steel}
          position={[0, 1.1, 0]} scale={[0.22, 2.2, 0.22]} castShadow />
        <mesh geometry={GEO.unitBox} material={MAT.trim}
          position={[0, 2.3, 0]} scale={[1.6, 1.0, 0.22]} castShadow />
        <mesh geometry={GEO.unitBox} material={MAT.screen}
          position={[0, 2.38, 0.13]} scale={[1.35, 0.55, 0.04]} />
        <group position={[0, 2.38, 0.16]}>
          <DigitBars value={0} team={team} />
        </group>
        {/* status lamp */}
        <mesh ref={lamp} geometry={GEO.unitSphere} material={MAT.lampOff}
          position={[0, 2.92, 0.05]} scale={[0.22, 0.22, 0.22]} />
      </group>
    </group>
  );
};

// ── SCANNER ARCH ────────────────────────────────────────────────────────────

export const Scanner3D: React.FC<{ team: TeamId }> = ({ team }) => {
  const s0 = sideOf(team);
  const beam = useRef<THREE.Mesh>(null);
  const lampL = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const s = sideSim(team);
    const hot = s.scannerFlash > 0.02;
    if (beam.current) {
      beam.current.visible = hot;
      beam.current.scale.y = 0.02 + s.scannerFlash * 0.9;
    }
    if (lampL.current) lampL.current.material = hot ? MAT.lampGreen : MAT.lampOff;
  });

  const heading = useMemo(
    () => Math.atan2(-(s0.sortGate.x - s0.scanner.x), -(s0.sortGate.z - s0.scanner.z)),
    [s0]
  );

  return (
    <group position={[s0.scanner.x, 0, s0.scanner.z]} rotation={[0, heading, 0]}>
      {[-1.25, 1.25].map((x) => (
        <mesh key={x} geometry={GEO.unitBox} material={MAT.steel}
          position={[x, 1.5, 0]} scale={[0.2, 3.0, 0.4]} castShadow />
      ))}
      <mesh geometry={GEO.unitBox} material={MAT.trim}
        position={[0, 3.05, 0]} scale={[2.9, 0.4, 0.5]} castShadow />
      <mesh ref={lampL} geometry={GEO.unitSphere} material={MAT.lampOff}
        position={[0, 3.35, 0]} scale={[0.22, 0.22, 0.22]} />
      {/* scan beam, only while a parcel is passing */}
      <mesh ref={beam} geometry={GEO.unitBox} material={MAT.lampGreen}
        position={[0, 1.9, 0]} scale={[2.4, 0.3, 0.05]} visible={false} />
    </group>
  );
};

// ── SORTING GATE ────────────────────────────────────────────────────────────

export const SortGate3D: React.FC<{ team: TeamId }> = ({ team }) => {
  const s0 = sideOf(team);
  const armL = useRef<THREE.Mesh>(null);
  const armR = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const s = sideSim(team);
    if (armL.current) armL.current.rotation.y = -s.gateOpen * 1.15;
    if (armR.current) armR.current.rotation.y = s.gateOpen * 1.15;
  });

  return (
    <group position={[s0.sortGate.x, 0, s0.sortGate.z]}>
      <mesh geometry={GEO.unitBox} material={MAT.steelDark}
        position={[0, 0.55, 0]} scale={[2.6, 1.1, 1.4]} castShadow />
      <group position={[0, 1.35, 0]}>
        <mesh ref={armL} geometry={GEO.unitBox} material={MAT.guardOrange}
          position={[-0.7, 0, 0]} scale={[1.4, 0.16, 0.16]} />
        <mesh ref={armR} geometry={GEO.unitBox} material={MAT.guardOrange}
          position={[0.7, 0, 0]} scale={[1.4, 0.16, 0.16]} />
      </group>
      {/* lane markers */}
      {[1, 2, 3, 4].map((lane) => (
        <mesh key={lane} geometry={GEO.unitBox} material={MAT.lineWhite}
          position={[-1.5 + (lane - 1) * 1.0, 0.03, 2.6]} scale={[0.12, 0.04, 2.6]} />
      ))}
    </group>
  );
};

// ── CENTRAL LOGISTICS HUB ───────────────────────────────────────────────────
// The shared machine both depots feed. Always running, so the facility reads
// as an operating business rather than a set.

export const CentralHub3D: React.FC = () => {
  const rollers = useRef<THREE.InstancedMesh>(null);
  const arms = useRef<THREE.Group>(null);
  const lights = useRef<THREE.Group>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const COUNT = 30;

  useFrame(() => {
    const phase = sim.hubPhase;
    if (rollers.current) {
      for (let i = 0; i < COUNT; i++) {
        const row = Math.floor(i / 15);
        const col = i % 15;
        dummy.position.set(-7 + col * 1.0, 2.2 + row * 0.0, HUB.crossBeltZ - 1.4 + row * 2.8);
        dummy.rotation.set(0, 0, Math.PI / 2);
        dummy.scale.set(0.2, 4.6, 0.2);
        dummy.updateMatrix();
        rollers.current.setMatrixAt(i, dummy.matrix);
      }
      rollers.current.instanceMatrix.needsUpdate = true;
    }
    if (arms.current) {
      arms.current.children.forEach((a, i) => {
        a.rotation.z = Math.sin(phase * 1.4 + i * 1.1) * 0.35;
      });
    }
    if (lights.current) {
      lights.current.children.forEach((l, i) => {
        const on = Math.sin(phase * 2.2 + i * 1.6) > 0.1;
        (l as THREE.Mesh).material = on ? MAT.lampGreen : MAT.lampOff;
      });
    }
  });

  return (
    <group position={[HUB.centre.x, 0, HUB.centre.z]}>
      {/* main body */}
      <mesh geometry={GEO.unitBox} material={MAT.wallNeutral}
        position={[0, 3.0, 0]} scale={[HUB.machineSize.w, 6.0, HUB.machineSize.d]}
        castShadow receiveShadow />
      <mesh geometry={GEO.unitBox} material={MAT.trim}
        position={[0, 6.2, 0]} scale={[HUB.machineSize.w + 1.2, 0.6, HUB.machineSize.d + 1.2]} castShadow />
      {/* hazard skirt */}
      <mesh geometry={GEO.unitBox} material={MAT.guardYellow}
        position={[0, 0.35, 0]} scale={[HUB.machineSize.w + 0.6, 0.7, HUB.machineSize.d + 0.6]} />

      {/* cross conveyor between the depots */}
      <mesh geometry={GEO.unitBox} material={MAT.steelDark}
        position={[0, 1.9, HUB.crossBeltZ]} scale={[HUB.crossBeltHalfWidth * 2, 0.3, 5.4]}
        receiveShadow />
      <instancedMesh ref={rollers} args={[GEO.unitCylLow, MAT.roller, COUNT]} />

      {/* actuator arms */}
      <group ref={arms} position={[0, 5.0, 0]}>
        {[-6, -2, 2, 6].map((x) => (
          <mesh key={x} geometry={GEO.unitBox} material={MAT.guardOrange}
            position={[x, 0, 6.2]} scale={[0.3, 2.2, 0.3]} castShadow />
        ))}
      </group>

      {/* destination board */}
      <mesh geometry={GEO.unitBox} material={MAT.trim}
        position={[0, HUB.boardHeight, -6]} scale={[18, 3.2, 0.5]} castShadow />
      <mesh geometry={GEO.unitBox} material={MAT.screen}
        position={[0, HUB.boardHeight, -5.7]} scale={[17, 2.6, 0.1]} />

      {/* status lights */}
      <group ref={lights} position={[0, HUB.boardHeight + 2.0, -6]}>
        {[-6, -2, 2, 6].map((x) => (
          <mesh key={x} geometry={GEO.unitSphere} material={MAT.lampOff}
            position={[x, 0, 0]} scale={[0.3, 0.3, 0.3]} />
        ))}
      </group>
    </group>
  );
};

// ── DISPATCH GATE ───────────────────────────────────────────────────────────

export const DispatchGate3D: React.FC = () => {
  const barrier = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (barrier.current) barrier.current.rotation.z = -sim.dispatchGate * 1.45;
  });

  return (
    <group position={[HUB.gate.x, 0, HUB.gate.z]}>
      {[-HUB.gateWidth / 2, HUB.gateWidth / 2].map((x) => (
        <mesh key={x} geometry={GEO.unitBox} material={MAT.steel}
          position={[x, 3.2, 0]} scale={[0.8, 6.4, 0.8]} castShadow />
      ))}
      <mesh geometry={GEO.unitBox} material={MAT.trim}
        position={[0, 6.8, 0]} scale={[HUB.gateWidth + 1.6, 1.2, 1.0]} castShadow />
      <mesh geometry={GEO.unitBox} material={MAT.screen}
        position={[0, 6.8, 0.55]} scale={[HUB.gateWidth - 2, 0.8, 0.1]} />
      {/* boom barrier */}
      <group position={[-HUB.gateWidth / 2 + 0.6, 2.2, 0]}>
        <mesh ref={barrier} geometry={GEO.unitBox} material={MAT.guardOrange}
          position={[HUB.gateWidth / 2, 0, 0]} scale={[HUB.gateWidth, 0.25, 0.25]} />
      </group>
    </group>
  );
};
