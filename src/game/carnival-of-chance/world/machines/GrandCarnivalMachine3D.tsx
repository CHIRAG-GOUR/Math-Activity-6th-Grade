// ============================================================
// THE GREAT CARNIVAL OF CHANCE — Grand Carnival Finale 3D Physical Machine
// Championship Carousel Arena, rotating golden Corinthian rotunda,
// floating Grand Master Trophy cup with victory radiance, and fireworks
// ============================================================

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const GrandCarnivalMachine3D: React.FC = () => {
  const carouselRef = useRef<THREE.Group>(null);
  const trophyRef = useRef<THREE.Group>(null);
  const radianceRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (carouselRef.current) {
      carouselRef.current.rotation.y += delta * 0.8;
    }
    if (trophyRef.current) {
      trophyRef.current.rotation.y += delta * 1.5;
      trophyRef.current.position.y = 2.7 + Math.sin(state.clock.getElapsedTime() * 2) * 0.15;
    }
    if (radianceRef.current) {
      radianceRef.current.rotation.z += delta * 1.2;
    }
  });

  return (
    <group position={[0, -0.6, 0]}>
      {/* ── Victory Spotlights ── */}
      <spotLight
        position={[-4, 10, 4]}
        target-position={[0, 2.5, 0]}
        intensity={3.0}
        angle={0.5}
        penumbra={0.5}
        color="#38bdf8"
        castShadow
      />
      <spotLight
        position={[4, 10, 4]}
        target-position={[0, 2.5, 0]}
        intensity={3.0}
        angle={0.5}
        penumbra={0.5}
        color="#f87171"
        castShadow
      />

      {/* ── Grand Multi-Tier Rotunda Base ── */}
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[3.6, 4.0, 0.4, 36]} />
        <meshStandardMaterial color="#854d0e" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[3.2, 3.5, 0.15, 36]} />
        <meshStandardMaterial color="#fef08a" metalness={0.7} roughness={0.25} />
      </mesh>
      {/* Red Velvet Inner Ring */}
      <mesh position={[0, 0.54, 0]} receiveShadow>
        <cylinderGeometry args={[2.8, 3.0, 0.05, 36]} />
        <meshStandardMaterial color="#991b1b" roughness={0.7} />
      </mesh>

      {/* ── 4 Fluted Golden Columns ── */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((ang, i) => (
        <group key={i} position={[Math.cos(ang) * 2.6, 2.3, Math.sin(ang) * 2.6]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.1, 0.1, 3.6, 16]} />
            <meshStandardMaterial color="#ca8a04" metalness={0.88} roughness={0.15} />
          </mesh>
          {[-1.7, 1.7].map((y, j) => (
            <mesh key={j} position={[0, y, 0]} castShadow>
              <cylinderGeometry args={[0.16, 0.16, 0.14, 16]} />
              <meshStandardMaterial color="#fef08a" metalness={0.95} />
            </mesh>
          ))}
        </group>
      ))}

      {/* ── Rotating Scalloped Carousel Roof ── */}
      <group ref={carouselRef} position={[0, 4.3, 0]}>
        <mesh castShadow>
          <coneGeometry args={[3.3, 1.8, 20]} />
          <meshStandardMaterial color="#dc2626" roughness={0.4} />
        </mesh>
        {/* Scalloped Valance Pendants */}
        {Array.from({ length: 20 }).map((_, i) => (
          <mesh
            key={i}
            position={[
              Math.cos((i * Math.PI) / 10) * 3.25,
              -0.2,
              Math.sin((i * Math.PI) / 10) * 3.25,
            ]}
            castShadow
          >
            <boxGeometry args={[0.26, 0.35, 0.08]} />
            <meshStandardMaterial color={i % 2 === 0 ? '#fbbf24' : '#ffffff'} />
          </mesh>
        ))}
        {/* Gold Spire Dome Top */}
        <mesh position={[0, 1.2, 0]} castShadow>
          <sphereGeometry args={[0.35, 20, 20]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.95} roughness={0.1} />
        </mesh>
      </group>

      {/* ═════════════════════════════════════════════════════════════
          FLOATING GRAND MASTER TROPHY CUP WITH GOLDEN RADIANCE
          ═════════════════════════════════════════════════════════════ */}
      <group ref={trophyRef} position={[0, 2.7, 0]}>
        {/* Trophy Goblet Body */}
        <mesh castShadow>
          <cylinderGeometry args={[0.55, 0.26, 0.8, 24]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.98} roughness={0.08} />
        </mesh>
        {/* Golden Crown Lip */}
        <mesh position={[0, 0.42, 0]} castShadow>
          <torusGeometry args={[0.58, 0.08, 16, 32]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.98} roughness={0.05} />
        </mesh>
        {/* Left Curved Handle */}
        <mesh position={[-0.6, 0.15, 0]} rotation={[0, 0, 0.35]} castShadow>
          <torusGeometry args={[0.22, 0.05, 12, 24, Math.PI * 1.2]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.95} />
        </mesh>
        {/* Right Curved Handle */}
        <mesh position={[0.6, 0.15, 0]} rotation={[0, 0, -0.35]} castShadow>
          <torusGeometry args={[0.22, 0.05, 12, 24, Math.PI * 1.2]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.95} />
        </mesh>
        {/* Stem */}
        <mesh position={[0, -0.45, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.18, 0.3, 16]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.95} />
        </mesh>
        {/* Pedestal Base */}
        <mesh position={[0, -0.7, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.42, 0.55, 0.25, 20]} />
          <meshStandardMaterial color="#1e293b" roughness={0.4} />
        </mesh>
        {/* Brass Inscription Plaque */}
        <mesh position={[0, -0.7, 0.45]} castShadow>
          <boxGeometry args={[0.35, 0.14, 0.02]} />
          <meshStandardMaterial color="#fef08a" metalness={0.9} />
        </mesh>

        {/* Rotating Golden Star Radiance Behind Trophy */}
        <group ref={radianceRef} position={[0, 0.2, -0.4]}>
          {Array.from({ length: 8 }).map((_, i) => (
            <mesh key={i} rotation={[0, 0, (i * Math.PI) / 4]}>
              <boxGeometry args={[0.06, 2.2, 0.02]} />
              <meshStandardMaterial
                color="#fef08a"
                emissive="#f59e0b"
                emissiveIntensity={0.6}
                transparent
                opacity={0.7}
              />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
};
