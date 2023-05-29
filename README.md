# ram-test

### Ensure you have node installed v14 or above
### Ensure you have npm installed 8.11.0 or above


## To run the project

 2. `npm i` Install node_modules

 1. `npm run start` //Starts the application using nodemon and ts-node to do cold reloading.

## Programming Challenge - Starship Captain

You are the captain of a starship. You have been tasked with finding and colonizing habitable planets in your galaxy. 
Your home world is located at these coordinates: 123.123.99.1 X & 098.098.11.1 Y & 456.456.99.9 Z
Your coordinate system ranges from 000.000.00.0 to 999.999.99.9, and you live in a three-dimensional universe.

0. `Design and code an algorithm to generate a new universe within the bounds of the coordinate system.`
    Main consideration here was the need to generate 9 digit coordinates padded by . eg: 000.000.00.0
    I created a method to generate a single segment of a coordinate, a segment being: 1-3 digits number, padded with zeros if it has less than the required digits

1. `algorithm to populate your universe`
    Size of the universe will be static to 15 000 locations
    Loop through all 15 000 locations 
    At each location generate x,y and z coordinates
    Randomly determine if location is a planet or monster

    I choose to write the results as a JSON object instead of txt.
    I find JSON much easier to work with

    The format is an object containing two arrays: Planets and Monsters.
    Planet and Monster array contains an object in which contains a coordinates object containing 3 strings: x,y,z
    isHabitable: Boolean
    SurfaceArea: number - 1 million to 100 million square kilometers. 

    Monster object only contain a coordinates object

    Eg: 
  "planets": [
    {
      "coordinates": {
        "x": "293.594.25.5",
        "y": "493.488.61.1",
        "z": "444.508.15.1"
      },
      "isHabitable": false,
      "surfaceArea": 0
    }
  ]

    "monsters": [
    {
      "coordinates": {
        "x": "142.888.87.4",
        "y": "382.034.24.5",
        "z": "374.824.79.8"
      }
    }
    ]

2. Design and code an algorithm to read the file created in step 1 which will:
    - a. Identify the planets you have to travel to and colonize to achieve the largest amount of colonized space within a 24-hour period. 
    - b. Optimize your flight plan to avoid space monsters and non-habitable planets, visiting the largest amount of habitable planets, that you are able to colonize, in the 24 hour period 
    
    The function findPlanetsToColonize is designed to perform a colonization procedure starting from a given homePlanet. The goal is to find and colonize as many habitable planets as possible within a given time frame of 24 hours.

    This function implements a greedy algorithm for colonization: at each step, it chooses to colonize the nearest habitable planet, if doing so would leave enough time to return to the home planet.

# Calculating the distance between planets using Pythagoras' theorem

from and to are the two points between which the distance is being calculated. The difference between the x, y, and z coordinates of these points is squared, summed up, and then the square root of the sum is taken, which gives the straight-line distance between the two points.

This computation is necessary in the code to calculate the distances between planets and between planets and monsters, which is then used in determining the colonization plan for the universe. This way, the shortest paths can be found, the presence of monsters on the path can be identified, and the time needed for colonization can be calculated.

Math.pow(from.x - to.x, 2): This is calculating the square of the difference in x-coordinates of the two points. In other words, (from.x - to.x) * (from.x - to.x). The Math.pow function raises the first argument to the power of the second argument.

Math.pow(from.y - to.y, 2): This is doing the same thing, but for the y-coordinates of the two points.

Math.pow(from.z - to.z, 2): And this is doing the same for the z-coordinates of the two points.

Math.sqrt(...): Finally, the Math.sqrt function calculates the square root of the sum of these three values. This is equivalent to taking the square root of the sum of the squares of the differences in the x, y, and z coordinates of the two points.

This is a direct application of the Pythagorean theorem extended to three dimensions. In 2D space, the theorem states that the square of the length of the hypotenuse of a right triangle is equal to the sum of the squares of the lengths of the other two sides. When you extend this to 3D space, it becomes the distance formula used here: the distance between two points is the square root of the sum of the squares of the differences in their x, y, and z coordinates.