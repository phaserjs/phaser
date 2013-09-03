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

//--------------------------------
// ShapePoly (convex only)
//--------------------------------

ShapePoly = function(verts) {
	Shape.call(this, Shape.TYPE_POLY);

	this.verts = [];
	this.planes = [];
   
	this.tverts = [];
	this.tplanes = [];

	if (verts) {
		for (var i = 0; i < verts.length; i++) {
			this.verts[i] = verts[i].duplicate();
			this.tverts[i] = this.verts[i];

			this.tplanes[i] = {};
			this.tplanes[i].n = vec2.zero;
			this.tplanes[i].d = 0;
		}
	}

	this.finishVerts();
}

ShapePoly.prototype = new Shape;
ShapePoly.prototype.constructor = ShapePoly;

ShapePoly.prototype.finishVerts = function() {
	if (this.verts.length < 2) {
		this.convexity = false;
		this.planes = [];
		return;
	}

	this.convexity = true;
	this.tverts = [];
	this.tplanes = [];	

	// Must be counter-clockwise verts
	for (var i = 0; i < this.verts.length; i++) {
		var a = this.verts[i];
		var b = this.verts[(i + 1) % this.verts.length];
		var n = vec2.normalize(vec2.perp(vec2.sub(a, b)));

		this.planes[i] = {};
		this.planes[i].n = n;
		this.planes[i].d = vec2.dot(n, a);

		this.tverts[i] = this.verts[i];

		this.tplanes[i] = {};
		this.tplanes[i].n = vec2.zero;
		this.tplanes[i].d = 0;		
	}

	for (var i = 0; i < this.verts.length; i++) {
		var b = this.verts[(i + 2) % this.verts.length];
		var n = this.planes[i].n;
		var d = this.planes[i].d;

		if (vec2.dot(n, b) - d > 0) {
			this.convexity = false;
		}
	}
}

ShapePoly.prototype.duplicate = function() {
	return new ShapePoly(this.verts);
}

ShapePoly.prototype.serialize = function() {
	return {
		"type": "ShapePoly",
		"e": this.e,
		"u": this.u,
		"density": this.density,
		"verts": this.verts
	};
}

ShapePoly.prototype.recenter = function(c) {
	for (var i = 0; i < this.verts.length; i++) {
		this.verts[i].subself(c);
	}
}

ShapePoly.prototype.transform = function(xf) {
	for (var i = 0; i < this.verts.length; i++) {
		this.verts[i] = xf.transform(this.verts[i]);
	}
}

ShapePoly.prototype.untransform = function(xf) {
	for (var i = 0; i < this.verts.length; i++) {
		this.verts[i] = xf.untransform(this.verts[i]);
	}
}

ShapePoly.prototype.area = function() {
	return areaForPoly(this.verts);
}

ShapePoly.prototype.centroid = function() {
	return centroidForPoly(this.verts);
}

ShapePoly.prototype.inertia = function(mass) {
	return inertiaForPoly(mass, this.verts, vec2.zero);
}

ShapePoly.prototype.cacheData = function(xf) {

	this.bounds.clear();

	var numVerts = this.verts.length;

	if (numVerts == 0) {
		return;
	}

	for (var i = 0; i < numVerts; i++) {
		this.tverts[i] = xf.transform(this.verts[i]);
	}		

	if (numVerts < 2) {
		this.bounds.addPoint(this.tverts[0]);
		return;
	}	

	for (var i = 0; i < numVerts; i++) {

		var a = this.tverts[i];
		var b = this.tverts[(i + 1) % numVerts];
		var n = vec2.normalize(vec2.perp(vec2.sub(a, b)));

		this.tplanes[i].n = n;
		this.tplanes[i].d = vec2.dot(n, a);

		this.bounds.addPoint(a);

	}

}

ShapePoly.prototype.pointQuery = function(p) {
	if (!this.bounds.containPoint(p)) {
		return false;
	}

	return this.containPoint(p);
}

ShapePoly.prototype.findVertexByPoint = function(p, minDist) {
	var dsq = minDist * minDist;

	for (var i = 0; i < this.tverts.length; i++) {
		if (vec2.distsq(this.tverts[i], p) < dsq) {
			return i;
		}
	}

	return -1;
}

ShapePoly.prototype.findEdgeByPoint = function(p, minDist) {
	var dsq = minDist * minDist;
	var numVerts = this.tverts.length;

	for (var i = 0; i < this.tverts.length; i++) {
		var v1 = this.tverts[i];
		var v2 = this.tverts[(i + 1) % numVerts];
		var n = this.tplanes[i].n;

		var dtv1 = vec2.cross(v1, n);
		var dtv2 = vec2.cross(v2, n);
		var dt = vec2.cross(p, n);

		if (dt > dtv1) {
			if (vec2.distsq(v1, p) < dsq) {
				return i;
			}
		}
		else if (dt < dtv2) {
			if (vec2.distsq(v2, p) < dsq) {
				return i;
			}
		}
		else {
			var dist = vec2.dot(n, p) - vec2.dot(n, v1);
			if (dist * dist < dsq) {
				return i;
			}
		}
	}

	return -1;
}

ShapePoly.prototype.distanceOnPlane = function(n, d) {
	var min = 999999;
	for (var i = 0; i < this.verts.length; i++) {
		min = Math.min(min, vec2.dot(n, this.tverts[i]));
	}
	return min - d;
}

ShapePoly.prototype.containPoint = function(p) {
	for (var i = 0; i < this.verts.length; i++) {
		var plane = this.tplanes[i];
		if (vec2.dot(plane.n, p) - plane.d > 0) {
			return false;
		}
	}

	return true;
}

ShapePoly.prototype.containPointPartial = function(p, n) {
	for (var i = 0; i < this.verts.length; i++) {
		var plane = this.tplanes[i];
		if (vec2.dot(plane.n, n) < 0.0001) {
			continue;
		}

		if (vec2.dot(plane.n, p) - plane.d > 0) {
			return false;
		}
	}

	return true;
}

