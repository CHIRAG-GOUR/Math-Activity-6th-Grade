// ============================================================
// RATIO RUSH — STUDIO MOVIE SET 3D (CINEMATIC PRODUCTION SET)
// Replaces abstract floating shapes with a professional Hollywood
// soundstage set:
// - Grand Cinema Stage Platform with illuminated safety strips
// - Cinematic City Skyline Silhouette Flats & Architectural Columns
// - Neon Backlight Stage Header & Action Film Marquee
// - Stage Lighting Stanchions & Director Village Props
// ============================================================

import React from 'react';
import {
  geoBox,
  geoCylinder8,
  geoCylinder12,
  geoCylinder16,
  geoSphere12,
  MAT_STEEL_DARK,
  MAT_STEEL_BRIGHT,
  MAT_DIRECTOR_WOOD,
  MAT_SCREEN_GLOW,
  MAT_STAGE_TAPE_YELLOW,
  MAT_STAGE_TAPE_BLUE,
  MAT_STAGE_TAPE_RED,
  MAT_ROAD_CASE_BLACK,
  MAT_WARM_BULB,
  MAT_GOLD_BRASS,
  getStudioMaterial,
} from './StudioMaterials';

export const StudioMovieSet3D: React.FC<{
  productionLevel: number;
  isFilming: boolean;
}> = React.memo(({ productionLevel, isFilming }) => {
  return (
    <group position={[0, 0, -3.8]}>
      {/* ── 1. CINEMATIC STAGE BACKDROP FLATS & SKYLINE ── */}
      <group position={[0, 0, -1.8]}>
        {/* Main Stage Back Wall Panel */}
        <mesh
          geometry={geoBox}
          material={MAT_STEEL_DARK}
          scale={[14.0, 5.4, 0.2]}
          position={[0, 2.7, -0.4]}
          receiveShadow
        />

        {/* Skyline Silhouette Flats (Layer 1 - Deep Midnight) */}
        <mesh
          geometry={geoBox}
          material={getStudioMaterial('#090d16')}
          scale={[4.2, 4.2, 0.1]}
          position={[-3.6, 2.1, -0.25]}
        />
        <mesh
          geometry={geoBox}
          material={getStudioMaterial('#090d16')}
          scale={[3.8, 4.8, 0.1]}
          position={[3.6, 2.4, -0.25]}
        />
        <mesh
          geometry={geoBox}
          material={getStudioMaterial('#0c1322')}
          scale={[5.0, 3.6, 0.1]}
          position={[0, 1.8, -0.2]}
        />

        {/* Illuminated Penthouse / Skyline Windows */}
        {[-4.6, -3.8, -3.0, 2.8, 3.6, 4.4].map((wx, i) => (
          <group key={`win-col-${i}`} position={[wx, 0, -0.18]}>
            {[1.4, 2.0, 2.6, 3.2, 3.8].map((wy, j) => (
              <mesh
                key={`win-${i}-${j}`}
                geometry={geoBox}
                material={j % 2 === 0 ? MAT_WARM_BULB : MAT_SCREEN_GLOW}
                scale={[0.32, 0.18, 0.04]}
                position={[0, wy, 0]}
              />
            ))}
          </group>
        ))}

        {/* Top Stage Header Truss & Action Neon Marquee */}
        <mesh
          geometry={geoBox}
          material={MAT_STEEL_DARK}
          scale={[14.2, 0.45, 0.6]}
          position={[0, 5.2, 0]}
        />
        <mesh
          geometry={geoBox}
          material={isFilming ? MAT_STAGE_TAPE_RED : MAT_STAGE_TAPE_YELLOW}
          scale={[8.8, 0.16, 0.64]}
          position={[0, 5.2, 0]}
        />

        {/* Cinematic Stage Lighting Sconces (Left & Right) */}
        <group position={[-5.8, 3.2, 0]}>
          <mesh geometry={geoCylinder12} material={MAT_ROAD_CASE_BLACK} scale={[0.25, 0.4, 0.25]} />
          <mesh geometry={geoSphere12} material={MAT_WARM_BULB} scale={[0.2, 0.2, 0.2]} position={[0, -0.2, 0.1]} />
        </group>
        <group position={[5.8, 3.2, 0]}>
          <mesh geometry={geoCylinder12} material={MAT_ROAD_CASE_BLACK} scale={[0.25, 0.4, 0.25]} />
          <mesh geometry={geoSphere12} material={MAT_WARM_BULB} scale={[0.2, 0.2, 0.2]} position={[0, -0.2, 0.1]} />
        </group>
      </group>

      {/* ── 2. ELEVATED SOLID MOVIE STAGE PLATFORM ── */}
      {productionLevel >= 1 && (
        <group position={[0, 0, 0]}>
          {/* Main Soundstage Deck */}
          <mesh
            geometry={geoBox}
            material={MAT_STEEL_DARK}
            scale={[10.8, 0.3, 5.8]}
            position={[0, 0.15, 0]}
            receiveShadow
          />
          {/* Front Neon Edge Trim */}
          <mesh
            geometry={geoBox}
            material={isFilming ? MAT_STAGE_TAPE_YELLOW : MAT_SCREEN_GLOW}
            scale={[10.84, 0.04, 0.08]}
            position={[0, 0.28, 2.9]}
          />
          {/* Rear Edge Trim */}
          <mesh
            geometry={geoBox}
            material={MAT_STAGE_TAPE_BLUE}
            scale={[10.84, 0.04, 0.08]}
            position={[0, 0.28, -2.9]}
          />
          {/* Center Stage Access Steps */}
          <mesh
            geometry={geoBox}
            material={MAT_STEEL_BRIGHT}
            scale={[2.8, 0.15, 0.8]}
            position={[0, 0.08, 3.3]}
          />
        </group>
      )}

      {/* ── 3. CINEMA ARCHITECTURAL COLUMNS (LEFT & RIGHT) ── */}
      {productionLevel >= 2 && (
        <group position={[0, 0, -1.0]}>
          {/* Left Heroic Column */}
          <group position={[-4.8, 0, 0]}>
            <mesh geometry={geoCylinder16} material={MAT_STEEL_BRIGHT} scale={[0.38, 4.4, 0.38]} position={[0, 2.2, 0]} castShadow />
            <mesh geometry={geoBox} material={MAT_ROAD_CASE_BLACK} scale={[0.9, 0.35, 0.9]} position={[0, 0.18, 0]} />
            <mesh geometry={geoBox} material={MAT_ROAD_CASE_BLACK} scale={[0.9, 0.35, 0.9]} position={[0, 4.25, 0]} />
          </group>
          {/* Right Heroic Column */}
          <group position={[4.8, 0, 0]}>
            <mesh geometry={geoCylinder16} material={MAT_STEEL_BRIGHT} scale={[0.38, 4.4, 0.38]} position={[0, 2.2, 0]} castShadow />
            <mesh geometry={geoBox} material={MAT_ROAD_CASE_BLACK} scale={[0.9, 0.35, 0.9]} position={[0, 0.18, 0]} />
            <mesh geometry={geoBox} material={MAT_ROAD_CASE_BLACK} scale={[0.9, 0.35, 0.9]} position={[0, 4.25, 0]} />
          </group>
        </group>
      )}

      {/* ── 4. STAGE PRACTICAL LIGHTING TOWERS ── */}
      {productionLevel >= 3 && (
        <group position={[0, 0, 0]}>
          {/* Stage Left Practical Stanchion */}
          <group position={[-5.2, 0, 1.6]}>
            <mesh geometry={geoCylinder8} material={MAT_STEEL_DARK} scale={[0.04, 2.8, 0.04]} position={[0, 1.4, 0]} />
            <mesh geometry={geoBox} material={MAT_ROAD_CASE_BLACK} scale={[0.45, 0.35, 0.3]} position={[0, 2.8, 0]} />
            <mesh geometry={geoSphere12} material={MAT_WARM_BULB} scale={[0.18, 0.18, 0.18]} position={[0, 2.8, 0.16]} />
          </group>
          {/* Stage Right Practical Stanchion */}
          <group position={[5.2, 0, 1.6]}>
            <mesh geometry={geoCylinder8} material={MAT_STEEL_DARK} scale={[0.04, 2.8, 0.04]} position={[0, 1.4, 0]} />
            <mesh geometry={geoBox} material={MAT_ROAD_CASE_BLACK} scale={[0.45, 0.35, 0.3]} position={[0, 2.8, 0]} />
            <mesh geometry={geoSphere12} material={MAT_WARM_BULB} scale={[0.18, 0.18, 0.18]} position={[0, 2.8, 0.16]} />
          </group>
        </group>
      )}

      {/* ── 5. SET DRESSING: DIRECTOR SLATE STAND & ROAD CASES ── */}
      <group position={[-5.0, 0, -0.4]}>
        {/* Road Case Stack */}
        <mesh geometry={geoBox} material={MAT_ROAD_CASE_BLACK} scale={[0.8, 0.6, 0.6]} position={[0, 0.3, 0]} castShadow />
        <mesh geometry={geoBox} material={MAT_ROAD_CASE_BLACK} scale={[0.6, 0.45, 0.5]} position={[0.05, 0.82, 0]} castShadow />
        {/* Film Canisters on Case */}
        <mesh geometry={geoCylinder16} material={MAT_STEEL_BRIGHT} scale={[0.2, 0.08, 0.2]} position={[0, 1.08, 0]} />
        <mesh geometry={geoCylinder16} material={MAT_GOLD_BRASS || MAT_STAGE_TAPE_YELLOW} scale={[0.18, 0.08, 0.18]} position={[0, 1.16, 0]} />
      </group>
    </group>
  );
});

StudioMovieSet3D.displayName = 'StudioMovieSet3D';

