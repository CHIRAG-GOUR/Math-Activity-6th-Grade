// ============================================================
// THE GREAT CARNIVAL OF CHANCE — High Striker (Hammer Bell Tower) 3D Machine
// Authentic Carnival Strongman Sledgehammer & 15-Foot High Striker Tower:
// - Heavy Steel Strike Anvil & Kinetic Carnival Sledgehammer
// - Dramatic Windup & High-Impact Hammer Slam Animation
// - Weighted Golden Puck Rocketing Up Vertical Guide Rails
// - Graduated Power Scale & Sequential Blinking Light Bars
// - Top Championship Bell with Clapper Strike & Fireworks Sparks
// ============================================================

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCarnivalStore } from '../../store/carnivalStore';
import { carnivalAudio } from '../../audio/CarnivalAudioManager';

export const HighStrikerMachine3D: React.FC = () => {
  const phase = useCarnivalStore((s) => s.phase);
  const activeChallenge = useCarnivalStore((s) => s.activeChallenge);
  const blueTeam = useCarnivalStore((s) => s.blueTeam);
  const redTeam = useCarnivalStore((s) => s.redTeam);

  const hammerRef = useRef<THREE.Group>(null);
  const puckRef = useRef<THREE.Mesh>(null);
  const bellRef = useRef<THREE.Group>(null);
  const sparkParticlesRef = useRef<THREE.Points>(null);

  const isRoundCorrect = blueTeam.isCorrect === true || redTeam.isCorrect === true;
  const audioPlayedRef = useRef<{ strike: boolean; bell: boolean }>({ strike: false, bell: false });

  // Spark particles for bell hit
  const sparkGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const count = 30;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const rad = 0.2 + Math.random() * 0.8;
      positions[i * 3] = Math.cos(theta) * rad;
      positions[i * 3 + 1] = Math.sin(theta) * rad;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame((state, delta) => {
    const tClock = state.clock.getElapsedTime();

    if (phase === 'operating') {
      const cycle = 2.2; // 2.2s strike and ascend sequence
      const t = Math.min((tClock * 1.1) % (cycle + 0.6), cycle);
      const progress = t / cycle;

      // ── 1. SLEDGEHAMMER WINDUP & SLAM DYNAMICS ──
      if (hammerRef.current) {
        if (progress < 0.25) {
          // Windup: lifts backward and tilts back
          const p = progress / 0.25;
          hammerRef.current.position.set(0.7, 1.4 + p * 0.9, 0.9);
          hammerRef.current.rotation.set(-0.4 - p * 0.9, 0, 0.2);
        } else if (progress < 0.38) {
          // SLAM DOWN: Explosive acceleration onto anvil
          const p = (progress - 0.25) / 0.13;
          const easeIn = p * p * p;
          hammerRef.current.position.set(
            THREE.MathUtils.lerp(0.7, 0, easeIn),
            THREE.MathUtils.lerp(2.3, 0.45, easeIn),
            THREE.MathUtils.lerp(0.9, 0.75, easeIn)
          );
          hammerRef.current.rotation.set(
            THREE.MathUtils.lerp(-1.3, 0.4, easeIn),
            0,
            THREE.MathUtils.lerp(0.2, 0, easeIn)
          );

          // Trigger strike audio exactly on impact
          if (p >= 0.85 && !audioPlayedRef.current.strike) {
            carnivalAudio.playHammerStrike();
            audioPlayedRef.current.strike = true;
          }
        } else {
          // Recoil bounce and rest on the ground
          const p = (progress - 0.38) / 0.62;
          const bounce = Math.sin(p * Math.PI * 3) * Math.exp(-p * 4) * 0.15;
          hammerRef.current.position.set(0, 0.45 + Math.max(0, bounce), 0.75);
          hammerRef.current.rotation.set(0.35, 0, 0);
        }
      }

      // ── 2. WEIGHTED STRIKER PUCK ROCKETING UP TOWER ──
      if (puckRef.current) {
        if (progress < 0.38) {
          // Resting on striker pad before hammer hit
          puckRef.current.position.set(0, 0.5, 0.32);
        } else {
          const shootProgress = (progress - 0.38) / 0.62;

          if (isRoundCorrect) {
            // WIN: Rockets all the way to top bell (y = 5.3)
            if (shootProgress < 0.5) {
              const p = shootProgress / 0.5;
              const easeOut = 1 - Math.pow(1 - p, 2.5);
              const y = THREE.MathUtils.lerp(0.5, 5.3, easeOut);
              puckRef.current.position.set(0, y, 0.32);

              if (p >= 0.9 && !audioPlayedRef.current.bell) {
                carnivalAudio.playHighStrikerBell();
                audioPlayedRef.current.bell = true;
              }
            } else {
              // Vibrates at top against the bell
              const p = (shootProgress - 0.5) / 0.5;
              const vibration = Math.sin(p * Math.PI * 8) * Math.exp(-p * 3) * 0.08;
              puckRef.current.position.set(0, 5.3 - vibration, 0.32);
            }
          } else {
            // MISS: Rises only to ~35% height and falls back down
            if (shootProgress < 0.4) {
              const p = shootProgress / 0.4;
              const easeOut = 1 - Math.pow(1 - p, 2);
              const y = THREE.MathUtils.lerp(0.5, 2.4, easeOut);
              puckRef.current.position.set(0, y, 0.32);
            } else {
              const p = (shootProgress - 0.4) / 0.6;
              const easeIn = p * p;
              const y = THREE.MathUtils.lerp(2.4, 0.5, easeIn);
              puckRef.current.position.set(0, y, 0.32);
            }
          }
        }
      }

      // ── 3. TOP BELL & SPARKS VIBRATION ──
      if (bellRef.current && isRoundCorrect && progress > 0.65) {
        const p = (progress - 0.65) / 0.35;
        bellRef.current.rotation.z = Math.sin(p * Math.PI * 12) * Math.exp(-p * 3) * 0.25;
      }

      if (sparkParticlesRef.current) {
        sparkParticlesRef.current.visible = isRoundCorrect && progress > 0.65 && progress < 0.95;
        sparkParticlesRef.current.rotation.z += delta * 5;
      }
    } else {
      // Reset audio triggers
      audioPlayedRef.current.strike = false;
      audioPlayedRef.current.bell = false;

      // Idle state
      if (hammerRef.current) {
        const breath = Math.sin(tClock * 2) * 0.04;
        hammerRef.current.position.set(0.8, 1.2 + breath, 0.8);
        hammerRef.current.rotation.set(-0.35, 0, 0.15);
      }
      if (puckRef.current) {
        puckRef.current.position.set(0, 0.5, 0.32);
      }
      if (bellRef.current) {
        bellRef.current.rotation.z = 0;
      }
      if (sparkParticlesRef.current) {
        sparkParticlesRef.current.visible = false;
      }
    }
  });

  const towerHeight = 5.2;
  const numLightRungs = 12;

  return (
    <group position={[0, -0.6, 0]}>
      {/* ── Studio Spotlights ── */}
      <spotLight
        position={[0, 8, 6]}
        target-position={[0, 2.8, 0]}
        intensity={2.8}
        angle={0.6}
        penumbra={0.4}
        color="#fffbeb"
        castShadow
      />

      {/* ── Heavy Stepped Base Platform ── */}
      <group position={[0, 0.15, 0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[4.2, 0.3, 2.8]} />
          <meshStandardMaterial color="#78350f" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.18, 0]} receiveShadow castShadow>
          <boxGeometry args={[3.8, 0.12, 2.4]} />
          <meshStandardMaterial color="#92400e" roughness={0.6} />
        </mesh>
        {/* Brass Base Trim */}
        <mesh position={[0, 0.25, 0]}>
          <boxGeometry args={[3.85, 0.04, 2.45]} />
          <meshStandardMaterial color="#ca8a04" metalness={0.9} />
        </mesh>
      </group>

      {/* ── Anvil Strike Pad & Lever Pivot Mechanism (`z = 0.75`) ── */}
      <group position={[0, 0.35, 0.75]}>
        {/* Steel Anvil Block */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.42, 0.48, 0.3, 24]} />
          <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.25} />
        </mesh>
        {/* Rubber Strike Pad */}
        <mesh position={[0, 0.16, 0]} castShadow>
          <cylinderGeometry args={[0.38, 0.38, 0.08, 24]} />
          <meshStandardMaterial color="#dc2626" roughness={0.5} />
        </mesh>
        {/* Gold Anvil Rim */}
        <mesh position={[0, 0.15, 0]}>
          <torusGeometry args={[0.4, 0.03, 12, 24]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.95} />
        </mesh>
      </group>

      {/* ═════════════════════════════════════════════════════════════
          KINETIC CARNIVAL SLEDGEHAMMER
          ═════════════════════════════════════════════════════════════ */}
      <group ref={hammerRef} position={[0.8, 1.2, 0.8]}>
        {/* Wooden Handle */}
        <mesh position={[0, 0.7, 0]} castShadow>
          <cylinderGeometry args={[0.045, 0.055, 1.5, 16]} />
          <meshStandardMaterial color="#78350f" roughness={0.6} />
        </mesh>
        {/* Leather Grip Wrappings */}
        {[-0.4, -0.2, 0, 0.2].map((y, i) => (
          <mesh key={`grip-${i}`} position={[0, 0.7 + y, 0]}>
            <torusGeometry args={[0.052, 0.015, 8, 16]} />
            <meshStandardMaterial color="#451a03" roughness={0.8} />
          </mesh>
        ))}
        {/* Brass Ferrule Sleeve */}
        <mesh position={[0, 1.42, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.07, 0.18, 16]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} />
        </mesh>
        {/* Heavy Iron & Gold Sledge Head */}
        <group position={[0, 1.52, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.36, 0.26, 0.44]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Left & Right Brass Strike Plates */}
          {[-0.23, 0.23].map((z, i) => (
            <mesh key={`plate-${i}`} position={[0, 0, z]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.12, 0.12, 0.06, 16]} />
              <meshStandardMaterial color="#fbbf24" metalness={0.95} />
            </mesh>
          ))}
        </group>
      </group>

      {/* ═════════════════════════════════════════════════════════════
          15-FOOT ILLUMINATED HIGH STRIKER TOWER
          ═════════════════════════════════════════════════════════════ */}
      <group position={[0, 0, 0.2]}>
        {/* Main Vertical Tower Mast (Crimson Red with Gold Trim) */}
        <mesh position={[0, 2.8, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.2, towerHeight, 0.24]} />
          <meshStandardMaterial color="#b91c1c" roughness={0.4} />
        </mesh>
        {/* Face Track Plate (Navy with Neon Graduations) */}
        <mesh position={[0, 2.8, 0.13]} receiveShadow>
          <planeGeometry args={[0.9, towerHeight - 0.2]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.1} />
        </mesh>

        {/* Outer Gold Border Framing */}
        {[-0.58, 0.58].map((x, i) => (
          <mesh key={`mast-border-${i}`} position={[x, 2.8, 0.14]} castShadow>
            <boxGeometry args={[0.08, towerHeight, 0.1]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.9} />
          </mesh>
        ))}

        {/* ── Sequential Carnival Power Level Light Rungs ── */}
        {Array.from({ length: numLightRungs }).map((_, i) => {
          const y = 0.8 + (i / (numLightRungs - 1)) * 4.0;
          const isTopTier = i >= numLightRungs - 3;
          const rungColor = isTopTier ? '#fde047' : i % 2 === 0 ? '#00f0a8' : '#ff2a6d';
          return (
            <group key={`rung-${i}`} position={[0, y, 0.16]}>
              {/* Center Graduation Bar */}
              <mesh>
                <boxGeometry args={[0.65, 0.06, 0.04]} />
                <meshStandardMaterial
                  color={rungColor}
                  emissive={rungColor}
                  emissiveIntensity={0.6}
                />
              </mesh>
              {/* Left & Right Indicator Bulbs */}
              {[-0.42, 0.42].map((bx, j) => (
                <mesh key={`b-${j}`} position={[bx, 0, 0.02]}>
                  <sphereGeometry args={[0.05, 10, 10]} />
                  <meshStandardMaterial
                    color={rungColor}
                    emissive={rungColor}
                    emissiveIntensity={0.9}
                  />
                </mesh>
              ))}
            </group>
          );
        })}

        {/* ── Vertical Steel Guide Rail Wires ── */}
        {[-0.15, 0.15].map((gx, i) => (
          <mesh key={`rail-${i}`} position={[gx, 2.8, 0.22]}>
            <cylinderGeometry args={[0.015, 0.015, towerHeight - 0.2, 8]} />
            <meshStandardMaterial color="#ffffff" metalness={0.95} />
          </mesh>
        ))}

        {/* ── WEIGHTED GOLDEN STRIKER PUCK ── */}
        <mesh ref={puckRef} position={[0, 0.5, 0.32]} castShadow>
          <cylinderGeometry args={[0.26, 0.26, 0.16, 24]} />
          <meshStandardMaterial
            color="#fbbf24"
            metalness={0.95}
            roughness={0.1}
            emissive="#f59e0b"
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* ═════════════════════════════════════════════════════════════
            TOP CHAMPIONSHIP GOLDEN BELL & MARQUEE ARCH
            ═════════════════════════════════════════════════════════════ */}
        <group position={[0, 5.4, 0]}>
          {/* Top Marquee Header Board */}
          <mesh position={[0, 0.35, -0.05]} castShadow>
            <boxGeometry args={[2.4, 0.55, 0.16]} />
            <meshStandardMaterial color="#b91c1c" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.35, 0.04]}>
            <boxGeometry args={[2.2, 0.42, 0.02]} />
            <meshStandardMaterial color="#fef08a" metalness={0.85} />
          </mesh>

          {/* Golden Championship Bell Housing & Bell */}
          <group ref={bellRef} position={[0, 0, 0.25]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.38, 0.65, 0.65, 24]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.98} roughness={0.08} />
            </mesh>
            {/* Bell Crown Loop */}
            <mesh position={[0, 0.38, 0]}>
              <torusGeometry args={[0.12, 0.04, 12, 20]} />
              <meshStandardMaterial color="#fbbf24" metalness={0.95} />
            </mesh>
            {/* Internal Clapper Ball */}
            <mesh position={[0, -0.28, 0]} castShadow>
              <sphereGeometry args={[0.1, 12, 12]} />
              <meshStandardMaterial color="#ca8a04" metalness={0.9} />
            </mesh>
          </group>

          {/* Bell Hit Victory Spark Particles */}
          <points ref={sparkParticlesRef} position={[0, 0, 0.5]}>
            <primitive object={sparkGeo} />
            <pointsMaterial size={0.08} color="#fef08a" transparent opacity={0.9} />
          </points>
        </group>
      </group>
    </group>
  );
};
