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
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

import { SkyEnvironment3D } from './SkyEnvironment3D';
import { CircuitWorld3D } from './CircuitWorld3D';
import { PitComplex3D } from './PitComplex3D';
import { Grandstands3D } from './Grandstands3D';
import { CrowdLife3D } from './CrowdLife3D';
import { RaceVehicle3D } from './RaceVehicle3D';
import { FacilityWorkers3D } from './FacilityWorkers3D';
import { PerformanceCollector } from '../ui/PerformanceMonitorOverlay';

import { usePatternStore } from '../store/patternStore';
import {
  sim, stepSimulation, setHudListener, setSimAudioSink, stageAtGarages,
} from '../engine/raceSim';
import { simAudioSink, patternAudio } from '../engine/patternAudio';
import { TYRE_BAY_SLOTS, GRID_SLOTS, CIRCUIT, GARAGE_CAR_SLOTS } from '../engine/circuit';
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

/**
 * Opening establishing sequence, played while the intro card is up.
 *
 * Without this the camera sat on the Round 1 garage boom, which points
 * backwards out of a bay -- straight into the garage's own back wall. The
 * collision pullback then jammed it against that wall, so the very first thing
 * anyone saw was a flat grey rectangle.
 *
 * Three beats: a slow high orbit of the whole venue, a dolly down the main
 * straight at grandstand height, then a low side pass across the garages so
 * the two cars are introduced from the side.
 */
const INTRO_BEATS = { orbit: 7.5, straight: 6.5, cars: 6.0 };
const INTRO_TOTAL = INTRO_BEATS.orbit + INTRO_BEATS.straight + INTRO_BEATS.cars;

function introShot(t: number): { pos: THREE.Vector3; look: THREE.Vector3 } {
  const b = CIRCUIT.bounds;
  const cx = (b.minX + b.maxX) / 2;
  const cz = (b.minZ + b.maxZ) / 2;
  const radius = Math.max(b.maxX - b.minX, b.maxZ - b.minZ) * 0.72;

  // Beat 1 -- high orbit of the venue.
  if (t < INTRO_BEATS.orbit) {
    const k = t / INTRO_BEATS.orbit;
    const a = -0.6 + k * 0.85;
    return {
      pos: new THREE.Vector3(
        cx + Math.cos(a) * radius,
        190 - k * 55,
        cz + Math.sin(a) * radius
      ),
      look: new THREE.Vector3(cx, 0, cz),
    };
  }

  // Beat 2 -- dolly down the main straight, just outside the barrier.
  const t2 = t - INTRO_BEATS.orbit;
  if (t2 < INTRO_BEATS.straight) {
    const k = t2 / INTRO_BEATS.straight;
    const from = CIRCUIT.sampleAt(40);
    const to = CIRCUIT.sampleAt(230);
    const px = from.x + (to.x - from.x) * k;
    const pz = from.z + (to.z - from.z) * k;
    const f = CIRCUIT.sampleAt(40 + 190 * k);
    return {
      pos: new THREE.Vector3(px + f.rx * -26, 16 - k * 6, pz + f.rz * -26),
      look: new THREE.Vector3(f.x, 2, f.z),
    };
  }

  // Beat 3 -- low side pass across the garages, introducing the cars.
  const t3 = t2 - INTRO_BEATS.straight;
  const k = Math.min(1, t3 / INTRO_BEATS.cars);
  const blue = GARAGE_CAR_SLOTS.blue;
  const red = GARAGE_CAR_SLOTS.red;
  const mx = (blue.x + red.x) / 2;
  const mz = (blue.z + red.z) / 2;
  // Slide along the bay frontage so both cars pass through frame.
  const fx = -Math.sin(blue.heading);
  const fz = -Math.cos(blue.heading);
  const rx = Math.cos(blue.heading);
  const rz = -Math.sin(blue.heading);
  const slide = (k - 0.5) * 26;
  return {
    pos: new THREE.Vector3(mx - fx * 19 + rx * slide, 4.6, mz - fz * 19 + rz * slide),
    look: new THREE.Vector3(mx + rx * slide * 0.35, 1.2, mz + rz * slide * 0.35),
  };
}

const CameraDirector: React.FC = () => {
  const phase = usePatternStore((s) => s.phase);
  const currentRound = usePatternStore((s) => s.currentRound);

  const initialised = useRef(false);
  const introTime = useRef(0);

  // Replay the establishing sequence every time we return to the intro card,
  // including after a restart.
  useEffect(() => {
    if (phase === 'intro') {
      introTime.current = 0;
      initialised.current = false;
    }
  }, [phase]);

  useFrame((state, rawDelta) => {
    const dt = Math.min(0.05, rawDelta);

    // ── OPENING SEQUENCE ──
    if (phase === 'intro') {
      introTime.current += dt;
      // Hold on the final framing rather than looping, so a class that reads
      // the brief slowly is not left watching the camera fly around.
      const t = Math.min(introTime.current, INTRO_TOTAL - 0.01);
      const shotNow = introShot(t);
      if (!initialised.current) {
        camPos.copy(shotNow.pos);
        camLook.copy(shotNow.look);
        initialised.current = true;
      }
      damp3(camPos, shotNow.pos, 3.0, dt);
      damp3(camLook, shotNow.look, 3.0, dt);
      state.camera.position.copy(camPos);
      state.camera.lookAt(camLook);
      return;
    }

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

  return (
    <>
      <SkyEnvironment3D />
      <CircuitWorld3D />
      <PitComplex3D />
      <Grandstands3D />
      <CrowdLife3D />
      <FacilityWorkers3D />

      <RaceVehicle3D teamId="blue" />
      <RaceVehicle3D teamId="red" />

    </>
  );
};

/**
 * Two-up viewport rendering.
 *
 * The old split screen mounted a second <Canvas> with a second full copy of
 * the world -- every grandstand, every barrier, twice a frame. This renders
 * ONE scene twice through the scissor rectangle instead, so the world is built
 * once and each half simply gets its own camera.
 */
const SplitViewportRenderer: React.FC<{ enabled: boolean }> = ({ enabled }) => {
  const { gl, scene, size, camera } = useThree();

  const cams = useMemo(() => {
    const make = () => new THREE.PerspectiveCamera(56, 1, 0.5, 3000);
    return { blue: make(), red: make() };
  }, []);

  // IMPORTANT: giving any useFrame a priority above 0 switches R3F out of its
  // automatic render loop for the whole canvas. So once this component exists
  // it owns rendering in BOTH modes -- when split view is off it simply draws
  // the default camera itself. Returning early here would black the screen.
  useFrame(() => {
    if (!enabled) {
      gl.setScissorTest(false);
      gl.setViewport(0, 0, size.width, size.height);
      gl.render(scene, camera);
      return;
    }

    const w = Math.floor(size.width / 2);
    const h = size.height;

    gl.setScissorTest(true);
    for (const [i, team] of (['blue', 'red'] as const).entries()) {
      const car = team === 'blue' ? sim.blue : sim.red;
      const cam = cams[team];
      const b = car.body;

      const fx = -Math.sin(b.heading);
      const fz = -Math.cos(b.heading);
      const speedFrac = Math.min(1, Math.abs(b.speed) / 60);
      const back = 9.5 + speedFrac * 3;

      cam.position.set(b.x - fx * back, 3.8 + speedFrac * 0.5, b.z - fz * back);
      cam.lookAt(b.x + fx * 20, 1.3, b.z + fz * 20);
      cam.aspect = w / h;
      cam.fov = 56 + speedFrac * 6;
      cam.updateProjectionMatrix();

      gl.setViewport(i * w, 0, w, h);
      gl.setScissor(i * w, 0, w, h);
      gl.render(scene, cam);
    }
    gl.setScissorTest(false);
    gl.setViewport(0, 0, size.width, size.height);
  }, 1);

  // Hand the frame back to the default renderer when split view turns off.
  useEffect(() => {
    if (!enabled) {
      gl.setScissorTest(false);
      gl.setViewport(0, 0, size.width, size.height);
    }
  }, [enabled, gl, size]);

  return null;
};

export const PatternRacersScene3D: React.FC = () => {
  const phase = usePatternStore((s) => s.phase);
  const splitViewMode = usePatternStore((s) => s.splitViewMode);
  // Two-up only makes sense while both cars are actually being driven.
  const splitActive = splitViewMode && phase === 'grand_prix_race';

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
        // Split view drives its own render passes; suppress the default one.
        frameloop="always"
        dpr={[1, 1.75]}
        // far was 320 while the circuit spans ~400 m — the far half of the
        // venue was simply never drawn.
        camera={{ position: [40, 12, 60], fov: 52, near: 0.5, far: 3000 }}
        gl={glSettings}
      >
        <PerformanceCollector />
        <SimulationDriver />
        <CameraDirector />
        <SplitViewportRenderer enabled={splitActive} />
        <WorldContent />
      </Canvas>

      {splitActive && (
        <>
          <div className="pointer-events-none absolute inset-y-0 left-1/2 w-1 -translate-x-1/2 bg-gradient-to-b from-amber-300 via-white to-amber-300 shadow-[0_0_14px_#f59e0b] z-20" />
          <div className="pointer-events-none absolute top-3 left-4 z-20 rounded-full border border-blue-400/60 bg-blue-950/85 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-blue-100 shadow">
            BLUE · W A S D
          </div>
          <div className="pointer-events-none absolute top-3 right-4 z-20 rounded-full border border-red-400/60 bg-red-950/85 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-red-100 shadow">
            RED · ARROW KEYS
          </div>
        </>
      )}
    </div>
  );
};
