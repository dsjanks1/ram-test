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
  
    constructor(public size: number) {}
  
    generate = () => {
      for (let i = 0; i < this.size; i++) {
        let x = Math.random() * 1000;
        let y = Math.random() * 1000;
        let z = Math.random() * 1000;
  
        if (Math.random() > 0.5) {
          let isHabitable = Math.random() > 0.5;
          this.planets.push(new Planet(new Coordinates(x, y, z), isHabitable));
        } else {
          this.monsters.push(new Monster(new Coordinates(x, y, z)));
        }
      }
    }
  }
  