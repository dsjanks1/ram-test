import { readFile, writeFile } from 'fs/promises';
import { Universe, Planet, Monster, Coordinates } from '../classes/universeClasses';
import {PlanetWithDistance, FlightPlanStep} from '../types/types'

// Helper function to calculate distance between two coordinates
// Utilizes the distance formula derived from Pythagoras' theorem

const stringCoordinateToNumber = (coordinate: string) => {
  const [segment1, segment2, segment3, segment4] = coordinate.split('.');
  // Convert the segments into a decimal number
  return parseInt(segment1) + parseInt(segment2)/1000 + parseInt(segment3)/100 + parseInt(segment4)/10;
}

// Type for formatted coordinates
type FormattedCoordinates = {
  x: string;
  y: string;
  z: string;
};

// Modifying calculateDistance function to accept FormattedCoordinates
const calculateDistance = (from: FormattedCoordinates, to: FormattedCoordinates) => {
  const fromX = stringCoordinateToNumber(from.x);
  const fromY = stringCoordinateToNumber(from.y);
  const fromZ = stringCoordinateToNumber(from.z);
  const toX = stringCoordinateToNumber(to.x);
  const toY = stringCoordinateToNumber(to.y);
  const toZ = stringCoordinateToNumber(to.z);

  return Math.sqrt(
    Math.pow(fromX - toX, 2) +
    Math.pow(fromY - toY, 2) +
    Math.pow(fromZ - toZ, 2)
  );
};



// Reads JSON file containing universe data, and constructs a Universe object from this data
const readUniverseFromFile = async (): Promise<Universe> => {
  // Load universe data from file
  const data = await readFile('universe.json', 'utf8');
  
  // Parse the JSON data
  const jsonData = JSON.parse(data);

  // Initialize a new Universe
  const universe = new Universe(0);

  // Iterate through the planets and monsters in the parsed data, 
  // creating new Planet and Monster instances and adding them to the Universe
  for (const planetData of jsonData.planets) {
    const coordinates = new Coordinates(
      planetData.coordinates.x,
      planetData.coordinates.y,
      planetData.coordinates.z
    );
    const isHabitable = planetData.isHabitable;
    const surfaceArea = planetData.surfaceArea;
    universe.planets.push(new Planet(coordinates, isHabitable, surfaceArea));
  }

  for (const monsterData of jsonData.monsters) {
    const coordinates = new Coordinates(
      monsterData.coordinates.x,
      monsterData.coordinates.y,
      monsterData.coordinates.z
    );
    universe.monsters.push(new Monster(coordinates));
  }

  // Return the constructed Universe
  return universe;
}

// A variable to keep track of the total surface area of colonized planets
let totalSurfaceArea = 0;

// Function to find planets to colonize based on the home planet
const findPlanetsToColonize = async (homePlanet: Planet) => {
  totalSurfaceArea = 0;
  const universe = await readUniverseFromFile();
  let timeLeft = 24 * 60; // Time in minutes
  const colonizationTimePerKm2 = 0.043 / (60 * 60); // Time in minutes
  let currentPlanet = homePlanet;
  const colonizedPlanets: Planet[] = [];

  const habitablePlanets: PlanetWithDistance[] = universe.planets
  .filter((p) => p.isHabitable)
  .map((p) => ({
    planet: p,
    distance: calculateDistance(currentPlanet.coordinates, p.coordinates),
  }));

  // Main loop for colonization procedure. Continues as long as there's time left and habitable planets remaining.
  while (timeLeft > 0 && habitablePlanets.length > 0) {
        // Sort habitable planets by distance to current planet
        habitablePlanets.sort((a, b) => a.distance - b.distance);
      
        // Identify the nearest planet and distance to it
        const nearestPlanet = habitablePlanets[0].planet;
        const distance = habitablePlanets[0].distance;
      
        // Check if there's a monster in the way of the current path
        const hasMonsterInBetween = universe.monsters.some(monster => {
          return calculateDistance(currentPlanet.coordinates, monster.coordinates) < distance ||
            calculateDistance(nearestPlanet.coordinates, monster.coordinates) < distance;
        });

        // Calculate travel time and colonization time for the nearest planet
        const travelTime = hasMonsterInBetween ? 2 * 10 : 10; // 10 minutes travel time, doubled if there's a monster in between
        const colonizationTime = nearestPlanet.surfaceArea * colonizationTimePerKm2;

        // If there's enough time to travel to the planet, colonize it, and return, add it to the list of colonized planets
        if (timeLeft >= 2 * travelTime + colonizationTime) {
          colonizedPlanets.push(nearestPlanet);
          timeLeft -= 2 * travelTime + colonizationTime;
          currentPlanet = nearestPlanet;
        }
        // Update the total colonized surface area
        totalSurfaceArea += nearestPlanet.surfaceArea;

        // Remove the current planet from the list of habitable planets
        habitablePlanets.shift();
      }

  // Return the list of colonized planets
  return colonizedPlanets;
}

// Write colonization report to a JSON file
const writeReport = async (colonizedPlanets: Planet[], totalSurfaceArea: number) => {
  const report = {
    flightPlan: [] as FlightPlanStep[],
    totalSurfaceArea: totalSurfaceArea
  };
  
  // Generate the flight plan based on the colonized planets
  for (let i = 0; i < colonizedPlanets.length; i++) {
    const planet = colonizedPlanets[i];
    report.flightPlan.push({
      step: i + 1,
      action: 'Travel to planet',
      coordinates: planet.coordinates
    });
  }

  // Write the report to a file
  await writeFile('report.json', JSON.stringify(report, null, 2));
}


// Function to start the colonization process
export const colonizeUniverse = async (homePlanet: Planet) => {
  findPlanetsToColonize(homePlanet).then(colonizedPlanets => {
    for (const planet of colonizedPlanets) {
        console.log(`Colonized planet at {x: ${planet.coordinates.x}, y: ${planet.coordinates.y}, z: ${planet.coordinates.z}}, Surface Area: ${planet.surfaceArea}`);
    }

    // Write the colonization report to a file
    writeReport(colonizedPlanets, totalSurfaceArea);
    }).catch(error => {
    console.error('An error occurred:', error);
    });
    
}
