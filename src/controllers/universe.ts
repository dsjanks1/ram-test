import { writeFile } from 'fs/promises';
import { Universe } from '../../src/classes/universeClasses';

// Function to generate a Universe instance with randomly generated locations.
export const createUniverse = () => {
  // Create a new Universe instance, passing 15000 as the parameter to randomly generate that many locations
  const universe = new Universe(15000);
  // Call the generate method of the Universe instance to actually generate the locations
  universe.generate();
  // Return the generated Universe instance
  return universe;
};

// Function to write the Universe instance to a JSON file
export const writeUniverseToFile = async (universe: Universe) => {
  // Prepare the universe data in the required format
  const universeData = {
    // Map over the planets in the Universe instance and extract the required data
    planets: universe.planets.map(planet => ({
      coordinates: {
        x: planet.coordinates.x,
        y: planet.coordinates.y,
        z: planet.coordinates.z
      },
      isHabitable: planet.isHabitable,
      surfaceArea: planet.surfaceArea
    })),
    // Map over the monsters in the Universe instance and extract the required data
    monsters: universe.monsters.map(monster => ({
      coordinates: {
        x: monster.coordinates.x,
        y: monster.coordinates.y,
        z: monster.coordinates.z
      }
    }))
  };
  
  // Write the universe data to the 'universe.json' file, converting it to a JSON string before writing
  await writeFile('universe.json', JSON.stringify(universeData, null, 2));
};

// Main function to create a Universe instance and write it to a file
export const main = async () => {
  // Create a Universe instance
  const universe = createUniverse();
  // Write the Universe instance to a file
  await writeUniverseToFile(universe);
}
