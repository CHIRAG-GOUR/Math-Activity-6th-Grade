'use client';

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { CharacterAction, ForgeZone } from '../types';

interface NumberForgeWorldCanvasProps {
  activeZone?: ForgeZone;
  teamBlueAction?: CharacterAction;
  teamRedAction?: CharacterAction;
}

export const NumberForgeWorldCanvas: React.FC<NumberForgeWorldCanvasProps> = ({
  activeZone = 'tower',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  // References for animation
  const gear1Ref = useRef<THREE.Mesh | null>(null);
  const gear2Ref = useRef<THREE.Mesh | null>(null);
  const gear3Ref = useRef<THREE.Mesh | null>(null);
  const gear4Ref = useRef<THREE.Mesh | null>(null);
  const numberWheelRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. SCENE & BRIGHT SUNLIT BACKGROUND
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfbf7ee); // Light warm cream sunlit background
    scene.fog = new THREE.FogExp2(0xfbf7ee, 0.03);

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    // Stable frontal isometric camera framing the central workshop machine
    camera.position.set(0, 3.0, 9.2);
    camera.lookAt(0, 1.3, 0);

    // 2. WEBGL RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. BRIGHT, WARM DAYLIGHT & SUNBEAMS
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xfde68a, 1.4);
    scene.add(hemiLight);

    // Warm Sunbeam Light
    const sunLight = new THREE.DirectionalLight(0xfffaed, 2.2);
    sunLight.position.set(-5, 9, 6);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    // Gentle Golden Accent Point Light
    const brassLight = new THREE.PointLight(0xf59e0b, 1.5, 8);
    brassLight.position.set(0, 2.5, 1.5);
    scene.add(brassLight);

    // 4. ELEGANT WORKSHOP MATERIALS (Clean, Light & Polished)
    const honeyWoodMat = new THREE.MeshStandardMaterial({
      color: 0xd49b5c,
      roughness: 0.5,
      metalness: 0.05,
    });
    const creamWallMat = new THREE.MeshStandardMaterial({
      color: 0xf5ebd9,
      roughness: 0.9,
    });
    const polishedBrassMat = new THREE.MeshStandardMaterial({
      color: 0xe5a93b,
      metalness: 0.85,
      roughness: 0.25,
    });
    const polishedCopperMat = new THREE.MeshStandardMaterial({
      color: 0xc86432,
      metalness: 0.8,
      roughness: 0.3,
    });
    const steelMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      metalness: 0.7,
      roughness: 0.35,
    });
    const parchmentMat = new THREE.MeshStandardMaterial({
      color: 0xfef3c7,
      roughness: 0.8,
    });

    // 5. SUNLIT WORKSHOP ROOM
    // Light Honey Wood Plank Floor
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(32, 24), honeyWoodMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Bright Cream Back Wall with Timber Trusses
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(32, 16), creamWallMat);
    backWall.position.set(0, 8, -6);
    backWall.receiveShadow = true;
    scene.add(backWall);

    // Large Arched Window on Back Wall with Sunny Sky View
    const windowFrame = new THREE.Mesh(new THREE.TorusGeometry(2.4, 0.15, 8, 32), honeyWoodMat);
    windowFrame.position.set(0, 6.5, -5.9);
    scene.add(windowFrame);

    const windowGlass = new THREE.Mesh(
      new THREE.CircleGeometry(2.35, 32),
      new THREE.MeshBasicMaterial({ color: 0xe0f2fe })
    );
    windowGlass.position.set(0, 6.5, -5.95);
    scene.add(windowGlass);

    // 6. CENTRAL MATHEMATICAL FORGE MACHINE (Clean, Stylized, Architectural)
    const machineGroup = new THREE.Group();
    machineGroup.position.set(0, 0, 0);

    // Solid Oak Workbench Base
    const tableTop = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.3, 2.2), honeyWoodMat);
    tableTop.position.set(0, 1.0, 0);
    tableTop.castShadow = true;
    tableTop.receiveShadow = true;
    machineGroup.add(tableTop);

    // Sturdy Table Legs
    const legPositions = [
      [-2.1, 0.5, 0.9],
      [2.1, 0.5, 0.9],
      [-2.1, 0.5, -0.9],
      [2.1, 0.5, -0.9],
    ];
    legPositions.forEach(([x, y, z]) => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.25, 1.0, 0.25), honeyWoodMat);
      leg.position.set(x, y, z);
      leg.castShadow = true;
      machineGroup.add(leg);
    });

    // Central Place-Value Machine Pedestal
    const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.0, 1.2, 16), polishedCopperMat);
    pedestal.position.set(0, 1.7, 0);
    pedestal.castShadow = true;
    machineGroup.add(pedestal);

    // Revolving Mathematical Number Dial Drum
    const dialGroup = new THREE.Group();
    dialGroup.position.set(0, 2.6, 0);

    const drumMesh = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 0.6, 24), polishedBrassMat);
    drumMesh.rotation.x = Math.PI / 2;
    drumMesh.castShadow = true;
    dialGroup.add(drumMesh);

    // Carved Number Facets around Drum
    for (let a = 0; a < 8; a++) {
      const angle = (a / 8) * Math.PI * 2;
      const notch = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.55, 0.08), steelMat);
      notch.position.set(Math.cos(angle) * 1.1, Math.sin(angle) * 1.1, 0);
      notch.rotation.z = angle;
      dialGroup.add(notch);
    }
    machineGroup.add(dialGroup);
    numberWheelRef.current = dialGroup;

    // Interlocking Brass Gears on Front of Pedestal
    const gearGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.08, 12);
    const gear1 = new THREE.Mesh(gearGeo, polishedBrassMat);
    gear1.rotation.x = Math.PI / 2;
    gear1.position.set(-0.55, 1.7, 0.85);
    gear1.castShadow = true;
    machineGroup.add(gear1);
    gear1Ref.current = gear1;

    const gear2 = new THREE.Mesh(gearGeo, polishedBrassMat);
    gear2.rotation.x = Math.PI / 2;
    gear2.position.set(0.55, 1.7, 0.85);
    gear2.castShadow = true;
    machineGroup.add(gear2);
    gear2Ref.current = gear2;

    const gear3 = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.08, 8), polishedCopperMat);
    gear3.rotation.x = Math.PI / 2;
    gear3.position.set(0, 2.1, 0.88);
    machineGroup.add(gear3);
    gear3Ref.current = gear3;

    // Blueprint Scroll on Table Surface
    const scroll = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.9), parchmentMat);
    scroll.rotation.x = -Math.PI / 2;
    scroll.position.set(0, 1.16, 0.4);
    scroll.receiveShadow = true;
    machineGroup.add(scroll);

    // Brass Caliper & Tool on Table
    const caliper = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.04, 0.15), polishedBrassMat);
    caliper.position.set(1.2, 1.17, 0.4);
    caliper.rotation.y = 0.4;
    machineGroup.add(caliper);

    scene.add(machineGroup);

    // 7. 60FPS SMOOTH ANIMATION LOOP
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth gear interlocking spin
      if (gear1Ref.current) gear1Ref.current.rotation.z = elapsed * 1.2;
      if (gear2Ref.current) gear2Ref.current.rotation.z = -elapsed * 1.2;
      if (gear3Ref.current) gear3Ref.current.rotation.z = elapsed * 1.8;

      // Slow majestic rotation of central mathematical drum
      if (numberWheelRef.current) {
        numberWheelRef.current.rotation.z = elapsed * 0.3;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 8. RESIZE HANDLER
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
    />
  );
};
