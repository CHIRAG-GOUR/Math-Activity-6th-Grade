// ============================================================
// PERCENTAGE HARVEST — 3D ARTICULATED FARMERS & AGRICULTURAL WORKERS
// Authentic Knapsack Backpack Sprayer with Manual Pump Lever, Flexible Hose & Wand Mist,
// Granular Fertilizer Broadcast, Crate Transport, and Cheer Kinematics
// ============================================================

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { FarmMaterialsCache } from './FarmMaterials';
import { farmSim } from '../engine/farmSim';
import { TeamId } from '../types';

interface FarmerEntityProps {
  teamId: TeamId;
  clothingType: 'blue_denim' | 'red_plaid';
}

const DynamicFarmer: React.FC<FarmerEntityProps> = ({ teamId, clothingType }) => {
  const mats = FarmMaterialsCache.get();
  const rootRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const wandRef = useRef<THREE.Group>(null);
  const mistRef = useRef<THREE.Group>(null);
  const fertMistRef = useRef<THREE.Group>(null);
  const pumpLeverRef = useRef<THREE.Group>(null);

  const [isSpraying, setIsSpraying] = React.useState(false);
  const [isFertilizing, setIsFertilizing] = React.useState(false);
  const [isCarryingCrate, setIsCarryingCrate] = React.useState(false);
  const [taskName, setTaskName] = React.useState('idle');

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const sim = teamId === 'blue' ? farmSim.blue : farmSim.red;
    const f = sim.farmer;

    setIsSpraying(f.isSpraying);
    setIsFertilizing(f.isFertilizing);
    setIsCarryingCrate(f.isCarryingCrate);
    setTaskName(f.task);

    if (rootRef.current) {
      rootRef.current.position.set(f.position[0], f.position[1], f.position[2]);
      rootRef.current.rotation.y = f.rotationY;
    }

    const isMoving = f.task !== 'idle';
    const isCheering = sim.workerCheerTimer > 0;

    // ── ANIMATE WALKING LIMBS & SPRAYING KINEMATICS ──
    if (isCheering) {
      const jumpY = Math.abs(Math.sin(time * 6)) * 0.22;
      if (rootRef.current) rootRef.current.position.y = jumpY;
      if (leftArmRef.current) leftArmRef.current.rotation.x = Math.PI - 0.4 + Math.sin(time * 8) * 0.3;
      if (rightArmRef.current) rightArmRef.current.rotation.x = Math.PI - 0.4 - Math.sin(time * 8) * 0.3;
      if (headRef.current) headRef.current.rotation.y = Math.sin(time * 4) * 0.2;
    } else if (isMoving) {
      const walkCycle = Math.sin(time * 6.5);
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = walkCycle * 0.35;
        rightLegRef.current.rotation.x = -walkCycle * 0.35;
      }

      if (f.isSpraying || taskName === 'spraying_pesticide') {
        // Classic Indian knapsack sprayer:
        // Left hand pumps the pressure lever up & down
        if (leftArmRef.current) {
          leftArmRef.current.rotation.x = 0.8 + Math.sin(time * 5.0) * 0.25;
          leftArmRef.current.rotation.z = -0.2;
        }
        if (pumpLeverRef.current) {
          pumpLeverRef.current.rotation.x = Math.sin(time * 5.0) * 0.35;
        }

        // Right hand holds the lance wand and sweeps side-to-side across crops
        if (rightArmRef.current) {
          rightArmRef.current.rotation.x = 1.0 + Math.cos(time * 3.5) * 0.12;
          rightArmRef.current.rotation.y = Math.sin(time * 3.5) * 0.45;
          rightArmRef.current.rotation.z = 0.1;
        }
      } else if (f.isCarryingCrate) {
        if (leftArmRef.current) leftArmRef.current.rotation.x = 1.25;
        if (rightArmRef.current) rightArmRef.current.rotation.x = 1.25;
      } else if (f.isFertilizing) {
        if (leftArmRef.current) leftArmRef.current.rotation.x = 1.0;
        if (rightArmRef.current) rightArmRef.current.rotation.x = Math.sin(time * 4) * 0.4 + 0.6;
      } else {
        if (leftArmRef.current) leftArmRef.current.rotation.x = -walkCycle * 0.3;
        if (rightArmRef.current) rightArmRef.current.rotation.x = walkCycle * 0.3;
      }

      if (headRef.current) headRef.current.rotation.y = Math.sin(time * 1.5) * 0.08;
    } else {
      // Idle
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0;
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0;
      if (leftArmRef.current) leftArmRef.current.rotation.x = 0.05 + Math.sin(time * 1.2) * 0.03;
      if (rightArmRef.current) rightArmRef.current.rotation.x = 0.05 - Math.sin(time * 1.2) * 0.03;
      if (headRef.current) headRef.current.rotation.y = Math.sin(time * 0.8) * 0.1;
    }

    // ── ANIMATE SPRAY MIST CONE ──
    if (mistRef.current && (f.isSpraying || taskName === 'spraying_pesticide')) {
      mistRef.current.children.forEach((p, idx) => {
        const pSpeed = 2.0 + idx * 0.35;
        p.position.z += delta * pSpeed;
        p.position.x += Math.sin(time * 12 + idx) * 0.02;
        p.position.y -= delta * 0.25;
        p.scale.addScalar(delta * 0.9);
        if (p.position.z > 1.3 || p.position.y < -0.5) {
          p.position.set(0, 0, 0.2);
          p.scale.set(0.18, 0.18, 0.18);
        }
      });
    }

    // ── ANIMATE FERTILIZER BROADCAST ──
    if (fertMistRef.current && f.isFertilizing) {
      fertMistRef.current.children.forEach((p, idx) => {
        p.position.z += delta * 1.2;
        p.position.x += Math.sin(time * 8 + idx * 2) * delta * 1.5;
        p.position.y -= delta * 0.4;
        if (p.position.y < -0.5 || p.position.z > 1.0) {
          p.position.set(0.1, 0, 0.1);
        }
      });
    }
  });

  const shirtMat = clothingType === 'blue_denim' ? mats.blueDenim : mats.redPlaid;

  return (
    <group ref={rootRef}>
      {/* Ground Shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} material={mats.darkMud}>
        <circleGeometry args={[0.32, 12]} />
      </mesh>

      {/* ── PELVIS & TORSO ── */}
      <group position={[0, 0.7, 0]}>
        <mesh position={[0, 0.3, 0]} castShadow material={shirtMat}>
          <boxGeometry args={[0.38, 0.46, 0.24]} />
        </mesh>

        {/* ── HEAD & STRAW HAT ── */}
        <group ref={headRef} position={[0, 0.65, 0]}>
          <mesh castShadow material={mats.skinTone1}>
            <sphereGeometry args={[0.16, 12, 12]} />
          </mesh>
          <mesh position={[0, 0.08, -0.04]} material={mats.hairBrown}>
            <sphereGeometry args={[0.15, 10, 10]} />
          </mesh>
          <group position={[0, 0.14, 0]}>
            <mesh material={mats.strawHat}>
              <cylinderGeometry args={[0.28, 0.28, 0.04, 12]} />
            </mesh>
            <mesh position={[0, 0.08, 0]} material={mats.strawHat}>
              <cylinderGeometry args={[0.17, 0.18, 0.13, 12]} />
            </mesh>
          </group>
          {[-0.06, 0.06].map((ex) => (
            <mesh key={`eye-${ex}`} position={[ex, 0.02, 0.14]} material={mats.hairDark}>
              <sphereGeometry args={[0.025, 6, 6]} />
            </mesh>
          ))}
        </group>

        {/* ── AUTHENTIC KNAPSACK BACKPACK SPRAYER TANK ── */}
        {taskName === 'spraying_pesticide' && (
          <group position={[0, 0.28, -0.2]}>
            {/* Main Chemical Reservoir Tank */}
            <mesh castShadow material={mats.sprayerTankYellow}>
              <boxGeometry args={[0.32, 0.44, 0.18]} />
            </mesh>
            {/* Top Fill Cap */}
            <mesh position={[0, 0.24, 0]} material={mats.scalePadSteel}>
              <cylinderGeometry args={[0.06, 0.06, 0.06, 8]} />
            </mesh>
            {/* Dual Shoulder Harness Straps */}
            {[-0.1, 0.1].map((sx) => (
              <mesh key={`tank-strap-${sx}`} position={[sx, 0.06, 0.1]} material={mats.sprayerHoseBlack}>
                <boxGeometry args={[0.04, 0.38, 0.04]} />
              </mesh>
            ))}
            {/* Manual Pump Pressure Cylinder & Lever on Left */}
            <group position={[-0.18, -0.05, 0]}>
              <mesh material={mats.scalePadSteel}>
                <cylinderGeometry args={[0.035, 0.035, 0.32, 6]} />
              </mesh>
              {/* Pump Lever Arm */}
              <group ref={pumpLeverRef} position={[-0.04, -0.12, 0]}>
                <mesh position={[0, -0.08, 0.12]} rotation={[0.4, 0, 0]} material={mats.sprayerHoseBlack}>
                  <cylinderGeometry args={[0.015, 0.015, 0.28, 4]} />
                </mesh>
              </group>
            </group>
            {/* Flexible Hose exiting bottom right */}
            <mesh position={[0.14, -0.22, 0.08]} rotation={[0.4, 0, 0.4]} material={mats.sprayerHoseBlack}>
              <cylinderGeometry args={[0.018, 0.018, 0.35, 5]} />
            </mesh>
          </group>
        )}

        {/* ── FERTILIZER BROADCAST SPREADER ── */}
        {taskName === 'fertilizing' && (
          <group position={[0, 0.18, 0.24]}>
            <mesh castShadow material={mats.scalePadSteel}>
              <cylinderGeometry args={[0.16, 0.1, 0.24, 8]} />
            </mesh>
            <mesh position={[0, 0.08, 0]} material={mats.fertilizerDust}>
              <circleGeometry args={[0.15, 8]} />
            </mesh>
          </group>
        )}

        {/* ── ARMS & HANDS ── */}
        {/* Left Arm */}
        <group ref={leftArmRef} position={[-0.24, 0.45, 0]}>
          <mesh position={[0, -0.18, 0]} castShadow material={shirtMat}>
            <cylinderGeometry args={[0.05, 0.05, 0.35, 6]} />
          </mesh>
          <mesh position={[0, -0.38, 0]} material={mats.skinTone1}>
            <sphereGeometry args={[0.055, 6, 6]} />
          </mesh>
        </group>

        {/* Right Arm */}
        <group ref={rightArmRef} position={[0.24, 0.45, 0]}>
          <mesh position={[0, -0.18, 0]} castShadow material={shirtMat}>
            <cylinderGeometry args={[0.05, 0.05, 0.35, 6]} />
          </mesh>
          <mesh position={[0, -0.38, 0]} material={mats.skinTone1}>
            <sphereGeometry args={[0.055, 6, 6]} />
          </mesh>

          {/* ── HANDHELD SPRAY WAND & BRASS NOZZLE ── */}
          {taskName === 'spraying_pesticide' && (
            <group ref={wandRef} position={[0, -0.38, 0.2]} rotation={[-0.4, 0, 0]}>
              {/* Wand Long Lance Tube */}
              <mesh position={[0, 0, 0.45]} rotation={[Math.PI / 2, 0, 0]} material={mats.sprayerWandChrome}>
                <cylinderGeometry args={[0.012, 0.012, 0.95, 6]} />
              </mesh>
              {/* Wand Handle Trigger Grip */}
              <mesh position={[0, 0, 0.05]} material={mats.sprayerHoseBlack}>
                <cylinderGeometry args={[0.022, 0.022, 0.16, 6]} />
              </mesh>
              {/* Curved Spray Nozzle Tip */}
              <mesh position={[0, -0.04, 0.92]} rotation={[0.6, 0, 0]} material={mats.strawHat}>
                <coneGeometry args={[0.035, 0.08, 6]} />
              </mesh>

              {/* ── SPRAY MIST EMITTER FROM NOZZLE TIP ── */}
              <group ref={mistRef} position={[0, -0.06, 0.98]}>
                {Array.from({ length: 8 }).map((_, idx) => (
                  <mesh key={`mist-p-${idx}`} material={mats.sprayMistBlue}>
                    <sphereGeometry args={[0.09, 6, 6]} />
                  </mesh>
                ))}
              </group>
            </group>
          )}

          {/* Fertilizer Granules */}
          {isFertilizing && (
            <group ref={fertMistRef} position={[0, -0.2, 0.3]}>
              {Array.from({ length: 5 }).map((_, idx) => (
                <mesh key={`fert-p-${idx}`} material={mats.fertilizerDust}>
                  <sphereGeometry args={[0.04, 4, 4]} />
                </mesh>
              ))}
            </group>
          )}
        </group>

        {/* ── CARRIED PRODUCE CRATE ── */}
        {isCarryingCrate && (
          <group position={[0, 0.1, 0.38]}>
            <mesh castShadow material={mats.crateWood}>
              <boxGeometry args={[0.46, 0.24, 0.34]} />
            </mesh>
            <mesh position={[0, 0.1, 0]} material={mats.wheatGolden}>
              <boxGeometry args={[0.42, 0.1, 0.3]} />
            </mesh>
          </group>
        )}
      </group>

      {/* ── LEGS & BOOTS ── */}
      <group ref={leftLegRef} position={[-0.1, 0.7, 0]}>
        <mesh position={[0, -0.3, 0]} castShadow material={mats.blueDenim}>
          <cylinderGeometry args={[0.065, 0.065, 0.55, 6]} />
        </mesh>
        <mesh position={[0, -0.62, 0.05]} castShadow material={mats.yellowBoots}>
          <boxGeometry args={[0.12, 0.12, 0.2]} />
        </mesh>
      </group>

      <group ref={rightLegRef} position={[0.1, 0.7, 0]}>
        <mesh position={[0, -0.3, 0]} castShadow material={mats.blueDenim}>
          <cylinderGeometry args={[0.065, 0.065, 0.55, 6]} />
        </mesh>
        <mesh position={[0, -0.62, 0.05]} castShadow material={mats.yellowBoots}>
          <boxGeometry args={[0.12, 0.12, 0.2]} />
        </mesh>
      </group>
    </group>
  );
};

export const FarmWorkers3D: React.FC = () => {
  return (
    <group>
      <DynamicFarmer teamId="blue" clothingType="blue_denim" />
      <DynamicFarmer teamId="red" clothingType="red_plaid" />
    </group>
  );
};
