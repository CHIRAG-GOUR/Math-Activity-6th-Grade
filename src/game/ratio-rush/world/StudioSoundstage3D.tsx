// ============================================================
// RATIO RUSH — STUDIO SOUNDSTAGE 3D ENVIRONMENT (LIGHT THEME)
// Professional high-brightness film studio facility:
// - Panoramic Chroma-Key Green Cyclorama Backdrop (Photo 1)
// - Overhead Acoustic Ceiling Baffles & Steel Lighting Pipes
// - Polished Light Concrete Studio Floor with Stage Tape Markings
// - Bright White Acoustic Studio Walls & Natural Wood Acoustic Slats
// - Mezzanine Control Booth with Glass Window Overlooking the Stage
// - Wardrobe Department & Prop Storage Area
// ============================================================

import React, { useMemo } from 'react';
import * as THREE from 'three';
import {
  geoBox,
  geoCylinder8,
  geoCylinder12,
  geoSphere12,
  geoPlane,
  getStudioMaterial,
  MAT_FLOOR_CONCRETE,
  MAT_FLOOR_STAGE,
  MAT_STAGE_TAPE_YELLOW,
  MAT_STAGE_TAPE_BLUE,
  MAT_STAGE_TAPE_RED,
  MAT_WALL_STUDIO,
  MAT_WALL_ACOUSTIC,
  MAT_WALL_ACOUSTIC_ACCENT,
  MAT_CEILING_TRUSS,
  MAT_STEEL_DARK,
  MAT_STEEL_BRIGHT,
  MAT_CHROMA_GREEN,
  MAT_ROAD_CASE_BLACK,
  MAT_ROAD_CASE_CORNER,
  MAT_WARM_BULB,
  MAT_GLASS_TINT,
  MAT_RED_CARPET,
  MAT_GOLD_BRASS,
  MAT_SCREEN_GLOW,
  MAT_SCREEN_RECORDING,
  MAT_DIRECTOR_WOOD,
  MAT_DIRECTOR_CANVAS,
} from './StudioMaterials';

export const StudioSoundstage3D: React.FC<{ isFilming: boolean; isPremiere: boolean }> = React.memo(
  ({ isFilming, isPremiere }) => {
    // Memoized costume palette for wardrobe racks
    const outfitColors = useMemo(
      () => [
        getStudioMaterial('#2563eb'),
        getStudioMaterial('#dc2626'),
        getStudioMaterial('#eab308'),
        getStudioMaterial('#16a34a'),
        getStudioMaterial('#9333ea'),
        getStudioMaterial('#0ea5e9'),
      ],
      []
    );

    return (
      <group>
        {/* ── 1. MAIN LIGHT CONCRETE STUDIO FLOOR (Photo 1) ── */}
        <mesh
          geometry={geoBox}
          material={MAT_FLOOR_CONCRETE}
          scale={[48, 0.4, 36]}
          position={[0, -0.2, 0]}
        />

        {/* ── 2. CENTRAL GREEN SCREEN STAGE DECK (Photo 1) ── */}
        <mesh
          geometry={geoBox}
          material={MAT_FLOOR_STAGE}
          scale={[22, 0.08, 16]}
          position={[0, 0.04, -1]}
        />

        {/* Stage Border Yellow Hazard Tape */}
        <mesh
          geometry={geoBox}
          material={MAT_STAGE_TAPE_YELLOW}
          scale={[22.2, 0.02, 0.15]}
          position={[0, 0.085, 7]}
        />
        <mesh
          geometry={geoBox}
          material={MAT_STAGE_TAPE_YELLOW}
          scale={[0.15, 0.02, 16.2]}
          position={[-11.1, 0.085, -1]}
        />
        <mesh
          geometry={geoBox}
          material={MAT_STAGE_TAPE_YELLOW}
          scale={[0.15, 0.02, 16.2]}
          position={[11.1, 0.085, -1]}
        />

        {/* Actor T-Mark Floor Tape */}
        <group position={[-2.4, 0.09, -2.5]}>
          <mesh geometry={geoBox} material={MAT_STAGE_TAPE_BLUE} scale={[0.6, 0.01, 0.1]} />
          <mesh
            geometry={geoBox}
            material={MAT_STAGE_TAPE_BLUE}
            scale={[0.1, 0.01, 0.45]}
            position={[0, 0, 0.22]}
          />
        </group>
        <group position={[-0.8, 0.09, -2.2]}>
          <mesh geometry={geoBox} material={MAT_STAGE_TAPE_BLUE} scale={[0.6, 0.01, 0.1]} />
          <mesh
            geometry={geoBox}
            material={MAT_STAGE_TAPE_BLUE}
            scale={[0.1, 0.01, 0.45]}
            position={[0, 0, 0.22]}
          />
        </group>
        <group position={[1.2, 0.09, -2.4]}>
          <mesh geometry={geoBox} material={MAT_STAGE_TAPE_YELLOW} scale={[0.6, 0.01, 0.1]} />
          <mesh
            geometry={geoBox}
            material={MAT_STAGE_TAPE_YELLOW}
            scale={[0.1, 0.01, 0.45]}
            position={[0, 0, 0.22]}
          />
        </group>
        <group position={[3.0, 0.09, -2.8]}>
          <mesh geometry={geoBox} material={MAT_STAGE_TAPE_RED} scale={[0.6, 0.01, 0.1]} />
          <mesh
            geometry={geoBox}
            material={MAT_STAGE_TAPE_RED}
            scale={[0.1, 0.01, 0.45]}
            position={[0, 0, 0.22]}
          />
        </group>

        {/* ── 3. VIBRANT CHROMA-KEY GREEN CYCLORAMA WALL (Photo 1) ── */}
        <group position={[0, 0, -6.5]}>
          {/* Main Curved Backdrop Wall */}
          <mesh
            geometry={geoBox}
            material={MAT_CHROMA_GREEN}
            scale={[24, 9.5, 0.4]}
            position={[0, 4.75, 0]}
          />
          {/* Green Seamless Cyclorama Floor Extension */}
          <mesh
            geometry={geoBox}
            material={MAT_CHROMA_GREEN}
            scale={[24, 0.06, 5.0]}
            position={[0, 0.06, 2.5]}
          />
          {/* Tracking Cross Markers on Chroma Backdrop */}
          {[-8, -4, 0, 4, 8].map((tx) =>
            [3.0, 6.0].map((ty) => (
              <group key={`cross-${tx}-${ty}`} position={[tx, ty, 0.22]}>
                <mesh geometry={geoBox} material={MAT_STAGE_TAPE_YELLOW} scale={[0.25, 0.04, 0.02]} />
                <mesh geometry={geoBox} material={MAT_STAGE_TAPE_YELLOW} scale={[0.04, 0.25, 0.02]} />
              </group>
            ))
          )}
        </group>

        {/* ── 4. BRIGHT STUDIO WALLS & ACOUSTIC SLATS ── */}
        {/* Back Wall Behind Cyclorama */}
        <mesh
          geometry={geoBox}
          material={MAT_WALL_STUDIO}
          scale={[48, 14, 1]}
          position={[0, 6.8, -12]}
        />
        {/* Left Studio Wall */}
        <mesh
          geometry={geoBox}
          material={MAT_WALL_STUDIO}
          scale={[1, 14, 36]}
          position={[-23.5, 6.8, 0]}
        />
        {/* Right Studio Wall */}
        <mesh
          geometry={geoBox}
          material={MAT_WALL_STUDIO}
          scale={[1, 14, 36]}
          position={[23.5, 6.8, 0]}
        />

        {/* Wood Acoustic Slat Panels (Left & Right Wings) */}
        {[-18, -14, 14, 18].map((wx, idx) => (
          <group key={`wood-slats-${idx}`} position={[wx, 5.2, -11.4]}>
            <mesh geometry={geoBox} material={MAT_WALL_ACOUSTIC} scale={[3.2, 7, 0.15]} />
            {[-1.2, -0.6, 0, 0.6, 1.2].map((sx, sIdx) => (
              <mesh
                key={`slat-${sIdx}`}
                geometry={geoBox}
                material={MAT_WALL_ACOUSTIC_ACCENT}
                scale={[0.15, 6.8, 0.08]}
                position={[sx, 0, 0.1]}
              />
            ))}
          </group>
        ))}

        {/* ── 5. CEILING ACOUSTIC CLOUDS & STEEL PIPE GRID (Photo 1) ── */}
        <group position={[0, 8.8, 0]}>
          {/* Overhead Steel Lighting Grid Pipes */}
          {[-8, -4, 0, 4, 8].map((px, idx) => (
            <mesh
              key={`pipe-long-${idx}`}
              geometry={geoCylinder8}
              material={MAT_CEILING_TRUSS}
              scale={[0.05, 30, 0.05]}
              position={[px, 0, -1]}
              rotation={[Math.PI / 2, 0, 0]}
            />
          ))}
          {[-8, -4, 0, 4, 8].map((pz, idx) => (
            <mesh
              key={`pipe-cross-${idx}`}
              geometry={geoCylinder8}
              material={MAT_CEILING_TRUSS}
              scale={[0.05, 42, 0.05]}
              position={[0, 0.1, pz]}
              rotation={[0, 0, Math.PI / 2]}
            />
          ))}

          {/* Hanging White Acoustic Ceiling Clouds (Photo 1) */}
          {[-9, -4.5, 0, 4.5, 9].map((cx, idx) =>
            [-6, 0, 6].map((cz, czIdx) => (
              <mesh
                key={`cloud-${idx}-${czIdx}`}
                geometry={geoBox}
                material={MAT_WALL_ACOUSTIC}
                scale={[3.2, 0.15, 1.8]}
                position={[cx, 0.5, cz]}
              />
            ))
          )}
        </group>

        {/* ── 6. LEFT WING: PROP STORAGE & WARDROBE DEPARTMENT ── */}
        <group position={[-17, 0, -2]}>
          {/* Industrial Shelving with Props */}
          <group position={[0, 0, -2]}>
            {[-1.2, 1.2].map((sx) =>
              [-0.6, 0.6].map((sz) => (
                <mesh
                  key={`shelf-post-${sx}-${sz}`}
                  geometry={geoCylinder8}
                  material={MAT_STEEL_DARK}
                  scale={[0.06, 4.0, 0.06]}
                  position={[sx, 2.0, sz]}
                />
              ))
            )}
            {[0.4, 1.5, 2.6, 3.7].map((sy, sIdx) => (
              <mesh
                key={`shelf-tier-${sIdx}`}
                geometry={geoBox}
                material={MAT_DIRECTOR_WOOD}
                scale={[2.6, 0.08, 1.4]}
                position={[0, sy, 0]}
              />
            ))}
            {/* Clapperboard & Prop Models */}
            <mesh
              geometry={geoBox}
              material={MAT_ROAD_CASE_BLACK}
              scale={[0.5, 0.4, 0.06]}
              position={[-0.4, 1.75, 0]}
              rotation={[0, 0.2, 0.1]}
            />
            <mesh
              geometry={geoBox}
              material={MAT_STAGE_TAPE_YELLOW}
              scale={[0.5, 0.1, 0.08]}
              position={[-0.4, 1.9, 0]}
              rotation={[0, 0.2, 0.1]}
            />
          </group>

          {/* Rolling Clothes Rack with Costumes */}
          <group position={[0, 0, 3]}>
            <mesh
              geometry={geoCylinder8}
              material={MAT_STEEL_BRIGHT}
              scale={[0.04, 2.0, 0.04]}
              position={[-1.2, 1.0, 0]}
            />
            <mesh
              geometry={geoCylinder8}
              material={MAT_STEEL_BRIGHT}
              scale={[0.04, 2.0, 0.04]}
              position={[1.2, 1.0, 0]}
            />
            <mesh
              geometry={geoBox}
              material={MAT_STEEL_BRIGHT}
              scale={[2.5, 0.05, 0.05]}
              position={[0, 1.95, 0]}
            />
            {[-0.8, -0.4, 0, 0.4, 0.8].map((cx, idx) => (
              <mesh
                key={`costume-rack-${idx}`}
                geometry={geoBox}
                material={outfitColors[idx % outfitColors.length]}
                scale={[0.22, 1.15, 0.35]}
                position={[cx, 1.3, 0]}
              />
            ))}
          </group>
        </group>

        {/* ── 7. RIGHT WING: CINEMA PREMIERE AUDITORIUM ── */}
        <group position={[17, 0, -1]}>
          {/* Red Carpet */}
          <mesh
            geometry={geoBox}
            material={MAT_RED_CARPET}
            scale={[3.2, 0.04, 16]}
            position={[0, 0.03, 0]}
          />
          {/* Brass Stanchion Posts */}
          {[-6, -2, 2, 6].map((pz, idx) => (
            <React.Fragment key={`stanchion-light-${idx}`}>
              <mesh
                geometry={geoCylinder8}
                material={MAT_GOLD_BRASS}
                scale={[0.04, 0.9, 0.04]}
                position={[-1.8, 0.45, pz]}
              />
              <mesh
                geometry={geoCylinder8}
                material={MAT_GOLD_BRASS}
                scale={[0.04, 0.9, 0.04]}
                position={[1.8, 0.45, pz]}
              />
            </React.Fragment>
          ))}
          {/* Giant Premiere Projection Screen */}
          <group position={[0, 3.8, -7]}>
            <mesh geometry={geoBox} material={MAT_ROAD_CASE_BLACK} scale={[6.8, 4.4, 0.2]} />
            <mesh
              geometry={geoBox}
              material={isPremiere ? MAT_SCREEN_RECORDING : MAT_SCREEN_GLOW}
              scale={[6.4, 4.0, 0.08]}
              position={[0, 0, 0.1]}
            />
          </group>
        </group>
      </group>
    );
  }
);

StudioSoundstage3D.displayName = 'StudioSoundstage3D';
