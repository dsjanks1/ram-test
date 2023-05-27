import { Planet, Coordinates } from './classes/universeClasses';
import {createUniverse, writeUniverseToFile} from "./controllers/universe";
import {colonizeUniverse} from "./controllers/colonize";

export const createUniverseToJSON = async () => {
  const universe = createUniverse();
  await writeUniverseToFile(universe);
}

  // Define home planet
  const homePlanet = new Planet(new Coordinates(1233.123, 898.08, 456.456), true, 50_000_000);

  createUniverseToJSON().then(() => colonizeUniverse(homePlanet));
  // colonizeUniverse(homePlanet);