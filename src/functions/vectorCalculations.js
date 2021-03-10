    function vecAdd(v1, v2){
        return [v1[0] + v2[0], v1[1] + v2[1], v1[2] + v2[2]];
    }
    function vecSub(v1, v2){
        return [v1[0] - v2[0], v1[1] - v2[1], v1[2] - v2[2]];
    }
    function vecMul(v1, k){
        return [v1[0] * k, v1[1] * k, v1[2] * k];
    }
    function vecDiv(v1, k){
        return [v1[0] / k, v1[1] / k, v1[2] / k];
    }
    function vecDotPru(v1, v2){
        return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2]; 
    }
    function vecLen(v){
        return Math.sqrt(vecDotPru(v, v));
    }
    function vecNorm(v){
        const l = vecLen(v);
        return l != 0 ? [ v[0] / l, v[1] / l, v[2] / l] : [ v[0], v[1], v[2]];
    }
    function vecCrossPru(v1, v2){
        return [
            v1[1] * v2[2] - v1[2] * v2[1],
            v1[2] * v2[0] - v1[0] * v2[2],
            v1[0] * v2[1] - v1[1] * v2[0]
        ];
    }

	//pointaj proti temu, kamera gleda v to smer
    function matrixPointAt(pos, target, up){

		//izračunaj novo smer v katero gleda naprej
        let newForward = vecSub(target, pos);
        newForward = vecNorm(newForward);

		//izračunaj novo gor smer
        const a = vecMul(newForward, vecDotPru(up, newForward));
        let newUp = vecSub(up, a);
        newUp = vecNorm(newUp);

        const newRight = vecCrossPru(newUp, newForward);

        return mat = [
            newRight[0], newRight[1], newRight[2], 0,
            newUp[0], newUp[1], newUp[2], 0,
            newForward[0], newForward[1], newForward[2], 0,
            pos[0], pos[1], pos[2], 0
        ];
    }

    function Vector_IntersectPlane(plane_p, plane_n, lineStart, lineEnd){
		plane_n = vecNorm(plane_n);
		const plane_d = -vecDotPru(plane_n, plane_p);
		const ad = vecDotPru(lineStart, plane_n);
		const bd = vecDotPru(lineEnd, plane_n);
		const t = (-plane_d - ad) / (bd - ad);
		const lineStartToEnd = vecSub(lineEnd, lineStart);
		const lineToIntersect = vecMul(lineStartToEnd, t);
		return vecAdd(lineStart, lineToIntersect);
	}
    function Triangle_ClipAgainstPlane(plane_p, plane_n, in_tri){
        
        var out_tri1 = Array(3), out_tri2 = Array(3);

		// Make sure plane normal is indeed normal
		plane_n = vecNorm(plane_n);

		// Return signed shortest distance from point to plane, plane normal must be normalised
		/*auto dist = [&](vec3d &p)*/
        function dist(p){
			let n = vecNorm(p);
			return plane_n[0] * n[0] + plane_n[1] * n[1] + plane_n[2] * n[2] - vecDotPru(plane_n, plane_p);
		};

		// Create two temporary storage arrays to classify points either side of plane
		// If distance sign is positive, point lies on "inside" of plane
		let inside_points = [0, 0, 0]; let nInsidePointCount = 0;
		let outside_points = [0, 0, 0]; let nOutsidePointCount = 0;

		// Get signed distance of each point in triangle to plane
		let d0 = dist(in_tri[0]);
		let d1 = dist(in_tri[1]);
		let d2 = dist(in_tri[2]);

		if (d0 >= 0) { inside_points[nInsidePointCount++] = in_tri[0]; }
		else { outside_points[nOutsidePointCount++] = in_tri[0]; }
		if (d1 >= 0) { inside_points[nInsidePointCount++] = in_tri[1]; }
		else { outside_points[nOutsidePointCount++] = in_tri[1]; }
		if (d2 >= 0) { inside_points[nInsidePointCount++] = in_tri[2]; }
		else { outside_points[nOutsidePointCount++] = in_tri[2]; }

		// Now classify triangle points, and break the input triangle into 
		// smaller output triangles if required. There are four possible
		// outcomes...

		if (nInsidePointCount == 0)
		{
			// All points lie on the outside of plane, so clip whole triangle
			// It ceases to exist

			return []; // No returned triangles are valid
		}

		if (nInsidePointCount == 3)
		{
			// All points lie on the inside of plane, so do nothing
			// and allow the triangle to simply pass through
			out_tri1 = in_tri;

			return [out_tri1]; // Just the one returned original triangle is valid
		}

		if (nInsidePointCount == 1 && nOutsidePointCount == 2)
		{
			// Triangle should be clipped. As two points lie outside
			// the plane, the triangle simply becomes a smaller triangle

			// Copy appearance info to new triangle

			// The inside point is valid, so keep that...
			out_tri1[0] = inside_points[0];

			// but the two new points are at the locations where the 
			// original sides of the triangle (lines) intersect with the plane
			out_tri1[1] = Vector_IntersectPlane(plane_p, plane_n, inside_points[0], outside_points[0]);
			out_tri1[2] = Vector_IntersectPlane(plane_p, plane_n, inside_points[0], outside_points[1]);

			return [out_tri1]; // Return the newly formed single triangle
		}

		if (nInsidePointCount == 2 && nOutsidePointCount == 1)
		{
			// Triangle should be clipped. As two points lie inside the plane,
			// the clipped triangle becomes a "quad". Fortunately, we can
			// represent a quad with two new triangles

			// Copy appearance info to new triangles

			// The first triangle consists of the two inside points and a new
			// point determined by the location where one side of the triangle
			// intersects with the plane
			out_tri1[0] = inside_points[0];
			out_tri1[1] = inside_points[1];
			out_tri1[2] = Vector_IntersectPlane(plane_p, plane_n, inside_points[0], outside_points[0]);

			// The second triangle is composed of one of he inside points, a
			// new point determined by the intersection of the other side of the 
			// triangle and the plane, and the newly created point above
			out_tri2[0] = inside_points[1];
			out_tri2[1] = out_tri1[2];
			out_tri2[2] = Vector_IntersectPlane(plane_p, plane_n, inside_points[1], outside_points[0]);

            return [out_tri1, out_tri2];
		}
	}

	function recursiveMatProj(arr, n, output, col, projMat){
		if(n == -1){
			return output;
		}

		let output2 = [];

		let points1 = customVecMultiply(projMat, arr[n][0]);
		let points2 = customVecMultiply(projMat, arr[n][1]);
		let points3 = customVecMultiply(projMat, arr[n][2]);

		points1[2] = (points1[2] - 0.9) * 10;
		points2[2] = (points2[2] - 0.9) * 10;
		points3[2] = (points3[2] - 0.9) * 10;

		output2.push(
			...points1, ...col,
			...points2, ...col,
			...points3, ...col
		)

		return recursiveMatProj(arr, n-1, output2, col, projMat);

	}