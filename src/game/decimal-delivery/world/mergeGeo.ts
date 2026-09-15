// ============================================================
// THE DECIMAL DELIVERY NETWORK — STATIC GEOMETRY BATCHING
//
// Everything that never moves relative to its parent (conveyor frames, rails,
// legs, the skyline) is baked into one merged geometry per material. The scene
// is drawn up to three times a frame (overview plus both station windows), so
// every draw call saved here is saved three times over.
// ============================================================

import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export interface BoxPart {
  x: number; y: number; z: number;
  /** Rotation about Y, radians. */
  ry?: number;
  sx: number; sy: number; sz: number;
}

const unitBox = new THREE.BoxGeometry(1, 1, 1);
const unitCyl = new THREE.CylinderGeometry(0.5, 0.5, 1, 8);
const unitCone = new THREE.ConeGeometry(0.5, 1, 7);

const m = new THREE.Matrix4();
const q = new THREE.Quaternion();
const e = new THREE.Euler();
const p = new THREE.Vector3();
const s = new THREE.Vector3();

function bake(base: THREE.BufferGeometry, parts: BoxPart[]): THREE.BufferGeometry {
  if (parts.length === 0) return new THREE.BufferGeometry();
  const geos = parts.map((part) => {
    e.set(0, part.ry ?? 0, 0);
    q.setFromEuler(e);
    p.set(part.x, part.y, part.z);
    s.set(part.sx, part.sy, part.sz);
    m.compose(p, q, s);
    // Drop the uv/normal differences between primitives so any mix can merge.
    const g = base.clone().applyMatrix4(m);
    return g;
  });
  const merged = mergeGeometries(geos, false) ?? new THREE.BufferGeometry();
  geos.forEach((g) => g.dispose());
  merged.computeBoundingSphere();
  return merged;
}

export const mergeBoxes = (parts: BoxPart[]) => bake(unitBox, parts);
export const mergeCylinders = (parts: BoxPart[]) => bake(unitCyl, parts);
export const mergeCones = (parts: BoxPart[]) => bake(unitCone, parts);

/** Transform a local part through a parent position + heading. */
export function place(parentX: number, parentZ: number, heading: number, part: BoxPart): BoxPart {
  const c = Math.cos(heading);
  const sn = Math.sin(heading);
  return {
    ...part,
    x: parentX + part.x * c + part.z * sn,
    z: parentZ - part.x * sn + part.z * c,
    ry: (part.ry ?? 0) + heading,
  };
}
