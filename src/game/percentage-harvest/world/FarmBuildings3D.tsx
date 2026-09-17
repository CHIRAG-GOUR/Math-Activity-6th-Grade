// ============================================================
// PERCENTAGE HARVEST — 3D FARM ESTATES & VILLAGE ARCHITECTURE
// Blue & Red Barns, Silos, Farmhouses, Village Cottages with Chimneys & Smoke,
// Village Bell Tower, Market Loading Depot & Agricultural Hub
// ============================================================

import React from 'react';
import { Text } from '@react-three/drei';
import { FarmMaterialsCache } from './FarmMaterials';
import { FARM_LOCATIONS } from '../engine/farmLayout';
import { useFarmStore } from '../store/farmStore';

export const FarmBuildings3D: React.FC = () => {
  const mats = FarmMaterialsCache.get();
  const blue = useFarmStore((s) => s.blue);
  const red = useFarmStore((s) => s.red);

  return (
    <group>
      {/* ─────────────────────────────────────────────────────────────
          1. BLUE FARM ESTATE (LEFT)
          ───────────────────────────────────────────────────────────── */}
      {/* Blue Barn */}
      <group position={[FARM_LOCATIONS.blue.barn.x, 0, FARM_LOCATIONS.blue.barn.z]}>
        <mesh position={[0, 0.15, 0]} material={mats.concreteBase}>
          <boxGeometry args={[5.8, 0.3, 6.8]} />
        </mesh>
        <mesh position={[0, 2.0, 0]} castShadow receiveShadow material={mats.blueBarnWall}>
          <boxGeometry args={[5.5, 3.5, 6.5]} />
        </mesh>
        {/* White Corner Trims */}
        {[-2.75, 2.75].map((cx) =>
          [-3.25, 3.25].map((cz) => (
            <mesh key={`btrim-${cx}-${cz}`} position={[cx, 2.0, cz]} material={mats.whiteTrim}>
              <boxGeometry args={[0.2, 3.5, 0.2]} />
            </mesh>
          ))
        )}
        {/* Gambrel Roof */}
        <mesh position={[0, 4.4, 0]} castShadow material={mats.roofShingles}>
          <coneGeometry args={[4.2, 2.0, 4]} />
        </mesh>
        {/* Cupola */}
        <group position={[0, 5.5, 0]}>
          <mesh material={mats.whiteTrim}>
            <boxGeometry args={[0.8, 0.7, 0.8]} />
          </mesh>
          <mesh position={[0, 0.55, 0]} material={mats.roofShingles}>
            <coneGeometry args={[0.6, 0.5, 4]} />
          </mesh>
        </group>
        {/* Barn Doors */}
        <group position={[0, 1.3, 3.28]}>
          <mesh material={mats.whiteTrim}>
            <boxGeometry args={[2.4, 2.4, 0.08]} />
          </mesh>
          <mesh position={[0, 0, 0.05]} material={mats.blueBarnWall}>
            <boxGeometry args={[2.1, 2.1, 0.02]} />
          </mesh>
        </group>
        {/* Signboard */}
        <group position={[0, 3.8, 3.3]}>
          <mesh material={mats.whiteTrim}>
            <boxGeometry args={[2.8, 0.5, 0.06]} />
          </mesh>
          <Text
            position={[0, 0, 0.04]}
            fontSize={0.24}
            color="#1d4ed8"
            anchorX="center"
            anchorY="middle"
          >
            BLUE FARM
          </Text>
        </group>
      </group>

      {/* Blue Farmhouse */}
      <group position={[FARM_LOCATIONS.blue.farmhouse.x, 0, FARM_LOCATIONS.blue.farmhouse.z]}>
        <mesh position={[0, 1.3, 0]} castShadow receiveShadow material={mats.whiteTrim}>
          <boxGeometry args={[4.2, 2.4, 4.2]} />
        </mesh>
        <mesh position={[0, 3.0, 0]} rotation={[0, Math.PI / 4, 0]} castShadow material={mats.roofShingles}>
          <coneGeometry args={[3.4, 1.5, 4]} />
        </mesh>
        <mesh position={[1.1, 3.3, 0.4]} castShadow material={mats.stoneBridge}>
          <boxGeometry args={[0.5, 1.6, 0.5]} />
        </mesh>
      </group>

      {/* Blue Silo */}
      <group position={[FARM_LOCATIONS.blue.silo.x, 0, FARM_LOCATIONS.blue.silo.z]}>
        <mesh position={[0, 3.2, 0]} castShadow receiveShadow material={mats.silverMetalSilo}>
          <cylinderGeometry args={[1.4, 1.4, 6.2, 24]} />
        </mesh>
        <mesh position={[0, 6.7, 0]} castShadow material={mats.silverMetalSilo}>
          <sphereGeometry args={[1.4, 24, 12, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        </mesh>
      </group>

      {/* ─────────────────────────────────────────────────────────────
          2. RED FARM ESTATE (RIGHT)
          ───────────────────────────────────────────────────────────── */}
      {/* Red Barn */}
      <group position={[FARM_LOCATIONS.red.barn.x, 0, FARM_LOCATIONS.red.barn.z]}>
        <mesh position={[0, 0.15, 0]} material={mats.concreteBase}>
          <boxGeometry args={[5.8, 0.3, 6.8]} />
        </mesh>
        <mesh position={[0, 2.0, 0]} castShadow receiveShadow material={mats.redBarnWall}>
          <boxGeometry args={[5.5, 3.5, 6.5]} />
        </mesh>
        {[-2.75, 2.75].map((cx) =>
          [-3.25, 3.25].map((cz) => (
            <mesh key={`rtrim-${cx}-${cz}`} position={[cx, 2.0, cz]} material={mats.whiteTrim}>
              <boxGeometry args={[0.2, 3.5, 0.2]} />
            </mesh>
          ))
        )}
        <mesh position={[0, 4.4, 0]} castShadow material={mats.roofShingles}>
          <coneGeometry args={[4.2, 2.0, 4]} />
        </mesh>
        <group position={[0, 5.5, 0]}>
          <mesh material={mats.whiteTrim}>
            <boxGeometry args={[0.8, 0.7, 0.8]} />
          </mesh>
          <mesh position={[0, 0.55, 0]} material={mats.roofShingles}>
            <coneGeometry args={[0.6, 0.5, 4]} />
          </mesh>
        </group>
        <group position={[0, 1.3, 3.28]}>
          <mesh material={mats.whiteTrim}>
            <boxGeometry args={[2.4, 2.4, 0.08]} />
          </mesh>
          <mesh position={[0, 0, 0.05]} material={mats.redBarnWall}>
            <boxGeometry args={[2.1, 2.1, 0.02]} />
          </mesh>
        </group>
        <group position={[0, 3.8, 3.3]}>
          <mesh material={mats.whiteTrim}>
            <boxGeometry args={[2.8, 0.5, 0.06]} />
          </mesh>
          <Text
            position={[0, 0, 0.04]}
            fontSize={0.24}
            color="#b91c1c"
            anchorX="center"
            anchorY="middle"
          >
            RED FARM
          </Text>
        </group>
      </group>

      {/* Red Farmhouse */}
      <group position={[FARM_LOCATIONS.red.farmhouse.x, 0, FARM_LOCATIONS.red.farmhouse.z]}>
        <mesh position={[0, 1.3, 0]} castShadow receiveShadow material={mats.whiteTrim}>
          <boxGeometry args={[4.2, 2.4, 4.2]} />
        </mesh>
        <mesh position={[0, 3.0, 0]} rotation={[0, Math.PI / 4, 0]} castShadow material={mats.roofShingles}>
          <coneGeometry args={[3.4, 1.5, 4]} />
        </mesh>
        <mesh position={[-1.1, 3.3, 0.4]} castShadow material={mats.stoneBridge}>
          <boxGeometry args={[0.5, 1.6, 0.5]} />
        </mesh>
      </group>

      {/* Red Silo */}
      <group position={[FARM_LOCATIONS.red.silo.x, 0, FARM_LOCATIONS.red.silo.z]}>
        <mesh position={[0, 3.2, 0]} castShadow receiveShadow material={mats.silverMetalSilo}>
          <cylinderGeometry args={[1.4, 1.4, 6.2, 24]} />
        </mesh>
        <mesh position={[0, 6.7, 0]} castShadow material={mats.silverMetalSilo}>
          <sphereGeometry args={[1.4, 24, 12, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        </mesh>
      </group>

      {/* ─────────────────────────────────────────────────────────────
          3. SURROUNDING VILLAGE COTTAGES & VILLAGE BELL TOWER
          ───────────────────────────────────────────────────────────── */}
      {/* Village Cottage 1 (North-West) */}
      <group position={[-25, 0, -18]}>
        <mesh position={[0, 1.4, 0]} castShadow material={mats.marketWall}>
          <boxGeometry args={[4.0, 2.6, 3.6]} />
        </mesh>
        <mesh position={[0, 3.2, 0]} rotation={[0, Math.PI / 4, 0]} castShadow material={mats.roofShingles}>
          <coneGeometry args={[3.2, 1.6, 4]} />
        </mesh>
        <mesh position={[0.8, 3.4, 0.4]} material={mats.stoneBridge}>
          <boxGeometry args={[0.45, 1.4, 0.45]} />
        </mesh>
      </group>

      {/* Village Cottage 2 (North-East) */}
      <group position={[25, 0, -18]}>
        <mesh position={[0, 1.4, 0]} castShadow material={mats.marketWall}>
          <boxGeometry args={[4.0, 2.6, 3.6]} />
        </mesh>
        <mesh position={[0, 3.2, 0]} rotation={[0, Math.PI / 4, 0]} castShadow material={mats.roofShingles}>
          <coneGeometry args={[3.2, 1.6, 4]} />
        </mesh>
        <mesh position={[-0.8, 3.4, 0.4]} material={mats.stoneBridge}>
          <boxGeometry args={[0.45, 1.4, 0.45]} />
        </mesh>
      </group>

      {/* Village Bell Tower / Church Spire (Center North Hilltop) */}
      <group position={[0, 0, -22]}>
        <mesh position={[0, 4.0, 0]} castShadow material={mats.stoneBridge}>
          <cylinderGeometry args={[1.8, 2.2, 8.0, 8]} />
        </mesh>
        <mesh position={[0, 9.2, 0]} castShadow material={mats.roofShingles}>
          <coneGeometry args={[2.0, 4.0, 8]} />
        </mesh>
        <mesh position={[0, 11.4, 0]} material={mats.copperMetal}>
          <boxGeometry args={[0.1, 0.8, 0.1]} />
        </mesh>
      </group>

      {/* ─────────────────────────────────────────────────────────────
          4. CENTRAL WEIGHING SCALE PAD (FLAT LOW-PROFILE AT MARKET BAY)
          ───────────────────────────────────────────────────────────── */}
      <group position={[0, 0.03, 14.5]}>
        <mesh receiveShadow material={mats.scalePadSteel}>
          <boxGeometry args={[3.8, 0.04, 3.8]} />
        </mesh>
        {/* Subtle Low Yellow Guide Stripes */}
        {[-1.8, 1.8].map((bx) => (
          <mesh key={`scale-border-x-${bx}`} position={[bx, 0.04, 0]} material={mats.marketAwningYellow}>
            <boxGeometry args={[0.15, 0.05, 3.8]} />
          </mesh>
        ))}
      </group>
    </group>
  );
};
