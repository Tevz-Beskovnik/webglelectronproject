const { PI, sqrt } = Math
const { multiplyMatrixAndPoint, multiplyMatrixAndPoint4x4, multiplyMatrices, MatrixXRotation, matrixTranslation, MatrixYRotation, MatrixZRotation, customVecMultiply, MatrixIdentity, Matrix_MultiplyVector, MatrixQuickInverse } = require('./matrix');
const { vecAdd, vecCrossPru, vecDiv, vecDotPru, vecLen, vecMul, vecNorm, vecSub, matrixPointAt, Triangle_ClipAgainstPlane, recursiveMatProj } = require("./vectorCalculations");

function ctg(x) { return 1 / Math.tan(x); }
function actg(x) { return Math.PI / 2 - Math.atan(x); }

Array.prototype.insert = function ( index, item ) {
    this.splice( index, 0, item );
};

class ViewPortGL {
    constructor(height, width, refreshRate, fov, canvasID, ZoomOut) {

        /*
            Viewport settings
        */
        
       this.rfr = refreshRate;

       this.ZoomOut = ZoomOut || 3;

       this.h = height;

       this.w = width;

       this.fNear = 0.1;

       this.fFar = 1000;

       this.fov = fov;

       this.fovRad = ctg(fov * 0.5 / 180 * PI);

       this.ascpectRation = this.h / this.w;

        /*
            Camera variables (that must not be reset)
        */

        this.vLookDir = [0, 0, 1];

        this.vLookDirSqued = [1, 0, 0];

        this.vCamera = [0, 0, 0];

        this.fYaw = 0;
        
        /*
            WebGL declaration
        */
        this.TriangleVerBufObj;

        this.numOfPoints;

        this.canvas = document.getElementById(canvasID);

        this.canvas.width = this.w;
        this.canvas.height = this.h;

        this.gl = this.canvas.getContext('webgl', {preserveDrawingBuffer: false, antialias : false});

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
            attribute vec3 vertNormal;
            attribute vec3 vertCamera;
            attribute vec3 vertTarget;

            varying vec3 fragColor;

            uniform mat4 mProj;

            mat4 inverse(mat4 mat)
            {
                mat4 returnMat;
                returnMat[0][0] = mat[0][0];
                returnMat[0][1] = mat[1][0];
                returnMat[0][2] = mat[2][0];
                returnMat[0][3] = 0.0;
                returnMat[1][0] = mat[0][1];
                returnMat[1][1] = mat[1][1];
                returnMat[1][2] = mat[2][1];
                returnMat[1][3] = 0.0;
                returnMat[2][0] = mat[0][2];
                returnMat[2][1] = mat[1][2];
                returnMat[2][2] = mat[2][2];
                returnMat[2][3] = 0.0;
                returnMat[3][0] = -(mat[3][0] * returnMat[0][0] + mat[3][1] * returnMat[1][0] + mat[3][2] * returnMat[2][0]);
                returnMat[3][1] = -(mat[3][0] * returnMat[0][1] + mat[3][1] * returnMat[1][1] + mat[3][2] * returnMat[2][1]);
                returnMat[3][2] = -(mat[3][0] * returnMat[0][2] + mat[3][1] * returnMat[1][2] + mat[3][2] * returnMat[2][2]);
                returnMat[3][3] = 1.0;
                return returnMat;
            }

            void main()
            {
                vec3 newPos = vec3(vertPosition);
                //translation matrix
                mat4 mTrans = mat4(1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 5.0, 1.0);
                //z rotation matrix
                mat4 rotZ = mat4(cos(0.0), -sin(0.0), 0.0, 0.0, sin(0.0), cos(0.0), 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0);
                //x rotation matrix
                mat4 rotX = mat4(1.0, 0.0, 0.0, 0.0, 0.0, cos(0.0), -sin(0.0), 0.0, 0.0, sin(0.0), cos(0.0), 0.0, 0.0, 0.0, 0.0, 1.0);
                //world matrix
                mat4 mWorld = (rotZ * rotX) * mTrans;
            
                //calculate mView
                vec3 newFor = normalize(vertCamera - vertTarget);
                vec3 a = newFor * dot(vec3(0, 1, 0), newFor);
                vec3 newUp = normalize(vec3(0, 1, 0) - a);
                vec3 newRight = cross(newUp, newFor);

                //create mCamera
                mat4 mCamera = mat4(
                    newRight.x, newRight.y, newRight.z, 0,
                    newUp.x, newUp.y, newUp.z, 0,
                    newFor.x, newFor.y, newFor.z, 0,
                    vertCamera.x, vertCamera.y, vertCamera.z, 0
                );
                
                //create mView
                mat4 mView = inverse(mCamera);
                
                //light direction
                vec3 lightDir = normalize(vec3(0, 1, -1));
                
                //calculate dp
                float dp = max(0.1, dot(lightDir, vertNormal));
                
                //translated postion vector
                vec4 vTrans = vec4(vertPosition, 1.0) * mWorld;
                
                fragColor = vec3(vertColor.x * dp, vertColor.y * dp, vertColor.z * dp);
                gl_Position = mProj * (mView * (vec4(vertPosition, 1.0) * mWorld));
            }
        `/*`
            precision highp float;

            attribute vec3 vertColor;
            attribute vec3 vertPosition;
            varying vec3 fragColor;

            void main()
            {
                fragColor = vertColor;
                gl_Position = vec4(vertPosition, 1.0);
            }
        `;/**/

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

        this.uniforms = {
            mProjMat: this.gl.getUniformLocation(this.program, `mProj`)
        }


    }

    projectionMatrix = () => {
        const mat =  [
            this.ascpectRation * this.fovRad, 0.0, 0.0, 0.0,
            0.0, this.fovRad, 0.0, 0.0,
            0.0, 0.0, this.fFar / (this.fFar - this.fNear), 1.0,
            0.0, 0.0, (-this.fFar * this.fNear) / (this.fFar - this.fNear), 0.0
        ]

        this.gl.uniformMatrix4fv(this.uniforms.mProjMat, false, mat);
    }

    setTriangles = (coordsAndColors) => {

        this.numOfPoints = coordsAndColors.length/15;

        this.gl.deleteBuffer(this.TriangleVerBufObj);

        this.TriangleVerBufObj = this.gl.createBuffer();

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.TriangleVerBufObj);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(coordsAndColors), this.gl.STATIC_DRAW);

        var positionAttrLoc = this.gl.getAttribLocation(this.program, 'vertPosition');
        
        var colorAttrLoc = this.gl.getAttribLocation(this.program, 'vertColor');

        var normalAttrLoc = this.gl.getAttribLocation(this.program, 'vertNormal');

        var cameraAttrLoc = this.gl.getAttribLocation(this.program, 'vertCamera');

        var targetAttrLoc = this.gl.getAttribLocation(this.program, 'vertTarget');

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
            3 * Float32Array.BYTES_PER_ELEMENT// offset from the coordinates in bits to the color values so 3 skips :)
        );

        this.gl.vertexAttribPointer(
            normalAttrLoc,
            3,
            this.gl.FLOAT,
            this.gl.FALSE,
            6 * Float32Array.BYTES_PER_ELEMENT, //size of one vertex
            6 * Float32Array.BYTES_PER_ELEMENT
        )

        this.gl.vertexAttribPointer(
            cameraAttrLoc,
            3,
            this.gl.FLOAT,
            this.gl.FALSE,
            6 * Float32Array.BYTES_PER_ELEMENT, //size of one vertex
            9 * Float32Array.BYTES_PER_ELEMENT
        )

        this.gl.vertexAttribPointer(
            targetAttrLoc,
            3,
            this.gl.FLOAT,
            this.gl.FALSE,
            6 * Float32Array.BYTES_PER_ELEMENT, //size of one vertex
            12 * Float32Array.BYTES_PER_ELEMENT
        )

        this.gl.enableVertexAttribArray(positionAttrLoc);
        this.gl.enableVertexAttribArray(colorAttrLoc);
    }

    vertex3DCalc = (vertecies, opts) => {

        let vertexPointsCols = [];

        let trisToRaster = [];

        let vUp = [0, 1, 0, 1];

        let vTarget = [0, 0, 1, 1];

        let vTarget2 = [1, 0, 0, 1];

        //this.vCamera[0] += 10*opts.x;
        this.vCamera[1] += 20*opts.forward;

        this.fYaw += 8*opts.yaw;

        const vForward = vecMul(this.vLookDir, 30*opts.y);

        const vSideways = vecMul(this.vLookDirSqued, 30*opts.x);

        this.vCamera = vecAdd(this.vCamera, vForward);

        this.vCamera = vecAdd(this.vCamera, vSideways);

        const rotZ = MatrixZRotation(0 * 0.5);
        const mCameraRot = MatrixYRotation(this.fYaw);
        const mCamreaRotSqued = MatrixYRotation(this.fYaw);
		const rotX = MatrixXRotation(0);

        const mTrans = matrixTranslation(0.0, 0.0, 5.0);

        let mWorld = MatrixIdentity();
        mWorld = multiplyMatrices(rotZ, rotX);
        mWorld = multiplyMatrices(mWorld, mTrans);

        //ustvari "kaži proti" matriko za kamero
        
        this.vLookDir = customVecMultiply(mCameraRot, vTarget);
        this.vLookDirSqued = customVecMultiply(mCamreaRotSqued, vTarget2);
        vTarget = vecAdd(this.vCamera, this.vLookDir);
        vTarget2 = vecAdd(this.vCamera, this.vLookDirSqued);

        /*const mCamera = matrixPointAt(this.vCamera, vTarget, vUp);

        const mView = MatrixQuickInverse(mCamera);*/

        vertecies.forEach(tri => {

            const translated1 = customVecMultiply(mWorld, tri[0]);
            const translated2 = customVecMultiply(mWorld, tri[1]); // <--- moje točke se pomnožijo z matriko, ki predstavlja svet.
            const translated3 = customVecMultiply(mWorld, tri[2]);

            /*
                Lighting
            */

            //naredim linije iz tranzlacij za točke.

            const line1 = vecSub(translated2, translated1);
            const line2 = vecSub(translated3, translated1); 

            const normal = vecNorm(vecCrossPru(line1, line2)); // <-- križni produkt normaliziram (nimam pojma kaj je normalizacija)

            const vCameraRay = vecSub(translated1, this.vCamera); // <--- žarek kamere*/

            if(vecDotPru(normal, vCameraRay) < 0){
                //#region 
                //illumination
                const lightDir = vecNorm([0, 1, -1]) // <--- direkcija svetlobe

                const dp = Math.max(0.1, vecDotPru(lightDir, normal));

                const col = [tri[3][0]*dp, tri[3][1]*dp, tri[3][2]*dp];

                const triViewed1 = customVecMultiply(mView, translated1);
                const triViewed2 = customVecMultiply(mView, translated2);
                const triViewed3 = customVecMultiply(mView, translated3);

                let clippedTris = Triangle_ClipAgainstPlane([0, 0, 0.1, 1], [0, 0, 1, 1], [triViewed1, triViewed2, triViewed3]); 
                let nClippedTris = clippedTris.length-1;

                vertexPointsCols.push(
                    ...recursiveMatProj(clippedTris, nClippedTris, [], col, projMat)
                );*/
                //#endregion
                
                normal.pop();
                vTarget.pop();

                vertexPointsCols.push(
                    ...tri[0], ...col, ...normal, ...this.vCamera, vTarget.pop(),
                    ...tri[1], ...col, ...normal, ...this.vCamera, vTarget.pop(),
                    ...tri[2], ...col, ...normal, ...this.vCamera, vTarget.pop()
                );
            }

            
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

        this.projectionMatrix();

        this.gl.drawArrays(this.gl.TRIANGLES, 0, this.numOfPoints);
    }
}

module.exports = ViewPortGL;