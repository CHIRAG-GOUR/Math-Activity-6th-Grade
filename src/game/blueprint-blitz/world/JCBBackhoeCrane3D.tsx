// ============================================================
// BLUEPRINT BLITZ — High-Fidelity 3D Excavator / Crane Dig & Dump Station
// Authentic Real-Life Construction Machine:
// - Heavy dual steel crawler tracks with rollers, idlers & drive sprockets
// - 360° rotating yellow superstructure with cast counterweight & engine vents
// - Enclosed cabin with 3D Humanoid Operator actively moving dual hydraulic joysticks
// - Realistic 2-piece articulated boom, dipper stick, & 5-tooth steel bucket
// - Realistic hydraulic scoop physics on rotation.x pitch axis
// - Deep sunken sand pit where bucket digs deep into bottom ground, curls inward,
//   hoists high, slews over to the heavy haul dump truck, and pours falling sand
//   straight into the truck bed in an authentic 8.5s continuous cycle!
// ============================================================

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface JCBStationProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

export const StationaryJCBStation3D: React.FC<JCBStationProps> = ({
  position = [0, 0, -12.5],
  rotation = [0, 0, 0],
  scale = 1.15,
}) => {
  const slewGroupRef = useRef<THREE.Group>(null);
  const mainBoomRef = useRef<THREE.Group>(null);
  const stickRef = useRef<THREE.Group>(null);
  const bucketRef = useRef<THREE.Group>(null);
  const sandInBucketRef = useRef<THREE.Group>(null);
  const fallingSandRef = useRef<THREE.Group>(null);
  const operatorLeftHandRef = useRef<THREE.Group>(null);
  const operatorRightHandRef = useRef<THREE.Group>(null);
  const truckSandPileRef = useRef<THREE.Group>(null);

  // Timed 8.5s Excavation & Dumping Cycle
  useFrame((state) => {
    const totalTime = state.clock.getElapsedTime();
    const cyclePeriod = 8.5;
    const t = totalTime % cyclePeriod;

    let slewAngle = -0.78; // Start facing Sand Pit (-45 deg)
    let boomAngle = 0.25;  // Boom pitch (pitch down > 0, hoist up < 0)
    let stickAngle = -0.45; // Stick pitch
    let bucketAngle = -0.3; // Bucket curl (curl in > 0, dump down < 0)
    let hasSandInBucket = false;
    let isDumpingSand = false;

    // Phase 1: Lower Boom & Plunge Bucket Deep into Bottom Sand Pit (0.0s - 2.4s)
    if (t < 2.4) {
      const p = t / 2.4;
      slewAngle = -0.78; // Locked on sand pit

      // Smooth dip into bottom sand mound
      boomAngle = 0.15 + Math.sin(p * Math.PI) * 0.38; // Dips down deep into sand
      stickAngle = -0.55 + p * 0.85; // Pulls inward through sand
      bucketAngle = -0.35 + Math.pow(p, 1.5) * 1.75; // Bucket curls strongly inward into sand
      hasSandInBucket = p > 0.55;
    }
    // Phase 2: Hoist Loaded Bucket High Above Ground (2.4s - 4.2s)
    else if (t < 4.2) {
      const p = (t - 2.4) / 1.8;
      const smoothLift = 0.5 - 0.5 * Math.cos(p * Math.PI);
      slewAngle = -0.78;

      // Boom lifts up high, bucket stays tightly curled holding sand
      boomAngle = 0.25 - smoothLift * 0.75; // Hoists high (-0.50 rad)
      stickAngle = 0.30 - smoothLift * 0.25;
      bucketAngle = 1.4; // Tightly curled holding sand
      hasSandInBucket = true;
    }
    // Phase 3: Smooth Slew 90° Swing Over to the Haul Dump Truck (4.2s - 6.0s)
    else if (t < 6.0) {
      const p = (t - 4.2) / 1.8;
      const smoothP = 0.5 - 0.5 * Math.cos(p * Math.PI);

      // Swing from Sand Pit (-0.78 rad) to Dump Truck (+0.78 rad)
      slewAngle = -0.78 + smoothP * 1.56;
      boomAngle = -0.50 + Math.sin(p * Math.PI) * 0.08; // Level high clearance
      stickAngle = 0.05 + smoothP * 0.12;
      bucketAngle = 1.4; // Still holding sand
      hasSandInBucket = true;
    }
    // Phase 4: Open Bucket & Dump Sand Directly into Truck Bed (6.0s - 7.2s)
    else if (t < 7.2) {
      const p = (t - 6.0) / 1.2;
      slewAngle = 0.78; // Locked over truck bed
      boomAngle = -0.42;
      stickAngle = 0.17;

      // Bucket uncurls and tilts downward over the truck bed
      bucketAngle = 1.4 - p * 2.3; // Tilts downward to -0.9 rad
      hasSandInBucket = p < 0.35;
      isDumpingSand = p >= 0.15 && p <= 0.85;
    }
    // Phase 5: Slew Back to Sand Pit & Reset Arm (7.2s - 8.5s)
    else {
      const p = (t - 7.2) / 1.3;
      const smoothP = 0.5 - 0.5 * Math.cos(p * Math.PI);

      // Slew back to Sand Pit
      slewAngle = 0.78 - smoothP * 1.56;
      boomAngle = -0.42 + smoothP * 0.57; // Begins lowering toward pit
      stickAngle = 0.17 - smoothP * 0.62;
      bucketAngle = -0.9 + smoothP * 0.55; // Resets bucket angle
      hasSandInBucket = false;
    }

    // Apply accurate physical rotations on X & Y axes
    if (slewGroupRef.current) slewGroupRef.current.rotation.y = slewAngle;
    if (mainBoomRef.current) mainBoomRef.current.rotation.x = boomAngle;
    if (stickRef.current) stickRef.current.rotation.x = stickAngle;
    if (bucketRef.current) bucketRef.current.rotation.x = bucketAngle;

    // Toggle sand visibility
    if (sandInBucketRef.current) sandInBucketRef.current.visible = hasSandInBucket;
    if (fallingSandRef.current) fallingSandRef.current.visible = isDumpingSand;

    // Operator joystick hand micro-motions in sync with hydraulics
    if (operatorLeftHandRef.current) {
      operatorLeftHandRef.current.rotation.x = -0.8 + Math.sin(totalTime * 4) * 0.2;
    }
    if (operatorRightHandRef.current) {
      operatorRightHandRef.current.rotation.x = -0.8 + Math.cos(totalTime * 4) * 0.2;
    }
  });

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* ── 1. SUNKEN SAND PIT (DIGGING REACH ZONE ON LEFT) ── */}
      <group position={[-3.6, 0, -1.8]}>
        {/* Sunken Ground Excavation Ring */}
        <mesh position={[0, 0.1, 0]} receiveShadow>
          <cylinderGeometry args={[2.2, 2.7, 0.25, 18]} />
          <meshStandardMaterial color="#c29b68" roughness={0.95} />
        </mesh>
        {/* Main Golden Sand Mound at Bottom */}
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <coneGeometry args={[1.7, 0.85, 16]} />
          <meshStandardMaterial color="#d4b895" roughness={0.9} />
        </mesh>
        {/* Surrounding Excavated Sand Clumps */}
        {[-1.0, 0.9, -0.4, 0.6].map((sx, idx) => (
          <mesh key={idx} position={[sx, 0.2, (idx % 2 === 0 ? 0.8 : -0.7)]}>
            <sphereGeometry args={[0.45, 8, 8]} />
            <meshStandardMaterial color="#b88d57" roughness={0.95} />
          </mesh>
        ))}
        {/* Orange Safety Cones around Sand Pit */}
        {[-2.0, 2.0].map((cx, idx) => (
          <group key={idx} position={[cx, 0, 1.6]}>
            <mesh position={[0, 0.04, 0]}>
              <boxGeometry args={[0.3, 0.06, 0.3]} />
              <meshStandardMaterial color="#ea580c" />
            </mesh>
            <mesh position={[0, 0.3, 0]} castShadow>
              <coneGeometry args={[0.14, 0.55, 10]} />
              <meshStandardMaterial color="#ea580c" />
            </mesh>
            <mesh position={[0, 0.28, 0]}>
              <cylinderGeometry args={[0.1, 0.12, 0.12, 10]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
          </group>
        ))}
        {/* Pit Boundary Warning Stakes */}
        <group position={[-2.2, 0, -1.5]}>
          <mesh position={[0, 0.6, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 1.2, 6]} />
            <meshStandardMaterial color="#78350f" />
          </mesh>
          <mesh position={[0.2, 1.0, 0]}>
            <planeGeometry args={[0.35, 0.2]} />
            <meshBasicMaterial color="#ef4444" side={THREE.DoubleSide} />
          </mesh>
        </group>
      </group>

      {/* ── 2. HEAVY OFF-ROAD HAUL DUMP TRUCK (DUMPING STATION ON RIGHT) ── */}
      <group position={[3.6, 0, -1.8]} rotation={[0, -0.25, 0]}>
        {/* ── 4 HEAVY OFF-ROAD TYRES & STEEL RIMS ── */}
        {[
          { pos: [-1.0, 0.48, 1.3], name: 'fl' },
          { pos: [1.0, 0.48, 1.3], name: 'fr' },
          { pos: [-1.0, 0.48, -1.1], name: 'rl' },
          { pos: [1.0, 0.48, -1.1], name: 'rr' },
        ].map((wheel, idx) => (
          <group key={idx} position={wheel.pos as [number, number, number]}>
            {/* Chunky Outer Rubber Tyre */}
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.48, 0.48, 0.42, 18]} />
              <meshStandardMaterial color="#0f172a" roughness={0.92} />
            </mesh>
            {/* Deep Off-Road Tread Lugs */}
            {[0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4].map((ang, ti) => (
              <mesh key={ti} rotation={[ang, 0, Math.PI / 2]}>
                <boxGeometry args={[0.07, 0.98, 0.4]} />
                <meshStandardMaterial color="#1e293b" roughness={0.95} />
              </mesh>
            ))}
            {/* Heavy Cast-Iron Yellow Rim Hub */}
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.28, 0.28, 0.44, 14]} />
              <meshStandardMaterial color="#facc15" metalness={0.6} roughness={0.3} />
            </mesh>
            {/* Chrome Axle Cap & 6 Lug Nuts */}
            <mesh
              position={[wheel.pos[0] > 0 ? 0.23 : -0.23, 0, 0]}
              rotation={[0, 0, Math.PI / 2]}
            >
              <cylinderGeometry args={[0.11, 0.11, 0.05, 10]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.15} />
            </mesh>
          </group>
        ))}

        {/* ── HEAVY STRUCTURAL STEEL CHASSIS & AXLES ── */}
        <mesh position={[0, 0.5, 0.1]} castShadow>
          <boxGeometry args={[1.3, 0.28, 3.6]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} metalness={0.6} />
        </mesh>
        <mesh position={[0, 0.48, 1.3]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.09, 0.09, 1.9, 8]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0, 0.48, -1.1]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.09, 0.09, 1.9, 8]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>

        {/* Heavy Front Steel Bumper & Dual Headlights */}
        <group position={[0, 0.48, 1.85]}>
          <mesh castShadow>
            <boxGeometry args={[2.0, 0.38, 0.25]} />
            <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
          </mesh>
          {[-0.7, 0.7].map((hx, idx) => (
            <group key={idx} position={[hx, 0.06, 0.13]}>
              <mesh>
                <circleGeometry args={[0.11, 12]} />
                <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.95} />
              </mesh>
              <mesh position={[hx > 0 ? 0.13 : -0.13, 0, 0]}>
                <circleGeometry args={[0.045, 8]} />
                <meshBasicMaterial color="#f59e0b" />
              </mesh>
            </group>
          ))}
          {/* Yellow Hazard Stripes on Bumper */}
          <mesh position={[0, -0.09, 0.13]}>
            <planeGeometry args={[1.2, 0.12]} />
            <meshBasicMaterial color="#facc15" />
          </mesh>
        </group>

        {/* Chassis Diesel Fuel Tank & Battery Box */}
        <mesh position={[-0.78, 0.45, 0.1]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.2, 1.0, 12]} />
          <meshStandardMaterial color="#64748b" metalness={0.85} roughness={0.3} />
        </mesh>
        <mesh position={[0.78, 0.45, 0.1]} castShadow>
          <boxGeometry args={[0.28, 0.32, 1.0]} />
          <meshStandardMaterial color="#334155" metalness={0.7} />
        </mesh>

        {/* ── DRIVER CABIN (HIGH-VIS YELLOW & TINTED GLASS) ── */}
        <group position={[0, 1.25, 1.15]}>
          <mesh castShadow>
            <boxGeometry args={[1.6, 1.05, 1.25]} />
            <meshStandardMaterial color="#facc15" roughness={0.3} metalness={0.3} />
          </mesh>
          {/* Sloped Windshield */}
          <mesh position={[0, 0.12, 0.63]} rotation={[-0.12, 0, 0]}>
            <planeGeometry args={[1.4, 0.72]} />
            <meshStandardMaterial color="#38bdf8" roughness={0.1} metalness={0.9} transparent opacity={0.65} />
          </mesh>
          {/* Side Windows */}
          <mesh position={[-0.81, 0.12, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[0.95, 0.65]} />
            <meshStandardMaterial color="#38bdf8" roughness={0.1} metalness={0.9} transparent opacity={0.65} />
          </mesh>
          <mesh position={[0.81, 0.12, 0]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[0.95, 0.65]} />
            <meshStandardMaterial color="#38bdf8" roughness={0.1} metalness={0.9} transparent opacity={0.65} />
          </mesh>
          {/* Roof Flashing Amber Strobe */}
          <mesh position={[0, 0.58, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.14, 10]} />
            <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={0.9} />
          </mesh>
          {/* Chrome Vertical Exhaust Stack */}
          <group position={[0.68, 0.55, -0.7]}>
            <mesh position={[0, 0.45, 0]}>
              <cylinderGeometry args={[0.065, 0.065, 1.2, 10]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
            </mesh>
            <mesh position={[0, 1.08, 0]} rotation={[0, 0, 0.35]}>
              <cylinderGeometry args={[0.075, 0.075, 0.14, 10]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
          </group>
        </group>

        {/* ── HEAVY STEEL DUMP BED (RECEIVING SAND SCOOPS!) ── */}
        <group position={[0, 1.2, -0.6]}>
          {/* Dump Bed Floor Plate */}
          <mesh position={[0, 0, 0]} castShadow>
            <boxGeometry args={[1.95, 0.15, 2.3]} />
            <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.4} />
          </mesh>
          {/* Left Side Wall */}
          <mesh position={[-0.98, 0.45, 0]} castShadow>
            <boxGeometry args={[0.1, 0.8, 2.3]} />
            <meshStandardMaterial color="#facc15" roughness={0.3} metalness={0.3} />
          </mesh>
          {/* Right Side Wall */}
          <mesh position={[0.98, 0.45, 0]} castShadow>
            <boxGeometry args={[0.1, 0.8, 2.3]} />
            <meshStandardMaterial color="#facc15" roughness={0.3} metalness={0.3} />
          </mesh>
          {/* Front Wall with Over-Cab Rock Canopy Guard */}
          <mesh position={[0, 0.55, 1.1]} castShadow>
            <boxGeometry args={[1.95, 0.95, 0.1]} />
            <meshStandardMaterial color="#facc15" roughness={0.3} metalness={0.3} />
          </mesh>
          <mesh position={[0, 1.05, 1.45]} rotation={[-0.28, 0, 0]} castShadow>
            <boxGeometry args={[1.95, 0.08, 0.8]} />
            <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.4} />
          </mesh>
          {/* Rear Tailgate */}
          <mesh position={[0, 0.42, -1.1]} castShadow>
            <boxGeometry args={[1.95, 0.72, 0.1]} />
            <meshStandardMaterial color="#facc15" roughness={0.3} metalness={0.3} />
          </mesh>
          {/* Yellow Hazard Chevrons on Tailgate */}
          <mesh position={[0, 0.42, -1.16]}>
            <planeGeometry args={[1.7, 0.45]} />
            <meshBasicMaterial color="#0f172a" />
          </mesh>

          {/* ── ACCUMULATED SAND PILE INSIDE TRUCK BED ── */}
          <group ref={truckSandPileRef} position={[0, 0.28, 0]}>
            <mesh position={[0, 0.15, 0]}>
              <coneGeometry args={[0.9, 0.65, 14]} />
              <meshStandardMaterial color="#d4b895" roughness={0.95} />
            </mesh>
            <mesh position={[0.25, 0.1, -0.35]}>
              <sphereGeometry args={[0.48, 8, 8]} />
              <meshStandardMaterial color="#c29b68" roughness={0.95} />
            </mesh>
            <mesh position={[-0.3, 0.1, 0.35]}>
              <sphereGeometry args={[0.44, 8, 8]} />
              <meshStandardMaterial color="#d4b895" roughness={0.95} />
            </mesh>
          </group>
        </group>
      </group>

      {/* ── 3. HEAVY CRAWLER UNDERCARRIAGE (STATIONARY ON GROUND) ── */}
      {/* Center Cast Steel Carbody */}
      <mesh position={[0, 0.48, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.42, 2.6]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>
      {/* Slew Ring Bearing */}
      <mesh position={[0, 0.74, 0]}>
        <cylinderGeometry args={[0.95, 0.95, 0.16, 22]} />
        <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Left Heavy Track Frame */}
      <group position={[-1.45, 0.42, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.58, 0.62, 3.6]} />
          <meshStandardMaterial color="#0f172a" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0, 1.7]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.28, 0.28, 0.6, 14]} />
          <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>
        <mesh position={[0, 0, -1.7]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.28, 0.28, 0.6, 14]} />
          <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>
        {[-1.1, -0.55, 0, 0.55, 1.1].map((rz, idx) => (
          <mesh key={idx} position={[0, -0.18, rz]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.13, 0.13, 0.6, 10]} />
            <meshStandardMaterial color="#475569" metalness={0.8} />
          </mesh>
        ))}
      </group>

      {/* Right Heavy Track Frame */}
      <group position={[1.45, 0.42, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.58, 0.62, 3.6]} />
          <meshStandardMaterial color="#0f172a" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0, 1.7]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.28, 0.28, 0.6, 14]} />
          <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>
        <mesh position={[0, 0, -1.7]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.28, 0.28, 0.6, 14]} />
          <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>
        {[-1.1, -0.55, 0, 0.55, 1.1].map((rz, idx) => (
          <mesh key={idx} position={[0, -0.18, rz]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.13, 0.13, 0.6, 10]} />
            <meshStandardMaterial color="#475569" metalness={0.8} />
          </mesh>
        ))}
      </group>

      {/* ── 4. 360° ROTATING UPPER SUPERSTRUCTURE (SLEW ASSEMBLY) ── */}
      <group ref={slewGroupRef} position={[0, 0.82, 0]}>
        {/* Main Machine Deck */}
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.7, 0.68, 3.3]} />
          <meshStandardMaterial color="#facc15" roughness={0.3} metalness={0.3} />
        </mesh>

        {/* Heavy Rear Cast-Iron Counterweight */}
        <group position={[0, 0.72, 1.55]}>
          <mesh castShadow>
            <boxGeometry args={[2.72, 0.95, 0.85]} />
            <meshStandardMaterial color="#1e293b" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0, 0.43]}>
            <planeGeometry args={[2.5, 0.55]} />
            <meshBasicMaterial color="#f59e0b" />
          </mesh>
          {/* Red Safety Marker Lights */}
          {[-1.15, 1.15].map((lx, idx) => (
            <mesh key={idx} position={[lx, 0.22, 0.44]}>
              <circleGeometry args={[0.09, 10]} />
              <meshBasicMaterial color="#ef4444" />
            </mesh>
          ))}
        </group>

        {/* Engine Hood Louvers & Chrome Exhaust Stack */}
        <group position={[0.65, 0.9, 0.35]}>
          <mesh position={[0, 0.15, 0]} castShadow>
            <boxGeometry args={[1.15, 0.48, 1.35]} />
            <meshStandardMaterial color="#facc15" />
          </mesh>
          <mesh position={[0.59, 0.15, 0]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[1.15, 0.38]} />
            <meshStandardMaterial color="#0f172a" roughness={0.9} />
          </mesh>
          <mesh position={[0.2, 0.65, -0.3]}>
            <cylinderGeometry args={[0.065, 0.065, 0.85, 10]} />
            <meshStandardMaterial color="#334155" metalness={0.9} />
          </mesh>
          <mesh position={[0.2, 1.1, -0.3]} rotation={[0, 0, 0.3]}>
            <cylinderGeometry args={[0.075, 0.075, 0.09, 10]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
        </group>

        {/* ── OPERATOR CABIN WITH 3D HUMANOID OPERATOR ── */}
        <group position={[-0.75, 1.15, -0.3]}>
          <mesh position={[0, 0, 0]} castShadow>
            <boxGeometry args={[1.1, 1.4, 1.45]} />
            <meshStandardMaterial color="#facc15" roughness={0.3} metalness={0.2} />
          </mesh>
          {/* Front Clear Windshield */}
          <mesh position={[0, 0.05, -0.73]} rotation={[0, 0, 0]}>
            <planeGeometry args={[0.95, 1.2]} />
            <meshStandardMaterial color="#38bdf8" roughness={0.1} metalness={0.9} transparent opacity={0.55} />
          </mesh>
          {/* Side Windows */}
          <mesh position={[-0.56, 0.05, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[1.25, 1.2]} />
            <meshStandardMaterial color="#38bdf8" roughness={0.1} metalness={0.9} transparent opacity={0.55} />
          </mesh>
          <mesh position={[0.56, 0.05, 0]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[1.25, 1.2]} />
            <meshStandardMaterial color="#38bdf8" roughness={0.1} metalness={0.9} transparent opacity={0.55} />
          </mesh>
          {/* Roof Amber Strobe */}
          <mesh position={[0, 0.78, 0]}>
            <cylinderGeometry args={[0.085, 0.085, 0.18, 10]} />
            <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={0.9} />
          </mesh>

          {/* 3D Humanoid Operator */}
          <group position={[0, -0.2, 0.1]}>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.42, 0.42, 0.42]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
            <mesh position={[0, 0.35, 0]} castShadow>
              <boxGeometry args={[0.36, 0.44, 0.24]} />
              <meshStandardMaterial color="#ea580c" roughness={0.5} />
            </mesh>
            {/* Left Joystick Hand */}
            <group ref={operatorLeftHandRef} position={[-0.2, 0.42, -0.05]}>
              <mesh position={[0, -0.15, -0.1]} rotation={[-0.6, 0, 0]}>
                <cylinderGeometry args={[0.04, 0.04, 0.32, 6]} />
                <meshStandardMaterial color="#ea580c" />
              </mesh>
              <mesh position={[0, -0.28, -0.18]}>
                <cylinderGeometry args={[0.015, 0.015, 0.18, 6]} />
                <meshStandardMaterial color="#0f172a" />
              </mesh>
            </group>
            {/* Right Joystick Hand */}
            <group ref={operatorRightHandRef} position={[0.2, 0.42, -0.05]}>
              <mesh position={[0, -0.15, -0.1]} rotation={[-0.6, 0, 0]}>
                <cylinderGeometry args={[0.04, 0.04, 0.32, 6]} />
                <meshStandardMaterial color="#ea580c" />
              </mesh>
              <mesh position={[0, -0.28, -0.18]}>
                <cylinderGeometry args={[0.015, 0.015, 0.18, 6]} />
                <meshStandardMaterial color="#0f172a" />
              </mesh>
            </group>
            {/* Head with 3D Face & Hard Hat */}
            <group position={[0, 0.65, 0]}>
              <mesh>
                <sphereGeometry args={[0.12, 12, 12]} />
                <meshStandardMaterial color="#fed7aa" roughness={0.4} />
              </mesh>
              {/* Eyes */}
              <mesh position={[-0.038, 0.02, -0.11]}>
                <sphereGeometry args={[0.016, 6, 6]} />
                <meshBasicMaterial color="#0f172a" />
              </mesh>
              <mesh position={[0.038, 0.02, -0.11]}>
                <sphereGeometry args={[0.016, 6, 6]} />
                <meshBasicMaterial color="#0f172a" />
              </mesh>
              {/* Hard Hat */}
              <mesh position={[0, 0.06, 0]}>
                <sphereGeometry args={[0.14, 12, 12, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
                <meshStandardMaterial color="#facc15" />
              </mesh>
            </group>
          </group>
        </group>

        {/* ── 5. HEAVY ARTICULATED DIGGING BOOM, STICK & 5-TOOTH BUCKET ── */}
        <group position={[0.45, 0.85, -1.2]}>
          {/* Main Boom Heavy Pivot Pin */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.14, 0.14, 0.65, 14]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} />
          </mesh>

          {/* MAIN BOOM GROUP (Pitches on X-axis) */}
          <group ref={mainBoomRef}>
            {/* Primary Curved Boom Beam */}
            <mesh position={[0, 1.5, -1.0]} rotation={[-0.6, 0, 0]} castShadow>
              <boxGeometry args={[0.42, 0.48, 3.4]} />
              <meshStandardMaterial color="#facc15" roughness={0.3} metalness={0.2} />
            </mesh>

            {/* Chrome Boom Hydraulic Cylinders */}
            <mesh position={[0, 0.7, -0.5]} rotation={[-0.45, 0, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 2.0, 8]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
            </mesh>

            {/* DIPPER STICK ARM (Pitches on X-axis) */}
            <group ref={stickRef} position={[0, 2.8, -2.1]}>
              {/* Stick Pivot Pin */}
              <mesh rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.11, 0.11, 0.5, 10]} />
                <meshStandardMaterial color="#1e293b" metalness={0.8} />
              </mesh>

              {/* Main Dipper Stick Arm */}
              <mesh position={[0, 0.9, -0.8]} rotation={[-0.55, 0, 0]} castShadow>
                <boxGeometry args={[0.34, 0.38, 2.4]} />
                <meshStandardMaterial color="#facc15" roughness={0.3} metalness={0.2} />
              </mesh>

              {/* Stick Hydraulic Cylinder */}
              <mesh position={[0, 1.4, -0.4]} rotation={[-0.35, 0, 0]}>
                <cylinderGeometry args={[0.06, 0.06, 1.6, 8]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
              </mesh>

              {/* 5-TOOTH EXCAVATOR BUCKET (Pitches on X-axis) */}
              <group ref={bucketRef} position={[0, 1.8, -1.6]}>
                {/* Bucket Pivot Pin */}
                <mesh rotation={[0, 0, Math.PI / 2]}>
                  <cylinderGeometry args={[0.09, 0.09, 0.45, 10]} />
                  <meshStandardMaterial color="#1e293b" metalness={0.8} />
                </mesh>

                {/* Heavy Cast-Steel Excavator Bucket Scoop */}
                <mesh castShadow>
                  <boxGeometry args={[0.82, 0.72, 0.95]} />
                  <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.4} />
                </mesh>

                {/* 5 Sharp Digging Teeth */}
                {[-0.32, -0.16, 0, 0.16, 0.32].map((tx, idx) => (
                  <mesh key={idx} position={[tx, -0.4, -0.5]}>
                    <coneGeometry args={[0.045, 0.18, 6]} />
                    <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
                  </mesh>
                ))}

                {/* Golden Sand Mound Inside Bucket (Visible when scooped) */}
                <group ref={sandInBucketRef} position={[0, 0.12, -0.12]}>
                  <mesh>
                    <sphereGeometry args={[0.36, 10, 10]} />
                    <meshStandardMaterial color="#d4b895" roughness={0.95} />
                  </mesh>
                </group>

                {/* Realistic Falling Sand Particle Stream during Dumping */}
                <group ref={fallingSandRef} position={[0, -0.55, 0]}>
                  {/* Central Main Falling Stream */}
                  <mesh position={[0, -0.7, 0]}>
                    <cylinderGeometry args={[0.18, 0.34, 1.4, 8]} />
                    <meshStandardMaterial color="#d4b895" transparent opacity={0.85} roughness={0.95} />
                  </mesh>
                  {/* Secondary Falling Sand Drops */}
                  {[-0.1, 0.12, 0].map((dx, didx) => (
                    <mesh key={didx} position={[dx, -1.2 - didx * 0.2, (didx % 2 === 0 ? 0.1 : -0.1)]}>
                      <sphereGeometry args={[0.12, 6, 6]} />
                      <meshStandardMaterial color="#c29b68" roughness={0.95} />
                    </mesh>
                  ))}
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
};

// Aliases for backwards compatibility
export const JCBBackhoeCrane3D = StationaryJCBStation3D;
export const MobileJCB3D = StationaryJCBStation3D;
