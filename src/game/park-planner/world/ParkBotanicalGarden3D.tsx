// ============================================================
// PARK PLANNER — High-Graphics Botanical Gardens & Nature (Quadrant II)
// Professional botanical garden with 4 distinct zones:
// Zone A: Formal Parterre Flower Gardens (roses, tulips, marigolds)
// Zone B: Tropical Plants (palms, broadleaf, ferns)
// Zone C: Botanical Specimen Collections (labeled plant sections, botanical signs)
// Zone D: Tree Garden & Conservatory Greenhouse
// Infrastructure: stone paths, info boards, gazebo, koi pond, benches, lamps,
// and active gardeners watering/inspecting/trimming & visitors observing.
// ============================================================

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { StylizedHuman3D } from './ParkCharacters3D';
import { ParkBench3D, ShadyTree3D } from './ParkPicnicGrove3D';
import { ConstructionWorker3D, ConstructionCart3D } from './ParkWorkers3D';

// ------------------------------------------------------------
// 1. TIERED MARBLE FOUNTAIN WITH ACTIVE JETS & WATER SHADER
// ------------------------------------------------------------
export const TieredFountain3D: React.FC<{
  position?: [number, number, number];
  isFlowing?: boolean;
}> = ({ position = [0, 0, 0], isFlowing = true }) => {
  const waterJetRef = useRef<THREE.Group>(null);
  const rippleRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (isFlowing) {
      if (waterJetRef.current) {
        waterJetRef.current.scale.y = 0.95 + Math.sin(t * 8) * 0.12;
      }
      if (rippleRef.current) {
        const s = 1 + ((t * 1.5) % 1) * 0.35;
        rippleRef.current.scale.set(s, 1, s);
        (rippleRef.current.material as THREE.MeshStandardMaterial).opacity =
          0.7 * (1 - ((t * 1.5) % 1));
      }
    }
  });

  return (
    <group position={position}>
      {/* Octagonal Stepped Plaza Base */}
      <mesh receiveShadow position={[0, 0.04, 0]}>
        <cylinderGeometry args={[1.7, 1.8, 0.08, 8]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.6} />
      </mesh>

      {/* Main Basin Wall */}
      <mesh castShadow receiveShadow position={[0, 0.28, 0]}>
        <cylinderGeometry args={[1.4, 1.45, 0.48, 24, 1, true]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.1} />
      </mesh>
      {/* Molded Marble Rim */}
      <mesh position={[0, 0.52, 0]}>
        <torusGeometry args={[1.42, 0.06, 8, 24]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.2} metalness={0.1} />
      </mesh>

      {/* Basin Glistening Water Surface */}
      <mesh position={[0, 0.42, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.38, 24]} />
        <meshStandardMaterial
          color="#0284c7"
          roughness={0.05}
          metalness={0.4}
          transparent
          opacity={0.88}
        />
      </mesh>

      {/* Animated Ripple */}
      {isFlowing && (
        <mesh ref={rippleRef} position={[0, 0.43, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.5, 0.65, 24]} />
          <meshStandardMaterial color="#bae6fd" transparent opacity={0.6} />
        </mesh>
      )}

      {/* Center Fluted Column */}
      <mesh castShadow position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.22, 0.32, 0.9, 16]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.2} />
      </mesh>

      {/* Upper Marble Basin Tier */}
      <mesh castShadow position={[0, 1.18, 0]}>
        <cylinderGeometry args={[0.75, 0.35, 0.28, 20]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.2} />
      </mesh>
      <mesh position={[0, 1.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.7, 20]} />
        <meshStandardMaterial color="#38bdf8" roughness={0.05} transparent opacity={0.9} />
      </mesh>

      {/* Top Spout Finial */}
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshStandardMaterial color="#d97706" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Water Jets */}
      {isFlowing && (
        <group position={[0, 1.6, 0]} ref={waterJetRef}>
          {/* Main Central Jet */}
          <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.04, 0.08, 0.6, 8]} />
            <meshStandardMaterial color="#e0f2fe" transparent opacity={0.75} roughness={0.1} />
          </mesh>
          {/* 4 Cascading Water Arcs */}
          {[0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2].map((angle, idx) => (
            <mesh
              key={`jet_arc_${idx}`}
              position={[Math.cos(angle) * 0.3, -0.2, Math.sin(angle) * 0.3]}
              rotation={[0.35 * Math.sin(angle), 0, -0.35 * Math.cos(angle)]}
            >
              <cylinderGeometry args={[0.02, 0.04, 0.45, 6]} />
              <meshStandardMaterial color="#e0f2fe" transparent opacity={0.65} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
};

// ------------------------------------------------------------
// 2. GLASS CONSERVATORY / GREENHOUSE
// ------------------------------------------------------------
export const GreenhouseConservatory3D: React.FC<{
  position?: [number, number, number];
  rotationY?: number;
}> = ({ position = [0, 0, 0], rotationY = 0 }) => {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Brick Foundation Base */}
      <mesh castShadow receiveShadow position={[0, 0.2, 0]}>
        <boxGeometry args={[3.2, 0.4, 2.2]} />
        <meshStandardMaterial color="#991b1b" roughness={0.8} />
      </mesh>

      {/* Green Painted Cast Iron Arched Frame */}
      <mesh castShadow position={[0, 1.3, 0]}>
        <boxGeometry args={[3.1, 1.8, 2.1]} />
        <meshStandardMaterial color="#064e3b" roughness={0.4} wireframe wireframeLinewidth={2} />
      </mesh>

      {/* Translucent Frosted Glass Panes */}
      <mesh position={[0, 1.3, 0]}>
        <boxGeometry args={[3.05, 1.75, 2.05]} />
        <meshStandardMaterial
          color="#ecfeff"
          transparent
          opacity={0.45}
          roughness={0.1}
          metalness={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Gable / Arched Roof Glass */}
      <mesh castShadow position={[0, 2.5, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.05, 1.6, 0.7, 4]} />
        <meshStandardMaterial color="#064e3b" roughness={0.5} wireframe />
      </mesh>
      <mesh position={[0, 2.48, 0]}>
        <cylinderGeometry args={[0.04, 1.55, 0.68, 4]} />
        <meshStandardMaterial color="#cffafe" transparent opacity={0.5} roughness={0.1} />
      </mesh>

      {/* Interior Exotic Potted Palms */}
      {[-0.8, 0, 0.8].map((x, i) => (
        <group key={`greenhouse_plant_${i}`} position={[x, 0.45, 0]}>
          <mesh castShadow position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.18, 0.14, 0.35, 8]} />
            <meshStandardMaterial color="#78350f" />
          </mesh>
          <mesh castShadow position={[0, 0.65, 0]}>
            <dodecahedronGeometry args={[0.38, 0]} />
            <meshStandardMaterial color="#059669" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.85, 0]}>
            <sphereGeometry args={[0.08, 6, 6]} />
            <meshStandardMaterial color="#f43f5e" />
          </mesh>
        </group>
      ))}

      {/* Labeled Plaque */}
      <Html position={[0, 1.8, 1.15]} center distanceFactor={16}>
        <div className="bg-emerald-950/90 text-emerald-300 font-bold text-[9px] px-2 py-0.5 rounded shadow border border-emerald-500 whitespace-nowrap">
          TROPICAL CONSERVATORY
        </div>
      </Html>
    </group>
  );
};

// ------------------------------------------------------------
// 3. TROPICAL PLANTS ZONE (Zone B: Palms, Monstera, Ferns)
// ------------------------------------------------------------
export const TropicalPlantsZone3D: React.FC<{
  position?: [number, number, number];
}> = ({ position = [0, 0, 0] }) => {
  return (
    <group position={position}>
      {/* Stone Border Bed */}
      <mesh castShadow receiveShadow position={[0, 0.08, 0]}>
        <boxGeometry args={[2.8, 0.16, 2.2]} />
        <meshStandardMaterial color="#78716c" roughness={0.7} />
      </mesh>
      {/* Dark Tropical Soil */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[2.6, 0.12, 2.0]} />
        <meshStandardMaterial color="#271302" roughness={0.9} />
      </mesh>

      {/* 2 Tall Fan Palms */}
      {[-0.7, 0.7].map((x, i) => (
        <group key={`palm_${i}`} position={[x, 0.16, (i % 2 === 0 ? 0.4 : -0.4)]}>
          <mesh castShadow position={[0, 1.1, 0]}>
            <cylinderGeometry args={[0.08, 0.12, 2.2, 8]} />
            <meshStandardMaterial color="#5c3a21" roughness={0.8} />
          </mesh>
          {/* Palm Fronds */}
          {[0, 1.2, 2.4, 3.6, 4.8].map((angle, j) => (
            <mesh
              key={`frond_${i}_${j}`}
              position={[Math.cos(angle) * 0.4, 2.15, Math.sin(angle) * 0.4]}
              rotation={[0.4 * Math.sin(angle), 0, -0.4 * Math.cos(angle)]}
            >
              <planeGeometry args={[0.7, 0.35]} />
              <meshStandardMaterial color="#15803d" side={THREE.DoubleSide} roughness={0.6} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Dense Understory Ferns */}
      {[-0.6, 0, 0.6].map((x, i) =>
        [-0.4, 0, 0.4].map((z, j) => (
          <mesh key={`fern_${i}_${j}`} position={[x, 0.28, z]} rotation={[0, (i + j) * 0.8, 0]}>
            <dodecahedronGeometry args={[0.26, 0]} />
            <meshStandardMaterial color="#16a34a" roughness={0.7} />
          </mesh>
        ))
      )}
    </group>
  );
};

// ------------------------------------------------------------
// 4. FORMAL FLOWER BEDS (Zone A: Roses, Tulips, Marigolds)
// ------------------------------------------------------------
export const FlowerBed3D: React.FC<{
  position?: [number, number, number];
  flowerColor?: string;
}> = ({ position = [0, 0, 0], flowerColor = '#ef4444' }) => {
  return (
    <group position={position}>
      {/* Sculpted Stone Border Kerb */}
      <mesh castShadow receiveShadow position={[0, 0.1, 0]}>
        <boxGeometry args={[2.2, 0.2, 1.6]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.7} />
      </mesh>
      {/* Rich Dark Organic Mulch Soil */}
      <mesh position={[0, 0.18, 0]}>
        <boxGeometry args={[2.0, 0.14, 1.4]} />
        <meshStandardMaterial color="#3b1d06" roughness={0.9} />
      </mesh>

      {/* Low Trimmed Boxwood Border Hedges */}
      {[-0.95, 0.95].map((x, i) => (
        <mesh key={`hedge_x_${i}`} position={[x, 0.28, 0]}>
          <boxGeometry args={[0.15, 0.2, 1.4]} />
          <meshStandardMaterial color="#166534" roughness={0.8} />
        </mesh>
      ))}
      {[-0.65, 0.65].map((z, j) => (
        <mesh key={`hedge_z_${j}`} position={[0, 0.28, z]}>
          <boxGeometry args={[1.8, 0.2, 0.15]} />
          <meshStandardMaterial color="#166534" roughness={0.8} />
        </mesh>
      ))}

      {/* Symmetrical Layered Flowers in Rows */}
      {[-0.6, -0.2, 0.2, 0.6].map((x, i) =>
        [-0.35, 0, 0.35].map((z, j) => {
          const col = (i + j) % 2 === 0 ? flowerColor : '#eab308';
          const height = 0.24 + ((i * 3 + j) % 3) * 0.04;

          return (
            <group key={`flower_stem_${i}_${j}`} position={[x, 0.24, z]}>
              <mesh position={[0, height / 2, 0]}>
                <cylinderGeometry args={[0.015, 0.015, height, 6]} />
                <meshStandardMaterial color="#15803d" />
              </mesh>
              <mesh castShadow position={[0, height + 0.04, 0]}>
                <sphereGeometry args={[0.075, 8, 8]} />
                <meshStandardMaterial color={col} roughness={0.4} />
              </mesh>
            </group>
          );
        })
      )}
    </group>
  );
};

// ------------------------------------------------------------
// 5. BOTANICAL SPECIMEN SIGNBOARD & COLLECTION (Zone C)
// ------------------------------------------------------------
export const BotanicalSpecimenZone3D: React.FC<{
  position?: [number, number, number];
  title?: string;
  flowerColor?: string;
}> = ({ position = [0, 0, 0], title = 'Rosa Gallica (French Rose)', flowerColor = '#f43f5e' }) => {
  return (
    <group position={position}>
      <FlowerBed3D flowerColor={flowerColor} />
      {/* Wooden Botanical Signboard */}
      <group position={[0, 0.45, 0.85]} rotation={[0.2, 0, 0]}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.6, 6]} />
          <meshStandardMaterial color="#78350f" />
        </mesh>
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[0.6, 0.24, 0.04]} />
          <meshStandardMaterial color="#fef3c7" roughness={0.6} />
        </mesh>
        <Html position={[0, 0.3, 0.03]} center distanceFactor={14}>
          <div className="bg-amber-900 text-amber-100 font-bold text-[8px] px-1.5 py-0.5 rounded shadow whitespace-nowrap">
            {title}
          </div>
        </Html>
      </group>
    </group>
  );
};

// ------------------------------------------------------------
// 6. VICTORIAN OCTAGONAL GAZEBO
// ------------------------------------------------------------
export const VictorianGazebo3D: React.FC<{
  position?: [number, number, number];
  rotationY?: number;
}> = ({ position = [0, 0, 0], rotationY = 0 }) => {
  const postsCount = 8;
  const radius = 1.4;

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Octagonal Cut-Stone Base Plinth */}
      <mesh castShadow receiveShadow position={[0, 0.16, 0]}>
        <cylinderGeometry args={[radius + 0.25, radius + 0.3, 0.32, postsCount]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.6} />
      </mesh>

      {/* Cedar Wood Parquet Floor */}
      <mesh receiveShadow position={[0, 0.33, 0]}>
        <cylinderGeometry args={[radius + 0.12, radius + 0.12, 0.04, postsCount]} />
        <meshStandardMaterial color="#9a3412" roughness={0.7} />
      </mesh>

      {/* 8 Turned Timber Columns with Capitals */}
      {Array.from({ length: postsCount }).map((_, i) => {
        const angle = (i * Math.PI * 2) / postsCount;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        return (
          <group key={`gazebo_col_${i}`} position={[x, 0.33, z]}>
            <mesh castShadow position={[0, 1.15, 0]}>
              <cylinderGeometry args={[0.055, 0.065, 2.3, 8]} />
              <meshStandardMaterial color="#ffffff" roughness={0.4} />
            </mesh>
            <mesh position={[0, 0.1, 0]}>
              <boxGeometry args={[0.16, 0.12, 0.16]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
            <mesh position={[0, 2.2, 0]}>
              <boxGeometry args={[0.16, 0.12, 0.16]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
          </group>
        );
      })}

      {/* Perimeter Balustrades */}
      {Array.from({ length: postsCount - 1 }).map((_, i) => {
        const angle1 = (i * Math.PI * 2) / postsCount;
        const angle2 = ((i + 1) * Math.PI * 2) / postsCount;
        const midX = (Math.cos(angle1) + Math.cos(angle2)) * 0.5 * radius;
        const midZ = (Math.sin(angle1) + Math.sin(angle2)) * 0.5 * radius;
        const rotY = Math.atan2(Math.cos(angle1) - Math.cos(angle2), -(Math.sin(angle1) - Math.sin(angle2)));

        return (
          <mesh key={`gazebo_rail_${i}`} position={[midX, 0.72, midZ]} rotation={[0, rotY, 0]}>
            <boxGeometry args={[0.92, 0.62, 0.05]} />
            <meshStandardMaterial color="#ffffff" roughness={0.5} />
          </mesh>
        );
      })}

      {/* Steeple Shingled Teal Roof */}
      <mesh castShadow position={[0, 3.0, 0]}>
        <cylinderGeometry args={[0.1, radius + 0.4, 1.3, postsCount]} />
        <meshStandardMaterial color="#0f766e" roughness={0.6} />
      </mesh>
      {/* Weathervane / Brass Finial */}
      <mesh position={[0, 3.8, 0]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial color="#d97706" metalness={0.8} />
      </mesh>
    </group>
  );
};

// ------------------------------------------------------------
// 7. LOTUS & KOI POND WITH WATER LILIES
// ------------------------------------------------------------
export const KoiPond3D: React.FC<{ position?: [number, number, number] }> = ({
  position = [0, 0, 0],
}) => {
  return (
    <group position={position}>
      {/* Natural River Boulders Rim */}
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i * Math.PI * 2) / 16;
        const r = 1.35 + ((i % 3) * 0.1 - 0.1);
        const x = Math.cos(angle) * r;
        const z = Math.sin(angle) * r;
        const rockScale = 0.28 + ((i % 4) * 0.05);

        return (
          <mesh
            key={`pond_rock_${i}`}
            castShadow
            position={[x, 0.12, z]}
            scale={[rockScale, rockScale * 0.8, rockScale]}
          >
            <dodecahedronGeometry args={[0.8, 0]} />
            <meshStandardMaterial color="#64748b" roughness={0.9} />
          </mesh>
        );
      })}

      {/* Deep Clear Water Surface */}
      <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.3, 24]} />
        <meshStandardMaterial
          color="#0284c7"
          roughness={0.04}
          metalness={0.35}
          transparent
          opacity={0.88}
        />
      </mesh>

      {/* Water Lilies */}
      {[
        { x: -0.45, z: 0.3 },
        { x: 0.5, z: -0.25 },
        { x: 0.15, z: 0.55 },
      ].map((pad, idx) => (
        <group key={`lily_pad_${idx}`} position={[pad.x, 0.11, pad.z]}>
          <mesh rotation={[-Math.PI / 2, 0, idx * 1.5]}>
            <circleGeometry args={[0.2, 12, 0, Math.PI * 1.8]} />
            <meshStandardMaterial color="#22c55e" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.04, 0]}>
            <sphereGeometry args={[0.06, 6, 6]} />
            <meshStandardMaterial color="#ec4899" />
          </mesh>
        </group>
      ))}
    </group>
  );
};

// ------------------------------------------------------------
// 8. COMPLETE QUADRANT II BOTANICAL GARDEN WITH PROGRESSIVE BUILD
// ------------------------------------------------------------
export const FullQuadrant2Botanical3D: React.FC<{
  progress: number; // 0 to 1
  isBuilding: boolean;
  isBuilt: boolean;
}> = ({ progress, isBuilding, isBuilt }) => {
  const gardenerRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (gardenerRef.current) {
      // Watering / Inspecting motion
      gardenerRef.current.rotation.y = Math.sin(t * 0.8) * 0.5;
    }
  });

  if (!isBuilding && !isBuilt) {
    return (
      <group position={[-6, 0, -6]}>
        <mesh receiveShadow position={[0, 0.01, 0]}>
          <boxGeometry args={[9.5, 0.02, 9.5]} />
          <meshStandardMaterial color="#1e3a24" roughness={0.9} opacity={0.6} transparent />
        </mesh>
        {[-4, 4].map((x, i) =>
          [-4, 4].map((z, j) => (
            <mesh key={`stake_q2_${i}_${j}`} position={[x, 0.2, z]}>
              <cylinderGeometry args={[0.03, 0.03, 0.4, 6]} />
              <meshStandardMaterial color="#10b981" />
            </mesh>
          ))
        )}
      </group>
    );
  }

  const stageScale = isBuilt ? 1 : Math.min(1, 0.1 + progress * 0.9);
  const showEarly = progress > 0.15 || isBuilt;
  const showMiddle = progress > 0.45 || isBuilt;
  const showComplete = progress > 0.75 || isBuilt;
  const showStaff = progress > 0.85 || isBuilt;

  return (
    <group position={[-6, 0, -6]}>
      {/* 1. Lush Manicured Turf Base with Winding Stone Promenade */}
      <mesh receiveShadow position={[0, 0.02, 0]}>
        <boxGeometry args={[9.4, 0.04, 9.4]} />
        <meshStandardMaterial color="#166534" roughness={0.8} />
      </mesh>
      {/* Winding Cobblestone Garden Pathways */}
      <mesh position={[0, 0.025, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.9, 0.03, 8.8]} />
        <meshStandardMaterial color="#d6d3d1" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.025, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[0.9, 0.03, 8.8]} />
        <meshStandardMaterial color="#d6d3d1" roughness={0.7} />
      </mesh>

      {/* 2. Construction Crew during 8-10s Build */}
      {isBuilding && progress < 0.95 && (
        <group>
          <ConstructionWorker3D
            position={[-1.8, 0, -1.8 + Math.sin(progress * 8) * 1.5]}
            isConstructing={true}
          />
          <ConstructionWorker3D
            position={[1.8, 0, 1.8]}
            isConstructing={true}
          />
          <ConstructionCart3D position={[-3.2, 0, -3.2]} rotationY={Math.PI / 4} />
        </group>
      )}

      {/* 3. Glass Conservatory Greenhouse (North-East corner of QII) */}
      {showEarly && (
        <group scale={[stageScale, stageScale, stageScale]}>
          <GreenhouseConservatory3D position={[2.2, 0, -2.2]} rotationY={0} />
          <VictorianGazebo3D position={[-2.2, 0, 2.2]} rotationY={0} />
        </group>
      )}

      {/* 4. Tropical Jungle & Specimen Collections */}
      {showMiddle && (
        <group scale={[stageScale, stageScale, stageScale]}>
          <TropicalPlantsZone3D position={[-2.2, 0, -2.2]} />
          <BotanicalSpecimenZone3D position={[2.2, 0, 2.2]} title="Rosa Damascena" flowerColor="#f43f5e" />
          <KoiPond3D position={[0, 0, 0]} />
        </group>
      )}

      {/* 5. Tree Garden, Benches & Botanical Staff */}
      {showComplete && (
        <group scale={[stageScale, stageScale, stageScale]}>
          <ShadyTree3D position={[-3.8, 0, -3.8]} scale={1.15} />
          <ShadyTree3D position={[3.8, 0, 3.8]} scale={1.2} />
          <ParkBench3D position={[0, 0, -3.8]} rotationY={0} hasVisitor={showStaff} />
          <ParkBench3D position={[3.8, 0, 0]} rotationY={-Math.PI / 2} hasVisitor={showStaff} />
        </group>
      )}

      {/* 6. Active Gardeners Monitoring & Visitors Observing */}
      {showStaff && (
        <group>
          {/* Head Gardener Inspecting Tropical Plants */}
          <group position={[-1.2, 0, -2.0]} ref={gardenerRef}>
            <StylizedHuman3D
              scale={0.88}
              shirtColor="#15803d"
              pantsColor="#3f3f46"
              hairColor="#78350f"
              isWalking={false}
              isHammering={true} // Bending / examining plants
            />
            {/* Watering Can Accessory */}
            <mesh position={[0.28, 0.4, 0.1]}>
              <cylinderGeometry args={[0.08, 0.1, 0.22, 8]} />
              <meshStandardMaterial color="#0284c7" metalness={0.7} />
            </mesh>
          </group>

          {/* Assistant Gardener tending flower bed */}
          <group position={[1.4, 0, 2.2]}>
            <StylizedHuman3D
              scale={0.88}
              shirtColor="#047857"
              pantsColor="#18181b"
              isWalking={false}
              isHammering={true}
            />
          </group>

          {/* Visitor reading specimen sign */}
          <group position={[2.2, 0, 3.2]} rotation={[0, Math.PI, 0]}>
            <StylizedHuman3D
              scale={0.9}
              shirtColor="#9333ea"
              pantsColor="#3b82f6"
              isWalking={false}
            />
          </group>
        </group>
      )}
    </group>
  );
};
