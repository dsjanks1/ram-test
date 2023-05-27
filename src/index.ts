import { writeFile } from 'fs/promises';
import { Universe } from '../src/classes/universeClasses';

const createUniverse = () => {
  let universe = new Universe(15000);
  universe.generate();
  return universe;
};

const writeUniverseToFile = async (universe: Universe) => {
  let outputLines: string[] = [];

  for (let planet of universe.planets) {
    outputLines.push(`Planet: {x: ${planet.coordinates.x}, y: ${planet.coordinates.y}, z: ${planet.coordinates.z}}, Habitable: ${planet.isHabitable}, Surface Area: ${planet.surfaceArea}`);
  }

  for (let monster of universe.monsters) {
    outputLines.push(`Monster: {x: ${monster.coordinates.x}, y: ${monster.coordinates.y}, z: ${monster.coordinates.z}}`);
  }

  await writeFile('universe.txt', outputLines.join('\n'));
};

const main = async () => {
  let universe = createUniverse();
  await writeUniverseToFile(universe);
}

main();
