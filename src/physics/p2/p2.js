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
/* Copyright (c) 2012, Brandon Jones, Colin MacKenzie IV. All rights reserved.

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
 * @class 2x2 Matrix
 * @name mat2
 */
var mat2 = {};

var mat2Identity = new Float32Array([
    1, 0,
    0, 1
]);

if(!GLMAT_EPSILON) {
    var GLMAT_EPSILON = 0.000001;
}

/**
 * Creates a new identity mat2
 *
 * @returns {mat2} a new 2x2 matrix
 */
mat2.create = function() {
    return new Float32Array(mat2Identity);
};

/**
 * Creates a new mat2 initialized with values from an existing matrix
 *
 * @param {mat2} a matrix to clone
 * @returns {mat2} a new 2x2 matrix
 */
mat2.clone = function(a) {
    var out = new Float32Array(4);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
};

/**
 * Copy the values from one mat2 to another
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
};

/**
 * Set a mat2 to the identity matrix
 *
 * @param {mat2} out the receiving matrix
 * @returns {mat2} out
 */
mat2.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

/**
 * Transpose the values of a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.transpose = function(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
        var a1 = a[1];
        out[1] = a[2];
        out[2] = a1;
    } else {
        out[0] = a[0];
        out[1] = a[2];
        out[2] = a[1];
        out[3] = a[3];
    }

    return out;
};

/**
 * Inverts a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.invert = function(out, a) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],

        // Calculate the determinant
        det = a0 * a3 - a2 * a1;

    if (!det) {
        return null;
    }
    det = 1.0 / det;

    out[0] =  a3 * det;
    out[1] = -a1 * det;
    out[2] = -a2 * det;
    out[3] =  a0 * det;

    return out;
};

/**
 * Caclulates the adjugate of a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.adjoint = function(out, a) {
    // Caching this value is nessecary if out == a
    var a0 = a[0];
    out[0] =  a[3];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] =  a0;

    return out;
};

/**
 * Calculates the determinant of a mat2
 *
 * @param {mat2} a the source matrix
 * @returns {Number} determinant of a
 */
mat2.determinant = function (a) {
    return a[0] * a[3] - a[2] * a[1];
};

/**
 * Multiplies two mat2's
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the first operand
 * @param {mat2} b the second operand
 * @returns {mat2} out
 */
mat2.multiply = function (out, a, b) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
    var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    out[0] = a0 * b0 + a1 * b2;
    out[1] = a0 * b1 + a1 * b3;
    out[2] = a2 * b0 + a3 * b2;
    out[3] = a2 * b1 + a3 * b3;
    return out;
};

/**
 * Alias for {@link mat2.multiply}
 * @function
 */
mat2.mul = mat2.multiply;

/**
 * Rotates a mat2 by the given angle
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the matrix to rotate
 * @param {mat2} rad the angle to rotate the matrix by
 * @returns {mat2} out
 */
mat2.rotate = function (out, a, rad) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
        s = Math.sin(rad),
        c = Math.cos(rad);
    out[0] = a0 *  c + a1 * s;
    out[1] = a0 * -s + a1 * c;
    out[2] = a2 *  c + a3 * s;
    out[3] = a2 * -s + a3 * c;
    return out;
};

/**
 * Scales the mat2 by the dimensions in the given vec2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the matrix to rotate
 * @param {mat2} v the vec2 to scale the matrix by
 * @returns {mat2} out
 **/
mat2.scale = function(out, a, v) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
        v0 = v[0], v1 = v[1];
    out[0] = a0 * v0;
    out[1] = a1 * v1;
    out[2] = a2 * v0;
    out[3] = a3 * v1;
    return out;
};

/**
 * Returns a string representation of a mat2
 *
 * @param {mat2} mat matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat2.str = function (a) {
    return 'mat2(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
};

if(typeof(exports) !== 'undefined') {
    exports.mat2 = mat2;
}

},{}],2:[function(require,module,exports){
/* Copyright (c) 2012, Brandon Jones, Colin MacKenzie IV. All rights reserved.

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

if(!GLMAT_EPSILON) {
    var GLMAT_EPSILON = 0.000001;
}

/**
 * Creates a new, empty vec2
 *
 * @returns {vec2} a new 2D vector
 */
vec2.create = function() {
    return new Float32Array(2);
};

/**
 * Creates a new vec2 initialized with values from an existing vector
 *
 * @param {vec2} a vector to clone
 * @returns {vec2} a new 2D vector
 */
vec2.clone = function(a) {
    var out = new Float32Array(2);
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
    var out = new Float32Array(2);
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
 * @param {vec2} b amount to scale the vector by
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
 * Caclulates the length of a vec2
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
 * Caclulates the squared length of a vec2
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
 * Caclulates the dot product of two vec2's
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
 * @param {vec3} out the receiving vector
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
    out[0] = x * m[0] + y * m[1];
    out[1] = x * m[2] + y * m[3];
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
    var vec = new Float32Array(2);

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

},{}],3:[function(require,module,exports){
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


},{"./Scalar":6}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

},{"./Line":3,"./Point":4,"./Scalar":6}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
module.exports = {
    Polygon : require("./Polygon"),
    Point : require("./Point"),
};

},{"./Point":4,"./Polygon":5}],8:[function(require,module,exports){
module.exports={
    "name": "p2",
    "version": "0.4.0",
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
    "licenses" : [
        {
            "type" : "MIT"
        }
    ],
    "devDependencies" : {
        "jshint"    : "latest",
        "nodeunit"  : "latest",
        "grunt": "~0.4.0",
        "grunt-contrib-jshint": "~0.1.1",
        "grunt-contrib-nodeunit": "~0.1.2",
        "grunt-contrib-concat": "~0.1.3",
        "grunt-contrib-uglify": "*",
        "grunt-browserify" : "*",
        "browserify":"*"
    },
    "dependencies" : {
        "underscore":"*",
        "poly-decomp" : "git://github.com/schteppe/poly-decomp.js",
        "gl-matrix":"2.0.0",
        "jsonschema":"*"
    }
}

},{}],9:[function(require,module,exports){
var vec2 = require('../math/vec2')
,   Utils = require('../utils/Utils')

module.exports = AABB;

/**
 * Axis aligned bounding box class.
 * @class AABB
 * @constructor
 * @param {Object} options
 * @param {Array} upperBound
 * @param {Array} lowerBound
 */
function AABB(options){

    /**
     * The lower bound of the bounding box.
     * @property lowerBound
     * @type {Array}
     */
    this.lowerBound = vec2.create();
    if(options && options.lowerBound) vec2.copy(this.lowerBound, options.lowerBound);

    /**
     * The upper bound of the bounding box.
     * @property upperBound
     * @type {Array}
     */
    this.upperBound = vec2.create();
    if(options && options.upperBound) vec2.copy(this.upperBound, options.upperBound);
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

        if(typeof(angle) =="number"){
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
        if(aabb.lowerBound[i] < this.lowerBound[i])
            this.lowerBound[i] = aabb.lowerBound[i];

        // Upper
        if(aabb.upperBound[i] > this.upperBound[i])
            this.upperBound[i] = aabb.upperBound[i];
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

},{"../math/vec2":33,"../utils/Utils":50}],10:[function(require,module,exports){
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
     */
    this.world = null;
};

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
    if(bodyA.aabbNeedsUpdate) bodyA.updateAABB();
    if(bodyB.aabbNeedsUpdate) bodyB.updateAABB();
    return bodyA.aabb.overlaps(bodyB.aabb);
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
    if(bodyA.motionState == Body.STATIC && bodyB.motionState == Body.STATIC)
        return false;

    // Cannot collide static vs kinematic bodies
    if( (bodyA.motionState == Body.KINEMATIC && bodyB.motionState == Body.STATIC) ||
        (bodyA.motionState == Body.STATIC    && bodyB.motionState == Body.KINEMATIC))
        return false;

    // Cannot collide kinematic vs kinematic
    if(bodyA.motionState == Body.KINEMATIC && bodyB.motionState == Body.KINEMATIC)
        return false;

    // Cannot collide both sleeping bodies
    if(bodyA.sleepState == Body.SLEEPING && bodyB.sleepState == Body.SLEEPING)
        return false;

    return true;
};

Broadphase.NAIVE = 1;
Broadphase.SAP = 2;

},{"../math/vec2":33,"../objects/Body":34}],11:[function(require,module,exports){
var Circle = require('../shapes/Circle')
,   Plane = require('../shapes/Plane')
,   Particle = require('../shapes/Particle')
,   Broadphase = require('../collision/Broadphase')
,   vec2 = require('../math/vec2')

module.exports = GridBroadphase;

/**
 * Broadphase that uses axis-aligned bins.
 * @class GridBroadphase
 * @constructor
 * @extends Broadphase
 * @param {number} xmin Lower x bound of the grid
 * @param {number} xmax Upper x bound
 * @param {number} ymin Lower y bound
 * @param {number} ymax Upper y bound
 * @param {number} nx Number of bins along x axis
 * @param {number} ny Number of bins along y axis
 * @todo test
 */
function GridBroadphase(xmin,xmax,ymin,ymax,nx,ny){
    Broadphase.apply(this);

    nx = nx || 10;
    ny = ny || 10;

    this.binsizeX = (xmax-xmin) / nx;
    this.binsizeY = (ymax-ymin) / ny;
    this.nx = nx;
    this.ny = ny;
    this.xmin = xmin;
    this.ymin = ymin;
    this.xmax = xmax;
    this.ymax = ymax;
};
GridBroadphase.prototype = new Broadphase();

/**
 * Get a bin index given a world coordinate
 * @method getBinIndex
 * @param  {Number} x
 * @param  {Number} y
 * @return {Number} Integer index
 */
GridBroadphase.prototype.getBinIndex = function(x,y){
    var nx = this.nx,
        ny = this.ny,
        xmin = this.xmin,
        ymin = this.ymin,
        xmax = this.xmax,
        ymax = this.ymax;

    var xi = Math.floor(nx * (x - xmin) / (xmax-xmin));
    var yi = Math.floor(ny * (y - ymin) / (ymax-ymin));
    return xi*ny + yi;
}

/**
 * Get collision pairs.
 * @method getCollisionPairs
 * @param  {World} world
 * @return {Array}
 */
GridBroadphase.prototype.getCollisionPairs = function(world){
    var result = [],
        collidingBodies = world.bodies,
        Ncolliding = Ncolliding=collidingBodies.length,
        binsizeX = this.binsizeX,
        binsizeY = this.binsizeY;

    var bins=[], Nbins=nx*ny;
    for(var i=0; i<Nbins; i++)
        bins.push([]);

    var xmult = nx / (xmax-xmin);
    var ymult = ny / (ymax-ymin);

    // Put all bodies into bins
    for(var i=0; i!==Ncolliding; i++){
        var bi = collidingBodies[i];
        var si = bi.shape;
        if (si === undefined) {
            continue;
        } else if(si instanceof Circle){
            // Put in bin
            // check if overlap with other bins
            var x = bi.position[0];
            var y = bi.position[1];
            var r = si.radius;

            var xi1 = Math.floor(xmult * (x-r - xmin));
            var yi1 = Math.floor(ymult * (y-r - ymin));
            var xi2 = Math.floor(xmult * (x+r - xmin));
            var yi2 = Math.floor(ymult * (y+r - ymin));

            for(var j=xi1; j<=xi2; j++){
                for(var k=yi1; k<=yi2; k++){
                    var xi = j;
                    var yi = k;
                    if(xi*(ny-1) + yi >= 0 && xi*(ny-1) + yi < Nbins)
                        bins[ xi*(ny-1) + yi ].push(bi);
                }
            }
        } else if(si instanceof Plane){
            // Put in all bins for now
            if(bi.angle == 0){
                var y = bi.position[1];
                for(var j=0; j!==Nbins && ymin+binsizeY*(j-1)<y; j++){
                    for(var k=0; k<nx; k++){
                        var xi = k;
                        var yi = Math.floor(ymult * (binsizeY*j - ymin));
                        bins[ xi*(ny-1) + yi ].push(bi);
                    }
                }
            } else if(bi.angle == Math.PI*0.5){
                var x = bi.position[0];
                for(var j=0; j!==Nbins && xmin+binsizeX*(j-1)<x; j++){
                    for(var k=0; k<ny; k++){
                        var yi = k;
                        var xi = Math.floor(xmult * (binsizeX*j - xmin));
                        bins[ xi*(ny-1) + yi ].push(bi);
                    }
                }
            } else {
                for(var j=0; j!==Nbins; j++)
                    bins[j].push(bi);
            }
        } else {
            throw new Error("Shape not supported in GridBroadphase!");
        }
    }

    // Check each bin
    for(var i=0; i!==Nbins; i++){
        var bin = bins[i];

        for(var j=0, NbodiesInBin=bin.length; j!==NbodiesInBin; j++){
            var bi = bin[j];
            var si = bi.shape;

            for(var k=0; k!==j; k++){
                var bj = bin[k];
                var sj = bj.shape;

                if(si instanceof Circle){
                         if(sj instanceof Circle)   c=Broadphase.circleCircle  (bi,bj);
                    else if(sj instanceof Particle) c=Broadphase.circleParticle(bi,bj);
                    else if(sj instanceof Plane)    c=Broadphase.circlePlane   (bi,bj);
                } else if(si instanceof Particle){
                         if(sj instanceof Circle)   c=Broadphase.circleParticle(bj,bi);
                } else if(si instanceof Plane){
                         if(sj instanceof Circle)   c=Broadphase.circlePlane   (bj,bi);
                }
            }
        }
    }
    return result;
};

},{"../collision/Broadphase":10,"../math/vec2":33,"../shapes/Circle":38,"../shapes/Particle":42,"../shapes/Plane":43}],12:[function(require,module,exports){
var Circle = require('../shapes/Circle')
,   Plane = require('../shapes/Plane')
,   Shape = require('../shapes/Shape')
,   Particle = require('../shapes/Particle')
,   Broadphase = require('../collision/Broadphase')
,   vec2 = require('../math/vec2')

module.exports = NaiveBroadphase;

/**
 * Naive broadphase implementation. Does N^2 tests.
 *
 * @class NaiveBroadphase
 * @constructor
 * @extends Broadphase
 */
function NaiveBroadphase(){
    Broadphase.call(this,Broadphase.NAIVE);

    /**
     * Set to true to use bounding box checks instead of bounding radius.
     * @property useBoundingBoxes
     * @type {Boolean}
     */
    this.useBoundingBoxes = false;
};
NaiveBroadphase.prototype = new Broadphase();

/**
 * Get the colliding pairs
 * @method getCollisionPairs
 * @param  {World} world
 * @return {Array}
 */
NaiveBroadphase.prototype.getCollisionPairs = function(world){
    var bodies = world.bodies,
        result = this.result,
        i, j, bi, bj,
        check = this.useBoundingBoxes ? Broadphase.aabbCheck : Broadphase.boundingRadiusCheck;

    result.length = 0;

    for(i=0, Ncolliding=bodies.length; i!==Ncolliding; i++){
        bi = bodies[i];

        for(j=0; j<i; j++){
            bj = bodies[j];

            if(Broadphase.canCollide(bi,bj) && check(bi,bj))
                result.push(bi,bj);
        }
    }

    return result;
};

},{"../collision/Broadphase":10,"../math/vec2":33,"../shapes/Circle":38,"../shapes/Particle":42,"../shapes/Plane":43,"../shapes/Shape":45}],13:[function(require,module,exports){
var vec2 = require('../math/vec2')
,   sub = vec2.sub
,   add = vec2.add
,   dot = vec2.dot
,   Utils = require('../utils/Utils')
,   ContactEquation = require('../equations/ContactEquation')
,   FrictionEquation = require('../equations/FrictionEquation')
,   Circle = require('../shapes/Circle')
,   Shape = require('../shapes/Shape')
,   Body = require('../objects/Body')
,   Rectangle = require('../shapes/Rectangle')

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
,   tmpArray = []

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
    this.stiffness = 1e7;

    /**
     * The stiffness value to use in the next contact equations.
     * @property {Number} stiffness
     */
    this.relaxation = 3;

    /**
     * The stiffness value to use in the next friction equations.
     * @property frictionStiffness
     * @type {Number}
     */
    this.frictionStiffness = 1e7;

    /**
     * The relaxation value to use in the next friction equations.
     * @property frictionRelaxation
     * @type {Number}
     */
    this.frictionRelaxation = 3;


    // Keep track of the colliding bodies last step
    this.collidingBodiesLastStep = { keys:[] };
};

/**
 * Check if the bodies were in contact since the last reset().
 * @method collidedLastStep
 * @param  {Body} bi
 * @param  {Body} bj
 * @return {Boolean}
 */
Narrowphase.prototype.collidedLastStep = function(bi,bj){
    var id1 = bi.id,
        id2 = bj.id;
    if(id1 > id2){
        var tmp = id1;
        id1 = id2;
        id2 = tmp;
    }
    return !!this.collidingBodiesLastStep[id1 + " " + id2];
};

// "for in" loops aren't optimised in chrome... is there a better way to handle last-step collision memory?
// Maybe do this: http://jsperf.com/reflection-vs-array-of-keys
function clearObject(obj){
    for(var i = 0, l = obj.keys.length; i < l; i++) {
        delete obj[obj.keys[i]];
    }
    obj.keys.length = 0;
    /*
    for(var key in this.collidingBodiesLastStep)
        delete this.collidingBodiesLastStep[key];
    */
}

/**
 * Throws away the old equations and gets ready to create new
 * @method reset
 * @param {World} world
 */
Narrowphase.prototype.reset = function(world){

    // Save the colliding bodies data
    clearObject(this.collidingBodiesLastStep);
    for(var i=0; i!==this.contactEquations.length; i++){
        var eq = this.contactEquations[i],
            id1 = eq.bi.id,
            id2 = eq.bj.id;
        if(id1 > id2){
            var tmp = id1;
            id1 = id2;
            id2 = tmp;
        }
        var key = id1 + " " + id2;
        if(!this.collidingBodiesLastStep[key]){
            this.collidingBodiesLastStep[key] = true;
            this.collidingBodiesLastStep.keys.push(key);
        }
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
    c.bi = bodyA;
    c.bj = bodyB;
    c.shapeA = shapeA;
    c.shapeB = shapeB;
    c.restitution = this.restitution;
    c.firstImpact = !this.collidedLastStep(bodyA,bodyB);
    c.stiffness = this.stiffness;
    c.relaxation = this.relaxation;
    c.enabled = true;

    if(bodyA.allowSleep && (bodyA.motionState == Body.DYNAMIC) && !(bodyB.motionState == Body.STATIC || bodyB.sleepState === Body.SLEEPY))
        bodyA.wakeUp();
    if(bodyB.allowSleep && (bodyB.motionState == Body.DYNAMIC) && !(bodyA.motionState == Body.STATIC || bodyA.sleepState === Body.SLEEPY))
        bodyB.wakeUp();

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
    c.bi = bodyA;
    c.bj = bodyB;
    c.shapeA = shapeA;
    c.shapeB = shapeB;
    c.setSlipForce(this.slipForce);
    c.frictionCoefficient = this.frictionCoefficient;
    c.relativeVelocity = this.surfaceVelocity;
    c.enabled = true;
    c.frictionStiffness = this.frictionStiffness;
    c.frictionRelaxation = this.frictionRelaxation;
    return c;
};

/**
 * Creates a FrictionEquation given the data in the ContactEquation. Uses same offset vectors ri and rj, but the tangent vector will be constructed from the collision normal.
 * @method createFrictionFromContact
 * @param  {ContactEquation} contactEquation
 * @return {FrictionEquation}
 */
Narrowphase.prototype.createFrictionFromContact = function(c){
    var eq = this.createFrictionEquation(c.bi,c.bj,c.shapeA,c.shapeB);
    vec2.copy(eq.ri, c.ri);
    vec2.copy(eq.rj, c.rj);
    vec2.rotate(eq.t, c.ni, -Math.PI / 2);
    eq.contactEquation = c;
    return eq;
}

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
    vec2.rotate(worldTangent, worldEdgeUnit, -Math.PI/2);

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

            vec2.copy(c.ni, worldNormal);
            vec2.normalize(c.ni,c.ni);

            // distance vector along plane normal
            vec2.scale(dist, worldNormal, d);

            // Vector from plane center to contact
            sub(c.ri, v, dist);
            sub(c.ri, c.ri, planeBody.position);

            // From line center to contact
            sub(c.rj, v,    lineOffset);
            add(c.rj, c.rj, lineOffset);
            sub(c.rj, c.rj, lineBody.position);

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
    vec2.rotate(worldTangent, worldEdgeUnit, -Math.PI/2);

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

            vec2.scale(c.ni, orthoDist, -1);
            vec2.normalize(c.ni, c.ni);

            vec2.scale( c.ri, c.ni,  circleRadius);
            add(c.ri, c.ri, circleOffset);
            sub(c.ri, c.ri, circleBody.position);

            sub(c.rj, projectedPoint, lineOffset);
            add(c.rj, c.rj, lineOffset);
            sub(c.rj, c.rj, lineBody.position);

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

            vec2.copy(c.ni, dist);
            vec2.normalize(c.ni,c.ni);

            // Vector from circle to contact point is the normal times the circle radius
            vec2.scale(c.ri, c.ni, circleRadius);
            add(c.ri, c.ri, circleOffset);
            sub(c.ri, c.ri, circleBody.position);

            sub(c.rj, v, lineOffset);
            vec2.scale(lineEndToLineRadius, c.ni, -lineRadius);
            add(c.rj, c.rj, lineEndToLineRadius);
            add(c.rj, c.rj, lineOffset);
            sub(c.rj, c.rj, lineBody.position);

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
        vec2.rotate(worldTangent, worldEdgeUnit, -Math.PI/2);

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
        vec2.sub(c.ni, minCandidate, circleOffset)
        vec2.normalize(c.ni, c.ni);

        vec2.scale(c.ri,  c.ni, circleRadius);
        add(c.ri, c.ri, circleOffset);
        sub(c.ri, c.ri, circleBody.position);

        sub(c.rj, closestEdgeProjectedPoint, convexOffset);
        add(c.rj, c.rj, convexOffset);
        sub(c.rj, c.rj, convexBody.position);

        this.contactEquations.push(c);

        if(this.enableFriction)
            this.frictionEquations.push( this.createFrictionFromContact(c) );

        return 1;
    }

    /*
    if(closestEdge != -1){
        var c = this.createContactEquation(circleBody,convexBody);

        vec2.scale(c.ni, closestEdgeOrthoDist, -1);
        vec2.normalize(c.ni, c.ni);

        vec2.scale(c.ri,  c.ni, circleRadius);
        add(c.ri, c.ri, circleOffset);
        sub(c.ri, c.ri, circleBody.position);

        sub(c.rj, closestEdgeProjectedPoint, convexOffset);
        add(c.rj, c.rj, convexOffset);
        sub(c.rj, c.rj, convexBody.position);

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

                vec2.copy(c.ni, dist);
                vec2.normalize(c.ni,c.ni);

                // Vector from circle to contact point is the normal times the circle radius
                vec2.scale(c.ri, c.ni, circleRadius);
                add(c.ri, c.ri, circleOffset);
                sub(c.ri, c.ri, circleBody.position);

                sub(c.rj, worldVertex, convexOffset);
                add(c.rj, c.rj, convexOffset);
                sub(c.rj, c.rj, convexBody.position);

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
    if(!pointInConvex(particleOffset,convexShape,convexOffset,convexAngle))
        return 0;

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
        vec2.rotate(worldTangent, worldEdgeUnit, -Math.PI/2);

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

        vec2.scale(c.ni, minEdgeNormal, -1);
        vec2.normalize(c.ni, c.ni);

        // Particle has no extent to the contact point
        vec2.set(c.ri,  0, 0);
        add(c.ri, c.ri, particleOffset);
        sub(c.ri, c.ri, particleBody.position);

        // From convex center to point
        sub(c.rj, closestEdgeProjectedPoint, convexOffset);
        add(c.rj, c.rj, convexOffset);
        sub(c.rj, c.rj, convexBody.position);

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
    if(vec2.squaredLength(dist) > r*r)
        return 0;

    if(justTest) return true;

    var c = this.createContactEquation(bodyA,bodyB,si,sj);
    sub(c.ni, offsetB, offsetA);
    vec2.normalize(c.ni,c.ni);

    vec2.scale( c.ri, c.ni,  radiusA);
    vec2.scale( c.rj, c.ni, -radiusB);

    add(c.ri, c.ri, offsetA);
    sub(c.ri, c.ri, bodyA.position);

    add(c.rj, c.rj, offsetB);
    sub(c.rj, c.rj, bodyB.position);

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

        if(dot(dist,worldNormal) < 0){

            if(justTest) return true;

            // Found vertex
            numReported++;

            var c = this.createContactEquation(planeBody,convexBody,planeShape,convexShape);

            sub(dist, worldVertex, planeOffset);

            vec2.copy(c.ni, worldNormal);

            var d = dot(dist, c.ni);
            vec2.scale(dist, c.ni, d);

            // rj is from convex center to contact
            sub(c.rj, worldVertex, convexBody.position);


            // ri is from plane center to contact
            sub( c.ri, worldVertex, dist);
            sub( c.ri, c.ri, planeBody.position);

            this.contactEquations.push(c);

            // TODO: if we have 2 contacts, we do only need 1 friction equation

            if(this.enableFriction){
                this.frictionEquations.push(this.createFrictionFromContact(c));
            }

            if(numReported >= 2)
                break;
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

    vec2.copy(c.ni, worldNormal);
    vec2.scale( dist, c.ni, d );
    // dist is now the distance vector in the normal direction

    // ri is the particle position projected down onto the plane, from the plane center
    sub( c.ri, particleOffset, dist);
    sub( c.ri, c.ri, planeBody.position);

    // rj is from the body center to the particle center
    sub( c.rj, particleOffset, particleBody.position );

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
    vec2.copy(c.ni, dist);
    vec2.normalize(c.ni,c.ni);

    // Vector from circle to contact point is the normal times the circle radius
    vec2.scale(c.ri, c.ni, circleShape.radius);
    add(c.ri, c.ri, circleOffset);
    sub(c.ri, c.ri, circleBody.position);

    // Vector from particle center to contact point is zero
    sub(c.rj, particleOffset, particleBody.position);

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

    if(d > circleShape.radius) return 0; // No overlap. Abort.

    if(justTest) return true;

    // Create contact
    var contact = this.createContactEquation(planeBody,circleBody,sj,si);

    // ni is the plane world normal
    vec2.copy(contact.ni, worldNormal);

    // rj is the vector from circle center to the contact point
    vec2.scale(contact.rj, contact.ni, -circleShape.radius);
    add(contact.rj, contact.rj, circleOffset);
    sub(contact.rj, contact.rj, circleBody.position);

    // ri is the distance from plane center to contact.
    vec2.scale(temp, contact.ni, d);
    sub(contact.ri, planeToCircle, temp ); // Subtract normal distance vector from the distance vector
    add(contact.ri, contact.ri, planeOffset);
    sub(contact.ri, contact.ri, planeBody.position);

    this.contactEquations.push(contact);

    if(this.enableFriction){
        this.frictionEquations.push( this.createFrictionFromContact(contact) );
    }

    return 1;
};

Narrowphase.convexPrecision = 1e-10;

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
    if(!found) return 0;

    // Make sure the separating axis is directed from shape i to shape j
    sub(dist,xj,xi);
    if(dot(sepAxis,dist) > 0){
        vec2.scale(sepAxis,sepAxis,-1);
    }

    // Find edges with normals closest to the separating axis
    var closestEdge1 = Narrowphase.getClosestEdge(si,ai,sepAxis,true), // Flipped axis
        closestEdge2 = Narrowphase.getClosestEdge(sj,aj,sepAxis);

    if(closestEdge1==-1 || closestEdge2==-1) return 0;

    // Loop over the shapes
    for(var k=0; k<2; k++){

        var closestEdgeA = closestEdge1,
            closestEdgeB = closestEdge2,
            shapeA =  si, shapeB =  sj,
            offsetA = xi, offsetB = xj,
            angleA = ai, angleB = aj,
            bodyA = bi, bodyB = bj;

        if(k==0){
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

                vec2.rotate(worldNormal, worldEdge, -Math.PI/2); // Normal points out of convex 1
                vec2.normalize(worldNormal,worldNormal);

                sub(dist, worldPoint, worldPoint0);

                var d = dot(worldNormal,dist);

                if(d <= precision){
                    insideNumEdges++;
                }
            }

            if(insideNumEdges == 3){

                if(justTest) return true;

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

                vec2.rotate(c.ni, worldEdge, -Math.PI/2); // Normal points out of convex A
                vec2.normalize(c.ni,c.ni);

                sub(dist, worldPoint, worldPoint0); // From edge point to the penetrating point
                var d = dot(c.ni,dist);             // Penetration
                vec2.scale(penetrationVec, c.ni, d);     // Vector penetration

                sub(c.ri, worldPoint, offsetA);
                sub(c.ri, c.ri, penetrationVec);
                add(c.ri, c.ri, offsetA);
                sub(c.ri, c.ri, bodyA.position);

                sub(c.rj, worldPoint, offsetB);
                add(c.rj, c.rj, offsetB);
                sub(c.rj, c.rj, bodyB.position);

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
            vec2.rotate(normal, edge, -Math.PI / 2);
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
            overlap = dist < 0;

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
        N = c.vertices.length,
        halfPi = Math.PI / 2;
    for(var i=0; i!==N; i++){
        // Get the edge
        sub(edge, c.vertices[(i+1)%N], c.vertices[i%N]);

        // Get normal - just rotate 90 degrees since vertices are given in CCW
        vec2.rotate(normal, edge, -halfPi);
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

    var found = false,
        minDist = false;

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

            if(minDist === false || Math.abs(d) < minDist){

                // Store the candidate point, projected to the edge
                vec2.scale(dist,worldNormal,-d);
                vec2.add(minCandidate,candidate,dist);
                vec2.copy(minCandidateNormal,worldNormal);

                found = true;
                minDist = Math.abs(d);

                if(justTest)
                    return true;
            }
        }
    }

    if(found){

        var c = this.createContactEquation(hfBody,circleBody,hfShape,circleShape);

        // Normal is out of the heightfield
        vec2.copy(c.ni, minCandidateNormal);

        // Vector from circle to heightfield
        vec2.scale(c.rj,  c.ni, -radius);
        add(c.rj, c.rj, circlePos);
        sub(c.rj, c.rj, circleBody.position);

        vec2.copy(c.ri, minCandidate);
        //vec2.sub(c.ri, c.ri, hfPos);
        vec2.sub(c.ri, c.ri, hfBody.position);

        this.contactEquations.push(c);

        if(this.enableFriction)
            this.frictionEquations.push( this.createFrictionFromContact(c) );

        return 1;
    }


    // Check all vertices
    if(radius > 0){
        for(var i=idxA; i<=idxB; i++){

            // Get point
            vec2.set(v0, i*w, data[i]);
            vec2.add(v0,v0,hfPos);

            vec2.sub(dist, circlePos, v0);

            if(vec2.squaredLength(dist) < radius*radius){

                if(justTest) return true;

                var c = this.createContactEquation(hfBody,circleBody,hfShape,circleShape);

                // Construct normal - out of heightfield
                vec2.copy(c.ni, dist);
                vec2.normalize(c.ni,c.ni);

                vec2.scale(c.rj, c.ni, -radius);
                add(c.rj, c.rj, circlePos);
                sub(c.rj, c.rj, circleBody.position);

                sub(c.ri, v0, hfPos);
                add(c.ri, c.ri, hfPos);
                sub(c.ri, c.ri, hfBody.position);

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

},{"../equations/ContactEquation":23,"../equations/FrictionEquation":25,"../math/vec2":33,"../objects/Body":34,"../shapes/Circle":38,"../shapes/Rectangle":44,"../shapes/Shape":45,"../utils/Utils":50}],14:[function(require,module,exports){
var Plane = require("../shapes/Plane");
var Broadphase = require("../collision/Broadphase");

module.exports = {
    QuadTree : QuadTree,
    Node : Node,
    BoundsNode : BoundsNode,
};

/**
 * QuadTree data structure. See https://github.com/mikechambers/ExamplesByMesh/tree/master/JavaScript/QuadTree
 * @class QuadTree
 * @constructor
 * @param {Object} An object representing the bounds of the top level of the QuadTree. The object
 * should contain the following properties : x, y, width, height
 * @param {Boolean} pointQuad Whether the QuadTree will contain points (true), or items with bounds
 * (width / height)(false). Default value is false.
 * @param {Number} maxDepth The maximum number of levels that the quadtree will create. Default is 4.
 * @param {Number} maxChildren The maximum number of children that a node can contain before it is split into sub-nodes.
 */
function QuadTree(bounds, pointQuad, maxDepth, maxChildren){
    var node;
    if(pointQuad){
        node = new Node(bounds, 0, maxDepth, maxChildren);
    } else {
        node = new BoundsNode(bounds, 0, maxDepth, maxChildren);
    }

    /**
     * The root node of the QuadTree which covers the entire area being segmented.
     * @property root
     * @type Node
     */
    this.root = node;
}

/**
 * Inserts an item into the QuadTree.
 * @method insert
 * @param {Object|Array} item The item or Array of items to be inserted into the QuadTree. The item should expose x, y
 * properties that represents its position in 2D space.
 */
QuadTree.prototype.insert = function(item){
    if(item instanceof Array){
        var len = item.length;
        for(var i = 0; i < len; i++){
            this.root.insert(item[i]);
        }
    } else {
        this.root.insert(item);
    }
}

/**
 * Clears all nodes and children from the QuadTree
 * @method clear
 */
QuadTree.prototype.clear = function(){
    this.root.clear();
}

/**
 * Retrieves all items / points in the same node as the specified item / point. If the specified item
 * overlaps the bounds of a node, then all children in both nodes will be returned.
 * @method retrieve
 * @param {Object} item An object representing a 2D coordinate point (with x, y properties), or a shape
 * with dimensions (x, y, width, height) properties.
 */
QuadTree.prototype.retrieve = function(item){
    //get a copy of the array of items
    var out = this.root.retrieve(item).slice(0);
    return out;
}

QuadTree.prototype.getCollisionPairs = function(world){

    var result = [];

    // Add all bodies
    this.insert(world.bodies);

    /*
    console.log("bodies",world.bodies.length);
    console.log("maxDepth",this.root.maxDepth,"maxChildren",this.root.maxChildren);
    */

    for(var i=0; i!==world.bodies.length; i++){
        var b = world.bodies[i],
            items = this.retrieve(b);

        //console.log("items",items.length);

        // Check results
        for(var j=0, len=items.length; j!==len; j++){
            var item = items[j];

            if(b === item) continue; // Do not add self

            // Check if they were already added
            var found = false;
            for(var k=0, numAdded=result.length; k<numAdded; k+=2){
                var r1 = result[k],
                    r2 = result[k+1];
                if( (r1==item && r2==b) || (r2==item && r1==b) ){
                    found = true;
                    break;
                }
            }
            if(!found && Broadphase.boundingRadiusCheck(b,item)){
                result.push(b,item);
            }
        }
    }

    //console.log("results",result.length);

    // Clear until next
    this.clear();

    return result;
};

function Node(bounds, depth, maxDepth, maxChildren){
    this.bounds = bounds;
    this.children = [];
    this.nodes = [];

    if(maxChildren){
        this.maxChildren = maxChildren;
    }

    if(maxDepth){
        this.maxDepth = maxDepth;
    }

    if(depth){
        this.depth = depth;
    }
}

//subnodes
Node.prototype.classConstructor = Node;

//children contained directly in the node
Node.prototype.children = null;

//read only
Node.prototype.depth = 0;

Node.prototype.maxChildren = 4;
Node.prototype.maxDepth = 4;

Node.TOP_LEFT = 0;
Node.TOP_RIGHT = 1;
Node.BOTTOM_LEFT = 2;
Node.BOTTOM_RIGHT = 3;

Node.prototype.insert = function(item){
    if(this.nodes.length){
        var index = this.findIndex(item);
        this.nodes[index].insert(item);
        return;
    }

    this.children.push(item);

    var len = this.children.length;
    if(!(this.depth >= this.maxDepth) && len > this.maxChildren) {
        this.subdivide();

        for(var i = 0; i < len; i++){
            this.insert(this.children[i]);
        }

        this.children.length = 0;
    }
}

Node.prototype.retrieve = function(item){
    if(this.nodes.length){
        var index = this.findIndex(item);
        return this.nodes[index].retrieve(item);
    }

    return this.children;
}

Node.prototype.findIndex = function(item){
    var b = this.bounds;
    var left = (item.position[0]-item.boundingRadius > b.x + b.width  / 2) ? false : true;
    var top =  (item.position[1]-item.boundingRadius > b.y + b.height / 2) ? false : true;

    if(item instanceof Plane){
        left = top = false; // Will overlap the left/top boundary since it is infinite
    }

    //top left
    var index = Node.TOP_LEFT;
    if(left){
        if(!top){
            index = Node.BOTTOM_LEFT;
        }
    } else {
        if(top){
            index = Node.TOP_RIGHT;
        } else {
            index = Node.BOTTOM_RIGHT;
        }
    }

    return index;
}


Node.prototype.subdivide = function(){
    var depth = this.depth + 1;

    var bx = this.bounds.x;
    var by = this.bounds.y;

    //floor the values
    var b_w_h = (this.bounds.width / 2);
    var b_h_h = (this.bounds.height / 2);
    var bx_b_w_h = bx + b_w_h;
    var by_b_h_h = by + b_h_h;

    //top left
    this.nodes[Node.TOP_LEFT] = new this.classConstructor({
        x:bx,
        y:by,
        width:b_w_h,
        height:b_h_h
    },
    depth);

    //top right
    this.nodes[Node.TOP_RIGHT] = new this.classConstructor({
        x:bx_b_w_h,
        y:by,
        width:b_w_h,
        height:b_h_h
    },
    depth);

    //bottom left
    this.nodes[Node.BOTTOM_LEFT] = new this.classConstructor({
        x:bx,
        y:by_b_h_h,
        width:b_w_h,
        height:b_h_h
    },
    depth);


    //bottom right
    this.nodes[Node.BOTTOM_RIGHT] = new this.classConstructor({
        x:bx_b_w_h,
        y:by_b_h_h,
        width:b_w_h,
        height:b_h_h
    },
    depth);
}

Node.prototype.clear = function(){
    this.children.length = 0;

    var len = this.nodes.length;
    for(var i = 0; i < len; i++){
        this.nodes[i].clear();
    }

    this.nodes.length = 0;
}


// BoundsQuadTree

function BoundsNode(bounds, depth, maxChildren, maxDepth){
    Node.call(this, bounds, depth, maxChildren, maxDepth);
    this.stuckChildren = [];
}

BoundsNode.prototype = new Node();
BoundsNode.prototype.classConstructor = BoundsNode;
BoundsNode.prototype.stuckChildren = null;

//we use this to collect and conctenate items being retrieved. This way
//we dont have to continuously create new Array instances.
//Note, when returned from QuadTree.retrieve, we then copy the array
BoundsNode.prototype.out = [];

BoundsNode.prototype.insert = function(item){
    if(this.nodes.length){
        var index = this.findIndex(item);
        var node = this.nodes[index];

        /*
        console.log("radius:",item.boundingRadius);
        console.log("item x:",item.position[0] - item.boundingRadius,"x range:",node.bounds.x,node.bounds.x+node.bounds.width);
        console.log("item y:",item.position[1] - item.boundingRadius,"y range:",node.bounds.y,node.bounds.y+node.bounds.height);
        */

        //todo: make _bounds bounds
        if( !(item instanceof Plane) && // Plane is infinite.. Make it a "stuck" child
            item.position[0] - item.boundingRadius >= node.bounds.x &&
            item.position[0] + item.boundingRadius <= node.bounds.x + node.bounds.width &&
            item.position[1] - item.boundingRadius >= node.bounds.y &&
            item.position[1] + item.boundingRadius <= node.bounds.y + node.bounds.height){
            this.nodes[index].insert(item);
        } else {
            this.stuckChildren.push(item);
        }

        return;
    }

    this.children.push(item);

    var len = this.children.length;

    if(this.depth < this.maxDepth && len > this.maxChildren){
        this.subdivide();

        for(var i=0; i<len; i++){
            this.insert(this.children[i]);
        }

        this.children.length = 0;
    }
}

BoundsNode.prototype.getChildren = function(){
    return this.children.concat(this.stuckChildren);
}

BoundsNode.prototype.retrieve = function(item){
    var out = this.out;
    out.length = 0;

    if(this.nodes.length){
        var index = this.findIndex(item);
        out.push.apply(out, this.nodes[index].retrieve(item));
    }

    out.push.apply(out, this.stuckChildren);
    out.push.apply(out, this.children);

    return out;
}

BoundsNode.prototype.clear = function(){

    this.stuckChildren.length = 0;

    //array
    this.children.length = 0;

    var len = this.nodes.length;

    if(!len){
        return;
    }

    for(var i = 0; i < len; i++){
        this.nodes[i].clear();
    }

    //array
    this.nodes.length = 0;

    //we could call the super clear function but for now, im just going to inline it
    //call the hidden super.clear, and make sure its called with this = this instance
    //Object.getPrototypeOf(BoundsNode.prototype).clear.call(this);
}


},{"../collision/Broadphase":10,"../shapes/Plane":43}],15:[function(require,module,exports){
var Circle = require('../shapes/Circle')
,   Plane = require('../shapes/Plane')
,   Shape = require('../shapes/Shape')
,   Particle = require('../shapes/Particle')
,   Utils = require('../utils/Utils')
,   Broadphase = require('../collision/Broadphase')
,   vec2 = require('../math/vec2')

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
     * @property axisListX
     * @type {Array}
     */
    this.axisListX = [];

    /**
     * List of bodies currently in the broadphase.
     * @property axisListY
     * @type {Array}
     */
    this.axisListY = [];

    /**
     * The world to search in.
     * @property world
     * @type {World}
     */
    this.world = null;

    var axisListX = this.axisListX,
        axisListY = this.axisListY;

    this._addBodyHandler = function(e){
        axisListX.push(e.body);
        axisListY.push(e.body);
    };

    this._removeBodyHandler = function(e){
        // Remove from X list
        var idx = axisListX.indexOf(e.body);
        if(idx !== -1) axisListX.splice(idx,1);

        // Remove from Y list
        idx = axisListY.indexOf(e.body);
        if(idx !== -1) axisListY.splice(idx,1);
    }
};
SAPBroadphase.prototype = new Broadphase();

/**
 * Change the world
 * @method setWorld
 * @param  {World} world
 */
SAPBroadphase.prototype.setWorld = function(world){
    // Clear the old axis array
    this.axisListX.length = this.axisListY.length = 0;

    // Add all bodies from the new world
    Utils.appendArray(this.axisListX,world.bodies);
    Utils.appendArray(this.axisListY,world.bodies);

    // Remove old handlers, if any
    world
        .off("addBody",this._addBodyHandler)
        .off("removeBody",this._removeBodyHandler);

    // Add handlers to update the list of bodies.
    world.on("addBody",this._addBodyHandler).on("removeBody",this._removeBodyHandler);

    this.world = world;
};

/**
 * Sorts bodies along the X axis.
 * @method sortAxisListX
 * @param {Array} a
 * @return {Array}
 */
SAPBroadphase.sortAxisListX = function(a){
    for(var i=1,l=a.length;i<l;i++) {
        var v = a[i];
        for(var j=i - 1;j>=0;j--) {
            if(a[j].aabb.lowerBound[0] <= v.aabb.lowerBound[0])
                break;
            a[j+1] = a[j];
        }
        a[j+1] = v;
    }
    return a;
};

/**
 * Sorts bodies along the Y axis.
 * @method sortAxisListY
 * @param {Array} a
 * @return {Array}
 */
SAPBroadphase.sortAxisListY = function(a){
    for(var i=1,l=a.length;i<l;i++) {
        var v = a[i];
        for(var j=i - 1;j>=0;j--) {
            if(a[j].aabb.lowerBound[1] <= v.aabb.lowerBound[1])
                break;
            a[j+1] = a[j];
        }
        a[j+1] = v;
    }
    return a;
};

var preliminaryList = { keys:[] };

/**
 * Get the colliding pairs
 * @method getCollisionPairs
 * @param  {World} world
 * @return {Array}
 */
SAPBroadphase.prototype.getCollisionPairs = function(world){
    var bodiesX = this.axisListX,
        bodiesY = this.axisListY,
        result = this.result,
        axisIndex = this.axisIndex,
        i,j;

    result.length = 0;

    // Update all AABBs if needed
    for(i=0; i!==bodiesX.length; i++){
        var b = bodiesX[i];
        if(b.aabbNeedsUpdate) b.updateAABB();
    }

    // Sort the lists
    SAPBroadphase.sortAxisListX(bodiesX);
    SAPBroadphase.sortAxisListY(bodiesY);

    // Look through the X list
    for(i=0, N=bodiesX.length; i!==N; i++){
        var bi = bodiesX[i];

        for(j=i+1; j<N; j++){
            var bj = bodiesX[j];

            // Bounds overlap?
            if(!SAPBroadphase.checkBounds(bi,bj,0))
                break;

            // add pair to preliminary list
            if(Broadphase.canCollide(bi,bj)){
                var key = bi.id < bj.id ? bi.id+' '+bj.id : bj.id+' '+bi.id;
                preliminaryList[key] = true;
                preliminaryList.keys.push(key);
            }
        }
    }

    // Look through the Y list
    for(i=0, N=bodiesY.length; i!==N; i++){
        var bi = bodiesY[i];

        for(j=i+1; j<N; j++){
            var bj = bodiesY[j];

            if(!SAPBroadphase.checkBounds(bi,bj,1))
                break;

            // If in preliminary list, add to final result
            if(Broadphase.canCollide(bi,bj)){
                var key = bi.id < bj.id ? bi.id+' '+bj.id : bj.id+' '+bi.id;
                if(preliminaryList[key] && Broadphase.boundingRadiusCheck(bi,bj))
                    result.push(bi,bj);
            }
        }
    }

    // Empty prel list
    var keys = preliminaryList.keys;
    for(i=0, N=keys.length; i!==N; i++){
        delete preliminaryList[keys[i]];
    }
    keys.length = 0;

    return result;
};

/**
 * Check if the bounds of two bodies overlap, along the given SAP axis.
 * @static
 * @method checkBounds
 * @param  {Body} bi
 * @param  {Body} bj
 * @param  {Number} axisIndex
 * @return {Boolean}
 */
SAPBroadphase.checkBounds = function(bi,bj,axisIndex){
    /*
    var biPos = bi.position[axisIndex],
        ri = bi.boundingRadius,
        bjPos = bj.position[axisIndex],
        rj = bj.boundingRadius,
        boundA1 = biPos-ri,
        boundA2 = biPos+ri,
        boundB1 = bjPos-rj,
        boundB2 = bjPos+rj;

    return boundB1 < boundA2;
    */
    return bj.aabb.lowerBound[axisIndex] < bi.aabb.upperBound[axisIndex];
};

},{"../collision/Broadphase":10,"../math/vec2":33,"../shapes/Circle":38,"../shapes/Particle":42,"../shapes/Plane":43,"../shapes/Shape":45,"../utils/Utils":50}],16:[function(require,module,exports){
module.exports = Constraint;

/**
 * Base constraint class.
 *
 * @class Constraint
 * @constructor
 * @author schteppe
 * @param {Body} bodyA
 * @param {Body} bodyB
 */
function Constraint(bodyA,bodyB,type){

    this.type = type;

    /**
     * Equations to be solved in this constraint
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

    if(bodyA) bodyA.wakeUp();
    if(bodyB) bodyB.wakeUp();
};

/**
 * To be implemented by subclasses. Should update the internal constraint parameters.
 * @method update
 */
/*Constraint.prototype.update = function(){
    throw new Error("method update() not implmemented in this Constraint subclass!");
};*/

Constraint.DISTANCE = 1;
Constraint.GEAR = 2;
Constraint.LOCK = 3;
Constraint.PRISMATIC = 4;
Constraint.REVOLUTE = 5;

},{}],17:[function(require,module,exports){
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
 * @param {number} dist The distance to keep between the bodies.
 * @param {number} maxForce
 * @extends {Constraint}
 */
function DistanceConstraint(bodyA,bodyB,distance,maxForce){
    Constraint.call(this,bodyA,bodyB,Constraint.DISTANCE);

    /**
     * The distance to keep.
     * @property distance
     * @type {Number}
     */
    this.distance = distance;

    if(typeof(maxForce)==="undefined" )
        maxForce = Number.MAX_VALUE;

    var normal = new Equation(bodyA,bodyB,-maxForce,maxForce); // Just in the normal direction
    this.equations = [ normal ];

    var r = vec2.create();
    normal.computeGq = function(){
        vec2.sub(r, bodyB.position, bodyA.position);
        return vec2.length(r)-distance;
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
DistanceConstraint.prototype.update = function(){
    var normal = this.equations[0],
        bodyA = this.bodyA,
        bodyB = this.bodyB,
        distance = this.distance,
        G = normal.G;

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

},{"../equations/Equation":24,"../math/vec2":33,"./Constraint":16}],18:[function(require,module,exports){
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
 * @param {Number}          maxForce The maximum force that should be applied to constrain the bodies.
 * @extends {Constraint}
 * @todo Ability to specify world points
 */
function GearConstraint(bodyA, bodyB, options){
    Constraint.call(this,bodyA,bodyB,Constraint.GEAR);

    // Equations to be fed to the solver
    var eqs = this.equations = [
        new AngleLockEquation(bodyA,bodyB,options),
    ];

    /**
     * The relative angle
     * @property angle
     * @type {Number}
     */
    this.angle = typeof(options.angle) == "number" ? options.angle : 0;

    /**
     * The gear ratio
     * @property ratio
     * @type {Number}
     */
    this.ratio = typeof(options.ratio) == "number" ? options.ratio : 1;
}
GearConstraint.prototype = new Constraint();

GearConstraint.prototype.update = function(){
    var eq = this.equations[0];
    if(eq.ratio != this.ratio)
        eq.setRatio(this.ratio);
    eq.angle = this.angle;
};

},{"../equations/AngleLockEquation":22,"../equations/Equation":24,"../math/vec2":33,"./Constraint":16}],19:[function(require,module,exports){
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
 * @param {Array}  [options.localOffsetB] The offset of bodyB in bodyA's frame.
 * @param {number} [options.localAngleB]  The angle of bodyB in bodyA's frame.
 * @param {number} [options.maxForce]
 * @extends {Constraint}
 */
function LockConstraint(bodyA,bodyB,options){
    Constraint.call(this,bodyA,bodyB,Constraint.LOCK);
    var maxForce = ( typeof(options.maxForce)=="undefined" ? Number.MAX_VALUE : options.maxForce );
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
        g = vec2.create();
    x.computeGq = function(){
        vec2.rotate(l,localOffsetB,bodyA.angle);
        vec2.sub(g,bodyB.position,bodyA.position);
        vec2.sub(g,g,l);
        return g[0];
    }
    y.computeGq = function(){
        vec2.rotate(l,localOffsetB,bodyA.angle);
        vec2.sub(g,bodyB.position,bodyA.position);
        vec2.sub(g,g,l);
        return g[1];
    };
    var r = vec2.create(),
        t = vec2.create();
    rot.computeGq = function(){
        vec2.rotate(r,localOffsetB,bodyB.angle - localAngleB);
        vec2.scale(r,r,-1);
        vec2.sub(g,bodyA.position,bodyB.position);
        vec2.add(g,g,r);
        vec2.rotate(t,r,-Math.PI/2);
        vec2.normalize(t,t);
        return vec2.dot(g,t);
    };

    this.localOffsetB = localOffsetB;
    this.localAngleB =  localAngleB;
    this.maxForce = maxForce;

    var eqs = this.equations = [ x, y, rot ];
}
LockConstraint.prototype = new Constraint();

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

},{"../equations/Equation":24,"../math/vec2":33,"./Constraint":16}],20:[function(require,module,exports){
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
 * @extends {Constraint}
 * @author schteppe
 * @param {Body}    bodyA
 * @param {Body}    bodyB
 * @param {Object}  options
 * @param {Number}  options.maxForce                Max force to be applied by the constraint
 * @param {Array}   options.localAnchorA            Body A's anchor point, defined in its own local frame.
 * @param {Array}   options.localAnchorB            Body B's anchor point, defined in its own local frame.
 * @param {Array}   options.localAxisA              An axis, defined in body A frame, that body B's anchor point may slide along.
 * @param {Boolean} options.disableRotationalLock   If set to true, bodyB will be free to rotate around its anchor point.
 */
function PrismaticConstraint(bodyA,bodyB,options){
    options = options || {};
    Constraint.call(this,bodyA,bodyB,Constraint.PRISMATIC);

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
    trans.update = function(){
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
    }
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
    this.lowerLimitEnabled = false;

    /**
     * Set to true to enable upper limit.
     * @property upperLimitEnabled
     * @type {Boolean}
     */
    this.upperLimitEnabled = false;

    /**
     * Lower constraint limit. The constraint position is forced to be larger than this value.
     * @property lowerLimit
     * @type {Number}
     */
    this.lowerLimit = 0;

    /**
     * Upper constraint limit. The constraint position is forced to be smaller than this value.
     * @property upperLimit
     * @type {Number}
     */
    this.upperLimit = 1;

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
            bi = this.bi,
            bj = this.bj,
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

    trans.update();

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
        Some offset is added to either equation.ri or .rj to get the correct upper/lower limit.

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
        vec2.scale(upperLimitEquation.ni, worldAxisA, -1);
        vec2.sub(upperLimitEquation.ri, worldAnchorA, bodyA.position);
        vec2.sub(upperLimitEquation.rj, worldAnchorB, bodyB.position);
        vec2.scale(tmp,worldAxisA,upperLimit);
        vec2.add(upperLimitEquation.ri,upperLimitEquation.ri,tmp);
        if(eqs.indexOf(upperLimitEquation)==-1)
            eqs.push(upperLimitEquation);
    } else {
        var idx = eqs.indexOf(upperLimitEquation);
        if(idx != -1) eqs.splice(idx,1);
    }

    if(this.lowerLimitEnabled && relPosition < lowerLimit){
        // Update contact constraint normal, etc
        vec2.scale(lowerLimitEquation.ni, worldAxisA, 1);
        vec2.sub(lowerLimitEquation.ri, worldAnchorA, bodyA.position);
        vec2.sub(lowerLimitEquation.rj, worldAnchorB, bodyB.position);
        vec2.scale(tmp,worldAxisA,lowerLimit);
        vec2.sub(lowerLimitEquation.rj,lowerLimitEquation.rj,tmp);
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

},{"../equations/ContactEquation":23,"../equations/Equation":24,"../equations/RotationalLockEquation":26,"../math/vec2":33,"./Constraint":16}],21:[function(require,module,exports){
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
 * @param {Body}            bodyA
 * @param {Float32Array}    pivotA The point relative to the center of mass of bodyA which bodyA is constrained to.
 * @param {Body}            bodyB Body that will be constrained in a similar way to the same point as bodyA. We will therefore get sort of a link between bodyA and bodyB. If not specified, bodyA will be constrained to a static point.
 * @param {Float32Array}    pivotB See pivotA.
 * @param {Number}          maxForce The maximum force that should be applied to constrain the bodies.
 * @extends {Constraint}
 * @todo Ability to specify world points
 */
function RevoluteConstraint(bodyA, pivotA, bodyB, pivotB, maxForce){
    Constraint.call(this,bodyA,bodyB,Constraint.REVOLUTE);

    maxForce = this.maxForce = typeof(maxForce)!="undefined" ? maxForce : Number.MAX_VALUE;

    this.pivotA = pivotA;
    this.pivotB = pivotB;

    // Equations to be fed to the solver
    var eqs = this.equations = [
        new Equation(bodyA,bodyB,-maxForce,maxForce),
        new Equation(bodyA,bodyB,-maxForce,maxForce),
    ];

    var x =  eqs[0];
    var y = eqs[1];

    x.computeGq = function(){
        vec2.rotate(worldPivotA, pivotA, bodyA.angle);
        vec2.rotate(worldPivotB, pivotB, bodyB.angle);
        vec2.add(g, bodyB.position, worldPivotB);
        vec2.sub(g, g, bodyA.position);
        vec2.sub(g, g, worldPivotA);
        return vec2.dot(g,xAxis);
    };

    y.computeGq = function(){
        vec2.rotate(worldPivotA, pivotA, bodyA.angle);
        vec2.rotate(worldPivotB, pivotB, bodyB.angle);
        vec2.add(g, bodyB.position, worldPivotB);
        vec2.sub(g, g, bodyA.position);
        vec2.sub(g, g, worldPivotA);
        return vec2.dot(g,yAxis);
    };

    y.minForce = x.minForce = -maxForce;
    y.maxForce = x.maxForce =  maxForce;

    this.motorEquation = new RotationalVelocityEquation(bodyA,bodyB);
    this.motorEnabled = false;

    /**
     * The constraint position
     * @property angle
     * @type {Number}
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
    if(!this.motorEnabled) return;
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

},{"../equations/Equation":24,"../equations/RotationalLockEquation":26,"../equations/RotationalVelocityEquation":27,"../math/vec2":33,"./Constraint":16}],22:[function(require,module,exports){
var Equation = require("./Equation"),
    vec2 = require('../math/vec2');

module.exports = AngleLockEquation;

/**
 * Locks the relative angle between two bodies. The constraint tries to keep the dot product between two vectors, local in each body, to zero. The local angle in body i is a parameter.
 *
 * @class AngleLockEquation
 * @constructor
 * @extends Equation
 * @param {Body} bi
 * @param {Body} bj
 * @param {Object} options
 * @param {Number} options.angle Angle to add to the local vector in body i.
 * @param {Number} options.ratio Gear ratio
 */
function AngleLockEquation(bi,bj,options){
    options = options || {};
    Equation.call(this,bi,bj,-Number.MAX_VALUE,Number.MAX_VALUE);
    this.angle = options.angle || 0;
    this.ratio = typeof(options.ratio)=="number" ? options.ratio : 1;
    this.setRatio(this.ratio);
};
AngleLockEquation.prototype = new Equation();
AngleLockEquation.prototype.constructor = AngleLockEquation;

AngleLockEquation.prototype.computeGq = function(){
    return this.ratio*this.bi.angle - this.bj.angle + this.angle;
};

AngleLockEquation.prototype.setRatio = function(ratio){
    var G = this.G;
    G[2] =  ratio;
    G[5] = -1;
    this.ratio = ratio;
};

},{"../math/vec2":33,"./Equation":24}],23:[function(require,module,exports){
var Equation = require("./Equation"),
    vec2 = require('../math/vec2'),
    mat2 = require('../math/mat2');

module.exports = ContactEquation;

/**
 * Non-penetration constraint equation. Tries to make the ri and rj vectors the same point.
 *
 * @class ContactEquation
 * @constructor
 * @extends Equation
 * @param {Body} bi
 * @param {Body} bj
 */
function ContactEquation(bi,bj){
    Equation.call(this,bi,bj,0,Number.MAX_VALUE);

    /**
     * Vector from body i center of mass to the contact point.
     * @property ri
     * @type {Array}
     */
    this.ri = vec2.create();
    this.penetrationVec = vec2.create();

    /**
     * Vector from body j center of mass to the contact point.
     * @property rj
     * @type {Array}
     */
    this.rj = vec2.create();

    /**
     * The normal vector, pointing out of body i
     * @property ni
     * @type {Array}
     */
    this.ni = vec2.create();

    /**
     * The restitution to use. 0=no bounciness, 1=max bounciness.
     * @property restitution
     * @type {Number}
     */
    this.restitution = 0;

    /**
     * Set to true if this is the first impact between the bodies (not persistant contact).
     * @property firstImpact
     * @type {Boolean}
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
};
ContactEquation.prototype = new Equation();
ContactEquation.prototype.constructor = ContactEquation;
ContactEquation.prototype.computeB = function(a,b,h){
    var bi = this.bi,
        bj = this.bj,
        ri = this.ri,
        rj = this.rj,
        xi = bi.position,
        xj = bj.position;

    var penetrationVec = this.penetrationVec,
        n = this.ni,
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

},{"../math/mat2":31,"../math/vec2":33,"./Equation":24}],24:[function(require,module,exports){
module.exports = Equation;

var vec2 = require('../math/vec2'),
    mat2 = require('../math/mat2'),
    Utils = require('../utils/Utils');

/**
 * Base class for constraint equations.
 * @class Equation
 * @constructor
 * @param {Body} bi First body participating in the equation
 * @param {Body} bj Second body participating in the equation
 * @param {number} minForce Minimum force to apply. Default: -1e6
 * @param {number} maxForce Maximum force to apply. Default: 1e6
 */
function Equation(bi,bj,minForce,maxForce){

    /**
     * Minimum force to apply when solving
     * @property minForce
     * @type {Number}
     */
    this.minForce = typeof(minForce)=="undefined" ? -1e6 : minForce;

    /**
     * Max force to apply when solving
     * @property maxForce
     * @type {Number}
     */
    this.maxForce = typeof(maxForce)=="undefined" ? 1e6 : maxForce;

    /**
     * First body participating in the constraint
     * @property bi
     * @type {Body}
     */
    this.bi = bi;

    /**
     * Second body participating in the constraint
     * @property bj
     * @type {Body}
     */
    this.bj = bj;

    /**
     * The stiffness of this equation. Typically chosen to a large number (~1e7), but can be chosen somewhat freely to get a stable simulation.
     * @property stiffness
     * @type {Number}
     */
    this.stiffness = 1e6;

    /**
     * The number of time steps needed to stabilize the constraint equation. Typically between 3 and 5 time steps.
     * @property relaxation
     * @type {Number}
     */
    this.relaxation = 4;

    /**
     * The Jacobian entry of this equation. 6 numbers, 3 per body (x,y,angle).
     * @property G
     * @type {Array}
     */
    this.G = new Utils.ARRAY_TYPE(6);
    for(var i=0; i<6; i++) this.G[i]=0;

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
    this.eps = 0;
    this.h = 0;
    this.updateSpookParams(1/60);

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
};
Equation.prototype.constructor = Equation;

/**
 * Update SPOOK parameters .a, .b and .eps according to the given time step. See equations 9, 10 and 11 in the <a href="http://www8.cs.umu.se/kurser/5DV058/VT09/lectures/spooknotes.pdf">SPOOK notes</a>.
 * @method updateSpookParams
 * @param  {number} timeStep
 */
Equation.prototype.updateSpookParams = function(timeStep){
    var k = this.stiffness,
        d = this.relaxation,
        h = timeStep;
    this.a = 4.0 / (h * (1 + 4 * d));
    this.b = (4.0 * d) / (1 + 4 * d);
    this.eps = 4.0 / (h * h * k * (1 + 4 * d));
    this.h = timeStep;
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
        bi = this.bi,
        bj = this.bj,
        xi = bi.position,
        xj = bj.position,
        ai = bi.angle,
        aj = bj.angle;

    // Transform to the given body frames
    /*
    vec2.rotate(qi,this.xi,ai);
    vec2.rotate(qj,this.xj,aj);
    vec2.add(qi,qi,xi);
    vec2.add(qj,qj,xj);
    */

    return Gmult(G, qi, ai, qj, aj) + this.offset;
};

var tmp_i = vec2.create(),
    tmp_j = vec2.create();
Equation.prototype.transformedGmult = function(G,vi,wi,vj,wj){
    // Transform velocity to the given body frames
    // v_p = v + w x r
    /*
    vec2.rotate(tmp_i,this.xi,Math.PI / 2 + this.bi.angle); // Get r, and rotate 90 degrees. We get the "x r" part
    vec2.rotate(tmp_j,this.xj,Math.PI / 2 + this.bj.angle);
    vec2.scale(tmp_i,tmp_i,wi); // Temp vectors are now (w x r)
    vec2.scale(tmp_j,tmp_j,wj);
    vec2.add(tmp_i,tmp_i,vi);
    vec2.add(tmp_j,tmp_j,vj);
    */

    // Note: angular velocity is same
    return Gmult(G,vi,wi,vj,wj);
};

/**
 * Computes G*W, where W are the body velocities
 * @method computeGW
 * @return {Number}
 */
Equation.prototype.computeGW = function(){
    var G = this.G,
        bi = this.bi,
        bj = this.bj,
        vi = bi.velocity,
        vj = bj.velocity,
        wi = bi.angularVelocity,
        wj = bj.angularVelocity;
    return this.transformedGmult(G,vi,wi,vj,wj) + this.relativeVelocity;
};

/**
 * Computes G*Wlambda, where W are the body velocities
 * @method computeGWlambda
 * @return {Number}
 */
Equation.prototype.computeGWlambda = function(){
    var G = this.G,
        bi = this.bi,
        bj = this.bj,
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
    var bi = this.bi,
        bj = this.bj,
        fi = bi.force,
        ti = bi.angularForce,
        fj = bj.force,
        tj = bj.angularForce,
        invMassi = bi.invMass,
        invMassj = bj.invMass,
        invIi = bi.invInertia,
        invIj = bj.invInertia,
        G = this.G;

    vec2.scale(iMfi, fi,invMassi);
    vec2.scale(iMfj, fj,invMassj);

    return this.transformedGmult(G,iMfi,ti*invIi,iMfj,tj*invIj);
};

/**
 * Computes G*inv(M)*G'
 * @method computeGiMGt
 * @return {Number}
 */
Equation.prototype.computeGiMGt = function(){
    var bi = this.bi,
        bj = this.bj,
        invMassi = bi.invMass,
        invMassj = bj.invMass,
        invIi = bi.invInertia,
        invIj = bj.invInertia,
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
var tmpMat1 = mat2.create(),
    tmpMat2 = mat2.create();

/**
 * Add constraint velocity to the bodies.
 * @method addToWlambda
 * @param {Number} deltalambda
 */
Equation.prototype.addToWlambda = function(deltalambda){
    var bi = this.bi,
        bj = this.bj,
        temp = addToWlambda_temp,
        imMat1 = tmpMat1,
        imMat2 = tmpMat2,
        Gi = addToWlambda_Gi,
        Gj = addToWlambda_Gj,
        ri = addToWlambda_ri,
        rj = addToWlambda_rj,
        Mdiag = addToWlambda_Mdiag,
        G = this.G;

    Gi[0] = G[0];
    Gi[1] = G[1];
    Gj[0] = G[3];
    Gj[1] = G[4];

    /*
    mat2.identity(imMat1);
    mat2.identity(imMat2);
    imMat1[0] = imMat1[3] = bi.invMass;
    imMat2[0] = imMat2[3] = bj.invMass;
    */


    /*
    vec2.rotate(ri,this.xi,bi.angle);
    vec2.rotate(rj,this.xj,bj.angle);
    */

    // Add to linear velocity
    // v_lambda += inv(M) * delta_lamba * G
    //vec2.set(Mdiag,bi.invMass,bi.invMass);
    //vec2.scale(temp,vec2.transformMat2(temp,Gi,imMat1),deltalambda);
    vec2.scale(temp,Gi,bi.invMass*deltalambda);
    vec2.add( bi.vlambda, bi.vlambda, temp);
    // This impulse is in the offset frame
    // Also add contribution to angular
    //bi.wlambda -= vec2.crossLength(temp,ri);

    //vec2.set(Mdiag,bj.invMass,bj.invMass);
    //vec2.scale(temp,vec2.transformMat2(temp,Gj,imMat2),deltalambda);
    vec2.scale(temp,Gj,bj.invMass*deltalambda);
    vec2.add( bj.vlambda, bj.vlambda, temp);
    //bj.wlambda -= vec2.crossLength(temp,rj);

    // Add to angular velocity
    bi.wlambda += bi.invInertia * G[2] * deltalambda;
    bj.wlambda += bj.invInertia * G[5] * deltalambda;
};

function massMatVecMultiply(out, m, v) {
    out[0] = v[0] * m;
    out[1] = v[1] * m;
    return out;
}

/**
 * Compute the denominator part of the SPOOK equation: C = G*inv(M)*G' + eps
 * @method computeInvC
 * @param  {Number} eps
 * @return {Number}
 */
Equation.prototype.computeInvC = function(eps){
    return 1.0 / (this.computeGiMGt() + eps);
};

},{"../math/mat2":31,"../math/vec2":33,"../utils/Utils":50}],25:[function(require,module,exports){
var mat2 = require('../math/mat2')
,   vec2 = require('../math/vec2')
,   Equation = require('./Equation')
,   Utils = require('../utils/Utils')

module.exports = FrictionEquation;

/**
 * Constrains the slipping in a contact along a tangent
 *
 * @class FrictionEquation
 * @constructor
 * @param {Body} bi
 * @param {Body} bj
 * @param {Number} slipForce
 * @extends {Equation}
 */
function FrictionEquation(bi,bj,slipForce){
    Equation.call(this,bi,bj,-slipForce,slipForce);

    /**
     * Relative vector from center of body i to the contact point, in world coords.
     * @property ri
     * @type {Float32Array}
     */
    this.ri = vec2.create();

    /**
     * Relative vector from center of body j to the contact point, in world coords.
     * @property rj
     * @type {Float32Array}
     */
    this.rj = vec2.create();

    /**
     * Tangent vector that the friction force will act along, in world coords.
     * @property t
     * @type {Float32Array}
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
};
FrictionEquation.prototype = new Equation();
FrictionEquation.prototype.constructor = FrictionEquation;

/**
 * Set the slipping condition for the constraint. The friction force cannot be
 * larger than this value.
 * @method setSlipForce
 * @param  {Number} slipForce
 * @deprecated Use .frictionCoefficient instead
 */
FrictionEquation.prototype.setSlipForce = function(slipForce){
    this.maxForce = slipForce;
    this.minForce = -slipForce;
};

FrictionEquation.prototype.computeB = function(a,b,h){
    var bi = this.bi,
        bj = this.bj,
        ri = this.ri,
        rj = this.rj,
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

},{"../math/mat2":31,"../math/vec2":33,"../utils/Utils":50,"./Equation":24}],26:[function(require,module,exports){
var Equation = require("./Equation"),
    vec2 = require('../math/vec2');

module.exports = RotationalLockEquation;

/**
 * Locks the relative angle between two bodies. The constraint tries to keep the dot product between two vectors, local in each body, to zero. The local angle in body i is a parameter.
 *
 * @class RotationalLockEquation
 * @constructor
 * @extends Equation
 * @param {Body} bi
 * @param {Body} bj
 * @param {Object} options
 * @param {Number} options.angle Angle to add to the local vector in body i.
 */
function RotationalLockEquation(bi,bj,options){
    options = options || {};
    Equation.call(this,bi,bj,-Number.MAX_VALUE,Number.MAX_VALUE);
    this.angle = options.angle || 0;

    var G = this.G;
    G[2] =  1;
    G[5] = -1;
};
RotationalLockEquation.prototype = new Equation();
RotationalLockEquation.prototype.constructor = RotationalLockEquation;

var worldVectorA = vec2.create(),
    worldVectorB = vec2.create(),
    xAxis = vec2.fromValues(1,0),
    yAxis = vec2.fromValues(0,1);
RotationalLockEquation.prototype.computeGq = function(){
    vec2.rotate(worldVectorA,xAxis,this.bi.angle+this.angle);
    vec2.rotate(worldVectorB,yAxis,this.bj.angle);
    return vec2.dot(worldVectorA,worldVectorB);
};

},{"../math/vec2":33,"./Equation":24}],27:[function(require,module,exports){
var Equation = require("./Equation"),
    vec2 = require('../math/vec2');

module.exports = RotationalVelocityEquation;

/**
 * Syncs rotational velocity of two bodies, or sets a relative velocity (motor).
 *
 * @class RotationalVelocityEquation
 * @constructor
 * @extends Equation
 * @param {Body} bi
 * @param {Body} bj
 */
function RotationalVelocityEquation(bi,bj){
    Equation.call(this,bi,bj,-Number.MAX_VALUE,Number.MAX_VALUE);
    this.relativeVelocity = 1;
    this.ratio = 1;
};
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

},{"../math/vec2":33,"./Equation":24}],28:[function(require,module,exports){
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
        if ( listeners[ type ] !== undefined && listeners[ type ].indexOf( listener ) !== - 1 ) {
            return true;
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

},{}],29:[function(require,module,exports){
var Material = require('./Material');

module.exports = ContactMaterial;

/**
 * Defines what happens when two materials meet, such as what friction coefficient to use. You can also set other things such as restitution, surface velocity and constraint parameters.
 * @class ContactMaterial
 * @constructor
 * @param {Material} materialA
 * @param {Material} materialB
 * @param {Object}   [options]
 * @param {Number}   options.friction           Friction coefficient.
 * @param {Number}   options.restitution        Restitution coefficient aka "bounciness".
 * @param {Number}   options.stiffness          ContactEquation stiffness.
 * @param {Number}   options.relaxation         ContactEquation relaxation.
 * @param {Number}   options.frictionStiffness  FrictionEquation stiffness.
 * @param {Number}   options.frictionRelaxation FrictionEquation relaxation.
 * @param {Number}   options.surfaceVelocity    Surface velocity.
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
    this.stiffness =            typeof(options.stiffness)           !== "undefined" ?   Number(options.stiffness)   : 1e7;

    /**
     * Relaxation of the resulting ContactEquation that this ContactMaterial generate
     * @property relaxation
     * @type {Number}
     */
    this.relaxation =           typeof(options.relaxation)          !== "undefined" ?   Number(options.relaxation)  : 3;

    /**
     * Stiffness of the resulting FrictionEquation that this ContactMaterial generate
     * @property frictionStiffness
     * @type {Number}
     */
    this.frictionStiffness =    typeof(options.frictionStiffness)   !== "undefined" ?   Number(options.frictionStiffness)   : 1e7;

    /**
     * Relaxation of the resulting FrictionEquation that this ContactMaterial generate
     * @property frictionRelaxation
     * @type {Number}
     */
    this.frictionRelaxation =   typeof(options.frictionRelaxation)  !== "undefined" ?   Number(options.frictionRelaxation)  : 3;

    /**
     * Will add surface velocity to this material. If bodyA rests on top if bodyB, and the surface velocity is positive, bodyA will slide to the right.
     * @property {Number} surfaceVelocity
     */
    this.surfaceVelocity = typeof(options.surfaceVelocity)    !== "undefined" ?   Number(options.surfaceVelocity)    : 0
};

ContactMaterial.idCounter = 0;

},{"./Material":30}],30:[function(require,module,exports){
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

},{}],31:[function(require,module,exports){
/**
 * The mat2 object from glMatrix, extended with the functions documented here. See http://glmatrix.net for full doc.
 * @class mat2
 */

// Only import mat2 from gl-matrix and skip the rest
var mat2 = require('../../node_modules/gl-matrix/src/gl-matrix/mat2').mat2;

// Export everything
module.exports = mat2;

},{"../../node_modules/gl-matrix/src/gl-matrix/mat2":1}],32:[function(require,module,exports){

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

},{}],33:[function(require,module,exports){
/**
 * The vec2 object from glMatrix, extended with the functions documented here. See http://glmatrix.net for full doc.
 * @class vec2
 */

// Only import vec2 from gl-matrix and skip the rest
var vec2 = require('../../node_modules/gl-matrix/src/gl-matrix/vec2').vec2;

// Now add some extensions

/**
 * Get the vector x component
 * @method getX
 * @static
 * @param  {Float32Array} a
 * @return {Number}
 */
vec2.getX = function(a){
    return a[0];
};

/**
 * Get the vector y component
 * @method getY
 * @static
 * @param  {Float32Array} a
 * @return {Number}
 */
vec2.getY = function(a){
    return a[1];
};

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

vec2.toLocalFrame = function(out, worldPoint, framePosition, frameAngle){
    vec2.copy(out, worldPoint);
    vec2.sub(out, out, framePosition);
    vec2.rotate(out, out, -frameAngle);
};

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

},{"../../node_modules/gl-matrix/src/gl-matrix/vec2":2}],34:[function(require,module,exports){
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
 * @extends {EventEmitter}
 * @param {Object}              [options]
 * @param {Number}              [options.mass=0]    A number >= 0. If zero, the .motionState will be set to Body.STATIC.
 * @param {Float32Array|Array}  [options.position]
 * @param {Float32Array|Array}  [options.velocity]
 * @param {Number}              [options.angle=0]
 * @param {Number}              [options.angularVelocity=0]
 * @param {Float32Array|Array}  [options.force]
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
     * array of Float32Array.
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
    if(options.position) vec2.copy(this.position, options.position);

    /**
     * The interpolated position of the body.
     * @property interpolatedPosition
     * @type {Array}
     */
    this.interpolatedPosition = vec2.fromValues(0,0);

    /**
     * The velocity of the body
     * @property velocity
     * @type {Float32Array}
     */
    this.velocity = vec2.fromValues(0,0);
    if(options.velocity) vec2.copy(this.velocity, options.velocity);

    /**
     * Constraint velocity that was added to the body during the last step.
     * @property vlambda
     * @type {Float32Array}
     */
    this.vlambda = vec2.fromValues(0,0);

    /**
     * Angular constraint velocity that was added to the body during last step.
     * @property wlambda
     * @type {Float32Array}
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
     * The angular velocity of the body
     * @property angularVelocity
     * @type {number}
     */
    this.angularVelocity = options.angularVelocity || 0;

    /**
     * The force acting on the body
     * @property force
     * @type {Float32Array}
     */
    this.force = vec2.create();
    if(options.force) vec2.copy(this.force, options.force);

    /**
     * The angular force acting on the body
     * @property angularForce
     * @type {number}
     */
    this.angularForce = options.angularForce || 0;

    /**
     * The linear damping acting on the body in the velocity direction
     * @property damping
     * @type {Number}
     */
    this.damping = typeof(options.damping)=="number" ? options.damping : 0.1;

    /**
     * The angular force acting on the body
     * @property angularDamping
     * @type {Number}
     */
    this.angularDamping = typeof(options.angularDamping)=="number" ? options.angularDamping : 0.1;

    /**
     * The type of motion this body has. Should be one of: Body.STATIC (the body
     * does not move), Body.DYNAMIC (body can move and respond to collisions)
     * and Body.KINEMATIC (only moves according to its .velocity).
     *
     * @property motionState
     * @type {number}
     *
     * @example
     *     // This body will move and interact with other bodies
     *     var dynamicBody = new Body();
     *     dynamicBody.motionState = Body.DYNAMIC;
     *
     * @example
     *     // This body will not move at all
     *     var staticBody = new Body();
     *     staticBody.motionState = Body.STATIC;
     *
     * @example
     *     // This body will only move if you change its velocity
     *     var kinematicBody = new Body();
     *     kinematicBody.motionState = Body.KINEMATIC;
     */
    this.motionState = this.mass == 0 ? Body.STATIC : Body.DYNAMIC;

    /**
     * Bounding circle radius
     * @property boundingRadius
     * @type {Number}
     */
    this.boundingRadius = 0;

    /**
     * Bounding box of this body
     * @property aabb
     * @type {AABB}
     */
    this.aabb = new AABB();

    /**
     * Indicates if the AABB needs update. Update it with .updateAABB()
     * @property aabbNeedsUpdate
     * @type {Boolean}
     */
    this.aabbNeedsUpdate = true;

    /**
     * If true, the body will automatically fall to sleep.
     * @property allowSleep
     * @type {Boolean}
     */
    this.allowSleep = false;

    /**
     * One of Body.AWAKE, Body.SLEEPY, Body.SLEEPING
     * @property sleepState
     * @type {Number}
     */
    this.sleepState = Body.AWAKE;

    /**
     * If the speed (the norm of the velocity) is smaller than this value, the body is considered sleepy.
     * @property sleepSpeedLimit
     * @type {Number}
     */
    this.sleepSpeedLimit = 0.1;

    /**
     * If the body has been sleepy for this sleepTimeLimit seconds, it is considered sleeping.
     * @property sleepTimeLimit
     * @type {Number}
     */
    this.sleepTimeLimit = 1;

    /**
     * Gravity scaling factor. If you want the body to ignore gravity, set this to zero. If you want to reverse gravity, set it to -1.
     * @property {Number} gravityScale
     */
    this.gravityScale = 1;

    this.timeLastSleepy = 0;

    this.concavePath = null;

    this.lastDampingScale = 1;
    this.lastAngularDampingScale = 1;
    this.lastDampingTimeStep = -1;

    this.updateMassProperties();
};
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
 * @method setDensity
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
        if(offset + r > radius)
            radius = offset + r;
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
 * @param  {Float32Array|Array} [offset] Local body offset of the shape.
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

    if(idx != -1){
        this.shapes.splice(idx,1);
        this.shapeOffsets.splice(idx,1);
        this.shapeAngles.splice(idx,1);
        this.aabbNeedsUpdate = true;
        return true;
    } else
        return false;

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
    if(this.motionState == Body.STATIC || this.motionState == Body.KINEMATIC){

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
 * @param {Float32Array} force The force to add.
 * @param {Float32Array} worldPoint A world point to apply the force on.
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
 * @param  {Float32Array|Array} out          The vector to store the result in
 * @param  {Float32Array|Array} worldPoint   The input world vector
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
    if(this.motionState == Body.DYNAMIC){ // Only for dynamic bodies

        // Since Math.pow generates garbage we check if we can reuse the scaling coefficient from last step
        if(dt != this.lastDampingTimeStep){
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
 * @method wakeUp
 * @brief Wake the body up.
 */
Body.prototype.wakeUp = function(){
    var s = this.sleepState;
    this.sleepState = Body.AWAKE;
    if(s !== Body.AWAKE){
        this.emit(Body.wakeUpEvent);
    }
};

/**
 * @method sleep
 * @brief Force body sleep
 */
Body.prototype.sleep = function(){
    this.sleepState = Body.SLEEPING;
    this.emit(Body.sleepEvent);
};

/**
 * @method sleepTick
 * @param float time The world time in seconds
 * @brief Called every timestep to update internal sleep timer and change sleep state if needed.
 */
Body.prototype.sleepTick = function(time){
    if(!this.allowSleep)
        return;

    var sleepState = this.sleepState,
        speedSquared = vec2.squaredLength(this.velocity) + Math.pow(this.angularVelocity,2),
        speedLimitSquared = Math.pow(this.sleepSpeedLimit,2);
    if(sleepState===Body.AWAKE && speedSquared < speedLimitSquared){
        this.sleepState = Body.SLEEPY; // Sleepy
        this.timeLastSleepy = time;
        this.emit(Body.sleepyEvent);
    } else if(sleepState===Body.SLEEPY && speedSquared > speedLimitSquared){
        this.wakeUp(); // Wake up
    } else if(sleepState===Body.SLEEPY && (time - this.timeLastSleepy ) > this.sleepTimeLimit){
        this.sleep();
    }
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


},{"../collision/AABB":9,"../events/EventEmitter":28,"../math/vec2":33,"../shapes/Convex":39,"poly-decomp":7}],35:[function(require,module,exports){
var vec2 = require('../math/vec2');

module.exports = Spring;

/**
 * A spring, connecting two bodies.
 *
 * @class Spring
 * @constructor
 * @param {Body} bodyA
 * @param {Body} bodyB
 * @param {Object} [options]
 * @param {number} options.restLength   A number > 0. Default: 1
 * @param {number} options.stiffness    A number >= 0. Default: 100
 * @param {number} options.damping      A number >= 0. Default: 1
 * @param {Array}  options.worldAnchorA Where to hook the spring to body A, in world coordinates.
 * @param {Array}  options.worldAnchorB
 * @param {Array}  options.localAnchorA Where to hook the spring to body A, in local body coordinates.
 * @param {Array}  options.localAnchorB
 */
function Spring(bodyA,bodyB,options){
    options = options || {};

    /**
     * Rest length of the spring.
     * @property restLength
     * @type {number}
     */
    this.restLength = typeof(options.restLength)=="number" ? options.restLength : 1;

    /**
     * Stiffness of the spring.
     * @property stiffness
     * @type {number}
     */
    this.stiffness = options.stiffness || 100;

    /**
     * Damping of the spring.
     * @property damping
     * @type {number}
     */
    this.damping = options.damping || 1;

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
    this.localAnchorA = vec2.fromValues(0,0);

    /**
     * Anchor for bodyB in local bodyB coordinates.
     * @property localAnchorB
     * @type {Array}
     */
    this.localAnchorB = vec2.fromValues(0,0);

    if(options.localAnchorA) vec2.copy(this.localAnchorA, options.localAnchorA);
    if(options.localAnchorB) vec2.copy(this.localAnchorB, options.localAnchorB);
    if(options.worldAnchorA) this.setWorldAnchorA(options.worldAnchorA);
    if(options.worldAnchorB) this.setWorldAnchorB(options.worldAnchorB);
};

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

},{"../math/vec2":33}],36:[function(require,module,exports){
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
    Island :                        require('./solver/IslandSolver'),
    IslandSolver :                  require('./solver/IslandSolver'),
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
    QuadTree :                      require('./collision/QuadTree').QuadTree,
    vec2 :                          require('./math/vec2'),
    version :                       require('../package.json').version,
};

},{"../package.json":8,"./collision/AABB":9,"./collision/Broadphase":10,"./collision/GridBroadphase":11,"./collision/NaiveBroadphase":12,"./collision/Narrowphase":13,"./collision/QuadTree":14,"./collision/SAPBroadphase":15,"./constraints/Constraint":16,"./constraints/DistanceConstraint":17,"./constraints/GearConstraint":18,"./constraints/LockConstraint":19,"./constraints/PrismaticConstraint":20,"./constraints/RevoluteConstraint":21,"./equations/AngleLockEquation":22,"./equations/ContactEquation":23,"./equations/Equation":24,"./equations/FrictionEquation":25,"./equations/RotationalVelocityEquation":27,"./events/EventEmitter":28,"./material/ContactMaterial":29,"./material/Material":30,"./math/vec2":33,"./objects/Body":34,"./objects/Spring":35,"./shapes/Capsule":37,"./shapes/Circle":38,"./shapes/Convex":39,"./shapes/Heightfield":40,"./shapes/Line":41,"./shapes/Particle":42,"./shapes/Plane":43,"./shapes/Rectangle":44,"./shapes/Shape":45,"./solver/GSSolver":46,"./solver/IslandSolver":48,"./solver/Solver":49,"./utils/Utils":50,"./world/World":51}],37:[function(require,module,exports){
var Shape = require('./Shape')
,   vec2 = require('../math/vec2')

module.exports = Capsule;

/**
 * Capsule shape class.
 * @class Capsule
 * @constructor
 * @extends {Shape}
 * @param {Number} length The distance between the end points
 * @param {Number} radius Radius of the capsule
 */
function Capsule(length,radius){

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
};
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

},{"../math/vec2":33,"./Shape":45}],38:[function(require,module,exports){
var Shape = require('./Shape')
,    vec2 = require('../math/vec2')

module.exports = Circle;

/**
 * Circle shape class.
 * @class Circle
 * @extends {Shape}
 * @constructor
 * @param {number} radius The radius of this circle
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

Circle.prototype.updateBoundingRadius = function(){
    this.boundingRadius = this.radius;
};

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

},{"../math/vec2":33,"./Shape":45}],39:[function(require,module,exports){
var Shape = require('./Shape')
,   vec2 = require('../math/vec2')
,   polyk = require('../math/polyk')
,   decomp = require('poly-decomp')

module.exports = Convex;

/**
 * Convex shape class.
 * @class Convex
 * @constructor
 * @extends {Shape}
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

},{"../math/polyk":32,"../math/vec2":33,"./Shape":45,"poly-decomp":7}],40:[function(require,module,exports){
var Shape = require('./Shape')
,    vec2 = require('../math/vec2')

module.exports = Heightfield;

/**
 * Heightfield shape class. Height data is given as an array. These data points are spread out evenly with a distance "elementWidth".
 * @class Heightfield
 * @extends {Shape}
 * @constructor
 */
function Heightfield(data,maxValue,elementWidth){
    this.data = data;
    this.maxValue = maxValue;
    this.elementWidth = elementWidth;
    Shape.call(this,Shape.HEIGHTFIELD);
};
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
    out.lowerBound[1] = position[1];
};

},{"../math/vec2":33,"./Shape":45}],41:[function(require,module,exports){
var Shape = require('./Shape')
,   vec2 = require('../math/vec2')

module.exports = Line;

/**
 * Line shape class. The line shape is along the x direction, and stretches from [-length/2, 0] to [length/2,0].
 * @class Line
 * @param {Number} length The total length of the line
 * @extends {Shape}
 * @constructor
 */
function Line(length){

    /**
     * Length of this line
     * @property length
     * @type {Number}
     */
    this.length = length;

    Shape.call(this,Shape.LINE);
};
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


},{"../math/vec2":33,"./Shape":45}],42:[function(require,module,exports){
var Shape = require('./Shape')
,   vec2 = require('../math/vec2')

module.exports = Particle;

/**
 * Particle shape class.
 * @class Particle
 * @constructor
 * @extends {Shape}
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

},{"../math/vec2":33,"./Shape":45}],43:[function(require,module,exports){
var Shape =  require('./Shape')
,    vec2 =  require('../math/vec2')
,    Utils = require('../utils/Utils')

module.exports = Plane;

/**
 * Plane shape class. The plane is facing in the Y direction.
 * @class Plane
 * @extends {Shape}
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


},{"../math/vec2":33,"../utils/Utils":50,"./Shape":45}],44:[function(require,module,exports){
var vec2 = require('../math/vec2')
,   Shape = require('./Shape')
,   Convex = require('./Convex')

module.exports = Rectangle;

/**
 * Rectangle shape class.
 * @class Rectangle
 * @constructor
 * @param {Number} w Width
 * @param {Number} h Height
 * @extends {Convex}
 */
function Rectangle(w,h){
    var verts = [   vec2.fromValues(-w/2, -h/2),
                    vec2.fromValues( w/2, -h/2),
                    vec2.fromValues( w/2,  h/2),
                    vec2.fromValues(-w/2,  h/2)];

    /**
     * Total width of the rectangle
     * @property width
     * @type {Number}
     */
    this.width = w;

    /**
     * Total height of the rectangle
     * @property height
     * @type {Number}
     */
    this.height = h;

    Convex.call(this,verts);

    this.type = Shape.RECTANGLE;
};
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


},{"../math/vec2":33,"./Convex":39,"./Shape":45}],45:[function(require,module,exports){
module.exports = Shape;

/**
 * Base class for shapes.
 * @class Shape
 * @constructor
 */
function Shape(type){
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

},{}],46:[function(require,module,exports){
var vec2 = require('../math/vec2')
,   Solver = require('./Solver')
,   Utils = require('../utils/Utils')
,   FrictionEquation = require('../equations/FrictionEquation')

module.exports = GSSolver;

/**
 * Iterative Gauss-Seidel constraint equation solver.
 *
 * @class GSSolver
 * @constructor
 * @extends Solver
 * @param {Object} [options]
 * @param {Number} options.iterations
 * @param {Number} options.timeStep
 * @param {Number} options.stiffness
 * @param {Number} options.relaxation
 * @param {Number} options.tolerance
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
     * The error tolerance. If the total error is below this limit, the solver will stop. Set to zero for as good solution as possible.
     * @property tolerance
     * @type {Number}
     */
    this.tolerance = options.tolerance || 0;

    this.debug = options.debug || false;
    this.arrayStep = 30;
    this.lambda = new Utils.ARRAY_TYPE(this.arrayStep);
    this.Bs =     new Utils.ARRAY_TYPE(this.arrayStep);
    this.invCs =  new Utils.ARRAY_TYPE(this.arrayStep);

    /**
     * Whether to use .stiffness and .relaxation parameters from the Solver instead of each Equation individually.
     * @type {Boolean}
     * @property useGlobalEquationParameters
     */
    this.useGlobalEquationParameters = true;

    /**
     * Global equation stiffness. Larger number gives harder contacts, etc, but may also be more expensive to compute, or it will make your simulation explode.
     * @property stiffness
     * @type {Number}
     */
    this.stiffness = 1e6;

    /**
     * Global equation relaxation. This is the number of timesteps required for a constraint to be resolved. Larger number will give softer contacts. Set to around 3 or 4 for good enough results.
     * @property relaxation
     * @type {Number}
     */
    this.relaxation = 4;

    /**
     * Set to true to set all right hand side terms to zero when solving. Can be handy for a few applications.
     * @property useZeroRHS
     * @type {Boolean}
     */
    this.useZeroRHS = false;

    this.useNormalForceForFriction = false;

    /**
     * Number of friction iterations to skip. If .skipFrictionIterations=2, then no FrictionEquations will be iterated until the third iteration.
     * @property skipFrictionIterations
     * @type {Number}
     */
    this.skipFrictionIterations = 0;
};
GSSolver.prototype = new Solver();

function setArrayZero(array){
    for(var i=0; i!==array.length; i++){
        array[i] = 0.0;
    }
}

/**
 * Solve the system of equations
 * @method solve
 * @param  {Number}  h       Time step
 * @param  {World}   world    World to solve
 */
GSSolver.prototype.solve = function(h,world){

    this.sortEquations();

    var iter = 0,
        maxIter = this.iterations,
        skipFrictionIter = this.skipFrictionIterations,
        tolSquared = this.tolerance*this.tolerance,
        equations = this.equations,
        Neq = equations.length,
        bodies = world.bodies,
        Nbodies = world.bodies.length,
        d = this.relaxation,
        k = this.stiffness,
        eps = 4.0 / (h * h * k * (1 + 4 * d)),
        a = 4.0 / (h * (1 + 4 * d)),
        b = (4.0 * d) / (1 + 4 * d),
        useGlobalParams = this.useGlobalEquationParameters,
        add = vec2.add,
        set = vec2.set,
        useZeroRHS = this.useZeroRHS,
        lambda = this.lambda;

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
    if(!useGlobalParams){
        for(var i=0, c; c = equations[i]; i++){
            c.updateSpookParams(h);
            Bs[i] =     c.computeB(c.a,c.b,h);
            invCs[i] =  c.computeInvC(c.eps);
        }
    } else {
        for(var i=0, c; c = equations[i]; i++){
            Bs[i] =     c.computeB(a,b,h);
            invCs[i] =  c.computeInvC(eps);
        }
    }

    var q, B, c, deltalambdaTot,i,j;

    if(Neq !== 0){

        // Reset vlambda
        for(i=0; i!==Nbodies; i++){
            bodies[i].resetConstraintVelocity();
        }

        // Iterate over equations
        for(iter=0; iter!==maxIter; iter++){

            // Accumulate the total error for each iteration.
            deltalambdaTot = 0.0;

            for(j=0; j!==Neq; j++){
                c = equations[j];

                if(c instanceof FrictionEquation && iter < skipFrictionIter)
                    continue;

                var _eps = useGlobalParams ? eps : c.eps;

                var deltalambda = GSSolver.iterateEquation(j,c,_eps,Bs,invCs,lambda,useZeroRHS,h,iter,skipFrictionIter,this.useNormalForceForFriction);
                deltalambdaTot += Math.abs(deltalambda);
            }

            // If the total error is small enough - stop iterate
            if(deltalambdaTot*deltalambdaTot <= tolSquared) break;
        }

        // Add result to velocity
        for(i=0; i!==Nbodies; i++){
            bodies[i].addConstraintVelocity();
        }
    }
};

GSSolver.iterateEquation = function(j,eq,eps,Bs,invCs,lambda,useZeroRHS,dt,iter,skipFrictionIter,useNormal){
    // Compute iteration
    var B = Bs[j],
        invC = invCs[j],
        lambdaj = lambda[j],
        GWlambda = eq.computeGWlambda();

    if(useNormal && eq instanceof FrictionEquation && iter == skipFrictionIter){
        // Rescale the max friction force according to the normal force
        eq.maxForce =  eq.contactEquation.multiplier * eq.frictionCoefficient * dt;
        eq.minForce = -eq.contactEquation.multiplier * eq.frictionCoefficient * dt;
    }

    var maxForce = eq.maxForce,
        minForce = eq.minForce;

    if(useZeroRHS) B = 0;

    var deltalambda = invC * ( B - GWlambda - eps * lambdaj );

    // Clamp if we are not within the min/max interval
    var lambdaj_plus_deltalambda = lambdaj + deltalambda;
    if(lambdaj_plus_deltalambda < minForce*dt){
        deltalambda = minForce*dt - lambdaj;
    } else if(lambdaj_plus_deltalambda > maxForce*dt){
        deltalambda = maxForce*dt - lambdaj;
    }
    lambda[j] += deltalambda;
    eq.multiplier = lambda[j] / dt;
    eq.addToWlambda(deltalambda);

    return deltalambda;
};

},{"../equations/FrictionEquation":25,"../math/vec2":33,"../utils/Utils":50,"./Solver":49}],47:[function(require,module,exports){
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
}


/**
 * Get all unique bodies in this island.
 * @method getBodies
 * @return {Array} An array of Body
 */
Island.prototype.getBodies = function(){
    var bodies = [],
        bodyIds = [],
        eqs = this.equations;
    for(var i=0; i!==eqs.length; i++){
        var eq = eqs[i];
        if(bodyIds.indexOf(eq.bi.id)===-1){
            bodies.push(eq.bi);
            bodyIds.push(eq.bi.id);
        }
        if(bodyIds.indexOf(eq.bj.id)===-1){
            bodies.push(eq.bj);
            bodyIds.push(eq.bj.id);
        }
    }
    return bodies;
};

/**
 * Solves all constraints in the group of islands.
 * @method solve
 * @param  {Number} dt
 * @param  {Solver} solver
 */
Island.prototype.solve = function(dt,solver){
    var bodies = [];

    solver.removeAllEquations();

    // Add equations to solver
    var numEquations = this.equations.length;
    for(var j=0; j!==numEquations; j++){
        solver.addEquation(this.equations[j]);
    }
    var islandBodies = this.getBodies();
    var numBodies = islandBodies.length;
    for(var j=0; j!==numBodies; j++){
        bodies.push(islandBodies[j]);
    }

    // Solve
    solver.solve(dt,{bodies:bodies});
};

},{}],48:[function(require,module,exports){
var Solver = require('./Solver')
,   vec2 = require('../math/vec2')
,   Island = require('../solver/Island')
,   Body = require('../objects/Body')
,   STATIC = Body.STATIC

module.exports = IslandSolver;

/**
 * Splits the system of bodies and equations into independent islands
 *
 * @class IslandSolver
 * @constructor
 * @param {Solver} subsolver
 * @param {Object} options
 * @extends Solver
 */
function IslandSolver(subsolver,options){
    Solver.call(this,options,Solver.ISLAND);
    var that = this;

    /**
     * The solver used in the workers.
     * @property subsolver
     * @type {Solver}
     */
    this.subsolver = subsolver;

    /**
     * Number of islands. Read only.
     * @property numIslands
     * @type {number}
     */
    this.numIslands = 0;

    // Pooling of node objects saves some GC load
    this._nodePool = [];

    this._islandPool = [];

    /**
     * Fires before an island is solved.
     * @event beforeSolveIsland
     * @param {Island} island
     */
    this.beforeSolveIslandEvent = {
        type : "beforeSolveIsland",
        island : null,
    };
};
IslandSolver.prototype = new Solver();

function getUnvisitedNode(nodes){
    var Nnodes = nodes.length;
    for(var i=0; i!==Nnodes; i++){
        var node = nodes[i];
        if(!node.visited && !(node.body.motionState == STATIC)){ // correct?
            return node;
        }
    }
    return false;
}

function visitFunc(node,bds,eqs){
    bds.push(node.body);
    var Neqs = node.eqs.length;
    for(var i=0; i!==Neqs; i++){
        var eq = node.eqs[i];
        if(eqs.indexOf(eq) === -1){
            eqs.push(eq);
        }
    }
}

var queue = [];
function bfs(root,visitFunc,bds,eqs){
    queue.length = 0;
    queue.push(root);
    root.visited = true;
    visitFunc(root,bds,eqs);
    while(queue.length) {
        var node = queue.pop();
        // Loop over unvisited child nodes
        var child;
        while((child = getUnvisitedNode(node.children))) {
            child.visited = true;
            visitFunc(child,bds,eqs);
            queue.push(child);
        }
    }
}

var tmpArray = [],
    tmpArray2 = [],
    tmpArray3 = [],
    tmpArray4 = [];

/**
 * Solves the full system.
 * @method solve
 * @param  {Number} dt
 * @param  {World} world
 */
IslandSolver.prototype.solve = function(dt,world){
    var nodes = tmpArray,
        bodies=world.bodies,
        equations=this.equations,
        Neq=equations.length,
        Nbodies=bodies.length,
        subsolver=this.subsolver,
        workers = this._workers,
        workerData = this._workerData,
        workerIslandGroups = this._workerIslandGroups,
        islandPool = this._islandPool;

    tmpArray.length = 0;

    // Create needed nodes, reuse if possible
    for(var i=0; i!==Nbodies; i++){
        if(this._nodePool.length)
            nodes.push( this._nodePool.pop() );
        else {
            nodes.push({
                body:bodies[i],
                children:[],
                eqs:[],
                visited:false
            });
        }
    }

    // Reset node values
    for(var i=0; i!==Nbodies; i++){
        var node = nodes[i];
        node.body = bodies[i];
        node.children.length = 0;
        node.eqs.length = 0;
        node.visited = false;
    }

    // Add connectivity data. Each equation connects 2 bodies.
    for(var k=0; k!==Neq; k++){
        var eq=equations[k],
            i=bodies.indexOf(eq.bi),
            j=bodies.indexOf(eq.bj),
            ni=nodes[i],
            nj=nodes[j];
        ni.children.push(nj);
        ni.eqs.push(eq);
        nj.children.push(ni);
        nj.eqs.push(eq);
    }

    // The BFS search algorithm needs a traversal function. What we do is gather all bodies and equations connected.
    var child, n=0, eqs=tmpArray2, bds=tmpArray3;
    eqs.length = 0;
    bds.length = 0;

    // Get islands
    var islands = tmpArray4;
    islands.length = 0;
    while((child = getUnvisitedNode(nodes))){
        var island = islandPool.length ? islandPool.pop() : new Island();
        eqs.length = 0;
        bds.length = 0;
        bfs(child,visitFunc,bds,eqs); // run search algo to gather an island of bodies

        // Add equations to island
        var Neqs = eqs.length;
        for(var i=0; i!==Neqs; i++){
            var eq = eqs[i];
            island.equations.push(eq);
        }

        n++;
        islands.push(island);
    }

    this.numIslands = n;

    // Solve islands
    var e = this.beforeSolveIslandEvent;
    for(var i=0; i<islands.length; i++){
        var island = islands[i];
        e.island = island;
        this.emit(e);
        island.solve(dt,this.subsolver);

        // Turn it back to the pool
        island.reset();
        islandPool.push(island);
    }
};

},{"../math/vec2":33,"../objects/Body":34,"../solver/Island":47,"./Solver":49}],49:[function(require,module,exports){
var Utils = require('../utils/Utils')
,   EventEmitter = require('../events/EventEmitter')

module.exports = Solver;

/**
 * Base class for constraint solvers.
 * @class Solver
 * @constructor
 * @extends {EventEmitter}
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
};
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

/**
 * Sort all equations using the .equationSortFunction. Should be called by subclasses before solving.
 * @method sortEquations
 */
Solver.prototype.sortEquations = function(){
    if(this.equationSortFunction)
        this.equations.sort(this.equationSortFunction);
};

/**
 * Add an equation to be solved.
 *
 * @method addEquation
 * @param {Equation} eq
 */
Solver.prototype.addEquation = function(eq){
    if(eq.enabled)
        this.equations.push(eq);
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
        if(eq.enabled)
            this.equations.push(eq);
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
    if(i!=-1)
        this.equations.splice(i,1);
};

/**
 * Remove all currently added equations.
 *
 * @method removeAllEquations
 */
Solver.prototype.removeAllEquations = function(){
    this.equations.length=0;
};

Solver.GS=1;
Solver.ISLAND=2;

},{"../events/EventEmitter":28,"../utils/Utils":50}],50:[function(require,module,exports){
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
        a.push.apply(a, b)
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
    for (var i=index, len=array.length-howmany; i < len; i++)
        array[i] = array[i + howmany];
    array.length = len;
};

/**
 * The array type to use for internal numeric computations.
 * @type {Array}
 * @static
 * @property ARRAY_TYPE
 */
Utils.ARRAY_TYPE = Float32Array || Array;

},{}],51:[function(require,module,exports){
var  GSSolver = require('../solver/GSSolver')
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
,    Spring = require('../objects/Spring')
,    Material = require('../material/Material')
,    ContactMaterial = require('../material/ContactMaterial')
,    DistanceConstraint = require('../constraints/DistanceConstraint')
,    LockConstraint = require('../constraints/LockConstraint')
,    RevoluteConstraint = require('../constraints/RevoluteConstraint')
,    PrismaticConstraint = require('../constraints/PrismaticConstraint')
,    pkg = require('../../package.json')
,    Broadphase = require('../collision/Broadphase')
,    Narrowphase = require('../collision/Narrowphase')
,    Utils = require('../utils/Utils')

module.exports = World;

var currentVersion = pkg.version.split(".").slice(0,2).join("."); // "X.Y"

if(typeof performance === 'undefined')
    performance = {};
if(!performance.now){
    var nowOffset = Date.now();
    if (performance.timing && performance.timing.navigationStart){
      nowOffset = performance.timing.navigationStart
    }
    performance.now = function(){
      return Date.now() - nowOffset;
    }
}

/**
 * The dynamics world, where all bodies and constraints lives.
 *
 * @class World
 * @constructor
 * @param {Object}          [options]
 * @param {Solver}          options.solver          Defaults to GSSolver.
 * @param {Float32Array}    options.gravity         Defaults to [0,-9.78]
 * @param {Broadphase}      options.broadphase      Defaults to NaiveBroadphase
 * @param {Boolean}         options.doProfiling
 * @extends {EventEmitter}
 */
function World(options){
    EventEmitter.apply(this);

    options = options || {};

    /**
     * All springs in the world.
     *
     * @property springs
     * @type {Array}
     */
    this.springs = [];

    /**
     * All bodies in the world.
     *
     * @property bodies
     * @type {Array}
     */
    this.bodies = [];

    /**
     * The solver used to satisfy constraints and contacts.
     *
     * @property solver
     * @type {Solver}
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
     * Gravity in the world. This is applied on all bodies in the beginning of each step().
     *
     * @property
     * @type {Float32Array}
     */
    this.gravity = options.gravity || vec2.fromValues(0, -9.78);

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
     * Friction between colliding bodies. This value is used if no matching ContactMaterial is found for a Material pair.
     * @property defaultFriction
     * @type {Number}
     */
    this.defaultFriction = 0.3;

    /**
     * Default coefficient of restitution between colliding bodies. This value is used if no matching ContactMaterial is found for a Material pair.
     * @property defaultRestitution
     * @type {Number}
     */
    this.defaultRestitution = 0.0;

    this.defaultMaterial = new Material();

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

    this.fixedStepTime = 0.0;

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
     * @event addBody
     * @param {Body} body
     */
    this.addBodyEvent = {
        type : "addBody",
        body : null
    };

    /**
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
     * Enable / disable automatic body sleeping
     * @property allowSleep
     * @type {Boolean}
     */
    this.enableBodySleeping = false;

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
    this.overlappingShapeLookup = { keys:[] };
};
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
    if(idx!==-1)
        Utils.splice(this.contactMaterials,idx,1);
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
            (cm.materialA === materialB) && (cm.materialB === materialA) )
            return cm;
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
    zero = vec2.fromValues(0,0);

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
 */
World.prototype.step = function(dt,timeSinceLastCalled,maxSubSteps){
    maxSubSteps = maxSubSteps || 10;
    timeSinceLastCalled = timeSinceLastCalled || 0;

    if(timeSinceLastCalled == 0){ // Fixed, simple stepping

        this.internalStep(dt);

        // Increment time
        this.time += dt;

    } else {

        var internalSteps = Math.floor( (this.time+timeSinceLastCalled) / dt) - Math.floor(this.time / dt);
        internalSteps = Math.min(internalSteps,maxSubSteps);

        for(var i=0; i<internalSteps; i++){
            this.internalStep(dt);
            /*
            for(var j=0; j!==this.bodies.length; j++){
                // Store state for interpolation
                // Todo
                var b = this.bodies[j];
            }
            */
        }

        // Increment time
        this.time += timeSinceLastCalled;
        this.fixedStepTime += internalSteps * dt;

        // Compute the interpolation data
        var h = this.time - this.fixedStepTime - dt;
        for(var j=0; j!==this.bodies.length; j++){
            // Store interpolated state
            var b = this.bodies[j];
            b.interpolatedPosition[0] = b.position[0] + b.velocity[0]*h;
            b.interpolatedPosition[1] = b.position[1] + b.velocity[1]*h;
        }
    }
};

World.prototype.internalStep = function(dt){
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
        rotate = vec2.rotate;

    this.lastTimeStep = dt;

    if(doProfiling){
        t0 = performance.now();
    }

    var glen = vec2.length(this.gravity);

    // Add gravity to bodies
    if(this.applyGravity){
        for(var i=0; i!==Nbodies; i++){
            var b = bodies[i],
                fi = b.force;
            if(b.motionState != Body.DYNAMIC)
                continue;
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
            if(b.motionState == Body.DYNAMIC)
                b.applyDamping(dt);
        }
    }

    // Broadphase
    var result = broadphase.getCollisionPairs(this);

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

                /*
                var mu = this.defaultFriction,
                    restitution = this.defaultRestitution,
                    surfaceVelocity = 0;
                */

                var cm = this.defaultContactMaterial;
                if(si.material && sj.material){
                    var tmp = this.getContactMaterial(si.material,sj.material);
                    if(tmp){
                        cm = tmp;
                        /*
                        mu = cm.friction;
                        restitution = cm.restitution;
                        surfaceVelocity = cm.surfaceVelocity;
                        */
                    }
                }

                this.runNarrowphase(np,bi,si,xi,ai,bj,sj,xj,aj,cm,glen);
            }
        }
    }

    // Emit shape end overlap events
    var last = this.overlappingShapesLastState;
    for(var i=0; i!==last.keys.length; i++){
        var key = last.keys[i];

        if(last[key]!==true)
            continue;

        if(!this.overlappingShapesCurrentState[key]){
            // Not overlapping in current state, but in last state. Emit event!
            var e = this.endContactEvent;

            // Add shapes to the event object
            e.shapeA = last[key+"_shapeA"];
            e.shapeB = last[key+"_shapeB"];
            e.bodyA = last[key+"_bodyA"];
            e.bodyB = last[key+"_bodyB"];
            this.emit(e);
        }
    }

    // Clear last object
    for(var i=0; i!==last.keys.length; i++)
        delete last[last.keys[i]];
    last.keys.length = 0;

    // Transfer from new object to old
    var current = this.overlappingShapesCurrentState;
    for(var i=0; i!==current.keys.length; i++){
        last[current.keys[i]] = current[current.keys[i]];
        last.keys.push(current.keys[i]);
    }

    // Clear current object
    for(var i=0; i!==current.keys.length; i++)
        delete current[current.keys[i]];
    current.keys.length = 0;

    var preSolveEvent = this.preSolveEvent;
    preSolveEvent.contactEquations = np.contactEquations;
    preSolveEvent.frictionEquations = np.frictionEquations;
    this.emit(preSolveEvent);

    // Add contact equations to solver
    solver.addEquations(np.contactEquations);
    solver.addEquations(np.frictionEquations);

    // Add user-defined constraint equations
    var Nconstraints = constraints.length;
    for(i=0; i!==Nconstraints; i++){
        var c = constraints[i];
        c.update();
        solver.addEquations(c.equations);
    }

    if(this.solveConstraints)
        solver.solve(dt,this);

    solver.removeAllEquations();

    // Step forward
    for(var i=0; i!==Nbodies; i++){
        var body = bodies[i];

        if(body.sleepState !== Body.SLEEPING && body.motionState!=Body.STATIC){
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
    if(this.emitImpactEvent){
        var ev = this.impactEvent;
        for(var i=0; i!==np.contactEquations.length; i++){
            var eq = np.contactEquations[i];
            if(eq.firstImpact){
                ev.bodyA = eq.bi;
                ev.bodyB = eq.bj;
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
            bodies[i].sleepTick(this.time);
        }
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
 */
World.integrateBody = function(body,dt){
    var minv = body.invMass,
        f = body.force,
        pos = body.position,
        velo = body.velocity;

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
World.prototype.runNarrowphase = function(np,bi,si,xi,ai,bj,sj,xj,aj,cm,glen){ /* mu,restitution,surfaceVelocity */

    if(!((si.collisionGroup & sj.collisionMask) !== 0 && (sj.collisionGroup & si.collisionMask) !== 0))
        return;

    /*
    var reducedMass = bi.invMass + bj.invMass;
    if(reducedMass > 0)
        reducedMass = 1/reducedMass;
    */

    // Get world position and angle of each shape
    vec2.rotate(xiw, xi, bi.angle);
    vec2.rotate(xjw, xj, bj.angle);
    vec2.add(xiw, xiw, bi.position);
    vec2.add(xjw, xjw, bj.position);
    var aiw = ai + bi.angle;
    var ajw = aj + bj.angle;

    // Run narrowphase
    np.enableFriction = cm.friction > 0;
    np.frictionCoefficient = cm.friction;
    var reducedMass;
    if(bi.motionState == Body.STATIC || bi.motionState == Body.KINEMATIC)
        reducedMass = bj.mass;
    else if(bj.motionState == Body.STATIC || bj.motionState == Body.KINEMATIC)
        reducedMass = bi.mass;
    else
        reducedMass = (bi.mass*bj.mass)/(bi.mass+bj.mass);
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
        if (si.type < sj.type) {
            numContacts = resolver.call(np, bi,si,xiw,aiw, bj,sj,xjw,ajw, sensor);
        } else {
            numContacts = resolver.call(np, bj,sj,xjw,ajw, bi,si,xiw,aiw, sensor);
        }

        if(numContacts){
            var key = si.id < sj.id ? si.id+" "+ sj.id : sj.id+" "+ si.id;
            if(!this.overlappingShapesLastState[key]){

                // Report new shape overlap
                var e = this.beginContactEvent;
                e.shapeA = si;
                e.shapeB = sj;
                e.bodyA = bi;
                e.bodyB = bj;

                if(typeof(numContacts)=="number"){
                    // Add contacts to the event object
                    e.contactEquations.length = 0;
                    for(var i=np.contactEquations.length-numContacts; i<np.contactEquations.length; i++)
                        e.contactEquations.push(np.contactEquations[i]);
                }

                this.emit(e);
            }

            // Store current contact state
            var current = this.overlappingShapesCurrentState;
            if(!current[key]){

                current[key] = true;
                current.keys.push(key);

                // Also store shape & body data
                current[key+"_shapeA"] = si;
                current.keys.push(key+"_shapeA");
                current[key+"_shapeB"] = sj;
                current.keys.push(key+"_shapeB");
                current[key+"_bodyA"] = bi;
                current.keys.push(key+"_bodyA");
                current[key+"_bodyB"] = bj;
                current.keys.push(key+"_bodyB");
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
    if(idx===-1)
        Utils.splice(this.springs,idx,1);
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
 *
 */
World.prototype.addBody = function(body){
    if(body.world)
        throw new Error("This body is already added to a World.");

    this.bodies.push(body);
    body.world = this;
    this.addBodyEvent.body = body;
    this.emit(this.addBodyEvent);
};

/**
 * Remove a body from the simulation
 *
 * @method removeBody
 * @param {Body} body
 */
World.prototype.removeBody = function(body){
    if(body.world !== this)
        throw new Error("The body was never added to this World, cannot remove it.");

    body.world = null;
    var idx = this.bodies.indexOf(body);
    if(idx!==-1){
        Utils.splice(this.bodies,idx,1);
        this.removeBodyEvent.body = body;
        body.resetConstraintVelocity();
        this.emit(this.removeBodyEvent);
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
        if(b.id === id)
            return b;
    }
    return false;
};

/**
 * Convert the world to a JSON-serializable Object.
 *
 * @method toJSON
 * @return {Object}
 * @deprecated Should use Serializer instead.
 */
World.prototype.toJSON = function(){
    var json = {
        p2 : currentVersion,
        bodies : [],
        springs : [],
        solver : {},
        gravity : v2a(this.gravity),
        broadphase : {},
        constraints : [],
        contactMaterials : [],
    };

    // Serialize springs
    for(var i=0; i!==this.springs.length; i++){
        var s = this.springs[i];
        json.springs.push({
            bodyA : this.bodies.indexOf(s.bodyA),
            bodyB : this.bodies.indexOf(s.bodyB),
            stiffness : s.stiffness,
            damping : s.damping,
            restLength : s.restLength,
            localAnchorA : v2a(s.localAnchorA),
            localAnchorB : v2a(s.localAnchorB),
        });
    }

    // Serialize constraints
    for(var i=0; i<this.constraints.length; i++){
        var c = this.constraints[i];
        var jc = {
            bodyA : this.bodies.indexOf(c.bodyA),
            bodyB : this.bodies.indexOf(c.bodyB),
        }
        if(c instanceof DistanceConstraint){
            jc.type = "DistanceConstraint";
            jc.distance = c.distance;
            jc.maxForce = c.getMaxForce();
        } else if(c instanceof RevoluteConstraint){
            jc.type = "RevoluteConstraint";
            jc.pivotA = v2a(c.pivotA);
            jc.pivotB = v2a(c.pivotB);
            jc.maxForce = c.maxForce;
            jc.motorSpeed = c.getMotorSpeed(); // False if motor is disabled, otherwise number.
            jc.lowerLimit = c.lowerLimit;
            jc.lowerLimitEnabled = c.lowerLimitEnabled;
            jc.upperLimit = c.upperLimit;
            jc.upperLimitEnabled = c.upperLimitEnabled;
        } else if(c instanceof PrismaticConstraint){
            jc.type = "PrismaticConstraint";
            jc.localAxisA = v2a(c.localAxisA);
            jc.localAnchorA = v2a(c.localAnchorA);
            jc.localAnchorB = v2a(c.localAnchorB);
            jc.maxForce = c.maxForce;
        } else if(c instanceof LockConstraint){
            jc.type = "LockConstraint";
            jc.localOffsetB = v2a(c.localOffsetB);
            jc.localAngleB = c.localAngleB;
            jc.maxForce = c.maxForce;
        } else {
            console.error("Constraint not supported yet!");
            continue;
        }

        json.constraints.push(jc);
    }

    // Serialize bodies
    for(var i=0; i!==this.bodies.length; i++){
        var b = this.bodies[i],
            ss = b.shapes,
            jsonShapes = [];

        for(var j=0; j<ss.length; j++){
            var s = ss[j],
                jsonShape;

            // Check type
            if(s instanceof Circle){
                jsonShape = {
                    type : "Circle",
                    radius : s.radius,
                };
            } else if(s instanceof Plane){
                jsonShape = { type : "Plane", };
            } else if(s instanceof Particle){
                jsonShape = { type : "Particle", };
            } else if(s instanceof Line){
                jsonShape = {   type : "Line",
                                length : s.length };
            } else if(s instanceof Rectangle){
                jsonShape = {   type : "Rectangle",
                                width : s.width,
                                height : s.height };
            } else if(s instanceof Convex){
                var verts = [];
                for(var k=0; k<s.vertices.length; k++)
                    verts.push(v2a(s.vertices[k]));
                jsonShape = {   type : "Convex",
                                verts : verts };
            } else if(s instanceof Capsule){
                jsonShape = {   type : "Capsule",
                                length : s.length,
                                radius : s.radius };
            } else {
                throw new Error("Shape type not supported yet!");
            }

            jsonShape.offset = v2a(b.shapeOffsets[j]);
            jsonShape.angle = b.shapeAngles[j];
            jsonShape.collisionGroup = s.collisionGroup;
            jsonShape.collisionMask = s.collisionMask;
            jsonShape.material = s.material && {
                id : s.material.id,
            };

            jsonShapes.push(jsonShape);
        }

        json.bodies.push({
            id : b.id,
            mass : b.mass,
            angle : b.angle,
            position : v2a(b.position),
            velocity : v2a(b.velocity),
            angularVelocity : b.angularVelocity,
            force : v2a(b.force),
            shapes : jsonShapes,
            concavePath : b.concavePath,
        });
    }

    // Serialize contactmaterials
    for(var i=0; i<this.contactMaterials.length; i++){
        var cm = this.contactMaterials[i];
        json.contactMaterials.push({
            id : cm.id,
            materialA :             cm.materialA.id, // Note: Reference by id!
            materialB :             cm.materialB.id,
            friction :              cm.friction,
            restitution :           cm.restitution,
            stiffness :             cm.stiffness,
            relaxation :            cm.relaxation,
            frictionStiffness :     cm.frictionStiffness,
            frictionRelaxation :    cm.frictionRelaxation,
        });
    }

    return json;

    function v2a(v){
        if(!v) return v;
        return [v[0],v[1]];
    }
};

/**
 * Upgrades a JSON object to current version
 * @method upgradeJSON
 * @param  {Object} json
 * @return {Object|Boolean} New json object, or false on failure.
 */
World.upgradeJSON = function(json){
    if(!json || !json.p2)
        return false;

    // Clone the json object
    json = JSON.parse(JSON.stringify(json));

    // Check version
    switch(json.p2){

        case currentVersion:
            // We are at latest json version
            return json;

        case "0.3":
            // Changes:
            // - Started caring about versioning

            // - Added LockConstraint type
            // Can't do much about that now though. Ignore.

            // Changed PrismaticConstraint arguments...
            for(var i=0; i<json.constraints.length; i++){
                var jc = json.constraints[i];
                if(jc.type=="PrismaticConstraint"){

                    // ...from these...
                    delete jc.localAxisA;
                    delete jc.localAxisB;

                    // ...to these. We cant make up anything good here, just do something
                    jc.localAxisA = [1,0];
                    jc.localAnchorA = [0,0];
                    jc.localAnchorB = [0,0];
                }
            }

            // Upgrade version number
            json.p2 = "0.4";
            break;
    }

    return World.upgradeJSON(json);
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
    json = World.upgradeJSON(json);

    // Upgrade failed.
    if(!json) return false;

    if(!json.p2)
        return false;

    // Set gravity
    vec2.copy(this.gravity, json.gravity);

    var bodies = this.bodies;

    // Load bodies
    var id2material = {};
    for(var i=0; i!==json.bodies.length; i++){
        var jb = json.bodies[i],
            jss = jb.shapes;

        var b = new Body({
            mass :              jb.mass,
            position :          jb.position,
            angle :             jb.angle,
            velocity :          jb.velocity,
            angularVelocity :   jb.angularVelocity,
            force :             jb.force,
        });
        b.id = jb.id;

        for(var j=0; j<jss.length; j++){
            var shape, js=jss[j];

            switch(js.type){
                case "Circle":      shape = new Circle(js.radius);              break;
                case "Plane":       shape = new Plane();                        break;
                case "Particle":    shape = new Particle();                     break;
                case "Line":        shape = new Line(js.length);                break;
                case "Rectangle":   shape = new Rectangle(js.width,js.height);  break;
                case "Convex":      shape = new Convex(js.verts);               break;
                case "Capsule":     shape = new Capsule(js.length, js.radius);  break;
                default:
                    throw new Error("Shape type not supported: "+js.type);
                    break;
            }
            shape.collisionMask = js.collisionMask;
            shape.collisionGroup = js.collisionGroup;
            shape.material = js.material;
            if(shape.material){
                shape.material = new Material();
                shape.material.id = js.material.id;
                id2material[shape.material.id+""] = shape.material;
            }
            b.addShape(shape,js.offset,js.angle);
        }

        if(jb.concavePath)
            b.concavePath = jb.concavePath;

        this.addBody(b);
    }

    // Load springs
    for(var i=0; i<json.springs.length; i++){
        var js = json.springs[i];
        var s = new Spring(bodies[js.bodyA], bodies[js.bodyB], {
            stiffness : js.stiffness,
            damping : js.damping,
            restLength : js.restLength,
            localAnchorA : js.localAnchorA,
            localAnchorB : js.localAnchorB,
        });
        this.addSpring(s);
    }

    // Load contact materials
    for(var i=0; i<json.contactMaterials.length; i++){
        var jm = json.contactMaterials[i];
        var cm = new ContactMaterial(id2material[jm.materialA+""], id2material[jm.materialB+""], {
            friction :              jm.friction,
            restitution :           jm.restitution,
            stiffness :             jm.stiffness,
            relaxation :            jm.relaxation,
            frictionStiffness :     jm.frictionStiffness,
            frictionRelaxation :    jm.frictionRelaxation,
        });
        cm.id = jm.id;
        this.addContactMaterial(cm);
    }

    // Load constraints
    for(var i=0; i<json.constraints.length; i++){
        var jc = json.constraints[i],
            c;
        switch(jc.type){
            case "DistanceConstraint":
                c = new DistanceConstraint(bodies[jc.bodyA], bodies[jc.bodyB], jc.distance, jc.maxForce);
                break;
            case "RevoluteConstraint":
                c = new RevoluteConstraint(bodies[jc.bodyA], jc.pivotA, bodies[jc.bodyB], jc.pivotB, jc.maxForce);
                if(jc.motorSpeed){
                    c.enableMotor();
                    c.setMotorSpeed(jc.motorSpeed);
                }
                c.lowerLimit = jc.lowerLimit || 0;
                c.upperLimit = jc.upperLimit || 0;
                c.lowerLimitEnabled = jc.lowerLimitEnabled || false;
                c.upperLimitEnabled = jc.upperLimitEnabled || false;
                break;
            case "PrismaticConstraint":
                c = new PrismaticConstraint(bodies[jc.bodyA], bodies[jc.bodyB], {
                    maxForce : jc.maxForce,
                    localAxisA : jc.localAxisA,
                    localAnchorA : jc.localAnchorA,
                    localAnchorB : jc.localAnchorB,
                });
                break;
            case "LockConstraint":
                c = new LockConstraint(bodies[jc.bodyA], bodies[jc.bodyB], {
                    maxForce :     jc.maxForce,
                    localOffsetB : jc.localOffsetB,
                    localAngleB :  jc.localAngleB,
                });
                break;
            default:
                throw new Error("Constraint type not recognized: "+jc.type);
        }
        this.addConstraint(c);
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

    // Remove all solver equations
    if(this.solver && this.solver.equations.length)
        this.solver.removeAllEquations();

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

},{"../../package.json":8,"../collision/Broadphase":10,"../collision/NaiveBroadphase":12,"../collision/Narrowphase":13,"../constraints/DistanceConstraint":17,"../constraints/LockConstraint":19,"../constraints/PrismaticConstraint":20,"../constraints/RevoluteConstraint":21,"../events/EventEmitter":28,"../material/ContactMaterial":29,"../material/Material":30,"../math/vec2":33,"../objects/Body":34,"../objects/Spring":35,"../shapes/Capsule":37,"../shapes/Circle":38,"../shapes/Convex":39,"../shapes/Line":41,"../shapes/Particle":42,"../shapes/Plane":43,"../shapes/Rectangle":44,"../solver/GSSolver":46,"../utils/Utils":50}]},{},[36])
(36)
});
;
