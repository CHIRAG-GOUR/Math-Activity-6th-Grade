// ============================================================
// RATIO RUSH — STUDIO CHARACTERS & CREW 3D (BLENDER-GRADE HUMANOIDS)
// High-fidelity stylized 3D human models with connected anatomical joints:
// 1. Director (Wearing authentic Director Cap with curved brim, headphones on neck, megaphone)
// 2. Lead Actress (Emerald & gold cinematic gown, flowing hair over shoulders, dramatic acting)
// 3. Lead Actor / Hero (Action jacket with lapels & badge, styled hair, action boots)
// 4. Co-star / Friend (Chic studio outfit, blonde bob hairstyle)
// 5. Inventor (Field lab coat with goggles & utility pouches)
// 6. Villain (Doublet coat, high standing collar & crimson cape)
// 7. Camera Operator (Positioned beside tripod with hands on pan bars, crew cap & lanyard)
// 8. Sound Crew (Over-ear studio headphones & boom microphone)
// ============================================================

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  ActorRole,
  beatAt,
  markAt,
  poseFor,
  speechEnergy,
  OPENING_MARKS,
  PoseTargets,
  lineAt,
  sceneClock,
} from './StudioPerformance';
import {
  geoBox,
  geoCylinder8,
  geoCylinder12,
  geoCylinder16,
  geoSphere12,
  geoSphere16,
  geoPlane,
  getStudioMaterial,
  MAT_STEEL_DARK,
  MAT_STEEL_BRIGHT,
  MAT_ROAD_CASE_BLACK,
  MAT_STAGE_TAPE_YELLOW,
  MAT_STAGE_TAPE_RED,
  MAT_SKIN_PEACH,
  MAT_SKIN_WARM,
  MAT_SKIN_BRONZE,
  MAT_EYE_WHITE,
  MAT_EYE_PUPIL,
  MAT_LIPS_ROSE,
  MAT_HAIR_BRUNETTE,
  MAT_HAIR_BLACK,
  MAT_HAIR_BLONDE,
  MAT_HAIR_AUBURN,
  MAT_DIRECTOR_CAP,
  MAT_DIRECTOR_CAP_BRIM,
  MAT_GOWN_EMERALD,
  MAT_GOWN_GOLD,
  MAT_JACKET_HERO,
  MAT_JACKET_LEATHER,
  MAT_GOLD_BRASS,
} from './StudioMaterials';

// ── Sharp Dynamic Canvas Texture for Director's Shirt Back ──
function createDirectorShirtBackTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // Dark Slate / Black Jacket Fabric
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 512, 256);

    // Bold Gold Border Frame
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 14;
    ctx.strokeRect(16, 16, 480, 224);

    // Inner White Accent Frame
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.strokeRect(26, 26, 460, 204);

    // Header Stars
    ctx.fillStyle = '#fde047';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('★  CINEMA PRODUCTION  ★', 256, 64);

    // HUGE BOLD "DIRECTOR"
    ctx.fillStyle = '#facc15';
    ctx.font = '900 84px "Arial Black", Impact, sans-serif';
    ctx.fillText('DIRECTOR', 256, 154);

    // Underline Accent Stripes
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(70, 172, 372, 10);
    ctx.fillStyle = '#eab308';
    ctx.fillRect(140, 188, 232, 6);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Where each actor is standing right now, published by their own rig so the
 * others can turn and look at whoever currently has the line.
 */
const ACTOR_STAGE_POS: Record<string, THREE.Vector2> = {
  lead_actor: new THREE.Vector2(...OPENING_MARKS.lead_actor),
  lead_actress: new THREE.Vector2(...OPENING_MARKS.lead_actress),
  co_star: new THREE.Vector2(...OPENING_MARKS.co_star),
  villain: new THREE.Vector2(...OPENING_MARKS.villain),
};

export interface BlenderHumanProps {
  position: [number, number, number];
  rotationY?: number;
  characterType:
    | 'director'
    | 'lead_actress'
    | 'lead_actor'
    | 'co_star'
    | 'inventor'
    | 'villain'
    | 'camera_op'
    | 'boom_op'
    | 'photographer'
    | 'dolly_grip';
  skinMat?: THREE.MeshStandardMaterial;
  hairMat?: THREE.MeshStandardMaterial;
  pose?: 'directing' | 'acting_dramatic' | 'acting_hero' | 'filming' | 'boom_mic' | 'photo' | 'idle';
  isFilming?: boolean;
  scale?: number;
  /** Actors are driven by the scene script; crew keep their working poses. */
  role?: ActorRole;
}

export const BlenderHumanoid: React.FC<BlenderHumanProps> = React.memo(
  ({
    position,
    rotationY = 0,
    characterType,
    skinMat = MAT_SKIN_PEACH,
    hairMat = MAT_HAIR_BRUNETTE,
    pose = 'idle',
    isFilming = false,
    scale = 1,
    role,
  }) => {
    const leftArmRef = useRef<THREE.Group>(null);
    const rightArmRef = useRef<THREE.Group>(null);
    const leftElbowRef = useRef<THREE.Group>(null);
    const rightElbowRef = useRef<THREE.Group>(null);
    const headRef = useRef<THREE.Group>(null);
    const bodyRootRef = useRef<THREE.Group>(null);
    const stageRef = useRef<THREE.Group>(null);

    const directorShirtBackMaterial = useMemo(() => {
      if (typeof document === 'undefined') return MAT_ROAD_CASE_BLACK;
      const tex = createDirectorShirtBackTexture();
      return new THREE.MeshStandardMaterial({
        map: tex,
        roughness: 0.5,
        metalness: 0.1,
      });
    }, []);

    // Eased joint state, so the cast move INTO a pose instead of snapping to it.
    const held = useRef<PoseTargets>({
      lShoulderX: -0.06, lShoulderZ: 0.11, rShoulderX: -0.06, rShoulderZ: -0.11,
      lElbow: 0.22, rElbow: 0.22, headPitch: 0, headYaw: 0, headRoll: 0,
      torsoLean: 0, torsoTwist: 0,
    });
    const heldPos = useRef(new THREE.Vector2(position[0], position[2]));
    const heldFacing = useRef(rotationY);

    useFrame((state, delta) => {
      const t = state.clock.getElapsedTime();
      const breath = Math.sin(t * 2.0) * 0.015;
      const k = 1 - Math.exp(-6 * Math.min(delta, 0.05));

      // ══ ACTORS — perform the scripted scene ══
      if (role) {
        const sceneTime = sceneClock.time;
        const performing = sceneTime !== null;
        const st = performing ? sceneTime : 0;
        const beat = beatAt(st);
        const speaking = performing && beat.speaker === role;
        const gesture = performing ? beat.gesture[role] ?? 'rest' : 'rest';
        const energy = speaking ? speechEnergy(t) : 0;

        // 1. Walk onto the mark this beat calls for.
        const mark = performing ? markAt(role, st) : OPENING_MARKS[role];
        heldPos.current.x += (mark[0] - heldPos.current.x) * k * 0.5;
        heldPos.current.y += (mark[1] - heldPos.current.y) * k * 0.5;
        if (stageRef.current) {
          stageRef.current.position.x = heldPos.current.x - position[0];
          stageRef.current.position.z = heldPos.current.y - position[2];
        }
        ACTOR_STAGE_POS[role] = heldPos.current;

        // 2. Turn toward whoever they are playing the beat with.
        const focus = performing ? beat.focus[role] : undefined;
        let wantFacing = 0;
        if (focus && focus !== 'camera') {
          const other = ACTOR_STAGE_POS[focus];
          if (other) {
            wantFacing = Math.atan2(other.x - heldPos.current.x, other.y - heldPos.current.y);
          }
        }
        let dFace = wantFacing - heldFacing.current;
        while (dFace > Math.PI) dFace -= Math.PI * 2;
        while (dFace < -Math.PI) dFace += Math.PI * 2;
        heldFacing.current += dFace * k * 0.6;
        if (stageRef.current) stageRef.current.rotation.y = heldFacing.current - rotationY;

        // 3. Ease every joint toward the gesture for this beat.
        const want = poseFor(gesture, energy, t);
        const h = held.current;
        (Object.keys(want) as (keyof PoseTargets)[]).forEach((key) => {
          h[key] += (want[key] - h[key]) * k;
        });

        // 4. Apply, with breathing and a speaking head bob on top.
        if (bodyRootRef.current) {
          bodyRootRef.current.position.y = breath * 1.2;
          bodyRootRef.current.rotation.x = h.torsoLean * 0.35;
          bodyRootRef.current.rotation.y = h.torsoTwist;
          bodyRootRef.current.rotation.z = Math.cos(t * 1.6) * 0.012;
        }
        if (headRef.current) {
          const talkBob = speaking ? Math.sin(t * 5.2) * 0.05 * energy : 0;
          headRef.current.rotation.x = h.headPitch + talkBob;
          headRef.current.rotation.y = h.headYaw + Math.sin(t * 0.8) * 0.03;
          headRef.current.rotation.z = h.headRoll;
        }
        if (leftArmRef.current) leftArmRef.current.rotation.set(h.lShoulderX, 0, h.lShoulderZ);
        if (rightArmRef.current) rightArmRef.current.rotation.set(h.rShoulderX, 0, h.rShoulderZ);
        if (leftElbowRef.current) leftElbowRef.current.rotation.x = -h.lElbow;
        if (rightElbowRef.current) rightElbowRef.current.rotation.x = -h.rElbow;
        return;
      }

      // ══ CREW — hands on their own gear, arms down otherwise ══
      if (characterType === 'director') {
        if (bodyRootRef.current) {
          bodyRootRef.current.position.y = breath;
          bodyRootRef.current.rotation.y = Math.sin(t * 1.6) * 0.06;
        }
        if (headRef.current) {
          headRef.current.rotation.y = Math.sin(t * 1.4) * 0.18;
          headRef.current.rotation.x = Math.cos(t * 1.8) * 0.05;
        }
        // Megaphone comes up to the mouth only while the camera is rolling.
        if (rightArmRef.current) rightArmRef.current.rotation.set(isFilming ? -1.15 : -0.35, 0, -0.2);
        if (rightElbowRef.current) rightElbowRef.current.rotation.x = isFilming ? -1.7 : -0.7;
        if (leftArmRef.current) leftArmRef.current.rotation.set(-0.2 + Math.cos(t * 1.6) * 0.1, 0, 0.22);
        if (leftElbowRef.current) leftElbowRef.current.rotation.x = -1.1;
      } else if (characterType === 'camera_op') {
        if (headRef.current) headRef.current.rotation.set(0.08, Math.sin(t * 1.2) * 0.08, 0);
        if (leftArmRef.current) leftArmRef.current.rotation.set(-0.72, 0.16, 0.16);
        if (rightArmRef.current) rightArmRef.current.rotation.set(-0.72, -0.16, -0.16);
        if (leftElbowRef.current) leftElbowRef.current.rotation.x = -1.15 - Math.sin(t * 1.2) * 0.05;
        if (rightElbowRef.current) rightElbowRef.current.rotation.x = -1.15 + Math.sin(t * 1.2) * 0.05;
      } else if (characterType === 'boom_op') {
        if (headRef.current) headRef.current.rotation.set(-0.15, Math.sin(t * 1.5) * 0.1, 0);
        if (leftArmRef.current) leftArmRef.current.rotation.set(-2.0 + Math.cos(t * 1.5) * 0.05, 0, 0.18);
        if (rightArmRef.current) rightArmRef.current.rotation.set(-1.75 + Math.sin(t * 1.5) * 0.05, 0, -0.18);
        if (leftElbowRef.current) leftElbowRef.current.rotation.x = -0.45;
        if (rightElbowRef.current) rightElbowRef.current.rotation.x = -0.6;
      } else if (characterType === 'photographer') {
        if (headRef.current) headRef.current.rotation.set(0.05, Math.sin(t * 2.0) * 0.1, 0);
        if (leftArmRef.current) leftArmRef.current.rotation.set(-0.85, 0.2, 0.2);
        if (rightArmRef.current) rightArmRef.current.rotation.set(-0.9, -0.15, -0.2);
        if (leftElbowRef.current) leftElbowRef.current.rotation.x = -1.5 - Math.sin(t * 2.0) * 0.06;
        if (rightElbowRef.current) rightElbowRef.current.rotation.x = -1.55;
      } else {
        // Grips, inventor and anyone else: relaxed, shifting their weight.
        if (bodyRootRef.current) {
          bodyRootRef.current.position.y = breath;
          bodyRootRef.current.rotation.y = Math.sin(t * 0.9) * 0.05;
        }
        if (headRef.current) {
          headRef.current.rotation.y = Math.sin(t * 1.1) * 0.12;
          headRef.current.rotation.x = Math.cos(t * 1.4) * 0.03;
        }
        if (leftArmRef.current) leftArmRef.current.rotation.set(-0.08 + breath, 0, 0.12);
        if (rightArmRef.current) rightArmRef.current.rotation.set(-0.08 - breath, 0, -0.12);
        if (leftElbowRef.current) leftElbowRef.current.rotation.x = -0.3;
        if (rightElbowRef.current) rightElbowRef.current.rotation.x = -0.3;
      }
    });

    // Outfit Color Tokens
    const pantsMat =
      characterType === 'lead_actress'
        ? MAT_GOWN_EMERALD
        : characterType === 'director'
        ? getStudioMaterial('#334155', 0.6)
        : characterType === 'lead_actor'
        ? getStudioMaterial('#1e293b', 0.6)
        : characterType === 'villain'
        ? getStudioMaterial('#1e1b4b', 0.6)
        : getStudioMaterial('#0f172a', 0.6);

    const shirtMat =
      characterType === 'lead_actress'
        ? MAT_GOWN_EMERALD
        : characterType === 'director'
        ? MAT_DIRECTOR_CAP
        : characterType === 'lead_actor'
        ? MAT_JACKET_HERO
        : characterType === 'co_star'
        ? getStudioMaterial('#0d9488')
        : characterType === 'inventor'
        ? getStudioMaterial('#f8fafc')
        : characterType === 'villain'
        ? getStudioMaterial('#581c87')
        : getStudioMaterial('#1e293b');

    return (
      <group position={position} rotation={[0, rotationY, 0]} scale={[scale, scale, scale]}>
       <group ref={stageRef}>
        <group ref={bodyRootRef}>
          {/* ═════════════════════════════════════════════════════════ */}
          {/* 1. SOLID GROUNDED LEGS & SNEAKERS (From Y=0 to Y=0.88)     */}
          {/* ═════════════════════════════════════════════════════════ */}
          {/* Left Leg */}
          <group position={[-0.13, 0, 0]}>
            {/* Sneaker Sole */}
            <mesh
              geometry={geoBox}
              material={MAT_STEEL_BRIGHT}
              scale={[0.13, 0.04, 0.24]}
              position={[0, 0.02, 0.04]}
            />
            {/* Sneaker Body */}
            <mesh
              geometry={geoBox}
              material={characterType === 'lead_actor' ? MAT_JACKET_LEATHER : MAT_ROAD_CASE_BLACK}
              scale={[0.12, 0.08, 0.22]}
              position={[0, 0.08, 0.04]}
            />
            {/* White Toe Cap / Laces */}
            <mesh
              geometry={geoBox}
              material={MAT_STEEL_BRIGHT}
              scale={[0.08, 0.04, 0.08]}
              position={[0, 0.09, 0.11]}
            />
            {/* Calf / Lower Leg (Y: 0.12 → 0.48) */}
            <mesh
              geometry={geoCylinder16}
              material={pantsMat}
              scale={[0.065, 0.36, 0.065]}
              position={[0, 0.3, 0]}
            />
            {/* Knee Joint (Y: 0.48) */}
            <mesh
              geometry={geoSphere12}
              material={pantsMat}
              scale={[0.07, 0.07, 0.07]}
              position={[0, 0.48, 0.01]}
            />
            {/* Thigh / Upper Leg (Y: 0.48 → 0.88) */}
            <mesh
              geometry={geoCylinder16}
              material={pantsMat}
              scale={[0.075, 0.38, 0.075]}
              position={[0, 0.68, 0]}
            />
          </group>

          {/* Right Leg */}
          <group position={[0.13, 0, 0]}>
            <mesh
              geometry={geoBox}
              material={MAT_STEEL_BRIGHT}
              scale={[0.13, 0.04, 0.24]}
              position={[0, 0.02, 0.04]}
            />
            <mesh
              geometry={geoBox}
              material={characterType === 'lead_actor' ? MAT_JACKET_LEATHER : MAT_ROAD_CASE_BLACK}
              scale={[0.12, 0.08, 0.22]}
              position={[0, 0.08, 0.04]}
            />
            <mesh
              geometry={geoBox}
              material={MAT_STEEL_BRIGHT}
              scale={[0.08, 0.04, 0.08]}
              position={[0, 0.09, 0.11]}
            />
            <mesh
              geometry={geoCylinder16}
              material={pantsMat}
              scale={[0.065, 0.36, 0.065]}
              position={[0, 0.3, 0]}
            />
            <mesh
              geometry={geoSphere12}
              material={pantsMat}
              scale={[0.07, 0.07, 0.07]}
              position={[0, 0.48, 0.01]}
            />
            <mesh
              geometry={geoCylinder16}
              material={pantsMat}
              scale={[0.075, 0.38, 0.075]}
              position={[0, 0.68, 0]}
            />
          </group>

          {/* ═════════════════════════════════════════════════════════ */}
          {/* 2. CONTINUOUS TORSO & COSTUME (From Y=0.88 to Y=1.40)      */}
          {/* ═════════════════════════════════════════════════════════ */}
          {/* Hips / Pelvis (Y: 0.88) */}
          <mesh
            geometry={geoCylinder16}
            material={pantsMat}
            scale={[0.19, 0.14, 0.14]}
            position={[0, 0.88, 0]}
          />
          {/* Belt & Metallic Buckle */}
          <mesh
            geometry={geoCylinder16}
            material={MAT_ROAD_CASE_BLACK}
            scale={[0.2, 0.04, 0.15]}
            position={[0, 0.94, 0]}
          />
          <mesh
            geometry={geoBox}
            material={MAT_GOLD_BRASS}
            scale={[0.06, 0.05, 0.02]}
            position={[0, 0.94, 0.15]}
          />

          {/* Mid-Torso / Waist (Y: 0.98 → 1.18) */}
          <mesh
            geometry={geoCylinder16}
            material={shirtMat}
            scale={[0.19, 0.22, 0.14]}
            position={[0, 1.08, 0]}
          />

          {/* Upper Chest & Shoulders (Y: 1.18 → 1.40) */}
          <mesh
            geometry={geoCylinder16}
            material={shirtMat}
            scale={[0.23, 0.24, 0.16]}
            position={[0, 1.28, 0]}
          />

          {/* ── Costumes Details ── */}
          {characterType === 'lead_actress' && (
            <group>
              {/* Flared Gown Skirt flowing smoothly down */}
              <mesh
                geometry={geoCylinder16}
                material={MAT_GOWN_EMERALD}
                scale={[0.26, 0.72, 0.24]}
                position={[0, 0.52, 0]}
              />
              {/* Gold Ribbon Belt */}
              <mesh
                geometry={geoCylinder16}
                material={MAT_GOWN_GOLD}
                scale={[0.21, 0.04, 0.15]}
                position={[0, 0.96, 0]}
              />
            </group>
          )}

          {characterType === 'lead_actor' && (
            <group>
              {/* Action Jacket Lapels */}
              <mesh
                geometry={geoBox}
                material={MAT_JACKET_HERO}
                scale={[0.28, 0.32, 0.06]}
                position={[0, 1.26, 0.12]}
              />
              {/* Golden Insignia Star */}
              <mesh
                geometry={geoBox}
                material={MAT_GOLD_BRASS}
                scale={[0.05, 0.05, 0.02]}
                position={[-0.09, 1.32, 0.16]}
              />
            </group>
          )}

          {characterType === 'director' && (
            <group>
              {/* Flannel Collar Trim on Front */}
              <mesh
                geometry={geoBox}
                material={getStudioMaterial('#e2e8f0')}
                scale={[0.14, 0.08, 0.04]}
                position={[0, 1.36, 0.14]}
              />
              {/* Walkie-Talkie Clip */}
              <mesh
                geometry={geoBox}
                material={MAT_ROAD_CASE_BLACK}
                scale={[0.05, 0.12, 0.04]}
                position={[0.16, 0.95, 0.12]}
              />
              <mesh
                geometry={geoCylinder8}
                material={MAT_STEEL_DARK}
                scale={[0.01, 0.08, 0.01]}
                position={[0.16, 1.04, 0.12]}
              />

              {/* ── BOLD "DIRECTOR" PRINT ON BACK OF SHIRT (Facing Viewer/Camera) ── */}
              <mesh
                geometry={geoPlane}
                material={directorShirtBackMaterial}
                scale={[0.38, 0.20, 1]}
                position={[0, 1.20, -0.13]}
                rotation={[0, Math.PI, 0]}
              />
              {/* Gold Accent Stitching Border on Back of Jacket */}
              <mesh
                geometry={geoBox}
                material={MAT_STAGE_TAPE_YELLOW}
                scale={[0.40, 0.22, 0.01]}
                position={[0, 1.20, -0.126]}
              />
            </group>
          )}

          {characterType === 'villain' && (
            <group>
              {/* High Standing Doublet Collar */}
              <mesh
                geometry={geoBox}
                material={getStudioMaterial('#3b0764')}
                scale={[0.3, 0.18, 0.08]}
                position={[0, 1.44, -0.06]}
              />
              {/* Flowing Crimson Cape */}
              <mesh
                geometry={geoBox}
                material={MAT_STAGE_TAPE_RED}
                scale={[0.48, 1.05, 0.03]}
                position={[0, 0.9, -0.16]}
                rotation={[-0.1, 0, 0]}
              />
            </group>
          )}

          {characterType === 'inventor' && (
            <group>
              {/* Tool Sash */}
              <mesh
                geometry={geoBox}
                material={MAT_JACKET_LEATHER}
                scale={[0.06, 0.48, 0.28]}
                position={[-0.04, 1.18, 0]}
                rotation={[0, 0, 0.35]}
              />
            </group>
          )}

          {/* ═════════════════════════════════════════════════════════ */}
          {/* 3. SOLID CONNECTED SHOULDERS & ARMS (Y=1.35)              */}
          {/* ═════════════════════════════════════════════════════════ */}
          {/* Left Arm */}
          <group ref={leftArmRef} position={[-0.24, 1.34, 0]}>
            {/* Shoulder Sphere */}
            <mesh geometry={geoSphere12} material={shirtMat} scale={[0.08, 0.08, 0.08]} />
            {/* Bicep (Upper Arm) */}
            <mesh
              geometry={geoCylinder16}
              material={characterType === 'lead_actress' ? skinMat : shirtMat}
              scale={[0.055, 0.26, 0.055]}
              position={[0, -0.14, 0]}
            />
            {/* Forearm pivots at the elbow, so hands can reach the chest and point */}
            <group ref={leftElbowRef} position={[0, -0.28, 0]}>
              {/* Elbow Sphere */}
              <mesh
                geometry={geoSphere12}
                material={skinMat}
                scale={[0.055, 0.055, 0.055]}
              />
              {/* Forearm */}
              <mesh
                geometry={geoCylinder16}
                material={skinMat}
                scale={[0.05, 0.24, 0.05]}
                position={[0, -0.12, 0]}
              />
              {/* Hand & Palm */}
              <mesh
                geometry={geoSphere12}
                material={skinMat}
                scale={[0.055, 0.07, 0.045]}
                position={[0, -0.26, 0]}
              />
            </group>
          </group>

          {/* Right Arm */}
          <group ref={rightArmRef} position={[0.24, 1.34, 0]}>
            <mesh geometry={geoSphere12} material={shirtMat} scale={[0.08, 0.08, 0.08]} />
            <mesh
              geometry={geoCylinder16}
              material={characterType === 'lead_actress' ? skinMat : shirtMat}
              scale={[0.055, 0.26, 0.055]}
              position={[0, -0.14, 0]}
            />
            <group ref={rightElbowRef} position={[0, -0.28, 0]}>
              <mesh
                geometry={geoSphere12}
                material={skinMat}
                scale={[0.055, 0.055, 0.055]}
              />
              <mesh
                geometry={geoCylinder16}
                material={skinMat}
                scale={[0.05, 0.24, 0.05]}
                position={[0, -0.12, 0]}
              />
              <mesh
                geometry={geoSphere12}
                material={skinMat}
                scale={[0.055, 0.07, 0.045]}
                position={[0, -0.26, 0]}
              />
            </group>
          </group>

          {/* ═════════════════════════════════════════════════════════ */}
          {/* 4. SOLID CONNECTED NECK & HEAD (Y=1.38 → Y=1.65)           */}
          {/* ═════════════════════════════════════════════════════════ */}
          {/* Solid Neck (Embedded into Chest) */}
          <mesh
            geometry={geoCylinder16}
            material={skinMat}
            scale={[0.07, 0.16, 0.07]}
            position={[0, 1.44, 0]}
          />

          {/* Head & Facial Group (Centered at Y=1.62, seamless with Neck) */}
          <group ref={headRef} position={[0, 1.62, 0]}>
            {/* Smooth Oval Head */}
            <mesh
              geometry={geoSphere16}
              material={skinMat}
              scale={[0.15, 0.17, 0.15]}
            />

            {/* ── 3D FACIAL FEATURES ── */}
            {/* Left Eye */}
            <group position={[-0.048, 0.02, 0.138]}>
              <mesh geometry={geoSphere12} material={MAT_EYE_WHITE} scale={[0.026, 0.022, 0.015]} />
              <mesh geometry={geoSphere12} material={MAT_EYE_PUPIL} scale={[0.014, 0.014, 0.012]} position={[0, 0, 0.008]} />
            </group>
            {/* Right Eye */}
            <group position={[0.048, 0.02, 0.138]}>
              <mesh geometry={geoSphere12} material={MAT_EYE_WHITE} scale={[0.026, 0.022, 0.015]} />
              <mesh geometry={geoSphere12} material={MAT_EYE_PUPIL} scale={[0.014, 0.014, 0.012]} position={[0, 0, 0.008]} />
            </group>

            {/* Eyebrows */}
            <mesh
              geometry={geoBox}
              material={hairMat}
              scale={[0.045, 0.012, 0.02]}
              position={[-0.048, 0.052, 0.14]}
              rotation={[0, 0, 0.08]}
            />
            <mesh
              geometry={geoBox}
              material={hairMat}
              scale={[0.045, 0.012, 0.02]}
              position={[0.048, 0.052, 0.14]}
              rotation={[0, 0, -0.08]}
            />

            {/* Cute Stylized Nose */}
            <mesh
              geometry={geoBox}
              material={skinMat}
              scale={[0.025, 0.04, 0.03]}
              position={[0, -0.015, 0.155]}
            />

            {/* Expressive Lips */}
            <mesh
              geometry={geoBox}
              material={MAT_LIPS_ROSE}
              scale={[0.05, 0.018, 0.015]}
              position={[0, -0.065, 0.142]}
            />

            {/* Left & Right Ears */}
            <mesh
              geometry={geoSphere12}
              material={skinMat}
              scale={[0.03, 0.05, 0.025]}
              position={[-0.155, 0, 0]}
            />
            <mesh
              geometry={geoSphere12}
              material={skinMat}
              scale={[0.03, 0.05, 0.025]}
              position={[0.155, 0, 0]}
            />

            {/* ── 3D HAIRSTYLES & HATS ── */}
            {/* 1. DIRECTOR: AUTHENTIC 3D DIRECTOR BASEBALL CAP */}
            {characterType === 'director' && (
              <group position={[0, 0.04, 0]}>
                {/* 6-Panel Dome Crown (Navy/Dark Slate) */}
                <mesh
                  geometry={geoSphere16}
                  material={MAT_DIRECTOR_CAP}
                  scale={[0.17, 0.14, 0.17]}
                  position={[0, 0.07, -0.01]}
                />
                {/* Cap Lower Sweatband */}
                <mesh
                  geometry={geoCylinder16}
                  material={MAT_DIRECTOR_CAP}
                  scale={[0.165, 0.05, 0.165]}
                  position={[0, 0.04, 0]}
                />
                {/* Curved Front Visor / Bill (Pointing to +Z) */}
                <mesh
                  geometry={geoBox}
                  material={MAT_DIRECTOR_CAP_BRIM}
                  scale={[0.20, 0.025, 0.20]}
                  position={[0, 0.03, 0.18]}
                  rotation={[0.18, 0, 0]}
                />
                {/* Golden Crown Button */}
                <mesh
                  geometry={geoSphere12}
                  material={MAT_GOLD_BRASS}
                  scale={[0.028, 0.028, 0.028]}
                  position={[0, 0.21, -0.01]}
                />

                {/* Golden Front Embroidered Patch / Clapper Badge */}
                <mesh
                  geometry={geoBox}
                  material={MAT_GOLD_BRASS}
                  scale={[0.06, 0.045, 0.02]}
                  position={[0, 0.10, 0.16]}
                  rotation={[-0.15, 0, 0]}
                />

                {/* Rear Adjustable Snapback Strap & Arch Cutout (Visible on Back of Head) */}
                <group position={[0, 0.03, -0.165]}>
                  <mesh
                    geometry={geoBox}
                    material={MAT_ROAD_CASE_BLACK}
                    scale={[0.11, 0.02, 0.02]}
                    position={[0, 0, 0]}
                  />
                  <mesh
                    geometry={geoBox}
                    material={MAT_STEEL_BRIGHT}
                    scale={[0.025, 0.025, 0.025]}
                    position={[0.02, 0, 0.005]}
                  />
                </group>

                {/* Over-Ear Headphones around Director's Neck */}
                <group position={[0, -0.18, 0]}>
                  <mesh
                    geometry={geoCylinder16}
                    material={MAT_STEEL_DARK}
                    scale={[0.16, 0.035, 0.16]}
                  />
                  <mesh
                    geometry={geoCylinder8}
                    material={MAT_ROAD_CASE_BLACK}
                    scale={[0.07, 0.07, 0.07]}
                    position={[-0.16, 0, 0.03]}
                    rotation={[0, 0, Math.PI / 2]}
                  />
                  <mesh
                    geometry={geoCylinder8}
                    material={MAT_ROAD_CASE_BLACK}
                    scale={[0.07, 0.07, 0.07]}
                    position={[0.16, 0, 0.03]}
                    rotation={[0, 0, Math.PI / 2]}
                  />
                </group>
              </group>
            )}

            {/* 2. LEAD ACTRESS: GLAMOROUS LONG FLOWING HAIR OVER SHOULDERS */}
            {characterType === 'lead_actress' && (
              <group>
                {/* Full Crown Volume */}
                <mesh
                  geometry={geoSphere16}
                  material={MAT_HAIR_BRUNETTE}
                  scale={[0.17, 0.17, 0.17]}
                  position={[0, 0.04, -0.02]}
                />
                {/* Flowing Locks Cascading down onto shoulders */}
                <mesh
                  geometry={geoCylinder16}
                  material={MAT_HAIR_BRUNETTE}
                  scale={[0.055, 0.45, 0.055]}
                  position={[-0.13, -0.22, 0.06]}
                  rotation={[0.25, 0, -0.15]}
                />
                <mesh
                  geometry={geoCylinder16}
                  material={MAT_HAIR_BRUNETTE}
                  scale={[0.055, 0.45, 0.055]}
                  position={[0.13, -0.22, 0.06]}
                  rotation={[0.25, 0, 0.15]}
                />
                {/* Back Hair Sheet */}
                <mesh
                  geometry={geoBox}
                  material={MAT_HAIR_BRUNETTE}
                  scale={[0.26, 0.46, 0.08]}
                  position={[0, -0.2, -0.12]}
                />
              </group>
            )}

            {/* 3. LEAD ACTOR: TEXTURED HERO HAIR */}
            {characterType === 'lead_actor' && (
              <group>
                <mesh
                  geometry={geoSphere16}
                  material={MAT_HAIR_BLACK}
                  scale={[0.165, 0.15, 0.165]}
                  position={[0, 0.06, -0.01]}
                />
                <mesh
                  geometry={geoBox}
                  material={MAT_HAIR_BLACK}
                  scale={[0.14, 0.06, 0.08]}
                  position={[0, 0.14, 0.06]}
                  rotation={[-0.2, 0, 0]}
                />
              </group>
            )}

            {/* 4. CO-STAR / FRIEND: STYLED BLONDE BOB */}
            {characterType === 'co_star' && (
              <group>
                <mesh
                  geometry={geoSphere16}
                  material={MAT_HAIR_BLONDE}
                  scale={[0.17, 0.16, 0.17]}
                  position={[0, 0.05, -0.01]}
                />
                <mesh
                  geometry={geoBox}
                  material={MAT_HAIR_BLONDE}
                  scale={[0.22, 0.26, 0.22]}
                  position={[0, -0.04, -0.03]}
                />
              </group>
            )}

            {/* 5. INVENTOR: AUBURN HAIR WITH BRASS GOGGLES */}
            {characterType === 'inventor' && (
              <group>
                <mesh
                  geometry={geoSphere16}
                  material={MAT_HAIR_AUBURN}
                  scale={[0.17, 0.15, 0.17]}
                  position={[0, 0.05, -0.01]}
                />
                {/* Brass Goggles */}
                <mesh
                  geometry={geoCylinder12}
                  material={MAT_GOLD_BRASS}
                  scale={[0.055, 0.03, 0.055]}
                  position={[-0.06, 0.09, 0.13]}
                  rotation={[Math.PI / 2, 0, 0]}
                />
                <mesh
                  geometry={geoCylinder12}
                  material={MAT_GOLD_BRASS}
                  scale={[0.055, 0.03, 0.055]}
                  position={[0.06, 0.09, 0.13]}
                  rotation={[Math.PI / 2, 0, 0]}
                />
              </group>
            )}

            {/* 6. CAMERA / BOOM CREW: CREW BASEBALL CAP */}
            {(characterType === 'camera_op' || characterType === 'dolly_grip' || characterType === 'boom_op') && (
              <group position={[0, 0.05, 0]}>
                <mesh
                  geometry={geoSphere16}
                  material={MAT_ROAD_CASE_BLACK}
                  scale={[0.16, 0.12, 0.16]}
                  position={[0, 0.06, 0]}
                />
                <mesh
                  geometry={geoBox}
                  material={MAT_ROAD_CASE_BLACK}
                  scale={[0.18, 0.02, 0.16]}
                  position={[0, 0.03, -0.16]} // Worn Backwards for Pro Cameraman
                  rotation={[-0.15, 0, 0]}
                />
              </group>
            )}
          </group>
        </group>
       </group>
      </group>
    );
  }
);

BlenderHumanoid.displayName = 'BlenderHumanoid';

/** Advances the shared scene clock; every actor rig reads it in the same frame. */
const SceneClockDriver: React.FC<{ filmStartedAt: number | null }> = ({ filmStartedAt }) => {
  useFrame(() => {
    if (filmStartedAt === null) {
      sceneClock.time = null;
      return;
    }
    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const elapsed = (now - filmStartedAt) / 1000;
    sceneClock.time = elapsed < 0 ? 0 : elapsed;
  });
  return null;
};

// ============================================================
// DIALOGUE CAPTION — the line currently being delivered, floating over
// the speaker so the audience (and the live camera feed) can follow the scene.
// ============================================================
const DialogueCaption3D: React.FC<{ baseY: number }> = ({ baseY }) => {
  const groupRef = useRef<THREE.Group>(null);
  const drawnFor = useRef<string>('');

  const { texture, material } = useMemo(() => {
    if (typeof document === 'undefined') {
      return { texture: null as THREE.CanvasTexture | null, material: MAT_ROAD_CASE_BLACK };
    }
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 192;
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return {
      texture: tex,
      material: new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        depthWrite: false,
        toneMapped: false,
      }),
    };
  }, []);

  useFrame(({ camera }) => {
    const group = groupRef.current;
    if (!group || !texture) return;

    const spoken = sceneClock.time === null ? null : lineAt(sceneClock.time);
    group.visible = spoken !== null;
    if (!spoken) return;

    if (drawnFor.current !== spoken.line) {
      drawnFor.current = spoken.line;
      const canvas = texture.image as HTMLCanvasElement;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, 1024, 192);
        ctx.fillStyle = 'rgba(8, 11, 24, 0.82)';
        ctx.fillRect(0, 36, 1024, 120);
        ctx.fillStyle = '#facc15';
        ctx.fillRect(0, 36, 1024, 7);
        ctx.fillRect(0, 149, 1024, 7);
        ctx.font = 'bold 54px "Arial Black", Impact, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(spoken.line, 512, 98, 960);
      }
      texture.needsUpdate = true;
    }

    const at = ACTOR_STAGE_POS[spoken.speaker];
    if (at) group.position.set(at.x, baseY + 2.24, at.y);
    group.quaternion.copy(camera.quaternion);
  });

  return (
    <group ref={groupRef} visible={false}>
      <mesh>
        <planeGeometry args={[3.0, 0.56]} />
        <primitive object={material} attach="material" />
      </mesh>
    </group>
  );
};

// ============================================================
// MASTER STUDIO CAST & CREW (Properly Positioned & Clear Line of Sight)
// ============================================================
export const StudioCharacters3D: React.FC<{
  isFilming: boolean;
  productionLevel: number;
  dollyProgress?: number;
  /** performance.now() at which 'ACTION' was called; null between takes. */
  filmStartedAt?: number | null;
}> = React.memo(({ isFilming, productionLevel, dollyProgress = 0, filmStartedAt = null }) => {
  const stageY = productionLevel >= 1 ? 0.3 : 0;
  return (
    <group>
      {/* ── 1. THE DIRECTOR (Standing at Director Village, Looking at Actors on Stage) ── */}
      <BlenderHumanoid
        position={[-1.3, 0, 3.2]}
        rotationY={Math.PI - 0.22}
        characterType="director"
        pose="directing"
        skinMat={MAT_SKIN_WARM}
        isFilming={isFilming}
      />
      {/* Golden Megaphone in Director's Hand Pointing Toward Stage */}
      <group position={[-1.1, 1.25, 2.7]} rotation={[0.4, Math.PI - 0.22, 0]}>
        <mesh
          geometry={geoCylinder12}
          material={MAT_STAGE_TAPE_YELLOW}
          scale={[0.08, 0.24, 0.08]}
          rotation={[Math.PI / 2, 0, 0]}
        />
      </group>

      {/* ── 2. THE CAST — staged on their opening marks and driven by the scene script ── */}
      <BlenderHumanoid
        position={[OPENING_MARKS.lead_actor[0], stageY, OPENING_MARKS.lead_actor[1]]}
        characterType="lead_actor"
        skinMat={MAT_SKIN_PEACH}
        pose="acting_hero"
        isFilming={isFilming}
        role="lead_actor"
      />

      <BlenderHumanoid
        position={[OPENING_MARKS.lead_actress[0], stageY, OPENING_MARKS.lead_actress[1]]}
        characterType="lead_actress"
        skinMat={MAT_SKIN_WARM}
        pose="acting_dramatic"
        isFilming={isFilming}
        role="lead_actress"
      />

      <BlenderHumanoid
        position={[OPENING_MARKS.co_star[0], stageY, OPENING_MARKS.co_star[1]]}
        characterType="co_star"
        skinMat={MAT_SKIN_PEACH}
        pose="acting_hero"
        isFilming={isFilming}
        role="co_star"
      />

      <BlenderHumanoid
        position={[OPENING_MARKS.villain[0], stageY, OPENING_MARKS.villain[1]]}
        characterType="villain"
        skinMat={MAT_SKIN_BRONZE}
        pose="acting_dramatic"
        isFilming={isFilming}
        role="villain"
      />

      <SceneClockDriver filmStartedAt={filmStartedAt} />

      {/* ── 3. CAMERA OPERATOR (Behind Cinema Camera 1, Looking at Actors) ── */}
      <BlenderHumanoid
        position={[1.8, 0, 2.9]}
        rotationY={Math.PI + 0.33}
        characterType="camera_op"
        pose="filming"
        skinMat={MAT_SKIN_WARM}
        isFilming={isFilming}
      />

      {/* ── 4. DOLLY GRIP (On Left Track Looking at Set) ── */}
      <BlenderHumanoid
        position={[-5.6 + dollyProgress * 2.8, 0, 2.6]}
        rotationY={Math.PI - 0.72}
        characterType="dolly_grip"
        pose="filming"
        skinMat={MAT_SKIN_PEACH}
        isFilming={isFilming}
      />

      {/* ── 5. SOUND BOOM OPERATOR (Stage Left, Facing Actors) ── */}
      <group position={[-3.4, 0, 0.8]}>
        <BlenderHumanoid
          position={[0, 0, 0]}
          rotationY={Math.PI - 0.75}
          characterType="boom_op"
          pose="boom_mic"
          skinMat={MAT_SKIN_WARM}
          isFilming={isFilming}
        />
        {/* Telescopic Carbon Fiber Boom Pole & Deadcat Mic Pointing Toward Actors */}
        <group position={[0.2, 2.0, 0]} rotation={[-0.4, Math.PI - 0.75, 0.2]}>
          <mesh
            geometry={geoCylinder8}
            material={MAT_STEEL_DARK}
            scale={[0.025, 4.2, 0.025]}
            position={[0, 1.8, 0]}
          />
          <mesh
            geometry={geoCylinder12}
            material={MAT_ROAD_CASE_BLACK}
            scale={[0.08, 0.35, 0.08]}
            position={[0, 3.8, 0]}
            rotation={[Math.PI / 2, 0, 0]}
          />
        </group>
      </group>

      {/* ── 6. SET PHOTOGRAPHER (Stage Right, Facing Actors with DSLR) ── */}
      <group position={[3.6, 0, 0.8]}>
        <BlenderHumanoid
          position={[0, 0, 0]}
          rotationY={Math.PI + 0.45}
          characterType="photographer"
          pose="photo"
          skinMat={MAT_SKIN_PEACH}
          isFilming={isFilming}
        />
        <group position={[-0.18, 1.48, -0.22]} rotation={[0.1, Math.PI + 0.45, 0]}>
          <mesh geometry={geoBox} material={MAT_ROAD_CASE_BLACK} scale={[0.18, 0.14, 0.12]} />
          <mesh
            geometry={geoCylinder12}
            material={MAT_STEEL_BRIGHT}
            scale={[0.06, 0.22, 0.06]}
            position={[0, 0, -0.16]}
            rotation={[Math.PI / 2, 0, 0]}
          />
        </group>
      </group>
    </group>
  );
});

StudioCharacters3D.displayName = 'StudioCharacters3D';
