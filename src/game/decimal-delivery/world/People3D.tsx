// ============================================================
// THE DECIMAL DELIVERY NETWORK — PEOPLE
//
// One stylised human rig shared by everyone in the depot: each team's player
// character, the loading crew and the intake crew. Proper proportions, a face
// (eyes, brows, smile), uniform with company colours, hi-vis vest, headwear,
// and articulated arms and legs — never a cylinder or a faceless mannequin
// (section 84).
//
// The rig is driven by a `pose()` callback read inside its own frame loop, so
// it always shows exactly what the simulation says this frame.
// ============================================================

'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GEO, MAT } from './DepotMaterials';
import { sideSim, sim, type PlayerMood } from '../engine/depotSim';
import type { TeamId } from '../types';

export interface Pose {
  x: number;
  z: number;
  heading: number;
  /** Walk cycle phase, radians. */
  phase: number;
  moving: boolean;
  /** 0 = arms at sides, 1 = arms out holding a parcel. */
  carry: number;
  /** 0 = upright, 1 = bent to lift. */
  bend: number;
  mood: PlayerMood | null;
  /** Seconds since the mood started, for one-shot gestures. */
  moodTime: number;
}

type Variant = 'player' | 'crew' | 'intake';

const skinTones = ['#d9a17c', '#b97d57', '#e8bf9c', '#8d5a3c'];

export const PersonRig: React.FC<{
  team: TeamId;
  variant: Variant;
  tone: number;
  pose: () => Pose;
}> = ({ team, variant, tone, pose }) => {
  const root = useRef<THREE.Group>(null);
  const hips = useRef<THREE.Group>(null);
  const torso = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const legL = useRef<THREE.Group>(null);
  const legR = useRef<THREE.Group>(null);
  const armL = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);

  const isBlue = team === 'blue';
  const mats = useMemo(() => {
    const teamColor = isBlue ? '#1f5fd1' : '#c9302a';
    return {
      skin: new THREE.MeshStandardMaterial({ color: skinTones[tone % skinTones.length], roughness: 0.85 }),
      uniform: new THREE.MeshStandardMaterial({
        color: variant === 'player' ? teamColor : '#3d5a80', roughness: 0.8,
      }),
      trousers: new THREE.MeshStandardMaterial({ color: '#2f3b4c', roughness: 0.9 }),
      vest: new THREE.MeshStandardMaterial({
        color: variant === 'player' ? '#f5f7fa' : '#ff9f1c', roughness: 0.75,
      }),
      stripe: new THREE.MeshStandardMaterial({ color: '#e5e7eb', roughness: 0.4, metalness: 0.4 }),
      teamBand: new THREE.MeshStandardMaterial({ color: teamColor, roughness: 0.6 }),
      hat: new THREE.MeshStandardMaterial({
        color: variant === 'player' ? teamColor : '#ffd23f', roughness: 0.5,
      }),
      dark: new THREE.MeshStandardMaterial({ color: '#1b1f24', roughness: 0.6 }),
      hair: new THREE.MeshStandardMaterial({ color: tone % 2 ? '#2b1d14' : '#4a3222', roughness: 0.9 }),
      board: new THREE.MeshStandardMaterial({ color: '#8b5e34', roughness: 0.8 }),
      paper: new THREE.MeshStandardMaterial({ color: '#fbfbf5', roughness: 0.9 }),
    };
  }, [isBlue, variant, tone]);

  useFrame(() => {
    const p = pose();
    if (!root.current) return;
    root.current.position.set(p.x, 0, p.z);
    root.current.rotation.y = p.heading;

    const swing = p.moving ? Math.sin(p.phase) : 0;
    const t = sim.elapsed;

    // Legs.
    if (legL.current) legL.current.rotation.x = swing * 0.55;
    if (legR.current) legR.current.rotation.x = -swing * 0.55;

    // Body bob while walking, gentle breathing while still.
    if (hips.current) {
      hips.current.position.y = 0.95 + (p.moving ? Math.abs(Math.sin(p.phase)) * 0.05 : 0);
    }
    if (torso.current) {
      const breathe = p.moving ? 0 : Math.sin(t * 1.8 + tone) * 0.012;
      torso.current.scale.set(1, 1 + breathe, 1);
      torso.current.rotation.x = -p.bend * 0.85;
    }

    // Arms: walking swing, blended into a carry pose.
    let lx = -swing * 0.5 * (1 - p.carry) - p.carry * 1.25;
    let rx = swing * 0.5 * (1 - p.carry) - p.carry * 1.25;
    let lz = 0;
    let rz = 0;
    let headYaw = 0;
    let headPitch = 0;
    let hop = 0;

    // Player character gestures (section 85).
    switch (p.mood) {
      case 'watching':
        // Clipboard up, glancing at it now and then.
        lx = -0.9;
        headPitch = Math.sin(t * 0.7 + tone) > 0.6 ? 0.35 : 0;
        break;
      case 'success': {
        // Fist pump.
        const k = Math.min(1, p.moodTime * 3);
        rx = -2.6 * k + Math.sin(p.moodTime * 14) * 0.25 * k;
        lx = -0.9;
        break;
      }
      case 'reject': {
        // Quick head shake, hand to forehead.
        headYaw = Math.sin(p.moodTime * 16) * 0.35 * Math.max(0, 1 - p.moodTime * 0.8);
        rx = -2.1;
        rz = 0.55;
        break;
      }
      case 'celebrate': {
        // Both arms up, little hops.
        lx = -2.9; rx = -2.9;
        lz = -0.35; rz = 0.35;
        hop = Math.abs(Math.sin(t * 7)) * 0.16;
        break;
      }
      case 'shrug': {
        // Playful "next time" shrug, repeating slowly.
        const k = (Math.sin(t * 1.6) + 1) / 2;
        lx = -0.5 - k * 0.4; rx = -0.5 - k * 0.4;
        lz = -0.9 * k; rz = 0.9 * k;
        headYaw = Math.sin(t * 0.8) * 0.25;
        break;
      }
      case 'idle':
        // Look around the depot.
        headYaw = Math.sin(t * 0.45 + tone) * 0.5;
        if (variant === 'player') lx = -0.35;
        break;
      default:
        break;
    }

    if (armL.current) { armL.current.rotation.x = lx; armL.current.rotation.z = lz; }
    if (armR.current) { armR.current.rotation.x = rx; armR.current.rotation.z = rz; }
    if (head.current) {
      head.current.rotation.y = headYaw;
      head.current.rotation.x = headPitch;
    }
    root.current.position.y = hop;
  });

  return (
    <group ref={root}>
      <group ref={hips} position={[0, 0.95, 0]}>
        {/* ── legs ── */}
        {([[-0.13, legL], [0.13, legR]] as const).map(([x, ref], i) => (
          <group key={i} ref={ref} position={[x, 0, 0]}>
            <mesh geometry={GEO.unitBox} material={mats.trousers}
              position={[0, -0.42, 0]} scale={[0.17, 0.84, 0.19]} castShadow />
            <mesh geometry={GEO.unitBox} material={mats.dark}
              position={[0, -0.9, -0.05]} scale={[0.19, 0.11, 0.3]} />
          </group>
        ))}

        {/* ── torso ── */}
        <group ref={torso}>
          <mesh geometry={GEO.unitBox} material={mats.uniform}
            position={[0, 0.33, 0]} scale={[0.5, 0.64, 0.28]} castShadow />
          <mesh geometry={GEO.unitBox} material={mats.vest}
            position={[0, 0.36, 0]} scale={[0.53, 0.5, 0.31]} />
          {/* reflective stripe + team band across the chest */}
          <mesh geometry={GEO.unitBox} material={mats.stripe}
            position={[0, 0.3, 0]} scale={[0.54, 0.05, 0.32]} />
          <mesh geometry={GEO.unitBox} material={mats.teamBand}
            position={[0, 0.48, -0.16]} scale={[0.3, 0.1, 0.02]} />
          {/* belt */}
          <mesh geometry={GEO.unitBox} material={mats.dark}
            position={[0, 0.03, 0]} scale={[0.52, 0.06, 0.3]} />

          {/* ── arms, pivoting at the shoulder ── */}
          {([[-0.32, armL], [0.32, armR]] as const).map(([x, ref], i) => (
            <group key={i} ref={ref} position={[x, 0.6, 0]}>
              <mesh geometry={GEO.unitBox} material={mats.uniform}
                position={[0, -0.25, 0]} scale={[0.13, 0.5, 0.14]} castShadow />
              <mesh geometry={GEO.unitSphere} material={mats.skin}
                position={[0, -0.54, 0]} scale={[0.12, 0.12, 0.12]} />
              {/* clipboard in the player's left hand */}
              {variant === 'player' && i === 0 && (
                <group position={[0.05, -0.58, -0.1]} rotation={[0.3, 0, 0]}>
                  <mesh geometry={GEO.unitBox} material={mats.board} scale={[0.24, 0.32, 0.02]} />
                  <mesh geometry={GEO.unitBox} material={mats.paper}
                    position={[0, -0.01, -0.012]} scale={[0.2, 0.26, 0.005]} />
                </group>
              )}
            </group>
          ))}

          {/* ── head ── */}
          <group ref={head} position={[0, 0.82, 0]}>
            <mesh geometry={GEO.unitBox} material={mats.skin}
              position={[0, -0.12, 0]} scale={[0.1, 0.1, 0.1]} />
            <mesh geometry={GEO.unitSphere} material={mats.skin}
              position={[0, 0.06, 0]} scale={[0.3, 0.34, 0.3]} castShadow />
            {/* face: the rig faces local -Z */}
            {[-0.06, 0.06].map((x) => (
              <mesh key={`eye${x}`} geometry={GEO.unitSphere} material={mats.dark}
                position={[x, 0.09, -0.135]} scale={[0.045, 0.05, 0.03]} />
            ))}
            {[-0.065, 0.065].map((x) => (
              <mesh key={`brow${x}`} geometry={GEO.unitBox} material={mats.hair}
                position={[x, 0.15, -0.13]} scale={[0.07, 0.015, 0.02]} />
            ))}
            <mesh geometry={GEO.unitBox} material={mats.dark}
              position={[0, -0.01, -0.14]} scale={[0.08, 0.018, 0.02]} />
            <mesh geometry={GEO.unitSphere} material={mats.skin}
              position={[0, 0.04, -0.15]} scale={[0.05, 0.06, 0.05]} />

            {variant === 'player' ? (
              // Team cap with brim.
              <group position={[0, 0.17, 0]}>
                <mesh geometry={GEO.unitSphere} material={mats.hat}
                  scale={[0.32, 0.2, 0.32]} position={[0, 0.02, 0]} />
                <mesh geometry={GEO.unitBox} material={mats.hat}
                  position={[0, -0.03, -0.18]} scale={[0.24, 0.025, 0.14]} />
              </group>
            ) : (
              // Hard hat.
              <group position={[0, 0.18, 0]}>
                <mesh geometry={GEO.unitSphere} material={mats.hat}
                  scale={[0.35, 0.26, 0.35]} position={[0, 0.02, 0]} />
                <mesh geometry={GEO.unitCyl} material={mats.hat}
                  position={[0, -0.05, 0]} scale={[0.42, 0.02, 0.42]} />
              </group>
            )}
            <mesh geometry={GEO.unitSphere} material={mats.hair}
              position={[0, 0.02, 0.06]} scale={[0.3, 0.26, 0.24]} />
          </group>
        </group>
      </group>
    </group>
  );
};

// ── BOUND CHARACTERS ────────────────────────────────────────────────────────

/** The team's own player character, standing between their two scales. */
export const PlayerCharacter3D: React.FC<{ team: TeamId }> = ({ team }) => {
  const moodStart = useRef({ mood: '' as string, at: 0 });
  return (
    <PersonRig
      team={team}
      variant="player"
      tone={team === 'blue' ? 0 : 2}
      pose={() => {
        const s = sideSim(team);
        if (moodStart.current.mood !== s.playerMood) {
          moodStart.current = { mood: s.playerMood, at: sim.elapsed };
        }
        return {
          x: s.playerPos.x, z: s.playerPos.z, heading: s.playerHeading,
          phase: 0, moving: false, carry: 0, bend: 0,
          mood: s.playerMood, moodTime: sim.elapsed - moodStart.current.at,
        };
      }}
    />
  );
};

/** Loading crew member: collects processed parcels for the truck or the bin. */
export const CrewMember3D: React.FC<{ team: TeamId; index: number }> = ({ team, index }) => (
  <PersonRig
    team={team}
    variant="crew"
    tone={index + (team === 'blue' ? 1 : 3)}
    pose={() => {
      const w = sideSim(team).workers[index];
      const bend = w.task === 'lift' ? Math.sin(Math.min(1, w.t) * Math.PI) :
        w.task === 'place' ? Math.sin(Math.min(1, w.t) * Math.PI) * 0.6 : 0;
      return {
        x: w.pos.x, z: w.pos.z, heading: w.heading, phase: w.phase,
        moving: w.task === 'to_collect' || w.task === 'carry' || w.task === 'return',
        carry: w.carrying || w.task === 'lift' ? 1 : 0,
        bend, mood: null, moodTime: 0,
      };
    }}
  />
);

/** Intake crew: walks parcels out of the warehouse; medium ones on a cart. */
export const IntakeWorker3D: React.FC<{ team: TeamId; index: number }> = ({ team, index }) => {
  const cart = useRef<THREE.Group>(null);
  const wheelL = useRef<THREE.Mesh>(null);
  const wheelR = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const iw = sideSim(team).intake[index];
    if (!cart.current || !iw) return;
    const show = iw.withCart && (iw.task === 'to_belt' || iw.task === 'set_down');
    cart.current.visible = show;
    if (!show) return;
    const fx = -Math.sin(iw.heading);
    const fz = -Math.cos(iw.heading);
    cart.current.position.set(iw.pos.x + fx * 1.25, 0, iw.pos.z + fz * 1.25);
    cart.current.rotation.y = iw.heading;
    const spin = iw.phase * 0.6;
    if (wheelL.current) wheelL.current.rotation.x = spin;
    if (wheelR.current) wheelR.current.rotation.x = spin;
  });

  return (
    <>
      <PersonRig
        team={team}
        variant="intake"
        tone={index + (team === 'blue' ? 2 : 1)}
        pose={() => {
          const iw = sideSim(team).intake[index];
          const carrying = !!iw.parcelId && (iw.task === 'to_belt' || iw.task === 'set_down');
          return {
            x: iw.pos.x, z: iw.pos.z, heading: iw.heading, phase: iw.phase,
            moving: iw.task === 'to_pile' || iw.task === 'to_belt' || iw.task === 'return',
            // Pushing a cart holds the arms low and forward; carrying by hand, level.
            carry: carrying ? (iw.withCart ? 0.7 : 1) : iw.task === 'lift' ? 1 : 0,
            bend: iw.task === 'lift' ? Math.sin(Math.min(1, iw.t) * Math.PI) :
              iw.task === 'set_down' ? Math.sin(Math.min(1, iw.t) * Math.PI) * 0.5 : 0,
            mood: null, moodTime: 0,
          };
        }}
      />
      {/* hand cart for medium parcels */}
      <group ref={cart} visible={false}>
        <mesh geometry={GEO.unitBox} material={MAT.steelDark}
          position={[0, 0.5, 0]} scale={[1.1, 0.08, 1.3]} castShadow />
        <mesh geometry={GEO.unitBox} material={MAT.guardOrange}
          position={[0, 0.9, 0.62]} scale={[1.1, 0.8, 0.07]} />
        {[-0.5, 0.5].map((x, i) => (
          <mesh key={x} ref={i === 0 ? wheelL : wheelR} geometry={GEO.unitCyl} material={MAT.tyre}
            position={[x, 0.2, 0]} rotation={[0, 0, Math.PI / 2]} scale={[0.36, 0.1, 0.36]} />
        ))}
      </group>
    </>
  );
};
