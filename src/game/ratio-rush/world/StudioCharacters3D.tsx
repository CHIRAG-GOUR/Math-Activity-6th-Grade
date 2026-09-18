// ============================================================
// RATIO RUSH — STUDIO CHARACTERS & CREW 3D
// Complete professional movie production crew & actor cast:
// 1. Director (directs, gestures, raises hand on Action!)
// 2. Hero (Blue & gold adventurer on marked stage mark)
// 3. Friend (Teal & orange sidekick reacting to scene)
// 4. Inventor (Steampunk/tech coat operating Ratio Core)
// 5. Villain (Crimson & purple dramatic antagonist)
// 6. Camera Operator (Operating Cinema Camera 1)
// 7. Dolly Grip (Pushing camera dolly on steel track)
// 8. Boom Mic Operator (Holding extended boom pole & mic)
// 9. Sound Engineer (Audio console with headphones)
// 10. Set Photographer (DSLR with telephoto lens & flash)
// 11. BTS Videographer (Gimbal rig recording production)
// 12. Stagehand / Prop Master (Carrying props from storage)
// 13. Lighting Technician (Adjusting C-stand softbox)
// 14. Mezzanine Control Booth Engineers
// ============================================================

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  geoBox,
  geoCylinder8,
  geoCylinder12,
  geoSphere12,
  getStudioMaterial,
  MAT_STEEL_DARK,
  MAT_STEEL_BRIGHT,
  MAT_ROAD_CASE_BLACK,
  MAT_STAGE_TAPE_YELLOW,
  MAT_STAGE_TAPE_BLUE,
  MAT_STAGE_TAPE_RED,
  MAT_DIRECTOR_WOOD,
  MAT_WARM_BULB,
} from './StudioMaterials';

// ── Generic Grounded Human Mesh Component ──
interface HumanModelProps {
  position: [number, number, number];
  rotationY?: number;
  shirtColor: THREE.MeshStandardMaterial;
  pantsColor: THREE.MeshStandardMaterial;
  skinColor?: THREE.MeshStandardMaterial;
  hairColor?: THREE.MeshStandardMaterial;
  hatType?: 'cap' | 'beret' | 'headphones' | 'none';
  pose?: 'standing' | 'holding_prop' | 'filming' | 'directing' | 'boom_mic' | 'photo' | 'crouch';
  scale?: number;
  walkProgress?: number;
  isFilming?: boolean;
}

const MAT_SKIN_LIGHT = getStudioMaterial('#fcd34d', 0.6, 0.0);
const MAT_SKIN_MED = getStudioMaterial('#d97706', 0.6, 0.0);
const MAT_HAIR_DARK = getStudioMaterial('#1e293b', 0.8, 0.0);
const MAT_HAIR_BROWN = getStudioMaterial('#78350f', 0.8, 0.0);
const MAT_HAIR_BLONDE = getStudioMaterial('#fde047', 0.8, 0.0);

export const StudioHumanFigure: React.FC<HumanModelProps> = React.memo(
  ({
    position,
    rotationY = 0,
    shirtColor,
    pantsColor,
    skinColor = MAT_SKIN_LIGHT,
    hairColor = MAT_HAIR_DARK,
    hatType = 'none',
    pose = 'standing',
    scale = 1,
    walkProgress = 0,
    isFilming = false,
  }) => {
    const leftArmRef = useRef<THREE.Group>(null);
    const rightArmRef = useRef<THREE.Group>(null);
    const leftLegRef = useRef<THREE.Group>(null);
    const rightLegRef = useRef<THREE.Group>(null);
    const headRef = useRef<THREE.Group>(null);

    useFrame(() => {
      const time = Date.now() * 0.003;
      const breath = Math.sin(time * 1.5) * 0.02;

      // Walking Kinematics
      if (walkProgress > 0) {
        const walkCycle = Math.sin(Date.now() * 0.008);
        if (leftLegRef.current) leftLegRef.current.rotation.x = walkCycle * 0.45;
        if (rightLegRef.current) rightLegRef.current.rotation.x = -walkCycle * 0.45;
        if (leftArmRef.current) leftArmRef.current.rotation.x = -walkCycle * 0.4;
        if (rightArmRef.current) rightArmRef.current.rotation.x = walkCycle * 0.4;
      } else {
        // Idle/Posed Kinematics
        if (pose === 'directing') {
          if (rightArmRef.current) {
            rightArmRef.current.rotation.x = isFilming ? -1.8 : -0.8 + breath * 4;
            rightArmRef.current.rotation.z = -0.3;
          }
          if (leftArmRef.current) {
            leftArmRef.current.rotation.x = -0.6;
            leftArmRef.current.rotation.z = 0.2;
          }
        } else if (pose === 'filming') {
          if (leftArmRef.current) leftArmRef.current.rotation.x = -1.2;
          if (rightArmRef.current) rightArmRef.current.rotation.x = -1.2;
        } else if (pose === 'photo') {
          if (leftArmRef.current) leftArmRef.current.rotation.x = -1.5;
          if (rightArmRef.current) rightArmRef.current.rotation.x = -1.6;
        } else if (pose === 'boom_mic') {
          if (leftArmRef.current) leftArmRef.current.rotation.x = -2.1;
          if (rightArmRef.current) rightArmRef.current.rotation.x = -1.9;
        } else {
          // Natural subtle idle breathing
          if (leftArmRef.current) leftArmRef.current.rotation.x = breath;
          if (rightArmRef.current) rightArmRef.current.rotation.x = -breath;
        }
      }

      if (headRef.current) {
        headRef.current.rotation.y = Math.sin(time * 0.8) * 0.08;
      }
    });

    return (
      <group position={position} rotation={[0, rotationY, 0]} scale={[scale, scale, scale]}>
        {/* ── SHOES & LEGS (Grounded at Y=0) ── */}
        {/* Left Leg */}
        <group ref={leftLegRef} position={[-0.14, 0.72, 0]}>
          <mesh
            geometry={geoBox}
            material={pantsColor}
            scale={[0.16, 0.72, 0.16]}
            position={[0, -0.36, 0]}
          />
          {/* Shoe */}
          <mesh
            geometry={geoBox}
            material={MAT_ROAD_CASE_BLACK}
            scale={[0.17, 0.1, 0.24]}
            position={[0, -0.68, 0.04]}
          />
        </group>

        {/* Right Leg */}
        <group ref={rightLegRef} position={[0.14, 0.72, 0]}>
          <mesh
            geometry={geoBox}
            material={pantsColor}
            scale={[0.16, 0.72, 0.16]}
            position={[0, -0.36, 0]}
          />
          <mesh
            geometry={geoBox}
            material={MAT_ROAD_CASE_BLACK}
            scale={[0.17, 0.1, 0.24]}
            position={[0, -0.68, 0.04]}
          />
        </group>

        {/* ── PELVIS & TORSO ── */}
        <mesh
          geometry={geoBox}
          material={pantsColor}
          scale={[0.42, 0.16, 0.26]}
          position={[0, 0.8, 0]}
        />
        <mesh
          geometry={geoBox}
          material={shirtColor}
          scale={[0.45, 0.52, 0.28]}
          position={[0, 1.14, 0]}
        />

        {/* ── ARMS ── */}
        {/* Left Arm */}
        <group ref={leftArmRef} position={[-0.28, 1.34, 0]}>
          <mesh
            geometry={geoBox}
            material={shirtColor}
            scale={[0.13, 0.5, 0.14]}
            position={[0, -0.25, 0]}
          />
          {/* Hand */}
          <mesh
            geometry={geoSphere12}
            material={skinColor}
            scale={[0.07, 0.07, 0.07]}
            position={[0, -0.54, 0]}
          />
        </group>

        {/* Right Arm */}
        <group ref={rightArmRef} position={[0.28, 1.34, 0]}>
          <mesh
            geometry={geoBox}
            material={shirtColor}
            scale={[0.13, 0.5, 0.14]}
            position={[0, -0.25, 0]}
          />
          <mesh
            geometry={geoSphere12}
            material={skinColor}
            scale={[0.07, 0.07, 0.07]}
            position={[0, -0.54, 0]}
          />
        </group>

        {/* ── HEAD & ACCESSORIES ── */}
        <group ref={headRef} position={[0, 1.56, 0]}>
          {/* Neck */}
          <mesh
            geometry={geoCylinder8}
            material={skinColor}
            scale={[0.08, 0.12, 0.08]}
            position={[0, -0.06, 0]}
          />
          {/* Head */}
          <mesh
            geometry={geoBox}
            material={skinColor}
            scale={[0.3, 0.32, 0.28]}
            position={[0, 0.16, 0]}
          />
          {/* Hair */}
          <mesh
            geometry={geoBox}
            material={hairColor}
            scale={[0.32, 0.14, 0.3]}
            position={[0, 0.31, -0.01]}
          />

          {/* Hat / Headphones Overlays */}
          {hatType === 'cap' && (
            <group position={[0, 0.32, 0]}>
              <mesh geometry={geoBox} material={MAT_ROAD_CASE_BLACK} scale={[0.33, 0.08, 0.33]} />
              <mesh
                geometry={geoBox}
                material={MAT_ROAD_CASE_BLACK}
                scale={[0.28, 0.02, 0.2]}
                position={[0, -0.02, 0.24]}
              />
            </group>
          )}

          {hatType === 'headphones' && (
            <group position={[0, 0.18, 0]}>
              {/* Headband */}
              <mesh
                geometry={geoCylinder8}
                material={MAT_STEEL_DARK}
                scale={[0.18, 0.04, 0.18]}
                rotation={[0, 0, Math.PI / 2]}
                position={[0, 0.14, 0]}
              />
              {/* Earcups */}
              <mesh
                geometry={geoCylinder8}
                material={MAT_ROAD_CASE_BLACK}
                scale={[0.08, 0.06, 0.08]}
                position={[-0.18, 0, 0]}
                rotation={[0, 0, Math.PI / 2]}
              />
              <mesh
                geometry={geoCylinder8}
                material={MAT_ROAD_CASE_BLACK}
                scale={[0.08, 0.06, 0.08]}
                position={[0.18, 0, 0]}
                rotation={[0, 0, Math.PI / 2]}
              />
            </group>
          )}
        </group>
      </group>
    );
  }
);

StudioHumanFigure.displayName = 'StudioHumanFigure';

// ============================================================
// FULL STUDIO CREW & ACTOR CAST
// ============================================================
export const StudioCharacters3D: React.FC<{
  isFilming: boolean;
  productionLevel: number;
  dollyProgress?: number;
}> = React.memo(({ isFilming, productionLevel, dollyProgress = 0 }) => {
  // Pre-cached materials for cast & crew
  const matHeroShirt = getStudioMaterial('#1d4ed8', 0.5, 0.1);
  const matHeroPants = getStudioMaterial('#1e293b', 0.6, 0.1);
  const matFriendShirt = getStudioMaterial('#0d9488', 0.5, 0.1);
  const matFriendPants = getStudioMaterial('#ea580c', 0.6, 0.1);
  const matInventorShirt = getStudioMaterial('#e2e8f0', 0.4, 0.0);
  const matInventorPants = getStudioMaterial('#475569', 0.6, 0.1);
  const matVillainShirt = getStudioMaterial('#7e22ce', 0.4, 0.2);
  const matVillainPants = getStudioMaterial('#1e1b4b', 0.6, 0.1);
  const matDirectorShirt = getStudioMaterial('#0f172a', 0.5, 0.1);
  const matDirectorPants = getStudioMaterial('#334155', 0.6, 0.1);
  const matCrewShirt = getStudioMaterial('#1e293b', 0.6, 0.0);
  const matCrewPants = getStudioMaterial('#0f172a', 0.6, 0.0);

  return (
    <group>
      {/* ── 1. THE DIRECTOR ── */}
      {/* Beside Video Village Monitor Cart */}
      <StudioHumanFigure
        position={[2.8, 0, 5.2]}
        rotationY={-0.35}
        shirtColor={matDirectorShirt}
        pantsColor={matDirectorPants}
        hairColor={MAT_HAIR_DARK}
        hatType="cap"
        pose="directing"
        isFilming={isFilming}
      />
      {/* Director Megaphone in Hand */}
      <group position={[3.15, 1.15, 5.0]} rotation={[-0.4, -0.3, 0]}>
        <mesh
          geometry={geoCylinder8}
          material={MAT_STAGE_TAPE_YELLOW}
          scale={[0.08, 0.22, 0.08]}
          rotation={[Math.PI / 2, 0, 0]}
        />
      </group>

      {/* ── 2. THE FOUR MAIN ACTORS ON MOVIE SET ── */}
      {/* Hero (Protagonist) */}
      <StudioHumanFigure
        position={[-2.5, productionLevel >= 1 ? 0.3 : 0, -2.5]}
        rotationY={0.35}
        shirtColor={matHeroShirt}
        pantsColor={matHeroPants}
        hairColor={MAT_HAIR_BROWN}
        pose={isFilming ? 'holding_prop' : 'standing'}
        isFilming={isFilming}
      />

      {/* Friend (Sidekick) */}
      <StudioHumanFigure
        position={[-0.9, productionLevel >= 1 ? 0.3 : 0, -2.0]}
        rotationY={0.15}
        shirtColor={matFriendShirt}
        pantsColor={matFriendPants}
        hairColor={MAT_HAIR_BLONDE}
        pose="standing"
        isFilming={isFilming}
      />

      {/* Inventor (Operating the Ratio Core) */}
      <StudioHumanFigure
        position={[1.2, productionLevel >= 1 ? 0.3 : 0, -2.2]}
        rotationY={-0.25}
        shirtColor={matInventorShirt}
        pantsColor={matInventorPants}
        hairColor={MAT_HAIR_DARK}
        pose={productionLevel >= 3 ? 'holding_prop' : 'standing'}
        isFilming={isFilming}
      />

      {/* Villain (Dramatic Stance) */}
      <StudioHumanFigure
        position={[3.2, productionLevel >= 1 ? 0.3 : 0, -2.8]}
        rotationY={-0.45}
        shirtColor={matVillainShirt}
        pantsColor={matVillainPants}
        hairColor={MAT_HAIR_DARK}
        pose="directing"
        isFilming={isFilming}
      />
      {/* Villain Cape */}
      <mesh
        geometry={geoBox}
        material={MAT_STAGE_TAPE_RED}
        scale={[0.55, 1.1, 0.04]}
        position={[3.2, productionLevel >= 1 ? 1.4 : 1.1, -2.95]}
        rotation={[-0.1, -0.45, 0]}
      />

      {/* ── 3. CAMERA CREW ── */}
      {/* Camera Operator 1 (Beside Main Studio Camera) */}
      <StudioHumanFigure
        position={[0.35, 0, 4.4]}
        rotationY={Math.PI}
        shirtColor={matCrewShirt}
        pantsColor={matCrewPants}
        hairColor={MAT_HAIR_DARK}
        hatType="cap"
        pose="filming"
        isFilming={isFilming}
      />

      {/* Dolly Grip (Pushing Dolly along track) */}
      <StudioHumanFigure
        position={[-5.8 + dollyProgress * 3, 0, 2.5]}
        rotationY={Math.PI / 2}
        shirtColor={matCrewShirt}
        pantsColor={matCrewPants}
        hairColor={MAT_HAIR_BROWN}
        hatType="cap"
        pose="filming"
        isFilming={isFilming}
      />

      {/* ── 4. SOUND CREW ── */}
      {/* Boom Mic Operator */}
      <group position={[-3.2, 0, 0.8]}>
        <StudioHumanFigure
          position={[0, 0, 0]}
          rotationY={0.65}
          shirtColor={matCrewShirt}
          pantsColor={matCrewPants}
          hairColor={MAT_HAIR_DARK}
          hatType="headphones"
          pose="boom_mic"
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
          {/* Fuzzy Blimp / Deadcat Windscreen */}
          <mesh
            geometry={geoCylinder12}
            material={MAT_ROAD_CASE_BLACK}
            scale={[0.08, 0.35, 0.08]}
            position={[0, 3.8, 0]}
            rotation={[Math.PI / 2, 0, 0]}
          />
        </group>
      </group>

      {/* Sound Engineer at Audio Rack */}
      <StudioHumanFigure
        position={[-7.5, 0, 4.8]}
        rotationY={-0.4}
        shirtColor={matCrewShirt}
        pantsColor={matCrewPants}
        hairColor={MAT_HAIR_DARK}
        hatType="headphones"
        pose="standing"
      />

      {/* ── 5. PRODUCTION PHOTOGRAPHER (DSLR with Telephoto Lens) ── */}
      <group position={[4.6, 0, 1.2]}>
        <StudioHumanFigure
          position={[0, 0, 0]}
          rotationY={-0.6}
          shirtColor={getStudioMaterial('#0284c7')}
          pantsColor={matCrewPants}
          hairColor={MAT_HAIR_BROWN}
          pose="photo"
          isFilming={isFilming}
        />
        {/* DSLR Camera Body & Lens */}
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

      {/* ── 6. BTS VIDEOGRAPHER (Gimbal Rig) ── */}
      <group position={[1.8, 0, 2.8]}>
        <StudioHumanFigure
          position={[0, 0, 0]}
          rotationY={-0.8}
          shirtColor={getStudioMaterial('#d97706')}
          pantsColor={matCrewPants}
          hairColor={MAT_HAIR_DARK}
          pose="filming"
          isFilming={isFilming}
        />
        {/* 3-Axis Motorized Gimbal & Camera */}
        <group position={[-0.1, 1.25, -0.3]} rotation={[-0.2, -0.8, 0]}>
          <mesh geometry={geoCylinder8} material={MAT_STEEL_DARK} scale={[0.03, 0.45, 0.03]} />
          <mesh
            geometry={geoBox}
            material={MAT_ROAD_CASE_BLACK}
            scale={[0.16, 0.12, 0.2]}
            position={[0, 0.22, -0.05]}
          />
        </group>
      </group>

      {/* ── 7. LIGHTING TECHNICIAN ── */}
      {/* Beside Left C-Stand Softbox */}
      <StudioHumanFigure
        position={[-6.2, 0, 0.6]}
        rotationY={0.4}
        shirtColor={matCrewShirt}
        pantsColor={matCrewPants}
        hairColor={MAT_HAIR_DARK}
        hatType="cap"
        pose="standing"
      />

      {/* ── 8. STAGEHAND / PROP MASTER (Near Prop Department) ── */}
      <StudioHumanFigure
        position={[-13.5, 0, 0]}
        rotationY={Math.PI / 2}
        shirtColor={getStudioMaterial('#16a34a')}
        pantsColor={matCrewPants}
        hairColor={MAT_HAIR_BROWN}
        pose={productionLevel >= 1 ? 'holding_prop' : 'standing'}
      />

      {/* ── 9. MEZZANINE CONTROL BOOTH OPERATORS (Upstairs behind glass) ── */}
      <StudioHumanFigure
        position={[-3.5, 4.5, 12.0]}
        rotationY={Math.PI}
        shirtColor={matCrewShirt}
        pantsColor={matCrewPants}
        hairColor={MAT_HAIR_DARK}
        hatType="headphones"
        pose="standing"
        scale={0.9}
      />
      <StudioHumanFigure
        position={[3.5, 4.5, 12.0]}
        rotationY={Math.PI}
        shirtColor={getStudioMaterial('#2563eb')}
        pantsColor={matCrewPants}
        hairColor={MAT_HAIR_BLONDE}
        hatType="headphones"
        pose="standing"
        scale={0.9}
      />
    </group>
  );
});

StudioCharacters3D.displayName = 'StudioCharacters3D';
