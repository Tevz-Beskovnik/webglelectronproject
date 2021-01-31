/*
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

const { generateFloorPlane } = require("./getActivePoints");
const { edgeNums: getEdgeNums } = require("./edge");
const edge = require("./edge");

class Cubes{

    constructor(w, h, l, density){
        this.w = w;
        this.h = h;
        this.l = l;
        this.wshift = w/2;
        this.hshift = h/2;
        this.lshift = l/2;

        this.floorPlane = generateFloorPlane(w, h, l, density);

        this.v0;
        this.v1;
        this.v2;
        this.v3;
        this.v4;
        this.v5;
        this.v6;
        this.v7;

        this.edgeCoords;
    }

    getCubeCoorsrds(x, y, z){
        this.v0 = [x-this.wshift, y-this.hshift, z-this.lshift, this.floorPlane[x][y][z]];
        this.v1 = [x+1-this.wshift, y-this.hshift, z-this.lshift, this.floorPlane[x+1][y][z]];
        this.v2 = [x+1-this.wshift, y-this.hshift, z+1-this.lshift, this.floorPlane[x+1][y][z+1]];
        this.v3 = [x-this.wshift, y-this.hshift, z+1-this.lshift, this.floorPlane[x][y][z+1]];
        this.v4 = [x-this.wshift, y+1-this.hshift, z-this.lshift, this.floorPlane[x][y+1][z]];
        this.v5 = [x+1-this.wshift, y+1-this.hshift, z-this.lshift, this.floorPlane[x+1][y+1][z]];
        this.v6 = [x+1-this.wshift, y+1-this.hshift, z+1-this.lshift, this.floorPlane[x+1][y+1][z+1]];
        this.v7 = [x-this.wshift, y+1-this.hshift, z+1-this.lshift, this.floorPlane[x][y+1][z+1]];

        return [this.v7[3], this.v6[3], this.v5[3], this.v4[3], this.v3[3], this.v2[3], this.v1[3], this.v0[3]];
    }

    getTriArrs(x, y, z){
        let cubeCoords = this.getCubeCoorsrds(x, y, z);
        let edgeNums = getEdgeNums(cubeCoords);
        let tris = [];

        let edgeCoords = {
            //                      x                          y           z
            0: [this.v0[0] + (this.v1[0]-this.v0[0])/2, this.v0[1], this.v0[2]],
            1: [this.v1[0], this.v1[1], this.v1[2] + (this.v2[2]-this.v1[2])/2],
            2: [this.v3[0] + (this.v2[0]-this.v3[0])/2, this.v3[1], this.v3[2]],
            3: [this.v0[0], this.v0[1], this.v0[2] + (this.v3[2]-this.v0[2])/2],
            4: [this.v4[0] + (this.v5[0]-this.v4[0])/2, this.v4[1], this.v4[2]],
            5: [this.v5[0], this.v5[1], this.v5[2] + (this.v6[2]-this.v5[2])/2],
            6: [this.v7[0] + (this.v6[0]-this.v7[0])/2, this.v7[1], this.v7[2]],
            7: [this.v4[0], this.v4[1], this.v4[2] + (this.v7[2]-this.v4[2])/2],
            8: [this.v0[0], this.v0[1] + (this.v4[1]-this.v0[1])/2, this.v0[2]],
            9: [this.v1[0], this.v1[1] + (this.v5[1]-this.v1[1])/2, this.v1[2]],
            10: [this.v2[0], this.v2[1] + (this.v6[1]-this.v2[1])/2, this.v2[2]],
            11: [this.v3[0], this.v3[1] + (this.v7[1]-this.v3[1])/2, this.v3[2]],
        }

        for(let i = 0; i<14; i+=3){
            if(edgeNums[i] != -1 || edgeNums[i+2] != -1 || edgeNums[i+2] != -1){
                let e0 = edgeCoords[edgeNums[i]];
                let e1 = edgeCoords[edgeNums[i+1]];
                let e2 = edgeCoords[edgeNums[i+2]];

                tris.push([e0, e1, e2]);
            }
        }

        return tris;
    }
}

module.exports = Cubes;