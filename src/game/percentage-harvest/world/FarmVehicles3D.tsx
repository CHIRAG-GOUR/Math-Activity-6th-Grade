// ============================================================
// PERCENTAGE HARVEST — 3D AGRICULTURAL VEHICLES & TRUCK FLEET
// Physics-driven Seeder Tractors, Combine Harvesters with rotating cutting reels,
// and Flatbed Delivery Trucks loaded with physical produce crates
// ============================================================

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { FarmMaterialsCache } from './FarmMaterials';
import { farmSim } from '../engine/farmSim';
import { farmAudio } from '../engine/farmAudio';
import { TeamId } from '../types';

interface VehicleProps {
  teamId: TeamId;
}

// ─────────────────────────────────────────────────────────────
// 1. AGRICULTURAL SEEDER / TRACTOR & HARVESTER
// ─────────────────────────────────────────────────────────────
const TractorHarvesterModel: React.FC<VehicleProps> = ({ teamId }) => {
  const mats = FarmMaterialsCache.get();
  const rootRef = useRef<THREE.Group>(null);
  const wheelsRef = useRef<THREE.Group>(null);
  const cutterReelRef = useRef<THREE.Group>(null);
  const trailerCargoRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const sim = teamId === 'blue' ? farmSim.blue : farmSim.red;
    const v = sim.vehicle;

    if (rootRef.current) {
      rootRef.current.position.set(v.position[0], v.position[1], v.position[2]);
      rootRef.current.rotation.y = v.rotationY;
    }

    const isMoving = v.task !== 'idle';

    // Spin wheels when traversing
    if (wheelsRef.current && isMoving) {
      wheelsRef.current.children.forEach((w) => {
        w.rotation.x += delta * 7.5;
      });
    }

    // Spin front cutting reel header when harvesting
    if (cutterReelRef.current && v.task === 'harvesting') {
      cutterReelRef.current.rotation.x += delta * 12;
    }

    // Dynamic trailer cargo fill level
    if (trailerCargoRef.current) {
      const fill = Math.max(0.01, v.trailerFill / 100);
      trailerCargoRef.current.scale.set(1.0, fill, 1.0);
      trailerCargoRef.current.position.y = 0.3 + fill * 0.4;
      trailerCargoRef.current.visible = v.trailerFill > 0;
    }
  });

  const isBlue = teamId === 'blue';
  const bodyMat = isBlue ? mats.blueTractorBody : mats.redTractorBody;
  const cropMat = mats.wheatGolden;

  return (
    <group ref={rootRef}>
      {/* ── TRACTOR CHASSIS & HOOD ── */}
      <group position={[0, 0.4, 0]}>
        {/* Main Engine Hood */}
        <mesh position={[0, 0.5, 0.4]} castShadow material={bodyMat}>
          <boxGeometry args={[1.1, 0.8, 1.4]} />
        </mesh>
        {/* Front Grille */}
        <mesh position={[0, 0.5, 1.11]} material={mats.concreteBase}>
          <boxGeometry args={[0.9, 0.6, 0.05]} />
        </mesh>
        {/* Headlights */}
        {[-0.35, 0.35].map((hx) => (
          <mesh key={`hl-${hx}`} position={[hx, 0.6, 1.13]} material={mats.headlightGlow}>
            <cylinderGeometry args={[0.1, 0.1, 0.05, 8]} />
          </mesh>
        ))}
        {/* Exhaust Smokestack */}
        <mesh position={[0.4, 1.2, 0.7]} material={mats.scalePadSteel}>
          <cylinderGeometry args={[0.05, 0.05, 0.8, 6]} />
        </mesh>

        {/* Cabin Roof & Windows */}
        <mesh position={[0, 1.2, -0.4]} castShadow material={bodyMat}>
          <boxGeometry args={[1.2, 0.1, 1.2]} />
        </mesh>
        <mesh position={[0, 0.8, -0.4]} material={mats.vehicleGlass}>
          <boxGeometry args={[1.1, 0.7, 1.1]} />
        </mesh>
      </group>

      {/* ── ROTATING HARVESTING CUTTER REEL (Front) ── */}
      <group ref={cutterReelRef} position={[0, 0.45, 1.5]}>
        <mesh rotation={[0, 0, Math.PI / 2]} material={mats.scalePadSteel}>
          <cylinderGeometry args={[0.28, 0.28, 1.6, 8]} />
        </mesh>
        {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((ang, i) => (
          <mesh key={`reel-blade-${i}`} rotation={[ang, 0, 0]} material={mats.scalePadSteel}>
            <boxGeometry args={[1.55, 0.04, 0.18]} />
          </mesh>
        ))}
      </group>

      {/* ── WHEELS ── */}
      <group ref={wheelsRef}>
        {/* Front Wheels */}
        {[-0.65, 0.65].map((wx) => (
          <group key={`front-wheel-${wx}`} position={[wx, 0.3, 0.6]}>
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow material={mats.vehicleTireRubber}>
              <cylinderGeometry args={[0.3, 0.3, 0.22, 12]} />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]} material={mats.vehicleWheelRim}>
              <cylinderGeometry args={[0.18, 0.18, 0.23, 8]} />
            </mesh>
          </group>
        ))}

        {/* Rear Giant Agricultural Wheels */}
        {[-0.72, 0.72].map((wx) => (
          <group key={`rear-wheel-${wx}`} position={[wx, 0.55, -0.4]}>
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow material={mats.vehicleTireRubber}>
              <cylinderGeometry args={[0.55, 0.55, 0.32, 16]} />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]} material={mats.vehicleWheelRim}>
              <cylinderGeometry args={[0.35, 0.35, 0.34, 8]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ── TOWED GRAIN TRAILER ── */}
      <group position={[0, 0.3, -2.0]}>
        {/* Hitch */}
        <mesh position={[0, 0.2, 0.8]} material={mats.scalePadSteel}>
          <boxGeometry args={[0.15, 0.1, 1.2]} />
        </mesh>
        {/* Hopper Tub */}
        <mesh position={[0, 0.5, 0]} castShadow material={mats.trailerMetal}>
          <boxGeometry args={[1.4, 0.7, 1.8]} />
        </mesh>
        {/* Dynamic Grain Mesh */}
        <mesh ref={trailerCargoRef} position={[0, 0.5, 0]} material={cropMat}>
          <boxGeometry args={[1.25, 0.6, 1.65]} />
        </mesh>
        {/* Trailer Wheels */}
        {[-0.75, 0.75].map((tx) => (
          <group key={`trailer-wheel-${tx}`} position={[tx, 0.1, 0]}>
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow material={mats.vehicleTireRubber}>
              <cylinderGeometry args={[0.35, 0.35, 0.22, 12]} />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]} material={mats.vehicleWheelRim}>
              <cylinderGeometry args={[0.2, 0.2, 0.23, 8]} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
};

// ─────────────────────────────────────────────────────────────
// 2. FLATBED DELIVERY TRUCK WITH PHYSICAL PRODUCE CRATES
// ─────────────────────────────────────────────────────────────
const DeliveryTruckModel: React.FC<VehicleProps> = ({ teamId }) => {
  const mats = FarmMaterialsCache.get();
  const rootRef = useRef<THREE.Group>(null);
  const wheelsRef = useRef<THREE.Group>(null);
  const [cratesCount, setCratesCount] = React.useState(0);

  useFrame((_, delta) => {
    const sim = teamId === 'blue' ? farmSim.blue : farmSim.red;
    const tr = sim.truck;

    setCratesCount(tr.cratesLoaded);

    if (rootRef.current) {
      rootRef.current.position.set(tr.position[0], tr.position[1], tr.position[2]);
      rootRef.current.rotation.y = tr.rotationY;
    }

    if (wheelsRef.current && (tr.task === 'delivering' || tr.task === 'returning')) {
      wheelsRef.current.children.forEach((w) => {
        w.rotation.x += delta * 9;
      });
    }
  });

  const isBlue = teamId === 'blue';
  const truckCabinMat = isBlue ? mats.blueTractorBody : mats.redTractorBody;

  return (
    <group ref={rootRef}>
      {/* ── TRUCK CABIN ── */}
      <group position={[0, 0.5, 0.9]}>
        {/* Driver Cab */}
        <mesh position={[0, 0.65, 0]} castShadow material={truckCabinMat}>
          <boxGeometry args={[1.3, 1.1, 1.1]} />
        </mesh>
        {/* Windshield */}
        <mesh position={[0, 0.75, 0.56]} material={mats.vehicleGlass}>
          <boxGeometry args={[1.1, 0.55, 0.05]} />
        </mesh>
        {/* Headlights */}
        {[-0.45, 0.45].map((hx) => (
          <mesh key={`trk-hl-${hx}`} position={[hx, 0.4, 0.57]} material={mats.headlightGlow}>
            <cylinderGeometry args={[0.08, 0.08, 0.04, 8]} />
          </mesh>
        ))}
      </group>

      {/* ── FLATBED CARGO DECK ── */}
      <group position={[0, 0.4, -0.8]}>
        <mesh position={[0, 0.2, 0]} castShadow material={mats.scalePadSteel}>
          <boxGeometry args={[1.4, 0.15, 2.2]} />
        </mesh>
        {/* Wooden Bed Side Rails */}
        {[-0.68, 0.68].map((rx) => (
          <mesh key={`rail-${rx}`} position={[rx, 0.45, 0]} material={mats.woodTimber}>
            <boxGeometry args={[0.08, 0.4, 2.2]} />
          </mesh>
        ))}

        {/* ── PHYSICAL LOADED PRODUCE CRATES / SACKS ── */}
        {Array.from({ length: cratesCount }).map((_, idx) => {
          const row = Math.floor(idx / 2);
          const col = idx % 2;
          const cx = -0.3 + col * 0.6;
          const cz = -0.6 + row * 0.6;
          return (
            <group key={`truck-crate-${idx}`} position={[cx, 0.45, cz]}>
              <mesh castShadow material={mats.crateWood}>
                <boxGeometry args={[0.48, 0.32, 0.44]} />
              </mesh>
              <mesh position={[0, 0.15, 0]} material={mats.wheatGolden}>
                <boxGeometry args={[0.42, 0.1, 0.38]} />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* ── TRUCK WHEELS (6 WHEELS) ── */}
      <group ref={wheelsRef}>
        {/* Front Axle */}
        {[-0.7, 0.7].map((wx) => (
          <group key={`tw-front-${wx}`} position={[wx, 0.35, 1.0]}>
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow material={mats.vehicleTireRubber}>
              <cylinderGeometry args={[0.32, 0.32, 0.22, 12]} />
            </mesh>
          </group>
        ))}
        {/* Middle Axle */}
        {[-0.7, 0.7].map((wx) => (
          <group key={`tw-mid-${wx}`} position={[wx, 0.35, -0.4]}>
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow material={mats.vehicleTireRubber}>
              <cylinderGeometry args={[0.32, 0.32, 0.22, 12]} />
            </mesh>
          </group>
        ))}
        {/* Rear Axle */}
        {[-0.7, 0.7].map((wx) => (
          <group key={`tw-rear-${wx}`} position={[wx, 0.35, -1.3]}>
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow material={mats.vehicleTireRubber}>
              <cylinderGeometry args={[0.32, 0.32, 0.22, 12]} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
};

export const FarmVehicles3D: React.FC = () => {
  useFrame(() => {
    const isTruckMoving =
      farmSim.blue.truck.task === 'delivering' ||
      farmSim.blue.truck.task === 'returning' ||
      farmSim.red.truck.task === 'delivering' ||
      farmSim.red.truck.task === 'returning';

    const isTractorMoving =
      farmSim.blue.vehicle.task === 'planting' ||
      farmSim.blue.vehicle.task === 'harvesting' ||
      farmSim.red.vehicle.task === 'planting' ||
      farmSim.red.vehicle.task === 'harvesting';

    farmAudio.playTruckDrive(isTruckMoving);
    farmAudio.playTractorEngine(isTractorMoving);
  });

  return (
    <group>
      {/* ── BLUE FARM FLEET (Left) ── */}
      <TractorHarvesterModel teamId="blue" />
      <DeliveryTruckModel teamId="blue" />

      {/* ── RED FARM FLEET (Right) ── */}
      <TractorHarvesterModel teamId="red" />
      <DeliveryTruckModel teamId="red" />
    </group>
  );
};
