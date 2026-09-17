// ============================================================
// PERCENTAGE HARVEST — 3D FARM MATERIALS & TEXTURE GENERATORS
// Bright, vibrant, sunny agricultural materials matching AAA arcade visuals
// ============================================================

import * as THREE from 'three';

export class FarmMaterialsCache {
  private static instance: FarmMaterialsCache;

  // Ground, Hills & River
  public grassTerrain: THREE.MeshStandardMaterial;
  public pastureGrass: THREE.MeshStandardMaterial;
  public hillGreen: THREE.MeshStandardMaterial;
  public tilledSoil: THREE.MeshStandardMaterial;
  public darkMud: THREE.MeshStandardMaterial;
  public pavedRoad: THREE.MeshStandardMaterial;
  public dirtRoad: THREE.MeshStandardMaterial;
  public roadLine: THREE.MeshBasicMaterial;
  public roadCurb: THREE.MeshStandardMaterial;
  public waterRiver: THREE.MeshStandardMaterial;
  public wellWater: THREE.MeshStandardMaterial;
  public wellWaterRipple: THREE.MeshStandardMaterial;
  public stoneBridge: THREE.MeshStandardMaterial;
  public riverRock: THREE.MeshStandardMaterial;

  // Buildings & Trim
  public whiteTrim: THREE.MeshStandardMaterial;
  public woodTimber: THREE.MeshStandardMaterial;
  public woodPlanks: THREE.MeshStandardMaterial;
  public blueBarnWall: THREE.MeshStandardMaterial;
  public redBarnWall: THREE.MeshStandardMaterial;
  public marketWall: THREE.MeshStandardMaterial;
  public marketRoofGreen: THREE.MeshStandardMaterial;
  public roofShingles: THREE.MeshStandardMaterial;
  public silverMetalSilo: THREE.MeshStandardMaterial;
  public copperMetal: THREE.MeshStandardMaterial;
  public concreteBase: THREE.MeshStandardMaterial;
  public glassWindow: THREE.MeshPhysicalMaterial;

  // Weighing & Market
  public ledGreenText: THREE.MeshBasicMaterial;
  public scalePadSteel: THREE.MeshStandardMaterial;
  public marketStallWood: THREE.MeshStandardMaterial;
  public marketAwningGreen: THREE.MeshStandardMaterial;
  public marketAwningRed: THREE.MeshStandardMaterial;
  public marketAwningYellow: THREE.MeshStandardMaterial;
  public crateWood: THREE.MeshStandardMaterial;

  // Vehicles
  public blueTractorBody: THREE.MeshStandardMaterial;
  public redTractorBody: THREE.MeshStandardMaterial;
  public greenHarvesterBody: THREE.MeshStandardMaterial;
  public vehicleTireRubber: THREE.MeshStandardMaterial;
  public vehicleWheelRim: THREE.MeshStandardMaterial;
  public trailerMetal: THREE.MeshStandardMaterial;
  public vehicleGlass: THREE.MeshPhysicalMaterial;
  public headlightGlow: THREE.MeshBasicMaterial;
  public truckCabin: THREE.MeshStandardMaterial;

  // Crops & Growth
  public wheatGolden: THREE.MeshStandardMaterial;
  public wheatFieldTuft: THREE.MeshStandardMaterial;
  public cornStalk: THREE.MeshStandardMaterial;
  public cornGoldEar: THREE.MeshStandardMaterial;
  public tomatoBush: THREE.MeshStandardMaterial;
  public tomatoFruit: THREE.MeshStandardMaterial;
  public sunflowerYellow: THREE.MeshStandardMaterial;
  public sunflowerCenter: THREE.MeshStandardMaterial;
  public vegetableGreen: THREE.MeshStandardMaterial;
  public cottonPuff: THREE.MeshStandardMaterial;
  public flowerPink: THREE.MeshStandardMaterial;
  public harvestStubble: THREE.MeshStandardMaterial;
  public sproutGreen: THREE.MeshStandardMaterial;
  public gridHighlightBlue: THREE.MeshStandardMaterial;
  public gridHighlightRed: THREE.MeshStandardMaterial;

  // Agricultural Equipment & Particles
  public sprayerTankYellow: THREE.MeshStandardMaterial;
  public sprayerHoseBlack: THREE.MeshStandardMaterial;
  public sprayerWandChrome: THREE.MeshStandardMaterial;
  public sprayMistBlue: THREE.MeshStandardMaterial;
  public fertilizerDust: THREE.MeshStandardMaterial;
  public grainSack: THREE.MeshStandardMaterial;

  // Characters & Animals
  public skinTone1: THREE.MeshStandardMaterial;
  public skinTone2: THREE.MeshStandardMaterial;
  public hairDark: THREE.MeshStandardMaterial;
  public hairBrown: THREE.MeshStandardMaterial;
  public blueDenim: THREE.MeshStandardMaterial;
  public redPlaid: THREE.MeshStandardMaterial;
  public yellowBoots: THREE.MeshStandardMaterial;
  public strawHat: THREE.MeshStandardMaterial;
  public cowHideWhite: THREE.MeshStandardMaterial;
  public cowHideBlack: THREE.MeshStandardMaterial;
  public sheepWool: THREE.MeshStandardMaterial;
  public chickenFeather: THREE.MeshStandardMaterial;

  private constructor() {
    // Ground, Hills & River (Bright, vibrant, sunny agricultural landscape)
    this.grassTerrain = new THREE.MeshStandardMaterial({
      color: 0x65a30d, // Bright fresh summer grass
      roughness: 0.8,
      metalness: 0.05,
    });
    this.pastureGrass = new THREE.MeshStandardMaterial({
      color: 0x84cc16, // Lighter golden-green field pasture
      roughness: 0.85,
    });
    this.hillGreen = new THREE.MeshStandardMaterial({
      color: 0x4d7c0f, // Rich rolling backdrop hills
      roughness: 0.9,
    });
    this.tilledSoil = new THREE.MeshStandardMaterial({
      color: 0x5c3a21, // Warm rich fertile loam
      roughness: 0.95,
    });
    this.darkMud = new THREE.MeshStandardMaterial({
      color: 0x3e2723,
      roughness: 0.9,
    });
    this.pavedRoad = new THREE.MeshStandardMaterial({
      color: 0x64748b, // Clean paved country road
      roughness: 0.65,
      metalness: 0.1,
    });
    this.dirtRoad = new THREE.MeshStandardMaterial({
      color: 0x78716c, // Natural warm stone gravel path
      roughness: 0.85,
      metalness: 0.05,
    });
    this.roadLine = new THREE.MeshBasicMaterial({
      color: 0xffffff, // Crisp clean white road lines
    });
    this.roadCurb = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.8,
    });
    this.waterRiver = new THREE.MeshStandardMaterial({
      color: 0x38bdf8, // Sparkling clear river blue
      roughness: 0.1,
      metalness: 0.85,
      transparent: true,
      opacity: 0.9,
    });
    this.wellWater = new THREE.MeshStandardMaterial({
      color: 0x0284c7, // Vibrant deep crystal blue well water (not green)
      roughness: 0.05,
      metalness: 0.5,
      emissive: 0x0369a1,
      emissiveIntensity: 0.35,
    });
    this.wellWaterRipple = new THREE.MeshStandardMaterial({
      color: 0x7dd3fc, // Bright cyan-blue surface ripple highlight
      roughness: 0.1,
      metalness: 0.2,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.4,
      transparent: true,
      opacity: 0.85,
    });
    this.stoneBridge = new THREE.MeshStandardMaterial({
      color: 0x94a3b8, // Classic stone arch bridge
      roughness: 0.8,
    });
    this.riverRock = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      roughness: 0.85,
    });

    // Buildings & Trim
    this.whiteTrim = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.4,
    });
    this.woodTimber = new THREE.MeshStandardMaterial({
      color: 0x78350f,
      roughness: 0.8,
    });
    this.woodPlanks = new THREE.MeshStandardMaterial({
      color: 0x92400e,
      roughness: 0.85,
    });
    this.blueBarnWall = new THREE.MeshStandardMaterial({
      color: 0x2563eb, // Crisp cheerful blue barn siding
      roughness: 0.5,
      metalness: 0.05,
    });
    this.redBarnWall = new THREE.MeshStandardMaterial({
      color: 0xdc2626, // Classic vibrant red barn siding
      roughness: 0.5,
      metalness: 0.05,
    });
    this.marketWall = new THREE.MeshStandardMaterial({
      color: 0xfef3c7, // Warm country stone & cream plaster
      roughness: 0.7,
    });
    this.marketRoofGreen = new THREE.MeshStandardMaterial({
      color: 0x15803d, // Charming green store roof shingles
      roughness: 0.6,
    });
    this.roofShingles = new THREE.MeshStandardMaterial({
      color: 0x334155, // Clean dark slate roof
      roughness: 0.6,
      metalness: 0.1,
    });
    this.silverMetalSilo = new THREE.MeshStandardMaterial({
      color: 0xcfd8dc,
      roughness: 0.3,
      metalness: 0.85,
    });
    this.copperMetal = new THREE.MeshStandardMaterial({
      color: 0x94a3b8, // Clean galvanized agricultural silo metal
      roughness: 0.35,
      metalness: 0.7,
    });
    this.concreteBase = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.85,
    });
    this.glassWindow = new THREE.MeshPhysicalMaterial({
      color: 0xe0f2fe,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.6,
      transparent: true,
      opacity: 0.85,
    });

    // Weighing & Market
    this.ledGreenText = new THREE.MeshBasicMaterial({
      color: 0x22c55e,
    });
    this.scalePadSteel = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.4,
      metalness: 0.7,
    });
    this.marketStallWood = new THREE.MeshStandardMaterial({
      color: 0x854d0e,
      roughness: 0.8,
    });
    this.marketAwningGreen = new THREE.MeshStandardMaterial({
      color: 0x16a34a,
      roughness: 0.6,
    });
    this.marketAwningRed = new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      roughness: 0.6,
    });
    this.marketAwningYellow = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      roughness: 0.6,
    });
    this.crateWood = new THREE.MeshStandardMaterial({
      color: 0xa16207,
      roughness: 0.85,
    });

    // Vehicles
    this.blueTractorBody = new THREE.MeshStandardMaterial({
      color: 0x2563eb,
      roughness: 0.35,
      metalness: 0.4,
    });
    this.redTractorBody = new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      roughness: 0.35,
      metalness: 0.4,
    });
    this.greenHarvesterBody = new THREE.MeshStandardMaterial({
      color: 0x16a34a,
      roughness: 0.35,
      metalness: 0.4,
    });
    this.vehicleTireRubber = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.9,
    });
    this.vehicleWheelRim = new THREE.MeshStandardMaterial({
      color: 0xfacc15, // Bright cheerful yellow tractor wheels
      roughness: 0.4,
      metalness: 0.4,
    });
    this.trailerMetal = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.4,
      metalness: 0.5,
    });
    this.vehicleGlass = new THREE.MeshPhysicalMaterial({
      color: 0xe0f2fe,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.5,
      transparent: true,
      opacity: 0.8,
    });
    this.headlightGlow = new THREE.MeshBasicMaterial({
      color: 0xfef08a,
    });
    this.truckCabin = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.4,
    });

    // Crops & Growth Stages
    this.wheatGolden = new THREE.MeshStandardMaterial({
      color: 0xf59e0b, // Radiant golden amber wheat
      roughness: 0.7,
      metalness: 0.05,
    });
    this.wheatFieldTuft = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.8,
    });
    this.cornStalk = new THREE.MeshStandardMaterial({
      color: 0x4d7c0f,
      roughness: 0.8,
    });
    this.cornGoldEar = new THREE.MeshStandardMaterial({
      color: 0xfde047,
      roughness: 0.6,
    });
    this.tomatoBush = new THREE.MeshStandardMaterial({
      color: 0x15803d,
      roughness: 0.85,
    });
    this.tomatoFruit = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      roughness: 0.35,
    });
    this.sunflowerYellow = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      roughness: 0.65,
    });
    this.sunflowerCenter = new THREE.MeshStandardMaterial({
      color: 0x451a03,
      roughness: 0.9,
    });
    this.vegetableGreen = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      roughness: 0.8,
    });
    this.cottonPuff = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.95,
    });
    this.flowerPink = new THREE.MeshStandardMaterial({
      color: 0xf472b6,
      roughness: 0.8,
    });

    // Agricultural Tools & Equipment
    this.sprayerTankYellow = new THREE.MeshStandardMaterial({
      color: 0x0284c7, // Vibrant agricultural spray tank
      roughness: 0.3,
      metalness: 0.2,
    });
    this.sprayerHoseBlack = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.9,
    });
    this.sprayerWandChrome = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.2,
      metalness: 0.8,
    });
    this.sprayMistBlue = new THREE.MeshStandardMaterial({
      color: 0x7dd3fc,
      transparent: true,
      opacity: 0.55,
      roughness: 0.1,
    });
    this.fertilizerDust = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      transparent: true,
      opacity: 0.75,
      roughness: 0.3,
    });
    this.grainSack = new THREE.MeshStandardMaterial({
      color: 0xd4a373,
      roughness: 0.95,
    });
    this.harvestStubble = new THREE.MeshStandardMaterial({
      color: 0xd4a373, // Natural dry cut straw
      roughness: 0.9,
    });
    this.sproutGreen = new THREE.MeshStandardMaterial({
      color: 0x84cc16,
      roughness: 0.75,
    });
    this.gridHighlightBlue = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.6,
      roughness: 0.4,
    });
    this.gridHighlightRed = new THREE.MeshStandardMaterial({
      color: 0xf87171,
      transparent: true,
      opacity: 0.6,
      roughness: 0.4,
    });

    // Characters & Animals
    this.skinTone1 = new THREE.MeshStandardMaterial({ color: 0xfcd34d, roughness: 0.8 });
    this.skinTone2 = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.8 });
    this.hairDark = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.9 });
    this.hairBrown = new THREE.MeshStandardMaterial({ color: 0x573618, roughness: 0.9 });
    this.blueDenim = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.85 });
    this.redPlaid = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.85 });
    this.yellowBoots = new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.7 });
    this.strawHat = new THREE.MeshStandardMaterial({ color: 0xfde68a, roughness: 0.9 });
    this.cowHideWhite = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.85 });
    this.cowHideBlack = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.85 });
    this.sheepWool = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.95 });
    this.chickenFeather = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.85 });
  }

  public static get(): FarmMaterialsCache {
    if (!FarmMaterialsCache.instance) {
      FarmMaterialsCache.instance = new FarmMaterialsCache();
    }
    return FarmMaterialsCache.instance;
  }
}
