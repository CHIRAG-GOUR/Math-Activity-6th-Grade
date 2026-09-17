// ============================================================
// PERCENTAGE HARVEST — REALISTIC 3D CROPS & GROWTH LIFECYCLE
// Multi-stalk golden wheat with grain heads & awns, multi-leaf sweet corn,
// raised vegetable garden beds, wind wave sway, 6 growth stages & 100-cell spatial grid mapping
// ============================================================

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { FarmMaterialsCache } from './FarmMaterials';
import { useFarmStore } from '../store/farmStore';
import { CropType, TeamId } from '../types';
import { farmSim } from '../engine/farmSim';

interface SingleFieldProps {
  teamId: TeamId;
  center: { x: number; y: number; z: number };
  width: number;
  depth: number;
  cropType: CropType;
  isActive: boolean;
}

// ─────────────────────────────────────────────────────────────
// 1. REALISTIC STYLIZED WHEAT PLANT CLUMP
// Contains 3 curving stalks, blade leaves, segmented grain heads & awns
// ─────────────────────────────────────────────────────────────
const RealisticWheatPlant: React.FC<{
  position: [number, number, number];
  growth: number; // 0 to 1
  isCut: boolean;
  windPhase: number;
  variation: { scale: number; rotY: number; leanX: number; leanZ: number };
}> = ({ position, growth, isCut, windPhase, variation }) => {
  const mats = FarmMaterialsCache.get();
  const plantRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!plantRef.current || isCut) return;
    const t = state.clock.getElapsedTime();
    // Wind wave sway across the field
    const wind = Math.sin(t * 2.4 + windPhase) * 0.12 * Math.max(0.2, growth);
    plantRef.current.rotation.z = variation.leanX + wind;
    plantRef.current.rotation.x = variation.leanZ + wind * 0.5;
  });

  // Stage 6: Harvested Stubble
  if (isCut) {
    return (
      <group position={position} rotation={[0, variation.rotY, 0]} scale={[1, 0.15, 1]}>
        {[-0.05, 0.05].map((sx, idx) => (
          <mesh key={`stubble-${idx}`} position={[sx, 0.08, 0]} material={mats.harvestStubble}>
            <cylinderGeometry args={[0.015, 0.02, 0.16, 4]} />
          </mesh>
        ))}
      </group>
    );
  }

  // Stage 0: Prepared Soil (no visible plant yet)
  if (growth <= 0.05) return null;

  // Stage 1 & 2: Tiny Fresh Green Sprouts
  if (growth < 0.3) {
    const sproutScale = (growth / 0.3) * 0.35;
    return (
      <group position={position} scale={[sproutScale, sproutScale, sproutScale]}>
        <mesh position={[-0.03, 0.08, 0]} rotation={[0, 0, -0.3]} material={mats.sproutGreen}>
          <boxGeometry args={[0.02, 0.15, 0.01]} />
        </mesh>
        <mesh position={[0.03, 0.08, 0]} rotation={[0, 0, 0.3]} material={mats.sproutGreen}>
          <boxGeometry args={[0.02, 0.15, 0.01]} />
        </mesh>
      </group>
    );
  }

  // Stage 3 to 5: Lush / Mature Wheat Plant Clump
  const currentHeight = Math.max(0.3, growth) * variation.scale;
  const isGolden = growth > 0.65;
  const cropMat = isGolden ? mats.wheatGolden : mats.sproutGreen;
  const headMat = isGolden ? mats.wheatFieldTuft : mats.sproutGreen;

  return (
    <group
      ref={plantRef}
      position={position}
      rotation={[variation.leanZ, variation.rotY, variation.leanX]}
      scale={[variation.scale, currentHeight, variation.scale]}
    >
      {/* ── 3 ARCHING WHEAT STALKS ── */}
      {/* Central Stalk */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0.35, 0]} castShadow material={cropMat}>
          <cylinderGeometry args={[0.015, 0.022, 0.7, 5]} />
        </mesh>
        {/* Grain Head Spike (Beaded Segmented Kernels) */}
        <group position={[0, 0.75, 0]}>
          <mesh castShadow material={headMat}>
            <capsuleGeometry args={[0.035, 0.22, 4, 8]} />
          </mesh>
          {/* Wheat Awn Bristles */}
          <mesh position={[0, 0.16, 0]} material={headMat}>
            <coneGeometry args={[0.02, 0.15, 4]} />
          </mesh>
        </group>
        {/* Arching Blade Leaves */}
        <mesh position={[0.05, 0.35, 0]} rotation={[0, 0, 0.6]} material={cropMat}>
          <boxGeometry args={[0.12, 0.015, 0.02]} />
        </mesh>
      </group>

      {/* Left Leaning Stalk */}
      <group position={[-0.05, 0, 0.02]} rotation={[0, 0, -0.15]}>
        <mesh position={[0, 0.32, 0]} castShadow material={cropMat}>
          <cylinderGeometry args={[0.014, 0.02, 0.64, 5]} />
        </mesh>
        <group position={[0, 0.68, 0]}>
          <mesh castShadow material={headMat}>
            <capsuleGeometry args={[0.032, 0.2, 4, 8]} />
          </mesh>
          <mesh position={[0, 0.15, 0]} material={headMat}>
            <coneGeometry args={[0.018, 0.14, 4]} />
          </mesh>
        </group>
        <mesh position={[-0.05, 0.3, 0]} rotation={[0, 0, -0.5]} material={cropMat}>
          <boxGeometry args={[0.11, 0.015, 0.02]} />
        </mesh>
      </group>

      {/* Right Leaning Stalk */}
      <group position={[0.05, 0, -0.02]} rotation={[0, 0, 0.14]}>
        <mesh position={[0, 0.32, 0]} castShadow material={cropMat}>
          <cylinderGeometry args={[0.014, 0.02, 0.64, 5]} />
        </mesh>
        <group position={[0, 0.68, 0]}>
          <mesh castShadow material={headMat}>
            <capsuleGeometry args={[0.032, 0.2, 4, 8]} />
          </mesh>
          <mesh position={[0, 0.15, 0]} material={headMat}>
            <coneGeometry args={[0.018, 0.14, 4]} />
          </mesh>
        </group>
        <mesh position={[0.06, 0.28, 0]} rotation={[0, 0, 0.55]} material={cropMat}>
          <boxGeometry args={[0.11, 0.015, 0.02]} />
        </mesh>
      </group>
    </group>
  );
};

// ─────────────────────────────────────────────────────────────
// 2. REALISTIC STYLIZED CORN PLANT
// Robust central stalk with 4 broad drooping leaves and golden corn ears
// ─────────────────────────────────────────────────────────────
const RealisticCornPlant: React.FC<{
  position: [number, number, number];
  growth: number;
  isCut: boolean;
  windPhase: number;
  variation: { scale: number; rotY: number };
}> = ({ position, growth, isCut, windPhase, variation }) => {
  const mats = FarmMaterialsCache.get();
  const cornRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!cornRef.current || isCut) return;
    const t = state.clock.getElapsedTime();
    const wind = Math.sin(t * 1.8 + windPhase) * 0.08 * Math.max(0.2, growth);
    cornRef.current.rotation.z = wind;
  });

  if (isCut) {
    return (
      <group position={position} scale={[1, 0.18, 1]}>
        <mesh position={[0, 0.1, 0]} material={mats.harvestStubble}>
          <cylinderGeometry args={[0.03, 0.04, 0.2, 6]} />
        </mesh>
      </group>
    );
  }

  if (growth <= 0.05) return null;

  const currentScale = Math.max(0.25, growth) * variation.scale;

  return (
    <group
      ref={cornRef}
      position={position}
      rotation={[0, variation.rotY, 0]}
      scale={[currentScale, currentScale, currentScale]}
    >
      {/* Central Fibrous Stalk */}
      <mesh position={[0, 0.65, 0]} castShadow material={mats.cornStalk}>
        <cylinderGeometry args={[0.035, 0.05, 1.3, 6]} />
      </mesh>

      {/* Broad Arching Leaves */}
      {[0, Math.PI * 0.5, Math.PI, Math.PI * 1.5].map((angle, i) => (
        <group key={`leaf-${i}`} position={[0, 0.4 + i * 0.2, 0]} rotation={[0, angle, 0]}>
          <mesh position={[0.22, 0.06, 0]} rotation={[0, 0, -0.4]} material={mats.cornStalk}>
            <boxGeometry args={[0.42, 0.02, 0.08]} />
          </mesh>
        </group>
      ))}

      {/* Visible Corn Ears in Pale Husk with Golden Silk */}
      {growth > 0.5 && (
        <group position={[0.08, 0.65, 0]} rotation={[0, 0, 0.35]}>
          <mesh castShadow material={mats.sproutGreen}>
            <capsuleGeometry args={[0.045, 0.18, 4, 8]} />
          </mesh>
          <mesh position={[0.02, 0.08, 0]} material={mats.cornGoldEar}>
            <capsuleGeometry args={[0.035, 0.12, 4, 8]} />
          </mesh>
        </group>
      )}

      {/* Top Tassel / Flower Spire */}
      <mesh position={[0, 1.35, 0]} material={mats.wheatFieldTuft}>
        <coneGeometry args={[0.06, 0.22, 5]} />
      </mesh>
    </group>
  );
};

// ─────────────────────────────────────────────────────────────
// 3. REALISTIC VEGETABLE & TOMATO BED
// Cabbages, Carrots, Staked Tomato Vines
// ─────────────────────────────────────────────────────────────
const RealisticVegPlant: React.FC<{
  position: [number, number, number];
  growth: number;
  isCut: boolean;
  type: 'tomato' | 'cabbage' | 'carrot';
  variation: { scale: number; rotY: number };
}> = ({ position, growth, isCut, type, variation }) => {
  const mats = FarmMaterialsCache.get();

  if (isCut || growth <= 0.05) return null;

  const currentScale = Math.max(0.3, growth) * variation.scale;

  if (type === 'tomato') {
    return (
      <group position={position} rotation={[0, variation.rotY, 0]} scale={[currentScale, currentScale, currentScale]}>
        {/* Wooden Garden Stake */}
        <mesh position={[0, 0.5, 0]} material={mats.woodTimber}>
          <cylinderGeometry args={[0.02, 0.025, 1.0, 5]} />
        </mesh>
        {/* Lush Tomato Vine Leaves */}
        <mesh position={[0, 0.45, 0]} castShadow material={mats.tomatoBush}>
          <sphereGeometry args={[0.26, 8, 8]} />
        </mesh>
        {/* Ruby-Ripe Tomatoes */}
        {growth > 0.5 && (
          <>
            <mesh position={[0.12, 0.38, 0.12]} castShadow material={mats.tomatoFruit}>
              <sphereGeometry args={[0.075, 8, 8]} />
            </mesh>
            <mesh position={[-0.1, 0.48, 0.1]} castShadow material={mats.tomatoFruit}>
              <sphereGeometry args={[0.065, 8, 8]} />
            </mesh>
          </>
        )}
      </group>
    );
  }

  // Cabbage Rosette
  if (type === 'cabbage') {
    return (
      <group position={position} rotation={[0, variation.rotY, 0]} scale={[currentScale, currentScale, currentScale]}>
        <mesh position={[0, 0.12, 0]} castShadow material={mats.vegetableGreen}>
          <sphereGeometry args={[0.18, 8, 8]} />
        </mesh>
        {[0, 1.2, 2.4, 3.6, 4.8].map((ang, i) => (
          <mesh
            key={`cabb-leaf-${i}`}
            position={[Math.cos(ang) * 0.12, 0.08, Math.sin(ang) * 0.12]}
            rotation={[0.3, ang, 0]}
            material={mats.sproutGreen}
          >
            <boxGeometry args={[0.14, 0.02, 0.12]} />
          </mesh>
        ))}
      </group>
    );
  }

  // Carrot Foliage with orange top
  return (
    <group position={position} scale={[currentScale, currentScale, currentScale]}>
      <mesh position={[0, 0.15, 0]} castShadow material={mats.vegetableGreen}>
        <coneGeometry args={[0.1, 0.3, 6]} />
      </mesh>
      {growth > 0.6 && (
        <mesh position={[0, 0.02, 0]} material={mats.tomatoFruit}>
          <cylinderGeometry args={[0.04, 0.02, 0.05, 6]} />
        </mesh>
      )}
    </group>
  );
};

// ─────────────────────────────────────────────────────────────
// SINGLE 3D FIELD WITH SPATIAL 100-CELL HECTARE GRID MAPPING
// ─────────────────────────────────────────────────────────────
const SingleField: React.FC<SingleFieldProps> = ({
  teamId,
  center,
  width,
  depth,
  cropType,
  isActive,
}) => {
  const mats = FarmMaterialsCache.get();
  const selectedCells = useFarmStore((s) => s[teamId].selectedCells);

  // Generate 100 spatial plant positions (10 rows x 10 cols)
  const gridPositions = useMemo(() => {
    const list: {
      index: number;
      x: number;
      z: number;
      row: number;
      col: number;
      variation: { scale: number; rotY: number; leanX: number; leanZ: number };
    }[] = [];

    const rows = 10;
    const cols = 10;
    const stepX = (width - 0.6) / (cols - 1);
    const stepZ = (depth - 0.6) / (rows - 1);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const idx = r * cols + c;
        const x = -width / 2 + 0.3 + c * stepX;
        const z = -depth / 2 + 0.3 + r * stepZ;
        const pseudoRand = Math.sin(idx * 99.7) * 10000;
        const randFrac = pseudoRand - Math.floor(pseudoRand);

        list.push({
          index: idx,
          x,
          z,
          row: r,
          col: c,
          variation: {
            scale: 0.88 + randFrac * 0.24,
            rotY: randFrac * Math.PI * 2,
            leanX: (randFrac - 0.5) * 0.15,
            leanZ: ((randFrac * 1.5) % 1 - 0.5) * 0.15,
          },
        });
      }
    }
    return list;
  }, [width, depth]);

  const [growthVal, setGrowthVal] = React.useState(0.0);
  const [harvestVal, setHarvestVal] = React.useState(0);

  useFrame(() => {
    if (!isActive) return;
    const sim = teamId === 'blue' ? farmSim.blue : farmSim.red;
    setGrowthVal(sim.cropGrowth || 0.0);
    setHarvestVal(sim.fieldHarvestProgress || 0);
  });

  if (!isActive) return null;

  const isBlue = teamId === 'blue';
  const highlightMat = isBlue ? mats.gridHighlightBlue : mats.gridHighlightRed;

  return (
    <group position={[center.x, 0, center.z]}>
      {/* ── RICH FERTILE SOIL BED WITH RAISED FURROWS ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow material={mats.tilledSoil}>
        <planeGeometry args={[width, depth]} />
      </mesh>

      {/* 10 Agricultural Furrow Ridges */}
      {Array.from({ length: 10 }).map((_, r) => {
        const fz = -depth / 2 + 0.3 + r * ((depth - 0.6) / 9);
        return (
          <mesh key={`furrow-${r}`} position={[0, 0.03, fz]} material={mats.darkMud}>
            <boxGeometry args={[width - 0.4, 0.02, 0.08]} />
          </mesh>
        );
      })}

      {/* Wooden Perimeter Border Logs */}
      {[-width / 2, width / 2].map((bx, i) => (
        <mesh key={`border-x-${i}`} position={[bx, 0.08, 0]} material={mats.woodTimber}>
          <boxGeometry args={[0.15, 0.16, depth]} />
        </mesh>
      ))}
      {[-depth / 2, depth / 2].map((bz, i) => (
        <mesh key={`border-z-${i}`} position={[0, 0.08, bz]} material={mats.woodTimber}>
          <boxGeometry args={[width, 0.16, 0.15]} />
        </mesh>
      ))}

      {/* ── SPATIAL 100-CELL HECTARE GRID HIGHLIGHT ── */}
      {/* When the student selects cells in the UI, the exact 3D soil sectors illuminate */}
      {gridPositions.map((cell) => {
        const isSelected = selectedCells[cell.index];
        if (!isSelected) return null;
        const cellW = (width - 0.4) / 10;
        const cellD = (depth - 0.4) / 10;
        return (
          <mesh
            key={`highlight-${cell.index}`}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[cell.x, 0.035, cell.z]}
            material={highlightMat}
          >
            <planeGeometry args={[cellW * 0.9, cellD * 0.9]} />
          </mesh>
        );
      })}

      {/* ── 3D REALISTIC CROPS (100 INTERACTIVE INSTANCES) ── */}
      <group>
        {gridPositions.map((cell) => {
          const sim = teamId === 'blue' ? farmSim.blue : farmSim.red;
          const isCut = sim.vehicle.task === 'harvesting' && (cell.row / 10) < harvestVal;
          const windPhase = center.x * 0.4 + cell.x * 0.3 + cell.z * 0.3;

          if (cropType === 'wheat') {
            return (
              <RealisticWheatPlant
                key={`wheat-plant-${cell.index}`}
                position={[cell.x, 0.02, cell.z]}
                growth={growthVal}
                isCut={isCut}
                windPhase={windPhase}
                variation={cell.variation}
              />
            );
          } else if (cropType === 'corn') {
            return (
              <RealisticCornPlant
                key={`corn-plant-${cell.index}`}
                position={[cell.x, 0.02, cell.z]}
                growth={growthVal}
                isCut={isCut}
                windPhase={windPhase}
                variation={cell.variation}
              />
            );
          } else {
            // Mixed Vegetable Beds (Tomato, Cabbage, Carrot)
            const vegType = cell.index % 3 === 0 ? 'tomato' : (cell.index % 3 === 1 ? 'cabbage' : 'carrot');
            return (
              <RealisticVegPlant
                key={`veg-plant-${cell.index}`}
                position={[cell.x, 0.02, cell.z]}
                growth={growthVal}
                isCut={isCut}
                type={vegType}
                variation={cell.variation}
              />
            );
          }
        })}
      </group>
    </group>
  );
};

export const CropFields3D: React.FC = () => {
  const blue = useFarmStore((s) => s.blue);
  const red = useFarmStore((s) => s.red);

  return (
    <group>
      {/* ── BLUE FARM FIELD (LEFT INNER) ── */}
      <SingleField
        teamId="blue"
        center={{ x: -6.8, y: 0, z: 2.2 }}
        width={6.6}
        depth={6.6}
        cropType={blue.currentCrop || 'wheat'}
        isActive={true}
      />

      {/* ── RED FARM FIELD (RIGHT INNER) ── */}
      <SingleField
        teamId="red"
        center={{ x: 6.8, y: 0, z: 2.2 }}
        width={6.6}
        depth={6.6}
        cropType={red.currentCrop || 'wheat'}
        isActive={true}
      />
    </group>
  );
};
