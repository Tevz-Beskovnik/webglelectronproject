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
const { perlinN3D, getNoiseValue, simplexNoise } = require("./noiseFunction");

const edge = require("./edge");

class Cubes{

    constructor(w, h, l, density, mod, noise){
        this.w = w;
        this.h = h;
        this.l = l;

        this.wshift = w/2;
        this.hshift = h/2;
        this.lshift = l/2;

        this.density = density;
        this.mod = mod

        this.noise = noise;

        this.v0;
        this.v1;
        this.v2;
        this.v3;
        this.v4;
        this.v5;
        this.v6;
        this.v7;
    }

    getCubeCoorsrds(x, y, z){

        let xm = x;
        let zm = z;
        let ym = y;

        let k0 = simplexNoise(xm, ym, zm, this.w, this.h, this.l, this.density, this.noise, this.mod);
        let k1 = simplexNoise(xm+1, ym, zm, this.w, this.h, this.l, this.density, this.noise, this.mod);
        let k2 = simplexNoise(xm+1, ym, zm+1, this.w, this.h, this.l, this.density, this.noise, this.mod);
        let k3 = simplexNoise(xm, ym, zm+1, this.w, this.h, this.l, this.density, this.noise, this.mod);
        let k4 = simplexNoise(xm, ym+1, zm, this.w, this.h, this.l, this.density, this.noise, this.mod);
        let k5 = simplexNoise(xm+1, ym+1, zm, this.w, this.h, this.l, this.density, this.noise, this.mod);
        let k6 = simplexNoise(xm+1, ym+1,zm+1, this.w, this.h, this.l, this.density, this.noise, this.mod);
        let k7 = simplexNoise(xm, ym+1, zm+1, this.w, this.h, this.l, this.density, this.noise, this.mod);

        this.v0 = [x-this.wshift, y-this.hshift, z-this.lshift, k0];
        this.v1 = [x+1-this.wshift, y-this.hshift, z-this.lshift, k1];
        this.v2 = [x+1-this.wshift, y-this.hshift, z+1-this.lshift, k2];
        this.v3 = [x-this.wshift, y-this.hshift, z+1-this.lshift, k3];
        this.v4 = [x-this.wshift, y+1-this.hshift, z-this.lshift, k4];
        this.v5 = [x+1-this.wshift, y+1-this.hshift, z-this.lshift, k5];
        this.v6 = [x+1-this.wshift, y+1-this.hshift, z+1-this.lshift, k6];
        this.v7 = [x-this.wshift, y+1-this.hshift, z+1-this.lshift, k7];

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