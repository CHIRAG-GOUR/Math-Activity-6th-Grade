// ============================================================
// RATIO RUSH — STUDIO EQUIPMENT 3D (LIGHT THEME & HANGING LIGHTS)
// Authentic professional studio setup based on real film soundstages:
// - Overhead Ceiling Pantograph & Drop Lighting Array (12+ Hanging Lights)
// - Foreground Cinema Camera on Tripod with Back LCD Screen
// - Video Village Rolling Floor TV Monitor Cart
// - Talk-show Director Table & Studio Armchair
// - Large Floor C-Stand Softboxes with Sandbags
// - Camera Dolly on Steel Rails
// - Grounded BNC & XLR Cables with Yellow Protective Ramps
// ============================================================

import React from 'react';
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
  MAT_ROAD_CASE_CORNER,
  MAT_CABLE_BLACK,
  MAT_CABLE_YELLOW,
  MAT_CABLE_RAMP,
  MAT_DIRECTOR_WOOD,
  MAT_DIRECTOR_CANVAS,
  MAT_SCREEN_GLOW,
  MAT_SCREEN_RECORDING,
  MAT_WARM_BULB,
  MAT_STUDIO_LIGHT_WHITE,
  MAT_STAGE_TAPE_YELLOW,
} from './StudioMaterials';

export const StudioEquipment3D: React.FC<{
  isFilming: boolean;
  dollyProgress?: number;
}> = React.memo(({ isFilming, dollyProgress = 0 }) => {
  // Array of 10 hanging ceiling pantograph lights like in Reference Photo 1
  const hangingLights = [
    { x: -7.5, y: 5.8, z: -1.0, type: 'softbox', rotY: 0.3, rotX: 0.35, drop: 2.2 },
    { x: -5.0, y: 5.6, z: -2.5, type: 'fresnel', rotY: 0.2, rotX: 0.4, drop: 2.4 },
    { x: -2.8, y: 6.0, z: -0.5, type: 'cone', rotY: 0.1, rotX: 0.3, drop: 2.0 },
    { x: -0.8, y: 5.4, z: -2.0, type: 'big_softbox', rotY: 0, rotX: 0.45, drop: 2.6 },
    { x: 1.5, y: 5.9, z: -0.8, type: 'fresnel', rotY: -0.15, rotX: 0.35, drop: 2.1 },
    { x: 3.8, y: 5.5, z: -2.2, type: 'softbox', rotY: -0.25, rotX: 0.4, drop: 2.5 },
    { x: 6.0, y: 5.8, z: -0.5, type: 'cone', rotY: -0.35, rotX: 0.35, drop: 2.2 },
    { x: 8.0, y: 5.4, z: -2.0, type: 'fresnel', rotY: -0.4, rotX: 0.45, drop: 2.6 },
    { x: -3.5, y: 6.4, z: 2.0, type: 'cone', rotY: 0.2, rotX: 0.25, drop: 1.6 },
    { x: 3.5, y: 6.4, z: 2.0, type: 'cone', rotY: -0.2, rotX: 0.25, drop: 1.6 },
  ];

  return (
    <group>
      {/* ── 1. CEILING HANGING LIGHTING RIG & DROP PANTOGRAPHS (Photo 1) ── */}
      <group>
        {hangingLights.map((l, idx) => (
          <group key={`hang-light-${idx}`} position={[l.x, l.y, l.z]}>
            {/* Vertical Drop Rod / Scissor Pantograph */}
            <mesh
              geometry={geoCylinder8}
              material={MAT_STEEL_DARK}
              scale={[0.03, l.drop, 0.03]}
              position={[0, l.drop / 2, 0]}
            />
            {/* Hanging Power Cable Drop Coil */}
            <mesh
              geometry={geoCylinder8}
              material={MAT_CABLE_BLACK}
              scale={[0.015, l.drop * 1.05, 0.015]}
              position={[0.08, l.drop / 2, 0.05]}
            />

            {/* Light Fixture Head */}
            <group rotation={[l.rotX, l.rotY, 0]}>
              {l.type === 'softbox' && (
                <group>
                  <mesh geometry={geoBox} material={MAT_ROAD_CASE_BLACK} scale={[0.85, 0.6, 0.4]} />
                  <mesh
                    geometry={geoBox}
                    material={MAT_STUDIO_LIGHT_WHITE}
                    scale={[0.8, 0.55, 0.04]}
                    position={[0, 0, -0.2]}
                  />
                </group>
              )}

              {l.type === 'big_softbox' && (
                <group>
                  <mesh geometry={geoBox} material={MAT_ROAD_CASE_BLACK} scale={[1.4, 0.9, 0.5]} />
                  <mesh
                    geometry={geoBox}
                    material={MAT_WARM_BULB}
                    scale={[1.34, 0.84, 0.04]}
                    position={[0, 0, -0.25]}
                  />
                </group>
              )}

              {l.type === 'fresnel' && (
                <group>
                  <mesh
                    geometry={geoCylinder12}
                    material={MAT_ROAD_CASE_BLACK}
                    scale={[0.3, 0.5, 0.3]}
                    rotation={[Math.PI / 2, 0, 0]}
                  />
                  <mesh
                    geometry={geoSphere12}
                    material={MAT_STUDIO_LIGHT_WHITE}
                    scale={[0.26, 0.08, 0.26]}
                    position={[0, 0, -0.25]}
                    rotation={[Math.PI / 2, 0, 0]}
                  />
                </group>
              )}

              {l.type === 'cone' && (
                <group>
                  <mesh
                    geometry={geoCylinder12}
                    material={MAT_ROAD_CASE_BLACK}
                    scale={[0.28, 0.4, 0.2]}
                    rotation={[Math.PI / 2, 0, 0]}
                  />
                  <mesh
                    geometry={geoSphere12}
                    material={MAT_WARM_BULB}
                    scale={[0.24, 0.06, 0.24]}
                    position={[0, 0, -0.2]}
                    rotation={[Math.PI / 2, 0, 0]}
                  />
                </group>
              )}
            </group>
          </group>
        ))}
      </group>

      {/* ── 2. FOREGROUND CINEMA CAMERA 1 ON TRIPOD (Photo 2) ── */}
      {/* Positioned in foreground looking right at the actors */}
      <group position={[1.4, 0, 4.6]}>
        {/* Pro Video Tripod (Spread 3 Steel Legs) */}
        <mesh
          geometry={geoCylinder8}
          material={MAT_STEEL_DARK}
          scale={[0.035, 1.45, 0.035]}
          position={[-0.32, 0.7, 0.2]}
          rotation={[-0.15, 0, 0.2]}
        />
        <mesh
          geometry={geoCylinder8}
          material={MAT_STEEL_DARK}
          scale={[0.035, 1.45, 0.035]}
          position={[0.32, 0.7, 0.2]}
          rotation={[-0.15, 0, -0.2]}
        />
        <mesh
          geometry={geoCylinder8}
          material={MAT_STEEL_DARK}
          scale={[0.035, 1.45, 0.035]}
          position={[0, 0.7, -0.35]}
          rotation={[0.25, 0, 0]}
        />
        {/* Ground Mid-Level Spreader */}
        <mesh
          geometry={geoCylinder12}
          material={MAT_STEEL_BRIGHT}
          scale={[0.4, 0.02, 0.4]}
          position={[0, 0.25, 0]}
        />

        {/* Fluid Head & Cinema Camera Body */}
        <group position={[0, 1.42, 0]}>
          <mesh geometry={geoBox} material={MAT_STEEL_DARK} scale={[0.25, 0.16, 0.25]} />
          {/* Camera Body (Facing forward toward green screen) */}
          <mesh
            geometry={geoBox}
            material={MAT_ROAD_CASE_BLACK}
            scale={[0.36, 0.3, 0.55]}
            position={[0, 0.22, 0]}
          />
          {/* Cinema Lens & Matte Box (Pointing Forward) */}
          <mesh
            geometry={geoCylinder16}
            material={MAT_STEEL_DARK}
            scale={[0.11, 0.28, 0.11]}
            position={[0, 0.22, -0.38]}
            rotation={[Math.PI / 2, 0, 0]}
          />
          <mesh
            geometry={geoBox}
            material={MAT_ROAD_CASE_BLACK}
            scale={[0.38, 0.32, 0.1]}
            position={[0, 0.22, -0.52]}
          />
          {/* Back LCD Monitor (Facing Viewer/Director) */}
          <mesh
            geometry={geoBox}
            material={isFilming ? MAT_SCREEN_RECORDING : MAT_SCREEN_GLOW}
            scale={[0.3, 0.2, 0.02]}
            position={[0, 0.24, 0.28]}
          />
          {/* Top Viewfinder Monitor */}
          <mesh
            geometry={geoBox}
            material={MAT_SCREEN_GLOW}
            scale={[0.22, 0.14, 0.04]}
            position={[-0.12, 0.45, 0]}
            rotation={[0, 0.2, 0]}
          />
          {/* Pan Bar Handle (Facing Director) */}
          <mesh
            geometry={geoCylinder8}
            material={MAT_STEEL_BRIGHT}
            scale={[0.02, 0.45, 0.02]}
            position={[0.2, 0.05, 0.25]}
            rotation={[-0.4, 0, 0]}
          />
        </group>
      </group>

      {/* ── 3. SECOND CAMERA ON TRIPOD (Stage Left Foreground) ── */}
      <group position={[-3.8, 0, 4.4]}>
        <mesh
          geometry={geoCylinder8}
          material={MAT_STEEL_DARK}
          scale={[0.035, 1.45, 0.035]}
          position={[-0.3, 0.7, 0.2]}
          rotation={[-0.15, 0, 0.2]}
        />
        <mesh
          geometry={geoCylinder8}
          material={MAT_STEEL_DARK}
          scale={[0.035, 1.45, 0.035]}
          position={[0.3, 0.7, 0.2]}
          rotation={[-0.15, 0, -0.2]}
        />
        <mesh
          geometry={geoCylinder8}
          material={MAT_STEEL_DARK}
          scale={[0.035, 1.45, 0.035]}
          position={[0, 0.7, -0.35]}
          rotation={[0.25, 0, 0]}
        />
        <group position={[0, 1.42, 0]}>
          <mesh geometry={geoBox} material={MAT_ROAD_CASE_BLACK} scale={[0.32, 0.26, 0.48]} />
          <mesh
            geometry={geoCylinder12}
            material={MAT_STEEL_DARK}
            scale={[0.09, 0.22, 0.09]}
            position={[0, 0, -0.32]}
            rotation={[Math.PI / 2, 0, 0]}
          />
          <mesh
            geometry={geoBox}
            material={MAT_SCREEN_GLOW}
            scale={[0.28, 0.18, 0.02]}
            position={[0, 0, 0.25]}
          />
        </group>
      </group>

      {/* ── 4. PRODUCTION MONITOR ON ROLLING RACK CART (Photo 1) ── */}
      <group position={[-1.8, 0, 3.2]}>
        {/* Metal Cart Frame */}
        <mesh
          geometry={geoBox}
          material={MAT_STEEL_DARK}
          scale={[0.9, 0.85, 0.6]}
          position={[0, 0.42, 0]}
        />
        {/* 40" Client / Director LCD TV Monitor on Cart */}
        <mesh
          geometry={geoBox}
          material={MAT_ROAD_CASE_BLACK}
          scale={[1.2, 0.75, 0.08]}
          position={[0, 1.25, 0]}
        />
        <mesh
          geometry={geoBox}
          material={isFilming ? MAT_SCREEN_RECORDING : MAT_SCREEN_GLOW}
          scale={[1.14, 0.69, 0.02]}
          position={[0, 1.25, 0.05]}
        />
        {/* Cable bundle dropping down cart back to floor */}
        <mesh
          geometry={geoCylinder8}
          material={MAT_CABLE_BLACK}
          scale={[0.04, 1.1, 0.04]}
          position={[0.2, 0.55, -0.25]}
        />
      </group>

      {/* ── 5. STUDIO TALK-SHOW TABLE & ARMCHAIR (Photo 1) ── */}
      {/* Black Modern Pedestal Table */}
      <group position={[0, 0, 0.2]}>
        {/* Base Disc */}
        <mesh
          geometry={geoCylinder12}
          material={MAT_ROAD_CASE_BLACK}
          scale={[0.4, 0.02, 0.4]}
          position={[0, 0.01, 0]}
        />
        {/* Curved Center Pedestal */}
        <mesh
          geometry={geoCylinder8}
          material={MAT_ROAD_CASE_BLACK}
          scale={[0.08, 0.75, 0.08]}
          position={[0, 0.38, 0]}
        />
        {/* Round Black Tabletop */}
        <mesh
          geometry={geoCylinder16}
          material={MAT_ROAD_CASE_BLACK}
          scale={[0.65, 0.03, 0.65]}
          position={[0, 0.75, 0]}
        />
      </group>

      {/* Modern Studio Armchair in Light Cream Fabric */}
      <group position={[3.6, 0, 0.4]} rotation={[0, -0.4, 0]}>
        {/* Seat Cushion */}
        <mesh
          geometry={geoBox}
          material={getStudioMaterial('#f1f5f9', 0.8, 0.0)}
          scale={[0.85, 0.4, 0.85]}
          position={[0, 0.25, 0]}
        />
        {/* Curved Backrest */}
        <mesh
          geometry={geoBox}
          material={getStudioMaterial('#e2e8f0', 0.8, 0.0)}
          scale={[0.85, 0.65, 0.25]}
          position={[0, 0.65, -0.32]}
        />
        {/* Left Armrest */}
        <mesh
          geometry={geoBox}
          material={getStudioMaterial('#e2e8f0', 0.8, 0.0)}
          scale={[0.2, 0.45, 0.85]}
          position={[-0.38, 0.5, 0]}
        />
        {/* Right Armrest */}
        <mesh
          geometry={geoBox}
          material={getStudioMaterial('#e2e8f0', 0.8, 0.0)}
          scale={[0.2, 0.45, 0.85]}
          position={[0.38, 0.5, 0]}
        />
      </group>

      {/* ── 6. FLOOR C-STAND SOFTBOXES WITH SANDBAGS (Photo 2) ── */}
      {/* Left Stage Front Softbox */}
      <group position={[-5.8, 0, 2.2]}>
        <mesh
          geometry={geoCylinder8}
          material={MAT_STEEL_BRIGHT}
          scale={[0.04, 2.8, 0.04]}
          position={[0, 1.4, 0]}
        />
        <mesh
          geometry={geoBox}
          material={MAT_CABLE_YELLOW}
          scale={[0.3, 0.12, 0.2]}
          position={[0, 0.06, 0.15]}
        />
        {/* Softbox Hood (Aimed at stage center) */}
        <group position={[0, 2.4, 0]} rotation={[-0.2, 0.6, 0]}>
          <mesh geometry={geoBox} material={MAT_ROAD_CASE_BLACK} scale={[1.2, 1.2, 0.4]} />
          <mesh
            geometry={geoBox}
            material={MAT_STUDIO_LIGHT_WHITE}
            scale={[1.14, 1.14, 0.04]}
            position={[0, 0, -0.2]}
          />
        </group>
      </group>

      {/* Right Stage Front Softbox */}
      <group position={[6.5, 0, 2.2]}>
        <mesh
          geometry={geoCylinder8}
          material={MAT_STEEL_BRIGHT}
          scale={[0.04, 2.8, 0.04]}
          position={[0, 1.4, 0]}
        />
        <mesh
          geometry={geoBox}
          material={MAT_CABLE_YELLOW}
          scale={[0.3, 0.12, 0.2]}
          position={[0, 0.06, 0.15]}
        />
        <group position={[0, 2.4, 0]} rotation={[-0.2, -0.6, 0]}>
          <mesh geometry={geoBox} material={MAT_ROAD_CASE_BLACK} scale={[1.2, 1.2, 0.4]} />
          <mesh
            geometry={geoBox}
            material={MAT_WARM_BULB}
            scale={[1.14, 1.14, 0.04]}
            position={[0, 0, -0.2]}
          />
        </group>
      </group>

      {/* ── 7. GROUNDED CABLE RUNS WITH RAMPS ACROSS THE FLOOR ── */}
      {/* Black BNC SDI Video Cable: Camera 1 → Monitor Cart */}
      <mesh
        geometry={geoBox}
        material={MAT_CABLE_BLACK}
        scale={[0.04, 0.02, 2.2]}
        position={[0.2, 0.015, 3.8]}
      />
      {/* Yellow Power Cable: Softbox Left → Wall Trunk */}
      <mesh
        geometry={geoBox}
        material={MAT_CABLE_YELLOW}
        scale={[0.04, 0.02, 5.0]}
        position={[-5.2, 0.015, 4.5]}
      />
      {/* Yellow/Black Cable Protector Ramps */}
      <group position={[-1.8, 0, 4.8]}>
        <mesh
          geometry={geoBox}
          material={MAT_CABLE_RAMP}
          scale={[1.2, 0.04, 0.4]}
          position={[0, 0.02, 0]}
        />
        <mesh
          geometry={geoBox}
          material={MAT_ROAD_CASE_BLACK}
          scale={[1.22, 0.045, 0.08]}
          position={[0, 0.022, 0]}
        />
      </group>
    </group>
  );
});

StudioEquipment3D.displayName = 'StudioEquipment3D';
