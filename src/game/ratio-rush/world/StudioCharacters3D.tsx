// ============================================================
// RATIO RUSH — STUDIO CHARACTERS & CREW 3D (HUMAN & REALISTIC CAST)
// Professional human movie production crew & actor cast:
// 1. Director (Wearing authentic Director Cap with brim, headphones on neck, directing set)
// 2. Lead Actress (Cinematic gown/heroine dress, flowing hair, dramatic acting pose)
// 3. Lead Actor / Hero (Action jacket with lapels & belt, styled hair)
// 4. Co-star / Friend (Chic studio costume, styled bob hair)
// 5. Inventor (Field lab coat with brass goggles & tool belt)
// 6. Villain (Doublet trenchcoat, standing collar & crimson cape)
// 7. Camera Operators & Dolly Grip (Crew vests with backstage lanyards)
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
  getStudioMaterial,
  MAT_STEEL_DARK,
  MAT_STEEL_BRIGHT,
  MAT_ROAD_CASE_BLACK,
  MAT_STAGE_TAPE_YELLOW,
  MAT_STAGE_TAPE_BLUE,
  MAT_STAGE_TAPE_RED,
  MAT_DIRECTOR_WOOD,
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
  MAT_GOLD_BRASS,
  MAT_JACKET_HERO,
  MAT_JACKET_LEATHER,
} from './StudioMaterials';

export interface RealisticHumanProps {
  position: [number, number, number];
  rotationY?: number;
  outfitType:
    | 'director'
    | 'lead_actress'
    | 'lead_actor'
    | 'co_star'
    | 'inventor'
    | 'villain'
    | 'camera_crew'
    | 'sound_crew';
  skinMaterial?: THREE.MeshStandardMaterial;
  hairMaterial?: THREE.MeshStandardMaterial;
  pose?: 'directing' | 'acting_dramatic' | 'acting_hero' | 'holding_prop' | 'filming' | 'boom_mic' | 'photo' | 'idle';
  isFilming?: boolean;
  scale?: number;
}

export const StudioHumanFigure: React.FC<RealisticHumanProps> = React.memo(
  ({
    position,
    rotationY = 0,
    outfitType,
    skinMaterial = MAT_SKIN_PEACH,
    hairMaterial = MAT_HAIR_BRUNETTE,
    pose = 'idle',
    isFilming = false,
    scale = 1,
  }) => {
    const leftArmRef = useRef<THREE.Group>(null);
    const rightArmRef = useRef<THREE.Group>(null);
    const leftLegRef = useRef<THREE.Group>(null);
    const rightLegRef = useRef<THREE.Group>(null);
    const headRef = useRef<THREE.Group>(null);
    const torsoRef = useRef<THREE.Group>(null);

    useFrame(() => {
      const time = Date.now() * 0.0025;
      const breath = Math.sin(time * 1.6) * 0.02;

      if (torsoRef.current) {
        torsoRef.current.position.y = 1.05 + breath * 0.5;
      }

      // Natural Human Pose Kinematics
      if (pose === 'directing') {
        if (rightArmRef.current) {
          rightArmRef.current.rotation.x = isFilming ? -1.9 : -1.1 + breath * 3;
          rightArmRef.current.rotation.z = -0.4;
        }
        if (leftArmRef.current) {
          leftArmRef.current.rotation.x = -0.7;
          leftArmRef.current.rotation.z = 0.35;
        }
      } else if (pose === 'acting_dramatic') {
        if (rightArmRef.current) {
          rightArmRef.current.rotation.x = -1.6 + Math.sin(time * 2) * 0.15;
          rightArmRef.current.rotation.z = -0.5;
        }
        if (leftArmRef.current) {
          leftArmRef.current.rotation.x = -1.2 + Math.cos(time * 2) * 0.12;
          leftArmRef.current.rotation.z = 0.4;
        }
      } else if (pose === 'acting_hero') {
        if (rightArmRef.current) {
          rightArmRef.current.rotation.x = -0.8;
          rightArmRef.current.rotation.z = -0.4;
        }
        if (leftArmRef.current) {
          leftArmRef.current.rotation.x = -0.4;
          leftArmRef.current.rotation.z = 0.3;
        }
      } else if (pose === 'filming') {
        if (leftArmRef.current) leftArmRef.current.rotation.x = -1.25;
        if (rightArmRef.current) rightArmRef.current.rotation.x = -1.25;
      } else if (pose === 'boom_mic') {
        if (leftArmRef.current) leftArmRef.current.rotation.x = -2.15;
        if (rightArmRef.current) rightArmRef.current.rotation.x = -1.95;
      } else if (pose === 'photo') {
        if (leftArmRef.current) leftArmRef.current.rotation.x = -1.55;
        if (rightArmRef.current) rightArmRef.current.rotation.x = -1.65;
      } else {
        // Natural subtle idle breathing
        if (leftArmRef.current) leftArmRef.current.rotation.x = breath * 1.5;
        if (rightArmRef.current) rightArmRef.current.rotation.x = -breath * 1.5;
      }

      if (headRef.current) {
        headRef.current.rotation.y = Math.sin(time * 0.9) * 0.08;
      }
    });

    return (
      <group position={position} rotation={[0, rotationY, 0]} scale={[scale, scale, scale]}>
        {/* ── 1. LEGS & SHOES (Realistic contoured proportions) ── */}
        {/* Left Leg */}
        <group ref={leftLegRef} position={[-0.14, 0.72, 0]}>
          {/* Thigh */}
          <mesh
            geometry={geoCylinder12}
            material={
              outfitType === 'lead_actress'
                ? MAT_GOWN_EMERALD
                : outfitType === 'director'
                ? getStudioMaterial('#334155', 0.6)
                : outfitType === 'lead_actor'
                ? getStudioMaterial('#1e293b', 0.6)
                : outfitType === 'villain'
                ? getStudioMaterial('#1e1b4b', 0.6)
                : getStudioMaterial('#0f172a', 0.6)
            }
            scale={[0.08, 0.42, 0.08]}
            position={[0, -0.18, 0]}
          />
          {/* Knee Joint */}
          <mesh
            geometry={geoSphere12}
            material={skinMaterial}
            scale={[0.075, 0.075, 0.075]}
            position={[0, -0.38, 0.01]}
          />
          {/* Shin / Lower Leg */}
          <mesh
            geometry={geoCylinder12}
            material={
              outfitType === 'lead_actress'
                ? MAT_GOWN_EMERALD
                : outfitType === 'director'
                ? getStudioMaterial('#334155', 0.6)
                : outfitType === 'lead_actor'
                ? getStudioMaterial('#1e293b', 0.6)
                : outfitType === 'villain'
                ? getStudioMaterial('#1e1b4b', 0.6)
                : getStudioMaterial('#0f172a', 0.6)
            }
            scale={[0.07, 0.36, 0.07]}
            position={[0, -0.54, 0]}
          />
          {/* Shoe / Sneaker / Boot */}
          <mesh
            geometry={geoBox}
            material={MAT_ROAD_CASE_BLACK}
            scale={[0.15, 0.1, 0.24]}
            position={[0, -0.68, 0.04]}
          />
          {/* Shoe Sole Accent */}
          <mesh
            geometry={geoBox}
            material={MAT_STEEL_BRIGHT}
            scale={[0.16, 0.03, 0.25]}
            position={[0, -0.72, 0.04]}
          />
        </group>

        {/* Right Leg */}
        <group ref={rightLegRef} position={[0.14, 0.72, 0]}>
          <mesh
            geometry={geoCylinder12}
            material={
              outfitType === 'lead_actress'
                ? MAT_GOWN_EMERALD
                : outfitType === 'director'
                ? getStudioMaterial('#334155', 0.6)
                : outfitType === 'lead_actor'
                ? getStudioMaterial('#1e293b', 0.6)
                : outfitType === 'villain'
                ? getStudioMaterial('#1e1b4b', 0.6)
                : getStudioMaterial('#0f172a', 0.6)
            }
            scale={[0.08, 0.42, 0.08]}
            position={[0, -0.18, 0]}
          />
          <mesh
            geometry={geoSphere12}
            material={skinMaterial}
            scale={[0.075, 0.075, 0.075]}
            position={[0, -0.38, 0.01]}
          />
          <mesh
            geometry={geoCylinder12}
            material={
              outfitType === 'lead_actress'
                ? MAT_GOWN_EMERALD
                : outfitType === 'director'
                ? getStudioMaterial('#334155', 0.6)
                : outfitType === 'lead_actor'
                ? getStudioMaterial('#1e293b', 0.6)
                : outfitType === 'villain'
                ? getStudioMaterial('#1e1b4b', 0.6)
                : getStudioMaterial('#0f172a', 0.6)
            }
            scale={[0.07, 0.36, 0.07]}
            position={[0, -0.54, 0]}
          />
          <mesh
            geometry={geoBox}
            material={MAT_ROAD_CASE_BLACK}
            scale={[0.15, 0.1, 0.24]}
            position={[0, -0.68, 0.04]}
          />
          <mesh
            geometry={geoBox}
            material={MAT_STEEL_BRIGHT}
            scale={[0.16, 0.03, 0.25]}
            position={[0, -0.72, 0.04]}
          />
        </group>

        {/* ── 2. TORSO & COSTUMES ── */}
        <group ref={torsoRef} position={[0, 1.05, 0]}>
          {/* Pelvis & Belt */}
          <mesh
            geometry={geoCylinder16}
            material={
              outfitType === 'lead_actress'
                ? MAT_GOWN_EMERALD
                : outfitType === 'director'
                ? getStudioMaterial('#334155')
                : outfitType === 'lead_actor'
                ? getStudioMaterial('#1e293b')
                : getStudioMaterial('#0f172a')
            }
            scale={[0.18, 0.14, 0.14]}
            position={[0, -0.22, 0]}
          />
          {/* Belt & Buckle */}
          <mesh
            geometry={geoCylinder16}
            material={MAT_ROAD_CASE_BLACK}
            scale={[0.19, 0.04, 0.15]}
            position={[0, -0.16, 0]}
          />
          <mesh
            geometry={geoBox}
            material={MAT_GOLD_BRASS}
            scale={[0.06, 0.05, 0.03]}
            position={[0, -0.16, 0.15]}
          />

          {/* Chest & Bodice */}
          {outfitType === 'lead_actress' ? (
            /* Lead Actress: Elegant Emerald/Gold Bodice & Cinematic Gown */
            <group>
              <mesh
                geometry={geoCylinder16}
                material={MAT_GOWN_EMERALD}
                scale={[0.18, 0.44, 0.14]}
                position={[0, 0.1, 0]}
              />
              {/* Gold Filigree Trim */}
              <mesh
                geometry={geoBox}
                material={MAT_GOWN_GOLD}
                scale={[0.22, 0.03, 0.16]}
                position={[0, 0.28, 0]}
              />
              {/* Flared Gown Skirt */}
              <mesh
                geometry={geoCylinder16}
                material={MAT_GOWN_EMERALD}
                scale={[0.28, 0.65, 0.24]}
                position={[0, -0.42, 0]}
              />
            </group>
          ) : outfitType === 'director' ? (
            /* Director: Studio Jacket over Flannel Shirt */
            <group>
              <mesh
                geometry={geoBox}
                material={MAT_DIRECTOR_CAP}
                scale={[0.42, 0.48, 0.26]}
                position={[0, 0.1, 0]}
              />
              {/* Flannel Collar */}
              <mesh
                geometry={geoBox}
                material={getStudioMaterial('#e2e8f0')}
                scale={[0.18, 0.1, 0.04]}
                position={[0, 0.3, 0.14]}
              />
              {/* Walkie Talkie Clip on Belt */}
              <mesh
                geometry={geoBox}
                material={MAT_ROAD_CASE_BLACK}
                scale={[0.06, 0.12, 0.04]}
                position={[0.18, -0.12, 0.12]}
              />
              <mesh
                geometry={geoCylinder8}
                material={MAT_STEEL_DARK}
                scale={[0.01, 0.08, 0.01]}
                position={[0.18, -0.02, 0.12]}
              />
            </group>
          ) : outfitType === 'lead_actor' ? (
            /* Lead Actor: Action Hero Blue Jacket & Gold Trim */
            <group>
              <mesh
                geometry={geoBox}
                material={MAT_JACKET_HERO}
                scale={[0.44, 0.5, 0.28]}
                position={[0, 0.1, 0]}
              />
              <mesh
                geometry={geoBox}
                material={MAT_GOLD_BRASS}
                scale={[0.08, 0.08, 0.02]}
                position={[-0.12, 0.2, 0.15]}
              />
            </group>
          ) : outfitType === 'villain' ? (
            /* Villain: Obsidian Doublet & High Standing Collar */
            <group>
              <mesh
                geometry={geoBox}
                material={getStudioMaterial('#581c87')}
                scale={[0.44, 0.52, 0.28]}
                position={[0, 0.1, 0]}
              />
              {/* High Collar */}
              <mesh
                geometry={geoBox}
                material={getStudioMaterial('#3b0764')}
                scale={[0.34, 0.18, 0.1]}
                position={[0, 0.38, -0.08]}
              />
              {/* Crimson Cape */}
              <mesh
                geometry={geoBox}
                material={MAT_STAGE_TAPE_RED}
                scale={[0.55, 1.15, 0.04]}
                position={[0, 0.05, -0.16]}
                rotation={[-0.12, 0, 0]}
              />
            </group>
          ) : outfitType === 'inventor' ? (
            /* Inventor: Field Tech Coat & Utility Straps */
            <group>
              <mesh
                geometry={geoBox}
                material={getStudioMaterial('#f8fafc')}
                scale={[0.44, 0.52, 0.28]}
                position={[0, 0.1, 0]}
              />
              <mesh
                geometry={geoBox}
                material={MAT_JACKET_LEATHER}
                scale={[0.06, 0.5, 0.3]}
                position={[-0.08, 0.1, 0]}
                rotation={[0, 0, 0.3]}
              />
            </group>
          ) : (
            /* Crew & Co-star: Production Vest & Backstage Lanyard */
            <group>
              <mesh
                geometry={geoBox}
                material={getStudioMaterial('#1e293b')}
                scale={[0.42, 0.48, 0.26]}
                position={[0, 0.1, 0]}
              />
              {/* VIP Backstage Pass Lanyard */}
              <mesh
                geometry={geoBox}
                material={MAT_STAGE_TAPE_YELLOW}
                scale={[0.08, 0.12, 0.02]}
                position={[0, 0.05, 0.14]}
              />
            </group>
          )}

          {/* ── 3. ARMS & HANDS (Anatomical shoulders & elbows) ── */}
          {/* Left Arm */}
          <group ref={leftArmRef} position={[-0.26, 0.3, 0]}>
            {/* Shoulder */}
            <mesh geometry={geoSphere12} material={skinMaterial} scale={[0.08, 0.08, 0.08]} />
            {/* Bicep */}
            <mesh
              geometry={geoCylinder12}
              material={
                outfitType === 'lead_actress'
                  ? skinMaterial
                  : outfitType === 'director'
                  ? MAT_DIRECTOR_CAP
                  : outfitType === 'lead_actor'
                  ? MAT_JACKET_HERO
                  : getStudioMaterial('#1e293b')
              }
              scale={[0.06, 0.26, 0.06]}
              position={[0, -0.14, 0]}
            />
            {/* Forearm */}
            <mesh
              geometry={geoCylinder12}
              material={skinMaterial}
              scale={[0.055, 0.24, 0.055]}
              position={[0, -0.38, 0]}
            />
            {/* Hand & Palm */}
            <mesh
              geometry={geoSphere12}
              material={skinMaterial}
              scale={[0.06, 0.07, 0.05]}
              position={[0, -0.52, 0]}
            />
          </group>

          {/* Right Arm */}
          <group ref={rightArmRef} position={[0.26, 0.3, 0]}>
            <mesh geometry={geoSphere12} material={skinMaterial} scale={[0.08, 0.08, 0.08]} />
            <mesh
              geometry={geoCylinder12}
              material={
                outfitType === 'lead_actress'
                  ? skinMaterial
                  : outfitType === 'director'
                  ? MAT_DIRECTOR_CAP
                  : outfitType === 'lead_actor'
                  ? MAT_JACKET_HERO
                  : getStudioMaterial('#1e293b')
              }
              scale={[0.06, 0.26, 0.06]}
              position={[0, -0.14, 0]}
            />
            <mesh
              geometry={geoCylinder12}
              material={skinMaterial}
              scale={[0.055, 0.24, 0.055]}
              position={[0, -0.38, 0]}
            />
            <mesh
              geometry={geoSphere12}
              material={skinMaterial}
              scale={[0.06, 0.07, 0.05]}
              position={[0, -0.52, 0]}
            />
          </group>

          {/* ── 4. HEAD, EXPRESSION & ACCESSORIES (Director Hat / Hair) ── */}
          <group ref={headRef} position={[0, 0.44, 0]}>
            {/* Neck */}
            <mesh
              geometry={geoCylinder12}
              material={skinMaterial}
              scale={[0.065, 0.14, 0.065]}
              position={[0, 0.02, 0]}
            />

            {/* Head Silhouette */}
            <group position={[0, 0.22, 0]}>
              <mesh
                geometry={geoSphere12}
                material={skinMaterial}
                scale={[0.14, 0.16, 0.14]}
              />

              {/* ── FACIAL DETAILS ── */}
              {/* Left Eye */}
              <mesh
                geometry={geoSphere12}
                material={MAT_EYE_WHITE}
                scale={[0.025, 0.025, 0.015]}
                position={[-0.045, 0.02, 0.13]}
              />
              <mesh
                geometry={geoSphere12}
                material={MAT_EYE_PUPIL}
                scale={[0.012, 0.012, 0.012]}
                position={[-0.045, 0.02, 0.14]}
              />
              {/* Right Eye */}
              <mesh
                geometry={geoSphere12}
                material={MAT_EYE_WHITE}
                scale={[0.025, 0.025, 0.015]}
                position={[0.045, 0.02, 0.13]}
              />
              <mesh
                geometry={geoSphere12}
                material={MAT_EYE_PUPIL}
                scale={[0.012, 0.012, 0.012]}
                position={[0.045, 0.02, 0.14]}
              />

              {/* Eyebrows */}
              <mesh
                geometry={geoBox}
                material={hairMaterial}
                scale={[0.04, 0.01, 0.015]}
                position={[-0.045, 0.055, 0.13]}
              />
              <mesh
                geometry={geoBox}
                material={hairMaterial}
                scale={[0.04, 0.01, 0.015]}
                position={[0.045, 0.055, 0.13]}
              />

              {/* Cute Nose */}
              <mesh
                geometry={geoBox}
                material={skinMaterial}
                scale={[0.02, 0.04, 0.03]}
                position={[0, -0.01, 0.145]}
              />

              {/* Smile / Lips */}
              <mesh
                geometry={geoBox}
                material={MAT_LIPS_ROSE}
                scale={[0.05, 0.015, 0.01]}
                position={[0, -0.06, 0.135]}
              />

              {/* ── SPECIALIZED HAIRSTYLES & HATS ── */}
              {/* 1. DIRECTOR: PROPER DIRECTOR HAT WITH FRONT VISOR BRIM */}
              {outfitType === 'director' && (
                <group position={[0, 0.04, 0]}>
                  {/* Cap Crown Dome */}
                  <mesh
                    geometry={geoSphere12}
                    material={MAT_DIRECTOR_CAP}
                    scale={[0.155, 0.12, 0.155]}
                    position={[0, 0.06, -0.01]}
                  />
                  {/* Cap Lower Band */}
                  <mesh
                    geometry={geoCylinder16}
                    material={MAT_DIRECTOR_CAP}
                    scale={[0.15, 0.04, 0.15]}
                    position={[0, 0.04, 0]}
                  />
                  {/* Curved Front Visor / Bill */}
                  <mesh
                    geometry={geoBox}
                    material={MAT_DIRECTOR_CAP_BRIM}
                    scale={[0.18, 0.02, 0.16]}
                    position={[0, 0.03, 0.16]}
                    rotation={[0.15, 0, 0]}
                  />
                  {/* Top Button on Cap */}
                  <mesh
                    geometry={geoSphere12}
                    material={MAT_GOLD_BRASS}
                    scale={[0.02, 0.02, 0.02]}
                    position={[0, 0.18, -0.01]}
                  />

                  {/* Headphones Draped Around Director's Neck */}
                  <group position={[0, -0.16, 0]}>
                    <mesh
                      geometry={geoCylinder16}
                      material={MAT_STEEL_DARK}
                      scale={[0.14, 0.03, 0.14]}
                    />
                    <mesh
                      geometry={geoCylinder8}
                      material={MAT_ROAD_CASE_BLACK}
                      scale={[0.06, 0.05, 0.06]}
                      position={[-0.14, 0, 0.02]}
                      rotation={[0, 0, Math.PI / 2]}
                    />
                    <mesh
                      geometry={geoCylinder8}
                      material={MAT_ROAD_CASE_BLACK}
                      scale={[0.06, 0.05, 0.06]}
                      position={[0.14, 0, 0.02]}
                      rotation={[0, 0, Math.PI / 2]}
                    />
                  </group>
                </group>
              )}

              {/* 2. LEAD ACTRESS: LONG FLOWING GLAMOROUS HAIR */}
              {outfitType === 'lead_actress' && (
                <group>
                  {/* Main Hair Volume */}
                  <mesh
                    geometry={geoSphere12}
                    material={MAT_HAIR_BRUNETTE}
                    scale={[0.16, 0.17, 0.16]}
                    position={[0, 0.04, -0.02]}
                  />
                  {/* Long Locks Cascading Left & Right Over Shoulders */}
                  <mesh
                    geometry={geoCylinder12}
                    material={MAT_HAIR_BRUNETTE}
                    scale={[0.05, 0.42, 0.05]}
                    position={[-0.12, -0.16, 0.04]}
                    rotation={[0.2, 0, -0.15]}
                  />
                  <mesh
                    geometry={geoCylinder12}
                    material={MAT_HAIR_BRUNETTE}
                    scale={[0.05, 0.42, 0.05]}
                    position={[0.12, -0.16, 0.04]}
                    rotation={[0.2, 0, 0.15]}
                  />
                </group>
              )}

              {/* 3. LEAD ACTOR: TEXTURED SHORT HERO HAIR */}
              {outfitType === 'lead_actor' && (
                <group>
                  <mesh
                    geometry={geoSphere12}
                    material={MAT_HAIR_BLACK}
                    scale={[0.155, 0.14, 0.155]}
                    position={[0, 0.06, -0.01]}
                  />
                  <mesh
                    geometry={geoBox}
                    material={MAT_HAIR_BLACK}
                    scale={[0.12, 0.05, 0.06]}
                    position={[0, 0.14, 0.06]}
                    rotation={[-0.2, 0, 0]}
                  />
                </group>
              )}

              {/* 4. CO-STAR / FRIEND: STYLED BLONDE BOB */}
              {outfitType === 'co_star' && (
                <group>
                  <mesh
                    geometry={geoSphere12}
                    material={MAT_HAIR_BLONDE}
                    scale={[0.16, 0.16, 0.16]}
                    position={[0, 0.04, -0.01]}
                  />
                  <mesh
                    geometry={geoBox}
                    material={MAT_HAIR_BLONDE}
                    scale={[0.18, 0.22, 0.18]}
                    position={[0, -0.04, -0.03]}
                  />
                </group>
              )}

              {/* 5. INVENTOR: MESSY HAIR WITH BRASS GOGGLES */}
              {outfitType === 'inventor' && (
                <group>
                  <mesh
                    geometry={geoSphere12}
                    material={MAT_HAIR_AUBURN}
                    scale={[0.16, 0.15, 0.16]}
                    position={[0, 0.05, -0.01]}
                  />
                  {/* Goggles on Forehead */}
                  <mesh
                    geometry={geoCylinder12}
                    material={MAT_GOLD_BRASS}
                    scale={[0.05, 0.03, 0.05]}
                    position={[-0.06, 0.09, 0.12]}
                    rotation={[Math.PI / 2, 0, 0]}
                  />
                  <mesh
                    geometry={geoCylinder12}
                    material={MAT_GOLD_BRASS}
                    scale={[0.05, 0.03, 0.05]}
                    position={[0.06, 0.09, 0.12]}
                    rotation={[Math.PI / 2, 0, 0]}
                  />
                </group>
              )}

              {/* 6. CREW MEMBERS: STUDIO HEADSET */}
              {outfitType === 'sound_crew' && (
                <group position={[0, 0, 0]}>
                  <mesh
                    geometry={geoSphere12}
                    material={MAT_HAIR_BLACK}
                    scale={[0.15, 0.14, 0.15]}
                    position={[0, 0.04, 0]}
                  />
                  {/* Headband */}
                  <mesh
                    geometry={geoCylinder16}
                    material={MAT_STEEL_DARK}
                    scale={[0.16, 0.03, 0.16]}
                    position={[0, 0.08, 0]}
                    rotation={[0, 0, Math.PI / 2]}
                  />
                  {/* Earcups */}
                  <mesh
                    geometry={geoCylinder8}
                    material={MAT_ROAD_CASE_BLACK}
                    scale={[0.07, 0.05, 0.07]}
                    position={[-0.15, 0, 0]}
                    rotation={[0, 0, Math.PI / 2]}
                  />
                  <mesh
                    geometry={geoCylinder8}
                    material={MAT_ROAD_CASE_BLACK}
                    scale={[0.07, 0.05, 0.07]}
                    position={[0.15, 0, 0]}
                    rotation={[0, 0, Math.PI / 2]}
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

StudioHumanFigure.displayName = 'StudioHumanFigure';

// ============================================================
// FULL STUDIO CREW & ACTOR CAST COMPONENT
// ============================================================
export const StudioCharacters3D: React.FC<{
  isFilming: boolean;
  productionLevel: number;
  dollyProgress?: number;
}> = React.memo(({ isFilming, productionLevel, dollyProgress = 0 }) => {
  return (
    <group>
      {/* ── 1. THE DIRECTOR (Standing proudly wearing Director Cap, Megaphone in hand) ── */}
      <StudioHumanFigure
        position={[2.8, 0, 5.2]}
        rotationY={-0.35}
        outfitType="director"
        pose="directing"
        skinMaterial={MAT_SKIN_WARM}
        isFilming={isFilming}
      />
      {/* Director Yellow Megaphone */}
      <group position={[3.2, 1.25, 4.9]} rotation={[-0.4, -0.35, 0]}>
        <mesh
          geometry={geoCylinder8}
          material={MAT_STAGE_TAPE_YELLOW}
          scale={[0.08, 0.24, 0.08]}
          rotation={[Math.PI / 2, 0, 0]}
        />
      </group>

      {/* ── 2. THE FOUR MOVIE ACTORS & ACTRESSES ON SET ── */}
      {/* Lead Actor (Hero) */}
      <StudioHumanFigure
        position={[-2.4, productionLevel >= 1 ? 0.3 : 0, -2.5]}
        rotationY={0.35}
        outfitType="lead_actor"
        skinMaterial={MAT_SKIN_PEACH}
        pose={isFilming ? 'acting_hero' : 'idle'}
        isFilming={isFilming}
      />

      {/* Lead Actress (Heroine in Emerald Gown) */}
      <StudioHumanFigure
        position={[-0.8, productionLevel >= 1 ? 0.3 : 0, -2.0]}
        rotationY={0.15}
        outfitType="lead_actress"
        skinMaterial={MAT_SKIN_WARM}
        pose={isFilming ? 'acting_dramatic' : 'idle'}
        isFilming={isFilming}
      />

      {/* Co-Star / Actress (Friend) */}
      <StudioHumanFigure
        position={[1.2, productionLevel >= 1 ? 0.3 : 0, -2.2]}
        rotationY={-0.25}
        outfitType="co_star"
        skinMaterial={MAT_SKIN_PEACH}
        pose="idle"
        isFilming={isFilming}
      />

      {/* Dramatic Antagonist / Villain */}
      <StudioHumanFigure
        position={[3.2, productionLevel >= 1 ? 0.3 : 0, -2.8]}
        rotationY={-0.45}
        outfitType="villain"
        skinMaterial={MAT_SKIN_BRONZE}
        pose="acting_dramatic"
        isFilming={isFilming}
      />

      {/* ── 3. CAMERA & DOLLY CREW ── */}
      {/* Camera Operator 1 */}
      <StudioHumanFigure
        position={[0.35, 0, 4.4]}
        rotationY={Math.PI}
        outfitType="camera_crew"
        pose="filming"
        skinMaterial={MAT_SKIN_WARM}
        isFilming={isFilming}
      />

      {/* Dolly Grip */}
      <StudioHumanFigure
        position={[-5.8 + dollyProgress * 3, 0, 2.5]}
        rotationY={Math.PI / 2}
        outfitType="camera_crew"
        pose="filming"
        skinMaterial={MAT_SKIN_PEACH}
        isFilming={isFilming}
      />

      {/* ── 4. SOUND & BOOM CREW ── */}
      <group position={[-3.2, 0, 0.8]}>
        <StudioHumanFigure
          position={[0, 0, 0]}
          rotationY={0.65}
          outfitType="sound_crew"
          pose="boom_mic"
          skinMaterial={MAT_SKIN_WARM}
          isFilming={isFilming}
        />
        {/* Boom Pole & Mic */}
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

      {/* ── 5. SET PHOTOGRAPHER (With DSLR Camera) ── */}
      <group position={[4.6, 0, 1.2]}>
        <StudioHumanFigure
          position={[0, 0, 0]}
          rotationY={-0.6}
          outfitType="camera_crew"
          pose="photo"
          skinMaterial={MAT_SKIN_PEACH}
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
