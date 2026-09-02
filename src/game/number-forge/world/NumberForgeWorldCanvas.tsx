'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { ForgeZone, CharacterAction } from '../types';

interface NumberForgeWorldCanvasProps {
  activeZone: ForgeZone;
  teamBlueAction?: CharacterAction;
  teamRedAction?: CharacterAction;
}

export const NumberForgeWorldCanvas: React.FC<NumberForgeWorldCanvasProps> = ({
  activeZone,
  teamBlueAction = 'idle',
  teamRedAction = 'idle',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const gearsRef = useRef<THREE.Mesh[]>([]);
  const charBlueRef = useRef<THREE.Group | null>(null);
  const charRedRef = useRef<THREE.Group | null>(null);
  const lanternsRef = useRef<THREE.Group[]>([]);

  // Target camera positions for each Zone
  const zoneCameraTargets: Record<ForgeZone, { pos: THREE.Vector3; target: THREE.Vector3 }> = {
    'workshop': {
      pos: new THREE.Vector3(0, 4.5, 9.5),
      target: new THREE.Vector3(0, 1.8, 0),
    },
    'tower': {
      pos: new THREE.Vector3(-2.5, 4.0, 7.5),
      target: new THREE.Vector3(-1.0, 2.5, 0),
    },
    'rounding-track': {
      pos: new THREE.Vector3(2.5, 3.8, 7.0),
      target: new THREE.Vector3(1.2, 1.5, 0),
    },
    'detection-lab': {
      pos: new THREE.Vector3(-1.5, 4.2, 8.0),
      target: new THREE.Vector3(0, 2.0, -1.0),
    },
    'blueprint-chamber': {
      pos: new THREE.Vector3(0, 5.0, 7.5),
      target: new THREE.Vector3(0, 1.2, -0.5),
    },
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. SCENE SETUP
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xf6e5cb); // Warm amber morning workshop tone
    scene.fog = new THREE.FogExp2(0xf6e5cb, 0.035);

    // 2. CAMERA SETUP
    const aspect = container.clientWidth / container.clientHeight;
    const camera = new THREE.PerspectiveCamera(42, aspect, 0.1, 100);
    camera.position.set(0, 4.5, 9.5);
    camera.lookAt(0, 1.8, 0);
    cameraRef.current = camera;

    // 3. RENDERER SETUP (Optimized for 60FPS)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. WARM CINEMATIC WORKSHOP LIGHTING
    // Ambient fill
    const ambientLight = new THREE.AmbientLight(0xffecd2, 0.85);
    scene.add(ambientLight);

    // Golden Sunlight pouring from arched window (left side)
    const sunLight = new THREE.DirectionalLight(0xffeedd, 1.6);
    sunLight.position.set(-8, 9, 5);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 25;
    sunLight.shadow.camera.left = -7;
    sunLight.shadow.camera.right = 7;
    sunLight.shadow.camera.top = 7;
    sunLight.shadow.camera.bottom = -7;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    // Warm Brass Fill Light
    const brassLight = new THREE.PointLight(0xffb040, 1.2, 12);
    brassLight.position.set(2, 3.5, 2);
    scene.add(brassLight);

    // 5. TEXTURES & PROCEDURAL MATERIALS
    const woodMat = new THREE.MeshStandardMaterial({
      color: 0x9c5c2a,
      roughness: 0.65,
      metalness: 0.05,
    });
    const darkWoodMat = new THREE.MeshStandardMaterial({
      color: 0x6e3b18,
      roughness: 0.7,
      metalness: 0.05,
    });
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xe0a93b,
      roughness: 0.3,
      metalness: 0.85,
    });
    const ironMat = new THREE.MeshStandardMaterial({
      color: 0x3d434c,
      roughness: 0.5,
      metalness: 0.6,
    });
    const parchmentMat = new THREE.MeshStandardMaterial({
      color: 0xfff4dc,
      roughness: 0.85,
      metalness: 0.0,
    });
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0xedd6b4,
      roughness: 0.9,
    });

    // 6. BUILD WORKSHOP ENVIRONMENT
    // Workshop Room Floor
    const floorGeo = new THREE.PlaneGeometry(24, 20);
    const floor = new THREE.Mesh(floorGeo, darkWoodMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Back Wall
    const backWallGeo = new THREE.PlaneGeometry(24, 12);
    const backWall = new THREE.Mesh(backWallGeo, wallMat);
    backWall.position.set(0, 6, -6);
    backWall.receiveShadow = true;
    scene.add(backWall);

    // Left Wall with Arched Window Frame
    const leftWallGeo = new THREE.PlaneGeometry(20, 12);
    const leftWall = new THREE.Mesh(leftWallGeo, wallMat);
    leftWall.position.set(-10, 6, 0);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.receiveShadow = true;
    scene.add(leftWall);

    // Arched Window on Left Wall
    const windowFrameGroup = new THREE.Group();
    windowFrameGroup.position.set(-9.9, 4.5, 0);
    windowFrameGroup.rotation.y = Math.PI / 2;
    const windowOuter = new THREE.Mesh(new THREE.BoxGeometry(4.5, 5.5, 0.2), woodMat);
    const windowGlass = new THREE.Mesh(
      new THREE.PlaneGeometry(3.8, 4.8),
      new THREE.MeshBasicMaterial({ color: 0xfff0d0, transparent: true, opacity: 0.75 })
    );
    windowFrameGroup.add(windowOuter, windowGlass);
    scene.add(windowFrameGroup);

    // Beams & Roof Trusses
    const beamGeo = new THREE.BoxGeometry(0.5, 0.5, 20);
    const leftBeam = new THREE.Mesh(beamGeo, darkWoodMat);
    leftBeam.position.set(-6, 7.5, 0);
    const rightBeam = new THREE.Mesh(beamGeo, darkWoodMat);
    rightBeam.position.set(6, 7.5, 0);
    scene.add(leftBeam, rightBeam);

    // 7. MECHANICAL GEARS ON BACK WALL
    const gearList: THREE.Mesh[] = [];
    const createGear = (radius: number, x: number, y: number, z: number, speed: number) => {
      const gearGeo = new THREE.CylinderGeometry(radius, radius, 0.15, 16);
      const gear = new THREE.Mesh(gearGeo, brassMat);
      gear.position.set(x, y, z);
      gear.rotation.x = Math.PI / 2;
      gear.castShadow = true;
      gear.userData = { speed };
      scene.add(gear);
      gearList.push(gear);
    };
    createGear(1.2, -3.5, 6.2, -5.8, 0.01);
    createGear(0.8, -1.8, 6.5, -5.8, -0.015);
    createGear(1.5, 2.8, 5.8, -5.8, 0.008);
    createGear(0.9, 4.8, 6.4, -5.8, -0.012);
    gearsRef.current = gearList;

    // 8. CENTER INVENTOR WORKBENCH (Hero Desk)
    const deskGroup = new THREE.Group();
    deskGroup.position.set(0, 0, 0);

    // Tabletop
    const tabletop = new THREE.Mesh(new THREE.BoxGeometry(7.0, 0.35, 3.2), woodMat);
    tabletop.position.set(0, 1.6, 0);
    tabletop.castShadow = true;
    tabletop.receiveShadow = true;

    // Table legs
    const legGeo = new THREE.BoxGeometry(0.35, 1.6, 0.35);
    const leg1 = new THREE.Mesh(legGeo, darkWoodMat);
    leg1.position.set(-3.2, 0.8, 1.3);
    const leg2 = new THREE.Mesh(legGeo, darkWoodMat);
    leg2.position.set(3.2, 0.8, 1.3);
    const leg3 = new THREE.Mesh(legGeo, darkWoodMat);
    leg3.position.set(-3.2, 0.8, -1.3);
    const leg4 = new THREE.Mesh(legGeo, darkWoodMat);
    leg4.position.set(3.2, 0.8, -1.3);
    deskGroup.add(tabletop, leg1, leg2, leg3, leg4);

    // Drafting Board & Calipers on Table
    const draftBoard = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.1, 1.6), parchmentMat);
    draftBoard.position.set(-1.8, 1.85, 0.2);
    draftBoard.rotation.x = -0.2;
    deskGroup.add(draftBoard);

    // Place Value Slot Dispenser (Brass Casing)
    const dispenser = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.4, 1.2), brassMat);
    dispenser.position.set(1.6, 2.3, 0);
    dispenser.castShadow = true;
    deskGroup.add(dispenser);

    // Physical Carved Wooden Number Blocks on Desk
    const blockGeo = new THREE.BoxGeometry(0.4, 0.4, 0.4);
    const blockColors = [0xef4444, 0x3b82f6, 0x10b981, 0xf59e0b, 0x8b5cf6];
    for (let i = 0; i < 5; i++) {
      const blockMat = new THREE.MeshStandardMaterial({ color: blockColors[i], roughness: 0.4 });
      const block = new THREE.Mesh(blockGeo, blockMat);
      block.position.set(-0.8 + i * 0.45, 1.95, 0.6);
      block.rotation.y = (i * 0.2) - 0.4;
      block.castShadow = true;
      deskGroup.add(block);
    }

    scene.add(deskGroup);

    // 9. STYLIZED 3D INVENTOR CHARACTERS (Team Blue on Left, Team Red on Right)
    const createStylizedCharacter = (colorHex: number, apronHex: number, x: number) => {
      const charGroup = new THREE.Group();
      charGroup.position.set(x, 0, 1.5);

      // Body / Apron
      const body = new THREE.Mesh(
        new THREE.CylinderGeometry(0.35, 0.45, 1.2, 16),
        new THREE.MeshStandardMaterial({ color: apronHex, roughness: 0.6 })
      );
      body.position.y = 1.3;
      body.castShadow = true;

      // Shirt / Chest
      const shirt = new THREE.Mesh(
        new THREE.SphereGeometry(0.38, 16, 16),
        new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.5 })
      );
      shirt.position.y = 1.8;
      shirt.castShadow = true;

      // Head
      const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.32, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0xffd8b4, roughness: 0.7 })
      );
      head.position.y = 2.35;
      head.castShadow = true;

      // Goggles on Forehead
      const goggles = new THREE.Mesh(
        new THREE.TorusGeometry(0.18, 0.06, 8, 16),
        brassMat
      );
      goggles.position.set(0, 2.45, 0.22);
      goggles.rotation.x = Math.PI / 2;

      // Arms
      const armMat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.5 });
      const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.6), armMat);
      leftArm.position.set(-0.45, 1.6, 0);
      leftArm.rotation.z = 0.3;
      const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.6), armMat);
      rightArm.position.set(0.45, 1.6, 0);
      rightArm.rotation.z = -0.3;

      charGroup.add(body, shirt, head, goggles, leftArm, rightArm);
      scene.add(charGroup);
      return charGroup;
    };

    // Team Blue Inventor Character (Leo)
    charBlueRef.current = createStylizedCharacter(0x2563eb, 0x1e3a8a, -2.8);
    // Team Red Inventor Character (Maya)
    charRedRef.current = createStylizedCharacter(0xd97706, 0x991b1b, 2.8);

    // 10. ANIMATION LOOP (60FPS)
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Spin gears smoothly
      gearsRef.current.forEach((gear) => {
        gear.rotation.z += gear.userData.speed || 0.01;
      });

      // Character procedural breathing / action animations
      if (charBlueRef.current) {
        charBlueRef.current.position.y = Math.sin(elapsed * 2.5) * 0.04;
        if (teamBlueAction === 'celebrate') {
          charBlueRef.current.position.y = Math.abs(Math.sin(elapsed * 6)) * 0.4;
          charBlueRef.current.rotation.y = Math.sin(elapsed * 4) * 0.3;
        } else if (teamBlueAction === 'think') {
          charBlueRef.current.rotation.z = Math.sin(elapsed * 1.5) * 0.08;
        }
      }

      if (charRedRef.current) {
        charRedRef.current.position.y = Math.sin(elapsed * 2.5 + 1) * 0.04;
        if (teamRedAction === 'celebrate') {
          charRedRef.current.position.y = Math.abs(Math.sin(elapsed * 6)) * 0.4;
          charRedRef.current.rotation.y = Math.sin(elapsed * 4) * 0.3;
        } else if (teamRedAction === 'think') {
          charRedRef.current.rotation.z = -Math.sin(elapsed * 1.5) * 0.08;
        }
      }

      // Smooth Camera LERP towards active Zone
      const targetCam = zoneCameraTargets[activeZone] || zoneCameraTargets['workshop'];
      camera.position.lerp(targetCam.pos, 0.04);
      camera.lookAt(targetCam.target);

      renderer.render(scene, camera);
    };

    animate();

    // 11. RESIZE HANDLER
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [activeZone, teamBlueAction, teamRedAction]);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full pointer-events-none select-none z-0 overflow-hidden"
    />
  );
};
