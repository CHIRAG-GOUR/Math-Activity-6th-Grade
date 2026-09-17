import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { UNIT_SIZE, GRID_EXTENT, coordToWorld } from '../engine/coordinateMath';
import { Coordinate2D } from '../types';
import { TieredFountain3D } from './ParkBotanicalGarden3D';

interface ParkTerrain3DProps {
  selectedPoint?: Coordinate2D | null;
  selectedPoints?: Coordinate2D[];
  hoveredPoint?: Coordinate2D | null;
  onPointClick?: (coord: Coordinate2D) => void;
  gateOpenAngle?: number;
  fountainActive?: boolean;
  q1Built?: boolean;
  q2Built?: boolean;
  q3Built?: boolean;
  q4Built?: boolean;
}

export const ParkTerrain3D: React.FC<ParkTerrain3DProps> = ({
  selectedPoint,
  selectedPoints = [],
  hoveredPoint,
  onPointClick,
  gateOpenAngle = 0,
  fountainActive = false,
  q1Built = false,
  q2Built = false,
  q3Built = false,
  q4Built = false,
}) => {
  const parkInnerSize = (GRID_EXTENT * 2 + 0.6) * UNIT_SIZE; // 25.44m inner park
  const cycleTrackRadius = UNIT_SIZE * 5.4; // 12.96m
  const outerFootpathRadius = UNIT_SIZE * 5.8; // 13.92m
  const roadSize = UNIT_SIZE * 15; // ~36m total world extent

  // Generate grid points from -5 to +5
  const gridCoords = useMemo(() => {
    const coords: Coordinate2D[] = [];
    for (let x = -GRID_EXTENT; x <= GRID_EXTENT; x++) {
      for (let y = -GRID_EXTENT; y <= GRID_EXTENT; y++) {
        coords.push({ x, y });
      }
    }
    return coords;
  }, []);

  const axisValues = [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5];

  return (
    <group name="MasterParkTerrain">
      {/* ============================================================ */}
      {/* 1. SURROUNDING CITY STREET / ROAD */}
      {/* ============================================================ */}
      <mesh receiveShadow position={[0, -0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[75, 75]} />
        <meshStandardMaterial color="#0f172a" roughness={0.9} />
      </mesh>

      {/* Surrounding City Sidewalks underneath Buildings */}
      {/* North Sidewalk (starts at z = -21m, extends to -33m) */}
      <mesh receiveShadow position={[0, -0.02, -27]}>
        <boxGeometry args={[72, 0.08, 12]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
      </mesh>
      {/* South Sidewalk (starts at z = 21m, extends to 33m) */}
      <mesh receiveShadow position={[0, -0.02, 27]}>
        <boxGeometry args={[72, 0.08, 12]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
      </mesh>
      {/* West Sidewalk (starts at x = -21m, extends to -33m) */}
      <mesh receiveShadow position={[-27, -0.02, 0]}>
        <boxGeometry args={[12, 0.08, 72]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
      </mesh>
      {/* East Sidewalk (starts at x = 21m, extends to 33m) */}
      <mesh receiveShadow position={[27, -0.02, 0]}>
        <boxGeometry args={[12, 0.08, 72]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
      </mesh>

      {/* Road Lane Centerline Markings (Yellow Dashed Lines at R = 18.5m) */}
      {/* North Road Centerline */}
      {[-12, -8, -4, 0, 4, 8, 12].map((cx, i) => (
        <mesh key={`rd_dash_n_${i}`} position={[cx, -0.05, -18.5]}>
          <boxGeometry args={[2.2, 0.01, 0.15]} />
          <meshBasicMaterial color="#facc15" />
        </mesh>
      ))}
      {/* South Road Centerline */}
      {[-12, -8, -4, 0, 4, 8, 12].map((cx, i) => (
        <mesh key={`rd_dash_s_${i}`} position={[cx, -0.05, 18.5]}>
          <boxGeometry args={[2.2, 0.01, 0.15]} />
          <meshBasicMaterial color="#facc15" />
        </mesh>
      ))}
      {/* East Road Centerline */}
      {[-12, -8, -4, 0, 4, 8, 12].map((cz, i) => (
        <mesh key={`rd_dash_e_${i}`} position={[18.5, -0.05, cz]}>
          <boxGeometry args={[0.15, 0.01, 2.2]} />
          <meshBasicMaterial color="#facc15" />
        </mesh>
      ))}
      {/* West Road Centerline */}
      {[-12, -8, -4, 0, 4, 8, 12].map((cz, i) => (
        <mesh key={`rd_dash_w_${i}`} position={[-18.5, -0.05, cz]}>
          <boxGeometry args={[0.15, 0.01, 2.2]} />
          <meshBasicMaterial color="#facc15" />
        </mesh>
      ))}

      {/* 4 Pedestrian Zebra Crossings connecting City Sidewalk to Park Gates */}
      {/* North Gate Crosswalk */}
      <group position={[0, -0.03, -18.5]}>
        {[-1.5, -0.9, -0.3, 0.3, 0.9, 1.5].map((cx, ci) => (
          <mesh key={`crosswalk_n_${ci}`} position={[cx, 0, 0]}>
            <boxGeometry args={[0.4, 0.01, 4.8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        ))}
      </group>
      {/* South Gate Crosswalk */}
      <group position={[0, -0.03, 18.5]}>
        {[-1.5, -0.9, -0.3, 0.3, 0.9, 1.5].map((cx, ci) => (
          <mesh key={`crosswalk_s_${ci}`} position={[cx, 0, 0]}>
            <boxGeometry args={[0.4, 0.01, 4.8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        ))}
      </group>
      {/* East Gate Crosswalk */}
      <group position={[18.5, -0.03, 0]} rotation={[0, Math.PI / 2, 0]}>
        {[-1.5, -0.9, -0.3, 0.3, 0.9, 1.5].map((cx, ci) => (
          <mesh key={`crosswalk_e_${ci}`} position={[cx, 0, 0]}>
            <boxGeometry args={[0.4, 0.01, 4.8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        ))}
      </group>
      {/* West Gate Crosswalk */}
      <group position={[-18.5, -0.03, 0]} rotation={[0, Math.PI / 2, 0]}>
        {[-1.5, -0.9, -0.3, 0.3, 0.9, 1.5].map((cx, ci) => (
          <mesh key={`crosswalk_w_${ci}`} position={[cx, 0, 0]}>
            <boxGeometry args={[0.4, 0.01, 4.8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        ))}
      </group>

      {/* ============================================================ */}
      {/* 2. OUTER SIDEWALK / PEDESTRIAN FOOTPATH */}
      {/* ============================================================ */}
      <mesh receiveShadow position={[0, -0.01, 0]}>
        <boxGeometry args={[outerFootpathRadius * 2 + 1.8, 0.08, outerFootpathRadius * 2 + 1.8]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
      </mesh>

      {/* Outer Footpath Curbs */}
      <mesh position={[0, 0.04, (outerFootpathRadius * 2 + 1.8) / 2]}>
        <boxGeometry args={[outerFootpathRadius * 2 + 1.9, 0.12, 0.18]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.04, -(outerFootpathRadius * 2 + 1.8) / 2]}>
        <boxGeometry args={[outerFootpathRadius * 2 + 1.9, 0.12, 0.18]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.6} />
      </mesh>
      <mesh position={[(outerFootpathRadius * 2 + 1.8) / 2, 0.04, 0]}>
        <boxGeometry args={[0.18, 0.12, outerFootpathRadius * 2 + 1.9]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.6} />
      </mesh>
      <mesh position={[-(outerFootpathRadius * 2 + 1.8) / 2, 0.04, 0]}>
        <boxGeometry args={[0.18, 0.12, outerFootpathRadius * 2 + 1.9]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.6} />
      </mesh>

      {/* ============================================================ */}
      {/* 3. DEDICATED BRICK-RED CYCLING LANE */}
      {/* ============================================================ */}
      <mesh receiveShadow position={[0, 0.015, 0]}>
        <boxGeometry args={[cycleTrackRadius * 2 + 0.6, 0.04, cycleTrackRadius * 2 + 0.6]} />
        <meshStandardMaterial color="#b91c1c" roughness={0.8} />
      </mesh>
      {/* Cycle Lane Inner Cutout Base */}
      <mesh receiveShadow position={[0, 0.02, 0]}>
        <boxGeometry args={[cycleTrackRadius * 2 - 1.2, 0.04, cycleTrackRadius * 2 - 1.2]} />
        <meshStandardMaterial color="#4f9a3e" roughness={0.88} />
      </mesh>

      {/* ============================================================ */}
      {/* 4. PERIMETER WROUGHT-IRON FENCE & 4 ENTRANCE GATES */}
      {/* ============================================================ */}
      {/* North Fence Section */}
      <group position={[0, 0.35, -parkInnerSize / 2]}>
        <mesh position={[-6.2, 0, 0]}>
          <boxGeometry args={[10, 0.7, 0.06]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} wireframe />
        </mesh>
        <mesh position={[6.2, 0, 0]}>
          <boxGeometry args={[10, 0.7, 0.06]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} wireframe />
        </mesh>
        {/* North Entrance Arch Gate & Animated Gate Doors */}
        <group position={[0, 0.4, 0]}>
          <mesh position={[-1.2, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.12, 1.6, 8]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
          <mesh position={[1.2, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.12, 1.6, 8]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
          <mesh position={[0, 0.9, 0]}>
            <boxGeometry args={[2.6, 0.18, 0.1]} />
            <meshStandardMaterial color="#047857" />
          </mesh>

          {/* Left Swinging Gate Door */}
          <group position={[-1.2, 0, 0]} rotation={[0, -gateOpenAngle, 0]}>
            <mesh position={[0.55, 0, 0]}>
              <boxGeometry args={[1.1, 1.1, 0.04]} />
              <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} wireframe />
            </mesh>
          </group>

          {/* Right Swinging Gate Door */}
          <group position={[1.2, 0, 0]} rotation={[0, gateOpenAngle, 0]}>
            <mesh position={[-0.55, 0, 0]}>
              <boxGeometry args={[1.1, 1.1, 0.04]} />
              <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} wireframe />
            </mesh>
          </group>

          <Html position={[0, 1.3, 0]} center distanceFactor={18}>
            <div className="bg-emerald-800 text-white font-black text-[9px] px-2 py-0.5 rounded shadow whitespace-nowrap">
              {gateOpenAngle > 0.2 ? 'PARK OPEN' : 'MAIN ENTRANCE GATE'}
            </div>
          </Html>
        </group>
      </group>

      {/* South Fence Section */}
      <group position={[0, 0.35, parkInnerSize / 2]}>
        <mesh position={[-6.2, 0, 0]}>
          <boxGeometry args={[10, 0.7, 0.06]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} wireframe />
        </mesh>
        <mesh position={[6.2, 0, 0]}>
          <boxGeometry args={[10, 0.7, 0.06]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} wireframe />
        </mesh>
        {/* South Entrance Arch Gate */}
        <group position={[0, 0.4, 0]}>
          <mesh position={[-1.2, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.12, 1.6, 8]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
          <mesh position={[1.2, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.12, 1.6, 8]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
          <mesh position={[0, 0.9, 0]}>
            <boxGeometry args={[2.6, 0.18, 0.1]} />
            <meshStandardMaterial color="#047857" />
          </mesh>
          {/* South Swinging Doors */}
          <group position={[-1.2, 0, 0]} rotation={[0, -gateOpenAngle, 0]}>
            <mesh position={[0.55, 0, 0]}>
              <boxGeometry args={[1.1, 1.1, 0.04]} />
              <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} wireframe />
            </mesh>
          </group>
          <group position={[1.2, 0, 0]} rotation={[0, gateOpenAngle, 0]}>
            <mesh position={[-0.55, 0, 0]}>
              <boxGeometry args={[1.1, 1.1, 0.04]} />
              <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} wireframe />
            </mesh>
          </group>
          <Html position={[0, 1.3, 0]} center distanceFactor={18}>
            <div className="bg-emerald-800 text-white font-black text-[9px] px-2 py-0.5 rounded shadow whitespace-nowrap">
              SOUTH GATE
            </div>
          </Html>
        </group>
      </group>

      {/* East Fence Section */}
      <group position={[parkInnerSize / 2, 0.35, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh position={[-6.2, 0, 0]}>
          <boxGeometry args={[10, 0.7, 0.06]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} wireframe />
        </mesh>
        <mesh position={[6.2, 0, 0]}>
          <boxGeometry args={[10, 0.7, 0.06]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} wireframe />
        </mesh>
        {/* East Gate */}
        <group position={[0, 0.4, 0]}>
          <mesh position={[-1.2, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.12, 1.6, 8]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
          <mesh position={[1.2, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.12, 1.6, 8]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
          <mesh position={[0, 0.9, 0]}>
            <boxGeometry args={[2.6, 0.18, 0.1]} />
            <meshStandardMaterial color="#047857" />
          </mesh>
          <group position={[-1.2, 0, 0]} rotation={[0, -gateOpenAngle, 0]}>
            <mesh position={[0.55, 0, 0]}>
              <boxGeometry args={[1.1, 1.1, 0.04]} />
              <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} wireframe />
            </mesh>
          </group>
          <group position={[1.2, 0, 0]} rotation={[0, gateOpenAngle, 0]}>
            <mesh position={[-0.55, 0, 0]}>
              <boxGeometry args={[1.1, 1.1, 0.04]} />
              <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} wireframe />
            </mesh>
          </group>
        </group>
      </group>

      {/* West Fence Section */}
      <group position={[-parkInnerSize / 2, 0.35, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh position={[-6.2, 0, 0]}>
          <boxGeometry args={[10, 0.7, 0.06]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} wireframe />
        </mesh>
        <mesh position={[6.2, 0, 0]}>
          <boxGeometry args={[10, 0.7, 0.06]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} wireframe />
        </mesh>
        {/* West Gate */}
        <group position={[0, 0.4, 0]}>
          <mesh position={[-1.2, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.12, 1.6, 8]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
          <mesh position={[1.2, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.12, 1.6, 8]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
          <mesh position={[0, 0.9, 0]}>
            <boxGeometry args={[2.6, 0.18, 0.1]} />
            <meshStandardMaterial color="#047857" />
          </mesh>
          <group position={[-1.2, 0, 0]} rotation={[0, -gateOpenAngle, 0]}>
            <mesh position={[0.55, 0, 0]}>
              <boxGeometry args={[1.1, 1.1, 0.04]} />
              <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} wireframe />
            </mesh>
          </group>
          <group position={[1.2, 0, 0]} rotation={[0, gateOpenAngle, 0]}>
            <mesh position={[-0.55, 0, 0]}>
              <boxGeometry args={[1.1, 1.1, 0.04]} />
              <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} wireframe />
            </mesh>
          </group>
        </group>
      </group>

      {/* ============================================================ */}
      {/* 5. MAIN CARTESIAN PROMENADES (X-Axis & Y-Axis) */}
      {/* ============================================================ */}
      {/* X-Axis: East-West Grand Promenade */}
      <mesh receiveShadow position={[0, 0.03, 0]}>
        <boxGeometry args={[parkInnerSize, 0.05, UNIT_SIZE * 0.95]} />
        <meshStandardMaterial color="#e5ded0" roughness={0.65} />
      </mesh>
      {/* X-Axis Curbs */}
      <mesh position={[0, 0.055, UNIT_SIZE * 0.48]}>
        <boxGeometry args={[parkInnerSize, 0.08, 0.1]} />
        <meshStandardMaterial color="#a8a29e" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.055, -UNIT_SIZE * 0.48]}>
        <boxGeometry args={[parkInnerSize, 0.08, 0.1]} />
        <meshStandardMaterial color="#a8a29e" roughness={0.6} />
      </mesh>

      {/* Y-Axis: North-South Grand Promenade */}
      <mesh receiveShadow position={[0, 0.03, 0]}>
        <boxGeometry args={[UNIT_SIZE * 0.95, 0.05, parkInnerSize]} />
        <meshStandardMaterial color="#e5ded0" roughness={0.65} />
      </mesh>
      {/* Y-Axis Curbs */}
      <mesh position={[UNIT_SIZE * 0.48, 0.055, 0]}>
        <boxGeometry args={[0.1, 0.08, parkInnerSize]} />
        <meshStandardMaterial color="#a8a29e" roughness={0.6} />
      </mesh>
      <mesh position={[-UNIT_SIZE * 0.48, 0.055, 0]}>
        <boxGeometry args={[0.1, 0.08, parkInnerSize]} />
        <meshStandardMaterial color="#a8a29e" roughness={0.6} />
      </mesh>

      {/* ============================================================ */}
      {/* 6. CENTRAL ORIGIN PLAZA & GRAND TIERED FOUNTAIN (0, 0) */}
      {/* ============================================================ */}
      <group position={[0, 0, 0]}>
        {/* Raised Solid 3D Stone Dais Pavilion (eliminates any flat-plane z-fighting) */}
        <mesh receiveShadow position={[0, 0.045, 0]}>
          <cylinderGeometry args={[UNIT_SIZE * 1.35, UNIT_SIZE * 1.42, 0.08, 32]} />
          <meshStandardMaterial color="#f5f0e6" roughness={0.5} />
        </mesh>
        {/* Carved Granite Outer Trim Ring */}
        <mesh receiveShadow position={[0, 0.05, 0]}>
          <cylinderGeometry args={[UNIT_SIZE * 1.42, UNIT_SIZE * 1.46, 0.09, 32]} />
          <meshStandardMaterial color="#78716c" roughness={0.6} />
        </mesh>
        {/* Embedded Polished Brass Compass Medallion */}
        <mesh position={[0, 0.096, 0]}>
          <cylinderGeometry args={[0.7, 0.7, 0.01, 16]} />
          <meshStandardMaterial color="#d97706" metalness={0.85} roughness={0.2} />
        </mesh>

        {/* Central Major Tiered Fountain (Activates upon Question 4) */}
        <TieredFountain3D position={[0, 0.06, 0]} isFlowing={fountainActive} />

        {/* Origin Label Plaque */}
        <Html position={[0, 3.4, 0]} center distanceFactor={16}>
          <div className="bg-slate-900/95 text-amber-300 font-black text-xs px-2.5 py-1 rounded-full border border-amber-400 shadow-xl backdrop-blur-sm pointer-events-none select-none whitespace-nowrap">
            ORIGIN (0, 0) {fountainActive ? '• GRAND FOUNTAIN' : ''}
          </div>
        </Html>
      </group>



      {/* ============================================================ */}
      {/* 8. AXES COORDINATE NUMBER STONES (-5 to +5) */}
      {/* ============================================================ */}
      {axisValues.map((val) => {
        const xPos = coordToWorld({ x: val, y: 0 }, 0.05);
        const yPos = coordToWorld({ x: 0, y: val }, 0.05);

        return (
          <React.Fragment key={`axis_marker_${val}`}>
            {/* X-Axis Number Stone */}
            <group position={xPos}>
              <mesh position={[0, 0.02, 0]}>
                <cylinderGeometry args={[0.22, 0.24, 0.05, 16]} />
                <meshStandardMaterial color="#334155" roughness={0.4} />
              </mesh>
              <Html position={[0, 0.18, 0.4]} center distanceFactor={18}>
                <div className="bg-slate-900/90 text-white font-bold text-[10px] px-1.5 py-0.5 rounded border border-slate-600 shadow select-none pointer-events-none">
                  {val > 0 ? `+${val}` : `${val}`}
                </div>
              </Html>
            </group>

            {/* Y-Axis Number Stone */}
            <group position={yPos}>
              <mesh position={[0, 0.02, 0]}>
                <cylinderGeometry args={[0.22, 0.24, 0.05, 16]} />
                <meshStandardMaterial color="#334155" roughness={0.4} />
              </mesh>
              <Html position={[0.4, 0.18, 0]} center distanceFactor={18}>
                <div className="bg-slate-900/90 text-white font-bold text-[10px] px-1.5 py-0.5 rounded border border-slate-600 shadow select-none pointer-events-none">
                  {val > 0 ? `+${val}` : `${val}`}
                </div>
              </Html>
            </group>
          </React.Fragment>
        );
      })}

      {/* ============================================================ */}
      {/* 9. QUADRANT EDUCATIONAL TITLES (Removed one by one as built) */}
      {/* ============================================================ */}
      {!q1Built && (
        <Html position={[UNIT_SIZE * 3.2, 0.04, -UNIT_SIZE * 3.2]} center distanceFactor={22}>
          <div className="text-emerald-900 font-extrabold text-[11px] tracking-wider uppercase bg-white/85 px-3 py-1.5 rounded-lg border-2 border-emerald-400 shadow-md select-none pointer-events-none">
            Quadrant I (+, +) • Active Playground
          </div>
        </Html>
      )}
      {!q2Built && (
        <Html position={[-UNIT_SIZE * 3.2, 0.04, -UNIT_SIZE * 3.2]} center distanceFactor={22}>
          <div className="text-teal-900 font-extrabold text-[11px] tracking-wider uppercase bg-white/85 px-3 py-1.5 rounded-lg border-2 border-teal-400 shadow-md select-none pointer-events-none">
            Quadrant II (-, +) • Botanical Gardens
          </div>
        </Html>
      )}
      {!q3Built && (
        <Html position={[-UNIT_SIZE * 3.2, 0.04, UNIT_SIZE * 3.2]} center distanceFactor={22}>
          <div className="text-blue-900 font-extrabold text-[11px] tracking-wider uppercase bg-white/85 px-3 py-1.5 rounded-lg border-2 border-blue-400 shadow-md select-none pointer-events-none">
            Quadrant III (-, -) • Sports Complex
          </div>
        </Html>
      )}
      {!q4Built && (
        <Html position={[UNIT_SIZE * 3.2, 0.04, UNIT_SIZE * 3.2]} center distanceFactor={22}>
          <div className="text-amber-900 font-extrabold text-[11px] tracking-wider uppercase bg-white/85 px-3 py-1.5 rounded-lg border-2 border-amber-400 shadow-md select-none pointer-events-none">
            Quadrant IV (+, -) • Picnic Grove
          </div>
        </Html>
      )}

      {/* ============================================================ */}
      {/* 10. INTERACTIVE COORDINATE CLICK NODES */}
      {/* ============================================================ */}
      {gridCoords.map((coord) => {
        const isSelected = selectedPoint && selectedPoint.x === coord.x && selectedPoint.y === coord.y;
        const isPolySelected = selectedPoints.some((p) => p.x === coord.x && p.y === coord.y);
        const isHovered = hoveredPoint && hoveredPoint.x === coord.x && hoveredPoint.y === coord.y;
        const worldPos = coordToWorld(coord, 0.03);

        return (
          <group
            key={`grid_pt_${coord.x}_${coord.y}`}
            position={worldPos}
            onClick={(e) => {
              e.stopPropagation();
              onPointClick?.(coord);
            }}
          >
            {/* Subtle stone node */}
            <mesh position={[0, 0.01, 0]}>
              <cylinderGeometry args={[0.09, 0.1, 0.02, 8]} />
              <meshStandardMaterial
                color={isSelected || isPolySelected ? '#2563eb' : isHovered ? '#60a5fa' : '#6b7280'}
                roughness={0.5}
              />
            </mesh>

            {/* Surveyor Flag Pin when selected */}
            {(isSelected || isPolySelected) && (
              <group position={[0, 0, 0]}>
                <mesh position={[0, 0.4, 0]}>
                  <cylinderGeometry args={[0.02, 0.02, 0.8, 8]} />
                  <meshStandardMaterial color="#f59e0b" metalness={0.8} roughness={0.2} />
                </mesh>
                <mesh position={[0, 0.8, 0]}>
                  <sphereGeometry args={[0.12, 16, 16]} />
                  <meshStandardMaterial color="#3b82f6" emissive="#2563eb" emissiveIntensity={0.6} />
                </mesh>
                <Html position={[0, 1.15, 0]} center distanceFactor={14}>
                  <div className="bg-blue-600 text-white font-extrabold text-xs px-2 py-0.5 rounded-full shadow-lg border border-blue-200 select-none pointer-events-none whitespace-nowrap animate-bounce">
                    ({coord.x}, {coord.y})
                  </div>
                </Html>
              </group>
            )}
          </group>
        );
      })}
    </group>
  );
};
