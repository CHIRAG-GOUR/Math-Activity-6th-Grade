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
// 2. ADVENTURE SPIRAL SLIDE TOWER WITH SLIDING CHILD
// ------------------------------------------------------------
export const SlideTower3D: React.FC<{
  position?: [number, number, number];
  rotationY?: number;
  hasActiveChild?: boolean;
}> = ({ position = [0, 0, 0], rotationY = 0, hasActiveChild = true }) => {
  const slidingChildRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = (state.clock.getElapsedTime() * 0.6) % 3.0; // 3 sec loop
    if (slidingChildRef.current) {
      if (t < 1.4) {
        // Climbing ladder
        const climbT = t / 1.4;
        slidingChildRef.current.position.set(0, 0.1 + climbT * 1.8, 0.75 - climbT * 0.4);
        slidingChildRef.current.rotation.set(0, Math.PI, 0);
      } else if (t < 2.5) {
        // Sliding down spiral chute
        const slideT = (t - 1.4) / 1.1;
        slidingChildRef.current.position.set(
          0.7 + slideT * 1.05,
          1.85 - slideT * 1.5,
          0
        );
        slidingChildRef.current.rotation.set(0, -Math.PI / 2, 0);
      } else {
        // Walking back around
        const walkT = (t - 2.5) / 0.5;
        slidingChildRef.current.position.set(1.75 - walkT * 1.75, 0.02, walkT * 0.75);
        slidingChildRef.current.rotation.set(0, Math.PI / 2, 0);
      }
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

      {/* Timber Floor Platform */}
      <mesh castShadow receiveShadow position={[0, 1.9, 0]}>
        <boxGeometry args={[1.5, 0.08, 1.5]} />
        <meshStandardMaterial color="#b45309" roughness={0.6} />
      </mesh>

      {/* Safety Railings */}
      <mesh position={[0, 2.25, -0.7]}>
        <boxGeometry args={[1.4, 0.65, 0.05]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.3} roughness={0.4} />
      </mesh>
      <mesh position={[-0.7, 2.25, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[1.4, 0.65, 0.05]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.3} roughness={0.4} />
      </mesh>

      {/* Access Ladder (South) */}
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

      {/* Curved Slide Chute (East) */}
      <group position={[0.7, 1.85, 0]}>
        {/* Chute Arch Entrance */}
        <mesh position={[0, 0.35, 0]}>
          <torusGeometry args={[0.32, 0.04, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>
        {/* Spiral Chute Tube */}
        <mesh castShadow position={[0.85, -0.75, 0]} rotation={[0, 0, -0.62]}>
          <cylinderGeometry args={[0.34, 0.36, 2.1, 16, 1, true, -Math.PI / 2, Math.PI]} />
          <meshStandardMaterial color="#0284c7" roughness={0.3} side={THREE.DoubleSide} />
        </mesh>
        {/* Soft Exit Ramp */}
        <mesh position={[1.75, -1.75, 0]}>
          <boxGeometry args={[0.75, 0.06, 0.6]} />
          <meshStandardMaterial color="#0284c7" roughness={0.3} />
        </mesh>
      </group>

      {/* Pyramid Shingled Roof */}
      <mesh castShadow position={[0, 2.9, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[1.3, 0.8, 4]} />
        <meshStandardMaterial color="#ef4444" roughness={0.5} />
      </mesh>

      {/* Active Sliding Child */}
      {hasActiveChild && (
        <group ref={slidingChildRef} position={[0, 0, 0]}>
          <StylizedHuman3D
            scale={0.55}
            shirtColor="#ec4899"
            pantsColor="#1e3a8a"
            isWalking={true}
          />
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
        <sphereGeometry args={[1.2, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial
          color="#f59e0b"
          metalness={0.6}
          roughness={0.3}
          wireframe
          wireframeLinewidth={3}
        />
      </mesh>
      {/* Colorful Climbing Node Grips */}
      {[-0.8, 0, 0.8].map((x, i) =>
        [-0.8, 0, 0.8].map((z, j) => (
          <mesh key={`climb_grip_${i}_${j}`} position={[x * 0.92, 0.8 + ((i + j) % 3) * 0.15, z * 0.92]}>
            <sphereGeometry args={[0.075, 8, 8]} />
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
        <meshStandardMaterial color="#0284c7" metalness={0.8} roughness={0.2} wireframe wireframeLinewidth={3} />
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
// 6. 3D PLAYGROUND POND WITH ROCKS, WATER & CATTAILS
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
      {/* Sandy/Pebble Shoreline Base */}
      <mesh receiveShadow position={[0, 0.02, 0]}>
        <cylinderGeometry args={[2.4, 2.6, 0.05, 20]} />
        <meshStandardMaterial color="#d4a373" roughness={0.9} />
      </mesh>

      {/* Natural Shoreline River Boulders */}
      {Array.from({ length: 18 }).map((_, i) => {
        const angle = (i * Math.PI * 2) / 18;
        const r = 2.1 + ((i % 3) * 0.15 - 0.1);
        const x = Math.cos(angle) * r;
        const z = Math.sin(angle) * r;
        const s = 0.3 + (i % 4) * 0.06;
        return (
          <mesh key={`pond_rock_${i}`} castShadow position={[x, 0.14, z]} scale={[s, s * 0.7, s]}>
            <dodecahedronGeometry args={[0.8, 0]} />
            <meshStandardMaterial color="#64748b" roughness={0.9} />
          </mesh>
        );
      })}

      {/* Radiant Clear Azure Water Layer */}
      <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.0, 24]} />
        <meshStandardMaterial color="#0284c7" roughness={0.04} metalness={0.4} transparent opacity={0.88} />
      </mesh>

      {/* Animated Ripple */}
      <mesh ref={rippleRef} position={[0, 0.09, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.6, 0.85, 24]} />
        <meshStandardMaterial color="#bae6fd" transparent opacity={0.5} />
      </mesh>

      {/* Water Lilies & Cattails */}
      {[
        { x: -0.8, z: 0.6 },
        { x: 0.9, z: -0.5 },
        { x: 0.3, z: 0.9 },
      ].map((pos, idx) => (
        <group key={`pond_lily_${idx}`} position={[pos.x, 0.09, pos.z]}>
          <mesh rotation={[-Math.PI / 2, 0, idx * 1.8]}>
            <circleGeometry args={[0.28, 12, 0, Math.PI * 1.8]} />
            <meshStandardMaterial color="#22c55e" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.05, 0]}>
            <sphereGeometry args={[0.08, 6, 6]} />
            <meshStandardMaterial color="#f472b6" />
          </mesh>
        </group>
      ))}

      {/* Shoreline Cattails / Reeds */}
      {[-1.8, 1.7, 0.2].map((x, i) => (
        <group key={`reed_${i}`} position={[x, 0.12, 1.4 * (i % 2 === 0 ? 1 : -1)]}>
          <mesh position={[0, 0.45, 0]}>
            <cylinderGeometry args={[0.015, 0.02, 0.9, 6]} />
            <meshStandardMaterial color="#15803d" />
          </mesh>
          <mesh position={[0, 0.75, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.25, 6]} />
            <meshStandardMaterial color="#78350f" />
          </mesh>
        </group>
      ))}
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
    // Quadrant is not yet started: render empty under-construction ground zone
    return (
      <group position={[6, 0, -6]}>
        {/* Under-construction Ground Markers */}
        <mesh receiveShadow position={[0, 0.01, 0]}>
          <boxGeometry args={[9.5, 0.02, 9.5]} />
          <meshStandardMaterial color="#3f6212" roughness={0.9} opacity={0.6} transparent />
        </mesh>
        {/* Surveyor Wooden Stakes */}
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

  // Calculate dynamic scaling and visibility based on 8-10s construction progress
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

      {/* 2. Construction Workers Active during Building Phase (0 to 1) */}
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
          {/* Large Slide Tower */}
          <SlideTower3D position={[2.2, 0, -1.8]} rotationY={-0.2} hasActiveChild={showActiveChildren} />
        </group>
      )}

      {showLateStructures && (
        <group scale={[stageScale, stageScale, stageScale]}>
          {/* Seesaw */}
          <Seesaw3D position={[-2.2, 0, 1.8]} rotationY={0.3} hasActiveChildren={showActiveChildren} />
          {/* Climbing Dome */}
          <ClimbingDome3D position={[2.0, 0, 1.8]} hasActiveChild={showActiveChildren} />
          {/* Spring Rider */}
          <SpringRider3D position={[0, 0, 0.2]} rotationY={0.5} hasActiveChild={showActiveChildren} />
        </group>
      )}

      {/* 4. Natural 3D Pond, Landscaping & Parent Benches */}
      {showLandscaping && (
        <group scale={[stageScale, stageScale, stageScale]}>
          {/* Beautiful Pond */}
          <PlaygroundPond3D position={[3.6, 0, 3.6]} />
          {/* Shade Trees */}
          <ShadyTree3D position={[-3.8, 0, -3.8]} scale={1.1} />
          <ShadyTree3D position={[-3.8, 0, 3.8]} scale={1.0} />
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
