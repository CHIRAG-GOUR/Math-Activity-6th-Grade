// ============================================================
// PARK PLANNER — 3D Metropolitan City World & Sky Environment
// Surrounds the central 4-Quadrant Park with:
// 1. Radiant 3D Sun with pulsing corona flare & volumetric drifting clouds
// 2. Metropolitan Skyline with glass towers, modern high-rises, antennas & neon signs
// 3. Ground-Floor Streetscape with Shops (Bakery, Coffee Shop, Florist, Ice Cream)
// 4. Street Stalls (Hotdog/Pretzel Cart, Fruit Stand, Juice Bar)
// 5. Roadside Balloon Seller with animated swaying floating helium balloons
// 6. Urban Details (Yellow Taxis, City Cars, Bus Shelters, Streetlights, Zebra Crossings)
// ============================================================

import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { StylizedHuman3D, RealisticCyclist3D } from './ParkCharacters3D';

// ------------------------------------------------------------
// 1. RADIANT 3D SUN & DRIFTING CLOUDS
// ------------------------------------------------------------
export const RadiantSunAndClouds3D: React.FC = () => {
  const sunCoronaRef = useRef<THREE.Mesh>(null);
  const sunRaysRef = useRef<THREE.Group>(null);
  const cloudsGroupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    // Pulsing sun corona
    if (sunCoronaRef.current) {
      const s = 1.0 + Math.sin(t * 1.5) * 0.08;
      sunCoronaRef.current.scale.set(s, s, s);
    }
    // Slowly rotating sun ray flares
    if (sunRaysRef.current) {
      sunRaysRef.current.rotation.z = t * 0.05;
    }
    // Drifting clouds across the sky
    if (cloudsGroupRef.current) {
      cloudsGroupRef.current.position.x = ((t * 0.8) % 120) - 60;
    }
  });

  return (
    <group name="SunAndAtmosphere">
      {/* 3D Sun in upper sky (Warm golden daylight) */}
      <group position={[28, 42, -28]}>
        {/* Core Glowing Sun Sphere */}
        <mesh>
          <sphereGeometry args={[3.2, 24, 24]} />
          <meshBasicMaterial color="#fffbeb" />
        </mesh>

        {/* Inner Golden Corona */}
        <mesh ref={sunCoronaRef}>
          <sphereGeometry args={[4.2, 20, 20]} />
          <meshBasicMaterial color="#fef08a" transparent opacity={0.65} />
        </mesh>

        {/* Outer Radiant Flare Disc */}
        <mesh rotation={[Math.PI / 4, 0, 0]}>
          <ringGeometry args={[4.5, 7.5, 32]} />
          <meshBasicMaterial color="#fde047" transparent opacity={0.35} side={THREE.DoubleSide} />
        </mesh>

        {/* Subtle Radial Sun Rays */}
        <group ref={sunRaysRef}>
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => {
            const rad = (deg * Math.PI) / 180;
            return (
              <mesh key={`sun_ray_${i}`} position={[Math.cos(rad) * 6.5, Math.sin(rad) * 6.5, 0]} rotation={[0, 0, rad]}>
                <boxGeometry args={[3.5, 0.25, 0.05]} />
                <meshBasicMaterial color="#facc15" transparent opacity={0.25} />
              </mesh>
            );
          })}
        </group>
      </group>

      {/* Drifting Low-Poly 3D Clouds */}
      <group ref={cloudsGroupRef} position={[0, 32, 0]}>
        {[
          { x: -35, y: 0, z: -15, scale: 1.4 },
          { x: -10, y: 3, z: -30, scale: 1.8 },
          { x: 20, y: -2, z: -20, scale: 1.5 },
          { x: 45, y: 1, z: -10, scale: 1.2 },
          { x: -25, y: -1, z: 25, scale: 1.6 },
          { x: 15, y: 2, z: 30, scale: 1.3 },
        ].map((c, idx) => (
          <group key={`cloud_${idx}`} position={[c.x, c.y, c.z]} scale={c.scale}>
            {/* Fluffy overlapping white spheres */}
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[2.0, 10, 10]} />
              <meshStandardMaterial color="#ffffff" roughness={0.3} />
            </mesh>
            <mesh position={[1.5, -0.2, 0.2]}>
              <sphereGeometry args={[1.5, 8, 8]} />
              <meshStandardMaterial color="#ffffff" roughness={0.3} />
            </mesh>
            <mesh position={[-1.5, -0.3, -0.2]}>
              <sphereGeometry args={[1.6, 8, 8]} />
              <meshStandardMaterial color="#ffffff" roughness={0.3} />
            </mesh>
            <mesh position={[0.6, 0.8, -0.3]}>
              <sphereGeometry args={[1.3, 8, 8]} />
              <meshStandardMaterial color="#ffffff" roughness={0.3} />
            </mesh>
            <mesh position={[-0.8, 0.6, 0.4]}>
              <sphereGeometry args={[1.2, 8, 8]} />
              <meshStandardMaterial color="#ffffff" roughness={0.3} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
};

// ------------------------------------------------------------
// 2. MODULAR SKYSCRAPERS & CITY BUILDINGS
// ------------------------------------------------------------
interface BuildingProps {
  position: [number, number, number];
  width?: number;
  height?: number;
  depth?: number;
  facadeColor?: string;
  accentColor?: string;
  hasAntenna?: boolean;
  hasHelipad?: boolean;
  buildingName?: string;
  hasBalconies?: boolean;
}

export const CityBuilding3D: React.FC<BuildingProps> = ({
  position,
  width = 6,
  height = 18,
  depth = 6,
  facadeColor = '#334155',
  accentColor = '#38bdf8',
  hasAntenna = false,
  hasHelipad = false,
  buildingName,
  hasBalconies = false,
}) => {
  const floors = Math.floor(height / 1.8);

  return (
    <group position={position}>
      {/* Main Structural Body */}
      <mesh castShadow receiveShadow position={[0, height / 2, 0]}>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={facadeColor} roughness={0.6} />
      </mesh>

      {/* Windows Grid Pattern on Facades */}
      {Array.from({ length: Math.min(10, floors) }).map((_, f) => {
        const yPos = 1.6 + f * 1.6;
        return (
          <group key={`floor_${f}`} position={[0, yPos, 0]}>
            {/* Front & Back Windows (+Z / -Z) */}
            {[-width * 0.3, 0, width * 0.3].map((wx, wi) => (
              <React.Fragment key={`win_fb_${wi}`}>
                <mesh position={[wx, 0, depth / 2 + 0.02]}>
                  <planeGeometry args={[width * 0.22, 0.9]} />
                  <meshStandardMaterial color={accentColor} metalness={0.8} roughness={0.1} />
                </mesh>
                <mesh position={[wx, 0, -depth / 2 - 0.02]} rotation={[0, Math.PI, 0]}>
                  <planeGeometry args={[width * 0.22, 0.9]} />
                  <meshStandardMaterial color={accentColor} metalness={0.8} roughness={0.1} />
                </mesh>
              </React.Fragment>
            ))}

            {/* Left & Right Windows (+X / -X) */}
            {[-depth * 0.25, depth * 0.25].map((wz, wi) => (
              <React.Fragment key={`win_lr_${wi}`}>
                <mesh position={[width / 2 + 0.02, 0, wz]} rotation={[0, Math.PI / 2, 0]}>
                  <planeGeometry args={[depth * 0.3, 0.9]} />
                  <meshStandardMaterial color={accentColor} metalness={0.8} roughness={0.1} />
                </mesh>
                <mesh position={[-width / 2 - 0.02, 0, wz]} rotation={[0, -Math.PI / 2, 0]}>
                  <planeGeometry args={[depth * 0.3, 0.9]} />
                  <meshStandardMaterial color={accentColor} metalness={0.8} roughness={0.1} />
                </mesh>
              </React.Fragment>
            ))}

            {/* Balconies if residential */}
            {hasBalconies && f % 2 === 0 && (
              <mesh position={[0, -0.4, depth / 2 + 0.35]}>
                <boxGeometry args={[width * 0.8, 0.4, 0.6]} />
                <meshStandardMaterial color="#64748b" roughness={0.5} />
              </mesh>
            )}
          </group>
        );
      })}

      {/* Roof Parapet & Equipment */}
      <mesh castShadow position={[0, height + 0.2, 0]}>
        <boxGeometry args={[width + 0.3, 0.4, depth + 0.3]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* Roof HVAC Equipment Boxes */}
      <mesh castShadow position={[width * 0.2, height + 0.8, depth * 0.2]}>
        <boxGeometry args={[1.5, 1.0, 1.5]} />
        <meshStandardMaterial color="#475569" roughness={0.7} />
      </mesh>

      {/* Rooftop Antenna */}
      {hasAntenna && (
        <group position={[0, height + 0.4, 0]}>
          <mesh position={[0, 2.5, 0]}>
            <cylinderGeometry args={[0.04, 0.12, 5.0, 6]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
          </mesh>
          {/* Flashing Red Warning Beacon */}
          <mesh position={[0, 5.1, 0]}>
            <sphereGeometry args={[0.16, 8, 8]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>
        </group>
      )}

      {/* Rooftop Helipad */}
      {hasHelipad && (
        <group position={[0, height + 0.45, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[width * 0.38, 16]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[width * 0.32, width * 0.36, 16]} />
            <meshBasicMaterial color="#facc15" side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}

      {/* Building Name Plaque / Neon Sign */}
      {buildingName && (
        <Html position={[0, height - 1.2, depth / 2 + 0.1]} center distanceFactor={22} occlude pointerEvents="none">
          <div className="bg-slate-900/90 text-cyan-300 font-extrabold text-[9px] px-2.5 py-1 rounded shadow-lg border border-cyan-400 tracking-wider whitespace-nowrap select-none pointer-events-none">
            {buildingName}
          </div>
        </Html>
      )}
    </group>
  );
};

// ------------------------------------------------------------
// 3. GROUND-FLOOR SHOPS, CAFES & BOUTIQUES
// ------------------------------------------------------------
interface ShopProps {
  position: [number, number, number];
  rotationY?: number;
  shopName: string;
  awningColors: [string, string];
  shopType: 'bakery' | 'cafe' | 'florist' | 'icecream' | 'bookstore';
}

export const CityShopFront3D: React.FC<ShopProps> = ({
  position,
  rotationY = 0,
  shopName,
  awningColors,
  shopType,
}) => {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Shop Building Frontage */}
      <mesh castShadow receiveShadow position={[0, 2.0, 0]}>
        <boxGeometry args={[4.2, 4.0, 3.2]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.7} />
      </mesh>

      {/* Large Glass Display Window */}
      <mesh position={[0, 1.4, 1.62]}>
        <planeGeometry args={[3.2, 1.8]} />
        <meshStandardMaterial color="#0284c7" metalness={0.7} roughness={0.1} transparent opacity={0.7} />
      </mesh>

      {/* Shop Entrance Door */}
      <mesh position={[1.2, 1.1, 1.63]}>
        <planeGeometry args={[0.9, 2.0]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* Striped Overhanging Fabric Awning */}
      <group position={[0, 2.5, 1.9]} rotation={[0.35, 0, 0]}>
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh key={`awning_stripe_${i}`} position={[-1.75 + i * 0.5, 0, 0]}>
            <boxGeometry args={[0.48, 0.04, 1.1]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? awningColors[0] : awningColors[1]}
              roughness={0.6}
            />
          </mesh>
        ))}
      </group>

      {/* Outdoor Display Items / Street Furniture */}
      {shopType === 'cafe' && (
        <group position={[-1.2, 0, 2.2]}>
          {/* Outdoor Cafe Table */}
          <mesh castShadow position={[0, 0.45, 0]}>
            <cylinderGeometry args={[0.35, 0.35, 0.04, 12]} />
            <meshStandardMaterial color="#475569" />
          </mesh>
          <mesh position={[0, 0.22, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.45, 6]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          {/* 2 Chairs */}
          {[-0.45, 0.45].map((cx, ci) => (
            <mesh key={`chair_${ci}`} castShadow position={[cx, 0.22, 0]}>
              <cylinderGeometry args={[0.15, 0.16, 0.44, 8]} />
              <meshStandardMaterial color="#94a3b8" />
            </mesh>
          ))}
        </group>
      )}

      {shopType === 'florist' && (
        <group position={[-1.2, 0, 2.1]}>
          {/* Flower Buckets Stand */}
          <mesh castShadow position={[0, 0.25, 0]}>
            <boxGeometry args={[1.2, 0.5, 0.5]} />
            <meshStandardMaterial color="#78350f" />
          </mesh>
          {[-0.35, 0, 0.35].map((fx, fi) => (
            <group key={`flower_pot_${fi}`} position={[fx, 0.6, 0]}>
              <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[0.12, 0.09, 0.25, 8]} />
                <meshStandardMaterial color="#ea580c" />
              </mesh>
              <mesh position={[0, 0.18, 0]}>
                <sphereGeometry args={[0.15, 8, 8]} />
                <meshStandardMaterial color={fi === 0 ? '#ef4444' : fi === 1 ? '#facc15' : '#ec4899'} />
              </mesh>
            </group>
          ))}
        </group>
      )}

      {/* Shop Signboard */}
      <Html position={[0, 3.4, 1.7]} center distanceFactor={18} occlude pointerEvents="none">
        <div className="bg-slate-950/90 text-white font-black text-[9px] px-2.5 py-0.5 rounded-md shadow border border-amber-400 whitespace-nowrap select-none pointer-events-none">
          {shopName}
        </div>
      </Html>
    </group>
  );
};

// ------------------------------------------------------------
// 4. STREET STALLS & CARTS (Hotdog, Fruit, Ice Cream)
// ------------------------------------------------------------
export const StreetFoodStall3D: React.FC<{
  position: [number, number, number];
  rotationY?: number;
  type?: 'hotdog' | 'fruit';
}> = ({ position, rotationY = 0, type = 'hotdog' }) => {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Wooden / Steel Cart Body */}
      <mesh castShadow position={[0, 0.5, 0]}>
        <boxGeometry args={[1.5, 0.65, 0.9]} />
        <meshStandardMaterial color={type === 'hotdog' ? '#dc2626' : '#16a34a'} roughness={0.5} />
      </mesh>

      {/* Cart Countertop */}
      <mesh castShadow position={[0, 0.85, 0]}>
        <boxGeometry args={[1.65, 0.06, 1.05]} />
        <meshStandardMaterial color="#f8fafc" metalness={0.7} roughness={0.2} />
      </mesh>

      {/* 2 Big Cart Wheels */}
      {[-0.6, 0.6].map((wx, wi) => (
        <group key={`wheel_${wi}`} position={[wx, 0.28, 0.48]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.26, 0.26, 0.06, 12]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
        </group>
      ))}

      {/* Large Umbrella Overhead */}
      <group position={[0.45, 0.88, 0]}>
        <mesh position={[0, 0.9, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 1.8, 6]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} />
        </mesh>
        <mesh position={[0, 1.85, 0]}>
          <coneGeometry args={[1.1, 0.45, 10]} />
          <meshStandardMaterial color={type === 'hotdog' ? '#facc15' : '#22c55e'} roughness={0.6} />
        </mesh>
      </group>

      {/* Food Props on Countertop */}
      {type === 'hotdog' ? (
        <group position={[-0.2, 0.92, 0]}>
          {/* Condiment Mustard & Ketchup Bottles */}
          <mesh position={[-0.25, 0.1, 0.15]}>
            <cylinderGeometry args={[0.04, 0.04, 0.2, 6]} />
            <meshStandardMaterial color="#dc2626" />
          </mesh>
          <mesh position={[-0.15, 0.1, 0.15]}>
            <cylinderGeometry args={[0.04, 0.04, 0.2, 6]} />
            <meshStandardMaterial color="#facc15" />
          </mesh>
          {/* Grill Box */}
          <mesh castShadow position={[0.1, 0.08, 0]}>
            <boxGeometry args={[0.5, 0.15, 0.4]} />
            <meshStandardMaterial color="#334155" metalness={0.8} />
          </mesh>
        </group>
      ) : (
        <group position={[-0.1, 0.92, 0]}>
          {/* Fruit Crates */}
          {[-0.25, 0.2].map((cx, ci) => (
            <mesh key={`crate_${ci}`} position={[cx, 0.08, 0]}>
              <boxGeometry args={[0.38, 0.14, 0.35]} />
              <meshStandardMaterial color="#b45309" roughness={0.8} />
            </mesh>
          ))}
          {/* Fruit Spheres (Oranges & Apples) */}
          <mesh position={[-0.25, 0.18, 0]}>
            <sphereGeometry args={[0.12, 6, 6]} />
            <meshStandardMaterial color="#f97316" />
          </mesh>
          <mesh position={[0.2, 0.18, 0]}>
            <sphereGeometry args={[0.12, 6, 6]} />
            <meshStandardMaterial color="#ef4444" />
          </mesh>
        </group>
      )}

      {/* Signboard */}
      <Html position={[0, 1.35, 0.55]} center distanceFactor={16} occlude pointerEvents="none">
        <div className="bg-amber-400 text-slate-950 font-black text-[8px] px-2 py-0.5 rounded shadow border border-amber-600 uppercase select-none pointer-events-none">
          {type === 'hotdog' ? '🌭 Hotdogs & Pretzels' : '🍎 Fresh Organic Fruit'}
        </div>
      </Html>
    </group>
  );
};

// ------------------------------------------------------------
// 5. ROADSIDE BALLOON SELLER (With floating swaying balloons)
// ------------------------------------------------------------
export const RoadsideBalloonSeller3D: React.FC<{
  position: [number, number, number];
  rotationY?: number;
}> = ({ position, rotationY = 0 }) => {
  const balloonsGroupRef = useRef<THREE.Group>(null);

  const balloonData = useMemo(
    () => [
      { color: '#ef4444', x: -0.22, y: 1.9, z: 0.1, scale: 0.24 },
      { color: '#3b82f6', x: 0.18, y: 2.1, z: -0.08, scale: 0.26 },
      { color: '#facc15', x: 0.0, y: 2.3, z: 0.15, scale: 0.25 },
      { color: '#10b981', x: -0.25, y: 2.2, z: -0.12, scale: 0.23 },
      { color: '#ec4899', x: 0.26, y: 1.85, z: 0.12, scale: 0.25 },
      { color: '#8b5cf6', x: -0.05, y: 2.45, z: -0.05, scale: 0.27 },
      { color: '#f97316', x: 0.24, y: 2.35, z: -0.15, scale: 0.24 },
      { color: '#06b6d4', x: -0.15, y: 2.05, z: 0.22, scale: 0.26 },
    ],
    []
  );

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (balloonsGroupRef.current) {
      // Gentle floating and swaying in the air
      balloonsGroupRef.current.rotation.z = Math.sin(t * 1.8) * 0.08;
      balloonsGroupRef.current.rotation.x = Math.cos(t * 1.4) * 0.06;
      balloonsGroupRef.current.position.y = Math.sin(t * 2.2) * 0.04;
    }
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Balloon Vendor Character */}
      <StylizedHuman3D
        position={[0, 0, 0]}
        scale={0.9}
        shirtColor="#f43f5e"
        pantsColor="#1e293b"
        shoesColor="#ffffff"
        hairColor="#78350f"
        skinColor="#fde047"
        hasHeadband={true}
        isWalking={false}
      />

      {/* Balloon Handle / Staff held in right hand */}
      <mesh position={[0.24, 1.25, 0.15]} rotation={[-0.2, 0, 0.1]}>
        <cylinderGeometry args={[0.015, 0.015, 1.3, 6]} />
        <meshStandardMaterial color="#d4a373" />
      </mesh>

      {/* Floating Bouquet of Colorful Helium Balloons */}
      <group position={[0.28, 0, 0.2]} ref={balloonsGroupRef}>
        {balloonData.map((b, i) => (
          <group key={`balloon_${i}`} position={[b.x, b.y, b.z]}>
            {/* Balloon Body (Teardrop Sphere) */}
            <mesh castShadow>
              <sphereGeometry args={[b.scale, 12, 12]} />
              <meshStandardMaterial color={b.color} roughness={0.2} metalness={0.1} />
            </mesh>
            {/* Balloon Knot */}
            <mesh position={[0, -b.scale * 1.05, 0]}>
              <coneGeometry args={[0.04, 0.06, 6]} />
              <meshStandardMaterial color={b.color} />
            </mesh>
            {/* Connecting String to Hand */}
            <mesh position={[-b.x * 0.5, (-b.y + 1.3) * 0.5, -b.z * 0.5]}>
              <cylinderGeometry args={[0.003, 0.003, b.y - 1.3, 4]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>
        ))}
      </group>

      {/* Signboard */}
      <Html position={[0, 1.6, 0.5]} center distanceFactor={14} occlude pointerEvents="none">
        <div className="bg-pink-500 text-white font-extrabold text-[8px] px-2 py-0.5 rounded shadow border border-pink-300 whitespace-nowrap select-none pointer-events-none animate-pulse">
          🎈 BALLOONS
        </div>
      </Html>
    </group>
  );
};

// ------------------------------------------------------------
// 6. PARKED CITY CARS & YELLOW TAXIS
// ------------------------------------------------------------
export const CityVehicle3D: React.FC<{
  position: [number, number, number];
  rotationY?: number;
  type?: 'taxi' | 'sedan' | 'suv';
  color?: string;
}> = ({ position, rotationY = 0, type = 'taxi', color = '#eab308' }) => {
  const isTaxi = type === 'taxi';
  const bodyColor = isTaxi ? '#eab308' : color;

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Lower Vehicle Body */}
      <mesh castShadow position={[0, 0.35, 0]}>
        <boxGeometry args={[3.4, 0.45, 1.6]} />
        <meshStandardMaterial color={bodyColor} roughness={0.4} metalness={0.2} />
      </mesh>

      {/* Upper Cabin */}
      <mesh castShadow position={[-0.1, 0.72, 0]}>
        <boxGeometry args={[1.9, 0.42, 1.45]} />
        <meshStandardMaterial color={bodyColor} roughness={0.4} metalness={0.2} />
      </mesh>

      {/* Front Windshield */}
      <mesh position={[0.9, 0.7, 0]} rotation={[0, Math.PI / 2, -0.3]}>
        <planeGeometry args={[1.35, 0.4]} />
        <meshStandardMaterial color="#0284c7" metalness={0.8} roughness={0.1} transparent opacity={0.7} />
      </mesh>
      {/* Rear Windshield */}
      <mesh position={[-1.1, 0.7, 0]} rotation={[0, -Math.PI / 2, -0.3]}>
        <planeGeometry args={[1.35, 0.4]} />
        <meshStandardMaterial color="#0284c7" metalness={0.8} roughness={0.1} transparent opacity={0.7} />
      </mesh>

      {/* 4 Rubber Wheels */}
      {[
        [-1.0, 0.78],
        [1.0, 0.78],
        [-1.0, -0.78],
        [1.0, -0.78],
      ].map(([wx, wz], wi) => (
        <mesh key={`car_wheel_${wi}`} position={[wx, 0.22, wz]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.12, 12]} />
          <meshStandardMaterial color="#0f172a" roughness={0.9} />
        </mesh>
      ))}

      {/* Headlights (Front: +X) */}
      <mesh position={[1.72, 0.38, 0.5]}>
        <boxGeometry args={[0.04, 0.12, 0.22]} />
        <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[1.72, 0.38, -0.5]}>
        <boxGeometry args={[0.04, 0.12, 0.22]} />
        <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.5} />
      </mesh>

      {/* Taillights (Rear: -X) */}
      <mesh position={[-1.72, 0.38, 0.5]}>
        <boxGeometry args={[0.04, 0.12, 0.22]} />
        <meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[-1.72, 0.38, -0.5]}>
        <boxGeometry args={[0.04, 0.12, 0.22]} />
        <meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={0.4} />
      </mesh>

      {/* Taxi Roof Sign */}
      {isTaxi && (
        <group position={[0, 0.98, 0]}>
          <mesh>
            <boxGeometry args={[0.45, 0.12, 0.22]} />
            <meshStandardMaterial color="#facc15" emissive="#facc15" emissiveIntensity={0.3} />
          </mesh>
          <mesh position={[0, -0.07, 0]}>
            <boxGeometry args={[0.3, 0.04, 0.1]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
        </group>
      )}
    </group>
  );
};

// ------------------------------------------------------------
// 6B. MOVING CITY VEHICLES & TRAFFIC
// ------------------------------------------------------------
export const MovingCityCar3D: React.FC<{
  type?: 'taxi' | 'sedan' | 'suv';
  color?: string;
  speed?: number; // m/s
  radius?: number; // Distance from center
  initialOffset?: number;
  reverseDirection?: boolean;
}> = ({
  type = 'taxi',
  color = '#eab308',
  speed = 6.0,
  radius = 21.0,
  initialOffset = 0,
  reverseDirection = false,
}) => {
  const rootRef = useRef<THREE.Group>(null);
  const sideLength = radius * 2;
  const totalPerimeter = sideLength * 4;

  useFrame((state) => {
    if (!rootRef.current) return;
    const t = state.clock.getElapsedTime();
    let dist = (t * speed + initialOffset) % totalPerimeter;
    if (dist < 0) dist += totalPerimeter;

    if (reverseDirection) {
      // Counter-clockwise
      const ccwDist = totalPerimeter - dist;
      const seg = Math.floor(ccwDist / sideLength);
      const frac = (ccwDist % sideLength) / sideLength;

      let x = 0, z = 0, rotY = 0;
      if (seg === 0) { // North road going West
        x = radius - frac * sideLength;
        z = -radius;
        rotY = -Math.PI / 2;
      } else if (seg === 1) { // West road going South
        x = -radius;
        z = -radius + frac * sideLength;
        rotY = 0;
      } else if (seg === 2) { // South road going East
        x = -radius + frac * sideLength;
        z = radius;
        rotY = Math.PI / 2;
      } else { // East road going North
        x = radius;
        z = radius - frac * sideLength;
        rotY = Math.PI;
      }

      rootRef.current.position.set(x, 0, z);
      rootRef.current.rotation.y = rotY;
    } else {
      // Clockwise
      const seg = Math.floor(dist / sideLength);
      const frac = (dist % sideLength) / sideLength;

      let x = 0, z = 0, rotY = 0;
      if (seg === 0) { // North road going East
        x = -radius + frac * sideLength;
        z = -radius;
        rotY = Math.PI / 2;
      } else if (seg === 1) { // East road going South
        x = radius;
        z = -radius + frac * sideLength;
        rotY = 0;
      } else if (seg === 2) { // South road going West
        x = radius - frac * sideLength;
        z = radius;
        rotY = -Math.PI / 2;
      } else { // West road going North
        x = -radius;
        z = radius - frac * sideLength;
        rotY = Math.PI;
      }

      rootRef.current.position.set(x, 0, z);
      rootRef.current.rotation.y = rotY;
    }
  });

  return (
    <group ref={rootRef}>
      <CityVehicle3D position={[0, 0, 0]} rotationY={0} type={type} color={color} />
    </group>
  );
};

export const MovingCityCyclist3D: React.FC<{
  speed?: number;
  radius?: number;
  initialOffset?: number;
  reverseDirection?: boolean;
}> = ({ speed = 2.4, radius = 17.5, initialOffset = 0, reverseDirection = false }) => {
  const rootRef = useRef<THREE.Group>(null);
  const sideLength = radius * 2;
  const totalPerimeter = sideLength * 4;

  useFrame((state) => {
    if (!rootRef.current) return;
    const t = state.clock.getElapsedTime();
    let dist = (t * speed + initialOffset) % totalPerimeter;
    if (dist < 0) dist += totalPerimeter;

    if (reverseDirection) {
      const ccwDist = totalPerimeter - dist;
      const seg = Math.floor(ccwDist / sideLength);
      const frac = (ccwDist % sideLength) / sideLength;

      let x = 0, z = 0, rotY = 0;
      if (seg === 0) {
        x = radius - frac * sideLength;
        z = -radius;
        rotY = -Math.PI / 2;
      } else if (seg === 1) {
        x = -radius;
        z = -radius + frac * sideLength;
        rotY = 0;
      } else if (seg === 2) {
        x = -radius + frac * sideLength;
        z = radius;
        rotY = Math.PI / 2;
      } else {
        x = radius;
        z = radius - frac * sideLength;
        rotY = Math.PI;
      }

      rootRef.current.position.set(x, 0, z);
      rootRef.current.rotation.y = rotY;
    } else {
      const seg = Math.floor(dist / sideLength);
      const frac = (dist % sideLength) / sideLength;

      let x = 0, z = 0, rotY = 0;
      if (seg === 0) {
        x = -radius + frac * sideLength;
        z = -radius;
        rotY = Math.PI / 2;
      } else if (seg === 1) {
        x = radius;
        z = -radius + frac * sideLength;
        rotY = 0;
      } else if (seg === 2) {
        x = radius - frac * sideLength;
        z = radius;
        rotY = -Math.PI / 2;
      } else {
        x = -radius;
        z = radius - frac * sideLength;
        rotY = Math.PI;
      }

      rootRef.current.position.set(x, 0, z);
      rootRef.current.rotation.y = rotY;
    }
  });

  return (
    <group ref={rootRef}>
      <RealisticCyclist3D position={[0, 0, 0]} rotationY={0} speed={1.0} />
    </group>
  );
};

// ------------------------------------------------------------
// 7. STREET FURNITURE (Streetlights, Bus Shelter, Fire Hydrants)
// ------------------------------------------------------------
export const StreetLamp3D: React.FC<{ position: [number, number, number]; rotationY?: number }> = ({
  position,
  rotationY = 0,
}) => {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Base & Mast */}
      <mesh position={[0, 1.8, 0]}>
        <cylinderGeometry args={[0.06, 0.1, 3.6, 8]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} />
      </mesh>
      {/* Overhanging Arm */}
      <mesh position={[0.45, 3.6, 0]} rotation={[0, 0, Math.PI / 4]}>
        <cylinderGeometry args={[0.04, 0.04, 0.9, 6]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      {/* Light Lantern Fixture */}
      <mesh position={[0.8, 3.7, 0]}>
        <boxGeometry args={[0.35, 0.12, 0.2]} />
        <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.6} />
      </mesh>
    </group>
  );
};

export const BusStopShelter3D: React.FC<{ position: [number, number, number]; rotationY?: number }> = ({
  position,
  rotationY = 0,
}) => {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Steel Frame & Roof */}
      <mesh position={[0, 1.3, 0]}>
        <boxGeometry args={[2.8, 2.4, 1.4]} />
        <meshStandardMaterial color="#1e293b" wireframe />
      </mesh>
      {/* Roof Canopy */}
      <mesh castShadow position={[0, 2.5, 0]}>
        <boxGeometry args={[3.0, 0.08, 1.6]} />
        <meshStandardMaterial color="#0284c7" />
      </mesh>
      {/* Back Glass Wall */}
      <mesh position={[0, 1.2, -0.68]}>
        <planeGeometry args={[2.7, 2.2]} />
        <meshStandardMaterial color="#bae6fd" transparent opacity={0.5} />
      </mesh>
      {/* Bench Inside */}
      <mesh castShadow position={[0, 0.45, -0.3]}>
        <boxGeometry args={[2.2, 0.08, 0.4]} />
        <meshStandardMaterial color="#9a3412" />
      </mesh>
      {/* Bus Stop Sign */}
      <Html position={[1.4, 2.0, 0]} center distanceFactor={14} occlude pointerEvents="none">
        <div className="bg-blue-600 text-white font-black text-[8px] px-2 py-0.5 rounded shadow select-none pointer-events-none">
          🚌 BUS STOP
        </div>
      </Html>
    </group>
  );
};

// ------------------------------------------------------------
// 8. MASTER CITY WORLD SURROUNDINGS COMPONENT
// ------------------------------------------------------------
export const ParkCitySurroundings3D: React.FC = () => {
  return (
    <group name="MetropolitanCitySurroundings">
      {/* 1. Sun & Atmospheric Clouds */}
      <RadiantSunAndClouds3D />

      {/* ============================================================ */}
      {/* 2. NORTH CITY BLOCK (Z = -22m to -32m) */}
      {/* ============================================================ */}
      {/* Skyscrapers & High Rises */}
      <CityBuilding3D
        position={[-14, 0, -26]}
        width={7}
        height={26}
        depth={7}
        facadeColor="#1e293b"
        accentColor="#38bdf8"
        hasAntenna={true}
        buildingName="METRO TOWER"
      />
      <CityBuilding3D
        position={[-6, 0, -28]}
        width={6.5}
        height={20}
        depth={6}
        facadeColor="#334155"
        accentColor="#a5f3fc"
        hasHelipad={true}
      />
      <CityBuilding3D
        position={[6, 0, -28]}
        width={7}
        height={24}
        depth={6.5}
        facadeColor="#0f172a"
        accentColor="#67e8f9"
        buildingName="CENTRAL PLAZA"
      />
      <CityBuilding3D
        position={[15, 0, -26]}
        width={6.5}
        height={19}
        depth={7}
        facadeColor="#475569"
        accentColor="#bae6fd"
        hasBalconies={true}
      />

      {/* North Sidewalk Shops */}
      <CityShopFront3D
        position={[-8, 0, -18.5]}
        rotationY={0}
        shopName="🥐 CROISSANT & CO. BAKERY"
        awningColors={['#ec4899', '#ffffff']}
        shopType="bakery"
      />
      <CityShopFront3D
        position={[8, 0, -18.5]}
        rotationY={0}
        shopName="☕ ARTISAN COFFEE ROASTERS"
        awningColors={['#78350f', '#d97706']}
        shopType="cafe"
      />

      {/* North Roadside Hotdog Stall & Roadside Balloon Seller */}
      <StreetFoodStall3D position={[-2.8, 0, -17.5]} rotationY={0} type="hotdog" />
      <RoadsideBalloonSeller3D position={[3.2, 0, -17.5]} rotationY={0} />

      {/* ============================================================ */}
      {/* 3. SOUTH CITY BLOCK (Z = +22m to +32m) */}
      {/* ============================================================ */}
      <CityBuilding3D
        position={[-14, 0, 26]}
        width={7}
        height={22}
        depth={7}
        facadeColor="#1e3a8a"
        accentColor="#93c5fd"
        buildingName="INNOVATION LAB"
      />
      <CityBuilding3D
        position={[-5, 0, 28]}
        width={6}
        height={18}
        depth={6}
        facadeColor="#334155"
        accentColor="#67e8f9"
        hasBalconies={true}
      />
      <CityBuilding3D
        position={[6, 0, 28]}
        width={7}
        height={28}
        depth={7}
        facadeColor="#0f172a"
        accentColor="#38bdf8"
        hasAntenna={true}
        buildingName="INFINITY TOWER"
      />
      <CityBuilding3D
        position={[15, 0, 26]}
        width={6.5}
        height={21}
        depth={6.5}
        facadeColor="#1e293b"
        accentColor="#7dd3fc"
      />

      {/* South Sidewalk Shops */}
      <CityShopFront3D
        position={[-8, 0, 18.5]}
        rotationY={Math.PI}
        shopName="🌸 BLOOM & BLOSSOM FLORIST"
        awningColors={['#16a34a', '#ffffff']}
        shopType="florist"
      />
      <CityShopFront3D
        position={[8, 0, 18.5]}
        rotationY={Math.PI}
        shopName="🍦 GELATO DREAMS PARLOR"
        awningColors={['#0284c7', '#f43f5e']}
        shopType="icecream"
      />

      {/* South Fruit Stall */}
      <StreetFoodStall3D position={[2.8, 0, 17.5]} rotationY={Math.PI} type="fruit" />

      {/* ============================================================ */}
      {/* 4. WEST CITY BLOCK (X = -22m to -32m) */}
      {/* ============================================================ */}
      <CityBuilding3D
        position={[-26, 0, -8]}
        width={6.5}
        height={23}
        depth={7}
        facadeColor="#334155"
        accentColor="#38bdf8"
      />
      <CityBuilding3D
        position={[-28, 0, 0]}
        width={7}
        height={25}
        depth={6.5}
        facadeColor="#0f172a"
        accentColor="#a5f3fc"
        hasHelipad={true}
        buildingName="GRAND HOTEL"
      />
      <CityBuilding3D
        position={[-26, 0, 8]}
        width={6.5}
        height={20}
        depth={7}
        facadeColor="#1e293b"
        accentColor="#7dd3fc"
        hasBalconies={true}
      />

      {/* West Bus Stop */}
      <BusStopShelter3D position={[-17.8, 0, 3.5]} rotationY={Math.PI / 2} />

      {/* ============================================================ */}
      {/* 5. EAST CITY BLOCK (X = +22m to +32m) */}
      {/* ============================================================ */}
      <CityBuilding3D
        position={[26, 0, -8]}
        width={6.5}
        height={21}
        depth={7}
        facadeColor="#1e293b"
        accentColor="#38bdf8"
        hasAntenna={true}
      />
      <CityBuilding3D
        position={[28, 0, 0]}
        width={7}
        height={27}
        depth={6.5}
        facadeColor="#0f172a"
        accentColor="#67e8f9"
        buildingName="TECH HUB"
      />
      <CityBuilding3D
        position={[26, 0, 8]}
        width={6.5}
        height={22}
        depth={7}
        facadeColor="#334155"
        accentColor="#93c5fd"
        hasBalconies={true}
      />

      {/* 4 Perimeter Streetlights at Corner Crosswalks */}
      <StreetLamp3D position={[-17.2, 0, -17.2]} rotationY={Math.PI / 4} />
      <StreetLamp3D position={[17.2, 0, -17.2]} rotationY={-Math.PI / 4} />
      <StreetLamp3D position={[-17.2, 0, 17.2]} rotationY={(3 * Math.PI) / 4} />
      <StreetLamp3D position={[17.2, 0, 17.2]} rotationY={(-3 * Math.PI) / 4} />

      {/* ============================================================ */}
      {/* 6. DYNAMIC MOVING CITY TRAFFIC (Cars & Cyclists in Motion) */}
      {/* ============================================================ */}
      {/* 1. Yellow NYC Taxi (Inner Lane, Clockwise) */}
      <MovingCityCar3D type="taxi" speed={6.2} radius={21.0} initialOffset={0} />

      {/* 2. Cherry Red Sports Coupe (Inner Lane, Clockwise) */}
      <MovingCityCar3D type="sedan" color="#dc2626" speed={7.2} radius={21.0} initialOffset={84} />

      {/* 3. Electric Blue Sedan (Outer Lane, Counter-Clockwise) */}
      <MovingCityCar3D type="sedan" color="#0284c7" speed={5.8} radius={23.5} initialOffset={42} reverseDirection={true} />

      {/* 4. White Express Delivery Van (Outer Lane, Counter-Clockwise) */}
      <MovingCityCar3D type="suv" color="#f8fafc" speed={5.2} radius={23.5} initialOffset={126} reverseDirection={true} />

      {/* 5. Extra Commuter City Cyclist along South Street */}
      <MovingCityCyclist3D speed={2.2} radius={18.0} initialOffset={20} />
      <MovingCityCyclist3D speed={2.5} radius={18.0} initialOffset={100} reverseDirection={true} />
    </group>
  );
};
