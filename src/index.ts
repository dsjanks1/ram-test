import { writeFile } from 'fs/promises';
import { Universe } from '../src/classes/universeClasses';

const createUniverse = () => {
  let universe = new Universe(15000);
  universe.generate();
  return universe;
};

// writing to a json file instead of txt, easier to work with in TypeScript and conform to JSON standards. 
const writeUniverseToFile = async (universe: Universe) => {
  const universeData = {
    planets: universe.planets.map(planet => ({
      coordinates: {
        x: planet.coordinates.x,
        y: planet.coordinates.y,
        z: planet.coordinates.z
      },
      isHabitable: planet.isHabitable,
      surfaceArea: planet.surfaceArea
    })),
    monsters: universe.monsters.map(monster => ({
      coordinates: {
        x: monster.coordinates.x,
        y: monster.coordinates.y,
        z: monster.coordinates.z
      }
    }))
  };

  await writeFile('universe.json', JSON.stringify(universeData, null, 2));
};

const main = async () => {
  let universe = createUniverse();
  await writeUniverseToFile(universe);
}

main();
