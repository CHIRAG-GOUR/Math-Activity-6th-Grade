// ============================================================
// PERCENTAGE HARVEST — FARM SIMULATION ENGINE
// Deep physical simulation: Farmers sowing, fertilizing, backpack spraying,
// combine harvesting, crate truck loading, road transit, market scales & revenue
// ============================================================

import { SimEvent, TeamId, VehicleTask, FarmerTask, CropType, CropGrowthStage } from '../types';
import { getInterpolatedWaypoint, VEHICLE_ROUTES, FARM_LOCATIONS } from './farmLayout';
import { CROP_CATALOG } from './percentageMath';

export interface FarmerSimState {
  task: FarmerTask;
  progress: number;
  speed: number;
  position: [number, number, number];
  rotationY: number;
  isSpraying: boolean;
  isFertilizing: boolean;
  isCarryingCrate: boolean;
  hasDepositedThisCycle?: boolean;
}

export interface VehicleSimState {
  task: VehicleTask;
  progress: number;
  speed: number;
  position: [number, number, number];
  rotationY: number;
  trailerFill: number; // 0 to 100%
  trailerLoadKg: number;
  currentCrop: CropType;
  weighTimer: number;
  marketTimer: number;
}

export interface TruckSimState {
  task: 'idle' | 'loading' | 'delivering' | 'market_unloading' | 'returning';
  progress: number;
  speed: number;
  position: [number, number, number];
  rotationY: number;
  cratesLoaded: number; // 0 to 6
  unloadTimer: number;
}

export interface TeamSimState {
  teamId: TeamId;
  farmer: FarmerSimState;
  vehicle: VehicleSimState;
  truck: TruckSimState;
  cropGrowth: number; // 0.05 (seeds) to 1.0 (mature)
  cropGrowthStage: CropGrowthStage;
  fieldHarvestProgress: number; // 0 to 1
  isIrrigationSpinning: boolean;
  scaleDisplayKg: number;
  marketSaleAnim: number;
  workerCheerTimer: number;
}

export interface GlobalFarmTimeState {
  day: number;
  hour: number;
  minute: number;
  isNightTransition: boolean;
  transitionTimer: number; // 1.8s transition
  stageNotice: string | null;
  noticeTimer: number;
  sunAngle: number; // 0 to Math.PI * 2
}

const eventQueue: SimEvent[] = [];

export function emitSimEvent(event: SimEvent) {
  eventQueue.push(event);
}

export function drainSimEvents(): SimEvent[] {
  return eventQueue.splice(0, eventQueue.length);
}

export class FarmSimulation {
  public blue: TeamSimState;
  public red: TeamSimState;
  public clock: GlobalFarmTimeState;

  constructor() {
    this.blue = this.createInitialTeamSim('blue');
    this.red = this.createInitialTeamSim('red');
    this.clock = {
      day: 1,
      hour: 8,
      minute: 30,
      isNightTransition: false,
      transitionTimer: 0,
      stageNotice: null,
      noticeTimer: 0,
      sunAngle: 0.6,
    };
  }

  private createInitialTeamSim(teamId: TeamId): TeamSimState {
    const isBlue = teamId === 'blue';
    const farmerHome: [number, number, number] = isBlue ? [-7.8, 0, -1.8] : [7.8, 0, -1.8];
    const tractorHome: [number, number, number] = isBlue ? [-8.8, 0, -4.5] : [8.8, 0, -4.5];
    const truckHome: [number, number, number] = isBlue ? [-12.0, 0, -3.0] : [12.0, 0, -3.0];

    return {
      teamId,
      farmer: {
        task: 'idle',
        progress: 0,
        speed: 0.16,
        position: farmerHome,
        rotationY: isBlue ? 0.3 : -0.3,
        isSpraying: false,
        isFertilizing: false,
        isCarryingCrate: false,
      },
      vehicle: {
        task: 'idle',
        progress: 0,
        speed: 0.16,
        position: tractorHome,
        rotationY: isBlue ? Math.PI / 2 : -Math.PI / 2,
        trailerFill: 0,
        trailerLoadKg: 0,
        currentCrop: 'wheat',
        weighTimer: 0,
        marketTimer: 0,
      },
      truck: {
        task: 'idle',
        progress: 0,
        speed: 0.2,
        position: truckHome,
        rotationY: isBlue ? 0 : 0,
        cratesLoaded: 0,
        unloadTimer: 0,
      },
      cropGrowth: 0.0,
      cropGrowthStage: 0,
      fieldHarvestProgress: 0,
      isIrrigationSpinning: false,
      scaleDisplayKg: 0,
      marketSaleAnim: 0,
      workerCheerTimer: 0,
    };
  }

  /** Advance day clock with Day/Night transition */
  public advanceTime(targetDay: number, hour: number, minute: number, noticeText: string) {
    this.clock.isNightTransition = true;
    this.clock.transitionTimer = 2.0;
    this.clock.day = targetDay;
    this.clock.hour = hour;
    this.clock.minute = minute;
    this.clock.stageNotice = noticeText;
    this.clock.noticeTimer = 3.5;
    emitSimEvent({ type: 'day_advance', teamId: 'blue', payload: { day: targetDay, notice: noticeText } });
  }

  /** Sowing sequence: Farmer and seeder tractor prepare furrows and plant seed rows */
  public startSowingSequence(teamId: TeamId, cropType: CropType) {
    const sim = teamId === 'blue' ? this.blue : this.red;
    sim.farmer.task = 'sowing';
    sim.farmer.progress = 0;
    sim.farmer.isFertilizing = false;
    sim.farmer.isSpraying = false;
    sim.farmer.isCarryingCrate = false;

    sim.vehicle.task = 'planting';
    sim.vehicle.progress = 0;
    sim.vehicle.currentCrop = cropType;
    sim.vehicle.trailerFill = 0;
    sim.cropGrowth = 0.05;
    sim.cropGrowthStage = 1;
    sim.fieldHarvestProgress = 0;

    this.advanceTime(1, 9, 15, 'SOWING SEED ROWS IN FERTILE SOIL');
    emitSimEvent({ type: 'farmer_sow', teamId, payload: { cropType } });
  }

  /** Fertilizer stage: Tractor & Farmer spread granular nutrients across crop rows */
  public startFertilizerSequence(teamId: TeamId) {
    const sim = teamId === 'blue' ? this.blue : this.red;
    sim.farmer.task = 'fertilizing';
    sim.farmer.progress = 0;
    sim.farmer.isFertilizing = true;
    sim.farmer.isSpraying = false;

    // Dispatch agricultural tractor to drive along field spreading nutrients
    sim.vehicle.task = 'planting';
    sim.vehicle.progress = 0;

    // Crops grow taller into stage 3 & 4
    sim.cropGrowth = 0.55;
    sim.cropGrowthStage = 3;

    this.advanceTime(3, 10, 30, 'FERTILIZER BROADCAST — ACCELERATED CROP GROWTH');
    emitSimEvent({ type: 'fertilizer_spread', teamId });
  }

  /** Pesticide / Protection stage: Farmer equips backpack sprayer with wand and sprays fine mist */
  public startPesticideSequence(teamId: TeamId) {
    const sim = teamId === 'blue' ? this.blue : this.red;
    sim.farmer.task = 'spraying_pesticide';
    sim.farmer.progress = 0;
    sim.farmer.isSpraying = true;
    sim.farmer.isFertilizing = false;

    // Crops ripen into tall mature golden wheat
    sim.cropGrowth = 0.85;
    sim.cropGrowthStage = 4;

    this.advanceTime(5, 8, 45, 'BACKPACK SPRAYING — CROP PROTECTION COMPLETE');
    emitSimEvent({ type: 'pesticide_spray', teamId });
  }

  /** Harvesting -> Trailer Fill -> Truck Loading -> Delivery to Market */
  public startHarvestAndDeliverySequence(teamId: TeamId, cropType: CropType, harvestKg: number, revenue: number) {
    const sim = teamId === 'blue' ? this.blue : this.red;
    
    // Ensure fully golden mature before cutting
    sim.cropGrowth = 1.0;
    sim.cropGrowthStage = 5;
    sim.fieldHarvestProgress = 0;

    // Harvester begins cutting field rows
    sim.vehicle.task = 'harvesting';
    sim.vehicle.progress = 0;
    sim.vehicle.currentCrop = cropType;
    sim.vehicle.trailerLoadKg = harvestKg;

    this.advanceTime(7, 11, 0, 'GOLDEN HARVEST — REEL CUTTERS ENGAGED');
    emitSimEvent({ type: 'tractor_harvest', teamId, payload: { cropType, harvestKg, revenue } });
  }

  /** Simulation frame update */
  public update(delta: number) {
    // Update global farm day clock & sun arc
    if (this.clock.transitionTimer > 0) {
      this.clock.transitionTimer = Math.max(0, this.clock.transitionTimer - delta);
      // Spin sun during day/night transition
      this.clock.sunAngle += delta * 3.2;
      if (this.clock.transitionTimer <= 0) {
        this.clock.isNightTransition = false;
        this.clock.sunAngle = 0.6; // return to pleasant daytime sun
      }
    }

    if (this.clock.noticeTimer > 0) {
      this.clock.noticeTimer = Math.max(0, this.clock.noticeTimer - delta);
      if (this.clock.noticeTimer <= 0) {
        this.clock.stageNotice = null;
      }
    }

    this.updateTeamSim(this.blue, delta);
    this.updateTeamSim(this.red, delta);
  }

  private updateTeamSim(team: TeamSimState, delta: number) {
    const routes = VEHICLE_ROUTES[team.teamId];
    const farmer = team.farmer;
    const vehicle = team.vehicle;
    const truck = team.truck;

    if (team.workerCheerTimer > 0) {
      team.workerCheerTimer = Math.max(0, team.workerCheerTimer - delta);
    }
    if (team.marketSaleAnim > 0) {
      team.marketSaleAnim = Math.max(0, team.marketSaleAnim - delta * 0.4);
    }

    // ─────────────────────────────────────────────────────────────
    // 1. FARMER WALKING & TOOL KINEMATICS
    // ─────────────────────────────────────────────────────────────
    switch (farmer.task) {
      case 'idle': {
        const home: [number, number, number] = team.teamId === 'blue' ? [-7.8, 0, -1.8] : [7.8, 0, -1.8];
        farmer.position = home;
        farmer.rotationY = team.teamId === 'blue' ? 0.3 : -0.3;
        farmer.isSpraying = false;
        farmer.isFertilizing = false;
        farmer.isCarryingCrate = false;
        break;
      }

      case 'sowing': {
        farmer.progress += delta * 0.14;
        if (farmer.progress >= 1.0) {
          farmer.task = 'idle';
          farmer.progress = 0;
          team.cropGrowth = 0.25; // sprouts emerge
          team.cropGrowthStage = 2;
        } else {
          const pt = getInterpolatedWaypoint(routes.farmerSow, farmer.progress);
          farmer.position = pt.position;
          farmer.rotationY = pt.rotationY;
        }
        break;
      }

      case 'fertilizing': {
        farmer.progress += delta * 0.15;
        farmer.isFertilizing = farmer.progress > 0.2 && farmer.progress < 0.8;
        if (farmer.progress >= 1.0) {
          farmer.task = 'idle';
          farmer.progress = 0;
          farmer.isFertilizing = false;
          team.cropGrowth = 0.75;
          team.cropGrowthStage = 4;
        } else {
          const pt = getInterpolatedWaypoint(routes.farmerFertilize, farmer.progress);
          farmer.position = pt.position;
          farmer.rotationY = pt.rotationY;
        }
        break;
      }

      case 'spraying_pesticide': {
        farmer.progress += delta * 0.13;
        farmer.isSpraying = farmer.progress > 0.2 && farmer.progress < 0.82;
        if (farmer.progress >= 1.0) {
          farmer.task = 'idle';
          farmer.progress = 0;
          farmer.isSpraying = false;
          team.cropGrowth = 1.0;
          team.cropGrowthStage = 5;
        } else {
          const pt = getInterpolatedWaypoint(routes.farmerSpray, farmer.progress);
          farmer.position = pt.position;
          farmer.rotationY = pt.rotationY;
        }
        break;
      }

      case 'loading_crates': {
        // Farmer walks from tractor trailer (0.0) -> truck flatbed (0.5) -> back to tractor (1.0)
        farmer.progress += delta * 0.28;

        // Farmer carries crate while walking from tractor to truck (progress 0.05 to 0.52)
        farmer.isCarryingCrate = farmer.progress > 0.05 && farmer.progress < 0.52;

        const pt = getInterpolatedWaypoint(routes.farmerLoadCrate, Math.min(1.0, farmer.progress));
        farmer.position = pt.position;
        farmer.rotationY = pt.rotationY;

        // Keep tractor parked in center beside the truck during transfer
        vehicle.position = team.teamId === 'blue' ? [-3.8, 0, 5.0] : [3.8, 0, 5.0];
        vehicle.rotationY = team.teamId === 'blue' ? Math.PI / 2 : -Math.PI / 2;

        // Keep truck positioned at loading spot
        truck.position = team.teamId === 'blue' ? [-1.8, 0, 6.8] : [1.8, 0, 6.8];
        truck.rotationY = 0;

        // At midpoint (0.5), crate is loaded onto truck flatbed and removed from tractor trailer
        if (farmer.progress >= 0.5 && !farmer.hasDepositedThisCycle) {
          farmer.hasDepositedThisCycle = true;
          truck.cratesLoaded = Math.min(5, truck.cratesLoaded + 1);
          vehicle.trailerFill = Math.max(0, 100 - truck.cratesLoaded * 20);
          emitSimEvent({ type: 'scale_weigh', teamId: team.teamId });
        }

        if (farmer.progress >= 1.0) {
          farmer.hasDepositedThisCycle = false;
          farmer.progress = 0;

          // When 5 crates are loaded, truck departs and tractor returns home!
          if (truck.cratesLoaded >= 5) {
            farmer.task = 'idle';
            farmer.isCarryingCrate = false;
            team.workerCheerTimer = 3.5;

            // Tractor empties and returns to home shed
            vehicle.trailerFill = 0;
            vehicle.task = 'idle';

            // Delivery truck departs for market!
            truck.task = 'delivering';
            truck.progress = 0;
            emitSimEvent({ type: 'truck_depart', teamId: team.teamId });
          }
        }
        break;
      }
    }

    // ─────────────────────────────────────────────────────────────
    // 2. VEHICLE / HARVESTER STATE MACHINE
    // ─────────────────────────────────────────────────────────────
    switch (vehicle.task) {
      case 'idle': {
        const homePos = team.teamId === 'blue'
          ? ([-8.8, 0, -4.5] as [number, number, number])
          : ([8.8, 0, -4.5] as [number, number, number]);
        vehicle.position = homePos;
        vehicle.rotationY = team.teamId === 'blue' ? Math.PI / 2 : -Math.PI / 2;
        break;
      }

      case 'planting': {
        vehicle.progress += delta * 0.15;
        if (vehicle.progress >= 1.0) {
          vehicle.task = 'idle';
          vehicle.progress = 0;
        } else {
          const pt = getInterpolatedWaypoint(routes.planting, vehicle.progress);
          vehicle.position = pt.position;
          vehicle.rotationY = pt.rotationY;
        }
        break;
      }

      case 'harvesting': {
        vehicle.progress += delta * 0.13;
        vehicle.trailerFill = Math.min(100, Math.round(vehicle.progress * 100));
        team.fieldHarvestProgress = Math.min(1.0, vehicle.progress * 1.15);

        if (vehicle.progress >= 1.0) {
          // Harvesting complete -> Tractor parks in central loading bay, truck positions beside it, farmer transfers crates!
          vehicle.task = 'idle';
          vehicle.position = team.teamId === 'blue' ? [-3.8, 0, 5.0] : [3.8, 0, 5.0];
          vehicle.rotationY = team.teamId === 'blue' ? Math.PI / 2 : -Math.PI / 2;
          vehicle.trailerFill = 100;
          vehicle.progress = 0;

          truck.task = 'loading';
          truck.position = team.teamId === 'blue' ? [-1.8, 0, 6.8] : [1.8, 0, 6.8];
          truck.rotationY = 0;
          truck.cratesLoaded = 0;

          farmer.task = 'loading_crates';
          farmer.progress = 0;
          farmer.hasDepositedThisCycle = false;
        } else {
          const pt = getInterpolatedWaypoint(routes.harvesting, vehicle.progress);
          vehicle.position = pt.position;
          vehicle.rotationY = pt.rotationY;
        }
        break;
      }
    }

    // ─────────────────────────────────────────────────────────────
    // 3. DELIVERY TRUCK STATE MACHINE & ROAD TRANSIT
    // ─────────────────────────────────────────────────────────────
    switch (truck.task) {
      case 'idle': {
        const home: [number, number, number] = team.teamId === 'blue' ? [-12.0, 0, -3.0] : [12.0, 0, -3.0];
        truck.position = home;
        truck.rotationY = team.teamId === 'blue' ? 0 : 0;
        break;
      }

      case 'loading': {
        // Truck is parked at central loading spot beside the tractor
        truck.position = team.teamId === 'blue' ? [-1.8, 0, 6.8] : [1.8, 0, 6.8];
        truck.rotationY = 0;
        break;
      }

      case 'delivering': {
        truck.progress += delta * 0.18; // Drives along farm road across bridge to central market
        if (truck.progress >= 1.0) {
          truck.task = 'market_unloading';
          truck.progress = 0;
          truck.unloadTimer = 2.4; // Unloading crates at market scale
          team.scaleDisplayKg = vehicle.trailerLoadKg || 420;
          team.marketSaleAnim = 1.0;
          team.workerCheerTimer = 3.5;
          const cropCfg = CROP_CATALOG[vehicle.currentCrop];
          const revenue = (vehicle.trailerLoadKg || 420) * cropCfg.basePricePerKg;
          emitSimEvent({
            type: 'market_sell',
            teamId: team.teamId,
            payload: { crop: cropCfg.name, weight: vehicle.trailerLoadKg || 420, revenue },
          });
        } else {
          const pt = getInterpolatedWaypoint(routes.truckDeliver, truck.progress);
          truck.position = pt.position;
          truck.rotationY = pt.rotationY;
        }
        break;
      }

      case 'market_unloading': {
        truck.unloadTimer -= delta;
        // Crates unload onto market scale
        truck.cratesLoaded = Math.max(0, Math.round((truck.unloadTimer / 2.4) * 6));
        if (truck.unloadTimer <= 0) {
          truck.task = 'returning';
          truck.progress = 0;
          team.scaleDisplayKg = 0;
        }
        break;
      }

      case 'returning': {
        truck.progress += delta * 0.2;
        if (truck.progress >= 1.0) {
          truck.task = 'idle';
          truck.progress = 0;
          truck.cratesLoaded = 0;
        } else {
          const pt = getInterpolatedWaypoint(routes.truckReturn, truck.progress);
          truck.position = pt.position;
          truck.rotationY = pt.rotationY;
        }
        break;
      }
    }
  }

  public reset() {
    this.blue = this.createInitialTeamSim('blue');
    this.red = this.createInitialTeamSim('red');
    this.clock = {
      day: 1,
      hour: 8,
      minute: 30,
      isNightTransition: false,
      transitionTimer: 0,
      stageNotice: null,
      noticeTimer: 0,
      sunAngle: 0.6,
    };
  }
}

export const farmSim = new FarmSimulation();
