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
const { abs } = Math;

function colorSelector(y, h, colors){
    if(y >= h/4*3){
        return colors[3];
    }
    if(y >= h/4*2){
        return colors[2];
    }
    if(y > 0){
        return colors[1];
    }
    return colors[0];
}

function interpolate(y2, y1){
    const isolevel = y2[3][2];
    if(abs(isolevel - y1[3][1]) < 0.00001) return [y1[0], y1[1], y1[2]];
    if(abs(isolevel - y2[3][1]) < 0.00001) return [y2[0], y2[1], y2[2]];
    if(abs(y1[3][1] - y2[3][1]) < 0.00001) return [y1[0], y1[1], y1[2]];
    const mu = (isolevel - y1[3][1]) / (y2[3][1] - y1[3][1]);
    return [
        y1[0] + mu * (y2[0] - y1[0]), 
        y1[1] + mu * (y2[1] - y1[1]), 
        y1[2] + mu * (y2[2] - y1[2])
    ];
}

class CubeTriCoords{

    constructor(w, h, l, opts, colors, interp){
        this.w = w;
        this.h = h;
        this.l = l;

        this.interp = interp || false;

        this.wshift = w/2;
        this.hshift = h/2;
        this.lshift = l/2;

        this.opts = opts;

        this.colors = colors;

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

        const xm = x;
        const zm = z;
        const ym = y;

        const k0 = simplexNoise(xm, ym, zm, this.w, this.h, this.l, this.opts);
        const k1 = simplexNoise(xm+1, ym, zm, this.w, this.h, this.l, this.opts);
        const k2 = simplexNoise(xm+1, ym, zm+1, this.w, this.h, this.l, this.opts);
        const k3 = simplexNoise(xm, ym, zm+1, this.w, this.h, this.l, this.opts);
        const k4 = simplexNoise(xm, ym+1, zm, this.w, this.h, this.l, this.opts);
        const k5 = simplexNoise(xm+1, ym+1, zm, this.w, this.h, this.l, this.opts);
        const k6 = simplexNoise(xm+1, ym+1,zm+1, this.w, this.h, this.l, this.opts);
        const k7 = simplexNoise(xm, ym+1, zm+1, this.w, this.h, this.l, this.opts);

        this.v0 = [x-this.wshift, y-this.hshift, z-this.lshift, k0];
        this.v1 = [x+1-this.wshift, y-this.hshift, z-this.lshift, k1];
        this.v2 = [x+1-this.wshift, y-this.hshift, z+1-this.lshift, k2];
        this.v3 = [x-this.wshift, y-this.hshift, z+1-this.lshift, k3];
        this.v4 = [x-this.wshift, y+1-this.hshift, z-this.lshift, k4];
        this.v5 = [x+1-this.wshift, y+1-this.hshift, z-this.lshift, k5];
        this.v6 = [x+1-this.wshift, y+1-this.hshift, z+1-this.lshift, k6];
        this.v7 = [x-this.wshift, y+1-this.hshift, z+1-this.lshift, k7];

        return [this.v7[3][0], this.v6[3][0], this.v5[3][0], this.v4[3][0], this.v3[3][0], this.v2[3][0], this.v1[3][0], this.v0[3][0]];
    }

    getTriArrs(x, y, z){
        const cubeCoords = this.getCubeCoorsrds(x, y, z);
        const edgeNumss = edgeNums(cubeCoords);
        const tris = [];

        const edgeCoords = this.interp == true ? {
            0: [...interpolate(this.v1, this.v0)],
            1: [...interpolate(this.v2, this.v1)],
            2: [...interpolate(this.v2, this.v3)],
            3: [...interpolate(this.v3, this.v0)],
            4: [...interpolate(this.v5, this.v4)],
            5: [...interpolate(this.v6, this.v5)],
            6: [...interpolate(this.v6, this.v7)],
            7: [...interpolate(this.v7, this.v4)],
            8: [...interpolate(this.v4, this.v0)],
            9: [...interpolate(this.v5, this.v1)],
            10: [...interpolate(this.v6, this.v2)],
            11: [...interpolate(this.v7, this.v3)]
        } : {
            //                     x                        y           z
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
        };
        
        //console.log(edgeCoords)

        for(let i = 0; i<14; i+=3){
            if(edgeNumss[i] != -1 || edgeNumss[i+2] != -1 || edgeNumss[i+2] != -1){
                const e0 = edgeCoords[edgeNumss[i]];
                const e1 = edgeCoords[edgeNumss[i+1]];
                const e2 = edgeCoords[edgeNumss[i+2]];

                tris.push([e0, e1, e2, colorSelector(y, this.h, this.colors)]);
            }
        }

        return tris;
    }
}