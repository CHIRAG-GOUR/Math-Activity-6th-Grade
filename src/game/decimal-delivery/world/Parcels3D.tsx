// ============================================================
// THE DECIMAL DELIVERY NETWORK — PARCELS
//
// Renders every parcel a team owns: those on the belts, in carriers' hands, in
// the truck and in the reject pile. A fixed pool of mesh slots is reassigned
// each frame, so parcels appearing and leaving never mount or unmount React
// components mid-game.
//
// Positions come straight from the simulation, which treats every parcel
// position as its BASE; the parcel is lifted by half its own height here so a
// flat envelope and a tall crate both sit correctly on the same surface.
//
// Delivered parcels are placed from their truck cargo slot every frame, so the
// load rides out with the truck at dispatch rather than being left floating in
// the loading bay.
// ============================================================

'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GEO, MAT, PARCEL_TINTS, parcelDimensions } from './DepotMaterials';
import { sideSim, type SimParcel } from '../engine/depotSim';
import { CARGO_SLOTS, truckLocalToWorld, labelYawFor } from '../engine/depotLayout';
import { makeShippingLabel } from './canvasText';
import type { TeamId } from '../types';

/** Upper bound on parcels a team can own at once (20 truck + bin + live). */
const POOL = 52;

/** Footprint a parcel must fit when it rests in a truck slot or the bin. */
const SLOT_FIT = { w: 0.78, d: 0.95, h: 1.12 };

export const TeamParcels3D: React.FC<{ team: TeamId }> = ({ team }) => {
  const groups = useRef<(THREE.Group | null)[]>([]);
  const boxes = useRef<(THREE.Mesh | null)[]>([]);
  const labels = useRef<(THREE.Mesh | null)[]>([]);
  const tapes = useRef<(THREE.Mesh | null)[]>([]);

  const teamColor = team === 'blue' ? '#1f5fd1' : '#c9302a';

  // One tinted material per pool slot, and one label material per parcel id
  // (cached, created on first sight, disposed when the parcel is gone).
  const boxMats = useMemo(
    () => Array.from({ length: POOL }, () => MAT.cardboard.clone()),
    []
  );
  const labelCache = useRef(new Map<string, THREE.MeshStandardMaterial>());

  useEffect(() => () => {
    labelCache.current.forEach((m) => { m.map?.dispose(); m.dispose(); });
    labelCache.current.clear();
    boxMats.forEach((m) => m.dispose());
  }, [boxMats]);

  useFrame(() => {
    const side = sideSim(team);
    const live: SimParcel[] = [
      ...side.lanes.A.parcels,
      ...side.lanes.B.parcels,
      ...side.cargo,
      ...side.rejected,
    ];

    const keep = new Set<string>();

    for (let i = 0; i < POOL; i++) {
      const g = groups.current[i];
      if (!g) continue;
      const p = live[i];
      if (!p) { g.visible = false; continue; }
      g.visible = true;
      keep.add(p.id);

      let [w, h, d] = parcelDimensions(p.shape);
      // Oversized parcels settle down to their slot size so stacks in the truck
      // and the bin never overlap. During the placement arc the size blends
      // across, so nothing visibly pops.
      const fit = Math.min(1, SLOT_FIT.w / w, SLOT_FIT.d / d, SLOT_FIT.h / h);
      const blend = p.stage === 'delivered' || p.stage === 'discarded' ? 1
        : p.stage === 'placing' && p.arc ? p.arc.t : 0;
      const k = 1 + (fit - 1) * blend;
      w *= k; h *= k; d *= k;

      let px = p.pos.x;
      let py = p.pos.y;
      let pz = p.pos.z;
      let heading = p.heading;

      if (p.stage === 'delivered') {
        const slot = CARGO_SLOTS[p.slot % CARGO_SLOTS.length];
        const wp = truckLocalToWorld(side.truckPos, side.truckHeading, slot);
        px = wp.x; py = wp.y; pz = wp.z;
        heading = side.truckHeading;
      }

      g.position.set(px, py + h / 2, pz);
      g.rotation.set(0, heading, 0);

      const box = boxes.current[i];
      if (box) {
        box.scale.set(w, h, d);
        const m = boxMats[i];
        // Fragile parcels are marked with the classic red-and-white look.
        if (p.shape === 'fragile') m.color.set('#e9e4d8');
        else if (p.shape === 'tube') m.color.set('#d9d2bf');
        else if (p.shape === 'envelope' || p.shape === 'flat_parcel') m.color.set('#e8dcc2');
        else m.color.copy(PARCEL_TINTS[p.colorIndex % PARCEL_TINTS.length]);
        // Rejected parcels look a little battered in the bin.
        if (p.stage === 'discarded') m.color.multiplyScalar(0.82);
      }

      const tape = tapes.current[i];
      if (tape) {
        tape.visible = p.shape !== 'envelope' && p.shape !== 'tube';
        tape.scale.set(w * 0.14, h * 1.01, d * 1.01);
      }

      // Physical shipping label on the top face (section 52).
      const label = labels.current[i];
      if (label) {
        const size = Math.min(w, d) * 0.86;
        label.scale.set(size, size, 1);
        label.position.set(0, h / 2 + 0.006, 0);
        // Counter-rotate so the print always reads upright from the cameras,
        // whichever way the belt has turned the parcel. The label is a child of
        // the parcel (already yawed by `heading`); after laying the plane flat,
        // an in-plane Z turn maps to a world-Y turn, so -heading cancels it and
        // the text's "up" stays pointing away from the cameras (world -Z).
        // Upright for the lane's own station camera while the parcel is being
        // handled; once at rest in the truck or bin, upright for the overview.
        const handled = p.stage !== 'delivered' && p.stage !== 'discarded';
        const yaw = handled ? labelYawFor(p.lane) : 0;
        label.rotation.set(-Math.PI / 2, 0, yaw - heading);

        let mat = labelCache.current.get(p.id);
        if (!mat) {
          mat = new THREE.MeshStandardMaterial({
            map: makeShippingLabel({ ...p.label, teamColor }),
            roughness: 0.7,
          });
          labelCache.current.set(p.id, mat);
        }
        label.material = mat;
      }
    }

    // Free label textures for parcels that no longer exist.
    if (labelCache.current.size > keep.size + 8) {
      for (const [id, m] of labelCache.current) {
        if (!keep.has(id)) {
          m.map?.dispose();
          m.dispose();
          labelCache.current.delete(id);
        }
      }
    }
  });

  return (
    <group>
      {Array.from({ length: POOL }, (_, i) => (
        <group key={i} ref={(el) => { groups.current[i] = el; }} visible={false}>
          <mesh ref={(el) => { boxes.current[i] = el; }} geometry={GEO.unitBox}
            material={boxMats[i]} castShadow receiveShadow />
          <mesh ref={(el) => { tapes.current[i] = el; }} geometry={GEO.unitBox} material={MAT.tape} />
          <mesh ref={(el) => { labels.current[i] = el; }} geometry={GEO.plane} material={MAT.labelWhite} />
        </group>
      ))}
    </group>
  );
};
