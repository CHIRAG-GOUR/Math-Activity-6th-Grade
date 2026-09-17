// ============================================================
// PARK PLANNER — High-Graphics 3D Sports Complex (Quadrant III)
// Contains 2 distinct, spatially separated grounds:
// 1. Cricket Ground (pitch, wickets, bowler bowling, batter swinging, ball travelling, fielder chasing)
// 2. Football Ground (pitch, 2 goals with nets, corner flags, passing & shooting kids)
// Plus coach with sports bags, water cooler, spectator bleachers, and 8-10s construction sequence.
// ============================================================

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { StylizedHuman3D } from './ParkCharacters3D';
import { ParkBench3D } from './ParkPicnicGrove3D';
import { ConstructionWorker3D, ConstructionCart3D } from './ParkWorkers3D';

// ------------------------------------------------------------
// 1. COMPLETE CRICKET GROUND WITH LIVE BOWLING & BATTING MATCH
// ------------------------------------------------------------
export const CricketGround3D: React.FC<{
  position?: [number, number, number];
  rotationY?: number;
  isActiveMatch?: boolean;
}> = ({ position = [0, 0, 0], rotationY = 0, isActiveMatch = true }) => {
  const ballRef = useRef<THREE.Mesh>(null);
  const bowlerRef = useRef<THREE.Group>(null);
  const batsmanRef = useRef<THREE.Group>(null);
  const fielderRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!isActiveMatch) return;
    const t = (state.clock.getElapsedTime() * 0.8) % 3.0; // 3 sec delivery cycle

    // 1. Bowler Run-Up & Delivery
    if (bowlerRef.current) {
      if (t < 1.0) {
        // Run-up
        const runT = t / 1.0;
        bowlerRef.current.position.set(-1.8 + runT * 0.8, 0, 0);
      } else {
        // Follow-through and walk back
        const returnT = (t - 1.0) / 2.0;
        bowlerRef.current.position.set(-1.0 - returnT * 0.8, 0, 0);
      }
    }

    // 2. Cricket Ball Flight
    if (ballRef.current) {
      if (t < 0.9) {
        // In bowler's hand
        ballRef.current.position.set(
          (bowlerRef.current?.position.x || -1.8) + 0.15,
          0.8,
          0
        );
      } else if (t < 1.6) {
        // Bowling trajectory toward batsman
        const pitchT = (t - 0.9) / 0.7;
        const x = -1.0 + pitchT * 2.0;
        const y = 0.8 - Math.sin(pitchT * Math.PI) * 0.45; // Bounce on pitch
        ballRef.current.position.set(x, Math.max(0.12, y), 0);
      } else if (t < 2.4) {
        // Struck ball travels towards cover/midwicket
        const shotT = (t - 1.6) / 0.8;
        const x = 1.0 - shotT * 0.8;
        const z = shotT * 1.5;
        const y = 0.15 + Math.sin(shotT * Math.PI) * 0.6;
        ballRef.current.position.set(x, y, z);
      } else {
        // Fielder returns ball
        const returnT = (t - 2.4) / 0.6;
        ballRef.current.position.set(0.2 - returnT * 1.2, 0.5, 1.5 - returnT * 1.5);
      }
    }

    // 3. Batsman Swing
    if (batsmanRef.current) {
      if (t >= 1.5 && t <= 1.7) {
        batsmanRef.current.rotation.y = Math.PI / 2 + Math.sin((t - 1.5) * 15) * 0.6;
      } else {
        batsmanRef.current.rotation.y = Math.PI / 2;
      }
    }

    // 4. Fielder Chase
    if (fielderRef.current) {
      if (t >= 1.6 && t <= 2.5) {
        const chaseT = (t - 1.6) / 0.9;
        fielderRef.current.position.set(0.4 - chaseT * 0.2, 0, 1.0 + chaseT * 0.5);
      } else {
        fielderRef.current.position.set(0.4, 0, 1.0);
      }
    }
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Circular Cricket Outfield */}
      <mesh receiveShadow position={[0, 0.02, 0]}>
        <cylinderGeometry args={[2.8, 2.8, 0.04, 24]} />
        <meshStandardMaterial color="#15803d" roughness={0.8} />
      </mesh>

      {/* White Boundary Rope */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.72, 2.78, 24]} />
        <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} />
      </mesh>

      {/* Central Clay Pitch Strip */}
      <mesh receiveShadow position={[0, 0.03, 0]}>
        <boxGeometry args={[2.6, 0.03, 0.7]} />
        <meshStandardMaterial color="#d4a373" roughness={0.85} />
      </mesh>
      {/* Bowling & Popping Crease White Lines */}
      {[-1.05, 1.05].map((x, i) => (
        <mesh key={`crease_${i}`} position={[x, 0.046, 0]}>
          <boxGeometry args={[0.03, 0.005, 0.65]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      ))}

      {/* Bowler's End Wickets (Stumps & Bails) */}
      <group position={[-1.15, 0.04, 0]}>
        {[-0.05, 0, 0.05].map((z, j) => (
          <mesh key={`stump_b_${j}`} castShadow position={[0, 0.28, z]}>
            <cylinderGeometry args={[0.012, 0.012, 0.56, 6]} />
            <meshStandardMaterial color="#fef08a" roughness={0.4} />
          </mesh>
        ))}
        {/* Bail */}
        <mesh position={[0, 0.56, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 0.13, 6]} />
          <meshStandardMaterial color="#fef08a" />
        </mesh>
      </group>

      {/* Batsman's End Wickets (Stumps & Bails) */}
      <group position={[1.15, 0.04, 0]}>
        {[-0.05, 0, 0.05].map((z, j) => (
          <mesh key={`stump_s_${j}`} castShadow position={[0, 0.28, z]}>
            <cylinderGeometry args={[0.012, 0.012, 0.56, 6]} />
            <meshStandardMaterial color="#fef08a" roughness={0.4} />
          </mesh>
        ))}
        <mesh position={[0, 0.56, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 0.13, 6]} />
          <meshStandardMaterial color="#fef08a" />
        </mesh>
      </group>

      {/* Red Leather Cricket Ball */}
      <mesh ref={ballRef} castShadow position={[-1.0, 0.3, 0]}>
        <sphereGeometry args={[0.055, 8, 8]} />
        <meshStandardMaterial color="#b91c1c" roughness={0.3} metalness={0.2} />
      </mesh>

      {/* Active Match Characters */}
      {isActiveMatch && (
        <group>
          {/* 1. Bowler */}
          <group ref={bowlerRef} position={[-1.8, 0, 0]}>
            <StylizedHuman3D
              scale={0.62}
              shirtColor="#ffffff"
              pantsColor="#ffffff"
              shoesColor="#ffffff"
              isJogging={true}
            />
          </group>

          {/* 2. Batsman in Whites with Cricket Bat */}
          <group ref={batsmanRef} position={[1.0, 0, 0.15]} rotation={[0, Math.PI / 2, 0]}>
            <StylizedHuman3D
              scale={0.62}
              shirtColor="#ffffff"
              pantsColor="#ffffff"
              shoesColor="#ffffff"
              hasHelmet={true}
              isWalking={false}
            />
            {/* Wooden Willow Cricket Bat */}
            <mesh position={[0.18, 0.35, 0.1]} rotation={[0.4, 0, 0.2]}>
              <boxGeometry args={[0.06, 0.48, 0.02]} />
              <meshStandardMaterial color="#d4a373" roughness={0.5} />
            </mesh>
          </group>

          {/* 3. Fielder */}
          <group ref={fielderRef} position={[0.4, 0, 1.0]} rotation={[0, -Math.PI / 4, 0]}>
            <StylizedHuman3D
              scale={0.6}
              shirtColor="#ffffff"
              pantsColor="#ffffff"
              shoesColor="#ffffff"
              isWalking={true}
            />
          </group>

          {/* 4. Wicketkeeper behind stumps */}
          <group position={[1.55, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <StylizedHuman3D
              scale={0.6}
              shirtColor="#ffffff"
              pantsColor="#ffffff"
              shoesColor="#ffffff"
              hasHelmet={true}
              isWalking={false}
            />
          </group>
        </group>
      )}


    </group>
  );
};

// ------------------------------------------------------------
// 2. COMPLETE FOOTBALL PITCH WITH PASSING & SHOOTING
// ------------------------------------------------------------
export const FootballGround3D: React.FC<{
  position?: [number, number, number];
  rotationY?: number;
  isActiveMatch?: boolean;
}> = ({ position = [0, 0, 0], rotationY = 0, isActiveMatch = true }) => {
  const soccerBallRef = useRef<THREE.Mesh>(null);
  const strikerRef = useRef<THREE.Group>(null);
  const midfielderRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!isActiveMatch) return;
    const t = (state.clock.getElapsedTime() * 0.9) % 3.2; // 3.2s soccer play loop

    // Soccer Ball Passing Mechanics
    if (soccerBallRef.current) {
      if (t < 1.2) {
        // Midfielder dribbles and passes to Striker
        const passT = t / 1.2;
        const x = -0.8 + passT * 1.4;
        const z = -0.4 + passT * 0.8;
        soccerBallRef.current.position.set(x, 0.12, z);
      } else if (t < 2.2) {
        // Striker runs forward with ball and shoots towards goal (East: +X)
        const shootT = (t - 1.2) / 1.0;
        const x = 0.6 + shootT * 1.3;
        const z = 0.4 - shootT * 0.3;
        const y = 0.12 + Math.sin(shootT * Math.PI) * 0.45;
        soccerBallRef.current.position.set(x, y, z);
      } else {
        // Ball settles in goal net, then resets
        soccerBallRef.current.position.set(1.9, 0.12, 0.1);
      }
    }

    if (midfielderRef.current) {
      const runT = (t % 1.6) / 1.6;
      midfielderRef.current.position.set(-0.8 + Math.sin(runT * Math.PI) * 0.3, 0, -0.4);
    }

    if (strikerRef.current) {
      if (t >= 1.0 && t <= 2.2) {
        const strikeT = (t - 1.0) / 1.2;
        strikerRef.current.position.set(0.6 + strikeT * 0.7, 0, 0.4);
      } else {
        strikerRef.current.position.set(0.6, 0, 0.4);
      }
    }
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Striped Green Pitch Turf */}
      <mesh receiveShadow position={[0, 0.02, 0]}>
        <boxGeometry args={[4.2, 0.04, 3.0]} />
        <meshStandardMaterial color="#166534" roughness={0.8} />
      </mesh>

      {/* Regulation White Boundary Lines */}
      <mesh position={[0, 0.042, 0]}>
        <boxGeometry args={[4.0, 0.005, 2.8]} />
        <meshBasicMaterial color="#ffffff" wireframe />
      </mesh>
      {/* Halfway Line */}
      <mesh position={[0, 0.044, 0]}>
        <boxGeometry args={[0.04, 0.005, 2.8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      {/* Center Circle */}
      <mesh position={[0, 0.045, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.45, 0.49, 20]} />
        <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} />
      </mesh>

      {/* West Goal (Left) */}
      <group position={[-2.0, 0, 0]}>
        {/* Posts */}
        <mesh castShadow position={[0, 0.65, -0.65]}>
          <cylinderGeometry args={[0.04, 0.04, 1.3, 8]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh castShadow position={[0, 0.65, 0.65]}>
          <cylinderGeometry args={[0.04, 0.04, 1.3, 8]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh castShadow position={[0, 1.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 1.35, 8]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        {/* Netting Cage */}
        <mesh position={[-0.25, 0.65, 0]}>
          <boxGeometry args={[0.5, 1.3, 1.3]} />
          <meshStandardMaterial color="#e2e8f0" wireframe transparent opacity={0.65} />
        </mesh>
      </group>

      {/* East Goal (Right) */}
      <group position={[2.0, 0, 0]}>
        <mesh castShadow position={[0, 0.65, -0.65]}>
          <cylinderGeometry args={[0.04, 0.04, 1.3, 8]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh castShadow position={[0, 0.65, 0.65]}>
          <cylinderGeometry args={[0.04, 0.04, 1.3, 8]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh castShadow position={[0, 1.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 1.35, 8]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.25, 0.65, 0]}>
          <boxGeometry args={[0.5, 1.3, 1.3]} />
          <meshStandardMaterial color="#e2e8f0" wireframe transparent opacity={0.65} />
        </mesh>
      </group>

      {/* 4 Corner Flags */}
      {[
        [-2.0, -1.4],
        [-2.0, 1.4],
        [2.0, -1.4],
        [2.0, 1.4],
      ].map(([fx, fz], idx) => (
        <group key={`corner_flag_${idx}`} position={[fx, 0.04, fz]}>
          <mesh position={[0, 0.45, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.9, 6]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0.1, 0.82, 0]}>
            <planeGeometry args={[0.2, 0.14]} />
            <meshStandardMaterial color="#ef4444" side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}

      {/* Classic Soccer Ball */}
      <mesh ref={soccerBallRef} castShadow position={[0, 0.12, 0]}>
        <sphereGeometry args={[0.11, 12, 12]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>

      {/* Active Football Players */}
      {isActiveMatch && (
        <group>
          {/* Midfielder (Blue Jersey) */}
          <group ref={midfielderRef} position={[-0.8, 0, -0.4]}>
            <StylizedHuman3D
              scale={0.6}
              shirtColor="#0284c7"
              pantsColor="#1e3a8a"
              shoesColor="#000000"
              isJogging={true}
            />
          </group>

          {/* Striker (Blue Jersey) */}
          <group ref={strikerRef} position={[0.6, 0, 0.4]} rotation={[0, Math.PI / 4, 0]}>
            <StylizedHuman3D
              scale={0.6}
              shirtColor="#0284c7"
              pantsColor="#1e3a8a"
              shoesColor="#000000"
              isJogging={true}
            />
          </group>

          {/* Goalkeeper (Yellow Jersey) */}
          <group position={[1.85, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <StylizedHuman3D
              scale={0.62}
              shirtColor="#facc15"
              pantsColor="#000000"
              shoesColor="#ffffff"
              isWalking={false}
            />
          </group>
        </group>
      )}


    </group>
  );
};

// ------------------------------------------------------------
// 3. COMPLETE QUADRANT III SPORTS COMPLEX ASSEMBLY WITH PROGRESSIVE BUILD
// ------------------------------------------------------------
export const FullQuadrant3Sports3D: React.FC<{
  progress: number; // 0 to 1
  isBuilding: boolean;
  isBuilt: boolean;
}> = ({ progress, isBuilding, isBuilt }) => {
  if (!isBuilding && !isBuilt) {
    return (
      <group position={[-6, 0, 6]}>
        <mesh receiveShadow position={[0, 0.01, 0]}>
          <boxGeometry args={[9.5, 0.02, 9.5]} />
          <meshStandardMaterial color="#1e293b" roughness={0.9} opacity={0.6} transparent />
        </mesh>
        {[-4, 4].map((x, i) =>
          [-4, 4].map((z, j) => (
            <mesh key={`stake_q3_${i}_${j}`} position={[x, 0.2, z]}>
              <cylinderGeometry args={[0.03, 0.03, 0.4, 6]} />
              <meshStandardMaterial color="#3b82f6" />
            </mesh>
          ))
        )}
      </group>
    );
  }

  const stageScale = isBuilt ? 1 : Math.min(1, 0.1 + progress * 0.9);
  const showEarly = progress > 0.15 || isBuilt;
  const showLate = progress > 0.45 || isBuilt;
  const showDetails = progress > 0.75 || isBuilt;
  const showActive = progress > 0.85 || isBuilt;

  return (
    <group position={[-6, 0, 6]}>
      {/* Sports Complex Grass Base with Boundary Walkway */}
      <mesh receiveShadow position={[0, 0.02, 0]}>
        <boxGeometry args={[9.4, 0.04, 9.4]} />
        <meshStandardMaterial color="#15803d" roughness={0.85} />
      </mesh>

      {/* Dividing Safety Paved Pathway between Cricket & Football */}
      <mesh position={[0, 0.025, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[0.8, 0.03, 9.2]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
      </mesh>

      {/* Construction Workers during 8-10s Build */}
      {isBuilding && progress < 0.95 && (
        <group>
          <ConstructionWorker3D
            position={[-2.0, 0, -1.5 + Math.sin(progress * 10) * 1.5]}
            isConstructing={true}
          />
          <ConstructionWorker3D
            position={[2.0, 0, 1.5]}
            isConstructing={true}
          />
          <ConstructionCart3D position={[-3.5, 0, 3.5]} rotationY={Math.PI / 4} />
        </group>
      )}

      {/* 1. Ground 1: Cricket Ground (North half of Q3) */}
      {showEarly && (
        <group scale={[stageScale, stageScale, stageScale]}>
          <CricketGround3D position={[0, 0, -2.3]} isActiveMatch={showActive} />
        </group>
      )}

      {/* 2. Ground 2: Football Ground (South half of Q3) */}
      {showLate && (
        <group scale={[stageScale, stageScale, stageScale]}>
          <FootballGround3D position={[0, 0, 2.3]} isActiveMatch={showActive} />
        </group>
      )}

      {/* 3. Sports Coach, Equipment Bags, Water Station & Spectator Benches */}
      {showDetails && (
        <group scale={[stageScale, stageScale, stageScale]}>
          {/* Spectator Bleachers Bench */}
          <ParkBench3D position={[-3.8, 0, -2.3]} rotationY={Math.PI / 2} hasVisitor={showActive} />
          <ParkBench3D position={[-3.8, 0, 2.3]} rotationY={Math.PI / 2} hasVisitor={showActive} />

          {/* Water Station Cooler */}
          <group position={[3.6, 0, 0]}>
            <mesh castShadow position={[0, 0.45, 0]}>
              <cylinderGeometry args={[0.22, 0.22, 0.9, 12]} />
              <meshStandardMaterial color="#0284c7" roughness={0.4} />
            </mesh>
            <mesh position={[0, 0.95, 0]}>
              <cylinderGeometry args={[0.18, 0.18, 0.35, 12]} />
              <meshStandardMaterial color="#bae6fd" transparent opacity={0.65} />
            </mesh>
          </group>

          {/* Sports Bags on Ground */}
          <mesh castShadow position={[-3.2, 0.12, 0]}>
            <boxGeometry args={[0.45, 0.22, 0.28]} />
            <meshStandardMaterial color="#ea580c" roughness={0.6} />
          </mesh>

          {/* Sports Coach with whistle & clipboard */}
          {showActive && (
            <group position={[3.4, 0, -1.0]} rotation={[0, -Math.PI / 2, 0]}>
              <StylizedHuman3D
                scale={0.92}
                shirtColor="#ef4444"
                pantsColor="#1e293b"
                hasHeadband={true}
                isWalking={false}
              />
            </group>
          )}
        </group>
      )}
    </group>
  );
};
