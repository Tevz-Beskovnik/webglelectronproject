const { tan, atan, sin, asin, cos, acos, PI } = Math
const process = require('process');
const viewPort = require('./viewport');
const glClear = require("gl-clear");
const { multiplyMatrixAndPoint, multiplyMatrixAndPoint4x4, multiplyMatrices, MatrixXRotation, MatrixYRotation, MatrixZRotation, customVecMultiply } = require('./matrix');

function ctg(x) { return 1 / Math.tan(x); }
function actg(x) { return Math.PI / 2 - Math.atan(x); }

Array.prototype.insert = function ( index, item ) {
    this.splice( index, 0, item );
};

class ViewPortGL {
    constructor(height, width, refreshRate, fov, canvasID) {

        /*
            Viewport settings
        */
        
       this.rfr = refreshRate;

       this.h = height;

       this.w = width;

       this.fNear = 0.1;

       this.fFar = 100;

       this.fov = fov;

       this.fovRad = ctg(fov * 0.5 / 180 * PI);

       this.ascpectRation = this.h / this.w;
        
        /*
            WebGL declaration
        */
        this.TriangleVerBufObj;

        this.numOfPoints;

        this.canvas = document.getElementById(canvasID);

        this.canvas.width = this.w;
        this.canvas.height = this.h;

        this.gl = this.canvas.getContext('webgl', {preserveDrawingBuffer: false});

        if(!this.gl) this.gl = this.canvas.getContext('experimental-webgl', {preserveDrawingBuffer: false});
        if(!this.gl) alert("Your browser does not support webGL.");

        this.gl.enable(this.gl.DEPTH_TEST);
	    this.gl.enable(this.gl.CULL_FACE);
	    this.gl.frontFace(this.gl.CCW);
	    this.gl.cullFace(this.gl.FRONT);

        /*
            WebGL glsl functions written in strings
        */

        this.vertexShaderStr = `
            precision highp float;

            attribute vec3 vertColor;
            attribute vec3 vertPosition;
            varying vec3 fragColor;

            void main()
            {
                fragColor = vertColor;
                gl_Position = vec4(vertPosition, 1.0);
            }
        `;

        this.fragShaderStr = `
            precision mediump float;

            varying vec3 fragColor;

            void main()
            {
                gl_FragColor = vec4(fragColor, 1.0);
            }
        `;

        /*
            WebGL ustvarjanje shaderjev.
        */

        this.vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);

        this.fragShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);

        this.gl.shaderSource(this.vertexShader, this.vertexShaderStr);

        this.gl.shaderSource(this.fragShader, this.fragShaderStr);

        /*
            WebGL shader compiling
        */

        this.gl.compileShader(this.vertexShader);
        //compiler error handeling
        if(!this.gl.getShaderParameter(this.vertexShader, this.gl.COMPILE_STATUS)){
            console.error('ERROR while compiling vertex shader', this.gl.getShaderInfoLog(this.vertexShader));
            return;
        }

        this.gl.compileShader(this.fragShader);
        //compiler error handeling
        if(!this.gl.getShaderParameter(this.fragShader, this.gl.COMPILE_STATUS)){
            console.error('ERROR while compiling fragment shader', this.gl.getShaderInfoLog(this.fragShader));
            return;
        }

        /*
            WebGL program
        */

        this.program = this.gl.createProgram();

        this.gl.attachShader(this.program, this.vertexShader);

        this.gl.attachShader(this.program, this.fragShader);

        this.gl.linkProgram(this.program);
        //compiler error handeling
        if(!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)){
            console.error("ERROR while compiling the program", this.gl.getProgramInfoLog(this.program));
            return;
        }

        /*
            WebGL validate program xDDD no clue what it does :)))) youtube guy didn't say it probably validates everything :))))) idk
        */

        this.gl.validateProgram(this.program);
        if(!this.gl.getProgramParameter(this.program, this.gl.VALIDATE_STATUS)){
            console.error("ERROR validating the program caused and error", this.gl.getProgramInfoLog(this.program));
            return;
        }
    }

    projectionMatrix = () => {
        return [
            this.ascpectRation * this.fovRad, 0, 0, 0,
            0, this.fovRad, 0, 0,
            0, 0, this.fFar / (this.fFar - this.fNear), 1,
            0, 0, (-this.fFar * this.fNear) / (this.fFar - this.fNear), 0
        ]
    }

    setTriangles = (coordsAndColors, sizeOfVec) => {

        this.numOfPoints = coordsAndColors.length/sizeOfVec;

        this.gl.deleteBuffer(this.TriangleVerBufObj);

        this.TriangleVerBufObj = this.gl.createBuffer();

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.TriangleVerBufObj);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(coordsAndColors), this.gl.STATIC_DRAW);

        var positionAttrLoc = this.gl.getAttribLocation(this.program, 'vertPosition');
        
        var colorAttrLoc = this.gl.getAttribLocation(this.program, 'vertColor');

        this.gl.vertexAttribPointer(
            positionAttrLoc, //atribute Location
            3, //size of vector
            this.gl.FLOAT, //type of element stored in array
            this.gl.FALSE,
            6 * Float32Array.BYTES_PER_ELEMENT, // size of individual vertex
            0 //no offset fuck you :middle_finger:
        );

        this.gl.vertexAttribPointer(
            colorAttrLoc,
            3,
            this.gl.FLOAT,
            this.gl.FALSE,
            6 * Float32Array.BYTES_PER_ELEMENT, //size of one vertex
            3 * Float32Array.BYTES_PER_ELEMENT// offset from the coordinates in bits to the color values so 2 skips :)
        );

        this.gl.enableVertexAttribArray(positionAttrLoc);
        this.gl.enableVertexAttribArray(colorAttrLoc);
    }

    vertex3DCalc = (vertecies, rotXN, rotYN, rotZN) => {

        let Zml = 0.9;

        let vertexPointsCols = [];

        let rotZ = MatrixZRotation(rotZN);
        let rotX = MatrixXRotation(rotXN);
        let rotY = MatrixYRotation(rotYN);

        let projMat = this.projectionMatrix();

        vertecies.forEach(tri => {

            let m1 = customVecMultiply(rotX, tri[0]);
            let m2 = customVecMultiply(rotX, tri[1]);
            let m3 = customVecMultiply(rotX, tri[2]);

            let points1 = customVecMultiply(rotZ, m1);
            let points2 = customVecMultiply(rotZ, m2);
            let points3 = customVecMultiply(rotZ, m3);

            points1 = customVecMultiply(rotY, points1);
            points2 = customVecMultiply(rotY, points2);
            points3 = customVecMultiply(rotY, points3);

            let translated1 = points1;
            let translated2 = points2;
            let translated3 = points3;

            translated1[2] += 3;
            translated2[2] += 3;
            translated3[2] += 3;

            points1 = customVecMultiply(projMat, translated1);
            points2 = customVecMultiply(projMat, translated2);
            points3 = customVecMultiply(projMat, translated3);

            points1[2] = (points1[2] - Zml) * 10;
            points2[2] = (points2[2] - Zml) * 10;
            points3[2] = (points3[2] - Zml) * 10;

            vertexPointsCols.push(
                points1[0], points1[1], points1[2], 1.0, 0.0, 0.0,
                points2[0], points2[1], points2[2], 0.0, 1.0, 0.0,
                points3[0], points3[1], points3[2], 0.0, 0.0, 1.0
            );
        });

        this.setTriangles(vertexPointsCols, 6);
    }

    draw = (backgroundRgbaArray) => {
        this.gl.clearColor(backgroundRgbaArray[0], backgroundRgbaArray[1], backgroundRgbaArray[2], backgroundRgbaArray[3]);
        this.gl.clear(
            this.gl.DEPTH_BUFFER_BIT | 
            this.gl.COLOR_BUFFER_BIT |
            this.gl.STENCIL_BUFFER_BIT    
        );
        
        this.gl.useProgram(this.program);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, this.numOfPoints);
    }
}

module.exports = ViewPortGL;