// ============================================================
// PERCENTAGE HARVEST — 3D LUSH AGRICULTURAL VILLAGE VALLEY TERRAIN
// Beautiful Central Landscaped Flower Garden & Fountain Plaza,
// Front Highway Delivery Road to Market, Sparkling River, Watermill & Mountain Ridge
// ============================================================

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { FarmMaterialsCache } from './FarmMaterials';

export const FarmTerrain3D: React.FC = () => {
  const mats = FarmMaterialsCache.get();
  const windmillRotor1Ref = useRef<THREE.Group>(null);
  const windmillRotor2Ref = useRef<THREE.Group>(null);
  const waterMillWheelRef = useRef<THREE.Group>(null);
  const waterRef = useRef<THREE.Mesh>(null);
  const wellBucketRef = useRef<THREE.Group>(null);
  const wellWaterRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (windmillRotor1Ref.current) windmillRotor1Ref.current.rotation.z += delta * 1.5;
    if (windmillRotor2Ref.current) windmillRotor2Ref.current.rotation.z += delta * 1.2;
    if (waterMillWheelRef.current) waterMillWheelRef.current.rotation.x += delta * 2.0;
    if (waterRef.current) {
      waterRef.current.position.y = 0.04 + Math.sin(state.clock.getElapsedTime() * 1.5) * 0.01;
    }
    if (wellBucketRef.current) {
      wellBucketRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 2.0) * 0.04;
    }
  });

  return (
    <group>
      {/* ── VAST PANORAMIC GREEN VALLEY MEADOW ── */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.06, 0]}
        receiveShadow
        material={mats.grassTerrain}
      >
        <planeGeometry args={[140, 140]} />
      </mesh>

      {/* ── DISTANT LAYERED MAJESTIC MOUNTAIN RIDGELINE ── */}
      {[-55, -35, -15, 5, 25, 45, 65].map((mx, i) => (
        <group key={`mountain-${i}`} position={[mx, -2, -45]}>
          <mesh castShadow material={mats.hillGreen}>
            <coneGeometry args={[14 + (i % 3) * 3, 22 + (i % 2) * 5, 8]} />
          </mesh>
          <mesh position={[0, 10, 0]} material={mats.whiteTrim}>
            <coneGeometry args={[4.5, 6, 8]} />
          </mesh>
        </group>
      ))}

      {/* Side Surrounding Emerald Hills */}
      {[-40, -32, 32, 40].map((hx, i) => (
        <group key={`side-hill-${i}`} position={[hx, -1, (i % 2 === 0 ? 5 : -15)]}>
          <mesh castShadow material={mats.hillGreen}>
            <sphereGeometry args={[12, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          </mesh>
        </group>
      ))}

      {/* ── SPARKLING CURVING RIVER & POND WITH WATER REFLECTIONS ── */}
      <group position={[0, 0, 14]}>
        {/* Riverbed */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.06, 0]} material={mats.darkMud}>
          <planeGeometry args={[90, 7]} />
        </mesh>
        {/* Water Surface */}
        <mesh ref={waterRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]} material={mats.waterRiver}>
          <planeGeometry args={[89.5, 6.5]} />
        </mesh>

        {/* Riverbed Rocks */}
        {[-26, -18, -10, -4, 4, 10, 18, 26].map((rx, i) => (
          <group key={`rock-${i}`} position={[rx, 0.15, (i % 2 === 0 ? 2.5 : -2.5)]}>
            <mesh castShadow material={mats.riverRock}>
              <dodecahedronGeometry args={[0.4 + (i % 3) * 0.12]} />
            </mesh>
          </group>
        ))}

        {/* ── ELEGANT STONE ARCH BRIDGE ── */}
        <group position={[0, 0, 0]}>
          <mesh position={[0, 0.3, 0]} receiveShadow material={mats.pavedRoad}>
            <boxGeometry args={[4.4, 0.25, 7.2]} />
          </mesh>
          <mesh position={[0, 0.1, 0]} material={mats.stoneBridge}>
            <boxGeometry args={[4.6, 0.4, 7.4]} />
          </mesh>
          {[-2.3, 2.3].map((bx) => (
            <mesh key={`bridge-rail-${bx}`} position={[bx, 0.65, 0]} castShadow material={mats.stoneBridge}>
              <boxGeometry args={[0.35, 0.6, 7.4]} />
            </mesh>
          ))}
        </group>

        {/* ── RUSTIC RIVER WATER MILL WITH TURNING WHEEL ── */}
        <group position={[-16, 0, -1.2]}>
          <mesh position={[0, 1.8, 0]} castShadow receiveShadow material={mats.marketWall}>
            <boxGeometry args={[4.2, 3.2, 3.6]} />
          </mesh>
          <mesh position={[0, 4.0, 0]} rotation={[0, Math.PI / 4, 0]} castShadow material={mats.roofShingles}>
            <coneGeometry args={[3.2, 1.8, 4]} />
          </mesh>
          <group ref={waterMillWheelRef} position={[2.4, 0.6, 0]}>
            <mesh rotation={[0, 0, Math.PI / 2]} material={mats.woodTimber}>
              <cylinderGeometry args={[1.4, 1.4, 0.4, 12]} />
            </mesh>
            {[0, 1, 2, 3, 4, 5].map((idx) => (
              <mesh key={`paddle-${idx}`} rotation={[idx * (Math.PI / 3), 0, 0]} material={mats.woodPlanks}>
                <boxGeometry args={[0.35, 2.6, 0.08]} />
              </mesh>
            ))}
          </group>
        </group>
      </group>

      {/* ─────────────────────────────────────────────────────────────
          1. CENTRAL LUSH FLOWER GARDEN & FOUNTAIN PLAZA (CENTER)
          ───────────────────────────────────────────────────────────── */}
      <group position={[0, 0, 1.2]}>
        {/* Cobblestone Garden Plaza Base with cutout for central well shaft */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow material={mats.pastureGrass}>
          <ringGeometry args={[0.9, 3.2, 32]} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.08, 0]} material={mats.roadCurb}>
          <ringGeometry args={[1.9, 3.25, 32]} />
        </mesh>

        {/* ── TRADITIONAL VILLAGE WATER WELL (गाँव का गहरा कुआँ) ── */}
        <group position={[0, 0, 0]}>
          {/* Circular Stepped Stone Well Platform Base */}
          <mesh position={[0, 0.04, 0]} receiveShadow material={mats.stoneBridge}>
            <cylinderGeometry args={[2.0, 2.1, 0.08, 24, 1, true]} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.08, 0]} material={mats.stoneBridge}>
            <ringGeometry args={[1.15, 2.0, 24]} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.082, 0]} material={mats.darkMud}>
            <ringGeometry args={[1.15, 1.6, 24]} />
          </mesh>

          {/* ── MAIN CYLINDRICAL OUTER STONE WELL WALL ── */}
          <mesh position={[0, 0.48, 0]} castShadow receiveShadow material={mats.stoneBridge}>
            <cylinderGeometry args={[1.15, 1.2, 0.8, 24, 1, true]} />
          </mesh>
          {/* Decorative Stone Masonry Relief Bands */}
          <mesh position={[0, 0.28, 0]} material={mats.roadCurb}>
            <cylinderGeometry args={[1.17, 1.18, 0.06, 24, 1, true]} />
          </mesh>
          <mesh position={[0, 0.62, 0]} material={mats.roadCurb}>
            <cylinderGeometry args={[1.16, 1.16, 0.06, 24, 1, true]} />
          </mesh>

          {/* ── ROUNDED STONE COPING TOP RIM (कुएँ की मुंडेर) ── */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.88, 0]} castShadow material={mats.roadCurb}>
            <torusGeometry args={[1.0, 0.16, 12, 32]} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.89, 0]} material={mats.stoneBridge}>
            <ringGeometry args={[0.85, 1.16, 24]} />
          </mesh>

          {/* ── SOLID DARK INNER WELL FOUNDATION BASE (Blocks all ground grass completely) ── */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.35, 0]} material={mats.darkMud}>
            <circleGeometry args={[1.0, 32]} />
          </mesh>
          {/* Inner Dark Stone Wall Lining from rim down to water level */}
          <mesh position={[0, 0.62, 0]} material={mats.darkMud}>
            <cylinderGeometry args={[0.92, 0.92, 0.54, 24, 1, true]} />
          </mesh>
          <mesh position={[0, 0.62, 0]} material={mats.stoneBridge}>
            <cylinderGeometry args={[0.915, 0.915, 0.2, 24, 1, true]} />
          </mesh>

          {/* ── VIBRANT DEEP CRYSTAL BLUE WELL WATER SURFACE (स्वच्छ गहरा शांत नीला पानी) ── */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.50, 0]} receiveShadow material={mats.wellWater}>
            <circleGeometry args={[0.92, 32]} />
          </mesh>

          {/* Left & Right Vertical Wooden Timber Pillars */}
          {[-0.92, 0.92].map((px) => (
            <group key={`well-post-${px}`} position={[px, 1.25, 0]}>
              <mesh castShadow material={mats.woodTimber}>
                <boxGeometry args={[0.16, 1.8, 0.16]} />
              </mesh>
              {/* Stone Post Base Footing */}
              <mesh position={[0, -0.85, 0]} material={mats.stoneBridge}>
                <boxGeometry args={[0.22, 0.18, 0.22]} />
              </mesh>
              {/* Diagonal Support Strut to Roof */}
              <mesh position={[px > 0 ? -0.16 : 0.16, 0.6, 0]} rotation={[0, 0, px > 0 ? -Math.PI / 4 : Math.PI / 4]} material={mats.woodTimber}>
                <boxGeometry args={[0.08, 0.45, 0.08]} />
              </mesh>
            </group>
          ))}

          {/* Top Horizontal Wooden Crossbeam Log */}
          <mesh position={[0, 2.1, 0]} castShadow material={mats.woodTimber}>
            <boxGeometry args={[2.2, 0.15, 0.15]} />
          </mesh>

          {/* Center Wooden Pulley Wheel (Ghirni) */}
          <group position={[0, 1.88, 0]}>
            <mesh rotation={[0, 0, Math.PI / 2]} material={mats.woodPlanks}>
              <cylinderGeometry args={[0.18, 0.18, 0.06, 16]} />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]} material={mats.scalePadSteel}>
              <cylinderGeometry args={[0.04, 0.04, 0.2, 8]} />
            </mesh>
            {/* Hanging Rope from Pulley down to Suspended Bucket */}
            <mesh position={[0, -0.32, 0]} material={mats.strawHat}>
              <cylinderGeometry args={[0.015, 0.015, 0.64, 6]} />
            </mesh>
          </group>

          {/* Village Suspended Wooden Bucket (Balti) Hanging from Pulley */}
          <group ref={wellBucketRef} position={[0, 1.38, 0]}>
            {/* Wooden Bucket Body */}
            <mesh castShadow material={mats.crateWood}>
              <cylinderGeometry args={[0.16, 0.12, 0.26, 12]} />
            </mesh>
            {/* Metal Hoops around Bucket */}
            <mesh position={[0, 0.06, 0]} material={mats.scalePadSteel}>
              <cylinderGeometry args={[0.165, 0.155, 0.02, 12]} />
            </mesh>
            <mesh position={[0, -0.06, 0]} material={mats.scalePadSteel}>
              <cylinderGeometry args={[0.145, 0.135, 0.02, 12]} />
            </mesh>
            {/* Bucket Metal Handle Arch */}
            <mesh position={[0, 0.14, 0]} rotation={[0, 0, 0]} material={mats.scalePadSteel}>
              <torusGeometry args={[0.13, 0.015, 6, 12, Math.PI]} />
            </mesh>
            {/* Water Inside Bucket */}
            <mesh position={[0, 0.1, 0]} material={mats.wellWater}>
              <cylinderGeometry args={[0.14, 0.14, 0.02, 12]} />
            </mesh>
          </group>

          {/* Traditional Pitched Thatched / Clay Shingle Gable Roof Canopy */}
          <group position={[0, 2.38, 0]}>
            {/* Left Slanted Roof Pitch */}
            <mesh position={[-0.55, 0.18, 0]} rotation={[0, 0, Math.PI / 6]} castShadow material={mats.roofShingles}>
              <boxGeometry args={[1.3, 0.08, 1.4]} />
            </mesh>
            {/* Right Slanted Roof Pitch */}
            <mesh position={[0.55, 0.18, 0]} rotation={[0, 0, -Math.PI / 6]} castShadow material={mats.roofShingles}>
              <boxGeometry args={[1.3, 0.08, 1.4]} />
            </mesh>
            {/* Ridge Cap on Top */}
            <mesh position={[0, 0.52, 0]} rotation={[Math.PI / 2, 0, 0]} material={mats.woodTimber}>
              <cylinderGeometry args={[0.08, 0.08, 1.45, 6]} />
            </mesh>
          </group>
        </group>

        {/* ── 4 COLORFUL FLOWER BEDS (Sunflowers, Roses, Tulips, Blossoms) ── */}
        {[
          { angle: Math.PI / 4, type: 'sunflower' },
          { angle: (3 * Math.PI) / 4, type: 'rose' },
          { angle: (5 * Math.PI) / 4, type: 'tulip' },
          { angle: (7 * Math.PI) / 4, type: 'blossom' },
        ].map((bed, idx) => {
          const bx = Math.cos(bed.angle) * 2.1;
          const bz = Math.sin(bed.angle) * 2.1;
          return (
            <group key={`garden-bed-${idx}`} position={[bx, 0, bz]}>
              {/* Soil Bed */}
              <mesh position={[0, 0.1, 0]} material={mats.tilledSoil}>
                <cylinderGeometry args={[0.65, 0.7, 0.15, 12]} />
              </mesh>
              {/* Shrub Foliage */}
              <mesh position={[0, 0.25, 0]} castShadow material={mats.pastureGrass}>
                <sphereGeometry args={[0.5, 8, 8]} />
              </mesh>

              {/* Flowers */}
              {[-0.2, 0.2].map((fx) =>
                [-0.2, 0.2].map((fz, fidx) => (
                  <group key={`flw-${fx}-${fz}`} position={[fx, 0.5, fz]}>
                    <mesh material={bed.type === 'sunflower' ? mats.sunflowerYellow : bed.type === 'rose' ? mats.tomatoFruit : mats.flowerPink}>
                      <sphereGeometry args={[0.1, 6, 6]} />
                    </mesh>
                    {bed.type === 'sunflower' && (
                      <mesh position={[0, 0.05, 0]} material={mats.sunflowerCenter}>
                        <cylinderGeometry args={[0.04, 0.04, 0.02, 6]} />
                      </mesh>
                    )}
                  </group>
                ))
              )}
            </group>
          );
        })}

        {/* ── 2 WOODEN GARDEN BENCHES ── */}
        {[-2.2, 2.2].map((bx) => (
          <group key={`bench-${bx}`} position={[bx, 0, 0]} rotation={[0, (bx < 0 ? Math.PI / 2 : -Math.PI / 2), 0]}>
            <mesh position={[0, 0.3, 0]} material={mats.woodPlanks}>
              <boxGeometry args={[1.2, 0.08, 0.4]} />
            </mesh>
            <mesh position={[0, 0.55, -0.16]} material={mats.woodPlanks}>
              <boxGeometry args={[1.2, 0.4, 0.06]} />
            </mesh>
            {[-0.5, 0.5].map((lx) => (
              <mesh key={`bleg-${lx}`} position={[lx, 0.15, 0]} material={mats.woodTimber}>
                <cylinderGeometry args={[0.04, 0.04, 0.3, 4]} />
              </mesh>
            ))}
          </group>
        ))}

        {/* ── ORNATE VINTAGE LAMP POSTS ── */}
        {[-2.4, 2.4].map((lx) => (
          <group key={`lamp-${lx}`} position={[lx, 0, 2.0]}>
            <mesh position={[0, 1.2, 0]} material={mats.scalePadSteel}>
              <cylinderGeometry args={[0.04, 0.06, 2.4, 6]} />
            </mesh>
            <mesh position={[0, 2.4, 0]} material={mats.headlightGlow}>
              <sphereGeometry args={[0.16, 8, 8]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ─────────────────────────────────────────────────────────────
          2. ROAD NETWORK: SIDE COUNTRY ROADS BESIDE HOUSES & FRONT HIGHWAY
          Trucks park beside farmhouses and drive along side roads to front highway & bridge
          ───────────────────────────────────────────────────────────── */}
      {/* Blue Side Country Road (Beside Blue Farmhouse x = -12.0) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-12.0, -0.02, 0.5]} receiveShadow material={mats.pavedRoad}>
        <planeGeometry args={[3.4, 15.0]} />
      </mesh>
      {[-4.0, -1.0, 2.0, 5.0].map((z, idx) => (
        <mesh key={`blue-side-stripe-${idx}`} rotation={[-Math.PI / 2, 0, 0]} position={[-12.0, -0.01, z]} material={mats.roadLine}>
          <planeGeometry args={[0.2, 1.4]} />
        </mesh>
      ))}

      {/* Red Side Country Road (Beside Red Farmhouse x = 12.0) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[12.0, -0.02, 0.5]} receiveShadow material={mats.pavedRoad}>
        <planeGeometry args={[3.4, 15.0]} />
      </mesh>
      {[-4.0, -1.0, 2.0, 5.0].map((z, idx) => (
        <mesh key={`red-side-stripe-${idx}`} rotation={[-Math.PI / 2, 0, 0]} position={[12.0, -0.01, z]} material={mats.roadLine}>
          <planeGeometry args={[0.2, 1.4]} />
        </mesh>
      ))}

      {/* Front Connecting Highway (z = 7.5 across entire farm width) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 7.5]} receiveShadow material={mats.pavedRoad}>
        <planeGeometry args={[27.4, 3.4]} />
      </mesh>
      {/* Front Highway Dashed Center Line */}
      {[-10, -6, -2, 2, 6, 10].map((rx, idx) => (
        <mesh key={`froad-stripe-${idx}`} rotation={[-Math.PI / 2, 0, 0]} position={[rx, -0.01, 7.5]} material={mats.roadLine}>
          <planeGeometry args={[1.6, 0.2]} />
        </mesh>
      ))}

      {/* Connecting Highway Spur to Bridge */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 11.2]} receiveShadow material={mats.pavedRoad}>
        <planeGeometry args={[4.0, 4.5]} />
      </mesh>
      {[9.5, 11.5, 13.0].map((z, idx) => (
        <mesh key={`bridge-spur-stripe-${idx}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, z]} material={mats.roadLine}>
          <planeGeometry args={[0.22, 1.2]} />
        </mesh>
      ))}

      {/* ── 2 PICTURESQUE WINDMILLS (LEFT & RIGHT HILLS) ── */}
      <group position={[-20, 0, -14]}>
        <mesh position={[0, 2.5, 0]} castShadow receiveShadow material={mats.whiteTrim}>
          <cylinderGeometry args={[1.4, 1.9, 5.0, 16]} />
        </mesh>
        <mesh position={[0, 5.8, 0]} castShadow material={mats.roofShingles}>
          <coneGeometry args={[1.6, 1.8, 16]} />
        </mesh>
        <group position={[0, 4.8, 1.3]} ref={windmillRotor1Ref}>
          <mesh material={mats.woodTimber}>
            <cylinderGeometry args={[0.2, 0.2, 0.4, 8]} />
          </mesh>
          {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, i) => (
            <group key={`w1-sail-${i}`} rotation={[0, 0, angle]}>
              <mesh position={[0, 2.2, 0]} castShadow material={mats.whiteTrim}>
                <boxGeometry args={[0.45, 4.0, 0.04]} />
              </mesh>
            </group>
          ))}
        </group>
      </group>

      <group position={[20, 0, -14]}>
        <mesh position={[0, 2.5, 0]} castShadow receiveShadow material={mats.whiteTrim}>
          <cylinderGeometry args={[1.4, 1.9, 5.0, 16]} />
        </mesh>
        <mesh position={[0, 5.8, 0]} castShadow material={mats.roofShingles}>
          <coneGeometry args={[1.6, 1.8, 16]} />
        </mesh>
        <group position={[0, 4.8, 1.3]} ref={windmillRotor2Ref}>
          <mesh material={mats.woodTimber}>
            <cylinderGeometry args={[0.2, 0.2, 0.4, 8]} />
          </mesh>
          {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, i) => (
            <group key={`w2-sail-${i}`} rotation={[0, 0, angle]}>
              <mesh position={[0, 2.2, 0]} castShadow material={mats.whiteTrim}>
                <boxGeometry args={[0.45, 4.0, 0.04]} />
              </mesh>
            </group>
          ))}
        </group>
      </group>

      {/* ── LUSH VILLAGE OAK, PINE & FRUIT TREES ── */}
      {[
        [-24, -12], [-22, -6], [-24, 6], [-20, 11], [-26, 14],
        [24, -12], [22, -6], [24, 6], [20, 11], [26, 14],
        [-4, 10], [4, 10], [-10, 16], [10, 16], [0, -18],
        [-30, -2], [30, -2], [-32, 8], [32, 8]
      ].map(([tx, tz], i) => (
        <group key={`tree-${i}`} position={[tx, 0, tz]}>
          <mesh position={[0, 1.0, 0]} castShadow material={mats.woodTimber}>
            <cylinderGeometry args={[0.2, 0.3, 2.0, 8]} />
          </mesh>
          <mesh position={[0, 2.6, 0]} castShadow material={mats.pastureGrass}>
            <sphereGeometry args={[1.3, 10, 10]} />
          </mesh>
          <mesh position={[0, 3.7, 0]} castShadow material={mats.grassTerrain}>
            <sphereGeometry args={[0.9, 8, 8]} />
          </mesh>
        </group>
      ))}
    </group>
  );
};
