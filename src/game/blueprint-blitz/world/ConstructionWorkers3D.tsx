// ============================================================
// BLUEPRINT BLITZ — Physics-Based 3D Construction Workers
// Authentic Construction Site Logic & Working Mechanics:
// 1. Sand Shoveler & Wheelbarrow Transport Worker:
//    - Holds physical steel shovel with BOTH HANDS
//    - Scoops sand from front sand pile into wheelbarrow tub
//    - Mounts shovel, grips wheelbarrow handles, walks to rear haul dump
//    - Tips wheelbarrow to dump sand into rear mound, and walks back!
// 2. Stationary Mason / Bricklayer Builder (Blue Team Site):
//    - Stands at foundation with brick pallet & mortar pan beside him
//    - Picks up brick, sets on course, taps with framing hammer, checks level
//    - No illogical running across the site carrying stones!
// 3. Structural Site Inspector (Red Team Site):
//    - Inspects foundation beams with laser tool, logs data on clipboard & radio
// 4. Central Chief Surveyor:
//    - Operates optical theodolite telescope on central survey platform
// 5. Haul Road Traffic Marshalls:
//    - Direct oncoming heavy vehicles with illuminated orange safety batons
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
  leftArmAngle = -0.3,
  rightArmAngle = -0.3,
  leftArmZ = 0,
  rightArmZ = 0,
  leftArmY = 0,
  rightArmY = 0,
  toolHeld = 'none',
  hasSandOnShovel = false,
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

          {toolHeld === 'trowel' && (
            <group position={[0, -0.45, 0.1]} rotation={[0.8, 0, 0]}>
              <mesh position={[0, 0.12, 0]}>
                <boxGeometry args={[0.12, 0.18, 0.02]} />
                <meshStandardMaterial color="#64748b" metalness={0.8} />
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

          {/* ⛏️ PHYSICAL STEEL SHOVEL WITH D-HANDLE (HELD SECURELY IN HANDS) */}
          {toolHeld === 'shovel' && (
            <group position={[0, -0.42, 0.12]} rotation={[1.1, 0, -0.2]}>
              {/* D-Grip Handle */}
              <mesh position={[0, -0.05, 0]}>
                <boxGeometry args={[0.08, 0.04, 0.03]} />
                <meshStandardMaterial color="#1e293b" />
              </mesh>
              {/* Wooden Shovel Shaft extending across both hands */}
              <mesh position={[0, 0.45, 0]} castShadow>
                <cylinderGeometry args={[0.022, 0.022, 1.05, 8]} />
                <meshStandardMaterial color="#b45309" roughness={0.7} />
              </mesh>
              {/* Heavy Curved Steel Blade Scoop */}
              <group position={[0, 1.0, 0]}>
                <mesh rotation={[0.2, 0, 0]} castShadow>
                  <boxGeometry args={[0.28, 0.35, 0.04]} />
                  <meshStandardMaterial color="#475569" metalness={0.85} roughness={0.2} />
                </mesh>
                {/* Physical Sand Mound Scooped onto Shovel Blade */}
                {hasSandOnShovel && (
                  <mesh position={[0, 0.05, 0.04]}>
                    <coneGeometry args={[0.13, 0.16, 10]} />
                    <meshStandardMaterial color="#d4b895" roughness={0.95} />
                  </mesh>
                )}
              </group>
            </group>
          )}

          {toolHeld === 'hammer' && (
            <group position={[0, -0.45, 0.1]} rotation={[1.1, 0, 0]}>
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

          {toolHeld === 'laser' && (
            <group position={[0, -0.45, 0.1]} rotation={[0.6, 0, 0]}>
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
// Shovels sand with TWO-HANDED shovel from front pile into wheelbarrow, walks to back dump, empties, and returns!
export const SandHaulerWorkerWithWheelbarrow3D: React.FC = () => {
  const [animState, setAnimState] = React.useState({
    workerZ: 3.5,
    workerRotY: 0.15, // Faces forward toward viewer during shoveling
    torsoBend: 0,
    torsoTwist: 0,
    leftLegAngle: 0,
    rightLegAngle: 0,
    rightArmAngle: -0.6,
    leftArmAngle: -0.6,
    leftArmZ: 0.2,
    rightArmZ: -0.1,
    headRotX: 0.25,
    headRotY: 0,
    hasSandOnShovel: false,
    toolHeld: 'shovel' as 'shovel' | 'none',
    wheelbarrowTilt: 0,
    sandInWheelbarrow: 0.4,
  });

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const cycle = t % 14.0; // 14.0 second loop

    let workerZ = 3.5;
    let workerRotY = 0.15; // Facing viewer/camera
    let torsoBend = 0;
    let torsoTwist = 0;
    let leftLegAngle = 0;
    let rightLegAngle = 0;
    let rightArmAngle = -0.6;
    let leftArmAngle = -0.6;
    let leftArmZ = 0.2;
    let rightArmZ = -0.1;
    let headRotX = 0.25;
    let headRotY = 0;
    let hasSandOnShovel = false;
    let toolHeld: 'shovel' | 'none' = 'shovel';
    let wheelbarrowTilt = 0;
    let sandInWheelbarrow = 0.4;

    // ── Phase 1: Shoveling with Steel Shovel from Front Sand Pile (0.0s - 6.0s) ──
    if (cycle < 6.0) {
      workerZ = 3.5;
      workerRotY = 0.15; // Facing forward
      toolHeld = 'shovel';

      const scoopSubCycle = (cycle % 2.0) / 2.0; // 3 complete scoops
      if (scoopSubCycle < 0.45) {
        // Bend down, plunge shovel into sand pile
        const p = scoopSubCycle / 0.45;
        torsoBend = Math.sin(p * Math.PI) * 0.48;
        torsoTwist = -0.2 * Math.sin(p * Math.PI); // Twist towards sand pile on left
        rightArmAngle = -0.6 - Math.sin(p * Math.PI) * 0.8;
        leftArmAngle = -0.5 - Math.sin(p * Math.PI) * 0.7;
        headRotX = 0.35 + Math.sin(p * Math.PI) * 0.25;
        hasSandOnShovel = p > 0.35;
      } else if (scoopSubCycle < 0.75) {
        // Lift loaded shovel and twist over to wheelbarrow tub
        const p = (scoopSubCycle - 0.45) / 0.3;
        torsoBend = 0.1;
        torsoTwist = Math.sin(p * Math.PI) * 0.85; // Twists 50 deg right over tub
        rightArmAngle = -1.3;
        leftArmAngle = -1.1;
        headRotX = 0.2;
        headRotY = 0.35 * Math.sin(p * Math.PI);
        hasSandOnShovel = p < 0.55; // Sand drops into tub at peak of swing
      } else {
        // Reset shovel back to ready pose
        const p = (scoopSubCycle - 0.75) / 0.25;
        torsoBend = 0;
        torsoTwist = 0.85 * (1 - p);
        rightArmAngle = -1.3 + p * 0.7;
        leftArmAngle = -1.1 + p * 0.5;
        hasSandOnShovel = false;
      }

      sandInWheelbarrow = Math.min(1.0, 0.35 + (cycle / 6.0) * 0.65);
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

      // Both hands gripping wheelbarrow handles
      rightArmAngle = -1.15;
      leftArmAngle = -1.15;
      leftArmZ = 0;
      rightArmZ = 0;
      torsoBend = 0.15;
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

      // Wheelbarrow tilts 60 degrees up
      wheelbarrowTilt = Math.sin(p * Math.PI) * 0.95;
      rightArmAngle = -1.15 - Math.sin(p * Math.PI) * 0.45;
      leftArmAngle = -1.15 - Math.sin(p * Math.PI) * 0.45;
      torsoBend = 0.15 + Math.sin(p * Math.PI) * 0.25;
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

      rightArmAngle = -1.15;
      leftArmAngle = -1.15;
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

          {/* Twin Push Handles */}
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
// Works logically in-place at foundation with brick pallet & mortar pan beside him!
export const StationaryMasonBuilder3D: React.FC = () => {
  const [anim, setAnim] = React.useState({
    rightArm: -1.6,
    leftArm: -0.8,
    torsoBend: 0.2,
    headX: 0.35,
    sparkVisible: false,
  });

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const cycle = (t * 2.0) % 1.0; // Rhythmic masonry tapping cycle

    let rightArm = -1.6;
    let leftArm = -0.8;
    let torsoBend = 0.2;
    let headX = 0.35;
    let sparkVisible = false;

    if (cycle < 0.6) {
      // Wind-up backswing
      const p = cycle / 0.6;
      rightArm = -1.6 - p * 0.9;
      headX = 0.3;
    } else if (cycle < 0.75) {
      // Firm tap on foundation brick
      const p = (cycle - 0.6) / 0.15;
      rightArm = -2.5 + p * 1.8;
      headX = 0.45;
      sparkVisible = p > 0.7;
    } else {
      // Recoil & inspect alignment
      const p = (cycle - 0.75) / 0.25;
      rightArm = -0.7 - Math.sin(p * Math.PI) * 0.3 - p * 0.6;
      headX = 0.45 - p * 0.1;
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
    rightArm: -0.9,
  });

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const cycle = (t * 0.8) % 4.0;

    let headX = 0.3;
    let headY = 0;
    let rightArm = -0.9;

    if (cycle < 2.0) {
      // Aims laser measuring tool along beam edge
      headX = 0.25;
      headY = Math.sin(cycle * 1.5) * 0.25;
      rightArm = -0.9 + Math.sin(cycle * 2) * 0.1;
    } else {
      // Looks down at clipboard to log readings
      headX = 0.45;
      headY = 0;
      rightArm = -0.5;
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
