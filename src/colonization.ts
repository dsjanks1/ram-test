import { readFile } from 'fs/promises';
import { writeFile } from 'fs/promises';
import { Universe, Planet, Monster, Coordinates } from './classes/universeClasses';
import {PlanetWithDistance, FlightPlanStep} from './types/types'


// Function to calculate distance between two coordinates
const calculateDistance = (from: Coordinates, to: Coordinates) => {
  return Math.sqrt(Math.pow(from.x - to.x, 2) + Math.pow(from.y - to.y, 2) + Math.pow(from.z - to.z, 2));
}

// Function reads the "universe.json" file, which should contain a representation of the universe with planets and monsters.
// Each line of the file is processed separately, and if it matches the regular expressions, the necessary data is extracted to create Planet and Monster objects. 
// These objects are then stored in a new Universe object.
const readUniverseFromFile = async (): Promise<Universe> => {
  // Load universe data from file
  const data = await readFile('universe.json', 'utf8');
  
  // Parse the JSON data
  const jsonData = JSON.parse(data);

  let universe = new Universe(0);

  for (let planetData of jsonData.planets) {
    const coordinates = new Coordinates(
      planetData.coordinates.x,
      planetData.coordinates.y,
      planetData.coordinates.z
    );
    const isHabitable = planetData.isHabitable;
    const surfaceArea = planetData.surfaceArea;
    universe.planets.push(new Planet(coordinates, isHabitable, surfaceArea));
  }

  for (let monsterData of jsonData.monsters) {
    const coordinates = new Coordinates(
      monsterData.coordinates.x,
      monsterData.coordinates.y,
      monsterData.coordinates.z
    );
    universe.monsters.push(new Monster(coordinates));
  }

  return universe;
}
let totalSurfaceArea = 0;

const findPlanetsToColonize = async (homePlanet: Planet) => {
  totalSurfaceArea = 0;
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
        totalSurfaceArea += nearestPlanet.surfaceArea;

        // Remove the current planet from the list
        habitablePlanets.shift();
      }
    
      return colonizedPlanets;
    }



    const writeReport = async (colonizedPlanets: Planet[], totalSurfaceArea: number) => {
      let report = {
        flightPlan: [] as FlightPlanStep[],
        totalSurfaceArea: totalSurfaceArea
      };
    
      for (let i = 0; i < colonizedPlanets.length; i++) {
        let planet = colonizedPlanets[i];
        report.flightPlan.push({
          step: i + 1,
          action: 'Travel to planet',
          coordinates: { x: planet.coordinates.x, y: planet.coordinates.y, z: planet.coordinates.z }
        });
      }
    
      await writeFile('report.json', JSON.stringify(report, null, 2));
    }
    
    

    // Define home planet
    const homePlanet = new Planet(new Coordinates(1233.123, 898.08, 456.456), true, 50_000_000);

    // Call the function with the home planet
    findPlanetsToColonize(homePlanet).then(colonizedPlanets => {
    for (let planet of colonizedPlanets) {
        console.log(`Colonized planet at {x: ${planet.coordinates.x}, y: ${planet.coordinates.y}, z: ${planet.coordinates.z}}, Surface Area: ${planet.surfaceArea}`);
    }

    writeReport(colonizedPlanets, totalSurfaceArea);
    }).catch(error => {
    console.error('An error occurred:', error);
    });



// findPlanetsToColonize: This function takes as an argument a homePlanet (an object of the Planet class) from which the colonization process will start. The function calculates the distance from the current planet to all other habitable planets and chooses the nearest one. If a monster is detected in the path to the nearest planet, it doubles the travel time. It also checks if there is enough time left to travel to the planet, colonize it, and travel back. If there is, the planet is added to the list of colonized planets and becomes the new current planet.

// homePlanet: This is a Planet object which represents the starting point of the colonization.

// findPlanetsToColonize(homePlanet).then(...): This line of code calls the function findPlanetsToColonize with homePlanet as the argument, and logs the colonized planets or any errors that may occur.

