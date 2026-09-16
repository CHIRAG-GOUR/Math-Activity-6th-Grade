// ============================================================
// GRAPHWORKS — City Traffic & Pedestrian Crosswalk Coordinator
// Real-time synchronization between moving vehicles on the circular
// boulevard and pedestrians to ensure humans NEVER cross into moving traffic
// and vehicles always yield for crossing pedestrians.
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

  // Circular road dimensions (Center [0,0,0])
  public readonly ringInnerRadius = 6.8;
  public readonly ringOuterRadius = 10.2;

  // Update vehicle position from CityTransit3D loop
  public updateVehicle(id: number, x: number, z: number, currentSpeed: number, isBraking: boolean) {
    this.vehicles.set(id, { id, x, z, currentSpeed, isBraking });
  }

  // Update pedestrian position from CityPedestrians3D loop
  public updatePedestrian(id: string, x: number, z: number) {
    const r = Math.hypot(x, z);
    const isCrossing = r >= this.ringInnerRadius && r <= this.ringOuterRadius;
    this.pedestrians.set(id, { id, x, z, isCrossing });
  }

  // Check if it is completely safe for a pedestrian at (pedX, pedZ) to enter/cross the circular road
  public isRoadSafeToCross(pedX: number, pedZ: number): boolean {
    const dangerDist = 4.8; // Safe clearance distance in meters
    for (const v of this.vehicles.values()) {
      const dist = Math.hypot(v.x - pedX, v.z - pedZ);
      // If a vehicle is approaching within danger radius and moving, wait at curb
      if (dist < dangerDist && Math.abs(v.currentSpeed) > 0.4) {
        return false;
      }
    }
    return true;
  }

  // Check if any pedestrian is actively on the circular roadway near (x, z)
  public isPedestrianInProximity(vehX: number, vehZ: number): boolean {
    for (const p of this.pedestrians.values()) {
      if (p.isCrossing) {
        const dist = Math.hypot(p.x - vehX, p.z - vehZ);
        if (dist < 3.2) {
          return true;
        }
      }
    }
    return false;
  }
}

export const cityTraffic = new TrafficCoordinator();

