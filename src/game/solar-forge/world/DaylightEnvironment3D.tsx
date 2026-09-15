// ============================================================
// THE SOLAR FORGE: Earth Daytime Environment & Sky Dome
// 100% Bright Earth Daylight: Luminous Azure Sky Dome (No black voids!),
// Warm Golden Sunlight, Moving White Cumulus Clouds, Desert Scrub,
// Distant Sunlit Mountain Mesas & Paved Asphalt Roadways.
// ============================================================

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SOLAR_MATERIALS } from './materials';

export const DaylightEnvironment3D: React.FC<{
  sunPosition: [number, number, number];
  timeString?: string;
}> = ({ sunPosition, timeString = '12:00 PM' }) => {
  const cloudsRef = useRef<THREE.Group>(null);
  const dustRef = useRef<THREE.Points>(null);

  // Dynamic summer daylight palette based on time of day
  const isMorning = timeString.includes('09:') || timeString.includes('10:');
  const isHighNoon = timeString.includes('12:');
  const isLateAfternoon = timeString.includes('04:') || timeString.includes('05:');

  const sunColor = isLateAfternoon ? '#ffedd5' : isHighNoon ? '#ffffff' : '#fffdf0';
  const ambientColor = isLateAfternoon ? '#fed7aa' : isHighNoon ? '#f8fafc' : '#e0f2fe';
  const skyHemi = isLateAfternoon ? '#60a5fa' : '#38bdf8';
  const groundHemi = isLateAfternoon ? '#f59e0b' : '#e7c27d';
  const sunIntensity = isHighNoon ? 3.6 : isLateAfternoon ? 3.1 : 3.2;

  // ── 1. GUARANTEED 360° EARTH DAYLIGHT SKY DOME (NO BLACK VOIDS!) ──
  const skyDomeGeo = useMemo(() => {
    const geo = new THREE.SphereGeometry(360, 32, 32);
    const pos = geo.attributes.position;
    const colors = new Float32Array(pos.count * 3);

    const cZenith = new THREE.Color(isLateAfternoon ? '#1d4ed8' : isHighNoon ? '#0284c7' : '#0369a1');
    const cSky = new THREE.Color(isLateAfternoon ? '#3b82f6' : isHighNoon ? '#38bdf8' : '#7dd3fc');
    const cHorizon = new THREE.Color(isLateAfternoon ? '#fdba74' : '#bae6fd');
    const cGround = new THREE.Color(isLateAfternoon ? '#fde047' : '#fef3c7');

    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const col = new THREE.Color();

      if (y > 140) {
        const t = Math.min(1, (y - 140) / 180);
        col.lerpColors(cSky, cZenith, t);
      } else if (y > 20) {
        const t = (y - 20) / 120;
        col.lerpColors(cHorizon, cSky, t);
      } else if (y > -40) {
        const t = (y - (-40)) / 60;
        col.lerpColors(cGround, cHorizon, t);
      } else {
        col.copy(cGround);
      }

      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [isLateAfternoon, isHighNoon]);

  // Soft desert dust particles drifting in sunlight
  const [dustPositions, dustCount] = useMemo(() => {
    const count = 350;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 160;
      pos[i * 3 + 1] = 0.5 + Math.random() * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 140;
    }
    return [pos, count];
  }, []);

  // Distant warm mountain formations
  const mountainGeos = useMemo(() => {
    return [
      { pos: [0, 16, -110] as [number, number, number], scale: [95, 34, 30] as [number, number, number], rotY: 0.1 },
      { pos: [-75, 14, -95] as [number, number, number], scale: [70, 30, 25] as [number, number, number], rotY: -0.2 },
      { pos: [75, 13, -100] as [number, number, number], scale: [75, 32, 28] as [number, number, number], rotY: 0.25 },
      { pos: [115, 12, -35] as [number, number, number], scale: [60, 26, 45] as [number, number, number], rotY: 0.6 },
      { pos: [120, 10, 30] as [number, number, number], scale: [55, 22, 40] as [number, number, number], rotY: -0.4 },
      { pos: [-115, 12, -35] as [number, number, number], scale: [60, 26, 45] as [number, number, number], rotY: -0.6 },
      { pos: [-120, 10, 30] as [number, number, number], scale: [55, 22, 40] as [number, number, number], rotY: 0.4 },
    ];
  }, []);

  // Organic desert bushes / vegetation
  const bushes = useMemo(() => {
    const arr: [number, number, number][] = [];
    for (let i = 0; i < 30; i++) {
      const angle = (i / 30) * Math.PI * 2;
      const r = 22 + Math.random() * 45;
      arr.push([Math.cos(angle) * r, 0.4, Math.sin(angle) * r - 10]);
    }
    return arr;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Slow organic cloud drift
    if (cloudsRef.current) {
      cloudsRef.current.position.x = Math.sin(t * 0.03) * 14;
      cloudsRef.current.position.z = Math.cos(t * 0.02) * 8;
    }

    // Micro dust drift
    if (dustRef.current) {
      dustRef.current.rotation.y = t * 0.006;
    }
  });

  return (
    <group>
      {/* ── 1. ENCLOSING 360° EARTH SKY DOME (NEVER BLACK!) ── */}
      <mesh geometry={skyDomeGeo} position={[0, -20, 0]}>
        <meshBasicMaterial
          vertexColors
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* ── 2. BRIGHT WARM EARTH DAYLIGHT SYSTEM ── */}
      {/* Direct Sun Illumination */}
      <directionalLight
        position={sunPosition}
        intensity={sunIntensity}
        color={sunColor}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={350}
        shadow-camera-left={-90}
        shadow-camera-right={90}
        shadow-camera-top={90}
        shadow-camera-bottom={-90}
        shadow-bias={-0.0003}
      />
      {/* Warm Sky Ambient Light */}
      <ambientLight intensity={1.35} color={ambientColor} />
      {/* Blue Sky to Desert Sand Hemisphere Bounce */}
      <hemisphereLight args={[skyHemi, groundHemi, 1.05]} />

      {/* ── 3. EARTH DESERT VALLEY GROUND ── */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[380, 380, 24, 24]} />
        <primitive object={SOLAR_MATERIALS.desertSand} attach="material" />
      </mesh>

      {/* ── 4. ASPHALT ACCESS ROADS ── */}
      {/* Central North-South spine road */}
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[9, 170]} />
        <primitive object={SOLAR_MATERIALS.roadAsphalt} attach="material" />
      </mesh>
      {/* East-West road connecting Blue and Red facilities */}
      <mesh position={[0, 0.03, -14]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[120, 7.5]} />
        <primitive object={SOLAR_MATERIALS.roadAsphalt} attach="material" />
      </mesh>
      {/* Crisp White Roadway Center Markings */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.25, 160]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* ── 5. DISTANT MOUNTAIN RIDGES ── */}
      {mountainGeos.map((m, idx) => (
        <mesh
          key={idx}
          position={m.pos}
          scale={m.scale}
          rotation={[0, m.rotY, 0]}
        >
          <coneGeometry args={[1, 1, 6]} />
          <primitive object={SOLAR_MATERIALS.distantMountain} attach="material" />
        </mesh>
      ))}

      {/* Organic Desert Scrub / Sagebrush */}
      {bushes.map((bPos, idx) => (
        <group key={idx} position={bPos}>
          <mesh position={[0, 0.35, 0]} scale={[0.7 + (idx % 3) * 0.2, 0.5, 0.7 + (idx % 2) * 0.2]}>
            <sphereGeometry args={[0.7, 8, 8]} />
            <primitive object={SOLAR_MATERIALS.desertFoliage} attach="material" />
          </mesh>
        </group>
      ))}

      {/* Sandstone Boulders in Valley */}
      {[-40, -25, 30, 48].map((x, idx) => (
        <mesh
          key={idx}
          position={[x, 1.0, -42 + (idx % 2) * 16]}
          scale={[3.2, 1.8, 2.8]}
          rotation={[0.2, idx * 0.7, 0.1]}
          castShadow
          receiveShadow
        >
          <dodecahedronGeometry args={[1, 1]} />
          <primitive object={SOLAR_MATERIALS.desertRock} attach="material" />
        </mesh>
      ))}

      {/* ── 6. WHITE CUMULUS CLOUDS ── */}
      <group ref={cloudsRef} position={[0, 60, -35]}>
        {[-70, -20, 25, 75].map((cx, idx) => (
          <group key={idx} position={[cx, (idx % 2) * 5, (idx % 3) * 16]}>
            <mesh scale={[20 + idx * 2, 4.2, 10 + idx]}>
              <sphereGeometry args={[1, 14, 14]} />
              <meshStandardMaterial
                color="#ffffff"
                roughness={0.9}
                transparent
                opacity={0.9}
              />
            </mesh>
            <mesh position={[6, 1.2, 2]} scale={[13, 3.2, 7]}>
              <sphereGeometry args={[1, 10, 10]} />
              <meshStandardMaterial color="#ffffff" roughness={0.9} transparent opacity={0.85} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ── 7. SUNLIT DUST MOTES ── */}
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[dustPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.16}
          color="#fef3c7"
          transparent
          opacity={0.5}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </group>
  );
};
