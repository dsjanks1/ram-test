import { Planet, Coordinates } from './classes/universeClasses';
import {createUniverse, writeUniverseToFile} from "./controllers/universe";
import {colonizeUniverse} from "./controllers/colonize";

export const createUniverseToJSON = async () => {
  const universe = createUniverse();
  await writeUniverseToFile(universe);
}

  // Define home planet
  // 123.123.99.1 X & 098.098.11.1 Y & 456.456.99.9 Z
  const homePlanet = new Planet(new Coordinates('123.123.99.1', '098.098.11.1','456.456.99.9'), true, 50_000_000);

  //Create universe and colonize 
  createUniverseToJSON().then(() => colonizeUniverse(homePlanet));
