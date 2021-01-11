const element = document.getElementById("lol");
const viewPort = require('./viewport');
const { min, max, floor, abs } = Math
const { getPoints } = require('./points');
const { multiplyMatrixAndPoint, multiplyMatrixAndPoint4x4, multiplyMatrices, MatrixXRotation, MatrixYRotation, MatrixZRotation, customVecMultiply } = require('./matrix');
const matrixes = require('./matrix');
const points = require('./points');
const viewPortGL = require("./viewportGL");

let sides = [
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

let vpGL = new viewPortGL(500, 800, 60, 90, "canv");
let projMat = vpGL.projectionMatrix();

let rotZM = 0.0;
let rotXM = 0.0;
let rotYM = 0.0;
let upscaleMult = 0.001;
let hdv = 0.8;
let mv = 0;

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
});

setInterval(()=> {

    vpGL.vertex3DCalc(sides, rotXM, rotYM, rotZM);

    vpGL.draw([
        0.75, 0.85, 0.8, 1.0
    ]);

}, 50);