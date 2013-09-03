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

//------------------------------------------
// ShapeCircle
//------------------------------------------

ShapeCircle = function(local_x, local_y, radius) {
	Shape.call(this, Shape.TYPE_CIRCLE);
	this.c = new vec2(local_x || 0, local_y || 0);
	this.r = radius;

	this.tc = vec2.zero;

	this.finishVerts();
}

ShapeCircle.prototype = new Shape;
ShapeCircle.prototype.constructor = ShapeCircle;

ShapeCircle.prototype.finishVerts = function() {
	this.r = Math.abs(this.r);
}

ShapeCircle.prototype.duplicate = function() {
	return new ShapeCircle(this.c.x, this.c.y, this.r);
}

ShapeCircle.prototype.serialize = function() {
	return {
		"type": "ShapeCircle",
		"e": this.e,
		"u": this.u,
		"density": this.density,
		"center": this.c,
		"radius": this.r
	};
}

ShapeCircle.prototype.recenter = function(c) {
	this.c.subself(c);
}

ShapeCircle.prototype.transform = function(xf) {
	this.c = xf.transform(this.c);
}

ShapeCircle.prototype.untransform = function(xf) {
	this.c = xf.untransform(this.c);
}

ShapeCircle.prototype.area = function() {
	return areaForCircle(this.r, 0);
}

ShapeCircle.prototype.centroid = function() {
	return this.c.duplicate();
}

ShapeCircle.prototype.inertia = function(mass) {
	return inertiaForCircle(mass, this.c, this.r, 0);
}

ShapeCircle.prototype.cacheData = function(xf) {
	this.tc = xf.transform(this.c);
	this.bounds.mins.set(this.tc.x - this.r, this.tc.y - this.r);
	this.bounds.maxs.set(this.tc.x + this.r, this.tc.y + this.r);
}

ShapeCircle.prototype.pointQuery = function(p) {
	return vec2.distsq(this.tc, p) < (this.r * this.r);
}

ShapeCircle.prototype.findVertexByPoint = function(p, minDist) {
	var dsq = minDist * minDist;

	if (vec2.distsq(this.tc, p) < dsq) {
		return 0;
	}

	return -1;
}

ShapeCircle.prototype.distanceOnPlane = function(n, d) {
	return vec2.dot(n, this.tc) - this.r - d;
}