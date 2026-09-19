// ============================================================
// RATIO RUSH — HIGH-FIDELITY ACTOR CHARACTER 3D COMPONENT
// Anatomical Stylized-Realistic Human Characters with Two-Bone IK,
// Live Facial Morphs, Gaze Tracking, Syllable Speech Sync & Pinned Stance.
// ============================================================

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ActorState } from '../engine/cast';
import { RIG } from '../engine/actorRig';
import { solveLeg, solveArm, newBoneSolution, BoneSolution } from '../engine/actorLocomotion';
import {
  geoBox,
  geoCylinder8,
  geoCylinder12,
  geoCylinder16,
  geoSphere12,
  geoSphere16,
  getStudioMaterial,
  MAT_EYE_WHITE,
  MAT_EYE_PUPIL,
} from './StudioMaterials';

interface ActorCharacter3DProps {
  actor: ActorState;
  /** Height offset of the stage deck */
  baseY?: number;
  /** Whether the movie shoot camera is rolling */
  isFilming?: boolean;
}

export const ActorCharacter3D: React.FC<ActorCharacter3DProps> = React.memo(
  ({ actor, baseY = 0, isFilming = false }) => {
    const rootRef = useRef<THREE.Group>(null);
    const pelvisRef = useRef<THREE.Group>(null);
    const chestRef = useRef<THREE.Group>(null);
    const neckRef = useRef<THREE.Group>(null);
    const headRef = useRef<THREE.Group>(null);

    // Facial morph nodes
    const eyeLeftPupilRef = useRef<THREE.Group>(null);
    const eyeRightPupilRef = useRef<THREE.Group>(null);
    const browLeftRef = useRef<THREE.Group>(null);
    const browRightRef = useRef<THREE.Group>(null);
    const eyelidLeftRef = useRef<THREE.Group>(null);
    const eyelidRightRef = useRef<THREE.Group>(null);
    const mouthMeshRef = useRef<THREE.Group>(null);

    // Left Arm Hierarchy
    const lShoulderRef = useRef<THREE.Group>(null);
    const lUpperArmRef = useRef<THREE.Group>(null);
    const lElbowRef = useRef<THREE.Group>(null);
    const lForearmRef = useRef<THREE.Group>(null);
    const lWristRef = useRef<THREE.Group>(null);
    const lHandRef = useRef<THREE.Group>(null);

    // Right Arm Hierarchy
    const rShoulderRef = useRef<THREE.Group>(null);
    const rUpperArmRef = useRef<THREE.Group>(null);
    const rElbowRef = useRef<THREE.Group>(null);
    const rForearmRef = useRef<THREE.Group>(null);
    const rWristRef = useRef<THREE.Group>(null);
    const rHandRef = useRef<THREE.Group>(null);

    // Left Leg Hierarchy (IK Solved)
    const lHipRef = useRef<THREE.Group>(null);
    const lKneeRef = useRef<THREE.Group>(null);
    const lAnkleRef = useRef<THREE.Group>(null);
    const lFootRef = useRef<THREE.Group>(null);

    // Right Leg Hierarchy (IK Solved)
    const rHipRef = useRef<THREE.Group>(null);
    const rKneeRef = useRef<THREE.Group>(null);
    const rAnkleRef = useRef<THREE.Group>(null);
    const rFootRef = useRef<THREE.Group>(null);

    // Reusable IK Solution Buffers
    const ikLegL = useMemo(() => newBoneSolution(), []);
    const ikLegR = useMemo(() => newBoneSolution(), []);
    const ikArmL = useMemo(() => newBoneSolution(), []);
    const ikArmR = useMemo(() => newBoneSolution(), []);

    // Cast Member Materials
    const member = actor.member;
    const skinMat = useMemo(() => getStudioMaterial(member.skin, 0.62, 0.0), [member.skin]);
    const skinShadeMat = useMemo(() => getStudioMaterial(member.skinShade, 0.65, 0.0), [member.skinShade]);
    const hairMat = useMemo(() => getStudioMaterial(member.hair, 0.72, 0.08), [member.hair]);
    const topMat = useMemo(() => getStudioMaterial(member.top, 0.55, 0.05), [member.top]);
    const topTrimMat = useMemo(() => getStudioMaterial(member.topTrim, 0.35, 0.2, member.topTrim, 0.2), [member.topTrim]);
    const trousersMat = useMemo(() => getStudioMaterial(member.trousers, 0.75, 0.02), [member.trousers]);
    const shoesMat = useMemo(() => getStudioMaterial(member.shoes, 0.45, 0.2), [member.shoes]);
    const irisMat = useMemo(() => getStudioMaterial(member.iris, 0.3, 0.1), [member.iris]);

    const buildScale = member.build || 1.0;
    const frameScale = member.frame || 1.0;

    useFrame((state, delta) => {
      const root = rootRef.current;
      if (!root) return;

      const t = state.clock.getElapsedTime();
      const motion = actor.motion;
      const pose = actor.pose;
      const face = actor.face;

      // ── 1. Root Position & Heading ──
      root.position.set(motion.x, baseY, motion.z);
      root.rotation.y = motion.heading;

      // ── 2. Pelvis Rise, Bob, Lean & Sway ──
      if (pelvisRef.current) {
        pelvisRef.current.position.y = (motion.pelvisY || RIG.pelvisY) * buildScale;
        pelvisRef.current.rotation.z = motion.pelvisRoll;
        pelvisRef.current.rotation.y = motion.pelvisYaw;
        pelvisRef.current.position.x = pose.weightShift * 0.035 * frameScale;
      }

      // ── 3. Spine & Chest Articulation (Waist Lean, Twist & Breath) ──
      const breath = Math.sin(t * 1.8) * 0.012;
      if (chestRef.current) {
        chestRef.current.position.y = (RIG.spineLen + breath) * buildScale;
        chestRef.current.rotation.x = pose.spineLean * 0.8;
        chestRef.current.rotation.y = pose.spineTwist * 0.8;
        chestRef.current.rotation.z = pose.spineSide * 0.8;
      }

      // ── 4. Neck & Head Orientation with Natural Look-At Gaze Tracking ──
      if (headRef.current) {
        headRef.current.position.y = (RIG.neckLen + RIG.headLen * 0.5) * buildScale;
        
        // Eased head pitch, yaw, roll + micro-nods while speaking
        const speechNod = actor.speaking ? Math.sin(t * 5.4) * 0.04 : 0;
        headRef.current.rotation.x = pose.headPitch + actor.headPitch + speechNod;
        headRef.current.rotation.y = pose.headYaw + actor.headYaw;
        headRef.current.rotation.z = pose.headRoll;
      }

      // ── 5. Facial Animation: Eyes, Eyelids, Eyebrows & Mouth Sync ──
      // Gaze saccades & iris orientation
      const eyeAimX = Math.sin(t * 0.6) * 0.004 + actor.eyeYaw * 0.02;
      const eyeAimY = Math.cos(t * 0.8) * 0.003 - actor.eyePitch * 0.02;
      if (eyeLeftPupilRef.current) eyeLeftPupilRef.current.position.set(eyeAimX, eyeAimY, 0);
      if (eyeRightPupilRef.current) eyeRightPupilRef.current.position.set(eyeAimX, eyeAimY, 0);

      // Blinking cycle (periodic natural blinks)
      const blinkCycle = Math.sin(t * 2.8);
      const isBlinking = blinkCycle > 0.96;
      const eyeScaleY = isBlinking ? 0.05 : THREE.MathUtils.clamp(face.eyeOpen, 0.3, 1.4);
      if (eyelidLeftRef.current) eyelidLeftRef.current.scale.y = eyeScaleY;
      if (eyelidRightRef.current) eyelidRightRef.current.scale.y = eyeScaleY;

      // Eyebrows Morphing (Inner/Outer lift and tilt angle)
      if (browLeftRef.current) {
        browLeftRef.current.position.y = 0.048 + face.browInner * 0.018;
        browLeftRef.current.rotation.z = face.browAngle * 0.25;
      }
      if (browRightRef.current) {
        browRightRef.current.position.y = 0.048 + face.browInner * 0.018;
        browRightRef.current.rotation.z = -face.browAngle * 0.25;
      }

      // Mouth Speaking Syllable Animation + Emotion Curve
      if (mouthMeshRef.current) {
        const syllableOpen = actor.speaking ? Math.abs(Math.sin(t * 6.2)) * 0.28 : 0;
        const totalOpen = THREE.MathUtils.clamp(face.mouthOpen + syllableOpen, 0.04, 0.6);
        mouthMeshRef.current.scale.set(
          THREE.MathUtils.clamp(face.mouthWidth, 0.7, 1.4),
          totalOpen * 2.2,
          1
        );
        mouthMeshRef.current.rotation.z = face.mouthCurve * 0.2;
      }

      // ── 6. Two-Bone IK Leg Grounding (Left & Right Foot Attachment) ──
      // Actor's local frame relative to root
      const rootX = motion.x;
      const rootZ = motion.z;
      const heading = motion.heading;
      const cosH = Math.cos(-heading);
      const sinH = Math.sin(-heading);

      // Transform world foot positions into local hip space
      const pelvisWorldY = (motion.pelvisY || RIG.pelvisY) * buildScale;

      // Left Leg
      const footL = motion.feet[0];
      const dxL = footL.x - rootX;
      const dzL = footL.z - rootZ;
      const localFootLx = dxL * cosH - dzL * sinH - RIG.hipX * frameScale;
      const localFootLz = dxL * sinH + dzL * cosH;
      const localFootLy = (footL.y - pelvisWorldY) / buildScale;

      solveLeg(localFootLx, localFootLy, localFootLz, ikLegL);
      if (lHipRef.current) lHipRef.current.quaternion.copy(ikLegL.q);
      if (lKneeRef.current) lKneeRef.current.rotation.x = ikLegL.bend;
      if (lFootRef.current) {
        lFootRef.current.rotation.x = footL.pitch;
        lFootRef.current.rotation.y = footL.yaw - heading;
      }

      // Right Leg
      const footR = motion.feet[1];
      const dxR = footR.x - rootX;
      const dzR = footR.z - rootZ;
      const localFootRx = dxR * cosH - dzR * sinH + RIG.hipX * frameScale;
      const localFootRz = dxR * sinH + dzR * cosH;
      const localFootRy = (footR.y - pelvisWorldY) / buildScale;

      solveLeg(localFootRx, localFootRy, localFootRz, ikLegR);
      if (rHipRef.current) rHipRef.current.quaternion.copy(ikLegR.q);
      if (rKneeRef.current) rKneeRef.current.rotation.x = ikLegR.bend;
      if (rFootRef.current) {
        rFootRef.current.rotation.x = footR.pitch;
        rFootRef.current.rotation.y = footR.yaw - heading;
      }

      // ── 7. Upper Body Gestures & Two-Bone Arm Solving ──
      // Left Arm
      if (lUpperArmRef.current) {
        lUpperArmRef.current.rotation.set(
          pose.left.shoulderX,
          pose.left.shoulderY,
          pose.left.shoulderZ
        );
      }
      if (lElbowRef.current) lElbowRef.current.rotation.x = pose.left.elbow;
      if (lWristRef.current) lWristRef.current.rotation.x = pose.left.wristX;

      // Right Arm
      if (rUpperArmRef.current) {
        rUpperArmRef.current.rotation.set(
          pose.right.shoulderX,
          pose.right.shoulderY,
          pose.right.shoulderZ
        );
      }
      if (rElbowRef.current) rElbowRef.current.rotation.x = pose.right.elbow;
      if (rWristRef.current) rWristRef.current.rotation.x = pose.right.wristX;
    });

    return (
      <group ref={rootRef}>
        {/* ── PELVIS / HIPS ROOT ── */}
        <group ref={pelvisRef}>
          {/* Hips & Lower Torso / Trouser Top */}
          <mesh
            geometry={geoBox}
            material={trousersMat}
            scale={[0.27 * frameScale, 0.14 * buildScale, 0.19]}
            position={[0, 0, 0]}
            castShadow
            receiveShadow
          />
          {/* Stylized Belt & Buckle */}
          <mesh
            geometry={geoBox}
            material={shoesMat}
            scale={[0.275 * frameScale, 0.035 * buildScale, 0.195]}
            position={[0, 0.055 * buildScale, 0]}
          />
          <mesh
            geometry={geoBox}
            material={topTrimMat}
            scale={[0.045, 0.04 * buildScale, 0.202]}
            position={[0, 0.055 * buildScale, 0]}
          />

          {/* ── SPINE CHAIN ── */}
          <group position={[0, 0.08 * buildScale, 0]}>
            {/* Mid Waist */}
            <mesh
              geometry={geoCylinder12}
              material={topMat}
              scale={[0.12 * frameScale, RIG.spineLen * buildScale, 0.095]}
              position={[0, RIG.spineLen * 0.5 * buildScale, 0]}
              castShadow
            />

            {/* ── CHEST & SHOULDERS ── */}
            <group ref={chestRef}>
              {/* Upper Torso / Action Jacket */}
              <mesh
                geometry={geoBox}
                material={topMat}
                scale={[RIG.shoulderWidth * frameScale, RIG.chestLen * buildScale, RIG.chestDepth]}
                position={[0, RIG.chestLen * 0.5 * buildScale, 0]}
                castShadow
                receiveShadow
              />
              {/* Jacket Trim Lapels / Gold Stripes */}
              <mesh
                geometry={geoBox}
                material={topTrimMat}
                scale={[0.02 * frameScale, RIG.chestLen * 0.9 * buildScale, RIG.chestDepth * 1.02]}
                position={[0, RIG.chestLen * 0.5 * buildScale, 0]}
              />
              {/* Shoulder Badges */}
              <mesh
                geometry={geoBox}
                material={topTrimMat}
                scale={[0.06 * frameScale, 0.02 * buildScale, 0.12]}
                position={[-RIG.shoulderWidth * 0.48 * frameScale, RIG.chestLen * buildScale, 0]}
              />
              <mesh
                geometry={geoBox}
                material={topTrimMat}
                scale={[0.06 * frameScale, 0.02 * buildScale, 0.12]}
                position={[RIG.shoulderWidth * 0.48 * frameScale, RIG.chestLen * buildScale, 0]}
              />

              {/* ── NECK & HEAD ── */}
              <group position={[0, RIG.chestLen * buildScale, 0]}>
                {/* Neck with Collar */}
                <mesh
                  geometry={geoCylinder12}
                  material={skinShadeMat}
                  scale={[0.052, RIG.neckLen * buildScale, 0.052]}
                  position={[0, RIG.neckLen * 0.5 * buildScale, 0]}
                  castShadow
                />

                {/* Head Root */}
                <group ref={headRef}>
                  {/* Sculpted Head Mesh with Jaw & Cheeks */}
                  <mesh
                    geometry={geoSphere16}
                    material={skinMat}
                    scale={[RIG.headRadius * 0.94, RIG.headRadius * 1.08, RIG.headRadius * 0.98]}
                    position={[0, 0, 0]}
                    castShadow
                    receiveShadow
                  />
                  {/* Defined Jawline & Chin */}
                  <mesh
                    geometry={geoBox}
                    material={skinMat}
                    scale={[0.11, 0.08, 0.09]}
                    position={[0, -0.06, 0.04]}
                    castShadow
                  />
                  {/* Sculpted Nose */}
                  <mesh
                    geometry={geoBox}
                    material={skinShadeMat}
                    scale={[0.022, 0.042, 0.038]}
                    position={[0, 0.005, RIG.headRadius * 0.96]}
                    rotation={[0.2, 0, 0]}
                  />

                  {/* ── EYES (Sclera + Iris + Blink Eyelids) ── */}
                  {/* Left Eye */}
                  <group position={[-RIG.eyeSpacing * 0.5, RIG.eyeHeight, RIG.eyeForward]}>
                    <mesh geometry={geoSphere12} material={MAT_EYE_WHITE} scale={[0.025, 0.022, 0.015]} />
                    <group ref={eyeLeftPupilRef} position={[0, 0, 0.012]}>
                      <mesh geometry={geoSphere12} material={irisMat} scale={[0.013, 0.013, 0.008]} />
                      <mesh geometry={geoSphere12} material={MAT_EYE_PUPIL} scale={[0.006, 0.006, 0.006]} position={[0, 0, 0.004]} />
                    </group>
                    {/* Animated Eyelid */}
                    <group ref={eyelidLeftRef}>
                      <mesh geometry={geoBox} material={skinMat} scale={[0.028, 0.012, 0.016]} position={[0, 0.01, 0.008]} />
                    </group>
                  </group>

                  {/* Right Eye */}
                  <group position={[RIG.eyeSpacing * 0.5, RIG.eyeHeight, RIG.eyeForward]}>
                    <mesh geometry={geoSphere12} material={MAT_EYE_WHITE} scale={[0.025, 0.022, 0.015]} />
                    <group ref={eyeRightPupilRef} position={[0, 0, 0.012]}>
                      <mesh geometry={geoSphere12} material={irisMat} scale={[0.013, 0.013, 0.008]} />
                      <mesh geometry={geoSphere12} material={MAT_EYE_PUPIL} scale={[0.006, 0.006, 0.006]} position={[0, 0, 0.004]} />
                    </group>
                    {/* Animated Eyelid */}
                    <group ref={eyelidRightRef}>
                      <mesh geometry={geoBox} material={skinMat} scale={[0.028, 0.012, 0.016]} position={[0, 0.01, 0.008]} />
                    </group>
                  </group>

                  {/* ── EYEBROWS (Morphable Expressions) ── */}
                  <group ref={browLeftRef} position={[-RIG.eyeSpacing * 0.5, 0.048, RIG.eyeForward + 0.005]}>
                    <mesh geometry={geoBox} material={hairMat} scale={[0.038, 0.008, 0.015]} />
                  </group>
                  <group ref={browRightRef} position={[RIG.eyeSpacing * 0.5, 0.048, RIG.eyeForward + 0.005]}>
                    <mesh geometry={geoBox} material={hairMat} scale={[0.038, 0.008, 0.015]} />
                  </group>

                  {/* ── MOUTH (Syllable Speaking Pulse & Smile Morphs) ── */}
                  <group position={[0, -0.042, RIG.headRadius * 0.94]}>
                    <group ref={mouthMeshRef}>
                      <mesh geometry={geoBox} material={skinShadeMat} scale={[0.046, 0.014, 0.01]} />
                    </group>
                  </group>

                  {/* ── DISTINCT CAST HAIRSTYLES ── */}
                  {member.hairStyle === 'short_swept' && (
                    /* RAVI: Volumetric Swept Quiff */
                    <group position={[0, 0.055, -0.01]}>
                      <mesh geometry={geoSphere16} material={hairMat} scale={[0.118, 0.09, 0.12]} castShadow />
                      <mesh geometry={geoBox} material={hairMat} scale={[0.09, 0.045, 0.08]} position={[0, 0.05, 0.04]} rotation={[0.2, 0, 0]} castShadow />
                      <mesh geometry={geoBox} material={hairMat} scale={[0.04, 0.035, 0.07]} position={[0.045, 0.045, 0.03]} rotation={[0.1, -0.2, -0.2]} />
                    </group>
                  )}

                  {member.hairStyle === 'long_wavy' && (
                    /* MAYA: Long Flowing Brunette Locks over Shoulders */
                    <group position={[0, 0.05, -0.01]}>
                      <mesh geometry={geoSphere16} material={hairMat} scale={[0.125, 0.095, 0.125]} castShadow />
                      {/* Left Cascade Lock */}
                      <mesh geometry={geoCylinder12} material={hairMat} scale={[0.035, 0.28, 0.035]} position={[-0.095, -0.12, 0.02]} rotation={[0.1, 0, 0.1]} castShadow />
                      {/* Right Cascade Lock */}
                      <mesh geometry={geoCylinder12} material={hairMat} scale={[0.035, 0.28, 0.035]} position={[0.095, -0.12, 0.02]} rotation={[0.1, 0, -0.1]} castShadow />
                      {/* Back Flowing Hair */}
                      <mesh geometry={geoBox} material={hairMat} scale={[0.18, 0.25, 0.06]} position={[0, -0.11, -0.08]} castShadow />
                    </group>
                  )}

                  {member.hairStyle === 'tight_curls' && (
                    /* DEV: Structured Tight Curls / Fade */
                    <group position={[0, 0.06, -0.01]}>
                      <mesh geometry={geoSphere16} material={hairMat} scale={[0.122, 0.085, 0.122]} castShadow />
                      <mesh geometry={geoSphere12} material={hairMat} scale={[0.05, 0.04, 0.05]} position={[-0.04, 0.05, 0.03]} />
                      <mesh geometry={geoSphere12} material={hairMat} scale={[0.05, 0.04, 0.05]} position={[0.04, 0.05, 0.03]} />
                      <mesh geometry={geoSphere12} material={hairMat} scale={[0.06, 0.045, 0.06]} position={[0, 0.06, 0]} />
                    </group>
                  )}
                </group>
              </group>

              {/* ── LEFT ARM (Shoulder → Upper Arm → Elbow → Forearm → Hand) ── */}
              <group position={[-RIG.shoulderX * frameScale, (RIG.chestLen - RIG.shoulderY) * buildScale, 0]}>
                <mesh geometry={geoSphere12} material={topMat} scale={[0.055, 0.055, 0.055]} />
                <group ref={lUpperArmRef}>
                  <mesh
                    geometry={geoCylinder12}
                    material={topMat}
                    scale={[RIG.limbRadius * 0.95, RIG.upperArm * buildScale, RIG.limbRadius * 0.95]}
                    position={[0, -RIG.upperArm * 0.5 * buildScale, 0]}
                    castShadow
                  />
                  {/* Left Elbow Joint */}
                  <group ref={lElbowRef} position={[0, -RIG.upperArm * buildScale, 0]}>
                    <mesh geometry={geoSphere12} material={skinShadeMat} scale={[0.046, 0.046, 0.046]} />
                    <group ref={lForearmRef}>
                      <mesh
                        geometry={geoCylinder12}
                        material={topMat}
                        scale={[RIG.limbRadius * 0.85, RIG.foreArm * buildScale, RIG.limbRadius * 0.85]}
                        position={[0, -RIG.foreArm * 0.5 * buildScale, 0]}
                        castShadow
                      />
                      {/* Left Wrist & Hand with Fingers */}
                      <group ref={lWristRef} position={[0, -RIG.foreArm * buildScale, 0]}>
                        <mesh geometry={geoSphere12} material={skinMat} scale={[0.038, 0.038, 0.038]} />
                        <group ref={lHandRef}>
                          <mesh geometry={geoBox} material={skinMat} scale={[0.065, 0.08, 0.032]} position={[0, -0.04, 0]} castShadow />
                          {/* Thumb */}
                          <mesh geometry={geoBox} material={skinMat} scale={[0.022, 0.04, 0.02]} position={[0.035, -0.025, 0.015]} rotation={[0, 0, -0.4]} />
                        </group>
                      </group>
                    </group>
                  </group>
                </group>
              </group>

              {/* ── RIGHT ARM (Shoulder → Upper Arm → Elbow → Forearm → Hand) ── */}
              <group position={[RIG.shoulderX * frameScale, (RIG.chestLen - RIG.shoulderY) * buildScale, 0]}>
                <mesh geometry={geoSphere12} material={topMat} scale={[0.055, 0.055, 0.055]} />
                <group ref={rUpperArmRef}>
                  <mesh
                    geometry={geoCylinder12}
                    material={topMat}
                    scale={[RIG.limbRadius * 0.95, RIG.upperArm * buildScale, RIG.limbRadius * 0.95]}
                    position={[0, -RIG.upperArm * 0.5 * buildScale, 0]}
                    castShadow
                  />
                  {/* Right Elbow Joint */}
                  <group ref={rElbowRef} position={[0, -RIG.upperArm * buildScale, 0]}>
                    <mesh geometry={geoSphere12} material={skinShadeMat} scale={[0.046, 0.046, 0.046]} />
                    <group ref={rForearmRef}>
                      <mesh
                        geometry={geoCylinder12}
                        material={topMat}
                        scale={[RIG.limbRadius * 0.85, RIG.foreArm * buildScale, RIG.limbRadius * 0.85]}
                        position={[0, -RIG.foreArm * 0.5 * buildScale, 0]}
                        castShadow
                      />
                      {/* Right Wrist & Hand with Fingers */}
                      <group ref={rWristRef} position={[0, -RIG.foreArm * buildScale, 0]}>
                        <mesh geometry={geoSphere12} material={skinMat} scale={[0.038, 0.038, 0.038]} />
                        <group ref={rHandRef}>
                          <mesh geometry={geoBox} material={skinMat} scale={[0.065, 0.08, 0.032]} position={[0, -0.04, 0]} castShadow />
                          {/* Thumb */}
                          <mesh geometry={geoBox} material={skinMat} scale={[0.022, 0.04, 0.02]} position={[-0.035, -0.025, 0.015]} rotation={[0, 0, 0.4]} />
                        </group>
                      </group>
                    </group>
                  </group>
                </group>
              </group>
            </group>
          </group>

          {/* ── LEFT LEG (Two-Bone Grounding IK Solved) ── */}
          <group position={[-RIG.hipX * frameScale, -0.04 * buildScale, 0]}>
            <mesh geometry={geoSphere12} material={trousersMat} scale={[0.065, 0.065, 0.065]} />
            <group ref={lHipRef}>
              {/* Thigh */}
              <mesh
                geometry={geoCylinder12}
                material={trousersMat}
                scale={[RIG.limbRadius * 1.15, RIG.thigh * buildScale, RIG.limbRadius * 1.15]}
                position={[0, -RIG.thigh * 0.5 * buildScale, 0]}
                castShadow
              />
              {/* Left Knee Joint */}
              <group position={[0, -RIG.thigh * buildScale, 0]}>
                <mesh geometry={geoSphere12} material={trousersMat} scale={[0.058, 0.058, 0.058]} />
                <group ref={lKneeRef}>
                  {/* Shin */}
                  <mesh
                    geometry={geoCylinder12}
                    material={trousersMat}
                    scale={[RIG.limbRadius * 0.98, RIG.shin * buildScale, RIG.limbRadius * 0.98]}
                    position={[0, -RIG.shin * 0.5 * buildScale, 0]}
                    castShadow
                  />
                  {/* Left Ankle & Foot */}
                  <group position={[0, -RIG.shin * buildScale, 0]}>
                    <mesh geometry={geoSphere12} material={shoesMat} scale={[0.048, 0.048, 0.048]} />
                    <group ref={lFootRef}>
                      {/* Action Boot Shoe with Heel & Toe */}
                      <mesh
                        geometry={geoBox}
                        material={shoesMat}
                        scale={[RIG.footWidth, RIG.ankleY * buildScale, RIG.footLen]}
                        position={[0, -RIG.ankleY * 0.45 * buildScale, RIG.footLen * 0.28]}
                        castShadow
                        receiveShadow
                      />
                      {/* White Shoe Sole / Trim */}
                      <mesh
                        geometry={geoBox}
                        material={topTrimMat}
                        scale={[RIG.footWidth * 1.05, 0.015, RIG.footLen * 1.02]}
                        position={[0, -RIG.ankleY * 0.9 * buildScale, RIG.footLen * 0.28]}
                      />
                    </group>
                  </group>
                </group>
              </group>
            </group>
          </group>

          {/* ── RIGHT LEG (Two-Bone Grounding IK Solved) ── */}
          <group position={[RIG.hipX * frameScale, -0.04 * buildScale, 0]}>
            <mesh geometry={geoSphere12} material={trousersMat} scale={[0.065, 0.065, 0.065]} />
            <group ref={rHipRef}>
              {/* Thigh */}
              <mesh
                geometry={geoCylinder12}
                material={trousersMat}
                scale={[RIG.limbRadius * 1.15, RIG.thigh * buildScale, RIG.limbRadius * 1.15]}
                position={[0, -RIG.thigh * 0.5 * buildScale, 0]}
                castShadow
              />
              {/* Right Knee Joint */}
              <group position={[0, -RIG.thigh * buildScale, 0]}>
                <mesh geometry={geoSphere12} material={trousersMat} scale={[0.058, 0.058, 0.058]} />
                <group ref={rKneeRef}>
                  {/* Shin */}
                  <mesh
                    geometry={geoCylinder12}
                    material={trousersMat}
                    scale={[RIG.limbRadius * 0.98, RIG.shin * buildScale, RIG.limbRadius * 0.98]}
                    position={[0, -RIG.shin * 0.5 * buildScale, 0]}
                    castShadow
                  />
                  {/* Right Ankle & Foot */}
                  <group position={[0, -RIG.shin * buildScale, 0]}>
                    <mesh geometry={geoSphere12} material={shoesMat} scale={[0.048, 0.048, 0.048]} />
                    <group ref={rFootRef}>
                      {/* Action Boot Shoe with Heel & Toe */}
                      <mesh
                        geometry={geoBox}
                        material={shoesMat}
                        scale={[RIG.footWidth, RIG.ankleY * buildScale, RIG.footLen]}
                        position={[0, -RIG.ankleY * 0.45 * buildScale, RIG.footLen * 0.28]}
                        castShadow
                        receiveShadow
                      />
                      {/* White Shoe Sole / Trim */}
                      <mesh
                        geometry={geoBox}
                        material={topTrimMat}
                        scale={[RIG.footWidth * 1.05, 0.015, RIG.footLen * 1.02]}
                        position={[0, -RIG.ankleY * 0.9 * buildScale, RIG.footLen * 0.28]}
                      />
                    </group>
                  </group>
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    );
  }
);

ActorCharacter3D.displayName = 'ActorCharacter3D';
