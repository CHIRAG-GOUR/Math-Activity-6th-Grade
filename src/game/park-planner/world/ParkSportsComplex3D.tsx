// ============================================================
// PARK PLANNER — High-Graphics 3D Sports Complex (Quadrant III)
// Contains 2 distinct, spatially separated grounds:
// 1. Cricket Ground — mowed-stripe outfield, clay pitch with full creases,
//    sightscreen, scoreboard, boundary rope with flag markers, a fuller
//    fielding side and a bat that actually swings.
// 2. Football Ground — mowed-stripe pitch, full regulation markings
//    (penalty box, goal box, corner arcs), proper enclosed goal nets,
//    two kits on the pitch plus a referee.
// Plus coach with sports bags, water cooler, spectator bleachers, a
// perimeter fence once built, and an 8-10s construction sequence.
// ============================================================

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { StylizedHuman3D } from './ParkCharacters3D';
import { ParkBench3D } from './ParkPicnicGrove3D';
import { ConstructionWorker3D, ConstructionCart3D } from './ParkWorkers3D';

const WHITE = '#f8fafc';

// ------------------------------------------------------------
// SHARED: mowed-stripe turf, built from geometry (no textures) to match
// the rest of the park's flat-shaded, low-poly house style.
// ------------------------------------------------------------

/** Concentric alternating rings — how a circular cricket outfield is actually mown. */
const CricketTurf: React.FC<{ radius: number; bands?: number }> = ({ radius, bands = 5 }) => {
  const step = radius / bands;
  const light = '#2f9e46';
  const dark = '#227a37';
  return (
    <group>
      <mesh receiveShadow position={[0, 0.018, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[step, 28]} />
        <meshStandardMaterial color={dark} roughness={0.82} />
      </mesh>
      {Array.from({ length: bands - 1 }, (_, i) => (
        <mesh key={i} receiveShadow position={[0, 0.019, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[step * (i + 1), step * (i + 2), 28]} />
          <meshStandardMaterial color={i % 2 === 0 ? light : dark} roughness={0.82} />
        </mesh>
      ))}
    </group>
  );
};

/** Alternating longitudinal bands — the classic stadium mowing pattern. */
const FootballTurf: React.FC<{ length: number; width: number; stripes?: number }> = ({ length, width, stripes = 9 }) => {
  const stripeW = length / stripes;
  const light = '#1c7a3f';
  const dark = '#166534';
  return (
    <group>
      {Array.from({ length: stripes }, (_, i) => (
        <mesh key={i} receiveShadow position={[-length / 2 + stripeW * (i + 0.5), 0.019, 0]}>
          <boxGeometry args={[stripeW + 0.01, 0.006, width]} />
          <meshStandardMaterial color={i % 2 === 0 ? light : dark} roughness={0.82} />
        </mesh>
      ))}
    </group>
  );
};

/** One thin painted line, given as a rectangle (used for every pitch marking). */
const LineBox: React.FC<{ position: [number, number, number]; size: [number, number]; rotationY?: number; color?: string }> = ({
  position, size, rotationY = 0, color = WHITE,
}) => (
  <mesh position={position} rotation={[0, rotationY, 0]}>
    <boxGeometry args={[size[0], 0.006, size[1]]} />
    <meshBasicMaterial color={color} />
  </mesh>
);

/** An open, 3-sided rectangle marking (a football penalty/goal box). */
const OpenBox: React.FC<{ goalX: number; depth: number; halfWidth: number; y?: number; thickness?: number }> = ({
  goalX, depth, halfWidth, y = 0.043, thickness = 0.035,
}) => {
  const sign = Math.sign(goalX) || 1;
  const frontX = goalX - sign * depth;
  return (
    <group>
      <LineBox position={[(goalX + frontX) / 2, y, -halfWidth]} size={[depth, thickness]} />
      <LineBox position={[(goalX + frontX) / 2, y, halfWidth]} size={[depth, thickness]} />
      <LineBox position={[frontX, y, 0]} size={[thickness, halfWidth * 2]} />
    </group>
  );
};

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
  const batRef = useRef<THREE.Group>(null);
  const fielderRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!isActiveMatch) return;
    const t = (state.clock.getElapsedTime() * 0.8) % 3.0; // 3 sec delivery cycle

    // 1. Bowler Run-Up & Delivery
    if (bowlerRef.current) {
      if (t < 1.0) {
        const runT = t / 1.0;
        bowlerRef.current.position.set(-1.8 + runT * 0.8, 0, 0);
      } else {
        const returnT = (t - 1.0) / 2.0;
        bowlerRef.current.position.set(-1.0 - returnT * 0.8, 0, 0);
      }
    }

    // 2. Cricket Ball Flight
    if (ballRef.current) {
      if (t < 0.9) {
        ballRef.current.position.set((bowlerRef.current?.position.x || -1.8) + 0.15, 0.8, 0);
      } else if (t < 1.6) {
        const pitchT = (t - 0.9) / 0.7;
        const x = -1.0 + pitchT * 2.0;
        const y = 0.8 - Math.sin(pitchT * Math.PI) * 0.45;
        ballRef.current.position.set(x, Math.max(0.12, y), 0);
      } else if (t < 2.4) {
        const shotT = (t - 1.6) / 0.8;
        const x = 1.0 - shotT * 0.8;
        const z = shotT * 1.5;
        const y = 0.15 + Math.sin(shotT * Math.PI) * 0.6;
        ballRef.current.position.set(x, y, z);
      } else {
        const returnT = (t - 2.4) / 0.6;
        ballRef.current.position.set(0.2 - returnT * 1.2, 0.5, 1.5 - returnT * 1.5);
      }
    }

    // 3. Batsman: a small weight-shift on the body, a real swing on the bat.
    if (batsmanRef.current) {
      const twist = t >= 1.5 && t <= 1.7 ? Math.sin((t - 1.5) * 15) * 0.18 : 0;
      batsmanRef.current.rotation.y = Math.PI / 2 + twist;
    }
    if (batRef.current) {
      if (t >= 1.42 && t <= 1.66) {
        const swingT = (t - 1.42) / 0.24; // 0..1 backlift -> impact -> follow-through
        batRef.current.rotation.x = -1.1 + smoothstep(swingT) * 1.9;
      } else {
        batRef.current.rotation.x = -1.1;
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
      {/* Mown outfield — alternating rings, the real thing */}
      <CricketTurf radius={2.8} />

      {/* Raised boundary rope on a slight ring, with marker flags every 45° */}
      <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.78, 0.032, 6, 48]} />
        <meshStandardMaterial color={WHITE} roughness={0.5} />
      </mesh>
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return (
          <group key={i} position={[Math.cos(a) * 2.78, 0.06, Math.sin(a) * 2.78]}>
            <mesh position={[0, 0.14, 0]}>
              <cylinderGeometry args={[0.01, 0.01, 0.28, 5]} />
              <meshStandardMaterial color="#e2e8f0" />
            </mesh>
            <mesh position={[0, 0.24, 0.05]}>
              <planeGeometry args={[0.1, 0.08]} />
              <meshStandardMaterial color={i % 2 === 0 ? '#f97316' : '#facc15'} side={THREE.DoubleSide} />
            </mesh>
          </group>
        );
      })}

      {/* Central Clay Pitch Strip */}
      <mesh receiveShadow position={[0, 0.03, 0]}>
        <boxGeometry args={[2.6, 0.03, 0.7]} />
        <meshStandardMaterial color="#d4a373" roughness={0.85} />
      </mesh>

      {/* Popping creases + return creases at both ends */}
      {[-1.05, 1.05].map((x, i) => {
        const sign = i === 0 ? -1 : 1;
        return (
          <group key={`crease_${i}`}>
            <LineBox position={[x, 0.046, 0]} size={[0.03, 0.65]} />
            {[-0.325, 0.325].map((z, j) => (
              <LineBox key={j} position={[x + sign * 0.2, 0.046, z]} size={[0.4, 0.03]} />
            ))}
          </group>
        );
      })}

      {/* Bowler's End Wickets */}
      <Wickets position={[-1.15, 0.04, 0]} />
      {/* Batsman's End Wickets */}
      <Wickets position={[1.15, 0.04, 0]} />

      {/* Sightscreen behind the bowler's arm, on the boundary */}
      <group position={[-2.55, 0, 0]}>
        <mesh castShadow position={[0, 0.9, 0]}>
          <boxGeometry args={[0.06, 1.1, 1.7]} />
          <meshStandardMaterial color={WHITE} roughness={0.6} />
        </mesh>
        {[-0.6, 0.6].map((z, i) => (
          <mesh key={i} position={[0, 0.18, z]}>
            <cylinderGeometry args={[0.03, 0.03, 0.36, 6]} />
            <meshStandardMaterial color="#94a3b8" roughness={0.5} metalness={0.3} />
          </mesh>
        ))}
      </group>

      {/* Scoreboard on the side boundary */}
      <group position={[0, 0, -2.55]}>
        <mesh castShadow position={[0, 0.7, 0]}>
          <boxGeometry args={[1.4, 0.9, 0.08]} />
          <meshStandardMaterial color="#0f172a" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.85, 0.045]}>
          <planeGeometry args={[1.2, 0.28]} />
          <meshStandardMaterial color="#facc15" />
        </mesh>
        {[0.5, 0.32].map((y, i) => (
          <mesh key={i} position={[0, y, 0.045]}>
            <planeGeometry args={[1.2, 0.14]} />
            <meshStandardMaterial color="#22c55e" />
          </mesh>
        ))}
        {[-0.6, 0.6].map((x, i) => (
          <mesh key={i} position={[x, 0.28, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.56, 6]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
        ))}
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
            <StylizedHuman3D scale={0.62} shirtColor={WHITE} pantsColor={WHITE} shoesColor={WHITE} isJogging />
          </group>

          {/* 2. Batsman in Whites with Cricket Bat that actually swings */}
          <group ref={batsmanRef} position={[1.0, 0, 0.15]} rotation={[0, Math.PI / 2, 0]}>
            <StylizedHuman3D scale={0.62} shirtColor={WHITE} pantsColor={WHITE} shoesColor={WHITE} hasHelmet isWalking={false} />
            <group ref={batRef} position={[0.18, 0.62, 0.1]} rotation={[-1.1, 0, 0.15]}>
              <mesh position={[0, -0.24, 0]}>
                <boxGeometry args={[0.06, 0.48, 0.02]} />
                <meshStandardMaterial color="#d4a373" roughness={0.5} />
              </mesh>
            </group>
          </group>

          {/* 3. Fielder chasing the shot */}
          <group ref={fielderRef} position={[0.4, 0, 1.0]} rotation={[0, -Math.PI / 4, 0]}>
            <StylizedHuman3D scale={0.6} shirtColor={WHITE} pantsColor={WHITE} shoesColor={WHITE} isWalking />
          </group>

          {/* 4. Wicketkeeper crouched behind the stumps */}
          <group position={[1.55, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <StylizedHuman3D scale={0.6} shirtColor={WHITE} pantsColor={WHITE} shoesColor={WHITE} hasHelmet isWalking={false} />
          </group>

          {/* 5. Non-striker, backed up at the bowler's end */}
          <group position={[-1.35, 0, 0.35]} rotation={[0, Math.PI / 2, 0]}>
            <StylizedHuman3D scale={0.6} shirtColor={WHITE} pantsColor={WHITE} shoesColor={WHITE} isWalking={false} />
          </group>

          {/* 6-7. Cover and mid-on, filling out the field */}
          <group position={[0.9, 0, -1.7]} rotation={[0, Math.PI / 5, 0]}>
            <StylizedHuman3D scale={0.58} shirtColor={WHITE} pantsColor={WHITE} shoesColor={WHITE} isWalking={false} />
          </group>
          <group position={[-1.9, 0, -1.2]} rotation={[0, -Math.PI / 3, 0]}>
            <StylizedHuman3D scale={0.58} shirtColor={WHITE} pantsColor={WHITE} shoesColor={WHITE} isWalking={false} />
          </group>

          {/* 8. Umpire, just behind the bowler's stumps */}
          <group position={[-1.5, 0, 0.55]} rotation={[0, Math.PI / 2, 0]}>
            <StylizedHuman3D scale={0.6} shirtColor="#1e293b" pantsColor="#1e293b" shoesColor="#000000" isWalking={false} />
          </group>
        </group>
      )}
    </group>
  );
};

/** One end's stumps: three posts and a bail, shared by both ends. */
const Wickets: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <group position={position}>
    {[-0.05, 0, 0.05].map((z, j) => (
      <mesh key={j} castShadow position={[0, 0.28, z]}>
        <cylinderGeometry args={[0.012, 0.012, 0.56, 6]} />
        <meshStandardMaterial color="#fef08a" roughness={0.4} />
      </mesh>
    ))}
    <mesh position={[0, 0.56, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.008, 0.008, 0.13, 6]} />
      <meshStandardMaterial color="#fef08a" />
    </mesh>
  </group>
);

function smoothstep(t: number): number {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
}

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
  const defenderRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!isActiveMatch) return;
    const t = (state.clock.getElapsedTime() * 0.9) % 3.2;

    if (soccerBallRef.current) {
      if (t < 1.2) {
        const passT = t / 1.2;
        const x = -0.8 + passT * 1.4;
        const z = -0.4 + passT * 0.8;
        soccerBallRef.current.position.set(x, 0.12, z);
      } else if (t < 2.2) {
        const shootT = (t - 1.2) / 1.0;
        const x = 0.6 + shootT * 1.3;
        const z = 0.4 - shootT * 0.3;
        const y = 0.12 + Math.sin(shootT * Math.PI) * 0.45;
        soccerBallRef.current.position.set(x, y, z);
      } else {
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

    if (defenderRef.current) {
      // Tracks back toward its own goal as the attack develops.
      const chaseT = Math.min(1, Math.max(0, (t - 0.6) / 1.6));
      defenderRef.current.position.set(1.4 + chaseT * 0.3, 0, -0.6 + chaseT * 0.7);
    }
  });

  const L = 4.2, W = 3.0;

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Mown pitch — alternating longitudinal bands */}
      <FootballTurf length={L} width={W} />

      {/* Regulation markings, drawn as real line meshes (no wireframe artifacts) */}
      <LineBox position={[0, 0.043, -W / 2]} size={[L - 0.2, 0.04]} />
      <LineBox position={[0, 0.043, W / 2]} size={[L - 0.2, 0.04]} />
      <LineBox position={[-L / 2 + 0.1, 0.043, 0]} size={[0.04, W - 0.2]} />
      <LineBox position={[L / 2 - 0.1, 0.043, 0]} size={[0.04, W - 0.2]} />
      <LineBox position={[0, 0.044, 0]} size={[0.04, W - 0.2]} />
      <mesh position={[0, 0.045, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.45, 0.49, 24]} />
        <meshBasicMaterial color={WHITE} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.045, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.035, 10]} />
        <meshBasicMaterial color={WHITE} />
      </mesh>

      {/* Penalty & goal boxes at both ends */}
      {[-1, 1].map((sign) => (
        <group key={sign}>
          <OpenBox goalX={sign * (L / 2 - 0.1)} depth={0.75} halfWidth={0.85} />
          <OpenBox goalX={sign * (L / 2 - 0.1)} depth={0.3} halfWidth={0.45} />
          <mesh position={[sign * (L / 2 - 0.1 - 0.55), 0.045, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.03, 8]} />
            <meshBasicMaterial color={WHITE} />
          </mesh>
        </group>
      ))}

      {/* Corner arcs */}
      {[[-L / 2 + 0.1, -W / 2 + 0.1, 0], [-L / 2 + 0.1, W / 2 - 0.1, Math.PI / 2],
        [L / 2 - 0.1, -W / 2 + 0.1, -Math.PI / 2], [L / 2 - 0.1, W / 2 - 0.1, Math.PI]].map(([cx, cz, a], i) => (
        <mesh key={i} position={[cx, 0.044, cz]} rotation={[-Math.PI / 2, 0, a]}>
          <ringGeometry args={[0.1, 0.13, 8, 1, 0, Math.PI / 2]} />
          <meshBasicMaterial color={WHITE} side={THREE.DoubleSide} />
        </mesh>
      ))}

      {/* Goals with a properly enclosed net, both ends */}
      <Goal3D x={-(L / 2 - 0.2)} facing={1} />
      <Goal3D x={L / 2 - 0.2} facing={-1} />

      {/* 4 Corner Flags */}
      {[[-L / 2, -W / 2], [-L / 2, W / 2], [L / 2, -W / 2], [L / 2, W / 2]].map(([fx, fz], idx) => (
        <group key={idx} position={[fx, 0.04, fz]}>
          <mesh position={[0, 0.45, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.9, 6]} />
            <meshStandardMaterial color={WHITE} />
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
        <meshStandardMaterial color={WHITE} roughness={0.3} />
      </mesh>

      {/* Active Football Players — two kits on the pitch, plus a referee */}
      {isActiveMatch && (
        <group>
          <group ref={midfielderRef} position={[-0.8, 0, -0.4]}>
            <StylizedHuman3D scale={0.6} shirtColor="#0284c7" pantsColor="#1e3a8a" shoesColor="#000000" isJogging />
          </group>
          <group ref={strikerRef} position={[0.6, 0, 0.4]} rotation={[0, Math.PI / 4, 0]}>
            <StylizedHuman3D scale={0.6} shirtColor="#0284c7" pantsColor="#1e3a8a" shoesColor="#000000" isJogging />
          </group>
          <group ref={defenderRef} position={[1.4, 0, -0.6]} rotation={[0, -Math.PI / 6, 0]}>
            <StylizedHuman3D scale={0.6} shirtColor="#dc2626" pantsColor="#7f1d1d" shoesColor="#000000" isJogging />
          </group>
          <group position={[1.85, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <StylizedHuman3D scale={0.62} shirtColor="#facc15" pantsColor="#000000" shoesColor={WHITE} isWalking={false} />
          </group>
          <group position={[0.1, 0, -1.55]} rotation={[0, Math.PI / 3, 0]}>
            <StylizedHuman3D scale={0.58} shirtColor="#111827" pantsColor="#000000" shoesColor={WHITE} isWalking={false} />
          </group>
        </group>
      )}
    </group>
  );
};

/** A goal frame with a real enclosed net — back panel plus two side panels,
 *  instead of a single wireframe box that reads as broken cage edges. */
const Goal3D: React.FC<{ x: number; facing: 1 | -1 }> = ({ x, facing }) => {
  const netMat = <meshStandardMaterial color="#e2e8f0" wireframe transparent opacity={0.5} side={THREE.DoubleSide} />;
  return (
    <group position={[x, 0, 0]}>
      {[-0.65, 0.65].map((z, i) => (
        <mesh key={i} castShadow position={[0, 0.65, z]}>
          <cylinderGeometry args={[0.04, 0.04, 1.3, 8]} />
          <meshStandardMaterial color={WHITE} />
        </mesh>
      ))}
      <mesh castShadow position={[0, 1.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 1.35, 8]} />
        <meshStandardMaterial color={WHITE} />
      </mesh>
      {/* back net */}
      <mesh position={[-facing * 0.35, 0.65, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[1.3, 1.3, 8, 8]} />
        {netMat}
      </mesh>
      {/* side nets */}
      {[-0.65, 0.65].map((z, i) => (
        <mesh key={i} position={[-facing * 0.175, 0.65, z]}>
          <planeGeometry args={[0.35, 1.3, 4, 8]} />
          {netMat}
        </mesh>
      ))}
      {/* top net */}
      <mesh position={[-facing * 0.175, 1.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.35, 1.3, 4, 8]} />
        {netMat}
      </mesh>
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
      <mesh position={[0, 0.028, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[0.06, 0.005, 9.2]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>

      {/* Low perimeter fence once the complex is finished */}
      {isBuilt && (
        <group>
          {[[-4.65, 0], [4.65, 0], [0, -4.65], [0, 4.65]].map(([fx, fz], i) => (
            <group key={i}>
              {Array.from({ length: 12 }, (_, j) => {
                const along = -4.5 + j * (9.0 / 11);
                const px = fx === 0 ? along : fx;
                const pz = fz === 0 ? along : fz;
                return (
                  <mesh key={j} castShadow position={[px, 0.22, pz]}>
                    <cylinderGeometry args={[0.025, 0.025, 0.44, 6]} />
                    <meshStandardMaterial color={WHITE} roughness={0.6} />
                  </mesh>
                );
              })}
              <mesh position={[fx === 0 ? 0 : fx, 0.38, fz === 0 ? 0 : fz]} rotation={[0, fx === 0 ? 0 : Math.PI / 2, 0]}>
                <boxGeometry args={[9.0, 0.03, 0.03]} />
                <meshStandardMaterial color={WHITE} roughness={0.6} />
              </mesh>
            </group>
          ))}
        </group>
      )}

      {/* Construction Workers during 8-10s Build */}
      {isBuilding && progress < 0.95 && (
        <group>
          <ConstructionWorker3D position={[-2.0, 0, -1.5 + Math.sin(progress * 10) * 1.5]} isConstructing />
          <ConstructionWorker3D position={[2.0, 0, 1.5]} isConstructing />
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
          <ParkBench3D position={[-3.8, 0, -2.3]} rotationY={Math.PI / 2} hasVisitor={showActive} />
          <ParkBench3D position={[-3.8, 0, 2.3]} rotationY={Math.PI / 2} hasVisitor={showActive} />

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

          <mesh castShadow position={[-3.2, 0.12, 0]}>
            <boxGeometry args={[0.45, 0.22, 0.28]} />
            <meshStandardMaterial color="#ea580c" roughness={0.6} />
          </mesh>

          {showActive && (
            <group position={[3.4, 0, -1.0]} rotation={[0, -Math.PI / 2, 0]}>
              <StylizedHuman3D scale={0.92} shirtColor="#ef4444" pantsColor="#1e293b" hasHeadband isWalking={false} />
            </group>
          )}
        </group>
      )}
    </group>
  );
};
