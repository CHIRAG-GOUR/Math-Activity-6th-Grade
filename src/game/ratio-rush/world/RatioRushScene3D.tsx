import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { StudioSoundstage3D } from './StudioSoundstage3D';
import { StudioEquipment3D } from './StudioEquipment3D';
import { StudioMovieSet3D } from './StudioMovieSet3D';
import { StudioCharacters3D } from './StudioCharacters3D';
import { StudioPropsTable3D } from './StudioPropsTable3D';
import { StudioLiveFeedProvider } from './StudioLiveFeed';
import { StudioTheatre3D } from './StudioTheatre3D';
import { sceneClock, SCENE_LENGTH, ACTOR_STAGE_POS, beatAt } from './StudioPerformance';
import { useRatioStore } from '../store/ratioStore';
import { StudioCameraView } from '../types';

// ============================================================
// SHOT LIST — how the scene is covered while the camera is rolling.
// Each entry holds until the next one starts, so the take is cut like a
// real scene (wide, singles on whoever has the line, reverse, final wide)
// instead of sitting on one locked-off angle for half a minute.
// ============================================================
const COVERAGE: { at: number; pos: [number, number, number]; look: [number, number, number] }[] = [
  // Every setup stays downstage looking back at the cyclorama, favouring
  // whoever has the line — so the camera is never behind an actor's head.
  // Heights sit just under eye line so the cast fill the frame rather than
  // leaving half of it on empty green.
  { at: 0.0, pos: [0.15, 1.95, 0.75], look: [0.15, 1.6, -2.15] },  // establishing wide
  { at: 3.4, pos: [-0.75, 1.75, -0.35], look: [-1.5, 1.6, -2.1] }, // favouring the hero
  { at: 8.2, pos: [0.1, 1.75, -0.55], look: [-0.55, 1.58, -2.35] },// reverse onto the actress
  { at: 12.4, pos: [1.95, 1.7, -0.4], look: [1.45, 1.6, -2.0] },   // the villain cuts in
  { at: 16.6, pos: [0.5, 1.78, 0.35], look: [0.05, 1.6, -1.6] },   // hero stands his ground
  { at: 20.6, pos: [-0.5, 1.78, 0.1], look: [-0.85, 1.58, -1.95] },// two-shot on the turn
  { at: 23.6, pos: [0.15, 2.15, 1.35], look: [0.15, 1.55, -2.15] },// crane out to the final wide
];

function shotAt(t: number) {
  let shot = COVERAGE[0];
  for (const c of COVERAGE) {
    if (c.at > t) break;
    shot = c;
  }
  return shot;
}

// ============================================================
// CAMERA RIG: Panoramic Soundstage View & Director Presets
// ============================================================
const StudioCameraRig: React.FC<{
  cameraView: StudioCameraView;
  isFilming: boolean;
  /** The stage deck rises once the build starts; the coverage must rise with it. */
  stageLift: number;
}> = ({ cameraView, isFilming, stageLift }) => {
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
        // In the back row of the auditorium, watching the film over the audience
        pos: new THREE.Vector3(17.6, 4.2, 7.2),
        look: new THREE.Vector3(17.6, 3.2, -8),
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
      targetCamPos.current.set(shot.pos[0], shot.pos[1] + stageLift, shot.pos[2]);
      targetLookAt.current.set(shot.look[0], shot.look[1] + stageLift, shot.look[2]);

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
// DYNAMIC TRACKING FOLLOW-SPOTLIGHT
// Overhead studio spotlight physically tracks whoever currently has the line
// ============================================================
const StudioFollowSpotlight: React.FC<{
  isFilming: boolean;
  stageLift: number;
}> = ({ isFilming, stageLift }) => {
  const spotRef = useRef<THREE.SpotLight>(null);
  const targetObj = useMemo(() => new THREE.Object3D(), []);
  const { scene } = useThree();

  useEffect(() => {
    scene.add(targetObj);
    return () => {
      scene.remove(targetObj);
    };
  }, [scene, targetObj]);

  useFrame((state, delta) => {
    if (!spotRef.current) return;
    const t = state.clock.getElapsedTime();
    const sceneTime = sceneClock.time !== null ? sceneClock.time : t;
    const beat = beatAt(sceneTime, isFilming);
    const speaker = beat.speaker;

    let targetX = 0;
    let targetZ = -2.0;

    if (speaker && ACTOR_STAGE_POS[speaker]) {
      const pos = ACTOR_STAGE_POS[speaker];
      targetX = pos.x;
      targetZ = pos.y;
    }

    const k = Math.min(delta * 4.5, 0.25);
    targetObj.position.x += (targetX - targetObj.position.x) * k;
    targetObj.position.y = 1.35 + stageLift;
    targetObj.position.z += (targetZ - targetObj.position.z) * k;

    spotRef.current.target = targetObj;
  });

  return (
    <spotLight
      ref={spotRef}
      position={[0, 9.2, 1.8]}
      angle={0.42}
      penumbra={0.65}
      intensity={5.2}
      color="#ffffff"
      castShadow
      shadow-mapSize-width={1024}
      shadow-mapSize-height={1024}
      shadow-bias={-0.0001}
    />
  );
};

// ============================================================
// DYNAMIC SCENE MOOD LIGHTING
// Lighting warms to golden amber during celebration beats and shifts to cool cyan/blue
// during challenging multi-step proportion questions
// ============================================================
const StudioMoodLighting: React.FC<{
  feedbackStatus: 'idle' | 'correct' | 'incorrect';
}> = ({ feedbackStatus }) => {
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const keyLightRef = useRef<THREE.DirectionalLight>(null);
  const fillLightRef = useRef<THREE.DirectionalLight>(null);

  useFrame((_, delta) => {
    const k = Math.min(delta * 3.5, 0.2);

    let ambColor = new THREE.Color('#ffffff');
    let keyColor = new THREE.Color('#ffffff');
    let fillColor = new THREE.Color('#fef08a');
    let ambIntensity = 1.15;
    let keyIntensity = 2.6;

    if (feedbackStatus === 'correct') {
      // Golden Amber Celebration
      ambColor = new THREE.Color('#fef08a');
      keyColor = new THREE.Color('#fde047');
      fillColor = new THREE.Color('#f59e0b');
      ambIntensity = 1.45;
      keyIntensity = 3.2;
    } else if (feedbackStatus === 'incorrect') {
      // Cool Cyan Recalculating
      ambColor = new THREE.Color('#bae6fd');
      keyColor = new THREE.Color('#38bdf8');
      fillColor = new THREE.Color('#0284c7');
      ambIntensity = 0.95;
      keyIntensity = 2.2;
    }

    if (ambientRef.current) {
      ambientRef.current.color.lerp(ambColor, k);
      ambientRef.current.intensity = THREE.MathUtils.lerp(ambientRef.current.intensity, ambIntensity, k);
    }
    if (keyLightRef.current) {
      keyLightRef.current.color.lerp(keyColor, k);
      keyLightRef.current.intensity = THREE.MathUtils.lerp(keyLightRef.current.intensity, keyIntensity, k);
    }
    if (fillLightRef.current) {
      fillLightRef.current.color.lerp(fillColor, k);
    }
  });

  return (
    <>
      <ambientLight ref={ambientRef} intensity={1.15} />
      <hemisphereLight color="#ffffff" groundColor="#e2e8f0" intensity={1.4} />
      <directionalLight
        ref={keyLightRef}
        position={[4, 12, 8]}
        color="#ffffff"
        intensity={2.6}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight
        ref={fillLightRef}
        position={[-6, 10, 4]}
        color="#fef08a"
        intensity={1.4}
      />
      <directionalLight
        position={[0, 8, -6]}
        color="#22c55e"
        intensity={1.2}
      />
    </>
  );
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
  const questions = useRatioStore((s) => s.questions);
  const blueTeam = useRatioStore((s) => s.blueTeam);
  const activeQuestion = questions[blueTeam.currentQuestionIndex] || questions[0];
  const feedbackStatus = blueTeam.feedbackStatus;
  const feedbackMessage = blueTeam.feedbackMessage;

  const stageLift = globalLevel >= 1 ? 0.3 : 0;

  return (
    <div className="relative w-full h-full select-none bg-[#f8fafc]">
      <Canvas
        camera={{ position: [0, 4.4, 11.8], fov: 52, near: 0.1, far: 120 }}
        dpr={[1, 1.35]}
        gl={{
          powerPreference: 'high-performance',
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.18,
        }}
        shadows
      >
        <color attach="background" args={['#0c1222']} />

        {/* ── 1. DYNAMIC MOOD LIGHTING & PRODUCTION FLOODLIGHTS ── */}
        <StudioMoodLighting feedbackStatus={feedbackStatus} />

        {/* ── 2. DYNAMIC OVERHEAD TRACKING SPOTLIGHT ── */}
        <StudioFollowSpotlight isFilming={isFilmingActive} stageLift={stageLift} />

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

        {/* ── 3. CAMERA RIG CONTROLLER ── */}
        <StudioCameraRig
          cameraView={activeCameraView}
          isFilming={isFilmingActive}
          stageLift={stageLift}
        />

        {/* ── 4. WORLD COMPONENTS ── */}
        <StudioLiveFeedProvider isFilming={isFilmingActive}>
          <StudioSoundstage3D isFilming={isFilmingActive} isPremiere={isPremiereActive} />
          <StudioEquipment3D isFilming={isFilmingActive} dollyProgress={isFilmingActive ? 0.8 : 0.2} />
          <StudioMovieSet3D productionLevel={globalLevel} isFilming={isFilmingActive} />
          
          {/* Physical Math Props Table Demonstration */}
          <StudioPropsTable3D
            position={[0, stageLift, -1.8]}
            activeQuestion={activeQuestion}
            feedbackStatus={feedbackStatus}
          />

          <group position={[17.6, 0, -1]}>
            <StudioTheatre3D isPremiere={isPremiereActive} />
          </group>
          <StudioCharacters3D
            isFilming={isFilmingActive}
            productionLevel={globalLevel}
            dollyProgress={isFilmingActive ? 0.8 : 0.2}
            filmStartedAt={filmStartedAt}
            activeQuestion={activeQuestion}
            feedbackStatus={feedbackStatus}
            feedbackMessage={feedbackMessage}
          />
        </StudioLiveFeedProvider>
      </Canvas>
    </div>
  );
};
