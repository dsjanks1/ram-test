import { readFile } from 'fs/promises';
import { Universe, Planet, Monster, Coordinates } from '../src/classes/universeClasses';

interface PlanetWithDistance {
  planet: Planet;
  distance: number;
}

// Function to calculate distance between two coordinates
const calculateDistance = (from: Coordinates, to: Coordinates) => {
  return Math.sqrt(Math.pow(from.x - to.x, 2) + Math.pow(from.y - to.y, 2) + Math.pow(from.z - to.z, 2));
}

const readUniverseFromFile = async (): Promise<Universe> => {
  // Load universe data from file
  const data = await readFile('universe.txt', 'utf8');
  const lines = data.split('\n');

  let universe = new Universe(0);

  for (let line of lines) {
    // 
    let matchX = line.match(/x: (\d+.\d+),/);
    let matchY = line.match(/y: (\d+.\d+),/);
    let matchZ = line.match(/z: (\d+.\d+),/);

    if (matchX && matchY && matchZ) {
    const coordinates = new Coordinates(
        parseFloat(matchX[1]),
        parseFloat(matchY[1]),
        parseFloat(matchZ[1])
    );

    if (line.startsWith('Planet')) {
        let matchHabitable = line.match(/Habitable: (true|false),/);
        let matchSurfaceArea = line.match(/Surface Area: (\d+)/);

        if (matchHabitable && matchSurfaceArea) {
        const isHabitable = matchHabitable[1] === 'true';
        const surfaceArea = parseFloat(matchSurfaceArea[1]);
        universe.planets.push(new Planet(coordinates, isHabitable, surfaceArea));
        }
    } else {
        universe.monsters.push(new Monster(coordinates));
        }
    }
  }

  return universe;
}
const findPlanetsToColonize = async (homePlanet: Planet) => {
  const universe = await readUniverseFromFile();

  let timeLeft = 24 * 60; // Time in minutes
  const colonizationTimePerKm2 = 0.043 / (60 * 60); // Time in minutes
  let currentPlanet = homePlanet;
  let colonizedPlanets: Planet[] = [];

  let habitablePlanets: PlanetWithDistance[] = universe.planets
    .filter(p => p.isHabitable)
    .map(p => ({
      planet: p,
      distance: calculateDistance(currentPlanet.coordinates, p.coordinates)
    }));

    while (timeLeft > 0 && habitablePlanets.length > 0) {
        // Sort habitable planets by distance
        habitablePlanets.sort((a, b) => a.distance - b.distance);
      
        let nearestPlanet = habitablePlanets[0].planet;
        let distance = habitablePlanets[0].distance;
      
        // Check if there's a monster in between
        let hasMonsterInBetween = universe.monsters.some(monster => {
          return calculateDistance(currentPlanet.coordinates, monster.coordinates) < distance ||
            calculateDistance(nearestPlanet.coordinates, monster.coordinates) < distance;
        });
      
        let travelTime = hasMonsterInBetween ? 2 * 10 : 10; // 10 minutes travel time, doubled if there's a monster in between
        let colonizationTime = nearestPlanet.surfaceArea * colonizationTimePerKm2;
      
        // Check if there's enough time to travel to the planet, colonize it, and travel back to home
        if (timeLeft >= 2 * travelTime + colonizationTime) {
          colonizedPlanets.push(nearestPlanet);
          timeLeft -= 2 * travelTime + colonizationTime;
          currentPlanet = nearestPlanet;
        }
      
        // Remove the current planet from the list
        habitablePlanets.shift();
      }
    
      return colonizedPlanets;
    }

    // Define home planet
    const homePlanet = new Planet(new Coordinates(123.123, 98.098, 456.456), true, 1000000);
    console.log('homePlanet---',homePlanet)
    console.log('colonizedPlanets---')
    // Call the function with the home planet
    findPlanetsToColonize(homePlanet).then(colonizedPlanets => {
console.log(colonizedPlanets)
    for (let planet of colonizedPlanets) {
        console.log(`Colonized planet at {x: ${planet.coordinates.x}, y: ${planet.coordinates.y}, z: ${planet.coordinates.z}}, Surface Area: ${planet.surfaceArea}`);
        console.log(`Colonized planet at {x: ${planet.coordinates.x}, y: ${planet.coordinates.y}, z: ${planet.coordinates.z}}, Surface Area: ${planet.surfaceArea}`);
    }
    }).catch(error => {
    console.error('An error occurred:', error);
    });

    // const PlanetCoordinates =
    // findPlanetsToColonize();