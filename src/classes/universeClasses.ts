export class Coordinates {
    constructor(public x: number, public y: number, public z: number) {}
  }
  
  export class Planet {
    constructor(public coordinates: Coordinates, public isHabitable: boolean, public surfaceArea: number = 0) {
      if (isHabitable) {
        this.surfaceArea = Math.floor(Math.random() * 99_000_000) + 1_000_000;
      }
    }
  }
  
  export class Monster {
    constructor(public coordinates: Coordinates) {}
  }
  
  export class Universe {
    public planets: Planet[] = [];
    public monsters: Monster[] = [];
    
    // Set size of universe - Randomly generate 15 000 locations
    constructor(public size: number) {}
  
    // Populate arrays of planets and monsters
    generate = () => {
      for (let i = 0; i < this.size; i++) {
        // genrate random values within range 0 - 1000
        const x = Math.random() * 1000;
        const y = Math.random() * 1000;
        const z = Math.random() * 1000;
  
        // Random probability check to determine if new location will be a planet or a monster, if larger than 0.5 create a planet
        if (Math.random() > 0.5) {
          
         // Random probability if planet is habitable or not
                         const isHabitable = Math.random() > 0.5;
          this.planets.push(new Planet(new Coordinates(x, y, z), isHabitable));
        } else {
          this.monsters.push(new Monster(new Coordinates(x, y, z)));
        }
      }
    }
  }
  