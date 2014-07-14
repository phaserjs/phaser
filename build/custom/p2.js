/**
 * The MIT License (MIT)
 * 
 * Copyright (c) 2013 p2.js authors
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
!function(e){"object"==typeof exports?module.exports=e():"function"==typeof define&&define.amd?define('p2', (function() { return this.p2 = e(); })()):"undefined"!=typeof window?window.p2=e():"undefined"!=typeof global?self.p2=e():"undefined"!=typeof self&&(self.p2=e())}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

if(!GLMAT_EPSILON) {
    var GLMAT_EPSILON = 0.000001;
}

if(!GLMAT_ARRAY_TYPE) {
    var GLMAT_ARRAY_TYPE = (typeof Float32Array !== 'undefined') ? Float32Array : Array;
}

/**
 * @class Common utilities
 * @name glMatrix
 */
var glMatrix = {};

/**
 * Sets the type of array used when creating new vectors and matricies
 *
 * @param {Type} type Array type, such as Float32Array or Array
 */
glMatrix.setMatrixArrayType = function(type) {
    GLMAT_ARRAY_TYPE = type;
}

if(typeof(exports) !== 'undefined') {
    exports.glMatrix = glMatrix;
}
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 2 Dimensional Vector
 * @name vec2
 */
var vec2 = {};

/**
 * Creates a new, empty vec2
 *
 * @returns {vec2} a new 2D vector
 */
vec2.create = function() {
    var out = new GLMAT_ARRAY_TYPE(2);
    out[0] = 0;
    out[1] = 0;
    return out;
};

/**
 * Creates a new vec2 initialized with values from an existing vector
 *
 * @param {vec2} a vector to clone
 * @returns {vec2} a new 2D vector
 */
vec2.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(2);
    out[0] = a[0];
    out[1] = a[1];
    return out;
};

/**
 * Creates a new vec2 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @returns {vec2} a new 2D vector
 */
vec2.fromValues = function(x, y) {
    var out = new GLMAT_ARRAY_TYPE(2);
    out[0] = x;
    out[1] = y;
    return out;
};

/**
 * Copy the values from one vec2 to another
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the source vector
 * @returns {vec2} out
 */
vec2.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    return out;
};

/**
 * Set the components of a vec2 to the given values
 *
 * @param {vec2} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @returns {vec2} out
 */
vec2.set = function(out, x, y) {
    out[0] = x;
    out[1] = y;
    return out;
};

/**
 * Adds two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.add = function(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    return out;
};

/**
 * Subtracts two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.subtract = function(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    return out;
};

/**
 * Alias for {@link vec2.subtract}
 * @function
 */
vec2.sub = vec2.subtract;

/**
 * Multiplies two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.multiply = function(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    return out;
};

/**
 * Alias for {@link vec2.multiply}
 * @function
 */
vec2.mul = vec2.multiply;

/**
 * Divides two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.divide = function(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    return out;
};

/**
 * Alias for {@link vec2.divide}
 * @function
 */
vec2.div = vec2.divide;

/**
 * Returns the minimum of two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.min = function(out, a, b) {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    return out;
};

/**
 * Returns the maximum of two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.max = function(out, a, b) {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    return out;
};

/**
 * Scales a vec2 by a scalar number
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec2} out
 */
vec2.scale = function(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    return out;
};

/**
 * Calculates the euclidian distance between two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} distance between a and b
 */
vec2.distance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1];
    return Math.sqrt(x*x + y*y);
};

/**
 * Alias for {@link vec2.distance}
 * @function
 */
vec2.dist = vec2.distance;

/**
 * Calculates the squared euclidian distance between two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} squared distance between a and b
 */
vec2.squaredDistance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1];
    return x*x + y*y;
};

/**
 * Alias for {@link vec2.squaredDistance}
 * @function
 */
vec2.sqrDist = vec2.squaredDistance;

/**
 * Calculates the length of a vec2
 *
 * @param {vec2} a vector to calculate length of
 * @returns {Number} length of a
 */
vec2.length = function (a) {
    var x = a[0],
        y = a[1];
    return Math.sqrt(x*x + y*y);
};

/**
 * Alias for {@link vec2.length}
 * @function
 */
vec2.len = vec2.length;

/**
 * Calculates the squared length of a vec2
 *
 * @param {vec2} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
vec2.squaredLength = function (a) {
    var x = a[0],
        y = a[1];
    return x*x + y*y;
};

/**
 * Alias for {@link vec2.squaredLength}
 * @function
 */
vec2.sqrLen = vec2.squaredLength;

/**
 * Negates the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to negate
 * @returns {vec2} out
 */
vec2.negate = function(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    return out;
};

/**
 * Normalize a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to normalize
 * @returns {vec2} out
 */
vec2.normalize = function(out, a) {
    var x = a[0],
        y = a[1];
    var len = x*x + y*y;
    if (len > 0) {
        //TODO: evaluate use of glm_invsqrt here?
        len = 1 / Math.sqrt(len);
        out[0] = a[0] * len;
        out[1] = a[1] * len;
    }
    return out;
};

/**
 * Calculates the dot product of two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} dot product of a and b
 */
vec2.dot = function (a, b) {
    return a[0] * b[0] + a[1] * b[1];
};

/**
 * Computes the cross product of two vec2's
 * Note that the cross product must by definition produce a 3D vector
 *
 * @param {vec3} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec3} out
 */
vec2.cross = function(out, a, b) {
    var z = a[0] * b[1] - a[1] * b[0];
    out[0] = out[1] = 0;
    out[2] = z;
    return out;
};

/**
 * Performs a linear interpolation between two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec2} out
 */
vec2.lerp = function (out, a, b, t) {
    var ax = a[0],
        ay = a[1];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    return out;
};

/**
 * Transforms the vec2 with a mat2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat2} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat2 = function(out, a, m) {
    var x = a[0],
        y = a[1];
    out[0] = m[0] * x + m[2] * y;
    out[1] = m[1] * x + m[3] * y;
    return out;
};

/**
 * Transforms the vec2 with a mat2d
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat2d} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat2d = function(out, a, m) {
    var x = a[0],
        y = a[1];
    out[0] = m[0] * x + m[2] * y + m[4];
    out[1] = m[1] * x + m[3] * y + m[5];
    return out;
};

/**
 * Transforms the vec2 with a mat3
 * 3rd vector component is implicitly '1'
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat3} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat3 = function(out, a, m) {
    var x = a[0],
        y = a[1];
    out[0] = m[0] * x + m[3] * y + m[6];
    out[1] = m[1] * x + m[4] * y + m[7];
    return out;
};

/**
 * Transforms the vec2 with a mat4
 * 3rd vector component is implicitly '0'
 * 4th vector component is implicitly '1'
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat4 = function(out, a, m) {
    var x = a[0], 
        y = a[1];
    out[0] = m[0] * x + m[4] * y + m[12];
    out[1] = m[1] * x + m[5] * y + m[13];
    return out;
};

/**
 * Perform some operation over an array of vec2s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec2. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
vec2.forEach = (function() {
    var vec = vec2.create();

    return function(a, stride, offset, count, fn, arg) {
        var i, l;
        if(!stride) {
            stride = 2;
        }

        if(!offset) {
            offset = 0;
        }
        
        if(count) {
            l = Math.min((count * stride) + offset, a.length);
        } else {
            l = a.length;
        }

        for(i = offset; i < l; i += stride) {
            vec[0] = a[i]; vec[1] = a[i+1];
            fn(vec, vec, arg);
            a[i] = vec[0]; a[i+1] = vec[1];
        }
        
        return a;
    };
})();

/**
 * Returns a string representation of a vector
 *
 * @param {vec2} vec vector to represent as a string
 * @returns {String} string representation of the vector
 */
vec2.str = function (a) {
    return 'vec2(' + a[0] + ', ' + a[1] + ')';
};

if(typeof(exports) !== 'undefined') {
    exports.vec2 = vec2;
}

},{}],2:[function(require,module,exports){
var Scalar = require('./Scalar');

module.exports = Line;

/**
 * Container for line-related functions
 * @class Line
 */
function Line(){};

/**
 * Compute the intersection between two lines.
 * @static
 * @method lineInt
 * @param  {Array}  l1          Line vector 1
 * @param  {Array}  l2          Line vector 2
 * @param  {Number} precision   Precision to use when checking if the lines are parallel
 * @return {Array}              The intersection point.
 */
Line.lineInt = function(l1,l2,precision){
    precision = precision || 0;
    var i = [0,0]; // point
    var a1, b1, c1, a2, b2, c2, det; // scalars
    a1 = l1[1][1] - l1[0][1];
    b1 = l1[0][0] - l1[1][0];
    c1 = a1 * l1[0][0] + b1 * l1[0][1];
    a2 = l2[1][1] - l2[0][1];
    b2 = l2[0][0] - l2[1][0];
    c2 = a2 * l2[0][0] + b2 * l2[0][1];
    det = a1 * b2 - a2*b1;
    if (!Scalar.eq(det, 0, precision)) { // lines are not parallel
        i[0] = (b2 * c1 - b1 * c2) / det;
        i[1] = (a1 * c2 - a2 * c1) / det;
    }
    return i;
};

/**
 * Checks if two line segments intersects.
 * @method segmentsIntersect
 * @param {Array} p1 The start vertex of the first line segment.
 * @param {Array} p2 The end vertex of the first line segment.
 * @param {Array} q1 The start vertex of the second line segment.
 * @param {Array} q2 The end vertex of the second line segment.
 * @return {Boolean} True if the two line segments intersect
 */
Line.segmentsIntersect = function(p1, p2, q1, q2){
   var dx = p2[0] - p1[0];
   var dy = p2[1] - p1[1];
   var da = q2[0] - q1[0];
   var db = q2[1] - q1[1];

   // segments are parallel
   if(da*dy - db*dx == 0)
      return false;

   var s = (dx * (q1[1] - p1[1]) + dy * (p1[0] - q1[0])) / (da * dy - db * dx)
   var t = (da * (p1[1] - q1[1]) + db * (q1[0] - p1[0])) / (db * dx - da * dy)

   return (s>=0 && s<=1 && t>=0 && t<=1);
};


},{"./Scalar":5}],3:[function(require,module,exports){
module.exports = Point;

/**
 * Point related functions
 * @class Point
 */
function Point(){};

/**
 * Get the area of a triangle spanned by the three given points. Note that the area will be negative if the points are not given in counter-clockwise order.
 * @static
 * @method area
 * @param  {Array} a
 * @param  {Array} b
 * @param  {Array} c
 * @return {Number}
 */
Point.area = function(a,b,c){
    return (((b[0] - a[0])*(c[1] - a[1]))-((c[0] - a[0])*(b[1] - a[1])));
};

Point.left = function(a,b,c){
    return Point.area(a,b,c) > 0;
};

Point.leftOn = function(a,b,c) {
    return Point.area(a, b, c) >= 0;
};

Point.right = function(a,b,c) {
    return Point.area(a, b, c) < 0;
};

Point.rightOn = function(a,b,c) {
    return Point.area(a, b, c) <= 0;
};

var tmpPoint1 = [],
    tmpPoint2 = [];

/**
 * Check if three points are collinear
 * @method collinear
 * @param  {Array} a
 * @param  {Array} b
 * @param  {Array} c
 * @param  {Number} [thresholdAngle=0] Threshold angle to use when comparing the vectors. The function will return true if the angle between the resulting vectors is less than this value. Use zero for max precision.
 * @return {Boolean}
 */
Point.collinear = function(a,b,c,thresholdAngle) {
    if(!thresholdAngle)
        return Point.area(a, b, c) == 0;
    else {
        var ab = tmpPoint1,
            bc = tmpPoint2;

        ab[0] = b[0]-a[0];
        ab[1] = b[1]-a[1];
        bc[0] = c[0]-b[0];
        bc[1] = c[1]-b[1];

        var dot = ab[0]*bc[0] + ab[1]*bc[1],
            magA = Math.sqrt(ab[0]*ab[0] + ab[1]*ab[1]),
            magB = Math.sqrt(bc[0]*bc[0] + bc[1]*bc[1]),
            angle = Math.acos(dot/(magA*magB));
        return angle < thresholdAngle;
    }
};

Point.sqdist = function(a,b){
    var dx = b[0] - a[0];
    var dy = b[1] - a[1];
    return dx * dx + dy * dy;
};

},{}],4:[function(require,module,exports){
var Line = require("./Line")
,   Point = require("./Point")
,   Scalar = require("./Scalar")

module.exports = Polygon;

/**
 * Polygon class.
 * @class Polygon
 * @constructor
 */
function Polygon(){

    /**
     * Vertices that this polygon consists of. An array of array of numbers, example: [[0,0],[1,0],..]
     * @property vertices
     * @type {Array}
     */
    this.vertices = [];
}

/**
 * Get a vertex at position i. It does not matter if i is out of bounds, this function will just cycle.
 * @method at
 * @param  {Number} i
 * @return {Array}
 */
Polygon.prototype.at = function(i){
    var v = this.vertices,
        s = v.length;
    return v[i < 0 ? i % s + s : i % s];
};

/**
 * Get first vertex
 * @method first
 * @return {Array}
 */
Polygon.prototype.first = function(){
    return this.vertices[0];
};

/**
 * Get last vertex
 * @method last
 * @return {Array}
 */
Polygon.prototype.last = function(){
    return this.vertices[this.vertices.length-1];
};

/**
 * Clear the polygon data
 * @method clear
 * @return {Array}
 */
Polygon.prototype.clear = function(){
    this.vertices.length = 0;
};

/**
 * Append points "from" to "to"-1 from an other polygon "poly" onto this one.
 * @method append
 * @param {Polygon} poly The polygon to get points from.
 * @param {Number}  from The vertex index in "poly".
 * @param {Number}  to The end vertex index in "poly". Note that this vertex is NOT included when appending.
 * @return {Array}
 */
Polygon.prototype.append = function(poly,from,to){
    if(typeof(from) == "undefined") throw new Error("From is not given!");
    if(typeof(to) == "undefined")   throw new Error("To is not given!");

    if(to-1 < from)                 throw new Error("lol1");
    if(to > poly.vertices.length)   throw new Error("lol2");
    if(from < 0)                    throw new Error("lol3");

    for(var i=from; i<to; i++){
        this.vertices.push(poly.vertices[i]);
    }
};

/**
 * Make sure that the polygon vertices are ordered counter-clockwise.
 * @method makeCCW
 */
Polygon.prototype.makeCCW = function(){
    var br = 0,
        v = this.vertices;

    // find bottom right point
    for (var i = 1; i < this.vertices.length; ++i) {
        if (v[i][1] < v[br][1] || (v[i][1] == v[br][1] && v[i][0] > v[br][0])) {
            br = i;
        }
    }

    // reverse poly if clockwise
    if (!Point.left(this.at(br - 1), this.at(br), this.at(br + 1))) {
        this.reverse();
    }
};

/**
 * Reverse the vertices in the polygon
 * @method reverse
 */
Polygon.prototype.reverse = function(){
    var tmp = [];
    for(var i=0, N=this.vertices.length; i!==N; i++){
        tmp.push(this.vertices.pop());
    }
    this.vertices = tmp;
};

/**
 * Check if a point in the polygon is a reflex point
 * @method isReflex
 * @param  {Number}  i
 * @return {Boolean}
 */
Polygon.prototype.isReflex = function(i){
    return Point.right(this.at(i - 1), this.at(i), this.at(i + 1));
};

var tmpLine1=[],
    tmpLine2=[];

/**
 * Check if two vertices in the polygon can see each other
 * @method canSee
 * @param  {Number} a Vertex index 1
 * @param  {Number} b Vertex index 2
 * @return {Boolean}
 */
Polygon.prototype.canSee = function(a,b) {
    var p, dist, l1=tmpLine1, l2=tmpLine2;

    if (Point.leftOn(this.at(a + 1), this.at(a), this.at(b)) && Point.rightOn(this.at(a - 1), this.at(a), this.at(b))) {
        return false;
    }
    dist = Point.sqdist(this.at(a), this.at(b));
    for (var i = 0; i !== this.vertices.length; ++i) { // for each edge
        if ((i + 1) % this.vertices.length === a || i === a) // ignore incident edges
            continue;
        if (Point.leftOn(this.at(a), this.at(b), this.at(i + 1)) && Point.rightOn(this.at(a), this.at(b), this.at(i))) { // if diag intersects an edge
            l1[0] = this.at(a);
            l1[1] = this.at(b);
            l2[0] = this.at(i);
            l2[1] = this.at(i + 1);
            p = Line.lineInt(l1,l2);
            if (Point.sqdist(this.at(a), p) < dist) { // if edge is blocking visibility to b
                return false;
            }
        }
    }

    return true;
};

/**
 * Copy the polygon from vertex i to vertex j.
 * @method copy
 * @param  {Number} i
 * @param  {Number} j
 * @param  {Polygon} [targetPoly]   Optional target polygon to save in.
 * @return {Polygon}                The resulting copy.
 */
Polygon.prototype.copy = function(i,j,targetPoly){
    var p = targetPoly || new Polygon();
    p.clear();
    if (i < j) {
        // Insert all vertices from i to j
        for(var k=i; k<=j; k++)
            p.vertices.push(this.vertices[k]);

    } else {

        // Insert vertices 0 to j
        for(var k=0; k<=j; k++)
            p.vertices.push(this.vertices[k]);

        // Insert vertices i to end
        for(var k=i; k<this.vertices.length; k++)
            p.vertices.push(this.vertices[k]);
    }

    return p;
};

/**
 * Decomposes the polygon into convex pieces. Returns a list of edges [[p1,p2],[p2,p3],...] that cuts the polygon.
 * Note that this algorithm has complexity O(N^4) and will be very slow for polygons with many vertices.
 * @method getCutEdges
 * @return {Array}
 */
Polygon.prototype.getCutEdges = function() {
    var min=[], tmp1=[], tmp2=[], tmpPoly = new Polygon();
    var nDiags = Number.MAX_VALUE;

    for (var i = 0; i < this.vertices.length; ++i) {
        if (this.isReflex(i)) {
            for (var j = 0; j < this.vertices.length; ++j) {
                if (this.canSee(i, j)) {
                    tmp1 = this.copy(i, j, tmpPoly).getCutEdges();
                    tmp2 = this.copy(j, i, tmpPoly).getCutEdges();

                    for(var k=0; k<tmp2.length; k++)
                        tmp1.push(tmp2[k]);

                    if (tmp1.length < nDiags) {
                        min = tmp1;
                        nDiags = tmp1.length;
                        min.push([this.at(i), this.at(j)]);
                    }
                }
            }
        }
    }

    return min;
};

/**
 * Decomposes the polygon into one or more convex sub-Polygons.
 * @method decomp
 * @return {Array} An array or Polygon objects.
 */
Polygon.prototype.decomp = function(){
    var edges = this.getCutEdges();
    if(edges.length > 0)
        return this.slice(edges);
    else
        return [this];
};

/**
 * Slices the polygon given one or more cut edges. If given one, this function will return two polygons (false on failure). If many, an array of polygons.
 * @method slice
 * @param {Array} cutEdges A list of edges, as returned by .getCutEdges()
 * @return {Array}
 */
Polygon.prototype.slice = function(cutEdges){
    if(cutEdges.length == 0) return [this];
    if(cutEdges instanceof Array && cutEdges.length && cutEdges[0] instanceof Array && cutEdges[0].length==2 && cutEdges[0][0] instanceof Array){

        var polys = [this];

        for(var i=0; i<cutEdges.length; i++){
            var cutEdge = cutEdges[i];
            // Cut all polys
            for(var j=0; j<polys.length; j++){
                var poly = polys[j];
                var result = poly.slice(cutEdge);
                if(result){
                    // Found poly! Cut and quit
                    polys.splice(j,1);
                    polys.push(result[0],result[1]);
                    break;
                }
            }
        }

        return polys;
    } else {

        // Was given one edge
        var cutEdge = cutEdges;
        var i = this.vertices.indexOf(cutEdge[0]);
        var j = this.vertices.indexOf(cutEdge[1]);

        if(i != -1 && j != -1){
            return [this.copy(i,j),
                    this.copy(j,i)];
        } else {
            return false;
        }
    }
};

/**
 * Checks that the line segments of this polygon do not intersect each other.
 * @method isSimple
 * @param  {Array} path An array of vertices e.g. [[0,0],[0,1],...]
 * @return {Boolean}
 * @todo Should it check all segments with all others?
 */
Polygon.prototype.isSimple = function(){
    var path = this.vertices;
    // Check
    for(var i=0; i<path.length-1; i++){
        for(var j=0; j<i-1; j++){
            if(Line.segmentsIntersect(path[i], path[i+1], path[j], path[j+1] )){
                return false;
            }
        }
    }

    // Check the segment between the last and the first point to all others
    for(var i=1; i<path.length-2; i++){
        if(Line.segmentsIntersect(path[0], path[path.length-1], path[i], path[i+1] )){
            return false;
        }
    }

    return true;
};

function getIntersectionPoint(p1, p2, q1, q2, delta){
    delta = delta || 0;
   var a1 = p2[1] - p1[1];
   var b1 = p1[0] - p2[0];
   var c1 = (a1 * p1[0]) + (b1 * p1[1]);
   var a2 = q2[1] - q1[1];
   var b2 = q1[0] - q2[0];
   var c2 = (a2 * q1[0]) + (b2 * q1[1]);
   var det = (a1 * b2) - (a2 * b1);

   if(!Scalar.eq(det,0,delta))
      return [((b2 * c1) - (b1 * c2)) / det, ((a1 * c2) - (a2 * c1)) / det]
   else
      return [0,0]
}

/**
 * Quickly decompose the Polygon into convex sub-polygons.
 * @method quickDecomp
 * @param  {Array} result
 * @param  {Array} [reflexVertices]
 * @param  {Array} [steinerPoints]
 * @param  {Number} [delta]
 * @param  {Number} [maxlevel]
 * @param  {Number} [level]
 * @return {Array}
 */
Polygon.prototype.quickDecomp = function(result,reflexVertices,steinerPoints,delta,maxlevel,level){
    maxlevel = maxlevel || 100;
    level = level || 0;
    delta = delta || 25;
    result = typeof(result)!="undefined" ? result : [];
    reflexVertices = reflexVertices || [];
    steinerPoints = steinerPoints || [];

    var upperInt=[0,0], lowerInt=[0,0], p=[0,0]; // Points
    var upperDist=0, lowerDist=0, d=0, closestDist=0; // scalars
    var upperIndex=0, lowerIndex=0, closestIndex=0; // Integers
    var lowerPoly=new Polygon(), upperPoly=new Polygon(); // polygons
    var poly = this,
        v = this.vertices;

    if(v.length < 3) return result;

    level++;
    if(level > maxlevel){
        console.warn("quickDecomp: max level ("+maxlevel+") reached.");
        return result;
    }

    for (var i = 0; i < this.vertices.length; ++i) {
        if (poly.isReflex(i)) {
            reflexVertices.push(poly.vertices[i]);
            upperDist = lowerDist = Number.MAX_VALUE;


            for (var j = 0; j < this.vertices.length; ++j) {
                if (Point.left(poly.at(i - 1), poly.at(i), poly.at(j))
                        && Point.rightOn(poly.at(i - 1), poly.at(i), poly.at(j - 1))) { // if line intersects with an edge
                    p = getIntersectionPoint(poly.at(i - 1), poly.at(i), poly.at(j), poly.at(j - 1)); // find the point of intersection
                    if (Point.right(poly.at(i + 1), poly.at(i), p)) { // make sure it's inside the poly
                        d = Point.sqdist(poly.vertices[i], p);
                        if (d < lowerDist) { // keep only the closest intersection
                            lowerDist = d;
                            lowerInt = p;
                            lowerIndex = j;
                        }
                    }
                }
                if (Point.left(poly.at(i + 1), poly.at(i), poly.at(j + 1))
                        && Point.rightOn(poly.at(i + 1), poly.at(i), poly.at(j))) {
                    p = getIntersectionPoint(poly.at(i + 1), poly.at(i), poly.at(j), poly.at(j + 1));
                    if (Point.left(poly.at(i - 1), poly.at(i), p)) {
                        d = Point.sqdist(poly.vertices[i], p);
                        if (d < upperDist) {
                            upperDist = d;
                            upperInt = p;
                            upperIndex = j;
                        }
                    }
                }
            }

            // if there are no vertices to connect to, choose a point in the middle
            if (lowerIndex == (upperIndex + 1) % this.vertices.length) {
                //console.log("Case 1: Vertex("+i+"), lowerIndex("+lowerIndex+"), upperIndex("+upperIndex+"), poly.size("+this.vertices.length+")");
                p[0] = (lowerInt[0] + upperInt[0]) / 2;
                p[1] = (lowerInt[1] + upperInt[1]) / 2;
                steinerPoints.push(p);

                if (i < upperIndex) {
                    //lowerPoly.insert(lowerPoly.end(), poly.begin() + i, poly.begin() + upperIndex + 1);
                    lowerPoly.append(poly, i, upperIndex+1);
                    lowerPoly.vertices.push(p);
                    upperPoly.vertices.push(p);
                    if (lowerIndex != 0){
                        //upperPoly.insert(upperPoly.end(), poly.begin() + lowerIndex, poly.end());
                        upperPoly.append(poly,lowerIndex,poly.vertices.length);
                    }
                    //upperPoly.insert(upperPoly.end(), poly.begin(), poly.begin() + i + 1);
                    upperPoly.append(poly,0,i+1);
                } else {
                    if (i != 0){
                        //lowerPoly.insert(lowerPoly.end(), poly.begin() + i, poly.end());
                        lowerPoly.append(poly,i,poly.vertices.length);
                    }
                    //lowerPoly.insert(lowerPoly.end(), poly.begin(), poly.begin() + upperIndex + 1);
                    lowerPoly.append(poly,0,upperIndex+1);
                    lowerPoly.vertices.push(p);
                    upperPoly.vertices.push(p);
                    //upperPoly.insert(upperPoly.end(), poly.begin() + lowerIndex, poly.begin() + i + 1);
                    upperPoly.append(poly,lowerIndex,i+1);
                }
            } else {
                // connect to the closest point within the triangle
                //console.log("Case 2: Vertex("+i+"), closestIndex("+closestIndex+"), poly.size("+this.vertices.length+")\n");

                if (lowerIndex > upperIndex) {
                    upperIndex += this.vertices.length;
                }
                closestDist = Number.MAX_VALUE;

                if(upperIndex < lowerIndex){
                    return result;
                }

                for (var j = lowerIndex; j <= upperIndex; ++j) {
                    if (Point.leftOn(poly.at(i - 1), poly.at(i), poly.at(j))
                            && Point.rightOn(poly.at(i + 1), poly.at(i), poly.at(j))) {
                        d = Point.sqdist(poly.at(i), poly.at(j));
                        if (d < closestDist) {
                            closestDist = d;
                            closestIndex = j % this.vertices.length;
                        }
                    }
                }

                if (i < closestIndex) {
                    lowerPoly.append(poly,i,closestIndex+1);
                    if (closestIndex != 0){
                        upperPoly.append(poly,closestIndex,v.length);
                    }
                    upperPoly.append(poly,0,i+1);
                } else {
                    if (i != 0){
                        lowerPoly.append(poly,i,v.length);
                    }
                    lowerPoly.append(poly,0,closestIndex+1);
                    upperPoly.append(poly,closestIndex,i+1);
                }
            }

            // solve smallest poly first
            if (lowerPoly.vertices.length < upperPoly.vertices.length) {
                lowerPoly.quickDecomp(result,reflexVertices,steinerPoints,delta,maxlevel,level);
                upperPoly.quickDecomp(result,reflexVertices,steinerPoints,delta,maxlevel,level);
            } else {
                upperPoly.quickDecomp(result,reflexVertices,steinerPoints,delta,maxlevel,level);
                lowerPoly.quickDecomp(result,reflexVertices,steinerPoints,delta,maxlevel,level);
            }

            return result;
        }
    }
    result.push(this);

    return result;
};

/**
 * Remove collinear points in the polygon.
 * @method removeCollinearPoints
 * @param  {Number} [precision] The threshold angle to use when determining whether two edges are collinear. Use zero for finest precision.
 * @return {Number}           The number of points removed
 */
Polygon.prototype.removeCollinearPoints = function(precision){
    var num = 0;
    for(var i=this.vertices.length-1; this.vertices.length>3 && i>=0; --i){
        if(Point.collinear(this.at(i-1),this.at(i),this.at(i+1),precision)){
            // Remove the middle point
            this.vertices.splice(i%this.vertices.length,1);
            i--; // Jump one point forward. Otherwise we may get a chain removal
            num++;
        }
    }
    return num;
};

},{"./Line":2,"./Point":3,"./Scalar":5}],5:[function(require,module,exports){
module.exports = Scalar;

/**
 * Scalar functions
 * @class Scalar
 */
function Scalar(){}

/**
 * Check if two scalars are equal
 * @static
 * @method eq
 * @param  {Number} a
 * @param  {Number} b
 * @param  {Number} [precision]
 * @return {Boolean}
 */
Scalar.eq = function(a,b,precision){
    precision = precision || 0;
    return Math.abs(a-b) < precision;
};

},{}],6:[function(require,module,exports){
module.exports = {
    Polygon : require("./Polygon"),
    Point : require("./Point"),
};

},{"./Point":3,"./Polygon":4}],7:[function(require,module,exports){
module.exports={
  "name": "p2",
  "version": "0.5.0",
  "description": "A JavaScript 2D physics engine.",
  "author": "Stefan Hedman <schteppe@gmail.com> (http://steffe.se)",
  "keywords": [
    "p2.js",
    "p2",
    "physics",
    "engine",
    "2d"
  ],
  "main": "./src/p2.js",
  "engines": {
    "node": "*"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/schteppe/p2.js.git"
  },
  "bugs": {
    "url": "https://github.com/schteppe/p2.js/issues"
  },
  "licenses": [
    {
      "type": "MIT"
    }
  ],
  "devDependencies": {
    "grunt": "~0.4.0",
    "grunt-contrib-jshint": "~0.9.2",
    "grunt-contrib-nodeunit": "~0.1.2",
    "grunt-contrib-uglify": "~0.4.0",
    "grunt-contrib-watch": "~0.5.0",
    "grunt-browserify": "~2.0.1",
    "z-schema": "~2.4.6"
  },
  "dependencies": {
    "poly-decomp": "0.1.0",
    "gl-matrix": "2.1.0"
  }
}

},{}],8:[function(require,module,exports){
var vec2 = require('../math/vec2')
,   Utils = require('../utils/Utils');

module.exports = AABB;

/**
 * Axis aligned bounding box class.
 * @class AABB
 * @constructor
 * @param {Object}  [options]
 * @param {Array}   [options.upperBound]
 * @param {Array}   [options.lowerBound]
 */
function AABB(options){

    /**
     * The lower bound of the bounding box.
     * @property lowerBound
     * @type {Array}
     */
    this.lowerBound = vec2.create();
    if(options && options.lowerBound){
        vec2.copy(this.lowerBound, options.lowerBound);
    }

    /**
     * The upper bound of the bounding box.
     * @property upperBound
     * @type {Array}
     */
    this.upperBound = vec2.create();
    if(options && options.upperBound){
        vec2.copy(this.upperBound, options.upperBound);
    }
}

var tmp = vec2.create();

/**
 * Set the AABB bounds from a set of points.
 * @method setFromPoints
 * @param {Array} points An array of vec2's.
 */
AABB.prototype.setFromPoints = function(points,position,angle){
    var l = this.lowerBound,
        u = this.upperBound;
    vec2.set(l,  Number.MAX_VALUE,  Number.MAX_VALUE);
    vec2.set(u, -Number.MAX_VALUE, -Number.MAX_VALUE);
    for(var i=0; i<points.length; i++){
        var p = points[i];

        if(typeof(angle) === "number"){
            vec2.rotate(tmp,p,angle);
            p = tmp;
        }

        for(var j=0; j<2; j++){
            if(p[j] > u[j]){
                u[j] = p[j];
            }
            if(p[j] < l[j]){
                l[j] = p[j];
            }
        }
    }

    // Add offset
    if(position){
        vec2.add(this.lowerBound, this.lowerBound, position);
        vec2.add(this.upperBound, this.upperBound, position);
    }
};

/**
 * Copy bounds from an AABB to this AABB
 * @method copy
 * @param  {AABB} aabb
 */
AABB.prototype.copy = function(aabb){
    vec2.copy(this.lowerBound, aabb.lowerBound);
    vec2.copy(this.upperBound, aabb.upperBound);
};

/**
 * Extend this AABB so that it covers the given AABB too.
 * @method extend
 * @param  {AABB} aabb
 */
AABB.prototype.extend = function(aabb){
    // Loop over x and y
    for(var i=0; i<2; i++){
        // Extend lower bound
        if(aabb.lowerBound[i] < this.lowerBound[i]){
            this.lowerBound[i] = aabb.lowerBound[i];
        }

        // Upper
        if(aabb.upperBound[i] > this.upperBound[i]){
            this.upperBound[i] = aabb.upperBound[i];
        }
    }
};

/**
 * Returns true if the given AABB overlaps this AABB.
 * @method overlaps
 * @param  {AABB} aabb
 * @return {Boolean}
 */
AABB.prototype.overlaps = function(aabb){
    var l1 = this.lowerBound,
        u1 = this.upperBound,
        l2 = aabb.lowerBound,
        u2 = aabb.upperBound;

    //      l2        u2
    //      |---------|
    // |--------|
    // l1       u1

    return ((l2[0] <= u1[0] && u1[0] <= u2[0]) || (l1[0] <= u2[0] && u2[0] <= u1[0])) &&
           ((l2[1] <= u1[1] && u1[1] <= u2[1]) || (l1[1] <= u2[1] && u2[1] <= u1[1]));
};

},{"../math/vec2":30,"../utils/Utils":47}],9:[function(require,module,exports){
var vec2 = require('../math/vec2')
var Body = require('../objects/Body')

module.exports = Broadphase;

/**
 * Base class for broadphase implementations.
 * @class Broadphase
 * @constructor
 */
function Broadphase(type){

    this.type = type;

    /**
     * The resulting overlapping pairs. Will be filled with results during .getCollisionPairs().
     * @property result
     * @type {Array}
     */
    this.result = [];

    /**
     * The world to search for collision pairs in. To change it, use .setWorld()
     * @property world
     * @type {World}
     * @readOnly
     */
    this.world = null;

    /**
     * The bounding volume type to use in the broadphase algorithms.
     * @property {Number} boundingVolumeType
     */
    this.boundingVolumeType = Broadphase.AABB;
}

/**
 * Axis aligned bounding box type.
 * @static
 * @property {Number} AABB
 */
Broadphase.AABB = 1;

/**
 * Bounding circle type.
 * @static
 * @property {Number} BOUNDING_CIRCLE
 */
Broadphase.BOUNDING_CIRCLE = 2;

/**
 * Set the world that we are searching for collision pairs in
 * @method setWorld
 * @param  {World} world
 */
Broadphase.prototype.setWorld = function(world){
    this.world = world;
};

/**
 * Get all potential intersecting body pairs.
 * @method getCollisionPairs
 * @param  {World} world The world to search in.
 * @return {Array} An array of the bodies, ordered in pairs. Example: A result of [a,b,c,d] means that the potential pairs are: (a,b), (c,d).
 */
Broadphase.prototype.getCollisionPairs = function(world){
    throw new Error("getCollisionPairs must be implemented in a subclass!");
};

var dist = vec2.create();

/**
 * Check whether the bounding radius of two bodies overlap.
 * @method  boundingRadiusCheck
 * @param  {Body} bodyA
 * @param  {Body} bodyB
 * @return {Boolean}
 */
Broadphase.boundingRadiusCheck = function(bodyA, bodyB){
    vec2.sub(dist, bodyA.position, bodyB.position);
    var d2 = vec2.squaredLength(dist),
        r = bodyA.boundingRadius + bodyB.boundingRadius;
    return d2 <= r*r;
};

/**
 * Check whether the bounding radius of two bodies overlap.
 * @method  boundingRadiusCheck
 * @param  {Body} bodyA
 * @param  {Body} bodyB
 * @return {Boolean}
 */
Broadphase.aabbCheck = function(bodyA, bodyB){
    if(bodyA.aabbNeedsUpdate){
        bodyA.updateAABB();
    }
    if(bodyB.aabbNeedsUpdate){
        bodyB.updateAABB();
    }
    return bodyA.aabb.overlaps(bodyB.aabb);
};

/**
 * Check whether the bounding radius of two bodies overlap.
 * @method  boundingRadiusCheck
 * @param  {Body} bodyA
 * @param  {Body} bodyB
 * @return {Boolean}
 */
Broadphase.prototype.boundingVolumeCheck = function(bodyA, bodyB){
    var result;

    switch(this.boundingVolumeType){
    case Broadphase.BOUNDING_CIRCLE:
        result =  Broadphase.boundingRadiusCheck(bodyA,bodyB);
        break;
    case Broadphase.AABB:
        result = Broadphase.aabbCheck(bodyA,bodyB);
        break;
    default:
        throw new Error('Bounding volume type not recognized: '+this.boundingVolumeType);
    }
    return result;
};

/**
 * Check whether two bodies are allowed to collide at all.
 * @method  canCollide
 * @param  {Body} bodyA
 * @param  {Body} bodyB
 * @return {Boolean}
 */
Broadphase.canCollide = function(bodyA, bodyB){

    // Cannot collide static bodies
    if(bodyA.motionState === Body.STATIC && bodyB.motionState === Body.STATIC){
        return false;
    }

    // Cannot collide static vs kinematic bodies
    if( (bodyA.motionState === Body.KINEMATIC && bodyB.motionState === Body.STATIC) ||
        (bodyA.motionState === Body.STATIC    && bodyB.motionState === Body.KINEMATIC)){
        return false;
    }

    // Cannot collide kinematic vs kinematic
    if(bodyA.motionState === Body.KINEMATIC && bodyB.motionState === Body.KINEMATIC){
        return false;
    }

    // Cannot collide both sleeping bodies
    if(bodyA.sleepState === Body.SLEEPING && bodyB.sleepState === Body.SLEEPING){
        return false;
    }

    // Cannot collide if one is static and the other is sleeping
    if( (bodyA.sleepState === Body.SLEEPING && bodyB.motionState === Body.STATIC) ||
        (bodyB.sleepState === Body.SLEEPING && bodyA.motionState === Body.STATIC)){
        return false;
    }

    return true;
};

Broadphase.NAIVE = 1;
Broadphase.SAP = 2;

},{"../math/vec2":30,"../objects/Body":31}],10:[function(require,module,exports){
var Circle = require('../shapes/Circle')
,   Plane = require('../shapes/Plane')
,   Particle = require('../shapes/Particle')
,   Broadphase = require('../collision/Broadphase')
,   vec2 = require('../math/vec2')
,   Utils = require('../utils/Utils')

module.exports = GridBroadphase;

/**
 * Broadphase that uses axis-aligned bins.
 * @class GridBroadphase
 * @constructor
 * @extends Broadphase
 * @param {object} [options]
 * @param {number} [options.xmin]   Lower x bound of the grid
 * @param {number} [options.xmax]   Upper x bound
 * @param {number} [options.ymin]   Lower y bound
 * @param {number} [options.ymax]   Upper y bound
 * @param {number} [options.nx]     Number of bins along x axis
 * @param {number} [options.ny]     Number of bins along y axis
 * @todo Should have an option for dynamic scene size
 */
function GridBroadphase(options){
    Broadphase.apply(this);

    options = Utils.defaults(options,{
        xmin:   -100,
        xmax:   100,
        ymin:   -100,
        ymax:   100,
        nx:     10,
        ny:     10
    });

    this.xmin = options.xmin;
    this.ymin = options.ymin;
    this.xmax = options.xmax;
    this.ymax = options.ymax;
    this.nx = options.nx;
    this.ny = options.ny;

    this.binsizeX = (this.xmax-this.xmin) / this.nx;
    this.binsizeY = (this.ymax-this.ymin) / this.ny;
}
GridBroadphase.prototype = new Broadphase();

/**
 * Get collision pairs.
 * @method getCollisionPairs
 * @param  {World} world
 * @return {Array}
 */
GridBroadphase.prototype.getCollisionPairs = function(world){
    var result = [],
        bodies = world.bodies,
        Ncolliding = bodies.length,
        binsizeX = this.binsizeX,
        binsizeY = this.binsizeY,
        nx = this.nx,
        ny = this.ny,
        xmin = this.xmin,
        ymin = this.ymin,
        xmax = this.xmax,
        ymax = this.ymax;

    // Todo: make garbage free
    var bins=[], Nbins=nx*ny;
    for(var i=0; i<Nbins; i++){
        bins.push([]);
    }

    var xmult = nx / (xmax-xmin);
    var ymult = ny / (ymax-ymin);

    // Put all bodies into bins
    for(var i=0; i!==Ncolliding; i++){
        var bi = bodies[i];
        var aabb = bi.aabb;
        var lowerX = Math.max(aabb.lowerBound[0], xmin);
        var lowerY = Math.max(aabb.lowerBound[1], ymin);
        var upperX = Math.min(aabb.upperBound[0], xmax);
        var upperY = Math.min(aabb.upperBound[1], ymax);
        var xi1 = Math.floor(xmult * (lowerX - xmin));
        var yi1 = Math.floor(ymult * (lowerY - ymin));
        var xi2 = Math.floor(xmult * (upperX - xmin));
        var yi2 = Math.floor(ymult * (upperY - ymin));

        // Put in bin
        for(var j=xi1; j<=xi2; j++){
            for(var k=yi1; k<=yi2; k++){
                var xi = j;
                var yi = k;
                var idx = xi*(ny-1) + yi;
                if(idx >= 0 && idx < Nbins){
                    bins[ idx ].push(bi);
                }
            }
        }
    }

    // Check each bin
    for(var i=0; i!==Nbins; i++){
        var bin = bins[i];

        for(var j=0, NbodiesInBin=bin.length; j!==NbodiesInBin; j++){
            var bi = bin[j];
            for(var k=0; k!==j; k++){
                var bj = bin[k];
                if(Broadphase.canCollide(bi,bj) && this.boundingVolumeCheck(bi,bj)){
                    result.push(bi,bj);
                }
            }
        }
    }
    return result;
};

},{"../collision/Broadphase":9,"../math/vec2":30,"../shapes/Circle":35,"../shapes/Particle":39,"../shapes/Plane":40,"../utils/Utils":47}],11:[function(require,module,exports){
var Circle = require('../shapes/Circle'),
    Plane = require('../shapes/Plane'),
    Shape = require('../shapes/Shape'),
    Particle = require('../shapes/Particle'),
    Broadphase = require('../collision/Broadphase'),
    vec2 = require('../math/vec2');

module.exports = NaiveBroadphase;

/**
 * Naive broadphase implementation. Does N^2 tests.
 *
 * @class NaiveBroadphase
 * @constructor
 * @extends Broadphase
 */
function NaiveBroadphase(){
    Broadphase.call(this, Broadphase.NAIVE);
}
NaiveBroadphase.prototype = new Broadphase();

/**
 * Get the colliding pairs
 * @method getCollisionPairs
 * @param  {World} world
 * @return {Array}
 */
NaiveBroadphase.prototype.getCollisionPairs = function(world){
    var bodies = world.bodies,
        result = this.result;

    result.length = 0;

    for(var i=0, Ncolliding=bodies.length; i!==Ncolliding; i++){
        var bi = bodies[i];

        for(var j=0; j<i; j++){
            var bj = bodies[j];

            if(Broadphase.canCollide(bi,bj) && this.boundingVolumeCheck(bi,bj)){
                result.push(bi,bj);
            }
        }
    }

    return result;
};

},{"../collision/Broadphase":9,"../math/vec2":30,"../shapes/Circle":35,"../shapes/Particle":39,"../shapes/Plane":40,"../shapes/Shape":42}],12:[function(require,module,exports){
var vec2 = require('../math/vec2')
,   sub = vec2.sub
,   add = vec2.add
,   dot = vec2.dot
,   Utils = require('../utils/Utils')
,   TupleDictionary = require('../utils/TupleDictionary')
,   Equation = require('../equations/Equation')
,   ContactEquation = require('../equations/ContactEquation')
,   FrictionEquation = require('../equations/FrictionEquation')
,   Circle = require('../shapes/Circle')
,   Convex = require('../shapes/Convex')
,   Shape = require('../shapes/Shape')
,   Body = require('../objects/Body')
,   Rectangle = require('../shapes/Rectangle');

module.exports = Narrowphase;

// Temp things
var yAxis = vec2.fromValues(0,1);

var tmp1 = vec2.fromValues(0,0)
,   tmp2 = vec2.fromValues(0,0)
,   tmp3 = vec2.fromValues(0,0)
,   tmp4 = vec2.fromValues(0,0)
,   tmp5 = vec2.fromValues(0,0)
,   tmp6 = vec2.fromValues(0,0)
,   tmp7 = vec2.fromValues(0,0)
,   tmp8 = vec2.fromValues(0,0)
,   tmp9 = vec2.fromValues(0,0)
,   tmp10 = vec2.fromValues(0,0)
,   tmp11 = vec2.fromValues(0,0)
,   tmp12 = vec2.fromValues(0,0)
,   tmp13 = vec2.fromValues(0,0)
,   tmp14 = vec2.fromValues(0,0)
,   tmp15 = vec2.fromValues(0,0)
,   tmp16 = vec2.fromValues(0,0)
,   tmp17 = vec2.fromValues(0,0)
,   tmp18 = vec2.fromValues(0,0)
,   tmpArray = [];

/**
 * Narrowphase. Creates contacts and friction given shapes and transforms.
 * @class Narrowphase
 * @constructor
 */
function Narrowphase(){

    /**
     * @property contactEquations
     * @type {Array}
     */
    this.contactEquations = [];

    /**
     * @property frictionEquations
     * @type {Array}
     */
    this.frictionEquations = [];

    /**
     * Whether to make friction equations in the upcoming contacts.
     * @property enableFriction
     * @type {Boolean}
     */
    this.enableFriction = true;

    /**
     * The friction slip force to use when creating friction equations.
     * @property slipForce
     * @type {Number}
     */
    this.slipForce = 10.0;

    /**
     * The friction value to use in the upcoming friction equations.
     * @property frictionCoefficient
     * @type {Number}
     */
    this.frictionCoefficient = 0.3;

    /**
     * Will be the .relativeVelocity in each produced FrictionEquation.
     * @property {Number} surfaceVelocity
     */
    this.surfaceVelocity = 0;

    this.reuseObjects = true;
    this.reusableContactEquations = [];
    this.reusableFrictionEquations = [];

    /**
     * The restitution value to use in the next contact equations.
     * @property restitution
     * @type {Number}
     */
    this.restitution = 0;

    /**
     * The stiffness value to use in the next contact equations.
     * @property {Number} stiffness
     */
    this.stiffness = Equation.DEFAULT_STIFFNESS;

    /**
     * The stiffness value to use in the next contact equations.
     * @property {Number} stiffness
     */
    this.relaxation = Equation.DEFAULT_RELAXATION;

    /**
     * The stiffness value to use in the next friction equations.
     * @property frictionStiffness
     * @type {Number}
     */
    this.frictionStiffness = Equation.DEFAULT_STIFFNESS;

    /**
     * The relaxation value to use in the next friction equations.
     * @property frictionRelaxation
     * @type {Number}
     */
    this.frictionRelaxation = Equation.DEFAULT_RELAXATION;


    // Keep track of the colliding bodies last step
    this.collidingBodiesLastStep = new TupleDictionary();
}

/**
 * Check if the bodies were in contact since the last reset().
 * @method collidedLastStep
 * @param  {Body} bi
 * @param  {Body} bj
 * @return {Boolean}
 */
Narrowphase.prototype.collidedLastStep = function(bi,bj){
    var id1 = bi.id|0,
        id2 = bj.id|0;
    return !!this.collidingBodiesLastStep.get(id1, id2);
};

// "for in" loops aren't optimised in chrome... is there a better way to handle last-step collision memory?
// Maybe do this: http://jsperf.com/reflection-vs-array-of-keys
function clearObject(obj){
    var l = obj.keys.length;
    while(l--){
        delete obj[obj.keys[l]];
    }
    obj.keys.length = 0;
}

/**
 * Throws away the old equations and gets ready to create new
 * @method reset
 * @param {World} world
 */
Narrowphase.prototype.reset = function(world){
    this.collidingBodiesLastStep.reset();
    for(var i=0; i!==this.contactEquations.length; i++){
        var eq = this.contactEquations[i],
            id1 = eq.bodyA.id|0,
            id2 = eq.bodyB.id|0;
        this.collidingBodiesLastStep.set(id1, id2, true);
    }

    if(this.reuseObjects){
        var ce = this.contactEquations,
            fe = this.frictionEquations,
            rfe = this.reusableFrictionEquations,
            rce = this.reusableContactEquations;
        Utils.appendArray(rce,ce);
        Utils.appendArray(rfe,fe);
    }

    // Reset
    this.contactEquations.length = this.frictionEquations.length = 0;
};

/**
 * Creates a ContactEquation, either by reusing an existing object or creating a new one.
 * @method createContactEquation
 * @param  {Body} bodyA
 * @param  {Body} bodyB
 * @return {ContactEquation}
 */
Narrowphase.prototype.createContactEquation = function(bodyA,bodyB,shapeA,shapeB){
    var c = this.reusableContactEquations.length ? this.reusableContactEquations.pop() : new ContactEquation(bodyA,bodyB);
    c.bodyA = bodyA;
    c.bodyB = bodyB;
    c.shapeA = shapeA;
    c.shapeB = shapeB;
    c.restitution = this.restitution;
    c.firstImpact = !this.collidedLastStep(bodyA,bodyB);
    c.stiffness = this.stiffness;
    c.relaxation = this.relaxation;
    c.needsUpdate = true;
    c.enabled = true;

    return c;
};

/**
 * Creates a FrictionEquation, either by reusing an existing object or creating a new one.
 * @method createFrictionEquation
 * @param  {Body} bodyA
 * @param  {Body} bodyB
 * @return {FrictionEquation}
 */
Narrowphase.prototype.createFrictionEquation = function(bodyA,bodyB,shapeA,shapeB){
    var c = this.reusableFrictionEquations.length ? this.reusableFrictionEquations.pop() : new FrictionEquation(bodyA,bodyB);
    c.bodyA = bodyA;
    c.bodyB = bodyB;
    c.shapeA = shapeA;
    c.shapeB = shapeB;
    c.setSlipForce(this.slipForce);
    c.frictionCoefficient = this.frictionCoefficient;
    c.relativeVelocity = this.surfaceVelocity;
    c.enabled = true;
    c.needsUpdate = true;
    c.stiffness = this.frictionStiffness;
    c.relaxation = this.frictionRelaxation;
    return c;
};

/**
 * Creates a FrictionEquation given the data in the ContactEquation. Uses same offset vectors ri and rj, but the tangent vector will be constructed from the collision normal.
 * @method createFrictionFromContact
 * @param  {ContactEquation} contactEquation
 * @return {FrictionEquation}
 */
Narrowphase.prototype.createFrictionFromContact = function(c){
    var eq = this.createFrictionEquation(c.bodyA, c.bodyB, c.shapeA, c.shapeB);
    vec2.copy(eq.contactPointA, c.contactPointA);
    vec2.copy(eq.contactPointB, c.contactPointB);
    vec2.rotate90cw(eq.t, c.normalA);
    eq.contactEquation = c;
    return eq;
};

/**
 * Convex/line narrowphase
 * @method convexLine
 * @param  {Body}       bi
 * @param  {Convex}     si
 * @param  {Array}      xi
 * @param  {Number}     ai
 * @param  {Body}       bj
 * @param  {Line}       sj
 * @param  {Array}      xj
 * @param  {Number}     aj
 * @todo Implement me!
 */
Narrowphase.prototype[Shape.LINE | Shape.CONVEX] =
Narrowphase.prototype.convexLine = function(bi,si,xi,ai, bj,sj,xj,aj, justTest){
    // TODO
    if(justTest)
        return false;
    else
        return 0;
};

/**
 * Line/rectangle narrowphase
 * @method lineRectangle
 * @param  {Body}       bi
 * @param  {Line}       si
 * @param  {Array}      xi
 * @param  {Number}     ai
 * @param  {Body}       bj
 * @param  {Rectangle}  sj
 * @param  {Array}      xj
 * @param  {Number}     aj
 * @todo Implement me!
 */
Narrowphase.prototype[Shape.LINE | Shape.RECTANGLE] =
Narrowphase.prototype.lineRectangle = function(bi,si,xi,ai, bj,sj,xj,aj, justTest){
    // TODO
    if(justTest)
        return false;
    else
        return 0;
};

function setConvexToCapsuleShapeMiddle(convexShape, capsuleShape){
    vec2.set(convexShape.vertices[0], -capsuleShape.length * 0.5, -capsuleShape.radius);
    vec2.set(convexShape.vertices[1],  capsuleShape.length * 0.5, -capsuleShape.radius);
    vec2.set(convexShape.vertices[2],  capsuleShape.length * 0.5,  capsuleShape.radius);
    vec2.set(convexShape.vertices[3], -capsuleShape.length * 0.5,  capsuleShape.radius);
}

var convexCapsule_tempRect = new Rectangle(1,1),
    convexCapsule_tempVec = vec2.create();

/**
 * Convex/capsule narrowphase
 * @method convexCapsule
 * @param  {Body}       bi
 * @param  {Convex}     si
 * @param  {Array}      xi
 * @param  {Number}     ai
 * @param  {Body}       bj
 * @param  {Capsule}    sj
 * @param  {Array}      xj
 * @param  {Number}     aj
 * @todo Implement me!
 */
Narrowphase.prototype[Shape.CAPSULE | Shape.CONVEX] =
Narrowphase.prototype[Shape.CAPSULE | Shape.RECTANGLE] =
Narrowphase.prototype.convexCapsule = function(bi,si,xi,ai, bj,sj,xj,aj, justTest){

    // Check the circles
    // Add offsets!
    var circlePos = convexCapsule_tempVec;
    vec2.set(circlePos, sj.length/2,0);
    vec2.rotate(circlePos,circlePos,aj);
    vec2.add(circlePos,circlePos,xj);
    var result1 = this.circleConvex(bj,sj,circlePos,aj, bi,si,xi,ai, justTest, sj.radius);

    vec2.set(circlePos,-sj.length/2, 0);
    vec2.rotate(circlePos,circlePos,aj);
    vec2.add(circlePos,circlePos,xj);
    var result2 = this.circleConvex(bj,sj,circlePos,aj, bi,si,xi,ai, justTest, sj.radius);

    if(justTest && (result1 || result2))
        return true;

    // Check center rect
    var r = convexCapsule_tempRect;
    setConvexToCapsuleShapeMiddle(r,sj);
    var result = this.convexConvex(bi,si,xi,ai, bj,r,xj,aj, justTest);

    return result + result1 + result2;
};

/**
 * Capsule/line narrowphase
 * @method lineCapsule
 * @param  {Body}       bi
 * @param  {Line}       si
 * @param  {Array}      xi
 * @param  {Number}     ai
 * @param  {Body}       bj
 * @param  {Capsule}    sj
 * @param  {Array}      xj
 * @param  {Number}     aj
 * @todo Implement me!
 */
Narrowphase.prototype[Shape.CAPSULE | Shape.LINE] =
Narrowphase.prototype.lineCapsule = function(bi,si,xi,ai, bj,sj,xj,aj, justTest){
    // TODO
    if(justTest)
        return false;
    else
        return 0;
};

var capsuleCapsule_tempVec1 = vec2.create();
var capsuleCapsule_tempVec2 = vec2.create();
var capsuleCapsule_tempRect1 = new Rectangle(1,1);

/**
 * Capsule/capsule narrowphase
 * @method capsuleCapsule
 * @param  {Body}       bi
 * @param  {Capsule}    si
 * @param  {Array}      xi
 * @param  {Number}     ai
 * @param  {Body}       bj
 * @param  {Capsule}    sj
 * @param  {Array}      xj
 * @param  {Number}     aj
 * @todo Implement me!
 */
Narrowphase.prototype[Shape.CAPSULE | Shape.CAPSULE] =
Narrowphase.prototype.capsuleCapsule = function(bi,si,xi,ai, bj,sj,xj,aj, justTest){

    // Check the circles
    // Add offsets!
    var circlePosi = capsuleCapsule_tempVec1,
        circlePosj = capsuleCapsule_tempVec2;

    var numContacts = 0;

    // Need 4 circle checks, between all
    for(var i=0; i<2; i++){

        vec2.set(circlePosi,(i==0?-1:1)*si.length/2,0);
        vec2.rotate(circlePosi,circlePosi,ai);
        vec2.add(circlePosi,circlePosi,xi);

        for(var j=0; j<2; j++){

            vec2.set(circlePosj,(j==0?-1:1)*sj.length/2, 0);
            vec2.rotate(circlePosj,circlePosj,aj);
            vec2.add(circlePosj,circlePosj,xj);

            var result = this.circleCircle(bi,si,circlePosi,ai, bj,sj,circlePosj,aj, justTest, si.radius, sj.radius);

            if(justTest && result)
                return true;

            numContacts += result;
        }
    }

    // Check circles against the center rectangles
    var rect = capsuleCapsule_tempRect1;
    setConvexToCapsuleShapeMiddle(rect,si);
    var result1 = this.convexCapsule(bi,rect,xi,ai, bj,sj,xj,aj, justTest);

    if(justTest && result1) return true;
    numContacts += result1;

    setConvexToCapsuleShapeMiddle(rect,sj);
    var result2 = this.convexCapsule(bj,rect,xj,aj, bi,si,xi,ai, justTest);

    if(justTest && result2) return true;
    numContacts += result2;

    return numContacts;
};

/**
 * Line/line narrowphase
 * @method lineLine
 * @param  {Body}       bi
 * @param  {Line}       si
 * @param  {Array}      xi
 * @param  {Number}     ai
 * @param  {Body}       bj
 * @param  {Line}       sj
 * @param  {Array}      xj
 * @param  {Number}     aj
 * @todo Implement me!
 */
Narrowphase.prototype[Shape.LINE | Shape.LINE] =
Narrowphase.prototype.lineLine = function(bi,si,xi,ai, bj,sj,xj,aj, justTest){
    // TODO
    if(justTest)
        return false;
    else
        return 0;
};

/**
 * Plane/line Narrowphase
 * @method planeLine
 * @param  {Body}   planeBody
 * @param  {Plane}  planeShape
 * @param  {Array}  planeOffset
 * @param  {Number} planeAngle
 * @param  {Body}   lineBody
 * @param  {Line}   lineShape
 * @param  {Array}  lineOffset
 * @param  {Number} lineAngle
 */
Narrowphase.prototype[Shape.PLANE | Shape.LINE] =
Narrowphase.prototype.planeLine = function(planeBody, planeShape, planeOffset, planeAngle,
                                           lineBody,  lineShape,  lineOffset,  lineAngle, justTest){
    var worldVertex0 = tmp1,
        worldVertex1 = tmp2,
        worldVertex01 = tmp3,
        worldVertex11 = tmp4,
        worldEdge = tmp5,
        worldEdgeUnit = tmp6,
        dist = tmp7,
        worldNormal = tmp8,
        worldTangent = tmp9,
        verts = tmpArray
        numContacts = 0;

    // Get start and end points
    vec2.set(worldVertex0, -lineShape.length/2, 0);
    vec2.set(worldVertex1,  lineShape.length/2, 0);

    // Not sure why we have to use worldVertex*1 here, but it won't work otherwise. Tired.
    vec2.rotate(worldVertex01, worldVertex0, lineAngle);
    vec2.rotate(worldVertex11, worldVertex1, lineAngle);

    add(worldVertex01, worldVertex01, lineOffset);
    add(worldVertex11, worldVertex11, lineOffset);

    vec2.copy(worldVertex0,worldVertex01);
    vec2.copy(worldVertex1,worldVertex11);

    // Get vector along the line
    sub(worldEdge, worldVertex1, worldVertex0);
    vec2.normalize(worldEdgeUnit, worldEdge);

    // Get tangent to the edge.
    vec2.rotate90cw(worldTangent, worldEdgeUnit);

    vec2.rotate(worldNormal, yAxis, planeAngle);

    // Check line ends
    verts[0] = worldVertex0;
    verts[1] = worldVertex1;
    for(var i=0; i<verts.length; i++){
        var v = verts[i];

        sub(dist, v, planeOffset);

        var d = dot(dist,worldNormal);

        if(d < 0){

            if(justTest)
                return true;

            var c = this.createContactEquation(planeBody,lineBody,planeShape,lineShape);
            numContacts++;

            vec2.copy(c.normalA, worldNormal);
            vec2.normalize(c.normalA,c.normalA);

            // distance vector along plane normal
            vec2.scale(dist, worldNormal, d);

            // Vector from plane center to contact
            sub(c.contactPointA, v, dist);
            sub(c.contactPointA, c.contactPointA, planeBody.position);

            // From line center to contact
            sub(c.contactPointB, v,    lineOffset);
            add(c.contactPointB, c.contactPointB, lineOffset);
            sub(c.contactPointB, c.contactPointB, lineBody.position);

            this.contactEquations.push(c);

            // TODO : only need one friction equation if both points touch
            if(this.enableFriction){
                this.frictionEquations.push(this.createFrictionFromContact(c));
            }
        }
    }

    return numContacts;
};

Narrowphase.prototype[Shape.PARTICLE | Shape.CAPSULE] =
Narrowphase.prototype.particleCapsule = function(bi,si,xi,ai, bj,sj,xj,aj, justTest){
    return this.circleLine(bi,si,xi,ai, bj,sj,xj,aj, justTest, sj.radius, 0);
};

/**
 * Circle/line Narrowphase
 * @method circleLine
 * @param  {Body} bi
 * @param  {Circle} si
 * @param  {Array} xi
 * @param  {Number} ai
 * @param  {Body} bj
 * @param  {Line} sj
 * @param  {Array} xj
 * @param  {Number} aj
 * @param {Boolean} justTest If set to true, this function will return the result (intersection or not) without adding equations.
 * @param {Number} lineRadius Radius to add to the line. Can be used to test Capsules.
 * @param {Number} circleRadius If set, this value overrides the circle shape radius.
 */
Narrowphase.prototype[Shape.CIRCLE | Shape.LINE] =
Narrowphase.prototype.circleLine = function(bi,si,xi,ai, bj,sj,xj,aj, justTest, lineRadius, circleRadius){
    var lineShape = sj,
        lineAngle = aj,
        lineBody = bj,
        lineOffset = xj,
        circleOffset = xi,
        circleBody = bi,
        circleShape = si,

        lineRadius = lineRadius || 0,
        circleRadius = typeof(circleRadius)!="undefined" ? circleRadius : circleShape.radius,

        orthoDist = tmp1,
        lineToCircleOrthoUnit = tmp2,
        projectedPoint = tmp3,
        centerDist = tmp4,
        worldTangent = tmp5,
        worldEdge = tmp6,
        worldEdgeUnit = tmp7,
        worldVertex0 = tmp8,
        worldVertex1 = tmp9,
        worldVertex01 = tmp10,
        worldVertex11 = tmp11,
        dist = tmp12,
        lineToCircle = tmp13,
        lineEndToLineRadius = tmp14,

        verts = tmpArray;

    // Get start and end points
    vec2.set(worldVertex0, -lineShape.length/2, 0);
    vec2.set(worldVertex1,  lineShape.length/2, 0);

    // Not sure why we have to use worldVertex*1 here, but it won't work otherwise. Tired.
    vec2.rotate(worldVertex01, worldVertex0, lineAngle);
    vec2.rotate(worldVertex11, worldVertex1, lineAngle);

    add(worldVertex01, worldVertex01, lineOffset);
    add(worldVertex11, worldVertex11, lineOffset);

    vec2.copy(worldVertex0,worldVertex01);
    vec2.copy(worldVertex1,worldVertex11);

    // Get vector along the line
    sub(worldEdge, worldVertex1, worldVertex0);
    vec2.normalize(worldEdgeUnit, worldEdge);

    // Get tangent to the edge.
    vec2.rotate90cw(worldTangent, worldEdgeUnit);

    // Check distance from the plane spanned by the edge vs the circle
    sub(dist, circleOffset, worldVertex0);
    var d = dot(dist, worldTangent); // Distance from center of line to circle center
    sub(centerDist, worldVertex0, lineOffset);

    sub(lineToCircle, circleOffset, lineOffset);

    if(Math.abs(d) < circleRadius+lineRadius){

        // Now project the circle onto the edge
        vec2.scale(orthoDist, worldTangent, d);
        sub(projectedPoint, circleOffset, orthoDist);

        // Add the missing line radius
        vec2.scale(lineToCircleOrthoUnit, worldTangent, dot(worldTangent, lineToCircle));
        vec2.normalize(lineToCircleOrthoUnit,lineToCircleOrthoUnit);
        vec2.scale(lineToCircleOrthoUnit, lineToCircleOrthoUnit, lineRadius);
        add(projectedPoint,projectedPoint,lineToCircleOrthoUnit);

        // Check if the point is within the edge span
        var pos =  dot(worldEdgeUnit, projectedPoint);
        var pos0 = dot(worldEdgeUnit, worldVertex0);
        var pos1 = dot(worldEdgeUnit, worldVertex1);

        if(pos > pos0 && pos < pos1){
            // We got contact!

            if(justTest) return true;

            var c = this.createContactEquation(circleBody,lineBody,si,sj);

            vec2.scale(c.normalA, orthoDist, -1);
            vec2.normalize(c.normalA, c.normalA);

            vec2.scale( c.contactPointA, c.normalA,  circleRadius);
            add(c.contactPointA, c.contactPointA, circleOffset);
            sub(c.contactPointA, c.contactPointA, circleBody.position);

            sub(c.contactPointB, projectedPoint, lineOffset);
            add(c.contactPointB, c.contactPointB, lineOffset);
            sub(c.contactPointB, c.contactPointB, lineBody.position);

            this.contactEquations.push(c);

            if(this.enableFriction){
                this.frictionEquations.push(this.createFrictionFromContact(c));
            }

            return 1;
        }
    }

    // Add corner
    // @todo reuse array object
    verts[0] = worldVertex0;
    verts[1] = worldVertex1;

    for(var i=0; i<verts.length; i++){
        var v = verts[i];

        sub(dist, v, circleOffset);

        if(vec2.squaredLength(dist) < (circleRadius+lineRadius)*(circleRadius+lineRadius)){

            if(justTest) return true;

            var c = this.createContactEquation(circleBody,lineBody,si,sj);

            vec2.copy(c.normalA, dist);
            vec2.normalize(c.normalA,c.normalA);

            // Vector from circle to contact point is the normal times the circle radius
            vec2.scale(c.contactPointA, c.normalA, circleRadius);
            add(c.contactPointA, c.contactPointA, circleOffset);
            sub(c.contactPointA, c.contactPointA, circleBody.position);

            sub(c.contactPointB, v, lineOffset);
            vec2.scale(lineEndToLineRadius, c.normalA, -lineRadius);
            add(c.contactPointB, c.contactPointB, lineEndToLineRadius);
            add(c.contactPointB, c.contactPointB, lineOffset);
            sub(c.contactPointB, c.contactPointB, lineBody.position);

            this.contactEquations.push(c);

            if(this.enableFriction){
                this.frictionEquations.push(this.createFrictionFromContact(c));
            }

            return 1;
        }
    }

    return 0;
};

/**
 * Circle/capsule Narrowphase
 * @method circleCapsule
 * @param  {Body}   bi
 * @param  {Circle} si
 * @param  {Array}  xi
 * @param  {Number} ai
 * @param  {Body}   bj
 * @param  {Line}   sj
 * @param  {Array}  xj
 * @param  {Number} aj
 */
Narrowphase.prototype[Shape.CIRCLE | Shape.CAPSULE] =
Narrowphase.prototype.circleCapsule = function(bi,si,xi,ai, bj,sj,xj,aj, justTest){
    return this.circleLine(bi,si,xi,ai, bj,sj,xj,aj, justTest, sj.radius);
};

/**
 * Circle/convex Narrowphase
 * @method circleConvex
 * @param  {Body} bi
 * @param  {Circle} si
 * @param  {Array} xi
 * @param  {Number} ai
 * @param  {Body} bj
 * @param  {Convex} sj
 * @param  {Array} xj
 * @param  {Number} aj
 */
Narrowphase.prototype[Shape.CIRCLE | Shape.CONVEX] =
Narrowphase.prototype[Shape.CIRCLE | Shape.RECTANGLE] =
Narrowphase.prototype.circleConvex = function(  bi,si,xi,ai, bj,sj,xj,aj, justTest, circleRadius){
    var convexShape = sj,
        convexAngle = aj,
        convexBody = bj,
        convexOffset = xj,
        circleOffset = xi,
        circleBody = bi,
        circleShape = si,
        circleRadius = typeof(circleRadius)=="number" ? circleRadius : circleShape.radius;

    var worldVertex0 = tmp1,
        worldVertex1 = tmp2,
        worldEdge = tmp3,
        worldEdgeUnit = tmp4,
        worldTangent = tmp5,
        centerDist = tmp6,
        convexToCircle = tmp7,
        orthoDist = tmp8,
        projectedPoint = tmp9,
        dist = tmp10,
        worldVertex = tmp11,

        closestEdge = -1,
        closestEdgeDistance = null,
        closestEdgeOrthoDist = tmp12,
        closestEdgeProjectedPoint = tmp13,
        candidate = tmp14,
        candidateDist = tmp15,
        minCandidate = tmp16,

        found = false,
        minCandidateDistance = Number.MAX_VALUE;

    var numReported = 0;

    // New algorithm:
    // 1. Check so center of circle is not inside the polygon. If it is, this wont work...
    // 2. For each edge
    // 2. 1. Get point on circle that is closest to the edge (scale normal with -radius)
    // 2. 2. Check if point is inside.

    verts = convexShape.vertices;

    // Check all edges first
    for(var i=0; i!==verts.length+1; i++){
        var v0 = verts[i%verts.length],
            v1 = verts[(i+1)%verts.length];

        vec2.rotate(worldVertex0, v0, convexAngle);
        vec2.rotate(worldVertex1, v1, convexAngle);
        add(worldVertex0, worldVertex0, convexOffset);
        add(worldVertex1, worldVertex1, convexOffset);
        sub(worldEdge, worldVertex1, worldVertex0);

        vec2.normalize(worldEdgeUnit, worldEdge);

        // Get tangent to the edge. Points out of the Convex
        vec2.rotate90cw(worldTangent, worldEdgeUnit);

        // Get point on circle, closest to the polygon
        vec2.scale(candidate,worldTangent,-circleShape.radius);
        add(candidate,candidate,circleOffset);

        if(pointInConvex(candidate,convexShape,convexOffset,convexAngle)){

            vec2.sub(candidateDist,worldVertex0,candidate);
            var candidateDistance = Math.abs(vec2.dot(candidateDist,worldTangent));

            /*
            // Check distance from the plane spanned by the edge vs the circle
            sub(dist, circleOffset, worldVertex0);
            var d = dot(dist, worldTangent);
            sub(centerDist, worldVertex0, convexOffset);

            sub(convexToCircle, circleOffset, convexOffset);

            if(d < circleRadius && dot(centerDist,convexToCircle) > 0){

                // Now project the circle onto the edge
                vec2.scale(orthoDist, worldTangent, d);
                sub(projectedPoint, circleOffset, orthoDist);


                // Check if the point is within the edge span
                var pos =  dot(worldEdgeUnit, projectedPoint);
                var pos0 = dot(worldEdgeUnit, worldVertex0);
                var pos1 = dot(worldEdgeUnit, worldVertex1);

                if(pos > pos0 && pos < pos1){
                    // We got contact!

                    if(justTest) return true;

                    if(closestEdgeDistance === null || d*d<closestEdgeDistance*closestEdgeDistance){
                        closestEdgeDistance = d;
                        closestEdge = i;
                        vec2.copy(closestEdgeOrthoDist, orthoDist);
                        vec2.copy(closestEdgeProjectedPoint, projectedPoint);
                    }
                }
            }
            */

            if(candidateDistance < minCandidateDistance){
                vec2.copy(minCandidate,candidate);
                minCandidateDistance = candidateDistance;
                vec2.scale(closestEdgeProjectedPoint,worldTangent,candidateDistance);
                vec2.add(closestEdgeProjectedPoint,closestEdgeProjectedPoint,candidate);
                found = true;
            }
        }
    }

    if(found){

        if(justTest)
            return true;

        var c = this.createContactEquation(circleBody,convexBody,si,sj);
        vec2.sub(c.normalA, minCandidate, circleOffset)
        vec2.normalize(c.normalA, c.normalA);

        vec2.scale(c.contactPointA,  c.normalA, circleRadius);
        add(c.contactPointA, c.contactPointA, circleOffset);
        sub(c.contactPointA, c.contactPointA, circleBody.position);

        sub(c.contactPointB, closestEdgeProjectedPoint, convexOffset);
        add(c.contactPointB, c.contactPointB, convexOffset);
        sub(c.contactPointB, c.contactPointB, convexBody.position);

        this.contactEquations.push(c);

        if(this.enableFriction)
            this.frictionEquations.push( this.createFrictionFromContact(c) );

        return 1;
    }

    /*
    if(closestEdge != -1){
        var c = this.createContactEquation(circleBody,convexBody);

        vec2.scale(c.normalA, closestEdgeOrthoDist, -1);
        vec2.normalize(c.normalA, c.normalA);

        vec2.scale(c.contactPointA,  c.normalA, circleRadius);
        add(c.contactPointA, c.contactPointA, circleOffset);
        sub(c.contactPointA, c.contactPointA, circleBody.position);

        sub(c.contactPointB, closestEdgeProjectedPoint, convexOffset);
        add(c.contactPointB, c.contactPointB, convexOffset);
        sub(c.contactPointB, c.contactPointB, convexBody.position);

        this.contactEquations.push(c);

        if(this.enableFriction)
            this.frictionEquations.push( this.createFrictionFromContact(c) );

        return true;
    }
    */

    // Check all vertices
    if(circleRadius > 0){
        for(var i=0; i<verts.length; i++){
            var localVertex = verts[i];
            vec2.rotate(worldVertex, localVertex, convexAngle);
            add(worldVertex, worldVertex, convexOffset);

            sub(dist, worldVertex, circleOffset);
            if(vec2.squaredLength(dist) < circleRadius*circleRadius){

                if(justTest) return true;

                var c = this.createContactEquation(circleBody,convexBody,si,sj);

                vec2.copy(c.normalA, dist);
                vec2.normalize(c.normalA,c.normalA);

                // Vector from circle to contact point is the normal times the circle radius
                vec2.scale(c.contactPointA, c.normalA, circleRadius);
                add(c.contactPointA, c.contactPointA, circleOffset);
                sub(c.contactPointA, c.contactPointA, circleBody.position);

                sub(c.contactPointB, worldVertex, convexOffset);
                add(c.contactPointB, c.contactPointB, convexOffset);
                sub(c.contactPointB, c.contactPointB, convexBody.position);

                this.contactEquations.push(c);

                if(this.enableFriction){
                    this.frictionEquations.push(this.createFrictionFromContact(c));
                }

                return 1;
            }
        }
    }

    return 0;
};

// Check if a point is in a polygon
var pic_worldVertex0 = vec2.create(),
    pic_worldVertex1 = vec2.create(),
    pic_r0 = vec2.create(),
    pic_r1 = vec2.create();
function pointInConvex(worldPoint,convexShape,convexOffset,convexAngle){
    var worldVertex0 = pic_worldVertex0,
        worldVertex1 = pic_worldVertex1,
        r0 = pic_r0,
        r1 = pic_r1,
        point = worldPoint,
        verts = convexShape.vertices,
        lastCross = null;
    for(var i=0; i!==verts.length+1; i++){
        var v0 = verts[i%verts.length],
            v1 = verts[(i+1)%verts.length];

        // Transform vertices to world
        // can we instead transform point to local of the convex???
        vec2.rotate(worldVertex0, v0, convexAngle);
        vec2.rotate(worldVertex1, v1, convexAngle);
        add(worldVertex0, worldVertex0, convexOffset);
        add(worldVertex1, worldVertex1, convexOffset);

        sub(r0, worldVertex0, point);
        sub(r1, worldVertex1, point);
        var cross = vec2.crossLength(r0,r1);

        if(lastCross===null) lastCross = cross;

        // If we got a different sign of the distance vector, the point is out of the polygon
        if(cross*lastCross <= 0){
            return false;
        }
        lastCross = cross;
    }
    return true;
};

/**
 * Particle/convex Narrowphase
 * @method particleConvex
 * @param  {Body} bi
 * @param  {Particle} si
 * @param  {Array} xi
 * @param  {Number} ai
 * @param  {Body} bj
 * @param  {Convex} sj
 * @param  {Array} xj
 * @param  {Number} aj
 * @todo use pointInConvex and code more similar to circleConvex
 */
Narrowphase.prototype[Shape.PARTICLE | Shape.CONVEX] =
Narrowphase.prototype[Shape.PARTICLE | Shape.RECTANGLE] =
Narrowphase.prototype.particleConvex = function(  bi,si,xi,ai, bj,sj,xj,aj, justTest ){
    var convexShape = sj,
        convexAngle = aj,
        convexBody = bj,
        convexOffset = xj,
        particleOffset = xi,
        particleBody = bi,
        particleShape = si,
        worldVertex0 = tmp1,
        worldVertex1 = tmp2,
        worldEdge = tmp3,
        worldEdgeUnit = tmp4,
        worldTangent = tmp5,
        centerDist = tmp6,
        convexToparticle = tmp7,
        orthoDist = tmp8,
        projectedPoint = tmp9,
        dist = tmp10,
        worldVertex = tmp11,
        closestEdge = -1,
        closestEdgeDistance = null,
        closestEdgeOrthoDist = tmp12,
        closestEdgeProjectedPoint = tmp13,
        r0 = tmp14, // vector from particle to vertex0
        r1 = tmp15,
        localPoint = tmp16,
        candidateDist = tmp17,
        minEdgeNormal = tmp18,
        minCandidateDistance = Number.MAX_VALUE;

    var numReported = 0,
        found = false,
        verts = convexShape.vertices;

    // Check if the particle is in the polygon at all
    if(!pointInConvex(particleOffset,convexShape,convexOffset,convexAngle)){
        return 0;
    }

    if(justTest) return true;

    // Check edges first
    var lastCross = null;
    for(var i=0; i!==verts.length+1; i++){
        var v0 = verts[i%verts.length],
            v1 = verts[(i+1)%verts.length];

        // Transform vertices to world
        vec2.rotate(worldVertex0, v0, convexAngle);
        vec2.rotate(worldVertex1, v1, convexAngle);
        add(worldVertex0, worldVertex0, convexOffset);
        add(worldVertex1, worldVertex1, convexOffset);

        // Get world edge
        sub(worldEdge, worldVertex1, worldVertex0);
        vec2.normalize(worldEdgeUnit, worldEdge);

        // Get tangent to the edge. Points out of the Convex
        vec2.rotate90cw(worldTangent, worldEdgeUnit);

        // Check distance from the infinite line (spanned by the edge) to the particle
        sub(dist, particleOffset, worldVertex0);
        var d = dot(dist, worldTangent);
        sub(centerDist, worldVertex0, convexOffset);

        sub(convexToparticle, particleOffset, convexOffset);


        /*
        if(d < 0 && dot(centerDist,convexToparticle) >= 0){

            // Now project the particle onto the edge
            vec2.scale(orthoDist, worldTangent, d);
            sub(projectedPoint, particleOffset, orthoDist);

            // Check if the point is within the edge span
            var pos =  dot(worldEdgeUnit, projectedPoint);
            var pos0 = dot(worldEdgeUnit, worldVertex0);
            var pos1 = dot(worldEdgeUnit, worldVertex1);

            if(pos > pos0 && pos < pos1){
                // We got contact!
                if(justTest) return true;

                if(closestEdgeDistance === null || d*d<closestEdgeDistance*closestEdgeDistance){
                    closestEdgeDistance = d;
                    closestEdge = i;
                    vec2.copy(closestEdgeOrthoDist, orthoDist);
                    vec2.copy(closestEdgeProjectedPoint, projectedPoint);
                }
            }
        }
        */

        vec2.sub(candidateDist,worldVertex0,particleOffset);
        var candidateDistance = Math.abs(vec2.dot(candidateDist,worldTangent));

        if(candidateDistance < minCandidateDistance){
            minCandidateDistance = candidateDistance;
            vec2.scale(closestEdgeProjectedPoint,worldTangent,candidateDistance);
            vec2.add(closestEdgeProjectedPoint,closestEdgeProjectedPoint,particleOffset);
            vec2.copy(minEdgeNormal,worldTangent);
            found = true;
        }
    }

    if(found){
        var c = this.createContactEquation(particleBody,convexBody,si,sj);

        vec2.scale(c.normalA, minEdgeNormal, -1);
        vec2.normalize(c.normalA, c.normalA);

        // Particle has no extent to the contact point
        vec2.set(c.contactPointA,  0, 0);
        add(c.contactPointA, c.contactPointA, particleOffset);
        sub(c.contactPointA, c.contactPointA, particleBody.position);

        // From convex center to point
        sub(c.contactPointB, closestEdgeProjectedPoint, convexOffset);
        add(c.contactPointB, c.contactPointB, convexOffset);
        sub(c.contactPointB, c.contactPointB, convexBody.position);

        this.contactEquations.push(c);

        if(this.enableFriction)
            this.frictionEquations.push( this.createFrictionFromContact(c) );

        return 1;
    }


    return 0;
};

/**
 * Circle/circle Narrowphase
 * @method circleCircle
 * @param  {Body} bi
 * @param  {Circle} si
 * @param  {Array} xi
 * @param  {Number} ai
 * @param  {Body} bj
 * @param  {Circle} sj
 * @param  {Array} xj
 * @param  {Number} aj
 */
Narrowphase.prototype[Shape.CIRCLE] =
Narrowphase.prototype.circleCircle = function(  bi,si,xi,ai, bj,sj,xj,aj, justTest, radiusA, radiusB){
    var bodyA = bi,
        shapeA = si,
        offsetA = xi,
        bodyB = bj,
        shapeB = sj,
        offsetB = xj,
        dist = tmp1,
        radiusA = radiusA || shapeA.radius,
        radiusB = radiusB || shapeB.radius;

    sub(dist,xi,xj);
    var r = radiusA + radiusB;
    if(vec2.squaredLength(dist) > r*r){
        return 0;
    }

    if(justTest){
        return true;
    }

    var c = this.createContactEquation(bodyA,bodyB,si,sj);
    sub(c.normalA, offsetB, offsetA);
    vec2.normalize(c.normalA,c.normalA);

    vec2.scale( c.contactPointA, c.normalA,  radiusA);
    vec2.scale( c.contactPointB, c.normalA, -radiusB);

    add(c.contactPointA, c.contactPointA, offsetA);
    sub(c.contactPointA, c.contactPointA, bodyA.position);

    add(c.contactPointB, c.contactPointB, offsetB);
    sub(c.contactPointB, c.contactPointB, bodyB.position);

    this.contactEquations.push(c);

    if(this.enableFriction){
        this.frictionEquations.push(this.createFrictionFromContact(c));
    }
    return 1;
};

/**
 * Plane/Convex Narrowphase
 * @method planeConvex
 * @param  {Body} bi
 * @param  {Plane} si
 * @param  {Array} xi
 * @param  {Number} ai
 * @param  {Body} bj
 * @param  {Convex} sj
 * @param  {Array} xj
 * @param  {Number} aj
 */
Narrowphase.prototype[Shape.PLANE | Shape.CONVEX] =
Narrowphase.prototype[Shape.PLANE | Shape.RECTANGLE] =
Narrowphase.prototype.planeConvex = function( bi,si,xi,ai, bj,sj,xj,aj, justTest ){
    var convexBody = bj,
        convexOffset = xj,
        convexShape = sj,
        convexAngle = aj,
        planeBody = bi,
        planeShape = si,
        planeOffset = xi,
        planeAngle = ai;

    var worldVertex = tmp1,
        worldNormal = tmp2,
        dist = tmp3;

    var numReported = 0;
    vec2.rotate(worldNormal, yAxis, planeAngle);

    for(var i=0; i<convexShape.vertices.length; i++){
        var v = convexShape.vertices[i];
        vec2.rotate(worldVertex, v, convexAngle);
        add(worldVertex, worldVertex, convexOffset);

        sub(dist, worldVertex, planeOffset);

        if(dot(dist,worldNormal) <= Narrowphase.convexPrecision){

            if(justTest){
                return true;
            }

            // Found vertex
            numReported++;

            var c = this.createContactEquation(planeBody,convexBody,planeShape,convexShape);

            sub(dist, worldVertex, planeOffset);

            vec2.copy(c.normalA, worldNormal);

            var d = dot(dist, c.normalA);
            vec2.scale(dist, c.normalA, d);

            // rj is from convex center to contact
            sub(c.contactPointB, worldVertex, convexBody.position);


            // ri is from plane center to contact
            sub( c.contactPointA, worldVertex, dist);
            sub( c.contactPointA, c.contactPointA, planeBody.position);

            this.contactEquations.push(c);
            if(this.enableFriction){
                this.frictionEquations.push(this.createFrictionFromContact(c));
            }
        }
    }

    return numReported;
};

/**
 * @method convexPlane
 * @deprecated Use .planeConvex() instead!
 */
Narrowphase.prototype.convexPlane = function( bi,si,xi,ai, bj,sj,xj,aj, justTest ){
    console.warn("Narrowphase.prototype.convexPlane is deprecated. Use planeConvex instead!");
    return this.planeConvex( bj,sj,xj,aj, bi,si,xi,ai, justTest );
}

/**
 * Narrowphase for particle vs plane
 * @method particlePlane
 * @param  {Body}       bi The particle body
 * @param  {Particle}   si Particle shape
 * @param  {Array}      xi World position for the particle
 * @param  {Number}     ai World angle for the particle
 * @param  {Body}       bj Plane body
 * @param  {Plane}      sj Plane shape
 * @param  {Array}      xj World position for the plane
 * @param  {Number}     aj World angle for the plane
 */
Narrowphase.prototype[Shape.PARTICLE | Shape.PLANE] =
Narrowphase.prototype.particlePlane = function( bi,si,xi,ai, bj,sj,xj,aj, justTest ){
    var particleBody = bi,
        particleShape = si,
        particleOffset = xi,
        planeBody = bj,
        planeShape = sj,
        planeOffset = xj,
        planeAngle = aj;

    var dist = tmp1,
        worldNormal = tmp2;

    planeAngle = planeAngle || 0;

    sub(dist, particleOffset, planeOffset);
    vec2.rotate(worldNormal, yAxis, planeAngle);

    var d = dot(dist, worldNormal);

    if(d > 0) return 0;
    if(justTest) return true;

    var c = this.createContactEquation(planeBody,particleBody,sj,si);

    vec2.copy(c.normalA, worldNormal);
    vec2.scale( dist, c.normalA, d );
    // dist is now the distance vector in the normal direction

    // ri is the particle position projected down onto the plane, from the plane center
    sub( c.contactPointA, particleOffset, dist);
    sub( c.contactPointA, c.contactPointA, planeBody.position);

    // rj is from the body center to the particle center
    sub( c.contactPointB, particleOffset, particleBody.position );

    this.contactEquations.push(c);

    if(this.enableFriction){
        this.frictionEquations.push(this.createFrictionFromContact(c));
    }
    return 1;
};

/**
 * Circle/Particle Narrowphase
 * @method circleParticle
 * @param  {Body} bi
 * @param  {Circle} si
 * @param  {Array} xi
 * @param  {Number} ai
 * @param  {Body} bj
 * @param  {Particle} sj
 * @param  {Array} xj
 * @param  {Number} aj
 */
Narrowphase.prototype[Shape.CIRCLE | Shape.PARTICLE] =
Narrowphase.prototype.circleParticle = function(   bi,si,xi,ai, bj,sj,xj,aj, justTest ){
    var circleBody = bi,
        circleShape = si,
        circleOffset = xi,
        particleBody = bj,
        particleShape = sj,
        particleOffset = xj,
        dist = tmp1;

    sub(dist, particleOffset, circleOffset);
    if(vec2.squaredLength(dist) > circleShape.radius*circleShape.radius) return 0;
    if(justTest) return true;

    var c = this.createContactEquation(circleBody,particleBody,si,sj);
    vec2.copy(c.normalA, dist);
    vec2.normalize(c.normalA,c.normalA);

    // Vector from circle to contact point is the normal times the circle radius
    vec2.scale(c.contactPointA, c.normalA, circleShape.radius);
    add(c.contactPointA, c.contactPointA, circleOffset);
    sub(c.contactPointA, c.contactPointA, circleBody.position);

    // Vector from particle center to contact point is zero
    sub(c.contactPointB, particleOffset, particleBody.position);

    this.contactEquations.push(c);

    if(this.enableFriction){
        this.frictionEquations.push(this.createFrictionFromContact(c));
    }

    return 1;
};

var capsulePlane_tmpCircle = new Circle(1),
    capsulePlane_tmp1 = vec2.create(),
    capsulePlane_tmp2 = vec2.create(),
    capsulePlane_tmp3 = vec2.create();

Narrowphase.prototype[Shape.PLANE | Shape.CAPSULE] =
Narrowphase.prototype.planeCapsule = function( bi,si,xi,ai, bj,sj,xj,aj, justTest ){
    var end1 = capsulePlane_tmp1,
        end2 = capsulePlane_tmp2,
        circle = capsulePlane_tmpCircle,
        dst = capsulePlane_tmp3;

    // Compute world end positions
    vec2.set(end1, -sj.length/2, 0);
    vec2.rotate(end1,end1,aj);
    add(end1,end1,xj);

    vec2.set(end2,  sj.length/2, 0);
    vec2.rotate(end2,end2,aj);
    add(end2,end2,xj);

    circle.radius = sj.radius;

    // Do Narrowphase as two circles
    var numContacts1 = this.circlePlane(bj,circle,end1,0, bi,si,xi,ai, justTest),
        numContacts2 = this.circlePlane(bj,circle,end2,0, bi,si,xi,ai, justTest);

    if(justTest)
        return numContacts1 || numContacts2;
    else
        return numContacts1 + numContacts2;
};

/**
 * @method capsulePlane
 * @deprecated Use .planeCapsule() instead!
 */
Narrowphase.prototype.capsulePlane = function( bi,si,xi,ai, bj,sj,xj,aj, justTest ){
    console.warn("Narrowphase.prototype.capsulePlane() is deprecated. Use .planeCapsule() instead!");
    return this.planeCapsule( bj,sj,xj,aj, bi,si,xi,ai, justTest );
}

/**
 * Creates ContactEquations and FrictionEquations for a collision.
 * @method circlePlane
 * @param  {Body}    bi     The first body that should be connected to the equations.
 * @param  {Circle}  si     The circle shape participating in the collision.
 * @param  {Array}   xi     Extra offset to take into account for the Shape, in addition to the one in circleBody.position. Will *not* be rotated by circleBody.angle (maybe it should, for sake of homogenity?). Set to null if none.
 * @param  {Body}    bj     The second body that should be connected to the equations.
 * @param  {Plane}   sj     The Plane shape that is participating
 * @param  {Array}   xj     Extra offset for the plane shape.
 * @param  {Number}  aj     Extra angle to apply to the plane
 */
Narrowphase.prototype[Shape.CIRCLE | Shape.PLANE] =
Narrowphase.prototype.circlePlane = function(   bi,si,xi,ai, bj,sj,xj,aj, justTest ){
    var circleBody = bi,
        circleShape = si,
        circleOffset = xi, // Offset from body center, rotated!
        planeBody = bj,
        shapeB = sj,
        planeOffset = xj,
        planeAngle = aj;

    planeAngle = planeAngle || 0;

    // Vector from plane to circle
    var planeToCircle = tmp1,
        worldNormal = tmp2,
        temp = tmp3;

    sub(planeToCircle, circleOffset, planeOffset);

    // World plane normal
    vec2.rotate(worldNormal, yAxis, planeAngle);

    // Normal direction distance
    var d = dot(worldNormal, planeToCircle);

    if(d > circleShape.radius){
        return 0; // No overlap. Abort.
    }

    if(justTest){
        return true;
    }

    // Create contact
    var contact = this.createContactEquation(planeBody,circleBody,sj,si);

    // ni is the plane world normal
    vec2.copy(contact.normalA, worldNormal);

    // rj is the vector from circle center to the contact point
    vec2.scale(contact.contactPointB, contact.normalA, -circleShape.radius);
    add(contact.contactPointB, contact.contactPointB, circleOffset);
    sub(contact.contactPointB, contact.contactPointB, circleBody.position);

    // ri is the distance from plane center to contact.
    vec2.scale(temp, contact.normalA, d);
    sub(contact.contactPointA, planeToCircle, temp ); // Subtract normal distance vector from the distance vector
    add(contact.contactPointA, contact.contactPointA, planeOffset);
    sub(contact.contactPointA, contact.contactPointA, planeBody.position);

    this.contactEquations.push(contact);

    if(this.enableFriction){
        this.frictionEquations.push( this.createFrictionFromContact(contact) );
    }

    return 1;
};

Narrowphase.convexPrecision = 1e-7;

/**
 * Convex/convex Narrowphase.See <a href="http://www.altdevblogaday.com/2011/05/13/contact-generation-between-3d-convex-meshes/">this article</a> for more info.
 * @method convexConvex
 * @param  {Body} bi
 * @param  {Convex} si
 * @param  {Array} xi
 * @param  {Number} ai
 * @param  {Body} bj
 * @param  {Convex} sj
 * @param  {Array} xj
 * @param  {Number} aj
 */
Narrowphase.prototype[Shape.CONVEX] =
Narrowphase.prototype[Shape.CONVEX | Shape.RECTANGLE] =
Narrowphase.prototype[Shape.RECTANGLE] =
Narrowphase.prototype.convexConvex = function(  bi,si,xi,ai, bj,sj,xj,aj, justTest, precision ){
    var sepAxis = tmp1,
        worldPoint = tmp2,
        worldPoint0 = tmp3,
        worldPoint1 = tmp4,
        worldEdge = tmp5,
        projected = tmp6,
        penetrationVec = tmp7,
        dist = tmp8,
        worldNormal = tmp9,
        numContacts = 0,
        precision = precision || Narrowphase.convexPrecision;

    var found = Narrowphase.findSeparatingAxis(si,xi,ai,sj,xj,aj,sepAxis);
    if(!found){
        return 0;
    }

    // Make sure the separating axis is directed from shape i to shape j
    sub(dist,xj,xi);
    if(dot(sepAxis,dist) > 0){
        vec2.scale(sepAxis,sepAxis,-1);
    }

    // Find edges with normals closest to the separating axis
    var closestEdge1 = Narrowphase.getClosestEdge(si,ai,sepAxis,true), // Flipped axis
        closestEdge2 = Narrowphase.getClosestEdge(sj,aj,sepAxis);

    if(closestEdge1 === -1 || closestEdge2 === -1){
        return 0;
    }

    // Loop over the shapes
    for(var k=0; k<2; k++){

        var closestEdgeA = closestEdge1,
            closestEdgeB = closestEdge2,
            shapeA =  si, shapeB =  sj,
            offsetA = xi, offsetB = xj,
            angleA = ai, angleB = aj,
            bodyA = bi, bodyB = bj;

        if(k === 0){
            // Swap!
            var tmp;
            tmp = closestEdgeA; closestEdgeA = closestEdgeB;    closestEdgeB = tmp;
            tmp = shapeA;       shapeA = shapeB;                shapeB = tmp;
            tmp = offsetA;      offsetA = offsetB;              offsetB = tmp;
            tmp = angleA;       angleA = angleB;                angleB = tmp;
            tmp = bodyA;        bodyA = bodyB;                  bodyB = tmp;
        }

        // Loop over 2 points in convex B
        for(var j=closestEdgeB; j<closestEdgeB+2; j++){

            // Get world point
            var v = shapeB.vertices[(j+shapeB.vertices.length)%shapeB.vertices.length];
            vec2.rotate(worldPoint, v, angleB);
            add(worldPoint, worldPoint, offsetB);

            var insideNumEdges = 0;

            // Loop over the 3 closest edges in convex A
            for(var i=closestEdgeA-1; i<closestEdgeA+2; i++){

                var v0 = shapeA.vertices[(i  +shapeA.vertices.length)%shapeA.vertices.length],
                    v1 = shapeA.vertices[(i+1+shapeA.vertices.length)%shapeA.vertices.length];

                // Construct the edge
                vec2.rotate(worldPoint0, v0, angleA);
                vec2.rotate(worldPoint1, v1, angleA);
                add(worldPoint0, worldPoint0, offsetA);
                add(worldPoint1, worldPoint1, offsetA);

                sub(worldEdge, worldPoint1, worldPoint0);

                vec2.rotate90cw(worldNormal, worldEdge); // Normal points out of convex 1
                vec2.normalize(worldNormal,worldNormal);

                sub(dist, worldPoint, worldPoint0);

                var d = dot(worldNormal,dist);

                if(d <= precision){
                    insideNumEdges++;
                }
            }

            if(insideNumEdges >= 3){

                if(justTest){
                    return true;
                }

                // worldPoint was on the "inside" side of each of the 3 checked edges.
                // Project it to the center edge and use the projection direction as normal

                // Create contact
                var c = this.createContactEquation(bodyA,bodyB,shapeA,shapeB);
                numContacts++;

                // Get center edge from body A
                var v0 = shapeA.vertices[(closestEdgeA)   % shapeA.vertices.length],
                    v1 = shapeA.vertices[(closestEdgeA+1) % shapeA.vertices.length];

                // Construct the edge
                vec2.rotate(worldPoint0, v0, angleA);
                vec2.rotate(worldPoint1, v1, angleA);
                add(worldPoint0, worldPoint0, offsetA);
                add(worldPoint1, worldPoint1, offsetA);

                sub(worldEdge, worldPoint1, worldPoint0);

                vec2.rotate90cw(c.normalA, worldEdge); // Normal points out of convex A
                vec2.normalize(c.normalA,c.normalA);

                sub(dist, worldPoint, worldPoint0); // From edge point to the penetrating point
                var d = dot(c.normalA,dist);             // Penetration
                vec2.scale(penetrationVec, c.normalA, d);     // Vector penetration

                sub(c.contactPointA, worldPoint, offsetA);
                sub(c.contactPointA, c.contactPointA, penetrationVec);
                add(c.contactPointA, c.contactPointA, offsetA);
                sub(c.contactPointA, c.contactPointA, bodyA.position);

                sub(c.contactPointB, worldPoint, offsetB);
                add(c.contactPointB, c.contactPointB, offsetB);
                sub(c.contactPointB, c.contactPointB, bodyB.position);

                this.contactEquations.push(c);

                // Todo reduce to 1 friction equation if we have 2 contact points
                if(this.enableFriction)
                    this.frictionEquations.push(this.createFrictionFromContact(c));
            }
        }
    }

    return numContacts;
};

// .projectConvex is called by other functions, need local tmp vectors
var pcoa_tmp1 = vec2.fromValues(0,0);

/**
 * Project a Convex onto a world-oriented axis
 * @method projectConvexOntoAxis
 * @static
 * @param  {Convex} convexShape
 * @param  {Array} convexOffset
 * @param  {Number} convexAngle
 * @param  {Array} worldAxis
 * @param  {Array} result
 */
Narrowphase.projectConvexOntoAxis = function(convexShape, convexOffset, convexAngle, worldAxis, result){
    var max=null,
        min=null,
        v,
        value,
        localAxis = pcoa_tmp1;

    // Convert the axis to local coords of the body
    vec2.rotate(localAxis, worldAxis, -convexAngle);

    // Get projected position of all vertices
    for(var i=0; i<convexShape.vertices.length; i++){
        v = convexShape.vertices[i];
        value = dot(v,localAxis);
        if(max === null || value > max) max = value;
        if(min === null || value < min) min = value;
    }

    if(min > max){
        var t = min;
        min = max;
        max = t;
    }

    // Project the position of the body onto the axis - need to add this to the result
    var offset = dot(convexOffset, worldAxis);

    vec2.set( result, min + offset, max + offset);
};

// .findSeparatingAxis is called by other functions, need local tmp vectors
var fsa_tmp1 = vec2.fromValues(0,0)
,   fsa_tmp2 = vec2.fromValues(0,0)
,   fsa_tmp3 = vec2.fromValues(0,0)
,   fsa_tmp4 = vec2.fromValues(0,0)
,   fsa_tmp5 = vec2.fromValues(0,0)
,   fsa_tmp6 = vec2.fromValues(0,0)

/**
 * Find a separating axis between the shapes, that maximizes the separating distance between them.
 * @method findSeparatingAxis
 * @static
 * @param  {Convex}     c1
 * @param  {Array}      offset1
 * @param  {Number}     angle1
 * @param  {Convex}     c2
 * @param  {Array}      offset2
 * @param  {Number}     angle2
 * @param  {Array}      sepAxis     The resulting axis
 * @return {Boolean}                Whether the axis could be found.
 */
Narrowphase.findSeparatingAxis = function(c1,offset1,angle1,c2,offset2,angle2,sepAxis){
    var maxDist = null,
        overlap = false,
        found = false,
        edge = fsa_tmp1,
        worldPoint0 = fsa_tmp2,
        worldPoint1 = fsa_tmp3,
        normal = fsa_tmp4,
        span1 = fsa_tmp5,
        span2 = fsa_tmp6;

    for(var j=0; j!==2; j++){
        var c = c1,
            angle = angle1;
        if(j===1){
            c = c2;
            angle = angle2;
        }

        for(var i=0; i!==c.vertices.length; i++){
            // Get the world edge
            vec2.rotate(worldPoint0, c.vertices[i], angle);
            vec2.rotate(worldPoint1, c.vertices[(i+1)%c.vertices.length], angle);

            sub(edge, worldPoint1, worldPoint0);

            // Get normal - just rotate 90 degrees since vertices are given in CCW
            vec2.rotate90cw(normal, edge);
            vec2.normalize(normal,normal);

            // Project hulls onto that normal
            Narrowphase.projectConvexOntoAxis(c1,offset1,angle1,normal,span1);
            Narrowphase.projectConvexOntoAxis(c2,offset2,angle2,normal,span2);

            // Order by span position
            var a=span1,
                b=span2,
                swapped = false;
            if(span1[0] > span2[0]){
                b=span1;
                a=span2;
                swapped = true;
            }

            // Get separating distance
            var dist = b[0] - a[1];
            overlap = (dist <= Narrowphase.convexPrecision);

            if(maxDist===null || dist > maxDist){
                vec2.copy(sepAxis, normal);
                maxDist = dist;
                found = overlap;
            }
        }
    }

    return found;
};

// .getClosestEdge is called by other functions, need local tmp vectors
var gce_tmp1 = vec2.fromValues(0,0)
,   gce_tmp2 = vec2.fromValues(0,0)
,   gce_tmp3 = vec2.fromValues(0,0)

/**
 * Get the edge that has a normal closest to an axis.
 * @method getClosestEdge
 * @static
 * @param  {Convex}     c
 * @param  {Number}     angle
 * @param  {Array}      axis
 * @param  {Boolean}    flip
 * @return {Number}             Index of the edge that is closest. This index and the next spans the resulting edge. Returns -1 if failed.
 */
Narrowphase.getClosestEdge = function(c,angle,axis,flip){
    var localAxis = gce_tmp1,
        edge = gce_tmp2,
        normal = gce_tmp3;

    // Convert the axis to local coords of the body
    vec2.rotate(localAxis, axis, -angle);
    if(flip){
        vec2.scale(localAxis,localAxis,-1);
    }

    var closestEdge = -1,
        N = c.vertices.length;
    for(var i=0; i!==N; i++){
        // Get the edge
        sub(edge, c.vertices[(i+1)%N], c.vertices[i%N]);

        // Get normal - just rotate 90 degrees since vertices are given in CCW
        vec2.rotate90cw(normal, edge);
        vec2.normalize(normal,normal);

        var d = dot(normal,localAxis);
        if(closestEdge == -1 || d > maxDot){
            closestEdge = i % N;
            maxDot = d;
        }
    }

    return closestEdge;
};

var circleHeightfield_candidate = vec2.create(),
    circleHeightfield_dist = vec2.create(),
    circleHeightfield_v0 = vec2.create(),
    circleHeightfield_v1 = vec2.create(),
    circleHeightfield_minCandidate = vec2.create(),
    circleHeightfield_worldNormal = vec2.create(),
    circleHeightfield_minCandidateNormal = vec2.create();

/**
 * @method circleHeightfield
 * @param  {Body}           bi
 * @param  {Circle}         si
 * @param  {Array}          xi
 * @param  {Body}           bj
 * @param  {Heightfield}    sj
 * @param  {Array}          xj
 * @param  {Number}         aj
 */
Narrowphase.prototype[Shape.CIRCLE | Shape.HEIGHTFIELD] =
Narrowphase.prototype.circleHeightfield = function( circleBody,circleShape,circlePos,circleAngle,
                                                    hfBody,hfShape,hfPos,hfAngle, justTest, radius ){
    var data = hfShape.data,
        radius = radius || circleShape.radius,
        w = hfShape.elementWidth,
        dist = circleHeightfield_dist,
        candidate = circleHeightfield_candidate,
        minCandidate = circleHeightfield_minCandidate,
        minCandidateNormal = circleHeightfield_minCandidateNormal,
        worldNormal = circleHeightfield_worldNormal,
        v0 = circleHeightfield_v0,
        v1 = circleHeightfield_v1;

    // Get the index of the points to test against
    var idxA = Math.floor( (circlePos[0] - radius - hfPos[0]) / w ),
        idxB = Math.ceil(  (circlePos[0] + radius - hfPos[0]) / w );

    /*if(idxB < 0 || idxA >= data.length)
        return justTest ? false : 0;*/

    if(idxA < 0) idxA = 0;
    if(idxB >= data.length) idxB = data.length-1;

    // Get max and min
    var max = data[idxA],
        min = data[idxB];
    for(var i=idxA; i<idxB; i++){
        if(data[i] < min) min = data[i];
        if(data[i] > max) max = data[i];
    }

    if(circlePos[1]-radius > max)
        return justTest ? false : 0;

    if(circlePos[1]+radius < min){
        // Below the minimum point... We can just guess.
        // TODO
    }

    // 1. Check so center of circle is not inside the field. If it is, this wont work...
    // 2. For each edge
    // 2. 1. Get point on circle that is closest to the edge (scale normal with -radius)
    // 2. 2. Check if point is inside.

    var found = false;

    // Check all edges first
    for(var i=idxA; i<idxB; i++){

        // Get points
        vec2.set(v0,     i*w, data[i]  );
        vec2.set(v1, (i+1)*w, data[i+1]);
        vec2.add(v0,v0,hfPos);
        vec2.add(v1,v1,hfPos);

        // Get normal
        vec2.sub(worldNormal, v1, v0);
        vec2.rotate(worldNormal, worldNormal, Math.PI/2);
        vec2.normalize(worldNormal,worldNormal);

        // Get point on circle, closest to the edge
        vec2.scale(candidate,worldNormal,-radius);
        vec2.add(candidate,candidate,circlePos);

        // Distance from v0 to the candidate point
        vec2.sub(dist,candidate,v0);

        // Check if it is in the element "stick"
        var d = vec2.dot(dist,worldNormal);
        if(candidate[0] >= v0[0] && candidate[0] < v1[0] && d <= 0){

            if(justTest){
                return true;
            }

            found = true;

            // Store the candidate point, projected to the edge
            vec2.scale(dist,worldNormal,-d);
            vec2.add(minCandidate,candidate,dist);
            vec2.copy(minCandidateNormal,worldNormal);

            var c = this.createContactEquation(hfBody,circleBody,hfShape,circleShape);

            // Normal is out of the heightfield
            vec2.copy(c.normalA, minCandidateNormal);

            // Vector from circle to heightfield
            vec2.scale(c.contactPointB,  c.normalA, -radius);
            add(c.contactPointB, c.contactPointB, circlePos);
            sub(c.contactPointB, c.contactPointB, circleBody.position);

            vec2.copy(c.contactPointA, minCandidate);
            vec2.sub(c.contactPointA, c.contactPointA, hfBody.position);

            this.contactEquations.push(c);

            if(this.enableFriction){
                this.frictionEquations.push( this.createFrictionFromContact(c) );
            }
        }
    }

    // Check all vertices
    found = false;
    if(radius > 0){
        for(var i=idxA; i<=idxB; i++){

            // Get point
            vec2.set(v0, i*w, data[i]);
            vec2.add(v0,v0,hfPos);

            vec2.sub(dist, circlePos, v0);

            if(vec2.squaredLength(dist) < radius*radius){

                if(justTest) return true;

                found = true;

                var c = this.createContactEquation(hfBody,circleBody,hfShape,circleShape);

                // Construct normal - out of heightfield
                vec2.copy(c.normalA, dist);
                vec2.normalize(c.normalA,c.normalA);

                vec2.scale(c.contactPointB, c.normalA, -radius);
                add(c.contactPointB, c.contactPointB, circlePos);
                sub(c.contactPointB, c.contactPointB, circleBody.position);

                sub(c.contactPointA, v0, hfPos);
                add(c.contactPointA, c.contactPointA, hfPos);
                sub(c.contactPointA, c.contactPointA, hfBody.position);

                this.contactEquations.push(c);

                if(this.enableFriction){
                    this.frictionEquations.push(this.createFrictionFromContact(c));
                }
            }
        }
    }

    if(found){
        return 1;
    }

    return 0;

};

var convexHeightfield_v0 = vec2.create(),
    convexHeightfield_v1 = vec2.create(),
    convexHeightfield_tilePos = vec2.create(),
    convexHeightfield_tempConvexShape = new Convex([vec2.create(),vec2.create(),vec2.create(),vec2.create()]);
/**
 * @method circleHeightfield
 * @param  {Body}           bi
 * @param  {Circle}         si
 * @param  {Array}          xi
 * @param  {Body}           bj
 * @param  {Heightfield}    sj
 * @param  {Array}          xj
 * @param  {Number}         aj
 */
Narrowphase.prototype[Shape.RECTANGLE | Shape.HEIGHTFIELD] =
Narrowphase.prototype[Shape.CONVEX | Shape.HEIGHTFIELD] =
Narrowphase.prototype.convexHeightfield = function( convexBody,convexShape,convexPos,convexAngle,
                                                    hfBody,hfShape,hfPos,hfAngle, justTest ){
    var data = hfShape.data,
        w = hfShape.elementWidth,
        v0 = convexHeightfield_v0,
        v1 = convexHeightfield_v1,
        tilePos = convexHeightfield_tilePos,
        tileConvex = convexHeightfield_tempConvexShape;

    // Get the index of the points to test against
    var idxA = Math.floor( (convexBody.aabb.lowerBound[0] - hfPos[0]) / w ),
        idxB = Math.ceil(  (convexBody.aabb.upperBound[0] - hfPos[0]) / w );

    if(idxA < 0) idxA = 0;
    if(idxB >= data.length) idxB = data.length-1;

    // Get max and min
    var max = data[idxA],
        min = data[idxB];
    for(var i=idxA; i<idxB; i++){
        if(data[i] < min) min = data[i];
        if(data[i] > max) max = data[i];
    }

    if(convexBody.aabb.lowerBound[1] > max){
        return justTest ? false : 0;
    }

    var found = false;
    var numContacts = 0;

    // Loop over all edges
    for(var i=idxA; i<idxB; i++){

        // Get points
        vec2.set(v0,     i*w, data[i]  );
        vec2.set(v1, (i+1)*w, data[i+1]);
        vec2.add(v0,v0,hfPos);
        vec2.add(v1,v1,hfPos);

        // Construct a convex
        var tileHeight = 100; // todo
        vec2.set(tilePos, (v1[0] + v0[0])*0.5, (v1[1] + v0[1] - tileHeight)*0.5);

        vec2.sub(tileConvex.vertices[0], v1, tilePos);
        vec2.sub(tileConvex.vertices[1], v0, tilePos);
        vec2.copy(tileConvex.vertices[2], tileConvex.vertices[1]);
        vec2.copy(tileConvex.vertices[3], tileConvex.vertices[0]);
        tileConvex.vertices[2][1] -= tileHeight;
        tileConvex.vertices[3][1] -= tileHeight;

        // Do convex collision
        numContacts += this.convexConvex(   convexBody, convexShape, convexPos, convexAngle,
                                            hfBody, tileConvex, tilePos, 0, justTest);
    }

    return numContacts;
};
},{"../equations/ContactEquation":21,"../equations/Equation":22,"../equations/FrictionEquation":23,"../math/vec2":30,"../objects/Body":31,"../shapes/Circle":35,"../shapes/Convex":36,"../shapes/Rectangle":41,"../shapes/Shape":42,"../utils/TupleDictionary":46,"../utils/Utils":47}],13:[function(require,module,exports){
var Utils = require('../utils/Utils')
,   Broadphase = require('../collision/Broadphase');

module.exports = SAPBroadphase;

/**
 * Sweep and prune broadphase along one axis.
 *
 * @class SAPBroadphase
 * @constructor
 * @extends Broadphase
 */
function SAPBroadphase(){
    Broadphase.call(this,Broadphase.SAP);

    /**
     * List of bodies currently in the broadphase.
     * @property axisList
     * @type {Array}
     */
    this.axisList = [];

    /**
     * The world to search in.
     * @property world
     * @type {World}
     */
    this.world = null;

    /**
     * The axis to sort along.
     * @property axisIndex
     * @type {Number}
     */
    this.axisIndex = 0;

    var axisList = this.axisList;

    this._addBodyHandler = function(e){
        axisList.push(e.body);
    };

    this._removeBodyHandler = function(e){
        // Remove from list
        var idx = axisList.indexOf(e.body);
        if(idx !== -1){
            axisList.splice(idx,1);
        }
    };
}
SAPBroadphase.prototype = new Broadphase();

/**
 * Change the world
 * @method setWorld
 * @param  {World} world
 */
SAPBroadphase.prototype.setWorld = function(world){
    // Clear the old axis array
    this.axisList.length = 0;

    // Add all bodies from the new world
    Utils.appendArray(this.axisList, world.bodies);

    // Remove old handlers, if any
    world
        .off("addBody",this._addBodyHandler)
        .off("removeBody",this._removeBodyHandler);

    // Add handlers to update the list of bodies.
    world.on("addBody",this._addBodyHandler).on("removeBody",this._removeBodyHandler);

    this.world = world;
};

/**
 * Sorts bodies along an axis.
 * @method sortAxisList
 * @param {Array} a
 * @param {number} axisIndex
 * @return {Array}
 */
SAPBroadphase.sortAxisList = function(a, axisIndex){
    axisIndex = axisIndex|0;
    for(var i=1,l=a.length; i<l; i++) {
        var v = a[i];
        for(var j=i - 1;j>=0;j--) {
            if(a[j].aabb.lowerBound[axisIndex] <= v.aabb.lowerBound[axisIndex]){
                break;
            }
            a[j+1] = a[j];
        }
        a[j+1] = v;
    }
    return a;
};

/**
 * Get the colliding pairs
 * @method getCollisionPairs
 * @param  {World} world
 * @return {Array}
 */
SAPBroadphase.prototype.getCollisionPairs = function(world){
    var bodies = this.axisList,
        result = this.result,
        axisIndex = this.axisIndex;

    result.length = 0;

    // Update all AABBs if needed
    var l = bodies.length;
    while(l--){
        var b = bodies[l];
        if(b.aabbNeedsUpdate){
            b.updateAABB();
        }
    }

    // Sort the lists
    SAPBroadphase.sortAxisList(bodies, axisIndex);

    // Look through the X list
    for(var i=0, N=bodies.length|0; i!==N; i++){
        var bi = bodies[i];

        for(var j=i+1; j<N; j++){
            var bj = bodies[j];

            // Bounds overlap?
            var overlaps = (bj.aabb.lowerBound[axisIndex] <= bi.aabb.upperBound[axisIndex]);
            if(!overlaps){
                break;
            }

            if(Broadphase.canCollide(bi,bj) && this.boundingVolumeCheck(bi,bj)){
                result.push(bi,bj);
            }
        }
    }

    return result;
};


},{"../collision/Broadphase":9,"../utils/Utils":47}],14:[function(require,module,exports){
module.exports = Constraint;

var Utils = require('../utils/Utils');

/**
 * Base constraint class.
 *
 * @class Constraint
 * @constructor
 * @author schteppe
 * @param {Body} bodyA
 * @param {Body} bodyB
 * @param {Number} type
 * @param {Object} [options]
 * @param {Object} [options.collideConnected=true]
 */
function Constraint(bodyA, bodyB, type, options){
    this.type = type;

    options = Utils.defaults(options,{
        collideConnected : true,
        wakeUpBodies : true,
    });

    /**
     * Equations to be solved in this constraint
     *
     * @property equations
     * @type {Array}
     */
    this.equations = [];

    /**
     * First body participating in the constraint.
     * @property bodyA
     * @type {Body}
     */
    this.bodyA = bodyA;

    /**
     * Second body participating in the constraint.
     * @property bodyB
     * @type {Body}
     */
    this.bodyB = bodyB;

    /**
     * Set to true if you want the connected bodies to collide.
     * @property collideConnected
     * @type {Boolean}
     * @default true
     */
    this.collideConnected = options.collideConnected;

    // Wake up bodies when connected
    if(options.wakeUpBodies){
        if(bodyA){
            bodyA.wakeUp();
        }
        if(bodyB){
            bodyB.wakeUp();
        }
    }
}

/**
 * Updates the internal constraint parameters before solve.
 * @method update
 */
Constraint.prototype.update = function(){
    throw new Error("method update() not implmemented in this Constraint subclass!");
};

Constraint.DISTANCE = 1;
Constraint.GEAR = 2;
Constraint.LOCK = 3;
Constraint.PRISMATIC = 4;
Constraint.REVOLUTE = 5;

/**
 * Set stiffness for this constraint.
 * @method setStiffness
 * @param {Number} stiffness
 */
Constraint.prototype.setStiffness = function(stiffness){
    var eqs = this.equations;
    for(var i=0; i !== eqs.length; i++){
        var eq = eqs[i];
        eq.stiffness = stiffness;
        eq.needsUpdate = true;
    }
};

/**
 * Set relaxation for this constraint.
 * @method setRelaxation
 * @param {Number} relaxation
 */
Constraint.prototype.setRelaxation = function(relaxation){
    var eqs = this.equations;
    for(var i=0; i !== eqs.length; i++){
        var eq = eqs[i];
        eq.relaxation = relaxation;
        eq.needsUpdate = true;
    }
};

},{"../utils/Utils":47}],15:[function(require,module,exports){
var Constraint = require('./Constraint')
,   Equation = require('../equations/Equation')
,   vec2 = require('../math/vec2')

module.exports = DistanceConstraint;

/**
 * Constraint that tries to keep the distance between two bodies constant.
 *
 * @class DistanceConstraint
 * @constructor
 * @author schteppe
 * @param {Body} bodyA
 * @param {Body} bodyB
 * @param {number} distance The distance to keep between the bodies.
 * @param {object} [options]
 * @param {object} [options.maxForce=Number.MAX_VALUE] Maximum force to apply.
 * @extends Constraint
 */
function DistanceConstraint(bodyA,bodyB,distance,options){
    options = options || {};

    Constraint.call(this,bodyA,bodyB,Constraint.DISTANCE,options);

    /**
     * The distance to keep.
     * @property distance
     * @type {Number}
     */
    this.distance = distance;

    /**
     * Local anchor in body A.
     * @property localAnchorA
     * @type {Array}
     */
    this.localAnchorA = vec2.create();

    /**
     * Local anchor in body B.
     * @property localAnchorB
     * @type {Array}
     */
    this.localAnchorB = vec2.create();

    var localAnchorA = this.localAnchorA;
    var localAnchorB = this.localAnchorB;

    var maxForce;
    if(typeof(options.maxForce)==="undefined" ){
        maxForce = Number.MAX_VALUE;
    } else {
        maxForce = options.maxForce;
    }

    var normal = new Equation(bodyA,bodyB,-maxForce,maxForce); // Just in the normal direction
    this.equations = [ normal ];

    // g = (xi - xj).dot(n)
    // dg/dt = (vi - vj).dot(n) = G*W = [n 0 -n 0] * [vi wi vj wj]'

    // ...and if we were to include offset points (TODO for now):
    // g =
    //      (xj + rj - xi - ri).dot(n) - distance
    //
    // dg/dt =
    //      (vj + wj x rj - vi - wi x ri).dot(n) =
    //      { term 2 is near zero } =
    //      [-n   -ri x n   n   rj x n] * [vi wi vj wj]' =
    //      G * W
    //
    // => G = [-n -rixn n rjxn]

    var r = vec2.create();
    var ri = vec2.create(); // worldAnchorA
    var rj = vec2.create(); // worldAnchorB
    var that = this;
    normal.computeGq = function(){
        var bodyA = this.bodyA,
            bodyB = this.bodyB,
            xi = bodyA.position,
            xj = bodyB.position;

        // Transform local anchors to world
        vec2.rotate(ri, localAnchorA, bodyA.angle);
        vec2.rotate(rj, localAnchorB, bodyB.angle);

        vec2.add(r, xi, rj);
        vec2.sub(r, r, ri);
        vec2.sub(r, r, xi);

        vec2.sub(r, bodyB.position, bodyA.position);
        return vec2.length(r) - that.distance;
    };

    // Make the contact constraint bilateral
    this.setMaxForce(maxForce);
}
DistanceConstraint.prototype = new Constraint();

/**
 * Update the constraint equations. Should be done if any of the bodies changed position, before solving.
 * @method update
 */
var n = vec2.create();
var ri = vec2.create(); // worldAnchorA
var rj = vec2.create(); // worldAnchorB
DistanceConstraint.prototype.update = function(){
    var normal = this.equations[0],
        bodyA = this.bodyA,
        bodyB = this.bodyB,
        distance = this.distance,
        xi = bodyA.position,
        xj = bodyB.position,
        G = normal.G;

    // Transform local anchors to world
    vec2.rotate(ri, this.localAnchorA, bodyA.angle);
    vec2.rotate(rj, this.localAnchorB, bodyB.angle);

    // Caluclate cross products
    var rixn = vec2.crossLength(ri, n),
        rjxn = vec2.crossLength(rj, n);

    /*
    // G = [-n -rixn n rjxn]
    G[0] = -n[0];
    G[1] = -n[1];
    G[2] = -rixn;
    G[3] = n[0];
    G[4] = n[1];
    G[5] = rjxn;
    */

    vec2.sub(n, bodyB.position, bodyA.position);
    vec2.normalize(n,n);
    G[0] = -n[0];
    G[1] = -n[1];
    G[3] =  n[0];
    G[4] =  n[1];
};

/**
 * Set the max force to be used
 * @method setMaxForce
 * @param {Number} f
 */
DistanceConstraint.prototype.setMaxForce = function(f){
    var normal = this.equations[0];
    normal.minForce = -f;
    normal.maxForce =  f;
};

/**
 * Get the max force
 * @method getMaxForce
 * @return {Number}
 */
DistanceConstraint.prototype.getMaxForce = function(f){
    var normal = this.equations[0];
    return normal.maxForce;
};

},{"../equations/Equation":22,"../math/vec2":30,"./Constraint":14}],16:[function(require,module,exports){
var Constraint = require('./Constraint')
,   Equation = require('../equations/Equation')
,   AngleLockEquation = require('../equations/AngleLockEquation')
,   vec2 = require('../math/vec2')

module.exports = GearConstraint;

/**
 * Connects two bodies at given offset points, letting them rotate relative to each other around this point.
 * @class GearConstraint
 * @constructor
 * @author schteppe
 * @param {Body}            bodyA
 * @param {Body}            bodyB
 * @param {Object}          [options]
 * @param {Number}          [options.angle=0] Relative angle between the bodies.
 * @param {Number}          [options.ratio=1] Gear ratio.
 * @param {Number}          [options.maxTorque] Maximum torque to apply.
 * @extends Constraint
 * @todo Ability to specify world points
 */
function GearConstraint(bodyA, bodyB, options){
    options = options || {};

    Constraint.call(this, bodyA, bodyB, Constraint.GEAR, options);

    this.equations = [
        new AngleLockEquation(bodyA,bodyB,options),
    ];

    /**
     * The relative angle
     * @property angle
     * @type {Number}
     */
    this.angle = typeof(options.angle) === "number" ? options.angle : 0;

    /**
     * The gear ratio.
     * @property ratio
     * @type {Number}
     */
    this.ratio = typeof(options.ratio) === "number" ? options.ratio : 1;

    // Set max torque
    if(typeof(options.maxTorque) === "number"){
        this.setMaxTorque(options.maxTorque);
    }
}
GearConstraint.prototype = new Constraint();

GearConstraint.prototype.update = function(){
    var eq = this.equations[0];
    if(eq.ratio !== this.ratio){
        eq.setRatio(this.ratio);
    }
    eq.angle = this.angle;
};

/**
 * Set the max torque for the constraint.
 * @method setMaxTorque
 * @param {Number} torque
 */
GearConstraint.prototype.setMaxTorque = function(torque){
    this.equations[0].setMaxTorque(torque);
};

/**
 * Get the max torque for the constraint.
 * @method getMaxTorque
 * @return {Number}
 */
GearConstraint.prototype.getMaxTorque = function(torque){
    return this.equations[0].maxForce;
};
},{"../equations/AngleLockEquation":20,"../equations/Equation":22,"../math/vec2":30,"./Constraint":14}],17:[function(require,module,exports){
var Constraint = require('./Constraint')
,   vec2 = require('../math/vec2')
,   Equation = require('../equations/Equation')

module.exports = LockConstraint;

/**
 * Locks the relative position between two bodies.
 *
 * @class LockConstraint
 * @constructor
 * @author schteppe
 * @param {Body} bodyA
 * @param {Body} bodyB
 * @param {Object} [options]
 * @param {Array}  [options.localOffsetB] The offset of bodyB in bodyA's frame. Default is the zero vector.
 * @param {number} [options.localAngleB=0]  The angle of bodyB in bodyA's frame.
 * @param {number} [options.maxForce]
 * @extends Constraint
 */
function LockConstraint(bodyA, bodyB, options){
    options = options || {};

    Constraint.call(this,bodyA,bodyB,Constraint.LOCK,options);
    var maxForce = ( typeof(options.maxForce)==="undefined" ? Number.MAX_VALUE : options.maxForce );
    var localOffsetB = options.localOffsetB || vec2.fromValues(0,0);
    localOffsetB = vec2.fromValues(localOffsetB[0],localOffsetB[1]);

    var localAngleB = options.localAngleB || 0;

    // Use 3 equations:
    // gx =   (xj - xi - l) * xhat = 0
    // gy =   (xj - xi - l) * yhat = 0
    // gr =   (xi - xj + r) * that = 0
    //
    // ...where:
    //   l is the localOffsetB vector rotated to world in bodyA frame
    //   r is the same vector but reversed and rotated from bodyB frame
    //   xhat, yhat are world axis vectors
    //   that is the tangent of r
    //
    // For the first two constraints, we get
    // G*W = (vj - vi - ldot  ) * xhat
    //     = (vj - vi - wi x l) * xhat
    //
    // Since (wi x l) * xhat = (l x xhat) * wi, we get
    // G*W = [ -1   0   (-l x xhat)  1   0   0] * [vi wi vj wj]
    //
    // The last constraint gives
    // GW = (vi - vj + wj x r) * that
    //    = [  that   0  -that  (r x t) ]

    var x =     new Equation(bodyA,bodyB,-maxForce,maxForce),
        y =     new Equation(bodyA,bodyB,-maxForce,maxForce),
        rot =   new Equation(bodyA,bodyB,-maxForce,maxForce);

    var l = vec2.create(),
        g = vec2.create(),
        that = this;
    x.computeGq = function(){
        vec2.rotate(l, that.localOffsetB, bodyA.angle);
        vec2.sub(g, bodyB.position, bodyA.position);
        vec2.sub(g, g, l);
        return g[0];
    };
    y.computeGq = function(){
        vec2.rotate(l, that.localOffsetB, bodyA.angle);
        vec2.sub(g, bodyB.position, bodyA.position);
        vec2.sub(g, g, l);
        return g[1];
    };
    var r = vec2.create(),
        t = vec2.create();
    rot.computeGq = function(){
        vec2.rotate(r, that.localOffsetB, bodyB.angle - that.localAngleB);
        vec2.scale(r,r,-1);
        vec2.sub(g,bodyA.position,bodyB.position);
        vec2.add(g,g,r);
        vec2.rotate(t,r,-Math.PI/2);
        vec2.normalize(t,t);
        return vec2.dot(g,t);
    };

    /**
     * The offset of bodyB in bodyA's frame.
     * @property {Array} localOffsetB
     */
    this.localOffsetB = localOffsetB;

    /**
     * The offset angle of bodyB in bodyA's frame.
     * @property {Number} localAngleB
     */
    this.localAngleB =  localAngleB;

    this.equations.push(x, y, rot);
    this.setMaxForce(maxForce);
}
LockConstraint.prototype = new Constraint();

/**
 * Set the maximum force to be applied.
 * @method setMaxForce
 * @param {Number} force
 */
LockConstraint.prototype.setMaxForce = function(force){
    var eqs = this.equations;
    for(var i=0; i<this.equations.length; i++){
        eqs[i].maxForce =  force;
        eqs[i].minForce = -force;
    }
};

/**
 * Get the max force.
 * @method getMaxForce
 * @return {Number}
 */
LockConstraint.prototype.getMaxForce = function(){
    return this.equations[0].maxForce;
};

var l = vec2.create();
var r = vec2.create();
var t = vec2.create();
var xAxis = vec2.fromValues(1,0);
var yAxis = vec2.fromValues(0,1);
LockConstraint.prototype.update = function(){
    var x =   this.equations[0],
        y =   this.equations[1],
        rot = this.equations[2],
        bodyA = this.bodyA,
        bodyB = this.bodyB;

    vec2.rotate(l,this.localOffsetB,bodyA.angle);
    vec2.rotate(r,this.localOffsetB,bodyB.angle - this.localAngleB);
    vec2.scale(r,r,-1);

    vec2.rotate(t,r,Math.PI/2);
    vec2.normalize(t,t);

    x.G[0] = -1;
    x.G[1] =  0;
    x.G[2] = -vec2.crossLength(l,xAxis);
    x.G[3] =  1;

    y.G[0] =  0;
    y.G[1] = -1;
    y.G[2] = -vec2.crossLength(l,yAxis);
    y.G[4] =  1;

    rot.G[0] =  -t[0];
    rot.G[1] =  -t[1];
    rot.G[3] =  t[0];
    rot.G[4] =  t[1];
    rot.G[5] =  vec2.crossLength(r,t);
};

},{"../equations/Equation":22,"../math/vec2":30,"./Constraint":14}],18:[function(require,module,exports){
var Constraint = require('./Constraint')
,   ContactEquation = require('../equations/ContactEquation')
,   Equation = require('../equations/Equation')
,   vec2 = require('../math/vec2')
,   RotationalLockEquation = require('../equations/RotationalLockEquation')

module.exports = PrismaticConstraint;

/**
 * Constraint that only allows bodies to move along a line, relative to each other. See <a href="http://www.iforce2d.net/b2dtut/joints-prismatic">this tutorial</a>.
 *
 * @class PrismaticConstraint
 * @constructor
 * @extends Constraint
 * @author schteppe
 * @param {Body}    bodyA
 * @param {Body}    bodyB
 * @param {Object}  [options]
 * @param {Number}  [options.maxForce]                Max force to be applied by the constraint
 * @param {Array}   [options.localAnchorA]            Body A's anchor point, defined in its own local frame.
 * @param {Array}   [options.localAnchorB]            Body B's anchor point, defined in its own local frame.
 * @param {Array}   [options.localAxisA]              An axis, defined in body A frame, that body B's anchor point may slide along.
 * @param {Boolean} [options.disableRotationalLock]   If set to true, bodyB will be free to rotate around its anchor point.
 * @param {Number}  [options.upperLimit]
 * @param {Number}  [options.lowerLimit]
 */
function PrismaticConstraint(bodyA, bodyB, options){
    options = options || {};
    Constraint.call(this,bodyA,bodyB,Constraint.PRISMATIC,options);

    // Get anchors
    var localAnchorA = vec2.fromValues(0,0),
        localAxisA = vec2.fromValues(1,0),
        localAnchorB = vec2.fromValues(0,0);
    if(options.localAnchorA) vec2.copy(localAnchorA, options.localAnchorA);
    if(options.localAxisA)   vec2.copy(localAxisA,   options.localAxisA);
    if(options.localAnchorB) vec2.copy(localAnchorB, options.localAnchorB);

    /**
     * @property localAnchorA
     * @type {Array}
     */
    this.localAnchorA = localAnchorA;

    /**
     * @property localAnchorB
     * @type {Array}
     */
    this.localAnchorB = localAnchorB;

    /**
     * @property localAxisA
     * @type {Array}
     */
    this.localAxisA = localAxisA;

    /*

    The constraint violation for the common axis point is

        g = ( xj + rj - xi - ri ) * t   :=  gg*t

    where r are body-local anchor points, and t is a tangent to the constraint axis defined in body i frame.

        gdot =  ( vj + wj x rj - vi - wi x ri ) * t + ( xj + rj - xi - ri ) * ( wi x t )

    Note the use of the chain rule. Now we identify the jacobian

        G*W = [ -t      -ri x t + t x gg     t    rj x t ] * [vi wi vj wj]

    The rotational part is just a rotation lock.

     */

    var maxForce = this.maxForce = typeof(options.maxForce)!="undefined" ? options.maxForce : Number.MAX_VALUE;

    // Translational part
    var trans = new Equation(bodyA,bodyB,-maxForce,maxForce);
    var ri = new vec2.create(),
        rj = new vec2.create(),
        gg = new vec2.create(),
        t =  new vec2.create();
    trans.computeGq = function(){
        // g = ( xj + rj - xi - ri ) * t
        return vec2.dot(gg,t);
    };
    trans.updateJacobian = function(){
        var G = this.G,
            xi = bodyA.position,
            xj = bodyB.position;
        vec2.rotate(ri,localAnchorA,bodyA.angle);
        vec2.rotate(rj,localAnchorB,bodyB.angle);
        vec2.add(gg,xj,rj);
        vec2.sub(gg,gg,xi);
        vec2.sub(gg,gg,ri);
        vec2.rotate(t,localAxisA,bodyA.angle+Math.PI/2);

        G[0] = -t[0];
        G[1] = -t[1];
        G[2] = -vec2.crossLength(ri,t) + vec2.crossLength(t,gg);
        G[3] = t[0];
        G[4] = t[1];
        G[5] = vec2.crossLength(rj,t);
    };
    this.equations.push(trans);

    // Rotational part
    if(!options.disableRotationalLock){
        var rot = new RotationalLockEquation(bodyA,bodyB,-maxForce,maxForce);
        this.equations.push(rot);
    }

    /**
     * The position of anchor A relative to anchor B, along the constraint axis.
     * @property position
     * @type {Number}
     */
    this.position = 0;

    this.velocity = 0;

    /**
     * Set to true to enable lower limit.
     * @property lowerLimitEnabled
     * @type {Boolean}
     */
    this.lowerLimitEnabled = typeof(options.lowerLimit)!=="undefined" ? true : false;

    /**
     * Set to true to enable upper limit.
     * @property upperLimitEnabled
     * @type {Boolean}
     */
    this.upperLimitEnabled = typeof(options.upperLimit)!=="undefined" ? true : false;

    /**
     * Lower constraint limit. The constraint position is forced to be larger than this value.
     * @property lowerLimit
     * @type {Number}
     */
    this.lowerLimit = typeof(options.lowerLimit)!=="undefined" ? options.lowerLimit : 0;

    /**
     * Upper constraint limit. The constraint position is forced to be smaller than this value.
     * @property upperLimit
     * @type {Number}
     */
    this.upperLimit = typeof(options.upperLimit)!=="undefined" ? options.upperLimit : 1;

    // Equations used for limits
    this.upperLimitEquation = new ContactEquation(bodyA,bodyB);
    this.lowerLimitEquation = new ContactEquation(bodyA,bodyB);

    // Set max/min forces
    this.upperLimitEquation.minForce = this.lowerLimitEquation.minForce = 0;
    this.upperLimitEquation.maxForce = this.lowerLimitEquation.maxForce = maxForce;

    /**
     * Equation used for the motor.
     * @property motorEquation
     * @type {Equation}
     */
    this.motorEquation = new Equation(bodyA,bodyB);

    /**
     * The current motor state. Enable or disable the motor using .enableMotor
     * @property motorEnabled
     * @type {Boolean}
     */
    this.motorEnabled = false;

    /**
     * Set the target speed for the motor.
     * @property motorSpeed
     * @type {Number}
     */
    this.motorSpeed = 0;

    var that = this;
    var motorEquation = this.motorEquation;
    var old = motorEquation.computeGW;
    motorEquation.computeGq = function(){ return 0; };
    motorEquation.computeGW = function(){
        var G = this.G,
            bi = this.bodyA,
            bj = this.bodyB,
            vi = bi.velocity,
            vj = bj.velocity,
            wi = bi.angularVelocity,
            wj = bj.angularVelocity;
        return this.transformedGmult(G,vi,wi,vj,wj) + that.motorSpeed;
    };
}

PrismaticConstraint.prototype = new Constraint();

var worldAxisA = vec2.create(),
    worldAnchorA = vec2.create(),
    worldAnchorB = vec2.create(),
    orientedAnchorA = vec2.create(),
    orientedAnchorB = vec2.create(),
    tmp = vec2.create();

/**
 * Update the constraint equations. Should be done if any of the bodies changed position, before solving.
 * @method update
 */
PrismaticConstraint.prototype.update = function(){
    var eqs = this.equations,
        trans = eqs[0],
        upperLimit = this.upperLimit,
        lowerLimit = this.lowerLimit,
        upperLimitEquation = this.upperLimitEquation,
        lowerLimitEquation = this.lowerLimitEquation,
        bodyA = this.bodyA,
        bodyB = this.bodyB,
        localAxisA = this.localAxisA,
        localAnchorA = this.localAnchorA,
        localAnchorB = this.localAnchorB;

    trans.updateJacobian();

    // Transform local things to world
    vec2.rotate(worldAxisA,      localAxisA,      bodyA.angle);
    vec2.rotate(orientedAnchorA, localAnchorA,    bodyA.angle);
    vec2.add(worldAnchorA,       orientedAnchorA, bodyA.position);
    vec2.rotate(orientedAnchorB, localAnchorB,    bodyB.angle);
    vec2.add(worldAnchorB,       orientedAnchorB, bodyB.position);

    var relPosition = this.position = vec2.dot(worldAnchorB,worldAxisA) - vec2.dot(worldAnchorA,worldAxisA);

    // Motor
    if(this.motorEnabled){
        // G = [ a     a x ri   -a   -a x rj ]
        var G = this.motorEquation.G;
        G[0] = worldAxisA[0];
        G[1] = worldAxisA[1];
        G[2] = vec2.crossLength(worldAxisA,orientedAnchorB);
        G[3] = -worldAxisA[0];
        G[4] = -worldAxisA[1];
        G[5] = -vec2.crossLength(worldAxisA,orientedAnchorA);
    }

    /*
        Limits strategy:
        Add contact equation, with normal along the constraint axis.
        min/maxForce is set so the constraint is repulsive in the correct direction.
        Some offset is added to either equation.contactPointA or .contactPointB to get the correct upper/lower limit.

                 ^
                 |
      upperLimit x
                 |    ------
         anchorB x<---|  B |
                 |    |    |
        ------   |    ------
        |    |   |
        |  A |-->x anchorA
        ------   |
                 x lowerLimit
                 |
                axis
     */

    if(this.upperLimitEnabled && relPosition > upperLimit){
        // Update contact constraint normal, etc
        vec2.scale(upperLimitEquation.normalA, worldAxisA, -1);
        vec2.sub(upperLimitEquation.contactPointA, worldAnchorA, bodyA.position);
        vec2.sub(upperLimitEquation.contactPointB, worldAnchorB, bodyB.position);
        vec2.scale(tmp,worldAxisA,upperLimit);
        vec2.add(upperLimitEquation.contactPointA,upperLimitEquation.contactPointA,tmp);
        if(eqs.indexOf(upperLimitEquation)==-1)
            eqs.push(upperLimitEquation);
    } else {
        var idx = eqs.indexOf(upperLimitEquation);
        if(idx != -1) eqs.splice(idx,1);
    }

    if(this.lowerLimitEnabled && relPosition < lowerLimit){
        // Update contact constraint normal, etc
        vec2.scale(lowerLimitEquation.normalA, worldAxisA, 1);
        vec2.sub(lowerLimitEquation.contactPointA, worldAnchorA, bodyA.position);
        vec2.sub(lowerLimitEquation.contactPointB, worldAnchorB, bodyB.position);
        vec2.scale(tmp,worldAxisA,lowerLimit);
        vec2.sub(lowerLimitEquation.contactPointB,lowerLimitEquation.contactPointB,tmp);
        if(eqs.indexOf(lowerLimitEquation)==-1)
            eqs.push(lowerLimitEquation);
    } else {
        var idx = eqs.indexOf(lowerLimitEquation);
        if(idx != -1) eqs.splice(idx,1);
    }
};

/**
 * Enable the motor
 * @method enableMotor
 */
PrismaticConstraint.prototype.enableMotor = function(){
    if(this.motorEnabled) return;
    this.equations.push(this.motorEquation);
    this.motorEnabled = true;
};

/**
 * Disable the rotational motor
 * @method disableMotor
 */
PrismaticConstraint.prototype.disableMotor = function(){
    if(!this.motorEnabled) return;
    var i = this.equations.indexOf(this.motorEquation);
    this.equations.splice(i,1);
    this.motorEnabled = false;
};

},{"../equations/ContactEquation":21,"../equations/Equation":22,"../equations/RotationalLockEquation":24,"../math/vec2":30,"./Constraint":14}],19:[function(require,module,exports){
var Constraint = require('./Constraint')
,   Equation = require('../equations/Equation')
,   RotationalVelocityEquation = require('../equations/RotationalVelocityEquation')
,   RotationalLockEquation = require('../equations/RotationalLockEquation')
,   vec2 = require('../math/vec2')

module.exports = RevoluteConstraint;

var worldPivotA = vec2.create(),
    worldPivotB = vec2.create(),
    xAxis = vec2.fromValues(1,0),
    yAxis = vec2.fromValues(0,1),
    g = vec2.create();

/**
 * Connects two bodies at given offset points, letting them rotate relative to each other around this point.
 * @class RevoluteConstraint
 * @constructor
 * @author schteppe
 * @param {Body}    bodyA
 * @param {Array}   pivotA              The point relative to the center of mass of bodyA which bodyA is constrained to.
 * @param {Body}    bodyB               Body that will be constrained in a similar way to the same point as bodyA. We will therefore get sort of a link between bodyA and bodyB. If not specified, bodyA will be constrained to a static point.
 * @param {Array}   pivotB              See pivotA.
 * @param {Object}  [options]
 * @param {Number}  [options.maxForce]  The maximum force that should be applied to constrain the bodies.
 * @extends Constraint
 * @todo Ability to specify world points
 * @todo put pivot parameters in the options object?
 */
function RevoluteConstraint(bodyA, pivotA, bodyB, pivotB, options){
    options = options || {};
    Constraint.call(this,bodyA,bodyB,Constraint.REVOLUTE,options);

    var maxForce = this.maxForce = typeof(options.maxForce) !== "undefined" ? options.maxForce : Number.MAX_VALUE;

    /**
     * @property {Array} pivotA
     */
    this.pivotA = vec2.fromValues(pivotA[0],pivotA[1]);

    /**
     * @property {Array} pivotB
     */
    this.pivotB = vec2.fromValues(pivotB[0],pivotB[1]);

    // Equations to be fed to the solver
    var eqs = this.equations = [
        new Equation(bodyA,bodyB,-maxForce,maxForce),
        new Equation(bodyA,bodyB,-maxForce,maxForce),
    ];

    var x = eqs[0];
    var y = eqs[1];
    var that = this;

    x.computeGq = function(){
        vec2.rotate(worldPivotA, that.pivotA, bodyA.angle);
        vec2.rotate(worldPivotB, that.pivotB, bodyB.angle);
        vec2.add(g, bodyB.position, worldPivotB);
        vec2.sub(g, g, bodyA.position);
        vec2.sub(g, g, worldPivotA);
        return vec2.dot(g,xAxis);
    };

    y.computeGq = function(){
        vec2.rotate(worldPivotA, that.pivotA, bodyA.angle);
        vec2.rotate(worldPivotB, that.pivotB, bodyB.angle);
        vec2.add(g, bodyB.position, worldPivotB);
        vec2.sub(g, g, bodyA.position);
        vec2.sub(g, g, worldPivotA);
        return vec2.dot(g,yAxis);
    };

    y.minForce = x.minForce = -maxForce;
    y.maxForce = x.maxForce =  maxForce;

    this.motorEquation = new RotationalVelocityEquation(bodyA,bodyB);

    /**
     * Indicates whether the motor is enabled. Use .enableMotor() to enable the constraint motor.
     * @property {Boolean} motorEnabled
     * @readOnly
     */
    this.motorEnabled = false;

    /**
     * The constraint position.
     * @property angle
     * @type {Number}
     * @readOnly
     */
    this.angle = 0;

    /**
     * Set to true to enable lower limit
     * @property lowerLimitEnabled
     * @type {Boolean}
     */
    this.lowerLimitEnabled = false;

    /**
     * Set to true to enable upper limit
     * @property upperLimitEnabled
     * @type {Boolean}
     */
    this.upperLimitEnabled = false;

    /**
     * The lower limit on the constraint angle.
     * @property lowerLimit
     * @type {Boolean}
     */
    this.lowerLimit = 0;

    /**
     * The upper limit on the constraint angle.
     * @property upperLimit
     * @type {Boolean}
     */
    this.upperLimit = 0;

    this.upperLimitEquation = new RotationalLockEquation(bodyA,bodyB);
    this.lowerLimitEquation = new RotationalLockEquation(bodyA,bodyB);
    this.upperLimitEquation.minForce = 0;
    this.lowerLimitEquation.maxForce = 0;
}
RevoluteConstraint.prototype = new Constraint();

RevoluteConstraint.prototype.update = function(){
    var bodyA =  this.bodyA,
        bodyB =  this.bodyB,
        pivotA = this.pivotA,
        pivotB = this.pivotB,
        eqs =    this.equations,
        normal = eqs[0],
        tangent= eqs[1],
        x = eqs[0],
        y = eqs[1],
        upperLimit = this.upperLimit,
        lowerLimit = this.lowerLimit,
        upperLimitEquation = this.upperLimitEquation,
        lowerLimitEquation = this.lowerLimitEquation;

    var relAngle = this.angle = bodyB.angle - bodyA.angle;

    if(this.upperLimitEnabled && relAngle > upperLimit){
        upperLimitEquation.angle = upperLimit;
        if(eqs.indexOf(upperLimitEquation)==-1)
            eqs.push(upperLimitEquation);
    } else {
        var idx = eqs.indexOf(upperLimitEquation);
        if(idx != -1) eqs.splice(idx,1);
    }

    if(this.lowerLimitEnabled && relAngle < lowerLimit){
        lowerLimitEquation.angle = lowerLimit;
        if(eqs.indexOf(lowerLimitEquation)==-1)
            eqs.push(lowerLimitEquation);
    } else {
        var idx = eqs.indexOf(lowerLimitEquation);
        if(idx != -1) eqs.splice(idx,1);
    }

    /*

    The constraint violation is

        g = xj + rj - xi - ri

    ...where xi and xj are the body positions and ri and rj world-oriented offset vectors. Differentiate:

        gdot = vj + wj x rj - vi - wi x ri

    We split this into x and y directions. (let x and y be unit vectors along the respective axes)

        gdot * x = ( vj + wj x rj - vi - wi x ri ) * x
                 = ( vj*x + (wj x rj)*x -vi*x -(wi x ri)*x
                 = ( vj*x + (rj x x)*wj -vi*x -(ri x x)*wi
                 = [ -x   -(ri x x)   x   (rj x x)] * [vi wi vj wj]
                 = G*W

    ...and similar for y. We have then identified the jacobian entries for x and y directions:

        Gx = [ x   (rj x x)   -x   -(ri x x)]
        Gy = [ y   (rj x y)   -y   -(ri x y)]

     */

    vec2.rotate(worldPivotA, pivotA, bodyA.angle);
    vec2.rotate(worldPivotB, pivotB, bodyB.angle);

    // todo: these are a bit sparse. We could save some computations on making custom eq.computeGW functions, etc

    x.G[0] = -1;
    x.G[1] =  0;
    x.G[2] = -vec2.crossLength(worldPivotA,xAxis);
    x.G[3] =  1;
    x.G[4] =  0;
    x.G[5] =  vec2.crossLength(worldPivotB,xAxis);

    y.G[0] =  0;
    y.G[1] = -1;
    y.G[2] = -vec2.crossLength(worldPivotA,yAxis);
    y.G[3] =  0;
    y.G[4] =  1;
    y.G[5] =  vec2.crossLength(worldPivotB,yAxis);
};

/**
 * Enable the rotational motor
 * @method enableMotor
 */
RevoluteConstraint.prototype.enableMotor = function(){
    if(this.motorEnabled) return;
    this.equations.push(this.motorEquation);
    this.motorEnabled = true;
};

/**
 * Disable the rotational motor
 * @method disableMotor
 */
RevoluteConstraint.prototype.disableMotor = function(){
    if(!this.motorEnabled) return;
    var i = this.equations.indexOf(this.motorEquation);
    this.equations.splice(i,1);
    this.motorEnabled = false;
};

/**
 * Check if the motor is enabled.
 * @method motorIsEnabled
 * @return {Boolean}
 */
RevoluteConstraint.prototype.motorIsEnabled = function(){
    return !!this.motorEnabled;
};

/**
 * Set the speed of the rotational constraint motor
 * @method setMotorSpeed
 * @param  {Number} speed
 */
RevoluteConstraint.prototype.setMotorSpeed = function(speed){
    if(!this.motorEnabled){
        return;
    }
    var i = this.equations.indexOf(this.motorEquation);
    this.equations[i].relativeVelocity = speed;
};

/**
 * Get the speed of the rotational constraint motor
 * @method getMotorSpeed
 * @return  {Number} The current speed, or false if the motor is not enabled.
 */
RevoluteConstraint.prototype.getMotorSpeed = function(){
    if(!this.motorEnabled) return false;
    return this.motorEquation.relativeVelocity;
};

},{"../equations/Equation":22,"../equations/RotationalLockEquation":24,"../equations/RotationalVelocityEquation":25,"../math/vec2":30,"./Constraint":14}],20:[function(require,module,exports){
var Equation = require("./Equation"),
    vec2 = require('../math/vec2');

module.exports = AngleLockEquation;

/**
 * Locks the relative angle between two bodies. The constraint tries to keep the dot product between two vectors, local in each body, to zero. The local angle in body i is a parameter.
 *
 * @class AngleLockEquation
 * @constructor
 * @extends Equation
 * @param {Body} bodyA
 * @param {Body} bodyB
 * @param {Object} [options]
 * @param {Number} [options.angle] Angle to add to the local vector in body A.
 * @param {Number} [options.ratio] Gear ratio
 */
function AngleLockEquation(bodyA, bodyB, options){
    options = options || {};
    Equation.call(this,bodyA,bodyB,-Number.MAX_VALUE,Number.MAX_VALUE);
    this.angle = options.angle || 0;

    /**
     * The gear ratio.
     * @property {Number} ratio
     * @private
     * @see setRatio
     */
    this.ratio = typeof(options.ratio)==="number" ? options.ratio : 1;

    this.setRatio(this.ratio);
}
AngleLockEquation.prototype = new Equation();
AngleLockEquation.prototype.constructor = AngleLockEquation;

AngleLockEquation.prototype.computeGq = function(){
    return this.ratio * this.bodyA.angle - this.bodyB.angle + this.angle;
};

/**
 * Set the gear ratio for this equation
 * @method setRatio
 * @param {Number} ratio
 */
AngleLockEquation.prototype.setRatio = function(ratio){
    var G = this.G;
    G[2] =  ratio;
    G[5] = -1;
    this.ratio = ratio;
};

/**
 * Set the max force for the equation.
 * @method setMaxTorque
 * @param {Number} torque
 */
AngleLockEquation.prototype.setMaxTorque = function(torque){
    this.maxForce =  torque;
    this.minForce = -torque;
};

},{"../math/vec2":30,"./Equation":22}],21:[function(require,module,exports){
var Equation = require("./Equation"),
    vec2 = require('../math/vec2');

module.exports = ContactEquation;

/**
 * Non-penetration constraint equation. Tries to make the ri and rj vectors the same point.
 *
 * @class ContactEquation
 * @constructor
 * @extends Equation
 * @param {Body} bodyA
 * @param {Body} bodyB
 */
function ContactEquation(bodyA, bodyB){
    Equation.call(this, bodyA, bodyB, 0, Number.MAX_VALUE);

    /**
     * Vector from body i center of mass to the contact point.
     * @property contactPointA
     * @type {Array}
     */
    this.contactPointA = vec2.create();
    this.penetrationVec = vec2.create();

    /**
     * World-oriented vector from body A center of mass to the contact point.
     * @property contactPointB
     * @type {Array}
     */
    this.contactPointB = vec2.create();

    /**
     * The normal vector, pointing out of body i
     * @property normalA
     * @type {Array}
     */
    this.normalA = vec2.create();

    /**
     * The restitution to use (0=no bounciness, 1=max bounciness).
     * @property restitution
     * @type {Number}
     */
    this.restitution = 0;

    /**
     * This property is set to true if this is the first impact between the bodies (not persistant contact).
     * @property firstImpact
     * @type {Boolean}
     * @readOnly
     */
    this.firstImpact = false;

    /**
     * The shape in body i that triggered this contact.
     * @property shapeA
     * @type {Shape}
     */
    this.shapeA = null;

    /**
     * The shape in body j that triggered this contact.
     * @property shapeB
     * @type {Shape}
     */
    this.shapeB = null;
}
ContactEquation.prototype = new Equation();
ContactEquation.prototype.constructor = ContactEquation;
ContactEquation.prototype.computeB = function(a,b,h){
    var bi = this.bodyA,
        bj = this.bodyB,
        ri = this.contactPointA,
        rj = this.contactPointB,
        xi = bi.position,
        xj = bj.position;

    var penetrationVec = this.penetrationVec,
        n = this.normalA,
        G = this.G;

    // Caluclate cross products
    var rixn = vec2.crossLength(ri,n),
        rjxn = vec2.crossLength(rj,n);

    // G = [-n -rixn n rjxn]
    G[0] = -n[0];
    G[1] = -n[1];
    G[2] = -rixn;
    G[3] = n[0];
    G[4] = n[1];
    G[5] = rjxn;

    // Calculate q = xj+rj -(xi+ri) i.e. the penetration vector
    vec2.add(penetrationVec,xj,rj);
    vec2.sub(penetrationVec,penetrationVec,xi);
    vec2.sub(penetrationVec,penetrationVec,ri);

    // Compute iteration
    var GW, Gq;
    if(this.firstImpact && this.restitution !== 0){
        Gq = 0;
        GW = (1/b)*(1+this.restitution) * this.computeGW();
    } else {
        Gq = vec2.dot(n,penetrationVec);
        GW = this.computeGW();
    }

    var GiMf = this.computeGiMf();
    var B = - Gq * a - GW * b - h*GiMf;

    return B;
};

},{"../math/vec2":30,"./Equation":22}],22:[function(require,module,exports){
module.exports = Equation;

var vec2 = require('../math/vec2'),
    Utils = require('../utils/Utils'),
    Body = require('../objects/Body');

/**
 * Base class for constraint equations.
 * @class Equation
 * @constructor
 * @param {Body} bodyA First body participating in the equation
 * @param {Body} bodyB Second body participating in the equation
 * @param {number} minForce Minimum force to apply. Default: -Number.MAX_VALUE
 * @param {number} maxForce Maximum force to apply. Default: Number.MAX_VALUE
 */
function Equation(bodyA, bodyB, minForce, maxForce){

    /**
     * Minimum force to apply when solving.
     * @property minForce
     * @type {Number}
     */
    this.minForce = typeof(minForce)==="undefined" ? -Number.MAX_VALUE : minForce;

    /**
     * Max force to apply when solving.
     * @property maxForce
     * @type {Number}
     */
    this.maxForce = typeof(maxForce)==="undefined" ? Number.MAX_VALUE : maxForce;

    /**
     * First body participating in the constraint
     * @property bodyA
     * @type {Body}
     */
    this.bodyA = bodyA;

    /**
     * Second body participating in the constraint
     * @property bodyB
     * @type {Body}
     */
    this.bodyB = bodyB;

    /**
     * The stiffness of this equation. Typically chosen to a large number (~1e7), but can be chosen somewhat freely to get a stable simulation.
     * @property stiffness
     * @type {Number}
     */
    this.stiffness = Equation.DEFAULT_STIFFNESS;

    /**
     * The number of time steps needed to stabilize the constraint equation. Typically between 3 and 5 time steps.
     * @property relaxation
     * @type {Number}
     */
    this.relaxation = Equation.DEFAULT_RELAXATION;

    /**
     * The Jacobian entry of this equation. 6 numbers, 3 per body (x,y,angle).
     * @property G
     * @type {Array}
     */
    this.G = new Utils.ARRAY_TYPE(6);
    for(var i=0; i<6; i++){
        this.G[i]=0;
    }

    // Constraint frames for body i and j
    /*
    this.xi = vec2.create();
    this.xj = vec2.create();
    this.ai = 0;
    this.aj = 0;
    */
    this.offset = 0;

    this.a = 0;
    this.b = 0;
    this.epsilon = 0;
    this.timeStep = 1/60;

    /**
     * Indicates if stiffness or relaxation was changed.
     * @property {Boolean} needsUpdate
     */
    this.needsUpdate = true;

    /**
     * The resulting constraint multiplier from the last solve. This is mostly equivalent to the force produced by the constraint.
     * @property multiplier
     * @type {Number}
     */
    this.multiplier = 0;

    /**
     * Relative velocity.
     * @property {Number} relativeVelocity
     */
    this.relativeVelocity = 0;

    /**
     * Whether this equation is enabled or not. If true, it will be added to the solver.
     * @property {Boolean} enabled
     */
    this.enabled = true;
}
Equation.prototype.constructor = Equation;

/**
 * The default stiffness when creating a new Equation.
 * @static
 * @property {Number} DEFAULT_STIFFNESS
 * @default 1e6
 */
Equation.DEFAULT_STIFFNESS = 1e6;

/**
 * The default relaxation when creating a new Equation.
 * @static
 * @property {Number} DEFAULT_RELAXATION
 * @default 4
 */
Equation.DEFAULT_RELAXATION = 4;

/**
 * Compute SPOOK parameters .a, .b and .epsilon according to the current parameters. See equations 9, 10 and 11 in the <a href="http://www8.cs.umu.se/kurser/5DV058/VT09/lectures/spooknotes.pdf">SPOOK notes</a>.
 * @method update
 */
Equation.prototype.update = function(){
    var k = this.stiffness,
        d = this.relaxation,
        h = this.timeStep;

    this.a = 4.0 / (h * (1 + 4 * d));
    this.b = (4.0 * d) / (1 + 4 * d);
    this.epsilon = 4.0 / (h * h * k * (1 + 4 * d));

    this.needsUpdate = false;
};

function Gmult(G,vi,wi,vj,wj){
    return  G[0] * vi[0] +
            G[1] * vi[1] +
            G[2] * wi +
            G[3] * vj[0] +
            G[4] * vj[1] +
            G[5] * wj;
}

/**
 * Computes the RHS of the SPOOK equation
 * @method computeB
 * @return {Number}
 */
Equation.prototype.computeB = function(a,b,h){
    var GW = this.computeGW();
    var Gq = this.computeGq();
    var GiMf = this.computeGiMf();
    return - Gq * a - GW * b - GiMf*h;
};

/**
 * Computes G*q, where q are the generalized body coordinates
 * @method computeGq
 * @return {Number}
 */
var qi = vec2.create(),
    qj = vec2.create();
Equation.prototype.computeGq = function(){
    var G = this.G,
        bi = this.bodyA,
        bj = this.bodyB,
        xi = bi.position,
        xj = bj.position,
        ai = bi.angle,
        aj = bj.angle;

    return Gmult(G, qi, ai, qj, aj) + this.offset;
};

/**
 * Computes G*W, where W are the body velocities
 * @method computeGW
 * @return {Number}
 */
Equation.prototype.computeGW = function(){
    var G = this.G,
        bi = this.bodyA,
        bj = this.bodyB,
        vi = bi.velocity,
        vj = bj.velocity,
        wi = bi.angularVelocity,
        wj = bj.angularVelocity;
    return Gmult(G,vi,wi,vj,wj) + this.relativeVelocity;
};

/**
 * Computes G*Wlambda, where W are the body velocities
 * @method computeGWlambda
 * @return {Number}
 */
Equation.prototype.computeGWlambda = function(){
    var G = this.G,
        bi = this.bodyA,
        bj = this.bodyB,
        vi = bi.vlambda,
        vj = bj.vlambda,
        wi = bi.wlambda,
        wj = bj.wlambda;
    return Gmult(G,vi,wi,vj,wj);
};

/**
 * Computes G*inv(M)*f, where M is the mass matrix with diagonal blocks for each body, and f are the forces on the bodies.
 * @method computeGiMf
 * @return {Number}
 */
var iMfi = vec2.create(),
    iMfj = vec2.create();
Equation.prototype.computeGiMf = function(){
    var bi = this.bodyA,
        bj = this.bodyB,
        fi = bi.force,
        ti = bi.angularForce,
        fj = bj.force,
        tj = bj.angularForce,
        invMassi = getBodyInvMass(bi),
        invMassj = getBodyInvMass(bj),
        invIi = getBodyInvInertia(bi),
        invIj = getBodyInvInertia(bj),
        G = this.G;

    vec2.scale(iMfi, fi,invMassi);
    vec2.scale(iMfj, fj,invMassj);

    return Gmult(G,iMfi,ti*invIi,iMfj,tj*invIj);
};

function getBodyInvMass(body){
    if(body.sleepState === Body.SLEEPING){
        return 0;
    } else {
        return body.invMass;
    }
}
function getBodyInvInertia(body){
    if(body.sleepState === Body.SLEEPING){
        return 0;
    } else {
        return body.invInertia;
    }
}

/**
 * Computes G*inv(M)*G'
 * @method computeGiMGt
 * @return {Number}
 */
Equation.prototype.computeGiMGt = function(){
    var bi = this.bodyA,
        bj = this.bodyB,
        invMassi = getBodyInvMass(bi),
        invMassj = getBodyInvMass(bj),
        invIi = getBodyInvInertia(bi),
        invIj = getBodyInvInertia(bj),
        G = this.G;

    return  G[0] * G[0] * invMassi +
            G[1] * G[1] * invMassi +
            G[2] * G[2] *    invIi +
            G[3] * G[3] * invMassj +
            G[4] * G[4] * invMassj +
            G[5] * G[5] *    invIj;
};

var addToWlambda_temp = vec2.create(),
    addToWlambda_Gi = vec2.create(),
    addToWlambda_Gj = vec2.create(),
    addToWlambda_ri = vec2.create(),
    addToWlambda_rj = vec2.create(),
    addToWlambda_Mdiag = vec2.create();

/**
 * Add constraint velocity to the bodies.
 * @method addToWlambda
 * @param {Number} deltalambda
 */
Equation.prototype.addToWlambda = function(deltalambda){
    var bi = this.bodyA,
        bj = this.bodyB,
        temp = addToWlambda_temp,
        Gi = addToWlambda_Gi,
        Gj = addToWlambda_Gj,
        ri = addToWlambda_ri,
        rj = addToWlambda_rj,
        invMassi = getBodyInvMass(bi),
        invMassj = getBodyInvMass(bj),
        invIi = getBodyInvInertia(bi),
        invIj = getBodyInvInertia(bj),
        Mdiag = addToWlambda_Mdiag,
        G = this.G;

    Gi[0] = G[0];
    Gi[1] = G[1];
    Gj[0] = G[3];
    Gj[1] = G[4];

    // Add to linear velocity
    // v_lambda += inv(M) * delta_lamba * G
    vec2.scale(temp, Gi, invMassi*deltalambda);
    vec2.add( bi.vlambda, bi.vlambda, temp);
    // This impulse is in the offset frame
    // Also add contribution to angular
    //bi.wlambda -= vec2.crossLength(temp,ri);
    bi.wlambda += invIi * G[2] * deltalambda;


    vec2.scale(temp, Gj, invMassj*deltalambda);
    vec2.add( bj.vlambda, bj.vlambda, temp);
    //bj.wlambda -= vec2.crossLength(temp,rj);
    bj.wlambda += invIj * G[5] * deltalambda;
};

/**
 * Compute the denominator part of the SPOOK equation: C = G*inv(M)*G' + eps
 * @method computeInvC
 * @param  {Number} eps
 * @return {Number}
 */
Equation.prototype.computeInvC = function(eps){
    return 1.0 / (this.computeGiMGt() + eps);
};

},{"../math/vec2":30,"../objects/Body":31,"../utils/Utils":47}],23:[function(require,module,exports){
var vec2 = require('../math/vec2')
,   Equation = require('./Equation')
,   Utils = require('../utils/Utils');

module.exports = FrictionEquation;

/**
 * Constrains the slipping in a contact along a tangent
 *
 * @class FrictionEquation
 * @constructor
 * @param {Body} bodyA
 * @param {Body} bodyB
 * @param {Number} slipForce
 * @extends Equation
 */
function FrictionEquation(bodyA, bodyB, slipForce){
    Equation.call(this, bodyA, bodyB, -slipForce, slipForce);

    /**
     * Relative vector from center of body A to the contact point, world oriented.
     * @property contactPointA
     * @type {Array}
     */
    this.contactPointA = vec2.create();

    /**
     * Relative vector from center of body B to the contact point, world oriented.
     * @property contactPointB
     * @type {Array}
     */
    this.contactPointB = vec2.create();

    /**
     * Tangent vector that the friction force will act along. World oriented.
     * @property t
     * @type {Array}
     */
    this.t = vec2.create();

    /**
     * A ContactEquation connected to this friction. The contact equation can be used to rescale the max force for the friction.
     * @property contactEquation
     * @type {ContactEquation}
     */
    this.contactEquation = null;

    /**
     * The shape in body i that triggered this friction.
     * @property shapeA
     * @type {Shape}
     * @todo Needed? The shape can be looked up via contactEquation.shapeA...
     */
    this.shapeA = null;

    /**
     * The shape in body j that triggered this friction.
     * @property shapeB
     * @type {Shape}
     * @todo Needed? The shape can be looked up via contactEquation.shapeB...
     */
    this.shapeB = null;

    /**
     * The friction coefficient to use.
     * @property frictionCoefficient
     * @type {Number}
     */
    this.frictionCoefficient = 0.3;
}
FrictionEquation.prototype = new Equation();
FrictionEquation.prototype.constructor = FrictionEquation;

/**
 * Set the slipping condition for the constraint. The friction force cannot be
 * larger than this value.
 * @method setSlipForce
 * @param  {Number} slipForce
 */
FrictionEquation.prototype.setSlipForce = function(slipForce){
    this.maxForce = slipForce;
    this.minForce = -slipForce;
};

/**
 * Get the max force for the constraint.
 * @method getSlipForce
 * @return {Number}
 */
FrictionEquation.prototype.getSlipForce = function(){
    return this.maxForce;
};

FrictionEquation.prototype.computeB = function(a,b,h){
    var bi = this.bodyA,
        bj = this.bodyB,
        ri = this.contactPointA,
        rj = this.contactPointB,
        t = this.t,
        G = this.G;

    // G = [-t -rixt t rjxt]
    // And remember, this is a pure velocity constraint, g is always zero!
    G[0] = -t[0];
    G[1] = -t[1];
    G[2] = -vec2.crossLength(ri,t);
    G[3] = t[0];
    G[4] = t[1];
    G[5] = vec2.crossLength(rj,t);

    var GW = this.computeGW(),
        GiMf = this.computeGiMf();

    var B = /* - g * a  */ - GW * b - h*GiMf;

    return B;
};

},{"../math/vec2":30,"../utils/Utils":47,"./Equation":22}],24:[function(require,module,exports){
var Equation = require("./Equation"),
    vec2 = require('../math/vec2');

module.exports = RotationalLockEquation;

/**
 * Locks the relative angle between two bodies. The constraint tries to keep the dot product between two vectors, local in each body, to zero. The local angle in body i is a parameter.
 *
 * @class RotationalLockEquation
 * @constructor
 * @extends Equation
 * @param {Body} bodyA
 * @param {Body} bodyB
 * @param {Object} [options]
 * @param {Number} [options.angle] Angle to add to the local vector in body i.
 */
function RotationalLockEquation(bodyA, bodyB, options){
    options = options || {};
    Equation.call(this, bodyA, bodyB, -Number.MAX_VALUE, Number.MAX_VALUE);
    this.angle = options.angle || 0;

    var G = this.G;
    G[2] =  1;
    G[5] = -1;
}
RotationalLockEquation.prototype = new Equation();
RotationalLockEquation.prototype.constructor = RotationalLockEquation;

var worldVectorA = vec2.create(),
    worldVectorB = vec2.create(),
    xAxis = vec2.fromValues(1,0),
    yAxis = vec2.fromValues(0,1);
RotationalLockEquation.prototype.computeGq = function(){
    vec2.rotate(worldVectorA,xAxis,this.bodyA.angle+this.angle);
    vec2.rotate(worldVectorB,yAxis,this.bodyB.angle);
    return vec2.dot(worldVectorA,worldVectorB);
};

},{"../math/vec2":30,"./Equation":22}],25:[function(require,module,exports){
var Equation = require("./Equation"),
    vec2 = require('../math/vec2');

module.exports = RotationalVelocityEquation;

/**
 * Syncs rotational velocity of two bodies, or sets a relative velocity (motor).
 *
 * @class RotationalVelocityEquation
 * @constructor
 * @extends Equation
 * @param {Body} bodyA
 * @param {Body} bodyB
 */
function RotationalVelocityEquation(bodyA, bodyB){
    Equation.call(this, bodyA, bodyB, -Number.MAX_VALUE, Number.MAX_VALUE);
    this.relativeVelocity = 1;
    this.ratio = 1;
}
RotationalVelocityEquation.prototype = new Equation();
RotationalVelocityEquation.prototype.constructor = RotationalVelocityEquation;
RotationalVelocityEquation.prototype.computeB = function(a,b,h){
    var G = this.G;
    G[2] = -1;
    G[5] = this.ratio;

    var GiMf = this.computeGiMf();
    var GW = this.computeGW();
    var B = - GW * b - h*GiMf;

    return B;
};

},{"../math/vec2":30,"./Equation":22}],26:[function(require,module,exports){
/**
 * Base class for objects that dispatches events.
 * @class EventEmitter
 * @constructor
 */
var EventEmitter = function () {}

module.exports = EventEmitter;

EventEmitter.prototype = {
    constructor: EventEmitter,

    /**
     * Add an event listener
     * @method on
     * @param  {String} type
     * @param  {Function} listener
     * @return {EventEmitter} The self object, for chainability.
     */
    on: function ( type, listener, context ) {
        listener.context = context || this;
        if ( this._listeners === undefined ) this._listeners = {};
        var listeners = this._listeners;
        if ( listeners[ type ] === undefined ) {
            listeners[ type ] = [];
        }
        if ( listeners[ type ].indexOf( listener ) === - 1 ) {
            listeners[ type ].push( listener );
        }
        return this;
    },

    /**
     * Check if an event listener is added
     * @method has
     * @param  {String} type
     * @param  {Function} listener
     * @return {Boolean}
     */
    has: function ( type, listener ) {
        if ( this._listeners === undefined ) return false;
        var listeners = this._listeners;
        if(listener){
            if ( listeners[ type ] !== undefined && listeners[ type ].indexOf( listener ) !== - 1 ) {
                return true;
            }
        } else {
            if ( listeners[ type ] !== undefined ) {
                return true;
            }
        }

        return false;
    },

    /**
     * Remove an event listener
     * @method off
     * @param  {String} type
     * @param  {Function} listener
     * @return {EventEmitter} The self object, for chainability.
     */
    off: function ( type, listener ) {
        if ( this._listeners === undefined ) return this;
        var listeners = this._listeners;
        var index = listeners[ type ].indexOf( listener );
        if ( index !== - 1 ) {
            listeners[ type ].splice( index, 1 );
        }
        return this;
    },

    /**
     * Emit an event.
     * @method emit
     * @param  {Object} event
     * @param  {String} event.type
     * @return {EventEmitter} The self object, for chainability.
     */
    emit: function ( event ) {
        if ( this._listeners === undefined ) return this;
        var listeners = this._listeners;
        var listenerArray = listeners[ event.type ];
        if ( listenerArray !== undefined ) {
            event.target = this;
            for ( var i = 0, l = listenerArray.length; i < l; i ++ ) {
                var listener = listenerArray[ i ];
                listener.call( listener.context, event );
            }
        }
        return this;
    }
};

},{}],27:[function(require,module,exports){
var Material = require('./Material');
var Equation = require('../equations/Equation');

module.exports = ContactMaterial;

/**
 * Defines what happens when two materials meet, such as what friction coefficient to use. You can also set other things such as restitution, surface velocity and constraint parameters.
 * @class ContactMaterial
 * @constructor
 * @param {Material} materialA
 * @param {Material} materialB
 * @param {Object}   [options]
 * @param {Number}   [options.friction=0.3]       Friction coefficient.
 * @param {Number}   [options.restitution=0]      Restitution coefficient aka "bounciness".
 * @param {Number}   [options.stiffness]          ContactEquation stiffness.
 * @param {Number}   [options.relaxation]         ContactEquation relaxation.
 * @param {Number}   [options.frictionStiffness]  FrictionEquation stiffness.
 * @param {Number}   [options.frictionRelaxation] FrictionEquation relaxation.
 * @param {Number}   [options.surfaceVelocity=0]  Surface velocity.
 * @author schteppe
 */
function ContactMaterial(materialA, materialB, options){
    options = options || {};

    if(!(materialA instanceof Material) || !(materialB instanceof Material))
        throw new Error("First two arguments must be Material instances.");

    /**
     * The contact material identifier
     * @property id
     * @type {Number}
     */
    this.id = ContactMaterial.idCounter++;

    /**
     * First material participating in the contact material
     * @property materialA
     * @type {Material}
     */
    this.materialA = materialA;

    /**
     * Second material participating in the contact material
     * @property materialB
     * @type {Material}
     */
    this.materialB = materialB;

    /**
     * Friction to use in the contact of these two materials
     * @property friction
     * @type {Number}
     */
    this.friction    =  typeof(options.friction)    !== "undefined" ?   Number(options.friction)    : 0.3;

    /**
     * Restitution to use in the contact of these two materials
     * @property restitution
     * @type {Number}
     */
    this.restitution =  typeof(options.restitution) !== "undefined" ?   Number(options.restitution) : 0.0;

    /**
     * Stiffness of the resulting ContactEquation that this ContactMaterial generate
     * @property stiffness
     * @type {Number}
     */
    this.stiffness =            typeof(options.stiffness)           !== "undefined" ?   Number(options.stiffness)   : Equation.DEFAULT_STIFFNESS;

    /**
     * Relaxation of the resulting ContactEquation that this ContactMaterial generate
     * @property relaxation
     * @type {Number}
     */
    this.relaxation =           typeof(options.relaxation)          !== "undefined" ?   Number(options.relaxation)  : Equation.DEFAULT_RELAXATION;

    /**
     * Stiffness of the resulting FrictionEquation that this ContactMaterial generate
     * @property frictionStiffness
     * @type {Number}
     */
    this.frictionStiffness =    typeof(options.frictionStiffness)   !== "undefined" ?   Number(options.frictionStiffness)   : Equation.DEFAULT_STIFFNESS;

    /**
     * Relaxation of the resulting FrictionEquation that this ContactMaterial generate
     * @property frictionRelaxation
     * @type {Number}
     */
    this.frictionRelaxation =   typeof(options.frictionRelaxation)  !== "undefined" ?   Number(options.frictionRelaxation)  : Equation.DEFAULT_RELAXATION;

    /**
     * Will add surface velocity to this material. If bodyA rests on top if bodyB, and the surface velocity is positive, bodyA will slide to the right.
     * @property {Number} surfaceVelocity
     */
    this.surfaceVelocity = typeof(options.surfaceVelocity)    !== "undefined" ?   Number(options.surfaceVelocity)    : 0;
}

ContactMaterial.idCounter = 0;

},{"../equations/Equation":22,"./Material":28}],28:[function(require,module,exports){
module.exports = Material;

/**
 * Defines a physics material.
 * @class Material
 * @constructor
 * @param string name
 * @author schteppe
 */
function Material(){
    /**
     * The material identifier
     * @property id
     * @type {Number}
     */
    this.id = Material.idCounter++;
};

Material.idCounter = 0;

},{}],29:[function(require,module,exports){

    /*
        PolyK library
        url: http://polyk.ivank.net
        Released under MIT licence.

        Copyright (c) 2012 Ivan Kuckir

        Permission is hereby granted, free of charge, to any person
        obtaining a copy of this software and associated documentation
        files (the "Software"), to deal in the Software without
        restriction, including without limitation the rights to use,
        copy, modify, merge, publish, distribute, sublicense, and/or sell
        copies of the Software, and to permit persons to whom the
        Software is furnished to do so, subject to the following
        conditions:

        The above copyright notice and this permission notice shall be
        included in all copies or substantial portions of the Software.

        THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
        EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
        OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
        NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
        HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
        WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
        FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
        OTHER DEALINGS IN THE SOFTWARE.
    */

    var PolyK = {};

    /*
        Is Polygon self-intersecting?

        O(n^2)
    */
    /*
    PolyK.IsSimple = function(p)
    {
        var n = p.length>>1;
        if(n<4) return true;
        var a1 = new PolyK._P(), a2 = new PolyK._P();
        var b1 = new PolyK._P(), b2 = new PolyK._P();
        var c = new PolyK._P();

        for(var i=0; i<n; i++)
        {
            a1.x = p[2*i  ];
            a1.y = p[2*i+1];
            if(i==n-1)  { a2.x = p[0    ];  a2.y = p[1    ]; }
            else        { a2.x = p[2*i+2];  a2.y = p[2*i+3]; }

            for(var j=0; j<n; j++)
            {
                if(Math.abs(i-j) < 2) continue;
                if(j==n-1 && i==0) continue;
                if(i==n-1 && j==0) continue;

                b1.x = p[2*j  ];
                b1.y = p[2*j+1];
                if(j==n-1)  { b2.x = p[0    ];  b2.y = p[1    ]; }
                else        { b2.x = p[2*j+2];  b2.y = p[2*j+3]; }

                if(PolyK._GetLineIntersection(a1,a2,b1,b2,c) != null) return false;
            }
        }
        return true;
    }

    PolyK.IsConvex = function(p)
    {
        if(p.length<6) return true;
        var l = p.length - 4;
        for(var i=0; i<l; i+=2)
            if(!PolyK._convex(p[i], p[i+1], p[i+2], p[i+3], p[i+4], p[i+5])) return false;
        if(!PolyK._convex(p[l  ], p[l+1], p[l+2], p[l+3], p[0], p[1])) return false;
        if(!PolyK._convex(p[l+2], p[l+3], p[0  ], p[1  ], p[2], p[3])) return false;
        return true;
    }
    */
    PolyK.GetArea = function(p)
    {
        if(p.length <6) return 0;
        var l = p.length - 2;
        var sum = 0;
        for(var i=0; i<l; i+=2)
            sum += (p[i+2]-p[i]) * (p[i+1]+p[i+3]);
        sum += (p[0]-p[l]) * (p[l+1]+p[1]);
        return - sum * 0.5;
    }
    /*
    PolyK.GetAABB = function(p)
    {
        var minx = Infinity;
        var miny = Infinity;
        var maxx = -minx;
        var maxy = -miny;
        for(var i=0; i<p.length; i+=2)
        {
            minx = Math.min(minx, p[i  ]);
            maxx = Math.max(maxx, p[i  ]);
            miny = Math.min(miny, p[i+1]);
            maxy = Math.max(maxy, p[i+1]);
        }
        return {x:minx, y:miny, width:maxx-minx, height:maxy-miny};
    }
    */

    PolyK.Triangulate = function(p)
    {
        var n = p.length>>1;
        if(n<3) return [];
        var tgs = [];
        var avl = [];
        for(var i=0; i<n; i++) avl.push(i);

        var i = 0;
        var al = n;
        while(al > 3)
        {
            var i0 = avl[(i+0)%al];
            var i1 = avl[(i+1)%al];
            var i2 = avl[(i+2)%al];

            var ax = p[2*i0],  ay = p[2*i0+1];
            var bx = p[2*i1],  by = p[2*i1+1];
            var cx = p[2*i2],  cy = p[2*i2+1];

            var earFound = false;
            if(PolyK._convex(ax, ay, bx, by, cx, cy))
            {
                earFound = true;
                for(var j=0; j<al; j++)
                {
                    var vi = avl[j];
                    if(vi==i0 || vi==i1 || vi==i2) continue;
                    if(PolyK._PointInTriangle(p[2*vi], p[2*vi+1], ax, ay, bx, by, cx, cy)) {earFound = false; break;}
                }
            }
            if(earFound)
            {
                tgs.push(i0, i1, i2);
                avl.splice((i+1)%al, 1);
                al--;
                i= 0;
            }
            else if(i++ > 3*al) break;      // no convex angles :(
        }
        tgs.push(avl[0], avl[1], avl[2]);
        return tgs;
    }
    /*
    PolyK.ContainsPoint = function(p, px, py)
    {
        var n = p.length>>1;
        var ax, ay, bx = p[2*n-2]-px, by = p[2*n-1]-py;
        var depth = 0;
        for(var i=0; i<n; i++)
        {
            ax = bx;  ay = by;
            bx = p[2*i  ] - px;
            by = p[2*i+1] - py;
            if(ay< 0 && by< 0) continue;    // both "up" or both "donw"
            if(ay>=0 && by>=0) continue;    // both "up" or both "donw"
            if(ax< 0 && bx< 0) continue;

            var lx = ax + (bx-ax)*(-ay)/(by-ay);
            if(lx>0) depth++;
        }
        return (depth & 1) == 1;
    }

    PolyK.Slice = function(p, ax, ay, bx, by)
    {
        if(PolyK.ContainsPoint(p, ax, ay) || PolyK.ContainsPoint(p, bx, by)) return [p.slice(0)];

        var a = new PolyK._P(ax, ay);
        var b = new PolyK._P(bx, by);
        var iscs = [];  // intersections
        var ps = [];    // points
        for(var i=0; i<p.length; i+=2) ps.push(new PolyK._P(p[i], p[i+1]));

        for(var i=0; i<ps.length; i++)
        {
            var isc = new PolyK._P(0,0);
            isc = PolyK._GetLineIntersection(a, b, ps[i], ps[(i+1)%ps.length], isc);

            if(isc)
            {
                isc.flag = true;
                iscs.push(isc);
                ps.splice(i+1,0,isc);
                i++;
            }
        }
        if(iscs.length == 0) return [p.slice(0)];
        var comp = function(u,v) {return PolyK._P.dist(a,u) - PolyK._P.dist(a,v); }
        iscs.sort(comp);

        var pgs = [];
        var dir = 0;
        while(iscs.length > 0)
        {
            var n = ps.length;
            var i0 = iscs[0];
            var i1 = iscs[1];
            var ind0 = ps.indexOf(i0);
            var ind1 = ps.indexOf(i1);
            var solved = false;

            if(PolyK._firstWithFlag(ps, ind0) == ind1) solved = true;
            else
            {
                i0 = iscs[1];
                i1 = iscs[0];
                ind0 = ps.indexOf(i0);
                ind1 = ps.indexOf(i1);
                if(PolyK._firstWithFlag(ps, ind0) == ind1) solved = true;
            }
            if(solved)
            {
                dir--;
                var pgn = PolyK._getPoints(ps, ind0, ind1);
                pgs.push(pgn);
                ps = PolyK._getPoints(ps, ind1, ind0);
                i0.flag = i1.flag = false;
                iscs.splice(0,2);
                if(iscs.length == 0) pgs.push(ps);
            }
            else { dir++; iscs.reverse(); }
            if(dir>1) break;
        }
        var result = [];
        for(var i=0; i<pgs.length; i++)
        {
            var pg = pgs[i];
            var npg = [];
            for(var j=0; j<pg.length; j++) npg.push(pg[j].x, pg[j].y);
            result.push(npg);
        }
        return result;
    }

    PolyK.Raycast = function(p, x, y, dx, dy, isc)
    {
        var l = p.length - 2;
        var tp = PolyK._tp;
        var a1 = tp[0], a2 = tp[1],
        b1 = tp[2], b2 = tp[3], c = tp[4];
        a1.x = x; a1.y = y;
        a2.x = x+dx; a2.y = y+dy;

        if(isc==null) isc = {dist:0, edge:0, norm:{x:0, y:0}, refl:{x:0, y:0}};
        isc.dist = Infinity;

        for(var i=0; i<l; i+=2)
        {
            b1.x = p[i  ];  b1.y = p[i+1];
            b2.x = p[i+2];  b2.y = p[i+3];
            var nisc = PolyK._RayLineIntersection(a1, a2, b1, b2, c);
            if(nisc) PolyK._updateISC(dx, dy, a1, b1, b2, c, i/2, isc);
        }
        b1.x = b2.x;  b1.y = b2.y;
        b2.x = p[0];  b2.y = p[1];
        var nisc = PolyK._RayLineIntersection(a1, a2, b1, b2, c);
        if(nisc) PolyK._updateISC(dx, dy, a1, b1, b2, c, p.length/2, isc);

        return (isc.dist != Infinity) ? isc : null;
    }

    PolyK.ClosestEdge = function(p, x, y, isc)
    {
        var l = p.length - 2;
        var tp = PolyK._tp;
        var a1 = tp[0],
        b1 = tp[2], b2 = tp[3], c = tp[4];
        a1.x = x; a1.y = y;

        if(isc==null) isc = {dist:0, edge:0, point:{x:0, y:0}, norm:{x:0, y:0}};
        isc.dist = Infinity;

        for(var i=0; i<l; i+=2)
        {
            b1.x = p[i  ];  b1.y = p[i+1];
            b2.x = p[i+2];  b2.y = p[i+3];
            PolyK._pointLineDist(a1, b1, b2, i>>1, isc);
        }
        b1.x = b2.x;  b1.y = b2.y;
        b2.x = p[0];  b2.y = p[1];
        PolyK._pointLineDist(a1, b1, b2, l>>1, isc);

        var idst = 1/isc.dist;
        isc.norm.x = (x-isc.point.x)*idst;
        isc.norm.y = (y-isc.point.y)*idst;
        return isc;
    }

    PolyK._pointLineDist = function(p, a, b, edge, isc)
    {
        var x = p.x, y = p.y, x1 = a.x, y1 = a.y, x2 = b.x, y2 = b.y;

        var A = x - x1;
        var B = y - y1;
        var C = x2 - x1;
        var D = y2 - y1;

        var dot = A * C + B * D;
        var len_sq = C * C + D * D;
        var param = dot / len_sq;

        var xx, yy;

        if (param < 0 || (x1 == x2 && y1 == y2)) {
            xx = x1;
            yy = y1;
        }
        else if (param > 1) {
            xx = x2;
            yy = y2;
        }
        else {
            xx = x1 + param * C;
            yy = y1 + param * D;
        }

        var dx = x - xx;
        var dy = y - yy;
        var dst = Math.sqrt(dx * dx + dy * dy);
        if(dst<isc.dist)
        {
            isc.dist = dst;
            isc.edge = edge;
            isc.point.x = xx;
            isc.point.y = yy;
        }
    }

    PolyK._updateISC = function(dx, dy, a1, b1, b2, c, edge, isc)
    {
        var nrl = PolyK._P.dist(a1, c);
        if(nrl<isc.dist)
        {
            var ibl = 1/PolyK._P.dist(b1, b2);
            var nx = -(b2.y-b1.y)*ibl;
            var ny =  (b2.x-b1.x)*ibl;
            var ddot = 2*(dx*nx+dy*ny);
            isc.dist = nrl;
            isc.norm.x = nx;
            isc.norm.y = ny;
            isc.refl.x = -ddot*nx+dx;
            isc.refl.y = -ddot*ny+dy;
            isc.edge = edge;
        }
    }

    PolyK._getPoints = function(ps, ind0, ind1)
    {
        var n = ps.length;
        var nps = [];
        if(ind1<ind0) ind1 += n;
        for(var i=ind0; i<= ind1; i++) nps.push(ps[i%n]);
        return nps;
    }

    PolyK._firstWithFlag = function(ps, ind)
    {
        var n = ps.length;
        while(true)
        {
            ind = (ind+1)%n;
            if(ps[ind].flag) return ind;
        }
    }
    */
    PolyK._PointInTriangle = function(px, py, ax, ay, bx, by, cx, cy)
    {
        var v0x = cx-ax;
        var v0y = cy-ay;
        var v1x = bx-ax;
        var v1y = by-ay;
        var v2x = px-ax;
        var v2y = py-ay;

        var dot00 = v0x*v0x+v0y*v0y;
        var dot01 = v0x*v1x+v0y*v1y;
        var dot02 = v0x*v2x+v0y*v2y;
        var dot11 = v1x*v1x+v1y*v1y;
        var dot12 = v1x*v2x+v1y*v2y;

        var invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
        var u = (dot11 * dot02 - dot01 * dot12) * invDenom;
        var v = (dot00 * dot12 - dot01 * dot02) * invDenom;

        // Check if point is in triangle
        return (u >= 0) && (v >= 0) && (u + v < 1);
    }
    /*
    PolyK._RayLineIntersection = function(a1, a2, b1, b2, c)
    {
        var dax = (a1.x-a2.x), dbx = (b1.x-b2.x);
        var day = (a1.y-a2.y), dby = (b1.y-b2.y);

        var Den = dax*dby - day*dbx;
        if (Den == 0) return null;  // parallel

        var A = (a1.x * a2.y - a1.y * a2.x);
        var B = (b1.x * b2.y - b1.y * b2.x);

        var I = c;
        var iDen = 1/Den;
        I.x = ( A*dbx - dax*B ) * iDen;
        I.y = ( A*dby - day*B ) * iDen;

        if(!PolyK._InRect(I, b1, b2)) return null;
        if((day>0 && I.y>a1.y) || (day<0 && I.y<a1.y)) return null;
        if((dax>0 && I.x>a1.x) || (dax<0 && I.x<a1.x)) return null;
        return I;
    }

    PolyK._GetLineIntersection = function(a1, a2, b1, b2, c)
    {
        var dax = (a1.x-a2.x), dbx = (b1.x-b2.x);
        var day = (a1.y-a2.y), dby = (b1.y-b2.y);

        var Den = dax*dby - day*dbx;
        if (Den == 0) return null;  // parallel

        var A = (a1.x * a2.y - a1.y * a2.x);
        var B = (b1.x * b2.y - b1.y * b2.x);

        var I = c;
        I.x = ( A*dbx - dax*B ) / Den;
        I.y = ( A*dby - day*B ) / Den;

        if(PolyK._InRect(I, a1, a2) && PolyK._InRect(I, b1, b2)) return I;
        return null;
    }

    PolyK._InRect = function(a, b, c)
    {
        if  (b.x == c.x) return (a.y>=Math.min(b.y, c.y) && a.y<=Math.max(b.y, c.y));
        if  (b.y == c.y) return (a.x>=Math.min(b.x, c.x) && a.x<=Math.max(b.x, c.x));

        if(a.x >= Math.min(b.x, c.x) && a.x <= Math.max(b.x, c.x)
        && a.y >= Math.min(b.y, c.y) && a.y <= Math.max(b.y, c.y))
        return true;
        return false;
    }
    */
    PolyK._convex = function(ax, ay, bx, by, cx, cy)
    {
        return (ay-by)*(cx-bx) + (bx-ax)*(cy-by) >= 0;
    }
    /*
    PolyK._P = function(x,y)
    {
        this.x = x;
        this.y = y;
        this.flag = false;
    }
    PolyK._P.prototype.toString = function()
    {
        return "Point ["+this.x+", "+this.y+"]";
    }
    PolyK._P.dist = function(a,b)
    {
        var dx = b.x-a.x;
        var dy = b.y-a.y;
        return Math.sqrt(dx*dx + dy*dy);
    }

    PolyK._tp = [];
    for(var i=0; i<10; i++) PolyK._tp.push(new PolyK._P(0,0));
        */

module.exports = PolyK;

},{}],30:[function(require,module,exports){
/**
 * The vec2 object from glMatrix, with some extensions and some removed methods. See http://glmatrix.net for full doc.
 * @class vec2
 */

var vec2 = require('../../build/vec2').vec2;

/**
 * Make a cross product and only return the z component
 * @method crossLength
 * @static
 * @param  {Float32Array} a
 * @param  {Float32Array} b
 * @return {Number}
 */
vec2.crossLength = function(a,b){
    return a[0] * b[1] - a[1] * b[0];
};

/**
 * Cross product between a vector and the Z component of a vector
 * @method crossVZ
 * @static
 * @param  {Float32Array} out
 * @param  {Float32Array} vec
 * @param  {Number} zcomp
 * @return {Number}
 */
vec2.crossVZ = function(out, vec, zcomp){
    vec2.rotate(out,vec,-Math.PI/2);// Rotate according to the right hand rule
    vec2.scale(out,out,zcomp);      // Scale with z
    return out;
};

/**
 * Cross product between a vector and the Z component of a vector
 * @method crossZV
 * @static
 * @param  {Float32Array} out
 * @param  {Number} zcomp
 * @param  {Float32Array} vec
 * @return {Number}
 */
vec2.crossZV = function(out, zcomp, vec){
    vec2.rotate(out,vec,Math.PI/2); // Rotate according to the right hand rule
    vec2.scale(out,out,zcomp);      // Scale with z
    return out;
};

/**
 * Rotate a vector by an angle
 * @method rotate
 * @static
 * @param  {Float32Array} out
 * @param  {Float32Array} a
 * @param  {Number} angle
 */
vec2.rotate = function(out,a,angle){
    var c = Math.cos(angle),
        s = Math.sin(angle),
        x = a[0],
        y = a[1];
    out[0] = c*x -s*y;
    out[1] = s*x +c*y;
};

/**
 * Rotate a vector 90 degrees clockwise
 * @method rotate90cw
 * @static
 * @param  {Float32Array} out
 * @param  {Float32Array} a
 * @param  {Number} angle
 */
vec2.rotate90cw = function(out, a) {
    out[0] = a[1];
    out[1] = -a[0];
};

/**
 * Transform a point position to local frame.
 * @method toLocalFrame
 * @param  {Array} out
 * @param  {Array} worldPoint
 * @param  {Array} framePosition
 * @param  {Number} frameAngle
 */
vec2.toLocalFrame = function(out, worldPoint, framePosition, frameAngle){
    vec2.copy(out, worldPoint);
    vec2.sub(out, out, framePosition);
    vec2.rotate(out, out, -frameAngle);
};

/**
 * Transform a point position to global frame.
 * @method toGlobalFrame
 * @param  {Array} out
 * @param  {Array} localPoint
 * @param  {Array} framePosition
 * @param  {Number} frameAngle
 */
vec2.toGlobalFrame = function(out, localPoint, framePosition, frameAngle){
    vec2.copy(out, localPoint);
    vec2.rotate(out, out, frameAngle);
    vec2.add(out, out, framePosition);
};

/**
 * Compute centroid of a triangle spanned by vectors a,b,c. See http://easycalculation.com/analytical/learn-centroid.php
 * @method centroid
 * @static
 * @param  {Float32Array} out
 * @param  {Float32Array} a
 * @param  {Float32Array} b
 * @param  {Float32Array} c
 * @return  {Float32Array} The out object
 */
vec2.centroid = function(out, a, b, c){
    vec2.add(out, a, b);
    vec2.add(out, out, c);
    vec2.scale(out, out, 1/3);
    return out;
};

// Export everything
module.exports = vec2;

},{"../../build/vec2":1}],31:[function(require,module,exports){
var vec2 = require('../math/vec2')
,   decomp = require('poly-decomp')
,   Convex = require('../shapes/Convex')
,   AABB = require('../collision/AABB')
,   EventEmitter = require('../events/EventEmitter')

module.exports = Body;

/**
 * A rigid body. Has got a center of mass, position, velocity and a number of
 * shapes that are used for collisions.
 *
 * @class Body
 * @constructor
 * @extends EventEmitter
 * @param {Object}              [options]
 * @param {Number}              [options.mass=0]    A number >= 0. If zero, the .motionState will be set to Body.STATIC.
 * @param {Array}               [options.position]
 * @param {Array}               [options.velocity]
 * @param {Number}              [options.angle=0]
 * @param {Number}              [options.angularVelocity=0]
 * @param {Array}               [options.force]
 * @param {Number}              [options.angularForce=0]
 * @param {Number}              [options.fixedRotation=false]
 */
function Body(options){
    options = options || {};

    EventEmitter.call(this);

    /**
     * The body identifyer
     * @property id
     * @type {Number}
     */
    this.id = ++Body._idCounter;

    /**
     * The world that this body is added to. This property is set to NULL if the body is not added to any world.
     * @property world
     * @type {World}
     */
    this.world = null;

    /**
     * The shapes of the body. The local transform of the shape in .shapes[i] is
     * defined by .shapeOffsets[i] and .shapeAngles[i].
     *
     * @property shapes
     * @type {Array}
     */
    this.shapes = [];

    /**
     * The local shape offsets, relative to the body center of mass. This is an
     * array of Array.
     * @property shapeOffsets
     * @type {Array}
     */
    this.shapeOffsets = [];

    /**
     * The body-local shape angle transforms. This is an array of numbers (angles).
     * @property shapeAngles
     * @type {Array}
     */
    this.shapeAngles = [];

    /**
     * The mass of the body.
     * @property mass
     * @type {number}
     */
    this.mass = options.mass || 0;

    /**
     * The inverse mass of the body.
     * @property invMass
     * @type {number}
     */
    this.invMass = 0;

    /**
     * The inertia of the body around the Z axis.
     * @property inertia
     * @type {number}
     */
    this.inertia = 0;

    /**
     * The inverse inertia of the body.
     * @property invInertia
     * @type {number}
     */
    this.invInertia = 0;

    /**
     * Set to true if you want to fix the rotation of the body.
     * @property fixedRotation
     * @type {Boolean}
     */
    this.fixedRotation = !!options.fixedRotation || false;

    /**
     * The position of the body
     * @property position
     * @type {Array}
     */
    this.position = vec2.fromValues(0,0);
    if(options.position){
        vec2.copy(this.position, options.position);
    }

    /**
     * The interpolated position of the body.
     * @property interpolatedPosition
     * @type {Array}
     */
    this.interpolatedPosition = vec2.fromValues(0,0);

    /**
     * The interpolated angle of the body.
     * @property interpolatedAngle
     * @type {Number}
     */
    this.interpolatedAngle = 0;

    /**
     * The previous position of the body.
     * @property previousPosition
     * @type {Array}
     */
    this.previousPosition = vec2.fromValues(0,0);

    /**
     * The previous angle of the body.
     * @property previousAngle
     * @type {Number}
     */
    this.previousAngle = 0;

    /**
     * The velocity of the body
     * @property velocity
     * @type {Array}
     */
    this.velocity = vec2.fromValues(0,0);
    if(options.velocity){
        vec2.copy(this.velocity, options.velocity);
    }

    /**
     * Constraint velocity that was added to the body during the last step.
     * @property vlambda
     * @type {Array}
     */
    this.vlambda = vec2.fromValues(0,0);

    /**
     * Angular constraint velocity that was added to the body during last step.
     * @property wlambda
     * @type {Array}
     */
    this.wlambda = 0;

    /**
     * The angle of the body, in radians.
     * @property angle
     * @type {number}
     * @example
     *     // The angle property is not normalized to the interval 0 to 2*pi, it can be any value.
     *     // If you need a value between 0 and 2*pi, use the following function to normalize it.
     *     function normalizeAngle(angle){
     *         angle = angle % (2*Math.PI);
     *         if(angle < 0){
     *             angle += (2*Math.PI);
     *         }
     *         return angle;
     *     }
     */
    this.angle = options.angle || 0;

    /**
     * The angular velocity of the body, in radians per second.
     * @property angularVelocity
     * @type {number}
     */
    this.angularVelocity = options.angularVelocity || 0;

    /**
     * The force acting on the body. Since the body force (and {{#crossLink "Body/angularForce:property"}}{{/crossLink}}) will be zeroed after each step, so you need to set the force before each step.
     * @property force
     * @type {Array}
     *
     * @example
     *     // This produces a forcefield of 1 Newton in the positive x direction.
     *     for(var i=0; i<numSteps; i++){
     *         body.force[0] = 1;
     *         world.step(1/60);
     *     }
     *
     * @example
     *     // This will apply a rotational force on the body
     *     for(var i=0; i<numSteps; i++){
     *         body.angularForce = -3;
     *         world.step(1/60);
     *     }
     */
    this.force = vec2.create();
    if(options.force) vec2.copy(this.force, options.force);

    /**
     * The angular force acting on the body. See {{#crossLink "Body/force:property"}}{{/crossLink}}.
     * @property angularForce
     * @type {number}
     */
    this.angularForce = options.angularForce || 0;

    /**
     * The linear damping acting on the body in the velocity direction. Should be a value between 0 and 1.
     * @property damping
     * @type {Number}
     * @default 0.1
     */
    this.damping = typeof(options.damping)=="number" ? options.damping : 0.1;

    /**
     * The angular force acting on the body. Should be a value between 0 and 1.
     * @property angularDamping
     * @type {Number}
     * @default 0.1
     */
    this.angularDamping = typeof(options.angularDamping)=="number" ? options.angularDamping : 0.1;

    /**
     * The type of motion this body has. Should be one of: {{#crossLink "Body/STATIC:property"}}Body.STATIC{{/crossLink}}, {{#crossLink "Body/DYNAMIC:property"}}Body.DYNAMIC{{/crossLink}} and {{#crossLink "Body/KINEMATIC:property"}}Body.KINEMATIC{{/crossLink}}.
     *
     * * Static bodies do not move, and they do not respond to forces or collision.
     * * Dynamic bodies body can move and respond to collisions and forces.
     * * Kinematic bodies only moves according to its .velocity, and does not respond to collisions or force.
     *
     * @property motionState
     * @type {number}
     *
     * @example
     *     // This body will move and interact with other bodies
     *     var dynamicBody = new Body({
     *         mass : 1  // If mass is nonzero, the body becomes dynamic automatically
     *     });
     *     dynamicBody.motionState == Body.DYNAMIC // true
     *
     * @example
     *     // This body will not move at all
     *     var staticBody = new Body({
     *         mass : 0 // Will make the body static
     *     });
     *     staticBody.motionState == Body.STATIC // true
     *
     * @example
     *     // This body will only move if you change its velocity
     *     var kinematicBody = new Body();
     *     kinematicBody.motionState = Body.KINEMATIC;
     */
    this.motionState = this.mass === 0 ? Body.STATIC : Body.DYNAMIC;

    /**
     * Bounding circle radius.
     * @property boundingRadius
     * @type {Number}
     */
    this.boundingRadius = 0;

    /**
     * Bounding box of this body.
     * @property aabb
     * @type {AABB}
     */
    this.aabb = new AABB();

    /**
     * Indicates if the AABB needs update. Update it with {{#crossLink "Body/updateAABB:method"}}.updateAABB(){{/crossLink}}.
     * @property aabbNeedsUpdate
     * @type {Boolean}
     * @see updateAABB
     *
     * @example
     *     // Force update the AABB
     *     body.aabbNeedsUpdate = true;
     *     body.updateAABB();
     *     console.log(body.aabbNeedsUpdate); // false
     */
    this.aabbNeedsUpdate = true;

    /**
     * If true, the body will automatically fall to sleep. Note that you need to enable sleeping in the {{#crossLink "World"}}{{/crossLink}} before anything will happen.
     * @property allowSleep
     * @type {Boolean}
     * @default true
     */
    this.allowSleep = true;

    this.wantsToSleep = false;

    /**
     * One of {{#crossLink "Body/AWAKE:property"}}Body.AWAKE{{/crossLink}}, {{#crossLink "Body/SLEEPY:property"}}Body.SLEEPY{{/crossLink}} and {{#crossLink "Body/SLEEPING:property"}}Body.SLEEPING{{/crossLink}}.
     *
     * The body is initially Body.AWAKE. If its velocity norm is below .sleepSpeedLimit, the sleepState will become Body.SLEEPY. If the body continues to be Body.SLEEPY for .sleepTimeLimit seconds, it will fall asleep (Body.SLEEPY).
     *
     * @property sleepState
     * @type {Number}
     * @default Body.AWAKE
     */
    this.sleepState = Body.AWAKE;

    /**
     * If the speed (the norm of the velocity) is smaller than this value, the body is considered sleepy.
     * @property sleepSpeedLimit
     * @type {Number}
     * @default 0.2
     */
    this.sleepSpeedLimit = 0.2;

    /**
     * If the body has been sleepy for this sleepTimeLimit seconds, it is considered sleeping.
     * @property sleepTimeLimit
     * @type {Number}
     * @default 1
     */
    this.sleepTimeLimit = 1;

    /**
     * Gravity scaling factor. If you want the body to ignore gravity, set this to zero. If you want to reverse gravity, set it to -1.
     * @property {Number} gravityScale
     * @default 1
     */
    this.gravityScale = 1;

    /**
     * The last time when the body went to SLEEPY state.
     * @property {Number} timeLastSleepy
     * @private
     */
    this.timeLastSleepy = 0;

    this.concavePath = null;

    this.lastDampingScale = 1;
    this.lastAngularDampingScale = 1;
    this.lastDampingTimeStep = -1;

    this._wakeUpAfterNarrowphase = false;

    this.updateMassProperties();
}
Body.prototype = new EventEmitter();

Body._idCounter = 0;

/**
 * Set the total density of the body
 * @method setDensity
 */
Body.prototype.setDensity = function(density) {
    var totalArea = this.getArea();
    this.mass = totalArea * density;
    this.updateMassProperties();
};

/**
 * Get the total area of all shapes in the body
 * @method getArea
 * @return {Number}
 */
Body.prototype.getArea = function() {
    var totalArea = 0;
    for(var i=0; i<this.shapes.length; i++){
        totalArea += this.shapes[i].area;
    }
    return totalArea;
};

var shapeAABB = new AABB(),
    tmp = vec2.create();

/**
 * Updates the AABB of the Body
 * @method updateAABB
 */
Body.prototype.updateAABB = function() {
    var shapes = this.shapes,
        shapeOffsets = this.shapeOffsets,
        shapeAngles = this.shapeAngles,
        N = shapes.length;

    for(var i=0; i!==N; i++){
        var shape = shapes[i],
            offset = tmp,
            angle = shapeAngles[i] + this.angle;

        // Get shape world offset
        vec2.rotate(offset,shapeOffsets[i],this.angle);
        vec2.add(offset,offset,this.position);

        // Get shape AABB
        shape.computeAABB(shapeAABB,offset,angle);

        if(i===0)
            this.aabb.copy(shapeAABB);
        else
            this.aabb.extend(shapeAABB);
    }

    this.aabbNeedsUpdate = false;
};

/**
 * Update the bounding radius of the body. Should be done if any of the shapes
 * are changed.
 * @method updateBoundingRadius
 */
Body.prototype.updateBoundingRadius = function(){
    var shapes = this.shapes,
        shapeOffsets = this.shapeOffsets,
        N = shapes.length,
        radius = 0;

    for(var i=0; i!==N; i++){
        var shape = shapes[i],
            offset = vec2.length(shapeOffsets[i]),
            r = shape.boundingRadius;
        if(offset + r > radius){
            radius = offset + r;
        }
    }

    this.boundingRadius = radius;
};

/**
 * Add a shape to the body. You can pass a local transform when adding a shape,
 * so that the shape gets an offset and angle relative to the body center of mass.
 * Will automatically update the mass properties and bounding radius.
 *
 * @method addShape
 * @param  {Shape}              shape
 * @param  {Array} [offset] Local body offset of the shape.
 * @param  {Number}             [angle]  Local body angle.
 *
 * @example
 *     var body = new Body(),
 *         shape = new Circle();
 *
 *     // Add the shape to the body, positioned in the center
 *     body.addShape(shape);
 *
 *     // Add another shape to the body, positioned 1 unit length from the body center of mass along the local x-axis.
 *     body.addShape(shape,[1,0]);
 *
 *     // Add another shape to the body, positioned 1 unit length from the body center of mass along the local y-axis, and rotated 90 degrees CCW.
 *     body.addShape(shape,[0,1],Math.PI/2);
 */
Body.prototype.addShape = function(shape,offset,angle){
    angle = angle || 0.0;

    // Copy the offset vector
    if(offset){
        offset = vec2.fromValues(offset[0],offset[1]);
    } else {
        offset = vec2.fromValues(0,0);
    }

    this.shapes      .push(shape);
    this.shapeOffsets.push(offset);
    this.shapeAngles .push(angle);
    this.updateMassProperties();
    this.updateBoundingRadius();

    this.aabbNeedsUpdate = true;
};

/**
 * Remove a shape
 * @method removeShape
 * @param  {Shape}  shape
 * @return {Boolean}       True if the shape was found and removed, else false.
 */
Body.prototype.removeShape = function(shape){
    var idx = this.shapes.indexOf(shape);

    if(idx !== -1){
        this.shapes.splice(idx,1);
        this.shapeOffsets.splice(idx,1);
        this.shapeAngles.splice(idx,1);
        this.aabbNeedsUpdate = true;
        return true;
    } else {
        return false;
    }
};

/**
 * Updates .inertia, .invMass, .invInertia for this Body. Should be called when
 * changing the structure or mass of the Body.
 *
 * @method updateMassProperties
 *
 * @example
 *     body.mass += 1;
 *     body.updateMassProperties();
 */
Body.prototype.updateMassProperties = function(){
    if(this.motionState === Body.STATIC || this.motionState === Body.KINEMATIC){

        this.mass = Number.MAX_VALUE;
        this.invMass = 0;
        this.inertia = Number.MAX_VALUE;
        this.invInertia = 0;

    } else {

        var shapes = this.shapes,
            N = shapes.length,
            m = this.mass / N,
            I = 0;

        if(!this.fixedRotation){
            for(var i=0; i<N; i++){
                var shape = shapes[i],
                    r2 = vec2.squaredLength(this.shapeOffsets[i]),
                    Icm = shape.computeMomentOfInertia(m);
                I += Icm + m*r2;
            }
            this.inertia = I;
            this.invInertia = I>0 ? 1/I : 0;

        } else {
            this.inertia = Number.MAX_VALUE;
            this.invInertia = 0;
        }

        // Inverse mass properties are easy
        this.invMass = 1/this.mass;// > 0 ? 1/this.mass : 0;
    }
};

var Body_applyForce_r = vec2.create();

/**
 * Apply force to a world point. This could for example be a point on the RigidBody surface. Applying force this way will add to Body.force and Body.angularForce.
 * @method applyForce
 * @param {Array} force The force to add.
 * @param {Array} worldPoint A world point to apply the force on.
 */
Body.prototype.applyForce = function(force,worldPoint){
    // Compute point position relative to the body center
    var r = Body_applyForce_r;
    vec2.sub(r,worldPoint,this.position);

    // Add linear force
    vec2.add(this.force,this.force,force);

    // Compute produced rotational force
    var rotForce = vec2.crossLength(r,force);

    // Add rotational force
    this.angularForce += rotForce;
};

/**
 * Transform a world point to local body frame.
 * @method toLocalFrame
 * @param  {Array} out          The vector to store the result in
 * @param  {Array} worldPoint   The input world vector
 */
Body.prototype.toLocalFrame = function(out, worldPoint){
    vec2.toLocalFrame(out, worldPoint, this.position, this.angle);
};

/**
 * Transform a local point to world frame.
 * @method toWorldFrame
 * @param  {Array} out          The vector to store the result in
 * @param  {Array} localPoint   The input local vector
 */
Body.prototype.toWorldFrame = function(out, localPoint){
    vec2.toGlobalFrame(out, localPoint, this.position, this.angle);
};

/**
 * Reads a polygon shape path, and assembles convex shapes from that and puts them at proper offset points.
 * @method fromPolygon
 * @param {Array} path An array of 2d vectors, e.g. [[0,0],[0,1],...] that resembles a concave or convex polygon. The shape must be simple and without holes.
 * @param {Object} [options]
 * @param {Boolean} [options.optimalDecomp=false]   Set to true if you need optimal decomposition. Warning: very slow for polygons with more than 10 vertices.
 * @param {Boolean} [options.skipSimpleCheck=false] Set to true if you already know that the path is not intersecting itself.
 * @param {Boolean|Number} [options.removeCollinearPoints=false] Set to a number (angle threshold value) to remove collinear points, or false to keep all points.
 * @return {Boolean} True on success, else false.
 */
Body.prototype.fromPolygon = function(path,options){
    options = options || {};

    // Remove all shapes
    for(var i=this.shapes.length; i>=0; --i)
        this.removeShape(this.shapes[i]);

    var p = new decomp.Polygon();
    p.vertices = path;

    // Make it counter-clockwise
    p.makeCCW();

    if(typeof(options.removeCollinearPoints)=="number"){
        p.removeCollinearPoints(options.removeCollinearPoints);
    }

    // Check if any line segment intersects the path itself
    if(typeof(options.skipSimpleCheck) == "undefined"){
        if(!p.isSimple()) return false;
    }

    // Save this path for later
    this.concavePath = p.vertices.slice(0);
    for(var i=0; i<this.concavePath.length; i++){
        var v = [0,0];
        vec2.copy(v,this.concavePath[i]);
        this.concavePath[i] = v;
    }

    // Slow or fast decomp?
    var convexes;
    if(options.optimalDecomp)   convexes = p.decomp();
    else                        convexes = p.quickDecomp();

    var cm = vec2.create();

    // Add convexes
    for(var i=0; i!==convexes.length; i++){
        // Create convex
        var c = new Convex(convexes[i].vertices);

        // Move all vertices so its center of mass is in the local center of the convex
        for(var j=0; j!==c.vertices.length; j++){
            var v = c.vertices[j];
            vec2.sub(v,v,c.centerOfMass);
        }

        vec2.scale(cm,c.centerOfMass,1);
        c.updateTriangles();
        c.updateCenterOfMass();
        c.updateBoundingRadius();

        // Add the shape
        this.addShape(c,cm);
    }

    this.adjustCenterOfMass();

    this.aabbNeedsUpdate = true;

    return true;
};

var adjustCenterOfMass_tmp1 = vec2.fromValues(0,0),
    adjustCenterOfMass_tmp2 = vec2.fromValues(0,0),
    adjustCenterOfMass_tmp3 = vec2.fromValues(0,0),
    adjustCenterOfMass_tmp4 = vec2.fromValues(0,0);

/**
 * Moves the shape offsets so their center of mass becomes the body center of mass.
 * @method adjustCenterOfMass
 */
Body.prototype.adjustCenterOfMass = function(){
    var offset_times_area = adjustCenterOfMass_tmp2,
        sum =               adjustCenterOfMass_tmp3,
        cm =                adjustCenterOfMass_tmp4,
        totalArea =         0;
    vec2.set(sum,0,0);

    for(var i=0; i!==this.shapes.length; i++){
        var s = this.shapes[i],
            offset = this.shapeOffsets[i];
        vec2.scale(offset_times_area,offset,s.area);
        vec2.add(sum,sum,offset_times_area);
        totalArea += s.area;
    }

    vec2.scale(cm,sum,1/totalArea);

    // Now move all shapes
    for(var i=0; i!==this.shapes.length; i++){
        var s = this.shapes[i],
            offset = this.shapeOffsets[i];

        // Offset may be undefined. Fix that.
        if(!offset){
            offset = this.shapeOffsets[i] = vec2.create();
        }

        vec2.sub(offset,offset,cm);
    }

    // Move the body position too
    vec2.add(this.position,this.position,cm);

    // And concave path
    for(var i=0; this.concavePath && i<this.concavePath.length; i++){
        vec2.sub(this.concavePath[i], this.concavePath[i], cm);
    }

    this.updateMassProperties();
    this.updateBoundingRadius();
};

/**
 * Sets the force on the body to zero.
 * @method setZeroForce
 */
Body.prototype.setZeroForce = function(){
    vec2.set(this.force,0.0,0.0);
    this.angularForce = 0.0;
};

Body.prototype.resetConstraintVelocity = function(){
    var b = this,
        vlambda = b.vlambda;
    vec2.set(vlambda,0,0);
    b.wlambda = 0;
};

Body.prototype.addConstraintVelocity = function(){
    var b = this,
        v = b.velocity;
    vec2.add( v, v, b.vlambda);
    b.angularVelocity += b.wlambda;
};

/**
 * Apply damping, see <a href="http://code.google.com/p/bullet/issues/detail?id=74">this</a> for details.
 * @method applyDamping
 * @param  {number} dt Current time step
 */
Body.prototype.applyDamping = function(dt){
    if(this.motionState === Body.DYNAMIC){ // Only for dynamic bodies

        // Since Math.pow generates garbage we check if we can reuse the scaling coefficient from last step
        if(dt !== this.lastDampingTimeStep){
            this.lastDampingScale =         Math.pow(1.0 - this.damping,dt);
            this.lastAngularDampingScale =  Math.pow(1.0 - this.angularDamping,dt);
            this.lastDampingTimeStep = dt;
        }

        var v = this.velocity;
        vec2.scale(v,v,this.lastDampingScale);
        this.angularVelocity *= this.lastAngularDampingScale;
    }
};

/**
 * Wake the body up. Normally you should not need this, as the body is automatically awoken at events such as collisions.
 * Sets the sleepState to {{#crossLink "Body/AWAKE:property"}}Body.AWAKE{{/crossLink}} and emits the wakeUp event if the body wasn't awake before.
 * @method wakeUp
 */
Body.prototype.wakeUp = function(){
    var s = this.sleepState;
    this.sleepState = Body.AWAKE;
    this.idleTime = 0;
    if(s !== Body.AWAKE){
        this.emit(Body.wakeUpEvent);
    }
};

/**
 * Force body sleep
 * @method sleep
 */
Body.prototype.sleep = function(){
    this.sleepState = Body.SLEEPING;
    this.angularVelocity = 0;
    this.angularForce = 0;
    vec2.set(this.velocity,0,0);
    vec2.set(this.force,0,0);
    this.emit(Body.sleepEvent);
};

//var velo2 = vec2.create();

/**
 * @method sleepTick
 * @param float time The world time in seconds
 * @brief Called every timestep to update internal sleep timer and change sleep state if needed.
 */
Body.prototype.sleepTick = function(time, dontSleep, dt){
    if(!this.allowSleep || this.motionState === Body.SLEEPING){
        return;
    }

    this.wantsToSleep = false;

    var sleepState = this.sleepState,
        speedSquared = vec2.squaredLength(this.velocity) + Math.pow(this.angularVelocity,2),
        speedLimitSquared = Math.pow(this.sleepSpeedLimit,2);

    // Add to idle time
    if(speedSquared >= speedLimitSquared){
        this.idleTime = 0;
        this.sleepState = Body.AWAKE;
    } else {
        this.idleTime += dt;
        this.sleepState = Body.SLEEPY;
    }
    if(this.idleTime > this.sleepTimeLimit){
        if(!dontSleep){
            this.sleep();
        } else {
            this.wantsToSleep = true;
        }
    }

    /*
    if(sleepState===Body.AWAKE && speedSquared < speedLimitSquared){
        this.sleepState = Body.SLEEPY; // Sleepy
        this.timeLastSleepy = time;
        this.emit(Body.sleepyEvent);
    } else if(sleepState===Body.SLEEPY && speedSquared >= speedLimitSquared){
        this.wakeUp(); // Wake up
    } else if(sleepState===Body.SLEEPY && (time - this.timeLastSleepy ) > this.sleepTimeLimit){
        this.wantsToSleep = true;
        if(!dontSleep){
            this.sleep();
        }
    }
    */
};

Body.prototype.getVelocityFromPosition = function(store, timeStep){
    store = store || vec2.create();
    vec2.sub(store, this.position, this.previousPosition);
    vec2.scale(store, store, 1/timeStep);
    return store;
};
Body.prototype.getAngularVelocityFromPosition = function(timeStep){
    return (this.angle - this.previousAngle) / timeStep;
};

/**
 * @event sleepy
 */
Body.sleepyEvent = {
    type: "sleepy"
};

/**
 * @event sleep
 */
Body.sleepEvent = {
    type: "sleep"
};

/**
 * @event wakeup
 */
Body.wakeUpEvent = {
    type: "wakeup"
};

/**
 * Dynamic body.
 * @property DYNAMIC
 * @type {Number}
 * @static
 */
Body.DYNAMIC = 1;

/**
 * Static body.
 * @property STATIC
 * @type {Number}
 * @static
 */
Body.STATIC = 2;

/**
 * Kinematic body.
 * @property KINEMATIC
 * @type {Number}
 * @static
 */
Body.KINEMATIC = 4;

/**
 * @property AWAKE
 * @type {Number}
 * @static
 */
Body.AWAKE = 0;

/**
 * @property SLEEPY
 * @type {Number}
 * @static
 */
Body.SLEEPY = 1;

/**
 * @property SLEEPING
 * @type {Number}
 * @static
 */
Body.SLEEPING = 2;


},{"../collision/AABB":8,"../events/EventEmitter":26,"../math/vec2":30,"../shapes/Convex":36,"poly-decomp":6}],32:[function(require,module,exports){
var vec2 = require('../math/vec2');
var Utils = require('../utils/Utils');

module.exports = Spring;

/**
 * A spring, connecting two bodies. The Spring explicitly adds force and angularForce to the bodies and does therefore not put load on the solver.
 *
 * @class Spring
 * @constructor
 * @param {Body} bodyA
 * @param {Body} bodyB
 * @param {Object} [options]
 * @param {number} [options.restLength=1]   A number > 0. Default: 1
 * @param {number} [options.stiffness=100]  Spring constant (see Hookes Law). A number >= 0.
 * @param {number} [options.damping=1]      A number >= 0. Default: 1
 * @param {Array}  [options.localAnchorA]   Where to hook the spring to body A, in local body coordinates. Defaults to the body center.
 * @param {Array}  [options.localAnchorB]
 * @param {Array}  [options.worldAnchorA]   Where to hook the spring to body A, in world coordinates. Overrides the option "localAnchorA" if given.
 * @param {Array}  [options.worldAnchorB]
 */
function Spring(bodyA,bodyB,options){
    options = Utils.defaults(options,{
        restLength: 1,
        stiffness: 100,
        damping: 1,
        localAnchorA: [0,0],
        localAnchorB: [0,0],
    });

    /**
     * Rest length of the spring.
     * @property restLength
     * @type {number}
     */
    this.restLength = options.restLength;

    /**
     * Stiffness of the spring.
     * @property stiffness
     * @type {number}
     */
    this.stiffness = options.stiffness;

    /**
     * Damping of the spring.
     * @property damping
     * @type {number}
     */
    this.damping = options.damping;

    /**
     * First connected body.
     * @property bodyA
     * @type {Body}
     */
    this.bodyA = bodyA;

    /**
     * Second connected body.
     * @property bodyB
     * @type {Body}
     */
    this.bodyB = bodyB;

    /**
     * Anchor for bodyA in local bodyA coordinates.
     * @property localAnchorA
     * @type {Array}
     */
    this.localAnchorA = vec2.create();
    vec2.copy(this.localAnchorA, options.localAnchorA);

    /**
     * Anchor for bodyB in local bodyB coordinates.
     * @property localAnchorB
     * @type {Array}
     */
    this.localAnchorB = vec2.create();
    vec2.copy(this.localAnchorB, options.localAnchorB);

    if(options.worldAnchorA){
        this.setWorldAnchorA(options.worldAnchorA);
    }
    if(options.worldAnchorB){
        this.setWorldAnchorB(options.worldAnchorB);
    }
}

/**
 * Set the anchor point on body A, using world coordinates.
 * @method setWorldAnchorA
 * @param {Array} worldAnchorA
 */
Spring.prototype.setWorldAnchorA = function(worldAnchorA){
    this.bodyA.toLocalFrame(this.localAnchorA, worldAnchorA);
};

/**
 * Set the anchor point on body B, using world coordinates.
 * @method setWorldAnchorB
 * @param {Array} worldAnchorB
 */
Spring.prototype.setWorldAnchorB = function(worldAnchorB){
    this.bodyB.toLocalFrame(this.localAnchorB, worldAnchorB);
};

/**
 * Get the anchor point on body A, in world coordinates.
 * @method getWorldAnchorA
 * @param {Array} result The vector to store the result in.
 */
Spring.prototype.getWorldAnchorA = function(result){
    this.bodyA.toWorldFrame(result, this.localAnchorA);
};

/**
 * Get the anchor point on body B, in world coordinates.
 * @method getWorldAnchorB
 * @param {Array} result The vector to store the result in.
 */
Spring.prototype.getWorldAnchorB = function(result){
    this.bodyB.toWorldFrame(result, this.localAnchorB);
};

var applyForce_r =              vec2.create(),
    applyForce_r_unit =         vec2.create(),
    applyForce_u =              vec2.create(),
    applyForce_f =              vec2.create(),
    applyForce_worldAnchorA =   vec2.create(),
    applyForce_worldAnchorB =   vec2.create(),
    applyForce_ri =             vec2.create(),
    applyForce_rj =             vec2.create(),
    applyForce_tmp =            vec2.create();

/**
 * Apply the spring force to the connected bodies.
 * @method applyForce
 */
Spring.prototype.applyForce = function(){
    var k = this.stiffness,
        d = this.damping,
        l = this.restLength,
        bodyA = this.bodyA,
        bodyB = this.bodyB,
        r = applyForce_r,
        r_unit = applyForce_r_unit,
        u = applyForce_u,
        f = applyForce_f,
        tmp = applyForce_tmp;

    var worldAnchorA = applyForce_worldAnchorA,
        worldAnchorB = applyForce_worldAnchorB,
        ri = applyForce_ri,
        rj = applyForce_rj;

    // Get world anchors
    this.getWorldAnchorA(worldAnchorA);
    this.getWorldAnchorB(worldAnchorB);

    // Get offset points
    vec2.sub(ri, worldAnchorA, bodyA.position);
    vec2.sub(rj, worldAnchorB, bodyB.position);

    // Compute distance vector between world anchor points
    vec2.sub(r, worldAnchorB, worldAnchorA);
    var rlen = vec2.len(r);
    vec2.normalize(r_unit,r);

    //console.log(rlen)
    //console.log("A",vec2.str(worldAnchorA),"B",vec2.str(worldAnchorB))

    // Compute relative velocity of the anchor points, u
    vec2.sub(u, bodyB.velocity, bodyA.velocity);
    vec2.crossZV(tmp, bodyB.angularVelocity, rj);
    vec2.add(u, u, tmp);
    vec2.crossZV(tmp, bodyA.angularVelocity, ri);
    vec2.sub(u, u, tmp);

    // F = - k * ( x - L ) - D * ( u )
    vec2.scale(f, r_unit, -k*(rlen-l) - d*vec2.dot(u,r_unit));

    // Add forces to bodies
    vec2.sub( bodyA.force, bodyA.force, f);
    vec2.add( bodyB.force, bodyB.force, f);

    // Angular force
    var ri_x_f = vec2.crossLength(ri, f);
    var rj_x_f = vec2.crossLength(rj, f);
    bodyA.angularForce -= ri_x_f;
    bodyB.angularForce += rj_x_f;
};

},{"../math/vec2":30,"../utils/Utils":47}],33:[function(require,module,exports){
// Export p2 classes
module.exports = {
    AABB :                          require('./collision/AABB'),
    AngleLockEquation :             require('./equations/AngleLockEquation'),
    Body :                          require('./objects/Body'),
    Broadphase :                    require('./collision/Broadphase'),
    Capsule :                       require('./shapes/Capsule'),
    Circle :                        require('./shapes/Circle'),
    Constraint :                    require('./constraints/Constraint'),
    ContactEquation :               require('./equations/ContactEquation'),
    ContactMaterial :               require('./material/ContactMaterial'),
    Convex :                        require('./shapes/Convex'),
    DistanceConstraint :            require('./constraints/DistanceConstraint'),
    Equation :                      require('./equations/Equation'),
    EventEmitter :                  require('./events/EventEmitter'),
    FrictionEquation :              require('./equations/FrictionEquation'),
    GearConstraint :                require('./constraints/GearConstraint'),
    GridBroadphase :                require('./collision/GridBroadphase'),
    GSSolver :                      require('./solver/GSSolver'),
    Heightfield :                   require('./shapes/Heightfield'),
    Line :                          require('./shapes/Line'),
    LockConstraint :                require('./constraints/LockConstraint'),
    Material :                      require('./material/Material'),
    Narrowphase :                   require('./collision/Narrowphase'),
    NaiveBroadphase :               require('./collision/NaiveBroadphase'),
    Particle :                      require('./shapes/Particle'),
    Plane :                         require('./shapes/Plane'),
    RevoluteConstraint :            require('./constraints/RevoluteConstraint'),
    PrismaticConstraint :           require('./constraints/PrismaticConstraint'),
    Rectangle :                     require('./shapes/Rectangle'),
    RotationalVelocityEquation :    require('./equations/RotationalVelocityEquation'),
    SAPBroadphase :                 require('./collision/SAPBroadphase'),
    Shape :                         require('./shapes/Shape'),
    Solver :                        require('./solver/Solver'),
    Spring :                        require('./objects/Spring'),
    Utils :                         require('./utils/Utils'),
    World :                         require('./world/World'),
    vec2 :                          require('./math/vec2'),
    version :                       require('../package.json').version,
};

},{"../package.json":7,"./collision/AABB":8,"./collision/Broadphase":9,"./collision/GridBroadphase":10,"./collision/NaiveBroadphase":11,"./collision/Narrowphase":12,"./collision/SAPBroadphase":13,"./constraints/Constraint":14,"./constraints/DistanceConstraint":15,"./constraints/GearConstraint":16,"./constraints/LockConstraint":17,"./constraints/PrismaticConstraint":18,"./constraints/RevoluteConstraint":19,"./equations/AngleLockEquation":20,"./equations/ContactEquation":21,"./equations/Equation":22,"./equations/FrictionEquation":23,"./equations/RotationalVelocityEquation":25,"./events/EventEmitter":26,"./material/ContactMaterial":27,"./material/Material":28,"./math/vec2":30,"./objects/Body":31,"./objects/Spring":32,"./shapes/Capsule":34,"./shapes/Circle":35,"./shapes/Convex":36,"./shapes/Heightfield":37,"./shapes/Line":38,"./shapes/Particle":39,"./shapes/Plane":40,"./shapes/Rectangle":41,"./shapes/Shape":42,"./solver/GSSolver":43,"./solver/Solver":44,"./utils/Utils":47,"./world/World":51}],34:[function(require,module,exports){
var Shape = require('./Shape')
,   vec2 = require('../math/vec2');

module.exports = Capsule;

/**
 * Capsule shape class.
 * @class Capsule
 * @constructor
 * @extends Shape
 * @param {Number} [length] The distance between the end points
 * @param {Number} [radius] Radius of the capsule
 */
function Capsule(length, radius){

    /**
     * The distance between the end points.
     * @property {Number} length
     */
    this.length = length || 1;

    /**
     * The radius of the capsule.
     * @property {Number} radius
     */
    this.radius = radius || 1;

    Shape.call(this,Shape.CAPSULE);
}
Capsule.prototype = new Shape();

/**
 * Compute the mass moment of inertia of the Capsule.
 * @method conputeMomentOfInertia
 * @param  {Number} mass
 * @return {Number}
 * @todo
 */
Capsule.prototype.computeMomentOfInertia = function(mass){
    // Approximate with rectangle
    var r = this.radius,
        w = this.length + r, // 2*r is too much, 0 is too little
        h = r*2;
    return mass * (h*h + w*w) / 12;
};

/**
 * @method updateBoundingRadius
 */
Capsule.prototype.updateBoundingRadius = function(){
    this.boundingRadius = this.radius + this.length/2;
};

/**
 * @method updateArea
 */
Capsule.prototype.updateArea = function(){
    this.area = Math.PI * this.radius * this.radius + this.radius * 2 * this.length;
};

var r = vec2.create();

/**
 * @method computeAABB
 * @param  {AABB}   out      The resulting AABB.
 * @param  {Array}  position
 * @param  {Number} angle
 */
Capsule.prototype.computeAABB = function(out, position, angle){
    var radius = this.radius;

    // Compute center position of one of the the circles, world oriented, but with local offset
    vec2.set(r,this.length,0);
    vec2.rotate(r,r,angle);

    // Get bounds
    vec2.set(out.upperBound,  Math.max(r[0]+radius, -r[0]+radius),
                              Math.max(r[1]+radius, -r[1]+radius));
    vec2.set(out.lowerBound,  Math.min(r[0]-radius, -r[0]-radius),
                              Math.min(r[1]-radius, -r[1]-radius));

    // Add offset
    vec2.add(out.lowerBound, out.lowerBound, position);
    vec2.add(out.upperBound, out.upperBound, position);
};

},{"../math/vec2":30,"./Shape":42}],35:[function(require,module,exports){
var Shape = require('./Shape')
,    vec2 = require('../math/vec2')

module.exports = Circle;

/**
 * Circle shape class.
 * @class Circle
 * @extends Shape
 * @constructor
 * @param {number} [radius=1] The radius of this circle
 */
function Circle(radius){

    /**
     * The radius of the circle.
     * @property radius
     * @type {number}
     */
    this.radius = radius || 1;

    Shape.call(this,Shape.CIRCLE);
};
Circle.prototype = new Shape();

/**
 * @method computeMomentOfInertia
 * @param  {Number} mass
 * @return {Number}
 */
Circle.prototype.computeMomentOfInertia = function(mass){
    var r = this.radius;
    return mass * r * r / 2;
};

/**
 * @method updateBoundingRadius
 * @return {Number}
 */
Circle.prototype.updateBoundingRadius = function(){
    this.boundingRadius = this.radius;
};

/**
 * @method updateArea
 * @return {Number}
 */
Circle.prototype.updateArea = function(){
    this.area = Math.PI * this.radius * this.radius;
};

/**
 * @method computeAABB
 * @param  {AABB}   out      The resulting AABB.
 * @param  {Array}  position
 * @param  {Number} angle
 */
Circle.prototype.computeAABB = function(out, position, angle){
    var r = this.radius;
    vec2.set(out.upperBound,  r,  r);
    vec2.set(out.lowerBound, -r, -r);
    if(position){
        vec2.add(out.lowerBound, out.lowerBound, position);
        vec2.add(out.upperBound, out.upperBound, position);
    }
};

},{"../math/vec2":30,"./Shape":42}],36:[function(require,module,exports){
var Shape = require('./Shape')
,   vec2 = require('../math/vec2')
,   polyk = require('../math/polyk')
,   decomp = require('poly-decomp')

module.exports = Convex;

/**
 * Convex shape class.
 * @class Convex
 * @constructor
 * @extends Shape
 * @param {Array} vertices An array of Float32Array vertices that span this shape. Vertices are given in counter-clockwise (CCW) direction.
 */
function Convex(vertices){

    /**
     * Vertices defined in the local frame.
     * @property vertices
     * @type {Array}
     */
    this.vertices = [];

    // Copy the verts
    for(var i=0; i<vertices.length; i++){
        var v = vec2.create();
        vec2.copy(v,vertices[i]);
        this.vertices.push(v);
    }

    /**
     * The center of mass of the Convex
     * @property centerOfMass
     * @type {Float32Array}
     */
    this.centerOfMass = vec2.fromValues(0,0);

    /**
     * Triangulated version of this convex. The structure is Array of 3-Arrays, and each subarray contains 3 integers, referencing the vertices.
     * @property triangles
     * @type {Array}
     */
    this.triangles = [];

    if(this.vertices.length){
        this.updateTriangles();
        this.updateCenterOfMass();
    }

    /**
     * The bounding radius of the convex
     * @property boundingRadius
     * @type {Number}
     */
    this.boundingRadius = 0;


    Shape.call(this,Shape.CONVEX);

    this.updateBoundingRadius();
    this.updateArea();
    if(this.area < 0)
        throw new Error("Convex vertices must be given in conter-clockwise winding.");
};
Convex.prototype = new Shape();

/**
 * Update the .triangles property
 * @method updateTriangles
 */
Convex.prototype.updateTriangles = function(){

    this.triangles.length = 0;

    // Rewrite on polyk notation, array of numbers
    var polykVerts = [];
    for(var i=0; i<this.vertices.length; i++){
        var v = this.vertices[i];
        polykVerts.push(v[0],v[1]);
    }

    // Triangulate
    var triangles = polyk.Triangulate(polykVerts);

    // Loop over all triangles, add their inertia contributions to I
    for(var i=0; i<triangles.length; i+=3){
        var id1 = triangles[i],
            id2 = triangles[i+1],
            id3 = triangles[i+2];

        // Add to triangles
        this.triangles.push([id1,id2,id3]);
    }
};

var updateCenterOfMass_centroid = vec2.create(),
    updateCenterOfMass_centroid_times_mass = vec2.create(),
    updateCenterOfMass_a = vec2.create(),
    updateCenterOfMass_b = vec2.create(),
    updateCenterOfMass_c = vec2.create(),
    updateCenterOfMass_ac = vec2.create(),
    updateCenterOfMass_ca = vec2.create(),
    updateCenterOfMass_cb = vec2.create(),
    updateCenterOfMass_n = vec2.create();

/**
 * Update the .centerOfMass property.
 * @method updateCenterOfMass
 */
Convex.prototype.updateCenterOfMass = function(){
    var triangles = this.triangles,
        verts = this.vertices,
        cm = this.centerOfMass,
        centroid = updateCenterOfMass_centroid,
        n = updateCenterOfMass_n,
        a = updateCenterOfMass_a,
        b = updateCenterOfMass_b,
        c = updateCenterOfMass_c,
        ac = updateCenterOfMass_ac,
        ca = updateCenterOfMass_ca,
        cb = updateCenterOfMass_cb,
        centroid_times_mass = updateCenterOfMass_centroid_times_mass;

    vec2.set(cm,0,0);
    var totalArea = 0;

    for(var i=0; i!==triangles.length; i++){
        var t = triangles[i],
            a = verts[t[0]],
            b = verts[t[1]],
            c = verts[t[2]];

        vec2.centroid(centroid,a,b,c);

        // Get mass for the triangle (density=1 in this case)
        // http://math.stackexchange.com/questions/80198/area-of-triangle-via-vectors
        var m = Convex.triangleArea(a,b,c)
        totalArea += m;

        // Add to center of mass
        vec2.scale(centroid_times_mass, centroid, m);
        vec2.add(cm, cm, centroid_times_mass);
    }

    vec2.scale(cm,cm,1/totalArea);
};

/**
 * Compute the mass moment of inertia of the Convex.
 * @method computeMomentOfInertia
 * @param  {Number} mass
 * @return {Number}
 * @see http://www.gamedev.net/topic/342822-moment-of-inertia-of-a-polygon-2d/
 */
Convex.prototype.computeMomentOfInertia = function(mass){
    var denom = 0.0,
        numer = 0.0,
        N = this.vertices.length;
    for(var j = N-1, i = 0; i < N; j = i, i ++){
        var p0 = this.vertices[j];
        var p1 = this.vertices[i];
        var a = Math.abs(vec2.crossLength(p0,p1));
        var b = vec2.dot(p1,p1) + vec2.dot(p1,p0) + vec2.dot(p0,p0);
        denom += a * b;
        numer += a;
    }
    return (mass / 6.0) * (denom / numer);
};

/**
 * Updates the .boundingRadius property
 * @method updateBoundingRadius
 */
Convex.prototype.updateBoundingRadius = function(){
    var verts = this.vertices,
        r2 = 0;

    for(var i=0; i!==verts.length; i++){
        var l2 = vec2.squaredLength(verts[i]);
        if(l2 > r2) r2 = l2;
    }

    this.boundingRadius = Math.sqrt(r2);
};

/**
 * Get the area of the triangle spanned by the three points a, b, c. The area is positive if the points are given in counter-clockwise order, otherwise negative.
 * @static
 * @method triangleArea
 * @param {Array} a
 * @param {Array} b
 * @param {Array} c
 * @return {Number}
 */
Convex.triangleArea = function(a,b,c){
    return (((b[0] - a[0])*(c[1] - a[1]))-((c[0] - a[0])*(b[1] - a[1]))) * 0.5;
}

/**
 * Update the .area
 * @method updateArea
 */
Convex.prototype.updateArea = function(){
    this.updateTriangles();
    this.area = 0;

    var triangles = this.triangles,
        verts = this.vertices;
    for(var i=0; i!==triangles.length; i++){
        var t = triangles[i],
            a = verts[t[0]],
            b = verts[t[1]],
            c = verts[t[2]];

        // Get mass for the triangle (density=1 in this case)
        var m = Convex.triangleArea(a,b,c);
        this.area += m;
    }
};

/**
 * @method computeAABB
 * @param  {AABB}   out
 * @param  {Array}  position
 * @param  {Number} angle
 */
Convex.prototype.computeAABB = function(out, position, angle){
   out.setFromPoints(this.vertices,position,angle);
};

},{"../math/polyk":29,"../math/vec2":30,"./Shape":42,"poly-decomp":6}],37:[function(require,module,exports){
var Shape = require('./Shape')
,    vec2 = require('../math/vec2')
,    Utils = require('../utils/Utils');

module.exports = Heightfield;

/**
 * Heightfield shape class. Height data is given as an array. These data points are spread out evenly with a distance "elementWidth".
 * @class Heightfield
 * @extends Shape
 * @constructor
 * @param {Array} data
 * @param {Number} maxValue
 * @param {Number} elementWidth
 * @todo Should take maxValue as an option and also be able to compute it itself if not given.
 * @todo Should be possible to use along all axes, not just y
 */
function Heightfield(data, options){
    options = Utils.defaults(options, {
        maxValue : null,
        minValue : null,
        elementWidth : 0.1
    });

    if(options.minValue === null || options.maxValue === null){
        options.maxValue = data[0];
        options.minValue = data[0];
        for(var i=0; i !== data.length; i++){
            var v = data[i];
            if(v > options.maxValue){
                options.maxValue = v;
            }
            if(v < options.minValue){
                options.minValue = v;
            }
        }
    }

    /**
     * An array of numbers, or height values, that are spread out along the x axis.
     * @property {array} data
     */
    this.data = data;

    /**
     * Max value of the data
     * @property {number} maxValue
     */
    this.maxValue = options.maxValue;

    /**
     * Max value of the data
     * @property {number} minValue
     */
    this.minValue = options.minValue;

    /**
     * The width of each element
     * @property {number} elementWidth
     */
    this.elementWidth = options.elementWidth;

    Shape.call(this,Shape.HEIGHTFIELD);
}
Heightfield.prototype = new Shape();

/**
 * @method computeMomentOfInertia
 * @param  {Number} mass
 * @return {Number}
 */
Heightfield.prototype.computeMomentOfInertia = function(mass){
    return Number.MAX_VALUE;
};

Heightfield.prototype.updateBoundingRadius = function(){
    this.boundingRadius = Number.MAX_VALUE;
};

Heightfield.prototype.updateArea = function(){
    var data = this.data,
        area = 0;
    for(var i=0; i<data.length-1; i++){
        area += (data[i]+data[i+1]) / 2 * this.elementWidth;
    }
    this.area = area;
};

/**
 * @method computeAABB
 * @param  {AABB}   out      The resulting AABB.
 * @param  {Array}  position
 * @param  {Number} angle
 */
Heightfield.prototype.computeAABB = function(out, position, angle){
    // Use the max data rectangle
    out.upperBound[0] = this.elementWidth * this.data.length + position[0];
    out.upperBound[1] = this.maxValue + position[1];
    out.lowerBound[0] = position[0];
    out.lowerBound[1] = -Number.MAX_VALUE; // Infinity
};

},{"../math/vec2":30,"../utils/Utils":47,"./Shape":42}],38:[function(require,module,exports){
var Shape = require('./Shape')
,   vec2 = require('../math/vec2')

module.exports = Line;

/**
 * Line shape class. The line shape is along the x direction, and stretches from [-length/2, 0] to [length/2,0].
 * @class Line
 * @param {Number} length The total length of the line
 * @extends Shape
 * @constructor
 */
function Line(length){

    /**
     * Length of this line
     * @property length
     * @type {Number}
     */
    this.length = length || 1;

    Shape.call(this,Shape.LINE);
}
Line.prototype = new Shape();
Line.prototype.computeMomentOfInertia = function(mass){
    return mass * Math.pow(this.length,2) / 12;
};

Line.prototype.updateBoundingRadius = function(){
    this.boundingRadius = this.length/2;
};

var points = [vec2.create(),vec2.create()];

/**
 * @method computeAABB
 * @param  {AABB}   out      The resulting AABB.
 * @param  {Array}  position
 * @param  {Number} angle
 */
Line.prototype.computeAABB = function(out, position, angle){
    var l = this.length;
    vec2.set(points[0], -l/2,  0);
    vec2.set(points[1],  l/2,  0);
    out.setFromPoints(points,position,angle);
};


},{"../math/vec2":30,"./Shape":42}],39:[function(require,module,exports){
var Shape = require('./Shape')
,   vec2 = require('../math/vec2')

module.exports = Particle;

/**
 * Particle shape class.
 * @class Particle
 * @constructor
 * @extends Shape
 */
function Particle(){
    Shape.call(this,Shape.PARTICLE);
};
Particle.prototype = new Shape();
Particle.prototype.computeMomentOfInertia = function(mass){
    return 0; // Can't rotate a particle
};

Particle.prototype.updateBoundingRadius = function(){
    this.boundingRadius = 0;
};

/**
 * @method computeAABB
 * @param  {AABB}   out
 * @param  {Array}  position
 * @param  {Number} angle
 */
Particle.prototype.computeAABB = function(out, position, angle){
    var l = this.length;
    vec2.copy(out.lowerBound, position);
    vec2.copy(out.upperBound, position);
};

},{"../math/vec2":30,"./Shape":42}],40:[function(require,module,exports){
var Shape =  require('./Shape')
,    vec2 =  require('../math/vec2')
,    Utils = require('../utils/Utils')

module.exports = Plane;

/**
 * Plane shape class. The plane is facing in the Y direction.
 * @class Plane
 * @extends Shape
 * @constructor
 */
function Plane(){
    Shape.call(this,Shape.PLANE);
};
Plane.prototype = new Shape();

/**
 * Compute moment of inertia
 * @method computeMomentOfInertia
 */
Plane.prototype.computeMomentOfInertia = function(mass){
    return 0; // Plane is infinite. The inertia should therefore be infinty but by convention we set 0 here
};

/**
 * Update the bounding radius
 * @method updateBoundingRadius
 */
Plane.prototype.updateBoundingRadius = function(){
    this.boundingRadius = Number.MAX_VALUE;
};

/**
 * @method computeAABB
 * @param  {AABB}   out
 * @param  {Array}  position
 * @param  {Number} angle
 */
Plane.prototype.computeAABB = function(out, position, angle){
    var a = 0,
        set = vec2.set;
    if(typeof(angle) == "number")
        a = angle % (2*Math.PI);

    if(a == 0){
        // y goes from -inf to 0
        set(out.lowerBound, -Number.MAX_VALUE, -Number.MAX_VALUE);
        set(out.upperBound,  Number.MAX_VALUE,  0);
    } else if(a == Math.PI / 2){
        // x goes from 0 to inf
        set(out.lowerBound,                 0, -Number.MAX_VALUE);
        set(out.upperBound,  Number.MAX_VALUE,  Number.MAX_VALUE);
    } else if(a == Math.PI){
        // y goes from 0 to inf
        set(out.lowerBound, -Number.MAX_VALUE, 0);
        set(out.upperBound,  Number.MAX_VALUE, Number.MAX_VALUE);
    } else if(a == 3*Math.PI/2){
        // x goes from -inf to 0
        set(out.lowerBound, -Number.MAX_VALUE, -Number.MAX_VALUE);
        set(out.upperBound,                 0,  Number.MAX_VALUE);
    } else {
        // Set max bounds
        set(out.lowerBound, -Number.MAX_VALUE, -Number.MAX_VALUE);
        set(out.upperBound,  Number.MAX_VALUE,  Number.MAX_VALUE);
    }

    vec2.add(out.lowerBound, out.lowerBound, position);
    vec2.add(out.upperBound, out.upperBound, position);
};

Plane.prototype.updateArea = function(){
    this.area = Number.MAX_VALUE;
};


},{"../math/vec2":30,"../utils/Utils":47,"./Shape":42}],41:[function(require,module,exports){
var vec2 = require('../math/vec2')
,   Shape = require('./Shape')
,   Convex = require('./Convex');

module.exports = Rectangle;

/**
 * Rectangle shape class.
 * @class Rectangle
 * @constructor
 * @param {Number} width Width
 * @param {Number} height Height
 * @extends Convex
 */
function Rectangle(width, height){
    width = width || 1;
    height = height || 1;

    var verts = [   vec2.fromValues(-width/2, -height/2),
                    vec2.fromValues( width/2, -height/2),
                    vec2.fromValues( width/2,  height/2),
                    vec2.fromValues(-width/2,  height/2)];

    /**
     * Total width of the rectangle
     * @property width
     * @type {Number}
     */
    this.width = width;

    /**
     * Total height of the rectangle
     * @property height
     * @type {Number}
     */
    this.height = height;

    Convex.call(this,verts);

    this.type = Shape.RECTANGLE;
}
Rectangle.prototype = new Convex([]);

/**
 * Compute moment of inertia
 * @method computeMomentOfInertia
 * @param  {Number} mass
 * @return {Number}
 */
Rectangle.prototype.computeMomentOfInertia = function(mass){
    var w = this.width,
        h = this.height;
    return mass * (h*h + w*w) / 12;
};

/**
 * Update the bounding radius
 * @method updateBoundingRadius
 */
Rectangle.prototype.updateBoundingRadius = function(){
    var w = this.width,
        h = this.height;
    this.boundingRadius = Math.sqrt(w*w + h*h) / 2;
};

var corner1 = vec2.create(),
    corner2 = vec2.create(),
    corner3 = vec2.create(),
    corner4 = vec2.create();

/**
 * @method computeAABB
 * @param  {AABB}   out      The resulting AABB.
 * @param  {Array}  position
 * @param  {Number} angle
 */
Rectangle.prototype.computeAABB = function(out, position, angle){
   out.setFromPoints(this.vertices,position,angle);
};

Rectangle.prototype.updateArea = function(){
    this.area = this.width * this.height;
};


},{"../math/vec2":30,"./Convex":36,"./Shape":42}],42:[function(require,module,exports){
module.exports = Shape;

/**
 * Base class for shapes.
 * @class Shape
 * @constructor
 * @param {Number} type
 */
function Shape(type){

    /**
     * The type of the shape. One of:
     *
     * * {{#crossLink "Shape/CIRCLE:property"}}Shape.CIRCLE{{/crossLink}}
     * * {{#crossLink "Shape/PARTICLE:property"}}Shape.PARTICLE{{/crossLink}}
     * * {{#crossLink "Shape/PLANE:property"}}Shape.PLANE{{/crossLink}}
     * * {{#crossLink "Shape/CONVEX:property"}}Shape.CONVEX{{/crossLink}}
     * * {{#crossLink "Shape/LINE:property"}}Shape.LINE{{/crossLink}}
     * * {{#crossLink "Shape/RECTANGLE:property"}}Shape.RECTANGLE{{/crossLink}}
     * * {{#crossLink "Shape/CAPSULE:property"}}Shape.CAPSULE{{/crossLink}}
     * * {{#crossLink "Shape/HEIGHTFIELD:property"}}Shape.HEIGHTFIELD{{/crossLink}}
     *
     * @property {number} type
     */
    this.type = type;

    /**
     * Shape object identifier.
     * @type {Number}
     * @property id
     */
    this.id = Shape.idCounter++;

    /**
     * Bounding circle radius of this shape
     * @property boundingRadius
     * @type {Number}
     */
    this.boundingRadius = 0;

    /**
     * Collision group that this shape belongs to (bit mask). See <a href="http://www.aurelienribon.com/blog/2011/07/box2d-tutorial-collision-filtering/">this tutorial</a>.
     * @property collisionGroup
     * @type {Number}
     * @example
     *     // Setup bits for each available group
     *     var PLAYER = Math.pow(2,0),
     *         ENEMY =  Math.pow(2,1),
     *         GROUND = Math.pow(2,2)
     *
     *     // Put shapes into their groups
     *     player1Shape.collisionGroup = PLAYER;
     *     player2Shape.collisionGroup = PLAYER;
     *     enemyShape  .collisionGroup = ENEMY;
     *     groundShape .collisionGroup = GROUND;
     *
     *     // Assign groups that each shape collide with.
     *     // Note that the players can collide with ground and enemies, but not with other players.
     *     player1Shape.collisionMask = ENEMY | GROUND;
     *     player2Shape.collisionMask = ENEMY | GROUND;
     *     enemyShape  .collisionMask = PLAYER | GROUND;
     *     groundShape .collisionMask = PLAYER | ENEMY;
     *
     * @example
     *     // How collision check is done
     *     if(shapeA.collisionGroup & shapeB.collisionMask)!=0 && (shapeB.collisionGroup & shapeA.collisionMask)!=0){
     *         // The shapes will collide
     *     }
     */
    this.collisionGroup = 1;

    /**
     * Collision mask of this shape. See .collisionGroup.
     * @property collisionMask
     * @type {Number}
     */
    this.collisionMask =  1;
    if(type) this.updateBoundingRadius();

    /**
     * Material to use in collisions for this Shape. If this is set to null, the world will use default material properties instead.
     * @property material
     * @type {Material}
     */
    this.material = null;

    /**
     * Area of this shape.
     * @property area
     * @type {Number}
     */
    this.area = 0;

    /**
     * Set to true if you want this shape to be a sensor. A sensor does not generate contacts, but it still reports contact events. This is good if you want to know if a shape is overlapping another shape, without them generating contacts.
     * @property {Boolean} sensor
     */
    this.sensor = false;

    this.updateArea();
};

Shape.idCounter = 0;

/**
 * @static
 * @property {Number} CIRCLE
 */
Shape.CIRCLE =      1;

/**
 * @static
 * @property {Number} PARTICLE
 */
Shape.PARTICLE =    2;

/**
 * @static
 * @property {Number} PLANE
 */
Shape.PLANE =       4;

/**
 * @static
 * @property {Number} CONVEX
 */
Shape.CONVEX =      8;

/**
 * @static
 * @property {Number} LINE
 */
Shape.LINE =        16;

/**
 * @static
 * @property {Number} RECTANGLE
 */
Shape.RECTANGLE =   32;

/**
 * @static
 * @property {Number} CAPSULE
 */
Shape.CAPSULE =     64;

/**
 * @static
 * @property {Number} HEIGHTFIELD
 */
Shape.HEIGHTFIELD = 128;

/**
 * Should return the moment of inertia around the Z axis of the body given the total mass. See <a href="http://en.wikipedia.org/wiki/List_of_moments_of_inertia">Wikipedia's list of moments of inertia</a>.
 * @method computeMomentOfInertia
 * @param  {Number} mass
 * @return {Number} If the inertia is infinity or if the object simply isn't possible to rotate, return 0.
 */
Shape.prototype.computeMomentOfInertia = function(mass){
    throw new Error("Shape.computeMomentOfInertia is not implemented in this Shape...");
};

/**
 * Returns the bounding circle radius of this shape.
 * @method updateBoundingRadius
 * @return {Number}
 */
Shape.prototype.updateBoundingRadius = function(){
    throw new Error("Shape.updateBoundingRadius is not implemented in this Shape...");
};

/**
 * Update the .area property of the shape.
 * @method updateArea
 */
Shape.prototype.updateArea = function(){
    // To be implemented in all subclasses
};

/**
 * Compute the world axis-aligned bounding box (AABB) of this shape.
 * @method computeAABB
 * @param  {AABB}   out      The resulting AABB.
 * @param  {Array}  position
 * @param  {Number} angle
 */
Shape.prototype.computeAABB = function(out, position, angle){
    // To be implemented in each subclass
};

},{}],43:[function(require,module,exports){
var vec2 = require('../math/vec2')
,   Solver = require('./Solver')
,   Utils = require('../utils/Utils')
,   FrictionEquation = require('../equations/FrictionEquation');

module.exports = GSSolver;

/**
 * Iterative Gauss-Seidel constraint equation solver.
 *
 * @class GSSolver
 * @constructor
 * @extends Solver
 * @param {Object} [options]
 * @param {Number} [options.iterations=10]
 * @param {Number} [options.tolerance=0]
 */
function GSSolver(options){
    Solver.call(this,options,Solver.GS);
    options = options || {};

    /**
     * The number of iterations to do when solving. More gives better results, but is more expensive.
     * @property iterations
     * @type {Number}
     */
    this.iterations = options.iterations || 10;

    /**
     * The error tolerance, per constraint. If the total error is below this limit, the solver will stop iterating. Set to zero for as good solution as possible, but to something larger than zero to make computations faster.
     * @property tolerance
     * @type {Number}
     */
    this.tolerance = options.tolerance || 1e-10;

    this.arrayStep = 30;
    this.lambda = new Utils.ARRAY_TYPE(this.arrayStep);
    this.Bs =     new Utils.ARRAY_TYPE(this.arrayStep);
    this.invCs =  new Utils.ARRAY_TYPE(this.arrayStep);

    /**
     * Set to true to set all right hand side terms to zero when solving. Can be handy for a few applications.
     * @property useZeroRHS
     * @type {Boolean}
     */
    this.useZeroRHS = false;

    /**
     * Number of solver iterations that are done to approximate normal forces. When these iterations are done, friction force will be computed from the contact normal forces. These friction forces will override any other friction forces set from the World for example.
     * The solver will use less iterations if the solution is below the .tolerance.
     * @property frictionIterations
     * @type {Number}
     */
    this.frictionIterations = 0;

    /**
     * The number of iterations that were made during the last solve. If .tolerance is zero, this value will always be equal to .iterations, but if .tolerance is larger than zero, and the solver can quit early, then this number will be somewhere between 1 and .iterations.
     * @property {Number} usedIterations
     */
    this.usedIterations = 0;
}
GSSolver.prototype = new Solver();

function setArrayZero(array){
    var l = array.length;
    while(l--){
        array[l] = +0.0;
    }
}

/**
 * Solve the system of equations
 * @method solve
 * @param  {Number}  h       Time step
 * @param  {World}   world    World to solve
 */
GSSolver.prototype.solve = function(h, world){

    this.sortEquations();

    var iter = 0,
        maxIter = this.iterations,
        maxFrictionIter = this.frictionIterations,
        equations = this.equations,
        Neq = equations.length,
        tolSquared = Math.pow(this.tolerance*Neq, 2),
        bodies = world.bodies,
        Nbodies = world.bodies.length,
        add = vec2.add,
        set = vec2.set,
        useZeroRHS = this.useZeroRHS,
        lambda = this.lambda;

    this.usedIterations = 0;

    // Things that does not change during iteration can be computed once
    if(lambda.length < Neq){
        lambda = this.lambda =  new Utils.ARRAY_TYPE(Neq + this.arrayStep);
        this.Bs =               new Utils.ARRAY_TYPE(Neq + this.arrayStep);
        this.invCs =            new Utils.ARRAY_TYPE(Neq + this.arrayStep);
    }
    setArrayZero(lambda);
    var invCs = this.invCs,
        Bs = this.Bs,
        lambda = this.lambda;

    for(var i=0; i!==equations.length; i++){
        var c = equations[i];
        if(c.timeStep !== h || c.needsUpdate){
            c.timeStep = h;
            c.update();
        }
        Bs[i] =     c.computeB(c.a,c.b,h);
        invCs[i] =  c.computeInvC(c.epsilon);
    }

    var q, B, c, deltalambdaTot,i,j;

    if(Neq !== 0){

        // Reset vlambda
        for(i=0; i!==Nbodies; i++){
            bodies[i].resetConstraintVelocity();
        }

        if(maxFrictionIter){
            // Iterate over contact equations to get normal forces
            for(iter=0; iter!==maxFrictionIter; iter++){

                // Accumulate the total error for each iteration.
                deltalambdaTot = 0.0;

                for(j=0; j!==Neq; j++){
                    c = equations[j];

                    if(c instanceof FrictionEquation){
                        //continue;
                    }

                    var deltalambda = GSSolver.iterateEquation(j,c,c.epsilon,Bs,invCs,lambda,useZeroRHS,h,iter);
                    deltalambdaTot += Math.abs(deltalambda);
                }

                this.usedIterations++;

                // If the total error is small enough - stop iterate
                if(deltalambdaTot*deltalambdaTot <= tolSquared){
                    break;
                }
            }

            GSSolver.updateMultipliers(equations, lambda, 1/h);

            // Set computed friction force
            for(j=0; j!==Neq; j++){
                var eq = equations[j];
                if(eq instanceof FrictionEquation){
                    var f = eq.contactEquation.multiplier * eq.frictionCoefficient;
                    eq.maxForce =  f;
                    eq.minForce = -f;
                }
            }
        }

        // Iterate over all equations
        for(iter=0; iter!==maxIter; iter++){

            // Accumulate the total error for each iteration.
            deltalambdaTot = 0.0;

            for(j=0; j!==Neq; j++){
                c = equations[j];

                var deltalambda = GSSolver.iterateEquation(j,c,c.epsilon,Bs,invCs,lambda,useZeroRHS,h,iter);
                deltalambdaTot += Math.abs(deltalambda);
            }

            this.usedIterations++;

            // If the total error is small enough - stop iterate
            if(deltalambdaTot*deltalambdaTot <= tolSquared){
                break;
            }
        }

        // Add result to velocity
        for(i=0; i!==Nbodies; i++){
            bodies[i].addConstraintVelocity();
        }

        GSSolver.updateMultipliers(equations, lambda, 1/h);
    }
};

// Sets the .multiplier property of each equation
GSSolver.updateMultipliers = function(equations, lambda, invDt){
    // Set the .multiplier property of each equation
    var l = equations.length;
    while(l--){
        equations[l].multiplier = lambda[l] * invDt;
    }
};

GSSolver.iterateEquation = function(j,eq,eps,Bs,invCs,lambda,useZeroRHS,dt,iter){
    // Compute iteration
    var B = Bs[j],
        invC = invCs[j],
        lambdaj = lambda[j],
        GWlambda = eq.computeGWlambda();

    var maxForce = eq.maxForce,
        minForce = eq.minForce;

    if(useZeroRHS){
        B = 0;
    }

    var deltalambda = invC * ( B - GWlambda - eps * lambdaj );

    // Clamp if we are not within the min/max interval
    var lambdaj_plus_deltalambda = lambdaj + deltalambda;
    if(lambdaj_plus_deltalambda < minForce*dt){
        deltalambda = minForce*dt - lambdaj;
    } else if(lambdaj_plus_deltalambda > maxForce*dt){
        deltalambda = maxForce*dt - lambdaj;
    }
    lambda[j] += deltalambda;
    eq.addToWlambda(deltalambda);

    return deltalambda;
};

},{"../equations/FrictionEquation":23,"../math/vec2":30,"../utils/Utils":47,"./Solver":44}],44:[function(require,module,exports){
var Utils = require('../utils/Utils')
,   EventEmitter = require('../events/EventEmitter')

module.exports = Solver;

/**
 * Base class for constraint solvers.
 * @class Solver
 * @constructor
 * @extends EventEmitter
 */
function Solver(options,type){
    options = options || {};

    EventEmitter.call(this);

    this.type = type;

    /**
     * Current equations in the solver.
     *
     * @property equations
     * @type {Array}
     */
    this.equations = [];

    /**
     * Function that is used to sort all equations before each solve.
     * @property equationSortFunction
     * @type {function|boolean}
     */
    this.equationSortFunction = options.equationSortFunction || false;
}
Solver.prototype = new EventEmitter();

/**
 * Method to be implemented in each subclass
 * @method solve
 * @param  {Number} dt
 * @param  {World} world
 */
Solver.prototype.solve = function(dt,world){
    throw new Error("Solver.solve should be implemented by subclasses!");
};

var mockWorld = {bodies:[]};

/**
 * Solves all constraints in an island.
 * @method solveIsland
 * @param  {Number} dt
 * @param  {Island} island
 */
Solver.prototype.solveIsland = function(dt,island){

    this.removeAllEquations();

    if(island.equations.length){
        // Add equations to solver
        this.addEquations(island.equations);
        mockWorld.bodies.length = 0;
        island.getBodies(mockWorld.bodies);

        // Solve
        if(mockWorld.bodies.length){
            this.solve(dt,mockWorld);
        }
    }
};

/**
 * Sort all equations using the .equationSortFunction. Should be called by subclasses before solving.
 * @method sortEquations
 */
Solver.prototype.sortEquations = function(){
    if(this.equationSortFunction){
        this.equations.sort(this.equationSortFunction);
    }
};

/**
 * Add an equation to be solved.
 *
 * @method addEquation
 * @param {Equation} eq
 */
Solver.prototype.addEquation = function(eq){
    if(eq.enabled){
        this.equations.push(eq);
    }
};

/**
 * Add equations. Same as .addEquation, but this time the argument is an array of Equations
 *
 * @method addEquations
 * @param {Array} eqs
 */
Solver.prototype.addEquations = function(eqs){
    //Utils.appendArray(this.equations,eqs);
    for(var i=0, N=eqs.length; i!==N; i++){
        var eq = eqs[i];
        if(eq.enabled){
            this.equations.push(eq);
        }
    }
};

/**
 * Remove an equation.
 *
 * @method removeEquation
 * @param {Equation} eq
 */
Solver.prototype.removeEquation = function(eq){
    var i = this.equations.indexOf(eq);
    if(i !== -1){
        this.equations.splice(i,1);
    }
};

/**
 * Remove all currently added equations.
 *
 * @method removeAllEquations
 */
Solver.prototype.removeAllEquations = function(){
    this.equations.length=0;
};

Solver.GS = 1;
Solver.ISLAND = 2;

},{"../events/EventEmitter":26,"../utils/Utils":47}],45:[function(require,module,exports){
var TupleDictionary = require('./TupleDictionary');
var Utils = require('./Utils');

module.exports = OverlapKeeper;

/**
 * Keeps track of overlaps in the current state and the last step state.
 * @class OverlapKeeper
 * @constructor
 */
function OverlapKeeper() {
    this.overlappingLastState = new TupleDictionary();
    this.overlappingCurrentState = new TupleDictionary();
    this.recordPool = [];
    this.tmpDict = new TupleDictionary();
    this.tmpArray1 = [];
}

/**
 * @method tick
 */
OverlapKeeper.prototype.tick = function() {
    var last = this.overlappingLastState;
    var current = this.overlappingCurrentState;

    // Save old objects into pool
    var l = current.keys.length;
    while(l--){
        var key = current.keys[l];
        this.recordPool.push(current.getByKey(key));
    }

    // Clear last object
    last.reset();

    // Transfer from new object to old
    last.copy(current);

    // Clear current object
    current.reset();
};

/**
 * @method setOverlapping
 */
OverlapKeeper.prototype.setOverlapping = function(bodyA, shapeA, bodyB, shapeB) {
    var last = this.overlappingLastState;
    var current = this.overlappingCurrentState;

    // Store current contact state
    if(!current.get(shapeA.id, shapeB.id)){

        var data;
        if(this.recordPool.length){
            data = this.recordPool.pop();
        } else {
            data = new OverlapKeeperRecord(bodyA, shapeA, bodyB, shapeB);
        }

        current.set(shapeA.id, shapeB.id, data);
    }
};

OverlapKeeper.prototype.getNewOverlaps = function(result){
    return this.getDiff(this.overlappingLastState, this.overlappingCurrentState, result);
};

OverlapKeeper.prototype.getEndOverlaps = function(result){
    return this.getDiff(this.overlappingCurrentState, this.overlappingLastState, result);
};

OverlapKeeper.prototype.getDiff = function(dictA, dictB, result){
    var result = result || [];
    var last = dictA;
    var current = dictB;

    result.length = 0;

    var l = current.keys.length;
    while(l--){
        var key = current.keys[l];
        var data = current.data[key];

        if(!data){
            throw new Error('Key '+key+' had no data!');
        }

        var lastData = last.data[key];
        if(!lastData){
            // Not overlapping in last state, but in current.
            result.push(data);
        }
    }

    return result;
};

OverlapKeeper.prototype.isNewOverlap = function(shapeA, shapeB){
    var idA = shapeA.id|0,
        idB = shapeB.id|0;
    return !!!this.overlappingLastState.get(idA, idB) && !!this.overlappingCurrentState.get(idA, idB);
};

OverlapKeeper.prototype.getNewBodyOverlaps = function(result){
    this.tmpArray1.length = 0;
    var overlaps = this.getNewOverlaps(this.tmpArray1);
    return this.getBodyDiff(overlaps, result);
};

OverlapKeeper.prototype.getEndBodyOverlaps = function(result){
    this.tmpArray1.length = 0;
    var overlaps = this.getEndOverlaps(this.tmpArray1);
    return this.getBodyDiff(overlaps, result);
};

OverlapKeeper.prototype.getBodyDiff = function(overlaps, result){
    result = result || [];
    var accumulator = this.tmpDict;

    var l = overlaps.length;

    while(l--){
        var data = overlaps[l];

        // Since we use body id's for the accumulator, these will be a subset of the original one
        accumulator.set(data.bodyA.id|0, data.bodyB.id|0, data);
    }

    l = accumulator.keys.length;
    while(l--){
        var data = accumulator.keys[l];
        result.push(data.bodyA, data.bodyB);
    }

    accumulator.reset();

    return result;
};

/**
 * Overlap data container for the OverlapKeeper
 * @param {Body} bodyA
 * @param {Shape} shapeA
 * @param {Body} bodyB
 * @param {Shape} shapeB [description]
 */
function OverlapKeeperRecord(bodyA, shapeA, bodyB, shapeB){
    /**
     * @property {Shape} shapeA
     */
    this.shapeA = shapeA;
    /**
     * @property {Shape} shapeB
     */
    this.shapeB = shapeB;
    /**
     * @property {Body} bodyA
     */
    this.bodyA = bodyA;
    /**
     * @property {Body} bodyB
     */
    this.bodyB = bodyB;
}

OverlapKeeperRecord.prototype.set = function(bodyA, shapeA, bodyB, shapeB){
    OverlapKeeperRecord.call(this, bodyA, shapeA, bodyB, shapeB);
};

},{"./TupleDictionary":46,"./Utils":47}],46:[function(require,module,exports){
var Utils = require('./Utils');

module.exports = TupleDictionary;

/**
 * @class TupleDictionary
 * @constructor
 */
function TupleDictionary() {

    /**
     * The data storage
     * @property data
     * @type {Array}
     */
    this.data = [];

    /**
     * Keys that are currently used.
     * @type {Array}
     */
    this.keys = [];
}

/**
 * Generate a key given two integers
 * @param  {number} i
 * @param  {number} j
 * @return {string}
 */
TupleDictionary.prototype.getKey = function(id1, id2) {
    id1 = id1|0;
    id2 = id2|0;

    if ( (id1|0) === (id2|0) ){
        return -1;
    }

    // valid for values < 2^16
    return ((id1|0) > (id2|0) ?
        (id1 << 16) | (id2 & 0xFFFF) :
        (id2 << 16) | (id1 & 0xFFFF))|0
        ;
};

/**
 * @method getByKey
 * @param  {Number} key
 * @return {Object}
 */
TupleDictionary.prototype.getByKey = function(key) {
    key = key|0;
    return this.data[key];
};

/**
 * @method get
 * @param  {Number} i
 * @param  {Number} j
 * @return {Number}
 */
TupleDictionary.prototype.get = function(i, j) {
    i = i|0;
    j = j|0;
    var key = this.getKey(i, j)|0;
    return this.data[key];
};

/**
 * @method set
 * @param  {Number} i
 * @param  {Number} j
 * @param {Number} value
 */
TupleDictionary.prototype.set = function(i, j, value) {
    if(!value){
        throw new Error("No data!");
    }

    i = i|0;
    j = j|0;
    var key = this.getKey(i, j)|0;

    // Check if key already exists
    if(!this.get(i, j)){
        this.keys.push(key);
    }

    this.data[key] = value;

    return key;
};

/**
 * @method reset
 */
TupleDictionary.prototype.reset = function() {
    var data = this.data,
        keys = this.keys;

    var l = keys.length|0;
    while(l--){
        var key = keys[l]|0;
        data[key] = undefined;
    }

    keys.length = 0;
};

/**
 * @method copy
 */
TupleDictionary.prototype.copy = function(dict) {
    this.reset();
    Utils.appendArray(this.keys, dict.keys);
    var l = dict.keys.length|0;
    while(l--){
        var key = dict.keys[l]|0;
        this.data[key] = dict.data[key];
    }
};

},{"./Utils":47}],47:[function(require,module,exports){
module.exports = Utils;

/**
 * Misc utility functions
 * @class Utils
 * @constructor
 */
function Utils(){};

/**
 * Append the values in array b to the array a. See <a href="http://stackoverflow.com/questions/1374126/how-to-append-an-array-to-an-existing-javascript-array/1374131#1374131">this</a> for an explanation.
 * @method appendArray
 * @static
 * @param  {Array} a
 * @param  {Array} b
 */
Utils.appendArray = function(a,b){
    if (b.length < 150000) {
        a.push.apply(a, b);
    } else {
        for (var i = 0, len = b.length; i !== len; ++i) {
            a.push(b[i]);
        }
    }
};

/**
 * Garbage free Array.splice(). Does not allocate a new array.
 * @method splice
 * @static
 * @param  {Array} array
 * @param  {Number} index
 * @param  {Number} howmany
 */
Utils.splice = function(array,index,howmany){
    howmany = howmany || 1;
    for (var i=index, len=array.length-howmany; i < len; i++){
        array[i] = array[i + howmany];
    }
    array.length = len;
};

/**
 * The array type to use for internal numeric computations.
 * @type {Array}
 * @static
 * @property ARRAY_TYPE
 */
Utils.ARRAY_TYPE = window.Float32Array || Array;

/**
 * Extend an object with the properties of another
 * @static
 * @method extend
 * @param  {object} a
 * @param  {object} b
 */
Utils.extend = function(a,b){
    for(var key in b){
        a[key] = b[key];
    }
};

/**
 * Extend an object with the properties of another
 * @static
 * @method extend
 * @param  {object} a
 * @param  {object} b
 */
Utils.defaults = function(options, defaults){
    options = options || {};
    for(var key in defaults){
        if(!(key in options)){
            options[key] = defaults[key];
        }
    }
    return options;
};

},{}],48:[function(require,module,exports){
var Body = require('../objects/Body');

module.exports = Island;

/**
 * An island of bodies connected with equations.
 * @class Island
 * @constructor
 */
function Island(){

    /**
     * Current equations in this island.
     * @property equations
     * @type {Array}
     */
    this.equations = [];

    /**
     * Current bodies in this island.
     * @property bodies
     * @type {Array}
     */
    this.bodies = [];
}

/**
 * Clean this island from bodies and equations.
 * @method reset
 */
Island.prototype.reset = function(){
    this.equations.length = this.bodies.length = 0;
};

var bodyIds = [];

/**
 * Get all unique bodies in this island.
 * @method getBodies
 * @return {Array} An array of Body
 */
Island.prototype.getBodies = function(result){
    var bodies = result || [],
        eqs = this.equations;
    bodyIds.length = 0;
    for(var i=0; i!==eqs.length; i++){
        var eq = eqs[i];
        if(bodyIds.indexOf(eq.bodyA.id)===-1){
            bodies.push(eq.bodyA);
            bodyIds.push(eq.bodyA.id);
        }
        if(bodyIds.indexOf(eq.bodyB.id)===-1){
            bodies.push(eq.bodyB);
            bodyIds.push(eq.bodyB.id);
        }
    }
    return bodies;
};

/**
 * Check if the entire island wants to sleep.
 * @method wantsToSleep
 * @return {Boolean}
 */
Island.prototype.wantsToSleep = function(){
    for(var i=0; i<this.bodies.length; i++){
        var b = this.bodies[i];
        if(b.motionState === Body.DYNAMIC && !b.wantsToSleep){
            return false;
        }
    }
    return true;
};

/**
 * Make all bodies in the island sleep.
 * @method sleep
 */
Island.prototype.sleep = function(){
    for(var i=0; i<this.bodies.length; i++){
        var b = this.bodies[i];
        b.sleep();
    }
    return true;
};

},{"../objects/Body":31}],49:[function(require,module,exports){
var vec2 = require('../math/vec2')
,   Island = require('./Island')
,   IslandNode = require('./IslandNode')
,   Body = require('../objects/Body')

module.exports = IslandManager;

/**
 * Splits the system of bodies and equations into independent islands
 *
 * @class IslandManager
 * @constructor
 * @param {Object} [options]
 * @extends Solver
 */
function IslandManager(options){

    // Pooling of node objects saves some GC load
    this._nodePool = [];
    this._islandPool = [];

    /**
     * The equations to split. Manually fill this array before running .split().
     * @property {Array} equations
     */
    this.equations = [];

    /**
     * The resulting {{#crossLink "Island"}}{{/crossLink}}s.
     * @property {Array} islands
     */
    this.islands = [];

    /**
     * The resulting graph nodes.
     * @property {Array} nodes
     */
    this.nodes = [];

    /**
     * The node queue, used when traversing the graph of nodes.
     * @private
     * @property {Array} queue
     */
    this.queue = [];
}

/**
 * Get an unvisited node from a list of nodes.
 * @static
 * @method getUnvisitedNode
 * @param  {Array} nodes
 * @return {IslandNode|boolean} The node if found, else false.
 */
IslandManager.getUnvisitedNode = function(nodes){
    var Nnodes = nodes.length;
    for(var i=0; i!==Nnodes; i++){
        var node = nodes[i];
        if(!node.visited && node.body.motionState === Body.DYNAMIC){
            return node;
        }
    }
    return false;
};

/**
 * Visit a node.
 * @method visit
 * @param  {IslandNode} node
 * @param  {Array} bds
 * @param  {Array} eqs
 */
IslandManager.prototype.visit = function (node,bds,eqs){
    bds.push(node.body);
    var Neqs = node.equations.length;
    for(var i=0; i!==Neqs; i++){
        var eq = node.equations[i];
        if(eqs.indexOf(eq) === -1){ // Already added?
            eqs.push(eq);
        }
    }
};

/**
 * Runs the search algorithm, starting at a root node. The resulting bodies and equations will be stored in the provided arrays.
 * @method bfs
 * @param  {IslandNode} root The node to start from
 * @param  {Array} bds  An array to append resulting Bodies to.
 * @param  {Array} eqs  An array to append resulting Equations to.
 */
IslandManager.prototype.bfs = function(root,bds,eqs){

    // Reset the visit queue
    var queue = this.queue;
    queue.length = 0;

    // Add root node to queue
    queue.push(root);
    root.visited = true;
    this.visit(root,bds,eqs);

    // Process all queued nodes
    while(queue.length) {

        // Get next node in the queue
        var node = queue.pop();

        // Visit unvisited neighboring nodes
        var child;
        while((child = IslandManager.getUnvisitedNode(node.neighbors))) {
            child.visited = true;
            this.visit(child,bds,eqs);

            // Only visit the children of this node if it's dynamic
            if(child.body.motionState === Body.DYNAMIC){
                queue.push(child);
            }
        }
    }
};

/**
 * Split the world into independent islands. The result is stored in .islands.
 * @method split
 * @param  {World} world
 * @return {Array} The generated islands
 */
IslandManager.prototype.split = function(world){
    var bodies = world.bodies,
        nodes = this.nodes,
        equations = this.equations;

    // Move old nodes to the node pool
    while(nodes.length){
        this._nodePool.push(nodes.pop());
    }

    // Create needed nodes, reuse if possible
    for(var i=0; i!==bodies.length; i++){
        if(this._nodePool.length){
            var node = this._nodePool.pop();
            node.reset();
            node.body = bodies[i];
            nodes.push(node);
        } else {
            nodes.push(new IslandNode(bodies[i]));
        }
    }

    // Add connectivity data. Each equation connects 2 bodies.
    for(var k=0; k!==equations.length; k++){
        var eq=equations[k],
            i=bodies.indexOf(eq.bodyA),
            j=bodies.indexOf(eq.bodyB),
            ni=nodes[i],
            nj=nodes[j];
        ni.neighbors.push(nj);
        nj.neighbors.push(ni);
        ni.equations.push(eq);
        nj.equations.push(eq);
    }

    // Move old islands to the island pool
    var islands = this.islands;
    while(islands.length){
        var island = islands.pop();
        island.reset();
        this._islandPool.push(island);
    }

    // Get islands
    var child;
    while((child = IslandManager.getUnvisitedNode(nodes))){

        // Create new island
        var island = this._islandPool.length ? this._islandPool.pop() : new Island();

        // Get all equations and bodies in this island
        this.bfs(child, island.bodies, island.equations);

        islands.push(island);
    }

    return islands;
};

},{"../math/vec2":30,"../objects/Body":31,"./Island":48,"./IslandNode":50}],50:[function(require,module,exports){
module.exports = IslandNode;

/**
 * Holds a body and keeps track of some additional properties needed for graph traversal.
 * @class IslandNode
 * @constructor
 * @param {Body} body
 */
function IslandNode(body){

	/**
	 * The body that is contained in this node.
	 * @property {Body}
	 */
    this.body = body;

    /**
     * Neighboring IslandNodes
     * @property {Array} neighbors
     */
    this.neighbors = [];

    /**
     * Equations connected to this node.
     * @property {Array} equations
     */
    this.equations = [];

    /**
     * If this node was visiting during the graph traversal.
     * @property visited
     * @type {Boolean}
     */
    this.visited = false;
}

/**
 * Clean this node from bodies and equations.
 * @method reset
 */
IslandNode.prototype.reset = function(){
    this.equations.length = 0;
    this.neighbors.length = 0;
    this.visited = false;
    this.body = null;
};

},{}],51:[function(require,module,exports){
var  GSSolver = require('../solver/GSSolver')
,    Solver = require('../solver/Solver')
,    NaiveBroadphase = require('../collision/NaiveBroadphase')
,    vec2 = require('../math/vec2')
,    Circle = require('../shapes/Circle')
,    Rectangle = require('../shapes/Rectangle')
,    Convex = require('../shapes/Convex')
,    Line = require('../shapes/Line')
,    Plane = require('../shapes/Plane')
,    Capsule = require('../shapes/Capsule')
,    Particle = require('../shapes/Particle')
,    EventEmitter = require('../events/EventEmitter')
,    Body = require('../objects/Body')
,    Shape = require('../shapes/Shape')
,    Spring = require('../objects/Spring')
,    Material = require('../material/Material')
,    ContactMaterial = require('../material/ContactMaterial')
,    DistanceConstraint = require('../constraints/DistanceConstraint')
,    Constraint = require('../constraints/Constraint')
,    LockConstraint = require('../constraints/LockConstraint')
,    RevoluteConstraint = require('../constraints/RevoluteConstraint')
,    PrismaticConstraint = require('../constraints/PrismaticConstraint')
,    GearConstraint = require('../constraints/GearConstraint')
,    pkg = require('../../package.json')
,    Broadphase = require('../collision/Broadphase')
,    SAPBroadphase = require('../collision/SAPBroadphase')
,    Narrowphase = require('../collision/Narrowphase')
,    Utils = require('../utils/Utils')
,    OverlapKeeper = require('../utils/OverlapKeeper')
,    IslandManager = require('./IslandManager')

module.exports = World;

if(typeof performance === 'undefined'){
    performance = {};
}
if(!performance.now){
    var nowOffset = Date.now();
    if (performance.timing && performance.timing.navigationStart){
        nowOffset = performance.timing.navigationStart;
    }
    performance.now = function(){
        return Date.now() - nowOffset;
    };
}

/**
 * The dynamics world, where all bodies and constraints lives.
 *
 * @class World
 * @constructor
 * @param {Object}          [options]
 * @param {Solver}          [options.solver]            Defaults to GSSolver.
 * @param {Array}           [options.gravity]           Defaults to [0,-9.78]
 * @param {Broadphase}      [options.broadphase]        Defaults to NaiveBroadphase
 * @param {Boolean}         [options.islandSplit=false]
 * @param {Boolean}         [options.doProfiling=false]
 * @extends EventEmitter
 */
function World(options){
    EventEmitter.apply(this);

    options = options || {};

    /**
     * All springs in the world. To add a spring to the world, use {{#crossLink "World/addSpring:method"}}{{/crossLink}}.
     *
     * @property springs
     * @type {Array}
     */
    this.springs = [];

    /**
     * All bodies in the world. To add a body to the world, use {{#crossLink "World/addBody:method"}}{{/crossLink}}.
     * @property {Array} bodies
     */
    this.bodies = [];

    /**
     * Disabled body collision pairs. See {{#crossLink "World/disableBodyCollision:method"}}.
     * @private
     * @property {Array} disabledBodyCollisionPairs
     */
    this.disabledBodyCollisionPairs = [];

    /**
     * The solver used to satisfy constraints and contacts. Default is {{#crossLink "GSSolver"}}{{/crossLink}}.
     * @property {Solver} solver
     */
    this.solver = options.solver || new GSSolver();

    /**
     * The narrowphase to use to generate contacts.
     *
     * @property narrowphase
     * @type {Narrowphase}
     */
    this.narrowphase = new Narrowphase(this);

    /**
     * The island manager of this world.
     * @property {IslandManager} islandManager
     */
    this.islandManager = new IslandManager();

    /**
     * Gravity in the world. This is applied on all bodies in the beginning of each step().
     *
     * @property gravity
     * @type {Array}
     */
    this.gravity = vec2.fromValues(0, -9.78);
    if(options.gravity){
        vec2.copy(this.gravity, options.gravity);
    }

    /**
     * Gravity to use when approximating the friction max force (mu*mass*gravity).
     * @property {Number} frictionGravity
     */
    this.frictionGravity = vec2.length(this.gravity) || 10;

    /**
     * Set to true if you want .frictionGravity to be automatically set to the length of .gravity.
     * @property {Boolean} useWorldGravityAsFrictionGravity
     */
    this.useWorldGravityAsFrictionGravity = true;

    /**
     * If the length of .gravity is zero, and .useWorldGravityAsFrictionGravity=true, then switch to using .frictionGravity for friction instead. This fallback is useful for gravityless games.
     * @property {Boolean} useFrictionGravityOnZeroGravity
     */
    this.useFrictionGravityOnZeroGravity = true;

    /**
     * Whether to do timing measurements during the step() or not.
     *
     * @property doPofiling
     * @type {Boolean}
     */
    this.doProfiling = options.doProfiling || false;

    /**
     * How many millisecconds the last step() took. This is updated each step if .doProfiling is set to true.
     *
     * @property lastStepTime
     * @type {Number}
     */
    this.lastStepTime = 0.0;

    /**
     * The broadphase algorithm to use.
     *
     * @property broadphase
     * @type {Broadphase}
     */
    this.broadphase = options.broadphase || new NaiveBroadphase();
    this.broadphase.setWorld(this);

    /**
     * User-added constraints.
     *
     * @property constraints
     * @type {Array}
     */
    this.constraints = [];

    /**
     * Dummy default material in the world, used in .defaultContactMaterial
     * @property {Material} defaultMaterial
     */
    this.defaultMaterial = new Material();

    /**
     * The default contact material to use, if no contact material was set for the colliding materials.
     * @property {ContactMaterial} defaultContactMaterial
     */
    this.defaultContactMaterial = new ContactMaterial(this.defaultMaterial,this.defaultMaterial);

    /**
     * For keeping track of what time step size we used last step
     * @property lastTimeStep
     * @type {Number}
     */
    this.lastTimeStep = 1/60;

    /**
     * Enable to automatically apply spring forces each step.
     * @property applySpringForces
     * @type {Boolean}
     */
    this.applySpringForces = true;

    /**
     * Enable to automatically apply body damping each step.
     * @property applyDamping
     * @type {Boolean}
     */
    this.applyDamping = true;

    /**
     * Enable to automatically apply gravity each step.
     * @property applyGravity
     * @type {Boolean}
     */
    this.applyGravity = true;

    /**
     * Enable/disable constraint solving in each step.
     * @property solveConstraints
     * @type {Boolean}
     */
    this.solveConstraints = true;

    /**
     * The ContactMaterials added to the World.
     * @property contactMaterials
     * @type {Array}
     */
    this.contactMaterials = [];

    /**
     * World time.
     * @property time
     * @type {Number}
     */
    this.time = 0.0;

    /**
     * Is true during the step().
     * @property {Boolean} stepping
     */
    this.stepping = false;

    /**
     * Bodies that are scheduled to be removed at the end of the step.
     * @property {Array} bodiesToBeRemoved
     * @private
     */
    this.bodiesToBeRemoved = [];

    this.fixedStepTime = 0.0;

    /**
     * Whether to enable island splitting. Island splitting can be an advantage for many things, including solver performance. See {{#crossLink "IslandManager"}}{{/crossLink}}.
     * @property {Boolean} islandSplit
     */
    this.islandSplit = typeof(options.islandSplit)!=="undefined" ? !!options.islandSplit : false;

    /**
     * Set to true if you want to the world to emit the "impact" event. Turning this off could improve performance.
     * @property emitImpactEvent
     * @type {Boolean}
     */
    this.emitImpactEvent = true;

    // Id counters
    this._constraintIdCounter = 0;
    this._bodyIdCounter = 0;

    /**
     * Fired after the step().
     * @event postStep
     */
    this.postStepEvent = {
        type : "postStep",
    };

    /**
     * Fired when a body is added to the world.
     * @event addBody
     * @param {Body} body
     */
    this.addBodyEvent = {
        type : "addBody",
        body : null
    };

    /**
     * Fired when a body is removed from the world.
     * @event removeBody
     * @param {Body} body
     */
    this.removeBodyEvent = {
        type : "removeBody",
        body : null
    };

    /**
     * Fired when a spring is added to the world.
     * @event addSpring
     * @param {Spring} spring
     */
    this.addSpringEvent = {
        type : "addSpring",
        spring : null,
    };

    /**
     * Fired when a first contact is created between two bodies. This event is fired after the step has been done.
     * @event impact
     * @param {Body} bodyA
     * @param {Body} bodyB
     */
    this.impactEvent = {
        type: "impact",
        bodyA : null,
        bodyB : null,
        shapeA : null,
        shapeB : null,
        contactEquation : null,
    };

    /**
     * Fired after the Broadphase has collected collision pairs in the world.
     * Inside the event handler, you can modify the pairs array as you like, to
     * prevent collisions between objects that you don't want.
     * @event postBroadphase
     * @param {Array} pairs An array of collision pairs. If this array is [body1,body2,body3,body4], then the body pairs 1,2 and 3,4 would advance to narrowphase.
     */
    this.postBroadphaseEvent = {
        type:"postBroadphase",
        pairs:null,
    };

    /**
     * Enable / disable automatic body sleeping. Sleeping can improve performance. You might need to {{#crossLink "Body/wakeUp:method"}}wake up{{/crossLink}} the bodies if they fall asleep when they shouldn't. If you want to enable sleeping in the world, but want to disable it for a particular body, see {{#crossLink "Body/allowSleep:property"}}Body.allowSleep{{/crossLink}}.
     * @property allowSleep
     * @type {Boolean}
     */
    this.enableBodySleeping = false;

    /**
     * Enable or disable island sleeping. Note that you must enable {{#crossLink "World/islandSplit:property"}}.islandSplit{{/crossLink}} for this to work.
     * @property {Boolean} enableIslandSleeping
     */
    this.enableIslandSleeping = false;

    /**
     * Fired when two shapes starts start to overlap. Fired in the narrowphase, during step.
     * @event beginContact
     * @param {Shape} shapeA
     * @param {Shape} shapeB
     * @param {Body}  bodyA
     * @param {Body}  bodyB
     * @param {Array} contactEquations
     */
    this.beginContactEvent = {
        type:"beginContact",
        shapeA : null,
        shapeB : null,
        bodyA : null,
        bodyB : null,
        contactEquations : [],
    };

    /**
     * Fired when two shapes stop overlapping, after the narrowphase (during step).
     * @event endContact
     * @param {Shape} shapeA
     * @param {Shape} shapeB
     * @param {Body}  bodyA
     * @param {Body}  bodyB
     * @param {Array} contactEquations
     */
    this.endContactEvent = {
        type:"endContact",
        shapeA : null,
        shapeB : null,
        bodyA : null,
        bodyB : null,
    };

    /**
     * Fired just before equations are added to the solver to be solved. Can be used to control what equations goes into the solver.
     * @event preSolve
     * @param {Array} contactEquations  An array of contacts to be solved.
     * @param {Array} frictionEquations An array of friction equations to be solved.
     */
    this.preSolveEvent = {
        type:"preSolve",
        contactEquations:null,
        frictionEquations:null,
    };

    // For keeping track of overlapping shapes
    this.overlappingShapesLastState = { keys:[] };
    this.overlappingShapesCurrentState = { keys:[] };

    this.overlapKeeper = new OverlapKeeper();
}
World.prototype = new Object(EventEmitter.prototype);

/**
 * Add a constraint to the simulation.
 *
 * @method addConstraint
 * @param {Constraint} c
 */
World.prototype.addConstraint = function(c){
    this.constraints.push(c);
};

/**
 * Add a ContactMaterial to the simulation.
 * @method addContactMaterial
 * @param {ContactMaterial} contactMaterial
 */
World.prototype.addContactMaterial = function(contactMaterial){
    this.contactMaterials.push(contactMaterial);
};

/**
 * Removes a contact material
 *
 * @method removeContactMaterial
 * @param {ContactMaterial} cm
 */
World.prototype.removeContactMaterial = function(cm){
    var idx = this.contactMaterials.indexOf(cm);
    if(idx!==-1){
        Utils.splice(this.contactMaterials,idx,1);
    }
};

/**
 * Get a contact material given two materials
 * @method getContactMaterial
 * @param {Material} materialA
 * @param {Material} materialB
 * @return {ContactMaterial} The matching ContactMaterial, or false on fail.
 * @todo Use faster hash map to lookup from material id's
 */
World.prototype.getContactMaterial = function(materialA,materialB){
    var cmats = this.contactMaterials;
    for(var i=0, N=cmats.length; i!==N; i++){
        var cm = cmats[i];
        if( (cm.materialA === materialA) && (cm.materialB === materialB) ||
            (cm.materialA === materialB) && (cm.materialB === materialA) ){
            return cm;
        }
    }
    return false;
};

/**
 * Removes a constraint
 *
 * @method removeConstraint
 * @param {Constraint} c
 */
World.prototype.removeConstraint = function(c){
    var idx = this.constraints.indexOf(c);
    if(idx!==-1){
        Utils.splice(this.constraints,idx,1);
    }
};

var step_r = vec2.create(),
    step_runit = vec2.create(),
    step_u = vec2.create(),
    step_f = vec2.create(),
    step_fhMinv = vec2.create(),
    step_velodt = vec2.create(),
    step_mg = vec2.create(),
    xiw = vec2.fromValues(0,0),
    xjw = vec2.fromValues(0,0),
    zero = vec2.fromValues(0,0),
    interpvelo = vec2.fromValues(0,0);

/**
 * Step the physics world forward in time.
 *
 * There are two modes. The simple mode is fixed timestepping without interpolation. In this case you only use the first argument. The second case uses interpolation. In that you also provide the time since the function was last used, as well as the maximum fixed timesteps to take.
 *
 * @method step
 * @param {Number} dt                       The fixed time step size to use.
 * @param {Number} [timeSinceLastCalled=0]  The time elapsed since the function was last called.
 * @param {Number} [maxSubSteps=10]         Maximum number of fixed steps to take per function call.
 *
 * @example
 *     // fixed timestepping without interpolation
 *     var world = new World();
 *     world.step(0.01);
 *
 * @see http://bulletphysics.org/mediawiki-1.5.8/index.php/Stepping_The_World
 */
World.prototype.step = function(dt,timeSinceLastCalled,maxSubSteps){
    maxSubSteps = maxSubSteps || 10;
    timeSinceLastCalled = timeSinceLastCalled || 0;

    if(timeSinceLastCalled === 0){ // Fixed, simple stepping

        this.internalStep(dt);

        // Increment time
        this.time += dt;

    } else {

        // Compute the number of fixed steps we should have taken since the last step
        var internalSteps = Math.floor( (this.time+timeSinceLastCalled) / dt) - Math.floor(this.time / dt);
        internalSteps = Math.min(internalSteps,maxSubSteps);

        // Do some fixed steps to catch up
        for(var i=0; i!==internalSteps; i++){
            this.internalStep(dt);
        }

        // Increment internal clock
        this.time += timeSinceLastCalled;

        // Compute "Left over" time step
        var h = this.time % dt;
        var h_div_dt = h/dt;

        for(var j=0; j!==this.bodies.length; j++){
            var b = this.bodies[j];
            if(b.motionState !== Body.STATIC && b.sleepState !== Body.SLEEPING){
                // Interpolate
                vec2.sub(interpvelo, b.position, b.previousPosition);
                vec2.scale(interpvelo, interpvelo, h_div_dt);
                vec2.add(b.interpolatedPosition, b.position, interpvelo);

                b.interpolatedAngle = b.angle + (b.angle - b.previousAngle) * h_div_dt;
            } else {
                // For static bodies, just copy. Who else will do it?
                vec2.copy(b.interpolatedPosition, b.position);
                b.interpolatedAngle = b.angle;
            }
        }
    }
};

var endOverlaps = [];

/**
 * Make a fixed step.
 * @method internalStep
 * @param  {number} dt
 * @private
 */
World.prototype.internalStep = function(dt){
    this.stepping = true;

    var that = this,
        doProfiling = this.doProfiling,
        Nsprings = this.springs.length,
        springs = this.springs,
        bodies = this.bodies,
        g = this.gravity,
        solver = this.solver,
        Nbodies = this.bodies.length,
        broadphase = this.broadphase,
        np = this.narrowphase,
        constraints = this.constraints,
        t0, t1,
        fhMinv = step_fhMinv,
        velodt = step_velodt,
        mg = step_mg,
        scale = vec2.scale,
        add = vec2.add,
        rotate = vec2.rotate,
        islandManager = this.islandManager;

    this.lastTimeStep = dt;

    if(doProfiling){
        t0 = performance.now();
    }

    // Update approximate friction gravity.
    if(this.useWorldGravityAsFrictionGravity){
        var gravityLen = vec2.length(this.gravity);
        if(gravityLen === 0 && this.useFrictionGravityOnZeroGravity){
            // Leave friction gravity as it is.
        } else {
            // Nonzero gravity. Use it.
            this.frictionGravity = gravityLen;
        }
    }

    // Add gravity to bodies
    if(this.applyGravity){
        for(var i=0; i!==Nbodies; i++){
            var b = bodies[i],
                fi = b.force;
            if(b.motionState !== Body.DYNAMIC || b.sleepState === Body.SLEEPING){
                continue;
            }
            vec2.scale(mg,g,b.mass*b.gravityScale); // F=m*g
            add(fi,fi,mg);
        }
    }

    // Add spring forces
    if(this.applySpringForces){
        for(var i=0; i!==Nsprings; i++){
            var s = springs[i];
            s.applyForce();
        }
    }

    if(this.applyDamping){
        for(var i=0; i!==Nbodies; i++){
            var b = bodies[i];
            if(b.motionState === Body.DYNAMIC){
                b.applyDamping(dt);
            }
        }
    }

    // Broadphase
    var result = broadphase.getCollisionPairs(this);

    // Remove ignored collision pairs
    var ignoredPairs = this.disabledBodyCollisionPairs;
    for(var i=ignoredPairs.length-2; i>=0; i-=2){
        for(var j=result.length-2; j>=0; j-=2){
            if( (ignoredPairs[i]   === result[j] && ignoredPairs[i+1] === result[j+1]) ||
                (ignoredPairs[i+1] === result[j] && ignoredPairs[i]   === result[j+1])){
                result.splice(j,2);
            }
        }
    }

    // Remove constrained pairs with collideConnected == false
    var Nconstraints = constraints.length;
    for(i=0; i!==Nconstraints; i++){
        var c = constraints[i];
        if(!c.collideConnected){
            for(var j=result.length-2; j>=0; j-=2){
                if( (c.bodyA === result[j] && c.bodyB === result[j+1]) ||
                    (c.bodyB === result[j] && c.bodyA === result[j+1])){
                    result.splice(j,2);
                }
            }
        }
    }

    // postBroadphase event
    this.postBroadphaseEvent.pairs = result;
    this.emit(this.postBroadphaseEvent);

    // Narrowphase
    np.reset(this);
    for(var i=0, Nresults=result.length; i!==Nresults; i+=2){
        var bi = result[i],
            bj = result[i+1];

        // Loop over all shapes of body i
        for(var k=0, Nshapesi=bi.shapes.length; k!==Nshapesi; k++){
            var si = bi.shapes[k],
                xi = bi.shapeOffsets[k],
                ai = bi.shapeAngles[k];

            // All shapes of body j
            for(var l=0, Nshapesj=bj.shapes.length; l!==Nshapesj; l++){
                var sj = bj.shapes[l],
                    xj = bj.shapeOffsets[l],
                    aj = bj.shapeAngles[l];

                var cm = this.defaultContactMaterial;
                if(si.material && sj.material){
                    var tmp = this.getContactMaterial(si.material,sj.material);
                    if(tmp){
                        cm = tmp;
                    }
                }

                this.runNarrowphase(np,bi,si,xi,ai,bj,sj,xj,aj,cm,this.frictionGravity);
            }
        }
    }

    // Wake up bodies
    for(var i=0; i!==Nbodies; i++){
        var body = bodies[i];
        if(body._wakeUpAfterNarrowphase){
            body.wakeUp();
            body._wakeUpAfterNarrowphase = false;
        }
    }

    // Emit end overlap events
    if(this.has('endContact')){
        this.overlapKeeper.getEndOverlaps(endOverlaps);
        var e = this.endContactEvent;
        var l = endOverlaps.length;
        while(l--){
            var data = endOverlaps[l];
            e.shapeA = data.shapeA;
            e.shapeB = data.shapeB;
            e.bodyA = data.bodyA;
            e.bodyB = data.bodyA;
            this.emit(e);
        }
    }
    this.overlapKeeper.tick();

    var preSolveEvent = this.preSolveEvent;
    preSolveEvent.contactEquations = np.contactEquations;
    preSolveEvent.frictionEquations = np.frictionEquations;
    this.emit(preSolveEvent);

    // update constraint equations
    var Nconstraints = constraints.length;
    for(i=0; i!==Nconstraints; i++){
        constraints[i].update();
    }

    if(np.contactEquations.length || np.frictionEquations.length || constraints.length){
        if(this.islandSplit){
            // Split into islands
            islandManager.equations.length = 0;
            Utils.appendArray(islandManager.equations, np.contactEquations);
            Utils.appendArray(islandManager.equations, np.frictionEquations);
            for(i=0; i!==Nconstraints; i++){
                Utils.appendArray(islandManager.equations, constraints[i].equations);
            }
            islandManager.split(this);

            for(var i=0; i!==islandManager.islands.length; i++){
                var island = islandManager.islands[i];
                if(island.equations.length){
                    solver.solveIsland(dt,island);
                }
            }

        } else {

            // Add contact equations to solver
            solver.addEquations(np.contactEquations);
            solver.addEquations(np.frictionEquations);

            // Add user-defined constraint equations
            for(i=0; i!==Nconstraints; i++){
                solver.addEquations(constraints[i].equations);
            }

            if(this.solveConstraints){
                solver.solve(dt,this);
            }

            solver.removeAllEquations();
        }
    }

    // Step forward
    for(var i=0; i!==Nbodies; i++){
        var body = bodies[i];

        if(body.sleepState !== Body.SLEEPING && body.motionState !== Body.STATIC){
            World.integrateBody(body,dt);
        }
    }

    // Reset force
    for(var i=0; i!==Nbodies; i++){
        bodies[i].setZeroForce();
    }

    if(doProfiling){
        t1 = performance.now();
        that.lastStepTime = t1-t0;
    }

    // Emit impact event
    if(this.emitImpactEvent && this.has('impact')){
        var ev = this.impactEvent;
        for(var i=0; i!==np.contactEquations.length; i++){
            var eq = np.contactEquations[i];
            if(eq.firstImpact){
                ev.bodyA = eq.bodyA;
                ev.bodyB = eq.bodyB;
                ev.shapeA = eq.shapeA;
                ev.shapeB = eq.shapeB;
                ev.contactEquation = eq;
                this.emit(ev);
            }
        }
    }

    // Sleeping update
    if(this.enableBodySleeping){
        for(i=0; i!==Nbodies; i++){
            bodies[i].sleepTick(this.time, false, dt);
        }
    } else if(this.enableIslandSleeping && this.islandSplit){

        // Tell all bodies to sleep tick but dont sleep yet
        for(i=0; i!==Nbodies; i++){
            bodies[i].sleepTick(this.time, true, dt);
        }

        // Sleep islands
        for(var i=0; i<this.islandManager.islands.length; i++){
            var island = this.islandManager.islands[i];
            if(island.wantsToSleep()){
                island.sleep();
            }
        }
    }

    this.stepping = false;

    // Remove bodies that are scheduled for removal
    if(this.bodiesToBeRemoved.length){
        for(var i=0; i!==this.bodiesToBeRemoved.length; i++){
            this.removeBody(this.bodiesToBeRemoved[i]);
        }
        this.bodiesToBeRemoved.length = 0;
    }

    this.emit(this.postStepEvent);
};

var ib_fhMinv = vec2.create();
var ib_velodt = vec2.create();

/**
 * Move a body forward in time.
 * @static
 * @method integrateBody
 * @param  {Body} body
 * @param  {Number} dt
 * @todo Move to Body.prototype?
 */
World.integrateBody = function(body,dt){
    var minv = body.invMass,
        f = body.force,
        pos = body.position,
        velo = body.velocity;

    // Save old position
    vec2.copy(body.previousPosition, body.position);
    body.previousAngle = body.angle;

    // Angular step
    if(!body.fixedRotation){
        body.angularVelocity += body.angularForce * body.invInertia * dt;
        body.angle += body.angularVelocity * dt;
    }

    // Linear step
    vec2.scale(ib_fhMinv,f,dt*minv);
    vec2.add(velo,ib_fhMinv,velo);
    vec2.scale(ib_velodt,velo,dt);
    vec2.add(pos,pos,ib_velodt);

    body.aabbNeedsUpdate = true;
};

/**
 * Runs narrowphase for the shape pair i and j.
 * @method runNarrowphase
 * @param  {Narrowphase} np
 * @param  {Body} bi
 * @param  {Shape} si
 * @param  {Array} xi
 * @param  {Number} ai
 * @param  {Body} bj
 * @param  {Shape} sj
 * @param  {Array} xj
 * @param  {Number} aj
 * @param  {Number} mu
 */
World.prototype.runNarrowphase = function(np,bi,si,xi,ai,bj,sj,xj,aj,cm,glen){

    // Check collision groups and masks
    if(!((si.collisionGroup & sj.collisionMask) !== 0 && (sj.collisionGroup & si.collisionMask) !== 0)){
        return;
    }

    // Get world position and angle of each shape
    vec2.rotate(xiw, xi, bi.angle);
    vec2.rotate(xjw, xj, bj.angle);
    vec2.add(xiw, xiw, bi.position);
    vec2.add(xjw, xjw, bj.position);
    var aiw = ai + bi.angle;
    var ajw = aj + bj.angle;

    np.enableFriction = cm.friction > 0;
    np.frictionCoefficient = cm.friction;
    var reducedMass;
    if(bi.motionState === Body.STATIC || bi.motionState === Body.KINEMATIC){
        reducedMass = bj.mass;
    } else if(bj.motionState === Body.STATIC || bj.motionState === Body.KINEMATIC){
        reducedMass = bi.mass;
    } else {
        reducedMass = (bi.mass*bj.mass)/(bi.mass+bj.mass);
    }
    np.slipForce = cm.friction*glen*reducedMass;
    np.restitution = cm.restitution;
    np.surfaceVelocity = cm.surfaceVelocity;
    np.frictionStiffness = cm.frictionStiffness;
    np.frictionRelaxation = cm.frictionRelaxation;
    np.stiffness = cm.stiffness;
    np.relaxation = cm.relaxation;

    var resolver = np[si.type | sj.type],
        numContacts = 0;
    if (resolver) {
        var sensor = si.sensor || sj.sensor;
        var numFrictionBefore = np.frictionEquations.length;
        if (si.type < sj.type) {
            numContacts = resolver.call(np, bi,si,xiw,aiw, bj,sj,xjw,ajw, sensor);
        } else {
            numContacts = resolver.call(np, bj,sj,xjw,ajw, bi,si,xiw,aiw, sensor);
        }
        var numFrictionEquations = np.frictionEquations.length - numFrictionBefore;

        if(numContacts){

            if( bi.allowSleep &&
                bi.motionState === Body.DYNAMIC &&
                bi.sleepState  === Body.SLEEPING &&
                bj.sleepState  === Body.AWAKE &&
                bj.motionState !== Body.STATIC
            ){
                var speedSquaredB = vec2.squaredLength(bj.velocity) + Math.pow(bj.angularVelocity,2);
                var speedLimitSquaredB = Math.pow(bj.sleepSpeedLimit,2);
                if(speedSquaredB >= speedLimitSquaredB*2){
                    bi._wakeUpAfterNarrowphase = true;
                }
            }

            if( bj.allowSleep &&
                bj.motionState === Body.DYNAMIC &&
                bj.sleepState  === Body.SLEEPING &&
                bi.sleepState  === Body.AWAKE &&
                bi.motionState !== Body.STATIC
            ){
                var speedSquaredA = vec2.squaredLength(bi.velocity) + Math.pow(bi.angularVelocity,2);
                var speedLimitSquaredA = Math.pow(bi.sleepSpeedLimit,2);
                if(speedSquaredA >= speedLimitSquaredA*2){
                    bj._wakeUpAfterNarrowphase = true;
                }
            }

            this.overlapKeeper.setOverlapping(bi, si, bj, sj);
            if(this.has('beginContact') && this.overlapKeeper.isNewOverlap(si, sj)){

                // Report new shape overlap
                var e = this.beginContactEvent;
                e.shapeA = si;
                e.shapeB = sj;
                e.bodyA = bi;
                e.bodyB = bj;

                // Reset contact equations
                e.contactEquations.length = 0;

                if(typeof(numContacts)==="number"){
                    for(var i=np.contactEquations.length-numContacts; i<np.contactEquations.length; i++){
                        e.contactEquations.push(np.contactEquations[i]);
                    }
                }

                this.emit(e);
            }

            // divide the max friction force by the number of contacts
            if(typeof(numContacts)==="number" && numFrictionEquations > 1){ // Why divide by 1?
                for(var i=np.frictionEquations.length-numFrictionEquations; i<np.frictionEquations.length; i++){
                    var f = np.frictionEquations[i];
                    f.setSlipForce(f.getSlipForce() / numFrictionEquations);
                }
            }
        }
    }

};

/**
 * Add a spring to the simulation
 *
 * @method addSpring
 * @param {Spring} s
 */
World.prototype.addSpring = function(s){
    this.springs.push(s);
    this.addSpringEvent.spring = s;
    this.emit(this.addSpringEvent);
};

/**
 * Remove a spring
 *
 * @method removeSpring
 * @param {Spring} s
 */
World.prototype.removeSpring = function(s){
    var idx = this.springs.indexOf(s);
    if(idx===-1){
        Utils.splice(this.springs,idx,1);
    }
};

/**
 * Add a body to the simulation
 *
 * @method addBody
 * @param {Body} body
 *
 * @example
 *     var world = new World(),
 *         body = new Body();
 *     world.addBody(body);
 * @todo What if this is done during step?
 */
World.prototype.addBody = function(body){
    if(this.bodies.indexOf(body) === -1){
        this.bodies.push(body);
        body.world = this;
        this.addBodyEvent.body = body;
        this.emit(this.addBodyEvent);
    }
};

/**
 * Remove a body from the simulation. If this method is called during step(), the body removal is scheduled to after the step.
 *
 * @method removeBody
 * @param {Body} body
 */
World.prototype.removeBody = function(body){
    if(this.stepping){
        this.bodiesToBeRemoved.push(body);
    } else {
        body.world = null;
        var idx = this.bodies.indexOf(body);
        if(idx!==-1){
            Utils.splice(this.bodies,idx,1);
            this.removeBodyEvent.body = body;
            body.resetConstraintVelocity();
            this.emit(this.removeBodyEvent);
        }
    }
};

/**
 * Get a body by its id.
 * @method getBodyById
 * @return {Body|Boolean} The body, or false if it was not found.
 */
World.prototype.getBodyById = function(id){
    var bodies = this.bodies;
    for(var i=0; i<bodies.length; i++){
        var b = bodies[i];
        if(b.id === id){
            return b;
        }
    }
    return false;
};

/**
 * Disable collision between two bodies
 * @method disableCollision
 * @param {Body} bodyA
 * @param {Body} bodyB
 */
World.prototype.disableBodyCollision = function(bodyA,bodyB){
    this.disabledBodyCollisionPairs.push(bodyA,bodyB);
};

/**
 * Enable collisions between the given two bodies
 * @method enableCollision
 * @param {Body} bodyA
 * @param {Body} bodyB
 */
World.prototype.enableBodyCollision = function(bodyA,bodyB){
    var pairs = this.disabledBodyCollisionPairs;
    for(var i=0; i<pairs.length; i+=2){
        if((pairs[i] === bodyA && pairs[i+1] === bodyB) || (pairs[i+1] === bodyA && pairs[i] === bodyB)){
            pairs.splice(i,2);
            return;
        }
    }
};


function v2a(v){
    if(!v) return v;
    return [v[0],v[1]];
}

function extend(a,b){
    for(var key in b)
        a[key] = b[key];
}

function contactMaterialToJSON(cm){
    return {
        id : cm.id,
        materialA :             cm.materialA.id,
        materialB :             cm.materialB.id,
        friction :              cm.friction,
        restitution :           cm.restitution,
        stiffness :             cm.stiffness,
        relaxation :            cm.relaxation,
        frictionStiffness :     cm.frictionStiffness,
        frictionRelaxation :    cm.frictionRelaxation,
    };
}

/**
 * Convert the world to a JSON-serializable Object.
 *
 * @method toJSON
 * @return {Object}
 * @deprecated Should use Serializer instead.
 */
World.prototype.toJSON = function(){
    var world = this;

    var json = {
        p2 :                        pkg.version,
        bodies :                    [],
        springs :                   [],
        solver :                    {},
        gravity :                   v2a(world.gravity),
        broadphase :                {},
        distanceConstraints :       [],
        revoluteConstraints :       [],
        prismaticConstraints :      [],
        lockConstraints :           [],
        gearConstraints :           [],
        contactMaterials :          [],
        materials :                 [],
        defaultContactMaterial :    contactMaterialToJSON(world.defaultContactMaterial),
        islandSplit :               world.islandSplit,
        enableIslandSleeping :      world.enableIslandSleeping,
        enableBodySleeping :        world.enableBodySleeping,
    };

    // Solver
    var js = json.solver,
        s = world.solver;
    if(s.type === Solver.GS){
        js.type = "GSSolver";
        js.iterations = s.iterations;
    }

    // Broadphase
    var jb = json.broadphase,
        wb = world.broadphase;
    if(wb.type === Broadphase.NAIVE){
        jb.type = "NaiveBroadphase";
    } else if(wb.type === Broadphase.SAP) {
        jb.type = "SAPBroadphase";
        //jb.axisIndex = wb.axisIndex;
    } else {
        console.error("Broadphase not supported: "+wb.type);
    }

    // Serialize springs
    for(var i=0; i!==world.springs.length; i++){
        var s = world.springs[i];
        json.springs.push({
            bodyA :         world.bodies.indexOf(s.bodyA),
            bodyB :         world.bodies.indexOf(s.bodyB),
            stiffness :     s.stiffness,
            damping :       s.damping,
            restLength :    s.restLength,
            localAnchorA :  v2a(s.localAnchorA),
            localAnchorB :  v2a(s.localAnchorB),
        });
    }

    // Serialize constraints
    for(var i=0; i<world.constraints.length; i++){
        var c = world.constraints[i];
        var jc = {
            bodyA : world.bodies.indexOf(c.bodyA),
            bodyB : world.bodies.indexOf(c.bodyB),
            collideConnected : c.collideConnected
        };

        switch(c.type){

        case Constraint.DISTANCE:
            extend(jc,{
                distance : c.distance,
                maxForce : c.getMaxForce(),
            });
            json.distanceConstraints.push(jc);
            break;

        case Constraint.REVOLUTE:
            extend(jc,{
                pivotA :            v2a(c.pivotA),
                pivotB :            v2a(c.pivotB),
                maxForce :          c.maxForce,
                motorSpeed :        c.getMotorSpeed() || 0,
                motorEnabled :       !!c.getMotorSpeed(),
                lowerLimit :        c.lowerLimit,
                lowerLimitEnabled : c.lowerLimitEnabled,
                upperLimit :        c.upperLimit,
                upperLimitEnabled : c.upperLimitEnabled,
            });
            json.revoluteConstraints.push(jc);
            break;

        case Constraint.PRISMATIC:
            extend(jc,{
                localAxisA :    v2a(c.localAxisA),
                localAnchorA :  v2a(c.localAnchorA),
                localAnchorB :  v2a(c.localAnchorB),
                maxForce :      c.maxForce,
                upperLimitEnabled : c.upperLimitEnabled,
                lowerLimitEnabled : c.lowerLimitEnabled,
                upperLimit : c.upperLimit,
                lowerLimit : c.lowerLimit,
                motorEnabled : c.motorEnabled,
                motorSpeed : c.motorSpeed,
            });
            json.prismaticConstraints.push(jc);
            break;

        case Constraint.LOCK:
            extend(jc,{
                localOffsetB :  v2a(c.localOffsetB),
                localAngleB :   c.localAngleB,
                maxForce :      c.getMaxForce(),
            });
            json.lockConstraints.push(jc);
            break;

        case Constraint.GEAR:
            extend(jc,{
                angle :     c.angle,
                ratio :     c.ratio,
                maxForce :  c.maxForce || 1e6, // correct?
            });
            json.gearConstraints.push(jc);
            break;

        default:
            console.error("Constraint not supported yet: ",c.type);
            break;
        }
    }

    // Serialize bodies
    for(var i=0; i!==world.bodies.length; i++){
        var b = world.bodies[i],
            ss = b.shapes,
            jsonBody = {
                id : b.id,
                mass : b.mass,
                angle : b.angle,
                position : v2a(b.position),
                velocity : v2a(b.velocity),
                angularVelocity : b.angularVelocity,
                force : v2a(b.force),
                motionState : b.motionState,
                fixedRotation : b.fixedRotation,
                circleShapes :    [],
                planeShapes :     [],
                particleShapes :  [],
                lineShapes :      [],
                rectangleShapes : [],
                convexShapes :    [],
                capsuleShapes :   [],
            };

        if(b.concavePath){
            jsonBody.concavePath = b.concavePath;
        }

        for(var j=0; j<ss.length; j++){
            var s = ss[j],
                jsonShape = {};

            jsonShape.offset = v2a(b.shapeOffsets[j]);
            jsonShape.angle = b.shapeAngles[j];
            jsonShape.collisionGroup = s.collisionGroup;
            jsonShape.collisionMask = s.collisionMask;
            jsonShape.material = s.material ? s.material.id : null;

            // Check type
            switch(s.type){

            case Shape.CIRCLE:
                extend(jsonShape,{ radius : s.radius, });
                jsonBody.circleShapes.push(jsonShape);
                break;

            case Shape.PLANE:
                jsonBody.planeShapes.push(jsonShape);
                break;

            case Shape.PARTICLE:
                jsonBody.particleShapes.push(jsonShape);
                break;

            case Shape.LINE:
                jsonShape.length = s.length;
                jsonBody.lineShapes.push(jsonShape);
                break;

            case Shape.RECTANGLE:
                extend(jsonShape,{   width : s.width,
                                     height : s.height });
                jsonBody.rectangleShapes.push(jsonShape);
                break;

            case Shape.CONVEX:
                var verts = [];
                for(var k=0; k<s.vertices.length; k++){
                    verts.push(v2a(s.vertices[k]));
                }
                extend(jsonShape,{ vertices : verts });
                jsonBody.convexShapes.push(jsonShape);
                break;

            case Shape.CAPSULE:
                extend(jsonShape,{ length : s.length, radius : s.radius });
                jsonBody.capsuleShapes.push(jsonShape);
                break;

            default:
                console.error("Shape type not supported yet!");
                break;
            }
        }

        json.bodies.push(jsonBody);
    }

    // Serialize contactmaterials
    for(var i=0; i<world.contactMaterials.length; i++){
        var cm = world.contactMaterials[i];
        json.contactMaterials.push(contactMaterialToJSON(cm));
    }

    // Serialize materials
    var mats = {};
    // Get unique materials first
    for(var i=0; i<world.contactMaterials.length; i++){
        var cm = world.contactMaterials[i];
        mats[cm.materialA.id+''] = cm.materialA;
        mats[cm.materialB.id+''] = cm.materialB;
    }
    for(var matId in mats){
        var m = mats[parseInt(matId)];
        json.materials.push({
            id : m.id,
        });
    }

    return json;
};

/**
 * Load a scene from a serialized state in JSON format.
 *
 * @method fromJSON
 * @param  {Object} json
 * @return {Boolean} True on success, else false.
 */
World.prototype.fromJSON = function(json){
    this.clear();

    if(!json.p2){
        return false;
    }

    var w = this;

    // Set gravity
    vec2.copy(w.gravity, json.gravity);

    w.islandSplit =           json.islandSplit;
    w.enableIslandSleeping =  json.enableIslandSleeping;
    w.enableBodySleeping =    json.enableBodySleeping;

    // Set solver
    switch(json.solver.type){
    case "GSSolver":
        var js = json.solver,
            s = new GSSolver();
        w.solver = s;
        s.iterations = js.iterations;
        break;
    default:
        throw new Error("Solver type not recognized: "+json.solver.type);
    }

    // Broadphase
    switch(json.broadphase.type){
    case "NaiveBroadphase":
        w.broadphase = new NaiveBroadphase();
        break;

    case "SAPBroadphase":
        w.broadphase = new SAPBroadphase();
        break;
    }
    w.broadphase.setWorld(w);


    var bodies = w.bodies;

    // Load materials
    var id2material = {};
    for(var i=0; i!==json.materials.length; i++){
        var jm = json.materials[i];
        var m = new Material();
        id2material[jm.id+""] = m;
        m.id = jm.id;
    }

    // Load default material
    w.defaultMaterial.id = json.defaultContactMaterial.materialA;

    // Load bodies
    for(var i=0; i!==json.bodies.length; i++){
        var jb = json.bodies[i];

        // Create body
        var b = new Body({
            mass :              jb.mass,
            position :          jb.position,
            angle :             jb.angle,
            velocity :          jb.velocity,
            angularVelocity :   jb.angularVelocity,
            force :             jb.force,
            fixedRotation :     jb.fixedRotation,
        });
        b.id = jb.id;
        b.motionState = jb.motionState;

        // Circle
        for(var j=0; j<jb.circleShapes.length; j++){
            var s = jb.circleShapes[j];
            addShape(b, new Circle(s.radius), s);
        }

        // Plane
        for(var j=0; j<jb.planeShapes.length; j++){
            var s = jb.planeShapes[j];
            addShape(b, new Plane(), s);
        }

        // Particle
        for(var j=0; j<jb.particleShapes.length; j++){
            var s = jb.particleShapes[j];
            addShape(b, new Particle(), s);
        }

        // Line
        for(var j=0; j<jb.lineShapes.length; j++){
            var s = jb.lineShapes[j];
            addShape(b, new Line(s.length), s);
        }

        // Rectangle
        for(var j=0; j<jb.rectangleShapes.length; j++){
            var s = jb.rectangleShapes[j];
            addShape(b, new Rectangle(s.width,s.height), s);
        }

        // Convex
        for(var j=0; j<jb.convexShapes.length; j++){
            var s = jb.convexShapes[j];
            addShape(b, new Convex(s.vertices), s);
        }

        // Capsule
        for(var j=0; j<jb.capsuleShapes.length; j++){
            var s = jb.capsuleShapes[j];
            addShape(b, new Capsule(s.length, s.radius), s);
        }

        function addShape(body, shape, shapeJSON){
            shape.collisionMask = shapeJSON.collisionMask;
            shape.collisionGroup = shapeJSON.collisionGroup;
            if(shapeJSON.material){
                shape.material = id2material[shapeJSON.material+""];
            }
            body.addShape(shape, shapeJSON.offset, shapeJSON.angle);
        }

        if(jb.concavePath){
            b.concavePath = jb.concavePath;
        }

        w.addBody(b);
    }

    // Load springs
    for(var i=0; i<json.springs.length; i++){
        var js = json.springs[i];
        var bodyA = bodies[js.bodyA],
            bodyB = bodies[js.bodyB];
        if(!bodyA){
            this.error = "instance.springs["+i+"] references instance.body["+js.bodyA+"], which does not exist.";
            return false;
        }
        if(!bodyB){
            this.error = "instance.springs["+i+"] references instance.body["+js.bodyB+"], which does not exist.";
            return false;
        }
        var s = new Spring(bodyA, bodyB, {
            stiffness : js.stiffness,
            damping : js.damping,
            restLength : js.restLength,
            localAnchorA : js.localAnchorA,
            localAnchorB : js.localAnchorB,
        });
        w.addSpring(s);
    }

    // Load contact materials
    for(var i=0; i<json.contactMaterials.length; i++){
        var jm = json.contactMaterials[i],
            matA = id2material[jm.materialA+""],
            matB = id2material[jm.materialB+""];

        if(!matA){
            this.error = "Reference to material id "+jm.materialA+": material not found";
            return false;
        }
        if(!matB){
            this.error = "Reference to material id "+jm.materialB+": material not found";
            return false;
        }

        var cm = new ContactMaterial(matA, matB, {
            friction :              jm.friction,
            restitution :           jm.restitution,
            stiffness :             jm.stiffness,
            relaxation :            jm.relaxation,
            frictionStiffness :     jm.frictionStiffness,
            frictionRelaxation :    jm.frictionRelaxation,
        });
        cm.id = jm.id;
        w.addContactMaterial(cm);
    }

    // Load default contact material
    var jm = json.defaultContactMaterial,
        matA = w.defaultMaterial,
        matB = w.defaultMaterial;
    var cm = new ContactMaterial(matA, matB, {
        friction :              jm.friction,
        restitution :           jm.restitution,
        stiffness :             jm.stiffness,
        relaxation :            jm.relaxation,
        frictionStiffness :     jm.frictionStiffness,
        frictionRelaxation :    jm.frictionRelaxation,
    });
    cm.id = jm.id;
    w.defaultContactMaterial = cm;

    // DistanceConstraint
    for(var i=0; i<json.distanceConstraints.length; i++){
        var c = json.distanceConstraints[i];
        w.addConstraint(new DistanceConstraint( bodies[c.bodyA], bodies[c.bodyB], c.distance, {
            maxForce:c.maxForce,
            collideConnected:c.collideConnected
        }));
    }

    // RevoluteConstraint
    for(var i=0; i<json.revoluteConstraints.length; i++){
        var c = json.revoluteConstraints[i];
        var revolute = new RevoluteConstraint(bodies[c.bodyA], c.pivotA, bodies[c.bodyB], c.pivotB, {
            maxForce: c.maxForce,
            collideConnected: c.collideConnected
        });
        if(c.motorEnabled){
            revolute.enableMotor();
        }
        revolute.setMotorSpeed(c.motorSpeed);
        revolute.lowerLimit = c.lowerLimit;
        revolute.upperLimit = c.upperLimit;
        revolute.lowerLimitEnabled = c.lowerLimitEnabled;
        revolute.upperLimitEnabled = c.upperLimitEnabled;
        w.addConstraint(revolute);
    }

    // PrismaticConstraint
    for(var i=0; i<json.prismaticConstraints.length; i++){
        var c = json.prismaticConstraints[i],
            p = new PrismaticConstraint(bodies[c.bodyA], bodies[c.bodyB], {
                maxForce : c.maxForce,
                localAxisA : c.localAxisA,
                localAnchorA : c.localAnchorA,
                localAnchorB : c.localAnchorB,
                collideConnected: c.collideConnected
            });
        p.motorSpeed = c.motorSpeed;
        w.addConstraint(p);
    }

    // LockConstraint
    for(var i=0; i<json.lockConstraints.length; i++){
        var c = json.lockConstraints[i];
        w.addConstraint(new LockConstraint(bodies[c.bodyA], bodies[c.bodyB], {
            maxForce :     c.maxForce,
            localOffsetB : c.localOffsetB,
            localAngleB :  c.localAngleB,
            collideConnected: c.collideConnected
        }));
    }

    // GearConstraint
    for(var i=0; i<json.gearConstraints.length; i++){
        var c = json.gearConstraints[i];
        w.addConstraint(new GearConstraint(bodies[c.bodyA], bodies[c.bodyB], {
            maxForce :      c.maxForce,
            angle :         c.angle,
            ratio :         c.ratio,
            collideConnected: c.collideConnected
        }));
    }

    return true;
};

/**
 * Resets the World, removes all bodies, constraints and springs.
 *
 * @method clear
 */
World.prototype.clear = function(){

    this.time = 0;
    this.fixedStepTime = 0;

    // Remove all solver equations
    if(this.solver && this.solver.equations.length){
        this.solver.removeAllEquations();
    }

    // Remove all constraints
    var cs = this.constraints;
    for(var i=cs.length-1; i>=0; i--){
        this.removeConstraint(cs[i]);
    }

    // Remove all bodies
    var bodies = this.bodies;
    for(var i=bodies.length-1; i>=0; i--){
        this.removeBody(bodies[i]);
    }

    // Remove all springs
    var springs = this.springs;
    for(var i=springs.length-1; i>=0; i--){
        this.removeSpring(springs[i]);
    }

    // Remove all contact materials
    var cms = this.contactMaterials;
    for(var i=cms.length-1; i>=0; i--){
        this.removeContactMaterial(cms[i]);
    }

    World.apply(this);
};

/**
 * Get a copy of this World instance
 * @method clone
 * @return {World}
 */
World.prototype.clone = function(){
    var world = new World();
    world.fromJSON(this.toJSON());
    return world;
};

var hitTest_tmp1 = vec2.create(),
    hitTest_zero = vec2.fromValues(0,0),
    hitTest_tmp2 = vec2.fromValues(0,0);

/**
 * Test if a world point overlaps bodies
 * @method hitTest
 * @param  {Array}  worldPoint  Point to use for intersection tests
 * @param  {Array}  bodies      A list of objects to check for intersection
 * @param  {Number} precision   Used for matching against particles and lines. Adds some margin to these infinitesimal objects.
 * @return {Array}              Array of bodies that overlap the point
 */
World.prototype.hitTest = function(worldPoint,bodies,precision){
    precision = precision || 0;

    // Create a dummy particle body with a particle shape to test against the bodies
    var pb = new Body({ position:worldPoint }),
        ps = new Particle(),
        px = worldPoint,
        pa = 0,
        x = hitTest_tmp1,
        zero = hitTest_zero,
        tmp = hitTest_tmp2;
    pb.addShape(ps);

    var n = this.narrowphase,
        result = [];

    // Check bodies
    for(var i=0, N=bodies.length; i!==N; i++){
        var b = bodies[i];
        for(var j=0, NS=b.shapes.length; j!==NS; j++){
            var s = b.shapes[j],
                offset = b.shapeOffsets[j] || zero,
                angle = b.shapeAngles[j] || 0.0;

            // Get shape world position + angle
            vec2.rotate(x, offset, b.angle);
            vec2.add(x, x, b.position);
            var a = angle + b.angle;

            if( (s instanceof Circle    && n.circleParticle  (b,s,x,a,     pb,ps,px,pa, true)) ||
                (s instanceof Convex    && n.particleConvex  (pb,ps,px,pa, b,s,x,a,     true)) ||
                (s instanceof Plane     && n.particlePlane   (pb,ps,px,pa, b,s,x,a,     true)) ||
                (s instanceof Capsule   && n.particleCapsule (pb,ps,px,pa, b,s,x,a,     true)) ||
                (s instanceof Particle  && vec2.squaredLength(vec2.sub(tmp,x,worldPoint)) < precision*precision)
                ){
                result.push(b);
            }
        }
    }

    return result;
};

/**
 * Sets the Equation parameters for all constraints and contact materials.
 * @method setGlobalEquationParameters
 * @param {object} [parameters]
 * @param {Number} [parameters.relaxation]
 * @param {Number} [parameters.stiffness]
 */
World.prototype.setGlobalEquationParameters = function(parameters){
    parameters = parameters || {};

    // Set for all constraints
    for(var i=0; i !== this.constraints.length; i++){
        var c = this.constraints[i];
        for(var j=0; j !== c.equations.length; j++){
            var eq = c.equations[j];
            if(typeof(parameters.stiffness) !== "undefined"){
                eq.stiffness = parameters.stiffness;
            }
            if(typeof(parameters.relaxation) !== "undefined"){
                eq.relaxation = parameters.relaxation;
            }
            eq.needsUpdate = true;
        }
    }

    // Set for all contact materials
    for(var i=0; i !== this.contactMaterials.length; i++){
        var c = this.contactMaterials[i];
        if(typeof(parameters.stiffness) !== "undefined"){
            c.stiffness = parameters.stiffness;
            c.frictionStiffness = parameters.stiffness;
        }
        if(typeof(parameters.relaxation) !== "undefined"){
            c.relaxation = parameters.relaxation;
            c.frictionRelaxation = parameters.relaxation;
        }
    }

    // Set for default contact material
    var c = this.defaultContactMaterial;
    if(typeof(parameters.stiffness) !== "undefined"){
        c.stiffness = parameters.stiffness;
        c.frictionStiffness = parameters.stiffness;
    }
    if(typeof(parameters.relaxation) !== "undefined"){
        c.relaxation = parameters.relaxation;
        c.frictionRelaxation = parameters.relaxation;
    }
};

/**
 * Set the stiffness for all equations and contact materials.
 * @method setGlobalStiffness
 * @param {Number} stiffness
 */
World.prototype.setGlobalStiffness = function(stiffness){
    this.setGlobalEquationParameters({
        stiffness: stiffness
    });
};

/**
 * Set the relaxation for all equations and contact materials.
 * @method setGlobalRelaxation
 * @param {Number} relaxation
 */
World.prototype.setGlobalRelaxation = function(relaxation){
    this.setGlobalEquationParameters({
        relaxation: relaxation
    });
};

},{"../../package.json":7,"../collision/Broadphase":9,"../collision/NaiveBroadphase":11,"../collision/Narrowphase":12,"../collision/SAPBroadphase":13,"../constraints/Constraint":14,"../constraints/DistanceConstraint":15,"../constraints/GearConstraint":16,"../constraints/LockConstraint":17,"../constraints/PrismaticConstraint":18,"../constraints/RevoluteConstraint":19,"../events/EventEmitter":26,"../material/ContactMaterial":27,"../material/Material":28,"../math/vec2":30,"../objects/Body":31,"../objects/Spring":32,"../shapes/Capsule":34,"../shapes/Circle":35,"../shapes/Convex":36,"../shapes/Line":38,"../shapes/Particle":39,"../shapes/Plane":40,"../shapes/Rectangle":41,"../shapes/Shape":42,"../solver/GSSolver":43,"../solver/Solver":44,"../utils/OverlapKeeper":45,"../utils/Utils":47,"./IslandManager":49}]},{},[33])
(33)
});
;;
/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

//  Add an extra properties to p2 that we need
p2.Body.prototype.parent = null;
p2.Spring.prototype.parent = null;

/**
* @class Phaser.Physics.P2
* @classdesc Physics World Constructor
* @constructor
* @param {Phaser.Game} game - Reference to the current game instance.
* @param {object} [config] - Physics configuration object passed in from the game constructor.
*/
Phaser.Physics.P2 = function (game, config) {

    /**
    * @property {Phaser.Game} game - Local reference to game.
    */
    this.game = game;

    if (typeof config === 'undefined' || !config.hasOwnProperty('gravity') || !config.hasOwnProperty('broadphase'))
    {
        config = { gravity: [0, 0], broadphase: new p2.SAPBroadphase() };
    }

    /**
    * @property {p2.World} world - The p2 World in which the simulation is run.
    * @protected
    */
    this.world = new p2.World(config);

    /**
    * @property {number} frameRate - The frame rate the world will be stepped at. Defaults to 1 / 60, but you can change here. Also see useElapsedTime property.
    * @default
    */
    this.frameRate = 1 / 60;

    /**
    * @property {boolean} useElapsedTime - If true the frameRate value will be ignored and instead p2 will step with the value of Game.Time.physicsElapsed, which is a delta time value.
    * @default
    */
    this.useElapsedTime = false;

    /**
    * @property {boolean} paused - The paused state of the P2 World.
    * @default
    */
    this.paused = false;

    /**
    * @property {array<Phaser.Physics.P2.Material>} materials - A local array of all created Materials.
    * @protected
    */
    this.materials = [];

    /**
    * @property {Phaser.Physics.P2.InversePointProxy} gravity - The gravity applied to all bodies each step.
    */
    this.gravity = new Phaser.Physics.P2.InversePointProxy(this, this.world.gravity);

    /**
    * @property {object} walls - An object containing the 4 wall bodies that bound the physics world.
    */
    this.walls = { left: null, right: null, top: null, bottom: null };

    /**
    * @property {Phaser.Signal} onBodyAdded - Dispatched when a new Body is added to the World.
    */
    this.onBodyAdded = new Phaser.Signal();

    /**
    * @property {Phaser.Signal} onBodyRemoved - Dispatched when a Body is removed from the World.
    */
    this.onBodyRemoved = new Phaser.Signal();

    /**
    * @property {Phaser.Signal} onSpringAdded - Dispatched when a new Spring is added to the World.
    */
    this.onSpringAdded = new Phaser.Signal();

    /**
    * @property {Phaser.Signal} onSpringRemoved - Dispatched when a Spring is removed from the World.
    */
    this.onSpringRemoved = new Phaser.Signal();

    /**
    * @property {Phaser.Signal} onConstraintAdded - Dispatched when a new Constraint is added to the World.
    */
    this.onConstraintAdded = new Phaser.Signal();

    /**
    * @property {Phaser.Signal} onConstraintRemoved - Dispatched when a Constraint is removed from the World.
    */
    this.onConstraintRemoved = new Phaser.Signal();

    /**
    * @property {Phaser.Signal} onContactMaterialAdded - Dispatched when a new ContactMaterial is added to the World.
    */
    this.onContactMaterialAdded = new Phaser.Signal();

    /**
    * @property {Phaser.Signal} onContactMaterialRemoved - Dispatched when a ContactMaterial is removed from the World.
    */
    this.onContactMaterialRemoved = new Phaser.Signal();

    /**
    * @property {function} postBroadphaseCallback - A postBroadphase callback.
    */
    this.postBroadphaseCallback = null;

    /**
    * @property {object} callbackContext - The context under which the callbacks are fired.
    */
    this.callbackContext = null;

    /**
    * @property {Phaser.Signal} onBeginContact - Dispatched when a first contact is created between two bodies. This event is fired before the step has been done.
    */
    this.onBeginContact = new Phaser.Signal();

    /**
    * @property {Phaser.Signal} onEndContact - Dispatched when final contact occurs between two bodies. This event is fired before the step has been done.
    */
    this.onEndContact = new Phaser.Signal();

    //  Pixel to meter function overrides
    if (config.hasOwnProperty('mpx') && config.hasOwnProperty('pxm') && config.hasOwnProperty('mpxi') && config.hasOwnProperty('pxmi'))
    {
        this.mpx = config.mpx;
        this.mpxi = config.mpxi;
        this.pxm = config.pxm;
        this.pxmi = config.pxmi;
    }

    //  Hook into the World events
    this.world.on("beginContact", this.beginContactHandler, this);
    this.world.on("endContact", this.endContactHandler, this);

    /**
    * @property {array} collisionGroups - An array containing the collision groups that have been defined in the World.
    */
    this.collisionGroups = [];

    /**
    * @property {Phaser.Physics.P2.CollisionGroup} nothingCollisionGroup - A default collision group.
    */
    this.nothingCollisionGroup = new Phaser.Physics.P2.CollisionGroup(1);

    /**
    * @property {Phaser.Physics.P2.CollisionGroup} boundsCollisionGroup - A default collision group.
    */
    this.boundsCollisionGroup = new Phaser.Physics.P2.CollisionGroup(2);

    /**
    * @property {Phaser.Physics.P2.CollisionGroup} everythingCollisionGroup - A default collision group.
    */
    this.everythingCollisionGroup = new Phaser.Physics.P2.CollisionGroup(2147483648);

    /**
    * @property {array} boundsCollidesWith - An array of the bodies the world bounds collides with.
    */
    this.boundsCollidesWith = [];

    /**
    * @property {array} _toRemove - Internal var used to hold references to bodies to remove from the world on the next step.
    * @private
    */
    this._toRemove = [];

    /**
    * @property {number} _collisionGroupID - Internal var.
    * @private
    */
    this._collisionGroupID = 2;

    //  By default we want everything colliding with everything
    this.setBoundsToWorld(true, true, true, true, false);

};

Phaser.Physics.P2.prototype = {

    /**
    * This will add a P2 Physics body into the removal list for the next step.
    *
    * @method Phaser.Physics.P2#removeBodyNextStep
    * @param {Phaser.Physics.P2.Body} body - The body to remove at the start of the next step.
    */
    removeBodyNextStep: function (body) {

        this._toRemove.push(body);

    },

    /**
    * Called at the start of the core update loop. Purges flagged bodies from the world.
    *
    * @method Phaser.Physics.P2#preUpdate
    */
    preUpdate: function () {

        var i = this._toRemove.length;

        while (i--)
        {
            this.removeBody(this._toRemove[i]);
        }

        this._toRemove.length = 0;

    },

    /**
    * This will create a P2 Physics body on the given game object or array of game objects.
    * A game object can only have 1 physics body active at any one time, and it can't be changed until the object is destroyed.
    * Note: When the game object is enabled for P2 physics it has its anchor x/y set to 0.5 so it becomes centered.
    *
    * @method Phaser.Physics.P2#enable
    * @param {object|array|Phaser.Group} object - The game object to create the physics body on. Can also be an array or Group of objects, a body will be created on every child that has a `body` property.
    * @param {boolean} [debug=false] - Create a debug object to go with this body?
    * @param {boolean} [children=true] - Should a body be created on all children of this object? If true it will recurse down the display list as far as it can go.
    */
    enable: function (object, debug, children) {

        if (typeof debug === 'undefined') { debug = false; }
        if (typeof children === 'undefined') { children = true; }

        var i = 1;

        if (Array.isArray(object))
        {
            i = object.length;

            while (i--)
            {
                if (object[i] instanceof Phaser.Group)
                {
                    //  If it's a Group then we do it on the children regardless
                    this.enable(object[i].children, debug, children);
                }
                else
                {
                    this.enableBody(object[i], debug);

                    if (children && object[i].hasOwnProperty('children') && object[i].children.length > 0)
                    {
                        this.enable(object[i], debug, true);
                    }
                }
            }
        }
        else
        {
            if (object instanceof Phaser.Group)
            {
                //  If it's a Group then we do it on the children regardless
                this.enable(object.children, debug, children);
            }
            else
            {
                this.enableBody(object, debug);

                if (children && object.hasOwnProperty('children') && object.children.length > 0)
                {
                    this.enable(object.children, debug, true);
                }
            }
        }

    },

    /**
    * Creates a P2 Physics body on the given game object.
    * A game object can only have 1 physics body active at any one time, and it can't be changed until the body is nulled.
    *
    * @method Phaser.Physics.P2#enableBody
    * @param {object} object - The game object to create the physics body on. A body will only be created if this object has a null `body` property.
    * @param {boolean} debug - Create a debug object to go with this body?
    */
    enableBody: function (object, debug) {

        if (object.hasOwnProperty('body') && object.body === null)
        {
            object.body = new Phaser.Physics.P2.Body(this.game, object, object.x, object.y, 1);
            object.body.debug = debug;
            object.anchor.set(0.5);
        }

    },

    /**
    * Impact event handling is disabled by default. Enable it before any impact events will be dispatched.
    * In a busy world hundreds of impact events can be generated every step, so only enable this if you cannot do what you need via beginContact or collision masks.
    *
    * @method Phaser.Physics.P2#setImpactEvents
    * @param {boolean} state - Set to true to enable impact events, or false to disable.
    */
    setImpactEvents: function (state) {

        if (state)
        {
            this.world.on("impact", this.impactHandler, this);
        }
        else
        {
            this.world.off("impact", this.impactHandler, this);
        }

    },

    /**
    * Sets a callback to be fired after the Broadphase has collected collision pairs in the world.
    * Just because a pair exists it doesn't mean they *will* collide, just that they potentially could do.
    * If your calback returns `false` the pair will be removed from the narrowphase. This will stop them testing for collision this step.
    * Returning `true` from the callback will ensure they are checked in the narrowphase.
    *
    * @method Phaser.Physics.P2#setPostBroadphaseCallback
    * @param {function} callback - The callback that will receive the postBroadphase event data. It must return a boolean. Set to null to disable an existing callback.
    * @param {object} context - The context under which the callback will be fired.
    */
    setPostBroadphaseCallback: function (callback, context) {

        this.postBroadphaseCallback = callback;
        this.callbackContext = context;

        if (callback !== null)
        {
            this.world.on("postBroadphase", this.postBroadphaseHandler, this);
        }
        else
        {
            this.world.off("postBroadphase", this.postBroadphaseHandler, this);
        }

    },

    /**
    * Internal handler for the postBroadphase event.
    *
    * @method Phaser.Physics.P2#postBroadphaseHandler
    * @private
    * @param {object} event - The event data.
    */
    postBroadphaseHandler: function (event) {

        if (this.postBroadphaseCallback)
        {
            var i = event.pairs.length;

            while (i -= 2)
            {
                if (event.pairs[i].parent && event.pairs[i+1].parent && !this.postBroadphaseCallback.call(this.callbackContext, event.pairs[i].parent, event.pairs[i+1].parent))
                {
                    event.pairs.splice(i, 2);
                }
            }
        }

    },

    /**
    * Handles a p2 impact event.
    *
    * @method Phaser.Physics.P2#impactHandler
    * @private
    * @param {object} event - The event data.
    */
    impactHandler: function (event) {

        if (event.bodyA.parent && event.bodyB.parent)
        {
            //  Body vs. Body callbacks
            var a = event.bodyA.parent;
            var b = event.bodyB.parent;

            if (a._bodyCallbacks[event.bodyB.id])
            {
                a._bodyCallbacks[event.bodyB.id].call(a._bodyCallbackContext[event.bodyB.id], a, b, event.shapeA, event.shapeB);
            }

            if (b._bodyCallbacks[event.bodyA.id])
            {
                b._bodyCallbacks[event.bodyA.id].call(b._bodyCallbackContext[event.bodyA.id], b, a, event.shapeB, event.shapeA);
            }

            //  Body vs. Group callbacks
            if (a._groupCallbacks[event.shapeB.collisionGroup])
            {
                a._groupCallbacks[event.shapeB.collisionGroup].call(a._groupCallbackContext[event.shapeB.collisionGroup], a, b, event.shapeA, event.shapeB);
            }

            if (b._groupCallbacks[event.shapeA.collisionGroup])
            {
                b._groupCallbacks[event.shapeA.collisionGroup].call(b._groupCallbackContext[event.shapeA.collisionGroup], b, a, event.shapeB, event.shapeA);
            }
        }

    },

    /**
    * Handles a p2 begin contact event.
    *
    * @method Phaser.Physics.P2#beginContactHandler
    * @param {object} event - The event data.
    */
    beginContactHandler: function (event) {

        this.onBeginContact.dispatch(event.bodyA, event.bodyB, event.shapeA, event.shapeB, event.contactEquations);

        if (event.bodyA.parent)
        {
            event.bodyA.parent.onBeginContact.dispatch(event.bodyB.parent, event.shapeA, event.shapeB, event.contactEquations);
        }

        if (event.bodyB.parent)
        {
            event.bodyB.parent.onBeginContact.dispatch(event.bodyA.parent, event.shapeB, event.shapeA, event.contactEquations);
        }

    },

    /**
    * Handles a p2 end contact event.
    *
    * @method Phaser.Physics.P2#endContactHandler
    * @param {object} event - The event data.
    */
    endContactHandler: function (event) {

        this.onEndContact.dispatch(event.bodyA, event.bodyB, event.shapeA, event.shapeB);

        if (event.bodyA.parent)
        {
            event.bodyA.parent.onEndContact.dispatch(event.bodyB.parent, event.shapeA, event.shapeB);
        }

        if (event.bodyB.parent)
        {
            event.bodyB.parent.onEndContact.dispatch(event.bodyA.parent, event.shapeB, event.shapeA);
        }

    },

    /**
    * Sets the bounds of the Physics world to match the Game.World dimensions.
    * You can optionally set which 'walls' to create: left, right, top or bottom.
    *
    * @method Phaser.Physics#setBoundsToWorld
    * @param {boolean} [left=true] - If true will create the left bounds wall.
    * @param {boolean} [right=true] - If true will create the right bounds wall.
    * @param {boolean} [top=true] - If true will create the top bounds wall.
    * @param {boolean} [bottom=true] - If true will create the bottom bounds wall.
    * @param {boolean} [setCollisionGroup=true] - If true the Bounds will be set to use its own Collision Group.
    */
    setBoundsToWorld: function (left, right, top, bottom, setCollisionGroup) {

        this.setBounds(this.game.world.bounds.x, this.game.world.bounds.y, this.game.world.bounds.width, this.game.world.bounds.height, left, right, top, bottom, setCollisionGroup);

    },

    /**
    * Sets the given material against the 4 bounds of this World.
    *
    * @method Phaser.Physics#setWorldMaterial
    * @param {Phaser.Physics.P2.Material} material - The material to set.
    * @param {boolean} [left=true] - If true will set the material on the left bounds wall.
    * @param {boolean} [right=true] - If true will set the material on the right bounds wall.
    * @param {boolean} [top=true] - If true will set the material on the top bounds wall.
    * @param {boolean} [bottom=true] - If true will set the material on the bottom bounds wall.
    */
    setWorldMaterial: function (material, left, right, top, bottom) {

        if (typeof left === 'undefined') { left = true; }
        if (typeof right === 'undefined') { right = true; }
        if (typeof top === 'undefined') { top = true; }
        if (typeof bottom === 'undefined') { bottom = true; }

        if (left && this.walls.left)
        {
            this.walls.left.shapes[0].material = material;
        }

        if (right && this.walls.right)
        {
            this.walls.right.shapes[0].material = material;
        }

        if (top && this.walls.top)
        {
            this.walls.top.shapes[0].material = material;
        }

        if (bottom && this.walls.bottom)
        {
            this.walls.bottom.shapes[0].material = material;
        }

    },

    /**
    * By default the World will be set to collide everything with everything. The bounds of the world is a Body with 4 shapes, one for each face.
    * If you start to use your own collision groups then your objects will no longer collide with the bounds.
    * To fix this you need to adjust the bounds to use its own collision group first BEFORE changing your Sprites collision group.
    *
    * @method Phaser.Physics.P2#updateBoundsCollisionGroup
    * @param {boolean} [setCollisionGroup=true] - If true the Bounds will be set to use its own Collision Group.
    */
    updateBoundsCollisionGroup: function (setCollisionGroup) {

        var mask = this.everythingCollisionGroup.mask;

        if (typeof setCollisionGroup === 'undefined') { mask = this.boundsCollisionGroup.mask; }

        if (this.walls.left)
        {
            this.walls.left.shapes[0].collisionGroup = mask;
        }

        if (this.walls.right)
        {
            this.walls.right.shapes[0].collisionGroup = mask;
        }

        if (this.walls.top)
        {
            this.walls.top.shapes[0].collisionGroup = mask;
        }

        if (this.walls.bottom)
        {
            this.walls.bottom.shapes[0].collisionGroup = mask;
        }

    },

    /**
    * Sets the bounds of the Physics world to match the given world pixel dimensions.
    * You can optionally set which 'walls' to create: left, right, top or bottom.
    *
    * @method Phaser.Physics.P2#setBounds
    * @param {number} x - The x coordinate of the top-left corner of the bounds.
    * @param {number} y - The y coordinate of the top-left corner of the bounds.
    * @param {number} width - The width of the bounds.
    * @param {number} height - The height of the bounds.
    * @param {boolean} [left=true] - If true will create the left bounds wall.
    * @param {boolean} [right=true] - If true will create the right bounds wall.
    * @param {boolean} [top=true] - If true will create the top bounds wall.
    * @param {boolean} [bottom=true] - If true will create the bottom bounds wall.
    * @param {boolean} [setCollisionGroup=true] - If true the Bounds will be set to use its own Collision Group.
    */
    setBounds: function (x, y, width, height, left, right, top, bottom, setCollisionGroup) {

        if (typeof left === 'undefined') { left = true; }
        if (typeof right === 'undefined') { right = true; }
        if (typeof top === 'undefined') { top = true; }
        if (typeof bottom === 'undefined') { bottom = true; }
        if (typeof setCollisionGroup === 'undefined') { setCollisionGroup = true; }

        if (this.walls.left)
        {
            this.world.removeBody(this.walls.left);
        }

        if (this.walls.right)
        {
            this.world.removeBody(this.walls.right);
        }

        if (this.walls.top)
        {
            this.world.removeBody(this.walls.top);
        }

        if (this.walls.bottom)
        {
            this.world.removeBody(this.walls.bottom);
        }

        if (left)
        {
            this.walls.left = new p2.Body({ mass: 0, position: [ this.pxmi(x), this.pxmi(y) ], angle: 1.5707963267948966 });
            this.walls.left.addShape(new p2.Plane());

            if (setCollisionGroup)
            {
                this.walls.left.shapes[0].collisionGroup = this.boundsCollisionGroup.mask;
            }

            this.world.addBody(this.walls.left);
        }

        if (right)
        {
            this.walls.right = new p2.Body({ mass: 0, position: [ this.pxmi(x + width), this.pxmi(y) ], angle: -1.5707963267948966 });
            this.walls.right.addShape(new p2.Plane());

            if (setCollisionGroup)
            {
                this.walls.right.shapes[0].collisionGroup = this.boundsCollisionGroup.mask;
            }

            this.world.addBody(this.walls.right);
        }

        if (top)
        {
            this.walls.top = new p2.Body({ mass: 0, position: [ this.pxmi(x), this.pxmi(y) ], angle: -3.141592653589793 });
            this.walls.top.addShape(new p2.Plane());

            if (setCollisionGroup)
            {
                this.walls.top.shapes[0].collisionGroup = this.boundsCollisionGroup.mask;
            }

            this.world.addBody(this.walls.top);
        }

        if (bottom)
        {
            this.walls.bottom = new p2.Body({ mass: 0, position: [ this.pxmi(x), this.pxmi(y + height) ] });
            this.walls.bottom.addShape(new p2.Plane());

            if (setCollisionGroup)
            {
                this.walls.bottom.shapes[0].collisionGroup = this.boundsCollisionGroup.mask;
            }

            this.world.addBody(this.walls.bottom);
        }

    },

    /**
    * Pauses the P2 World independent of the game pause state.
    *
    * @method Phaser.Physics.P2#pause
    */
    pause: function() {

        this.paused = true;

    },
    
    /**
    * Resumes a paused P2 World.
    *
    * @method Phaser.Physics.P2#resume
    */
    resume: function() {

        this.paused = false;

    },

    /**
    * Internal P2 update loop.
    *
    * @method Phaser.Physics.P2#update
    */
    update: function () {

        // Do nothing when the pysics engine was paused before
        if (this.paused)
        {
            return;
        }

        if (this.useElapsedTime)
        {
            this.world.step(this.game.time.physicsElapsed);
        }
        else
        {
            this.world.step(this.frameRate);
        }

    },

    /**
    * Clears all bodies from the simulation, resets callbacks and resets the collision bitmask.
    *
    * @method Phaser.Physics.P2#clear
    */
    clear: function () {

        this.world.clear();

        this.world.off("beginContact", this.beginContactHandler, this);
        this.world.off("endContact", this.endContactHandler, this);

        this.postBroadphaseCallback = null;
        this.callbackContext = null;
        this.impactCallback = null;

        this.collisionGroups = [];
        this._toRemove = [];
        this._collisionGroupID = 2;
        this.boundsCollidesWith = [];

    },

    /**
    * Clears all bodies from the simulation and unlinks World from Game. Should only be called on game shutdown. Call `clear` on a State change.
    *
    * @method Phaser.Physics.P2#destroy
    */
    destroy: function () {

        this.clear();

        this.game = null;

    },

    /**
    * Add a body to the world.
    *
    * @method Phaser.Physics.P2#addBody
    * @param {Phaser.Physics.P2.Body} body - The Body to add to the World.
    * @return {boolean} True if the Body was added successfully, otherwise false.
    */
    addBody: function (body) {

        if (body.data.world)
        {
            return false;
        }
        else
        {
            this.world.addBody(body.data);

            this.onBodyAdded.dispatch(body);

            return true;
        }

    },

    /**
    * Removes a body from the world. This will silently fail if the body wasn't part of the world to begin with.
    *
    * @method Phaser.Physics.P2#removeBody
    * @param {Phaser.Physics.P2.Body} body - The Body to remove from the World.
    * @return {Phaser.Physics.P2.Body} The Body that was removed.
    */
    removeBody: function (body) {

        if (body.data.world == this.world)
        {
            this.world.removeBody(body.data);

            this.onBodyRemoved.dispatch(body);
        }

        return body;

    },

    /**
    * Adds a Spring to the world.
    *
    * @method Phaser.Physics.P2#addSpring
    * @param {Phaser.Physics.P2.Spring} spring - The Spring to add to the World.
    * @return {Phaser.Physics.P2.Spring} The Spring that was added.
    */
    addSpring: function (spring) {

        this.world.addSpring(spring);

        this.onSpringAdded.dispatch(spring);

        return spring;

    },

    /**
    * Removes a Spring from the world.
    *
    * @method Phaser.Physics.P2#removeSpring
    * @param {Phaser.Physics.P2.Spring} spring - The Spring to remove from the World.
    * @return {Phaser.Physics.P2.Spring} The Spring that was removed.
    */
    removeSpring: function (spring) {

        this.world.removeSpring(spring);

        this.onSpringRemoved.dispatch(spring);

        return spring;

    },

    /**
    * Creates a constraint that tries to keep the distance between two bodies constant.
    *
    * @method Phaser.Physics.P2#createDistanceConstraint
    * @param {Phaser.Sprite|Phaser.Physics.P2.Body|p2.Body} bodyA - First connected body.
    * @param {Phaser.Sprite|Phaser.Physics.P2.Body|p2.Body} bodyB - Second connected body.
    * @param {number} distance - The distance to keep between the bodies.
    * @param {number} [maxForce] - The maximum force that should be applied to constrain the bodies.
    * @return {Phaser.Physics.P2.DistanceConstraint} The constraint
    */
    createDistanceConstraint: function (bodyA, bodyB, distance, maxForce) {

        bodyA = this.getBody(bodyA);
        bodyB = this.getBody(bodyB);

        if (!bodyA || !bodyB)
        {
            console.warn('Cannot create Constraint, invalid body objects given');
        }
        else
        {
            return this.addConstraint(new Phaser.Physics.P2.DistanceConstraint(this, bodyA, bodyB, distance, maxForce));
        }

    },

    /**
    * Creates a constraint that tries to keep the distance between two bodies constant.
    *
    * @method Phaser.Physics.P2#createGearConstraint
    * @param {Phaser.Sprite|Phaser.Physics.P2.Body|p2.Body} bodyA - First connected body.
    * @param {Phaser.Sprite|Phaser.Physics.P2.Body|p2.Body} bodyB - Second connected body.
    * @param {number} [angle=0] - The relative angle
    * @param {number} [ratio=1] - The gear ratio.
    * @return {Phaser.Physics.P2.GearConstraint} The constraint
    */
    createGearConstraint: function (bodyA, bodyB, angle, ratio) {

        bodyA = this.getBody(bodyA);
        bodyB = this.getBody(bodyB);

        if (!bodyA || !bodyB)
        {
            console.warn('Cannot create Constraint, invalid body objects given');
        }
        else
        {
            return this.addConstraint(new Phaser.Physics.P2.GearConstraint(this, bodyA, bodyB, angle, ratio));
        }

    },

    /**
    * Connects two bodies at given offset points, letting them rotate relative to each other around this point.
    * The pivot points are given in world (pixel) coordinates.
    *
    * @method Phaser.Physics.P2#createRevoluteConstraint
    * @param {Phaser.Sprite|Phaser.Physics.P2.Body|p2.Body} bodyA - First connected body.
    * @param {Array} pivotA - The point relative to the center of mass of bodyA which bodyA is constrained to. The value is an array with 2 elements matching x and y, i.e: [32, 32].
    * @param {Phaser.Sprite|Phaser.Physics.P2.Body|p2.Body} bodyB - Second connected body.
    * @param {Array} pivotB - The point relative to the center of mass of bodyB which bodyB is constrained to. The value is an array with 2 elements matching x and y, i.e: [32, 32].
    * @param {number} [maxForce=0] - The maximum force that should be applied to constrain the bodies.
    * @return {Phaser.Physics.P2.RevoluteConstraint} The constraint
    */
    createRevoluteConstraint: function (bodyA, pivotA, bodyB, pivotB, maxForce) {

        bodyA = this.getBody(bodyA);
        bodyB = this.getBody(bodyB);

        if (!bodyA || !bodyB)
        {
            console.warn('Cannot create Constraint, invalid body objects given');
        }
        else
        {
            return this.addConstraint(new Phaser.Physics.P2.RevoluteConstraint(this, bodyA, pivotA, bodyB, pivotB, maxForce));
        }

    },

    /**
    * Locks the relative position between two bodies.
    *
    * @method Phaser.Physics.P2#createLockConstraint
    * @param {Phaser.Sprite|Phaser.Physics.P2.Body|p2.Body} bodyA - First connected body.
    * @param {Phaser.Sprite|Phaser.Physics.P2.Body|p2.Body} bodyB - Second connected body.
    * @param {Array} [offset] - The offset of bodyB in bodyA's frame. The value is an array with 2 elements matching x and y, i.e: [32, 32].
    * @param {number} [angle=0] - The angle of bodyB in bodyA's frame.
    * @param {number} [maxForce] - The maximum force that should be applied to constrain the bodies.
    * @return {Phaser.Physics.P2.LockConstraint} The constraint
    */
    createLockConstraint: function (bodyA, bodyB, offset, angle, maxForce) {

        bodyA = this.getBody(bodyA);
        bodyB = this.getBody(bodyB);

        if (!bodyA || !bodyB)
        {
            console.warn('Cannot create Constraint, invalid body objects given');
        }
        else
        {
            return this.addConstraint(new Phaser.Physics.P2.LockConstraint(this, bodyA, bodyB, offset, angle, maxForce));
        }

    },

    /**
    * Constraint that only allows bodies to move along a line, relative to each other.
    * See http://www.iforce2d.net/b2dtut/joints-prismatic
    *
    * @method Phaser.Physics.P2#createPrismaticConstraint
    * @param {Phaser.Sprite|Phaser.Physics.P2.Body|p2.Body} bodyA - First connected body.
    * @param {Phaser.Sprite|Phaser.Physics.P2.Body|p2.Body} bodyB - Second connected body.
    * @param {boolean} [lockRotation=true] - If set to false, bodyB will be free to rotate around its anchor point.
    * @param {Array} [anchorA] - Body A's anchor point, defined in its own local frame. The value is an array with 2 elements matching x and y, i.e: [32, 32].
    * @param {Array} [anchorB] - Body A's anchor point, defined in its own local frame. The value is an array with 2 elements matching x and y, i.e: [32, 32].
    * @param {Array} [axis] - An axis, defined in body A frame, that body B's anchor point may slide along. The value is an array with 2 elements matching x and y, i.e: [32, 32].
    * @param {number} [maxForce] - The maximum force that should be applied to constrain the bodies.
    * @return {Phaser.Physics.P2.PrismaticConstraint} The constraint
    */
    createPrismaticConstraint: function (bodyA, bodyB, lockRotation, anchorA, anchorB, axis, maxForce) {

        bodyA = this.getBody(bodyA);
        bodyB = this.getBody(bodyB);

        if (!bodyA || !bodyB)
        {
            console.warn('Cannot create Constraint, invalid body objects given');
        }
        else
        {
            return this.addConstraint(new Phaser.Physics.P2.PrismaticConstraint(this, bodyA, bodyB, lockRotation, anchorA, anchorB, axis, maxForce));
        }

    },

    /**
    * Adds a Constraint to the world.
    *
    * @method Phaser.Physics.P2#addConstraint
    * @param {Phaser.Physics.P2.Constraint} constraint - The Constraint to add to the World.
    * @return {Phaser.Physics.P2.Constraint} The Constraint that was added.
    */
    addConstraint: function (constraint) {

        this.world.addConstraint(constraint);

        this.onConstraintAdded.dispatch(constraint);

        return constraint;

    },

    /**
    * Removes a Constraint from the world.
    *
    * @method Phaser.Physics.P2#removeConstraint
    * @param {Phaser.Physics.P2.Constraint} constraint - The Constraint to be removed from the World.
    * @return {Phaser.Physics.P2.Constraint} The Constraint that was removed.
    */
    removeConstraint: function (constraint) {

        this.world.removeConstraint(constraint);

        this.onConstraintRemoved.dispatch(constraint);

        return constraint;

    },

    /**
    * Adds a Contact Material to the world.
    *
    * @method Phaser.Physics.P2#addContactMaterial
    * @param {Phaser.Physics.P2.ContactMaterial} material - The Contact Material to be added to the World.
    * @return {Phaser.Physics.P2.ContactMaterial} The Contact Material that was added.
    */
    addContactMaterial: function (material) {

        this.world.addContactMaterial(material);

        this.onContactMaterialAdded.dispatch(material);

        return material;

    },

    /**
    * Removes a Contact Material from the world.
    *
    * @method Phaser.Physics.P2#removeContactMaterial
    * @param {Phaser.Physics.P2.ContactMaterial} material - The Contact Material to be removed from the World.
    * @return {Phaser.Physics.P2.ContactMaterial} The Contact Material that was removed.
    */
    removeContactMaterial: function (material) {

        this.world.removeContactMaterial(material);

        this.onContactMaterialRemoved.dispatch(material);

        return material;

    },

    /**
    * Gets a Contact Material based on the two given Materials.
    *
    * @method Phaser.Physics.P2#getContactMaterial
    * @param {Phaser.Physics.P2.Material} materialA - The first Material to search for.
    * @param {Phaser.Physics.P2.Material} materialB - The second Material to search for.
    * @return {Phaser.Physics.P2.ContactMaterial|boolean} The Contact Material or false if none was found matching the Materials given.
    */
    getContactMaterial: function (materialA, materialB) {

        return this.world.getContactMaterial(materialA, materialB);

    },

    /**
    * Sets the given Material against all Shapes owned by all the Bodies in the given array.
    *
    * @method Phaser.Physics.P2#setMaterial
    * @param {Phaser.Physics.P2.Material} material - The Material to be applied to the given Bodies.
    * @param {array<Phaser.Physics.P2.Body>} bodies - An Array of Body objects that the given Material will be set on.
    */
    setMaterial: function (material, bodies) {

        var i = bodies.length;

        while (i--)
        {
            bodies[i].setMaterial(material);
        }

    },

    /**
    * Creates a Material. Materials are applied to Shapes owned by a Body and can be set with Body.setMaterial().
    * Materials are a way to control what happens when Shapes collide. Combine unique Materials together to create Contact Materials.
    * Contact Materials have properties such as friction and restitution that allow for fine-grained collision control between different Materials.
    *
    * @method Phaser.Physics.P2#createMaterial
    * @param {string} [name] - Optional name of the Material. Each Material has a unique ID but string names are handy for debugging.
    * @param {Phaser.Physics.P2.Body} [body] - Optional Body. If given it will assign the newly created Material to the Body shapes.
    * @return {Phaser.Physics.P2.Material} The Material that was created. This is also stored in Phaser.Physics.P2.materials.
    */
    createMaterial: function (name, body) {

        name = name || '';

        var material = new Phaser.Physics.P2.Material(name);

        this.materials.push(material);

        if (typeof body !== 'undefined')
        {
            body.setMaterial(material);
        }

        return material;

    },

    /**
    * Creates a Contact Material from the two given Materials. You can then edit the properties of the Contact Material directly.
    *
    * @method Phaser.Physics.P2#createContactMaterial
    * @param {Phaser.Physics.P2.Material} [materialA] - The first Material to create the ContactMaterial from. If undefined it will create a new Material object first.
    * @param {Phaser.Physics.P2.Material} [materialB] - The second Material to create the ContactMaterial from. If undefined it will create a new Material object first.
    * @param {object} [options] - Material options object.
    * @return {Phaser.Physics.P2.ContactMaterial} The Contact Material that was created.
    */
    createContactMaterial: function (materialA, materialB, options) {

        if (typeof materialA === 'undefined') { materialA = this.createMaterial(); }
        if (typeof materialB === 'undefined') { materialB = this.createMaterial(); }

        var contact = new Phaser.Physics.P2.ContactMaterial(materialA, materialB, options);

        return this.addContactMaterial(contact);

    },

    /**
    * Populates and returns an array with references to of all current Bodies in the world.
    *
    * @method Phaser.Physics.P2#getBodies
    * @return {array<Phaser.Physics.P2.Body>} An array containing all current Bodies in the world.
    */
    getBodies: function () {

        var output = [];
        var i = this.world.bodies.length;

        while (i--)
        {
            output.push(this.world.bodies[i].parent);
        }

        return output;

    },

    /**
    * Checks the given object to see if it has a p2.Body and if so returns it.
    *
    * @method Phaser.Physics.P2#getBody
    * @param {object} object - The object to check for a p2.Body on.
    * @return {p2.Body} The p2.Body, or null if not found.
    */
    getBody: function (object) {

        if (object instanceof p2.Body)
        {
            //  Native p2 body
            return object;
        }
        else if (object instanceof Phaser.Physics.P2.Body)
        {
            //  Phaser P2 Body
            return object.data;
        }
        else if (object['body'] && object['body'].type === Phaser.Physics.P2JS)
        {
            //  Sprite, TileSprite, etc
            return object.body.data;
        }

        return null;

    },

    /**
    * Populates and returns an array of all current Springs in the world.
    *
    * @method Phaser.Physics.P2#getSprings
    * @return {array<Phaser.Physics.P2.Spring>} An array containing all current Springs in the world.
    */
    getSprings: function () {

        var output = [];
        var i = this.world.springs.length;

        while (i--)
        {
            output.push(this.world.springs[i].parent);
        }

        return output;

    },

    /**
    * Populates and returns an array of all current Constraints in the world.
    *
    * @method Phaser.Physics.P2#getConstraints
    * @return {array<Phaser.Physics.P2.Constraint>} An array containing all current Constraints in the world.
    */
    getConstraints: function () {

        var output = [];
        var i = this.world.constraints.length;

        while (i--)
        {
            output.push(this.world.constraints[i].parent);
        }

        return output;

    },

    /**
    * Test if a world point overlaps bodies. You will get an array of actual P2 bodies back. You can find out which Sprite a Body belongs to
    * (if any) by checking the Body.parent.sprite property. Body.parent is a Phaser.Physics.P2.Body property.
    *
    * @method Phaser.Physics.P2#hitTest
    * @param {Phaser.Point} worldPoint - Point to use for intersection tests. The points values must be in world (pixel) coordinates.
    * @param {Array<Phaser.Physics.P2.Body|Phaser.Sprite|p2.Body>} [bodies] - A list of objects to check for intersection. If not given it will check Phaser.Physics.P2.world.bodies (i.e. all world bodies)
    * @param {number} [precision=5] - Used for matching against particles and lines. Adds some margin to these infinitesimal objects.
    * @param {boolean} [filterStatic=false] - If true all Static objects will be removed from the results array.
    * @return {Array} Array of bodies that overlap the point.
    */
    hitTest: function (worldPoint, bodies, precision, filterStatic) {

        if (typeof bodies === 'undefined') { bodies = this.world.bodies; }
        if (typeof precision === 'undefined') { precision = 5; }
        if (typeof filterStatic === 'undefined') { filterStatic = false; }

        var physicsPosition = [ this.pxmi(worldPoint.x), this.pxmi(worldPoint.y) ];

        var query = [];
        var i = bodies.length;

        while (i--)
        {
            if (bodies[i] instanceof Phaser.Physics.P2.Body && !(filterStatic && bodies[i].data.motionState === p2.Body.STATIC))
            {
                query.push(bodies[i].data);
            }
            else if (bodies[i] instanceof p2.Body && bodies[i].parent && !(filterStatic && bodies[i].motionState === p2.Body.STATIC))
            {
                query.push(bodies[i]);
            }
            else if (bodies[i] instanceof Phaser.Sprite && bodies[i].hasOwnProperty('body') && !(filterStatic && bodies[i].body.data.motionState === p2.Body.STATIC))
            {
                query.push(bodies[i].body.data);
            }
        }

        return this.world.hitTest(physicsPosition, query, precision);

    },

    /**
    * Converts the current world into a JSON object.
    *
    * @method Phaser.Physics.P2#toJSON
    * @return {object} A JSON representation of the world.
    */
    toJSON: function () {

        return this.world.toJSON();

    },

    /**
    * Creates a new Collision Group and optionally applies it to the given object.
    * Collision Groups are handled using bitmasks, therefore you have a fixed limit you can create before you need to re-use older groups.
    *
    * @method Phaser.Physics.P2#createCollisionGroup
    * @param {Phaser.Group|Phaser.Sprite} [object] - An optional Sprite or Group to apply the Collision Group to. If a Group is given it will be applied to all top-level children.
    */
    createCollisionGroup: function (object) {

        var bitmask = Math.pow(2, this._collisionGroupID);

        if (this.walls.left)
        {
            this.walls.left.shapes[0].collisionMask = this.walls.left.shapes[0].collisionMask | bitmask;
        }

        if (this.walls.right)
        {
            this.walls.right.shapes[0].collisionMask = this.walls.right.shapes[0].collisionMask | bitmask;
        }

        if (this.walls.top)
        {
            this.walls.top.shapes[0].collisionMask = this.walls.top.shapes[0].collisionMask | bitmask;
        }

        if (this.walls.bottom)
        {
            this.walls.bottom.shapes[0].collisionMask = this.walls.bottom.shapes[0].collisionMask | bitmask;
        }

        this._collisionGroupID++;

        var group = new Phaser.Physics.P2.CollisionGroup(bitmask);

        this.collisionGroups.push(group);

        if (object)
        {
            this.setCollisionGroup(object, group);
        }

        return group;

    },

    /**
    * Sets the given CollisionGroup to be the collision group for all shapes in this Body, unless a shape is specified.
    * Note that this resets the collisionMask and any previously set groups. See Body.collides() for appending them.
    *
    * @method Phaser.Physics.P2y#setCollisionGroup
    * @param {Phaser.Group|Phaser.Sprite} object - A Sprite or Group to apply the Collision Group to. If a Group is given it will be applied to all top-level children.
    * @param {Phaser.Physics.CollisionGroup} group - The Collision Group that this Bodies shapes will use.
    */
    setCollisionGroup: function (object, group) {

        if (object instanceof Phaser.Group)
        {
            for (var i = 0; i < object.total; i++)
            {
                if (object.children[i]['body'] && object.children[i]['body'].type === Phaser.Physics.P2JS)
                {
                    object.children[i].body.setCollisionGroup(group);
                }
            }
        }
        else
        {
            object.body.setCollisionGroup(group);
        }

    },

    /**
    * Creates a spring, connecting two bodies. A spring can have a resting length, a stiffness and damping.
    *
    * @method Phaser.Physics.P2#createSpring
    * @param {Phaser.Sprite|Phaser.Physics.P2.Body|p2.Body} bodyA - First connected body.
    * @param {Phaser.Sprite|Phaser.Physics.P2.Body|p2.Body} bodyB - Second connected body.
    * @param {number} [restLength=1] - Rest length of the spring. A number > 0.
    * @param {number} [stiffness=100] - Stiffness of the spring. A number >= 0.
    * @param {number} [damping=1] - Damping of the spring. A number >= 0.
    * @param {number} [restLength=1] - Rest length of the spring. A number > 0.
    * @param {number} [stiffness=100] - Stiffness of the spring. A number >= 0.
    * @param {number} [damping=1] - Damping of the spring. A number >= 0.
    * @param {Array} [worldA] - Where to hook the spring to body A in world coordinates. This value is an array by 2 elements, x and y, i.e: [32, 32].
    * @param {Array} [worldB] - Where to hook the spring to body B in world coordinates. This value is an array by 2 elements, x and y, i.e: [32, 32].
    * @param {Array} [localA] - Where to hook the spring to body A in local body coordinates. This value is an array by 2 elements, x and y, i.e: [32, 32].
    * @param {Array} [localB] - Where to hook the spring to body B in local body coordinates. This value is an array by 2 elements, x and y, i.e: [32, 32].
    * @return {Phaser.Physics.P2.Spring} The spring
    */
    createSpring: function (bodyA, bodyB, restLength, stiffness, damping, worldA, worldB, localA, localB) {

        bodyA = this.getBody(bodyA);
        bodyB = this.getBody(bodyB);

        if (!bodyA || !bodyB)
        {
            console.warn('Cannot create Spring, invalid body objects given');
        }
        else
        {
            return this.addSpring(new Phaser.Physics.P2.Spring(this, bodyA, bodyB, restLength, stiffness, damping, worldA, worldB, localA, localB));
        }

    },

    /**
    * Creates a new Body and adds it to the World.
    *
    * @method Phaser.Physics.P2#createBody
    * @param {number} x - The x coordinate of Body.
    * @param {number} y - The y coordinate of Body.
    * @param {number} mass - The mass of the Body. A mass of 0 means a 'static' Body is created.
    * @param {boolean} [addToWorld=false] - Automatically add this Body to the world? (usually false as it won't have any shapes on construction).
    * @param {object} options - An object containing the build options:
    * @param {boolean} [options.optimalDecomp=false] - Set to true if you need optimal decomposition. Warning: very slow for polygons with more than 10 vertices.
    * @param {boolean} [options.skipSimpleCheck=false] - Set to true if you already know that the path is not intersecting itself.
    * @param {boolean|number} [options.removeCollinearPoints=false] - Set to a number (angle threshold value) to remove collinear points, or false to keep all points.
    * @param {(number[]|...number)} points - An array of 2d vectors that form the convex or concave polygon.
    *                                       Either [[0,0], [0,1],...] or a flat array of numbers that will be interpreted as [x,y, x,y, ...],
    *                                       or the arguments passed can be flat x,y values e.g. `setPolygon(options, x,y, x,y, x,y, ...)` where `x` and `y` are numbers.
    * @return {Phaser.Physics.P2.Body} The body
    */
    createBody: function (x, y, mass, addToWorld, options, data) {

        if (typeof addToWorld === 'undefined') { addToWorld = false; }

        var body = new Phaser.Physics.P2.Body(this.game, null, x, y, mass);

        if (data)
        {
            var result = body.addPolygon(options, data);

            if (!result)
            {
                return false;
            }
        }

        if (addToWorld)
        {
            this.world.addBody(body.data);
        }

        return body;

    },

    /**
    * Creates a new Particle and adds it to the World.
    *
    * @method Phaser.Physics.P2#createParticle
    * @param {number} x - The x coordinate of Body.
    * @param {number} y - The y coordinate of Body.
    * @param {number} mass - The mass of the Body. A mass of 0 means a 'static' Body is created.
    * @param {boolean} [addToWorld=false] - Automatically add this Body to the world? (usually false as it won't have any shapes on construction).
    * @param {object} options - An object containing the build options:
    * @param {boolean} [options.optimalDecomp=false] - Set to true if you need optimal decomposition. Warning: very slow for polygons with more than 10 vertices.
    * @param {boolean} [options.skipSimpleCheck=false] - Set to true if you already know that the path is not intersecting itself.
    * @param {boolean|number} [options.removeCollinearPoints=false] - Set to a number (angle threshold value) to remove collinear points, or false to keep all points.
    * @param {(number[]|...number)} points - An array of 2d vectors that form the convex or concave polygon.
    *                                       Either [[0,0], [0,1],...] or a flat array of numbers that will be interpreted as [x,y, x,y, ...],
    *                                       or the arguments passed can be flat x,y values e.g. `setPolygon(options, x,y, x,y, x,y, ...)` where `x` and `y` are numbers.
    */
    createParticle: function (x, y, mass, addToWorld, options, data) {

        if (typeof addToWorld === 'undefined') { addToWorld = false; }

        var body = new Phaser.Physics.P2.Body(this.game, null, x, y, mass);

        if (data)
        {
            var result = body.addPolygon(options, data);

            if (!result)
            {
                return false;
            }
        }

        if (addToWorld)
        {
            this.world.addBody(body.data);
        }

        return body;

    },

    /**
    * Converts all of the polylines objects inside a Tiled ObjectGroup into physics bodies that are added to the world.
    * Note that the polylines must be created in such a way that they can withstand polygon decomposition.
    *
    * @method Phaser.Physics.P2#convertCollisionObjects
    * @param {Phaser.Tilemap} map - The Tilemap to get the map data from.
    * @param {number|string|Phaser.TilemapLayer} [layer] - The layer to operate on. If not given will default to map.currentLayer.
    * @param {boolean} [addToWorld=true] - If true it will automatically add each body to the world.
    * @return {array} An array of the Phaser.Physics.Body objects that have been created.
    */
    convertCollisionObjects: function (map, layer, addToWorld) {

        if (typeof addToWorld === 'undefined') { addToWorld = true; }

        var output = [];

        for (var i = 0, len = map.collision[layer].length; i < len; i++)
        {
            // name: json.layers[i].objects[v].name,
            // x: json.layers[i].objects[v].x,
            // y: json.layers[i].objects[v].y,
            // width: json.layers[i].objects[v].width,
            // height: json.layers[i].objects[v].height,
            // visible: json.layers[i].objects[v].visible,
            // properties: json.layers[i].objects[v].properties,
            // polyline: json.layers[i].objects[v].polyline

            var object = map.collision[layer][i];

            var body = this.createBody(object.x, object.y, 0, addToWorld, {}, object.polyline);

            if (body)
            {
                output.push(body);
            }
        }

        return output;

    },

    /**
    * Clears all physics bodies from the given TilemapLayer that were created with `World.convertTilemap`.
    *
    * @method Phaser.Physics.P2#clearTilemapLayerBodies
    * @param {Phaser.Tilemap} map - The Tilemap to get the map data from.
    * @param {number|string|Phaser.TilemapLayer} [layer] - The layer to operate on. If not given will default to map.currentLayer.
    */
    clearTilemapLayerBodies: function (map, layer) {

        layer = map.getLayer(layer);

        var i = map.layers[layer].bodies.length;

        while (i--)
        {
            map.layers[layer].bodies[i].destroy();
        }

        map.layers[layer].bodies.length = 0;

    },

    /**
    * Goes through all tiles in the given Tilemap and TilemapLayer and converts those set to collide into physics bodies.
    * Only call this *after* you have specified all of the tiles you wish to collide with calls like Tilemap.setCollisionBetween, etc.
    * Every time you call this method it will destroy any previously created bodies and remove them from the world.
    * Therefore understand it's a very expensive operation and not to be done in a core game update loop.
    *
    * @method Phaser.Physics.P2#convertTilemap
    * @param {Phaser.Tilemap} map - The Tilemap to get the map data from.
    * @param {number|string|Phaser.TilemapLayer} [layer] - The layer to operate on. If not given will default to map.currentLayer.
    * @param {boolean} [addToWorld=true] - If true it will automatically add each body to the world, otherwise it's up to you to do so.
    * @param {boolean} [optimize=true] - If true adjacent colliding tiles will be combined into a single body to save processing. However it means you cannot perform specific Tile to Body collision responses.
    * @return {array} An array of the Phaser.Physics.P2.Body objects that were created.
    */
    convertTilemap: function (map, layer, addToWorld, optimize) {

        layer = map.getLayer(layer);

        if (typeof addToWorld === 'undefined') { addToWorld = true; }
        if (typeof optimize === 'undefined') { optimize = true; }

        //  If the bodies array is already populated we need to nuke it
        this.clearTilemapLayerBodies(map, layer);

        var width = 0;
        var sx = 0;
        var sy = 0;

        for (var y = 0, h = map.layers[layer].height; y < h; y++)
        {
            width = 0;

            for (var x = 0, w = map.layers[layer].width; x < w; x++)
            {
                var tile = map.layers[layer].data[y][x];

                if (tile && tile.index > -1 && tile.collides)
                {
                    if (optimize)
                    {
                        var right = map.getTileRight(layer, x, y);

                        if (width === 0)
                        {
                            sx = tile.x * tile.width;
                            sy = tile.y * tile.height;
                            width = tile.width;
                        }

                        if (right && right.collides)
                        {
                            width += tile.width;
                        }
                        else
                        {
                            var body = this.createBody(sx, sy, 0, false);

                            body.addRectangle(width, tile.height, width / 2, tile.height / 2, 0);

                            if (addToWorld)
                            {
                                this.addBody(body);
                            }

                            map.layers[layer].bodies.push(body);

                            width = 0;
                        }
                    }
                    else
                    {
                        var body = this.createBody(tile.x * tile.width, tile.y * tile.height, 0, false);

                        body.addRectangle(tile.width, tile.height, tile.width / 2, tile.height / 2, 0);

                        if (addToWorld)
                        {
                            this.addBody(body);
                        }

                        map.layers[layer].bodies.push(body);
                    }
                }
            }
        }

        return map.layers[layer].bodies;

    },

    /**
    * Convert p2 physics value (meters) to pixel scale.
    * By default Phaser uses a scale of 20px per meter.
    * If you need to modify this you can over-ride these functions via the Physics Configuration object.
    *
    * @method Phaser.Physics.P2#mpx
    * @param {number} v - The value to convert.
    * @return {number} The scaled value.
    */
    mpx: function (v) {

        return v *= 20;

    },

    /**
    * Convert pixel value to p2 physics scale (meters).
    * By default Phaser uses a scale of 20px per meter.
    * If you need to modify this you can over-ride these functions via the Physics Configuration object.
    *
    * @method Phaser.Physics.P2#pxm
    * @param {number} v - The value to convert.
    * @return {number} The scaled value.
    */
    pxm: function (v) {

        return v * 0.05;

    },

    /**
    * Convert p2 physics value (meters) to pixel scale and inverses it.
    * By default Phaser uses a scale of 20px per meter.
    * If you need to modify this you can over-ride these functions via the Physics Configuration object.
    *
    * @method Phaser.Physics.P2#mpxi
    * @param {number} v - The value to convert.
    * @return {number} The scaled value.
    */
    mpxi: function (v) {

        return v *= -20;

    },

    /**
    * Convert pixel value to p2 physics scale (meters) and inverses it.
    * By default Phaser uses a scale of 20px per meter.
    * If you need to modify this you can over-ride these functions via the Physics Configuration object.
    *
    * @method Phaser.Physics.P2#pxmi
    * @param {number} v - The value to convert.
    * @return {number} The scaled value.
    */
    pxmi: function (v) {

        return v * -0.05;

    }

};

/**
* @name Phaser.Physics.P2#friction
* @property {number} friction - Friction between colliding bodies. This value is used if no matching ContactMaterial is found for a Material pair.
*/
Object.defineProperty(Phaser.Physics.P2.prototype, "friction", {

    get: function () {

        return this.world.defaultContactMaterial.friction;

    },

    set: function (value) {

        this.world.defaultContactMaterial.friction = value;

    }

});

/**
* @name Phaser.Physics.P2#defaultFriction
* @property {number} defaultFriction - DEPRECATED: Use World.friction instead.
*/
Object.defineProperty(Phaser.Physics.P2.prototype, "defaultFriction", {

    get: function () {

        return this.world.defaultContactMaterial.friction;

    },

    set: function (value) {

        this.world.defaultContactMaterial.friction = value;

    }

});

/**
* @name Phaser.Physics.P2#restitution
* @property {number} restitution - Default coefficient of restitution between colliding bodies. This value is used if no matching ContactMaterial is found for a Material pair.
*/
Object.defineProperty(Phaser.Physics.P2.prototype, "restitution", {

    get: function () {

        return this.world.defaultContactMaterial.restitution;

    },

    set: function (value) {

        this.world.defaultContactMaterial.restitution = value;

    }

});

/**
* @name Phaser.Physics.P2#defaultRestitution
* @property {number} defaultRestitution - DEPRECATED: Use World.restitution instead.
*/
Object.defineProperty(Phaser.Physics.P2.prototype, "defaultRestitution", {

    get: function () {

        return this.world.defaultContactMaterial.restitution;

    },

    set: function (value) {

        this.world.defaultContactMaterial.restitution = value;

    }

});

/**
* @name Phaser.Physics.P2#contactMaterial
* @property {p2.ContactMaterial} contactMaterial - The default Contact Material being used by the World.
*/
Object.defineProperty(Phaser.Physics.P2.prototype, "contactMaterial", {

    get: function () {

        return this.world.defaultContactMaterial;

    },

    set: function (value) {

        this.world.defaultContactMaterial = value;

    }

});

/**
* @name Phaser.Physics.P2#applySpringForces
* @property {boolean} applySpringForces - Enable to automatically apply spring forces each step.
*/
Object.defineProperty(Phaser.Physics.P2.prototype, "applySpringForces", {

    get: function () {

        return this.world.applySpringForces;

    },

    set: function (value) {

        this.world.applySpringForces = value;

    }

});

/**
* @name Phaser.Physics.P2#applyDamping
* @property {boolean} applyDamping - Enable to automatically apply body damping each step.
*/
Object.defineProperty(Phaser.Physics.P2.prototype, "applyDamping", {

    get: function () {

        return this.world.applyDamping;

    },

    set: function (value) {

        this.world.applyDamping = value;

    }

});

/**
* @name Phaser.Physics.P2#applyGravity
* @property {boolean} applyGravity - Enable to automatically apply gravity each step.
*/
Object.defineProperty(Phaser.Physics.P2.prototype, "applyGravity", {

    get: function () {

        return this.world.applyGravity;

    },

    set: function (value) {

        this.world.applyGravity = value;

    }

});

/**
* @name Phaser.Physics.P2#solveConstraints
* @property {boolean} solveConstraints - Enable/disable constraint solving in each step.
*/
Object.defineProperty(Phaser.Physics.P2.prototype, "solveConstraints", {

    get: function () {

        return this.world.solveConstraints;

    },

    set: function (value) {

        this.world.solveConstraints = value;

    }

});

/**
* @name Phaser.Physics.P2#time
* @property {boolean} time - The World time.
* @readonly
*/
Object.defineProperty(Phaser.Physics.P2.prototype, "time", {

    get: function () {

        return this.world.time;

    }

});

/**
* @name Phaser.Physics.P2#emitImpactEvent
* @property {boolean} emitImpactEvent - Set to true if you want to the world to emit the "impact" event. Turning this off could improve performance.
*/
Object.defineProperty(Phaser.Physics.P2.prototype, "emitImpactEvent", {

    get: function () {

        return this.world.emitImpactEvent;

    },

    set: function (value) {

        this.world.emitImpactEvent = value;

    }

});

/**
* @name Phaser.Physics.P2#enableBodySleeping
* @property {boolean} enableBodySleeping - Enable / disable automatic body sleeping.
*/
Object.defineProperty(Phaser.Physics.P2.prototype, "enableBodySleeping", {

    get: function () {

        return this.world.enableBodySleeping;

    },

    set: function (value) {

        this.world.enableBodySleeping = value;

    }

});

/**
* @name Phaser.Physics.P2#total
* @property {number} total - The total number of bodies in the world.
* @readonly
*/
Object.defineProperty(Phaser.Physics.P2.prototype, "total", {

    get: function () {

        return this.world.bodies.length;

    }

});

/* jshint noarg: false */

/**
* @author       Georgios Kaleadis https://github.com/georgiee
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Allow to access a list of created fixture (coming from Body#addPhaserPolygon)
* which itself parse the input from PhysicsEditor with the custom phaser exporter.
* You can access fixtures of a Body by a group index or even by providing a fixture Key.

* You can set the fixture key and also the group index for a fixture in PhysicsEditor.
* This gives you the power to create a complex body built of many fixtures and modify them
* during runtime (to remove parts, set masks, categories & sensor properties)
*
* @class Phaser.Physics.P2.FixtureList
* @classdesc Collection for generated P2 fixtures 
* @constructor
* @param {Array} list - A list of fixtures (from Phaser.Physics.P2.Body#addPhaserPolygon)
*/
Phaser.Physics.P2.FixtureList = function (list) {

    if (!Array.isArray(list))
    {
        list = [list];
    }

    this.rawList = list;
    this.init();
    this.parse(this.rawList);

};

Phaser.Physics.P2.FixtureList.prototype = {
  
    /**
    * @method Phaser.Physics.P2.FixtureList#init
    */
    init: function () {

        /**
        * @property {object} namedFixtures - Collect all fixtures with a key
        * @private
        */
        this.namedFixtures = {};

        /**
        * @property {Array} groupedFixtures - Collect all given fixtures per group index. Notice: Every fixture with a key also belongs to a group
        * @private
        */
        this.groupedFixtures = [];

        /**
        * @property {Array} allFixtures - This is a list of everything in this collection
        * @private
        */
        this.allFixtures = [];

    },

    /**
    * @method Phaser.Physics.P2.FixtureList#setCategory
    * @param {number} bit - The bit to set as the collision group.
    * @param {string} fixtureKey - Only apply to the fixture with the given key.
    */
    setCategory: function (bit, fixtureKey) {

        var setter = function(fixture) {
            fixture.collisionGroup = bit;
        };

        this.getFixtures(fixtureKey).forEach(setter);

    },
  
    /**
    * @method Phaser.Physics.P2.FixtureList#setMask
    * @param {number} bit - The bit to set as the collision mask
    * @param {string} fixtureKey - Only apply to the fixture with the given key
    */
    setMask: function (bit, fixtureKey) {

        var setter = function(fixture) {
            fixture.collisionMask = bit;
        };

        this.getFixtures(fixtureKey).forEach(setter);

    },
  
    /**
    * @method Phaser.Physics.P2.FixtureList#setSensor
    * @param {boolean} value - sensor true or false
    * @param {string} fixtureKey - Only apply to the fixture with the given key
    */
    setSensor: function (value, fixtureKey) {

        var setter = function(fixture) {
            fixture.sensor = value;
        };

        this.getFixtures(fixtureKey).forEach(setter);

    },

    /**
    * @method Phaser.Physics.P2.FixtureList#setMaterial
    * @param {Object} material - The contact material for a fixture
    * @param {string} fixtureKey - Only apply to the fixture with the given key
    */
    setMaterial: function (material, fixtureKey) {

        var setter = function(fixture) {
            fixture.material = material;
        };

        this.getFixtures(fixtureKey).forEach(setter);

    },

    /**
    * Accessor to get either a list of specified fixtures by key or the whole fixture list
    * 
    * @method Phaser.Physics.P2.FixtureList#getFixtures
    * @param {array} keys - A list of fixture keys
    */
    getFixtures: function (keys) {

        var fixtures = [];

        if (keys)
        {
            if (!(keys instanceof Array))
            {
                keys = [keys];
            }

            var self = this;
            keys.forEach(function(key) {
                if (self.namedFixtures[key])
                {
                    fixtures.push(self.namedFixtures[key]);
                }
            });

            return this.flatten(fixtures);

        }
        else
        {
            return this.allFixtures;
        }

    },

    /**
    * Accessor to get either a single fixture by its key.
    * 
    * @method Phaser.Physics.P2.FixtureList#getFixtureByKey
    * @param {string} key - The key of the fixture.
    */
    getFixtureByKey: function (key) {

        return this.namedFixtures[key];

    },

    /**
    * Accessor to get a group of fixtures by its group index.
    * 
    * @method Phaser.Physics.P2.FixtureList#getGroup
    * @param {number} groupID - The group index.
    */
    getGroup: function (groupID) {

        return this.groupedFixtures[groupID];

    },
  
    /**
    * Parser for the output of Phaser.Physics.P2.Body#addPhaserPolygon
    * 
    * @method Phaser.Physics.P2.FixtureList#parse
    */
    parse: function () {

        var key, value, _ref, _results;
        _ref = this.rawList;
        _results = [];

        for (key in _ref)
        {
            value = _ref[key];

            if (!isNaN(key - 0))
            {
                this.groupedFixtures[key] = this.groupedFixtures[key] || [];
                this.groupedFixtures[key] = this.groupedFixtures[key].concat(value);
            }
            else
            {
                this.namedFixtures[key] = this.flatten(value);
            }

            _results.push(this.allFixtures = this.flatten(this.groupedFixtures));
        }

    },

    /**
    * A helper to flatten arrays. This is very useful as the fixtures are nested from time to time due to the way P2 creates and splits polygons.
    * 
    * @method Phaser.Physics.P2.FixtureList#flatten
    * @param {array} array - The array to flatten. Notice: This will happen recursive not shallow.
    */
    flatten: function (array) {

        var result, self;
        result = [];
        self = arguments.callee;
        
        array.forEach(function(item) {
            return Array.prototype.push.apply(result, (Array.isArray(item) ? self(item) : [item]));
        });

        return result;

    }

};
/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A PointProxy is an internal class that allows for direct getter/setter style property access to Arrays and TypedArrays.
*
* @class Phaser.Physics.P2.PointProxy
* @classdesc PointProxy
* @constructor
* @param {Phaser.Physics.P2} world - A reference to the P2 World.
* @param {any} destination - The object to bind to.
*/
Phaser.Physics.P2.PointProxy = function (world, destination) {

    this.world = world;
	this.destination = destination;

};

Phaser.Physics.P2.PointProxy.prototype.constructor = Phaser.Physics.P2.PointProxy;

/**
* @name Phaser.Physics.P2.PointProxy#x
* @property {number} x - The x property of this PointProxy.
*/
Object.defineProperty(Phaser.Physics.P2.PointProxy.prototype, "x", {

    get: function () {

        return this.destination[0];

    },

    set: function (value) {

        this.destination[0] = this.world.pxm(value);

    }

});

/**
* @name Phaser.Physics.P2.PointProxy#y
* @property {number} y - The y property of this PointProxy.
*/
Object.defineProperty(Phaser.Physics.P2.PointProxy.prototype, "y", {

    get: function () {

        return this.destination[1];

    },

    set: function (value) {

        this.destination[1] = this.world.pxm(value);

    }

});

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A InversePointProxy is an internal class that allows for direct getter/setter style property access to Arrays and TypedArrays but inverses the values on set.
*
* @class Phaser.Physics.P2.InversePointProxy
* @classdesc InversePointProxy
* @constructor
* @param {Phaser.Physics.P2} world - A reference to the P2 World.
* @param {any} destination - The object to bind to.
*/
Phaser.Physics.P2.InversePointProxy = function (world, destination) {

    this.world = world;
	this.destination = destination;

};

Phaser.Physics.P2.InversePointProxy.prototype.constructor = Phaser.Physics.P2.InversePointProxy;

/**
* @name Phaser.Physics.P2.InversePointProxy#x
* @property {number} x - The x property of this InversePointProxy.
*/
Object.defineProperty(Phaser.Physics.P2.InversePointProxy.prototype, "x", {

    get: function () {

        return this.destination[0];

    },

    set: function (value) {

        this.destination[0] = this.world.pxm(-value);

    }

});

/**
* @name Phaser.Physics.P2.InversePointProxy#y
* @property {number} y - The y property of this InversePointProxy.
*/
Object.defineProperty(Phaser.Physics.P2.InversePointProxy.prototype, "y", {

    get: function () {

        return this.destination[1];

    },

    set: function (value) {

        this.destination[1] = this.world.pxm(-value);

    }

});

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* The Physics Body is typically linked to a single Sprite and defines properties that determine how the physics body is simulated.
* These properties affect how the body reacts to forces, what forces it generates on itself (to simulate friction), and how it reacts to collisions in the scene.
* In most cases, the properties are used to simulate physical effects. Each body also has its own property values that determine exactly how it reacts to forces and collisions in the scene.
* By default a single Rectangle shape is added to the Body that matches the dimensions of the parent Sprite. See addShape, removeShape, clearShapes to add extra shapes around the Body.
* Note: When bound to a Sprite to avoid single-pixel jitters on mobile devices we strongly recommend using Sprite sizes that are even on both axis, i.e. 128x128 not 127x127.
* Note: When a game object is given a P2 body it has its anchor x/y set to 0.5, so it becomes centered.
*
* @class Phaser.Physics.P2.Body
* @classdesc Physics Body Constructor
* @constructor
* @param {Phaser.Game} game - Game reference to the currently running game.
* @param {Phaser.Sprite} [sprite] - The Sprite object this physics body belongs to.
* @param {number} [x=0] - The x coordinate of this Body.
* @param {number} [y=0] - The y coordinate of this Body.
* @param {number} [mass=1] - The default mass of this Body (0 = static).
*/
Phaser.Physics.P2.Body = function (game, sprite, x, y, mass) {

    sprite = sprite || null;
    x = x || 0;
    y = y || 0;
    if (typeof mass === 'undefined') { mass = 1; }

    /**
    * @property {Phaser.Game} game - Local reference to game.
    */
    this.game = game;

    /**
    * @property {Phaser.Physics.P2} world - Local reference to the P2 World.
    */
    this.world = game.physics.p2;

    /**
    * @property {Phaser.Sprite} sprite - Reference to the parent Sprite.
    */
    this.sprite = sprite;

    /**
    * @property {number} type - The type of physics system this body belongs to.
    */
    this.type = Phaser.Physics.P2JS;

    /**
    * @property {Phaser.Point} offset - The offset of the Physics Body from the Sprite x/y position.
    */
    this.offset = new Phaser.Point();

    /**
    * @property {p2.Body} data - The p2 Body data.
    * @protected
    */
    this.data = new p2.Body({ position: [ this.world.pxmi(x), this.world.pxmi(y) ], mass: mass });

    this.data.parent = this;

    /**
    * @property {Phaser.InversePointProxy} velocity - The velocity of the body. Set velocity.x to a negative value to move to the left, position to the right. velocity.y negative values move up, positive move down.
    */
    this.velocity = new Phaser.Physics.P2.InversePointProxy(this.world, this.data.velocity);

    /**
    * @property {Phaser.InversePointProxy} force - The force applied to the body.
    */
    this.force = new Phaser.Physics.P2.InversePointProxy(this.world, this.data.force);

    /**
    * @property {Phaser.Point} gravity - A locally applied gravity force to the Body. Applied directly before the world step. NOTE: Not currently implemented.
    */
    this.gravity = new Phaser.Point();

    /**
    * Dispatched when a first contact is created between shapes in two bodies. This event is fired during the step, so collision has already taken place.
    * The event will be sent 4 parameters: The body it is in contact with, the shape from this body that caused the contact, the shape from the contact body and the contact equation data array.
    * @property {Phaser.Signal} onBeginContact
    */
    this.onBeginContact = new Phaser.Signal();

    /**
    * Dispatched when contact ends between shapes in two bodies. This event is fired during the step, so collision has already taken place.
    * The event will be sent 3 parameters: The body it is in contact with, the shape from this body that caused the contact and the shape from the contact body.
    * @property {Phaser.Signal} onEndContact
    */
    this.onEndContact = new Phaser.Signal();

    /**
    * @property {array} collidesWith - Array of CollisionGroups that this Bodies shapes collide with.
    */
    this.collidesWith = [];

    /**
    * @property {boolean} removeNextStep - To avoid deleting this body during a physics step, and causing all kinds of problems, set removeNextStep to true to have it removed in the next preUpdate.
    */
    this.removeNextStep = false;

    /**
    * @property {Phaser.Physics.P2.BodyDebug} debugBody - Reference to the debug body.
    */
    this.debugBody = null;

    /**
    * @property {boolean} _collideWorldBounds - Internal var that determines if this Body collides with the world bounds or not.
    * @private
    */
    this._collideWorldBounds = true;

    /**
    * @property {object} _bodyCallbacks - Array of Body callbacks.
    * @private
    */
    this._bodyCallbacks = {};

    /**
    * @property {object} _bodyCallbackContext - Array of Body callback contexts.
    * @private
    */
    this._bodyCallbackContext = {};

    /**
    * @property {object} _groupCallbacks - Array of Group callbacks.
    * @private
    */
    this._groupCallbacks = {};

    /**
    * @property {object} _bodyCallbackContext - Array of Grouo callback contexts.
    * @private
    */
    this._groupCallbackContext = {};

    //  Set-up the default shape
    if (sprite)
    {
        this.setRectangleFromSprite(sprite);

        if (sprite.exists)
        {
            this.game.physics.p2.addBody(this);
        }
    }

};

Phaser.Physics.P2.Body.prototype = {

    /**
    * Sets a callback to be fired any time a shape in this Body impacts with a shape in the given Body. The impact test is performed against body.id values.
    * The callback will be sent 4 parameters: This body, the body that impacted, the Shape in this body and the shape in the impacting body.
    * Note that the impact event happens after collision resolution, so it cannot be used to prevent a collision from happening.
    * It also happens mid-step. So do not destroy a Body during this callback, instead set safeDestroy to true so it will be killed on the next preUpdate.
    *
    * @method Phaser.Physics.P2.Body#createBodyCallback
    * @param {Phaser.Sprite|Phaser.TileSprite|Phaser.Physics.P2.Body|p2.Body} object - The object to send impact events for.
    * @param {function} callback - The callback to fire on impact. Set to null to clear a previously set callback.
    * @param {object} callbackContext - The context under which the callback will fire.
    */
    createBodyCallback: function (object, callback, callbackContext) {

        var id = -1;

        if (object['id'])
        {
            id = object.id;
        }
        else if (object['body'])
        {
            id = object.body.id;
        }

        if (id > -1)
        {
            if (callback === null)
            {
                delete (this._bodyCallbacks[id]);
                delete (this._bodyCallbackContext[id]);
            }
            else
            {
                this._bodyCallbacks[id] = callback;
                this._bodyCallbackContext[id] = callbackContext;
            }
        }

    },

    /**
    * Sets a callback to be fired any time this Body impacts with the given Group. The impact test is performed against shape.collisionGroup values.
    * The callback will be sent 4 parameters: This body, the body that impacted, the Shape in this body and the shape in the impacting body.
    * This callback will only fire if this Body has been assigned a collision group.
    * Note that the impact event happens after collision resolution, so it cannot be used to prevent a collision from happening.
    * It also happens mid-step. So do not destroy a Body during this callback, instead set safeDestroy to true so it will be killed on the next preUpdate.
    *
    * @method Phaser.Physics.P2.Body#createGroupCallback
    * @param {Phaser.Physics.CollisionGroup} group - The Group to send impact events for.
    * @param {function} callback - The callback to fire on impact. Set to null to clear a previously set callback.
    * @param {object} callbackContext - The context under which the callback will fire.
    */
    createGroupCallback: function (group, callback, callbackContext) {

        if (callback === null)
        {
            delete (this._groupCallbacks[group.mask]);
            delete (this._groupCallbacksContext[group.mask]);
        }
        else
        {
            this._groupCallbacks[group.mask] = callback;
            this._groupCallbackContext[group.mask] = callbackContext;
        }

    },

    /**
    * Gets the collision bitmask from the groups this body collides with.
    *
    * @method Phaser.Physics.P2.Body#getCollisionMask
    * @return {number} The bitmask.
    */
    getCollisionMask: function () {

        var mask = 0;

        if (this._collideWorldBounds)
        {
            mask = this.game.physics.p2.boundsCollisionGroup.mask;
        }

        for (var i = 0; i < this.collidesWith.length; i++)
        {
            mask = mask | this.collidesWith[i].mask;
        }

        return mask;

    },

    /**
    * Updates the collisionMask.
    *
    * @method Phaser.Physics.P2.Body#updateCollisionMask
    * @param {p2.Shape} [shape] - An optional Shape. If not provided the collision group will be added to all Shapes in this Body.
    */
    updateCollisionMask: function (shape) {

        var mask = this.getCollisionMask();

        if (typeof shape === 'undefined')
        {
            for (var i = this.data.shapes.length - 1; i >= 0; i--)
            {
                this.data.shapes[i].collisionMask = mask;
            }
        }
        else
        {
            shape.collisionMask = mask;
        }

    },

    /**
    * Sets the given CollisionGroup to be the collision group for all shapes in this Body, unless a shape is specified.
    * This also resets the collisionMask.
    *
    * @method Phaser.Physics.P2.Body#setCollisionGroup
    * @param {Phaser.Physics.CollisionGroup} group - The Collision Group that this Bodies shapes will use.
    * @param {p2.Shape} [shape] - An optional Shape. If not provided the collision group will be added to all Shapes in this Body.
    */
    setCollisionGroup: function (group, shape) {

        var mask = this.getCollisionMask();

        if (typeof shape === 'undefined')
        {
            for (var i = this.data.shapes.length - 1; i >= 0; i--)
            {
                this.data.shapes[i].collisionGroup = group.mask;
                this.data.shapes[i].collisionMask = mask;
            }
        }
        else
        {
            shape.collisionGroup = group.mask;
            shape.collisionMask = mask;
        }

    },

    /**
    * Clears the collision data from the shapes in this Body. Optionally clears Group and/or Mask.
    *
    * @method Phaser.Physics.P2.Body#clearCollision
    * @param {boolean} [clearGroup=true] - Clear the collisionGroup value from the shape/s?
    * @param {boolean} [clearMask=true] - Clear the collisionMask value from the shape/s?
    * @param {p2.Shape} [shape] - An optional Shape. If not provided the collision data will be cleared from all Shapes in this Body.
    */
    clearCollision: function (clearGroup, clearMask, shape) {

        if (typeof shape === 'undefined')
        {
            for (var i = this.data.shapes.length - 1; i >= 0; i--)
            {
                if (clearGroup)
                {
                    this.data.shapes[i].collisionGroup = null;
                }

                if (clearMask)
                {
                    this.data.shapes[i].collisionMask = null;
                }
            }
        }
        else
        {
            if (clearGroup)
            {
                shape.collisionGroup = null;
            }

            if (clearMask)
            {
                shape.collisionMask = null;
            }
        }

        if (clearGroup)
        {
            this.collidesWith.length = 0;
        }

    },

    /**
    * Adds the given CollisionGroup, or array of CollisionGroups, to the list of groups that this body will collide with and updates the collision masks.
    *
    * @method Phaser.Physics.P2.Body#collides
    * @param {Phaser.Physics.CollisionGroup|array} group - The Collision Group or Array of Collision Groups that this Bodies shapes will collide with.
    * @param {function} [callback] - Optional callback that will be triggered when this Body impacts with the given Group.
    * @param {object} [callbackContext] - The context under which the callback will be called.
    * @param {p2.Shape} [shape] - An optional Shape. If not provided the collision mask will be added to all Shapes in this Body.
    */
    collides: function (group, callback, callbackContext, shape) {

        if (Array.isArray(group))
        {
            for (var i = 0; i < group.length; i++)
            {
                if (this.collidesWith.indexOf(group[i]) === -1)
                {
                    this.collidesWith.push(group[i]);

                    if (callback)
                    {
                        this.createGroupCallback(group[i], callback, callbackContext);
                    }
                }
            }
        }
        else
        {
            if (this.collidesWith.indexOf(group) === -1)
            {
                this.collidesWith.push(group);

                if (callback)
                {
                    this.createGroupCallback(group, callback, callbackContext);
                }
            }
        }

        var mask = this.getCollisionMask();

        if (typeof shape === 'undefined')
        {
            for (var i = this.data.shapes.length - 1; i >= 0; i--)
            {
                this.data.shapes[i].collisionMask = mask;
            }
        }
        else
        {
            shape.collisionMask = mask;
        }

    },

    /**
    * Moves the shape offsets so their center of mass becomes the body center of mass.
    *
    * @method Phaser.Physics.P2.Body#adjustCenterOfMass
    */
    adjustCenterOfMass: function () {

        this.data.adjustCenterOfMass();

    },

    /**
    * Apply damping, see http://code.google.com/p/bullet/issues/detail?id=74 for details.
    *
    * @method Phaser.Physics.P2.Body#applyDamping
    * @param {number} dt - Current time step.
    */
    applyDamping: function (dt) {

        this.data.applyDamping(dt);

    },

    /**
    * Apply force to a world point. This could for example be a point on the RigidBody surface. Applying force this way will add to Body.force and Body.angularForce.
    *
    * @method Phaser.Physics.P2.Body#applyForce
    * @param {Float32Array|Array} force - The force vector to add.
    * @param {number} worldX - The world x point to apply the force on.
    * @param {number} worldY - The world y point to apply the force on.
    */
    applyForce: function (force, worldX, worldY) {

        this.data.applyForce(force, [this.world.pxmi(worldX), this.world.pxmi(worldY)]);

    },

    /**
    * Sets the force on the body to zero.
    *
    * @method Phaser.Physics.P2.Body#setZeroForce
    */
    setZeroForce: function () {

        this.data.setZeroForce();

    },

    /**
    * If this Body is dynamic then this will zero its angular velocity.
    *
    * @method Phaser.Physics.P2.Body#setZeroRotation
    */
    setZeroRotation: function () {

        this.data.angularVelocity = 0;

    },

    /**
    * If this Body is dynamic then this will zero its velocity on both axis.
    *
    * @method Phaser.Physics.P2.Body#setZeroVelocity
    */
    setZeroVelocity: function () {

        this.data.velocity[0] = 0;
        this.data.velocity[1] = 0;

    },

    /**
    * Sets the Body damping and angularDamping to zero.
    *
    * @method Phaser.Physics.P2.Body#setZeroDamping
    */
    setZeroDamping: function () {

        this.data.damping = 0;
        this.data.angularDamping = 0;

    },

    /**
    * Transform a world point to local body frame.
    *
    * @method Phaser.Physics.P2.Body#toLocalFrame
    * @param {Float32Array|Array} out - The vector to store the result in.
    * @param {Float32Array|Array} worldPoint - The input world vector.
    */
    toLocalFrame: function (out, worldPoint) {

        return this.data.toLocalFrame(out, worldPoint);

    },

    /**
    * Transform a local point to world frame.
    *
    * @method Phaser.Physics.P2.Body#toWorldFrame
    * @param {Array} out - The vector to store the result in.
    * @param {Array} localPoint - The input local vector.
    */
    toWorldFrame: function (out, localPoint) {

        return this.data.toWorldFrame(out, localPoint);

    },

    /**
    * This will rotate the Body by the given speed to the left (counter-clockwise).
    *
    * @method Phaser.Physics.P2.Body#rotateLeft
    * @param {number} speed - The speed at which it should rotate.
    */
    rotateLeft: function (speed) {

        this.data.angularVelocity = this.world.pxm(-speed);

    },

    /**
    * This will rotate the Body by the given speed to the left (clockwise).
    *
    * @method Phaser.Physics.P2.Body#rotateRight
    * @param {number} speed - The speed at which it should rotate.
    */
    rotateRight: function (speed) {

        this.data.angularVelocity = this.world.pxm(speed);

    },

    /**
    * Moves the Body forwards based on its current angle and the given speed.
    * The speed is represented in pixels per second. So a value of 100 would move 100 pixels in 1 second (1000ms).
    *
    * @method Phaser.Physics.P2.Body#moveForward
    * @param {number} speed - The speed at which it should move forwards.
    */
    moveForward: function (speed) {

        var magnitude = this.world.pxmi(-speed);
        var angle = this.data.angle + Math.PI / 2;

        this.data.velocity[0] = magnitude * Math.cos(angle);
        this.data.velocity[1] = magnitude * Math.sin(angle);

    },

    /**
    * Moves the Body backwards based on its current angle and the given speed.
    * The speed is represented in pixels per second. So a value of 100 would move 100 pixels in 1 second (1000ms).
    *
    * @method Phaser.Physics.P2.Body#moveBackward
    * @param {number} speed - The speed at which it should move backwards.
    */
    moveBackward: function (speed) {

        var magnitude = this.world.pxmi(-speed);
        var angle = this.data.angle + Math.PI / 2;

        this.data.velocity[0] = -(magnitude * Math.cos(angle));
        this.data.velocity[1] = -(magnitude * Math.sin(angle));

    },

    /**
    * Applies a force to the Body that causes it to 'thrust' forwards, based on its current angle and the given speed.
    * The speed is represented in pixels per second. So a value of 100 would move 100 pixels in 1 second (1000ms).
    *
    * @method Phaser.Physics.P2.Body#thrust
    * @param {number} speed - The speed at which it should thrust.
    */
    thrust: function (speed) {

        var magnitude = this.world.pxmi(-speed);
        var angle = this.data.angle + Math.PI / 2;

        this.data.force[0] += magnitude * Math.cos(angle);
        this.data.force[1] += magnitude * Math.sin(angle);

    },

    /**
    * Applies a force to the Body that causes it to 'thrust' backwards (in reverse), based on its current angle and the given speed.
    * The speed is represented in pixels per second. So a value of 100 would move 100 pixels in 1 second (1000ms).
    *
    * @method Phaser.Physics.P2.Body#reverse
    * @param {number} speed - The speed at which it should reverse.
    */
    reverse: function (speed) {

        var magnitude = this.world.pxmi(-speed);
        var angle = this.data.angle + Math.PI / 2;

        this.data.force[0] -= magnitude * Math.cos(angle);
        this.data.force[1] -= magnitude * Math.sin(angle);

    },

    /**
    * If this Body is dynamic then this will move it to the left by setting its x velocity to the given speed.
    * The speed is represented in pixels per second. So a value of 100 would move 100 pixels in 1 second (1000ms).
    *
    * @method Phaser.Physics.P2.Body#moveLeft
    * @param {number} speed - The speed at which it should move to the left, in pixels per second.
    */
    moveLeft: function (speed) {

        this.data.velocity[0] = this.world.pxmi(-speed);

    },

    /**
    * If this Body is dynamic then this will move it to the right by setting its x velocity to the given speed.
    * The speed is represented in pixels per second. So a value of 100 would move 100 pixels in 1 second (1000ms).
    *
    * @method Phaser.Physics.P2.Body#moveRight
    * @param {number} speed - The speed at which it should move to the right, in pixels per second.
    */
    moveRight: function (speed) {

        this.data.velocity[0] = this.world.pxmi(speed);

    },

    /**
    * If this Body is dynamic then this will move it up by setting its y velocity to the given speed.
    * The speed is represented in pixels per second. So a value of 100 would move 100 pixels in 1 second (1000ms).
    *
    * @method Phaser.Physics.P2.Body#moveUp
    * @param {number} speed - The speed at which it should move up, in pixels per second.
    */
    moveUp: function (speed) {

        this.data.velocity[1] = this.world.pxmi(-speed);

    },

    /**
    * If this Body is dynamic then this will move it down by setting its y velocity to the given speed.
    * The speed is represented in pixels per second. So a value of 100 would move 100 pixels in 1 second (1000ms).
    *
    * @method Phaser.Physics.P2.Body#moveDown
    * @param {number} speed - The speed at which it should move down, in pixels per second.
    */
    moveDown: function (speed) {

        this.data.velocity[1] = this.world.pxmi(speed);

    },

    /**
    * Internal method. This is called directly before the sprites are sent to the renderer and after the update function has finished.
    *
    * @method Phaser.Physics.P2.Body#preUpdate
    * @protected
    */
    preUpdate: function () {

        if (this.removeNextStep)
        {
            this.removeFromWorld();
            this.removeNextStep = false;
        }

    },

    /**
    * Internal method. This is called directly before the sprites are sent to the renderer and after the update function has finished.
    *
    * @method Phaser.Physics.P2.Body#postUpdate
    * @protected
    */
    postUpdate: function () {

        this.sprite.x = this.world.mpxi(this.data.position[0]);
        this.sprite.y = this.world.mpxi(this.data.position[1]);

        if (!this.fixedRotation)
        {
            this.sprite.rotation = this.data.angle;
        }

    },

    /**
    * Resets the Body force, velocity (linear and angular) and rotation. Optionally resets damping and mass.
    *
    * @method Phaser.Physics.P2.Body#reset
    * @param {number} x - The new x position of the Body.
    * @param {number} y - The new x position of the Body.
    * @param {boolean} [resetDamping=false] - Resets the linear and angular damping.
    * @param {boolean} [resetMass=false] - Sets the Body mass back to 1.
    */
    reset: function (x, y, resetDamping, resetMass) {

        if (typeof resetDamping === 'undefined') { resetDamping = false; }
        if (typeof resetMass === 'undefined') { resetMass = false; }

        this.setZeroForce();
        this.setZeroVelocity();
        this.setZeroRotation();

        if (resetDamping)
        {
            this.setZeroDamping();
        }

        if (resetMass)
        {
            this.mass = 1;
        }

        this.x = x;
        this.y = y;

    },

    /**
    * Adds this physics body to the world.
    *
    * @method Phaser.Physics.P2.Body#addToWorld
    */
    addToWorld: function () {

        if (this.game.physics.p2._toRemove)
        {
            for (var i = 0; i < this.game.physics.p2._toRemove.length; i++)
            {
                if (this.game.physics.p2._toRemove[i] === this)
                {
                    this.game.physics.p2._toRemove.splice(i, 1);
                }
            }
        }
        
        if (this.data.world !== this.game.physics.p2.world)
        {
            this.game.physics.p2.addBody(this);
        }

    },

    /**
    * Removes this physics body from the world.
    *
    * @method Phaser.Physics.P2.Body#removeFromWorld
    */
    removeFromWorld: function () {

        if (this.data.world === this.game.physics.p2.world)
        {
            this.game.physics.p2.removeBodyNextStep(this);
        }

    },

    /**
    * Destroys this Body and all references it holds to other objects.
    *
    * @method Phaser.Physics.P2.Body#destroy
    */
    destroy: function () {

        this.removeFromWorld();

        this.clearShapes();

        this._bodyCallbacks = {};
        this._bodyCallbackContext = {};
        this._groupCallbacks = {};
        this._groupCallbackContext = {};

        if (this.debugBody)
        {
            this.debugBody.destroy();
        }

        this.debugBody = null;

        this.sprite = null;

    },

    /**
    * Removes all Shapes from this Body.
    *
    * @method Phaser.Physics.P2.Body#clearShapes
    */
    clearShapes: function () {

        var i = this.data.shapes.length;

        while (i--)
        {
            this.data.removeShape(this.data.shapes[i]);
        }

        this.shapeChanged();

    },

    /**
    * Add a shape to the body. You can pass a local transform when adding a shape, so that the shape gets an offset and an angle relative to the body center of mass.
    * Will automatically update the mass properties and bounding radius.
    *
    * @method Phaser.Physics.P2.Body#addShape
    * @param {p2.Shape} shape - The shape to add to the body.
    * @param {number} [offsetX=0] - Local horizontal offset of the shape relative to the body center of mass.
    * @param {number} [offsetY=0] - Local vertical offset of the shape relative to the body center of mass.
    * @param {number} [rotation=0] - Local rotation of the shape relative to the body center of mass, specified in radians.
    * @return {p2.Shape} The shape that was added to the body.
    */
    addShape: function (shape, offsetX, offsetY, rotation) {

        if (typeof offsetX === 'undefined') { offsetX = 0; }
        if (typeof offsetY === 'undefined') { offsetY = 0; }
        if (typeof rotation === 'undefined') { rotation = 0; }

        this.data.addShape(shape, [this.world.pxmi(offsetX), this.world.pxmi(offsetY)], rotation);
        this.shapeChanged();

        return shape;

    },

    /**
    * Adds a Circle shape to this Body. You can control the offset from the center of the body and the rotation.
    *
    * @method Phaser.Physics.P2.Body#addCircle
    * @param {number} radius - The radius of this circle (in pixels)
    * @param {number} [offsetX=0] - Local horizontal offset of the shape relative to the body center of mass.
    * @param {number} [offsetY=0] - Local vertical offset of the shape relative to the body center of mass.
    * @param {number} [rotation=0] - Local rotation of the shape relative to the body center of mass, specified in radians.
    * @return {p2.Circle} The Circle shape that was added to the Body.
    */
    addCircle: function (radius, offsetX, offsetY, rotation) {

        var shape = new p2.Circle(this.world.pxm(radius));

        return this.addShape(shape, offsetX, offsetY, rotation);

    },

    /**
    * Adds a Rectangle shape to this Body. You can control the offset from the center of the body and the rotation.
    *
    * @method Phaser.Physics.P2.Body#addRectangle
    * @param {number} width - The width of the rectangle in pixels.
    * @param {number} height - The height of the rectangle in pixels.
    * @param {number} [offsetX=0] - Local horizontal offset of the shape relative to the body center of mass.
    * @param {number} [offsetY=0] - Local vertical offset of the shape relative to the body center of mass.
    * @param {number} [rotation=0] - Local rotation of the shape relative to the body center of mass, specified in radians.
    * @return {p2.Rectangle} The Rectangle shape that was added to the Body.
    */
    addRectangle: function (width, height, offsetX, offsetY, rotation) {

        var shape = new p2.Rectangle(this.world.pxm(width), this.world.pxm(height));

        return this.addShape(shape, offsetX, offsetY, rotation);

    },

    /**
    * Adds a Plane shape to this Body. The plane is facing in the Y direction. You can control the offset from the center of the body and the rotation.
    *
    * @method Phaser.Physics.P2.Body#addPlane
    * @param {number} [offsetX=0] - Local horizontal offset of the shape relative to the body center of mass.
    * @param {number} [offsetY=0] - Local vertical offset of the shape relative to the body center of mass.
    * @param {number} [rotation=0] - Local rotation of the shape relative to the body center of mass, specified in radians.
    * @return {p2.Plane} The Plane shape that was added to the Body.
    */
    addPlane: function (offsetX, offsetY, rotation) {

        var shape = new p2.Plane();

        return this.addShape(shape, offsetX, offsetY, rotation);

    },

    /**
    * Adds a Particle shape to this Body. You can control the offset from the center of the body and the rotation.
    *
    * @method Phaser.Physics.P2.Body#addParticle
    * @param {number} [offsetX=0] - Local horizontal offset of the shape relative to the body center of mass.
    * @param {number} [offsetY=0] - Local vertical offset of the shape relative to the body center of mass.
    * @param {number} [rotation=0] - Local rotation of the shape relative to the body center of mass, specified in radians.
    * @return {p2.Particle} The Particle shape that was added to the Body.
    */
    addParticle: function (offsetX, offsetY, rotation) {

        var shape = new p2.Particle();

        return this.addShape(shape, offsetX, offsetY, rotation);

    },

    /**
    * Adds a Line shape to this Body.
    * The line shape is along the x direction, and stretches from [-length/2, 0] to [length/2,0].
    * You can control the offset from the center of the body and the rotation.
    *
    * @method Phaser.Physics.P2.Body#addLine
    * @param {number} length - The length of this line (in pixels)
    * @param {number} [offsetX=0] - Local horizontal offset of the shape relative to the body center of mass.
    * @param {number} [offsetY=0] - Local vertical offset of the shape relative to the body center of mass.
    * @param {number} [rotation=0] - Local rotation of the shape relative to the body center of mass, specified in radians.
    * @return {p2.Line} The Line shape that was added to the Body.
    */
    addLine: function (length, offsetX, offsetY, rotation) {

        var shape = new p2.Line(this.world.pxm(length));

        return this.addShape(shape, offsetX, offsetY, rotation);

    },

    /**
    * Adds a Capsule shape to this Body.
    * You can control the offset from the center of the body and the rotation.
    *
    * @method Phaser.Physics.P2.Body#addCapsule
    * @param {number} length - The distance between the end points in pixels.
    * @param {number} radius - Radius of the capsule in radians.
    * @param {number} [offsetX=0] - Local horizontal offset of the shape relative to the body center of mass.
    * @param {number} [offsetY=0] - Local vertical offset of the shape relative to the body center of mass.
    * @param {number} [rotation=0] - Local rotation of the shape relative to the body center of mass, specified in radians.
    * @return {p2.Capsule} The Capsule shape that was added to the Body.
    */
    addCapsule: function (length, radius, offsetX, offsetY, rotation) {

        var shape = new p2.Capsule(this.world.pxm(length), radius);

        return this.addShape(shape, offsetX, offsetY, rotation);

    },

    /**
    * Reads a polygon shape path, and assembles convex shapes from that and puts them at proper offset points. The shape must be simple and without holes.
    * This function expects the x.y values to be given in pixels. If you want to provide them at p2 world scales then call Body.data.fromPolygon directly.
    *
    * @method Phaser.Physics.P2.Body#addPolygon
    * @param {object} options - An object containing the build options:
    * @param {boolean} [options.optimalDecomp=false] - Set to true if you need optimal decomposition. Warning: very slow for polygons with more than 10 vertices.
    * @param {boolean} [options.skipSimpleCheck=false] - Set to true if you already know that the path is not intersecting itself.
    * @param {boolean|number} [options.removeCollinearPoints=false] - Set to a number (angle threshold value) to remove collinear points, or false to keep all points.
    * @param {(number[]|...number)} points - An array of 2d vectors that form the convex or concave polygon.
    *                                       Either [[0,0], [0,1],...] or a flat array of numbers that will be interpreted as [x,y, x,y, ...],
    *                                       or the arguments passed can be flat x,y values e.g. `setPolygon(options, x,y, x,y, x,y, ...)` where `x` and `y` are numbers.
    * @return {boolean} True on success, else false.
    */
    addPolygon: function (options, points) {

        options = options || {};

        points = Array.prototype.slice.call(arguments, 1);

        var path = [];

        //  Did they pass in a single array of points?
        if (points.length === 1 && Array.isArray(points[0]))
        {
            path = points[0].slice(0);
        }
        else if (Array.isArray(points[0]))
        {
            path = points[0].slice(0);
        }
        else if (typeof points[0] === 'number')
        {
            //  We've a list of numbers
            for (var i = 0, len = points.length; i < len; i += 2)
            {
                path.push([points[i], points[i + 1]]);
            }
        }

        //  top and tail
        var idx = path.length - 1;

        if (path[idx][0] === path[0][0] && path[idx][1] === path[0][1])
        {
            path.pop();
        }

        //  Now process them into p2 values
        for (var p = 0; p < path.length; p++)
        {
            path[p][0] = this.world.pxmi(path[p][0]);
            path[p][1] = this.world.pxmi(path[p][1]);
        }

        var result = this.data.fromPolygon(path, options);

        this.shapeChanged();

        return result;

    },

    /**
    * Remove a shape from the body. Will automatically update the mass properties and bounding radius.
    *
    * @method Phaser.Physics.P2.Body#removeShape
    * @param {p2.Circle|p2.Rectangle|p2.Plane|p2.Line|p2.Particle} shape - The shape to remove from the body.
    * @return {boolean} True if the shape was found and removed, else false.
    */
    removeShape: function (shape) {

		var result = this.data.removeShape(shape);
	
		this.shapeChanged();
	
        return result;
    },

    /**
    * Clears any previously set shapes. Then creates a new Circle shape and adds it to this Body.
    *
    * @method Phaser.Physics.P2.Body#setCircle
    * @param {number} radius - The radius of this circle (in pixels)
    * @param {number} [offsetX=0] - Local horizontal offset of the shape relative to the body center of mass.
    * @param {number} [offsetY=0] - Local vertical offset of the shape relative to the body center of mass.
    * @param {number} [rotation=0] - Local rotation of the shape relative to the body center of mass, specified in radians.
    */
    setCircle: function (radius, offsetX, offsetY, rotation) {

        this.clearShapes();

        return this.addCircle(radius, offsetX, offsetY, rotation);

    },

    /**
    * Clears any previously set shapes. The creates a new Rectangle shape at the given size and offset, and adds it to this Body.
    * If you wish to create a Rectangle to match the size of a Sprite or Image see Body.setRectangleFromSprite.
    *
    * @method Phaser.Physics.P2.Body#setRectangle
    * @param {number} [width=16] - The width of the rectangle in pixels.
    * @param {number} [height=16] - The height of the rectangle in pixels.
    * @param {number} [offsetX=0] - Local horizontal offset of the shape relative to the body center of mass.
    * @param {number} [offsetY=0] - Local vertical offset of the shape relative to the body center of mass.
    * @param {number} [rotation=0] - Local rotation of the shape relative to the body center of mass, specified in radians.
    * @return {p2.Rectangle} The Rectangle shape that was added to the Body.
    */
    setRectangle: function (width, height, offsetX, offsetY, rotation) {

        if (typeof width === 'undefined') { width = 16; }
        if (typeof height === 'undefined') { height = 16; }

        this.clearShapes();

        return this.addRectangle(width, height, offsetX, offsetY, rotation);

    },

    /**
    * Clears any previously set shapes.
    * Then creates a Rectangle shape sized to match the dimensions and orientation of the Sprite given.
    * If no Sprite is given it defaults to using the parent of this Body.
    *
    * @method Phaser.Physics.P2.Body#setRectangleFromSprite
    * @param {Phaser.Sprite|Phaser.Image} [sprite] - The Sprite on which the Rectangle will get its dimensions.
    * @return {p2.Rectangle} The Rectangle shape that was added to the Body.
    */
    setRectangleFromSprite: function (sprite) {

        if (typeof sprite === 'undefined') { sprite = this.sprite; }

        this.clearShapes();

        return this.addRectangle(sprite.width, sprite.height, 0, 0, sprite.rotation);

    },

    /**
    * Adds the given Material to all Shapes that belong to this Body.
    * If you only wish to apply it to a specific Shape in this Body then provide that as the 2nd parameter.
    *
    * @method Phaser.Physics.P2.Body#setMaterial
    * @param {Phaser.Physics.P2.Material} material - The Material that will be applied.
    * @param {p2.Shape} [shape] - An optional Shape. If not provided the Material will be added to all Shapes in this Body.
    */
    setMaterial: function (material, shape) {

        if (typeof shape === 'undefined')
        {
            for (var i = this.data.shapes.length - 1; i >= 0; i--)
            {
                this.data.shapes[i].material = material;
            }
        }
        else
        {
            shape.material = material;
        }

    },

    /**
    * Updates the debug draw if any body shapes change.
    *
    * @method Phaser.Physics.P2.Body#shapeChanged
    */
    shapeChanged: function() {

        if (this.debugBody)
        {
            this.debugBody.draw();
        }

    },

    /**
    * Reads the shape data from a physics data file stored in the Game.Cache and adds it as a polygon to this Body.
    * The shape data format is based on the custom phaser export in.
    *
    * @method Phaser.Physics.P2.Body#addPhaserPolygon
    * @param {string} key - The key of the Physics Data file as stored in Game.Cache.
    * @param {string} object - The key of the object within the Physics data file that you wish to load the shape data from.
    */
    addPhaserPolygon: function (key, object) {

        var data = this.game.cache.getPhysicsData(key, object);
        var createdFixtures = [];

        //  Cycle through the fixtures
        for (var i = 0; i < data.length; i++)
        {
            var fixtureData = data[i];
            var shapesOfFixture = this.addFixture(fixtureData);

            //  Always add to a group
            createdFixtures[fixtureData.filter.group] = createdFixtures[fixtureData.filter.group] || [];
            createdFixtures[fixtureData.filter.group] = createdFixtures[fixtureData.filter.group].concat(shapesOfFixture);

            //  if (unique) fixture key is provided
            if (fixtureData.fixtureKey)
            {
                createdFixtures[fixtureData.fixtureKey] = shapesOfFixture;
            }
        }

        this.data.aabbNeedsUpdate = true;
        this.shapeChanged();

        return createdFixtures;

    },

    /**
    * Add a polygon fixture. This is used during #loadPolygon.
    *
    * @method Phaser.Physics.P2.Body#addFixture
    * @param {string} fixtureData - The data for the fixture. It contains: isSensor, filter (collision) and the actual polygon shapes.
    * @return {array} An array containing the generated shapes for the given polygon.
    */
    addFixture: function (fixtureData) {

        var generatedShapes = [];

        if (fixtureData.circle)
        {
            var shape = new p2.Circle(this.world.pxm(fixtureData.circle.radius));
            shape.collisionGroup = fixtureData.filter.categoryBits;
            shape.collisionMask = fixtureData.filter.maskBits;
            shape.sensor = fixtureData.isSensor;

            var offset = p2.vec2.create();
            offset[0] = this.world.pxmi(fixtureData.circle.position[0] - this.sprite.width/2);
            offset[1] = this.world.pxmi(fixtureData.circle.position[1] - this.sprite.height/2);

            this.data.addShape(shape, offset);
            generatedShapes.push(shape);
        }
        else
        {
            var polygons = fixtureData.polygons;
            var cm = p2.vec2.create();

            for (var i = 0; i < polygons.length; i++)
            {
                var shapes = polygons[i];
                var vertices = [];

                for (var s = 0; s < shapes.length; s += 2)
                {
                    vertices.push([ this.world.pxmi(shapes[s]), this.world.pxmi(shapes[s + 1]) ]);
                }

                var shape = new p2.Convex(vertices);

                //  Move all vertices so its center of mass is in the local center of the convex
                for (var j = 0; j !== shape.vertices.length; j++)
                {
                    var v = shape.vertices[j];
                    p2.vec2.sub(v, v, shape.centerOfMass);
                }

                p2.vec2.scale(cm, shape.centerOfMass, 1);

                cm[0] -= this.world.pxmi(this.sprite.width / 2);
                cm[1] -= this.world.pxmi(this.sprite.height / 2);

                shape.updateTriangles();
                shape.updateCenterOfMass();
                shape.updateBoundingRadius();

                shape.collisionGroup = fixtureData.filter.categoryBits;
                shape.collisionMask = fixtureData.filter.maskBits;
                shape.sensor = fixtureData.isSensor;

                this.data.addShape(shape, cm);

                generatedShapes.push(shape);
            }
        }

        return generatedShapes;

    },

    /**
    * Reads the shape data from a physics data file stored in the Game.Cache and adds it as a polygon to this Body.
    *
    * @method Phaser.Physics.P2.Body#loadPolygon
    * @param {string} key - The key of the Physics Data file as stored in Game.Cache.
    * @param {string} object - The key of the object within the Physics data file that you wish to load the shape data from.
    * @return {boolean} True on success, else false.
    */
    loadPolygon: function (key, object) {

        var data = this.game.cache.getPhysicsData(key, object);

        //  We've multiple Convex shapes, they should be CCW automatically
        var cm = p2.vec2.create();

        for (var i = 0; i < data.length; i++)
        {
            var vertices = [];

            for (var s = 0; s < data[i].shape.length; s += 2)
            {
                vertices.push([ this.world.pxmi(data[i].shape[s]), this.world.pxmi(data[i].shape[s + 1]) ]);
            }

            var c = new p2.Convex(vertices);

            // Move all vertices so its center of mass is in the local center of the convex
            for (var j = 0; j !== c.vertices.length; j++)
            {
                var v = c.vertices[j];
                p2.vec2.sub(v, v, c.centerOfMass);
            }

            p2.vec2.scale(cm, c.centerOfMass, 1);

            cm[0] -= this.world.pxmi(this.sprite.width / 2);
            cm[1] -= this.world.pxmi(this.sprite.height / 2);

            c.updateTriangles();
            c.updateCenterOfMass();
            c.updateBoundingRadius();

            this.data.addShape(c, cm);
        }

        this.data.aabbNeedsUpdate = true;
        this.shapeChanged();

        return true;

    },

    /**
    * DEPRECATED: This method will soon be removed from the API. Please avoid using.
    * Reads the physics data from a physics data file stored in the Game.Cache.
    * It will add the shape data to this Body, as well as set the density (mass).
    *
    * @method Phaser.Physics.P2.Body#loadData
    * @param {string} key - The key of the Physics Data file as stored in Game.Cache.
    * @param {string} object - The key of the object within the Physics data file that you wish to load the shape data from.
    * @return {boolean} True on success, else false.
    */
    loadData: function (key, object) {

        var data = this.game.cache.getPhysicsData(key, object);

        if (data && data.shape)
        {
            this.mass = data.density;
            return this.loadPolygon(key, object);
        }

    }

};

Phaser.Physics.P2.Body.prototype.constructor = Phaser.Physics.P2.Body;

/**
 * Dynamic body.
 * @property DYNAMIC
 * @type {Number}
 * @static
 */
Phaser.Physics.P2.Body.DYNAMIC = 1;

/**
 * Static body.
 * @property STATIC
 * @type {Number}
 * @static
 */
Phaser.Physics.P2.Body.STATIC = 2;

/**
 * Kinematic body.
 * @property KINEMATIC
 * @type {Number}
 * @static
 */
Phaser.Physics.P2.Body.KINEMATIC = 4;

/**
* @name Phaser.Physics.P2.Body#static
* @property {boolean} static - Returns true if the Body is static. Setting Body.static to 'false' will make it dynamic.
*/
Object.defineProperty(Phaser.Physics.P2.Body.prototype, "static", {

    get: function () {

        return (this.data.motionState === Phaser.Physics.P2.Body.STATIC);

    },

    set: function (value) {

        if (value && this.data.motionState !== Phaser.Physics.P2.Body.STATIC)
        {
            this.data.motionState = Phaser.Physics.P2.Body.STATIC;
            this.mass = 0;
        }
        else if (!value && this.data.motionState === Phaser.Physics.P2.Body.STATIC)
        {
            this.data.motionState = Phaser.Physics.P2.Body.DYNAMIC;

            if (this.mass === 0)
            {
                this.mass = 1;
            }
        }

    }

});

/**
* @name Phaser.Physics.P2.Body#dynamic
* @property {boolean} dynamic - Returns true if the Body is dynamic. Setting Body.dynamic to 'false' will make it static.
*/
Object.defineProperty(Phaser.Physics.P2.Body.prototype, "dynamic", {

    get: function () {

        return (this.data.motionState === Phaser.Physics.P2.Body.DYNAMIC);

    },

    set: function (value) {

        if (value && this.data.motionState !== Phaser.Physics.P2.Body.DYNAMIC)
        {
            this.data.motionState = Phaser.Physics.P2.Body.DYNAMIC;

            if (this.mass === 0)
            {
                this.mass = 1;
            }
        }
        else if (!value && this.data.motionState === Phaser.Physics.P2.Body.DYNAMIC)
        {
            this.data.motionState = Phaser.Physics.P2.Body.STATIC;
            this.mass = 0;
        }

    }

});

/**
* @name Phaser.Physics.P2.Body#kinematic
* @property {boolean} kinematic - Returns true if the Body is kinematic. Setting Body.kinematic to 'false' will make it static.
*/
Object.defineProperty(Phaser.Physics.P2.Body.prototype, "kinematic", {

    get: function () {

        return (this.data.motionState === Phaser.Physics.P2.Body.KINEMATIC);

    },

    set: function (value) {

        if (value && this.data.motionState !== Phaser.Physics.P2.Body.KINEMATIC)
        {
            this.data.motionState = Phaser.Physics.P2.Body.KINEMATIC;
            this.mass = 4;
        }
        else if (!value && this.data.motionState === Phaser.Physics.P2.Body.KINEMATIC)
        {
            this.data.motionState = Phaser.Physics.P2.Body.STATIC;
            this.mass = 0;
        }

    }

});

/**
* @name Phaser.Physics.P2.Body#allowSleep
* @property {boolean} allowSleep -
*/
Object.defineProperty(Phaser.Physics.P2.Body.prototype, "allowSleep", {

    get: function () {

        return this.data.allowSleep;

    },

    set: function (value) {

        if (value !== this.data.allowSleep)
        {
            this.data.allowSleep = value;
        }

    }

});

/**
* The angle of the Body in degrees from its original orientation. Values from 0 to 180 represent clockwise rotation; values from 0 to -180 represent counterclockwise rotation.
* Values outside this range are added to or subtracted from 360 to obtain a value within the range. For example, the statement Body.angle = 450 is the same as Body.angle = 90.
* If you wish to work in radians instead of degrees use the property Body.rotation instead. Working in radians is faster as it doesn't have to convert values.
*
* @name Phaser.Physics.P2.Body#angle
* @property {number} angle - The angle of this Body in degrees.
*/
Object.defineProperty(Phaser.Physics.P2.Body.prototype, "angle", {

    get: function() {

        return Phaser.Math.wrapAngle(Phaser.Math.radToDeg(this.data.angle));

    },

    set: function(value) {

        this.data.angle = Phaser.Math.degToRad(Phaser.Math.wrapAngle(value));

    }

});

/**
* Damping is specified as a value between 0 and 1, which is the proportion of velocity lost per second.
* @name Phaser.Physics.P2.Body#angularDamping
* @property {number} angularDamping - The angular damping acting acting on the body.
*/
Object.defineProperty(Phaser.Physics.P2.Body.prototype, "angularDamping", {

    get: function () {

        return this.data.angularDamping;

    },

    set: function (value) {

        this.data.angularDamping = value;

    }

});

/**
* @name Phaser.Physics.P2.Body#angularForce
* @property {number} angularForce - The angular force acting on the body.
*/
Object.defineProperty(Phaser.Physics.P2.Body.prototype, "angularForce", {

    get: function () {

        return this.data.angularForce;

    },

    set: function (value) {

        this.data.angularForce = value;

    }

});

/**
* @name Phaser.Physics.P2.Body#angularVelocity
* @property {number} angularVelocity - The angular velocity of the body.
*/
Object.defineProperty(Phaser.Physics.P2.Body.prototype, "angularVelocity", {

    get: function () {

        return this.data.angularVelocity;

    },

    set: function (value) {

        this.data.angularVelocity = value;

    }

});

/**
* Damping is specified as a value between 0 and 1, which is the proportion of velocity lost per second.
* @name Phaser.Physics.P2.Body#damping
* @property {number} damping - The linear damping acting on the body in the velocity direction.
*/
Object.defineProperty(Phaser.Physics.P2.Body.prototype, "damping", {

    get: function () {

        return this.data.damping;

    },

    set: function (value) {

        this.data.damping = value;

    }

});

/**
* @name Phaser.Physics.P2.Body#fixedRotation
* @property {boolean} fixedRotation -
*/
Object.defineProperty(Phaser.Physics.P2.Body.prototype, "fixedRotation", {

    get: function () {

        return this.data.fixedRotation;

    },

    set: function (value) {

        if (value !== this.data.fixedRotation)
        {
            this.data.fixedRotation = value;
        }

    }

});

/**
* @name Phaser.Physics.P2.Body#inertia
* @property {number} inertia - The inertia of the body around the Z axis..
*/
Object.defineProperty(Phaser.Physics.P2.Body.prototype, "inertia", {

    get: function () {

        return this.data.inertia;

    },

    set: function (value) {

        this.data.inertia = value;

    }

});

/**
* @name Phaser.Physics.P2.Body#mass
* @property {number} mass -
*/
Object.defineProperty(Phaser.Physics.P2.Body.prototype, "mass", {

    get: function () {

        return this.data.mass;

    },

    set: function (value) {

        if (value !== this.data.mass)
        {
            this.data.mass = value;
            this.data.updateMassProperties();
        }

    }

});

/**
* @name Phaser.Physics.P2.Body#motionState
* @property {number} motionState - The type of motion this body has. Should be one of: Body.STATIC (the body does not move), Body.DYNAMIC (body can move and respond to collisions) and Body.KINEMATIC (only moves according to its .velocity).
*/
Object.defineProperty(Phaser.Physics.P2.Body.prototype, "motionState", {

    get: function () {

        return this.data.motionState;

    },

    set: function (value) {

        if (value !== this.data.motionState)
        {
            this.data.motionState = value;
        }

    }

});

/**
* The angle of the Body in radians.
* If you wish to work in degrees instead of radians use the Body.angle property instead. Working in radians is faster as it doesn't have to convert values.
*
* @name Phaser.Physics.P2.Body#rotation
* @property {number} rotation - The angle of this Body in radians.
*/
Object.defineProperty(Phaser.Physics.P2.Body.prototype, "rotation", {

    get: function() {

        return this.data.angle;

    },

    set: function(value) {

        this.data.angle = value;

    }

});

/**
* @name Phaser.Physics.P2.Body#sleepSpeedLimit
* @property {number} sleepSpeedLimit - .
*/
Object.defineProperty(Phaser.Physics.P2.Body.prototype, "sleepSpeedLimit", {

    get: function () {

        return this.data.sleepSpeedLimit;

    },

    set: function (value) {

        this.data.sleepSpeedLimit = value;

    }

});

/**
* @name Phaser.Physics.P2.Body#x
* @property {number} x - The x coordinate of this Body.
*/
Object.defineProperty(Phaser.Physics.P2.Body.prototype, "x", {

    get: function () {

        return this.world.mpxi(this.data.position[0]);

    },

    set: function (value) {

        this.data.position[0] = this.world.pxmi(value);

    }

});

/**
* @name Phaser.Physics.P2.Body#y
* @property {number} y - The y coordinate of this Body.
*/
Object.defineProperty(Phaser.Physics.P2.Body.prototype, "y", {

    get: function () {

        return this.world.mpxi(this.data.position[1]);

    },

    set: function (value) {

        this.data.position[1] = this.world.pxmi(value);

    }

});

/**
* @name Phaser.Physics.P2.Body#id
* @property {number} id - The Body ID. Each Body that has been added to the World has a unique ID.
* @readonly
*/
Object.defineProperty(Phaser.Physics.P2.Body.prototype, "id", {

    get: function () {

        return this.data.id;

    }

});

/**
* @name Phaser.Physics.P2.Body#debug
* @property {boolean} debug - Enable or disable debug drawing of this body
*/
Object.defineProperty(Phaser.Physics.P2.Body.prototype, "debug", {

    get: function () {

        return (this.debugBody !== null);

    },

    set: function (value) {

        if (value && !this.debugBody)
        {
            //  This will be added to the global space
            this.debugBody = new Phaser.Physics.P2.BodyDebug(this.game, this.data);
        }
        else if (!value && this.debugBody)
        {
            this.debugBody.destroy();
            this.debugBody = null;
        }

    }

});

/**
* A Body can be set to collide against the World bounds automatically if this is set to true. Otherwise it will leave the World.
* Note that this only applies if your World has bounds! The response to the collision should be managed via CollisionMaterials.
*
* @name Phaser.Physics.P2.Body#collideWorldBounds
* @property {boolean} collideWorldBounds - Should the Body collide with the World bounds?
*/
Object.defineProperty(Phaser.Physics.P2.Body.prototype, "collideWorldBounds", {

    get: function () {

        return this._collideWorldBounds;

    },

    set: function (value) {

        if (value && !this._collideWorldBounds)
        {
            this._collideWorldBounds = true;
            this.updateCollisionMask();
        }
        else if (!value && this._collideWorldBounds)
        {
            this._collideWorldBounds = false;
            this.updateCollisionMask();
        }

    }

});

/**
* @author       George https://github.com/georgiee
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Draws a P2 Body to a Graphics instance for visual debugging.
* Needless to say, for every body you enable debug drawing on, you are adding processor and graphical overhead.
* So use sparingly and rarely (if ever) in production code.
*
* @class Phaser.Physics.P2.BodyDebug
* @classdesc Physics Body Debug Constructor
* @constructor
* @extends Phaser.Group
* @param {Phaser.Game} game - Game reference to the currently running game.
* @param {Phaser.Physics.P2.Body} body - The P2 Body to display debug data for.
* @param {object} settings - Settings object.
*/
Phaser.Physics.P2.BodyDebug = function(game, body, settings) {

    Phaser.Group.call(this, game);

    /**
    * @property {object} defaultSettings - Default debug settings.
    * @private
    */
    var defaultSettings = {
        pixelsPerLengthUnit: 20,
        debugPolygons: false,
        lineWidth: 1,
        alpha: 0.5
    };

    this.settings = Phaser.Utils.extend(defaultSettings, settings);

    /**
    * @property {number} ppu - Pixels per Length Unit.
    */
    this.ppu = this.settings.pixelsPerLengthUnit;
    this.ppu = -1 * this.ppu;

    /**
    * @property {Phaser.Physics.P2.Body} body - The P2 Body to display debug data for.
    */
    this.body = body;

    /**
    * @property {Phaser.Graphics} canvas - The canvas to render the debug info to.
    */
    this.canvas = new Phaser.Graphics(game);

    this.canvas.alpha = this.settings.alpha;

    this.add(this.canvas);

    this.draw();

};

Phaser.Physics.P2.BodyDebug.prototype = Object.create(Phaser.Group.prototype);
Phaser.Physics.P2.BodyDebug.prototype.constructor = Phaser.Physics.P2.BodyDebug;

Phaser.Utils.extend(Phaser.Physics.P2.BodyDebug.prototype, {

    /**
    * Core update.
    *
    * @method Phaser.Physics.P2.BodyDebug#update
    */
    update: function() {

        this.updateSpriteTransform();

    },

    /**
    * Core update.
    *
    * @method Phaser.Physics.P2.BodyDebug#updateSpriteTransform
    */
    updateSpriteTransform: function() {

        this.position.x = this.body.position[0] * this.ppu;
        this.position.y = this.body.position[1] * this.ppu;

        return this.rotation = this.body.angle;

    },

    /**
    * Draws the P2 shapes to the Graphics object.
    *
    * @method Phaser.Physics.P2.BodyDebug#draw
    */
    draw: function() {

        var angle, child, color, i, j, lineColor, lw, obj, offset, sprite, v, verts, vrot, _j, _ref1;
        obj = this.body;
        sprite = this.canvas;
        sprite.clear();
        color = parseInt(this.randomPastelHex(), 16);
        lineColor = 0xff0000;
        lw = this.lineWidth;

        if (obj instanceof p2.Body && obj.shapes.length)
        {
            var l = obj.shapes.length;

            i = 0;

            while (i !== l)
            {
                child = obj.shapes[i];
                offset = obj.shapeOffsets[i];
                angle = obj.shapeAngles[i];
                offset = offset || 0;
                angle = angle || 0;

                if (child instanceof p2.Circle)
                {
                    this.drawCircle(sprite, offset[0] * this.ppu, offset[1] * this.ppu, angle, child.radius * this.ppu, color, lw);
                }
                else if (child instanceof p2.Convex)
                {
                    verts = [];
                    vrot = p2.vec2.create();

                    for (j = _j = 0, _ref1 = child.vertices.length; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; j = 0 <= _ref1 ? ++_j : --_j)
                    {
                        v = child.vertices[j];
                        p2.vec2.rotate(vrot, v, angle);
                        verts.push([(vrot[0] + offset[0]) * this.ppu, -(vrot[1] + offset[1]) * this.ppu]);
                    }

                    this.drawConvex(sprite, verts, child.triangles, lineColor, color, lw, this.settings.debugPolygons, [offset[0] * this.ppu, -offset[1] * this.ppu]);
                }
                else if (child instanceof p2.Plane)
                {
                    this.drawPlane(sprite, offset[0] * this.ppu, -offset[1] * this.ppu, color, lineColor, lw * 5, lw * 10, lw * 10, this.ppu * 100, angle);
                }
                else if (child instanceof p2.Line)
                {
                    this.drawLine(sprite, child.length * this.ppu, lineColor, lw);
                }
                else if (child instanceof p2.Rectangle)
                {
                    this.drawRectangle(sprite, offset[0] * this.ppu, -offset[1] * this.ppu, angle, child.width * this.ppu, child.height * this.ppu, lineColor, color, lw);
                }

                i++;
            }
        }

    },

    /**
    * Draws the P2 shapes to the Graphics object.
    *
    * @method Phaser.Physics.P2.BodyDebug#draw
    */
    drawRectangle: function(g, x, y, angle, w, h, color, fillColor, lineWidth) {

        if (typeof lineWidth === 'undefined') { lineWidth = 1; }
        if (typeof color === 'undefined') { color = 0x000000; }

        g.lineStyle(lineWidth, color, 1);
        g.beginFill(fillColor);
        g.drawRect(x - w / 2, y - h / 2, w, h);

    },

    /**
    * Draws a P2 Circle shape.
    *
    * @method Phaser.Physics.P2.BodyDebug#drawCircle
    */
    drawCircle: function(g, x, y, angle, radius, color, lineWidth) {

        if (typeof lineWidth === 'undefined') { lineWidth = 1; }
        if (typeof color === 'undefined') { color = 0xffffff; }
        g.lineStyle(lineWidth, 0x000000, 1);
        g.beginFill(color, 1.0);
        g.drawCircle(x, y, -radius);
        g.endFill();
        g.moveTo(x, y);
        g.lineTo(x + radius * Math.cos(-angle), y + radius * Math.sin(-angle));

    },

    /**
    * Draws a P2 Line shape.
    *
    * @method Phaser.Physics.P2.BodyDebug#drawCircle
    */
    drawLine: function(g, len, color, lineWidth) {

        if (typeof lineWidth === 'undefined') { lineWidth = 1; }
        if (typeof color === 'undefined') { color = 0x000000; }

        g.lineStyle(lineWidth * 5, color, 1);
        g.moveTo(-len / 2, 0);
        g.lineTo(len / 2, 0);

    },

    /**
    * Draws a P2 Convex shape.
    *
    * @method Phaser.Physics.P2.BodyDebug#drawConvex
    */
    drawConvex: function(g, verts, triangles, color, fillColor, lineWidth, debug, offset) {

        var colors, i, v, v0, v1, x, x0, x1, y, y0, y1;

        if (typeof lineWidth === 'undefined') { lineWidth = 1; }
        if (typeof color === 'undefined') { color = 0x000000; }

        if (!debug)
        {
            g.lineStyle(lineWidth, color, 1);
            g.beginFill(fillColor);
            i = 0;

            while (i !== verts.length)
            {
                v = verts[i];
                x = v[0];
                y = v[1];

                if (i === 0)
                {
                    g.moveTo(x, -y);
                }
                else
                {
                    g.lineTo(x, -y);
                }

                i++;
            }

            g.endFill();

            if (verts.length > 2)
            {
                g.moveTo(verts[verts.length - 1][0], -verts[verts.length - 1][1]);
                return g.lineTo(verts[0][0], -verts[0][1]);
            }
        }
        else
        {
            colors = [0xff0000, 0x00ff00, 0x0000ff];
            i = 0;

            while (i !== verts.length + 1)
            {
                v0 = verts[i % verts.length];
                v1 = verts[(i + 1) % verts.length];
                x0 = v0[0];
                y0 = v0[1];
                x1 = v1[0];
                y1 = v1[1];
                g.lineStyle(lineWidth, colors[i % colors.length], 1);
                g.moveTo(x0, -y0);
                g.lineTo(x1, -y1);
                g.drawCircle(x0, -y0, lineWidth * 2);
                i++;
            }

            g.lineStyle(lineWidth, 0x000000, 1);
            return g.drawCircle(offset[0], offset[1], lineWidth * 2);
        }

    },

    /**
    * Draws a P2 Path.
    *
    * @method Phaser.Physics.P2.BodyDebug#drawPath
    */
    drawPath: function(g, path, color, fillColor, lineWidth) {

        var area, i, lastx, lasty, p1x, p1y, p2x, p2y, p3x, p3y, v, x, y;
        if (typeof lineWidth === 'undefined') { lineWidth = 1; }
        if (typeof color === 'undefined') { color = 0x000000; }

        g.lineStyle(lineWidth, color, 1);

        if (typeof fillColor === "number")
        {
            g.beginFill(fillColor);
        }

        lastx = null;
        lasty = null;
        i = 0;

        while (i < path.length)
        {
            v = path[i];
            x = v[0];
            y = v[1];

            if (x !== lastx || y !== lasty)
            {
                if (i === 0)
                {
                    g.moveTo(x, y);
                }
                else
                {
                    p1x = lastx;
                    p1y = lasty;
                    p2x = x;
                    p2y = y;
                    p3x = path[(i + 1) % path.length][0];
                    p3y = path[(i + 1) % path.length][1];
                    area = ((p2x - p1x) * (p3y - p1y)) - ((p3x - p1x) * (p2y - p1y));

                    if (area !== 0)
                    {
                        g.lineTo(x, y);
                    }
                }
                lastx = x;
                lasty = y;
            }

            i++;

        }

        if (typeof fillColor === "number")
        {
            g.endFill();
        }

        if (path.length > 2 && typeof fillColor === "number")
        {
            g.moveTo(path[path.length - 1][0], path[path.length - 1][1]);
            g.lineTo(path[0][0], path[0][1]);
        }

    },

    /**
    * Draws a P2 Plane shape.
    *
    * @method Phaser.Physics.P2.BodyDebug#drawPlane
    */
    drawPlane: function(g, x0, x1, color, lineColor, lineWidth, diagMargin, diagSize, maxLength, angle) {

        var max, xd, yd;
        if (typeof lineWidth === 'undefined') { lineWidth = 1; }
        if (typeof color === 'undefined') { color = 0xffffff; }

        g.lineStyle(lineWidth, lineColor, 11);
        g.beginFill(color);
        max = maxLength;

        g.moveTo(x0, -x1);
        xd = x0 + Math.cos(angle) * this.game.width;
        yd = x1 + Math.sin(angle) * this.game.height;
        g.lineTo(xd, -yd);

        g.moveTo(x0, -x1);
        xd = x0 + Math.cos(angle) * -this.game.width;
        yd = x1 + Math.sin(angle) * -this.game.height;
        g.lineTo(xd, -yd);

    },

    /**
    * Picks a random pastel color.
    *
    * @method Phaser.Physics.P2.BodyDebug#randomPastelHex
    */
    randomPastelHex: function() {

        var blue, green, mix, red;
        mix = [255, 255, 255];

        red = Math.floor(Math.random() * 256);
        green = Math.floor(Math.random() * 256);
        blue = Math.floor(Math.random() * 256);

        red = Math.floor((red + 3 * mix[0]) / 4);
        green = Math.floor((green + 3 * mix[1]) / 4);
        blue = Math.floor((blue + 3 * mix[2]) / 4);

        return this.rgbToHex(red, green, blue);

    },

    /**
    * Converts from RGB to Hex.
    *
    * @method Phaser.Physics.P2.BodyDebug#rgbToHex
    */
    rgbToHex: function(r, g, b) {
        return this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    },

    /**
    * Component to hex conversion.
    *
    * @method Phaser.Physics.P2.BodyDebug#componentToHex
    */
    componentToHex: function(c) {

        var hex;
        hex = c.toString(16);

        if (hex.len === 2)
        {
            return hex;
        }
        else
        {
            return hex + '0';
        }

    }

});

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Creates a spring, connecting two bodies. A spring can have a resting length, a stiffness and damping.
*
* @class Phaser.Physics.P2.Spring
* @classdesc Physics Spring Constructor
* @constructor
* @param {Phaser.Physics.P2} world - A reference to the P2 World.
* @param {p2.Body} bodyA - First connected body.
* @param {p2.Body} bodyB - Second connected body.
* @param {number} [restLength=1] - Rest length of the spring. A number > 0.
* @param {number} [stiffness=100] - Stiffness of the spring. A number >= 0.
* @param {number} [damping=1] - Damping of the spring. A number >= 0.
* @param {Array} [worldA] - Where to hook the spring to body A in world coordinates. This value is an array with 2 elements matching x and y, i.e: [32, 32].
* @param {Array} [worldB] - Where to hook the spring to body B in world coordinates. This value is an array with 2 elements matching x and y, i.e: [32, 32].
* @param {Array} [localA] - Where to hook the spring to body A in local body coordinates. This value is an array with 2 elements matching x and y, i.e: [32, 32].
* @param {Array} [localB] - Where to hook the spring to body B in local body coordinates. This value is an array with 2 elements matching x and y, i.e: [32, 32].
*/
Phaser.Physics.P2.Spring = function (world, bodyA, bodyB, restLength, stiffness, damping, worldA, worldB, localA, localB) {

    /**
    * @property {Phaser.Game} game - Local reference to game.
    */
    this.game = world.game;

    /**
    * @property {Phaser.Physics.P2} world - Local reference to P2 World.
    */
    this.world = world;

    if (typeof restLength === 'undefined') { restLength = 1; }
    if (typeof stiffness === 'undefined') { stiffness = 100; }
    if (typeof damping === 'undefined') { damping = 1; }

    restLength = world.pxm(restLength);

    var options = {
        restLength: restLength,
        stiffness: stiffness,
        damping: damping
    };

    if (typeof worldA !== 'undefined' && worldA !== null)
    {
        options.worldAnchorA = [ world.pxm(worldA[0]), world.pxm(worldA[1]) ];
    }

    if (typeof worldB !== 'undefined' && worldB !== null)
    {
        options.worldAnchorB = [ world.pxm(worldB[0]), world.pxm(worldB[1]) ];
    }

    if (typeof localA !== 'undefined' && localA !== null)
    {
        options.localAnchorA = [ world.pxm(localA[0]), world.pxm(localA[1]) ];
    }

    if (typeof localB !== 'undefined' && localB !== null)
    {
        options.localAnchorB = [ world.pxm(localB[0]), world.pxm(localB[1]) ];
    }

    p2.Spring.call(this, bodyA, bodyB, options);

};

Phaser.Physics.P2.Spring.prototype = Object.create(p2.Spring.prototype);
Phaser.Physics.P2.Spring.prototype.constructor = Phaser.Physics.P2.Spring;

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* \o/ ~ "Because I'm a Material girl"
*
* @class Phaser.Physics.P2.Material
* @classdesc Physics Material Constructor
* @constructor
*/
Phaser.Physics.P2.Material = function (name) {

    /**
    * @property {string} name - The user defined name given to this Material.
    * @default
    */
    this.name = name;

    p2.Material.call(this);

};

Phaser.Physics.P2.Material.prototype = Object.create(p2.Material.prototype);
Phaser.Physics.P2.Material.prototype.constructor = Phaser.Physics.P2.Material;

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Defines a physics material
*
* @class Phaser.Physics.P2.ContactMaterial
* @classdesc Physics ContactMaterial Constructor
* @constructor
* @param {Phaser.Physics.P2.Material} materialA
* @param {Phaser.Physics.P2.Material} materialB
* @param {object} [options]
*/
Phaser.Physics.P2.ContactMaterial = function (materialA, materialB, options) {

	/**
	* @property {number} id - The contact material identifier.
	*/

	/**
	* @property {Phaser.Physics.P2.Material} materialA - First material participating in the contact material.
	*/

	/**
	* @property {Phaser.Physics.P2.Material} materialB - First second participating in the contact material.
	*/

	/**
	* @property {number} [friction=0.3] - Friction to use in the contact of these two materials.
	*/

	/**
	* @property {number} [restitution=0.0] - Restitution to use in the contact of these two materials.
	*/

	/**
	* @property {number} [stiffness=1e7] - Stiffness of the resulting ContactEquation that this ContactMaterial generate.
	*/

	/**
	* @property {number} [relaxation=3] - Relaxation of the resulting ContactEquation that this ContactMaterial generate.
	*/

	/**
	* @property {number} [frictionStiffness=1e7] - Stiffness of the resulting FrictionEquation that this ContactMaterial generate.
	*/

	/**
	* @property {number} [frictionRelaxation=3] - Relaxation of the resulting FrictionEquation that this ContactMaterial generate.
	*/

	/**
	* @property {number} [surfaceVelocity=0] - Will add surface velocity to this material. If bodyA rests on top if bodyB, and the surface velocity is positive, bodyA will slide to the right.
	*/

    p2.ContactMaterial.call(this, materialA, materialB, options);

};

Phaser.Physics.P2.ContactMaterial.prototype = Object.create(p2.ContactMaterial.prototype);
Phaser.Physics.P2.ContactMaterial.prototype.constructor = Phaser.Physics.P2.ContactMaterial;

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Collision Group
*
* @class Phaser.Physics.P2.CollisionGroup
* @classdesc Physics Collision Group Constructor
* @constructor
*/
Phaser.Physics.P2.CollisionGroup = function (bitmask) {

    /**
    * @property {number} mask - The CollisionGroup bitmask.
    */
    this.mask = bitmask;

};

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A constraint that tries to keep the distance between two bodies constant.
*
* @class Phaser.Physics.P2.DistanceConstraint
* @classdesc Physics DistanceConstraint Constructor
* @constructor
* @param {Phaser.Physics.P2} world - A reference to the P2 World.
* @param {p2.Body} bodyA - First connected body.
* @param {p2.Body} bodyB - Second connected body.
* @param {number} distance - The distance to keep between the bodies.
* @param {number} [maxForce] - The maximum force that should be applied to constrain the bodies.
*/
Phaser.Physics.P2.DistanceConstraint = function (world, bodyA, bodyB, distance, maxForce) {

    if (typeof distance === 'undefined') { distance = 100; }

    /**
    * @property {Phaser.Game} game - Local reference to game.
    */
    this.game = world.game;

    /**
    * @property {Phaser.Physics.P2} world - Local reference to P2 World.
    */
    this.world = world;

    distance = world.pxm(distance);

    p2.DistanceConstraint.call(this, bodyA, bodyB, distance, {maxForce: maxForce});

};

Phaser.Physics.P2.DistanceConstraint.prototype = Object.create(p2.DistanceConstraint.prototype);
Phaser.Physics.P2.DistanceConstraint.prototype.constructor = Phaser.Physics.P2.DistanceConstraint;

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Connects two bodies at given offset points, letting them rotate relative to each other around this point.
*
* @class Phaser.Physics.P2.GearConstraint
* @classdesc Physics GearConstraint Constructor
* @constructor
* @param {Phaser.Physics.P2} world - A reference to the P2 World.
* @param {p2.Body} bodyA - First connected body.
* @param {p2.Body} bodyB - Second connected body.
* @param {number} [angle=0] - The relative angle
* @param {number} [ratio=1] - The gear ratio.
*/
Phaser.Physics.P2.GearConstraint = function (world, bodyA, bodyB, angle, ratio) {

    if (typeof angle === 'undefined') { angle = 0; }
    if (typeof ratio === 'undefined') { ratio = 1; }

    /**
    * @property {Phaser.Game} game - Local reference to game.
    */
    this.game = world.game;

    /**
    * @property {Phaser.Physics.P2} world - Local reference to P2 World.
    */
    this.world = world;

    var options = { angle: angle, ratio: ratio };

    p2.GearConstraint.call(this, bodyA, bodyB, options);

};

Phaser.Physics.P2.GearConstraint.prototype = Object.create(p2.GearConstraint.prototype);
Phaser.Physics.P2.GearConstraint.prototype.constructor = Phaser.Physics.P2.GearConstraint;

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Locks the relative position between two bodies.
*
* @class Phaser.Physics.P2.LockConstraint
* @classdesc Physics LockConstraint Constructor
* @constructor
* @param {Phaser.Physics.P2} world - A reference to the P2 World.
* @param {p2.Body} bodyA - First connected body.
* @param {p2.Body} bodyB - Second connected body.
* @param {Array} [offset] - The offset of bodyB in bodyA's frame. The value is an array with 2 elements matching x and y, i.e: [32, 32].
* @param {number} [angle=0] - The angle of bodyB in bodyA's frame.
* @param {number} [maxForce] - The maximum force that should be applied to constrain the bodies.
*/
Phaser.Physics.P2.LockConstraint = function (world, bodyA, bodyB, offset, angle, maxForce) {

    if (typeof offset === 'undefined') { offset = [0, 0]; }
    if (typeof angle === 'undefined') { angle = 0; }
    if (typeof maxForce === 'undefined') { maxForce = Number.MAX_VALUE; }

    /**
    * @property {Phaser.Game} game - Local reference to game.
    */
    this.game = world.game;

    /**
    * @property {Phaser.Physics.P2} world - Local reference to P2 World.
    */
    this.world = world;

    offset = [ world.pxm(offset[0]), world.pxm(offset[1]) ];

    var options = { localOffsetB: offset, localAngleB: angle, maxForce: maxForce };

    p2.LockConstraint.call(this, bodyA, bodyB, options);

};

Phaser.Physics.P2.LockConstraint.prototype = Object.create(p2.LockConstraint.prototype);
Phaser.Physics.P2.LockConstraint.prototype.constructor = Phaser.Physics.P2.LockConstraint;

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Connects two bodies at given offset points, letting them rotate relative to each other around this point.
*
* @class Phaser.Physics.P2.PrismaticConstraint
* @classdesc Physics PrismaticConstraint Constructor
* @constructor
* @param {Phaser.Physics.P2} world - A reference to the P2 World.
* @param {p2.Body} bodyA - First connected body.
* @param {p2.Body} bodyB - Second connected body.
* @param {boolean} [lockRotation=true] - If set to false, bodyB will be free to rotate around its anchor point.
* @param {Array} [anchorA] - Body A's anchor point, defined in its own local frame. The value is an array with 2 elements matching x and y, i.e: [32, 32].
* @param {Array} [anchorB] - Body A's anchor point, defined in its own local frame. The value is an array with 2 elements matching x and y, i.e: [32, 32].
* @param {Array} [axis] - An axis, defined in body A frame, that body B's anchor point may slide along. The value is an array with 2 elements matching x and y, i.e: [32, 32].
* @param {number} [maxForce] - The maximum force that should be applied to constrain the bodies.
*/
Phaser.Physics.P2.PrismaticConstraint = function (world, bodyA, bodyB, lockRotation, anchorA, anchorB, axis, maxForce) {

    if (typeof lockRotation === 'undefined') { lockRotation = true; }
    if (typeof anchorA === 'undefined') { anchorA = [0, 0]; }
    if (typeof anchorB === 'undefined') { anchorB = [0, 0]; }
    if (typeof axis === 'undefined') { axis = [0, 0]; }
    if (typeof maxForce === 'undefined') { maxForce = Number.MAX_VALUE; }

    /**
    * @property {Phaser.Game} game - Local reference to game.
    */
    this.game = world.game;

    /**
    * @property {Phaser.Physics.P2} world - Local reference to P2 World.
    */
    this.world = world;

    anchorA = [ world.pxmi(anchorA[0]), world.pxmi(anchorA[1]) ];
    anchorB = [ world.pxmi(anchorB[0]), world.pxmi(anchorB[1]) ];

    var options = { localAnchorA: anchorA, localAnchorB: anchorB, localAxisA: axis, maxForce: maxForce, disableRotationalLock: !lockRotation };

    p2.PrismaticConstraint.call(this, bodyA, bodyB, options);

};

Phaser.Physics.P2.PrismaticConstraint.prototype = Object.create(p2.PrismaticConstraint.prototype);
Phaser.Physics.P2.PrismaticConstraint.prototype.constructor = Phaser.Physics.P2.PrismaticConstraint;

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Connects two bodies at given offset points, letting them rotate relative to each other around this point.
* The pivot points are given in world (pixel) coordinates.
*
* @class Phaser.Physics.P2.RevoluteConstraint
* @classdesc Physics RevoluteConstraint Constructor
* @constructor
* @param {Phaser.Physics.P2} world - A reference to the P2 World.
* @param {p2.Body} bodyA - First connected body.
* @param {Float32Array} pivotA - The point relative to the center of mass of bodyA which bodyA is constrained to. The value is an array with 2 elements matching x and y, i.e: [32, 32].
* @param {p2.Body} bodyB - Second connected body.
* @param {Float32Array} pivotB - The point relative to the center of mass of bodyB which bodyB is constrained to. The value is an array with 2 elements matching x and y, i.e: [32, 32].
* @param {number} [maxForce=0] - The maximum force that should be applied to constrain the bodies.
*/
Phaser.Physics.P2.RevoluteConstraint = function (world, bodyA, pivotA, bodyB, pivotB, maxForce) {

    if (typeof maxForce === 'undefined') { maxForce = Number.MAX_VALUE; }

    /**
    * @property {Phaser.Game} game - Local reference to game.
    */
    this.game = world.game;

    /**
    * @property {Phaser.Physics.P2} world - Local reference to P2 World.
    */
    this.world = world;

    pivotA = [ world.pxmi(pivotA[0]), world.pxmi(pivotA[1]) ];
    pivotB = [ world.pxmi(pivotB[0]), world.pxmi(pivotB[1]) ];

    p2.RevoluteConstraint.call(this, bodyA, pivotA, bodyB, pivotB, {maxForce: maxForce});

};

Phaser.Physics.P2.RevoluteConstraint.prototype = Object.create(p2.RevoluteConstraint.prototype);
Phaser.Physics.P2.RevoluteConstraint.prototype.constructor = Phaser.Physics.P2.RevoluteConstraint;
