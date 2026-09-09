// ============================================================
// THE GREAT CARNIVAL OF CHANCE — Grand Carnival Dart Arena 3D Machine
// Authentic Carnival Dartboard, Precision Dual-Color Darts & Parabolic Flight Physics:
// - Tournament Dartboard with Double/Triple Rings & Inner Bullseye Target
// - Dual Team Darts (Team Blue Sapphire & Team Red Ruby)
// - Realistic Throwing Windup, Aerodynamic Parabolic Arc & Cork Impact Vibration
// - Correct Answer strikes BULLSEYE with Chimes & Sparks; Wrong Answer misses
// ============================================================

import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCarnivalStore } from '../../store/carnivalStore';
import { carnivalAudio } from '../../audio/CarnivalAudioManager';

// Helper: 3D Precision Dart Component
const CarnivalDart3D: React.FC<{
  team: 'blue' | 'red';
}> = ({ team }) => {
  const isBlue = team === 'blue';
  const shaftColor = isBlue ? '#2563eb' : '#dc2626';
  const flightColor = isBlue ? '#38bdf8' : '#fb7185';

  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      {/* 1. Steel Needle Point Tip */}
      <mesh position={[0, -0.45, 0]} castShadow>
        <coneGeometry args={[0.018, 0.22, 12]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.98} roughness={0.15} />
      </mesh>

      {/* 2. Heavy Brass Knurled Barrel */}
      <mesh position={[0, -0.24, 0]} castShadow>
        <cylinderGeometry args={[0.045, 0.045, 0.24, 16]} />
        <meshStandardMaterial color="#d97706" metalness={0.95} roughness={0.25} />
      </mesh>
      {/* Grip Rings */}
      {[-0.3, -0.25, -0.2, -0.15].map((y, i) => (
        <mesh key={`ring-${i}`} position={[0, y, 0]}>
          <torusGeometry args={[0.047, 0.008, 8, 16]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.98} />
        </mesh>
      ))}

      {/* 3. Colored Aluminum Shaft */}
      <mesh position={[0, -0.04, 0]} castShadow>
        <cylinderGeometry args={[0.024, 0.024, 0.18, 12]} />
        <meshStandardMaterial color={shaftColor} metalness={0.8} roughness={0.3} />
      </mesh>

      {/* 4. 4-Fin Cross Aerodynamic Flights */}
      <group position={[0, 0.15, 0]}>
        {/* Fin 1 & 2 (X-axis) */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.26, 0.22, 0.006]} />
          <meshStandardMaterial color={flightColor} roughness={0.4} />
        </mesh>
        {/* Fin 3 & 4 (Z-axis) */}
        <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[0.26, 0.22, 0.006]} />
          <meshStandardMaterial color={flightColor} roughness={0.4} />
        </mesh>
        {/* Gold Trim Cap */}
        <mesh position={[0, 0.12, 0]}>
          <coneGeometry args={[0.03, 0.05, 8]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.95} />
        </mesh>
      </group>
    </group>
  );
};

export const GrandCarnivalMachine3D: React.FC = () => {
  const phase = useCarnivalStore((s) => s.phase);
  const blueTeam = useCarnivalStore((s) => s.blueTeam);
  const redTeam = useCarnivalStore((s) => s.redTeam);

  const blueDartRef = useRef<THREE.Group>(null);
  const redDartRef = useRef<THREE.Group>(null);
  const bullseyeSparkRef = useRef<THREE.Points>(null);
  const opStartTimeRef = useRef<number | null>(null);
  const prevPhaseRef = useRef<string>(phase);

  const audioTriggersRef = useRef<{
    blueWhoosh: boolean;
    blueHit: boolean;
    redWhoosh: boolean;
    redHit: boolean;
  }>({
    blueWhoosh: false,
    blueHit: false,
    redWhoosh: false,
    redHit: false,
  });

  const isBlueCorrect = blueTeam.isCorrect === true;
  const isRedCorrect = redTeam.isCorrect === true;

  // Generate Procedural High-Res Tournament Dartboard Canvas Texture
  const dartboardTexture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const cx = 512;
    const cy = 512;
    const rOuter = 460;
    const rDoubleOut = 390;
    const rDoubleIn = 360;
    const rTripleOut = 240;
    const rTripleIn = 210;
    const rOuterBull = 60;
    const rInnerBull = 25;

    // Background Black Outer Ring
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(cx, cy, rOuter, 0, Math.PI * 2);
    ctx.fill();

    // 20 Radial Sectors
    const numSectors = 20;
    const sectorAngle = (Math.PI * 2) / numSectors;
    const numbers = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];

    for (let i = 0; i < numSectors; i++) {
      const startAngle = i * sectorAngle - Math.PI / 2 - sectorAngle / 2;
      const endAngle = startAngle + sectorAngle;
      const isEven = i % 2 === 0;

      // 1. Single Main Wedges (Cream & Black)
      ctx.fillStyle = isEven ? '#1e293b' : '#fffbeb';
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, rDoubleOut, startAngle, endAngle);
      ctx.closePath();
      ctx.fill();

      // 2. Double Outer Ring (Green & Red)
      ctx.fillStyle = isEven ? '#dc2626' : '#16a34a';
      ctx.beginPath();
      ctx.arc(cx, cy, rDoubleOut, startAngle, endAngle);
      ctx.arc(cx, cy, rDoubleIn, endAngle, startAngle, true);
      ctx.closePath();
      ctx.fill();

      // 3. Triple Inner Ring (Green & Red)
      ctx.fillStyle = isEven ? '#dc2626' : '#16a34a';
      ctx.beginPath();
      ctx.arc(cx, cy, rTripleOut, startAngle, endAngle);
      ctx.arc(cx, cy, rTripleIn, endAngle, startAngle, true);
      ctx.closePath();
      ctx.fill();

      // 4. Sector Numbers on Outer Ring
      ctx.save();
      ctx.translate(cx, cy);
      const textAngle = i * sectorAngle - Math.PI / 2;
      ctx.rotate(textAngle + Math.PI / 2);
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 38px "Inter", "Arial", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(numbers[i]), 0, -425);
      ctx.restore();
    }

    // Outer Bullseye Ring (Green - 25 PTS)
    ctx.fillStyle = '#16a34a';
    ctx.beginPath();
    ctx.arc(cx, cy, rOuterBull, 0, Math.PI * 2);
    ctx.fill();

    // Inner Bullseye (Vibrant Red - 50 PTS / JACKPOT)
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(cx, cy, rInnerBull, 0, Math.PI * 2);
    ctx.fill();

    // Wire Spider Radial & Circular Lines (Metallic Silver)
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 3;

    [rDoubleOut, rDoubleIn, rTripleOut, rTripleIn, rOuterBull, rInnerBull].forEach((r) => {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    });

    for (let i = 0; i < numSectors; i++) {
      const angle = i * sectorAngle - Math.PI / 2 - sectorAngle / 2;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * rOuterBull, cy + Math.sin(angle) * rOuterBull);
      ctx.lineTo(cx + Math.cos(angle) * rDoubleOut, cy + Math.sin(angle) * rDoubleOut);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 8;
    return tex;
  }, []);

  // Bullseye Fireworks Sparks Particle Geometry
  const sparkGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const count = 40;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const rad = 0.15 + Math.random() * 0.85;
      positions[i * 3] = Math.cos(theta) * rad;
      positions[i * 3 + 1] = Math.sin(theta) * rad;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame((state, delta) => {
    const tClock = state.clock.getElapsedTime();

    // Detect phase transition to 'operating'
    if (phase === 'operating' && prevPhaseRef.current !== 'operating') {
      opStartTimeRef.current = tClock;
      audioTriggersRef.current = {
        blueWhoosh: false,
        blueHit: false,
        redWhoosh: false,
        redHit: false,
      };
    }
    prevPhaseRef.current = phase;

    if (phase === 'operating' && opStartTimeRef.current !== null) {
      const elapsed = tClock - opStartTimeRef.current;
      const totalDuration = 2.4;
      const progress = Math.min(elapsed / totalDuration, 1.0);

      // ═════════════════════════════════════════════════════════════
      // 1. TEAM BLUE DART THROW (Launches in 0.0s - 1.2s)
      // ═════════════════════════════════════════════════════════════
      if (blueDartRef.current) {
        if (progress < 0.1) {
          // Windup: pulls back slightly at throw line
          const p = progress / 0.1;
          blueDartRef.current.position.set(-1.2, 1.8 + p * 0.15, 3.8 + p * 0.2);
          blueDartRef.current.rotation.set(0.1, 0.15, -0.05);
        } else if (progress < 0.5) {
          // Flight Arc: Parabolic curve to board
          const p = (progress - 0.1) / 0.4;
          const easeIn = p * p;

          if (p >= 0.15 && !audioTriggersRef.current.blueWhoosh) {
            carnivalAudio.playDartWhoosh();
            audioTriggersRef.current.blueWhoosh = true;
          }

          // Target endpoint: Bullseye or Miss
          const targetX = isBlueCorrect ? -0.08 : -1.25;
          const targetY = isBlueCorrect ? 2.45 : 1.35;
          const arcY = Math.sin(p * Math.PI) * 0.45;

          const currX = THREE.MathUtils.lerp(-1.2, targetX, p);
          const currY = THREE.MathUtils.lerp(1.95, targetY, p) + arcY;
          const currZ = THREE.MathUtils.lerp(4.0, 0.14, p);

          blueDartRef.current.position.set(currX, currY, currZ);

          // Flight pitch angle (aims along trajectory tangent)
          const pitch = (1 - p) * 0.2 - p * 0.1;
          blueDartRef.current.rotation.set(pitch, 0.1 * (1 - p), 0);
        } else {
          // Impact: Sticked in board with vibration decay
          const p = (progress - 0.5) / 0.5;
          const targetX = isBlueCorrect ? -0.08 : -1.25;
          const targetY = isBlueCorrect ? 2.45 : 1.35;

          if (!audioTriggersRef.current.blueHit) {
            if (isBlueCorrect) {
              carnivalAudio.playDartHit();
              carnivalAudio.playBullseyeChime();
            } else {
              carnivalAudio.playDartMiss();
            }
            audioTriggersRef.current.blueHit = true;
          }

          // High-frequency cork stick vibration
          const vib = Math.sin(p * Math.PI * 14) * Math.exp(-p * 6) * 0.05;
          blueDartRef.current.position.set(targetX, targetY, 0.14);
          blueDartRef.current.rotation.set(vib, vib * 0.5, 0);
        }
      }

      // ═════════════════════════════════════════════════════════════
      // 2. TEAM RED DART THROW (Launches in 0.3s - 1.5s)
      // ═════════════════════════════════════════════════════════════
      if (redDartRef.current) {
        if (progress < 0.25) {
          // Windup: pulls back slightly at throw line
          const p = progress / 0.25;
          redDartRef.current.position.set(1.2, 1.8 + p * 0.15, 3.8 + p * 0.2);
          redDartRef.current.rotation.set(0.1, -0.15, 0.05);
        } else if (progress < 0.65) {
          // Flight Arc: Parabolic curve to board
          const p = (progress - 0.25) / 0.4;

          if (p >= 0.15 && !audioTriggersRef.current.redWhoosh) {
            carnivalAudio.playDartWhoosh();
            audioTriggersRef.current.redWhoosh = true;
          }

          const targetX = isRedCorrect ? 0.08 : 1.25;
          const targetY = isRedCorrect ? 2.45 : 1.35;
          const arcY = Math.sin(p * Math.PI) * 0.45;

          const currX = THREE.MathUtils.lerp(1.2, targetX, p);
          const currY = THREE.MathUtils.lerp(1.95, targetY, p) + arcY;
          const currZ = THREE.MathUtils.lerp(4.0, 0.14, p);

          redDartRef.current.position.set(currX, currY, currZ);

          const pitch = (1 - p) * 0.2 - p * 0.1;
          redDartRef.current.rotation.set(pitch, -0.1 * (1 - p), 0);
        } else {
          // Impact: Sticked in board with vibration decay
          const p = (progress - 0.65) / 0.35;
          const targetX = isRedCorrect ? 0.08 : 1.25;
          const targetY = isRedCorrect ? 2.45 : 1.35;

          if (!audioTriggersRef.current.redHit) {
            if (isRedCorrect) {
              carnivalAudio.playDartHit();
              carnivalAudio.playBullseyeChime();
            } else {
              carnivalAudio.playDartMiss();
            }
            audioTriggersRef.current.redHit = true;
          }

          const vib = Math.sin(p * Math.PI * 14) * Math.exp(-p * 6) * 0.05;
          redDartRef.current.position.set(targetX, targetY, 0.14);
          redDartRef.current.rotation.set(vib, -vib * 0.5, 0);
        }
      }

      // ── 3. BULLSEYE SPARKS & GLOW ON HIT ──
      if (bullseyeSparkRef.current) {
        const anyBullseye = isBlueCorrect || isRedCorrect;
        bullseyeSparkRef.current.visible = anyBullseye && progress > 0.45 && progress < 0.95;
        bullseyeSparkRef.current.rotation.z += delta * 4;
      }
    } else {
      // Reset audio trigger flags
      audioTriggersRef.current.blueWhoosh = false;
      audioTriggersRef.current.blueHit = false;
      audioTriggersRef.current.redWhoosh = false;
      audioTriggersRef.current.redHit = false;

      if (phase === 'observation') {
        // Lodged in board showing outcome
        if (blueDartRef.current) {
          const targetX = isBlueCorrect ? -0.08 : -1.25;
          const targetY = isBlueCorrect ? 2.45 : 1.35;
          blueDartRef.current.position.set(targetX, targetY, 0.14);
          blueDartRef.current.rotation.set(0, 0, 0);
        }
        if (redDartRef.current) {
          const targetX = isRedCorrect ? 0.08 : 1.25;
          const targetY = isRedCorrect ? 2.45 : 1.35;
          redDartRef.current.position.set(targetX, targetY, 0.14);
          redDartRef.current.rotation.set(0, 0, 0);
        }
      } else {
        // Idle at Throw Line Podiums
        if (blueDartRef.current) {
          const hover = Math.sin(tClock * 2.2) * 0.05;
          blueDartRef.current.position.set(-1.3, 1.6 + hover, 3.4);
          blueDartRef.current.rotation.set(0.1, 0.15, -0.05);
        }
        if (redDartRef.current) {
          const hover = Math.sin(tClock * 2.2 + 1) * 0.05;
          redDartRef.current.position.set(1.3, 1.6 + hover, 3.4);
          redDartRef.current.rotation.set(0.1, -0.15, 0.05);
        }
      }

      if (bullseyeSparkRef.current) {
        bullseyeSparkRef.current.visible = false;
      }
    }
  });

  return (
    <group position={[0, -0.4, 0]}>
      {/* ── Studio Spotlights ── */}
      <spotLight
        position={[0, 7, 6]}
        target-position={[0, 2.4, 0]}
        intensity={3.0}
        angle={0.7}
        penumbra={0.3}
        color="#fffbeb"
        castShadow
      />
      <pointLight position={[-2.5, 3.5, 2]} intensity={1.2} color="#60a5fa" />
      <pointLight position={[2.5, 3.5, 2]} intensity={1.2} color="#f87171" />

      {/* ═════════════════════════════════════════════════════════════
          CARNIVAL DART ARENA STAGE & TIMBER BACKDROP
          ═════════════════════════════════════════════════════════════ */}
      {/* Heavy Wooden Base Podium */}
      <group position={[0, 0.12, 1.5]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[4.8, 0.24, 4.2]} />
          <meshStandardMaterial color="#78350f" roughness={0.7} />
        </mesh>
        {/* Brass Stage Border */}
        <mesh position={[0, 0.13, 0]}>
          <boxGeometry args={[4.85, 0.04, 4.25]} />
          <meshStandardMaterial color="#ca8a04" metalness={0.9} />
        </mesh>
      </group>

      {/* Wooden Carnival Wall & Target Surround (`z = 0`) */}
      <group position={[0, 2.4, -0.05]}>
        {/* Main Timber Plank Back Wall */}
        <mesh receiveShadow castShadow>
          <boxGeometry args={[4.2, 4.2, 0.16]} />
          <meshStandardMaterial color="#92400e" roughness={0.8} />
        </mesh>

        {/* Outer Red & Yellow Carnival Marquee Bezel */}
        <mesh position={[0, 0, 0.09]}>
          <boxGeometry args={[3.8, 3.8, 0.04]} />
          <meshStandardMaterial color="#b91c1c" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0, 0.11]}>
          <boxGeometry args={[3.6, 3.6, 0.02]} />
          <meshStandardMaterial color="#fef08a" metalness={0.85} />
        </mesh>

        {/* 16 Chasing Carnival Bulbs Around Frame */}
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i / 16) * Math.PI * 2;
          const bx = Math.cos(angle) * 1.7;
          const by = Math.sin(angle) * 1.7;
          const bulbColor = i % 2 === 0 ? '#fde047' : '#ff2a6d';
          return (
            <mesh key={`bulb-${i}`} position={[bx, by, 0.13]}>
              <sphereGeometry args={[0.06, 12, 12]} />
              <meshStandardMaterial
                color={bulbColor}
                emissive={bulbColor}
                emissiveIntensity={0.8}
              />
            </mesh>
          );
        })}
      </group>

      {/* ═════════════════════════════════════════════════════════════
          TOURNAMENT REGULATION DARTBOARD (`center = [0, 2.45, 0.08]`)
          ═════════════════════════════════════════════════════════════ */}
      <group position={[0, 2.45, 0.08]}>
        {/* Round Heavy Cork/Sisal Board Backing */}
        <mesh castShadow receiveShadow rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[1.35, 1.35, 0.08, 36]} />
          <meshStandardMaterial color="#0f172a" roughness={0.9} />
        </mesh>

        {/* Dartboard Canvas Texture Face */}
        {dartboardTexture && (
          <mesh position={[0, 0, 0.045]}>
            <circleGeometry args={[1.34, 36]} />
            <meshBasicMaterial map={dartboardTexture} toneMapped={false} />
          </mesh>
        )}


        {/* Golden Bullseye Fireworks Sparks */}
        <points ref={bullseyeSparkRef} position={[0, 0, 0.18]} geometry={sparkGeo}>
          <pointsMaterial size={0.12} color="#fbbf24" transparent opacity={0.9} />
        </points>
      </group>

      {/* ═════════════════════════════════════════════════════════════
          THROWING STANDS & PLAYER PODIUMS (`z = 3.6`)
          ═════════════════════════════════════════════════════════════ */}
      {/* Team Blue Podium & Throw Marker (Left) */}
      <group position={[-1.3, 0.35, 3.4]}>
        <mesh receiveShadow castShadow>
          <cylinderGeometry args={[0.45, 0.52, 0.3, 24]} />
          <meshStandardMaterial color="#1e3a8a" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.16, 0]}>
          <cylinderGeometry args={[0.42, 0.42, 0.02, 24]} />
          <meshStandardMaterial color="#3b82f6" emissive="#1d4ed8" emissiveIntensity={0.5} />
        </mesh>
      </group>

      {/* Team Red Podium & Throw Marker (Right) */}
      <group position={[1.3, 0.35, 3.4]}>
        <mesh receiveShadow castShadow>
          <cylinderGeometry args={[0.45, 0.52, 0.3, 24]} />
          <meshStandardMaterial color="#881337" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.16, 0]}>
          <cylinderGeometry args={[0.42, 0.42, 0.02, 24]} />
          <meshStandardMaterial color="#ef4444" emissive="#b91c1c" emissiveIntensity={0.5} />
        </mesh>
      </group>

      {/* ═════════════════════════════════════════════════════════════
          DYNAMIC TEAM BLUE & TEAM RED 3D DARTS
          ═════════════════════════════════════════════════════════════ */}
      <group ref={blueDartRef} position={[-1.3, 1.6, 3.4]}>
        <CarnivalDart3D team="blue" />
      </group>

      <group ref={redDartRef} position={[1.3, 1.6, 3.4]}>
        <CarnivalDart3D team="red" />
      </group>
    </group>
  );
};
