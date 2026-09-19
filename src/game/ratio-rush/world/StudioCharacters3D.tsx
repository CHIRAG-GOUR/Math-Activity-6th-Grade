// ============================================================
// RATIO RUSH — MASTER STUDIO CAST & CREW 3D
// Integrates High-Fidelity Anatomical Human Cast (RAVI, MAYA, DEV)
// with Two-Bone Grounded Leg IK, Facial Morphs, Syllable Speech Sync,
// Conversational Gaze Tracking, Purposeful Mark Walking, and Active Crew.
// ============================================================

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ActorCharacter3D } from './ActorCharacter3D';
import { createActor, stepFace } from '../engine/cast';
import { stepMotion, setDestination } from '../engine/actorLocomotion';
import { poseFor, speechEnergy } from '../engine/actorRig';
import {
  beatAt,
  markAt,
  OPENING_MARKS,
  lineAt,
  sceneClock,
} from './StudioPerformance';
import {
  geoBox,
  geoCylinder8,
  geoCylinder12,
  geoSphere12,
  geoSphere16,
  MAT_STEEL_DARK,
  MAT_STEEL_BRIGHT,
  MAT_ROAD_CASE_BLACK,
  MAT_STAGE_TAPE_YELLOW,
  MAT_SKIN_WARM,
  MAT_SKIN_PEACH,
  MAT_DIRECTOR_CAP,
  MAT_DIRECTOR_CAP_BRIM,
} from './StudioMaterials';

/**
 * Where each actor is standing right now on stage, published live so the
 * others can turn and look at whoever currently has the line.
 */
export const ACTOR_STAGE_POS: Record<string, THREE.Vector2> = {
  lead_actor: new THREE.Vector2(...OPENING_MARKS.lead_actor),
  lead_actress: new THREE.Vector2(...OPENING_MARKS.lead_actress),
  villain: new THREE.Vector2(...OPENING_MARKS.villain),
  co_star: new THREE.Vector2(...OPENING_MARKS.co_star),
};

/** Sharp Dynamic Canvas Texture for Director's Shirt Back */
export function createDirectorShirtBackTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 512, 256);

    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 14;
    ctx.strokeRect(16, 16, 480, 224);

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.strokeRect(26, 26, 460, 204);

    ctx.fillStyle = '#fde047';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('★  CINEMA PRODUCTION  ★', 256, 64);

    ctx.fillStyle = '#facc15';
    ctx.font = '900 84px "Arial Black", Impact, sans-serif';
    ctx.fillText('DIRECTOR', 256, 154);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(70, 172, 372, 10);
    ctx.fillStyle = '#eab308';
    ctx.fillRect(140, 188, 232, 6);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/** Active Film Crew Member (Director, Camera Op, Boom Op, Photographer, Dolly Grip) */
export const ActiveCrewMember: React.FC<{
  position: [number, number, number];
  rotationY: number;
  crewType: 'director' | 'camera_op' | 'boom_op' | 'photographer' | 'dolly_grip';
  skinMat?: THREE.MeshStandardMaterial;
  isFilming: boolean;
}> = React.memo(({ position, rotationY, crewType, skinMat = MAT_SKIN_WARM, isFilming }) => {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);

  const outfitMat = MAT_ROAD_CASE_BLACK;

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (crewType === 'director') {
      if (headRef.current) {
        headRef.current.rotation.y = Math.sin(t * 0.8) * 0.18;
        headRef.current.rotation.x = -0.05 + Math.sin(t * 1.4) * 0.05;
      }
      if (rightArmRef.current) {
        // Holding megaphone up while directing
        const lift = isFilming ? 0.45 + Math.sin(t * 1.8) * 0.1 : 0.2;
        rightArmRef.current.rotation.set(-1.1 - lift, -0.2, 0.4);
      }
      if (leftArmRef.current) {
        leftArmRef.current.rotation.set(-0.2 + Math.sin(t * 1.2) * 0.1, 0, -0.15);
      }
    } else if (crewType === 'camera_op') {
      // Hands on pan bars, head looking into monitor
      if (headRef.current) {
        headRef.current.rotation.set(0.12, Math.sin(t * 0.6) * 0.08, 0);
      }
      if (leftArmRef.current) leftArmRef.current.rotation.set(-1.0, 0.3, -0.4);
      if (rightArmRef.current) rightArmRef.current.rotation.set(-1.0, -0.3, 0.4);
    } else if (crewType === 'boom_op') {
      // Both hands holding boom pole up high
      if (leftArmRef.current) leftArmRef.current.rotation.set(-2.0, 0.2, -0.3);
      if (rightArmRef.current) rightArmRef.current.rotation.set(-2.1, -0.2, 0.3);
      if (headRef.current) headRef.current.rotation.set(-0.25, Math.sin(t * 0.9) * 0.15, 0);
    } else if (crewType === 'photographer') {
      // Raising camera to face and aiming
      if (headRef.current) headRef.current.rotation.set(0.05, Math.sin(t * 0.7) * 0.2, 0);
      if (leftArmRef.current) leftArmRef.current.rotation.set(-1.4, 0.4, -0.5);
      if (rightArmRef.current) rightArmRef.current.rotation.set(-1.4, -0.4, 0.5);
    } else if (crewType === 'dolly_grip') {
      // Pushing dolly track
      if (leftArmRef.current) leftArmRef.current.rotation.set(-0.9, 0.2, -0.2);
      if (rightArmRef.current) rightArmRef.current.rotation.set(-0.9, -0.2, 0.2);
      if (headRef.current) headRef.current.rotation.set(0.1, Math.sin(t * 0.5) * 0.1, 0);
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={[0, rotationY, 0]}>
      {/* Torso */}
      <mesh geometry={geoBox} material={outfitMat} scale={[0.34, 0.46, 0.2]} position={[0, 0.96, 0]} castShadow />
      {/* Trousers */}
      <mesh geometry={geoBox} material={outfitMat} scale={[0.3, 0.48, 0.18]} position={[0, 0.48, 0]} castShadow />
      {/* Boots */}
      <mesh geometry={geoBox} material={MAT_ROAD_CASE_BLACK} scale={[0.1, 0.1, 0.22]} position={[-0.09, 0.05, 0.04]} />
      <mesh geometry={geoBox} material={MAT_ROAD_CASE_BLACK} scale={[0.1, 0.1, 0.22]} position={[0.09, 0.05, 0.04]} />

      {/* Head with Cap */}
      <group ref={headRef} position={[0, 1.34, 0]}>
        <mesh geometry={geoSphere16} material={skinMat} scale={[0.11, 0.12, 0.11]} castShadow />
        {/* Cap */}
        <mesh geometry={geoSphere16} material={MAT_DIRECTOR_CAP} scale={[0.115, 0.08, 0.115]} position={[0, 0.04, 0]} />
        <mesh geometry={geoBox} material={MAT_DIRECTOR_CAP_BRIM} scale={[0.12, 0.015, 0.11]} position={[0, 0.02, 0.1]} rotation={[0.15, 0, 0]} />
      </group>

      {/* Left Arm */}
      <group position={[-0.2, 1.15, 0]} ref={leftArmRef}>
        <mesh geometry={geoCylinder12} material={outfitMat} scale={[0.045, 0.3, 0.045]} position={[0, -0.15, 0]} castShadow />
        <mesh geometry={geoSphere12} material={skinMat} scale={[0.038, 0.045, 0.038]} position={[0, -0.32, 0]} />
      </group>

      {/* Right Arm */}
      <group position={[0.2, 1.15, 0]} ref={rightArmRef}>
        <mesh geometry={geoCylinder12} material={outfitMat} scale={[0.045, 0.3, 0.045]} position={[0, -0.15, 0]} castShadow />
        <mesh geometry={geoSphere12} material={skinMat} scale={[0.038, 0.045, 0.038]} position={[0, -0.32, 0]} />
      </group>
    </group>
  );
});

ActiveCrewMember.displayName = 'ActiveCrewMember';

/** Advances the shared scene clock; every actor rig reads it in the same frame. */
export const SceneClockDriver: React.FC<{ filmStartedAt: number | null }> = ({ filmStartedAt }) => {
  useFrame(() => {
    if (filmStartedAt === null) {
      sceneClock.time = null;
      return;
    }
    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const elapsed = (now - filmStartedAt) / 1000;
    sceneClock.time = elapsed < 0 ? 0 : elapsed;
  });
  return null;
};

/** Comic book styled speech/dialogue bubble floating above speaker's head */
export const DialogueCaption3D: React.FC<{ baseY: number }> = ({ baseY }) => {
  const groupRef = useRef<THREE.Group>(null);
  const drawnFor = useRef<string>('');

  const { texture, material } = useMemo(() => {
    if (typeof document === 'undefined') {
      return { texture: null as THREE.CanvasTexture | null, material: MAT_ROAD_CASE_BLACK };
    }
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 256;
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return {
      texture: tex,
      material: new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        depthWrite: false,
        toneMapped: false,
      }),
    };
  }, []);

  useFrame(({ camera }) => {
    const group = groupRef.current;
    if (!group || !texture) return;

    const spoken = sceneClock.time === null ? null : lineAt(sceneClock.time);
    group.visible = spoken !== null;
    if (!spoken) return;

    if (drawnFor.current !== spoken.line) {
      drawnFor.current = spoken.line;
      const canvas = texture.image as HTMLCanvasElement;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, 1024, 256);

        // ── 1. Comic Speech Balloon Dimensions ──
        const x = 36;
        const y = 24;
        const w = 952;
        const h = 156;
        const r = 24;

        // Path with downward speech tail pointing towards actor
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        // Tail Right
        ctx.lineTo(512 + 32, y + h);
        ctx.lineTo(512, y + h + 46); // Speech bubble tip
        ctx.lineTo(512 - 32, y + h);
        // Tail Left & bottom left
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();

        // Solid White Background
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // Thick Solid Comic Black Border
        ctx.lineWidth = 10;
        ctx.strokeStyle = '#000000';
        ctx.lineJoin = 'round';
        ctx.stroke();

        // ── 2. Comic Speaker Character Pill ──
        let speakerName = 'SPEAKER';
        let badgeColor = '#facc15';
        if (spoken.speaker === 'lead_actor') {
          speakerName = '★ RAVI (LEAD)';
          badgeColor = '#60a5fa';
        } else if (spoken.speaker === 'lead_actress') {
          speakerName = '★ MAYA (LEAD)';
          badgeColor = '#34d399';
        } else if (spoken.speaker === 'villain') {
          speakerName = '★ DEV (RIVAL)';
          badgeColor = '#fb923c';
        } else if (spoken.speaker === 'co_star') {
          speakerName = '★ CO-STAR';
          badgeColor = '#f472b6';
        }

        ctx.fillStyle = badgeColor;
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 4;
        ctx.beginPath();
        if (typeof (ctx as any).roundRect === 'function') {
          (ctx as any).roundRect(x + 24, y - 14, 210, 36, 10);
        } else {
          ctx.rect(x + 24, y - 14, 210, 36);
        }
        ctx.fill();
        ctx.stroke();

        ctx.font = '900 20px "Arial Black", Impact, sans-serif';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(speakerName, x + 129, y + 4);

        // ── 3. Comic Dialogue Line ──
        ctx.font = '900 44px "Arial Black", Impact, sans-serif';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`“${spoken.line}”`, 512, y + 88, 880);
      }
      texture.needsUpdate = true;
    }

    const at = ACTOR_STAGE_POS[spoken.speaker];
    if (at) group.position.set(at.x, baseY + 2.35, at.y);
    group.quaternion.copy(camera.quaternion);
  });

  return (
    <group ref={groupRef} visible={false} renderOrder={999}>
      <mesh renderOrder={999}>
        <planeGeometry args={[3.1, 0.78]} />
        <primitive object={material} attach="material" />
      </mesh>
    </group>
  );
};

// ============================================================
// MASTER STUDIO CAST ORCHESTRATOR
// ============================================================
export const StudioCharacters3D: React.FC<{
  isFilming: boolean;
  productionLevel: number;
  dollyProgress?: number;
  filmStartedAt?: number | null;
}> = React.memo(({ isFilming, productionLevel, dollyProgress = 0, filmStartedAt = null }) => {
  const stageY = productionLevel >= 1 ? 0.3 : 0;

  // Persistent Cast States (RAVI, MAYA, DEV)
  const heroActor = useMemo(
    () => createActor('hero', OPENING_MARKS.lead_actor[0], OPENING_MARKS.lead_actor[1], 0.2),
    []
  );
  const leadActor = useMemo(
    () => createActor('lead', OPENING_MARKS.lead_actress[0], OPENING_MARKS.lead_actress[1], -0.1),
    []
  );
  const rivalActor = useMemo(
    () => createActor('rival', OPENING_MARKS.villain[0], OPENING_MARKS.villain[1], -0.4),
    []
  );

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const sceneTime = sceneClock.time;
    const performing = sceneTime !== null;
    const st = performing ? sceneTime : 0;
    const beat = beatAt(st);
    const dt = Math.min(delta, 0.05);

    // ══ 1. HERO (RAVI) ══
    const heroMark = performing ? markAt('lead_actor', st) : OPENING_MARKS.lead_actor;
    const heroSpeaking = performing && beat.speaker === 'lead_actor';
    const heroGesture = performing ? beat.gesture.lead_actor ?? 'rest' : 'rest';
    const heroEnergy = heroSpeaking ? speechEnergy(t) : 0;

    // Set mark and walk
    setDestination(heroActor.motion, heroMark[0], heroMark[1], null);
    stepMotion(heroActor.motion, dt);
    ACTOR_STAGE_POS.lead_actor.set(heroActor.motion.x, heroActor.motion.z);

    // Turn towards conversation partner
    const heroFocus = performing ? beat.focus.lead_actor : 'lead_actress';
    if (heroFocus && heroFocus !== 'camera') {
      const other = ACTOR_STAGE_POS[heroFocus];
      if (other) {
        const wantH = Math.atan2(other.x - heroActor.motion.x, other.y - heroActor.motion.z);
        let dh = wantH - heroActor.motion.heading;
        while (dh > Math.PI) dh -= Math.PI * 2;
        while (dh < -Math.PI) dh += Math.PI * 2;
        heroActor.motion.heading += dh * Math.min(1, dt * 5.0);
      }
    }

    // Pose and gestures
    heroActor.pose = poseFor(heroGesture as any, heroEnergy, t);
    heroActor.speaking = heroSpeaking;
    heroActor.expression = heroSpeaking ? 'excited' : (performing && beat.speaker === 'villain' ? 'concerned' : 'happy');
    stepFace(heroActor, dt);

    // ══ 2. LEAD ACTRESS (MAYA) ══
    const leadMark = performing ? markAt('lead_actress', st) : OPENING_MARKS.lead_actress;
    const leadSpeaking = performing && beat.speaker === 'lead_actress';
    const leadGesture = performing ? beat.gesture.lead_actress ?? 'rest' : 'rest';
    const leadEnergy = leadSpeaking ? speechEnergy(t) : 0;

    setDestination(leadActor.motion, leadMark[0], leadMark[1], null);
    stepMotion(leadActor.motion, dt);
    ACTOR_STAGE_POS.lead_actress.set(leadActor.motion.x, leadActor.motion.z);

    const leadFocus = performing ? beat.focus.lead_actress : 'lead_actor';
    if (leadFocus && leadFocus !== 'camera') {
      const other = ACTOR_STAGE_POS[leadFocus];
      if (other) {
        const wantH = Math.atan2(other.x - leadActor.motion.x, other.y - leadActor.motion.z);
        let dh = wantH - leadActor.motion.heading;
        while (dh > Math.PI) dh -= Math.PI * 2;
        while (dh < -Math.PI) dh += Math.PI * 2;
        leadActor.motion.heading += dh * Math.min(1, dt * 5.0);
      }
    }

    leadActor.pose = poseFor(leadGesture as any, leadEnergy, t);
    leadActor.speaking = leadSpeaking;
    leadActor.expression = leadSpeaking ? 'happy' : (performing && beat.speaker === 'villain' ? 'surprised' : 'celebrating');
    stepFace(leadActor, dt);

    // ══ 3. RIVAL (DEV) ══
    const rivalMark = performing ? markAt('villain', st) : OPENING_MARKS.villain;
    const rivalSpeaking = performing && beat.speaker === 'villain';
    const rivalGesture = performing ? beat.gesture.villain ?? 'rest' : 'rest';
    const rivalEnergy = rivalSpeaking ? speechEnergy(t) : 0;

    setDestination(rivalActor.motion, rivalMark[0], rivalMark[1], null);
    stepMotion(rivalActor.motion, dt);
    ACTOR_STAGE_POS.villain.set(rivalActor.motion.x, rivalActor.motion.z);

    const rivalFocus = performing ? beat.focus.villain : 'lead_actor';
    if (rivalFocus && rivalFocus !== 'camera') {
      const other = ACTOR_STAGE_POS[rivalFocus];
      if (other) {
        const wantH = Math.atan2(other.x - rivalActor.motion.x, other.y - rivalActor.motion.z);
        let dh = wantH - rivalActor.motion.heading;
        while (dh > Math.PI) dh -= Math.PI * 2;
        while (dh < -Math.PI) dh += Math.PI * 2;
        rivalActor.motion.heading += dh * Math.min(1, dt * 5.0);
      }
    }

    rivalActor.pose = poseFor(rivalGesture as any, rivalEnergy, t);
    rivalActor.speaking = rivalSpeaking;
    rivalActor.expression = rivalSpeaking ? 'stern' : 'neutral';
    stepFace(rivalActor, dt);
  });

  return (
    <group>
      {/* ── 1. PRIMARY CAST PERFORMERS (Anatomical Human Models with Two-Bone Leg IK & Face Morphs) ── */}
      <ActorCharacter3D actor={heroActor} baseY={stageY} isFilming={isFilming} />
      <ActorCharacter3D actor={leadActor} baseY={stageY} isFilming={isFilming} />
      <ActorCharacter3D actor={rivalActor} baseY={stageY} isFilming={isFilming} />

      {/* ── 2. SCENE CLOCK & COMIC DIALOGUE BALLOON ── */}
      <SceneClockDriver filmStartedAt={filmStartedAt} />
      <DialogueCaption3D baseY={stageY} />

      {/* ── 3. ACTIVE FILM PRODUCTION CREW ── */}
      {/* The Director with Megaphone at Video Village */}
      <ActiveCrewMember
        position={[-1.3, 0, 3.2]}
        rotationY={Math.PI - 0.22}
        crewType="director"
        isFilming={isFilming}
      />
      {/* Golden Megaphone in Director's Hand */}
      <group position={[-1.1, 1.25, 2.7]} rotation={[0.4, Math.PI - 0.22, 0]}>
        <mesh
          geometry={geoCylinder12}
          material={MAT_STAGE_TAPE_YELLOW}
          scale={[0.08, 0.24, 0.08]}
          rotation={[Math.PI / 2, 0, 0]}
        />
      </group>

      {/* Camera Operator at Camera 1 */}
      <ActiveCrewMember
        position={[1.8, 0, 2.9]}
        rotationY={Math.PI + 0.33}
        crewType="camera_op"
        isFilming={isFilming}
      />

      {/* Dolly Grip on Track */}
      <ActiveCrewMember
        position={[-5.6 + dollyProgress * 2.8, 0, 2.6]}
        rotationY={Math.PI - 0.72}
        crewType="dolly_grip"
        isFilming={isFilming}
      />

      {/* Sound Boom Operator with Telescopic Pole */}
      <group position={[-3.4, 0, 0.8]}>
        <ActiveCrewMember
          position={[0, 0, 0]}
          rotationY={Math.PI - 0.75}
          crewType="boom_op"
          isFilming={isFilming}
        />
        <group position={[0.2, 2.0, 0]} rotation={[-0.4, Math.PI - 0.75, 0.2]}>
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

      {/* Set Photographer with DSLR */}
      <group position={[3.6, 0, 0.8]}>
        <ActiveCrewMember
          position={[0, 0, 0]}
          rotationY={Math.PI + 0.45}
          crewType="photographer"
          skinMat={MAT_SKIN_PEACH}
          isFilming={isFilming}
        />
        <group position={[-0.18, 1.48, -0.22]} rotation={[0.1, Math.PI + 0.45, 0]}>
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
