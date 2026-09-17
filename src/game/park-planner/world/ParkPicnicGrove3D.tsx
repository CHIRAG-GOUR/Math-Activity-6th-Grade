// ============================================================
// PARK PLANNER — High-Graphics 3D Picnic Grove & Relaxation (Quadrant IV)
// Handcrafted cedar picnic tables with picnic props, large shade umbrellas with seating,
// stepped geometric pyramid square seating platforms, mature shade trees,
// and families actively relaxing, eating, and conversing.
// ============================================================

import React from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { StylizedHuman3D } from './ParkCharacters3D';
import { ConstructionWorker3D, ConstructionCart3D } from './ParkWorkers3D';

// ------------------------------------------------------------
// 1. HANDCRAFTED CEDAR PICNIC TABLE (With props & seated family)
// ------------------------------------------------------------
export const PicnicTable3D: React.FC<{
  position?: [number, number, number];
  rotationY?: number;
  hasFamily?: boolean;
}> = ({ position = [0, 0, 0], rotationY = 0, hasFamily = true }) => {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Stone Paver Base */}
      <mesh receiveShadow position={[0, 0.025, 0]}>
        <boxGeometry args={[2.4, 0.04, 2.2]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
      </mesh>

      {/* Table Top Timber Planks */}
      <mesh castShadow receiveShadow position={[0, 0.78, 0]}>
        <boxGeometry args={[1.9, 0.07, 0.9]} />
        <meshStandardMaterial color="#9a3412" roughness={0.6} />
      </mesh>

      {/* A-Frame Legs Left & Right */}
      {[-0.7, 0.7].map((x, i) => (
        <group key={`picnic_legs_${i}`} position={[x, 0.4, 0]}>
          <mesh castShadow position={[0, 0, 0.48]} rotation={[0.2, 0, 0]}>
            <boxGeometry args={[0.08, 0.78, 0.08]} />
            <meshStandardMaterial color="#7c2d12" />
          </mesh>
          <mesh castShadow position={[0, 0, -0.48]} rotation={[-0.2, 0, 0]}>
            <boxGeometry args={[0.08, 0.78, 0.08]} />
            <meshStandardMaterial color="#7c2d12" />
          </mesh>
          {/* Bench Support Beam */}
          <mesh position={[0, -0.1, 0]}>
            <boxGeometry args={[0.08, 0.08, 1.5]} />
            <meshStandardMaterial color="#7c2d12" />
          </mesh>
        </group>
      ))}

      {/* Bench Planks (Front & Rear) */}
      <mesh castShadow position={[0, 0.46, 0.7]}>
        <boxGeometry args={[1.9, 0.055, 0.3]} />
        <meshStandardMaterial color="#9a3412" roughness={0.6} />
      </mesh>
      <mesh castShadow position={[0, 0.46, -0.7]}>
        <boxGeometry args={[1.9, 0.055, 0.3]} />
        <meshStandardMaterial color="#9a3412" roughness={0.6} />
      </mesh>

      {/* Picnic Props on Table: Basket, Juice Bottle, Cups */}
      <group position={[0.3, 0.82, 0]}>
        {/* Wicker Basket */}
        <mesh castShadow position={[-0.4, 0.12, 0]}>
          <boxGeometry args={[0.35, 0.22, 0.25]} />
          <meshStandardMaterial color="#d97706" roughness={0.9} />
        </mesh>
        {/* Juice Bottle */}
        <mesh position={[0.2, 0.14, 0.1]}>
          <cylinderGeometry args={[0.04, 0.04, 0.26, 8]} />
          <meshStandardMaterial color="#ea580c" roughness={0.2} transparent opacity={0.8} />
        </mesh>
        {/* Plates */}
        <mesh position={[-0.05, 0.02, -0.15]}>
          <cylinderGeometry args={[0.1, 0.1, 0.02, 12]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* Seated Picnickers */}
      {hasFamily && (
        <group>
          {/* Person 1 Front */}
          <group position={[-0.4, 0.12, 0.7]} rotation={[0, Math.PI, 0]}>
            <StylizedHuman3D
              scale={0.82}
              shirtColor="#0284c7"
              pantsColor="#1e3a8a"
              isWalking={false}
              isSeated={true}
            />
          </group>
          {/* Person 2 Rear */}
          <group position={[0.3, 0.12, -0.7]} rotation={[0, 0, 0]}>
            <StylizedHuman3D
              scale={0.8}
              shirtColor="#ec4899"
              pantsColor="#475569"
              isWalking={false}
              isSeated={true}
            />
          </group>
        </group>
      )}
    </group>
  );
};

// ------------------------------------------------------------
// 2. LARGE OUTDOOR CANOPY UMBRELLA WITH SEATING
// ------------------------------------------------------------
export const LargeCanopyUmbrella3D: React.FC<{
  position?: [number, number, number];
  canopyColor?: string;
  hasVisitor?: boolean;
}> = ({ position = [0, 0, 0], canopyColor = '#f59e0b', hasVisitor = true }) => {
  return (
    <group position={position}>
      {/* Center Steel Mast */}
      <mesh castShadow position={[0, 1.4, 0]}>
        <cylinderGeometry args={[0.04, 0.05, 2.8, 8]} />
        <meshStandardMaterial color="#334155" metalness={0.7} />
      </mesh>

      {/* Large Conical Canvas Umbrella Canopy */}
      <mesh castShadow position={[0, 2.65, 0]}>
        <coneGeometry args={[1.5, 0.65, 12, 1, true]} />
        <meshStandardMaterial color={canopyColor} roughness={0.7} side={THREE.DoubleSide} />
      </mesh>

      {/* Canopy Top Cap */}
      <mesh position={[0, 3.0, 0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>

      {/* Circular Café Table Beneath */}
      <mesh castShadow position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.65, 0.65, 0.05, 16]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.3} />
      </mesh>

      {/* 2 Curved Outdoor Stools */}
      {[-0.8, 0.8].map((x, i) => (
        <mesh key={`stool_${i}`} castShadow position={[x, 0.22, 0]}>
          <cylinderGeometry args={[0.22, 0.24, 0.44, 12]} />
          <meshStandardMaterial color="#0f172a" roughness={0.5} />
        </mesh>
      ))}

      {/* Seated Visitor Relaxing */}
      {hasVisitor && (
        <group position={[-0.8, 0.1, 0]} rotation={[0, Math.PI / 2, 0]}>
          <StylizedHuman3D
            scale={0.85}
            shirtColor="#10b981"
            pantsColor="#1e293b"
            isWalking={false}
            isSeated={true}
          />
        </group>
      )}
    </group>
  );
};

// ------------------------------------------------------------
// 3. STEPPED PYRAMID / TIERED SQUARE STONE SEATING
// ------------------------------------------------------------
export const PyramidTieredSquareSeating3D: React.FC<{
  position?: [number, number, number];
  hasVisitors?: boolean;
}> = ({ position = [0, 0, 0], hasVisitors = true }) => {
  return (
    <group position={position}>
      {/* Tier 1 (Base): 3.2m wide, 0.25m height */}
      <mesh castShadow receiveShadow position={[0, 0.125, 0]}>
        <boxGeometry args={[3.2, 0.25, 3.2]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.6} />
      </mesh>
      {/* Tier 1 Bevel Granite Trim */}
      <mesh position={[0, 0.24, 0]}>
        <boxGeometry args={[3.25, 0.03, 3.25]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.5} />
      </mesh>

      {/* Tier 2: 2.4m wide, 0.25m height (Y = 0.375) */}
      <mesh castShadow receiveShadow position={[0, 0.375, 0]}>
        <boxGeometry args={[2.4, 0.25, 2.4]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.49, 0]}>
        <boxGeometry args={[2.45, 0.03, 2.45]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.5} />
      </mesh>

      {/* Tier 3: 1.6m wide, 0.25m height (Y = 0.625) */}
      <mesh castShadow receiveShadow position={[0, 0.625, 0]}>
        <boxGeometry args={[1.6, 0.25, 1.6]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.74, 0]}>
        <boxGeometry args={[1.65, 0.03, 1.65]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.5} />
      </mesh>

      {/* Tier 4 (Top Platform): 0.8m wide, 0.25m height (Y = 0.875) */}
      <mesh castShadow receiveShadow position={[0, 0.875, 0]}>
        <boxGeometry args={[0.8, 0.25, 0.8]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.4} />
      </mesh>

      {/* People Seated and Gathering on the Stepped Pyramid Ledges */}
      {hasVisitors && (
        <group>
          {/* Seated on Tier 1 Front */}
          <group position={[0.6, -0.05, 1.4]} rotation={[0, 0, 0]}>
            <StylizedHuman3D
              scale={0.78}
              shirtColor="#f59e0b"
              pantsColor="#1e3a8a"
              isWalking={false}
              isSeated={true}
            />
          </group>

          {/* Seated on Tier 2 Left */}
          <group position={[-1.0, 0.18, 0]} rotation={[0, Math.PI / 2, 0]}>
            <StylizedHuman3D
              scale={0.78}
              shirtColor="#06b6d4"
              pantsColor="#334155"
              isWalking={false}
              isSeated={true}
            />
          </group>

          {/* Seated on Top Platform */}
          <group position={[0, 0.68, 0]} rotation={[0, -Math.PI / 4, 0]}>
            <StylizedHuman3D
              scale={0.75}
              shirtColor="#8b5cf6"
              pantsColor="#0f172a"
              isWalking={false}
              isSeated={true}
            />
          </group>
        </group>
      )}


    </group>
  );
};

// ------------------------------------------------------------
// 4. PICNIC BLANKET WITH FAMILY
// ------------------------------------------------------------
export const PicnicBlanketFamily3D: React.FC<{
  position?: [number, number, number];
}> = ({ position = [0, 0, 0] }) => {
  return (
    <group position={position}>
      {/* Red & White Checkered Blanket */}
      <mesh receiveShadow position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0.2]}>
        <planeGeometry args={[2.0, 1.8]} />
        <meshStandardMaterial color="#dc2626" roughness={0.8} />
      </mesh>

      {/* Picnic Basket & Props */}
      <mesh castShadow position={[-0.4, 0.15, 0]}>
        <boxGeometry args={[0.4, 0.25, 0.3]} />
        <meshStandardMaterial color="#b45309" roughness={0.8} />
      </mesh>

      {/* Mother & Child Seated on Blanket */}
      <group position={[0.3, 0.04, 0.3]} rotation={[0, -0.6, 0]}>
        <StylizedHuman3D
          scale={0.82}
          shirtColor="#f43f5e"
          pantsColor="#1e3a8a"
          isWalking={false}
          isSeated={true}
        />
      </group>
      <group position={[0.2, 0.04, -0.3]} rotation={[0, 0.8, 0]}>
        <StylizedHuman3D
          scale={0.52}
          shirtColor="#facc15"
          pantsColor="#475569"
          isWalking={false}
          isSeated={true}
        />
      </group>
    </group>
  );
};

// ------------------------------------------------------------
// 5. CAST IRON PARK BENCH (With seated reader)
// ------------------------------------------------------------
export const ParkBench3D: React.FC<{
  position?: [number, number, number];
  rotationY?: number;
  hasVisitor?: boolean;
}> = ({ position = [0, 0, 0], rotationY = 0, hasVisitor = false }) => {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {[-0.7, 0.7].map((x, i) => (
        <group key={`bench_frame_${i}`} position={[x, 0.3, 0]}>
          <mesh castShadow position={[0, 0, 0.22]}>
            <boxGeometry args={[0.05, 0.58, 0.05]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} />
          </mesh>
          <mesh castShadow position={[0, 0.22, -0.22]} rotation={[-0.1, 0, 0]}>
            <boxGeometry args={[0.05, 0.98, 0.05]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} />
          </mesh>
          <mesh position={[0, 0.26, 0]}>
            <boxGeometry args={[0.05, 0.04, 0.48]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} />
          </mesh>
        </group>
      ))}

      {[-0.14, -0.03, 0.08, 0.19].map((z, idx) => (
        <mesh key={`seat_slat_${idx}`} castShadow position={[0, 0.44, z]}>
          <boxGeometry args={[1.45, 0.032, 0.085]} />
          <meshStandardMaterial color="#b45309" roughness={0.6} />
        </mesh>
      ))}

      {[0.58, 0.7, 0.82].map((y, idx) => (
        <mesh key={`back_slat_${idx}`} castShadow position={[0, y, -0.24]} rotation={[-0.1, 0, 0]}>
          <boxGeometry args={[1.45, 0.085, 0.032]} />
          <meshStandardMaterial color="#b45309" roughness={0.6} />
        </mesh>
      ))}

      {hasVisitor && (
        <group position={[0, 0.1, 0]}>
          <StylizedHuman3D
            position={[0, 0, 0]}
            scale={0.85}
            shirtColor="#059669"
            pantsColor="#1e3a8a"
            isWalking={false}
            isSeated={true}
          />
        </group>
      )}
    </group>
  );
};

// ------------------------------------------------------------
// 6. SHADY DECIDUOUS OAK & PINE TREES
// ------------------------------------------------------------
export const ShadyTree3D: React.FC<{
  position?: [number, number, number];
  scale?: number;
}> = ({ position = [0, 0, 0], scale = 1 }) => {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      <mesh castShadow position={[0, 1.3, 0]}>
        <cylinderGeometry args={[0.2, 0.28, 2.6, 8]} />
        <meshStandardMaterial color="#5c3a21" roughness={0.9} />
      </mesh>
      <mesh castShadow position={[0, 2.8, 0]}>
        <dodecahedronGeometry args={[1.4, 1]} />
        <meshStandardMaterial color="#2d6a4f" roughness={0.8} />
      </mesh>
      <mesh castShadow position={[0.45, 3.3, 0.35]}>
        <dodecahedronGeometry args={[1.0, 1]} />
        <meshStandardMaterial color="#40916c" roughness={0.8} />
      </mesh>
      <mesh castShadow position={[-0.45, 3.0, -0.35]}>
        <dodecahedronGeometry args={[1.1, 1]} />
        <meshStandardMaterial color="#1b4332" roughness={0.8} />
      </mesh>
    </group>
  );
};

// ------------------------------------------------------------
// 7. COMPLETE QUADRANT IV PICNIC GROVE ASSEMBLY WITH PROGRESSIVE BUILD
// ------------------------------------------------------------
export const FullQuadrant4Picnic3D: React.FC<{
  progress: number; // 0 to 1
  isBuilding: boolean;
  isBuilt: boolean;
}> = ({ progress, isBuilding, isBuilt }) => {
  if (!isBuilding && !isBuilt) {
    return (
      <group position={[6, 0, 6]}>
        <mesh receiveShadow position={[0, 0.01, 0]}>
          <boxGeometry args={[9.5, 0.02, 9.5]} />
          <meshStandardMaterial color="#78350f" roughness={0.9} opacity={0.6} transparent />
        </mesh>
        {[-4, 4].map((x, i) =>
          [-4, 4].map((z, j) => (
            <mesh key={`stake_q4_${i}_${j}`} position={[x, 0.2, z]}>
              <cylinderGeometry args={[0.03, 0.03, 0.4, 6]} />
              <meshStandardMaterial color="#f59e0b" />
            </mesh>
          ))
        )}
      </group>
    );
  }

  const stageScale = isBuilt ? 1 : Math.min(1, 0.1 + progress * 0.9);
  const showEarly = progress > 0.15 || isBuilt;
  const showLate = progress > 0.45 || isBuilt;
  const showTrees = progress > 0.75 || isBuilt;
  const showVisitors = progress > 0.85 || isBuilt;

  return (
    <group position={[6, 0, 6]}>
      {/* Warm Meadow Grass Base */}
      <mesh receiveShadow position={[0, 0.02, 0]}>
        <boxGeometry args={[9.4, 0.04, 9.4]} />
        <meshStandardMaterial color="#4d7c0f" roughness={0.85} />
      </mesh>

      {/* Flagstone Promenade Pathways */}
      <mesh position={[0, 0.025, 0]}>
        <boxGeometry args={[0.8, 0.03, 8.8]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.65} />
      </mesh>
      <mesh position={[0, 0.025, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[0.8, 0.03, 8.8]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.65} />
      </mesh>

      {/* Construction Workers during 8-10s Build */}
      {isBuilding && progress < 0.95 && (
        <group>
          <ConstructionWorker3D
            position={[-1.5, 0, -1.5 + Math.sin(progress * 10) * 1.5]}
            isConstructing={true}
          />
          <ConstructionWorker3D
            position={[1.5, 0, 1.5]}
            isConstructing={true}
          />
          <ConstructionCart3D position={[3.2, 0, 3.2]} rotationY={-Math.PI * 0.75} />
        </group>
      )}

      {/* 1. Cedar Picnic Tables & Large Shade Umbrellas */}
      {showEarly && (
        <group scale={[stageScale, stageScale, stageScale]}>
          <PicnicTable3D position={[-2.2, 0, -2.2]} rotationY={0.2} hasFamily={showVisitors} />
          <LargeCanopyUmbrella3D position={[2.2, 0, -2.2]} canopyColor="#f59e0b" hasVisitor={showVisitors} />
          <LargeCanopyUmbrella3D position={[-2.2, 0, 2.2]} canopyColor="#0284c7" hasVisitor={showVisitors} />
        </group>
      )}

      {/* 2. Stepped Pyramid Square Seating & Picnic Blanket */}
      {showLate && (
        <group scale={[stageScale, stageScale, stageScale]}>
          <PyramidTieredSquareSeating3D position={[2.0, 0, 2.0]} hasVisitors={showVisitors} />
          <PicnicBlanketFamily3D position={[0, 0, -1.8]} />
        </group>
      )}

      {/* 3. Mature Shady Trees & Relaxing Benches */}
      {showTrees && (
        <group scale={[stageScale, stageScale, stageScale]}>
          <ShadyTree3D position={[-3.8, 0, -3.8]} scale={1.25} />
          <ShadyTree3D position={[3.8, 0, -3.8]} scale={1.2} />
          <ShadyTree3D position={[-3.8, 0, 3.8]} scale={1.15} />
          <ParkBench3D position={[0, 0, 3.8]} rotationY={Math.PI} hasVisitor={showVisitors} />
          <ParkBench3D position={[3.8, 0, 0]} rotationY={-Math.PI / 2} hasVisitor={showVisitors} />
        </group>
      )}
    </group>
  );
};

