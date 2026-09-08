// ============================================================
// THE GREAT CARNIVAL OF CHANCE — Giant Ball Drop 3D Physical Machine
// High-Fidelity Industrial Carnival Gumball Silo with transparent glass cylinder,
// churning 3D probability balls, helical red corkscrew track, and golden dome
// ============================================================

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCarnivalStore } from '../../store/carnivalStore';

export const BallDropMachine3D: React.FC = () => {
  const phase = useCarnivalStore((s) => s.phase);
  const activeChallenge = useCarnivalStore((s) => s.activeChallenge);
  const drawnOutcome = useCarnivalStore((s) => s.drawnOutcome);

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
        const angle = (id / setup.totalItems) * Math.PI * 2 + (id * 1.3);
        const radius = 0.2 + (id % 3) * 0.25;
        const y = 2.1 + ((id * 0.22) % 1.6);
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
        agitatorRef.current.rotation.y += delta * 0.6;
      }
    }

    if (droppingBallRef.current) {
      if (phase === 'operating') {
        const t = (state.clock.getElapsedTime() * 2.2) % 3;
        const progress = Math.min(1, t / 2.2);
        // Descend around external corkscrew helix (radius ~ 1.35, pitch from y=3.2 to y=0.55)
        const turns = progress * Math.PI * 4;
        const r = 1.35;
        const y = 3.2 - progress * 2.65;
        droppingBallRef.current.position.set(
          Math.sin(turns) * r,
          y,
          Math.cos(turns) * r
        );
        droppingBallRef.current.scale.setScalar(1);
        droppingBallRef.current.rotation.x += delta * 12;
      } else if (phase === 'observation' || phase === 'batch-trials') {
        droppingBallRef.current.position.set(0, 0.55, 1.6);
        droppingBallRef.current.scale.setScalar(1.2);
        droppingBallRef.current.rotation.y += delta * 1.2;
      } else {
        droppingBallRef.current.position.set(0, 2.5, 0);
        droppingBallRef.current.scale.setScalar(0);
      }
    }
  });

  return (
    <group position={[0, -0.6, 0]}>
      {/* ── Studio Lighting ── */}
      <spotLight
        position={[0, 9, 5]}
        target-position={[0, 2.5, 0]}
        intensity={2.4}
        angle={0.6}
        penumbra={0.5}
        color="#fffbeb"
        castShadow
      />

      {/* ── Heavy Stepped Base Platform ── */}
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.8, 3.2, 0.4, 32]} />
        <meshStandardMaterial color="#334155" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.4, 2.7, 0.15, 32]} />
        <meshStandardMaterial color="#ca8a04" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* ── 4 Fluted Brass Pillars ── */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((ang, i) => (
        <group key={i} position={[Math.cos(ang) * 1.5, 2.4, Math.sin(ang) * 1.5]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.09, 0.09, 3.8, 16]} />
            <meshStandardMaterial color="#ca8a04" metalness={0.85} roughness={0.2} />
          </mesh>
          {/* Pillar base & capital rings */}
          {[-1.8, 1.8].map((y, j) => (
            <mesh key={j} position={[0, y, 0]} castShadow>
              <cylinderGeometry args={[0.14, 0.14, 0.12, 16]} />
              <meshStandardMaterial color="#fef08a" metalness={0.95} />
            </mesh>
          ))}
        </group>
      ))}

      {/* ── Transparent Glass Cylinder Mixing Silo ── */}
      <mesh position={[0, 2.4, 0]}>
        <cylinderGeometry args={[1.3, 1.3, 3.4, 36, 1, true]} />
        <meshPhysicalMaterial
          color="#e0f2fe"
          transmission={0.93}
          transparent
          opacity={1}
          roughness={0.06}
          ior={1.45}
        />
      </mesh>

      {/* Brass Reinforcement Rings on Glass */}
      {[1.0, 2.4, 3.8].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} castShadow>
          <torusGeometry args={[1.32, 0.05, 12, 36]} />
          <meshStandardMaterial color="#ca8a04" metalness={0.9} roughness={0.15} />
        </mesh>
      ))}

      {/* ── Top Golden Onion Dome Roof ── */}
      <group position={[0, 4.2, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[1.4, 32, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#eab308" metalness={0.88} roughness={0.18} />
        </mesh>
        {/* Scalloped Rim Valance */}
        {Array.from({ length: 16 }).map((_, i) => (
          <mesh
            key={i}
            position={[Math.cos((i * Math.PI) / 8) * 1.38, 0, Math.sin((i * Math.PI) / 8) * 1.38]}
            castShadow
          >
            <boxGeometry args={[0.15, 0.2, 0.06]} />
            <meshStandardMaterial color={i % 2 === 0 ? '#dc2626' : '#ffffff'} />
          </mesh>
        ))}
        {/* Golden Finial Spire & Flag */}
        <mesh position={[0, 1.4, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.06, 1.2, 8]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.95} />
        </mesh>
        <mesh position={[0, 2.0, 0]} castShadow>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.95} />
        </mesh>
        <mesh position={[0.28, 1.7, 0]} castShadow>
          <boxGeometry args={[0.45, 0.28, 0.02]} />
          <meshStandardMaterial color="#16a34a" />
        </mesh>
      </group>

      {/* ── Internal Agitator Spinner Paddle ── */}
      <group ref={agitatorRef} position={[0, 2.4, 0]}>
        <mesh>
          <cylinderGeometry args={[0.06, 0.06, 3.0, 12]} />
          <meshStandardMaterial color="#ca8a04" metalness={0.8} />
        </mesh>
        {[0, 1, 2, 3, 4].map((p) => (
          <mesh
            key={p}
            position={[0, -1.0 + p * 0.5, 0]}
            rotation={[0, (p * Math.PI) / 2.5, 0]}
          >
            <boxGeometry args={[1.1, 0.05, 0.1]} />
            <meshStandardMaterial color="#eab308" metalness={0.75} />
          </mesh>
        ))}
      </group>

      {/* ── 3D Colorful Probability Balls Inside Silo ── */}
      {balls.map((b) => (
        <mesh key={b.id} position={b.pos} castShadow>
          <sphereGeometry args={[0.19, 20, 20]} />
          <meshStandardMaterial color={b.color} roughness={0.25} metalness={0.2} />
        </mesh>
      ))}

      {/* ── Red Helical Corkscrew Slide Around Exterior ── */}
      {Array.from({ length: 24 }).map((_, i) => {
        const prog = i / 24;
        const angle = prog * Math.PI * 4;
        const y = 3.3 - prog * 2.6;
        const x = Math.sin(angle) * 1.35;
        const z = Math.cos(angle) * 1.35;
        return (
          <mesh key={`spiral-${i}`} position={[x, y, z]} rotation={[0, -angle, 0.25]} castShadow>
            <boxGeometry args={[0.22, 0.06, 0.35]} />
            <meshStandardMaterial color="#dc2626" roughness={0.4} metalness={0.2} />
          </mesh>
        );
      })}

      {/* ── Front Collection Tray Platter ── */}
      <group position={[0, 0.45, 1.6]}>
        <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.75, 0.85, 0.16, 24]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.17, 0]} receiveShadow>
          <cylinderGeometry args={[0.65, 0.65, 0.04, 24]} />
          <meshStandardMaterial color="#fef08a" roughness={0.3} metalness={0.5} />
        </mesh>
      </group>

      {/* ── Active Dropping / Winner Ball ── */}
      <mesh ref={droppingBallRef} castShadow>
        <sphereGeometry args={[0.24, 24, 24]} />
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
