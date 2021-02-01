const Alea = require("alea");
var random = new Alea(1932858712884)

const perlinNoise = require("simplex-noise");
const noise = new perlinNoise(random);

module.exports = {
 
    generateFloorPlane: (width = 48, height = 48, length = 48, minval = 8) => {
        let endArr = [];
        let randMod = Math.floor(Math.random()*10000);

        for(let i = 0; i < width; i++){
            let floorArr = [];
            for(let j = 0; j < height; j++){
                let lineArr = [];
                for(let l = 0; l < length; l++){
                    let val = noise.get(i+randMod, j+randMod, l+randMod)*100-50;
                    !((j == 0 || i == 0 || l == 0) || (j == height-1 || i == width-1 || l == length-1)) ?
                        val > minval ? lineArr.push(1) : lineArr.push(0)
                        :
                        lineArr.push(0);
                }
                floorArr.push(lineArr);
            }
            endArr.push(floorArr);
        }
        return endArr;
    }

}