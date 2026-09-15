// ============================================================
// PATTERN RACERS — MAIN 3D SCENE & CAMERA DIRECTOR
//
// One canvas, one scene, one simulation driver.
//
// The simulation is stepped here and ONLY here. It writes car transforms
// straight into the registered Object3Ds, so driving causes zero React
// re-renders; the HUD receives a throttled 10 Hz snapshot instead.
//
// Cameras are chosen automatically by game phase — the manual 1/2/3 view
// buttons are gone. Every camera is collision-aware: if a building would come
// between the camera and the car, the camera pulls in along its own boom
// rather than clipping through the wall.
// ============================================================

'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { SkyEnvironment3D } from './SkyEnvironment3D';
import { CircuitWorld3D } from './CircuitWorld3D';
import { PitComplex3D } from './PitComplex3D';
import { Grandstands3D } from './Grandstands3D';
import { RaceVehicle3D } from './RaceVehicle3D';
import { FacilityWorkers3D } from './FacilityWorkers3D';
import { ChampagneStreakerFan3D } from './ChampagneStreakerFan3D';
import { PerformanceCollector } from '../ui/PerformanceMonitorOverlay';

import { usePatternStore } from '../store/patternStore';
import {
  sim, stepSimulation, setHudListener, setSimAudioSink, stageAtGarages,
} from '../engine/raceSim';
import { simAudioSink, patternAudio } from '../engine/patternAudio';
import { TYRE_BAY_SLOTS, GRID_SLOTS } from '../engine/circuit';
import { COLLIDER_GRID } from '../engine/worldLayout';
import { segmentClearFraction, type Collider } from '../engine/collision';

// ── SIMULATION DRIVER ───────────────────────────────────────────────────────
// The single place the world advances. Runs in every phase, not just the race,
// so cinematic transitions and idle staging all go through the same code path.

const SimulationDriver: React.FC = () => {
  const syncRaceHud = usePatternStore((s) => s.syncRaceHud);

  useEffect(() => {
    // Park both cars inside their garages before the first frame.
    stageAtGarages();

    // The sim pushes a snapshot ten times a second; the HUD re-renders on
    // that, not on the 60 Hz physics tick.
    setHudListener(syncRaceHud);
    setSimAudioSink(simAudioSink);

    return () => {
      setHudListener(null);
      setSimAudioSink(null);
      patternAudio.stopAllEngines();
    };
  }, [syncRaceHud]);

  useFrame((_, delta) => {
    stepSimulation(delta);
  });

  return null;
};

// ── CAMERA DIRECTOR ─────────────────────────────────────────────────────────

const camPos = new THREE.Vector3();
const camLook = new THREE.Vector3();
const desired = new THREE.Vector3();
const lookTarget = new THREE.Vector3();
const scratch: Collider[] = [];

/** Frame-rate independent smoothing. `lerp(v, dt * k)` is not. */
function damp3(current: THREE.Vector3, target: THREE.Vector3, rate: number, dt: number) {
  const t = 1 - Math.exp(-rate * dt);
  current.lerp(target, t);
}

interface Shot {
  /** Boom offset behind the subject, metres. */
  back: number;
  height: number;
  /** How far ahead of the subject to look. */
  ahead: number;
  /** Lateral offset, for three-quarter framing. */
  side: number;
  /** Position/look smoothing rates. */
  posRate: number;
  lookRate: number;
}

const SHOTS: Record<string, Shot> = {
  // Round 1: three-quarter view into the garages.
  garage: { back: 17, height: 7.0, ahead: 6, side: -9, posRate: 2.2, lookRate: 3.0 },
  // Round 2: low and close on the tyre/service work.
  pit: { back: 13, height: 4.4, ahead: 5, side: -7, posRate: 2.4, lookRate: 3.2 },
  // Rounds 3-4: broadcast grid shot, looking down the start straight.
  grid: { back: 15, height: 5.0, ahead: 22, side: -5, posRate: 2.0, lookRate: 2.8 },
  // Round 5 / countdown: tighter, lower, more tension.
  countdown: { back: 10.5, height: 3.1, ahead: 26, side: -2.5, posRate: 2.6, lookRate: 3.4 },
  // Live race: classic chase cam.
  chase: { back: 9.5, height: 3.8, ahead: 20, side: 0, posRate: 6.0, lookRate: 7.0 },
  // After the flag.
  victory: { back: 14, height: 6.0, ahead: 4, side: -11, posRate: 1.8, lookRate: 2.4 },
};

const CameraDirector: React.FC = () => {
  const phase = usePatternStore((s) => s.phase);
  const currentRound = usePatternStore((s) => s.currentRound);

  const initialised = useRef(false);

  useFrame((state, rawDelta) => {
    const dt = Math.min(0.05, rawDelta);

    // ── PICK THE SHOT AND THE SUBJECT ──
    let shot: Shot;
    let subjectX: number, subjectZ: number, subjectHeading: number;
    let speedFrac = 0;

    if (phase === 'grand_prix_race') {
      // Follow whichever car is further round the lap — the actual battle.
      const leader = sim.blue.distance >= sim.red.distance ? sim.blue : sim.red;
      shot = sim.winner ? SHOTS.victory : SHOTS.chase;
      subjectX = leader.body.x;
      subjectZ = leader.body.z;
      subjectHeading = leader.body.heading;
      speedFrac = Math.min(1, Math.abs(leader.body.speed) / 60);
    } else if (phase === 'pre_race_countdown' || currentRound === 5) {
      shot = SHOTS.countdown;
      const mid = midpoint(GRID_SLOTS.blue, GRID_SLOTS.red);
      subjectX = mid.x; subjectZ = mid.z; subjectHeading = GRID_SLOTS.blue.heading;
    } else if (currentRound >= 3) {
      shot = SHOTS.grid;
      const mid = midpoint(GRID_SLOTS.blue, GRID_SLOTS.red);
      subjectX = mid.x; subjectZ = mid.z; subjectHeading = GRID_SLOTS.blue.heading;
    } else if (currentRound === 2) {
      shot = SHOTS.pit;
      // Track the cars through the transition, then settle on the service bay.
      const b = sim.blue.body, r = sim.red.body;
      subjectX = (b.x + r.x) / 2; subjectZ = (b.z + r.z) / 2;
      subjectHeading = TYRE_BAY_SLOTS.blue.heading;
    } else {
      shot = SHOTS.garage;
      const b = sim.blue.body, r = sim.red.body;
      subjectX = (b.x + r.x) / 2; subjectZ = (b.z + r.z) / 2;
      // Frame along the cars' own heading, not the garage building's. The two
      // differ by 90 degrees -- the bays face across the lane while the cars
      // point out through the doors -- so using the building's heading put the
      // camera beside the action instead of behind it.
      subjectHeading = sim.blue.body.heading;
    }

    // ── BUILD THE BOOM ──
    const fx = -Math.sin(subjectHeading);
    const fz = -Math.cos(subjectHeading);
    const rx = Math.cos(subjectHeading);
    const rz = -Math.sin(subjectHeading);

    // Pull back and rise slightly with speed, which reads as acceleration.
    const back = shot.back + speedFrac * 3.0;
    const height = shot.height + speedFrac * 0.5;

    desired.set(
      subjectX - fx * back + rx * shot.side,
      height,
      subjectZ - fz * back + rz * shot.side
    );
    lookTarget.set(subjectX + fx * shot.ahead, 1.3, subjectZ + fz * shot.ahead);

    // ── COLLISION-AWARE PULLBACK ──
    // If something solid sits between the car and the camera, slide the camera
    // in along the boom. This is what stops the camera entering buildings —
    // and it is why nothing has to be made transparent to "fix" clipping.
    const clear = segmentClearFraction(
      subjectX, subjectZ, desired.x, desired.z, COLLIDER_GRID, 1.6, scratch
    );
    if (clear < 1) {
      const minFrac = 0.28;
      const f = Math.max(minFrac, clear);
      desired.x = subjectX + (desired.x - subjectX) * f;
      desired.z = subjectZ + (desired.z - subjectZ) * f;
      desired.y = Math.max(2.4, desired.y * (0.6 + 0.4 * f));
    }

    // Never let the camera drop below the ground or inside the car.
    desired.y = Math.max(desired.y, 1.9);

    if (!initialised.current) {
      camPos.copy(desired);
      camLook.copy(lookTarget);
      initialised.current = true;
    }

    damp3(camPos, desired, shot.posRate, dt);
    damp3(camLook, lookTarget, shot.lookRate, dt);

    state.camera.position.copy(camPos);
    state.camera.lookAt(camLook);

    // Subtle FOV kick under boost, so speed is felt as well as seen.
    const cam = state.camera as THREE.PerspectiveCamera;
    if (cam.isPerspectiveCamera) {
      const boosting =
        phase === 'grand_prix_race' &&
        (sim.blue.body.boostRemaining > 0 || sim.red.body.boostRemaining > 0);
      const targetFov = boosting ? 66 : 52 + speedFrac * 6;
      cam.fov += (targetFov - cam.fov) * (1 - Math.exp(-4 * dt));
      cam.updateProjectionMatrix();
    }
  });

  return null;
};

function midpoint(a: { x: number; z: number }, b: { x: number; z: number }) {
  return { x: (a.x + b.x) / 2, z: (a.z + b.z) / 2 };
}

// ── WORLD ───────────────────────────────────────────────────────────────────

const WorldContent: React.FC = () => {
  const champagneActive = usePatternStore((s) => s.champagneActive);

  return (
    <>
      <SkyEnvironment3D />
      <CircuitWorld3D />
      <PitComplex3D />
      <Grandstands3D />
      <FacilityWorkers3D />

      <RaceVehicle3D teamId="blue" />
      <RaceVehicle3D teamId="red" />

      {/* One-shot celebration. Unmounted entirely once it has played, so it
          cannot loop the way the old 16-second clock-modulo version did. */}
      {champagneActive && <ChampagneStreakerFan3D />}
    </>
  );
};

export const PatternRacersScene3D: React.FC = () => {
  const glSettings = useMemo(
    () => ({
      antialias: true,
      powerPreference: 'high-performance' as const,
      stencil: false,
      depth: true,
      // Opaque canvas. With alpha the page background showed through wherever
      // the scene did not paint, which is what made the venue look ghostly.
      alpha: false,
      toneMapping: THREE.ACESFilmicToneMapping,
      toneMappingExposure: 1.0,
    }),
    []
  );

  return (
    <div className="w-full h-full relative select-none">
      <Canvas
        shadows
        dpr={[1, 1.75]}
        // far was 320 while the circuit spans ~400 m — the far half of the
        // venue was simply never drawn.
        camera={{ position: [40, 12, 60], fov: 52, near: 0.5, far: 3000 }}
        gl={glSettings}
      >
        <PerformanceCollector />
        <SimulationDriver />
        <CameraDirector />
        <WorldContent />
      </Canvas>
    </div>
  );
};
