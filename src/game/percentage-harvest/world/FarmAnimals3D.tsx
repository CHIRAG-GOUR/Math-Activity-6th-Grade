// ============================================================
// PERCENTAGE HARVEST — 3D DEDICATED ANIMAL ENCLOSURES & ORGANIC WANDERING
// Dedicated Cattle Ranch, Poultry Farm Chicken Run, and Goat/Sheep Pen in the Back Sector
// Organic multi-directional wandering kinematics, grazing pauses, pecking & tail swishing
// ============================================================

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { FarmMaterialsCache } from './FarmMaterials';
import { farmAudio } from '../engine/farmAudio';

// ─────────────────────────────────────────────────────────────
// 1. HYPER-REALISTIC WING-FLAPPING SKY BIRD
// ─────────────────────────────────────────────────────────────
const RealisticBird: React.FC<{
  offset: [number, number, number];
  speed: number;
  wingBeatSpeed: number;
  flapOffset: number;
}> = ({ offset, speed, wingBeatSpeed, flapOffset }) => {
  const mats = FarmMaterialsCache.get();
  const leftWingRef = useRef<THREE.Group>(null);
  const rightWingRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const flapAngle = Math.sin(time * wingBeatSpeed + flapOffset) * 0.65;
    if (leftWingRef.current) leftWingRef.current.rotation.z = flapAngle;
    if (rightWingRef.current) rightWingRef.current.rotation.z = -flapAngle;

    if (bodyRef.current) {
      bodyRef.current.position.y = offset[1] + Math.sin(time * wingBeatSpeed + flapOffset) * 0.05;
      bodyRef.current.rotation.z = Math.sin(time * 2 + flapOffset) * 0.08;
    }
  });

  return (
    <group ref={bodyRef} position={offset}>
      <mesh castShadow material={mats.hairDark}>
        <coneGeometry args={[0.09, 0.45, 6]} />
      </mesh>
      <mesh position={[0, 0.22, 0.04]} material={mats.hairDark}>
        <sphereGeometry args={[0.07, 6, 6]} />
      </mesh>
      <mesh position={[0, 0.26, 0.08]} rotation={[0.4, 0, 0]} material={mats.strawHat}>
        <coneGeometry args={[0.025, 0.09, 4]} />
      </mesh>
      <mesh position={[0, -0.26, 0]} material={mats.hairDark}>
        <boxGeometry args={[0.12, 0.16, 0.02]} />
      </mesh>

      <group ref={leftWingRef} position={[-0.06, 0.05, 0]}>
        <mesh position={[-0.2, 0, 0]} rotation={[0, 0, 0.1]} material={mats.hairDark}>
          <boxGeometry args={[0.38, 0.14, 0.02]} />
        </mesh>
        <mesh position={[-0.45, -0.02, 0]} rotation={[0, 0, -0.2]} material={mats.hairDark}>
          <boxGeometry args={[0.22, 0.1, 0.015]} />
        </mesh>
      </group>

      <group ref={rightWingRef} position={[0.06, 0.05, 0]}>
        <mesh position={[0.2, 0, 0]} rotation={[0, 0, -0.1]} material={mats.hairDark}>
          <boxGeometry args={[0.38, 0.14, 0.02]} />
        </mesh>
        <mesh position={[0.45, -0.02, 0]} rotation={[0, 0, 0.2]} material={mats.hairDark}>
          <boxGeometry args={[0.22, 0.1, 0.015]} />
        </mesh>
      </group>
    </group>
  );
};

// ─────────────────────────────────────────────────────────────
// 2. HOLSTEIN DAIRY COW WITH ORGANIC WANDERING
// ─────────────────────────────────────────────────────────────
interface OrganicCowProps {
  baseCenter: [number, number, number];
  bounds: { minX: number; maxX: number; minZ: number; maxZ: number };
  seed: number;
}

const OrganicCow: React.FC<OrganicCowProps> = ({ baseCenter, bounds, seed }) => {
  const mats = FarmMaterialsCache.get();
  const rootRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const tailRef = useRef<THREE.Group>(null);
  const legFLRef = useRef<THREE.Group>(null);
  const legFRRef = useRef<THREE.Group>(null);
  const legBLRef = useRef<THREE.Group>(null);
  const legBRRef = useRef<THREE.Group>(null);

  const prevPos = useRef(new THREE.Vector3(baseCenter[0], baseCenter[1], baseCenter[2]));

  useFrame((state) => {
    const time = state.clock.getElapsedTime() * 0.4 + seed * 10;
    
    // Multi-harmonic organic wandering
    const rx = Math.sin(time * 0.7) * 1.8 + Math.cos(time * 0.35 + seed) * 1.2;
    const rz = Math.cos(time * 0.6) * 1.6 + Math.sin(time * 0.28 + seed) * 1.0;

    const targetX = Math.max(bounds.minX, Math.min(bounds.maxX, baseCenter[0] + rx));
    const targetZ = Math.max(bounds.minZ, Math.min(bounds.maxZ, baseCenter[2] + rz));

    const dx = targetX - prevPos.current.x;
    const dz = targetZ - prevPos.current.z;
    const distMoved = Math.sqrt(dx * dx + dz * dz);
    const isWalking = distMoved > 0.002;

    if (rootRef.current) {
      rootRef.current.position.set(targetX, baseCenter[1], targetZ);
      if (isWalking) {
        const targetRot = Math.atan2(dx, dz);
        rootRef.current.rotation.y = THREE.MathUtils.lerp(rootRef.current.rotation.y, targetRot, 0.08);
      }
    }

    prevPos.current.set(targetX, baseCenter[1], targetZ);

    if (isWalking) {
      const walk = Math.sin(state.clock.getElapsedTime() * 4.5 + seed);
      if (legFLRef.current) legFLRef.current.rotation.x = walk * 0.4;
      if (legBRRef.current) legBRRef.current.rotation.x = walk * 0.4;
      if (legFRRef.current) legFRRef.current.rotation.x = -walk * 0.4;
      if (legBLRef.current) legBLRef.current.rotation.x = -walk * 0.4;

      if (headRef.current) {
        headRef.current.rotation.x = 0.15 + Math.sin(state.clock.getElapsedTime() * 2.2) * 0.06;
      }
    } else {
      // Grazing & chewing grass
      if (legFLRef.current) legFLRef.current.rotation.x = 0;
      if (legFRRef.current) legFRRef.current.rotation.x = 0;
      if (legBLRef.current) legBLRef.current.rotation.x = 0;
      if (legBRRef.current) legBRRef.current.rotation.x = 0;

      if (headRef.current) {
        headRef.current.rotation.x = 0.65 + Math.sin(state.clock.getElapsedTime() * 3.5) * 0.05;
      }
    }

    if (tailRef.current) {
      tailRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 2.8 + seed) * 0.35;
    }
  });

  return (
    <group
      ref={rootRef}
      position={baseCenter}
      onPointerDown={(e) => {
        e.stopPropagation();
        farmAudio.unlock();
        farmAudio.playCowMoo();
      }}
    >
      <mesh position={[0, 0.8, 0]} castShadow material={mats.cowHideWhite}>
        <boxGeometry args={[0.95, 0.75, 1.45]} />
      </mesh>
      <mesh position={[0.485, 0.85, 0.2]} material={mats.cowHideBlack}>
        <boxGeometry args={[0.02, 0.4, 0.5]} />
      </mesh>
      <mesh position={[-0.485, 0.75, -0.25]} material={mats.cowHideBlack}>
        <boxGeometry args={[0.02, 0.45, 0.55]} />
      </mesh>

      <group ref={headRef} position={[0, 1.1, 0.8]}>
        <mesh castShadow material={mats.cowHideWhite}>
          <boxGeometry args={[0.48, 0.48, 0.58]} />
        </mesh>
        <mesh position={[0.245, 0.1, 0.1]} material={mats.cowHideBlack}>
          <boxGeometry args={[0.02, 0.2, 0.25]} />
        </mesh>
        <mesh position={[0, -0.1, 0.32]} material={mats.skinTone1}>
          <boxGeometry args={[0.38, 0.22, 0.18]} />
        </mesh>
        {[-0.22, 0.22].map((hx) => (
          <mesh key={`cow-horn-${hx}`} position={[hx, 0.28, 0]} rotation={[0.2, 0, (hx < 0 ? -0.3 : 0.3)]} material={mats.strawHat}>
            <coneGeometry args={[0.04, 0.2, 5]} />
          </mesh>
        ))}
      </group>

      <group ref={tailRef} position={[0, 1.0, -0.75]}>
        <mesh position={[0, -0.25, 0]} material={mats.cowHideWhite}>
          <cylinderGeometry args={[0.02, 0.02, 0.5, 4]} />
        </mesh>
        <mesh position={[0, -0.52, 0]} material={mats.hairDark}>
          <coneGeometry args={[0.05, 0.14, 5]} />
        </mesh>
      </group>

      <group ref={legFLRef} position={[-0.34, 0.45, 0.48]}>
        <mesh position={[0, -0.22, 0]} castShadow material={mats.cowHideWhite}>
          <cylinderGeometry args={[0.075, 0.065, 0.45, 6]} />
        </mesh>
      </group>
      <group ref={legFRRef} position={[0.34, 0.45, 0.48]}>
        <mesh position={[0, -0.22, 0]} castShadow material={mats.cowHideWhite}>
          <cylinderGeometry args={[0.075, 0.065, 0.45, 6]} />
        </mesh>
      </group>
      <group ref={legBLRef} position={[-0.34, 0.45, -0.48]}>
        <mesh position={[0, -0.22, 0]} castShadow material={mats.cowHideWhite}>
          <cylinderGeometry args={[0.075, 0.065, 0.45, 6]} />
        </mesh>
      </group>
      <group ref={legBRRef} position={[0.34, 0.45, -0.48]}>
        <mesh position={[0, -0.22, 0]} castShadow material={mats.cowHideWhite}>
          <cylinderGeometry args={[0.075, 0.065, 0.45, 6]} />
        </mesh>
      </group>
    </group>
  );
};

// ─────────────────────────────────────────────────────────────
// 3. GOATS & SHEEP WITH ORGANIC WANDERING IN BACK PEN
// ─────────────────────────────────────────────────────────────
interface OrganicGoatProps {
  baseCenter: [number, number, number];
  bounds: { minX: number; maxX: number; minZ: number; maxZ: number };
  seed: number;
  isGoat?: boolean;
}

const OrganicGoat: React.FC<OrganicGoatProps> = ({ baseCenter, bounds, seed, isGoat = true }) => {
  const mats = FarmMaterialsCache.get();
  const rootRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const tailRef = useRef<THREE.Group>(null);
  const legFLRef = useRef<THREE.Group>(null);
  const legFRRef = useRef<THREE.Group>(null);
  const legBLRef = useRef<THREE.Group>(null);
  const legBRRef = useRef<THREE.Group>(null);

  const prevPos = useRef(new THREE.Vector3(baseCenter[0], baseCenter[1], baseCenter[2]));

  useFrame((state) => {
    const time = state.clock.getElapsedTime() * 0.5 + seed * 8;
    const rx = Math.sin(time * 0.8) * 1.5 + Math.cos(time * 0.4 + seed) * 1.0;
    const rz = Math.cos(time * 0.7) * 1.3 + Math.sin(time * 0.35 + seed) * 0.9;

    const targetX = Math.max(bounds.minX, Math.min(bounds.maxX, baseCenter[0] + rx));
    const targetZ = Math.max(bounds.minZ, Math.min(bounds.maxZ, baseCenter[2] + rz));

    const dx = targetX - prevPos.current.x;
    const dz = targetZ - prevPos.current.z;
    const distMoved = Math.sqrt(dx * dx + dz * dz);
    const isTrotting = distMoved > 0.002;

    if (rootRef.current) {
      rootRef.current.position.set(targetX, baseCenter[1], targetZ);
      if (isTrotting) {
        const targetRot = Math.atan2(dx, dz);
        rootRef.current.rotation.y = THREE.MathUtils.lerp(rootRef.current.rotation.y, targetRot, 0.1);
      }
    }

    prevPos.current.set(targetX, baseCenter[1], targetZ);

    if (isTrotting) {
      const trot = Math.sin(state.clock.getElapsedTime() * 6.5 + seed);
      if (legFLRef.current) legFLRef.current.rotation.x = trot * 0.45;
      if (legBRRef.current) legBRRef.current.rotation.x = trot * 0.45;
      if (legFRRef.current) legFRRef.current.rotation.x = -trot * 0.45;
      if (legBLRef.current) legBLRef.current.rotation.x = -trot * 0.45;

      if (headRef.current) {
        headRef.current.rotation.x = 0.1 + Math.sin(state.clock.getElapsedTime() * 3.2) * 0.1;
      }
    } else {
      if (legFLRef.current) legFLRef.current.rotation.x = 0;
      if (legFRRef.current) legFRRef.current.rotation.x = 0;
      if (legBLRef.current) legBLRef.current.rotation.x = 0;
      if (legBRRef.current) legBRRef.current.rotation.x = 0;

      if (headRef.current) {
        headRef.current.rotation.x = 0.6 + Math.sin(state.clock.getElapsedTime() * 4.0) * 0.08;
      }
    }

    if (tailRef.current) {
      tailRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 4.5 + seed) * 0.4;
    }
  });

  return (
    <group
      ref={rootRef}
      position={baseCenter}
      onPointerDown={(e) => {
        e.stopPropagation();
        farmAudio.unlock();
        farmAudio.playGoatBleat();
      }}
    >
      {isGoat ? (
        <mesh position={[0, 0.55, 0]} castShadow material={mats.marketWall}>
          <boxGeometry args={[0.55, 0.5, 0.95]} />
        </mesh>
      ) : (
        <mesh position={[0, 0.58, 0]} castShadow material={mats.sheepWool}>
          <sphereGeometry args={[0.48, 10, 10]} />
        </mesh>
      )}

      <group ref={headRef} position={[0, 0.8, 0.45]}>
        <mesh castShadow material={isGoat ? mats.marketWall : mats.hairDark}>
          <boxGeometry args={[0.26, 0.28, 0.38]} />
        </mesh>
        <mesh position={[0, -0.06, 0.22]} material={mats.skinTone1}>
          <boxGeometry args={[0.18, 0.14, 0.12]} />
        </mesh>
        {[-0.1, 0.1].map((hx) => (
          <mesh
            key={`goat-horn-${hx}`}
            position={[hx, 0.18, -0.05]}
            rotation={[-0.4, 0, (hx < 0 ? -0.2 : 0.2)]}
            material={mats.woodTimber}
          >
            <coneGeometry args={[0.025, 0.18, 4]} />
          </mesh>
        ))}
        {isGoat && (
          <mesh position={[0, -0.16, 0.15]} material={mats.strawHat}>
            <coneGeometry args={[0.04, 0.1, 4]} />
          </mesh>
        )}
      </group>

      <group ref={tailRef} position={[0, 0.7, -0.5]}>
        <mesh position={[0, 0.08, 0]} material={mats.marketWall}>
          <cylinderGeometry args={[0.02, 0.02, 0.16, 4]} />
        </mesh>
      </group>

      <group ref={legFLRef} position={[-0.2, 0.32, 0.32]}>
        <mesh position={[0, -0.15, 0]} castShadow material={mats.hairDark}>
          <cylinderGeometry args={[0.035, 0.035, 0.32, 5]} />
        </mesh>
      </group>
      <group ref={legFRRef} position={[0.2, 0.32, 0.32]}>
        <mesh position={[0, -0.15, 0]} castShadow material={mats.hairDark}>
          <cylinderGeometry args={[0.035, 0.035, 0.32, 5]} />
        </mesh>
      </group>
      <group ref={legBLRef} position={[-0.2, 0.32, -0.32]}>
        <mesh position={[0, -0.15, 0]} castShadow material={mats.hairDark}>
          <cylinderGeometry args={[0.035, 0.035, 0.32, 5]} />
        </mesh>
      </group>
      <group ref={legBRRef} position={[0.2, 0.32, -0.32]}>
        <mesh position={[0, -0.15, 0]} castShadow material={mats.hairDark}>
          <cylinderGeometry args={[0.035, 0.035, 0.32, 5]} />
        </mesh>
      </group>
    </group>
  );
};

// ─────────────────────────────────────────────────────────────
// 4. ORGANIC CHICKENS SCURRYING & PECKING IN POULTRY RUN
// ─────────────────────────────────────────────────────────────
interface OrganicChickenProps {
  baseCenter: [number, number, number];
  bounds: { minX: number; maxX: number; minZ: number; maxZ: number };
  seed: number;
}

const OrganicChicken: React.FC<OrganicChickenProps> = ({ baseCenter, bounds, seed }) => {
  const mats = FarmMaterialsCache.get();
  const rootRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);

  const prevPos = useRef(new THREE.Vector3(baseCenter[0], baseCenter[1], baseCenter[2]));

  useFrame((state) => {
    const time = state.clock.getElapsedTime() * 0.8 + seed * 6;
    const rx = Math.sin(time * 0.9) * 1.2 + Math.cos(time * 0.5 + seed) * 0.8;
    const rz = Math.cos(time * 0.8) * 1.0 + Math.sin(time * 0.45 + seed) * 0.7;

    const targetX = Math.max(bounds.minX, Math.min(bounds.maxX, baseCenter[0] + rx));
    const targetZ = Math.max(bounds.minZ, Math.min(bounds.maxZ, baseCenter[2] + rz));

    const dx = targetX - prevPos.current.x;
    const dz = targetZ - prevPos.current.z;
    const distMoved = Math.sqrt(dx * dx + dz * dz);
    const isRunning = distMoved > 0.002;

    if (rootRef.current) {
      rootRef.current.position.set(targetX, baseCenter[1], targetZ);
      if (isRunning) {
        const targetRot = Math.atan2(dx, dz);
        rootRef.current.rotation.y = THREE.MathUtils.lerp(rootRef.current.rotation.y, targetRot, 0.15);
      }
    }

    prevPos.current.set(targetX, baseCenter[1], targetZ);

    if (isRunning) {
      const step = Math.sin(state.clock.getElapsedTime() * 14.0 + seed);
      if (leftLegRef.current) leftLegRef.current.rotation.x = step * 0.5;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -step * 0.5;

      if (headRef.current) {
        headRef.current.rotation.x = Math.max(0, Math.sin(state.clock.getElapsedTime() * 8.0)) * 0.6;
      }
    } else {
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0;
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0;
      if (headRef.current) {
        headRef.current.rotation.x = Math.max(0, Math.sin(state.clock.getElapsedTime() * 6.0 + seed)) * 0.8;
      }
    }
  });

  return (
    <group
      ref={rootRef}
      position={baseCenter}
      onPointerDown={(e) => {
        e.stopPropagation();
        farmAudio.unlock();
        farmAudio.playChickenCluck();
      }}
    >
      <mesh position={[0, 0.22, 0]} castShadow material={mats.chickenFeather}>
        <sphereGeometry args={[0.16, 8, 8]} />
      </mesh>
      <mesh position={[0, 0.28, -0.14]} rotation={[-0.6, 0, 0]} material={mats.hairBrown}>
        <boxGeometry args={[0.08, 0.14, 0.02]} />
      </mesh>
      <group ref={headRef} position={[0, 0.34, 0.12]}>
        <mesh material={mats.chickenFeather}>
          <sphereGeometry args={[0.08, 6, 6]} />
        </mesh>
        <mesh position={[0, 0.09, 0]} material={mats.tomatoFruit}>
          <boxGeometry args={[0.03, 0.07, 0.08]} />
        </mesh>
        <mesh position={[0, -0.02, 0.08]} material={mats.yellowBoots}>
          <coneGeometry args={[0.03, 0.08, 4]} />
        </mesh>
      </group>
      <group ref={leftLegRef} position={[-0.05, 0.1, 0]}>
        <mesh position={[0, -0.05, 0]} material={mats.yellowBoots}>
          <cylinderGeometry args={[0.015, 0.015, 0.12, 4]} />
        </mesh>
      </group>
      <group ref={rightLegRef} position={[0.05, 0.1, 0]}>
        <mesh position={[0, -0.05, 0]} material={mats.yellowBoots}>
          <cylinderGeometry args={[0.015, 0.015, 0.12, 4]} />
        </mesh>
      </group>
    </group>
  );
};

// ─────────────────────────────────────────────────────────────
// 5. MAIN COMPONENT WITH DEDICATED ANIMAL ENCLOSURES
// ─────────────────────────────────────────────────────────────
export const FarmAnimals3D: React.FC = () => {
  const mats = FarmMaterialsCache.get();
  const flock1Ref = useRef<THREE.Group>(null);
  const flock2Ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (flock1Ref.current) {
      const a = time * 0.25;
      flock1Ref.current.position.x = Math.cos(a) * 18;
      flock1Ref.current.position.z = Math.sin(a) * 14 - 2;
      flock1Ref.current.rotation.y = -a + Math.PI / 2;
    }
    if (flock2Ref.current) {
      const a = -time * 0.18 + 2.0;
      flock2Ref.current.position.x = Math.cos(a) * 22;
      flock2Ref.current.position.z = Math.sin(a) * 16;
      flock2Ref.current.rotation.y = -a - Math.PI / 2;
    }
  });

  return (
    <group>
      {/* ─────────────────────────────────────────────────────────────
          1. CATTLE RANCH & DAIRY PASTURE (BACK LEFT: x = -8.5, z = -14)
          ───────────────────────────────────────────────────────────── */}
      <group position={[-8.5, 0, -14]}>
        {/* Pasture Dirt/Grass Bed */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 0]} receiveShadow material={mats.pastureGrass}>
          <planeGeometry args={[6.5, 5.5]} />
        </mesh>

        {/* Wooden Perimeter Fence Rails */}
        {[-3.2, 3.2].map((fx) => (
          <mesh key={`cow-fence-x-${fx}`} position={[fx, 0.45, 0]} material={mats.woodTimber}>
            <boxGeometry args={[0.1, 0.9, 5.5]} />
          </mesh>
        ))}
        {[-2.7, 2.7].map((fz) => (
          <mesh key={`cow-fence-z-${fz}`} position={[0, 0.45, fz]} material={mats.woodTimber}>
            <boxGeometry args={[6.5, 0.9, 0.1]} />
          </mesh>
        ))}

        {/* Rustic Hay Bales & Feed Trough */}
        <group position={[-2.2, 0, -1.8]}>
          <mesh position={[0, 0.35, 0]} castShadow material={mats.wheatGolden}>
            <boxGeometry args={[1.2, 0.7, 0.8]} />
          </mesh>
          <mesh position={[0.2, 0.9, 0]} castShadow material={mats.wheatGolden}>
            <boxGeometry args={[0.9, 0.5, 0.7]} />
          </mesh>
        </group>
        {/* Water Trough */}
        <group position={[2.0, 0, -1.8]}>
          <mesh position={[0, 0.25, 0]} material={mats.scalePadSteel}>
            <boxGeometry args={[1.4, 0.5, 0.7]} />
          </mesh>
          <mesh position={[0, 0.35, 0]} material={mats.waterRiver}>
            <boxGeometry args={[1.2, 0.1, 0.55]} />
          </mesh>
        </group>

        {/* 2 Holstein Cows with organic random wandering */}
        <OrganicCow
          baseCenter={[0.5, 0, 0.5]}
          bounds={{ minX: -7.5, maxX: -4.5, minZ: -16.0, maxZ: -12.0 }}
          seed={1.2}
        />
        <OrganicCow
          baseCenter={[-1.2, 0, -0.5]}
          bounds={{ minX: -10.5, maxX: -7.0, minZ: -16.0, maxZ: -12.0 }}
          seed={3.8}
        />
      </group>

      {/* ─────────────────────────────────────────────────────────────
          2. POULTRY FARM CHICKEN COOP & RUN (BACK CENTER: x = 0, z = -14.5)
          ───────────────────────────────────────────────────────────── */}
      <group position={[0, 0, -14.5]}>
        {/* Poultry Run Straw Base */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 0]} receiveShadow material={mats.grainSack}>
          <planeGeometry args={[5.5, 4.5]} />
        </mesh>

        {/* Wooden Chicken Coop House */}
        <group position={[-1.8, 0, -1.0]}>
          <mesh position={[0, 1.0, 0]} castShadow material={mats.redBarnWall}>
            <boxGeometry args={[1.6, 1.8, 1.6]} />
          </mesh>
          <mesh position={[0, 2.1, 0]} rotation={[0, Math.PI / 4, 0]} castShadow material={mats.roofShingles}>
            <coneGeometry args={[1.4, 1.0, 4]} />
          </mesh>
          {/* Ramp */}
          <mesh position={[0.7, 0.35, 0.5]} rotation={[0.4, 0, -0.6]} material={mats.woodTimber}>
            <boxGeometry args={[0.9, 0.05, 0.35]} />
          </mesh>
          {/* Nesting Perch */}
          <mesh position={[0, 0.6, 0.82]} material={mats.woodPlanks}>
            <boxGeometry args={[0.5, 0.6, 0.05]} />
          </mesh>
        </group>

        {/* Chicken Run Wire Mesh Fencing */}
        {[-2.7, 2.7].map((fx) => (
          <mesh key={`chick-fence-x-${fx}`} position={[fx, 0.4, 0]} material={mats.woodTimber}>
            <boxGeometry args={[0.08, 0.8, 4.5]} />
          </mesh>
        ))}
        {[-2.2, 2.2].map((fz) => (
          <mesh key={`chick-fence-z-${fz}`} position={[0, 0.4, fz]} material={mats.woodTimber}>
            <boxGeometry args={[5.5, 0.8, 0.08]} />
          </mesh>
        ))}

        {/* Grain Feeding Trough */}
        <mesh position={[1.2, 0.1, 0]} material={mats.woodPlanks}>
          <boxGeometry args={[0.3, 0.2, 1.4]} />
        </mesh>

        {/* 4 Active Chickens scurrying and pecking */}
        <OrganicChicken
          baseCenter={[0.5, 0, 0.8]}
          bounds={{ minX: -2.0, maxX: 2.2, minZ: -16.0, maxZ: -12.8 }}
          seed={0.4}
        />
        <OrganicChicken
          baseCenter={[-0.4, 0, 0.3]}
          bounds={{ minX: -2.0, maxX: 2.2, minZ: -16.0, maxZ: -12.8 }}
          seed={1.9}
        />
        <OrganicChicken
          baseCenter={[1.2, 0, -0.6]}
          bounds={{ minX: -2.0, maxX: 2.2, minZ: -16.0, maxZ: -12.8 }}
          seed={3.3}
        />
        <OrganicChicken
          baseCenter={[0.2, 0, -1.2]}
          bounds={{ minX: -2.0, maxX: 2.2, minZ: -16.0, maxZ: -12.8 }}
          seed={5.1}
        />
      </group>

      {/* ─────────────────────────────────────────────────────────────
          3. GOAT & SHEEP PEN (BACK RIGHT: x = 8.5, z = -14)
          ───────────────────────────────────────────────────────────── */}
      <group position={[8.5, 0, -14]}>
        {/* Pasture Grass Bed */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 0]} receiveShadow material={mats.pastureGrass}>
          <planeGeometry args={[6.5, 5.5]} />
        </mesh>

        {/* Hurdle Fencing */}
        {[-3.2, 3.2].map((fx) => (
          <mesh key={`goat-fence-x-${fx}`} position={[fx, 0.4, 0]} material={mats.woodPlanks}>
            <boxGeometry args={[0.08, 0.8, 5.5]} />
          </mesh>
        ))}
        {[-2.7, 2.7].map((fz) => (
          <mesh key={`goat-fence-z-${fz}`} position={[0, 0.4, fz]} material={mats.woodPlanks}>
            <boxGeometry args={[6.5, 0.8, 0.08]} />
          </mesh>
        ))}

        {/* Shelter Lean-To */}
        <group position={[1.8, 0, -1.8]}>
          <mesh position={[0, 0.9, 0]} rotation={[0, 0, 0.2]} material={mats.roofShingles}>
            <boxGeometry args={[1.8, 0.08, 1.4]} />
          </mesh>
          <mesh position={[-0.8, 0.45, 0]} material={mats.woodTimber}>
            <cylinderGeometry args={[0.05, 0.05, 0.9, 5]} />
          </mesh>
          <mesh position={[0.8, 0.65, 0]} material={mats.woodTimber}>
            <cylinderGeometry args={[0.05, 0.05, 1.3, 5]} />
          </mesh>
        </group>

        {/* Salt Lick & Grass Mounds */}
        <mesh position={[-1.8, 0.2, -1.4]} material={mats.whiteTrim}>
          <boxGeometry args={[0.4, 0.4, 0.4]} />
        </mesh>

        {/* 2 Goats & 1 Sheep with organic wandering */}
        <OrganicGoat
          baseCenter={[-0.8, 0, 0.4]}
          bounds={{ minX: 6.0, maxX: 10.5, minZ: -16.0, maxZ: -12.0 }}
          seed={2.1}
          isGoat={true}
        />
        <OrganicGoat
          baseCenter={[1.0, 0, -0.2]}
          bounds={{ minX: 6.0, maxX: 10.5, minZ: -16.0, maxZ: -12.0 }}
          seed={4.7}
          isGoat={true}
        />
        <OrganicGoat
          baseCenter={[0.2, 0, 1.0]}
          bounds={{ minX: 6.0, maxX: 10.5, minZ: -16.0, maxZ: -12.0 }}
          seed={6.3}
          isGoat={false}
        />
      </group>

      {/* ── HYPER-REALISTIC FLOCK 1 (Flapping V-Formation) ── */}
      <group ref={flock1Ref} position={[0, 15, 0]}>
        <RealisticBird offset={[0, 0, 0]} speed={1} wingBeatSpeed={10} flapOffset={0} />
        <RealisticBird offset={[-1.4, 0.2, -1.2]} speed={1} wingBeatSpeed={10} flapOffset={0.6} />
        <RealisticBird offset={[1.4, -0.1, -1.2]} speed={1} wingBeatSpeed={10} flapOffset={1.2} />
        <RealisticBird offset={[-2.8, 0.4, -2.4]} speed={1} wingBeatSpeed={10} flapOffset={1.8} />
        <RealisticBird offset={[2.8, 0.1, -2.4]} speed={1} wingBeatSpeed={10} flapOffset={2.4} />
      </group>

      {/* ── HYPER-REALISTIC FLOCK 2 (High Soaring Birds) ── */}
      <group ref={flock2Ref} position={[0, 19, 0]}>
        <RealisticBird offset={[0, 0, 0]} speed={1} wingBeatSpeed={8} flapOffset={0.3} />
        <RealisticBird offset={[-1.8, 0.3, -1.5]} speed={1} wingBeatSpeed={8} flapOffset={1.0} />
        <RealisticBird offset={[1.8, -0.2, -1.5]} speed={1} wingBeatSpeed={8} flapOffset={1.7} />
      </group>
    </group>
  );
};
