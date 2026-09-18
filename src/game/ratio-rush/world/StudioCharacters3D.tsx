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

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  geoBox,
  geoCylinder8,
  geoCylinder12,
  geoCylinder16,
  geoSphere12,
  geoSphere16,
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
  }) => {
    const leftArmRef = useRef<THREE.Group>(null);
    const rightArmRef = useRef<THREE.Group>(null);
    const headRef = useRef<THREE.Group>(null);
    const bodyRootRef = useRef<THREE.Group>(null);

    useFrame((state) => {
      const t = state.clock.getElapsedTime();
      const breath = Math.sin(t * 2.0) * 0.015;

      if (bodyRootRef.current) {
        bodyRootRef.current.position.y = breath;
      }

      if (headRef.current) {
        headRef.current.rotation.y = Math.sin(t * 1.2) * 0.06;
        headRef.current.rotation.x = Math.cos(t * 1.5) * 0.03;
      }

      // Dynamic Arm Kinematics by Pose
      if (pose === 'directing') {
        if (rightArmRef.current) {
          rightArmRef.current.rotation.x = isFilming ? -1.85 : -1.2 + Math.sin(t * 3) * 0.1;
          rightArmRef.current.rotation.z = -0.35;
        }
        if (leftArmRef.current) {
          leftArmRef.current.rotation.x = -0.7;
          leftArmRef.current.rotation.z = 0.4;
        }
      } else if (pose === 'acting_dramatic') {
        if (rightArmRef.current) {
          rightArmRef.current.rotation.x = -1.5 + Math.sin(t * 2.2) * 0.15;
          rightArmRef.current.rotation.z = -0.45;
        }
        if (leftArmRef.current) {
          leftArmRef.current.rotation.x = -1.1 + Math.cos(t * 2.2) * 0.12;
          leftArmRef.current.rotation.z = 0.35;
        }
      } else if (pose === 'acting_hero') {
        if (rightArmRef.current) {
          rightArmRef.current.rotation.x = -0.6;
          rightArmRef.current.rotation.z = -0.3;
        }
        if (leftArmRef.current) {
          leftArmRef.current.rotation.x = -0.4;
          leftArmRef.current.rotation.z = 0.3;
        }
      } else if (pose === 'filming') {
        if (leftArmRef.current) leftArmRef.current.rotation.set(-1.1, 0.2, 0);
        if (rightArmRef.current) rightArmRef.current.rotation.set(-1.1, -0.2, 0);
      } else if (pose === 'boom_mic') {
        if (leftArmRef.current) leftArmRef.current.rotation.set(-2.1, 0.15, -0.1);
        if (rightArmRef.current) rightArmRef.current.rotation.set(-1.9, -0.15, 0.1);
      } else if (pose === 'photo') {
        if (leftArmRef.current) leftArmRef.current.rotation.set(-1.5, 0.3, 0);
        if (rightArmRef.current) rightArmRef.current.rotation.set(-1.6, -0.2, 0);
      } else {
        // Natural Idle
        if (leftArmRef.current) leftArmRef.current.rotation.set(breath * 2, 0, 0.1);
        if (rightArmRef.current) rightArmRef.current.rotation.set(-breath * 2, 0, -0.1);
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
              {/* Flannel Collar Trim */}
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
            {/* Elbow Sphere */}
            <mesh
              geometry={geoSphere12}
              material={skinMat}
              scale={[0.055, 0.055, 0.055]}
              position={[0, -0.28, 0]}
            />
            {/* Forearm */}
            <mesh
              geometry={geoCylinder16}
              material={skinMat}
              scale={[0.05, 0.24, 0.05]}
              position={[0, -0.4, 0]}
            />
            {/* Hand & Palm */}
            <mesh
              geometry={geoSphere12}
              material={skinMat}
              scale={[0.055, 0.07, 0.045]}
              position={[0, -0.54, 0]}
            />
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
            <mesh
              geometry={geoSphere12}
              material={skinMat}
              scale={[0.055, 0.055, 0.055]}
              position={[0, -0.28, 0]}
            />
            <mesh
              geometry={geoCylinder16}
              material={skinMat}
              scale={[0.05, 0.24, 0.05]}
              position={[0, -0.4, 0]}
            />
            <mesh
              geometry={geoSphere12}
              material={skinMat}
              scale={[0.055, 0.07, 0.045]}
              position={[0, -0.54, 0]}
            />
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
                {/* 6-Panel Dome Crown */}
                <mesh
                  geometry={geoSphere16}
                  material={MAT_DIRECTOR_CAP}
                  scale={[0.165, 0.13, 0.165]}
                  position={[0, 0.07, -0.01]}
                />
                {/* Cap Lower Sweatband */}
                <mesh
                  geometry={geoCylinder16}
                  material={MAT_DIRECTOR_CAP}
                  scale={[0.16, 0.05, 0.16]}
                  position={[0, 0.04, 0]}
                />
                {/* Curved Front Visor / Bill */}
                <mesh
                  geometry={geoBox}
                  material={MAT_DIRECTOR_CAP_BRIM}
                  scale={[0.19, 0.02, 0.18]}
                  position={[0, 0.03, 0.17]}
                  rotation={[0.18, 0, 0]}
                />
                {/* Golden Crown Button */}
                <mesh
                  geometry={geoSphere12}
                  material={MAT_GOLD_BRASS}
                  scale={[0.025, 0.025, 0.025]}
                  position={[0, 0.20, -0.01]}
                />

                {/* Over-Ear Headphones around Director's Neck */}
                <group position={[0, -0.18, 0]}>
                  <mesh
                    geometry={geoCylinder16}
                    material={MAT_STEEL_DARK}
                    scale={[0.15, 0.03, 0.15]}
                  />
                  <mesh
                    geometry={geoCylinder8}
                    material={MAT_ROAD_CASE_BLACK}
                    scale={[0.06, 0.06, 0.06]}
                    position={[-0.15, 0, 0.03]}
                    rotation={[0, 0, Math.PI / 2]}
                  />
                  <mesh
                    geometry={geoCylinder8}
                    material={MAT_ROAD_CASE_BLACK}
                    scale={[0.06, 0.06, 0.06]}
                    position={[0.15, 0, 0.03]}
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
    );
  }
);

BlenderHumanoid.displayName = 'BlenderHumanoid';

// ============================================================
// MASTER STUDIO CAST & CREW (Properly Positioned & Clear Line of Sight)
// ============================================================
export const StudioCharacters3D: React.FC<{
  isFilming: boolean;
  productionLevel: number;
  dollyProgress?: number;
}> = React.memo(({ isFilming, productionLevel, dollyProgress = 0 }) => {
  return (
    <group>
      {/* ── 1. THE DIRECTOR (Standing at Video Village on Right, Holding Megaphone) ── */}
      <BlenderHumanoid
        position={[2.6, 0, 5.0]}
        rotationY={-0.35}
        characterType="director"
        pose="directing"
        skinMat={MAT_SKIN_WARM}
        isFilming={isFilming}
      />
      {/* Golden Megaphone in Director's Hand */}
      <group position={[3.0, 1.25, 4.7]} rotation={[-0.4, -0.35, 0]}>
        <mesh
          geometry={geoCylinder12}
          material={MAT_STAGE_TAPE_YELLOW}
          scale={[0.08, 0.24, 0.08]}
          rotation={[Math.PI / 2, 0, 0]}
        />
      </group>

      {/* ── 2. THE MOVIE ACTORS & ACTRESSES (Facing Camera on Green Stage) ── */}
      {/* Lead Actor (Hero in Action Jacket) */}
      <BlenderHumanoid
        position={[-2.4, productionLevel >= 1 ? 0.3 : 0, -2.4]}
        rotationY={0.25}
        characterType="lead_actor"
        skinMat={MAT_SKIN_PEACH}
        pose={isFilming ? 'acting_hero' : 'idle'}
        isFilming={isFilming}
      />

      {/* Lead Actress (Heroine in Emerald Gown & Flowing Hair) */}
      <BlenderHumanoid
        position={[-0.6, productionLevel >= 1 ? 0.3 : 0, -2.2]}
        rotationY={0.05}
        characterType="lead_actress"
        skinMat={MAT_SKIN_WARM}
        pose={isFilming ? 'acting_dramatic' : 'idle'}
        isFilming={isFilming}
      />

      {/* Co-Star / Actress (Friend in Chic Studio Outfit) */}
      <BlenderHumanoid
        position={[1.2, productionLevel >= 1 ? 0.3 : 0, -2.2]}
        rotationY={-0.2}
        characterType="co_star"
        skinMat={MAT_SKIN_PEACH}
        pose="idle"
        isFilming={isFilming}
      />

      {/* Villain (In Purple Doublet & Crimson Cape) */}
      <BlenderHumanoid
        position={[3.0, productionLevel >= 1 ? 0.3 : 0, -2.6]}
        rotationY={-0.4}
        characterType="villain"
        skinMat={MAT_SKIN_BRONZE}
        pose="acting_dramatic"
        isFilming={isFilming}
      />

      {/* ── 3. CAMERA OPERATOR (Beside Camera 1, NOT Blocking Center View) ── */}
      <BlenderHumanoid
        position={[2.05, 0, 4.5]}
        rotationY={Math.PI - 0.25}
        characterType="camera_op"
        pose="filming"
        skinMat={MAT_SKIN_WARM}
        isFilming={isFilming}
      />

      {/* ── 4. DOLLY GRIP (On Left Track) ── */}
      <BlenderHumanoid
        position={[-5.6 + dollyProgress * 2.8, 0, 2.6]}
        rotationY={Math.PI / 2}
        characterType="dolly_grip"
        pose="filming"
        skinMat={MAT_SKIN_PEACH}
        isFilming={isFilming}
      />

      {/* ── 5. SOUND BOOM OPERATOR (Stage Left) ── */}
      <group position={[-3.8, 0, 1.2]}>
        <BlenderHumanoid
          position={[0, 0, 0]}
          rotationY={0.65}
          characterType="boom_op"
          pose="boom_mic"
          skinMat={MAT_SKIN_WARM}
          isFilming={isFilming}
        />
        {/* Telescopic Carbon Fiber Boom Pole & Deadcat Mic */}
        <group position={[0.2, 2.0, 0]} rotation={[0.4, 0.5, -0.2]}>
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

      {/* ── 6. SET PHOTOGRAPHER (Stage Right with DSLR) ── */}
      <group position={[4.6, 0, 1.2]}>
        <BlenderHumanoid
          position={[0, 0, 0]}
          rotationY={-0.6}
          characterType="photographer"
          pose="photo"
          skinMat={MAT_SKIN_PEACH}
          isFilming={isFilming}
        />
        <group position={[-0.18, 1.48, -0.22]} rotation={[-0.1, -0.6, 0]}>
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
