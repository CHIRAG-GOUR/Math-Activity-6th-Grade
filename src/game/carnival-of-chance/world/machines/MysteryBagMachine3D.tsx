// ============================================================
// THE GREAT CARNIVAL OF CHANCE — Minecraft-Style Mystery Chests 3D Machine
// Authentic Minecraft Voxel Chests:
// - Iconic Blocky Minecraft Proportions (Dark Oak Frame + Warm Oak Planks)
// - Minecraft-style Silver / Iron Lock Latch in Center Front
// - Completely Enclosed Sealed Box (Zero Balls Visible from Outside when Closed!)
// - Smooth Hinged Lid Opening (pivots back ~105°) on Winning Chest
// - Probability Balls Revealed Inside only upon Chest Opening
// - Smooth Arc Trajectory from Winning Chest onto Front Golden Spotlight Platter
// - Dynamic 3, 4, or 5 Chests Spacing & Scaling
// ============================================================

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCarnivalStore } from '../../store/carnivalStore';

interface ChestData {
  id: string;
  label: string;
  color: string;
  plankColor: string;
  x: number;
  scale: number;
  isTarget: boolean;
  balls: { id: number; color: string; colorName: string }[];
}

export const MysteryBagMachine3D: React.FC = () => {
  const phase = useCarnivalStore((s) => s.phase);
  const activeChallenge = useCarnivalStore((s) => s.activeChallenge);
  const drawnOutcome = useCarnivalStore((s) => s.drawnOutcome);

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

  // Compute 3, 4, or 5 dynamic chests based on setup
  const chests = useMemo<ChestData[]>(() => {
    // Minecraft wood palette (Oak, Spruce, Acacia, Dark Oak, Mangrove)
    const minecraftWoodSets = [
      { frame: '#2d1b0f', plank: '#b45309' }, // Classic Oak
      { frame: '#1f130b', plank: '#78350f' }, // Dark Oak
      { frame: '#2e1c0c', plank: '#9a3412' }, // Acacia
      { frame: '#1e1b18', plank: '#713f12' }, // Spruce
      { frame: '#2a0e17', plank: '#831843' }, // Mangrove / Crimson
    ];

    if (setup.chests && setup.chests.length > 0) {
      const count = setup.chests.length;
      const spread = count <= 3 ? 2.1 : count === 4 ? 1.58 : 1.25;
      const scale = count <= 3 ? 0.96 : count === 4 ? 0.82 : 0.70;
      const half = ((count - 1) * spread) / 2;

      return setup.chests.map((c, idx) => {
        const x = -half + idx * spread;
        const balls: { id: number; color: string; colorName: string }[] = [];
        let bId = 0;
        c.items.forEach((it) => {
          for (let i = 0; i < it.count; i++) {
            balls.push({ id: bId++, color: it.color, colorName: it.colorName });
          }
        });
        const wood = minecraftWoodSets[idx % minecraftWoodSets.length];
        return {
          id: c.id,
          label: c.label || `CHEST ${idx + 1}`,
          color: wood.frame,
          plankColor: wood.plank,
          x,
          scale,
          isTarget: !!c.isTarget,
          balls,
        };
      });
    }

    // Default 3 dynamic chests layout based on challenge items
    const defaultChests = [
      { id: 'chest-1', label: 'CHEST 1', color: '#2d1b0f', plankColor: '#b45309', x: -2.1, isTarget: false },
      { id: 'chest-2', label: 'CHEST 2', color: '#1f130b', plankColor: '#d97706', x: 0, isTarget: true },
      { id: 'chest-3', label: 'CHEST 3', color: '#2e1c0c', plankColor: '#9a3412', x: 2.1, isTarget: false },
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
      scale: 0.96,
      balls: ballsList.slice(i * 2, i * 2 + 3),
    }));
  }, [setup]);

  // Find target chest that should open
  const activeChest = useMemo(() => {
    const target = chests.find((c) => c.isTarget);
    return target || chests[1] || chests[0];
  }, [chests]);

  const activeColor = drawnOutcome?.color || setup.targetColor || setup.items[0]?.color || '#dc2626';

  useFrame((state, delta) => {
    const tClock = state.clock.getElapsedTime();

    // Dynamic Ball Draw & Flight Animation out of active chest
    if (rollingBallRef.current) {
      if (phase === 'operating') {
        const cycle = 2.2;
        const t = (tClock * 1.0) % (cycle + 0.5);
        const progress = Math.min(1, t / cycle);

        const startX = activeChest.x;
        const targetX = 0;

        let x = startX;
        let y = 0.8;
        let z = -0.3;

        if (progress < 0.28) {
          // Stage 1: Ball rises out of the opening chest
          const p = progress / 0.28;
          const easeOut = 1 - Math.pow(1 - p, 2);
          x = startX;
          y = 0.9 + easeOut * 1.35; // 0.9 -> 2.25
          z = -0.3 + p * 0.35;
        } else if (progress < 0.72) {
          // Stage 2: Parabolic arc from chest toward center spotlight tray
          const p = (progress - 0.28) / 0.44;
          x = THREE.MathUtils.lerp(startX, targetX, p);
          // Parabolic height arch
          const arcPeak = Math.sin(p * Math.PI) * 0.5;
          y = THREE.MathUtils.lerp(2.25, 0.62, p) + arcPeak;
          z = THREE.MathUtils.lerp(0.05, 1.8, p);
        } else {
          // Stage 3: Damped settling bounce onto the golden platter
          const p = (progress - 0.72) / 0.28;
          x = 0;
          z = 1.8;
          const bounce = Math.abs(Math.sin(p * Math.PI * 3)) * Math.exp(-p * 4.5) * 0.22;
          y = 0.62 + bounce;
        }

        rollingBallRef.current.position.set(x, y, z);
        rollingBallRef.current.scale.setScalar(1.05);
        rollingBallRef.current.rotation.x += delta * 10;
        rollingBallRef.current.rotation.y += delta * 8;
      } else if (phase === 'observation' || phase === 'batch-trials') {
        // Settled comfortably on the center platter with celebratory glow
        const bob = Math.sin(tClock * 3.5) * 0.03;
        rollingBallRef.current.position.set(0, 0.64 + bob, 1.8);
        rollingBallRef.current.scale.setScalar(1.2);
        rollingBallRef.current.rotation.y += delta * 1.5;
      } else {
        // Completely hidden when chest is closed
        rollingBallRef.current.scale.setScalar(0);
        rollingBallRef.current.position.set(activeChest.x, 0.5, -0.3);
      }
    }
  });

  return (
    <group position={[0, -0.5, 0]}>
      {/* ── Dramatic Spotlight ── */}
      <spotLight
        ref={spotlightRef}
        position={[0, 8.5, 4.2]}
        target-position={[0, 0.5, 1.8]}
        intensity={phase === 'observation' ? 4.8 : 2.5}
        angle={0.65}
        penumbra={0.4}
        color="#fffbeb"
        castShadow
      />

      {/* ── Ornate Stage Table Base ── */}
      <mesh position={[0, 0.15, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[4.5, 4.9, 0.3, 36]} />
        <meshStandardMaterial color="#3b1b08" roughness={0.7} />
      </mesh>
      {/* Red Velvet Table Runner */}
      <mesh position={[0, 0.32, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[4.1, 4.4, 0.08, 36]} />
        <meshStandardMaterial color="#991b1b" roughness={0.8} />
      </mesh>
      {/* Brass Table Rim */}
      <mesh position={[0, 0.38, 0]}>
        <cylinderGeometry args={[4.12, 4.12, 0.04, 36]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* ═════════════════════════════════════════════════════════════
          DYNAMIC 3D MINECRAFT CHESTS ROW (3, 4, or 5 CHESTS)
          ═════════════════════════════════════════════════════════════ */}
      {chests.map((chest) => (
        <MinecraftChest3D
          key={chest.id}
          chest={chest}
          isOpen={phase === 'operating' || phase === 'observation' || phase === 'batch-trials'}
          isWinningChest={chest.id === activeChest.id}
        />
      ))}

      {/* ── Front Golden Spotlight Prize Platter ── */}
      <group position={[0, 0.35, 1.8]}>
        {/* Platter Wooden Pedestal */}
        <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.92, 1.02, 0.16, 32]} />
          <meshStandardMaterial color="#27180c" roughness={0.7} />
        </mesh>
        {/* Platter Gold Ring Rim Base */}
        <mesh position={[0, 0.17, 0]} receiveShadow>
          <cylinderGeometry args={[0.85, 0.85, 0.03, 32]} />
          <meshStandardMaterial color="#fbbf24" roughness={0.25} metalness={0.85} />
        </mesh>
        {/* Center Red Felt Cloth */}
        <mesh position={[0, 0.186, 0]} receiveShadow>
          <cylinderGeometry args={[0.76, 0.76, 0.015, 32]} />
          <meshStandardMaterial color="#b91c1c" roughness={0.9} />
        </mesh>
        {/* Platter Torus Rim lying completely flat in horizontal XZ plane */}
        <mesh position={[0, 0.19, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.8, 0.025, 16, 32]} />
          <meshStandardMaterial color="#ca8a04" metalness={0.95} roughness={0.15} />
        </mesh>
      </group>

      {/* ── Active Drawn Probability Ball ── */}
      <mesh ref={rollingBallRef} castShadow>
        <sphereGeometry args={[0.24, 32, 32]} />
        <meshStandardMaterial
          color={activeColor}
          roughness={0.15}
          metalness={0.3}
          emissive={activeColor}
          emissiveIntensity={phase === 'observation' ? 0.45 : 0.08}
        />
      </mesh>
    </group>
  );
};

// ═══════════════════════════════════════════════════════════════
// AUTHENTIC MINECRAFT 3D CHEST COMPONENT
// Sealed Minecraft Voxel Chest (Zero Balls Visible when Closed!)
// ═══════════════════════════════════════════════════════════════
const MinecraftChest3D: React.FC<{
  chest: ChestData;
  isOpen: boolean;
  isWinningChest: boolean;
}> = ({ chest, isOpen, isWinningChest }) => {
  const lidRef = useRef<THREE.Group>(null);

  // Minecraft chest dimensions (in local units):
  // Width: 1.15, Depth: 1.15
  // Base Box Height: 0.65 (y: 0 to 0.65)
  // Lid Height: 0.25 (y: 0.65 to 0.90)
  // Total Height: 0.90
  const W = 1.15;
  const D = 1.15;
  const H_base = 0.62;
  const H_lid = 0.24;

  useFrame((_, delta) => {
    if (lidRef.current) {
      // Minecraft chest lid opens backward ~105 degrees (-1.85 rad)
      const targetAngle = isOpen && isWinningChest ? -1.85 : 0;
      lidRef.current.rotation.x = THREE.MathUtils.lerp(
        lidRef.current.rotation.x,
        targetAngle,
        delta * 6.0
      );
    }
  });

  const scale = chest.scale || 1.0;

  // Pixel-perfect Minecraft / Neo-Brutalist Label Texture
  const labelTexture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 72;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Neo-Brutalist yellow fill
      ctx.fillStyle = '#FED500';
      ctx.fillRect(0, 0, 256, 72);
      // Heavy black Minecraft pixel border
      ctx.lineWidth = 10;
      ctx.strokeStyle = '#000000';
      ctx.strokeRect(5, 5, 246, 62);
      // High-contrast bold typography
      ctx.fillStyle = '#000000';
      ctx.font = '900 32px Inter, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(chest.label, 128, 38);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, [chest.label]);

  return (
    <group position={[chest.x, 0.40, -0.3]} scale={[scale, scale, scale]}>
      {/* ═════════════════════════════════════════════════════════
          1. MINECRAFT LOWER CHEST BOX BASE (y: 0 to H_base)
          ═════════════════════════════════════════════════════════ */}
      {/* Dark Oak Frame Outer Box */}
      <mesh position={[0, H_base / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[W, H_base, D]} />
        <meshStandardMaterial color={chest.color} roughness={0.75} />
      </mesh>

      {/* Front Oak Wood Plank Inset */}
      <mesh position={[0, H_base / 2, D / 2 + 0.005]} castShadow>
        <boxGeometry args={[W - 0.14, H_base - 0.12, 0.01]} />
        <meshStandardMaterial color={chest.plankColor} roughness={0.65} />
      </mesh>
      {/* Horizontal Plank Slat Lines on Front */}
      {[-0.12, 0.12].map((yOff, i) => (
        <mesh key={`front-line-${i}`} position={[0, H_base / 2 + yOff, D / 2 + 0.008]}>
          <boxGeometry args={[W - 0.14, 0.02, 0.01]} />
          <meshStandardMaterial color="#1a0f08" roughness={0.8} />
        </mesh>
      ))}

      {/* Left & Right Oak Wood Plank Insets */}
      <mesh position={[-W / 2 - 0.005, H_base / 2, 0]} castShadow>
        <boxGeometry args={[0.01, H_base - 0.12, D - 0.14]} />
        <meshStandardMaterial color={chest.plankColor} roughness={0.65} />
      </mesh>
      <mesh position={[W / 2 + 0.005, H_base / 2, 0]} castShadow>
        <boxGeometry args={[0.01, H_base - 0.12, D - 0.14]} />
        <meshStandardMaterial color={chest.plankColor} roughness={0.65} />
      </mesh>

      {/* Back Oak Wood Plank Inset */}
      <mesh position={[0, H_base / 2, -D / 2 - 0.005]} castShadow>
        <boxGeometry args={[W - 0.14, H_base - 0.12, 0.01]} />
        <meshStandardMaterial color={chest.plankColor} roughness={0.65} />
      </mesh>

      {/* Dark Enclosed Inner Cavity */}
      <mesh position={[0, H_base / 2 + 0.04, 0]}>
        <boxGeometry args={[W - 0.16, H_base - 0.08, D - 0.16]} />
        <meshStandardMaterial color="#140c06" roughness={0.9} />
      </mesh>

      {/* Bottom Lip of Iron Lock Latch (Fixed to Base Box) */}
      <mesh position={[0, H_base - 0.08, D / 2 + 0.04]} castShadow>
        <boxGeometry args={[0.16, 0.16, 0.07]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.25} />
      </mesh>

      {/* ── Neo-Brutalist High-Contrast Nametag Plate ── */}
      <group position={[0, H_base * 0.35, D / 2 + 0.01]}>
        {/* Black Shadow Plate */}
        <mesh position={[0.01, -0.01, 0]} castShadow>
          <boxGeometry args={[0.72, 0.22, 0.015]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        {/* Yellow Nametag with CanvasTexture */}
        {labelTexture && (
          <mesh position={[0, 0, 0.012]} castShadow>
            <planeGeometry args={[0.70, 0.20]} />
            <meshBasicMaterial map={labelTexture} />
          </mesh>
        )}
      </group>

      {/* ═════════════════════════════════════════════════════════
          2. MINECRAFT HINGED LID (Pivot at Back Edge [0, H_base, -D/2])
          Completely seals the top when closed!
          ═════════════════════════════════════════════════════════ */}
      <group ref={lidRef} position={[0, H_base, -D / 2]}>
        {/* Solid Lid Box (Outer Dark Oak Frame) */}
        <mesh position={[0, H_lid / 2, D / 2]} castShadow receiveShadow>
          <boxGeometry args={[W, H_lid, D]} />
          <meshStandardMaterial color={chest.color} roughness={0.75} />
        </mesh>

        {/* Top Face Oak Plank Inset */}
        <mesh position={[0, H_lid + 0.005, D / 2]} castShadow>
          <boxGeometry args={[W - 0.14, 0.01, D - 0.14]} />
          <meshStandardMaterial color={chest.plankColor} roughness={0.65} />
        </mesh>
        {/* Top Plank Slat Lines */}
        {[-0.2, 0.2].map((zOff, i) => (
          <mesh key={`top-line-${i}`} position={[0, H_lid + 0.008, D / 2 + zOff]}>
            <boxGeometry args={[W - 0.14, 0.01, 0.02]} />
            <meshStandardMaterial color="#1a0f08" roughness={0.8} />
          </mesh>
        ))}

        {/* Front Face Oak Plank Inset on Lid */}
        <mesh position={[0, H_lid / 2, D + 0.005]} castShadow>
          <boxGeometry args={[W - 0.14, H_lid - 0.06, 0.01]} />
          <meshStandardMaterial color={chest.plankColor} roughness={0.65} />
        </mesh>

        {/* Left & Right Face Oak Plank Insets on Lid */}
        <mesh position={[-W / 2 - 0.005, H_lid / 2, D / 2]} castShadow>
          <boxGeometry args={[0.01, H_lid - 0.06, D - 0.14]} />
          <meshStandardMaterial color={chest.plankColor} roughness={0.65} />
        </mesh>
        <mesh position={[W / 2 + 0.005, H_lid / 2, D / 2]} castShadow>
          <boxGeometry args={[0.01, H_lid - 0.06, D - 0.14]} />
          <meshStandardMaterial color={chest.plankColor} roughness={0.65} />
        </mesh>

        {/* Top Lip of Iron Lock Latch (Swings open with Lid) */}
        <mesh position={[0, -0.04, D + 0.04]} castShadow>
          <boxGeometry args={[0.16, 0.18, 0.07]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Keyhole slot on Iron Latch */}
        <mesh position={[0, -0.04, D + 0.078]}>
          <boxGeometry args={[0.04, 0.08, 0.01]} />
          <meshStandardMaterial color="#0f172a" roughness={0.5} />
        </mesh>
      </group>

      {/* ═════════════════════════════════════════════════════════
          3. 3D PROBABILITY BALLS DEEPLY INSIDE (Revealed only when opened)
          ═════════════════════════════════════════════════════════ */}
      {chest.balls.map((b, idx) => {
        const count = chest.balls.length;
        const cols = count > 6 ? 4 : 3;
        const col = idx % cols;
        const row = Math.floor(idx / cols);
        const bx = -0.32 + col * (0.64 / Math.max(1, cols - 1));
        const bz = -0.22 + row * 0.22;
        return (
          <mesh key={b.id} position={[bx, 0.20, bz]} castShadow>
            <sphereGeometry args={[0.11, 16, 16]} />
            <meshStandardMaterial
              color={b.color}
              roughness={0.2}
              metalness={0.2}
              emissive={b.color}
              emissiveIntensity={0.15}
            />
          </mesh>
        );
      })}
    </group>
  );
};


