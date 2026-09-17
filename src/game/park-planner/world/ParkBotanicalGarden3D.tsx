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
// 1. GRAND 3-TIER MARBLE FOUNTAIN WITH 6 SPRINKLERS & LED LIGHTS
// ------------------------------------------------------------
export const TieredFountain3D: React.FC<{
  position?: [number, number, number];
  isFlowing?: boolean;
}> = ({ position = [0, 0, 0], isFlowing = true }) => {
  const centralGeyserRef = useRef<THREE.Group>(null);
  const ripple1Ref = useRef<THREE.Mesh>(null);
  const ripple2Ref = useRef<THREE.Mesh>(null);
  const lightsGroupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (isFlowing) {
      if (centralGeyserRef.current) {
        const pulse = 1.0 + Math.sin(t * 6) * 0.15 + Math.sin(t * 11) * 0.08;
        centralGeyserRef.current.scale.set(1.0 + Math.sin(t * 4) * 0.08, pulse, 1.0 + Math.cos(t * 4) * 0.08);
      }
      if (ripple1Ref.current) {
        const s = 1 + ((t * 1.2) % 1) * 0.6;
        ripple1Ref.current.scale.set(s, s, 1);
        (ripple1Ref.current.material as THREE.MeshStandardMaterial).opacity =
          0.8 * (1 - ((t * 1.2) % 1));
      }
      if (ripple2Ref.current) {
        const s = 1 + (((t * 1.2) + 0.5) % 1) * 0.6;
        ripple2Ref.current.scale.set(s, s, 1);
        (ripple2Ref.current.material as THREE.MeshStandardMaterial).opacity =
          0.8 * (1 - (((t * 1.2) + 0.5) % 1));
      }
      if (lightsGroupRef.current) {
        lightsGroupRef.current.rotation.y = t * 0.3;
      }
    }
  });

  return (
    <group position={position}>
      {/* 1. Octagonal Carved Granite Dais Foundation */}
      <mesh receiveShadow position={[0, 0.06, 0]}>
        <cylinderGeometry args={[2.3, 2.45, 0.12, 8]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.5} />
      </mesh>
      {/* Decorative Beveled Curb Trim */}
      <mesh position={[0, 0.13, 0]}>
        <cylinderGeometry args={[2.22, 2.3, 0.04, 8]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.4} />
      </mesh>

      {/* 2. Main Grand Lower Basin (Radius 2.05m) */}
      <mesh castShadow receiveShadow position={[0, 0.38, 0]}>
        <cylinderGeometry args={[1.95, 2.05, 0.52, 32, 1, true]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.15} metalness={0.1} />
      </mesh>
      {/* Molded Marble Outer Coping Lip */}
      <mesh position={[0, 0.64, 0]}>
        <torusGeometry args={[2.0, 0.08, 12, 32]} />
        <meshStandardMaterial color="#ffffff" roughness={0.15} metalness={0.15} />
      </mesh>

      {/* Lower Basin Deep Glistening Water Surface */}
      <mesh position={[0, 0.52, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.94, 32]} />
        <meshStandardMaterial
          color="#0284c7"
          roughness={0.03}
          metalness={0.5}
          transparent
          opacity={0.92}
        />
      </mesh>

      {/* Animated Water Ripples */}
      {isFlowing && (
        <>
          <mesh ref={ripple1Ref} position={[0, 0.53, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.6, 0.8, 32]} />
            <meshStandardMaterial color="#bae6fd" transparent opacity={0.7} />
          </mesh>
          <mesh ref={ripple2Ref} position={[0, 0.535, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.6, 0.8, 32]} />
            <meshStandardMaterial color="#7dd3fc" transparent opacity={0.7} />
          </mesh>
        </>
      )}

      {/* 3. 6 Underwater Submersible LED Light Fixtures */}
      <group position={[0, 0.45, 0]} ref={lightsGroupRef}>
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const angle = (i * Math.PI) / 3;
          const lx = Math.cos(angle) * 1.45;
          const lz = Math.sin(angle) * 1.45;
          const lightColor = ['#38bdf8', '#22d3ee', '#34d399', '#38bdf8', '#60a5fa', '#a78bfa'][i];

          return (
            <group key={`fountain_led_${i}`} position={[lx, 0, lz]}>
              {/* Brass Submersible Light Housing */}
              <mesh position={[0, -0.04, 0]}>
                <cylinderGeometry args={[0.07, 0.08, 0.08, 12]} />
                <meshStandardMaterial color="#d97706" metalness={0.8} />
              </mesh>
              {/* Glowing LED Lens */}
              <mesh position={[0, 0.01, 0]}>
                <cylinderGeometry args={[0.06, 0.06, 0.02, 12]} />
                <meshStandardMaterial color={lightColor} emissive={lightColor} emissiveIntensity={isFlowing ? 1.8 : 0.2} />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* 4. Center Fluted Classical Pedestal */}
      <mesh castShadow position={[0, 0.95, 0]}>
        <cylinderGeometry args={[0.34, 0.48, 1.1, 20]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.2} />
      </mesh>

      {/* 5. Middle Floating Marble Basin (Radius 1.2m) */}
      <group position={[0, 1.5, 0]}>
        <mesh castShadow position={[0, 0, 0]}>
          <cylinderGeometry args={[1.2, 0.5, 0.35, 24]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.15} />
        </mesh>
        {/* Middle Basin Rim */}
        <mesh position={[0, 0.18, 0]}>
          <torusGeometry args={[1.22, 0.05, 8, 24]} />
          <meshStandardMaterial color="#ffffff" roughness={0.15} />
        </mesh>
        {/* Middle Basin Water */}
        <mesh position={[0, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.18, 24]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.04} transparent opacity={0.9} />
        </mesh>
      </group>

      {/* 6. Upper Spire Column & Top Urn Bowl (Radius 0.65m) */}
      <mesh castShadow position={[0, 2.0, 0]}>
        <cylinderGeometry args={[0.2, 0.28, 0.8, 16]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.2} />
      </mesh>
      <group position={[0, 2.45, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.65, 0.25, 0.25, 20]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.15} />
        </mesh>
        <mesh position={[0, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.62, 20]} />
          <meshStandardMaterial color="#67e8f9" roughness={0.02} transparent opacity={0.95} />
        </mesh>
        {/* Golden Crown Finial Spout */}
        <mesh position={[0, 0.22, 0]}>
          <sphereGeometry args={[0.16, 16, 16]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.15} />
        </mesh>
      </group>

      {/* 7. ANIMATED WATER JETS & 6 PERIMETER SPRINKLERS */}
      {isFlowing && (
        <group>
          {/* Main High-Pressure Vertical Geyser (Top Spout) */}
          <group position={[0, 2.7, 0]} ref={centralGeyserRef}>
            {/* Core Water Column */}
            <mesh position={[0, 0.6, 0]}>
              <cylinderGeometry args={[0.05, 0.12, 1.2, 10]} />
              <meshStandardMaterial color="#e0f2fe" transparent opacity={0.8} roughness={0.05} />
            </mesh>
            {/* Foaming Water Plume Top */}
            <mesh position={[0, 1.2, 0]}>
              <sphereGeometry args={[0.22, 10, 10]} />
              <meshStandardMaterial color="#ffffff" transparent opacity={0.85} roughness={0.1} />
            </mesh>
          </group>

          {/* 6 Perimeter Arched Sprinklers Shooting Inward */}
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const angle = (i * Math.PI) / 3;
            const sx = Math.cos(angle) * 1.45;
            const sz = Math.sin(angle) * 1.45;
            const tiltX = -Math.sin(angle) * 0.45;
            const tiltZ = -Math.cos(angle) * 0.45;

            return (
              <group key={`sprinkler_${i}`} position={[sx, 0.52, sz]} rotation={[tiltX, 0, tiltZ]}>
                {/* Sprinkler Brass Nozzle */}
                <mesh position={[0, 0.02, 0]}>
                  <cylinderGeometry args={[0.02, 0.03, 0.06, 8]} />
                  <meshStandardMaterial color="#d97706" metalness={0.8} />
                </mesh>
                {/* Arced Crystal Water Spray Jet */}
                <mesh position={[0, 0.45, 0.15]} rotation={[0.4, 0, 0]}>
                  <cylinderGeometry args={[0.02, 0.05, 0.95, 8]} />
                  <meshStandardMaterial color="#e0f2fe" transparent opacity={0.72} roughness={0.08} />
                </mesh>
              </group>
            );
          })}

          {/* Upper Tier 4 Overflow Water Curtains */}
          {[0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2].map((angle, idx) => (
            <mesh
              key={`cascade_${idx}`}
              position={[Math.cos(angle) * 0.95, 1.2, Math.sin(angle) * 0.95]}
              rotation={[0.25 * Math.sin(angle), 0, -0.25 * Math.cos(angle)]}
            >
              <cylinderGeometry args={[0.03, 0.08, 0.65, 8]} />
              <meshStandardMaterial color="#e0f2fe" transparent opacity={0.68} />
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
