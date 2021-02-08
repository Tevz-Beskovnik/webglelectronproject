/*

  vector to edge number => 7 6 5 4 3 2 1 => 
  active vecs (7 4 1) => 7e 6 5 4e 3 2 1e => 
  1 0 0 1 0 0 1 => 73 coresponds to num 73 in array :))))

    v0 - v7 --> vertex
    e0 - e11 --> edges
    
    [0, 11, 3, 0, 6, 11, 0, 9, 6, 5, 6, 9, 1, 2, 10, -1],

     v7_______e6_____________v6
      /|                    /|
     / |                   / |
  e7/  |                e5/  |
   /___|______e4_________/   |
v4|    |                 |v5 |e10
  |    |                 |   |
  |    |e11              |e9 |
e8|    |                 |   |
  |    |_________________|___|
  |   / v3      e2       |   /v2
  |  /                   |  /
  | /e3                  | /e1
  |/_____________________|/
  v0         e0          v1
*/

const triTable = require("./triTable").triTable();

module.exports = {
    /*
    gets an array that is exectly 8 long and it contains 0s and 1s that are from 0-7 that
    will then be converted to the correct binarynumber corresponding to the correct possition in the edge table array
    */
    edgeNums: (activePoints) => {
        const arrNum = parseInt(activePoints.join(""), 2);
        return triTable[arrNum];
    }
}