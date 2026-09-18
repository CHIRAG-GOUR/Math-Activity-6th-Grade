// ============================================================
// PARK PLANNER — High-Graphics 3D Playground Equipment (Quadrant I)
// Timber swings with swinging children, adventure slide tower, geodesic climbing dome,
// seesaw, coiled spring rider, realistic 3D pond, rubber safety turf, fences, parent benches,
// and believable active children & parents locomotion.
// ============================================================

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { StylizedHuman3D } from './ParkCharacters3D';
import { ParkBench3D, ShadyTree3D } from './ParkPicnicGrove3D';
import { ConstructionWorker3D, ConstructionCart3D } from './ParkWorkers3D';

// ------------------------------------------------------------
// 1. DUAL TIMBER SWING SET WITH ACTIVE SWINGING CHILD
// ------------------------------------------------------------
export const SwingSet3D: React.FC<{
  position?: [number, number, number];
  rotationY?: number;
  hasActiveChild?: boolean;
}> = ({ position = [0, 0, 0], rotationY = 0, hasActiveChild = true }) => {
  const seat1Ref = useRef<THREE.Group>(null);
  const seat2Ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (seat1Ref.current) {
      seat1Ref.current.rotation.x = Math.sin(t * 2.4) * 0.45;
    }
    if (seat2Ref.current) {
      seat2Ref.current.rotation.x = Math.sin(t * 2.4 + 1.2) * 0.4;
    }
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Rubberized Safety Mulch Turf */}
      <mesh receiveShadow position={[0, 0.02, 0]}>
        <boxGeometry args={[3.6, 0.04, 2.8]} />
        <meshStandardMaterial color="#854d0e" roughness={0.9} />
      </mesh>
      {/* Timber Edging Curbs */}
      <mesh position={[0, 0.05, 1.4]}>
        <boxGeometry args={[3.7, 0.08, 0.12]} />
        <meshStandardMaterial color="#5c3a21" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.05, -1.4]}>
        <boxGeometry args={[3.7, 0.08, 0.12]} />
        <meshStandardMaterial color="#5c3a21" roughness={0.7} />
      </mesh>

      {/* Left A-Frame Post */}
      <group position={[-1.4, 0, 0]}>
        <mesh castShadow position={[0, 1.15, 0.42]} rotation={[0.2, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.08, 2.4, 8]} />
          <meshStandardMaterial color="#78350f" roughness={0.7} />
        </mesh>
        <mesh castShadow position={[0, 1.15, -0.42]} rotation={[-0.2, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.08, 2.4, 8]} />
          <meshStandardMaterial color="#78350f" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.7, 6]} />
          <meshStandardMaterial color="#78350f" />
        </mesh>
      </group>

      {/* Right A-Frame Post */}
      <group position={[1.4, 0, 0]}>
        <mesh castShadow position={[0, 1.15, 0.42]} rotation={[0.2, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.08, 2.4, 8]} />
          <meshStandardMaterial color="#78350f" roughness={0.7} />
        </mesh>
        <mesh castShadow position={[0, 1.15, -0.42]} rotation={[-0.2, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.08, 2.4, 8]} />
          <meshStandardMaterial color="#78350f" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.7, 6]} />
          <meshStandardMaterial color="#78350f" />
        </mesh>
      </group>

      {/* Top Heavy Steel Crossbar */}
      <mesh castShadow position={[0, 2.3, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, 3.1, 12]} />
        <meshStandardMaterial color="#0284c7" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Swing Seat 1 (Active Child) */}
      <group position={[-0.68, 2.25, 0]} ref={seat1Ref}>
        <mesh position={[-0.22, -0.9, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 1.8, 6]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} />
        </mesh>
        <mesh position={[0.22, -0.9, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 1.8, 6]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} />
        </mesh>
        <mesh castShadow position={[0, -1.8, 0]}>
          <boxGeometry args={[0.5, 0.05, 0.24]} />
          <meshStandardMaterial color="#0284c7" roughness={0.4} />
        </mesh>
        {hasActiveChild && (
          <group position={[0, -1.8, 0]}>
            <StylizedHuman3D
              position={[0, 0, 0]}
              scale={0.58}
              shirtColor="#f59e0b"
              pantsColor="#1e3a8a"
              isWalking={false}
              isSeated={true}
            />
          </group>
        )}
      </group>

      {/* Swing Seat 2 */}
      <group position={[0.68, 2.25, 0]} ref={seat2Ref}>
        <mesh position={[-0.22, -0.9, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 1.8, 6]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} />
        </mesh>
        <mesh position={[0.22, -0.9, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 1.8, 6]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} />
        </mesh>
        <mesh castShadow position={[0, -1.8, 0]}>
          <boxGeometry args={[0.5, 0.05, 0.24]} />
          <meshStandardMaterial color="#e11d48" roughness={0.4} />
        </mesh>
        {hasActiveChild && (
          <group position={[0, -1.8, 0]}>
            <StylizedHuman3D
              position={[0, 0, 0]}
              scale={0.56}
              shirtColor="#10b981"
              pantsColor="#475569"
              isWalking={false}
              isSeated={true}
            />
          </group>
        )}
      </group>
    </group>
  );
};

// ------------------------------------------------------------
// ------------------------------------------------------------
// 2. ADVENTURE SLIDE TOWER WITH REALISTIC ANIMATED CHILD
// Slide is positioned on the exact OPPOSITE side of the ladder (North vs South).
// The climbing child ascends the ladder, pauses/stops at the top, sits down,
// slides down smoothly, pauses at the bottom, and walks back.
// ------------------------------------------------------------
export const SlideTower3D: React.FC<{
  position?: [number, number, number];
  rotationY?: number;
  hasActiveChild?: boolean;
}> = ({ position = [0, 0, 0], rotationY = 0, hasActiveChild = true }) => {
  const childGroupRef = useRef<THREE.Group>(null);
  const childLeftLegRef = useRef<THREE.Group>(null);
  const childRightLegRef = useRef<THREE.Group>(null);
  const childLeftArmRef = useRef<THREE.Group>(null);
  const childRightArmRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!childGroupRef.current) return;
    const totalDuration = 7.0; // 7-second complete cycle
    const t = (state.clock.getElapsedTime() * 0.9) % totalDuration;

    let posX = 0;
    let posY = 0.02;
    let posZ = 0;
    let rotX = 0;
    let rotY = 0;
    let rotZ = 0;
    let legSwing = 0;
    let isSeatedPose = false;

    if (t < 2.2) {
      // ── Phase 1: Climbing up the ladder (South side) ──
      const climbProg = t / 2.2;
      posX = 0;
      posY = 0.05 + climbProg * 1.85;
      posZ = 1.15 - climbProg * 0.4;
      rotY = Math.PI; // Facing ladder / South
      rotX = -0.15; // Leaning into ladder rungs
      legSwing = Math.sin(climbProg * Math.PI * 8) * 0.45;
    } else if (t < 3.4) {
      // ── Phase 2: Reached top platform & STOPPED (Prepares to slide) ──
      const platProg = Math.min(1, (t - 2.2) / 0.8);
      posX = 0;
      posY = 1.95;
      posZ = 0.75 - platProg * 1.5; // Walk forward across platform to slide lip (-0.75)
      rotY = 0; // Facing North towards slide
      rotX = 0;
      // When reached slide lip (platProg > 0.8), STOP WALKING and sit down!
      if (platProg > 0.7) {
        legSwing = 0; // STOPPED COMPLETELY
        isSeatedPose = true;
        posY = 1.88;
      } else {
        legSwing = Math.sin(platProg * Math.PI * 4) * 0.35;
      }
    } else if (t < 4.6) {
      // ── Phase 3: Sliding down the chute (North side) ──
      const slideProg = (t - 3.4) / 1.2;
      posX = 0;
      posY = 1.88 - slideProg * 1.82; // Glide from Y=1.88 down to Y=0.06
      posZ = -0.75 - slideProg * 2.3; // Glide from Z=-0.75 down to Z=-3.05
      rotX = -0.45; // Tilted back sliding posture
      rotY = 0; // Facing North down slide
      legSwing = 0; // Legs extend forward, NOT walking!
      isSeatedPose = true;
    } else if (t < 5.6) {
      // ── Phase 4: Landed at bottom & STOPPED (Celebration pause) ──
      posX = 0;
      posY = 0.02;
      posZ = -3.1;
      rotY = 0.3;
      rotX = 0;
      legSwing = 0; // STOPPED COMPLETELY (standing happily)
      isSeatedPose = false;
    } else {
      // ── Phase 5: Walking back around to the ladder ──
      const walkProg = (t - 5.6) / 1.4;
      if (walkProg < 0.3) {
        // Step out to the side
        posX = (walkProg / 0.3) * 1.15;
        posY = 0.02;
        posZ = -3.1 + (walkProg / 0.3) * 0.5;
        rotY = Math.PI * 0.7;
      } else if (walkProg < 0.85) {
        // Walk along side of playhouse
        const sideProg = (walkProg - 0.3) / 0.55;
        posX = 1.15;
        posY = 0.02;
        posZ = -2.6 + sideProg * 3.4;
        rotY = Math.PI;
      } else {
        // Turn back in towards ladder
        const turnProg = (walkProg - 0.85) / 0.15;
        posX = 1.15 * (1 - turnProg);
        posY = 0.02;
        posZ = 0.8 + turnProg * 0.35;
        rotY = Math.PI * 0.75;
      }
      legSwing = Math.sin(walkProg * Math.PI * 10) * 0.45;
      isSeatedPose = false;
    }

    childGroupRef.current.position.set(posX, posY, posZ);
    childGroupRef.current.rotation.set(rotX, rotY, rotZ);

    if (isSeatedPose) {
      if (childLeftLegRef.current) childLeftLegRef.current.rotation.set(-1.3, 0, 0);
      if (childRightLegRef.current) childRightLegRef.current.rotation.set(-1.3, 0, 0);
      if (childLeftArmRef.current) childLeftArmRef.current.rotation.set(-0.8, 0, -0.3);
      if (childRightArmRef.current) childRightArmRef.current.rotation.set(-0.8, 0, 0.3);
    } else {
      if (childLeftLegRef.current) childLeftLegRef.current.rotation.set(legSwing, 0, 0);
      if (childRightLegRef.current) childRightLegRef.current.rotation.set(-legSwing, 0, 0);
      if (childLeftArmRef.current) childLeftArmRef.current.rotation.set(-legSwing * 0.7, 0, 0);
      if (childRightArmRef.current) childRightArmRef.current.rotation.set(legSwing * 0.7, 0, 0);
    }
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Platform Heavy Timber Posts */}
      {[-0.65, 0.65].map((x, i) =>
        [-0.65, 0.65].map((z, j) => (
          <mesh key={`post_${i}_${j}`} castShadow position={[x, 0.95, z]}>
            <cylinderGeometry args={[0.07, 0.07, 1.9, 8]} />
            <meshStandardMaterial color="#78350f" roughness={0.7} />
          </mesh>
        ))
      )}

      {/* Timber Floor Platform (Elevated at Y = 1.9m) */}
      <mesh castShadow receiveShadow position={[0, 1.9, 0]}>
        <boxGeometry args={[1.5, 0.08, 1.5]} />
        <meshStandardMaterial color="#b45309" roughness={0.6} />
      </mesh>

      {/* Side Safety Railings (West & East Walls) */}
      <mesh position={[-0.72, 2.25, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[1.44, 0.65, 0.05]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.3} roughness={0.4} />
      </mesh>
      <mesh position={[0.72, 2.25, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[1.44, 0.65, 0.05]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.3} roughness={0.4} />
      </mesh>

      {/* ── 1. ACCESS LADDER (SOUTH SIDE: Z = +0.75m) ── */}
      <group position={[0, 0.95, 0.75]} rotation={[0.2, 0, 0]}>
        <mesh position={[-0.32, 0, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 2.0, 8]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>
        <mesh position={[0.32, 0, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 2.0, 8]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>
        {[-0.65, -0.25, 0.15, 0.55].map((y, idx) => (
          <mesh key={`ladder_step_${idx}`} position={[0, y, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.022, 0.022, 0.62, 8]} />
            <meshStandardMaterial color="#facc15" />
          </mesh>
        ))}
      </group>

      {/* ── 2. SLIDE CHUTE (NORTH SIDE: OPPOSITE OF LADDER, Z = -0.75m to -3.1m) ── */}
      <group position={[0, 0, 0]}>
        {/* Chute Arch Entrance at North Platform Lip */}
        <mesh position={[0, 2.22, -0.75]}>
          <torusGeometry args={[0.36, 0.04, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>

        {/* Slide Chute Bed: Smooth straight downward slope directly opposite ladder */}
        <mesh castShadow position={[0, 0.98, -1.9]} rotation={[0.66, 0, 0]}>
          <boxGeometry args={[0.68, 0.06, 2.65]} />
          <meshStandardMaterial color="#0284c7" roughness={0.25} metalness={0.15} />
        </mesh>

        {/* Left & Right Raised Chute Safety Guardrails */}
        <mesh position={[-0.34, 1.05, -1.9]} rotation={[0.66, 0, 0]}>
          <boxGeometry args={[0.05, 0.22, 2.65]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.3} />
        </mesh>
        <mesh position={[0.34, 1.05, -1.9]} rotation={[0.66, 0, 0]}>
          <boxGeometry args={[0.05, 0.22, 2.65]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.3} />
        </mesh>

        {/* Soft Level Exit Ramp at Bottom (Z = -3.1m) */}
        <mesh position={[0, 0.05, -3.1]}>
          <boxGeometry args={[0.68, 0.05, 0.65]} />
          <meshStandardMaterial color="#0284c7" roughness={0.3} />
        </mesh>

        {/* Structural Steel Support Legs under Slide Bed */}
        <mesh position={[-0.32, 0.5, -1.9]}>
          <cylinderGeometry args={[0.03, 0.03, 1.0, 8]} />
          <meshStandardMaterial color="#78350f" />
        </mesh>
        <mesh position={[0.32, 0.5, -1.9]}>
          <cylinderGeometry args={[0.03, 0.03, 1.0, 8]} />
          <meshStandardMaterial color="#78350f" />
        </mesh>
      </group>

      {/* Pyramid Shingled Play Tower Roof */}
      <mesh castShadow position={[0, 2.9, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[1.3, 0.8, 4]} />
        <meshStandardMaterial color="#ef4444" roughness={0.5} />
      </mesh>

      {/* ── 3. REALISTIC ACTIVE SLIDING CHILD ── */}
      {hasActiveChild && (
        <group ref={childGroupRef} position={[0, 0.05, 1.15]} scale={0.54}>
          {/* Torso & Head */}
          <mesh castShadow position={[0, 0.62, 0]}>
            <boxGeometry args={[0.32, 0.42, 0.2]} />
            <meshStandardMaterial color="#ec4899" />
          </mesh>
          <mesh castShadow position={[0, 0.98, 0]}>
            <sphereGeometry args={[0.13, 10, 10]} />
            <meshStandardMaterial color="#fcd34d" />
          </mesh>
          {/* Hair */}
          <mesh position={[0, 1.05, 0]}>
            <sphereGeometry args={[0.135, 8, 8, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
            <meshStandardMaterial color="#451a03" />
          </mesh>
          {/* Limbs with Dedicated Animated Refs */}
          <group ref={childLeftLegRef} position={[-0.09, 0.38, 0]}>
            <mesh position={[0, -0.2, 0]}>
              <cylinderGeometry args={[0.045, 0.045, 0.4, 6]} />
              <meshStandardMaterial color="#1e3a8a" />
            </mesh>
          </group>
          <group ref={childRightLegRef} position={[0.09, 0.38, 0]}>
            <mesh position={[0, -0.2, 0]}>
              <cylinderGeometry args={[0.045, 0.045, 0.4, 6]} />
              <meshStandardMaterial color="#1e3a8a" />
            </mesh>
          </group>
          <group ref={childLeftArmRef} position={[-0.2, 0.75, 0]}>
            <mesh position={[0, -0.16, 0]}>
              <cylinderGeometry args={[0.035, 0.035, 0.34, 6]} />
              <meshStandardMaterial color="#ec4899" />
            </mesh>
          </group>
          <group ref={childRightArmRef} position={[0.2, 0.75, 0]}>
            <mesh position={[0, -0.16, 0]}>
              <cylinderGeometry args={[0.035, 0.035, 0.34, 6]} />
              <meshStandardMaterial color="#ec4899" />
            </mesh>
          </group>
        </group>
      )}
    </group>
  );
};

// ------------------------------------------------------------
// 3. GEODESIC CLIMBING DOME WITH CLIMBING CHILD
// ------------------------------------------------------------
export const ClimbingDome3D: React.FC<{
  position?: [number, number, number];
  hasActiveChild?: boolean;
}> = ({ position = [0, 0, 0], hasActiveChild = true }) => {
  return (
    <group position={position}>
      {/* Base Anchor Ring */}
      <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.15, 1.25, 16]} />
        <meshStandardMaterial color="#0284c7" roughness={0.4} />
      </mesh>
      {/* Geodesic Dome Steel Struts */}
      <mesh castShadow position={[0, 0.85, 0]}>
        <sphereGeometry args={[1.2, 10, 6, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial
          color="#f59e0b"
          metalness={0.6}
          roughness={0.3}
          wireframe
          wireframeLinewidth={2}
        />
      </mesh>
      {/* Colorful Climbing Node Grips */}
      {[-0.8, 0, 0.8].map((x, i) =>
        [-0.8, 0, 0.8].map((z, j) => (
          <mesh key={`climb_grip_${i}_${j}`} position={[x * 0.92, 0.8 + ((i + j) % 3) * 0.15, z * 0.92]}>
            <sphereGeometry args={[0.075, 6, 6]} />
            <meshStandardMaterial color={i % 2 === 0 ? '#ef4444' : '#10b981'} roughness={0.4} />
          </mesh>
        ))
      )}
      {/* Active Child climbing on top */}
      {hasActiveChild && (
        <group position={[0.2, 1.05, 0.4]} rotation={[0.4, 0, 0]}>
          <StylizedHuman3D
            scale={0.55}
            shirtColor="#0284c7"
            pantsColor="#f59e0b"
            isWalking={false}
            isSeated={true}
          />
        </group>
      )}
    </group>
  );
};

// ------------------------------------------------------------
// 4. BALANCED SEESAW WITH 2 SEATED CHILDREN
// ------------------------------------------------------------
export const Seesaw3D: React.FC<{
  position?: [number, number, number];
  rotationY?: number;
  hasActiveChildren?: boolean;
}> = ({ position = [0, 0, 0], rotationY = 0, hasActiveChildren = true }) => {
  const plankRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (plankRef.current) {
      plankRef.current.rotation.z = Math.sin(t * 1.8) * 0.24;
    }
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Heavy Steel Fulcrum Base */}
      <mesh castShadow position={[0, 0.32, 0]}>
        <cylinderGeometry args={[0.09, 0.32, 0.65, 4]} />
        <meshStandardMaterial color="#1e293b" metalness={0.7} />
      </mesh>
      <mesh position={[0, 0.58, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 0.32, 8]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.8} />
      </mesh>

      {/* Balanced Seesaw Plank & Seats */}
      <group position={[0, 0.58, 0]} ref={plankRef}>
        <mesh castShadow position={[0, 0.04, 0]}>
          <boxGeometry args={[2.5, 0.08, 0.3]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.5} />
        </mesh>
        {/* Left Seat */}
        <mesh position={[-1.05, 0.12, 0]}>
          <boxGeometry args={[0.34, 0.06, 0.32]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>
        <mesh position={[-0.85, 0.25, 0]}>
          <torusGeometry args={[0.1, 0.02, 6, 12, Math.PI]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
        {hasActiveChildren && (
          <group position={[-1.05, 0.12, 0]}>
            <StylizedHuman3D
              scale={0.52}
              shirtColor="#8b5cf6"
              pantsColor="#0f172a"
              isWalking={false}
              isSeated={true}
            />
          </group>
        )}

        {/* Right Seat */}
        <mesh position={[1.05, 0.12, 0]}>
          <boxGeometry args={[0.34, 0.06, 0.32]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
        <mesh position={[0.85, 0.25, 0]}>
          <torusGeometry args={[0.1, 0.02, 6, 12, Math.PI]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>
        {hasActiveChildren && (
          <group position={[1.05, 0.12, 0]}>
            <StylizedHuman3D
              scale={0.52}
              shirtColor="#10b981"
              pantsColor="#1e3a8a"
              isWalking={false}
              isSeated={true}
            />
          </group>
        )}
      </group>
    </group>
  );
};

// ------------------------------------------------------------
// 5. SPRING RIDER / ANIMAL ROCKER WITH CHILD
// ------------------------------------------------------------
export const SpringRider3D: React.FC<{
  position?: [number, number, number];
  rotationY?: number;
  hasActiveChild?: boolean;
}> = ({ position = [0, 0, 0], rotationY = 0, hasActiveChild = true }) => {
  const rockerRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (rockerRef.current) {
      rockerRef.current.rotation.z = Math.sin(t * 3.2) * 0.18;
      rockerRef.current.rotation.x = Math.cos(t * 2.8) * 0.1;
    }
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Ground Anchor Plate */}
      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.35, 0.38, 0.06, 12]} />
        <meshStandardMaterial color="#334155" roughness={0.7} />
      </mesh>

      {/* Heavy Coiled Steel Spring */}
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.14, 0.14, 0.58, 12, 8, true]} />
        <meshStandardMaterial color="#0284c7" metalness={0.8} roughness={0.2} wireframe wireframeLinewidth={2} />
      </mesh>

      {/* Animated Rocker Animal Body */}
      <group position={[0, 0.65, 0]} ref={rockerRef}>
        {/* Horse/Pony Saddle Body */}
        <mesh castShadow position={[0, 0.15, 0]}>
          <boxGeometry args={[0.75, 0.35, 0.28]} />
          <meshStandardMaterial color="#e11d48" roughness={0.4} />
        </mesh>
        {/* Pony Head & Ears */}
        <mesh castShadow position={[0.38, 0.42, 0]} rotation={[0, 0, -0.3]}>
          <boxGeometry args={[0.32, 0.45, 0.24]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.4} />
        </mesh>
        {/* Handlebars */}
        <mesh position={[0.26, 0.52, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.42, 8]} />
          <meshStandardMaterial color="#0f172a" metalness={0.7} />
        </mesh>
        {/* Footpegs */}
        <mesh position={[0.05, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.38, 8]} />
          <meshStandardMaterial color="#0f172a" metalness={0.7} />
        </mesh>

        {/* Riding Child */}
        {hasActiveChild && (
          <group position={[0, 0.25, 0]}>
            <StylizedHuman3D
              scale={0.52}
              shirtColor="#06b6d4"
              pantsColor="#475569"
              isWalking={false}
              isSeated={true}
            />
          </group>
        )}
      </group>
    </group>
  );
};

// ------------------------------------------------------------
// 6. 3D PLAYGROUND POND (Sized compactly so it never spills onto walkways)
// ------------------------------------------------------------
export const PlaygroundPond3D: React.FC<{
  position?: [number, number, number];
}> = ({ position = [0, 0, 0] }) => {
  const rippleRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (rippleRef.current) {
      const s = 1 + ((t * 1.2) % 1) * 0.3;
      rippleRef.current.scale.set(s, 1, s);
      (rippleRef.current.material as THREE.MeshStandardMaterial).opacity = 0.6 * (1 - ((t * 1.2) % 1));
    }
  });

  return (
    <group position={position}>
      {/* Sandy/Pebble Shoreline Base (Radius 1.45m) */}
      <mesh receiveShadow position={[0, 0.02, 0]}>
        <cylinderGeometry args={[1.35, 1.45, 0.04, 16]} />
        <meshStandardMaterial color="#d4a373" roughness={0.9} />
      </mesh>

      {/* Natural Shoreline River Boulders */}
      {Array.from({ length: 14 }).map((_, i) => {
        const angle = (i * Math.PI * 2) / 14;
        const r = 1.25 + ((i % 3) * 0.08 - 0.04);
        const x = Math.cos(angle) * r;
        const z = Math.sin(angle) * r;
        const s = 0.22 + (i % 3) * 0.04;
        return (
          <mesh key={`pond_rock_${i}`} castShadow position={[x, 0.1, z]} scale={[s, s * 0.7, s]}>
            <dodecahedronGeometry args={[0.7, 0]} />
            <meshStandardMaterial color="#64748b" roughness={0.9} />
          </mesh>
        );
      })}

      {/* Radiant Clear Azure Water Layer (Radius 1.2m) */}
      <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.2, 20]} />
        <meshStandardMaterial color="#0284c7" roughness={0.04} metalness={0.4} transparent opacity={0.88} />
      </mesh>

      {/* Animated Ripple */}
      <mesh ref={rippleRef} position={[0, 0.07, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.35, 0.55, 16]} />
        <meshStandardMaterial color="#bae6fd" transparent opacity={0.5} />
      </mesh>

      {/* Water Lilies */}
      {[
        { x: -0.45, z: 0.35 },
        { x: 0.5, z: -0.3 },
      ].map((pos, idx) => (
        <group key={`pond_lily_${idx}`} position={[pos.x, 0.075, pos.z]}>
          <mesh rotation={[-Math.PI / 2, 0, idx * 1.8]}>
            <circleGeometry args={[0.18, 10, 0, Math.PI * 1.8]} />
            <meshStandardMaterial color="#22c55e" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.035, 0]}>
            <sphereGeometry args={[0.05, 6, 6]} />
            <meshStandardMaterial color="#f472b6" />
          </mesh>
        </group>
      ))}

      {/* Scenic Timber Bench Beside the Playground Pond */}
      <group position={[-0.2, 0, -1.75]} rotation={[0, Math.PI, 0]}>
        <ParkBench3D position={[0, 0, 0]} rotationY={0} hasVisitor={false} />
        <group position={[0, 0.1, 0]}>
          <StylizedHuman3D
            scale={0.82}
            shirtColor="#059669"
            pantsColor="#1e3a8a"
            isWalking={false}
            isSeated={true}
          />
        </group>
      </group>
    </group>
  );
};

// ------------------------------------------------------------
// 7. COMPLETE QUADRANT I PLAYGROUND ASSEMBLY WITH PROGRESSIVE BUILD
// ------------------------------------------------------------
export const FullQuadrant1Playground3D: React.FC<{
  progress: number; // 0 to 1
  isBuilding: boolean;
  isBuilt: boolean;
}> = ({ progress, isBuilding, isBuilt }) => {
  if (!isBuilding && !isBuilt) {
    return (
      <group position={[6, 0, -6]}>
        <mesh receiveShadow position={[0, 0.01, 0]}>
          <boxGeometry args={[9.5, 0.02, 9.5]} />
          <meshStandardMaterial color="#3f6212" roughness={0.9} opacity={0.6} transparent />
        </mesh>
        {[-4, 4].map((x, i) =>
          [-4, 4].map((z, j) => (
            <mesh key={`stake_${i}_${j}`} position={[x, 0.2, z]}>
              <cylinderGeometry args={[0.03, 0.03, 0.4, 6]} />
              <meshStandardMaterial color="#f59e0b" />
            </mesh>
          ))
        )}
      </group>
    );
  }

  const stageScale = isBuilt ? 1 : Math.min(1, 0.1 + progress * 0.9);
  const showEarlyStructures = progress > 0.15 || isBuilt;
  const showLateStructures = progress > 0.45 || isBuilt;
  const showLandscaping = progress > 0.75 || isBuilt;
  const showActiveChildren = progress > 0.9 || isBuilt;

  return (
    <group position={[6, 0, -6]}>
      {/* 1. Large Rubber Safety Flooring Plaza */}
      <mesh receiveShadow position={[0, 0.02, 0]}>
        <boxGeometry args={[9.4, 0.04, 9.4]} />
        <meshStandardMaterial color="#15803d" roughness={0.85} />
      </mesh>
      {/* Rubber Tile Section */}
      <mesh receiveShadow position={[-0.5, 0.03, 0.5]}>
        <boxGeometry args={[6.8, 0.02, 6.8]} />
        <meshStandardMaterial color="#047857" roughness={0.8} />
      </mesh>

      {/* 2. Construction Workers Active during Building Phase */}
      {isBuilding && progress < 0.95 && (
        <group>
          <ConstructionWorker3D
            position={[-1.5 + Math.sin(progress * 10) * 1.5, 0, -1.5]}
            isConstructing={true}
          />
          <ConstructionWorker3D
            position={[1.5, 0, 1.5 + Math.cos(progress * 10) * 1.2]}
            isConstructing={true}
          />
          <ConstructionCart3D position={[3.2, 0, -3.2]} rotationY={-Math.PI / 4} />
        </group>
      )}

      {/* 3. Main Playground Activities */}
      {showEarlyStructures && (
        <group scale={[stageScale, stageScale, stageScale]}>
          {/* Swings */}
          <SwingSet3D position={[-2.2, 0, -1.8]} rotationY={0} hasActiveChild={showActiveChildren} />
          {/* Large Slide Tower: Positioned with ladder at South (+Z) and slide extending North (-Z) */}
          <SlideTower3D position={[2.2, 0, 0.8]} rotationY={0} hasActiveChild={showActiveChildren} />
        </group>
      )}

      {showLateStructures && (
        <group scale={[stageScale, stageScale, stageScale]}>
          {/* Seesaw */}
          <Seesaw3D position={[-2.2, 0, 1.8]} rotationY={0.3} hasActiveChildren={showActiveChildren} />
          {/* Climbing Dome */}
          <ClimbingDome3D position={[1.8, 0, -2.4]} hasActiveChild={showActiveChildren} />
          {/* Spring Rider */}
          <SpringRider3D position={[0, 0, 0.2]} rotationY={0.5} hasActiveChild={showActiveChildren} />
        </group>
      )}

      {/* 4. Natural 3D Pond, Landscaping & Parent Benches (Centered in grass away from paths) */}
      {showLandscaping && (
        <group scale={[stageScale, stageScale, stageScale]}>
          {/* Beautiful Pond (compact and centered in lawn) */}
          <PlaygroundPond3D position={[2.2, 0, 2.4]} />
          {/* Parent Viewing Benches */}
          <ParkBench3D position={[0, 0, -3.8]} rotationY={0} hasVisitor={showActiveChildren} />
          <ParkBench3D position={[-3.8, 0, 0]} rotationY={Math.PI / 2} hasVisitor={showActiveChildren} />
          {/* Low Decorative Safety Fences */}
          {[-4.2, 4.2].map((x, i) => (
            <mesh key={`play_fence_x_${i}`} position={[x, 0.2, 0]}>
              <boxGeometry args={[0.08, 0.4, 8.4]} />
              <meshStandardMaterial color="#f59e0b" roughness={0.5} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
};
