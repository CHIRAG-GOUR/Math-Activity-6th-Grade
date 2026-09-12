// ============================================================
// PATTERN RACERS — TRACK GEOMETRY BUILDERS
//
// Road surfaces are built as continuous ribbons swept along a Circuit, not as
// rows of instanced boxes. Two reasons:
//   - A rigid box fanned around a curve leaves wedge-shaped gaps at its
//     corners. The old build did exactly this and the road visibly came apart
//     on every bend.
//   - A ribbon is ONE draw call for the whole 1204 m lap instead of 300.
//
// Every ribbon gets a skirt down to ground level so the road reads as a solid
// slab with real thickness rather than a floating sheet of paper.
// ============================================================

import * as THREE from 'three';
import { Circuit } from '../engine/circuit';

export interface RibbonOptions {
  /** Lateral offset of the ribbon's left edge, metres (negative = left). */
  from: number;
  /** Lateral offset of the ribbon's right edge. */
  to: number;
  /** Height of the surface above y=0. */
  y: number;
  /** Sample spacing along the path. Smaller = smoother curves. */
  step?: number;
  /** Drop a vertical skirt from the surface down to this height. */
  skirtTo?: number;
  /** Repeats of the texture/UV along the path, per metre. */
  uvPerMetre?: number;
}

/**
 * Sweep a flat ribbon along a circuit. For closed circuits the ribbon wraps
 * seamlessly; for open paths (the pit lane) it simply ends.
 */
export function buildRibbon(circuit: Circuit, opts: RibbonOptions): THREE.BufferGeometry {
  const { from, to, y, step = 4, skirtTo, uvPerMetre = 0.08 } = opts;

  const count = Math.max(2, Math.round(circuit.length / step));
  const spacing = circuit.length / count;
  // A closed loop needs one extra ring that duplicates the first, so the final
  // quad bridges the seam.
  const rings = circuit.closed ? count + 1 : count + 1;

  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let i = 0; i < rings; i++) {
    const s = i * spacing;
    const f = circuit.sampleAt(circuit.closed ? s : Math.min(s, circuit.length));

    const lx = f.x + f.rx * from;
    const lz = f.z + f.rz * from;
    const rx = f.x + f.rx * to;
    const rz = f.z + f.rz * to;

    positions.push(lx, y, lz, rx, y, rz);
    normals.push(0, 1, 0, 0, 1, 0);
    const v = s * uvPerMetre;
    uvs.push(0, v, 1, v);
  }

  for (let i = 0; i < rings - 1; i++) {
    const a = i * 2;
    const b = a + 1;
    const c = a + 2;
    const d = a + 3;
    indices.push(a, c, b, b, c, d);
  }

  // ── SKIRTS ──
  // Vertical faces down each edge so the slab has visible depth.
  if (skirtTo !== undefined) {
    for (const side of [0, 1]) {
      const offset = side === 0 ? from : to;
      const base = positions.length / 3;

      for (let i = 0; i < rings; i++) {
        const s = i * spacing;
        const f = circuit.sampleAt(circuit.closed ? s : Math.min(s, circuit.length));
        const px = f.x + f.rx * offset;
        const pz = f.z + f.rz * offset;
        // Outward normal is the track normal, flipped for the left edge.
        const nx = side === 0 ? -f.rx : f.rx;
        const nz = side === 0 ? -f.rz : f.rz;

        positions.push(px, y, pz, px, skirtTo, pz);
        normals.push(nx, 0, nz, nx, 0, nz);
        const v = s * uvPerMetre;
        uvs.push(0, v, 1, v);
      }

      for (let i = 0; i < rings - 1; i++) {
        const a = base + i * 2;
        const b = a + 1;
        const c = a + 2;
        const d = a + 3;
        // Wind each side so both skirts face outward.
        if (side === 0) indices.push(a, b, c, b, d, c);
        else indices.push(a, c, b, b, c, d);
      }
    }
  }

  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  g.setIndex(indices);
  g.computeBoundingSphere();
  return g;
}

/**
 * Dashed ribbon, for lane markings and pit-lane guide lines. Emits a separate
 * quad per dash so the gaps are real geometry rather than an alpha texture —
 * nothing in this world is allowed to rely on transparency.
 */
export function buildDashedLine(
  circuit: Circuit,
  lateral: number,
  y: number,
  width: number,
  dashLength: number,
  gapLength: number
): THREE.BufferGeometry {
  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  const period = dashLength + gapLength;
  const dashes = Math.floor(circuit.length / period);
  let vi = 0;

  for (let d = 0; d < dashes; d++) {
    const s0 = d * period;
    const s1 = s0 + dashLength;

    for (const s of [s0, s1]) {
      const f = circuit.sampleAt(s);
      const cx = f.x + f.rx * lateral;
      const cz = f.z + f.rz * lateral;
      positions.push(
        cx - f.rx * width * 0.5, y, cz - f.rz * width * 0.5,
        cx + f.rx * width * 0.5, y, cz + f.rz * width * 0.5
      );
      normals.push(0, 1, 0, 0, 1, 0);
      uvs.push(0, s === s0 ? 0 : 1, 1, s === s0 ? 0 : 1);
    }

    indices.push(vi, vi + 2, vi + 1, vi + 1, vi + 2, vi + 3);
    vi += 4;
  }

  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  g.setIndex(indices);
  g.computeBoundingSphere();
  return g;
}

/**
 * Alternating red/white kerb built as one geometry with vertex colours, so a
 * full kerb run is a single draw call and still reads as striped.
 */
export function buildKerb(
  circuit: Circuit,
  from: number,
  to: number,
  y: number,
  stripeLength = 3
): THREE.BufferGeometry {
  const g = buildRibbon(circuit, { from, to, y, step: stripeLength, skirtTo: y - 0.12 });

  const pos = g.getAttribute('position');
  const colors = new Float32Array(pos.count * 3);
  const red = new THREE.Color('#e11d48');
  const white = new THREE.Color('#f8fafc');

  // Two vertices per ring; alternate colour every ring.
  for (let i = 0; i < pos.count; i++) {
    const ring = Math.floor(i / 2);
    const c = ring % 2 === 0 ? red : white;
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  return g;
}

/** A flat quad across the track, used for the start/finish line and grid boxes. */
export function buildCrossQuad(
  circuit: Circuit,
  s: number,
  halfWidth: number,
  length: number,
  y: number
): THREE.BufferGeometry {
  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];

  const a = circuit.sampleAt(s - length / 2);
  const b = circuit.sampleAt(s + length / 2);

  const p = [
    [a.x - a.rx * halfWidth, a.z - a.rz * halfWidth],
    [a.x + a.rx * halfWidth, a.z + a.rz * halfWidth],
    [b.x - b.rx * halfWidth, b.z - b.rz * halfWidth],
    [b.x + b.rx * halfWidth, b.z + b.rz * halfWidth],
  ];

  for (const [px, pz] of p) {
    positions.push(px, y, pz);
    normals.push(0, 1, 0);
  }
  uvs.push(0, 0, 1, 0, 0, 1, 1, 1);

  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  g.setIndex([0, 2, 1, 1, 2, 3]);
  g.computeBoundingSphere();
  return g;
}

/**
 * Checkerboard texture for the start/finish line, generated on a canvas so no
 * external asset is needed (and no CDN request that could fail).
 */
export function makeCheckerTexture(squares = 8): THREE.Texture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const cell = size / squares;

  for (let y = 0; y < squares; y++) {
    for (let x = 0; x < squares; x++) {
      ctx.fillStyle = (x + y) % 2 === 0 ? '#f8fafc' : '#1e293b';
      ctx.fillRect(x * cell, y * cell, cell, cell);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(6, 1);
  tex.anisotropy = 4;
  return tex;
}

/** Fine asphalt noise, so the road is not a flat untextured colour. */
export function makeAsphaltTexture(): THREE.Texture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#3f434a';
  ctx.fillRect(0, 0, size, size);

  // Deterministic speckle — a hash, not Math.random, so every client and every
  // reload produces an identical surface.
  const img = ctx.getImageData(0, 0, size, size);
  for (let i = 0; i < img.data.length; i += 4) {
    const p = i / 4;
    const h = (p * 2654435761) % 4294967296;
    const n = ((h / 4294967296) - 0.5) * 34;
    img.data[i] = Math.max(0, Math.min(255, img.data[i] + n));
    img.data[i + 1] = Math.max(0, Math.min(255, img.data[i + 1] + n));
    img.data[i + 2] = Math.max(0, Math.min(255, img.data[i + 2] + n));
  }
  ctx.putImageData(img, 0, 0);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 60);
  tex.anisotropy = 4;
  return tex;
}

/** Mown-stripe grass, which reads as a real venue rather than a green plane. */
export function makeGrassTexture(): THREE.Texture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  for (let y = 0; y < size; y++) {
    const band = Math.floor(y / 32) % 2 === 0;
    ctx.fillStyle = band ? '#4e9a45' : '#57a94c';
    ctx.fillRect(0, y, size, 1);
  }

  const img = ctx.getImageData(0, 0, size, size);
  for (let i = 0; i < img.data.length; i += 4) {
    const p = i / 4;
    const h = (p * 1103515245 + 12345) % 4294967296;
    const n = ((h / 4294967296) - 0.5) * 18;
    img.data[i] = Math.max(0, Math.min(255, img.data[i] + n));
    img.data[i + 1] = Math.max(0, Math.min(255, img.data[i + 1] + n));
    img.data[i + 2] = Math.max(0, Math.min(255, img.data[i + 2] + n));
  }
  ctx.putImageData(img, 0, 0);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(90, 90);
  return tex;
}
