// ============================================================
// THE SOLAR FORGE: Physical Sunlight Beams 3D System
// Sunlight paths traveling through 3D space:
// Sun -> Heliostat Mirror -> Tower Receiver -> Central Solar Forge
// Warm golden sunlight beams with soft atmospheric falloff
// ============================================================

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { HeliostatMirrorState, ReceiverTowerState } from '../types';

interface BeamSegmentProps {
  start: [number, number, number];
  end: [number, number, number];
  radius?: number;
  opacity?: number;
  color?: string;
}

const BeamSegment: React.FC<BeamSegmentProps> = ({
  start,
  end,
  radius = 0.22,
  opacity = 0.35,
  color = '#fef08a',
}) => {
  const { position, quaternion, length } = useMemo(() => {
    const vStart = new THREE.Vector3(...start);
    const vEnd = new THREE.Vector3(...end);
    const dir = new THREE.Vector3().subVectors(vEnd, vStart);
    const len = dir.length();

    if (len < 0.001) {
      return {
        position: vStart,
        quaternion: new THREE.Quaternion(),
        length: 0.001,
      };
    }

    dir.normalize();
    const mid = new THREE.Vector3().addVectors(vStart, vEnd).multiplyScalar(0.5);
    const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);

    return {
      position: mid,
      quaternion: quat,
      length: len,
    };
  }, [start, end]);

  return (
    <group position={position} quaternion={quaternion}>
      {/* Soft outer atmospheric sunlight shaft */}
      <mesh>
        <cylinderGeometry args={[radius * 1.8, radius * 1.8, length, 12, 1, true]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={opacity * 0.45}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      {/* Concentrated inner solar core */}
      <mesh>
        <cylinderGeometry args={[radius, radius, length, 12, 1, true]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={opacity}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};

interface SunlightBeams3DProps {
  sunPosition: [number, number, number];
  blueMirrors: HeliostatMirrorState[];
  redMirrors: HeliostatMirrorState[];
  blueReceiver: ReceiverTowerState;
  redReceiver: ReceiverTowerState;
  centralForgePosition?: [number, number, number];
  isBlueActive?: boolean;
  isRedActive?: boolean;
  isForgeActive?: boolean;
}

export const SunlightBeams3D: React.FC<SunlightBeams3DProps> = ({
  sunPosition,
  blueMirrors,
  redMirrors,
  blueReceiver,
  redReceiver,
  centralForgePosition = [0, 18, -35],
  isBlueActive = false,
  isRedActive = false,
  isForgeActive = false,
}) => {
  // Mirror 0 reflection point
  const blueM0 = blueMirrors[0]?.position || [-24, 0, -6];
  const redM0 = redMirrors[0]?.position || [24, 0, -6];

  // Elevated mirror pivot coordinates
  const blueMirrorPivot: [number, number, number] = [blueM0[0], blueM0[1] + 3.6, blueM0[2]];
  const redMirrorPivot: [number, number, number] = [redM0[0], redM0[1] + 3.6, redM0[2]];

  // Receiver target coordinates
  const blueRecTop: [number, number, number] = [blueReceiver.position[0], blueReceiver.position[1] + 12, blueReceiver.position[2]];
  const redRecTop: [number, number, number] = [redReceiver.position[0], redReceiver.position[1] + 12, redReceiver.position[2]];

  return (
    <group>
      {/* ── 1. INCOMING SUNLIGHT FROM SKY TO BLUE & RED HELIOSTATS ── */}
      <BeamSegment
        start={sunPosition}
        end={blueMirrorPivot}
        radius={0.35}
        opacity={0.3}
        color="#fef9c3"
      />
      <BeamSegment
        start={sunPosition}
        end={redMirrorPivot}
        radius={0.35}
        opacity={0.3}
        color="#fef9c3"
      />

      {/* ── 2. REFLECTED BEAM: HELIOSTAT -> TEAM RECEIVER TOWER ── */}
      {isBlueActive && (
        <BeamSegment
          start={blueMirrorPivot}
          end={blueRecTop}
          radius={0.4}
          opacity={0.55}
          color="#bae6fd"
        />
      )}
      {isRedActive && (
        <BeamSegment
          start={redMirrorPivot}
          end={redRecTop}
          radius={0.4}
          opacity={0.55}
          color="#fecdd3"
        />
      )}

      {/* ── 3. SECONDARY BEAM: RECEIVER TOWER -> CENTRAL SOLAR FORGE ── */}
      {(isBlueActive || isForgeActive) && (
        <BeamSegment
          start={blueRecTop}
          end={centralForgePosition}
          radius={0.5}
          opacity={0.65}
          color="#38bdf8"
        />
      )}
      {(isRedActive || isForgeActive) && (
        <BeamSegment
          start={redRecTop}
          end={centralForgePosition}
          radius={0.5}
          opacity={0.65}
          color="#f87171"
        />
      )}

      {/* ── 4. CONVERGENCE HALO AT CENTRAL FORGE ── */}
      {(isBlueActive || isRedActive || isForgeActive) && (
        <mesh position={centralForgePosition}>
          <sphereGeometry args={[2.4, 16, 16]} />
          <meshBasicMaterial
            color="#fef08a"
            transparent
            opacity={0.45}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
};
