// ============================================================
// PATTERN RACERS — Champagne Streaker Fan 3D (Easter Egg Character)
// Story Sequence:
// 1. (0s - 3.5s): Drinks champagne with bottle & wobbles drunk at trackside
// 2. (3.5s - 6.5s): Trips over kerb and falls flat onto road edge at start line
// 3. (6.5s - 10.5s): Panics in shy embarrassment, scrambles & sprints across track to safe side
// 4. (10.5s - 16s): Reaches safe stadium apron on right side, pops champagne & does a goofy victory dance!
// ============================================================

'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const ChampagneStreakerFan3D: React.FC = () => {
  const rootRef = useRef<THREE.Group>(null);
  const torsoRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const bottleRef = useRef<THREE.Group>(null);
  const foamSprayRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!rootRef.current) return;

    const time = state.clock.getElapsedTime();
    const cycle = time % 16; // 16-second looping Easter egg drama

    // Reset defaults
    if (foamSprayRef.current) foamSprayRef.current.visible = false;

    // ── STAGE 1: (0s - 3.5s) Drunk Wobble & Drinking Champagne at Trackside Left ──
    if (cycle < 3.5) {
      const wobble = Math.sin(time * 5) * 0.25;
      rootRef.current.position.set(-4.2, 0.45, 1.5);
      rootRef.current.rotation.set(0, 0.8, wobble);

      if (torsoRef.current) torsoRef.current.rotation.set(wobble * 0.5, 0, 0);
      if (headRef.current) headRef.current.rotation.set(-0.35 + Math.sin(time * 6) * 0.1, 0, 0); // Head tilted back drinking

      // Right arm raising bottle to mouth
      if (rightArmRef.current) {
        rightArmRef.current.rotation.set(-1.8, 0.4, -0.6 + Math.sin(time * 4) * 0.1);
      }
      if (leftArmRef.current) {
        leftArmRef.current.rotation.set(0.4, 0, -0.5 + wobble);
      }
      if (leftLegRef.current) leftLegRef.current.rotation.set(0, 0, 0.1);
      if (rightLegRef.current) rightLegRef.current.rotation.set(0, 0, -0.1);

      if (foamSprayRef.current) {
        foamSprayRef.current.visible = true;
        foamSprayRef.current.scale.setScalar(0.8 + Math.sin(time * 15) * 0.3);
      }
    }

    // ── STAGE 2: (3.5s - 6.5s) Trips, Stumbles & Falls Over Flat onto Start Line Road ──
    else if (cycle < 6.5) {
      const fallProgress = (cycle - 3.5) / 3.0; // 0 to 1
      const fallPitch = Math.min(Math.PI / 2, fallProgress * 3.2);

      // Slides from kerb (-4.2) onto road edge (-2.6)
      const posX = -4.2 + Math.min(1.0, fallProgress * 1.5) * 1.6;
      const posY = Math.max(0.12, 0.45 - fallProgress * 0.33);

      rootRef.current.position.set(posX, posY, 0.5);
      rootRef.current.rotation.set(fallPitch, 0.2, 0.3);

      if (headRef.current) headRef.current.rotation.set(0.3, 0.4, 0);
      // Arms flailing in shock
      if (leftArmRef.current) leftArmRef.current.rotation.set(-1.2, 0, 1.2 + Math.sin(time * 10) * 0.3);
      if (rightArmRef.current) rightArmRef.current.rotation.set(-1.0, 0, -1.0 - Math.sin(time * 10) * 0.3);
      // Kicking legs in surprise
      if (leftLegRef.current) leftLegRef.current.rotation.set(Math.sin(time * 12) * 0.3, 0, 0);
      if (rightLegRef.current) rightLegRef.current.rotation.set(-Math.sin(time * 12) * 0.3, 0, 0);
    }

    // ── STAGE 3: (6.5s - 10.5s) Shy Panic! Scurries & Sprints across Track to the Other Side ──
    else if (cycle < 10.5) {
      const runProgress = (cycle - 6.5) / 4.0; // 0 to 1
      // Sprints from -2.6 across track to +7.2
      const posX = -2.6 + runProgress * 9.8;
      const bounceY = 0.4 + Math.abs(Math.sin(time * 18)) * 0.15;

      rootRef.current.position.set(posX, bounceY, 0.2 - runProgress * 2.0);
      // Facing running direction (+X)
      rootRef.current.rotation.set(0.15, -Math.PI / 2, 0);

      // Shy hunched posture
      if (torsoRef.current) torsoRef.current.rotation.set(0.35, 0, 0);
      if (headRef.current) headRef.current.rotation.set(0.2, Math.sin(time * 8) * 0.4, 0); // Looking left and right nervously

      // Fast running arm swing (hands near face in embarrassment)
      const armSwing = Math.sin(time * 18);
      if (leftArmRef.current) leftArmRef.current.rotation.set(armSwing * 0.9, 0, 0.3);
      if (rightArmRef.current) rightArmRef.current.rotation.set(-armSwing * 0.9, 0, -0.3);

      // Fast running legs
      const legSwing = Math.sin(time * 18);
      if (leftLegRef.current) leftLegRef.current.rotation.set(legSwing * 1.1, 0, 0);
      if (rightLegRef.current) rightLegRef.current.rotation.set(-legSwing * 1.1, 0, 0);
    }

    // ── STAGE 4: (10.5s - 16s) Safe on Right Side & Goofy Celebratory Victory Dance! ──
    else {
      const danceTime = cycle - 10.5;
      const jumpY = 0.45 + Math.abs(Math.sin(danceTime * 6)) * 0.3;
      const hipWiggle = Math.sin(danceTime * 8) * 0.4;

      rootRef.current.position.set(7.5, jumpY, -2.5);
      rootRef.current.rotation.set(0, Math.PI + hipWiggle * 0.3, 0);

      if (torsoRef.current) torsoRef.current.rotation.set(0, hipWiggle * 0.5, 0);
      if (headRef.current) headRef.current.rotation.set(-0.2, 0, Math.sin(danceTime * 6) * 0.2);

      // Raising arms high in celebratory victory pump!
      const pump = Math.sin(danceTime * 10);
      if (leftArmRef.current) leftArmRef.current.rotation.set(-2.4 + pump * 0.3, 0, 0.4);
      if (rightArmRef.current) rightArmRef.current.rotation.set(-2.4 - pump * 0.3, 0, -0.4);

      if (leftLegRef.current) leftLegRef.current.rotation.set(Math.sin(danceTime * 6) * 0.3, 0, 0.2);
      if (rightLegRef.current) rightLegRef.current.rotation.set(-Math.sin(danceTime * 6) * 0.3, 0, -0.2);

      // Champagne sprays in victory!
      if (foamSprayRef.current) {
        foamSprayRef.current.visible = true;
        foamSprayRef.current.scale.setScalar(1.2 + Math.sin(danceTime * 12) * 0.4);
      }
    }
  });

  return (
    <group ref={rootRef} position={[-4.2, 0.45, 1.5]}>
      {/* ── 1. TORSO & HAWAIIAN SHIRT ── */}
      <group ref={torsoRef} position={[0, 0.4, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.34, 0.44, 0.22]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.6} /> {/* Bright yellow/amber Hawaiian party shirt */}
        </mesh>

        {/* Neck collar */}
        <mesh position={[0, 0.24, 0.05]} castShadow>
          <boxGeometry args={[0.16, 0.06, 0.12]} />
          <meshStandardMaterial color="#fbbf24" />
        </mesh>
      </group>

      {/* ── 2. HEAD WITH PARTY CAP & SUNGLASSES ── */}
      <group ref={headRef} position={[0, 0.72, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.13, 12, 12]} />
          <meshStandardMaterial color="#fbcfe8" roughness={0.4} /> {/* Human skin */}
        </mesh>

        {/* Party Cap / Visor */}
        <mesh position={[0, 0.09, 0.04]} rotation={[-0.2, 0, 0]} castShadow>
          <coneGeometry args={[0.14, 0.14, 10]} />
          <meshStandardMaterial color="#ec4899" roughness={0.3} />
        </mesh>

        {/* Cool Sunglasses */}
        <mesh position={[0, 0.02, 0.12]} castShadow>
          <boxGeometry args={[0.18, 0.05, 0.04]} />
          <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.9} />
        </mesh>
      </group>

      {/* ── 3. LEFT ARM ── */}
      <group ref={leftArmRef} position={[-0.22, 0.56, 0]}>
        <mesh position={[0, -0.16, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.32, 8]} />
          <meshStandardMaterial color="#fbcfe8" />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.34, 0]} castShadow>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="#fbcfe8" />
        </mesh>
      </group>

      {/* ── 4. RIGHT ARM & CHAMPAGNE BOTTLE ── */}
      <group ref={rightArmRef} position={[0.22, 0.56, 0]}>
        <mesh position={[0, -0.16, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.32, 8]} />
          <meshStandardMaterial color="#fbcfe8" />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.34, 0]} castShadow>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="#fbcfe8" />
        </mesh>

        {/* ── CHAMPAGNE BOTTLE (🍾) ── */}
        <group ref={bottleRef} position={[0, -0.34, 0.14]} rotation={[0.4, 0, 0]}>
          {/* Glass Bottle Body */}
          <mesh castShadow>
            <cylinderGeometry args={[0.04, 0.055, 0.26, 10]} />
            <meshStandardMaterial color="#14532d" roughness={0.15} metalness={0.7} />
          </mesh>
          {/* Golden Neck & Foil */}
          <mesh position={[0, 0.16, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.022, 0.09, 8]} />
            <meshStandardMaterial color="#eab308" roughness={0.2} metalness={0.9} />
          </mesh>
          {/* Cork */}
          <mesh position={[0, 0.22, 0]} castShadow>
            <cylinderGeometry args={[0.016, 0.016, 0.04, 6]} />
            <meshStandardMaterial color="#b45309" roughness={0.8} />
          </mesh>

          {/* Fizzy Champagne Foam Spray Particles */}
          <group ref={foamSprayRef} position={[0, 0.32, 0]} visible={false}>
            {[
              [0, 0.05, 0, 0.05],
              [0.03, 0.12, 0.02, 0.04],
              [-0.03, 0.16, -0.02, 0.045],
              [0.02, 0.24, 0.01, 0.035],
            ].map(([fx, fy, fz, fr], fIdx) => (
              <mesh key={`foam-${fIdx}`} position={[fx, fy, fz]}>
                <sphereGeometry args={[fr, 8, 8]} />
                <meshStandardMaterial color="#ffffff" emissive="#fef08a" emissiveIntensity={0.5} roughness={0.1} />
              </mesh>
            ))}
          </group>
        </group>
      </group>

      {/* ── 5. LEGS & SNEAKERS ── */}
      {/* Left Leg */}
      <group ref={leftLegRef} position={[-0.1, 0.18, 0]}>
        {/* Shorts */}
        <mesh position={[0, 0.05, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.07, 0.16, 8]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>
        {/* Leg */}
        <mesh position={[0, -0.15, 0]} castShadow>
          <cylinderGeometry args={[0.045, 0.045, 0.24, 8]} />
          <meshStandardMaterial color="#fbcfe8" />
        </mesh>
        {/* White Sneaker */}
        <mesh position={[0, -0.28, 0.04]} castShadow>
          <boxGeometry args={[0.09, 0.07, 0.18]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>
      </group>

      {/* Right Leg */}
      <group ref={rightLegRef} position={[0.1, 0.18, 0]}>
        {/* Shorts */}
        <mesh position={[0, 0.05, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.07, 0.16, 8]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>
        {/* Leg */}
        <mesh position={[0, -0.15, 0]} castShadow>
          <cylinderGeometry args={[0.045, 0.045, 0.24, 8]} />
          <meshStandardMaterial color="#fbcfe8" />
        </mesh>
        {/* White Sneaker */}
        <mesh position={[0, -0.28, 0.04]} castShadow>
          <boxGeometry args={[0.09, 0.07, 0.18]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
};
