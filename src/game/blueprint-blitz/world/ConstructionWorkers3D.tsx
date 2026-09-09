// ============================================================
// BLUEPRINT BLITZ — Physics-Based Realistic 3D Construction Workers
// Authentic Construction Site Logic & Natural Human Kinematics:
// 1. Two-Handed Sand Shoveler & Wheelbarrow Transport Worker:
//    - Holds physical steel shovel firmly with BOTH HANDS (Right on top D-grip, Left on mid-shaft)
//    - Slow, deliberate ground-level sand scooping (never fast or jerky)
//    - Smoothly brings shovel up and turns directly over the wheel cart to dump sand
//    - Hands and shovel stay strictly in front of body at waist/chest level (NEVER above head!)
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
  isDumpingIntoCart?: boolean;
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
  isDumpingIntoCart = false,
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

          {/* Heavy Steel Sledge / Mason Hammer (Held firmly in fist, striking straight down) */}
          {toolHeld === 'hammer' && (
            <group position={[0, -0.45, 0.06]} rotation={[0.45, 0, 0]}>
              {/* Ash Wood Handle */}
              <mesh position={[0, 0.20, 0]} castShadow>
                <cylinderGeometry args={[0.022, 0.022, 0.65, 8]} />
                <meshStandardMaterial color="#b45309" roughness={0.7} />
              </mesh>
              {/* Textured Black Rubber Grip in Hand */}
              <mesh position={[0, -0.04, 0]}>
                <cylinderGeometry args={[0.028, 0.028, 0.18, 8]} />
                <meshStandardMaterial color="#0f172a" roughness={0.9} />
              </mesh>
              {/* Solid Heavy Cast Steel Mallet Head */}
              <group position={[0, 0.52, 0]}>
                <mesh castShadow>
                  <boxGeometry args={[0.15, 0.13, 0.22]} />
                  <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
                </mesh>
                {/* Steel Striking Faces (Front & Back) */}
                <mesh position={[0, 0, 0.115]}>
                  <boxGeometry args={[0.13, 0.11, 0.02]} />
                  <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
                </mesh>
                <mesh position={[0, 0, -0.115]}>
                  <boxGeometry args={[0.13, 0.11, 0.02]} />
                  <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
                </mesh>
              </group>
            </group>
          )}

          {/* Laser Inspector Tool (Right Hand) */}
          {toolHeld === 'laser' && (
            <group position={[0, -0.45, 0.1]} rotation={[0.5, 0, 0]}>
              <mesh castShadow>
                <boxGeometry args={[0.08, 0.16, 0.05]} />
                <meshStandardMaterial color="#ea580c" roughness={0.4} />
              </mesh>
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

        {/* ── ⛏️ TWO-HANDED STEEL SHOVEL RIG (Held securely in front of body at waist height) ── */}
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

            {/* Solid Ash Wood Shovel Shaft */}
            <mesh position={[0, -0.42, 0.05]} rotation={[0.2, 0, -0.32]} castShadow>
              <cylinderGeometry args={[0.024, 0.024, 1.25, 8]} />
              <meshStandardMaterial color="#b45309" roughness={0.7} />
            </mesh>

            {/* Mid-Shaft Steel Collar (Grip for Left Hand lower down) */}
            <mesh position={[-0.12, -0.22, 0.08]} rotation={[0.2, 0, -0.32]}>
              <cylinderGeometry args={[0.03, 0.03, 0.12, 8]} />
              <meshStandardMaterial color="#475569" metalness={0.8} />
            </mesh>

            {/* Heavy Curved Steel Shovel Blade (Positioned at sand pile / over wheel cart) */}
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

              {/* Sand Heap on Shovel Blade (Visible when scooped) */}
              {hasSandOnShovel && (
                <mesh position={[0, 0.05, 0.05]} castShadow>
                  <coneGeometry args={[0.16, 0.22, 12]} />
                  <meshStandardMaterial color="#d4b895" roughness={0.95} />
                </mesh>
              )}

              {/* Falling Sand Stream when dumped into Wheel Cart */}
              {isDumpingIntoCart && (
                <group position={[0, -0.35, 0]}>
                  <mesh position={[0, -0.25, 0]}>
                    <cylinderGeometry args={[0.08, 0.18, 0.55, 8]} />
                    <meshStandardMaterial color="#d4b895" transparent opacity={0.85} roughness={0.95} />
                  </mesh>
                </group>
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

// ── 2. ACTIVE SAND SHOVELER & WHEELBARROW TRANSPORT WORKER (20s Physical Cycle) ──
// Authentic human shoveling: Slow, deliberate sand scooping, brings shovel up directly over wheel cart tub, dumps smoothly!
export const SandHaulerWorkerWithWheelbarrow3D: React.FC = () => {
  const [animState, setAnimState] = React.useState({
    workerZ: 3.5,
    workerRotY: 0.1,
    torsoBend: 0.14,
    torsoTwist: 0,
    leftLegAngle: 0,
    rightLegAngle: 0,
    rightArmAngle: 0.35,
    leftArmAngle: 0.55,
    leftArmZ: 0.25,
    rightArmZ: -0.15,
    headRotX: 0.22,
    headRotY: 0,
    hasSandOnShovel: false,
    isDumpingIntoCart: false,
    shovelPitch: 0.15,
    shovelRoll: 0,
    toolHeld: 'shovel' as 'shovel' | 'none',
    wheelbarrowTilt: 0,
    sandInWheelbarrow: 0.25,
    isRearDumping: false,
  });

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const cycle = t % 20.0; // 20.0 second full realistic physical cycle

    let workerZ = 3.5;
    let workerRotY = 0.1;
    let torsoBend = 0.14;
    let torsoTwist = 0;
    let leftLegAngle = 0;
    let rightLegAngle = 0;
    let rightArmAngle = 0.35;
    let leftArmAngle = 0.55;
    let leftArmZ = 0.25;
    let rightArmZ = -0.15;
    let headRotX = 0.22;
    let headRotY = 0;
    let hasSandOnShovel = false;
    let isDumpingIntoCart = false;
    let shovelPitch = 0.15;
    let shovelRoll = 0;
    let toolHeld: 'shovel' | 'none' = 'shovel';
    let wheelbarrowTilt = 0;
    let sandInWheelbarrow = 0.25;
    let isRearDumping = false;

    // ── Phase 1: Slow, Deliberate Two-Handed Shoveling into Wheel Cart (0.0s - 11.6s) ──
    // 2 complete, slow, satisfying scoops (5.8 seconds each)
    if (cycle < 11.6) {
      workerZ = 3.5;
      workerRotY = 0.1;
      toolHeld = 'shovel';

      const scoopPeriod = 5.8; // 5.8 seconds per scoop (Slow, weighted, deliberate)
      const scoopSubTime = cycle % scoopPeriod;

      // Step 1: Slow, steady plunge into the sand pile on the left (0.0s - 2.2s)
      if (scoopSubTime < 2.2) {
        const p = scoopSubTime / 2.2;
        const smoothP = 0.5 - 0.5 * Math.cos(p * Math.PI);

        torsoBend = 0.14 + smoothP * 0.34; // Bends steadily at waist down to sand
        torsoTwist = -0.42 * smoothP; // Twists smoothly toward sand pile on left
        rightArmAngle = 0.22 + smoothP * 0.26; // Arms extend down/forward at waist
        leftArmAngle = 0.40 + smoothP * 0.32;
        headRotX = 0.20 + smoothP * 0.28; // Head tilts down to watch blade penetrate sand
        headRotY = -0.35 * smoothP;
        shovelPitch = 0.15 + smoothP * 0.38; // Blade slides deep into sand mound
        hasSandOnShovel = false;
      }
      // Step 2: Settle into sand & lever loaded mound (2.2s - 3.0s)
      else if (scoopSubTime < 3.0) {
        torsoBend = 0.48;
        torsoTwist = -0.42;
        rightArmAngle = 0.48;
        leftArmAngle = 0.72;
        headRotX = 0.48;
        headRotY = -0.35;
        shovelPitch = 0.53;
        hasSandOnShovel = true; // Generous heap of golden sand securely loaded on blade
      }
      // Step 3: Bring shovel up smoothly and rotate directly over the Wheel Cart Tub (3.0s - 4.5s)
      else if (scoopSubTime < 4.5) {
        const p = (scoopSubTime - 3.0) / 1.5;
        const smoothP = 0.5 - 0.5 * Math.cos(p * Math.PI);

        torsoBend = 0.48 - smoothP * 0.36; // Straightens torso smoothly to upright waist height (0.12)
        torsoTwist = -0.42 + smoothP * 1.30; // Twists smoothly from left to +0.88 rad (directly facing wheel cart tub!)
        rightArmAngle = 0.48 - smoothP * 0.16; // Right arm stays comfortably at waist level
        leftArmAngle = 0.72 - smoothP * 0.22; // Left arm supports shaft
        headRotX = 0.48 - smoothP * 0.26;
        headRotY = -0.35 + smoothP * 0.90; // Head smoothly tracks from sand pile to look right into wheel cart tub

        // Shovel blade rises to waist height and positions centered directly over the wheel cart tub
        shovelPitch = 0.53 - smoothP * 0.48; // Levels off smoothly
        shovelRoll = smoothP * 0.35;
        hasSandOnShovel = true;
      }
      // Step 4: Tilt shovel blade downward and pour sand smoothly into Wheel Cart tub (4.5s - 5.3s)
      else if (scoopSubTime < 4.5 + 0.8) {
        const p = (scoopSubTime - 4.5) / 0.8;
        torsoBend = 0.12;
        torsoTwist = 0.88; // Locked directly over wheel cart tub
        rightArmAngle = 0.32;
        leftArmAngle = 0.50;
        headRotX = 0.22;
        headRotY = 0.55; // Watching sand pour into wheel cart

        // Shovel blade tilts down and rolls over tub opening
        shovelPitch = 0.05 - p * 0.47; // Tilts down into tub
        shovelRoll = 0.35 + p * 0.20; // Rolls to let sand slide off
        hasSandOnShovel = p < 0.35; // Sand slides off blade
        isDumpingIntoCart = p >= 0.05 && p <= 0.85; // Continuous sand stream pouring into cart
      }
      // Step 5: Smooth shovel leveling & return toward sand pile (5.3s - 5.8s)
      else {
        const p = (scoopSubTime - 5.3) / 0.5;
        torsoBend = 0.12 + p * 0.02;
        torsoTwist = 0.88 * (1 - p); // Twists smoothly back to center
        rightArmAngle = 0.32 + p * 0.03;
        leftArmAngle = 0.50 + p * 0.05;
        headRotX = 0.22;
        headRotY = 0.55 * (1 - p);
        shovelPitch = -0.42 + p * 0.57; // Returns to neutral waist angle
        shovelRoll = 0.55 * (1 - p);
        hasSandOnShovel = false;
      }

      // Sand level inside wheelbarrow progressively builds with each scoop
      sandInWheelbarrow = Math.min(1.0, 0.2 + (cycle / 11.6) * 0.8);
    }
    // ── Phase 2: Walk with Full Wheelbarrow to Rear Dump Mound (11.6s - 15.0s) ──
    else if (cycle < 15.0) {
      const p = (cycle - 11.6) / 3.4;
      workerZ = 3.5 - p * 7.5; // Moves from +3.5 to -4.0
      workerRotY = Math.PI; // Turned facing rear haul road
      toolHeld = 'none';

      const walkFreq = cycle * 7.5;
      leftLegAngle = Math.sin(walkFreq) * 0.55;
      rightLegAngle = -Math.sin(walkFreq) * 0.55;

      // Both hands gripping wheelbarrow push handles at waist height
      rightArmAngle = 0.45;
      leftArmAngle = 0.45;
      leftArmZ = -0.1;
      rightArmZ = 0.1;
      torsoBend = 0.14;
      headRotX = 0.1;
      sandInWheelbarrow = 1.0;
    }
    // ── Phase 3: Tip Wheelbarrow & Empty Sand at Rear Mound (15.0s - 17.2s) ──
    else if (cycle < 17.2) {
      const p = (cycle - 15.0) / 2.2;
      workerZ = -4.0;
      workerRotY = Math.PI;
      toolHeld = 'none';
      leftLegAngle = 0.1;
      rightLegAngle = -0.1;

      // Wheelbarrow tub tilts forward to tip payload into mound
      wheelbarrowTilt = Math.sin(p * Math.PI) * 0.85;
      rightArmAngle = 0.45 + Math.sin(p * Math.PI) * 0.3;
      leftArmAngle = 0.45 + Math.sin(p * Math.PI) * 0.3;
      torsoBend = 0.14 + Math.sin(p * Math.PI) * 0.2;
      sandInWheelbarrow = p < 0.35 ? 1.0 : Math.max(0.08, 1.0 - (p - 0.35) * 2.0);
      isRearDumping = p >= 0.25 && p <= 0.75;
    }
    // ── Phase 4: Walk Empty Wheelbarrow Back to Front Sand Station (17.2s - 20.0s) ──
    else {
      const p = (cycle - 17.2) / 2.8;
      workerZ = -4.0 + p * 7.5; // Moves from -4.0 back to +3.5
      workerRotY = 0; // Turned facing front
      toolHeld = 'none';

      const walkFreq = cycle * 7.5;
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
      isDumpingIntoCart,
      shovelPitch,
      shovelRoll,
      toolHeld,
      wheelbarrowTilt,
      sandInWheelbarrow,
      isRearDumping,
    });
  });

  const isWalking = animState.toolHeld === 'none';

  return (
    <group position={[-2.2, 0, 0]}>
      {/* ── 1. FRONT SAND PILE DUNE (Positioned directly to worker's left) ── */}
      <group position={[-1.15, 0, 3.5]}>
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
          isDumpingIntoCart={animState.isDumpingIntoCart}
          shovelPitch={animState.shovelPitch}
          shovelRoll={animState.shovelRoll}
        />

        {/* ── WHEELBARROW VEHICLE (WHEEL CART) ── */}
        {/* Parked right beside worker during shoveling, and gripped in front during haul */}
        <group
          position={isWalking ? [0, 0.15, 0.75] : [0.82, 0, 0.28]}
          rotation={isWalking ? [animState.wheelbarrowTilt, 0, 0] : [0, -0.55, 0]}
        >
          {/* Blue Steel Payload Tub / Hopper */}
          <mesh position={[0, 0.42, 0]} castShadow>
            <boxGeometry args={[0.75, 0.35, 1.05]} />
            <meshStandardMaterial color="#0284c7" roughness={0.4} metalness={0.3} />
          </mesh>
          {/* Hopper Rolled Steel Rim */}
          <mesh position={[0, 0.58, 0]}>
            <boxGeometry args={[0.79, 0.04, 1.09]} />
            <meshStandardMaterial color="#0369a1" roughness={0.3} metalness={0.5} />
          </mesh>

          {/* Front Heavy Rubber Pneumatic Wheel */}
          <mesh position={[0, 0.2, 0.62]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.2, 0.2, 0.12, 14]} />
            <meshStandardMaterial color="#0f172a" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.2, 0.62]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.09, 0.09, 0.13, 8]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
          </mesh>
          {/* Curved Front Tipping Nose Guard */}
          <mesh position={[0, 0.22, 0.75]} rotation={[0.4, 0, 0]}>
            <boxGeometry args={[0.4, 0.04, 0.16]} />
            <meshStandardMaterial color="#d97706" />
          </mesh>

          {/* Steel Support Legs */}
          {[-0.3, 0.3].map((lx, idx) => (
            <mesh key={idx} position={[lx, 0.18, -0.2]}>
              <cylinderGeometry args={[0.02, 0.02, 0.36, 6]} />
              <meshStandardMaterial color="#334155" metalness={0.8} />
            </mesh>
          ))}

          {/* Twin Push Handles with Orange Grips (Waist Height) */}
          {[-0.28, 0.28].map((hx, idx) => (
            <group key={idx} position={[hx, 0.45, -0.6]} rotation={[0.25, 0, 0]}>
              <mesh>
                <cylinderGeometry args={[0.02, 0.02, 0.6, 6]} />
                <meshStandardMaterial color="#475569" metalness={0.8} />
              </mesh>
              <mesh position={[0, -0.2, 0]}>
                <cylinderGeometry args={[0.028, 0.028, 0.18, 6]} />
                <meshStandardMaterial color="#d97706" roughness={0.6} />
              </mesh>
            </group>
          ))}

          {/* Mounted Shovel on Side of Wheelbarrow during transit */}
          {isWalking && (
            <mesh position={[0.42, 0.42, 0]} rotation={[0.1, 0, 0]}>
              <cylinderGeometry args={[0.018, 0.018, 1.2, 6]} />
              <meshStandardMaterial color="#b45309" />
            </mesh>
          )}

          {/* Dynamic Sand Heap inside Wheelbarrow (Rises with each scoop!) */}
          <mesh position={[0, 0.45 + animState.sandInWheelbarrow * 0.08, 0]}>
            <boxGeometry args={[0.68, 0.15 * animState.sandInWheelbarrow, 0.9]} />
            <meshStandardMaterial color="#d4b895" roughness={0.95} />
          </mesh>

          {/* Sand Cascading Stream when Tipped at Rear Mound */}
          {animState.isRearDumping && (
            <group position={[0, 0.35, 0.6]}>
              <mesh position={[0, -0.3, 0]}>
                <cylinderGeometry args={[0.15, 0.35, 0.65, 8]} />
                <meshStandardMaterial color="#d4b895" transparent opacity={0.85} roughness={0.95} />
              </mesh>
            </group>
          )}
        </group>
      </group>
    </group>
  );
};

// ── 3. STATIONARY MASON / BRICKLAYER BUILDER (Blue Team Site) ──
// Rhythmic, powerful, straight-downward hammer strike onto the foundation chisel block!
export const StationaryMasonBuilder3D: React.FC = () => {
  const [anim, setAnim] = React.useState({
    rightArm: 0.25,
    leftArm: 0.45,
    torsoBend: 0.18,
    headX: 0.35,
    sparkVisible: false,
  });

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const cycle = (t * 0.7) % 1.6; // 1.6s rhythm: windup -> straight downward smack -> impact recoil -> reset

    let rightArm = 0.25;
    let leftArm = 0.45;
    let torsoBend = 0.18;
    let headX = 0.35;
    let sparkVisible = false;

    // Phase A: Wind-up / Raising the Hammer (0.0s - 0.7s)
    if (cycle < 0.7) {
      const p = cycle / 0.7;
      const smoothP = 0.5 - 0.5 * Math.cos(p * Math.PI);
      rightArm = 0.25 - smoothP * 0.70; // Cocks arm backward/upward (-0.45 rad)
      torsoBend = 0.22 - smoothP * 0.12; // Straightens slightly
      headX = 0.32 + smoothP * 0.08; // Eyes locked on chisel
    }
    // Phase B: Powerful Straight Downward Smack (0.7s - 0.95s)
    else if (cycle < 0.95) {
      const p = (cycle - 0.7) / 0.25;
      const powerP = Math.pow(p, 2.2); // Accelerates rapidly down
      rightArm = -0.45 + powerP * 1.28; // Drives down squarely to +0.83 rad
      torsoBend = 0.10 + powerP * 0.28; // Torso hinges forward with body weight
      headX = 0.40 + powerP * 0.08;
      sparkVisible = p > 0.85; // Impact spark triggers at bottom of stroke
    }
    // Phase C: Impact Dwell & Elastic Recoil (0.95s - 1.25s)
    else if (cycle < 1.25) {
      const p = (cycle - 0.95) / 0.30;
      rightArm = 0.83 - Math.sin(p * Math.PI) * 0.24; // Recoils slightly up to +0.59 rad
      torsoBend = 0.38 - p * 0.10;
      sparkVisible = p < 0.25;
    }
    // Phase D: Reset & Settle for Next Strike (1.25s - 1.6s)
    else {
      const p = (cycle - 1.25) / 0.35;
      rightArm = 0.59 - p * 0.34; // Returns to neutral +0.25 rad
      torsoBend = 0.28 - p * 0.06;
      headX = 0.48 - p * 0.16;
    }

    setAnim({ rightArm, leftArm, torsoBend, headX, sparkVisible });
  });

  return (
    <group position={[-5.5, 0, 2.0]} rotation={[0, 2.1, 0]}>
      {/* Mason Humanoid (Blue Team Colors) */}
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

      {/* Foundation Concrete Target Block in Front of Right Hand */}
      <group position={[0.22, 0, 0.55]}>
        {/* Solid Concrete Ashlar Block */}
        <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.55, 0.44, 0.55]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.8} />
        </mesh>

        {/* Steel Chisel Tool Sitting on Top (Target of Hammer Smack) */}
        <group position={[0, 0.46, 0]} rotation={[0, 0, 0.1]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.025, 0.015, 0.16, 6]} />
            <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Chisel Striking Head Cap */}
          <mesh position={[0, 0.08, 0]}>
            <cylinderGeometry args={[0.035, 0.035, 0.03, 6]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.95} />
          </mesh>
        </group>

        {/* Yellow Spirit Level Resting on Side */}
        <mesh position={[-0.18, 0.45, 0.14]} rotation={[0, 0.3, 0]}>
          <boxGeometry args={[0.35, 0.04, 0.04]} />
          <meshStandardMaterial color="#facc15" />
        </mesh>

        {/* Impact Sparks on Hammer Contact */}
        {anim.sparkVisible && (
          <group position={[0, 0.52, 0]}>
            <mesh>
              <sphereGeometry args={[0.16, 8, 8]} />
              <meshBasicMaterial color="#fef08a" />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.15, 0.32, 12]} />
              <meshBasicMaterial color="#fbbf24" transparent opacity={0.8} />
            </mesh>
          </group>
        )}
      </group>

      {/* ── SUPPLY PALLET WITH STACKED BRICKS & MORTAR TUB (BESIDE WORKER) ── */}
      <group position={[-0.9, 0, 0.2]} rotation={[0, 0.3, 0]}>
        <mesh position={[0, 0.06, 0]} castShadow>
          <boxGeometry args={[0.9, 0.12, 0.9]} />
          <meshStandardMaterial color="#92400e" roughness={0.8} />
        </mesh>
        {[0.16, 0.32, 0.48].map((by, bidx) => (
          <mesh key={bidx} position={[0, by, 0]} castShadow>
            <boxGeometry args={[0.7, 0.14, 0.7]} />
            <meshStandardMaterial color="#b91c1c" roughness={0.9} />
          </mesh>
        ))}
        <mesh position={[0.35, 0.62, 0.35]} castShadow>
          <cylinderGeometry args={[0.18, 0.14, 0.16, 10]} />
          <meshStandardMaterial color="#475569" roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
};

// ── 4. GREEN HAMMER GUY NEAR JCB IN THE BACKGROUND ──
// Heavy equipment mechanic: Yellow hat, High-Vis Green vest, smacking hammer straight onto steel maintenance anvil beside the JCB!
export const JCBMaintenanceHammerWorker3D: React.FC = () => {
  const [anim, setAnim] = React.useState({
    rightArm: 0.25,
    leftArm: 0.45,
    torsoBend: 0.18,
    headX: 0.35,
    sparkVisible: false,
  });

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const cycle = (t * 0.75 + 0.4) % 1.6; // Offset cadence from mason

    let rightArm = 0.25;
    let leftArm = 0.45;
    let torsoBend = 0.18;
    let headX = 0.35;
    let sparkVisible = false;

    // Phase A: Windup (0.0s - 0.7s)
    if (cycle < 0.7) {
      const p = cycle / 0.7;
      const smoothP = 0.5 - 0.5 * Math.cos(p * Math.PI);
      rightArm = 0.25 - smoothP * 0.72;
      torsoBend = 0.22 - smoothP * 0.12;
      headX = 0.32 + smoothP * 0.08;
    }
    // Phase B: Power Straight Smack on Anvil (0.7s - 0.95s)
    else if (cycle < 0.95) {
      const p = (cycle - 0.7) / 0.25;
      const powerP = Math.pow(p, 2.2);
      rightArm = -0.47 + powerP * 1.30;
      torsoBend = 0.10 + powerP * 0.28;
      headX = 0.40 + powerP * 0.08;
      sparkVisible = p > 0.85;
    }
    // Phase C: Recoil (0.95s - 1.25s)
    else if (cycle < 1.25) {
      const p = (cycle - 0.95) / 0.30;
      rightArm = 0.83 - Math.sin(p * Math.PI) * 0.24;
      torsoBend = 0.38 - p * 0.10;
      sparkVisible = p < 0.25;
    }
    // Phase D: Reset (1.25s - 1.6s)
    else {
      const p = (cycle - 1.25) / 0.35;
      rightArm = 0.59 - p * 0.34;
      torsoBend = 0.28 - p * 0.06;
      headX = 0.48 - p * 0.16;
    }

    setAnim({ rightArm, leftArm, torsoBend, headX, sparkVisible });
  });

  return (
    <group position={[2.8, 0, -11.5]} rotation={[0, -1.9, 0]}>
      {/* Mechanic Humanoid (Yellow Hat, Safety Lime Green Vest, Heavy Work Pants) */}
      <HumanoidWorkerBody
        hatColor="#facc15"
        vestColor="#84cc16"
        pantsColor="#334155"
        torsoBend={anim.torsoBend}
        headRotX={anim.headX}
        rightArmAngle={anim.rightArm}
        leftArmAngle={anim.leftArm}
        toolHeld="hammer"
      />

      {/* Heavy Industrial Cast-Iron Anvil on Oak Stand in Front of Mechanic */}
      <group position={[0.22, 0, 0.55]}>
        {/* Oak Log Anvil Block */}
        <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.28, 0.32, 0.4, 10]} />
          <meshStandardMaterial color="#78350f" roughness={0.9} />
        </mesh>
        {/* Steel Retaining Band */}
        <mesh position={[0, 0.32, 0]}>
          <cylinderGeometry args={[0.29, 0.29, 0.06, 10]} />
          <meshStandardMaterial color="#475569" metalness={0.8} />
        </mesh>

        {/* Cast Iron Anvil Body */}
        <group position={[0, 0.45, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.38, 0.14, 0.22]} />
            <meshStandardMaterial color="#1e293b" metalness={0.92} roughness={0.25} />
          </mesh>
          {/* Anvil Horn (Pointed Front) */}
          <mesh position={[0.26, 0.02, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow>
            <coneGeometry args={[0.09, 0.24, 8]} />
            <meshStandardMaterial color="#1e293b" metalness={0.92} roughness={0.25} />
          </mesh>
          {/* Flat Machined Striking Face Plate */}
          <mesh position={[0, 0.075, 0]}>
            <boxGeometry args={[0.34, 0.02, 0.2]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.98} roughness={0.1} />
          </mesh>
          {/* Glowing Hot Steel Pin / Bracket Being Forged */}
          <mesh position={[0.04, 0.09, 0]}>
            <boxGeometry args={[0.16, 0.025, 0.08]} />
            <meshStandardMaterial color="#f97316" emissive="#ea580c" emissiveIntensity={0.6} />
          </mesh>
        </group>

        {/* Impact Sparks Burst on Anvil */}
        {anim.sparkVisible && (
          <group position={[0.04, 0.56, 0]}>
            <mesh>
              <sphereGeometry args={[0.18, 8, 8]} />
              <meshBasicMaterial color="#fef08a" />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.15, 0.38, 12]} />
              <meshBasicMaterial color="#f97316" transparent opacity={0.85} />
            </mesh>
          </group>
        )}
      </group>

      {/* Heavy Steel Toolbox beside Anvil */}
      <group position={[-0.65, 0, 0.2]} rotation={[0, 0.4, 0]}>
        <mesh position={[0, 0.12, 0]} castShadow>
          <boxGeometry args={[0.5, 0.24, 0.3]} />
          <meshStandardMaterial color="#dc2626" roughness={0.5} metalness={0.4} />
        </mesh>
        <mesh position={[0, 0.25, 0]}>
          <boxGeometry args={[0.18, 0.03, 0.04]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
      </group>
    </group>
  );
};

// ── 5. STATIONARY STRUCTURAL SITE INSPECTOR (Red Team Site) ──
// Works logically in-place at Red foundation inspecting tolerances with laser tool & blueprints stand!
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
      {/* Inspector Humanoid (Red Team Gear) */}
      <HumanoidWorkerBody
        hatColor="#dc2626"
        vestColor="#ef4444"
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

// ── 6. COMPLETE REALISTIC 3D CONSTRUCTION CREW ──
export const ConstructionCrew3D: React.FC = () => {
  return (
    <group>
      {/* 🚜 1. SAND SHOVELER & WHEELBARROW TRANSPORT WORKER (Two-handed shovel -> Wheelbarrow -> Rear dump -> Return) */}
      <SandHaulerWorkerWithWheelbarrow3D />

      {/* 🧱 2. BLUE SITE BRICKLAYER / MASON (In-place at foundation with brick pallet & hammer) */}
      <StationaryMasonBuilder3D />

      {/* 🚜 3. GREEN HAMMER GUY NEAR JCB IN THE BACKGROUND (Maintenance anvil & hammer smacks beside JCB) */}
      <JCBMaintenanceHammerWorker3D />

      {/* 📐 4. RED SITE STRUCTURAL INSPECTOR (In-place at foundation with laser & blueprints stand) */}
      <StationarySiteInspector3D />

      {/* 🔭 5. CENTRAL CHIEF SURVEYOR (Operating Theodolite Tripod on Central Pedestal) */}
      <group position={[-0.7, 0, -2.8]} rotation={[0, 0.15, 0]}>
        <HumanoidWorkerBody
          hatColor="#ffffff"
          vestColor="#ea580c"
          pantsColor="#334155"
          toolHeld="clipboard"
        />
      </group>

      {/* 🚦 6. SIGNALMAN (Directing Traffic on Left Haul Road) */}
      <group position={[-12.2, 0, 3.8]} rotation={[0, 1.6, 0]}>
        <HumanoidWorkerBody
          hatColor="#facc15"
          vestColor="#ea580c"
          pantsColor="#334155"
          toolHeld="baton"
        />
      </group>

      {/* 🚦 7. TRAFFIC SAFETY FLAGMAN (Directing Trucks on Right Haul Road) */}
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
