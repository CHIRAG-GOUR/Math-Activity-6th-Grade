// ============================================================
// THE CHOCOLATE FACTORY — PRODUCTION MACHINERY
//
// One machine per stage of the line, each reading the simulation every frame
// and moving accordingly. Nothing here decides anything: the tank fills to
// whatever fraction the team applied, the mixer turns while the batch is
// mixing, the molds fill with exactly as many cavities as the batch earned.
// ============================================================

'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { TeamId } from '../types';
import { sim, MOLD_GRID_MAX } from '../engine/factorySim';
import { sideOf, sideSign } from '../engine/factoryLayout';
import { GEO, MAT, TEAM_HEX, teamMat } from './materials';
import { drawReadout, LiveDisplay, makeTankScale } from './canvasText';

const TANK_H = 5.2;
const TANK_R = 1.7;

// ── MEASURING TANK — the fraction made physical ─────────────────────────

export const MeasuringTank3D: React.FC<{ team: TeamId }> = ({ team }) => {
  const p = sideOf(team).measuringTank;
  const sign = sideSign(team);
  const liquid = useRef<THREE.Mesh>(null);
  const valveLamp = useRef<THREE.Mesh>(null);
  const flow = useRef<THREE.Mesh>(null);
  const readout = useMemo(() => new LiveDisplay(256, 128), []);
  const scaleTex = useMemo(() => makeTankScale(TEAM_HEX[team]), [team]);

  useFrame(() => {
    const s = sim[team];
    const fill = Math.max(0, Math.min(1, s.tankFill));

    if (liquid.current) {
      const h = Math.max(0.001, fill * (TANK_H - 0.5));
      liquid.current.scale.set(TANK_R * 1.86, h, TANK_R * 1.86);
      liquid.current.position.y = 0.55 + h / 2;
      liquid.current.visible = fill > 0.004;
    }
    // Ingredient flows down the feed pipe only while the valve is open.
    const filling = s.line === 'filling';
    if (flow.current) {
      flow.current.visible = filling;
      if (filling) {
        const t = (performance.now() % 700) / 700;
        flow.current.scale.set(0.26, 1.6, 0.26);
        flow.current.position.y = 6.5 - t * 1.2;
      }
    }
    if (valveLamp.current) {
      valveLamp.current.material = filling ? MAT.lampGreen : s.wrongFlashT > 0 ? MAT.lampRed : MAT.lampOff;
    }

    const pct = Math.round(fill * 100);
    readout.update(`${pct}`, (ctx, w, h) => drawReadout(ctx, w, h, 'TANK LEVEL', `${pct}%`, '#fbbf24'));
  });

  return (
    <group position={[p.x, 0, p.z]}>
      {/* plinth */}
      <mesh geometry={GEO.cyl} material={MAT.steelDark} position={[0, 0.28, 0]} scale={[TANK_R * 2.3, 0.56, TANK_R * 2.3]} castShadow receiveShadow />
      {/* glass body */}
      <mesh geometry={GEO.cyl} material={MAT.glass} position={[0, 0.55 + TANK_H / 2, 0]} scale={[TANK_R * 2, TANK_H, TANK_R * 2]} />
      {/* chocolate inside — height IS the fraction */}
      <mesh ref={liquid} geometry={GEO.cyl} material={MAT.chocolateLiquid} position={[0, 0.6, 0]} scale={[TANK_R * 1.86, 0.01, TANK_R * 1.86]} />
      {/* rim + lid */}
      <mesh geometry={GEO.cyl} material={MAT.steel} position={[0, 0.55 + TANK_H, 0]} scale={[TANK_R * 2.16, 0.3, TANK_R * 2.16]} castShadow />
      <mesh geometry={GEO.cyl} material={MAT.steel} position={[0, 0.7, 0]} scale={[TANK_R * 2.16, 0.26, TANK_R * 2.16]} />

      {/* fraction scale plate, facing the camera side */}
      <mesh position={[sign * -TANK_R * 1.05, 0.55 + TANK_H / 2, TANK_R * 1.02]} rotation={[0, 0, 0]}>
        <planeGeometry args={[1.5, TANK_H]} />
        <meshBasicMaterial map={scaleTex} transparent />
      </mesh>

      {/* feed pipe and valve from the warehouse side */}
      <mesh geometry={GEO.cyl} material={MAT.copper} position={[sign * -2.6, 6.4, 0]} rotation={[0, 0, Math.PI / 2]} scale={[0.34, 5.2, 0.34]} castShadow />
      <mesh geometry={GEO.cyl} material={MAT.copper} position={[0, 6.1, 0]} scale={[0.34, 0.9, 0.34]} />
      <mesh geometry={GEO.box} material={MAT.brass} position={[sign * -1.2, 6.4, 0]} scale={[0.6, 0.6, 0.6]} castShadow />
      <mesh ref={valveLamp} geometry={GEO.sphereLow} material={MAT.lampOff} position={[sign * -1.2, 6.9, 0]} scale={[0.26, 0.26, 0.26]} />
      {/* the falling ingredient stream */}
      <mesh ref={flow} geometry={GEO.cyl} material={MAT.chocolateLiquid} position={[0, 6.2, 0]} scale={[0.26, 1.6, 0.26]} visible={false} />

      {/* level readout */}
      <mesh position={[sign * 1.9, 3.4, 0.4]} rotation={[0, sign * -0.5, 0]}>
        <planeGeometry args={[1.5, 0.75]} />
        <meshBasicMaterial map={readout.texture} />
      </mesh>
      <mesh geometry={GEO.box} material={MAT.steelDark} position={[sign * 1.95, 3.4, 0.36]} rotation={[0, sign * -0.5, 0]} scale={[1.66, 0.9, 0.08]} />
    </group>
  );
};

// ── MIXER ────────────────────────────────────────────────────────────────

export const Mixer3D: React.FC<{ team: TeamId }> = ({ team }) => {
  const p = sideOf(team).mixer;
  const sign = sideSign(team);
  const blades = useRef<THREE.Group>(null);
  const beacon = useRef<THREE.Mesh>(null);
  const choc = useRef<THREE.Mesh>(null);
  const gauge = useMemo(() => new LiveDisplay(256, 128), []);
  const tempGauge = useMemo(() => new LiveDisplay(256, 128), []);

  useFrame((state) => {
    const s = sim[team];
    const mixing = s.line === 'mixing';
    if (blades.current) blades.current.rotation.y = s.mixerSpin;
    if (choc.current) {
      const amount = s.line === 'mixing' || s.line === 'molding' ? Math.min(1, s.tankTarget + 0.08) : 0;
      const h = Math.max(0.001, amount * 2.6);
      choc.current.scale.set(3.4, h, 3.4);
      choc.current.position.y = 1.5 + h / 2;
      choc.current.visible = amount > 0.01;
    }
    if (beacon.current) {
      const on = (mixing || s.wrongFlashT > 0) && Math.sin(state.clock.elapsedTime * 9) > 0;
      beacon.current.material = !on ? MAT.lampOff : s.wrongFlashT > 0 ? MAT.lampRed : MAT.lampAmber;
    }
    const temp = mixing ? 45 + Math.round(Math.sin(state.clock.elapsedTime * 2) * 2) : 32;
    tempGauge.update(`${temp}`, (ctx, w, h) => drawReadout(ctx, w, h, 'TEMPERATURE', `${temp}°C`, '#fb923c'));
    const pressure = mixing ? 2.4 : 0.8;
    gauge.update(`${pressure}`, (ctx, w, h) => drawReadout(ctx, w, h, 'PRESSURE', `${pressure.toFixed(1)} bar`, '#38bdf8'));
  });

  return (
    <group position={[p.x, 0, p.z]}>
      {/* base + motor */}
      <mesh geometry={GEO.box} material={MAT.steelDark} position={[0, 0.5, 0]} scale={[5.4, 1, 5.4]} castShadow receiveShadow />
      <mesh geometry={GEO.box} material={teamMat(team)} position={[0, 1.02, 0]} scale={[5.5, 0.14, 5.5]} />
      {/* glass mixing drum */}
      <mesh geometry={GEO.cyl} material={MAT.glass} position={[0, 2.9, 0]} scale={[3.8, 3.2, 3.8]} />
      <mesh ref={choc} geometry={GEO.cyl} material={MAT.chocolateLiquid} position={[0, 1.6, 0]} scale={[3.4, 0.01, 3.4]} />
      {/* rotating blades */}
      <group ref={blades} position={[0, 2.6, 0]}>
        <mesh geometry={GEO.cyl} material={MAT.steel} scale={[0.26, 3.4, 0.26]} />
        {[0, Math.PI / 2, Math.PI, -Math.PI / 2].map((a, i) => (
          <mesh key={i} geometry={GEO.box} material={MAT.steelLight}
            position={[Math.cos(a) * 1.3, -0.9, Math.sin(a) * 1.3]} rotation={[0, -a, 0.36]}
            scale={[2.3, 0.1, 0.62]} castShadow />
        ))}
      </group>
      {/* lid, motor housing and drive */}
      <mesh geometry={GEO.cyl} material={MAT.steel} position={[0, 4.6, 0]} scale={[4.1, 0.5, 4.1]} castShadow />
      <mesh geometry={GEO.box} material={MAT.steelDark} position={[0, 5.4, 0]} scale={[1.9, 1.3, 1.9]} castShadow />
      <mesh geometry={GEO.cyl} material={MAT.copper} position={[0, 6.2, 0]} scale={[0.7, 0.5, 0.7]} />
      <mesh ref={beacon} geometry={GEO.sphereLow} material={MAT.lampOff} position={[0, 6.6, 0]} scale={[0.4, 0.4, 0.4]} />

      {/* maintenance platform + rail */}
      <mesh geometry={GEO.box} material={MAT.steelDark} position={[sign * -3.9, 1.6, 0]} scale={[1.5, 0.12, 4.4]} castShadow />
      {[-2, 0, 2].map((z) => (
        <mesh key={z} geometry={GEO.cyl} material={MAT.steel} position={[sign * -4.5, 2.2, z]} scale={[0.09, 1.2, 0.09]} />
      ))}
      <mesh geometry={GEO.cyl} material={MAT.steel} position={[sign * -4.5, 2.78, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[0.09, 4.4, 0.09]} />
      {[0.4, 1.0].map((h, i) => (
        <mesh key={i} geometry={GEO.box} material={MAT.steelDark} position={[sign * -3.9, h, 2.3]} scale={[1.4, 0.1, 0.1]} />
      ))}

      {/* instrument panel */}
      <group position={[sign * 3.4, 1.9, 1.2]} rotation={[0, sign * -0.65, 0]}>
        <mesh geometry={GEO.box} material={MAT.steelDark} scale={[2.6, 1.9, 0.16]} castShadow />
        <mesh position={[-0.6, 0.42, 0.1]}>
          <planeGeometry args={[1.1, 0.55]} />
          <meshBasicMaterial map={tempGauge.texture} />
        </mesh>
        <mesh position={[0.6, 0.42, 0.1]}>
          <planeGeometry args={[1.1, 0.55]} />
          <meshBasicMaterial map={gauge.texture} />
        </mesh>
        {[-0.7, -0.2, 0.3, 0.8].map((x, i) => (
          <mesh key={i} geometry={GEO.cylLow} material={i % 2 ? MAT.guard : MAT.copper}
            position={[x, -0.45, 0.12]} rotation={[Math.PI / 2, 0, 0]} scale={[0.26, 0.1, 0.26]} />
        ))}
      </group>

      {/* ingredient pipes coming in from the tank side */}
      <mesh geometry={GEO.cyl} material={MAT.copper} position={[0, 5.2, sign * 0 - 5.4]} rotation={[Math.PI / 2, 0, 0]} scale={[0.36, 6.2, 0.36]} />
    </group>
  );
};

// ── MOLDING MACHINE ──────────────────────────────────────────────────────

export const MoldingMachine3D: React.FC<{ team: TeamId }> = ({ team }) => {
  const p = sideOf(team).moldingMachine;
  const pour = useRef<THREE.Mesh>(null);
  const cavities = useRef<THREE.Group>(null);

  useFrame(() => {
    const s = sim[team];
    const molding = s.line === 'molding';
    if (pour.current) pour.current.visible = molding;

    if (cavities.current) {
      const filled = Math.min(MOLD_GRID_MAX, s.moldCount);
      const done = s.line === 'cooling' || s.line === 'cutting' || s.line === 'quality_check' || s.line === 'packaging';
      cavities.current.children.forEach((child, i) => {
        const m = child as THREE.Mesh;
        const active = i < filled && (molding || done);
        m.visible = active;
        if (!active) return;
        // Cavities fill in sequence as the pour progresses.
        const share = filled <= 1 ? 1 : Math.max(0, Math.min(1, s.moldFill * filled - i));
        const h = done ? 0.24 : 0.24 * share;
        m.scale.set(0.82, Math.max(0.001, h), 0.52);
        m.position.y = 1.26 + h / 2;
      });
    }
  });

  const slots = useMemo(() => {
    const out: [number, number][] = [];
    for (let row = 0; row < 4; row++) for (let col = 0; col < 4; col++) {
      out.push([-1.5 + col * 1.0, -1.5 + row * 1.0]);
    }
    return out;
  }, []);

  return (
    <group position={[p.x, 0, p.z]}>
      <mesh geometry={GEO.box} material={MAT.steelDark} position={[0, 0.62, 0]} scale={[5.6, 1.24, 5.2]} castShadow receiveShadow />
      <mesh geometry={GEO.box} material={teamMat(team)} position={[0, 1.2, 0]} scale={[5.7, 0.1, 5.3]} />
      {/* mold tray */}
      <mesh geometry={GEO.box} material={MAT.steelLight} position={[0, 1.3, 0]} scale={[4.6, 0.16, 4.6]} castShadow />
      <group ref={cavities}>
        {slots.map(([x, z], i) => (
          <mesh key={i} geometry={GEO.box} material={MAT.chocolate} position={[x, 1.38, z]} scale={[0.82, 0.24, 0.52]} visible={false} castShadow />
        ))}
      </group>
      {/* tray walls */}
      {[[0, 2.4], [0, -2.4]].map(([x, z], i) => (
        <mesh key={i} geometry={GEO.box} material={MAT.steel} position={[x, 1.45, z]} scale={[4.8, 0.3, 0.16]} />
      ))}
      {/* gantry + pour head */}
      <mesh geometry={GEO.box} material={MAT.steel} position={[0, 3.6, 0]} scale={[0.5, 0.4, 5.2]} castShadow />
      {[-2.4, 2.4].map((z) => (
        <mesh key={z} geometry={GEO.box} material={MAT.steelDark} position={[0, 2.5, z]} scale={[0.34, 2.2, 0.34]} />
      ))}
      <mesh geometry={GEO.cone} material={MAT.copper} position={[0, 3.1, 0]} rotation={[Math.PI, 0, 0]} scale={[0.9, 0.8, 0.9]} castShadow />
      <mesh ref={pour} geometry={GEO.cyl} material={MAT.chocolateLiquid} position={[0, 2.2, 0]} scale={[0.34, 1.6, 0.34]} visible={false} />
      {/* feed pipe from the mixer */}
      <mesh geometry={GEO.cyl} material={MAT.copper} position={[0, 4.2, -3.4]} rotation={[Math.PI / 2, 0, 0]} scale={[0.36, 4.4, 0.36]} />
      <mesh geometry={GEO.cyl} material={MAT.copper} position={[0, 3.9, 0]} scale={[0.36, 0.9, 0.36]} />
    </group>
  );
};

// ── COOLING TUNNEL ───────────────────────────────────────────────────────

export const CoolingTunnel3D: React.FC<{ team: TeamId }> = ({ team }) => {
  const s = sideOf(team);
  const entry = s.coolingEntry;
  const exit = s.coolingExit;
  const midZ = (entry.z + exit.z) / 2;
  const len = exit.z - entry.z;
  const fans = useRef<THREE.Group>(null);
  const sheet = useRef<THREE.Mesh>(null);
  const display = useMemo(() => new LiveDisplay(256, 128), []);

  useFrame((_, delta) => {
    const sm = sim[team];
    if (fans.current) fans.current.children.forEach((f, i) => { f.rotation.z += delta * (2.4 + i * 0.3); });
    if (sheet.current) {
      const inTunnel = sm.line === 'cooling';
      sheet.current.visible = inTunnel;
      if (inTunnel) sheet.current.position.z = entry.z + len * sm.coolT;
    }
    const temp = sm.line === 'cooling' ? 12 : 16;
    display.update(`${temp}`, (ctx, w, h) => drawReadout(ctx, w, h, 'COOLING', `${temp}°C`, '#67e8f9'));
  });

  return (
    <group>
      {/* tunnel shell — the roof is glazed so the chocolate stays in view */}
      <mesh geometry={GEO.box} material={MAT.glass} position={[entry.x, 2.55, midZ]} scale={[3.6, 0.22, len + 0.4]} />
      {[-0.35, 0, 0.35].map((f, i) => (
        <mesh key={i} geometry={GEO.box} material={MAT.steelLight}
          position={[entry.x, 2.62, midZ + f * len]} scale={[4.4, 0.34, 0.7]} castShadow />
      ))}
      {[-1.9, 1.9].map((x) => (
        <mesh key={x} geometry={GEO.box} material={MAT.steel} position={[entry.x + x, 1.5, midZ]} scale={[0.5, 2.6, len + 1.2]} castShadow />
      ))}
      {/* frosted glass side panels */}
      {[-1.55, 1.55].map((x) => (
        <mesh key={x} geometry={GEO.box} material={MAT.glass} position={[entry.x + x, 1.7, midZ]} scale={[0.12, 1.7, len]} />
      ))}
      {/* conveyor through the middle */}
      <mesh geometry={GEO.box} material={MAT.belt} position={[entry.x, 1.02, midZ]} scale={[2.6, 0.12, len + 2.6]} receiveShadow />
      <mesh geometry={GEO.box} material={MAT.steelDark} position={[entry.x, 0.8, midZ]} scale={[2.9, 0.34, len + 2.6]} />
      {/* the chocolate sheet cooling as it travels */}
      <mesh ref={sheet} geometry={GEO.box} material={MAT.chocolate} position={[entry.x, 1.2, entry.z]} scale={[2.0, 0.22, 1.5]} castShadow visible={false} />
      {/* roof fans */}
      <group ref={fans}>
        {[-0.3, 0.35].map((f, i) => (
          <group key={i} position={[entry.x, 2.95, midZ + f * len]} rotation={[Math.PI / 2, 0, 0]}>
            <mesh geometry={GEO.cyl} material={MAT.steelDark} scale={[1.5, 0.2, 1.5]} />
            {[0, 1, 2].map((b) => (
              <mesh key={b} geometry={GEO.box} material={MAT.steelLight}
                position={[0, 0.16, 0]} rotation={[0, (b * Math.PI * 2) / 3, 0]} scale={[1.2, 0.05, 0.3]} />
            ))}
          </group>
        ))}
      </group>
      {/* temperature panel */}
      <mesh position={[entry.x + sideSign(team) * 2.4, 2.0, midZ]} rotation={[0, sideSign(team) * -Math.PI / 2, 0]}>
        <planeGeometry args={[1.4, 0.7]} />
        <meshBasicMaterial map={display.texture} />
      </mesh>
    </group>
  );
};

// ── CUTTING MACHINE ──────────────────────────────────────────────────────

export const CuttingMachine3D: React.FC<{ team: TeamId }> = ({ team }) => {
  const p = sideOf(team).cutter;
  const blade = useRef<THREE.Group>(null);
  const sheet = useRef<THREE.Mesh>(null);
  const bars = useRef<THREE.Group>(null);

  useFrame(() => {
    const s = sim[team];
    const cutting = s.line === 'cutting';
    const after = s.line === 'quality_check' || s.line === 'packaging';
    if (blade.current) {
      // Blade drops through the sheet, then lifts clear again.
      const t = cutting ? Math.sin(Math.min(1, s.cutT) * Math.PI) : 0;
      blade.current.position.y = 2.7 - t * 1.35;
    }
    if (sheet.current) sheet.current.visible = cutting && s.cutT < 0.55;
    if (bars.current) bars.current.visible = (cutting && s.cutT >= 0.55) || after;
  });

  return (
    <group position={[p.x, 0, p.z]}>
      <mesh geometry={GEO.box} material={MAT.steelDark} position={[0, 0.55, 0]} scale={[4.8, 1.1, 3.6]} castShadow receiveShadow />
      <mesh geometry={GEO.box} material={MAT.belt} position={[0, 1.14, 0]} scale={[3.0, 0.12, 4.6]} receiveShadow />
      {/* frame */}
      {[-1.9, 1.9].map((x) => (
        <mesh key={x} geometry={GEO.box} material={MAT.steel} position={[x, 2.2, 0]} scale={[0.34, 2.4, 0.5]} castShadow />
      ))}
      <mesh geometry={GEO.box} material={MAT.steel} position={[0, 3.3, 0]} scale={[4.2, 0.4, 0.6]} castShadow />
      {/* blade carriage */}
      <group ref={blade} position={[0, 2.7, 0]}>
        <mesh geometry={GEO.box} material={MAT.steelDark} scale={[3.4, 0.36, 0.34]} castShadow />
        {[-1.2, -0.4, 0.4, 1.2].map((x) => (
          <mesh key={x} geometry={GEO.box} material={MAT.steelLight} position={[x, -0.3, 0]} scale={[0.06, 0.4, 0.42]} />
        ))}
      </group>
      {/* uncut sheet vs cut bars */}
      <mesh ref={sheet} geometry={GEO.box} material={MAT.chocolate} position={[0, 1.32, 0]} scale={[2.6, 0.22, 1.6]} castShadow visible={false} />
      <group ref={bars} visible={false}>
        {[-1.0, -0.34, 0.34, 1.0].map((x) => (
          <mesh key={x} geometry={GEO.box} material={MAT.chocolate} position={[x, 1.32, 0]} scale={[0.58, 0.22, 1.6]} castShadow />
        ))}
      </group>
      <mesh geometry={GEO.box} material={teamMat(team)} position={[0, 1.02, 0]} scale={[4.9, 0.1, 3.7]} />
    </group>
  );
};

// ── QUALITY CONTROL ──────────────────────────────────────────────────────

export const QualityStation3D: React.FC<{ team: TeamId }> = ({ team }) => {
  const p = sideOf(team).qcStation;
  const sign = sideSign(team);
  const scanLight = useRef<THREE.Mesh>(null);
  const lamp = useRef<THREE.Mesh>(null);
  const display = useMemo(() => new LiveDisplay(256, 128), []);

  useFrame((state) => {
    const s = sim[team];
    const scanning = s.line === 'quality_check';
    if (scanLight.current) {
      scanLight.current.visible = scanning;
      if (scanning) scanLight.current.position.z = -1.6 + ((state.clock.elapsedTime * 3) % 1) * 3.2;
    }
    if (lamp.current) {
      lamp.current.material = !scanning
        ? MAT.lampOff
        : s.qcRework ? MAT.lampRed : s.lastBatchQuality >= 86 ? MAT.lampGreen : MAT.lampAmber;
    }
    const q = s.lastBatchQuality;
    display.update(`${q}-${s.line}`, (ctx, w, h) =>
      drawReadout(ctx, w, h, 'QUALITY', `${q}%`, q >= 86 ? '#4ade80' : q >= 60 ? '#fbbf24' : '#f87171'));
  });

  return (
    <group position={[p.x, 0, p.z]}>
      {/* conveyor through the scanner */}
      <mesh geometry={GEO.box} material={MAT.steelDark} position={[0, 0.8, 0]} scale={[2.9, 0.34, 4.6]} />
      <mesh geometry={GEO.box} material={MAT.belt} position={[0, 1.02, 0]} scale={[2.6, 0.12, 4.6]} receiveShadow />
      {/* scanner arch */}
      {[-1.5, 1.5].map((x) => (
        <mesh key={x} geometry={GEO.box} material={MAT.steelLight} position={[x, 1.9, 0]} scale={[0.34, 2.0, 1.1]} castShadow />
      ))}
      <mesh geometry={GEO.box} material={MAT.steelLight} position={[0, 2.85, 0]} scale={[3.3, 0.36, 1.1]} castShadow />
      <mesh geometry={GEO.box} material={MAT.screen} position={[0, 2.62, 0]} scale={[2.8, 0.14, 0.9]} />
      {/* sweeping inspection light */}
      <mesh ref={scanLight} position={[0, 1.2, 0]} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
        <planeGeometry args={[2.4, 0.3]} />
        <meshBasicMaterial color="#67e8f9" transparent opacity={0.65} />
      </mesh>
      <mesh ref={lamp} geometry={GEO.sphereLow} material={MAT.lampOff} position={[0, 3.15, 0]} scale={[0.3, 0.3, 0.3]} />
      {/* inspector desk + readout */}
      <mesh geometry={GEO.box} material={MAT.wood} position={[sign * -2.6, 0.9, 0.5]} scale={[1.3, 0.12, 1.9]} castShadow />
      {[[-0.5, -0.7], [-0.5, 0.7]].map(([dx, dz], i) => (
        <mesh key={i} geometry={GEO.box} material={MAT.steelDark} position={[sign * -2.6 + dx, 0.45, 0.5 + dz]} scale={[0.1, 0.9, 0.1]} />
      ))}
      <mesh position={[sign * -2.55, 1.75, 0.5]} rotation={[0, sign * Math.PI / 2, 0]}>
        <planeGeometry args={[1.4, 0.7]} />
        <meshBasicMaterial map={display.texture} />
      </mesh>
      <mesh geometry={GEO.box} material={MAT.steelDark} position={[sign * -2.5, 1.75, 0.5]} rotation={[0, sign * Math.PI / 2, 0]} scale={[1.55, 0.85, 0.08]} />
    </group>
  );
};

// ── PACKAGING LINE ───────────────────────────────────────────────────────

export const PackagingMachine3D: React.FC<{ team: TeamId }> = ({ team }) => {
  const p = sideOf(team).packagingMachine;
  const exit = sideOf(team).packagingExit;
  const sign = sideSign(team);
  const wrapArm = useRef<THREE.Group>(null);
  const sealer = useRef<THREE.Mesh>(null);
  const stack = useRef<THREE.Group>(null);

  useFrame((state) => {
    const s = sim[team];
    const packing = s.line === 'packaging';
    if (wrapArm.current) {
      wrapArm.current.rotation.z = packing ? Math.sin(state.clock.elapsedTime * 7) * 0.5 : 0;
    }
    if (sealer.current) {
      sealer.current.position.y = packing ? 2.1 - Math.abs(Math.sin(state.clock.elapsedTime * 5)) * 0.5 : 2.1;
    }
    if (stack.current) {
      const boxes = Math.min(6, s.boxesAtDock);
      stack.current.children.forEach((c, i) => { c.visible = i < boxes; });
    }
  });

  return (
    <group>
      <group position={[p.x, 0, p.z]}>
        {/* machine body */}
        <mesh geometry={GEO.box} material={MAT.steelLight} position={[0, 1.4, 0]} scale={[4.6, 2.8, 3.8]} castShadow receiveShadow />
        <mesh geometry={GEO.box} material={teamMat(team)} position={[0, 2.85, 0]} scale={[4.7, 0.2, 3.9]} />
        <mesh geometry={GEO.box} material={MAT.glass} position={[sign * 2.32, 1.6, 0]} scale={[0.08, 1.5, 2.6]} />
        {/* wrapping arm */}
        <group ref={wrapArm} position={[0, 2.5, 1.2]}>
          <mesh geometry={GEO.box} material={MAT.steel} position={[0, -0.4, 0]} scale={[0.22, 1.0, 0.22]} castShadow />
          <mesh geometry={GEO.box} material={MAT.wrapperGold} position={[0, -0.95, 0]} scale={[0.8, 0.2, 0.6]} />
        </group>
        {/* sealing head */}
        <mesh ref={sealer} geometry={GEO.box} material={MAT.steelDark} position={[0, 2.1, -1.1]} scale={[1.6, 0.3, 0.8]} castShadow />
        {/* output conveyor to the dock */}
        <mesh geometry={GEO.box} material={MAT.belt} position={[sign * 2.8, 1.0, 1.6]} rotation={[0, sign * 0.5, 0]} scale={[2.6, 0.12, 1.4]} receiveShadow />
        <mesh geometry={GEO.box} material={MAT.steelDark} position={[sign * 2.8, 0.8, 1.6]} rotation={[0, sign * 0.5, 0]} scale={[2.7, 0.3, 1.5]} />
      </group>

      {/* sealed boxes waiting to be carried to the truck */}
      <group ref={stack} position={[exit.x, 0, exit.z]}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <mesh key={i} geometry={GEO.box}
            material={team === 'blue' ? MAT.boxBlue : MAT.boxRed}
            position={[(i % 2) * 0.72 - 0.36, 0.3 + Math.floor(i / 2) * 0.56, 0]}
            scale={[0.66, 0.52, 0.56]} castShadow visible={false} />
        ))}
      </group>
    </group>
  );
};

// ── CONVEYOR LINKS BETWEEN STATIONS ─────────────────────────────────────

export const LineConveyor3D: React.FC<{ team: TeamId; from: number; to: number; running?: boolean }> = ({ team, from, to, running = true }) => {
  const x = sideOf(team).mixer.x;
  const mid = (from + to) / 2;
  const len = Math.abs(to - from);
  const chevrons = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!chevrons.current || !running) return;
    chevrons.current.children.forEach((c) => {
      c.position.z += delta * 2.2;
      if (c.position.z > len / 2) c.position.z -= len;
    });
  });

  const count = Math.max(2, Math.floor(len / 1.6));
  return (
    <group position={[x, 0, mid]}>
      <mesh geometry={GEO.box} material={MAT.steelDark} position={[0, 0.8, 0]} scale={[2.5, 0.3, len]} receiveShadow />
      <mesh geometry={GEO.box} material={MAT.belt} position={[0, 1.0, 0]} scale={[2.2, 0.1, len]} receiveShadow />
      {[-1.15, 1.15].map((sx) => (
        <mesh key={sx} geometry={GEO.box} material={MAT.steel} position={[sx, 1.06, 0]} scale={[0.12, 0.22, len]} />
      ))}
      <group ref={chevrons}>
        {Array.from({ length: count }, (_, i) => (
          <mesh key={i} geometry={GEO.box} material={MAT.steelLight}
            position={[0, 1.07, -len / 2 + i * (len / count)]} scale={[1.5, 0.03, 0.18]} />
        ))}
      </group>
      {Array.from({ length: Math.max(2, Math.round(len / 4)) }, (_, i) => (
        <mesh key={i} geometry={GEO.box} material={MAT.steelDark}
          position={[0, 0.42, -len / 2 + 1 + i * 4]} scale={[2.0, 0.76, 0.18]} />
      ))}
    </group>
  );
};
