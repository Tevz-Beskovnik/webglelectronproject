const perlinNoise = require("perlin-noise-3d");
const noisePer = new perlinNoise(4321238512);

const Alea = require("alea");
var random = new Alea(11204481988);
const simplexNoise = require("simplex-noise");
const simplex = new simplexNoise(random);

module.exports = {
    "getNoiseValue": function(x, y, z, w, h, l) {
        let num = noisePer.get(y, x, z)*100-50;
        console.log(num);
        return y == 1 && !(x == 0 || z == 0 || x == w-1 || z == l-1) ? 1 : 
                !((x == 0 || y == 0 || z == 0) || (x == w-1 || y == h-1 || z == l-1)) ?
                    num >= 0.2 ? 1 : 0 : 0;
    },

    "simplexNoise": (x, y, z, w, h, l, densityNum, noise, mod) => {
        density = Math.abs(noise.get((x+mod)*0.01, (y+mod)*0.01, (z+mod)*0.01));
        /*if(y == 1 && !(x == 0 || z == 0 || x == w-1 || z == l-1)){
            return 1;
        }*/
        if(((y == 0 || x == 0 || z == 0) || (y == h-1 || x == w-1 || z == l-1))){
            return 0;
        }
        if(density > densityNum){
            return 1;
        }
        return 0;
    }
}