/*
* Copyright (c) 2012 Ju Hyung Lee
*
* Permission is hereby granted, free of charge, to any person obtaining a copy of this software 
* and associated documentation files (the "Software"), to deal in the Software without 
* restriction, including without limitation the rights to use, copy, modify, merge, publish, 
* distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the 
* Software is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all copies or 
* substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING 
* BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, 
* DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

function areaForCircle(radius_outer, radius_inner) {
	return Math.PI * (radius_outer * radius_outer - radius_inner * radius_inner);
}

function inertiaForCircle(mass, center, radius_outer, radius_inner) {
	return mass * ((radius_outer * radius_outer + radius_inner * radius_inner) * 0.5 + center.lengthsq());
}

function areaForSegment(a, b, radius) {
	return radius * (Math.PI * radius + 2 * vec2.dist(a, b));
}

function centroidForSegment(a, b) {
    return vec2.scale(vec2.add(a, b), 0.5);
}

function inertiaForSegment(mass, a, b) {
	var distsq = vec2.distsq(b, a);
	var offset = vec2.scale(vec2.add(a, b), 0.5);
	
	return mass * (distsq / 12 + offset.lengthsq());
}

function areaForPoly(verts) {
	var area = 0;
	for (var i = 0; i < verts.length; i++) {
		area += vec2.cross(verts[i], verts[(i + 1) % verts.length]);
	}
	
	return area / 2;
}

function centroidForPoly(verts) {
	var area = 0;
	var vsum = new vec2(0, 0);
	
	for (var i = 0; i < verts.length; i++) {
		var v1 = verts[i];
		var v2 = verts[(i + 1) % verts.length];
		var cross = vec2.cross(v1, v2);
		
		area += cross;
		vsum.addself(vec2.scale(vec2.add(v1, v2), cross));
	}
	
	return vec2.scale(vsum, 1 / (3 * area));
}

function inertiaForPoly(mass, verts, offset) {
	var sum1 = 0;
	var sum2 = 0;

	for (var i = 0; i < verts.length; i++) {
		var v1 = vec2.add(verts[i], offset);
		var v2 = vec2.add(verts[(i+1) % verts.length], offset);
		
		var a = vec2.cross(v2, v1);
		var b = vec2.dot(v1, v1) + vec2.dot(v1, v2) + vec2.dot(v2, v2);
		
		sum1 += a * b;
		sum2 += a;
	}
	
	return (mass * sum1) / (6 * sum2);
}

function inertiaForBox(mass, w, h) {
	return mass * (w * w + h * h) / 12;
}

// Create the convex hull using the Gift wrapping algorithm
// http://en.wikipedia.org/wiki/Gift_wrapping_algorithm
function createConvexHull(points) {	
	// Find the right most point on the hull
	var i0 = 0;
	var x0 = points[0].x;
	for (var i = 1; i < points.length; i++) {
		var x = points[i].x;
		if (x > x0 || (x == x0 && points[i].y < points[i0].y)) {
			i0 = i;
			x0 = x;
		}
	}

	var n = points.length;
	var hull = [];
	var m = 0;
	var ih = i0;

	while (1) {
		hull[m] = ih;

		var ie = 0;
		for (var j = 1; j < n; j++) {
			if (ie == ih) {
				ie = j;
				continue;
			}

			var r = vec2.sub(points[ie], points[hull[m]]);
			var v = vec2.sub(points[j], points[hull[m]]);
			var c = vec2.cross(r, v);
			if (c < 0) {
				ie = j;
			}

			// Collinearity check
			if (c == 0 && v.lengthsq() > r.lengthsq()) {
				ie = j;
			}
		}

		m++;
		ih = ie;

		if (ie == i0) {
			break;
		}		
	}

	// Copy vertices
	var newPoints = [];
	for (var i = 0; i < m; ++i) {
		newPoints.push(points[hull[i]]);
	}

	return newPoints;
}