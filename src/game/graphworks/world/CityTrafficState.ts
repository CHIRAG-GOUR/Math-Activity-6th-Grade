// ============================================================
// GRAPHWORKS — City Traffic & Pedestrian Crosswalk Coordinator
// Real-time synchronization between moving highway vehicles and
// pedestrians to ensure humans NEVER cross into moving traffic and
// vehicles always stop for crossing pedestrians.
// ============================================================

export interface LiveVehicle {
  id: number;
  x: number;
  z: number;
  currentSpeed: number;
  isBraking: boolean;
}

export interface LivePedestrian {
  id: string;
  x: number;
  z: number;
  isCrossing: boolean;
}

class TrafficCoordinator {
  private vehicles: Map<number, LiveVehicle> = new Map();
  private pedestrians: Map<string, LivePedestrian> = new Map();

  // Highway crosswalk coordinates along the avenue
  public readonly crosswalkX = [-7.0, 7.0];
  public readonly roadZMin = 3.6;
  public readonly roadZMax = 7.4;

  // Update vehicle position from CityTransit3D loop
  public updateVehicle(id: number, x: number, z: number, currentSpeed: number, isBraking: boolean) {
    this.vehicles.set(id, { id, x, z, currentSpeed, isBraking });
  }

  // Update pedestrian position from CityPedestrians3D loop
  public updatePedestrian(id: string, x: number, z: number) {
    const isCrossing = z >= this.roadZMin && z <= this.roadZMax;
    this.pedestrians.set(id, { id, x, z, isCrossing });
  }

  // Check if it is completely safe for a pedestrian to cross at crosswalk X
  public isRoadSafeToCross(pedX: number): boolean {
    const dangerZone = 8.5; // meters buffer around crosswalk
    for (const v of this.vehicles.values()) {
      const dist = Math.abs(v.x - pedX);
      // If a vehicle is moving towards or within the crosswalk zone, it is NOT safe
      if (dist < dangerZone && Math.abs(v.currentSpeed) > 0.4) {
        return false;
      }
    }
    return true;
  }

  // Check if any pedestrian is actively crossing near crosswalk X (so cars must stop)
  public isPedestrianInCrosswalk(cwX: number): boolean {
    for (const p of this.pedestrians.values()) {
      if (Math.abs(p.x - cwX) < 1.6 && p.z >= this.roadZMin - 0.8 && p.z <= this.roadZMax + 0.8) {
        return true;
      }
    }
    return false;
  }
}

export const cityTraffic = new TrafficCoordinator();
