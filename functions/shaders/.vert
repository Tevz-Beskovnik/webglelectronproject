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
    //translation matrix
    mat4 mTrans = mat4(1.0, 0.0, 0.0, 0.0,
                       0.0, 1.0, 0.0, 0.0,
                       0.0, 0.0, 1.0, 0.0,
                       0.0, 0.0, 5.0, 1.0);
    //z rotation matrix
    mat4 rotZ = mat4(cos(0.0), -sin(0.0), 0.0,
                     0.0, sin(0.0), cos(0.0), 
                     0.0, 0.0, 0.0, 0.0, 1.0,
                     0.0, 0.0, 0.0, 0.0, 1.0);
    //x rotation matrix
    mat4 rotX = mat4(1.0, 0.0, 0.0, 0.0,
                     0.0, cos(0.0), -sin(0.0), 0.0, 
                     0.0, sin(0.0), cos(0.0), 0.0, 
                     0.0, 0.0, 0.0, 1.0);
    //world matrix
    mat4 mWorld = (rotZ * rotX) * mTrans;

    //calculate mView
    vec3 newFor = normalize(vertTarget - vertCamera);
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

    fragColor = vec3(vertColor.x * dp, vertColor.y * dp, vertColor.z * dp);
    gl_Position = vec4(mProj * mView * mWorld * vec4(vertPosition, 1.0));
}