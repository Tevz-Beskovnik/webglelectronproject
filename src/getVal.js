const element = document.getElementById("lol");
const viewPort = require('../functions/viewport');
const { min, max, floor, abs, sqrt } = Math
const { getPoints } = require('../functions/points');
const { multiplyMatrixAndPoint, multiplyMatrixAndPoint4x4, multiplyMatrices, MatrixXRotation, MatrixYRotation, MatrixZRotation, customVecMultiply } = require('../functions/matrix');
const matrixes = require('../functions/matrix');
const points = require('../functions/points');
const viewPortGL = require("../functions/viewportGL");
const CubeTriCoords = require("../functions/CubeTriCoords");
const displayNum = 1;

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

let marchCubArr = [];
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

const h = 7
const w = 7
const l = 7

const MarchTriCoords = new CubeTriCoords(w, h, l, 0);

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