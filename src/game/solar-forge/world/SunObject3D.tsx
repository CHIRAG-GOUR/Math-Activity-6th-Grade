// ============================================================
// THE SOLAR FORGE: Prominent Visible Earth Sun in Sky
// Brilliant daylight Sun: golden core, luminous corona flare,
// radial sunbeams, and dynamic trajectory across rounds
// ============================================================

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const SunObject3D: React.FC<{
  position: [number, number, number];
}> = ({ position }) => {
  const sunGroupRef = useRef<THREE.Group>(null);
  const coronaRef = useRef<THREE.Mesh>(null);
  const raysRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    if (sunGroupRef.current) {
      sunGroupRef.current.position.x = THREE.MathUtils.damp(sunGroupRef.current.position.x, position[0], 2.5, delta);
      sunGroupRef.current.position.y = THREE.MathUtils.damp(sunGroupRef.current.position.y, position[1], 2.5, delta);
      sunGroupRef.current.position.z = THREE.MathUtils.damp(sunGroupRef.current.position.z, position[2], 2.5, delta);
    }

    // Organic pulsing of solar corona
    if (coronaRef.current) {
      const scale = 1.0 + Math.sin(t * 2.0) * 0.06;
      coronaRef.current.scale.setScalar(scale);
    }

    // Slow rotation of soft radial sunbeams
    if (raysRef.current) {
      raysRef.current.rotation.z = t * 0.03;
    }
  });

  return (
    <group ref={sunGroupRef} position={position}>
      {/* ── 1. BRILLIANT CENTRAL SUN DISK ── */}
      <mesh>
        <sphereGeometry args={[9.5, 32, 32]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* ── 2. INTENSE INNER GOLDEN CORONA ── */}
      <mesh scale={[1.35, 1.35, 1.35]}>
        <sphereGeometry args={[9.5, 24, 24]} />
        <meshBasicMaterial
          color="#fef08a"
          transparent
          opacity={0.65}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* ── 3. WIDE ATMOSPHERIC SOLAR HALO ── */}
      <mesh ref={coronaRef} scale={[2.8, 2.8, 2.8]}>
        <sphereGeometry args={[9.5, 24, 24]} />
        <meshBasicMaterial
          color="#fde047"
          transparent
          opacity={0.3}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* ── 4. SOFT RADIAL SUNLIGHT RAYS ── */}
      <group ref={raysRef}>
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh key={i} rotation={[0, 0, (i / 8) * Math.PI]}>
            <planeGeometry args={[1.6, 52]} />
            <meshBasicMaterial
              color="#fef9c3"
              transparent
              opacity={0.2}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>

      {/* ── 5. SECONDARY ATMOSPHERIC LENS FLARE RING ── */}
      <mesh scale={[4.5, 4.5, 1]}>
        <ringGeometry args={[9.2, 10.4, 32]} />
        <meshBasicMaterial
          color="#fef3c7"
          transparent
          opacity={0.18}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};
