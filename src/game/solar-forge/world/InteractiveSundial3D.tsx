// ============================================================
// THE SOLAR FORGE: Master Earth Solar Watch & Precision Sundial 3D
// Authentic classical-modern solar horology instrument:
// White marble & polished brass dial, 12-Hour Divisions (30° per hour),
// Roman numerals (I to XII), 360° precision degree calibrations,
// tall golden brass gnomon casting authentic sharp solar shadow,
// dynamic arc highlighting connecting clock time to angle geometry,
// and landscaped stone plaza with telemetry instruments & benches.
// ============================================================

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SOLAR_MATERIALS } from './materials';

interface HighlightClockAngle {
  startHour: number;
  endHour: number;
  angleDeg: number;
  isReflex?: boolean;
  label?: string;
}

interface InteractiveSundial3DProps {
  position?: [number, number, number];
  shadowAngleDeg?: number;
  shadowLength?: number;
  interactiveAngle?: number;
  highlightClockAngle?: HighlightClockAngle | null;
}

// 12-Hour Clock & Sundial Divisions (360° ÷ 12 = 30° per hour)
// 12:00 PM True Solar Noon points North (-Z, 0°)
const TWELVE_HOUR_MARKS = [
  { hour: 12, roman: 'XII', label: '12 PM', angleDeg: 0 },
  { hour: 1, roman: 'I', label: '1 PM', angleDeg: 30 },
  { hour: 2, roman: 'II', label: '2 PM', angleDeg: 60 },
  { hour: 3, roman: 'III', label: '3 PM', angleDeg: 90 },
  { hour: 4, roman: 'IV', label: '4 PM', angleDeg: 120 },
  { hour: 5, roman: 'V', label: '5 PM', angleDeg: 150 },
  { hour: 6, roman: 'VI', label: '6 PM', angleDeg: 180 },
  { hour: 7, roman: 'VII', label: '7 PM', angleDeg: 210 },
  { hour: 8, roman: 'VIII', label: '8 AM', angleDeg: 240 },
  { hour: 9, roman: 'IX', label: '9 AM', angleDeg: 270 },
  { hour: 10, roman: 'X', label: '10 AM', angleDeg: 300 },
  { hour: 11, roman: 'XI', label: '11 AM', angleDeg: 330 },
];

export const InteractiveSundial3D: React.FC<InteractiveSundial3DProps> = ({
  position = [0, 0, 9.5],
  shadowAngleDeg = -90, // Defaults to ~9:00 AM (-90° / West)
  shadowLength = 3.2,
  interactiveAngle = 0,
  highlightClockAngle = null,
}) => {
  const gnomonShadowRef = useRef<THREE.Group>(null);
  const studentNeedleRef = useRef<THREE.Group>(null);
  const arcMeshRef = useRef<THREE.Mesh>(null);

  // Smoothly update shadow orientation and student measurement needle
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    if (gnomonShadowRef.current) {
      const targetRad = (shadowAngleDeg * Math.PI) / 180;
      gnomonShadowRef.current.rotation.y = THREE.MathUtils.damp(
        gnomonShadowRef.current.rotation.y,
        targetRad,
        3.8,
        delta
      );
    }

    if (studentNeedleRef.current) {
      const needleRad = (-interactiveAngle * Math.PI) / 180;
      studentNeedleRef.current.rotation.y = THREE.MathUtils.damp(
        studentNeedleRef.current.rotation.y,
        needleRad,
        4.0,
        delta
      );
    }

    // Pulse highlight arc opacity
    if (arcMeshRef.current && arcMeshRef.current.material) {
      const mat = arcMeshRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.65 + Math.sin(t * 3.5) * 0.2;
    }
  });

  // Generate dynamic highlighted arc ribbon on dial face
  const highlightArcGeo = useMemo(() => {
    if (!highlightClockAngle) return null;

    const { startHour, endHour, isReflex } = highlightClockAngle;
    const startDeg = (startHour % 12) * 30;
    let endDeg = (endHour % 12) * 30;

    if (endDeg <= startDeg) {
      endDeg += 360;
    }
    if (isReflex && endDeg - startDeg < 180) {
      endDeg += 360;
    }

    const segments = 48;
    const rIn = 2.4;
    const rOut = 3.3;
    const y = 1.055;

    const vertices: number[] = [];
    const indices: number[] = [];

    for (let i = 0; i <= segments; i++) {
      const progress = i / segments;
      const deg = startDeg + progress * (endDeg - startDeg);
      const rad = (deg * Math.PI) / 180;

      const sin = Math.sin(rad);
      const cos = Math.cos(rad);

      // Inner vertex
      vertices.push(sin * rIn, y, -cos * rIn);
      // Outer vertex
      vertices.push(sin * rOut, y, -cos * rOut);

      if (i < segments) {
        const base = i * 2;
        indices.push(base, base + 1, base + 2);
        indices.push(base + 1, base + 3, base + 2);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }, [highlightClockAngle]);

  return (
    <group position={position}>
      {/* ── 0. LANDSCAPED SUNDIAL PLAZA PAVING (Circular Stone Plaza) ── */}
      <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[9.5, 48]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
      </mesh>
      {/* Plaza Outer Paved Border Ring */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[9.1, 9.5, 48]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.6} />
      </mesh>
      {/* Plaza Inset Ring Pattern */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[6.8, 7.0, 48]} />
        <meshBasicMaterial color="#e2e8f0" />
      </mesh>

      {/* Stone Benches around Plaza Perimeter */}
      {[-7.5, 7.5].map((bx, bIdx) => (
        <group key={bIdx} position={[bx, 0, 2]} rotation={[0, bx > 0 ? -0.4 : 0.4, 0]}>
          {/* Bench Slab */}
          <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.4, 0.15, 0.8]} />
            <primitive object={SOLAR_MATERIALS.concretePlinth} attach="material" />
          </mesh>
          {/* Bench Legs */}
          <mesh position={[-0.9, 0.25, 0]} castShadow>
            <boxGeometry args={[0.3, 0.5, 0.6]} />
            <primitive object={SOLAR_MATERIALS.concretePlinth} attach="material" />
          </mesh>
          <mesh position={[0.9, 0.25, 0]} castShadow>
            <boxGeometry args={[0.3, 0.5, 0.6]} />
            <primitive object={SOLAR_MATERIALS.concretePlinth} attach="material" />
          </mesh>
        </group>
      ))}

      {/* Scientific Telemetry Tripod / Plaque Stand */}
      <group position={[6.0, 0, -4.5]} rotation={[0, -0.6, 0]}>
        <mesh position={[0, 0.7, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.06, 1.4, 6]} />
          <primitive object={SOLAR_MATERIALS.machinerySteel} attach="material" />
        </mesh>
        {/* Plaque Board */}
        <mesh position={[0, 1.35, 0]} rotation={[-0.4, 0, 0]} castShadow>
          <boxGeometry args={[1.2, 0.8, 0.05]} />
          <primitive object={SOLAR_MATERIALS.brassGnomon} attach="material" />
        </mesh>
        <mesh position={[0, 1.36, 0.03]} rotation={[-0.4, 0, 0]}>
          <planeGeometry args={[1.05, 0.65]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* ── 1. STEPPED OCTAGONAL WHITE MARBLE PLINTH ── */}
      {/* Foundation Tier 1 */}
      <mesh position={[0, 0.25, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[5.8, 6.2, 0.5, 8]} />
        <primitive object={SOLAR_MATERIALS.concretePlinth} attach="material" />
      </mesh>
      {/* Foundation Tier 2 */}
      <mesh position={[0, 0.65, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[5.0, 5.4, 0.4, 8]} />
        <primitive object={SOLAR_MATERIALS.concretePlinth} attach="material" />
      </mesh>

      {/* ── 2. POLISHED MARBLE & BRASS SOLAR CLOCK DIAL ── */}
      <mesh position={[0, 0.92, 0]} receiveShadow>
        <cylinderGeometry args={[4.4, 4.6, 0.2, 32]} />
        <meshStandardMaterial color="#ffffff" roughness={0.18} metalness={0.08} />
      </mesh>

      {/* Outer Polished Brass Bezel Ring */}
      <mesh position={[0, 1.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[4.1, 4.45, 48]} />
        <primitive object={SOLAR_MATERIALS.brassGnomon} attach="material" />
      </mesh>

      {/* Mid Degree Ring (0° to 360°) */}
      <mesh position={[0, 1.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.35, 3.42, 48]} />
        <meshBasicMaterial color="#94a3b8" />
      </mesh>

      {/* ── 3. CRISP 12-HOUR DIAL MARKS (30° PER HOUR) ── */}
      {TWELVE_HOUR_MARKS.map((hm, idx) => {
        const rad = (hm.angleDeg * Math.PI) / 180;
        const isNoon = hm.hour === 12;
        const isQuarter = hm.hour === 3 || hm.hour === 6 || hm.hour === 9;
        const len = isNoon ? 0.85 : isQuarter ? 0.65 : 0.45;
        const rPos = 3.95 - len / 2;

        const isStartH = highlightClockAngle?.startHour === hm.hour;
        const isEndH = highlightClockAngle?.endHour === hm.hour;
        const isHighlighted = isStartH || isEndH;

        return (
          <group key={idx}>
            {/* Hour tick line */}
            <mesh
              position={[Math.sin(rad) * rPos, 1.05, -Math.cos(rad) * rPos]}
              rotation={[0, -rad, 0]}
            >
              <boxGeometry args={[isNoon ? 0.08 : isQuarter ? 0.06 : 0.035, 0.02, len]} />
              <meshBasicMaterial color={isHighlighted ? '#0284c7' : isNoon ? '#ea580c' : '#b45309'} />
            </mesh>

            {/* Hour Marker Stud Node */}
            <mesh position={[Math.sin(rad) * 3.5, 1.05, -Math.cos(rad) * 3.5]}>
              <cylinderGeometry
                args={[
                  isHighlighted ? 0.22 : isNoon ? 0.16 : 0.1,
                  isHighlighted ? 0.22 : isNoon ? 0.16 : 0.1,
                  0.04,
                  12,
                ]}
              />
              <meshStandardMaterial
                color={isHighlighted ? '#0ea5e9' : '#d97706'}
                roughness={0.2}
                metalness={0.8}
                emissive={isHighlighted ? '#0284c7' : '#000000'}
                emissiveIntensity={isHighlighted ? 0.6 : 0}
              />
            </mesh>

            {/* Highlighted Beacon Pillar when active */}
            {isHighlighted && (
              <mesh position={[Math.sin(rad) * 3.5, 1.4, -Math.cos(rad) * 3.5]}>
                <cylinderGeometry args={[0.06, 0.06, 0.7, 8]} />
                <meshBasicMaterial color="#38bdf8" />
              </mesh>
            )}
          </group>
        );
      })}

      {/* Degree Ticks (Every 5° all around 360°) */}
      {Array.from({ length: 72 }).map((_, i) => {
        const deg = i * 5;
        const rad = (deg * Math.PI) / 180;
        const is15 = deg % 15 === 0;
        const is30 = deg % 30 === 0;
        if (is30) return null; // Already rendered by major hour mark
        return (
          <mesh
            key={i}
            position={[Math.sin(rad) * 3.15, 1.05, -Math.cos(rad) * 3.15]}
            rotation={[0, -rad, 0]}
          >
            <boxGeometry args={[is15 ? 0.025 : 0.015, 0.015, is15 ? 0.2 : 0.1]} />
            <meshBasicMaterial color={is15 ? '#64748b' : '#cbd5e1'} />
          </mesh>
        );
      })}

      {/* Cardinal Orientation Markers (N, S, E, W) */}
      {[
        { label: 'NORTH / XII', pos: [0, 1.06, -4.1] },
        { label: 'SOUTH / VI', pos: [0, 1.06, 4.1] },
        { label: 'EAST / III', pos: [4.1, 1.06, 0] },
        { label: 'WEST / IX', pos: [-4.1, 1.06, 0] },
      ].map((c, idx) => (
        <group key={idx} position={c.pos as [number, number, number]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.26, 16]} />
            <primitive object={SOLAR_MATERIALS.brassGnomon} attach="material" />
          </mesh>
          <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.18, 16]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>
      ))}

      {/* ── 4. DYNAMIC QUESTION ANGLE HIGHLIGHT ARC ── */}
      {highlightArcGeo && (
        <group>
          <mesh ref={arcMeshRef} geometry={highlightArcGeo}>
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.7} side={THREE.DoubleSide} />
          </mesh>
          {/* Inner Glowing Border Line */}
          <mesh position={[0, 1.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[2.36, 2.42, 48]} />
            <meshBasicMaterial color="#0284c7" />
          </mesh>
        </group>
      )}

      {/* ── 5. CENTRAL GOLDEN BRASS GNOMON (Upright Shadow Caster) ── */}
      <group position={[0, 1.04, 0]}>
        {/* Ornate Brass Mounting Boss */}
        <mesh position={[0, 0.1, 0]} castShadow>
          <cylinderGeometry args={[0.5, 0.65, 0.2, 24]} />
          <primitive object={SOLAR_MATERIALS.brassGnomon} attach="material" />
        </mesh>
        {/* Sculpted Triangular Brass Gnomon Fin (Casts distinct sharp shadow!) */}
        <mesh position={[0, 0.9, -0.6]} rotation={[0.42, 0, 0]} castShadow>
          <boxGeometry args={[0.1, 2.1, 1.1]} />
          <primitive object={SOLAR_MATERIALS.brassGnomon} attach="material" />
        </mesh>
      </group>

      {/* ── 6. AUTHENTIC SHADOW POINTER ACCURATELY INDICATING TIME ── */}
      <group ref={gnomonShadowRef} position={[0, 1.05, 0]}>
        {/* Realistic High-Contrast Solar Shadow Stripe across Dial */}
        <mesh position={[0, 0, -shadowLength / 2]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.22, shadowLength]} />
          <meshBasicMaterial
            color="#0f172a"
            transparent
            opacity={0.72}
            depthWrite={false}
          />
        </mesh>
        {/* Amber Solar Tip Pointer Arrow */}
        <mesh position={[0, 0, -shadowLength]} rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.2, 0.45, 3]} />
          <meshBasicMaterial color="#f59e0b" />
        </mesh>
      </group>

      {/* ── 7. STUDENT PROTRACTOR MEASUREMENT NEEDLE ── */}
      {interactiveAngle > 0 && (
        <group ref={studentNeedleRef} position={[0, 1.06, 0]}>
          <mesh position={[0, 0, -1.6]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.09, 3.0]} />
            <meshBasicMaterial color="#0284c7" />
          </mesh>
          <mesh position={[0, 0, -3.1]} rotation={[-Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.16, 0.35, 3]} />
            <meshBasicMaterial color="#0284c7" />
          </mesh>
        </group>
      )}

      {/* Surrounding Brass Stanchions */}
      {[-5.0, 5.0].map((sx, idx) => (
        <group key={idx} position={[sx, 0, 0]}>
          <mesh position={[0, 0.65, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.09, 1.3, 8]} />
            <primitive object={SOLAR_MATERIALS.brassGnomon} attach="material" />
          </mesh>
          <mesh position={[0, 1.35, 0]}>
            <sphereGeometry args={[0.15, 12, 12]} />
            <primitive object={SOLAR_MATERIALS.brassGnomon} attach="material" />
          </mesh>
        </group>
      ))}
    </group>
  );
};
