// ============================================================
// PERCENTAGE HARVEST — 3D CENTER-PIVOT IRRIGATION SPRINKLER
// Rotating agricultural water boom with dynamic spray nozzles
// ============================================================

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { FarmMaterialsCache } from './FarmMaterials';
import { FARM_LOCATIONS } from '../engine/farmLayout';
import { useFarmStore } from '../store/farmStore';
import { TeamId } from '../types';

interface PivotProps {
  teamId: TeamId;
  center: { x: number; y: number; z: number };
  active: boolean;
}

const SinglePivotSprinkler: React.FC<PivotProps> = ({ center, active }) => {
  const mats = FarmMaterialsCache.get();
  const boomRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (boomRef.current && active) {
      boomRef.current.rotation.y += delta * 0.4;
    }
  });

  if (!active) return null;

  return (
    <group position={[center.x, 0, center.z]}>
      {/* Center Pivot Anchor Concrete Base */}
      <mesh position={[0, 0.4, 0]} material={mats.concreteBase}>
        <cylinderGeometry args={[0.5, 0.7, 0.8, 8]} />
      </mesh>
      {/* Vertical Water Riser Pipe */}
      <mesh position={[0, 1.4, 0]} material={mats.silverMetalSilo}>
        <cylinderGeometry args={[0.08, 0.08, 1.4, 8]} />
      </mesh>

      {/* Rotating Long Irrigation Boom Truss */}
      <group ref={boomRef} position={[0, 2.0, 0]}>
        {/* Main Galvanized Pipe */}
        <mesh position={[2.5, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={mats.silverMetalSilo}>
          <cylinderGeometry args={[0.06, 0.06, 5.0, 8]} />
        </mesh>
        {/* Outer Wheel Tower */}
        <group position={[4.8, -1.0, 0]}>
          <mesh material={mats.scalePadSteel}>
            <cylinderGeometry args={[0.04, 0.04, 1.8, 6]} />
          </mesh>
          {[-0.3, 0.3].map((wx) => (
            <mesh key={`pwheel-${wx}`} position={[wx, -0.8, 0]} rotation={[0, 0, Math.PI / 2]} material={mats.vehicleTireRubber}>
              <cylinderGeometry args={[0.2, 0.2, 0.1, 8]} />
            </mesh>
          ))}
        </group>

        {/* 4 Hanging Sprinkler Nozzles with Water Cones */}
        {[1.2, 2.4, 3.6, 4.6].map((dist, i) => (
          <group key={`nozzle-${i}`} position={[dist, -0.4, 0]}>
            <mesh material={mats.copperMetal}>
              <cylinderGeometry args={[0.02, 0.02, 0.4, 6]} />
            </mesh>
            {/* Water Spray Cone */}
            <mesh position={[0, -0.6, 0]} material={mats.waterRiver}>
              <coneGeometry args={[0.6, 0.9, 8]} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
};

export const Irrigation3D: React.FC = () => {
  const blue = useFarmStore((s) => s.blue);
  const red = useFarmStore((s) => s.red);

  return (
    <group>
      <SinglePivotSprinkler
        teamId="blue"
        center={FARM_LOCATIONS.blue.irrigationCenter}
        active={blue.farmEvolutionStage >= 3}
      />
      <SinglePivotSprinkler
        teamId="red"
        center={FARM_LOCATIONS.red.irrigationCenter}
        active={red.farmEvolutionStage >= 3}
      />
    </group>
  );
};
