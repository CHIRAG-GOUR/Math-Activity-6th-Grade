// ============================================================
// THE GREAT CARNIVAL OF CHANCE — Grand Carnival Finale 3D Arena
// Grand Championship Arena & Mystery Prize Vault:
// - Octagonal Championship Stage with Team Blue & Team Red Victory Pillars
// - Heavy Steel & Brass Victorian Carnival Prize Vault
// - Mechanical Revolving Combination Lock Dial & Heavy Swinging Vault Door
// - Motorized Golden Velvet Platter Gliding Forward Revealing Prize Tokens
// - Victory Spotlights, Laser Radiance, and Confetti Sparks
// ============================================================

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCarnivalStore } from '../../store/carnivalStore';
import { carnivalAudio } from '../../audio/CarnivalAudioManager';

export const GrandCarnivalMachine3D: React.FC = () => {
  const phase = useCarnivalStore((s) => s.phase);
  const blueTeam = useCarnivalStore((s) => s.blueTeam);
  const redTeam = useCarnivalStore((s) => s.redTeam);

  const vaultDoorRef = useRef<THREE.Group>(null);
  const dialRef = useRef<THREE.Group>(null);
  const trayRef = useRef<THREE.Group>(null);
  const trophyRef = useRef<THREE.Group>(null);
  const radianceRef = useRef<THREE.Group>(null);

  const isRoundCorrect = blueTeam.isCorrect === true || redTeam.isCorrect === true;
  const audioTriggeredRef = useRef<{ unlock: boolean; open: boolean }>({ unlock: false, open: false });

  useFrame((state, delta) => {
    const tClock = state.clock.getElapsedTime();

    // Top Championship Trophy gentle float
    if (trophyRef.current) {
      trophyRef.current.rotation.y += delta * 0.8;
      trophyRef.current.position.y = 4.4 + Math.sin(tClock * 2) * 0.08;
    }

    if (radianceRef.current) {
      radianceRef.current.rotation.z += delta * 1.0;
    }

    if (phase === 'operating') {
      const cycle = 2.4;
      const t = Math.min((tClock * 1.0) % (cycle + 0.6), cycle);
      const progress = t / cycle;

      // ── 1. COMBINATION DIAL SPIN ──
      if (dialRef.current) {
        if (progress < 0.35) {
          dialRef.current.rotation.z += delta * 25;
          if (!audioTriggeredRef.current.unlock) {
            carnivalAudio.playVaultUnlock();
            audioTriggeredRef.current.unlock = true;
          }
        } else {
          dialRef.current.rotation.z = THREE.MathUtils.lerp(dialRef.current.rotation.z, 0, delta * 8);
        }
      }

      // ── 2. VAULT DOOR OPENING DYNAMICS ──
      if (vaultDoorRef.current) {
        if (progress >= 0.35 && progress < 0.75) {
          const p = (progress - 0.35) / 0.4;
          const easeOut = 1 - Math.pow(1 - p, 2.5);
          vaultDoorRef.current.rotation.y = easeOut * -2.2; // Swings open wide

          if (p >= 0.1 && !audioTriggeredRef.current.open) {
            carnivalAudio.playVaultOpen();
            audioTriggeredRef.current.open = true;
          }
        } else if (progress >= 0.75) {
          vaultDoorRef.current.rotation.y = -2.2;
        } else {
          vaultDoorRef.current.rotation.y = 0;
        }
      }

      // ── 3. PRIZE TRAY GLIDING FORWARD ──
      if (trayRef.current) {
        if (progress >= 0.5) {
          const p = Math.min(1, (progress - 0.5) / 0.4);
          const easeOut = 1 - Math.pow(1 - p, 2);
          trayRef.current.position.z = THREE.MathUtils.lerp(0.1, 0.95, easeOut);
        } else {
          trayRef.current.position.z = 0.1;
        }
      }
    } else if (phase === 'observation' || phase === 'batch-trials' || phase === 'completed') {
      // Keep vault open on observation
      if (vaultDoorRef.current) vaultDoorRef.current.rotation.y = -2.2;
      if (trayRef.current) trayRef.current.position.z = 0.95;
    } else {
      // Idle closed state
      audioTriggeredRef.current.unlock = false;
      audioTriggeredRef.current.open = false;
      if (vaultDoorRef.current) vaultDoorRef.current.rotation.y = 0;
      if (trayRef.current) trayRef.current.position.z = 0.1;
      if (dialRef.current) dialRef.current.rotation.z += delta * 0.5;
    }
  });

  return (
    <group position={[0, -0.6, 0]}>
      {/* ── Victory Spotlights ── */}
      <spotLight
        position={[-4, 9, 5]}
        target-position={[0, 2.2, 0]}
        intensity={2.8}
        angle={0.55}
        penumbra={0.4}
        color="#38bdf8"
        castShadow
      />
      <spotLight
        position={[4, 9, 5]}
        target-position={[0, 2.2, 0]}
        intensity={2.8}
        angle={0.55}
        penumbra={0.4}
        color="#f43f5e"
        castShadow
      />

      {/* ── Octagonal Championship Stage Podium Base ── */}
      <group position={[0, 0.15, 0]}>
        <mesh receiveShadow castShadow>
          <cylinderGeometry args={[3.8, 4.2, 0.3, 8]} />
          <meshStandardMaterial color="#78350f" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.18, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[3.5, 3.8, 0.12, 8]} />
          <meshStandardMaterial color="#92400e" roughness={0.6} />
        </mesh>
        {/* Red Velvet Inner Carpet */}
        <mesh position={[0, 0.25, 0]} receiveShadow>
          <cylinderGeometry args={[3.2, 3.2, 0.04, 32]} />
          <meshStandardMaterial color="#991b1b" roughness={0.8} />
        </mesh>
        {/* Gold Border Ring */}
        <mesh position={[0, 0.28, 0]}>
          <torusGeometry args={[3.2, 0.04, 12, 32]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} />
        </mesh>
      </group>

      {/* ── Left Team Blue Victory Pillar (`x = -2.6`) ── */}
      <group position={[-2.6, 1.8, 0]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.22, 0.26, 3.2, 16]} />
          <meshStandardMaterial color="#2563eb" roughness={0.4} metalness={0.2} />
        </mesh>
        {/* Brass Rings */}
        {[-1.2, 0, 1.2].map((y, i) => (
          <mesh key={`b-ring-${i}`} position={[0, y, 0]} castShadow>
            <torusGeometry args={[0.26, 0.03, 10, 20]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.95} />
          </mesh>
        ))}
        {/* Blue Crystal Beacon on Top */}
        <group position={[0, 1.8, 0]}>
          <mesh castShadow>
            <octahedronGeometry args={[0.24]} />
            <meshStandardMaterial color="#38bdf8" emissive="#2563eb" emissiveIntensity={0.8} />
          </mesh>
          <pointLight color="#38bdf8" intensity={0.6} distance={2.5} />
        </group>
      </group>

      {/* ── Right Team Red Victory Pillar (`x = +2.6`) ── */}
      <group position={[2.6, 1.8, 0]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.22, 0.26, 3.2, 16]} />
          <meshStandardMaterial color="#dc2626" roughness={0.4} metalness={0.2} />
        </mesh>
        {/* Brass Rings */}
        {[-1.2, 0, 1.2].map((y, i) => (
          <mesh key={`r-ring-${i}`} position={[0, y, 0]} castShadow>
            <torusGeometry args={[0.26, 0.03, 10, 20]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.95} />
          </mesh>
        ))}
        {/* Red Crystal Beacon on Top */}
        <group position={[0, 1.8, 0]}>
          <mesh castShadow>
            <octahedronGeometry args={[0.24]} />
            <meshStandardMaterial color="#fb7185" emissive="#dc2626" emissiveIntensity={0.8} />
          </mesh>
          <pointLight color="#f43f5e" intensity={0.6} distance={2.5} />
        </group>
      </group>

      {/* ═════════════════════════════════════════════════════════════
          CENTRAL CARNIVAL CHAMPIONSHIP PRIZE VAULT
          ═════════════════════════════════════════════════════════════ */}
      <group position={[0, 1.8, 0]}>
        {/* Vault Heavy Outer Steel Box Safe */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.6, 2.6, 1.8]} />
          <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.6} />
        </mesh>

        {/* Gold Border Corner Reinforcements */}
        <mesh position={[0, 0, 0.91]} castShadow>
          <boxGeometry args={[2.65, 0.1, 0.04]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} />
        </mesh>
        <mesh position={[0, 0, -0.91]} castShadow>
          <boxGeometry args={[2.65, 0.1, 0.04]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} />
        </mesh>

        {/* Vault Interior Hollow Cavity (Glowing Gold Interior) */}
        <mesh position={[0, 0, 0.1]}>
          <boxGeometry args={[2.1, 2.1, 1.4]} />
          <meshStandardMaterial color="#451a03" roughness={0.6} side={THREE.BackSide} />
        </mesh>
        <pointLight position={[0, 0.5, 0.2]} color="#fde047" intensity={1.2} distance={3} />

        {/* ── Motorized Gliding Velvet Platter with Prize Tokens ── */}
        <group ref={trayRef} position={[0, -0.55, 0.1]}>
          {/* Gold Platter Base */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.8, 0.1, 1.1]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.95} roughness={0.1} />
          </mesh>
          {/* Red Velvet Lining */}
          <mesh position={[0, 0.06, 0]}>
            <boxGeometry args={[1.7, 0.02, 1.0]} />
            <meshStandardMaterial color="#991b1b" roughness={0.8} />
          </mesh>

          {/* ── PRIZE TOKENS ON VELVET TRAY ── */}
          {/* 4 Gold Tokens */}
          {[-0.55, -0.2, 0.2, 0.55].map((x, i) => (
            <mesh key={`gold-tok-${i}`} position={[x, 0.14, -0.2]} castShadow>
              <cylinderGeometry args={[0.13, 0.13, 0.06, 16]} />
              <meshStandardMaterial color="#fbbf24" metalness={0.98} roughness={0.1} emissive="#f59e0b" emissiveIntensity={0.25} />
            </mesh>
          ))}

          {/* 3 Diamond Tokens */}
          {[-0.35, 0, 0.35].map((x, i) => (
            <mesh key={`diam-tok-${i}`} position={[x, 0.16, 0.1]} rotation={[0, Math.PI / 4, 0]} castShadow>
              <octahedronGeometry args={[0.12]} />
              <meshStandardMaterial color="#38bdf8" metalness={0.4} roughness={0.05} emissive="#0284c7" emissiveIntensity={0.5} />
            </mesh>
          ))}

          {/* 4 Silver Tokens */}
          {[-0.55, -0.2, 0.2, 0.55].map((x, i) => (
            <mesh key={`silv-tok-${i}`} position={[x, 0.12, 0.35]} castShadow>
              <cylinderGeometry args={[0.11, 0.11, 0.05, 16]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.92} roughness={0.2} />
            </mesh>
          ))}
        </group>

        {/* ── VAULT DOOR HINGED ON LEFT (`x = -1.1, z = 0.92`) ── */}
        <group position={[-1.15, 0, 0.92]}>
          <group ref={vaultDoorRef}>
            {/* Main Round Heavy Steel Door */}
            <mesh position={[1.15, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[1.05, 1.05, 0.16, 32]} />
              <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.25} />
            </mesh>

            {/* Heavy Brass Door Outer Bezel */}
            <mesh position={[1.15, 0, 0.08]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[1.02, 0.08, 12, 32]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.95} />
            </mesh>

            {/* 8 Steel Locking Spoke Bolts Radiating Outward */}
            {Array.from({ length: 8 }).map((_, i) => (
              <mesh
                key={`bolt-${i}`}
                position={[1.15, 0, 0.04]}
                rotation={[0, 0, (i * Math.PI) / 4]}
                castShadow
              >
                <boxGeometry args={[0.1, 2.1, 0.06]} />
                <meshStandardMaterial color="#d97706" metalness={0.9} />
              </mesh>
            ))}

            {/* Central Combination Lock Dial Wheel */}
            <group ref={dialRef} position={[1.15, 0, 0.14]}>
              <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
                <cylinderGeometry args={[0.38, 0.38, 0.12, 24]} />
                <meshStandardMaterial color="#f59e0b" metalness={0.98} roughness={0.1} />
              </mesh>
              {/* Combination Dial Spokes / Turning Wheel */}
              {[0, Math.PI / 3, (2 * Math.PI) / 3].map((ang, i) => (
                <mesh key={`dial-spoke-${i}`} rotation={[0, 0, ang]}>
                  <boxGeometry args={[0.06, 0.9, 0.06]} />
                  <meshStandardMaterial color="#fef08a" metalness={0.95} />
                </mesh>
              ))}
              <mesh position={[0, 0, 0.08]} castShadow>
                <sphereGeometry args={[0.12, 16, 16]} />
                <meshStandardMaterial color="#fbbf24" metalness={0.98} />
              </mesh>
            </group>
          </group>
        </group>

        {/* ── Top Championship Marquee Sign & Golden Cup ── */}
        <group position={[0, 1.8, 0]}>
          <mesh castShadow>
            <boxGeometry args={[3.2, 0.55, 0.14]} />
            <meshStandardMaterial color="#b91c1c" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0, 0.08]}>
            <boxGeometry args={[3.0, 0.42, 0.02]} />
            <meshStandardMaterial color="#fef08a" metalness={0.9} />
          </mesh>
        </group>
      </group>

      {/* ── Floating Top Championship Trophy with Radiance (`y = 4.4`) ── */}
      <group ref={trophyRef} position={[0, 4.4, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.42, 0.18, 0.65, 20]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.98} roughness={0.08} />
        </mesh>
        <mesh position={[0, 0.35, 0]} castShadow>
          <torusGeometry args={[0.45, 0.06, 12, 24]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.98} />
        </mesh>
        {/* Left & Right Handles */}
        {[-0.45, 0.45].map((hx, i) => (
          <mesh key={`h-${i}`} position={[hx, 0.1, 0]} rotation={[0, 0, i === 0 ? 0.3 : -0.3]}>
            <torusGeometry args={[0.18, 0.04, 10, 20, Math.PI * 1.2]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.95} />
          </mesh>
        ))}

        {/* Rotating Golden Star Radiance Behind Trophy */}
        <group ref={radianceRef} position={[0, 0, -0.3]}>
          {Array.from({ length: 8 }).map((_, i) => (
            <mesh key={i} rotation={[0, 0, (i * Math.PI) / 4]}>
              <boxGeometry args={[0.04, 1.8, 0.02]} />
              <meshStandardMaterial color="#fde047" emissive="#f59e0b" emissiveIntensity={0.6} transparent opacity={0.75} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
};
