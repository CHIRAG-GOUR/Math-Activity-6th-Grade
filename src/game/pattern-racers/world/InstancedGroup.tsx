// ============================================================
// PATTERN RACERS — INSTANCED PLACEMENT HELPER
//
// Almost every repeated structure in this venue (grandstand tiers, barrier
// posts, tyre stacks, spectators) is the same box or cylinder placed a few
// hundred times. Instancing collapses each of those into a single draw call,
// which is the difference between a 60 FPS venue and a 25 FPS one.
// ============================================================

'use client';

import React, { useLayoutEffect, useRef } from 'react';
import * as THREE from 'three';

export interface Placement {
  x: number;
  y: number;
  z: number;
  rotY: number;
  /** Per-instance scale. Defaults to 1 on every axis. */
  sx?: number;
  sy?: number;
  sz?: number;
  /** Optional per-instance tint. */
  color?: THREE.ColorRepresentation;
}

interface Props {
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  placements: Placement[];
  castShadow?: boolean;
  receiveShadow?: boolean;
}

const tmpObj = new THREE.Object3D();
const tmpColor = new THREE.Color();

export const InstancedGroup: React.FC<Props> = ({
  geometry,
  material,
  placements,
  castShadow = false,
  receiveShadow = false,
}) => {
  const ref = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;

    let anyColor = false;
    for (let i = 0; i < placements.length; i++) {
      const p = placements[i];
      tmpObj.position.set(p.x, p.y, p.z);
      tmpObj.rotation.set(0, p.rotY, 0);
      tmpObj.scale.set(p.sx ?? 1, p.sy ?? 1, p.sz ?? 1);
      tmpObj.updateMatrix();
      mesh.setMatrixAt(i, tmpObj.matrix);

      if (p.color !== undefined) {
        anyColor = true;
        tmpColor.set(p.color);
        mesh.setColorAt(i, tmpColor);
      }
    }

    mesh.instanceMatrix.needsUpdate = true;
    if (anyColor && mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [placements, geometry, material]);

  if (placements.length === 0) return null;

  return (
    <instancedMesh
      ref={ref}
      args={[geometry, material, placements.length]}
      castShadow={castShadow}
      receiveShadow={receiveShadow}
      frustumCulled
    />
  );
};
