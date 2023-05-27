import { Planet } from "../classes/universeClasses";

export type PlanetWithDistance = {
    planet: Planet;
    distance: number;
  }
  
  export type FlightPlanStep = {
    step: number;
    action: string;
    coordinates: {
      x: number;
      y: number;
      z: number;
    };
  }