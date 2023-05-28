import { Planet } from "../classes/universeClasses";

export type PlanetWithDistance = {
    planet: Planet;
    distance: number;
  }
  
  export interface FlightPlanStep {
    step: number;
    action: string;
    coordinates: {
        x: string;
        y: string;
        z: string;
    };
}

export type FormattedCoordinates = {
  x: string;
  y: string;
  z: string;
};