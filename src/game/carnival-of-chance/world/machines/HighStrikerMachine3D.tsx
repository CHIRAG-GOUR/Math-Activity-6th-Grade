// ============================================================
// THE GREAT CARNIVAL OF CHANCE — High Striker (Hammer Bell Tower) 3D Machine
// Authentic Carnival Strongman Sledgehammer & 15-Foot High Striker Tower:
// - Heavy Steel Strike Anvil & High-Impact Carnival Sledgehammer
// - Hard Windup & Explosive Hammer Slam onto Strike Pod Anvil
// - Green Puck (Correct Answer): Launches upon hammer strike, rockets up to top bell,
//   rings bell with fireworks sparks, and smoothly falls back down green under gravity
// - Red Puck (Wrong Answer): Launches upon hammer strike, rises to ~30% height,
//   and falls back down red under gravity with a clunk
// ============================================================

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCarnivalStore } from '../../store/carnivalStore';
import { carnivalAudio } from '../../audio/CarnivalAudioManager';

export const HighStrikerMachine3D: React.FC = () => {
  const phase = useCarnivalStore((s) => s.phase);
  const blueTeam = useCarnivalStore((s) => s.blueTeam);
  const redTeam = useCarnivalStore((s) => s.redTeam);

  const hammerRef = useRef<THREE.Group>(null);
  const strikePadRef = useRef<THREE.Mesh>(null);
  const puckRef = useRef<THREE.Mesh>(null);
  const puckMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const bellRef = useRef<THREE.Group>(null);
  const sparkParticlesRef = useRef<THREE.Points>(null);
  const rungMeshesRef = useRef<(THREE.MeshStandardMaterial | null)[]>([]);

  const isRoundCorrect = blueTeam.isCorrect === true || redTeam.isCorrect === true;

  // Track start time of 'operating' phase deterministically
  const opStartTimeRef = useRef<number | null>(null);
  const prevPhaseRef = useRef<string>(phase);

  // Frame-accurate sound triggers
  const audioTriggersRef = useRef<{
    whoosh: boolean;
    strike: boolean;
    ascend: boolean;
    bell: boolean;
    land: boolean;
    fail: boolean;
  }>({
    whoosh: false,
    strike: false,
    ascend: false,
    bell: false,
    land: false,
    fail: false,
  });

  // Spark particles for bell hit
  const sparkGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const count = 45;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const rad = 0.25 + Math.random() * 0.95;
      positions[i * 3] = Math.cos(theta) * rad;
      positions[i * 3 + 1] = Math.sin(theta) * rad;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.6;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  const numLightRungs = 12;
  const towerHeight = 5.2;

  useFrame((state, delta) => {
    const tClock = state.clock.getElapsedTime();

    // Detect phase transition to 'operating'
    if (phase === 'operating' && prevPhaseRef.current !== 'operating') {
      opStartTimeRef.current = tClock;
      audioTriggersRef.current = {
        whoosh: false,
        strike: false,
        ascend: false,
        bell: false,
        land: false,
        fail: false,
      };
    }
    prevPhaseRef.current = phase;

    if (phase === 'operating' && opStartTimeRef.current !== null) {
      const elapsed = tClock - opStartTimeRef.current;
      const totalDuration = 2.4;
      const t = Math.min(elapsed, totalDuration);

      // Current Puck Height tracker for dynamic LED rungs
      let currentPuckY = 0.52;

      // ═════════════════════════════════════════════════════════════
      // 1. SLEDGEHAMMER WINDUP & EXPLOSIVE STRIKE
      // ═════════════════════════════════════════════════════════════
      if (hammerRef.current) {
        if (t < 0.45) {
          // Windup: lifts backward, arches up high (t: 0.0s -> 0.45s)
          const p = t / 0.45;
          const easeOut = Math.sin((p * Math.PI) / 2);
          hammerRef.current.position.set(
            THREE.MathUtils.lerp(0.6, 0.4, easeOut),
            THREE.MathUtils.lerp(0.9, 2.3, easeOut),
            THREE.MathUtils.lerp(1.6, 2.2, easeOut)
          );
          hammerRef.current.rotation.set(
            THREE.MathUtils.lerp(-0.35, -1.35, easeOut),
            0,
            THREE.MathUtils.lerp(0.15, 0.25, easeOut)
          );
        } else if (t < 0.68) {
          // Downward Power Swing (t: 0.45s -> 0.68s)
          const p = (t - 0.45) / 0.23;
          const easeIn = p * p * p * p;

          if (p >= 0.15 && !audioTriggersRef.current.whoosh) {
            carnivalAudio.playHammerWhoosh();
            audioTriggersRef.current.whoosh = true;
          }

          hammerRef.current.position.set(
            THREE.MathUtils.lerp(0.4, 0.0, easeIn),
            THREE.MathUtils.lerp(2.3, 0.48, easeIn),
            THREE.MathUtils.lerp(2.2, 1.45, easeIn)
          );
          hammerRef.current.rotation.set(
            THREE.MathUtils.lerp(-1.35, 1.55, easeIn),
            0,
            THREE.MathUtils.lerp(0.25, 0.0, easeIn)
          );
        } else {
          // Post-Impact Recoil Bounce & Ground Rest (t: 0.68s -> 2.4s)
          const p = (t - 0.68) / (totalDuration - 0.68);

          // Impact sound exactly on hammer strike
          if (!audioTriggersRef.current.strike) {
            carnivalAudio.playHammerStrike();
            audioTriggersRef.current.strike = true;
          }

          // Damped spring bounce
          const bounce = Math.sin(p * Math.PI * 6) * Math.exp(-p * 6) * 0.12;
          hammerRef.current.position.set(0.0, 0.48 + Math.max(0, bounce), 1.45);
          hammerRef.current.rotation.set(1.55 - bounce * 0.5, 0, 0);
        }
      }

      // Strike Pad Compression Dip on Impact
      if (strikePadRef.current) {
        if (t >= 0.68 && t < 0.95) {
          const p = (t - 0.68) / 0.27;
          const dip = Math.sin(p * Math.PI) * 0.06;
          strikePadRef.current.position.y = 0.16 - dip;
          strikePadRef.current.scale.y = 1.0 - dip * 3;
        } else {
          strikePadRef.current.position.y = 0.16;
          strikePadRef.current.scale.y = 1.0;
        }
      }

      // ═════════════════════════════════════════════════════════════
      // 2. DYNAMIC PUCK TRAJECTORY: GREEN (CORRECT) OR RED (WRONG)
      // ═════════════════════════════════════════════════════════════
      if (puckRef.current && puckMatRef.current) {
        if (isRoundCorrect) {
          // ── GREEN PUCK (CORRECT / FULL STRENGTH) ──
          puckMatRef.current.color.set('#10b981');
          puckMatRef.current.emissive.set('#059669');
          puckMatRef.current.emissiveIntensity = 0.9;

          if (t < 0.68) {
            // Resting on strike pad before hammer strikes
            currentPuckY = 0.52;
          } else if (t < 1.35) {
            // Rocketing UP to top bell (y: 0.52 -> 5.30)
            const p = (t - 0.68) / 0.67;
            const easeOut = 1 - Math.pow(1 - p, 2.4);
            currentPuckY = THREE.MathUtils.lerp(0.52, 5.3, easeOut);

            if (p >= 0.1 && !audioTriggersRef.current.ascend) {
              carnivalAudio.playPuckAscend();
              audioTriggersRef.current.ascend = true;
            }
          } else if (t < 1.55) {
            // Striking Top Bell with Impact Vibration
            const p = (t - 1.35) / 0.2;
            const vib = Math.sin(p * Math.PI * 8) * Math.exp(-p * 4) * 0.06;
            currentPuckY = 5.3 - vib;

            if (!audioTriggersRef.current.bell) {
              carnivalAudio.playHighStrikerBell();
              carnivalAudio.playBullseyeChime();
              audioTriggersRef.current.bell = true;
            }
          } else {
            // Smoothly Falls BACK DOWN under gravity to bottom pod!
            const p = (t - 1.55) / (totalDuration - 1.55);
            const easeIn = p * p; // Accelerates downwards under gravity
            currentPuckY = THREE.MathUtils.lerp(5.3, 0.52, easeIn);

            if (p >= 0.95 && !audioTriggersRef.current.land) {
              carnivalAudio.playPuckFallThud();
              audioTriggersRef.current.land = true;
            }
          }
        } else {
          // ── RED PUCK (WRONG / PARTIAL STRENGTH) ──
          puckMatRef.current.color.set('#ef4444');
          puckMatRef.current.emissive.set('#dc2626');
          puckMatRef.current.emissiveIntensity = 0.9;

          if (t < 0.68) {
            // Resting on strike pad
            currentPuckY = 0.52;
          } else if (t < 1.15) {
            // Goes from DOWN to UP (rises to ~30% height: y = 2.0)
            const p = (t - 0.68) / 0.47;
            const easeOut = 1 - Math.pow(1 - p, 2);
            currentPuckY = THREE.MathUtils.lerp(0.52, 2.0, easeOut);
          } else if (t < 1.28) {
            // Stalls in mid-air at apex
            currentPuckY = 2.0;
          } else {
            // Falls BACK DOWN under gravity to the anvil pod!
            const p = (t - 1.28) / (totalDuration - 1.28);
            const easeIn = p * p;
            currentPuckY = THREE.MathUtils.lerp(2.0, 0.52, easeIn);

            if (p >= 0.85 && !audioTriggersRef.current.fail) {
              carnivalAudio.playPuckFallThud();
              carnivalAudio.playIncorrect();
              audioTriggersRef.current.fail = true;
            }
          }
        }

        puckRef.current.position.set(0, currentPuckY, 0.32);
      }

      // ═════════════════════════════════════════════════════════════
      // 3. DYNAMIC LED LIGHT RUNGS ON TOWER
      // ═════════════════════════════════════════════════════════════
      rungMeshesRef.current.forEach((mat, i) => {
        if (!mat) return;
        const rungY = 0.8 + (i / (numLightRungs - 1)) * 4.0;
        const isLit = currentPuckY >= rungY - 0.15;
        const isTopTier = i >= numLightRungs - 3;

        if (isLit) {
          if (isRoundCorrect) {
            const glowColor = isTopTier ? '#fde047' : '#10b981';
            mat.color.set(glowColor);
            mat.emissive.set(glowColor);
            mat.emissiveIntensity = 1.0;
          } else {
            mat.color.set('#ef4444');
            mat.emissive.set('#dc2626');
            mat.emissiveIntensity = 0.9;
          }
        } else {
          const defaultColor = isTopTier ? '#fde047' : i % 2 === 0 ? '#00f0a8' : '#ff2a6d';
          mat.color.set(defaultColor);
          mat.emissive.set(defaultColor);
          mat.emissiveIntensity = 0.2;
        }
      });

      // ═════════════════════════════════════════════════════════════
      // 4. TOP BELL & FIREWORKS SPARKS
      // ═════════════════════════════════════════════════════════════
      if (bellRef.current && isRoundCorrect && t >= 1.35 && t <= 1.95) {
        const p = (t - 1.35) / 0.6;
        bellRef.current.rotation.z = Math.sin(p * Math.PI * 10) * Math.exp(-p * 3) * 0.28;
      }

      if (sparkParticlesRef.current) {
        const showSparks = isRoundCorrect && t >= 1.35 && t <= 1.85;
        sparkParticlesRef.current.visible = showSparks;
        if (showSparks) {
          sparkParticlesRef.current.rotation.z += delta * 8;
        }
      }
    } else {
      // ── IDLE / OBSERVATION STATE ──
      if (puckMatRef.current) {
        if (phase === 'observation') {
          if (isRoundCorrect) {
            puckMatRef.current.color.set('#10b981');
            puckMatRef.current.emissive.set('#059669');
            puckMatRef.current.emissiveIntensity = 0.6;
          } else {
            puckMatRef.current.color.set('#ef4444');
            puckMatRef.current.emissive.set('#dc2626');
            puckMatRef.current.emissiveIntensity = 0.6;
          }
        } else {
          // Waiting gold glow
          puckMatRef.current.color.set('#fbbf24');
          puckMatRef.current.emissive.set('#f59e0b');
          puckMatRef.current.emissiveIntensity = 0.3;
        }
      }

      // Sledgehammer rests upright beside the striker pad
      if (hammerRef.current) {
        const breath = Math.sin(tClock * 2) * 0.03;
        hammerRef.current.position.set(0.6, 0.9 + breath, 1.6);
        hammerRef.current.rotation.set(-0.35, 0, 0.15);
      }

      if (puckRef.current) {
        puckRef.current.position.set(0, 0.52, 0.32);
      }

      if (strikePadRef.current) {
        strikePadRef.current.position.y = 0.16;
        strikePadRef.current.scale.y = 1.0;
      }

      if (bellRef.current) {
        bellRef.current.rotation.z = 0;
      }

      if (sparkParticlesRef.current) {
        sparkParticlesRef.current.visible = false;
      }

      // Reset rung light intensities
      rungMeshesRef.current.forEach((mat, i) => {
        if (!mat) return;
        const isTopTier = i >= numLightRungs - 3;
        const defaultColor = isTopTier ? '#fde047' : i % 2 === 0 ? '#00f0a8' : '#ff2a6d';
        mat.color.set(defaultColor);
        mat.emissive.set(defaultColor);
        mat.emissiveIntensity = 0.3;
      });
    }
  });

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
      <pointLight position={[-2.5, 3.5, 2]} intensity={1.2} color="#60a5fa" />
      <pointLight position={[2.5, 3.5, 2]} intensity={1.2} color="#f87171" />

      {/* ── Heavy Stepped Base Platform ── */}
      <group position={[0, 0.15, 0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[4.2, 0.3, 3.2]} />
          <meshStandardMaterial color="#78350f" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.18, 0]} receiveShadow castShadow>
          <boxGeometry args={[3.8, 0.12, 2.8]} />
          <meshStandardMaterial color="#92400e" roughness={0.6} />
        </mesh>
        {/* Brass Base Trim */}
        <mesh position={[0, 0.25, 0]}>
          <boxGeometry args={[3.85, 0.04, 2.85]} />
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
        {/* Rubber Strike Pad (Compresses on hammer hit) */}
        <mesh ref={strikePadRef} position={[0, 0.16, 0]} castShadow>
          <cylinderGeometry args={[0.38, 0.38, 0.08, 24]} />
          <meshStandardMaterial color="#dc2626" roughness={0.5} />
        </mesh>
        {/* Gold Anvil Rim */}
        <mesh position={[0, 0.15, 0]}>
          <torusGeometry args={[0.4, 0.03, 12, 24]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.95} />
        </mesh>
        {/* Lever arm to tower rail */}
        <mesh position={[0, 0.05, -0.32]} rotation={[0.15, 0, 0]}>
          <boxGeometry args={[0.15, 0.08, 0.5]} />
          <meshStandardMaterial color="#64748b" metalness={0.9} />
        </mesh>
      </group>

      {/* ═════════════════════════════════════════════════════════════
          KINETIC CARNIVAL SLEDGEHAMMER
          ═════════════════════════════════════════════════════════════ */}
      <group ref={hammerRef} position={[0.6, 0.9, 1.6]}>
        {/* Wooden Handle */}
        <mesh position={[0, -0.4, 0]} castShadow>
          <cylinderGeometry args={[0.042, 0.05, 1.4, 16]} />
          <meshStandardMaterial color="#78350f" roughness={0.6} />
        </mesh>
        {/* Leather Grip Wrappings */}
        {[-0.8, -0.6, -0.4, -0.2].map((y, i) => (
          <mesh key={`grip-${i}`} position={[0, y, 0]}>
            <cylinderGeometry args={[0.052, 0.052, 0.08, 16]} />
            <meshStandardMaterial color="#b45309" roughness={0.8} />
          </mesh>
        ))}
        {/* Brass Handle Collar */}
        <mesh position={[0, 0.22, 0]}>
          <cylinderGeometry args={[0.065, 0.065, 0.1, 16]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.95} />
        </mesh>

        {/* Heavy Iron & Gold Sledge Head (Strikes Anvil Pad) */}
        <group position={[0, 0.35, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.34, 0.24, 0.44]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Dual Brass Strike Caps */}
          {[-0.23, 0.23].map((z, i) => (
            <mesh key={`plate-${i}`} position={[0, 0, z]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.12, 0.12, 0.05, 16]} />
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
          <boxGeometry args={[1.1, towerHeight, 0.22]} />
          <meshStandardMaterial color="#991b1b" roughness={0.4} />
        </mesh>

        {/* Center Cream Faceplate Track */}
        <mesh position={[0, 2.8, 0.12]}>
          <boxGeometry args={[0.75, towerHeight - 0.2, 0.03]} />
          <meshStandardMaterial color="#fffbeb" roughness={0.5} />
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
                  ref={(el) => {
                    rungMeshesRef.current[i] = el;
                  }}
                  color={rungColor}
                  emissive={rungColor}
                  emissiveIntensity={0.3}
                />
              </mesh>
              {/* Left & Right Indicator Bulbs */}
              {[-0.42, 0.42].map((bx, j) => (
                <mesh key={`b-${j}`} position={[bx, 0, 0.02]}>
                  <sphereGeometry args={[0.05, 10, 10]} />
                  <meshStandardMaterial
                    color={rungColor}
                    emissive={rungColor}
                    emissiveIntensity={0.8}
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

        {/* ── WEIGHTED STRIKER PUCK / CHIP (DYNAMIC GREEN OR RED) ── */}
        <mesh ref={puckRef} position={[0, 0.52, 0.32]} castShadow>
          <cylinderGeometry args={[0.26, 0.26, 0.16, 24]} />
          <meshStandardMaterial
            ref={puckMatRef}
            color="#fbbf24"
            metalness={0.85}
            roughness={0.15}
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

          {/* Dynamic Fireworks Sparks on Bell Strike */}
          <points ref={sparkParticlesRef} position={[0, 0, 0.35]} geometry={sparkGeo}>
            <pointsMaterial size={0.12} color="#fbbf24" transparent opacity={0.9} />
          </points>
        </group>
      </group>
    </group>
  );
};

