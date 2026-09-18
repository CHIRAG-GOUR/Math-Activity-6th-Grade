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
import { StudioLiveFeedProvider } from './StudioLiveFeed';
import { sceneClock, SCENE_LENGTH } from './StudioPerformance';
import { useRatioStore } from '../store/ratioStore';

// ============================================================
// SHOT LIST — how the scene is covered while the camera is rolling.
// Each entry holds until the next one starts, so the take is cut like a
// real scene (wide, singles on whoever has the line, reverse, final wide)
// instead of sitting on one locked-off angle for half a minute.
// ============================================================
const COVERAGE: { at: number; pos: [number, number, number]; look: [number, number, number] }[] = [
  { at: 0.0, pos: [1.4, 2.1, 4.2], look: [-0.1, 1.45, -2.3] },   // establishing wide
  { at: 3.4, pos: [-0.2, 1.7, 0.4], look: [-1.6, 1.55, -2.0] },  // single: the hero
  { at: 8.2, pos: [-2.0, 1.7, 0.1], look: [-0.7, 1.52, -2.2] },  // reverse: the actress
  { at: 12.4, pos: [0.2, 1.55, 0.2], look: [1.6, 1.6, -1.9] },   // low single: the villain
  { at: 16.6, pos: [0.9, 1.65, -0.5], look: [-0.9, 1.55, -1.9] },// over the villain's shoulder
  { at: 20.6, pos: [-0.6, 1.75, 0.9], look: [-1.1, 1.5, -2.0] }, // two-shot on the turn
  { at: 23.6, pos: [0.5, 2.6, 3.4], look: [0.0, 1.4, -2.2] },    // crane out to the final wide
];

function shotAt(t: number) {
  let shot = COVERAGE[0];
  for (const c of COVERAGE) {
    if (c.at > t) break;
    shot = c;
  }
  return shot;
}
import { StudioCameraView } from '../types';

// ============================================================
// ============================================================
// CAMERA RIG: Panoramic Soundstage View & Director Presets
// ============================================================
const StudioCameraRig: React.FC<{
  cameraView: StudioCameraView;
  isFilming: boolean;
}> = ({ cameraView, isFilming }) => {
  const { camera, pointer } = useThree();
  const targetCamPos = useRef(new THREE.Vector3(0, 4.4, 11.8));
  const targetLookAt = useRef(new THREE.Vector3(0, 1.6, -1.0));

  // Cinematic camera presets showing the whole professional studio
  const presets = useMemo(() => {
    return {
      overview: {
        // Whole Studio Panoramic View: Trusses, Cyclorama, Director Village, Cast & Crew
        pos: new THREE.Vector3(0, 4.4, 11.8),
        look: new THREE.Vector3(0, 1.6, -1.0),
      },
      director: {
        // Director Chair & Video Village Over-The-Shoulder View
        pos: new THREE.Vector3(-1.3, 2.4, 6.2),
        look: new THREE.Vector3(0, 1.6, -2.4),
      },
      camera1: {
        // Live Cinema Camera 1 Viewfinder Perspective
        pos: new THREE.Vector3(1.4, 2.0, 5.0),
        look: new THREE.Vector3(0, 1.5, -2.4),
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

  const lastShotAt = useRef(-1);

  useFrame((_, delta) => {
    const sceneTime = sceneClock.time;
    const rolling = isFilming && sceneTime !== null && sceneTime < SCENE_LENGTH;

    if (rolling) {
      // Cut to whichever setup covers this beat, then hold it on the sticks.
      const shot = shotAt(sceneTime as number);
      targetCamPos.current.set(...shot.pos);
      targetLookAt.current.set(...shot.look);

      const t = Date.now() * 0.002;
      targetCamPos.current.x += Math.sin(t * 1.5) * 0.02;
      targetCamPos.current.y += Math.cos(t * 1.2) * 0.012;

      // A cut is instant; only movement within a shot is eased.
      if (shot.at !== lastShotAt.current) {
        lastShotAt.current = shot.at;
        camera.position.copy(targetCamPos.current);
      } else {
        camera.position.lerp(targetCamPos.current, THREE.MathUtils.clamp(delta * 3.0, 0.01, 0.12));
      }
      camera.lookAt(targetLookAt.current);
      return;
    }

    lastShotAt.current = -1;
    const activePreset = presets[cameraView] || presets.overview;

    targetCamPos.current.copy(activePreset.pos);
    targetLookAt.current.copy(activePreset.look);

    // Subtle natural parallax
    targetCamPos.current.x += pointer.x * 0.4;
    targetCamPos.current.y += pointer.y * 0.2;

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
  const filmStartedAt = useRatioStore((s) => s.filmStartedAt);
  const blueLevel = useRatioStore((s) => s.blueTeam.productionLevel);
  const redLevel = useRatioStore((s) => s.redTeam.productionLevel);
  const globalLevel = Math.max(blueLevel, redLevel);

  return (
    <div className="relative w-full h-full select-none bg-[#f8fafc]">
      <Canvas
        camera={{ position: [0, 4.4, 11.8], fov: 52, near: 0.1, far: 120 }}
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
        <StudioLiveFeedProvider isFilming={isFilmingActive}>
          <StudioSoundstage3D isFilming={isFilmingActive} isPremiere={isPremiereActive} />
          <StudioEquipment3D isFilming={isFilmingActive} dollyProgress={isFilmingActive ? 0.8 : 0.2} />
          <StudioMovieSet3D productionLevel={globalLevel} isFilming={isFilmingActive} />
          <StudioCharacters3D
            isFilming={isFilmingActive}
            productionLevel={globalLevel}
            dollyProgress={isFilmingActive ? 0.8 : 0.2}
            filmStartedAt={filmStartedAt}
          />
        </StudioLiveFeedProvider>
      </Canvas>
    </div>
  );
};
