// ============================================================
// THE GREAT CARNIVAL OF CHANCE — Activity Studio 3D Scene
// Authentic Victorian / Comic Neo-Brutalist Carnival Shop Booth:
// - Striped Red & Cream Canvas Tent Walls & Wooden Dado Planks
// - Scalloped Awning Valance with Golden Trim
// - Glowing Carnival Fairy String Light Bulbs & Pennant Bunting
// - Background Carnival Prize Shelves (Plushies, Trophies, Cans, Lollipops)
// - Rustic Wooden Boardwalk Flooring & Warm Festival Studio Lighting
// ============================================================

'use client';

import React, { useMemo } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCarnivalStore } from '../store/carnivalStore';
import { ActivityId } from '../types';
import { MysteryBagMachine3D } from './machines/MysteryBagMachine3D';
import { OddsWheelMachine3D } from './machines/OddsWheelMachine3D';
import { BallDropMachine3D } from './machines/BallDropMachine3D';
import { ProbabilityLabMachine3D } from './machines/ProbabilityLabMachine3D';
import { GameBuilderMachine3D } from './machines/GameBuilderMachine3D';
import { GrandCarnivalMachine3D } from './machines/GrandCarnivalMachine3D';

// Dynamic cinematic camera controller per activity
const StudioCameraRig: React.FC<{ activityId: ActivityId }> = ({ activityId }) => {
  const { camera } = useThree();

  useFrame((_, delta) => {
    const targetPos = new THREE.Vector3(0, 2.0, 10.5);
    const targetLookAt = new THREE.Vector3(0, 2.0, 0);

    if (activityId === 'odds-wheel') {
      targetPos.set(0, 2.8, 7.8);
      targetLookAt.set(0, 2.6, 0);
    } else if (activityId === 'mystery-bag') {
      targetPos.set(0, 1.8, 7.0);
      targetLookAt.set(0, 1.4, 0);
    } else if (activityId === 'ball-drop') {
      targetPos.set(0, 2.1, 7.8);
      targetLookAt.set(0, 1.8, 0);
    } else if (activityId === 'probability-lab') {
      targetPos.set(0, 2.2, 7.2);
      targetLookAt.set(0, 2.0, 0);
    } else if (activityId === 'game-builder') {
      targetPos.set(0, 2.4, 7.2);
      targetLookAt.set(0, 2.2, 0);
    } else if (activityId === 'grand-carnival') {
      targetPos.set(0, 2.6, 9.8);
      targetLookAt.set(0, 2.4, 0);
    }

    camera.position.lerp(targetPos, delta * 3.5);
    camera.lookAt(targetLookAt);
  });

  return null;
};

// ═══════════════════════════════════════════════════════════════
// CARNIVAL SHOP BOOTH 3D ENVIRONMENT (Background & Setting)
// ═══════════════════════════════════════════════════════════════
const CarnivalShopEnvironment: React.FC = () => {
  // String lights data
  const stringLights = useMemo(() => {
    const list: { id: number; pos: [number, number, number]; color: string }[] = [];
    const bulbColors = ['#fde047', '#f43f5e', '#38bdf8', '#34d399', '#fbbf24', '#c084fc'];
    const count = 15;
    for (let i = 0; i < count; i++) {
      const p = i / (count - 1);
      const x = -4.2 + p * 8.4;
      // Catenary sag curve
      const y = 4.8 - Math.sin(p * Math.PI) * 0.7;
      const z = -1.2 + Math.sin(p * Math.PI) * 0.4;
      list.push({
        id: i,
        pos: [x, y, z],
        color: bulbColors[i % bulbColors.length],
      });
    }
    return list;
  }, []);

  // Pennant bunting flags
  const buntingFlags = useMemo(() => {
    const list: { id: number; pos: [number, number, number]; color: string; rotZ: number }[] = [];
    const colors = ['#ef4444', '#3b82f6', '#eab308', '#10b981', '#ec4899', '#8b5cf6'];
    const count = 13;
    for (let i = 0; i < count; i++) {
      const p = i / (count - 1);
      const x = -3.8 + p * 7.6;
      const y = 4.5 - Math.sin(p * Math.PI) * 0.55;
      const z = -1.0;
      const rotZ = (p - 0.5) * 0.35;
      list.push({
        id: i,
        pos: [x, y, z],
        color: colors[i % colors.length],
        rotZ,
      });
    }
    return list;
  }, []);

  return (
    <group>
      {/* ── 1. Carnival Striped Canvas Back Wall (`z = -2.8`) ── */}
      <group position={[0, 2.8, -2.8]}>
        {/* Canvas Stripe Panels (Alternating Red & Pale Cream) */}
        {Array.from({ length: 21 }).map((_, i) => {
          const x = -5.0 + i * 0.5;
          const isRed = i % 2 === 0;
          return (
            <mesh key={`stripe-${i}`} position={[x, 0.4, 0]} receiveShadow>
              <boxGeometry args={[0.5, 4.6, 0.08]} />
              <meshStandardMaterial
                color={isRed ? '#dc2626' : '#fffbeb'}
                roughness={0.65}
                metalness={0.05}
              />
            </mesh>
          );
        })}

        {/* Lower Mahogany Wood Wainscoting / Dado Panel */}
        <mesh position={[0, -1.5, 0.06]} receiveShadow castShadow>
          <boxGeometry args={[10.6, 1.6, 0.12]} />
          <meshStandardMaterial color="#78350f" roughness={0.7} />
        </mesh>
        {/* Brass Wainscoting Cap Moulding */}
        <mesh position={[0, -0.68, 0.12]} castShadow>
          <boxGeometry args={[10.8, 0.08, 0.08]} />
          <meshStandardMaterial color="#ca8a04" metalness={0.85} roughness={0.2} />
        </mesh>
      </group>

      {/* ── 2. Side Booth Pillars & Arch Brackets (`x = -4.8` & `+4.8`) ── */}
      {[-4.8, 4.8].map((x, i) => (
        <group key={`booth-pillar-${i}`} position={[x, 2.4, -1.0]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.22, 0.25, 5.8, 16]} />
            <meshStandardMaterial color="#92400e" roughness={0.6} />
          </mesh>
          {/* Gold Ring Accents */}
          {[-2.2, 0, 2.2].map((y, j) => (
            <mesh key={`pillar-ring-${j}`} position={[0, y, 0]} castShadow>
              <torusGeometry args={[0.26, 0.04, 12, 24]} />
              <meshStandardMaterial color="#ca8a04" metalness={0.9} />
            </mesh>
          ))}
        </group>
      ))}

      {/* ── 3. Top Scalloped Carnival Awning Canopy (`y = 5.2`) ── */}
      <group position={[0, 5.3, -0.8]}>
        {/* Main Awning Header Bar */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[10.2, 0.35, 1.2]} />
          <meshStandardMaterial color="#b91c1c" roughness={0.5} />
        </mesh>
        {/* Golden Front Fascia Strip */}
        <mesh position={[0, 0, 0.62]} castShadow>
          <boxGeometry args={[10.4, 0.08, 0.05]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} />
        </mesh>
        {/* Scalloped Valance Flaps Hanging Down */}
        {Array.from({ length: 18 }).map((_, i) => {
          const x = -4.6 + i * 0.54;
          const isRed = i % 2 === 0;
          return (
            <mesh key={`scallop-${i}`} position={[x, -0.28, 0.6]} rotation={[0, 0, Math.PI]} castShadow>
              <cylinderGeometry args={[0.26, 0.26, 0.04, 16, 1, false, 0, Math.PI]} />
              <meshStandardMaterial color={isRed ? '#ef4444' : '#fef08a'} />
            </mesh>
          );
        })}
      </group>

      {/* ── 4. Glowing Carnival String Lights (Fairy Bulbs) ── */}
      {/* Sagging Wire */}
      <mesh position={[0, 4.45, -1.1]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.015, 0.015, 8.6, 12]} />
        <meshBasicMaterial color="#1e293b" />
      </mesh>
      {/* Light Bulbs */}
      {stringLights.map((b) => (
        <group key={`bulb-${b.id}`} position={b.pos}>
          {/* Socket Cap */}
          <mesh position={[0, 0.06, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.05, 8]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
          {/* Glowing Glass Bulb */}
          <mesh>
            <sphereGeometry args={[0.08, 14, 14]} />
            <meshStandardMaterial
              color={b.color}
              emissive={b.color}
              emissiveIntensity={1.4}
              roughness={0.1}
            />
          </mesh>
          {/* Subtle Warm Point Light for Key Bulbs */}
          {b.id % 4 === 0 && (
            <pointLight color={b.color} intensity={0.45} distance={3.5} />
          )}
        </group>
      ))}

      {/* ── 5. Festive Carnival Pennant Bunting Flags ── */}
      {buntingFlags.map((flag) => (
        <group key={`bunting-${flag.id}`} position={flag.pos} rotation={[0, 0, flag.rotZ]}>
          <mesh rotation={[0, 0, Math.PI]} castShadow>
            <coneGeometry args={[0.18, 0.38, 3]} />
            <meshStandardMaterial color={flag.color} roughness={0.5} />
          </mesh>
        </group>
      ))}

      {/* ═════════════════════════════════════════════════════════════
          6. CARNIVAL PRIZE SHELVES ON LEFT & RIGHT BACKGROUND
          ═════════════════════════════════════════════════════════════ */}

      {/* ── LEFT PRIZE SHELF (`x = -3.4, z = -2.0`) ── */}
      <group position={[-3.4, 1.8, -2.1]}>
        {/* Wooden Shelf Planks */}
        {[0, 0.9, 1.8].map((y, i) => (
          <mesh key={`l-shelf-${i}`} position={[0, y, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.8, 0.08, 0.65]} />
            <meshStandardMaterial color="#78350f" roughness={0.6} />
          </mesh>
        ))}
        {/* Brass Shelf Brackets */}
        {[-0.8, 0.8].map((x, i) => (
          <mesh key={`l-bracket-${i}`} position={[x, 0.9, -0.28]} castShadow>
            <boxGeometry args={[0.06, 1.9, 0.06]} />
            <meshStandardMaterial color="#ca8a04" metalness={0.85} />
          </mesh>
        ))}

        {/* Top Tier: Stacked Pyramid of Carnival Tin Cans */}
        <group position={[0, 1.95, 0]}>
          {[
            [-0.15, 0.1, 0],
            [0.15, 0.1, 0],
            [0, 0.35, 0],
          ].map(([cx, cy, cz], idx) => (
            <mesh key={`can-${idx}`} position={[cx, cy, cz]} castShadow>
              <cylinderGeometry args={[0.09, 0.09, 0.22, 16]} />
              <meshStandardMaterial color={idx === 2 ? '#ef4444' : '#eab308'} metalness={0.7} roughness={0.3} />
            </mesh>
          ))}
        </group>

        {/* Mid Tier: Carnival Plush Teddy Bear Prize */}
        <group position={[0, 1.15, 0]}>
          {/* Bear Body */}
          <mesh castShadow>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshStandardMaterial color="#d97706" roughness={0.8} />
          </mesh>
          {/* Bear Head */}
          <mesh position={[0, 0.22, 0.04]} castShadow>
            <sphereGeometry args={[0.13, 16, 16]} />
            <meshStandardMaterial color="#d97706" roughness={0.8} />
          </mesh>
          {/* Bear Ears */}
          {[-0.1, 0.1].map((ex, i) => (
            <mesh key={`bear-ear-${i}`} position={[ex, 0.32, 0.04]} castShadow>
              <sphereGeometry args={[0.045, 10, 10]} />
              <meshStandardMaterial color="#b45309" />
            </mesh>
          ))}
          {/* Blue Ribbon Bow */}
          <mesh position={[0, 0.12, 0.12]} castShadow>
            <boxGeometry args={[0.12, 0.06, 0.04]} />
            <meshStandardMaterial color="#2563eb" />
          </mesh>
        </group>

        {/* Bottom Tier: Stack of Mystery Gift Boxes */}
        <group position={[0, 0.2, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.38, 0.28, 0.38]} />
            <meshStandardMaterial color="#3b82f6" roughness={0.5} />
          </mesh>
          {/* Yellow Ribbon */}
          <mesh position={[0, 0, 0.01]} castShadow>
            <boxGeometry args={[0.4, 0.06, 0.4]} />
            <meshStandardMaterial color="#fed500" metalness={0.5} />
          </mesh>
        </group>
      </group>

      {/* ── RIGHT PRIZE SHELF (`x = +3.4, z = -2.0`) ── */}
      <group position={[3.4, 1.8, -2.1]}>
        {/* Wooden Shelf Planks */}
        {[0, 0.9, 1.8].map((y, i) => (
          <mesh key={`r-shelf-${i}`} position={[0, y, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.8, 0.08, 0.65]} />
            <meshStandardMaterial color="#78350f" roughness={0.6} />
          </mesh>
        ))}
        {/* Brass Shelf Brackets */}
        {[-0.8, 0.8].map((x, i) => (
          <mesh key={`r-bracket-${i}`} position={[x, 0.9, -0.28]} castShadow>
            <boxGeometry args={[0.06, 1.9, 0.06]} />
            <meshStandardMaterial color="#ca8a04" metalness={0.85} />
          </mesh>
        ))}

        {/* Top Tier: Golden Star Championship Trophy */}
        <group position={[0, 1.95, 0]}>
          <mesh position={[0, 0.06, 0]} castShadow>
            <cylinderGeometry args={[0.12, 0.16, 0.12, 16]} />
            <meshStandardMaterial color="#1e293b" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.22, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.2, 12]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.95} />
          </mesh>
          <mesh position={[0, 0.36, 0]} castShadow>
            <sphereGeometry args={[0.14, 16, 16]} />
            <meshStandardMaterial color="#fde047" metalness={0.95} roughness={0.15} />
          </mesh>
        </group>

        {/* Mid Tier: Giant Carnival Swirl Lollipop Prop */}
        <group position={[0, 1.25, 0]} rotation={[0, 0, 0.2]}>
          {/* Stick */}
          <mesh position={[0, -0.15, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.45, 8]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          {/* Candy Disc */}
          <mesh position={[0, 0.15, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.2, 0.05, 24]} />
            <meshStandardMaterial color="#ec4899" roughness={0.3} />
          </mesh>
        </group>

        {/* Bottom Tier: Stack of Gold Carnival Tickets & Tokens */}
        <group position={[0, 0.18, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.42, 0.14, 0.28]} />
            <meshStandardMaterial color="#fed500" roughness={0.4} metalness={0.4} />
          </mesh>
        </group>
      </group>

      {/* ── 7. Rustic Boardwalk Wooden Plank Flooring (`y = -0.5`) ── */}
      <group position={[0, -0.55, 0]}>
        {/* Main Floor Foundation */}
        <mesh receiveShadow>
          <boxGeometry args={[14, 0.25, 10]} />
          <meshStandardMaterial color="#451a03" roughness={0.8} />
        </mesh>
        {/* Planks Overlay */}
        {Array.from({ length: 14 }).map((_, i) => {
          const z = -4.5 + i * 0.7;
          const isAlt = i % 2 === 0;
          return (
            <mesh key={`plank-${i}`} position={[0, 0.13, z]} receiveShadow>
              <boxGeometry args={[13.8, 0.02, 0.65]} />
              <meshStandardMaterial
                color={isAlt ? '#78350f' : '#92400e'}
                roughness={0.7}
              />
            </mesh>
          );
        })}
      </group>
    </group>
  );
};

export const ActivityStudioScene: React.FC = () => {
  const activeActivity = useCarnivalStore((s) => s.activeActivity);

  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        camera={{ position: [0, 2.0, 10.5], fov: 40 }}
        gl={{ antialias: true, alpha: false }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.25;
        }}
      >
        {/* Warm Ambient Carnival Shop Sky/Ceiling Color */}
        <color attach="background" args={['#2e1065']} />

        {/* Dynamic Activity-Specific Camera Rig */}
        <StudioCameraRig activityId={activeActivity} />

        {/* Warm Carnival Booth Lighting */}
        <ambientLight intensity={0.9} color="#fffbeb" />
        <directionalLight
          position={[5, 11, 7]}
          intensity={2.0}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          color="#fef3c7"
        />
        <directionalLight position={[-5, 5, -2]} intensity={0.6} color="#fed7aa" />

        {/* ── Complete 3D Carnival Shop Booth Setting ── */}
        <CarnivalShopEnvironment />

        {/* ── Active 3D Mini-Game Physical Machine ── */}
        {activeActivity === 'mystery-bag' && <MysteryBagMachine3D />}
        {activeActivity === 'odds-wheel' && <OddsWheelMachine3D />}
        {activeActivity === 'ball-drop' && <BallDropMachine3D />}
        {activeActivity === 'probability-lab' && <ProbabilityLabMachine3D />}
        {activeActivity === 'game-builder' && <GameBuilderMachine3D />}
        {activeActivity === 'grand-carnival' && <GrandCarnivalMachine3D />}
      </Canvas>
    </div>
  );
};
