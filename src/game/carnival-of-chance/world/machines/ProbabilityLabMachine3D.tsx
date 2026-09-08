// ============================================================
// THE GREAT CARNIVAL OF CHANCE — Probability Lab 3D Physical Machine
// Steampunk Science Apparatus & Kinetic Chemical Centrifuge:
// - Central Glass Spherical Reaction Vessel with Swirling Catalyst Core
// - Left & Right Calibrated Measuring Cylinders with Dynamic Liquid Pumping
// - Copper Distillation Condenser Coils & Active Plasma Lightning Conduits
// - Dynamic Catalyst Crystal Forging Animation on Correct Answer
// - Steam Venting & Pressure Release on Incorrect Answer
// ============================================================

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCarnivalStore } from '../../store/carnivalStore';
import { carnivalAudio } from '../../audio/CarnivalAudioManager';

export const ProbabilityLabMachine3D: React.FC = () => {
  const phase = useCarnivalStore((s) => s.phase);
  const blueTeam = useCarnivalStore((s) => s.blueTeam);
  const redTeam = useCarnivalStore((s) => s.redTeam);

  const mixerRef = useRef<THREE.Group>(null);
  const leftLiquidRef = useRef<THREE.Mesh>(null);
  const rightLiquidRef = useRef<THREE.Mesh>(null);
  const crystalRef = useRef<THREE.Mesh>(null);
  const laserBeamRef = useRef<THREE.Group>(null);
  const gaugeNeedleRef = useRef<THREE.Mesh>(null);

  const isRoundCorrect = blueTeam.isCorrect === true || redTeam.isCorrect === true;
  const audioTriggeredRef = useRef(false);

  useFrame((state, delta) => {
    const tClock = state.clock.getElapsedTime();

    if (phase === 'operating') {
      if (!audioTriggeredRef.current) {
        carnivalAudio.playLabReaction();
        audioTriggeredRef.current = true;
      }

      // ── High Speed Centrifuge Vortex ──
      if (mixerRef.current) {
        mixerRef.current.rotation.y += delta * 12;
        mixerRef.current.rotation.x += delta * 4;
      }

      // ── Dynamic Liquid Pumping & Boiling ──
      if (leftLiquidRef.current) {
        const boil = Math.sin(tClock * 15) * 0.12;
        leftLiquidRef.current.scale.y = 1.3 + boil;
      }
      if (rightLiquidRef.current) {
        const boil = Math.cos(tClock * 15) * 0.12;
        rightLiquidRef.current.scale.y = 1.3 + boil;
      }

      // ── Forging Glowing Crystal on Correct Answer ──
      if (crystalRef.current) {
        if (isRoundCorrect) {
          crystalRef.current.visible = true;
          crystalRef.current.position.y = 0.2 + Math.sin(tClock * 4) * 0.15;
          crystalRef.current.rotation.y += delta * 6;
          crystalRef.current.rotation.z += delta * 3;
          crystalRef.current.scale.setScalar(1.2 + Math.sin(tClock * 8) * 0.15);
        } else {
          crystalRef.current.visible = false;
        }
      }

      // ── Plasma Laser Conduits ──
      if (laserBeamRef.current) {
        laserBeamRef.current.visible = true;
        laserBeamRef.current.rotation.z += delta * 8;
      }

      // ── Pressure Gauge Needle Sweep ──
      if (gaugeNeedleRef.current) {
        gaugeNeedleRef.current.rotation.z = isRoundCorrect
          ? THREE.MathUtils.lerp(gaugeNeedleRef.current.rotation.z, -1.2, delta * 6)
          : THREE.MathUtils.lerp(gaugeNeedleRef.current.rotation.z, 1.2, delta * 6);
      }
    } else if (phase === 'observation' || phase === 'batch-trials' || phase === 'completed') {
      if (crystalRef.current) {
        crystalRef.current.visible = isRoundCorrect;
        crystalRef.current.rotation.y += delta * 2;
      }
      if (laserBeamRef.current) laserBeamRef.current.visible = false;
    } else {
      audioTriggeredRef.current = false;
      // Idle state
      if (mixerRef.current) {
        mixerRef.current.rotation.y += delta * 0.8;
      }
      if (leftLiquidRef.current) {
        const wobble = Math.sin(tClock * 3) * 0.04;
        leftLiquidRef.current.scale.y = 1 + wobble;
      }
      if (rightLiquidRef.current) {
        const wobble = Math.cos(tClock * 3) * 0.04;
        rightLiquidRef.current.scale.y = 1 + wobble;
      }
      if (crystalRef.current) crystalRef.current.visible = false;
      if (laserBeamRef.current) laserBeamRef.current.visible = false;
      if (gaugeNeedleRef.current) gaugeNeedleRef.current.rotation.z = 0;
    }
  });

  return (
    <group position={[0, -0.6, 0]}>
      {/* ── Studio Lighting ── */}
      <spotLight
        position={[0, 9, 5]}
        target-position={[0, 2.2, 0]}
        intensity={2.8}
        angle={0.65}
        penumbra={0.5}
        color="#f5f3ff"
        castShadow
      />

      {/* ── Heavy Stone & Mahogany Lab Table Base ── */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[5.2, 0.5, 2.6]} />
        <meshStandardMaterial color="#1e293b" roughness={0.6} />
      </mesh>
      {/* Brass Table Rim */}
      <mesh position={[0, 0.52, 0]} castShadow receiveShadow>
        <boxGeometry args={[5.4, 0.08, 2.8]} />
        <meshStandardMaterial color="#ca8a04" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Table Legs with Brass Ferrules */}
      {[
        [-2.4, -0.15, -1.1],
        [2.4, -0.15, -1.1],
        [-2.4, -0.15, 1.1],
        [2.4, -0.15, 1.1],
      ].map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.1, 0.12, 0.8, 12]} />
            <meshStandardMaterial color="#0f172a" roughness={0.7} />
          </mesh>
          <mesh position={[0, -0.3, 0]} castShadow>
            <cylinderGeometry args={[0.13, 0.13, 0.2, 12]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.9} />
          </mesh>
        </group>
      ))}

      {/* ═════════════════════════════════════════════════════════════
          CENTRAL GLASS SPHERICAL REACTION FLASK & CENTRIFUGE
          ═════════════════════════════════════════════════════════════ */}
      <group position={[0, 2.3, 0]}>
        {/* Brass Ring Support Base */}
        <mesh position={[0, -1.1, 0]} castShadow>
          <cylinderGeometry args={[0.85, 0.95, 0.35, 24]} />
          <meshStandardMaterial color="#ca8a04" metalness={0.85} roughness={0.2} />
        </mesh>
        {/* Tripod Legs */}
        {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((ang, i) => (
          <mesh
            key={i}
            position={[Math.cos(ang) * 0.75, -1.4, Math.sin(ang) * 0.75]}
            rotation={[0, -ang, 0.2]}
            castShadow
          >
            <cylinderGeometry args={[0.05, 0.05, 0.8, 8]} />
            <meshStandardMaterial color="#78350f" metalness={0.7} />
          </mesh>
        ))}

        {/* Clear Glass Spherical Flask */}
        <mesh>
          <sphereGeometry args={[1.35, 36, 36]} />
          <meshPhysicalMaterial
            color="#f8fafc"
            transmission={0.92}
            transparent
            opacity={1}
            roughness={0.04}
            ior={1.48}
          />
        </mesh>

        {/* Flask Top Brass Neck & Valve */}
        <mesh position={[0, 1.4, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.45, 0.5, 20]} />
          <meshStandardMaterial color="#d97706" metalness={0.85} roughness={0.2} />
        </mesh>
        <mesh position={[0, 1.7, 0]} castShadow>
          <torusGeometry args={[0.35, 0.06, 12, 24]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} />
        </mesh>

        {/* Swirling Probability Compounds Inside Flask */}
        <group ref={mixerRef}>
          {[-0.5, 0, 0.5].map((x, i) => (
            <mesh key={`b-${i}`} position={[x, Math.sin(i * 2.2) * 0.4, Math.cos(i * 2.2) * 0.4]} castShadow>
              <sphereGeometry args={[0.22, 20, 20]} />
              <meshStandardMaterial
                color="#2563eb"
                roughness={0.2}
                metalness={0.2}
                emissive="#2563eb"
                emissiveIntensity={0.5}
              />
            </mesh>
          ))}
          {[-0.35, 0.35].map((x, i) => (
            <mesh key={`r-${i}`} position={[x, Math.cos(i * 2.2) * 0.4, Math.sin(i * 2.2) * 0.4]} castShadow>
              <sphereGeometry args={[0.22, 20, 20]} />
              <meshStandardMaterial
                color="#dc2626"
                roughness={0.2}
                metalness={0.2}
                emissive="#dc2626"
                emissiveIntensity={0.5}
              />
            </mesh>
          ))}
          {/* Gold Catalyst Core */}
          <mesh position={[0, 0, 0]} castShadow>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshStandardMaterial
              color="#f59e0b"
              metalness={0.95}
              emissive="#f59e0b"
              emissiveIntensity={0.6}
            />
          </mesh>
        </group>

        {/* ── FORGED GLOWING CRYSTAL CATALYST ON CORRECT ANSWER ── */}
        <mesh ref={crystalRef} position={[0, 0.2, 0]} castShadow>
          <octahedronGeometry args={[0.32]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#f59e0b"
            emissiveIntensity={1.2}
            metalness={0.8}
            roughness={0.1}
          />
        </mesh>

        {/* ── PLASMA LASER ENERGY CONDUITS ── */}
        <group ref={laserBeamRef}>
          {[-1, 1].map((dir, i) => (
            <mesh key={`laser-${i}`} position={[dir * 0.8, 0.6, 0]} rotation={[0, 0, dir * 0.6]}>
              <cylinderGeometry args={[0.02, 0.02, 1.2, 8]} />
              <meshBasicMaterial color="#38bdf8" />
            </mesh>
          ))}
        </group>
      </group>

      {/* ═════════════════════════════════════════════════════════════
          CALIBRATED MEASURING CYLINDERS (Left & Right)
          ═════════════════════════════════════════════════════════════ */}
      {/* Left Red Fraction Tube */}
      <group position={[-1.9, 2.0, 0]}>
        {/* Brass Base Mount */}
        <mesh position={[0, -1.2, 0]} castShadow>
          <cylinderGeometry args={[0.45, 0.55, 0.25, 20]} />
          <meshStandardMaterial color="#ca8a04" metalness={0.8} />
        </mesh>
        {/* Outer Glass Tube */}
        <mesh>
          <cylinderGeometry args={[0.34, 0.34, 2.4, 24]} />
          <meshPhysicalMaterial color="#e0f2fe" transmission={0.92} transparent opacity={1} roughness={0.06} />
        </mesh>
        {/* Glowing Red Liquid */}
        <mesh ref={leftLiquidRef} position={[0, -0.4, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 1.2, 20]} />
          <meshStandardMaterial color="#dc2626" roughness={0.2} emissive="#dc2626" emissiveIntensity={0.5} />
        </mesh>
        {/* Brass Graduation Markings */}
        {[-0.8, -0.4, 0, 0.4, 0.8].map((y, i) => (
          <mesh key={i} position={[0, y, 0]}>
            <torusGeometry args={[0.35, 0.015, 8, 24]} />
            <meshStandardMaterial color="#fef08a" metalness={0.9} />
          </mesh>
        ))}
      </group>

      {/* Right Blue Fraction Tube */}
      <group position={[1.9, 2.0, 0]}>
        {/* Brass Base Mount */}
        <mesh position={[0, -1.2, 0]} castShadow>
          <cylinderGeometry args={[0.45, 0.55, 0.25, 20]} />
          <meshStandardMaterial color="#ca8a04" metalness={0.8} />
        </mesh>
        {/* Outer Glass Tube */}
        <mesh>
          <cylinderGeometry args={[0.34, 0.34, 2.4, 24]} />
          <meshPhysicalMaterial color="#e0f2fe" transmission={0.92} transparent opacity={1} roughness={0.06} />
        </mesh>
        {/* Glowing Blue Liquid */}
        <mesh ref={rightLiquidRef} position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 1.8, 20]} />
          <meshStandardMaterial color="#2563eb" roughness={0.2} emissive="#2563eb" emissiveIntensity={0.5} />
        </mesh>
        {/* Brass Graduation Markings */}
        {[-0.8, -0.4, 0, 0.4, 0.8].map((y, i) => (
          <mesh key={i} position={[0, y, 0]}>
            <torusGeometry args={[0.35, 0.015, 8, 24]} />
            <meshStandardMaterial color="#fef08a" metalness={0.9} />
          </mesh>
        ))}
      </group>

      {/* ── Copper Distillation Condenser Coils Connecting Tubes ── */}
      <group position={[0, 3.4, 0]}>
        {/* Left arched copper pipe */}
        <mesh position={[-1.0, 0, 0]} rotation={[0, 0, 0.4]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 1.8, 12]} />
          <meshStandardMaterial color="#b45309" metalness={0.85} roughness={0.2} />
        </mesh>
        {/* Right arched copper pipe */}
        <mesh position={[1.0, 0, 0]} rotation={[0, 0, -0.4]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 1.8, 12]} />
          <meshStandardMaterial color="#b45309" metalness={0.85} roughness={0.2} />
        </mesh>
        {/* Pressure Gauge Dial */}
        <group position={[0, 0.2, 0.3]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.22, 0.22, 0.06, 20]} />
            <meshStandardMaterial color="#fef08a" metalness={0.9} />
          </mesh>
          <mesh position={[0, 0, 0.04]}>
            <circleGeometry args={[0.18, 20]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          {/* Gauge Needle */}
          <mesh ref={gaugeNeedleRef} position={[0, 0.05, 0.05]}>
            <boxGeometry args={[0.02, 0.12, 0.01]} />
            <meshStandardMaterial color="#dc2626" />
          </mesh>
        </group>
      </group>
    </group>
  );
};
