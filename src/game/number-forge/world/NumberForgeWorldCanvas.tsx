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
  teamBlueAction = 'idle',
  teamRedAction = 'idle',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  // References for animation
  const gear1Ref = useRef<THREE.Mesh | null>(null);
  const gear2Ref = useRef<THREE.Mesh | null>(null);
  const gear3Ref = useRef<THREE.Mesh | null>(null);
  const blueCharRef = useRef<THREE.Group | null>(null);
  const redCharRef = useRef<THREE.Group | null>(null);
  const machineLightRef = useRef<THREE.PointLight | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. SCENE & STABLE FRONTAL CAMERA
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x382214);
    scene.fog = new THREE.FogExp2(0x382214, 0.04);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    // Stable frontal isometric camera framing the center machine perfectly
    camera.position.set(0, 3.2, 8.5);
    camera.lookAt(0, 1.4, 0);

    // 2. WEBGL RENDERER (Optimized 60FPS)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. WARM SUNLIT ILLUMINATION
    const ambientLight = new THREE.AmbientLight(0xffecd2, 1.2);
    scene.add(ambientLight);

    // Morning Sunlight pouring from Top-Left Window
    const sunLight = new THREE.DirectionalLight(0xfff1cf, 2.5);
    sunLight.position.set(-6, 8, 5);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 25;
    sunLight.shadow.bias = -0.001;
    scene.add(sunLight);

    // Warm Machine Center Glow
    const machineLight = new THREE.PointLight(0xf59e0b, 2.0, 10);
    machineLight.position.set(0, 2, 0);
    scene.add(machineLight);
    machineLightRef.current = machineLight;

    // 4. SHARED MATERIALS
    const oakWoodMat = new THREE.MeshStandardMaterial({
      color: 0x8a4b1e,
      roughness: 0.65,
      metalness: 0.1,
    });
    const darkWoodMat = new THREE.MeshStandardMaterial({
      color: 0x4a240d,
      roughness: 0.8,
      metalness: 0.05,
    });
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xdfa037,
      metalness: 0.85,
      roughness: 0.3,
    });
    const ironMat = new THREE.MeshStandardMaterial({
      color: 0x2b2f38,
      metalness: 0.7,
      roughness: 0.4,
    });
    const brickMat = new THREE.MeshStandardMaterial({
      color: 0x6e3820,
      roughness: 0.9,
    });

    // 5. WORKSHOP ROOM GEOMETRY
    // Floor
    const floorGeo = new THREE.PlaneGeometry(30, 20);
    const floor = new THREE.Mesh(floorGeo, darkWoodMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Back Wall
    const backWallGeo = new THREE.PlaneGeometry(30, 15);
    const backWall = new THREE.Mesh(backWallGeo, brickMat);
    backWall.position.set(0, 7.5, -6);
    backWall.receiveShadow = true;
    scene.add(backWall);

    // Timber Roof Beams
    for (let x = -10; x <= 10; x += 5) {
      const beam = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 15), oakWoodMat);
      beam.position.set(x, 7, 0);
      beam.castShadow = true;
      scene.add(beam);
    }

    // 6. CENTRAL NUMBER FORGE MACHINE (Located right in the middle)
    const machineGroup = new THREE.Group();
    machineGroup.position.set(0, 0, 0);

    // Heavy Cast Iron Machine Base
    const baseMesh = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.8, 2.4), ironMat);
    baseMesh.position.y = 0.4;
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    machineGroup.add(baseMesh);

    // Brass Forging Chamber
    const chamberMesh = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.4, 1.8, 16), brassMat);
    chamberMesh.position.set(0, 1.7, 0);
    chamberMesh.castShadow = true;
    machineGroup.add(chamberMesh);

    // Forging Smoke Chimney
    const chimney = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.4, 2.0, 12), ironMat);
    chimney.position.set(0, 3.2, -0.4);
    chimney.castShadow = true;
    machineGroup.add(chimney);

    // Mechanical Brass Gears on Front of Machine
    const gearGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.1, 12);
    const gear1 = new THREE.Mesh(gearGeo, brassMat);
    gear1.rotation.x = Math.PI / 2;
    gear1.position.set(-0.6, 1.8, 1.25);
    machineGroup.add(gear1);
    gear1Ref.current = gear1;

    const gear2 = new THREE.Mesh(gearGeo, brassMat);
    gear2.rotation.x = Math.PI / 2;
    gear2.position.set(0.6, 1.8, 1.25);
    machineGroup.add(gear2);
    gear2Ref.current = gear2;

    const gear3 = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.1, 8), brassMat);
    gear3.rotation.x = Math.PI / 2;
    gear3.position.set(0, 2.4, 1.15);
    machineGroup.add(gear3);
    gear3Ref.current = gear3;

    // Conveyor Rails with Wooden Blocks
    const conveyor = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.2, 0.8), darkWoodMat);
    conveyor.position.set(0, 0.9, 0.6);
    conveyor.castShadow = true;
    machineGroup.add(conveyor);

    // Carved Number Blocks on Conveyor
    for (let i = -2; i <= 2; i++) {
      const block = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), oakWoodMat);
      block.position.set(i * 0.9, 1.2, 0.6);
      block.castShadow = true;
      machineGroup.add(block);
    }

    scene.add(machineGroup);

    // 7. INVENTOR CHARACTERS (Standing deeper in scene so they NEVER block UI)
    // Team Blue Character (Stands at Left of Central Machine)
    const blueChar = new THREE.Group();
    blueChar.position.set(-2.2, 0, -0.6);

    const blueBodyMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.6 });
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xf3c59a, roughness: 0.5 });
    const apronMat = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.7 });

    // Legs
    const blueLegL = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.8), blueBodyMat);
    blueLegL.position.set(-0.2, 0.4, 0);
    blueChar.add(blueLegL);
    const blueLegR = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.8), blueBodyMat);
    blueLegR.position.set(0.2, 0.4, 0);
    blueChar.add(blueLegR);

    // Torso with Maker Apron
    const blueTorso = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.4, 0.9, 8), blueBodyMat);
    blueTorso.position.set(0, 1.2, 0);
    blueChar.add(blueTorso);
    const blueApron = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.7, 0.2), apronMat);
    blueApron.position.set(0, 1.15, 0.25);
    blueChar.add(blueApron);

    // Head with Maker Goggles
    const blueHead = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 16), skinMat);
    blueHead.position.set(0, 1.85, 0);
    blueChar.add(blueHead);
    const blueGoggles = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.06, 8, 16), brassMat);
    blueGoggles.position.set(0, 1.9, 0.2);
    blueChar.add(blueGoggles);

    scene.add(blueChar);
    blueCharRef.current = blueChar;

    // Team Red Character (Stands at Right of Central Machine)
    const redChar = new THREE.Group();
    redChar.position.set(2.2, 0, -0.6);

    const redBodyMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.6 });

    // Legs
    const redLegL = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.8), redBodyMat);
    redLegL.position.set(-0.2, 0.4, 0);
    redChar.add(redLegL);
    const redLegR = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.8), redBodyMat);
    redLegR.position.set(0.2, 0.4, 0);
    redChar.add(redLegR);

    // Torso
    const redTorso = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.4, 0.9, 8), redBodyMat);
    redTorso.position.set(0, 1.2, 0);
    redChar.add(redTorso);
    const redApron = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.7, 0.2), apronMat);
    redApron.position.set(0, 1.15, 0.25);
    redChar.add(redApron);

    // Head
    const redHead = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 16), skinMat);
    redHead.position.set(0, 1.85, 0);
    redChar.add(redHead);
    const redGoggles = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.06, 8, 16), brassMat);
    redGoggles.position.set(0, 1.9, 0.2);
    redChar.add(redGoggles);

    scene.add(redChar);
    redCharRef.current = redChar;

    // 8. 60FPS ANIMATION LOOP
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Rotate Gears
      if (gear1Ref.current) gear1Ref.current.rotation.z = elapsed * 1.5;
      if (gear2Ref.current) gear2Ref.current.rotation.z = -elapsed * 1.5;
      if (gear3Ref.current) gear3Ref.current.rotation.z = elapsed * 2.2;

      // Subtle Breathing Idle Animation for Characters
      if (blueCharRef.current) {
        blueCharRef.current.position.y = Math.sin(elapsed * 2.5) * 0.04;
      }
      if (redCharRef.current) {
        redCharRef.current.position.y = Math.cos(elapsed * 2.5) * 0.04;
      }

      // Pulse Machine Glow Light
      if (machineLightRef.current) {
        machineLightRef.current.intensity = 1.8 + Math.sin(elapsed * 3) * 0.4;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 9. WINDOW RESIZE HANDLER
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
