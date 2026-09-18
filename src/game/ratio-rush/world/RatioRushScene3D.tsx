// ============================================================
// RATIO RUSH — MASTER 3D SCENE (FRONT DIRECTOR PERSPECTIVE & LIGHT THEME)
// High-FPS Three.js environment with eye-level cinematic camera presets:
// - Front Director's Eye-Level Default View (Looking at green screen & cast)
// - Bright Daylight Studio Lighting & Ceiling Light Arrays
// - Smooth Camera Rig & Parallax
// ============================================================

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { StudioSoundstage3D } from './StudioSoundstage3D';
import { StudioEquipment3D } from './StudioEquipment3D';
import { StudioMovieSet3D } from './StudioMovieSet3D';
import { StudioCharacters3D } from './StudioCharacters3D';
import { useRatioStore } from '../store/ratioStore';
import { StudioCameraView } from '../types';

// ============================================================
// CAMERA RIG: Eye-Level Front View & Director Presets
// ============================================================
const StudioCameraRig: React.FC<{
  cameraView: StudioCameraView;
  isFilming: boolean;
}> = ({ cameraView, isFilming }) => {
  const { camera, pointer } = useThree();
  const targetCamPos = useRef(new THREE.Vector3(0, 2.3, 7.8));
  const targetLookAt = useRef(new THREE.Vector3(0, 1.8, -2.8));

  // Front eye-level camera presets matching real film studio director monitors
  const presets = useMemo(() => {
    return {
      overview: {
        // Front Studio Eye-Level View (Photo 1)
        pos: new THREE.Vector3(0, 2.3, 7.8),
        look: new THREE.Vector3(0, 1.8, -2.8),
      },
      director: {
        // Director Chair & Video Village View
        pos: new THREE.Vector3(2.8, 1.9, 6.2),
        look: new THREE.Vector3(0, 1.6, -2.5),
      },
      camera1: {
        // Live Cinema Camera 1 Viewfinder Perspective (Photo 2)
        pos: new THREE.Vector3(1.1, 1.7, 4.4),
        look: new THREE.Vector3(0, 1.5, -2.5),
      },
      wardrobe: {
        // Props & Wardrobe Room View
        pos: new THREE.Vector3(-13.5, 2.6, 3.5),
        look: new THREE.Vector3(-17, 1.6, -1),
      },
      premiere: {
        // Red Carpet Cinema Premiere View
        pos: new THREE.Vector3(17, 2.8, 4.5),
        look: new THREE.Vector3(17, 2.2, -5),
      },
    };
  }, []);

  useFrame((_, delta) => {
    const activePreset = presets[cameraView] || presets.overview;

    // Subtle natural parallax
    const parallaxX = pointer.x * 0.35;
    const parallaxY = pointer.y * 0.15;

    targetCamPos.current.copy(activePreset.pos);
    targetLookAt.current.copy(activePreset.look);

    if (isFilming) {
      const time = Date.now() * 0.002;
      targetCamPos.current.x += Math.sin(time * 1.5) * 0.08;
      targetCamPos.current.y += Math.cos(time * 1.2) * 0.04;
    } else {
      targetCamPos.current.x += parallaxX;
      targetCamPos.current.y += parallaxY;
    }

    const lerpSpeed = THREE.MathUtils.clamp(delta * 5.0, 0.01, 0.18);
    camera.position.lerp(targetCamPos.current, lerpSpeed);
    camera.lookAt(targetLookAt.current);
  });

  return null;
};

// ============================================================
// MASTER 3D STUDIO SCENE CONTAINER (BRIGHT LIGHT THEME)
// ============================================================
export const RatioRushScene3D: React.FC = () => {
  const activeCameraView = useRatioStore((s) => s.activeCameraView);
  const isFilmingActive = useRatioStore((s) => s.isFilmingActive);
  const isPremiereActive = useRatioStore((s) => s.isPremiereActive);
  const flashActive = useRatioStore((s) => s.flashActive);
  const blueLevel = useRatioStore((s) => s.blueTeam.productionLevel);
  const redLevel = useRatioStore((s) => s.redTeam.productionLevel);
  const globalLevel = Math.max(blueLevel, redLevel);

  return (
    <div className="relative w-full h-full select-none bg-[#f8fafc]">
      <Canvas
        camera={{ position: [0, 2.3, 7.8], fov: 46, near: 0.1, far: 120 }}
        dpr={[1, 1.35]}
        gl={{
          powerPreference: 'high-performance',
          antialias: true,
          stencil: false,
          depth: true,
        }}
      >
        <color attach="background" args={['#f8fafc']} />

        {/* ── 1. BRIGHT STUDIO DAYLIGHT & PRODUCTION FLOODLIGHTS ── */}
        <ambientLight color="#ffffff" intensity={2.2} />
        <hemisphereLight color="#ffffff" groundColor="#e2e8f0" intensity={1.5} />
        <directionalLight
          position={[4, 12, 8]}
          color="#ffffff"
          intensity={2.6}
        />
        <directionalLight
          position={[-6, 10, 4]}
          color="#fef08a"
          intensity={1.4}
        />
        <directionalLight
          position={[0, 8, -6]}
          color="#22c55e"
          intensity={1.2}
        />

        {/* Dynamic Photographer Flash */}
        {flashActive && (
          <pointLight
            position={[4.5, 2.2, 1.2]}
            color="#ffffff"
            intensity={24}
            distance={25}
            decay={2}
          />
        )}

        {/* ── 2. CAMERA RIG CONTROLLER ── */}
        <StudioCameraRig cameraView={activeCameraView} isFilming={isFilmingActive} />

        {/* ── 3. WORLD COMPONENTS ── */}
        <StudioSoundstage3D isFilming={isFilmingActive} isPremiere={isPremiereActive} />
        <StudioEquipment3D isFilming={isFilmingActive} dollyProgress={isFilmingActive ? 0.8 : 0.2} />
        <StudioMovieSet3D productionLevel={globalLevel} isFilming={isFilmingActive} />
        <StudioCharacters3D
          isFilming={isFilmingActive}
          productionLevel={globalLevel}
          dollyProgress={isFilmingActive ? 0.8 : 0.2}
        />
      </Canvas>
    </div>
  );
};
