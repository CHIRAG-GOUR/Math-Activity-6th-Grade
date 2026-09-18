// ============================================================
// PARK PLANNER — 3D Metropolitan City World & Sky Environment
// PERFORMANCE-OPTIMIZED: All materials cached, geometry reduced,
// building windows capped at 5 floors, cloud segments halved.
// ============================================================

import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { StylizedHuman3D, RealisticCyclist3D } from './ParkCharacters3D';
import { getCachedMaterial, getCachedBasicMaterial, getCachedBoxGeo, getCachedCylinderGeo, getCachedSphereGeo } from './ParkMaterials';

// Shared geometries
const _cloudGeo = getCachedSphereGeo(2.0, 6, 6);
const _cloudSmGeo = getCachedSphereGeo(1.5, 5, 5);
const _cloudMdGeo = getCachedSphereGeo(1.6, 5, 5);
const _cloudLgGeo = getCachedSphereGeo(1.3, 5, 5);
const _cloudXlGeo = getCachedSphereGeo(1.2, 5, 5);
const _cloudMat = getCachedMaterial('#ffffff', 0.3);
const _whiteMat = getCachedBasicMaterial('#f8fafc');
const _yellowDashMat = getCachedBasicMaterial('#facc15');

// ------------------------------------------------------------
// 1. RADIANT 3D SUN & DRIFTING CLOUDS
// ------------------------------------------------------------
export const RadiantSunAndClouds3D: React.FC = React.memo(() => {
  const sunCoronaRef = useRef<THREE.Mesh>(null);
  const cloudsGroupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (sunCoronaRef.current) {
      const s = 1.0 + Math.sin(t * 1.5) * 0.08;
      sunCoronaRef.current.scale.set(s, s, s);
    }
    if (cloudsGroupRef.current) {
      cloudsGroupRef.current.position.x = ((t * 0.8) % 120) - 60;
    }
  });

  const sunCoreMat = useMemo(() => getCachedBasicMaterial('#fffbeb'), []);
  const coronaMat = useMemo(() => getCachedBasicMaterial('#fef08a', { transparent: true, opacity: 0.65 }), []);
  const flareMat = useMemo(() => getCachedBasicMaterial('#fde047', { transparent: true, opacity: 0.35, side: THREE.DoubleSide }), []);

  return (
    <group name="SunAndAtmosphere">
      <group position={[28, 42, -28]}>
        <mesh geometry={getCachedSphereGeo(3.2, 16, 16)} material={sunCoreMat} />
        <mesh ref={sunCoronaRef} geometry={getCachedSphereGeo(4.2, 12, 12)} material={coronaMat} />
        <mesh rotation={[Math.PI / 4, 0, 0]}>
          <ringGeometry args={[4.5, 7.5, 16]} />
          <meshBasicMaterial color="#fde047" transparent opacity={0.35} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Simplified Clouds — 4 instead of 6, 3 spheres each instead of 5 */}
      <group ref={cloudsGroupRef} position={[0, 32, 0]}>
        {[
          { x: -35, y: 0, z: -15, scale: 1.4 },
          { x: -10, y: 3, z: -30, scale: 1.8 },
          { x: 20, y: -2, z: -20, scale: 1.5 },
          { x: 15, y: 2, z: 30, scale: 1.3 },
        ].map((c, idx) => (
          <group key={`cloud_${idx}`} position={[c.x, c.y, c.z]} scale={c.scale}>
            <mesh geometry={_cloudGeo} material={_cloudMat} />
            <mesh position={[1.5, -0.2, 0.2]} geometry={_cloudSmGeo} material={_cloudMat} />
            <mesh position={[-1.5, -0.3, -0.2]} geometry={_cloudMdGeo} material={_cloudMat} />
          </group>
        ))}
      </group>
    </group>
  );
});

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

export const CityBuilding3D: React.FC<BuildingProps> = React.memo(({
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
  // Cap windows at 5 floors for performance
  const floors = Math.min(5, Math.floor(height / 3.2));

  const facadeMat = useMemo(() => getCachedMaterial(facadeColor, 0.6), [facadeColor]);
  const windowMat = useMemo(() => getCachedMaterial(accentColor, 0.1, 0.8), [accentColor]);
  const roofMat = useMemo(() => getCachedMaterial('#1e293b', 0.4), []);
  const hvacMat = useMemo(() => getCachedMaterial('#475569', 0.7), []);

  return (
    <group position={position}>
      {/* Main Body */}
      <mesh position={[0, height / 2, 0]} geometry={getCachedBoxGeo(width, height, depth)} material={facadeMat} />

      {/* Windows — Only front face, reduced count */}
      {Array.from({ length: floors }).map((_, f) => {
        const yPos = 2.0 + f * 3.0;
        return (
          <group key={`floor_${f}`} position={[0, yPos, 0]}>
            {[-width * 0.3, 0, width * 0.3].map((wx, wi) => (
              <mesh key={`win_${wi}`} position={[wx, 0, depth / 2 + 0.02]}>
                <planeGeometry args={[width * 0.22, 0.9]} />
                <meshStandardMaterial color={accentColor} metalness={0.8} roughness={0.1} />
              </mesh>
            ))}
          </group>
        );
      })}

      {/* Roof */}
      <mesh position={[0, height + 0.2, 0]} geometry={getCachedBoxGeo(width + 0.3, 0.4, depth + 0.3)} material={roofMat} />
      <mesh position={[width * 0.2, height + 0.8, depth * 0.2]} geometry={getCachedBoxGeo(1.5, 1.0, 1.5)} material={hvacMat} />

      {/* Antenna */}
      {hasAntenna && (
        <group position={[0, height + 0.4, 0]}>
          <mesh position={[0, 2.5, 0]} geometry={getCachedCylinderGeo(0.04, 0.12, 5.0, 4)} material={getCachedMaterial('#cbd5e1', 0.2, 0.9)} />
          <mesh position={[0, 5.1, 0]} geometry={getCachedSphereGeo(0.16, 6, 6)} material={getCachedBasicMaterial('#ef4444')} />
        </group>
      )}

      {/* Helipad */}
      {hasHelipad && (
        <group position={[0, height + 0.45, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[width * 0.38, 12]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
        </group>
      )}
    </group>
  );
});

// ------------------------------------------------------------
// 3. GROUND-FLOOR SHOPS (Simplified)
// ------------------------------------------------------------
interface ShopProps {
  position: [number, number, number];
  rotationY?: number;
  shopName: string;
  awningColors: [string, string];
  shopType: 'bakery' | 'cafe' | 'florist' | 'icecream' | 'bookstore';
}

export const CityShopFront3D: React.FC<ShopProps> = React.memo(({
  position,
  rotationY = 0,
  shopName,
  awningColors,
  shopType,
}) => {
  const awningMats = useMemo(() => [
    getCachedMaterial(awningColors[0], 0.6),
    getCachedMaterial(awningColors[1], 0.6),
  ], [awningColors]);

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 2.0, 0]} geometry={getCachedBoxGeo(4.2, 4.0, 3.2)} material={getCachedMaterial('#f1f5f9', 0.7)} />
      <mesh position={[0, 1.4, 1.62]}>
        <planeGeometry args={[3.2, 1.8]} />
        <meshStandardMaterial color="#0284c7" metalness={0.7} roughness={0.1} transparent opacity={0.7} />
      </mesh>
      <mesh position={[1.2, 1.1, 1.63]}>
        <planeGeometry args={[0.9, 2.0]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* Simplified awning — 4 stripes instead of 8 */}
      <group position={[0, 2.5, 1.9]} rotation={[0.35, 0, 0]}>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={`awning_${i}`} position={[-1.2 + i * 0.8, 0, 0]} geometry={getCachedBoxGeo(0.78, 0.04, 1.1)} material={awningMats[i % 2]} />
        ))}
      </group>
    </group>
  );
});

// ------------------------------------------------------------
// 4. STREET STALLS (Simplified)
// ------------------------------------------------------------
export const StreetFoodStall3D: React.FC<{
  position: [number, number, number];
  rotationY?: number;
  type?: 'hotdog' | 'fruit';
}> = React.memo(({ position, rotationY = 0, type = 'hotdog' }) => {
  const bodyMat = useMemo(() => getCachedMaterial(type === 'hotdog' ? '#dc2626' : '#16a34a', 0.5), [type]);
  const umbMat = useMemo(() => getCachedMaterial(type === 'hotdog' ? '#facc15' : '#22c55e', 0.6), [type]);

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.5, 0]} geometry={getCachedBoxGeo(1.5, 0.65, 0.9)} material={bodyMat} />
      <mesh position={[0, 0.85, 0]} geometry={getCachedBoxGeo(1.65, 0.06, 1.05)} material={getCachedMaterial('#f8fafc', 0.2, 0.7)} />

      {/* 2 wheels */}
      {[-0.6, 0.6].map((wx, wi) => (
        <mesh key={`wheel_${wi}`} position={[wx, 0.28, 0.48]} rotation={[0, 0, Math.PI / 2]}
          geometry={getCachedCylinderGeo(0.26, 0.26, 0.06, 8)} material={getCachedMaterial('#0f172a', 0.9)} />
      ))}

      {/* Umbrella */}
      <group position={[0.45, 0.88, 0]}>
        <mesh position={[0, 0.9, 0]} geometry={getCachedCylinderGeo(0.025, 0.025, 1.8, 4)} material={getCachedMaterial('#cbd5e1', 0.3, 0.8)} />
        <mesh position={[0, 1.85, 0]}>
          <coneGeometry args={[1.1, 0.45, 8]} />
          <meshStandardMaterial color={type === 'hotdog' ? '#facc15' : '#22c55e'} roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
});

// ------------------------------------------------------------
// 5. ROADSIDE BALLOON SELLER (Reduced balloons: 5 instead of 8)
// ------------------------------------------------------------
export const RoadsideBalloonSeller3D: React.FC<{
  position: [number, number, number];
  rotationY?: number;
}> = React.memo(({ position, rotationY = 0 }) => {
  const balloonsGroupRef = useRef<THREE.Group>(null);

  const balloonData = useMemo(
    () => [
      { color: '#ef4444', x: -0.22, y: 1.9, z: 0.1, scale: 0.24 },
      { color: '#3b82f6', x: 0.18, y: 2.1, z: -0.08, scale: 0.26 },
      { color: '#facc15', x: 0.0, y: 2.3, z: 0.15, scale: 0.25 },
      { color: '#10b981', x: -0.25, y: 2.2, z: -0.12, scale: 0.23 },
      { color: '#ec4899', x: 0.26, y: 1.85, z: 0.12, scale: 0.25 },
    ],
    []
  );

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (balloonsGroupRef.current) {
      balloonsGroupRef.current.rotation.z = Math.sin(t * 1.8) * 0.08;
      balloonsGroupRef.current.rotation.x = Math.cos(t * 1.4) * 0.06;
      balloonsGroupRef.current.position.y = Math.sin(t * 2.2) * 0.04;
    }
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
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
      <mesh position={[0.24, 1.25, 0.15]} rotation={[-0.2, 0, 0.1]} geometry={getCachedCylinderGeo(0.015, 0.015, 1.3, 4)} material={getCachedMaterial('#d4a373', 0.6)} />

      <group position={[0.28, 0, 0.2]} ref={balloonsGroupRef}>
        {balloonData.map((b, i) => (
          <group key={`balloon_${i}`} position={[b.x, b.y, b.z]}>
            <mesh geometry={getCachedSphereGeo(b.scale, 8, 8)} material={getCachedMaterial(b.color, 0.2, 0.1)} />
            <mesh position={[0, -b.scale * 1.05, 0]}>
              <coneGeometry args={[0.04, 0.06, 4]} />
              <meshStandardMaterial color={b.color} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
});

// ------------------------------------------------------------
// 6. CITY VEHICLES (Cached materials)
// ------------------------------------------------------------
export const CityVehicle3D: React.FC<{
  position: [number, number, number];
  rotationY?: number;
  type?: 'taxi' | 'sedan' | 'suv';
  color?: string;
}> = React.memo(({ position, rotationY = 0, type = 'taxi', color = '#eab308' }) => {
  const isTaxi = type === 'taxi';
  const bodyColor = isTaxi ? '#eab308' : color;
  const bodyMat = useMemo(() => getCachedMaterial(bodyColor, 0.4, 0.2), [bodyColor]);
  const wheelMat = useMemo(() => getCachedMaterial('#0f172a', 0.9), []);

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.35, 0]} geometry={getCachedBoxGeo(3.4, 0.45, 1.6)} material={bodyMat} />
      <mesh position={[-0.1, 0.72, 0]} geometry={getCachedBoxGeo(1.9, 0.42, 1.45)} material={bodyMat} />

      {/* Windshields */}
      <mesh position={[0.9, 0.7, 0]} rotation={[0, Math.PI / 2, -0.3]}>
        <planeGeometry args={[1.35, 0.4]} />
        <meshStandardMaterial color="#0284c7" metalness={0.8} roughness={0.1} transparent opacity={0.7} />
      </mesh>

      {/* 4 wheels */}
      {[
        [-1.0, 0.78], [1.0, 0.78], [-1.0, -0.78], [1.0, -0.78],
      ].map(([wx, wz], wi) => (
        <mesh key={`w_${wi}`} position={[wx, 0.22, wz]} rotation={[Math.PI / 2, 0, 0]}
          geometry={getCachedCylinderGeo(0.22, 0.22, 0.12, 8)} material={wheelMat} />
      ))}

      {/* Headlights */}
      <mesh position={[1.72, 0.38, 0.5]} geometry={getCachedBoxGeo(0.04, 0.12, 0.22)}
        material={getCachedMaterial('#fef08a', 0.3, 0, { emissive: '#fef08a', emissiveIntensity: 0.5 })} />
      <mesh position={[1.72, 0.38, -0.5]} geometry={getCachedBoxGeo(0.04, 0.12, 0.22)}
        material={getCachedMaterial('#fef08a', 0.3, 0, { emissive: '#fef08a', emissiveIntensity: 0.5 })} />

      {/* Taillights */}
      <mesh position={[-1.72, 0.38, 0.5]} geometry={getCachedBoxGeo(0.04, 0.12, 0.22)}
        material={getCachedMaterial('#dc2626', 0.3, 0, { emissive: '#dc2626', emissiveIntensity: 0.4 })} />
      <mesh position={[-1.72, 0.38, -0.5]} geometry={getCachedBoxGeo(0.04, 0.12, 0.22)}
        material={getCachedMaterial('#dc2626', 0.3, 0, { emissive: '#dc2626', emissiveIntensity: 0.4 })} />

      {/* Taxi Sign */}
      {isTaxi && (
        <mesh position={[0, 0.98, 0]} geometry={getCachedBoxGeo(0.45, 0.12, 0.22)}
          material={getCachedMaterial('#facc15', 0.3, 0, { emissive: '#facc15', emissiveIntensity: 0.3 })} />
      )}
    </group>
  );
});

// ------------------------------------------------------------
// 6B. VEHICLE TRAJECTORY SOLVER
// ------------------------------------------------------------
export function getRoundedRectPath(
  dist: number,
  radius: number,
  cornerRadius: number,
  isCcw: boolean,
  isCar: boolean
): { x: number; z: number; rotY: number } {
  const r_c = Math.min(cornerRadius, radius * 0.35);
  const L = radius - r_c;
  const straightLen = 2 * L;
  const arcLen = 0.5 * Math.PI * r_c;
  const totalPerimeter = 4 * straightLen + 4 * arcLen;

  let s = dist % totalPerimeter;
  if (s < 0) s += totalPerimeter;
  const trackPos = isCcw ? (totalPerimeter - s) % totalPerimeter : s;

  let x = 0, z = 0, dx = 0, dz = 0;

  const p0End = straightLen;
  const p1End = p0End + arcLen;
  const p2End = p1End + straightLen;
  const p3End = p2End + arcLen;
  const p4End = p3End + straightLen;
  const p5End = p4End + arcLen;
  const p6End = p5End + straightLen;

  if (trackPos < p0End) { const u = trackPos; x = -L + u; z = -radius; dx = 1; dz = 0; }
  else if (trackPos < p1End) { const u = ((trackPos - p0End) / arcLen) * (0.5 * Math.PI); x = L + r_c * Math.sin(u); z = -L - r_c * Math.cos(u); dx = Math.cos(u); dz = Math.sin(u); }
  else if (trackPos < p2End) { const u = trackPos - p1End; x = radius; z = -L + u; dx = 0; dz = 1; }
  else if (trackPos < p3End) { const u = ((trackPos - p2End) / arcLen) * (0.5 * Math.PI); x = L + r_c * Math.cos(u); z = L + r_c * Math.sin(u); dx = -Math.sin(u); dz = Math.cos(u); }
  else if (trackPos < p4End) { const u = trackPos - p3End; x = L - u; z = radius; dx = -1; dz = 0; }
  else if (trackPos < p5End) { const u = ((trackPos - p4End) / arcLen) * (0.5 * Math.PI); x = -L - r_c * Math.sin(u); z = L + r_c * Math.cos(u); dx = -Math.cos(u); dz = -Math.sin(u); }
  else if (trackPos < p6End) { const u = trackPos - p5End; x = -radius; z = L - u; dx = 0; dz = -1; }
  else { const u = ((trackPos - p6End) / arcLen) * (0.5 * Math.PI); x = -L - r_c * Math.cos(u); z = -L - r_c * Math.sin(u); dx = Math.sin(u); dz = -Math.cos(u); }

  if (isCcw) { dx = -dx; dz = -dz; }
  const rotY = isCar ? Math.atan2(-dz, dx) : Math.atan2(dx, dz);
  return { x, z, rotY };
}

// ------------------------------------------------------------
// 6C. MOVING CITY VEHICLES & TRAFFIC
// ------------------------------------------------------------
export const MovingCityCar3D: React.FC<{
  type?: 'taxi' | 'sedan' | 'suv';
  color?: string;
  speed?: number;
  radius?: number;
  cornerRadius?: number;
  initialOffset?: number;
  reverseDirection?: boolean;
}> = React.memo(({
  type = 'taxi', color = '#eab308', speed = 5.5, radius = 17.5,
  cornerRadius = 2.4, initialOffset = 0, reverseDirection = false,
}) => {
  const rootRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!rootRef.current) return;
    const t = state.clock.getElapsedTime();
    const { x, z, rotY } = getRoundedRectPath(t * speed + initialOffset, radius, cornerRadius, reverseDirection, true);
    rootRef.current.position.set(x, 0, z);
    rootRef.current.rotation.y = rotY;
  });

  return (
    <group ref={rootRef}>
      <CityVehicle3D position={[0, 0, 0]} rotationY={0} type={type} color={color} />
    </group>
  );
});

export const MovingCityCyclist3D: React.FC<{
  speed?: number;
  radius?: number;
  cornerRadius?: number;
  initialOffset?: number;
  reverseDirection?: boolean;
}> = React.memo(({
  speed = 2.2, radius = 15.6, cornerRadius = 2.0, initialOffset = 0, reverseDirection = false,
}) => {
  const rootRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!rootRef.current) return;
    const t = state.clock.getElapsedTime();
    const { x, z, rotY } = getRoundedRectPath(t * speed + initialOffset, radius, cornerRadius, reverseDirection, false);
    rootRef.current.position.set(x, 0, z);
    rootRef.current.rotation.y = rotY;
  });

  return (
    <group ref={rootRef}>
      <RealisticCyclist3D position={[0, 0, 0]} rotationY={0} speed={1.0} />
    </group>
  );
});

// ------------------------------------------------------------
// 7. STREET FURNITURE
// ------------------------------------------------------------
export const StreetLamp3D: React.FC<{
  position: [number, number, number];
  rotationY?: number;
}> = React.memo(({ position, rotationY = 0 }) => {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 1.8, 0]} geometry={getCachedCylinderGeo(0.06, 0.1, 3.6, 6)} material={getCachedMaterial('#1e293b', 0.3, 0.8)} />
      <mesh position={[0.45, 3.6, 0]} rotation={[0, 0, Math.PI / 4]} geometry={getCachedCylinderGeo(0.04, 0.04, 0.9, 4)} material={getCachedMaterial('#1e293b', 0.3)} />
      <mesh position={[0.8, 3.7, 0]} geometry={getCachedBoxGeo(0.35, 0.12, 0.2)} material={getCachedMaterial('#fef08a', 0.3, 0, { emissive: '#fef08a', emissiveIntensity: 0.6 })} />
    </group>
  );
});

// ------------------------------------------------------------
// 7B. BUS STOP SHELTER (Simplified)
// ------------------------------------------------------------
export const BusStopShelter3D: React.FC<{
  position: [number, number, number];
  rotationY?: number;
}> = React.memo(({ position, rotationY = 0 }) => {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.04, 0]} geometry={getCachedBoxGeo(3.2, 0.08, 1.4)} material={getCachedMaterial('#64748b', 0.7)} />
      {[-1.4, 1.4].map((px, pi) => (
        <mesh key={`col_${pi}`} position={[px, 1.2, 0]} geometry={getCachedCylinderGeo(0.04, 0.04, 2.3, 6)} material={getCachedMaterial('#0f172a', 0.3, 0.8)} />
      ))}
      <mesh position={[0, 1.2, -0.55]} geometry={getCachedBoxGeo(2.7, 1.8, 0.03)} material={getCachedMaterial('#38bdf8', 0.1, 0.7, { transparent: true, opacity: 0.45 })} />
      <mesh position={[0, 2.38, 0]} geometry={getCachedBoxGeo(3.4, 0.08, 1.6)} material={getCachedMaterial('#1e293b', 0.3, 0.8)} />
    </group>
  );
});

// ------------------------------------------------------------
// 8. MASTER CITY WORLD SURROUNDINGS COMPONENT
// ------------------------------------------------------------
export const ParkCitySurroundings3D: React.FC = React.memo(() => {
  return (
    <group name="MetropolitanCitySurroundings">
      <RadiantSunAndClouds3D />

      {/* NORTH CITY BLOCK */}
      <CityBuilding3D position={[-14, 0, -29]} width={7} height={26} depth={7} facadeColor="#1e293b" accentColor="#38bdf8" hasAntenna={true} />
      <CityBuilding3D position={[-6, 0, -30]} width={6.5} height={20} depth={6} facadeColor="#334155" accentColor="#a5f3fc" hasHelipad={true} />
      <CityBuilding3D position={[6, 0, -30]} width={7} height={24} depth={6.5} facadeColor="#0f172a" accentColor="#67e8f9" />
      <CityBuilding3D position={[15, 0, -29]} width={6.5} height={19} depth={7} facadeColor="#475569" accentColor="#bae6fd" hasBalconies={true} />

      {/* North Shops */}
      <CityShopFront3D position={[-8, 0, -23.5]} rotationY={0} shopName="Bakery" awningColors={['#ec4899', '#ffffff']} shopType="bakery" />
      <CityShopFront3D position={[8, 0, -23.5]} rotationY={0} shopName="Coffee" awningColors={['#78350f', '#d97706']} shopType="cafe" />
      <StreetFoodStall3D position={[-2.8, 0, -22.5]} rotationY={0} type="hotdog" />
      <RoadsideBalloonSeller3D position={[3.2, 0, -22.5]} rotationY={0} />

      {/* SOUTH CITY BLOCK */}
      <CityBuilding3D position={[-14, 0, 29]} width={7} height={22} depth={7} facadeColor="#1e3a8a" accentColor="#93c5fd" />
      <CityBuilding3D position={[-5, 0, 30]} width={6} height={18} depth={6} facadeColor="#334155" accentColor="#67e8f9" hasBalconies={true} />
      <CityBuilding3D position={[6, 0, 30]} width={7} height={28} depth={7} facadeColor="#0f172a" accentColor="#38bdf8" hasAntenna={true} />
      <CityBuilding3D position={[15, 0, 29]} width={6.5} height={21} depth={6.5} facadeColor="#1e293b" accentColor="#7dd3fc" />

      {/* South Shops */}
      <CityShopFront3D position={[-8, 0, 23.5]} rotationY={Math.PI} shopName="Florist" awningColors={['#16a34a', '#ffffff']} shopType="florist" />
      <CityShopFront3D position={[8, 0, 23.5]} rotationY={Math.PI} shopName="Gelato" awningColors={['#0284c7', '#f43f5e']} shopType="icecream" />
      <StreetFoodStall3D position={[2.8, 0, 22.5]} rotationY={Math.PI} type="fruit" />

      {/* WEST CITY BLOCK */}
      <CityBuilding3D position={[-29, 0, -9]} width={6.5} height={23} depth={7} facadeColor="#334155" accentColor="#38bdf8" />
      <CityBuilding3D position={[-30, 0, 0]} width={7} height={25} depth={6.5} facadeColor="#0f172a" accentColor="#a5f3fc" hasHelipad={true} />
      <CityBuilding3D position={[-29, 0, 9]} width={6.5} height={20} depth={7} facadeColor="#1e293b" accentColor="#7dd3fc" hasBalconies={true} />
      <BusStopShelter3D position={[-22.8, 0, 3.5]} rotationY={Math.PI / 2} />

      {/* EAST CITY BLOCK */}
      <CityBuilding3D position={[29, 0, -9]} width={6.5} height={21} depth={7} facadeColor="#1e293b" accentColor="#38bdf8" hasAntenna={true} />
      <CityBuilding3D position={[30, 0, 0]} width={7} height={27} depth={6.5} facadeColor="#0f172a" accentColor="#67e8f9" />
      <CityBuilding3D position={[29, 0, 9]} width={6.5} height={22} depth={7} facadeColor="#334155" accentColor="#93c5fd" hasBalconies={true} />

      {/* Streetlights */}
      <StreetLamp3D position={[-21.5, 0, -21.5]} rotationY={Math.PI / 4} />
      <StreetLamp3D position={[21.5, 0, -21.5]} rotationY={-Math.PI / 4} />
      <StreetLamp3D position={[-21.5, 0, 21.5]} rotationY={(3 * Math.PI) / 4} />
      <StreetLamp3D position={[21.5, 0, 21.5]} rotationY={(-3 * Math.PI) / 4} />

      {/* TRAFFIC — Reduced to 3 cars and 1 cyclist */}
      <MovingCityCar3D type="taxi" speed={5.5} radius={17.4} cornerRadius={2.2} initialOffset={0} />
      <MovingCityCar3D type="sedan" color="#dc2626" speed={6.5} radius={17.4} cornerRadius={2.2} initialOffset={70} />
      <MovingCityCar3D type="sedan" color="#0284c7" speed={5.2} radius={19.6} cornerRadius={2.6} initialOffset={35} reverseDirection={true} />
      <MovingCityCyclist3D speed={2.2} radius={15.6} cornerRadius={1.8} initialOffset={15} />
    </group>
  );
});
