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
import { runningStep, sim, stepSim } from '../engine/factorySim';
import { sideOf, sideSign } from '../engine/factoryLayout';
import {
  CentralAtrium3D, CentralProcessing3D, CustomerRow3D, Ground3D, IngredientPallets3D,
  LoadingDock3D, Surroundings3D, Warehouse3D,
} from './Buildings3D';
import {
  CoolingTunnel3D, CuttingMachine3D, LineConveyor3D, MeasuringTank3D, Mixer3D,
  MoldingMachine3D, PackagingMachine3D, QualityStation3D,
} from './Machines3D';
import { DeliveryTruck3D, Forklift3D } from './Vehicles3D';
import { Cart3D, TeamCrew3D } from './Humans3D';
import { CrewDebug3D, npcDebugEnabled } from './CrewDebug3D';

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
// A wide establishing shot that gently breathes when nothing needs it. The
// moment a worker actually starts a machine, tips cocoa into the tank, or
// starts loading the truck, the camera cuts in for a close look at that
// team's line and holds there for several seconds — so a step is something
// the class watches happen, not a number that changes off-screen. Both
// teams work at once, so events queue one at a time: whichever team just
// did something new gets the next look, and neither team is ever left
// waiting forever off-camera.

const BASE_POS = new THREE.Vector3(0, 45, 92);
const BASE_LOOK = new THREE.Vector3(0, 5, -7);

/** How long a close-up holds once the camera has cut to it. */
const HOLD_SECONDS = 7;
const EASE_IN_RATE = 3.2;
const EASE_OUT_RATE = 1.3;

type ShotKind = 'ingredients' | 'mixing' | 'molding' | 'cooling' | 'packaging' | 'loading';
interface CamShot { team: TeamId; pos: THREE.Vector3; look: THREE.Vector3; chase?: boolean; }

/** How long the chase-cam keeps renewing itself while the victory truck is
 *  still actually driving — a rolling window, not a fixed hold. */
const CHASE_RENEW = 2;

/** Trails behind the winner's truck as it pulls out and heads for the
 *  highway — recomputed every frame from the truck's own live heading. */
function chaseShot(team: TeamId): CamShot {
  const t = sim[team].truck;
  const back = { x: Math.sin(t.heading) * 11, z: Math.cos(t.heading) * 11 };
  return {
    team, chase: true,
    pos: new THREE.Vector3(t.pos.x + back.x, 4.6, t.pos.z + back.z),
    look: new THREE.Vector3(t.pos.x, 1.6, t.pos.z),
  };
}

function anchorFor(team: TeamId, kind: ShotKind): { x: number; z: number } {
  const s = sideOf(team);
  switch (kind) {
    case 'ingredients': return s.tipPoint;
    case 'mixing': return s.mixer;
    case 'molding': return s.moldingMachine;
    case 'cooling': return { x: s.cutter.x, z: (s.coolingEntry.z + s.cutter.z) / 2 };
    case 'packaging': return s.packagingMachine;
    case 'loading': return s.loadingDock;
  }
}

/** A close, angled shot pulled toward the centre aisle, so the machine and
 *  whoever is working it both read clearly on either side of the factory. */
function closeShot(team: TeamId, kind: ShotKind): CamShot {
  const p = anchorFor(team, kind);
  const sign = sideSign(team);
  return {
    team,
    pos: new THREE.Vector3(p.x - sign * 6.5, 5.3, p.z + 8.5),
    look: new THREE.Vector3(p.x, 1.5, p.z - 1),
  };
}

const CameraDirector: React.FC = () => {
  const { camera } = useThree();
  const camPos = useRef(BASE_POS.clone());
  const camLook = useRef(BASE_LOOK.clone());

  // What each team was doing last frame — a shot fires once on a NEW event,
  // not every frame the same machine happens to still be running.
  const prevRunning = useRef<Record<TeamId, string | null>>({ blue: null, red: null });
  const prevTip = useRef<Record<TeamId, number>>({ blue: 0, red: 0 });
  const prevLog = useRef<Record<TeamId, string>>({ blue: 'idle', red: 'idle' });

  const current = useRef<{ shot: CamShot; until: number } | null>(null);
  const queued = useRef<CamShot | null>(null);

  const offer = (team: TeamId, kind: ShotKind, now: number) => {
    const shot = closeShot(team, kind);
    if (current.current?.shot.team === team) {
      // Already watching this team — stay put, just look at their new job
      // and give them the full hold again.
      current.current = { shot, until: now + HOLD_SECONDS };
    } else {
      // One team waits its turn; the newest event wins that single slot.
      queued.current = shot;
    }
  };

  useFrame((state, delta) => {
    const now = state.clock.getElapsedTime();

    for (const team of ['blue', 'red'] as TeamId[]) {
      const side = sim[team];
      const run = runningStep(team);
      if (run && run !== 'ingredients' && run !== prevRunning.current[team]) offer(team, run, now);
      prevRunning.current[team] = run;

      // The cocoa step's own moment is a loader (or the forklift) actually
      // tipping a load in — not the instant the tank starts waiting for one.
      if (side.tipPour > 0.5 && prevTip.current[team] <= 0.5) offer(team, 'ingredients', now);
      prevTip.current[team] = side.tipPour;

      const log = side.logistics;
      if (log !== prevLog.current[team] &&
        (log === 'cart_loading' || log === 'truck_loading' || log === 'fork_unload')) {
        offer(team, 'loading', now);
      }
      prevLog.current[team] = log;

      // The winner's victory lap is the whole point of the finale — it takes
      // the spotlight outright and keeps it for as long as the truck is
      // actually moving, however long that ends up taking.
      if (side.celebrating && log === 'truck_out') {
        current.current = { shot: chaseShot(team), until: now + CHASE_RENEW };
        queued.current = null;
      }
    }

    // Advance the queue once the current close-up has had its time.
    if (!current.current || now >= current.current.until) {
      if (queued.current) {
        current.current = { shot: queued.current, until: now + HOLD_SECONDS };
        queued.current = null;
      } else {
        current.current = null;
      }
    }

    let wantPos: THREE.Vector3;
    let wantLook: THREE.Vector3;
    let rate: number;
    if (current.current) {
      wantPos = current.current.shot.pos;
      wantLook = current.current.shot.look;
      rate = EASE_IN_RATE;
    } else {
      wantPos = new THREE.Vector3(BASE_POS.x + Math.sin(now * 0.12) * 1.6, BASE_POS.y, BASE_POS.z);
      wantLook = BASE_LOOK;
      rate = EASE_OUT_RATE;
    }

    const k = 1 - Math.exp(-rate * delta);
    camPos.current.lerp(wantPos, k);
    camLook.current.lerp(wantLook, k);
    camera.position.copy(camPos.current);
    camera.lookAt(camLook.current);
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

      <Cart3D team={team} />
      <TeamCrew3D team={team} />
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
    {npcDebugEnabled() && <CrewDebug3D />}
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
