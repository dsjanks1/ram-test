export class Coordinates {
    constructor(public x: number, public y: number, public z: number) {}
  }
  
  export class Planet {
    constructor(public coordinates: Coordinates, public isHabitable: boolean, public surfaceArea: number = 0) {
        // If the planet is habitable, generate a random surface area between 1 000 000 and 100 000 000 square kilometers
        if (isHabitable) {
            // multiplies the random number by 99,000,000. The result is a random number between 0 (inclusive) and 99,000,000 
            // Rounds down the resulting number to the nearest integer. This is done to avoid fractions and to ensure that the surface area is always a whole number
            // add 1,000,000 to the result. This shifts the range of possible results from 0-99,000,000 to 1,000,000-100,000,000
            // guarantees that the minimum possible surface area is 1,000,000 rather than 0.
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
    
    // When an instance is created, the size is passed as an argument to the constructor function. (15 000 locations)
    constructor(public size: number) {}
  
    // Populate arrays of planets and monsters
    generate = () => {
      for (let i = 0; i < this.size; i++) {
        // genrate random values within range 0 - 1000
        const x = Math.random() * 1000;
        const y = Math.random() * 1000;
        const z = Math.random() * 1000;
       
        // Random probability check to determine if new location will be a planet or a monster, if larger than 0.5 create a planet
        // If a randomly generated number is greater than 0.5, create a new Planet instance.
        // Otherwise, create a new Monster instance.
        if (Math.random() > 0.5) {
          
        // Random probability if planet is habitable or not
          const isHabitable = Math.random() > 0.5;
        // Create a new Planet instance with the generated properties and add it to the planets array.
          this.planets.push(new Planet(new Coordinates(x, y, z), isHabitable));
        } else {
          this.monsters.push(new Monster(new Coordinates(x, y, z)));
        }
      }
    }
  }
  