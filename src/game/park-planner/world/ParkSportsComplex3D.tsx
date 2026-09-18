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

// ------------------------------------------------------// ------------------------------------------------------------
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
    const totalCycle = 5.6; // Realistic 5.6-second paced delivery cycle
    const t = (state.clock.getElapsedTime() * 0.9) % totalCycle;

    // 1. Bowler Run-Up & Delivery (Runs from X=-2.2 to -1.15)
    if (bowlerRef.current) {
      if (t < 2.0) {
        const runT = t / 2.0;
        bowlerRef.current.position.set(-2.2 + runT * 1.05, 0, 0);
        bowlerRef.current.rotation.set(0, Math.PI / 2, 0); // Facing batsman
      } else {
        const returnT = (t - 2.0) / 3.6;
        bowlerRef.current.position.set(-1.15 - returnT * 1.05, 0, 0);
        bowlerRef.current.rotation.set(0, -Math.PI / 2, 0);
      }
    }

    // 2. Cricket Ball Flight & Pitch Bounce
    if (ballRef.current) {
      if (t < 1.8) {
        // In bowler's hand
        ballRef.current.position.set((bowlerRef.current?.position.x || -2.2) + 0.15, 0.75, 0);
      } else if (t < 3.2) {
        // Delivery trajectory with bounce at X = 0.0
        const pitchT = (t - 1.8) / 1.4;
        const x = -1.15 + pitchT * 2.2;
        let y = 0.75;
        if (pitchT < 0.5) {
          // Descending to bounce
          const d = pitchT / 0.5;
          y = 0.75 - d * 0.68;
        } else {
          // Rising off the pitch towards batsman
          const r = (pitchT - 0.5) / 0.5;
          y = 0.07 + Math.sin(r * Math.PI * 0.5) * 0.45;
        }
        ballRef.current.position.set(x, y, 0);
      } else if (t < 4.4) {
        // Ball hit off the bat towards off-side / covers
        const shotT = (t - 3.2) / 1.2;
        const x = 1.05 - shotT * 1.1;
        const z = shotT * 1.9;
        const y = 0.45 + Math.sin(shotT * Math.PI) * 0.4;
        ballRef.current.position.set(x, y, z);
      } else {
        // Return throw from fielder back to wicketkeeper
        const retT = (t - 4.4) / 1.2;
        ballRef.current.position.set(-0.05 + retT * 1.2, 0.45, 1.9 - retT * 1.9);
      }
    }

    // 3. Batsman: Proper side-on stance (Left shoulder to bowler, facing bowler along -X)
    if (batsmanRef.current) {
      if (t >= 3.0 && t <= 3.6) {
        // Forward weight transfer & follow-through
        const driveT = (t - 3.0) / 0.6;
        batsmanRef.current.rotation.set(0, -Math.PI / 2 + Math.sin(driveT * Math.PI) * 0.25, 0);
      } else {
        batsmanRef.current.rotation.set(0, -Math.PI / 2, 0);
      }
    }

    // Bat Swing
    if (batRef.current) {
      if (t >= 2.9 && t <= 3.7) {
        const swingT = (t - 2.9) / 0.8;
        // Backlift -> impact -> straight drive follow-through
        batRef.current.rotation.set(-1.2 + Math.sin(swingT * Math.PI) * 2.2, 0, 0);
      } else {
        batRef.current.rotation.set(-1.0, 0, 0); // Grounded in crease
      }
    }

    // 4. Fielder: Chases the ball along the cover boundary
    if (fielderRef.current) {
      if (t >= 3.3 && t <= 4.8) {
        const chaseT = (t - 3.3) / 1.5;
        fielderRef.current.position.set(0.4 - chaseT * 0.4, 0, 1.0 + chaseT * 0.9);
        fielderRef.current.rotation.set(0, -Math.PI / 3, 0);
      } else {
        fielderRef.current.position.set(0.4, 0, 1.0);
        fielderRef.current.rotation.set(0, -Math.PI / 2, 0);
      }
    }
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Mown outfield */}
      <CricketTurf radius={2.8} />

      {/* Raised boundary rope with flags */}
      <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.78, 0.032, 6, 36]} />
        <meshStandardMaterial color={WHITE} roughness={0.5} />
      </mesh>
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return (
          <group key={i} position={[Math.cos(a) * 2.78, 0.06, Math.sin(a) * 2.78]}>
            <mesh position={[0, 0.14, 0]}>
              <cylinderGeometry args={[0.01, 0.01, 0.28, 4]} />
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

      {/* Creases */}
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

      {/* Sightscreen behind the bowler's arm */}
      <group position={[-2.55, 0, 0]}>
        <mesh castShadow position={[0, 0.9, 0]}>
          <boxGeometry args={[0.06, 1.1, 1.7]} />
          <meshStandardMaterial color={WHITE} roughness={0.6} />
        </mesh>
        {[-0.6, 0.6].map((z, i) => (
          <mesh key={i} position={[0, 0.18, z]}>
            <cylinderGeometry args={[0.03, 0.03, 0.36, 6]} />
            <meshStandardMaterial color="#94a3b8" roughness={0.5} />
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
          {/* 1. Bowler: Running from -X towards batsman */}
          <group ref={bowlerRef} position={[-1.8, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <StylizedHuman3D scale={0.62} shirtColor={WHITE} pantsColor={WHITE} shoesColor={WHITE} isJogging />
          </group>

          {/* 2. Batsman in Whites: Proper stance looking toward bowler (-X) with bat ready */}
          <group ref={batsmanRef} position={[1.05, 0, 0.15]} rotation={[0, -Math.PI / 2, 0]}>
            <StylizedHuman3D scale={0.62} shirtColor={WHITE} pantsColor={WHITE} shoesColor={WHITE} hasHelmet isWalking={false} />
            {/* Wooden Cricket Bat */}
            <group ref={batRef} position={[-0.15, 0.55, 0.1]} rotation={[-1.0, 0, 0]}>
              <mesh position={[0, -0.22, 0]}>
                <boxGeometry args={[0.06, 0.44, 0.02]} />
                <meshStandardMaterial color="#d4a373" roughness={0.5} />
              </mesh>
              {/* Handle */}
              <mesh position={[0, 0.08, 0]}>
                <cylinderGeometry args={[0.015, 0.015, 0.18, 6]} />
                <meshStandardMaterial color="#ffffff" />
              </mesh>
            </group>
          </group>

          {/* 3. Fielder chasing the shot */}
          <group ref={fielderRef} position={[0.4, 0, 1.0]} rotation={[0, -Math.PI / 2, 0]}>
            <StylizedHuman3D scale={0.6} shirtColor={WHITE} pantsColor={WHITE} shoesColor={WHITE} isWalking />
          </group>

          {/* 4. Wicketkeeper crouched behind batsman stumps */}
          <group position={[1.55, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <StylizedHuman3D scale={0.6} shirtColor={WHITE} pantsColor={WHITE} shoesColor={WHITE} hasHelmet isWalking={false} isSeated={true} />
          </group>

          {/* 5. Non-striker, backed up at bowler's end */}
          <group position={[-1.35, 0, 0.35]} rotation={[0, Math.PI / 2, 0]}>
            <StylizedHuman3D scale={0.6} shirtColor={WHITE} pantsColor={WHITE} shoesColor={WHITE} isWalking={false} />
          </group>

          {/* 6. Umpire */}
          <group position={[-1.5, 0, 0.55]} rotation={[0, Math.PI / 2, 0]}>
            <StylizedHuman3D scale={0.6} shirtColor="#1e293b" pantsColor="#1e293b" shoesColor="#000000" isWalking={false} />
          </group>
        </group>
      )}
    </group>
  );
};

/** Stumps: three posts and a bail */
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

// ------------------------------------------------------------
// 2. COMPLETE FOOTBALL PITCH WITH PASSING, SHOOTING & GOALKEEPER SAVES
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
  const goalieRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!isActiveMatch) return;
    const totalDuration = 6.0; // 6-second dynamic football cycle
    const t = (state.clock.getElapsedTime() * 0.9) % totalDuration;

    // 1. Ball Physics (Pass -> Dribble -> Shoot -> Goal -> Reset)
    if (soccerBallRef.current) {
      if (t < 1.8) {
        // Phase 1: Midfielder cross passes to striker
        const passT = t / 1.8;
        const x = -1.2 + passT * 1.8;
        const z = -0.6 + passT * 1.0;
        soccerBallRef.current.position.set(x, 0.12, z);
      } else if (t < 3.2) {
        // Phase 2: Striker shoots towards goal net (top corner)
        const shootT = (t - 1.8) / 1.4;
        const x = 0.6 + shootT * 1.35;
        const z = 0.4 - shootT * 0.45;
        const y = 0.12 + Math.sin(shootT * Math.PI) * 0.55;
        soccerBallRef.current.position.set(x, y, z);
      } else if (t < 4.8) {
        // Phase 3: Ball settles in back of goal net
        soccerBallRef.current.position.set(1.95, 0.15, -0.05);
      } else {
        // Phase 4: Ball returns to center circle for kickoff
        const retT = (t - 4.8) / 1.2;
        soccerBallRef.current.position.set(1.95 - retT * 1.95, 0.12, -0.05 * (1 - retT));
      }
    }

    // 2. Midfielder Movement
    if (midfielderRef.current) {
      if (t < 1.8) {
        const runT = t / 1.8;
        midfielderRef.current.position.set(-1.2 + runT * 0.4, 0, -0.6);
        midfielderRef.current.rotation.set(0, Math.PI / 4, 0);
      } else {
        midfielderRef.current.position.set(-0.8, 0, -0.6);
        midfielderRef.current.rotation.set(0, Math.PI / 2, 0);
      }
    }

    // 3. Striker Running, Shooting & Celebrating
    if (strikerRef.current) {
      if (t < 1.8) {
        // Runs to meet the cross pass
        const meetT = t / 1.8;
        strikerRef.current.position.set(0.2 + meetT * 0.4, 0, 0.2 + meetT * 0.2);
        strikerRef.current.rotation.set(0, Math.PI / 2, 0);
      } else if (t < 3.2) {
        // Powerful follow-through shot
        strikerRef.current.position.set(0.65, 0, 0.4);
        strikerRef.current.rotation.set(0, Math.PI / 3, 0);
      } else if (t < 4.8) {
        // Celebration jog with arms up!
        const celebT = (t - 3.2) / 1.6;
        strikerRef.current.position.set(0.65 - celebT * 0.6, 0, 0.4 - celebT * 0.4);
        strikerRef.current.rotation.set(0, -Math.PI / 2, 0);
      } else {
        strikerRef.current.position.set(0.2, 0, 0.2);
        strikerRef.current.rotation.set(0, Math.PI / 2, 0);
      }
    }

    // 4. Defender Tracks Back
    if (defenderRef.current) {
      if (t < 3.2) {
        const defT = t / 3.2;
        defenderRef.current.position.set(1.1 + defT * 0.3, 0, -0.4 + defT * 0.5);
      } else {
        defenderRef.current.position.set(1.4, 0, 0.1);
      }
    }

    // 5. Goalkeeper Diving Attempt
    if (goalieRef.current) {
      if (t >= 2.2 && t <= 3.4) {
        const diveT = (t - 2.2) / 1.2;
        goalieRef.current.position.set(1.85, Math.sin(diveT * Math.PI) * 0.3, -diveT * 0.35);
      } else {
        goalieRef.current.position.set(1.85, 0, 0);
      }
    }
  });

  const L = 4.2, W = 3.0;

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Mown pitch */}
      <FootballTurf length={L} width={W} />

      {/* Regulation markings */}
      <LineBox position={[0, 0.043, -W / 2]} size={[L - 0.2, 0.04]} />
      <LineBox position={[0, 0.043, W / 2]} size={[L - 0.2, 0.04]} />
      <LineBox position={[-L / 2 + 0.1, 0.043, 0]} size={[0.04, W - 0.2]} />
      <LineBox position={[L / 2 - 0.1, 0.043, 0]} size={[0.04, W - 0.2]} />
      <LineBox position={[0, 0.044, 0]} size={[0.04, W - 0.2]} />
      <mesh position={[0, 0.045, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.45, 0.49, 20]} />
        <meshBasicMaterial color={WHITE} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.045, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.035, 8]} />
        <meshBasicMaterial color={WHITE} />
      </mesh>

      {/* Penalty & goal boxes */}
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

      {/* Goals with enclosed nets */}
      <Goal3D x={-(L / 2 - 0.2)} facing={1} />
      <Goal3D x={L / 2 - 0.2} facing={-1} />

      {/* 4 Corner Flags */}
      {[[-L / 2, -W / 2], [-L / 2, W / 2], [L / 2, -W / 2], [L / 2, W / 2]].map(([fx, fz], idx) => (
        <group key={idx} position={[fx, 0.04, fz]}>
          <mesh position={[0, 0.45, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.9, 4]} />
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
        <sphereGeometry args={[0.1, 10, 10]} />
        <meshStandardMaterial color={WHITE} roughness={0.3} />
      </mesh>

      {/* Active Football Match Players */}
      {isActiveMatch && (
        <group>
          {/* 1. Midfielder (Blue Kit #10) */}
          <group ref={midfielderRef} position={[-1.2, 0, -0.6]}>
            <StylizedHuman3D scale={0.6} shirtColor="#0284c7" pantsColor="#1e3a8a" shoesColor="#000000" isJogging />
          </group>
          {/* 2. Striker (Blue Kit #9) */}
          <group ref={strikerRef} position={[0.65, 0, 0.4]}>
            <StylizedHuman3D scale={0.6} shirtColor="#0284c7" pantsColor="#1e3a8a" shoesColor="#000000" isJogging />
          </group>
          {/* 3. Defender (Red Kit #4) */}
          <group ref={defenderRef} position={[1.1, 0, -0.4]}>
            <StylizedHuman3D scale={0.6} shirtColor="#dc2626" pantsColor="#7f1d1d" shoesColor="#000000" isJogging />
          </group>
          {/* 4. Goalkeeper (Yellow Jersey) */}
          <group ref={goalieRef} position={[1.85, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <StylizedHuman3D scale={0.62} shirtColor="#facc15" pantsColor="#000000" shoesColor={WHITE} isWalking={false} />
          </group>
          {/* 5. Referee in Black Kit */}
          <group position={[0.1, 0, -1.55]} rotation={[0, Math.PI / 3, 0]}>
            <StylizedHuman3D scale={0.58} shirtColor="#111827" pantsColor="#000000" shoesColor={WHITE} isWalking={false} />
          </group>
        </group>
      )}
    </group>
  );
};

const Goal3D: React.FC<{ x: number; facing: 1 | -1 }> = ({ x, facing }) => {
  const netMat = <meshStandardMaterial color="#e2e8f0" wireframe transparent opacity={0.5} side={THREE.DoubleSide} />;
  return (
    <group position={[x, 0, 0]}>
      {[-0.65, 0.65].map((z, i) => (
        <mesh key={i} castShadow position={[0, 0.65, z]}>
          <cylinderGeometry args={[0.04, 0.04, 1.3, 6]} />
          <meshStandardMaterial color={WHITE} />
        </mesh>
      ))}
      <mesh castShadow position={[0, 1.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 1.35, 6]} />
        <meshStandardMaterial color={WHITE} />
      </mesh>
      {/* back net */}
      <mesh position={[-facing * 0.35, 0.65, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[1.3, 1.3, 6, 6]} />
        {netMat}
      </mesh>
      {/* side nets */}
      {[-0.65, 0.65].map((z, i) => (
        <mesh key={i} position={[-facing * 0.175, 0.65, z]}>
          <planeGeometry args={[0.35, 1.3, 4, 6]} />
          {netMat}
        </mesh>
      ))}
      {/* top net */}
      <mesh position={[-facing * 0.175, 1.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.35, 1.3, 4, 6]} />
        {netMat}
      </mesh>
    </group>
  );
};

// ------------------------------------------------------------
// 3. COMPLETE QUADRANT III SPORTS COMPLEX ASSEMBLY
// Has a solid dividing sports barrier between grounds and zero trees behind the turf
// ------------------------------------------------------------
export const FullQuadrant3Sports3D: React.FC<{
  progress: number;
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
      {/* 1. Full Open Sports Turf Ground (Zero trees behind ground) */}
      <mesh receiveShadow position={[0, 0.02, 0]}>
        <boxGeometry args={[9.4, 0.04, 9.4]} />
        <meshStandardMaterial color="#15803d" roughness={0.85} />
      </mesh>

      {/* 2. Dividing Sports Partition Barrier between Cricket Ground and Football Ground */}
      <group position={[0, 0, 0]}>
        {/* Paved Divider Path */}
        <mesh position={[0, 0.025, 0]}>
          <boxGeometry args={[9.2, 0.03, 0.7]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
        </mesh>
        {/* Raised Steel & Netting Partition Fence (Height 1.1m) */}
        {[-4.2, -3.0, -1.8, -0.6, 0.6, 1.8, 3.0, 4.2].map((px, idx) => (
          <mesh key={`fence_post_${idx}`} castShadow position={[px, 0.55, 0]}>
            <cylinderGeometry args={[0.035, 0.035, 1.1, 6]} />
            <meshStandardMaterial color="#0f172a" metalness={0.7} />
          </mesh>
        ))}
        {/* Top & Bottom Cross Rails */}
        <mesh position={[0, 1.08, 0]}>
          <boxGeometry args={[8.8, 0.04, 0.04]} />
          <meshStandardMaterial color="#0f172a" metalness={0.7} />
        </mesh>
        <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[8.8, 0.04, 0.04]} />
          <meshStandardMaterial color="#0f172a" metalness={0.7} />
        </mesh>
        {/* Safety Dividing Netting Wall */}
        <mesh position={[0, 0.6, 0]}>
          <planeGeometry args={[8.8, 0.9]} />
          <meshStandardMaterial color="#38bdf8" wireframe transparent opacity={0.45} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Low outer perimeter fence once built */}
      {isBuilt && (
        <group>
          {[[-4.65, 0], [4.65, 0], [0, -4.65], [0, 4.65]].map(([fx, fz], i) => (
            <group key={i}>
              {Array.from({ length: 10 }, (_, j) => {
                const along = -4.5 + j * (9.0 / 9);
                const px = fx === 0 ? along : fx;
                const pz = fz === 0 ? along : fz;
                return (
                  <mesh key={j} castShadow position={[px, 0.22, pz]}>
                    <cylinderGeometry args={[0.025, 0.025, 0.44, 4]} />
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
          <CricketGround3D position={[0, 0, -2.4]} isActiveMatch={showActive} />
        </group>
      )}

      {/* 2. Ground 2: Football Ground (South half of Q3) */}
      {showLate && (
        <group scale={[stageScale, stageScale, stageScale]}>
          <FootballGround3D position={[0, 0, 2.4]} isActiveMatch={showActive} />
        </group>
      )}

      {/* 3. Sports Coach, Equipment Bags, Water Station & Spectator Benches */}
      {showDetails && (
        <group scale={[stageScale, stageScale, stageScale]}>
          <ParkBench3D position={[-3.8, 0, -2.4]} rotationY={Math.PI / 2} hasVisitor={showActive} />
          <ParkBench3D position={[-3.8, 0, 2.4]} rotationY={Math.PI / 2} hasVisitor={showActive} />

          {/* Water Station */}
          <group position={[3.8, 0, 0]}>
            <mesh castShadow position={[0, 0.45, 0]}>
              <cylinderGeometry args={[0.2, 0.2, 0.9, 8]} />
              <meshStandardMaterial color="#0284c7" roughness={0.4} />
            </mesh>
            <mesh position={[0, 0.95, 0]}>
              <cylinderGeometry args={[0.16, 0.16, 0.35, 8]} />
              <meshStandardMaterial color="#bae6fd" transparent opacity={0.65} />
            </mesh>
          </group>

          {/* Sports Bags */}
          <mesh castShadow position={[-3.2, 0.12, 0]}>
            <boxGeometry args={[0.45, 0.22, 0.28]} />
            <meshStandardMaterial color="#ea580c" roughness={0.6} />
          </mesh>

          {/* Coach watching matches */}
          {showActive && (
            <group position={[3.6, 0, -1.0]} rotation={[0, -Math.PI / 2, 0]}>
              <StylizedHuman3D scale={0.92} shirtColor="#ef4444" pantsColor="#1e293b" hasHeadband isWalking={false} />
            </group>
          )}
        </group>
      )}
    </group>
  );
};
