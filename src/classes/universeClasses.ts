
import {FormattedCoordinates} from "../types/types"

// This class defines the three-dimensional coordinates of an object in the universe
export class Coordinates {
    // Define x, y and z as strings to allow formatted coordinates
    constructor(public x: string, public y: string, public z: string) {}
  
    // Method to format the coordinates as a FormattedCoordinates object
    format(): FormattedCoordinates {
      return {
        x: this.x,
        y: this.y,
        z: this.z,
      };
    }
  
    // Method to convert the coordinates to a single string
    toString(): string {
      return `${this.x}.${this.y}.${this.z}`;
    }
  }
  
  
  // This class represents a planet
  export class Planet {
    // The constructor receives the coordinates of the planet, its habitability, and optionally its surface area
    constructor(public coordinates: Coordinates, public isHabitable: boolean, public surfaceArea: number = 0) {
      // If the planet is habitable, its surface area is a random number between 1_000_000 and 100_000_000
      if (isHabitable) {
        this.surfaceArea = Math.floor(Math.random() * 99_000_000) + 1_000_000;
      }
    }
  }
  
  export class Monster {
    // The constructor receives the coordinates of the monster
    constructor(public coordinates: Coordinates) {}
  }
  
  // Main class defining the universe
  export class Universe {
    // The universe consists of a list of planets and a list of monsters
    public planets: Planet[] = [];
    public monsters: Monster[] = [];
  
    // Define the size of the universe (number of locations) when an instance of Universe is created
    constructor(public size: number) {}
  
    // Private method to generate a single segment of a coordinate.
    // A segment is a 1-3 digits number, padded with zeros if it has less than the required digits
    private generateSegment = (digits: number) => (Math.floor(Math.random() * (10 ** digits))).toString().padStart(digits, '0');
  
    // Private method to generate a full coordinate, composed of four segments
    // The format is 000.000.00.0, giving a total of 9 digits
    private generateCoordinate = () => `${this.generateSegment(3)}.${this.generateSegment(3)}.${this.generateSegment(2)}.${this.generateSegment(1)}`;
  
    // This function populates the universe with planets and monsters
    generate = () => {
      for (let i = 0; i < this.size; i++) {
        // For each location, x, y, and z coordinates are generated
        const x = this.generateCoordinate();
        const y = this.generateCoordinate();
        const z = this.generateCoordinate();
  
        // There is a 50% chance for each location to be a planet or a monster
        if (Math.random() > 0.5) {
          // There is also a 50% chance for each planet to be habitable
          const isHabitable = Math.random() > 0.5;
          // If the location is a planet, a new Planet object is created and added to the list of planets
          this.planets.push(new Planet(new Coordinates(x, y, z), isHabitable));
        } else {
          // If the location is a monster, a new Monster object is created and added to the list of monsters
          this.monsters.push(new Monster(new Coordinates(x, y, z)));
        }
      }
    }
  }
  