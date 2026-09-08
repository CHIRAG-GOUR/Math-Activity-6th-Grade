// ============================================================
// THE GREAT CARNIVAL OF CHANCE — Game Builder 3D Physical Machine
// Artisan Carnival Workshop with wooden workbench, giant colorful dice,
// spinning brass gear mechanisms, and 10-slot probability Plinko pegboard
// ============================================================

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCarnivalStore } from '../../store/carnivalStore';

export const GameBuilderMachine3D: React.FC = () => {
  const phase = useCarnivalStore((s) => s.phase);
  const activeChallenge = useCarnivalStore((s) => s.activeChallenge);

  const gear1Ref = useRef<THREE.Group>(null);
  const gear2Ref = useRef<THREE.Group>(null);
  const ballRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (gear1Ref.current) {
      gear1Ref.current.rotation.z += delta * (phase === 'operating' ? 4 : 0.8);
    }
    if (gear2Ref.current) {
      gear2Ref.current.rotation.z -= delta * (phase === 'operating' ? 4 : 0.8);
    }

    if (ballRef.current) {
      if (phase === 'operating') {
        const t = (state.clock.getElapsedTime() * 2.0) % 2.5;
        const prog = Math.min(1, t / 2.0);
        // Zig-zag descent through pegs
        const y = 3.6 - prog * 2.2;
        const x = Math.sin(prog * Math.PI * 6) * 0.35;
        ballRef.current.position.set(x, y, 0.1);
        ballRef.current.scale.setScalar(1);
      } else if (phase === 'observation') {
        ballRef.current.position.set(0.34, 1.35, 0.12);
        ballRef.current.scale.setScalar(1.2);
      } else {
        ballRef.current.position.set(0, 3.8, 0.1);
        ballRef.current.scale.setScalar(0);
      }
    }
  });

  return (
    <group position={[0, -0.6, 0]}>
      {/* ── Studio Lighting ── */}
      <spotLight
        position={[0, 9, 5]}
        target-position={[0, 2.4, 0]}
        intensity={2.3}
        angle={0.65}
        penumbra={0.5}
        color="#fffbeb"
        castShadow
      />

      {/* ── Artisan Carpenter's Workbench Base ── */}
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[5.2, 0.7, 2.6]} />
        <meshStandardMaterial color="#78350f" roughness={0.7} />
      </mesh>
      {/* Polished Pine Tabletop */}
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[5.4, 0.12, 2.8]} />
        <meshStandardMaterial color="#fcd34d" roughness={0.4} />
      </mesh>

      {/* ═════════════════════════════════════════════════════════════
          GIANT COLORFUL 3D DICE & CARPENTER TOOLS ON TABLE
          ═════════════════════════════════════════════════════════════ */}
      {/* Red Die (Left) */}
      <group position={[-1.9, 1.15, 0.6]} rotation={[0.2, 0.4, 0.1]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.65, 0.65, 0.65]} />
          <meshStandardMaterial color="#dc2626" roughness={0.3} />
        </mesh>
        {/* White pips on front face */}
        <mesh position={[0, 0, 0.33]} castShadow>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} />
        </mesh>
      </group>

      {/* Blue Die (Right) */}
      <group position={[1.9, 1.15, 0.6]} rotation={[-0.2, -0.3, 0.15]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.65, 0.65, 0.65]} />
          <meshStandardMaterial color="#2563eb" roughness={0.3} />
        </mesh>
        {/* White pips */}
        {[
          [-0.15, 0.15, 0.33],
          [0.15, -0.15, 0.33],
        ].map(([x, y, z], i) => (
          <mesh key={i} position={[x, y, z]} castShadow>
            <sphereGeometry args={[0.07, 12, 12]} />
            <meshStandardMaterial color="#ffffff" roughness={0.2} />
          </mesh>
        ))}
      </group>

      {/* Rolled Blueprint Scroll */}
      <mesh position={[-1.8, 0.88, -0.4]} rotation={[0, 0.5, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 1.2, 16]} />
        <meshStandardMaterial color="#e0f2fe" roughness={0.6} />
      </mesh>

      {/* ═════════════════════════════════════════════════════════════
          SPINNING BRASS GEAR MECHANISMS ON SIDES
          ═════════════════════════════════════════════════════════════ */}
      <group ref={gear1Ref} position={[-2.3, 3.4, -0.2]}>
        <mesh castShadow>
          <torusGeometry args={[0.55, 0.12, 12, 16]} />
          <meshStandardMaterial color="#ca8a04" metalness={0.85} roughness={0.2} />
        </mesh>
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh
            key={i}
            position={[Math.cos((i * Math.PI) / 4) * 0.65, Math.sin((i * Math.PI) / 4) * 0.65, 0]}
            rotation={[0, 0, (i * Math.PI) / 4]}
            castShadow
          >
            <boxGeometry args={[0.12, 0.18, 0.1]} />
            <meshStandardMaterial color="#eab308" metalness={0.9} />
          </mesh>
        ))}
      </group>

      <group ref={gear2Ref} position={[2.3, 3.1, -0.2]}>
        <mesh castShadow>
          <torusGeometry args={[0.42, 0.1, 12, 16]} />
          <meshStandardMaterial color="#ca8a04" metalness={0.85} roughness={0.2} />
        </mesh>
        {Array.from({ length: 6 }).map((_, i) => (
          <mesh
            key={i}
            position={[Math.cos((i * Math.PI) / 3) * 0.5, Math.sin((i * Math.PI) / 3) * 0.5, 0]}
            rotation={[0, 0, (i * Math.PI) / 3]}
            castShadow
          >
            <boxGeometry args={[0.1, 0.15, 0.08]} />
            <meshStandardMaterial color="#eab308" metalness={0.9} />
          </mesh>
        ))}
      </group>

      {/* ═════════════════════════════════════════════════════════════
          UPRIGHT 10-SLOT PEGBOARD GAME FRAME
          ═════════════════════════════════════════════════════════════ */}
      <group position={[0, 2.7, -0.1]} rotation={[-0.08, 0, 0]}>
        {/* Wooden Cabinet Frame */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[4.2, 3.6, 0.22]} />
          <meshStandardMaterial color="#0284c7" roughness={0.5} />
        </mesh>
        {/* Gold Border Trim */}
        <mesh position={[0, 0, 0.12]}>
          <boxGeometry args={[4.0, 3.4, 0.04]} />
          <meshStandardMaterial color="#fef08a" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Clear Acrylic Window */}
        <mesh position={[0, 0, 0.18]}>
          <boxGeometry args={[3.8, 3.2, 0.04]} />
          <meshPhysicalMaterial color="#e0f2fe" transmission={0.92} transparent opacity={1} roughness={0.08} />
        </mesh>

        {/* Funnel Drop Chute at Top */}
        <mesh position={[0, 1.55, 0.12]} castShadow>
          <cylinderGeometry args={[0.4, 0.18, 0.35, 16]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.85} />
        </mesh>

        {/* Brass Deflection Pins */}
        {Array.from({ length: 5 }).map((_, row) =>
          Array.from({ length: 7 }).map((_, col) => (
            <mesh
              key={`${row}-${col}`}
              position={[(col - 3) * 0.52 + (row % 2 === 0 ? 0.26 : 0), (row - 1.5) * 0.52 + 0.2, 0.12]}
              rotation={[Math.PI / 2, 0, 0]}
              castShadow
            >
              <cylinderGeometry args={[0.04, 0.04, 0.18, 8]} />
              <meshStandardMaterial color="#fef08a" metalness={0.95} roughness={0.1} />
            </mesh>
          ))
        )}

        {/* 10 Bottom Target Slots (Green Win / Red Lose) */}
        {Array.from({ length: 10 }).map((_, i) => {
          const isWin = i === 2 || i === 5 || i === 8;
          return (
            <group key={i} position={[(i - 4.5) * 0.36, -1.35, 0.12]}>
              <mesh castShadow>
                <boxGeometry args={[0.32, 0.42, 0.18]} />
                <meshStandardMaterial
                  color={isWin ? '#16a34a' : '#dc2626'}
                  roughness={0.4}
                  emissive={isWin ? '#16a34a' : '#dc2626'}
                  emissiveIntensity={0.2}
                />
              </mesh>
              {/* Divider Fin */}
              <mesh position={[0.17, 0, 0]} castShadow>
                <boxGeometry args={[0.03, 0.45, 0.2]} />
                <meshStandardMaterial color="#fef08a" metalness={0.8} />
              </mesh>
            </group>
          );
        })}

        {/* Animated Bouncing Test Ball */}
        <mesh ref={ballRef} castShadow>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.15} />
        </mesh>
      </group>
    </group>
  );
};
