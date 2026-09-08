// ============================================================
// THE GREAT CARNIVAL OF CHANCE — Giant Ball Drop 3D Physical Machine
// Studio close-up of the transparent pachinko gumball machine,
// bouncing spheres, agitator, and collection tray
// ============================================================

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCarnivalStore } from '../../store/carnivalStore';

export const BallDropMachine3D: React.FC = () => {
  const phase = useCarnivalStore((s) => s.phase);
  const activeChallenge = useCarnivalStore((s) => s.activeChallenge);
  const drawnOutcome = useCarnivalStore((s) => s.drawnOutcome);
  const batchTrialResults = useCarnivalStore((s) => s.batchTrialResults);

  const agitatorRef = useRef<THREE.Group>(null);
  const droppingBallRef = useRef<THREE.Mesh>(null);

  const setup = activeChallenge?.setup || {
    totalItems: 10,
    items: [
      { color: '#16a34a', colorName: 'Green', count: 8 },
      { color: '#eab308', colorName: 'Yellow', count: 2 },
    ],
  };

  const balls = useMemo(() => {
    const list: { id: number; color: string; pos: [number, number, number] }[] = [];
    let id = 0;
    setup.items.forEach((it) => {
      for (let i = 0; i < it.count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 0.75;
        const y = 2.4 + Math.random() * 1.2;
        list.push({
          id: id++,
          color: it.color,
          pos: [Math.cos(angle) * radius, y, Math.sin(angle) * radius],
        });
      }
    });
    return list;
  }, [setup]);

  const activeColor = drawnOutcome?.color || setup.items[0].color;

  useFrame((state, delta) => {
    if (agitatorRef.current) {
      if (phase === 'operating' || phase === 'batch-trials') {
        agitatorRef.current.rotation.y += delta * 8;
      } else {
        agitatorRef.current.rotation.y += delta * 0.5;
      }
    }

    if (droppingBallRef.current) {
      if (phase === 'operating') {
        const t = (state.clock.getElapsedTime() * 2.5) % 3;
        const progress = Math.min(1, t / 2.0);
        const theta = progress * Math.PI * 4;
        const r = 0.9 * (1 - progress * 0.4);
        const y = 2.2 - progress * 1.7;
        droppingBallRef.current.position.set(Math.cos(theta) * r, y, Math.sin(theta) * r + progress * 0.5);
        droppingBallRef.current.scale.setScalar(1);
      } else if (phase === 'observation' || phase === 'batch-trials') {
        droppingBallRef.current.position.set(0.6, 0.45, 1.2);
        droppingBallRef.current.scale.setScalar(1.2);
      } else {
        droppingBallRef.current.position.set(0, 2.2, 0);
        droppingBallRef.current.scale.setScalar(0);
      }
    }
  });

  return (
    <group position={[0, -0.5, 0]}>
      {/* Wooden & Brass Stand Base */}
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.0, 2.2, 0.5, 32]} />
        <meshStandardMaterial color="#854d0e" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.65, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.8, 2.0, 0.15, 32]} />
        <meshStandardMaterial color="#d97706" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* 4 Brass Pillars */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((ang, i) => (
        <mesh key={i} position={[Math.cos(ang) * 1.4, 2.3, Math.sin(ang) * 1.4]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 3.4, 16]} />
          <meshStandardMaterial color="#ca8a04" metalness={0.8} />
        </mesh>
      ))}

      {/* Transparent Mixing Chamber */}
      <mesh position={[0, 3.1, 0]}>
        <cylinderGeometry args={[1.2, 1.2, 2.2, 32, 1, true]} />
        <meshPhysicalMaterial color="#e0f2fe" transmission={0.92} transparent opacity={1} roughness={0.08} />
      </mesh>

      {/* Top Brass Dome */}
      <mesh position={[0, 4.2, 0]} castShadow>
        <sphereGeometry args={[1.22, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#eab308" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* Agitator Spinner */}
      <group ref={agitatorRef} position={[0, 3.1, 0]}>
        <mesh>
          <cylinderGeometry args={[0.06, 0.06, 2.0, 12]} />
          <meshStandardMaterial color="#ca8a04" metalness={0.8} />
        </mesh>
        {[0, 1, 2, 3].map((p) => (
          <mesh key={p} position={[0, -0.4 + p * 0.35, 0]} rotation={[0, (p * Math.PI) / 2, 0]}>
            <boxGeometry args={[1.0, 0.04, 0.08]} />
            <meshStandardMaterial color="#eab308" metalness={0.7} />
          </mesh>
        ))}
      </group>

      {/* Static Balls in Chamber */}
      {balls.map((b) => (
        <mesh key={b.id} position={b.pos} castShadow>
          <sphereGeometry args={[0.18, 20, 20]} />
          <meshStandardMaterial color={b.color} roughness={0.25} metalness={0.2} />
        </mesh>
      ))}

      {/* Helical Brass Chute */}
      <mesh position={[0, 1.35, 0]} castShadow>
        <torusGeometry args={[0.8, 0.08, 16, 48, Math.PI * 1.8]} />
        <meshStandardMaterial color="#ca8a04" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* Front Collection Tray */}
      <mesh position={[0.6, 0.45, 1.2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.55, 0.18, 24]} />
        <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Dropping / Winner Ball */}
      <mesh ref={droppingBallRef} castShadow>
        <sphereGeometry args={[0.22, 24, 24]} />
        <meshStandardMaterial
          color={activeColor}
          roughness={0.2}
          metalness={0.2}
          emissive={activeColor}
          emissiveIntensity={phase === 'observation' ? 0.35 : 0}
        />
      </mesh>
    </group>
  );
};
