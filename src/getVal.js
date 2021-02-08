const viewPort = require('../functions/viewport');
const { min, max, floor, abs, sqrt } = Math
const { getPoints } = require('../functions/points');
const { multiplyMatrixAndPoint, multiplyMatrixAndPoint4x4, multiplyMatrices, MatrixXRotation, MatrixYRotation, MatrixZRotation, customVecMultiply } = require('../functions/matrix');
const matrixes = require('../functions/matrix');
const points = require('../functions/points');
const viewPortGL = require("../functions/viewportGL");
const CubeTriCoords = require("../functions/CubeTriCoords");
const perlinNoise = require("perlin-noise-3d");
const noise = new perlinNoise(4335235532);
const displayNum = 1;
const colors = [
    [0.13, 0.54, 0.13],
    [0.13, 0.54, 0.13],
    [0.13, 0.54, 0.13],
    [0.13, 0.54, 0.13]
];
/*[
    [0.52, 0.80, 0.98],
    [0.13, 0.54, 0.13],
    [0.66, 0.66, 0.66],
    [1, 1, 1],
]*/


var rangex = 0;
var rangey = 0;
var rangez = 0;

var noiseSpace = 0.001;

var rangeDens = 0.4;

const Alea = require("alea");
var random = new Alea(11204481988);
const simplexNoise = require("simplex-noise");
const simplex = new simplexNoise(random);

const cubeSides = [
    //SOUTH
    [ [-0.5 , -0.5 , -0.5] ,    [-0.5 , 0.5 , -0.5] ,    [0.5 , 0.5 , -0.5]  ],
    [ [-0.5 , -0.5 , -0.5] ,    [0.5 , 0.5 , -0.5] ,    [0.5 , -0.5 , -0.5]  ],
   // EAST 
    [ [0.5 , -0.5 , -0.5] ,    [0.5 , 0.5 , -0.5] ,    [0.5 , 0.5 , 0.5]  ],
    [ [0.5 , -0.5 , -0.5] ,    [0.5 , 0.5 , 0.5] ,    [0.5 , -0.5 , 0.5]  ],
   // NORTH
    [ [0.5 , -0.5 , 0.5] ,    [0.5 , 0.5 , 0.5] ,    [-0.5 , 0.5 , 0.5]  ],
    [ [0.5 , -0.5 , 0.5] ,    [-0.5 , 0.5 , 0.5] ,    [-0.5 , -0.5 , 0.5]  ],
   // WEST
    [ [-0.5 , -0.5 , 0.5] ,    [-0.5 , 0.5 , 0.5] ,    [-0.5 , 0.5 , -0.5]  ],
    [ [-0.5 , -0.5 , 0.5] ,    [-0.5 , 0.5 , -0.5] ,    [-0.5 , -0.5 , -0.5]  ],
   // TOP
    [ [-0.5 , 0.5 , -0.5] ,    [-0.5 , 0.5 , 0.5] ,    [0.5 , 0.5 , 0.5]  ],
    [ [-0.5 , 0.5 , -0.5] ,    [0.5 , 0.5 , 0.5] ,    [0.5 , 0.5 , -0.5]  ],
   // BOTTOM
    [ [0.5 , -0.5 , 0.5] ,    [-0.5 , -0.5 , 0.5] ,    [-0.5 , -0.5 , -0.5]  ],
    [ [0.5 , -0.5 , 0.5] ,    [-0.5 , -0.5 , -0.5] ,    [0.5 , -0.5 , -0.5]  ]
]

var marchCubArr = [];
/*

    1 x 1 x 1

    cube 8 points

    [x, y, z]

    BOTTOM SQUARE
    1.point [0, 0, 0]
    2.point [1, 0, 0]
    3.point [0, 1, 0]
    4.point [1, 1, 0]

    TOP SQUARE
    1.point [0, 0, 1]
    2.point [1, 0, 1]
    3.point [0, 1, 1]
    4.point [1, 1, 1]
*/

/*let vp = new viewPort(200, 200, 60, 90);
let projMat = vp.projectionMatrix();*/

const h = 30
const w = 30
const l = 30

const MarchTriCoords = new CubeTriCoords(w, h, l, {
    density: 0.4, 
    xmod: 0, 
    ymod: 0, 
    zmod: 0, 
    sampleRate: 0.01,
    noise: noise
}, colors, true);

const vpGL = new viewPortGL(730, 1490, 60, 90, "canv", 17);

let rotZM = 0.0;
let rotXM = 0.0;
let rotYM = 0.0;
let zoom = 17.0;

for(let i = 0; i<w-1; i++){
    for(let j = 0; j<h-1; j++){
        for(let u = 0; u<l-1; u++){
            let point = MarchTriCoords.getTriArrs(i, j, u)
            point.length > 0 ? marchCubArr.push(...point) : 0;
        }
    }
}

console.log(marchCubArr)

document.addEventListener('keydown', (e) => {
    e = e || window.event;

    if(e.key == "a"){
        rotYM -= 0.1;
    }else if(e.key == "d"){
        rotYM += 0.1;
    }

    if(e.key == "w"){
        rotXM -= 0.1;
    }else if(e.key == "s"){
        rotXM += 0.1;
    }

    if(e.key == "z"){
        zoom+=0.1;
    }

    if(e.key == "o"){
        zoom-=0.1;
    }
    if(e.key == "ArrowLeft"){
        removeRangex();
    }
    if(e.key == "ArrowRight"){
        addRangex();
    }
    if(e.key == "ArrowDown"){
        removeRangey();
    }
    if(e.key == "ArrowUp"){
        addRangey();
    }
    if(e.key == "m"){
        removeRangez();
    }
    if(e.key == "n"){
        addRangez();
    }
    if(e.key == "r"){
        redraw();
    }
});

if(displayNum == 0){
    setInterval(()=> {
        vpGL.vertex3DCalc(cubeSides, rotXM, rotYM, rotZM, zoom);

        vpGL.draw([
            0.75, 0.85, 0.8, 1.0
        ]);

    }, 50);
}else{
    setInterval(()=> {
        vpGL.vertex3DCalc(marchCubArr, rotXM, rotYM, rotZM, zoom);

        vpGL.draw([
            0.75, 0.85, 0.8, 1.0
        ]);

    }, 50);
}

function change(value, id, text){
    document.getElementById(id).innerHTML = text + value/1000;
    noiseSpace = value/1000;
}

function change2(value, id, text){
    document.getElementById(id).innerHTML = text + value/100;
    rangeDens = value/100;
}

function addRangex(){
    let div = document.getElementById("rangex")

    rangex+=1;

    div.innerHTML = "Noise range x: " + rangex;
    redraw();
}

function removeRangex(){
    let div = document.getElementById("rangex")

    rangex-=1;

    div.innerHTML = "Noise range x: " + rangex;
    redraw();
}

function addRangey(){
    let div = document.getElementById("rangey")

    rangey+=1;

    div.innerHTML = "Noise range y: " + rangey;
    redraw();
}

function removeRangey(){
    let div = document.getElementById("rangey")

    rangey-=1;

    div.innerHTML = "Noise range y: " + rangey;
    redraw();
}

function addRangez(){
    let div = document.getElementById("rangez")

    rangez+=1;

    div.innerHTML = "Noise range z: " + rangez;
    redraw();
}

function removeRangez(){
    let div = document.getElementById("rangez")

    rangez-=1;

    div.innerHTML = "Noise range z: " + rangez;
    redraw();
}

function redraw(){

    const MarchTriCubesRe = new CubeTriCoords(w, h, l, {
        density: rangeDens, 
        xmod: rangex/(Math.pow(10, Math.abs(Math.log10(noiseSpace)+1))),
        ymod: rangey/(Math.pow(10, Math.abs(Math.log10(noiseSpace)+1))),
        zmod: rangez/(Math.pow(10, Math.abs(Math.log10(noiseSpace)+1))), 
        sampleRate: noiseSpace,
        noise: noise
    }, colors, true);

    marchCubArr = [];

    for(let i = 0; i<w-1; i++){
        for(let j = 0; j<h-1; j++){
            for(let u = 0; u<l-1; u++){
                let point = MarchTriCubesRe.getTriArrs(i, j, u)
                point.length > 0 ? marchCubArr.push(...point) : 0;
            }
        }
    }

    console.log(marchCubArr);
}

