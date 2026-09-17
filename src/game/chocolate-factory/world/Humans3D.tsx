// ============================================================
// THE CHOCOLATE FACTORY — ARTICULATED FACTORY CREW & WORK SIMULATION
//
// High-fidelity stylized factory staff with organic humanoid anatomy:
// - Smooth curved limbs (cylinders/capsules), articulated knees and elbows
// - Expressive faces (sclera + pupils, eyebrows, nose, animated smile)
// - Team-branded work uniforms, hi-vis vests, white QC coats, safety hardhats
// - Active, meaningful work animations (cocoa bag pouring with bean streams,
//   mixer valve operation & digital tablet monitoring, chocolate bar QC inspection,
//   gift box packing & pallet stacking, forklift cab steering).
// ============================================================

'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { TeamId } from '../types';
import { sim, type Worker } from '../engine/factorySim';
import type { WorkAnim, WorkerRole } from '../engine/crew';
import { GEO, MAT, teamMat } from './materials';
import { angleDelta, type Vec3 } from './geom';

export interface PersonState {
  pos: Vec3;
  heading: number;
  moving: boolean;
  /** Metres per second — the stride and cadence follow it so feet never skate. */
  speed: number;
  carrying: boolean;
  pushing: boolean;
  anim: WorkAnim;
}

export interface WorkerStyle {
  skinTone: string;
  hairColor: string;
  shirtColor: string;
  pantsColor: string;
  shoesColor: string;
  vestColor?: string;
  isHiVis?: boolean;
  isCoat?: boolean;
  hat: 'hardhat' | 'cap' | 'cleanroom' | 'none';
  hasTablet?: boolean;
  hasGlasses?: boolean;
  heightScale?: number;
}

// ── SHARED ARTICULATED HUMANOID RIG ──

interface HumanoidRigProps {
  style: WorkerStyle;
  team: TeamId;
  read: () => PersonState;
  scale?: number;
  customAccessory?: React.ReactNode;
}

/**
 * The camera has to hold BOTH factories, which left the crew only a few pixels
 * tall and made their work impossible to follow. Everyone is drawn slightly
 * larger than life so walking, carrying and tipping read from the wide shot.
 */
export const CREW_SCALE = 1.4;

export const ArticulatedHuman3D: React.FC<HumanoidRigProps> = ({
  style,
  team,
  read,
  scale = CREW_SCALE,
  customAccessory,
}) => {
  const root = useRef<THREE.Group>(null);
  const pelvisRef = useRef<THREE.Group>(null);
  const torsoRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);

  const leftHipRef = useRef<THREE.Group>(null);
  const rightHipRef = useRef<THREE.Group>(null);
  const leftKneeRef = useRef<THREE.Group>(null);
  const rightKneeRef = useRef<THREE.Group>(null);
  const leftFootRef = useRef<THREE.Group>(null);
  const rightFootRef = useRef<THREE.Group>(null);

  const leftShoulderRef = useRef<THREE.Group>(null);
  const rightShoulderRef = useRef<THREE.Group>(null);
  const leftElbowRef = useRef<THREE.Group>(null);
  const rightElbowRef = useRef<THREE.Group>(null);

  const walkPhase = useRef(Math.random() * Math.PI * 2);

  // Dynamic procedural materials for skin, hair, and clothing
  const skinMat = useMemo(() => new THREE.MeshStandardMaterial({ color: style.skinTone, roughness: 0.65 }), [style.skinTone]);
  const hairMat = useMemo(() => new THREE.MeshStandardMaterial({ color: style.hairColor, roughness: 0.8 }), [style.hairColor]);
  const pantsMat = useMemo(() => new THREE.MeshStandardMaterial({ color: style.pantsColor, roughness: 0.75 }), [style.pantsColor]);
  const shoeMat = useMemo(() => new THREE.MeshStandardMaterial({ color: style.shoesColor, roughness: 0.5 }), [style.shoesColor]);
  const shirtMat = useMemo(() => new THREE.MeshStandardMaterial({ color: style.shirtColor, roughness: 0.7 }), [style.shirtColor]);
  const eyePupilMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.2 }), []);
  const eyeWhiteMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.3 }), []);
  const hardhatMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: team === 'blue' ? '#3b82f6' : '#ef4444',
    roughness: 0.4,
    metalness: 0.15,
  }), [team]);

  const gait = useRef(0);
  const pose = useRef({ ls: [0, 0, 0.1], rs: [0, 0, -0.1], le: 0.15, re: 0.15, torso: 0, hx: 0.05, hy: 0 });
  const seed = useMemo(() => Math.random() * 10, []);

  useFrame((state, delta) => {
    const s = read();
    const g = root.current;
    if (!g) return;

    // The rig is modelled facing local +Z; the simulation's heading points
    // local -Z forward, so turn the body half a turn to face where it walks.
    g.position.set(s.pos.x, 0, s.pos.z);
    g.rotation.y += angleDelta(g.rotation.y, s.heading + Math.PI) * (1 - Math.exp(-14 * delta));

    const t = state.clock.getElapsedTime() + seed;
    const k = 1 - Math.exp(-12 * delta);

    // ── GAIT: blends in and out, cadence and stride follow real speed ──
    gait.current += ((s.moving ? 1 : 0) - gait.current) * (1 - Math.exp(-9 * delta));
    const gw = gait.current;
    walkPhase.current += delta * (s.moving ? 2.4 + s.speed * 3.1 : 0);
    const p = walkPhase.current;
    const stride = gw * Math.min(1, 0.4 + s.speed / 3.2);

    if (pelvisRef.current) {
      // Walking bob, or quiet breathing when standing.
      pelvisRef.current.position.y = 0.72 + Math.abs(Math.sin(p)) * 0.045 * stride + (1 - gw) * Math.sin(t * 1.9) * 0.006;
      pelvisRef.current.rotation.y = Math.sin(p) * 0.09 * stride;
      pelvisRef.current.rotation.z = Math.cos(p) * 0.03 * stride;
    }
    if (leftHipRef.current) leftHipRef.current.rotation.x = -Math.sin(p) * 0.5 * stride;
    if (rightHipRef.current) rightHipRef.current.rotation.x = Math.sin(p) * 0.5 * stride;
    if (leftKneeRef.current) leftKneeRef.current.rotation.x = 0.03 + Math.pow(Math.max(0, Math.sin(p)), 1.1) * 0.9 * stride;
    if (rightKneeRef.current) rightKneeRef.current.rotation.x = 0.03 + Math.pow(Math.max(0, -Math.sin(p)), 1.1) * 0.9 * stride;
    if (leftFootRef.current) leftFootRef.current.rotation.x = -Math.sin(p) * 0.18 * stride;
    if (rightFootRef.current) rightFootRef.current.rotation.x = Math.sin(p) * 0.18 * stride;

    // ── UPPER BODY: a target pose per activity, eased so nothing pops ──
    let ls = [0.05, 0, 0.1], rs = [0.05, 0, -0.1], le = 0.15, re = 0.15, torso = 0, hx = 0.05, hy = Math.sin(t * 0.55) * 0.25;

    if (s.moving || gw > 0.5) {
      if (s.pushing) {
        // Both hands on the cart handle, leaning into it.
        ls = [-1.25, 0.12, 0.05]; rs = [-1.25, -0.12, -0.05]; le = 0.3; re = 0.3; torso = 0.2; hx = -0.05; hy = 0;
      } else if (s.carrying) {
        ls = [-1.35, 0.28, 0.2]; rs = [-1.35, -0.28, -0.2]; le = 0.85; re = 0.85; torso = -0.03; hx = 0.02; hy = 0;
      } else {
        ls = [Math.sin(p) * 0.42 * stride, 0, 0.08]; rs = [-Math.sin(p) * 0.42 * stride, 0, -0.08];
        le = 0.2 + Math.max(0, Math.sin(p)) * 0.25; re = 0.2 + Math.max(0, -Math.sin(p)) * 0.25;
        torso = 0.05; hx = 0.02; hy = Math.sin(t * 1.5) * 0.06;
      }
    } else {
      switch (s.anim) {
        case 'pour':
          // Sack raised over the tank mouth, tipping.
          ls = [-2.0 + Math.sin(t * 3) * 0.05, 0.32, 0.15]; rs = [-2.0 + Math.sin(t * 3) * 0.05, -0.32, -0.15];
          le = 0.4; re = 0.4; torso = -0.06; hx = 0.35; hy = 0;
          break;
        case 'operate':
          // Turning dials and pressing buttons on the control panel.
          ls = [-1.15 + Math.sin(t * 3.5) * 0.14, 0.25, 0.1]; rs = [-1.35 + Math.cos(t * 2.8) * 0.2, -0.2, -0.1];
          le = 0.7; re = 0.85 + Math.max(0, Math.sin(t * 5.6)) * 0.25; torso = 0.12; hx = 0.15; hy = Math.sin(t * 1.8) * 0.2;
          break;
        case 'inspect':
          // Clipboard in one hand, checking the product with the other.
          ls = [-0.95, 0.35, 0.15]; rs = [-1.25 + Math.sin(t * 2.2) * 0.12, -0.25, -0.1];
          le = 1.1; re = 0.95; torso = 0.1; hx = 0.28; hy = Math.sin(t * 1.2) * 0.22;
          break;
        case 'pack': {
          const c = Math.sin(t * 3.2);
          ls = [-1.1 + c * 0.25, 0.2, 0.05]; rs = [-1.15 - c * 0.25, -0.2, -0.05];
          le = 0.85; re = 0.85; torso = 0.25; hx = 0.32; hy = Math.sin(t * 2) * 0.15;
          break;
        }
        case 'pickup': {
          // Bend at the waist and reach down to the stack.
          const b = 0.5 + 0.5 * Math.sin(t * 2.6);
          ls = [-0.45 - 0.6 * b, 0.15, 0.1]; rs = [-0.45 - 0.6 * b, -0.15, -0.1];
          le = 0.2; re = 0.2; torso = 0.25 + 0.4 * b; hx = 0.35; hy = 0;
          break;
        }
        case 'load': {
          // Lift a box and swing it across into the bed / onto the cart.
          const c = Math.sin(t * 11.4);
          ls = [-1.2 - 0.45 * c, 0.3, 0.2]; rs = [-1.2 - 0.45 * c, -0.3, -0.2];
          le = 0.7; re = 0.7; torso = 0.18 + 0.25 * (0.5 + 0.5 * c); hx = 0.3; hy = 0;
          break;
        }
        case 'push':
          ls = [-1.25, 0.12, 0.05]; rs = [-1.25, -0.12, -0.05]; le = 0.3; re = 0.3; torso = 0.1; hx = 0; hy = 0;
          break;
        default:
          break;
      }
    }

    const P = pose.current;
    const mix = (a: number, b: number) => a + (b - a) * k;
    for (let i = 0; i < 3; i++) { P.ls[i] = mix(P.ls[i], ls[i]); P.rs[i] = mix(P.rs[i], rs[i]); }
    P.le = mix(P.le, le); P.re = mix(P.re, re); P.torso = mix(P.torso, torso);
    P.hx = mix(P.hx, hx); P.hy = mix(P.hy, hy);

    if (leftShoulderRef.current) leftShoulderRef.current.rotation.set(P.ls[0], P.ls[1], P.ls[2]);
    if (rightShoulderRef.current) rightShoulderRef.current.rotation.set(P.rs[0], P.rs[1], P.rs[2]);
    if (leftElbowRef.current) leftElbowRef.current.rotation.x = P.le;
    if (rightElbowRef.current) rightElbowRef.current.rotation.x = P.re;
    if (torsoRef.current) torsoRef.current.rotation.set(P.torso, -Math.sin(p) * 0.06 * stride, 0);
    if (headRef.current) headRef.current.rotation.set(P.hx, P.hy, 0);
  });

  return (
    <group ref={root} scale={scale * (style.heightScale ?? 1.0)}>
      {/* ── 1. PELVIS & LOWER BODY ── */}
      <group ref={pelvisRef} position={[0, 0.72, 0]}>
        {/* Belt & Waist */}
        <mesh position={[0, 0.02, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.17, 0.12, 12]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} />
        </mesh>
        {/* Belt Buckle */}
        <mesh position={[0, 0.02, 0.175]}>
          <boxGeometry args={[0.06, 0.05, 0.02]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* ── LEFT LEG ── */}
        <group ref={leftHipRef} position={[-0.1, -0.04, 0]}>
          <mesh position={[0, -0.16, 0]} castShadow>
            <cylinderGeometry args={[0.075, 0.065, 0.32, 10]} />
            <primitive object={pantsMat} attach="material" />
          </mesh>
          <group ref={leftKneeRef} position={[0, -0.32, 0]}>
            <mesh position={[0, -0.16, 0]} castShadow>
              <cylinderGeometry args={[0.065, 0.055, 0.32, 10]} />
              <primitive object={pantsMat} attach="material" />
            </mesh>
            <group ref={leftFootRef} position={[0, -0.32, 0.03]}>
              <mesh position={[0, 0.04, 0]} castShadow>
                <boxGeometry args={[0.11, 0.08, 0.22]} />
                <primitive object={shoeMat} attach="material" />
              </mesh>
              {/* Rubber Tread */}
              <mesh position={[0, 0.01, 0]}>
                <boxGeometry args={[0.115, 0.025, 0.23]} />
                <meshStandardMaterial color="#0f172a" roughness={0.9} />
              </mesh>
            </group>
          </group>
        </group>

        {/* ── RIGHT LEG ── */}
        <group ref={rightHipRef} position={[0.1, -0.04, 0]}>
          <mesh position={[0, -0.16, 0]} castShadow>
            <cylinderGeometry args={[0.075, 0.065, 0.32, 10]} />
            <primitive object={pantsMat} attach="material" />
          </mesh>
          <group ref={rightKneeRef} position={[0, -0.32, 0]}>
            <mesh position={[0, -0.16, 0]} castShadow>
              <cylinderGeometry args={[0.065, 0.055, 0.32, 10]} />
              <primitive object={pantsMat} attach="material" />
            </mesh>
            <group ref={rightFootRef} position={[0, -0.32, 0.03]}>
              <mesh position={[0, 0.04, 0]} castShadow>
                <boxGeometry args={[0.11, 0.08, 0.22]} />
                <primitive object={shoeMat} attach="material" />
              </mesh>
              <mesh position={[0, 0.01, 0]}>
                <boxGeometry args={[0.115, 0.025, 0.23]} />
                <meshStandardMaterial color="#0f172a" roughness={0.9} />
              </mesh>
            </group>
          </group>
        </group>

        {/* ── 2. TORSO & UPPER BODY ── */}
        <group ref={torsoRef} position={[0, 0.08, 0]}>
          {/* Main Chest / Shirt */}
          <mesh position={[0, 0.26, 0]} castShadow>
            <cylinderGeometry args={[0.21, 0.17, 0.44, 12]} />
            <primitive object={style.isCoat ? MAT.coatWhite : shirtMat} attach="material" />
          </mesh>

          {/* Hi-Vis Safety Vest Overlay */}
          {style.isHiVis && (
            <>
              <mesh position={[0, 0.26, 0]} castShadow>
                <cylinderGeometry args={[0.215, 0.175, 0.42, 12]} />
                <meshStandardMaterial color="#facc15" roughness={0.6} />
              </mesh>
              {/* Reflective Silver Stripes */}
              <mesh position={[0, 0.32, 0]}>
                <cylinderGeometry args={[0.218, 0.21, 0.05, 12]} />
                <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.8} />
              </mesh>
              <mesh position={[0, 0.18, 0]}>
                <cylinderGeometry args={[0.198, 0.185, 0.05, 12]} />
                <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.8} />
              </mesh>
              {/* Team ID Badge on Chest */}
              <mesh position={[0.1, 0.34, 0.2]}>
                <boxGeometry args={[0.07, 0.09, 0.02]} />
                <primitive object={team === 'blue' ? MAT.blue : MAT.red} attach="material" />
              </mesh>
            </>
          )}

          {/* Lab Coat Details for Quality Inspector */}
          {style.isCoat && (
            <>
              {/* Pocket + Golden QC Pen */}
              <mesh position={[0.1, 0.3, 0.195]}>
                <boxGeometry args={[0.07, 0.08, 0.02]} />
                <meshStandardMaterial color="#e2e8f0" roughness={0.6} />
              </mesh>
              <mesh position={[0.11, 0.34, 0.205]}>
                <cylinderGeometry args={[0.008, 0.008, 0.08, 8]} />
                <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.2} />
              </mesh>
            </>
          )}

          {/* Collar & Neck */}
          <mesh position={[0, 0.51, 0]}>
            <cylinderGeometry args={[0.09, 0.1, 0.1, 10]} />
            <primitive object={skinMat} attach="material" />
          </mesh>

          {/* ── LEFT ARM ── */}
          <group ref={leftShoulderRef} position={[-0.24, 0.44, 0]}>
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.07, 10, 8]} />
              <primitive object={style.isCoat ? MAT.coatWhite : shirtMat} attach="material" />
            </mesh>
            <mesh position={[0, -0.15, 0]} castShadow>
              <cylinderGeometry args={[0.06, 0.05, 0.28, 10]} />
              <primitive object={style.isCoat ? MAT.coatWhite : shirtMat} attach="material" />
            </mesh>
            <group ref={leftElbowRef} position={[0, -0.28, 0]}>
              <mesh position={[0, -0.14, 0]} castShadow>
                <cylinderGeometry args={[0.05, 0.045, 0.26, 10]} />
                <primitive object={skinMat} attach="material" />
              </mesh>
              {/* Hand / Work Glove */}
              <mesh position={[0, -0.28, 0]}>
                <sphereGeometry args={[0.055, 10, 8]} />
                <primitive object={skinMat} attach="material" />
              </mesh>
            </group>
          </group>

          {/* ── RIGHT ARM ── */}
          <group ref={rightShoulderRef} position={[0.24, 0.44, 0]}>
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.07, 10, 8]} />
              <primitive object={style.isCoat ? MAT.coatWhite : shirtMat} attach="material" />
            </mesh>
            <mesh position={[0, -0.15, 0]} castShadow>
              <cylinderGeometry args={[0.06, 0.05, 0.28, 10]} />
              <primitive object={style.isCoat ? MAT.coatWhite : shirtMat} attach="material" />
            </mesh>
            <group ref={rightElbowRef} position={[0, -0.28, 0]}>
              <mesh position={[0, -0.14, 0]} castShadow>
                <cylinderGeometry args={[0.05, 0.045, 0.26, 10]} />
                <primitive object={skinMat} attach="material" />
              </mesh>
              <mesh position={[0, -0.28, 0]}>
                <sphereGeometry args={[0.055, 10, 8]} />
                <primitive object={skinMat} attach="material" />
              </mesh>
            </group>
          </group>

          {/* ── 3. HEAD & EXPRESSIVE FACE ── */}
          <group ref={headRef} position={[0, 0.68, 0]}>
            {/* Smooth Rounded Head Cranium */}
            <mesh castShadow>
              <sphereGeometry args={[0.16, 16, 14]} />
              <primitive object={skinMat} attach="material" />
            </mesh>

            {/* Stylized Eyes with Pupils and Specular Glint */}
            {[-0.055, 0.055].map((ex, i) => (
              <group key={i} position={[ex, 0.02, 0.14]}>
                {/* Sclera */}
                <mesh>
                  <sphereGeometry args={[0.028, 10, 8]} />
                  <primitive object={eyeWhiteMat} attach="material" />
                </mesh>
                {/* Dark Pupil */}
                <mesh position={[0, 0, 0.02]}>
                  <sphereGeometry args={[0.016, 8, 8]} />
                  <primitive object={eyePupilMat} attach="material" />
                </mesh>
                {/* Specular Highlight */}
                <mesh position={[0.007, 0.007, 0.03]}>
                  <sphereGeometry args={[0.005, 6, 6]} />
                  <meshBasicMaterial color="#ffffff" />
                </mesh>
              </group>
            ))}

            {/* Eyebrows */}
            {[-0.055, 0.055].map((bx, i) => (
              <mesh key={i} position={[bx, 0.065, 0.145]} rotation={[0, 0, (i === 0 ? 1 : -1) * 0.1]}>
                <boxGeometry args={[0.04, 0.01, 0.015]} />
                <primitive object={hairMat} attach="material" />
              </mesh>
            ))}

            {/* Cute Stylized Nose */}
            <mesh position={[0, -0.015, 0.162]}>
              <sphereGeometry args={[0.02, 8, 8]} />
              <primitive object={skinMat} attach="material" />
            </mesh>

            {/* Cheerful Factory Smile */}
            <mesh position={[0, -0.06, 0.142]} rotation={[0.2, 0, 0]}>
              <torusGeometry args={[0.03, 0.008, 6, 10, Math.PI]} />
              <meshStandardMaterial color="#451a03" roughness={0.4} />
            </mesh>

            {/* Natural Hair Layer */}
            <mesh position={[0, 0.07, -0.02]}>
              <sphereGeometry args={[0.168, 14, 12]} />
              <primitive object={hairMat} attach="material" />
            </mesh>
            {/* Front Bangs / Hair Strands */}
            <mesh position={[0, 0.12, 0.1]}>
              <boxGeometry args={[0.16, 0.06, 0.1]} />
              <primitive object={hairMat} attach="material" />
            </mesh>

            {/* Safety Hardhat */}
            {style.hat === 'hardhat' && (
              <group position={[0, 0.07, 0]}>
                <mesh castShadow>
                  <sphereGeometry args={[0.185, 14, 12]} />
                  <primitive object={hardhatMat} attach="material" />
                </mesh>
                {/* Hardhat Visor / Brim */}
                <mesh position={[0, -0.03, 0.09]} rotation={[0.25, 0, 0]}>
                  <boxGeometry args={[0.22, 0.025, 0.14]} />
                  <primitive object={hardhatMat} attach="material" />
                </mesh>
                {/* Team Insignia Band */}
                <mesh position={[0, 0.01, 0]}>
                  <cylinderGeometry args={[0.188, 0.188, 0.04, 14]} />
                  <meshStandardMaterial color="#fbbf24" metalness={0.6} roughness={0.3} />
                </mesh>
              </group>
            )}

            {/* Worker Cap */}
            {style.hat === 'cap' && (
              <group position={[0, 0.07, 0]}>
                <mesh>
                  <sphereGeometry args={[0.178, 14, 12]} />
                  <primitive object={teamMat(team)} attach="material" />
                </mesh>
                <mesh position={[0, -0.02, 0.1]} rotation={[0.2, 0, 0]}>
                  <boxGeometry args={[0.2, 0.02, 0.15]} />
                  <primitive object={teamMat(team)} attach="material" />
                </mesh>
              </group>
            )}
          </group>
        </group>
      </group>

      {/* Role-Specific Custom Props / Tools / Sacks */}
      {customAccessory}
    </group>
  );
};

// ── THE CREW ─────────────────────────────────────────────────────────────
// One component draws any worker. Everything it shows — where they are,
// which way they face, how fast they walk, what they hold and which job
// animation plays — is read from that worker's state in the simulation
// every frame. Nothing here decides anything or animates on its own clock.

const ROLE_STYLE = (team: TeamId, role: WorkerRole, index: number): WorkerStyle => {
  const shirt = team === 'blue' ? '#1d4ed8' : '#b91c1c';
  switch (role) {
    case 'loader':
      return {
        skinTone: index === 0 ? '#e0ac69' : '#a9724a', hairColor: index === 0 ? '#1e293b' : '#451a03',
        shirtColor: shirt, pantsColor: '#1e3a8a', shoesColor: '#451a03',
        isHiVis: true, hat: 'hardhat', heightScale: index === 0 ? 1.02 : 0.98,
      };
    case 'operator':
      return {
        skinTone: '#fed7aa', hairColor: '#1e293b', shirtColor: team === 'blue' ? '#2563eb' : '#dc2626',
        pantsColor: '#1e293b', shoesColor: '#1e293b', isHiVis: true, hat: 'hardhat',
      };
    case 'inspector':
      return {
        skinTone: '#fed7aa', hairColor: '#b45309', shirtColor: '#ffffff', pantsColor: '#334155',
        shoesColor: '#f8fafc', isCoat: true, hat: 'none', heightScale: 0.97,
      };
    case 'packer':
      return {
        skinTone: '#e0ac69', hairColor: '#1e293b', shirtColor: team === 'blue' ? '#2563eb' : '#dc2626',
        pantsColor: '#1e3a8a', shoesColor: '#1e293b', isHiVis: true, hat: 'cap',
      };
    case 'hauler':
    default:
      return {
        skinTone: '#c68642', hairColor: '#0f172a', shirtColor: '#f97316', pantsColor: '#1e293b',
        shoesColor: '#1e293b', isHiVis: true, hat: 'hardhat', heightScale: 1.03,
      };
  }
};

const workerAt = (team: TeamId, index: number): Worker | undefined => sim[team].crew[index];

/** Props held by a worker, in the body's own (scaled) space: +Z is in front of them. */
const WorkerProps: React.FC<{ team: TeamId; index: number; role: WorkerRole }> = ({ team, index, role }) => {
  const sack = useRef<THREE.Group>(null);
  const beans = useRef<THREE.Group>(null);
  const box = useRef<THREE.Group>(null);
  const tablet = useRef<THREE.Group>(null);
  const clipboard = useRef<THREE.Group>(null);

  useFrame((state) => {
    const w = workerAt(team, index);
    if (!w) return;
    const t = state.clock.elapsedTime;
    const pouring = w.state === 'PERFORM_TASK' && w.anim === 'pour';

    if (sack.current) {
      sack.current.visible = w.carry === 'sack';
      if (pouring) {
        sack.current.position.set(0, 1.62, 0.5);
        sack.current.rotation.set(1.15, 0, 0);
      } else {
        sack.current.position.set(0, 1.02 + (w.moving ? Math.abs(Math.sin(t * 9)) * 0.02 : 0), 0.34);
        sack.current.rotation.set(0, 0, 0);
      }
    }
    if (beans.current) {
      beans.current.visible = pouring && w.carry === 'sack';
      beans.current.children.forEach((b, i) => { b.position.y = 1.35 - (((t * 1.9) + i * 0.25) % 1) * 1.1; });
    }
    if (box.current) {
      box.current.visible = w.carry === 'box';
      box.current.position.set(0, 1.0, 0.4);
    }
    if (tablet.current) {
      tablet.current.visible = role === 'operator' && !w.moving && w.anim !== 'operate';
    }
    if (clipboard.current) {
      clipboard.current.visible = role === 'inspector';
    }
  });

  return (
    <>
      {/* burlap cocoa sack */}
      <group ref={sack} visible={false}>
        <mesh castShadow>
          <boxGeometry args={[0.34, 0.44, 0.24]} />
          <meshStandardMaterial color="#c99a63" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.06, 0.11, 0.09, 10]} />
          <meshStandardMaterial color="#b45309" roughness={0.95} />
        </mesh>
        <mesh position={[0, 0, 0.125]}>
          <boxGeometry args={[0.16, 0.16, 0.01]} />
          <meshStandardMaterial color="#4a2410" roughness={0.7} />
        </mesh>
      </group>

      {/* cocoa pouring from the sack mouth into the tank */}
      <group ref={beans} visible={false} position={[0, 0, 0.78]}>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i}>
            <sphereGeometry args={[0.05, 8, 6]} />
            <meshStandardMaterial color="#4a2410" roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* a sealed chocolate box */}
      <group ref={box} visible={false}>
        <mesh castShadow>
          <boxGeometry args={[0.36, 0.24, 0.28]} />
          <meshStandardMaterial color={team === 'blue' ? '#1d4ed8' : '#b91c1c'} roughness={0.5} />
        </mesh>
        <mesh>
          <boxGeometry args={[0.05, 0.245, 0.285]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* operator's tablet */}
      <group ref={tablet} position={[0.06, 1.0, 0.3]} rotation={[-0.5, 0, 0]} visible={false}>
        <mesh>
          <boxGeometry args={[0.19, 0.26, 0.015]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0, -0.009]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[0.16, 0.23]} />
          <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.9} />
        </mesh>
      </group>

      {/* inspector's clipboard */}
      <group ref={clipboard} position={[-0.14, 1.0, 0.28]} rotation={[-0.6, 0.3, 0]} visible={false}>
        <mesh>
          <boxGeometry args={[0.16, 0.23, 0.012]} />
          <meshStandardMaterial color="#84562b" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.01, -0.008]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[0.13, 0.19]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.9} />
        </mesh>
      </group>
    </>
  );
};

export const CrewMember3D: React.FC<{ team: TeamId; index: number }> = ({ team, index }) => {
  const role = sim[team].crew[index]?.role ?? 'loader';
  const loaderIndex = role === 'loader' ? index : 0;
  const style = useMemo(() => ROLE_STYLE(team, role, loaderIndex), [team, role, loaderIndex]);

  const read = (): PersonState => {
    const w = workerAt(team, index);
    if (!w) return { pos: { x: 0, y: 0, z: 0 }, heading: 0, moving: false, speed: 0, carrying: false, pushing: false, anim: 'idle' };
    return {
      pos: w.pos,
      heading: w.heading,
      moving: w.moving,
      speed: w.speed,
      carrying: w.carry !== 'none',
      pushing: w.pushingCart,
      anim: w.anim,
    };
  };

  return (
    <ArticulatedHuman3D
      style={style}
      team={team}
      read={read}
      customAccessory={<WorkerProps team={team} index={index} role={role} />}
    />
  );
};

/** Every worker on one team's floor. */
export const TeamCrew3D: React.FC<{ team: TeamId }> = ({ team }) => (
  <>
    {sim[team].crew.map((w, i) => <CrewMember3D key={w.id} team={team} index={i} />)}
  </>
);

// ── THE HAULER'S CART ────────────────────────────────────────────────────

export const Cart3D: React.FC<{ team: TeamId }> = ({ team }) => {
  const g = useRef<THREE.Group>(null);
  const boxes = useRef<THREE.Group>(null);
  const wheels = useRef<THREE.Group>(null);
  const last = useRef({ x: 0, z: 0 });

  useFrame(() => {
    const c = sim[team].cart;
    if (!g.current) return;
    const moved = Math.hypot(c.pos.x - last.current.x, c.pos.z - last.current.z);
    last.current = { x: c.pos.x, z: c.pos.z };
    g.current.position.set(c.pos.x, 0, c.pos.z);
    // Modelled with the handle toward local -Z, the side the hauler pushes from.
    g.current.rotation.y = c.heading + Math.PI;
    if (boxes.current) boxes.current.children.forEach((b, i) => { b.visible = i < c.boxes; });
    if (wheels.current && moved < 1) wheels.current.children.forEach((wh) => { wh.rotation.x += moved / 0.16; });
  });

  const boxMat = team === 'blue' ? MAT.boxBlue : MAT.boxRed;
  return (
    <group ref={g}>
      {/* deck */}
      <mesh geometry={GEO.box} material={MAT.steelDark} position={[0, 0.42, 0]} scale={[0.95, 0.08, 1.35]} castShadow receiveShadow />
      <mesh geometry={GEO.box} material={teamMat(team)} position={[0, 0.47, 0]} scale={[0.97, 0.03, 1.37]} />
      {/* push handle */}
      {[-0.4, 0.4].map((x) => (
        <mesh key={x} geometry={GEO.box} material={MAT.steel} position={[x, 0.78, -0.66]} scale={[0.05, 0.72, 0.05]} />
      ))}
      <mesh geometry={GEO.box} material={MAT.steel} position={[0, 1.13, -0.66]} scale={[0.86, 0.05, 0.05]} />
      {/* wheels */}
      <group ref={wheels}>
        {[[-0.4, -0.5], [0.4, -0.5], [-0.4, 0.5], [0.4, 0.5]].map(([x, z]) => (
          <mesh key={`${x}${z}`} geometry={GEO.cylLow} material={MAT.steelDark}
            position={[x, 0.16, z]} rotation={[0, 0, Math.PI / 2]} scale={[0.32, 0.1, 0.32]} />
        ))}
      </group>
      {/* boxes riding on the deck */}
      <group ref={boxes}>
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh key={i} geometry={GEO.box} material={boxMat}
            position={[(i % 2) * 0.44 - 0.22, 0.66 + Math.floor(i / 4) * 0.38, Math.floor(i / 2) % 2 === 0 ? -0.25 : 0.25]}
            scale={[0.4, 0.36, 0.44]} castShadow visible={false} />
        ))}
      </group>
    </group>
  );
};

// ── 5. SEATED FORKLIFT DRIVER ───────────────────────────────────────────
// Seated in the forklift cab, hands on steering wheel and hydraulic levers.

export const SeatedDriver3D: React.FC<{ team: TeamId }> = ({ team }) => {
  const headRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 1.6) * 0.25;
    }
  });

  return (
    <group position={[0, 0.65, 0.24]}>
      {/* Thighs / Legs on Pedals */}
      <mesh position={[-0.12, 0.16, -0.22]} rotation={[-Math.PI / 2.8, 0, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.06, 0.38, 10]} />
        <meshStandardMaterial color="#1e3a8a" roughness={0.7} />
      </mesh>
      <mesh position={[0.12, 0.16, -0.22]} rotation={[-Math.PI / 2.8, 0, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.06, 0.38, 10]} />
        <meshStandardMaterial color="#1e3a8a" roughness={0.7} />
      </mesh>

      {/* Torso with Hi-Vis Vest */}
      <mesh position={[0, 0.44, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.17, 0.44, 12]} />
        <meshStandardMaterial color="#facc15" roughness={0.6} />
      </mesh>
      {/* Reflective Band */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.205, 0.2, 0.05, 12]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Arms Gripping Steering Wheel & Levers */}
      <mesh position={[-0.18, 0.44, -0.2]} rotation={[-0.7, 0.3, 0]}>
        <cylinderGeometry args={[0.05, 0.045, 0.36, 10]} />
        <meshStandardMaterial color={team === 'blue' ? '#1d4ed8' : '#b91c1c'} roughness={0.7} />
      </mesh>
      <mesh position={[0.18, 0.44, -0.2]} rotation={[-0.7, -0.3, 0]}>
        <cylinderGeometry args={[0.05, 0.045, 0.36, 10]} />
        <meshStandardMaterial color={team === 'blue' ? '#1d4ed8' : '#b91c1c'} roughness={0.7} />
      </mesh>

      {/* Head with Safety Hardhat */}
      <group ref={headRef} position={[0, 0.82, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.15, 14, 12]} />
          <meshStandardMaterial color="#e0ac69" roughness={0.65} />
        </mesh>
        {/* Safety Hardhat */}
        <mesh position={[0, 0.06, 0]} castShadow>
          <sphereGeometry args={[0.175, 14, 12]} />
          <meshStandardMaterial color={team === 'blue' ? '#3b82f6' : '#ef4444'} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.02, 0.08]} rotation={[0.2, 0, 0]}>
          <boxGeometry args={[0.2, 0.025, 0.12]} />
          <meshStandardMaterial color={team === 'blue' ? '#3b82f6' : '#ef4444'} roughness={0.4} />
        </mesh>
      </group>
    </group>
  );
};
