// ============================================================
// RATIO RUSH — STUDIO EQUIPMENT 3D (LIGHT THEME & LIVE MONITORS)
// Authentic professional studio setup based on real film soundstages:
// - Overhead Ceiling Pantograph & Drop Lighting Array (12+ Hanging Lights)
// - Foreground Cinema Camera on Tripod with Back LCD Screen (Showing live shoot!)
// - Video Village Rolling Floor TV Monitor Cart (Showing live shoot & telemetry!)
// - Talk-show Director Table & Studio Armchair
// - Large Floor C-Stand Softboxes with Sandbags
// - Camera Dolly on Steel Rails
// - Grounded BNC & XLR Cables with Yellow Protective Ramps
// ============================================================

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  geoBox,
  geoCylinder8,
  geoCylinder12,
  geoCylinder16,
  geoSphere12,
  MAT_STEEL_DARK,
  MAT_STEEL_BRIGHT,
  MAT_ROAD_CASE_BLACK,
  MAT_CABLE_BLACK,
  MAT_CABLE_YELLOW,
  MAT_CABLE_RAMP,
  MAT_WARM_BULB,
  MAT_STUDIO_LIGHT_WHITE,
  MAT_DIRECTOR_WOOD,
  MAT_STAGE_TAPE_YELLOW,
  MAT_STAGE_TAPE_RED,
  getStudioMaterial,
} from './StudioMaterials';

// Helper to generate dynamic live studio monitor canvas texture
function createLiveStudioScreenTexture(isFilming: boolean, title = 'RATIO RUSH'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 320;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // 1. Dark Studio Monitor Glass Background
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, 512, 320);

    // 2. Green Screen Cyclorama Stage Rendering
    ctx.fillStyle = '#15803d';
    ctx.fillRect(20, 20, 472, 220);

    // Light Concrete Stage Floor
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(20, 170, 472, 70);

    // Stage Yellow Hazard Tape
    ctx.fillStyle = '#eab308';
    ctx.fillRect(20, 168, 472, 4);

    // 3. Actors and Actresses on Live Feed!
    // Hero (Lead Actor in Blue Jacket)
    ctx.fillStyle = '#1d4ed8';
    ctx.fillRect(160, 105, 26, 65);
    ctx.fillStyle = '#ffedd5';
    ctx.beginPath();
    ctx.arc(173, 94, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(165, 84, 16, 8); // hair

    // Lead Actress (In Elegant Emerald Gown & Flowing Hair)
    ctx.fillStyle = '#059669';
    ctx.beginPath();
    ctx.moveTo(225, 102);
    ctx.lineTo(248, 170);
    ctx.lineTo(202, 170);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#facc15';
    ctx.fillRect(212, 120, 26, 4); // gold belt
    ctx.fillStyle = '#ffedd5';
    ctx.beginPath();
    ctx.arc(225, 92, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#451a03'; // flowing brunette hair
    ctx.beginPath();
    ctx.arc(225, 92, 14, Math.PI * 0.8, Math.PI * 2.2);
    ctx.fill();
    ctx.fillRect(214, 95, 22, 30);

    // Villain (In Violet Trenchcoat)
    ctx.fillStyle = '#7e22ce';
    ctx.fillRect(285, 102, 26, 68);
    ctx.fillStyle = '#dc2626'; // cape
    ctx.fillRect(305, 108, 8, 62);
    ctx.fillStyle = '#fed7aa';
    ctx.beginPath();
    ctx.arc(298, 92, 11, 0, Math.PI * 2);
    ctx.fill();

    // Glowing Ratio Core Prop
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(240, 135, 24, 35);
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(252, 145, 6, 0, Math.PI * 2);
    ctx.fill();

    // 4. 16:9 Viewfinder Framing Grid
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 36, 432, 243);

    // Center Crosshair
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.beginPath();
    ctx.moveTo(246, 157); ctx.lineTo(266, 157);
    ctx.moveTo(256, 147); ctx.lineTo(256, 167);
    ctx.stroke();

    // Safe Area Action Box
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 1;
    ctx.strokeRect(60, 50, 392, 215);

    // 5. Telemetry & Live Shoot Overlays
    // Header Bar
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.fillRect(40, 36, 432, 28);

    if (isFilming) {
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(55, 50, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px monospace';
      ctx.fillText('REC  00:05:42 • 4K RAW 60P', 68, 54);
    } else {
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.arc(55, 50, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px monospace';
      ctx.fillText('LIVE VIEW • 16:9 CINEMA', 68, 54);
    }

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 11px monospace';
    ctx.fillText('CAM 1 [A]', 410, 54);

    // Audio VU Meters
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(460, 80, 5, 80);
    ctx.fillRect(467, 80, 5, 75);
    ctx.fillStyle = '#eab308';
    ctx.fillRect(460, 68, 5, 12);
    ctx.fillRect(467, 68, 5, 12);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(460, 60, 5, 8);
    ctx.fillRect(467, 60, 5, 8);

    // Bottom Telemetry Bar
    ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
    ctx.fillRect(40, 240, 432, 39);

    ctx.fillStyle = '#fde047';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(`SCENE 1 TAKE 1 • ${title}`, 50, 257);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '10.5px monospace';
    ctx.fillText('ISO 800 | 1/50 | f/2.8 | 5600K | 16:9 | 🔋 94%', 50, 271);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// ============================================================
// ── PRO STUDIO CINEMA CAMERA TRIPOD WITH SYMMETRICAL LEGS ──
// Symmetrical 120° dual-tube carbon fiber legs that meet at the top bowl
// and stand securely with rubber floor pads, not poking or splaying outward.
// ============================================================
export const StudioCameraTripod3D: React.FC<{
  position: [number, number, number];
  rotationY?: number;
  monitorMaterial: THREE.Material;
  camId?: string;
}> = React.memo(({ position, rotationY = 0, monitorMaterial }) => {
  const legAngles = [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3];

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Top Spider Bowl Casting & Leveling Ball */}
      <mesh
        geometry={geoCylinder16}
        material={MAT_STEEL_DARK}
        scale={[0.22, 0.08, 0.22]}
        position={[0, 1.32, 0]}
      />
      <mesh
        geometry={geoSphere12}
        material={MAT_STEEL_BRIGHT}
        scale={[0.12, 0.08, 0.12]}
        position={[0, 1.30, 0]}
      />

      {/* Three Symmetrical Twin-Tube Legs meeting at top bowl */}
      {legAngles.map((angle, idx) => {
        const tiltAngle = Math.atan2(0.36 - 0.08, 1.30); // ~12°
        const length = Math.sqrt(Math.pow(0.36 - 0.08, 2) + Math.pow(1.30, 2));

        return (
          <group key={`leg-${idx}`} rotation={[0, angle, 0]}>
            <group position={[0.22, 0.67, 0]} rotation={[0, 0, -tiltAngle]}>
              {/* Twin Leg Tubes */}
              <mesh
                geometry={geoCylinder8}
                material={MAT_STEEL_DARK}
                scale={[0.024, length, 0.024]}
                position={[0, 0, -0.035]}
              />
              <mesh
                geometry={geoCylinder8}
                material={MAT_STEEL_DARK}
                scale={[0.024, length, 0.024]}
                position={[0, 0, 0.035]}
              />
              {/* Mid-Leg Stage Aluminum Locking Clamps */}
              <mesh
                geometry={geoBox}
                material={MAT_ROAD_CASE_BLACK}
                scale={[0.05, 0.08, 0.12]}
                position={[0, 0.15, 0]}
              />
              <mesh
                geometry={geoBox}
                material={MAT_ROAD_CASE_BLACK}
                scale={[0.05, 0.08, 0.12]}
                position={[0, -0.22, 0]}
              />
              {/* Red Leg Lock Levers */}
              <mesh
                geometry={geoBox}
                material={MAT_STAGE_TAPE_RED}
                scale={[0.06, 0.02, 0.03]}
                position={[0.025, 0.15, 0]}
              />
            </group>

            {/* Rubber Swivel Foot on Floor */}
            <mesh
              geometry={geoCylinder12}
              material={MAT_ROAD_CASE_BLACK}
              scale={[0.08, 0.03, 0.08]}
              position={[0.36, 0.015, 0]}
            />
          </group>
        );
      })}

      {/* Mid-Level Spreader locking legs together */}
      <group position={[0, 0.42, 0]}>
        <mesh
          geometry={geoCylinder12}
          material={MAT_STEEL_BRIGHT}
          scale={[0.08, 0.03, 0.08]}
        />
        {legAngles.map((angle, idx) => (
          <group key={`spreader-arm-${idx}`} rotation={[0, angle, 0]}>
            <mesh
              geometry={geoBox}
              material={MAT_STEEL_DARK}
              scale={[0.26, 0.02, 0.035]}
              position={[0.13, 0, 0]}
            />
          </group>
        ))}
      </group>

      {/* Fluid Pan/Tilt Head & Cinema Camera */}
      <group position={[0, 1.40, 0]}>
        {/* Head Base Plate & Tilt Lock Knob */}
        <mesh geometry={geoBox} material={MAT_STEEL_DARK} scale={[0.26, 0.14, 0.26]} />
        <mesh
          geometry={geoCylinder8}
          material={MAT_STAGE_TAPE_RED}
          scale={[0.03, 0.06, 0.03]}
          position={[-0.14, 0, 0]}
          rotation={[0, 0, Math.PI / 2]}
        />

        {/* Camera Body (Facing -Z toward the green stage) */}
        <mesh
          geometry={geoBox}
          material={MAT_ROAD_CASE_BLACK}
          scale={[0.36, 0.32, 0.58]}
          position={[0, 0.24, 0]}
        />

        {/* Cinema Cine Lens (Pointing forward to -Z) */}
        <mesh
          geometry={geoCylinder16}
          material={MAT_STEEL_DARK}
          scale={[0.12, 0.32, 0.12]}
          position={[0, 0.24, -0.42]}
          rotation={[Math.PI / 2, 0, 0]}
        />

        {/* Pro Carbon Matte Box & French Flag (Pointing forward to -Z) */}
        <mesh
          geometry={geoBox}
          material={MAT_ROAD_CASE_BLACK}
          scale={[0.42, 0.34, 0.12]}
          position={[0, 0.24, -0.58]}
        />
        <mesh
          geometry={geoBox}
          material={MAT_STEEL_DARK}
          scale={[0.44, 0.02, 0.18]}
          position={[0, 0.42, -0.62]}
          rotation={[0.3, 0, 0]}
        />

        {/* Back LCD Monitor (Facing +Z toward Operator/Director with live video!) */}
        <mesh
          geometry={geoBox}
          material={monitorMaterial}
          scale={[0.34, 0.24, 0.02]}
          position={[0, 0.26, 0.30]}
        />

        {/* Top EVF Viewfinder */}
        <group position={[-0.14, 0.46, 0.05]} rotation={[0, 0.25, 0]}>
          <mesh geometry={geoBox} material={MAT_ROAD_CASE_BLACK} scale={[0.16, 0.12, 0.28]} />
          <mesh
            geometry={geoBox}
            material={monitorMaterial}
            scale={[0.14, 0.10, 0.02]}
            position={[0, 0, 0.15]}
          />
        </group>

        {/* Dual Ergonomic Pan Bar Handles (Facing +Z toward Operator) */}
        <mesh
          geometry={geoCylinder8}
          material={MAT_STEEL_BRIGHT}
          scale={[0.018, 0.48, 0.018]}
          position={[0.22, 0.08, 0.26]}
          rotation={[-0.38, 0, 0.1]}
        />
        <mesh
          geometry={geoCylinder8}
          material={MAT_STEEL_BRIGHT}
          scale={[0.018, 0.48, 0.018]}
          position={[-0.22, 0.08, 0.26]}
          rotation={[-0.38, 0, -0.1]}
        />
      </group>
    </group>
  );
});

StudioCameraTripod3D.displayName = 'StudioCameraTripod3D';

// ============================================================
// MASTER STUDIO EQUIPMENT COMPONENT
// ============================================================
export const StudioEquipment3D: React.FC<{
  isFilming: boolean;
  dollyProgress?: number;
}> = React.memo(({ isFilming }) => {
  // Array of 10 hanging ceiling pantograph lights
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

  // Dynamic Live Monitor Textures
  const liveTvMaterial = useMemo(() => {
    if (typeof document === 'undefined') return MAT_ROAD_CASE_BLACK;
    const tex = createLiveStudioScreenTexture(isFilming, 'RATIO RUSH: STAGE 1');
    return new THREE.MeshStandardMaterial({
      map: tex,
      emissiveMap: tex,
      emissive: new THREE.Color('#ffffff'),
      emissiveIntensity: 0.9,
      roughness: 0.2,
    });
  }, [isFilming]);

  const liveCamMaterial = useMemo(() => {
    if (typeof document === 'undefined') return MAT_ROAD_CASE_BLACK;
    const tex = createLiveStudioScreenTexture(isFilming, 'CAM 1 VIEWFINDER');
    return new THREE.MeshStandardMaterial({
      map: tex,
      emissiveMap: tex,
      emissive: new THREE.Color('#ffffff'),
      emissiveIntensity: 0.9,
      roughness: 0.2,
    });
  }, [isFilming]);

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

      {/* ── 2. FOREGROUND CINEMA CAMERA 1 (A-CAM) ON SYMMETRICAL PRO TRIPOD ── */}
      <StudioCameraTripod3D
        position={[1.4, 0, 3.6]}
        rotationY={0.08}
        monitorMaterial={liveCamMaterial}
        camId="CAM 1"
      />

      {/* ── 3. SECOND CINEMA CAMERA (B-CAM) ON SYMMETRICAL PRO TRIPOD ── */}
      <StudioCameraTripod3D
        position={[-3.8, 0, 3.6]}
        rotationY={-0.12}
        monitorMaterial={liveCamMaterial}
        camId="CAM 2"
      />

      {/* ── 4. PRODUCTION MONITOR ON ROLLING RACK CART (Video Village) ── */}
      {/* 40" Client / Director Live Monitor displaying what is being shot! */}
      <group position={[-2.6, 0, 2.6]} rotation={[0, 0.35, 0]}>
        {/* Metal Cart Frame */}
        <mesh
          geometry={geoBox}
          material={MAT_STEEL_DARK}
          scale={[0.9, 0.85, 0.6]}
          position={[0, 0.42, 0]}
        />
        {/* Monitor Bezel */}
        <mesh
          geometry={geoBox}
          material={MAT_ROAD_CASE_BLACK}
          scale={[1.2, 0.75, 0.08]}
          position={[0, 1.25, 0]}
        />
        {/* Live TV Screen displaying live shot & telemetry */}
        <mesh
          geometry={geoBox}
          material={liveTvMaterial}
          scale={[1.15, 0.7, 0.02]}
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

      {/* ── 5. AUTHENTIC FOLDING DIRECTOR CHAIR (Video Village) ── */}
      <group position={[-1.9, 0, 3.2]} rotation={[0, 0.35, 0]}>
        {/* Crossed Wooden Legs */}
        <mesh
          geometry={geoCylinder8}
          material={MAT_DIRECTOR_WOOD}
          scale={[0.03, 1.1, 0.03]}
          position={[-0.22, 0.45, 0]}
          rotation={[0, 0, 0.22]}
        />
        <mesh
          geometry={geoCylinder8}
          material={MAT_DIRECTOR_WOOD}
          scale={[0.03, 1.1, 0.03]}
          position={[0.22, 0.45, 0]}
          rotation={[0, 0, -0.22]}
        />
        <mesh
          geometry={geoCylinder8}
          material={MAT_DIRECTOR_WOOD}
          scale={[0.03, 1.1, 0.03]}
          position={[-0.22, 0.45, -0.38]}
          rotation={[0, 0, 0.22]}
        />
        <mesh
          geometry={geoCylinder8}
          material={MAT_DIRECTOR_WOOD}
          scale={[0.03, 1.1, 0.03]}
          position={[0.22, 0.45, -0.38]}
          rotation={[0, 0, -0.22]}
        />
        {/* Footrest Bar */}
        <mesh
          geometry={geoCylinder8}
          material={MAT_DIRECTOR_WOOD}
          scale={[0.025, 0.48, 0.025]}
          position={[0, 0.22, 0.02]}
          rotation={[0, 0, Math.PI / 2]}
        />
        {/* Black Canvas Seat */}
        <mesh
          geometry={geoBox}
          material={MAT_ROAD_CASE_BLACK}
          scale={[0.52, 0.04, 0.46]}
          position={[0, 0.78, -0.19]}
        />
        {/* Backrest Upright Posts */}
        <mesh
          geometry={geoCylinder8}
          material={MAT_DIRECTOR_WOOD}
          scale={[0.028, 0.65, 0.028]}
          position={[-0.24, 1.05, -0.38]}
        />
        <mesh
          geometry={geoCylinder8}
          material={MAT_DIRECTOR_WOOD}
          scale={[0.028, 0.65, 0.028]}
          position={[0.24, 1.05, -0.38]}
        />
        {/* Black Canvas Backrest Banner */}
        <mesh
          geometry={geoBox}
          material={MAT_ROAD_CASE_BLACK}
          scale={[0.54, 0.22, 0.04]}
          position={[0, 1.22, -0.38]}
        />
        {/* Gold "DIRECTOR" Text Strip on Backrest */}
        <mesh
          geometry={geoBox}
          material={MAT_STAGE_TAPE_YELLOW}
          scale={[0.42, 0.06, 0.05]}
          position={[0, 1.22, -0.38]}
        />
      </group>

      {/* ── 6. FLOOR C-STAND SOFTBOXES WITH 3-LEG TURTLE BASES & SANDBAGS ── */}
      {/* Left Stage Front Softbox */}
      <group position={[-6.2, 0, 1.5]}>
        {/* 3-Leg Staggered Turtle Base flat on the floor */}
        <mesh geometry={geoCylinder8} material={MAT_STEEL_BRIGHT} scale={[0.025, 0.7, 0.025]} position={[0, 0.02, 0.3]} rotation={[Math.PI / 2, 0, 0]} />
        <mesh geometry={geoCylinder8} material={MAT_STEEL_BRIGHT} scale={[0.025, 0.7, 0.025]} position={[-0.26, 0.03, -0.15]} rotation={[Math.PI / 2, 0, (2 * Math.PI) / 3]} />
        <mesh geometry={geoCylinder8} material={MAT_STEEL_BRIGHT} scale={[0.025, 0.7, 0.025]} position={[0.26, 0.04, -0.15]} rotation={[Math.PI / 2, 0, (4 * Math.PI) / 3]} />
        {/* Studio Sandbag on Base */}
        <mesh
          geometry={geoBox}
          material={MAT_CABLE_YELLOW}
          scale={[0.34, 0.10, 0.24]}
          position={[0, 0.06, 0.12]}
        />
        {/* Center Chrome Riser Column */}
        <mesh
          geometry={geoCylinder8}
          material={MAT_STEEL_BRIGHT}
          scale={[0.038, 2.8, 0.038]}
          position={[0, 1.4, 0]}
        />
        {/* Gobo Grip Head & Softbox Fixture */}
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
      <group position={[6.8, 0, 1.5]}>
        {/* 3-Leg Staggered Turtle Base flat on the floor */}
        <mesh geometry={geoCylinder8} material={MAT_STEEL_BRIGHT} scale={[0.025, 0.7, 0.025]} position={[0, 0.02, 0.3]} rotation={[Math.PI / 2, 0, 0]} />
        <mesh geometry={geoCylinder8} material={MAT_STEEL_BRIGHT} scale={[0.025, 0.7, 0.025]} position={[-0.26, 0.03, -0.15]} rotation={[Math.PI / 2, 0, (2 * Math.PI) / 3]} />
        <mesh geometry={geoCylinder8} material={MAT_STEEL_BRIGHT} scale={[0.025, 0.7, 0.025]} position={[0.26, 0.04, -0.15]} rotation={[Math.PI / 2, 0, (4 * Math.PI) / 3]} />
        {/* Studio Sandbag on Base */}
        <mesh
          geometry={geoBox}
          material={MAT_CABLE_YELLOW}
          scale={[0.34, 0.10, 0.24]}
          position={[0, 0.06, 0.12]}
        />
        {/* Center Chrome Riser Column */}
        <mesh
          geometry={geoCylinder8}
          material={MAT_STEEL_BRIGHT}
          scale={[0.038, 2.8, 0.038]}
          position={[0, 1.4, 0]}
        />
        {/* Gobo Grip Head & Softbox Fixture */}
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
      <mesh
        geometry={geoBox}
        material={MAT_CABLE_BLACK}
        scale={[0.04, 0.02, 2.2]}
        position={[0.2, 0.015, 3.8]}
      />
      <mesh
        geometry={geoBox}
        material={MAT_CABLE_YELLOW}
        scale={[0.04, 0.02, 5.0]}
        position={[-5.2, 0.015, 4.5]}
      />
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
