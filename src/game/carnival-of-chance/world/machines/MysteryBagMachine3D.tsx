// ============================================================
// THE GREAT CARNIVAL OF CHANCE — Dynamic Mystery Chests 3D Machine
// Pure 3D Treasure Chests Mechanism (No Giant Sack Blob):
// - Dynamically renders 3, 4, or 5 Ornate 3D Treasure Chests
// - Individual Animated Hinged Lids with Brass Clasp & Lockplates
// - Physical 3D Probability Balls emerge from the active chest
// - Smooth trajectory onto the Front Golden Spotlight Platter
// ============================================================

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCarnivalStore } from '../../store/carnivalStore';

interface ChestData {
  id: string;
  label: string;
  color: string;
  x: number;
  isTarget: boolean;
  balls: { id: number; color: string; colorName: string }[];
}

export const MysteryBagMachine3D: React.FC = () => {
  const phase = useCarnivalStore((s) => s.phase);
  const activeChallenge = useCarnivalStore((s) => s.activeChallenge);
  const drawnOutcome = useCarnivalStore((s) => s.drawnOutcome);
  const blueTeam = useCarnivalStore((s) => s.blueTeam);
  const redTeam = useCarnivalStore((s) => s.redTeam);

  const rollingBallRef = useRef<THREE.Mesh>(null);
  const spotlightRef = useRef<THREE.SpotLight>(null);

  // Challenge setup items & chests
  const setup = activeChallenge?.setup || {
    totalItems: 9,
    items: [
      { color: '#dc2626', colorName: 'Red', count: 5 },
      { color: '#2563eb', colorName: 'Blue', count: 4 },
    ],
    targetColor: '#dc2626',
    theoreticalFraction: { numerator: 5, denominator: 9 },
  };

  const isRoundCorrect = useMemo(() => {
    return (
      blueTeam.lastResult === 'correct' ||
      redTeam.lastResult === 'correct' ||
      (drawnOutcome &&
        activeChallenge?.setup.targetColor &&
        drawnOutcome.color === activeChallenge.setup.targetColor)
    );
  }, [blueTeam.lastResult, redTeam.lastResult, drawnOutcome, activeChallenge]);

  // Compute 3, 4, or 5 dynamic chests based on setup
  const chests = useMemo<ChestData[]>(() => {
    if (setup.chests && setup.chests.length > 0) {
      const count = setup.chests.length;
      return setup.chests.map((c, idx) => {
        const spread = count === 3 ? 1.9 : count === 4 ? 1.5 : 1.25;
        const half = ((count - 1) * spread) / 2;
        const x = -half + idx * spread;
        const balls: { id: number; color: string; colorName: string }[] = [];
        let bId = 0;
        c.items.forEach((it) => {
          for (let i = 0; i < it.count; i++) {
            balls.push({ id: bId++, color: it.color, colorName: it.colorName });
          }
        });
        return {
          id: c.id,
          label: c.label || `CHEST ${idx + 1}`,
          color: c.color || '#92400e',
          x,
          isTarget: !!c.isTarget || idx === 0,
          balls,
        };
      });
    }

    // Default 3 dynamic chests layout based on challenge items
    const defaultChests = [
      { id: 'chest-1', label: 'CHEST 1', color: '#92400e', x: -1.9, isTarget: false },
      { id: 'chest-2', label: 'CHEST 2', color: '#b45309', x: 0, isTarget: true },
      { id: 'chest-3', label: 'CHEST 3', color: '#78350f', x: 1.9, isTarget: false },
    ];

    const ballsList: { id: number; color: string; colorName: string }[] = [];
    let bId = 0;
    setup.items.forEach((it) => {
      for (let i = 0; i < it.count; i++) {
        ballsList.push({ id: bId++, color: it.color, colorName: it.colorName });
      }
    });

    return defaultChests.map((c, i) => ({
      ...c,
      balls: ballsList.slice(i * 2, i * 2 + 3),
    }));
  }, [setup]);

  // Find target chest that should open
  const activeChest = useMemo(() => {
    const target = chests.find((c) => c.isTarget);
    return target || chests[1] || chests[0];
  }, [chests]);

  const activeColor = drawnOutcome?.color || setup.items[0]?.color || '#dc2626';

  useFrame((state, delta) => {
    const tClock = state.clock.getElapsedTime();

    // 1. Dynamic Ball Draw & Flight Animation out of active chest
    if (rollingBallRef.current) {
      if (phase === 'operating') {
        const cycle = 2.0;
        const t = (tClock * 1.0) % (cycle + 0.5);
        const progress = Math.min(1, t / cycle);

        const startX = activeChest.x;
        const targetX = 0;

        let x = startX;
        let y = 1.2;
        let z = -0.3;

        if (progress < 0.3) {
          // Stage 1: Ball rises out of the opening chest
          const p = progress / 0.3;
          x = startX;
          y = 0.9 + p * 1.2; // 0.9 -> 2.1
          z = -0.3 + p * 0.4; // -0.3 -> 0.1
        } else if (progress < 0.75) {
          // Stage 2: Parabolic arc from chest toward center spotlight tray
          const p = (progress - 0.3) / 0.45;
          x = THREE.MathUtils.lerp(startX, targetX, p);
          y = 2.1 - p * 1.5 + Math.sin(p * Math.PI) * 0.4; // 2.1 -> 0.6
          z = 0.1 + p * 1.7; // 0.1 -> 1.8
        } else {
          // Stage 3: Damped settling bounce onto the golden platter
          const p = (progress - 0.75) / 0.25;
          x = 0;
          z = 1.8;
          const bounce = Math.sin(p * Math.PI * 2) * Math.exp(-p * 4) * 0.18;
          y = 0.55 + Math.max(0, bounce);
        }

        rollingBallRef.current.position.set(x, y, z);
        rollingBallRef.current.scale.setScalar(1);
        rollingBallRef.current.rotation.x += delta * 12;
        rollingBallRef.current.rotation.y += delta * 10;
      } else if (phase === 'observation' || phase === 'batch-trials') {
        // Settled comfortably on the center platter with celebratory glow
        const bob = Math.sin(tClock * 3) * 0.03;
        rollingBallRef.current.position.set(0, 0.58 + bob, 1.8);
        rollingBallRef.current.scale.setScalar(1.2);
        rollingBallRef.current.rotation.y += delta * 1.2;
      } else {
        // Stored inside the target chest waiting to be drawn
        rollingBallRef.current.position.set(activeChest.x, 0.95, -0.3);
        rollingBallRef.current.scale.setScalar(1);
      }
    }
  });

  return (
    <group position={[0, -0.5, 0]}>
      {/* ── Dramatic Spotlight ── */}
      <spotLight
        ref={spotlightRef}
        position={[0, 9, 4]}
        target-position={[0, 0.5, 1.8]}
        intensity={phase === 'observation' ? 4.5 : 2.2}
        angle={0.6}
        penumbra={0.5}
        color="#fffbeb"
        castShadow
      />

      {/* ── Ornate Mahogany Stage Base ── */}
      <mesh position={[0, 0.15, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[4.4, 4.8, 0.3, 36]} />
        <meshStandardMaterial color="#78350f" roughness={0.7} />
      </mesh>
      {/* Red Velvet Table Runner */}
      <mesh position={[0, 0.32, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[4.0, 4.3, 0.08, 36]} />
        <meshStandardMaterial color="#991b1b" roughness={0.8} />
      </mesh>
      {/* Brass Table Rim */}
      <mesh position={[0, 0.38, 0]}>
        <cylinderGeometry args={[4.02, 4.02, 0.04, 36]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* ═════════════════════════════════════════════════════════════
          DYNAMIC 3D TREASURE CHESTS ROW (3, 4, or 5 CHESTS)
          ═════════════════════════════════════════════════════════════ */}
      {chests.map((chest) => (
        <Chest3D
          key={chest.id}
          chest={chest}
          isOpen={phase === 'operating' || phase === 'observation' || phase === 'batch-trials'}
          isWinningChest={chest.id === activeChest.id}
        />
      ))}

      {/* ── Front Golden Spotlight Prize Platter ── */}
      <group position={[0, 0.35, 1.8]}>
        <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.9, 1.0, 0.16, 28]} />
          <meshStandardMaterial color="#451a03" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.17, 0]} receiveShadow>
          <cylinderGeometry args={[0.8, 0.8, 0.04, 28]} />
          <meshStandardMaterial color="#fed500" roughness={0.3} metalness={0.6} />
        </mesh>
        <mesh position={[0, 0.19, 0]}>
          <torusGeometry args={[0.8, 0.03, 12, 28]} />
          <meshStandardMaterial color="#ca8a04" metalness={0.9} />
        </mesh>
      </group>

      {/* ── Active Drawn Probability Ball ── */}
      <mesh ref={rollingBallRef} castShadow>
        <sphereGeometry args={[0.26, 32, 32]} />
        <meshStandardMaterial
          color={activeColor}
          roughness={0.2}
          metalness={0.25}
          emissive={activeColor}
          emissiveIntensity={phase === 'observation' ? 0.4 : 0.05}
        />
      </mesh>
    </group>
  );
};

// ═══════════════════════════════════════════════════════════════
// INDIVIDUAL 3D TREASURE CHEST COMPONENT
// ═══════════════════════════════════════════════════════════════
const Chest3D: React.FC<{
  chest: ChestData;
  isOpen: boolean;
  isWinningChest: boolean;
}> = ({ chest, isOpen, isWinningChest }) => {
  const lidRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (lidRef.current) {
      const targetAngle = isOpen && isWinningChest ? -1.35 : 0;
      lidRef.current.rotation.x = THREE.MathUtils.lerp(
        lidRef.current.rotation.x,
        targetAngle,
        delta * 6
      );
    }
  });

  return (
    <group position={[chest.x, 0.72, -0.3]}>
      {/* Main Chest Box Base */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.1, 0.65, 0.75]} />
        <meshStandardMaterial color={chest.color} roughness={0.6} />
      </mesh>

      {/* Brass Corner Braces & Bands */}
      {[-0.42, 0.42].map((x, i) => (
        <mesh key={`band-${i}`} position={[x, 0, 0]} castShadow>
          <boxGeometry args={[0.07, 0.67, 0.77]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.15} />
        </mesh>
      ))}

      {/* Front Gold Keyhole / Lock Plate */}
      <mesh position={[0, 0, 0.39]} castShadow>
        <boxGeometry args={[0.18, 0.22, 0.02]} />
        <meshStandardMaterial color="#fef08a" metalness={0.95} />
      </mesh>

      {/* Neo-Brutalist Label Badge on Chest Front */}
      <group position={[0, 0.15, 0.4]}>
        <mesh castShadow>
          <boxGeometry args={[0.65, 0.16, 0.03]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        <mesh position={[0, 0, 0.02]}>
          <planeGeometry args={[0.6, 0.12]} />
          <meshStandardMaterial color="#fed500" />
        </mesh>
      </group>

      {/* Animated Hinged Lid (Pivot at back `z = -0.375`) */}
      <group ref={lidRef} position={[0, 0.325, -0.375]}>
        <mesh position={[0, 0.16, 0.375]} castShadow>
          <cylinderGeometry args={[0.38, 0.38, 1.1, 16, 1, false, 0, Math.PI]} />
          <meshStandardMaterial color="#b45309" roughness={0.5} />
        </mesh>
        {/* Brass Lid Trim Band */}
        {[-0.42, 0.42].map((x, i) => (
          <mesh key={`lid-band-${i}`} position={[x, 0.16, 0.375]} castShadow>
            <cylinderGeometry args={[0.39, 0.39, 0.07, 16, 1, false, 0, Math.PI]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.9} />
          </mesh>
        ))}
      </group>

      {/* 3D Probability Balls Visible Inside Chest */}
      {chest.balls.map((b, idx) => (
        <mesh
          key={b.id}
          position={[-0.25 + (idx % 3) * 0.25, 0.18, -0.15 + Math.floor(idx / 3) * 0.2]}
          castShadow
        >
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color={b.color} roughness={0.3} metalness={0.2} />
        </mesh>
      ))}
    </group>
  );
};
