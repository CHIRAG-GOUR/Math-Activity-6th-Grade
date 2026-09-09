// ============================================================
// BLUEPRINT BLITZ — Physics-Based Realistic 3D Construction Workers
// Authentic Construction Site Logic & Natural Human Kinematics:
// 1. Two-Handed Sand Shoveler & Wheelbarrow Transport Worker:
//    - Holds physical steel shovel firmly with BOTH HANDS (Right on top D-grip, Left on mid-shaft)
//    - Arms and hands stay strictly in front of body at waist/chest level (NEVER above head!)
//    - Scoops sand from front sand pile into wheelbarrow tub
//    - Mounts shovel, grips wheelbarrow handles at waist height, walks to rear haul dump
//    - Tips wheelbarrow to dump sand into rear mound, and walks back!
// 2. Stationary Mason / Bricklayer Builder (Blue Team Site):
//    - Stands at foundation with brick pallet & mortar pan beside him
//    - Natural forearm hammer tapping at foundation level in front of chest
// 3. Structural Site Inspector (Red Team Site):
//    - Inspects foundation with laser level and clipboard
// 4. Central Chief Surveyor & Haul Road Marshalls
// ============================================================

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ── 1. ARTICULATED HUMANOID WORKER BODY ──
interface WorkerModelProps {
  hatColor?: string;
  vestColor?: string;
  pantsColor?: string;
  leftLegAngle?: number;
  rightLegAngle?: number;
  torsoBend?: number;
  torsoTwist?: number;
  headRotX?: number;
  headRotY?: number;
  leftArmAngle?: number;
  rightArmAngle?: number;
  leftArmZ?: number;
  rightArmZ?: number;
  leftArmY?: number;
  rightArmY?: number;
  toolHeld?: 'shovel' | 'hammer' | 'clipboard' | 'tablet' | 'baton' | 'laser' | 'trowel' | 'none';
  hasSandOnShovel?: boolean;
  shovelPitch?: number;
  shovelRoll?: number;
}

export const HumanoidWorkerBody: React.FC<WorkerModelProps> = ({
  hatColor = '#facc15',
  vestColor = '#ea580c',
  pantsColor = '#334155',
  leftLegAngle = 0,
  rightLegAngle = 0,
  torsoBend = 0,
  torsoTwist = 0,
  headRotX = 0,
  headRotY = 0,
  leftArmAngle = 0.2,
  rightArmAngle = 0.2,
  leftArmZ = 0,
  rightArmZ = 0,
  leftArmY = 0,
  rightArmY = 0,
  toolHeld = 'none',
  hasSandOnShovel = false,
  shovelPitch = 0.3,
  shovelRoll = 0,
}) => {
  return (
    <group>
      {/* ── LEFT LEG & WORK BOOT ── */}
      <group position={[-0.14, 0.75, 0]} rotation={[leftLegAngle, 0, 0]}>
        <mesh position={[0, -0.35, 0]} castShadow>
          <cylinderGeometry args={[0.075, 0.085, 0.65, 8]} />
          <meshStandardMaterial color={pantsColor} roughness={0.8} />
        </mesh>
        <mesh position={[0, -0.68, 0.04]} castShadow>
          <boxGeometry args={[0.14, 0.16, 0.28]} />
          <meshStandardMaterial color="#451a03" roughness={0.9} />
        </mesh>
      </group>

      {/* ── RIGHT LEG & WORK BOOT ── */}
      <group position={[0.14, 0.75, 0]} rotation={[rightLegAngle, 0, 0]}>
        <mesh position={[0, -0.35, 0]} castShadow>
          <cylinderGeometry args={[0.075, 0.085, 0.65, 8]} />
          <meshStandardMaterial color={pantsColor} roughness={0.8} />
        </mesh>
        <mesh position={[0, -0.68, 0.04]} castShadow>
          <boxGeometry args={[0.14, 0.16, 0.28]} />
          <meshStandardMaterial color="#451a03" roughness={0.9} />
        </mesh>
      </group>

      {/* ── ARTICULATED TORSO & HIGH-VIS VEST ── */}
      <group position={[0, 0.85, 0]} rotation={[torsoBend, torsoTwist, 0]}>
        {/* Upper Vest */}
        <mesh position={[0, 0.32, 0]} castShadow>
          <boxGeometry args={[0.46, 0.62, 0.26]} />
          <meshStandardMaterial color={vestColor} roughness={0.5} />
        </mesh>

        {/* Silver Reflective Safety Stripes */}
        <mesh position={[0, 0.42, 0.135]}>
          <planeGeometry args={[0.42, 0.07]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.18, 0.135]}>
          <planeGeometry args={[0.42, 0.07]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.32, -0.135]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[0.42, 0.07]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.8} />
        </mesh>

        {/* Leather Tool Belt with Golden Buckle */}
        <mesh position={[0, 0.04, 0]}>
          <boxGeometry args={[0.48, 0.08, 0.28]} />
          <meshStandardMaterial color="#78350f" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.04, 0.145]}>
          <boxGeometry args={[0.1, 0.06, 0.02]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} />
        </mesh>

        {/* ── LEFT ARM ── */}
        <group position={[-0.28, 0.52, 0]} rotation={[leftArmAngle, leftArmY, leftArmZ]}>
          <mesh position={[0, -0.22, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.055, 0.45, 8]} />
            <meshStandardMaterial color={vestColor} />
          </mesh>
          <mesh position={[0, -0.46, 0]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshStandardMaterial color="#334155" />
          </mesh>

          {/* Held Items (Left Hand) */}
          {toolHeld === 'clipboard' && (
            <group position={[0, -0.45, 0.15]} rotation={[0.4, 0.2, 0]}>
              <mesh castShadow>
                <boxGeometry args={[0.26, 0.36, 0.02]} />
                <meshStandardMaterial color="#78350f" />
              </mesh>
              <mesh position={[0, 0, 0.015]}>
                <planeGeometry args={[0.22, 0.3]} />
                <meshBasicMaterial color="#38bdf8" />
              </mesh>
            </group>
          )}

          {toolHeld === 'baton' && (
            <group position={[0, -0.45, 0.1]} rotation={[0.4, 0, 0]}>
              <mesh position={[0, 0.18, 0]}>
                <cylinderGeometry args={[0.022, 0.022, 0.42, 8]} />
                <meshStandardMaterial color="#ea580c" emissive="#ea580c" emissiveIntensity={0.6} />
              </mesh>
            </group>
          )}
        </group>

        {/* ── RIGHT ARM ── */}
        <group position={[0.28, 0.52, 0]} rotation={[rightArmAngle, rightArmY, rightArmZ]}>
          <mesh position={[0, -0.22, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.055, 0.45, 8]} />
            <meshStandardMaterial color={vestColor} />
          </mesh>
          <mesh position={[0, -0.46, 0]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshStandardMaterial color="#334155" />
          </mesh>

          {/* Mason Hammer (Right Hand, in front of chest) */}
          {toolHeld === 'hammer' && (
            <group position={[0, -0.45, 0.1]} rotation={[0.6, 0, 0]}>
              <mesh position={[0, 0.18, 0]} castShadow>
                <cylinderGeometry args={[0.022, 0.022, 0.65, 8]} />
                <meshStandardMaterial color="#b45309" />
              </mesh>
              <mesh position={[0, 0.52, 0]} castShadow>
                <boxGeometry args={[0.14, 0.12, 0.24]} />
                <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.2} />
              </mesh>
            </group>
          )}

          {/* Laser Inspector Tool (Right Hand) */}
          {toolHeld === 'laser' && (
            <group position={[0, -0.45, 0.1]} rotation={[0.5, 0, 0]}>
              <mesh castShadow>
                <boxGeometry args={[0.08, 0.16, 0.05]} />
                <meshStandardMaterial color="#ea580c" roughness={0.4} />
              </mesh>
              {/* Laser Beam */}
              <mesh position={[0, 0.08, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.006, 0.006, 0.7, 6]} />
                <meshBasicMaterial color="#ef4444" />
              </mesh>
            </group>
          )}

          {toolHeld === 'baton' && (
            <group position={[0, -0.45, 0.1]} rotation={[0.4, 0, 0]}>
              <mesh position={[0, 0.18, 0]}>
                <cylinderGeometry args={[0.022, 0.022, 0.42, 8]} />
                <meshStandardMaterial color="#ea580c" emissive="#ea580c" emissiveIntensity={0.6} />
              </mesh>
            </group>
          )}
        </group>

        {/* ── ⛏️ TWO-HANDED STEEL SHOVEL RIG (Centered across Left & Right hands at waist level) ── */}
        {toolHeld === 'shovel' && (
          <group position={[0.05, 0.05, 0.35]} rotation={[shovelPitch, 0, shovelRoll]}>
            {/* Top D-Handle (Grip for Right Hand near hip) */}
            <mesh position={[0.22, 0.12, -0.05]} rotation={[0, 0, 0.2]}>
              <boxGeometry args={[0.1, 0.04, 0.04]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
            <mesh position={[0.22, 0.16, -0.05]}>
              <cylinderGeometry args={[0.015, 0.015, 0.08, 6]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.8} />
            </mesh>

            {/* Solid Ash Wood Shovel Shaft (Diagonal across front of torso between hands) */}
            <mesh position={[0, -0.42, 0.05]} rotation={[0.2, 0, -0.32]} castShadow>
              <cylinderGeometry args={[0.024, 0.024, 1.25, 8]} />
              <meshStandardMaterial color="#b45309" roughness={0.7} />
            </mesh>

            {/* Mid-Shaft Steel Collar (Grip for Left Hand lower down) */}
            <mesh position={[-0.12, -0.22, 0.08]} rotation={[0.2, 0, -0.32]}>
              <cylinderGeometry args={[0.03, 0.03, 0.12, 8]} />
              <meshStandardMaterial color="#475569" metalness={0.8} />
            </mesh>

            {/* Heavy Curved Steel Shovel Blade (At bottom ground level) */}
            <group position={[-0.28, -0.92, 0.22]} rotation={[0.3, 0, -0.32]}>
              <mesh castShadow>
                <boxGeometry args={[0.32, 0.38, 0.05]} />
                <meshStandardMaterial color="#475569" metalness={0.88} roughness={0.25} />
              </mesh>
              {/* Shovel Blade Pointed Tip */}
              <mesh position={[0, -0.22, 0]} rotation={[0, 0, Math.PI / 4]}>
                <boxGeometry args={[0.22, 0.22, 0.045]} />
                <meshStandardMaterial color="#334155" metalness={0.88} roughness={0.25} />
              </mesh>

              {/* Physical Sand Heap on Shovel Blade (Visible when scooped) */}
              {hasSandOnShovel && (
                <mesh position={[0, 0.05, 0.05]} castShadow>
                  <coneGeometry args={[0.15, 0.2, 12]} />
                  <meshStandardMaterial color="#d4b895" roughness={0.95} />
                </mesh>
              )}
            </group>
          </group>
        )}

        {/* ── 3D HUMAN HEAD WITH EXPRESSIVE FACE & HARD HAT ── */}
        <group position={[0, 0.76, 0]} rotation={[headRotX, headRotY, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.16, 16, 16]} />
            <meshStandardMaterial color="#fed7aa" roughness={0.4} />
          </mesh>

          {/* Eyes */}
          <mesh position={[-0.048, 0.025, 0.145]}>
            <sphereGeometry args={[0.024, 8, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh position={[-0.048, 0.025, 0.162]}>
            <sphereGeometry args={[0.013, 8, 8]} />
            <meshBasicMaterial color="#0f172a" />
          </mesh>

          <mesh position={[0.048, 0.025, 0.145]}>
            <sphereGeometry args={[0.024, 8, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0.048, 0.025, 0.162]}>
            <sphereGeometry args={[0.013, 8, 8]} />
            <meshBasicMaterial color="#0f172a" />
          </mesh>

          {/* Eyebrows */}
          <mesh position={[-0.048, 0.06, 0.15]} rotation={[0, 0, 0.1]}>
            <boxGeometry args={[0.045, 0.01, 0.01]} />
            <meshBasicMaterial color="#78350f" />
          </mesh>
          <mesh position={[0.048, 0.06, 0.15]} rotation={[0, 0, -0.1]}>
            <boxGeometry args={[0.045, 0.01, 0.01]} />
            <meshBasicMaterial color="#78350f" />
          </mesh>

          {/* Nose */}
          <mesh position={[0, -0.01, 0.16]}>
            <boxGeometry args={[0.03, 0.04, 0.035]} />
            <meshStandardMaterial color="#fdba74" />
          </mesh>

          {/* Mouth */}
          <mesh position={[0, -0.06, 0.145]}>
            <boxGeometry args={[0.065, 0.016, 0.01]} />
            <meshBasicMaterial color="#991b1b" />
          </mesh>

          {/* Hard Hat */}
          <mesh position={[0, 0.08, 0]} castShadow>
            <sphereGeometry args={[0.19, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
            <meshStandardMaterial color={hatColor} roughness={0.3} metalness={0.1} />
          </mesh>
          <mesh position={[0, 0.07, 0.07]} rotation={[0.1, 0, 0]}>
            <cylinderGeometry args={[0.22, 0.22, 0.025, 16]} />
            <meshStandardMaterial color={hatColor} roughness={0.3} />
          </mesh>
          {/* LED Headlamp */}
          <mesh position={[0, 0.11, 0.16]}>
            <boxGeometry args={[0.07, 0.035, 0.035]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0, 0.11, 0.178]}>
            <circleGeometry args={[0.02, 8]} />
            <meshBasicMaterial color="#fef08a" />
          </mesh>
        </group>
      </group>
    </group>
  );
};

// ── 2. ACTIVE SAND SHOVELER & WHEELBARROW TRANSPORT WORKER (14s Physical Cycle) ──
// Authentic human shoveling: Shovels sand with TWO HANDS at waist height, never raises hands over head!
export const SandHaulerWorkerWithWheelbarrow3D: React.FC = () => {
  const [animState, setAnimState] = React.useState({
    workerZ: 3.5,
    workerRotY: 0.1, // Facing viewer/front
    torsoBend: 0.2,
    torsoTwist: 0,
    leftLegAngle: 0,
    rightLegAngle: 0,
    rightArmAngle: 0.35,
    leftArmAngle: 0.55,
    leftArmZ: 0.25,
    rightArmZ: -0.15,
    headRotX: 0.25,
    headRotY: 0,
    hasSandOnShovel: false,
    shovelPitch: 0.3,
    shovelRoll: 0,
    toolHeld: 'shovel' as 'shovel' | 'none',
    wheelbarrowTilt: 0,
    sandInWheelbarrow: 0.3,
  });

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const cycle = t % 14.0; // 14.0 second loop

    let workerZ = 3.5;
    let workerRotY = 0.1; // Facing front
    let torsoBend = 0.2;
    let torsoTwist = 0;
    let leftLegAngle = 0;
    let rightLegAngle = 0;
    let rightArmAngle = 0.35;
    let leftArmAngle = 0.55;
    let leftArmZ = 0.25;
    let rightArmZ = -0.15;
    let headRotX = 0.25;
    let headRotY = 0;
    let hasSandOnShovel = false;
    let shovelPitch = 0.3;
    let shovelRoll = 0;
    let toolHeld: 'shovel' | 'none' = 'shovel';
    let wheelbarrowTilt = 0;
    let sandInWheelbarrow = 0.3;

    // ── Phase 1: Real-Life Two-Handed Shoveling (0.0s - 6.0s) ──
    // Hands strictly at waist/ground level (NEVER above head or chest!)
    if (cycle < 6.0) {
      workerZ = 3.5;
      workerRotY = 0.1; // Facing viewer/front
      toolHeld = 'shovel';

      const scoopSubCycle = (cycle % 2.0) / 2.0; // 3 complete scoops

      // Step 1: Bend forward at hips and plunge shovel down into sand pile
      if (scoopSubCycle < 0.42) {
        const p = scoopSubCycle / 0.42;
        torsoBend = 0.18 + Math.sin(p * Math.PI) * 0.26; // Bends at waist (0.18 to 0.44 rad)
        torsoTwist = -0.18 * Math.sin(p * Math.PI); // Leans toward sand pile on left
        rightArmAngle = 0.25 + Math.sin(p * Math.PI) * 0.25; // Arms push down/forward
        leftArmAngle = 0.45 + Math.sin(p * Math.PI) * 0.3;
        headRotX = 0.25 + Math.sin(p * Math.PI) * 0.2; // Looks down at sand mound
        shovelPitch = 0.2 + Math.sin(p * Math.PI) * 0.35; // Blade plunges into sand
        hasSandOnShovel = p > 0.45;
      }
      // Step 2: Lift loaded shovel to waist height and twist toward wheelbarrow tub
      else if (scoopSubCycle < 0.76) {
        const p = (scoopSubCycle - 0.42) / 0.34;
        torsoBend = 0.14;
        torsoTwist = Math.sin(p * Math.PI) * 0.55; // Smooth turn toward tub
        rightArmAngle = 0.32; // Kept safely at waist level (positive angle)
        leftArmAngle = 0.48;
        headRotX = 0.2;
        headRotY = 0.3 * Math.sin(p * Math.PI); // Looks over at wheelbarrow
        shovelPitch = 0.15 - Math.sin(p * Math.PI) * 0.35; // Tips blade down over tub
        shovelRoll = 0.25 * Math.sin(p * Math.PI);
        hasSandOnShovel = p < 0.5; // Sand drops into tub halfway through swing
      }
      // Step 3: Reset shovel back in front of body at waist height
      else {
        const p = (scoopSubCycle - 0.76) / 0.24;
        torsoBend = 0.18;
        torsoTwist = 0.55 * (1 - p);
        rightArmAngle = 0.35;
        leftArmAngle = 0.55;
        shovelPitch = 0.3;
        shovelRoll = 0;
        hasSandOnShovel = false;
      }

      sandInWheelbarrow = Math.min(1.0, 0.3 + (cycle / 6.0) * 0.7);
    }
    // ── Phase 2: Walk with Wheelbarrow to Rear Dump Mound (6.0s - 9.5s) ──
    else if (cycle < 9.5) {
      const p = (cycle - 6.0) / 3.5;
      workerZ = 3.5 - p * 7.5; // Moves from +3.5 to -4.0
      workerRotY = Math.PI; // Turned facing rear
      toolHeld = 'none';

      // Natural walking stride
      const walkFreq = cycle * 8.0;
      leftLegAngle = Math.sin(walkFreq) * 0.55;
      rightLegAngle = -Math.sin(walkFreq) * 0.55;

      // Both hands gripping wheelbarrow handles at waist level
      rightArmAngle = 0.45;
      leftArmAngle = 0.45;
      leftArmZ = -0.1;
      rightArmZ = 0.1;
      torsoBend = 0.14;
      headRotX = 0.1;
      sandInWheelbarrow = 1.0;
    }
    // ── Phase 3: Tip Wheelbarrow & Empty Sand in Back (9.5s - 11.5s) ──
    else if (cycle < 11.5) {
      const p = (cycle - 9.5) / 2.0;
      workerZ = -4.0;
      workerRotY = Math.PI;
      toolHeld = 'none';
      leftLegAngle = 0.1;
      rightLegAngle = -0.1;

      // Wheelbarrow tilts forward to dump sand
      wheelbarrowTilt = Math.sin(p * Math.PI) * 0.85;
      rightArmAngle = 0.45 + Math.sin(p * Math.PI) * 0.3;
      leftArmAngle = 0.45 + Math.sin(p * Math.PI) * 0.3;
      torsoBend = 0.14 + Math.sin(p * Math.PI) * 0.2;
      sandInWheelbarrow = p < 0.4 ? 1.0 : Math.max(0.08, 1.0 - (p - 0.4) * 2.2);
    }
    // ── Phase 4: Walk Empty Wheelbarrow Back to Front Sand Pile (11.5s - 14.0s) ──
    else {
      const p = (cycle - 11.5) / 2.5;
      workerZ = -4.0 + p * 7.5; // Moves from -4.0 back to +3.5
      workerRotY = 0; // Turned facing front
      toolHeld = 'none';

      const walkFreq = cycle * 8.0;
      leftLegAngle = Math.sin(walkFreq) * 0.55;
      rightLegAngle = -Math.sin(walkFreq) * 0.55;

      rightArmAngle = 0.45;
      leftArmAngle = 0.45;
      torsoBend = 0.12;
      sandInWheelbarrow = 0.08;
    }

    setAnimState({
      workerZ,
      workerRotY,
      torsoBend,
      torsoTwist,
      leftLegAngle,
      rightLegAngle,
      rightArmAngle,
      leftArmAngle,
      leftArmZ,
      rightArmZ,
      headRotX,
      headRotY,
      hasSandOnShovel,
      shovelPitch,
      shovelRoll,
      toolHeld,
      wheelbarrowTilt,
      sandInWheelbarrow,
    });
  });

  const isWalking = animState.toolHeld === 'none';

  return (
    <group position={[-2.2, 0, 0]}>
      {/* ── 1. FRONT SAND PILE DUNE (Next to worker at front station) ── */}
      <group position={[-1.2, 0, 3.5]}>
        <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
          <coneGeometry args={[1.3, 0.7, 14]} />
          <meshStandardMaterial color="#d4b895" roughness={0.95} />
        </mesh>
        <mesh position={[0.4, 0.2, 0.3]}>
          <sphereGeometry args={[0.5, 8, 8]} />
          <meshStandardMaterial color="#c29b68" roughness={0.95} />
        </mesh>
      </group>

      {/* ── 2. REAR SAND DUMP MOUND (Where sand gets dropped off) ── */}
      <group position={[0, 0, -4.6]}>
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <coneGeometry args={[1.6, 0.85, 14]} />
          <meshStandardMaterial color="#d4b895" roughness={0.95} />
        </mesh>
        <mesh position={[-0.4, 0.3, 0.3]}>
          <sphereGeometry args={[0.65, 8, 8]} />
          <meshStandardMaterial color="#c29b68" roughness={0.95} />
        </mesh>
      </group>

      {/* ── 3. MOVING WORKER & WHEELBARROW ── */}
      <group position={[0, 0, animState.workerZ]} rotation={[0, animState.workerRotY, 0]}>
        <HumanoidWorkerBody
          hatColor="#facc15"
          vestColor="#ea580c"
          pantsColor="#334155"
          leftLegAngle={animState.leftLegAngle}
          rightLegAngle={animState.rightLegAngle}
          torsoBend={animState.torsoBend}
          torsoTwist={animState.torsoTwist}
          headRotX={animState.headRotX}
          headRotY={animState.headRotY}
          rightArmAngle={animState.rightArmAngle}
          leftArmAngle={animState.leftArmAngle}
          leftArmZ={animState.leftArmZ}
          rightArmZ={animState.rightArmZ}
          toolHeld={animState.toolHeld}
          hasSandOnShovel={animState.hasSandOnShovel}
          shovelPitch={animState.shovelPitch}
          shovelRoll={animState.shovelRoll}
        />

        {/* ── WHEELBARROW VEHICLE ── */}
        <group
          position={isWalking ? [0, 0.15, 0.75] : [0.95, 0, 0.1]}
          rotation={isWalking ? [animState.wheelbarrowTilt, 0, 0] : [0, -0.4, 0]}
        >
          {/* Blue Steel Payload Tub */}
          <mesh position={[0, 0.42, 0]} castShadow>
            <boxGeometry args={[0.75, 0.35, 1.05]} />
            <meshStandardMaterial color="#0284c7" roughness={0.4} metalness={0.3} />
          </mesh>

          {/* Front Heavy Rubber Wheel */}
          <mesh position={[0, 0.2, 0.62]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.2, 0.2, 0.12, 12]} />
            <meshStandardMaterial color="#0f172a" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.2, 0.62]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.09, 0.09, 0.13, 8]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
          </mesh>

          {/* Support Legs */}
          {[-0.3, 0.3].map((lx, idx) => (
            <mesh key={idx} position={[lx, 0.18, -0.2]}>
              <cylinderGeometry args={[0.02, 0.02, 0.36, 6]} />
              <meshStandardMaterial color="#334155" metalness={0.8} />
            </mesh>
          ))}

          {/* Twin Push Handles (Waist Height) */}
          {[-0.28, 0.28].map((hx, idx) => (
            <mesh key={idx} position={[hx, 0.45, -0.6]} rotation={[0.25, 0, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.6, 6]} />
              <meshStandardMaterial color="#d97706" />
            </mesh>
          ))}

          {/* Dynamic Sand Heap inside Wheelbarrow */}
          <mesh position={[0, 0.45 + animState.sandInWheelbarrow * 0.08, 0]}>
            <boxGeometry args={[0.68, 0.15 * animState.sandInWheelbarrow, 0.9]} />
            <meshStandardMaterial color="#d4b895" roughness={0.95} />
          </mesh>
        </group>
      </group>
    </group>
  );
};

// ── 3. STATIONARY MASON / BRICKLAYER BUILDER (Blue Team Site) ──
// Works logically in-place at foundation tapping brick with hammer at waist level!
export const StationaryMasonBuilder3D: React.FC = () => {
  const [anim, setAnim] = React.useState({
    rightArm: 0.3,
    leftArm: 0.45,
    torsoBend: 0.2,
    headX: 0.35,
    sparkVisible: false,
  });

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const cycle = (t * 2.0) % 1.0; // Rhythmic masonry tapping cycle

    let rightArm = 0.3;
    let leftArm = 0.45;
    let torsoBend = 0.2;
    let headX = 0.35;
    let sparkVisible = false;

    if (cycle < 0.6) {
      // Gentle forearm lift (waist height, never above head)
      const p = cycle / 0.6;
      rightArm = 0.25 - p * 0.25;
      headX = 0.3;
    } else if (cycle < 0.75) {
      // Firm tap on foundation brick
      const p = (cycle - 0.6) / 0.15;
      rightArm = 0.0 + p * 0.6;
      headX = 0.42;
      sparkVisible = p > 0.7;
    } else {
      // Recoil slightly
      const p = (cycle - 0.75) / 0.25;
      rightArm = 0.6 - p * 0.35;
      headX = 0.42 - p * 0.07;
    }

    setAnim({ rightArm, leftArm, torsoBend, headX, sparkVisible });
  });

  return (
    <group position={[-5.5, 0, 2.0]} rotation={[0, 2.1, 0]}>
      {/* Mason Humanoid */}
      <HumanoidWorkerBody
        hatColor="#2563eb"
        vestColor="#ea580c"
        pantsColor="#1e3a8a"
        torsoBend={anim.torsoBend}
        headRotX={anim.headX}
        rightArmAngle={anim.rightArm}
        leftArmAngle={anim.leftArm}
        toolHeld="hammer"
      />

      {/* Foundation Concrete Block Being Worked On */}
      <group position={[0.1, 0, 0.6]}>
        <mesh position={[0, 0.2, 0]} castShadow>
          <boxGeometry args={[0.5, 0.4, 0.5]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.7} />
        </mesh>
        {/* Spirit Level Tool Resting on Block */}
        <mesh position={[0, 0.42, 0]}>
          <boxGeometry args={[0.4, 0.04, 0.04]} />
          <meshStandardMaterial color="#facc15" />
        </mesh>
        {anim.sparkVisible && (
          <mesh position={[0, 0.44, 0]}>
            <sphereGeometry args={[0.14, 8, 8]} />
            <meshBasicMaterial color="#fef08a" />
          </mesh>
        )}
      </group>

      {/* ── SUPPLY PALLET WITH STACKED BRICKS & MORTAR TUB (BESIDE WORKER) ── */}
      <group position={[-0.9, 0, 0.2]} rotation={[0, 0.3, 0]}>
        {/* Wooden Pallet Base */}
        <mesh position={[0, 0.06, 0]} castShadow>
          <boxGeometry args={[0.9, 0.12, 0.9]} />
          <meshStandardMaterial color="#92400e" roughness={0.8} />
        </mesh>
        {/* Stacked Red Bricks */}
        {[0.16, 0.32, 0.48].map((by, bidx) => (
          <mesh key={bidx} position={[0, by, 0]} castShadow>
            <boxGeometry args={[0.7, 0.14, 0.7]} />
            <meshStandardMaterial color="#b91c1c" roughness={0.9} />
          </mesh>
        ))}
        {/* Mortar Mixing Pan */}
        <mesh position={[0.35, 0.62, 0.35]} castShadow>
          <cylinderGeometry args={[0.18, 0.14, 0.16, 10]} />
          <meshStandardMaterial color="#475569" roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
};

// ── 4. STATIONARY STRUCTURAL SITE INSPECTOR (Red Team Site) ──
// Works logically in-place at Red foundation inspecting tolerances with laser tool & clipboard!
export const StationarySiteInspector3D: React.FC = () => {
  const [anim, setAnim] = React.useState({
    headX: 0.3,
    headY: 0,
    rightArm: 0.35,
  });

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const cycle = (t * 0.8) % 4.0;

    let headX = 0.3;
    let headY = 0;
    let rightArm = 0.35;

    if (cycle < 2.0) {
      // Aims laser measuring tool along beam edge in front of chest
      headX = 0.25;
      headY = Math.sin(cycle * 1.5) * 0.25;
      rightArm = 0.35 + Math.sin(cycle * 2) * 0.08;
    } else {
      // Looks down at clipboard to log readings
      headX = 0.45;
      headY = 0;
      rightArm = 0.2;
    }

    setAnim({ headX, headY, rightArm });
  });

  return (
    <group position={[5.5, 0, 2.0]} rotation={[0, -2.1, 0]}>
      {/* Inspector Humanoid */}
      <HumanoidWorkerBody
        hatColor="#dc2626"
        vestColor="#84cc16"
        pantsColor="#7f1d1d"
        headRotX={anim.headX}
        headRotY={anim.headY}
        rightArmAngle={anim.rightArm}
        toolHeld="laser"
      />

      {/* Blueprint Plans Stand Beside Worker */}
      <group position={[0.9, 0, 0.2]} rotation={[0, -0.3, 0]}>
        {/* Tripod Stand */}
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 1.0, 6]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        {/* Drawing Board with Blueprint Sheet */}
        <mesh position={[0, 1.0, 0]} rotation={[-0.3, 0, 0]} castShadow>
          <boxGeometry args={[0.7, 0.5, 0.04]} />
          <meshStandardMaterial color="#78350f" />
        </mesh>
        <mesh position={[0, 1.02, 0.025]} rotation={[-0.3, 0, 0]}>
          <planeGeometry args={[0.62, 0.42]} />
          <meshBasicMaterial color="#0284c7" />
        </mesh>
      </group>
    </group>
  );
};

// ── 5. COMPLETE REALISTIC 3D CONSTRUCTION CREW ──
export const ConstructionCrew3D: React.FC = () => {
  return (
    <group>
      {/* 🚜 1. SAND SHOVELER & WHEELBARROW TRANSPORT WORKER (Two-handed shovel -> Wheelbarrow -> Rear dump -> Return) */}
      <SandHaulerWorkerWithWheelbarrow3D />

      {/* 🧱 2. BLUE SITE BRICKLAYER / MASON (In-place at foundation with brick pallet & hammer) */}
      <StationaryMasonBuilder3D />

      {/* 📐 3. RED SITE STRUCTURAL INSPECTOR (In-place at foundation with laser & blueprints stand) */}
      <StationarySiteInspector3D />

      {/* 🔭 4. CENTRAL CHIEF SURVEYOR (Operating Theodolite Tripod on Central Pedestal) */}
      <group position={[-0.7, 0, -2.8]} rotation={[0, 0.15, 0]}>
        <HumanoidWorkerBody
          hatColor="#ffffff"
          vestColor="#ea580c"
          pantsColor="#334155"
          toolHeld="clipboard"
        />
      </group>

      {/* 🚦 5. SIGNALMAN (Directing Traffic on Left Haul Road) */}
      <group position={[-12.2, 0, 3.8]} rotation={[0, 1.6, 0]}>
        <HumanoidWorkerBody
          hatColor="#facc15"
          vestColor="#ea580c"
          pantsColor="#334155"
          toolHeld="baton"
        />
      </group>

      {/* 🚦 6. TRAFFIC SAFETY FLAGMAN (Directing Trucks on Right Haul Road) */}
      <group position={[12.2, 0, 3.8]} rotation={[0, -1.6, 0]}>
        <HumanoidWorkerBody
          hatColor="#facc15"
          vestColor="#84cc16"
          pantsColor="#334155"
          toolHeld="baton"
        />
      </group>
    </group>
  );
};

// Compatibility Alias
export const ConstructionWorker3D = HumanoidWorkerBody;
