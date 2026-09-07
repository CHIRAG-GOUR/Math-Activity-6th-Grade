// ============================================================
// THE GREAT CARNIVAL OF CHANCE — Giant Ball Drop 3D Machine
// Physical transparent hopper, mechanical agitator, helical chute,
// rolling 3D spheres and collection bins
// ============================================================

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCarnivalStore } from '../../store/carnivalStore';

interface BallInstance {
  id: number;
  color: string;
  label: string;
  initialPos: [number, number, number];
}

export const GiantBallDrop3D: React.FC<{ position?: [number, number, number] }> = ({
  position = [-7.5, 0, 6.5],
}) => {
  const machineAnimState = useCarnivalStore((s) => s.machineAnimState);
  const activeChallenge = useCarnivalStore((s) => s.activeChallenge);
  const latestRandomOutcome = useCarnivalStore((s) => s.latestRandomOutcome);

  const agitatorRef = useRef<THREE.Group>(null);
  const droppingBallRef = useRef<THREE.Mesh>(null);
  const gateRef = useRef<THREE.Mesh>(null);

  // Generate balls inside the transparent chamber based on challenge probability data
  const balls = useMemo(() => {
    const list: BallInstance[] = [];
    const items = activeChallenge?.probabilityData.items || [
      { label: 'Green', color: '#10b981', count: 4 },
      { label: 'Orange', color: '#f97316', count: 6 },
    ];

    let id = 0;
    items.forEach((item) => {
      for (let i = 0; i < item.count; i++) {
        // Distribute uniformly in a cylinder volume
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 0.7;
        const y = 2.4 + Math.random() * 1.2;
        list.push({
          id: id++,
          color: item.color,
          label: item.label,
          initialPos: [Math.cos(angle) * radius, y, Math.sin(angle) * radius],
        });
      }
    });
    return list;
  }, [activeChallenge]);

  // Active dropping ball color
  const dropBallColor = useMemo(() => {
    if (!latestRandomOutcome) return '#10b981';
    const match = activeChallenge?.probabilityData.items.find((i) => i.label === latestRandomOutcome);
    return match ? match.color : '#10b981';
  }, [latestRandomOutcome, activeChallenge]);

  useFrame((state, delta) => {
    // Agitator spinning when mixing
    if (agitatorRef.current) {
      if (machineAnimState === 'mixing' || machineAnimState === 'batch-simulating') {
        agitatorRef.current.rotation.y += delta * 8;
      } else {
        agitatorRef.current.rotation.y += delta * 0.5;
      }
    }

    // Mechanical gate opening
    if (gateRef.current) {
      const targetRotation = (machineAnimState === 'dropping' || machineAnimState === 'settled') ? -Math.PI / 2 : 0;
      gateRef.current.rotation.z = THREE.MathUtils.lerp(gateRef.current.rotation.z, targetRotation, delta * 8);
    }

    // Dropping ball physics simulation through chute
    if (droppingBallRef.current) {
      if (machineAnimState === 'dropping') {
        const time = (state.clock.getElapsedTime() * 3) % 4;
        // Helical chute trajectory: starts at hopper base (y=2.0), spirals down to collection tray (y=0.4, x=0.8, z=0.8)
        const progress = Math.min(1, time / 2.5);
        const theta = progress * Math.PI * 4;
        const r = 0.9 * (1 - progress * 0.4);
        const y = 2.0 - progress * 1.6;
        droppingBallRef.current.position.set(
          Math.cos(theta) * r,
          y,
          Math.sin(theta) * r + progress * 0.5
        );
        droppingBallRef.current.scale.setScalar(1);
      } else if (machineAnimState === 'settled') {
        // Sits proudly in the front collection tray
        droppingBallRef.current.position.set(0.6, 0.45, 1.2);
        droppingBallRef.current.scale.setScalar(1.2);
      } else {
        // Hidden inside hopper ready to drop
        droppingBallRef.current.position.set(0, 2.2, 0);
        droppingBallRef.current.scale.setScalar(machineAnimState === 'mixing' ? 1 : 0);
      }
    }
  });

  return (
    <group position={position}>
      {/* ── Sturdy Wooden & Brass Base Stand ── */}
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.8, 2.0, 0.4, 32]} />
        <meshStandardMaterial color="#854d0e" roughness={0.6} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.6, 1.8, 0.15, 32]} />
        <meshStandardMaterial color="#d97706" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* 4 Brass Support Pillars */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((ang, i) => (
        <mesh
          key={i}
          position={[Math.cos(ang) * 1.3, 2.0, Math.sin(ang) * 1.3]}
          castShadow
        >
          <cylinderGeometry args={[0.07, 0.07, 3.2, 16]} />
          <meshStandardMaterial color="#ca8a04" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}

      {/* ── Transparent Acrylic Mixing Chamber ── */}
      <mesh position={[0, 2.8, 0]}>
        <cylinderGeometry args={[1.1, 1.1, 2.0, 32, 1, true]} />
        <meshPhysicalMaterial
          color="#e0f2fe"
          transmission={0.92}
          opacity={1}
          transparent
          roughness={0.08}
          ior={1.45}
          thickness={0.4}
        />
      </mesh>

      {/* Top Brass Dome Cap */}
      <mesh position={[0, 3.9, 0]} castShadow>
        <sphereGeometry args={[1.12, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#eab308" metalness={0.85} roughness={0.2} />
      </mesh>
      {/* Decorative Finial */}
      <mesh position={[0, 4.7, 0]} castShadow>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* ── Internal Agitator Spinner ── */}
      <group ref={agitatorRef} position={[0, 2.8, 0]}>
        <mesh>
          <cylinderGeometry args={[0.05, 0.05, 1.8, 12]} />
          <meshStandardMaterial color="#ca8a04" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* 4 Stirring Paddles */}
        {[0, 1, 2, 3].map((p) => (
          <mesh key={p} position={[0, -0.4 + p * 0.3, 0]} rotation={[0, (p * Math.PI) / 2, 0]}>
            <boxGeometry args={[0.9, 0.04, 0.08]} />
            <meshStandardMaterial color="#eab308" metalness={0.7} roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* ── Static Mixed 3D Balls in Chamber ── */}
      {balls.map((b) => (
        <mesh key={b.id} position={b.initialPos} castShadow>
          <sphereGeometry args={[0.18, 20, 20]} />
          <meshStandardMaterial color={b.color} roughness={0.25} metalness={0.15} />
        </mesh>
      ))}

      {/* ── Bottom Funnel & Trapdoor Gate ── */}
      <mesh position={[0, 1.7, 0]} castShadow>
        <cylinderGeometry args={[1.1, 0.3, 0.6, 32]} />
        <meshStandardMaterial color="#d97706" metalness={0.75} roughness={0.25} />
      </mesh>
      {/* Mechanical Gate Flap */}
      <mesh ref={gateRef} position={[0, 1.35, 0]} castShadow>
        <boxGeometry args={[0.55, 0.06, 0.4]} />
        <meshStandardMaterial color="#991b1b" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* ── Helical Brass Guide Chute / Roller Ramp ── */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <torusGeometry args={[0.75, 0.07, 16, 48, Math.PI * 1.8]} />
        <meshStandardMaterial color="#ca8a04" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* ── Front Collection Tray / Spotlight Platter ── */}
      <mesh position={[0.6, 0.35, 1.2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.45, 0.5, 0.15, 24]} />
        <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.6} />
      </mesh>
      <mesh position={[0.6, 0.43, 1.2]}>
        <cylinderGeometry args={[0.4, 0.4, 0.02, 24]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.2} metalness={0.2} />
      </mesh>

      {/* ── The Physical Dropping / Winner Ball ── */}
      <mesh ref={droppingBallRef} castShadow>
        <sphereGeometry args={[0.22, 24, 24]} />
        <meshStandardMaterial
          color={dropBallColor}
          roughness={0.2}
          metalness={0.2}
          emissive={dropBallColor}
          emissiveIntensity={machineAnimState === 'settled' ? 0.35 : 0}
        />
      </mesh>

      {/* ── Physical Signboard Stand ── */}
      <group position={[0, 0, 2.0]}>
        <mesh position={[-0.7, 0.7, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 1.4, 12]} />
          <meshStandardMaterial color="#854d0e" />
        </mesh>
        <mesh position={[0.7, 0.7, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 1.4, 12]} />
          <meshStandardMaterial color="#854d0e" />
        </mesh>
        <mesh position={[0, 1.3, 0]} castShadow>
          <boxGeometry args={[1.7, 0.5, 0.08]} />
          <meshStandardMaterial color="#10b981" roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
};
