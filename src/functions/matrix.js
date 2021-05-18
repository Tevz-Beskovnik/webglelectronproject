    function multiplyMatrixAndPoint(matrix, point){
        const c0r0 = matrix[0], c1r0 = matrix[1], c2r0 = matrix[2], c3r0 = matrix[3];
        const c0r1 = matrix[4], c1r1 = matrix[5], c2r1 = matrix[6], c3r1 = matrix[7];
        const c0r2 = matrix[8], c1r2 = matrix[9], c2r2 = matrix[10], c3r2 = matrix[11];
        const c0r3 = matrix[12], c1r3 = matrix[13], c2r3 = matrix[14], c3r3 = matrix[15];
    
        const x = point[0];
        const y = point[1];
        const z = point[2];
        const w = point[3];
    
        const resultX = (x*c0r0) + (y*c0r1) + (z*c0r2) + (w * c0r3);
        const resultY = (x*c1r0) + (y*c1r1) + (z*c1r2) + (w * c1r3);
        const resultZ = (x*c2r0) + (y*c2r1) + (z*c2r2) + (w * c2r3);
        const resultW = (x*c3r0) + (y*c3r1) + (z*c3r2) + (w * c3r3);
    
        return [resultX, resultY, resultZ, resultW];
    }

    function customVecMultiply(matrix, point) {
        // Give a simple variable name to each part of the matrix, a column and row number
        const c0r0 = matrix[ 0], c1r0 = matrix[ 1], c2r0 = matrix[ 2], c3r0 = matrix[ 3];
        const c0r1 = matrix[ 4], c1r1 = matrix[ 5], c2r1 = matrix[ 6], c3r1 = matrix[ 7];
        const c0r2 = matrix[ 8], c1r2 = matrix[ 9], c2r2 = matrix[10], c3r2 = matrix[11];
        const c0r3 = matrix[12], c1r3 = matrix[13], c2r3 = matrix[14], c3r3 = matrix[15];

        // Now set some simple names for the point
        const x = point[0];
        const y = point[1];
        const z = point[2];
        
        // Multiply the point against each part of the 1st column, then add together
        let resX = (x * c0r0) + (y * c0r1) + (z * c0r2) + (c0r3);
        
        // Multiply the point against each part of the 2nd column, then add together
        let resY = (x * c1r0) + (y * c1r1) + (z * c1r2) + (c1r3);
        
        // Multiply the point against each part of the 3rd column, then add together
        let resZ = (x * c2r0) + (y * c2r1) + (z * c2r2) + (c2r3);
        
        // Multiply the point against each part of the 4th column, then add together
        let resW = (x * c3r0) + (y * c3r1) + (z * c3r2) + (c3r3);

        if(resW != 0){
            resX /= resW; resY /= resW; resZ /= resW;
        }
        
        return [(resX), (resY), (resZ)];
    }

    function multiplyMatrixAndPoint4x4 (matrix, point) {
        // Give a simple variable name to each part of the matrix, a column and row number
        const c0r0 = matrix[ 0], c1r0 = matrix[ 1], c2r0 = matrix[ 2], c3r0 = matrix[ 3];
        const c0r1 = matrix[ 4], c1r1 = matrix[ 5], c2r1 = matrix[ 6], c3r1 = matrix[ 7];
        const c0r2 = matrix[ 8], c1r2 = matrix[ 9], c2r2 = matrix[10], c3r2 = matrix[11];
        const c0r3 = matrix[12], c1r3 = matrix[13], c2r3 = matrix[14], c3r3 = matrix[15];
        
        // Now set some simple names for the point
        const x = point[0];
        const y = point[1];
        const z = point[2];
        const w = point[3];
        
        // Multiply the point against each part of the 1st column, then add together
        let resultX = (x * c0r0) + (y * c0r1) + (z * c0r2) + (w * c0r3);
        
        // Multiply the point against each part of the 2nd column, then add together
        let resultY = (x * c1r0) + (y * c1r1) + (z * c1r2) + (w * c1r3);
        
        // Multiply the point against each part of the 3rd column, then add together
        let resultZ = (x * c2r0) + (y * c2r1) + (z * c2r2) + (w * c2r3);
        
        // Multiply the point against each part of the 4th column, then add together
        let resultW = (x * c3r0) + (y * c3r1) + (z * c3r2) + (w * c3r3);
        
        return [resultX, resultY, resultZ, resultW];
    }

function Matrix_MultiplyVector(matrix, point){
    const c0r0 = matrix[ 0], c1r0 = matrix[ 1], c2r0 = matrix[ 2], c3r0 = matrix[ 3];
    const c0r1 = matrix[ 4], c1r1 = matrix[ 5], c2r1 = matrix[ 6], c3r1 = matrix[ 7];
    const c0r2 = matrix[ 8], c1r2 = matrix[ 9], c2r2 = matrix[10], c3r2 = matrix[11];
    const c0r3 = matrix[12], c1r3 = matrix[13], c2r3 = matrix[14], c3r3 = matrix[15];

    const x = point[0] * c0r0 + point[1] * c1r0 + point[2] * c2r0 + point[3] * c3r0;
    const y = point[0] * c0r1 + point[1] * c1r1 + point[2] * c2r1 + point[3] * c3r1;
    const z = point[0] * c0r2 + point[1] * c1r2 + point[2] * c2r2 + point[3] * c3r2;
    const w = point[0] * c0r3 + point[1] * c1r3 + point[2] * c2r3 + point[3] * c3r3;

    return [x, y, z, w];
}

function matrixTranslation(x, y, z){
    return [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        x, y, z, 1
    ];
}

function multiplyMatrices(m1, m2){
    let matrix = [
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0
    ];
	for (let c = 0; c < 4; c++)
		for (let r = 0; r < 4; r++)
			matrix[r*4+c] = m1[r*4+0] * m2[0*4+c] + m1[r*4+1] * m2[1*4+c] + m1[r*4+2] * m2[2*4+c] + m1[r*4+3] * m2[3*4+c];

	return matrix;
}

function MatrixZRotation(a){
    return [
        Math.cos(a), -Math.sin(a), 0, 0,
        Math.sin(a), Math.cos(a), 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]
}

function MatrixIdentity() {
    return [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ];
}

function MatrixQuickInverse(m) {
    let matrix = [
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0
    ];
    matrix[0] = m[0]; matrix[1] = m[4]; matrix[2] = m[8]; matrix[3] = 0;
    matrix[4] = m[1]; matrix[5] = m[5]; matrix[6] = m[9]; matrix[7] = 0;
    matrix[8] = m[2]; matrix[9] = m[6]; matrix[10] = m[10]; matrix[11] = 0;
    matrix[12] = -(m[12] * matrix[0] + m[13] * matrix[4] + m[14] * matrix[8]);
    matrix[13] = -(m[12] * matrix[1] + m[13] * matrix[5] + m[14] * matrix[9]);
    matrix[14] = -(m[12] * matrix[2] + m[13] * matrix[6] + m[14] * matrix[10]);
    matrix[15] = 1;

    return matrix;
}

function MatrixXRotation(a) {
    return [
        1, 0, 0, 0,
        0, Math.cos(a * 0.5), -Math.sin(a * 0.5), 0,
        0, Math.sin(a * 0.5), Math.cos(a * 0.5), 0,
        0, 0, 0, 1
    ]
}

function MatrixYRotation (a) {
    return [
        Math.cos(a), 0, Math.sin(a), 0,
        0, 1, 0, 0,
        -Math.sin(a), 0, Math.cos(a), 0,
        0, 0, 0, 1
    ]
}